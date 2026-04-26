import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import GlobalSoundtrack from "../components/audio/GlobalSoundtrack";
import BrenychGlyphPreloaderPreview from "../components/preloader/BrenychGlyphPreloaderPreview";
import ChapterIntroTypewriterPreview from "../components/story/ChapterIntroTypewriterPreview";
import LanguageToggle from "../i18n/LanguageToggle";
import { messages, type Locale } from "../i18n/messages";
import { getStoredLocale, subscribeLocaleChange } from "../i18n/runtime";
import Act03BranchVideoStage from "./acts/Act03BranchVideoStage";
import Act04ConsequenceStage from "./acts/Act04ConsequenceStage";
import Act05HybridChoiceStage from "./acts/Act05HybridChoiceStage";
import { GLOBAL_SOUNDTRACK } from "./projectMedia";
import { getAct2Scene, getBranchSceneTitle, getStageScene } from "./storyRegistry";
import {
  DEFAULT_CONTROLS,
  DEFAULT_RUNTIME_STATE,
  moveToStage,
  resetStory,
  selectBranch,
} from "./storyState";
import type { ChoiceId, StoryControls, StoryRuntimeState } from "./storyTypes";
import BranchVideoTransition from "./transitions/BranchVideoTransition";

const XR_RETURN_STORAGE_KEY = "4walls.xr.return";
const XR_RETURN_DOOR_ACT04 = "door_act04";

const SHOW_DEV_HUD = true;

