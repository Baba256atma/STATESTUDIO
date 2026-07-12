import { ExecutiveOperationsPublicIndexId } from "./executiveOperationsPublicIndex.ts";
import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import { ExecutiveWorkflowIntelligencePublicIndexId } from "./executiveWorkflowIntelligencePublicIndex.ts";
import { ExecutiveProjectExecutionPublicIndexId } from "./executiveProjectExecutionPublicIndex.ts";
import {
  ResourceIntelligenceContracts,
  ResourceIntelligencePublicApis,
} from "./resourceIntelligenceContracts.ts";
import { ResourceIntelligenceIdentity } from "./resourceIntelligenceIdentity.ts";
import { ResourceIntelligenceRegistry } from "./resourceIntelligenceRegistry.ts";

export const buildResourceIntelligenceManifest = () =>
  Object.freeze({
    identity: ResourceIntelligenceIdentity,
    registry: ResourceIntelligenceRegistry,
    contracts: ResourceIntelligenceContracts,
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
      Object.freeze({
        dependencyId: "ops-4-public-index",
        dependencyName: "Executive Project Execution Public Index",
        dependencyPhase: ExecutiveProjectExecutionPublicIndexId,
        dependencyVersion: "1.0.0",
        metadataOnly: true,
      }),
    ]),
    platformMetadata: Object.freeze({
      platformId: ResourceIntelligenceIdentity.platformId,
      platformName: ResourceIntelligenceIdentity.platformName,
      platformNamespace: ResourceIntelligenceIdentity.platformNamespace,
      platformVersion: ResourceIntelligenceIdentity.platformVersion,
      platformDescription: ResourceIntelligenceIdentity.platformDescription,
      platformArchitecturalLevel: ResourceIntelligenceIdentity.platformArchitecturalLevel,
      platformStatus: ResourceIntelligenceIdentity.platformStatus,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    publicSurface: ResourceIntelligencePublicApis,
    compatibilityVersion: "1.0.0",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

