const FIRST_DECK_KEY = "wair-first-deck-complete";
const PROMPT_STATUS_KEY = "wair-notification-prompt-status";

export type NotificationPromptStatus = "unseen" | "dismissed" | "allowed";

export function hasCompletedDeckBefore(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(FIRST_DECK_KEY) === "true";
}

export function markFirstDeckComplete(): void {
  localStorage.setItem(FIRST_DECK_KEY, "true");
}

export function getNotificationPromptStatus(): NotificationPromptStatus {
  if (typeof window === "undefined") return "unseen";
  const value = localStorage.getItem(PROMPT_STATUS_KEY);
  if (value === "dismissed" || value === "allowed") return value;
  return "unseen";
}

export function setNotificationPromptStatus(status: NotificationPromptStatus): void {
  localStorage.setItem(PROMPT_STATUS_KEY, status);
}

export function shouldShowNotificationPrompt(): boolean {
  return getNotificationPromptStatus() === "unseen";
}
