# NPA-T SIM-TEST:10 — Outcome & Management Learning Simulation

Certification-only. No production Outcome/Learning engine was added. FIX1 was not started.

Baselines preserved: EI:1–6, CORE-OUT, CC:10/11, NMI, RMS, SIM-TEST:6–9 (including :9 FIX1/FIX2/R3).

## A. Status

**SIM-TEST:10 = NOT CERTIFIED**

Gate G1 fails: post-execution observable evidence is **not** consumed as Outcome on the manager conversation path. CORE-OUT:1A captures = 0. NPS never left TOO_EARLY/UNKNOWN as an established Outcome. Rule 70 applies: Outcome evidence = 0 ⇒ not certified.

This is a **capability gap** at the CC:5 ↔ MVP-OUT:1 / CORE-OUT:1A seam, not a missing CORE-OUT product and not permission to invent Outcomes in the test.

## B. Existing architecture

See FINDINGS.md. Summary:

- **Outcome evaluation:** CORE-OUT:1
- **Outcome observation/linkage:** CORE-OUT:1A (session store)
- **Learning:** CORE-OUT:2 (grounded); NPS:8 / ECA:12 project, do not write
- **Execution→Outcome:** CORE-OUT:1A windows/links; MVP-OUT:1 registers capture on live-journal publish
- **Evidence:** Data Reality / RDI (source of observations); KPI ≠ Outcome identity
- **Reassessment:** NPS:8 + ECA:12 + existing SIM-TEST:8-FIX1 semantics
- **Conversation:** ECA:11/12 + NPS:8 read CORE-OUT captures; CC:5 lists captures but does not register MVP-OUT:1 context
- **EI:6:** not the live Outcome writer

Capability gaps listed in **S**.

## C. Population

| Measure | Count |
| --- | ---: |
| Journeys | 33 |
| A–N families | 14 |
| RMS scenarios | 4 |
| Profiles | 12 (10 SIM-TEST:7 + SIM-TEST:5 DATA_DRIVEN / STANDARD) |
| Seeds | 11, 29, 47 |
| Manager / Nexora turns | 356 / 356 |
| Adaptive event traces | 39 |
| Operator publications | 68 |
| Unpublished world advances | 28 |
| Unpublished Outcome/Learning asks | 13 |
| Post-publication ASK_OUTCOME | 50 |
| Long sessions | 6 |
| Harness failures | 0 |

## D. Lifecycle multiplicity (observed)

| Object | Distinct | Max coexisting |
| --- | ---: | ---: |
| Problems | Capacity, Delivery, Revenue, Inventory (switching) | switching |
| Scenario sets | exercised via Options. on Capacity/Delivery | ≥2 on H/G/B |
| Decisions | 3 IDs over the run | **2** |
| Executions | 2 IDs | **2** |
| Outcomes (CORE-OUT:1A / NPS established) | **0** | **0** |
| Learning records (durable) | **0** | NPS learningStatus NONE |

G4 (two Execution chains) was exercised. G4 Outcome identities were **not**.

## E. Outcome evidence

- Executions receiving **world/Data Reality** change after start: yes (ADVANCE_WORLD + PUBLISH)
- Executions receiving **CORE-OUT captured** evidence: **0**
- Outcomes created/updated: **0**
- Wrong Outcome bindings: not applicable (no Outcome objects)
- Provenance: publications exist; they are not linked as Outcome observations
- Knowledge state: TOO_EARLY / UNKNOWN throughout ASK_OUTCOME, including after publication

## F. Temporal integrity

| Check | Result |
| --- | --- |
| Unpublished asks | 13 |
| Premature Outcome success (product) | 0 |
| Stale success after publication | 0 (never claimed success) |
| Current Data Reality used as Outcome | **no** — Outcome layer empty |
| Ground Truth leak hits | **0** |

G2 (no hidden outcome known early) **passes** as uncertainty. G1 still fails.

## G. Expected vs observed

NPS `expectedOutcome` / `observedOutcome` numeric: **null** on this path. Historical Scenario/Decision expectations were not rewritten because they were never bound into CORE-OUT comparison. G5 **not proven** (coverage/capability), not a measured rewrite.

## H. Trade-offs

Mixed/negative Outcome objects: **not produced**. Manager asked cost/margin questions; answers stayed evidence-bounded / too early. Trade-off **fidelity of an Outcome assessment** was not exercised.

## I. Attribution / causation

