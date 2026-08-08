import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createDirectorRuntimePresentationIntent,
  type DirectorRuntimePresentationIntent,
} from "./directorRuntimePresentationIntent.ts";
import {
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RANK as stateRank,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_PRECEDENCE as precedence,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_REASONS as reasonCodes,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_SIGNALS as signals,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_INVARIANTS as invariants,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_STATES as states,
  compareDirectorRuntimePresentationStates,
  describeDirectorRuntimePresentationStateTransition,
  directorRuntimePresentationStateResolver as layer,
  directorRuntimePresentationStateResolverCanonicalIdentity as canonicalIdentity,
  directorRuntimePresentationStateResolverRegistry as registry,
  getDirectorRuntimePresentationStateRank,
  isDirectorRuntimePresentationStateAtLeast,
  resolveDirectorRuntimePresentationState,
  resolveDirectorRuntimePresentationStates,
  validateDirectorRuntimePresentationStateResolutionInput,
  verifyDirectorRuntimePresentationStateResolver,
  type DirectorRuntimePresentationStateResolutionInput,
} from "./directorRuntimePresentationStateResolver.ts";

const source = readFileSync(
  new URL("./directorRuntimePresentationStateResolver.ts", import.meta.url),
  "utf8",
);

const subject = { subjectId: "Inventory", subjectKind: "NexoraObject" };

function input(
  overrides: Partial<DirectorRuntimePresentationStateResolutionInput> = {},
): DirectorRuntimePresentationStateResolutionInput {
  return {
    subject,
    requiresExecutiveReport: false,
    requiresOperation: false,
    ...overrides,
  };
}

function intent(
  overrides: Partial<Parameters<typeof createDirectorRuntimePresentationIntent>[0]> = {},
): DirectorRuntimePresentationIntent {
  return createDirectorRuntimePresentationIntent({
    subject,
    state: "minimum",
    attention: "normal",
    density: "minimal",
    priority: "normal",
    visibility: "visible",
    interactionExposure: "select",
    source: "runtime",
    ...overrides,
  });
}

test("1. publishes exact DRI-5:3 identity, version, and namespace", () => {
  assert.deepEqual({
    phase: layer.phase,
    name: layer.name,
    identity: layer.identity,
    namespace: layer.namespace,
    version: layer.version,
  }, {
    phase: "DRI-5:3",
    name: "DirectorRuntimePresentationStateResolver",
    identity: "DRI-5:3/DirectorRuntimePresentationStateResolver",
    namespace: "nexora.dri.adaptive-presentation.state-resolver",
    version: "5.3.0",
  });
  assert.deepEqual(canonicalIdentity, {
    identity: "DRI-5:3/DirectorRuntimePresentationStateResolver",
    version: "5.3.0",
    namespace: "nexora.dri.adaptive-presentation.state-resolver",
    upstream: "DRI-5:2/DirectorRuntimePresentationIntent",
  });
  assert.equal(Object.isFrozen(layer), true);
  assert.equal(Object.isFrozen(canonicalIdentity), true);
});

test("2. sole immediate dependency is DRI-5:2 Presentation Intent", () => {
  assert.equal(
    layer.upstreamDependency,
    "DRI-5:2/DirectorRuntimePresentationIntent",
  );
  assert.equal(registry.dependency, layer.upstreamDependency);
  assert.equal(layer.intentBoundary, "DRI-5:2-presentation-intent-only");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(
    [...new Set(imports)],
    ["@/app/lib/dri/directorRuntimePresentationIntent"],
  );
  assert.doesNotMatch(source, /directorRuntimeAdaptivePresentationFoundation/);
  assert.doesNotMatch(source, /directorRuntimeInteractionOrchestrationPublicIndex/);
  assert.doesNotMatch(
    source,
    /directorRuntime(?:SceneOrchestration|StateContextBinding|Integration)/,
  );
});

test("3. signals and reason codes are exact and ordered", () => {
  assert.deepEqual([...signals], [
    "presence", "report-required", "operation-required", "preferred-state",
  ]);
  assert.deepEqual([...reasonCodes], [
    "operation-required", "report-required", "preferred-state", "default-minimum",
  ]);
  assert.deepEqual([...precedence], [
    "operation-required", "report-required", "preferred-state", "presence",
  ]);
  assert.deepEqual([...states], ["minimum", "report", "operation"]);
  assert.equal(Object.isFrozen(signals), true);
  assert.equal(Object.isFrozen(reasonCodes), true);
  assert.equal(Object.isFrozen(precedence), true);
});

