# Undangan Pernikahan — UI Redesign Toska

Paket ini berisi kode UI hasil redesign dengan palet toska-putih, ditambah `package.json` dan `lib/supabase.ts` yang diberikan pengguna.

## Menjalankan secara lokal

1. Pastikan Node.js versi yang kompatibel dengan Next.js 16 sudah terpasang.
2. Jalankan `npm install`.
3. Siapkan file `.env.local` sendiri bila Supabase digunakan. Jangan membagikan file yang berisi secret.
4. Jalankan `npm run dev`.
5. Periksa seluruh section dan fitur, lalu jalankan `npm run build`.

## Penting

ZIP awal yang diberikan tidak menyertakan folder aset `public/` (foto, galeri, dan musik) serta tidak menyertakan seluruh file pendukung proyek. Salin folder `public/` dan file konfigurasi proyek yang asli ke paket ini sebelum menggunakannya sebagai proyek mandiri. File `config/wedding.ts` berisi jalur aset yang harus tersedia.

UI sudah direstyle, tetapi build produksi dan perilaku integrasi belum dapat dinyatakan terverifikasi tanpa seluruh file dan aset asli serta environment yang sesuai.
