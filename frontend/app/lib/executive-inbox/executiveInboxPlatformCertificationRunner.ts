/**
 * APP-11:7 — Executive Inbox Platform Certification runner.
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
import { EXECUTIVE_INTENT_IDENTITY } from "../executiveIntent/executiveIntentContract.ts";
import { EXECUTIVE_MEMORY_IDENTITY } from "../executiveMemory/executiveMemoryContracts.ts";
import { EXECUTIVE_TIME_FOUNDATION_VERSION } from "../executive-time/executiveTimeContract.ts";
import { SCENARIO_TIMELINE_PLATFORM_IDENTITY } from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import {
  EXECUTIVE_INBOX_MUST_NOT_OWN,
  EXECUTIVE_INBOX_PLATFORM_ID,
  EXECUTIVE_INBOX_PLATFORM_NAME,
} from "./executiveInboxConstants.ts";
import {
  EXECUTIVE_INBOX_FREEZE_RULES,
  EXECUTIVE_INBOX_PLATFORM_IDENTITY,
  validateExecutiveInboxDependencies,
  validateExecutiveInboxFoundation,
} from "./executiveInboxContracts.ts";
import { ExecutiveInboxFoundation } from "./executiveInboxFoundation.ts";
import { ExecutiveInboxAggregationEngine } from "./executiveInboxAggregationEngine.ts";
import { ExecutiveInboxPrioritizationEngine } from "./executiveInboxPrioritizationEngine.ts";
import { ExecutiveInboxNotificationEngine } from "./executiveInboxNotificationEngine.ts";
import { ExecutiveInboxReminderEngine } from "./executiveInboxReminderEngine.ts";
import { ExecutiveInboxSchedulingEngine } from "./executiveInboxSchedulingEngine.ts";
import {
  buildExecutiveInboxPlatformCertificationManifest,
  EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_GROUP_KEYS,
  EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_REQUIRED_DOCS,
  EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  EXECUTIVE_INBOX_PLATFORM_CERTIFIED_MODULES,
  EXECUTIVE_INBOX_PLATFORM_COMPATIBILITY_GUARANTEES,
  EXECUTIVE_INBOX_PLATFORM_PUBLIC_APIS,
  validateExecutiveInboxPlatformCertificationManifest,
} from "./executiveInboxPlatformCertificationManifest.ts";
import { runExecutiveInboxPlatformRegression } from "./executiveInboxPlatformRegression.ts";
import type {
  ExecutiveInboxPlatformCertificationCheck,
  ExecutiveInboxPlatformCertificationGroup,
  ExecutiveInboxPlatformCertificationReport,
  ExecutiveInboxPlatformCertificationResult,
} from "./executiveInboxPlatformCertificationTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");

let lastManifest: ReturnType<typeof buildExecutiveInboxPlatformCertificationManifest> | null = null;
let lastReport: ExecutiveInboxPlatformCertificationReport | null = null;

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ExecutiveInboxPlatformCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function group(
  groupKey: (typeof EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_GROUP_KEYS)[number],
  title: string,
  checks: ExecutiveInboxPlatformCertificationCheck[]
): ExecutiveInboxPlatformCertificationGroup {
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

export function resetExecutiveInboxPlatformCertificationForTests(): void {
  lastManifest = null;
  lastReport = null;
}

export function getExecutiveInboxCertificationManifest(
  timestamp: string = FIXED_TIME
): ReturnType<typeof buildExecutiveInboxPlatformCertificationManifest> {
  if (lastManifest) {
    return lastManifest;
  }
  const regression = runExecutiveInboxPlatformRegression(timestamp);
  return buildExecutiveInboxPlatformCertificationManifest(
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

export function runExecutiveInboxPlatformCertification(
  timestamp: string = FIXED_TIME
): ExecutiveInboxPlatformCertificationResult {
  const groups: ExecutiveInboxPlatformCertificationGroup[] = [];

  groups.push(
    group("A_platform_identity", "Platform identity", [
      check(
        "platform_id",
        "Platform ID declared",
        EXECUTIVE_INBOX_PLATFORM_ID === "executive-inbox-platform",
        EXECUTIVE_INBOX_PLATFORM_ID
      ),
      check(
        "platform_name",
        "Platform name declared",
        EXECUTIVE_INBOX_PLATFORM_NAME === "Executive Inbox",
        EXECUTIVE_INBOX_PLATFORM_NAME
      ),
      check(
        "app_identity",
        "APP-11 identity valid",
        EXECUTIVE_INBOX_PLATFORM_IDENTITY.appId === "APP-11",
        EXECUTIVE_INBOX_PLATFORM_IDENTITY.version
      ),
      check(
        "certified_modules",
        "Six certified modules declared",
        EXECUTIVE_INBOX_PLATFORM_CERTIFIED_MODULES.length === 6,
        String(EXECUTIVE_INBOX_PLATFORM_CERTIFIED_MODULES.length)
      ),
    ])
  );

  const regression = runExecutiveInboxPlatformRegression(timestamp);
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
      check(
        "foundation_dependencies",
        "Foundation dependency gates valid",
        validateExecutiveInboxDependencies().valid === true,
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
    group("C_phase_regression", "Phase regression summary", [
      check(
        "layers_passed",
        "All layers passed",
        regression.layersPassed === regression.layersTotal,
        `${regression.layersPassed}/${regression.layersTotal}`
      ),
      check(
        "foundation_layer",
        "APP-11:1 foundation regression",
        regression.layerResults.find((entry) => entry.layerId === "APP-11/1")?.certified === true,
        "APP-11/1"
      ),
      check(
        "scheduling_layer",
        "APP-11:6 scheduling regression",
        regression.layerResults.find((entry) => entry.layerId === "APP-11/6")?.certified === true,
        "APP-11/6"
      ),
    ])
  );

  groups.push(
    group("D_public_apis", "Public APIs", [
      check(
        "foundation_api",
        "Foundation API exposed",
        typeof ExecutiveInboxFoundation.buildExecutiveInboxFoundation === "function",
        "buildExecutiveInboxFoundation"
      ),
      check(
        "aggregation_api",
        "Aggregation API exposed",
        typeof ExecutiveInboxAggregationEngine.aggregateExecutiveInbox === "function",
        "aggregateExecutiveInbox"
      ),
      check(
        "prioritization_api",
        "Prioritization API exposed",
        typeof ExecutiveInboxPrioritizationEngine.prioritizeExecutiveInbox === "function",
        "prioritizeExecutiveInbox"
      ),
      check(
        "notification_api",
        "Notification API exposed",
        typeof ExecutiveInboxNotificationEngine.generateExecutiveNotifications === "function",
        "generateExecutiveNotifications"
      ),
      check(
        "reminder_api",
        "Reminder API exposed",
        typeof ExecutiveInboxReminderEngine.generateExecutiveReminders === "function",
        "generateExecutiveReminders"
      ),
      check(
        "scheduling_api",
        "Scheduling API exposed",
        typeof ExecutiveInboxSchedulingEngine.generateExecutiveScheduleIntents === "function",
        "generateExecutiveScheduleIntents"
      ),
      check(
        "public_api_registry",
        "Public API registry declared",
        EXECUTIVE_INBOX_PLATFORM_PUBLIC_APIS.length >= 10,
        String(EXECUTIVE_INBOX_PLATFORM_PUBLIC_APIS.length)
      ),
    ])
  );

  const manifest = buildExecutiveInboxPlatformCertificationManifest(
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
  const manifestValidation = validateExecutiveInboxPlatformCertificationManifest(manifest);

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
        Object.keys(manifest.dependencyVersions).length === 6,
        String(Object.keys(manifest.dependencyVersions).length)
      ),
      check(
        "required_docs",
        "Required documentation present",
        EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_REQUIRED_DOCS.every((doc) =>
          existsSync(join(REPO_ROOT, doc))
        ),
        String(EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_REQUIRED_DOCS.length)
      ),
    ])
  );

  groups.push(
    group("F_compatibility", "Compatibility validation", [
      check(
        "consumer_only",
        "Consumer-only architecture",
        EXECUTIVE_INBOX_PLATFORM_COMPATIBILITY_GUARANTEES.consumerOnly === true,
        "consumer only"
      ),
      check(
        "metadata_only",
        "Metadata-only architecture",
        EXECUTIVE_INBOX_PLATFORM_COMPATIBILITY_GUARANTEES.metadataOnly === true,
        "metadata only"
      ),
      check(
        "deterministic",
        "Deterministic inbox principle",
        EXECUTIVE_INBOX_PLATFORM_COMPATIBILITY_GUARANTEES.deterministic === true,
        "deterministic"
      ),
      check(
        "no_delivery",
        "No delivery or execution forbidden scope",
        EXECUTIVE_INBOX_PLATFORM_COMPATIBILITY_GUARANTEES.noDelivery === true,
        "no delivery"
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
        validateStageManifest(EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_SELF_MANIFEST).valid === true,
        EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_SELF_MANIFEST.stageId
      ),
      check(
        "certification_boundary",
        "Certification file boundary",
        evaluateStageFileBoundary({
          filePath: "frontend/app/lib/executive-inbox/executiveInboxPlatformCertification.ts",
          allowedFiles: EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
        }).allowed === true,
        "certification.ts"
      ),
      check(
        "forbidden_ui",
        "UI components forbidden",
        evaluateStageFileBoundary({
          filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
          allowedFiles: EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
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
        EXECUTIVE_INBOX_FREEZE_RULES.contractImmutable === true,
        "contract immutable"
      ),
      check(
        "must_not_own",
        "Must-not-own boundaries",
        EXECUTIVE_INBOX_MUST_NOT_OWN.includes("notification_delivery") &&
          EXECUTIVE_INBOX_MUST_NOT_OWN.includes("scheduling_engine"),
        String(EXECUTIVE_INBOX_MUST_NOT_OWN.length)
      ),
      check(
        "foundation_validation",
        "Foundation validation passes",
        validateExecutiveInboxFoundation(timestamp).valid === true,
        "valid"
      ),
    ])
  );

  groups.push(
    group("I_prior_platforms", "Prior platforms untouched", [
      check("app1", "APP-1 identity", EXECUTIVE_TIME_FOUNDATION_VERSION.startsWith("APP-1"), "APP-1"),
      check("app2", "APP-2 identity", SCENARIO_INTELLIGENCE_IDENTITY.appId === "APP-2", "APP-2"),
      check("app3", "APP-3 identity", EXECUTIVE_INTENT_IDENTITY.appId === "APP-3", "APP-3"),
      check("app4", "APP-4 identity", EXECUTIVE_MEMORY_IDENTITY.appId === "APP-4", "APP-4"),
      check("app5", "APP-5 identity", SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5", "APP-5"),
      check("app6", "APP-6 identity", DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6", "APP-6"),
      check("app7", "APP-7 identity", BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7", "APP-7"),
      check("app8", "APP-8 identity", DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8", "APP-8"),
      check("app9", "APP-9 identity", CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId === "APP-9", "APP-9"),
      check("app10", "APP-10 identity", CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId === "APP-10", "APP-10"),
    ])
  );

  groups.push(
    group("J_determinism", "Determinism preserved", [
      check(
        "deterministic_principle",
        "Deterministic inbox principle enforced",
        EXECUTIVE_INBOX_PLATFORM_COMPATIBILITY_GUARANTEES.deterministic === true,
        "deterministic"
      ),
      check(
        "regression_repeatable",
        "Regression produces consistent layer count",
        regression.layersTotal === 6,
        String(regression.layersTotal)
      ),
    ])
  );

  groups.push(
    group("K_consumer_only", "Consumer-only architecture", [
      check(
        "consumer_only_freeze",
        "Consumer-only freeze rule",
        EXECUTIVE_INBOX_FREEZE_RULES.consumerOnly === true,
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
        "Ready for APP-11:8 freeze",
        certified === true && manifest.certificationStatus.readyForFreeze === true,
        String(manifest.certificationStatus.readyForFreeze)
      ),
      check(
        "certification_version",
        "Certification contract version",
        EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION === "APP-11/7",
        EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION
      ),
    ])
  );

  const allChecks = groups.flatMap((entry) => [...entry.checks]);
  const passedCount = allChecks.filter((entry) => entry.passed).length;
  const failedCount = allChecks.length - passedCount;
  const groupsPassed = groups.filter((entry) => entry.passed).length;
  const groupsFailed = groups.length - groupsPassed;

  const report: ExecutiveInboxPlatformCertificationReport = Object.freeze({
    certified: failedCount === 0,
    phase: "APP-11/7",
    contractVersion: EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    platformVersion: EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
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
      contractVersion: EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
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

export function getExecutiveInboxPlatformCertificationReport(): ExecutiveInboxPlatformCertificationReport | null {
  return lastReport;
}
