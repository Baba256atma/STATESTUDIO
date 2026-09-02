# DATA-UX:4 Test Evidence

Date: 2026-08-31

## Focused (owning projection)

`app/lib/decision-theatre/nexoraDecisionTheatreDataObjectProjection.test.ts`  
`app/lib/decision-theatre/nexoraDecisionTheatreDataObjectStageProjection.test.ts`  
`app/executive/nex-mvp/data/dataUx4StageIntegration.test.ts`

Coverage:

- one source → one DATA_OBJECT → one Stage participant
- zero-object CSV has no fabricated relationships
- provenance `supplies-data-to` is non-causal; missing targets do not render
- replacement updates the same logical object
- multiple sources; Remove from Stage is presentation-only
- comparison scenes omit Data Objects unless inspecting
- row count does not change scale
- Advisor deictics and delete boundary
- Show on Stage / Remove from Stage / R3F geometry wiring

Counts at last focused run: 20/20 with DATA-UX:3 rail tests included in the same invocation.

## Owning / integration regressions

96/96 including:

- DATA-UX:3 semantic understanding and NCA clarification
- RDI CSV vertical slice A–O
- DTH:1 foundation
- NEX-MVP Stage host and Executive Shell

## Funnel

- Level 1 Focused: passed
- Level 2 Layer: passed
- Level 3 Integration: passed
- Level 4 Milestone: passed; 7/7 required tasks (omnibus, DIR inventory, TypeScript, ESLint, diff check, production build, live smoke).
