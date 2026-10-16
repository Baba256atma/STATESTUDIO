# NPA-T HOSTED-MVP:6

**NPA-T HOSTED-MVP:6 — NOT CERTIFIED**

This is not a claim of SOC 2, ISO 27001, HIPAA, GDPR, or enterprise security.

## Blockers

1. Next.js 16.0.10 has unresolved production advisories. `npm audit --omit=dev` reports one critical package finding. The applicable critical item is unauthenticated remote code execution in the Image Optimization API when AVIF is used, fixed only at 16.3.3 or later. The audit fix is Next.js 16.4.2. That upgrade was not applied.
2. No production Postgres, private FastAPI network, HTTPS origin, GitHub production OAuth app, provider key, managed backup, or alert destination was provisioned. Those require an owner cloud account and billing.

## What this phase changed

- Production Hosted startup exits with `production_configuration_missing` when the managed database, HTTPS origin, NextAuth secret, gateway secret, or GitHub OAuth values are missing, or when development sign-in is enabled.
- `DATABASE_URL` opens one Postgres pool with a maximum of 5 connections and applies the existing schema. Development continues to use `NEXORA_DATABASE_DIR`.
- `GET /api/health` returns only `ok` and `database` ready or unavailable.
- Security headers: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`. HSTS and a Content-Security-Policy were not added.
- Operator runbook: `RUNBOOK.md`. Launch checklist: `LAUNCH-CHECKLIST.md`.

## Platform

Render: one web service, one private FastAPI service, one managed Postgres database. No Kubernetes. Estimated MVP cost is about $21–40 per month. The usage ledger remains one file on a persistent disk attached to that single FastAPI instance. Multi-instance safety is not certified.

## Proof recorded here

- TSC_EXIT:0
- BUILD_EXIT:0
- Production start with Hosted mode and an HTTP localhost origin: START_EXIT:1, `production_configuration_missing`
- Hosted auth, lifecycle, authorization, and production-config tests: 13 passed
- Ports 3000 and 3010 were left running. The temporary listener on 3016 was closed.

## Not proven

Production customer journey, fresh-browser recovery, live GitHub OAuth, live provider call, database restore, HTTPS, and private-network isolation of FastAPI.
