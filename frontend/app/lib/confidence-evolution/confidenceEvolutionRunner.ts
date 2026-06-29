/**
 * APP-9:1 — Confidence Evolution Platform foundation runner.
 */

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { BUSINESS_TIMELINE_PLATFORM_IDENTITY } from "../business-timeline/businessTimelineContracts.ts";
import { DECISION_JOURNAL_PLATFORM_IDENTITY } from "../decision-journal/decisionJournalContracts.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
} from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import {
  CONFIDENCE_EVOLUTION_CHANGE_REASON_KEYS,
  CONFIDENCE_EVOLUTION_CONFIDENCE_LEVEL_KEYS,
  CONFIDENCE_EVOLUTION_EXTENSION_REGISTRY,
  CONFIDENCE_EVOLUTION_FUTURE_COMPATIBILITY,
  CONFIDENCE_EVOLUTION_MANDATORY_RECORD_FIELDS,
  CONFIDENCE_EVOLUTION_MUST_NOT_OWN,
  CONFIDENCE_EVOLUTION_PLATFORM_CAPABILITIES,
  CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_PRINCIPLES,
  CONFIDENCE_EVOLUTION_RELEASE_METADATA,
  CONFIDENCE_EVOLUTION_SOURCE_KEYS,
} from "./confidenceEvolutionConstants.ts";
import {
  CONFIDENCE_EVOLUTION_FREEZE_RULES,
  CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY,
  CONFIDENCE_EVOLUTION_PLATFORM_SELF_MANIFEST,
  CONFIDENCE_EVOLUTION_PUBLIC_API_RULES,
  getConfidenceEvolutionManifest,
  resolveConfidenceRecordExample,
  validateConfidenceEvolution,
} from "./confidenceEvolutionContracts.ts";
import {
  createConfidenceEvolutionFoundation,
  getConfidenceEvolutionFoundationVersionMetadata,
  isConfidenceEvolutionPlatformInitialized,
  resetConfidenceEvolutionFoundationForTests,
} from "./confidenceEvolutionFoundation.ts";
import {
  getConfidenceEvolutionRegistry,
  registerConfidenceEvolution,
  registerFutureExtension,
  registerMetadataExtension,
  resetConfidenceEvolutionRegistryForTests,
} from "./confidenceEvolutionRegistry.ts";
import type {
  ConfidenceEvolutionCertificationCheck,
  ConfidenceEvolutionCertificationResult,
} from "./confidenceEvolutionTypes.ts";
import {
  hasDuplicateIds,
  isConfidenceChangeReason,
  isConfidenceLevel,
  isConfidenceSource,
  isReservedConfidenceEvolutionId,
  validateConfidenceEvolutionRegistration,
  validateConfidenceRecordContractShape,
  validateEvolutionIdentity,
  validateWorkspaceIsolation,
} from "./confidenceEvolutionValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ConfidenceEvolutionCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

export function resetConfidenceEvolutionPlatformForTests(): void {
  resetConfidenceEvolutionRegistryForTests();
  resetConfidenceEvolutionFoundationForTests();
}

