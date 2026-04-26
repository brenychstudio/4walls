import type {
  BranchPlaceholderSceneContract,
  PreloaderSceneContract,
  StoryContractStage,
  StorySceneContract,
  TerminalChapterSceneContract,
} from "./storyContracts";
import type { ChoiceId } from "./storyTypes";
import {
  ACT2_INTRO_BODY,
  ACT2_INTRO_LOCALES,
  ACT2_ROUTE_CHOICES,
  ACT2_TEMP_VOICE_TRACKS,
} from "./storyMedia";

export const ACT1_PRELOADER_SCENE: PreloaderSceneContract = {
  id: "act1.preloader",
  stage: "act1",
  view: "preloader",
  title: "Glyph rain entry",
  eyebrow: "Preloader / glyph rain",
  ambienceId: "ambience.act1.cold-signal",
  brand: "FOUR WALLS",
  enterLabel: "ENTER",
  xr: {
    ready: true,
    mountHint: "glyph-entry",
    note: "Spatial glyph-entry staging can be added later via XR bridge.",
  },
};

export const ACT2_TERMINAL_SCENE: TerminalChapterSceneContract = {
  id: "act2.chapter-intro",
  stage: "act2",
  view: "terminalChapter",
  title: "Chapter interlude",
  eyebrow: "Chapter interlude / terminal story",
  ambienceId: "ambience.act2.room-tone",
  chapterIndex: "I",
  bodyText: ACT2_INTRO_BODY,
  choiceBadge: "Нова глава / вибір дії",
  choiceLead: "Вибір маршруту",
  choices: ACT2_ROUTE_CHOICES,
  localeReady: ACT2_INTRO_LOCALES,
  voiceTracks: ACT2_TEMP_VOICE_TRACKS,
  xr: {
    ready: true,
    mountHint: "void-text",
    note: "The same node can later render as spatial text + portal choices in XR.",
  },
};

export const ACT3_BRANCH_PLACEHOLDER_SCENE: BranchPlaceholderSceneContract = {
  id: "act3.branch-placeholder",
  stage: "act3",
  view: "branchPlaceholder",
  title: "Branch placeholder",
  eyebrow: "Act 03 / placeholder",
  ambienceId: "ambience.act3.branch-silence",
  xr: {
    ready: true,
    mountHint: "memory-room",
    note: "Act 03 can later map to memory-room staging in XR.",
  },
};

const STAGE_SCENES: Record<StoryContractStage, StorySceneContract> = {
  act1: ACT1_PRELOADER_SCENE,
  act2: ACT2_TERMINAL_SCENE,
  act3: ACT3_BRANCH_PLACEHOLDER_SCENE,
};

export const BRANCH_SCENE_TITLES: Record<ChoiceId, string> = {
  door: "Door branch / threshold scene",
  phone: "Phone branch / broken signal scene",
  wash: "Wash branch / mirror split scene",
};

export function getStageScene(stage: StoryContractStage): StorySceneContract {
  return STAGE_SCENES[stage];
}

export function getAct2Scene(): TerminalChapterSceneContract {
  return ACT2_TERMINAL_SCENE;
}

export function getBranchSceneTitle(choice: ChoiceId | null | undefined): string {
  return choice ? BRANCH_SCENE_TITLES[choice] : "—";
}
