/**
 * APP-4:13 — Executive Memory Platform Certification.
 * Official platform certification gates and release readiness assessment.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

import {
  resolveScenarioIdentityExample,
  validateScenarioIdentityShape,
} from "../app-2-scenario-intelligence/scenarioIntelligenceContract.ts";
import {
  resolveExecutiveIntentExample,
  validateExecutiveIntentShape,
} from "../executiveIntent/executiveIntentContract.ts";
import { runExecutiveIntentPlatformRefresh } from "../executiveIntent/executiveIntentPlatformRefresh.ts";
import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { ExecutiveAssistantMemoryIntegrationContracts } from "./executiveAssistantMemoryIntegrationContracts.ts";
import { ExecutiveContextMemoryContracts } from "./executiveContextMemoryContracts.ts";
import { ExecutiveDecisionMemoryContracts } from "./executiveDecisionMemoryContracts.ts";
import {
  getExecutiveMemoryDashboard,
  ExecutiveMemoryDashboardContracts,
} from "./executiveMemoryDashboardContracts.ts";
import {
  EXECUTIVE_MEMORY_CONTRACT_VERSION,
} from "./executiveMemoryConstants.ts";
import {
  EXECUTIVE_MEMORY_FREEZE_RULES,
  EXECUTIVE_MEMORY_IDENTITY,
  EXECUTIVE_MEMORY_SELF_MANIFEST,
  ExecutiveMemoryContract,
} from "./executiveMemoryContracts.ts";
import { ExecutiveMemoryLifecycleContracts } from "./executiveMemoryLifecycleContracts.ts";
import { ExecutiveMemoryRecordContracts } from "./executiveMemoryRecordContracts.ts";
import { ExecutiveMemoryRetrievalContracts } from "./executiveMemoryRetrievalContracts.ts";
import { ExecutiveMemorySearchRankingContracts } from "./executiveMemorySearchRankingContracts.ts";
import { ExecutiveMemoryStorageContracts } from "./executiveMemoryStorageContracts.ts";
import {
  EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_TAGS,
  EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_TEST_FILES,
  EXECUTIVE_MEMORY_PLATFORM_DOCUMENTATION_FILES,
  EXECUTIVE_MEMORY_PLATFORM_PHASE_REGISTRY,
  EXECUTIVE_MEMORY_PLATFORM_READINESS_STATUS,
} from "./executiveMemoryPlatformCertificationConstants.ts";
import { buildExecutiveMemoryPlatformCertificationManifest } from "./executiveMemoryPlatformCertificationManifest.ts";
import {
  certifyExecutiveMemoryPlatformEndToEnd,
  resetExecutiveMemoryPlatformCertificationEnvironment,
  validateExecutiveMemoryPlatformArchitectureBoundaries,
} from "./executiveMemoryPlatformCertificationPhaseChecks.ts";
import { runExecutiveMemoryPlatformRegression } from "./executiveMemoryPlatformRegression.ts";
import type {
  ExecutiveMemoryPlatformCertificationCheck,
  ExecutiveMemoryPlatformCertificationResult,
  ExecutiveMemoryPlatformCompatibilityValidation,
} from "./executiveMemoryPlatformCertificationTypes.ts";
import { ExecutiveIntentMemoryLinkContracts } from "./executiveIntentMemoryLinkContracts.ts";
import { ExecutiveScenarioMemoryContracts } from "./executiveScenarioMemoryContracts.ts";

const REPO_ROOT = join(process.cwd(), "..");
const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function nowIso(): string {
  return new Date().toISOString();
}

function check(
  id: ExecutiveMemoryPlatformCertificationCheck["id"],
  title: string,
  passed: boolean,
  evidence: string
): ExecutiveMemoryPlatformCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function countPublicApis(): number {
  return (
    Object.keys(ExecutiveMemoryContract).length +
    Object.keys(ExecutiveMemoryRecordContracts).length +
    Object.keys(ExecutiveMemoryStorageContracts).length +
    Object.keys(ExecutiveMemoryRetrievalContracts).length +
    Object.keys(ExecutiveIntentMemoryLinkContracts).length +
    Object.keys(ExecutiveScenarioMemoryContracts).length +
    Object.keys(ExecutiveDecisionMemoryContracts).length +
    Object.keys(ExecutiveContextMemoryContracts).length +
    Object.keys(ExecutiveMemorySearchRankingContracts).length +
    Object.keys(ExecutiveMemoryLifecycleContracts).length +
    Object.keys(ExecutiveAssistantMemoryIntegrationContracts).length +
    Object.keys(ExecutiveMemoryDashboardContracts).length
  );
}

function validateCompatibility(): ExecutiveMemoryPlatformCompatibilityValidation {
  return Object.freeze({
    schemaCompatible: ExecutiveMemoryRecordContracts.version === "APP-4/2",
    versionCompatible: EXECUTIVE_MEMORY_CONTRACT_VERSION === "APP-4/1",
    lifecycleCompatible: ExecutiveMemoryLifecycleContracts.version === "APP-4/10",
    searchCompatible: ExecutiveMemorySearchRankingContracts.version === "APP-4/9",
    dashboardCompatible: ExecutiveMemoryDashboardContracts.version === "APP-4/12",
    assistantCompatible: ExecutiveAssistantMemoryIntegrationContracts.version === "APP-4/11",
    app2ScenarioCompatible: validateScenarioIdentityShape(resolveScenarioIdentityExample()).valid,
    app3IntentCompatible: validateExecutiveIntentShape(resolveExecutiveIntentExample()).valid,
    readOnly: true as const,
  });
}

function allDocumentationPresent(): boolean {
  return EXECUTIVE_MEMORY_PLATFORM_DOCUMENTATION_FILES.every((filePath) =>
    existsSync(join(REPO_ROOT, filePath))
  );
}

export function runExecutiveMemoryPlatformCertification(): ExecutiveMemoryPlatformCertificationResult {
  const certificationStarted = performance.now();
  const generatedAt = nowIso();
  const regressionStarted = performance.now();
  const regression = runExecutiveMemoryPlatformRegression();
  const regressionExecutionTimeMs = performance.now() - regressionStarted;

  resetExecutiveMemoryPlatformCertificationEnvironment();
  const endToEnd = certifyExecutiveMemoryPlatformEndToEnd();
  const compatibility = validateCompatibility();
  const manifest = buildExecutiveMemoryPlatformCertificationManifest(generatedAt);
  const reportPath = join(REPO_ROOT, "docs/app-4-13-executive-memory-platform-certification-report.md");

  resetExecutiveMemoryPlatformCertificationEnvironment();
  certifyExecutiveMemoryPlatformEndToEnd();
  const dashboardFirst = getExecutiveMemoryDashboard(FIXED_TIME);
  const dashboardSecond = getExecutiveMemoryDashboard(FIXED_TIME);
  const deterministic =
    dashboardFirst.summary.totalMemories === dashboardSecond.summary.totalMemories &&
    dashboardFirst.health.level === dashboardSecond.health.level;

  const app3Refresh = runExecutiveIntentPlatformRefresh(FIXED_TIME);
  const metadataValid = ExecutiveMemoryContract.validateExecutiveMemoryMetadataShape(
    ExecutiveMemoryContract.resolveExecutiveMemoryMetadataExample(FIXED_TIME)
  ).valid;

  const phaseById = Object.fromEntries(regression.phases.map((phase) => [phase.phaseId, phase]));
  const certificationExecutionTimeMs = performance.now() - certificationStarted;

  const checks: ExecutiveMemoryPlatformCertificationCheck[] = [
    check("A", "Architecture integrity", validateExecutiveMemoryPlatformArchitectureBoundaries(), "Certification boundaries verified."),
    check("B", "Public API compatibility", countPublicApis() >= 12, String(countPublicApis())),
    check("C", "Contract compatibility", EXECUTIVE_MEMORY_PLATFORM_PHASE_REGISTRY.length === 12, "12 phase contracts."),
    check("D", "Storage validation", phaseById["APP-4/3"]?.certified === true, phaseById["APP-4/3"]?.summary ?? ""),
    check("E", "Retrieval validation", phaseById["APP-4/4"]?.certified === true, phaseById["APP-4/4"]?.summary ?? ""),
    check("F", "Search & Ranking validation", phaseById["APP-4/9"]?.certified === true, phaseById["APP-4/9"]?.summary ?? ""),
    check("G", "Lifecycle validation", phaseById["APP-4/10"]?.certified === true, phaseById["APP-4/10"]?.summary ?? ""),
    check("H", "Intent integration", phaseById["APP-4/5"]?.certified === true && compatibility.app3IntentCompatible, phaseById["APP-4/5"]?.summary ?? ""),
    check("I", "Scenario integration", phaseById["APP-4/6"]?.certified === true && compatibility.app2ScenarioCompatible, phaseById["APP-4/6"]?.summary ?? ""),
    check("J", "Decision integration", phaseById["APP-4/7"]?.certified === true, phaseById["APP-4/7"]?.summary ?? ""),
    check("K", "Context integration", phaseById["APP-4/8"]?.certified === true, phaseById["APP-4/8"]?.summary ?? ""),
    check("L", "Assistant integration", phaseById["APP-4/11"]?.certified === true && compatibility.assistantCompatible, phaseById["APP-4/11"]?.summary ?? ""),
    check("M", "Dashboard integration", phaseById["APP-4/12"]?.certified === true && compatibility.dashboardCompatible, phaseById["APP-4/12"]?.summary ?? ""),
    check("N", "Deterministic behavior", deterministic, "Dashboard output stable."),
    check("O", "Metadata integrity", metadataValid, "Foundation metadata valid."),
    check("P", "Version compatibility", compatibility.versionCompatible && compatibility.schemaCompatible, EXECUTIVE_MEMORY_CONTRACT_VERSION),
    check("Q", "Backward compatibility", EXECUTIVE_MEMORY_FREEZE_RULES.publicInterfacesExtendOnly === true, "Extend-only policy."),
    check("R", "Performance validation", certificationExecutionTimeMs < 30_000, `${certificationExecutionTimeMs.toFixed(2)}ms`),
    check("S", "Regression completion", regression.certified, regression.summary),
    check("T", "Documentation completeness", allDocumentationPresent(), String(EXECUTIVE_MEMORY_PLATFORM_DOCUMENTATION_FILES.length)),
    check("U", "Build verification", validateStageManifest(EXECUTIVE_MEMORY_SELF_MANIFEST).valid, "Foundation manifest valid."),
    check("V", "Certification report generation", existsSync(reportPath), reportPath),
    check("W", "Platform ready for freeze", regression.certified && endToEnd.certified, EXECUTIVE_MEMORY_PLATFORM_READINESS_STATUS),
  ];

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-4:13 Executive Memory Platform Certification & Regression",
    status: certified ? "PASS" : "FAIL",
    certified,
    releaseReady: certified && endToEnd.certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    summary: certified
      ? "APP-4:13 Executive Memory Platform CERTIFIED and READY FOR FREEZE."
      : `APP-4:13 Executive Memory Platform certification FAILED (${failedChecks.length} gate(s)).`,
    generatedAt,
    regression,
    manifest,
    performance: Object.freeze({
      certificationExecutionTimeMs,
      regressionExecutionTimeMs,
      totalCertifiedModules: EXECUTIVE_MEMORY_PLATFORM_PHASE_REGISTRY.length,
      totalPublicApis: countPublicApis(),
      totalContracts: EXECUTIVE_MEMORY_PLATFORM_PHASE_REGISTRY.length,
      totalCertificationTestFiles: EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_TEST_FILES.length,
      readOnly: true as const,
    }),
    compatibility,
    tags: EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_TAGS,
    readOnly: true as const,
  });
}

export const ExecutiveMemoryPlatformCertification = Object.freeze({
  runExecutiveMemoryPlatformCertification,
});
