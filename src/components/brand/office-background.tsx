import Image from "next/image";
import officeBg from "@/assets/brand/office-bg.jpg";

export function OfficeBackground() {
  return (
    <Image
      src={officeBg}
      alt=""
      fill
      loading="eager"
      placeholder="blur"
      sizes="100vw"
      className="-z-10 object-cover"
    />
  );
}