test("4. precedence Case 1 — operation wins over report and preferred", () => {
  const result = resolveDirectorRuntimePresentationState(input({
    requiresOperation: true,
    requiresExecutiveReport: true,
    preferredState: "minimum",
  }));
  assert.deepEqual({
    state: result.state,
    resolvedBy: result.resolvedBy,
    reasonCode: result.reasonCode,
  }, {
    state: "operation",
    resolvedBy: "operation-required",
    reasonCode: "operation-required",
  });
  assert.equal(Object.isFrozen(result), true);
});

test("5. precedence Case 2 — report-required outranks preferred operation", () => {
  const result = resolveDirectorRuntimePresentationState(input({
    requiresOperation: false,
    requiresExecutiveReport: true,
    preferredState: "operation",
  }));
  assert.deepEqual({
    state: result.state,
    resolvedBy: result.resolvedBy,
    reasonCode: result.reasonCode,
  }, {
    state: "report",
    resolvedBy: "report-required",
    reasonCode: "report-required",
  });
});

test("6. precedence Cases 3–6 — preferred state and default presence", () => {
  assert.equal(
    resolveDirectorRuntimePresentationState(input({ preferredState: "operation" })).state,
    "operation",
  );
  assert.equal(
    resolveDirectorRuntimePresentationState(input({ preferredState: "report" })).state,
    "report",
  );
  assert.equal(
    resolveDirectorRuntimePresentationState(input({ preferredState: "minimum" })).state,
    "minimum",
  );

  const presence = resolveDirectorRuntimePresentationState(input());
  assert.deepEqual({
    state: presence.state,
    resolvedBy: presence.resolvedBy,
    reasonCode: presence.reasonCode,
  }, {
    state: "minimum",
    resolvedBy: "presence",
    reasonCode: "default-minimum",
  });

  assert.equal(
    resolveDirectorRuntimePresentationState(input({
      preferredState: "report",
    })).resolvedBy,
    "preferred-state",
  );
});

test("7. Examples A–E match canonical resolution outcomes", () => {
  assert.deepEqual(
    resolveDirectorRuntimePresentationState(input()),
    Object.freeze({
      state: "minimum",
      resolvedBy: "presence",
      reasonCode: "default-minimum",
      subject: Object.freeze({ ...subject }),
    }),
  );

  const report = resolveDirectorRuntimePresentationState(input({
    requiresExecutiveReport: true,
    preferredState: "minimum",
  }));
  assert.equal(report.state, "report");
  assert.equal(report.resolvedBy, "report-required");

  const operation = resolveDirectorRuntimePresentationState(input({
    requiresExecutiveReport: true,
    requiresOperation: true,
    preferredState: "minimum",
  }));
  assert.equal(operation.state, "operation");
  assert.equal(operation.resolvedBy, "operation-required");

  const preferred = resolveDirectorRuntimePresentationState(input({
    preferredState: "report",
  }));
  assert.equal(preferred.state, "report");
  assert.equal(preferred.resolvedBy, "preferred-state");

  assert.equal(
    resolveDirectorRuntimePresentationState(input({ preferredState: "operation" })).state,
    "operation",
  );
});

test("8. independence — unrelated intent dimensions do not resolve state", () => {
  const base = input({
    requiresExecutiveReport: false,
    requiresOperation: false,
    preferredState: undefined,
  });
  const variants = [
    intent({ attention: "critical", density: "minimal", priority: "normal",
      visibility: "visible", interactionExposure: "select", state: "minimum" }),
    intent({ attention: "normal", density: "expanded", priority: "normal",
      visibility: "visible", interactionExposure: "select", state: "minimum" }),
    intent({ attention: "normal", density: "minimal", priority: "urgent",
      visibility: "visible", interactionExposure: "select", state: "minimum" }),
    intent({ attention: "normal", density: "minimal", priority: "normal",
      visibility: "collapsed", interactionExposure: "select", state: "minimum" }),
    intent({ attention: "normal", density: "minimal", priority: "normal",
      visibility: "visible", interactionExposure: "operate", state: "minimum" }),
  ];

  const resolved = variants.map((currentIntent) =>
    resolveDirectorRuntimePresentationState({ ...base, currentIntent }));
  assert.ok(resolved.every((entry) => entry.state === "minimum"));
  assert.ok(resolved.every((entry) => entry.resolvedBy === "presence"));
});

test("9. current state is not sticky", () => {
  const fromOperation = resolveDirectorRuntimePresentationState(input({
    currentIntent: intent({ state: "operation" }),
    requiresOperation: false,
    requiresExecutiveReport: false,
    preferredState: undefined,
  }));
  assert.equal(fromOperation.state, "minimum");

  const toOperation = resolveDirectorRuntimePresentationState(input({
    currentIntent: intent({ state: "minimum" }),
    requiresOperation: true,
  }));
  assert.equal(toOperation.state, "operation");
});

