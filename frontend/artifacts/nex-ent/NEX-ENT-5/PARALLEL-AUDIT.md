# NEX-ENT:5-PARALLEL-AUDIT — PASS

No competing runtime Guided Attention authority. No runtime files removed or modified. NEX-ENT:6 was not started.

## Authority table

| Responsibility | Canonical owner | Other implementations found | Verdict |
| --- | --- | --- | --- |
| 1. manager UI-guidance meaning | `resolveNexoraUiGuidanceIntent` in `nexoraUiGuidanceIntent.ts` | NCA/canonical intent still runs on locate turns but copy is locked; NCA does not choose the target | One owner |
| 2. semantic target resolution | `NEXORA_GUIDED_ATTENTION_TARGETS` + `requestNexoraGuidedAttention` in DIR:GA | UI guidance maps utterances → those same target ids; not a second registry | One owner |
| 3. guided-attention request | `requestNexoraGuidedAttention` (DIR:GA), invoked only from CC:5 | Tests call it directly | One runtime owner |
| 4. active attention state | DIR:GA `NexoraGuidedAttentionRuntime`; shell holds the current value and writes only from CC:5 `result.guidedAttention` / `applyNexoraGuidedAttentionRuntime` | No second store, reducer, or registry | One owner |
| 5. target presentation binding | Shell maps target → existing control `guidedAttentionCue`; each control owns `data-guided-attention-target` | Cue styles repeated on Data / Stage / Back as consumers, not a second mapper | One binding owner |
| 6. expiry/timer cleanup | DIR:GA `expireNexoraGuidedAttention` / `expiresAtMs`; one shell `setTimeout` keyed by `requestId` | Unrelated HomeScreen/RTC `requestId` timers; ENT stage `presentationCue` is education, not GA | One GA timer |
| 7. reduced-motion presentation | DIR:GA `resolveNexoraGuidedAttentionCue`; shell passes `matchMedia` | No second cue resolver | One owner |
| 8. Advisor response copy | DIR:GA `composeNexoraGuidedAttentionCopy`; CC:5 `lockPresentedResponse` | ENT:5 intro/offer copy teaches; does not compose locate copy | One locate-copy owner |
| 9. ENT:5 education progression | `guidedIntroduction.attentionEducation` via `nexoraAttentionEducationExperience.ts` | Types in `nexoraGuidedEntranceTypes.ts`; session freeze in guided-entrance/catalog | One education session |
| 10. Data target | DIR:GA `DATA_ENTRY` → `NexoraStageDataControl` | Data control also has pre-existing `attention` (DATA-UX “needs attention”); shell sets `attention={false}` for GA | Distinct; not a clone |
| 11. Stage target | DIR:GA `STAGE` → `ExecutiveStageFrame` | ENT `presentationCue` `orient` / `demonstrate-focus` is Stage education, not GA | Distinct |
| 12. Back target | DIR:GA `BACK_CONTROL` → breadcrumb Back when mounted | Unmounted → DIR:GA `UNAVAILABLE` | One owner |
| 13. contextual “Show me” | UI guidance `pendingOfferTarget` on DIR:GA runtime; ENT:5 may set the offer | ENT:4 dropped `"show me"` from conversation NEXT so it cannot steal | One offer owner |
| 14. “Show me the problems” | Canonical/NCA collection; UI guidance returns `NONE`; ENT:4/5 own-classifiers return null | Not routed to DIR:GA | One collection path |

## Duplicate / nearby symbols (not competing GA)

| Item | Classification |
| --- | --- |
| `NEXORA_GUIDED_ATTENTION_RESERVED` (`implemented: false`) | Active ENT boundary sentinel: ENT must not own reusable GA. Not a second DIR:GA. |
| DRI / MO6 / cognitive / SVIE “attention” modules | Pre-existing executive attention/priority/focus. Different product concept. |
| Data control `attention` prop | Pre-existing DATA-UX badge, not DIR:GA. |
| ENT `NexoraStagePresentationCue` | Stage education cues. |
| Stale live PNGs (`06-replacement.png`, `07-focus-and-show.png`, `09-contextual-show-me.png`, extra skip/refresh/reduced-motion names) | Artifact-only leftovers from interrupted live-script numbering. Not imported. |
| Single live script `scripts/nex-ent5-guided-attention-certify.mjs` | One cert script. |
| Cue `boxShadow`/`outline` copied on three bound controls | Presentation consumers of DIR:GA cue tokens, not a second authority. Left in place (no redesign). |

## Runtime changes

None.

## Tests (this audit)

| Pack | Result |
| --- | --- |
| Focused ENT:5 + DIR:GA + UI guidance + guided entrance | 50/50 |
| DIR:GA (in pack) | 9/9 |
| UI-guidance intent (in pack) | 8/8 |
| NEX-ENT:5 education (in pack) | 16/16 |
| nexora-entrance | 199/199 |
| conversational-control | 336/336 |
| NCA/NXA | 343/343 |
| Decision Theatre | 172/172 |
| Funnel L1–L4 | pass (L4 7/7); omnibus 1446/1446 |
| TypeScript / production build | pass (L4) |

NEX-ENT:5 remains certified. NEX-ENT:6 was not started.
