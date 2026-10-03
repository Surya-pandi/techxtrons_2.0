import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./festival.css";
import { getSettings, getWebsiteContent } from "@/lib/data";
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
export async function generateMetadata(): Promise<Metadata> {
  const [settings, content] = await Promise.all([
    getSettings(),
    getWebsiteContent(),
  ]);
  const description = String(content["seo.description"])
    .replaceAll("{event_name}", settings.event_name)
    .replaceAll("{association_name}", settings.association_name);
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ),
    title: {
      default: `${settings.event_name} | ${settings.association_name}`,
      template: `%s | ${settings.event_name}`,
    },
    description,
    openGraph: {
      type: "website",
      siteName: settings.event_name,
      title: settings.event_name,
      description,
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${settings.event_name} | ${settings.association_name}`,
      description,
      images: ["/opengraph-image"],
    },
    icons: { icon: settings.logo_url || "/images/logo.png" },
  };
}
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
