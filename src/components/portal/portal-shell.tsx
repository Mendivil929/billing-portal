"use client";

import { useState } from "react";
import { Sidebar, type SidebarProps } from "@/components/portal/sidebar";
import { MenuIcon, XIcon } from "@/components/icons";
import { ProfileMenu } from "@/components/portal/profile-menu";
import { HelpLink } from "@/components/portal/help-link";
import type { Profile } from "@/lib/profile";

export function PortalShell({
  profile,
  sidebar,
  children,
}: {
  profile: Profile;
  sidebar: SidebarProps;
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f4f6f6]">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar {...sidebar} />
        </div>
      </aside>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative z-50 h-full w-64 bg-white shadow-xl">
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="absolute right-3 top-4 rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
              aria-label="Close navigation"
            >
              <XIcon className="h-5 w-5" />
            </button>
            <Sidebar {...sidebar} onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-17 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Open navigation"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Client Portal <span className="mx-1.5 text-slate-300">/</span>
              <span className="text-brand-600">Finance</span>
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <HelpLink />
            <span className="hidden h-8 w-px bg-slate-200 sm:block" />
            <ProfileMenu profile={profile} />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
