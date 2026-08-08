import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_INTERACTION_KINDS as interactionKinds,
  DIRECTOR_INTERACTION_LIFECYCLE_VALUES as lifecycleValues,
  DIRECTOR_INTERACTION_QUALIFIERS as qualifiers,
  DIRECTOR_INTERACTION_SCOPES as scopes,
  DIRECTOR_INTERACTION_SOURCES as interactionSources,
  DIRECTOR_INTERACTION_TARGET_KINDS as targetKinds,
  compareDirectorInteractionSequence,
  createDirectorInteractionObservation,
  createDirectorInteractionTarget,
  directorRuntimeInteractionOrchestrationFoundation as foundation,
  directorRuntimeInteractionOrchestrationFoundationRegistry as registry,
  normalizeDirectorInteractionKind,
  normalizeDirectorInteractionLifecycle,
  normalizeDirectorInteractionScope,
  normalizeDirectorInteractionSource,
  normalizeDirectorInteractionTargetKind,
  verifyDirectorRuntimeInteractionOrchestrationFoundation,
  type CreateDirectorInteractionObservationInput,
  type CreateDirectorInteractionTargetInput,
} from "./directorRuntimeInteractionOrchestrationFoundation.ts";

const source = readFileSync(
  new URL("./directorRuntimeInteractionOrchestrationFoundation.ts", import.meta.url),
  "utf8",
);

test("1–4. publishes exact DRI-4:1 identity, version, namespace, and sole DRI-3:9 upstream", () => {
  assert.deepEqual({
    phase: foundation.phase,
    name: foundation.name,
    identity: foundation.identity,
    namespace: foundation.namespace,
    version: foundation.version,
    layer: foundation.layer,
    stage: foundation.stage,
  }, {
    phase: "DRI-4:1",
    name: "DirectorRuntimeInteractionOrchestrationFoundation",
    identity: "DRI-4:1/DirectorRuntimeInteractionOrchestrationFoundation",
    namespace: "nexora.dri.interaction.orchestration.foundation",
    version: "4.1.0",
    layer: "DirectorRuntimeInteractionOrchestration",
    stage: "Foundation",
  });
  assert.equal(
    foundation.upstreamDependency,
    "DRI-3:9/DirectorRuntimeSceneOrchestrationPublicIndex",
  );
  assert.equal(foundation.deterministic, true);
  assert.equal(foundation.foundation, true);
  assert.equal(foundation.status, "FoundationReady");
  assert.equal(foundation.philosophy, "user-action-is-not-director-intent");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(imports, ["@/app/lib/dri/directorRuntimeSceneOrchestrationPublicIndex"]);
  assert.doesNotMatch(
    source,
    /directorRuntimeSceneOrchestration(?:Foundation|Contracts|Model|Validation|Certification|Platform|Freeze)/,
  );
  assert.equal(Object.isFrozen(foundation), true);
});

test("5. interaction-kind vocabulary is complete and immutable", () => {
  assert.deepEqual([...interactionKinds], [
    "select", "activate", "focus", "hover", "open", "close", "back", "navigate",
    "expand", "collapse", "inspect", "invoke",
  ]);
  assert.equal(new Set(interactionKinds).size, interactionKinds.length);
  assert.equal(Object.isFrozen(interactionKinds), true);
  assert.doesNotMatch(source, /\b(?:mousedown|mouseup|pointerdown|touchstart|keydown)\b/);
});

test("6. interaction-source vocabulary is complete and immutable", () => {
  assert.deepEqual([...interactionSources], [
    "stage", "object", "connection", "goal", "pack", "timeline", "live-lens",
    "advisor", "insight", "explorer", "mode-selector", "system",
  ]);
  assert.equal(new Set(interactionSources).size, interactionSources.length);
  assert.equal(Object.isFrozen(interactionSources), true);
});

test("7. target-kind vocabulary is complete and immutable", () => {
  assert.deepEqual([...targetKinds], [
    "scene", "object", "connection", "goal", "pack", "timeline-entry", "lens",
    "mode", "advisor-item", "insight-item", "explorer-item", "control", "none",
  ]);
  assert.equal(new Set(targetKinds).size, targetKinds.length);
  assert.equal(Object.isFrozen(targetKinds), true);
});

test("8. lifecycle vocabulary is complete and immutable", () => {
  assert.deepEqual([...lifecycleValues], ["observed", "accepted", "rejected", "consumed"]);
  assert.equal(new Set(lifecycleValues).size, lifecycleValues.length);
  assert.equal(Object.isFrozen(lifecycleValues), true);
  for (const value of lifecycleValues) {
    assert.equal(normalizeDirectorInteractionLifecycle(value), value);
  }
});

