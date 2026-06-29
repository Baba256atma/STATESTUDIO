/**
 * APP-12:1 — Executive Recommendation registry.
 */

import {
  EXECUTIVE_RECOMMENDATION_CONSUMER_REGISTRY,
  EXECUTIVE_RECOMMENDATION_DEFAULT_LIMITS,
  EXECUTIVE_RECOMMENDATION_DOMAIN_KEYS,
  EXECUTIVE_RECOMMENDATION_EXTENSION_REGISTRY,
  EXECUTIVE_RECOMMENDATION_FUTURE_API_REGISTRY,
  EXECUTIVE_RECOMMENDATION_FUTURE_ENGINE_REGISTRY,
  EXECUTIVE_RECOMMENDATION_CANDIDATE_STATUS_KEYS,
  EXECUTIVE_RECOMMENDATION_SESSION_STATUS_KEYS,
  EXECUTIVE_RECOMMENDATION_SOURCE_PROVIDER_REGISTRY,
} from "./executiveRecommendationConstants.ts";
import type {
  ExecutiveRecommendationCandidate,
  ExecutiveRecommendationCandidateRegistrationInput,
  ExecutiveRecommendationDomainKey,
  ExecutiveRecommendationFutureExtensionRegistration,
  ExecutiveRecommendationMetadataExtensionRegistration,
  ExecutiveRecommendationPlatformResult,
  ExecutiveRecommendationRegistrySnapshot,
  ExecutiveRecommendationSession,
  ExecutiveRecommendationSessionId,
  ExecutiveRecommendationSessionRegistrationInput,
  ExecutiveRecommendationSessionStatus,
} from "./executiveRecommendationTypes.ts";
import {
  validateExecutiveRecommendationCandidateRegistration,
  validateExecutiveRecommendationSessionRegistration,
  validateMetadataExtensionRegistration,
} from "./executiveRecommendationValidation.ts";

export const EXECUTIVE_RECOMMENDATION_REGISTRY_VERSION = "APP-12/1-REGISTRY-1" as const;

const sessionRegistry = new Map<ExecutiveRecommendationSessionId, ExecutiveRecommendationSession>();
const candidateRegistry = new Map<string, ExecutiveRecommendationCandidate>();
const domainRegistry = new Map<string, { domain: ExecutiveRecommendationDomainKey; label: string; description: string }>();
const sessionStatusRegistry = new Map<string, { status: ExecutiveRecommendationSessionStatus; label: string; description: string }>();
const candidateStatusRegistry = new Map<string, { status: string; label: string; description: string }>();
const metadataExtensionRegistry = new Map<string, ExecutiveRecommendationMetadataExtensionRegistration>();
const futureExtensionRegistry = new Map<string, ExecutiveRecommendationFutureExtensionRegistration>();

function createResult<T>(success: boolean, reason: string, data: T | null): ExecutiveRecommendationPlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetExecutiveRecommendationRegistryForTests(): void {
  sessionRegistry.clear();
  candidateRegistry.clear();
  domainRegistry.clear();
  sessionStatusRegistry.clear();
  candidateStatusRegistry.clear();
  metadataExtensionRegistry.clear();
  futureExtensionRegistry.clear();
}

export function registerExecutiveRecommendationSession(
  input: ExecutiveRecommendationSessionRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): ExecutiveRecommendationPlatformResult<ExecutiveRecommendationSession> {
  const validation = validateExecutiveRecommendationSessionRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (sessionRegistry.has(input.sessionId)) {
    return createResult(false, `Executive recommendation session already registered: ${input.sessionId}.`, null);
  }
  if (sessionRegistry.size >= EXECUTIVE_RECOMMENDATION_DEFAULT_LIMITS.maxRegisteredSessions) {
    return createResult(false, "Executive recommendation session registry limit reached.", null);
  }
  const entry = Object.freeze({
    sessionId: input.sessionId,
    workspaceId: input.workspaceId,
    status: "draft" as const,
    label: input.label.trim(),
    description: input.description.trim(),
    domains: Object.freeze([...input.domains]),
    metadata: Object.freeze({
      metadataVersion: "APP-12/1",
      owner: "executive-recommendation-platform-foundation",
      extensions: Object.freeze({}),
      readOnly: true as const,
    }),
    createdAt: timestamp,
    updatedAt: timestamp,
    version: "APP-12/1" as const,
    readOnly: true as const,
  });
  sessionRegistry.set(entry.sessionId, entry);
  return createResult(true, "Executive recommendation session registered.", entry);
}

export function registerExecutiveRecommendationCandidate(
  input: ExecutiveRecommendationCandidateRegistrationInput,
  registeredAt: string = new Date(0).toISOString()
): ExecutiveRecommendationPlatformResult<ExecutiveRecommendationCandidate> {
  const validation = validateExecutiveRecommendationCandidateRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (!sessionRegistry.has(input.sessionId)) {
    return createResult(false, `Executive recommendation session not found: ${input.sessionId}.`, null);
  }
  if (candidateRegistry.has(input.candidateId)) {
    return createResult(false, `Executive recommendation candidate already registered: ${input.candidateId}.`, null);
  }
  if (candidateRegistry.size >= EXECUTIVE_RECOMMENDATION_DEFAULT_LIMITS.maxRegisteredCandidates) {
    return createResult(false, "Executive recommendation candidate registry limit reached.", null);
  }
  const entry = Object.freeze({
    candidateId: input.candidateId,
    workspaceId: input.workspaceId,
    sessionId: input.sessionId,
    domain: input.domain,
    sourceProviderId: input.sourceProviderId,
    sourceReferenceId: input.sourceReferenceId,
    status: "registered" as const,
    label: input.label.trim(),
    description: input.description.trim(),
    metadata: Object.freeze({
      metadataVersion: "APP-12/1",
      owner: "executive-recommendation-platform-foundation",
      extensions: Object.freeze({}),
      readOnly: true as const,
    }),
    registeredAt,
    version: "APP-12/1" as const,
    readOnly: true as const,
  });
  candidateRegistry.set(entry.candidateId, entry);
  return createResult(true, "Executive recommendation candidate registered.", entry);
}

