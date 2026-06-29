/**
 * APP-5:5 — Scenario Timeline Query Engine certification.
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
import { buildScenarioLifecycle, calculateScenarioLifecycle, initializeScenarioTimelineLifecycleEngine, resetScenarioTimelineLifecycleEngineForTests } from "./scenarioTimelineLifecycleEngine.ts";
import { calculateScenarioHistory, initializeScenarioTimelineHistoryEngine, resetScenarioTimelineHistoryEngineForTests } from "./scenarioTimelineHistoryEngine.ts";
import {
  SCENARIO_TIMELINE_QUERY_ENGINE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_QUERY_MANDATORY_RESULT_FIELDS,
} from "./scenarioTimelineQueryConstants.ts";
import { validateTimelineQueryCompatibility } from "./scenarioTimelineQueryCompatibility.ts";
import { SCENARIO_TIMELINE_QUERY_ENGINE_SELF_MANIFEST } from "./scenarioTimelineQueryContracts.ts";
import {
  initializeScenarioTimelineQueryEngine,
  isScenarioTimelineQueryEngineInitialized,
  queryScenarioTimeline,
  queryTimelineByStage,
  queryTimelineEvents,
  queryTimelineHistory,
  queryTimelineLifecycle,
  queryTimelineMilestones,
  queryTimelineProgress,
  queryTimelineStatus,
  queryLatestTimelineEvent,
  resetScenarioTimelineQueryEngineForTests,
} from "./scenarioTimelineQueryEngine.ts";
import { areTimelineQuerySourcesReady, resolveQuerySourceContext } from "./scenarioTimelineQuerySources.ts";
import { getTimelineQueryRegistry } from "./scenarioTimelineQueryRegistry.ts";
import { getTimelineQueryContract } from "./scenarioTimelineQueryContracts.ts";
import { validateScenarioTimelineQueryResult } from "./scenarioTimelineQueryBuilder.ts";
import {
  SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS,
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
} from "./scenarioTimelinePlatformConstants.ts";
import { initializeScenarioTimelinePlatform } from "./scenarioTimelinePlatformFoundation.ts";
import { resetScenarioTimelinePlatformForTests } from "./scenarioTimelinePlatform.ts";
import type {
  ScenarioTimelineQueryCertificationCheck,
  ScenarioTimelineQueryEngineCertificationResult,
} from "./scenarioTimelineQueryTypes.ts";
import type { ScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const SCENARIO_ID = "scenario-query-cert-001";
const WORKSPACE_ID = "ws-query-cert-001";

function check(id: string, title: string, passed: boolean, evidence: string): ScenarioTimelineQueryCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readQuerySource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function queryModulesAvoidDirectRegistryAccess(): boolean {
  const modules = [
    "app/lib/scenario-timeline/scenarioTimelineQueryEngine.ts",
    "app/lib/scenario-timeline/scenarioTimelineQuerySources.ts",
    "app/lib/scenario-timeline/scenarioTimelineQueryResolver.ts",
    "app/lib/scenario-timeline/scenarioTimelineQueryBuilder.ts",
  ].map((path) => readQuerySource(path));
  return modules.every(
    (source) =>
      !source.includes("scenarioTimelineEventRegistry.ts") &&
      !source.includes("scenarioTimelineLifecycleRegistry.ts") &&
      !source.includes("scenarioTimelineHistoryRegistry.ts") &&
      !source.includes("publishTimelineEvent") &&
      !source.includes("registerScenarioLifecycle") &&
      !source.includes("registerScenarioHistory")
  );
}

function seedCanonicalTimelineData(): ScenarioTimelineEvent[] {
  const events: ScenarioTimelineEvent[] = [];
  (SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS as readonly ScenarioTimelineLifecycleStage[]).forEach((stage, index) => {
    const result = createTimelineEvent({
      scenarioId: SCENARIO_ID,
      workspaceId: WORKSPACE_ID,
      stage,
      eventId: `query-cert-${stage}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "query-certification",
      title: `Query certification ${stage}`,
      summary: "APP-5:5 query certification event.",
    });
    if (!result.success || !result.data) {
      throw new Error(result.reason);
    }
    events.push(result.data);
  });

  calculateScenarioLifecycle({ events });
  calculateScenarioHistory({ events, lifecycle: buildScenarioLifecycle({ events }) });
  return events;
}

export function certifyScenarioTimelineQueryEngine(): ScenarioTimelineQueryEngineCertificationResult {
  resetScenarioTimelineQueryEngineForTests();
  resetScenarioTimelineHistoryEngineForTests();
  resetScenarioTimelineLifecycleEngineForTests();
  resetScenarioTimelineEventEngineForTests();
  resetScenarioTimelinePlatformForTests();
  initializeScenarioTimelinePlatform(FIXED_TIME);
  initializeScenarioTimelineEventEngine(FIXED_TIME);
  initializeScenarioTimelineLifecycleEngine(FIXED_TIME);
  initializeScenarioTimelineHistoryEngine(FIXED_TIME);
  initializeScenarioTimelineQueryEngine(FIXED_TIME);

  const checks: ScenarioTimelineQueryCertificationCheck[] = [];

  checks.push(
    check(
      "platform_identity",
      "Query engine contract version is APP-5/5",
      SCENARIO_TIMELINE_QUERY_ENGINE_CONTRACT_VERSION === "APP-5/5",
      SCENARIO_TIMELINE_QUERY_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "engine_initialized",
      "Query engine initializes successfully",
      isScenarioTimelineQueryEngineInitialized(),
      String(isScenarioTimelineQueryEngineInitialized())
    )
  );

  const manifestValidation = validateStageManifest(SCENARIO_TIMELINE_QUERY_ENGINE_SELF_MANIFEST);
  checks.push(
    check(
      "stage_manifest",
      "APP-5/5 stage manifest is valid",
      manifestValidation.valid,
      manifestValidation.issues.map((issue) => issue.message).join("; ") || "manifest valid"
    )
  );

  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/scenario-timeline/scenarioTimelineQueryEngine.ts",
    allowedFiles: SCENARIO_TIMELINE_QUERY_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: SCENARIO_TIMELINE_QUERY_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  checks.push(
    check(
      "architecture_boundary",
      "Query engine file is within APP-5/5 boundary",
      boundary.allowed,
      boundary.message
    )
  );

  const contract = getTimelineQueryContract();
  checks.push(
    check(
      "query_contract",
      "Mandatory query result fields are declared",
      contract.mandatoryResultFields.length === SCENARIO_TIMELINE_QUERY_MANDATORY_RESULT_FIELDS.length,
      contract.mandatoryResultFields.join(",")
    )
  );

  checks.push(
    check(
      "canonical_sources",
      "Query sources use only APP-5:2/3/4 public engine APIs",
      areTimelineQuerySourcesReady() && queryModulesAvoidDirectRegistryAccess(),
      String(areTimelineQuerySourcesReady())
    )
  );

  seedCanonicalTimelineData();
  const context = resolveQuerySourceContext({ scenarioId: SCENARIO_ID });
  const compatibility = validateTimelineQueryCompatibility(context);
  checks.push(
    check(
      "app5_compatibility",
      "Query compatibility validates APP-5:1 through APP-5:4 contracts",
      compatibility.valid,
      compatibility.issues.map((issue) => issue.message).join("; ") || "compatible"
    )
  );

  const timelineQuery = queryScenarioTimeline({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });
  checks.push(
    check(
      "scenario_timeline_query",
      "queryScenarioTimeline returns immutable result",
      timelineQuery.success === true && timelineQuery.data?.readOnly === true,
      timelineQuery.reason
    )
  );

  if (timelineQuery.data) {
    const resultValidation = validateScenarioTimelineQueryResult(timelineQuery.data);
    checks.push(
      check(
        "query_result_validation",
        "Query result passes validator",
        resultValidation.valid && timelineQuery.data.validationResult.valid,
        resultValidation.issues.map((issue) => issue.message).join("; ") || "valid"
      )
    );
  } else {
    checks.push(check("query_result_validation", "Query result passes validator", false, "No query result."));
  }

  const eventsQuery = queryTimelineEvents({ scenarioId: SCENARIO_ID });
  const historyQuery = queryTimelineHistory({ scenarioId: SCENARIO_ID });
  const lifecycleQuery = queryTimelineLifecycle({ scenarioId: SCENARIO_ID });
  const milestonesQuery = queryTimelineMilestones({ scenarioId: SCENARIO_ID });
  const progressQuery = queryTimelineProgress({ scenarioId: SCENARIO_ID });
  const statusQuery = queryTimelineStatus({ scenarioId: SCENARIO_ID });
  const latestQuery = queryLatestTimelineEvent({ scenarioId: SCENARIO_ID });
  const stageQuery = queryTimelineByStage({ scenarioId: SCENARIO_ID, stage: "decision_made" });

  checks.push(
    check(
      "supported_queries",
      "Supported query APIs execute successfully",
      [eventsQuery, historyQuery, lifecycleQuery, milestonesQuery, progressQuery, statusQuery, latestQuery, stageQuery].every(
        (entry) => entry.success
      ),
      "8 query APIs"
    )
  );

  checks.push(
    check(
      "history_ordering",
      "Query events preserve chronological ordering",
      (eventsQuery.data?.events[0]?.stage ?? "") === "scenario_created" &&
        (eventsQuery.data?.events.at(-1)?.stage ?? "") === "lessons_learned",
      `${eventsQuery.data?.events[0]?.stage} -> ${eventsQuery.data?.events.at(-1)?.stage}`
    )
  );

  checks.push(
    check(
      "milestone_query",
      "queryTimelineMilestones returns milestones",
      (milestonesQuery.data?.milestones.length ?? 0) > 0,
      String(milestonesQuery.data?.milestones.length ?? 0)
    )
  );

  checks.push(
    check(
      "progress_status_query",
      "Progress and status queries resolve lifecycle values",
      progressQuery.data?.progress === 100 && statusQuery.data?.status === "completed",
      `${progressQuery.data?.progress}/${statusQuery.data?.status}`
    )
  );

  checks.push(
    check(
      "query_registry",
      "Query registry records executed queries",
      getTimelineQueryRegistry().registeredQueryCount >= 8,
      String(getTimelineQueryRegistry().registeredQueryCount)
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

  const priorFilesPresent = SCENARIO_TIMELINE_QUERY_ENGINE_SELF_MANIFEST.allowedFiles
    .filter(
      (file) =>
        file.includes("scenarioTimelineEvent") ||
        file.includes("scenarioTimelinePlatform") ||
        file.includes("scenarioTimelineLifecycle") ||
        file.includes("scenarioTimelineHistory")
    )
    .every((file) => existsSync(join(REPO_ROOT, file)));
  checks.push(
    check(
      "prior_phases_preserved",
      "APP-5:1 through APP-5:4 files remain present",
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

export { SCENARIO_TIMELINE_QUERY_ENGINE_SELF_MANIFEST };
