/**
 * D7:8:2 — Strategic pattern evolution intelligence tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { buildRealityStack, realityInput } from "../reality/realityStackFixture.ts";
import { evaluateStrategicReality } from "../reality/nexoraStrategicRealityEngine.ts";
import { evaluateMetaStrategicIntelligence } from "./nexoraMetaStrategicEngine.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import {
  evaluateStrategicPatternEvolution,
  freezeStrategicPatternEvolutionSnapshot,
} from "./strategicPatternEvolutionEngine.ts";
import {
  buildPatternContentFingerprint,
  PATTERN_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_PATTERN_DISCLAIMER,
  guardEvaluateStrategicPatternEvolution,
  guardStrategicPatternEvolutionSemantics,
} from "./strategicPatternEvolutionGuards.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { buildStrategicPatternEvolutionSemantics } from "./strategicPatternEvolutionSemantics.ts";
import {
  deriveStrategicPatternEvolutionSignals,
  analyzeLongHorizonPatterns,
  calculateLongHorizonPatternScore,
  classifyExecutivePatternLabel,
} from "./longHorizonPatternModeling.ts";
import {
  analyzeStrategicPatternInstability,
  calculatePatternCoherenceScore,
} from "./strategicPatternInstabilityAnalysis.ts";
import { analyzeEnterprisePatternIntelligence } from "./enterprisePatternIntelligence.ts";

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

function buildPatternStack() {
  const stack = buildRealityStack();
  const reality = evaluateStrategicReality(realityInput(stack));
  assert.ok(reality.ok);
  if (!reality.ok) throw new Error("strategic reality failed");
  const meta = evaluateMetaStrategicIntelligence(metaInput(stack, reality.snapshot.state));
  assert.ok(meta.ok);
  if (!meta.ok) throw new Error("meta-strategic failed");
  return {
    stack,
    strategicRealityState: reality.snapshot.state,
    metaStrategicState: meta.snapshot.state,
  };
}

test("deterministic pattern orchestration", () => {
  const { stack, metaStrategicState, strategicRealityState } = buildPatternStack();
  const p1 = evaluateStrategicPatternEvolution({
    ...patternInput(stack, metaStrategicState, strategicRealityState),
    patternContext: { patternLeverageFactor: 0.1 },
  });
  const p2 = evaluateStrategicPatternEvolution({
    ...patternInput(stack, metaStrategicState, strategicRealityState),
    patternContext: { patternLeverageFactor: 0.1 },
  });
  assert.ok(p1.ok && p2.ok);
  if (!p1.ok || !p2.ok) return;
  assert.equal(p1.snapshot.fingerprint, p2.snapshot.fingerprint);
});

test("long-horizon pattern modeling", () => {
  const { stack, metaStrategicState, strategicRealityState } = buildPatternStack();
  const base = patternInput(stack, metaStrategicState, strategicRealityState);
  const patternSignals = deriveStrategicPatternEvolutionSignals({
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
    patternLeverageFactor: 0.1,
  });
  const longHorizonRecords = analyzeLongHorizonPatterns({
    patternSignals,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
  });
  const longHorizonScore = calculateLongHorizonPatternScore({
    patternSignals,
    longHorizonPatternRecords: longHorizonRecords,
    metaStrategicState,
  });
  assert.ok(patternSignals.length > 0);
  assert.equal(longHorizonRecords.length, 6);
  assert.ok(longHorizonScore >= 0 && longHorizonScore <= 1);
  for (const s of patternSignals) {
    assert.ok(s.patternStrength <= 0.92);
  }
});

test("pattern coherence consistency validation", () => {
  const { stack, metaStrategicState, strategicRealityState } = buildPatternStack();
  const base = patternInput(stack, metaStrategicState, strategicRealityState);
  const patternSignals = deriveStrategicPatternEvolutionSignals({
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
  });
  const h1 = analyzeLongHorizonPatterns({
    patternSignals,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
  });
  const h2 = analyzeLongHorizonPatterns({
    patternSignals,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
    foresightState: stack.foresight,
    divergenceState: stack.divergence,
    trajectoryState: stack.trajectory,
    cascadeState: stack.cascade,
  });
  const i1 = analyzeStrategicPatternInstability({
    patternSignals,
    longHorizonPatternRecords: h1,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
  });
  const i2 = analyzeStrategicPatternInstability({
    patternSignals,
    longHorizonPatternRecords: h2,
    metaStrategicState,
    strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
  });
  assert.equal(
    h1.map((r) => r.recordId).join("|"),
    h2.map((r) => r.recordId).join("|")
  );
  assert.equal(
    i1.map((r) => r.recordId).join("|"),
    i2.map((r) => r.recordId).join("|")
  );
});

test("enterprise pattern testing", () => {
  const { stack, metaStrategicState, strategicRealityState } = buildPatternStack();
  const result = evaluateStrategicPatternEvolution(
    patternInput(stack, metaStrategicState, strategicRealityState)
  );
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.snapshot.state.longHorizonPatternRecords.length, 6);
  assert.equal(result.snapshot.state.patternInstabilityRecords.length, 6);
  assert.equal(result.snapshot.state.enterprisePatternRecords.length, 6);
  assert.ok(result.snapshot.state.activePatternSignals.length > 0);
});

test("replay-safe pattern snapshots", () => {
  const { stack, metaStrategicState, strategicRealityState } = buildPatternStack();
  const result = evaluateStrategicPatternEvolution(
    patternInput(stack, metaStrategicState, strategicRealityState)
  );
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeStrategicPatternEvolutionSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { patternCoherenceScore: number }).patternCoherenceScore = 0;
  });
});

test("governance guard rail enforcement", () => {
  assert.ok(containsFalseCertaintyText("guaranteed strategic pattern outcome"));
  const guard = guardEvaluateStrategicPatternEvolution({
    topologyId: "topo",
    regionIds: ["finance"],
    patternSignals: [
      {
        patternId: "pattern::bad",
        affectedRegionIds: ["unknown"],
        patternState: "emerging",
        patternStrength: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_pattern_region");

  const semanticsGuard = guardStrategicPatternEvolutionSemantics({
    headline:
      "Autonomous strategic adaptation via manipulative orchestration and hidden psychological governance",
    summary: "Pattern review",
  });
  assert.equal(semanticsGuard.ok, false);
  if (semanticsGuard.ok) return;
  assert.equal(semanticsGuard.code, "fabricated_strategic_pattern");
});

test("immutable pattern state preservation", () => {
  const { stack, metaStrategicState, strategicRealityState } = buildPatternStack();
  const frozenMeta = JSON.stringify(metaStrategicState);
  evaluateStrategicPatternEvolution(
    patternInput(stack, metaStrategicState, strategicRealityState)
  );
  assert.equal(JSON.stringify(metaStrategicState), frozenMeta);
});

test("executive-readable pattern semantics", () => {
  const { stack, metaStrategicState, strategicRealityState } = buildPatternStack();
  const result = evaluateStrategicPatternEvolution({
    ...patternInput(stack, metaStrategicState, strategicRealityState),
    tick: 8,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /operational|recovery|coordination|pattern|optimization|resilience|strategic|enterprise|efficiency|governance|evolution|instability|continuity|recurring|fragility|behavior/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("Pattern recursion exceeded"));
  assert.equal(result.snapshot.state.patternAmbiguityDisclaimer, PATTERN_AMBIGUITY_DISCLAIMER);
  assert.equal(
    result.snapshot.state.nonAutonomousPatternDisclaimer,
    NON_AUTONOMOUS_PATTERN_DISCLAIMER
  );

  const manual = buildStrategicPatternEvolutionSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.includes("Indicative"));
});

test("integrated pattern panel contract", () => {
  const { stack, metaStrategicState, strategicRealityState } = buildPatternStack();
  const result = evaluateStrategicPatternEvolution(
    patternInput(stack, metaStrategicState, strategicRealityState)
  );
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, stack.topology.topologyId);
  assert.equal(result.panelContract.patternAmbiguityDisclaimer, PATTERN_AMBIGUITY_DISCLAIMER);
  assert.equal(
    result.panelContract.nonAutonomousPatternDisclaimer,
    NON_AUTONOMOUS_PATTERN_DISCLAIMER
  );
  assert.ok(result.panelContract.patternSignals.length > 0);
});

test("rejects duplicate pattern build fingerprint", () => {
  const { stack, metaStrategicState, strategicRealityState } = buildPatternStack();
  const first = evaluateStrategicPatternEvolution({
    ...patternInput(stack, metaStrategicState, strategicRealityState),
    tick: 0,
  });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildPatternContentFingerprint({
    topologyFingerprint: stack.topology.fingerprint,
    metaFingerprint: stableStringify({
      label: metaStrategicState.executiveMetaLabel,
      coherence: metaStrategicState.strategicMetaCoherenceScore,
      instability: metaStrategicState.metaInstabilityScore,
      evolution: metaStrategicState.strategicEvolutionScore,
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
  const second = evaluateStrategicPatternEvolution({
    ...patternInput(stack, metaStrategicState, strategicRealityState),
    tick: 0,
    priorPatternFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_pattern_build");
});

test("pattern classification", () => {
  const label = classifyExecutivePatternLabel({
    patternSignals: [
      {
        patternId: "p1",
        affectedRegionIds: ["logistics"],
        patternState: "stabilizing",
        patternStrength: 0.6,
      },
    ],
    patternCoherenceScore: 0.6,
    longHorizonPatternScore: 0.6,
    patternInstabilityScore: 0.3,
  });
  assert.equal(label, "stabilizing");

  const coherence = calculatePatternCoherenceScore({
    patternSignals: [
      {
        patternId: "p1",
        affectedRegionIds: ["logistics"],
        patternState: "emerging",
        patternStrength: 0.6,
      },
    ],
    patternInstabilityRecords: [],
    metaStrategicState: {
      strategicMetaCoherenceScore: 0.6,
      metaInstabilityScore: 0.2,
    } as Parameters<typeof calculatePatternCoherenceScore>[0]["metaStrategicState"],
    strategicRealityState: {
      operationalRealityCoherenceScore: 0.6,
    } as Parameters<typeof calculatePatternCoherenceScore>[0]["strategicRealityState"],
  });
  assert.ok(coherence >= 0 && coherence <= 1);
});
