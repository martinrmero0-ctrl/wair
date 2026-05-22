import Link from "next/link";

export default function UserProfileNotFound() {
  return (
    <main className="flex min-h-[calc(100dvh-var(--nav-height))] flex-col items-center justify-center bg-white px-6">
      <h1 className="text-2xl font-medium italic text-black">User not found</h1>
      <p className="mt-2 text-black/50">This profile doesn&apos;t exist.</p>
      <Link
        href="/social"
        className="mt-6 border border-black/20 px-4 py-2 text-sm tracking-wide text-black hover:border-black hover:bg-black hover:text-white"
      >
        Back to Social
      </Link>
    </main>
  );
}
