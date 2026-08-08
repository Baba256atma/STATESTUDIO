import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  DIRECTOR_RUNTIME_BINDING_ACTIVATION_STATES,
  DIRECTOR_RUNTIME_BINDING_CONFLICT_KINDS,
  DIRECTOR_RUNTIME_BINDING_EXCLUSIVITY_MODES,
  DIRECTOR_RUNTIME_BINDING_LIFECYCLE_STATES,
  DIRECTOR_RUNTIME_BINDING_SCOPE_KINDS,
  DIRECTOR_RUNTIME_BINDING_TRANSITIONS,
  activateDirectorRuntimeBinding,
  createDirectorRuntimeBinding,
  createDirectorRuntimeBindingCollection,
  createDirectorRuntimeBindingFromResolution,
  createDirectorRuntimeBindingGroup,
  detectDirectorRuntimeBindingConflict,
  directorRuntimeBindingRegistry,
  directorRuntimeBindingRegistryCount,
  directorRuntimeBindingTransitionRuleCount,
  directorRuntimeIntegrationBindingIdentity,
  directorRuntimeIntegrationBindingMetadata,
  directorRuntimeIntegrationBindingNamespace,
  directorRuntimeIntegrationBindingUpstream,
  directorRuntimeIntegrationBindingVersion,
  findDirectorRuntimeBindingById,
  findDirectorRuntimeBindingsByIntent,
  findDirectorRuntimeBindingsByLifecycle,
  findDirectorRuntimeBindingsByScope,
  findDirectorRuntimeBindingsBySourceId,
  findDirectorRuntimeBindingsByTargetId,
  getDirectorRuntimeBindingRegistry,
  isDirectorRuntimeBindingActivationState,
  isDirectorRuntimeBindingConflictKind,
  isDirectorRuntimeBindingExclusivityMode,
  isDirectorRuntimeBindingLifecycleState,
  isDirectorRuntimeBindingScopeKind,
  markDirectorRuntimeBindingStale,
  replaceDirectorRuntimeBinding,
  retireDirectorRuntimeBinding,
  suspendDirectorRuntimeBinding,
  transitionDirectorRuntimeBinding,
  verifyDirectorRuntimeIntegrationBinding,
  type DirectorRuntimeBinding,
  type DirectorRuntimeBindingInput,
} from "./directorRuntimeIntegrationBinding.ts";
import {
  createDirectorRuntimeMappingRequest,
  createDirectorRuntimeMappingRule,
  directorRuntimeIntegrationMappingIdentity,
  directorRuntimeIntegrationMappingMetadata,
  resolveDirectorRuntimeMapping,
  type DirectorRuntimeMappingRule,
} from "./directorRuntimeIntegrationMapping.ts";

const sourceText = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    "directorRuntimeIntegrationBinding.ts",
  ),
  "utf8",
);

function mappingRule(
  overrides: Partial<DirectorRuntimeMappingRule> = {},
): DirectorRuntimeMappingRule {
  return createDirectorRuntimeMappingRule({
    ruleId: overrides.ruleId ?? "Mapping:KEEP Case",
    sourceKind: overrides.sourceKind ?? "runtime-object",
    targetKind: overrides.targetKind ?? "node",
    targetId: overrides.targetId ?? " Target:KEEP Case ",
    intentKind: overrides.intentKind ?? "represent",
  });
}

function resolved(rule = mappingRule()) {
  return resolveDirectorRuntimeMapping(
    createDirectorRuntimeMappingRequest({
      requestId: "request-1",
      source: {
        sourceKind: rule.sourceKind,
        sourceId: " Source:KEEP Case ",
        runtimeRevision: "runtime-r18",
      },
      payload: { ignoredBusinessValue: 71 },
    }),
    [rule],
  );
}

