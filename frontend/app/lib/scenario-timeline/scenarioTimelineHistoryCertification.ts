/**
 * APP-5:4 — Scenario Timeline History Engine certification.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  resolveScenarioIdentityExample,
  validateScenarioIdentityShape,
} from "../app-2-scenario-intelligence/scenarioIntelligenceContract.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  createTimelineEvent,
  initializeScenarioTimelineEventEngine,
  resetScenarioTimelineEventEngineForTests,
} from "./scenarioTimelineEventEngine.ts";
import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import { mapTimelineEventToFoundationContract } from "./scenarioTimelineEventValidator.ts";
import {
  buildScenarioLifecycle,
  initializeScenarioTimelineLifecycleEngine,
  resetScenarioTimelineLifecycleEngineForTests,
} from "./scenarioTimelineLifecycleEngine.ts";
import {
  SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_HISTORY_MANDATORY_FIELDS,
} from "./scenarioTimelineHistoryConstants.ts";
import {
  validateHistoryEventCompatibility,
  validateHistoryLifecycleCompatibility,
} from "./scenarioTimelineHistoryCompatibility.ts";
import { SCENARIO_TIMELINE_HISTORY_ENGINE_SELF_MANIFEST } from "./scenarioTimelineHistoryContracts.ts";
import {
  buildScenarioHistory,
  calculateScenarioHistory,
  initializeScenarioTimelineHistoryEngine,
  isScenarioTimelineHistoryEngineInitialized,
  resetScenarioTimelineHistoryEngineForTests,
} from "./scenarioTimelineHistoryEngine.ts";
import { validateScenarioHistory } from "./scenarioTimelineHistoryBuilder.ts";
import { getScenarioHistoryRegistry } from "./scenarioTimelineHistoryRegistry.ts";
import { getScenarioHistoryContract } from "./scenarioTimelineHistoryContracts.ts";
import { orderTimelineEventsForHistory } from "./scenarioTimelineHistoryGrouping.ts";
import { detectHistoryMilestones } from "./scenarioTimelineHistoryMilestones.ts";
import {
  SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS,
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
} from "./scenarioTimelinePlatformConstants.ts";
import { initializeScenarioTimelinePlatform } from "./scenarioTimelinePlatformFoundation.ts";
import { resetScenarioTimelinePlatformForTests } from "./scenarioTimelinePlatform.ts";
import { validateTimelineEventContractShape } from "./scenarioTimelinePlatformValidation.ts";
import type {
  ScenarioTimelineHistoryCertificationCheck,
  ScenarioTimelineHistoryEngineCertificationResult,
} from "./scenarioTimelineHistoryTypes.ts";
import type { ScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");

function check(id: string, title: string, passed: boolean, evidence: string): ScenarioTimelineHistoryCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readHistorySource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function engineHasNoForbiddenRuntime(): boolean {
  const modules = [
    "app/lib/scenario-timeline/scenarioTimelineHistoryEngine.ts",
    "app/lib/scenario-timeline/scenarioTimelineHistoryRegistry.ts",
    "app/lib/scenario-timeline/scenarioTimelineHistoryBuilder.ts",
  ].map((path) => readHistorySource(path));
  return modules.every(
    (source) =>
      !source.includes("localStorage") &&
      !source.includes("indexedDB") &&
      !source.includes("fetch(") &&
      !source.includes("PlaybackEngine") &&
      !source.includes("TimelineChart") &&
      !source.includes("publishTimelineEvent")
  );
}

function createOrderedHistoryEvents(scenarioId: string, workspaceId: string): ScenarioTimelineEvent[] {
  const events: ScenarioTimelineEvent[] = [];
  (SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS as readonly ScenarioTimelineLifecycleStage[]).forEach((stage, index) => {
    const result = createTimelineEvent({
      scenarioId,
      workspaceId,
      stage,
      eventId: `history-cert-${stage}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "history-certification",
      title: `History certification ${stage}`,
      summary: "APP-5:4 history certification event.",
    });
    if (!result.success || !result.data) {
      throw new Error(result.reason);
    }
    events.push(result.data);
  });
  return events;
}

export function certifyScenarioHistoryEngine(): ScenarioTimelineHistoryEngineCertificationResult {
  resetScenarioTimelineHistoryEngineForTests();
  resetScenarioTimelineLifecycleEngineForTests();
  resetScenarioTimelineEventEngineForTests();
  resetScenarioTimelinePlatformForTests();
  initializeScenarioTimelinePlatform(FIXED_TIME);
  initializeScenarioTimelineEventEngine(FIXED_TIME);
  initializeScenarioTimelineLifecycleEngine(FIXED_TIME);
  initializeScenarioTimelineHistoryEngine(FIXED_TIME);

  const checks: ScenarioTimelineHistoryCertificationCheck[] = [];

  checks.push(
    check(
      "platform_identity",
      "History engine contract version is APP-5/4",
      SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION === "APP-5/4",
      SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "engine_initialized",
      "History engine initializes successfully",
      isScenarioTimelineHistoryEngineInitialized(),
      String(isScenarioTimelineHistoryEngineInitialized())
    )
  );

  const manifestValidation = validateStageManifest(SCENARIO_TIMELINE_HISTORY_ENGINE_SELF_MANIFEST);
  checks.push(
    check(
      "stage_manifest",
      "APP-5/4 stage manifest is valid",
      manifestValidation.valid,
      manifestValidation.issues.map((issue) => issue.message).join("; ") || "manifest valid"
    )
  );

  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/scenario-timeline/scenarioTimelineHistoryEngine.ts",
    allowedFiles: SCENARIO_TIMELINE_HISTORY_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: SCENARIO_TIMELINE_HISTORY_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  checks.push(
    check(
      "architecture_boundary",
      "History engine file is within APP-5/4 boundary",
      boundary.allowed,
      boundary.message
    )
  );

  const contract = getScenarioHistoryContract();
  checks.push(
    check(
      "history_contract",
      "Mandatory history fields are declared",
      contract.mandatoryFields.length === SCENARIO_TIMELINE_HISTORY_MANDATORY_FIELDS.length,
      contract.mandatoryFields.join(",")
    )
  );

  checks.push(
    check(
      "frozen_vocabulary",
      "History vocabulary matches APP-5:1 (8 stages)",
      contract.supportedStages.length === 8,
      String(contract.supportedStages.length)
    )
  );

  const events = createOrderedHistoryEvents("scenario-history-cert-001", "ws-history-cert-001");
  const lifecycle = buildScenarioLifecycle({ events });

  const eventCompatibility = validateHistoryEventCompatibility(events);
  checks.push(
    check(
      "app5_2_compatibility",
      "History consumes APP-5:2 compatible events",
      eventCompatibility.valid,
      eventCompatibility.issues.map((issue) => issue.message).join("; ") || "compatible"
    )
  );

  const lifecycleCompatibility = validateHistoryLifecycleCompatibility(events, lifecycle);
  checks.push(
    check(
      "app5_3_compatibility",
      "History consumes read-only APP-5:3 lifecycle context",
      lifecycleCompatibility.valid,
      lifecycleCompatibility.issues.map((issue) => issue.message).join("; ") || "compatible"
    )
  );

  const foundationValid = events.every(
    (event) => validateTimelineEventContractShape(mapTimelineEventToFoundationContract(event)).valid
  );
  checks.push(
    check(
      "app5_1_compatibility",
      "History events map to APP-5:1 contracts",
      foundationValid,
      String(foundationValid)
    )
  );

  const built = buildScenarioHistory({ events, lifecycle });
  checks.push(
    check(
      "history_builder",
      "History builder produces immutable history object",
      built.readOnly === true && built.eventCount === events.length,
      built.historyId
    )
  );

  const historyValidation = validateScenarioHistory(built);
  checks.push(
    check(
      "history_validator",
      "Built history passes validator",
      historyValidation.valid,
      historyValidation.issues.map((issue) => issue.message).join("; ") || "valid"
    )
  );

  const ordered = orderTimelineEventsForHistory(events);
  checks.push(
    check(
      "history_ordering",
      "History ordering preserves chronological sequence",
      ordered[0]?.stage === "scenario_created" && ordered.at(-1)?.stage === "lessons_learned",
      `${ordered[0]?.stage} -> ${ordered.at(-1)?.stage}`
    )
  );

  checks.push(
    check(
      "history_grouping",
      "History grouping includes lifecycle stage groups",
      built.stageGroups.length >= 8 && Object.keys(built.groups.byLifecycleStage).length >= 8,
      String(built.stageGroups.length)
    )
  );

  const milestones = detectHistoryMilestones(ordered);
  checks.push(
    check(
      "milestone_detection",
      "History milestone detector finds key milestones",
      milestones.some((entry) => entry.milestoneKey === "history_started") &&
        milestones.some((entry) => entry.milestoneKey === "history_completed"),
      String(milestones.length)
    )
  );

  checks.push(
    check(
      "summary_generation",
      "History summary includes narrative and duration",
      built.historySummary.narrative.length > 0 && built.duration >= 0,
      built.historySummary.narrative.slice(0, 64)
    )
  );

  const calculated = calculateScenarioHistory({ events, lifecycle });
  checks.push(
    check(
      "history_calculator",
      "calculateScenarioHistory registers history",
      calculated.success === true && getScenarioHistoryRegistry().registeredHistoryCount >= 1,
      calculated.reason
    )
  );

  const scenarioIdentity = resolveScenarioIdentityExample();
  const scenarioIdentityValidation = validateScenarioIdentityShape(scenarioIdentity);
  checks.push(
    check(
      "app2_regression",
      "APP-2 scenario identity contract remains valid",
      scenarioIdentityValidation.valid,
      scenarioIdentityValidation.issues.map((issue) => issue.message).join("; ") || "valid"
    )
  );

  checks.push(
    check(
      "forbidden_runtime",
      "History modules exclude persistence, playback, and UI runtime",
      engineHasNoForbiddenRuntime(),
      "no forbidden runtime patterns"
    )
  );

  const priorFilesPresent = SCENARIO_TIMELINE_HISTORY_ENGINE_SELF_MANIFEST.allowedFiles
    .filter((file) => file.includes("scenarioTimelineEvent") || file.includes("scenarioTimelinePlatform") || file.includes("scenarioTimelineLifecycle"))
    .every((file) => existsSync(join(REPO_ROOT, file)));
  checks.push(
    check(
      "prior_phases_preserved",
      "APP-5:1 through APP-5:3 files remain present",
      priorFilesPresent,
      "prior phase files present"
    )
  );

  checks.push(
    check(
      "app5_1_contract_version",
      "APP-5:1 contract version unchanged",
      SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION === "APP-5/1",
      SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION
    )
  );

  const passed = checks.filter((entry) => entry.passed).length;
  const certified = checks.every((entry) => entry.passed);

  return Object.freeze({
    certified,
    status: certified ? "PASS" : "FAIL",
    summary: `${passed}/${checks.length} certification checks passed.`,
    checks: Object.freeze(checks),
    readOnly: true as const,
  });
}

export { SCENARIO_TIMELINE_HISTORY_ENGINE_SELF_MANIFEST };
