"use client";

import { useEffect, useState } from "react";

export function Countdown({ date }: { date: string }) {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setRemaining(Math.max(0, new Date(date).getTime() - Date.now()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [date]);

  const second = 1000, minute = 60 * second, hour = 60 * minute, day = 24 * hour;
  const values = remaining === null
    ? ["—", "—", "—", "—"]
    : [Math.floor(remaining / day), Math.floor((remaining % day) / hour), Math.floor((remaining % hour) / minute), Math.floor((remaining % minute) / second)].map(String);

  return (
    <div className="countdown-grid mx-auto mt-8 grid max-w-md grid-cols-4 gap-2 sm:gap-3">
      {values.map((value, index) => (
        <div key={index} className="countdown-cell px-1 py-4 sm:py-5">
          <p className="font-serif text-2xl text-[#236e64] sm:text-3xl">{value}</p>
          <p className="mt-2 text-[8px] uppercase tracking-[.14em] text-[#6f9992] sm:text-[9px]">{["Hari", "Jam", "Menit", "Detik"][index]}</p>
        </div>
      ))}
    </div>
  );
}
