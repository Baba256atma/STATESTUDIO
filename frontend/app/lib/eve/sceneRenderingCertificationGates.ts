import { SceneRenderingPlatform } from "./sceneRenderingPlatform.ts";
import type { SceneRenderingCertificationGate } from "./sceneRenderingCertificationTypes.ts";

const names = Object.freeze([
  "IdentityVerified", "PlatformVerified", "CompositionVerified",
  "DependenciesVerified", "InventoriesVerified", "CapabilitiesVerified",
  "GuaranteesVerified", "CompatibilityVerified", "NamespaceVerified",
  "PublicSurfaceVerified", "ArchitectureVerified", "ReadyForFreeze",
] as const);

export const SceneRenderingCertificationGates: readonly SceneRenderingCertificationGate[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `EVE-2:7/Gate/${name}`,
    name,
    outcome: "Certified",
    status: "Passed",
    platformReference: SceneRenderingPlatform.metadata.id,
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })));
