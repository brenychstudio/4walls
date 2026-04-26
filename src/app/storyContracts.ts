import type { ChoiceId } from "./storyTypes";

export type StoryContractStage = "act1" | "act2" | "act3";
export type SceneViewKind = "preloader" | "terminalChapter" | "branchPlaceholder";
export type XRMountHint = "glyph-entry" | "void-text" | "portal-choice" | "memory-room";
export type SupportedLocale = "uk" | "en" | "es";

export type VoiceTrackMode = "none" | "browserTts" | "audioFile";

export type VoiceTrackContract = {
  mode: VoiceTrackMode;
  locale: SupportedLocale;
  src?: string;
  voiceKey?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
};

export type StoryChoiceContract = {
  id: ChoiceId;
  routeLabel: string;
  label: string;
  summary: string;
  xrPortalHint: XRMountHint;
  localeReady?: Partial<
    Record<
      SupportedLocale,
      {
        label: string;
        summary: string;
      }
    >
  >;
};

type BaseSceneContract = {
  id: string;
  stage: StoryContractStage;
  view: SceneViewKind;
  title: string;
  eyebrow: string;
  ambienceId?: string;
  xr: {
    ready: boolean;
    mountHint: XRMountHint;
    note: string;
  };
};

export type PreloaderSceneContract = BaseSceneContract & {
  view: "preloader";
  brand: string;
  enterLabel: string;
};

export type TerminalChapterSceneContract = BaseSceneContract & {
  view: "terminalChapter";
  chapterIndex: string;
  bodyText: string;
  choiceBadge: string;
  choiceLead: string;
  choices: StoryChoiceContract[];
  localeReady?: Partial<
    Record<
      SupportedLocale,
      {
        bodyText: string;
        choiceBadge: string;
        choiceLead: string;
      }
    >
  >;
  voiceTracks?: Partial<Record<SupportedLocale, VoiceTrackContract>>;
};

export type BranchPlaceholderSceneContract = BaseSceneContract & {
  view: "branchPlaceholder";
};

export type StorySceneContract =
  | PreloaderSceneContract
  | TerminalChapterSceneContract
  | BranchPlaceholderSceneContract;
