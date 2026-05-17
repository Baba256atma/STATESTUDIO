/**
 * D7:8:4 — Strategic intelligence drift intelligence tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { buildRealityStack, realityInput } from "../reality/realityStackFixture.ts";
import { evaluateStrategicReality } from "../reality/nexoraStrategicRealityEngine.ts";
import { evaluateMetaStrategicIntelligence } from "./nexoraMetaStrategicEngine.ts";
import { evaluateStrategicPatternEvolution } from "./strategicPatternEvolutionEngine.ts";
import { evaluateStrategicMetaCausality } from "./strategicMetaCausalityEngine.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { StrategicMetaCausalityIntelligenceState } from "./strategicMetaCausalityTypes.ts";
import {
  evaluateStrategicIntelligenceDrift,
  freezeStrategicIntelligenceDriftSnapshot,
} from "./strategicIntelligenceDriftEngine.ts";
import {
  buildDriftContentFingerprint,
  DRIFT_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_DRIFT_DISCLAIMER,
  guardEvaluateStrategicIntelligenceDrift,
  guardStrategicIntelligenceDriftSemantics,
} from "./strategicIntelligenceDriftGuards.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { buildStrategicIntelligenceDriftSemantics } from "./strategicIntelligenceDriftSemantics.ts";
import {
  deriveStrategicIntelligenceDriftSignals,
  analyzeLongHorizonIntelligenceDrift,
  calculateLongHorizonDriftScore,
  classifyExecutiveDriftLabel,
} from "./longHorizonIntelligenceDriftModeling.ts";
import {
  analyzeStrategicCoherenceDegradation,
  calculateStrategicIntelligenceCoherenceScore,
} from "./strategicCoherenceDegradationAnalysis.ts";
import { analyzeEnterpriseStrategicDriftIntelligence } from "./enterpriseStrategicDriftIntelligence.ts";

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

function buildDriftStack() {
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
  return {
    stack,
    strategicRealityState: reality.snapshot.state,
    metaStrategicState: meta.snapshot.state,
    strategicPatternState: pattern.snapshot.state,
    metaCausalityState: metaCausality.snapshot.state,
  };
}

test("deterministic drift orchestration", () => {
  const {
    stack,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildDriftStack();
  const d1 = evaluateStrategicIntelligenceDrift({
    ...driftInput(
      stack,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    ),
    driftContext: { driftLeverageFactor: 0.1 },
  });
  const d2 = evaluateStrategicIntelligenceDrift({
    ...driftInput(
      stack,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    ),
    driftContext: { driftLeverageFactor: 0.1 },
  });
  assert.ok(d1.ok && d2.ok);
  if (!d1.ok || !d2.ok) return;
  assert.equal(d1.snapshot.fingerprint, d2.snapshot.fingerprint);
});

test("long-horizon drift modeling", () => {
  const {
    stack,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildDriftStack();
  const base = driftInput(
    stack,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState
  );
  const signals = deriveStrategicIntelligenceDriftSignals({
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    driftLeverageFactor: 0.1,
  });
  const driftRecords = analyzeLongHorizonIntelligenceDrift({
    driftSignals: signals,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
  });
  const driftScore = calculateLongHorizonDriftScore({
    driftSignals: signals,
    longHorizonIntelligenceDriftRecords: driftRecords,
    metaCausalityState,
  });
  assert.ok(signals.length > 0);
  assert.equal(driftRecords.length, 6);
  assert.ok(driftScore >= 0 && driftScore <= 1);
  for (const s of signals) {
    assert.ok(s.driftStrength <= 0.92);
  }
});

test("strategic coherence consistency validation", () => {
  const {
    stack,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildDriftStack();
  const base = driftInput(
    stack,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState
  );
  const signals = deriveStrategicIntelligenceDriftSignals({
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
  });
  const h1 = analyzeLongHorizonIntelligenceDrift({
    driftSignals: signals,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
  });
  const h2 = analyzeLongHorizonIntelligenceDrift({
    driftSignals: signals,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
  });
  const deg1 = analyzeStrategicCoherenceDegradation({
    driftSignals: signals,
    longHorizonIntelligenceDriftRecords: h1,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
  });
  const deg2 = analyzeStrategicCoherenceDegradation({
    driftSignals: signals,
    longHorizonIntelligenceDriftRecords: h2,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
  });
  assert.equal(
    h1.map((r) => r.recordId).join("|"),
    h2.map((r) => r.recordId).join("|")
  );
  assert.equal(
    deg1.map((r) => r.recordId).join("|"),
    deg2.map((r) => r.recordId).join("|")
  );
});

test("enterprise strategic drift testing", () => {
  const {
    stack,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildDriftStack();
  const result = evaluateStrategicIntelligenceDrift(
    driftInput(
      stack,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    )
  );
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.snapshot.state.longHorizonIntelligenceDriftRecords.length, 6);
  assert.equal(result.snapshot.state.strategicCoherenceDegradationRecords.length, 6);
  assert.equal(result.snapshot.state.enterpriseStrategicDriftRecords.length, 6);
  assert.ok(result.snapshot.state.activeDriftSignals.length > 0);
});

test("replay-safe drift snapshots", () => {
  const {
    stack,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildDriftStack();
  const result = evaluateStrategicIntelligenceDrift(
    driftInput(
      stack,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    )
  );
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeStrategicIntelligenceDriftSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { strategicIntelligenceCoherenceScore: number }).strategicIntelligenceCoherenceScore =
      0;
  });
});

test("governance guard rail enforcement", () => {
  assert.ok(containsFalseCertaintyText("guaranteed strategic drift outcome"));
  const guard = guardEvaluateStrategicIntelligenceDrift({
    topologyId: "topo",
    regionIds: ["finance"],
    driftSignals: [
      {
        driftId: "drift::bad",
        affectedRegionIds: ["unknown"],
        driftState: "stable",
        driftStrength: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_drift_region");

  const semanticsGuard = guardStrategicIntelligenceDriftSemantics({
    headline:
      "Autonomous strategic correction via manipulative orchestration and hidden psychological governance",
    summary: "Drift review",
  });
  assert.equal(semanticsGuard.ok, false);
  if (semanticsGuard.ok) return;
  assert.equal(semanticsGuard.code, "fabricated_strategic_drift");
});

test("immutable drift state preservation", () => {
  const {
    stack,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildDriftStack();
  const frozenMetaCausality = JSON.stringify(metaCausalityState);
  evaluateStrategicIntelligenceDrift(
    driftInput(
      stack,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    )
  );
  assert.equal(JSON.stringify(metaCausalityState), frozenMetaCausality);
});

test("executive-readable drift semantics", () => {
  const {
    stack,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildDriftStack();
  const result = evaluateStrategicIntelligenceDrift({
    ...driftInput(
      stack,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    ),
    tick: 8,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /operational|recovery|coordination|drift|optimization|resilience|strategic|enterprise|coherence|governance|intelligence|instability|redundancy|degradation|long-horizon/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("Strategic drift recursion exceeded"));
  assert.equal(result.snapshot.state.driftAmbiguityDisclaimer, DRIFT_AMBIGUITY_DISCLAIMER);
  assert.equal(
    result.snapshot.state.nonAutonomousDriftDisclaimer,
    NON_AUTONOMOUS_DRIFT_DISCLAIMER
  );

  const manual = buildStrategicIntelligenceDriftSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.includes("Indicative"));
});

test("integrated drift panel contract", () => {
  const {
    stack,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildDriftStack();
  const result = evaluateStrategicIntelligenceDrift(
    driftInput(
      stack,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    )
  );
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, stack.topology.topologyId);
  assert.equal(result.panelContract.driftAmbiguityDisclaimer, DRIFT_AMBIGUITY_DISCLAIMER);
  assert.equal(result.panelContract.nonAutonomousDriftDisclaimer, NON_AUTONOMOUS_DRIFT_DISCLAIMER);
  assert.ok(result.panelContract.driftSignals.length > 0);
});

test("rejects duplicate drift build fingerprint", () => {
  const {
    stack,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildDriftStack();
  const first = evaluateStrategicIntelligenceDrift({
    ...driftInput(
      stack,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    ),
    tick: 0,
  });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildDriftContentFingerprint({
    topologyFingerprint: stack.topology.fingerprint,
    metaCausalityFingerprint: stableStringify({
      label: metaCausalityState.executiveMetaCausalityLabel,
      coherence: metaCausalityState.metaCausalityCoherenceScore,
      instability: metaCausalityState.metaCausalityInstabilityScore,
    }),
    patternFingerprint: stableStringify({
      label: strategicPatternState.executivePatternLabel,
      coherence: strategicPatternState.patternCoherenceScore,
      instability: strategicPatternState.patternInstabilityScore,
    }),
    metaFingerprint: stableStringify({
      label: metaStrategicState.executiveMetaLabel,
      coherence: metaStrategicState.strategicMetaCoherenceScore,
      instability: metaStrategicState.metaInstabilityScore,
    }),
    realityFingerprint: stableStringify({
      label: strategicRealityState.executiveRealityLabel,
      coherence: strategicRealityState.operationalRealityCoherenceScore,
      instability: strategicRealityState.realityInstabilityScore,
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
  const second = evaluateStrategicIntelligenceDrift({
    ...driftInput(
      stack,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    ),
    tick: 0,
    priorDriftFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_drift_build");
});

test("drift classification", () => {
  const label = classifyExecutiveDriftLabel({
    driftSignals: [
      {
        driftId: "d1",
        affectedRegionIds: ["logistics"],
        driftState: "stable",
        driftStrength: 0.3,
      },
    ],
    strategicIntelligenceCoherenceScore: 0.65,
    longHorizonDriftScore: 0.3,
    strategicDriftInstabilityScore: 0.25,
  });
  assert.equal(label, "stable");

  const coherence = calculateStrategicIntelligenceCoherenceScore({
    driftSignals: [
      {
        driftId: "d1",
        affectedRegionIds: ["logistics"],
        driftState: "emerging",
        driftStrength: 0.4,
      },
    ],
    strategicCoherenceDegradationRecords: [],
    metaCausalityState: {
      metaCausalityCoherenceScore: 0.6,
      metaCausalityInstabilityScore: 0.2,
    } as Parameters<typeof calculateStrategicIntelligenceCoherenceScore>[0]["metaCausalityState"],
    metaStrategicState: {
      strategicMetaCoherenceScore: 0.6,
    } as Parameters<typeof calculateStrategicIntelligenceCoherenceScore>[0]["metaStrategicState"],
    strategicPatternState: {
      patternCoherenceScore: 0.6,
    } as Parameters<typeof calculateStrategicIntelligenceCoherenceScore>[0]["strategicPatternState"],
    strategicRealityState: {
      operationalRealityCoherenceScore: 0.6,
    } as Parameters<typeof calculateStrategicIntelligenceCoherenceScore>[0]["strategicRealityState"],
  });
  assert.ok(coherence >= 0 && coherence <= 1);
});
