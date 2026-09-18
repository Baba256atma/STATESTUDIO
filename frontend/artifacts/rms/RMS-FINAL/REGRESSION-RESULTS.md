# RMS:FINAL regression results

Focused command:

`./node_modules/.bin/tsx --test` on RMS:1–10 suites plus `rmsFinalCertification.test.ts`

**59 pass / 0 fail**

Breakdown:

- RMS:1–10 focused: 51
- RMS:FINAL architecture/E2E: 8

ESLint on FINAL surfaces: 0 errors.

`NODE_OPTIONS='--max-old-space-size=16384' npm run typecheck` — pass.

`NODE_OPTIONS='--max-old-space-size=16384' npm run build` — pass (`/executive/watch` included).

Browser walkthrough: NOT RUN.
