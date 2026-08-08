/** DRI-2:5 — deterministic inspection and reporting for the DRI-2:4 boundary. */

import {
  RUNTIME_STATE_CONTEXT_BINDING_CONSUMER_ROLES,
  RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_DIRECTIONS,
  RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_PHASES,
  RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_REJECTION_REASON_IDS,
  RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_STATUSES,
  directorRuntimeStateContextBindingIntegration,
  directorRuntimeStateContextBindingIntegrationIdentity,
  directorRuntimeStateContextBindingIntegrationNamespace,
  directorRuntimeStateContextBindingIntegrationUpstream,
  directorRuntimeStateContextBindingIntegrationVersion,
  createRuntimeStateContextBindingIntegrationRequest,
  createRuntimeStateContextBindingRequest,
  executeRuntimeStateContextBindingEngine,
  inspectRuntimeStateContextBindingIntegrationOutcome,
  integrateRuntimeStateContextBinding,
  isBoundRuntimeStateContextBindingResult,
  runtimeStateContextBindingIntegrationPublicApiSurface,
  runtimeStateContextBindingIntegrationRegistry,
  type RuntimeStateContextBindingIntegrationOutcome,
  type RuntimeStateContextBindingIntegrationRequest,
} from "@/app/lib/dri/directorRuntimeStateContextBindingIntegration";

export {
  createRuntimeStateContextBindingIntegrationRequest,
  createRuntimeStateContextBindingRequest,
  executeRuntimeStateContextBindingEngine,
  inspectRuntimeStateContextBindingIntegrationOutcome,
  integrateRuntimeStateContextBinding,
  isBoundRuntimeStateContextBindingResult,
};
export type {
  BoundRuntimeContext, RuntimeContextReference, RuntimeStateContextBindingEngineInput,
  RuntimeStateContextBindingEngineOutput, RuntimeStateContextBindingInspection,
  RuntimeStateContextBindingIntegrationOutcome, RuntimeStateContextBindingIntegrationRequest,
  RuntimeStateContextBindingRequest, RuntimeStateContextBindingResult,
  RuntimeStateContextBindingScope, RuntimeStateContextBindingStatus, RuntimeStateReference,
} from "@/app/lib/dri/directorRuntimeStateContextBindingIntegration";

export const directorRuntimeStateContextBindingValidationIdentity =
  "DRI-2:5/DirectorRuntimeStateContextBindingValidation" as const;
export const directorRuntimeStateContextBindingValidationVersion = "2.5.0" as const;
export const directorRuntimeStateContextBindingValidationNamespace =
  "nexora.dri.runtime.state-context-binding.validation" as const;
export const directorRuntimeStateContextBindingValidationUpstream =
  directorRuntimeStateContextBindingIntegrationIdentity;

export const RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_SUBJECT_KINDS = Object.freeze([
  "integration-request", "integration-outcome", "integration-descriptor",
  "integration-registry", "integration-public-api-surface",
] as const);
export type RuntimeStateContextBindingValidationSubjectKind =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_SUBJECT_KINDS)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_RULE_CATEGORIES = Object.freeze([
  "identity", "dependency", "structure", "vocabulary", "integration-envelope",
  "engine-delegation", "binding-result", "immutability", "determinism", "serialization",
  "registry", "descriptor", "architecture",
] as const);
export type RuntimeStateContextBindingValidationRuleCategory =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_RULE_CATEGORIES)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_SEVERITIES = Object.freeze([
  "info", "warning", "error", "critical",
] as const);
export type RuntimeStateContextBindingValidationSeverity =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_SEVERITIES)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_STATUSES = Object.freeze([
  "valid", "valid-with-warnings", "invalid",
] as const);
export type RuntimeStateContextBindingValidationStatus =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_STATUSES)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_PHASES = Object.freeze([
  "subject-classified", "structure-validated", "vocabulary-validated",
  "invariants-validated", "registry-validated", "descriptor-validated", "report-created",
] as const);

type IntegrationDescriptor = typeof directorRuntimeStateContextBindingIntegration;
type IntegrationRegistry = typeof runtimeStateContextBindingIntegrationRegistry;
type IntegrationPublicApiSurface = typeof runtimeStateContextBindingIntegrationPublicApiSurface;

