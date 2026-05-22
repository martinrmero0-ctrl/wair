"use client";

import { useState } from "react";
import type { SocialComment, SocialPost } from "@/lib/social/types";
import { UserAvatarLink, UsernameLink } from "./UserProfileLink";

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

function CommentRow({ comment }: { comment: SocialComment }) {
  return (
    <div className="flex gap-2.5 py-2">
      <UserAvatarLink username={comment.username} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <UsernameLink
            username={comment.username}
            className="text-xs"
          />
          <span className="text-[10px] text-black/35">{comment.timestamp}</span>
        </div>
        <p className="mt-0.5 text-sm leading-snug text-black/75">
          {comment.text}
        </p>
      </div>
    </div>
  );
}

type SocialPostCardProps = {
  post: SocialPost;
};

export function SocialPostCard({ post }: SocialPostCardProps) {
  const [liked, setLiked] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<SocialComment[]>(post.comments);
  const [draft, setDraft] = useState("");

  const likeCount = post.likes + (liked ? 1 : 0);
  const commentCount = comments.length;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    setComments((prev) => [
      ...prev,
      {
        id: `${post.id}-new-${Date.now()}`,
        username: "yevouser",
        text,
        timestamp: "just now",
      },
    ]);
    setDraft("");
    setCommentsOpen(true);
  };

  return (
    <article className="border-b border-black/10 px-6 py-5">
      <div className="flex gap-3">
        <UserAvatarLink username={post.username} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <UsernameLink username={post.username} className="text-sm" />
            <span className="border border-black/15 px-2 py-0.5 text-[10px] tracking-[0.15em] text-black/55 uppercase">
              {typeLabel(post.type)}
            </span>
            <span className="text-xs text-black/35">{post.timestamp}</span>
          </div>

          <p className="mt-2 text-base leading-snug text-black">
            <span className="text-black/50">{actionVerb(post.type)}</span>
            {post.subject}
          </p>

          <p className="mt-1.5 text-sm text-black/55">
            &ldquo;{post.caption}&rdquo;
          </p>

          {post.type === "selling" && post.price ? (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-black">{post.price}</span>
              <button
                type="button"
                className="border border-black/20 px-3 py-1 text-xs tracking-wide text-black transition-colors hover:border-black hover:bg-black hover:text-white"
              >
                Message to buy
              </button>
            </div>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setLiked((v) => !v)}
              aria-pressed={liked}
              className={[
                "text-sm tracking-wide transition-colors",
                liked ? "text-black" : "text-black/40 hover:text-black/70",
              ].join(" ")}
            >
              {liked ? "♥" : "♡"} {likeCount}
            </button>
            <button
              type="button"
              onClick={() => setCommentsOpen((v) => !v)}
              aria-expanded={commentsOpen}
              className="text-sm tracking-wide text-black/40 transition-colors hover:text-black/70"
            >
              {commentCount} {commentCount === 1 ? "comment" : "comments"}
            </button>
          </div>

          {commentsOpen ? (
            <div className="mt-3 border-t border-black/8 pt-1">
              {comments.length > 0 ? (
                <div className="divide-y divide-black/5">
                  {comments.map((comment) => (
                    <CommentRow key={comment.id} comment={comment} />
                  ))}
                </div>
              ) : (
                <p className="py-2 text-sm text-black/40">No comments yet.</p>
              )}

              <form onSubmit={handleAddComment} className="mt-2 flex gap-2 pt-2">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Add a comment…"
                  className="min-w-0 flex-1 border border-black/15 bg-white px-3 py-2 text-sm text-black placeholder:text-black/35 outline-none focus:border-black/40"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="shrink-0 border border-black/20 px-3 py-2 text-xs tracking-wide text-black transition-colors hover:border-black hover:bg-black hover:text-white disabled:opacity-40"
                >
                  Post
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
