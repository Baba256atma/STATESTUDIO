import { BusinessSuiteArchitectureFreezeRegistry } from "./businessSuiteArchitectureFreezeRegistry.ts";
import type {
  BusinessArchitectureCertification,
  BusinessArchitectureFreeze,
  BusinessSuiteArchitectureFreezeManifest,
} from "./businessSuiteArchitectureFreezeTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-arch-6-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function buildCertificationStatus(): BusinessArchitectureCertification {
  const registry = BusinessSuiteArchitectureFreezeRegistry;
  return Object.freeze({
    ...registry.certificationMetadata,
    diagnostics: Object.freeze([]),
  });
}

function buildFreezeStatus(publicApiCatalog: readonly string[]): BusinessArchitectureFreeze {
  return Object.freeze({
    freezeId: "bus-arch-freeze-state",
    status: "PASS",
    certificationStatus: "Certified",
    freezeStatus: "Frozen",
    releaseStatus: "Released",
    certifiedPhaseIds: BusinessSuiteArchitectureFreezeRegistry.certifiedPhases,
    publicApiCatalog,
    metadataOnly: true,
    immutable: true,
  });
}

export function buildBusinessSuiteArchitectureFreezeManifest(): BusinessSuiteArchitectureFreezeManifest {
  const registry = BusinessSuiteArchitectureFreezeRegistry;
  const publicApiCatalog = registry.publicApiRegistry;
  const certificationStatus = buildCertificationStatus();
  const freezeStatus = buildFreezeStatus(publicApiCatalog);
  const deterministicFingerprint = fingerprint([
    registry.metadata.freezePhaseId,
    registry.metadata.version,
    ...registry.certifiedPhases,
    ...registry.publicApiRegistry,
    ...registry.compatibilityRegistry.map((entry) => `${entry.targetId}:${entry.classification}:${entry.compatible}`).sort(),
    certificationStatus.status,
    freezeStatus.status,
    registry.releaseMetadata.releaseState,
  ]);

  return Object.freeze({
    architectureIdentity: registry.architectureIdentity,
    certifiedPhaseRegistry: registry.certifiedPhases,
    releaseMetadata: registry.releaseMetadata,
    compatibilityMatrix: registry.compatibilityRegistry,
    publicApiCatalog,
    certificationStatus,
    freezeStatus,
    metadata: registry.metadata,
    deterministicFingerprint,
  });
}
