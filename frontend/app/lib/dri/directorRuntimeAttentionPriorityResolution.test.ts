import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createDirectorRuntimeAttentionSignal,
  createDirectorRuntimeAttentionSignalBatch,
  type DirectorRuntimeAttentionSignal,
} from "./directorRuntimeAttentionSignalContracts.ts";

import {
  DIRECTOR_RUNTIME_ATTENTION_COMPARISON_ORDER as comparisonOrder,
  DIRECTOR_RUNTIME_ATTENTION_DECISION_DIMENSIONS as decisionDimensions,
  DIRECTOR_RUNTIME_ATTENTION_INTENT_PRECEDENCE as intentPrecedence,
  DIRECTOR_RUNTIME_ATTENTION_PRIORITY_RESOLUTION_ABSENT_CAPABILITIES as absentCapabilities,
  DIRECTOR_RUNTIME_ATTENTION_PRIORITY_RESOLUTION_CAPABILITIES as capabilities,
  DIRECTOR_RUNTIME_ATTENTION_REASON_PRECEDENCE as reasonPrecedence,
  DIRECTOR_RUNTIME_ATTENTION_REQUESTED_LEVEL_PRECEDENCE as levelPrecedence,
  DIRECTOR_RUNTIME_ATTENTION_SOURCE_PRECEDENCE as sourcePrecedence,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_RESOLUTION_OUTCOME as emptyOutcome,
  compareDirectorRuntimeAttentionSignals,
  deriveDirectorRuntimeAttentionPriorityVector,
  directorRuntimeAttentionPriorityResolution as layer,
  directorRuntimeAttentionPriorityResolutionCanonicalIdentity as canonicalIdentity,
  directorRuntimeAttentionPriorityResolutionPolicy as policy,
  directorRuntimeAttentionPriorityResolutionRegistry as registry,
  explainDirectorRuntimeAttentionSignalComparison,
  resolveDirectorRuntimeAttentionForSubject,
  resolveDirectorRuntimeAttentionPriority,
  validateDirectorRuntimeAttentionResolutionOutcome,
  validateDirectorRuntimeAttentionPriorityVector,
  validateDirectorRuntimeResolvedAttentionAssignment,
  verifyDirectorRuntimeAttentionPriorityResolution,
} from "./directorRuntimeAttentionPriorityResolution.ts";

const source = readFileSync(
  new URL("./directorRuntimeAttentionPriorityResolution.ts", import.meta.url),
  "utf8",
);

const production = Object.freeze({
  subjectId: "Production",
  subjectKind: "object" as const,
});

const shipping = Object.freeze({
  subjectId: "Shipping",
  subjectKind: "object" as const,
});

function makeSignal(
  overrides: Partial<DirectorRuntimeAttentionSignal> = {},
): DirectorRuntimeAttentionSignal {
  return createDirectorRuntimeAttentionSignal({
    signalId: "sig-base",
    subject: production,
    source: "user-interaction",
    reason: "explicit-selection",
    scope: "subject",
    requestedLevel: "primary",
    persistence: "transient",
    intent: "request-focus",
    ...overrides,
  });
}

function resolveBatch(signals: readonly DirectorRuntimeAttentionSignal[]) {
  return resolveDirectorRuntimeAttentionPriority(
    createDirectorRuntimeAttentionSignalBatch({ signals }),
  );
}

test("1. exact identity", () => {
  assert.equal(layer.identity, "DRI-6:3/DirectorRuntimeAttentionPriorityResolution");
  assert.equal(layer.phase, "DRI-6:3");
  assert.equal(layer.name, "DirectorRuntimeAttentionPriorityResolution");
  assert.equal(layer.role, "AttentionPriorityResolution");
  assert.equal(layer.status, "PriorityResolutionReady");
});

test("2. exact version", () => {
  assert.equal(layer.version, "6.3.0");
  assert.equal(canonicalIdentity.version, "6.3.0");
  assert.equal(registry.version, "6.3.0");
});

