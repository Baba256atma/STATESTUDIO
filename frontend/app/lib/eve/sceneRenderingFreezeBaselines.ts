import { SceneRenderingCertification } from "./sceneRenderingCertification.ts";
import type { SceneRenderingFrozenBaseline } from "./sceneRenderingFreezeTypes.ts";

const platform = SceneRenderingCertification.platform;
const seeds = Object.freeze([
  ["CertifiedPlatform", platform],
  ["CertificationStatus", SceneRenderingCertification.metadata.status],
  ["PlatformCapabilities", platform.capabilities],
  ["PlatformGuarantees", platform.guarantees],
  ["CompatibilityDeclarations", SceneRenderingCertification.compatibility],
  ["DependencyGraph", platform.metadata.dependency],
  ["InventoryPublication", SceneRenderingCertification.inventory],
  ["ArchitecturalMetadata", platform.metadata],
] as const);

export const SceneRenderingFrozenBaselines: readonly SceneRenderingFrozenBaseline[] =
  Object.freeze(seeds.map(([name, canonicalReference], index) => Object.freeze({
    id: `EVE-2:8/Baseline/${name}`,
    name,
    canonicalReference,
    preservedByReference: true,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })));
