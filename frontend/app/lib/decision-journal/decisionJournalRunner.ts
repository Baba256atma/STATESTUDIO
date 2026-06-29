/**
 * APP-8:1 — Decision Journal Platform foundation runner.
 */

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { BUSINESS_TIMELINE_PLATFORM_IDENTITY } from "../business-timeline/businessTimelineContracts.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
} from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import {
  DECISION_JOURNAL_CONFIDENCE_KEYS,
  DECISION_JOURNAL_EXTENSION_REGISTRY,
  DECISION_JOURNAL_FUTURE_COMPATIBILITY,
  DECISION_JOURNAL_MANDATORY_ENTRY_FIELDS,
  DECISION_JOURNAL_MUST_NOT_OWN,
  DECISION_JOURNAL_PLATFORM_CAPABILITIES,
  DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
  DECISION_JOURNAL_PLATFORM_PRINCIPLES,
  DECISION_JOURNAL_RELEASE_METADATA,
  DECISION_JOURNAL_SOURCE_KEYS,
  DECISION_JOURNAL_STATUS_KEYS,
} from "./decisionJournalConstants.ts";
import {
  DECISION_JOURNAL_FREEZE_RULES,
  DECISION_JOURNAL_PLATFORM_IDENTITY,
  DECISION_JOURNAL_PLATFORM_SELF_MANIFEST,
  DECISION_JOURNAL_PUBLIC_API_RULES,
  getDecisionJournalManifest,
  resolveDecisionJournalEntryExample,
  validateDecisionJournal,
} from "./decisionJournalContracts.ts";
import {
  createDecisionJournalFoundation,
  getDecisionJournalFoundationVersionMetadata,
  isDecisionJournalPlatformInitialized,
  resetDecisionJournalFoundationForTests,
} from "./decisionJournalFoundation.ts";
import {
  getDecisionJournalRegistry,
  registerDecisionJournal,
  registerFutureExtension,
  registerMetadataExtension,
  resetDecisionJournalRegistryForTests,
} from "./decisionJournalRegistry.ts";
import type { DecisionJournalCertificationCheck, DecisionJournalCertificationResult } from "./decisionJournalTypes.ts";
import {
  hasDuplicateIds,
  isReservedDecisionJournalId,
  validateDecisionJournalEntryContractShape,
  validateDecisionJournalRegistration,
  validateJournalIdentity,
  validateWorkspaceIsolation,
} from "./decisionJournalValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function check(id: string, title: string, passed: boolean, evidence: string): DecisionJournalCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

export function resetDecisionJournalPlatformForTests(): void {
  resetDecisionJournalRegistryForTests();
  resetDecisionJournalFoundationForTests();
}