test("3. exact namespace", () => {
  assert.equal(
    layer.namespace,
    "nexora.dri.attention-focus.priority-resolution",
  );
  assert.equal(canonicalIdentity.namespace, layer.namespace);
});

test("4. sole immediate dependency = DRI-6:2", () => {
  assert.equal(
    layer.upstreamDependency,
    "DRI-6:2/DirectorRuntimeAttentionSignalContracts",
  );
  assert.equal(registry.dependency, layer.upstreamDependency);
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(
    [...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeAttentionSignalContracts"],
  );
  assert.equal(
    imports.every((entry) =>
      entry === "@/app/lib/dri/directorRuntimeAttentionSignalContracts"),
    true,
  );
  assert.equal(
    source.includes("directorRuntimeAttentionFocusFoundation"),
    false,
  );
  assert.equal(
    source.includes("directorRuntimeAdaptivePresentation"),
    false,
  );
});

test("5. canonical source precedence", () => {
  assert.deepEqual([...sourcePrecedence], [
    "user-interaction",
    "execution",
    "decision",
    "problem",
    "kpi",
    "koi",
    "goal",
    "scenario",
    "advisor",
    "runtime-state",
    "system",
  ]);
  assert.equal(registry.sourcePrecedenceCount, 11);
});

test("6. canonical reason precedence", () => {
  assert.deepEqual([...reasonPrecedence], [
    "critical-state",
    "risk",
    "warning",
    "explicit-selection",
    "execution-relevance",
    "decision-relevance",
    "goal-relevance",
    "scenario-relevance",
    "advisor-relevance",
    "dependency",
    "context-relevance",
    "system-relevance",
  ]);
  assert.equal(registry.reasonPrecedenceCount, 12);
  assert.equal(reasonPrecedence[0], "critical-state");
});

test("7. requested-level precedence", () => {
  assert.deepEqual([...levelPrecedence], [
    "primary",
    "secondary",
    "context",
    "background",
    "suppressed",
  ]);
  assert.equal(registry.requestedLevelPrecedenceCount, 5);
});

test("8. intent precedence", () => {
  assert.deepEqual([...intentPrecedence], [
    "request-focus",
    "request-support",
    "request-context",
    "request-awareness",
    "request-suppression",
  ]);
  assert.equal(registry.intentPrecedenceCount, 5);
});

test("9. decision-dimension registry", () => {
  assert.deepEqual([...decisionDimensions], [
    "reason",
    "source",
    "requested-level",
    "intent",
    "persistence",
    "stable-order",
    "suppression-rule",
    "same-subject-aggregation",
  ]);
  assert.equal(registry.decisionDimensionCount, 8);
  assert.deepEqual([...comparisonOrder], [
    "reason",
    "source",
    "requested-level",
    "intent",
    "persistence",
    "stable-order",
  ]);
});

test("10. policy registry immutability", () => {
  assert.equal(Object.isFrozen(layer), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(policy), true);
  assert.equal(Object.isFrozen(sourcePrecedence), true);
  assert.equal(Object.isFrozen(reasonPrecedence), true);
  assert.equal(policy.comparisonModel, "lexicographic-not-weighted");
});

test("11. capability registry", () => {
  assert.deepEqual([...capabilities], [
    "PriorityVectorDerivation",
    "SignalComparison",
    "StableOrdering",
    "SubjectResolution",
    "BatchResolution",
    "PrimarySelection",
    "SecondaryRetention",
    "SuppressionResolution",
    "SameSubjectAggregation",
    "ResolutionExplanation",
  ]);
  assert.deepEqual([...absentCapabilities], [
    "FocusContextBinding",
    "SceneBinding",
    "AttentionPathOrchestration",
    "TransitionOrchestration",
    "PresentationBehavior",
  ]);
});

test("12. empty batch resolution", () => {
  const result = resolveBatch([]);
  assert.equal(result.ok, true);
  assert.deepEqual(result.outcome, emptyOutcome);
  assert.equal(result.outcome?.primary, null);
  assert.deepEqual(result.outcome?.assignments, []);
});

test("13. single-signal resolution", () => {
  const signal = makeSignal({ signalId: "sig-single" });
  const result = resolveBatch([signal]);
  assert.equal(result.ok, true);
  assert.equal(result.outcome?.primary?.subject.subjectId, "Production");
  assert.equal(result.outcome?.primary?.resolvedLevel, "primary");
  assert.equal(result.outcome?.primary?.winningSignalId, "sig-single");
});

test("14. one primary maximum", () => {
  const result = resolveBatch([
    makeSignal({ signalId: "a", subject: production }),
    makeSignal({
      signalId: "b",
      subject: shipping,
      source: "kpi",
      reason: "critical-state",
    }),
  ]);
  assert.equal(result.ok, true);
  const primaries = result.outcome!.assignments.filter(
    (entry) => entry.resolvedLevel === "primary",
  );
  assert.equal(primaries.length, 1);
  assert.equal(result.outcome!.primary?.subject.subjectId, "Shipping");
});

test("15. deterministic repeated resolution", () => {
  const batch = createDirectorRuntimeAttentionSignalBatch({
    signals: [
      makeSignal({ signalId: "a", subject: production }),
      makeSignal({
        signalId: "b",
        subject: shipping,
        source: "kpi",
        reason: "critical-state",
      }),
    ],
  });
  const first = resolveDirectorRuntimeAttentionPriority(batch);
  const second = resolveDirectorRuntimeAttentionPriority(batch);
  assert.deepEqual(first, second);
});

test("16. stable equal-priority ordering", () => {
  const a = makeSignal({ signalId: "eq-a" });
  const b = makeSignal({ signalId: "eq-b" });
  const c = makeSignal({ signalId: "eq-c" });
  assert.ok(compareDirectorRuntimeAttentionSignals(a, b, 0, 1) < 0);
  assert.ok(compareDirectorRuntimeAttentionSignals(b, c, 1, 2) < 0);
  const result = resolveBatch([a, b, c]);
  assert.equal(result.outcome?.primary?.winningSignalId, "eq-a");
});

test("17. priority-vector derivation", () => {
  const vector = deriveDirectorRuntimeAttentionPriorityVector(
    makeSignal({
      source: "kpi",
      reason: "critical-state",
      requestedLevel: "primary",
      intent: "request-focus",
      persistence: "transient",
    }),
  );
  assert.equal(vector.reasonRank, 0);
  assert.equal(vector.sourceRank, sourcePrecedence.indexOf("kpi"));
  assert.equal(vector.requestedLevelRank, 0);
  assert.equal(vector.intentRank, 0);
  assert.equal(Object.isFrozen(vector), true);
  assert.equal(validateDirectorRuntimeAttentionPriorityVector(vector).ok, true);
});

test("18. pairwise source-precedence resolution", () => {
  const user = makeSignal({
    signalId: "src-user",
    source: "user-interaction",
    reason: "context-relevance",
  });
  const advisor = makeSignal({
    signalId: "src-advisor",
    source: "advisor",
    reason: "context-relevance",
  });
  const explanation = explainDirectorRuntimeAttentionSignalComparison(user, advisor);
  assert.equal(explanation.decisiveDimension, "source");
  assert.equal(explanation.winnerSignalId, "src-user");
});

test("19. pairwise reason-precedence resolution", () => {
  const critical = makeSignal({
    signalId: "rsn-critical",
    source: "kpi",
    reason: "critical-state",
  });
  const explicit = makeSignal({
    signalId: "rsn-explicit",
    source: "user-interaction",
    reason: "explicit-selection",
  });
  const explanation = explainDirectorRuntimeAttentionSignalComparison(
    explicit,
    critical,
  );
  assert.equal(explanation.decisiveDimension, "reason");
  assert.equal(explanation.winnerSignalId, "rsn-critical");
  assert.equal(explanation.winnerValue, "critical-state");
  assert.equal(explanation.loserValue, "explicit-selection");
});

test("20. requested-level tiebreak", () => {
  const primary = makeSignal({
    signalId: "lvl-primary",
    requestedLevel: "primary",
    source: "system",
    reason: "system-relevance",
  });
  const secondary = makeSignal({
    signalId: "lvl-secondary",
    requestedLevel: "secondary",
    source: "system",
    reason: "system-relevance",
  });
  const explanation = explainDirectorRuntimeAttentionSignalComparison(
    secondary,
    primary,
  );
  assert.equal(explanation.decisiveDimension, "requested-level");
  assert.equal(explanation.winnerSignalId, "lvl-primary");
});

test("21. intent tiebreak", () => {
  const focus = makeSignal({
    signalId: "int-focus",
    intent: "request-focus",
    source: "system",
    reason: "system-relevance",
  });
  const awareness = makeSignal({
    signalId: "int-aware",
    intent: "request-awareness",
    source: "system",
    reason: "system-relevance",
  });
  const explanation = explainDirectorRuntimeAttentionSignalComparison(
    awareness,
    focus,
  );
  assert.equal(explanation.decisiveDimension, "intent");
  assert.equal(explanation.winnerSignalId, "int-focus");
});

test("22. persistence not overriding CriticalState", () => {
  const transientCritical = makeSignal({
    signalId: "pers-critical",
    source: "kpi",
    reason: "critical-state",
    persistence: "transient",
  });
  const persistentExplicit = makeSignal({
    signalId: "pers-explicit",
    source: "user-interaction",
    reason: "explicit-selection",
    persistence: "persistent",
  });
  const explanation = explainDirectorRuntimeAttentionSignalComparison(
    persistentExplicit,
    transientCritical,
  );
  assert.equal(explanation.decisiveDimension, "reason");
  assert.equal(explanation.winnerSignalId, "pers-critical");
});

test("23. stable input-order final tiebreak", () => {
  const first = makeSignal({ signalId: "order-1" });
  const second = makeSignal({ signalId: "order-2" });
  const explanation = explainDirectorRuntimeAttentionSignalComparison(
    first,
    second,
    0,
    1,
  );
  assert.equal(explanation.decisiveDimension, "stable-order");
  assert.equal(explanation.winnerSignalId, "order-1");
});

test("24. critical KPI overrides ordinary explicit user selection", () => {
  const result = resolveBatch([
    makeSignal({
      signalId: "user-prod",
      subject: production,
      source: "user-interaction",
      reason: "explicit-selection",
      requestedLevel: "primary",
    }),
    makeSignal({
      signalId: "kpi-ship",
      subject: shipping,
      source: "kpi",
      reason: "critical-state",
      requestedLevel: "primary",
    }),
  ]);
  assert.equal(result.ok, true);
  assert.equal(result.outcome?.primary?.subject.subjectId, "Shipping");
  assert.equal(result.outcome?.primary?.winningSignalId, "kpi-ship");
});

test("25. user-selected subject retained as secondary", () => {
  const result = resolveBatch([
    makeSignal({
      signalId: "user-prod",
      subject: production,
      source: "user-interaction",
      reason: "explicit-selection",
      requestedLevel: "primary",
    }),
    makeSignal({
      signalId: "kpi-ship",
      subject: shipping,
      source: "kpi",
      reason: "critical-state",
      requestedLevel: "primary",
    }),
  ]);
  const retained = result.outcome!.assignments.find(
    (entry) => entry.subject.subjectId === "Production",
  );
  assert.equal(retained?.resolvedLevel, "secondary");
  assert.ok(result.outcome!.retainedSignalIds.includes("user-prod"));
});

test("26. Advisor does not override CriticalState", () => {
  const result = resolveBatch([
    makeSignal({
      signalId: "advisor-prod",
      subject: production,
      source: "advisor",
      reason: "advisor-relevance",
      requestedLevel: "primary",
    }),
    makeSignal({
      signalId: "kpi-ship",
      subject: shipping,
      source: "kpi",
      reason: "critical-state",
      requestedLevel: "primary",
    }),
  ]);
  assert.equal(result.outcome?.primary?.winningSignalId, "kpi-ship");
});

test("27. Execution does not unconditionally override CriticalState", () => {
  const result = resolveBatch([
    makeSignal({
      signalId: "exec-prod",
      subject: production,
      source: "execution",
      reason: "execution-relevance",
      requestedLevel: "primary",
    }),
    makeSignal({
      signalId: "kpi-ship",
      subject: shipping,
      source: "kpi",
      reason: "critical-state",
      requestedLevel: "primary",
    }),
  ]);
  assert.equal(result.outcome?.primary?.winningSignalId, "kpi-ship");
});

test("28. Decision does not unconditionally override CriticalState", () => {
  const result = resolveBatch([
    makeSignal({
      signalId: "dec-prod",
      subject: production,
      source: "decision",
      reason: "decision-relevance",
      requestedLevel: "primary",
    }),
    makeSignal({
      signalId: "kpi-ship",
      subject: shipping,
      source: "kpi",
      reason: "critical-state",
      requestedLevel: "primary",
    }),
  ]);
  assert.equal(result.outcome?.primary?.winningSignalId, "kpi-ship");
});

test("29. same-subject aggregation", () => {
  const result = resolveDirectorRuntimeAttentionForSubject([
    makeSignal({
      signalId: "agg-user",
      source: "user-interaction",
      reason: "explicit-selection",
    }),
    makeSignal({
      signalId: "agg-advisor",
      source: "advisor",
      reason: "advisor-relevance",
      requestedLevel: "secondary",
      intent: "request-support",
    }),
    makeSignal({
      signalId: "agg-problem",
      source: "problem",
      reason: "risk",
      requestedLevel: "primary",
    }),
  ]);
  assert.equal(result.ok, true);
  assert.equal(result.outcome?.assignments.length, 1);
  assert.equal(result.outcome?.assignments[0]?.subject.subjectId, "Production");
  assert.equal(result.outcome?.assignments[0]?.winningSignalId, "agg-problem");
});

test("30. contributing signal IDs preserved", () => {
  const result = resolveDirectorRuntimeAttentionForSubject([
    makeSignal({ signalId: "c1" }),
    makeSignal({ signalId: "c2", source: "advisor", reason: "advisor-relevance" }),
  ]);
  assert.deepEqual(
    [...result.outcome!.assignments[0]!.contributingSignalIds].sort(),
    ["c1", "c2"],
  );
});

test("31. cross-subject primary conflict resolution", () => {
  const result = resolveBatch([
    makeSignal({ signalId: "x-prod", subject: production }),
    makeSignal({
      signalId: "x-ship",
      subject: shipping,
      source: "kpi",
      reason: "critical-state",
    }),
  ]);
  assert.equal(result.outcome?.primary?.subject.subjectId, "Shipping");
  assert.equal(
    result.outcome!.assignments.filter((entry) => entry.resolvedLevel === "primary")
      .length,
    1,
  );
});

test("32. losing valid subject retention", () => {
  const result = resolveBatch([
    makeSignal({ signalId: "keep-prod", subject: production }),
    makeSignal({
      signalId: "win-ship",
      subject: shipping,
      source: "kpi",
      reason: "critical-state",
    }),
  ]);
  assert.ok(
    result.outcome!.assignments.some(
      (entry) =>
        entry.subject.subjectId === "Production" &&
        entry.resolvedLevel === "secondary",
    ),
  );
});

test("33. suppression request behavior", () => {
  const result = resolveBatch([
    makeSignal({
      signalId: "sup-1",
      intent: "request-suppression",
      requestedLevel: "suppressed",
      reason: "system-relevance",
      source: "system",
    }),
  ]);
  assert.equal(result.outcome?.primary, null);
  assert.equal(result.outcome?.assignments[0]?.resolvedLevel, "suppressed");
  assert.ok(result.outcome!.suppressedSignalIds.includes("sup-1"));
});

test("34. focus-vs-suppression same-subject conflict", () => {
  const result = resolveDirectorRuntimeAttentionForSubject([
    makeSignal({
      signalId: "focus-a",
      intent: "request-focus",
      requestedLevel: "primary",
      reason: "explicit-selection",
    }),
    makeSignal({
      signalId: "suppress-a",
      intent: "request-suppression",
      requestedLevel: "suppressed",
      reason: "system-relevance",
      source: "system",
    }),
  ]);
  assert.equal(result.outcome?.assignments[0]?.winningSignalId, "focus-a");
  assert.equal(result.outcome?.assignments[0]?.resolvedLevel, "primary");
  assert.ok(
    result.outcome!.explanations.some(
      (entry) =>
        entry.winnerSignalId === "focus-a" &&
        entry.loserSignalId === "suppress-a",
    ),
  );
});

test("35. suppression remains subject-specific", () => {
  const result = resolveBatch([
    makeSignal({
      signalId: "suppress-prod",
      subject: production,
      intent: "request-suppression",
      requestedLevel: "suppressed",
      reason: "critical-state",
      source: "system",
    }),
    makeSignal({
      signalId: "focus-ship",
      subject: shipping,
      source: "kpi",
      reason: "warning",
      requestedLevel: "primary",
    }),
  ]);
  assert.equal(result.outcome?.primary?.subject.subjectId, "Shipping");
  const prod = result.outcome!.assignments.find(
    (entry) => entry.subject.subjectId === "Production",
  );
  assert.equal(prod?.resolvedLevel, "suppressed");
});

test("36. no unrelated global suppression", () => {
  const result = resolveBatch([
    makeSignal({
      signalId: "suppress-only-prod",
      subject: production,
      intent: "request-suppression",
      requestedLevel: "suppressed",
      reason: "system-relevance",
      source: "system",
    }),
    makeSignal({
      signalId: "keep-ship",
      subject: shipping,
      requestedLevel: "primary",
    }),
  ]);
  assert.equal(result.outcome?.primary?.subject.subjectId, "Shipping");
  assert.equal(result.outcome?.primary?.resolvedLevel, "primary");
  assert.ok(!result.outcome!.suppressedSignalIds.includes("keep-ship"));
});

test("37. malformed signal rejection", () => {
  const result = resolveDirectorRuntimeAttentionForSubject([
    { signalId: "" } as unknown as DirectorRuntimeAttentionSignal,
  ]);
  assert.equal(result.ok, false);
  assert.equal(result.outcome, null);
  assert.ok(result.issues.some((entry) => entry.code === "invalid-signal"));
});

test("38. malformed batch rejection", () => {
  const result = resolveDirectorRuntimeAttentionPriority({
    signals: [{ signalId: "" }],
  } as never);
  assert.equal(result.ok, false);
  assert.equal(result.outcome, null);
  assert.ok(result.issues.some((entry) => entry.code === "invalid-batch"));
});

test("39. invalid resolution outcome rejection", () => {
  const validation = validateDirectorRuntimeAttentionResolutionOutcome({
    primary: null,
    assignments: [
      {
        subject: production,
        resolvedLevel: "primary",
        winningSignalId: "a",
        contributingSignalIds: ["a"],
      },
      {
        subject: shipping,
        resolvedLevel: "primary",
        winningSignalId: "b",
        contributingSignalIds: ["b"],
      },
    ],
    winningSignalIds: ["a", "b"],
    retainedSignalIds: [],
    suppressedSignalIds: [],
    explanations: [],
  });
  assert.equal(validation.ok, false);
  assert.ok(
    validation.issues.some((entry) => entry.code === "multiple-primary-assignments"),
  );
});

test("40. empty outcome immutability", () => {
  assert.equal(Object.isFrozen(emptyOutcome), true);
  assert.equal(Object.isFrozen(emptyOutcome.assignments), true);
  assert.throws(() => {
    (emptyOutcome as { primary: unknown }).primary = {};
  });
});

test("41. resolution output immutability", () => {
  const result = resolveBatch([makeSignal({ signalId: "imm-out" })]);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.outcome), true);
  assert.equal(Object.isFrozen(result.outcome!.assignments), true);
  assert.equal(Object.isFrozen(result.outcome!.assignments[0]), true);
});

