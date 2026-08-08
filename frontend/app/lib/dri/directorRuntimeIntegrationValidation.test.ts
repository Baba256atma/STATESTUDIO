import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  DIRECTOR_RUNTIME_VALIDATION_ISSUE_CODES,
  DIRECTOR_RUNTIME_VALIDATION_LEVELS,
  DIRECTOR_RUNTIME_VALIDATION_PROFILES,
  DIRECTOR_RUNTIME_VALIDATION_SEVERITIES,
  DIRECTOR_RUNTIME_VALIDATION_STATUSES,
  directorRuntimeIntegrationValidationIdentity,
  directorRuntimeIntegrationValidationMetadata,
  directorRuntimeIntegrationValidationNamespace,
  directorRuntimeIntegrationValidationUpstream,
  directorRuntimeIntegrationValidationVersion,
  directorRuntimeValidationRegistry,
  directorRuntimeValidationRegistryCount,
  getDirectorRuntimeValidationRegistry,
  isDirectorRuntimeValidationLevel,
  isDirectorRuntimeValidationProfile,
  isDirectorRuntimeValidationSeverity,
  isDirectorRuntimeValidationStatus,
  resolveDirectorRuntimeValidationAcceptance,
  resolveDirectorRuntimeValidationStatus,
  validateDirectorRuntimeBinding,
  validateDirectorRuntimeBindingCollection,
  validateDirectorRuntimeBindingConflict,
  validateDirectorRuntimeBindingTransition,
  validateDirectorRuntimeIntegration,
  validateDirectorRuntimeIntegrationArchitecture,
  validateDirectorRuntimeIntegrationPayload,
  validateDirectorRuntimeMappingRequest,
  validateDirectorRuntimeMappingResolution,
  validateDirectorRuntimeMappingRule,
  validateDirectorRuntimeSource,
  validateDirectorRuntimeTarget,
  verifyDirectorRuntimeIntegrationValidation,
  type DirectorRuntimeValidationContext,
  type DirectorRuntimeValidationIssue,
  type DirectorRuntimeValidationRequest,
} from "./directorRuntimeIntegrationValidation.ts";
import {
  createDirectorRuntimeBinding,
  createDirectorRuntimeBindingCollection,
  directorRuntimeIntegrationBindingIdentity,
  directorRuntimeIntegrationBindingMetadata,
  type DirectorRuntimeBinding,
  type DirectorRuntimeBindingInput,
} from "./directorRuntimeIntegrationBinding.ts";

const sourceText = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    "directorRuntimeIntegrationValidation.ts",
  ),
  "utf8",
);

function binding(
  overrides: Partial<DirectorRuntimeBindingInput> = {},
): DirectorRuntimeBinding {
  return createDirectorRuntimeBinding({
    bindingId: overrides.bindingId ?? " Binding:KEEP Case ",
    mapping: overrides.mapping ?? {
      mappingId: " Mapping:KEEP Case ",
      source: {
        sourceKind: "runtime-kpi",
        sourceId: " Source:KEEP Case ",
        runtimeRevision: "company-state-blue",
      },
      target: { targetKind: "status", targetId: " Target:KEEP Case " },
    },
    intentKind: overrides.intentKind ?? "indicate",
    ...(overrides.lifecycle !== undefined ? { lifecycle: overrides.lifecycle } : {}),
    ...(overrides.activation !== undefined ? { activation: overrides.activation } : {}),
    ...(overrides.scope !== undefined ? { scope: overrides.scope } : {}),
    ...(overrides.exclusivity !== undefined ? { exclusivity: overrides.exclusivity } : {}),
    ...(overrides.revisionSensitive !== undefined ? { revisionSensitive: overrides.revisionSensitive } : {}),
  });
}

const context: DirectorRuntimeValidationContext = Object.freeze({
  expectedDirection: "runtime-to-director",
  expectedRuntimeRevision: "company-state-blue",
  allowWarnings: true,
  runtimeAuthoritative: true,
  forbiddenDependencies: Object.freeze([]),
});

