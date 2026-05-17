/**
 * D7:8:8 — Strategic intelligence continuity intelligence tests.
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
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { StrategicMetaCausalityIntelligenceState } from "./strategicMetaCausalityTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import type { StrategicIntelligenceResilienceIntelligenceState } from "./strategicIntelligenceResilienceTypes.ts";
import type { StrategicIntelligenceEvolutionIntelligenceState } from "./strategicIntelligenceEvolutionTypes.ts";
import type { StrategicIntelligenceEquilibriumIntelligenceState } from "./strategicIntelligenceEquilibriumTypes.ts";
import {
  evaluateStrategicIntelligenceContinuity,
  freezeStrategicIntelligenceContinuitySnapshot,
} from "./strategicIntelligenceContinuityEngine.ts";
import {
  CONTINUITY_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_CONTINUITY_DISCLAIMER,
  guardEvaluateStrategicIntelligenceContinuity,
  guardStrategicIntelligenceContinuitySemantics,
} from "./strategicIntelligenceContinuityGuards.ts";
import { containsFalseCertaintyText } from "../simulation/predictive/trajectoryGuards.ts";
import { buildStrategicIntelligenceContinuitySemantics } from "./strategicIntelligenceContinuitySemantics.ts";
import {
  deriveStrategicIntelligenceContinuitySignals,
  analyzeLongHorizonContinuity,
  calculateLongHorizonStrategicContinuityScore,
  classifyExecutiveContinuityLabel,
} from "./longHorizonContinuityModeling.ts";
import {
  analyzeContinuityFragmentation,
  calculateFragmentationPressureScore,
} from "./continuityFragmentationAnalysis.ts";

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

function buildContinuityStack() {
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
  };
}

test("deterministic continuity orchestration", () => {
  const ctx = buildContinuityStack();
  const input = continuityInput(
    ctx.stack,
    ctx.strategicEquilibriumState,
    ctx.strategicEvolutionState,
    ctx.strategicResilienceState,
    ctx.strategicDriftState,
    ctx.metaCausalityState,
    ctx.strategicPatternState,
    ctx.metaStrategicState,
    ctx.strategicRealityState
  );
  const c1 = evaluateStrategicIntelligenceContinuity({
    ...input,
    continuityContext: { continuityLeverageFactor: 0.1 },
  });
  const c2 = evaluateStrategicIntelligenceContinuity({
    ...input,
    continuityContext: { continuityLeverageFactor: 0.1 },
  });
  assert.ok(c1.ok && c2.ok);
  if (!c1.ok || !c2.ok) return;
  assert.equal(c1.snapshot.fingerprint, c2.snapshot.fingerprint);
});

test("long-horizon continuity modeling", () => {
  const ctx = buildContinuityStack();
  const base = continuityInput(
    ctx.stack,
    ctx.strategicEquilibriumState,
    ctx.strategicEvolutionState,
    ctx.strategicResilienceState,
    ctx.strategicDriftState,
    ctx.metaCausalityState,
    ctx.strategicPatternState,
    ctx.metaStrategicState,
    ctx.strategicRealityState
  );
  const signals = deriveStrategicIntelligenceContinuitySignals({
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
    continuityLeverageFactor: 0.1,
  });
  const records = analyzeLongHorizonContinuity({
    continuitySignals: signals,
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
  const score = calculateLongHorizonStrategicContinuityScore({
    continuitySignals: signals,
    longHorizonContinuityRecords: records,
    strategicEquilibriumState: ctx.strategicEquilibriumState,
    strategicResilienceState: ctx.strategicResilienceState,
  });
  assert.ok(signals.length > 0);
  assert.equal(records.length, 6);
  assert.ok(score >= 0 && score <= 1);
  for (const s of signals) assert.ok(s.continuityStrength <= 0.92);
});

test("continuity coherence consistency validation", () => {
  const ctx = buildContinuityStack();
  const base = continuityInput(
    ctx.stack,
    ctx.strategicEquilibriumState,
    ctx.strategicEvolutionState,
    ctx.strategicResilienceState,
    ctx.strategicDriftState,
    ctx.metaCausalityState,
    ctx.strategicPatternState,
    ctx.metaStrategicState,
    ctx.strategicRealityState
  );
  const signals = deriveStrategicIntelligenceContinuitySignals({
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
  const h1 = analyzeLongHorizonContinuity({
    continuitySignals: signals,
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
  const h2 = analyzeLongHorizonContinuity({
    continuitySignals: signals,
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
  const f1 = analyzeContinuityFragmentation({
    continuitySignals: signals,
    longHorizonContinuityRecords: h1,
    strategicEquilibriumState: ctx.strategicEquilibriumState,
    strategicEvolutionState: ctx.strategicEvolutionState,
    strategicResilienceState: ctx.strategicResilienceState,
    strategicDriftState: ctx.strategicDriftState,
    strategicPatternState: ctx.strategicPatternState,
    metaStrategicState: ctx.metaStrategicState,
    strategicRealityState: ctx.strategicRealityState,
    operationalUniverseState: base.operationalUniverseState,
  });
  const f2 = analyzeContinuityFragmentation({
    continuitySignals: signals,
    longHorizonContinuityRecords: h2,
    strategicEquilibriumState: ctx.strategicEquilibriumState,
    strategicEvolutionState: ctx.strategicEvolutionState,
    strategicResilienceState: ctx.strategicResilienceState,
    strategicDriftState: ctx.strategicDriftState,
    strategicPatternState: ctx.strategicPatternState,
    metaStrategicState: ctx.metaStrategicState,
    strategicRealityState: ctx.strategicRealityState,
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

test("enterprise continuity testing", () => {
  const ctx = buildContinuityStack();
  const result = evaluateStrategicIntelligenceContinuity(
    continuityInput(
      ctx.stack,
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
  assert.equal(result.snapshot.state.longHorizonContinuityRecords.length, 6);
  assert.equal(result.snapshot.state.continuityFragmentationRecords.length, 6);
  assert.equal(result.snapshot.state.enterpriseMetaStrategicContinuityRecords.length, 6);
  assert.ok(result.snapshot.state.activeContinuitySignals.length > 0);
});

test("replay-safe continuity snapshots", () => {
  const ctx = buildContinuityStack();
  const result = evaluateStrategicIntelligenceContinuity(
    continuityInput(
      ctx.stack,
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
  const frozen = freezeStrategicIntelligenceContinuitySnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { longHorizonStrategicContinuityScore: number }).longHorizonStrategicContinuityScore =
      0;
  });
});

test("governance guard rail enforcement", () => {
  assert.ok(containsFalseCertaintyText("guaranteed strategic continuity outcome"));
  const guard = guardEvaluateStrategicIntelligenceContinuity({
    topologyId: "topo",
    regionIds: ["finance"],
    continuitySignals: [
      {
        continuityId: "continuity::bad",
        affectedRegionIds: ["unknown"],
        continuityState: "stable",
        continuityStrength: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_continuity_region");

  const semanticsGuard = guardStrategicIntelligenceContinuitySemantics({
    headline:
      "Autonomous continuity governance via manipulative orchestration and hidden psychological governance",
    summary: "Continuity review",
  });
  assert.equal(semanticsGuard.ok, false);
  if (semanticsGuard.ok) return;
  assert.equal(semanticsGuard.code, "fabricated_continuity_assumption");
});

test("immutable continuity state preservation", () => {
  const ctx = buildContinuityStack();
  const frozenEquilibrium = JSON.stringify(ctx.strategicEquilibriumState);
  evaluateStrategicIntelligenceContinuity(
    continuityInput(
      ctx.stack,
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
  assert.equal(JSON.stringify(ctx.strategicEquilibriumState), frozenEquilibrium);
});

test("executive-readable continuity semantics", () => {
  const ctx = buildContinuityStack();
  const result = evaluateStrategicIntelligenceContinuity({
    ...continuityInput(
      ctx.stack,
      ctx.strategicEquilibriumState,
      ctx.strategicEvolutionState,
      ctx.strategicResilienceState,
      ctx.strategicDriftState,
      ctx.metaCausalityState,
      ctx.strategicPatternState,
      ctx.metaStrategicState,
      ctx.strategicRealityState
    ),
    tick: 8,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /operational|continuity|resilience|optimization|governance|strategic|enterprise|coherence|volatility|intelligence|adaptive|long-horizon|preservation|fragmentation|survival/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("Strategic continuity recursion exceeded"));
  assert.equal(result.snapshot.state.continuityAmbiguityDisclaimer, CONTINUITY_AMBIGUITY_DISCLAIMER);
  assert.equal(
    result.snapshot.state.nonAutonomousContinuityDisclaimer,
    NON_AUTONOMOUS_CONTINUITY_DISCLAIMER
  );
  const manual = buildStrategicIntelligenceContinuitySemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.includes("Indicative"));
});

test("integrated continuity panel contract", () => {
  const ctx = buildContinuityStack();
  const result = evaluateStrategicIntelligenceContinuity(
    continuityInput(
      ctx.stack,
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
  assert.equal(result.panelContract.continuityAmbiguityDisclaimer, CONTINUITY_AMBIGUITY_DISCLAIMER);
  assert.ok(result.panelContract.continuitySignals.length > 0);
});

test("rejects duplicate continuity build fingerprint", () => {
  const ctx = buildContinuityStack();
  const input = continuityInput(
    ctx.stack,
    ctx.strategicEquilibriumState,
    ctx.strategicEvolutionState,
    ctx.strategicResilienceState,
    ctx.strategicDriftState,
    ctx.metaCausalityState,
    ctx.strategicPatternState,
    ctx.metaStrategicState,
    ctx.strategicRealityState
  );
  const first = evaluateStrategicIntelligenceContinuity({ ...input, tick: 0 });
  assert.ok(first.ok);
  if (!first.ok) return;
  const parsed = JSON.parse(String(first.snapshot.fingerprint)) as { content?: string };
  const contentFp = parsed.content ?? "";
  const second = evaluateStrategicIntelligenceContinuity({
    ...input,
    tick: 0,
    priorContinuityFingerprints: [contentFp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_continuity_build");
});

test("continuity classification", () => {
  const label = classifyExecutiveContinuityLabel({
    continuitySignals: [
      {
        continuityId: "c1",
        affectedRegionIds: ["logistics"],
        continuityState: "stable",
        continuityStrength: 0.65,
      },
    ],
    longHorizonStrategicContinuityScore: 0.65,
    adaptiveContinuityScore: 0.55,
    fragmentationPressureScore: 0.25,
  });
  assert.equal(label, "stable");

  const pressure = calculateFragmentationPressureScore({
    continuitySignals: [
      {
        continuityId: "c1",
        affectedRegionIds: ["logistics"],
        continuityState: "fragmenting",
        continuityStrength: 0.6,
      },
    ],
    continuityFragmentationRecords: [],
    strategicEquilibriumState: {
      equilibriumPressureScore: 0.4,
    } as Parameters<typeof calculateFragmentationPressureScore>[0]["strategicEquilibriumState"],
    strategicResilienceState: {
      recoveryPressureScore: 0.3,
    } as Parameters<typeof calculateFragmentationPressureScore>[0]["strategicResilienceState"],
  });
  assert.ok(pressure >= 0 && pressure <= 1);
});
