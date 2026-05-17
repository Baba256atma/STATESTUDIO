/**
 * D7:8:1 — Nexora meta-strategic intelligence foundation tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  buildRealityStack,
  realityInput,
} from "../reality/realityStackFixture.ts";
import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import { evaluateStrategicReality } from "../reality/nexoraStrategicRealityEngine.ts";
import {
  evaluateMetaStrategicIntelligence,
  freezeMetaStrategicSnapshot,
} from "./nexoraMetaStrategicEngine.ts";
import {
  buildMetaContentFingerprint,
  META_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_META_DISCLAIMER,
  guardEvaluateMetaStrategicIntelligence,
  guardMetaStrategicSemantics,
} from "./metaStrategicGuards.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { buildMetaStrategicSemantics } from "./metaStrategicSemantics.ts";
import {
  deriveMetaStrategicSignals,
  analyzeStrategicEvolution,
  calculateStrategicEvolutionScore,
  classifyExecutiveMetaLabel,
} from "./strategicEvolutionModeling.ts";
import {
  analyzeMetaCoherence,
  calculateStrategicMetaCoherenceScore,
} from "./metaCoherenceAnalysis.ts";
import { analyzeEnterpriseStrategyIntelligence } from "./enterpriseStrategyIntelligence.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

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

function buildMetaStack() {
  const stack = buildRealityStack();
  const reality = evaluateStrategicReality(realityInput(stack));
  assert.ok(reality.ok);
  if (!reality.ok) throw new Error("strategic reality failed");
  return { stack, strategicRealityState: reality.snapshot.state };
}

test("deterministic meta orchestration", () => {
  const { stack, strategicRealityState } = buildMetaStack();
  const m1 = evaluateMetaStrategicIntelligence({
    ...metaInput(stack, strategicRealityState),
    metaContext: { metaLeverageFactor: 0.1 },
  });
  const m2 = evaluateMetaStrategicIntelligence({
    ...metaInput(stack, strategicRealityState),
    metaContext: { metaLeverageFactor: 0.1 },
  });
  assert.ok(m1.ok && m2.ok);
  if (!m1.ok || !m2.ok) return;
  assert.equal(m1.snapshot.fingerprint, m2.snapshot.fingerprint);
});

test("strategic-evolution modeling", () => {
  const { stack, strategicRealityState } = buildMetaStack();
  const base = metaInput(stack, strategicRealityState);
  const metaSignals = deriveMetaStrategicSignals({
    strategicRealityState,
    cognitiveCompletionState: stack.completion,
    executiveOrchestrationState: stack.orchestration,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    metaLeverageFactor: 0.1,
  });
  const evolutionRecords = analyzeStrategicEvolution({
    metaSignals,
    strategicRealityState,
    cognitiveCompletionState: stack.completion,
    executiveOrchestrationState: stack.orchestration,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
  });
  const evolutionScore = calculateStrategicEvolutionScore({
    metaSignals,
    strategicEvolutionRecords: evolutionRecords,
    strategicRealityState,
  });
  assert.ok(metaSignals.length > 0);
  assert.equal(evolutionRecords.length, 6);
  assert.ok(evolutionScore >= 0 && evolutionScore <= 1);
  for (const s of metaSignals) {
    assert.ok(s.metaStrength <= 0.92);
  }
});

test("meta coherence consistency validation", () => {
  const { stack, strategicRealityState } = buildMetaStack();
  const base = metaInput(stack, strategicRealityState);
  const metaSignals = deriveMetaStrategicSignals({
    strategicRealityState,
    cognitiveCompletionState: stack.completion,
    executiveOrchestrationState: stack.orchestration,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
  });
  const e1 = analyzeStrategicEvolution({
    metaSignals,
    strategicRealityState,
    cognitiveCompletionState: stack.completion,
    executiveOrchestrationState: stack.orchestration,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
  });
  const e2 = analyzeStrategicEvolution({
    metaSignals,
    strategicRealityState,
    cognitiveCompletionState: stack.completion,
    executiveOrchestrationState: stack.orchestration,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
  });
  const c1 = analyzeMetaCoherence({
    metaSignals,
    strategicEvolutionRecords: e1,
    strategicRealityState,
    cognitiveCompletionState: stack.completion,
    executiveOrchestrationState: stack.orchestration,
    operationalUniverseState: base.operationalUniverseState,
  });
  const c2 = analyzeMetaCoherence({
    metaSignals,
    strategicEvolutionRecords: e2,
    strategicRealityState,
    cognitiveCompletionState: stack.completion,
    executiveOrchestrationState: stack.orchestration,
    operationalUniverseState: base.operationalUniverseState,
  });
  assert.equal(
    e1.map((r) => r.recordId).join("|"),
    e2.map((r) => r.recordId).join("|")
  );
  assert.equal(
    c1.map((r) => r.recordId).join("|"),
    c2.map((r) => r.recordId).join("|")
  );
});

test("enterprise strategy intelligence testing", () => {
  const { stack, strategicRealityState } = buildMetaStack();
  const result = evaluateMetaStrategicIntelligence(metaInput(stack, strategicRealityState));
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.snapshot.state.strategicEvolutionRecords.length, 6);
  assert.equal(result.snapshot.state.metaCoherenceRecords.length, 6);
  assert.equal(result.snapshot.state.enterpriseStrategyRecords.length, 6);
  assert.ok(result.snapshot.state.activeMetaSignals.length > 0);
});

test("replay-safe meta snapshots", () => {
  const { stack, strategicRealityState } = buildMetaStack();
  const result = evaluateMetaStrategicIntelligence(metaInput(stack, strategicRealityState));
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeMetaStrategicSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { strategicMetaCoherenceScore: number }).strategicMetaCoherenceScore = 0;
  });
});

test("governance guard rail enforcement", () => {
  assert.ok(containsFalseCertaintyText("guaranteed meta-strategic outcome"));
  const guard = guardEvaluateMetaStrategicIntelligence({
    topologyId: "topo",
    regionIds: ["finance"],
    metaSignals: [
      {
        metaId: "meta::bad",
        affectedRegionIds: ["unknown"],
        metaState: "stable",
        metaStrength: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_meta_region");

  const semanticsGuard = guardMetaStrategicSemantics({
    headline:
      "Autonomous strategic governance via manipulative orchestration and hidden psychological governance",
    summary: "Meta-strategic review",
  });
  assert.equal(semanticsGuard.ok, false);
  if (semanticsGuard.ok) return;
  assert.equal(semanticsGuard.code, "fabricated_meta_conclusion");
});

test("immutable meta state preservation", () => {
  const { stack, strategicRealityState } = buildMetaStack();
  const frozenCompletion = JSON.stringify(stack.completion);
  evaluateMetaStrategicIntelligence(metaInput(stack, strategicRealityState));
  assert.equal(JSON.stringify(stack.completion), frozenCompletion);
});

test("executive-readable meta semantics", () => {
  const { stack, strategicRealityState } = buildMetaStack();
  const result = evaluateMetaStrategicIntelligence({
    ...metaInput(stack, strategicRealityState),
    tick: 8,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /operational|recovery|coordination|strategy|optimization|resilience|meta|strategic|enterprise|efficiency|governance|evolution|instability|transformation|coherence/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("Meta recursion exceeded"));
  assert.equal(result.snapshot.state.metaAmbiguityDisclaimer, META_AMBIGUITY_DISCLAIMER);
  assert.equal(
    result.snapshot.state.nonAutonomousMetaDisclaimer,
    NON_AUTONOMOUS_META_DISCLAIMER
  );

  const manual = buildMetaStrategicSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.includes("Indicative"));
});

test("integrated meta panel contract", () => {
  const { stack, strategicRealityState } = buildMetaStack();
  const result = evaluateMetaStrategicIntelligence(metaInput(stack, strategicRealityState));
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, stack.topology.topologyId);
  assert.equal(result.panelContract.metaAmbiguityDisclaimer, META_AMBIGUITY_DISCLAIMER);
  assert.equal(
    result.panelContract.nonAutonomousMetaDisclaimer,
    NON_AUTONOMOUS_META_DISCLAIMER
  );
  assert.ok(result.panelContract.metaSignals.length > 0);
});

test("rejects duplicate meta build fingerprint", () => {
  const { stack, strategicRealityState } = buildMetaStack();
  const first = evaluateMetaStrategicIntelligence({
    ...metaInput(stack, strategicRealityState),
    tick: 0,
  });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildMetaContentFingerprint({
    topologyFingerprint: stack.topology.fingerprint,
    realityFingerprint: stableStringify({
      label: strategicRealityState.executiveRealityLabel,
      coherence: strategicRealityState.operationalRealityCoherenceScore,
      instability: strategicRealityState.realityInstabilityScore,
    }),
    completionFingerprint: stableStringify({
      label: stack.completion.executiveCompletionLabel,
      coherence: stack.completion.overallCognitiveCoherenceScore,
    }),
    orchestrationFingerprint: stableStringify({
      label: stack.orchestration.executiveOrchestrationLabel,
      coherence: stack.orchestration.orchestrationCoherenceScore,
    }),
    momentumFingerprint: stableStringify({
      momentum: stack.momentum.organizationalMomentumScore,
      recovery: stack.momentum.recoveryMomentumScore,
    }),
    equilibriumFingerprint: stableStringify({
      score: stack.equilibrium.equilibriumScore,
    }),
    resilienceFingerprint: stableStringify({
      score: stack.resilience.enterpriseResilienceScore,
    }),
    governanceFingerprint: stableStringify({
      label: stack.governance.executiveGovernanceLabel,
      stability: stack.governance.governanceStabilityScore,
    }),
    foresightFingerprint: stableStringify({
      label: stack.foresight.predictiveForesightLabel,
      preparedness: stack.foresight.strategicPreparednessScore,
    }),
    trajectoryFingerprint: stableStringify({
      stability: stack.trajectory.futureStabilityScore,
      volatility: stack.trajectory.trajectoryVolatilityScore,
    }),
    divergenceFingerprint: stableStringify({
      fragmentation: stack.divergence.futureFragmentationScore,
    }),
    tick: 0,
  });
  const second = evaluateMetaStrategicIntelligence({
    ...metaInput(stack, strategicRealityState),
    tick: 0,
    priorMetaFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_meta_build");
});

test("meta classification", () => {
  const label = classifyExecutiveMetaLabel({
    metaSignals: [
      {
        metaId: "m1",
        affectedRegionIds: ["logistics"],
        metaState: "stable",
        metaStrength: 0.6,
      },
    ],
    strategicMetaCoherenceScore: 0.6,
    strategicEvolutionScore: 0.6,
    metaInstabilityScore: 0.3,
  });
  assert.equal(label, "stable");

  const coherence = calculateStrategicMetaCoherenceScore({
    metaSignals: [
      {
        metaId: "m1",
        affectedRegionIds: ["logistics"],
        metaState: "stable",
        metaStrength: 0.6,
      },
    ],
    metaCoherenceRecords: [],
    strategicRealityState: {
      operationalRealityCoherenceScore: 0.6,
      realityInstabilityScore: 0.2,
    } as Parameters<typeof calculateStrategicMetaCoherenceScore>[0]["strategicRealityState"],
    executiveOrchestrationState: {
      orchestrationCoherenceScore: 0.6,
    } as Parameters<typeof calculateStrategicMetaCoherenceScore>[0]["executiveOrchestrationState"],
  });
  assert.ok(coherence >= 0 && coherence <= 1);
});
