export interface NavItem {
  label: string;
  href: string;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", description: "Billing overview and key metrics" },
  { label: "Invoices & Credits", href: "/invoices", description: "Invoices and credit memos" },
  { label: "Weekly Billing History", href: "/billing-history", description: "Weekly invoicing activity" },
  { label: "Aging Summary", href: "/aging", description: "Outstanding balances by age" },
  { label: "Payments", href: "/payments", description: "Pay open invoices" },
  { label: "Payment History", href: "/payment-history", description: "Past payments and status" },
];
