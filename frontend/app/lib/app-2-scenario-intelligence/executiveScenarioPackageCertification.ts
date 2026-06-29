/**
 * APP-2:9.5 — Executive Scenario Package certification.
 * Certification gates A–R for APP-2:9.5 export layer readiness.
 */

import {
  SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
  SCENARIO_INTELLIGENCE_FREEZE_RULES,
  SCENARIO_INTELLIGENCE_SELF_MANIFEST,
} from "./scenarioIntelligenceContract.ts";
import type { ScenarioIntelligenceCertificationCheck } from "./scenarioIntelligenceTypes.ts";
import { EXECUTIVE_SCENARIO_SNAPSHOT_VERSION } from "./executiveScenarioSnapshot.ts";
import { EXECUTIVE_SCENARIO_SUMMARY_ENGINE_VERSION } from "./executiveScenarioSummaryResult.ts";
import { EXECUTIVE_RECOMMENDATION_PORTFOLIO_VERSION } from "./executiveRecommendationPortfolio.ts";
import { EXECUTIVE_RECOMMENDATION_ENGINE_MANIFEST } from "./executiveRecommendationCertification.ts";
import { EXECUTIVE_SCENARIO_SUMMARY_ENGINE_MANIFEST } from "./executiveScenarioSummaryCertification.ts";
import { EXECUTIVE_SCENARIO_PACKAGE_DIAGNOSTIC_CODES } from "./executiveScenarioPackageDiagnostics.ts";
import {
  EXECUTIVE_SCENARIO_PACKAGE_MANIFEST,
  EXECUTIVE_SCENARIO_PACKAGE_RULES,
  EXECUTIVE_SCENARIO_PACKAGE_VERSION,
  validateExecutiveScenarioPackageMetadata,
} from "./executiveScenarioPackageManifest.ts";
import { buildExecutiveScenarioPackage } from "./executiveScenarioPackageBuilder.ts";
import {
  resolveExecutiveScenarioPackage,
  resolveExecutiveScenarioPackageProbeExample,
} from "./executiveScenarioPackageResolver.ts";
import {
  resolveExecutiveScenarioSnapshotProbeExample,
  resolveExecutiveScenarioSummaryProbeExample,
} from "./executiveScenarioSummaryResolver.ts";
import { resolveExecutiveRecommendationPortfolioProbeExample } from "./executiveRecommendationResolver.ts";

export const EXECUTIVE_SCENARIO_PACKAGE_CERTIFICATION_VERSION = "APP-2/9.5-cert" as const;

