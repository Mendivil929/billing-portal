import { redirect } from "next/navigation";
import { ArrowRightIcon, DashboardIcon, UsersIcon } from "@/components/icons";
import { HubHero } from "@/components/portal/hub-hero";
import { ModuleComingSoon } from "@/components/portal/module-coming-soon";
import { getHrDashboardUrl } from "@/lib/hr-dashboard";

export default async function HumanResourcesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // The page takes no parameters: any attempt to pick a client (?Cliente=...) lands
  // back on the clean URL, which always serves the signed-in client's dashboard.
  if (Object.keys(await searchParams).length > 0) redirect("/human-resources");

  if (!(await getHrDashboardUrl())) {
    return (
      <ModuleComingSoon
        title="Human Resources"
        Icon={UsersIcon}
        iconClass="bg-accent-50 text-accent-600"
      />
    );
  }

  return (
    <HubHero title="Human Resources" subtitle="Your team's workforce information.">
      <div className="max-w-xl rounded-2xl bg-white p-8 shadow-xl shadow-black/10">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
          <DashboardIcon className="h-7 w-7" />
        </span>
        <h2 className="mt-6 text-2xl font-bold text-slate-900">Workforce dashboard</h2>
        <p className="mt-2 text-sm text-slate-600">
          Your Human Resources dashboard, prepared for your account. It opens in a new tab.
        </p>
        {/* Route handler, not a page: a plain <a> so the browser follows the redirect in the new tab. */}
        <a
          href="/human-resources/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-700"
        >
          Open dashboard
          <ArrowRightIcon className="h-4 w-4" />
        </a>
      </div>
    </HubHero>
  );
}
