/**
 * APP-12:8 — Executive Recommendation Platform Certification runner.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { SCENARIO_INTELLIGENCE_IDENTITY } from "../app-2-scenario-intelligence/scenarioIntelligenceContract.ts";
import { BUSINESS_TIMELINE_PLATFORM_IDENTITY } from "../business-timeline/businessTimelineContracts.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "../confidence-evolution/confidenceEvolutionContracts.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY } from "../cross-scenario-learning/crossScenarioLearningContracts.ts";
import { DECISION_JOURNAL_PLATFORM_IDENTITY } from "../decision-journal/decisionJournalContracts.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import { EXECUTIVE_INBOX_PLATFORM_ID } from "../executive-inbox/executiveInboxConstants.ts";
import { EXECUTIVE_INTENT_IDENTITY } from "../executiveIntent/executiveIntentContract.ts";
import { EXECUTIVE_MEMORY_IDENTITY } from "../executiveMemory/executiveMemoryContracts.ts";
import { EXECUTIVE_TIME_FOUNDATION_VERSION } from "../executive-time/executiveTimeContract.ts";
import { SCENARIO_TIMELINE_PLATFORM_IDENTITY } from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import {
  EXECUTIVE_RECOMMENDATION_MUST_NOT_OWN,
  EXECUTIVE_RECOMMENDATION_PLATFORM_ID,
  EXECUTIVE_RECOMMENDATION_PLATFORM_NAME,
} from "./executiveRecommendationConstants.ts";
import {
  EXECUTIVE_RECOMMENDATION_FREEZE_RULES,
  EXECUTIVE_RECOMMENDATION_PLATFORM_IDENTITY,
  validateExecutiveRecommendationDependencies,
  validateExecutiveRecommendationFoundation,
} from "./executiveRecommendationContracts.ts";
import { ExecutiveRecommendationFoundation } from "./executiveRecommendationFoundation.ts";
import { ExecutiveRecommendationGenerationEngine } from "./executiveRecommendationGenerationEngine.ts";
import { ExecutiveRecommendationEvaluationEngine } from "./executiveRecommendationEvaluationEngine.ts";
import { ExecutiveRecommendationExplainabilityEngine } from "./executiveRecommendationExplainabilityEngine.ts";
import { ExecutiveRecommendationGovernanceEngine } from "./executiveRecommendationGovernanceEngine.ts";
import { ExecutiveRecommendationOptimizationEngine } from "./executiveRecommendationOptimizationEngine.ts";
import { ExecutiveRecommendationDeliveryEngine } from "./executiveRecommendationDeliveryEngine.ts";
import {
  buildExecutiveRecommendationPlatformCertificationManifest,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_GROUP_KEYS,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_REQUIRED_DOCS,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFIED_PHASES,
  EXECUTIVE_RECOMMENDATION_PLATFORM_COMPATIBILITY_GUARANTEES,
  EXECUTIVE_RECOMMENDATION_PLATFORM_PUBLIC_APIS,
  validateExecutiveRecommendationPlatformCertificationManifest,
} from "./executiveRecommendationPlatformCertificationManifest.ts";
import { runExecutiveRecommendationPlatformRegression } from "./executiveRecommendationPlatformRegression.ts";
import type {
  CertificationCheck,
  CertificationGroup,
  CertificationReport,
  PlatformCertification,
} from "./executiveRecommendationPlatformCertificationTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");

let lastManifest: ReturnType<typeof buildExecutiveRecommendationPlatformCertificationManifest> | null = null;
let lastReport: CertificationReport | null = null;

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): CertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function group(
  groupKey: (typeof EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_GROUP_KEYS)[number],
  title: string,
  checks: CertificationCheck[]
): CertificationGroup {
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

export function resetExecutiveRecommendationPlatformCertificationForTests(): void {
  lastManifest = null;
  lastReport = null;
}

export function getExecutiveRecommendationCertificationManifest(
  timestamp: string = FIXED_TIME
): ReturnType<typeof buildExecutiveRecommendationPlatformCertificationManifest> {
  if (lastManifest) {
    return lastManifest;
  }
  const regression = runExecutiveRecommendationPlatformRegression(timestamp);
  return buildExecutiveRecommendationPlatformCertificationManifest(
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

export function getExecutiveRecommendationPlatformCertificationReport(
  timestamp: string = FIXED_TIME
): CertificationReport {
  if (lastReport) {
    return lastReport;
  }
  return runExecutiveRecommendationPlatformCertification(timestamp).report;
}

export function runExecutiveRecommendationPlatformCertification(
  timestamp: string = FIXED_TIME
): PlatformCertification {
  const groups: CertificationGroup[] = [];

  groups.push(
    group("A_platform_identity", "Platform Identity", [
      check(
        "platform_id",
        "Platform ID declared",
        EXECUTIVE_RECOMMENDATION_PLATFORM_ID === "executive-recommendation-platform",
        EXECUTIVE_RECOMMENDATION_PLATFORM_ID
      ),
      check(
        "platform_name",
        "Platform name declared",
        EXECUTIVE_RECOMMENDATION_PLATFORM_NAME === "Executive Recommendation",
        EXECUTIVE_RECOMMENDATION_PLATFORM_NAME
      ),
      check(
        "app_identity",
        "APP-12 identity valid",
        EXECUTIVE_RECOMMENDATION_PLATFORM_IDENTITY.appId === "APP-12",
        EXECUTIVE_RECOMMENDATION_PLATFORM_IDENTITY.version
      ),
      check(
        "certified_phases",
        "Seven certified phases declared",
        EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFIED_PHASES.length === 7,
        String(EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFIED_PHASES.length)
      ),
    ])
  );

  const regression = runExecutiveRecommendationPlatformRegression(timestamp);
  groups.push(
    group("B_dependency_chain", "Dependency Chain", [
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
      check(
        "foundation_dependencies",
        "Foundation dependency gates valid",
        validateExecutiveRecommendationDependencies().valid === true,
        "dependency gates"
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
    group("C_phase_regression", "Phase Regression", [
      check(
        "layers_passed",
        "All layers passed",
        regression.layersPassed === regression.layersTotal,
        `${regression.layersPassed}/${regression.layersTotal}`
      ),
      check(
        "foundation_layer",
        "APP-12:1 foundation regression",
        regression.layerResults.find((entry) => entry.layerId === "APP-12/1")?.certified === true,
        "APP-12/1"
      ),
      check(
        "delivery_layer",
        "APP-12:7 delivery regression",
        regression.layerResults.find((entry) => entry.layerId === "APP-12/7")?.certified === true,
        "APP-12/7"
      ),
    ])
  );

  groups.push(
    group("D_public_apis", "Public APIs", [
      check(
        "foundation_api",
        "Foundation API exposed",
        typeof ExecutiveRecommendationFoundation.buildExecutiveRecommendationFoundation === "function",
        "buildExecutiveRecommendationFoundation"
      ),
      check(
        "generation_api",
        "Generation API exposed",
        typeof ExecutiveRecommendationGenerationEngine.generateExecutiveRecommendations === "function",
        "generateExecutiveRecommendations"
      ),
      check(
        "evaluation_api",
        "Evaluation API exposed",
        typeof ExecutiveRecommendationEvaluationEngine.evaluateExecutiveRecommendations === "function",
        "evaluateExecutiveRecommendations"
      ),
      check(
        "explainability_api",
        "Explainability API exposed",
        typeof ExecutiveRecommendationExplainabilityEngine.explainExecutiveRecommendations === "function",
        "explainExecutiveRecommendations"
      ),
      check(
        "governance_api",
        "Governance API exposed",
        typeof ExecutiveRecommendationGovernanceEngine.validateExecutiveRecommendationGovernance === "function",
        "validateExecutiveRecommendationGovernance"
      ),
      check(
        "optimization_api",
        "Optimization API exposed",
        typeof ExecutiveRecommendationOptimizationEngine.optimizeExecutiveRecommendations === "function",
        "optimizeExecutiveRecommendations"
      ),
      check(
        "delivery_api",
        "Delivery API exposed",
        typeof ExecutiveRecommendationDeliveryEngine.prepareExecutiveRecommendationDelivery === "function",
        "prepareExecutiveRecommendationDelivery"
      ),
      check(
        "public_api_registry",
        "Public API registry declared",
        EXECUTIVE_RECOMMENDATION_PLATFORM_PUBLIC_APIS.length >= 12,
        String(EXECUTIVE_RECOMMENDATION_PLATFORM_PUBLIC_APIS.length)
      ),
    ])
  );

  groups.push(
    group("E_contract_integrity", "Contract Integrity", [
      check(
        "foundation_validation",
        "Foundation contract validation",
        validateExecutiveRecommendationFoundation(timestamp).valid === true,
        "foundation valid"
      ),
      check(
        "generation_version",
        "Generation engine version",
        ExecutiveRecommendationGenerationEngine.version === "APP-12/2",
        "APP-12/2"
      ),
      check(
        "delivery_version",
        "Delivery engine version",
        ExecutiveRecommendationDeliveryEngine.version === "APP-12/7",
        "APP-12/7"
      ),
      check(
        "must_not_own",
        "Must-not-own constraints declared",
        EXECUTIVE_RECOMMENDATION_MUST_NOT_OWN.includes("recommendation_execution"),
        "execution forbidden"
      ),
    ])
  );

  const manifest = buildExecutiveRecommendationPlatformCertificationManifest(
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
  const manifestValidation = validateExecutiveRecommendationPlatformCertificationManifest(manifest);

  groups.push(
    group("F_manifest_integrity", "Manifest Integrity", [
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
        EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_REQUIRED_DOCS.every((doc) =>
          existsSync(join(REPO_ROOT, doc))
        ),
        String(EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_REQUIRED_DOCS.length)
      ),
    ])
  );

  groups.push(
    group("G_compatibility_matrix", "Compatibility Matrix", [
      check(
        "compatibility_entries",
        "Compatibility matrix populated",
        manifest.compatibilityMatrix.length >= 5,
        String(manifest.compatibilityMatrix.length)
      ),
      check(
        "consumer_only_guarantee",
        "Consumer-only guarantee enforced",
        EXECUTIVE_RECOMMENDATION_PLATFORM_COMPATIBILITY_GUARANTEES.consumerOnly === true,
        "consumer only"
      ),
      check(
        "metadata_only_guarantee",
        "Metadata-only guarantee enforced",
        EXECUTIVE_RECOMMENDATION_PLATFORM_COMPATIBILITY_GUARANTEES.metadataOnly === true,
        "metadata only"
      ),
      check(
        "prior_platforms",
        "Prior APP platforms untouched",
        SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
          DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6" &&
          DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8" &&
          CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId === "APP-9" &&
          CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId === "APP-10" &&
          EXECUTIVE_INBOX_PLATFORM_ID === "executive-inbox-platform",
        "APP-5 through APP-11 verified"
      ),
    ])
  );

  groups.push(
    group("H_consumer_only_architecture", "Consumer-only Architecture", [
      check(
        "consumer_registry",
        "Consumer registry declared",
        manifest.supportedConsumers.length === 4,
        String(manifest.supportedConsumers.length)
      ),
      check(
        "no_execution_ownership",
        "No execution ownership",
        EXECUTIVE_RECOMMENDATION_MUST_NOT_OWN.includes("recommendation_execution"),
        "no execution"
      ),
      check(
        "no_ml_ownership",
        "No ML ownership",
        EXECUTIVE_RECOMMENDATION_MUST_NOT_OWN.includes("machine_learning"),
        "no ML"
      ),
      check(
        "upstream_identities",
        "Upstream platform identities valid",
        EXECUTIVE_TIME_FOUNDATION_VERSION.startsWith("APP-1") &&
          SCENARIO_INTELLIGENCE_IDENTITY.appId === "APP-2" &&
          EXECUTIVE_INTENT_IDENTITY.appId === "APP-3" &&
          EXECUTIVE_MEMORY_IDENTITY.appId === "APP-4" &&
          BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7",
        "APP-1 through APP-7 verified"
      ),
    ])
  );

  groups.push(
    group("I_determinism", "Determinism", [
      check(
        "deterministic_principle",
        "Deterministic principle declared",
        EXECUTIVE_RECOMMENDATION_PLATFORM_COMPATIBILITY_GUARANTEES.deterministic === true,
        "deterministic"
      ),
      check(
        "generation_deterministic",
        "Generation engine deterministic rules",
        ExecutiveRecommendationGenerationEngine.publicApiRules?.deterministicOnly === true,
        "generation deterministic"
      ),
      check(
        "delivery_deterministic",
        "Delivery engine deterministic rules",
        ExecutiveRecommendationDeliveryEngine.publicApiRules?.deterministicOnly === true,
        "delivery deterministic"
      ),
    ])
  );

  groups.push(
    group("J_immutable_contracts", "Immutable Contracts", [
      check(
        "manifest_frozen",
        "Manifest output frozen",
        Object.isFrozen(manifest.phases) && Object.isFrozen(manifest.compatibilityMatrix),
        "frozen"
      ),
      check(
        "regression_frozen",
        "Regression output frozen",
        Object.isFrozen(regression.layerResults) && regression.readOnly === true,
        "frozen"
      ),
      check(
        "freeze_rules",
        "Freeze rules declared",
        EXECUTIVE_RECOMMENDATION_FREEZE_RULES.contractImmutable === true &&
          EXECUTIVE_RECOMMENDATION_FREEZE_RULES.consumerOnly === true,
        "freeze rules"
      ),
    ])
  );

  groups.push(
    group("K_backward_compatibility", "Backward Compatibility", [
      check(
        "foundation_version_stable",
        "Foundation version stable",
        EXECUTIVE_RECOMMENDATION_PLATFORM_COMPATIBILITY_GUARANTEES.foundationVersion === "APP-12/1",
        "APP-12/1"
      ),
      check(
        "backward_compat_guarantee",
        "Backward compatibility guarantee",
        manifest.compatibilityMatrix.some((entry) => entry.guaranteeId === "backward-compatibility"),
        "backward-compatibility"
      ),
      check(
        "stage_manifest",
        "Stage manifest validation",
        validateStageManifest(EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_SELF_MANIFEST).valid === true,
        EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_SELF_MANIFEST.stageId
      ),
    ])
  );

  const groupsPassed = groups.filter((entry) => entry.passed).length;
  const allChecks = groups.flatMap((entry) => [...entry.checks]);
  const passedCount = allChecks.filter((entry) => entry.passed).length;
  const failedCount = allChecks.length - passedCount;
  const certified = groupsPassed === groups.length && regression.success;

  groups.push(
    group("L_freeze_readiness", "Freeze Readiness", [
      check(
        "all_groups_pass",
        "All certification groups pass",
        groupsPassed === EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_GROUP_KEYS.length - 1,
        `${groupsPassed}/${EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_GROUP_KEYS.length - 1}`
      ),
      check(
        "ready_for_freeze",
        "Ready for freeze flag",
        certified === true,
        String(certified)
      ),
      check(
        "architecture_boundary",
        "Architecture file boundary",
        evaluateStageFileBoundary({
          filePath: "frontend/app/lib/executive-recommendation/executiveRecommendationPlatformCertification.ts",
          allowedFiles: EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
        }).allowed === true,
        "executiveRecommendationPlatformCertification.ts"
      ),
      check(
        "certification_version",
        "Certification contract version",
        EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_CONTRACT_VERSION === "APP-12/8",
        "APP-12/8"
      ),
    ])
  );

  const finalGroupsPassed = groups.filter((entry) => entry.passed).length;
  const finalAllChecks = groups.flatMap((entry) => [...entry.checks]);
  const finalPassedCount = finalAllChecks.filter((entry) => entry.passed).length;
  const finalFailedCount = finalAllChecks.length - finalPassedCount;
  const finalCertified = finalGroupsPassed === groups.length && regression.success;

  const report = Object.freeze({
    certified: finalCertified,
    phase: "APP-12/8" as const,
    contractVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    platformVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    groups: Object.freeze(groups),
    groupCount: groups.length,
    groupsPassed: finalGroupsPassed,
    groupsFailed: groups.length - finalGroupsPassed,
    checkCount: finalAllChecks.length,
    passedCount: finalPassedCount,
    failedCount: finalFailedCount,
    regression,
    summary: Object.freeze({
      certified: finalCertified,
      readyForFreeze: finalCertified,
      certificationTimestamp: finalCertified ? timestamp : null,
      contractVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
      readOnly: true as const,
    }),
    timestamp,
    readOnly: true as const,
  });

  lastManifest = buildExecutiveRecommendationPlatformCertificationManifest(
    timestamp,
    finalCertified,
    Object.freeze({
      layersPassed: regression.layersPassed,
      layersTotal: regression.layersTotal,
      success: regression.success,
      readOnly: true as const,
    }),
    finalCertified ? timestamp : null
  );
  lastReport = report;

  return Object.freeze({
    certified: finalCertified,
    report,
    readOnly: true as const,
  });
}
