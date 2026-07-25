/** ASSISTANT-9:8 — Platform-derived frozen inventories via Certification. */
import { AssistantActionMonitoringControlCertification } from "./assistantActionMonitoringControlCertification.ts";
import { AssistantActionMonitoringControlFreezeCompatibility } from "./assistantActionMonitoringControlFreezeCompatibility.ts";
import {
  AssistantActionMonitoringControlFreezeArchitecturalLocks,
  AssistantActionMonitoringControlFreezeBaselines,
} from "./assistantActionMonitoringControlFreezeLock.ts";

const certification = AssistantActionMonitoringControlCertification;
const platform = certification.platform;
const platformInventory = platform.inventory;
const totals = platformInventory.totals;

export const AssistantActionMonitoringControlFreezeInventory = Object.freeze({
  foundationInventory: platformInventory.foundationInventory,
  registryInventory: platformInventory.registryInventory,
  modelInventory: platformInventory.modelInventory,
  relationshipInventory: platformInventory.relationshipInventory,
  capabilityInventory: platformInventory.capabilityInventory,
  contractInventory: platformInventory.contractInventory,
  lifecycleInventory: platformInventory.lifecycleInventory,
  policyInventory: platformInventory.policyInventory,
  validationInventory: platformInventory.validationInventory,
  manifestInventory: platformInventory.manifestInventory,
  platformInventory,
  certificationInventory: Object.freeze({
    criteria: certification.criteria,
    gates: certification.gates,
    report: certification.report,
    identity: certification.identity,
  }),
  totals,
  baselines: AssistantActionMonitoringControlFreezeBaselines,
  architecturalLocks:
    AssistantActionMonitoringControlFreezeArchitecturalLocks,
  compatibility: AssistantActionMonitoringControlFreezeCompatibility,
  sourcePlatform: platform.identity,
  sourceCertification: certification.identity,
  canonicalFreezeRule: "Platform Inventory References Only",
  duplicatedDefinitions: false,
  independentlyMaintainedCounts: false,
  recalculatedMetadata: false,
  reconstructedInventories: false,
  metadataOnly: true,
  immutable: true,
} as const);
