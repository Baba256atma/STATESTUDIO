import { ExecutionPlatformMetadata } from "./executionMetadataIndex.ts";
import type { ExecutionProject } from "./executionModelTypes.ts";

export const ExecutionProjectModel = Object.freeze({
  identifier: "execution-project-model",
  displayName: "Execution Project Model",
  description: "Canonical metadata model for executive project execution.",
  category: "Project",
  status: "Modeled",
  projectIdentity: "ExecutiveOperationsProject",
  milestones: Object.freeze([
    "Definition",
    "Mobilization",
    "Delivery",
  ]),
  deliverables: Object.freeze([
    "OperationalOutcome",
    "ExecutionSummary",
  ]),
  executionScope: Object.freeze([
    "CrossFunctional",
    "ExecutiveVisible",
  ]),
  objectives: Object.freeze([
    "OperationalAlignment",
    "ExecutionTraceability",
  ]),
  metadata: Object.freeze({
    phaseId: "OPS-1:3",
    platformId: ExecutionPlatformMetadata.platformId,
    compatibilityVersion: ExecutionPlatformMetadata.compatibilityVersion,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
    registryCapabilityId: "cap-project-execution",
    domainId: "project-execution",
  }),
} as const satisfies ExecutionProject);
