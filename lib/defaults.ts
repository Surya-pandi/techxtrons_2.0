import type { About, Contact, Event, GalleryImage, Settings } from "./types";
import { branding } from "./branding";
export const singletonId = "00000000-0000-0000-0000-000000000001";
export const defaultSettings: Settings = {
  id: singletonId,
  event_name: branding.eventName,
  association_name: branding.departmentName,
  year: "2026",
  event_starts_at: "2026-10-10T00:00:00+05:30",
  venue: "Venue to be announced",
  logo_url: "/images/logo.png",
  intro_enabled: true,
};
export const defaultAbout: About = {
  id: singletonId,
  title: "Great minds. Greater possibilities.",
  description:
    "TECHXTRONS 3.0 brings together the Department of Information Technology for a celebration of ideas, creativity, and shared ambition. A space for curious minds to meet and turn ideas into something extraordinary.",
  vision:
    "To build a community where curiosity becomes confidence, and students feel empowered to shape what comes next in technology.",
  mission:
    "Bring students together to learn by doing, exchange perspectives, and explore technology through creativity and collaboration.",
  objectives:
    "Encourage problem-solving, give ideas a platform, celebrate talent, and create connections that continue beyond the event.",
  image_url: "/images/placeholders/department-logo.png",
};
export const defaultContact: Contact = {
  id: singletonId,
  department_name: branding.departmentName,
  college_name: "College details to be announced",
  email: "",
  phone: "",
  address: "Venue and address to be announced",
  map_url: "",
  instagram_url: "",
  linkedin_url: "",
  youtube_url: "",
};
const eventDescriptions: Record<string, string> = {
  "coding-competition":
    "Put your problem-solving skills into practice. Explore a coding challenge built around logic, clear thinking, and the excitement of finding a solution.",
  "paper-presentation":
    "Give your ideas a voice. Share a technical perspective, explain your research, and start a conversation about what technology can make possible.",
  "treasure-hunt":
    "Look closer, follow the clues, and connect the dots. A chance to bring your curiosity and teamwork to a different kind of challenge.",
  "project-expo":
    "Turn an idea into something others can experience. A space to share projects, explain your process, and exchange feedback with curious minds.",
  photography:
    "Find a fresh perspective through your lens. Explore composition, tell a story, and celebrate the details others might walk past.",
  gaming:
    "Bring your focus and competitive spirit. Explore an experience where quick thinking, strategy, and a love of games come together.",
};
export const sampleEvents: Event[] = [
  ["Code the night", "coding-competition", "technical", "Coding Competition"],
  [
    "Ideas that ignite",
    "paper-presentation",
    "technical",
    "Paper Presentation",
  ],
  ["The hidden trail", "treasure-hunt", "non_technical", "Treasure Hunt"],
  ["Build beyond", "project-expo", "technical", "Project Expo"],
  ["Frame the moment", "photography", "non_technical", "Photography"],
  ["Game on", "gaming", "non_technical", "Gaming"],
].map(([title, slug, category, kind], i) => ({
  id: `sample-${i + 1}`,
  title,
  slug,
  category: category as Event["category"],
  description: `${eventDescriptions[slug]}

Sample ${kind.toLowerCase()} listing. The organizing team will confirm the event format and participation details.`,
  poster_url: "/images/placeholders/event-placeholder.png",
  event_date: null,
  event_time: null,
  venue: "Venue to be announced",
  rules:
    "Rules and participation guidelines will be announced by the organizing team.",
  coordinators: "Coordinator details will be announced here.",
  prize_details: "Prize details to be announced.",
  registration_url: "",
  is_featured: i < 3,
}));
export const sampleGallery: GalleryImage[] = [];
