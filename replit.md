# Órale Network Portal

A community-focused web portal for the Órale Network — showcasing upcoming events, a city-grouped business directory (the "Órale Business Corner"), and an admin panel for managing all content without touching code.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Optional env: `SESSION_SECRET` — JWT signing secret for admin auth (defaults to `"orale-secret"` in dev)
- Optional env: `ADMIN_PASSWORD` — admin panel password (see `artifacts/api-server/src/routes/adminLogin.ts`)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Frontend: React + Vite + Tailwind CSS + shadcn/ui + Framer Motion

## Where things live

- **DB schema**: `lib/db/src/schema/` — `events.ts`, `businesses.ts`, `businessSubmissions.ts`, `contact_submissions.ts`
- **API routes**: `artifacts/api-server/src/routes/` — one file per resource
- **Route registration**: `artifacts/api-server/src/routes/index.ts`
- **Seed data**: `artifacts/api-server/src/seed.ts` — runs on startup if tables are empty
- **Frontend pages**: `artifacts/orale-portal/src/pages/` — `Events.tsx`, `BusinessCorner.tsx`, `Home.tsx`
- **Admin panel**: `artifacts/orale-portal/src/pages/admin/` — `AdminLogin.tsx`, `AdminDashboard.tsx`
- **API client lib**: `artifacts/orale-portal/src/lib/adminApi.ts` — typed fetch wrappers for all endpoints
- **Auth middleware**: `artifacts/api-server/src/middleware/auth.ts` — JWT-based, 24h expiry

## Architecture decisions

- Events and business listings are stored in PostgreSQL and served via REST API — no static data in frontend components.
- The admin panel uses password-based login that issues a short-lived JWT; token stored in localStorage and sent as `Authorization: Bearer <token>`.
- Business listing *requests* (from the public "Get Listed" flow) live in `business_submissions` — separate from the approved `businesses` table.
- City ordering in the Business Corner is driven by the DB `sort_order` field; the frontend groups by city and preserves DB order within each group.
- The API server seeds initial data (one event, placeholder business listings per city) on first startup via `seedIfEmpty()`.

## Product

- **Events page** (`/events`): Shows upcoming events fetched from the DB — poster image, date, venue, organizer, and ticket link. Admins can add/edit/hide events from the admin panel without a code deploy.
- **Business Corner** (`/business-corner`): City-grouped directory of community businesses, with YouTube embeds, phone, and website links. "Coming Soon" placeholders fill empty slots. Admins manage listings from the admin panel.
- **Admin panel** (`/admin`): Password-protected dashboard with tabs for Events, Business Listings, Contact Submissions. Full create/edit/delete for events and businesses.

## User preferences

- Keep the admin panel clean and minimal — no heavy UI frameworks inside admin components, use inline styled elements that match the dark theme.

## Gotchas

- Always run `pnpm --filter @workspace/db run push` after changing a schema file in `lib/db/src/schema/`.
- `businessSubmissions` route (`routes/businessSubmissions.ts`) must be imported in `routes/index.ts` to be active — it handles both the public `/businesses/submit` endpoint and admin review endpoints.
- The `CITY_ORDER` constant in `AdminDashboard.tsx` must stay in sync with the cities used in `seed.ts` and the `businesses` table.
- Do not add leaf workspace packages to the root `tsconfig.json` references.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