export type RuntimeStateContextBindingValidationSubject =
  | Readonly<{ kind: "integration-request"; value: RuntimeStateContextBindingIntegrationRequest }>
  | Readonly<{ kind: "integration-outcome"; value: RuntimeStateContextBindingIntegrationOutcome }>
  | Readonly<{ kind: "integration-descriptor"; value: IntegrationDescriptor }>
  | Readonly<{ kind: "integration-registry"; value: IntegrationRegistry }>
  | Readonly<{ kind: "integration-public-api-surface"; value: IntegrationPublicApiSurface }>;

export interface RuntimeStateContextBindingValidationRule {
  readonly id: string;
  readonly category: RuntimeStateContextBindingValidationRuleCategory;
  readonly subjectKind: RuntimeStateContextBindingValidationSubjectKind | "all";
  readonly severity: RuntimeStateContextBindingValidationSeverity;
  readonly description: string;
}

export interface RuntimeStateContextBindingValidationFinding {
  readonly findingId: string;
  readonly ruleId: string;
  readonly subjectKind: RuntimeStateContextBindingValidationSubjectKind;
  readonly severity: RuntimeStateContextBindingValidationSeverity;
  readonly message: string;
  readonly path: string;
  readonly actual: string;
  readonly expected: string;
}

export interface RuntimeStateContextBindingValidationSummary {
  readonly totalFindings: number;
  readonly infoCount: number;
  readonly warningCount: number;
  readonly errorCount: number;
  readonly criticalCount: number;
  readonly blockingFindingCount: number;
  readonly status: RuntimeStateContextBindingValidationStatus;
}

export interface RuntimeStateContextBindingValidationReport {
  readonly validationIdentity: typeof directorRuntimeStateContextBindingValidationIdentity;
  readonly subjectKind: RuntimeStateContextBindingValidationSubjectKind;
  readonly status: RuntimeStateContextBindingValidationStatus;
  readonly findings: readonly RuntimeStateContextBindingValidationFinding[];
  readonly summary: RuntimeStateContextBindingValidationSummary;
  readonly evaluatedRuleIds: readonly string[];
  readonly passedRuleCount: number;
  readonly failedRuleCount: number;
}

export interface RuntimeStateContextBindingDeterminismValidationInput {
  readonly firstOutput: RuntimeStateContextBindingIntegrationOutcome;
  readonly secondOutput: RuntimeStateContextBindingIntegrationOutcome;
}

function rule(id: string, category: RuntimeStateContextBindingValidationRuleCategory,
  subjectKind: RuntimeStateContextBindingValidationRule["subjectKind"],
  severity: RuntimeStateContextBindingValidationSeverity, description: string) {
  return Object.freeze({ id, category, subjectKind, severity, description });
}

