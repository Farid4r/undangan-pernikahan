import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Natashya & Rifqi — Undangan Pernikahan",
  description: "Dengan penuh kebahagiaan, Natashya dan Rifqi mengundang Anda untuk hadir di hari pernikahan mereka.",
  icons: {
    icon: "/kretipisan.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
