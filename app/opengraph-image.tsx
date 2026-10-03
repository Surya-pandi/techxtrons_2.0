import { ImageResponse } from "next/og";
import { branding } from "@/lib/branding";
import { getSettings, getWebsiteContent } from "@/lib/data";
export const alt = "Event preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function SocialImage() {
  const [settings, content] = await Promise.all([
    getSettings(),
    getWebsiteContent(),
  ]);
  return new ImageResponse(
    <div
      style={{
        background: "#080808",
        color: "#f2d600",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "65px 80px",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 18,
          letterSpacing: 3,
          color: "#b6b6b0",
        }}
      >
        {settings.association_name.toUpperCase()}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 70,
          fontSize: 88,
          fontWeight: 800,
          lineHeight: 1.04,
          letterSpacing: -5,
        }}
      >
        {settings.event_name === branding.eventName ? (
          <>
            <div style={{ display: "flex" }}>
              TECH<span style={{ color: "#ff4b16" }}>X</span>TRONS
            </div>
            <span style={{ color: "#f2d600", fontSize: 72 }}>3.0</span>
          </>
        ) : (
          <div style={{ display: "flex", fontSize: 58, letterSpacing: -2 }}>
            {settings.event_name}
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 38,
          fontSize: 22,
          color: "#f3f3ef",
        }}
      >
        {String(content["seo.tagline"])}
      </div>
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 40,
          background: "#f2d600",
        }}
      />
    </div>,
    size,
  );
}
