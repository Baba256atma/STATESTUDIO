import type { ExecutivePlanningFreezeCompatibilityEntry } from "./executivePlanningFreezeTypes.ts";

const compatibility = (
  key: string,
  component: string,
  compatibilityLevel: ExecutivePlanningFreezeCompatibilityEntry["compatibilityLevel"],
) => Object.freeze({
  id: `eng-5-freeze-compat-${key}`,
  component,
  compatibilityLevel,
  supportedVersion: "1.0.0",
  stabilityGuarantee: "Stable",
  forwardCompatibility: true,
  metadataOnly: true,
  runtimeFree: true,
  immutable: true,
} as const satisfies ExecutivePlanningFreezeCompatibilityEntry);

export const ExecutivePlanningFreezeCompatibility = Object.freeze([
  compatibility(
    "executive-engine-foundation",
    "Executive Engine Foundation",
    "PublicIndexCompatible",
  ),
  compatibility(
    "executive-request-intent",
    "Executive Request & Intent",
    "PublicIndexCompatible",
  ),
  compatibility(
    "executive-intent-resolution",
    "Executive Intent Resolution",
    "PublicIndexCompatible",
  ),
  compatibility(
    "executive-context-assembly",
    "Executive Context Assembly",
    "PublicIndexCompatible",
  ),
  compatibility(
    "executive-operations-platform",
    "Executive Operations Platform",
    "BoundaryDeclared",
  ),
  compatibility(
    "future-public-index",
    "Future Public Index",
    "ForwardCompatible",
  ),
] as const);
