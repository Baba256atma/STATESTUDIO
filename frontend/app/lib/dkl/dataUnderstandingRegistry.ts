/**
 * DKL-3:2 — Data Understanding Registry.
 *
 * The canonical immutable registry aggregate for the Data Understanding
 * Platform. Publishes exactly eight runtime exports of registry metadata.
 * Registry only — no semantic understanding, no candidate generation, no
 * Business Objects, no persistence, no AI, no Engine reasoning, no runtime
 * interpretation.
 *
 * Ownership: owned exclusively by DKL-3:2.
 * Dependencies: DKL-2 Public Index, DKL-3:1 public APIs, and the Pipeline
 * Understanding Platform public APIs only.
 */

import {
  DataSourceKnowledgeRegistryPublicIndexVersion,
} from "./dataSourceKnowledgeRegistryPublicIndex.ts";
import { PipelineUnderstandingPlatform } from "../pipeline/pipelineUnderstandingPlatform.ts";
import {
  DataUnderstandingBoundaries,
  DataUnderstandingContracts,
  DataUnderstandingFoundation,
  DataUnderstandingFoundationVersion,
  DataUnderstandingLifecycle,
  DataUnderstandingOwnership,
} from "./dataUnderstandingFoundation.ts";
import { DataUnderstandingSubjectRegistry } from "./dataUnderstandingSubjectRegistry.ts";
import { DataUnderstandingCandidateRegistry } from "./dataUnderstandingCandidateRegistry.ts";
import { DataUnderstandingEvidenceRegistry } from "./dataUnderstandingEvidenceRegistry.ts";
import { DataUnderstandingClarificationRegistry } from "./dataUnderstandingClarificationRegistry.ts";
import {
  DATA_UNDERSTANDING_PUBLIC_API_NAMES,
  DATA_UNDERSTANDING_REGISTRY_IDENTITY,
  DATA_UNDERSTANDING_REGISTRY_VERSION,
  DataUnderstandingRegistryManifest,
} from "./dataUnderstandingRegistryManifest.ts";
import type {
  AmbiguityLevelRegistryEntry,
  LifecycleStateRegistryEntry,
  ProcessingPolicyRegistryEntry,
  PublicApiRegistryEntry,
  RegistryEntryIdentity,
  ResultStatusRegistryEntry,
  ScopeRegistryEntry,
  ValidationResultStatusRegistryEntry,
} from "./dataUnderstandingRegistryTypes.ts";

const OWNER = DATA_UNDERSTANDING_REGISTRY_IDENTITY.owner;
const SOURCE_PHASE = "DKL-3:2";

const toKebab = (value: string): string =>
  value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const makeIdentity = (
  kind: RegistryEntryIdentity["registryEntryKind"],
  prefix: string,
  name: string,
): RegistryEntryIdentity =>
  Object.freeze({
    registryEntryId: `${prefix}-${toKebab(name)}`,
    registryEntryKind: kind,
    registryEntryName: name,
    owner: OWNER,
    sourcePhase: SOURCE_PHASE,
    metadataOnly: true as const,
    immutable: true as const,
  });

const AMBIGUITY_ENTRIES: readonly AmbiguityLevelRegistryEntry[] = Object.freeze(
  DataUnderstandingContracts.ambiguityLevels.map((ambiguityLevel, ordinal) =>
    Object.freeze({
      identity: makeIdentity("AmbiguityLevel", "du-ambiguity", ambiguityLevel),
      ambiguityLevel,
      ordinal,
      blocking: ambiguityLevel === "Blocking",
    }),
  ),
);

const LIFECYCLE_ENTRIES: readonly LifecycleStateRegistryEntry[] = Object.freeze(
  DataUnderstandingLifecycle.states.map((state, ordinal) =>
    Object.freeze({
      identity: makeIdentity("LifecycleState", "du-lifecycle", state),
      state,
      ordinal,
    }),
  ),
);

const SCOPE_ENTRIES: readonly ScopeRegistryEntry[] = Object.freeze(
  DataUnderstandingContracts.understandingScopes.map((scope) =>
    Object.freeze({
      identity: makeIdentity("UnderstandingScope", "du-scope", scope),
      scope,
    }),
  ),
);

const RESULT_STATUS_ENTRIES: readonly ResultStatusRegistryEntry[] = Object.freeze(
  DataUnderstandingContracts.resultStatuses.map((resultStatus) =>
    Object.freeze({
      identity: makeIdentity("ResultStatus", "du-result-status", resultStatus),
      resultStatus,
    }),
  ),
);

const VALIDATION_STATUS_ENTRIES: readonly ValidationResultStatusRegistryEntry[] = Object.freeze(
  (["Valid", "Invalid", "Blocked"] as const).map((validationStatus) =>
    Object.freeze({
      identity: makeIdentity(
        "ValidationResultStatus",
        "du-validation-status",
        validationStatus,
      ),
      validationStatus,
    }),
  ),
);

