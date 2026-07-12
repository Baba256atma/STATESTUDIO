import { ProjectExecutionIdentity } from "./projectExecutionIdentity.ts";

export const ProjectExecutionRegistry = Object.freeze({
  platformId: ProjectExecutionIdentity.platformId,
  namespace: ProjectExecutionIdentity.platformNamespace,
  version: ProjectExecutionIdentity.platformVersion,
  releaseStage: "Draft",
  supportedProjectCapabilities: Object.freeze([
    "Executive Project",
    "Operational Project",
    "Strategic Project",
    "Transformation Project",
    "Program Project",
    "Portfolio Project",
    "Continuous Improvement Project",
  ]),
  architecturalScope:
    "Defines canonical metadata contracts for project execution intelligence and workflow-to-project architectural organization.",
  taskIntelligenceDependency: Object.freeze({
    dependencyId: "ops-2-public-index",
    dependencyName: "Executive Task Intelligence Public Index",
    dependencyPhase: "OPS-2:9",
    dependencyVersion: "1.0.0",
    metadataOnly: true,
  }),
  workflowIntelligenceDependency: Object.freeze({
    dependencyId: "ops-3-public-index",
    dependencyName: "Executive Workflow Intelligence Public Index",
    dependencyPhase: "OPS-3:9",
    dependencyVersion: "1.0.0",
    metadataOnly: true,
  }),
  registeredPhases: Object.freeze([
    Object.freeze({
      phaseId: "OPS-4:1",
      phaseName: "Project Execution Foundation",
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

