import { ONESIGNAL_APP_ID } from "@/lib/onesignal/config";

export type ScheduleDailyNotificationResult = {
  ok: boolean;
  scheduledFor?: string;
  error?: string;
};

/** Next 9:00 AM local time as ISO string for OneSignal `send_after`. */
export function getNextDailySendTime(): string {
  const scheduled = new Date();
  scheduled.setHours(9, 0, 0, 0);
  if (scheduled.getTime() <= Date.now()) {
    scheduled.setDate(scheduled.getDate() + 1);
  }
  return scheduled.toISOString();
}

/**
 * Schedules a push notification via the OneSignal REST API (server route).
 * Requires ONESIGNAL_REST_API_KEY on the server.
 */
export async function scheduleDailyNotification(): Promise<ScheduleDailyNotificationResult> {
  try {
    const response = await fetch("/api/notifications/daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = (await response.json()) as ScheduleDailyNotificationResult & {
      error?: string;
    };

    if (!response.ok) {
      return {
        ok: false,
        error: data.error ?? "Failed to schedule notification",
      };
    }

    return data;
  } catch {
    return { ok: false, error: "Failed to schedule notification" };
  }
}

export const DAILY_NOTIFICATION = {
  appId: ONESIGNAL_APP_ID,
  title: "Your daily picks are ready",
  body: "8 new pieces are waiting for you",
  url: "/swipe",
} as const;
