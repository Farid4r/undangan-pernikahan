export const wedding = {
  bride: { name: "Nadia Putri", shortName: "Nadia", parents: "Putri dari Bapak H. Ahmad & Ibu Hj. Siti", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=85" },
  groom: { name: "Arga Pratama", shortName: "Arga", parents: "Putra dari Bapak H. Budi & Ibu Hj. Rina", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=85" },
  date: "2026-11-21T08:00:00+07:00",
  dateLabel: "Sabtu, 21 November 2026",
  story: "Berawal dari pertemuan sederhana, tumbuh menjadi cerita yang kami syukuri setiap harinya. Dengan doa keluarga dan sahabat, kami siap melangkah bersama menuju selamanya.",
  gallery: [
    { src: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1000&q=85", alt: "Pasangan berjalan di taman saat senja" },
    { src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=85", alt: "Buket bunga putih dan hijau" },
    { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85", alt: "Momen bahagia pasangan" },
  ],
  musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  events: [
    { type: "Akad Nikah", time: "08.00 – 10.00 WIB", place: "Masjid Raya Al-Ikhlas, Bandung", mapsUrl: "https://maps.google.com/?q=Masjid+Raya+Al-Ikhlas+Bandung" },
    { type: "Resepsi", time: "11.00 – 14.00 WIB", place: "The Garden Hall, Bandung", mapsUrl: "https://maps.google.com/?q=The+Garden+Hall+Bandung" },
  ],
  bank: { name: "Bank BCA", account: "1234567890", holder: "Nadia Putri" },
} as const;
