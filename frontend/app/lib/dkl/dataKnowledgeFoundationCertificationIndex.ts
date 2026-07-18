/**
 * DKL-1:7 — Data Knowledge Foundation Certification.
 *
 * Public entry point for the DKL Foundation certification platform.
 * Publishes exactly eight metadata-only public APIs and nothing else.
 */

export { DataKnowledgeFoundationCertificationGates } from "./dataKnowledgeFoundationCertificationGates.ts";
export { DataKnowledgeFoundationCompatibilityCertification } from "./dataKnowledgeFoundationCompatibilityCertification.ts";
export { DataKnowledgeFoundationRegressionCertification } from "./dataKnowledgeFoundationRegressionCertification.ts";
export { DataKnowledgeFoundationCertificationManifest } from "./dataKnowledgeFoundationCertificationManifest.ts";
export {
  DataKnowledgeFoundationCertification,
  getDataKnowledgeFoundationCertification,
  getDataKnowledgeFoundationCertificationSummary,
  getDataKnowledgeFoundationCertificationGateById,
} from "./dataKnowledgeFoundationCertification.ts";
