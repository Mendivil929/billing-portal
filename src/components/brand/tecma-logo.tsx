import Image from "next/image";
import tecmaLogo from "@/assets/brand/tecma-logo.png";

export function TecmaLogo({ className = "h-10 w-auto" }: { className?: string }) {
  return <Image src={tecmaLogo} alt="TECMA" className={className} loading="eager" />;
}
