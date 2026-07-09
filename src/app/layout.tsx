import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/layout/AuthProvider";
import { NavbarWrapper } from "@/components/layout/NavbarWrapper";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NASDAQ Insights",
  description: "Financial analytics for NASDAQ-listed companies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <TooltipProvider>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <NavbarWrapper />
              <main className="flex-1 pt-16">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
