import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  DIRECTOR_RUNTIME_MAPPING_INTENT_KINDS,
  DIRECTOR_RUNTIME_MAPPING_RESOLUTION_STATUSES,
  canMapDirectorRuntimeSourceToTarget,
  createDirectorRuntimeMappingRequest,
  createDirectorRuntimeMappingRule,
  directorRuntimeCanonicalMappingRuleCount,
  directorRuntimeCanonicalMappingRules,
  directorRuntimeIntegrationMappingIdentity,
  directorRuntimeIntegrationMappingMetadata,
  directorRuntimeIntegrationMappingNamespace,
  directorRuntimeIntegrationMappingUpstream,
  directorRuntimeIntegrationMappingVersion,
  directorRuntimeMappingCapabilityRegistry,
  directorRuntimeMappingCapabilityRegistryCount,
  getDirectorRuntimeMappingCapabilityRegistry,
  getDirectorRuntimeMappingRules,
  isDirectorRuntimeMappingIntentKind,
  isDirectorRuntimeMappingResolutionStatus,
  resolveDirectorRuntimeMapping,
  resolveDirectorRuntimeMatchingRules,
  verifyDirectorRuntimeIntegrationMapping,
  type DirectorRuntimeMappingRequest,
  type DirectorRuntimeMappingRule,
} from "./directorRuntimeIntegrationMapping.ts";
import {
  directorRuntimeIntegrationContractsIdentity,
  directorRuntimeIntegrationContractsMetadata,
} from "./directorRuntimeIntegrationContracts.ts";

const sourceText = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    "directorRuntimeIntegrationMapping.ts",
  ),
  "utf8",
);

function request(
  overrides: Partial<DirectorRuntimeMappingRequest> = {},
): DirectorRuntimeMappingRequest {
  return {
    requestId: overrides.requestId ?? "Request:KEEP Case",
    source: overrides.source ?? {
      sourceKind: "runtime-object",
      sourceId: " Source/KEEP Case ",
      runtimeRevision: "runtime-r18",
    },
    payload: overrides.payload ?? { status: "upstream-owned", value: 42 },
    ...(overrides.targetKind !== undefined
      ? { targetKind: overrides.targetKind }
      : {}),
    ...(overrides.requireUniqueTarget !== undefined
      ? { requireUniqueTarget: overrides.requireUniqueTarget }
      : {}),
  };
}

