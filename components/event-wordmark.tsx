import { branding, resolveEventName } from "@/lib/branding";
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
  if (resolveEventName(name) !== branding.eventName)
    return <span className="event-wordmark">{name}</span>;
  return (
    <span className="event-wordmark">
      TECH<span className="event-wordmark-x">X</span>TRONS
      <span className="event-wordmark-edition">{branding.edition}</span>
    </span>
  );
}
