# Undangan Pernikahan Rifqi & Natsahya

Undangan satu halaman berbasis Next.js App Router, TypeScript, Tailwind CSS, dan Supabase. Detail pasangan berada di `config/wedding.ts`; semua tamu memakai website yang sama.

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000/?to=Magni` atau `http://localhost:3000/?to=Budi%20Santoso`. Parameter `to` otomatis di-decode URL, spasi berulang dirapikan, dan nilai kosong memakai `Tamu Undangan`.

## Mengaktifkan RSVP dan buku ucapan

1. Buat proyek Supabase, lalu jalankan `supabase/schema.sql` lewat SQL Editor.
2. Salin `.env.example` menjadi `.env.local` dan isi `SUPABASE_URL` serta `SUPABASE_ANON_KEY` dengan URL dan anon/publishable key proyek.
3. Restart server Next.js. Kunci digunakan hanya di route server; jangan masukkan service-role key ke aplikasi.

Jika kredensial belum diisi, halaman tetap berfungsi dan formulir menampilkan bahwa buku ucapan belum dikonfigurasi. API memvalidasi panjang nama dan ucapan, pilihan RSVP, lalu menulis RSVP dan ucapan dalam satu transaksi database. RLS membatasi akses anon pada insert yang tervalidasi dan membaca ucapan.

## Mengubah detail acara

Edit `config/wedding.ts` untuk nama pasangan, cerita, tanggal countdown, jadwal, tautan Google Maps, foto, URL musik, dan rekening. Ganti gambar contoh dengan foto pasangan sebelum dipublikasikan. URL musik contoh bisa diganti dengan file milik pasangan, misalnya `/music.mp3` di folder `public/`.

## Deploy ke Vercel

Hubungkan repository Git ke Vercel dan pilih preset Next.js. Tambahkan `SUPABASE_URL` dan `SUPABASE_ANON_KEY` pada Project Settings → Environment Variables untuk Production (serta Preview bila diperlukan), kemudian deploy. Pastikan skema SQL sudah dijalankan di proyek Supabase yang sama.

Periksa sebelum publikasi:

```bash
npm run lint
npx tsc --noEmit
npm run build
```
