"use client";

import { wedding } from "@/config/wedding";

export function Cover({ guestName, onOpen }: { guestName: string; onOpen: () => void }) {
  return <section className="cover relative flex min-h-[100svh] items-center justify-center px-6 py-16 text-center text-white">
    <div className="cover-image absolute inset-0" /><div className="cover-shade absolute inset-0" />
    <div className="relative z-10 mx-auto max-w-xl">
      <p className="eyebrow mb-7 text-[10px] text-white/85 sm:text-xs">UNDANGAN PERNIKAHAN</p>
      <p className="font-serif text-lg italic sm:text-xl">The wedding of</p>
      <h1 className="mt-3 font-serif text-6xl font-light leading-[1.05] tracking-tight sm:text-8xl">{wedding.bride.shortName}<span className="block text-4xl italic text-[#d8eee8] sm:text-6xl">&amp;</span>{wedding.groom.shortName}</h1>
      <div className="mx-auto my-7 h-px w-16 bg-white/60" /><p className="eyebrow text-[10px] sm:text-xs">{wedding.dateLabel.toUpperCase()}</p>
      <p className="mt-7 font-serif text-base italic text-white/85">Kepada Yth. Bapak/Ibu/Saudara/i</p><p className="mt-1 text-lg font-medium tracking-wide">{guestName}</p>
      <button onClick={onOpen} className="mt-8 rounded-full border border-white/80 px-6 py-3 text-xs tracking-[.16em] transition hover:bg-white hover:text-[#236e64]">✉ &nbsp; BUKA UNDANGAN</button>
    </div><span className="absolute bottom-6 text-[9px] tracking-[.3em] text-white/75">SCROLL UNTUK MELIHAT</span>
  </section>;
}
