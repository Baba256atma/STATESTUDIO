import type {
  DirectorValidationCategory,
  DirectorValidationCategoryName,
} from "./directorValidationTypes.ts";

const names: readonly DirectorValidationCategoryName[] = Object.freeze([
  "Identity Validation", "Registry Validation", "Model Validation",
  "Relationship Validation", "Dependency Validation", "Boundary Validation",
  "Namespace Validation", "Export Validation", "Lifecycle Validation",
  "Readiness Validation",
]);

export const DirectorValidationCategories: readonly DirectorValidationCategory[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `DIRECTOR-1:4/Category/${name.replaceAll(" ", "")}`,
    name,
    description: `Architectural ${name.toLowerCase()} metadata for Director models.`,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })));

