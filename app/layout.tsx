import type { Metadata } from "next";

import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { AppProviders } from "@/components/providers/app-providers";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://zelectronics.example"),
  title: "Z Electronics | Powered by Young Minds",
  description: "Premium electronics components marketplace for engineers, makers and innovators.",
  openGraph: {
    title: "Z Electronics",
    description: "Futuristic electronics commerce platform with storefront and admin intelligence.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AppProviders>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <WhatsAppFloat />
          <MobileBottomNav />
        </AppProviders>
      </body>
    </html>
  );
}
