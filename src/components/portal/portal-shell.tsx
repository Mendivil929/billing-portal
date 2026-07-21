"use client";

import { useState } from "react";
import { Sidebar } from "@/components/portal/sidebar";
import { BellIcon, ChevronDownIcon, MenuIcon, XIcon } from "@/components/icons";

export function PortalShell({
  customerName,
  accountNumber,
  children,
}: {
  customerName: string;
  accountNumber: string;
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block dark:border-slate-800 dark:bg-slate-900">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative z-50 h-full w-64 bg-white shadow-xl dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="absolute right-3 top-3 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close navigation"
            >
              <XIcon className="h-5 w-5" />
            </button>
            <Sidebar onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
            aria-label="Open navigation"
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          <div className="hidden text-sm text-slate-500 lg:block">
            Customer Billing Portal
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Notifications"
            >
              <BellIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
                {customerName.charAt(0)}
              </span>
              <span className="hidden text-left text-sm sm:block">
                <span className="block font-medium text-slate-700 dark:text-slate-200">
                  {customerName}
                </span>
                <span className="block text-xs text-slate-400">
                  Account {accountNumber}
                </span>
              </span>
              <ChevronDownIcon className="hidden h-4 w-4 text-slate-400 sm:block" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
