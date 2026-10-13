"use client";

import { useActionState } from "react";
import { changePassword, type ChangePasswordFormState } from "@/app/login/actions";

const initialState: ChangePasswordFormState = {};

const FIELDS = [
  { name: "currentPassword", label: "Current password:", autoComplete: "current-password" },
  { name: "newPassword", label: "New password:", autoComplete: "new-password" },
  { name: "confirmPassword", label: "Confirm new password:", autoComplete: "new-password" },
];

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, initialState);

  return (
    <form action={formAction} className="space-y-5 short:space-y-3.5 tiny:space-y-2.5">
      {FIELDS.map((field) => (
        <div key={field.name}>
          <label
            htmlFor={field.name}
            className="mb-1.5 block text-sm font-semibold text-slate-800 tiny:mb-1"
          >
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type="password"
            autoComplete={field.autoComplete}
            required
            minLength={12}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-base text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 sm:text-sm short:py-2.5 tiny:py-2"
          />
        </div>
      ))}

      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-accent-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-accent-700 disabled:opacity-60 short:py-2.5"
      >
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
