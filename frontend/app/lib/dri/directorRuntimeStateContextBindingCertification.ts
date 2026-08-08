/** DRI-2:6 — deterministic certification from immutable DRI-2:5 evidence. */

import {
  RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_SUBJECT_KINDS,
  directorRuntimeStateContextBindingValidation,
  directorRuntimeStateContextBindingValidationIdentity,
  directorRuntimeStateContextBindingValidationNamespace,
  directorRuntimeStateContextBindingValidationVersion,
  createRuntimeStateContextBindingIntegrationRequest,
  createRuntimeStateContextBindingRequest,
  executeRuntimeStateContextBindingEngine,
  inspectRuntimeStateContextBindingIntegrationOutcome,
  integrateRuntimeStateContextBinding,
  isBoundRuntimeStateContextBindingResult,
  validateRuntimeStateContextBinding,
  runtimeStateContextBindingValidationRules,
  type RuntimeStateContextBindingValidationReport,
  type RuntimeStateContextBindingValidationStatus,
  type RuntimeStateContextBindingValidationSubjectKind,
} from "@/app/lib/dri/directorRuntimeStateContextBindingValidation";

export {
  createRuntimeStateContextBindingIntegrationRequest,
  createRuntimeStateContextBindingRequest,
  executeRuntimeStateContextBindingEngine,
  inspectRuntimeStateContextBindingIntegrationOutcome,
  integrateRuntimeStateContextBinding,
  isBoundRuntimeStateContextBindingResult,
  validateRuntimeStateContextBinding,
};
export type {
  BoundRuntimeContext, RuntimeContextReference, RuntimeStateContextBindingEngineInput,
  RuntimeStateContextBindingEngineOutput, RuntimeStateContextBindingInspection,
  RuntimeStateContextBindingIntegrationOutcome, RuntimeStateContextBindingIntegrationRequest,
  RuntimeStateContextBindingRequest, RuntimeStateContextBindingResult,
  RuntimeStateContextBindingScope, RuntimeStateContextBindingStatus,
  RuntimeStateContextBindingValidationReport, RuntimeStateReference,
} from "@/app/lib/dri/directorRuntimeStateContextBindingValidation";

export const directorRuntimeStateContextBindingCertificationIdentity =
  "DRI-2:6/DirectorRuntimeStateContextBindingCertification" as const;
export const directorRuntimeStateContextBindingCertificationVersion = "2.6.0" as const;
export const directorRuntimeStateContextBindingCertificationNamespace =
  "nexora.dri.runtime.state-context-binding.certification" as const;
export const directorRuntimeStateContextBindingCertificationUpstream =
  directorRuntimeStateContextBindingValidationIdentity;

export const RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_STATUSES = Object.freeze([
  "not-evaluated", "eligible", "certified", "certified-with-conditions", "rejected",
] as const);
export type RuntimeStateContextBindingCertificationStatus =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_STATUSES)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_DECISIONS = Object.freeze([
  "approve", "approve-with-conditions", "reject",
] as const);
export type RuntimeStateContextBindingCertificationDecision =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_DECISIONS)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_ELIGIBILITY_STATUSES = Object.freeze([
  "eligible", "incomplete", "ineligible",
] as const);
export type RuntimeStateContextBindingCertificationEligibilityStatus =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_ELIGIBILITY_STATUSES)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_REQUIREMENT_CATEGORIES = Object.freeze([
  "identity", "dependency", "architecture", "validation-coverage", "validation-integrity",
  "determinism", "immutability", "serialization", "integration", "registry", "descriptor",
  "public-surface", "prohibited-behavior",
] as const);
export type RuntimeStateContextBindingCertificationRequirementCategory =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_REQUIREMENT_CATEGORIES)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_FINDING_SEVERITIES = Object.freeze([
  "info", "condition", "error", "critical",
] as const);
export type RuntimeStateContextBindingCertificationFindingSeverity =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_FINDING_SEVERITIES)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_EVIDENCE_KINDS = Object.freeze([
  "integration-request", "completed-integration-outcome", "rejected-integration-outcome",
  "integration-registry", "integration-descriptor", "integration-public-api-surface",
] as const);
export type RuntimeStateContextBindingCertificationEvidenceKind =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_EVIDENCE_KINDS)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_GUARANTEES = Object.freeze([
  "foundation-chain-preserved", "contracts-delegated", "engine-deterministic",
  "engine-stateless", "engine-synchronous", "integration-non-owning",
  "validation-non-mutating", "identity-caller-owned", "binding-result-integrity",
  "dependency-chain-linear", "plain-data-compatible", "registry-consistent",
  "descriptor-consistent", "no-runtime-store", "no-state-synchronization",
  "no-event-system", "no-ui-dependency", "no-director-command-execution",
] as const);

