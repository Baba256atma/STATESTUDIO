/**
 * D7:8:9 — Unified meta-strategic intelligence tests.
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
import { evaluateStrategicIntelligenceEquilibrium } from "./strategicIntelligenceEquilibriumEngine.ts";
import { evaluateStrategicIntelligenceContinuity } from "./strategicIntelligenceContinuityEngine.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { StrategicMetaCausalityIntelligenceState } from "./strategicMetaCausalityTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import type { StrategicIntelligenceResilienceIntelligenceState } from "./strategicIntelligenceResilienceTypes.ts";
import type { StrategicIntelligenceEvolutionIntelligenceState } from "./strategicIntelligenceEvolutionTypes.ts";
import type { StrategicIntelligenceEquilibriumIntelligenceState } from "./strategicIntelligenceEquilibriumTypes.ts";
import type { StrategicIntelligenceContinuityIntelligenceState } from "./strategicIntelligenceContinuityTypes.ts";
import {
  evaluateUnifiedMetaStrategicIntelligence,
  freezeUnifiedMetaStrategicSnapshot,
} from "./unifiedMetaStrategicEngine.ts";
import {
  UNIFIED_META_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_UNIFIED_META_DISCLAIMER,
  guardEvaluateUnifiedMetaStrategicIntelligence,
  guardUnifiedMetaStrategicSemantics,
} from "./unifiedMetaStrategicGuards.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { buildUnifiedMetaStrategicSemantics } from "./unifiedMetaStrategicSemantics.ts";
import {
  deriveUnifiedMetaStrategicSignals,
  analyzeCrossIntelligenceSynchronization,
  calculateUnifiedStrategicCoherenceScore,
  classifyExecutiveUnifiedMetaLabel,
} from "./crossIntelligenceSynchronizationModeling.ts";
import {
  analyzeUnifiedMetaCoherence,
  calculateEcosystemFragmentationScore,
} from "./unifiedMetaCoherenceAnalysis.ts";

function metaInput(
  stack: ReturnType<typeof buildRealityStack>,
  strategicRealityState: StrategicRealityIntelligenceState
) {
  const base = realityInput(stack);
  return {
    topology: stack.topology,
    strategicRealityState,
    cognitiveCompletionState: stack.completion,
    executiveOrchestrationState: stack.orchestration,
    operationalUniverseState: base.operationalUniverseState,
    predictiveIntelligenceState: {
      foresightState: stack.foresight,
      trajectoryState: stack.trajectory,
      divergenceState: stack.divergence,
      cascadeState: stack.cascade,
    },
  };
}

function patternInput(
  stack: ReturnType<typeof buildRealityStack>,
  metaStrategicState: MetaStrategicIntelligenceState,
  strategicRealityState: StrategicRealityIntelligenceState
) {
  const base = realityInput(stack);
  return {
    topology: stack.topology,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    predictiveIntelligenceState: {
      foresightState: stack.foresight,
      trajectoryState: stack.trajectory,
      divergenceState: stack.divergence,
      cascadeState: stack.cascade,
    },
  };
}

function metaCausalityInput(
  stack: ReturnType<typeof buildRealityStack>,
  strategicPatternState: StrategicPatternEvolutionIntelligenceState,
  metaStrategicState: MetaStrategicIntelligenceState,
  strategicRealityState: StrategicRealityIntelligenceState
) {
  const base = realityInput(stack);
  return {
    topology: stack.topology,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    predictiveIntelligenceState: {
      foresightState: stack.foresight,
      trajectoryState: stack.trajectory,
      divergenceState: stack.divergence,
      cascadeState: stack.cascade,
    },
  };
}

function driftInput(
  stack: ReturnType<typeof buildRealityStack>,
  metaCausalityState: StrategicMetaCausalityIntelligenceState,
  strategicPatternState: StrategicPatternEvolutionIntelligenceState,
  metaStrategicState: MetaStrategicIntelligenceState,
  strategicRealityState: StrategicRealityIntelligenceState
) {
  const base = realityInput(stack);
  return {
    topology: stack.topology,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    predictiveIntelligenceState: {
      foresightState: stack.foresight,
      trajectoryState: stack.trajectory,
      divergenceState: stack.divergence,
      cascadeState: stack.cascade,
    },
  };
}

function resilienceInput(
  stack: ReturnType<typeof buildRealityStack>,
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState,
  metaCausalityState: StrategicMetaCausalityIntelligenceState,
  strategicPatternState: StrategicPatternEvolutionIntelligenceState,
  metaStrategicState: MetaStrategicIntelligenceState,
  strategicRealityState: StrategicRealityIntelligenceState
) {
  const base = realityInput(stack);
  return {
    topology: stack.topology,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    predictiveIntelligenceState: {
      foresightState: stack.foresight,
      trajectoryState: stack.trajectory,
      divergenceState: stack.divergence,
      cascadeState: stack.cascade,
    },
  };
}

function evolutionInput(
  stack: ReturnType<typeof buildRealityStack>,
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState,
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState,
  metaCausalityState: StrategicMetaCausalityIntelligenceState,
  strategicPatternState: StrategicPatternEvolutionIntelligenceState,
  metaStrategicState: MetaStrategicIntelligenceState,
  strategicRealityState: StrategicRealityIntelligenceState
) {
  const base = realityInput(stack);
  return {
    topology: stack.topology,
    strategicResilienceState,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    predictiveIntelligenceState: {
      foresightState: stack.foresight,
      trajectoryState: stack.trajectory,
      divergenceState: stack.divergence,
      cascadeState: stack.cascade,
    },
  };
}

function equilibriumInput(
  stack: ReturnType<typeof buildRealityStack>,
  strategicEvolutionState: StrategicIntelligenceEvolutionIntelligenceState,
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState,
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState,
  metaCausalityState: StrategicMetaCausalityIntelligenceState,
  strategicPatternState: StrategicPatternEvolutionIntelligenceState,
  metaStrategicState: MetaStrategicIntelligenceState,
  strategicRealityState: StrategicRealityIntelligenceState
) {
  const base = realityInput(stack);
  return {
    topology: stack.topology,
    strategicEvolutionState,
    strategicResilienceState,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    predictiveIntelligenceState: {
      foresightState: stack.foresight,
      trajectoryState: stack.trajectory,
      divergenceState: stack.divergence,
      cascadeState: stack.cascade,
    },
  };
}

function continuityInput(
  stack: ReturnType<typeof buildRealityStack>,
  strategicEquilibriumState: StrategicIntelligenceEquilibriumIntelligenceState,
  strategicEvolutionState: StrategicIntelligenceEvolutionIntelligenceState,
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState,
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState,
  metaCausalityState: StrategicMetaCausalityIntelligenceState,
  strategicPatternState: StrategicPatternEvolutionIntelligenceState,
  metaStrategicState: MetaStrategicIntelligenceState,
  strategicRealityState: StrategicRealityIntelligenceState
) {
  const base = realityInput(stack);
  return {
    topology: stack.topology,
    strategicEquilibriumState,
    strategicEvolutionState,
    strategicResilienceState,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    predictiveIntelligenceState: {
      foresightState: stack.foresight,
      trajectoryState: stack.trajectory,
      divergenceState: stack.divergence,
      cascadeState: stack.cascade,
    },
  };
}

function unifiedMetaInput(
  stack: ReturnType<typeof buildRealityStack>,
  strategicContinuityState: StrategicIntelligenceContinuityIntelligenceState,
  strategicEquilibriumState: StrategicIntelligenceEquilibriumIntelligenceState,
  strategicEvolutionState: StrategicIntelligenceEvolutionIntelligenceState,
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState,
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState,
  metaCausalityState: StrategicMetaCausalityIntelligenceState,
  strategicPatternState: StrategicPatternEvolutionIntelligenceState,
  metaStrategicState: MetaStrategicIntelligenceState,
  strategicRealityState: StrategicRealityIntelligenceState
) {
  const base = realityInput(stack);
  return {
    topology: stack.topology,
    strategicContinuityState,
    strategicEquilibriumState,
    strategicEvolutionState,
    strategicResilienceState,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    predictiveIntelligenceState: {
      foresightState: stack.foresight,
      trajectoryState: stack.trajectory,
      divergenceState: stack.divergence,
      cascadeState: stack.cascade,
    },
  };
}

function buildUnifiedMetaStack() {
  const stack = buildRealityStack();
  const reality = evaluateStrategicReality(realityInput(stack));
  assert.ok(reality.ok);
  if (!reality.ok) throw new Error("strategic reality failed");
  const meta = evaluateMetaStrategicIntelligence(metaInput(stack, reality.snapshot.state));
  assert.ok(meta.ok);
  if (!meta.ok) throw new Error("meta-strategic failed");
  const pattern = evaluateStrategicPatternEvolution(
    patternInput(stack, meta.snapshot.state, reality.snapshot.state)
  );
  assert.ok(pattern.ok);
  if (!pattern.ok) throw new Error("pattern evolution failed");
  const metaCausality = evaluateStrategicMetaCausality(
    metaCausalityInput(stack, pattern.snapshot.state, meta.snapshot.state, reality.snapshot.state)
  );
  assert.ok(metaCausality.ok);
  if (!metaCausality.ok) throw new Error("meta-causality failed");
  const drift = evaluateStrategicIntelligenceDrift(
    driftInput(
      stack,
      metaCausality.snapshot.state,
      pattern.snapshot.state,
      meta.snapshot.state,
      reality.snapshot.state
    )
  );
  assert.ok(drift.ok);
  if (!drift.ok) throw new Error("strategic drift failed");
  const resilience = evaluateStrategicIntelligenceResilience(
    resilienceInput(
      stack,
      drift.snapshot.state,
      metaCausality.snapshot.state,
      pattern.snapshot.state,
      meta.snapshot.state,
      reality.snapshot.state
    )
  );
  assert.ok(resilience.ok);
  if (!resilience.ok) throw new Error("strategic resilience failed");
  const evolution = evaluateStrategicIntelligenceEvolution(
    evolutionInput(
      stack,
      resilience.snapshot.state,
      drift.snapshot.state,
      metaCausality.snapshot.state,
      pattern.snapshot.state,
      meta.snapshot.state,
      reality.snapshot.state
    )
  );
  assert.ok(evolution.ok);
  if (!evolution.ok) throw new Error("strategic evolution failed");
  const equilibrium = evaluateStrategicIntelligenceEquilibrium(
    equilibriumInput(
      stack,
      evolution.snapshot.state,
      resilience.snapshot.state,
      drift.snapshot.state,
      metaCausality.snapshot.state,
      pattern.snapshot.state,
      meta.snapshot.state,
      reality.snapshot.state
    )
  );
  assert.ok(equilibrium.ok);
  if (!equilibrium.ok) throw new Error("strategic equilibrium failed");
  const continuity = evaluateStrategicIntelligenceContinuity(
    continuityInput(
      stack,
      equilibrium.snapshot.state,
      evolution.snapshot.state,
      resilience.snapshot.state,
      drift.snapshot.state,
      metaCausality.snapshot.state,
      pattern.snapshot.state,
      meta.snapshot.state,
      reality.snapshot.state
    )
  );
  assert.ok(continuity.ok);
  if (!continuity.ok) throw new Error("strategic continuity failed");
  return {
    stack,
    strategicRealityState: reality.snapshot.state,
    metaStrategicState: meta.snapshot.state,
    strategicPatternState: pattern.snapshot.state,
    metaCausalityState: metaCausality.snapshot.state,
    strategicDriftState: drift.snapshot.state,
    strategicResilienceState: resilience.snapshot.state,
    strategicEvolutionState: evolution.snapshot.state,
    strategicEquilibriumState: equilibrium.snapshot.state,
    strategicContinuityState: continuity.snapshot.state,
  };
}

test("deterministic unified orchestration", () => {
  const ctx = buildUnifiedMetaStack();
  const input = unifiedMetaInput(
    ctx.stack,
    ctx.strategicContinuityState,
    ctx.strategicEquilibriumState,
    ctx.strategicEvolutionState,
    ctx.strategicResilienceState,
    ctx.strategicDriftState,
    ctx.metaCausalityState,
    ctx.strategicPatternState,
    ctx.metaStrategicState,
    ctx.strategicRealityState
  );
  const u1 = evaluateUnifiedMetaStrategicIntelligence({
    ...input,
    unifiedMetaContext: { unifiedMetaLeverageFactor: 0.1 },
  });
  const u2 = evaluateUnifiedMetaStrategicIntelligence({
    ...input,
    unifiedMetaContext: { unifiedMetaLeverageFactor: 0.1 },
  });
  assert.ok(u1.ok && u2.ok);
  if (!u1.ok || !u2.ok) return;
  assert.equal(u1.snapshot.fingerprint, u2.snapshot.fingerprint);
});

test("cross-intelligence synchronization modeling", () => {
  const ctx = buildUnifiedMetaStack();
  const base = unifiedMetaInput(
    ctx.stack,
    ctx.strategicContinuityState,
    ctx.strategicEquilibriumState,
    ctx.strategicEvolutionState,
    ctx.strategicResilienceState,
    ctx.strategicDriftState,
    ctx.metaCausalityState,
    ctx.strategicPatternState,
    ctx.metaStrategicState,
    ctx.strategicRealityState
  );
  const signals = deriveUnifiedMetaStrategicSignals({
    strategicContinuityState: ctx.strategicContinuityState,
    strategicEquilibriumState: ctx.strategicEquilibriumState,
    strategicEvolutionState: ctx.strategicEvolutionState,
    strategicResilienceState: ctx.strategicResilienceState,
    strategicDriftState: ctx.strategicDriftState,
    metaCausalityState: ctx.metaCausalityState,
    strategicPatternState: ctx.strategicPatternState,
    metaStrategicState: ctx.metaStrategicState,
    strategicRealityState: ctx.strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: ctx.stack.foresight,
    divergenceState: ctx.stack.divergence,
    trajectoryState: ctx.stack.trajectory,
    unifiedMetaLeverageFactor: 0.1,
  });
  const syncRecords = analyzeCrossIntelligenceSynchronization({
    unifiedMetaSignals: signals,
    strategicContinuityState: ctx.strategicContinuityState,
    strategicEquilibriumState: ctx.strategicEquilibriumState,
    strategicEvolutionState: ctx.strategicEvolutionState,
    strategicResilienceState: ctx.strategicResilienceState,
    strategicDriftState: ctx.strategicDriftState,
    metaCausalityState: ctx.metaCausalityState,
    strategicPatternState: ctx.strategicPatternState,
    metaStrategicState: ctx.metaStrategicState,
    strategicRealityState: ctx.strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: ctx.stack.foresight,
    divergenceState: ctx.stack.divergence,
    trajectoryState: ctx.stack.trajectory,
  });
  const score = calculateUnifiedStrategicCoherenceScore({
    unifiedMetaSignals: signals,
    crossIntelligenceSynchronizationRecords: syncRecords,
    strategicContinuityState: ctx.strategicContinuityState,
    strategicEquilibriumState: ctx.strategicEquilibriumState,
    strategicResilienceState: ctx.strategicResilienceState,
    strategicDriftState: ctx.strategicDriftState,
  });
  assert.ok(signals.length > 0);
  assert.equal(syncRecords.length, 6);
  assert.ok(score >= 0 && score <= 1);
  for (const s of signals) assert.ok(s.unifiedMetaStrength <= 0.92);
});

test("meta coherence consistency validation", () => {
  const ctx = buildUnifiedMetaStack();
  const base = unifiedMetaInput(
    ctx.stack,
    ctx.strategicContinuityState,
    ctx.strategicEquilibriumState,
    ctx.strategicEvolutionState,
    ctx.strategicResilienceState,
    ctx.strategicDriftState,
    ctx.metaCausalityState,
    ctx.strategicPatternState,
    ctx.metaStrategicState,
    ctx.strategicRealityState
  );
  const signals = deriveUnifiedMetaStrategicSignals({
    strategicContinuityState: ctx.strategicContinuityState,
    strategicEquilibriumState: ctx.strategicEquilibriumState,
    strategicEvolutionState: ctx.strategicEvolutionState,
    strategicResilienceState: ctx.strategicResilienceState,
    strategicDriftState: ctx.strategicDriftState,
    metaCausalityState: ctx.metaCausalityState,
    strategicPatternState: ctx.strategicPatternState,
    metaStrategicState: ctx.metaStrategicState,
    strategicRealityState: ctx.strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: ctx.stack.foresight,
    divergenceState: ctx.stack.divergence,
    trajectoryState: ctx.stack.trajectory,
  });
  const s1 = analyzeCrossIntelligenceSynchronization({
    unifiedMetaSignals: signals,
    strategicContinuityState: ctx.strategicContinuityState,
    strategicEquilibriumState: ctx.strategicEquilibriumState,
    strategicEvolutionState: ctx.strategicEvolutionState,
    strategicResilienceState: ctx.strategicResilienceState,
    strategicDriftState: ctx.strategicDriftState,
    metaCausalityState: ctx.metaCausalityState,
    strategicPatternState: ctx.strategicPatternState,
    metaStrategicState: ctx.metaStrategicState,
    strategicRealityState: ctx.strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: ctx.stack.foresight,
    divergenceState: ctx.stack.divergence,
    trajectoryState: ctx.stack.trajectory,
  });
  const s2 = analyzeCrossIntelligenceSynchronization({
    unifiedMetaSignals: signals,
    strategicContinuityState: ctx.strategicContinuityState,
    strategicEquilibriumState: ctx.strategicEquilibriumState,
    strategicEvolutionState: ctx.strategicEvolutionState,
    strategicResilienceState: ctx.strategicResilienceState,
    strategicDriftState: ctx.strategicDriftState,
    metaCausalityState: ctx.metaCausalityState,
    strategicPatternState: ctx.strategicPatternState,
    metaStrategicState: ctx.metaStrategicState,
    strategicRealityState: ctx.strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: ctx.stack.foresight,
    divergenceState: ctx.stack.divergence,
    trajectoryState: ctx.stack.trajectory,
  });
  const c1 = analyzeUnifiedMetaCoherence({
    unifiedMetaSignals: signals,
    crossIntelligenceSynchronizationRecords: s1,
    strategicContinuityState: ctx.strategicContinuityState,
    strategicEquilibriumState: ctx.strategicEquilibriumState,
    strategicEvolutionState: ctx.strategicEvolutionState,
    strategicResilienceState: ctx.strategicResilienceState,
    strategicDriftState: ctx.strategicDriftState,
    metaCausalityState: ctx.metaCausalityState,
    strategicPatternState: ctx.strategicPatternState,
    metaStrategicState: ctx.metaStrategicState,
    strategicRealityState: ctx.strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
  });
  const c2 = analyzeUnifiedMetaCoherence({
    unifiedMetaSignals: signals,
    crossIntelligenceSynchronizationRecords: s2,
    strategicContinuityState: ctx.strategicContinuityState,
    strategicEquilibriumState: ctx.strategicEquilibriumState,
    strategicEvolutionState: ctx.strategicEvolutionState,
    strategicResilienceState: ctx.strategicResilienceState,
    strategicDriftState: ctx.strategicDriftState,
    metaCausalityState: ctx.metaCausalityState,
    strategicPatternState: ctx.strategicPatternState,
    metaStrategicState: ctx.metaStrategicState,
    strategicRealityState: ctx.strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
  });
  assert.equal(
    s1.map((r) => r.recordId).join("|"),
    s2.map((r) => r.recordId).join("|")
  );
  assert.equal(
    c1.map((r) => r.recordId).join("|"),
    c2.map((r) => r.recordId).join("|")
  );
});

test("unified enterprise cognition testing", () => {
  const ctx = buildUnifiedMetaStack();
  const result = evaluateUnifiedMetaStrategicIntelligence(
    unifiedMetaInput(
      ctx.stack,
      ctx.strategicContinuityState,
      ctx.strategicEquilibriumState,
      ctx.strategicEvolutionState,
      ctx.strategicResilienceState,
      ctx.strategicDriftState,
      ctx.metaCausalityState,
      ctx.strategicPatternState,
      ctx.metaStrategicState,
      ctx.strategicRealityState
    )
  );
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.snapshot.state.crossIntelligenceSynchronizationRecords.length, 6);
  assert.equal(result.snapshot.state.unifiedMetaCoherenceRecords.length, 6);
  assert.equal(result.snapshot.state.enterpriseUnifiedMetaStrategicRecords.length, 6);
  assert.ok(result.snapshot.state.activeUnifiedMetaSignals.length > 0);
});

test("replay-safe unified snapshots", () => {
  const ctx = buildUnifiedMetaStack();
  const result = evaluateUnifiedMetaStrategicIntelligence(
    unifiedMetaInput(
      ctx.stack,
      ctx.strategicContinuityState,
      ctx.strategicEquilibriumState,
      ctx.strategicEvolutionState,
      ctx.strategicResilienceState,
      ctx.strategicDriftState,
      ctx.metaCausalityState,
      ctx.strategicPatternState,
      ctx.metaStrategicState,
      ctx.strategicRealityState
    )
  );
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeUnifiedMetaStrategicSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { unifiedStrategicCoherenceScore: number }).unifiedStrategicCoherenceScore = 0;
  });
});

test("governance guard rail enforcement", () => {
  assert.ok(containsFalseCertaintyText("guaranteed unified strategic coherence"));
  const guard = guardEvaluateUnifiedMetaStrategicIntelligence({
    topologyId: "topo",
    regionIds: ["finance"],
    unifiedMetaSignals: [
      {
        unifiedMetaId: "unified-meta::bad",
        affectedRegionIds: ["unknown"],
        unifiedMetaState: "coherent",
        unifiedMetaStrength: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_unified_meta_region");

  const semanticsGuard = guardUnifiedMetaStrategicSemantics({
    headline:
      "Autonomous strategic governance via manipulative orchestration and hidden psychological governance",
    summary: "Unified meta review",
  });
  assert.equal(semanticsGuard.ok, false);
  if (semanticsGuard.ok) return;
  assert.equal(semanticsGuard.code, "fabricated_strategic_intelligence");
});

test("immutable unified state preservation", () => {
  const ctx = buildUnifiedMetaStack();
  const frozenContinuity = JSON.stringify(ctx.strategicContinuityState);
  evaluateUnifiedMetaStrategicIntelligence(
    unifiedMetaInput(
      ctx.stack,
      ctx.strategicContinuityState,
      ctx.strategicEquilibriumState,
      ctx.strategicEvolutionState,
      ctx.strategicResilienceState,
      ctx.strategicDriftState,
      ctx.metaCausalityState,
      ctx.strategicPatternState,
      ctx.metaStrategicState,
      ctx.strategicRealityState
    )
  );
  assert.equal(JSON.stringify(ctx.strategicContinuityState), frozenContinuity);
});

test("executive-readable unified semantics", () => {
  const ctx = buildUnifiedMetaStack();
  const result = evaluateUnifiedMetaStrategicIntelligence({
    ...unifiedMetaInput(
      ctx.stack,
      ctx.strategicContinuityState,
      ctx.strategicEquilibriumState,
      ctx.strategicEvolutionState,
      ctx.strategicResilienceState,
      ctx.strategicDriftState,
      ctx.metaCausalityState,
      ctx.strategicPatternState,
      ctx.metaStrategicState,
      ctx.strategicRealityState
    ),
    tick: 9,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /operational|unified|coherent|resilience|continuity|optimization|governance|strategic|enterprise|evolution|equilibrium|volatility|intelligence|adaptive|long-horizon|synchronization|ecosystem/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("Unified meta recursion exceeded"));
  assert.equal(result.snapshot.state.unifiedMetaAmbiguityDisclaimer, UNIFIED_META_AMBIGUITY_DISCLAIMER);
  assert.equal(
    result.snapshot.state.nonAutonomousUnifiedMetaDisclaimer,
    NON_AUTONOMOUS_UNIFIED_META_DISCLAIMER
  );
  const manual = buildUnifiedMetaStrategicSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.includes("Indicative"));
});

test("integrated unified panel contract", () => {
  const ctx = buildUnifiedMetaStack();
  const result = evaluateUnifiedMetaStrategicIntelligence(
    unifiedMetaInput(
      ctx.stack,
      ctx.strategicContinuityState,
      ctx.strategicEquilibriumState,
      ctx.strategicEvolutionState,
      ctx.strategicResilienceState,
      ctx.strategicDriftState,
      ctx.metaCausalityState,
      ctx.strategicPatternState,
      ctx.metaStrategicState,
      ctx.strategicRealityState
    )
  );
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, ctx.stack.topology.topologyId);
  assert.equal(result.panelContract.unifiedMetaAmbiguityDisclaimer, UNIFIED_META_AMBIGUITY_DISCLAIMER);
  assert.ok(result.panelContract.unifiedMetaSignals.length > 0);
});

test("rejects duplicate unified meta build fingerprint", () => {
  const ctx = buildUnifiedMetaStack();
  const input = unifiedMetaInput(
    ctx.stack,
    ctx.strategicContinuityState,
    ctx.strategicEquilibriumState,
    ctx.strategicEvolutionState,
    ctx.strategicResilienceState,
    ctx.strategicDriftState,
    ctx.metaCausalityState,
    ctx.strategicPatternState,
    ctx.metaStrategicState,
    ctx.strategicRealityState
  );
  const first = evaluateUnifiedMetaStrategicIntelligence({ ...input, tick: 0 });
  assert.ok(first.ok);
  if (!first.ok) return;
  const parsed = JSON.parse(String(first.snapshot.fingerprint)) as { content?: string };
  const second = evaluateUnifiedMetaStrategicIntelligence({
    ...input,
    tick: 0,
    priorUnifiedMetaFingerprints: [parsed.content ?? ""],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_unified_meta_build");
});

test("unified meta classification", () => {
  const label = classifyExecutiveUnifiedMetaLabel({
    unifiedMetaSignals: [
      {
        unifiedMetaId: "u1",
        affectedRegionIds: ["logistics"],
        unifiedMetaState: "coherent",
        unifiedMetaStrength: 0.65,
      },
    ],
    unifiedStrategicCoherenceScore: 0.65,
    metaSynchronizationScore: 0.55,
    ecosystemFragmentationScore: 0.25,
  });
  assert.equal(label, "coherent");

  const fragmentation = calculateEcosystemFragmentationScore({
    unifiedMetaSignals: [
      {
        unifiedMetaId: "u1",
        affectedRegionIds: ["logistics"],
        unifiedMetaState: "fragmented",
        unifiedMetaStrength: 0.6,
      },
    ],
    unifiedMetaCoherenceRecords: [],
    strategicContinuityState: {
      fragmentationPressureScore: 0.4,
    } as Parameters<typeof calculateEcosystemFragmentationScore>[0]["strategicContinuityState"],
    strategicEquilibriumState: {
      equilibriumPressureScore: 0.3,
    } as Parameters<typeof calculateEcosystemFragmentationScore>[0]["strategicEquilibriumState"],
    strategicEvolutionState: {
      transformationPressureScore: 0.35,
    } as Parameters<typeof calculateEcosystemFragmentationScore>[0]["strategicEvolutionState"],
    strategicDriftState: {
      strategicDriftInstabilityScore: 0.3,
    } as Parameters<typeof calculateEcosystemFragmentationScore>[0]["strategicDriftState"],
  });
  assert.ok(fragmentation >= 0 && fragmentation <= 1);
});
