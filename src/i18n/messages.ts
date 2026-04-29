export const messages = {
  uk: {
    language: {
      label: "Мова",
      uk: "Українська",
      en: "English",
    },
    ui: {
      act03BranchVideo: "Act 03 / branch video",
      branchNotSelected: "Branch ще не вибраний. Повернись до другого акту і обери маршрут.",
      returnToAct02: "Повернутись до Act 02",
      restartStory: "Restart story",
      act03BranchPlayback: "Act 03 / branch playback",
      videoNode: "video node",
      activeRoute: "active route",
      backToChoice: "Назад до вибору",
      continueToAct04: "Продовжити в Act 04",
      xrOptionalDoor: "XR Threshold · опційно",
      xrThresholdLabel: "4walls / xr threshold",
      continueFromXr: "Продовжити в Act 04",
      xrThreshold: "XR Threshold",
    },
  },
  en: {
    language: {
      label: "Language",
      uk: "Українська",
      en: "English",
    },
    ui: {
      act03BranchVideo: "Act 03 / branch video",
      branchNotSelected: "No branch selected yet. Return to Act 02 and choose a route.",
      returnToAct02: "Return to Act 02",
      restartStory: "Restart story",
      act03BranchPlayback: "Act 03 / branch playback",
      videoNode: "video node",
      activeRoute: "active route",
      backToChoice: "Back to choice",
      continueToAct04: "Continue to Act 04",
      xrOptionalDoor: "XR Threshold · optional",
      xrThresholdLabel: "4walls / xr threshold",
      continueFromXr: "Continue to Act 04",
      xrThreshold: "XR Threshold",
    },
  },
} as const;

export type Locale = keyof typeof messages;
