/** DRI-3:6 — deterministic governance certification over authoritative validation. */

import {
  directorRuntimeSceneOrchestrationValidationIdentity,
  type DirectorSceneOrchestrationPlan,
  type DirectorSceneOrchestrationValidationFinding,
  type DirectorSceneOrchestrationValidationReport,
} from "@/app/lib/dri/directorRuntimeSceneOrchestrationValidation";

export type { DirectorSceneOrchestrationPlan };

export const directorRuntimeSceneOrchestrationCertificationIdentity =
  "DRI-3:6/DirectorRuntimeSceneOrchestrationCertification" as const;
export const directorRuntimeSceneOrchestrationCertificationNamespace =
  "nexora.dri.scene.orchestration.certification" as const;
export const directorRuntimeSceneOrchestrationCertificationVersion = "3.6.0" as const;
export const directorRuntimeSceneOrchestrationCertificationUpstream =
  directorRuntimeSceneOrchestrationValidationIdentity;

export const DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_STATUSES = Object.freeze([
  "certified", "conditionally-certified", "rejected",
] as const);
export type DirectorSceneOrchestrationCertificationStatus =
  (typeof DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_STATUSES)[number];

export const DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_DECISIONS = Object.freeze([
  "approve", "approve-with-conditions", "reject",
] as const);
export type DirectorSceneOrchestrationCertificationDecision =
  (typeof DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_DECISIONS)[number];

export const DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_FINDING_DISPOSITIONS = Object.freeze([
  "non-blocking", "condition", "blocking",
] as const);
export type DirectorSceneOrchestrationCertificationFindingDisposition =
  (typeof DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_FINDING_DISPOSITIONS)[number];

export interface DirectorSceneOrchestrationCertificationInput {
  readonly validationReport: DirectorSceneOrchestrationValidationReport;
  readonly plan: DirectorSceneOrchestrationPlan;
}

export interface DirectorSceneOrchestrationCertificationCondition {
  readonly conditionId: string;
  readonly code: string;
  readonly message: string;
  readonly sourceRuleId?: string;
}

export interface DirectorSceneOrchestrationCertificationEvidence {
  readonly validationId: string;
  readonly planId: string;
  readonly validationStatus: DirectorSceneOrchestrationValidationReport["status"];
  readonly checkedRuleIds: readonly string[];
  readonly findingCodes: readonly string[];
}

export interface DirectorSceneOrchestrationCertificationRequirement {
  readonly requirementId: string;
  readonly description: string;
  readonly blocking: boolean;
}

export interface DirectorSceneOrchestrationCertificationRecord {
  readonly certificationId: string;
  readonly planId: string;
  readonly validationId: string;
  readonly status: DirectorSceneOrchestrationCertificationStatus;
  readonly decision: DirectorSceneOrchestrationCertificationDecision;
  readonly conditions: readonly DirectorSceneOrchestrationCertificationCondition[];
  readonly rejectionReasons: readonly string[];
  readonly evidence: DirectorSceneOrchestrationCertificationEvidence;
  readonly guarantees: readonly string[];
}

export function createDirectorSceneOrchestrationCertificationCondition(
  input: DirectorSceneOrchestrationCertificationCondition,
): DirectorSceneOrchestrationCertificationCondition {
  return Object.freeze({ ...input });
}

export function createDirectorSceneOrchestrationCertificationEvidence(
  report: DirectorSceneOrchestrationValidationReport,
): DirectorSceneOrchestrationCertificationEvidence {
  return Object.freeze({ validationId: report.validationId, planId: report.planId,
    validationStatus: report.status, checkedRuleIds: Object.freeze([...report.checkedRuleIds]),
    findingCodes: Object.freeze(report.findings.map(({ code }) => code)) });
}

function disposition(finding: DirectorSceneOrchestrationValidationFinding):
DirectorSceneOrchestrationCertificationFindingDisposition {
  return finding.severity === "error" ? "blocking" :
    finding.severity === "warning" ? "condition" : "non-blocking";
}

