/** Jaccard similarity of aesthetic tags, returned as 0–100. */
export function computeTasteMatch(
  viewerTags: string[],
  profileTags: string[],
): number {
  if (viewerTags.length === 0 || profileTags.length === 0) return 0;

  const profileSet = new Set(profileTags);
  const overlap = viewerTags.filter((tag) => profileSet.has(tag)).length;
  const union = new Set([...viewerTags, ...profileTags]).size;

  return Math.round((overlap / union) * 100);
}
