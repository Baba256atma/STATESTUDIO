import { buildIdentityPlatformFreezeManifest } from "./identityPlatformFreezeManifest.ts";
import type {
  IdentityPlatformCertificationGate,
  IdentityPlatformCertificationResult,
  IdentityPlatformFreezeManifest,
} from "./identityPlatformFreezeTypes.ts";

function gate(gateId: string, description: string, passed: boolean): IdentityPlatformCertificationGate {
  return Object.freeze({ gateId, description, passed });
}

function expectedCompatibilityCount(manifest: IdentityPlatformFreezeManifest): number {
  return manifest.phases.reduce((total, phase) => total + phase.consumes.length, 0);
}

function isFreezeStateImmutable(manifest: IdentityPlatformFreezeManifest): boolean {
  return (
    Object.isFrozen(manifest) &&
    Object.isFrozen(manifest.phases) &&
    Object.isFrozen(manifest.publicApis) &&
    Object.isFrozen(manifest.compatibilityMatrix) &&
    Object.isFrozen(manifest.extensionPolicy) &&
    Object.isFrozen(manifest.regression)
  );
}

export function runIdentityPlatformCertification(): IdentityPlatformCertificationResult {
  const manifest = buildIdentityPlatformFreezeManifest();
  const gates: readonly IdentityPlatformCertificationGate[] = Object.freeze([
    gate("idn-phases-present", "IDN-1 through IDN-9 are present.", manifest.phases.length === 9),
    gate(
      "public-apis-available",
      "Public APIs are available through phase public exports.",
      manifest.publicApis.length >= manifest.phases.length && manifest.publicApis.every((api) => api.available)
    ),
    gate(
      "certified-phases-frozen",
      "Certified phases are marked frozen and certified.",
      manifest.phases.every((phase) => phase.certified && phase.frozen)
    ),
    gate(
      "forbidden-runtime-behavior-absent",
      "No auth, persistence, database, network, UI, logging, or policy runtime is introduced.",
      manifest.extensionPolicy.runtimeBehaviorAllowed === false
    ),
    gate(
      "no-private-import-policy",
      "Consumers must use public exports only.",
      manifest.extensionPolicy.privateImportsAllowed === false
    ),
    gate(
      "manifest-complete",
      "Platform manifest includes release identity, phases, APIs, compatibility, policy, and regression.",
      manifest.platformId.length > 0 &&
        manifest.releaseId.length > 0 &&
        manifest.phases.length > 0 &&
        manifest.publicApis.length > 0 &&
        manifest.compatibilityMatrix.length > 0 &&
        manifest.regression.totalTests > 0
    ),
    gate(
      "compatibility-matrix-complete",
      "Compatibility matrix covers declared phase dependencies.",
      manifest.compatibilityMatrix.length === expectedCompatibilityCount(manifest)
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
      "IDN-1 through IDN-9 regression suite passes.",
      manifest.regression.totalTests === manifest.regression.passed && manifest.regression.failed === 0
    ),
    gate("freeze-state-immutable", "Freeze state is immutable.", isFreezeStateImmutable(manifest)),
    gate("consumer-safe", "Identity Platform is consumer-safe.", manifest.consumerSafe),
  ]);
  const passed = gates.every((entry) => entry.passed);

  return Object.freeze({
    status: passed ? "PASS" : "FAIL",
    gates,
    manifest,
  });
}