const POLICY_ENTRIES: readonly ProcessingPolicyRegistryEntry[] = Object.freeze(
  Object.entries(DataUnderstandingContracts.processingPolicies).map(([policyKey, policyValue]) =>
    Object.freeze({
      identity: makeIdentity("ProcessingPolicy", "du-policy", policyKey),
      policyKey,
      policyValue,
    }),
  ),
);

const PUBLIC_API_ENTRIES: readonly PublicApiRegistryEntry[] = Object.freeze(
  DATA_UNDERSTANDING_PUBLIC_API_NAMES.map((apiName) =>
    Object.freeze({
      identity: makeIdentity("PublicApi", "du-public-api", apiName),
      apiName,
      apiKind:
        apiName === "DataUnderstandingRegistryVersion"
          ? ("ImmutableValue" as const)
          : ("ImmutableObject" as const),
    }),
  ),
);

/** The stable registry version. */
export const DataUnderstandingRegistryVersion: string = DATA_UNDERSTANDING_REGISTRY_VERSION;

/** The stable registry identity. */
export const DataUnderstandingRegistryIdentity = DATA_UNDERSTANDING_REGISTRY_IDENTITY;

/** Canonical immutable Data Understanding Registry aggregate. */
export const DataUnderstandingRegistry = Object.freeze({
  identity: DATA_UNDERSTANDING_REGISTRY_IDENTITY,
  version: DATA_UNDERSTANDING_REGISTRY_VERSION,
  subjects: DataUnderstandingSubjectRegistry,
  candidates: DataUnderstandingCandidateRegistry,
  evidence: DataUnderstandingEvidenceRegistry,
  clarifications: DataUnderstandingClarificationRegistry,
  ambiguityLevels: Object.freeze({
    kind: "AmbiguityLevelRegistry",
    entries: AMBIGUITY_ENTRIES,
    entryCount: AMBIGUITY_ENTRIES.length,
  }),
  lifecycleStates: Object.freeze({
    kind: "LifecycleStateRegistry",
    entries: LIFECYCLE_ENTRIES,
    entryCount: LIFECYCLE_ENTRIES.length,
  }),
  understandingScopes: Object.freeze({
    kind: "UnderstandingScopeRegistry",
    entries: SCOPE_ENTRIES,
    entryCount: SCOPE_ENTRIES.length,
  }),
  resultStatuses: Object.freeze({
    kind: "ResultStatusRegistry",
    entries: RESULT_STATUS_ENTRIES,
    entryCount: RESULT_STATUS_ENTRIES.length,
  }),
  validationResultStatuses: Object.freeze({
    kind: "ValidationResultStatusRegistry",
    entries: VALIDATION_STATUS_ENTRIES,
    entryCount: VALIDATION_STATUS_ENTRIES.length,
  }),
  processingPolicies: Object.freeze({
    kind: "ProcessingPolicyRegistry",
    entries: POLICY_ENTRIES,
    entryCount: POLICY_ENTRIES.length,
  }),
  publicApis: Object.freeze({
    kind: "PublicApiRegistry",
    entries: PUBLIC_API_ENTRIES,
    entryCount: PUBLIC_API_ENTRIES.length,
  }),
  ownership: DataUnderstandingOwnership,
  boundaries: DataUnderstandingBoundaries,
  dependencies: Object.freeze({
    dkl2PublicIndex: Object.freeze({
      module: "dataSourceKnowledgeRegistryPublicIndex.ts",
      version: DataSourceKnowledgeRegistryPublicIndexVersion,
    }),
    dkl31Foundation: Object.freeze({
      module: "dataUnderstandingFoundation.ts",
      version: DataUnderstandingFoundationVersion,
      readyForRegistry: DataUnderstandingFoundation.readiness.ReadyForRegistry === true,
    }),
    pipelineUnderstandingPlatform: Object.freeze({
      module: "pipelineUnderstandingPlatform.ts",
      readyForDKL3Intake:
        PipelineUnderstandingPlatform.readiness.ReadyForDKL3Intake === true,
    }),
    forbidden: Object.freeze([
      "DKL-3:3+",
      "DKL-4",
      "Engine",
      "Advisor",
      "Scene",
      "Business Objects",
      "Persistence",
      "AI",
      "Database",
      "Parser internals",
      "Pipeline internals",
      "UI",
      "External packages",
    ]),
  }),
  manifest: DataUnderstandingRegistryManifest,
  readiness: Object.freeze({
    RegistryComplete: true,
    FoundationRegistered: true,
    MetadataOnly: true,
    RegistryOnly: true,
    Deterministic: true,
    Immutable: true,
    SemanticUnderstandingForbidden: true,
    CandidateGenerationForbidden: true,
    BusinessObjectCreationForbidden: true,
    PersistenceForbidden: true,
    AIFree: true,
    EngineFree: true,
    ReadyForModel: true,
  }),
  nextPhase: "DKL-3:3 — Data Understanding Model",
  metadataOnly: true,
  registryOnly: true,
  immutable: true,
});

export {
  DataUnderstandingSubjectRegistry,
  DataUnderstandingCandidateRegistry,
  DataUnderstandingEvidenceRegistry,
  DataUnderstandingClarificationRegistry,
  DataUnderstandingRegistryManifest,
};
