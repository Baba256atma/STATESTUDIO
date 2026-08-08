import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createDirectorSceneOrchestrationRequest }
  from "./directorRuntimeSceneOrchestrationContracts.ts";
import {
  DIRECTOR_SCENE_ORCHESTRATION_MODEL_STAGES as stages,
  DIRECTOR_SCENE_ORCHESTRATION_OPERATION_ORDER as operationOrder,
  directorRuntimeSceneOrchestrationModel as model,
  directorRuntimeSceneOrchestrationModelRegistry as registry,
  resolveDirectorSceneOrchestration,
} from "./directorRuntimeSceneOrchestrationModel.ts";

const storage = { subjectId: "storage", subjectKind: "Object" };
const factory = { subjectId: "factory", subjectKind: "Object" };
const shipping = { subjectId: "shipping", subjectKind: "Object" };
const customer = { subjectId: "customer", subjectKind: "Object" };
const kpi = { subjectId: "kpi-17", subjectKind: "KPI" };
const pathRelationships = [
  { relationshipId: "storage-factory", source: storage, target: factory, relationshipKind: "supplies" },
  { relationshipId: "factory-shipping", source: factory, target: shipping, relationshipKind: "flows-to" },
  { relationshipId: "shipping-customer", source: shipping, target: customer, relationshipKind: "delivers" },
];
const context = { runtimeContextId: "executive-current", runtimeStateId: "state-current",
  mode: "executive", workspace: "Goal", lens: "Object" };

function completeRequest() {
  return createDirectorSceneOrchestrationRequest({ requestId: "request-1", context,
    subjects: [storage, factory, shipping, customer, kpi, factory],
    relationships: pathRelationships,
    requestedFocus: { primary: factory, secondary: [shipping, customer] },
    requestedAttention: [{ subject: kpi, level: "critical", reason: "supplied critical state" }],
    requestedPaths: [{ pathId: "risk-chain", subjects: [storage, factory, shipping, customer, factory],
      relationships: pathRelationships }],
    requestedOperations: [
      { operationId: "preserve-context", kind: "preserve", subjects: [customer], relationships: [] },
      { operationId: "emphasize-kpi", kind: "emphasize", subjects: [kpi], relationships: [] },
      { operationId: "duplicate-focus", kind: "focus", subjects: [factory], relationships: [] },
    ],
  });
}

test("publishes exact model identity and sole DRI-3:2 dependency", () => {
  assert.deepEqual({ phase: model.phase, name: model.name, identity: model.identity,
    namespace: model.namespace, version: model.version, dependency: model.immediateDependency }, {
    phase: "DRI-3:3", name: "DirectorRuntimeSceneOrchestrationModel",
    identity: "DRI-3:3/DirectorRuntimeSceneOrchestrationModel",
    namespace: "nexora.dri.scene.orchestration.model", version: "3.3.0",
    dependency: "DRI-3:2/DirectorRuntimeSceneOrchestrationContracts",
  });
  const source = readFileSync(new URL("./directorRuntimeSceneOrchestrationModel.ts", import.meta.url), "utf8");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeSceneOrchestrationContracts"]);
  assert.doesNotMatch(source, /directorRuntimeSceneOrchestration(?:Foundation|Focus|Attention|Validation|Certification|Platform|Freeze|PublicIndex)/);
});

test("resolves a complete request into an immutable resolved plan", () => {
  const result = resolveDirectorSceneOrchestration(completeRequest());
  assert.equal(result.status, "resolved");
  assert.equal(result.requestId, "request-1");
  assert.deepEqual(result.issues, []);
  assert.equal(result.plan?.planId, "request-1:scene-orchestration-plan");
  assert.deepEqual(result.plan?.context, context);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.plan), true);
  assert.equal(Object.isFrozen(result.plan?.operations), true);
});

