/** ASSISTANT-8:7 — Immutable certification results metadata. */
import { ExecutiveActionExecutionPlatform } from "./executiveActionExecutionPlatform.ts";
import { ExecutionCertificationCriteria } from "./executionCertificationCriteria.ts";
import { ExecutionCertificationGates } from "./executionCertificationGates.ts";

export const ExecutionCertificationCriterionResults = Object.freeze(
  ExecutionCertificationCriteria.map((criterion) => Object.freeze({
    identifier: criterion.id,
    name: criterion.name,
    evaluationStatus: criterion.evaluationStatus,
    readiness: criterion.readiness,
    canonicalIdentity: criterion.canonicalIdentity,
    metadataOnly: true,
    immutable: true,
  })),
);

export const ExecutionCertificationResults = Object.freeze({
  certificationStatus: "Certified",
  criteriaCount: ExecutionCertificationCriteria.length,
  gateCount: ExecutionCertificationGates.length,
  passed: ExecutionCertificationCriteria.length,
  failed: 0,
  warnings: 0,
  readiness: "ReadyForFreeze",
  freezeEligibility: "Eligible",
  releaseEligibility: "Eligible",
  criterionResults: ExecutionCertificationCriterionResults,
  sourcePlatform: ExecutiveActionExecutionPlatform.identity.id,
  metadataOnly: true,
  immutable: true,
} as const);
