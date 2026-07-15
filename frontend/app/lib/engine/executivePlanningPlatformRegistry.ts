import type { ExecutivePlanningPlatformSectionEntry } from "./executivePlanningPlatformTypes.ts";

const section = (
  key: string,
  title: ExecutivePlanningPlatformSectionEntry["title"],
  description: string,
  dependency: string,
  readiness: string,
  publicApiReference: string,
) => Object.freeze({
  id: `eng-5-platform-section-${key}`,
  title,
  description,
  dependency,
  ownership: "ENG-5",
  readiness,
  publicApiReference,
  metadataOnly: true,
  runtimeFree: true,
} as const satisfies ExecutivePlanningPlatformSectionEntry);

export const ExecutivePlanningPlatformRegistry = Object.freeze([
  section(
    "foundation",
    "Foundation",
    "ENG-5:1 Executive Planning Foundation establishing contracts, capabilities, lifecycle, ownership, and metadata.",
    "executivePlanningIndex.ts",
    "FoundationComplete",
    "executivePlanningIndex.ts",
  ),
  section(
    "registry",
    "Registry",
    "ENG-5:2 Executive Planning Registry Platform classifying planning vocabulary and taxonomy.",
    "executivePlanningRegistryIndex.ts",
    "RegistryComplete",
    "executivePlanningRegistryIndex.ts",
  ),
  section(
    "model",
    "Model",
    "ENG-5:3 Executive Planning Model Platform defining planning domain models.",
    "executivePlanningModelIndex.ts",
    "ModelComplete",
    "executivePlanningModelIndex.ts",
  ),
  section(
    "validation",
    "Validation",
    "ENG-5:4 Executive Planning Validation Platform verifying architectural integrity.",
    "executivePlanningValidationIndex.ts",
    "ValidationComplete",
    "executivePlanningValidationIndex.ts",
  ),
  section(
    "manifest",
    "Manifest",
    "ENG-5:5 Executive Planning Manifest Platform consolidating architectural inventory and release metadata.",
    "executivePlanningManifestIndex.ts",
    "ManifestComplete",
    "executivePlanningManifestIndex.ts",
  ),
] as const);
