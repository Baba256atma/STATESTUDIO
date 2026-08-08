/** DRI-2:8 — declaration/evidence certification; no adapter implementation or execution. */

import {
  RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_CONSUMER_CATEGORIES,
  createRuntimeStateContextBindingIntegrationRequest,
  createRuntimeStateContextBindingRequest,
  directorRuntimeStateContextBindingPlatformIdentity,
  directorRuntimeStateContextBindingPlatformApprovedRuntimeSurface,
  executeRuntimeStateContextBindingEngine,
  inspectRuntimeStateContextBindingIntegrationOutcome,
  integrateRuntimeStateContextBinding,
  isBoundRuntimeStateContextBindingResult,
  validateRuntimeStateContextBinding,
  type RuntimeStateContextBindingPlatformCondition,
  type RuntimeStateContextBindingPlatformManifest,
} from "@/app/lib/dri/directorRuntimeStateContextBindingPlatform";

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
} from "@/app/lib/dri/directorRuntimeStateContextBindingPlatform";

export const directorRuntimeStateContextBindingAdapterCertificationIdentity =
  "DRI-2:8/DirectorRuntimeStateContextBindingAdapterCertification" as const;
export const directorRuntimeStateContextBindingAdapterCertificationVersion = "2.8.0" as const;
export const directorRuntimeStateContextBindingAdapterCertificationNamespace =
  "nexora.dri.runtime.state-context-binding.adapter-certification" as const;
export const directorRuntimeStateContextBindingAdapterCertificationUpstream =
  directorRuntimeStateContextBindingPlatformIdentity;

export const RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_KINDS = Object.freeze([
  "runtime-input", "director-consumer", "inspection", "transport", "composition",
] as const);
export type RuntimeStateContextBindingAdapterKind =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_KINDS)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CAPABILITIES = Object.freeze([
  "create-binding-request", "submit-binding-request", "inspect-binding-result",
  "inspect-bound-context", "project-platform-metadata", "serialize-platform-data",
  "compose-approved-platform-apis",
] as const);
export type RuntimeStateContextBindingAdapterCapability =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CAPABILITIES)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_APPROVED_BEHAVIORS = Object.freeze([
  "preserves-caller-identity", "preserves-binding-status", "preserves-bound-context-invariant",
  "preserves-input-immutability", "preserves-output-immutability", "preserves-plain-data",
  "uses-approved-platform-surface", "remains-deterministic", "remains-stateless",
  "remains-synchronous",
] as const);
export const RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_PROHIBITED_BEHAVIORS = Object.freeze([
  "owns-runtime-state", "owns-executive-context", "owns-director-state",
  "generates-binding-identity", "rewrites-binding-status", "fabricates-bound-context",
  "mutates-platform-input", "mutates-platform-output", "bypasses-platform-surface",
  "introduces-state-synchronization", "introduces-event-dispatch", "introduces-persistence",
  "introduces-ui-semantics", "executes-director-commands",
] as const);
export type RuntimeStateContextBindingAdapterBehavior =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_APPROVED_BEHAVIORS)[number] |
  (typeof RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_PROHIBITED_BEHAVIORS)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_EVIDENCE_KINDS = Object.freeze([
  "declaration", "compatibility", "identity-preservation", "binding-result-integrity",
  "immutability", "determinism", "serialization", "dependency",
  "prohibited-behavior-absence", "platform-requirement-coverage",
  "platform-guarantee-preservation",
] as const);
export type RuntimeStateContextBindingAdapterEvidenceKind =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_EVIDENCE_KINDS)[number];
export const RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_EVIDENCE_RESULTS = Object.freeze([
  "passed", "conditional", "failed", "not-provided",
] as const);
export type RuntimeStateContextBindingAdapterEvidenceResult =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_EVIDENCE_RESULTS)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_COMPATIBILITY_STATES = Object.freeze([
  "compatible", "compatible-with-conditions", "incompatible",
] as const);
export type RuntimeStateContextBindingAdapterCompatibility =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_COMPATIBILITY_STATES)[number];
export const RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_STATUSES = Object.freeze([
  "not-evaluated", "eligible", "certified", "certified-with-conditions", "rejected",
] as const);
export const RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_DECISIONS = Object.freeze([
  "approve", "approve-with-conditions", "reject",
] as const);
export const RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_ELIGIBILITY_VALUES = Object.freeze([
  "eligible", "conditionally-eligible", "ineligible",
] as const);
export const RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_REQUIREMENT_CATEGORIES = Object.freeze([
  "identity", "platform-compatibility", "dependency", "capability", "requirement-coverage",
  "guarantee-preservation", "binding-result-integrity", "immutability", "determinism",
  "serialization", "state-ownership", "side-effects", "ui-separation",
  "director-separation", "evidence-integrity",
] as const);
export type RuntimeStateContextBindingAdapterRequirementCategory =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_REQUIREMENT_CATEGORIES)[number];
export const RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_FINDING_SEVERITIES = Object.freeze([
  "info", "condition", "error", "critical",
] as const);
export type RuntimeStateContextBindingAdapterFindingSeverity =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_FINDING_SEVERITIES)[number];
export const RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_EVALUATION_PHASES = Object.freeze([
  "request-inspected", "platform-validated", "adapter-classified", "compatibility-evaluated",
  "requirements-evaluated", "evidence-evaluated", "guarantees-evaluated",
  "prohibited-behaviors-evaluated", "findings-consolidated", "decision-resolved",
  "record-created",
] as const);
export const RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_CHARACTERISTICS = Object.freeze([
  "deterministic", "stateless", "synchronous", "immutable", "side-effect-free", "plain-data",
  "platform-derived", "evidence-based", "non-mutating", "non-executing", "non-activating",
  "non-persisting",
] as const);

