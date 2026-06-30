/**
 * ASS-8 — Coordination identity, certified phase, reference, and compatibility registries.
 */

import { buildExecutiveAssistantClarificationArchitecture } from "./executiveAssistantClarificationExports.ts";
import {
  ASS_CERTIFIED_PHASE_BUILD_APIS,
  ASS_CERTIFIED_PHASE_DEPENDENCIES,
  ASS_CERTIFIED_PHASE_KEYS,
  ASS_CERTIFIED_PHASE_LABELS,
  ASS_COORDINATION_KEY,
  ASS_COORDINATION_PLATFORM_ID,
  ASS_COORDINATION_PLATFORM_NAME,
  ASS_COORDINATION_VERSION,
  ASS_PHASE_MANIFEST_REFERENCES,
  ASS_PHASE_REFERENCE_KEYS,
  ASS_PHASE_REFERENCE_PHASE_MAP,
} from "./executiveAssistantCoordinationContracts.ts";
import type {
  ExecutiveAssistantCertifiedPhaseRecord,
  ExecutiveAssistantCompatibilityMatrixEntry,
  ExecutiveAssistantCoordinationIdentityRecord,
  ExecutiveAssistantCoordinationRegistryBundle,
  ExecutiveAssistantPhaseReferenceRecord,
  ExecutiveAssistantPlatformCoordinationManifestRecord,
} from "./executiveAssistantCoordinationTypes.ts";

const coordinationIdentityRegistry = new Map<string, ExecutiveAssistantCoordinationIdentityRecord>();
const certifiedPhaseRegistry = new Map<string, ExecutiveAssistantCertifiedPhaseRecord>();
const conversationContractReferenceRegistry = new Map<string, ExecutiveAssistantPhaseReferenceRecord>();
const stateArchitectureReferenceRegistry = new Map<string, ExecutiveAssistantPhaseReferenceRecord>();
const routingArchitectureReferenceRegistry = new Map<string, ExecutiveAssistantPhaseReferenceRecord>();
const intentContractReferenceRegistry = new Map<string, ExecutiveAssistantPhaseReferenceRecord>();
const responseContractReferenceRegistry = new Map<string, ExecutiveAssistantPhaseReferenceRecord>();
const clarificationContractReferenceRegistry = new Map<string, ExecutiveAssistantPhaseReferenceRecord>();
const compatibilityMatrixRegistry = new Map<string, ExecutiveAssistantCompatibilityMatrixEntry>();
const platformCoordinationManifestRegistry = new Map<string, ExecutiveAssistantPlatformCoordinationManifestRecord>();

const sortByKey = <T>(entries: readonly T[], getKey: (entry: T) => string) =>
  Object.freeze([...entries].sort((left, right) => getKey(left).localeCompare(getKey(right))));

export function resetExecutiveAssistantCoordinationStoreForTests(): void {
  coordinationIdentityRegistry.clear();
  certifiedPhaseRegistry.clear();
  conversationContractReferenceRegistry.clear();
  stateArchitectureReferenceRegistry.clear();
  routingArchitectureReferenceRegistry.clear();
  intentContractReferenceRegistry.clear();
  responseContractReferenceRegistry.clear();
  clarificationContractReferenceRegistry.clear();
  compatibilityMatrixRegistry.clear();
  platformCoordinationManifestRegistry.clear();
}

function resolveReferenceRegistry(referenceKey: (typeof ASS_PHASE_REFERENCE_KEYS)[number]) {
  switch (referenceKey) {
    case "conversation_contract_reference":
      return conversationContractReferenceRegistry;
    case "state_architecture_reference":
      return stateArchitectureReferenceRegistry;
    case "routing_architecture_reference":
      return routingArchitectureReferenceRegistry;
    case "intent_contract_reference":
      return intentContractReferenceRegistry;
    case "response_contract_reference":
      return responseContractReferenceRegistry;
    case "clarification_contract_reference":
      return clarificationContractReferenceRegistry;
  }
}

