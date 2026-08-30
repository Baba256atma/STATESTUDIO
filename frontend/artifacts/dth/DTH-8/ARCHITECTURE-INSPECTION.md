# DTH:8 — Decision Commitment Experience

## Smallest extension point

Project `DecisionCommitment` from Theatre after DTH:1–7. Review is presentation. Commitment writes only through CC:10 / CC:10R.

Canonical flow:

DTH:7 comparison → select candidate for review → Decision review (REVIEWING) → explicit Approve (CC:10) → one CC:10R Decision (COMMITTED) → Execution remains a separate CC:11 action.

Click, focus, DTH:6 investigation, DTH:7 comparison, and recommendation display do not commit.

## Reused authorities

| Concern | Authority |
|---|---|
| Comparison membership | DTH:7 / NCA-POST:4 |
| Candidate investigation | DTH:6 |
| Scene meaning | DTH:5 Scene Intent / Scene Script |
| Click / focus | NEX-MVP:4 |
| Decision commit | CC:10 resolver + CC:10R `transitionDecision` |
| Execution | CC:11 (DTH:8 keeps `PROCEED_TO_EXECUTION` unavailable) |
| Advisor | Existing CC/MO/NCA path; DTH:8 overlays review questions |
| Catalog scenario identity on `/executive` | Existing NEX-MVP context subjects, resolved as CC:10 conversation candidates when no CC:9 session exists |

## Capability

Supported: `decision-commitment`.

Reserved list remains length 7. DTH:8 does not implement NexoCompare, a second Decision store, or Execution start.

DTH:9 is not started.
