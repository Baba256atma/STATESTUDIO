/**
 * APP-7:1 — Business Timeline Platform foundation runner.
 */

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import {
  BUSINESS_TIMELINE_EXTENSION_REGISTRY,
  BUSINESS_TIMELINE_FUTURE_COMPATIBILITY,
  BUSINESS_TIMELINE_FUTURE_PHASE_KEYS,
  BUSINESS_TIMELINE_MANDATORY_EVENT_FIELDS,
  BUSINESS_TIMELINE_MUST_NOT_OWN,
  BUSINESS_TIMELINE_PLATFORM_CAPABILITIES,
  BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
  BUSINESS_TIMELINE_PLATFORM_PRINCIPLES,
  BUSINESS_TIMELINE_RELEASE_METADATA,
} from "./businessTimelineConstants.ts";
import {
  BUSINESS_TIMELINE_FREEZE_RULES,
  BUSINESS_TIMELINE_PLATFORM_IDENTITY,
  BUSINESS_TIMELINE_PLATFORM_SELF_MANIFEST,
  BUSINESS_TIMELINE_PUBLIC_API_RULES,
  getBusinessTimelineManifest,
  resolveBusinessEventTypeRegistrationExample,
  validateBusinessTimeline,
} from "./businessTimelineContracts.ts";
import {
  createBusinessTimelineFoundation,
  getBusinessTimelineFoundationVersionMetadata,
  isBusinessTimelinePlatformInitialized,
  resetBusinessTimelineFoundationForTests,
} from "./businessTimelineFoundation.ts";
import {
  getBusinessTimelineRegistry,
  registerBusinessEventType,
  registerBusinessTimeline,
  registerFutureExtension,
  registerMetadataExtension,
  resetBusinessTimelineRegistryForTests,
} from "./businessTimelineRegistry.ts";
import type { BusinessCertificationCheck, BusinessCertificationResult } from "./businessTimelineTypes.ts";
import {
  hasDuplicateIds,
  isReservedBusinessEventTypeId,
  validateBusinessEventTypeRegistration,
} from "./businessTimelineValidation.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
} from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function check(id: string, title: string, passed: boolean, evidence: string): BusinessCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

export function resetBusinessTimelinePlatformForTests(): void {
  resetBusinessTimelineRegistryForTests();
  resetBusinessTimelineFoundationForTests();
}