export const RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_EVALUATION_PHASES = Object.freeze([
  "request-inspected", "evidence-classified", "eligibility-evaluated",
  "requirements-evaluated", "findings-consolidated", "decision-resolved", "record-created",
] as const);

export interface RuntimeStateContextBindingCertificationEvidence {
  readonly evidenceId: string;
  readonly evidenceKind: RuntimeStateContextBindingCertificationEvidenceKind;
  readonly validationSubjectKind: RuntimeStateContextBindingValidationSubjectKind;
  readonly validationReportIdentity: string;
  readonly validationStatus: RuntimeStateContextBindingValidationStatus;
  readonly evaluatedRuleIds: readonly string[];
  readonly findingSummary: RuntimeStateContextBindingValidationReport["summary"];
  readonly validationReport: RuntimeStateContextBindingValidationReport;
}

export interface RuntimeStateContextBindingCertificationRequest {
  readonly certificationId: string;
  readonly evidence: readonly RuntimeStateContextBindingCertificationEvidence[];
}

export interface RuntimeStateContextBindingCertificationRequirement {
  readonly id: string;
  readonly category: RuntimeStateContextBindingCertificationRequirementCategory;
  readonly description: string;
  readonly requiredEvidenceKinds: readonly RuntimeStateContextBindingCertificationEvidenceKind[];
  readonly blocking: boolean;
}

export interface RuntimeStateContextBindingCertificationFinding {
  readonly findingId: string;
  readonly requirementId: string;
  readonly category: RuntimeStateContextBindingCertificationRequirementCategory;
  readonly severity: RuntimeStateContextBindingCertificationFindingSeverity;
  readonly message: string;
  readonly evidenceReferences: readonly string[];
  readonly blocking: boolean;
}

export interface RuntimeStateContextBindingCertificationEligibility {
  readonly status: RuntimeStateContextBindingCertificationEligibilityStatus;
  readonly missingEvidenceKinds: readonly RuntimeStateContextBindingCertificationEvidenceKind[];
  readonly duplicateEvidenceKinds: readonly RuntimeStateContextBindingCertificationEvidenceKind[];
  readonly conflictingEvidenceIds: readonly string[];
  readonly unsupportedEvidenceKinds: readonly string[];
}

export interface RuntimeStateContextBindingCertificationSummary {
  readonly totalRequirements: number;
  readonly passedRequirements: number;
  readonly conditionRequirements: number;
  readonly failedRequirements: number;
  readonly criticalFailures: number;
  readonly totalEvidenceRecords: number;
  readonly validEvidenceCount: number;
  readonly warningEvidenceCount: number;
  readonly invalidEvidenceCount: number;
  readonly blockingFindingCount: number;
  readonly finalStatus: "certified" | "certified-with-conditions" | "rejected";
  readonly finalDecision: RuntimeStateContextBindingCertificationDecision;
}

export interface RuntimeStateContextBindingCertificationRecord {
  readonly certificationIdentity: string;
  readonly capabilityIdentity: typeof directorRuntimeStateContextBindingCertificationIdentity;
  readonly status: "certified" | "certified-with-conditions" | "rejected";
  readonly decision: RuntimeStateContextBindingCertificationDecision;
  readonly requirementsEvaluated: readonly string[];
  readonly evidenceConsidered: readonly RuntimeStateContextBindingCertificationEvidence[];
  readonly findings: readonly RuntimeStateContextBindingCertificationFinding[];
  readonly summary: RuntimeStateContextBindingCertificationSummary;
  readonly certificationGuarantees: readonly (typeof RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_GUARANTEES)[number][];
}

