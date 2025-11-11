import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Football TikTok Agent",
  description: "Daily auto-curated football edits pipeline",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700 }}>Football TikTok Agent</h1>
            <nav style={{ display: "flex", gap: 12 }}>
              <a href="/" style={{ textDecoration: "underline" }}>Dashboard</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
