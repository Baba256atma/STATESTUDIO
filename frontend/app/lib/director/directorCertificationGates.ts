import { DirectorPlatform } from "./directorPlatform.ts";
import type { DirectorCertificationGate } from "./directorCertificationTypes.ts";

const names = Object.freeze([
  "Identity Gate", "Namespace Gate", "Version Gate", "Architecture Gate",
  "Inventory Gate", "Composition Gate", "Compatibility Gate",
  "Dependency Gate", "Export Gate", "Readiness Gate", "Stability Gate",
  "Canonical Reference Gate", "Canonical Inventory Gate",
  "Non-Rendering Gate", "Non-Runtime Gate", "Final Certification Gate",
] as const);

export const DirectorCertificationGates: readonly DirectorCertificationGate[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `DIRECTOR-1:7/Gate/${name.replaceAll(" ", "")}`,
    name,
    description: `Immutable certification gate for ${name}.`,
    status: "Certified",
    result: "Passed",
    evidenceReference: DirectorPlatform.metadata.identity.platformId,
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })));

