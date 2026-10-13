import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionToken } from "@/lib/session";
import { AuthLayout } from "@/components/auth/auth-layout";
import { ChangePasswordForm } from "@/components/portal/change-password-form";
import { ArrowLeftIcon } from "@/components/icons";

export default async function ChangePasswordPage() {
  const token = await getSessionToken();
  if (!token) redirect("/login");

  return (
    <AuthLayout>
      <h1 className="mt-6 text-3xl font-bold text-slate-900 short:mt-4 short:text-2xl tiny:mb-3">
        Change password
      </h1>
      <p className="mb-7 mt-1.5 text-sm text-slate-600 short:mb-4 tiny:hidden">
        Use at least 12 characters for your new password.
      </p>
      <ChangePasswordForm />
      <Link
        href="/home"
        className="mt-6 flex items-center justify-center gap-1.5 border-t border-slate-100 pt-5 text-sm font-semibold text-brand-500 hover:text-brand-700 short:mt-4 short:pt-4 tiny:mt-3 tiny:pt-3"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to the portal
      </Link>
    </AuthLayout>
  );
}
