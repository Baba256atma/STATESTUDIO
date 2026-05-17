/**
 * D7:8:7 — Strategic intelligence equilibrium intelligence tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { buildRealityStack, realityInput } from "../reality/realityStackFixture.ts";
import { evaluateStrategicReality } from "../reality/nexoraStrategicRealityEngine.ts";
import { evaluateMetaStrategicIntelligence } from "./nexoraMetaStrategicEngine.ts";
import { evaluateStrategicPatternEvolution } from "./strategicPatternEvolutionEngine.ts";
import { evaluateStrategicMetaCausality } from "./strategicMetaCausalityEngine.ts";
import { evaluateStrategicIntelligenceDrift } from "./strategicIntelligenceDriftEngine.ts";
import { evaluateStrategicIntelligenceResilience } from "./strategicIntelligenceResilienceEngine.ts";
import { evaluateStrategicIntelligenceEvolution } from "./strategicIntelligenceEvolutionEngine.ts";
import {
  evaluateStrategicIntelligenceEquilibrium,
  freezeStrategicIntelligenceEquilibriumSnapshot,
} from "./strategicIntelligenceEquilibriumEngine.ts";
import {
  buildEquilibriumContentFingerprint,
  EQUILIBRIUM_AMBIGUITY_DISCLAIMER,
  guardEvaluateStrategicIntelligenceEquilibrium,
} from "./strategicIntelligenceEquilibriumGuards.ts";
import { deriveStrategicIntelligenceEquilibriumSignals, analyzeLongHorizonEquilibrium } from "./longHorizonEquilibriumModeling.ts";

function buildEquilibriumStack() {
  const stack = buildRealityStack();
  const base = realityInput(stack);
  const reality = evaluateStrategicReality(base);
  assert.ok(reality.ok);
  if (!reality.ok) throw new Error("reality failed");
  const meta = evaluateMetaStrategicIntelligence({
    topology: stack.topology,
    strategicRealityState: reality.snapshot.state,
    cognitiveCompletionState: stack.completion,
    executiveOrchestrationState: stack.orchestration,
    operationalUniverseState: base.operationalUniverseState,
    predictiveIntelligenceState: {
      foresightState: stack.foresight,
      trajectoryState: stack.trajectory,
      divergenceState: stack.divergence,
      cascadeState: stack.cascade,
    },
  });
  assert.ok(meta.ok);
  if (!meta.ok) throw new Error("meta failed");
  const pattern = evaluateStrategicPatternEvolution({
    topology: stack.topology,
    metaStrategicState: meta.snapshot.state,
    strategicRealityState: reality.snapshot.state,
    operationalUniverseState: base.operationalUniverseState,
    predictiveIntelligenceState: {
      foresightState: stack.foresight,
      trajectoryState: stack.trajectory,
      divergenceState: stack.divergence,
      cascadeState: stack.cascade,
    },
  });
  assert.ok(pattern.ok);
  if (!pattern.ok) throw new Error("pattern failed");
  const metaCausality = evaluateStrategicMetaCausality({
    topology: stack.topology,
    strategicPatternState: pattern.snapshot.state,
    metaStrategicState: meta.snapshot.state,
    strategicRealityState: reality.snapshot.state,
    operationalUniverseState: base.operationalUniverseState,
    predictiveIntelligenceState: {
      foresightState: stack.foresight,
      trajectoryState: stack.trajectory,
      divergenceState: stack.divergence,
      cascadeState: stack.cascade,
    },
  });
  assert.ok(metaCausality.ok);
  if (!metaCausality.ok) throw new Error("meta-causality failed");
  const drift = evaluateStrategicIntelligenceDrift({
    topology: stack.topology,
    metaCausalityState: metaCausality.snapshot.state,
    strategicPatternState: pattern.snapshot.state,
    metaStrategicState: meta.snapshot.state,
    strategicRealityState: reality.snapshot.state,
    operationalUniverseState: base.operationalUniverseState,
    predictiveIntelligenceState: {
      foresightState: stack.foresight,
      trajectoryState: stack.trajectory,
      divergenceState: stack.divergence,
      cascadeState: stack.cascade,
    },
  });
  assert.ok(drift.ok);
  if (!drift.ok) throw new Error("drift failed");
  const resilience = evaluateStrategicIntelligenceResilience({
    topology: stack.topology,
    strategicDriftState: drift.snapshot.state,
    metaCausalityState: metaCausality.snapshot.state,
    strategicPatternState: pattern.snapshot.state,
    metaStrategicState: meta.snapshot.state,
    strategicRealityState: reality.snapshot.state,
    operationalUniverseState: base.operationalUniverseState,
    predictiveIntelligenceState: {
      foresightState: stack.foresight,
      trajectoryState: stack.trajectory,
      divergenceState: stack.divergence,
      cascadeState: stack.cascade,
    },
  });
  assert.ok(resilience.ok);
  if (!resilience.ok) throw new Error("resilience failed");
  const evolution = evaluateStrategicIntelligenceEvolution({
    topology: stack.topology,
    strategicResilienceState: resilience.snapshot.state,
    strategicDriftState: drift.snapshot.state,
    metaCausalityState: metaCausality.snapshot.state,
    strategicPatternState: pattern.snapshot.state,
    metaStrategicState: meta.snapshot.state,
    strategicRealityState: reality.snapshot.state,
    operationalUniverseState: base.operationalUniverseState,
    predictiveIntelligenceState: {
      foresightState: stack.foresight,
      trajectoryState: stack.trajectory,
      divergenceState: stack.divergence,
      cascadeState: stack.cascade,
    },
  });
  assert.ok(evolution.ok);
  if (!evolution.ok) throw new Error("evolution failed");
  return { stack, base, evolution: evolution.snapshot.state, resilience: resilience.snapshot.state, drift: drift.snapshot.state, metaCausality: metaCausality.snapshot.state, pattern: pattern.snapshot.state, meta: meta.snapshot.state, reality: reality.snapshot.state };
}

test("deterministic equilibrium orchestration", () => {
  const ctx = buildEquilibriumStack();
  const input = {
    topology: ctx.stack.topology,
    strategicEvolutionState: ctx.evolution,
    strategicResilienceState: ctx.resilience,
    strategicDriftState: ctx.drift,
    metaCausalityState: ctx.metaCausality,
    strategicPatternState: ctx.pattern,
    metaStrategicState: ctx.meta,
    strategicRealityState: ctx.reality,
    operationalUniverseState: ctx.base.operationalUniverseState,
    predictiveIntelligenceState: {
      foresightState: ctx.stack.foresight,
      trajectoryState: ctx.stack.trajectory,
      divergenceState: ctx.stack.divergence,
      cascadeState: ctx.stack.cascade,
    },
  };
  const e1 = evaluateStrategicIntelligenceEquilibrium(input);
  const e2 = evaluateStrategicIntelligenceEquilibrium(input);
  assert.ok(e1.ok && e2.ok);
  if (!e1.ok || !e2.ok) return;
  assert.equal(e1.snapshot.fingerprint, e2.snapshot.fingerprint);
});

test("long-horizon equilibrium modeling", () => {
  const ctx = buildEquilibriumStack();
  const signals = deriveStrategicIntelligenceEquilibriumSignals({
    strategicEvolutionState: ctx.evolution,
    strategicResilienceState: ctx.resilience,
    strategicDriftState: ctx.drift,
    metaCausalityState: ctx.metaCausality,
    strategicPatternState: ctx.pattern,
    metaStrategicState: ctx.meta,
    strategicRealityState: ctx.reality,
    operationalUniverseState: ctx.base.operationalUniverseState,
    foresightState: ctx.stack.foresight,
    divergenceState: ctx.stack.divergence,
    trajectoryState: ctx.stack.trajectory,
  });
  const records = analyzeLongHorizonEquilibrium({
    equilibriumSignals: signals,
    strategicEvolutionState: ctx.evolution,
    strategicResilienceState: ctx.resilience,
    strategicDriftState: ctx.drift,
    metaCausalityState: ctx.metaCausality,
    strategicPatternState: ctx.pattern,
    metaStrategicState: ctx.meta,
    strategicRealityState: ctx.reality,
    operationalUniverseState: ctx.base.operationalUniverseState,
    foresightState: ctx.stack.foresight,
    divergenceState: ctx.stack.divergence,
    trajectoryState: ctx.stack.trajectory,
  });
  assert.equal(records.length, 6);
});

test("enterprise equilibrium integration", () => {
  const ctx = buildEquilibriumStack();
  const result = evaluateStrategicIntelligenceEquilibrium({
    topology: ctx.stack.topology,
    strategicEvolutionState: ctx.evolution,
    strategicResilienceState: ctx.resilience,
    strategicDriftState: ctx.drift,
    metaCausalityState: ctx.metaCausality,
    strategicPatternState: ctx.pattern,
    metaStrategicState: ctx.meta,
    strategicRealityState: ctx.reality,
    operationalUniverseState: ctx.base.operationalUniverseState,
    predictiveIntelligenceState: {
      foresightState: ctx.stack.foresight,
      trajectoryState: ctx.stack.trajectory,
      divergenceState: ctx.stack.divergence,
      cascadeState: ctx.stack.cascade,
    },
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.snapshot.state.longHorizonEquilibriumRecords.length, 6);
  assert.equal(result.snapshot.state.enterpriseMetaStrategicEquilibriumRecords.length, 6);
});

test("replay-safe equilibrium snapshots", () => {
  const ctx = buildEquilibriumStack();
  const result = evaluateStrategicIntelligenceEquilibrium({
    topology: ctx.stack.topology,
    strategicEvolutionState: ctx.evolution,
    strategicResilienceState: ctx.resilience,
    strategicDriftState: ctx.drift,
    metaCausalityState: ctx.metaCausality,
    strategicPatternState: ctx.pattern,
    metaStrategicState: ctx.meta,
    strategicRealityState: ctx.reality,
    operationalUniverseState: ctx.base.operationalUniverseState,
    predictiveIntelligenceState: {
      foresightState: ctx.stack.foresight,
      trajectoryState: ctx.stack.trajectory,
      divergenceState: ctx.stack.divergence,
      cascadeState: ctx.stack.cascade,
    },
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeStrategicIntelligenceEquilibriumSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { strategicEquilibriumCoherenceScore: number }).strategicEquilibriumCoherenceScore = 0;
  });
});

test("governance guard rail enforcement", () => {
  const guard = guardEvaluateStrategicIntelligenceEquilibrium({
    topologyId: "topo",
    regionIds: ["finance"],
    equilibriumSignals: [
      {
        equilibriumId: "eq::bad",
        affectedRegionIds: ["unknown"],
        equilibriumState: "balanced",
        equilibriumStrength: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
});

test("equilibrium disclaimers", () => {
  const ctx = buildEquilibriumStack();
  const result = evaluateStrategicIntelligenceEquilibrium({
    topology: ctx.stack.topology,
    strategicEvolutionState: ctx.evolution,
    strategicResilienceState: ctx.resilience,
    strategicDriftState: ctx.drift,
    metaCausalityState: ctx.metaCausality,
    strategicPatternState: ctx.pattern,
    metaStrategicState: ctx.meta,
    strategicRealityState: ctx.reality,
    operationalUniverseState: ctx.base.operationalUniverseState,
    predictiveIntelligenceState: {
      foresightState: ctx.stack.foresight,
      trajectoryState: ctx.stack.trajectory,
      divergenceState: ctx.stack.divergence,
      cascadeState: ctx.stack.cascade,
    },
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.snapshot.state.equilibriumAmbiguityDisclaimer, EQUILIBRIUM_AMBIGUITY_DISCLAIMER);
});

test("duplicate equilibrium fingerprint rejection", () => {
  const ctx = buildEquilibriumStack();
  const input = {
    topology: ctx.stack.topology,
    strategicEvolutionState: ctx.evolution,
    strategicResilienceState: ctx.resilience,
    strategicDriftState: ctx.drift,
    metaCausalityState: ctx.metaCausality,
    strategicPatternState: ctx.pattern,
    metaStrategicState: ctx.meta,
    strategicRealityState: ctx.reality,
    operationalUniverseState: ctx.base.operationalUniverseState,
    predictiveIntelligenceState: {
      foresightState: ctx.stack.foresight,
      trajectoryState: ctx.stack.trajectory,
      divergenceState: ctx.stack.divergence,
      cascadeState: ctx.stack.cascade,
    },
    tick: 0,
  };
  const first = evaluateStrategicIntelligenceEquilibrium(input);
  assert.ok(first.ok);
  if (!first.ok) return;
  const parsed = JSON.parse(String(first.snapshot.fingerprint)) as { content?: string };
  const contentFp = parsed.content ?? "";
  const second = evaluateStrategicIntelligenceEquilibrium({
    ...input,
    priorEquilibriumFingerprints: [contentFp],
  });
  assert.equal(second.ok, false);
  if (!second.ok) assert.equal(second.guard.code, "duplicate_equilibrium_build");
});
