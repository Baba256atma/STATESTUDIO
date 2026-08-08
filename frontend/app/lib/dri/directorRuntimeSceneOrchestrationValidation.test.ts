import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_SCENE_ORCHESTRATION_VALIDATION_CATEGORIES as categories,
  DIRECTOR_SCENE_ORCHESTRATION_VALIDATION_SEVERITIES as severities,
  DIRECTOR_SCENE_ORCHESTRATION_VALIDATION_STATUSES as statuses,
  directorRuntimeSceneOrchestrationValidation as descriptor,
  directorRuntimeSceneOrchestrationValidationRegistry as registry,
  directorSceneOrchestrationValidationRules as rules,
  isDirectorRuntimeSceneOrchestrationValid,
  validateDirectorRuntimeSceneOrchestration,
} from "./directorRuntimeSceneOrchestrationValidation.ts";
import type { DirectorSceneOrchestrationPlan }
  from "./directorRuntimeSceneFocusAttentionOrchestration.ts";

const factory = { subjectId: "factory", subjectKind: "Object" };
const shipping = { subjectId: "shipping", subjectKind: "Object" };
const customer = { subjectId: "customer", subjectKind: "Object" };
const kpi = { subjectId: "kpi-17", subjectKind: "KPI" };
const relationships = [
  { relationshipId: "factory-shipping", source: factory, target: shipping },
  { relationshipId: "shipping-customer", source: shipping, target: customer },
];

function validPlan(overrides: Partial<DirectorSceneOrchestrationPlan> = {}): DirectorSceneOrchestrationPlan {
  return { planId: "request-1:scene-orchestration-plan",
    context: { runtimeContextId: "context-1", runtimeStateId: "state-1" },
    focus: { primary: factory, secondary: [shipping, kpi] },
    attention: [{ subject: kpi, level: "critical" }, { subject: shipping, level: "important" }],
    paths: [{ pathId: "delivery", subjects: [factory, shipping, customer], relationships }],
    operations: [
      { operationId: "reveal-factory", kind: "reveal", subjects: [factory], relationships: [] },
      { operationId: "reveal-kpi", kind: "reveal", subjects: [kpi], relationships: [] },
      { operationId: "reveal-shipping", kind: "reveal", subjects: [shipping], relationships: [] },
      { operationId: "relate-factory-shipping", kind: "relate",
        subjects: [factory, shipping], relationships: [relationships[0]!] },
      { operationId: "relate-shipping-customer", kind: "relate",
        subjects: [shipping, customer], relationships: [relationships[1]!] },
      { operationId: "focus-factory", kind: "focus", subjects: [factory], relationships: [] },
      { operationId: "attention-kpi", kind: "attention", subjects: [kpi], relationships: [] },
      { operationId: "attention-shipping", kind: "attention", subjects: [shipping], relationships: [] },
    ], ...overrides };
}

test("publishes exact identity and sole DRI-3:4 dependency", () => {
  assert.deepEqual({ phase: descriptor.phase, name: descriptor.name, identity: descriptor.identity,
    namespace: descriptor.namespace, version: descriptor.version,
    dependency: descriptor.immediateDependency }, {
    phase: "DRI-3:5", name: "DirectorRuntimeSceneOrchestrationValidation",
    identity: "DRI-3:5/DirectorRuntimeSceneOrchestrationValidation",
    namespace: "nexora.dri.scene.orchestration.validation", version: "3.5.0",
    dependency: "DRI-3:4/DirectorRuntimeSceneFocusAttentionOrchestration",
  });
  const source = readFileSync(new URL("./directorRuntimeSceneOrchestrationValidation.ts",
    import.meta.url), "utf8");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeSceneFocusAttentionOrchestration"]);
  assert.doesNotMatch(source, /directorRuntimeSceneOrchestration(?:Foundation|Contracts|Model|Certification|Platform|Freeze|PublicIndex)/);
});

test("publishes exact stable validation vocabularies and immutable rule registry", () => {
  assert.deepEqual(statuses, ["valid", "invalid"]);
  assert.deepEqual(severities, ["notice", "warning", "error"]);
  assert.deepEqual(categories, ["identity", "context", "focus", "attention", "relationship",
    "path", "operation", "lineage", "consistency", "ordering"]);
  assert.equal(new Set(rules.map(({ ruleId }) => ruleId)).size, rules.length);
  assert.equal(Object.isFrozen(rules), true);
  assert.ok(rules.every(Object.isFrozen));
});

