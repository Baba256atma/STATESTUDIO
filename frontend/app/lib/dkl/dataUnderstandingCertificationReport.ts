/**
 * DKL-3:7 — Data Understanding Certification Report.
 *
 * Immutable certification report metadata summarizing gates, evidence, and
 * readiness. No runtime logic.
 *
 * Ownership: owned exclusively by DKL-3:7.
 */

import { DataUnderstandingCertificationRegistry } from "./dataUnderstandingCertificationRegistry.ts";
import { DataUnderstandingCertificationEvidence } from "./dataUnderstandingCertificationEvidence.ts";
import { DataUnderstandingCertificationCompatibility } from "./dataUnderstandingCertificationCompatibility.ts";
import { DataUnderstandingCertificationManifest } from "./dataUnderstandingCertificationManifest.ts";
import {
  DATA_UNDERSTANDING_CERTIFICATION_IDENTITY,
  DATA_UNDERSTANDING_CERTIFICATION_VERSION,
} from "./dataUnderstandingCertificationRegistry.ts";

/** Canonical immutable certification report. */
export const DataUnderstandingCertificationReport = Object.freeze({
  reportId: "DKL-3:7/CertificationReport",
  reportName: "Data Understanding Certification Report",
  sourcePhase: "DKL-3:7",
  identity: DATA_UNDERSTANDING_CERTIFICATION_IDENTITY,
  version: DATA_UNDERSTANDING_CERTIFICATION_VERSION,
  status: "Certified" as const,
  summary: Object.freeze({
    message:
      "DKL-3 Data Understanding Platform is Certified and ReadyForFreeze.",
    allGatesPass: true,
    allGatesCertified: true,
    gateCount: DataUnderstandingCertificationRegistry.gateCount,
    certifiedGateCount: DataUnderstandingCertificationRegistry.certifiedGateCount,
    evidenceCount: DataUnderstandingCertificationEvidence.entryCount,
    compatibilityCount: DataUnderstandingCertificationCompatibility.entryCount,
    componentCount: DataUnderstandingCertificationRegistry.componentCount,
    phasesCertified: 6,
    readiness: "ReadyForFreeze" as const,
    nextPhase: "DKL-3:8 — Data Understanding Freeze",
  }),
  gates: DataUnderstandingCertificationRegistry.gates,
  evidence: DataUnderstandingCertificationEvidence.entries,
  compatibility: DataUnderstandingCertificationCompatibility.entries,
  counts: DataUnderstandingCertificationManifest.counts,
  readiness: DataUnderstandingCertificationManifest.readiness,
  metadata: DataUnderstandingCertificationManifest.metadata,
  sections: Object.freeze([
    "identity",
    "status",
    "summary",
    "gates",
    "evidence",
    "compatibility",
    "counts",
    "readiness",
    "metadata",
  ]),
  sectionCount: 9,
  metadataOnly: true,
  certificationOnly: true,
  immutable: true,
  deterministic: true,
});
