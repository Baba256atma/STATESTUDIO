import { AppDomainBridge } from "./appDomainBridgeIndex.ts";
import {
  buildAppDomainConsumerSnapshot,
  buildAppDomainMapping,
} from "./appDomainMapping.ts";
import type {
  AppDomainMappingManifest,
  AppDomainMappingValidation,
} from "./appDomainMappingTypes.ts";

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function manifestFingerprint(manifest: Omit<AppDomainMappingManifest, "fingerprint">): string {
  return stableHash(
    [
      manifest.mappingId,
      manifest.phaseId,
      manifest.bridgeVersion,
      manifest.consumedDomVersion,
      manifest.supportedAppVersion,
      manifest.capabilitiesMapped,
      manifest.registryMapped,
      manifest.packageCount,
      manifest.immutable,
      manifest.deterministic,
      manifest.metadataOnly,
    ].join("||")
  );
}

export function buildAppDomainMappingManifest(): AppDomainMappingManifest {
  const bridgeManifest = AppDomainBridge.buildAppDomainBridgeManifest();
  const snapshot = buildAppDomainConsumerSnapshot();
  const mapping = buildAppDomainMapping();
  const base = Object.freeze({
    mappingId: mapping.mappingId,
    phaseId: "APP-DOM-2" as const,
    bridgeVersion: bridgeManifest.consumerMetadata.supportedApiVersion,
    consumedDomVersion: bridgeManifest.consumedPlatform.version,
    supportedAppVersion: "APP-DOM-2" as const,
    capabilitiesMapped: snapshot.capabilityMap.totalCapabilities,
    registryMapped: snapshot.registryMap.platformCount > 0,
    packageCount: snapshot.packageMap.totalPackages,
    immutable: true as const,
    deterministic: true as const,
    metadataOnly: true as const,
  });

  return Object.freeze({
    ...base,
    fingerprint: manifestFingerprint(base),
  });
}

export function validateAppDomainMappingManifest(manifest: AppDomainMappingManifest): AppDomainMappingValidation {
  const expected = manifestFingerprint({
    mappingId: manifest.mappingId,
    phaseId: manifest.phaseId,
    bridgeVersion: manifest.bridgeVersion,
    consumedDomVersion: manifest.consumedDomVersion,
    supportedAppVersion: manifest.supportedAppVersion,
    capabilitiesMapped: manifest.capabilitiesMapped,
    registryMapped: manifest.registryMapped,
    packageCount: manifest.packageCount,
    immutable: manifest.immutable,
    deterministic: manifest.deterministic,
    metadataOnly: manifest.metadataOnly,
  });
  const issues: AppDomainMappingValidation["issues"][number][] = [];

  if (manifest.bridgeVersion !== "APP-DOM-1") {
    issues.push(Object.freeze({ code: "invalid_bridge_version", message: "Mapping must consume APP-DOM-1 bridge." }));
  }
  if (manifest.consumedDomVersion !== "DOM-8") {
    issues.push(Object.freeze({ code: "invalid_dom_version", message: "Mapping must consume DOM-8." }));
  }
  if (manifest.capabilitiesMapped === 0 || !manifest.registryMapped || manifest.packageCount === 0) {
    issues.push(Object.freeze({ code: "incomplete_mapping", message: "Mapping manifest must include capabilities, registry, and packages." }));
  }
  if (manifest.fingerprint !== expected) {
    issues.push(Object.freeze({ code: "invalid_fingerprint", message: "Mapping manifest fingerprint must be deterministic." }));
  }

  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}
