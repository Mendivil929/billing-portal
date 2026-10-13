export function HubHero({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-x-3 top-3 -bottom-14 -z-10 rounded-4xl bg-brand-600 shadow-xl shadow-black/20 sm:inset-x-6 sm:top-5 sm:rounded-[2.5rem] md:-bottom-28 md:short:-bottom-24 tiny:-bottom-10" />
        <div className="mx-auto max-w-6xl px-6 pt-14 sm:px-8 short:pt-10 tiny:pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-200">
            Client Portal
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-5xl short:mt-2 sm:short:text-4xl tiny:mt-1">
            {title}
          </h1>
          <p className="mt-3 text-sm text-brand-50 sm:text-base short:mt-2 tiny:mt-1">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-8 pt-7 sm:px-8 short:pb-4 short:pt-5 tiny:pt-4">
        {children}
      </div>
    </>
  );
}
