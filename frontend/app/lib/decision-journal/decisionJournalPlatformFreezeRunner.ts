/**
 * APP-8:9 — Decision Journal Platform Freeze runner.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { runDecisionJournalPlatformCertification } from "./decisionJournalPlatformCertification.ts";
import type { DecisionJournalPlatformCertificationResult } from "./decisionJournalPlatformCertification.ts";
import { buildDecisionJournalPlatformFreezeManifest } from "./decisionJournalPlatformFreezeManifest.ts";
import type { DecisionJournalPlatformFreezeManifest } from "./decisionJournalPlatformFreezeManifest.ts";
import {
  DECISION_JOURNAL_PLATFORM_FREEZE_CONTRACT_VERSION,
  DECISION_JOURNAL_PLATFORM_RELEASE_TAG,
  registerDecisionJournalPlatformFreezeManifest,
  resetDecisionJournalPlatformFreezeRegistryForTests,
} from "./decisionJournalPlatformFreezeRegistry.ts";
import { validateDecisionJournalPlatformFreeze } from "./decisionJournalPlatformFreezeValidation.ts";
import type {
  DecisionJournalPlatformFreezeCheck,
  DecisionJournalPlatformFreezeRunResult,
} from "./decisionJournalPlatformFreezeTypes.ts";

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
  "S_no_ai_generation",
  "T_no_app6_internal_coupling",
  "U_prior_platforms_untouched",
] as const);

let lastFreezeResult: DecisionJournalPlatformFreezeRunResult | null = null;

function check(id: string, title: string, passed: boolean, evidence: string): DecisionJournalPlatformFreezeCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readModule(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function verifyFreezeModuleClean(pattern: RegExp, label: string): DecisionJournalPlatformFreezeCheck {
  const sources = [
    readModule("app/lib/decision-journal/decisionJournalPlatformFreeze.ts"),
    readModule("app/lib/decision-journal/decisionJournalPlatformFreezeRegistry.ts"),
    readModule("app/lib/decision-journal/decisionJournalPlatformFreezeCompatibility.ts"),
    readModule("app/lib/decision-journal/decisionJournalPlatformFreezeTypes.ts"),
  ].join("\n");
  const passed = !pattern.test(sources);
  return check(`no_${label}`, `No ${label} logic`, passed, passed ? "freeze modules clean" : `${label} pattern detected`);
}

function buildFreezeChecks(
  certification: DecisionJournalPlatformCertificationResult,
  manifest: DecisionJournalPlatformFreezeManifest | null,
  validation: ReturnType<typeof validateDecisionJournalPlatformFreeze>
): readonly DecisionJournalPlatformFreezeCheck[] {
  const facadeSources = [
    readModule("app/lib/decision-journal/decisionJournalApiFacade.ts"),
    readModule("app/lib/decision-journal/decisionJournalApi.ts"),
  ].join("\n");

  return Object.freeze([
    check(
      "A_certification_pass",
      "APP-8:8 certification PASS",
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
      manifest?.appId === "APP-8" && manifest?.releaseVersion === "APP-8",
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
        (manifest?.allowedFutureExtensions.length ?? 0) >= 9,
      String(manifest?.allowedFutureExtensions.length ?? 0)
    ),
    check(
      "J_forbidden_changes_listed",
      "Forbidden changes listed",
      (manifest?.forbiddenChanges.length ?? 0) >= 9,
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
    verifyFreezeModuleClean(/openai\.|ChatGPT|generateCompletion|prompt\s*\(/, "ai_generation"),
    check(
      "T_no_app6_internal_coupling",
      "No APP-6 internal coupling",
      !/from\s+["'].*decision-timeline\//.test(facadeSources),
      "facade layers clean"
    ),
    validation.checks.find((entry) => entry.id === "prior_platforms_untouched") ??
      check("U_prior_platforms_untouched", "Prior platforms untouched", false, "missing check"),
  ]);
}

export function runDecisionJournalPlatformFreeze(
  timestamp: string = new Date().toISOString()
): DecisionJournalPlatformFreezeRunResult {
  const certification = runDecisionJournalPlatformCertification(timestamp);

  if (!certification.readyForFreeze || !certification.certified) {
    const validation = validateDecisionJournalPlatformFreeze(certification, null);
    const checks = buildFreezeChecks(certification, null, validation);
    const passedCount = checks.filter((entry) => entry.passed).length;
    const result = Object.freeze({
      freezeVersion: DECISION_JOURNAL_PLATFORM_FREEZE_CONTRACT_VERSION,
      certified: false,
      frozen: false,
      released: false,
      readyForRelease: false,
      status: "FAIL" as const,
      summary: "Platform freeze rejected: APP-8:8 certification is not ready for freeze.",
      releaseTag: DECISION_JOURNAL_PLATFORM_RELEASE_TAG,
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

  const manifest = buildDecisionJournalPlatformFreezeManifest(certification, timestamp);
  registerDecisionJournalPlatformFreezeManifest(manifest);
  const validation = validateDecisionJournalPlatformFreeze(certification, manifest);
  const checks = buildFreezeChecks(certification, manifest, validation);
  const success = validation.valid && checks.every((entry) => entry.passed);
  const passedCount = checks.filter((entry) => entry.passed).length;

  const result = Object.freeze({
    freezeVersion: DECISION_JOURNAL_PLATFORM_FREEZE_CONTRACT_VERSION,
    certified: success,
    frozen: success,
    released: success,
    readyForRelease: success,
    status: success ? ("PASS" as const) : ("FAIL" as const),
    summary: success
      ? "APP-8 Decision Journal Platform CERTIFIED, FROZEN, and RELEASED."
      : `APP-8:9 Platform freeze FAILED (${checks.filter((entry) => !entry.passed).length} gate(s)).`,
    releaseTag: DECISION_JOURNAL_PLATFORM_RELEASE_TAG,
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

export function getDecisionJournalPlatformFreezeReport(): DecisionJournalPlatformFreezeRunResult | null {
  return lastFreezeResult;
}

export function resetDecisionJournalPlatformFreezeForTests(): void {
  lastFreezeResult = null;
  resetDecisionJournalPlatformFreezeRegistryForTests();
}

export const DecisionJournalPlatformFreezeRunner = Object.freeze({
  runDecisionJournalPlatformFreeze,
  getDecisionJournalPlatformFreezeReport,
  resetDecisionJournalPlatformFreezeForTests,
});