function seedCoordinationIdentity(timestamp: string): void {
  coordinationIdentityRegistry.set(
    "ass-coordination-identity-default",
    Object.freeze({
      coordinationId: "ass-coordination-identity-default",
      coordinationKey: ASS_COORDINATION_KEY,
      platformVersion: ASS_COORDINATION_VERSION,
      certifiedPhaseCount: ASS_CERTIFIED_PHASE_KEYS.length,
      declarativeOnly: true as const,
      registeredAt: timestamp,
      readOnly: true as const,
    })
  );
}

function seedCertifiedPhases(timestamp: string): void {
  for (const phaseKey of ASS_CERTIFIED_PHASE_KEYS) {
    const dependency = ASS_CERTIFIED_PHASE_DEPENDENCIES[phaseKey];
    certifiedPhaseRegistry.set(
      `ass-certified-phase-${phaseKey}`,
      Object.freeze({
        phaseId: `ass-certified-phase-${phaseKey}`,
        phaseKey,
        label: ASS_CERTIFIED_PHASE_LABELS[phaseKey],
        buildApi: ASS_CERTIFIED_PHASE_BUILD_APIS[phaseKey],
        dependencyKey: dependency,
        contractVersion: phaseKey,
        registeredAt: timestamp,
        readOnly: true as const,
      })
    );
  }
}

