import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createRuntimeStateContextBinding } from
  "./directorRuntimeStateContextBindingFoundation.ts";
import { createRuntimeStateContextBindingRequest } from
  "./directorRuntimeStateContextBindingContracts.ts";
import {
  directorRuntimeStateContextBindingIntegration,
  integrateRuntimeStateContextBinding,
  runtimeStateContextBindingIntegrationPublicApiSurface,
  runtimeStateContextBindingIntegrationRegistry,
  type RuntimeStateContextBindingIntegrationOutcome,
  type RuntimeStateContextBindingIntegrationRequest,
} from "./directorRuntimeStateContextBindingIntegration.ts";
import {
  RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_PHASES as validationPhases,
  RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_RULE_CATEGORIES as categories,
  RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_SEVERITIES as severities,
  RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_STATUSES as validationStatuses,
  RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_SUBJECT_KINDS as subjectKinds,
  directorRuntimeStateContextBindingValidation as validation,
  hasRuntimeStateContextBindingValidationWarnings,
  isRuntimeStateContextBindingValidationInvalid,
  isRuntimeStateContextBindingValidationValid,
  runtimeStateContextBindingValidationApiNames,
  runtimeStateContextBindingValidationPredicateNames,
  runtimeStateContextBindingValidationPublicApiSurface,
  runtimeStateContextBindingValidationRegistry as registry,
  runtimeStateContextBindingValidationRuleApplicability as applicability,
  runtimeStateContextBindingValidationRules as rules,
  validateRuntimeStateContextBinding,
  validateRuntimeStateContextBindingDeterminism,
  validateRuntimeStateContextBindingIntegrationDescriptor,
  validateRuntimeStateContextBindingIntegrationOutcome,
  validateRuntimeStateContextBindingIntegrationRegistry,
  validateRuntimeStateContextBindingIntegrationRequest,
} from "./directorRuntimeStateContextBindingValidation.ts";

const state = Object.freeze({
  runtimeStateId: "state-1", runtimeStateVersion: "1", runtimeStateKind: "executive",
});
const context = Object.freeze({
  workspaceId: "w", goalId: "g", objectId: "o", packId: "p",
});
function request(overrides: Record<string, unknown> = {}): RuntimeStateContextBindingIntegrationRequest {
  const binding = createRuntimeStateContextBindingRequest({
    bindingId: "binding-1", runtimeState: state, context, scope: "pack", ...overrides,
  });
  return Object.freeze({ consumerRole: "runtime", direction: "runtime-to-director",
    engineInput: Object.freeze({ request: binding }) });
}
function outcome(overrides: Record<string, unknown> = {}) {
  return integrateRuntimeStateContextBinding(request(overrides));
}
function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }

test("publishes exact validation metadata and sole Integration dependency", () => {
  assert.equal(validation.identity, "DRI-2:5/DirectorRuntimeStateContextBindingValidation");
  assert.equal(validation.version, "2.5.0");
  assert.equal(validation.namespace, "nexora.dri.runtime.state-context-binding.validation");
  assert.equal(validation.stage, "Validation");
  assert.equal(validation.immediateDependency,
    "DRI-2:4/DirectorRuntimeStateContextBindingIntegration");
  const source = readFileSync(new URL("./directorRuntimeStateContextBindingValidation.ts", import.meta.url), "utf8");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeStateContextBindingIntegration"]);
  assert.doesNotMatch(source, /directorRuntimeStateContextBinding(?:Engine|Contracts|Foundation)|directorRuntimeIntegration/);
});

test("publishes stable unique vocabularies, rules, applicability, and phases", () => {
  assert.deepEqual(subjectKinds, ["integration-request", "integration-outcome",
    "integration-descriptor", "integration-registry", "integration-public-api-surface"]);
  assert.deepEqual(severities, ["info", "warning", "error", "critical"]);
  assert.deepEqual(validationStatuses, ["valid", "valid-with-warnings", "invalid"]);
  assert.deepEqual(validationPhases, ["subject-classified", "structure-validated",
    "vocabulary-validated", "invariants-validated", "registry-validated",
    "descriptor-validated", "report-created"]);
  for (const values of [subjectKinds, categories, severities, validationStatuses, validationPhases])
    assert.equal(new Set(values).size, values.length);
  assert.equal(new Set(rules.map(({ id }) => id)).size, rules.length);
  for (const kind of subjectKinds) {
    assert.equal(new Set(applicability[kind]).size, applicability[kind].length);
    assert.ok(applicability[kind].includes("DRI-2:5-RULE-PLAIN-DATA-SAFETY"));
  }
});