function requirement(id: string, category: RuntimeStateContextBindingCertificationRequirementCategory,
  description: string, requiredEvidenceKinds: readonly RuntimeStateContextBindingCertificationEvidenceKind[],
  blocking = true): RuntimeStateContextBindingCertificationRequirement {
  return Object.freeze({ id, category, description,
    requiredEvidenceKinds: Object.freeze([...requiredEvidenceKinds]), blocking });
}

const ALL_EVIDENCE = RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_EVIDENCE_KINDS;
export const runtimeStateContextBindingCertificationRequirements = Object.freeze([
  requirement("DRI-2:6-REQ-VALIDATION-IDENTITY", "identity", "Validation identity is canonical.", ALL_EVIDENCE),
  requirement("DRI-2:6-REQ-VALIDATION-VERSION", "identity", "Validation version is compatible.", ALL_EVIDENCE),
  requirement("DRI-2:6-REQ-VALIDATION-NAMESPACE", "identity", "Validation namespace is canonical.", ALL_EVIDENCE),
  requirement("DRI-2:6-REQ-DEPENDENCY-CHAIN", "dependency", "The DRI dependency chain is linear.", ["integration-descriptor"]),
  requirement("DRI-2:6-REQ-EVIDENCE-COVERAGE", "validation-coverage", "All required evidence roles are present.", ALL_EVIDENCE),
  requirement("DRI-2:6-REQ-NO-INVALID-REPORTS", "validation-integrity", "No validation report is invalid.", ALL_EVIDENCE),
  requirement("DRI-2:6-REQ-WARNING-POLICY", "validation-integrity", "Validation warnings are recorded as conditions.", ALL_EVIDENCE, false),
  requirement("DRI-2:6-REQ-STABLE-RULE-IDENTITIES", "determinism", "Validation rule identities are stable.", ALL_EVIDENCE),
  requirement("DRI-2:6-REQ-STABLE-FINDING-IDENTITIES", "determinism", "Validation finding identities are stable.", ALL_EVIDENCE),
  requirement("DRI-2:6-REQ-SUMMARY-INTEGRITY", "validation-integrity", "Validation summaries agree with findings.", ALL_EVIDENCE),
  requirement("DRI-2:6-REQ-SOURCE-NON-MUTATION", "immutability", "Evidence supports source non-mutation.", ALL_EVIDENCE),
  requirement("DRI-2:6-REQ-PLAIN-DATA", "serialization", "Evidence is plain-data compatible.", ALL_EVIDENCE),
  requirement("DRI-2:6-REQ-INTEGRATION-INTEGRITY", "integration", "Completed and rejected integration evidence is valid.", ["completed-integration-outcome", "rejected-integration-outcome"]),
  requirement("DRI-2:6-REQ-REGISTRY-INTEGRITY", "registry", "Integration registry evidence is valid.", ["integration-registry"]),
  requirement("DRI-2:6-REQ-DESCRIPTOR-INTEGRITY", "descriptor", "Integration descriptor evidence is valid.", ["integration-descriptor"]),
  requirement("DRI-2:6-REQ-PUBLIC-SURFACE-INTEGRITY", "public-surface", "Integration public API evidence is valid.", ["integration-public-api-surface"]),
  requirement("DRI-2:6-REQ-PROHIBITED-BEHAVIOR-ABSENCE", "prohibited-behavior", "Validation evidence confirms prohibited behavior is absent.", ALL_EVIDENCE),
] as const);

export const runtimeStateContextBindingCertificationRequirementApplicability = Object.freeze(
  Object.fromEntries(runtimeStateContextBindingCertificationRequirements.map(({ id, requiredEvidenceKinds }) =>
    [id, requiredEvidenceKinds])) as Readonly<Record<string,
      readonly RuntimeStateContextBindingCertificationEvidenceKind[]>>,
);

