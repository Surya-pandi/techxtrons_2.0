import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./festival.css";
import { branding } from "@/lib/branding";
const jakarta = localFont({
  src: "./fonts/PlusJakartaSans.ttf",
  variable: "--font-jakarta",
  display: "swap",
  weight: "200 800",
});
export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
};
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: `${branding.eventName} | ${branding.departmentName}`,
    template: `%s | ${branding.eventName}`,
  },
  description:
    "TECHXTRONS 2.0 — a celebration of ideas, ingenuity, and talent from the Department of Information Technology.",
  openGraph: {
    type: "website",
    siteName: branding.eventName,
    title: `${branding.eventName} | ${branding.tagline}`,
    description: `Discover ${branding.eventName} from the ${branding.departmentName}.`,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${branding.eventName} | ${branding.departmentName}`,
    description: "Ideas. Energy. Impact.",
    images: ["/opengraph-image"],
  },
  icons: { icon: "/images/logo.png" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Browser extensions may inject crxlauncher attributes before hydration.
    // Limit suppression to this element; descendants retain hydration checks.
    <html lang="en" suppressHydrationWarning>
      <body className={jakarta.variable}>{children}</body>
    </html>
  );
}
