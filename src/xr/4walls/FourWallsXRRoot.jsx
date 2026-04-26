import { useEffect, useRef } from "react";
import * as THREE from "three";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

const PEEPHOLE_VIDEO_SRC = "/fourwalls/act03/door.mp4";
const GAZE_HOLD_TO_OPEN = 1.8;
const AFTERMATH_DELAY = 2.65;

function createNoiseBuffer(audioCtx, duration = 2, tint = "brown") {
  const length = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
  const channel = buffer.getChannelData(0);

  let last = 0;

  for (let i = 0; i < length; i += 1) {
    const white = Math.random() * 2 - 1;

    if (tint === "brown") {
      last = (last + 0.02 * white) / 1.02;
      channel[i] = last * 3.2;
    } else {
      channel[i] = white * 0.85;
    }
  }

  return buffer;
}

export default function FourWallsXRRoot({ manifest, xrSupported, xrChecked }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#030405");
    scene.fog = new THREE.Fog("#030405", 3.2, 11.8);

    const camera = new THREE.PerspectiveCamera(
      70,
      mount.clientWidth / mount.clientHeight,
      0.01,
      100
    );
    camera.position.set(0, 1.62, 3.4);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.xr.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const controls = new PointerLockControls(camera, renderer.domElement);

    const keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };

    const onKeyDown = (event) => {
      if (event.code === "KeyW") keys.forward = true;
      if (event.code === "KeyS") keys.backward = true;
      if (event.code === "KeyA") keys.left = true;
      if (event.code === "KeyD") keys.right = true;
    };

    const onKeyUp = (event) => {
      if (event.code === "KeyW") keys.forward = false;
      if (event.code === "KeyS") keys.backward = false;
      if (event.code === "KeyA") keys.left = false;
      if (event.code === "KeyD") keys.right = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    let audioCtx = null;
    let pressureGain = null;

    let airSource = null;
    let airFilter = null;
    let airGain = null;

    let staticSource = null;
    let staticFilter = null;
    let staticGain = null;

    let crackleSource = null;
    let crackleFilter = null;
    let crackleGain = null;

    const ensureAudio = async () => {
      if (audioCtx) {
        if (audioCtx.state === "suspended") {
          try {
            await audioCtx.resume();
          } catch {}
        }
        return;
      }

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      audioCtx = new AudioCtx();

      pressureGain = audioCtx.createGain();
      pressureGain.gain.value = 0.0001;

      airSource = audioCtx.createBufferSource();
      airSource.buffer = createNoiseBuffer(audioCtx, 2, "brown");
      airSource.loop = true;

      airFilter = audioCtx.createBiquadFilter();
      airFilter.type = "lowpass";
      airFilter.frequency.value = 210;
      airFilter.Q.value = 0.55;

      airGain = audioCtx.createGain();
      airGain.gain.value = 0.0001;

      staticSource = audioCtx.createBufferSource();
      staticSource.buffer = createNoiseBuffer(audioCtx, 2, "white");
      staticSource.loop = true;

      staticFilter = audioCtx.createBiquadFilter();
      staticFilter.type = "bandpass";
      staticFilter.frequency.value = 1350;
      staticFilter.Q.value = 0.9;

      staticGain = audioCtx.createGain();
      staticGain.gain.value = 0.0001;

      crackleSource = audioCtx.createBufferSource();
      crackleSource.buffer = createNoiseBuffer(audioCtx, 2, "white");
      crackleSource.loop = true;

      crackleFilter = audioCtx.createBiquadFilter();
      crackleFilter.type = "highpass";
      crackleFilter.frequency.value = 2400;
      crackleFilter.Q.value = 0.75;

      crackleGain = audioCtx.createGain();
      crackleGain.gain.value = 0.0001;

      airSource.connect(airFilter).connect(airGain).connect(pressureGain);
      staticSource.connect(staticFilter).connect(staticGain).connect(pressureGain);
      crackleSource.connect(crackleFilter).connect(crackleGain).connect(pressureGain);
      pressureGain.connect(audioCtx.destination);

      airSource.start();
      staticSource.start();
      crackleSource.start();

      try {
        await audioCtx.resume();
      } catch {}
    };

    const hemi = new THREE.HemisphereLight("#d8dde2", "#050607", 0.1);
    scene.add(hemi);

    const overhead = new THREE.PointLight("#f2f5f7", 0.22, 8.5, 2);
    overhead.position.set(0, 2.55, -2.05);
    scene.add(overhead);

    const thresholdLight = new THREE.PointLight("#dde4e8", 0.12, 3.8, 2);
    thresholdLight.position.set(0, 1.54, -2.34);
    scene.add(thresholdLight);

    const roomMaterial = new THREE.MeshStandardMaterial({
      color: "#060709",
      roughness: 1,
      metalness: 0,
      transparent: true,
      opacity: 0.42,
    });

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      roomMaterial.clone()
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);

    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      roomMaterial.clone()
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 3.2;
    scene.add(ceiling);

    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 3.2),
      roomMaterial.clone()
    );
    backWall.position.set(0, 1.6, -4.35);
    scene.add(backWall);

    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 3.2),
      roomMaterial.clone()
    );
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-3.3, 1.6, 0.3);
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 3.2),
      roomMaterial.clone()
    );
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(3.3, 1.6, 0.3);
    scene.add(rightWall);

    const corridorLane = new THREE.Mesh(
      new THREE.PlaneGeometry(1.18, 6.2),
      new THREE.MeshBasicMaterial({
        color: "#dbe2e6",
        transparent: true,
        opacity: 0.018,
      })
    );
    corridorLane.rotation.x = -Math.PI / 2;
    corridorLane.position.set(0, 0.01, -0.06);
    scene.add(corridorLane);

    const doorGroup = new THREE.Group();
    doorGroup.position.set(0, 0, -2.8);
    scene.add(doorGroup);

    const frameMaterial = new THREE.MeshStandardMaterial({
      color: "#0b0d10",
      roughness: 0.96,
      metalness: 0.04,
      transparent: true,
      opacity: 1,
    });

    const slabMaterial = new THREE.MeshStandardMaterial({
      color: "#0d1014",
      roughness: 0.82,
      metalness: 0.05,
      transparent: true,
      opacity: 1,
    });

    const frameTop = new THREE.Mesh(
      new THREE.BoxGeometry(1.56, 0.08, 0.12),
      frameMaterial
    );
    frameTop.position.set(0, 2.84, 0);
    doorGroup.add(frameTop);

    const frameLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 2.8, 0.12),
      frameMaterial
    );
    frameLeft.position.set(-0.74, 1.42, 0);
    doorGroup.add(frameLeft);

    const frameRight = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 2.8, 0.12),
      frameMaterial
    );
    frameRight.position.set(0.74, 1.42, 0);
    doorGroup.add(frameRight);

    const doorSlab = new THREE.Mesh(
      new THREE.BoxGeometry(1.36, 2.66, 0.08),
      slabMaterial
    );
    doorSlab.position.set(0, 1.37, -0.01);
    doorGroup.add(doorSlab);

    const innerFrameMaterial = new THREE.MeshStandardMaterial({
      color: "#050608",
      roughness: 1,
      metalness: 0,
    });

    const innerFrameTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.98, 0.045, 0.05),
      innerFrameMaterial
    );
    innerFrameTop.position.set(0, 2.42, 0.03);
    doorGroup.add(innerFrameTop);

    const innerFrameLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.045, 2.02, 0.05),
      innerFrameMaterial
    );
    innerFrameLeft.position.set(-0.49, 1.37, 0.03);
    doorGroup.add(innerFrameLeft);

    const innerFrameRight = new THREE.Mesh(
      new THREE.BoxGeometry(0.045, 2.02, 0.05),
      innerFrameMaterial
    );
    innerFrameRight.position.set(0.49, 1.37, 0.03);
    doorGroup.add(innerFrameRight);

    const innerFrameBottom = new THREE.Mesh(
      new THREE.BoxGeometry(0.98, 0.045, 0.05),
      innerFrameMaterial
    );
    innerFrameBottom.position.set(0, 0.34, 0.03);
    doorGroup.add(innerFrameBottom);

    const slabInnerGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.98, 2.08),
      new THREE.MeshBasicMaterial({
        color: "#e8edf0",
        transparent: true,
        opacity: 0.028,
      })
    );
    slabInnerGlow.position.set(0, 1.37, 0.034);
    doorGroup.add(slabInnerGlow);

    const peepholeFocus = new THREE.Mesh(
      new THREE.CircleGeometry(0.064, 64),
      new THREE.MeshBasicMaterial({
        color: "#090b0e",
      })
    );
    peepholeFocus.position.set(0, 1.58, 0.05);
    doorGroup.add(peepholeFocus);

    const peepholeRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.104, 0.008, 24, 64),
      new THREE.MeshStandardMaterial({
        color: "#8b9398",
        roughness: 0.22,
        metalness: 0.92,
        emissive: new THREE.Color("#cfd6db"),
        emissiveIntensity: 0.035,
      })
    );
    peepholeRing.position.set(0, 1.58, 0.056);
    doorGroup.add(peepholeRing);

    const peepholeAura = new THREE.Mesh(
      new THREE.CircleGeometry(0.26, 64),
      new THREE.MeshBasicMaterial({
        color: "#edf2f5",
        transparent: true,
        opacity: 0.018,
      })
    );
    peepholeAura.position.set(0, 1.58, 0.03);
    doorGroup.add(peepholeAura);

    const peepholeLens = new THREE.Mesh(
      new THREE.CircleGeometry(0.082, 64),
      new THREE.MeshBasicMaterial({
        color: "#e8edf0",
        transparent: true,
        opacity: 0.075,
      })
    );
    peepholeLens.position.set(0, 1.58, 0.066);
    doorGroup.add(peepholeLens);

    const peepholeSpec = new THREE.Mesh(
      new THREE.CircleGeometry(0.017, 32),
      new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.14,
      })
    );
    peepholeSpec.position.set(0.02, 1.602, 0.068);
    doorGroup.add(peepholeSpec);

    const thresholdVeil = new THREE.Mesh(
      new THREE.PlaneGeometry(1.88, 3.1),
      new THREE.MeshBasicMaterial({
        color: "#f1f5f8",
        transparent: true,
        opacity: 0.02,
      })
    );
    thresholdVeil.position.set(0, 1.56, -0.12);
    doorGroup.add(thresholdVeil);

    const focusHalo = new THREE.Mesh(
      new THREE.RingGeometry(0.18, 0.26, 64),
      new THREE.MeshBasicMaterial({
        color: "#f4f6f8",
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      })
    );
    focusHalo.position.set(0, 1.58, 0.07);
    doorGroup.add(focusHalo);

    const portalVideo = document.createElement("video");
    portalVideo.src = PEEPHOLE_VIDEO_SRC;
    portalVideo.crossOrigin = "anonymous";
    portalVideo.loop = true;
    portalVideo.muted = true;
    portalVideo.playsInline = true;
    portalVideo.preload = "auto";

    const portalTexture = new THREE.VideoTexture(portalVideo);
    portalTexture.colorSpace = THREE.SRGBColorSpace;
    portalTexture.minFilter = THREE.LinearFilter;
    portalTexture.magFilter = THREE.LinearFilter;
    portalTexture.generateMipmaps = false;

    const peepholeVideo = new THREE.Mesh(
      new THREE.CircleGeometry(0.084, 64),
      new THREE.MeshBasicMaterial({
        map: portalTexture,
        transparent: true,
        opacity: 0,
      })
    );
    peepholeVideo.position.set(0, 1.58, 0.072);
    doorGroup.add(peepholeVideo);

    const peepholeMask = new THREE.Mesh(
      new THREE.RingGeometry(0.085, 0.19, 64),
      new THREE.MeshBasicMaterial({
        color: "#050607",
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
      })
    );
    peepholeMask.position.set(0, 1.58, 0.071);
    doorGroup.add(peepholeMask);

    const particlesCount = 84;
    const particlePositions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i += 1) {
      particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 3.6;
      particlePositions[i * 3 + 1] = Math.random() * 2.15 + 0.45;
      particlePositions[i * 3 + 2] = -2.6 + Math.random() * 4.5;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: "#cfd5da",
      size: 0.011,
      transparent: true,
      opacity: 0.09,
      depthWrite: false,
    });

    const dust = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(dust);

    const takeoverGroup = new THREE.Group();
    takeoverGroup.position.set(0, 0, -1.15);
    camera.add(takeoverGroup);

    const takeoverShell = new THREE.Mesh(
      new THREE.PlaneGeometry(8.8, 6.2),
      new THREE.MeshBasicMaterial({
        color: "#000000",
        transparent: true,
        opacity: 0,
        depthWrite: false,
        depthTest: false,
      })
    );
    takeoverShell.position.set(0, 0, 0);
    takeoverGroup.add(takeoverShell);

    const takeoverVideo = new THREE.Mesh(
      new THREE.CircleGeometry(0.12, 96),
      new THREE.MeshBasicMaterial({
        map: portalTexture,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        depthTest: false,
      })
    );
    takeoverVideo.position.set(0, 0, 0.01);
    takeoverVideo.scale.setScalar(0.22);
    takeoverGroup.add(takeoverVideo);

    const takeoverRing = new THREE.Mesh(
      new THREE.RingGeometry(0.122, 0.132, 96),
      new THREE.MeshBasicMaterial({
        color: "#f5f7f8",
        transparent: true,
        opacity: 0,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide,
      })
    );
    takeoverRing.position.set(0, 0, 0.012);
    takeoverRing.scale.setScalar(0.22);
    takeoverGroup.add(takeoverRing);

    const takeoverVignette = new THREE.Mesh(
      new THREE.CircleGeometry(0.17, 96),
      new THREE.MeshBasicMaterial({
        color: "#000000",
        transparent: true,
        opacity: 0,
        depthWrite: false,
        depthTest: false,
      })
    );
    takeoverVignette.position.set(0, 0, 0.005);
    takeoverGroup.add(takeoverVignette);

    const aftermathCurtain = new THREE.Mesh(
      new THREE.PlaneGeometry(9.2, 6.4),
      new THREE.MeshBasicMaterial({
        color: "#000000",
        transparent: true,
        opacity: 0,
        depthWrite: false,
        depthTest: false,
      })
    );
    aftermathCurtain.position.set(0, 0, 0.02);
    takeoverGroup.add(aftermathCurtain);

    const aftermathRing = new THREE.Mesh(
      new THREE.RingGeometry(0.122, 0.129, 96),
      new THREE.MeshBasicMaterial({
        color: "#eef2f4",
        transparent: true,
        opacity: 0,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide,
      })
    );
    aftermathRing.position.set(0, 0, 0.014);
    aftermathRing.scale.setScalar(5.95);
    takeoverGroup.add(aftermathRing);

    const clock = new THREE.Clock();
    const raycaster = new THREE.Raycaster();
    const center = new THREE.Vector2(0, 0);
    const worldUp = new THREE.Vector3(0, 1, 0);
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    const targetDoorPoint = new THREE.Vector3(0, 1.58, -2.75);

    let vrButton = null;
    let gazeHold = 0;
    let portalReveal = 0;
    let takeoverProgress = 0;
    let portalArmed = false;
    let videoStarted = false;
    let aftermathHold = 0;
    let aftermathProgress = 0;

    if (xrSupported) {
      vrButton = VRButton.createButton(renderer);
      vrButton.style.right = "24px";
      vrButton.style.bottom = "24px";
      vrButton.style.border = "1px solid rgba(255,255,255,0.18)";
      vrButton.style.background = "rgba(8,10,12,0.62)";
      vrButton.style.color = "rgba(255,255,255,0.88)";
      vrButton.style.backdropFilter = "blur(10px)";
      document.body.appendChild(vrButton);
    }

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener("resize", onResize);

    const lockOnClick = async () => {
      if (!xrSupported && xrChecked && !controls.isLocked) {
        controls.lock();
      }
      await ensureAudio();
    };

    renderer.domElement.removeEventListener("click", lockOnClick);
    renderer.domElement.addEventListener("click", lockOnClick);

    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.033);
      const t = clock.getElapsedTime();

      camera.getWorldDirection(forward);
      forward.y = 0;
      if (forward.lengthSq() > 0.0001) forward.normalize();
      right.crossVectors(forward, worldUp).normalize();

      const distanceToDoor = camera.position.distanceTo(targetDoorPoint);
      const nearDoorFactor = THREE.MathUtils.clamp((4.2 - distanceToDoor) / 2.8, 0, 1);

      const movementSuppressed = takeoverProgress > 0.46;

      if (!renderer.xr.isPresenting && controls.isLocked && !movementSuppressed) {
        const walkSpeed = THREE.MathUtils.lerp(1.08, 0.44, nearDoorFactor);

        if (keys.forward) camera.position.addScaledVector(forward, walkSpeed * dt);
        if (keys.backward) camera.position.addScaledVector(forward, -walkSpeed * dt);
        if (keys.left) camera.position.addScaledVector(right, -walkSpeed * dt);
        if (keys.right) camera.position.addScaledVector(right, walkSpeed * dt);

        const maxX = THREE.MathUtils.lerp(1.55, 0.34, nearDoorFactor);
        camera.position.x = THREE.MathUtils.clamp(camera.position.x, -maxX, maxX);
        camera.position.z = THREE.MathUtils.clamp(camera.position.z, -1.92, 3.8);
      }

      dust.rotation.y = t * 0.015;

      raycaster.setFromCamera(center, camera);
      const hits = raycaster.intersectObjects([peepholeFocus, peepholeRing, doorSlab], false);

      const focused =
        hits.length > 0 &&
        (hits[0].object === peepholeFocus || hits[0].object === peepholeRing);

      const nearDoor = distanceToDoor < 3.2;
      const veryNearDoor = distanceToDoor < 1.42;

      if (focused && veryNearDoor && !renderer.xr.isPresenting && controls.isLocked) {
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.08);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, -1.72, 0.06);
      }

      if (focused && veryNearDoor) {
        gazeHold = Math.min(gazeHold + dt, 2.2);
      } else {
        gazeHold = Math.max(gazeHold - dt * 1.5, 0);
      }

      const holdRatio = THREE.MathUtils.clamp(gazeHold / GAZE_HOLD_TO_OPEN, 0, 1);

      if (!portalArmed && gazeHold >= GAZE_HOLD_TO_OPEN) {
        portalArmed = true;
      }

      if (portalArmed && (!nearDoor || distanceToDoor > 2.28)) {
        portalArmed = false;
      }

      if ((portalArmed || holdRatio > 0.08) && !videoStarted) {
        const playPromise = portalVideo.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {});
        }
        videoStarted = true;
      }

      if (!portalArmed && holdRatio < 0.02 && videoStarted) {
        portalVideo.pause();
        portalVideo.currentTime = 0;
        videoStarted = false;
      }

      const portalRevealTarget = portalArmed ? 1 : holdRatio * 0.42;
      const takeoverTarget = portalArmed ? 1 : 0;

      portalReveal = THREE.MathUtils.lerp(portalReveal, portalRevealTarget, 0.05);
      takeoverProgress = THREE.MathUtils.lerp(takeoverProgress, takeoverTarget, 0.038);

      if (takeoverProgress > 0.96) {
        aftermathHold += dt;
      } else {
        aftermathHold = Math.max(0, aftermathHold - dt * 2.4);
      }

      const aftermathTarget = aftermathHold > AFTERMATH_DELAY ? 1 : 0;
      aftermathProgress = THREE.MathUtils.lerp(aftermathProgress, aftermathTarget, 0.045);

      const baseLayerFade =
        (1 - THREE.MathUtils.smoothstep(takeoverProgress, 0.08, 0.9)) *
        (1 - aftermathProgress * 0.42);

      if (!renderer.xr.isPresenting && controls.isLocked && takeoverProgress > 0.22) {
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.09);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, -1.68, 0.085);
      }

      const ringTarget = focused ? 0.34 : nearDoor ? 0.15 : 0.06;
      const auraTarget = focused ? 0.12 : nearDoor ? 0.06 : 0.03;
      const veilTarget = focused ? 0.065 : nearDoor ? 0.04 : 0.02;
      const lightTarget = focused ? 0.38 : nearDoor ? 0.28 : 0.18;
      const haloTarget = veryNearDoor ? (focused ? 0.22 : 0.08) : 0;

      frameMaterial.opacity = THREE.MathUtils.lerp(
        frameMaterial.opacity,
        0.08 + baseLayerFade * 0.92,
        0.08
      );

      slabMaterial.opacity = THREE.MathUtils.lerp(
        slabMaterial.opacity,
        0.03 + baseLayerFade * 0.97,
        0.08
      );

      peepholeRing.material.emissiveIntensity = THREE.MathUtils.lerp(
        peepholeRing.material.emissiveIntensity,
        (ringTarget + portalReveal * 0.22) * baseLayerFade,
        0.08
      );

      peepholeAura.material.opacity = THREE.MathUtils.lerp(
        peepholeAura.material.opacity,
        (auraTarget + portalReveal * 0.11) * baseLayerFade,
        0.08
      );

      thresholdVeil.material.opacity = THREE.MathUtils.lerp(
        thresholdVeil.material.opacity,
        (veilTarget + portalReveal * 0.16) * baseLayerFade,
        0.08
      );

      thresholdLight.intensity = THREE.MathUtils.lerp(
        thresholdLight.intensity,
        lightTarget + portalReveal * 0.12 - aftermathProgress * 0.04,
        0.08
      );

      corridorLane.material.opacity = THREE.MathUtils.lerp(
        corridorLane.material.opacity,
        0.01 + nearDoorFactor * 0.012,
        0.08
      );

      slabInnerGlow.material.opacity = THREE.MathUtils.lerp(
        slabInnerGlow.material.opacity,
        ((focused ? 0.07 : nearDoor ? 0.038 : 0.018) + portalReveal * 0.08) * baseLayerFade,
        0.08
      );

      focusHalo.material.opacity = THREE.MathUtils.lerp(
        focusHalo.material.opacity,
        Math.max(haloTarget, holdRatio * 0.12) * baseLayerFade,
        0.08
      );

      peepholeLens.material.opacity = THREE.MathUtils.lerp(
        peepholeLens.material.opacity,
        (0.07 + portalReveal * 0.045) * baseLayerFade,
        0.08
      );

      peepholeSpec.material.opacity = THREE.MathUtils.lerp(
        peepholeSpec.material.opacity,
        (0.08 + focused * 0.08 + portalReveal * 0.05) * baseLayerFade,
        0.08
      );

      peepholeVideo.material.opacity = THREE.MathUtils.lerp(
        peepholeVideo.material.opacity,
        portalReveal * baseLayerFade,
        0.1
      );

      peepholeMask.material.opacity = THREE.MathUtils.lerp(
        peepholeMask.material.opacity,
        (0.18 + portalReveal * 0.34) * baseLayerFade,
        0.08
      );

      takeoverShell.material.opacity = THREE.MathUtils.lerp(
        takeoverShell.material.opacity,
        takeoverProgress * (0.96 + aftermathProgress * 0.04),
        0.08
      );

      takeoverVideo.material.opacity = THREE.MathUtils.lerp(
        takeoverVideo.material.opacity,
        takeoverProgress * (1 - aftermathProgress * 0.08),
        0.1
      );

      takeoverRing.material.opacity = THREE.MathUtils.lerp(
        takeoverRing.material.opacity,
        takeoverProgress * 0.16 * (1 - aftermathProgress * 0.78),
        0.08
      );

      takeoverVignette.material.opacity = THREE.MathUtils.lerp(
        takeoverVignette.material.opacity,
        takeoverProgress * (0.42 + aftermathProgress * 0.16),
        0.08
      );

      aftermathCurtain.material.opacity = THREE.MathUtils.lerp(
        aftermathCurtain.material.opacity,
        aftermathProgress * 0.16,
        0.05
      );

      aftermathRing.material.opacity = THREE.MathUtils.lerp(
        aftermathRing.material.opacity,
        aftermathProgress * 0.08,
        0.05
      );

      const takeoverScale = THREE.MathUtils.lerp(0.22, 5.4, takeoverProgress);
      const aftermathScale = THREE.MathUtils.lerp(1, 0.972, aftermathProgress);

      takeoverVideo.scale.setScalar(takeoverScale * aftermathScale);
      takeoverRing.scale.setScalar(
        THREE.MathUtils.lerp(0.22, 5.46, takeoverProgress) *
          THREE.MathUtils.lerp(1, 0.976, aftermathProgress)
      );
      takeoverVignette.scale.setScalar(
        THREE.MathUtils.lerp(0.22, 8.6, takeoverProgress) *
          THREE.MathUtils.lerp(1, 1.02, aftermathProgress)
      );
      aftermathRing.scale.setScalar(THREE.MathUtils.lerp(5.95, 5.72, aftermathProgress));

      const breath = 1 + Math.sin(t * 0.62) * 0.0024;
      doorSlab.scale.set(breath, 1, 1);
      peepholeAura.scale.setScalar(1 + Math.sin(t * 1.08) * 0.012);
      focusHalo.scale.setScalar(1 + Math.sin(t * 1.02) * (0.014 + holdRatio * 0.024));

      particleMaterial.opacity = THREE.MathUtils.lerp(
        particleMaterial.opacity,
        0.14 * (1 - takeoverProgress * 0.72) * (1 - aftermathProgress * 0.5),
        0.06
      );

      if (
        audioCtx &&
        pressureGain &&
        airGain &&
        staticGain &&
        crackleGain &&
        airFilter &&
        staticFilter &&
        crackleFilter
      ) {
        const slowDrift = 0.5 + 0.5 * Math.sin(t * 0.19);
        const fastDrift = 0.5 + 0.5 * Math.sin(t * 1.7);

        const masterTarget =
          aftermathProgress > 0.01
            ? THREE.MathUtils.lerp(0.34, 0.16, aftermathProgress)
            : portalArmed
            ? 0.44
            : nearDoor
            ? 0.14 + holdRatio * 0.14
            : 0.05;

        const airTarget =
          aftermathProgress > 0.01
            ? THREE.MathUtils.lerp(0.028, 0.012, aftermathProgress)
            : portalArmed
            ? 0.03 + takeoverProgress * 0.012
            : nearDoor
            ? 0.006 + holdRatio * 0.012
            : 0.0015;

        const staticTarget =
          aftermathProgress > 0.01
            ? THREE.MathUtils.lerp(0.02, 0.007, aftermathProgress)
            : portalArmed
            ? 0.024 + takeoverProgress * 0.02
            : nearDoor
            ? 0.005 + holdRatio * 0.022
            : 0.001;

        const crackleTarget =
          aftermathProgress > 0.01
            ? THREE.MathUtils.lerp(0.008, 0.002, aftermathProgress)
            : portalArmed
            ? 0.012 + fastDrift * 0.008 + holdRatio * 0.006
            : focused && nearDoor
            ? 0.003 + holdRatio * 0.01
            : 0.0005;

        const airFreqTarget =
          aftermathProgress > 0.01
            ? THREE.MathUtils.lerp(170, 120, aftermathProgress)
            : portalArmed
            ? 145
            : nearDoor
            ? 185
            : 220;

        const staticFreqTarget =
          (portalArmed ? 1750 : nearDoor ? 1450 : 1180) + slowDrift * 140;

        const crackleFreqTarget =
          (portalArmed ? 3000 : nearDoor ? 2480 : 2120) + fastDrift * 180;

        pressureGain.gain.setTargetAtTime(
          masterTarget,
          audioCtx.currentTime,
          0.22
        );

        airGain.gain.setTargetAtTime(
          airTarget,
          audioCtx.currentTime,
          0.24
        );

        staticGain.gain.setTargetAtTime(
          staticTarget,
          audioCtx.currentTime,
          0.18
        );

        crackleGain.gain.setTargetAtTime(
          crackleTarget,
          audioCtx.currentTime,
          0.12
        );

        airFilter.frequency.setTargetAtTime(
          airFreqTarget,
          audioCtx.currentTime,
          0.24
        );

        staticFilter.frequency.setTargetAtTime(
          staticFreqTarget,
          audioCtx.currentTime,
          0.18
        );

        crackleFilter.frequency.setTargetAtTime(
          crackleFreqTarget,
          audioCtx.currentTime,
          0.12
        );
      }

      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    return () => {
      renderer.setAnimationLoop(null);

      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);

      renderer.domElement.removeEventListener("click", lockOnClick);

      if (vrButton && vrButton.parentNode) {
        vrButton.parentNode.removeChild(vrButton);
      }

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }

      portalVideo.pause();
      portalTexture.dispose();

      try {
        airSource?.stop();
        staticSource?.stop();
        crackleSource?.stop();
      } catch {}

      if (audioCtx) {
        audioCtx.close().catch(() => {});
      }

      renderer.dispose();

      [
        floor,
        ceiling,
        backWall,
        leftWall,
        rightWall,
        corridorLane,
        frameTop,
        frameLeft,
        frameRight,
        doorSlab,
        innerFrameTop,
        innerFrameLeft,
        innerFrameRight,
        innerFrameBottom,
        slabInnerGlow,
        peepholeFocus,
        peepholeRing,
        peepholeAura,
        peepholeLens,
        peepholeSpec,
        thresholdVeil,
        focusHalo,
        peepholeVideo,
        peepholeMask,
        takeoverShell,
        takeoverVideo,
        takeoverRing,
        takeoverVignette,
        aftermathCurtain,
        aftermathRing,
      ].forEach((mesh) => {
        if (mesh.geometry) mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => material.dispose());
        } else if (mesh.material) {
          mesh.material.dispose();
        }
      });

      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [manifest, xrSupported, xrChecked]);

  return <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />;
}
