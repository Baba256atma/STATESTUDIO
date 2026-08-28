# Test Funnel

Level 1 Focused — `npm run nxa:funnel -- --level 1`  
Level 2 Layer — `--level 2`  
Level 3 Integration — `--level 3`  
Level 4 Milestone — `--level 4` (omnibus, DIR inventory, typecheck, ESLint, git diff --check, production build, live smoke)

Rules: iterate on 1–3. Run 4 once for certification. Stop at the first failing level. No skips.
