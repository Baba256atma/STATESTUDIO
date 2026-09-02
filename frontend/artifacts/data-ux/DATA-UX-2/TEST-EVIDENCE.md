# DATA-UX:2 Test Evidence

Date: 2026-08-30

## Final focused evidence

- DATA-UX/RDI/DTH/Shell focused command: 43 passed, 0 failed, 0 skipped.
- Includes stable immutable DATA_OBJECT projection, workspace/source mismatch refusal, manager-facing Rail projection, same-source update identity, full CSV vertical slice, and canonical shell rendering.
- TypeScript `tsc --noEmit`: passed.
- ESLint over every DATA-UX:1/2 changed TypeScript/TSX file: passed with no output.
- Full `git diff --check`: passed.

## Test Funnel

| Level | Scope | Result |
|---|---|---|
| 1 | Focused certification infrastructure | 19/19 passed |
| 2 | Owning layers | 422/422 passed |
| 3 | Cross-layer integration | 46/46 passed |
| 4 | Milestone required tasks | 7/7 passed |

Level 4 details:

- Executive omnibus: 1,358/1,358 passed, 50 suites.
- Director inventory: 58/58 passed, 9 suites.
- TypeScript: passed.
- ESLint gate: passed.
- Diff check: passed.
- Production build: compiled successfully; 13/13 static pages generated.
- Live `/executive` smoke: passed, zero page errors, no errors array entries.
- Ledger: zero failed, skipped, running, uninspected, not-run, cancelled, or blocked required tasks.

## Regressions found and resolved

1. The initial focused implementation changed two certified UI contract strings. The existing labels were restored; the focused set then passed.
2. The first no-CSV live repair referenced a nonexistent `committedSources` variable. The browser produced a direct ReferenceError at the first divergent component. It was changed to the canonical `imports` collection, reloaded, and re-proven live before tests resumed.
3. The final contract review found that canonical replacement existed but was not discoverable from a committed source. A safe `Update source` action was added, reusing replace mode and refusing a differently named file. All gates were rerun afterward.

Two sandboxed `tsx` launches failed before test execution because IPC socket creation returned `EPERM`. The identical command ran outside the sandbox and passed. These were environmental launcher failures, not test failures.

The build emitted a non-blocking stale `baseline-browser-mapping` data notice. It did not affect compilation, static generation, runtime smoke, or application behavior.

