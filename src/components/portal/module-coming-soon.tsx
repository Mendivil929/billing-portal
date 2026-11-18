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
    <HubHero title={title} subtitle="This module is on its way." backHref="/home">
      <div className="max-w-xl rounded-2xl bg-white p-8 shadow-xl shadow-black/10 short:p-6 tiny:p-5">
        <span className={`flex h-14 w-14 items-center justify-center rounded-xl tiny:h-11 tiny:w-11 ${iconClass}`}>
          <Icon className="h-7 w-7" />
        </span>
        <h2 className="mt-6 text-2xl font-bold text-slate-900 short:mt-4 tiny:text-xl">Coming soon</h2>
        <p className="mt-2 text-sm text-slate-600">
          We&apos;re preparing the {title} module for your account. Contact your Program manager
          if you need this information in the meantime.
        </p>
      </div>
    </HubHero>
  );
}
