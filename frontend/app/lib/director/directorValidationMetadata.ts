import { DirectorValidationRegistry } from "./directorValidationRegistry.ts";

/** Counts are derived exclusively from canonical registry collections. */
export const DirectorValidationMetadata = Object.freeze({
  id: "DIRECTOR-1:4/DirectorValidation",
  name: "Director Validation",
  namespace: "nexora.director.validation",
  layer: "Director",
  status: "Validation",
  readiness: DirectorValidationRegistry.readiness,
  validationVersion: "1.0.0",
  validationCategoryCount: DirectorValidationRegistry.categories.length,
  validationRuleCount: DirectorValidationRegistry.rules.length,
  policyCount: DirectorValidationRegistry.policies.length,
  relationshipCount: DirectorValidationRegistry.rules.filter(
    ({ category }) => category === "Relationship Validation",
  ).length,
  countsDerivedFromCanonicalCollections: true,
  runtimeValidation: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

