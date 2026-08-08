/**
 * DRI-1:3 — Director Runtime Integration Mapping
 *
 * Pure, explicit-rule resolution from valid Runtime contracts to abstract
 * Director integration mappings. No business interpretation or execution.
 */

import {
  createDirectorRuntimeIntegrationMappingContract,
  createDirectorRuntimeSnapshotContract,
  createDirectorRuntimeSourceContract,
  directorRuntimeIntegrationContractsIdentity,
  directorRuntimeIntegrationContractsMetadata,
  isDirectorRuntimeIntegrationValue,
  isDirectorRuntimeSourceContract,
  type DirectorRuntimeIntegrationMappingContract,
  type DirectorRuntimeIntegrationPayload,
  type DirectorRuntimeSourceContract,
  type DirectorRuntimeTargetContract,
} from "./directorRuntimeIntegrationContracts.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeIntegrationMappingIdentity =
  "DRI-1:3/DirectorRuntimeIntegrationMapping" as const;
export const directorRuntimeIntegrationMappingVersion = "1.3.0" as const;
export const directorRuntimeIntegrationMappingNamespace =
  "nexora.dri.runtime.integration.mapping" as const;
export const directorRuntimeIntegrationMappingUpstream =
  directorRuntimeIntegrationContractsIdentity;

export const directorRuntimeIntegrationMappingMetadata = Object.freeze({
  identity: directorRuntimeIntegrationMappingIdentity,
  version: directorRuntimeIntegrationMappingVersion,
  namespace: directorRuntimeIntegrationMappingNamespace,
  layer: "DRI" as const,
  phase: "DRI-1" as const,
  stage: "Mapping" as const,
  status: "MappingReady" as const,
  upstream: directorRuntimeIntegrationMappingUpstream,
  direction: directorRuntimeIntegrationContractsMetadata.direction,
  authority: directorRuntimeIntegrationContractsMetadata.authority,
});

// ─── Mapping contracts ─────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_MAPPING_INTENT_KINDS = Object.freeze([
  "represent",
  "associate",
  "focus",
  "compose",
  "expose",
  "suppress",
  "annotate",
  "indicate",
] as const);

export type DirectorRuntimeMappingIntentKind =
  (typeof DIRECTOR_RUNTIME_MAPPING_INTENT_KINDS)[number];

export const DIRECTOR_RUNTIME_MAPPING_RESOLUTION_STATUSES = Object.freeze([
  "resolved",
  "unresolved",
  "ambiguous",
  "unsupported",
] as const);

export type DirectorRuntimeMappingResolutionStatus =
  (typeof DIRECTOR_RUNTIME_MAPPING_RESOLUTION_STATUSES)[number];

type SourceKind = DirectorRuntimeSourceContract["sourceKind"];
type TargetKind = DirectorRuntimeTargetContract["targetKind"];

export interface DirectorRuntimeMappingRule {
  readonly ruleId: string;
  readonly sourceKind: SourceKind;
  readonly targetKind: TargetKind;
  readonly targetId: string;
  readonly intentKind: DirectorRuntimeMappingIntentKind;
}

export interface DirectorRuntimeMappingRequest {
  readonly requestId: string;
  readonly source: DirectorRuntimeSourceContract;
  readonly payload: DirectorRuntimeIntegrationPayload;
  readonly targetKind?: TargetKind;
  readonly requireUniqueTarget?: boolean;
}

export interface DirectorRuntimeMappingResolution {
  readonly requestId: string;
  readonly status: DirectorRuntimeMappingResolutionStatus;
  readonly mappings: readonly DirectorRuntimeIntegrationMappingContract[];
  readonly matchedRuleIds: readonly string[];
}

