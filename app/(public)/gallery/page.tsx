import { getGallery, getEvents } from "@/lib/data";
import GalleryBrowser from "@/components/gallery-browser";
import { PageHeading } from "@/components/ui";
export const metadata = { title: "The gallery" };
export default async function GalleryPage() {
  const [images, events] = await Promise.all([getGallery(), getEvents()]);
  return (
    <>
      <PageHeading
        eyebrow="RELIVE THE ENERGY"
        title="Moments that matter"
        description="Big ideas, shared victories, and everything in between. Our story, in frames."
      />
      <section className="container section-bottom">
        <GalleryBrowser
          images={[...images].sort(
            (a, b) => Number(b.is_featured) - Number(a.is_featured),
          )}
          events={events}
        />
      </section>
    </>
  );
}