export function registerMetadataExtension(
  input: ExecutiveRecommendationMetadataExtensionRegistration
): ExecutiveRecommendationPlatformResult<ExecutiveRecommendationMetadataExtensionRegistration> {
  const validation = validateMetadataExtensionRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (metadataExtensionRegistry.has(input.extensionId)) {
    return createResult(false, `Metadata extension already registered: ${input.extensionId}.`, null);
  }
  const entry = Object.freeze({ ...input });
  metadataExtensionRegistry.set(entry.extensionId, entry);
  return createResult(true, "Metadata extension registered.", entry);
}

export function registerFutureExtension(
  input: ExecutiveRecommendationFutureExtensionRegistration
): ExecutiveRecommendationPlatformResult<ExecutiveRecommendationFutureExtensionRegistration> {
  if (futureExtensionRegistry.has(input.extensionId)) {
    return createResult(false, `Future extension already registered: ${input.extensionId}.`, null);
  }
  const entry = Object.freeze({ ...input });
  futureExtensionRegistry.set(entry.extensionId, entry);
  return createResult(true, "Future extension registered.", entry);
}

export function listExecutiveRecommendationSessionIds(): readonly ExecutiveRecommendationSessionId[] {
  return Object.freeze([...sessionRegistry.keys()]);
}

export function getExecutiveRecommendationRegistrySnapshot(): ExecutiveRecommendationRegistrySnapshot {
  return Object.freeze({
    registryVersion: EXECUTIVE_RECOMMENDATION_REGISTRY_VERSION,
    sessionCount: sessionRegistry.size,
    candidateCount: candidateRegistry.size,
    domainCount: domainRegistry.size || EXECUTIVE_RECOMMENDATION_DOMAIN_KEYS.length,
    sourceProviderCount: EXECUTIVE_RECOMMENDATION_SOURCE_PROVIDER_REGISTRY.length,
    consumerCount: EXECUTIVE_RECOMMENDATION_CONSUMER_REGISTRY.length,
    futureEngineCount: EXECUTIVE_RECOMMENDATION_FUTURE_ENGINE_REGISTRY.length,
    extensionCount: metadataExtensionRegistry.size + futureExtensionRegistry.size,
    readOnly: true as const,
  });
}

export function seedDefaultExecutiveRecommendationRegistry(): void {
  if (domainRegistry.size > 0) {
    return;
  }
  for (const domain of EXECUTIVE_RECOMMENDATION_DOMAIN_KEYS) {
    domainRegistry.set(domain, Object.freeze({ domain, label: domain, description: `${domain} recommendation domain.` }));
  }
  for (const status of EXECUTIVE_RECOMMENDATION_SESSION_STATUS_KEYS) {
    sessionStatusRegistry.set(status, Object.freeze({ status, label: status, description: `${status} session status.` }));
  }
  for (const status of EXECUTIVE_RECOMMENDATION_CANDIDATE_STATUS_KEYS) {
    candidateStatusRegistry.set(status, Object.freeze({ status, label: status, description: `${status} candidate status.` }));
  }
  for (const extension of EXECUTIVE_RECOMMENDATION_EXTENSION_REGISTRY) {
    futureExtensionRegistry.set(
      extension.extensionId,
      Object.freeze({
        extensionId: extension.extensionId,
        label: extension.label,
        phaseKey: extension.phaseKey,
        readOnly: true as const,
      })
    );
  }
}

export function getExecutiveRecommendationRegistry(): Readonly<{
  snapshot: ExecutiveRecommendationRegistrySnapshot;
  sourceProviderRegistry: typeof EXECUTIVE_RECOMMENDATION_SOURCE_PROVIDER_REGISTRY;
  consumerRegistry: typeof EXECUTIVE_RECOMMENDATION_CONSUMER_REGISTRY;
  futureEngineRegistry: typeof EXECUTIVE_RECOMMENDATION_FUTURE_ENGINE_REGISTRY;
  futureApiRegistry: typeof EXECUTIVE_RECOMMENDATION_FUTURE_API_REGISTRY;
}> {
  return Object.freeze({
    snapshot: getExecutiveRecommendationRegistrySnapshot(),
    sourceProviderRegistry: EXECUTIVE_RECOMMENDATION_SOURCE_PROVIDER_REGISTRY,
    consumerRegistry: EXECUTIVE_RECOMMENDATION_CONSUMER_REGISTRY,
    futureEngineRegistry: EXECUTIVE_RECOMMENDATION_FUTURE_ENGINE_REGISTRY,
    futureApiRegistry: EXECUTIVE_RECOMMENDATION_FUTURE_API_REGISTRY,
  });
}

export const ExecutiveRecommendationRegistry = Object.freeze({
  registerExecutiveRecommendationSession,
  registerExecutiveRecommendationCandidate,
  registerMetadataExtension,
  registerFutureExtension,
  listExecutiveRecommendationSessionIds,
  getExecutiveRecommendationRegistrySnapshot,
  getExecutiveRecommendationRegistry,
  resetExecutiveRecommendationRegistryForTests,
  seedDefaultExecutiveRecommendationRegistry,
});
