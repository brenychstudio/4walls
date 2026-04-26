import { useCallback, useEffect, useRef, useState } from "react";

import { ACT2_INTRO_BODY_PART_2 } from "../storyMedia";
import { DOOR_ACT04_MEDIA } from "../act04Media";
import type { Act04RouteData } from "../actProgression";

type Step = "terminal" | "bread" | "eat" | "corridor" | "choices";

type Props = {
  route: Act04RouteData;
  onChoose: (id: string) => void;
  onBack: () => void;
};

type TerminalLine =
  | {
      type: "normal";
      text: string;
    }
  | {
      type: "mistyped";
      wrong: string;
      final: string;
    };

const TERMINAL_SOURCE_SENTENCES = ACT2_INTRO_BODY_PART_2.split(/\.\s+/u)
  .map((item) => item.trim())
  .filter(Boolean)
  .map((item) => (item.endsWith(".") ? item : `${item}.`).toUpperCase());

const TERMINAL_LINES: TerminalLine[] = [
  {
    type: "normal",
    text: TERMINAL_SOURCE_SENTENCES[0] ?? "ПОВІТРЯ В КІМНАТІ ВЖЕ НЕ ЗДАЄТЬСЯ НЕРУХОМИМ.",
  },
  {
    type: "normal",
    text: TERMINAL_SOURCE_SENTENCES[1] ?? "ВОНО НІБИ СЛУХАЄ.",
  },
  {
    type: "mistyped",
    wrong:
      "КОЖЕН ДРІБНИЙ ЗВУК НАБУВАЄ ІНШОЇ ВАГИ, А ТИША МІЖ НИМИ ПОЧИНАЄ ТИСНУТИ СИЛЬНІШЕ, НІЖ САМ ШУММ.",
    final:
      TERMINAL_SOURCE_SENTENCES[2] ??
      "КОЖЕН ДРІБНИЙ ЗВУК НАБУВАЄ ІНШОЇ ВАГИ, А ТИША МІЖ НИМИ ПОЧИНАЄ ТИСНУТИ СИЛЬНІШЕ, НІЖ САМ ШУМ.",
  },
  {
    type: "normal",
    text:
      TERMINAL_SOURCE_SENTENCES[3] ??
      "ПРОСТІР ПОВОДИТЬСЯ ТАК, НІБИ ЧЕКАЄ НА ЖЕСТ, ЯКИЙ ЩОСЬ ВІДКРИЄ.",
  },
  {
    type: "normal",
    text: "ДАЛЕКІ СИРЕНИ ВРОСТАЮТЬ У ПРОСТІР.",
  },
  {
    type: "normal",
    text: "ДЗВІНОК БІЛЬШЕ НЕ НАЛЕЖИТЬ ТЕЛЕФОНУ.",
  },
];

