import type { StoryChoiceContract, VoiceTrackContract } from "./storyContracts";

export const STORY_PAUSE_TOKEN = "[[PAUSE]]";

export const ACT2_INTRO_BODY_PART_1 = `Світло приглушеної лампи створювало на стінах тіні, що невпинно ворушилися, немов химерні створіння з іншого світу. Камера повільно наближається до дверного вічка, фокусуючись на межі між кімнатою і тим, що лишається за порогом.`;

export const ACT2_INTRO_BODY_PART_2 = `Повітря в кімнаті вже не здається нерухомим. Воно ніби слухає. Кожен дрібний звук набуває іншої ваги, а тиша між ними починає тиснути сильніше, ніж сам шум. Простір поводиться так, ніби чекає на жест, який щось відкриє.`;

export const ACT2_INTRO_BODY_PART_3 = `Ще нічого не сталося остаточно, але відчуття вже змінилося: предмети більше не виглядають нейтральними, а кімната перестає бути тільки кімнатою. Двері, телефон і вода починають існувати як три різні способи входу в інший стан.`;

export const ACT2_INTRO_BODY = ACT2_INTRO_BODY_PART_1;

export const ACT2_INTRO_LOCALES = {
  uk: {
    bodyText: ACT2_INTRO_BODY,
    choiceBadge: "Нова глава / вибір дії",
    choiceLead: "Вибір маршруту",
  },
} as const;

export const ACT2_TEMP_VOICE_TRACKS: Partial<Record<"uk" | "en" | "es", VoiceTrackContract>> = {
  uk: {
    mode: "browserTts",
    locale: "uk",
    rate: 0.92,
    pitch: 0.92,
    volume: 0.88,
  },
};

export const ACT2_ROUTE_CHOICES: StoryChoiceContract[] = [
  {
    id: "door",
    routeLabel: "route 01",
    label: "подивитись у вічко",
    summary: "Підійти до дверей і ввійти в поріг невідомої присутності.",
    localeReady: {
      uk: {
        label: "подивитись у вічко",
        summary: "Підійти до дверей і ввійти в поріг невідомої присутності.",
      },
    },
    xrPortalHint: "portal-choice",
  },
  {
    id: "phone",
    routeLabel: "route 02",
    label: "підняти слухавку",
    summary: "Підняти слухавку і прийняти зламаний виклик із темряви.",
    localeReady: {
      uk: {
        label: "підняти слухавку",
        summary: "Підняти слухавку і прийняти зламаний виклик із темряви.",
      },
    },
    xrPortalHint: "portal-choice",
  },
  {
    id: "wash",
    routeLabel: "route 03",
    label: "вмити лице",
    summary: "Вмити лице й зустрітись із тріщиною у власному відображенні.",
    localeReady: {
      uk: {
        label: "вмити лице",
        summary: "Вмити лице й зустрітись із тріщиною у власному відображенні.",
      },
    },
    xrPortalHint: "portal-choice",
  },
];

