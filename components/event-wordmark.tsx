import { branding } from "@/lib/branding";
import Image from "next/image";

export default function EventWordmark({
  name,
  imageSrc,
}: {
  name: string;
  imageSrc?: string;
}) {
  if (imageSrc) {
    return (
      <span className="event-logo-frame">
        <Image
          src={imageSrc}
          alt={name}
          fill
          preload
          sizes="(max-width: 800px) calc(100vw - 44px), (max-width: 1100px) 50vw, 580px"
          className="event-logo-image"
        />
      </span>
    );
  }
  if (name !== branding.eventName) return <>{name}</>;
  return (
    <span className="event-wordmark">
      TECH<span className="event-wordmark-x">X</span>TRONS
      <span className="event-wordmark-edition">3.0</span>
    </span>
  );
}
