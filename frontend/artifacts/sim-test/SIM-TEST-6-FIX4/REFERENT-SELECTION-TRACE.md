# T71 referent selection trace

Manager utterance: `The delivery issue.`

1. **Normalization** — CORRECT. Bare NP preserved; not stripped to locative `the issue`.
2. **CC:1 intent** — DIVERGES_HERE (pre-repair): `unknown` because `matchFocusOrOpen` requires work-on/focus/look-at/go-to/show/open. Post-repair: `focus`, hint `delivery`. CORRECT.
3. **Canonical meaning (6.1)** — DOWNSTREAM. Can mention Delivery even when CC:1 is unknown; does not own navigation.
4. **Conversation continuity (6.2)** — DOWNSTREAM. Without `focus`, named Delivery does not become current referent; Capacity remains active subject.
5. **Candidate construction** — DIVERGES_HERE (pre-repair): no Delivery focus candidate from intent. Capacity remains the only actionable current subject.
6. **Candidate filtering** — CORRECT given the set: no fabricated Supplier from T69.
7. **Candidate precedence** — not the owner. Do not patch numeric weights.
8. **Selected referent** — pre: `obj-capacity`. post: `obj-delivery`.
9. **Canonical context** — post: conversation, Advisor, Stage at T71 all `obj-delivery`.
10. **CC:5** — DOWNSTREAM. Executes focus when CC:1 kind is `focus`. Remap of `unknown` only when `isExplicitPresentationRequest` — T71 is not a show/focus verb, so CC:5 must not be the repair seam.
11. **Advisor/Stage** — DOWNSTREAM. Pre-repair Advisor already showed Delivery while canonical subject stayed Capacity (Observer WRONG_REFERENT). After repair they agree.

T69: `Go back to the supplier problem.` remains `unknown`/named-return at 6.2, not stolen as bare issue focus (`go` prefix excluded). clarificationRequired=true, subject stays Capacity. CORRECT (FIX3 preserved).
