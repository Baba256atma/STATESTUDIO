# T92 focused reproduction

## Manufacturing signatures

Pre-FIX10: `fnv1a32:bc1af3ff`  
Post-FIX10: `fnv1a32:be0e4dfd`

## Focused signatures

T92 focused baseline (nearest pre-FIX10 window containing T92 WRONG_REFERENT: T89-focused 93-turn prefix): `fnv1a32:abb9bbdc`  
T92 focused repaired (T88–T95, 95-turn prefix): `fnv1a32:6c3ef364` (S0=0, S1=0)

## Minimum history

T88 Switch to inventory. → `obj-inventory`  
T89 The first one. → Inventory + ordered-list clarification (FIX9)  
T90 Return to delivery. → `obj-delivery`  
T91 What about the maintenance crisis? → clarification; canonical remains `obj-delivery`  
T92 What does the production data show?

## Pre-T92 state

| Field | Value |
| --- | --- |
| Canonical subject | `obj-delivery` |
| Canonical referent | `obj-delivery` |
| Stage | `obj-delivery` |
| Pending clarification | T91 maintenance crisis (unknown named problem) |
| Active collection | lastCollection not ordinal-referable after T88 (FIX9) |
| Decision | 1 / `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1` |
| Execution | 1 / `execution-cc10:decision:cc9:scenario:do-nothing:do-nothing:v1` |
| Data Reality | ERP/PRODUCTION/INVENTORY/MAINTENANCE **v4** at tick 21 |

## T92

| Field | Value |
| --- | --- |
| Utterance | What does the production data show? |
| Intent | CC:1 `evidence` (requires context; empty targetHints) |
| Canonical meaning | ASK_EVIDENCE / EVIDENCE; no Capacity Object mention |
| Data phrase | production data |
| Domain qualifier | production |
| Available Objects | Capacity, Inventory, Delivery, Customer, Maintenance, Demand, … |
| Available Data Reality | PRODUCTION v4, ERP v4, INVENTORY v4, MAINTENANCE v4 |
| Available Evidence | Nexora-visible publications including `rdi2:snapshot:rms:…:PRODUCTION:21:import` |
| Source provenance | Operator → CSV/FAST equivalent → Gate/RDI → Data Reality PRODUCTION v4 |
| Candidate kinds | Object (sticky Delivery/Capacity), Data Source (PRODUCTION), Operational Domain (production) |
| Selected conversational referent | `obj-delivery` (unchanged) |
| Selected data/evidence source | PRODUCTION family v4 (Nexora-visible), not Ground Truth |
| Expected semantic class | DATA_EVIDENCE_QUERY |
| Expected conversational referent | unchanged subject (`obj-delivery`) |
| Expected data/evidence source | PRODUCTION Data Reality latest visible version |
| Subject after | `obj-delivery` |
| Referent after | `obj-delivery` |
| Evidence source after | PRODUCTION v4 available; Advisor input subject Delivery |
| Advisor response | Evidence-bounded attention/evidence language; no causal overclaim |
| Stage | preserved `obj-delivery` (no presentation request) |
| First divergence (before repair) | token `production` fuzzy-matched alias part of `production capacity` → Capacity Object |
| Root cause | OBJECT_VS_DATA_KIND_CONFUSION at NCA-POST:1 + 6.1 data-phrase cue-strip |
| Earliest owner | `resolveRegisteredReference` compound-key part match; 6.1 `findObjectMentions` |
| Repair | compound coverage + data-domain qualifier on full utterance + CC:1 evidence |
| Result | T92 PASS; Manufacturing S1 = 0 |