function request(
  overrides: Partial<DirectorRuntimeValidationRequest> = {},
): DirectorRuntimeValidationRequest {
  return {
    validationId: overrides.validationId ?? " Validation:KEEP Case ",
    profile: overrides.profile ?? "release",
    levels: overrides.levels ?? [...DIRECTOR_RUNTIME_VALIDATION_LEVELS],
    bindings: overrides.bindings ?? [binding()],
    ...(overrides.payloads !== undefined ? { payloads: overrides.payloads } : {}),
    ...(overrides.mappingRules !== undefined ? { mappingRules: overrides.mappingRules } : {}),
    ...(overrides.mappingRequests !== undefined ? { mappingRequests: overrides.mappingRequests } : {}),
    ...(overrides.mappingResolutions !== undefined ? { mappingResolutions: overrides.mappingResolutions } : {}),
    ...(overrides.transitions !== undefined ? { transitions: overrides.transitions } : {}),
    ...(overrides.expectedBindingOrder !== undefined ? { expectedBindingOrder: overrides.expectedBindingOrder } : {}),
  };
}

function issue(severity: DirectorRuntimeValidationIssue["severity"]): DirectorRuntimeValidationIssue {
  return Object.freeze({
    code: "DRI_VALID",
    severity,
    level: "integration",
    message: severity,
  });
}

function deeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  seen.add(value as object);
  return Object.values(value as Record<string, unknown>).every((item) => deeplyFrozen(item, seen));
}