const SUBJECT_KIND_BY_EVIDENCE_KIND: Readonly<Record<
  RuntimeStateContextBindingCertificationEvidenceKind,
  RuntimeStateContextBindingValidationSubjectKind>> = Object.freeze({
    "integration-request": "integration-request",
    "completed-integration-outcome": "integration-outcome",
    "rejected-integration-outcome": "integration-outcome",
    "integration-registry": "integration-registry",
    "integration-descriptor": "integration-descriptor",
    "integration-public-api-surface": "integration-public-api-surface",
  });

export function createRuntimeStateContextBindingCertificationEvidence(input: Readonly<{
  evidenceId: string;
  evidenceKind: RuntimeStateContextBindingCertificationEvidenceKind;
  validationReport: RuntimeStateContextBindingValidationReport;
}>): RuntimeStateContextBindingCertificationEvidence {
  return Object.freeze({
    evidenceId: input.evidenceId,
    evidenceKind: input.evidenceKind,
    validationSubjectKind: input.validationReport.subjectKind,
    validationReportIdentity: input.validationReport.validationIdentity,
    validationStatus: input.validationReport.status,
    evaluatedRuleIds: input.validationReport.evaluatedRuleIds,
    findingSummary: input.validationReport.summary,
    validationReport: input.validationReport,
  });
}

