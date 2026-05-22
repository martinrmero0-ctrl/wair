import Link from "next/link";
import type { SocialPost } from "@/lib/social/types";

function typeLabel(type: SocialPost["type"]) {
  if (type === "bought") return "BOUGHT";
  if (type === "rated") return "RATED";
  return "SELLING";
}

function actionVerb(type: SocialPost["type"]) {
  if (type === "rated") return "rated ";
  if (type === "selling") return "selling ";
  return "bought ";
}

type RecentActivityItemProps = {
  post: SocialPost;
};

export function RecentActivityItem({ post }: RecentActivityItemProps) {
  return (
    <Link
      href="/social"
      className="block border-b border-black/8 py-3 last:border-b-0 transition-colors hover:bg-black/[0.02]"
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] tracking-[0.12em] text-black/45 uppercase">
          {typeLabel(post.type)}
        </span>
        <span className="text-[10px] text-black/30">{post.timestamp}</span>
      </div>
      <p className="mt-1 text-sm text-black">
        <span className="text-black/45">{actionVerb(post.type)}</span>
        {post.subject}
      </p>
      {post.type === "selling" && post.price ? (
        <p className="mt-0.5 text-xs text-black/55">{post.price}</p>
      ) : null}
    </Link>
  );
}