export interface RuntimeStateContextBindingAdapterDeclaration {
  readonly adapterId: string;
  readonly adapterName: string;
  readonly adapterVersion: string;
  readonly adapterKind: RuntimeStateContextBindingAdapterKind;
  readonly consumerCategory: (typeof RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_CONSUMER_CATEGORIES)[number];
  readonly targetPlatformIdentity: string;
  readonly targetPlatformVersion: string;
  readonly declaredCapabilities: readonly RuntimeStateContextBindingAdapterCapability[];
  readonly preservedGuarantees: readonly string[];
  readonly satisfiedRequirements: readonly string[];
  readonly declaredBehaviors: readonly RuntimeStateContextBindingAdapterBehavior[];
}
export interface RuntimeStateContextBindingAdapterEvidence {
  readonly evidenceId: string;
  readonly adapterId: string;
  readonly evidenceKind: RuntimeStateContextBindingAdapterEvidenceKind;
  readonly claimId: string;
  readonly result: RuntimeStateContextBindingAdapterEvidenceResult;
  readonly details: string;
}
export interface RuntimeStateContextBindingAdapterCertificationRequest {
  readonly certificationId: string;
  readonly platform: RuntimeStateContextBindingPlatformManifest;
  readonly adapter: RuntimeStateContextBindingAdapterDeclaration;
  readonly evidence: readonly RuntimeStateContextBindingAdapterEvidence[];
}

export interface RuntimeStateContextBindingAdapterCertificationRequirement {
  readonly id: string;
  readonly category: RuntimeStateContextBindingAdapterRequirementCategory;
  readonly description: string;
  readonly blocking: boolean;
  readonly requiredEvidenceKinds: readonly RuntimeStateContextBindingAdapterEvidenceKind[];
}

const REQUIREMENT_DEFINITIONS = Object.freeze([
  ["exact-platform-identity", "identity", "compatibility"],
  ["supported-platform-version", "platform-compatibility", "compatibility"],
  ["approved-adapter-kind", "capability", "declaration"],
  ["approved-capability-set", "capability", "declaration"],
  ["approved-platform-consumer-category", "platform-compatibility", "compatibility"],
  ["uses-platform-surface-only", "dependency", "dependency"],
  ["preserves-caller-owned-identity", "identity", "identity-preservation"],
  ["preserves-binding-status-semantics", "binding-result-integrity", "binding-result-integrity"],
  ["preserves-bound-context-invariant", "binding-result-integrity", "binding-result-integrity"],
  ["preserves-input-immutability", "immutability", "immutability"],
  ["preserves-output-immutability", "immutability", "immutability"],
  ["preserves-determinism", "determinism", "determinism"],
  ["preserves-statelessness", "determinism", "determinism"],
  ["preserves-synchronous-behavior", "determinism", "determinism"],
  ["preserves-plain-data-contracts", "serialization", "serialization"],
  ["preserves-platform-conditions", "platform-compatibility", "compatibility"],
  ["satisfies-platform-requirements", "requirement-coverage", "platform-requirement-coverage"],
  ["preserves-certified-platform-guarantees", "guarantee-preservation", "platform-guarantee-preservation"],
  ["does-not-own-runtime-state", "state-ownership", "prohibited-behavior-absence"],
  ["does-not-own-executive-context", "state-ownership", "prohibited-behavior-absence"],
  ["does-not-own-director-state", "state-ownership", "prohibited-behavior-absence"],
  ["does-not-synchronize-state", "side-effects", "prohibited-behavior-absence"],
  ["does-not-dispatch-events", "side-effects", "prohibited-behavior-absence"],
  ["does-not-persist-binding-state", "side-effects", "prohibited-behavior-absence"],
  ["does-not-introduce-ui-semantics", "ui-separation", "prohibited-behavior-absence"],
  ["does-not-execute-director-commands", "director-separation", "prohibited-behavior-absence"],
  ["does-not-bypass-platform-dependency", "dependency", "dependency"],
] as const satisfies readonly (readonly [string, RuntimeStateContextBindingAdapterRequirementCategory,
  RuntimeStateContextBindingAdapterEvidenceKind])[]);

