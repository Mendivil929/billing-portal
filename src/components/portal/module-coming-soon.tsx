import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
import { HubHero } from "@/components/portal/hub-hero";

export function ModuleComingSoon({
  title,
  Icon,
  iconClass,
}: {
  title: string;
  Icon: (props: { className?: string }) => React.JSX.Element;
  iconClass: string;
}) {
  return (
    <HubHero title={title} subtitle="This module is on its way.">
      <div className="max-w-xl rounded-2xl bg-white p-8 shadow-xl shadow-black/10">
        <span className={`flex h-14 w-14 items-center justify-center rounded-xl ${iconClass}`}>
          <Icon className="h-7 w-7" />
        </span>
        <h2 className="mt-6 text-2xl font-bold text-slate-900">Coming soon</h2>
        <p className="mt-2 text-sm text-slate-600">
          We&apos;re preparing the {title} module for your account. Contact your Program manager
          if you need this information in the meantime.
        </p>
        <Link
          href="/home"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to modules
        </Link>
      </div>
    </HubHero>
  );
}
