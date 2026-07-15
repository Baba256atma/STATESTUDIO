import type { ExecutivePlanningManifestCompatibilityEntry } from "./executivePlanningManifestTypes.ts";

const compatibility = (
  key: string,
  subject: string,
  compatibilityLevel: ExecutivePlanningManifestCompatibilityEntry["compatibilityLevel"],
  architecturalGuarantees: readonly string[],
) => Object.freeze({
  id: `eng-5-manifest-compatibility-${key}`,
  subject,
  compatibilityLevel,
  supportedVersion: "1.0.0",
  architecturalGuarantees: Object.freeze([...architecturalGuarantees]),
  forwardCompatibility: true,
  publicApiCompatibility: "Stable",
  metadataOnly: true,
  runtimeFree: true,
} as const satisfies ExecutivePlanningManifestCompatibilityEntry);

export const ExecutivePlanningCompatibilityManifest = Object.freeze([
  compatibility(
    "executive-engine-foundation",
    "Executive Engine Foundation",
    "PublicIndexCompatible",
    Object.freeze([
      "Consumes ENG-1 exclusively through its official public index",
      "Preserves generic engine ownership boundaries",
    ]),
  ),
  compatibility(
    "executive-request-intent",
    "Executive Request & Intent",
    "PublicIndexCompatible",
    Object.freeze([
      "Consumes ENG-2 exclusively through its official public index",
      "Does not duplicate request or intent ownership",
    ]),
  ),
  compatibility(
    "executive-intent-resolution",
    "Executive Intent Resolution",
    "PublicIndexCompatible",
    Object.freeze([
      "Consumes ENG-3 exclusively through its official public index",
      "Planning receives already-resolved intent metadata only",
    ]),
  ),
  compatibility(
    "executive-context-assembly",
    "Executive Context Assembly",
    "PublicIndexCompatible",
    Object.freeze([
      "Consumes ENG-4 exclusively through its official public index",
      "Context assembly remains distinct from planning ownership",
    ]),
  ),
  compatibility(
    "executive-operations-platform",
    "Executive Operations Platform",
    "BoundaryDeclared",
    Object.freeze([
      "OPS remains execution owner",
      "Planning publishes execution descriptors as metadata only",
      "No OPS runtime invocation from ENG-5 manifests",
    ]),
  ),
  compatibility(
    "future-eng-5-platform",
    "Future ENG-5 Platform",
    "ForwardCompatible",
    Object.freeze([
      "Manifest is ready for ENG-5:6 Platform aggregation",
      "Public APIs remain additive and versioned",
      "No future-phase imports are introduced by ENG-5:5",
    ]),
  ),
] as const);
