import { useEffect, useMemo, useRef, useState } from "react";

type GlyphPoint = {
  x: number;
  y: number;
};

type GlyphParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  symbol: string;
  trail: number;
  columnSpeed: number;
  drift: number;
  phase: number;
  assigned: boolean;
  homeX?: number;
  homeY?: number;
};

type Phase = "boot" | "forming" | "ready";

type EnterState = "idle" | "collapsing" | "complete";

type LayoutData = {
  points: GlyphPoint[];
  bounds: { x: number; y: number; width: number; height: number };
  fontSize: number;
};

type UiMotion = {
  buttonLift: number;
  contourSweep: number;
  wordScale: number;
};

type Props = {
  onEnterComplete?: () => void;
};

const GLYPHS = "FOURWALLS0123456789アイウエオカキクケコサシスセソタチツテトᚠᚢᚦᚨ◬◭△▽◈◉⌘✦✧⟁⟡⟢⟣⟠⧫⟪⟫╳╬";
const PRELOADER_DURATION = 9800;
const FORM_START = 0.5;
const READY_START = 0.9;
const WORD_SETTLE_DELAY = 2000;
const WORD_SHRINK_END = 3400;
const BUTTON_LIFT_START = 3000;
const BUTTON_LIFT_END = 5600;
const BUTTON_GLOW_START = 4200;
const BUTTON_GLOW_END = 6200;
const ENTER_COLLAPSE_DURATION = 2400;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp((value - edge0) / Math.max(0.0001, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "0";
}

function getScaledBounds(layout: LayoutData, scale: number) {
  const cx = layout.bounds.x + layout.bounds.width / 2;
  const cy = layout.bounds.y + layout.bounds.height / 2;
  const width = layout.bounds.width * scale;
  const height = layout.bounds.height * scale;
  return {
    x: cx - width / 2,
    y: cy - height / 2,
    width,
    height,
  };
}

function getScaledTarget(homeX: number, homeY: number, bounds: LayoutData["bounds"], scale: number) {
  const cx = bounds.x + bounds.width / 2;
  const cy = bounds.y + bounds.height / 2;
  return {
    x: cx + (homeX - cx) * scale,
    y: cy + (homeY - cy) * scale,
  };
}

function getEllipseContourPoint(progress: number) {
  const angle = -Math.PI / 2 + Math.PI * 2 * clamp(progress, 0, 1);
  return {
    x: 50 + Math.cos(angle) * 46,
    y: 22 + Math.sin(angle) * 18,
  };
}

function buildTextLayout(width: number, height: number, text: string): LayoutData {
  const offscreen = document.createElement("canvas");
  const offCtx = offscreen.getContext("2d");
  if (!offCtx) {
    return {
      points: [],
      bounds: { x: width * 0.2, y: height * 0.42, width: width * 0.6, height: height * 0.12 },
      fontSize: 78,
    };
  }

  offscreen.width = Math.max(1, Math.floor(width));
  offscreen.height = Math.max(1, Math.floor(height));

  const fontSize = clamp(Math.floor(width * 0.063), 52, 120);
  offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
  offCtx.fillStyle = "#ffffff";
  offCtx.textAlign = "center";
  offCtx.textBaseline = "middle";
  offCtx.font = `900 ${fontSize}px Inter, ui-sans-serif, system-ui, sans-serif`;
  offCtx.fillText(text, offscreen.width * 0.5, offscreen.height * 0.52);

  const image = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
  const step = Math.max(6, Math.floor(fontSize / 18));
  const points: GlyphPoint[] = [];
  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;

  for (let y = 0; y < image.height; y += step) {
    for (let x = 0; x < image.width; x += step) {
      const alpha = image.data[(y * image.width + x) * 4 + 3];
      if (alpha > 140) {
        const px = x + (Math.random() - 0.5) * step * 0.45;
        const py = y + (Math.random() - 0.5) * step * 0.45;
        points.push({ x: px, y: py });
        minX = Math.min(minX, px);
        maxX = Math.max(maxX, px);
        minY = Math.min(minY, py);
        maxY = Math.max(maxY, py);
      }
    }
  }

  return {
    points,
    bounds: {
      x: minX,
      y: minY,
      width: Math.max(0, maxX - minX),
      height: Math.max(0, maxY - minY),
    },
    fontSize,
  };
}

function buildParticles(width: number, height: number, layout: LayoutData): GlyphParticle[] {
  const assignedCount = layout.points.length;
  const totalCount = Math.max(assignedCount + 220, 540);
  const particles: GlyphParticle[] = [];

  for (let i = 0; i < totalCount; i += 1) {
    const assigned = i < assignedCount;
    const point = assigned ? layout.points[i] : undefined;
    const columnCount = Math.max(18, Math.floor(width / 24));
    const column = (i % columnCount) / columnCount;

    particles.push({
      x: assigned ? point!.x + (Math.random() - 0.5) * 120 : column * width + (Math.random() - 0.5) * 18,
      y: -Math.random() * height - Math.random() * height * 0.6,
      vx: 0,
      vy: 1.2 + Math.random() * 2.8,
      size: 12 + Math.random() * 10,
      alpha: 0.34 + Math.random() * 0.42,
      symbol: randomGlyph(),
      trail: 34 + Math.random() * 70,
      columnSpeed: 1.2 + Math.random() * 2.6,
      drift: (Math.random() - 0.5) * 0.4,
      phase: Math.random() * Math.PI * 2,
      assigned,
      homeX: point?.x,
      homeY: point?.y,
    });
  }

  return particles;
}

function drawBackdrop(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  phaseProgress: number,
  readyProgress: number,
  layout: LayoutData,
  wordScale: number,
  collapseProgress: number,
) {
  const background = ctx.createLinearGradient(0, 0, 0, height);
  background.addColorStop(0, "#020403");
  background.addColorStop(0.32, "#040906");
  background.addColorStop(0.7, "#010201");
  background.addColorStop(1, "#000000");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(
    width * 0.5,
    height * 0.46,
    width * 0.06,
    width * 0.5,
    height * 0.5,
    width * 0.72,
  );
  glow.addColorStop(0, `rgba(84,255,170,${(0.08 + readyProgress * 0.05) * (1 - collapseProgress * 0.7)})`);
  glow.addColorStop(0.4, `rgba(26,188,110,${(0.04 + phaseProgress * 0.02) * (1 - collapseProgress * 0.8)})`);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  if (readyProgress > 0.05 && layout.bounds.width > 0) {
    const scaledBounds = getScaledBounds(layout, wordScale);
    const frameGlow = ctx.createLinearGradient(
      scaledBounds.x,
      scaledBounds.y,
      scaledBounds.x + scaledBounds.width,
      scaledBounds.y + scaledBounds.height,
    );
    frameGlow.addColorStop(0, `rgba(180,255,220,${(0.02 + readyProgress * 0.04) * (1 - collapseProgress)})`);
    frameGlow.addColorStop(0.45, `rgba(56,255,146,${(0.03 + readyProgress * 0.06) * (1 - collapseProgress)})`);
    frameGlow.addColorStop(1, `rgba(160,255,210,${(0.01 + readyProgress * 0.03) * (1 - collapseProgress)})`);
    ctx.strokeStyle = frameGlow;
    ctx.lineWidth = 1;
    ctx.strokeRect(
      scaledBounds.x - 12,
      scaledBounds.y - 10,
      scaledBounds.width + 24,
      scaledBounds.height + 20,
    );
  }

  if (collapseProgress > 0.001) {
    const cx = width * 0.5;
    const cy = height * 0.5;
    const vortex = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.34);
    vortex.addColorStop(0, `rgba(0,0,0,${0.22 + collapseProgress * 0.56})`);
    vortex.addColorStop(0.44, `rgba(0,0,0,${0.08 + collapseProgress * 0.32})`);
    vortex.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = vortex;
    ctx.fillRect(0, 0, width, height);

    const shutdown = smoothstep(0.56, 1, collapseProgress);
    if (shutdown > 0.001) {
      const bandHeight = lerp(height, 2, shutdown);
      const top = cy - bandHeight / 2;
      ctx.fillStyle = `rgba(0,0,0,${shutdown * 0.96})`;
      ctx.fillRect(0, 0, width, top);
      ctx.fillRect(0, top + bandHeight, width, height - top - bandHeight);

      ctx.fillStyle = `rgba(180,255,210,${0.12 * (1 - shutdown)})`;
      ctx.fillRect(0, cy - 1, width, 2);
    }
  }
}

