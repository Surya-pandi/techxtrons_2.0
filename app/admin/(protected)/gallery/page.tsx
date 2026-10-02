import { getGallery, getEvents } from "@/lib/data";
import GalleryManager from "@/components/admin/gallery-manager";
export default async function GalleryAdmin() {
  const [images, events] = await Promise.all([getGallery(), getEvents()]);
  return <GalleryManager images={images} events={events} />;
}
