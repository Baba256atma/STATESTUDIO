/**
 * APP-4:14 — Executive Memory Platform Freeze certification.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

import { EXECUTIVE_MEMORY_FREEZE_RULES } from "./executiveMemoryContracts.ts";
import {
  EXECUTIVE_MEMORY_PLATFORM_FREEZE_DOCUMENTATION_FILES,
  EXECUTIVE_MEMORY_PLATFORM_FREEZE_TAGS,
} from "./executiveMemoryPlatformFreezeConstants.ts";
import { buildExecutiveMemoryPlatformFreezeManifest } from "./executiveMemoryPlatformFreezeManifest.ts";
import {
  buildExecutiveMemoryPlatformCompatibilityRegistry,
  buildExecutiveMemoryPlatformContractRegistry,
  buildExecutiveMemoryPlatformExtensionRegistry,
  buildExecutiveMemoryPlatformPublicApiRegistry,
  buildExecutiveMemoryPlatformRegistry,
} from "./executiveMemoryPlatformFreezeRegistry.ts";
import {
  runExecutiveMemoryPlatformCertification,
} from "./executiveMemoryPlatformCertification.ts";
import { runExecutiveMemoryPlatformRegression } from "./executiveMemoryPlatformRegression.ts";
import type {
  ExecutiveMemoryPlatformFreezeCertificationResult,
  ExecutiveMemoryPlatformFreezeCheck,
} from "./executiveMemoryPlatformFreezeTypes.ts";

const REPO_ROOT = join(process.cwd(), "..");

function nowIso(): string {
  return new Date().toISOString();
}

function check(id: string, title: string, passed: boolean, evidence: string): ExecutiveMemoryPlatformFreezeCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function allDocumentationPresent(): boolean {
  return EXECUTIVE_MEMORY_PLATFORM_FREEZE_DOCUMENTATION_FILES.every((filePath) =>
    existsSync(join(REPO_ROOT, filePath))
  );
}

export function runExecutiveMemoryPlatformFreezeCertification(): ExecutiveMemoryPlatformFreezeCertificationResult {
  const generatedAt = nowIso();
  const regression = runExecutiveMemoryPlatformRegression();
  const priorCertification = runExecutiveMemoryPlatformCertification();
  const manifest = buildExecutiveMemoryPlatformFreezeManifest(generatedAt);
  const reportPath = join(REPO_ROOT, "docs/app-4-14-executive-memory-platform-freeze-report.md");

  const platformRegistry = buildExecutiveMemoryPlatformRegistry();
  const publicApiRegistry = buildExecutiveMemoryPlatformPublicApiRegistry();
  const contractRegistry = buildExecutiveMemoryPlatformContractRegistry();
  const compatibilityRegistry = buildExecutiveMemoryPlatformCompatibilityRegistry();
  const extensionRegistry = buildExecutiveMemoryPlatformExtensionRegistry();

  const checks: ExecutiveMemoryPlatformFreezeCheck[] = [
    check("FM-1", "Immutable freeze manifest", Object.isFrozen(manifest) && manifest.platformMetadata.architectureHash.startsWith("arch-"), manifest.platformMetadata.architectureHash),
    check("FM-2", "Platform registry complete", platformRegistry.length === 13, String(platformRegistry.length)),
    check("FM-3", "Public API registry frozen", publicApiRegistry.length >= 20, String(publicApiRegistry.length)),
    check("FM-4", "Contract registry frozen", contractRegistry.length === 13, String(contractRegistry.length)),
    check("FM-5", "Compatibility registry present", compatibilityRegistry.length >= 5, String(compatibilityRegistry.length)),
    check("FM-6", "Extension registry registered", extensionRegistry.length >= 6, String(extensionRegistry.length)),
    check("FM-7", "Final regression APP-4:1 through APP-4:12", regression.certified, regression.summary),
    check("FM-8", "Prior certification APP-4:13", priorCertification.certified, priorCertification.summary),
    check("FM-9", "Platform status CERTIFIED", manifest.platformStatus.certified === "CERTIFIED", manifest.platformStatus.certified),
    check("FM-10", "Platform status FROZEN", manifest.platformStatus.frozen === "FROZEN", manifest.platformStatus.frozen),
    check("FM-11", "Platform status RELEASED", manifest.platformStatus.released === "RELEASED", manifest.platformStatus.released),
    check("FM-12", "Extend-only freeze policy", EXECUTIVE_MEMORY_FREEZE_RULES.publicInterfacesExtendOnly === true, "Extend-only."),
    check("FM-13", "Documentation complete", allDocumentationPresent(), String(EXECUTIVE_MEMORY_PLATFORM_FREEZE_DOCUMENTATION_FILES.length)),
    check("FM-14", "Freeze report generated", existsSync(reportPath), reportPath),
    check("FM-15", "Official release declaration", regression.certified && priorCertification.certified && manifest.releaseTag.length > 0, manifest.releaseTag),
  ];

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-4:14 Executive Memory Platform Freeze",
    status: certified ? "PASS" : "FAIL",
    certified,
    frozen: certified,
    released: certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    summary: certified
      ? "APP-4:14 Executive Memory Platform CERTIFIED, FROZEN, and RELEASED."
      : `APP-4:14 Executive Memory Platform freeze FAILED (${failedChecks.length} gate(s)).`,
    generatedAt,
    manifest,
    regressionStatus: regression.status,
    priorCertificationStatus: priorCertification.status,
    tags: EXECUTIVE_MEMORY_PLATFORM_FREEZE_TAGS,
    readOnly: true as const,
  });
}

export const ExecutiveMemoryPlatformFreezeCertification = Object.freeze({
  runExecutiveMemoryPlatformFreezeCertification,
});
