import { DomainExpertisePlatformFreeze } from "../dom/domainExpertisePlatformFreezeIndex.ts";
import {
  APP_DOMAIN_BRIDGE_IDENTITY,
  APP_DOMAIN_CONSUMED_PLATFORM,
} from "./appDomainBridgeRegistry.ts";
import type {
  AppDomainBridge,
  AppDomainBridgeState,
  AppDomainBridgeValidation,
  AppDomainCapability,
  AppDomainCompatibilityResult,
  AppDomainPlatformInfo,
  AppDomainRegistrySnapshot,
} from "./appDomainBridgeTypes.ts";

function validationResult(issues: AppDomainBridgeValidation["issues"]): AppDomainBridgeValidation {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

export function getDomainPlatformInfo(): AppDomainPlatformInfo {
  const manifest = DomainExpertisePlatformFreeze.buildDomainExpertisePlatformManifest();
  return Object.freeze({
    platformId: manifest.platformIdentity.platformId,
    platformName: manifest.platformIdentity.platformName,
    layerId: manifest.platformIdentity.layerId,
    version: manifest.platformIdentity.version,
    releaseStage: manifest.platformIdentity.releaseStage,
    metadataOnly: manifest.platformIdentity.metadataOnly,
    runtimeBehavior: manifest.platformIdentity.runtimeBehavior,
  });
}

export function getDomainPlatformCapabilities(): readonly AppDomainCapability[] {
  return Object.freeze(
    DomainExpertisePlatformFreeze.listDomainExpertisePlatformPublicApis().map((entry) =>
      Object.freeze({
        capabilityId: `${entry.sourcePlatform}:${entry.apiName}`,
        name: entry.apiName,
        sourcePlatform: entry.sourcePlatform,
        category: entry.category,
        metadataOnly: true as const,
      })
    )
  );
}

export function getDomainPlatformRegistry(): AppDomainRegistrySnapshot {
  const platforms = DomainExpertisePlatformFreeze.listDomainExpertisePlatformRegistry();
  const phases = DomainExpertisePlatformFreeze.listDomainExpertisePlatformPhases();
  const publicApiCount = DomainExpertisePlatformFreeze.listDomainExpertisePlatformPublicApis().length;

  return Object.freeze({
    platformCount: platforms.length,
    phaseCount: phases.length,
    publicApiCount,
    platforms: Object.freeze(
      platforms.map((entry) =>
        Object.freeze({
          platformId: entry.platformId,
          platformName: entry.platformName,
          publicFacade: entry.publicFacade,
          certification: entry.certification,
          metadataOnly: entry.metadataOnly,
        })
      )
    ),
    phases: Object.freeze(
      phases.map((entry) =>
        Object.freeze({
          phaseId: entry.phaseId,
          title: entry.title,
          status: entry.status,
          order: entry.order,
          metadataOnly: entry.metadataOnly,
        })
      )
    ),
  });
}

export function getAvailableDomains(): readonly string[] {
  return Object.freeze(getDomainPlatformRegistry().platforms.map((entry) => entry.platformId));
}

export function isDomainPlatformCompatible(): AppDomainCompatibilityResult {
  const platformInfo = getDomainPlatformInfo();
  const diagnostics: string[] = [];
  if (platformInfo.platformId !== APP_DOMAIN_CONSUMED_PLATFORM.expectedPlatformId) {
    diagnostics.push("DOM platform id does not match APP-DOM bridge expectation.");
  }
  if (platformInfo.version !== APP_DOMAIN_CONSUMED_PLATFORM.supportedPlatformVersion) {
    diagnostics.push("DOM platform version does not match APP-DOM bridge support.");
  }
  if (!platformInfo.metadataOnly || platformInfo.runtimeBehavior) {
    diagnostics.push("DOM platform must remain metadata-only with no runtime behavior.");
  }
  if (DomainExpertisePlatformFreeze.runDomainExpertisePlatformFreeze().status !== "PASS") {
    diagnostics.push("DOM platform freeze state must pass.");
  }

  return Object.freeze({
    compatible: diagnostics.length === 0,
    expectedPlatformId: APP_DOMAIN_CONSUMED_PLATFORM.expectedPlatformId,
    actualPlatformId: platformInfo.platformId,
    expectedVersion: APP_DOMAIN_CONSUMED_PLATFORM.supportedPlatformVersion,
    actualVersion: platformInfo.version,
    diagnostics: Object.freeze(diagnostics),
  });
}

export function validateAppDomainBridge(bridge: AppDomainBridge): AppDomainBridgeValidation {
  const issues: AppDomainBridgeValidation["issues"][number][] = [];
  if (bridge.bridgeId !== APP_DOMAIN_BRIDGE_IDENTITY.bridgeId) {
    issues.push(Object.freeze({ code: "invalid_bridge_id", message: "Bridge id must be app-dom-bridge." }));
  }
  if (!bridge.state.compatibility.compatible) {
    issues.push(Object.freeze({ code: "incompatible_domain_platform", message: "DOM platform compatibility failed." }));
  }
  if (bridge.state.registrySnapshot.platformCount === 0) {
    issues.push(Object.freeze({ code: "empty_domain_registry", message: "DOM platform registry must not be empty." }));
  }
  if (!bridge.state.metadataOnly || !bridge.state.immutable) {
    issues.push(Object.freeze({ code: "invalid_bridge_boundary", message: "APP-DOM bridge must be immutable metadata only." }));
  }
  return validationResult(issues);
}

export function createAppDomainBridge(): AppDomainBridge {
  const compatibility = isDomainPlatformCompatible();
  const state: AppDomainBridgeState = Object.freeze({
    bridgeId: "app-dom-bridge",
    appLayerId: "APP",
    consumedLayerId: "DOM",
    status: compatibility.compatible ? "ready" : "incompatible",
    platformInfo: getDomainPlatformInfo(),
    compatibility,
    capabilities: getDomainPlatformCapabilities(),
    registrySnapshot: getDomainPlatformRegistry(),
    immutable: true,
    metadataOnly: true,
  });

  return Object.freeze({
    bridgeId: "app-dom-bridge",
    state,
  });
}