test("resolves an empty valid request into the canonical empty plan", () => {
  const request = createDirectorSceneOrchestrationRequest({ requestId: "empty", context });
  const result = resolveDirectorSceneOrchestration(request);
  assert.equal(result.status, "resolved");
  assert.deepEqual(result.plan, { planId: "empty:scene-orchestration-plan", context,
    focus: { primary: null, secondary: [] }, attention: [], paths: [], operations: [] });
});

test("preserves focus, attention, path, and relationship ordering", () => {
  const result = resolveDirectorSceneOrchestration(completeRequest());
  assert.deepEqual(result.plan?.focus, { primary: factory, secondary: [shipping, customer] });
  assert.deepEqual(result.plan?.attention, [{ subject: kpi, level: "critical",
    reason: "supplied critical state" }]);
  assert.deepEqual(result.plan?.paths[0]?.subjects.map(({ subjectId }) => subjectId),
    ["storage", "factory", "shipping", "customer"]);
  assert.deepEqual(result.plan?.paths[0]?.relationships.map(({ relationshipId }) => relationshipId),
    ["storage-factory", "factory-shipping", "shipping-customer"]);
});

test("derives reveal, relate, focus, and attention operations without visual policy", () => {
  const operations = resolveDirectorSceneOrchestration(completeRequest()).plan!.operations;
  const byKind = (kind: string) => operations.filter((item) => item.kind === kind);
  assert.deepEqual(byKind("reveal").map(({ subjects }) => subjects[0]?.subjectId),
    ["storage", "factory", "shipping", "customer"]);
  assert.deepEqual(byKind("relate").map(({ relationships }) => relationships[0]?.relationshipId),
    ["storage-factory", "factory-shipping", "shipping-customer"]);
  assert.deepEqual(byKind("focus").map(({ subjects }) => subjects[0]?.subjectId), ["factory"]);
  assert.deepEqual(byKind("attention").map(({ subjects }) => subjects[0]?.subjectId), ["kpi-17"]);
  assert.equal(byKind("emphasize")[0]?.operationId, "emphasize-kpi");
  assert.equal(byKind("preserve")[0]?.operationId, "preserve-context");
});

test("locks deterministic operation ordering and stable semantic deduplication", () => {
  const request = completeRequest();
  const duplicate = createDirectorSceneOrchestrationRequest({ ...request,
    requestedOperations: [...request.requestedOperations,
      { operationId: "second-identical-focus", kind: "focus", subjects: [factory], relationships: [] },
      { operationId: "different-focus-reason", kind: "focus", subjects: [factory], relationships: [],
        reason: "explicit reason" }] });
  const operations = resolveDirectorSceneOrchestration(duplicate).plan!.operations;
  const ranks = operations.map(({ kind }) => operationOrder.indexOf(kind));
  assert.deepEqual(ranks, [...ranks].sort((left, right) => left - right));
  assert.equal(operations.filter(({ kind, reason }) => kind === "focus" && reason === undefined).length, 1);
  assert.equal(operations.filter(({ kind }) => kind === "focus").length, 2);
  assert.deepEqual(operationOrder,
    ["preserve", "reveal", "conceal", "relate", "focus", "emphasize", "deemphasize", "attention"]);
});

test("uses stable first occurrence for subjects referenced across supplied intent", () => {
  const result = resolveDirectorSceneOrchestration(completeRequest());
  const reveals = result.plan!.operations.filter(({ kind }) => kind === "reveal")
    .map(({ subjects }) => subjects[0]?.subjectId);
  assert.deepEqual(reveals, ["storage", "factory", "shipping", "customer"]);
});

