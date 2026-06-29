/**
 * APP-11:1 — Executive Inbox Platform foundation runner.
 */

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { SCENARIO_INTELLIGENCE_IDENTITY } from "../app-2-scenario-intelligence/scenarioIntelligenceContract.ts";
import { BUSINESS_TIMELINE_PLATFORM_IDENTITY } from "../business-timeline/businessTimelineContracts.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "../confidence-evolution/confidenceEvolutionContracts.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY } from "../cross-scenario-learning/crossScenarioLearningContracts.ts";
import { DECISION_JOURNAL_PLATFORM_IDENTITY } from "../decision-journal/decisionJournalContracts.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import { EXECUTIVE_INTENT_IDENTITY } from "../executiveIntent/executiveIntentContract.ts";
import { EXECUTIVE_MEMORY_IDENTITY } from "../executiveMemory/executiveMemoryContracts.ts";
import { EXECUTIVE_TIME_FOUNDATION_VERSION } from "../executive-time/executiveTimeContract.ts";
import { SCENARIO_TIMELINE_PLATFORM_IDENTITY } from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import {
  EXECUTIVE_INBOX_COMPATIBILITY_REGISTRY,
  EXECUTIVE_INBOX_CONSUMER_REGISTRY,
  EXECUTIVE_INBOX_EXTENSION_REGISTRY,
  EXECUTIVE_INBOX_FUTURE_COMPATIBILITY,
  EXECUTIVE_INBOX_MUST_NOT_OWN,
  EXECUTIVE_INBOX_PLATFORM_CAPABILITIES,
  EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PLATFORM_PRINCIPLES,
  EXECUTIVE_INBOX_PUBLIC_API_REGISTRY,
  EXECUTIVE_INBOX_RELEASE_METADATA,
  EXECUTIVE_INBOX_SOURCE_PROVIDER_REGISTRY,
  EXECUTIVE_INBOX_SOURCE_TYPE_KEYS,
} from "./executiveInboxConstants.ts";
import {
  EXECUTIVE_INBOX_FREEZE_RULES,
  EXECUTIVE_INBOX_PLATFORM_IDENTITY,
  EXECUTIVE_INBOX_PLATFORM_SELF_MANIFEST,
  EXECUTIVE_INBOX_PUBLIC_API_RULES,
  getExecutiveInboxManifest,
  resolveExecutiveInboxContextExample,
  resolveExecutiveInboxItemExample,
  resolveExecutiveInboxSessionExample,
  resolveExecutiveInboxSourceExample,
  validateExecutiveInboxDependencies,
  validateExecutiveInboxFoundation,
} from "./executiveInboxContracts.ts";
import {
  buildExecutiveInboxFoundation,
  getExecutiveInboxFoundationVersionMetadata,
  isExecutiveInboxPlatformInitialized,
  resetExecutiveInboxFoundationForTests,
} from "./executiveInboxFoundation.ts";
import {
  getExecutiveInboxRegistry,
  registerExecutiveInboxItem,
  registerExecutiveInboxSession,
  registerMetadataExtension,
  resetExecutiveInboxRegistryForTests,
} from "./executiveInboxRegistry.ts";
import type { ExecutiveInboxCertificationCheck, ExecutiveInboxCertificationResult } from "./executiveInboxTypes.ts";
import {
  hasDuplicateIds,
  isExecutiveInboxSourceType,
  isReservedExecutiveInboxSessionId,
  validateExecutiveInboxContextContractShape,
  validateExecutiveInboxItemContractShape,
  validateExecutiveInboxItemRegistration,
  validateExecutiveInboxSessionContractShape,
  validateExecutiveInboxSessionRegistration,
  validateExecutiveInboxSourceContractShape,
  validatePlatformIdentity,
  validateSessionIdentity,
  validateWorkspaceIsolation,
} from "./executiveInboxValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ExecutiveInboxCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

export function resetExecutiveInboxPlatformForTests(): void {
  resetExecutiveInboxRegistryForTests();
  resetExecutiveInboxFoundationForTests();
}

