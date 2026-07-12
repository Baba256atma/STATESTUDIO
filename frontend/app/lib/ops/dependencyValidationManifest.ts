import {
  DependencyCompatibilityVersion,
  DependencyIntelligenceRegistry,
} from "./dependencyIntelligenceIndex.ts";
import { DependencyValidationRegistry } from "./dependencyValidationRegistry.ts";
import { getDependencyValidationSummary } from "./dependencyValidation.ts";
import type { DependencyValidationDescriptor } from "./dependencyValidationTypes.ts";

export const buildDependencyValidationManifest = () =>
  Object.freeze({
    validationIdentity: Object.freeze({
      validationId: "OPS-7:4",
      validationName: "Executive Dependency Intelligence Validation",
      validationVersion: "1.0.0",
      consumedPhases: Object.freeze(["OPS-7:1", "OPS-7:2", "OPS-7:3"]),
      compatibilityVersion: DependencyCompatibilityVersion,
      finalValidationState: getDependencyValidationSummary().status,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies DependencyValidationDescriptor),
    platformIdentity: Object.freeze({
      platformId: DependencyIntelligenceRegistry.platformId,
      platformName: DependencyIntelligenceRegistry.platformName,
      platformVersion: DependencyIntelligenceRegistry.version,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    validationRegistry: DependencyValidationRegistry,
    supportedRuleGroups: Object.freeze(
      DependencyValidationRegistry.validationGroups.map((group) => group.name),
    ),
    validationSummary: getDependencyValidationSummary(),
    compatibilitySummary: Object.freeze({
      compatibilityStatus:
        DependencyValidationRegistry.compatibilityMetadata.consumedPhases.length === 3
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
