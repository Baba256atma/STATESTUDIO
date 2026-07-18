/**
 * DKL-9:7 — Data Knowledge Suite Certification Report.
 *
 * Canonical immutable certification report derived from criteria and gates.
 * No timestamps, persistence, or transmission.
 *
 * Ownership: owned exclusively by DKL-9:7.
 */

import { DataKnowledgeSuitePlatform } from "./dataKnowledgeSuitePlatform.ts";
import {
  DataKnowledgeSuiteCertificationAllCriteriaPass,
  DataKnowledgeSuiteCertificationCriteria,
} from "./dataKnowledgeSuiteCertificationCriteria.ts";
import { DataKnowledgeSuiteCertificationEvidence } from "./dataKnowledgeSuiteCertificationEvidence.ts";
import {
  DataKnowledgeSuiteCertificationAllGatesPass,
  DataKnowledgeSuiteCertificationGates,
} from "./dataKnowledgeSuiteCertificationGates.ts";
import type { DataKnowledgeSuiteCertificationReport } from "./dataKnowledgeSuiteCertificationTypes.ts";

const platform = DataKnowledgeSuitePlatform;

const passedCriteria = DataKnowledgeSuiteCertificationCriteria.filter(
  (item) => item.outcome === "Pass",
).length;
const failedCriteria = DataKnowledgeSuiteCertificationCriteria.filter(
  (item) => item.outcome === "Fail",
).length;
const passedGates = DataKnowledgeSuiteCertificationGates.filter(
  (item) => item.outcome === "Pass",
).length;
const failedGates = DataKnowledgeSuiteCertificationGates.filter(
  (item) => item.outcome === "Fail",
).length;

const result =
  DataKnowledgeSuiteCertificationAllCriteriaPass &&
  DataKnowledgeSuiteCertificationAllGatesPass
    ? ("Pass" as const)
    : ("Fail" as const);

/** Canonical Certification report for DataKnowledgeSuitePlatform. */
export const DataKnowledgeSuiteCertificationReportRecord: DataKnowledgeSuiteCertificationReport =
  Object.freeze({
    reportId: "DKL-9:7/Report/CanonicalPlatformCertification",
    certificationId: "DKL-9:7/DataKnowledgeSuiteCertification",
    targetPlatformId: platform.identity.platformId,
    criterionCount: DataKnowledgeSuiteCertificationCriteria.length,
    passedCriteria,
    failedCriteria,
    gateCount: DataKnowledgeSuiteCertificationGates.length,
    passedGates,
    failedGates,
    result,
    status: "Certified" as const,
    readiness: "ReadyForFreeze" as const,
    evidenceReferences: Object.freeze(
      DataKnowledgeSuiteCertificationEvidence.map((item) => item.evidenceId),
    ),
    generatesTimestamps: false as const,
    persists: false as const,
    transmits: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });
