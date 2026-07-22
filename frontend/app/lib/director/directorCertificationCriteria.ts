import { DirectorPlatform } from "./directorPlatform.ts";
import type { DirectorCertificationCriterion } from "./directorCertificationTypes.ts";

const names = Object.freeze([
  "Platform Identity Integrity",
  "Namespace Integrity",
  "Version Integrity",
  "Canonical Architecture Chain",
  "Manifest-Derived Inventories",
  "Canonical Registry References",
  "Platform Composition Integrity",
  "Dependency Boundary Compliance",
  "Compatibility Metadata",
  "Readiness Metadata",
  "Public Export Stability",
  "Deterministic Metadata",
  "Canonical Inventory Rule Compliance",
  "No Prohibited Imports",
  "Non-Runtime Architecture",
  "Non-Rendering Architecture",
  "Non-UI Architecture",
  "Immutable Platform Metadata",
] as const);

export const DirectorCertificationCriteria: readonly DirectorCertificationCriterion[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `DIRECTOR-1:7/Criterion/${name.replaceAll(/[^A-Za-z]/g, "")}`,
    name,
    description: `Descriptive certification criterion for ${name}.`,
    platformReference: DirectorPlatform.metadata.identity.platformId,
    deterministicOrder: index + 1,
    verification: "DescriptiveOnly",
    metadataOnly: true,
    immutable: true,
  })));

