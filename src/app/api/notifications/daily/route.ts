import { NextResponse } from "next/server";
import { ONESIGNAL_APP_ID } from "@/lib/onesignal/config";
import {
  DAILY_NOTIFICATION,
  getNextDailySendTime,
} from "@/lib/notifications/scheduleDailyNotification";

export async function POST(request: Request) {
  const restApiKey = process.env.ONESIGNAL_REST_API_KEY;

  if (!restApiKey) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "ONESIGNAL_REST_API_KEY is not configured. Add it to your environment to schedule notifications.",
      },
      { status: 503 },
    );
  }

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  const sendAfter = getNextDailySendTime();
  const launchUrl = new URL(DAILY_NOTIFICATION.url, origin).toString();

  const response = await fetch("https://api.onesignal.com/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${restApiKey}`,
    },
    body: JSON.stringify({
      app_id: ONESIGNAL_APP_ID,
      target_channel: "push",
      included_segments: ["Subscribed Users"],
      headings: { en: DAILY_NOTIFICATION.title },
      contents: { en: DAILY_NOTIFICATION.body },
      url: launchUrl,
      send_after: sendAfter,
      name: "wair-daily-picks",
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    return NextResponse.json(
      { ok: false, error: errorBody || "OneSignal API error" },
      { status: response.status },
    );
  }

  return NextResponse.json({ ok: true, scheduledFor: sendAfter });
}
