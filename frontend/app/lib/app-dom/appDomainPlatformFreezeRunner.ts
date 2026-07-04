import { isAppDomainPlatformCompatibilityMatrixValid } from "./appDomainPlatformCompatibility.ts";
import { runAppDomainPlatformCertification } from "./appDomainPlatformCertification.ts";
import { runAppDomainPlatformRegression } from "./appDomainPlatformRegression.ts";
import {
  buildAppDomainPlatformManifest,
  isAppDomainPlatformManifestValid,
} from "./appDomainPlatformManifest.ts";
import {
  APP_DOMAIN_PHASE_REGISTRY,
  APP_DOMAIN_PUBLIC_API_REGISTRY,
} from "./appDomainPlatformFreezeRegistry.ts";
import type {
  AppDomainPlatformCertificationGate,
  AppDomainPlatformFreezeState,
} from "./appDomainPlatformFreezeTypes.ts";

let freezeState: AppDomainPlatformFreezeState | null = null;

function check(gateId: string, passed: boolean, description: string): AppDomainPlatformCertificationGate {
  return Object.freeze({ gateId, passed, description });
}

function isRegistryValid(): boolean {
  return APP_DOMAIN_PHASE_REGISTRY.length === 4 && APP_DOMAIN_PUBLIC_API_REGISTRY.length > 0;
}

export function runAppDomainPlatformFreeze(): AppDomainPlatformFreezeState {
  const certification = runAppDomainPlatformCertification();
  const regression = runAppDomainPlatformRegression();
  const manifest = buildAppDomainPlatformManifest();
  const checks = Object.freeze([
    check("certification-pass", certification.status === "PASS", "APP-DOM platform certification must pass."),
    check("regression-pass", regression.status === "PASS", "APP-DOM platform regression must pass."),
    check("manifest-valid", isAppDomainPlatformManifestValid(manifest), "APP-DOM platform manifest must be valid."),
    check("compatibility-valid", isAppDomainPlatformCompatibilityMatrixValid(manifest.compatibilityMatrix), "APP-DOM compatibility matrix must be valid."),
    check("registry-valid", isRegistryValid(), "APP-DOM registry must be valid."),
  ]);
  const status = checks.every((entry) => entry.passed) ? "PASS" : "FAIL";

  freezeState = Object.freeze({
    status,
    manifest,
    certification,
    regression,
    checks,
  });

  return freezeState;
}

export function getAppDomainPlatformFreezeState(): AppDomainPlatformFreezeState {
  if (!freezeState) {
    return runAppDomainPlatformFreeze();
  }
  return freezeState;
}