Family F: “Did the Capacity decision cause the delivery change?” → explicit **does not prove** / association vs causation. Product: acceptable uncertainty.

Test detector flagged 1 row because the word “caused” appears in the denial. Disposition: **test-expectation error**.

Competing Executions (G): two Executions present; no isolated attribution of Delivery improvement to the last-discussed Execution as a success claim.

## J. Learning

- Evidence-grounded Learning objects: **0**
- Durable Learning: **0**
- “What did we learn?” stayed insufficient-evidence (same as SIM-TEST:5)
- Over-generalization “overtime always improves delivery”: not converted into durable rule
- Assumption vs observed numeric delta: **not available** without captured observations

## K. Management reassessment

- Problem/Risk reassessment utterances ran (family J). Invented `Is This Still A` not used as a write.
- Loop re-entry (L): after too-early Outcome, `Options.` / `Go with A.` produced a **second Decision** while Execution count stayed 1 — cycle 2 can start; O1 never existed to preserve
- Boundary: loop continues **without** Outcome/Learning objects

## L. Multi-thread

H/G/B/I: D1→E1 and D2→E2 coexisted (max 2). Cross-thread Outcome contamination: **none** (no Outcomes). Historical Outcome return asked; Nexora remained too-early / clarification (`Do you mean Capacity?` on family E last turn).

## M. NMI / Stage / Advisor

Raw STAGE_DIVERGENCE 1, SUBJECT_LOSS 1. Known SIM-TEST:9 debts not repaired. No new Outcome hierarchy.

## N. Raw vs product

Raw: S1 125, S3 1.

Product: **S1 0**. **S2** none as a wrong Outcome bind. **Capability gap** is the certification blocker, not an Observer S1.

Observer DUPLICATE_* / IDENTITY_DRIFT: second legitimate Decision/Execution. Expected uncertainty: ASK_OUTCOME. F causal regex: test error.

## O. Replays

5 material journeys, **5/5 matched** (`bdb530be`, `beaae6f2`, `370f8c3b`, `82f00668`, `1e8eb5bd`).

## P. Regression

FIX1 + FIX2 + SIM-TEST:8-FIX1 + NPS:8 unit + ECA:11 unit: **135 pass / 0 fail**.

Level 4: not run. Full SIM-TEST:9 160: not rerun. MVP-OUT:1 integration suite: not rerun (those tests **do** capture when they call the coordinator directly).

## Q. Production integrity

Production changes during SIM-TEST:10: **0**

Digest `87af1d96252cb83b3dd6c377df0c24b8add93806b915f84adeb8ce3046545bf8`.

## R. Architecture integrity

No second Outcome/Learning/Decision/Execution/Data Reality/RMS/NMI/Stage/Advisor authority. Observational `sourceSubjectId` / capture **counts** are harness reads of CORE-OUT:1A.

## S. Capability gaps

1. **CC:5 does not register MVP-OUT:1 post-decision capture**, so Operator→Data Reality updates never become CORE-OUT:1A observations in RMS conversation.
2. **Expected Outcome binding** (MVP-OUT:1-R2) is not applied at CC:10 commit in this path.
3. **Canonical Outcome IDs** are not created on this path (NPS explicitly `writesOutcome: false`).
4. **CORE-OUT:2 Learning promotion** is not reached.
5. **Execution completion vs in-progress:** executions remain `in-progress`; NPS still too-early even if capture existed, until observations exist.
6. Trade-off / mixed Outcome **assessments**, Outcome revision over ticks, and O1≠O2 identity: **not provable** until (1) exists.
7. SIM-TEST:9 remaining debts (B T5, Advisor Delivery/Capacity, NPS S3, NCA ordinals) unrepaired, out of scope.

Simulation cannot prove Outcome management by stubbing CORE-OUT.

## T. Next action

Do **not** implement a repair in this phase.

Smallest evidence-supported product phase (name only):

**Wire existing MVP-OUT:1 / CORE-OUT:1A capture into the CC:5 conversation path after Decision/Execution, on legitimate Data Reality publication — no new Outcome engine.**

Owner: MVP-OUT:1 coordinator (already certified in EXI tests) consumed by CC:5; CORE-OUT:1A remains the capture writer; NPS:8/ECA:11 remain readers.

That is a product capability phase, not SIM-TEST:10-FIX1 for a wrong Outcome bind (none was observed).

Do not start that phase from this task.

---

NPA-T SIM-TEST:10 — NOT CERTIFIED
