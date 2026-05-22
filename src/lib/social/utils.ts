export function initialsFromUsername(username: string): string {
  const clean = username.replace(/^@/, "");
  if (clean.length <= 2) return clean.toUpperCase();
  return clean.slice(0, 2).toUpperCase();
}
