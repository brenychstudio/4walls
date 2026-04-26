import { getAct04RouteData } from "../actProgression";
import type { Act04RouteData } from "../actProgression";
import type { ChoiceId } from "../storyTypes";
import DoorAct04Scene from "./DoorAct04Scene";

type Props = {
  choice: ChoiceId | null;
  onChoose: (id: string) => void;
  onBackToVideo: () => void;
};

export default function Act04ConsequenceStage({
  choice,
  onChoose,
  onBackToVideo,
}: Props) {
  const route = getAct04RouteData(choice);

  if (choice === "door" && route) {
    return <DoorAct04Scene route={route as Act04RouteData} onChoose={onChoose} onBack={onBackToVideo} />;
  }

  if (!route) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-black text-white">
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-white/48">
            Act 04 / chamber of consequence
          </div>
          <div className="mt-6 max-w-[680px] text-[clamp(20px,2vw,30px)] leading-[1.5] text-white/86">
            Немає активної гілки. Повернись до відео й продовж історію.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#040605] text-white">
      <StageBackground mode={route.visualMode} />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1200px] flex-col px-6 py-8 md:px-10 md:py-10">
        <div className="flex items-start justify-between gap-4">
          <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-white/48 backdrop-blur-md">
            {route.act04Tag}
          </div>

          <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/38 backdrop-blur-md">
            {route.ambienceLabel}
          </div>
        </div>

        <div className="mt-10 grid flex-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div className="rounded-[28px] border border-white/10 bg-[rgba(6,12,9,0.48)] p-6 shadow-[0_0_80px_rgba(0,0,0,0.18)] backdrop-blur-xl md:p-8">
            <div className="text-[10px] uppercase tracking-[0.32em] text-[rgba(176,255,206,0.42)]">
              consequence log
            </div>

            <h2 className="mt-4 text-[clamp(28px,4vw,56px)] leading-[1.02] text-[rgba(242,255,246,0.94)]">
              {route.act04Title}
            </h2>

            <div className="mt-8 space-y-5 font-mono text-[clamp(15px,1.18vw,18px)] leading-[1.92] text-[rgba(220,255,232,0.76)]">
              {route.act04Body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {route.infectedMotifs.map((item) => (
                <div
                  key={item}
                  className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-4 text-[13px] leading-[1.7] text-[rgba(210,255,224,0.62)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div className="rounded-[28px] border border-white/10 bg-[rgba(6,12,9,0.42)] p-6 backdrop-blur-xl md:p-8">
              <div className="text-[10px] uppercase tracking-[0.32em] text-[rgba(176,255,206,0.42)]">
                infected choice
              </div>

              <div className="mt-4 text-[clamp(20px,2vw,30px)] leading-[1.3] text-[rgba(242,255,246,0.94)]">
                {route.act05Prompt}
              </div>

              <div className="mt-8 grid gap-4">
                {route.act05Options.map((option, index) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onChoose(option.id)}
                    className="group rounded-[24px] border border-white/10 bg-[rgba(8,18,12,0.44)] px-5 py-5 text-left transition-all duration-300 hover:border-[rgba(176,255,214,0.24)] hover:bg-[rgba(10,24,16,0.72)]"
                  >
                    <div className="text-[10px] uppercase tracking-[0.28em] text-[rgba(166,255,200,0.44)]">
                      choice 0{index + 1}
                    </div>

                    <div className="mt-3 text-[clamp(18px,1.45vw,24px)] leading-[1.35] text-[rgba(236,255,244,0.92)]">
                      {option.label}
                    </div>

                    <div className="mt-3 text-[13px] leading-[1.7] text-[rgba(204,255,220,0.58)]">
                      {option.summary}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                className="rounded-full border border-white/12 bg-black/28 px-5 py-3 text-sm text-white/82 backdrop-blur-md transition hover:border-white/24 hover:bg-black/42"
                onClick={onBackToVideo}
                type="button"
              >
                Назад до відео
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StageBackground({ mode }: { mode: "door" | "phone" | "wash" }) {
  if (mode === "door") {
    return (
      <>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(120,255,190,0.08),transparent_28%),linear-gradient(180deg,rgba(0,0,0,0.22),rgba(0,0,0,0.72))]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(124,255,190,0.18)_1px,transparent_1px)] [background-size:100%_4px]" />
      </>
    );
  }

  if (mode === "phone") {
    return (
      <>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(122,255,188,0.08),transparent_32%),linear-gradient(180deg,rgba(0,0,0,0.14),rgba(0,0,0,0.76))]" />
        <div className="absolute inset-0 opacity-[0.12] mix-blend-screen [background-image:repeating-linear-gradient(180deg,rgba(235,255,240,0.08)_0px,rgba(235,255,240,0.08)_1px,transparent_2px,transparent_6px)]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(90deg,transparent,rgba(130,255,188,0.16),transparent)]" />
      </>
    );
  }

  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(120,255,190,0.06),transparent_30%),linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.8))]" />
      <div className="absolute inset-0 opacity-[0.14] bg-[radial-gradient(circle_at_24%_28%,rgba(255,255,255,0.16),transparent_12%),radial-gradient(circle_at_56%_42%,rgba(255,255,255,0.10),transparent_12%),radial-gradient(circle_at_76%_66%,rgba(255,255,255,0.14),transparent_14%)]" />
      <div className="absolute inset-0 opacity-[0.09] [background-image:radial-gradient(circle_at_center,rgba(178,255,206,0.9)_0.6px,transparent_0.7px)] [background-size:18px_18px]" />
    </>
  );
}
