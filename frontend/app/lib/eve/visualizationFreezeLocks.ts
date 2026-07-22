import { VisualizationCertification } from "./visualizationCertification.ts";
import type { VisualizationFreezeLock } from "./visualizationFreezeTypes.ts";

const names = Object.freeze([
  "PlatformIdentityLock", "DependencyLock", "InventoryLock", "CapabilityLock",
  "GuaranteeLock", "CompatibilityLock", "PublicExportLock", "NamespaceLock",
  "CanonicalReferenceLock", "VersionLock", "ArchitectureLock",
  "CertificationLock",
] as const);

export const VisualizationFreezeLocks: readonly VisualizationFreezeLock[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `EVE-1:8/Lock/${name}`,
    name,
    lockIdentifier: "EVE-1-VISUALIZATION-LOCKED",
    status: "Locked",
    certificationReference: VisualizationCertification.metadata.id,
    deterministicOrder: index + 1,
    runtimeLocking: false,
    metadataOnly: true,
    immutable: true,
  })));

