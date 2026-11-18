// Temporary display fixes for client names the Finances API has wrong.
// Client 20 comes back as "IMS - Amatex"; the client is actually Amamex.
// Remove an entry once the API returns the correct name.
const CLIENT_NAME_OVERRIDES: Record<string, string> = {
  "20": "Amamex",
};

export function displayClientName(client: { code: string; name: string }): string {
  return CLIENT_NAME_OVERRIDES[client.code] ?? client.name;
}

// Same typo shows up in user display names (e.g. "Test User - Amatex"), and the
// test account's "Test User - " prefix shouldn't be shown to clients.
export function displayUserName(name: string): string {
  return name.replace(/^test user\s*-\s*/i, "").replace(/\bAmatex\b/gi, "Amamex");
}
