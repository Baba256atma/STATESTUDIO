import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_SCENE_ATTENTION_LEVELS as attentionLevels,
  DIRECTOR_SCENE_ORCHESTRATION_OPERATION_KINDS as operationKinds,
  createDirectorSceneAttention, createDirectorSceneFocus,
  createDirectorSceneOrchestrationOperation, createDirectorSceneOrchestrationPlan,
  createDirectorScenePath, createDirectorSceneRelationshipRef, createDirectorSceneSubjectRef,
  createEmptyDirectorSceneOrchestrationPlan,
  directorRuntimeSceneOrchestrationFoundation as foundation,
  directorRuntimeSceneOrchestrationFoundationRegistry as registry,
  type DirectorSceneSubjectRef,
} from "./directorRuntimeSceneOrchestrationFoundation.ts";

const factory = { subjectId: "factory", subjectKind: "Object" };
const kpi = { subjectId: "throughput", subjectKind: "KPI" };
const customer = { subjectId: "customer", subjectKind: "Object" };
const context = { runtimeContextId: "context-1", runtimeStateId: "state-1", mode: "executive" };

test("publishes exact immutable Foundation identity and sole DRI-2:9 dependency", () => {
  assert.deepEqual({ phase: foundation.phase, name: foundation.name, identity: foundation.identity,
    namespace: foundation.namespace, version: foundation.version }, {
    phase: "DRI-3:1", name: "DirectorRuntimeSceneOrchestrationFoundation",
    identity: "DRI-3:1/DirectorRuntimeSceneOrchestrationFoundation",
    namespace: "nexora.dri.scene.orchestration.foundation", version: "3.1.0",
  });
  assert.equal(foundation.stage, "Foundation");
  assert.equal(foundation.upstreamDependency,
    "DRI-2:9/DirectorRuntimeStateContextBindingPublicIndex");
  const source = readFileSync(new URL("./directorRuntimeSceneOrchestrationFoundation.ts", import.meta.url), "utf8");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(imports, ["@/app/lib/dri/directorRuntimeStateContextBindingPublicIndex"]);
  assert.equal(Object.isFrozen(foundation), true);
});

test("publishes exact canonical operation and attention vocabularies", () => {
  assert.deepEqual(operationKinds,
    ["focus", "emphasize", "deemphasize", "reveal", "conceal", "relate", "attention", "preserve"]);
  assert.deepEqual(attentionLevels, ["normal", "notice", "important", "critical"]);
  assert.equal(new Set(operationKinds).size, operationKinds.length);
  assert.equal(new Set(attentionLevels).size, attentionLevels.length);
});

test("constructs immutable subject and relationship references without owning inputs", () => {
  const source = { ...factory, namespace: "nexora" };
  const target = { ...kpi };
  const subject = createDirectorSceneSubjectRef(source);
  const relationship = createDirectorSceneRelationshipRef({ relationshipId: "r1", source, target,
    relationshipKind: "measures" });
  source.subjectId = "changed";
  target.subjectId = "changed";
  assert.equal(subject.subjectId, "factory");
  assert.equal(relationship.source.subjectId, "factory");
  assert.equal(relationship.target.subjectId, "throughput");
  assert.equal(Object.isFrozen(subject), true);
  assert.equal(Object.isFrozen(relationship.source), true);
  assert.equal(Object.isFrozen(relationship), true);
});

test("focus uses stable first-occurrence duplicate normalization", () => {
  const duplicate = { ...kpi };
  const focus = createDirectorSceneFocus({ primary: factory,
    secondary: [kpi, duplicate, customer, factory, kpi] });
  assert.deepEqual(focus, { primary: factory, secondary: [kpi, customer] });
  assert.equal(Object.isFrozen(focus.secondary), true);
});

test("constructs attention without ranking or visual semantics", () => {
  const attention = createDirectorSceneAttention({ subject: kpi, level: "critical",
    reason: "Upstream state requires attention." });
  assert.deepEqual(attention, { subject: kpi, level: "critical",
    reason: "Upstream state requires attention." });
  assert.equal(Object.isFrozen(attention), true);
});

test("preserves supplied path and relationship ordering", () => {
  const relationships = [
    { relationshipId: "r1", source: factory, target: kpi },
    { relationshipId: "r2", source: kpi, target: customer },
  ];
  const path = createDirectorScenePath({ pathId: "path-1", subjects: [factory, kpi, customer],
    relationships });
  assert.deepEqual(path.subjects.map(({ subjectId }) => subjectId), ["factory", "throughput", "customer"]);
  assert.deepEqual(path.relationships.map(({ relationshipId }) => relationshipId), ["r1", "r2"]);
  assert.equal(Object.isFrozen(path.subjects), true);
  assert.equal(Object.isFrozen(path.relationships), true);
});

