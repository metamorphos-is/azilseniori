import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "azilseniori.ro — Găsește un cămin potrivit",
  description:
    "Platformă pentru găsirea și administrarea căminelor pentru seniori din România.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
