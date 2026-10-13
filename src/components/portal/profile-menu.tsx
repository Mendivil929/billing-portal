"use client";

import { useState } from "react";
import Link from "next/link";
import { logout } from "@/app/login/actions";
import { ChevronDownIcon, LogOutIcon } from "@/components/icons";
import type { Profile } from "@/lib/profile";

export function ProfileMenu({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-slate-100"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
          {profile.initials}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block max-w-[14rem] truncate text-sm font-bold text-slate-900">
            {profile.displayName}
          </span>
          <span className="block max-w-[14rem] truncate text-xs text-slate-500">
            {profile.companyName}
          </span>
        </span>
        <ChevronDownIcon
          className={`hidden h-4 w-4 text-slate-500 transition-transform sm:block ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="bg-brand-600 px-4 py-4 text-white">
              <p className="truncate text-sm font-semibold">{profile.displayName}</p>
              <p className="truncate text-xs text-brand-100">{profile.email}</p>
            </div>

            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Account
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800">{profile.companyName}</p>
              <p className="text-xs text-slate-500">Account {profile.accountNumber}</p>
            </div>

            <div className="p-2">
              <Link
                href="/login/change-password"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700"
              >
                Change password
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-accent-50 hover:text-accent-700"
                >
                  <LogOutIcon className="h-4 w-4" />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
