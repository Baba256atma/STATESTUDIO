# NPA-T HOSTED-MVP:6-DEPLOY:4 — WAITING FOR OWNER

Date: 2026-10-18 (America/Vancouver)

This is not a production certification. The repository and deployment contract have been audited and repaired, but no `nexora-web` Render Web Service exists yet. Real HTTPS, OAuth, PostgreSQL, manager-workspace, LLM-gateway, log, and recovery checks therefore remain unexecuted.

## Stop condition and first owner boundary

The stop condition for this mission is an actual Oregon `nexora-web` Web Service that deploys a known GitHub `main` commit, starts in Hosted mode, passes `/api/health`, and passes the required public, Demo, authentication, PostgreSQL-persistence, private-LLM, isolation, log, and security checks.

The Render workspace currently contains `nexora-backend` and no `nexora-web`. It also contains no shared environment group. `nexora-backend` has a concealed `NEXORA_LLM_GATEWAY_SECRET`, but the matching value cannot be transferred to a new web service without an owner-controlled secret operation. No secret value was displayed, copied, logged, committed, or placed in this artifact.

Next owner action only: securely arrange the same `NEXORA_LLM_GATEWAY_SECRET` for both Render services (for example, through a Render environment group or manual dashboard copy) without pasting its value into chat. Resume this mission after that boundary is complete.

## Repository and runtime audit

- Repository: `Baba256atma/STATESTUDIO`
- Production branch: `main`
- Audited local base: `37935f3f deploy 3 for render is done`
- Render backend's last successful deploy shown during audit: `30e1c4b4a9f48d245bce0a9389730563c574f536`
- Frontend root: `frontend`
- App Router: `frontend/app`
- Next.js: `16.4.2`
- NextAuth: `4.24.15`
- Node pin: repository-root `.node-version`, `24.10.0`
- Install: `npm ci`
- Build: `npm run build` (`NODE_OPTIONS='--max-old-space-size=8192' next build`)
- Start: `npm run start` (`next start`)
- Production graph audit: 0 known vulnerabilities (`npm audit --omit=dev`)
- Full development graph audit: 17 advisories (1 low, 4 moderate, 12 high, 0 critical). These are build/test-tool dependencies and remain debt; none are in the installed production graph.

Only tracked `.env` templates were found (`backend/.env.example` and `frontend/.env.example`). No tracked `.next`, local Hosted workspace database, SQLite/database file, production secret, or Render credential was identified by the bounded source-hygiene check. The working tree is intentionally not clean because this mission's repairs and evidence are not yet committed or pushed.

## First divergent layer and repair

Expected: Hosted production must require the private FastAPI origin and must never fall back to a public/browser URL or localhost.

Actual before repair: `readHostedProductionConfig` returned `ok: true` when `NEXORA_PRIVATE_API_BASE` was absent, and Hosted LLM dispatch could fall through to the generic `apiBase()` authority.

Repair: `NEXORA_PRIVATE_API_BASE` is now required and validated as a non-loopback HTTP(S) URL in Hosted production. Hosted LLM dispatch fails with `503 workspace_unavailable` when it is missing and no longer consults `NEXT_PUBLIC_API_BASE` or localhost. Development behavior remains unchanged. The runbook, launch checklist, environment template, and focused tests use the same authority.

The Vitest 5 security update exposed a resolver incompatibility. `vitest.config.mts` now tells Vitest/Vite to read the existing `tsconfig.json` path-map authority via `resolve.tsconfigPaths`; no second alias map was created.

## Authoritative production contracts

### PostgreSQL

`DATABASE_URL` is read only by the Next.js server-side Hosted workspace store. When present it constructs a PostgreSQL pool; the filesystem store is selected only outside the valid Hosted-production contract. Startup validation rejects a missing `DATABASE_URL` before a Hosted production server remains available.

The existing store applies its idempotent schema SQL before access. Its table authority is:

- `hosted_workspace`
- `hosted_pending_csv`
- `hosted_data_source`
- `hosted_observation`
- `hosted_decision`
- `hosted_execution`
- `hosted_saved_scene`

No migration framework, parallel store, or additional production table was introduced. Fresh initialization against the real Render PostgreSQL database remains a deployment-time proof and is not claimed here.

### Authentication

The production provider is GitHub through NextAuth `4.24.15`. Sessions remain JWT-based; no database adapter was added. The canonical principal continues to derive from the GitHub provider account ID, not email, name, or avatar. Development credentials sign-in is admitted only by the existing local-development guard and is rejected by Hosted production validation.

Planned production origin: `https://nexora-web.onrender.com`

Exact planned GitHub callback: `https://nexora-web.onrender.com/api/auth/callback/github`

The service name/hostname has not yet been reserved. The callback must be confirmed against Render's actual generated HTTPS hostname before GitHub OAuth is changed. GitHub OAuth was not modified during this mission.

### Private LLM path

The audited path remains:

`Browser -> /api/nexora/llm -> NextAuth principal -> workspace authorization -> canonical server context -> Private FastAPI /nexora/llm/runtime -> OpenAI`

The server-only FastAPI variable is `NEXORA_PRIVATE_API_BASE`. The existing Oregon private-service address is `nexora-backend-91el:10000`, so the web-service value is `http://nexora-backend-91el:10000`. It is not a `NEXT_PUBLIC_*` value. The server attaches `NEXORA_LLM_GATEWAY_SECRET`; browser input cannot provide or override it. `OPENAI_API_KEY` remains on `nexora-backend` and is not a web-service variable.