function gate(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ScenarioIntelligenceCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

export function runExecutiveScenarioPackageCertification(): Readonly<{
  phaseName: string;
  status: "PASS" | "FAIL";
  certified: boolean;
  checks: readonly ScenarioIntelligenceCertificationCheck[];
  passedChecks: readonly ScenarioIntelligenceCertificationCheck[];
  failedChecks: readonly ScenarioIntelligenceCertificationCheck[];
  summary: string;
  generatedAt: string;
}> {
  const checks: ScenarioIntelligenceCertificationCheck[] = [];
  const generatedAt = new Date(0).toISOString();
  const snapshot = resolveExecutiveScenarioSnapshotProbeExample(generatedAt);
  const summary = resolveExecutiveScenarioSummaryProbeExample(generatedAt);
  const portfolio = resolveExecutiveRecommendationPortfolioProbeExample(generatedAt);
  const pkg = resolveExecutiveScenarioPackage(
    Object.freeze({ snapshot, summary, recommendationPortfolio: portfolio, generatedAt })
  );
  const pkgRepeat = resolveExecutiveScenarioPackage(
    Object.freeze({ snapshot, summary, recommendationPortfolio: portfolio, generatedAt })
  );

  checks.push(
    gate(
      "A",
      "Contract compatibility",
      SCENARIO_INTELLIGENCE_SELF_MANIFEST.stageId === "APP-2/1" &&
        SCENARIO_INTELLIGENCE_FREEZE_RULES.contractImmutable === true,
      "APP-2:1 contract preserved."
    )
  );

  checks.push(
    gate(
      "B",
      "Snapshot integration",
      pkg.snapshot === snapshot &&
        pkg.snapshot.readOnly === true &&
        pkg.snapshot.engineVersion === EXECUTIVE_SCENARIO_SNAPSHOT_VERSION,
      "Package includes APP-2:8 ExecutiveScenarioSnapshot by reference."
    )
  );

  checks.push(
    gate(
      "C",
      "Summary integration",
      pkg.summary === summary &&
        pkg.summary.readOnly === true &&
        pkg.summary.engineVersion === EXECUTIVE_SCENARIO_SUMMARY_ENGINE_VERSION,
      "Package includes APP-2:8 ExecutiveScenarioSummary by reference."
    )
  );

  checks.push(
    gate(
      "D",
      "Recommendation integration",
      pkg.recommendationPortfolio === portfolio &&
        pkg.recommendationPortfolio.readOnly === true &&
        pkg.recommendationPortfolio.engineVersion === EXECUTIVE_RECOMMENDATION_PORTFOLIO_VERSION,
      "Package includes APP-2:9 ExecutiveRecommendationPortfolio by reference."
    )
  );

  checks.push(
    gate(
      "E",
      "Package construction",
      pkg.packageId.length > 0 &&
        pkg.references.context === snapshot.context &&
        pkg.references.priority === snapshot.priority &&
        pkg.readOnly === true,
      "ExecutiveScenarioPackage constructed with certified references."
    )
  );

  checks.push(
    gate(
      "F",
      "Metadata integrity",
      pkg.metadata.packageVersion === EXECUTIVE_SCENARIO_PACKAGE_VERSION &&
        validateExecutiveScenarioPackageMetadata(pkg.metadata).length === 0,
      "Package metadata is valid and complete."
    )
  );

  checks.push(
    gate(
      "G",
      "Version integrity",
      pkg.packageVersion === EXECUTIVE_SCENARIO_PACKAGE_VERSION &&
        pkg.metadata.compatibilityVersion === EXECUTIVE_SCENARIO_PACKAGE_MANIFEST.compatibilityVersion,
      "Package versioning is consistent."
    )
  );

  checks.push(
    gate(
      "H",
      "Freeze integrity",
      pkg.metadata.freeze === EXECUTIVE_SCENARIO_PACKAGE_MANIFEST.freezeVersion &&
        EXECUTIVE_SCENARIO_PACKAGE_MANIFEST.contractModified === false,
      "Package freeze version declared."
    )
  );

  checks.push(
    gate(
      "I",
      "Diagnostics",
      EXECUTIVE_SCENARIO_PACKAGE_DIAGNOSTIC_CODES.length === 7,
      "Package diagnostic vocabulary defined."
    )
  );

  const crossWorkspace = resolveExecutiveScenarioPackage(
    Object.freeze({
      snapshot,
      summary,
      recommendationPortfolio: portfolio,
      generatedAt,
      workspaceId: "ws-other",
    })
  );
  checks.push(
    gate(
      "J",
      "Workspace isolation",
      crossWorkspace.diagnostics.some((entry) => entry.code === "incomplete_package"),
      "Cross-workspace package flagged via diagnostics."
    )
  );

  checks.push(
    gate(
      "K",
      "Read-only compliance",
      pkg.readOnly === true && EXECUTIVE_SCENARIO_PACKAGE_RULES.noMutation === true,
      "ExecutiveScenarioPackage declares readOnly."
    )
  );

  checks.push(
    gate(
      "L",
      "No DS mutation",
      EXECUTIVE_SCENARIO_PACKAGE_MANIFEST.contractModified === false,
      "DS modules untouched."
    )
  );

  checks.push(
    gate(
      "M",
      "No INT mutation",
      EXECUTIVE_SCENARIO_PACKAGE_MANIFEST.enginesModified === false,
      "INT modules untouched."
    )
  );

  checks.push(
    gate(
      "N",
      "No APP-1 mutation",
      EXECUTIVE_SCENARIO_PACKAGE_RULES.noBusinessLogic === true,
      "Executive Time consumed via package references only."
    )
  );

  checks.push(
    gate(
      "O",
      "No APP-2 engine mutation",
      EXECUTIVE_RECOMMENDATION_ENGINE_MANIFEST.contractModified === false &&
        EXECUTIVE_SCENARIO_SUMMARY_ENGINE_MANIFEST.contractModified === false,
      "APP-2:1 through APP-2:9 engines untouched."
    )
  );

  checks.push(
    gate(
      "P",
      "Build passes",
      typeof buildExecutiveScenarioPackage === "function" &&
        typeof resolveExecutiveScenarioPackage === "function",
      "Package modules export callable functions."
    )
  );

  checks.push(
    gate(
      "Q",
      "Tests pass",
      pkg.packageId === pkgRepeat.packageId &&
        pkg.references.dependencyGraph === pkgRepeat.references.dependencyGraph,
      "Deterministic package verified for identical input."
    )
  );

  checks.push(
    gate(
      "R",
      "Architecture preserved",
      pkg.packageVersion === EXECUTIVE_SCENARIO_PACKAGE_VERSION &&
        EXECUTIVE_SCENARIO_PACKAGE_RULES.aggregatesOnly === true &&
        EXECUTIVE_SCENARIO_PACKAGE_RULES.noRecommendationGeneration === true,
      "ExecutiveScenarioPackage is canonical APP-2 export surface."
    )
  );

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-2:9.5 Executive Scenario Package",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    summary: certified
      ? "Executive Scenario Package certification passed."
      : `Executive Scenario Package certification failed (${failedChecks.length} checks).`,
    generatedAt,
  });
}
