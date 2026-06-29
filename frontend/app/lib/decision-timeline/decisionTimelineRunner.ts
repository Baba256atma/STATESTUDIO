/**
 * APP-6:1 — Decision Timeline Platform foundation runner.
 * Certification and validation orchestration — metadata only.
 */

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  DECISION_TIMELINE_EXTENSION_REGISTRY,
  DECISION_TIMELINE_FUTURE_COMPATIBILITY,
  DECISION_TIMELINE_FUTURE_PHASE_KEYS,
  DECISION_TIMELINE_MANDATORY_DECISION_FIELDS,
  DECISION_TIMELINE_MUST_NOT_OWN,
  DECISION_TIMELINE_PLATFORM_CAPABILITIES,
  DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
  DECISION_TIMELINE_PLATFORM_PRINCIPLES,
  DECISION_TIMELINE_RELEASE_METADATA,
} from "./decisionTimelineConstants.ts";
import {
  DECISION_TIMELINE_FREEZE_RULES,
  DECISION_TIMELINE_PLATFORM_IDENTITY,
  DECISION_TIMELINE_PLATFORM_SELF_MANIFEST,
  DECISION_TIMELINE_PUBLIC_API_RULES,
  getDecisionTimelineManifest,
  resolveDecisionTypeRegistrationExample,
  validateDecisionTimelineFoundation,
} from "./decisionTimelineContracts.ts";
import {
  createDecisionTimelineFoundation,
  getDecisionTimelineFoundationVersionMetadata,
  isDecisionTimelinePlatformInitialized,
  resetDecisionTimelineFoundationForTests,
} from "./decisionTimelineFoundation.ts";
import {
  getDecisionTimelineRegistry,
  registerDecisionType,
  registerFutureExtension,
  registerMetadataExtension,
  resetDecisionTimelineRegistryForTests,
} from "./decisionTimelineRegistry.ts";
import type { DecisionCertificationCheck, DecisionCertificationResult } from "./decisionTimelineTypes.ts";
import {
  hasDuplicateIds,
  isReservedDecisionTypeId,
  validateDecisionTypeRegistration,
} from "./decisionTimelineValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function check(id: string, title: string, passed: boolean, evidence: string): DecisionCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

export function resetDecisionTimelinePlatformForTests(): void {
  resetDecisionTimelineRegistryForTests();
  resetDecisionTimelineFoundationForTests();
}

