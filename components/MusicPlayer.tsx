"use client";

import { useRef, useState } from "react";

function formatTime(time: number) {
  if (!Number.isFinite(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function MusicPlayer({ src }: { src: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  async function toggle() {
    if (!audio.current) return;
    if (!audio.current.paused) {
      audio.current.pause();
    } else {
      try {
        await audio.current.play();
      } catch {
        setPlaying(false);
      }
    }
  }

  function seek(value: string) {
    if (!audio.current) return;
    const time = Number(value);
    audio.current.currentTime = time;
    setCurrentTime(time);
  }

  return (
    <section className="music-section px-4 pb-7 pt-12 sm:pb-9 sm:pt-16" aria-label="Musik undangan">
      <div className="music-card mx-auto flex max-w-md items-center gap-4 rounded-4xl px-4 py-3.5 sm:gap-5 sm:px-5">
        <audio
          ref={audio}
          src={src}
          loop
          preload="metadata"
          onPause={() => setPlaying(false)}
          onPlaying={() => setPlaying(true)}
          onWaiting={() => setPlaying(false)}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onDurationChange={(event) => setDuration(event.currentTarget.duration)}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        />
        <div className={`music-record ${playing ? "is-playing" : ""}`} aria-hidden="true">
          <span className="music-record-label"></span>
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-bold text-lg text-[#236e64] sm:text-xl">Kota ini tak sama tanpamu</h2>
          <p className="truncate text-xs text-[#315c55]">Nadhif Basalamah</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[9px] tabular-nums text-[#315c55]">{formatTime(currentTime)}</span>
            <input
              aria-label="Posisi audio"
              className="music-seek min-w-0 flex-1"
              type="range"
              min="0"
              max={duration || 0}
              step="1"
              value={Math.min(currentTime, duration || 0)}
              onChange={(event) => seek(event.target.value)}
            />
            <span className="text-[9px] tabular-nums text-[#315c55]">{formatTime(duration)}</span>
          </div>
        </div>
        <button
          onClick={toggle}
          aria-label={playing ? "Jeda musik" : "Putar musik"}
          className="music-play-button grid size-11 shrink-0 place-items-center rounded-full bg-[#bde6df] text-[#174f49] shadow-md sm:size-12"
          title={playing ? "Jeda musik" : "Putar musik"}
        >
          {playing ? <span className="text-base font-bold">||</span> : <span className="ml-0.5 text-sm">▶</span>}
        </button>
      </div>
    </section>
  );
}
