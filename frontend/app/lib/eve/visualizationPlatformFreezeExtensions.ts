import { VisualizationPlatformCertificationPlatform } from "./visualizationPlatformCertification.ts";
import type { VisualizationPlatformFreezeDeclaration } from "./visualizationPlatformFreezeTypes.ts";

const certification = VisualizationPlatformCertificationPlatform;
const extensionNames = Object.freeze([
  "Platform extensions", "Module extensions", "Capability extensions",
  "Compatibility extensions", "Namespace extensions", "Inventory extensions",
  "Metadata extensions", "Future Public Index extensions",
] as const);

export const VisualizationPlatformFreezeExtensions:
readonly VisualizationPlatformFreezeDeclaration[] = Object.freeze(
  extensionNames.map((name, index) => Object.freeze({
    id: `EVE-8:8/Extension/${index + 1}` as const,
    name,
    canonicalReference: certification,
    preservedByReference: true as const,
    deterministicOrder: index + 1,
    runtimeExecution: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
