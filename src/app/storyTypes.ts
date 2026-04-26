export type StoryStage = "act1" | "act2" | "act3";

export type ChoiceId = "door" | "phone" | "wash";

export type TextSpeed = "normal" | "fast" | "ultra";

export type PresentationMode = "web" | "webxr";

export type StoryControls = {
  soundEnabled: boolean;
  textSpeed: TextSpeed;
  allowSkip: boolean;
  allowSkipToChoice: boolean;
};

export type StoryRuntimeState = {
  stage: StoryStage;
  selectedBranch: ChoiceId | null;
  seenStages: StoryStage[];
  seenBranches: ChoiceId[];
  mode: PresentationMode;
};

export type BranchSceneDescriptor = {
  id: ChoiceId;
  title: string;
  subtitle: string;
  summary: string;
  ambienceKey: string;
  videoKey: string;
  webxrSeedSpace: string;
};