function bindingInput(
  overrides: Partial<DirectorRuntimeBindingInput> = {},
): DirectorRuntimeBindingInput {
  const rule = mappingRule();
  const mapping = resolved(rule).mappings[0]!;
  return {
    bindingId: overrides.bindingId ?? " Binding:KEEP Case ",
    mapping: overrides.mapping ?? mapping,
    intentKind: overrides.intentKind ?? rule.intentKind,
    ...(overrides.lifecycle !== undefined ? { lifecycle: overrides.lifecycle } : {}),
    ...(overrides.activation !== undefined ? { activation: overrides.activation } : {}),
    ...(overrides.scope !== undefined ? { scope: overrides.scope } : {}),
    ...(overrides.exclusivity !== undefined ? { exclusivity: overrides.exclusivity } : {}),
    ...(overrides.revisionSensitive !== undefined
      ? { revisionSensitive: overrides.revisionSensitive }
      : {}),
    ...(overrides.owner !== undefined ? { owner: overrides.owner } : {}),
    ...(overrides.direction !== undefined ? { direction: overrides.direction } : {}),
  };
}

function makeBinding(
  overrides: Partial<DirectorRuntimeBindingInput> = {},
): DirectorRuntimeBinding {
  return createDirectorRuntimeBinding(bindingInput(overrides));
}

function deeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value as object)) {
    return true;
  }
  if (!Object.isFrozen(value)) return false;
  seen.add(value as object);
  return Object.values(value as Record<string, unknown>).every((item) =>
    deeplyFrozen(item, seen),
  );
}

