"use client";

import { useActionState, useState } from "react";
import { login, type LoginFormState } from "@/app/login/actions";
import { ArrowRightIcon, EyeIcon, EyeOffIcon } from "@/components/icons";

const initialState: LoginFormState = {};

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3.5 text-base text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 sm:text-sm short:py-3 tiny:py-2.5";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-7 short:space-y-5 tiny:space-y-3">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-800">
          User:
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={inputClass}
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <label htmlFor="password" className="text-sm font-semibold text-slate-800">
            Password:
          </label>
          <a href="#" className="text-xs font-semibold text-brand-500 hover:text-brand-700">
            Have you forgotten your password?
          </a>
        </div>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className={`${inputClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500 hover:text-slate-800"
          >
            {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-slate-600">
        <input
          type="checkbox"
          name="stayLoggedIn"
          className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-brand-600"
        />
        Stay logged in
      </label>

      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-600 px-4 py-3.5 text-base font-semibold text-white transition hover:bg-accent-700 disabled:opacity-60 short:py-3 tiny:py-2.5"
      >
        {pending ? "Signing in…" : "Access the portal"}
        {pending ? null : <ArrowRightIcon className="h-5 w-5" />}
      </button>
    </form>
  );
}