function hasOpaqueId(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

export function isDirectorRuntimeMappingIntentKind(
  value: unknown,
): value is DirectorRuntimeMappingIntentKind {
  return (DIRECTOR_RUNTIME_MAPPING_INTENT_KINDS as readonly unknown[])
    .includes(value);
}

export function isDirectorRuntimeMappingResolutionStatus(
  value: unknown,
): value is DirectorRuntimeMappingResolutionStatus {
  return (DIRECTOR_RUNTIME_MAPPING_RESOLUTION_STATUSES as readonly unknown[])
    .includes(value);
}

export function createDirectorRuntimeMappingRule(
  input: DirectorRuntimeMappingRule,
): DirectorRuntimeMappingRule {
  if (!hasOpaqueId(input.ruleId) || !hasOpaqueId(input.targetId)) {
    throw new TypeError("ruleId and targetId must be opaque identifiers");
  }
  const source = createDirectorRuntimeSourceContract({
    sourceKind: input.sourceKind,
    sourceId: input.ruleId,
    runtimeRevision: input.ruleId,
  });
  const mapping = createDirectorRuntimeIntegrationMappingContract({
    mappingId: input.ruleId,
    source,
    target: { targetKind: input.targetKind, targetId: input.targetId },
  });
  if (!isDirectorRuntimeMappingIntentKind(input.intentKind)) {
    throw new TypeError("intentKind must be a known mapping intent");
  }
  return Object.freeze({
    ruleId: input.ruleId,
    sourceKind: mapping.source.sourceKind,
    targetKind: mapping.target.targetKind,
    targetId: mapping.target.targetId,
    intentKind: input.intentKind,
  });
}

export function createDirectorRuntimeMappingRequest(
  input: DirectorRuntimeMappingRequest,
): DirectorRuntimeMappingRequest {
  if (!hasOpaqueId(input.requestId)) {
    throw new TypeError("requestId must be an opaque identifier");
  }
  if (!isDirectorRuntimeSourceContract(input.source)) {
    throw new TypeError("source must satisfy the Runtime source contract");
  }
  if (!isDirectorRuntimeIntegrationValue(input.payload)) {
    throw new TypeError("payload must contain deterministic plain values");
  }
  if (input.targetKind !== undefined) {
    createDirectorRuntimeIntegrationMappingContract({
      mappingId: input.requestId,
      source: input.source,
      target: { targetKind: input.targetKind, targetId: input.requestId },
    });
  }
  const snapshot = createDirectorRuntimeSnapshotContract({
    source: input.source,
    revision: input.source.runtimeRevision,
    payload: input.payload,
  });
  return Object.freeze({
    requestId: input.requestId,
    source: snapshot.source,
    payload: snapshot.payload,
    ...(input.targetKind !== undefined
      ? { targetKind: input.targetKind }
      : {}),
    ...(input.requireUniqueTarget !== undefined
      ? { requireUniqueTarget: input.requireUniqueTarget === true }
      : {}),
  });
}

export function resolveDirectorRuntimeMatchingRules(
  request: DirectorRuntimeMappingRequest,
  rules: readonly DirectorRuntimeMappingRule[],
): readonly DirectorRuntimeMappingRule[] {
  const validRequest = createDirectorRuntimeMappingRequest(request);
  return Object.freeze(
    rules
      .map((rule) => createDirectorRuntimeMappingRule(rule))
      .filter(
        (rule) =>
          rule.sourceKind === validRequest.source.sourceKind &&
          (validRequest.targetKind === undefined ||
            rule.targetKind === validRequest.targetKind),
      ),
  );
}

export function canMapDirectorRuntimeSourceToTarget(
  sourceKind: SourceKind,
  targetKind: TargetKind,
  rules: readonly DirectorRuntimeMappingRule[],
): boolean {
  return rules.some((candidate) => {
    const rule = createDirectorRuntimeMappingRule(candidate);
    return rule.sourceKind === sourceKind && rule.targetKind === targetKind;
  });
}

export function resolveDirectorRuntimeMapping(
  request: DirectorRuntimeMappingRequest,
  rules: readonly DirectorRuntimeMappingRule[] =
    directorRuntimeCanonicalMappingRules,
): DirectorRuntimeMappingResolution {
  const validRequest = createDirectorRuntimeMappingRequest(request);
  const validatedRules = Object.freeze(
    rules.map((rule) => createDirectorRuntimeMappingRule(rule)),
  );
  const sourceRules = validatedRules.filter(
    (rule) => rule.sourceKind === validRequest.source.sourceKind,
  );
  const matches = sourceRules.filter(
    (rule) =>
      validRequest.targetKind === undefined ||
      rule.targetKind === validRequest.targetKind,
  );

  let status: DirectorRuntimeMappingResolutionStatus;
  if (sourceRules.length === 0) status = "unresolved";
  else if (matches.length === 0) status = "unsupported";
  else if (validRequest.requireUniqueTarget === true && matches.length > 1) {
    status = "ambiguous";
  } else status = "resolved";

  const selectedRules = status === "resolved" ? matches : [];
  return Object.freeze({
    requestId: validRequest.requestId,
    status,
    mappings: Object.freeze(
      selectedRules.map((rule) =>
        createDirectorRuntimeIntegrationMappingContract({
          mappingId: rule.ruleId,
          source: validRequest.source,
          target: {
            targetKind: rule.targetKind,
            targetId: rule.targetId,
          },
        }),
      ),
    ),
    matchedRuleIds: Object.freeze(matches.map((rule) => rule.ruleId)),
  });
}

// ─── Ordered registries ────────────────────────────────────────────────────

export const directorRuntimeCanonicalMappingRules = Object.freeze([
  createDirectorRuntimeMappingRule({
    ruleId: "runtime-object:node",
    sourceKind: "runtime-object",
    targetKind: "node",
    targetId: "director:node",
    intentKind: "represent",
  }),
  createDirectorRuntimeMappingRule({
    ruleId: "runtime-goal:focus",
    sourceKind: "runtime-goal",
    targetKind: "focus",
    targetId: "director:focus",
    intentKind: "focus",
  }),
  createDirectorRuntimeMappingRule({
    ruleId: "runtime-pack:composition",
    sourceKind: "runtime-pack",
    targetKind: "composition",
    targetId: "director:composition",
    intentKind: "compose",
  }),
] as const);

export const directorRuntimeCanonicalMappingRuleCount =
  directorRuntimeCanonicalMappingRules.length;

export function getDirectorRuntimeMappingRules():
  readonly DirectorRuntimeMappingRule[] {
  return directorRuntimeCanonicalMappingRules;
}

export interface DirectorRuntimeMappingCapabilityRegistryEntry {
  readonly order: number;
  readonly capability: string;
}

export const directorRuntimeMappingCapabilityRegistry = Object.freeze([
  Object.freeze({ order: 1, capability: "Mapping Intent" }),
  Object.freeze({ order: 2, capability: "Mapping Resolution" }),
  Object.freeze({ order: 3, capability: "Mapping Rule" }),
  Object.freeze({ order: 4, capability: "Mapping Request" }),
  Object.freeze({ order: 5, capability: "Source-to-Target Capability" }),
  Object.freeze({ order: 6, capability: "One-to-One Mapping" }),
  Object.freeze({ order: 7, capability: "One-to-Many Mapping" }),
  Object.freeze({ order: 8, capability: "Ambiguity Handling" }),
  Object.freeze({ order: 9, capability: "Deterministic Resolution" }),
  Object.freeze({ order: 10, capability: "Runtime Authority" }),
] as const satisfies readonly DirectorRuntimeMappingCapabilityRegistryEntry[]);

export const directorRuntimeMappingCapabilityRegistryCount =
  directorRuntimeMappingCapabilityRegistry.length;

export function getDirectorRuntimeMappingCapabilityRegistry():
  readonly DirectorRuntimeMappingCapabilityRegistryEntry[] {
  return directorRuntimeMappingCapabilityRegistry;
}

export function verifyDirectorRuntimeIntegrationMapping(): boolean {
  return (
    directorRuntimeIntegrationMappingMetadata.identity ===
      "DRI-1:3/DirectorRuntimeIntegrationMapping" &&
    directorRuntimeIntegrationMappingMetadata.upstream ===
      directorRuntimeIntegrationContractsIdentity &&
    directorRuntimeIntegrationMappingMetadata.direction ===
      "runtime-to-director" &&
    directorRuntimeCanonicalMappingRuleCount ===
      directorRuntimeCanonicalMappingRules.length &&
    directorRuntimeMappingCapabilityRegistryCount ===
      directorRuntimeMappingCapabilityRegistry.length
  );
}
