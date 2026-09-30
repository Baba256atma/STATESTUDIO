# Tests executed

## Focused and owning layers

- SIM-TEST:2: 13 groups pass / 0 fail; requirements 1–35.
- SIM-TEST:1: 11 pass / 0 fail.
- RDI:2 CSV vertical slice: 23 pass / 0 fail.
- Stage object-focus placement: 12 pass / 0 fail.
- NXA Level 1 focused funnel: pass; 1 required started/passed, 0 failed, 0 skipped, no blockers.

## Regressions

- RMS:1–10 + FINAL focused suite: 59 pass / 0 fail.
- Changed-path ESLint: pass / 0 errors.
- Full TypeScript: pass / 0 errors using `node --max-old-space-size=8192`.
- Next.js production build: pass using the same heap allowance.

## Environmental retries

- `tsx` CLI attempts inside the filesystem sandbox could not open their local IPC socket (`EPERM`); the same tests ran with `node --import tsx`, and the required Level 1 funnel passed outside that socket restriction.
- Default-heap full typecheck/build attempts exhausted Node's 4 GB heap. Both passed with 8 GB; this changed capacity only, not compiler settings.
- The sandboxed build could not fetch configured Geist fonts. The permitted network run completed successfully.
- Next.js emitted the existing non-blocking stale `baseline-browser-mapping` data warning.
