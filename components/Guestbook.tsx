"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
type Entry = { id: number; name: string; message: string; created_at: string };

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

export function Guestbook({ guestName }: { guestName: string }) {
  const [entries, setEntries] = useState<Entry[]>([]), [status, setStatus] = useState("Memuat ucapan…"), [sending, setSending] = useState(false);
  useEffect(() => { fetch("/api/guestbook").then(async (r) => { const data = await r.json(); if (!r.ok) throw new Error(data.error); setEntries(Array.isArray(data.entries) ? data.entries : []); setStatus(data.configured ? "" : "Buku ucapan akan aktif setelah Supabase dikonfigurasi."); }).catch(() => setStatus("Ucapan belum dapat dimuat.")); }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSending(true); setStatus(""); const form = event.currentTarget; const values = Object.fromEntries(new FormData(form));
    try { const response = await fetch("/api/guestbook", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: values.name, attendance: values.attendance, message: values.message }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); const submittedEntry: Entry = { id: Date.now(), name: String(values.name), message: String(values.message), created_at: new Date().toISOString() }; setEntries((current) => [submittedEntry, ...current]); form.reset(); setStatus("Terima kasih, konfirmasi dan ucapan Anda sudah tersimpan."); const latestResponse = await fetch("/api/guestbook", { cache: "no-store" }); if (latestResponse.ok) { const latest = await latestResponse.json(); if (Array.isArray(latest.entries)) setEntries(latest.entries); } }
    catch (error) { setStatus(error instanceof Error ? error.message : "Gagal mengirim ucapan."); } finally { setSending(false); }
  }
  return <section className="guestbook-section px-6 py-20 sm:py-24"><div className="mx-auto max-w-xl text-center"><p className="eyebrow text-[10px] text-[#319c91]">KONFIRMASI KEHADIRAN &amp; UCAPAN</p><h2 className="mt-3 font-serif text-4xl text-[#236e64] sm:text-5xl">Sampai Jumpa</h2><p className="mt-4 text-sm leading-7 text-[#78918c]">Kehadiran dan doa restu Anda merupakan kebahagiaan bagi kami.</p>
    <form className="mt-8 space-y-4 text-left" onSubmit={submit}>
      <label className="block text-xs text-[#68827c]">Nama<input required minLength={2} maxLength={80} name="name" defaultValue={guestName === "Tamu Undangan" ? "" : guestName} placeholder="Nama lengkap" className="mt-2 w-full border border-[#d5e7e2] bg-white px-4 py-3 text-sm outline-none focus:border-[#319c91]" /></label>
      <label className="block text-xs text-[#68827c]">Kehadiran<select name="attendance" className="mt-2 w-full border border-[#d5e7e2] bg-white px-4 py-3 text-sm"><option>Hadir</option><option value="Tidak hadir">Maaf, belum bisa hadir</option></select></label>
      <label className="block text-xs text-[#68827c]">Ucapan dan doa<textarea required minLength={2} maxLength={500} name="message" rows={4} placeholder="Tuliskan ucapan untuk kedua mempelai" className="mt-2 w-full resize-y border border-[#d5e7e2] bg-white px-4 py-3 text-sm outline-none focus:border-[#319c91]" /></label>
      <button disabled={sending} className="guestbook-submit w-full bg-[#319c91] px-6 py-3 text-xs tracking-[.18em] text-white transition hover:bg-[#236e64] disabled:opacity-60">{sending ? "MENGIRIM…" : "KIRIM UCAPAN"}</button>
    </form><p aria-live="polite" className="mt-4 min-h-6 text-sm text-[#68827c]">{status}</p>
    <div aria-label="Daftar ucapan yang tersimpan" className="guestbook-entries mt-8 max-h-80 overflow-y-auto overscroll-contain rounded-2xl border border-[#d5e7e2] bg-white p-4 text-left">
      {entries.length > 0 ? <div className="space-y-3">{entries.map((entry) => <article key={entry.id} className="guestbook-entry border border-[#d5e7e2] bg-white p-4"><div className="flex items-center gap-3"><Image src="/person.svg" alt="" aria-hidden="true" width={40} height={40} className="size-10 shrink-0" /><div className="min-w-0"><p className="font-medium text-[#236e64]">{entry.name}</p><p className="mt-1 text-xs text-[#78918c]">{formatDate(entry.created_at)}</p></div></div><p className="mt-3 text-sm leading-6 text-[#78918c]">{entry.message}</p></article>)}</div> : <p className="py-8 text-center text-sm text-[#78918c]">Belum ada ucapan tersimpan.</p>}
    </div>
  </div></section>;
}