## Exact `nexora-web` Render configuration

| Field | Required value |
| --- | --- |
| Service type | Web Service |
| Name | `nexora-web` |
| Repository | `Baba256atma/STATESTUDIO` |
| Branch | `main` |
| Root directory | `frontend` |
| Runtime | Node |
| Region | Oregon (US West) |
| Build command | `npm ci && npm run build` |
| Start command | `npm run start` |
| Health check | `/api/health` |
| Auto-deploy | On Commit from `main` |
| Compute | `0.5c-512mb` (0.5 CPU, 512 MB RAM) |
| Instances | One; autoscaling disabled |
| Persistent disk | None |
| Expected compute cost | USD $7/month, before bandwidth or workspace charges |

This is a first Public MVP capacity choice, not a large-traffic sufficiency claim. Render documents the current plan specifications and pricing at <https://render.com/docs/compute-plans> and <https://render.com/pricing>.

Rollback authority after deployment: select and redeploy the previous known-good Render deploy/commit for `nexora-web`; do not introduce a competing production branch.

## Exact environment-variable inventory

| Variable | Classification | Required production source/value contract |
| --- | --- | --- |
| `NEXORA_DEPLOYMENT_MODE` | SERVER CONFIG | Literal `hosted` |
| `DATABASE_URL` | RENDER RESOURCE CONNECTION | Internal connection URL from existing production PostgreSQL `nexora`; never expose or commit |
| `NEXTAUTH_URL` | SERVER CONFIG | Actual Render HTTPS origin, planned `https://nexora-web.onrender.com` |
| `NEXTAUTH_SECRET` | SECRET | Strong independent production secret; not the gateway secret |
| `GITHUB_ID` | SERVER CONFIG | Existing GitHub OAuth application's client ID |
| `GITHUB_SECRET` | SECRET | Existing GitHub OAuth application's client secret |
| `NEXORA_LLM_GATEWAY_SECRET` | SECRET | Must exactly match the concealed value on `nexora-backend` |
| `NEXORA_PRIVATE_API_BASE` | SERVER CONFIG | `http://nexora-backend-91el:10000` |

Do not add `OPENAI_API_KEY`, `NEXORA_AUTH_DEV_SIGN_IN`, a public API base, or any secret-prefixed `NEXT_PUBLIC_*` variable to `nexora-web`.

## Local evidence

| Gate | Result |
| --- | --- |
| Clean lockfile install | PASS — `npm ci` exited 0 after dependency updates |
| Installed versions | PASS — Node `24.10.0`, Next `16.4.2`, NextAuth `4.24.15`, Vitest `5.0.5` |
| Focused Hosted suite | PASS — 12/12 tests, including cross-stack Hosted route closure |
| Scene Vitest compatibility | PASS — 31 files, 180/180 tests |
| Required NXA funnel Level 1 | PASS — 0 failed, 0 skipped, 0 unresolved/running tasks |
| Typecheck | PASS — `NODE_OPTIONS=--max-old-space-size=8192 npm run typecheck` exited 0 |
| Production application build | PASS under framework-supported webpack mode — compile, integrated TypeScript, 14 static pages, dynamic routes, optimization, and trace collection all completed |
| Default `npm run build` in managed sandbox | ENVIRONMENTAL — first attempt could not reach Google Fonts; network-enabled retry reached compilation but Turbopack was forbidden from binding its internal CSS-worker loopback port (`EPERM`). This is not classified as an application defect and is not represented as an exact-command pass |
| Hosted startup without required values | PASS — with a permitted local bind, Next.js became ready and instrumentation immediately emitted `production_configuration_missing`, then exited 1 |
| Production dependency audit | PASS — 0 vulnerabilities |

No actual production secret was used in local tests or builds.

## Security and browser boundary

The build and code audit found all required secrets on server-only access paths. No audited secret uses a `NEXT_PUBLIC_*` variable. The existing response headers remain:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Permissions-Policy` disabling camera, microphone, and geolocation

HSTS and CSP are not configured and are not claimed. No persistent disk is required by the Next.js runtime because manager truth belongs in PostgreSQL.

## Real-production gates not yet run

Because `nexora-web` does not exist, the following are explicitly unverified: actual GitHub-main deployment identity, Render build/start, `/api/health`, HTTPS/static assets/hydration, anonymous Demo, GitHub OAuth round trip, authenticated principal, workspace creation and recovery from PostgreSQL after session restart, cross-principal isolation, private FastAPI reachability, gateway credential acceptance/rejection, provider-safe failure behavior, production log privacy, and rollback execution.

No paid provider call was made. No destructive lifecycle or outage test was attempted.

## Remaining debt after the owner boundary

- Create/configure the single `nexora-web` service with the table above only after secret pairing is available.
- Confirm the generated hostname and configure the exact GitHub callback before authentication testing.
- Commit and push the reviewed mission diff to `main`, then prove Render deployed that exact commit.
- Execute every real-production gate listed above; only then may this mission become `CERTIFIED`.
- Resolve or formally accept the remaining development-only npm advisories. Production dependencies currently have zero advisories.

Do not mark `HOSTED-MVP:6` certified and do not start `PUBLIC-MVP:FINAL` from this artifact.
