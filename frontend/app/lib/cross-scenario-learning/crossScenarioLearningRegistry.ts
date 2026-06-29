/**
 * APP-10:1 — Cross-Scenario Learning registry.
 */

import {
  CROSS_SCENARIO_LEARNING_CANDIDATE_STATUS_KEYS,
  CROSS_SCENARIO_LEARNING_CONSUMER_REGISTRY,
  CROSS_SCENARIO_LEARNING_DEFAULT_LIMITS,
  CROSS_SCENARIO_LEARNING_EXTENSION_REGISTRY,
  CROSS_SCENARIO_LEARNING_FUTURE_API_REGISTRY,
  CROSS_SCENARIO_LEARNING_FUTURE_ENGINE_REGISTRY,
  CROSS_SCENARIO_LEARNING_SESSION_STATUS_KEYS,
  CROSS_SCENARIO_LEARNING_SOURCE_KEYS,
} from "./crossScenarioLearningConstants.ts";
import type {
  CrossScenarioLearningPlatformResult,
  CrossScenarioLearningRegistrySnapshot,
  LearningCandidate,
  LearningCandidateRegistrationInput,
  LearningFutureExtensionRegistration,
  LearningMetadataExtensionRegistration,
  LearningSession,
  LearningSessionId,
  LearningSessionRegistrationInput,
  LearningSessionStatus,
  LearningSourceType,
} from "./crossScenarioLearningTypes.ts";
import {
  validateLearningCandidateRegistration,
  validateLearningSessionRegistration,
  validateMetadataExtensionRegistration,
} from "./crossScenarioLearningValidation.ts";

export const CROSS_SCENARIO_LEARNING_REGISTRY_VERSION = "APP-10/1-REGISTRY-1" as const;

const sessionRegistry = new Map<LearningSessionId, LearningSession>();
const candidateRegistry = new Map<string, LearningCandidate>();
const sourceTypeRegistry = new Map<string, { sourceType: LearningSourceType; label: string; description: string }>();
const sessionStatusRegistry = new Map<string, { status: LearningSessionStatus; label: string; description: string }>();
const candidateStatusRegistry = new Map<string, { status: string; label: string; description: string }>();
const metadataExtensionRegistry = new Map<string, LearningMetadataExtensionRegistration>();
const futureExtensionRegistry = new Map<string, LearningFutureExtensionRegistration>();

function createResult<T>(success: boolean, reason: string, data: T | null): CrossScenarioLearningPlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetCrossScenarioLearningRegistryForTests(): void {
  sessionRegistry.clear();
  candidateRegistry.clear();
  sourceTypeRegistry.clear();
  sessionStatusRegistry.clear();
  candidateStatusRegistry.clear();
  metadataExtensionRegistry.clear();
  futureExtensionRegistry.clear();
}

export function registerLearningSession(
  input: LearningSessionRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): CrossScenarioLearningPlatformResult<LearningSession> {
  const validation = validateLearningSessionRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (sessionRegistry.has(input.sessionId)) {
    return createResult(false, `Learning session already registered: ${input.sessionId}.`, null);
  }
  if (sessionRegistry.size >= CROSS_SCENARIO_LEARNING_DEFAULT_LIMITS.maxRegisteredSessions) {
    return createResult(false, "Learning session registry limit reached.", null);
  }
  const entry = Object.freeze({
    sessionId: input.sessionId,
    workspaceId: input.workspaceId,
    status: "draft" as const,
    label: input.label.trim(),
    description: input.description.trim(),
    sourceTypes: Object.freeze([...input.sourceTypes]),
    metadata: Object.freeze({
      metadataVersion: "APP-10/1",
      owner: "cross-scenario-learning-platform-foundation",
      extensions: Object.freeze({}),
      readOnly: true as const,
    }),
    createdAt: timestamp,
    updatedAt: timestamp,
    version: "APP-10/1" as const,
    readOnly: true as const,
  });
  sessionRegistry.set(entry.sessionId, entry);
  return createResult(true, "Learning session registered.", entry);
}