function structuralKey(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(structuralKey).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) =>
    `${JSON.stringify(key)}:${structuralKey(record[key])}`).join(",")}}`;
}

export function evaluateRuntimeStateContextBindingCertificationEligibility(
  request: RuntimeStateContextBindingCertificationRequest,
): RuntimeStateContextBindingCertificationEligibility {
  const supported = new Set<string>(RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_EVIDENCE_KINDS);
  const unsupportedEvidenceKinds = Object.freeze([...new Set(request.evidence
    .map(({ evidenceKind }) => evidenceKind as string).filter((kind) => !supported.has(kind)))]);
  const present = new Set(request.evidence.map(({ evidenceKind }) => evidenceKind));
  const missingEvidenceKinds = Object.freeze(RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_EVIDENCE_KINDS
    .filter((kind) => !present.has(kind)));
  const duplicateEvidenceKinds = Object.freeze(RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_EVIDENCE_KINDS
    .filter((kind) => request.evidence.filter((item) => item.evidenceKind === kind).length > 1));
  const byId = new Map<string, RuntimeStateContextBindingCertificationEvidence[]>();
  for (const evidence of request.evidence)
    byId.set(evidence.evidenceId, [...(byId.get(evidence.evidenceId) ?? []), evidence]);
  const conflictingEvidenceIds = Object.freeze([...byId.entries()
    .filter(([, values]) => new Set(values.map(structuralKey)).size > 1).map(([id]) => id)]);
  const incompatible = request.evidence.some((item) =>
    supported.has(item.evidenceKind) &&
    SUBJECT_KIND_BY_EVIDENCE_KIND[item.evidenceKind] !== item.validationSubjectKind);
  const status = conflictingEvidenceIds.length > 0 || incompatible ? "ineligible" as const :
    missingEvidenceKinds.length > 0 ? "incomplete" as const : "eligible" as const;
  return Object.freeze({ status, missingEvidenceKinds, duplicateEvidenceKinds,
    conflictingEvidenceIds, unsupportedEvidenceKinds });
}

function certificationFinding(requirementId: string,
  severity: RuntimeStateContextBindingCertificationFindingSeverity, message: string,
  evidenceReferences: readonly string[]): RuntimeStateContextBindingCertificationFinding {
  const requirementRecord = runtimeStateContextBindingCertificationRequirements
    .find(({ id }) => id === requirementId)!;
  const references = Object.freeze([...evidenceReferences]);
  return Object.freeze({
    findingId: `${requirementId}:${references.join("+") || "request"}`,
    requirementId, category: requirementRecord.category, severity, message,
    evidenceReferences: references, blocking: severity === "error" || severity === "critical",
  });
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

export function certifyRuntimeStateContextBinding(
  request: RuntimeStateContextBindingCertificationRequest,
): RuntimeStateContextBindingCertificationRecord {
  const findings: RuntimeStateContextBindingCertificationFinding[] = [];
  const eligibility = evaluateRuntimeStateContextBindingCertificationEligibility(request);
  if (!request.certificationId.trim()) findings.push(certificationFinding(
    "DRI-2:6-REQ-VALIDATION-IDENTITY", "critical", "Caller certification identity is missing.", []));
  if (eligibility.missingEvidenceKinds.length > 0) findings.push(certificationFinding(
    "DRI-2:6-REQ-EVIDENCE-COVERAGE", "error", "Required evidence coverage is incomplete.",
    eligibility.missingEvidenceKinds));
  if (eligibility.duplicateEvidenceKinds.length > 0) findings.push(certificationFinding(
    "DRI-2:6-REQ-EVIDENCE-COVERAGE", "condition", "Duplicate evidence roles were supplied.",
    eligibility.duplicateEvidenceKinds));
  if (eligibility.conflictingEvidenceIds.length > 0) findings.push(certificationFinding(
    "DRI-2:6-REQ-EVIDENCE-COVERAGE", "critical", "Evidence identities conflict.",
    eligibility.conflictingEvidenceIds));
  if (eligibility.unsupportedEvidenceKinds.length > 0) findings.push(certificationFinding(
    "DRI-2:6-REQ-EVIDENCE-COVERAGE", "condition", "Unsupported evidence roles were supplied.",
    eligibility.unsupportedEvidenceKinds));

  const approvedRuleIds = new Set(runtimeStateContextBindingValidationRules.map(({ id }) => id));
  for (const evidence of request.evidence) {
    const refs = [evidence.evidenceId];
    if (evidence.validationReportIdentity !== directorRuntimeStateContextBindingValidationIdentity ||
        evidence.validationReport.validationIdentity !== evidence.validationReportIdentity)
      findings.push(certificationFinding("DRI-2:6-REQ-VALIDATION-IDENTITY", "critical",
        "Validation report identity is incompatible.", refs));
    if (evidence.validationReport.subjectKind !== evidence.validationSubjectKind ||
        (SUBJECT_KIND_BY_EVIDENCE_KIND[evidence.evidenceKind] !== undefined &&
         SUBJECT_KIND_BY_EVIDENCE_KIND[evidence.evidenceKind] !== evidence.validationSubjectKind))
      findings.push(certificationFinding("DRI-2:6-REQ-EVIDENCE-COVERAGE", "critical",
        "Evidence kind and validation subject identity conflict.", refs));
    if (evidence.validationStatus !== evidence.validationReport.status)
      findings.push(certificationFinding("DRI-2:6-REQ-SUMMARY-INTEGRITY", "critical",
        "Evidence status differs from its source report.", refs));
    if (evidence.validationStatus === "invalid") findings.push(certificationFinding(
      "DRI-2:6-REQ-NO-INVALID-REPORTS", "error", "Invalid validation evidence blocks certification.", refs));
    else if (evidence.validationStatus === "valid-with-warnings") findings.push(certificationFinding(
      "DRI-2:6-REQ-WARNING-POLICY", "condition", "Validation warnings require certification conditions.", refs));
    if (new Set(evidence.evaluatedRuleIds).size !== evidence.evaluatedRuleIds.length ||
        evidence.evaluatedRuleIds.some((id) => !approvedRuleIds.has(id))) findings.push(certificationFinding(
      "DRI-2:6-REQ-STABLE-RULE-IDENTITIES", "critical", "Validation rule identities are unstable.", refs));
    const findingIds = evidence.validationReport.findings.map(({ findingId }) => findingId);
    if (new Set(findingIds).size !== findingIds.length) findings.push(certificationFinding(
      "DRI-2:6-REQ-STABLE-FINDING-IDENTITIES", "critical", "Validation finding identities are unstable.", refs));
    const reportSummary = evidence.validationReport.summary;
    const blocking = reportSummary.errorCount + reportSummary.criticalCount;
    if (reportSummary.totalFindings !== evidence.validationReport.findings.length ||
        reportSummary.blockingFindingCount !== blocking ||
        structuralKey(evidence.findingSummary) !== structuralKey(reportSummary))
      findings.push(certificationFinding("DRI-2:6-REQ-SUMMARY-INTEGRITY", "critical",
        "Validation finding summary is inconsistent.", refs));
    if (!isPlainData(evidence)) findings.push(certificationFinding(
      "DRI-2:6-REQ-PLAIN-DATA", "critical", "Evidence is not plain-data compatible.", refs));
  }

  const blockingFindings = findings.filter(({ blocking }) => blocking);
  const conditionFindings = findings.filter(({ severity }) => severity === "condition");
  const status = blockingFindings.length > 0 ? "rejected" as const :
    conditionFindings.length > 0 ? "certified-with-conditions" as const : "certified" as const;
  const decision = status === "rejected" ? "reject" as const :
    status === "certified-with-conditions" ? "approve-with-conditions" as const : "approve" as const;
  const failedRequirementIds = new Set(blockingFindings.map(({ requirementId }) => requirementId));
  const conditionRequirementIds = new Set(conditionFindings.map(({ requirementId }) => requirementId));
  const requirementsEvaluated = Object.freeze(runtimeStateContextBindingCertificationRequirements
    .map(({ id }) => id));
  const validEvidenceCount = request.evidence.filter(({ validationStatus }) => validationStatus === "valid").length;
  const warningEvidenceCount = request.evidence
    .filter(({ validationStatus }) => validationStatus === "valid-with-warnings").length;
  const invalidEvidenceCount = request.evidence
    .filter(({ validationStatus }) => validationStatus === "invalid").length;
  const summary = Object.freeze({
    totalRequirements: requirementsEvaluated.length,
    passedRequirements: requirementsEvaluated.length - failedRequirementIds.size - conditionRequirementIds.size,
    conditionRequirements: conditionRequirementIds.size,
    failedRequirements: failedRequirementIds.size,
    criticalFailures: findings.filter(({ severity }) => severity === "critical").length,
    totalEvidenceRecords: request.evidence.length, validEvidenceCount, warningEvidenceCount,
    invalidEvidenceCount, blockingFindingCount: blockingFindings.length,
    finalStatus: status, finalDecision: decision,
  });
  const guarantees = status === "rejected" ? Object.freeze([]) :
    RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_GUARANTEES;
  return Object.freeze({
    certificationIdentity: request.certificationId,
    capabilityIdentity: directorRuntimeStateContextBindingCertificationIdentity,
    status, decision, requirementsEvaluated,
    evidenceConsidered: Object.freeze([...request.evidence]),
    findings: Object.freeze(findings), summary, certificationGuarantees: guarantees,
  });
}

export function isRuntimeStateContextBindingCertified(record: RuntimeStateContextBindingCertificationRecord) {
  return record.status === "certified";
}
export function isRuntimeStateContextBindingCertifiedWithConditions(
  record: RuntimeStateContextBindingCertificationRecord,
) { return record.status === "certified-with-conditions"; }
export function isRuntimeStateContextBindingCertificationRejected(
  record: RuntimeStateContextBindingCertificationRecord,
) { return record.status === "rejected"; }

export const runtimeStateContextBindingCertificationContractNames = Object.freeze([
  "RuntimeStateContextBindingCertificationEvidence", "RuntimeStateContextBindingCertificationRequest",
  "RuntimeStateContextBindingCertificationRequirement", "RuntimeStateContextBindingCertificationFinding",
  "RuntimeStateContextBindingCertificationEligibility", "RuntimeStateContextBindingCertificationSummary",
  "RuntimeStateContextBindingCertificationRecord",
] as const);
export const runtimeStateContextBindingCertificationApiNames = Object.freeze([
  "createRuntimeStateContextBindingCertificationEvidence",
  "evaluateRuntimeStateContextBindingCertificationEligibility", "certifyRuntimeStateContextBinding",
] as const);
export const runtimeStateContextBindingCertificationPredicateNames = Object.freeze([
  "isRuntimeStateContextBindingCertified", "isRuntimeStateContextBindingCertifiedWithConditions",
  "isRuntimeStateContextBindingCertificationRejected",
] as const);
export const runtimeStateContextBindingCertificationPublicApiSurface = Object.freeze([
  ...runtimeStateContextBindingCertificationApiNames,
  ...runtimeStateContextBindingCertificationPredicateNames,
] as const);

export const runtimeStateContextBindingCertificationRegistry = Object.freeze({
  statuses: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_STATUSES,
  statusCount: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_STATUSES.length,
  decisions: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_DECISIONS,
  decisionCount: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_DECISIONS.length,
  eligibilityStatuses: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_ELIGIBILITY_STATUSES,
  eligibilityStatusCount: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_ELIGIBILITY_STATUSES.length,
  requirementCategories: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_REQUIREMENT_CATEGORIES,
  requirementCategoryCount: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_REQUIREMENT_CATEGORIES.length,
  findingSeverities: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_FINDING_SEVERITIES,
  findingSeverityCount: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_FINDING_SEVERITIES.length,
  evidenceKinds: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_EVIDENCE_KINDS,
  evidenceKindCount: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_EVIDENCE_KINDS.length,
  guarantees: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_GUARANTEES,
  guaranteeCount: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_GUARANTEES.length,
  evaluationPhases: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_EVALUATION_PHASES,
  evaluationPhaseCount: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_EVALUATION_PHASES.length,
  requirements: runtimeStateContextBindingCertificationRequirements,
  requirementCount: runtimeStateContextBindingCertificationRequirements.length,
  contractTypes: runtimeStateContextBindingCertificationContractNames,
  contractTypeCount: runtimeStateContextBindingCertificationContractNames.length,
  functionalApis: runtimeStateContextBindingCertificationApiNames,
  functionalApiCount: runtimeStateContextBindingCertificationApiNames.length,
  predicates: runtimeStateContextBindingCertificationPredicateNames,
  predicateCount: runtimeStateContextBindingCertificationPredicateNames.length,
  publicApiSurface: runtimeStateContextBindingCertificationPublicApiSurface,
  publicApiCount: runtimeStateContextBindingCertificationPublicApiSurface.length,
});

export const directorRuntimeStateContextBindingCertification = Object.freeze({
  identity: directorRuntimeStateContextBindingCertificationIdentity,
  version: directorRuntimeStateContextBindingCertificationVersion,
  namespace: directorRuntimeStateContextBindingCertificationNamespace,
  layer: "DRI" as const,
  capability: "RuntimeStateContextBinding" as const,
  stage: "Certification" as const,
  immediateDependency: directorRuntimeStateContextBindingCertificationUpstream,
  validationVersion: directorRuntimeStateContextBindingValidationVersion,
  validationNamespace: directorRuntimeStateContextBindingValidationNamespace,
  validationSubjectKinds: RUNTIME_STATE_CONTEXT_BINDING_VALIDATION_SUBJECT_KINDS,
  certificationStatuses: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_STATUSES,
  certificationDecisions: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_DECISIONS,
  eligibilityStatuses: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_ELIGIBILITY_STATUSES,
  requirementCategories: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_REQUIREMENT_CATEGORIES,
  findingSeverities: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_FINDING_SEVERITIES,
  evidenceKinds: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_EVIDENCE_KINDS,
  certificationGuarantees: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_GUARANTEES,
  evaluationPhases: RUNTIME_STATE_CONTEXT_BINDING_CERTIFICATION_EVALUATION_PHASES,
  characteristics: Object.freeze([
    "deterministic", "stateless", "synchronous", "immutable", "side-effect-free", "plain-data",
    "non-mutating", "non-repairing", "validation-driven", "evidence-based", "non-persisting",
  ] as const),
  requirementRegistry: runtimeStateContextBindingCertificationRequirements,
  publicApiSurface: runtimeStateContextBindingCertificationPublicApiSurface,
  validationDescriptor: directorRuntimeStateContextBindingValidation,
  registry: runtimeStateContextBindingCertificationRegistry,
});
