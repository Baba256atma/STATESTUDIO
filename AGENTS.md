# Nexora debugging and certification

Inspect and reuse the existing authority before adding code. One authority per concept. No parallel store, runtime, presenter, pipeline, or truth. Advisor and conversation consume authoritative state; they do not own Stage, collection, journey, Goal, Decision, Execution, Outcome, Learning, evidence, or memory. No Object-specific production repair when a generic contract owns the behavior. No timers or refresh races as fixes. No silent fallback that changes semantic mode. No broad refactor unless the root cause requires it.

Reproduce before fixing. Identify the first divergent layer. Record expected versus actual. Classify non-reproduced and environmental failures honestly. Do not infer causality from adjacency. Do not claim root cause without evidence. Do not turn a diagnosis into a Fix.

Use the Test Funnel: focused, then owning layer, then integration, then full milestone certification. Do not run Level 4 after every small edit. No skipped, removed, weakened, or falsely passing tests. No progression with a known failure. Preserve the Zero-Failure rule.

Define a measurable Stop Condition before implementation. Review the final diff. Verify only intended files changed. Wait for every required background task, inspect every required result, and do not declare CERTIFIED while a required task is running, unresolved, unobserved, cancelled, or waiting for approval. Report nonessential processes separately. Do not terminate processes this task did not start. Stop when the requested outcome and gates are complete. Do not begin the next named phase automatically.

Details: `frontend/artifacts/nxa6-prep/`. Funnel: `npm run nxa:funnel -- --level 1`.
