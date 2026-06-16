# SVIE:2:3 — Executive Risk Attention Layer Report

**Tag:** `[SVIE:2:3_EXECUTIVE_RISK_ATTENTION]`

**Version:** `2.3.0`

**Date:** 2026-06-13

## Objective

Guide executive attention toward the most dangerous scene objects by ranking read-only attention scores and applying tiered pulse visualization. Answers: “What should the manager notice first?”

No changes to workspace state, routing, Advisory lifecycle, Governance lifecycle, or Assistant lifecycle.

## Attention Model

### ExecutiveRiskAttention

```typescript
{
  objectId: string;
  riskScore: number;
  impactWeight: number;
  confidenceWeight: number;
  attentionScore: number;   // riskScore × impactWeight × confidenceWeight
  rank: number;
  attentionTier: "top1" | "top3" | "top5" | "normal";
}
```

### Weights (deterministic)

| Input | Weight |
|-------|--------|
| `impact` | `clamp(normalizedImpact + 0.5, 0.5, 1.5)` — default `1` when absent |
| `confidence` | `clamp(1.25 - normalizedConfidence × 0.5, 0.5, 1.5)` — lower confidence increases weight; default `1` when absent |

### Output Lists

| List | Contents |
|------|----------|
| **Top 1** | Highest attention object |
| **Top 3** | Top 3 by attention score |
| **Top 5** | Top 5 by attention score |

Ranking tie-break: `objectId` ascending (stable).

## Visualization

| Tier | Pulse |
|------|-------|
| **Top 1** | Strongest executive pulse |
| **Top 3** (ranks 2–3) | Medium executive pulse |
| **Top 5** (ranks 4–5) | Light executive pulse |
| **All others** | Normal rendering (risk hotspot layer only; no executive pulse) |

Executive pulse overrides risk-tier pulse for ranked objects. Material-only changes (outline/emissive/glow/pulse intensity).

## Architecture

```
SceneRenderer
  ├─ syncSvieRiskHotspotVisualization()
  ├─ syncSvieExecutiveRiskAttention()
  └─ applyExecutiveAttentionVisualGuidance()
       └─ SceneObjectInstances → AnimatableObject → SvieRiskHotspotOverlay
```

## Dev Log

| Log | Payload |
|-----|---------|
| `[SVIE][ExecutiveAttention]` | `topObjectId`, `score`, `objectCount` |

Emitted once per unique scene signature (dev only).

## Certification

| Condition | Scope | Result |
|-----------|-------|--------|
| **A** | Attention ranking stable | **PASS** |
| **B** | Same input → same result | **PASS** |
| **C** | No routing side effects | **PASS** |
| **D** | No lifecycle regressions | **PASS** |
| **E** | No topology changes | **PASS** |

## Files Created

| File | Role |
|------|------|
| `svieExecutiveRiskAttentionContract.ts` | Types, pulse tiers, dev log |
| `svieExecutiveRiskAttentionDerivation.ts` | Attention score formula |
| `svieExecutiveRiskAttentionResolver.ts` | Ranking + top1/top3/top5 lists |
| `svieExecutiveRiskAttentionRuntime.ts` | One recompute per scene signature |
| `svieExecutiveRiskAttentionVisualizationResolver.ts` | Merge pulse guidance into hotspot visuals |
| `svieExecutiveRiskAttention.test.ts` | Pass conditions A–E |

## Files Updated (Scene Only)

| File | Change |
|------|--------|
| `svieRiskHotspotVisualizationContract.ts` | Executive pulse fields on visual style |
| `SvieRiskHotspotOverlay.tsx` | Executive attention pulse ring |
| `SceneRenderer.tsx` | Attention sync + visual merge |
| `animatableObjectPropsEqual.ts` | Memo compare for executive pulse props |

## Explicitly Not Modified

- Workspace state and routing
- Advisory / Governance / Assistant lifecycles
- Object topology coordinates
- Object selection and scene navigation
- Dashboard state

## Test Command

```bash
cd frontend && node --test \
  app/lib/scene/svie/svieExecutiveRiskAttention.test.ts \
  app/lib/scene/svie/svieRiskHotspotVisualization.test.ts \
  app/lib/scene/svie/sviePhase1Certification.test.ts

npm run build
```

## Freeze Tags Referenced

- `[SVIE:2:3_EXECUTIVE_RISK_ATTENTION]`
- `[SVIE:2:2_RISK_HOTSPOT]`
- `[SVIE:2:1_RISK_RUNTIME]`
- `[SVIE_PHASE1_CERTIFIED]`
