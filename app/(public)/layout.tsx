import IntroVideo from "@/components/intro-video";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { getSettings, getContact } from "@/lib/data";
import { isPreviewMode } from "@/lib/site-mode";
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, contact] = await Promise.all([getSettings(), getContact()]);
  return (
    <div className="public-site">
      <IntroVideo enabled={settings.intro_enabled} />
      <Navigation settings={settings} />
      {isPreviewMode() && (
        <p className="preview-notice" role="status">
          Preview mode · Sample event information. Registration and messaging
          are not yet available.
        </p>
      )}
      <main id="main">{children}</main>
      <Footer settings={settings} contact={contact} />
    </div>
  );
}