test("9. scope vocabulary is complete and immutable", () => {
  assert.deepEqual([...scopes], ["local", "scene", "workspace", "global"]);
  assert.equal(new Set(scopes).size, scopes.length);
  assert.equal(Object.isFrozen(scopes), true);
  assert.deepEqual([...qualifiers], ["primary", "secondary", "additive", "range", "repeat"]);
  assert.equal(Object.isFrozen(qualifiers), true);
});

test("10. target creation is deterministic", () => {
  const input: CreateDirectorInteractionTargetInput = {
    kind: "pack", id: "production-delay", parentId: "factory-01", scope: "scene",
  };
  const one = createDirectorInteractionTarget(input);
  const two = createDirectorInteractionTarget(input);
  assert.deepEqual(one, two);
  assert.deepEqual(one, {
    kind: "pack", id: "production-delay", parentId: "factory-01", scope: "scene",
  });
  assert.equal(Object.isFrozen(one), true);
  assert.deepEqual(
    createDirectorInteractionTarget({ kind: "object", id: "factory-01" }),
    { kind: "object", id: "factory-01" },
  );
  assert.deepEqual(
    createDirectorInteractionTarget({ kind: "none", id: "" }),
    { kind: "none", id: "" },
  );
});

test("11. observation creation is deterministic", () => {
  const input: CreateDirectorInteractionObservationInput = {
    interactionId: "ix-1",
    kind: "select",
    source: "object",
    target: { kind: "object", id: "factory-01" },
    sequence: 1,
    scope: "local",
    contextRef: "context-1",
    orderKey: "ord-1",
    qualifiers: ["primary"],
  };
  const one = createDirectorInteractionObservation(input);
  const two = createDirectorInteractionObservation(input);
  assert.deepEqual(one, two);
  assert.deepEqual(one, {
    interactionId: "ix-1",
    kind: "select",
    source: "object",
    target: { kind: "object", id: "factory-01" },
    sequence: 1,
    scope: "local",
    contextRef: "context-1",
    orderKey: "ord-1",
    qualifiers: ["primary"],
  });
  assert.equal(Object.isFrozen(one), true);
  assert.equal(Object.isFrozen(one.target), true);
  assert.equal(Object.isFrozen(one.qualifiers), true);
});

test("12. sequence ordering is deterministic", () => {
  assert.equal(compareDirectorInteractionSequence(1, 2), -1);
  assert.equal(compareDirectorInteractionSequence(2, 2), 0);
  assert.equal(compareDirectorInteractionSequence(3, 1), 1);
  assert.equal(compareDirectorInteractionSequence(0, 0), 0);
  const observations = [
    createDirectorInteractionObservation({
      interactionId: "b", kind: "hover", source: "stage",
      target: { kind: "scene", id: "scene-1" }, sequence: 2,
    }),
    createDirectorInteractionObservation({
      interactionId: "a", kind: "select", source: "object",
      target: { kind: "object", id: "o-1" }, sequence: 1,
    }),
    createDirectorInteractionObservation({
      interactionId: "c", kind: "inspect", source: "insight",
      target: { kind: "insight-item", id: "i-1" }, sequence: 3,
    }),
  ];
  const ordered = [...observations].sort((left, right) =>
    compareDirectorInteractionSequence(left.sequence, right.sequence));
  assert.deepEqual(ordered.map(({ interactionId }) => interactionId), ["a", "b", "c"]);
});

test("13. unknown interaction kinds are rejected", () => {
  assert.throws(() => normalizeDirectorInteractionKind("mousedown"), TypeError);
  assert.throws(() => createDirectorInteractionObservation({
    interactionId: "ix", kind: "click" as "select", source: "object",
    target: { kind: "object", id: "o" }, sequence: 1,
  }), TypeError);
});

test("14. unknown sources are rejected", () => {
  assert.throws(() => normalizeDirectorInteractionSource("button"), TypeError);
  assert.throws(() => createDirectorInteractionObservation({
    interactionId: "ix", kind: "select", source: "react-component" as "object",
    target: { kind: "object", id: "o" }, sequence: 1,
  }), TypeError);
});

test("15. unknown target kinds are rejected", () => {
  assert.throws(() => normalizeDirectorInteractionTargetKind("mesh"), TypeError);
  assert.throws(() => createDirectorInteractionTarget({
    kind: "THREE.Object3D" as "object", id: "o",
  }), TypeError);
});

