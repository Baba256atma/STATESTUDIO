import { getExecutiveKpiBusinessImpactPlatform } from "./executiveKpiBusinessImpactPlatform.ts";
import { getExecutiveKpiDefinitionPlatform } from "./executiveKpiDefinitionPlatform.ts";
import { getExecutiveKpiGovernancePlatform } from "./executiveKpiGovernancePlatform.ts";
import { getExecutiveKpiInsightPlatform } from "./executiveKpiInsightPlatform.ts";
import { getExecutiveKpiIntegrationPlatform } from "./executiveKpiIntegrationPlatform.ts";
import { getExecutiveKpiPlatform } from "./executiveKpiPlatform.ts";
import { getExecutiveKpiPlatformCompatibilityMatrix } from "./executiveKpiPlatformCompatibility.ts";
import { buildExecutiveKpiPlatformFreezeManifest } from "./executiveKpiPlatformFreezeManifest.ts";
import {
  getExecutiveKpiPlatformExtensionPolicy,
  listExecutiveKpiPlatformPhases,
  listExecutiveKpiPlatformPublicApis,
} from "./executiveKpiPlatformFreezeRegistry.ts";
import type { ExecutiveKpiPlatformCertificationGate, ExecutiveKpiPlatformCertificationResult } from "./executiveKpiPlatformFreezeTypes.ts";
import { getExecutiveKpiReportingPlatform } from "./executiveKpiReportingPlatform.ts";
import { getExecutiveKpiScorecardPlatform } from "./executiveKpiScorecardPlatform.ts";
import { getExecutiveKpiSourceMappingPlatform } from "./executiveKpiSourceMappingPlatform.ts";
import { getExecutiveKpiStrategicAlignmentPlatform } from "./executiveKpiStrategicAlignmentPlatform.ts";
import { getExecutiveKpiTargetPlatform } from "./executiveKpiTargetPlatform.ts";

function gate(gateId: string, gateName: string, passed: boolean, diagnostics: readonly string[] = Object.freeze([])): ExecutiveKpiPlatformCertificationGate {
  return Object.freeze({ gateId, gateName, passed, diagnostics: Object.freeze([...diagnostics]) });
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

export function runExecutiveKpiPlatformCertification(): ExecutiveKpiPlatformCertificationResult {
  const platforms = [
    getExecutiveKpiPlatform(),
    getExecutiveKpiDefinitionPlatform(),
    getExecutiveKpiSourceMappingPlatform(),
    getExecutiveKpiTargetPlatform(),
    getExecutiveKpiGovernancePlatform(),
    getExecutiveKpiScorecardPlatform(),
    getExecutiveKpiInsightPlatform(),
    getExecutiveKpiStrategicAlignmentPlatform(),
    getExecutiveKpiBusinessImpactPlatform(),
    getExecutiveKpiReportingPlatform(),
    getExecutiveKpiIntegrationPlatform(),
  ];
  const phases = listExecutiveKpiPlatformPhases();
  const publicApis = listExecutiveKpiPlatformPublicApis();
  const manifest = buildExecutiveKpiPlatformFreezeManifest();
  const compatibility = getExecutiveKpiPlatformCompatibilityMatrix();
  const extensionPolicy = getExecutiveKpiPlatformExtensionPolicy();
  const integration = getExecutiveKpiIntegrationPlatform();
  const apiKeys = publicApis.map((api) => `${api.phaseId}:${api.apiName}`);
  const gates = Object.freeze([
    gate("bus-availability", "BUS-1 through BUS-11 availability", platforms.every((platform) => platform.validation.valid)),
    gate("phase-registry", "Phase registry completeness", phases.length === 12 && phases.every((phase) => phase.metadataOnly && phase.immutable)),
    gate("public-api-registry", "Public API registry completeness", publicApis.length > 0 && unique(apiKeys)),
    gate("manifest", "Manifest completeness", manifest.metadataOnly && manifest.immutable && Boolean(manifest.deterministicFingerprint)),
    gate("dependency-map", "Dependency map completeness", integration.registry.dependencies.length === 10),
    gate("compatibility-matrix", "Compatibility matrix completeness", compatibility.length >= integration.compatibilityMatrix.length),
    gate("consumer-registry", "Consumer registry completeness", integration.registry.consumers.length > 0),
    gate("immutability", "Immutability declaration", manifest.platformIdentity.immutable && manifest.releaseMetadata.immutable),
    gate("extension-policy", "Extension policy", extensionPolicy.requiresPublicApiConsumption && !extensionPolicy.allowsKpiComputation),
    gate("release-metadata", "Release metadata", manifest.releaseMetadata.certificationStatus === "Certified" && manifest.releaseMetadata.releaseStatus === "Released"),
    gate("freeze-declaration", "Freeze declaration", manifest.platformIdentity.state === "Certified Frozen Released"),
  ]);
  const status = gates.every((entry) => entry.passed) ? "PASS" : "FAIL";
  const diagnostics = Object.freeze(gates.filter((entry) => !entry.passed).map((entry) => entry.gateId));

  return Object.freeze({ status, gates, diagnostics, metadataOnly: true, deterministic: true });
}
