# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

- `artifacts/chs-roofing` — Multi-page React + Vite marketing site for CHS Roofing
  (Cordova Home Services). Routing via wouter; central data in
  `src/lib/site-config.ts`; shared chrome via `src/components/SiteLayout.tsx`.
  Routes: `/`, `/services/{installation,repair,maintenance,storm-damage,specialty-roofing}`,
  `/materials/{asphalt-shingles,metal,tile,flat}`, `/gallery/{residential,commercial}`,
  `/about`, `/contact`.

## SMS Outreach Agent + Customer Portal v2

- **SMS agent** (`api-server/src/lib/outreachAgent.ts` + `lib/sms.ts`): Claude
  (`@anthropic-ai/sdk`) drafts outbound texts for new leads and replies to
  inbound SMS; Twilio REST transmits them. Without credentials it runs in
  simulation mode (messages logged with status `simulated`). Admin manages
  conversations/settings in the "SMS Outreach" section. Inbound webhook:
  `POST /api/sms/webhook` (Twilio, signature-validated). STOP/START opt-out
  handled and enforced on every send.
- **Roofr CRM sync**: Roofr has no public API — integration is
  Roofr → Zapier → `POST /api/integrations/roofr` (shared secret via
  `x-webhook-secret` header or `?secret=`). Creates a lead (source `roofr`)
  and hands it to the SMS agent.
- **Portal v2** (`/portal`): milestones timeline, categorized photos,
  documents center, inspections + service requests, warranty & maintenance
  centers, customer↔team messaging, referral section. Admin manages job
  content in JobDetail; requests/messages land in the "Portal Inbox" section
  and (optionally) notify the office by SMS.
- **Env secrets**: `ANTHROPIC_API_KEY` (AI drafting), `TWILIO_ACCOUNT_SID`,
  `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` or `TWILIO_MESSAGING_SERVICE_SID`
  (real SMS), `ROOFR_WEBHOOK_SECRET` (Zapier webhook auth),
  `OFFICE_NOTIFY_PHONE` (office alerts for portal requests/messages).
- Schema lives in `lib/db/src/schema/{portal,outreach}.ts`; `ensureTables.ts`
  self-heals all new tables/columns on server boot.
