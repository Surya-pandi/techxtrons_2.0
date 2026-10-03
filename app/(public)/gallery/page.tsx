import { SiteText, SiteSection } from "@/components/site-content";
import { getGallery, getEvents } from "@/lib/data";
import GalleryBrowser from "@/components/gallery-browser";
import { PageHeading } from "@/components/ui";
export const metadata = { title: "The gallery" };
export default async function GalleryPage() {
  const [images, events] = await Promise.all([getGallery(), getEvents()]);
  return (
    <>
      <SiteSection name="gallery.heading.visible">
        <PageHeading
          eyebrow={<SiteText name="gallery.relive-the-energy" />}
          title={<SiteText name="gallery.moments-that-matter" />}
          description={
            <SiteText name="gallery.big-ideas-shared-victories-and-everything-in-between-ou" />
          }
        />
      </SiteSection>
      <SiteSection name="gallery.collection.visible">
        <section className="container section-bottom">
          <GalleryBrowser
            images={[...images].sort(
              (a, b) => Number(b.is_featured) - Number(a.is_featured),
            )}
            events={events}
          />
        </section>
      </SiteSection>
    </>
  );
}
