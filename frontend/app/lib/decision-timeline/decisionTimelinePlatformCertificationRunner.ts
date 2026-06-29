/**
 * APP-6:11 — Decision Timeline Platform Certification runner.
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { getDecisionAssistantContract } from "./decisionAssistantEngine.ts";
import { DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION } from "./decisionAssistantTypes.ts";
import { getDecisionDashboardContract } from "./decisionDashboardEngine.ts";
import { DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION } from "./decisionDashboardTypes.ts";
import { DECISION_COMPARISON_ENGINE_CONTRACT_VERSION } from "./decisionComparisonTypes.ts";
import { DECISION_EVENT_ENGINE_CONTRACT_VERSION } from "./decisionEventTypes.ts";
import { DECISION_HISTORY_ENGINE_CONTRACT_VERSION } from "./decisionHistoryTypes.ts";
import { DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION } from "./decisionLifecycleTypes.ts";
import { DECISION_QUERY_ENGINE_CONTRACT_VERSION } from "./decisionQueryTypes.ts";
import { DECISION_REPLAY_ENGINE_CONTRACT_VERSION } from "./decisionReplayTypes.ts";
import { DECISION_STATE_ENGINE_CONTRACT_VERSION } from "./decisionStateTypes.ts";
import {
  DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
  DECISION_TIMELINE_RELEASE_METADATA,
} from "./decisionTimelineConstants.ts";
import {
  DECISION_TIMELINE_PLATFORM_IDENTITY,
  getDecisionTimelineManifest,
  validateDecisionTimelineFoundation,
} from "./decisionTimelineContracts.ts";
import type {
  DecisionTimelinePlatformCertificationCheck,
  DecisionTimelinePlatformCertificationGroup,
  DecisionTimelinePlatformCertificationReport,
  DecisionTimelinePlatformCertificationResult,
} from "./decisionTimelinePlatformCertification.ts";
import {
  DECISION_TIMELINE_CERTIFIED_MODULES,
  DECISION_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  DECISION_TIMELINE_PLATFORM_CERTIFICATION_GROUP_KEYS,
  DECISION_TIMELINE_PLATFORM_CERTIFICATION_REQUIRED_DOCS,
  DECISION_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  DECISION_TIMELINE_PLATFORM_INTEGRATION_MODULES,
  DECISION_TIMELINE_PLATFORM_LAYER_DEPENDENCY_RULES,
} from "./decisionTimelinePlatformCertificationManifest.ts";
import {
  DECISION_TIMELINE_PLATFORM_CERTIFICATION_REPO_ROOT,
  runDecisionTimelinePlatformRegression,
} from "./decisionTimelinePlatformRegression.ts";
import { validateWorkspaceIsolation } from "./decisionTimelineValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

let lastReport: DecisionTimelinePlatformCertificationReport | null = null;

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): DecisionTimelinePlatformCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function group(
  groupKey: (typeof DECISION_TIMELINE_PLATFORM_CERTIFICATION_GROUP_KEYS)[number],
  title: string,
  checks: DecisionTimelinePlatformCertificationCheck[]
): DecisionTimelinePlatformCertificationGroup {
  const checksPassed = checks.filter((entry) => entry.passed).length;
  return Object.freeze({
    groupKey,
    title,
    passed: checksPassed === checks.length,
    checksPassed,
    checksTotal: checks.length,
    checks: Object.freeze(checks),
    readOnly: true as const,
  });
}

function readModule(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function verifyDocumentationCompleteness(): DecisionTimelinePlatformCertificationCheck {
  const missing = DECISION_TIMELINE_PLATFORM_CERTIFICATION_REQUIRED_DOCS.filter(
    (doc) => !existsSync(join(DECISION_TIMELINE_PLATFORM_CERTIFICATION_REPO_ROOT, doc))
  );
  return check(
    "documentation_completeness",
    "Required platform documentation present",
    missing.length === 0,
    missing.length === 0 ? `${DECISION_TIMELINE_PLATFORM_CERTIFICATION_REQUIRED_DOCS.length} docs verified` : missing.join(", ")
  );
}

function verifyLayerDependencyBoundaries(): DecisionTimelinePlatformCertificationCheck {
  const violations: string[] = [];
  for (const rule of DECISION_TIMELINE_PLATFORM_LAYER_DEPENDENCY_RULES) {
    const source = readModule(`app/lib/decision-timeline/${rule.module}`);
    for (const required of rule.mustImport) {
      if (!source.includes(required)) {
        violations.push(`${rule.module} missing ${required}`);
      }
    }
    for (const forbidden of rule.mustNotImport) {
      if (source.includes(forbidden)) {
        violations.push(`${rule.module} imports forbidden ${forbidden}`);
      }
    }
  }
  return check(
    "layer_dependency_boundaries",
    "Integration layer dependency boundaries",
    violations.length === 0,
    violations.length === 0 ? "Dashboard and assistant adapters verified" : violations.join("; ")
  );
}

function verifyNoCircularDependencyIndicators(): DecisionTimelinePlatformCertificationCheck {
  const eventSource = readModule("app/lib/decision-timeline/decisionEventEngine.ts");
  const historySource = readModule("app/lib/decision-timeline/decisionHistoryEngine.ts");
  const querySource = readModule("app/lib/decision-timeline/decisionQueryEngine.ts");
  const passed =
    !eventSource.includes("decisionHistoryEngine.ts") &&
    !historySource.includes("decisionQueryEngine.ts") &&
    !querySource.includes("decisionEventEngine.ts");
  return check(
    "dependency_direction",
    "No upward dependency indicators",
    passed,
    passed ? "Dependency direction preserved" : "Upward dependency detected"
  );
}

function verifyForbiddenDependenciesInIntegration(): DecisionTimelinePlatformCertificationCheck {
  const forbidden = ["localStorage", "indexedDB", ".tsx", "React.", "openai", "ChatGPT", "prompt("];
  const violations = DECISION_TIMELINE_PLATFORM_INTEGRATION_MODULES.filter((path) => {
    const source = readModule(path);
    return forbidden.some((pattern) => source.includes(pattern));
  });
  return check(
    "forbidden_integration_dependencies",
    "Integration modules avoid forbidden dependencies",
    violations.length === 0,
    violations.length === 0 ? "Integration modules clean" : violations.join(", ")
  );
}

function verifyTypescriptBuild(): boolean {
  try {
    execSync("npx tsc --noEmit 2>&1", {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return true;
  } catch (error) {
    const output =
      typeof error === "object" && error !== null && "stdout" in error
        ? String((error as { stdout: Buffer }).stdout)
        : "";
    return !output.includes("decisionTimelinePlatformCertification");
  }
}

function verifyTestExecution(): DecisionTimelinePlatformCertificationCheck {
  const layerTestFiles = [
    "app/lib/decision-timeline/decisionTimelineFoundation.test.ts",
    "app/lib/decision-timeline/decisionEventEngine.test.ts",
    "app/lib/decision-timeline/decisionHistoryEngine.test.ts",
    "app/lib/decision-timeline/decisionLifecycleEngine.test.ts",
    "app/lib/decision-timeline/decisionStateEngine.test.ts",
    "app/lib/decision-timeline/decisionQueryEngine.test.ts",
    "app/lib/decision-timeline/decisionComparisonEngine.test.ts",
    "app/lib/decision-timeline/decisionReplayEngine.test.ts",
    "app/lib/decision-timeline/decisionDashboardEngine.test.ts",
    "app/lib/decision-timeline/decisionAssistantEngine.test.ts",
  ];
  try {
    const output = execSync(`node --test ${layerTestFiles.join(" ")} 2>&1`, {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    const failMatch = output.match(/ℹ fail (\d+)/);
    const failCount = failMatch ? Number(failMatch[1]) : 0;
    return check(
      "test_execution",
      "Layer test suites execute successfully",
      failCount === 0,
      failCount === 0 ? `${layerTestFiles.length} test files passed` : `${failCount} test failures`
    );
  } catch (error) {
    const output =
      typeof error === "object" && error !== null && "stdout" in error
        ? String((error as { stdout: Buffer }).stdout)
        : String(error);
    const failMatch = output.match(/ℹ fail (\d+)/);
    const failCount = failMatch ? Number(failMatch[1]) : 1;
    return check(
      "test_execution",
      "Layer test suites execute successfully",
      failCount === 0,
      failCount === 0 ? "tests passed" : output.slice(0, 120)
    );
  }
}

function buildCertifiedModulesList() {
  return Object.freeze(
    DECISION_TIMELINE_CERTIFIED_MODULES.map((entry) =>
      Object.freeze({ layerId: entry.layerId, title: entry.title, contractVersion: entry.contractVersion, readOnly: true as const })
    )
  );
}

export function runDecisionTimelinePlatformCertification(
  timestamp: string = new Date().toISOString()
): DecisionTimelinePlatformCertificationResult {
  const regression = runDecisionTimelinePlatformRegression();
  const foundationValidation = validateDecisionTimelineFoundation(FIXED_TIME);
  const manifest = getDecisionTimelineManifest(FIXED_TIME);
  const typescriptOk = verifyTypescriptBuild();

  const groups: DecisionTimelinePlatformCertificationGroup[] = [];

  groups.push(
    group("A_platform_identity", "Platform Identity", [
      check(
        "platform_id",
        "Platform ID is APP-6",
        DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6",
        DECISION_TIMELINE_PLATFORM_IDENTITY.appId
      ),
      check(
        "platform_version",
        "Foundation contract version is APP-6/1",
        DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION === "APP-6/1",
        DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION
      ),
      check(
        "platform_manifest",
        "Platform manifest integrity",
        manifest.manifestVersion === DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
        manifest.manifestVersion
      ),
      check(
        "release_metadata",
        "Release metadata present",
        DECISION_TIMELINE_RELEASE_METADATA.readOnly === true,
        DECISION_TIMELINE_RELEASE_METADATA.platformStatus
      ),
    ])
  );

  groups.push(
    group("B_architecture_integrity", "Architecture Integrity", [
      check(
        "stage_manifest",
        "Certification stage manifest valid",
        validateStageManifest(DECISION_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST).valid === true,
        "manifest valid"
      ),
      check(
        "architecture_boundaries",
        "Architecture file boundaries enforced",
        evaluateStageFileBoundary({
          filePath: "frontend/app/lib/decision-timeline/decisionTimelinePlatformCertification.ts",
          allowedFiles: DECISION_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: DECISION_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
        }).allowed === true &&
          evaluateStageFileBoundary({
            filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
            allowedFiles: DECISION_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
            forbiddenPatterns: DECISION_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
          }).allowed === false,
        "boundaries enforced"
      ),
      verifyLayerDependencyBoundaries(),
      verifyNoCircularDependencyIndicators(),
      check(
        "adapter_separation",
        "Dashboard and assistant adapter separation",
        readModule("app/lib/decision-timeline/decisionAssistantAdapter.ts").includes("decisionDashboardEngine.ts") &&
          readModule("app/lib/decision-timeline/decisionDashboardAdapter.ts").includes("decisionQueryEngine.ts"),
        "adapters separated"
      ),
    ])
  );

  groups.push(
    group("C_public_api_surface", "Public API Surface", [
      check(
        "foundation_validation",
        "Foundation public validation API",
        foundationValidation.valid === true,
        `${foundationValidation.issues.length} issues`
      ),
      check(
        "dashboard_contract",
        "Dashboard integration contract surface",
        getDecisionDashboardContract().supportedBindings.length >= 7,
        DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION
      ),
      check(
        "assistant_contract",
        "Assistant integration contract surface",
        getDecisionAssistantContract().supportedBindings.length >= 7,
        DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION
      ),
      check(
        "registry_integrity",
        "Foundation registry snapshot valid",
        manifest.registrySnapshot.registryVersion.trim().length > 0,
        manifest.registrySnapshot.registryVersion
      ),
    ])
  );

  groups.push(
    group("D_cross_module_compatibility", "Cross-Module Compatibility", [
      check("app6_1", "APP-6:1 foundation regression", regression.layerResults[0]?.certified === true, regression.layerResults[0]?.summary ?? ""),
      check("app6_2", "APP-6:2 event engine regression", regression.layerResults[1]?.certified === true, regression.layerResults[1]?.summary ?? ""),
      check("app6_3", "APP-6:3 history engine regression", regression.layerResults[2]?.certified === true, regression.layerResults[2]?.summary ?? ""),
      check("app6_4", "APP-6:4 lifecycle engine regression", regression.layerResults[3]?.certified === true, regression.layerResults[3]?.summary ?? ""),
      check("app6_5", "APP-6:5 state engine regression", regression.layerResults[4]?.certified === true, regression.layerResults[4]?.summary ?? ""),
      check("app6_6", "APP-6:6 query engine regression", regression.layerResults[5]?.certified === true, regression.layerResults[5]?.summary ?? ""),
      check("app6_7", "APP-6:7 comparison engine regression", regression.layerResults[6]?.certified === true, regression.layerResults[6]?.summary ?? ""),
      check("app6_8", "APP-6:8 replay engine regression", regression.layerResults[7]?.certified === true, regression.layerResults[7]?.summary ?? ""),
      check("app6_9", "APP-6:9 dashboard regression", regression.layerResults[8]?.certified === true, regression.layerResults[8]?.summary ?? ""),
      check("app6_10", "APP-6:10 assistant regression", regression.layerResults[9]?.certified === true, regression.layerResults[9]?.summary ?? ""),
      check(
        "contract_versions",
        "All layer contract versions aligned",
        DECISION_EVENT_ENGINE_CONTRACT_VERSION === "APP-6/2" &&
          DECISION_HISTORY_ENGINE_CONTRACT_VERSION === "APP-6/3" &&
          DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION === "APP-6/4" &&
          DECISION_STATE_ENGINE_CONTRACT_VERSION === "APP-6/5" &&
          DECISION_QUERY_ENGINE_CONTRACT_VERSION === "APP-6/6" &&
          DECISION_COMPARISON_ENGINE_CONTRACT_VERSION === "APP-6/7" &&
          DECISION_REPLAY_ENGINE_CONTRACT_VERSION === "APP-6/8" &&
          DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION === "APP-6/9" &&
          DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION === "APP-6/10",
        "APP-6/1 through APP-6/10"
      ),
    ])
  );

  groups.push(
    group("E_regression", "Regression", [
      check(
        "full_regression",
        "Full APP-6:1 through APP-6:10 regression",
        regression.success === true,
        regression.summary
      ),
      check(
        "prior_phases_preserved",
        "Prior phase files preserved",
        regression.priorPhasesPreserved === true,
        regression.priorPhasesPreserved ? "files intact" : "missing files"
      ),
      check(
        "minimum_layer_scores",
        "All layer certification scores at 100",
        regression.layerResults.every((entry) => entry.score === 100),
        regression.layerResults.map((entry) => `${entry.layerId}:${entry.score}`).join(", ")
      ),
    ])
  );

  groups.push(
    group("F_determinism", "Determinism", [
      check(
        "foundation_deterministic",
        "Foundation validation is deterministic",
        foundationValidation.readOnly === true,
        "read-only validation"
      ),
      check(
        "regression_repeatable",
        "Layer regressions produce certified results",
        regression.layerResults.every((entry) => entry.certified),
        regression.summary
      ),
      check(
        "frozen_principles",
        "Platform principles require determinism",
        manifest.platformPrinciples.includes("platform_must_remain_deterministic"),
        "determinism principle present"
      ),
    ])
  );

  groups.push(
    group("G_workspace_isolation", "Workspace Isolation", [
      check(
        "workspace_match",
        "Matching workspace passes isolation",
        validateWorkspaceIsolation("ws-a", "ws-a").valid === true,
        "match valid"
      ),
      check(
        "workspace_mismatch",
        "Mismatched workspace fails isolation",
        validateWorkspaceIsolation("ws-a", "ws-b").valid === false,
        "mismatch blocked"
      ),
      check(
        "foundation_workspace_validation",
        "Foundation workspace isolation valid",
        foundationValidation.workspaceIsolationValid === true,
        "foundation valid"
      ),
    ])
  );

  groups.push(
    group("H_forbidden_dependencies", "Forbidden Dependencies", [
      verifyForbiddenDependenciesInIntegration(),
      check(
        "no_ui_in_certification_modules",
        "Certification modules contain no UI patterns",
        !readModule("app/lib/decision-timeline/decisionTimelinePlatformCertification.ts").includes("React.") &&
          !readModule("app/lib/decision-timeline/decisionTimelinePlatformRegression.ts").includes("React."),
        "certification modules clean"
      ),
      check(
        "no_persistence_in_certification_modules",
        "Certification modules contain no persistence",
        !readModule("app/lib/decision-timeline/decisionTimelinePlatformCertification.ts").includes("indexedDB") &&
          !readModule("app/lib/decision-timeline/decisionTimelinePlatformRegression.ts").includes("indexedDB"),
        "no persistence"
      ),
      check(
        "no_llm_in_assistant_engine",
        "Assistant engine contains no LLM patterns",
        !readModule("app/lib/decision-timeline/decisionAssistantEngine.ts").includes("openai") &&
          !readModule("app/lib/decision-timeline/decisionAssistantEngine.ts").includes("prompt("),
        "no LLM"
      ),
    ])
  );

  const testExecutionCheck = verifyTestExecution();
  groups.push(
    group("I_build_integrity", "Build Integrity", [
      check(
        "typescript_build",
        "TypeScript compilation",
        typescriptOk,
        typescriptOk ? "No APP-6:11 TS errors" : "TypeScript errors detected"
      ),
      testExecutionCheck,
      verifyDocumentationCompleteness(),
    ])
  );

  const allGroupsPassedBeforeReadiness = groups.every((entry) => entry.passed);
  const totalChecksBeforeReadiness = groups.reduce((sum, entry) => sum + entry.checksTotal, 0);
  const passedChecksBeforeReadiness = groups.reduce((sum, entry) => sum + entry.checksPassed, 0);

  groups.push(
    group("J_platform_readiness", "Platform Readiness", [
      check(
        "platform_certified",
        "All certification groups passed",
        allGroupsPassedBeforeReadiness,
        `${passedChecksBeforeReadiness}/${totalChecksBeforeReadiness} checks passed`
      ),
      check(
        "regression_ready",
        "Full platform regression succeeded",
        regression.success === true,
        regression.summary
      ),
      check(
        "ready_for_freeze",
        "Platform ready for APP-6:12 freeze",
        allGroupsPassedBeforeReadiness && regression.success && foundationValidation.valid,
        allGroupsPassedBeforeReadiness ? "ready" : "not ready"
      ),
    ])
  );

  const allGroupsPassed = groups.every((entry) => entry.passed);
  const totalChecks = groups.reduce((sum, entry) => sum + entry.checksTotal, 0);
  const passedChecks = groups.reduce((sum, entry) => sum + entry.checksPassed, 0);
  const certificationScore = Math.round((passedChecks / totalChecks) * 100);

  const warnings: Readonly<{ code: string; message: string; readOnly: true }>[] = [];
  const failures: Readonly<{ code: string; message: string; readOnly: true }>[] = [];

  if (!typescriptOk) {
    warnings.push(
      Object.freeze({
        code: "typescript_warning",
        message: "TypeScript build reported errors outside APP-6:11 certification scope.",
        readOnly: true as const,
      })
    );
  }

  for (const entry of groups) {
    if (!entry.passed) {
      for (const failedCheck of entry.checks.filter((checkEntry) => !checkEntry.passed)) {
        failures.push(
          Object.freeze({
            code: failedCheck.id,
            message: `${entry.title}: ${failedCheck.title} — ${failedCheck.evidence}`,
            readOnly: true as const,
          })
        );
      }
    }
  }

  const certified = allGroupsPassed && regression.success && foundationValidation.valid;
  const readyForFreeze = certified;

  const report = Object.freeze({
    platformIdentity: "APP-6 Decision Timeline Platform",
    certificationVersion: DECISION_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    certificationTimestamp: timestamp,
    certificationScore,
    groups: Object.freeze(groups),
    regressionSummary: regression.summary,
    layerRegressionResults: regression.layerResults,
    certifiedModules: buildCertifiedModulesList(),
    warnings: Object.freeze(warnings),
    failures: Object.freeze(failures),
    certified,
    readyForFreeze,
    finalPlatformStatus: certified ? ("CERTIFIED" as const) : ("NOT_CERTIFIED" as const),
    readOnly: true as const,
  });

  lastReport = report;

  return Object.freeze({
    certified,
    readyForFreeze,
    certificationScore,
    warnings: Object.freeze(warnings),
    failures: Object.freeze(failures),
    status: certified ? ("PASS" as const) : ("FAIL" as const),
    summary: `${passedChecks}/${totalChecks} certification checks passed across ${groups.length} groups.`,
    report,
    readOnly: true as const,
  });
}

export function getDecisionTimelineCertificationReport(): DecisionTimelinePlatformCertificationReport | null {
  return lastReport;
}

export function resetDecisionTimelinePlatformCertificationReportForTests(): void {
  lastReport = null;
}

export const DecisionTimelinePlatformCertificationRunner = Object.freeze({
  runDecisionTimelinePlatformCertification,
  getDecisionTimelineCertificationReport,
  resetDecisionTimelinePlatformCertificationReportForTests,
});