export const runtimeStateContextBindingAdapterCertificationRequirements = Object.freeze(
  REQUIREMENT_DEFINITIONS.map(([id, category, evidenceKind]) => Object.freeze({
    id: `DRI-2:8-REQ-${id.toUpperCase().replaceAll("-", "-")}`,
    category, description: `Candidate adapter ${id.replaceAll("-", " ")}.`, blocking: true,
    requiredEvidenceKinds: Object.freeze([evidenceKind]),
  })),
);

export const RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_GUARANTEES = Object.freeze([
  "platform-surface-only", "caller-identity-preserved", "binding-semantics-preserved",
  "bound-context-invariant-preserved", "input-immutability-preserved",
  "output-immutability-preserved", "determinism-preserved", "statelessness-preserved",
  "synchronous-behavior-preserved", "plain-data-preserved", "runtime-state-non-owning",
  "executive-context-non-owning", "director-state-non-owning", "no-state-synchronization",
  "no-event-dispatch", "no-persistence", "no-ui-semantics", "no-director-command-execution",
] as const);

export interface RuntimeStateContextBindingAdapterCertificationFinding {
  readonly findingId: string;
  readonly requirementId: string;
  readonly adapterId: string;
  readonly category: RuntimeStateContextBindingAdapterRequirementCategory;
  readonly severity: RuntimeStateContextBindingAdapterFindingSeverity;
  readonly message: string;
  readonly evidenceReferences: readonly string[];
  readonly blocking: boolean;
}
export interface RuntimeStateContextBindingAdapterEligibility {
  readonly eligibility: "eligible" | "conditionally-eligible" | "ineligible";
  readonly platformStatus: RuntimeStateContextBindingPlatformManifest["platformStatus"];
  readonly platformReadiness: RuntimeStateContextBindingPlatformManifest["platformReadiness"];
  readonly adapterCompatibility: RuntimeStateContextBindingAdapterCompatibility;
  readonly blockingReasons: readonly string[];
  readonly conditions: readonly RuntimeStateContextBindingPlatformCondition[];
}
export interface RuntimeStateContextBindingAdapterCertificationSummary {
  readonly totalRequirements: number; readonly passedRequirements: number;
  readonly conditionalRequirements: number; readonly failedRequirements: number;
  readonly criticalFailures: number; readonly totalEvidence: number;
  readonly passedEvidence: number; readonly conditionalEvidence: number;
  readonly failedEvidence: number; readonly missingEvidence: number;
  readonly preservedGuaranteeCount: number; readonly missingGuaranteeCount: number;
  readonly satisfiedPlatformRequirementCount: number; readonly missingPlatformRequirementCount: number;
  readonly blockingFindingCount: number;
  readonly status: "certified" | "certified-with-conditions" | "rejected";
  readonly decision: "approve" | "approve-with-conditions" | "reject";
  readonly compatibility: RuntimeStateContextBindingAdapterCompatibility;
}
export interface RuntimeStateContextBindingAdapterCertificationRecord {
  readonly certificationIdentity: string; readonly adapterIdentity: string;
  readonly adapterKind: RuntimeStateContextBindingAdapterKind; readonly adapterVersion: string;
  readonly platformIdentity: string; readonly platformVersion: string;
  readonly compatibility: RuntimeStateContextBindingAdapterCompatibility;
  readonly status: "certified" | "certified-with-conditions" | "rejected";
  readonly decision: "approve" | "approve-with-conditions" | "reject";
  readonly requirementsEvaluated: readonly string[];
  readonly evidenceConsidered: readonly RuntimeStateContextBindingAdapterEvidence[];
  readonly findings: readonly RuntimeStateContextBindingAdapterCertificationFinding[];
  readonly summary: RuntimeStateContextBindingAdapterCertificationSummary;
  readonly certifiedCapabilities: readonly RuntimeStateContextBindingAdapterCapability[];
  readonly preservedGuarantees: readonly string[]; readonly satisfiedPlatformRequirements: readonly string[];
  readonly conditions: readonly string[];
  readonly adapterCertificationGuarantees:
    readonly (typeof RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_GUARANTEES)[number][];
}

