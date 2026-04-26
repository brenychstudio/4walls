import type { ChoiceId } from "./storyTypes";

export type Act05Option = {
  id: string;
  label: string;
  summary: string;
};

export type Act04RouteData = {
  visualMode: "door" | "phone" | "wash";
  act04Tag: string;
  act04Title: string;
  act04Body: string[];
  ambienceLabel: string;
  infectedMotifs: string[];
  act05Prompt: string;
  act05Options: [Act05Option, Act05Option];
};

export const ACT04_ROUTE_DATA: Record<ChoiceId, Act04RouteData> = {
  door: {
    visualMode: "door",
    act04Tag: "Act 04 / chamber of consequence",
    act04Title: "threshold remains open",
    act04Body: [
      "Застиглий кадр після вічка не зникає одразу. Він тримається на екрані, ніби поріг не хоче відпускати погляд. Текст починає друкуватися поверх нього в іншому ритмі: іноді помиляється, стирає себе, друкує слово вдруге.",
      "Квартира повертається, але вже інакше. На кухні ніж ріже хліб надто чітко, а тиша між рухами здається густішою за повітря. Далекі сирени повільно вростають у простір.",
      "Телефон більше не здається окремим предметом. Його дзвінок ніби приходить із-за дверей. Дзеркало більше не просто відображає кімнату - в ньому коротко проступає коридор.",
    ],
    ambienceLabel: "distant sirens / room pressure / threshold hum",
    infectedMotifs: [
      "телефон звучить так, ніби він по той бік дверей",
      "дзеркало коротко показує коридор замість кімнати",
      "лампа поводиться як прикордонний сигнал, а не як джерело світла",
    ],
    act05Prompt: "Після порогу залишається тільки два жести контролю.",
    act05Options: [
      {
        id: "door-light-off",
        label: "виключити світло у кімнаті",
        summary: "Відрізати видиме і залишити тільки слух та присутність.",
      },
      {
        id: "door-check-lock",
        label: "перевірити замок",
        summary: "Торкнутися межі й перевірити, чи вона ще тримається.",
      },
    ],
  },

  phone: {
    visualMode: "phone",
    act04Tag: "Act 04 / chamber of consequence",
    act04Title: "signal keeps assembling the body",
    act04Body: [
      "Після дзвінка зображення не повертається до норми. Екран поводиться як старий телевізор, що втрачає синхронізацію. Кадр дробиться, ніби хтось намагається зібрати героя заново через помехи.",
      "У дзеркалі фігура не збігається сама з собою. Частини обличчя приходять із затримкою, очі з'являються уривками, а рух ніби відстає від власного сигналу.",
      "Стук у двері починає жити в тому самому ритмі, що й старий дзвінок. Записки й фотографії вже виглядають не як архів, а як носії повідомлення.",
    ],
    ambienceLabel: "signal drift / sync crackle / delayed room tone",
    infectedMotifs: [
      "стук у двері повторює ритм дзвінка",
      "дзеркало відображає із затримкою, ніби ловить перешкоди",
      "фото і картки виглядають як повідомлення, а не пам'ять",
    ],
    act05Prompt: "Сигнал не обривається сам. Його або гасять, або лишають відкритим.",
    act05Options: [
      {
        id: "phone-cover-curtains",
        label: "заслонити штори",
        summary: "Відрізати зовнішній світ і залишитись із сигналом усередині.",
      },
      {
        id: "phone-dont-hang-up",
        label: "не класти слухавку",
        summary: "Не переривати контакт і дозволити голосу залишитись у кімнаті.",
      },
    ],
  },

  wash: {
    visualMode: "wash",
    act04Tag: "Act 04 / chamber of consequence",
    act04Title: "self dissolves into pattern",
    act04Body: [
      "Темрява після води не порожня. У ній проступають нейронні зв'язки, ніби павутина або сузір'я, що то спалахують, то щезають. Текст друкується збоку, не в центрі, ніби хтось записує цю сцену не зсередини, а з периферії.",
      "Звук іде хвилями: то наближається, то відходить. Простір дихає повільно, але неприродно. Телефон уже не дзвонить як телефон - він звучить, ніби з-під води або зсередини тіла.",
      "Двері стають не межею, а мембраною. Фото дитинства і старі записки виглядають як розмокла пам'ять, якій більше не можна довіряти повністю.",
    ],
    ambienceLabel: "surreal surge / wet hum / internal resonance",
    infectedMotifs: [
      "дзвінок звучить приглушено, ніби з-під води",
      "двері читаються як мембрана, а не тверда межа",
      "фото і записки стають нестійкими уламками пам'яті",
    ],
    act05Prompt: "Після розчинення лишається або здатися сну, або торкнутися живого.",
    act05Options: [
      {
        id: "wash-go-sleep",
        label: "піти спати",
        summary: "Увійти в ще глибший стан і віддатися темряві повністю.",
      },
      {
        id: "wash-water-plant",
        label: "полити вазонок",
        summary: "Торкнутися життя, яке ще тримається в тиші квартири.",
      },
    ],
  },
};

export function getAct04RouteData(choice: ChoiceId | null) {
  return choice ? ACT04_ROUTE_DATA[choice] : null;
}

export function getAct05Option(choice: ChoiceId | null, optionId: string | null) {
  if (!choice || !optionId) return null;
  const route = ACT04_ROUTE_DATA[choice];
  return route.act05Options.find((item) => item.id === optionId) ?? null;
}
