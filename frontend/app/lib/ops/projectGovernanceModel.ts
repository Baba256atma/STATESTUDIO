import type {
  ProjectGovernanceDescriptor,
  ProjectModelMetadata,
} from "./projectModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-4:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze([
    "OPS-1:9",
    "OPS-2:9",
    "OPS-3:9",
    "OPS-4:1",
    "OPS-4:2",
  ]),
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ProjectModelMetadata);

export const ProjectGovernanceModel = Object.freeze({
  governanceLevel: "ExecutiveOversight",
  approvalMetadata: Object.freeze([
    "Steering committee approval metadata",
    "Executive checkpoint approval metadata",
  ]),
  reportingMetadata: Object.freeze([
    "Portfolio reporting metadata",
    "Milestone status reporting metadata",
  ]),
  auditMetadata: Object.freeze([
    "Change traceability metadata",
    "Decision audit metadata",
  ]),
  ownershipMetadata: Object.freeze([
    "Executive sponsor ownership metadata",
    "Program manager ownership metadata",
  ]),
  metadata,
} as const satisfies ProjectGovernanceDescriptor);

