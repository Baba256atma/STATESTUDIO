# DATA-UX:3 Test Evidence

Date: 2026-08-31

## Focused

- Final DATA-UX:1/2/3 + RDI + DATA_OBJECT + Data Rail + shell + NCA set: 65/65 passed, 0 failed, 0 skipped.
- DATA-UX:3-specific semantic/dialogue/integration set: 19/19 passed.
- Datasets A–F cover clear, abbreviated, ambiguous, non-Delivery domain, conflict, compatible replacement, rename, datatype drift, unit drift, and cross-source isolation.
- Conversation cases cover yes, explicit confirmation, correction, unknown, deferral, natural definition, field follow-up, file summary, unresolved summary, and ordinary-conversation non-interception.

## Test funnel

| Level | Result |
|---|---|
| 1 Focused infrastructure | passed; 0 failed/skipped |
| 2 Owning layers | passed; 0 failed/skipped |
| 3 Cross-layer | passed; 0 failed/skipped |
| 4 Milestone | 7/7 required tasks passed |

Level 4 details:

- Executive omnibus: 1,365/1,365 passed, 50 suites.
- Director inventory: 58/58 passed, 9 suites.
- TypeScript: passed with the standard 8 GB heap profile.
- ESLint gate: passed; modified-file DATA-UX:3 ESLint also passed.
- Production build: compiled; TypeScript passed; 13/13 static pages generated.
- Live smoke: passed, zero page errors.
- Required-task ledger: no failed, skipped, running, uninspected, not-run, cancelled, or blocked task.
- Full `git diff --check`: passed.

## Classified environmental events

- A default-heap TypeScript run exhausted Node's 4 GB heap. The repository-standard 8 GB command passed; no type failure was hidden.
- Sandboxed `tsx` could not create its IPC socket. The identical approved command outside the sandbox passed.
- Native chooser assignment was initially refused in the generic Chrome profile because file-URL access was disabled. After enabling it in the BAHA profile, the repository fixtures were selected through the supported native chooser and the live semantic proof passed.
