/**
 * APP-5:7 — Scenario Timeline Assistant Integration certification.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  resolveScenarioIdentityExample,
  validateScenarioIdentityShape,
} from "../app-2-scenario-intelligence/scenarioIntelligenceContract.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  createScenarioTimelineEvent,
  initializeScenarioTimeline,
  resetScenarioTimelinePlatformApiForTests,
} from "./scenarioTimelineApiLayer.ts";
import { resetScenarioTimelineEventEngineForTests } from "./scenarioTimelineEventEngine.ts";
import { resetScenarioTimelineLifecycleEngineForTests } from "./scenarioTimelineLifecycleEngine.ts";
import { resetScenarioTimelineHistoryEngineForTests } from "./scenarioTimelineHistoryEngine.ts";
import { resetScenarioTimelineQueryEngineForTests } from "./scenarioTimelineQueryEngine.ts";
import { resetScenarioTimelinePlatformForTests } from "./scenarioTimelinePlatform.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS } from "./scenarioTimelinePlatformConstants.ts";
import type { ScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformTypes.ts";
import {
  SCENARIO_TIMELINE_ASSISTANT_FORBIDDEN_API_IMPORTS,
  SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
  SCENARIO_TIMELINE_ASSISTANT_QUESTION_KEYS,
} from "./scenarioTimelineAssistantConstants.ts";
import { validateScenarioTimelineAssistantCompatibility } from "./scenarioTimelineAssistantCompatibility.ts";
import {
  getScenarioTimelineAssistantIntegrationContract,
  SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_SELF_MANIFEST,
} from "./scenarioTimelineAssistantContracts.ts";
import {
  answerScenarioTimelineQuestion,
  buildScenarioTimelineAssistantContext,
  buildScenarioTimelineExplanation,
  buildScenarioTimelineHistoryExplanation,
  buildScenarioTimelineMilestones,
  buildScenarioTimelineRecentChanges,
  buildScenarioTimelineStatus,
  buildScenarioTimelineSummary,
  validateScenarioTimelineAssistantContext,
} from "./scenarioTimelineAssistantIntegration.ts";
import { resetScenarioTimelineAssistantRegistryForTests } from "./scenarioTimelineAssistantRegistry.ts";
import type {
  ScenarioTimelineAssistantCertificationCheck,
  ScenarioTimelineAssistantIntegrationCertificationResult,
} from "./scenarioTimelineAssistantTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const SCENARIO_ID = "scenario-assistant-cert-001";
const WORKSPACE_ID = "ws-assistant-cert-001";

const ASSISTANT_MODULES = Object.freeze([
  "app/lib/scenario-timeline/scenarioTimelineAssistantAdapter.ts",
  "app/lib/scenario-timeline/scenarioTimelineAssistantContext.ts",
  "app/lib/scenario-timeline/scenarioTimelineAssistantSummary.ts",
  "app/lib/scenario-timeline/scenarioTimelineAssistantExplanation.ts",
  "app/lib/scenario-timeline/scenarioTimelineAssistantHistory.ts",
  "app/lib/scenario-timeline/scenarioTimelineAssistantRouter.ts",
  "app/lib/scenario-timeline/scenarioTimelineAssistantIntegration.ts",
] as const);

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ScenarioTimelineAssistantCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readModule(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function resetFullStack(): void {
  resetScenarioTimelineAssistantRegistryForTests();
  resetScenarioTimelinePlatformApiForTests();
  resetScenarioTimelineQueryEngineForTests();
  resetScenarioTimelineHistoryEngineForTests();
  resetScenarioTimelineLifecycleEngineForTests();
  resetScenarioTimelineEventEngineForTests();
  resetScenarioTimelinePlatformForTests();
}

function seedTimelineViaApi(): void {
  (SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS as readonly ScenarioTimelineLifecycleStage[]).forEach((stage, index) => {
    const result = createScenarioTimelineEvent({
      scenarioId: SCENARIO_ID,
      workspaceId: WORKSPACE_ID,
      stage,
      eventId: `assistant-cert-${stage}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "assistant-certification",
      title: `Assistant certification ${stage}`,
      summary: "APP-5:7 assistant integration certification event.",
    });
    if (!result.success) {
      throw new Error(result.errors[0]?.message ?? "seed failed");
    }
  });
}

function assistantModulesAvoidDirectEngineImports(): boolean {
  return ASSISTANT_MODULES.every((path) => {
    const source = readModule(path);
    return SCENARIO_TIMELINE_ASSISTANT_FORBIDDEN_API_IMPORTS.every((pattern) => !source.includes(pattern));
  });
}

function assistantAdapterUsesApiLayerOnly(): boolean {
  const adapterSource = readModule("app/lib/scenario-timeline/scenarioTimelineAssistantAdapter.ts");
  return adapterSource.includes("scenarioTimelineApiLayer.ts") && !adapterSource.includes("scenarioTimelineEventEngine.ts");
}

export function certifyScenarioTimelineAssistantIntegration(): ScenarioTimelineAssistantIntegrationCertificationResult {
  resetFullStack();
  initializeScenarioTimeline(FIXED_TIME);
  seedTimelineViaApi();

  const checks: ScenarioTimelineAssistantCertificationCheck[] = [];

  checks.push(
    check(
      "manifest_valid",
      "Stage manifest validates",
      validateStageManifest(SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_SELF_MANIFEST).valid,
      SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "architecture_boundary",
      "Architecture boundary evaluation passes",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/scenario-timeline/scenarioTimelineAssistantIntegration.ts",
        allowedFiles: SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_SELF_MANIFEST.forbiddenPatterns,
      }).allowed,
      "scenarioTimelineAssistantIntegration.ts"
    )
  );

  checks.push(
    check(
      "assistant_contract",
      "Assistant integration contract exposes mandatory fields",
      getScenarioTimelineAssistantIntegrationContract().mandatoryContextFields.length >= 10,
      String(getScenarioTimelineAssistantIntegrationContract().mandatoryContextFields.length)
    )
  );

  checks.push(
    check(
      "app5_6_only",
      "Assistant modules avoid direct engine/registry imports",
      assistantModulesAvoidDirectEngineImports(),
      ASSISTANT_MODULES.join(", ")
    )
  );

  checks.push(
    check(
      "api_layer_adapter",
      "Assistant adapter consumes APP-5:6 API layer only",
      assistantAdapterUsesApiLayerOnly(),
      "scenarioTimelineAssistantAdapter.ts"
    )
  );

  const compatibility = validateScenarioTimelineAssistantCompatibility();
  checks.push(
    check("app5_1_compat", "APP-5:1 compatibility", compatibility.app5_1, String(compatibility.app5_1))
  );
  checks.push(
    check("app5_2_compat", "APP-5:2 compatibility", compatibility.app5_2, String(compatibility.app5_2))
  );
  checks.push(
    check("app5_3_compat", "APP-5:3 compatibility", compatibility.app5_3, String(compatibility.app5_3))
  );
  checks.push(
    check("app5_4_compat", "APP-5:4 compatibility", compatibility.app5_4, String(compatibility.app5_4))
  );
  checks.push(
    check("app5_5_compat", "APP-5:5 compatibility", compatibility.app5_5, String(compatibility.app5_5))
  );
  checks.push(
    check("app5_6_compat", "APP-5:6 compatibility", compatibility.app5_6, String(compatibility.app5_6))
  );

  const contextResult = buildScenarioTimelineAssistantContext({
    scenarioId: SCENARIO_ID,
    workspaceId: WORKSPACE_ID,
  });
  checks.push(
    check(
      "context_builder",
      "Context builder produces immutable assistant context",
      contextResult.success === true && contextResult.data?.readOnly === true,
      contextResult.reason
    )
  );

  const validation = contextResult.data
    ? validateScenarioTimelineAssistantContext(contextResult.data)
    : null;
  checks.push(
    check(
      "context_validator",
      "Assistant context validator passes",
      validation?.success === true && validation.data?.valid === true,
      validation?.reason ?? "no context"
    )
  );

  const summary = buildScenarioTimelineSummary({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });
  checks.push(
    check(
      "summary_builder",
      "Summary builder returns narrative",
      summary.success === true && (summary.data?.narrative.length ?? 0) > 0,
      summary.reason
    )
  );

  const explanation = buildScenarioTimelineExplanation(
    { scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID },
    contextResult.data!,
    "status"
  );
  checks.push(
    check(
      "explanation_builder",
      "Explanation builder returns structured explanation",
      explanation.readOnly === true && explanation.explanation.length > 0,
      explanation.topic
    )
  );

  const historyExplanation = buildScenarioTimelineHistoryExplanation({
    scenarioId: SCENARIO_ID,
    workspaceId: WORKSPACE_ID,
  });
  checks.push(
    check(
      "history_explanation",
      "History explanation builder works",
      historyExplanation.success === true,
      historyExplanation.reason
    )
  );

  const milestones = buildScenarioTimelineMilestones({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });
  checks.push(
    check(
      "milestone_builder",
      "Milestone builder returns milestones",
      milestones.success === true && (milestones.data?.length ?? 0) > 0,
      milestones.reason
    )
  );

  const status = buildScenarioTimelineStatus({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });
  checks.push(
    check(
      "status_builder",
      "Status builder returns lifecycle status",
      status.success === true && status.data?.status !== null,
      status.reason
    )
  );

  const recentChanges = buildScenarioTimelineRecentChanges({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });
  checks.push(
    check(
      "change_builder",
      "Recent changes builder returns change records",
      recentChanges.success === true,
      recentChanges.reason
    )
  );

  const questionAnswer = answerScenarioTimelineQuestion({
    scenarioId: SCENARIO_ID,
    workspaceId: WORKSPACE_ID,
    questionKey: "current_stage",
  });
  checks.push(
    check(
      "question_router",
      "Question router answers supported questions",
      questionAnswer.success === true && questionAnswer.data?.questionKey === "current_stage",
      questionAnswer.reason
    )
  );

  checks.push(
    check(
      "question_coverage",
      "All supported question keys are registered",
      SCENARIO_TIMELINE_ASSISTANT_QUESTION_KEYS.length === 14,
      String(SCENARIO_TIMELINE_ASSISTANT_QUESTION_KEYS.length)
    )
  );

  const identity = resolveScenarioIdentityExample();
  checks.push(
    check(
      "app2_identity_regression",
      "APP-2 scenario identity contract remains compatible",
      validateScenarioIdentityShape(identity).valid,
      identity.scenarioId
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const certified = passedCount === checks.length;

  return Object.freeze({
    certified,
    status: certified ? "PASS" : "FAIL",
    summary: `${passedCount}/${checks.length} certification checks passed for ${SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION}.`,
    checks: Object.freeze(checks),
    readOnly: true as const,
  });
}