test("16. invalid target identities are rejected", () => {
  assert.throws(() => createDirectorInteractionTarget({ kind: "object", id: "" }), TypeError);
  assert.throws(() => createDirectorInteractionTarget({ kind: "object", id: "   " }), TypeError);
  assert.throws(() => createDirectorInteractionTarget({
    kind: "object", id: "o", parentId: "",
  }), TypeError);
});

test("17. invalid sequence values are rejected", () => {
  assert.throws(() => createDirectorInteractionObservation({
    interactionId: "ix", kind: "select", source: "object",
    target: { kind: "object", id: "o" }, sequence: -1,
  }), TypeError);
  assert.throws(() => createDirectorInteractionObservation({
    interactionId: "ix", kind: "select", source: "object",
    target: { kind: "object", id: "o" }, sequence: 1.5,
  }), TypeError);
  assert.throws(() => createDirectorInteractionObservation({
    interactionId: "ix", kind: "select", source: "object",
    target: { kind: "object", id: "o" }, sequence: Number.NaN,
  }), TypeError);
  assert.throws(() => compareDirectorInteractionSequence(1, -2), TypeError);
});

test("18. caller input is never mutated", () => {
  const targetInput: CreateDirectorInteractionTargetInput = {
    kind: "pack", id: "p-1", parentId: "o-1", scope: "workspace",
  };
  const qualifiersInput: CreateDirectorInteractionObservationInput["qualifiers"] = ["additive"];
  const input: CreateDirectorInteractionObservationInput = {
    interactionId: "ix-mut",
    kind: "expand",
    source: "pack",
    target: targetInput,
    sequence: 4,
    scope: "workspace",
    contextRef: "ctx",
    orderKey: 10,
    qualifiers: qualifiersInput,
  };
  const before = JSON.stringify(input);
  createDirectorInteractionObservation(input);
  createDirectorInteractionTarget(targetInput);
  normalizeDirectorInteractionScope("global");
  normalizeDirectorInteractionSource("advisor");
  assert.equal(JSON.stringify(input), before);
  assert.equal(Object.isFrozen(input), false);
  assert.equal(Object.isFrozen(targetInput), false);
});

test("19. registry counts match actual definitions", () => {
  const pairs: readonly [number, readonly unknown[]][] = [
    [registry.interactionKindCount, registry.interactionKinds],
    [registry.interactionSourceCount, registry.interactionSources],
    [registry.targetKindCount, registry.targetKinds],
    [registry.lifecycleValueCount, registry.lifecycleValues],
    [registry.scopeCount, registry.scopes],
    [registry.qualifierCount, registry.qualifiers],
    [registry.publicApiCount, registry.publicApis],
  ];
  for (const [count, values] of pairs) {
    assert.equal(count, values.length);
    assert.equal(new Set(values).size, values.length);
  }
  assert.equal(foundation.registry, registry);
  assert.equal(Object.isFrozen(registry), true);
});

test("20. verification API succeeds for the canonical Foundation", () => {
  assert.equal(verifyDirectorRuntimeInteractionOrchestrationFoundation(), true);
  assert.equal(verifyDirectorRuntimeInteractionOrchestrationFoundation(), true);
});

test("21–23. no React/UI, Three.js, or browser event type leaks", () => {
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next|three|@react-three)/i);
  assert.doesNotMatch(
    source,
    /\b(?:React|ReactDOM|JSX|THREE|MouseEvent|PointerEvent|KeyboardEvent|HTMLElement|Object3D)\b/,
  );
  assert.doesNotMatch(source, /\b(?:window|document|localStorage|sessionStorage|fetch)\b/);
});

test("24–27. no scene mutation, intent resolution, focus orchestration, or reaction planning", () => {
  assert.doesNotMatch(source, /\b(?:mutateScene|reconstructScene|composeScene|executeScene|renderScene)\b/);
  assert.doesNotMatch(source, /\b(?:resolveIntent|intentResolution|mapClickToFocus|openGoalWorkspace)\b/);
  assert.doesNotMatch(
    source,
    /\b(?:currentSelectedObject|previousFocusedObject|focusHistory|selectionStack|focusTransition)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:reactionPlan|centerObject|dimUnrelated|highlightPath|updateAdvisor|changeLiveLens|openPack)\b/,
  );
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID)\b/);
  assert.doesNotMatch(source, /from\s+["']node:(?:fs|path)|readFile|writeFile/);
  assert.equal(foundation.sceneOrchestrationBoundary, "DRI-3:9-public-index-only");
});
