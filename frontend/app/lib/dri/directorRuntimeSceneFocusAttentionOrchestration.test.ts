import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_SCENE_ATTENTION_PRIORITY as attentionPriority,
  DIRECTOR_SCENE_FOCUS_ATTENTION_POLICY_PRECEDENCE as policyPrecedence,
  DIRECTOR_SCENE_FOCUS_RESOLUTION_REASONS as focusReasons,
  directorRuntimeSceneFocusAttentionOrchestration as descriptor,
  directorRuntimeSceneFocusAttentionOrchestrationRegistry as registry,
  rankDirectorSceneAttention, resolveDirectorSceneFocus,
  resolveDirectorSceneFocusAttentionOrchestration,
} from "./directorRuntimeSceneFocusAttentionOrchestration.ts";
import type { DirectorSceneOrchestrationPlan } from "./directorRuntimeSceneOrchestrationModel.ts";

const factory = { subjectId: "factory", subjectKind: "Object" };
const supplier = { subjectId: "supplier", subjectKind: "Object" };
const shipping = { subjectId: "shipping", subjectKind: "Object" };
const customer = { subjectId: "customer", subjectKind: "Object" };
const kpi = { subjectId: "kpi-17", subjectKind: "KPI" };
const context = { runtimeContextId: "context-1", runtimeStateId: "state-1",
  workspace: "Goal", lens: "Object" };

function plan(overrides: Partial<DirectorSceneOrchestrationPlan> = {}): DirectorSceneOrchestrationPlan {
  return { planId: "request-1:scene-orchestration-plan", context,
    focus: { primary: factory, secondary: [shipping] }, attention: [], paths: [], operations: [],
    ...overrides };
}
const op = (operationId: string, kind: DirectorSceneOrchestrationPlan["operations"][number]["kind"],
  subjects: readonly typeof factory[]) => ({ operationId, kind, subjects, relationships: [] });

test("publishes exact identity and sole DRI-3:3 Model dependency", () => {
  assert.deepEqual({ phase: descriptor.phase, name: descriptor.name, identity: descriptor.identity,
    namespace: descriptor.namespace, version: descriptor.version,
    dependency: descriptor.immediateDependency }, {
    phase: "DRI-3:4", name: "DirectorRuntimeSceneFocusAttentionOrchestration",
    identity: "DRI-3:4/DirectorRuntimeSceneFocusAttentionOrchestration",
    namespace: "nexora.dri.scene.orchestration.focus-attention", version: "3.4.0",
    dependency: "DRI-3:3/DirectorRuntimeSceneOrchestrationModel",
  });
  const source = readFileSync(new URL("./directorRuntimeSceneFocusAttentionOrchestration.ts",
    import.meta.url), "utf8");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeSceneOrchestrationModel"]);
  assert.doesNotMatch(source, /directorRuntimeSceneOrchestration(?:Foundation|Contracts|Validation|Certification|Platform|Freeze|PublicIndex)/);
});

test("ranks attention by semantic level with stable equal-level order", () => {
  const result = rankDirectorSceneAttention([
    { subject: supplier, level: "important" }, { subject: factory, level: "critical" },
    { subject: customer, level: "important" }, { subject: shipping, level: "notice" },
  ]);
  assert.deepEqual(result.ordered.map(({ subject }) => subject.subjectId),
    ["factory", "supplier", "customer", "shipping"]);
  assert.equal(result.highest?.subject.subjectId, "factory");
  assert.deepEqual(attentionPriority, ["critical", "important", "notice", "normal"]);
});

test("attention deduplication keeps the strongest level and first stable subject position", () => {
  const result = rankDirectorSceneAttention([
    { subject: factory, level: "notice", reason: "first" },
    { subject: supplier, level: "critical" },
    { subject: factory, level: "critical", reason: "strongest" },
    { subject: factory, level: "critical", reason: "equal-later" },
  ]);
  assert.deepEqual(result.ordered.map(({ subject }) => subject.subjectId), ["factory", "supplier"]);
  assert.equal(result.ordered[0]?.level, "critical");
  assert.equal(result.ordered[0]?.reason, "strongest");
});

