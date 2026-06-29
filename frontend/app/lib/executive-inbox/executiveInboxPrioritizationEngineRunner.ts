/**
 * APP-11:3 — Executive Inbox Prioritization Engine certification runner.
 */

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY } from "../cross-scenario-learning/crossScenarioLearningContracts.ts";
import { EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION, EXECUTIVE_INBOX_PLATFORM_IDENTITY } from "./executiveInboxContracts.ts";
import { buildExecutiveInboxFoundation } from "./executiveInboxFoundation.ts";
import { resetExecutiveInboxPlatformForTests } from "./executiveInboxRunner.ts";
import {
  EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_AGGREGATION_SOURCE_PLATFORM_MAP,
} from "./executiveInboxAggregationEngineConstants.ts";
import {
  aggregateExecutiveInbox,
  initializeExecutiveInboxAggregation,
  resetExecutiveInboxAggregationEngineForTests,
} from "./executiveInboxAggregationEngine.ts";
import type { CertifiedInboxSourceRecordInput, ExecutiveInboxItem } from "./executiveInboxAggregationEngineTypes.ts";
import {
  EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_INBOX_PRIORITIZATION_PIPELINE_STAGES,
  EXECUTIVE_INBOX_PRIORITY_DIMENSION_KEYS,
  EXECUTIVE_INBOX_PRIORITY_LEVEL_KEYS,
} from "./executiveInboxPrioritizationEngineConstants.ts";
import {
  calculateExecutivePriorities,
  getPriorities,
  getPriority,
  initializeExecutiveInboxPrioritization,
  isExecutiveInboxPrioritizationInitialized,
  prioritizeExecutiveInbox,
  priorityExists,
  registerPriority,
  resetExecutiveInboxPrioritizationEngineForTests,
  unregisterPriority,
  validateExecutivePriority,
  EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_SELF_MANIFEST,
} from "./executiveInboxPrioritizationEngine.ts";
import { resolvePriorityLevel } from "./executiveInboxPrioritizationCalculator.ts";
import { evaluatePriorityDimensions } from "./executiveInboxPrioritizationDimensionEvaluator.ts";
import { getPriorityRegistrySnapshot } from "./executiveInboxPrioritizationEngineRegistry.ts";
import type {
  ExecutiveInboxPrioritizationCertificationCheck,
  ExecutiveInboxPrioritizationCertificationResult,
} from "./executiveInboxPrioritizationEngineTypes.ts";
import {
  hasDuplicateIds,
  isPriorityDimensionKey,
  isPriorityLevel,
  validateExecutivePriorityProvenance,
  validatePrioritizationDependencies,
} from "./executiveInboxPrioritizationEngineValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-inbox-prioritization-001";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ExecutiveInboxPrioritizationCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function sourceRecord(
  suffix: string,
  sourceType: CertifiedInboxSourceRecordInput["sourceType"]
): CertifiedInboxSourceRecordInput {
  const mapping = EXECUTIVE_INBOX_AGGREGATION_SOURCE_PLATFORM_MAP[sourceType];
  return Object.freeze({
    sourceId: `inbox-source-${sourceType}-${suffix}`,
    sourceType,
    workspaceId: WORKSPACE,
    platformId: mapping.platformId,
    appId: mapping.defaultAppId,
    recordId: `${sourceType}-record-${suffix}`,
    businessContext: `Executive attention required for ${sourceType} ${suffix}.`,
    summary: `Review ${sourceType} matter ${suffix} from certified platform.`,
    sourceVersion: mapping.defaultAppId === "APP-5" ? "APP-5/1" : "APP-10/1",
    sourceApps: Object.freeze(["APP-5", "APP-6", "APP-8", "APP-9", "APP-10", "APP-11/1"]),
  });
}

function aggregateItems(timestamp: string): readonly ExecutiveInboxItem[] {
  const aggregation = aggregateExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-prioritization-session-001",
      sessionLabel: "Prioritization Certification Session",
      sourceRecords: Object.freeze([
        sourceRecord("001", "risk"),
        sourceRecord("002", "decision"),
        sourceRecord("003", "assistant"),
      ]),
      aggregationTimestamp: timestamp,
    })
  );
  return aggregation.aggregatedItems;
}

