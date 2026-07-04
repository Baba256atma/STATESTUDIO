import { ExecutiveReasoningCertificationLayer } from "./executiveReasoningCertificationIndex.ts";
import { isExecutiveReasoningPlatformCompatibilityMatrixValid } from "./executiveReasoningPlatformCompatibility.ts";
import {
  buildExecutiveReasoningPlatformFreezeManifest,
  isExecutiveReasoningPlatformFreezeManifestValid,
} from "./executiveReasoningPlatformFreezeManifest.ts";
import {
  EXECUTIVE_REASONING_PHASE_REGISTRY,
  EXECUTIVE_REASONING_PUBLIC_API_REGISTRY,
} from "./executiveReasoningPlatformFreezeRegistry.ts";
import type { ExecutiveReasoningPlatformFreezeState } from "./executiveReasoningPlatformFreezeTypes.ts";

let freezeState: ExecutiveReasoningPlatformFreezeState | null = null;

function check(checkId: string, passed: boolean, description: string) {
  return Object.freeze({ checkId, passed, description });
}

function registryValid(): boolean {
  const apiKeys = EXECUTIVE_REASONING_PUBLIC_API_REGISTRY.map((entry) => `${entry.phaseId}:${entry.apiName}`);
  return (
    EXECUTIVE_REASONING_PHASE_REGISTRY.length === 4 &&
    EXECUTIVE_REASONING_PUBLIC_API_REGISTRY.length > 0 &&
    new Set(apiKeys).size === apiKeys.length
  );
}

export function runExecutiveReasoningPlatformFreeze(): ExecutiveReasoningPlatformFreezeState {
  const certification = ExecutiveReasoningCertificationLayer.runExecutiveReasoningCertification();
  const regression = ExecutiveReasoningCertificationLayer.runExecutiveReasoningRegression();
  const manifest = buildExecutiveReasoningPlatformFreezeManifest();
  const checks = Object.freeze([
    check("certification-pass", certification.status === "PASS", "APP-REASON-3 certification must pass."),
    check("regression-pass", regression.status === "PASS", "APP-REASON regression must pass."),
    check("manifest-valid", isExecutiveReasoningPlatformFreezeManifestValid(manifest), "APP-REASON platform manifest must be valid."),
    check("compatibility-valid", isExecutiveReasoningPlatformCompatibilityMatrixValid(manifest.compatibilityMatrix), "APP-REASON compatibility matrix must be valid."),
    check("registry-valid", registryValid(), "APP-REASON phase and public API registries must be valid."),
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

export function getExecutiveReasoningPlatformFreezeState(): ExecutiveReasoningPlatformFreezeState {
  if (!freezeState) {
    return runExecutiveReasoningPlatformFreeze();
  }
  return freezeState;
}
