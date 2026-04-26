import type { ChoiceId, PresentationMode, StoryControls, StoryRuntimeState, StoryStage } from "./storyTypes";

export const DEFAULT_CONTROLS: StoryControls = {
  soundEnabled: true,
  textSpeed: "normal",
  allowSkip: true,
  allowSkipToChoice: true,
};

export const DEFAULT_RUNTIME_STATE: StoryRuntimeState = {
  stage: "act1",
  selectedBranch: null,
  seenStages: [],
  seenBranches: [],
  mode: "web",
};

export function markStageSeen(seenStages: StoryStage[], stage: StoryStage) {
  return seenStages.includes(stage) ? seenStages : [...seenStages, stage];
}

export function markBranchSeen(seenBranches: ChoiceId[], branch: ChoiceId) {
  return seenBranches.includes(branch) ? seenBranches : [...seenBranches, branch];
}

export function moveToStage(current: StoryRuntimeState, nextStage: StoryStage): StoryRuntimeState {
  return {
    ...current,
    stage: nextStage,
    seenStages: markStageSeen(current.seenStages, nextStage),
  };
}

export function selectBranch(current: StoryRuntimeState, branch: ChoiceId): StoryRuntimeState {
  return {
    ...current,
    selectedBranch: branch,
    stage: "act3",
    seenStages: markStageSeen(current.seenStages, "act3"),
    seenBranches: markBranchSeen(current.seenBranches, branch),
  };
}

export function setPresentationMode(current: StoryRuntimeState, mode: PresentationMode): StoryRuntimeState {
  return {
    ...current,
    mode,
  };
}

export function resetStory(mode: PresentationMode = "web"): StoryRuntimeState {
  return {
    ...DEFAULT_RUNTIME_STATE,
    mode,
  };
}
