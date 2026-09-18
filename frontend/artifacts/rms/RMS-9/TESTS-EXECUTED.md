# NPA-T RMS:9 — Tests executed

Focused:

`./node_modules/.bin/tsx --test app/lib/rms/rmsFoundation.test.ts app/lib/rms/rmsGroundTruthWorld.test.ts app/lib/rms/rmsOperatorObservable.test.ts app/lib/rms/rmsManagerConversation.test.ts app/lib/rms/rmsObserverIntelligence.test.ts app/lib/rms/rmsEventDisturbance.test.ts app/lib/rms/rmsScenarioLibrary.test.ts app/lib/rms/rmsWatchExperience.test.ts app/lib/rms/rmsTakeControl.test.ts`

**47 pass / 0 fail** (RMS:1–9).

RMS:9 suites:

- 1–12 TAKE_CONTROL lifecycle, same run, CC:5/Stage/Data continuity
- 13–23 labels, freeze, stale turns, in-flight, idempotency, human CC:5
- 24–35 deictic/topic, mutation/decision bounds, privacy, observer, clock, operator
- 36–44 journeys, parity, switch, restart, restore, fork boundary

ESLint on RMS:9 surfaces: 0 errors.

`NODE_OPTIONS='--max-old-space-size=16384' npm run typecheck` — pass.

`NODE_OPTIONS='--max-old-space-size=16384' npm run build` — pass (`/executive/watch` included).

Not run: Level 4 funnel, live `/executive/watch` browser Take Control journey.
