"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/swipe", label: "Swipe" },
  { href: "/nearby", label: "Explore" },
  { href: "/social", label: "Social" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/profile", label: "Profile" },
] as const;

function navLinkClass(isActive: boolean) {
  return [
    "text-[11px] uppercase tracking-[0.2em] transition-colors",
    isActive ? "text-black" : "text-[rgba(0,0,0,0.3)] hover:text-black/55",
  ].join(" ");
}

export function TopNav() {
  const pathname = usePathname();

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between bg-white px-4 py-3.5 sm:px-6"
      style={{ borderBottom: "0.5px solid rgba(0, 0, 0, 0.08)" }}
    >
      <Link
        href="/"
        className="text-xl font-medium italic tracking-tight text-black"
      >
        Yevo
      </Link>

      <nav
        className="flex items-center gap-3 sm:gap-5"
        aria-label="Main navigation"
      >
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={navLinkClass(pathname === href)}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
