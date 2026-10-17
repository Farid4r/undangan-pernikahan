"use client";

import { useRef, useState } from "react";

export function MusicPlayer({ src }: { src: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  async function toggle() {
    if (!audio.current) return;
    if (playing) { audio.current.pause(); setPlaying(false); }
    else { try { await audio.current.play(); setPlaying(true); } catch { setPlaying(false); } }
  }
  return <><audio ref={audio} src={src} loop preload="none" onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} /><button onClick={toggle} aria-label={playing ? "Jeda musik" : "Putar musik"} className="music-player-button fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-[#236e64] text-xl text-white shadow-lg" title={playing ? "Jeda musik" : "Putar musik"}>{playing ? "Ⅱ" : "♫"}</button></>;
}
