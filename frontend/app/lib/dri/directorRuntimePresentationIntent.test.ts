import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_PRESENTATION_INTENT_CHANGE_DIMENSIONS as changeDimensions,
  DIRECTOR_RUNTIME_PRESENTATION_INTENT_INVARIANTS as invariants,
  DIRECTOR_RUNTIME_PRESENTATION_INTENT_SOURCES as intentSources,
  areDirectorRuntimePresentationIntentsEqual,
  compareDirectorRuntimePresentationIntents,
  createDirectorRuntimePresentationIntent,
  createDirectorRuntimePresentationIntentCollection,
  createDirectorRuntimePresentationIntentSnapshot,
  deriveDirectorRuntimePresentationIntentId,
  directorRuntimePresentationIntent as layer,
  directorRuntimePresentationIntentCanonicalIdentity as canonicalIdentity,
  directorRuntimePresentationIntentRegistry as registry,
  findDirectorRuntimePresentationIntentById,
  findDirectorRuntimePresentationIntentsBySubjectId,
  validateDirectorRuntimePresentationIntent,
  validateDirectorRuntimePresentationIntentCollection,
  verifyDirectorRuntimePresentationIntent,
  type CreateDirectorRuntimePresentationIntentInput,
  type DirectorRuntimePresentationIntent,
} from "./directorRuntimePresentationIntent.ts";

const source = readFileSync(
  new URL("./directorRuntimePresentationIntent.ts", import.meta.url),
  "utf8",
);

const caseA: CreateDirectorRuntimePresentationIntentInput = {
  subject: { subjectId: "Production", subjectKind: "NexoraObject" },
  state: "minimum",
  attention: "normal",
  density: "minimal",
  priority: "normal",
  visibility: "visible",
  interactionExposure: "select",
  source: "runtime",
  reason: { code: "runtime-state", source: "runtime" },
};

const caseB: CreateDirectorRuntimePresentationIntentInput = {
  subject: { subjectId: "Inventory", subjectKind: "NexoraObject" },
  state: "report",
  attention: "warning",
  density: "standard",
  priority: "high",
  visibility: "visible",
  interactionExposure: "inspect",
  source: "scene",
  reason: { code: "risk-attention", source: "scene", detail: "Inventory risk elevated." },
  context: { contextId: "scene-1", contextKind: "scene" },
};

const caseC: CreateDirectorRuntimePresentationIntentInput = {
  subject: { subjectId: "CapacityDecision", subjectKind: "Decision" },
  state: "operation",
  attention: "critical",
  density: "expanded",
  priority: "urgent",
  visibility: "visible",
  interactionExposure: "operate",
  source: "director",
  reason: { code: "executive-operation", source: "director" },
};

const caseD: CreateDirectorRuntimePresentationIntentInput = {
  subject: { subjectId: "Unusual", subjectKind: "KPI" },
  state: "minimum",
  attention: "critical",
  density: "expanded",
  priority: "low",
  visibility: "collapsed",
  interactionExposure: "none",
  source: "interaction",
  reason: { code: "interaction-selection", source: "interaction" },
};

test("1. publishes exact DRI-5:2 identity, version, and namespace", () => {
  assert.deepEqual({
    phase: layer.phase,
    name: layer.name,
    identity: layer.identity,
    namespace: layer.namespace,
    version: layer.version,
  }, {
    phase: "DRI-5:2",
    name: "DirectorRuntimePresentationIntent",
    identity: "DRI-5:2/DirectorRuntimePresentationIntent",
    namespace: "nexora.dri.adaptive-presentation.intent",
    version: "5.2.0",
  });
  assert.deepEqual(canonicalIdentity, {
    identity: "DRI-5:2/DirectorRuntimePresentationIntent",
    version: "5.2.0",
    namespace: "nexora.dri.adaptive-presentation.intent",
    upstream: "DRI-5:1/DirectorRuntimeAdaptivePresentationFoundation",
  });
  assert.equal(Object.isFrozen(layer), true);
  assert.equal(Object.isFrozen(canonicalIdentity), true);
});

