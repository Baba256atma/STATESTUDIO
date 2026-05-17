/**
 * D7:8:5 — Strategic intelligence resilience intelligence tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { buildRealityStack, realityInput } from "../reality/realityStackFixture.ts";
import { evaluateStrategicReality } from "../reality/nexoraStrategicRealityEngine.ts";
import { evaluateMetaStrategicIntelligence } from "./nexoraMetaStrategicEngine.ts";
import { evaluateStrategicPatternEvolution } from "./strategicPatternEvolutionEngine.ts";
import { evaluateStrategicMetaCausality } from "./strategicMetaCausalityEngine.ts";
import { evaluateStrategicIntelligenceDrift } from "./strategicIntelligenceDriftEngine.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { StrategicMetaCausalityIntelligenceState } from "./strategicMetaCausalityTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import {
  evaluateStrategicIntelligenceResilience,
  freezeStrategicIntelligenceResilienceSnapshot,
} from "./strategicIntelligenceResilienceEngine.ts";
import {
  buildResilienceContentFingerprint,
  RESILIENCE_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_RESILIENCE_DISCLAIMER,
  guardEvaluateStrategicIntelligenceResilience,
  guardStrategicIntelligenceResilienceSemantics,
} from "./strategicIntelligenceResilienceGuards.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { buildStrategicIntelligenceResilienceSemantics } from "./strategicIntelligenceResilienceSemantics.ts";
import {
  deriveStrategicIntelligenceResilienceSignals,
  analyzeLongHorizonResilience,
  calculateStrategicResilienceCapacityScore,
  classifyExecutiveResilienceLabel,
} from "./longHorizonResilienceModeling.ts";
import {
  analyzeStrategicRecovery,
  calculateRecoveryPressureScore,
} from "./strategicRecoveryAnalysis.ts";
import { analyzeEnterpriseMetaStrategicResilienceIntelligence } from "./enterpriseMetaStrategicResilienceIntelligence.ts";

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

function buildResilienceStack() {
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
  return {
    stack,
    strategicRealityState: reality.snapshot.state,
    metaStrategicState: meta.snapshot.state,
    strategicPatternState: pattern.snapshot.state,
    metaCausalityState: metaCausality.snapshot.state,
    strategicDriftState: drift.snapshot.state,
  };
}

test("deterministic resilience orchestration", () => {
  const {
    stack,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildResilienceStack();
  const r1 = evaluateStrategicIntelligenceResilience({
    ...resilienceInput(
      stack,
      strategicDriftState,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    ),
    resilienceContext: { resilienceLeverageFactor: 0.1 },
  });
  const r2 = evaluateStrategicIntelligenceResilience({
    ...resilienceInput(
      stack,
      strategicDriftState,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    ),
    resilienceContext: { resilienceLeverageFactor: 0.1 },
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
});

test("long-horizon resilience modeling", () => {
  const {
    stack,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildResilienceStack();
  const base = resilienceInput(
    stack,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState
  );
  const signals = deriveStrategicIntelligenceResilienceSignals({
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    resilienceLeverageFactor: 0.1,
  });
  const resilienceRecords = analyzeLongHorizonResilience({
    resilienceSignals: signals,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
  });
  const capacityScore = calculateStrategicResilienceCapacityScore({
    resilienceSignals: signals,
    longHorizonResilienceRecords: resilienceRecords,
    strategicDriftState,
    operationalUniverseState: base.operationalUniverseState,
  });
  assert.ok(signals.length > 0);
  assert.equal(resilienceRecords.length, 6);
  assert.ok(capacityScore >= 0 && capacityScore <= 1);
  for (const s of signals) {
    assert.ok(s.resilienceStrength <= 0.92);
  }
});

test("resilience coherence consistency validation", () => {
  const {
    stack,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildResilienceStack();
  const base = resilienceInput(
    stack,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState
  );
  const signals = deriveStrategicIntelligenceResilienceSignals({
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
  });
  const h1 = analyzeLongHorizonResilience({
    resilienceSignals: signals,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
  });
  const h2 = analyzeLongHorizonResilience({
    resilienceSignals: signals,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
  });
  const rec1 = analyzeStrategicRecovery({
    resilienceSignals: signals,
    longHorizonResilienceRecords: h1,
    strategicDriftState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
  });
  const rec2 = analyzeStrategicRecovery({
    resilienceSignals: signals,
    longHorizonResilienceRecords: h2,
    strategicDriftState,
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
    rec1.map((r) => r.recordId).join("|"),
    rec2.map((r) => r.recordId).join("|")
  );
});

test("enterprise resilience testing", () => {
  const {
    stack,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildResilienceStack();
  const result = evaluateStrategicIntelligenceResilience(
    resilienceInput(
      stack,
      strategicDriftState,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    )
  );
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.snapshot.state.longHorizonResilienceRecords.length, 6);
  assert.equal(result.snapshot.state.strategicRecoveryRecords.length, 6);
  assert.equal(result.snapshot.state.enterpriseMetaStrategicResilienceRecords.length, 6);
  assert.ok(result.snapshot.state.activeResilienceSignals.length > 0);
});

test("replay-safe resilience snapshots", () => {
  const {
    stack,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildResilienceStack();
  const result = evaluateStrategicIntelligenceResilience(
    resilienceInput(
      stack,
      strategicDriftState,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    )
  );
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeStrategicIntelligenceResilienceSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { strategicResilienceCapacityScore: number }).strategicResilienceCapacityScore =
      0;
  });
});

test("governance guard rail enforcement", () => {
  assert.ok(containsFalseCertaintyText("guaranteed strategic resilience outcome"));
  const guard = guardEvaluateStrategicIntelligenceResilience({
    topologyId: "topo",
    regionIds: ["finance"],
    resilienceSignals: [
      {
        resilienceId: "resilience::bad",
        affectedRegionIds: ["unknown"],
        resilienceState: "stable",
        resilienceStrength: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_resilience_region");

  const semanticsGuard = guardStrategicIntelligenceResilienceSemantics({
    headline:
      "Autonomous strategic adaptation via manipulative orchestration and hidden psychological governance",
    summary: "Resilience review",
  });
  assert.equal(semanticsGuard.ok, false);
  if (semanticsGuard.ok) return;
  assert.equal(semanticsGuard.code, "fabricated_resilience_capacity");
});

test("immutable resilience state preservation", () => {
  const {
    stack,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildResilienceStack();
  const frozenDrift = JSON.stringify(strategicDriftState);
  evaluateStrategicIntelligenceResilience(
    resilienceInput(
      stack,
      strategicDriftState,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    )
  );
  assert.equal(JSON.stringify(strategicDriftState), frozenDrift);
});

test("executive-readable resilience semantics", () => {
  const {
    stack,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildResilienceStack();
  const result = evaluateStrategicIntelligenceResilience({
    ...resilienceInput(
      stack,
      strategicDriftState,
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
    /operational|recovery|coordination|resilience|optimization|governance|strategic|enterprise|coherence|continuity|pressure|volatility|fatigue|intelligence|adaptive|long-horizon/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("Strategic resilience recursion exceeded"));
  assert.equal(result.snapshot.state.resilienceAmbiguityDisclaimer, RESILIENCE_AMBIGUITY_DISCLAIMER);
  assert.equal(
    result.snapshot.state.nonAutonomousResilienceDisclaimer,
    NON_AUTONOMOUS_RESILIENCE_DISCLAIMER
  );

  const manual = buildStrategicIntelligenceResilienceSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.includes("Indicative"));
});

test("integrated resilience panel contract", () => {
  const {
    stack,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildResilienceStack();
  const result = evaluateStrategicIntelligenceResilience(
    resilienceInput(
      stack,
      strategicDriftState,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    )
  );
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, stack.topology.topologyId);
  assert.equal(result.panelContract.resilienceAmbiguityDisclaimer, RESILIENCE_AMBIGUITY_DISCLAIMER);
  assert.equal(
    result.panelContract.nonAutonomousResilienceDisclaimer,
    NON_AUTONOMOUS_RESILIENCE_DISCLAIMER
  );
  assert.ok(result.panelContract.resilienceSignals.length > 0);
});

test("rejects duplicate resilience build fingerprint", () => {
  const {
    stack,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildResilienceStack();
  const first = evaluateStrategicIntelligenceResilience({
    ...resilienceInput(
      stack,
      strategicDriftState,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    ),
    tick: 0,
  });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildResilienceContentFingerprint({
    topologyFingerprint: stack.topology.fingerprint,
    driftFingerprint: stableStringify({
      label: strategicDriftState.executiveDriftLabel,
      coherence: strategicDriftState.strategicIntelligenceCoherenceScore,
      instability: strategicDriftState.strategicDriftInstabilityScore,
      drift: strategicDriftState.longHorizonDriftScore,
    }),
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
  const second = evaluateStrategicIntelligenceResilience({
    ...resilienceInput(
      stack,
      strategicDriftState,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    ),
    tick: 0,
    priorResilienceFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_resilience_build");
});

test("resilience classification", () => {
  const label = classifyExecutiveResilienceLabel({
    resilienceSignals: [
      {
        resilienceId: "r1",
        affectedRegionIds: ["logistics"],
        resilienceState: "stable",
        resilienceStrength: 0.65,
      },
    ],
    strategicResilienceCapacityScore: 0.65,
    adaptiveRecoveryScore: 0.55,
    recoveryPressureScore: 0.25,
  });
  assert.equal(label, "stable");

  const pressure = calculateRecoveryPressureScore({
    resilienceSignals: [
      {
        resilienceId: "r1",
        affectedRegionIds: ["logistics"],
        resilienceState: "strained",
        resilienceStrength: 0.6,
      },
    ],
    strategicRecoveryRecords: [],
    strategicDriftState: {
      strategicDriftInstabilityScore: 0.5,
      longHorizonDriftScore: 0.4,
    } as Parameters<typeof calculateRecoveryPressureScore>[0]["strategicDriftState"],
  });
  assert.ok(pressure >= 0 && pressure <= 1);
});
