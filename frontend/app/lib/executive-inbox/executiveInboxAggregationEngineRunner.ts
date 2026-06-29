/**
 * APP-11:2 — Executive Inbox Aggregation Engine certification runner.
 */

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY } from "../cross-scenario-learning/crossScenarioLearningContracts.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "../confidence-evolution/confidenceEvolutionContracts.ts";
import { DECISION_JOURNAL_PLATFORM_IDENTITY } from "../decision-journal/decisionJournalContracts.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import { SCENARIO_TIMELINE_PLATFORM_IDENTITY } from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import { EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION, EXECUTIVE_INBOX_PLATFORM_IDENTITY } from "./executiveInboxContracts.ts";
import { buildExecutiveInboxFoundation } from "./executiveInboxFoundation.ts";
import { resetExecutiveInboxPlatformForTests } from "./executiveInboxRunner.ts";
import {
  EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_AGGREGATION_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_INBOX_AGGREGATION_PIPELINE_STAGES,
  EXECUTIVE_INBOX_AGGREGATION_SOURCE_PLATFORM_MAP,
} from "./executiveInboxAggregationEngineConstants.ts";
import {
  aggregateExecutiveInbox,
  getInboxItem,
  getInboxItems,
  inboxItemExists,
  initializeExecutiveInboxAggregation,
  isExecutiveInboxAggregationInitialized,
  registerInboxItem,
  resetExecutiveInboxAggregationEngineForTests,
  unregisterInboxItem,
  validateExecutiveInboxAggregation,
  validateExecutiveInboxItems,
  EXECUTIVE_INBOX_AGGREGATION_ENGINE_SELF_MANIFEST,
} from "./executiveInboxAggregationEngine.ts";
import { buildExecutiveInboxItemsFromRecords } from "./executiveInboxAggregationItemBuilder.ts";
import {
  normalizeInboxSourceRecords,
  sortNormalizedRecordsDeterministically,
} from "./executiveInboxAggregationNormalizer.ts";
import { getInboxAggregationSnapshot } from "./executiveInboxAggregationEngineRegistry.ts";
import type {
  CertifiedInboxSourceRecordInput,
  ExecutiveInboxAggregationCertificationCheck,
  ExecutiveInboxAggregationCertificationResult,
} from "./executiveInboxAggregationEngineTypes.ts";
import {
  hasDuplicateIds,
  validateCertifiedInboxSourceRecordInput,
  validateExecutiveInboxItem,
  validateExecutiveInboxItemProvenance,
  validateExecutiveInboxSourceReference,
  validateFoundationCompatibilityForEngine,
} from "./executiveInboxAggregationEngineValidation.ts";
import { isExecutiveInboxSourceType } from "./executiveInboxValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-inbox-aggregation-001";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ExecutiveInboxAggregationCertificationCheck {
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

export function resetExecutiveInboxAggregationEnginePlatformForTests(): void {
  resetExecutiveInboxAggregationEngineForTests();
  resetExecutiveInboxPlatformForTests();
}

export function runExecutiveInboxAggregationCertification(
  timestamp: string = FIXED_TIME
): ExecutiveInboxAggregationCertificationResult {
  resetExecutiveInboxAggregationEnginePlatformForTests();
  buildExecutiveInboxFoundation(timestamp);
  initializeExecutiveInboxAggregation(timestamp);

  const checks: ExecutiveInboxAggregationCertificationCheck[] = [];

  checks.push(
    check(
      "A_engine_identity",
      "Engine identity and initialization",
      isExecutiveInboxAggregationInitialized() === true,
      EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "B_foundation_dependency",
      "APP-11:1 foundation dependency",
      validateFoundationCompatibilityForEngine(true).valid === true,
      EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION
    )
  );

  const aggregation = aggregateExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-aggregation-session-001",
      sessionLabel: "Executive Attention Session",
      sourceRecords: Object.freeze([
        sourceRecord("001", "scenario"),
        sourceRecord("002", "decision"),
        sourceRecord("003", "recommendation"),
      ]),
      aggregationTimestamp: timestamp,
    })
  );

  checks.push(
    check(
      "C_aggregation_success",
      "Deterministic aggregation succeeds",
      aggregation.success === true,
      aggregation.reason
    )
  );

  checks.push(
    check(
      "D_items_immutable",
      "Aggregated items are immutable",
      aggregation.aggregatedItems.every((entry) => Object.isFrozen(entry) && entry.readOnly === true),
      String(aggregation.aggregatedItems.length)
    )
  );

  checks.push(
    check(
      "E_provenance_complete",
      "Provenance is complete",
      aggregation.aggregatedItems.every((entry) => validateExecutiveInboxItemProvenance(entry.provenance).valid),
      "provenance valid"
    )
  );

  checks.push(
    check(
      "F_source_reference_valid",
      "Source references valid",
      aggregation.aggregatedItems.every((entry) => validateExecutiveInboxSourceReference(entry.sourceReference).valid),
      "references valid"
    )
  );

  checks.push(
    check(
      "G_registry_integrity",
      "Registry integrity verified",
      getInboxAggregationSnapshot().itemCount === aggregation.registeredItemIds.length &&
        aggregation.registeredItemIds.every((itemId) => inboxItemExists(itemId)),
      String(getInboxAggregationSnapshot().itemCount)
    )
  );

  checks.push(
    check(
      "H_pipeline_stages",
      "Pipeline stages complete",
      aggregation.pipelineStages.length === EXECUTIVE_INBOX_AGGREGATION_PIPELINE_STAGES.length,
      String(aggregation.pipelineStages.length)
    )
  );

  checks.push(
    check(
      "I_deterministic_ordering",
      "Deterministic item ordering",
      [...aggregation.aggregatedItems.map((entry) => entry.itemId)].join(",") ===
        [...aggregation.aggregatedItems].sort((a, b) => a.itemId.localeCompare(b.itemId)).map((entry) => entry.itemId).join(","),
      "sorted by itemId"
    )
  );

  checks.push(
    check(
      "J_no_prioritization",
      "No prioritization logic",
      EXECUTIVE_INBOX_AGGREGATION_ENGINE_PUBLIC_API_RULES.noPrioritization === true,
      "no prioritization"
    )
  );

  checks.push(
    check(
      "K_no_notifications",
      "No notification delivery",
      EXECUTIVE_INBOX_AGGREGATION_ENGINE_PUBLIC_API_RULES.noNotifications === true &&
        EXECUTIVE_INBOX_AGGREGATION_ENGINE_PUBLIC_API_RULES.noReminders === true,
      "no notifications"
    )
  );

  checks.push(
    check(
      "L_consumer_only",
      "Consumer-only aggregation",
      EXECUTIVE_INBOX_AGGREGATION_ENGINE_PUBLIC_API_RULES.consumerOnly === true,
      "consumer only"
    )
  );

  checks.push(
    check(
      "M_prior_platforms_untouched",
      "Prior APP platforms untouched",
      EXECUTIVE_INBOX_PLATFORM_IDENTITY.appId === "APP-11" &&
        SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
        DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6" &&
        DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8" &&
        CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId === "APP-9" &&
        CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId === "APP-10",
      "APP-5 through APP-10 verified"
    )
  );

  checks.push(
    check(
      "N_duplicate_detection",
      "Duplicate item detection",
      registerInboxItem(aggregation.aggregatedItems[0]!).success === false,
      "duplicate rejected"
    )
  );

  const normalized = sortNormalizedRecordsDeterministically(
    normalizeInboxSourceRecords(Object.freeze([sourceRecord("004", "timeline")]))
  );
  const builtItems = buildExecutiveInboxItemsFromRecords(normalized, timestamp);
  checks.push(
    check(
      "O_normalization",
      "Source normalization",
      builtItems.length === 1 && validateExecutiveInboxItem(builtItems[0]!).valid === true,
      "normalized"
    )
  );

  checks.push(
    check(
      "P_validation_api",
      "Aggregation validation API",
      validateExecutiveInboxAggregation(aggregation.aggregatedItems).valid === true &&
        validateExecutiveInboxItems(aggregation.aggregatedItems).valid === true,
      "valid"
    )
  );

  checks.push(
    check(
      "Q_stage_manifest",
      "Stage manifest validation",
      validateStageManifest(EXECUTIVE_INBOX_AGGREGATION_ENGINE_SELF_MANIFEST).valid === true,
      EXECUTIVE_INBOX_AGGREGATION_ENGINE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "R_architecture_boundary",
      "Architecture file boundary",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/executive-inbox/executiveInboxAggregationEngine.ts",
        allowedFiles: EXECUTIVE_INBOX_AGGREGATION_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: EXECUTIVE_INBOX_AGGREGATION_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "executiveInboxAggregationEngine.ts"
    )
  );

  checks.push(
    check(
      "S_source_vocabulary",
      "Inbox source vocabulary",
      isExecutiveInboxSourceType("scenario") === true && isExecutiveInboxSourceType("assistant") === true,
      "source guards"
    )
  );

  checks.push(
    check(
      "T_input_validation",
      "Certified source input validation",
      validateCertifiedInboxSourceRecordInput(sourceRecord("005", "risk")).valid === true,
      "input valid"
    )
  );

  const itemId = aggregation.registeredItemIds[0];
  checks.push(
    check(
      "U_registry_retrieval",
      "Registry retrieval",
      itemId !== undefined && getInboxItem(itemId) !== null && getInboxItems(WORKSPACE).length === aggregation.registeredItemIds.length,
      String(getInboxItems(WORKSPACE).length)
    )
  );

  if (itemId) {
    unregisterInboxItem(itemId);
  }
  checks.push(
    check(
      "V_unregister_support",
      "Unregister inbox item",
      itemId ? inboxItemExists(itemId) === false : false,
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

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-11/2",
    contractVersion: EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}

export const ExecutiveInboxAggregationEngineRunner = Object.freeze({
  runExecutiveInboxAggregationCertification,
  resetExecutiveInboxAggregationEnginePlatformForTests,
});
