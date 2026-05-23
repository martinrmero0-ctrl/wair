import type { ProfileSizes } from "@/lib/profile/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export type DbUserRow = {
  id: string;
  email: string;
  display_name: string | null;
  location: string | null;
  sizes: ProfileSizes | null;
  aesthetic_tags: string[] | null;
  created_at: string;
};

export async function ensureUserRow(
  supabase: SupabaseClient,
  userId: string,
  email: string,
) {
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (existing) return;

  await supabase.from("users").insert({
    id: userId,
    email,
    display_name: null,
    location: "New York City",
    sizes: { top: "M", waist: "32", shoe: "10" },
    aesthetic_tags: [],
  });
}

export async function fetchUserRow(
  supabase: SupabaseClient,
  userId: string,
): Promise<DbUserRow | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as DbUserRow;
}

export async function updateUserProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: {
    display_name?: string | null;
    location?: string | null;
    sizes?: ProfileSizes;
    aesthetic_tags?: string[];
  },
) {
  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId);

  if (error) throw error;
}