export const directorSceneOrchestrationCertificationRequirements = Object.freeze([
  Object.freeze({ requirementId: "validation-passed",
    description: "Authoritative validation status must be valid.", blocking: true }),
  Object.freeze({ requirementId: "plan-identity-present",
    description: "The plan being certified must have an identity.", blocking: true }),
  Object.freeze({ requirementId: "plan-identity-match",
    description: "Validation and certification plan identities must match.", blocking: true }),
  Object.freeze({ requirementId: "validation-identity-present",
    description: "Authoritative validation identity must be present.", blocking: true }),
  Object.freeze({ requirementId: "validation-evidence-present",
    description: "Checked validation rule evidence must be present.", blocking: true }),
  Object.freeze({ requirementId: "no-blocking-findings",
    description: "Validation evidence must contain no blocking findings.", blocking: true }),
  Object.freeze({ requirementId: "condition-visibility-preserved",
    description: "Every permitted warning condition must remain visible.", blocking: false }),
  Object.freeze({ requirementId: "certification-deterministic",
    description: "Certification resolution must be deterministic.", blocking: true }),
  Object.freeze({ requirementId: "certification-lineage-preserved",
    description: "Plan, validation, and certification lineage must remain intact.", blocking: true }),
] as const satisfies readonly DirectorSceneOrchestrationCertificationRequirement[]);

export const DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_GUARANTEES = Object.freeze([
  "validated-input-only", "invalid-never-certified", "plan-validation-identity-match",
  "conditions-preserved", "evidence-preserved", "deterministic-certification",
  "immutable-certification-record", "no-orchestration-mutation", "renderer-independent",
  "business-policy-independent",
] as const);

function conditionsFromFindings(validationId: string,
  findings: readonly DirectorSceneOrchestrationValidationFinding[]) {
  const seen = new Set<string>();
  const conditions: DirectorSceneOrchestrationCertificationCondition[] = [];
  for (const finding of findings) if (disposition(finding) === "condition") {
    const key = `${finding.ruleId}\u0000${finding.code}`;
    if (!seen.has(key)) {
      seen.add(key);
      conditions.push(createDirectorSceneOrchestrationCertificationCondition({
        conditionId: `${validationId}:condition:${finding.ruleId}:${finding.code}`,
        code: finding.code, message: finding.message, sourceRuleId: finding.ruleId,
      }));
    }
  }
  return Object.freeze(conditions);
}

export function certifyDirectorRuntimeSceneOrchestration(
  input: DirectorSceneOrchestrationCertificationInput,
): DirectorSceneOrchestrationCertificationRecord {
  const { validationReport, plan } = input;
  const evidence = createDirectorSceneOrchestrationCertificationEvidence(validationReport);
  const conditions = conditionsFromFindings(validationReport.validationId, validationReport.findings);
  const rejectionReasons: string[] = [];
  if (validationReport.status === "invalid") rejectionReasons.push("validation-invalid");
  if (!plan.planId.trim()) rejectionReasons.push("plan-identity-missing");
  if (validationReport.planId !== plan.planId) rejectionReasons.push("plan-validation-identity-mismatch");
  if (!validationReport.validationId.trim()) rejectionReasons.push("validation-identity-missing");
  else if (validationReport.validationId !== `${validationReport.planId}:DRI-3:5:validation`)
    rejectionReasons.push("validation-identity-invalid");
  if (!validationReport.checkedRuleIds.length) rejectionReasons.push("validation-evidence-missing");
  if (validationReport.findings.some((finding) => disposition(finding) === "blocking"))
    rejectionReasons.push("blocking-validation-finding");
  const rejected = rejectionReasons.length > 0;
  const status: DirectorSceneOrchestrationCertificationStatus = rejected ? "rejected" :
    conditions.length ? "conditionally-certified" : "certified";
  const decision: DirectorSceneOrchestrationCertificationDecision = rejected ? "reject" :
    conditions.length ? "approve-with-conditions" : "approve";
  return Object.freeze({
    certificationId: `${plan.planId}:${validationReport.validationId}:DRI-3:6:certification`,
    planId: plan.planId, validationId: validationReport.validationId, status, decision,
    conditions, rejectionReasons: Object.freeze(rejectionReasons), evidence,
    guarantees: status === "rejected" ? Object.freeze([]) :
      DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_GUARANTEES,
  });
}

