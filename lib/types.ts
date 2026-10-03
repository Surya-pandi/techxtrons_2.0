export type Category = "technical" | "non_technical";
export type Event = {
  id: string;
  title: string;
  slug: string;
  category: Category;
  description: string;
  poster_url: string;
  event_date: string | null;
  event_time: string | null;
  venue: string;
  rules: string;
  coordinators: string;
  prize_details: string;
  registration_url: string;
  is_featured: boolean;
  created_at?: string;
};
export type GalleryImage = {
  id: string;
  image_url: string;
  storage_path: string | null;
  caption: string;
  category: string;
  event_id: string | null;
  is_featured: boolean;
};
export type About = {
  id: string;
  title: string;
  description: string;
  vision: string;
  mission: string;
  objectives: string;
  image_url: string;
};
export type Contact = {
  id: string;
  department_name: string;
  college_name: string;
  email: string;
  phone: string;
  address: string;
  map_url: string;
  instagram_url: string;
  linkedin_url: string;
  youtube_url: string;
};
export type Settings = {
  website_content?: unknown;
  id: string;
  event_name: string;
  association_name: string;
  year: string;
  event_starts_at: string | null;
  venue: string;
  logo_url: string;
  intro_enabled: boolean;
};