test("produces partial results for undeclared referenced subjects in stable issue order", () => {
  const request = createDirectorSceneOrchestrationRequest({ requestId: "partial", context,
    subjects: [factory], requestedFocus: { primary: shipping, secondary: [] },
    requestedAttention: [{ subject: kpi, level: "important" }] });
  const result = resolveDirectorSceneOrchestration(request);
  assert.equal(result.status, "partial");
  assert.equal(result.plan?.focus.primary?.subjectId, "shipping");
  assert.deepEqual(result.issues.map(({ subjectId }) => subjectId), ["shipping", "kpi-17"]);
  assert.ok(result.issues.every(({ code }) => code === "implicit-subject-reference"));
});

test("rejects only missing required request or runtime-context identities", () => {
  const missingRequest = createDirectorSceneOrchestrationRequest({ requestId: "", context });
  const missingContext = createDirectorSceneOrchestrationRequest({ requestId: "valid",
    context: { ...context, runtimeContextId: "" } });
  const both = createDirectorSceneOrchestrationRequest({ requestId: "",
    context: { ...context, runtimeContextId: "" } });
  for (const request of [missingRequest, missingContext, both]) {
    const result = resolveDirectorSceneOrchestration(request);
    assert.equal(result.status, "rejected");
    assert.equal(result.plan, null);
  }
  assert.deepEqual(resolveDirectorSceneOrchestration(both).issues.map(({ code }) => code),
    ["missing-request-identity", "missing-runtime-context-identity"]);
});

test("preserves lineage and context without generated or rewritten values", () => {
  const result = resolveDirectorSceneOrchestration(completeRequest());
  assert.equal(result.requestId, "request-1");
  assert.equal(result.plan?.planId, "request-1:scene-orchestration-plan");
  assert.deepEqual(result.plan?.context, context);
});

test("is deterministic, source-immutable, deeply immutable, and JSON-compatible", () => {
  const request = completeRequest();
  const before = JSON.stringify(request);
  const one = resolveDirectorSceneOrchestration(request);
  const two = resolveDirectorSceneOrchestration(JSON.parse(JSON.stringify(request)));
  assert.deepEqual(one, two);
  assert.equal(JSON.stringify(request), before);
  assert.deepEqual(JSON.parse(JSON.stringify(one)), one);
  assert.equal(Object.isFrozen(one.plan?.focus), true);
  assert.equal(Object.isFrozen(one.plan?.attention), true);
  assert.equal(Object.isFrozen(one.plan?.paths), true);
  assert.equal(Object.isFrozen(one.issues), true);
});

test("publishes exact ordered stages and a dynamically counted immutable registry", () => {
  assert.deepEqual(stages, ["normalize-request", "resolve-subjects", "resolve-relationships",
    "resolve-focus", "resolve-attention", "resolve-paths", "resolve-operations", "assemble-plan",
    "produce-result"]);
  const pairs: readonly [number, readonly unknown[]][] = [
    [registry.conceptCount, registry.concepts], [registry.stageCount, registry.stages],
    [registry.operationOrderCount, registry.operationOrder], [registry.publicApiCount, registry.publicApis],
  ];
  for (const [count, values] of pairs) {
    assert.equal(count, values.length);
    assert.equal(new Set(values).size, values.length);
  }
  assert.equal(model.registry, registry);
  assert.equal(Object.isFrozen(registry), true);
});

test("contains no renderer, NOL mutation, visual/business policy, I/O, or nondeterminism", () => {
  const source = readFileSync(new URL("./directorRuntimeSceneOrchestrationModel.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|three|@react-three|next)/i);
  assert.doesNotMatch(source, /\b(?:SceneRenderer|Canvas|WebGL|SVG|camera|viewport|coordinate|mesh|geometry|material|shader|color|opacity|glow|animation)\b/i);
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID|fetch|localStorage|indexedDB|process\.env)\b/);
  assert.doesNotMatch(source, /\b(?:sceneNode\.(?:hide|move|highlight)|scene\.(?:add|remove)|calculateKpi|calculateKoi|rankScenario|approveDecision)\s*\(/i);
  assert.doesNotMatch(source, /from\s+["']node:(?:fs|path)|readFile|writeFile/);
});