export function runBusinessTimelineFoundation(
  timestamp: string = FIXED_TIME
): BusinessCertificationResult {
  resetBusinessTimelinePlatformForTests();

  const checks: BusinessCertificationCheck[] = [];
  const foundation = createBusinessTimelineFoundation(timestamp);
  checks.push(
    check(
      "platform_identity",
      "Platform identity and foundation creation",
      foundation.success && BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7",
      foundation.reason
    )
  );

  const manifest = getBusinessTimelineManifest(timestamp);
  checks.push(
    check(
      "manifest",
      "Manifest integrity",
      manifest.manifestVersion === BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION && Object.isFrozen(manifest),
      `manifestVersion=${manifest.manifestVersion}`
    )
  );

  checks.push(
    check(
      "registry",
      "Registry integrity with default categories, statuses, and importance levels",
      manifest.registrySnapshot.categoryCount === 19 &&
        manifest.registrySnapshot.statusTypeCount === 4 &&
        manifest.registrySnapshot.importanceTypeCount === 4,
      `categories=${manifest.registrySnapshot.categoryCount}, statuses=${manifest.registrySnapshot.statusTypeCount}, importance=${manifest.registrySnapshot.importanceTypeCount}`
    )
  );

  const timeline = registerBusinessTimeline(
    Object.freeze({
      timelineId: "business-timeline-ws-cert-001",
      workspaceId: "ws-cert-001",
      label: "Certification Timeline",
      description: "APP-7:1 certification timeline registration.",
    }),
    timestamp
  );
  checks.push(
    check(
      "timeline_registration",
      "Business timeline registration",
      timeline.success === true,
      timeline.reason
    )
  );

  const typeRegistration = resolveBusinessEventTypeRegistrationExample();
  const registered = registerBusinessEventType(typeRegistration, timestamp);
  checks.push(
    check(
      "event_type_registration",
      "Business event type registration",
      registered.success === true,
      registered.reason
    )
  );

  checks.push(
    check(
      "duplicate_protection",
      "Duplicate event type protection",
      registerBusinessEventType(typeRegistration, timestamp).success === false,
      "duplicate rejected"
    )
  );

  checks.push(
    check(
      "reserved_names",
      "Reserved business event type id protection",
      isReservedBusinessEventTypeId("business-system") === true,
      "business-system reserved"
    )
  );

  checks.push(
    check(
      "foundation_validation",
      "Foundation validation report",
      validateBusinessTimeline(timestamp).valid === true,
      "valid"
    )
  );

  checks.push(
    check(
      "public_api_rules",
      "Public API rules enforce metadata-only foundation",
      BUSINESS_TIMELINE_PUBLIC_API_RULES.metadataOnly === true &&
        BUSINESS_TIMELINE_PUBLIC_API_RULES.noVisualization === true,
      "metadata-only"
    )
  );

  checks.push(
    check(
      "freeze_rules",
      "Freeze rules present",
      BUSINESS_TIMELINE_FREEZE_RULES.noRuntimeExecution === true &&
        BUSINESS_TIMELINE_FREEZE_RULES.noVisualization === true,
      "freeze rules"
    )
  );

  checks.push(
    check(
      "extension_registry",
      "Extension registry registered",
      BUSINESS_TIMELINE_EXTENSION_REGISTRY.length >= 4,
      String(BUSINESS_TIMELINE_EXTENSION_REGISTRY.length)
    )
  );

  const metadataExtension = registerMetadataExtension(
    Object.freeze({
      extensionId: "business-context-v1",
      label: "Business Context v1",
      description: "Context metadata extension.",
    })
  );
  checks.push(
    check(
      "metadata_extension",
      "Metadata extension registration",
      metadataExtension.success === true,
      metadataExtension.reason
    )
  );

  const futureExtension = registerFutureExtension(
    Object.freeze({
      extensionId: "business-events-phase",
      label: "Business Events Phase",
      phaseKey: "business_events",
    })
  );
  checks.push(
    check(
      "future_extension",
      "Future extension registration",
      futureExtension.success === true,
      futureExtension.reason
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(BUSINESS_TIMELINE_PLATFORM_SELF_MANIFEST).valid === true,
      BUSINESS_TIMELINE_PLATFORM_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/business-timeline/businessTimelineRegistry.ts",
        allowedFiles: BUSINESS_TIMELINE_PLATFORM_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: BUSINESS_TIMELINE_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true &&
        evaluateStageFileBoundary({
          filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
          allowedFiles: BUSINESS_TIMELINE_PLATFORM_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: BUSINESS_TIMELINE_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
        }).allowed === false,
      "boundaries enforced"
    )
  );

  checks.push(
    check(
      "app5_regression",
      "APP-5 scenario timeline identity regression",
      SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5",
      SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "app6_regression",
      "APP-6 decision timeline identity regression",
      DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6",
      DECISION_TIMELINE_PLATFORM_IDENTITY.version
    )
  );

  checks.push(
    check(
      "future_compatibility",
      "Future compatibility metadata",
      BUSINESS_TIMELINE_FUTURE_COMPATIBILITY.eventsReady === false &&
        BUSINESS_TIMELINE_FUTURE_COMPATIBILITY.visualizationReady === false,
      "future phases deferred"
    )
  );

  checks.push(
    check(
      "must_not_own",
      "Platform must-not-own boundaries",
      BUSINESS_TIMELINE_MUST_NOT_OWN.includes("timeline_engine") &&
        BUSINESS_TIMELINE_MUST_NOT_OWN.includes("visualization"),
      String(BUSINESS_TIMELINE_MUST_NOT_OWN.length)
    )
  );

  checks.push(
    check(
      "mandatory_fields",
      "Mandatory business event fields",
      BUSINESS_TIMELINE_MANDATORY_EVENT_FIELDS.length === 15,
      String(BUSINESS_TIMELINE_MANDATORY_EVENT_FIELDS.length)
    )
  );

  checks.push(
    check(
      "capabilities",
      "Platform capabilities declared",
      BUSINESS_TIMELINE_PLATFORM_CAPABILITIES.length >= 7,
      String(BUSINESS_TIMELINE_PLATFORM_CAPABILITIES.length)
    )
  );

  checks.push(
    check(
      "principles",
      "Platform principles declared",
      BUSINESS_TIMELINE_PLATFORM_PRINCIPLES.includes("no_visualization_logic"),
      String(BUSINESS_TIMELINE_PLATFORM_PRINCIPLES.length)
    )
  );

  checks.push(
    check(
      "release_metadata",
      "Release metadata present",
      BUSINESS_TIMELINE_RELEASE_METADATA.readOnly === true,
      BUSINESS_TIMELINE_RELEASE_METADATA.platformStatus
    )
  );

  checks.push(
    check(
      "duplicate_ids",
      "Duplicate id detection",
      hasDuplicateIds(["a", "b", "a"]) === true && hasDuplicateIds(["a", "b"]) === false,
      "duplicate detection"
    )
  );

  checks.push(
    check(
      "event_type_validation",
      "Event type registration validation",
      validateBusinessEventTypeRegistration(resolveBusinessEventTypeRegistrationExample()).valid === true,
      "valid"
    )
  );

  checks.push(
    check(
      "foundation_version",
      "Foundation version metadata",
      getBusinessTimelineFoundationVersionMetadata().foundationVersion === "APP-7/1",
      getBusinessTimelineFoundationVersionMetadata().foundationVersion
    )
  );

  checks.push(
    check(
      "platform_initialized",
      "Platform initialized after foundation creation",
      isBusinessTimelinePlatformInitialized() === true,
      String(getBusinessTimelineRegistry().categories.length)
    )
  );

  checks.push(
    check(
      "future_phase_keys",
      "Future phase keys declared",
      BUSINESS_TIMELINE_FUTURE_PHASE_KEYS.includes("business_events"),
      String(BUSINESS_TIMELINE_FUTURE_PHASE_KEYS.length)
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-7/1",
    contractVersion: BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}

export const BusinessTimelineRunner = Object.freeze({
  runBusinessTimelineFoundation,
  resetBusinessTimelinePlatformForTests,
});
