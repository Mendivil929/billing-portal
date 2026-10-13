"use server";

import { redirect } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api-client";
import { createSession, deleteSession, getSessionToken } from "@/lib/session";
import type { LoginResponse } from "@/lib/types";

export interface LoginFormState {
  error?: string;
}

export async function login(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const stayLoggedIn = formData.get("stayLoggedIn") === "on";

  if (!email || !password) {
    return { error: "Enter your user and password." };
  }

  let result: LoginResponse;
  try {
    result = await apiFetch<LoginResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return { error: "Invalid user or password." };
    }
    return { error: "Unable to sign in right now. Please try again." };
  }

  await createSession(result.accessToken, { persistent: stayLoggedIn });

  redirect("/home");
}

export interface ChangePasswordFormState {
  error?: string;
}

export async function changePassword(
  _prevState: ChangePasswordFormState,
  formData: FormData
): Promise<ChangePasswordFormState> {
  const token = await getSessionToken();
  if (!token) redirect("/login");

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (currentPassword.length < 12 || newPassword.length < 12) {
    return { error: "Passwords must be at least 12 characters." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match." };
  }

  try {
    await apiFetch("/api/v1/auth/change-password", {
      method: "POST",
      token,
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      await deleteSession();
      redirect("/login");
    }
    return { error: "Could not change password. Please try again." };
  }

  redirect("/home");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
