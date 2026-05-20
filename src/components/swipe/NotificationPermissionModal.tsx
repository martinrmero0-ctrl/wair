"use client";

import { scheduleDailyNotification } from "@/lib/notifications/scheduleDailyNotification";
import { setNotificationPromptStatus } from "@/lib/notifications/prompt-storage";

type NotificationPermissionModalProps = {
  open: boolean;
  onClose: () => void;
  onAllow: () => Promise<boolean>;
};

export function NotificationPermissionModal({
  open,
  onClose,
  onAllow,
}: NotificationPermissionModalProps) {
  if (!open) return null;

  const handleAllow = async () => {
    const granted = await onAllow();
    if (granted) {
      await scheduleDailyNotification();
      setNotificationPromptStatus("allowed");
    } else {
      setNotificationPromptStatus("dismissed");
    }
    onClose();
  };

  const handleLater = () => {
    setNotificationPromptStatus("dismissed");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-prompt-title"
    >
      <div className="w-full max-w-sm border border-black/10 bg-white p-8 text-center shadow-sm">
        <p
          id="notification-prompt-title"
          className="text-xl leading-snug font-medium text-black"
        >
          Get notified when tomorrow&apos;s picks are ready
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleAllow}
            className="w-full bg-black py-3 text-sm tracking-wide text-white uppercase transition-opacity hover:opacity-85"
          >
            Allow
          </button>
          <button
            type="button"
            onClick={handleLater}
            className="w-full border border-black/20 py-3 text-sm tracking-wide text-black/55 uppercase transition-colors hover:border-black/40 hover:text-black"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
