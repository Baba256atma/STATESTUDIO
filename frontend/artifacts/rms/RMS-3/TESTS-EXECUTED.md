# NPA-T RMS:3 — Tests executed

Focused:

`./node_modules/.bin/tsx --test app/lib/rms/rmsOperatorObservable.test.ts app/lib/rms/rmsGroundTruthWorld.test.ts app/lib/rms/rmsFoundation.test.ts`

**17 pass / 0 fail** (RMS:1 6 + RMS:2 7 + RMS:3 4). Proofs 1–17 in the RMS:3 suite. Proof 18 is RMS:1/2 remaining green.

ESLint on touched RMS files: 0 errors.

`NODE_OPTIONS='--max-old-space-size=16384' npm run typecheck` — pass.

`NODE_OPTIONS='--max-old-space-size=16384' npm run build` — pass.

Not run: Level 4 funnel, live `/executive` journey, RMS:4.