export const runtimeStateContextBindingValidationRules = Object.freeze([
  rule("DRI-2:5-RULE-EXACT-IDENTITY", "identity", "integration-descriptor", "error", "Integration identity is exact."),
  rule("DRI-2:5-RULE-EXACT-VERSION", "identity", "integration-descriptor", "error", "Integration version is exact."),
  rule("DRI-2:5-RULE-EXACT-NAMESPACE", "identity", "integration-descriptor", "error", "Integration namespace is exact."),
  rule("DRI-2:5-RULE-IMMEDIATE-DEPENDENCY", "dependency", "integration-descriptor", "critical", "Integration depends immediately on DRI-2:3 only."),
  rule("DRI-2:5-RULE-CANONICAL-CONSUMER-ROLE", "vocabulary", "integration-request", "error", "Consumer role is canonical."),
  rule("DRI-2:5-RULE-CANONICAL-DIRECTION", "vocabulary", "integration-request", "error", "Direction is canonical."),
  rule("DRI-2:5-RULE-ROLE-DIRECTION-COMPATIBILITY", "integration-envelope", "integration-request", "error", "Role and direction are compatible."),
  rule("DRI-2:5-RULE-ENGINE-INPUT-PRESENT", "integration-envelope", "integration-request", "critical", "Engine input is structurally present."),
  rule("DRI-2:5-RULE-COMPLETED-OUTCOME-INTEGRITY", "engine-delegation", "integration-outcome", "critical", "Completed outcomes contain authentic engine output only."),
  rule("DRI-2:5-RULE-REJECTED-OUTCOME-INTEGRITY", "integration-envelope", "integration-outcome", "critical", "Rejected outcomes contain reasons and no engine output."),
  rule("DRI-2:5-RULE-BINDING-RESULT-INTEGRITY", "binding-result", "integration-outcome", "critical", "Bound context exists if and only if binding status is bound."),
  rule("DRI-2:5-RULE-COMPATIBILITY-STATUS-CONSISTENCY", "binding-result", "integration-outcome", "error", "Compatibility and binding status agree."),
  rule("DRI-2:5-RULE-IDENTITY-PRESERVATION", "identity", "integration-outcome", "error", "Caller identity agrees across projections."),
  rule("DRI-2:5-RULE-INSPECTION-CONSISTENCY", "structure", "integration-outcome", "error", "Requirements and inspection dimensions agree."),
  rule("DRI-2:5-RULE-PARTIAL-OUTCOME-OBSERVATION", "binding-result", "integration-outcome", "warning", "Partial binding is represented as a non-blocking incomplete outcome."),
  rule("DRI-2:5-RULE-REGISTRY-COUNT-INTEGRITY", "registry", "integration-registry", "error", "Registry counts match their arrays."),
  rule("DRI-2:5-RULE-DESCRIPTOR-INTEGRITY", "descriptor", "integration-descriptor", "error", "Descriptor metadata and vocabularies are canonical."),
  rule("DRI-2:5-RULE-PUBLIC-API-UNIQUENESS", "architecture", "integration-public-api-surface", "error", "Public APIs are ordered, unique, and approved."),
  rule("DRI-2:5-RULE-PROHIBITED-ARCHITECTURE-APIS", "architecture", "integration-public-api-surface", "critical", "Public APIs contain no mutation or synchronization behavior."),
  rule("DRI-2:5-RULE-PLAIN-DATA-SAFETY", "serialization", "all", "error", "Subject is JSON/plain-data safe."),
  rule("DRI-2:5-RULE-SOURCE-NON-MUTATION", "immutability", "all", "info", "Validation observes without modifying its source."),
] as const);

export const runtimeStateContextBindingValidationRuleApplicability = Object.freeze(
  Object.fromEntries(RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_SUBJECT_KINDS.map((kind) =>
    [kind, Object.freeze(runtimeStateContextBindingValidationRules
      .filter(({ subjectKind }) => subjectKind === kind || subjectKind === "all")
      .map(({ id }) => id))])) as Readonly<Record<
        RuntimeStateContextBindingValidationSubjectKind, readonly string[]>>,
);

const ROLE_DIRECTIONS = Object.freeze({
  runtime: Object.freeze(["runtime-to-director", "inspection-only"]),
  director: Object.freeze(["director-to-runtime", "inspection-only"]),
  inspection: Object.freeze(["inspection-only"]),
});
const CANONICAL_SCOPES = Object.freeze(["global", "workspace", "goal", "object", "pack"]);
const CANONICAL_DIMENSIONS = Object.freeze([
  "workspace", "goal", "object", "pack", "mode", "lens", "timelinePosition",
]);

