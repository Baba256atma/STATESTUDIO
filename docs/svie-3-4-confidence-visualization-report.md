# SVIE:3:4 — Confidence Visualization Report

**Tag:** `[SVIE:3:4_CONFIDENCE_VISUALIZATION]`

**Version:** `3.4.0`

**Date:** 2026-06-13

## Objective

Show **how confident** Nexora is about a recommendation using material-only scene cues. Numeric confidence stays in the Advisory Panel — never rendered in the scene.

## Confidence Tiers

| Range | Tier | Visual behavior |
|-------|------|-----------------|
| 90–100% | Executive High Confidence | Stable glow |
| 70–89% | High Confidence | Stable glow |
| 50–69% | Moderate Confidence | Soft pulse |
| Below 50% | Low Confidence | Unstable pulse |

## Runtime API

| Function | Role |
|----------|------|
| `mapRecommendationConfidence()` | Map normalized confidence to tier |
| `mapRecommendationConfidences()` | Batch mapping from advisory links |
| `resolveConfidenceVisualization()` | Tier → node visual styles |
| `mergeConfidenceVisuals()` | Merge multi-recommendation highlights |
| `applyConfidenceVisualization()` | Full build from advisory findings |
| `syncSvieConfidenceVisualization()` | Cached sync keyed by signature |

## Scene Wiring

| Component | Role |
|-----------|------|
| `SvieConfidenceNodeHighlight.tsx` | Inner torus with stable / soft / unstable pulse |
| `SceneRenderer.tsx` | Sync + prop pass-through |

## Certification

| Gate | Result |
|------|--------|
| A — Confidence mapping | **PASS** |
| B — Stable rendering | **PASS** |
| C — Repeatability | **PASS** |
| D — No routing impact | **PASS** |
| E — No performance regression | **PASS** |

## Freeze Tag

`[SVIE:3:4_CONFIDENCE_VISUALIZATION]`
