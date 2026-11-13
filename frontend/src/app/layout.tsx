import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PosturePulse",
  description: "Real-time AI computer vision posture tracking with ruthless Gen-Z roasts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