export function isDirectorRuntimeSceneOrchestrationCertified(
  record: DirectorSceneOrchestrationCertificationRecord,
) { return record.status === "certified"; }

export function isDirectorRuntimeSceneOrchestrationConditionallyCertified(
  record: DirectorSceneOrchestrationCertificationRecord,
) { return record.status === "conditionally-certified"; }

export function isDirectorRuntimeSceneOrchestrationCertificationRejected(
  record: DirectorSceneOrchestrationCertificationRecord,
) { return record.status === "rejected"; }

export function isDirectorRuntimeSceneOrchestrationPublicationEligible(
  record: DirectorSceneOrchestrationCertificationRecord,
) { return record.status === "certified" || record.status === "conditionally-certified"; }

export const directorRuntimeSceneOrchestrationCertificationConcepts = Object.freeze([
  "Certification Input", "Certification Status", "Certification Decision", "Certification Condition",
  "Certification Evidence", "Certification Requirement", "Finding Disposition",
  "Certification Resolution", "Certification Record",
] as const);
export const directorRuntimeSceneOrchestrationCertificationApiNames = Object.freeze([
  "createDirectorSceneOrchestrationCertificationCondition",
  "createDirectorSceneOrchestrationCertificationEvidence",
  "certifyDirectorRuntimeSceneOrchestration",
] as const);
export const directorRuntimeSceneOrchestrationCertificationPredicateNames = Object.freeze([
  "isDirectorRuntimeSceneOrchestrationCertified",
  "isDirectorRuntimeSceneOrchestrationConditionallyCertified",
  "isDirectorRuntimeSceneOrchestrationCertificationRejected",
  "isDirectorRuntimeSceneOrchestrationPublicationEligible",
] as const);
export const directorRuntimeSceneOrchestrationCertificationRegistry = Object.freeze({
  concepts: directorRuntimeSceneOrchestrationCertificationConcepts,
  conceptCount: directorRuntimeSceneOrchestrationCertificationConcepts.length,
  statuses: DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_STATUSES,
  statusCount: DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_STATUSES.length,
  decisions: DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_DECISIONS,
  decisionCount: DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_DECISIONS.length,
  findingDispositions: DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_FINDING_DISPOSITIONS,
  findingDispositionCount: DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_FINDING_DISPOSITIONS.length,
  requirements: directorSceneOrchestrationCertificationRequirements,
  requirementCount: directorSceneOrchestrationCertificationRequirements.length,
  guarantees: DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_GUARANTEES,
  guaranteeCount: DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_GUARANTEES.length,
  publicApis: directorRuntimeSceneOrchestrationCertificationApiNames,
  publicApiCount: directorRuntimeSceneOrchestrationCertificationApiNames.length,
  predicates: directorRuntimeSceneOrchestrationCertificationPredicateNames,
  predicateCount: directorRuntimeSceneOrchestrationCertificationPredicateNames.length,
});

export const directorRuntimeSceneOrchestrationCertification = Object.freeze({
  phase: "DRI-3:6" as const, name: "DirectorRuntimeSceneOrchestrationCertification" as const,
  identity: directorRuntimeSceneOrchestrationCertificationIdentity,
  namespace: directorRuntimeSceneOrchestrationCertificationNamespace,
  version: directorRuntimeSceneOrchestrationCertificationVersion,
  layer: "DRI" as const, capability: "DirectorRuntimeSceneOrchestration" as const,
  stage: "Certification" as const, immediateDependency: directorRuntimeSceneOrchestrationCertificationUpstream,
  statuses: DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_STATUSES,
  decisions: DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_DECISIONS,
  requirements: directorSceneOrchestrationCertificationRequirements,
  guarantees: DIRECTOR_SCENE_ORCHESTRATION_CERTIFICATION_GUARANTEES,
  publicApiSurface: directorRuntimeSceneOrchestrationCertificationApiNames,
  predicateSurface: directorRuntimeSceneOrchestrationCertificationPredicateNames,
  registry: directorRuntimeSceneOrchestrationCertificationRegistry,
});
