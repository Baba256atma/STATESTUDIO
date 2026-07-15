import { ExecutiveReasoningCertificationManifest } from "./executiveReasoningCertificationManifest.ts";
import {
  ExecutiveReasoningCertificationRegistry,
  getExecutiveReasoningCertificationGateById,
} from "./executiveReasoningCertificationRegistry.ts";
import { ExecutiveReasoningCertificationRunner } from "./executiveReasoningCertificationRunner.ts";
import { ExecutiveReasoningCertificationSummary } from "./executiveReasoningCertificationSummary.ts";

const runnerResult = ExecutiveReasoningCertificationRunner.run();

export const ExecutiveReasoningCertificationMetadata = Object.freeze({
  certificationId: ExecutiveReasoningCertificationRegistry.certificationId,
  version: ExecutiveReasoningCertificationRegistry.version,
  namespace: ExecutiveReasoningCertificationRegistry.namespace,
  name: "Executive Reasoning Certification Platform",
  description:
    "Canonical immutable metadata-only certification platform verifying ENG-6:1 through ENG-6:6 architectural compliance for freeze readiness.",
  phase: "ENG-6:7",
  owner: "ENG-6",
  certificationStatus: runnerResult.status,
  certifiedPhases: ExecutiveReasoningCertificationRegistry.certifiedPhases,
  totalGates: runnerResult.totalGateCount,
  certificationDatePlaceholder: ExecutiveReasoningCertificationRegistry.certificationDatePlaceholder,
  releaseTarget: ExecutiveReasoningCertificationRegistry.releaseTarget,
  freezeReadiness: runnerResult.freezeReadiness,
  status: Object.freeze({
    certification: "Certification",
    certified: "CERTIFIED",
    metadataOnly: "MetadataOnly",
    runtimeFree: "RuntimeFree",
    immutable: "Immutable",
    deterministic: "Deterministic",
    readyForFreeze: "ReadyForFreeze",
  } as const),
  nextPhase: "ENG-6:8",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);

export const ExecutiveReasoningCertificationPlatform = Object.freeze({
  metadata: ExecutiveReasoningCertificationMetadata,
  registry: ExecutiveReasoningCertificationRegistry,
  manifest: ExecutiveReasoningCertificationManifest,
  summary: ExecutiveReasoningCertificationSummary,
  runner: ExecutiveReasoningCertificationRunner,
  result: runnerResult,
  ownership: Object.freeze({
    owner: "ENG-6",
    owns: Object.freeze([
      "certification metadata",
      "certification gates",
      "certification manifest",
      "certification summary",
    ] as const),
    neverOwns: Object.freeze([
      "reasoning execution",
      "inference",
      "evidence evaluation",
      "confidence calculation",
      "contradiction resolution",
      "planning",
      "orchestration",
      "decision making",
      "runtime behavior",
      "business logic",
    ] as const),
  } as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);

export const getExecutiveReasoningCertification = () => ExecutiveReasoningCertificationPlatform;
export const getExecutiveReasoningCertificationMetadata = () => ExecutiveReasoningCertificationMetadata;
export const getExecutiveReasoningCertificationSummary = () => ExecutiveReasoningCertificationSummary;

export {
  ExecutiveReasoningCertificationManifest,
  ExecutiveReasoningCertificationRegistry,
  ExecutiveReasoningCertificationSummary,
  getExecutiveReasoningCertificationGateById,
};
