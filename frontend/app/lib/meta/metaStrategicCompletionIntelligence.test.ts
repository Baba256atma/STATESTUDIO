/**
 * D7:8:10 — Meta-strategic intelligence completion tests.
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
import { evaluateUnifiedMetaStrategicIntelligence } from "./unifiedMetaStrategicEngine.ts";
import {
  evaluateMetaStrategicCompletion,
  freezeMetaStrategicCompletionSnapshot,
} from "./metaStrategicCompletionEngine.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { StrategicMetaCausalityIntelligenceState } from "./strategicMetaCausalityTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import type { StrategicIntelligenceResilienceIntelligenceState } from "./strategicIntelligenceResilienceTypes.ts";
import type { StrategicIntelligenceEvolutionIntelligenceState } from "./strategicIntelligenceEvolutionTypes.ts";
import type { StrategicIntelligenceEquilibriumIntelligenceState } from "./strategicIntelligenceEquilibriumTypes.ts";
import type { StrategicIntelligenceContinuityIntelligenceState } from "./strategicIntelligenceContinuityTypes.ts";
import type { UnifiedMetaStrategicIntelligenceState } from "./unifiedMetaStrategicTypes.ts";
import {
  COMPLETION_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_COMPLETION_DISCLAIMER,
  guardEvaluateMetaStrategicCompletion,
  guardMetaStrategicCompletionSemantics,
} from "./metaStrategicCompletionGuards.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { buildMetaStrategicCompletionSemantics } from "./metaStrategicCompletionSemantics.ts";
import {
  deriveMetaStrategicCompletionSignals,
  analyzeEnterpriseCognitionSynchronization,
  calculateEnterpriseMetaCoherenceScore,
  classifyExecutiveCompletionLabel,
} from "./enterpriseCognitionSynchronizationModeling.ts";
import {
  analyzeStrategicWorldCoherence,
  calculateWorldFragmentationScore,
} from "./strategicWorldCoherenceAnalysis.ts";

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

function completionInput(
  stack: ReturnType<typeof buildRealityStack>,
  unifiedMetaStrategicState: UnifiedMetaStrategicIntelligenceState,
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
    unifiedMetaStrategicState,
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

function buildCompletionStack() {
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
  const unified = evaluateUnifiedMetaStrategicIntelligence({
    topology: stack.topology,
    strategicContinuityState: continuity.snapshot.state,
    strategicEquilibriumState: equilibrium.snapshot.state,
    strategicEvolutionState: evolution.snapshot.state,
    strategicResilienceState: resilience.snapshot.state,
    strategicDriftState: drift.snapshot.state,
    metaCausalityState: metaCausality.snapshot.state,
    strategicPatternState: pattern.snapshot.state,
    metaStrategicState: meta.snapshot.state,
    strategicRealityState: reality.snapshot.state,
    operationalUniverseState: realityInput(stack).operationalUniverseState,
    predictiveIntelligenceState: {
      foresightState: stack.foresight,
      trajectoryState: stack.trajectory,
      divergenceState: stack.divergence,
      cascadeState: stack.cascade,
    },
  });
  assert.ok(unified.ok);
  if (!unified.ok) throw new Error("unified meta-strategic failed");
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
    unifiedMetaStrategicState: unified.snapshot.state,
  };
}

test("deterministic completion orchestration", () => {
  const ctx = buildCompletionStack();
  const input = completionInput(
    ctx.stack,
    ctx.unifiedMetaStrategicState,
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
  const c1 = evaluateMetaStrategicCompletion({
    ...input,
    completionContext: { completionLeverageFactor: 0.1 },
  });
  const c2 = evaluateMetaStrategicCompletion({
    ...input,
    completionContext: { completionLeverageFactor: 0.1 },
  });
  assert.ok(c1.ok && c2.ok);
  if (!c1.ok || !c2.ok) return;
  assert.equal(c1.snapshot.fingerprint, c2.snapshot.fingerprint);
});

test("enterprise cognition synchronization modeling", () => {
  const ctx = buildCompletionStack();
  const base = completionInput(
    ctx.stack,
    ctx.unifiedMetaStrategicState,
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
  const signals = deriveMetaStrategicCompletionSignals({
    unifiedMetaStrategicState: ctx.unifiedMetaStrategicState,
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
    completionLeverageFactor: 0.1,
  });
  const syncRecords = analyzeEnterpriseCognitionSynchronization({
    completionSignals: signals,
    unifiedMetaStrategicState: ctx.unifiedMetaStrategicState,
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
  const score = calculateEnterpriseMetaCoherenceScore({
    completionSignals: signals,
    enterpriseCognitionSynchronizationRecords: syncRecords,
    unifiedMetaStrategicState: ctx.unifiedMetaStrategicState,
    strategicContinuityState: ctx.strategicContinuityState,
    strategicEquilibriumState: ctx.strategicEquilibriumState,
    strategicResilienceState: ctx.strategicResilienceState,
    strategicDriftState: ctx.strategicDriftState,
  });
  assert.ok(signals.length > 0);
  assert.equal(syncRecords.length, 6);
  assert.ok(score >= 0 && score <= 1);
  for (const s of signals) assert.ok(s.completionStrength <= 0.92);
});

test("strategic coherence consistency validation", () => {
  const ctx = buildCompletionStack();
  const base = completionInput(
    ctx.stack,
    ctx.unifiedMetaStrategicState,
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
  const signals = deriveMetaStrategicCompletionSignals({
    unifiedMetaStrategicState: ctx.unifiedMetaStrategicState,
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
  const s1 = analyzeEnterpriseCognitionSynchronization({
    completionSignals: signals,
    unifiedMetaStrategicState: ctx.unifiedMetaStrategicState,
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
  const s2 = analyzeEnterpriseCognitionSynchronization({
    completionSignals: signals,
    unifiedMetaStrategicState: ctx.unifiedMetaStrategicState,
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
  const c1 = analyzeStrategicWorldCoherence({
    completionSignals: signals,
    enterpriseCognitionSynchronizationRecords: s1,
    unifiedMetaStrategicState: ctx.unifiedMetaStrategicState,
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
  const c2 = analyzeStrategicWorldCoherence({
    completionSignals: signals,
    enterpriseCognitionSynchronizationRecords: s2,
    unifiedMetaStrategicState: ctx.unifiedMetaStrategicState,
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

test("enterprise cognition completion testing", () => {
  const ctx = buildCompletionStack();
  const result = evaluateMetaStrategicCompletion(
    completionInput(
      ctx.stack,
      ctx.unifiedMetaStrategicState,
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
  assert.equal(result.snapshot.state.enterpriseCognitionSynchronizationRecords.length, 6);
  assert.equal(result.snapshot.state.strategicWorldCoherenceRecords.length, 6);
  assert.equal(result.snapshot.state.enterpriseMetaStrategicCompletionRecords.length, 6);
  assert.ok(result.snapshot.state.activeCompletionSignals.length > 0);
});

test("replay-safe completion snapshots", () => {
  const ctx = buildCompletionStack();
  const result = evaluateMetaStrategicCompletion(
    completionInput(
      ctx.stack,
      ctx.unifiedMetaStrategicState,
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
  const frozen = freezeMetaStrategicCompletionSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { enterpriseMetaCoherenceScore: number }).enterpriseMetaCoherenceScore = 0;
  });
});

test("governance guard rail enforcement", () => {
  assert.ok(containsFalseCertaintyText("guaranteed unified strategic coherence"));
  const guard = guardEvaluateMetaStrategicCompletion({
    topologyId: "topo",
    regionIds: ["finance"],
    completionSignals: [
      {
        completionId: "meta-completion::bad",
        affectedRegionIds: ["unknown"],
        completionState: "coherent",
        completionStrength: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_completion_region");

  const semanticsGuard = guardMetaStrategicCompletionSemantics({
    headline:
      "Autonomous strategic governance via manipulative orchestration and hidden psychological governance",
    summary: "Unified meta review",
  });
  assert.equal(semanticsGuard.ok, false);
  if (semanticsGuard.ok) return;
  assert.equal(semanticsGuard.code, "fabricated_enterprise_cognition");
});

test("immutable completion state preservation", () => {
  const ctx = buildCompletionStack();
  const frozenContinuity = JSON.stringify(ctx.strategicContinuityState);
  evaluateMetaStrategicCompletion(
    completionInput(
      ctx.stack,
      ctx.unifiedMetaStrategicState,
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

test("executive-readable completion semantics", () => {
  const ctx = buildCompletionStack();
  const result = evaluateMetaStrategicCompletion({
    ...completionInput(
      ctx.stack,
      ctx.unifiedMetaStrategicState,
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
  assert.ok(!result.snapshot.semantics.headline.includes("Meta completion recursion exceeded"));
  assert.equal(result.snapshot.state.completionAmbiguityDisclaimer, COMPLETION_AMBIGUITY_DISCLAIMER);
  assert.equal(
    result.snapshot.state.nonAutonomousCompletionDisclaimer,
    NON_AUTONOMOUS_COMPLETION_DISCLAIMER
  );
  const manual = buildMetaStrategicCompletionSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.includes("Indicative"));
});

test("integrated completion panel contract", () => {
  const ctx = buildCompletionStack();
  const result = evaluateMetaStrategicCompletion(
    completionInput(
      ctx.stack,
      ctx.unifiedMetaStrategicState,
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
  assert.equal(result.panelContract.completionAmbiguityDisclaimer, COMPLETION_AMBIGUITY_DISCLAIMER);
  assert.ok(result.panelContract.completionSignals.length > 0);
});

test("rejects duplicate completion build fingerprint", () => {
  const ctx = buildCompletionStack();
  const input = completionInput(
    ctx.stack,
    ctx.unifiedMetaStrategicState,
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
  const first = evaluateMetaStrategicCompletion({ ...input, tick: 0 });
  assert.ok(first.ok);
  if (!first.ok) return;
  const parsed = JSON.parse(String(first.snapshot.fingerprint)) as { content?: string };
  const second = evaluateMetaStrategicCompletion({
    ...input,
    tick: 0,
    priorCompletionFingerprints: [parsed.content ?? ""],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_completion_build");
});

test("completion classification", () => {
  const label = classifyExecutiveCompletionLabel({
    completionSignals: [
      {
        completionId: "u1",
        affectedRegionIds: ["logistics"],
        completionState: "coherent",
        completionStrength: 0.65,
      },
    ],
    enterpriseMetaCoherenceScore: 0.65,
    cognitionSynchronizationScore: 0.55,
    worldFragmentationScore: 0.25,
  });
  assert.equal(label, "coherent");

  const fragmentation = calculateWorldFragmentationScore({
    completionSignals: [
      {
        completionId: "u1",
        affectedRegionIds: ["logistics"],
        completionState: "fragmented",
        completionStrength: 0.6,
      },
    ],
    strategicWorldCoherenceRecords: [],
    unifiedMetaStrategicState: {
      ecosystemFragmentationScore: 0.35,
    } as Parameters<typeof calculateWorldFragmentationScore>[0]["unifiedMetaStrategicState"],
    strategicContinuityState: {
      fragmentationPressureScore: 0.4,
    } as Parameters<typeof calculateWorldFragmentationScore>[0]["strategicContinuityState"],
    strategicDriftState: {
      strategicDriftInstabilityScore: 0.3,
    } as Parameters<typeof calculateWorldFragmentationScore>[0]["strategicDriftState"],
  });
  assert.ok(fragmentation >= 0 && fragmentation <= 1);
});
