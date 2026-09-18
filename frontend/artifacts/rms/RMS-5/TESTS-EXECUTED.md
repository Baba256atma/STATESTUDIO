# NPA-T RMS:5 — Tests executed

Focused:

`./node_modules/.bin/tsx --test app/lib/rms/rmsFoundation.test.ts app/lib/rms/rmsGroundTruthWorld.test.ts app/lib/rms/rmsOperatorObservable.test.ts app/lib/rms/rmsManagerConversation.test.ts app/lib/rms/rmsObserverIntelligence.test.ts`

**28 pass / 0 fail** (RMS:1–5). Proof 22 is RMS:1–4 remaining green.

ESLint on touched RMS:5 files: 0 errors.

`NODE_OPTIONS='--max-old-space-size=16384' npm run typecheck` — pass.

`NODE_OPTIONS='--max-old-space-size=16384' npm run build` — pass.

Not run: Level 4 funnel, live `/executive` journey, RMS:6.