export default function StoryShell() {
  const [runtime, setRuntime] = useState<StoryRuntimeState>(DEFAULT_RUNTIME_STATE);
  const [controls, setControls] = useState<StoryControls>(DEFAULT_CONTROLS);
  const [locale, setLocale] = useState<Locale>(() => getStoredLocale());
  const [hudVisible, setHudVisible] = useState(false);
  const [transitioningChoice, setTransitioningChoice] = useState<ChoiceId | null>(null);
  const [branchFlowStage, setBranchFlowStage] = useState<"menu" | "video" | "act4" | "act5">(
    "menu",
  );
  const [act5ChoiceId, setAct5ChoiceId] = useState<string | null>(null);

  const stageScene = useMemo(() => getStageScene(runtime.stage), [runtime.stage]);

  const selectedSceneTitle = useMemo(() => {
    if (runtime.stage === "act3") {
      if (!runtime.selectedBranch) return "Branch choice menu";
      if (branchFlowStage === "video") return getBranchSceneTitle(runtime.selectedBranch);
      if (branchFlowStage === "act4") return `Act 04 / ${getBranchSceneTitle(runtime.selectedBranch)}`;
      if (branchFlowStage === "act5") return `Act 05 / ${getBranchSceneTitle(runtime.selectedBranch)}`;
      return "Branch choice menu";
    }

    return stageScene.title;
  }, [branchFlowStage, runtime.selectedBranch, runtime.stage, stageScene.title]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "h") {
        setHudVisible((current) => !current);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    return subscribeLocaleChange(setLocale);
  }, []);

  const copy = messages[locale];

  const handleAct1Complete = useCallback(() => {
    setRuntime((current) => moveToStage(current, "act2"));
  }, []);

  const handleBranchSelect = useCallback((choice: ChoiceId) => {
    setAct5ChoiceId(null);
    setTransitioningChoice(choice);
  }, []);

  const commitBranchTransition = useCallback((choice: ChoiceId) => {
    setRuntime((current) => selectBranch(current, choice));
    setBranchFlowStage("video");
  }, []);

  const finishBranchTransition = useCallback(() => {
    setTransitioningChoice(null);
  }, []);

  const moveBackToAct2 = useCallback(() => {
    setTransitioningChoice(null);
    setAct5ChoiceId(null);
    setBranchFlowStage("menu");
    setRuntime((current) => ({
      ...current,
      stage: "act3",
      selectedBranch: null,
    }));
  }, []);

  const restartStoryFlow = useCallback(() => {
    setTransitioningChoice(null);
    setAct5ChoiceId(null);
    setBranchFlowStage("menu");
    setRuntime((current) => resetStory(current.mode));
  }, []);

  const toggleSound = useCallback(() => {
    setControls((current) => ({
      ...current,
      soundEnabled: !current.soundEnabled,
    }));
  }, []);

  const toggleTextSpeed = useCallback(() => {
    setControls((current) => ({
      ...current,
      textSpeed:
        current.textSpeed === "normal"
          ? "fast"
          : current.textSpeed === "fast"
            ? "ultra"
            : "normal",
    }));
  }, []);

  const jumpToAct1 = useCallback(() => {
    setTransitioningChoice(null);
    setAct5ChoiceId(null);
    setBranchFlowStage("menu");
    setRuntime((current) => ({
      ...resetStory(current.mode),
      stage: "act1",
    }));
  }, []);

  const jumpToAct2 = useCallback(() => {
    setTransitioningChoice(null);
    setAct5ChoiceId(null);
    setBranchFlowStage("menu");
    setRuntime((current) => ({
      ...moveToStage(current, "act2"),
      selectedBranch: null,
    }));
  }, []);

  const jumpToAct3 = useCallback(() => {
    setTransitioningChoice(null);
    setAct5ChoiceId(null);
    setBranchFlowStage("menu");
    setRuntime((current) => ({
      ...current,
      stage: "act3",
      selectedBranch: null,
    }));
  }, []);

  const continueDoorToAct04Direct = useCallback(() => {
    setBranchFlowStage("act4");
  }, []);

  const continueDoorViaXR = useCallback(() => {
    sessionStorage.setItem(XR_RETURN_STORAGE_KEY, XR_RETURN_DOOR_ACT04);

    const target = encodeURIComponent(`/?xr_return=${XR_RETURN_DOOR_ACT04}`);
    window.location.assign(`/xr/door?return=${target}`);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const xrReturn = params.get("xr_return");
    const storedReturn = sessionStorage.getItem(XR_RETURN_STORAGE_KEY);

    const shouldResumeDoorAct04 =
      xrReturn === XR_RETURN_DOOR_ACT04 ||
      storedReturn === XR_RETURN_DOOR_ACT04;

    if (!shouldResumeDoorAct04) return;

    sessionStorage.removeItem(XR_RETURN_STORAGE_KEY);
    window.history.replaceState({}, "", window.location.pathname);

    requestAnimationFrame(() => {
      continueDoorToAct04Direct();
    });
  }, [continueDoorToAct04Direct]);

  const chooseAct05Option = useCallback((id: string) => {
    setAct5ChoiceId(id);
    setBranchFlowStage("act5");
  }, []);

  const backToAct4 = useCallback(() => {
    setBranchFlowStage("act4");
  }, []);

  const activeStageView =
    runtime.stage === "act1" ? (
      <BrenychGlyphPreloaderPreview onEnterComplete={handleAct1Complete} />
    ) : runtime.stage === "act2" ? (
      <ChapterIntroTypewriterPreview
        scene={getAct2Scene()}
        textSpeed={controls.textSpeed}
        initialView="story"
        onBranchSelect={handleBranchSelect}
      />
    ) : runtime.stage === "act3" && !runtime.selectedBranch ? (
      <ChapterIntroTypewriterPreview
        scene={getAct2Scene()}
        textSpeed={controls.textSpeed}
        initialView="choice"
        onBranchSelect={handleBranchSelect}
      />
    ) : runtime.stage === "act3" && branchFlowStage === "video" ? (
      <Act03BranchVideoStage
        choice={runtime.selectedBranch}
        locale={locale}
        onRestart={restartStoryFlow}
        onBackToAct2={moveBackToAct2}
        onContinue={continueDoorViaXR}
      />
    ) : runtime.stage === "act3" && branchFlowStage === "act4" ? (
      <Act04ConsequenceStage
        choice={runtime.selectedBranch}
        onChoose={chooseAct05Option}
        onBackToVideo={() => setBranchFlowStage("video")}
      />
    ) : (
      <Act05HybridChoiceStage
        choice={runtime.selectedBranch}
        optionId={act5ChoiceId}
        onBackToAct4={backToAct4}
        onRestart={restartStoryFlow}
      />
    );

  return (
    <>
      <GlobalSoundtrack
        src={GLOBAL_SOUNDTRACK.src}
        enabled={controls.soundEnabled}
        active={runtime.stage === "act2" || (runtime.stage === "act3" && !runtime.selectedBranch)}
        volume={GLOBAL_SOUNDTRACK.volume}
      />

      <div
        style={{
          position: "fixed",
          top: 18,
          right: SHOW_DEV_HUD && hudVisible ? 392 : 72,
          zIndex: 141,
          transition: "right 220ms ease",
        }}
      >
        <LanguageToggle />
      </div>

      {activeStageView}
      {transitioningChoice ? (
        <BranchVideoTransition
          choice={transitioningChoice}
          onCommit={commitBranchTransition}
          onFinish={finishBranchTransition}
        />
      ) : null}

      {SHOW_DEV_HUD && hudVisible ? (
        <StoryHud
          runtime={runtime}
          controls={controls}
          copy={copy}
          sceneId={stageScene.id}
          sceneTitle={selectedSceneTitle}
          xrHint={stageScene.xr.note}
          xrMountHint={stageScene.xr.mountHint}
          onToggleSound={toggleSound}
          onToggleTextSpeed={toggleTextSpeed}
          onJumpToAct1={jumpToAct1}
          onJumpToAct2={jumpToAct2}
          onJumpToAct3={jumpToAct3}
          onRestart={restartStoryFlow}
          onHide={() => setHudVisible(false)}
        />
      ) : null}

      {SHOW_DEV_HUD && !hudVisible ? (
        <HudVisibilityButton onClick={() => setHudVisible(true)} />
      ) : null}
    </>
  );
}

