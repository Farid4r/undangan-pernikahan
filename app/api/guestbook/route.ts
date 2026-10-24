import { NextResponse } from "next/server";
import { isSupabaseConfigured, supabaseRequest } from "@/lib/supabase";

type GuestbookEntry = { id: number; name: string; message: string; created_at: string };

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ entries: [], configured: false });
  try {
    const entries = await supabaseRequest<GuestbookEntry[]>("guestbook?select=id,name,message,created_at&order=created_at.desc&limit=50");
    return NextResponse.json({ entries, configured: true });
  } catch (error) {
    console.error("Gagal memuat guestbook dari Supabase:", error);
    return NextResponse.json({ error: "Buku ucapan belum dapat dimuat." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Buku ucapan belum dikonfigurasi." }, { status: 503 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Data tidak valid." }, { status: 400 }); }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  const { name, message, attendance } = body as Record<string, unknown>;
  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 80) return NextResponse.json({ error: "Nama harus 2–80 karakter." }, { status: 400 });
  if (typeof message !== "string" || message.trim().length < 2 || message.trim().length > 500) return NextResponse.json({ error: "Ucapan harus 2–500 karakter." }, { status: 400 });
  if (attendance !== "Hadir" && attendance !== "Tidak hadir") return NextResponse.json({ error: "Pilihan kehadiran tidak valid." }, { status: 400 });
  try {
    await supabaseRequest("rpc/submit_wedding_response", { method: "POST", body: JSON.stringify({ guest_name: name.trim(), guest_attendance: attendance, guest_message: message.trim() }) });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Gagal menyimpan respons guestbook ke Supabase:", error);
    return NextResponse.json({ error: "Ucapan gagal disimpan. Silakan coba lagi." }, { status: 503 });
  }
}
