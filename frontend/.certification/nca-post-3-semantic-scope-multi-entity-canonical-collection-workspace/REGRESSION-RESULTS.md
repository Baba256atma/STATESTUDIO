# Regression results

- NCA-POST:3 tests: 15/15 pass
- NCA:1–7 + NCA-POST:1 + NCA-POST:2 + CC command: 223 pass, 0 fail
- CC intent: 24 pass, 0 fail
- No NCA:8 created
- NCA-POST:1 recovery / failed-turn continuity / initiative discipline retained
- NCA-POST:2 assertions, pending-question precedence, collection query retained
- Unfiltered `show problems` no longer inherits conversational subject as related-to
- HELP_TEACH reuses existing NCA:1/NEX-EXP teach copy (no second tutorial engine)
- Lint: 0 errors (existing unused-var warnings in NCA:2 only)
- Typecheck: pass with `NODE_OPTIONS=--max-old-space-size=16384`
- Build: `next build` pass
