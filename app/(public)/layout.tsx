import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { getSettings, getContact } from "@/lib/data";
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, contact] = await Promise.all([getSettings(), getContact()]);
  return (
    <div className="public-site">
      <Navigation settings={settings} />
      <main id="main">{children}</main>
      <Footer settings={settings} contact={contact} />
    </div>
  );
}