test("2. sole immediate dependency is DRI-5:1 Foundation", () => {
  assert.equal(
    layer.upstreamDependency,
    "DRI-5:1/DirectorRuntimeAdaptivePresentationFoundation",
  );
  assert.equal(registry.dependency, layer.upstreamDependency);
  assert.equal(layer.foundationBoundary, "DRI-5:1-foundation-only");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(
    [...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeAdaptivePresentationFoundation"],
  );
  assert.doesNotMatch(source, /directorRuntimeInteractionOrchestrationPublicIndex/);
  assert.doesNotMatch(
    source,
    /directorRuntime(?:SceneOrchestration|StateContextBinding|Integration)/,
  );
});

test("3. intent sources are exactly runtime, scene, interaction, director", () => {
  assert.deepEqual([...intentSources], ["runtime", "scene", "interaction", "director"]);
  assert.equal(intentSources.length, 4);
  assert.equal(Object.isFrozen(intentSources), true);
  assert.equal(registry.intentSourceCount, 4);
});

test("4. factory creates Case A minimum intent immutably and deterministically", () => {
  const one = createDirectorRuntimePresentationIntent(caseA);
  const two = createDirectorRuntimePresentationIntent(caseA);
  assert.notEqual(one, two);
  assert.deepEqual(one, two);
  assert.equal(one.state, "minimum");
  assert.equal(one.attention, "normal");
  assert.equal(one.density, "minimal");
  assert.equal(one.priority, "normal");
  assert.equal(one.visibility, "visible");
  assert.equal(one.interactionExposure, "select");
  assert.equal(one.subject.subjectId, "Production");
  assert.equal(Object.isFrozen(one), true);
  assert.equal(Object.isFrozen(one.subject), true);
  assert.equal(Object.isFrozen(one.reason), true);
});

test("5. factory creates Case B report and Case C operation intents", () => {
  const report = createDirectorRuntimePresentationIntent(caseB);
  const operation = createDirectorRuntimePresentationIntent(caseC);
  assert.equal(report.state, "report");
  assert.equal(report.attention, "warning");
  assert.equal(report.density, "standard");
  assert.equal(report.priority, "high");
  assert.equal(report.interactionExposure, "inspect");
  assert.equal(report.context?.contextKind, "scene");
  assert.equal(operation.state, "operation");
  assert.equal(operation.attention, "critical");
  assert.equal(operation.density, "expanded");
  assert.equal(operation.priority, "urgent");
  assert.equal(operation.interactionExposure, "operate");
});

test("6. semantic preservation — unusual Case D is representable unchanged", () => {
  const unusual = createDirectorRuntimePresentationIntent(caseD);
  assert.deepEqual({
    state: unusual.state,
    attention: unusual.attention,
    density: unusual.density,
    priority: unusual.priority,
    visibility: unusual.visibility,
    interactionExposure: unusual.interactionExposure,
  }, {
    state: "minimum",
    attention: "critical",
    density: "expanded",
    priority: "low",
    visibility: "collapsed",
    interactionExposure: "none",
  });
});

test("7. factory does not mutate caller input", () => {
  const subject = { subjectId: "Mutable", subjectKind: "Object", namespace: "nexora" };
  const reason = { code: "runtime-state", source: "runtime" as const, detail: "keep" };
  const context = { contextId: "ctx-1", contextKind: "runtime" };
  const input: CreateDirectorRuntimePresentationIntentInput = {
    subject,
    state: "report",
    attention: "notice",
    density: "standard",
    priority: "normal",
    visibility: "visible",
    interactionExposure: "inspect",
    source: "runtime",
    reason,
    context,
  };
  const before = JSON.stringify(input);
  const intent = createDirectorRuntimePresentationIntent(input);
  assert.equal(JSON.stringify(input), before);
  subject.subjectId = "changed";
  reason.detail = "changed";
  context.contextId = "changed";
  assert.equal(intent.subject.subjectId, "Mutable");
  assert.equal(intent.reason?.detail, "keep");
  assert.equal(intent.context?.contextId, "ctx-1");
  assert.equal(Object.isFrozen(input), false);
  assert.equal(Object.isFrozen(intent), true);
});

test("8. deterministic identity derivation is stable and non-random", () => {
  const derivedA = deriveDirectorRuntimePresentationIntentId(caseA);
  const derivedB = deriveDirectorRuntimePresentationIntentId(caseA);
  assert.equal(derivedA, derivedB);
  assert.equal(createDirectorRuntimePresentationIntent(caseA).intentId, derivedA);
  assert.notEqual(
    deriveDirectorRuntimePresentationIntentId(caseA),
    deriveDirectorRuntimePresentationIntentId(caseB),
  );
  const explicit = createDirectorRuntimePresentationIntent({
    ...caseA,
    intentId: "explicit-intent-1",
  });
  assert.equal(explicit.intentId, "explicit-intent-1");
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID|crypto)\b/);
});

