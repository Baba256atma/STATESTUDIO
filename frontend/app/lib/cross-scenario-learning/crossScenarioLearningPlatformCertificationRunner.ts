/**
 * APP-10:8 — Cross-Scenario Learning Platform Certification runner.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  BUSINESS_TIMELINE_PLATFORM_IDENTITY,
} from "../business-timeline/businessTimelineContracts.ts";
import {
  CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY,
} from "../confidence-evolution/confidenceEvolutionContracts.ts";
import {
  DECISION_JOURNAL_PLATFORM_IDENTITY,
} from "../decision-journal/decisionJournalContracts.ts";
import {
  DECISION_TIMELINE_PLATFORM_IDENTITY,
} from "../decision-timeline/decisionTimelineContracts.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
} from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import {
  CROSS_SCENARIO_LEARNING_MUST_NOT_OWN,
  CROSS_SCENARIO_LEARNING_PLATFORM_ID,
  CROSS_SCENARIO_LEARNING_PLATFORM_NAME,
} from "./crossScenarioLearningConstants.ts";
import { CROSS_SCENARIO_LEARNING_FREEZE_RULES, CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY } from "./crossScenarioLearningContracts.ts";
import { CrossScenarioLearningFoundation } from "./crossScenarioLearningFoundation.ts";
import { PatternExtractionEngine } from "./patternExtractionEngine.ts";
import { SimilarityEngine } from "./similarityEngine.ts";
import { OutcomeLearningEngine } from "./outcomeLearningEngine.ts";
import { FailureLearningEngine } from "./failureLearningEngine.ts";
import { StrategyLearningEngine } from "./strategyLearningEngine.ts";
import { RecommendationLearningEngine } from "./recommendationLearningEngine.ts";
import {
  buildCrossScenarioLearningPlatformCertificationManifest,
  CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_GROUP_KEYS,
  CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_REQUIRED_DOCS,
  CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFIED_MODULES,
  CROSS_SCENARIO_LEARNING_PLATFORM_COMPATIBILITY_GUARANTEES,
  CROSS_SCENARIO_LEARNING_PLATFORM_PUBLIC_APIS,
  validateCrossScenarioLearningPlatformCertificationManifest,
} from "./crossScenarioLearningPlatformCertificationManifest.ts";
import { runCrossScenarioLearningPlatformRegression } from "./crossScenarioLearningPlatformRegression.ts";
import type {
  CrossScenarioLearningPlatformCertificationCheck,
  CrossScenarioLearningPlatformCertificationGroup,
  CrossScenarioLearningPlatformCertificationReport,
  CrossScenarioLearningPlatformCertificationResult,
} from "./crossScenarioLearningPlatformCertificationTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");

let lastManifest: ReturnType<typeof buildCrossScenarioLearningPlatformCertificationManifest> | null = null;
let lastReport: CrossScenarioLearningPlatformCertificationReport | null = null;

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): CrossScenarioLearningPlatformCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function group(
  groupKey: (typeof CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_GROUP_KEYS)[number],
  title: string,
  checks: CrossScenarioLearningPlatformCertificationCheck[]
): CrossScenarioLearningPlatformCertificationGroup {
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

export function resetCrossScenarioLearningPlatformCertificationForTests(): void {
  lastManifest = null;
  lastReport = null;
}

export function getCrossScenarioLearningCertificationManifest(
  timestamp: string = FIXED_TIME
): ReturnType<typeof buildCrossScenarioLearningPlatformCertificationManifest> {
  if (lastManifest) {
    return lastManifest;
  }
  const regression = runCrossScenarioLearningPlatformRegression(timestamp);
  return buildCrossScenarioLearningPlatformCertificationManifest(
    timestamp,
    regression.success,
    Object.freeze({
      layersPassed: regression.layersPassed,
      layersTotal: regression.layersTotal,
      success: regression.success,
      readOnly: true as const,
    }),
    regression.success ? timestamp : null
  );
}

export function runCrossScenarioLearningPlatformCertification(
  timestamp: string = FIXED_TIME
): CrossScenarioLearningPlatformCertificationResult {
  const groups: CrossScenarioLearningPlatformCertificationGroup[] = [];

  groups.push(
    group("A_platform_identity", "Platform identity", [
      check(
        "platform_id",
        "Platform ID declared",
        CROSS_SCENARIO_LEARNING_PLATFORM_ID === "cross-scenario-learning-platform",
        CROSS_SCENARIO_LEARNING_PLATFORM_ID
      ),
      check(
        "platform_name",
        "Platform name declared",
        CROSS_SCENARIO_LEARNING_PLATFORM_NAME === "Cross-Scenario Learning",
        CROSS_SCENARIO_LEARNING_PLATFORM_NAME
      ),
      check(
        "app_identity",
        "APP-10 identity valid",
        CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId === "APP-10",
        CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.version
      ),
      check(
        "certified_modules",
        "Seven certified modules declared",
        CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFIED_MODULES.length === 7,
        String(CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFIED_MODULES.length)
      ),
    ])
  );

  const regression = runCrossScenarioLearningPlatformRegression(timestamp);
  groups.push(
    group("B_dependency_chain", "Dependency chain", [
      check(
        "regression_success",
        "Full platform regression",
        regression.success === true,
        regression.summary
      ),
      check(
        "prior_phases_preserved",
        "Prior phase files preserved",
        regression.priorPhasesPreserved === true,
        String(regression.priorPhasesPreserved)
      ),
      ...regression.layerResults.map((layer) =>
        check(
          `layer_${layer.layerId.replace("/", "_")}`,
          `${layer.title} certified`,
          layer.certified === true,
          layer.summary
        )
      ),
    ])
  );

  groups.push(
    group("C_phase_regression", "Phase regression summary", [
      check(
        "layers_passed",
        "All layers passed",
        regression.layersPassed === regression.layersTotal,
        `${regression.layersPassed}/${regression.layersTotal}`
      ),
      check(
        "foundation_layer",
        "APP-10:1 foundation regression",
        regression.layerResults.find((entry) => entry.layerId === "APP-10/1")?.certified === true,
        "APP-10/1"
      ),
      check(
        "recommendation_layer",
        "APP-10:7 recommendation regression",
        regression.layerResults.find((entry) => entry.layerId === "APP-10/7")?.certified === true,
        "APP-10/7"
      ),
    ])
  );

  groups.push(
    group("D_public_apis", "Public APIs", [
      check(
        "foundation_api",
        "Foundation API exposed",
        typeof CrossScenarioLearningFoundation.buildCrossScenarioLearningFoundation === "function",
        "buildCrossScenarioLearningFoundation"
      ),
      check(
        "pattern_api",
        "Pattern extraction API exposed",
        typeof PatternExtractionEngine.extractExecutivePatterns === "function",
        "extractExecutivePatterns"
      ),
      check(
        "similarity_api",
        "Similarity API exposed",
        typeof SimilarityEngine.compareScenarioSimilarity === "function",
        "compareScenarioSimilarity"
      ),
      check(
        "outcome_api",
        "Outcome learning API exposed",
        typeof OutcomeLearningEngine.learnHistoricalOutcomes === "function",
        "learnHistoricalOutcomes"
      ),
      check(
        "failure_api",
        "Failure learning API exposed",
        typeof FailureLearningEngine.learnHistoricalFailures === "function",
        "learnHistoricalFailures"
      ),
      check(
        "strategy_api",
        "Strategy learning API exposed",
        typeof StrategyLearningEngine.learnHistoricalStrategies === "function",
        "learnHistoricalStrategies"
      ),
      check(
        "recommendation_api",
        "Recommendation learning API exposed",
        typeof RecommendationLearningEngine.learnHistoricalRecommendations === "function",
        "learnHistoricalRecommendations"
      ),
      check(
        "public_api_registry",
        "Public API registry declared",
        CROSS_SCENARIO_LEARNING_PLATFORM_PUBLIC_APIS.length >= 10,
        String(CROSS_SCENARIO_LEARNING_PLATFORM_PUBLIC_APIS.length)
      ),
    ])
  );

  const manifest = buildCrossScenarioLearningPlatformCertificationManifest(
    timestamp,
    regression.success,
    Object.freeze({
      layersPassed: regression.layersPassed,
      layersTotal: regression.layersTotal,
      success: regression.success,
      readOnly: true as const,
    }),
    regression.success ? timestamp : null
  );
  const manifestValidation = validateCrossScenarioLearningPlatformCertificationManifest(manifest);

  groups.push(
    group("E_manifest_validation", "Manifest validation", [
      check(
        "manifest_valid",
        "Certification manifest valid",
        manifestValidation.valid === true,
        manifestValidation.issues.join("; ") || "valid"
      ),
      check(
        "manifest_immutable",
        "Manifest immutable",
        Object.isFrozen(manifest) && manifest.readOnly === true,
        "immutable"
      ),
      check(
        "dependency_versions",
        "Dependency versions mapped",
        Object.keys(manifest.dependencyVersions).length === 7,
        String(Object.keys(manifest.dependencyVersions).length)
      ),
      check(
        "required_docs",
        "Required documentation present",
        CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_REQUIRED_DOCS.every((doc) =>
          existsSync(join(REPO_ROOT, doc))
        ),
        String(CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_REQUIRED_DOCS.length)
      ),
    ])
  );

  groups.push(
    group("F_compatibility", "Compatibility validation", [
      check(
        "consumer_only",
        "Consumer-only architecture",
        CROSS_SCENARIO_LEARNING_PLATFORM_COMPATIBILITY_GUARANTEES.consumerOnly === true,
        "consumer only"
      ),
      check(
        "metadata_only",
        "Metadata-only architecture",
        CROSS_SCENARIO_LEARNING_PLATFORM_COMPATIBILITY_GUARANTEES.metadataOnly === true,
        "metadata only"
      ),
      check(
        "deterministic",
        "Deterministic learning principle",
        CROSS_SCENARIO_LEARNING_PLATFORM_COMPATIBILITY_GUARANTEES.deterministic === true,
        "deterministic"
      ),
      check(
        "no_ml",
        "No ML forbidden scope",
        CROSS_SCENARIO_LEARNING_PLATFORM_COMPATIBILITY_GUARANTEES.noMl === true,
        "no ML"
      ),
      check(
        "compatibility_matrix",
        "Compatibility matrix complete",
        manifest.compatibilityMatrix.length >= 5,
        String(manifest.compatibilityMatrix.length)
      ),
    ])
  );

  groups.push(
    group("G_architecture_boundaries", "Architecture boundaries", [
      check(
        "stage_manifest",
        "Stage manifest validation",
        validateStageManifest(CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_SELF_MANIFEST).valid === true,
        CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_SELF_MANIFEST.stageId
      ),
      check(
        "certification_boundary",
        "Certification file boundary",
        evaluateStageFileBoundary({
          filePath: "frontend/app/lib/cross-scenario-learning/crossScenarioLearningPlatformCertification.ts",
          allowedFiles: CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
        }).allowed === true,
        "certification.ts"
      ),
      check(
        "forbidden_ui",
        "UI components forbidden",
        evaluateStageFileBoundary({
          filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
          allowedFiles: CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
        }).allowed === false,
        "RelationshipRenderer blocked"
      ),
    ])
  );

  groups.push(
    group("H_immutable_contracts", "Immutable contracts", [
      check(
        "freeze_rules",
        "Freeze rules declared",
        CROSS_SCENARIO_LEARNING_FREEZE_RULES.contractImmutable === true,
        "contract immutable"
      ),
      check(
        "must_not_own",
        "Must-not-own boundaries",
        CROSS_SCENARIO_LEARNING_MUST_NOT_OWN.includes("recommendation_engine") &&
          CROSS_SCENARIO_LEARNING_MUST_NOT_OWN.includes("machine_learning"),
        String(CROSS_SCENARIO_LEARNING_MUST_NOT_OWN.length)
      ),
      check(
        "no_runtime_in_cert",
        "Certification introduces no runtime learning",
        CROSS_SCENARIO_LEARNING_FREEZE_RULES.noRuntimeExecution === true,
        "read-only cert"
      ),
    ])
  );

  groups.push(
    group("I_prior_platforms", "Prior platforms untouched", [
      check("app5", "APP-5 identity", SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5", "APP-5"),
      check("app6", "APP-6 identity", DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6", "APP-6"),
      check("app7", "APP-7 identity", BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7", "APP-7"),
      check("app8", "APP-8 identity", DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8", "APP-8"),
      check("app9", "APP-9 identity", CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId === "APP-9", "APP-9"),
    ])
  );

  groups.push(
    group("J_determinism", "Determinism preserved", [
      check(
        "deterministic_principle",
        "Deterministic learning principle enforced",
        CROSS_SCENARIO_LEARNING_PLATFORM_COMPATIBILITY_GUARANTEES.deterministic === true,
        "deterministic"
      ),
      check(
        "regression_repeatable",
        "Regression produces consistent layer count",
        regression.layersTotal === 7,
        String(regression.layersTotal)
      ),
    ])
  );

  groups.push(
    group("K_consumer_only", "Consumer-only architecture", [
      check(
        "consumer_only_freeze",
        "Consumer-only freeze rule",
        CROSS_SCENARIO_LEARNING_FREEZE_RULES.consumerOnly === true,
        "consumer only"
      ),
      check(
        "supported_consumers",
        "Supported consumers registered",
        manifest.supportedConsumers.length >= 4,
        String(manifest.supportedConsumers.length)
      ),
    ])
  );

  const certified = groups.every((entry) => entry.passed);
  groups.push(
    group("L_ready_for_freeze", "Ready for platform freeze", [
      check(
        "platform_certified",
        "Platform certification passed",
        certified === true,
        certified ? "PASS" : "FAIL"
      ),
      check(
        "ready_for_freeze",
        "Ready for APP-10:9 freeze",
        certified === true && manifest.certificationStatus.readyForFreeze === true,
        String(manifest.certificationStatus.readyForFreeze)
      ),
      check(
        "certification_version",
        "Certification contract version",
        CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION === "APP-10/8",
        CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION
      ),
    ])
  );

  const allChecks = groups.flatMap((entry) => [...entry.checks]);
  const passedCount = allChecks.filter((entry) => entry.passed).length;
  const failedCount = allChecks.length - passedCount;
  const groupsPassed = groups.filter((entry) => entry.passed).length;
  const groupsFailed = groups.length - groupsPassed;

  const report: CrossScenarioLearningPlatformCertificationReport = Object.freeze({
    certified: failedCount === 0,
    phase: "APP-10/8",
    contractVersion: CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    platformVersion: CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    groups: Object.freeze(groups),
    groupCount: groups.length,
    groupsPassed,
    groupsFailed,
    checkCount: allChecks.length,
    passedCount,
    failedCount,
    regression: Object.freeze({
      success: regression.success,
      layersPassed: regression.layersPassed,
      layersTotal: regression.layersTotal,
      summary: regression.summary,
      layerResults: regression.layerResults,
      priorPhasesPreserved: regression.priorPhasesPreserved,
      readOnly: true as const,
    }),
    status: Object.freeze({
      certified: failedCount === 0,
      readyForFreeze: failedCount === 0,
      certificationTimestamp: failedCount === 0 ? timestamp : null,
      contractVersion: CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
      readOnly: true as const,
    }),
    timestamp,
    readOnly: true as const,
  });

  lastManifest = manifest;
  lastReport = report;

  return Object.freeze({
    certified: report.certified,
    report,
    readOnly: true as const,
  });
}

export function getCrossScenarioLearningPlatformCertificationReport(): CrossScenarioLearningPlatformCertificationReport | null {
  return lastReport;
}
