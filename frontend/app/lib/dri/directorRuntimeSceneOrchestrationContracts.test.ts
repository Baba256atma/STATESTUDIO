import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_SCENE_ORCHESTRATION_CAPABILITIES as capabilities,
  DIRECTOR_SCENE_ORCHESTRATION_ISSUE_SEVERITIES as severities,
  DIRECTOR_SCENE_ORCHESTRATION_RESULT_STATUSES as statuses,
  DIRECTOR_SCENE_ORCHESTRATION_SCOPES as scopes,
  createDirectorSceneOrchestrationBatch, createDirectorSceneOrchestrationIntent,
  createDirectorSceneOrchestrationIssue, createDirectorSceneOrchestrationPlanSource,
  createDirectorSceneOrchestrationRequest, createDirectorSceneOrchestrationResult,
  directorRuntimeSceneOrchestrationContractDescriptor as contractDescriptor,
  directorRuntimeSceneOrchestrationContracts as contracts,
  directorRuntimeSceneOrchestrationContractsRegistry as registry,
  directorSceneOrchestrationCapabilities as capabilityDescriptor,
  isDirectorSceneOrchestrationIntent, isDirectorSceneOrchestrationRequest,
  isDirectorSceneOrchestrationResult,
} from "./directorRuntimeSceneOrchestrationContracts.ts";
import { createDirectorSceneOrchestrationPlan }
  from "./directorRuntimeSceneOrchestrationFoundation.ts";

const factory = { subjectId: "factory", subjectKind: "Object" };
const shipping = { subjectId: "shipping", subjectKind: "Object" };
const customer = { subjectId: "customer", subjectKind: "Object" };
const kpi = { subjectId: "kpi-17", subjectKind: "KPI" };
const relationships = [
  { relationshipId: "factory-shipping", source: factory, target: shipping, relationshipKind: "flows-to" },
  { relationshipId: "shipping-customer", source: shipping, target: customer, relationshipKind: "delivers-to" },
];
const operation = { operationId: "focus-factory", kind: "focus" as const,
  subjects: [factory], relationships: [] };
const context = { runtimeContextId: "context-1", runtimeStateId: "state-1",
  workspace: "goal", lens: "object" };

function request() {
  return createDirectorSceneOrchestrationRequest({ requestId: "request-1", context,
    subjects: [factory, shipping, customer, kpi], relationships,
    requestedFocus: { primary: factory, secondary: [shipping, customer] },
    requestedAttention: [{ subject: kpi, level: "critical", reason: "upstream state" }],
    requestedPaths: [{ pathId: "delivery", subjects: [factory, shipping, customer], relationships }],
    requestedOperations: [operation],
  });
}

function plan() {
  const source = request();
  return createDirectorSceneOrchestrationPlan({ planId: "plan-1", context: source.context,
    focus: source.requestedFocus!, attention: source.requestedAttention,
    paths: source.requestedPaths, operations: source.requestedOperations });
}

test("publishes exact identity and sole DRI-3:1 Foundation dependency", () => {
  assert.deepEqual({ identity: contracts.identity, namespace: contracts.namespace,
    version: contracts.version, stage: contracts.stage, dependency: contracts.immediateDependency }, {
    identity: "DRI-3:2/DirectorRuntimeSceneOrchestrationContracts",
    namespace: "nexora.dri.scene.orchestration.contracts", version: "3.2.0",
    stage: "Contracts", dependency: "DRI-3:1/DirectorRuntimeSceneOrchestrationFoundation",
  });
  const source = readFileSync(new URL("./directorRuntimeSceneOrchestrationContracts.ts", import.meta.url), "utf8");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(imports)], ["@/app/lib/dri/directorRuntimeSceneOrchestrationFoundation"]);
  assert.doesNotMatch(source, /directorRuntimeSceneOrchestration(?:Model|Policy|Validation|Certification|Platform|Freeze|PublicIndex)/);
});

test("publishes exact ordered contract vocabularies", () => {
  assert.deepEqual(statuses, ["resolved", "partial", "rejected"]);
  assert.deepEqual(severities, ["notice", "warning", "error"]);
  assert.deepEqual(scopes, ["scene", "focus", "subject", "relationship", "path"]);
  assert.deepEqual(capabilities,
    ["focus", "attention", "visibility", "relationship", "path", "preservation"]);
  for (const values of [statuses, severities, scopes, capabilities])
    assert.equal(new Set(values).size, values.length);
});

