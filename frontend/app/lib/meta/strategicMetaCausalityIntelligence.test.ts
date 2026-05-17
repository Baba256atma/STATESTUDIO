/**
 * D7:8:3 — Strategic meta-causality intelligence tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { buildRealityStack, realityInput } from "../reality/realityStackFixture.ts";
import { evaluateStrategicReality } from "../reality/nexoraStrategicRealityEngine.ts";
import { evaluateMetaStrategicIntelligence } from "./nexoraMetaStrategicEngine.ts";
import { evaluateStrategicPatternEvolution } from "./strategicPatternEvolutionEngine.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import {
  evaluateStrategicMetaCausality,
  freezeStrategicMetaCausalitySnapshot,
} from "./strategicMetaCausalityEngine.ts";
import {
  buildMetaCausalityContentFingerprint,
  META_CAUSALITY_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_META_CAUSALITY_DISCLAIMER,
  guardEvaluateStrategicMetaCausality,
  guardStrategicMetaCausalitySemantics,
} from "./strategicMetaCausalityGuards.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { buildStrategicMetaCausalitySemantics } from "./strategicMetaCausalitySemantics.ts";
import {
  deriveStrategicMetaCausalitySignals,
  analyzeLongHorizonCausalStructures,
  calculateLongHorizonCausalScore,
  classifyExecutiveMetaCausalityLabel,
} from "./longHorizonCausalModeling.ts";
import {
  analyzeStrategicForcePropagation,
  calculateMetaCausalityCoherenceScore,
} from "./strategicForcePropagationAnalysis.ts";
import { analyzeEnterpriseMetaCausalityIntelligence } from "./enterpriseMetaCausalityIntelligence.ts";

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

function buildMetaCausalityStack() {
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
  return {
    stack,
    strategicRealityState: reality.snapshot.state,
    metaStrategicState: meta.snapshot.state,
    strategicPatternState: pattern.snapshot.state,
  };
}

test("deterministic meta-causality orchestration", () => {
  const { stack, strategicPatternState, metaStrategicState, strategicRealityState } =
    buildMetaCausalityStack();
  const c1 = evaluateStrategicMetaCausality({
    ...metaCausalityInput(
      stack,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    ),
    metaCausalityContext: { causalityLeverageFactor: 0.1 },
  });
  const c2 = evaluateStrategicMetaCausality({
    ...metaCausalityInput(
      stack,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    ),
    metaCausalityContext: { causalityLeverageFactor: 0.1 },
  });
  assert.ok(c1.ok && c2.ok);
  if (!c1.ok || !c2.ok) return;
  assert.equal(c1.snapshot.fingerprint, c2.snapshot.fingerprint);
});

test("long-horizon causal modeling", () => {
  const { stack, strategicPatternState, metaStrategicState, strategicRealityState } =
    buildMetaCausalityStack();
  const base = metaCausalityInput(
    stack,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState
  );
  const signals = deriveStrategicMetaCausalitySignals({
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    causalityLeverageFactor: 0.1,
  });
  const causalRecords = analyzeLongHorizonCausalStructures({
    metaCausalitySignals: signals,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
  });
  const causalScore = calculateLongHorizonCausalScore({
    metaCausalitySignals: signals,
    longHorizonCausalRecords: causalRecords,
    strategicPatternState,
  });
  assert.ok(signals.length > 0);
  assert.equal(causalRecords.length, 6);
  assert.ok(causalScore >= 0 && causalScore <= 1);
  for (const s of signals) {
    assert.ok(s.metaCausalityStrength <= 0.92);
  }
});

test("causal coherence consistency validation", () => {
  const { stack, strategicPatternState, metaStrategicState, strategicRealityState } =
    buildMetaCausalityStack();
  const base = metaCausalityInput(
    stack,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState
  );
  const signals = deriveStrategicMetaCausalitySignals({
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
  });
  const h1 = analyzeLongHorizonCausalStructures({
    metaCausalitySignals: signals,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
  });
  const h2 = analyzeLongHorizonCausalStructures({
    metaCausalitySignals: signals,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
  });
  const f1 = analyzeStrategicForcePropagation({
    metaCausalitySignals: signals,
    longHorizonCausalRecords: h1,
    strategicPatternState,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
  });
  const f2 = analyzeStrategicForcePropagation({
    metaCausalitySignals: signals,
    longHorizonCausalRecords: h2,
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
    f1.map((r) => r.recordId).join("|"),
    f2.map((r) => r.recordId).join("|")
  );
});

test("enterprise meta-causality testing", () => {
  const { stack, strategicPatternState, metaStrategicState, strategicRealityState } =
    buildMetaCausalityStack();
  const result = evaluateStrategicMetaCausality(
    metaCausalityInput(stack, strategicPatternState, metaStrategicState, strategicRealityState)
  );
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.snapshot.state.longHorizonCausalRecords.length, 6);
  assert.equal(result.snapshot.state.strategicForcePropagationRecords.length, 6);
  assert.equal(result.snapshot.state.enterpriseMetaCausalityRecords.length, 6);
  assert.ok(result.snapshot.state.activeMetaCausalitySignals.length > 0);
});

test("replay-safe meta-causality snapshots", () => {
  const { stack, strategicPatternState, metaStrategicState, strategicRealityState } =
    buildMetaCausalityStack();
  const result = evaluateStrategicMetaCausality(
    metaCausalityInput(stack, strategicPatternState, metaStrategicState, strategicRealityState)
  );
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeStrategicMetaCausalitySnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { metaCausalityCoherenceScore: number }).metaCausalityCoherenceScore = 0;
  });
});

test("governance guard rail enforcement", () => {
  assert.ok(containsFalseCertaintyText("guaranteed meta-causality outcome"));
  const guard = guardEvaluateStrategicMetaCausality({
    topologyId: "topo",
    regionIds: ["finance"],
    metaCausalitySignals: [
      {
        metaCausalityId: "meta-causality::bad",
        affectedRegionIds: ["unknown"],
        metaCausalityState: "localized",
        metaCausalityStrength: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_meta_causality_region");

  const semanticsGuard = guardStrategicMetaCausalitySemantics({
    headline:
      "Autonomous strategic redesign via manipulative orchestration and hidden psychological governance",
    summary: "Meta-causality review",
  });
  assert.equal(semanticsGuard.ok, false);
  if (semanticsGuard.ok) return;
  assert.equal(semanticsGuard.code, "fabricated_strategic_causality");
});

test("immutable meta-causality state preservation", () => {
  const { stack, strategicPatternState, metaStrategicState, strategicRealityState } =
    buildMetaCausalityStack();
  const frozenPattern = JSON.stringify(strategicPatternState);
  evaluateStrategicMetaCausality(
    metaCausalityInput(stack, strategicPatternState, metaStrategicState, strategicRealityState)
  );
  assert.equal(JSON.stringify(strategicPatternState), frozenPattern);
});

test("executive-readable meta-causality semantics", () => {
  const { stack, strategicPatternState, metaStrategicState, strategicRealityState } =
    buildMetaCausalityStack();
  const result = evaluateStrategicMetaCausality({
    ...metaCausalityInput(
      stack,
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
    /operational|recovery|coordination|causal|optimization|resilience|strategic|enterprise|instability|dependency|propagation|force|governance|evolution|pattern|pressure|redundancy|concentration/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("Meta-causality recursion exceeded"));
  assert.equal(
    result.snapshot.state.metaCausalityAmbiguityDisclaimer,
    META_CAUSALITY_AMBIGUITY_DISCLAIMER
  );
  assert.equal(
    result.snapshot.state.nonAutonomousMetaCausalityDisclaimer,
    NON_AUTONOMOUS_META_CAUSALITY_DISCLAIMER
  );

  const manual = buildStrategicMetaCausalitySemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.includes("Indicative"));
});

test("integrated meta-causality panel contract", () => {
  const { stack, strategicPatternState, metaStrategicState, strategicRealityState } =
    buildMetaCausalityStack();
  const result = evaluateStrategicMetaCausality(
    metaCausalityInput(stack, strategicPatternState, metaStrategicState, strategicRealityState)
  );
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, stack.topology.topologyId);
  assert.equal(
    result.panelContract.metaCausalityAmbiguityDisclaimer,
    META_CAUSALITY_AMBIGUITY_DISCLAIMER
  );
  assert.equal(
    result.panelContract.nonAutonomousMetaCausalityDisclaimer,
    NON_AUTONOMOUS_META_CAUSALITY_DISCLAIMER
  );
  assert.ok(result.panelContract.metaCausalitySignals.length > 0);
});

test("rejects duplicate meta-causality build fingerprint", () => {
  const { stack, strategicPatternState, metaStrategicState, strategicRealityState } =
    buildMetaCausalityStack();
  const first = evaluateStrategicMetaCausality({
    ...metaCausalityInput(
      stack,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    ),
    tick: 0,
  });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildMetaCausalityContentFingerprint({
    topologyFingerprint: stack.topology.fingerprint,
    patternFingerprint: stableStringify({
      label: strategicPatternState.executivePatternLabel,
      coherence: strategicPatternState.patternCoherenceScore,
      instability: strategicPatternState.patternInstabilityScore,
      evolution: strategicPatternState.longHorizonPatternScore,
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
  const second = evaluateStrategicMetaCausality({
    ...metaCausalityInput(
      stack,
      strategicPatternState,
      metaStrategicState,
      strategicRealityState
    ),
    tick: 0,
    priorMetaCausalityFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_meta_causality_build");
});

test("meta-causality classification", () => {
  const label = classifyExecutiveMetaCausalityLabel({
    metaCausalitySignals: [
      {
        metaCausalityId: "mc1",
        affectedRegionIds: ["logistics"],
        metaCausalityState: "propagating",
        metaCausalityStrength: 0.6,
      },
    ],
    metaCausalityCoherenceScore: 0.6,
    longHorizonCausalScore: 0.6,
    metaCausalityInstabilityScore: 0.3,
  });
  assert.equal(label, "propagating");

  const coherence = calculateMetaCausalityCoherenceScore({
    metaCausalitySignals: [
      {
        metaCausalityId: "mc1",
        affectedRegionIds: ["logistics"],
        metaCausalityState: "localized",
        metaCausalityStrength: 0.6,
      },
    ],
    strategicForcePropagationRecords: [],
    strategicPatternState: {
      patternCoherenceScore: 0.6,
      patternInstabilityScore: 0.2,
    } as Parameters<typeof calculateMetaCausalityCoherenceScore>[0]["strategicPatternState"],
    metaStrategicState: {
      strategicMetaCoherenceScore: 0.6,
    } as Parameters<typeof calculateMetaCausalityCoherenceScore>[0]["metaStrategicState"],
    strategicRealityState: {
      operationalRealityCoherenceScore: 0.6,
    } as Parameters<typeof calculateMetaCausalityCoherenceScore>[0]["strategicRealityState"],
  });
  assert.ok(coherence >= 0 && coherence <= 1);
});
