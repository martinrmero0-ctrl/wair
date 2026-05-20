type ProfileSectionProps = {
  title: string;
  children: React.ReactNode;
};

export function ProfileSection({ title, children }: ProfileSectionProps) {
  return (
    <section className="border-b border-black/10 py-6">
      <h2 className="mb-4 text-xs tracking-[0.15em] text-black/50 uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}