test("validates canonical request and reports malformed envelope fields", () => {
  assert.equal(validateRuntimeStateContextBindingIntegrationRequest(request()).status, "valid");
  const malformedRole = { ...request(), consumerRole: "unknown" } as unknown as
    RuntimeStateContextBindingIntegrationRequest;
  const malformedDirection = { ...request(), direction: "sideways" } as unknown as
    RuntimeStateContextBindingIntegrationRequest;
  const mismatch = { ...request(), direction: "director-to-runtime" } as
    RuntimeStateContextBindingIntegrationRequest;
  const missing = { consumerRole: "runtime", direction: "runtime-to-director" } as
    RuntimeStateContextBindingIntegrationRequest;
  assert.equal(validateRuntimeStateContextBindingIntegrationRequest(malformedRole).findings[0]?.ruleId,
    "DRI-2:5-RULE-CANONICAL-CONSUMER-ROLE");
  assert.equal(validateRuntimeStateContextBindingIntegrationRequest(malformedDirection).findings[0]?.ruleId,
    "DRI-2:5-RULE-CANONICAL-DIRECTION");
  assert.equal(validateRuntimeStateContextBindingIntegrationRequest(mismatch).findings[0]?.ruleId,
    "DRI-2:5-RULE-ROLE-DIRECTION-COMPATIBILITY");
  assert.equal(validateRuntimeStateContextBindingIntegrationRequest(missing).findings[0]?.severity,
    "critical");
});

test("validates completed and rejected outcome envelope invariants", () => {
  const completed = outcome();
  assert.equal(validateRuntimeStateContextBindingIntegrationOutcome(completed).status, "valid");
  const noEngine = clone(completed) as unknown as Record<string, unknown>;
  delete noEngine.engineOutput;
  assert.equal(validateRuntimeStateContextBindingIntegrationOutcome(noEngine as unknown as
    RuntimeStateContextBindingIntegrationOutcome).status, "invalid");
  const withReasons = clone(completed) as unknown as Record<string, unknown>;
  withReasons.rejectionReasons = [{ id: "invalid-integration-request" }];
  assert.equal(validateRuntimeStateContextBindingIntegrationOutcome(withReasons as unknown as
    RuntimeStateContextBindingIntegrationOutcome).status, "invalid");

  const rejected = integrateRuntimeStateContextBinding({ ...request(), direction: "director-to-runtime" });
  assert.equal(validateRuntimeStateContextBindingIntegrationOutcome(rejected).status, "valid");
  const completedRecord = clone(completed) as unknown as Record<string, unknown>;
  const fabricated = { ...clone(rejected), engineOutput: completedRecord.engineOutput };
  assert.equal(validateRuntimeStateContextBindingIntegrationOutcome(fabricated as
    RuntimeStateContextBindingIntegrationOutcome).status, "invalid");
  const noReasons = { ...clone(rejected), rejectionReasons: [] };
  assert.equal(validateRuntimeStateContextBindingIntegrationOutcome(noReasons as
    RuntimeStateContextBindingIntegrationOutcome).status, "invalid");
  const unknownReason = { ...clone(rejected), rejectionReasons: [{ id: "unknown" }] };
  assert.equal(validateRuntimeStateContextBindingIntegrationOutcome(unknownReason as unknown as
    RuntimeStateContextBindingIntegrationOutcome).status, "invalid");
});

test("enforces BoundRuntimeContext iff bound for every status", () => {
  const bound = clone(outcome()) as unknown as Record<string, unknown>;
  const boundEngine = bound.engineOutput as Record<string, unknown>;
  const boundResult = boundEngine.result as Record<string, unknown>;
  const savedBoundContext = clone(boundResult.boundContext);
  delete boundResult.boundContext;
  assert.equal(validateRuntimeStateContextBindingIntegrationOutcome(bound as unknown as
    RuntimeStateContextBindingIntegrationOutcome).status, "invalid");

  for (const overrides of [
    { scope: "object", context: { workspaceId: "w", goalId: "g" } },
    { bindingId: "" },
  ]) {
    const nonBound = clone(outcome(overrides)) as unknown as Record<string, unknown>;
    const result = (nonBound.engineOutput as Record<string, unknown>).result as Record<string, unknown>;
    result.boundContext = savedBoundContext;
    assert.equal(validateRuntimeStateContextBindingIntegrationOutcome(nonBound as unknown as
      RuntimeStateContextBindingIntegrationOutcome).status, "invalid");
  }
  const unbound = integrateRuntimeStateContextBinding(Object.freeze({
    consumerRole: "inspection", direction: "inspection-only",
    engineInput: Object.freeze({ request: createRuntimeStateContextBinding({
      bindingId: "u", runtimeState: null, context: {}, scope: "global",
    }) }),
  }));
  const malformedUnbound = clone(unbound) as unknown as Record<string, unknown>;
  const unboundResult = (malformedUnbound.engineOutput as Record<string, unknown>).result as
    Record<string, unknown>;
  unboundResult.boundContext = savedBoundContext;
  assert.equal(validateRuntimeStateContextBindingIntegrationOutcome(malformedUnbound as unknown as
    RuntimeStateContextBindingIntegrationOutcome).status, "invalid");
});

