"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { ArrowLeftIcon, ChartUpIcon, NAV_ICONS } from "@/components/icons";
import { TecmaLogo } from "@/components/brand/tecma-logo";
import { CostCenterSwitcher, type CostCenterOption } from "@/components/portal/cost-center-switcher";
import type { SystemStatus } from "@/lib/system-status";

export interface SidebarProps {
  systemStatus: SystemStatus;
  costCenters: CostCenterOption[];
  activeCostCenterId: string | null;
}

export function Sidebar({
  systemStatus,
  costCenters,
  activeCostCenterId,
  onNavigate,
}: SidebarProps & { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-17 shrink-0 items-center border-b border-slate-200 px-5">
        <Link href="/home" onClick={onNavigate} aria-label="TECMA Clients Portal home">
          <TecmaLogo className="h-10 w-auto" />
        </Link>
      </div>

      <div className="px-3 pt-4">
        <Link
          href="/home"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          All modules
        </Link>
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-brand-50 px-3 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand-600">
            <ChartUpIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-brand-700">Finance</p>
            <p className="text-xs text-brand-600/80">Billing &amp; account status</p>
          </div>
        </div>
        <CostCenterSwitcher costCenters={costCenters} activeId={activeCostCenterId} />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = NAV_ICONS[item.href];
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              {Icon ? (
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
              ) : null}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 px-5 py-4 text-xs">
        <div className="flex items-center gap-2 text-slate-500">
          <span
            className={`h-2 w-2 rounded-full ${
              systemStatus === "operational" ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
          {systemStatus === "operational"
            ? "Systems operational"
            : "Billing data temporarily unavailable"}
        </div>
      </div>
    </div>
  );
}
