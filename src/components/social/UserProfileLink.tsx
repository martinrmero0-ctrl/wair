import Link from "next/link";
import { initialsFromUsername } from "@/lib/social/utils";

type UserAvatarLinkProps = {
  username: string;
  size?: "sm" | "md";
  className?: string;
};

const AVATAR_SIZES = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-10 w-10 text-xs",
};

export function UserAvatarLink({
  username,
  size = "md",
  className = "",
}: UserAvatarLinkProps) {
  return (
    <Link
      href={`/profile/${username}`}
      className={[
        "flex shrink-0 items-center justify-center rounded-full border border-black/15 bg-white font-medium tracking-wide text-black transition-opacity hover:opacity-70",
        AVATAR_SIZES[size],
        className,
      ].join(" ")}
      aria-label={`@${username} profile`}
    >
      {initialsFromUsername(username)}
    </Link>
  );
}

type UsernameLinkProps = {
  username: string;
  className?: string;
};

export function UsernameLink({ username, className = "" }: UsernameLinkProps) {
  return (
    <Link
      href={`/profile/${username}`}
      className={[
        "font-medium text-black transition-opacity hover:opacity-70",
        className,
      ].join(" ")}
    >
      @{username}
    </Link>
  );
}
