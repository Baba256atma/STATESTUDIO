# Nexora — Release Gate Prompts (copy-ready for Cursor)

Paste one prompt per review. Attach `@` files the playbook names (e.g. `HomeScreen.tsx`, `RightPanelHost.tsx`, `rightPanelRouter.ts`, contract/adapters as relevant). **Do not** ask for refactors unless the patch already violates architecture.

---

## 1. Stability gate review

This patch touches Nexora panel/scene/CTA paths. Review it against `.cursor/stability-checklist.md` and `.cursor/patterns.md`. List any risk to: panel staying open, flicker, scene overwrite, or duplicate state paths. Recommend only **minimal** follow-ups. No architecture refactor.

---

## 2. Demo-readiness review

Assume this change ships before a stakeholder demo. Check it against `.cursor/demo-readiness-checklist.md`. Call out any demo-breaking failure modes (empty panel, panel disappearance, scene reset, confusing objects). If safe, say “demo-ready for touched flows” and what to smoke-test in 2 minutes.

---

## 3. Contract safety review

Trace backend → canonical → adapter → panel for the changed flow using `.cursor/contract-safety-checklist.md`. Flag Zod/schema risk, silent field drops, or ambiguous fallbacks. Confirm no parallel panel data path was introduced.

---

## 4. Scene safety review

Focus on reaction pipeline and scene updates. Use `.cursor/anti-patterns.md` (no full `scene_json` overwrite without force). Verify highlight/dim continuity and that mutations match policy. Propose **minimal** guard or trace additions only if a regression is likely.

---

## 5. Panel continuity review

Verify Intent → Router → Resolver → **RightPanelHost** for the changed behavior. Check for post-success invalidation, wrong view resolution, or empty resolver output. Cite the exact files/lines that could cause panel flash or disappearance. Minimal fix suggestions only.

---

## 6. CTA execution review

For CTAs touched by this patch (simulate, compare, explain, etc.), confirm: correct intent, router target view, and renderable panel data. Cross-check `.cursor/debug.md` trace expectations. List the **shortest** manual test sequence to validate.

---

## 7. Regression risk review

Classify this patch: low/medium/high regression risk for Nexora. Consider panel routing, contracts, and scene reactions. Suggest a **minimal** regression check list (3–5 bullets) tied to files changed. No scope expansion.