function includes(values: readonly string[], value: unknown): value is string {
  return typeof value === "string" && values.includes(value);
}
function finding(adapterId: string, requirementId: string, code: string,
  severity: RuntimeStateContextBindingAdapterFindingSeverity, message: string,
  evidenceReferences: readonly string[] = []): RuntimeStateContextBindingAdapterCertificationFinding {
  const requirement = runtimeStateContextBindingAdapterCertificationRequirements
    .find(({ id }) => id === requirementId)!;
  return Object.freeze({ findingId: `${requirementId}:${code}:${evidenceReferences.join("+") || "declaration"}`,
    requirementId, adapterId, category: requirement.category, severity, message,
    evidenceReferences: Object.freeze([...evidenceReferences]),
    blocking: severity === "error" || severity === "critical" });
}
const requirementId = (name: string) => `DRI-2:8-REQ-${name.toUpperCase()}`;

export function createRuntimeStateContextBindingAdapterEvidence(
  input: RuntimeStateContextBindingAdapterEvidence,
): RuntimeStateContextBindingAdapterEvidence { return Object.freeze({ ...input }); }

export function evaluateRuntimeStateContextBindingAdapterEligibility(
  request: RuntimeStateContextBindingAdapterCertificationRequest,
): RuntimeStateContextBindingAdapterEligibility {
  const reasons: string[] = [];
  const platformOkay = ["published", "published-with-conditions"].includes(request.platform.platformStatus) &&
    ["ReadyForAdapterCertification", "ReadyWithConditions"].includes(request.platform.platformReadiness);
  if (!platformOkay) reasons.push("platform-not-ready");
  if (request.adapter.targetPlatformIdentity !== request.platform.platformIdentity)
    reasons.push("platform-identity-mismatch");
  if (request.adapter.targetPlatformVersion !== request.platform.platformVersion)
    reasons.push("platform-version-mismatch");
  if (!includes(RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_KINDS, request.adapter.adapterKind))
    reasons.push("unsupported-adapter-kind");
  if (!includes(RUNTIME_STATE_CONTEXT_BINDING_PLATFORM_CONSUMER_CATEGORIES,
    request.adapter.consumerCategory)) reasons.push("unsupported-consumer-category");
  const conditional = request.platform.conditions.length > 0;
  const eligibility = reasons.length > 0 ? "ineligible" as const :
    conditional ? "conditionally-eligible" as const : "eligible" as const;
  const adapterCompatibility = reasons.length > 0 ? "incompatible" as const :
    conditional ? "compatible-with-conditions" as const : "compatible" as const;
  return Object.freeze({ eligibility, platformStatus: request.platform.platformStatus,
    platformReadiness: request.platform.platformReadiness, adapterCompatibility,
    blockingReasons: Object.freeze(reasons), conditions: request.platform.conditions });
}

function uniqueIntersection(source: readonly string[], approved: readonly string[]) {
  return Object.freeze(approved.filter((item) => source.includes(item)));
}

