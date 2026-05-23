import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Sign in — Yevo",
};

export default function AuthPage() {
  return <AuthForm />;
}