function seedPhaseReferences(timestamp: string): void {
  for (const referenceKey of ASS_PHASE_REFERENCE_KEYS) {
    const phaseKey = ASS_PHASE_REFERENCE_PHASE_MAP[referenceKey];
    const manifestRef = ASS_PHASE_MANIFEST_REFERENCES[phaseKey];
    const record = Object.freeze({
      referenceId: `ass-phase-reference-${referenceKey}`,
      referenceKey,
      phaseKey,
      manifestId: manifestRef.manifestId,
      platformId: manifestRef.platformId,
      contractVersion: phaseKey,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    resolveReferenceRegistry(referenceKey).set(record.referenceId, record);
  }
}

function seedCompatibilityMatrix(timestamp: string): void {
  for (const fromPhaseKey of ASS_CERTIFIED_PHASE_KEYS) {
    for (const toPhaseKey of ASS_CERTIFIED_PHASE_KEYS) {
      const fromIndex = ASS_CERTIFIED_PHASE_KEYS.indexOf(fromPhaseKey);
      const toIndex = ASS_CERTIFIED_PHASE_KEYS.indexOf(toPhaseKey);
      const compatible = fromIndex <= toIndex;
      if (!compatible) {
        continue;
      }
      const compatibilityId = `ass-compatibility-${fromPhaseKey}-to-${toPhaseKey}`;
      compatibilityMatrixRegistry.set(
        compatibilityId,
        Object.freeze({
          compatibilityId,
          fromPhaseKey,
          toPhaseKey,
          compatible: true as const,
          registeredAt: timestamp,
          readOnly: true as const,
        })
      );
    }
  }
}

function seedPlatformCoordinationManifestRecord(
  timestamp: string,
  validationResult: "valid" | "invalid"
): ExecutiveAssistantPlatformCoordinationManifestRecord {
  const compatibility = Object.freeze([...ASS_CERTIFIED_PHASE_KEYS, ASS_COORDINATION_VERSION]);
  return Object.freeze({
    manifestId: "executive-assistant-platform-coordination-manifest",
    platformId: ASS_COORDINATION_PLATFORM_ID,
    version: ASS_COORDINATION_VERSION,
    title: ASS_COORDINATION_PLATFORM_NAME,
    certifiedPhaseCount: ASS_CERTIFIED_PHASE_KEYS.length,
    compatibilityEntryCount: compatibilityMatrixRegistry.size,
    validationResult,
    compatibility,
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

export function seedExecutiveAssistantCoordinationRegistries(
  timestamp: string,
  validationResult: "valid" | "invalid" = "valid"
): void {
  seedCoordinationIdentity(timestamp);
  seedCertifiedPhases(timestamp);
  seedPhaseReferences(timestamp);
  seedCompatibilityMatrix(timestamp);
  const manifestRecord = seedPlatformCoordinationManifestRecord(timestamp, validationResult);
  platformCoordinationManifestRegistry.set(manifestRecord.manifestId, manifestRecord);
}

export function ensureExecutiveAssistantCoordinationDependenciesReady(timestamp: string): boolean {
  const clarification = buildExecutiveAssistantClarificationArchitecture(timestamp);
  return clarification.success;
}

export function getExecutiveAssistantCoordinationRegistryBundle(): ExecutiveAssistantCoordinationRegistryBundle {
  const identities = sortByKey([...coordinationIdentityRegistry.values()], (entry) => entry.coordinationKey);
  const phases = sortByKey([...certifiedPhaseRegistry.values()], (entry) => entry.phaseKey);
  const conversationRefs = sortByKey([...conversationContractReferenceRegistry.values()], (entry) => entry.referenceKey);
  const stateRefs = sortByKey([...stateArchitectureReferenceRegistry.values()], (entry) => entry.referenceKey);
  const routingRefs = sortByKey([...routingArchitectureReferenceRegistry.values()], (entry) => entry.referenceKey);
  const intentRefs = sortByKey([...intentContractReferenceRegistry.values()], (entry) => entry.referenceKey);
  const responseRefs = sortByKey([...responseContractReferenceRegistry.values()], (entry) => entry.referenceKey);
  const clarificationRefs = sortByKey([...clarificationContractReferenceRegistry.values()], (entry) => entry.referenceKey);
  const compatibility = sortByKey([...compatibilityMatrixRegistry.values()], (entry) => entry.compatibilityId);
  const manifests = sortByKey([...platformCoordinationManifestRegistry.values()], (entry) => entry.manifestId);

  return Object.freeze({
    assistantCoordinationIdentityRegistry: identities,
    coordinationIdentityCount: identities.length,
    certifiedAssPhaseRegistry: phases,
    certifiedPhaseCount: phases.length,
    conversationContractReferenceRegistry: conversationRefs,
    conversationContractReferenceCount: conversationRefs.length,
    stateArchitectureReferenceRegistry: stateRefs,
    stateArchitectureReferenceCount: stateRefs.length,
    routingArchitectureReferenceRegistry: routingRefs,
    routingArchitectureReferenceCount: routingRefs.length,
    intentContractReferenceRegistry: intentRefs,
    intentContractReferenceCount: intentRefs.length,
    responseContractReferenceRegistry: responseRefs,
    responseContractReferenceCount: responseRefs.length,
    clarificationContractReferenceRegistry: clarificationRefs,
    clarificationContractReferenceCount: clarificationRefs.length,
    crossPhaseCompatibilityMatrixRegistry: compatibility,
    compatibilityEntryCount: compatibility.length,
    platformCoordinationManifestRegistry: manifests,
    platformCoordinationManifestCount: manifests.length,
    readOnly: true as const,
  });
}

export function getExecutiveAssistantCoordinationRegistry(): ExecutiveAssistantCoordinationRegistryBundle {
  return getExecutiveAssistantCoordinationRegistryBundle();
}

export function getExecutiveAssistantCompatibilityMatrix(): readonly ExecutiveAssistantCompatibilityMatrixEntry[] {
  return getExecutiveAssistantCoordinationRegistryBundle().crossPhaseCompatibilityMatrixRegistry;
}

export function isExecutiveAssistantCoordinationIdentityImmutable(
  record: ExecutiveAssistantCoordinationIdentityRecord
): boolean {
  return Object.isFrozen(record) && record.declarativeOnly === true;
}

export function registerExecutiveAssistantCertifiedPhaseExtension(
  phaseKey: string,
  label: string,
  buildApi: string,
  dependencyKey: string | null,
  timestamp: string
): boolean {
  const phaseId = `ass-certified-phase-extension-${phaseKey}`;
  if (certifiedPhaseRegistry.has(phaseId)) {
    return false;
  }
  certifiedPhaseRegistry.set(
    phaseId,
    Object.freeze({
      phaseId,
      phaseKey: phaseKey as ExecutiveAssistantCertifiedPhaseRecord["phaseKey"],
      label,
      buildApi,
      dependencyKey: dependencyKey as ExecutiveAssistantCertifiedPhaseRecord["dependencyKey"],
      contractVersion: phaseKey as ExecutiveAssistantCertifiedPhaseRecord["contractVersion"],
      registeredAt: timestamp,
      readOnly: true as const,
    })
  );
  return true;
}