test("constructs a complete request while preserving every semantic ordering", () => {
  const result = request();
  assert.equal(result.requestId, "request-1");
  assert.deepEqual(result.context, context);
  assert.deepEqual(result.subjects.map(({ subjectId }) => subjectId),
    ["factory", "shipping", "customer", "kpi-17"]);
  assert.deepEqual(result.relationships.map(({ relationshipId }) => relationshipId),
    ["factory-shipping", "shipping-customer"]);
  assert.deepEqual(result.requestedFocus, { primary: factory, secondary: [shipping, customer] });
  assert.equal(result.requestedAttention[0]?.level, "critical");
  assert.deepEqual(result.requestedPaths[0]?.subjects.map(({ subjectId }) => subjectId),
    ["factory", "shipping", "customer"]);
  assert.equal(result.requestedOperations[0]?.operationId, "focus-factory");
  assert.equal(Object.isFrozen(result), true);
  assert.equal(isDirectorSceneOrchestrationRequest(result), true);
});

test("normalizes optional request collections to independent immutable empties", () => {
  const one = createDirectorSceneOrchestrationRequest({ requestId: "empty-1", context });
  const two = createDirectorSceneOrchestrationRequest({ requestId: "empty-2", context });
  assert.deepEqual(one, { requestId: "empty-1", context, subjects: [], relationships: [],
    requestedFocus: null, requestedAttention: [], requestedPaths: [], requestedOperations: [] });
  assert.notEqual(one.subjects, two.subjects);
  assert.equal(Object.isFrozen(one.subjects), true);
});

test("constructs ordered immutable intent and batch contracts", () => {
  const second = { ...operation, operationId: "reveal-chain", kind: "reveal" as const,
    subjects: [factory, shipping, customer] };
  const firstIntent = createDirectorSceneOrchestrationIntent({ intentId: "focus-risk-chain",
    scope: "path", operations: [operation, second] });
  const secondIntent = createDirectorSceneOrchestrationIntent({ intentId: "preserve-customer",
    scope: "subject", operations: [{ ...operation, operationId: "preserve", kind: "preserve",
      subjects: [customer] }] });
  const batch = createDirectorSceneOrchestrationBatch({ batchId: "batch-1",
    intents: [firstIntent, secondIntent] });
  assert.deepEqual(firstIntent.operations.map(({ operationId }) => operationId),
    ["focus-factory", "reveal-chain"]);
  assert.deepEqual(batch.intents.map(({ intentId }) => intentId),
    ["focus-risk-chain", "preserve-customer"]);
  assert.equal(isDirectorSceneOrchestrationIntent(firstIntent), true);
  assert.equal(Object.isFrozen(batch.intents), true);
});

test("constructs issue and plan-source diagnostics without effects", () => {
  const issue = createDirectorSceneOrchestrationIssue({ code: "subject-unavailable",
    severity: "warning", message: "Subject is not currently available.", subjectId: "factory" });
  const source = createDirectorSceneOrchestrationPlanSource({ requestId: "request-1",
    runtimeContextId: "context-1", runtimeStateId: "state-1" });
  assert.deepEqual(issue, { code: "subject-unavailable", severity: "warning",
    message: "Subject is not currently available.", subjectId: "factory" });
  assert.deepEqual(source, { requestId: "request-1", runtimeContextId: "context-1",
    runtimeStateId: "state-1" });
  assert.equal(Object.isFrozen(issue), true);
  assert.equal(Object.isFrozen(source), true);
});

