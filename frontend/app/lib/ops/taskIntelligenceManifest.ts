import { ExecutiveOperationsPublicIndexId } from "./executiveOperationsPublicIndex.ts";
import { TaskIntelligenceContracts, TaskIntelligencePublicApis } from "./taskIntelligenceContracts.ts";
import { TaskIntelligenceIdentity } from "./taskIntelligenceIdentity.ts";
import { TaskIntelligenceRegistry } from "./taskIntelligenceRegistry.ts";

export const buildTaskIntelligenceManifest = () =>
  Object.freeze({
    identity: TaskIntelligenceIdentity,
    registry: TaskIntelligenceRegistry,
    contracts: TaskIntelligenceContracts,
    dependencies: Object.freeze([
      Object.freeze({
        dependencyId: "ops-1-public-index",
        dependencyName: "Executive Operations Public Index",
        dependencyPhase: ExecutiveOperationsPublicIndexId,
        dependencyVersion: "1.0.0",
        metadataOnly: true,
      }),
    ]),
    publicApis: TaskIntelligencePublicApis,
    compatibilityVersion: "1.0.0",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