function rule(
  overrides: Partial<DirectorRuntimeMappingRule> = {},
): DirectorRuntimeMappingRule {
  return {
    ruleId: overrides.ruleId ?? "Rule:KEEP Case",
    sourceKind: overrides.sourceKind ?? "runtime-object",
    targetKind: overrides.targetKind ?? "node",
    targetId: overrides.targetId ?? " Target:KEEP Case ",
    intentKind: overrides.intentKind ?? "represent",
  };
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

describe("DRI-1:3 Director Runtime Integration Mapping", () => {
  it("publishes the exact Mapping identity and DRI-1:2 dependency", () => {
    assert.equal(
      directorRuntimeIntegrationMappingIdentity,
      "DRI-1:3/DirectorRuntimeIntegrationMapping",
    );
    assert.equal(directorRuntimeIntegrationMappingVersion, "1.3.0");
    assert.equal(
      directorRuntimeIntegrationMappingNamespace,
      "nexora.dri.runtime.integration.mapping",
    );
    assert.equal(
      directorRuntimeIntegrationMappingUpstream,
      directorRuntimeIntegrationContractsIdentity,
    );
    assert.deepEqual(directorRuntimeIntegrationMappingMetadata, {
      identity: "DRI-1:3/DirectorRuntimeIntegrationMapping",
      version: "1.3.0",
      namespace: "nexora.dri.runtime.integration.mapping",
      layer: "DRI",
      phase: "DRI-1",
      stage: "Mapping",
      status: "MappingReady",
      upstream: "DRI-1:2/DirectorRuntimeIntegrationContracts",
      direction: "runtime-to-director",
      authority: directorRuntimeIntegrationContractsMetadata.authority,
    });
    assert.equal(verifyDirectorRuntimeIntegrationMapping(), true);
    const imports = [...sourceText.matchAll(/from\s+["']([^"']+)["']/g)]
      .map((match) => match[1]);
    assert.deepEqual(imports, ["./directorRuntimeIntegrationContracts.ts"]);
  });

  it("publishes exact intent kinds and resolution statuses", () => {
    assert.deepEqual(DIRECTOR_RUNTIME_MAPPING_INTENT_KINDS, [
      "represent", "associate", "focus", "compose", "expose", "suppress",
      "annotate", "indicate",
    ]);
    assert.deepEqual(DIRECTOR_RUNTIME_MAPPING_RESOLUTION_STATUSES, [
      "resolved", "unresolved", "ambiguous", "unsupported",
    ]);
    for (const intent of DIRECTOR_RUNTIME_MAPPING_INTENT_KINDS) {
      assert.equal(isDirectorRuntimeMappingIntentKind(intent), true);
    }
    for (const status of DIRECTOR_RUNTIME_MAPPING_RESOLUTION_STATUSES) {
      assert.equal(isDirectorRuntimeMappingResolutionStatus(status), true);
    }
    assert.equal(isDirectorRuntimeMappingIntentKind("render"), false);
    assert.equal(isDirectorRuntimeMappingResolutionStatus("accepted"), false);
  });

  it("creates immutable rules while preserving opaque identities", () => {
    const input = rule();
    const before = structuredClone(input);
    const output = createDirectorRuntimeMappingRule(input);

    assert.deepEqual(input, before);
    assert.deepEqual(output, input);
    assert.equal(deeplyFrozen(output), true);
    assert.throws(
      () => createDirectorRuntimeMappingRule({
        ...input,
        sourceKind: "runtime-unknown" as "runtime-object",
      }),
      TypeError,
    );
    assert.throws(
      () => createDirectorRuntimeMappingRule({
        ...input,
        targetKind: "mesh" as "node",
      }),
      TypeError,
    );
    assert.throws(
      () => createDirectorRuntimeMappingRule({
        ...input,
        intentKind: "animate" as "represent",
      }),
      TypeError,
    );
  });

  it("creates deeply immutable requests without mutating source or payload", () => {
    const input = request({ payload: { nested: ["A", { value: 71 }] } });
    const before = structuredClone(input);
    const output = createDirectorRuntimeMappingRequest(input);

    assert.deepEqual(input, before);
    assert.deepEqual(output, input);
    assert.notEqual(output.payload, input.payload);
    assert.equal(deeplyFrozen(output), true);
  });

  it("resolves one Runtime source to one abstract Director target", () => {
    const resolution = resolveDirectorRuntimeMapping(request(), [rule()]);

    assert.equal(resolution.status, "resolved");
    assert.deepEqual(resolution.matchedRuleIds, ["Rule:KEEP Case"]);
    assert.equal(resolution.mappings.length, 1);
    assert.deepEqual(resolution.mappings[0], {
      mappingId: "Rule:KEEP Case",
      source: request().source,
      target: { targetKind: "node", targetId: " Target:KEEP Case " },
    });
    assert.equal(deeplyFrozen(resolution), true);
  });

  it("resolves one-to-many mappings in explicit rule order", () => {
    const rules = [
      rule({ ruleId: "KPI:status", sourceKind: "runtime-kpi", targetKind: "status", targetId: "status-1", intentKind: "indicate" }),
      rule({ ruleId: "KPI:presentation", sourceKind: "runtime-kpi", targetKind: "presentation", targetId: "presentation-1", intentKind: "represent" }),
    ];
    const resolution = resolveDirectorRuntimeMapping(
      request({ source: { sourceKind: "runtime-kpi", sourceId: "kpi-1", runtimeRevision: 42 } }),
      rules,
    );

    assert.equal(resolution.status, "resolved");
    assert.deepEqual(resolution.matchedRuleIds, ["KPI:status", "KPI:presentation"]);
    assert.deepEqual(
      resolution.mappings.map(({ target }) => target.targetKind),
      ["status", "presentation"],
    );
  });

  it("makes ambiguity visible when a unique target is required", () => {
    const rules = [
      rule({ ruleId: "A", targetId: "node-a" }),
      rule({ ruleId: "B", targetId: "node-b", intentKind: "associate" }),
    ];
    const resolution = resolveDirectorRuntimeMapping(
      request({ targetKind: "node", requireUniqueTarget: true }),
      rules,
    );

    assert.equal(resolution.status, "ambiguous");
    assert.deepEqual(resolution.matchedRuleIds, ["A", "B"]);
    assert.deepEqual(resolution.mappings, []);
  });

  it("distinguishes unresolved sources from unsupported target constraints", () => {
    const rules = [rule()];
    const unresolved = resolveDirectorRuntimeMapping(
      request({ source: { sourceKind: "runtime-timeline", sourceId: "timeline", runtimeRevision: "A" } }),
      rules,
    );
    const unsupported = resolveDirectorRuntimeMapping(
      request({ targetKind: "scene" }),
      rules,
    );

    assert.equal(unresolved.status, "unresolved");
    assert.equal(unsupported.status, "unsupported");
    assert.deepEqual(unresolved.matchedRuleIds, []);
    assert.deepEqual(unsupported.matchedRuleIds, []);
  });

  it("matches rules and capability solely from explicit configuration", () => {
    const rules = [
      rule({ ruleId: "A", targetKind: "node" }),
      rule({ ruleId: "B", targetKind: "status", targetId: "status" }),
      rule({ ruleId: "C", targetKind: "node", targetId: "node-c" }),
    ];
    assert.deepEqual(
      resolveDirectorRuntimeMatchingRules(request({ targetKind: "node" }), rules)
        .map(({ ruleId }) => ruleId),
      ["A", "C"],
    );
    assert.equal(
      canMapDirectorRuntimeSourceToTarget("runtime-object", "status", rules),
      true,
    );
    assert.equal(
      canMapDirectorRuntimeSourceToTarget("runtime-goal", "status", rules),
      false,
    );
  });

  it("is deterministic and does not inspect KPI values for semantics", () => {
    const rules = [rule({ sourceKind: "runtime-kpi", targetKind: "status", targetId: "status", intentKind: "indicate" })];
    const low = resolveDirectorRuntimeMapping(
      request({ source: { sourceKind: "runtime-kpi", sourceId: "kpi", runtimeRevision: "R" }, payload: { value: 10 } }),
      rules,
    );
    const high = resolveDirectorRuntimeMapping(
      request({ source: { sourceKind: "runtime-kpi", sourceId: "kpi", runtimeRevision: "R" }, payload: { value: 90 } }),
      rules,
    );
    const repeat = resolveDirectorRuntimeMapping(
      request({ source: { sourceKind: "runtime-kpi", sourceId: "kpi", runtimeRevision: "R" }, payload: { value: 10 } }),
      rules,
    );

    assert.deepEqual(low.mappings, high.mappings);
    assert.deepEqual(low, repeat);
  });

  it("publishes minimal canonical rules and ten ordered capabilities", () => {
    assert.equal(
      directorRuntimeCanonicalMappingRuleCount,
      directorRuntimeCanonicalMappingRules.length,
    );
    assert.equal(getDirectorRuntimeMappingRules(), directorRuntimeCanonicalMappingRules);
    assert.deepEqual(
      directorRuntimeMappingCapabilityRegistry.map(({ capability }) => capability),
      [
        "Mapping Intent", "Mapping Resolution", "Mapping Rule",
        "Mapping Request", "Source-to-Target Capability", "One-to-One Mapping",
        "One-to-Many Mapping", "Ambiguity Handling",
        "Deterministic Resolution", "Runtime Authority",
      ],
    );
    assert.equal(
      directorRuntimeMappingCapabilityRegistryCount,
      directorRuntimeMappingCapabilityRegistry.length,
    );
    assert.equal(
      getDirectorRuntimeMappingCapabilityRegistry(),
      directorRuntimeMappingCapabilityRegistry,
    );
    assert.equal(deeplyFrozen(directorRuntimeCanonicalMappingRules), true);
    assert.equal(deeplyFrozen(directorRuntimeMappingCapabilityRegistry), true);
  });

  it("has no UI, renderer, business engine, browser, network, or sync dependency", () => {
    assert.doesNotMatch(
      sourceText,
      /\b(?:React|ReactDOM|THREE|SceneRenderer|window|document|fetch|XMLHttpRequest|WebSocket|Math\.random|Date\.now|randomUUID)\b/,
    );
    assert.doesNotMatch(
      sourceText,
      /from\s+["'][^"']*(?:renderer|database|network|store)[^"']*["']/i,
    );
  });
});
