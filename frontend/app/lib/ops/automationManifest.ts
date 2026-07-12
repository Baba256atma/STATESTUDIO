import {
  AutomationCompatibilityVersion,
  ExecutiveAutomationFoundation,
} from "./automationIndex.ts";
import {
  ExecutiveAutomationRegistry,
} from "./automationRegistryIndex.ts";
import {
  ExecutiveAutomationModel,
} from "./automationModelIndex.ts";
import {
  AutomationValidationRegistry,
  getAutomationValidationSummary,
} from "./automationValidationIndex.ts";
import {
  AutomationPlatformDependencyMap,
  AutomationPlatformDependencyMapMetadata,
} from "./automationPlatformDependencyMap.ts";
import type {
  AutomationManifestDescriptor,
  AutomationManifestSummary,
} from "./automationManifestTypes.ts";
import {
  AutomationPlatformPhaseRegistry,
  AutomationPlatformPhaseRegistryMetadata,
} from "./automationPhaseRegistry.ts";
import {
  AutomationPlatformPublicSurface,
  AutomationPlatformPublicSurfaceMetadata,
} from "./automationPublicSurface.ts";

export const buildAutomationManifest = () =>
  Object.freeze({
    platformIdentity: ExecutiveAutomationFoundation.registry,
    foundation: ExecutiveAutomationFoundation,
    consumedPhases: Object.freeze(
      AutomationPlatformPhaseRegistry.map((phase) => phase.phaseId),
    ),
    phaseRegistry: AutomationPlatformPhaseRegistry,
    phaseRegistryMetadata: AutomationPlatformPhaseRegistryMetadata,
    dependencyMap: AutomationPlatformDependencyMap,
    dependencyMapMetadata: AutomationPlatformDependencyMapMetadata,
    publicApiSurface: AutomationPlatformPublicSurface,
    publicApiSurfaceMetadata: AutomationPlatformPublicSurfaceMetadata,
    capabilitySummary: Object.freeze({
      eventCount: ExecutiveAutomationRegistry.events.length,
      triggerCount: ExecutiveAutomationRegistry.triggers.length,
      conditionCount: ExecutiveAutomationRegistry.conditions.length,
      actionCount: ExecutiveAutomationRegistry.actions.length,
      ruleCount: ExecutiveAutomationRegistry.rules.length,
      policyCount: ExecutiveAutomationRegistry.policies.length,
      lifecycleCount: ExecutiveAutomationRegistry.lifecycle.length,
      metadataOnly: true,
      immutable: true,
    }),
    modelSummary: ExecutiveAutomationModel.summary,
    validationSummary: getAutomationValidationSummary(),
    compatibilitySummary: Object.freeze({
      internalDependencyCount: AutomationPlatformDependencyMap.filter((entry) =>
        entry.sourcePhaseId.startsWith("OPS-8:"),
      ).length,
      crossPlatformCompatibilityCount: AutomationPlatformDependencyMap.filter(
        (entry) => entry.sourcePhaseId === "OPS-8",
      ).length,
      validationRegistryGroupCount:
        AutomationValidationRegistry.validationGroups.length,
      compatibilityStatus:
        getAutomationValidationSummary().status === "PASS" ? "PASS" : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    automationPlatformVersion: ExecutiveAutomationFoundation.registry.version,
    releaseReadinessMetadata: Object.freeze({
      readinessState:
        getAutomationValidationSummary().status === "PASS" ? "Ready" : "Blocked",
      publicApiStable: true,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    deterministicSummary: Object.freeze({
      deterministic: true,
      metadataOnly: true,
      immutable: true,
    }),
    metadataOnlySummary: Object.freeze({
      metadataOnly: true,
      immutable: true,
      publicApiStable: true,
    }),
    summary: Object.freeze({
      phaseCount: AutomationPlatformPhaseRegistry.length,
      dependencyCount: AutomationPlatformDependencyMap.length,
      publicApiCount: AutomationPlatformPublicSurface.length,
      compatibilityStatus:
        getAutomationValidationSummary().status === "PASS" ? "PASS" : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies AutomationManifestSummary),
    descriptor: Object.freeze({
      platformId: ExecutiveAutomationFoundation.registry.platformId,
      platformName: ExecutiveAutomationFoundation.registry.platformName,
      platformVersion: ExecutiveAutomationFoundation.registry.version,
      compatibilityVersion: AutomationCompatibilityVersion,
      releaseReadiness:
        getAutomationValidationSummary().status === "PASS" ? "Ready" : "Blocked",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies AutomationManifestDescriptor),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
