export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Guarantees a unique slug by appending a counter when the base is taken. */
export function uniqueSlug(base: string, taken: string[]) {
  const root = slugify(base) || 'item';
  if (!taken.includes(root)) return root;
  let i = 2;
  while (taken.includes(`${root}-${i}`)) i += 1;
  return `${root}-${i}`;
}

export function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const random = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `AUR-${stamp}${random}`;
}
