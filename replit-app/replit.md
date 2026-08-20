# Community Resource Allocation

An open community board for submitting resource requests, casting one vote per member, and exploring a transparent weighted allocation ranking.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/community-allocation` — React/Vite web app and shared civic visual language.
- `artifacts/api-server/src/routes/allocation.ts` — auth, requests, ranking, and voting API.
- `lib/db/src/schema/allocation.ts` — PostgreSQL schema for members, requests, and votes.
- `lib/api-spec/openapi.yaml` — source-of-truth API contract.

## Architecture decisions

- The ranking is computed server-side so every viewer sees the same explainable score.
- Public ranking and request browsing do not require an account; submitting and voting do.
- A member's vote is enforced at the database level with a unique user constraint.

## Product

- Public ranked board with need, urgency, community support, and waiting-time contributions.
- Member registration/login, request submission, request search/filtering, and one-time voting.
- Seeded requests make the board useful immediately after setup.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
