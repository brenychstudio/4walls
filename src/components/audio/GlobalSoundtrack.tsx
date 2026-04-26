import { useEffect, useRef } from "react";

type Props = {
  src: string;
  enabled: boolean;
  active: boolean;
  volume?: number;
};

export default function GlobalSoundtrack({
  src,
  enabled,
  active,
  volume = 0.4,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const shouldPlay = enabled && active;

    if (!shouldPlay) {
      audio.pause();
      return;
    }

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Browser autoplay може чекати першої взаємодії користувача.
      });
    }
  }, [active, enabled, src]);

  return <audio ref={audioRef} src={src} preload="auto" />;
}
