# NPA-T BUILD-FIX:SIM5 — Next.js TypeScript Worker

**Status: CERTIFIED**

Date: 2026-09-28.

The reported “hang” was a **CPU-active Next TypeScript worker** (~3 minutes) plus **default Node heap too small** for this graph. Direct `tsc --noEmit` PASS (~48s, ~6.97 GB RSS). Canonical `next build` completes when given 8 GB and enough time (do not kill at 125s).

**SIM-TEST:5 recertification: RECERTIFIED** (harness S0=0 S1=0; production build exit 0; `/executive` and `/executive/watch` load from the new build).

SIM-TEST:6 was not started.