function includes(values: readonly string[], value: unknown): value is string {
  return typeof value === "string" && values.includes(value);
}
function summary(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null || typeof value !== "object") return String(value);
  return Array.isArray(value) ? `array(${value.length})` : "object";
}
function finding(kind: RuntimeStateContextBindingValidationSubjectKind, ruleId: string,
  severity: RuntimeStateContextBindingValidationSeverity, path: string, actual: unknown,
  expected: string, message: string): RuntimeStateContextBindingValidationFinding {
  return Object.freeze({ findingId: `${ruleId}:${kind}:${path}`, ruleId, subjectKind: kind,
    severity, message, path, actual: summary(actual), expected });
}
function isPlainData(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || ["string", "number", "boolean"].includes(typeof value)) return true;
  if (typeof value !== "object" || seen.has(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== Array.prototype && prototype !== null) return false;
  seen.add(value);
  const valid = Object.values(value).every((entry) => isPlainData(entry, seen));
  seen.delete(value);
  return valid;
}
function sameArray(left: readonly unknown[], right: readonly unknown[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}
function structurallyEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (left === null || right === null || typeof left !== "object" || typeof right !== "object")
    return false;
  if (Array.isArray(left) || Array.isArray(right))
    return Array.isArray(left) && Array.isArray(right) && left.length === right.length &&
      left.every((value, index) => structurallyEqual(value, right[index]));
  const leftRecord = left as Record<string, unknown>;
  const rightRecord = right as Record<string, unknown>;
  const leftKeys = Object.keys(leftRecord).sort();
  const rightKeys = Object.keys(rightRecord).sort();
  return sameArray(leftKeys, rightKeys) &&
    leftKeys.every((key) => structurallyEqual(leftRecord[key], rightRecord[key]));
}

function validateRequest(value: RuntimeStateContextBindingIntegrationRequest,
  findings: RuntimeStateContextBindingValidationFinding[]) {
  const record = value as unknown as Record<string, unknown>;
  const role = record.consumerRole;
  const direction = record.direction;
  if (!includes(RUNTIME_STATE_CONTEXT_BINDING_CONSUMER_ROLES, role)) findings.push(finding(
    "integration-request", "DRI-2:5-RULE-CANONICAL-CONSUMER-ROLE", "error",
    "request.consumerRole", role, "canonical consumer role", "Consumer role is not canonical."));
  if (!includes(RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_DIRECTIONS, direction)) findings.push(finding(
    "integration-request", "DRI-2:5-RULE-CANONICAL-DIRECTION", "error",
    "request.direction", direction, "canonical integration direction", "Direction is not canonical."));
  if (includes(RUNTIME_STATE_CONTEXT_BINDING_CONSUMER_ROLES, role) &&
      includes(RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_DIRECTIONS, direction) &&
      !ROLE_DIRECTIONS[role as keyof typeof ROLE_DIRECTIONS].includes(direction)) findings.push(finding(
    "integration-request", "DRI-2:5-RULE-ROLE-DIRECTION-COMPATIBILITY", "error",
    "request.direction", direction, `allowed direction for ${role}`, "Role and direction conflict."));
  const engineInput = record.engineInput as Record<string, unknown> | undefined;
  if (engineInput === undefined || engineInput === null || typeof engineInput !== "object") {
    findings.push(finding("integration-request", "DRI-2:5-RULE-ENGINE-INPUT-PRESENT", "critical",
      "request.engineInput", engineInput, "engine input object", "Engine input is missing."));
    return;
  }
  const bindingRequest = engineInput.request as Record<string, unknown> | undefined;
  if (bindingRequest === undefined || typeof bindingRequest !== "object" ||
      typeof bindingRequest.bindingId !== "string" || bindingRequest.bindingId.length === 0 ||
      bindingRequest.runtimeState === undefined || bindingRequest.context === undefined ||
      !includes(CANONICAL_SCOPES, bindingRequest.scope)) findings.push(finding(
    "integration-request", "DRI-2:5-RULE-ENGINE-INPUT-PRESENT", "critical",
    "request.engineInput.request", bindingRequest, "structural canonical binding request",
    "Nested binding request is malformed."));
}

