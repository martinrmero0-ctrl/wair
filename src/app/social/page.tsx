import type { Metadata } from "next";
import { SocialView } from "@/components/social/SocialView";

export const metadata: Metadata = {
  title: "Social — Yevo",
};

export default function SocialPage() {
  return <SocialView />;
}
