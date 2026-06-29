/**
 * APP-9:9 — Confidence Evolution Platform Freeze runner.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { runConfidenceEvolutionPlatformCertification } from "./confidenceEvolutionPlatformCertification.ts";
import type { ConfidenceEvolutionPlatformCertificationResult } from "./confidenceEvolutionPlatformCertification.ts";
import { buildConfidenceEvolutionPlatformFreezeManifest } from "./confidenceEvolutionPlatformFreezeManifest.ts";
import type { ConfidenceEvolutionPlatformFreezeManifest } from "./confidenceEvolutionPlatformFreezeManifest.ts";
import {
  CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_RELEASE_TAG,
  registerConfidenceEvolutionPlatformFreezeManifest,
  resetConfidenceEvolutionPlatformFreezeRegistryForTests,
} from "./confidenceEvolutionPlatformFreezeRegistry.ts";
import { validateConfidenceEvolutionPlatformFreeze } from "./confidenceEvolutionPlatformFreezeValidation.ts";
import type {
  ConfidenceEvolutionPlatformFreezeCheck,
  ConfidenceEvolutionPlatformFreezeRunResult,
} from "./confidenceEvolutionPlatformFreezeTypes.ts";

const FREEZE_CHECK_IDS = Object.freeze([
  "A_certification_pass",
  "B_ready_for_freeze",
  "C_manifest_valid",
  "D_release_identity_valid",
  "E_phases_registered",
  "F_public_apis_registered",
  "G_consumers_registered",
  "H_compatibility_matrix_valid",
  "I_extension_policy_valid",
  "J_forbidden_changes_listed",
  "K_release_flags_valid",
  "L_ready_for_release",
  "M_no_new_runtime_behavior",
  "N_no_ui_logic",
  "O_no_dashboard_logic",
  "P_no_assistant_logic",
  "Q_no_visualization_logic",
  "R_no_persistence_logic",
  "S_no_app6_app7_app8_internal_coupling",
  "T_no_prediction_recommendation_logic",
  "U_prior_platforms_untouched",
] as const);

let lastFreezeResult: ConfidenceEvolutionPlatformFreezeRunResult | null = null;

function check(id: string, title: string, passed: boolean, evidence: string): ConfidenceEvolutionPlatformFreezeCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readModule(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function verifyFreezeModuleClean(pattern: RegExp, label: string): ConfidenceEvolutionPlatformFreezeCheck {
  const sources = [
    readModule("app/lib/confidence-evolution/confidenceEvolutionPlatformFreeze.ts"),
    readModule("app/lib/confidence-evolution/confidenceEvolutionPlatformFreezeRegistry.ts"),
    readModule("app/lib/confidence-evolution/confidenceEvolutionPlatformFreezeCompatibility.ts"),
    readModule("app/lib/confidence-evolution/confidenceEvolutionPlatformFreezeTypes.ts"),
  ].join("\n");
  const passed = !pattern.test(sources);
  return check(`no_${label}`, `No ${label} logic`, passed, passed ? "freeze modules clean" : `${label} pattern detected`);
}

function buildFreezeChecks(
  certification: ConfidenceEvolutionPlatformCertificationResult,
  manifest: ConfidenceEvolutionPlatformFreezeManifest | null,
  validation: ReturnType<typeof validateConfidenceEvolutionPlatformFreeze>
): readonly ConfidenceEvolutionPlatformFreezeCheck[] {
  const facadeSources = [
    readModule("app/lib/confidence-evolution/confidenceEvolutionApiFacade.ts"),
    readModule("app/lib/confidence-evolution/confidenceEvolutionApi.ts"),
  ].join("\n");

  return Object.freeze([
    check(
      "A_certification_pass",
      "APP-9:8 certification PASS",
      certification.status === "PASS" && certification.certified === true,
      certification.status
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
      manifest?.appId === "APP-9" && manifest?.releaseVersion === "APP-9",
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
      (manifest?.publicApis.length ?? 0) >= 40,
      String(manifest?.publicApis.length ?? 0)
    ),
    check(
      "G_consumers_registered",
      "Consumers registered",
      (manifest?.consumers.length ?? 0) === 7,
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
    verifyFreezeModuleClean(
      /export\s+(function|const)\s+\w*(Chart|Visualization|Renderer)\w*\s*=|class\s+\w*VisualizationRenderer/,
      "visualization"
    ),
    verifyFreezeModuleClean(/localStorage|indexedDB|await\s+fetch\s*\(/, "persistence"),
    check(
      "S_no_app6_app7_app8_internal_coupling",
      "No APP-6/7/8 internal coupling",
      !/from\s+["'].*(?:decision-timeline|business-timeline|decision-journal)\//.test(facadeSources),
      "facade layers clean"
    ),
    verifyFreezeModuleClean(
      /predict\s*\(|recommend\s*\(|predictionEngine|recommendationEngine/,
      "prediction_recommendation"
    ),
    validation.checks.find((entry) => entry.id === "prior_platforms_untouched") ??
      check("U_prior_platforms_untouched", "Prior platforms untouched", false, "missing check"),
  ]);
}

export function runConfidenceEvolutionPlatformFreeze(
  timestamp: string = new Date().toISOString()
): ConfidenceEvolutionPlatformFreezeRunResult {
  const certification = runConfidenceEvolutionPlatformCertification(timestamp);

  if (!certification.readyForFreeze || !certification.certified) {
    const validation = validateConfidenceEvolutionPlatformFreeze(certification, null);
    const checks = buildFreezeChecks(certification, null, validation);
    const passedCount = checks.filter((entry) => entry.passed).length;
    const result = Object.freeze({
      freezeVersion: CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_CONTRACT_VERSION,
      certified: false,
      frozen: false,
      released: false,
      readyForRelease: false,
      status: "FAIL" as const,
      summary: "Platform freeze rejected: APP-9:8 certification is not ready for freeze.",
      releaseTag: CONFIDENCE_EVOLUTION_PLATFORM_RELEASE_TAG,
      manifest: null,
      certification,
      validation,
      checks,
      score: Math.round((passedCount / FREEZE_CHECK_IDS.length) * 100),
      readOnly: true as const,
    });
    lastFreezeResult = result;
    return result;
  }

  const manifest = buildConfidenceEvolutionPlatformFreezeManifest(certification, timestamp);
  registerConfidenceEvolutionPlatformFreezeManifest(manifest);
  const validation = validateConfidenceEvolutionPlatformFreeze(certification, manifest);
  const checks = buildFreezeChecks(certification, manifest, validation);
  const success = validation.valid && checks.every((entry) => entry.passed);
  const passedCount = checks.filter((entry) => entry.passed).length;

  const result = Object.freeze({
    freezeVersion: CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_CONTRACT_VERSION,
    certified: success,
    frozen: success,
    released: success,
    readyForRelease: success,
    status: success ? ("PASS" as const) : ("FAIL" as const),
    summary: success
      ? "APP-9 Confidence Evolution Platform CERTIFIED, FROZEN, and RELEASED."
      : `APP-9:9 Platform freeze FAILED (${checks.filter((entry) => !entry.passed).length} gate(s)).`,
    releaseTag: CONFIDENCE_EVOLUTION_PLATFORM_RELEASE_TAG,
    manifest,
    certification,
    validation,
    checks,
    score: Math.round((passedCount / FREEZE_CHECK_IDS.length) * 100),
    readOnly: true as const,
  });

  lastFreezeResult = result;
  return result;
}

export function getConfidenceEvolutionPlatformFreezeReport(): ConfidenceEvolutionPlatformFreezeRunResult | null {
  return lastFreezeResult;
}

export function resetConfidenceEvolutionPlatformFreezeForTests(): void {
  lastFreezeResult = null;
  resetConfidenceEvolutionPlatformFreezeRegistryForTests();
}

export const ConfidenceEvolutionPlatformFreezeRunner = Object.freeze({
  runConfidenceEvolutionPlatformFreeze,
  getConfidenceEvolutionPlatformFreezeReport,
  resetConfidenceEvolutionPlatformFreezeForTests,
});
