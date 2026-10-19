"use client";

import { wedding } from "@/config/wedding";

export function Cover({
  guestName,
  onOpen,
}: {
  guestName: string;
  onOpen: () => void;
}) {
  return (
    <section className="cover relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 py-10 text-center text-white">
      <div
        className="cover-image absolute inset-0"
        style={{ backgroundImage: `url("${wedding.coverPhoto}")` }}
      />
      <div className="cover-shade absolute inset-0" />
      <div className="cover-frame pointer-events-none absolute inset-3 sm:inset-6" />
      <div className="cover-card relative z-10 mx-auto flex min-h-[76svh] w-full max-w-md flex-col items-center justify-center px-6 py-12 sm:px-10">
        <div className="cover-monogram mb-7 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/60 font-serif text-base leading-none">
          <span className="whitespace-nowrap">R<span className="text-[#bde6df]">&amp;</span>N</span>
        </div>
        <p className="eyebrow mb-5 text-[9px] text-white/85 sm:text-[10px]">
          UNDANGAN PERNIKAHAN
        </p>
        <p className="font-serif text-base italic text-white/90 sm:text-lg">
          The Wedding Of
        </p>
        <h1 className="mt-5 font-serif text-5xl font-normal leading-[1.02] tracking-tight sm:text-6xl">
          {wedding.bride.shortName}
          <span className="my-2 block font-serif text-3xl italic text-[#bde6df]">
            &amp;
          </span>
          {wedding.groom.shortName}
        </h1>
        <div className="cover-divider my-6 h-px w-14" />
        <p className="eyebrow text-[9px] sm:text-[10px]">
          {wedding.dateLabel.toUpperCase()}
        </p>
        <div className="mt-8">
          <p className="font-serif text-sm italic text-white/80">Kepada Yth.</p>
          <p className="mt-1 text-[10px] tracking-wide text-white/75">
            Bapak/Ibu/Saudara/i
          </p>
          <p className="mt-2 break-words font-serif text-xl text-white">
            {guestName}
          </p>
        </div>
        <button
          onClick={onOpen}
          className="cover-open mt-8 rounded-full border border-white/70 px-7 py-3 text-[10px] tracking-[.18em] transition duration-300 hover:bg-white hover:text-[#236e64] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span aria-hidden="true">✉</span>&nbsp;&nbsp; BUKA UNDANGAN
        </button>
        <p className="mt-8 text-[8px] tracking-[.28em] text-white/65">
          DENGAN CINTA DAN DOA
        </p>
      </div>
      <span className="absolute bottom-5 text-[8px] tracking-[.3em] text-white/70">
        SCROLL UNTUK MELIHAT
      </span>
    </section>
  );
}