function validateOutcome(value: RuntimeStateContextBindingIntegrationOutcome,
  findings: RuntimeStateContextBindingValidationFinding[]) {
  const outcome = value as unknown as Record<string, unknown>;
  const status = outcome.status;
  const engine = outcome.engineOutput as Record<string, unknown> | undefined;
  const reasons = Array.isArray(outcome.rejectionReasons) ? outcome.rejectionReasons : [];
  if (status === "completed") {
    if (engine === undefined || reasons.length > 0) findings.push(finding(
      "integration-outcome", "DRI-2:5-RULE-COMPLETED-OUTCOME-INTEGRITY", "critical",
      "outcome.engineOutput", engine, "engine output with no rejection reasons",
      "Completed outcome integrity is violated."));
  } else if (status === "rejected") {
    const ids = reasons.map((item) => (item as Record<string, unknown>).id);
    if (engine !== undefined || ids.length === 0 || new Set(ids).size !== ids.length ||
        ids.some((id) => !includes(RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_REJECTION_REASON_IDS, id)))
      findings.push(finding("integration-outcome", "DRI-2:5-RULE-REJECTED-OUTCOME-INTEGRITY",
        "critical", "outcome.rejectionReasons", reasons,
        "unique canonical reasons and no engine output", "Rejected outcome integrity is violated."));
    return;
  } else {
    findings.push(finding("integration-outcome", "DRI-2:5-RULE-COMPLETED-OUTCOME-INTEGRITY",
      "critical", "outcome.status", status, "completed or rejected", "Outcome status is malformed."));
    return;
  }
  if (engine === undefined) return;
  const result = engine.result as Record<string, unknown> | undefined;
  const binding = result?.binding as Record<string, unknown> | undefined;
  const inspection = engine.inspection as Record<string, unknown> | undefined;
  const compatibility = engine.compatibility as Record<string, unknown> | undefined;
  if (result === undefined || binding === undefined || inspection === undefined ||
      compatibility === undefined) {
    findings.push(finding("integration-outcome", "DRI-2:5-RULE-COMPLETED-OUTCOME-INTEGRITY",
      "critical", "outcome.engineOutput", engine, "complete canonical engine output",
      "Completed outcome contains malformed engine output."));
    return;
  }
  const hasBoundContext = Object.prototype.hasOwnProperty.call(result, "boundContext");
  if ((result.status === "bound") !== hasBoundContext) findings.push(finding(
    "integration-outcome", "DRI-2:5-RULE-BINDING-RESULT-INTEGRITY", "critical",
    "outcome.engineOutput.result.boundContext", hasBoundContext,
    "present iff result.status is bound", "Bound-result invariant is violated."));
  const compatible = compatibility.state === "compatible" && result.status === "bound";
  const incomplete = compatibility.state === "incomplete" && result.status === "partial";
  const incompatible = compatibility.state === "incompatible" &&
    (result.status === "invalid" || result.status === "unbound");
  if (!(compatible || incomplete || incompatible)) findings.push(finding(
    "integration-outcome", "DRI-2:5-RULE-COMPATIBILITY-STATUS-CONSISTENCY", "error",
    "outcome.engineOutput.compatibility.state", compatibility.state,
    "upstream-compatible binding status", "Compatibility and binding status disagree."));
  const request = engine.request as Record<string, unknown>;
  const identities = [request.bindingId, binding.bindingId, inspection.bindingId];
  const requestState = request.runtimeState as Record<string, unknown> | null;
  const bindingState = binding.runtimeState as Record<string, unknown> | null;
  if (new Set(identities).size !== 1 || requestState?.runtimeStateId !== bindingState?.runtimeStateId)
    findings.push(finding("integration-outcome", "DRI-2:5-RULE-IDENTITY-PRESERVATION", "error",
      "outcome.engineOutput.inspection.bindingId", inspection.bindingId,
      "binding request identity", "Binding or runtime-state identity is not preserved."));
  const requirements = (engine.requirements as readonly Record<string, unknown>[])
    .map(({ dimension }) => dimension);
  const available = inspection.availableContextDimensions as readonly unknown[];
  const missing = inspection.missingRequiredDimensions as readonly unknown[];
  const invalidDimensions = [...available, ...missing].some((item) => !includes(CANONICAL_DIMENSIONS, item));
  const overlap = available.some((item) => missing.includes(item));
  const missingNotRequired = missing.some((item) => !requirements.includes(item));
  if (invalidDimensions || overlap || missingNotRequired ||
      new Set(available).size !== available.length || new Set(missing).size !== missing.length)
    findings.push(finding("integration-outcome", "DRI-2:5-RULE-INSPECTION-CONSISTENCY", "error",
      "outcome.engineOutput.inspection", inspection,
      "unique canonical and internally consistent dimensions", "Inspection dimensions conflict."));
  if (result.status === "partial") findings.push(finding(
    "integration-outcome", "DRI-2:5-RULE-PARTIAL-OUTCOME-OBSERVATION", "warning",
    "outcome.engineOutput.result.status", result.status, "complete context when available",
    "Binding is structurally valid but incomplete."));
}

