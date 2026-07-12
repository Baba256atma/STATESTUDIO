import { ExecutiveOperationsPublicIndexId } from "./executiveOperationsPublicIndex.ts";
import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import { ExecutiveWorkflowIntelligencePublicIndexId } from "./executiveWorkflowIntelligencePublicIndex.ts";
import { ExecutiveProjectExecutionPublicIndexId } from "./executiveProjectExecutionPublicIndex.ts";
import { ExecutiveResourceIntelligencePublicIndexId } from "./executiveResourceIntelligencePublicIndex.ts";
import {
  SchedulingIntelligenceContracts,
  SchedulingIntelligencePublicApis,
} from "./schedulingIntelligenceContracts.ts";
import { SchedulingIntelligenceIdentity } from "./schedulingIntelligenceIdentity.ts";
import { SchedulingIntelligenceRegistry } from "./schedulingIntelligenceRegistry.ts";

export const buildSchedulingIntelligenceManifest = () =>
  Object.freeze({
    identity: SchedulingIntelligenceIdentity,
    registry: SchedulingIntelligenceRegistry,
    contracts: SchedulingIntelligenceContracts,
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
      Object.freeze({
        dependencyId: "ops-5-public-index",
        dependencyName: "Executive Resource Intelligence Public Index",
        dependencyPhase: ExecutiveResourceIntelligencePublicIndexId,
        dependencyVersion: "1.0.0",
        metadataOnly: true,
      }),
    ]),
    platformMetadata: Object.freeze({
      platformId: SchedulingIntelligenceIdentity.platformId,
      platformName: SchedulingIntelligenceIdentity.platformName,
      platformNamespace: SchedulingIntelligenceIdentity.platformNamespace,
      platformVersion: SchedulingIntelligenceIdentity.platformVersion,
      platformDescription: SchedulingIntelligenceIdentity.platformDescription,
      platformArchitecturalLevel: SchedulingIntelligenceIdentity.platformArchitecturalLevel,
      platformStatus: SchedulingIntelligenceIdentity.platformStatus,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    publicSurface: SchedulingIntelligencePublicApis,
    compatibilityVersion: "1.0.0",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
