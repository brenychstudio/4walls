import type { ChoiceId } from "./storyTypes";

export const GLOBAL_SOUNDTRACK = {
  src: "/fourwalls/audio/main-theme.mp3",
  volume: 0.42,
  startFromStage: "act2" as const,
};

export type Act03BranchMedia = {
  title: string;
  summary: string;
  src: string;
};

export const ACT03_BRANCH_MEDIA: Record<ChoiceId, Act03BranchMedia> = {
  door: {
    title: "подивитись у вічко",
    summary: "Поріг, дверне вічко і напруга порожнього коридору.",
    src: "/fourwalls/act03/door.mp4",
  },
  phone: {
    title: "підняти слухавку",
    summary: "Зламаний сигнал, голос у темряві й відлуння присутності.",
    src: "/fourwalls/act03/phone.mp4",
  },
  wash: {
    title: "вмити лице",
    summary: "Вода, дзеркало і поступове роздвоєння сприйняття.",
    src: "/fourwalls/act03/wash.mp4",
  },
};