test("enforces resolved, partial, and rejected result consistency", () => {
  const resolved = createDirectorSceneOrchestrationResult({ requestId: "request-1",
    status: "resolved", plan: plan() });
  const partial = createDirectorSceneOrchestrationResult({ requestId: "request-1",
    status: "partial", plan: plan(), issues: [{ code: "limited", severity: "warning",
      message: "Usable with a limitation." }] });
  const rejected = createDirectorSceneOrchestrationResult({ requestId: "request-1",
    status: "rejected", plan: plan(), issues: [{ code: "invalid", severity: "error",
      message: "Request cannot be resolved." }] });
  const impossible = createDirectorSceneOrchestrationResult({ requestId: "request-1",
    status: "resolved", plan: null });
  assert.equal(resolved.plan?.planId, "plan-1");
  assert.equal(partial.plan?.planId, "plan-1");
  assert.equal(rejected.plan, null);
  assert.equal(impossible.status, "rejected");
  assert.equal(impossible.plan, null);
  assert.equal(impossible.issues[0]?.code, "missing-resolved-plan");
  for (const result of [resolved, partial, rejected, impossible]) {
    assert.equal(isDirectorSceneOrchestrationResult(result), true);
    assert.equal(Object.isFrozen(result), true);
    assert.equal(Object.isFrozen(result.issues), true);
  }
});

test("publishes immutable canonical capability and contract descriptors", () => {
  assert.deepEqual(capabilityDescriptor.supported, capabilities);
  assert.deepEqual(contractDescriptor, {
    id: "DRI-3:2/DirectorRuntimeSceneOrchestrationContracts",
    namespace: "nexora.dri.scene.orchestration.contracts", version: "3.2.0",
    capabilities: capabilityDescriptor,
  });
  assert.equal(Object.isFrozen(capabilityDescriptor), true);
  assert.equal(Object.isFrozen(contractDescriptor), true);
});

test("constructors are deterministic, JSON-safe, and do not mutate caller arrays", () => {
  const subjects = [{ ...factory }, { ...shipping }];
  const relationInput = relationships.map((value) => ({ ...value }));
  const input = { requestId: "deterministic", context: { ...context }, subjects,
    relationships: relationInput, requestedOperations: [operation] };
  const before = JSON.stringify(input);
  const one = createDirectorSceneOrchestrationRequest(input);
  const two = createDirectorSceneOrchestrationRequest(input);
  subjects.reverse(); relationInput.reverse();
  assert.deepEqual(one, two);
  assert.deepEqual(one.subjects.map(({ subjectId }) => subjectId), ["factory", "shipping"]);
  assert.deepEqual(JSON.parse(JSON.stringify(one)), one);
  subjects.reverse(); relationInput.reverse();
  assert.equal(JSON.stringify(input), before);
});

test("lightweight guards reject malformed shapes without becoming validation", () => {
  assert.equal(isDirectorSceneOrchestrationRequest(null), false);
  assert.equal(isDirectorSceneOrchestrationRequest({ requestId: "x" }), false);
  assert.equal(isDirectorSceneOrchestrationResult({ requestId: "x", status: "unknown", issues: [] }), false);
  assert.equal(isDirectorSceneOrchestrationResult({ requestId: "x", status: "resolved",
    plan: null, issues: [] }), false);
  assert.equal(isDirectorSceneOrchestrationIntent({ intentId: "x", scope: "viewport", operations: [] }), false);
});

test("registry publishes fifteen ordered concepts with dynamically derived counts", () => {
  assert.equal(registry.concepts.length, 15);
  const pairs: readonly [number, readonly unknown[]][] = [
    [registry.conceptCount, registry.concepts], [registry.resultStatusCount, registry.resultStatuses],
    [registry.issueSeverityCount, registry.issueSeverities], [registry.scopeCount, registry.scopes],
    [registry.capabilityCount, registry.capabilities], [registry.publicApiCount, registry.publicApis],
  ];
  for (const [count, values] of pairs) {
    assert.equal(count, values.length);
    assert.equal(new Set(values).size, values.length);
  }
  assert.equal(contracts.registry, registry);
  assert.equal(Object.isFrozen(registry), true);
});

test("contains no renderer, UI, policy, business inference, I/O, or nondeterminism", () => {
  const source = readFileSync(new URL("./directorRuntimeSceneOrchestrationContracts.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|three|@react-three|next)/i);
  assert.doesNotMatch(source, /\b(?:SceneRenderer|camera|viewport|coordinate|mesh|geometry|material|color|animation)\b/i);
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID|fetch|localStorage|indexedDB|process\.env)\b/);
  assert.doesNotMatch(source, /\b(?:rank|score|infer|calculateKpi|resolveConflict|mutateScene|render|dispatch|subscribe)\s*\(/i);
  assert.doesNotMatch(source, /from\s+["']node:(?:fs|path)|readFile|writeFile/);
});