test("validates canonical and empty plans with deterministic identities", () => {
  const report = validateDirectorRuntimeSceneOrchestration(validPlan());
  assert.equal(report.status, "valid");
  assert.deepEqual(report.findings, []);
  assert.equal(report.validationId,
    "request-1:scene-orchestration-plan:DRI-3:5:validation");
  assert.equal(isDirectorRuntimeSceneOrchestrationValid(validPlan()), true);
  const empty = validPlan({ planId: "empty:scene-orchestration-plan",
    focus: { primary: null, secondary: [] }, attention: [], paths: [], operations: [] });
  assert.equal(validateDirectorRuntimeSceneOrchestration(empty).status, "valid");
});

test("reports missing plan/context identity and invalid request-plan lineage without repair", () => {
  const input = validPlan({ planId: "", context: { runtimeContextId: "" } });
  const before = JSON.stringify(input);
  const report = validateDirectorRuntimeSceneOrchestration(input);
  assert.equal(report.status, "invalid");
  assert.deepEqual(report.findings.map(({ code }) => code),
    ["plan-id-missing", "runtime-context-id-missing", "plan-lineage-invalid"]);
  assert.equal(JSON.stringify(input), before);
});

test("validates focus reference, uniqueness, and visibility invariants", () => {
  const input = validPlan({ focus: { primary: factory, secondary: [factory, shipping, shipping,
    { subjectId: "", subjectKind: "Object" }] }, operations: [
    { operationId: "conceal-factory", kind: "conceal", subjects: [factory], relationships: [] },
    { operationId: "focus-factory", kind: "focus", subjects: [factory], relationships: [] },
  ] });
  const codes = validateDirectorRuntimeSceneOrchestration(input).findings.map(({ code }) => code);
  assert.ok(codes.includes("invalid-secondary-reference"));
  assert.ok(codes.includes("primary-also-secondary"));
  assert.ok(codes.includes("duplicate-secondary-focus"));
  assert.ok(codes.includes("focus-primary-concealed"));
});

test("validates attention vocabulary, integrity, uniqueness, order, visibility, and prominence", () => {
  const malformed = { subject: { subjectId: "", subjectKind: "KPI" }, level: "urgent" } as never;
  const input = validPlan({ attention: [{ subject: shipping, level: "notice" },
    { subject: kpi, level: "critical" }, { subject: kpi, level: "important" }, malformed],
  operations: [
    { operationId: "conceal-kpi", kind: "conceal", subjects: [kpi], relationships: [] },
    { operationId: "deemphasize-kpi", kind: "deemphasize", subjects: [kpi], relationships: [] },
  ] });
  const codes = validateDirectorRuntimeSceneOrchestration(input).findings.map(({ code }) => code);
  for (const code of ["invalid-attention-level", "invalid-attention-subject",
    "duplicate-attention-subject", "attention-order-invalid", "strong-attention-concealed",
    "strong-attention-deemphasized"]) assert.ok(codes.includes(code), code);
});

test("validates relationship references, path identity, references, direction, and continuity", () => {
  const badRelationship = { relationshipId: "", source: { subjectId: "", subjectKind: "Object" },
    target: customer };
  const input = validPlan({ paths: [
    { pathId: "", subjects: [factory, shipping, customer], relationships: [
      relationships[0]!, { relationshipId: "wrong-direction", source: customer, target: shipping },
    ] },
    { pathId: "bad-reference", subjects: [factory, { subjectId: "", subjectKind: "Object" }],
      relationships: [badRelationship] },
  ], operations: [{ operationId: "bad-relate", kind: "relate", subjects: [factory],
    relationships: [badRelationship] }] });
  const codes = validateDirectorRuntimeSceneOrchestration(input).findings.map(({ code }) => code);
  for (const code of ["invalid-relationship-reference", "path-id-missing", "invalid-path-subject",
    "invalid-path-relationship", "path-relationship-continuity", "relate-relationship-missing"])
    assert.ok(codes.includes(code), code);
});

