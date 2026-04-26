import { useMemo, useState } from "react";

import { messages, type Locale } from "../../i18n/messages";
import { ACT03_BRANCH_MEDIA } from "../projectMedia";
import type { ChoiceId } from "../storyTypes";

type Props = {
  choice: ChoiceId | null;
  locale: Locale;
  onRestart: () => void;
  onBackToAct2: () => void;
  onContinue: () => void;
};

export default function Act03BranchVideoStage({
  choice,
  locale,
  onRestart,
  onBackToAct2,
  onContinue,
}: Props) {
  const [videoError, setVideoError] = useState(false);
  const copy = messages[locale];

  const asset = useMemo(() => {
    if (!choice) return null;
    return ACT03_BRANCH_MEDIA[choice];
  }, [choice]);

  if (!asset) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-black text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(120,255,190,0.1),transparent_38%)]" />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-white/48">
            {copy.ui.act03BranchVideo}
          </div>

          <div className="mt-6 max-w-[680px] text-[clamp(20px,2vw,30px)] leading-[1.5] text-white/86">
            {copy.ui.branchNotSelected}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm text-white/78 transition hover:border-white/24 hover:bg-white/[0.08]"
              onClick={onBackToAct2}
              type="button"
            >
              {copy.ui.returnToAct02}
            </button>

            <button
              className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm text-white/78 transition hover:border-white/24 hover:bg-white/[0.08]"
              onClick={onRestart}
              type="button"
            >
              {copy.ui.restartStory}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(120,255,190,0.08),transparent_40%)]" />

      {!videoError ? (
        <video
          key={asset.src}
          className="absolute inset-0 h-full w-full object-cover"
          src={asset.src}
          autoPlay
          loop
          playsInline
          preload="auto"
          onError={() => setVideoError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-6 py-5 text-center text-white/68">
            {asset.src}
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.46),rgba(0,0,0,0.18)_30%,rgba(0,0,0,0.62))]" />

      <div className="relative z-10 flex min-h-screen flex-col justify-between px-6 py-6 md:px-10 md:py-8">
        <div className="flex items-start justify-between gap-4">
          <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-white/54 backdrop-blur-md">
            {copy.ui.act03BranchPlayback}
          </div>

          <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/44 backdrop-blur-md">
            {copy.ui.videoNode}
          </div>
        </div>

        <div className="max-w-[760px]">
          <div className="text-[11px] uppercase tracking-[0.34em] text-white/42">
            {copy.ui.activeRoute}
          </div>

          <h2 className="mt-3 text-[clamp(28px,4vw,56px)] leading-[1.04] text-white/92">
            {asset.title}
          </h2>

          <p className="mt-4 max-w-[620px] text-[15px] leading-[1.8] text-white/68">
            {asset.summary}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              className="rounded-full border border-white/12 bg-black/28 px-5 py-3 text-sm text-white/82 backdrop-blur-md transition hover:border-white/24 hover:bg-black/42"
              onClick={onBackToAct2}
              type="button"
            >
              {copy.ui.backToChoice}
            </button>

            <button
              className="rounded-full border border-white/12 bg-black/28 px-5 py-3 text-sm text-white/82 backdrop-blur-md transition hover:border-white/24 hover:bg-black/42"
              onClick={onContinue}
              type="button"
            >
              {copy.ui.continueToAct04}
            </button>

            <button
              className="rounded-full border border-white/12 bg-black/28 px-5 py-3 text-sm text-white/82 backdrop-blur-md transition hover:border-white/24 hover:bg-black/42"
              onClick={onRestart}
              type="button"
            >
              {copy.ui.restartStory}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
