import {
  DependencyCompatibilityVersion,
} from "./dependencyIntelligenceIndex.ts";
import {
  DependencyValidationGroups,
  DependencyValidationRuleCatalog,
} from "./dependencyValidationRules.ts";

export const DependencyValidationRegistry = Object.freeze({
  validationGroups: DependencyValidationGroups,
  validationRuleCatalog: DependencyValidationRuleCatalog,
  validationMetadata: Object.freeze({
    groupCount: DependencyValidationGroups.length,
    ruleCount: DependencyValidationRuleCatalog.length,
    compatibilityVersion: DependencyCompatibilityVersion,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  }),
  compatibilityMetadata: Object.freeze({
    consumedPhases: Object.freeze(["OPS-7:1", "OPS-7:2", "OPS-7:3"]),
    compatibilityVersion: DependencyCompatibilityVersion,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
