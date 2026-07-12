import { ExecutiveOperationsPublicIndexId } from "./executiveOperationsPublicIndex.ts";
import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import {
  WorkflowIntelligenceContracts,
  WorkflowIntelligencePublicApis,
} from "./workflowIntelligenceContracts.ts";
import { WorkflowIntelligenceIdentity } from "./workflowIntelligenceIdentity.ts";
import { WorkflowIntelligenceRegistry } from "./workflowIntelligenceRegistry.ts";

export const buildWorkflowIntelligenceManifest = () =>
  Object.freeze({
    identity: WorkflowIntelligenceIdentity,
    registry: WorkflowIntelligenceRegistry,
    contracts: WorkflowIntelligenceContracts,
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
    ]),
    publicApis: WorkflowIntelligencePublicApis,
    compatibilityVersion: "1.0.0",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