function validateRegistry(value: IntegrationRegistry,
  findings: RuntimeStateContextBindingValidationFinding[]) {
  const pairs: readonly [number, readonly unknown[], string][] = [
    [value.contractTypeCount, value.contractTypes, "contractTypeCount"],
    [value.consumerRoleCount, value.consumerRoles, "consumerRoleCount"],
    [value.directionCount, value.directions, "directionCount"],
    [value.statusCount, value.statuses, "statusCount"],
    [value.rejectionReasonCount, value.rejectionReasons, "rejectionReasonCount"],
    [value.integrationPhaseCount, value.integrationPhases, "integrationPhaseCount"],
    [value.functionalApiCount, value.functionalApis, "functionalApiCount"],
    [value.predicateCount, value.predicates, "predicateCount"],
    [value.publicApiCount, value.publicApiSurface, "publicApiCount"],
  ];
  for (const [count, values, path] of pairs)
    if (count !== values.length || new Set(values).size !== values.length) findings.push(finding(
      "integration-registry", "DRI-2:5-RULE-REGISTRY-COUNT-INTEGRITY", "error",
      `registry.${path}`, count, `unique array length ${values.length}`, "Registry count is invalid."));
}

function validateDescriptor(value: IntegrationDescriptor,
  findings: RuntimeStateContextBindingValidationFinding[]) {
  const checks: readonly [unknown, unknown, string, string][] = [
    [value.identity, directorRuntimeStateContextBindingIntegrationIdentity, "identity", "DRI-2:5-RULE-EXACT-IDENTITY"],
    [value.version, directorRuntimeStateContextBindingIntegrationVersion, "version", "DRI-2:5-RULE-EXACT-VERSION"],
    [value.namespace, directorRuntimeStateContextBindingIntegrationNamespace, "namespace", "DRI-2:5-RULE-EXACT-NAMESPACE"],
    [value.immediateDependency, directorRuntimeStateContextBindingIntegrationUpstream, "immediateDependency", "DRI-2:5-RULE-IMMEDIATE-DEPENDENCY"],
  ];
  for (const [actual, expected, path, ruleId] of checks) if (actual !== expected) findings.push(finding(
    "integration-descriptor", ruleId, ruleId.includes("DEPENDENCY") ? "critical" : "error",
    `descriptor.${path}`, actual, String(expected), "Descriptor exact metadata is invalid."));
  const valid = value.layer === "DRI" && value.capability === "RuntimeStateContextBinding" &&
    value.stage === "Integration" && sameArray(value.consumerRoles, RUNTIME_STATE_CONTEXT_BINDING_CONSUMER_ROLES) &&
    sameArray(value.directions, RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_DIRECTIONS) &&
    sameArray(value.integrationStatuses, RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_STATUSES) &&
    sameArray(value.rejectionReasons, RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_REJECTION_REASON_IDS) &&
    sameArray(value.integrationPhases, RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_PHASES) &&
    new Set(value.characteristics).size === value.characteristics.length &&
    sameArray(value.publicApiSurface, value.registry.publicApiSurface);
  if (!valid) findings.push(finding("integration-descriptor", "DRI-2:5-RULE-DESCRIPTOR-INTEGRITY",
    "error", "descriptor", value, "canonical DRI-2:4 descriptor", "Descriptor integrity is invalid."));
}

