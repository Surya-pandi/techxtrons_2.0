import { getEvents } from "@/lib/data";
import EventsManager from "@/components/admin/events-manager";
export default async function EventsAdmin() {
  return <EventsManager events={await getEvents()} />;
}
