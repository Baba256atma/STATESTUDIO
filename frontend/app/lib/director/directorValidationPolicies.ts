import type { DirectorValidationPolicy } from "./directorValidationTypes.ts";

const policyNames = Object.freeze([
  "Canonical Reference Policy",
  "Immutable Metadata Policy",
  "Registry Integrity Policy",
  "Deterministic Ordering Policy",
  "Stable Export Policy",
  "Dependency Boundary Policy",
  "Director Ownership Policy",
  "Non-Rendering Policy",
] as const);

export const DirectorValidationPolicies: readonly DirectorValidationPolicy[] =
  Object.freeze(policyNames.map((name, index) => Object.freeze({
    id: `DIRECTOR-1:4/Policy/${name.replaceAll(" ", "")}`,
    name,
    description: `Descriptive Director validation policy for ${name}.`,
    deterministicOrder: index + 1,
    enforcement: "DescriptiveOnly",
    metadataOnly: true,
    immutable: true,
  })));