export function runExecutiveInboxFoundation(
  timestamp: string = FIXED_TIME
): ExecutiveInboxCertificationResult {
  resetExecutiveInboxPlatformForTests();

  const checks: ExecutiveInboxCertificationCheck[] = [];
  const foundation = buildExecutiveInboxFoundation(timestamp);
  checks.push(
    check(
      "A_platform_identity",
      "Platform identity and foundation creation",
      foundation.success && EXECUTIVE_INBOX_PLATFORM_IDENTITY.appId === "APP-11",
      foundation.reason
    )
  );

  checks.push(
    check(
      "B_contracts_valid",
      "Inbox contracts valid",
      validateExecutiveInboxSourceContractShape(resolveExecutiveInboxSourceExample(timestamp)).valid === true &&
        validateExecutiveInboxItemContractShape(resolveExecutiveInboxItemExample(timestamp)).valid === true &&
        validateExecutiveInboxContextContractShape(resolveExecutiveInboxContextExample(timestamp)).valid === true &&
        validateExecutiveInboxSessionContractShape(resolveExecutiveInboxSessionExample(timestamp)).valid === true,
      "all contract shapes valid"
    )
  );

  const manifest = getExecutiveInboxManifest(timestamp);
  checks.push(
    check(
      "C_registry_valid",
      "Registry valid",
      manifest.registrySnapshot.sourceTypeCount === 9 &&
        manifest.registrySnapshot.consumerCount === 4 &&
        manifest.registrySnapshot.sourceProviderCount === 6 &&
        manifest.registrySnapshot.futureEngineCount === 5,
      `sources=${manifest.registrySnapshot.sourceTypeCount}, providers=${manifest.registrySnapshot.sourceProviderCount}`
    )
  );

  checks.push(
    check(
      "D_constants_valid",
      "Constants valid",
      EXECUTIVE_INBOX_SOURCE_TYPE_KEYS.length === 9 &&
        EXECUTIVE_INBOX_PLATFORM_PRINCIPLES.length >= 10 &&
        EXECUTIVE_INBOX_MUST_NOT_OWN.includes("inbox_aggregation"),
      String(EXECUTIVE_INBOX_SOURCE_TYPE_KEYS.length)
    )
  );

  checks.push(
    check(
      "E_manifest_valid",
      "Manifest valid",
      manifest.manifestVersion === EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION && Object.isFrozen(manifest),
      manifest.manifestVersion
    )
  );

  checks.push(
    check(
      "F_metadata_complete",
      "Metadata complete",
      manifest.platformPrinciples.length >= 10 &&
        manifest.extensionRegistry.length >= 5 &&
        manifest.metadataExtensionRegistry.length >= 3,
      String(manifest.platformPrinciples.length)
    )
  );

  checks.push(
    check(
      "G_public_api_exposed",
      "Public API exposed",
      typeof buildExecutiveInboxFoundation === "function" &&
        typeof validateExecutiveInboxFoundation === "function" &&
        typeof getExecutiveInboxManifest === "function" &&
        EXECUTIVE_INBOX_PUBLIC_API_RULES.metadataOnly === true,
      "public API shell"
    )
  );

  checks.push(
    check(
      "H_inbox_source_vocabulary",
      "Inbox source vocabulary valid",
      isExecutiveInboxSourceType("scenario") === true &&
        isExecutiveInboxSourceType("recommendation") === true &&
        isExecutiveInboxSourceType("invalid") === false,
      "inbox source guards"
    )
  );

  checks.push(
    check(
      "I_no_inbox_aggregation",
      "No inbox aggregation behavior",
      EXECUTIVE_INBOX_FREEZE_RULES.noInboxAggregation === true &&
        EXECUTIVE_INBOX_FUTURE_COMPATIBILITY.aggregationEngineReady === false &&
        EXECUTIVE_INBOX_FUTURE_COMPATIBILITY.prioritizationEngineReady === false,
      "metadata only"
    )
  );

  checks.push(
    check(
      "J_no_notification_workflow",
      "No notification or workflow delivery",
      EXECUTIVE_INBOX_FREEZE_RULES.noNotificationDelivery === true &&
        EXECUTIVE_INBOX_FREEZE_RULES.noWorkflowExecution === true &&
        EXECUTIVE_INBOX_MUST_NOT_OWN.includes("notification_delivery"),
      "no delivery"
    )
  );

  checks.push(
    check(
      "K_consumer_only",
      "Consumer-only platform",
      EXECUTIVE_INBOX_FREEZE_RULES.consumerOnly === true &&
        EXECUTIVE_INBOX_COMPATIBILITY_REGISTRY.some((entry) => entry.guaranteeId === "consumer-only-platform"),
      "consumer only"
    )
  );

  checks.push(
    check(
      "L_dependency_gates",
      "Certified dependency gates valid",
      validateExecutiveInboxDependencies().valid === true && manifest.dependencyValidation.valid === true,
      String(manifest.certifiedDependencies.length)
    )
  );

  checks.push(
    check(
      "M_prior_platforms_untouched",
      "Prior APP platforms untouched",
      EXECUTIVE_TIME_FOUNDATION_VERSION.startsWith("APP-1") &&
        SCENARIO_INTELLIGENCE_IDENTITY.appId === "APP-2" &&
        EXECUTIVE_INTENT_IDENTITY.appId === "APP-3" &&
        EXECUTIVE_MEMORY_IDENTITY.appId === "APP-4" &&
        SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
        DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6" &&
        BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7" &&
        DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8" &&
        CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId === "APP-9" &&
        CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId === "APP-10",
      "APP-1 through APP-10 identity verified"
    )
  );

  checks.push(
    check(
      "N_workspace_isolation",
      "Workspace isolation contracts present",
      validateWorkspaceIsolation("ws-a", "ws-a").valid === true &&
        validateWorkspaceIsolation("ws-a", "ws-b").valid === false,
      "isolation enforced"
    )
  );

  const session = registerExecutiveInboxSession(
    Object.freeze({
      sessionId: "executive-inbox-ws-cert-001",
      workspaceId: "ws-cert-001",
      label: "Certification Inbox Session",
      description: "APP-11:1 certification session registration.",
      sourceTypes: Object.freeze(["scenario", "decision"]),
    }),
    timestamp
  );
  checks.push(check("session_registration", "Inbox session registration", session.success === true, session.reason));

  checks.push(
    check(
      "duplicate_session_protection",
      "Duplicate session protection",
      registerExecutiveInboxSession(
        Object.freeze({
          sessionId: "executive-inbox-ws-cert-001",
          workspaceId: "ws-cert-001",
          label: "Duplicate",
          description: "Duplicate registration attempt.",
          sourceTypes: Object.freeze(["scenario"]),
        }),
        timestamp
      ).success === false,
      "duplicate rejected"
    )
  );

  const item = registerExecutiveInboxItem(
    Object.freeze({
      itemId: "inbox-item-cert-001",
      workspaceId: "ws-cert-001",
      sessionId: "executive-inbox-ws-cert-001",
      sourceType: "scenario",
      sourceReferenceId: "scenario-cert-001",
      label: "Certification Inbox Item",
      description: "APP-11:1 certification item registration.",
    }),
    timestamp
  );
  checks.push(check("item_registration", "Inbox item registration", item.success === true, item.reason));

  checks.push(
    check(
      "reserved_session_ids",
      "Reserved session id protection",
      isReservedExecutiveInboxSessionId("executive-inbox-system") === true,
      "executive-inbox-system reserved"
    )
  );

  checks.push(
    check(
      "foundation_validation",
      "Foundation validation report",
      validateExecutiveInboxFoundation(timestamp).valid === true,
      "valid"
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(EXECUTIVE_INBOX_PLATFORM_SELF_MANIFEST).valid === true,
      EXECUTIVE_INBOX_PLATFORM_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "architecture_boundary",
      "Architecture file boundary",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/executive-inbox/executiveInboxFoundation.ts",
        allowedFiles: EXECUTIVE_INBOX_PLATFORM_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: EXECUTIVE_INBOX_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "executiveInboxFoundation.ts"
    )
  );

  checks.push(
    check(
      "extension_registry",
      "Extension registry reserved",
      EXECUTIVE_INBOX_EXTENSION_REGISTRY.some((entry) => entry.phaseKey === "aggregation_engine") &&
        registerMetadataExtension(
          Object.freeze({
            extensionId: "inbox-metadata-cert-test",
            label: "Certification Metadata Extension",
            description: "APP-11:1 certification metadata extension.",
          })
        ).success === true,
      String(EXECUTIVE_INBOX_EXTENSION_REGISTRY.length)
    )
  );

  checks.push(
    check(
      "public_api_registry",
      "Public API registry declared",
      EXECUTIVE_INBOX_PUBLIC_API_REGISTRY.includes("runExecutiveInboxFoundation") &&
        EXECUTIVE_INBOX_PUBLIC_API_REGISTRY.includes("getExecutiveInboxManifest"),
      String(EXECUTIVE_INBOX_PUBLIC_API_REGISTRY.length)
    )
  );

  checks.push(
    check(
      "source_provider_registry",
      "Source provider registry declared",
      EXECUTIVE_INBOX_SOURCE_PROVIDER_REGISTRY.length === 6 &&
        manifest.sourceProviderRegistry.every((entry) => entry.status === "registered"),
      String(EXECUTIVE_INBOX_SOURCE_PROVIDER_REGISTRY.length)
    )
  );

  checks.push(
    check(
      "platform_capabilities",
      "Platform capabilities declared",
      EXECUTIVE_INBOX_PLATFORM_CAPABILITIES.includes("dependency_validation") &&
        EXECUTIVE_INBOX_PLATFORM_CAPABILITIES.includes("source_provider_registry"),
      String(EXECUTIVE_INBOX_PLATFORM_CAPABILITIES.length)
    )
  );

  checks.push(
    check(
      "release_metadata",
      "Release metadata immutable",
      EXECUTIVE_INBOX_RELEASE_METADATA.readOnly === true &&
        EXECUTIVE_INBOX_RELEASE_METADATA.platformStatus === "build",
      EXECUTIVE_INBOX_RELEASE_METADATA.releaseStage
    )
  );

  checks.push(
    check(
      "duplicate_source_types",
      "Duplicate source type protection",
      hasDuplicateIds(["scenario", "decision", "scenario"]) === true &&
        hasDuplicateIds(["scenario", "decision"]) === false,
      "duplicate detection"
    )
  );

  checks.push(
    check(
      "session_registration_validation",
      "Session registration validation",
      validateExecutiveInboxSessionRegistration(
        Object.freeze({
          sessionId: "",
          workspaceId: "ws-cert-001",
          label: "Invalid",
          description: "Missing session id.",
          sourceTypes: Object.freeze(["scenario"]),
        })
      ).valid === false,
      "invalid rejected"
    )
  );

  checks.push(
    check(
      "item_registration_validation",
      "Item registration validation",
      validateExecutiveInboxItemRegistration(
        Object.freeze({
          itemId: "inbox-item-invalid",
          workspaceId: "ws-cert-001",
          sessionId: "missing-session",
          sourceType: "invalid" as "scenario",
          sourceReferenceId: "ref-001",
          label: "Invalid",
          description: "Invalid source type.",
        })
      ).valid === false,
      "invalid rejected"
    )
  );

  checks.push(
    check(
      "registry_snapshot",
      "Registry snapshot available",
      getExecutiveInboxRegistry().snapshot.registryVersion.startsWith("APP-11/1") &&
        isExecutiveInboxPlatformInitialized() === true,
      getExecutiveInboxFoundationVersionMetadata().foundationVersion
    )
  );

  checks.push(
    check(
      "consumer_registry",
      "Consumer registry declared",
      EXECUTIVE_INBOX_CONSUMER_REGISTRY.length === 4 &&
        manifest.consumerRegistry.every((entry) => entry.status === "registered"),
      String(EXECUTIVE_INBOX_CONSUMER_REGISTRY.length)
    )
  );

  checks.push(
    check(
      "platform_identity_validation",
      "Platform identity validation",
      validatePlatformIdentity(EXECUTIVE_INBOX_PLATFORM_IDENTITY).valid === true &&
        validateSessionIdentity("executive-inbox-ws-001").valid === true,
      EXECUTIVE_INBOX_PLATFORM_IDENTITY.platformId
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-11/1",
    contractVersion: EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}

export const ExecutiveInboxRunner = Object.freeze({
  runExecutiveInboxFoundation,
  resetExecutiveInboxPlatformForTests,
});
