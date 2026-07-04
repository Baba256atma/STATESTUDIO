import {
  APP_DOMAIN_BRIDGE_IDENTITY,
  APP_DOMAIN_CONSUMER_METADATA,
  APP_DOMAIN_CONSUMED_PLATFORM,
} from "./appDomainBridgeRegistry.ts";
import {
  getDomainPlatformCapabilities,
  getDomainPlatformInfo,
  getDomainPlatformRegistry,
  isDomainPlatformCompatible,
} from "./appDomainBridge.ts";
import type { AppDomainBridgeManifest } from "./appDomainBridgeTypes.ts";

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function bridgeFingerprint(manifest: Omit<AppDomainBridgeManifest, "fingerprint">): string {
  return stableHash(
    [
      manifest.bridgeId,
      manifest.bridgeName,
      manifest.consumedPlatform.platformId,
      manifest.consumedPlatform.version,
      manifest.compatibility.compatible,
      manifest.capabilities.map((entry) => entry.capabilityId).join(","),
      manifest.registrySnapshot.platforms.map((entry) => entry.platformId).join(","),
      manifest.consumerMetadata.supportedPlatformVersion,
      manifest.consumerMetadata.supportedApiVersion,
      manifest.immutable,
      manifest.deterministic,
      manifest.metadataOnly,
    ].join("||")
  );
}

export function buildAppDomainBridgeManifest(): AppDomainBridgeManifest {
  const base = Object.freeze({
    bridgeId: APP_DOMAIN_BRIDGE_IDENTITY.bridgeId,
    bridgeName: APP_DOMAIN_BRIDGE_IDENTITY.bridgeName,
    consumedPlatform: getDomainPlatformInfo(),
    compatibility: isDomainPlatformCompatible(),
    capabilities: getDomainPlatformCapabilities(),
    registrySnapshot: getDomainPlatformRegistry(),
    consumerMetadata: Object.freeze({
      appLayerId: APP_DOMAIN_CONSUMER_METADATA.appLayerId,
      consumedLayerId: APP_DOMAIN_CONSUMER_METADATA.consumedLayerId,
      supportedPlatformVersion: APP_DOMAIN_CONSUMED_PLATFORM.supportedPlatformVersion,
      supportedApiVersion: APP_DOMAIN_CONSUMED_PLATFORM.supportedApiVersion,
      metadataOnly: true as const,
    }),
    immutable: true as const,
    deterministic: true as const,
    metadataOnly: true as const,
  });

  return Object.freeze({
    ...base,
    fingerprint: bridgeFingerprint(base),
  });
}
