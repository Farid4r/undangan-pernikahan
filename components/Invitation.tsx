"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { wedding } from "@/config/wedding";
import { Cover } from "@/components/Cover";
import { Countdown } from "@/components/Countdown";
import { CalendarPreview } from "@/components/CalendarPreview";
import { Guestbook } from "@/components/Guestbook";
import { MusicPlayer } from "@/components/MusicPlayer";

function Flower({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M60 14c12 18 12 29 0 39-12-10-12-21 0-39Zm46 23c-7 21-15 28-31 26 0-16 10-25 31-26ZM96 91c-22 1-32-4-36-19 14-8 26-2 36 19ZM24 91c10-19 22-25 36-19-4 15-14 20-36 19Zm-2-54c21 1 31 10 31 26-16 2-24-5-31-26Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <circle cx="60" cy="60" r="7" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M60 67v41m0-22c-10-10-18-12-27-8m27-2c9-11 18-14 28-11"
        stroke="currentColor"
        strokeWidth="1.1"
      />
    </svg>
  );
}
function Icon({ name }: { name: "pin" | "clock" | "heart" | "calendar" }) {
  const paths = {
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    heart: (
      <path d="M20.8 8.8c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10a4.7 4.7 0 0 1 8.8-2.3 4.7 4.7 0 0 1 8.8 2.3Z" />
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      {paths[name]}
    </svg>
  );
}

export function Invitation({ guestName }: { guestName: string }) {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(
      "main :is(h1, h2, p, img, article, a, button)",
    );
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    document.documentElement.classList.add("reveal-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -24px 0px" },
    );

    items.forEach((item, index) => {
      item.classList.add("scroll-reveal");
      item.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
      observer.observe(item);
    });

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("reveal-ready");
    };
  }, []);
  function openInvitation() {
    document.getElementById("undangan")?.scrollIntoView({ behavior: "smooth" });
  }
  async function copyAccount(account: string) {
    try {
      await navigator.clipboard.writeText(account);
      setCopiedAccount(account);
      window.setTimeout(
        () =>
          setCopiedAccount((current) => (current === account ? null : current)),
        2200,
      );
    } catch {
      setCopiedAccount(null);
    }
  }
  return (
    <main className="overflow-x-clip bg-white text-[#315c55]">
      <Cover guestName={guestName} onOpen={openInvitation} />
      <MusicPlayer src={wedding.musicUrl} />
      <section
        id="undangan"
        className="relative scroll-mt-4 px-6 py-20 text-center sm:py-28"
      >
        <Flower className="absolute -left-10 top-12 w-36 text-[#319c91]/15 sm:left-8 sm:w-48" />
        <Flower className="absolute -right-12 bottom-4 w-36 rotate-90 text-[#319c91]/15 sm:right-8 sm:w-48" />
        <div className="relative mx-auto max-w-2xl">
          <p className="eyebrow text-[10px] text-[#319c91]">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </p>
          <h2 className="mt-8 font-serif text-3xl text-[#236e64] sm:text-4xl">
            Assalamu’alaikum
            <br className="sm:hidden" /> Warahmatullahi Wabarakatuh
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-[#6c8580] sm:text-base">
            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud
            menyelenggarakan pernikahan putra-putri kami:
          </p>
          <div className="mt-9 grid items-center gap-5 sm:grid-cols-[1fr_auto_1fr] sm:gap-8">
            <div>
              <img
                src={wedding.bride.photo}
                alt={`Foto ${wedding.bride.name}`}
                className="mx-auto mb-4 h-32 w-32 rounded-full border-4 border-[#e8f5f2] object-cover shadow-md sm:h-36 sm:w-36"
              />
              <p className="font-serif text-4xl text-[#236e64]">
                {wedding.bride.name}
              </p>
              <p className="mt-2 text-xs text-[#77918b]">
                {wedding.bride.parents}
              </p>
            </div>
            <span className="font-serif text-4xl italic text-[#319c91]">
              &amp;
            </span>
            <div>
              <img
                src={wedding.groom.photo}
                alt={`Foto ${wedding.groom.name}`}
                className="mx-auto mb-4 h-32 w-32 rounded-full border-4 border-[#e8f5f2] object-cover shadow-md sm:h-36 sm:w-36"
              />
              <p className="font-serif text-4xl text-[#236e64]">
                {wedding.groom.name}
              </p>
              <p className="mt-2 text-xs text-[#77918b]">
                {wedding.groom.parents}
              </p>
            </div>
          </div>
          <p className="mt-9 font-serif text-lg italic text-[#71938c]">
            “Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan
            pasangan-pasangan untukmu...”
          </p>
          <p className="mt-2 text-[10px] tracking-widest text-[#91a9a3]">
            QS. AR-RUM: 21
          </p>
        </div>
      </section>
      <section className="save-the-date relative px-6 py-20 text-center sm:py-24">
        <p className="eyebrow text-[10px] text-white/85">SAVE THE DATE</p>
        <h2 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
          Hari Bahagia Kami
        </h2>
        <p className="mt-3 text-sm text-white/90">{wedding.dateLabel}</p>
        <Countdown date={wedding.date} />
        <CalendarPreview />
        <div className="mx-auto mt-11 grid max-w-4xl justify-items-center gap-5 sm:grid-cols-2">
          {wedding.events.map((event) => (
            <article
              key={event.type}
              className="w-full border border-[#d7ebe6] bg-white p-7 text-center sm:p-9"
            >
              <Image
                src="/images/location.png"
                alt=""
                aria-hidden="true"
                width={48}
                height={48}
                className="mx-auto mb-5 size-12 object-contain"
              />
              <div className="flex flex-col items-center gap-2 text-[#319c91]">
                <p className="eyebrow text-[10px]">
                  {event.type.toUpperCase()}
                </p>
              </div>
              <p className="mt-5 font-serif text-3xl text-[#236e64]">
                {wedding.dateLabel}
              </p>
              <div className="mt-5 space-y-3 text-sm text-[#6d8580]">
                <p className="flex items-center justify-center gap-3">
                  <Icon name="clock" />
                  {event.time}
                </p>
                <p className="flex items-center justify-center gap-3">
                  <Icon name="pin" />
                  {event.place}
                </p>
              </div>
              <a
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#319c91] px-5 py-2.5 text-xs tracking-widest text-white hover:bg-[#236e64]"
                href={event.mapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="pin" /> BUKA GOOGLE MAPS
              </a>
              <div className="mt-6 overflow-hidden rounded-xl border border-[#d7ebe6] bg-white shadow-sm">
                <iframe
                  title={`Peta lokasi ${event.place}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(event.place)}&output=embed`}
                  className="block aspect-[16/9] w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="relative overflow-hidden bg-[#fbfefd] px-6 py-20 sm:py-24">
        <Flower className="pointer-events-none absolute -left-10 top-10 w-32 text-[#319c91]/10 sm:left-6 sm:w-40" />
        <Flower className="pointer-events-none absolute -right-10 bottom-8 w-32 rotate-90 text-[#319c91]/10 sm:right-6 sm:w-40" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div aria-hidden="true" className="mx-auto mb-5 flex items-center justify-center gap-3 text-[#8bc9bd]/70">
            <span className="h-px w-12 bg-current" />
            <span className="size-2 rotate-45 border border-current" />
            <span className="h-px w-12 bg-current" />
          </div>
          <p className="eyebrow text-[10px] text-[#319c91]">CERITA CINTA</p>
          <h2 className="mt-3 font-serif text-4xl text-[#236e64] sm:text-5xl">
            Sepenggal Kisah
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[#78918c]">
            {wedding.story}
          </p>
          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {wedding.gallery.map((photo) => (
              <img
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="aspect-square w-full rounded-sm object-cover sm:aspect-[4/3]"
              />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#e8f5f2] px-6 py-16 text-center">
        <p className="eyebrow text-[10px] text-[#319c91]">TANDA KASIH</p>
        <h2 className="mt-3 font-serif text-4xl text-[#236e64]">
          Hadiah Digital
        </h2>
        <p className="mt-3 text-sm text-[#78918c]">
          Doa restu Anda adalah hadiah terindah bagi kami.
        </p>
        <div className="mx-auto mt-7 grid max-w-3xl gap-4 sm:grid-cols-2">
          {wedding.bankAccounts.map((bank) => (
            <div
              key={`${bank.name}-${bank.account}`}
              className="rounded-2xl border border-[#cce3dd] bg-white p-6"
            >
              <p className="font-serif text-2xl text-[#236e64]">{bank.name}</p>
              <p className="mt-3 text-lg tracking-widest text-[#315c55]">
                {bank.account}
              </p>
              <p className="mt-1 text-xs text-[#78918c]">a.n. {bank.holder}</p>
              <button
                onClick={() => copyAccount(bank.account)}
                className="mt-5 rounded-full border border-[#319c91] px-5 py-2 text-xs tracking-widest text-[#236e64] hover:bg-[#e8f5f2]"
              >
                {copiedAccount === bank.account
                  ? "NOMOR TERSALIN ✓"
                  : "SALIN NOMOR REKENING"}
              </button>
            </div>
          ))}
        </div>
      </section>
      <Guestbook guestName={guestName} />
      <footer className="bg-[#236e64] px-6 py-7 text-center text-[10px] tracking-wide text-white/75">
        <p className="font-serif text-2xl text-white">
          TERIMA KASIH 
        </p>
        <p className="mt-2">©2026 Kreatipisan.co</p>
      </footer>
    </main>
  );
}
