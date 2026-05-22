import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UserProfileView } from "@/components/social/UserProfileView";
import {
  getPostCount,
  getUserProfile,
  normalizeUsername,
  SOCIAL_USERS,
} from "@/lib/social/users";

type PageProps = {
  params: Promise<{ username: string }>;
};

export function generateStaticParams() {
  return Object.keys(SOCIAL_USERS).map((username) => ({ username }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = getUserProfile(username);
  if (!profile) {
    return { title: "Profile — Yevo" };
  }
  return {
    title: `@${profile.username} — Yevo`,
  };
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
  const profile = getUserProfile(username);

  if (!profile) {
    notFound();
  }

  const postCount = getPostCount(normalizeUsername(username));

  return <UserProfileView profile={profile} postCount={postCount} />;
}
