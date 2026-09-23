import { existsSync } from 'node:fs';
import path from 'node:path';
import { v2 as cloudinary } from 'cloudinary';
import { config as loadEnv } from 'dotenv';
import { prisma } from './prisma';

const FOLDER = 'zyra/products';

function loadCloudinaryEnv() {
  if (
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
    process.env.CLOUDINARY_API_KEY?.trim() &&
    process.env.CLOUDINARY_API_SECRET?.trim()
  ) {
    return;
  }

  const files = [
    path.join(process.cwd(), 'backend', '.env'),
    path.join(process.cwd(), '..', 'backend', '.env'),
    path.join(process.cwd(), '.env'),
  ];

  for (const file of files) {
    if (existsSync(/*turbopackIgnore: true*/ file)) loadEnv({ path: file });
  }
}

loadCloudinaryEnv();

function credentials() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim() ?? '';
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim() ?? '';
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim() ?? '';

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to backend/.env, then restart.',
    );
  }

  return { cloudName, apiKey, apiSecret };
}

function api() {
  const { cloudName, apiKey, apiSecret } = credentials();
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
  return cloudinary;
}

/** Short-lived signature so the browser can upload straight to Cloudinary. */
export function createUploadSignature() {
  const { cloudName, apiKey, apiSecret } = credentials();
  const timestamp = Math.round(Date.now() / 1000);
  const signature = api().utils.api_sign_request({ timestamp, folder: FOLDER }, apiSecret);

  return { timestamp, folder: FOLDER, signature, apiKey, cloudName };
}

/**
 * Public id for an image we uploaded. Other URLs (Unsplash, pasted links,
 * another Cloudinary account) return null so they are never deleted.
 */
export function cloudinaryPublicId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'res.cloudinary.com') return null;

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    if (!cloudName || !parsed.pathname.startsWith(`/${cloudName}/`)) return null;

    const marker = '/image/upload/';
    const start = parsed.pathname.indexOf(marker);
    if (start === -1) return null;

    const rest = parsed.pathname.slice(start + marker.length).replace(/^v\d+\//, '');
    const publicId = rest.replace(/\.[a-z0-9]+$/i, '');
    if (!publicId.startsWith(`${FOLDER}/`)) return null;
    return publicId;
  } catch {
    return null;
  }
}

/** Deletes Cloudinary files that no product image still points at. */
export async function deleteUnusedCloudinaryImages(urls: string[]) {
  const unique = [...new Set(urls.map((url) => url.trim()).filter(Boolean))];
  const owned = unique.filter((url) => cloudinaryPublicId(url));
  if (owned.length === 0) return;

  const stillUsed = await prisma.productImage.findMany({
    where: { url: { in: owned } },
    select: { url: true },
  });
  const used = new Set(stillUsed.map((image) => image.url));
  const removable = owned.filter((url) => !used.has(url));

  await Promise.all(
    removable.map(async (url) => {
      const publicId = cloudinaryPublicId(url);
      if (!publicId) return;
      await api().uploader.destroy(publicId, { resource_type: 'image', invalidate: true });
    }),
  );
}
