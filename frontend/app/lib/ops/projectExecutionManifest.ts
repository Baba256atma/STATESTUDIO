import { ExecutiveOperationsPublicIndexId } from "./executiveOperationsPublicIndex.ts";
import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import { ExecutiveWorkflowIntelligencePublicIndexId } from "./executiveWorkflowIntelligencePublicIndex.ts";
import {
  ProjectExecutionContracts,
  ProjectExecutionPublicApis,
} from "./projectExecutionContracts.ts";
import { ProjectExecutionIdentity } from "./projectExecutionIdentity.ts";
import { ProjectExecutionRegistry } from "./projectExecutionRegistry.ts";

export const buildProjectExecutionManifest = () =>
  Object.freeze({
    identity: ProjectExecutionIdentity,
    registry: ProjectExecutionRegistry,
    contracts: ProjectExecutionContracts,
    dependencies: Object.freeze([
      Object.freeze({
        dependencyId: "ops-1-public-index",
        dependencyName: "Executive Operations Public Index",
        dependencyPhase: ExecutiveOperationsPublicIndexId,
        dependencyVersion: "1.0.0",
        metadataOnly: true,
      }),
      Object.freeze({
        dependencyId: "ops-2-public-index",
        dependencyName: "Executive Task Intelligence Public Index",
        dependencyPhase: ExecutiveTaskIntelligencePublicIndexId,
        dependencyVersion: "1.0.0",
        metadataOnly: true,
      }),
      Object.freeze({
        dependencyId: "ops-3-public-index",
        dependencyName: "Executive Workflow Intelligence Public Index",
        dependencyPhase: ExecutiveWorkflowIntelligencePublicIndexId,
        dependencyVersion: "1.0.0",
        metadataOnly: true,
      }),
    ]),
    publicApis: ProjectExecutionPublicApis,
    compatibilityVersion: "1.0.0",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

