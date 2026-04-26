import type { ChoiceId } from "../storyTypes";
import { BRANCH_SCENES } from "../storyConfig";

type Props = {
  choice: ChoiceId | null;
  onRestart?: () => void;
  onBackToAct2?: () => void;
};

export default function Act03Placeholder({ choice, onRestart, onBackToAct2 }: Props) {
  if (!choice) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center px-6 py-20">
          <div>
            <div className="text-xs uppercase tracking-[0.42em] text-white/45">Act 03</div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">Branch is not selected yet.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/68">
              This screen exists only as a safe shell fallback. Act 03 should mount from the outer story controller,
              not from Act 02 itself.
            </p>
            {onBackToAct2 ? (
              <button
                className="mt-8 rounded-full border border-white/16 px-5 py-3 text-sm tracking-[0.18em] text-white/82 transition hover:border-white/28 hover:bg-white/6"
                onClick={onBackToAct2}
              >
                Return to Act 02
              </button>
            ) : null}
          </div>
        </div>
      </main>
    );
  }

  const scene = BRANCH_SCENES[choice];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-20">
        <div className="w-full rounded-[32px] border border-white/10 bg-white/[0.03] p-8 shadow-[0_0_80px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-12">
          <div className="text-xs uppercase tracking-[0.42em] text-white/45">Act 03 placeholder</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{scene.title}</h1>
          <div className="mt-3 text-sm uppercase tracking-[0.22em] text-white/42">{scene.subtitle}</div>
          <p className="mt-8 max-w-2xl text-base leading-7 text-white/72">{scene.summary}</p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <InfoCard label="ambience key" value={scene.ambienceKey} />
            <InfoCard label="video key" value={scene.videoKey} />
            <InfoCard label="webxr seed space" value={scene.webxrSeedSpace} />
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {onBackToAct2 ? (
              <button
                className="rounded-full border border-white/16 px-5 py-3 text-sm tracking-[0.18em] text-white/82 transition hover:border-white/28 hover:bg-white/6"
                onClick={onBackToAct2}
              >
                Back to choices
              </button>
            ) : null}
            {onRestart ? (
              <button
                className="rounded-full border border-white/16 px-5 py-3 text-sm tracking-[0.18em] text-white/82 transition hover:border-white/28 hover:bg-white/6"
                onClick={onRestart}
              >
                Restart story
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.02] p-4">
      <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">{label}</div>
      <div className="mt-3 text-sm text-white/76">{value}</div>
    </div>
  );
}
