import {
  AutomationCompatibilityVersion,
} from "./automationIndex.ts";
import {
  AutomationValidationGroups,
  AutomationValidationRuleCatalog,
} from "./automationValidationRules.ts";

export const AutomationValidationRegistry = Object.freeze({
  validationGroups: AutomationValidationGroups,
  validationRuleCatalog: AutomationValidationRuleCatalog,
  validationMetadata: Object.freeze({
    groupCount: AutomationValidationGroups.length,
    ruleCount: AutomationValidationRuleCatalog.length,
    compatibilityVersion: AutomationCompatibilityVersion,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  }),
  compatibilityMetadata: Object.freeze({
    consumedPhases: Object.freeze(["OPS-8:1", "OPS-8:2", "OPS-8:3"]),
    compatibilityVersion: AutomationCompatibilityVersion,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