export function registerLearningCandidate(
  input: LearningCandidateRegistrationInput,
  registeredAt: string = new Date(0).toISOString()
): CrossScenarioLearningPlatformResult<LearningCandidate> {
  const validation = validateLearningCandidateRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (!sessionRegistry.has(input.sessionId)) {
    return createResult(false, `Learning session not found: ${input.sessionId}.`, null);
  }
  if (candidateRegistry.has(input.candidateId)) {
    return createResult(false, `Learning candidate already registered: ${input.candidateId}.`, null);
  }
  if (candidateRegistry.size >= CROSS_SCENARIO_LEARNING_DEFAULT_LIMITS.maxRegisteredCandidates) {
    return createResult(false, "Learning candidate registry limit reached.", null);
  }
  const entry = Object.freeze({
    candidateId: input.candidateId,
    workspaceId: input.workspaceId,
    sessionId: input.sessionId,
    snapshotId: input.snapshotId,
    sourceType: input.sourceType,
    status: "registered" as const,
    label: input.label.trim(),
    description: input.description.trim(),
    metadata: Object.freeze({
      metadataVersion: "APP-10/1",
      owner: "cross-scenario-learning-platform-foundation",
      extensions: Object.freeze({}),
      readOnly: true as const,
    }),
    registeredAt,
    version: "APP-10/1" as const,
    readOnly: true as const,
  });
  candidateRegistry.set(entry.candidateId, entry);
  return createResult(true, "Learning candidate registered.", entry);
}

export function registerMetadataExtension(
  input: LearningMetadataExtensionRegistration
): CrossScenarioLearningPlatformResult<LearningMetadataExtensionRegistration> {
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
  input: LearningFutureExtensionRegistration
): CrossScenarioLearningPlatformResult<LearningFutureExtensionRegistration> {
  if (!input.extensionId.trim() || !input.label.trim() || !input.phaseKey.trim()) {
    return createResult(false, "extensionId, label, and phaseKey are required.", null);
  }
  if (futureExtensionRegistry.has(input.extensionId)) {
    return createResult(false, `Future extension already registered: ${input.extensionId}.`, null);
  }
  const entry = Object.freeze({ ...input });
  futureExtensionRegistry.set(entry.extensionId, entry);
  return createResult(true, "Future extension registered.", entry);
}

function seedSourceTypes(): void {
  if (sourceTypeRegistry.size > 0) {
    return;
  }
  const labels: Record<LearningSourceType, { label: string; description: string }> = {
    completed_scenario: { label: "Completed Scenario", description: "Learning source from a completed scenario." },
    final_outcome: { label: "Final Outcome", description: "Learning source from a final business outcome." },
    executive_decision: { label: "Executive Decision", description: "Learning source from an executive decision record." },
    confidence_evolution: { label: "Confidence Evolution", description: "Learning source from confidence evolution records." },
    historical_timeline: { label: "Historical Timeline", description: "Learning source from historical timeline events." },
    validated_business_knowledge: { label: "Validated Business Knowledge", description: "Learning source from validated business knowledge." },
    decision_journal: { label: "Decision Journal", description: "Learning source from decision journal entries." },
    scenario_timeline: { label: "Scenario Timeline", description: "Learning source from scenario timeline events." },
  };
  for (const sourceType of CROSS_SCENARIO_LEARNING_SOURCE_KEYS) {
    sourceTypeRegistry.set(sourceType, Object.freeze({ sourceType, ...labels[sourceType] }));
  }
}

function seedSessionStatuses(): void {
  if (sessionStatusRegistry.size > 0) {
    return;
  }
  const labels: Record<LearningSessionStatus, { label: string; description: string }> = {
    draft: { label: "Draft", description: "Session is being prepared." },
    active: { label: "Active", description: "Session is active for learning registration." },
    completed: { label: "Completed", description: "Session learning registration is complete." },
    archived: { label: "Archived", description: "Session is archived." },
  };
  for (const status of CROSS_SCENARIO_LEARNING_SESSION_STATUS_KEYS) {
    sessionStatusRegistry.set(status, Object.freeze({ status, ...labels[status] }));
  }
}

