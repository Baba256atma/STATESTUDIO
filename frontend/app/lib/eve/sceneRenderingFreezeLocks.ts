import { SceneRenderingCertification } from "./sceneRenderingCertification.ts";
import type { SceneRenderingFreezeLock } from "./sceneRenderingFreezeTypes.ts";

const names = Object.freeze([
  "PlatformIdentityLock", "PhaseCompositionLock", "DependencyLock", "InventoryLock",
  "CapabilityLock", "GuaranteeLock", "CompatibilityLock", "PublicExportLock",
  "NamespaceLock", "CanonicalReferenceLock", "VersionLock", "CertificationLock",
] as const);

export const SceneRenderingFreezeLocks: readonly SceneRenderingFreezeLock[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `EVE-2:8/Lock/${name}`,
    name,
    lockIdentifier: "EVE-2-SCENE-RENDERING-LOCKED",
    status: "Locked",
    certificationReference: SceneRenderingCertification.metadata.id,
    deterministicOrder: index + 1,
    runtimeLocking: false,
    metadataOnly: true,
    immutable: true,
  })));
