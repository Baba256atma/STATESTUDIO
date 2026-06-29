/**
 * APP-5:3 — Scenario Timeline Lifecycle Engine certification.
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
import {
  SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_LIFECYCLE_MANDATORY_FIELDS,
} from "./scenarioTimelineLifecycleConstants.ts";
import { validateLifecycleEventCompatibility } from "./scenarioTimelineLifecycleCompatibility.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_ENGINE_SELF_MANIFEST } from "./scenarioTimelineLifecycleContracts.ts";
import {
  buildScenarioLifecycle,
  calculateScenarioLifecycle,
  initializeScenarioTimelineLifecycleEngine,
  isScenarioTimelineLifecycleEngineInitialized,
  resetScenarioTimelineLifecycleEngineForTests,
  validateScenarioTransition,
} from "./scenarioTimelineLifecycleEngine.ts";
import { validateScenarioLifecycle } from "./scenarioTimelineLifecycleBuilder.ts";
import { getLifecycleRegistry } from "./scenarioTimelineLifecycleRegistry.ts";
import { getScenarioLifecycleContract } from "./scenarioTimelineLifecycleContracts.ts";
import {
  SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS,
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
} from "./scenarioTimelinePlatformConstants.ts";
import { initializeScenarioTimelinePlatform } from "./scenarioTimelinePlatformFoundation.ts";
import { resetScenarioTimelinePlatformForTests } from "./scenarioTimelinePlatform.ts";
import { validateTimelineEventContractShape } from "./scenarioTimelinePlatformValidation.ts";
import { mapTimelineEventToFoundationContract } from "./scenarioTimelineEventValidator.ts";
import type {
  ScenarioTimelineLifecycleCertificationCheck,
  ScenarioTimelineLifecycleEngineCertificationResult,
} from "./scenarioTimelineLifecycleTypes.ts";
import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";

import type { ScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");

function check(id: string, title: string, passed: boolean, evidence: string): ScenarioTimelineLifecycleCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readLifecycleSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function engineHasNoForbiddenRuntime(): boolean {
  const modules = [
    "app/lib/scenario-timeline/scenarioTimelineLifecycleEngine.ts",
    "app/lib/scenario-timeline/scenarioTimelineLifecycleRegistry.ts",
    "app/lib/scenario-timeline/scenarioTimelineLifecycleBuilder.ts",
  ].map((path) => readLifecycleSource(path));
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

function createOrderedLifecycleEvents(scenarioId: string, workspaceId: string): ScenarioTimelineEvent[] {
  resetScenarioTimelineEventEngineForTests();
  initializeScenarioTimelinePlatform(FIXED_TIME);
  initializeScenarioTimelineEventEngine(FIXED_TIME);

  const events: ScenarioTimelineEvent[] = [];
  (SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS as readonly ScenarioTimelineLifecycleStage[]).forEach((stage, index) => {
    const result = createTimelineEvent({
      scenarioId,
      workspaceId,
      stage,
      eventId: `lifecycle-cert-${stage}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "lifecycle-certification",
      title: `Certification ${stage}`,
      summary: "APP-5:3 lifecycle certification event.",
    });
    if (!result.success || !result.data) {
      throw new Error(result.reason);
    }
    events.push(result.data);
  });
  return events;
}

export function certifyScenarioLifecycleEngine(): ScenarioTimelineLifecycleEngineCertificationResult {
  resetScenarioTimelineLifecycleEngineForTests();
  resetScenarioTimelineEventEngineForTests();
  resetScenarioTimelinePlatformForTests();
  initializeScenarioTimelinePlatform(FIXED_TIME);
  initializeScenarioTimelineEventEngine(FIXED_TIME);
  initializeScenarioTimelineLifecycleEngine(FIXED_TIME);

  const checks: ScenarioTimelineLifecycleCertificationCheck[] = [];

  checks.push(
    check(
      "platform_identity",
      "Lifecycle engine contract version is APP-5/3",
      SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION === "APP-5/3",
      SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "engine_initialized",
      "Lifecycle engine initializes successfully",
      isScenarioTimelineLifecycleEngineInitialized(),
      String(isScenarioTimelineLifecycleEngineInitialized())
    )
  );

  const manifestValidation = validateStageManifest(SCENARIO_TIMELINE_LIFECYCLE_ENGINE_SELF_MANIFEST);
  checks.push(
    check(
      "stage_manifest",
      "APP-5/3 stage manifest is valid",
      manifestValidation.valid,
      manifestValidation.issues.map((issue) => issue.message).join("; ") || "manifest valid"
    )
  );

  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/scenario-timeline/scenarioTimelineLifecycleEngine.ts",
    allowedFiles: SCENARIO_TIMELINE_LIFECYCLE_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: SCENARIO_TIMELINE_LIFECYCLE_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  checks.push(
    check(
      "architecture_boundary",
      "Lifecycle engine file is within APP-5/3 boundary",
      boundary.allowed,
      boundary.message
    )
  );

  const contract = getScenarioLifecycleContract();
  checks.push(
    check(
      "lifecycle_contract",
      "Mandatory lifecycle fields are declared",
      contract.mandatoryFields.length === SCENARIO_TIMELINE_LIFECYCLE_MANDATORY_FIELDS.length,
      contract.mandatoryFields.join(",")
    )
  );

  checks.push(
    check(
      "frozen_vocabulary",
      "Lifecycle vocabulary matches APP-5:1 (8 stages)",
      contract.supportedStages.length === 8,
      String(contract.supportedStages.length)
    )
  );

  const events = createOrderedLifecycleEvents("scenario-lifecycle-cert-001", "ws-lifecycle-cert-001");
  const compatibility = validateLifecycleEventCompatibility(events);
  checks.push(
    check(
      "app5_2_compatibility",
      "Lifecycle consumes APP-5:2 compatible events",
      compatibility.valid,
      compatibility.issues.map((issue) => issue.message).join("; ") || "compatible"
    )
  );

  const foundationValid = events.every(
    (event) => validateTimelineEventContractShape(mapTimelineEventToFoundationContract(event)).valid
  );
  checks.push(
    check(
      "app5_1_compatibility",
      "Lifecycle events map to APP-5:1 contracts",
      foundationValid,
      String(foundationValid)
    )
  );

  const built = buildScenarioLifecycle({ events });
  checks.push(
    check(
      "lifecycle_builder",
      "Lifecycle builder produces immutable lifecycle object",
      built.readOnly === true && built.scenarioId === "scenario-lifecycle-cert-001",
      built.scenarioId
    )
  );

  const lifecycleValidation = validateScenarioLifecycle(built);
  checks.push(
    check(
      "lifecycle_validator",
      "Built lifecycle passes validator",
      lifecycleValidation.valid,
      lifecycleValidation.issues.map((issue) => issue.message).join("; ") || "valid"
    )
  );

  checks.push(
    check(
      "current_stage",
      "Current stage resolves to terminal stage for full lifecycle",
      built.currentStage === "lessons_learned",
      built.currentStage ?? "null"
    )
  );

  checks.push(
    check(
      "progress_calculation",
      "Progress reaches 100% for completed lifecycle",
      built.progressPercentage === 100,
      String(built.progressPercentage)
    )
  );

  checks.push(
    check(
      "status_calculation",
      "Status resolves to completed for full lifecycle",
      built.status === "completed" && built.isCompleted === true,
      built.status
    )
  );

  const calculated = calculateScenarioLifecycle({ events });
  checks.push(
    check(
      "lifecycle_calculator",
      "calculateScenarioLifecycle registers lifecycle",
      calculated.success === true && getLifecycleRegistry().registeredLifecycleCount >= 1,
      calculated.reason
    )
  );

  const skipTransition = validateScenarioTransition("scenario_created", "decision_made");
  checks.push(
    check(
      "transition_rules",
      "Invalid stage skips are rejected",
      skipTransition.valid === false,
      skipTransition.reason
    )
  );

  const duplicateCreated = validateScenarioTransition("scenario_created", "scenario_created");
  checks.push(
    check(
      "duplicate_stage_rules",
      "Duplicate scenario_created is rejected",
      duplicateCreated.valid === false,
      duplicateCreated.reason
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
      "Lifecycle modules exclude persistence, playback, and UI runtime",
      engineHasNoForbiddenRuntime(),
      "no forbidden runtime patterns"
    )
  );

  const priorFilesPresent = SCENARIO_TIMELINE_LIFECYCLE_ENGINE_SELF_MANIFEST.allowedFiles
    .filter((file) => file.includes("scenarioTimelineEvent") || file.includes("scenarioTimelinePlatform"))
    .every((file) => existsSync(join(REPO_ROOT, file)));
  checks.push(
    check(
      "prior_phases_preserved",
      "APP-5:1 and APP-5:2 files remain present",
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

export { SCENARIO_TIMELINE_LIFECYCLE_ENGINE_SELF_MANIFEST };
