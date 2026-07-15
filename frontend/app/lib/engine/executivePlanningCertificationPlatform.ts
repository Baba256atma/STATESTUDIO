import { ExecutivePlanningCertificationGates } from "./executivePlanningCertificationGates.ts";
import { ExecutivePlanningCertificationManifest } from "./executivePlanningCertificationManifest.ts";
import { ExecutivePlanningCertificationRegistry } from "./executivePlanningCertificationRegistry.ts";
import { ExecutivePlanningCertificationSummary } from "./executivePlanningCertificationSummary.ts";
import type { ExecutivePlanningCertificationMetadata } from "./executivePlanningCertificationTypes.ts";

const metadata = Object.freeze({
  platformId: "ENG-5:7",
  name: "Executive Planning Certification Platform",
  version: "1.0.0",
  namespace: "nexora.engine.executive.planning.certification",
  description:
    "Canonical immutable metadata-only certification platform verifying ENG-5:1 through ENG-5:6 architectural compliance for freeze readiness.",
  phase: "ENG-5:7",
  owner: "ENG-5",
  certifiedPlatformId: "ENG-5:6",
  status: "Certified",
  readiness: "ReadyForFreeze",
  gateCount: 15,
  passedGateCount: 15,
  metadataOnly: true,
  runtimeFree: true,
  immutable: true,
  deterministic: true,
  nextPhase: "ENG-5:8",
} as const satisfies ExecutivePlanningCertificationMetadata);

const inventory = Object.freeze({
  gateCount: 15,
  passedGateCount: 15,
  registryCount: 1,
  manifestCount: 1,
  summaryCount: 1,
  platformCount: 1,
  certificationStatus: "Certified",
  readiness: "ReadyForFreeze",
  certifiedPlatformId: "ENG-5:6",
  nextPhase: "ENG-5:8",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const);

export const ExecutivePlanningCertificationPlatform = Object.freeze({
  metadata,
  gates: ExecutivePlanningCertificationGates,
  registry: ExecutivePlanningCertificationRegistry,
  manifest: ExecutivePlanningCertificationManifest,
  summary: ExecutivePlanningCertificationSummary,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const);

export const getExecutivePlanningCertificationPlatform = () => ExecutivePlanningCertificationPlatform;
export const getExecutivePlanningCertificationMetadata = () => metadata;
export const getExecutivePlanningCertificationSummary = () => ExecutivePlanningCertificationSummary;
export const getExecutivePlanningCertificationInventory = () => inventory;
