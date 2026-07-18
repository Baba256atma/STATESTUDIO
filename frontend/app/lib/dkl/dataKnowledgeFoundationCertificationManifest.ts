/**
 * DKL-1:7 — Certification Manifest.
 *
 * One canonical, immutable, metadata-only certification manifest aggregating the
 * sixteen certification gates, the compatibility certification, and the
 * regression certification into a single deep-frozen release descriptor.
 * Metadata only — no runtime behavior.
 */

import { DataKnowledgeFoundationCertificationGates } from "./dataKnowledgeFoundationCertificationGates.ts";
import { DataKnowledgeFoundationCompatibilityCertification } from "./dataKnowledgeFoundationCompatibilityCertification.ts";
import { DataKnowledgeFoundationRegressionCertification } from "./dataKnowledgeFoundationRegressionCertification.ts";
import type { CertificationManifestDescriptor } from "./dataKnowledgeFoundationCertificationTypes.ts";

const gateCount = DataKnowledgeFoundationCertificationGates.length;
const gateIds = Object.freeze(DataKnowledgeFoundationCertificationGates.map((gate) => gate.id));
const passedGates = DataKnowledgeFoundationCertificationGates.filter(
  (gate) => gate.result === "PASS"
).length;
const failedGates = gateCount - passedGates;
const blockingFailures = DataKnowledgeFoundationCertificationGates.filter(
  (gate) => gate.blocking && gate.result === "FAIL"
).length;

export const DataKnowledgeFoundationCertificationManifest = Object.freeze({
  certificationId: "DKL-1:7",
  name: "Data Knowledge Foundation Certification",
  namespace: "nexora.dkl.foundation.certification",
  version: "1.0.0",
  certifiedPhases: Object.freeze([
    "DKL-1:1",
    "DKL-1:2",
    "DKL-1:3",
    "DKL-1:4",
    "DKL-1:5",
    "DKL-1:6",
  ]),
  gateCount,
  gateIds,
  passedGates,
  failedGates,
  blockingFailures,
  compatibilityCertification: DataKnowledgeFoundationCompatibilityCertification,
  regressionCertification: DataKnowledgeFoundationRegressionCertification,
  certificationStatus: "CERTIFIED",
  stability: "STABLE",
  readiness: "ReadyForFreeze",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies CertificationManifestDescriptor);