export default function DoorAct04Scene({ route, onChoose, onBack }: Props) {
  const [step, setStep] = useState<Step>("terminal");
  const [terminalDisplay, setTerminalDisplay] = useState("");
  const [terminalPhase, setTerminalPhase] = useState<"typing" | "hold" | "fade">("typing");

  const breadRef = useRef<HTMLVideoElement | null>(null);
  const eatRef = useRef<HTMLVideoElement | null>(null);
  const corridorRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setStep("terminal");
    setTerminalDisplay("");
    setTerminalPhase("typing");
  }, []);

  useEffect(() => {
    if (step !== "terminal") return;

    let cancelled = false;
    setTerminalPhase("typing");

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
      });

    const typeIntoDisplay = async (base: string, target: string, speed = 25) => {
      for (let i = 1; i <= target.length; i += 1) {
        if (cancelled) return;
        setTerminalDisplay(base + target.slice(0, i));
        await wait(speed);
      }
    };

    const eraseToLength = async (base: string, current: string, keep: number, speed = 17) => {
      for (let i = current.length; i >= keep; i -= 1) {
        if (cancelled) return;
        setTerminalDisplay(base + current.slice(0, i));
        await wait(speed);
      }
    };

    const commonPrefixLength = (a: string, b: string) => {
      let i = 0;
      while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
      return i;
    };

    const runTerminal = async () => {
      let built = "";

      for (const line of TERMINAL_LINES) {
        if (cancelled) return;

        if (line.type === "normal") {
          await typeIntoDisplay(built, line.text, 24);
          if (cancelled) return;

          built = `${built}${line.text}\n\n`;
          setTerminalDisplay(built);
          await wait(420);
          continue;
        }

        await typeIntoDisplay(built, line.wrong, 24);
        if (cancelled) return;

        await wait(460);

        const keep = commonPrefixLength(line.wrong, line.final);
        await eraseToLength(built, line.wrong, keep, 15);
        if (cancelled) return;

        await wait(180);

        await typeIntoDisplay(`${built}${line.final.slice(0, keep)}`, line.final.slice(keep), 23);
        if (cancelled) return;

        built = `${built}${line.final}\n\n`;
        setTerminalDisplay(built);
        await wait(560);
      }

      if (cancelled) return;

      setTerminalPhase("hold");
      await wait(1900);

      if (cancelled) return;

      setTerminalPhase("fade");
      await wait(1350);

      if (!cancelled) {
        setStep("bread");
      }
    };

    runTerminal();

    return () => {
      cancelled = true;
    };
  }, [step]);

  useEffect(() => {
    const video =
      step === "bread"
        ? breadRef.current
        : step === "eat"
        ? eatRef.current
        : step === "corridor"
        ? corridorRef.current
        : null;

    if (!video) return;

    video.currentTime = 0;
    video.playbackRate = 1;
    video.volume = step === "corridor" ? 0.84 : 0.9;

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // User interaction is usually already granted in this flow.
      });
    }
  }, [step]);

  const advanceScene = useCallback(() => {
    setStep((current) => {
      if (current === "bread") return "eat";
      if (current === "eat") return "corridor";
      if (current === "corridor") return "choices";
      return current;
    });
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#030504] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.86))]" />
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(235,240,238,0.06)_1px,transparent_1px)] [background-size:100%_4px]" />

      <MediaLayer
        step={step}
        terminalPhase={terminalPhase}
        breadRef={breadRef}
        eatRef={eatRef}
        corridorRef={corridorRef}
        onAdvance={advanceScene}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1280px] flex-col px-6 py-8 md:px-10 md:py-10">
        <div className="flex items-start justify-between gap-4">
          <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-white/48 backdrop-blur-md">
            {route.act04Tag}
          </div>

          <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/38 backdrop-blur-md">
            door route / live scene
          </div>
        </div>

        {step === "terminal" ? (
          <div className="pointer-events-none flex flex-1 items-center">
            <div
              className="relative ml-[5vw] w-full max-w-[820px]"
              style={{
                opacity: terminalPhase === "fade" ? 0 : 1,
                transform:
                  terminalPhase === "fade"
                    ? "translateY(-18px)"
                    : terminalPhase === "hold"
                      ? "translateY(0px)"
                      : "translateY(6px)",
                transition:
                  "opacity 1100ms ease, transform 1300ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <div className="mb-5 text-[10px] uppercase tracking-[0.32em] text-[rgba(224,232,228,0.32)]">
                threshold terminal
              </div>

              <div
                className="whitespace-pre-wrap font-mono text-[clamp(16px,1.16vw,20px)] leading-[2.02] text-[rgba(232,238,236,0.88)]"
                style={{
                  textShadow:
                    "0 0 18px rgba(160,255,210,0.06), 0 0 2px rgba(255,255,255,0.06)",
                  maxWidth: "760px",
                }}
              >
                {terminalDisplay}
                <span
                  className="ml-1 inline-block h-[1.05em] w-[0.08em] translate-y-[0.16em] align-middle"
                  style={{
                    background:
                      terminalPhase === "hold"
                        ? "rgba(212,255,226,0.28)"
                        : "rgba(212,255,226,0.76)",
                    boxShadow:
                      terminalPhase === "hold"
                        ? "none"
                        : "0 0 8px rgba(235,240,238,0.08)",
                    animation:
                      terminalPhase === "typing"
                        ? "doorCursorBlink 1.9s steps(1) infinite"
                        : "doorCursorHang 2.8s steps(1) infinite",
                    transition: "background 260ms ease, box-shadow 260ms ease",
                  }}
                />
              </div>

              <div className="mt-6 text-[11px] uppercase tracking-[0.28em] text-[rgba(210,220,216,0.24)]">
                frozen threshold / distant pressure / retyped fragment
              </div>

              <style>{`
                @keyframes doorCursorBlink {
                  0%, 42% { opacity: 1; }
                  43%, 72% { opacity: 0; }
                  73%, 100% { opacity: 1; }
                }

                @keyframes doorCursorHang {
                  0%, 18% { opacity: 1; }
                  19%, 54% { opacity: 0; }
                  55%, 70% { opacity: 1; }
                  71%, 100% { opacity: 0.32; }
                }
              `}</style>
            </div>
          </div>
        ) : null}

        {step === "bread" || step === "eat" || step === "corridor" ? (
          <div className="pointer-events-none flex flex-1 items-end">
            <div className="mb-6 max-w-[600px] rounded-[26px] border border-white/10 bg-[rgba(4,8,6,0.46)] px-5 py-5 backdrop-blur-xl transition-all duration-700">
              <div className="text-[10px] uppercase tracking-[0.32em] text-[rgba(176,255,206,0.42)]">
                consequence drift
              </div>

              <div className="mt-4 text-[clamp(20px,2vw,34px)] leading-[1.14] text-[rgba(242,255,246,0.94)]">
                {step === "bread"
                  ? "тиша між рухами стає густішою"
                  : step === "eat"
                  ? "побут не повертає контроль"
                  : "дзвінок більше не належить телефону"}
              </div>

              <div className="mt-4 text-[14px] leading-[1.8] text-[rgba(214,255,228,0.64)]">
                {step === "bread"
                  ? "Поріг не відпускає погляд навіть тоді, коли руки займаються хлібом."
                  : step === "eat"
                  ? "Кухня ще існує, але вже як місце тиску, а не спокою."
                  : "Коридор дивиться назад. І телефон звучить так, ніби він по той бік дверей."}
              </div>
            </div>
          </div>
        ) : null}

        {step === "choices" ? (
          <div className="flex flex-1 items-center justify-end">
            <div
              className="w-full max-w-[540px] rounded-[28px] border border-white/10 bg-[rgba(6,12,9,0.5)] p-6 shadow-[0_0_80px_rgba(0,0,0,0.2)] backdrop-blur-xl md:p-8"
              style={{
                opacity: 1,
                transform: "translateY(0px)",
                animation: "doorChoicesRise 850ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <div className="text-[10px] uppercase tracking-[0.32em] text-[rgba(176,255,206,0.42)]">
                infected choice
              </div>

              <div className="mt-4 text-[clamp(22px,2vw,34px)] leading-[1.28] text-[rgba(242,255,246,0.94)]">
                {route.act05Prompt}
              </div>

              <div className="mt-8 grid gap-4">
                {route.act05Options.map((option, index) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onChoose(option.id)}
                    className="group rounded-[24px] border border-white/10 bg-[rgba(8,18,12,0.44)] px-5 py-5 text-left transition-all duration-300 hover:border-[rgba(176,255,214,0.24)] hover:bg-[rgba(10,24,16,0.72)]"
                  >
                    <div className="text-[10px] uppercase tracking-[0.28em] text-[rgba(166,255,200,0.44)]">
                      choice 0{index + 1}
                    </div>

                    <div className="mt-3 text-[clamp(18px,1.45vw,24px)] leading-[1.35] text-[rgba(236,255,244,0.92)]">
                      {option.label}
                    </div>

                    <div className="mt-3 text-[13px] leading-[1.7] text-[rgba(204,255,220,0.58)]">
                      {option.summary}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  className="rounded-full border border-white/12 bg-black/28 px-5 py-3 text-sm text-white/82 backdrop-blur-md transition hover:border-white/24 hover:bg-black/42"
                  onClick={onBack}
                  type="button"
                >
                  Назад до відео
                </button>
              </div>

              <style>{`
                @keyframes doorChoicesRise {
                  0% {
                    opacity: 0;
                    transform: translateY(24px) scale(0.985);
                  }
                  100% {
                    opacity: 1;
                    transform: translateY(0px) scale(1);
                  }
                }
              `}</style>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function MediaLayer({
  step,
  terminalPhase,
  breadRef,
  eatRef,
  corridorRef,
  onAdvance,
}: {
  step: Step;
  terminalPhase: "typing" | "hold" | "fade";
  breadRef: React.RefObject<HTMLVideoElement | null>;
  eatRef: React.RefObject<HTMLVideoElement | null>;
  corridorRef: React.RefObject<HTMLVideoElement | null>;
  onAdvance: () => void;
}) {
  return (
    <div className="absolute inset-0">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={DOOR_ACT04_MEDIA.thresholdLoop}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{
          opacity: step === "terminal" ? (terminalPhase === "fade" ? 0.12 : 0.52) : 0,
          filter:
            terminalPhase === "fade"
              ? "blur(4px) brightness(0.3) saturate(0)"
              : "blur(3px) brightness(0.34) saturate(0) contrast(1.03)",
          transform: terminalPhase === "fade" ? "scale(1.005)" : "scale(1.012)",
          transition:
            "opacity 1400ms ease, filter 1500ms cubic-bezier(0.22,1,0.36,1), transform 2200ms cubic-bezier(0.22,1,0.36,1)",
          animation: step === "terminal" ? "doorThresholdBreath 10s ease-in-out infinite" : "none",
        }}
      />

      {step === "terminal" ? <ThresholdTerminalAtmosphere terminalPhase={terminalPhase} /> : null}

      <video
        ref={breadRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={DOOR_ACT04_MEDIA.kitchenBread}
        playsInline
        preload="auto"
        onEnded={() => {
          if (step === "bread") onAdvance();
        }}
        style={{
          opacity: step === "bread" ? 1 : 0,
          transition: "opacity 1800ms ease",
          filter: "brightness(0.72) saturate(0.74)",
        }}
      />

      <video
        ref={eatRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={DOOR_ACT04_MEDIA.kitchenEat}
        playsInline
        preload="auto"
        onEnded={() => {
          if (step === "eat") onAdvance();
        }}
        style={{
          opacity: step === "eat" ? 1 : 0,
          transition: "opacity 1400ms ease",
          filter: "brightness(0.72) saturate(0.74)",
        }}
      />

      <video
        ref={corridorRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={DOOR_ACT04_MEDIA.corridorPhone}
        playsInline
        preload="auto"
        onEnded={() => {
          if (step === "corridor") onAdvance();
        }}
        style={{
          opacity: step === "corridor" || step === "choices" ? 1 : 0,
          transition: "opacity 1500ms ease",
          filter: "brightness(0.62) saturate(0.68)",
        }}
      />

      {step !== "terminal" ? <SceneTransitionVeil key={`door-veil-${step}`} step={step} /> : null}
      {step === "corridor" || step === "choices" ? <InfectedPhonePresence /> : null}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.24),rgba(0,0,0,0.14)_30%,rgba(0,0,0,0.74))]" />
    </div>
  );
}

function ThresholdTerminalAtmosphere({
  terminalPhase,
}: {
  terminalPhase: "typing" | "hold" | "fade";
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          opacity: terminalPhase === "fade" ? 0.04 : 0.08,
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05), transparent 34%)",
          transition: "opacity 1100ms ease",
        }}
      />

      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          opacity: terminalPhase === "fade" ? 0.03 : 0.08,
          background:
            "repeating-linear-gradient(180deg, rgba(235,255,240,0.05) 0px, rgba(235,255,240,0.05) 1px, transparent 2px, transparent 6px)",
          transition: "opacity 900ms ease",
        }}
      />

      <div
        className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2"
        style={{
          opacity: terminalPhase === "fade" ? 0 : 0.08,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(235,255,240,0.12) 20%, rgba(235,255,240,0.05) 80%, transparent 100%)",
          boxShadow: "0 0 8px rgba(255,255,255,0.04)",
          transition: "opacity 1000ms ease",
        }}
      />

      <style>{`
        @keyframes doorThresholdBreath {
          0%, 100% { transform: scale(1.012); }
          50% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

function SceneTransitionVeil({ step }: { step: Exclude<Step, "terminal"> }) {
  const tone =
    step === "corridor"
      ? "rgba(240,244,242,0.1)"
      : "rgba(232,236,234,0.07)";

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        animation: "doorSceneVeil 900ms cubic-bezier(0.22,1,0.36,1)",
        background: `radial-gradient(circle at 50% 50%, ${tone}, transparent 40%)`,
      }}
    >
      <style>{`
        @keyframes doorSceneVeil {
          0% {
            opacity: 0.36;
            transform: scale(1.02);
            filter: blur(2px);
          }
          100% {
            opacity: 0;
            transform: scale(1);
            filter: blur(0px);
          }
        }
      `}</style>
    </div>
  );
}

function InfectedPhonePresence() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute"
        style={{
          right: "12%",
          bottom: "18%",
          width: "180px",
          height: "180px",
          borderRadius: "9999px",
          border: "1px solid rgba(220,255,232,0.12)",
          boxShadow: "0 0 24px rgba(180,255,210,0.08)",
          animation: "doorRingPulse 2.8s ease-out infinite",
        }}
      />
      <div
        className="absolute"
        style={{
          right: "10.8%",
          bottom: "16.8%",
          width: "220px",
          height: "220px",
          borderRadius: "9999px",
          border: "1px solid rgba(220,255,232,0.07)",
          animation: "doorRingPulse 2.8s ease-out 0.7s infinite",
        }}
      />
      <div
        className="absolute"
        style={{
          right: "14.5%",
          bottom: "21.5%",
          width: "14px",
          height: "14px",
          borderRadius: "9999px",
          background: "rgba(220,255,232,0.22)",
          boxShadow: "0 0 18px rgba(220,255,232,0.16)",
          animation: "doorRingCore 2.2s ease-in-out infinite",
        }}
      />

      <style>{`
        @keyframes doorRingPulse {
          0% { opacity: 0; transform: scale(0.7); }
          18% { opacity: 0.18; }
          100% { opacity: 0; transform: scale(1.22); }
        }

        @keyframes doorRingCore {
          0%, 100% { opacity: 0.16; transform: scale(1); }
          50% { opacity: 0.34; transform: scale(1.12); }
        }
      `}</style>
    </div>
  );
}