export function certifyRuntimeStateContextBindingAdapter(
  request: RuntimeStateContextBindingAdapterCertificationRequest,
): RuntimeStateContextBindingAdapterCertificationRecord {
  const { adapter, platform } = request;
  const findings: RuntimeStateContextBindingAdapterCertificationFinding[] = [];
  const eligibility = evaluateRuntimeStateContextBindingAdapterEligibility(request);
  for (const reason of eligibility.blockingReasons) findings.push(finding(adapter.adapterId,
    requirementId("EXACT-PLATFORM-IDENTITY"), reason, "critical", reason));
  if (!request.certificationId.trim() || !adapter.adapterId.trim() || !adapter.adapterName.trim() ||
      !adapter.adapterVersion.trim()) findings.push(finding(adapter.adapterId,
    requirementId("EXACT-PLATFORM-IDENTITY"), "invalid-identity", "critical",
    "Caller-owned certification or adapter identity is malformed."));

  const unsupportedCapabilities = adapter.declaredCapabilities
    .filter((item) => !includes(RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CAPABILITIES, item));
  if (unsupportedCapabilities.length) findings.push(finding(adapter.adapterId,
    requirementId("APPROVED-CAPABILITY-SET"), "unsupported-capability", "error",
    "Adapter declares unsupported capabilities."));
  const missingBehaviors = RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_APPROVED_BEHAVIORS
    .filter((item) => !adapter.declaredBehaviors.includes(item));
  if (missingBehaviors.length) findings.push(finding(adapter.adapterId,
    requirementId("USES-PLATFORM-SURFACE-ONLY"), "missing-approved-behavior", "error",
    "Adapter does not declare every approved preservation behavior."));
  for (const behavior of adapter.declaredBehaviors)
    if (includes(RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_PROHIBITED_BEHAVIORS, behavior)) {
      const critical = ["owns-runtime-state", "fabricates-bound-context",
        "bypasses-platform-surface", "executes-director-commands"].includes(behavior);
      findings.push(finding(adapter.adapterId,
        behavior === "fabricates-bound-context" ? requirementId("PRESERVES-BOUND-CONTEXT-INVARIANT") :
          behavior === "executes-director-commands" ? requirementId("DOES-NOT-EXECUTE-DIRECTOR-COMMANDS") :
            behavior === "bypasses-platform-surface" ? requirementId("DOES-NOT-BYPASS-PLATFORM-DEPENDENCY") :
              requirementId("DOES-NOT-OWN-RUNTIME-STATE"), `prohibited-${behavior}`,
        critical ? "critical" : "error", `Adapter declares prohibited behavior: ${behavior}.`));
    }

  const missingRequirements = platform.platformRequirements
    .map(({ id }) => id).filter((id) => !adapter.satisfiedRequirements.includes(id));
  const duplicateRequirements = [...new Set(adapter.satisfiedRequirements
    .filter((id, index) => adapter.satisfiedRequirements.indexOf(id) !== index))];
  const unsupportedRequirements = adapter.satisfiedRequirements
    .filter((id) => !platform.platformRequirements.some((item) => item.id === id));
  if (missingRequirements.length) findings.push(finding(adapter.adapterId,
    requirementId("SATISFIES-PLATFORM-REQUIREMENTS"), "missing-requirements", "error",
    "Platform requirement coverage is incomplete."));
  if (duplicateRequirements.length) findings.push(finding(adapter.adapterId,
    requirementId("SATISFIES-PLATFORM-REQUIREMENTS"), "duplicate-requirements", "condition",
    "Duplicate platform requirement claims were supplied."));
  if (unsupportedRequirements.length) findings.push(finding(adapter.adapterId,
    requirementId("SATISFIES-PLATFORM-REQUIREMENTS"), "unsupported-requirements", "condition",
    "Unsupported platform requirement claims were supplied."));
  const missingGuarantees = platform.approvedGuarantees
    .filter((id) => !adapter.preservedGuarantees.includes(id));
  if (missingGuarantees.length) findings.push(finding(adapter.adapterId,
    requirementId("PRESERVES-CERTIFIED-PLATFORM-GUARANTEES"), "missing-guarantees", "error",
    "Certified Platform guarantees are not fully preserved."));

  const supportedEvidence = new Set<string>(RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_EVIDENCE_KINDS);
  const presentKinds = new Set(request.evidence.map(({ evidenceKind }) => evidenceKind));
  const missingEvidenceKinds = RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_EVIDENCE_KINDS
    .filter((kind) => !presentKinds.has(kind));
  if (missingEvidenceKinds.length) findings.push(finding(adapter.adapterId,
    requirementId("USES-PLATFORM-SURFACE-ONLY"), "missing-evidence", "error",
    "Required adapter evidence is missing."));
  const duplicateKinds = RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_EVIDENCE_KINDS.filter((kind) =>
    request.evidence.filter((item) => item.evidenceKind === kind).length > 1);
  if (duplicateKinds.length) findings.push(finding(adapter.adapterId,
    requirementId("USES-PLATFORM-SURFACE-ONLY"), "duplicate-evidence", "condition",
    "Duplicate evidence kinds were supplied."));
  const evidenceById = new Map<string, RuntimeStateContextBindingAdapterEvidence[]>();
  for (const evidence of request.evidence)
    evidenceById.set(evidence.evidenceId, [...(evidenceById.get(evidence.evidenceId) ?? []), evidence]);
  for (const [id, values] of evidenceById)
    if (new Set(values.map((value) => JSON.stringify(value))).size > 1) findings.push(finding(
      adapter.adapterId, requirementId("USES-PLATFORM-SURFACE-ONLY"), "conflicting-evidence",
      "critical", "Evidence identity contains conflicting claims.", [id]));
  for (const evidence of request.evidence) {
    if (!supportedEvidence.has(evidence.evidenceKind)) findings.push(finding(adapter.adapterId,
      requirementId("USES-PLATFORM-SURFACE-ONLY"), "unsupported-evidence", "condition",
      "Unsupported adapter evidence was supplied.", [evidence.evidenceId]));
    if (evidence.adapterId !== adapter.adapterId || !evidence.claimId.trim()) findings.push(finding(
      adapter.adapterId, requirementId("PRESERVES-CALLER-OWNED-IDENTITY"), "evidence-identity",
      "critical", "Evidence identity does not match the adapter declaration.", [evidence.evidenceId]));
    if (evidence.result === "failed" || evidence.result === "not-provided") findings.push(finding(
      adapter.adapterId, requirementId("USES-PLATFORM-SURFACE-ONLY"), `evidence-${evidence.result}`,
      "error", "Blocking adapter evidence did not pass.", [evidence.evidenceId]));
    else if (evidence.result === "conditional") findings.push(finding(adapter.adapterId,
      requirementId("USES-PLATFORM-SURFACE-ONLY"), "conditional-evidence", "condition",
      "Adapter evidence carries a condition.", [evidence.evidenceId]));
  }
  for (const condition of platform.conditions) findings.push(finding(adapter.adapterId,
    requirementId("PRESERVES-PLATFORM-CONDITIONS"), condition.conditionId, "condition",
    condition.description, [condition.sourceCertificationFindingId]));

  const blocking = findings.filter((item) => item.blocking);
  const conditional = findings.filter(({ severity }) => severity === "condition");
  const status = blocking.length ? "rejected" as const :
    conditional.length ? "certified-with-conditions" as const : "certified" as const;
  const decision = status === "rejected" ? "reject" as const :
    status === "certified-with-conditions" ? "approve-with-conditions" as const : "approve" as const;
  const compatibility = blocking.length ? "incompatible" as const :
    conditional.length ? "compatible-with-conditions" as const : "compatible" as const;
  const failedIds = new Set(blocking.map(({ requirementId: id }) => id));
  const conditionIds = new Set(conditional.map(({ requirementId: id }) => id));
  const requirementsEvaluated = Object.freeze(runtimeStateContextBindingAdapterCertificationRequirements
    .map(({ id }) => id));
  const certifiedCapabilities = uniqueIntersection(adapter.declaredCapabilities,
    RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CAPABILITIES) as readonly RuntimeStateContextBindingAdapterCapability[];
  const preservedGuarantees = uniqueIntersection(adapter.preservedGuarantees, platform.approvedGuarantees);
  const satisfiedPlatformRequirements = uniqueIntersection(adapter.satisfiedRequirements,
    platform.platformRequirements.map(({ id }) => id));
  const summary = Object.freeze({
    totalRequirements: requirementsEvaluated.length,
    passedRequirements: requirementsEvaluated.length - failedIds.size - conditionIds.size,
    conditionalRequirements: conditionIds.size, failedRequirements: failedIds.size,
    criticalFailures: findings.filter(({ severity }) => severity === "critical").length,
    totalEvidence: request.evidence.length,
    passedEvidence: request.evidence.filter(({ result }) => result === "passed").length,
    conditionalEvidence: request.evidence.filter(({ result }) => result === "conditional").length,
    failedEvidence: request.evidence.filter(({ result }) => result === "failed").length,
    missingEvidence: missingEvidenceKinds.length,
    preservedGuaranteeCount: preservedGuarantees.length, missingGuaranteeCount: missingGuarantees.length,
    satisfiedPlatformRequirementCount: satisfiedPlatformRequirements.length,
    missingPlatformRequirementCount: missingRequirements.length,
    blockingFindingCount: blocking.length, status, decision, compatibility,
  });
  return Object.freeze({
    certificationIdentity: request.certificationId, adapterIdentity: adapter.adapterId,
    adapterKind: adapter.adapterKind, adapterVersion: adapter.adapterVersion,
    platformIdentity: platform.platformIdentity, platformVersion: platform.platformVersion,
    compatibility, status, decision, requirementsEvaluated,
    evidenceConsidered: Object.freeze([...request.evidence]), findings: Object.freeze(findings), summary,
    certifiedCapabilities, preservedGuarantees, satisfiedPlatformRequirements,
    conditions: Object.freeze([...platform.conditions.map(({ conditionId }) => conditionId),
      ...conditional.map(({ findingId }) => findingId)]),
    adapterCertificationGuarantees: status === "rejected" ? Object.freeze([]) :
      RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_GUARANTEES,
  });
}

