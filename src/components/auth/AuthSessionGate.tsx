"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const PROTECTED_ROUTES = ["/swipe", "/wishlist", "/social", "/profile"];

type AuthSessionGateProps = {
  children: React.ReactNode;
};

export function AuthSessionGate({ children }: AuthSessionGateProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const check = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const needsAuth = PROTECTED_ROUTES.includes(pathname);

      if (!session && needsAuth) {
        router.replace("/auth");
        return;
      }

      if (session && pathname === "/auth") {
        router.replace("/swipe");
        return;
      }

      setReady(true);
    };

    check();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      check();
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  if (!ready && (PROTECTED_ROUTES.includes(pathname) || pathname === "/auth")) {
    return (
      <div className="flex min-h-[calc(100dvh-var(--nav-height))] items-center justify-center bg-white">
        <p className="text-black/40">Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}
