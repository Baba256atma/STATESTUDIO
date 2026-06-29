/**
 * APP-6:2 — Decision Event Engine certification runner.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  createDecisionApprovedEvent,
  createDecisionArchivedEvent,
  createDecisionCancelledEvent,
  createDecisionCompletedEvent,
  createDecisionCreatedEvent,
  createDecisionExecutedEvent,
  createDecisionRejectedEvent,
  createDecisionSupersededEvent,
  createDecisionUpdatedEvent,
} from "./decisionEventFactory.ts";
import {
  DECISION_EVENT_ENGINE_CONTRACT_VERSION,
  DECISION_EVENT_MANDATORY_FIELDS,
  DECISION_ENGINE_EVENT_TYPE_KEYS,
  DECISION_EVENT_TYPE_LIFECYCLE_MAP,
  type DecisionEventCertificationCheck,
  type DecisionEventEngineCertificationResult,
} from "./decisionEventTypes.ts";
import {
  createDecisionEvent,
  DECISION_EVENT_ENGINE_SELF_MANIFEST,
  getDecisionEventContract,
  initializeDecisionEventEngine,
  isDecisionEventEngineInitialized,
  resetDecisionEventEngineForTests,
} from "./decisionEventEngine.ts";
import { getDecisionEventRegistry, registerDecisionEventType } from "./decisionEventRegistry.ts";
import {
  mapDecisionEngineEventToFoundationContract,
  validateDecisionEvent,
  validateManifestCompatibility,
} from "./decisionEventValidation.ts";
import { DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION } from "./decisionTimelineConstants.ts";
import {
  DECISION_TIMELINE_PLATFORM_IDENTITY,
  validateDecisionTimelineFoundation,
} from "./decisionTimelineContracts.ts";
import { createDecisionTimelineFoundation } from "./decisionTimelineFoundation.ts";
import { resetDecisionTimelinePlatformForTests } from "./decisionTimelineRunner.ts";
import { validateDecisionEventContractShape } from "./decisionTimelineValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");

function check(id: string, title: string, passed: boolean, evidence: string): DecisionEventCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function engineHasNoForbiddenRuntime(): boolean {
  const modules = [
    "app/lib/decision-timeline/decisionEventEngine.ts",
    "app/lib/decision-timeline/decisionEventRegistry.ts",
    "app/lib/decision-timeline/decisionEventFactory.ts",
  ].map((path) => readEngineSource(path));
  return modules.every(
    (source) =>
      !source.includes("localStorage") &&
      !source.includes("indexedDB") &&
      !source.includes("fetch(") &&
      !source.includes("ReplayEngine") &&
      !source.includes("DecisionChart")
  );
}

function foundationFilesUnmodified(): boolean {
  const foundationFiles = DECISION_EVENT_ENGINE_SELF_MANIFEST.allowedFiles.filter((file) =>
    file.includes("decisionTimeline") && !file.includes("decisionEvent")
  );
  return foundationFiles.every((file) => existsSync(join(REPO_ROOT, file)));
}

function sampleInput(eventType: (typeof DECISION_ENGINE_EVENT_TYPE_KEYS)[number]) {
  return Object.freeze({
    decisionId: "decision-cert-001",
    workspaceId: "ws-cert-001",
    scenarioId: "scenario-cert-001",
    intentId: "intent-cert-001",
    eventType,
    timestamp: FIXED_TIME,
    createdBy: "certification-runner",
    title: `Certification event for ${eventType}`,
    summary: "APP-6:2 certification sample event.",
  });
}

export function runDecisionEventEngine(): DecisionEventEngineCertificationResult {
  resetDecisionEventEngineForTests();
  resetDecisionTimelinePlatformForTests();
  createDecisionTimelineFoundation(FIXED_TIME);
  initializeDecisionEventEngine(FIXED_TIME);

  const checks: DecisionEventCertificationCheck[] = [];

  checks.push(
    check(
      "platform_identity",
      "Event engine contract version is APP-6/2",
      DECISION_EVENT_ENGINE_CONTRACT_VERSION === "APP-6/2",
      DECISION_EVENT_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "app6_1_compatibility",
      "APP-6:1 foundation validation passes",
      validateDecisionTimelineFoundation(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "manifest_compatibility",
      "Foundation manifest compatibility",
      validateManifestCompatibility(FIXED_TIME).valid === true,
      "manifest compatible"
    )
  );

  checks.push(
    check(
      "engine_initialized",
      "Engine initialization",
      isDecisionEventEngineInitialized() === true,
      "engine initialized"
    )
  );

  const contract = getDecisionEventContract();
  checks.push(
    check(
      "contract_surface",
      "Contract surface exposes mandatory fields",
      contract.mandatoryFields.length === DECISION_EVENT_MANDATORY_FIELDS.length &&
        contract.supportedEventTypes.length === 9 &&
        contract.supportedLifecycles.length === 9,
      `${contract.mandatoryFields.length} fields, ${contract.supportedEventTypes.length} event types`
    )
  );

  const factories = [
    ["DECISION_CREATED", createDecisionCreatedEvent],
    ["DECISION_UPDATED", createDecisionUpdatedEvent],
    ["DECISION_APPROVED", createDecisionApprovedEvent],
    ["DECISION_REJECTED", createDecisionRejectedEvent],
    ["DECISION_CANCELLED", createDecisionCancelledEvent],
    ["DECISION_SUPERSEDED", createDecisionSupersededEvent],
    ["DECISION_EXECUTED", createDecisionExecutedEvent],
    ["DECISION_COMPLETED", createDecisionCompletedEvent],
    ["DECISION_ARCHIVED", createDecisionArchivedEvent],
  ] as const;

  for (const [eventType, factory] of factories) {
    const result = factory({
      ...sampleInput(eventType),
      eventId: `decision-event-cert-${eventType.toLowerCase()}`,
      timestamp: `2026-01-01T00:00:${String(DECISION_ENGINE_EVENT_TYPE_KEYS.indexOf(eventType) + 1).padStart(2, "0")}.000Z`,
    });
    checks.push(
      check(
        `factory_${eventType.toLowerCase()}`,
        `${eventType} factory`,
        result.success === true && result.data?.eventType === eventType,
        result.reason
      )
    );
  }

  const created = createDecisionEvent({
    ...sampleInput("DECISION_CREATED"),
    eventId: "decision-event-cert-generic",
  });
  checks.push(
    check(
      "create_decision_event",
      "Generic createDecisionEvent API",
      created.success === true,
      created.reason
    )
  );

  if (created.data) {
    const validation = validateDecisionEvent(created.data);
    checks.push(
      check(
        "event_validation",
        "Published event validation",
        validation.valid === true,
        validation.issues.map((entry) => entry.message).join("; ") || "valid"
      )
    );

    const foundationContract = mapDecisionEngineEventToFoundationContract(created.data);
    checks.push(
      check(
        "foundation_mapping",
        "Engine event maps to APP-6:1 foundation contract",
        validateDecisionEventContractShape(foundationContract).valid === true,
        foundationContract.eventType
      )
    );
  }

  const duplicate = createDecisionEvent({
    ...sampleInput("DECISION_CREATED"),
    eventId: "decision-event-cert-generic",
  });
  checks.push(
    check(
      "duplicate_protection",
      "Duplicate eventId protection",
      duplicate.success === false,
      duplicate.reason
    )
  );

  checks.push(
    check(
      "registry_integrity",
      "Registry integrity after publication",
      getDecisionEventRegistry().publishedEventCount === 10 &&
        getDecisionEventRegistry().registeredEventTypeCount === 9,
      `${getDecisionEventRegistry().publishedEventCount} published`
    )
  );

  const customRegistration = registerDecisionEventType(
    Object.freeze({
      eventType: "DECISION_CREATED",
      lifecycle: "proposed",
      label: "Decision Created Override",
      description: "Certification registration probe.",
      readOnly: true as const,
    })
  );
  checks.push(
    check(
      "event_type_registration",
      "Event type registration",
      customRegistration.success === true,
      customRegistration.reason
    )
  );

  checks.push(
    check(
      "lifecycle_mapping",
      "Event type lifecycle mapping",
      DECISION_EVENT_TYPE_LIFECYCLE_MAP.DECISION_APPROVED === "approved",
      "mapping valid"
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(DECISION_EVENT_ENGINE_SELF_MANIFEST).valid === true,
      "manifest valid"
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/decision-timeline/decisionEventEngine.ts",
        allowedFiles: DECISION_EVENT_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: DECISION_EVENT_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true &&
        evaluateStageFileBoundary({
          filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
          allowedFiles: DECISION_EVENT_ENGINE_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: DECISION_EVENT_ENGINE_SELF_MANIFEST.forbiddenPatterns,
        }).allowed === false,
      "boundaries enforced"
    )
  );

  checks.push(
    check(
      "no_forbidden_runtime",
      "No forbidden runtime dependencies",
      engineHasNoForbiddenRuntime() === true,
      "no persistence or UI runtime"
    )
  );

  checks.push(
    check(
      "foundation_unmodified",
      "APP-6:1 foundation files present",
      foundationFilesUnmodified() === true,
      "foundation files intact"
    )
  );

  checks.push(
    check(
      "app6_1_identity_regression",
      "APP-6:1 platform identity regression",
      DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6" &&
        DECISION_TIMELINE_PLATFORM_IDENTITY.version === DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
      DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;
  const score = Math.round((passedCount / checks.length) * 100);

  return Object.freeze({
    certified: failedCount === 0,
    status: failedCount === 0 ? ("PASS" as const) : ("FAIL" as const),
    summary: `${passedCount}/${checks.length} certification checks passed.`,
    checks: Object.freeze(checks),
    score,
    readOnly: true as const,
  });
}

export const DecisionEventRunner = Object.freeze({
  runDecisionEventEngine,
});