test("accepts correctly represented invalid binding and warns for partial binding", () => {
  const invalid = validateRuntimeStateContextBindingIntegrationOutcome(outcome({ bindingId: "" }));
  assert.equal(invalid.status, "valid");
  const partial = validateRuntimeStateContextBindingIntegrationOutcome(outcome({
    scope: "object", context: { workspaceId: "w", goalId: "g" },
  }));
  assert.equal(partial.status, "valid-with-warnings");
  assert.equal(hasRuntimeStateContextBindingValidationWarnings(partial), true);
  assert.equal(partial.summary.blockingFindingCount, 0);
});

test("detects compatibility, identity, and inspection inconsistencies", () => {
  const compatibility = clone(outcome()) as unknown as Record<string, unknown>;
  ((compatibility.engineOutput as Record<string, unknown>).compatibility as Record<string, unknown>)
    .state = "incomplete";
  assert.ok(validateRuntimeStateContextBindingIntegrationOutcome(compatibility as unknown as
    RuntimeStateContextBindingIntegrationOutcome).findings.some(({ ruleId }) =>
    ruleId === "DRI-2:5-RULE-COMPATIBILITY-STATUS-CONSISTENCY"));

  const identity = clone(outcome()) as unknown as Record<string, unknown>;
  (((identity.engineOutput as Record<string, unknown>).inspection as Record<string, unknown>))
    .bindingId = "different";
  assert.ok(validateRuntimeStateContextBindingIntegrationOutcome(identity as unknown as
    RuntimeStateContextBindingIntegrationOutcome).findings.some(({ ruleId }) =>
    ruleId === "DRI-2:5-RULE-IDENTITY-PRESERVATION"));

  const inspection = clone(outcome()) as unknown as Record<string, unknown>;
  const projected = (inspection.engineOutput as Record<string, unknown>).inspection as
    Record<string, unknown>;
  projected.missingRequiredDimensions = ["workspace", "unknown"];
  assert.ok(validateRuntimeStateContextBindingIntegrationOutcome(inspection as unknown as
    RuntimeStateContextBindingIntegrationOutcome).findings.some(({ ruleId }) =>
    ruleId === "DRI-2:5-RULE-INSPECTION-CONSISTENCY"));
});

test("validates registry counts and descriptor exact architecture", () => {
  assert.equal(validateRuntimeStateContextBindingIntegrationRegistry(
    runtimeStateContextBindingIntegrationRegistry).status, "valid");
  const badRegistry = { ...runtimeStateContextBindingIntegrationRegistry,
    publicApiCount: 999 } as unknown as typeof runtimeStateContextBindingIntegrationRegistry;
  assert.equal(validateRuntimeStateContextBindingIntegrationRegistry(badRegistry).status, "invalid");
  assert.equal(validateRuntimeStateContextBindingIntegrationDescriptor(
    directorRuntimeStateContextBindingIntegration).status, "valid");
  for (const mutation of [
    { identity: "wrong" }, { version: "wrong" }, { namespace: "wrong" },
    { immediateDependency: "DRI-2:1/wrong" },
  ]) {
    const descriptor = { ...directorRuntimeStateContextBindingIntegration, ...mutation } as unknown as
      typeof directorRuntimeStateContextBindingIntegration;
    assert.equal(validateRuntimeStateContextBindingIntegrationDescriptor(descriptor).status, "invalid");
  }
});

test("validates ordered public API uniqueness and prohibited architecture names", () => {
  assert.equal(validateRuntimeStateContextBinding({ kind: "integration-public-api-surface",
    value: runtimeStateContextBindingIntegrationPublicApiSurface }).status, "valid");
  const duplicate = [...runtimeStateContextBindingIntegrationPublicApiSurface,
    runtimeStateContextBindingIntegrationPublicApiSurface[0]] as unknown as
    typeof runtimeStateContextBindingIntegrationPublicApiSurface;
  const prohibited = [...runtimeStateContextBindingIntegrationPublicApiSurface,
    "synchronizeRuntimeState"] as unknown as typeof runtimeStateContextBindingIntegrationPublicApiSurface;
  assert.equal(validateRuntimeStateContextBinding({ kind: "integration-public-api-surface",
    value: duplicate }).status, "invalid");
  assert.equal(validateRuntimeStateContextBinding({ kind: "integration-public-api-surface",
    value: prohibited }).status, "invalid");
});

