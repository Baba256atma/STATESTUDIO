import { AppDomainMappingLayer } from "./appDomainMappingIndex.ts";
import { createDomainContext } from "./appDomainContextSelection.ts";
import type {
  AppDomainContextManifest,
  AppDomainSelectionCriteria,
} from "./appDomainContextTypes.ts";

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function manifestFingerprint(manifest: Omit<AppDomainContextManifest, "fingerprint">): string {
  return stableHash(
    [
      manifest.contextIdentity,
      manifest.selectionMode,
      manifest.selectionScope,
      manifest.mappedPlatform,
      manifest.mappedPackages.join(","),
      manifest.consumerMetadata.bridgePhase,
      manifest.consumerMetadata.mappingPhase,
      manifest.consumerMetadata.contextPhase,
      manifest.immutable,
      manifest.deterministic,
      manifest.metadataOnly,
    ].join("||")
  );
}

export function buildAppDomainContextManifest(criteria?: AppDomainSelectionCriteria): AppDomainContextManifest {
  const context = createDomainContext(criteria);
  const snapshot = AppDomainMappingLayer.buildAppDomainConsumerSnapshot();
  const base = Object.freeze({
    contextIdentity: "APP-DOM-3 Domain Context Selection Layer" as const,
    selectionMode: context.selection.criteria.mode,
    selectionScope: context.selection.criteria.scope,
    mappedPlatform: snapshot.platformMap.platformInfo.version,
    mappedPackages: Object.freeze(snapshot.packageMap.packages.map((entry) => entry.packageId)),
    consumerMetadata: Object.freeze({
      appLayerId: "APP" as const,
      bridgePhase: "APP-DOM-1" as const,
      mappingPhase: "APP-DOM-2" as const,
      contextPhase: "APP-DOM-3" as const,
      metadataOnly: true as const,
    }),
    immutable: true as const,
    deterministic: true as const,
    metadataOnly: true as const,
  });

  return Object.freeze({
    ...base,
    fingerprint: manifestFingerprint(base),
  });
}

export function validateAppDomainContextManifest(manifest: AppDomainContextManifest) {
  const expected = manifestFingerprint({
    contextIdentity: manifest.contextIdentity,
    selectionMode: manifest.selectionMode,
    selectionScope: manifest.selectionScope,
    mappedPlatform: manifest.mappedPlatform,
    mappedPackages: manifest.mappedPackages,
    consumerMetadata: manifest.consumerMetadata,
    immutable: manifest.immutable,
    deterministic: manifest.deterministic,
    metadataOnly: manifest.metadataOnly,
  });
  const valid =
    manifest.mappedPlatform === "DOM-8" &&
    manifest.mappedPackages.length > 0 &&
    manifest.consumerMetadata.bridgePhase === "APP-DOM-1" &&
    manifest.consumerMetadata.mappingPhase === "APP-DOM-2" &&
    manifest.consumerMetadata.contextPhase === "APP-DOM-3" &&
    manifest.fingerprint === expected &&
    manifest.metadataOnly;

  return Object.freeze({
    valid,
    issues: Object.freeze(
      valid ? [] : [Object.freeze({ code: "invalid_context_manifest", message: "Context manifest is incomplete or non-deterministic." })]
    ),
  });
}
