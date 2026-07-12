import type {
  ProjectModelMetadata,
  ProjectReadinessDescriptor,
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

export const ProjectReadinessModel = Object.freeze([
  Object.freeze({
    readinessCategory: "ExecutionFoundationReady",
    workflowCompatibility: Object.freeze([
      "Executive workflow compatibility",
      "Operational workflow compatibility",
    ]),
    taskCompatibility: Object.freeze([
      "Executive task compatibility",
      "Strategic task compatibility",
    ]),
    governanceReadiness: Object.freeze([
      "Approval pathway defined",
      "Ownership metadata defined",
    ]),
    readinessConfidence: Object.freeze([
      "High confidence metadata",
      "Cross-platform compatibility metadata",
    ]),
    metadata,
  }),
  Object.freeze({
    readinessCategory: "PortfolioAlignedReady",
    workflowCompatibility: Object.freeze([
      "Approval workflow compatibility",
      "Review workflow compatibility",
    ]),
    taskCompatibility: Object.freeze([
      "Approval task compatibility",
      "Review task compatibility",
    ]),
    governanceReadiness: Object.freeze([
      "Portfolio reporting metadata ready",
      "Audit traceability metadata ready",
    ]),
    readinessConfidence: Object.freeze([
      "Governance confidence metadata",
      "Portfolio linkage confidence metadata",
    ]),
    metadata,
  }),
] as const satisfies readonly ProjectReadinessDescriptor[]);

