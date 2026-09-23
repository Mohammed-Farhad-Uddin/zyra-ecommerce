import { existsSync } from 'node:fs';
import path from 'node:path';
import { config as loadEnv } from 'dotenv';

// DB_URL lives in backend/.env. Load it before the server starts so Prisma can connect.
const backendEnv = path.resolve(process.cwd(), '../backend/.env');
if (existsSync(backendEnv)) loadEnv({ path: backendEnv });

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 16 writes AGENTS.md on startup. This app already has its own docs.
  agentRules: false,
  // The backend workspace ships TypeScript source rather than a build output,
  // so Next has to compile it alongside the app.
  transpilePackages: ['@aurelia/backend'],
  // bcryptjs is required from node_modules at runtime instead of being bundled.
  serverExternalPackages: ['bcryptjs', 'cloudinary'],
  images: {
    // Product photos come from remote CDNs and from local /public/uploads at runtime,
    // so the optimizer is bypassed to keep both sources working without sharp.
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
