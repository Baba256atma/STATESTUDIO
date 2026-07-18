/**
 * DKL-8:7 — Knowledge Governance Certification Report.
 *
 * Canonical immutable certification report derived from criteria and gates.
 * No timestamps, persistence, or transmission.
 *
 * Ownership: owned exclusively by DKL-8:7.
 */

import { KnowledgeGovernancePlatform } from "./knowledgeGovernancePlatform.ts";
import {
  KnowledgeGovernanceCertificationAllCriteriaPass,
  KnowledgeGovernanceCertificationCriteria,
} from "./knowledgeGovernanceCertificationCriteria.ts";
import { KnowledgeGovernanceCertificationEvidence } from "./knowledgeGovernanceCertificationEvidence.ts";
import {
  KnowledgeGovernanceCertificationAllGatesPass,
  KnowledgeGovernanceCertificationGates,
} from "./knowledgeGovernanceCertificationGates.ts";
import type { KnowledgeGovernanceCertificationReport } from "./knowledgeGovernanceCertificationTypes.ts";

const platform = KnowledgeGovernancePlatform;

const passedCriterionCount = KnowledgeGovernanceCertificationCriteria.filter(
  (item) => item.outcome === "Pass",
).length;
const failedCriterionCount = KnowledgeGovernanceCertificationCriteria.filter(
  (item) => item.outcome === "Fail",
).length;
const passedGateCount = KnowledgeGovernanceCertificationGates.filter(
  (item) => item.outcome === "Pass",
).length;
const failedGateCount = KnowledgeGovernanceCertificationGates.filter(
  (item) => item.outcome === "Fail",
).length;

const outcome =
  KnowledgeGovernanceCertificationAllCriteriaPass &&
  KnowledgeGovernanceCertificationAllGatesPass
    ? ("Pass" as const)
    : ("Fail" as const);

/** Canonical Certification report for KnowledgeGovernancePlatform. */
export const KnowledgeGovernanceCertificationReportRecord: KnowledgeGovernanceCertificationReport =
  Object.freeze({
    reportId: "DKL-8:7/Report/CanonicalPlatformCertification",
    certificationId: "DKL-8:7/KnowledgeGovernanceCertification",
    targetPlatformId: platform.identity.platformId,
    criterionCount: KnowledgeGovernanceCertificationCriteria.length,
    passedCriterionCount,
    failedCriterionCount,
    gateCount: KnowledgeGovernanceCertificationGates.length,
    passedGateCount,
    failedGateCount,
    outcome,
    status: "Certified" as const,
    readiness: "ReadyForFreeze" as const,
    evidenceReferences: Object.freeze(
      KnowledgeGovernanceCertificationEvidence.map((item) => item.evidenceId),
    ),
    generatesTimestamps: false as const,
    persists: false as const,
    transmits: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });
