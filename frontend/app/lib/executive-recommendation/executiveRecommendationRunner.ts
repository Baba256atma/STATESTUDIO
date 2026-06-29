/**
 * APP-12:1 — Executive Recommendation Platform foundation runner.
 */

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { SCENARIO_INTELLIGENCE_IDENTITY } from "../app-2-scenario-intelligence/scenarioIntelligenceContract.ts";
import { BUSINESS_TIMELINE_PLATFORM_IDENTITY } from "../business-timeline/businessTimelineContracts.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "../confidence-evolution/confidenceEvolutionContracts.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY } from "../cross-scenario-learning/crossScenarioLearningContracts.ts";
import { DECISION_JOURNAL_PLATFORM_IDENTITY } from "../decision-journal/decisionJournalContracts.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import { EXECUTIVE_INBOX_PLATFORM_ID } from "../executive-inbox/executiveInboxConstants.ts";
import { EXECUTIVE_INTENT_IDENTITY } from "../executiveIntent/executiveIntentContract.ts";
import { EXECUTIVE_MEMORY_IDENTITY } from "../executiveMemory/executiveMemoryContracts.ts";
import { EXECUTIVE_TIME_FOUNDATION_VERSION } from "../executive-time/executiveTimeContract.ts";
import { SCENARIO_TIMELINE_PLATFORM_IDENTITY } from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import {
  EXECUTIVE_RECOMMENDATION_COMPATIBILITY_REGISTRY,
  EXECUTIVE_RECOMMENDATION_CONSUMER_REGISTRY,
  EXECUTIVE_RECOMMENDATION_DOMAIN_KEYS,
  EXECUTIVE_RECOMMENDATION_EXTENSION_REGISTRY,
  EXECUTIVE_RECOMMENDATION_FUTURE_COMPATIBILITY,
  EXECUTIVE_RECOMMENDATION_MUST_NOT_OWN,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CAPABILITIES,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_PLATFORM_PRINCIPLES,
  EXECUTIVE_RECOMMENDATION_PUBLIC_API_REGISTRY,
  EXECUTIVE_RECOMMENDATION_RELEASE_METADATA,
  EXECUTIVE_RECOMMENDATION_SOURCE_PROVIDER_REGISTRY,
} from "./executiveRecommendationConstants.ts";
import {
  EXECUTIVE_RECOMMENDATION_FREEZE_RULES,
  EXECUTIVE_RECOMMENDATION_PLATFORM_IDENTITY,
  EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST,
  EXECUTIVE_RECOMMENDATION_PUBLIC_API_RULES,
  getExecutiveRecommendationManifest,
  validateExecutiveRecommendationDependencies,
  validateExecutiveRecommendationFoundation,
} from "./executiveRecommendationContracts.ts";
import {
  buildExecutiveRecommendationFoundation,
  getExecutiveRecommendationFoundationVersionMetadata,
  isExecutiveRecommendationPlatformInitialized,
  resetExecutiveRecommendationFoundationForTests,
} from "./executiveRecommendationFoundation.ts";
import {
  getExecutiveRecommendationRegistry,
  registerExecutiveRecommendationCandidate,
  registerExecutiveRecommendationSession,
  registerMetadataExtension,
  resetExecutiveRecommendationRegistryForTests,
} from "./executiveRecommendationRegistry.ts";
import type {
  ExecutiveRecommendationCertificationCheck,
  ExecutiveRecommendationCertificationResult,
} from "./executiveRecommendationTypes.ts";
import {
  hasDuplicateIds,
  isExecutiveRecommendationDomain,
  isReservedExecutiveRecommendationSessionId,
  validateExecutiveRecommendationCandidateRegistration,
  validateExecutiveRecommendationSessionRegistration,
  validatePlatformIdentity,
  validateSessionIdentity,
  validateWorkspaceIsolation,
} from "./executiveRecommendationValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ExecutiveRecommendationCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