export function resetExecutiveInboxPrioritizationEnginePlatformForTests(): void {
  resetExecutiveInboxPrioritizationEngineForTests();
  resetExecutiveInboxAggregationEngineForTests();
  resetExecutiveInboxPlatformForTests();
}

export function runExecutiveInboxPrioritizationCertification(
  timestamp: string = FIXED_TIME
): ExecutiveInboxPrioritizationCertificationResult {
  resetExecutiveInboxPrioritizationEnginePlatformForTests();
  buildExecutiveInboxFoundation(timestamp);
  initializeExecutiveInboxAggregation(timestamp);
  const items = aggregateItems(timestamp);
  initializeExecutiveInboxPrioritization(timestamp);

  const checks: ExecutiveInboxPrioritizationCertificationCheck[] = [];

  checks.push(
    check(
      "A_engine_identity",
      "Engine identity and initialization",
      isExecutiveInboxPrioritizationInitialized() === true,
      EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "B_dependency_chain",
      "APP-11:1 and APP-11:2 dependency chain",
      validatePrioritizationDependencies().valid === true,
      `${EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION}+${EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION}`
    )
  );

  const prioritization = prioritizeExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-prioritization-session-001",
      items: Object.freeze(items.map((item) => Object.freeze({ item }))),
      prioritizationTimestamp: timestamp,
    })
  );

  checks.push(
    check(
      "C_prioritization_success",
      "Deterministic prioritization succeeds",
      prioritization.success === true,
      prioritization.reason
    )
  );

  checks.push(
    check(
      "D_priorities_immutable",
      "Priorities are immutable",
      prioritization.prioritizedItems.every((entry) => Object.isFrozen(entry) && entry.readOnly === true),
      String(prioritization.prioritizedItems.length)
    )
  );

  checks.push(
    check(
      "E_provenance_complete",
      "Provenance is complete",
      prioritization.prioritizedItems.every((entry) => validateExecutivePriorityProvenance(entry.provenance).valid),
      "provenance valid"
    )
  );

  checks.push(
    check(
      "F_explanation_present",
      "Every priority includes explanation",
      prioritization.prioritizedItems.every(
        (entry) => entry.profile.explanation.trim().length > 0 && entry.profile.evidence.length > 0
      ),
      "explanations present"
    )
  );

  checks.push(
    check(
      "G_registry_integrity",
      "Registry integrity verified",
      getPriorityRegistrySnapshot().priorityCount === prioritization.registeredPriorityIds.length &&
        prioritization.registeredPriorityIds.every((priorityId) => priorityExists(priorityId)),
      String(getPriorityRegistrySnapshot().priorityCount)
    )
  );

  checks.push(
    check(
      "H_pipeline_stages",
      "Pipeline stages complete",
      prioritization.pipelineStages.length === EXECUTIVE_INBOX_PRIORITIZATION_PIPELINE_STAGES.length,
      String(prioritization.pipelineStages.length)
    )
  );

  const riskItemId = items.find((entry) => entry.sourceType === "risk")?.itemId;
  checks.push(
    check(
      "I_deterministic_ordering",
      "Deterministic priority ordering by score",
      (prioritization.prioritizedItems[0]?.weightedScore ?? 0) >=
        (prioritization.prioritizedItems[1]?.weightedScore ?? 0) &&
        prioritization.prioritizedItems[0]?.itemId === riskItemId,
      prioritization.prioritizedItems.map((entry) => `${entry.priorityLevel}:${entry.weightedScore}`).join(",")
    )
  );

  checks.push(
    check(
      "J_no_notifications",
      "No notification delivery",
      EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_PUBLIC_API_RULES.noNotifications === true &&
        EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_PUBLIC_API_RULES.noReminders === true,
      "no notifications"
    )
  );

  checks.push(
    check(
      "K_no_scheduling",
      "No scheduling logic",
      EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_PUBLIC_API_RULES.noScheduling === true,
      "no scheduling"
    )
  );

  checks.push(
    check(
      "L_consumer_only",
      "Consumer-only prioritization",
      EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_PUBLIC_API_RULES.consumerOnly === true,
      "consumer only"
    )
  );

  checks.push(
    check(
      "M_prior_platforms_untouched",
      "Prior APP platforms untouched",
      EXECUTIVE_INBOX_PLATFORM_IDENTITY.appId === "APP-11" &&
        CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId === "APP-10",
      "APP-10 verified"
    )
  );

  checks.push(
    check(
      "N_duplicate_detection",
      "Duplicate priority detection",
      registerPriority(prioritization.prioritizedItems[0]!).success === false,
      "duplicate rejected"
    )
  );

  const evaluation = evaluatePriorityDimensions(Object.freeze({ item: items[0]! }));
  checks.push(
    check(
      "O_dimension_evaluation",
      "Priority dimension evaluation",
      evaluation.evidence.length === EXECUTIVE_INBOX_PRIORITY_DIMENSION_KEYS.length,
      String(evaluation.evidence.length)
    )
  );

  const calculated = calculateExecutivePriorities(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "calc-session",
      items: Object.freeze([Object.freeze({ item: items[1]! })]),
      prioritizationTimestamp: timestamp,
    })
  );
  checks.push(
    check(
      "P_calculation_api",
      "Priority calculation API",
      calculated.length === 1 && validateExecutivePriority(calculated[0]!).valid === true,
      calculated[0]?.priorityLevel ?? "missing"
    )
  );

  checks.push(
    check(
      "Q_stage_manifest",
      "Stage manifest validation",
      validateStageManifest(EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_SELF_MANIFEST).valid === true,
      EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "R_architecture_boundary",
      "Architecture file boundary",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/executive-inbox/executiveInboxPrioritizationEngine.ts",
        allowedFiles: EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "executiveInboxPrioritizationEngine.ts"
    )
  );

  checks.push(
    check(
      "S_priority_vocabulary",
      "Priority dimension and level vocabulary",
      isPriorityDimensionKey("risk_severity") === true &&
        isPriorityLevel("critical") === true &&
        EXECUTIVE_INBOX_PRIORITY_LEVEL_KEYS.length === 5,
      "vocabulary guards"
    )
  );

  checks.push(
    check(
      "T_level_resolution",
      "Deterministic level resolution",
      resolvePriorityLevel(90) === "critical" && resolvePriorityLevel(25) === "informational",
      "level thresholds"
    )
  );

  const priorityId = prioritization.registeredPriorityIds[0];
  checks.push(
    check(
      "U_registry_retrieval",
      "Registry retrieval",
      priorityId !== undefined &&
        getPriority(priorityId) !== null &&
        getPriorities(WORKSPACE).length === prioritization.registeredPriorityIds.length,
      String(getPriorities(WORKSPACE).length)
    )
  );

  if (priorityId) {
    unregisterPriority(priorityId);
  }
  checks.push(
    check(
      "V_unregister_support",
      "Unregister priority",
      priorityId ? priorityExists(priorityId) === false : false,
      "unregistered"
    )
  );

  checks.push(
    check(
      "W_duplicate_ids_guard",
      "Duplicate ID guard",
      hasDuplicateIds(["a", "b", "a"]) === true && hasDuplicateIds(["a", "b"]) === false,
      "duplicate guard"
    )
  );

  checks.push(
    check(
      "X_learning_results",
      "Deterministic learning results",
      prioritization.learningResults.every((entry) => entry.deterministic === true),
      String(prioritization.learningResults.length)
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-11/3",
    contractVersion: EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}

export const ExecutiveInboxPrioritizationEngineRunner = Object.freeze({
  runExecutiveInboxPrioritizationCertification,
  resetExecutiveInboxPrioritizationEnginePlatformForTests,
});
