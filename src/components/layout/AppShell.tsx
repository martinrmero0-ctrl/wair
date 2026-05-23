"use client";

import { usePathname } from "next/navigation";
import { AuthSessionGate } from "@/components/auth/AuthSessionGate";
import { OneSignalInit } from "@/components/onesignal/OneSignalInit";
import { TopNav } from "@/components/nav/TopNav";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const hideNav = pathname === "/auth";

  return (
    <AuthSessionGate>
      {!hideNav ? <OneSignalInit /> : null}
      {!hideNav ? <TopNav /> : null}
      <div className={hideNav ? "min-h-dvh" : "page-with-nav"}>{children}</div>
    </AuthSessionGate>
  );
}
