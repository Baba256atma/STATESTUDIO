import { getExecutiveKpiPlatformFreezeState } from "./executiveKpiPlatformFreezeIndex.ts";
import { getExecutiveOkrPlatformCompatibilityMatrix } from "./executiveOkrPlatformCompatibility.ts";
import { EXECUTIVE_OKR_ALIGNMENT_REGISTRY } from "./executiveOkrAlignmentPlatform.ts";
import { EXECUTIVE_OKR_DEFINITION_REGISTRY } from "./executiveOkrDefinitionPlatform.ts";
import { EXECUTIVE_OKR_PLATFORM_REGISTRY } from "./executiveOkrPlatform.ts";
import { buildExecutiveOkrPlatformFreezeManifest } from "./executiveOkrPlatformFreezeManifest.ts";
import {
  getExecutiveOkrPlatformExtensionPolicy,
  listExecutiveOkrPlatformDependencies,
  listExecutiveOkrPlatformPhases,
  listExecutiveOkrPlatformPublicApis,
} from "./executiveOkrPlatformFreezeRegistry.ts";
import type { ExecutiveOkrPlatformCertification, ExecutiveOkrPlatformCertificationGate } from "./executiveOkrPlatformFreezeTypes.ts";

function gate(gateId: string, gateName: string, passed: boolean, diagnostics: readonly string[] = Object.freeze([])): ExecutiveOkrPlatformCertificationGate {
  return Object.freeze({ gateId, gateName, passed, diagnostics: Object.freeze([...diagnostics]) });
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

export function runExecutiveOkrPlatformCertification(): ExecutiveOkrPlatformCertification {
  const kpiFreeze = getExecutiveKpiPlatformFreezeState();
  const phaseRegistry = listExecutiveOkrPlatformPhases();
  const publicApis = listExecutiveOkrPlatformPublicApis();
  const dependencies = listExecutiveOkrPlatformDependencies();
  const compatibility = getExecutiveOkrPlatformCompatibilityMatrix();
  const extensionPolicy = getExecutiveOkrPlatformExtensionPolicy();
  const manifest = buildExecutiveOkrPlatformFreezeManifest();
  const apiKeys = publicApis.map((api) => `${api.phaseId}:${api.apiName}`);
  const okrFoundationAvailable =
    kpiFreeze.status === "PASS" &&
    EXECUTIVE_OKR_PLATFORM_REGISTRY.publicApis.length > 0 &&
    EXECUTIVE_OKR_PLATFORM_REGISTRY.platformId === "BUS-13";
  const okrDefinitionsAvailable =
    okrFoundationAvailable &&
    EXECUTIVE_OKR_DEFINITION_REGISTRY.publicApis.length > 0 &&
    EXECUTIVE_OKR_DEFINITION_REGISTRY.platformId === "BUS-14" &&
    EXECUTIVE_OKR_DEFINITION_REGISTRY.foundationPlatformId === "BUS-13";
  const okrAlignmentAvailable =
    okrDefinitionsAvailable &&
    EXECUTIVE_OKR_ALIGNMENT_REGISTRY.publicApis.length > 0 &&
    EXECUTIVE_OKR_ALIGNMENT_REGISTRY.platformId === "BUS-15" &&
    EXECUTIVE_OKR_ALIGNMENT_REGISTRY.foundationPlatformId === "BUS-13" &&
    EXECUTIVE_OKR_ALIGNMENT_REGISTRY.definitionPlatformId === "BUS-14";
  const gates = Object.freeze([
    gate(
      "bus-availability",
      "BUS-1 through BUS-15 availability",
      kpiFreeze.status === "PASS" && okrFoundationAvailable && okrDefinitionsAvailable && okrAlignmentAvailable
    ),
    gate("platform-identity", "Platform Identity", manifest.platformIdentity.platformId === "BUS-OKR" && manifest.platformIdentity.state === "Certified Frozen Released"),
    gate("manifest", "Manifest", manifest.metadataOnly && manifest.immutable && Boolean(manifest.deterministicFingerprint)),
    gate("dependencies", "Dependencies", dependencies.length > 0 && dependencies.every((dependency) => dependency.required && dependency.metadataOnly)),
    gate("compatibility", "Compatibility", compatibility.length >= 9 && compatibility.every((entry) => entry.metadataOnly && entry.immutable)),
    gate("public-apis", "Public APIs", publicApis.length > 0 && unique(apiKeys)),
    gate("phase-registry", "Phase Registry", phaseRegistry.length === 16 && phaseRegistry.every((phase) => phase.metadataOnly && phase.immutable)),
    gate("extension-policy", "Extension Policy", extensionPolicy.requiresPublicApiConsumption && !extensionPolicy.allowsOkrExecution),
    gate("regression", "Regression", manifest.regressionEntryCount === 15),
    gate("freeze-integrity", "Freeze Integrity", manifest.releaseMetadata.freezeStatus === "Frozen" && manifest.releaseMetadata.releaseStatus === "Released"),
    gate("release-integrity", "Release Integrity", manifest.releaseMetadata.certificationStatus === "Certified"),
    gate("certification-integrity", "Certification Integrity", manifest.certificationGateCount >= 13),
    gate("no-mutable-state", "No Mutable State", Object.isFrozen(manifest) && Object.isFrozen(manifest.phaseRegistry) && Object.isFrozen(manifest.publicApiRegistry)),
    gate("no-runtime-behavior", "No Runtime Behavior", publicApis.every((api) => api.stable && api.metadataOnly)),
    gate("no-architecture-violations", "No Architecture Violations", kpiFreeze.finalState === "Certified Frozen Released"),
  ]);
  const status = gates.every((entry) => entry.passed) ? "PASS" : "FAIL";
  const diagnostics = Object.freeze(gates.filter((entry) => !entry.passed).map((entry) => entry.gateId));

  return Object.freeze({
    status,
    gates,
    diagnostics,
    metadataOnly: true,
    deterministic: true,
  });
}
