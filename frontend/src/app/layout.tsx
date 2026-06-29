import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/utils/cn";
import { AppProvider } from "@/providers/AppProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "FireNotes AI — Enterprise Meeting Intelligence",
  description: "Transcribe, summarize, search, and analyze all your meetings. Fireflies.ai Clone.",
};

import { CommandPalette } from "@/features/search/components/CommandPalette";
import { ShortcutHelpDialog } from "@/features/search/components/ShortcutHelpDialog";
import { QuickActions } from "@/features/search/components/QuickActions";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, jetbrainsMono.variable)} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground flex h-screen overflow-hidden" suppressHydrationWarning>
        <AppProvider>
          {children}
          <CommandPalette />
          <ShortcutHelpDialog />
          <QuickActions />
        </AppProvider>
      </body>
    </html>
  );
}
