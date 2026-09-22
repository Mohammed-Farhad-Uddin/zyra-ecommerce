export type IncomingImage = { url: string; isPrimary?: boolean; alt?: string };

/** Keeps exactly one primary image and stores display order. */
export function normalizeImages(images: IncomingImage[], alt: string) {
  const cleaned = images.filter((image) => image?.url?.trim());
  const primaryIndex = Math.max(
    0,
    cleaned.findIndex((image) => image.isPrimary),
  );

  return cleaned.map((image, index) => ({
    url: image.url.trim(),
    alt: image.alt?.trim() || alt,
    isPrimary: index === primaryIndex,
    position: index,
  }));
}