test("10. transition description is semantic only", () => {
  assert.deepEqual(
    describeDirectorRuntimePresentationStateTransition("minimum", "minimum"),
    { from: "minimum", to: "minimum", changed: false },
  );
  assert.deepEqual(
    describeDirectorRuntimePresentationStateTransition("minimum", "report"),
    { from: "minimum", to: "report", changed: true },
  );
  assert.deepEqual(
    describeDirectorRuntimePresentationStateTransition("report", "operation"),
    { from: "report", to: "operation", changed: true },
  );
  assert.deepEqual(
    describeDirectorRuntimePresentationStateTransition("operation", "minimum"),
    { from: "operation", to: "minimum", changed: true },
  );
  const transition = describeDirectorRuntimePresentationStateTransition("minimum", "report");
  assert.equal(Object.isFrozen(transition), true);
  assert.doesNotMatch(JSON.stringify(transition), /duration|easing|fade|scale|glow|camera/i);
});

test("11. state rank and comparison helpers use semantic capability only", () => {
  assert.deepEqual(stateRank, { minimum: 0, report: 1, operation: 2 });
  assert.equal(getDirectorRuntimePresentationStateRank("minimum"), 0);
  assert.equal(getDirectorRuntimePresentationStateRank("report"), 1);
  assert.equal(getDirectorRuntimePresentationStateRank("operation"), 2);
  assert.ok(compareDirectorRuntimePresentationStates("minimum", "report") < 0);
  assert.ok(compareDirectorRuntimePresentationStates("report", "operation") < 0);
  assert.equal(compareDirectorRuntimePresentationStates("minimum", "minimum"), 0);
  assert.ok(compareDirectorRuntimePresentationStates("operation", "report") > 0);
  assert.equal(isDirectorRuntimePresentationStateAtLeast("operation", "report"), true);
  assert.equal(isDirectorRuntimePresentationStateAtLeast("minimum", "report"), false);
  assert.equal(Object.isFrozen(stateRank), true);
});

test("12. validation rejects structural defects at runtime boundaries", () => {
  const valid = input({ preferredState: "report", reasonCode: "scene-focus" });
  assert.equal(validateDirectorRuntimePresentationStateResolutionInput(valid).valid, true);

  const checks: readonly [unknown, string][] = [
    [{ ...valid, subject: { subjectId: "", subjectKind: "Object" } }, "invalid-subject-id"],
    [{ ...valid, subject: { subjectId: "x", subjectKind: "" } }, "invalid-subject-kind"],
    [{ ...valid, preferredState: "panel" }, "invalid-preferred-state"],
    [{ ...valid, requiresExecutiveReport: "yes" }, "invalid-requires-executive-report"],
    [{ ...valid, requiresOperation: 1 }, "invalid-requires-operation"],
    [{ ...valid, currentIntent: { intentId: "bad" } }, "invalid-current-intent"],
    [{ ...valid, reasonCode: "   " }, "invalid-reason-code"],
  ];

  for (const [value, code] of checks) {
    const result = validateDirectorRuntimePresentationStateResolutionInput(value);
    assert.equal(result.valid, false, code);
    assert.equal(result.issues.some((entry) => entry.code === code), true, code);
    assert.equal(Object.isFrozen(result), true);
  }

  assert.throws(() => resolveDirectorRuntimePresentationState({
    ...valid,
    preferredState: "panel" as "minimum",
  }), TypeError);
});

test("13. batch resolution preserves order and is subject-local", () => {
  const inputs = [
    input({ subject: { subjectId: "A", subjectKind: "Object" }, preferredState: "minimum" }),
    input({
      subject: { subjectId: "B", subjectKind: "Object" },
      requiresExecutiveReport: true,
      preferredState: "minimum",
    }),
    input({
      subject: { subjectId: "C", subjectKind: "Object" },
      requiresOperation: true,
      requiresExecutiveReport: true,
    }),
  ];
  const before = JSON.stringify(inputs);
  const results = resolveDirectorRuntimePresentationStates(inputs);
  assert.equal(JSON.stringify(inputs), before);
  assert.deepEqual(results.map((entry) => entry.subject.subjectId), ["A", "B", "C"]);
  assert.deepEqual(results.map((entry) => entry.state), ["minimum", "report", "operation"]);
  assert.equal(Object.isFrozen(results), true);
  assert.ok(results.every((entry) => Object.isFrozen(entry)));
});

