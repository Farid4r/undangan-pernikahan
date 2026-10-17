"use client";

import { useEffect, useState } from "react";

export function Countdown({ date }: { date: string }) {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setRemaining(Math.max(0, new Date(date).getTime() - Date.now()));
    update(); const timer = window.setInterval(update, 1000); return () => window.clearInterval(timer);
  }, [date]);
  const second = 1000, minute = 60 * second, hour = 60 * minute, day = 24 * hour;
  const values = remaining === null ? ["—", "—", "—", "—"] : [Math.floor(remaining / day), Math.floor((remaining % day) / hour), Math.floor((remaining % hour) / minute), Math.floor((remaining % minute) / second)].map(String);
  return <div className="mx-auto mt-9 grid max-w-md grid-cols-4 gap-3">{values.map((value, index) => <div key={index} className="border border-white/60 bg-white/85 px-2 py-4 shadow-sm backdrop-blur-sm"><p className="font-serif text-3xl text-[#236e64]">{value}</p><p className="mt-1 text-[9px] uppercase tracking-widest text-[#79918c]">{["Hari", "Jam", "Menit", "Detik"][index]}</p></div>)}</div>;
}
