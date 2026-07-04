import { AppDomainBridge } from "./appDomainBridgeIndex.ts";
import { AppDomainMappingLayer } from "./appDomainMappingIndex.ts";
import { AppDomainContextLayer } from "./appDomainContextIndex.ts";
import { isAppDomainPlatformCompatibilityMatrixValid } from "./appDomainPlatformCompatibility.ts";
import {
  APP_DOMAIN_EXTENSION_POLICY,
  APP_DOMAIN_PHASE_REGISTRY,
  APP_DOMAIN_PUBLIC_API_REGISTRY,
} from "./appDomainPlatformFreezeRegistry.ts";
import {
  buildAppDomainPlatformManifest,
  isAppDomainPlatformManifestValid,
} from "./appDomainPlatformManifest.ts";
import type {
  AppDomainPlatformCertificationDiagnostic,
  AppDomainPlatformCertificationGate,
  AppDomainPlatformCertificationResult,
} from "./appDomainPlatformFreezeTypes.ts";

function gate(gateId: string, description: string, passed: boolean): AppDomainPlatformCertificationGate {
  return Object.freeze({ gateId, description, passed });
}

function diagnosticFromGate(gateResult: AppDomainPlatformCertificationGate): AppDomainPlatformCertificationDiagnostic {
  return Object.freeze({
    code: gateResult.passed ? "certification_gate_passed" : "certification_gate_failed",
    message: gateResult.description,
    gateId: gateResult.gateId,
    severity: gateResult.passed ? "info" : "error",
  });
}

function isRegistryValid(): boolean {
  const phaseIds = APP_DOMAIN_PHASE_REGISTRY.map((entry) => entry.phaseId);
  return APP_DOMAIN_PHASE_REGISTRY.length === 4 && new Set(phaseIds).size === phaseIds.length && APP_DOMAIN_PHASE_REGISTRY.every((entry) => entry.metadataOnly);
}

function isPublicApiRegistryValid(): boolean {
  const apiKeys = APP_DOMAIN_PUBLIC_API_REGISTRY.map((entry) => `${entry.phaseId}:${entry.apiName}`);
  return APP_DOMAIN_PUBLIC_API_REGISTRY.length > 0 && new Set(apiKeys).size === apiKeys.length && APP_DOMAIN_PUBLIC_API_REGISTRY.every((entry) => entry.stable && entry.metadataOnly);
}

function isExtensionPolicyValid(): boolean {
  return (
    APP_DOMAIN_EXTENSION_POLICY.allowsNewConsumerUtilities &&
    !APP_DOMAIN_EXTENSION_POLICY.allowsExecutiveReasoning &&
    !APP_DOMAIN_EXTENSION_POLICY.allowsRecommendations &&
    !APP_DOMAIN_EXTENSION_POLICY.allowsInference &&
    !APP_DOMAIN_EXTENSION_POLICY.allowsRuntimeExecution &&
    !APP_DOMAIN_EXTENSION_POLICY.allowsRuntimeMutation &&
    !APP_DOMAIN_EXTENSION_POLICY.allowsDomainMutations
  );
}

export function runAppDomainPlatformCertification(): AppDomainPlatformCertificationResult {
  const manifest = buildAppDomainPlatformManifest();
  const secondManifest = buildAppDomainPlatformManifest();
  const gates = Object.freeze([
    gate("app-dom-1-pass", "APP-DOM-1 bridge validates.", AppDomainBridge.validateAppDomainBridge(AppDomainBridge.createAppDomainBridge()).valid),
    gate("app-dom-2-pass", "APP-DOM-2 mapping validates.", AppDomainMappingLayer.buildAppDomainMapping().validation.valid),
    gate("app-dom-3-pass", "APP-DOM-3 context validates.", AppDomainContextLayer.validateDomainContext(AppDomainContextLayer.createDomainContext()).valid),
    gate("manifest-valid", "APP-DOM platform manifest is valid.", isAppDomainPlatformManifestValid(manifest)),
    gate("registry-valid", "APP-DOM phase registry is valid.", isRegistryValid()),
    gate("compatibility-matrix-valid", "APP-DOM compatibility matrix is valid.", isAppDomainPlatformCompatibilityMatrixValid(manifest.compatibilityMatrix)),
    gate("public-api-registry-valid", "APP-DOM public API registry is valid.", isPublicApiRegistryValid()),
    gate("extension-policy-valid", "APP-DOM extension policy is metadata-only.", isExtensionPolicyValid()),
    gate("deterministic-reproducibility", "APP-DOM manifest generation is deterministic.", manifest.fingerprint === secondManifest.fingerprint),
    gate("metadata-only-boundary", "APP-DOM freeze introduces no runtime behavior.", manifest.metadataOnly && !manifest.platformIdentity.runtimeBehavior),
  ]);
  const status = gates.every((entry) => entry.passed) ? "PASS" : "FAIL";

  return Object.freeze({
    status,
    gates,
    diagnostics: Object.freeze(gates.map(diagnosticFromGate)),
    manifest,
  });
}