function validatePublicApi(value: IntegrationPublicApiSurface,
  findings: RuntimeStateContextBindingValidationFinding[]) {
  if (!sameArray(value, runtimeStateContextBindingIntegrationPublicApiSurface) ||
      new Set(value).size !== value.length) findings.push(finding(
    "integration-public-api-surface", "DRI-2:5-RULE-PUBLIC-API-UNIQUENESS", "error",
    "publicApiSurface", value, "ordered unique DRI-2:4 API surface", "Public API surface is invalid."));
  const prohibited = /(?:set|update|apply|activate|commit|dispatch|synchroniz|push|pull|repair|certif|freeze|release)/i;
  if (value.some((name) => prohibited.test(name))) findings.push(finding(
    "integration-public-api-surface", "DRI-2:5-RULE-PROHIBITED-ARCHITECTURE-APIS", "critical",
    "publicApiSurface", value, "no mutation, synchronization, or future-phase APIs",
    "Public API exposes prohibited architecture behavior."));
}

function createReport(subject: RuntimeStateContextBindingValidationSubject,
  mutableFindings: RuntimeStateContextBindingValidationFinding[]) {
  if (!isPlainData(subject.value)) mutableFindings.push(finding(subject.kind,
    "DRI-2:5-RULE-PLAIN-DATA-SAFETY", "error", "subject.value", subject.value,
    "JSON/plain-data value", "Subject is not plain-data safe."));
  const findings = Object.freeze(mutableFindings);
  const count = (severity: RuntimeStateContextBindingValidationSeverity) =>
    findings.filter((item) => item.severity === severity).length;
  const infoCount = count("info");
  const warningCount = count("warning");
  const errorCount = count("error");
  const criticalCount = count("critical");
  const status = errorCount + criticalCount > 0 ? "invalid" as const :
    warningCount > 0 ? "valid-with-warnings" as const : "valid" as const;
  const evaluatedRuleIds = runtimeStateContextBindingValidationRuleApplicability[subject.kind];
  const failedRuleIds = new Set(findings.filter(({ severity }) => severity !== "info")
    .map(({ ruleId }) => ruleId));
  const validationSummary = Object.freeze({ totalFindings: findings.length, infoCount, warningCount,
    errorCount, criticalCount, blockingFindingCount: errorCount + criticalCount, status });
  return Object.freeze({
    validationIdentity: directorRuntimeStateContextBindingValidationIdentity,
    subjectKind: subject.kind, status, findings, summary: validationSummary,
    evaluatedRuleIds, passedRuleCount: evaluatedRuleIds.length - failedRuleIds.size,
    failedRuleCount: failedRuleIds.size,
  });
}

export function validateRuntimeStateContextBinding(
  subject: RuntimeStateContextBindingValidationSubject,
): RuntimeStateContextBindingValidationReport {
  const findings: RuntimeStateContextBindingValidationFinding[] = [];
  if (subject.kind === "integration-request") validateRequest(subject.value, findings);
  else if (subject.kind === "integration-outcome") validateOutcome(subject.value, findings);
  else if (subject.kind === "integration-descriptor") validateDescriptor(subject.value, findings);
  else if (subject.kind === "integration-registry") validateRegistry(subject.value, findings);
  else validatePublicApi(subject.value, findings);
  return createReport(subject, findings);
}

export function validateRuntimeStateContextBindingIntegrationRequest(
  value: RuntimeStateContextBindingIntegrationRequest,
) { return validateRuntimeStateContextBinding({ kind: "integration-request", value }); }
export function validateRuntimeStateContextBindingIntegrationOutcome(
  value: RuntimeStateContextBindingIntegrationOutcome,
) { return validateRuntimeStateContextBinding({ kind: "integration-outcome", value }); }
export function validateRuntimeStateContextBindingIntegrationDescriptor(
  value: IntegrationDescriptor,
) { return validateRuntimeStateContextBinding({ kind: "integration-descriptor", value }); }
export function validateRuntimeStateContextBindingIntegrationRegistry(
  value: IntegrationRegistry,
) { return validateRuntimeStateContextBinding({ kind: "integration-registry", value }); }

export function validateRuntimeStateContextBindingDeterminism(
  input: RuntimeStateContextBindingDeterminismValidationInput,
): boolean {
  return structurallyEqual(input.firstOutput, input.secondOutput);
}

