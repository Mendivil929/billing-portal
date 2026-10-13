import "server-only";
import { requireSession } from "@/lib/auth";
import { getCurrentCustomer } from "@/lib/data";

export interface Profile {
  displayName: string;
  firstName: string;
  initials: string;
  email: string;
  companyName: string;
  accountNumber: string;
}

export async function getProfile(): Promise<Profile> {
  const [session, customer] = await Promise.all([requireSession(), getCurrentCustomer()]);
  const { displayName, email } = session.me.user;
  const words = displayName.split(/\s+/).filter((word) => /^\p{L}/u.test(word));

  return {
    displayName,
    firstName: words[0] ?? displayName,
    initials: words
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join(""),
    email,
    companyName: customer.name,
    accountNumber: customer.accountNumber,
  };
}
