import { AnimationEffectsModelPlatform } from "./animationEffectsModel.ts";
import type {
  AnimationEffectsValidationOutcome,
  AnimationEffectsValidationSeverity,
} from "./animationEffectsValidationTypes.ts";

export const AnimationEffectsValidationSeverityLevels:
readonly AnimationEffectsValidationSeverity[] = Object.freeze([
  "Information", "Advisory", "Warning", "Minor", "Major", "Critical",
]);

export const AnimationEffectsValidationOutcomes:
readonly AnimationEffectsValidationOutcome[] = Object.freeze([
  "Passed", "PassedWithNotes", "ReviewRequired", "Deferred", "Blocked",
  "NotApplicable",
]);

const diagnosticNames = Object.freeze([
  "Identity", "References", "Models", "Relationships", "Metadata",
  "Inventory", "Dependencies", "Compatibility",
] as const);

export const AnimationEffectsValidationDiagnostics = Object.freeze(
  diagnosticNames.map((name, index) => Object.freeze({
    id: `EVE-7:4/Diagnostic/${name}` as const,
    name,
    description: `Metadata-only diagnostic classification: ${name}.`,
    severityReference:
      AnimationEffectsValidationSeverityLevels[
        index % AnimationEffectsValidationSeverityLevels.length
      ]!,
    outcomeReference:
      AnimationEffectsValidationOutcomes[
        index % AnimationEffectsValidationOutcomes.length
      ]!,
    modelReference: AnimationEffectsModelPlatform.metadata.id,
    deterministicOrder: index + 1,
    runtimeReporting: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const AnimationEffectsValidationFailureClassifications = Object.freeze([
  "IdentityFailure", "ReferenceFailure", "CompletenessFailure",
  "RelationshipFailure", "ArchitectureFailure", "DependencyFailure",
].map((name, index) => Object.freeze({
  id: `EVE-7:4/Failure/${index + 1}` as const,
  name,
  deterministicOrder: index + 1,
  runtimeReporting: false,
  metadataOnly: true,
  immutable: true,
})));

export const AnimationEffectsValidationRecommendationClassifications =
  Object.freeze([
    "PreserveIdentity", "RestoreReference", "CompleteMetadata",
    "CorrectRelationship", "PreserveDependency", "ReviewCompatibility",
  ].map((name, index) => Object.freeze({
    id: `EVE-7:4/Recommendation/${index + 1}` as const,
    name,
    deterministicOrder: index + 1,
    runtimeReporting: false,
    metadataOnly: true,
    immutable: true,
  })));