test("preserves explicit primary and builds unique stable secondary focus", () => {
  const input = plan({ focus: { primary: factory, secondary: [shipping, factory, customer] },
    attention: [{ subject: kpi, level: "critical" }, { subject: shipping, level: "important" }],
    operations: [op("emphasize", "emphasize", [supplier, kpi])],
    paths: [{ pathId: "path", subjects: [customer, factory], relationships: [] }] });
  const focus = resolveDirectorSceneFocus(input);
  assert.equal(focus.primary?.subjectId, "factory");
  assert.equal(focus.reason, "explicit-primary");
  assert.deepEqual(focus.secondary.map(({ subjectId }) => subjectId),
    ["shipping", "customer", "kpi-17", "supplier"]);
  assert.equal(new Set(focus.secondary.map(({ subjectId }) => subjectId)).size, focus.secondary.length);
});

test("resolves no-explicit-focus conflicts by focus operation, attention, preserve, then none", () => {
  const emptyFocus = { primary: null, secondary: [] };
  assert.equal(resolveDirectorSceneFocus(plan({ focus: emptyFocus,
    attention: [{ subject: supplier, level: "critical" }, { subject: factory, level: "critical" }] }))
    .primary?.subjectId, "supplier");
  assert.equal(resolveDirectorSceneFocus(plan({ focus: emptyFocus,
    attention: [{ subject: supplier, level: "critical" }],
    operations: [op("focus-customer", "focus", [customer])] })).primary?.subjectId, "customer");
  assert.equal(resolveDirectorSceneFocus(plan({ focus: emptyFocus,
    operations: [op("preserve-shipping", "preserve", [shipping])] })).primary?.subjectId, "shipping");
  assert.equal(resolveDirectorSceneFocus(plan({ focus: emptyFocus })).primary, null);
});

test("emphasize wins over deemphasize and strong attention prevents deemphasis", () => {
  const resolved = resolveDirectorSceneFocusAttentionOrchestration(plan({
    attention: [{ subject: kpi, level: "critical" }],
    operations: [op("emphasize-factory", "emphasize", [factory]),
      op("deemphasize-factory", "deemphasize", [factory]),
      op("deemphasize-kpi", "deemphasize", [kpi]),
      op("deemphasize-supplier", "deemphasize", [supplier])],
  }));
  assert.deepEqual(resolved.operations.filter(({ kind }) => kind === "emphasize")
    .flatMap(({ subjects }) => subjects.map(({ subjectId }) => subjectId)), ["factory"]);
  assert.deepEqual(resolved.operations.filter(({ kind }) => kind === "deemphasize")
    .flatMap(({ subjects }) => subjects.map(({ subjectId }) => subjectId)), ["supplier"]);
});

test("focus and strong attention defeat conceal while reveal defeats conceal", () => {
  const resolved = resolveDirectorSceneFocusAttentionOrchestration(plan({
    attention: [{ subject: kpi, level: "important" }],
    operations: [op("conceal-factory", "conceal", [factory]),
      op("conceal-kpi", "conceal", [kpi]), op("reveal-shipping", "reveal", [shipping]),
      op("conceal-shipping", "conceal", [shipping]), op("conceal-supplier", "conceal", [supplier])],
  }));
  const concealed = resolved.operations.filter(({ kind }) => kind === "conceal")
    .flatMap(({ subjects }) => subjects.map(({ subjectId }) => subjectId));
  assert.deepEqual(concealed, ["supplier"]);
  const revealed = resolved.operations.filter(({ kind }) => kind === "reveal")
    .flatMap(({ subjects }) => subjects.map(({ subjectId }) => subjectId));
  assert.ok(revealed.includes("factory"));
  assert.ok(revealed.includes("kpi-17"));
  assert.ok(revealed.includes("shipping"));
});

test("normalizes exact duplicate and competing focus operations", () => {
  const resolved = resolveDirectorSceneFocusAttentionOrchestration(plan({ operations: [
    op("focus-factory-1", "focus", [factory]), op("focus-factory-2", "focus", [factory]),
    op("focus-customer", "focus", [customer]),
  ] }));
  const focus = resolved.operations.filter(({ kind }) => kind === "focus");
  assert.equal(focus.length, 1);
  assert.equal(focus[0]?.subjects[0]?.subjectId, "factory");
});