describe("DRI-1:4 Director Runtime Integration Binding", () => {
  it("publishes exact identity and consumes only DRI-1:3 Mapping", () => {
    assert.equal(
      directorRuntimeIntegrationBindingIdentity,
      "DRI-1:4/DirectorRuntimeIntegrationBinding",
    );
    assert.equal(directorRuntimeIntegrationBindingVersion, "1.4.0");
    assert.equal(
      directorRuntimeIntegrationBindingNamespace,
      "nexora.dri.runtime.integration.binding",
    );
    assert.equal(
      directorRuntimeIntegrationBindingUpstream,
      directorRuntimeIntegrationMappingIdentity,
    );
    assert.deepEqual(directorRuntimeIntegrationBindingMetadata, {
      identity: "DRI-1:4/DirectorRuntimeIntegrationBinding",
      version: "1.4.0",
      namespace: "nexora.dri.runtime.integration.binding",
      layer: "DRI",
      phase: "DRI-1",
      stage: "Binding",
      status: "BindingReady",
      upstream: "DRI-1:3/DirectorRuntimeIntegrationMapping",
      direction: "runtime-to-director",
      authority: directorRuntimeIntegrationMappingMetadata.authority,
    });
    assert.equal(verifyDirectorRuntimeIntegrationBinding(), true);
    const imports = [...sourceText.matchAll(/from\s+["']([^"']+)["']/g)]
      .map((match) => match[1]);
    assert.deepEqual(imports, ["./directorRuntimeIntegrationMapping.ts"]);
  });

  it("publishes exact lifecycle, activation, scope, exclusivity, and conflict values", () => {
    assert.deepEqual(DIRECTOR_RUNTIME_BINDING_LIFECYCLE_STATES, [
      "declared", "active", "suspended", "stale", "replaced", "retired", "invalid",
    ]);
    assert.deepEqual(DIRECTOR_RUNTIME_BINDING_ACTIVATION_STATES, ["enabled", "disabled"]);
    assert.deepEqual(DIRECTOR_RUNTIME_BINDING_SCOPE_KINDS, [
      "global", "scene", "object", "goal", "pack", "session",
    ]);
    assert.deepEqual(DIRECTOR_RUNTIME_BINDING_EXCLUSIVITY_MODES, [
      "shared", "exclusive-source", "exclusive-target", "exclusive-pair",
    ]);
    assert.deepEqual(DIRECTOR_RUNTIME_BINDING_CONFLICT_KINDS, [
      "none", "duplicate", "source-conflict", "target-conflict", "intent-conflict",
      "revision-conflict", "exclusive-conflict",
    ]);
    assert.equal(isDirectorRuntimeBindingLifecycleState("unknown"), false);
    assert.equal(isDirectorRuntimeBindingActivationState("unknown"), false);
    assert.equal(isDirectorRuntimeBindingScopeKind("unknown"), false);
    assert.equal(isDirectorRuntimeBindingExclusivityMode("unknown"), false);
    assert.equal(isDirectorRuntimeBindingConflictKind("unknown"), false);
  });

  it("creates immutable bindings with exact caller identities and deterministic defaults", () => {
    const input = bindingInput({
      owner: { ownerId: " Owner/KEEP ", ownerKind: "DRI-domain" },
    });
    const before = structuredClone(input);
    const left = createDirectorRuntimeBinding(input);
    const right = createDirectorRuntimeBinding(input);

    assert.deepEqual(input, before);
    assert.deepEqual(left, right);
    assert.equal(left.bindingId, " Binding:KEEP Case ");
    assert.equal(left.source.sourceId, " Source:KEEP Case ");
    assert.equal(left.source.runtimeRevision, "runtime-r18");
    assert.equal(left.target.targetId, " Target:KEEP Case ");
    assert.equal(left.mappingId, "Mapping:KEEP Case");
    assert.equal(left.intentKind, "represent");
    assert.equal(left.lifecycle, "declared");
    assert.equal(left.activation, "disabled");
    assert.equal(left.scope, "global");
    assert.equal(left.exclusivity, "shared");
    assert.equal(left.direction, "runtime-to-director");
    assert.equal(deeplyFrozen(left), true);
  });

  it("creates bindings only from resolved mappings", () => {
    const rule = mappingRule();
    const resolution = resolved(rule);
    const output = createDirectorRuntimeBindingFromResolution(
      "binding-from-resolution",
      resolution,
      rule,
    );
    assert.equal(output.mappingId, rule.ruleId);
    assert.equal(output.intentKind, rule.intentKind);

    for (const status of ["unresolved", "ambiguous", "unsupported"] as const) {
      assert.throws(
        () => createDirectorRuntimeBindingFromResolution(
          "blocked-binding",
          { requestId: "request", status, mappings: [], matchedRuleIds: [] },
          rule,
        ),
        new RegExp(status),
      );
    }
  });

  it("implements all nineteen allowed transitions and rejects forbidden transitions", () => {
    assert.equal(directorRuntimeBindingTransitionRuleCount, 19);
    assert.equal(directorRuntimeBindingTransitionRuleCount, DIRECTOR_RUNTIME_BINDING_TRANSITIONS.length);
    for (const [previous, next] of DIRECTOR_RUNTIME_BINDING_TRANSITIONS) {
      const result = transitionDirectorRuntimeBinding(
        makeBinding({ lifecycle: previous, activation: previous === "active" ? "enabled" : "disabled" }),
        next,
      );
      assert.equal(result.accepted, true, `${previous} → ${next}`);
      assert.equal(result.previousState, previous);
      assert.equal(result.nextState, next);
      assert.equal(result.binding.lifecycle, next);
    }
    for (const [previous, next] of [
      ["retired", "active"], ["replaced", "active"], ["invalid", "active"],
      ["declared", "suspended"],
    ] as const) {
      const result = transitionDirectorRuntimeBinding(makeBinding({ lifecycle: previous }), next);
      assert.equal(result.accepted, false);
      assert.equal(result.nextState, previous);
      assert.equal(result.reason, "BINDING_TRANSITION_NOT_ALLOWED");
    }
  });

  it("activates, suspends, marks stale, and retires without mutating originals", () => {
    const declared = makeBinding();
    const active = activateDirectorRuntimeBinding(declared);
    const suspended = suspendDirectorRuntimeBinding(active);
    const resumed = activateDirectorRuntimeBinding(suspended);
    const stale = markDirectorRuntimeBindingStale(resumed);
    const retired = retireDirectorRuntimeBinding(stale);

    assert.equal(declared.lifecycle, "declared");
    assert.equal(declared.activation, "disabled");
    assert.equal(active.lifecycle, "active");
    assert.equal(active.activation, "enabled");
    assert.equal(suspended.lifecycle, "suspended");
    assert.equal(suspended.activation, "disabled");
    assert.equal(stale.lifecycle, "stale");
    assert.equal(retired.lifecycle, "retired");
    assert.notEqual(declared, active);
  });

  it("represents replacement immutably with both caller identities", () => {
    const active = activateDirectorRuntimeBinding(makeBinding());
    const before = structuredClone(active);
    const result = replaceDirectorRuntimeBinding(active, " Binding-B/KEEP ");

    assert.deepEqual(active, before);
    assert.equal(active.lifecycle, "active");
    assert.equal(result.binding.lifecycle, "replaced");
    assert.deepEqual(result.replacement, {
      previousBindingId: " Binding:KEEP Case ",
      replacementBindingId: " Binding-B/KEEP ",
    });
    assert.equal(deeplyFrozen(result), true);
  });

  it("detects duplicates and explicit structural conflicts deterministically", () => {
    const original = makeBinding();
    assert.equal(detectDirectorRuntimeBindingConflict(original, [original]), "duplicate");

    const revision = makeBinding({
      bindingId: "revision",
      mapping: {
        ...bindingInput().mapping,
        source: { ...bindingInput().mapping.source, runtimeRevision: "snapshot-A" },
      },
      revisionSensitive: true,
    });
    assert.equal(detectDirectorRuntimeBindingConflict(revision, [original]), "revision-conflict");

    const sourceExclusive = makeBinding({ bindingId: "source", exclusivity: "exclusive-source", mapping: { ...bindingInput().mapping, target: { targetKind: "scene", targetId: "scene" } } });
    assert.equal(detectDirectorRuntimeBindingConflict(sourceExclusive, [original]), "source-conflict");

    const otherSourceMapping = { ...bindingInput().mapping, source: { ...bindingInput().mapping.source, sourceId: "other" } };
    const targetExclusive = makeBinding({ bindingId: "target", mapping: otherSourceMapping, exclusivity: "exclusive-target" });
    assert.equal(detectDirectorRuntimeBindingConflict(targetExclusive, [original]), "target-conflict");

    const pairExclusive = makeBinding({ bindingId: "pair", exclusivity: "exclusive-pair" });
    assert.equal(detectDirectorRuntimeBindingConflict(pairExclusive, [original]), "exclusive-conflict");

    const intentConflict = makeBinding({ bindingId: "intent", intentKind: "associate" });
    assert.equal(detectDirectorRuntimeBindingConflict(intentConflict, [original]), "intent-conflict");

    const compatible = makeBinding({ bindingId: "compatible", mapping: { ...bindingInput().mapping, target: { targetKind: "scene", targetId: "scene" } } });
    assert.equal(detectDirectorRuntimeBindingConflict(compatible, [original]), "none");
  });

  it("preserves one-to-many and many-to-one bindings independently and in order", () => {
    const base = bindingInput().mapping;
    const oneToMany = createDirectorRuntimeBindingCollection("one-to-many", [
      makeBinding({ bindingId: "status", mapping: { ...base, target: { targetKind: "status", targetId: "status" } }, intentKind: "indicate" }),
      makeBinding({ bindingId: "presentation", mapping: { ...base, target: { targetKind: "presentation", targetId: "presentation" } } }),
    ]);
    const manyToOne = createDirectorRuntimeBindingCollection("many-to-one", [
      makeBinding({ bindingId: "object", mapping: { ...base, target: { targetKind: "composition", targetId: "composition" } } }),
      makeBinding({ bindingId: "pack", mapping: { ...base, source: { sourceKind: "runtime-pack", sourceId: "pack", runtimeRevision: "R" }, target: { targetKind: "composition", targetId: "composition" } }, intentKind: "compose" }),
    ]);

    assert.deepEqual(oneToMany.bindings.map(({ bindingId }) => bindingId), ["status", "presentation"]);
    assert.deepEqual(manyToOne.bindings.map(({ bindingId }) => bindingId), ["object", "pack"]);
    assert.equal(new Set(oneToMany.bindings.map(({ target }) => target.targetId)).size, 2);
    assert.equal(new Set(manyToOne.bindings.map(({ source }) => source.sourceId)).size, 2);
  });

  it("creates immutable ordered collections and groups without deduplication", () => {
    const bindings = [makeBinding({ bindingId: "B2" }), makeBinding({ bindingId: "B1" }), makeBinding({ bindingId: "B2" })];
    const before = structuredClone(bindings);
    const collection = createDirectorRuntimeBindingCollection(" Collection/KEEP ", bindings);
    const ids = ["B2", "B1", "B2"];
    const group = createDirectorRuntimeBindingGroup(" Group/KEEP ", ids);

    assert.deepEqual(bindings, before);
    assert.deepEqual(collection.bindings.map(({ bindingId }) => bindingId), ids);
    assert.deepEqual(group.bindingIds, ids);
    assert.equal(deeplyFrozen(collection), true);
    assert.equal(deeplyFrozen(group), true);
  });

  it("queries collections in original order", () => {
    const active = activateDirectorRuntimeBinding(makeBinding({ bindingId: "A", scope: "scene" }));
    const declared = makeBinding({ bindingId: "B", scope: "goal" });
    const second = makeBinding({ bindingId: "C", scope: "scene" });
    const collection = createDirectorRuntimeBindingCollection("queries", [active, declared, second]);

    assert.equal(findDirectorRuntimeBindingById(collection, "B")?.bindingId, "B");
    assert.deepEqual(findDirectorRuntimeBindingsBySourceId(collection, active.source.sourceId).map(({ bindingId }) => bindingId), ["A", "B", "C"]);
    assert.deepEqual(findDirectorRuntimeBindingsByTargetId(collection, active.target.targetId).map(({ bindingId }) => bindingId), ["A", "B", "C"]);
    assert.deepEqual(findDirectorRuntimeBindingsByLifecycle(collection, "declared").map(({ bindingId }) => bindingId), ["B", "C"]);
    assert.deepEqual(findDirectorRuntimeBindingsByIntent(collection, "represent").map(({ bindingId }) => bindingId), ["A", "B", "C"]);
    assert.deepEqual(findDirectorRuntimeBindingsByScope(collection, "scene").map(({ bindingId }) => bindingId), ["A", "C"]);
    assert.deepEqual(findDirectorRuntimeBindingsBySourceId(collection, "unknown"), []);
  });

  it("publishes an ordered immutable eleven-concept registry", () => {
    assert.equal(directorRuntimeBindingRegistryCount, 11);
    assert.equal(directorRuntimeBindingRegistryCount, directorRuntimeBindingRegistry.length);
    assert.equal(getDirectorRuntimeBindingRegistry(), directorRuntimeBindingRegistry);
    assert.deepEqual(directorRuntimeBindingRegistry.map(({ concept }) => concept), [
      "Binding Identity", "Binding Lifecycle", "Binding Activation", "Binding Scope",
      "Binding Exclusivity", "Binding Conflict", "Binding Transition",
      "Binding Collection", "Binding Group", "Binding Replacement", "Runtime Authority",
    ]);
    assert.equal(deeplyFrozen(directorRuntimeBindingRegistry), true);
  });

  it("contains no business, rendering, persistence, browser, or synchronization dependency", () => {
    assert.doesNotMatch(sourceText, /\b(?:React|ReactDOM|THREE|SceneRenderer|window|document|fetch|XMLHttpRequest|WebSocket|localStorage|sessionStorage|Math\.random|Date\.now|randomUUID)\b/);
    assert.doesNotMatch(sourceText, /from\s+["'][^"']*(?:renderer|database|network|store|nol\/)[^"']*["']/i);
  });
});
