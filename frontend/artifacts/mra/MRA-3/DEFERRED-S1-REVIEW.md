# MRA:3 — Deferred S1 Review

Date: 2026-09-09

MRA:2 deferred **MRA-1-002**, **MRA-1-008**, and **MRA-1-012 remainder**. MRA:3 exercised each on purpose. None were hidden or severity-downgraded.

Classification requested: **A** materially blocks a real manager journey · **B** bounded but acceptable for MVP · **C** architectural repair required before Manager-Ready certification.

---

## MRA-1-002 — Explicit Approve vs ECA:8 challenge

**Reproduced:** DEF-002, J6, live `Approve Demand Surge`.

- Compare: “I don’t have enough comparable evidence to rank them.”
- Approve: `decisionStatus=applied`, ECA:8 `EXPLICIT_COMMITMENT`, `challenge=NONE`, `confirmationRequired=false`.
- Spoken: “Demand Surge is now the Approved decision.”
- Canonical: `canonicalApprovedDecisions=1` (isolated and live). Stage thread Decision count remained `0`.

**A/B/C:** Not **A** (the manager can finish a Decision). **C** before Manager-Ready: unchallenged explicit Approve after an insufficient-evidence compare is a Decision-safety architecture conflict (CC:10 confirmation-not-required vs ECA:8). Treating it as **B** for MVP would be a silent downgrade of an S1.

---

## MRA-1-008 — `investigate it` after knowledge mention

**Reproduced:** DEF-008, LONG-50 after `now tell me about Demand Surge`.

- Focus stays Capacity Gap; `shouldCommitRuntime=false` on the Demand Surge explain.
- `investigate it` → “Which item do you mean?” (DEF-008) or Problem compare as “goal items” (LONG).

**A/B/C:** **A** for any natural pronoun investigation after discussing a non-focused object. Also **C** (CC:1/2 + MO:1 vs knowledge-no-commit). Not acceptable as B: managers will say “investigate it.”

---

## MRA-1-012 remainder — KPI / Evidence / Outcome / Data Object collections

**Reproduced:** DEF-012, LONG collection asks.

| Utterance | Result |
| --- | --- |
| `show me goals` | “I don't see any Goals in the current context.” Catalog-true empty. |
| `show me KPIs` | Isolated: numeric CSV summaries (Data path), not KPI collection. Live not separately asserted. |
| `show me evidence` | Isolated DEF: empty Evidence. LONG after Execution: “current kpi items” mis-kind. |
| `show me outcomes` | “Do you mean the Capacity Gap problem or the Close Capacity Gap?” |
| `show me data objects` | Same Goal/Problem clarification. |

**A/B/C:** Goals empty is **B** (honest empty). Remainder is **C** (NCA-POST:3 kind coverage vs catalog). Not **A** for the core Problem→Decision path; **A** if the manager’s job is KPI/Evidence/Outcome/Data Object inventory.

---

## Related existing class (not a new silent S1)

`INSUFFICIENT_REALITY` in Advisor copy (MRA-3-007) is the MRA-1-009 attention-label family. MRA:2 C4 closed requirement-code leaks on `what should I do?`; this enum still appears on unknown/off-topic turns.
