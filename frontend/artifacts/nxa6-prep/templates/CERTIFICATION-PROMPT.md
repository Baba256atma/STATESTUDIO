# Certification prompt template

Scope: [named milestone only]
Required journeys/cases: [harness IDs / live proofs]
Gates: Funnel Level 4 using existing repo commands (omnibus, TypeScript, build, static generation, ESLint, git diff --check, live smoke)
Artifacts: `frontend/artifacts/<milestone>/` and `frontend/.certification/<milestone>/`
Background-task barrier: all required tasks finished, collected, inspected; no approval pending
Verdict: CERTIFIED only if every required gate passed with zero skips; otherwise BLOCKED
Stop Condition: verdict written, required ledger clear, next named phase not started.