test("produces deterministic stable findings, summaries, and predicates", () => {
  const invalidRequest = { ...request(), consumerRole: "bad", direction: "bad" } as unknown as
    RuntimeStateContextBindingIntegrationRequest;
  const one = validateRuntimeStateContextBindingIntegrationRequest(invalidRequest);
  const two = validateRuntimeStateContextBindingIntegrationRequest(invalidRequest);
  assert.deepEqual(one, two);
  assert.deepEqual(one.findings.map(({ findingId }) => findingId),
    two.findings.map(({ findingId }) => findingId));
  assert.equal(one.summary.totalFindings, one.findings.length);
  assert.equal(one.summary.blockingFindingCount,
    one.summary.errorCount + one.summary.criticalCount);
  assert.equal(isRuntimeStateContextBindingValidationInvalid(one), true);
  assert.equal(isRuntimeStateContextBindingValidationValid(
    validateRuntimeStateContextBindingIntegrationRequest(request())), true);
});

test("compares supplied outcomes structurally without property-order sensitivity", () => {
  const first = outcome();
  const second = clone(first);
  const reordered = { ...second, status: second.status } as RuntimeStateContextBindingIntegrationOutcome;
  assert.equal(validateRuntimeStateContextBindingDeterminism({ firstOutput: first,
    secondOutput: reordered }), true);
  const different = outcome({ bindingId: "different" });
  assert.equal(validateRuntimeStateContextBindingDeterminism({ firstOutput: first,
    secondOutput: different }), false);
});

test("preserves frozen sources and emits immutable JSON/plain-data reports", () => {
  const frozen = request();
  const before = JSON.stringify(frozen);
  const report = validateRuntimeStateContextBindingIntegrationRequest(frozen);
  assert.equal(JSON.stringify(frozen), before);
  assert.equal(Object.isFrozen(report), true);
  assert.equal(Object.isFrozen(report.findings), true);
  assert.equal(Object.isFrozen(report.summary), true);
  assert.deepEqual(JSON.parse(JSON.stringify(report)), report);
  const containsFunction = (value: unknown): boolean => typeof value === "function" ||
    (value !== null && typeof value === "object" && Object.values(value)
      .some((entry) => containsFunction(entry)));
  assert.equal(containsFunction(report), false);
});

test("registry dynamic counts, API surface, and validation descriptor are consistent", () => {
  assert.equal(registry.subjectKindCount, registry.subjectKinds.length);
  assert.equal(registry.ruleCategoryCount, registry.ruleCategories.length);
  assert.equal(registry.severityCount, registry.severities.length);
  assert.equal(registry.statusCount, registry.statuses.length);
  assert.equal(registry.phaseCount, registry.phases.length);
  assert.equal(registry.ruleCount, registry.rules.length);
  assert.equal(registry.reportContractCount, registry.reportContracts.length);
  assert.equal(registry.functionalApiCount, registry.functionalApis.length);
  assert.equal(registry.predicateCount, registry.predicates.length);
  assert.equal(registry.publicApiCount, registry.publicApiSurface.length);
  assert.deepEqual(runtimeStateContextBindingValidationPublicApiSurface,
    [...runtimeStateContextBindingValidationApiNames,
      ...runtimeStateContextBindingValidationPredicateNames]);
  assert.equal(validation.registry, registry);
  assert.equal(validation.ruleRegistry, rules);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(validation), true);
});

test("contains no repair, certification, state, events, async, I/O, UI, or execution behavior", () => {
  const source = readFileSync(new URL("./directorRuntimeStateContextBindingValidation.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /from\s+["']node:(?:fs|path)|readFile|writeFile/);
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID|store|history)\b/);
  assert.doesNotMatch(source, /\b(?:repairIntegrationRequest|normalizeAndFixOutcome|correctBindingStatus|insertMissingContext|replaceInvalidIdentity|recalculateRegistryCounts|rewriteDescriptor)\b/);
  assert.doesNotMatch(source, /\b(?:certify|approve|release|attest|sign|seal|grantReadiness)\s*\(/i);
  assert.doesNotMatch(source, /\b(?:EventEmitter|publish|subscribe|listener|observer|callback|event bus)\b/i);
  assert.doesNotMatch(source, /\b(?:async|Promise|setTimeout|setInterval|requestAnimationFrame|fetch|localStorage|indexedDB)\b/);
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|three|@react-three|next)/i);
  assert.doesNotMatch(source, /\b(?:camera|animation|rendering|executeDirector|dispatchCommand|synchronizeState)\b/i);
});
