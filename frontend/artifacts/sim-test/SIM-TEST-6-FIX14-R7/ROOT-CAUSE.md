# NPA-T SIM-TEST:6-FIX14-R7 — Root Cause

## Stop Condition

R7 is certifiable only if all of the following hold:

- The single remaining Level 4 failure (FINAL:6.4 `certifies trusted-communication dialogues`, turns `B1:1`, `G0a:2`, `G1a:2`, `G2a:2`) is reproduced and traced layer by layer, and its first wrong seam is identified before any production change.
- The repair is presentation-only at the existing composition owners, with no new composer, Advisor, verbosity registry, formatter or communication store.
- Explicit Detail/Explain/Evidence/Why depth and epistemic qualification are preserved, with no global truncation.
- Canonical identity, continuity, NCA, Advisor, Stage and clarification remain untouched.
- Focused A–H, the 6.4 suite, the R2–R6 guards, FIX10–14 and CC:10 are green, and the two known SIM-TEST regressions keep their exact pre-R7 values.
- NXA L1–L4 is run in order, and the funnel's stopping point is reported accurately.

## Reproduction (pre-repair, current R6 worktree)

All four failing turns are a bare `Why?` after an Object turn (`Show X.`, or `Show X.` → `Explain it.`).

| Turn | Utterance | Canonical subject | CC:1 | 6.1 op | 6.2 provenance | 6.3 | Advisor referent | 6.4 depth / sentences | Final sentences |
|---|---|---|---|---|---|---|---|---|---|
| B1:1 | Why? (after Show Delivery.) | obj-delivery | explain | CAUSE | CONTEXT_ACTIVE_SUBJECT | proceed | obj-delivery | BRIEF / 2 | 7 |
| G0a:2 | Why? (after Explain it.) | obj-delivery | explain | CAUSE | CONTEXT_ACTIVE_SUBJECT | proceed | obj-delivery | BRIEF / ≤3 | 7+ |
| G1a:2 | Why? (after Explain it.) | obj-capacity | explain | CAUSE | CONTEXT_ACTIVE_SUBJECT | proceed | obj-capacity | BRIEF / 3 (one verbatim duplicate) | 8 |
| G2a:2 | Why? (after Explain it.) | obj-risk | explain | CAUSE | CONTEXT_ACTIVE_SUBJECT | proceed | obj-risk | BRIEF / 3 | 7 |

- Expected: a brief causal answer about the active Object, at most 6 sentences, keeping its "not a confirmed cause" qualification.
- Actual: the correct 6.4 answer, followed by recommendation justification that had never been presented in the conversation. For Risk, that justification was about a different subject (Margin Pressure / Capacity Gap).

Checkpoint trace of the presented response (B1:1):

| Checkpoint | Sentences | Added |
|---|---|---|
| 6.4 `composeTrustedExecutiveCommunication` | 2 | — (correct BRIEF causal answer) |
| NCA seed question | 3 | `Has backlog increased recently?` (existing investigation seed) |
| NCA3–6, Situation, Stage overlays | 3 | — |
| ECA information need | 3 | — |
| **ECA:7 `applyEcaRecommendationToPresentedResponse`** | **5** | `The trade-off is … Labor availability is not confirmed..` |
| NPS:2–4 overlays | 5 | — |
| **NPS:5 `applyNpsComparisonRecommendationToPresentedResponse`** | **7** | `That recommendation stays on Capacity Gap because … Remaining uncertainty: …` |

## Classification

- Upstream semantics (CC:1, 6.1, 6.2, 6.3, Advisor referent, canonical subject): **correct**. Not an upstream semantic, stale-subject or test-expectation error.
- 6.4 depth policy: **correct**. BRIEF was resolved and the 3-sentence cap was applied.
- Failure type: **mode + duplication**. It is presentation only.
  - Mode: two post-6.4 recommendation overlays treat any bare `why?` as "why that recommendation?" and append a recommendation-justification frame to an Object-causal answer, even though no recommendation is in the discourse.
  - Duplication: the two overlays justify the same absent recommendation twice. Separately, the 6.4 answer for G1a repeated one qualification sentence verbatim.

## First wrong seam

`judgeEcaExecutiveRecommendation` (ECA:7) sets `speak` for `isWhy(text)` with no check that a recommendation exists: `recommended` is null, the ECA session is not delivered, and `lastOptionId` is null. `applyNpsComparisonRecommendationToPresentedResponse` (NPS:5) has the same unconditional `asksWhy` for a bare `why?`.

Signals observed before the failing `Why?` versus legitimate recommendation follow-ups:

| Flow | ECA session `delivered` | ECA `lastOptionId` | ECA `lastType` |
|---|---|---|---|
| Show Delivery. → Why? | false | null | NONE |
| … Compare them. → Which one should we choose? → Why? | false | reversible-relief | PREFER_OPTION |
| … Compare the options. → Which one do you recommend? → Why? | true | reversible-relief | PREFER_OPTION |

NCA `lastRecommendation` is not a valid discriminator: it is sticky from catalog defaults ("Investigate Capacity Gap").

## Root cause

A bare `why?` is anaphoric: it asks about the last thing asserted. The recommendation overlays resolved it to "the recommendation" by utterance shape alone, without consulting the recommendation owner (ECA:7) to confirm that a recommendation had been formed or delivered. When the preceding turn was an Object focus or explanation, they appended a justification for a recommendation the manager never saw. That pushed a correct 2–3 sentence BRIEF answer to 7–8 sentences.