export function resetExecutiveRecommendationPlatformForTests(): void {
  resetExecutiveRecommendationRegistryForTests();
  resetExecutiveRecommendationFoundationForTests();
}

export function runExecutiveRecommendationFoundation(
  timestamp: string = FIXED_TIME
): ExecutiveRecommendationCertificationResult {
  resetExecutiveRecommendationPlatformForTests();

  const checks: ExecutiveRecommendationCertificationCheck[] = [];
  const foundation = buildExecutiveRecommendationFoundation(timestamp);
  checks.push(
    check(
      "A_platform_identity",
      "Platform identity and foundation creation",
      foundation.success && EXECUTIVE_RECOMMENDATION_PLATFORM_IDENTITY.appId === "APP-12",
      foundation.reason
    )
  );

  checks.push(
    check(
      "B_contracts_valid",
      "Recommendation contracts valid",
      validateExecutiveRecommendationFoundation(timestamp).valid === true,
      "contract shapes valid"
    )
  );

  const manifest = getExecutiveRecommendationManifest(timestamp);
  checks.push(
    check(
      "C_registry_valid",
      "Registry valid",
      manifest.registrySnapshot.domainCount === 10 &&
        manifest.registrySnapshot.consumerCount === 4 &&
        manifest.registrySnapshot.sourceProviderCount === 13 &&
        manifest.registrySnapshot.futureEngineCount === 6,
      `domains=${manifest.registrySnapshot.domainCount}, providers=${manifest.registrySnapshot.sourceProviderCount}`
    )
  );

  checks.push(
    check(
      "D_constants_valid",
      "Constants valid",
      EXECUTIVE_RECOMMENDATION_DOMAIN_KEYS.length === 10 &&
        EXECUTIVE_RECOMMENDATION_PLATFORM_PRINCIPLES.length >= 10 &&
        EXECUTIVE_RECOMMENDATION_MUST_NOT_OWN.includes("recommendation_generation"),
      String(EXECUTIVE_RECOMMENDATION_DOMAIN_KEYS.length)
    )
  );

  checks.push(
    check(
      "E_manifest_valid",
      "Manifest valid",
      manifest.manifestVersion === EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION && Object.isFrozen(manifest),
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
      typeof buildExecutiveRecommendationFoundation === "function" &&
        typeof validateExecutiveRecommendationFoundation === "function" &&
        typeof getExecutiveRecommendationManifest === "function" &&
        EXECUTIVE_RECOMMENDATION_PUBLIC_API_RULES.metadataOnly === true,
      "public API shell"
    )
  );

  checks.push(
    check(
      "H_recommendation_domain_vocabulary",
      "Recommendation domain vocabulary valid",
      isExecutiveRecommendationDomain("strategic") === true &&
        isExecutiveRecommendationDomain("mixed") === true &&
        isExecutiveRecommendationDomain("invalid") === false,
      "domain guards"
    )
  );

  checks.push(
    check(
      "I_no_recommendation_generation",
      "No recommendation generation behavior",
      EXECUTIVE_RECOMMENDATION_FREEZE_RULES.noRecommendationGeneration === true &&
        EXECUTIVE_RECOMMENDATION_FUTURE_COMPATIBILITY.generationEngineReady === false &&
        EXECUTIVE_RECOMMENDATION_FUTURE_COMPATIBILITY.evaluationEngineReady === false,
      "metadata only"
    )
  );

  checks.push(
    check(
      "J_no_execution_workflow",
      "No execution or workflow delivery",
      EXECUTIVE_RECOMMENDATION_FREEZE_RULES.noRecommendationExecution === true &&
        EXECUTIVE_RECOMMENDATION_FREEZE_RULES.noWorkflowExecution === true &&
        EXECUTIVE_RECOMMENDATION_MUST_NOT_OWN.includes("recommendation_execution"),
      "no execution"
    )
  );

  checks.push(
    check(
      "K_consumer_only",
      "Consumer-only platform",
      EXECUTIVE_RECOMMENDATION_FREEZE_RULES.consumerOnly === true &&
        EXECUTIVE_RECOMMENDATION_COMPATIBILITY_REGISTRY.some((entry) => entry.guaranteeId === "consumer-only-platform"),
      "consumer only"
    )
  );

  checks.push(
    check(
      "L_dependency_gates",
      "Certified dependency gates valid",
      validateExecutiveRecommendationDependencies().valid === true && manifest.dependencyValidation.valid === true,
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
        CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId === "APP-10" &&
        EXECUTIVE_INBOX_PLATFORM_ID === "executive-inbox-platform",
      "APP-1 through APP-11 identity verified"
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

  const session = registerExecutiveRecommendationSession(
    Object.freeze({
      sessionId: "executive-recommendation-ws-cert-001",
      workspaceId: "ws-cert-001",
      label: "Certification Recommendation Session",
      description: "APP-12:1 certification session registration.",
      domains: Object.freeze(["strategic", "risk"] as const),
    }),
    timestamp
  );
  checks.push(
    check("session_registration", "Recommendation session registration", session.success === true, session.reason)
  );

  checks.push(
    check(
      "duplicate_session_protection",
      "Duplicate session protection",
      registerExecutiveRecommendationSession(
        Object.freeze({
          sessionId: "executive-recommendation-ws-cert-001",
          workspaceId: "ws-cert-001",
          label: "Duplicate",
          description: "Duplicate registration attempt.",
          domains: Object.freeze(["strategic"] as const),
        }),
        timestamp
      ).success === false,
      "duplicate rejected"
    )
  );

  const candidate = registerExecutiveRecommendationCandidate(
    Object.freeze({
      candidateId: "recommendation-candidate-cert-001",
      workspaceId: "ws-cert-001",
      sessionId: "executive-recommendation-ws-cert-001",
      domain: "strategic",
      sourceProviderId: "scenario-intelligence-provider",
      sourceReferenceId: "scenario-cert-001",
      label: "Certification Recommendation Candidate",
      description: "APP-12:1 certification candidate registration.",
    }),
    timestamp
  );
  checks.push(
    check("candidate_registration", "Recommendation candidate registration", candidate.success === true, candidate.reason)
  );

  checks.push(
    check(
      "reserved_session_ids",
      "Reserved session id protection",
      isReservedExecutiveRecommendationSessionId("executive-recommendation-system") === true,
      "executive-recommendation-system reserved"
    )
  );

  checks.push(
    check(
      "foundation_validation",
      "Foundation validation report",
      validateExecutiveRecommendationFoundation(timestamp).valid === true,
      "valid"
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST).valid === true,
      EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "architecture_boundary",
      "Architecture file boundary",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/executive-recommendation/executiveRecommendationFoundation.ts",
        allowedFiles: EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "executiveRecommendationFoundation.ts"
    )
  );

  checks.push(
    check(
      "extension_registry",
      "Extension registry reserved",
      EXECUTIVE_RECOMMENDATION_EXTENSION_REGISTRY.some((entry) => entry.phaseKey === "generation_engine") &&
        registerMetadataExtension(
          Object.freeze({
            extensionId: "recommendation-metadata-cert-test",
            label: "Certification Metadata Extension",
            description: "APP-12:1 certification metadata extension.",
          })
        ).success === true,
      String(EXECUTIVE_RECOMMENDATION_EXTENSION_REGISTRY.length)
    )
  );

  checks.push(
    check(
      "public_api_registry",
      "Public API registry declared",
      EXECUTIVE_RECOMMENDATION_PUBLIC_API_REGISTRY.includes("runExecutiveRecommendationFoundation") &&
        EXECUTIVE_RECOMMENDATION_PUBLIC_API_REGISTRY.includes("getExecutiveRecommendationManifest"),
      String(EXECUTIVE_RECOMMENDATION_PUBLIC_API_REGISTRY.length)
    )
  );

  checks.push(
    check(
      "source_provider_registry",
      "Source provider registry declared",
      EXECUTIVE_RECOMMENDATION_SOURCE_PROVIDER_REGISTRY.length === 13 &&
        manifest.sourceProviderRegistry.every((entry) => entry.status === "registered"),
      String(EXECUTIVE_RECOMMENDATION_SOURCE_PROVIDER_REGISTRY.length)
    )
  );

  checks.push(
    check(
      "platform_capabilities",
      "Platform capabilities declared",
      EXECUTIVE_RECOMMENDATION_PLATFORM_CAPABILITIES.includes("dependency_validation") &&
        EXECUTIVE_RECOMMENDATION_PLATFORM_CAPABILITIES.includes("source_provider_registry"),
      String(EXECUTIVE_RECOMMENDATION_PLATFORM_CAPABILITIES.length)
    )
  );

  checks.push(
    check(
      "release_metadata",
      "Release metadata immutable",
      EXECUTIVE_RECOMMENDATION_RELEASE_METADATA.readOnly === true &&
        EXECUTIVE_RECOMMENDATION_RELEASE_METADATA.platformStatus === "build",
      EXECUTIVE_RECOMMENDATION_RELEASE_METADATA.releaseStage
    )
  );

  checks.push(
    check(
      "duplicate_domains",
      "Duplicate domain protection",
      hasDuplicateIds(["strategic", "risk", "strategic"]) === true &&
        hasDuplicateIds(["strategic", "risk"]) === false,
      "duplicate detection"
    )
  );

  checks.push(
    check(
      "session_registration_validation",
      "Session registration validation",
      validateExecutiveRecommendationSessionRegistration(
        Object.freeze({
          sessionId: "",
          workspaceId: "ws-cert-001",
          label: "Invalid",
          description: "Missing session id.",
          domains: Object.freeze(["strategic"] as const),
        })
      ).valid === false,
      "invalid rejected"
    )
  );

  checks.push(
    check(
      "candidate_registration_validation",
      "Candidate registration validation",
      validateExecutiveRecommendationCandidateRegistration(
        Object.freeze({
          candidateId: "recommendation-candidate-invalid",
          workspaceId: "ws-cert-001",
          sessionId: "missing-session",
          domain: "invalid" as "strategic",
          sourceProviderId: "unknown-provider",
          sourceReferenceId: "ref-001",
          label: "Invalid",
          description: "Invalid domain.",
        })
      ).valid === false,
      "invalid rejected"
    )
  );

  checks.push(
    check(
      "registry_snapshot",
      "Registry snapshot available",
      getExecutiveRecommendationRegistry().snapshot.registryVersion.startsWith("APP-12/1") &&
        isExecutiveRecommendationPlatformInitialized() === true,
      getExecutiveRecommendationFoundationVersionMetadata().foundationVersion
    )
  );

  checks.push(
    check(
      "consumer_registry",
      "Consumer registry declared",
      EXECUTIVE_RECOMMENDATION_CONSUMER_REGISTRY.length === 4 &&
        manifest.consumerRegistry.every((entry) => entry.status === "registered"),
      String(EXECUTIVE_RECOMMENDATION_CONSUMER_REGISTRY.length)
    )
  );

  checks.push(
    check(
      "platform_identity_validation",
      "Platform identity validation",
      validatePlatformIdentity(EXECUTIVE_RECOMMENDATION_PLATFORM_IDENTITY).valid === true &&
        validateSessionIdentity("executive-recommendation-ws-001").valid === true,
      EXECUTIVE_RECOMMENDATION_PLATFORM_IDENTITY.platformId
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-12/1",
    contractVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}

export const ExecutiveRecommendationRunner = Object.freeze({
  runExecutiveRecommendationFoundation,
  resetExecutiveRecommendationPlatformForTests,
});
