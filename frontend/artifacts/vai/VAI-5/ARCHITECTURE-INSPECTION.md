# NPA-T VAI:5 — Architecture Inspection

Inspection date: 2026-09-16.

Stop condition: Theatre Variable Symbol language only. Do not start VAI:6.

## Smallest integration

VAI:5 is a read-only presentation overlay. It consumes a legitimate `VaiAdvisorBundle` (VAI:1–3) and projects `VARIABLE_SYMBOL` tokens that are classified by the existing DTH visual-family discriminator. It does not write Stage objects, Director plans, or a second graph/scene authority.

## Reused authorities

| Concern | Owner | VAI:5 |
| --- | --- | --- |
| Variables | VAI:1 | Consume identity/semantics |
| Contextual roles | VAI:2 | Attachment and role/ambiguity |
| Evidence / causal visual gate | VAI:3 | Connector type only |
| Advisor explanation | VAI:4 / CC:5 | Inspection handoff |
| Theatre families / Stage entity roles | DTH:2 / NEX-STAGE-CARD:1 | `VARIABLE_SYMBOL` / `ANALYTICAL_SYMBOL` |
| Executive Objects, focus, 2D Stage | NEX-MVP:3/4, DIR:1, DTH:1 | Unchanged |

## Not introduced

Second Stage, Theatre, Director, Object renderer, Variable store, causal network scene, Impact Analysis scene, intervention prediction.
