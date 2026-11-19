import { ArrowRightIcon, DashboardIcon } from "@/components/icons";
import { HubHero } from "@/components/portal/hub-hero";

export function ModuleDashboard({
  module,
  subtitle,
  cardTitle,
  cardDescription,
  href,
  iconClass,
  buttonClass,
}: {
  module: string;
  subtitle: string;
  cardTitle: string;
  cardDescription: string;
  href: string;
  iconClass: string;
  buttonClass: string;
}) {
  return (
    <HubHero title={module} subtitle={subtitle} backHref="/home">
      <div className="max-w-xl rounded-2xl bg-white p-8 shadow-xl shadow-black/10 short:p-6 tiny:p-5">
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-xl tiny:h-11 tiny:w-11 ${iconClass}`}
        >
          <DashboardIcon className="h-7 w-7" />
        </span>
        <h2 className="mt-6 text-2xl font-bold text-slate-900 short:mt-4 tiny:text-xl">{cardTitle}</h2>
        <p className="mt-2 text-sm text-slate-600">{cardDescription}</p>
        {/* Route handler, not a page: a plain <a> so the browser follows the redirect in the new tab. */}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-8 inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition short:mt-6 tiny:mt-4 ${buttonClass}`}
        >
          Open dashboard
          <ArrowRightIcon className="h-4 w-4" />
        </a>
      </div>
    </HubHero>
  );
}
