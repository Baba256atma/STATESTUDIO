# NPA-T ECA:4-POST1 — Architecture Inspection

Date: 2026-09-08

## Stop condition

POST-ECA integration fix only. ECA:4 is not reopened or redesigned. The manager-facing Advisor answer must consume the certified ECA:4 information-need judgment when the manager asks what is required to resolve the active uncertainty. No second information-need engine. ECA:13 is not started.

## 1. Exact reproduction

Manager: `what is on stage now ?`  
Nexora: Stage focused on Risk; visibility is not a causal conclusion.

Manager: `Explain this.`  
Nexora: Risk is associated with Margin Pressure; association ≠ direction; no measured outcome.

Manager: `you say: Nexora does not yet have enough evidence to determine this. what do you need for determine it ?`  
Nexora (defect): `Nexora is the executive decision workspace: it keeps business objects, collections, and conversation on one shared truth.`

## 2. Actual route selected (before fix)

1. NCA-POST:3 `classifyNexoraSemanticScope` treated any `productCue` (`nexora|advisor|stage|…`) as `NEXORA_PRODUCT` unless the utterance also contained `late|demand|margin|capacity gap`.
2. The failing turn **quotes “Nexora”** and uses pronoun **it**, so it matched `nexora` and did **not** match `margin`.
3. `resolvePrimaryResponseOwner` mapped `NEXORA_PRODUCT` → `PRODUCT_KNOWLEDGE`.
4. `composeProductKnowledgeReply` returned the identity sentence because `/\bnexora\b/` matched.
5. `conversationalExperienceOrchestrator` replaced the business/Advisor response whenever `semanticTurn.reply` existed and `owner !== "BUSINESS"`.
6. ECA:4 overlay (`applyEcaInformationNeedToPresentedResponse`) only spoke on `shouldAsk && question`, why-follow-up, unknown, or skip. It did **not** own “what do you need to determine it”, and it **appended** rather than suppressing identity text.

## 3. Expected route

ECA:1 preserves Risk as the active subject; the explain turn records Margin Pressure as the associated counterpart.  
ECA:2 remains UNDERSTAND / INSPECT-class intent; it does not become execution readiness or reassessment.  
ECA:4 judges the active information gap (timing/context evidence for the Risk–Margin relationship).  
Advisor composition answers from that judgment. NCA-POST:3 product-knowledge is below this path.

## 4. Active ECA:1 subject

Risk (`obj-risk`), from Stage focus plus the explain thread. Pronoun **it** must not resolve to Nexora, Stage, or a generic workspace identity.

## 5. Active ECA:4 information need

Primary need: relationship evidence connecting Risk and Margin Pressure.  
Availability: `MISSING` or `PARTIAL` (never invent `risk_probability` / `causal_score`).  
Necessity: `IMPORTANT` (not a dump of optional fields).  
Best source: `EXISTING_DATA` first, then manager/owner.  
Acquisition: `REQUEST_EVIDENCE` without interrogating by default on this meta-question (`shouldAsk: false`).

## 6. Active ECA:6 objective/thread

Continue the investigation/understand thread for the Risk–Margin uncertainty. Do not create a second objective store. Side questions (CAP_AV) must not drop the need.

## 7. Final composer branch selected (defect)

`PRODUCT_KNOWLEDGE` / `composeProductKnowledgeReply` identity string.

## 8. Why generic Nexora fallback won

Quoted speaker name **Nexora** is a product cue in NCA-POST:3. That cue outranked the speech act “what information is required to determine the active uncertainty.” ECA:4 had no Advisor consumption path for that speech act.

## 9. Canonical component that should own the response

Certified `judgeEcaExecutiveInformationNeed` (ECA:4) via existing orchestrator overlay `applyEcaInformationNeedToPresentedResponse`. NCA-POST:3 must classify the speech act as `BUSINESS` so product identity cannot replace it.

## 10. Smallest safe fix

1. Speech-act helper `isEcaInformationRequirementRequest` in ECA:4 (not a phrase-table architecture; ordinary “we need to…”, ECA:9 “before starting”, ECA:12 “reassess” are excluded).
2. NCA-POST:3: that speech act → `BUSINESS` even if “Nexora” is quoted.
3. Orchestrator: do not install `PRODUCT_KNOWLEDGE` reply when the speech act is active; pass the primary associated counterpart from the explain relationship into ECA:4 `known`/`session`.
4. Overlay: when the speech act is active, **replace** identity/help/product fallback with the ECA:4 manager-facing explanation. Re-apply after later ECA overlays so recommendation/intake cannot resurrect the wrong answer.
5. Reuse ECA:4 collect/judge for remaining gap after partial answers and “I don’t know”. No new engine or store.

## 11. Authorities explicitly NOT changed

ECA:4 judgment identity and certified collectors for cost/target/outcome/execution prerequisite/CAP_AV semantics (except skipping CAP_AV hijack of a Risk information-requirement turn).  
ECA:5 intake engine. ECA:6 strategy. ECA:9 readiness. ECA:12 reassessment.  
NCA:1–7. CONV:1–2. Stage/Director writers. Risk/Evidence/Data writers. No Mini Nexora, RAG, employee messaging, or ECA:13.