type StoryHudProps = {
  runtime: StoryRuntimeState;
  controls: StoryControls;
  copy: (typeof messages)[Locale];
  sceneId: string;
  sceneTitle: string;
  xrHint: string;
  xrMountHint: string;
  onToggleSound: () => void;
  onToggleTextSpeed: () => void;
  onJumpToAct1: () => void;
  onJumpToAct2: () => void;
  onJumpToAct3: () => void;
  onRestart: () => void;
  onHide: () => void;
};

function StoryHud({
  runtime,
  controls,
  copy,
  sceneId,
  sceneTitle,
  xrHint,
  xrMountHint,
  onToggleSound,
  onToggleTextSpeed,
  onJumpToAct1,
  onJumpToAct2,
  onJumpToAct3,
  onRestart,
  onHide,
}: StoryHudProps) {
  return (
    <aside className="fixed right-4 top-4 z-[120] w-[min(340px,calc(100vw-2rem))] rounded-[24px] border border-white/10 bg-black/55 p-4 text-white shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.28em] text-white/44">
            Story core
          </div>
          <div className="mt-1 text-sm text-white/78">
            Scene registry / 2D shell / XR-ready contracts
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/42">
            XR bridge later
          </div>

          <button
            aria-label="Hide interface"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-sm text-white/56 transition hover:border-white/22 hover:bg-white/[0.07] hover:text-white/82"
            onClick={onHide}
            type="button"
          >
            ×
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-xs text-white/62">
        <HudRow label="stage" value={runtime.stage} />
        <HudRow label="scene id" value={sceneId} />
        <HudRow label="scene" value={sceneTitle} />
        <HudRow label="branch" value={runtime.selectedBranch ?? "—"} />
        <HudRow label="adapter" value="2D shell" />
        <HudRow label="xr mount" value={xrMountHint} />
        <HudRow label="sound" value={controls.soundEnabled ? "on" : "off"} />
        <HudRow label="text speed" value={controls.textSpeed} />
      </div>

      <div className="mt-4 rounded-[16px] border border-white/8 bg-white/[0.03] px-3 py-3 text-[12px] leading-[1.6] text-white/58">
        {xrHint}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <HudButton onClick={onToggleSound}>
          {controls.soundEnabled ? "Sound: on" : "Sound: off"}
        </HudButton>
        <HudButton onClick={onToggleTextSpeed}>Speed: {controls.textSpeed}</HudButton>
        <HudButton onClick={onJumpToAct1}>Act 01</HudButton>
        <HudButton onClick={onJumpToAct2}>Act 02</HudButton>
        <HudButton onClick={onJumpToAct3}>Act 03</HudButton>
        <HudButton onClick={onRestart}>{copy.ui.restartStory}</HudButton>
      </div>
    </aside>
  );
}

function HudVisibilityButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      aria-label="Show interface"
      className="fixed right-3 top-3 z-[120] flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-black/18 text-[10px] font-medium uppercase tracking-[0.18em] text-white/52 backdrop-blur-md transition hover:border-white/18 hover:bg-black/36 hover:text-white/82"
      onClick={onClick}
      type="button"
    >
      UI
    </button>
  );
}

function HudRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[16px] border border-white/8 bg-white/[0.03] px-3 py-2">
      <span className="uppercase tracking-[0.18em] text-white/34">{label}</span>
      <span className="truncate text-right text-white/76">{value}</span>
    </div>
  );
}

function HudButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      className="rounded-[16px] border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/78 transition hover:border-white/24 hover:bg-white/[0.08]"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
