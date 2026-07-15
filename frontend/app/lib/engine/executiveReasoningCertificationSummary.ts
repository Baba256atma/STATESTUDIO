import { ExecutiveReasoningCertificationRegistry } from "./executiveReasoningCertificationRegistry.ts";
import { ExecutiveReasoningCertificationRunner } from "./executiveReasoningCertificationRunner.ts";

const runnerResult = ExecutiveReasoningCertificationRunner.run();

/**
 * Deterministic certification summary derived only from declared metadata.
 */
export const ExecutiveReasoningCertificationSummary = Object.freeze({
  certificationId: ExecutiveReasoningCertificationRegistry.certificationId,
  phase: "ENG-6:7",
  namespace: ExecutiveReasoningCertificationRegistry.namespace,
  owner: "ENG-6",
  version: ExecutiveReasoningCertificationRegistry.version,
  certifiedPhases: ExecutiveReasoningCertificationRegistry.certifiedPhases,
  totalGates: runnerResult.totalGateCount,
  passedGates: runnerResult.passCount,
  warningCount: runnerResult.warningCount,
  failureCount: runnerResult.failCount,
  certificationStatus: runnerResult.status,
  freezeReadiness: runnerResult.freezeReadiness,
  releaseTarget: ExecutiveReasoningCertificationRegistry.releaseTarget,
  certificationDatePlaceholder: ExecutiveReasoningCertificationRegistry.certificationDatePlaceholder,
  nextPhase: "ENG-6:8",
  nextPhaseName: "Executive Reasoning Freeze Platform",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);