test("9. validation accepts valid intents and rejects structural defects", () => {
  const valid = createDirectorRuntimePresentationIntent(caseB);
  assert.equal(validateDirectorRuntimePresentationIntent(valid).valid, true);
  assert.deepEqual(validateDirectorRuntimePresentationIntent(valid).issues, []);

  const checks: readonly [unknown, string][] = [
    [{ ...valid, intentId: "" }, "missing-intent-id"],
    [{ ...valid, intentId: "   " }, "invalid-intent-id"],
    [{ ...valid, subject: { subjectId: "", subjectKind: "Object" } }, "invalid-subject-id"],
    [{ ...valid, subject: { subjectId: "x", subjectKind: "" } }, "invalid-subject-kind"],
    [{ ...valid, state: "Maximum" }, "invalid-state"],
    [{ ...valid, attention: "red" }, "invalid-attention"],
    [{ ...valid, density: "maximum" }, "invalid-density"],
    [{ ...valid, priority: "critical" }, "invalid-priority"],
    [{ ...valid, visibility: "display-none" }, "invalid-visibility"],
    [{ ...valid, interactionExposure: "onClick" }, "invalid-interaction-exposure"],
    [{ ...valid, source: "kpi-engine" }, "invalid-source"],
    [{ ...valid, reason: "bad" }, "invalid-reason"],
    [{ ...valid, reason: { code: "", source: "runtime" } }, "invalid-reason-code"],
    [{ ...valid, reason: { code: "x", source: "panel" } }, "invalid-reason-source"],
    [{ ...valid, context: { contextId: "", contextKind: "scene" } }, "invalid-context-id"],
    [{ ...valid, context: { contextId: "c", contextKind: "" } }, "invalid-context-kind"],
  ];

  for (const [value, code] of checks) {
    const result = validateDirectorRuntimePresentationIntent(value);
    assert.equal(result.valid, false, `expected invalid for ${code}`);
    assert.equal(result.issues.some((entry) => entry.code === code), true, code);
    assert.equal(Object.isFrozen(result), true);
    assert.equal(Object.isFrozen(result.issues), true);
  }
});

test("10. factory rejects structurally invalid input without mutating policy", () => {
  assert.throws(() => createDirectorRuntimePresentationIntent({
    ...caseA,
    state: "panel" as "minimum",
  }), TypeError);
  assert.throws(() => createDirectorRuntimePresentationIntent({
    ...caseA,
    intentId: "",
  }), TypeError);
});

test("11. semantic equality compares intent content, not object identity", () => {
  const left = createDirectorRuntimePresentationIntent(caseB);
  const right = createDirectorRuntimePresentationIntent(caseB);
  assert.notEqual(left, right);
  assert.equal(areDirectorRuntimePresentationIntentsEqual(left, right), true);

  assert.equal(
    areDirectorRuntimePresentationIntentsEqual(
      left,
      createDirectorRuntimePresentationIntent({ ...caseB, state: "minimum" }),
    ),
    false,
  );
  assert.equal(
    areDirectorRuntimePresentationIntentsEqual(
      left,
      createDirectorRuntimePresentationIntent({ ...caseB, attention: "normal" }),
    ),
    false,
  );
  assert.equal(
    areDirectorRuntimePresentationIntentsEqual(
      left,
      createDirectorRuntimePresentationIntent({
        ...caseB,
        subject: { subjectId: "Other", subjectKind: "NexoraObject" },
      }),
    ),
    false,
  );
  assert.equal(
    areDirectorRuntimePresentationIntentsEqual(
      left,
      createDirectorRuntimePresentationIntent({ ...caseB, density: "expanded" }),
    ),
    false,
  );
  assert.equal(
    areDirectorRuntimePresentationIntentsEqual(
      left,
      createDirectorRuntimePresentationIntent({ ...caseB, source: "director" }),
    ),
    false,
  );
});

test("12. comparison reports exact changed semantic dimensions", () => {
  assert.deepEqual([...changeDimensions], [
    "subject", "state", "attention", "density", "priority", "visibility",
    "interactionExposure", "source", "reason", "context",
  ]);

  const previous = createDirectorRuntimePresentationIntent({
    ...caseA,
    intentId: "cmp-1",
    attention: "normal",
    priority: "normal",
  });
  const next = createDirectorRuntimePresentationIntent({
    ...caseA,
    intentId: "cmp-1",
    attention: "warning",
    priority: "high",
  });
  const comparison = compareDirectorRuntimePresentationIntents(previous, next);
  assert.equal(comparison.equal, false);
  assert.deepEqual([...comparison.changedDimensions], ["attention", "priority"]);
  assert.equal(Object.isFrozen(comparison), true);
  assert.equal(Object.isFrozen(comparison.changedDimensions), true);
  assert.doesNotMatch(JSON.stringify(comparison), /yellow|glow|pulse|scale/i);

  const same = compareDirectorRuntimePresentationIntents(previous, previous);
  assert.equal(same.equal, true);
  assert.deepEqual([...same.changedDimensions], []);
});

