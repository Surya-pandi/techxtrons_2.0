import IntroVideo from "@/components/intro-video";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { getSettings, getContact, getWebsiteContent } from "@/lib/data";
import { SiteContentProvider, SiteSection } from "@/components/site-content";
import { isPreviewMode } from "@/lib/site-mode";
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, contact] = await Promise.all([getSettings(), getContact()]);
  const content = await getWebsiteContent();
  return (
    <SiteContentProvider content={content}>
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
        <SiteSection name="footer.visible">
          <Footer settings={settings} contact={contact} />
        </SiteSection>
      </div>
    </SiteContentProvider>
  );
}