export function runConfidenceEvolutionFoundation(
  timestamp: string = FIXED_TIME
): ConfidenceEvolutionCertificationResult {
  resetConfidenceEvolutionPlatformForTests();

  const checks: ConfidenceEvolutionCertificationCheck[] = [];
  const foundation = createConfidenceEvolutionFoundation(timestamp);
  checks.push(
    check(
      "A_platform_identity",
      "Platform identity and foundation creation",
      foundation.success && CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId === "APP-9",
      foundation.reason
    )
  );

  checks.push(
    check(
      "B_contracts_valid",
      "Contracts valid",
      validateConfidenceRecordContractShape(resolveConfidenceRecordExample(timestamp)).valid === true,
      "record contract valid"
    )
  );

  const manifest = getConfidenceEvolutionManifest(timestamp);
  checks.push(
    check(
      "C_registry_valid",
      "Registry valid",
      manifest.registrySnapshot.confidenceLevelCount === 5 &&
        manifest.registrySnapshot.sourceCount === 8 &&
        manifest.registrySnapshot.changeReasonCount === 8,
      `levels=${manifest.registrySnapshot.confidenceLevelCount}, sources=${manifest.registrySnapshot.sourceCount}, reasons=${manifest.registrySnapshot.changeReasonCount}`
    )
  );

  checks.push(
    check(
      "D_constants_valid",
      "Constants valid",
      CONFIDENCE_EVOLUTION_CONFIDENCE_LEVEL_KEYS.length === 5 &&
        CONFIDENCE_EVOLUTION_SOURCE_KEYS.length === 8 &&
        CONFIDENCE_EVOLUTION_CHANGE_REASON_KEYS.length === 8 &&
        CONFIDENCE_EVOLUTION_MANDATORY_RECORD_FIELDS.length === 13,
      String(CONFIDENCE_EVOLUTION_MANDATORY_RECORD_FIELDS.length)
    )
  );

  checks.push(
    check(
      "E_manifest_valid",
      "Manifest valid",
      manifest.manifestVersion === CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION && Object.isFrozen(manifest),
      manifest.manifestVersion
    )
  );

  checks.push(
    check(
      "F_metadata_complete",
      "Metadata complete",
      manifest.platformPrinciples.length >= 10 &&
        manifest.extensionRegistry.length >= 3 &&
        manifest.metadataExtensionRegistry.length >= 3,
      String(manifest.platformPrinciples.length)
    )
  );

  checks.push(
    check(
      "G_public_api_exposed",
      "Public API exposed",
      typeof createConfidenceEvolutionFoundation === "function" &&
        typeof validateConfidenceEvolution === "function" &&
        CONFIDENCE_EVOLUTION_PUBLIC_API_RULES.metadataOnly === true,
      "public API shell"
    )
  );

  checks.push(
    check(
      "H_vocabulary_valid",
      "Vocabulary valid",
      isConfidenceLevel("medium") === true &&
        isConfidenceSource("scenario") === true &&
        isConfidenceChangeReason("new_evidence") === true &&
        isConfidenceLevel("invalid") === false,
      "confidence vocabulary guards"
    )
  );

  checks.push(
    check(
      "I_no_runtime_behavior",
      "No runtime behavior",
      CONFIDENCE_EVOLUTION_FREEZE_RULES.noRuntimeExecution === true &&
        CONFIDENCE_EVOLUTION_FUTURE_COMPATIBILITY.evolutionEngineReady === false &&
        CONFIDENCE_EVOLUTION_FUTURE_COMPATIBILITY.trendEngineReady === false,
      "metadata only"
    )
  );

  checks.push(
    check(
      "J_no_dashboard_coupling",
      "No dashboard coupling",
      CONFIDENCE_EVOLUTION_PUBLIC_API_RULES.noDashboardIntegration === true &&
        CONFIDENCE_EVOLUTION_MUST_NOT_OWN.includes("dashboard"),
      "no dashboard"
    )
  );

  checks.push(
    check(
      "K_no_assistant_coupling",
      "No assistant coupling",
      CONFIDENCE_EVOLUTION_PUBLIC_API_RULES.noAssistantIntegration === true &&
        CONFIDENCE_EVOLUTION_MUST_NOT_OWN.includes("assistant"),
      "no assistant"
    )
  );

  checks.push(
    check(
      "L_no_visualization",
      "No visualization",
      CONFIDENCE_EVOLUTION_FREEZE_RULES.noVisualization === true &&
        CONFIDENCE_EVOLUTION_MUST_NOT_OWN.includes("visualization"),
      "no visualization"
    )
  );

  checks.push(
    check(
      "M_no_persistence",
      "No persistence",
      CONFIDENCE_EVOLUTION_FREEZE_RULES.noPersistence === true &&
        CONFIDENCE_EVOLUTION_MUST_NOT_OWN.includes("persistence"),
      "no persistence"
    )
  );

  checks.push(
    check(
      "N_prior_platforms_untouched",
      "Prior APP platforms untouched",
      SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
        DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6" &&
        BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7" &&
        DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8",
      "APP-5/6/7/8 identity verified"
    )
  );

  checks.push(
    check(
      "O_workspace_isolation_contracts",
      "Workspace isolation contracts present",
      validateWorkspaceIsolation("ws-a", "ws-a").valid === true &&
        validateWorkspaceIsolation("ws-a", "ws-b").valid === false,
      "isolation enforced"
    )
  );

  const evolution = registerConfidenceEvolution(
    Object.freeze({
      evolutionId: "confidence-evolution-ws-cert-001",
      workspaceId: "ws-cert-001",
      label: "Executive Confidence Evolution",
      description: "APP-9:1 certification evolution registration.",
    }),
    timestamp
  );
  checks.push(
    check(
      "evolution_registration",
      "Confidence evolution registration",
      evolution.success === true,
      evolution.reason
    )
  );

  checks.push(
    check(
      "duplicate_protection",
      "Duplicate evolution protection",
      registerConfidenceEvolution(
        Object.freeze({
          evolutionId: "confidence-evolution-ws-cert-001",
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
      "Reserved evolution id protection",
      isReservedConfidenceEvolutionId("confidence-evolution-system") === true,
      "confidence-evolution-system reserved"
    )
  );

  checks.push(
    check(
      "foundation_validation",
      "Foundation validation report",
      validateConfidenceEvolution(timestamp).valid === true,
      "valid"
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(CONFIDENCE_EVOLUTION_PLATFORM_SELF_MANIFEST).valid === true,
      CONFIDENCE_EVOLUTION_PLATFORM_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/confidence-evolution/confidenceEvolutionRegistry.ts",
        allowedFiles: CONFIDENCE_EVOLUTION_PLATFORM_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: CONFIDENCE_EVOLUTION_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true &&
        evaluateStageFileBoundary({
          filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
          allowedFiles: CONFIDENCE_EVOLUTION_PLATFORM_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: CONFIDENCE_EVOLUTION_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
        }).allowed === false,
      "boundaries enforced"
    )
  );

  const metadataExtension = registerMetadataExtension(
    Object.freeze({
      extensionId: "confidence-volatility-v1",
      label: "Confidence Volatility v1",
      description: "Volatility metadata extension.",
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
      extensionId: "evolution-engine-phase",
      label: "Evolution Engine Phase",
      phaseKey: "evolution_engine",
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
      CONFIDENCE_EVOLUTION_PLATFORM_CAPABILITIES.length >= 7,
      String(CONFIDENCE_EVOLUTION_PLATFORM_CAPABILITIES.length)
    )
  );

  checks.push(
    check(
      "principles",
      "Platform principles declared",
      CONFIDENCE_EVOLUTION_PLATFORM_PRINCIPLES.includes("executive_confidence_evolution_is_preserved"),
      String(CONFIDENCE_EVOLUTION_PLATFORM_PRINCIPLES.length)
    )
  );

  checks.push(
    check(
      "release_metadata",
      "Release metadata present",
      CONFIDENCE_EVOLUTION_RELEASE_METADATA.readOnly === true,
      CONFIDENCE_EVOLUTION_RELEASE_METADATA.platformStatus
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
      "evolution_identity",
      "Evolution identity validation",
      validateEvolutionIdentity("confidence-evolution-ws-001").valid === true,
      "valid"
    )
  );

  checks.push(
    check(
      "foundation_version",
      "Foundation version metadata",
      getConfidenceEvolutionFoundationVersionMetadata().foundationVersion === "APP-9/1",
      getConfidenceEvolutionFoundationVersionMetadata().foundationVersion
    )
  );

  checks.push(
    check(
      "platform_initialized",
      "Platform initialized after foundation creation",
      isConfidenceEvolutionPlatformInitialized() === true,
      String(getConfidenceEvolutionRegistry().confidenceLevels.length)
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
      CONFIDENCE_EVOLUTION_FUTURE_COMPATIBILITY.decisionJournalLinkReady === false &&
        CONFIDENCE_EVOLUTION_FUTURE_COMPATIBILITY.decisionTimelineLinkReady === false &&
        CONFIDENCE_EVOLUTION_FUTURE_COMPATIBILITY.visualizationReady === false,
      "future phases deferred"
    )
  );

  checks.push(
    check(
      "must_not_own",
      "Platform must-not-own boundaries",
      CONFIDENCE_EVOLUTION_MUST_NOT_OWN.includes("evolution_engine") &&
        CONFIDENCE_EVOLUTION_MUST_NOT_OWN.includes("trend_engine") &&
        CONFIDENCE_EVOLUTION_MUST_NOT_OWN.includes("ai_reasoning"),
      String(CONFIDENCE_EVOLUTION_MUST_NOT_OWN.length)
    )
  );

  checks.push(
    check(
      "extension_registry",
      "Extension registry registered",
      CONFIDENCE_EVOLUTION_EXTENSION_REGISTRY.length >= 4,
      String(CONFIDENCE_EVOLUTION_EXTENSION_REGISTRY.length)
    )
  );

  checks.push(
    check(
      "registration_validation",
      "Evolution registration validation",
      validateConfidenceEvolutionRegistration(
        Object.freeze({
          evolutionId: "confidence-evolution-ws-runner-001",
          workspaceId: "ws-runner-001",
          label: "Runner Validation Evolution",
          description: "Registration shape validation.",
        })
      ).valid === true,
      "valid"
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-9/1",
    contractVersion: CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}

export const ConfidenceEvolutionRunner = Object.freeze({
  runConfidenceEvolutionFoundation,
  resetConfidenceEvolutionPlatformForTests,
});
