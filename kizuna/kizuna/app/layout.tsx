import type { Metadata, Viewport } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import NavLinks from "@/components/NavLinks";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "SAKURA", template: "%s | SAKURA" },
  description: "Where Japanese culture meets Indian community.",
};

export const viewport: Viewport = {
  themeColor: "#ffc9d6",
  width: "device-width",
  initialScale: 1,
};

const FONTS =
  "https://fonts.googleapis.com/css2?family=DotGothic16&family=Mochiy+Pop+One&family=Zen+Maru+Gothic:wght@400;500;700&display=swap";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <div className="panel">
          <div className="topbar">
            <Link href="/" className="brand" aria-label="SAKURA home">
              <span className="brand-decoration" aria-hidden="true">🌸</span>
              <span className="brand-name">SAKURA</span>
              <span className="brand-kanji" aria-hidden="true">桜</span>
              <span className="brand-decoration" aria-hidden="true">🌸</span>
            </Link>
            <div className="topbar-right">
              <NavLinks variant="top" />
              <Link href="/passport" className="profile-btn" aria-label="My Passport">
                <div className="profile-avatar">
                  <span aria-hidden="true">👤</span>
                </div>
              </Link>
            </div>
          </div>
          <main id="main">{children}</main>
          <p className="footer-note">
            SAKURA links to official sources. We don't host anime, manga or music.
          </p>
        </div>
        <NavLinks variant="tab" />
      </body>
    </html>
  );
}