test("42. input batch immutability", () => {
  const signals = [
    makeSignal({ signalId: "imm-batch-1" }),
    makeSignal({ signalId: "imm-batch-2", subject: shipping }),
  ];
  const batch = createDirectorRuntimeAttentionSignalBatch({ signals });
  const before = JSON.stringify(batch);
  resolveDirectorRuntimeAttentionPriority(batch);
  assert.equal(JSON.stringify(batch), before);
});

test("43. input signal immutability", () => {
  const signal = makeSignal({ signalId: "imm-sig" });
  const before = JSON.stringify(signal);
  deriveDirectorRuntimeAttentionPriorityVector(signal);
  compareDirectorRuntimeAttentionSignals(signal, signal, 0, 1);
  resolveBatch([signal]);
  assert.equal(JSON.stringify(signal), before);
});

test("44. explanation decisive-dimension correctness", () => {
  const explanation = explainDirectorRuntimeAttentionSignalComparison(
    makeSignal({
      signalId: "loser",
      reason: "explicit-selection",
      source: "user-interaction",
    }),
    makeSignal({
      signalId: "winner",
      reason: "critical-state",
      source: "kpi",
    }),
  );
  assert.equal(explanation.decisiveDimension, "reason");
  assert.equal(validateDirectorRuntimeResolvedAttentionAssignment({
    subject: production,
    resolvedLevel: "primary",
    winningSignalId: "winner",
    contributingSignalIds: ["winner"],
  }).ok, true);
});

