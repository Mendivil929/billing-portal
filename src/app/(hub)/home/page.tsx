import Link from "next/link";
import {
  ArrowRightIcon,
  ChartUpIcon,
  CheckIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@/components/icons";
import { HubHero } from "@/components/portal/hub-hero";
import { getProfile } from "@/lib/profile";

const MODULES = [
  {
    title: "Finance",
    description: "Keep track of billing and your account's financial status.",
    features: ["Invoices and credit notes", "Account statements and payments", "Quotes and orders"],
    href: "/dashboard",
    Icon: ChartUpIcon,
    iconClass: "bg-brand-50 text-brand-600",
    checkClass: "text-brand-500",
    buttonClass: "bg-brand-600 hover:bg-brand-700",
  },
  {
    title: "Compliance",
    description: "Manage regulatory documentation and legal compliance.",
    features: ["Certificates and approvals", "Current policies and regulations", "Audits and follow-up"],
    href: "/compliance",
    Icon: ShieldCheckIcon,
    iconClass: "bg-neutral-100 text-neutral-600",
    checkClass: "text-neutral-500",
    buttonClass: "bg-neutral-600 hover:bg-neutral-700",
  },
  {
    title: "Human Resources",
    description: "Access employment information and manage your team.",
    features: ["Payslips and employment documents", "Time off and absences", "Training and workforce"],
    href: "/human-resources",
    Icon: UsersIcon,
    iconClass: "bg-accent-50 text-accent-600",
    checkClass: "text-accent-600",
    buttonClass: "bg-accent-600 hover:bg-accent-700",
  },
];

export default async function HomePage() {
  const profile = await getProfile();

  return (
    <HubHero
      title={`Hello, ${profile.firstName}`}
      subtitle="Choose the module you want to work with."
    >
      <nav aria-label="Modules" className="space-y-3 md:hidden tiny:space-y-2.5">
        {MODULES.map((module) => (
          <Link
            key={module.title}
            href={module.href}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-xl shadow-black/10 transition active:scale-[0.99] tiny:gap-3 tiny:p-3"
          >
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl tiny:h-10 tiny:w-10 ${module.iconClass}`}
            >
              <module.Icon className="h-6 w-6 tiny:h-5 tiny:w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-lg font-bold text-slate-900 tiny:text-base">
                {module.title}
              </span>
              <span className="line-clamp-2 text-xs text-slate-600 tiny:line-clamp-1">
                {module.description}
              </span>
            </span>
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${module.buttonClass}`}
            >
              <ArrowRightIcon className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </nav>

      <div className="hidden gap-6 md:grid md:grid-cols-3">
        {MODULES.map((module) => (
          <article
            key={module.title}
            className="flex flex-col rounded-2xl bg-white p-7 shadow-xl shadow-black/10 short:p-6"
          >
            <span
              className={`flex h-13 w-13 items-center justify-center rounded-xl short:h-11 short:w-11 ${module.iconClass}`}
            >
              <module.Icon className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-2xl font-bold text-slate-900 short:mt-4 short:text-xl">
              {module.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 short:mt-1.5">{module.description}</p>

            <ul className="mt-5 flex-1 space-y-3 border-t border-slate-200 pt-5 short:mt-4 short:space-y-2 short:pt-4">
              {module.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckIcon className={`h-4 w-4 shrink-0 ${module.checkClass}`} />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href={module.href}
              className={`mt-6 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition short:mt-5 short:py-2.5 ${module.buttonClass}`}
            >
              Go to {module.title}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
    </HubHero>
  );
}