function seedCandidateStatuses(): void {
  if (candidateStatusRegistry.size > 0) {
    return;
  }
  for (const status of CROSS_SCENARIO_LEARNING_CANDIDATE_STATUS_KEYS) {
    candidateStatusRegistry.set(status, Object.freeze({ status, label: status, description: `${status} candidate.` }));
  }
}

export function seedDefaultCrossScenarioLearningRegistry(): void {
  seedSourceTypes();
  seedSessionStatuses();
  seedCandidateStatuses();
}

export function listLearningSessionIds(): readonly LearningSessionId[] {
  return Object.freeze([...sessionRegistry.keys()]);
}

export function getCrossScenarioLearningRegistry(): Readonly<{
  sessions: readonly LearningSession[];
  candidates: readonly LearningCandidate[];
  sourceTypes: readonly { sourceType: LearningSourceType; label: string; description: string }[];
  sessionStatuses: readonly { status: LearningSessionStatus; label: string; description: string }[];
  candidateStatuses: readonly { status: string; label: string; description: string }[];
  metadataExtensions: readonly LearningMetadataExtensionRegistration[];
  futureExtensions: readonly LearningFutureExtensionRegistration[];
  consumers: typeof CROSS_SCENARIO_LEARNING_CONSUMER_REGISTRY;
  futureEngines: typeof CROSS_SCENARIO_LEARNING_FUTURE_ENGINE_REGISTRY;
  futureApis: typeof CROSS_SCENARIO_LEARNING_FUTURE_API_REGISTRY;
  extensions: typeof CROSS_SCENARIO_LEARNING_EXTENSION_REGISTRY;
}> {
  seedDefaultCrossScenarioLearningRegistry();
  return Object.freeze({
    sessions: Object.freeze([...sessionRegistry.values()]),
    candidates: Object.freeze([...candidateRegistry.values()]),
    sourceTypes: Object.freeze([...sourceTypeRegistry.values()]),
    sessionStatuses: Object.freeze([...sessionStatusRegistry.values()]),
    candidateStatuses: Object.freeze([...candidateStatusRegistry.values()]),
    metadataExtensions: Object.freeze([...metadataExtensionRegistry.values()]),
    futureExtensions: Object.freeze([...futureExtensionRegistry.values()]),
    consumers: CROSS_SCENARIO_LEARNING_CONSUMER_REGISTRY,
    futureEngines: CROSS_SCENARIO_LEARNING_FUTURE_ENGINE_REGISTRY,
    futureApis: CROSS_SCENARIO_LEARNING_FUTURE_API_REGISTRY,
    extensions: CROSS_SCENARIO_LEARNING_EXTENSION_REGISTRY,
  });
}

export function getCrossScenarioLearningRegistrySnapshot(): CrossScenarioLearningRegistrySnapshot {
  seedDefaultCrossScenarioLearningRegistry();
  return Object.freeze({
    registryVersion: CROSS_SCENARIO_LEARNING_REGISTRY_VERSION,
    sessionCount: sessionRegistry.size,
    candidateCount: candidateRegistry.size,
    sourceTypeCount: sourceTypeRegistry.size,
    consumerCount: CROSS_SCENARIO_LEARNING_CONSUMER_REGISTRY.length,
    futureEngineCount: CROSS_SCENARIO_LEARNING_FUTURE_ENGINE_REGISTRY.length,
    extensionCount: CROSS_SCENARIO_LEARNING_EXTENSION_REGISTRY.length,
    readOnly: true as const,
  });
}

export const CrossScenarioLearningRegistry = Object.freeze({
  resetCrossScenarioLearningRegistryForTests,
  seedDefaultCrossScenarioLearningRegistry,
  registerLearningSession,
  registerLearningCandidate,
  registerMetadataExtension,
  registerFutureExtension,
  getCrossScenarioLearningRegistry,
  getCrossScenarioLearningRegistrySnapshot,
  listLearningSessionIds,
});
