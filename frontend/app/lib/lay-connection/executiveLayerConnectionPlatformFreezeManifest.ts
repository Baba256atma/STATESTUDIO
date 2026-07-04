import { getExecutiveLayerConnectionCompatibilityMatrix } from "./executiveLayerConnectionPlatformCompatibility.ts";
import { runExecutiveLayerConnectionCertification } from "./executiveLayerConnectionPlatformCertification.ts";
import {
  EXECUTIVE_LAYER_CONNECTION_EXTENSION_POLICY,
  EXECUTIVE_LAYER_CONNECTION_PHASE_REGISTRY,
  EXECUTIVE_LAYER_CONNECTION_PUBLIC_API_REGISTRY,
  EXECUTIVE_LAYER_CONNECTION_RELEASE_METADATA,
} from "./executiveLayerConnectionPlatformFreezeRegistry.ts";
import { getExecutiveLayerConnectionFreezeState } from "./executiveLayerConnectionPlatformFreezeRunner.ts";
import type { ExecutiveLayerConnectionFreezeManifest } from "./executiveLayerConnectionPlatformFreezeTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `lay-conn-12-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildExecutiveLayerConnectionFreezeManifest(): ExecutiveLayerConnectionFreezeManifest {
  const compatibilityMatrix = getExecutiveLayerConnectionCompatibilityMatrix();
  const certificationResult = runExecutiveLayerConnectionCertification();
  const freezeState = getExecutiveLayerConnectionFreezeState();
  const dependencies = Object.freeze(EXECUTIVE_LAYER_CONNECTION_PHASE_REGISTRY.map((phase) => phase.phaseId));
  const deterministicFingerprint = fingerprint([
    EXECUTIVE_LAYER_CONNECTION_RELEASE_METADATA.platformId,
    EXECUTIVE_LAYER_CONNECTION_RELEASE_METADATA.platformVersion,
    ...EXECUTIVE_LAYER_CONNECTION_PHASE_REGISTRY.map((phase) => `${phase.phaseId}:${phase.certified}`).sort(),
    ...EXECUTIVE_LAYER_CONNECTION_PUBLIC_API_REGISTRY.map((api) => `${api.apiName}:${api.stable}`).sort(),
    ...compatibilityMatrix.map((entry) => `${entry.platformId}:${entry.compatible}:${entry.required}:${entry.mode}`).sort(),
    certificationResult.status,
    freezeState.status,
  ]);

  return Object.freeze({
    platformId: EXECUTIVE_LAYER_CONNECTION_RELEASE_METADATA.platformId,
    platformVersion: "LAY-CONN-12",
    certifiedPhases: EXECUTIVE_LAYER_CONNECTION_PHASE_REGISTRY,
    publicApis: EXECUTIVE_LAYER_CONNECTION_PUBLIC_API_REGISTRY,
    compatibilityMatrix,
    dependencies,
    extensionPolicy: EXECUTIVE_LAYER_CONNECTION_EXTENSION_POLICY,
    releaseMetadata: EXECUTIVE_LAYER_CONNECTION_RELEASE_METADATA,
    certificationResult,
    freezeState,
    deterministicFingerprint,
  });
}
