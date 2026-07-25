/** ASSISTANT-9:6 — Public Platform surface for Certification consumers. */
import { AssistantActionMonitoringControlPlatformComposition } from "./assistantActionMonitoringControlPlatformComposition.ts";
import {
  AssistantActionMonitoringControlPlatformCompatibility,
  AssistantActionMonitoringControlPlatformCompatibilitySummary,
} from "./assistantActionMonitoringControlPlatformCompatibility.ts";
import { AssistantActionMonitoringControlPlatformGuarantees } from "./assistantActionMonitoringControlPlatformGuarantees.ts";
import { AssistantActionMonitoringControlPlatformInventory } from "./assistantActionMonitoringControlPlatformInventory.ts";
import {
  AssistantActionMonitoringControlPlatformIdentity,
  AssistantActionMonitoringControlPlatformStructuralMetadata,
} from "./assistantActionMonitoringControlPlatformMetadata.ts";

export const AssistantActionMonitoringControlPlatformPublic = Object.freeze({
  identity: AssistantActionMonitoringControlPlatformIdentity,
  metadata: AssistantActionMonitoringControlPlatformStructuralMetadata,
  composition: AssistantActionMonitoringControlPlatformComposition,
  guarantees: AssistantActionMonitoringControlPlatformGuarantees,
  compatibility: AssistantActionMonitoringControlPlatformCompatibility,
  compatibilitySummary:
    AssistantActionMonitoringControlPlatformCompatibilitySummary,
  inventory: AssistantActionMonitoringControlPlatformInventory,
  publicApiSurface: Object.freeze([
    "AssistantActionMonitoringControlPlatform",
  ]),
  consumer:
    "ASSISTANT-9:7 Executive Action Monitoring & Control Certification",
  runtimeExports: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
} as const);