export function inspectRuntimeStateContextBindingAdapterCertification(
  record: RuntimeStateContextBindingAdapterCertificationRecord,
) { return Object.freeze({ adapterIdentity: record.adapterIdentity, adapterKind: record.adapterKind,
  platformIdentity: record.platformIdentity, compatibility: record.compatibility,
  status: record.status, decision: record.decision, conditionCount: record.conditions.length,
  blockingFindingCount: record.summary.blockingFindingCount,
  preservedGuaranteeCount: record.preservedGuarantees.length,
  satisfiedRequirementCount: record.satisfiedPlatformRequirements.length }); }
export function isRuntimeStateContextBindingAdapterCertified(
  record: RuntimeStateContextBindingAdapterCertificationRecord,
) { return record.status === "certified"; }
export function isRuntimeStateContextBindingAdapterCertifiedWithConditions(
  record: RuntimeStateContextBindingAdapterCertificationRecord,
) { return record.status === "certified-with-conditions"; }
export function isRuntimeStateContextBindingAdapterCertificationRejected(
  record: RuntimeStateContextBindingAdapterCertificationRecord,
) { return record.status === "rejected"; }

export const runtimeStateContextBindingAdapterCertificationContractNames = Object.freeze([
  "RuntimeStateContextBindingAdapterDeclaration", "RuntimeStateContextBindingAdapterEvidence",
  "RuntimeStateContextBindingAdapterCertificationRequest",
  "RuntimeStateContextBindingAdapterCertificationRequirement",
  "RuntimeStateContextBindingAdapterCertificationFinding",
  "RuntimeStateContextBindingAdapterEligibility", "RuntimeStateContextBindingAdapterCertificationSummary",
  "RuntimeStateContextBindingAdapterCertificationRecord",
] as const);
export const runtimeStateContextBindingAdapterCertificationApiNames = Object.freeze([
  "createRuntimeStateContextBindingAdapterEvidence",
  "evaluateRuntimeStateContextBindingAdapterEligibility",
  "certifyRuntimeStateContextBindingAdapter",
  "inspectRuntimeStateContextBindingAdapterCertification",
] as const);
export const runtimeStateContextBindingAdapterCertificationPredicateNames = Object.freeze([
  "isRuntimeStateContextBindingAdapterCertified",
  "isRuntimeStateContextBindingAdapterCertifiedWithConditions",
  "isRuntimeStateContextBindingAdapterCertificationRejected",
] as const);
export const runtimeStateContextBindingAdapterCertificationPublicApiSurface = Object.freeze([
  ...runtimeStateContextBindingAdapterCertificationApiNames,
  ...runtimeStateContextBindingAdapterCertificationPredicateNames,
] as const);

