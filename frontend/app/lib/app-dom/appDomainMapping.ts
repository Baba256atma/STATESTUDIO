import { AppDomainBridge } from "./appDomainBridgeIndex.ts";
import type {
  AppDomainCapabilityMap,
  AppDomainConsumerSnapshot,
  AppDomainMapping,
  AppDomainMappingValidation,
  AppDomainPackageMap,
  AppDomainPlatformMap,
  AppDomainRegistryMap,
} from "./appDomainMappingTypes.ts";

function freezeRecord<T>(record: Record<string, readonly T[]>): Readonly<Record<string, readonly T[]>> {
  return Object.freeze(
    Object.fromEntries(Object.entries(record).map(([key, value]) => [key, Object.freeze([...value])]))
  );
}

function validationResult(issues: AppDomainMappingValidation["issues"]): AppDomainMappingValidation {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

export function buildDomainCapabilityMap(): AppDomainCapabilityMap {
  const capabilities = AppDomainBridge.getDomainPlatformCapabilities();
  const bySourcePlatform: Record<string, typeof capabilities> = {};
  const byCategory: Record<string, typeof capabilities> = {};

  for (const capability of capabilities) {
    bySourcePlatform[capability.sourcePlatform] = Object.freeze([...(bySourcePlatform[capability.sourcePlatform] ?? []), capability]);
    byCategory[capability.category] = Object.freeze([...(byCategory[capability.category] ?? []), capability]);
  }

  return Object.freeze({
    totalCapabilities: capabilities.length,
    bySourcePlatform: freezeRecord(bySourcePlatform),
    byCategory: freezeRecord(byCategory),
    capabilities,
    metadataOnly: true,
  });
}

export function buildDomainRegistryMap(): AppDomainRegistryMap {
  const registry = AppDomainBridge.getDomainPlatformRegistry();
  return Object.freeze({
    platformCount: registry.platformCount,
    phaseCount: registry.phaseCount,
    publicApiCount: registry.publicApiCount,
    platformIds: Object.freeze(registry.platforms.map((entry) => entry.platformId)),
    phaseIds: Object.freeze(registry.phases.map((entry) => entry.phaseId)),
    registry,
    metadataOnly: true,
  });
}

export function buildDomainPackageMap(): AppDomainPackageMap {
  const registry = AppDomainBridge.getDomainPlatformRegistry();
  return Object.freeze({
    totalPackages: registry.platforms.length,
    packages: Object.freeze(
      registry.platforms.map((entry) =>
        Object.freeze({
          packageId: entry.platformId,
          packageName: entry.platformName,
          sourceFacade: entry.publicFacade,
          certification: entry.certification,
          metadataOnly: entry.metadataOnly,
        })
      )
    ),
    metadataOnly: true,
  });
}

export function buildDomainPlatformMap(): AppDomainPlatformMap {
  const platformInfo = AppDomainBridge.getDomainPlatformInfo();
  const compatibility = AppDomainBridge.isDomainPlatformCompatible();
  return Object.freeze({
    platformInfo,
    compatible: compatibility.compatible,
    releaseStage: platformInfo.releaseStage,
    metadataOnly: platformInfo.metadataOnly,
    runtimeBehavior: platformInfo.runtimeBehavior,
  });
}

export function buildAppDomainConsumerSnapshot(): AppDomainConsumerSnapshot {
  return Object.freeze({
    platformMap: buildDomainPlatformMap(),
    capabilityMap: buildDomainCapabilityMap(),
    registryMap: buildDomainRegistryMap(),
    packageMap: buildDomainPackageMap(),
    immutable: true,
    metadataOnly: true,
  });
}

export function validateAppDomainMapping(mapping: AppDomainMapping): AppDomainMappingValidation {
  const issues: AppDomainMappingValidation["issues"][number][] = [];
  if (mapping.mappingId !== "app-dom-mapping") {
    issues.push(Object.freeze({ code: "invalid_mapping_id", message: "Mapping id must be app-dom-mapping." }));
  }
  if (mapping.bridgeId !== "app-dom-bridge") {
    issues.push(Object.freeze({ code: "invalid_bridge_id", message: "Mapping must reference APP-DOM bridge." }));
  }
  if (!mapping.snapshot.platformMap.compatible) {
    issues.push(Object.freeze({ code: "incompatible_platform", message: "Mapped DOM platform must be compatible." }));
  }
  if (mapping.snapshot.capabilityMap.totalCapabilities === 0) {
    issues.push(Object.freeze({ code: "empty_capability_map", message: "Capability map must not be empty." }));
  }
  if (mapping.snapshot.packageMap.totalPackages === 0) {
    issues.push(Object.freeze({ code: "empty_package_map", message: "Package map must not be empty." }));
  }
  if (!mapping.metadataOnly || !mapping.immutable) {
    issues.push(Object.freeze({ code: "invalid_mapping_boundary", message: "Mapping must remain immutable metadata only." }));
  }
  return validationResult(issues);
}

export function buildAppDomainMapping(): AppDomainMapping {
  const mapping = Object.freeze({
    mappingId: "app-dom-mapping" as const,
    bridgeId: "app-dom-bridge" as const,
    snapshot: buildAppDomainConsumerSnapshot(),
    validation: validationResult(Object.freeze([])),
    immutable: true as const,
    metadataOnly: true as const,
  });

  return Object.freeze({
    ...mapping,
    validation: validateAppDomainMapping(mapping),
  });
}
