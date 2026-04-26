import type { BranchSceneDescriptor, StoryStage } from "./storyTypes";

export const STORY_TITLE = "Friend Never Seen";

export const ACT_ORDER: StoryStage[] = ["act1", "act2", "act3"];

export const BRANCH_SCENES: Record<BranchSceneDescriptor["id"], BranchSceneDescriptor> = {
  door: {
    id: "door",
    title: "Door branch",
    subtitle: "Threshold / peephole / corridor void",
    summary: "Act 03 placeholder for the monochrome door sequence and the first confrontation with absence.",
    ambienceKey: "door-threshold",
    videoKey: "door-branch-video",
    webxrSeedSpace: "threshold-room",
  },
  phone: {
    id: "phone",
    title: "Phone branch",
    subtitle: "Signal / voice / broken call",
    summary: "Act 03 placeholder for the monochrome phone sequence, distant call texture, and signal fracture.",
    ambienceKey: "phone-signal",
    videoKey: "phone-branch-video",
    webxrSeedSpace: "signal-void",
  },
  wash: {
    id: "wash",
    title: "Wash branch",
    subtitle: "Mirror / water / split perception",
    summary: "Act 03 placeholder for the monochrome mirror-and-water sequence and the perceptual split.",
    ambienceKey: "wash-mirror",
    videoKey: "wash-branch-video",
    webxrSeedSpace: "mirror-room",
  },
};

export const SYSTEM_CAPABILITIES = {
  soundSystemPlanned: true,
  stateBasedAudioPlanned: true,
  replaySystemPlanned: true,
  skipSystemPlanned: true,
  webxrModeReserved: true,
  webxrRuntimeReady: false,
} as const;
