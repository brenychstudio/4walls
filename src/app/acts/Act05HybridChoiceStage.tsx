import { getAct04RouteData, getAct05Option } from "../actProgression";
import type { ChoiceId } from "../storyTypes";

type Props = {
  choice: ChoiceId | null;
  optionId: string | null;
  onBackToAct4: () => void;
  onRestart: () => void;
};

export default function Act05HybridChoiceStage({
  choice,
  optionId,
  onBackToAct4,
  onRestart,
}: Props) {
  const route = getAct04RouteData(choice);
  const option = getAct05Option(choice, optionId);

  if (!route || !option) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-black text-white">
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-white/48">
            Act 05 / infected choice
          </div>
          <div className="mt-6 max-w-[680px] text-[clamp(20px,2vw,30px)] leading-[1.5] text-white/86">
            Ще не вибрано другий маршрут.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#030504] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(120,255,190,0.08),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.8))]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1100px] flex-col justify-between px-6 py-8 md:px-10 md:py-10">
        <div className="flex items-start justify-between gap-4">
          <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-white/48 backdrop-blur-md">
            Act 05 / infected choice
          </div>

          <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/38 backdrop-blur-md">
            foundation active
          </div>
        </div>

        <div className="max-w-[820px]">
          <div className="text-[10px] uppercase tracking-[0.32em] text-[rgba(176,255,206,0.42)]">
            selected route
          </div>

          <h2 className="mt-4 text-[clamp(30px,4vw,62px)] leading-[1.02] text-[rgba(242,255,246,0.94)]">
            {option.label}
          </h2>

          <p className="mt-5 max-w-[620px] text-[16px] leading-[1.9] text-[rgba(220,255,232,0.7)]">
            {option.summary}
          </p>

          <div className="mt-8 rounded-[26px] border border-white/10 bg-[rgba(8,14,11,0.42)] p-6 backdrop-blur-xl">
            <div className="text-[10px] uppercase tracking-[0.32em] text-[rgba(176,255,206,0.42)]">
              next implementation slot
            </div>

            <div className="mt-4 text-[15px] leading-[1.85] text-[rgba(220,255,232,0.72)]">
              Тут ми підв'яжемо другий рівень розвитку історії: окреме відео / текстову інтермедію /
              новий visual state для маршруту <span className="text-white/88">{option.label}</span>.
              Основа graph-logic уже зафіксована, тому тепер можна нарощувати контент без втрати структури.
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {route.infectedMotifs.map((item) => (
                <div
                  key={item}
                  className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4 text-[13px] leading-[1.7] text-[rgba(210,255,224,0.58)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <button
            className="rounded-full border border-white/12 bg-black/28 px-5 py-3 text-sm text-white/82 backdrop-blur-md transition hover:border-white/24 hover:bg-black/42"
            onClick={onBackToAct4}
            type="button"
          >
            Назад до Act 04
          </button>

          <button
            className="rounded-full border border-white/12 bg-black/28 px-5 py-3 text-sm text-white/82 backdrop-blur-md transition hover:border-white/24 hover:bg-black/42"
            onClick={onRestart}
            type="button"
          >
            Restart story
          </button>
        </div>
      </div>
    </section>
  );
}
