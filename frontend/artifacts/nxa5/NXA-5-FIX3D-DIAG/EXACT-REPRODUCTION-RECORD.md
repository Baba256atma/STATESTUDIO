<!-- diagnosis artifact -->
# Exact reproduction record — NXA:5-FIX3D-DIAG

## Utterance

Manager: `Continue reviewing Customer`

## Required pre-turn state

- Active/focused object: `obj-customer` / Customer
- Active collection: none
- Previous Advisor turn: focus Customer (or Stage click)
- Dialogue/journey: `CONTINUE_TOPIC/REALITY/INVESTIGATING`
- Customer evidence: satisfactionScore=4.2 score; maximumSatisfactionScore=5 score
- KPI source: `kpi.customer.satisfaction-index` computationKind `score-percent`
- Raw numeric representation: IEEE number `84.00000000000001` (not a string; not 0.84)
- Units: KPI `%`; facts `score`
- Data Reality: Dataset A `nexora.executive-operations.demo.baseline` scenario `baseline`
- Executive state (P0): `attention`
- Advisor state (P1): `watch`
- Advisor response mode: `standard`
- Stage effect (CC:5 continue): `FOCUS`

## P1:5 manager-facing summary (exact)

Customer Performance Requires Attention Customer requires executive attention. Customer Satisfaction Index is 84.00000000000001%. Customer executive state is attention. Customer maximumSatisfactionScore raw fact = 5 score. Customer performance is below the preferred operating range and may require investigation. Investigate Customer watch conditions.

Matches observed target: true

## CC:5 chat reply for the same utterance (after focus)

Focused on Customer.

Contains IEEE percent: false

## Command

`cd frontend && ./node_modules/.bin/tsx artifacts/nxa5/NXA-5-FIX3D-DIAG/reproduce-nxa5-fix3d-diag.ts`
