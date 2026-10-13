import Image from "next/image";
import swoosh from "@/assets/brand/swoosh.png";
import { OfficeBackground } from "@/components/brand/office-background";
import { TecmaLogo } from "@/components/brand/tecma-logo";

export function AuthLayout({
  tall = false,
  children,
}: {
  tall?: boolean;
  children: React.ReactNode;
}) {
  const cardSpacing = tall
    ? "px-6 py-9 sm:px-11 sm:py-16 short:py-8 tiny:py-5"
    : "px-6 py-7 sm:px-10 sm:py-9 short:py-5";
  const logoSize = tall
    ? "h-12 w-auto sm:h-16 short:h-12 tiny:h-9"
    : "h-12 w-auto sm:h-14 short:h-11 tiny:h-9";

  return (
    <div className="relative isolate flex min-h-dvh overflow-hidden">
      <OfficeBackground />

      <aside className="relative hidden w-[38%] max-w-xl shrink-0 flex-col overflow-hidden rounded-r-[3.5rem] bg-brand-600 px-12 pb-10 pt-8 text-white lg:flex short:pb-6 short:pt-4">
        <Image
          src={swoosh}
          alt=""
          loading="eager"
          className="-ml-24 w-[115%] max-w-none short:w-[95%]"
        />
        <div className="mt-6 flex-1 short:mt-2">
          <p className="text-2xl font-semibold tracking-[0.18em] text-brand-200">
            Clients Portal
          </p>
          <p className="mt-10 text-2xl font-semibold leading-snug short:mt-6">
            Your Business. One Portal.
            <br />
            Complete Visibility.
          </p>
          <p className="mt-10 max-w-sm text-base leading-relaxed text-brand-50/90 short:mt-6">
            Access your operations, invoices, payments, reports, and key business
            information — all in one place.
          </p>
        </div>
        <p className="text-sm text-brand-100/80">© 2026 Tecma. All rights reserved.</p>
      </aside>

      <main className="flex flex-1 flex-col px-4 py-5 sm:px-8 sm:py-6 short:py-3">
        <div className="flex justify-end text-sm text-white">
          <span>
            Need help?{" "}
            <a href="#" className="font-semibold text-brand-200 hover:text-white">
              Contact support
            </a>
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center py-6 short:py-3">
          <div
            className={`w-full max-w-md rounded-2xl bg-white shadow-2xl shadow-black/20 ${cardSpacing}`}
          >
            <TecmaLogo className={logoSize} />
            {children}
          </div>
        </div>

        <nav className="flex justify-center gap-2 text-sm text-white/90">
          <a href="#" className="hover:text-white">Legal Notice</a>
          <span aria-hidden>·</span>
          <a href="#" className="hover:text-white">Privacy</a>
          <span aria-hidden>·</span>
          <a href="#" className="hover:text-white">Cookies</a>
        </nav>
      </main>
    </div>
  );
}
