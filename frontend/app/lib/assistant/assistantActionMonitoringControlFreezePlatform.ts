/** ASSISTANT-9:8 — Freeze platform summary derived through Certification. */
import { AssistantActionMonitoringControlCertification } from "./assistantActionMonitoringControlCertification.ts";
import { AssistantActionMonitoringControlFreezeCompatibility } from "./assistantActionMonitoringControlFreezeCompatibility.ts";
import { AssistantActionMonitoringControlFreezeInventory } from "./assistantActionMonitoringControlFreezeInventory.ts";
import {
  AssistantActionMonitoringControlFreezeArchitecturalLocks,
  AssistantActionMonitoringControlFreezeBaselines,
  AssistantActionMonitoringControlFreezeLock,
} from "./assistantActionMonitoringControlFreezeLock.ts";
import {
  AssistantActionMonitoringControlFreezeIdentity,
  AssistantActionMonitoringControlFreezeRelease,
  AssistantActionMonitoringControlFreezeStructuralMetadata,
} from "./assistantActionMonitoringControlFreezeMetadata.ts";
import { AssistantActionMonitoringControlFreezePublicApi } from "./assistantActionMonitoringControlFreezePublicApi.ts";

const platform = AssistantActionMonitoringControlCertification.platform;

export const AssistantActionMonitoringControlFreezePlatform = Object.freeze({
  identity: AssistantActionMonitoringControlFreezeIdentity,
  lock: AssistantActionMonitoringControlFreezeLock,
  metadata: AssistantActionMonitoringControlFreezeStructuralMetadata,
  release: AssistantActionMonitoringControlFreezeRelease,
  inventory: AssistantActionMonitoringControlFreezeInventory,
  compatibility: AssistantActionMonitoringControlFreezeCompatibility,
  publicApi: AssistantActionMonitoringControlFreezePublicApi,
  baselines: AssistantActionMonitoringControlFreezeBaselines,
  architecturalLocks:
    AssistantActionMonitoringControlFreezeArchitecturalLocks,
  sourcePlatform: platform.identity,
  sourcePlatformInventory: platform.inventory,
  sourcePlatformGuarantees: platform.guarantees,
  statistics: Object.freeze({
    baselineCount: AssistantActionMonitoringControlFreezeBaselines.length,
    architecturalLockCount:
      AssistantActionMonitoringControlFreezeArchitecturalLocks.length,
    compatibilityCount:
      AssistantActionMonitoringControlFreezeCompatibility.length,
    publicApiCount:
      AssistantActionMonitoringControlFreezePublicApi.publicApiInventory
        .length,
    platformGuaranteeCount: platform.statistics.platformGuaranteeCount,
  }),
  metadataOnly: true,
  immutable: true,
} as const);
