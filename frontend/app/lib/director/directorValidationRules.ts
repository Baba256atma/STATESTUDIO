import type {
  DirectorValidationCategoryName,
  DirectorValidationRule,
} from "./directorValidationTypes.ts";

type RuleSeed = readonly [
  name: string,
  category: DirectorValidationCategoryName,
  requirement: "Required" | "Forbidden",
];

const seeds: readonly RuleSeed[] = Object.freeze([
  ["Unique Identifiers", "Identity Validation", "Required"],
  ["Canonical Identifiers", "Identity Validation", "Required"],
  ["Stable Version", "Identity Validation", "Required"],
  ["Immutable Namespace", "Namespace Validation", "Required"],
  ["Registry Reference Exists", "Registry Validation", "Required"],
  ["Canonical Registry Reference", "Registry Validation", "Required"],
  ["Valid Registry Type", "Registry Validation", "Required"],
  ["Required Model Metadata", "Model Validation", "Required"],
  ["Required Model Properties", "Model Validation", "Required"],
  ["Immutable Model Structure", "Model Validation", "Required"],
  ["Stable Model Typing", "Model Validation", "Required"],
  ["Relationship Target Exists", "Relationship Validation", "Required"],
  ["No Circular Architectural Ownership", "Relationship Validation", "Forbidden"],
  ["Canonical Relationship References", "Relationship Validation", "Required"],
  ["Deterministic Relationship Ordering", "Relationship Validation", "Required"],
  ["Director Model Only Dependency", "Dependency Validation", "Required"],
  ["EVE Dependency", "Dependency Validation", "Forbidden"],
  ["Rendering Dependency", "Dependency Validation", "Forbidden"],
  ["UI Dependency", "Dependency Validation", "Forbidden"],
  ["Graphics Dependency", "Dependency Validation", "Forbidden"],
  ["Runtime Systems Dependency", "Dependency Validation", "Forbidden"],
  ["Networking Dependency", "Dependency Validation", "Forbidden"],
  ["Persistence Dependency", "Dependency Validation", "Forbidden"],
  ["Scene Orchestration Metadata Ownership", "Boundary Validation", "Required"],
  ["Camera Planning Metadata Ownership", "Boundary Validation", "Required"],
  ["Timeline Planning Metadata Ownership", "Boundary Validation", "Required"],
  ["Visualization Planning Metadata Ownership", "Boundary Validation", "Required"],
  ["Rendering Ownership", "Boundary Validation", "Forbidden"],
  ["Business Reasoning Ownership", "Boundary Validation", "Forbidden"],
  ["Business Objects Ownership", "Boundary Validation", "Forbidden"],
  ["AI Ownership", "Boundary Validation", "Forbidden"],
  ["External Transport Ownership", "Boundary Validation", "Forbidden"],
  ["Stable Public Exports", "Export Validation", "Required"],
  ["Public API Consistency", "Export Validation", "Required"],
  ["Namespace Consistency", "Namespace Validation", "Required"],
  ["Lifecycle Metadata Integrity", "Lifecycle Validation", "Required"],
  ["Manifest Readiness", "Readiness Validation", "Required"],
]);

export const DirectorValidationRules: readonly DirectorValidationRule[] =
  Object.freeze(seeds.map(([name, category, requirement], index) => Object.freeze({
    id: `DIRECTOR-1:4/Rule/${name.replaceAll(" ", "")}`,
    name,
    description: `${requirement} architectural rule: ${name}.`,
    category,
    requirement,
    deterministicOrder: index + 1,
    executesValidation: false,
    metadataOnly: true,
    immutable: true,
  })));

