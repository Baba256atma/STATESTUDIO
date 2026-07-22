import { VisualizationSuiteCertificationPlatform } from "./visualizationSuiteCertification.ts";
import type { VisualizationSuiteFreezeDeclaration } from "./visualizationSuiteFreezeTypes.ts";

const certification = VisualizationSuiteCertificationPlatform;
const extensionNames = Object.freeze([
  "Suite extensions", "Platform extensions", "Capability extensions",
  "Compatibility extensions", "Namespace extensions", "Inventory extensions",
  "Metadata extensions", "Future Public Index extensions",
] as const);

export const VisualizationSuiteFreezeExtensions:
readonly VisualizationSuiteFreezeDeclaration[] = Object.freeze(
  extensionNames.map((name, index) => Object.freeze({
    id: `EVE-9:8/Extension/${index + 1}` as const,
    name,
    canonicalReference: certification,
    preservedByReference: true as const,
    deterministicOrder: index + 1,
    runtimeExecution: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
