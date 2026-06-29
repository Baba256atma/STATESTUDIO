/**
 * APP-10:1 — Cross-Scenario Learning Platform foundation runner.
 */

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { BUSINESS_TIMELINE_PLATFORM_IDENTITY } from "../business-timeline/businessTimelineContracts.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "../confidence-evolution/confidenceEvolutionContracts.ts";
import { DECISION_JOURNAL_PLATFORM_IDENTITY } from "../decision-journal/decisionJournalContracts.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
} from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import {
  CROSS_SCENARIO_LEARNING_COMPATIBILITY_REGISTRY,
  CROSS_SCENARIO_LEARNING_CONSUMER_REGISTRY,
  CROSS_SCENARIO_LEARNING_EXTENSION_REGISTRY,
  CROSS_SCENARIO_LEARNING_FUTURE_COMPATIBILITY,
  CROSS_SCENARIO_LEARNING_FUTURE_ENGINE_REGISTRY,
  CROSS_SCENARIO_LEARNING_MUST_NOT_OWN,
  CROSS_SCENARIO_LEARNING_PLATFORM_CAPABILITIES,
  CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
  CROSS_SCENARIO_LEARNING_PLATFORM_PRINCIPLES,
  CROSS_SCENARIO_LEARNING_RELEASE_METADATA,
  CROSS_SCENARIO_LEARNING_SOURCE_KEYS,
} from "./crossScenarioLearningConstants.ts";
import {
  CROSS_SCENARIO_LEARNING_FREEZE_RULES,
  CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY,
  CROSS_SCENARIO_LEARNING_PLATFORM_SELF_MANIFEST,
  CROSS_SCENARIO_LEARNING_PUBLIC_API_RULES,
  getCrossScenarioLearningManifest,
  resolveLearningCandidateExample,
  resolveLearningContextExample,
  resolveLearningSessionExample,
  resolveLearningSourceExample,
  resolveScenarioSnapshotExample,
  validateCrossScenarioLearningDependencies,
  validateCrossScenarioLearningFoundation,
} from "./crossScenarioLearningContracts.ts";
import {
  buildCrossScenarioLearningFoundation,
  getCrossScenarioLearningFoundationVersionMetadata,
  isCrossScenarioLearningPlatformInitialized,
  resetCrossScenarioLearningFoundationForTests,
} from "./crossScenarioLearningFoundation.ts";
import {
  getCrossScenarioLearningRegistry,
  registerFutureExtension,
  registerLearningCandidate,
  registerLearningSession,
  registerMetadataExtension,
  resetCrossScenarioLearningRegistryForTests,
} from "./crossScenarioLearningRegistry.ts";
import type { CrossScenarioLearningCertificationCheck, CrossScenarioLearningCertificationResult } from "./crossScenarioLearningTypes.ts";
import {
  hasDuplicateIds,
  isLearningSourceType,
  isReservedLearningSessionId,
  validateLearningCandidateContractShape,
  validateLearningContextContractShape,
  validateLearningCandidateRegistration,
  validateLearningSessionContractShape,
  validateLearningSessionRegistration,
  validatePlatformIdentity,
  validateScenarioSnapshotContractShape,
  validateSessionIdentity,
  validateWorkspaceIsolation,
} from "./crossScenarioLearningValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): CrossScenarioLearningCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

export function resetCrossScenarioLearningPlatformForTests(): void {
  resetCrossScenarioLearningRegistryForTests();
  resetCrossScenarioLearningFoundationForTests();
}

