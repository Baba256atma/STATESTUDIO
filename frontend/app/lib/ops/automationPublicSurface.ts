import type { AutomationPublicSurfaceEntry } from "./automationManifestTypes.ts";

const createEntry = (
  exportName: string,
  phaseId: string,
  exportKind: AutomationPublicSurfaceEntry["exportKind"],
) =>
  Object.freeze({
    exportName,
    phaseId,
    exportKind,
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies AutomationPublicSurfaceEntry);

export const AutomationPlatformPublicSurface = Object.freeze([
  createEntry("ExecutiveAutomationFoundation", "OPS-8:1", "Object"),
  createEntry("getExecutiveAutomationFoundation", "OPS-8:1", "Function"),
  createEntry("getExecutiveAutomationMetadata", "OPS-8:1", "Function"),
  createEntry("AutomationContracts", "OPS-8:1", "Object"),
  createEntry("AutomationRegistry", "OPS-8:1", "Object"),
  createEntry("ExecutiveAutomationRegistry", "OPS-8:2", "Object"),
  createEntry("getExecutiveAutomationRegistry", "OPS-8:2", "Function"),
  createEntry("getAutomationEventRegistry", "OPS-8:2", "Function"),
  createEntry("getAutomationTriggerRegistry", "OPS-8:2", "Function"),
  createEntry("getAutomationConditionRegistry", "OPS-8:2", "Function"),
  createEntry("getAutomationActionRegistry", "OPS-8:2", "Function"),
  createEntry("getAutomationRuleRegistry", "OPS-8:2", "Function"),
  createEntry("getAutomationPolicyRegistry", "OPS-8:2", "Function"),
  createEntry("getAutomationLifecycleRegistry", "OPS-8:2", "Function"),
  createEntry("ExecutiveAutomationModel", "OPS-8:3", "Object"),
  createEntry("getExecutiveAutomationModel", "OPS-8:3", "Function"),
  createEntry("getAutomationRuleModel", "OPS-8:3", "Function"),
  createEntry("getAutomationExecutionModel", "OPS-8:3", "Function"),
  createEntry("AutomationModelMetadata", "OPS-8:3", "Object"),
  createEntry("buildAutomationValidationManifest", "OPS-8:4", "Function"),
  createEntry("AutomationValidationRegistry", "OPS-8:4", "Object"),
  createEntry("validateAutomationFoundation", "OPS-8:4", "Function"),
  createEntry("validateAutomationRegistry", "OPS-8:4", "Function"),
  createEntry("validateAutomationModel", "OPS-8:4", "Function"),
  createEntry("validateAutomationPlatform", "OPS-8:4", "Function"),
  createEntry("validateExecutiveAutomationPlatform", "OPS-8:4", "Function"),
  createEntry("getAutomationValidationSummary", "OPS-8:4", "Function"),
] as const);

export const AutomationPlatformPublicSurfaceMetadata = Object.freeze({
  surfaceId: "ops-8-5-automation-public-surface",
  exportCount: AutomationPlatformPublicSurface.length,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