test("45. no weighted-scoring behavior", () => {
  assert.equal(policy.comparisonModel, "lexicographic-not-weighted");
  assert.doesNotMatch(source, /priorityScore\s*=/);
  assert.doesNotMatch(source, /\*\s*0\.\d+/);
  assert.doesNotMatch(source, /\bweighted\s+score\b/i);
  assert.doesNotMatch(source, /\bweightedScore\b/);
});

test("46. no random/time-dependent behavior", () => {
  assert.doesNotMatch(source, /\bMath\.random\b/);
  assert.doesNotMatch(source, /\bDate\.now\b/);
  assert.doesNotMatch(source, /\bperformance\.now\b/);
  assert.doesNotMatch(source, /\bnew Date\b/);
});

test("47. no presentation fields", () => {
  const result = resolveBatch([makeSignal({ signalId: "no-pres" })]);
  const serialized = JSON.stringify(result.outcome);
  for (const token of [
    "color", "opacity", "glow", "camera", "scale", "position", "material", "geometry",
  ]) {
    assert.equal(serialized.includes(`"${token}"`), false);
  }
  assert.doesNotMatch(source, /\b(color|opacity|camera|Three\.js|react)\b/i);
});

test("48. no focus-context binding", () => {
  assert.ok(absentCapabilities.includes("FocusContextBinding"));
  assert.ok(absentCapabilities.includes("SceneBinding"));
  assert.doesNotMatch(source, /expandScene|bindFocusContext|loadGoalContext/);
});

test("49. no graph/path orchestration", () => {
  assert.ok(absentCapabilities.includes("AttentionPathOrchestration"));
  assert.doesNotMatch(source, /shortestPath|dependencyPath|graphEdge/);
});

test("50. no transition behavior", () => {
  assert.ok(absentCapabilities.includes("TransitionOrchestration"));
  assert.doesNotMatch(source, /previousPrimary|nextPrimary|transitionDuration|focusHandoff/);
});

test("51. verification success", () => {
  const verification = verifyDirectorRuntimeAttentionPriorityResolution();
  assert.equal(verification.ok, true);
  assert.equal(verification.identity, layer.identity);
  assert.equal(verification.version, "6.3.0");
  assert.equal(verification.frozen, true);
});

test("52. deterministic repeated verification", () => {
  assert.deepEqual(
    verifyDirectorRuntimeAttentionPriorityResolution(),
    verifyDirectorRuntimeAttentionPriorityResolution(),
  );
});