export function runCrossScenarioLearningFoundation(
  timestamp: string = FIXED_TIME
): CrossScenarioLearningCertificationResult {
  resetCrossScenarioLearningPlatformForTests();

  const checks: CrossScenarioLearningCertificationCheck[] = [];
  const foundation = buildCrossScenarioLearningFoundation(timestamp);
  checks.push(
    check(
      "A_platform_identity",
      "Platform identity and foundation creation",
      foundation.success && CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId === "APP-10",
      foundation.reason
    )
  );

  checks.push(
    check(
      "B_contracts_valid",
      "Learning contracts valid",
      validateScenarioSnapshotContractShape(resolveScenarioSnapshotExample(timestamp)).valid === true &&
        validateLearningCandidateContractShape(resolveLearningCandidateExample(timestamp)).valid === true &&
        validateLearningContextContractShape(resolveLearningContextExample(timestamp)).valid === true &&
        validateLearningSessionContractShape(resolveLearningSessionExample(timestamp)).valid === true,
      "all contract shapes valid"
    )
  );

  const manifest = getCrossScenarioLearningManifest(timestamp);
  checks.push(
    check(
      "C_registry_valid",
      "Registry valid",
      manifest.registrySnapshot.sourceTypeCount === 8 &&
        manifest.registrySnapshot.consumerCount === 4 &&
        manifest.registrySnapshot.futureEngineCount === 6,
      `sources=${manifest.registrySnapshot.sourceTypeCount}, consumers=${manifest.registrySnapshot.consumerCount}`
    )
  );

  checks.push(
    check(
      "D_constants_valid",
      "Constants valid",
      CROSS_SCENARIO_LEARNING_SOURCE_KEYS.length === 8 &&
        CROSS_SCENARIO_LEARNING_PLATFORM_PRINCIPLES.length >= 10 &&
        CROSS_SCENARIO_LEARNING_MUST_NOT_OWN.includes("machine_learning"),
      String(CROSS_SCENARIO_LEARNING_SOURCE_KEYS.length)
    )
  );

  checks.push(
    check(
      "E_manifest_valid",
      "Manifest valid",
      manifest.manifestVersion === CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION && Object.isFrozen(manifest),
      manifest.manifestVersion
    )
  );

  checks.push(
    check(
      "F_metadata_complete",
      "Metadata complete",
      manifest.platformPrinciples.length >= 10 &&
        manifest.extensionRegistry.length >= 6 &&
        manifest.metadataExtensionRegistry.length >= 3,
      String(manifest.platformPrinciples.length)
    )
  );

  checks.push(
    check(
      "G_public_api_exposed",
      "Public API exposed",
      typeof buildCrossScenarioLearningFoundation === "function" &&
        typeof validateCrossScenarioLearningFoundation === "function" &&
        CROSS_SCENARIO_LEARNING_PUBLIC_API_RULES.metadataOnly === true,
      "public API shell"
    )
  );

  checks.push(
    check(
      "H_learning_source_vocabulary",
      "Learning source vocabulary valid",
      isLearningSourceType("completed_scenario") === true &&
        isLearningSourceType("confidence_evolution") === true &&
        isLearningSourceType("invalid") === false,
      "learning source guards"
    )
  );

  checks.push(
    check(
      "I_no_runtime_learning",
      "No runtime learning behavior",
      CROSS_SCENARIO_LEARNING_FREEZE_RULES.noRuntimeExecution === true &&
        CROSS_SCENARIO_LEARNING_FUTURE_COMPATIBILITY.patternLearningReady === false &&
        CROSS_SCENARIO_LEARNING_FUTURE_COMPATIBILITY.similarityEngineReady === false,
      "metadata only"
    )
  );

  checks.push(
    check(
      "J_no_ml_forbidden",
      "No ML, embeddings, or vector search",
      CROSS_SCENARIO_LEARNING_FREEZE_RULES.noMachineLearning === true &&
        CROSS_SCENARIO_LEARNING_FREEZE_RULES.noEmbeddings === true &&
        CROSS_SCENARIO_LEARNING_MUST_NOT_OWN.includes("vector_search"),
      "no ML"
    )
  );

  checks.push(
    check(
      "K_consumer_only",
      "Consumer-only platform",
      CROSS_SCENARIO_LEARNING_FREEZE_RULES.consumerOnly === true &&
        CROSS_SCENARIO_LEARNING_COMPATIBILITY_REGISTRY.some((entry) => entry.guaranteeId === "consumer-only-platform"),
      "consumer only"
    )
  );

  checks.push(
    check(
      "L_dependency_gates",
      "Certified dependency gates valid",
      validateCrossScenarioLearningDependencies().valid === true &&
        manifest.dependencyValidation.valid === true,
      String(manifest.certifiedDependencies.length)
    )
  );

  checks.push(
    check(
      "M_prior_platforms_untouched",
      "Prior APP platforms untouched",
      SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
        DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6" &&
        BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7" &&
        DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8" &&
        CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId === "APP-9",
      "APP-5/6/7/8/9 identity verified"
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

  const session = registerLearningSession(
    Object.freeze({
      sessionId: "cross-scenario-learning-ws-cert-001",
      workspaceId: "ws-cert-001",
      label: "Certification Learning Session",
      description: "APP-10:1 certification session registration.",
      sourceTypes: Object.freeze(["completed_scenario", "final_outcome"]),
    }),
    timestamp
  );
  checks.push(
    check("session_registration", "Learning session registration", session.success === true, session.reason)
  );

  checks.push(
    check(
      "duplicate_session_protection",
      "Duplicate session protection",
      registerLearningSession(
        Object.freeze({
          sessionId: "cross-scenario-learning-ws-cert-001",
          workspaceId: "ws-cert-001",
          label: "Duplicate",
          description: "Duplicate registration attempt.",
          sourceTypes: Object.freeze(["completed_scenario"]),
        }),
        timestamp
      ).success === false,
      "duplicate rejected"
    )
  );

  const candidate = registerLearningCandidate(
    Object.freeze({
      candidateId: "learning-candidate-cert-001",
      workspaceId: "ws-cert-001",
      sessionId: "cross-scenario-learning-ws-cert-001",
      snapshotId: "scenario-snapshot-cert-001",
      sourceType: "completed_scenario",
      label: "Certification Candidate",
      description: "APP-10:1 certification candidate registration.",
    }),
    timestamp
  );
  checks.push(
    check("candidate_registration", "Learning candidate registration", candidate.success === true, candidate.reason)
  );

  checks.push(
    check(
      "reserved_session_ids",
      "Reserved session id protection",
      isReservedLearningSessionId("cross-scenario-learning-system") === true,
      "cross-scenario-learning-system reserved"
    )
  );

  checks.push(
    check(
      "foundation_validation",
      "Foundation validation report",
      validateCrossScenarioLearningFoundation(timestamp).valid === true,
      "valid"
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(CROSS_SCENARIO_LEARNING_PLATFORM_SELF_MANIFEST).valid === true,
      CROSS_SCENARIO_LEARNING_PLATFORM_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/cross-scenario-learning/crossScenarioLearningRegistry.ts",
        allowedFiles: CROSS_SCENARIO_LEARNING_PLATFORM_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: CROSS_SCENARIO_LEARNING_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true &&
        evaluateStageFileBoundary({
          filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
          allowedFiles: CROSS_SCENARIO_LEARNING_PLATFORM_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: CROSS_SCENARIO_LEARNING_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
        }).allowed === false,
      "boundaries enforced"
    )
  );

  const metadataExtension = registerMetadataExtension(
    Object.freeze({
      extensionId: "learning-strategy-v1",
      label: "Strategy Metadata v1",
      description: "Strategy metadata extension.",
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
      extensionId: "pattern-learning-phase",
      label: "Pattern Learning Phase",
      phaseKey: "pattern_learning",
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
      "extension_registry",
      "Extension registry reserved",
      CROSS_SCENARIO_LEARNING_EXTENSION_REGISTRY.length >= 6,
      String(CROSS_SCENARIO_LEARNING_EXTENSION_REGISTRY.length)
    )
  );

  checks.push(
    check(
      "consumer_registry",
      "Consumer registry registered",
      CROSS_SCENARIO_LEARNING_CONSUMER_REGISTRY.length >= 4,
      String(CROSS_SCENARIO_LEARNING_CONSUMER_REGISTRY.length)
    )
  );

  checks.push(
    check(
      "future_engine_registry",
      "Future engine registry reserved",
      CROSS_SCENARIO_LEARNING_FUTURE_ENGINE_REGISTRY.length >= 6,
      String(CROSS_SCENARIO_LEARNING_FUTURE_ENGINE_REGISTRY.length)
    )
  );

  checks.push(
    check(
      "learning_source_contract",
      "Learning source contract example valid",
      resolveLearningSourceExample(timestamp).consumerOnly === true &&
        resolveLearningSourceExample(timestamp).readOnly === true,
      resolveLearningSourceExample(timestamp).sourceType
    )
  );

  checks.push(
    check(
      "capabilities",
      "Platform capabilities declared",
      CROSS_SCENARIO_LEARNING_PLATFORM_CAPABILITIES.length >= 7,
      String(CROSS_SCENARIO_LEARNING_PLATFORM_CAPABILITIES.length)
    )
  );

  checks.push(
    check(
      "principles",
      "Platform principles declared",
      CROSS_SCENARIO_LEARNING_PLATFORM_PRINCIPLES.includes("learning_is_deterministic_and_reproducible"),
      String(CROSS_SCENARIO_LEARNING_PLATFORM_PRINCIPLES.length)
    )
  );

  checks.push(
    check(
      "release_metadata",
      "Release metadata present",
      CROSS_SCENARIO_LEARNING_RELEASE_METADATA.readOnly === true,
      CROSS_SCENARIO_LEARNING_RELEASE_METADATA.platformStatus
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
      "session_identity",
      "Session identity validation",
      validateSessionIdentity("cross-scenario-learning-ws-001").valid === true,
      "valid"
    )
  );

  checks.push(
    check(
      "foundation_version",
      "Foundation version metadata",
      getCrossScenarioLearningFoundationVersionMetadata().foundationVersion === "APP-10/1",
      getCrossScenarioLearningFoundationVersionMetadata().foundationVersion
    )
  );

  checks.push(
    check(
      "platform_initialized",
      "Platform initialized after foundation creation",
      isCrossScenarioLearningPlatformInitialized() === true,
      String(getCrossScenarioLearningRegistry().sourceTypes.length)
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
      CROSS_SCENARIO_LEARNING_FUTURE_COMPATIBILITY.recommendationLearningReady === false &&
        CROSS_SCENARIO_LEARNING_FUTURE_COMPATIBILITY.learningEngineReady === false &&
        CROSS_SCENARIO_LEARNING_FUTURE_COMPATIBILITY.scenarioTimelineConsumerReady === true,
      "future phases deferred"
    )
  );

  checks.push(
    check(
      "must_not_own",
      "Platform must-not-own boundaries",
      CROSS_SCENARIO_LEARNING_MUST_NOT_OWN.includes("similarity_engine") &&
        CROSS_SCENARIO_LEARNING_MUST_NOT_OWN.includes("recommendation_engine") &&
        CROSS_SCENARIO_LEARNING_MUST_NOT_OWN.includes("pattern_discovery"),
      String(CROSS_SCENARIO_LEARNING_MUST_NOT_OWN.length)
    )
  );

  checks.push(
    check(
      "registration_validation",
      "Session registration validation",
      validateLearningSessionRegistration(
        Object.freeze({
          sessionId: "cross-scenario-learning-ws-runner-001",
          workspaceId: "ws-runner-001",
          label: "Runner Validation Session",
          description: "Registration shape validation.",
          sourceTypes: Object.freeze(["completed_scenario"]),
        })
      ).valid === true,
      "valid"
    )
  );

  checks.push(
    check(
      "candidate_registration_validation",
      "Candidate registration validation",
      validateLearningCandidateRegistration(
        Object.freeze({
          candidateId: "learning-candidate-runner-001",
          workspaceId: "ws-runner-001",
          sessionId: "cross-scenario-learning-ws-runner-001",
          snapshotId: "scenario-snapshot-runner-001",
          sourceType: "final_outcome",
          label: "Runner Candidate",
          description: "Candidate shape validation.",
        })
      ).valid === true,
      "valid"
    )
  );

  checks.push(
    check(
      "platform_identity_validation",
      "Platform identity validation",
      validatePlatformIdentity(CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY).valid === true,
      "valid"
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-10/1",
    contractVersion: CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}

export const CrossScenarioLearningRunner = Object.freeze({
  runCrossScenarioLearningFoundation,
  resetCrossScenarioLearningPlatformForTests,
});