test("14. immutability of canonical structures and results", () => {
  assert.throws(() => {
    (signals as unknown as string[]).push("glowing");
  }, TypeError);
  assert.throws(() => {
    (reasonCodes as unknown as string[])[0] = "mutated";
  }, TypeError);
  assert.throws(() => {
    (registry as { stateCount: number }).stateCount = 99;
  }, TypeError);
  assert.throws(() => {
    (stateRank as { minimum: number }).minimum = 9;
  }, TypeError);
  assert.throws(() => {
    (layer as { version: string }).version = "0.0.0";
  }, TypeError);

  const result = resolveDirectorRuntimePresentationState(input());
  assert.throws(() => {
    (result as { state: string }).state = "operation";
  }, TypeError);

  const verification = verifyDirectorRuntimePresentationStateResolver();
  assert.throws(() => {
    (verification as { ok: boolean }).ok = false;
  }, TypeError);
});

test("15. invariants, registry, and verification", () => {
  assert.equal(invariants.length, 25);
  assert.equal(registry.invariantCount, 25);
  assert.equal(registry.stateCount, 3);
  assert.equal(registry.signalCount, 4);
  assert.equal(registry.reasonCodeCount, 4);
  assert.equal(registry.precedenceRuleCount, 4);
  assert.equal(registry.defaultState, "minimum");
  assert.equal(registry.highestPrecedenceRequirement, "operation-required");
  assert.equal(Object.isFrozen(invariants), true);
  assert.equal(Object.isFrozen(registry), true);

  const first = verifyDirectorRuntimePresentationStateResolver();
  const second = verifyDirectorRuntimePresentationStateResolver();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.deepEqual({
    identity: first.identity,
    version: first.version,
    namespace: first.namespace,
    dependency: first.dependency,
    presentationStateCount: first.presentationStateCount,
    resolutionSignalCount: first.resolutionSignalCount,
    resolutionReasonCount: first.resolutionReasonCount,
    precedenceRuleCount: first.precedenceRuleCount,
    invariantCount: first.invariantCount,
    frozen: first.frozen,
  }, {
    identity: "DRI-5:3/DirectorRuntimePresentationStateResolver",
    version: "5.3.0",
    namespace: "nexora.dri.adaptive-presentation.state-resolver",
    dependency: "DRI-5:2/DirectorRuntimePresentationIntent",
    presentationStateCount: 3,
    resolutionSignalCount: 4,
    resolutionReasonCount: 4,
    precedenceRuleCount: 4,
    invariantCount: 25,
    frozen: true,
  });
});

test("16. boundary protection — no renderer or DRI-5:4+ policy behavior", () => {
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next|three|@react-three|framer-motion)/i);
  assert.doesNotMatch(
    source,
    /\b(?:React|ReactDOM|JSX|THREE|WebGL|HTMLElement|Object3D|Mesh|Material)\b/,
  );
  assert.doesNotMatch(source, /\b(?:green|yellow|red|orange|glow|pulse|blink)\b/i);
  assert.doesNotMatch(
    source,
    /\b(?:attentionPolicy|densityPolicy|orchestratePresentation|presentationPlan|resolveAttention|resolveDensity)\b/,
  );
  assert.doesNotMatch(
    source,
    /DRI-5:[4-9]|AttentionEmphasisPolicy|InformationDensityPolicy|AdaptivePresentationOrchestration/,
  );
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID)\b/);
  assert.doesNotMatch(source, /\b(?:window|document|localStorage|fetch)\b/);
  assert.doesNotMatch(source, /from\s+["']@\/app\/components\//);
  assert.doesNotMatch(source, /critical\s*→\s*operation|warning\s*→\s*report|expanded\s*→\s*operation/);
  assert.equal(
    layer.architecturalStatus,
    "Established · Deterministic · Immutable · Semantic · RendererIndependent · ReadyForAttentionPolicy",
  );
});

test("17. determinism and no input mutation", () => {
  const value = input({
    requiresExecutiveReport: true,
    preferredState: "minimum",
    reasonCode: "runtime-state",
    currentIntent: intent({ state: "operation", attention: "critical" }),
  });
  const before = JSON.stringify(value);
  const one = resolveDirectorRuntimePresentationState(value);
  const two = resolveDirectorRuntimePresentationState(value);
  assert.equal(JSON.stringify(value), before);
  assert.deepEqual(one, two);
  assert.notEqual(one, two);
  assert.equal(one.state, "report");
  assert.equal(one.inputReasonCode, "runtime-state");
});
