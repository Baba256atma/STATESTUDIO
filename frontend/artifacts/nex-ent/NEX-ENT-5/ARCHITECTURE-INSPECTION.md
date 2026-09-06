# NEX-ENT:5 architecture inspection

## Answers before coding

1. **Who may request attention?** Conversation (CC:5) after `resolveNexoraUiGuidanceIntent` returns `LOCATE_UI`. Advisor copy is composed from DIR:GA; Advisor does not query the DOM.
2. **Who resolves the semantic target?** `nexoraUiGuidanceIntent` maps how-to/where language to `DATA_ENTRY` | `BACK_CONTROL` | `STAGE`. Collection “Show me the problems” is `NONE`.
3. **Who owns visual presentation?** `DIR:GA/NexoraGuidedAttentionPresentation`. Shell/Stage/Data/Back bind semantic targets via `data-guided-attention-target`.
4. **Existing primitives reused?** Calm accent halo (`SOFT_HALO`) and static outline (`EMPHASIS`). Not DTH risk/priority halo, not Stage focus, not selection.
5. **Target IDs without brittle selectors?** Semantic attributes on the Data control, Stage frame, and Back control. Conversation never sees CSS.
6. **Expiry?** `NEXORA_GUIDED_ATTENTION_DURATION_MS` = 3000. Deterministic `expiresAtMs`. Shell timer is presentation-owned and replaced on a new `requestId`.
7. **Missing target?** `UNAVAILABLE`, `cue: null`, manager-readable “isn’t available”. No false highlight.
8. **Off-screen?** No new scroll engine. Cue is applied if the target is mounted; Back is often unmounted at entrance.
9. **Reduced motion?** `EMPHASIS` instead of `SOFT_HALO`. Meaning stays in Advisor copy.
10. **Reusable outside NEX-ENT?** DIR:GA `requiresNexEnt: false`. CC:5 applies locate intent even on `existing-workspace`. ENT:5 only teaches it.

## Authorities inspected

NEX-ENT:1–4 session overlays, CC:5, NCA meaning, `NexoraStageDataControl`, `ExecutiveStageFrame`, breadcrumb Back, NEX-MVP focus/selection, DTH atmosphere/scene intent (not reused for attention), reduced-motion tokens, Data Rail open state (`data-data-rail-open`).
