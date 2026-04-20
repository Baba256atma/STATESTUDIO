/**
 * B.23 — bias governance resolution.
 */

import test from "node:test";
import assert from "node:assert/strict";

import type { NexoraAdaptiveBiasResult } from "./nexoraAdaptiveBiasContract.ts";
import type { NexoraDecisionQualityReport } from "./nexoraDecisionQuality.ts";
import {
  DEFAULT_NEXORA_BIAS_GOVERNANCE,
  buildGovernedAdaptiveBiasForPick,
  buildNexoraBiasLayerContext,
  effectiveStrengthToMode,
  resolveBiasGovernance,
  type NexoraBiasGovernanceConfig,
} from "./nexoraBiasGovernance.ts";

function q(partial: Partial<NexoraDecisionQualityReport>): NexoraDecisionQualityReport {
  return {
    score: 0.55,
    qualityTier: "medium",
    trend: "stable",
    successfulRuns: 2,
    failedRuns: 0,
    totalRatedRuns: 4,
    summary: "x",
    ...partial,
  };
}

function bias(partial: Partial<NexoraAdaptiveBiasResult>): NexoraAdaptiveBiasResult {
  return {
    confidence: "medium",
    summary: "Balanced performed better historically.",
    ...partial,
  };
}

test("disabled config → blocked", () => {
  const cfg: NexoraBiasGovernanceConfig = { ...DEFAULT_NEXORA_BIAS_GOVERNANCE, enabled: false };
  const r = resolveBiasGovernance(cfg, q({ qualityTier: "high", totalRatedRuns: 5 }), bias({ confidence: "high" }));
  assert.equal(r.blocked, true);
  assert.equal(r.effectiveStrength, 0);
  assert.ok(String(r.summary).includes("off"));
});

test("low rated runs → blocked", () => {
  const r = resolveBiasGovernance(DEFAULT_NEXORA_BIAS_GOVERNANCE, q({ totalRatedRuns: 2 }), bias({}));
  assert.equal(r.blocked, true);
  assert.ok(String(r.summary).includes("rated"));
});

test("low quality → blocked", () => {
  const r = resolveBiasGovernance(DEFAULT_NEXORA_BIAS_GOVERNANCE, q({ qualityTier: "low", totalRatedRuns: 5 }), bias({}));
  assert.equal(r.blocked, true);
  assert.ok(String(r.summary).toLowerCase().includes("quality"));
});

test("medium/high quality + valid bias → enabled with expected strength", () => {
  const r = resolveBiasGovernance(
    DEFAULT_NEXORA_BIAS_GOVERNANCE,
    q({ qualityTier: "high", totalRatedRuns: 6 }),
    bias({ confidence: "high" })
  );
  assert.equal(r.blocked, false);
  assert.ok(r.effectiveStrength > 0.2);
});

test("strength thresholds map to correct behavior", () => {
  assert.equal(effectiveStrengthToMode(0), "none");
  assert.equal(effectiveStrengthToMode(0.15), "hint_only");
  assert.equal(effectiveStrengthToMode(0.3), "hint_only");
  assert.equal(effectiveStrengthToMode(0.31), "soft");
  assert.equal(effectiveStrengthToMode(0.5), "soft");
  assert.equal(effectiveStrengthToMode(0.61), "strong");
});

test("deterministic output", () => {
  const cfg = DEFAULT_NEXORA_BIAS_GOVERNANCE;
  const quality = q({ qualityTier: "high", totalRatedRuns: 5 });
  const b = bias({ preferredOptionId: "balanced" });
  assert.deepEqual(resolveBiasGovernance(cfg, quality, b), resolveBiasGovernance(cfg, quality, b));
  const ctx = buildNexoraBiasLayerContext({ quality, memory: [], outcomes: [], operatorMode: "adaptive" });
  const ctx2 = buildNexoraBiasLayerContext({ quality, memory: [], outcomes: [], operatorMode: "adaptive" });
  assert.equal(ctx.governance.blocked, ctx2.governance.blocked);
  assert.equal(ctx.governance.effectiveStrength, ctx2.governance.effectiveStrength);
});

test("governed pick null in hint-only band", () => {
  const cfg: NexoraBiasGovernanceConfig = { ...DEFAULT_NEXORA_BIAS_GOVERNANCE, strength: 0.15 };
  const quality = q({ qualityTier: "high", totalRatedRuns: 5 });
  const raw = bias({ confidence: "high", preferredOptionId: "balanced", discouragedOptionId: "aggressive" });
  const gov = resolveBiasGovernance(cfg, quality, raw);
  const { pickBias } = buildGovernedAdaptiveBiasForPick(raw, gov, cfg);
  assert.equal(pickBias, null);
});

test("B.24 pure operator mode turns off governed bias", () => {
  const quality = q({ qualityTier: "high", totalRatedRuns: 5 });
  const ctx = buildNexoraBiasLayerContext({ quality, memory: [], outcomes: [], operatorMode: "pure" });
  assert.equal(ctx.config.enabled, false);
  assert.equal(ctx.governedBiasForPick, null);
  assert.equal(ctx.governance.blocked, true);
  assert.ok(String(ctx.governance.summary).toLowerCase().includes("pure"));
});
