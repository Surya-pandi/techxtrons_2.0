"use client";
import { createContext, useContext } from "react";
import {
  defaultWebsiteContent,
  type WebsiteContent,
} from "@/lib/website-content";

const ContentContext = createContext<WebsiteContent>(defaultWebsiteContent);
export function SiteContentProvider({
  content,
  children,
}: {
  content: WebsiteContent;
  children: React.ReactNode;
}) {
  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}
export function useSiteContent() {
  return useContext(ContentContext);
}
export function SiteText({ name }: { name: string }) {
  const content = useSiteContent();
  const value = content[name];
  return typeof value === "string" ? value : null;
}
export function SiteSection({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  const content = useSiteContent();
  return content[name] === false ? null : children;
}
