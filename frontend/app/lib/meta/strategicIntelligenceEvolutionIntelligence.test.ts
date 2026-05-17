/**
 * D7:8:6 — Strategic intelligence evolution intelligence tests.
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
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { StrategicMetaCausalityIntelligenceState } from "./strategicMetaCausalityTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import type { StrategicIntelligenceResilienceIntelligenceState } from "./strategicIntelligenceResilienceTypes.ts";
import {
  evaluateStrategicIntelligenceEvolution,
  freezeStrategicIntelligenceEvolutionSnapshot,
} from "./strategicIntelligenceEvolutionEngine.ts";
import {
  buildEvolutionContentFingerprint,
  EVOLUTION_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_EVOLUTION_DISCLAIMER,
  guardEvaluateStrategicIntelligenceEvolution,
  guardStrategicIntelligenceEvolutionSemantics,
} from "./strategicIntelligenceEvolutionGuards.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { buildStrategicIntelligenceEvolutionSemantics } from "./strategicIntelligenceEvolutionSemantics.ts";
import {
  deriveStrategicIntelligenceEvolutionSignals,
  analyzeLongHorizonEvolution,
  calculateStrategicEvolutionCoherenceScore,
  classifyExecutiveEvolutionLabel,
} from "./longHorizonEvolutionModeling.ts";
import {
  analyzeStrategicTransformation,
  calculateTransformationPressureScore,
} from "./strategicTransformationAnalysis.ts";
import { analyzeEnterpriseMetaStrategicEvolutionIntelligence } from "./enterpriseMetaStrategicEvolutionIntelligence.ts";

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

function buildEvolutionStack() {
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
  return {
    stack,
    strategicRealityState: reality.snapshot.state,
    metaStrategicState: meta.snapshot.state,
    strategicPatternState: pattern.snapshot.state,
    metaCausalityState: metaCausality.snapshot.state,
    strategicDriftState: drift.snapshot.state,
    strategicResilienceState: resilience.snapshot.state,
  };
}

test("deterministic evolution orchestration", () => {
  const {
    stack,
    strategicResilienceState,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildEvolutionStack();
  const e1 = evaluateStrategicIntelligenceEvolution({
    ...evolutionInput(
      stack,
      strategicResilienceState,
      strategicDriftState,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    ),
    evolutionContext: { evolutionLeverageFactor: 0.1 },
  });
  const e2 = evaluateStrategicIntelligenceEvolution({
    ...evolutionInput(
      stack,
      strategicResilienceState,
      strategicDriftState,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    ),
    evolutionContext: { evolutionLeverageFactor: 0.1 },
  });
  assert.ok(e1.ok && e2.ok);
  if (!e1.ok || !e2.ok) return;
  assert.equal(e1.snapshot.fingerprint, e2.snapshot.fingerprint);
});

test("long-horizon evolution modeling", () => {
  const {
    stack,
    strategicResilienceState,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildEvolutionStack();
  const base = evolutionInput(
    stack,
    strategicResilienceState,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState
  );
  const signals = deriveStrategicIntelligenceEvolutionSignals({
    strategicResilienceState,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    evolutionLeverageFactor: 0.1,
  });
  const evolutionRecords = analyzeLongHorizonEvolution({
    evolutionSignals: signals,
    strategicResilienceState,
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
  const coherenceScore = calculateStrategicEvolutionCoherenceScore({
    evolutionSignals: signals,
    longHorizonEvolutionRecords: evolutionRecords,
    strategicResilienceState,
    metaStrategicState,
  });
  assert.ok(signals.length > 0);
  assert.equal(evolutionRecords.length, 6);
  assert.ok(coherenceScore >= 0 && coherenceScore <= 1);
  for (const s of signals) {
    assert.ok(s.evolutionStrength <= 0.92);
  }
});

test("evolution coherence consistency validation", () => {
  const {
    stack,
    strategicResilienceState,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildEvolutionStack();
  const base = evolutionInput(
    stack,
    strategicResilienceState,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState
  );
  const signals = deriveStrategicIntelligenceEvolutionSignals({
    strategicResilienceState,
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
  const h1 = analyzeLongHorizonEvolution({
    evolutionSignals: signals,
    strategicResilienceState,
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
  const h2 = analyzeLongHorizonEvolution({
    evolutionSignals: signals,
    strategicResilienceState,
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
  const tr1 = analyzeStrategicTransformation({
    evolutionSignals: signals,
    longHorizonEvolutionRecords: h1,
    strategicResilienceState,
    strategicDriftState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
  });
  const tr2 = analyzeStrategicTransformation({
    evolutionSignals: signals,
    longHorizonEvolutionRecords: h2,
    strategicResilienceState,
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
    tr1.map((r) => r.recordId).join("|"),
    tr2.map((r) => r.recordId).join("|")
  );
});

test("enterprise strategic evolution testing", () => {
  const {
    stack,
    strategicResilienceState,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildEvolutionStack();
  const result = evaluateStrategicIntelligenceEvolution(
    evolutionInput(
      stack,
      strategicResilienceState,
      strategicDriftState,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    )
  );
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.snapshot.state.longHorizonEvolutionRecords.length, 6);
  assert.equal(result.snapshot.state.strategicTransformationRecords.length, 6);
  assert.equal(result.snapshot.state.enterpriseMetaStrategicEvolutionRecords.length, 6);
  assert.ok(result.snapshot.state.activeEvolutionSignals.length > 0);
});

test("replay-safe evolution snapshots", () => {
  const {
    stack,
    strategicResilienceState,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildEvolutionStack();
  const result = evaluateStrategicIntelligenceEvolution(
    evolutionInput(
      stack,
      strategicResilienceState,
      strategicDriftState,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    )
  );
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeStrategicIntelligenceEvolutionSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { strategicEvolutionCoherenceScore: number }).strategicEvolutionCoherenceScore =
      0;
  });
});

test("governance guard rail enforcement", () => {
  assert.ok(containsFalseCertaintyText("guaranteed strategic evolution outcome"));
  const guard = guardEvaluateStrategicIntelligenceEvolution({
    topologyId: "topo",
    regionIds: ["finance"],
    evolutionSignals: [
      {
        evolutionId: "evolution::bad",
        affectedRegionIds: ["unknown"],
        evolutionState: "stable",
        evolutionStrength: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_evolution_region");

  const semanticsGuard = guardStrategicIntelligenceEvolutionSemantics({
    headline:
      "Autonomous strategic evolution via manipulative orchestration and hidden psychological governance",
    summary: "Evolution review",
  });
  assert.equal(semanticsGuard.ok, false);
  if (semanticsGuard.ok) return;
  assert.equal(semanticsGuard.code, "fabricated_evolution_trajectory");
});

test("immutable evolution state preservation", () => {
  const {
    stack,
    strategicResilienceState,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildEvolutionStack();
  const frozenResilience = JSON.stringify(strategicResilienceState);
  evaluateStrategicIntelligenceEvolution(
    evolutionInput(
      stack,
      strategicResilienceState,
      strategicDriftState,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    )
  );
  assert.equal(JSON.stringify(strategicResilienceState), frozenResilience);
});

test("executive-readable evolution semantics", () => {
  const {
    stack,
    strategicResilienceState,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildEvolutionStack();
  const result = evaluateStrategicIntelligenceEvolution({
    ...evolutionInput(
      stack,
      strategicResilienceState,
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
    /operational|evolution|transformation|resilience|optimization|governance|strategic|enterprise|coherence|continuity|pressure|volatility|intelligence|adaptive|long-horizon|maturity|pathway/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("Strategic evolution recursion exceeded"));
  assert.equal(result.snapshot.state.evolutionAmbiguityDisclaimer, EVOLUTION_AMBIGUITY_DISCLAIMER);
  assert.equal(
    result.snapshot.state.nonAutonomousEvolutionDisclaimer,
    NON_AUTONOMOUS_EVOLUTION_DISCLAIMER
  );

  const manual = buildStrategicIntelligenceEvolutionSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.includes("Indicative"));
});

test("integrated evolution panel contract", () => {
  const {
    stack,
    strategicResilienceState,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildEvolutionStack();
  const result = evaluateStrategicIntelligenceEvolution(
    evolutionInput(
      stack,
      strategicResilienceState,
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
  assert.equal(result.panelContract.evolutionAmbiguityDisclaimer, EVOLUTION_AMBIGUITY_DISCLAIMER);
  assert.equal(
    result.panelContract.nonAutonomousEvolutionDisclaimer,
    NON_AUTONOMOUS_EVOLUTION_DISCLAIMER
  );
  assert.ok(result.panelContract.evolutionSignals.length > 0);
});

test("rejects duplicate evolution build fingerprint", () => {
  const {
    stack,
    strategicResilienceState,
    strategicDriftState,
    metaCausalityState,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
  } = buildEvolutionStack();
  const first = evaluateStrategicIntelligenceEvolution({
    ...evolutionInput(
      stack,
      strategicResilienceState,
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
  const fp = buildEvolutionContentFingerprint({
    topologyFingerprint: stack.topology.fingerprint,
    resilienceFingerprint: stableStringify({
      label: strategicResilienceState.executiveResilienceLabel,
      capacity: strategicResilienceState.strategicResilienceCapacityScore,
      recovery: strategicResilienceState.recoveryPressureScore,
    }),
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
  const second = evaluateStrategicIntelligenceEvolution({
    ...evolutionInput(
      stack,
      strategicResilienceState,
      strategicDriftState,
      metaCausalityState,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    ),
    tick: 0,
    priorEvolutionFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_evolution_build");
});

test("evolution classification", () => {
  const label = classifyExecutiveEvolutionLabel({
    evolutionSignals: [
      {
        evolutionId: "e1",
        affectedRegionIds: ["logistics"],
        evolutionState: "stable",
        evolutionStrength: 0.65,
      },
    ],
    strategicEvolutionCoherenceScore: 0.65,
    adaptiveTransformationScore: 0.55,
    transformationPressureScore: 0.25,
  });
  assert.equal(label, "stable");

  const pressure = calculateTransformationPressureScore({
    evolutionSignals: [
      {
        evolutionId: "e1",
        affectedRegionIds: ["logistics"],
        evolutionState: "transforming",
        evolutionStrength: 0.6,
      },
    ],
    strategicTransformationRecords: [],
    strategicDriftState: {
      strategicDriftInstabilityScore: 0.5,
      longHorizonDriftScore: 0.4,
    } as Parameters<typeof calculateTransformationPressureScore>[0]["strategicDriftState"],
    strategicResilienceState: {
      recoveryPressureScore: 0.3,
    } as Parameters<typeof calculateTransformationPressureScore>[0]["strategicResilienceState"],
  });
  assert.ok(pressure >= 0 && pressure <= 1);
});
