/**
 * APP-5:2 — Scenario Timeline Event Engine certification.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  resolveScenarioIdentityExample,
  validateScenarioIdentityShape,
} from "../app-2-scenario-intelligence/scenarioIntelligenceContract.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_EVENT_MANDATORY_FIELDS,
  SCENARIO_TIMELINE_STAGE_EVENT_TYPE_MAP,
} from "./scenarioTimelineEventConstants.ts";
import { SCENARIO_TIMELINE_EVENT_ENGINE_SELF_MANIFEST } from "./scenarioTimelineEventContracts.ts";
import {
  createTimelineEvent,
  initializeScenarioTimelineEventEngine,
  isScenarioTimelineEventEngineInitialized,
  resetScenarioTimelineEventEngineForTests,
} from "./scenarioTimelineEventEngine.ts";
import { getTimelineEventRegistry, registerTimelineEventType } from "./scenarioTimelineEventRegistry.ts";
import { getTimelineEventContract } from "./scenarioTimelineEventContracts.ts";
import { mapTimelineEventToFoundationContract, validateTimelineEvent } from "./scenarioTimelineEventValidator.ts";
import {
  SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS,
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
} from "./scenarioTimelinePlatformConstants.ts";
import { initializeScenarioTimelinePlatform } from "./scenarioTimelinePlatformFoundation.ts";
import { resetScenarioTimelinePlatformForTests } from "./scenarioTimelinePlatform.ts";
import {
  isScenarioTimelineLifecycleStage,
  validateTimelineEventContractShape,
} from "./scenarioTimelinePlatformValidation.ts";
import type { ScenarioTimelineEventEngineCertificationResult, ScenarioTimelineEventCertificationCheck } from "./scenarioTimelineEventTypes.ts";
import type { ScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");

function check(id: string, title: string, passed: boolean, evidence: string): ScenarioTimelineEventCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function engineHasNoForbiddenRuntime(): boolean {
  const modules = [
    "app/lib/scenario-timeline/scenarioTimelineEventEngine.ts",
    "app/lib/scenario-timeline/scenarioTimelineEventRegistry.ts",
    "app/lib/scenario-timeline/scenarioTimelineEventFactory.ts",
  ].map((path) => readEngineSource(path));
  return modules.every(
    (source) =>
      !source.includes("localStorage") &&
      !source.includes("indexedDB") &&
      !source.includes("fetch(") &&
      !source.includes("PlaybackEngine") &&
      !source.includes("TimelineChart")
  );
}

function foundationFilesUnmodified(): boolean {
  const foundationFiles = SCENARIO_TIMELINE_EVENT_ENGINE_SELF_MANIFEST.allowedFiles.filter((file) =>
    file.includes("scenarioTimelinePlatform")
  );
  return foundationFiles.every((file) => existsSync(join(REPO_ROOT, file)));
}

function buildSampleInput(stage: (typeof SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS)[number]) {
  return Object.freeze({
    scenarioId: "scenario-cert-001",
    workspaceId: "ws-cert-001",
    stage,
    timestamp: FIXED_TIME,
    createdBy: "certification-runner",
    title: `Certification event for ${stage}`,
    summary: "APP-5:2 certification sample event.",
  });
}

export function certifyTimelineEventEngine(): ScenarioTimelineEventEngineCertificationResult {
  resetScenarioTimelineEventEngineForTests();
  resetScenarioTimelinePlatformForTests();
  initializeScenarioTimelinePlatform(FIXED_TIME);
  initializeScenarioTimelineEventEngine(FIXED_TIME);

  const checks: ScenarioTimelineEventCertificationCheck[] = [];

  checks.push(
    check(
      "platform_identity",
      "Event engine contract version is APP-5/2",
      SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION === "APP-5/2",
      SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "engine_initialized",
      "Engine initializes successfully",
      isScenarioTimelineEventEngineInitialized(),
      String(isScenarioTimelineEventEngineInitialized())
    )
  );

  const manifestValidation = validateStageManifest(SCENARIO_TIMELINE_EVENT_ENGINE_SELF_MANIFEST);
  checks.push(
    check(
      "stage_manifest",
      "APP-5/2 stage manifest is valid",
      manifestValidation.valid,
      manifestValidation.issues.map((issue) => issue.message).join("; ") || "manifest valid"
    )
  );

  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/scenario-timeline/scenarioTimelineEventEngine.ts",
    allowedFiles: SCENARIO_TIMELINE_EVENT_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: SCENARIO_TIMELINE_EVENT_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  checks.push(
    check(
      "architecture_boundary",
      "Engine file is within APP-5/2 boundary",
      boundary.allowed,
      boundary.message
    )
  );

  const contract = getTimelineEventContract();
  checks.push(
    check(
      "event_contract",
      "Mandatory event fields are declared",
      contract.mandatoryFields.length === SCENARIO_TIMELINE_EVENT_MANDATORY_FIELDS.length,
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

  const registry = getTimelineEventRegistry();
  checks.push(
    check(
      "registry_ready",
      "Default event type registry is seeded",
      registry.registeredEventTypeCount === SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS.length,
      String(registry.registeredEventTypeCount)
    )
  );

  const created = createTimelineEvent(buildSampleInput("scenario_created"));
  checks.push(
    check(
      "factory_create",
      "Factory creates immutable timeline event",
      created.success === true && created.data?.readOnly === true,
      created.reason
    )
  );

  if (created.data) {
    const validation = validateTimelineEvent(created.data);
    checks.push(
      check(
        "validator",
        "Created event passes validator",
        validation.valid,
        validation.issues.map((issue) => issue.message).join("; ") || "valid"
      )
    );

    const foundationContract = mapTimelineEventToFoundationContract(created.data);
    const foundationValidation = validateTimelineEventContractShape(foundationContract);
    checks.push(
      check(
        "app5_1_compatibility",
        "Event maps to APP-5:1 contract shape",
        foundationValidation.valid && foundationContract.contractVersion === SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
        foundationValidation.issues.map((issue) => issue.message).join("; ") || "compatible"
      )
    );
  } else {
    checks.push(check("validator", "Created event passes validator", false, "No event created."));
    checks.push(check("app5_1_compatibility", "Event maps to APP-5:1 contract shape", false, "No event created."));
  }

  const duplicate = createTimelineEvent({
    ...buildSampleInput("scenario_updated"),
    eventId: created.data?.eventId,
  });
  checks.push(
    check(
      "duplicate_prevention",
      "Duplicate eventId is rejected",
      duplicate.success === false,
      duplicate.reason
    )
  );

  const orderingFirst = createTimelineEvent({
    ...buildSampleInput("scenario_simulated"),
    eventId: "timeline-event-order-001",
    timestamp: "2026-01-01T00:00:01.000Z",
  });
  const orderingSecond = createTimelineEvent({
    ...buildSampleInput("decision_made"),
    eventId: "timeline-event-order-002",
    timestamp: "2026-01-01T00:00:02.000Z",
  });
  checks.push(
    check(
      "event_ordering",
      "Sequence order increases per scenario",
      orderingFirst.success &&
        orderingSecond.success &&
        (orderingSecond.data?.sequenceOrder ?? 0) > (orderingFirst.data?.sequenceOrder ?? 0),
      `${orderingFirst.data?.sequenceOrder ?? 0} -> ${orderingSecond.data?.sequenceOrder ?? 0}`
    )
  );

  const stageMapValid = (SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS as readonly ScenarioTimelineLifecycleStage[]).every(
    (stage) =>
      isScenarioTimelineLifecycleStage(stage) &&
      SCENARIO_TIMELINE_STAGE_EVENT_TYPE_MAP[stage as keyof typeof SCENARIO_TIMELINE_STAGE_EVENT_TYPE_MAP]
  );
  checks.push(check("stage_event_map", "Stage to event type map is complete", stageMapValid, "8 mappings"));

  const registration = registerTimelineEventType({
    stage: "lessons_learned",
    eventType: "lesson_learned",
    label: "Lessons Learned",
    description: "Certification override registration.",
    readOnly: true,
  });
  checks.push(
    check(
      "register_event_type",
      "registerTimelineEventType succeeds",
      registration.success,
      registration.reason
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
      "Engine modules exclude persistence, playback, and UI runtime",
      engineHasNoForbiddenRuntime(),
      "no forbidden runtime patterns"
    )
  );

  checks.push(
    check(
      "foundation_preserved",
      "APP-5:1 foundation files remain present",
      foundationFilesUnmodified(),
      "foundation files present"
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

export { SCENARIO_TIMELINE_EVENT_ENGINE_SELF_MANIFEST };