export function runDecisionTimelineFoundation(
  timestamp: string = FIXED_TIME
): DecisionCertificationResult {
  resetDecisionTimelinePlatformForTests();

  const checks: DecisionCertificationCheck[] = [];

  const foundation = createDecisionTimelineFoundation(timestamp);
  checks.push(
    check(
      "platform_identity",
      "Platform identity and foundation creation",
      foundation.success && DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6",
      foundation.reason
    )
  );

  const manifest = getDecisionTimelineManifest(timestamp);
  checks.push(
    check(
      "manifest",
      "Manifest integrity",
      manifest.manifestVersion === DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION &&
        Object.isFrozen(manifest),
      `manifestVersion=${manifest.manifestVersion}`
    )
  );

  checks.push(
    check(
      "registry",
      "Registry integrity with default categories and statuses",
      manifest.registrySnapshot.categoryCount === 7 && manifest.registrySnapshot.statusTypeCount === 6,
      `categories=${manifest.registrySnapshot.categoryCount}, statuses=${manifest.registrySnapshot.statusTypeCount}`
    )
  );

  const typeRegistration = resolveDecisionTypeRegistrationExample();
  const registered = registerDecisionType(typeRegistration, timestamp);
  checks.push(
    check(
      "decision_type_registration",
      "Decision type registration",
      registered.success === true,
      registered.reason
    )
  );

  const duplicate = registerDecisionType(typeRegistration, timestamp);
  checks.push(
    check(
      "duplicate_protection",
      "Duplicate decision type protection",
      duplicate.success === false,
      duplicate.reason
    )
  );

  checks.push(
    check(
      "reserved_names",
      "Reserved decision type id protection",
      isReservedDecisionTypeId("decision-system") === true,
      "decision-system is reserved"
    )
  );

  const metadataExtension = registerMetadataExtension(
    Object.freeze({
      extensionId: "decision-context-v1",
      label: "Decision Context v1",
      description: "Context metadata extension probe.",
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
      extensionId: "decision-replay-probe",
      label: "Replay Probe",
      phaseKey: "decision_replay",
    })
  );
  checks.push(
    check(
      "future_extension",
      "Future replay extension registration",
      futureExtension.success === true,
      futureExtension.reason
    )
  );

  const validationReport = validateDecisionTimelineFoundation(timestamp);
  checks.push(
    check(
      "foundation_validation",
      "Foundation validation report",
      validationReport.valid === true,
      validationReport.issues.map((entry) => entry.message).join("; ") || "valid"
    )
  );

  checks.push(
    check(
      "workspace_isolation",
      "Workspace isolation contracts",
      validationReport.workspaceIsolationValid === true,
      "workspace isolation valid"
    )
  );

  checks.push(
    check(
      "timeline_identity",
      "Timeline identity contracts",
      validationReport.timelineIdentityValid === true,
      "timeline identity valid"
    )
  );

  checks.push(
    check(
      "version_compatibility",
      "Version compatibility",
      getDecisionTimelineFoundationVersionMetadata().contractVersion === DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
      DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(DECISION_TIMELINE_PLATFORM_SELF_MANIFEST).valid === true,
      "stage manifest valid"
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/decision-timeline/decisionTimelineRegistry.ts",
        allowedFiles: DECISION_TIMELINE_PLATFORM_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: DECISION_TIMELINE_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true &&
        evaluateStageFileBoundary({
          filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
          allowedFiles: DECISION_TIMELINE_PLATFORM_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: DECISION_TIMELINE_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
        }).allowed === false,
      "allowlist and forbidden patterns enforced"
    )
  );

  checks.push(
    check(
      "extension_registry",
      "Reserved extension registry",
      DECISION_TIMELINE_EXTENSION_REGISTRY.length >= 5,
      `${DECISION_TIMELINE_EXTENSION_REGISTRY.length} extensions registered`
    )
  );

  checks.push(
    check(
      "platform_principles",
      "Platform principles defined",
      DECISION_TIMELINE_PLATFORM_PRINCIPLES.length >= 10,
      `${DECISION_TIMELINE_PLATFORM_PRINCIPLES.length} principles`
    )
  );

  checks.push(
    check(
      "duplicate_id_detection",
      "Duplicate ID detection utility",
      hasDuplicateIds(["a", "b", "a"]) === true && hasDuplicateIds(["a", "b"]) === false,
      "duplicate detection works"
    )
  );

  checks.push(
    check(
      "contract_shape",
      "Decision type registration shape",
      validateDecisionTypeRegistration(typeRegistration).valid === true,
      "registration shape valid"
    )
  );

  checks.push(
    check(
      "architecture_integrity",
      "Architecture integrity rules",
      DECISION_TIMELINE_FREEZE_RULES.metadataOnly === true &&
        DECISION_TIMELINE_PUBLIC_API_RULES.noPersistence === true &&
        DECISION_TIMELINE_FUTURE_COMPATIBILITY.metadataOnly === true,
      "metadata-only foundation confirmed"
    )
  );

  checks.push(
    check(
      "regression_protection",
      "Regression protection metadata",
      DECISION_TIMELINE_MUST_NOT_OWN.includes("decision_storage") &&
        DECISION_TIMELINE_MANDATORY_DECISION_FIELDS.length >= 8 &&
        DECISION_TIMELINE_FUTURE_PHASE_KEYS.length >= 10 &&
        DECISION_TIMELINE_PLATFORM_CAPABILITIES.length >= 7 &&
        DECISION_TIMELINE_RELEASE_METADATA.freezeState === "open",
      "forbidden ownership and phase keys present"
    )
  );

  checks.push(
    check(
      "registry_api",
      "Registry public API",
      getDecisionTimelineRegistry().categories.length === 7 &&
        isDecisionTimelinePlatformInitialized() === true,
      "registry accessible after foundation"
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-6/1",
    contractVersion: DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}

export const DecisionTimelineRunner = Object.freeze({
  runDecisionTimelineFoundation,
  resetDecisionTimelinePlatformForTests,
});
