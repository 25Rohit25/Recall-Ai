import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { CommandPalette } from "@/components/CommandPalette";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FireNotes AI Workspace",
  description: "Next-generation Meeting Intelligence Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-50 antialiased`}>
        <Providers>
          {children}
          <CommandPalette />
        </Providers>
      </body>
    </html>
  );
}
