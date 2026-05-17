/**
 * D7:7:1 — Nexora strategic reality engine foundation tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  evaluateStrategicReality,
  freezeStrategicRealitySnapshot,
} from "./nexoraStrategicRealityEngine.ts";
import {
  buildRealityContentFingerprint,
  REALITY_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_REALITY_DISCLAIMER,
  guardEvaluateStrategicReality,
  guardStrategicRealitySemantics,
} from "./strategicRealityGuards.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { buildStrategicRealitySemantics } from "./strategicRealitySemantics.ts";
import {
  deriveStrategicRealitySignals,
  analyzeUnifiedOperationalStates,
  calculateOperationalRealityCoherenceScore,
  classifyExecutiveRealityLabel,
} from "./unifiedOperationalStateModel.ts";
import { analyzeRealityEvolution } from "./realityEvolutionAnalysis.ts";
import { analyzeEnterpriseWorldOrchestration } from "./enterpriseWorldOrchestrationIntelligence.ts";
import {
  buildRealityStack,
  realityInput,
  stableStringify,
} from "./realityStackFixture.ts";


test("deterministic reality orchestration", () => {
  const stack = buildRealityStack();
  const r1 = evaluateStrategicReality({
    ...realityInput(stack),
    realityContext: { realityLeverageFactor: 0.1 },
  });
  const r2 = evaluateStrategicReality({
    ...realityInput(stack),
    realityContext: { realityLeverageFactor: 0.1 },
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
});

test("unified operational-state modeling", () => {
  const stack = buildRealityStack();
  const realities = deriveStrategicRealitySignals({
    cognitiveCompletionState: stack.completion,
    orchestrationState: stack.orchestration,
    operationalUniverseState: realityInput(stack).operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    realityLeverageFactor: 0.1,
  });
  const stateRecords = analyzeUnifiedOperationalStates({
    realitySignals: realities,
    cognitiveCompletionState: stack.completion,
    orchestrationState: stack.orchestration,
    operationalUniverseState: realityInput(stack).operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
  });
  const coherence = calculateOperationalRealityCoherenceScore({
    realitySignals: realities,
    cognitiveCompletionState: stack.completion,
    operationalUniverseState: realityInput(stack).operationalUniverseState,
    orchestrationState: stack.orchestration,
  });
  assert.ok(realities.length > 0);
  assert.ok(stateRecords.length > 0);
  assert.ok(coherence >= 0 && coherence <= 1);
  for (const r of realities) {
    assert.ok(r.realityStrength <= 0.92);
  }
});

test("operational coherence consistency validation", () => {
  const stack = buildRealityStack();
  const input = realityInput(stack);
  const realities = deriveStrategicRealitySignals({
    cognitiveCompletionState: stack.completion,
    orchestrationState: stack.orchestration,
    operationalUniverseState: input.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
  });
  const e1 = analyzeRealityEvolution({
    realitySignals: realities,
    cognitiveCompletionState: stack.completion,
    orchestrationState: stack.orchestration,
    operationalUniverseState: input.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
  });
  const e2 = analyzeRealityEvolution({
    realitySignals: realities,
    cognitiveCompletionState: stack.completion,
    orchestrationState: stack.orchestration,
    operationalUniverseState: input.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
  });
  const stateRecords = analyzeUnifiedOperationalStates({
    realitySignals: realities,
    cognitiveCompletionState: stack.completion,
    orchestrationState: stack.orchestration,
    operationalUniverseState: input.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
  });
  const w1 = analyzeEnterpriseWorldOrchestration({
    realitySignals: realities,
    stateRecords,
    evolutionRecords: e1,
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    divergenceState: stack.divergence,
  });
  const w2 = analyzeEnterpriseWorldOrchestration({
    realitySignals: realities,
    stateRecords,
    evolutionRecords: e2,
    trajectoryState: stack.trajectory,
    momentumState: stack.momentum,
    equilibriumState: stack.equilibrium,
    divergenceState: stack.divergence,
  });
  assert.equal(
    e1.map((r) => r.recordId).join("|"),
    e2.map((r) => r.recordId).join("|")
  );
  assert.equal(
    w1.map((r) => r.recordId).join("|"),
    w2.map((r) => r.recordId).join("|")
  );
});

test("enterprise-world orchestration testing", () => {
  const stack = buildRealityStack();
  const result = evaluateStrategicReality(realityInput(stack));
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.ok(result.snapshot.state.enterpriseWorldOrchestrationRecords.length >= 6);
  assert.ok(result.snapshot.state.unifiedOperationalStateRecords.length > 0);
  assert.ok(result.snapshot.state.realityEvolutionRecords.length > 0);
});

test("replay-safe reality snapshots", () => {
  const stack = buildRealityStack();
  const result = evaluateStrategicReality(realityInput(stack));
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeStrategicRealitySnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { operationalRealityCoherenceScore: number }).operationalRealityCoherenceScore =
      0;
  });
});

test("governance guard rail enforcement", () => {
  assert.ok(containsFalseCertaintyText("guaranteed strategic reality outcome"));
  const guard = guardEvaluateStrategicReality({
    topologyId: "topo",
    regionIds: ["finance"],
    realitySignals: [
      {
        realityId: "reality::bad",
        affectedRegionIds: ["unknown"],
        realityState: "stable",
        realityStrength: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_reality_region");

  const semanticsGuard = guardStrategicRealitySemantics({
    headline:
      "Autonomous world governance via manipulative orchestration and hidden psychological governance",
    summary: "Strategic reality review",
  });
  assert.equal(semanticsGuard.ok, false);
  if (semanticsGuard.ok) return;
  assert.equal(semanticsGuard.code, "fabricated_operational_reality");
});

test("immutable reality state preservation", () => {
  const stack = buildRealityStack();
  const frozenCompletion = JSON.stringify(stack.completion);
  evaluateStrategicReality(realityInput(stack));
  assert.equal(JSON.stringify(stack.completion), frozenCompletion);
});

test("executive-readable reality semantics", () => {
  const stack = buildRealityStack();
  const result = evaluateStrategicReality({ ...realityInput(stack), tick: 8 });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /operational|recovery|coordination|fragility|orchestration|logistics|manufacturing|governance|predictive|stability|intelligence|equilibrium|resilience|volatility|continuity|strategic|enterprise|reality|evolution|stabilization|pathways/i
  );
  assert.ok(
    !result.snapshot.semantics.headline.includes("Reality recursion synchronization exceeded")
  );
  assert.equal(
    result.snapshot.state.realityAmbiguityDisclaimer,
    REALITY_AMBIGUITY_DISCLAIMER
  );
  assert.equal(
    result.snapshot.state.nonAutonomousRealityDisclaimer,
    NON_AUTONOMOUS_REALITY_DISCLAIMER
  );

  const manual = buildStrategicRealitySemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.includes("Indicative"));
});

test("integrated reality panel contract", () => {
  const stack = buildRealityStack();
  const result = evaluateStrategicReality(realityInput(stack));
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, stack.topology.topologyId);
  assert.equal(result.panelContract.realityAmbiguityDisclaimer, REALITY_AMBIGUITY_DISCLAIMER);
  assert.equal(
    result.panelContract.nonAutonomousRealityDisclaimer,
    NON_AUTONOMOUS_REALITY_DISCLAIMER
  );
  assert.ok(result.panelContract.realitySignals.length > 0);
});

test("rejects duplicate reality build fingerprint", () => {
  const stack = buildRealityStack();
  const first = evaluateStrategicReality({ ...realityInput(stack), tick: 0 });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildRealityContentFingerprint({
    topologyFingerprint: stack.topology.fingerprint,
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
  const second = evaluateStrategicReality({
    ...realityInput(stack),
    tick: 0,
    priorRealityFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_reality_build");
});

test("reality classification", () => {
  const label = classifyExecutiveRealityLabel({
    realitySignals: [
      {
        realityId: "r1",
        affectedRegionIds: ["logistics"],
        realityState: "stable",
        realityStrength: 0.6,
      },
    ],
    operationalRealityCoherenceScore: 0.6,
    unifiedOperationalStateScore: 0.6,
    realityInstabilityScore: 0.3,
  });
  assert.equal(label, "stable");
});
