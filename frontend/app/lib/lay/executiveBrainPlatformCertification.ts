import { buildExecutiveBrainPlatformFreezeManifest } from "./executiveBrainPlatformFreezeManifest.ts";
import {
  listExecutiveBrainPhases,
  listExecutiveBrainPlatformCapabilities,
  listExecutiveBrainPlatformPublicApis,
} from "./executiveBrainPlatformFreezeRegistry.ts";
import type {
  ExecutiveBrainCertificationResult,
  ExecutiveBrainPlatformCertificationGate,
  ExecutiveBrainPlatformManifest,
} from "./executiveBrainPlatformFreezeTypes.ts";

function gate(gateId: string, description: string, passed: boolean): ExecutiveBrainPlatformCertificationGate {
  return Object.freeze({ gateId, description, passed });
}

function expectedPhaseCompatibilityCount(manifest: ExecutiveBrainPlatformManifest): number {
  return manifest.phases.reduce((total, phase) => total + phase.consumes.length, 0);
}

function isManifestImmutable(manifest: ExecutiveBrainPlatformManifest): boolean {
  return (
    Object.isFrozen(manifest) &&
    Object.isFrozen(manifest.phases) &&
    Object.isFrozen(manifest.publicApis) &&
    Object.isFrozen(manifest.capabilities) &&
    Object.isFrozen(manifest.compatibility) &&
    Object.isFrozen(manifest.compatibility.phaseEntries) &&
    Object.isFrozen(manifest.compatibility.layerEntries) &&
    Object.isFrozen(manifest.extensionPolicy) &&
    Object.isFrozen(manifest.regression) &&
    Object.isFrozen(manifest.releaseMetadata)
  );
}

function hasUniquePhaseIds(): boolean {
  const phases = listExecutiveBrainPhases();
  const ids = phases.map((phase) => phase.phaseId);
  return new Set(ids).size === ids.length;
}

function hasUniquePublicApiNames(): boolean {
  const apis = listExecutiveBrainPlatformPublicApis();
  const keys = apis.map((api) => `${api.phaseId}:${api.apiName}`);
  return new Set(keys).size === keys.length;
}

function hasUniqueCapabilityIds(): boolean {
  const capabilities = listExecutiveBrainPlatformCapabilities();
  const ids = capabilities.map((capability) => capability.capabilityId);
  return new Set(ids).size === ids.length;
}

export function runExecutiveBrainPlatformCertification(): ExecutiveBrainCertificationResult {
  const manifest = buildExecutiveBrainPlatformFreezeManifest();
  const lay11Phases = manifest.phases.filter((phase) => phase.phaseId !== "LAY-12");
  const gates: readonly ExecutiveBrainPlatformCertificationGate[] = Object.freeze([
    gate(
      "platform-identity",
      "Platform identity, release version, and layer identity are declared.",
      manifest.releaseMetadata.platformId === "nexora-executive-brain-platform" &&
        manifest.releaseMetadata.releaseVersion === "LAY-12" &&
        manifest.releaseMetadata.layerIdentity === "LAY"
    ),
    gate(
      "lay-phases-present",
      "LAY-1 through LAY-12 are present in the phase registry.",
      manifest.phases.length === 12 &&
        manifest.phases[0]?.phaseId === "LAY-1" &&
        manifest.phases[11]?.phaseId === "LAY-12"
    ),
    gate(
      "lay-1-through-lay-11-certified",
      "LAY-1 through LAY-11 certification dependencies are satisfied.",
      lay11Phases.length === 11 && lay11Phases.every((phase) => phase.certified && phase.frozen)
    ),
    gate(
      "public-apis-available",
      "Public APIs are available through phase public exports.",
      manifest.publicApis.length >= manifest.phases.length && manifest.publicApis.every((api) => api.available)
    ),
    gate(
      "capability-registry-complete",
      "Capability registry covers LAY-2 through LAY-12 capabilities.",
      manifest.capabilities.length === 11 && manifest.capabilities.every((capability) => capability.certified)
    ),
    gate(
      "certified-phases-frozen",
      "Certified phases are marked frozen and certified.",
      manifest.phases.every((phase) => phase.certified && phase.frozen)
    ),
    gate(
      "forbidden-runtime-behavior-absent",
      "No runtime intelligence, LLM calls, or platform state mutation is introduced.",
      manifest.extensionPolicy.runtimeBehaviorAllowed === false &&
        manifest.releaseMetadata.runtimeIntelligence === false &&
        manifest.releaseMetadata.metadataOnly === true
    ),
    gate(
      "no-private-import-policy",
      "Consumers must use public exports only.",
      manifest.extensionPolicy.privateImportsAllowed === false
    ),
    gate(
      "manifest-complete",
      "Platform manifest includes release identity, phases, APIs, capabilities, compatibility, policy, and regression.",
      manifest.releaseMetadata.releaseId.length > 0 &&
        manifest.phases.length > 0 &&
        manifest.publicApis.length > 0 &&
        manifest.capabilities.length > 0 &&
        manifest.compatibility.entryCount > 0 &&
        manifest.regression.totalTests > 0
    ),
    gate(
      "compatibility-matrix-complete",
      "Compatibility matrix covers declared phase dependencies and upstream layers.",
      manifest.compatibility.validationResult === "valid" &&
        manifest.compatibility.phaseEntries.length === expectedPhaseCompatibilityCount(manifest)
    ),
    gate(
      "extension-policy-explicit",
      "Extension policy is explicit and additive-only.",
      manifest.extensionPolicy.extensionMode === "additive-only" &&
        manifest.extensionPolicy.breakingChangesAllowed === false &&
        manifest.extensionPolicy.requiresNewPhase === true
    ),
    gate(
      "regression-suite-passes",
      "LAY-1 through LAY-11 regression suite passes.",
      manifest.regression.totalTests === manifest.regression.passed && manifest.regression.failed === 0
    ),
    gate(
      "registry-uniqueness",
      "Phase, public API, and capability registries are unique.",
      hasUniquePhaseIds() && hasUniquePublicApiNames() && hasUniqueCapabilityIds()
    ),
    gate("manifest-immutable", "Freeze manifest is immutable.", isManifestImmutable(manifest)),
    gate(
      "deterministic-behavior",
      "Regression and certification metadata are deterministic.",
      manifest.regression.deterministic === true
    ),
    gate(
      "contract-integrity",
      "All phase compatibility entries use public export contracts.",
      manifest.compatibility.phaseEntries.every((entry) => entry.contract === "public-exports" && entry.compatible)
    ),
    gate(
      "release-readiness",
      "Executive Brain Platform is consumer-safe and release-ready.",
      manifest.consumerSafe && manifest.certificationState === "certified"
    ),
  ]);
  const passed = gates.every((entry) => entry.passed);

  return Object.freeze({
    status: passed ? "PASS" : "FAIL",
    gates,
    manifest,
  });
}
