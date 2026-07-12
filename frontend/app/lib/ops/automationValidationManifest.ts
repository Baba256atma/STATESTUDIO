import {
  AutomationCompatibilityVersion,
  AutomationRegistry,
} from "./automationIndex.ts";
import { getAutomationValidationSummary } from "./automationValidation.ts";
import { AutomationValidationRegistry } from "./automationValidationRegistry.ts";
import type { AutomationValidationDescriptor } from "./automationValidationTypes.ts";

export const buildAutomationValidationManifest = () =>
  Object.freeze({
    validationIdentity: Object.freeze({
      validationId: "OPS-8:4",
      validationName: "Executive Automation Validation",
      validationVersion: "1.0.0",
      consumedPhases: Object.freeze(["OPS-8:1", "OPS-8:2", "OPS-8:3"]),
      compatibilityVersion: AutomationCompatibilityVersion,
      finalValidationState: getAutomationValidationSummary().status,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies AutomationValidationDescriptor),
    platformIdentity: Object.freeze({
      platformId: AutomationRegistry.platformId,
      platformName: AutomationRegistry.platformName,
      platformVersion: AutomationRegistry.version,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    validationRegistry: AutomationValidationRegistry,
    supportedRuleGroups: Object.freeze(
      AutomationValidationRegistry.validationGroups.map((group) => group.name),
    ),
    validationSummary: getAutomationValidationSummary(),
    compatibilitySummary: Object.freeze({
      compatibilityStatus:
        AutomationValidationRegistry.compatibilityMetadata.consumedPhases.length === 3
          ? "PASS"
          : "FAIL",
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
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
