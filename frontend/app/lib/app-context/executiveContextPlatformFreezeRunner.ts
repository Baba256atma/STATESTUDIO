import { ExecutiveContextCertificationLayer } from "./executiveContextCertificationIndex.ts";
import { isExecutiveContextPlatformCompatibilityMatrixValid } from "./executiveContextPlatformCompatibility.ts";
import {
  buildExecutiveContextPlatformFreezeManifest,
  isExecutiveContextPlatformFreezeManifestValid,
} from "./executiveContextPlatformFreezeManifest.ts";
import {
  EXECUTIVE_CONTEXT_PHASE_REGISTRY,
  EXECUTIVE_CONTEXT_PUBLIC_API_REGISTRY,
} from "./executiveContextPlatformFreezeRegistry.ts";
import type { ExecutiveContextPlatformFreezeState } from "./executiveContextPlatformFreezeTypes.ts";

let freezeState: ExecutiveContextPlatformFreezeState | null = null;

function check(checkId: string, passed: boolean, description: string) {
  return Object.freeze({ checkId, passed, description });
}

function registryValid(): boolean {
  const apiKeys = EXECUTIVE_CONTEXT_PUBLIC_API_REGISTRY.map((entry) => `${entry.phaseId}:${entry.apiName}`);
  return (
    EXECUTIVE_CONTEXT_PHASE_REGISTRY.length === 4 &&
    EXECUTIVE_CONTEXT_PUBLIC_API_REGISTRY.length > 0 &&
    new Set(apiKeys).size === apiKeys.length
  );
}

export function runExecutiveContextPlatformFreeze(): ExecutiveContextPlatformFreezeState {
  const certification = ExecutiveContextCertificationLayer.runExecutiveContextCertification();
  const regression = ExecutiveContextCertificationLayer.runExecutiveContextRegression();
  const manifest = buildExecutiveContextPlatformFreezeManifest();
  const checks = Object.freeze([
    check("certification-pass", certification.status === "PASS", "APP-CTX-3 certification must pass."),
    check("regression-pass", regression.status === "PASS", "APP-CTX regression must pass."),
    check("manifest-valid", isExecutiveContextPlatformFreezeManifestValid(manifest), "APP-CTX platform manifest must be valid."),
    check("compatibility-valid", isExecutiveContextPlatformCompatibilityMatrixValid(manifest.compatibilityMatrix), "APP-CTX compatibility matrix must be valid."),
    check("registry-valid", registryValid(), "APP-CTX phase and public API registries must be valid."),
  ]);
  const status = checks.every((entry) => entry.passed) ? "PASS" : "FAIL";

  freezeState = Object.freeze({
    status,
    manifest,
    certificationStatus: certification.status,
    regression,
    checks,
  });

  return freezeState;
}

export function getExecutiveContextPlatformFreezeState(): ExecutiveContextPlatformFreezeState {
  if (!freezeState) {
    return runExecutiveContextPlatformFreeze();
  }
  return freezeState;
}
