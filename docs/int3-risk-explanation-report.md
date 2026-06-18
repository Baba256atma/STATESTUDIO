# INT:3 — Risk Explanation Engine Report

Freeze Tag:

- `[INT3_RISK_EXPLANATION_COMPLETE]`

## Objective

Allow the Assistant to explain certified DS-6 risk intelligence using
template-driven executive explanations. No AI generation, mutations, or routing
changes.

## Implementation

| Module | Role |
|--------|------|
| `riskExplanationEngineContract.ts` | Explanation contract + diagnostics |
| `RiskExplanationEngine.ts` | `buildRiskExplanationRegistry()` runtime |
| `RiskExplanationEngine.test.ts` | Regression suite |

## Consumption Model

```
Scene / Risk Input
  ↓
ExecutiveRiskSummary (DS-6)
  ↓
Risk Score · Risk Chains · Risk Propagation · Vulnerabilities
  ↓
ExecutiveRiskExplanation[]
  ↓
Assistant surfaces (read-only)
```

## Explanation Coverage

Each risk explanation includes template-driven text for:

| Signal | Output Field |
|--------|--------------|
| Risk Score | `riskScoreExplanation` |
| Risk Chains | `riskChainExplanation` |
| Risk Propagation | `propagationExplanation` |
| Vulnerabilities | `vulnerabilityExplanation` |

Executive narratives:

| Question | Output Field |
|----------|--------------|
| What is risky | `whatIsRisky` |
| Why it is risky | `whyItIsRisky` |
| Where risk propagates | `whereRiskPropagates` |

Combined narrative: `executiveSummary`

Profile explanations cover object, relationship, and KPI nodes. Chain
explanations cover top propagation pathways.

## Regression Guards

All guards are `false`:

- `sceneMutation`
- `objectMutation`
- `mrpMutation`
- `routingMutation`
- `topologyMutation`
- `legacyRouterUsage`

## Diagnostics

- `[RISK_EXPLANATION_ENGINE]`
- `[RISK_EXPLANATION_READY]`

## Acceptance Criteria

- A. Risk explanations generated: PASS

## Verification

```bash
node --test frontend/app/lib/intelligence-integration/RiskExplanationEngine.test.ts
npm run build
```

## Guardrails

- Template-driven explanations only
- No AI generation
- Read-only DS-6 consumption
- No routing, scene, or topology changes

## Result

Risk Explanation Engine ready for Assistant intelligence binding.

Tags: `[INT3_RISK_EXPLANATION_COMPLETE]` `[RISK_EXPLANATION_ENGINE]` `[RISK_EXPLANATION_READY]`
