import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nadia & Arga — Undangan Pernikahan",
  description: "Dengan penuh kebahagiaan, Nadia dan Arga mengundang Anda untuk hadir di hari pernikahan mereka.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
