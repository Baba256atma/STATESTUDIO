import { isDomainExpertisePlatformCompatibilityMatrixValid } from "./domainExpertisePlatformCompatibility.ts";
import { runDomainExpertisePlatformCertification } from "./domainExpertisePlatformCertification.ts";
import { runDomainExpertisePlatformRegression } from "./domainExpertisePlatformRegression.ts";
import {
  buildDomainExpertisePlatformManifest,
  isDomainExpertisePlatformManifestValid,
} from "./domainExpertisePlatformManifest.ts";
import {
  DOMAIN_EXPERTISE_PLATFORM_REGISTRY,
  DOMAIN_EXPERTISE_PUBLIC_API_REGISTRY,
} from "./domainExpertisePlatformFreezeRegistry.ts";
import type {
  DomainExpertisePlatformCertificationGate,
  DomainExpertisePlatformFreezeState,
} from "./domainExpertisePlatformFreezeTypes.ts";

function check(gateId: string, passed: boolean, description: string): DomainExpertisePlatformCertificationGate {
  return Object.freeze({ gateId, passed, description });
}

function isRegistryValid(): boolean {
  return (
    DOMAIN_EXPERTISE_PLATFORM_REGISTRY.length === 7 &&
    DOMAIN_EXPERTISE_PUBLIC_API_REGISTRY.length > 0 &&
    DOMAIN_EXPERTISE_PLATFORM_REGISTRY.every((entry) => entry.metadataOnly && entry.runtimeDependency === false)
  );
}

export function runDomainExpertisePlatformFreeze(): DomainExpertisePlatformFreezeState {
  const certification = runDomainExpertisePlatformCertification();
  const regression = runDomainExpertisePlatformRegression();
  const manifest = buildDomainExpertisePlatformManifest();
  const checks = Object.freeze([
    check("certification-pass", certification.status === "PASS", "DOM-8 platform certification must pass."),
    check("regression-pass", regression.status === "PASS", "DOM-8 platform regression must pass."),
    check("manifest-valid", isDomainExpertisePlatformManifestValid(manifest), "DOM-8 platform manifest must be valid."),
    check("compatibility-valid", isDomainExpertisePlatformCompatibilityMatrixValid(manifest.compatibilityMatrix), "DOM-8 compatibility matrix must be valid."),
    check("registry-valid", isRegistryValid(), "DOM-8 platform and public API registries must be valid."),
  ]);
  const status = checks.every((entry) => entry.passed) ? "PASS" : "FAIL";

  return Object.freeze({
    status,
    manifest,
    certification,
    regression,
    checks,
  });
}

export function getDomainExpertisePlatformFreezeState(): DomainExpertisePlatformFreezeState {
  return runDomainExpertisePlatformFreeze();
}
