import { ImageResponse } from "next/og";
import { branding } from "@/lib/branding";
export const alt = "TECHXTRONS 2.0 — Department of Information Technology.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function SocialImage() {
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
        {branding.departmentName.toUpperCase()}
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
        <div style={{ display: "flex" }}>
          TECH<span style={{ color: "#ff4b16" }}>X</span>TRONS
        </div>
        <span style={{ color: "#f2d600", fontSize: 72 }}>2.0</span>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 38,
          fontSize: 22,
          color: "#f3f3ef",
        }}
      >
        {branding.tagline}
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
