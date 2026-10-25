export const wedding = {
  bride: { name: "Natashya Zahra N", shortName: "Natashya", parents: "Putri dari Bapak (Alm) Nurdin & Ibu Hj. Yuli Mariana M, S,Pd", photo: "/images/wedding/bride.jpg" },
  groom: { name: "M Rifqi Subakti", shortName: "Rifqi", parents: "Putra dari Bapak H. Asep Bakti & Ibu Hj. Titin Sumarni S.Pd", photo: "/images/wedding/groom.jpg" },
  coverPhoto: "/images/wedding/cover.JPG",
  date: "2026-12-20T08:00:00+07:00",
  dateLabel: "Ahad, 20 Desember 2026",
  story: "Berawal dari pertemuan sederhana, tumbuh menjadi cerita yang kami syukuri setiap harinya. Dengan doa keluarga dan sahabat, kami siap melangkah bersama menuju selamanya.",
  gallery: ["JPG", "JPG", "JPG", "JPG", "jpg", "jpg", "JPG", "JPG","jpg"].map((extension, index) => ({
    src: `/images/wedding/gallery-${String(index + 1).padStart(2, "0")}.${extension}`,
    alt: `Foto galeri pernikahan ${index + 1}`,
  })),
  musicUrl: "/audio/wedding-song.mp3",
  events: [
    { type: "Resepsi", time: "10.30 – Selesai", place: "CV Abynet", mapsUrl: "https://maps.app.goo.gl/YyPJGYvc9RVsa1GB8?g_st=ic" },
  ],
  bankAccounts: [
    { name: "Bank BCA", account: "5421170089", holder: "Rifqi Subakti" },
    { name: "Bank MANDIRI", account: "13100192624107", holder: "Natashya" },
    { name: "DANA", account: "089630366367", holder: "Rifqi Subakti" },
  ],
} as const;