describe("DRI-1:5 Director Runtime Integration Validation", () => {
  it("publishes exact identity and consumes only DRI-1:4 Binding", () => {
    assert.equal(directorRuntimeIntegrationValidationIdentity, "DRI-1:5/DirectorRuntimeIntegrationValidation");
    assert.equal(directorRuntimeIntegrationValidationVersion, "1.5.0");
    assert.equal(directorRuntimeIntegrationValidationNamespace, "nexora.dri.runtime.integration.validation");
    assert.equal(directorRuntimeIntegrationValidationUpstream, directorRuntimeIntegrationBindingIdentity);
    assert.deepEqual(directorRuntimeIntegrationValidationMetadata, {
      identity: "DRI-1:5/DirectorRuntimeIntegrationValidation",
      version: "1.5.0",
      namespace: "nexora.dri.runtime.integration.validation",
      layer: "DRI",
      phase: "DRI-1",
      stage: "Validation",
      status: "ValidationReady",
      upstream: "DRI-1:4/DirectorRuntimeIntegrationBinding",
      direction: "runtime-to-director",
      authority: directorRuntimeIntegrationBindingMetadata.authority,
    });
    assert.equal(verifyDirectorRuntimeIntegrationValidation(), true);
    const imports = [...sourceText.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
    assert.deepEqual(imports, ["./directorRuntimeIntegrationBinding.ts"]);
  });

  it("publishes exact ordered validation vocabulary", () => {
    assert.deepEqual(DIRECTOR_RUNTIME_VALIDATION_LEVELS, ["foundation", "contract", "mapping", "binding", "architecture", "integration"]);
    assert.deepEqual(DIRECTOR_RUNTIME_VALIDATION_SEVERITIES, ["info", "warning", "error", "fatal"]);
    assert.deepEqual(DIRECTOR_RUNTIME_VALIDATION_STATUSES, ["valid", "valid-with-warnings", "invalid", "fatal"]);
    assert.deepEqual(DIRECTOR_RUNTIME_VALIDATION_PROFILES, ["structural", "strict", "release"]);
    assert.equal(DIRECTOR_RUNTIME_VALIDATION_ISSUE_CODES.length, 18);
    assert.equal(new Set(DIRECTOR_RUNTIME_VALIDATION_ISSUE_CODES).size, 18);
    assert.equal(isDirectorRuntimeValidationLevel("unknown"), false);
    assert.equal(isDirectorRuntimeValidationSeverity("unknown"), false);
    assert.equal(isDirectorRuntimeValidationStatus("unknown"), false);
    assert.equal(isDirectorRuntimeValidationProfile("unknown"), false);
  });

  it("resolves status and warning acceptance deterministically", () => {
    assert.equal(resolveDirectorRuntimeValidationStatus([]), "valid");
    assert.equal(resolveDirectorRuntimeValidationStatus([issue("info")]), "valid");
    assert.equal(resolveDirectorRuntimeValidationStatus([issue("warning")]), "valid-with-warnings");
    assert.equal(resolveDirectorRuntimeValidationStatus([issue("error")]), "invalid");
    assert.equal(resolveDirectorRuntimeValidationStatus([issue("fatal")]), "fatal");
    assert.equal(resolveDirectorRuntimeValidationStatus([issue("warning"), issue("error")]), "invalid");
    assert.equal(resolveDirectorRuntimeValidationStatus([issue("error"), issue("fatal")]), "fatal");
    assert.deepEqual(resolveDirectorRuntimeValidationAcceptance("valid-with-warnings", true), { accepted: true, status: "valid-with-warnings" });
    assert.deepEqual(resolveDirectorRuntimeValidationAcceptance("valid-with-warnings", false), { accepted: false, status: "valid-with-warnings" });
  });

  it("validates source and target structures without rewriting identities", () => {
    const source = { sourceKind: "runtime-object", sourceId: " Source/KEEP ", runtimeRevision: "runtime-A" };
    const target = { targetKind: "node", targetId: " Target/KEEP " };
    const sourceBefore = structuredClone(source);
    const targetBefore = structuredClone(target);
    assert.deepEqual(validateDirectorRuntimeSource(source), []);
    assert.deepEqual(validateDirectorRuntimeTarget(target), []);
    assert.deepEqual(source, sourceBefore);
    assert.deepEqual(target, targetBefore);
    assert.equal(validateDirectorRuntimeSource({ ...source, sourceKind: "unknown" })[0]?.code, "DRI_SOURCE_INVALID");
    assert.equal(validateDirectorRuntimeSource({ ...source, sourceId: "" })[0]?.code, "DRI_SOURCE_INVALID");
    assert.equal(validateDirectorRuntimeSource({ ...source, runtimeRevision: undefined })[0]?.code, "DRI_SOURCE_INVALID");
    assert.equal(validateDirectorRuntimeTarget({ ...target, targetKind: "mesh" })[0]?.code, "DRI_TARGET_INVALID");
    assert.equal(validateDirectorRuntimeTarget({ ...target, targetId: "" })[0]?.code, "DRI_TARGET_INVALID");
    assert.equal(validateDirectorRuntimeTarget(new Date())[0]?.code, "DRI_TARGET_INVALID");
  });

  it("accepts only finite JSON-like payload values", () => {
    for (const value of [null, true, "text", 42, [null, "A", 7], { nested: [true, { value: 90 }] }]) {
      assert.deepEqual(validateDirectorRuntimeIntegrationPayload(value), []);
    }
    class Unsupported {}
    for (const value of [() => undefined, new Date(), new Map(), new Set(), Promise.resolve(), new Unsupported(), Number.NaN, Infinity, -Infinity, BigInt(1), Symbol("x")]) {
      assert.equal(validateDirectorRuntimeIntegrationPayload(value)[0]?.code, "DRI_PAYLOAD_INVALID");
    }
  });

  it("validates mapping rules, requests, and explicit resolution states", () => {
    const rule = { ruleId: "rule-1", sourceKind: "runtime-object", targetKind: "node", targetId: "node-1", intentKind: "represent" };
    assert.deepEqual(validateDirectorRuntimeMappingRule(rule), []);
    for (const invalid of [
      { ...rule, ruleId: "" }, { ...rule, sourceKind: "unknown" },
      { ...rule, targetKind: "mesh" }, { ...rule, intentKind: "render" },
      { ...rule, transform: () => undefined },
    ]) assert.equal(validateDirectorRuntimeMappingRule(invalid)[0]?.code, "DRI_MAPPING_INVALID");
    assert.deepEqual(validateDirectorRuntimeMappingRequest({ requestId: "request", source: binding().source, payload: { value: 10 } }), []);
    assert.equal(validateDirectorRuntimeMappingRequest({ requestId: "", source: binding().source, payload: {} })[0]?.code, "DRI_MAPPING_INVALID");

    const mapping = { mappingId: "mapping", source: binding().source, target: binding().target };
    assert.deepEqual(validateDirectorRuntimeMappingResolution({ requestId: "request", status: "resolved", mappings: [mapping], matchedRuleIds: ["mapping"] }), []);
    assert.equal(validateDirectorRuntimeMappingResolution({ requestId: "request", status: "resolved", mappings: [], matchedRuleIds: [] })[0]?.code, "DRI_MAPPING_INVALID");
    assert.equal(validateDirectorRuntimeMappingResolution({ requestId: "request", status: "unresolved", mappings: [], matchedRuleIds: [] })[0]?.code, "DRI_MAPPING_UNRESOLVED");
    assert.equal(validateDirectorRuntimeMappingResolution({ requestId: "request", status: "ambiguous", mappings: [], matchedRuleIds: ["A", "B"] })[0]?.code, "DRI_MAPPING_AMBIGUOUS");
    assert.equal(validateDirectorRuntimeMappingResolution({ requestId: "request", status: "unsupported", mappings: [], matchedRuleIds: [] })[0]?.code, "DRI_MAPPING_UNSUPPORTED");
  });

  it("validates bindings, activation consistency, revisions, and direction", () => {
    const valid = binding();
    const before = structuredClone(valid);
    assert.deepEqual(validateDirectorRuntimeBinding(valid, "company-state-blue"), []);
    assert.deepEqual(valid, before);
    assert.equal(validateDirectorRuntimeBinding({ ...valid, bindingId: "" })[0]?.code, "DRI_BINDING_INVALID");
    assert.equal(validateDirectorRuntimeBinding({ ...valid, lifecycle: "unknown" })[0]?.code, "DRI_BINDING_INVALID");
    assert.equal(validateDirectorRuntimeBinding({ ...valid, activation: "unknown" })[0]?.code, "DRI_BINDING_INVALID");
    assert.equal(validateDirectorRuntimeBinding({ ...valid, scope: "unknown" })[0]?.code, "DRI_BINDING_INVALID");
    assert.equal(validateDirectorRuntimeBinding({ ...valid, exclusivity: "unknown" })[0]?.code, "DRI_BINDING_INVALID");
    assert.equal(validateDirectorRuntimeBinding({ ...valid, lifecycle: "retired", activation: "enabled" })[0]?.code, "DRI_BINDING_INVALID");
    assert.equal(validateDirectorRuntimeBinding(valid, "runtime-A")[0]?.code, "DRI_BINDING_REVISION_CONFLICT");
    assert.equal(validateDirectorRuntimeBinding({ ...valid, direction: "director-to-runtime" })[0]?.code, "DRI_DIRECTION_INVALID");
  });

  it("validates every allowed and representative forbidden lifecycle transition", () => {
    const states = ["declared", "active", "suspended", "stale", "replaced", "invalid"] as const;
    const allowed = new Set(["declared:active", "declared:invalid", "declared:retired", "active:suspended", "active:stale", "active:replaced", "active:retired", "active:invalid", "suspended:active", "suspended:stale", "suspended:replaced", "suspended:retired", "suspended:invalid", "stale:active", "stale:replaced", "stale:retired", "stale:invalid", "replaced:retired", "invalid:retired"]);
    for (const previous of states) {
      for (const next of [...states, "retired"] as const) {
        const result = validateDirectorRuntimeBindingTransition(binding({ lifecycle: previous }), next);
        assert.equal(result.length === 0, allowed.has(`${previous}:${next}`), `${previous}:${next}`);
      }
    }
    assert.equal(validateDirectorRuntimeBindingTransition(binding(), "suspended")[0]?.code, "DRI_BINDING_TRANSITION_INVALID");
  });

  it("reports all explicit conflict categories without resolving them", () => {
    const original = binding();
    const cases: Array<[DirectorRuntimeBinding, string]> = [
      [original, "DRI_BINDING_CONFLICT"],
      [binding({ bindingId: "revision", mapping: { ...original, source: { ...original.source, runtimeRevision: "runtime-A" }, mappingId: original.mappingId, target: original.target }, revisionSensitive: true }), "DRI_BINDING_REVISION_CONFLICT"],
      [binding({ bindingId: "source", mapping: { mappingId: "source", source: original.source, target: { targetKind: "scene", targetId: "scene" } }, exclusivity: "exclusive-source", intentKind: "represent" }), "DRI_BINDING_CONFLICT"],
      [binding({ bindingId: "target", mapping: { mappingId: "target", source: { ...original.source, sourceId: "other" }, target: original.target }, exclusivity: "exclusive-target" }), "DRI_BINDING_CONFLICT"],
      [binding({ bindingId: "pair", exclusivity: "exclusive-pair" }), "DRI_BINDING_CONFLICT"],
      [binding({ bindingId: "intent", intentKind: "annotate" }), "DRI_BINDING_CONFLICT"],
    ];
    for (const [candidate, code] of cases) {
      assert.equal(validateDirectorRuntimeBindingConflict(candidate, [original])[0]?.code, code);
    }
    const compatible = binding({ bindingId: "compatible", mapping: { mappingId: "compatible", source: original.source, target: { targetKind: "scene", targetId: "scene" } }, intentKind: "represent" });
    assert.deepEqual(validateDirectorRuntimeBindingConflict(compatible, [original]), []);
  });

  it("validates exclusivity through ordered collections and exact opaque revisions", () => {
    const first = binding({ bindingId: "A", exclusivity: "exclusive-source" });
    const second = binding({ bindingId: "B", mapping: { mappingId: "B", source: first.source, target: { targetKind: "presentation", targetId: "presentation" } }, intentKind: "represent" });
    const collection = createDirectorRuntimeBindingCollection("collection", [first, second]);
    assert.equal(validateDirectorRuntimeBindingCollection(collection)[0]?.code, "DRI_BINDING_CONFLICT");
    assert.equal(validateDirectorRuntimeBindingCollection(collection, ["B", "A"]).at(-1)?.code, "DRI_ORDER_VIOLATION");
    assert.equal(validateDirectorRuntimeBindingCollection(collection, undefined, "snapshot-42")[0]?.code, "DRI_BINDING_REVISION_CONFLICT");
  });

  it("validates direction, Runtime authority, and forbidden architecture dependencies", () => {
    assert.deepEqual(validateDirectorRuntimeIntegrationArchitecture(context), []);
    assert.equal(validateDirectorRuntimeIntegrationArchitecture({ ...context, expectedDirection: "director-to-runtime" as "runtime-to-director" })[0]?.code, "DRI_DIRECTION_INVALID");
    assert.equal(validateDirectorRuntimeIntegrationArchitecture({ ...context, runtimeAuthoritative: false })[0]?.code, "DRI_AUTHORITY_VIOLATION");
    assert.equal(validateDirectorRuntimeIntegrationArchitecture({ ...context, forbiddenDependencies: ["react"] })[0]?.code, "DRI_ARCHITECTURE_VIOLATION");
  });

  it("preserves level, subject, and validator issue order in immutable reports", () => {
    const input = request({
      levels: ["mapping", "binding", "integration"],
      mappingResolutions: [
        { requestId: "U", status: "unresolved", mappings: [], matchedRuleIds: [] },
        { requestId: "A", status: "ambiguous", mappings: [], matchedRuleIds: ["1", "2"] },
      ],
      bindings: [binding({ bindingId: "B2" }), binding({ bindingId: "B1" })],
      expectedBindingOrder: ["B1", "B2"],
    });
    const before = structuredClone(input);
    const left = validateDirectorRuntimeIntegration(input, context);
    const right = validateDirectorRuntimeIntegration(input, context);
    assert.deepEqual(input, before);
    assert.deepEqual(left, right);
    assert.deepEqual(left.checkedLevels, ["mapping", "binding", "integration"]);
    assert.deepEqual(left.issues.map(({ code }) => code), [
      "DRI_MAPPING_UNRESOLVED", "DRI_MAPPING_AMBIGUOUS", "DRI_ORDER_VIOLATION",
    ]);
    assert.equal(left.status, "invalid");
    assert.equal(left.warningCount, 1);
    assert.equal(left.errorCount, 2);
    assert.equal(deeplyFrozen(left), true);
  });

  it("uses profiles deterministically and ignores business meaning", () => {
    for (const [profile, levels] of [
      ["structural", 4], ["strict", 5], ["release", 6],
    ] as const) {
      const report = validateDirectorRuntimeIntegration(request({ profile, levels: [], payloads: [{ kpi: 10 }, { kpi: 90 }, { decision: "approved" }, { risk: "high" }] }), context);
      assert.equal(report.checkedLevels.length, levels);
      assert.equal(report.status, "valid");
      assert.equal(report.accepted, true);
    }
  });

  it("publishes eighteen immutable ordered validation registry entries", () => {
    assert.equal(directorRuntimeValidationRegistryCount, 18);
    assert.equal(directorRuntimeValidationRegistryCount, directorRuntimeValidationRegistry.length);
    assert.equal(getDirectorRuntimeValidationRegistry(), directorRuntimeValidationRegistry);
    assert.equal(deeplyFrozen(directorRuntimeValidationRegistry), true);
  });

  it("contains no UI, renderer, persistence, browser, network, or live-store dependency", () => {
    assert.doesNotMatch(sourceText, /\b(?:React|ReactDOM|THREE|SceneRenderer|window|document|fetch|XMLHttpRequest|WebSocket|localStorage|sessionStorage|Math\.random|Date\.now|randomUUID)\b/);
    assert.doesNotMatch(sourceText, /from\s+["'][^"']*(?:renderer|database|network|store|nol\/)[^"']*["']/i);
  });
});
