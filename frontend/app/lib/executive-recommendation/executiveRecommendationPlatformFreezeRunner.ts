/**
 * APP-12:9 — Executive Recommendation Platform Freeze runner.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { certifyExecutiveRecommendationPlatform } from "./executiveRecommendationPlatformCertification.ts";
import { buildExecutiveRecommendationPlatformFreezeManifest } from "./executiveRecommendationPlatformFreezeManifest.ts";
import type { ExecutiveRecommendationPlatformFreezeManifest } from "./executiveRecommendationPlatformFreezeManifest.ts";
import {
  EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_PLATFORM_RELEASE_TAG,
  registerExecutiveRecommendationPlatformFreezeManifest,
  resetExecutiveRecommendationPlatformFreezeRegistryForTests,
} from "./executiveRecommendationPlatformFreezeRegistry.ts";
import { validateExecutiveRecommendationPlatformFreeze } from "./executiveRecommendationPlatformFreezeValidation.ts";
import type {
  ExecutiveRecommendationPlatformFreezeCertificationDependency,
  ExecutiveRecommendationPlatformFreezeCheck,
  ExecutiveRecommendationPlatformFreezeRunResult,
} from "./executiveRecommendationPlatformFreezeTypes.ts";

let lastFreezeResult: ExecutiveRecommendationPlatformFreezeRunResult | null = null;

function check(id: string, title: string, passed: boolean, evidence: string): ExecutiveRecommendationPlatformFreezeCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readModule(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function verifyFreezeModuleClean(pattern: RegExp, label: string): ExecutiveRecommendationPlatformFreezeCheck {
  const sources = [
    readModule("app/lib/executive-recommendation/executiveRecommendationPlatformFreeze.ts"),
    readModule("app/lib/executive-recommendation/executiveRecommendationPlatformFreezeCompatibility.ts"),
    readModule("app/lib/executive-recommendation/executiveRecommendationPlatformFreezeTypes.ts"),
  ].join("\n");
  const passed = !pattern.test(sources);
  return check(`no_${label}`, `No ${label} logic`, passed, passed ? "freeze modules clean" : `${label} pattern detected`);
}

function toCertificationDependency(
  certification: ReturnType<typeof certifyExecutiveRecommendationPlatform>
): ExecutiveRecommendationPlatformFreezeCertificationDependency {
  return Object.freeze({
    certified: certification.certified,
    readyForFreeze: certification.readyForFreeze,
    report: certification.report,
    readOnly: true as const,
  });
}

function buildFreezeChecks(
  certification: ExecutiveRecommendationPlatformFreezeCertificationDependency,
  manifest: ExecutiveRecommendationPlatformFreezeManifest | null,
  validation: ReturnType<typeof validateExecutiveRecommendationPlatformFreeze>
): readonly ExecutiveRecommendationPlatformFreezeCheck[] {
  return Object.freeze([
    check(
      "A_certification_pass",
      "APP-12:8 certification PASS",
      certification.certified === true && certification.report.certified === true,
      certification.certified ? "PASS" : "FAIL"
    ),
    check(
      "B_ready_for_freeze",
      "readyForFreeze true",
      certification.readyForFreeze === true,
      String(certification.readyForFreeze)
    ),
    check(
      "C_manifest_valid",
      "Freeze manifest valid",
      validation.manifestPass === true,
      validation.checks.find((entry) => entry.id === "manifest_valid")?.evidence ?? "invalid"
    ),
    check(
      "D_release_identity_valid",
      "Release identity valid",
      manifest?.appId === "APP-12" && manifest?.releaseVersion === "APP-12",
      manifest?.releaseVersion ?? "missing"
    ),
    check(
      "E_phases_registered",
      "Certified phases registered",
      validation.registryPass === true && (manifest?.certifiedPhases.length ?? 0) === 9,
      String(manifest?.certifiedPhases.length ?? 0)
    ),
    check(
      "F_public_apis_registered",
      "Public APIs registered",
      (manifest?.publicApis.length ?? 0) >= 45,
      String(manifest?.publicApis.length ?? 0)
    ),
    check(
      "G_consumers_registered",
      "Consumers registered",
      (manifest?.consumers.length ?? 0) === 4,
      String(manifest?.consumers.length ?? 0)
    ),
    check(
      "H_compatibility_matrix_valid",
      "Compatibility matrix valid",
      validation.compatibilityPass === true,
      manifest?.compatibilityMatrix.compatibilityVersion ?? "missing"
    ),
    check(
      "I_extension_policy_valid",
      "Extension policy valid",
      manifest?.extensionPolicy.facadeRequired === true &&
        manifest?.extensionPolicy.layCompatibilityRequired === true &&
        (manifest?.allowedFutureExtensions.length ?? 0) >= 10,
      String(manifest?.allowedFutureExtensions.length ?? 0)
    ),
    check(
      "J_forbidden_changes_listed",
      "Forbidden changes listed",
      (manifest?.forbiddenChanges.length ?? 0) >= 10,
      String(manifest?.forbiddenChanges.length ?? 0)
    ),
    check(
      "K_release_flags_valid",
      "Release flags valid",
      manifest?.releaseStatus.certified === true &&
        manifest?.releaseStatus.frozen === true &&
        manifest?.releaseStatus.released === true,
      "certified/frozen/released"
    ),
    check(
      "L_ready_for_release",
      "readyForRelease true",
      manifest?.readyForRelease === true,
      String(manifest?.readyForRelease ?? false)
    ),
    validation.checks.find((entry) => entry.id === "no_new_runtime_behavior") ??
      check("M_no_new_runtime_behavior", "No new runtime behavior", false, "missing check"),
    verifyFreezeModuleClean(/React\.|useState|\.tsx/, "ui"),
    verifyFreezeModuleClean(/export\s+(function|const)\s+\w*Dashboard\w*\s*=|class\s+\w*DashboardAdapter/, "dashboard"),
    verifyFreezeModuleClean(/export\s+(function|const)\s+\w*Assistant\w*\s*=|class\s+\w*AssistantAdapter/, "assistant"),
    verifyFreezeModuleClean(/localStorage|indexedDB|await\s+fetch\s*\(/, "persistence"),
    verifyFreezeModuleClean(/export\s+(function|const)\s+\w*(MachineLearning|VectorSearch|Embedding|NeuralNetwork)\w*\s*=/, "ml"),
    verifyFreezeModuleClean(/executeRecommendation\s*\(|sendNotification\s*\(|generateExecutiveRecommendations\s*\(/, "processing"),
    check(
      "T_no_prior_platform_coupling",
      "No prior platform internal coupling in freeze modules",
      !/from\s+["'].*(?:scenario-timeline|decision-timeline|business-timeline|decision-journal|confidence-evolution|cross-scenario-learning)\//.test(
        readModule("app/lib/executive-recommendation/executiveRecommendationPlatformFreeze.ts")
      ),
      "freeze entry clean"
    ),
    validation.checks.find((entry) => entry.id === "prior_platforms_untouched") ??
      check("U_prior_platforms_untouched", "Prior platforms untouched", false, "missing check"),
  ]);
}

export function runExecutiveRecommendationPlatformFreeze(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): ExecutiveRecommendationPlatformFreezeRunResult {
  const certification = toCertificationDependency(certifyExecutiveRecommendationPlatform(timestamp));

  if (!certification.readyForFreeze || !certification.certified) {
    const validation = validateExecutiveRecommendationPlatformFreeze(certification, null);
    const checks = buildFreezeChecks(certification, null, validation);
    const passedCount = checks.filter((entry) => entry.passed).length;
    const result = Object.freeze({
      freezeVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_CONTRACT_VERSION,
      certified: false,
      frozen: false,
      released: false,
      readyForRelease: false,
      status: "FAIL" as const,
      summary: "Platform freeze rejected: APP-12:8 certification is not ready for freeze.",
      releaseTag: EXECUTIVE_RECOMMENDATION_PLATFORM_RELEASE_TAG,
      manifest: null,
      certification,
      validation,
      checks,
      score: checks.length === 0 ? 0 : Math.round((passedCount / checks.length) * 100),
      readOnly: true as const,
    });
    lastFreezeResult = result;
    return result;
  }

  const manifest = buildExecutiveRecommendationPlatformFreezeManifest(certification, timestamp);
  registerExecutiveRecommendationPlatformFreezeManifest(manifest);
  const validation = validateExecutiveRecommendationPlatformFreeze(certification, manifest);
  const checks = buildFreezeChecks(certification, manifest, validation);
  const success = validation.valid && checks.every((entry) => entry.passed);
  const passedCount = checks.filter((entry) => entry.passed).length;

  const result = Object.freeze({
    freezeVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_CONTRACT_VERSION,
    certified: success,
    frozen: success,
    released: success,
    readyForRelease: success,
    status: success ? ("PASS" as const) : ("FAIL" as const),
    summary: success
      ? "APP-12 Executive Recommendation Platform CERTIFIED, FROZEN, and RELEASED."
      : `APP-12:9 Platform freeze FAILED (${checks.filter((entry) => !entry.passed).length} gate(s)).`,
    releaseTag: EXECUTIVE_RECOMMENDATION_PLATFORM_RELEASE_TAG,
    manifest,
    certification,
    validation,
    checks,
    score: checks.length === 0 ? 0 : Math.round((passedCount / checks.length) * 100),
    readOnly: true as const,
  });

  lastFreezeResult = result;
  return result;
}

export function getExecutiveRecommendationPlatformFreezeReport(): ExecutiveRecommendationPlatformFreezeRunResult | null {
  return lastFreezeResult;
}

export function resetExecutiveRecommendationPlatformFreezeForTests(): void {
  lastFreezeResult = null;
  resetExecutiveRecommendationPlatformFreezeRegistryForTests();
}

export const ExecutiveRecommendationPlatformFreezeRunner = Object.freeze({
  runExecutiveRecommendationPlatformFreeze,
  getExecutiveRecommendationPlatformFreezeReport,
  resetExecutiveRecommendationPlatformFreezeForTests,
});
