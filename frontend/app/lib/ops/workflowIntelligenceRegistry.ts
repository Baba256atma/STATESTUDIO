import { WorkflowIntelligenceIdentity } from "./workflowIntelligenceIdentity.ts";

export const WorkflowIntelligenceRegistry = Object.freeze({
  platformId: WorkflowIntelligenceIdentity.platformId,
  namespace: WorkflowIntelligenceIdentity.platformNamespace,
  version: WorkflowIntelligenceIdentity.platformVersion,
  releaseStage: "Draft",
  supportedWorkflowCapabilities: Object.freeze([
    "Executive Workflow",
    "Operational Workflow",
    "Approval Workflow",
    "Review Workflow",
    "Escalation Workflow",
    "Automated Workflow",
    "Manual Workflow",
  ]),
  architecturalScope:
    "Defines canonical metadata contracts for workflow intelligence and structured task-flow architecture.",
  taskIntelligenceDependency: Object.freeze({
    dependencyId: "ops-2-public-index",
    dependencyName: "Executive Task Intelligence Public Index",
    dependencyPhase: "OPS-2:9",
    dependencyVersion: "1.0.0",
    metadataOnly: true,
  }),
  registeredPhases: Object.freeze([
    Object.freeze({
      phaseId: "OPS-3:1",
      phaseName: "Workflow Intelligence Foundation",
      phaseVersion: "1.0.0",
      phaseStatus: "Foundation",
      metadataOnly: true,
      deterministic: true,
    }),
  ]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