test("constructs operations and complete plans in caller order", () => {
  const relation = { relationshipId: "r1", source: factory, target: kpi };
  const operation = createDirectorSceneOrchestrationOperation({ operationId: "op-1",
    kind: "emphasize", subjects: [kpi, kpi], relationships: [relation], reason: "critical" });
  const attentionInput = [
    { subject: kpi, level: "critical" as const },
    { subject: customer, level: "important" as const },
  ];
  const operationsInput = [operation, { operationId: "op-2", kind: "reveal" as const,
    subjects: [factory, customer], relationships: [relation] }];
  const plan = createDirectorSceneOrchestrationPlan({ planId: "plan-1", context,
    focus: { primary: factory, secondary: [kpi] }, attention: attentionInput,
    paths: [{ pathId: "path-1", subjects: [factory, kpi], relationships: [relation] }],
    operations: operationsInput });
  assert.deepEqual(plan.operations.map(({ operationId }) => operationId), ["op-1", "op-2"]);
  assert.deepEqual(plan.attention.map(({ subject }) => subject.subjectId), ["throughput", "customer"]);
  assert.equal(operation.subjects.length, 1);
  assert.equal(Object.isFrozen(plan), true);
  assert.equal(Object.isFrozen(plan.operations), true);
  assert.equal(Object.isFrozen(plan.operations[0]), true);
  assert.deepEqual(JSON.parse(JSON.stringify(plan)), plan);
});

test("empty plans use independent frozen collections", () => {
  const first = createEmptyDirectorSceneOrchestrationPlan({ planId: "empty-1", context });
  const second = createEmptyDirectorSceneOrchestrationPlan({ planId: "empty-2", context });
  assert.deepEqual(first.focus, { primary: null, secondary: [] });
  assert.deepEqual([first.attention, first.paths, first.operations], [[], [], []]);
  assert.notEqual(first.attention, second.attention);
  assert.notEqual(first.paths, second.paths);
  assert.notEqual(first.operations, second.operations);
  assert.equal(Object.isFrozen(first.attention), true);
});

test("construction is deterministic and leaves source arrays and objects unchanged", () => {
  const secondary: DirectorSceneSubjectRef[] = [{ ...kpi }, { ...customer }];
  const input = { planId: "p", context: { ...context }, focus: { primary: { ...factory }, secondary },
    attention: [{ subject: { ...kpi }, level: "notice" as const }], paths: [], operations: [] };
  const before = JSON.stringify(input);
  const one = createDirectorSceneOrchestrationPlan(input);
  const two = createDirectorSceneOrchestrationPlan(input);
  secondary.reverse();
  assert.deepEqual(one, two);
  assert.deepEqual(one.focus.secondary.map(({ subjectId }) => subjectId), ["throughput", "customer"]);
  assert.equal(before, JSON.stringify({ ...input, focus: { ...input.focus,
    secondary: [...secondary].reverse() } }));
});

test("registry is ordered, immutable, and all counts derive from surfaces", () => {
  const pairs: readonly [number, readonly unknown[]][] = [
    [registry.conceptCount, registry.concepts], [registry.contractCount, registry.contracts],
    [registry.operationKindCount, registry.operationKinds],
    [registry.attentionLevelCount, registry.attentionLevels],
    [registry.publicApiCount, registry.publicApis],
  ];
  for (const [count, values] of pairs) {
    assert.equal(count, values.length);
    assert.equal(new Set(values).size, values.length);
  }
  assert.deepEqual(registry.concepts, ["Subject Reference", "Relationship Reference", "Focus",
    "Attention", "Path", "Operation", "Context", "Orchestration Plan"]);
  assert.equal(registry.duplicateSubjectRule, "stable-first-occurrence");
  assert.equal(foundation.registry, registry);
  assert.equal(Object.isFrozen(registry), true);
});

test("contains no renderer, UI, executive, KPI, I/O, or nondeterministic behavior", () => {
  const source = readFileSync(new URL("./directorRuntimeSceneOrchestrationFoundation.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|three|@react-three|next)/i);
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID|fetch|localStorage|indexedDB|process\.env)\b/);
  assert.doesNotMatch(source, /\b(?:mesh|geometry|material|shader|camera|viewport|pixel|coordinate|opacity|glow|animation)\b/i);
  assert.doesNotMatch(source, /\b(?:calculateKpi|rankScenario|approveDecision|executeAction|render|dispatch|subscribe)\s*\(/i);
  assert.doesNotMatch(source, /from\s+["']node:(?:fs|path)|readFile|writeFile/);
});
