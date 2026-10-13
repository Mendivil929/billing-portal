import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/portal/login-form";

export default function LoginPage() {
  return (
    <AuthLayout tall>
      <h1 className="mt-10 text-3xl font-bold text-slate-900 short:mt-5 short:text-[1.75rem] tiny:mt-4 tiny:text-2xl">
        Log In
      </h1>
      <p className="mb-10 mt-2 text-sm text-slate-600 short:mb-6 tiny:mb-4 tiny:mt-1.5">
        Log in with the credentials associated with your customer account.
      </p>
      <LoginForm />
    </AuthLayout>
  );
}
