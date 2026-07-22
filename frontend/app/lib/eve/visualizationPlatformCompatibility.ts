import { VisualizationManifest } from "./visualizationManifest.ts";
import type { VisualizationPlatformCompatibilityEntry } from "./visualizationPlatformTypes.ts";

const validationReference = VisualizationManifest.metadata.validationSummary.id;
const registryReference = VisualizationManifest.inventory.canonicalReferences[1]!;
const foundationReference = VisualizationManifest.inventory.canonicalReferences[0]!;
const manifestReference = VisualizationManifest.metadata.id;

const seeds = Object.freeze([
  ["ManifestCompatibility", manifestReference],
  ["ValidationCompatibility", validationReference],
  ["RegistryCompatibility", registryReference],
  ["FoundationCompatibility", foundationReference],
  ["PublicApiCompatibility", manifestReference],
  ["VersionCompatibility", VisualizationManifest.metadata.version],
  ["DependencyCompatibility", validationReference],
  ["FutureCertificationCompatibility", manifestReference],
] as const);

export const VisualizationPlatformCompatibility: readonly VisualizationPlatformCompatibilityEntry[] =
  Object.freeze(seeds.map(([name, reference], index) => Object.freeze({
    id: `EVE-1:6/Compatibility/${name}`,
    name,
    compatible: true,
    manifestReference: reference,
    deterministicOrder: index + 1,
    runtimeCheck: false,
    metadataOnly: true,
    immutable: true,
  })));

