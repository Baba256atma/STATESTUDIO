# NPA-T HOSTED-MVP:6-FIX1

**NPA-T HOSTED-MVP:6-FIX1 — CERTIFIED**

**NPA-T HOSTED-MVP:6 — NOT CERTIFIED**

This upgrade removes the known critical Next.js production advisory. It does not provision production infrastructure and does not claim SOC 2, ISO 27001, HIPAA, GDPR, or enterprise security.

## Advisory

Next.js 16.0.10 carried:

- GHSA-2xp9-vwfh-vxw4, Image Optimization remote code execution when AVIF is used, `>=16.0.0 <16.3.3`
- GHSA-p293-qw3h-jr36, remote code execution on Windows-hosted servers, `>=16.0.0 <16.3.3`

`npm audit --omit=dev` before the upgrade reported Next.js as critical through 16.3.7, with the fix at 16.4.2.

## Version

Next.js 16.0.10 → 16.4.2. React and React DOM remain 19.2.1. NextAuth remains 4.24.15.

Nexora source does not import `next/image` and does not configure AVIF or remote image patterns. The framework image route was still the vulnerable package surface, so the dependency was upgraded.

## Proof

- Production audit after upgrade: critical 0. Next.js is absent from the advisory list.
- Hosted auth, authorization, transition, manager data, operations, lifecycle, LLM context, production config, and Demo tests: 110 passed.
- Python LLM security, usage, and runtime: 31 passed.
- Hydration on port 3010: first `data-core-int4-ranked` false, hydration mismatches 0, page errors 0.
- Headers preserved. No HSTS.
- Incomplete production start: `START_EXIT:1`, `production_configuration_missing`, port closed.
- TSC_EXIT:0. BUILD_EXIT:0.
- Hosted listener PID 28771, Next.js 16.4.2, port 3010, `GET /executive` 200.

## Runtime

The previous Hosted process was Next.js 16.0.10. It stopped while `node_modules` was being replaced for this upgrade. Turbopack then failed to resolve the Next.js package and that process exited. That termination is an intentional upgrade replacement.

The authoritative runtime is process 28771 on port 3010. A later reload applied `agentRules: false` and was also intentional. No unexpected server failure was observed after 28771 became the listener.

Python dependency lock and audit remain incomplete. That is unchanged HOSTED-MVP:6 debt.
