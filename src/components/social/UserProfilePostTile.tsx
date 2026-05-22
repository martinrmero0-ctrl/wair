import type { SocialPost } from "@/lib/social/types";

function typeLabel(type: SocialPost["type"]) {
  if (type === "bought") return "BOUGHT";
  if (type === "rated") return "RATED";
  return "SELLING";
}

type UserProfilePostTileProps = {
  post: SocialPost;
};

export function UserProfilePostTile({ post }: UserProfilePostTileProps) {
  return (
    <article className="flex flex-col border border-black/10 bg-white p-3">
      <span className="text-[10px] tracking-[0.15em] text-black/45 uppercase">
        {typeLabel(post.type)}
      </span>
      <p className="mt-2 text-sm leading-snug font-medium text-black line-clamp-2">
        {post.subject}
      </p>
      <p className="mt-1 text-xs text-black/50 line-clamp-2">
        &ldquo;{post.caption}&rdquo;
      </p>
      {post.type === "selling" && post.price ? (
        <p className="mt-2 text-xs font-medium text-black">{post.price}</p>
      ) : null}
      <p className="mt-2 text-[10px] text-black/35">{post.timestamp}</p>
    </article>
  );
}
