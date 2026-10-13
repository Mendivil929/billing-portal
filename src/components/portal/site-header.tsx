import Link from "next/link";
import { TecmaLogo } from "@/components/brand/tecma-logo";
import { HelpLink } from "@/components/portal/help-link";
import { ProfileMenu } from "@/components/portal/profile-menu";
import type { Profile } from "@/lib/profile";

export function SiteHeader({ profile }: { profile: Profile }) {
  return (
    <header className="relative z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-17 max-w-6xl items-center justify-between px-6 sm:px-8 short:h-15">
        <Link href="/home" aria-label="TECMA Clients Portal home">
          <TecmaLogo className="h-11 w-auto" />
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          <HelpLink />
          <span className="hidden h-8 w-px bg-slate-200 sm:block" />
          <ProfileMenu profile={profile} />
        </div>
      </div>
    </header>
  );
}