export const runtimeStateContextBindingApprovedRuntimeApiSurface = Object.freeze(
  directorRuntimeStateContextBindingPlatformApprovedRuntimeSurface.apiSurface,
);
export const runtimeStateContextBindingApprovedRuntimeTypeSurface = Object.freeze([
  "RuntimeStateReference", "RuntimeContextReference", "RuntimeStateContextBindingScope",
  "RuntimeStateContextBindingStatus", "RuntimeStateContextBindingRequest",
  "RuntimeStateContextBindingResult", "BoundRuntimeContext",
  "RuntimeStateContextBindingInspection", "RuntimeStateContextBindingEngineInput",
  "RuntimeStateContextBindingEngineOutput", "RuntimeStateContextBindingIntegrationRequest",
  "RuntimeStateContextBindingIntegrationOutcome", "RuntimeStateContextBindingValidationReport",
] as const);
export const runtimeStateContextBindingApprovedRuntimeSurfaceReadiness =
  "ApprovedRuntimeSurfaceReadyForPublicIndex" as const;
export const directorRuntimeStateContextBindingApprovedRuntimeSurface = Object.freeze({
  identity: "DRI-2:8/ApprovedRuntimeConsumerSurface" as const,
  source: directorRuntimeStateContextBindingPlatformApprovedRuntimeSurface.identity,
  consumerApproval: "AdapterCertifiedPlatformApproved" as const,
  apiSurface: runtimeStateContextBindingApprovedRuntimeApiSurface,
  apiCount: runtimeStateContextBindingApprovedRuntimeApiSurface.length,
  typeSurface: runtimeStateContextBindingApprovedRuntimeTypeSurface,
  typeCount: runtimeStateContextBindingApprovedRuntimeTypeSurface.length,
  identityPreserved: true,
  readiness: runtimeStateContextBindingApprovedRuntimeSurfaceReadiness,
});

