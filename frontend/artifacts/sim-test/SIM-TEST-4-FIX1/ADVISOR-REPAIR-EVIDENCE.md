# Advisor repair evidence

Manufacturing turn 25 original: Executive/MLEVEL/Stage = Delivery; Advisor = Capacity Gap.

Advisor input: NLU objectReference from typed `the problem`, then NCA:2 `subjectOf` activated Capacity Gap. NXA:1 `explicit ?? active` therefore showed Capacity Gap even though CC:5 kept Delivery.

Repair:

- Continuity: `what is/explain/tell me about the problem|issue` with no other named identity uses CONTEXT_ACTIVE_SUBJECT (Delivery), not last investigation.
- NXA:1: `what is the problem` is current-context deictic, so explicit NLU problem does not outrank NCA:2 active.

Not done: global Advisor wipe each turn. NPS remains problem-solving authority; VAI unchanged.

Repaired checkpoint: Advisor referentId = obj-delivery.
