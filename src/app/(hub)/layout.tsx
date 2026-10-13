import { logout } from "@/app/login/actions";
import { OfficeBackground } from "@/components/brand/office-background";
import { SiteHeader } from "@/components/portal/site-header";
import { getProfile } from "@/lib/profile";

export default async function HubLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();

  return (
    <div className="relative isolate flex min-h-dvh flex-col">
      <OfficeBackground />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-linear-to-t from-black/60 to-transparent" />

      <SiteHeader profile={profile} />
      <div className="flex-1">{children}</div>

      <footer className="mx-auto flex w-full max-w-6xl flex-col items-center gap-1.5 px-6 py-5 text-center text-xs text-white sm:flex-row sm:justify-between sm:gap-3 sm:px-8 sm:text-left sm:text-sm short:py-3">
        <p>
          Missing a module?{" "}
          <a href="#" className="font-semibold text-brand-200 hover:text-white">
            Contact your Program manager
          </a>
        </p>
        <div className="flex items-center gap-6">
          <span>© 2026 TECMA</span>
          <a href="#" className="hover:text-brand-200">
            Privacy
          </a>
          <form action={logout}>
            <button type="submit" className="hover:text-brand-200">
              Sign out
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