export default function BrenychGlyphPreloaderPreview({ onEnterComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<GlyphParticle[]>([]);
  const layoutRef = useRef<LayoutData>({
    points: [],
    bounds: { x: 0, y: 0, width: 0, height: 0 },
    fontSize: 100,
  });
  const animationRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const enterStartRef = useRef<number | null>(null);
  const uiMotionRef = useRef<UiMotion>({ buttonLift: 0, contourSweep: 0, wordScale: 1 });
  const [phase, setPhase] = useState<Phase>("boot");
  const [enterState, setEnterState] = useState<EnterState>("idle");
  const [uiMotion, setUiMotion] = useState<UiMotion>({ buttonLift: 0, contourSweep: 0, wordScale: 1 });

  const text = useMemo(() => "FOUR WALLS", []);
  const contourDot = useMemo(() => getEllipseContourPoint(uiMotion.contourSweep), [uiMotion.contourSweep]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let mounted = true;
    let didComplete = false;

    const setup = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      layoutRef.current = buildTextLayout(width, height, text);
      particlesRef.current = buildParticles(width, height, layoutRef.current);
      startRef.current = null;
      enterStartRef.current = null;
      uiMotionRef.current = { buttonLift: 0, contourSweep: 0, wordScale: 1 };
      setUiMotion({ buttonLift: 0, contourSweep: 0, wordScale: 1 });
      setPhase("boot");
      setEnterState("idle");
      didComplete = false;
    };

    const draw = (timestamp: number) => {
      if (!mounted) return;
      if (startRef.current === null) startRef.current = timestamp;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const elapsed = timestamp - startRef.current;
      const progress = clamp(elapsed / PRELOADER_DURATION, 0, 1);
      const formProgress = smoothstep(FORM_START, READY_START, progress);
      const readyProgress = smoothstep(READY_START, 1, progress);
      const postReadyElapsed = Math.max(0, elapsed - PRELOADER_DURATION);
      const shrinkProgress = smoothstep(WORD_SETTLE_DELAY, WORD_SHRINK_END, postReadyElapsed);
      const buttonLiftProgress = smoothstep(BUTTON_LIFT_START, BUTTON_LIFT_END, postReadyElapsed);
      const contourSweep = smoothstep(BUTTON_GLOW_START, BUTTON_GLOW_END, postReadyElapsed);
      const wordScale = lerp(1, 0.65, shrinkProgress);

      const collapseProgress =
        enterStartRef.current === null ? 0 : smoothstep(0, ENTER_COLLAPSE_DURATION, timestamp - enterStartRef.current);

      const nextPhase: Phase = progress < FORM_START ? "boot" : progress < READY_START ? "forming" : "ready";
      setPhase((prev) => (prev === nextPhase ? prev : nextPhase));

      const prevMotion = uiMotionRef.current;
      const nextMotion = { buttonLift: buttonLiftProgress, contourSweep, wordScale };
      if (
        Math.abs(prevMotion.buttonLift - nextMotion.buttonLift) > 0.004 ||
        Math.abs(prevMotion.contourSweep - nextMotion.contourSweep) > 0.004 ||
        Math.abs(prevMotion.wordScale - nextMotion.wordScale) > 0.004
      ) {
        uiMotionRef.current = nextMotion;
        setUiMotion(nextMotion);
      }

      drawBackdrop(
        ctx,
        width,
        height,
        formProgress,
        readyProgress,
        layoutRef.current,
        wordScale,
        collapseProgress,
      );

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const cx = width * 0.5;
      const cy = height * 0.5;

      for (const particle of particlesRef.current) {
        if (particle.assigned && particle.homeX !== undefined && particle.homeY !== undefined) {
          if (formProgress < 0.08) {
            particle.y += particle.columnSpeed * 2.3 + Math.sin(timestamp * 0.0012 + particle.phase) * 0.14;
            particle.x += particle.drift * 0.6;
          } else {
            const target = getScaledTarget(particle.homeX, particle.homeY, layoutRef.current.bounds, wordScale);
            particle.vx = lerp(particle.vx, (target.x - particle.x) * (0.045 + formProgress * 0.04), 0.14);
            particle.vy = lerp(particle.vy, (target.y - particle.y) * (0.05 + formProgress * 0.04), 0.14);
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.x += Math.sin(timestamp * 0.00082 + particle.phase) * readyProgress * 0.04;
            particle.y += Math.cos(timestamp * 0.0009 + particle.phase) * readyProgress * 0.04;
          }
        } else {
          particle.y += particle.columnSpeed * (2.25 - readyProgress * 0.9);
          particle.x += particle.drift + Math.sin(timestamp * 0.0012 + particle.phase) * 0.18;
        }

        if (particle.y > height + 50) {
          particle.y = -40 - Math.random() * height * 0.4;
          particle.x = Math.random() * width;
          particle.symbol = randomGlyph();
        }

        if (particle.x < -40) particle.x = width + 20;
        if (particle.x > width + 40) particle.x = -20;

        const glyphShuffle = particle.assigned ? 1 - formProgress * 0.8 : 1 - readyProgress * 0.2;
        if (Math.random() < 0.06 * glyphShuffle) particle.symbol = randomGlyph();

        const assignedScale = particle.assigned ? lerp(1, 0.72, shrinkProgress) : 1;
        const drawSize = particle.size * assignedScale;
        const trailAlphaBase = particle.assigned
          ? (0.08 + (1 - formProgress) * 0.2) * particle.alpha * lerp(1, 0.72, shrinkProgress)
          : (0.12 + (1 - readyProgress) * 0.18) * particle.alpha;

        const dx = particle.x - cx;
        const dy = particle.y - cy;
        const radius = Math.hypot(dx, dy);
        const swirlAngle = Math.atan2(dy, dx) + collapseProgress * 1.9;
        const collapsedRadius = radius * (1 - collapseProgress * 0.96);
        const displayX = enterStartRef.current === null ? particle.x : cx + Math.cos(swirlAngle) * collapsedRadius;
        const displayY = enterStartRef.current === null ? particle.y : cy + Math.sin(swirlAngle) * collapsedRadius * (1 - collapseProgress * 0.35);
        const alphaMultiplier = 1 - collapseProgress * 0.92;

        ctx.strokeStyle = `rgba(86, 255, 176, ${trailAlphaBase * alphaMultiplier})`;
        ctx.lineWidth = particle.assigned ? 0.7 : 0.9;
        ctx.beginPath();
        ctx.moveTo(displayX, displayY - particle.trail * (particle.assigned ? 0.24 : 1) * alphaMultiplier);
        ctx.lineTo(displayX, displayY + drawSize * 0.3 * alphaMultiplier);
        ctx.stroke();

        ctx.shadowBlur = particle.assigned ? 14 + readyProgress * 8 : 10;
        ctx.shadowColor = particle.assigned
          ? `rgba(156, 255, 210, ${(0.12 + readyProgress * 0.12) * alphaMultiplier})`
          : `rgba(60, 255, 150, ${0.16 * alphaMultiplier})`;
        ctx.fillStyle = particle.assigned
          ? `rgba(236,255,244,${(0.7 + readyProgress * 0.18) * alphaMultiplier})`
          : `rgba(112,255,182,${(0.32 + particle.alpha * 0.4) * alphaMultiplier})`;
        ctx.font = `${drawSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx.fillText(particle.symbol, displayX, displayY);
      }

      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(210, 255, 228, ${0.38 * (1 - collapseProgress)})`;
      ctx.font = "11px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "left";
      ctx.fillText("Brenych Studio / Glyph Rain Loader", 28, 34);

      if (enterStartRef.current !== null && collapseProgress >= 0.999 && !didComplete) {
        didComplete = true;
        setEnterState("complete");
        onEnterComplete?.();
      }

      animationRef.current = window.requestAnimationFrame(draw);
    };

    setup();
    window.addEventListener("resize", setup);
    animationRef.current = window.requestAnimationFrame(draw);

    return () => {
      mounted = false;
      window.removeEventListener("resize", setup);
      if (animationRef.current) window.cancelAnimationFrame(animationRef.current);
    };
  }, [text, onEnterComplete]);

  const phaseLabel = enterState === "collapsing" ? "enter" : phase;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(36,255,146,0.06),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0)_20%,rgba(0,0,0,0.42)_100%)]" />

      {enterState === "complete" && !onEnterComplete ? <div className="absolute inset-0 z-30 bg-black" /> : null}

      <div className="relative z-10 flex min-h-screen flex-col justify-between p-8 lg:p-10">
        <div className="flex items-start justify-between gap-6">
          <div className="rounded-full border border-[rgba(116,255,188,0.16)] bg-[rgba(4,14,8,0.44)] px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-[rgba(190,255,220,0.68)] backdrop-blur-md">
            PRELOADER / GLYPH RAIN
          </div>
          <div className="text-right text-[11px] uppercase tracking-[0.32em] text-[rgba(162,255,206,0.44)]">
            PHASE: {phaseLabel}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="pointer-events-auto"
            style={{
              transform: `translateY(${lerp(210, 154, uiMotion.buttonLift)}px)`,
              transition: "transform 1100ms cubic-bezier(.22,1,.36,1), opacity 1600ms ease",
            }}
          >
            <button
              type="button"
              onClick={() => {
                if (enterState !== "idle") return;
                enterStartRef.current = performance.now();
                setEnterState("collapsing");
              }}
              className={`relative overflow-hidden rounded-full border border-[rgba(134,255,198,0.22)] bg-[rgba(8,18,12,0.58)] px-8 py-4 text-[12px] uppercase tracking-[0.38em] text-[rgba(234,255,244,0.92)] shadow-[0_0_40px_rgba(88,255,176,0.12)] backdrop-blur-md ${
                phase === "ready"
                  ? "translate-y-0 opacity-100 duration-[1800ms] ease-[cubic-bezier(.22,1,.36,1)]"
                  : "pointer-events-none translate-y-4 opacity-0 duration-[1800ms] ease-[cubic-bezier(.22,1,.36,1)]"
              }`}
            >
              <span className="relative z-10">ENTER</span>
              <span className="pointer-events-none absolute inset-0">
                <svg viewBox="0 0 100 44" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <filter id="enterGlowBlur">
                      <feGaussianBlur stdDeviation="2.4" />
                    </filter>
                  </defs>
                  <rect
                    x="1.5"
                    y="1.5"
                    width="97"
                    height="41"
                    rx="20.5"
                    fill="none"
                    stroke={`rgba(210,255,232,${uiMotion.contourSweep * 0.22})`}
                    strokeWidth="1.1"
                    strokeDasharray="26 240"
                    strokeDashoffset={240 - uiMotion.contourSweep * 248}
                    filter="url(#enterGlowBlur)"
                  />
                  <circle
                    cx={contourDot.x}
                    cy={contourDot.y}
                    r="2.4"
                    fill={`rgba(242,255,248,${uiMotion.contourSweep * 0.9})`}
                    filter="url(#enterGlowBlur)"
                  />
                  <circle
                    cx={contourDot.x}
                    cy={contourDot.y}
                    r="1.3"
                    fill={`rgba(208,255,230,${uiMotion.contourSweep})`}
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
