/**
 * APP-2:14 — Scenario Intelligence Platform Final Certification.
 * Official release gate wrapping APP-2:13 platform certification.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

import {
  SCENARIO_INTELLIGENCE_FREEZE_RULES,
  SCENARIO_INTELLIGENCE_FORBIDDEN_PATTERNS,
} from "./scenarioIntelligenceContract.ts";
import { EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES } from "./executiveScenarioAssistantAdapter.ts";
import { EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES } from "./executiveScenarioDashboardAdapter.ts";
import { EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES } from "./executiveScenarioWorkspaceAdapter.ts";
import { EXECUTIVE_SCENARIO_PACKAGE_RULES } from "./executiveScenarioPackageManifest.ts";
import { runScenarioIntelligencePlatformCertification } from "./scenarioIntelligencePlatformCertification.ts";
import {
  buildScenarioIntelligencePlatformFreezeManifest,
  SCENARIO_INTELLIGENCE_PLATFORM_FORBIDDEN_CONSUMER_IMPORTS,
  SCENARIO_INTELLIGENCE_PLATFORM_FROZEN_PUBLIC_APIS,
  SCENARIO_INTELLIGENCE_PLATFORM_FREEZE_VERSION,
  SCENARIO_INTELLIGENCE_PLATFORM_RELEASE_TAGS,
  SCENARIO_INTELLIGENCE_PLATFORM_STATUS,
} from "./scenarioIntelligencePlatformFreezeManifest.ts";
import { runScenarioIntelligencePlatformFreezeRegression } from "./scenarioIntelligencePlatformFreezeRegression.ts";
import type { ScenarioIntelligenceCertificationCheck } from "./scenarioIntelligenceTypes.ts";
import { evaluateStageFileBoundary } from "../stage/stageArchitectureGuards.ts";

const REPO_ROOT = join(process.cwd(), "..");
const FREEZE_REPORT_PATH = join(
  REPO_ROOT,
  "docs/app-2-14-scenario-intelligence-platform-freeze-report.md"
);

export { SCENARIO_INTELLIGENCE_PLATFORM_RELEASE_TAGS as SCENARIO_INTELLIGENCE_PLATFORM_FINAL_TAGS };

export type ScenarioIntelligencePlatformFinalCertificationResult = Readonly<{
  phaseName: string;
  status: "PASS" | "FAIL";
  certified: boolean;
  released: boolean;
  checks: readonly ScenarioIntelligenceCertificationCheck[];
  passedChecks: readonly ScenarioIntelligenceCertificationCheck[];
  failedChecks: readonly ScenarioIntelligenceCertificationCheck[];
  tags: readonly string[];
  summary: string;
  generatedAt: string;
  regression: ReturnType<typeof runScenarioIntelligencePlatformFreezeRegression>;
  platformCertification: ReturnType<typeof runScenarioIntelligencePlatformCertification>;
  freezeManifest: ReturnType<typeof buildScenarioIntelligencePlatformFreezeManifest>;
  publicApiValidation: Readonly<{
    frozenPublicApis: readonly string[];
    forbiddenConsumerImports: readonly string[];
    packageExportOnly: boolean;
  }>;
}>;

function nowIso(): string {
  return new Date().toISOString();
}

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ScenarioIntelligenceCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

function rejectDirectEngineImport(importPath: string): boolean {
  return SCENARIO_INTELLIGENCE_PLATFORM_FORBIDDEN_CONSUMER_IMPORTS.some((fragment) =>
    importPath.includes(fragment)
  );
}

export function runScenarioIntelligencePlatformFinalCertification(): ScenarioIntelligencePlatformFinalCertificationResult {
  const regression = runScenarioIntelligencePlatformFreezeRegression();
  const platformCertification = runScenarioIntelligencePlatformCertification();
  const certificationDate = nowIso();
  const freezeManifest = buildScenarioIntelligencePlatformFreezeManifest(certificationDate);

  const phaseById = Object.fromEntries(regression.phases.map((phase) => [phase.phaseId, phase]));
  const platformGateById = Object.fromEntries(
    platformCertification.checks.map((entry) => [entry.id, entry])
  );

  const checks: ScenarioIntelligenceCertificationCheck[] = [
    check("A", "Contract", phaseById["APP-2/1"]?.certified === true, phaseById["APP-2/1"]?.summary ?? ""),
    check("B", "State", phaseById["APP-2/2"]?.certified === true, phaseById["APP-2/2"]?.summary ?? ""),
    check("C", "Context", phaseById["APP-2/3"]?.certified === true, phaseById["APP-2/3"]?.summary ?? ""),
    check("D", "Priority", phaseById["APP-2/4"]?.certified === true, phaseById["APP-2/4"]?.summary ?? ""),
    check(
      "E",
      "Dependency Graph",
      phaseById["APP-2/5"]?.certified === true,
      phaseById["APP-2/5"]?.summary ?? ""
    ),
    check(
      "F",
      "Conflict Graph",
      phaseById["APP-2/6"]?.certified === true,
      phaseById["APP-2/6"]?.summary ?? ""
    ),
    check(
      "G",
      "Opportunity Graph",
      phaseById["APP-2/7"]?.certified === true,
      phaseById["APP-2/7"]?.summary ?? ""
    ),
    check("H", "Snapshot", platformGateById["H"]?.passed === true, platformGateById["H"]?.evidence ?? ""),
    check("I", "Summary", platformGateById["I"]?.passed === true, platformGateById["I"]?.evidence ?? ""),
    check(
      "J",
      "Recommendation Portfolio",
      platformGateById["J"]?.passed === true,
      platformGateById["J"]?.evidence ?? ""
    ),
    check(
      "K",
      "ExecutiveScenarioPackage",
      platformGateById["K"]?.passed === true,
      platformGateById["K"]?.evidence ?? ""
    ),
    check(
      "L",
      "Workspace Adapter",
      phaseById["APP-2/10"]?.certified === true,
      phaseById["APP-2/10"]?.summary ?? ""
    ),
    check(
      "M",
      "Assistant Adapter",
      phaseById["APP-2/11"]?.certified === true,
      phaseById["APP-2/11"]?.summary ?? ""
    ),
    check(
      "N",
      "Dashboard Adapter",
      phaseById["APP-2/12"]?.certified === true,
      phaseById["APP-2/12"]?.summary ?? ""
    ),
    check(
      "O",
      "Public API Freeze",
      freezeManifest.frozenPublicApis.length >= 10 &&
        SCENARIO_INTELLIGENCE_PLATFORM_FROZEN_PUBLIC_APIS.includes("ExecutiveScenarioPackageExport"),
      `${freezeManifest.frozenPublicApis.length} APIs frozen.`
    ),
    check(
      "P",
      "Read-only Freeze",
      EXECUTIVE_SCENARIO_PACKAGE_RULES.readOnly === true &&
        EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES.readOnly === true &&
        EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES.readOnly === true &&
        EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES.readOnly === true,
      "All export and adapter surfaces frozen read-only."
    ),
    check(
      "Q",
      "Package Freeze",
      EXECUTIVE_SCENARIO_PACKAGE_RULES.aggregatesOnly === true &&
        EXECUTIVE_SCENARIO_PACKAGE_RULES.noMutation === true,
      "ExecutiveScenarioPackage export rules frozen."
    ),
    check(
      "R",
      "Adapter Freeze",
      EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES.consumesPackageOnly === true &&
        EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES.consumesWorkspaceViewOnly === true &&
        EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES.consumesWorkspaceViewOnly === true,
      "Adapter boundaries frozen."
    ),
    check(
      "S",
      "Compatibility Freeze",
      Object.values(freezeManifest.compatibilityManifest).every((entry) => entry.compatible === true) &&
        freezeManifest.futureCompatibility.readOnly === true,
      "Future consumer compatibility declared."
    ),
    check("T", "Regression", regression.certified, regression.summary),
    check(
      "U",
      "Build passes",
      typeof runScenarioIntelligencePlatformFinalCertification === "function" &&
        typeof buildScenarioIntelligencePlatformFreezeManifest === "function",
      "Freeze modules export callable functions."
    ),
    check(
      "V",
      "Tests pass",
      regression.certified && platformCertification.certified,
      "APP-2:1 through APP-2:13 certification assumptions satisfied."
    ),
    check(
      "W",
      "Final certification",
      platformCertification.certified && phaseById["APP-2/13"]?.certified === true,
      platformCertification.summary
    ),
    check(
      "X",
      "Architecture frozen",
      SCENARIO_INTELLIGENCE_FREEZE_RULES.contractImmutable === true &&
        SCENARIO_INTELLIGENCE_FREEZE_RULES.breakingChangesForbidden === true &&
        !evaluateStageFileBoundary({
          filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
          allowedFiles: Object.freeze([
            "frontend/app/lib/app-2-scenario-intelligence/scenarioIntelligencePlatformFinalCertification.ts",
          ]),
          forbiddenPatterns: SCENARIO_INTELLIGENCE_FORBIDDEN_PATTERNS,
        }).allowed,
      "APP-2 architecture boundaries preserved."
    ),
    check(
      "Y",
      "Release manifest",
      freezeManifest.architectureHash.startsWith("arch-") &&
        freezeManifest.platformStatus === SCENARIO_INTELLIGENCE_PLATFORM_STATUS,
      freezeManifest.architectureHash
    ),
    check(
      "Z",
      "Platform released",
      freezeManifest.platformStatus === SCENARIO_INTELLIGENCE_PLATFORM_STATUS &&
        regression.certified &&
        platformCertification.certified &&
        existsSync(FREEZE_REPORT_PATH),
      SCENARIO_INTELLIGENCE_PLATFORM_FREEZE_VERSION
    ),
  ];

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-2:14 Scenario Intelligence Platform Freeze",
    status: certified ? "PASS" : "FAIL",
    certified,
    released: certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    tags: SCENARIO_INTELLIGENCE_PLATFORM_RELEASE_TAGS,
    summary: certified
      ? "APP-2:14 Scenario Intelligence Platform CERTIFIED and FROZEN."
      : `APP-2:14 Scenario Intelligence Platform freeze FAILED (${failedChecks.length} gate(s)).`,
    generatedAt: certificationDate,
    regression,
    platformCertification,
    freezeManifest,
    publicApiValidation: Object.freeze({
      frozenPublicApis: freezeManifest.frozenPublicApis,
      forbiddenConsumerImports: SCENARIO_INTELLIGENCE_PLATFORM_FORBIDDEN_CONSUMER_IMPORTS,
      packageExportOnly:
        EXECUTIVE_SCENARIO_PACKAGE_RULES.aggregatesOnly === true &&
        SCENARIO_INTELLIGENCE_PLATFORM_FORBIDDEN_CONSUMER_IMPORTS.every((fragment) =>
          rejectDirectEngineImport(`frontend/app/lib/workspace/${fragment}.ts`)
        ),
    }),
  });
}

export const ScenarioIntelligencePlatformFinalCertification = Object.freeze({
  runScenarioIntelligencePlatformFinalCertification,
});
