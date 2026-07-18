/**
 * DKL-1:7 — Data Knowledge Foundation Certification.
 *
 * The single canonical, immutable, metadata-only certification platform for the
 * complete Nexora Data Knowledge Foundation architecture (DKL-1:1 → DKL-1:6).
 * It aggregates — by reference — certification metadata, the sixteen
 * certification gates, the compatibility certification, the regression
 * certification, the certification manifest, and a deterministic summary.
 *
 * Zero runtime behavior: no I/O, no network, no filesystem, no database,
 * no parsing, no reflection, no dynamic import, no async, no side effects.
 * It introduces no new architecture and modifies no earlier phase.
 */

import { DataKnowledgeFoundationCertificationGates } from "./dataKnowledgeFoundationCertificationGates.ts";
import { DataKnowledgeFoundationCertificationManifest } from "./dataKnowledgeFoundationCertificationManifest.ts";
import { DataKnowledgeFoundationCompatibilityCertification } from "./dataKnowledgeFoundationCompatibilityCertification.ts";
import { DataKnowledgeFoundationRegressionCertification } from "./dataKnowledgeFoundationRegressionCertification.ts";
import type {
  CertificationGateDescriptor,
  CertificationMetadataDescriptor,
  CertificationSummaryDescriptor,
  DataKnowledgeFoundationCertificationDescriptor,
} from "./dataKnowledgeFoundationCertificationTypes.ts";

const gates = DataKnowledgeFoundationCertificationGates;
const totalGates = gates.length;
const passedGates = gates.filter((gate) => gate.result === "PASS").length;
const failedGates = totalGates - passedGates;
const blockingFailures = gates.filter((gate) => gate.blocking && gate.result === "FAIL").length;
const certified = failedGates === 0 && blockingFailures === 0;

const METADATA: CertificationMetadataDescriptor = Object.freeze({
  certificationId: "DKL-1:7",
  name: "Data Knowledge Foundation Certification",
  namespace: "nexora.dkl.foundation.certification",
  version: "1.0.0",
  certificationStatus: "CERTIFIED",
  stability: "STABLE",
  readiness: "ReadyForFreeze",
  metadataOnly: true,
  immutable: true,
});

const SUMMARY: CertificationSummaryDescriptor = Object.freeze({
  certificationId: "DKL-1:7",
  totalGates,
  passedGates,
  failedGates,
  blockingFailures,
  certificationStatus: certified ? "CERTIFIED" : "FAILED",
  stability: "STABLE",
  readiness: certified ? "ReadyForFreeze" : "NotReady",
  metadataOnly: true,
  immutable: true,
});

export const DataKnowledgeFoundationCertification = Object.freeze({
  metadata: METADATA,
  gates: DataKnowledgeFoundationCertificationGates,
  compatibility: DataKnowledgeFoundationCompatibilityCertification,
  regression: DataKnowledgeFoundationRegressionCertification,
  manifest: DataKnowledgeFoundationCertificationManifest,
  summary: SUMMARY,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies DataKnowledgeFoundationCertificationDescriptor);

export const getDataKnowledgeFoundationCertification =
  (): DataKnowledgeFoundationCertificationDescriptor => DataKnowledgeFoundationCertification;

export const getDataKnowledgeFoundationCertificationSummary = (): CertificationSummaryDescriptor =>
  SUMMARY;

export const getDataKnowledgeFoundationCertificationGateById = (
  id: string
): CertificationGateDescriptor | undefined =>
  DataKnowledgeFoundationCertificationGates.find((gate) => gate.id === id);