export function isRuntimeStateContextBindingValidationValid(
  report: RuntimeStateContextBindingValidationReport,
) { return report.status === "valid"; }
export function isRuntimeStateContextBindingValidationInvalid(
  report: RuntimeStateContextBindingValidationReport,
) { return report.status === "invalid"; }
export function hasRuntimeStateContextBindingValidationWarnings(
  report: RuntimeStateContextBindingValidationReport,
) { return report.summary.warningCount > 0; }

export const runtimeStateContextBindingValidationContractNames = Object.freeze([
  "RuntimeStateContextBindingValidationSubject", "RuntimeStateContextBindingValidationRule",
  "RuntimeStateContextBindingValidationFinding", "RuntimeStateContextBindingValidationSummary",
  "RuntimeStateContextBindingValidationReport", "RuntimeStateContextBindingDeterminismValidationInput",
] as const);
export const runtimeStateContextBindingValidationApiNames = Object.freeze([
  "validateRuntimeStateContextBinding", "validateRuntimeStateContextBindingIntegrationRequest",
  "validateRuntimeStateContextBindingIntegrationOutcome",
  "validateRuntimeStateContextBindingIntegrationDescriptor",
  "validateRuntimeStateContextBindingIntegrationRegistry",
  "validateRuntimeStateContextBindingDeterminism",
] as const);
export const runtimeStateContextBindingValidationPredicateNames = Object.freeze([
  "isRuntimeStateContextBindingValidationValid", "isRuntimeStateContextBindingValidationInvalid",
  "hasRuntimeStateContextBindingValidationWarnings",
] as const);
export const runtimeStateContextBindingValidationPublicApiSurface = Object.freeze([
  ...runtimeStateContextBindingValidationApiNames,
  ...runtimeStateContextBindingValidationPredicateNames,
] as const);

export const runtimeStateContextBindingValidationRegistry = Object.freeze({
  subjectKinds: RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_SUBJECT_KINDS,
  subjectKindCount: RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_SUBJECT_KINDS.length,
  ruleCategories: RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_RULE_CATEGORIES,
  ruleCategoryCount: RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_RULE_CATEGORIES.length,
  severities: RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_SEVERITIES,
  severityCount: RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_SEVERITIES.length,
  statuses: RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_STATUSES,
  statusCount: RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_STATUSES.length,
  phases: RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_PHASES,
  phaseCount: RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_PHASES.length,
  rules: runtimeStateContextBindingValidationRules,
  ruleCount: runtimeStateContextBindingValidationRules.length,
  reportContracts: runtimeStateContextBindingValidationContractNames,
  reportContractCount: runtimeStateContextBindingValidationContractNames.length,
  functionalApis: runtimeStateContextBindingValidationApiNames,
  functionalApiCount: runtimeStateContextBindingValidationApiNames.length,
  predicates: runtimeStateContextBindingValidationPredicateNames,
  predicateCount: runtimeStateContextBindingValidationPredicateNames.length,
  publicApiSurface: runtimeStateContextBindingValidationPublicApiSurface,
  publicApiCount: runtimeStateContextBindingValidationPublicApiSurface.length,
});

export const directorRuntimeStateContextBindingValidation = Object.freeze({
  identity: directorRuntimeStateContextBindingValidationIdentity,
  version: directorRuntimeStateContextBindingValidationVersion,
  namespace: directorRuntimeStateContextBindingValidationNamespace,
  layer: "DRI" as const,
  capability: "RuntimeStateContextBinding" as const,
  stage: "Validation" as const,
  immediateDependency: directorRuntimeStateContextBindingValidationUpstream,
  subjectKinds: RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_SUBJECT_KINDS,
  ruleCategories: RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_RULE_CATEGORIES,
  severities: RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_SEVERITIES,
  validationStatuses: RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_STATUSES,
  validationPhases: RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_PHASES,
  characteristics: Object.freeze([
    "deterministic", "stateless", "synchronous", "immutable", "side-effect-free", "plain-data",
    "non-mutating", "non-repairing", "integration-inspecting",
  ] as const),
  ruleRegistry: runtimeStateContextBindingValidationRules,
  publicApiSurface: runtimeStateContextBindingValidationPublicApiSurface,
  registry: runtimeStateContextBindingValidationRegistry,
});
