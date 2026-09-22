# Aurelia — Fine Jewellery E-commerce

A responsive storefront and admin panel for a women's jewellery brand, built with Next.js 15 (App Router), Tailwind CSS, Prisma and MongoDB. Checkout is cash on delivery only — there is no payment gateway.

## Project layout

The repo is an npm workspace with two packages. Run every command from the root.

```
frontend/   @aurelia/frontend — Next.js app: pages, components, API routes, cart store
backend/    @aurelia/backend  — Prisma schema, seed, MongoDB access, admin account
```

`frontend` depends on `backend` as a normal package. The backend exposes three entry points so that server, client and edge code each import only what is safe for them:

| Import                      | Contains                                                   | Safe to use in                  |
| --------------------------- | ---------------------------------------------------------- | ------------------------------- |
| `@aurelia/backend`          | Prisma client, queries, slug/order helpers, image helpers    | Server components, API routes   |
| `@aurelia/backend/shared`   | DTO types, `ORDER_STATUSES`, `SHIPPING_FEE`                  | Anywhere, including client code |
| `@aurelia/backend/auth`     | Signed-session helpers (Web Crypto only)                     | Anywhere, including middleware  |

Importing the root entry point from a client component would pull Prisma into the browser bundle, which is why constants and types live in `/shared`.

## Quick start

```bash
npm install
```

Open `backend/.env` and set `DB_URL` to your MongoDB connection string. The database name must be in the path:

```
DB_URL="mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/aurelia?retryWrites=true&w=majority"
```

Then create the collections and demo products, and start the app:

```bash
npm run setup   # pushes the schema and seeds products
npm run dev     # also creates the admin account on startup
```

Then open http://localhost:3000

The admin panel is at http://localhost:3000/admin. There is one account, stored in MongoDB (password is hashed). It is created automatically every time the server starts.

## Scripts

All of these are run from the repo root and delegate to the right workspace.

| Command             | Description                                         |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Start the dev server                                 |
| `npm run build`     | Generate the Prisma client and build for production  |
| `npm run start`     | Serve the production build                           |
| `npm run setup`     | Push the schema and seed demo data                   |
| `npm run generate`  | Regenerate the Prisma client                         |
| `npm run db:push`   | Sync the schema to the database                      |
| `npm run db:seed`   | Reset and re-seed demo data                          |
| `npm run db:studio` | Browse the database in Prisma Studio                 |
| `npm run typecheck` | Type-check the whole app                             |

Re-run `npm run generate` after editing `backend/prisma/schema.prisma`.

## Routes

**Storefront**

| Path              | Purpose                                                   |
| ----------------- | --------------------------------------------------------- |
| `/`               | Hero, categories, New Arrivals, Popular Right Now          |
| `/shop`           | Full catalogue with category, price, sort and live search  |
| `/product/[slug]` | Gallery, details, quantity selector, add to cart           |
| `/cart`           | Full cart page (a slide-out drawer is available site-wide) |
| `/checkout`       | Cash-on-delivery form                                      |
| `/order/[id]`     | Order confirmation and summary                             |
| `/track`          | Look up an order by its ID                                 |

**Admin** (all protected by middleware)

| Path                  | Purpose                                              |
| --------------------- | ---------------------------------------------------- |
| `/admin`              | Stats, recent orders, low-stock alerts                |
| `/admin/products`     | Catalogue list, create and edit                       |
| `/admin/categories`   | Add, rename and delete categories                     |
| `/admin/orders`       | Order dashboard with status filters and updates       |

## How things work

**Database** — MongoDB via Prisma. Put the connection string in `backend/.env` as `DB_URL` (include the database name, usually `aurelia`, in the URL path). The Next.js server and the Prisma CLI both read that file, so it only has to be set once. After changing the URL, run `npm run setup` once so the collections and demo products exist. Atlas free-tier clusters are replica sets, which is what order creation needs for its transaction.

**Cart** — Zustand with `localStorage` persistence, so the bag survives a refresh. The store is in `frontend/src/store/cart.ts`.

**Orders** — `POST /api/orders` re-reads every price and stock level from the database before writing the order, so the client cannot influence the total. Stock is decremented in the same transaction. Order IDs look like `AUR-XXXXXX`.

**Admin auth** — One owner account, `Mohammed Farhad Uddin`, stored in the `Admin` collection with a bcrypt password hash. `frontend/src/instrumentation.ts` upserts that account when the server starts, and `npm run db:seed` does the same. Login checks the database, then sets an HMAC-signed httpOnly cookie (`backend/src/auth.ts`). `frontend/src/middleware.ts` redirects unsigned visitors away from `/admin`, and every mutating API route checks the cookie again.

**Images** — Products accept uploaded files (saved to `frontend/public/uploads`) or pasted URLs, and one image per product is flagged as the cover. `SmartImage` falls back to a local SVG if a remote image fails to load. The optimizer is disabled in `frontend/next.config.mjs` so uploads and remote URLs both work without `sharp`.

## Design

Cream and off-white backgrounds with charcoal text and gold accents, set in Cormorant Garamond (display) and Inter (body). The palette and shared component classes live in `frontend/tailwind.config.ts` and `frontend/src/app/globals.css` — change the `gold`, `rose` and `charcoal` scales there to re-skin the whole site. Layouts are mobile-first and verified from 375 px upward.

## Notes

- Demo product photography is hot-linked from Unsplash for the seed data. Replace it with your own imagery before going live.
- `frontend/public/uploads` is gitignored, so uploaded photos stay local to each environment.
