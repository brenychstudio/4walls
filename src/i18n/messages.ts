export const messages = {
  uk: {
    language: {
      label: "Мова",
      uk: "Українська",
      en: "English",
    },
    ui: {
      xrThreshold: "XR Threshold",
      continueToAct04: "Продовжити в Act 04",
      backToChoice: "Назад до вибору",
      restartStory: "Restart story",
      returnToAct02: "Повернутись до Act 02",
      continueFromXr: "Продовжити в Act 04",
      branchNotSelected: "Branch ще не вибраний. Повернись до другого акту і обери маршрут.",
      act03BranchVideo: "Act 03 / branch video",
      act03BranchPlayback: "Act 03 / branch playback",
      videoNode: "video node",
      activeRoute: "active route",
      xrThresholdLabel: "4walls / xr threshold",
    },
  },
  en: {
    language: {
      label: "Language",
      uk: "Українська",
      en: "English",
    },
    ui: {
      xrThreshold: "XR Threshold",
      continueToAct04: "Continue to Act 04",
      backToChoice: "Back to choices",
      restartStory: "Restart story",
      returnToAct02: "Return to Act 02",
      continueFromXr: "Continue to Act 04",
      branchNotSelected: "No branch selected yet. Return to Act 02 and choose a route.",
      act03BranchVideo: "Act 03 / branch video",
      act03BranchPlayback: "Act 03 / branch playback",
      videoNode: "video node",
      activeRoute: "active route",
      xrThresholdLabel: "4walls / xr threshold",
    },
  },
} as const;

export type Locale = keyof typeof messages;
