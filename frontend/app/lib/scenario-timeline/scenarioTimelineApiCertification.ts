/**
 * APP-5:6 — Scenario Timeline API Layer certification.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  resolveScenarioIdentityExample,
  validateScenarioIdentityShape,
} from "../app-2-scenario-intelligence/scenarioIntelligenceContract.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  SCENARIO_TIMELINE_API_FORBIDDEN_ENGINE_REGISTRY_IMPORTS,
  SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION,
} from "./scenarioTimelineApiConstants.ts";
import { validateScenarioTimelineApiCompatibility } from "./scenarioTimelineApiCompatibility.ts";
import { SCENARIO_TIMELINE_API_LAYER_SELF_MANIFEST } from "./scenarioTimelineApiContracts.ts";
import { getTimelineApiRegistry, resetScenarioTimelineApiRegistryForTests } from "./scenarioTimelineApiRegistry.ts";
import { resetScenarioTimelineApiRequestSequenceForTests } from "./scenarioTimelineApiErrors.ts";
import {
  resetScenarioTimelineApiLayerForTests,
  createScenarioTimelineEvent,
  getScenarioTimeline,
  getScenarioTimelineHealth,
  getScenarioTimelineMilestones,
  getScenarioTimelineProgress,
  getScenarioTimelineStatus,
  getScenarioTimelineSummary,
  getScenarioTimelineVersion,
  initializeScenarioTimeline,
  isScenarioTimelineApiLayerInitialized,
  queryScenarioTimeline,
  validateScenarioTimeline,
} from "./scenarioTimelineApiFacade.ts";
import { getScenarioTimelineApiContract } from "./scenarioTimelineApiContracts.ts";
import { resetScenarioTimelineEventEngineForTests } from "./scenarioTimelineEventEngine.ts";
import { resetScenarioTimelineLifecycleEngineForTests } from "./scenarioTimelineLifecycleEngine.ts";
import { resetScenarioTimelineHistoryEngineForTests } from "./scenarioTimelineHistoryEngine.ts";
import { resetScenarioTimelineQueryEngineForTests } from "./scenarioTimelineQueryEngine.ts";
import { resetScenarioTimelinePlatformForTests } from "./scenarioTimelinePlatform.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS, SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION } from "./scenarioTimelinePlatformConstants.ts";
import type {
  ScenarioTimelineApiCertificationCheck,
  ScenarioTimelineApiLayerCertificationResult,
} from "./scenarioTimelineApiTypes.ts";
import type { ScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const SCENARIO_ID = "scenario-api-cert-001";
const WORKSPACE_ID = "ws-api-cert-001";

function check(id: string, title: string, passed: boolean, evidence: string): ScenarioTimelineApiCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readApiSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function resetScenarioTimelinePlatformApiForTests(): void {
  resetScenarioTimelineApiLayerForTests();
  resetScenarioTimelineApiRegistryForTests();
  resetScenarioTimelineApiRequestSequenceForTests();
}

function apiLayerAvoidsDirectRegistryImports(): boolean {
  const modules = [
    "app/lib/scenario-timeline/scenarioTimelineApiLayer.ts",
    "app/lib/scenario-timeline/scenarioTimelineApiFacade.ts",
    "app/lib/scenario-timeline/scenarioTimelineApiRouter.ts",
    "app/lib/scenario-timeline/scenarioTimelineApiSources.ts",
  ].map((path) => readApiSource(path));
  return modules.every((source) =>
    SCENARIO_TIMELINE_API_FORBIDDEN_ENGINE_REGISTRY_IMPORTS.every((pattern) => !source.includes(pattern))
  );
}

function seedTimelineViaApi(): void {
  (SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS as readonly ScenarioTimelineLifecycleStage[]).forEach((stage, index) => {
    const result = createScenarioTimelineEvent({
      scenarioId: SCENARIO_ID,
      workspaceId: WORKSPACE_ID,
      stage,
      eventId: `api-cert-${stage}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "api-certification",
      title: `API certification ${stage}`,
      summary: "APP-5:6 API certification event.",
    });
    if (!result.success) {
      throw new Error(result.errors[0]?.message ?? result.metadata.requestId);
    }
  });
}

export function certifyScenarioTimelineApiLayer(): ScenarioTimelineApiLayerCertificationResult {
  resetScenarioTimelinePlatformApiForTests();
  resetScenarioTimelineQueryEngineForTests();
  resetScenarioTimelineHistoryEngineForTests();
  resetScenarioTimelineLifecycleEngineForTests();
  resetScenarioTimelineEventEngineForTests();
  resetScenarioTimelinePlatformForTests();

  initializeScenarioTimeline(FIXED_TIME);

  const checks: ScenarioTimelineApiCertificationCheck[] = [];

  checks.push(
    check(
      "platform_identity",
      "API layer contract version is APP-5/6",
      SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION === "APP-5/6",
      SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "api_initialized",
      "API layer initializes successfully",
      isScenarioTimelineApiLayerInitialized(),
      String(isScenarioTimelineApiLayerInitialized())
    )
  );

  const manifestValidation = validateStageManifest(SCENARIO_TIMELINE_API_LAYER_SELF_MANIFEST);
  checks.push(
    check(
      "stage_manifest",
      "APP-5/6 stage manifest is valid",
      manifestValidation.valid,
      manifestValidation.issues.map((issue) => issue.message).join("; ") || "manifest valid"
    )
  );

  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/scenario-timeline/scenarioTimelineApiLayer.ts",
    allowedFiles: SCENARIO_TIMELINE_API_LAYER_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: SCENARIO_TIMELINE_API_LAYER_SELF_MANIFEST.forbiddenPatterns,
  });
  checks.push(
    check(
      "architecture_boundary",
      "API layer file is within APP-5/6 boundary",
      boundary.allowed,
      boundary.message
    )
  );

  const contract = getScenarioTimelineApiContract();
  checks.push(
    check(
      "api_contract",
      "API contract declares consumer gateway rules",
      contract.consumerMustUseApiLayer === true && contract.categories.length >= 10,
      contract.categories.join(",")
    )
  );

  checks.push(
    check(
      "no_registry_bypass",
      "API layer modules avoid direct engine registry imports",
      apiLayerAvoidsDirectRegistryImports(),
      "registry imports absent"
    )
  );

  const compatibility = validateScenarioTimelineApiCompatibility();
  checks.push(
    check(
      "engine_compatibility",
      "API compatibility validates APP-5:1 through APP-5:5",
      compatibility.compatible,
      compatibility.errors.map((error) => error.message).join("; ") || "compatible"
    )
  );

  seedTimelineViaApi();

  const timeline = getScenarioTimeline({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });
  checks.push(
    check(
      "get_scenario_timeline",
      "getScenarioTimeline returns immutable API response",
      timeline.success === true && timeline.data?.readOnly === true && timeline.metadata.readOnly === true,
      timeline.metadata.requestId
    )
  );

  const query = queryScenarioTimeline({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });
  const progress = getScenarioTimelineProgress({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });
  const status = getScenarioTimelineStatus({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });
  const summary = getScenarioTimelineSummary({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });
  const milestones = getScenarioTimelineMilestones({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });

  checks.push(
    check(
      "public_api_surface",
      "Public API methods execute through gateway",
      query.success && progress.success && status.success && summary.success && milestones.success,
      "query/progress/status/summary/milestones"
    )
  );

  checks.push(
    check(
      "version_manager",
      "Version manager exposes layered versions",
      getScenarioTimelineVersion().apiLayerVersion === "APP-5/6" &&
        getScenarioTimelineVersion().queryEngineVersion === "APP-5/5",
      getScenarioTimelineVersion().apiLayerVersion
    )
  );

  const health = getScenarioTimelineHealth();
  checks.push(
    check(
      "health_api",
      "Health API reports ready engines",
      health.success === true && health.data?.healthy === true,
      String(health.data?.healthy)
    )
  );

  const validation = validateScenarioTimeline({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });
  checks.push(
    check(
      "validation_api",
      "validateScenarioTimeline returns validation projection",
      validation.success === true && validation.data?.valid === true,
      String(validation.data?.valid)
    )
  );

  checks.push(
    check(
      "api_registry",
      "API registry records gateway requests",
      getTimelineApiRegistry().registeredRequestCount >= 5,
      String(getTimelineApiRegistry().registeredRequestCount)
    )
  );

  checks.push(
    check(
      "immutable_responses",
      "API responses are immutable read-only objects",
      timeline.metadata.readOnly === true && timeline.errors.every((entry) => entry.readOnly === true),
      timeline.metadata.requestId
    )
  );

  const scenarioIdentity = resolveScenarioIdentityExample();
  checks.push(
    check(
      "app2_regression",
      "APP-2 scenario identity contract remains valid",
      validateScenarioIdentityShape(scenarioIdentity).valid,
      "valid"
    )
  );

  const priorFilesPresent = SCENARIO_TIMELINE_API_LAYER_SELF_MANIFEST.allowedFiles
    .filter((file) => !file.includes("scenarioTimelineApi") && !file.includes("app-5-6"))
    .every((file) => existsSync(join(REPO_ROOT, file)));
  checks.push(
    check(
      "prior_phases_preserved",
      "APP-5:1 through APP-5:5 files remain present",
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

export { SCENARIO_TIMELINE_API_LAYER_SELF_MANIFEST };