export const runtimeStateContextBindingAdapterCertificationRegistry = Object.freeze({
  adapterKinds: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_KINDS,
  adapterKindCount: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_KINDS.length,
  adapterCapabilities: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CAPABILITIES,
  adapterCapabilityCount: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CAPABILITIES.length,
  approvedBehaviors: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_APPROVED_BEHAVIORS,
  approvedBehaviorCount: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_APPROVED_BEHAVIORS.length,
  prohibitedBehaviors: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_PROHIBITED_BEHAVIORS,
  prohibitedBehaviorCount: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_PROHIBITED_BEHAVIORS.length,
  evidenceKinds: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_EVIDENCE_KINDS,
  evidenceKindCount: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_EVIDENCE_KINDS.length,
  evidenceResults: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_EVIDENCE_RESULTS,
  evidenceResultCount: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_EVIDENCE_RESULTS.length,
  compatibilityStates: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_COMPATIBILITY_STATES,
  compatibilityStateCount: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_COMPATIBILITY_STATES.length,
  certificationStatuses: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_STATUSES,
  certificationStatusCount: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_STATUSES.length,
  certificationDecisions: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_DECISIONS,
  certificationDecisionCount: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_DECISIONS.length,
  requirementCategories: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_REQUIREMENT_CATEGORIES,
  requirementCategoryCount: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_REQUIREMENT_CATEGORIES.length,
  findingSeverities: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_FINDING_SEVERITIES,
  findingSeverityCount: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_FINDING_SEVERITIES.length,
  evaluationPhases: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_EVALUATION_PHASES,
  evaluationPhaseCount: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_EVALUATION_PHASES.length,
  requirements: runtimeStateContextBindingAdapterCertificationRequirements,
  requirementCount: runtimeStateContextBindingAdapterCertificationRequirements.length,
  certificationGuarantees: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_GUARANTEES,
  certificationGuaranteeCount: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_GUARANTEES.length,
  contractTypes: runtimeStateContextBindingAdapterCertificationContractNames,
  contractTypeCount: runtimeStateContextBindingAdapterCertificationContractNames.length,
  functionalApis: runtimeStateContextBindingAdapterCertificationApiNames,
  functionalApiCount: runtimeStateContextBindingAdapterCertificationApiNames.length,
  predicates: runtimeStateContextBindingAdapterCertificationPredicateNames,
  predicateCount: runtimeStateContextBindingAdapterCertificationPredicateNames.length,
  publicApiSurface: runtimeStateContextBindingAdapterCertificationPublicApiSurface,
  publicApiCount: runtimeStateContextBindingAdapterCertificationPublicApiSurface.length,
  adapterCertificationApiSurface: runtimeStateContextBindingAdapterCertificationPublicApiSurface,
  adapterCertificationApiCount: runtimeStateContextBindingAdapterCertificationPublicApiSurface.length,
  approvedRuntimeApiSurface: runtimeStateContextBindingApprovedRuntimeApiSurface,
  approvedRuntimeApiCount: runtimeStateContextBindingApprovedRuntimeApiSurface.length,
  approvedRuntimeTypeSurface: runtimeStateContextBindingApprovedRuntimeTypeSurface,
  approvedRuntimeTypeCount: runtimeStateContextBindingApprovedRuntimeTypeSurface.length,
});

export const directorRuntimeStateContextBindingAdapterCertification = Object.freeze({
  identity: directorRuntimeStateContextBindingAdapterCertificationIdentity,
  version: directorRuntimeStateContextBindingAdapterCertificationVersion,
  namespace: directorRuntimeStateContextBindingAdapterCertificationNamespace,
  layer: "DRI" as const, capability: "RuntimeStateContextBinding" as const,
  stage: "AdapterCertification" as const,
  immediateDependency: directorRuntimeStateContextBindingAdapterCertificationUpstream,
  adapterKinds: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_KINDS,
  adapterCapabilities: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CAPABILITIES,
  approvedBehaviors: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_APPROVED_BEHAVIORS,
  prohibitedBehaviors: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_PROHIBITED_BEHAVIORS,
  evidenceKinds: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_EVIDENCE_KINDS,
  evidenceResults: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_EVIDENCE_RESULTS,
  compatibilityStates: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_COMPATIBILITY_STATES,
  certificationStatuses: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_STATUSES,
  certificationDecisions: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_DECISIONS,
  requirementCategories: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_REQUIREMENT_CATEGORIES,
  findingSeverities: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_FINDING_SEVERITIES,
  evaluationPhases: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_EVALUATION_PHASES,
  characteristics: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_CHARACTERISTICS,
  requirementRegistry: runtimeStateContextBindingAdapterCertificationRequirements,
  certificationGuarantees: RUNTIME_STATE_CONTEXT_BINDING_ADAPTER_CERTIFICATION_GUARANTEES,
  publicApiSurface: runtimeStateContextBindingAdapterCertificationPublicApiSurface,
  adapterCertificationApiSurface: runtimeStateContextBindingAdapterCertificationPublicApiSurface,
  approvedRuntimeApiSurface: runtimeStateContextBindingApprovedRuntimeApiSurface,
  approvedRuntimeSurface: directorRuntimeStateContextBindingApprovedRuntimeSurface,
  registry: runtimeStateContextBindingAdapterCertificationRegistry,
});