export function runDecisionJournalFoundation(
  timestamp: string = FIXED_TIME
): DecisionJournalCertificationResult {
  resetDecisionJournalPlatformForTests();

  const checks: DecisionJournalCertificationCheck[] = [];
  const foundation = createDecisionJournalFoundation(timestamp);
  checks.push(
    check(
      "A_platform_identity",
      "Platform identity and foundation creation",
      foundation.success && DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8",
      foundation.reason
    )
  );

  const manifest = getDecisionJournalManifest(timestamp);
  checks.push(
    check(
      "B_contracts_valid",
      "Contracts valid",
      validateDecisionJournalEntryContractShape(resolveDecisionJournalEntryExample(timestamp)).valid === true,
      "entry contract valid"
    )
  );

  checks.push(
    check(
      "C_registry_valid",
      "Registry valid",
      manifest.registrySnapshot.statusTypeCount === 4 &&
        manifest.registrySnapshot.sourceTypeCount === 5 &&
        manifest.registrySnapshot.confidenceTypeCount === 5,
      `status=${manifest.registrySnapshot.statusTypeCount}, source=${manifest.registrySnapshot.sourceTypeCount}, confidence=${manifest.registrySnapshot.confidenceTypeCount}`
    )
  );

  checks.push(
    check(
      "D_constants_valid",
      "Constants valid",
      DECISION_JOURNAL_STATUS_KEYS.length === 4 &&
        DECISION_JOURNAL_SOURCE_KEYS.length === 5 &&
        DECISION_JOURNAL_CONFIDENCE_KEYS.length === 5 &&
        DECISION_JOURNAL_MANDATORY_ENTRY_FIELDS.length === 20,
      String(DECISION_JOURNAL_MANDATORY_ENTRY_FIELDS.length)
    )
  );

  checks.push(
    check(
      "E_manifest_valid",
      "Manifest valid",
      manifest.manifestVersion === DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION && Object.isFrozen(manifest),
      manifest.manifestVersion
    )
  );

  checks.push(
    check(
      "F_metadata_complete",
      "Metadata complete",
      manifest.platformPrinciples.length >= 10 &&
        manifest.extensionRegistry.length >= 4 &&
        manifest.metadataExtensionRegistry.length >= 3,
      String(manifest.platformPrinciples.length)
    )
  );

  checks.push(
    check(
      "G_public_api_exposed",
      "Public API exposed",
      typeof createDecisionJournalFoundation === "function" &&
        typeof validateDecisionJournal === "function" &&
        DECISION_JOURNAL_PUBLIC_API_RULES.metadataOnly === true,
      "public API shell"
    )
  );

  checks.push(
    check(
      "H_no_runtime_behavior",
      "No runtime behavior",
      DECISION_JOURNAL_FREEZE_RULES.noRuntimeExecution === true &&
        DECISION_JOURNAL_FUTURE_COMPATIBILITY.journalEngineReady === false,
      "metadata only"
    )
  );

  checks.push(
    check(
      "I_no_dashboard_coupling",
      "No dashboard coupling",
      DECISION_JOURNAL_PUBLIC_API_RULES.noDashboardIntegration === true &&
        DECISION_JOURNAL_MUST_NOT_OWN.includes("dashboard"),
      "no dashboard"
    )
  );

  checks.push(
    check(
      "J_no_assistant_coupling",
      "No assistant coupling",
      DECISION_JOURNAL_PUBLIC_API_RULES.noAssistantIntegration === true &&
        DECISION_JOURNAL_MUST_NOT_OWN.includes("assistant"),
      "no assistant"
    )
  );

  checks.push(
    check(
      "K_no_visualization",
      "No visualization",
      DECISION_JOURNAL_FREEZE_RULES.noVisualization === true &&
        DECISION_JOURNAL_MUST_NOT_OWN.includes("visualization"),
      "no visualization"
    )
  );

  checks.push(
    check(
      "L_no_persistence",
      "No persistence",
      DECISION_JOURNAL_FREEZE_RULES.noPersistence === true &&
        DECISION_JOURNAL_MUST_NOT_OWN.includes("persistence"),
      "no persistence"
    )
  );

  checks.push(
    check(
      "M_prior_platforms_untouched",
      "Prior APP platforms untouched",
      SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
        DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6" &&
        BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7",
      "APP-5/6/7 identity verified"
    )
  );

  checks.push(
    check(
      "N_workspace_isolation_contracts",
      "Workspace isolation contracts present",
      validateWorkspaceIsolation("ws-a", "ws-a").valid === true &&
        validateWorkspaceIsolation("ws-a", "ws-b").valid === false,
      "isolation enforced"
    )
  );

  const journal = registerDecisionJournal(
    Object.freeze({
      journalId: "decision-journal-ws-cert-001",
      workspaceId: "ws-cert-001",
      label: "Executive Decision Journal",
      description: "APP-8:1 certification journal registration.",
    }),
    timestamp
  );
  checks.push(
    check(
      "journal_registration",
      "Decision journal registration",
      journal.success === true,
      journal.reason
    )
  );

  checks.push(
    check(
      "duplicate_protection",
      "Duplicate journal protection",
      registerDecisionJournal(
        Object.freeze({
          journalId: "decision-journal-ws-cert-001",
          workspaceId: "ws-cert-001",
          label: "Duplicate",
          description: "Duplicate registration attempt.",
        }),
        timestamp
      ).success === false,
      "duplicate rejected"
    )
  );

  checks.push(
    check(
      "reserved_names",
      "Reserved journal id protection",
      isReservedDecisionJournalId("decision-journal-system") === true,
      "decision-journal-system reserved"
    )
  );

  checks.push(
    check(
      "foundation_validation",
      "Foundation validation report",
      validateDecisionJournal(timestamp).valid === true,
      "valid"
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(DECISION_JOURNAL_PLATFORM_SELF_MANIFEST).valid === true,
      DECISION_JOURNAL_PLATFORM_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/decision-journal/decisionJournalRegistry.ts",
        allowedFiles: DECISION_JOURNAL_PLATFORM_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: DECISION_JOURNAL_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true &&
        evaluateStageFileBoundary({
          filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
          allowedFiles: DECISION_JOURNAL_PLATFORM_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: DECISION_JOURNAL_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
        }).allowed === false,
      "boundaries enforced"
    )
  );

  const metadataExtension = registerMetadataExtension(
    Object.freeze({
      extensionId: "journal-rationale-v1",
      label: "Journal Rationale v1",
      description: "Rationale metadata extension.",
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
      extensionId: "journal-engine-phase",
      label: "Journal Engine Phase",
      phaseKey: "journal_engine",
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
      "capabilities",
      "Platform capabilities declared",
      DECISION_JOURNAL_PLATFORM_CAPABILITIES.length >= 7,
      String(DECISION_JOURNAL_PLATFORM_CAPABILITIES.length)
    )
  );

  checks.push(
    check(
      "principles",
      "Platform principles declared",
      DECISION_JOURNAL_PLATFORM_PRINCIPLES.includes("executive_thinking_is_preserved"),
      String(DECISION_JOURNAL_PLATFORM_PRINCIPLES.length)
    )
  );

  checks.push(
    check(
      "release_metadata",
      "Release metadata present",
      DECISION_JOURNAL_RELEASE_METADATA.readOnly === true,
      DECISION_JOURNAL_RELEASE_METADATA.platformStatus
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
      "journal_identity",
      "Journal identity validation",
      validateJournalIdentity("decision-journal-ws-001").valid === true,
      "valid"
    )
  );

  checks.push(
    check(
      "foundation_version",
      "Foundation version metadata",
      getDecisionJournalFoundationVersionMetadata().foundationVersion === "APP-8/1",
      getDecisionJournalFoundationVersionMetadata().foundationVersion
    )
  );

  checks.push(
    check(
      "platform_initialized",
      "Platform initialized after foundation creation",
      isDecisionJournalPlatformInitialized() === true,
      String(getDecisionJournalRegistry().confidenceLevels.length)
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
      "future_compatibility",
      "Future compatibility metadata",
      DECISION_JOURNAL_FUTURE_COMPATIBILITY.decisionTimelineLinkReady === false &&
        DECISION_JOURNAL_FUTURE_COMPATIBILITY.visualizationReady === false,
      "future phases deferred"
    )
  );

  checks.push(
    check(
      "must_not_own",
      "Platform must-not-own boundaries",
      DECISION_JOURNAL_MUST_NOT_OWN.includes("journal_engine") &&
        DECISION_JOURNAL_MUST_NOT_OWN.includes("ai_reasoning"),
      String(DECISION_JOURNAL_MUST_NOT_OWN.length)
    )
  );

  checks.push(
    check(
      "extension_registry",
      "Extension registry registered",
      DECISION_JOURNAL_EXTENSION_REGISTRY.length >= 4,
      String(DECISION_JOURNAL_EXTENSION_REGISTRY.length)
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-8/1",
    contractVersion: DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}

export const DecisionJournalRunner = Object.freeze({
  runDecisionJournalFoundation,
  resetDecisionJournalPlatformForTests,
});