test("validates operation kind, identity, subject, order, duplicates, and relate integrity", () => {
  const duplicate = { operationId: "duplicate-reveal", kind: "reveal" as const,
    subjects: [factory], relationships: [] };
  const input = validPlan({ operations: [
    { operationId: "focus-first", kind: "focus", subjects: [customer], relationships: [] },
    { operationId: "", kind: "reveal", subjects: [factory], relationships: [] }, duplicate,
    { operationId: "unknown", kind: "flash" as never, subjects: [factory], relationships: [] },
    { operationId: "bad-subject", kind: "preserve",
      subjects: [{ subjectId: "", subjectKind: "Object" }], relationships: [] },
    { operationId: "relate-empty", kind: "relate", subjects: [factory], relationships: [] },
  ] });
  const codes = validateDirectorRuntimeSceneOrchestration(input).findings.map(({ code }) => code);
  for (const code of ["operation-id-missing", "invalid-operation-kind", "invalid-operation-subject",
    "operation-order-invalid", "duplicate-semantic-operation", "relate-relationship-missing",
    "focus-operation-mismatch"]) assert.ok(codes.includes(code), code);
});

test("detects unresolved reveal/conceal and emphasize/deemphasize conflicts", () => {
  const input = validPlan({ operations: [
    { operationId: "reveal-customer", kind: "reveal", subjects: [customer], relationships: [] },
    { operationId: "conceal-customer", kind: "conceal", subjects: [customer], relationships: [] },
    { operationId: "emphasize-customer", kind: "emphasize", subjects: [customer], relationships: [] },
    { operationId: "deemphasize-customer", kind: "deemphasize", subjects: [customer], relationships: [] },
  ] });
  const codes = validateDirectorRuntimeSceneOrchestration(input).findings.map(({ code }) => code);
  assert.ok(codes.includes("reveal-conceal-conflict"));
  assert.ok(codes.includes("emphasize-deemphasize-conflict"));
});

test("finding order follows rule registry order and encounter order", () => {
  const report = validateDirectorRuntimeSceneOrchestration(validPlan({ planId: "",
    context: { runtimeContextId: "" }, focus: { primary: factory, secondary: [factory] } }));
  const indices = report.findings.map(({ ruleId }) => rules.findIndex((rule) => rule.ruleId === ruleId));
  assert.deepEqual(indices, [...indices].sort((left, right) => left - right));
  assert.deepEqual(report.checkedRuleIds, rules.map(({ ruleId }) => ruleId));
});

test("reports are immutable, deterministic, idempotent, JSON-safe, and source-preserving", () => {
  const input = validPlan(); const before = JSON.stringify(input);
  const one = validateDirectorRuntimeSceneOrchestration(input);
  const two = validateDirectorRuntimeSceneOrchestration(input);
  assert.deepEqual(one, two);
  assert.equal(JSON.stringify(input), before);
  assert.equal(Object.isFrozen(one), true);
  assert.equal(Object.isFrozen(one.findings), true);
  assert.equal(Object.isFrozen(one.checkedRuleIds), true);
  assert.deepEqual(JSON.parse(JSON.stringify(one)), one);
  assert.equal(one.errorCount, one.findings.filter(({ severity }) => severity === "error").length);
  assert.equal(one.warningCount, one.findings.filter(({ severity }) => severity === "warning").length);
  assert.equal(one.noticeCount, one.findings.filter(({ severity }) => severity === "notice").length);
});

test("registry counts are derived and descriptor surfaces remain consistent", () => {
  const pairs: readonly [number, readonly unknown[]][] = [
    [registry.conceptCount, registry.concepts], [registry.statusCount, registry.statuses],
    [registry.severityCount, registry.severities], [registry.categoryCount, registry.categories],
    [registry.ruleCount, registry.rules], [registry.publicApiCount, registry.publicApis],
  ];
  for (const [count, values] of pairs) assert.equal(count, values.length);
  assert.equal(descriptor.registry, registry);
  assert.equal(descriptor.rules, rules);
  assert.equal(Object.isFrozen(registry), true);
});

test("contains no repair, renderer, NOL mutation, visual/business policy, AI, I/O, or nondeterminism", () => {
  const source = readFileSync(new URL("./directorRuntimeSceneOrchestrationValidation.ts",
    import.meta.url), "utf8");
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|three|@react-three|next)/i);
  assert.doesNotMatch(source, /\b(?:SceneRenderer|Canvas|WebGL|camera|viewport|coordinate|mesh|geometry|material|shader|color|opacity|glow|animation)\b/i);
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID|fetch|localStorage|indexedDB|process\.env)\b/);
  assert.doesNotMatch(source, /\b(?:repair|normalize|calculateKpi|calculateKoi|rankScenario|approveDecision|openai|anthropic|llm)\s*\(/i);
  assert.doesNotMatch(source, /\b(?:sceneNode\.|scene\.(?:add|remove|focus))|from\s+["']node:(?:fs|path)|readFile|writeFile/);
});
