import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { CommandPalette } from "@/components/CommandPalette";
import { FirefliesNavbar as GlobalNavbar } from "@/components/GlobalNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FireNotes AI — #1 AI Meeting Assistant",
  description: "Transcribe, summarize, search, and analyze all your meetings. AI-powered meeting intelligence for teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-950 text-slate-50 antialiased flex flex-col h-screen overflow-hidden`} suppressHydrationWarning>
        <Providers>
          <div className="flex-shrink-0 z-50 relative">
            <GlobalNavbar />
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
            {children}
          </div>
          <CommandPalette />
        </Providers>
      </body>
    </html>
  );
}