test("prioritizes paths by primary focus, then highest attention, then supplied order", () => {
  const relation = { relationshipId: "factory-shipping", source: factory, target: shipping };
  const resolved = resolveDirectorSceneFocusAttentionOrchestration(plan({
    attention: [{ subject: kpi, level: "critical" }], paths: [
      { pathId: "neutral-a", subjects: [supplier, customer], relationships: [] },
      { pathId: "attention", subjects: [shipping, kpi], relationships: [relation] },
      { pathId: "primary", subjects: [factory, shipping], relationships: [relation] },
      { pathId: "neutral-b", subjects: [customer], relationships: [] },
    ] }));
  assert.deepEqual(resolved.paths.map(({ pathId }) => pathId),
    ["primary", "attention", "neutral-a", "neutral-b"]);
  assert.deepEqual(resolved.paths[0]?.relationships.map(({ relationshipId }) => relationshipId),
    ["factory-shipping"]);
});

test("preserves plan lineage, context, and identity exactly", () => {
  const input = plan({ attention: [{ subject: kpi, level: "critical" }] });
  const resolved = resolveDirectorSceneFocusAttentionOrchestration(input);
  assert.equal(resolved.planId, input.planId);
  assert.deepEqual(resolved.context, context);
});

test("is deterministic, source-immutable, output-immutable, JSON-safe, and idempotent", () => {
  const input = plan({ attention: [{ subject: supplier, level: "important" },
    { subject: kpi, level: "critical" }], operations: [
    op("conceal-kpi", "conceal", [kpi]), op("deemphasize-kpi", "deemphasize", [kpi]),
  ] });
  const before = JSON.stringify(input);
  const one = resolveDirectorSceneFocusAttentionOrchestration(input);
  const two = resolveDirectorSceneFocusAttentionOrchestration(input);
  const again = resolveDirectorSceneFocusAttentionOrchestration(one);
  assert.deepEqual(one, two);
  assert.deepEqual(again, one);
  assert.equal(JSON.stringify(input), before);
  assert.deepEqual(JSON.parse(JSON.stringify(one)), one);
  assert.equal(Object.isFrozen(one), true);
  assert.equal(Object.isFrozen(one.focus), true);
  assert.equal(Object.isFrozen(one.attention), true);
  assert.equal(Object.isFrozen(one.paths), true);
  assert.equal(Object.isFrozen(one.operations), true);
});

test("publishes immutable ordered policy metadata and dynamically derived registry counts", () => {
  assert.deepEqual(focusReasons,
    ["explicit-primary", "attention-priority", "operation-priority", "preserved", "none"]);
  assert.deepEqual(policyPrecedence, ["explicit-primary", "preserve", "critical-attention",
    "important-attention", "explicit-reveal", "explicit-emphasize", "notice-attention",
    "normal-attention", "deemphasize", "conceal"]);
  const pairs: readonly [number, readonly unknown[]][] = [
    [registry.conceptCount, registry.concepts],
    [registry.focusResolutionReasonCount, registry.focusResolutionReasons],
    [registry.attentionPriorityCount, registry.attentionPriority],
    [registry.policyPrecedenceCount, registry.policyPrecedence],
    [registry.publicApiCount, registry.publicApis],
  ];
  for (const [count, values] of pairs) {
    assert.equal(count, values.length);
    assert.equal(new Set(values).size, values.length);
  }
  assert.equal(descriptor.registry, registry);
  assert.equal(Object.isFrozen(registry), true);
});

test("contains no renderer, NOL mutation, visual/business policy, AI, I/O, or nondeterminism", () => {
  const source = readFileSync(new URL("./directorRuntimeSceneFocusAttentionOrchestration.ts",
    import.meta.url), "utf8");
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|three|@react-three|next)/i);
  assert.doesNotMatch(source, /\b(?:SceneRenderer|Canvas|WebGL|SVG|camera|viewport|coordinate|mesh|geometry|material|shader|color|opacity|glow|pulse|scale|animation)\b/i);
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID|fetch|localStorage|indexedDB|process\.env)\b/);
  assert.doesNotMatch(source, /\b(?:calculateKpi|calculateKoi|rankScenario|approveDecision|subjectKind\s*===|workspace\s*===|lens\s*===|openai|anthropic|llm)\b/i);
  assert.doesNotMatch(source, /\b(?:sceneNode\.|scene\.(?:add|remove|focus))|from\s+["']node:(?:fs|path)|readFile|writeFile/);
});
