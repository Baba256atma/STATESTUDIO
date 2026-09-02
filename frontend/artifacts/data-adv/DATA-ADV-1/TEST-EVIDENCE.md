# DATA-ADV:1 Test Evidence

## Focused

`node --import tsx --test app/lib/manager-object/nexoraAdvisorDataInquiry.test.ts`

4/4 passed.

| Test | Covers |
| --- | --- |
| library, field, pending vs committed, and no I-couldn't-find for ORD_QTY | Data Library listing; ORD_QTY exists on pending CSV; no executive not-found copy |
| confirmed vs likely, continuity, multi-source ABC, missing supplier | OTD file locate; ORD_QTY pronouns; capacity contain/objects; Capacity object→data; delivery investigation; supplier gap; ABC ambiguity |
| semantic write uses existing authority; isolation; no Stage/Decision writers | `applyCsvSemanticClarification` via `applyAdvisorDataSemanticClarification`; workspace isolation; shell wiring |
| restore, project fixtures, unknown, and correction stay source-scoped | hydrate without Data Panel; schedule.csv project guidance; I don't know; Ordered Units correction; ORD_QTY not globally merged |

## Combined DATA-UX / CSV / ESI / DATA_OBJECT

`node --import tsx --test` over DATA-UX:3–6, FIX1–FIX5, durability, ESI, DATA_OBJECT, semantic, removal, and DATA-ADV:1.

**117/117** passed.

## Funnel Level 4

`npm run nxa:funnel -- --level 4` — **passed**. Executive omnibus **1370** tests, **fail 0**. Typecheck, PREP ESLint, production build, `git diff --check` (PREP surface), live smoke all passed.
