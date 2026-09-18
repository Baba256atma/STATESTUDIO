# NPA-T RMS:10 — Tests executed

Focused:

`./node_modules/.bin/tsx --test app/lib/rms/rmsFoundation.test.ts app/lib/rms/rmsGroundTruthWorld.test.ts app/lib/rms/rmsOperatorObservable.test.ts app/lib/rms/rmsManagerConversation.test.ts app/lib/rms/rmsObserverIntelligence.test.ts app/lib/rms/rmsEventDisturbance.test.ts app/lib/rms/rmsScenarioLibrary.test.ts app/lib/rms/rmsWatchExperience.test.ts app/lib/rms/rmsTakeControl.test.ts app/lib/rms/rmsExperiment.test.ts`

**51 pass / 0 fail** (RMS:1–10).

RMS:10 suites:

- 1–20 EXPERIMENT fork isolation, parent preserved, inherited events
- 21–35 human CC:5, action provenance, replay, switch, conversation isolation
- 36–40 comparison, privacy, no winner, no Outcome/Learning
- 41–50 manufacturing/project/logistics/service, restart, parent, trace, RMS:1–9 boundary

ESLint on RMS:10 surfaces: 0 errors.

`NODE_OPTIONS='--max-old-space-size=16384' npm run typecheck` — pass.

`NODE_OPTIONS='--max-old-space-size=16384' npm run build` — pass (`/executive/watch` included).

Not run: Level 4 funnel, live `/executive/watch` Experiment browser journey.