test("13. collections preserve order, support lookup, detect duplicates", () => {
  const collection = createDirectorRuntimePresentationIntentCollection([
    { ...caseA, intentId: "a" },
    { ...caseB, intentId: "b" },
    { ...caseC, intentId: "c" },
    { ...caseD, intentId: "d", subject: { subjectId: "Production", subjectKind: "KPI" } },
  ]);
  assert.deepEqual(collection.map((intent) => intent.intentId), ["a", "b", "c", "d"]);
  assert.equal(Object.isFrozen(collection), true);
  assert.equal(findDirectorRuntimePresentationIntentById(collection, "b")?.subject.subjectId, "Inventory");
  assert.deepEqual(
    findDirectorRuntimePresentationIntentsBySubjectId(collection, "Production")
      .map((intent) => intent.intentId),
    ["a", "d"],
  );

  const duplicateValidation = validateDirectorRuntimePresentationIntentCollection([
    createDirectorRuntimePresentationIntent({ ...caseA, intentId: "dup" }),
    createDirectorRuntimePresentationIntent({ ...caseB, intentId: "dup" }),
  ]);
  assert.equal(duplicateValidation.valid, false);
  assert.equal(
    duplicateValidation.issues.some((entry) => entry.code === "duplicate-intent-id"),
    true,
  );
  assert.throws(() => createDirectorRuntimePresentationIntentCollection([
    { ...caseA, intentId: "dup" },
    { ...caseB, intentId: "dup" },
  ]), TypeError);

  const snapshot = createDirectorRuntimePresentationIntentSnapshot([
    { ...caseA, intentId: "s1" },
    { ...caseB, intentId: "s2" },
  ]);
  assert.equal(Object.isFrozen(snapshot), true);
  assert.equal(Object.isFrozen(snapshot.intents), true);
  assert.deepEqual(snapshot.intents.map((intent) => intent.intentId), ["s1", "s2"]);
});

test("14. invariants, registry, and verification are complete and frozen", () => {
  assert.equal(invariants.length, 26);
  assert.equal(registry.invariantCount, 26);
  assert.equal(registry.changeDimensionCount, 10);
  assert.equal(Object.isFrozen(invariants), true);
  assert.equal(Object.isFrozen(registry), true);

  const first = verifyDirectorRuntimePresentationIntent();
  const second = verifyDirectorRuntimePresentationIntent();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.deepEqual({
    identity: first.identity,
    version: first.version,
    namespace: first.namespace,
    dependency: first.dependency,
    intentSourceCount: first.intentSourceCount,
    changeDimensionCount: first.changeDimensionCount,
    invariantCount: first.invariantCount,
    frozen: first.frozen,
  }, {
    identity: "DRI-5:2/DirectorRuntimePresentationIntent",
    version: "5.2.0",
    namespace: "nexora.dri.adaptive-presentation.intent",
    dependency: "DRI-5:1/DirectorRuntimeAdaptivePresentationFoundation",
    intentSourceCount: 4,
    changeDimensionCount: 10,
    invariantCount: 26,
    frozen: true,
  });
});

test("15. boundary protection — no renderer, UI, resolution, or DRI-5:3+ behavior", () => {
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next|three|@react-three|framer-motion)/i);
  assert.doesNotMatch(
    source,
    /\b(?:React|ReactDOM|JSX|THREE|WebGL|HTMLElement|Object3D|Mesh|Material)\b/,
  );
  assert.doesNotMatch(source, /\b(?:onClick|onHover|onPointerDown|addEventListener)\b/);
  assert.doesNotMatch(source, /\b(?:green|yellow|red|orange|glow|pulse|blink|hex|rgb)\b/i);
  assert.doesNotMatch(
    source,
    /\b(?:resolvePresentationState|attentionPolicy|densityPolicy|orchestratePresentation|presentationPlan)\b/,
  );
  assert.doesNotMatch(
    source,
    /DRI-5:[3-9]|PresentationStateResolver|AdaptivePresentationOrchestration|AdaptivePresentationPlatform/,
  );
  assert.doesNotMatch(source, /\b(?:window|document|localStorage|fetch)\b/);
  assert.doesNotMatch(source, /from\s+["']@\/app\/components\//);
  assert.equal(
    layer.architecturalStatus,
    "Established · Deterministic · Immutable · Semantic · RendererIndependent · ReadyForStateResolution",
  );
});

test("16. no state/attention/density inference from factory", () => {
  const intent = createDirectorRuntimePresentationIntent({
    subject: { subjectId: "X", subjectKind: "Object" },
    state: "minimum",
    attention: "critical",
    density: "expanded",
    priority: "urgent",
    visibility: "hidden",
    interactionExposure: "operate",
    source: "runtime",
  });
  assert.equal(intent.state, "minimum");
  assert.equal(intent.attention, "critical");
  assert.equal(intent.density, "expanded");
  assert.doesNotMatch(source, /minimum\s*→\s*minimal|warning\s*→\s*report|critical\s*→\s*operation/);

  const asUnknown: DirectorRuntimePresentationIntent = intent;
  assert.equal(validateDirectorRuntimePresentationIntent(asUnknown).valid, true);
});
