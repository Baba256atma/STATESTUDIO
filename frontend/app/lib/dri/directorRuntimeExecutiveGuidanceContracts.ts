/**
 * DRI-7:2 — Director Runtime Executive Guidance Contracts.
 *
 * Formal runtime contracts for how executive guidance requests, candidates,
 * delivery semantics, traceability, constraints, and results enter, move
 * through, and exit the semantic guidance runtime.
 *
 * Principle: Foundation defines what guidance IS. Contracts define how
 * guidance ENTERS, MOVES THROUGH, and EXITS the semantic guidance runtime.
 *
 * Contracts only — no resolution, ranking, composition, delivery, or rendering.
 */

import {
  createDirectorRuntimeExecutiveGuidanceItem,
  createDirectorRuntimeExecutiveGuidancePath,
  createDirectorRuntimeExecutiveGuidanceSource,
  createDirectorRuntimeExecutiveGuidanceTarget,
  directorRuntimeExecutiveGuidanceFoundationIdentity,
  isDirectorRuntimeExecutiveGuidanceImportance,
  isDirectorRuntimeExecutiveGuidanceIntent,
  isDirectorRuntimeExecutiveGuidanceKind,
  isDirectorRuntimeExecutiveGuidanceSourceKind,
  isDirectorRuntimeExecutiveGuidanceTargetKind,
  isDirectorRuntimeExecutiveGuidanceUrgency,
  type DirectorRuntimeExecutiveGuidanceImportance,
  type DirectorRuntimeExecutiveGuidanceIntent,
  type DirectorRuntimeExecutiveGuidanceItem,
  type DirectorRuntimeExecutiveGuidanceKind,
  type DirectorRuntimeExecutiveGuidancePath,
  type DirectorRuntimeExecutiveGuidanceSource,
  type DirectorRuntimeExecutiveGuidanceTarget,
  type DirectorRuntimeExecutiveGuidanceUrgency,
} from "@/app/lib/dri/directorRuntimeExecutiveGuidanceFoundation";

export type {
  DirectorRuntimeExecutiveGuidanceImportance,
  DirectorRuntimeExecutiveGuidanceIntent,
  DirectorRuntimeExecutiveGuidanceItem,
  DirectorRuntimeExecutiveGuidanceKind,
  DirectorRuntimeExecutiveGuidancePath,
  DirectorRuntimeExecutiveGuidanceSource,
  DirectorRuntimeExecutiveGuidanceTarget,
  DirectorRuntimeExecutiveGuidanceUrgency,
};

export {
  createDirectorRuntimeExecutiveGuidanceItem,
  createDirectorRuntimeExecutiveGuidancePath,
  createDirectorRuntimeExecutiveGuidanceSource,
  createDirectorRuntimeExecutiveGuidanceTarget,
  isDirectorRuntimeExecutiveGuidanceImportance,
  isDirectorRuntimeExecutiveGuidanceIntent,
  isDirectorRuntimeExecutiveGuidanceKind,
  isDirectorRuntimeExecutiveGuidanceSourceKind,
  isDirectorRuntimeExecutiveGuidanceTargetKind,
  isDirectorRuntimeExecutiveGuidanceUrgency,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeExecutiveGuidanceContractsIdentity =
  "DRI-7:2/DirectorRuntimeExecutiveGuidanceContracts" as const;
export const directorRuntimeExecutiveGuidanceContractsVersion =
  "7.2.0" as const;
export const directorRuntimeExecutiveGuidanceContractsNamespace =
  "nexora.dri.executive-guidance.contracts" as const;
export const directorRuntimeExecutiveGuidanceContractsUpstream =
  directorRuntimeExecutiveGuidanceFoundationIdentity;

export const directorRuntimeExecutiveGuidanceContractsCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeExecutiveGuidanceContractsIdentity,
    version: directorRuntimeExecutiveGuidanceContractsVersion,
    namespace: directorRuntimeExecutiveGuidanceContractsNamespace,
    upstream: directorRuntimeExecutiveGuidanceContractsUpstream,
  });

// ─── Contract principle ─────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_PRINCIPLE =
  "Foundation defines what guidance IS. Contracts define how guidance ENTERS, MOVES THROUGH, and EXITS the semantic guidance runtime." as const;

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_BOUNDARY =
  Object.freeze({
    foundationAuthority: "DRI-7:1" as const,
    contractsAuthority: "DRI-7:2" as const,
    resolutionAuthority: "DRI-7:3+" as const,
    attentionAuthority: "DRI-6" as const,
    doesNotResolveGuidance: true as const,
    doesNotRankCandidates: true as const,
    doesNotComposeGuidance: true as const,
    doesNotDeliverGuidance: true as const,
    doesNotRecalculateAttention: true as const,
    preservesCallerCandidateOrder: true as const,
    consumesFoundationOnly: true as const,
  });

// ─── Eligibility ────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ELIGIBILITY_VALUES =
  Object.freeze([
    "eligible",
    "suppressed",
    "deferred",
    "ineligible",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceEligibility =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ELIGIBILITY_VALUES)[number];

// ─── Interruption ───────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTERRUPTION_VALUES =
  Object.freeze([
    "non-interruptive",
    "contextual",
    "interruptive",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceInterruption =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTERRUPTION_VALUES)[number];

// ─── Persistence (metadata only — no timers) ────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PERSISTENCE_VALUES =
  Object.freeze([
    "transient",
    "context-bound",
    "focus-bound",
    "persistent",
  ] as const);
export type DirectorRuntimeExecutiveGuidancePersistence =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PERSISTENCE_VALUES)[number];

// ─── Context kinds ──────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTEXT_KINDS = Object.freeze([
  "goal",
  "object",
  "problem",
  "scenario",
  "decision",
  "execution",
  "workspace",
  "lens",
] as const);
export type DirectorRuntimeExecutiveGuidanceContextKind =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTEXT_KINDS)[number];

// ─── Relationship kinds ─────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RELATIONSHIP_KINDS =
  Object.freeze([
    "supports",
    "explains",
    "causes",
    "depends-on",
    "conflicts-with",
    "compares-with",
    "impacts",
    "derived-from",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceRelationshipKind =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RELATIONSHIP_KINDS)[number];

// ─── Contract status ────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_STATUSES =
  Object.freeze(["accepted", "rejected"] as const);
export type DirectorRuntimeExecutiveGuidanceContractStatus =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_STATUSES)[number];

// ─── Structural categories ──────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_CATEGORIES =
  Object.freeze([
    "request",
    "candidate",
    "constraints",
    "context-reference",
    "provenance",
    "relationship",
    "path",
    "delivery-policy",
    "envelope",
    "result",
    "issue",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceContractCategory =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_CATEGORIES)[number];

// ─── Issue codes (machine-readable; stable order) ───────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_ISSUE_CODES =
  Object.freeze([
    "invalid-request",
    "invalid-candidate",
    "invalid-constraints",
    "invalid-context-reference",
    "invalid-provenance",
    "invalid-relationship",
    "invalid-path",
    "invalid-delivery-policy",
    "invalid-envelope",
    "invalid-eligibility",
    "invalid-interruption",
    "invalid-persistence",
    "missing-identifier",
    "invalid-structure",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceContractIssueCode =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_ISSUE_CODES)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeExecutiveGuidanceContextReference {
  readonly contextKind: DirectorRuntimeExecutiveGuidanceContextKind;
  readonly contextId: string;
}

export interface DirectorRuntimeExecutiveGuidanceConstraints {
  readonly preserveCurrentFocus?: boolean;
  readonly preserveExecutiveContext?: boolean;
  readonly allowInterruption?: boolean;
  readonly allowComparison?: boolean;
  readonly allowPathExplanation?: boolean;
  readonly maximumGuidanceItems?: number;
}

export interface DirectorRuntimeExecutiveGuidanceRequest {
  readonly requestId: string;
  readonly subjects: readonly DirectorRuntimeExecutiveGuidanceTarget[];
  readonly attentionReferences: readonly DirectorRuntimeExecutiveGuidanceSource[];
  readonly intent?: DirectorRuntimeExecutiveGuidanceIntent;
  readonly constraints: DirectorRuntimeExecutiveGuidanceConstraints;
  readonly context?: DirectorRuntimeExecutiveGuidanceContextReference;
}

export interface DirectorRuntimeExecutiveGuidanceProvenance {
  readonly sourceReferences: readonly DirectorRuntimeExecutiveGuidanceSource[];
  readonly derivedFromGuidanceIds: readonly string[];
  readonly rationale?: string;
}

export interface DirectorRuntimeExecutiveGuidanceCandidate {
  readonly candidateId: string;
  readonly guidance: DirectorRuntimeExecutiveGuidanceItem;
  readonly eligibility: DirectorRuntimeExecutiveGuidanceEligibility;
  readonly provenance: DirectorRuntimeExecutiveGuidanceProvenance;
  readonly constraints: DirectorRuntimeExecutiveGuidanceConstraints;
}

/**
 * Formalized semantic relationship for guidance processing.
 * Distinct from the simpler DRI-7:1 path-adjacent relationship shape.
 */
export interface DirectorRuntimeExecutiveGuidanceContractRelationship {
  readonly relationshipId: string;
  readonly relationshipKind: DirectorRuntimeExecutiveGuidanceRelationshipKind;
  readonly sourceTarget: DirectorRuntimeExecutiveGuidanceTarget;
  readonly targetTarget: DirectorRuntimeExecutiveGuidanceTarget;
  readonly rationale?: string;
}

/** Runtime path contract — ordered semantic sequence with provenance. */
export interface DirectorRuntimeExecutiveGuidancePathContract {
  readonly pathId: string;
  readonly targets: readonly DirectorRuntimeExecutiveGuidanceTarget[];
  readonly meaning?: string;
  readonly relationshipIds?: readonly string[];
  readonly provenance: DirectorRuntimeExecutiveGuidanceProvenance;
}

export interface DirectorRuntimeExecutiveGuidanceDeliveryPolicy {
  readonly interruption: DirectorRuntimeExecutiveGuidanceInterruption;
  readonly persistence: DirectorRuntimeExecutiveGuidancePersistence;
  readonly preserveFocus: boolean;
  readonly preserveContext: boolean;
}

export interface DirectorRuntimeExecutiveGuidanceEnvelope {
  readonly envelopeId: string;
  readonly request: DirectorRuntimeExecutiveGuidanceRequest;
  readonly candidates: readonly DirectorRuntimeExecutiveGuidanceCandidate[];
  readonly relationships: readonly DirectorRuntimeExecutiveGuidanceContractRelationship[];
  readonly paths: readonly DirectorRuntimeExecutiveGuidancePathContract[];
  readonly deliveryPolicy: DirectorRuntimeExecutiveGuidanceDeliveryPolicy;
}

export interface DirectorRuntimeExecutiveGuidanceContractIssue {
  readonly code: string;
  readonly message: string;
  readonly path?: string;
}

export interface DirectorRuntimeExecutiveGuidanceContractResult<T> {
  readonly status: DirectorRuntimeExecutiveGuidanceContractStatus;
  readonly value: T | null;
  readonly issues: readonly DirectorRuntimeExecutiveGuidanceContractIssue[];
}

export const DIRECTOR_RUNTIME_EMPTY_EXECUTIVE_GUIDANCE_CONSTRAINTS =
  Object.freeze({}) satisfies DirectorRuntimeExecutiveGuidanceConstraints;

export const DIRECTOR_RUNTIME_EMPTY_EXECUTIVE_GUIDANCE_PROVENANCE =
  Object.freeze({
    sourceReferences: Object.freeze(
      [],
    ) as readonly DirectorRuntimeExecutiveGuidanceSource[],
    derivedFromGuidanceIds: Object.freeze([]) as readonly string[],
  }) satisfies DirectorRuntimeExecutiveGuidanceProvenance;

// ─── Vocabulary membership ──────────────────────────────────────────────────

export function isDirectorRuntimeExecutiveGuidanceEligibility(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceEligibility {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ELIGIBILITY_VALUES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExecutiveGuidanceInterruption(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceInterruption {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTERRUPTION_VALUES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExecutiveGuidancePersistence(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidancePersistence {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PERSISTENCE_VALUES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExecutiveGuidanceContextKind(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceContextKind {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTEXT_KINDS as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExecutiveGuidanceRelationshipKind(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceRelationshipKind {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RELATIONSHIP_KINDS as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExecutiveGuidanceContractStatus(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceContractStatus {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_STATUSES as readonly unknown[]
  ).includes(value);
}

// ─── Structural helpers ─────────────────────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isGuidanceTarget(value: unknown): value is DirectorRuntimeExecutiveGuidanceTarget {
  if (!isPlainObject(value)) return false;
  return (
    isDirectorRuntimeExecutiveGuidanceTargetKind(value.targetKind) &&
    isNonEmptyString(value.targetId) &&
    (value.label === undefined || typeof value.label === "string")
  );
}

function isGuidanceSource(value: unknown): value is DirectorRuntimeExecutiveGuidanceSource {
  if (!isPlainObject(value)) return false;
  return (
    isDirectorRuntimeExecutiveGuidanceSourceKind(value.sourceKind) &&
    isNonEmptyString(value.sourceId)
  );
}

function isGuidanceItem(value: unknown): value is DirectorRuntimeExecutiveGuidanceItem {
  if (!isPlainObject(value)) return false;
  return (
    isNonEmptyString(value.guidanceId) &&
    isDirectorRuntimeExecutiveGuidanceKind(value.guidanceKind) &&
    isGuidanceTarget(value.target) &&
    isDirectorRuntimeExecutiveGuidanceImportance(value.importance) &&
    isDirectorRuntimeExecutiveGuidanceUrgency(value.urgency) &&
    isDirectorRuntimeExecutiveGuidanceIntent(value.intent) &&
    isGuidanceSource(value.source) &&
    (value.rationale === undefined || typeof value.rationale === "string")
  );
}

// ─── Constructors ───────────────────────────────────────────────────────────

export function createDirectorRuntimeExecutiveGuidanceConstraints(
  input: DirectorRuntimeExecutiveGuidanceConstraints = {},
): DirectorRuntimeExecutiveGuidanceConstraints {
  const constraints: DirectorRuntimeExecutiveGuidanceConstraints = {};
  if (input.preserveCurrentFocus !== undefined) {
    (constraints as { preserveCurrentFocus: boolean }).preserveCurrentFocus =
      input.preserveCurrentFocus;
  }
  if (input.preserveExecutiveContext !== undefined) {
    (constraints as { preserveExecutiveContext: boolean }).preserveExecutiveContext =
      input.preserveExecutiveContext;
  }
  if (input.allowInterruption !== undefined) {
    (constraints as { allowInterruption: boolean }).allowInterruption =
      input.allowInterruption;
  }
  if (input.allowComparison !== undefined) {
    (constraints as { allowComparison: boolean }).allowComparison =
      input.allowComparison;
  }
  if (input.allowPathExplanation !== undefined) {
    (constraints as { allowPathExplanation: boolean }).allowPathExplanation =
      input.allowPathExplanation;
  }
  if (input.maximumGuidanceItems !== undefined) {
    (constraints as { maximumGuidanceItems: number }).maximumGuidanceItems =
      input.maximumGuidanceItems;
  }
  return Object.freeze(constraints);
}

export function createDirectorRuntimeExecutiveGuidanceContextReference(
  input: DirectorRuntimeExecutiveGuidanceContextReference,
): DirectorRuntimeExecutiveGuidanceContextReference {
  return Object.freeze({
    contextKind: input.contextKind,
    contextId: input.contextId,
  });
}

export function createDirectorRuntimeExecutiveGuidanceProvenance(
  input: DirectorRuntimeExecutiveGuidanceProvenance,
): DirectorRuntimeExecutiveGuidanceProvenance {
  const provenance: DirectorRuntimeExecutiveGuidanceProvenance = {
    sourceReferences: Object.freeze(
      input.sourceReferences.map((entry) =>
        createDirectorRuntimeExecutiveGuidanceSource(entry)),
    ),
    derivedFromGuidanceIds: Object.freeze([...input.derivedFromGuidanceIds]),
  };
  if (input.rationale !== undefined) {
    return Object.freeze({ ...provenance, rationale: input.rationale });
  }
  return Object.freeze(provenance);
}

export function createDirectorRuntimeExecutiveGuidanceRequest(
  input: DirectorRuntimeExecutiveGuidanceRequest,
): DirectorRuntimeExecutiveGuidanceRequest {
  const request: DirectorRuntimeExecutiveGuidanceRequest = {
    requestId: input.requestId,
    subjects: Object.freeze(
      input.subjects.map((entry) =>
        createDirectorRuntimeExecutiveGuidanceTarget(entry)),
    ),
    attentionReferences: Object.freeze(
      input.attentionReferences.map((entry) =>
        createDirectorRuntimeExecutiveGuidanceSource(entry)),
    ),
    constraints: createDirectorRuntimeExecutiveGuidanceConstraints(
      input.constraints,
    ),
  };
  let result = request;
  if (input.intent !== undefined) {
    result = { ...result, intent: input.intent };
  }
  if (input.context !== undefined) {
    result = {
      ...result,
      context: createDirectorRuntimeExecutiveGuidanceContextReference(
        input.context,
      ),
    };
  }
  return Object.freeze(result);
}

export function createDirectorRuntimeExecutiveGuidanceCandidate(
  input: DirectorRuntimeExecutiveGuidanceCandidate,
): DirectorRuntimeExecutiveGuidanceCandidate {
  return Object.freeze({
    candidateId: input.candidateId,
    guidance: createDirectorRuntimeExecutiveGuidanceItem(input.guidance),
    eligibility: input.eligibility,
    provenance: createDirectorRuntimeExecutiveGuidanceProvenance(
      input.provenance,
    ),
    constraints: createDirectorRuntimeExecutiveGuidanceConstraints(
      input.constraints,
    ),
  });
}

export function createDirectorRuntimeExecutiveGuidanceContractRelationship(
  input: DirectorRuntimeExecutiveGuidanceContractRelationship,
): DirectorRuntimeExecutiveGuidanceContractRelationship {
  const relationship: DirectorRuntimeExecutiveGuidanceContractRelationship = {
    relationshipId: input.relationshipId,
    relationshipKind: input.relationshipKind,
    sourceTarget: createDirectorRuntimeExecutiveGuidanceTarget(
      input.sourceTarget,
    ),
    targetTarget: createDirectorRuntimeExecutiveGuidanceTarget(
      input.targetTarget,
    ),
  };
  if (input.rationale !== undefined) {
    return Object.freeze({ ...relationship, rationale: input.rationale });
  }
  return Object.freeze(relationship);
}

export function createDirectorRuntimeExecutiveGuidancePathContract(
  input: DirectorRuntimeExecutiveGuidancePathContract,
): DirectorRuntimeExecutiveGuidancePathContract {
  const basePath = createDirectorRuntimeExecutiveGuidancePath({
    pathId: input.pathId,
    targets: input.targets,
    meaning: input.meaning,
    relationshipIds: input.relationshipIds,
  });
  return Object.freeze({
    pathId: basePath.pathId,
    targets: basePath.targets,
    ...(basePath.meaning !== undefined ? { meaning: basePath.meaning } : {}),
    ...(basePath.relationshipIds !== undefined
      ? { relationshipIds: basePath.relationshipIds }
      : {}),
    provenance: createDirectorRuntimeExecutiveGuidanceProvenance(
      input.provenance,
    ),
  });
}

export function createDirectorRuntimeExecutiveGuidanceDeliveryPolicy(
  input: DirectorRuntimeExecutiveGuidanceDeliveryPolicy,
): DirectorRuntimeExecutiveGuidanceDeliveryPolicy {
  return Object.freeze({
    interruption: input.interruption,
    persistence: input.persistence,
    preserveFocus: input.preserveFocus,
    preserveContext: input.preserveContext,
  });
}

export function createDirectorRuntimeExecutiveGuidanceEnvelope(
  input: DirectorRuntimeExecutiveGuidanceEnvelope,
): DirectorRuntimeExecutiveGuidanceEnvelope {
  return Object.freeze({
    envelopeId: input.envelopeId,
    request: createDirectorRuntimeExecutiveGuidanceRequest(input.request),
    // Preserve caller-provided candidate order — never sort/rank here.
    candidates: Object.freeze(
      input.candidates.map((entry) =>
        createDirectorRuntimeExecutiveGuidanceCandidate(entry)),
    ),
    relationships: Object.freeze(
      input.relationships.map((entry) =>
        createDirectorRuntimeExecutiveGuidanceContractRelationship(entry)),
    ),
    paths: Object.freeze(
      input.paths.map((entry) =>
        createDirectorRuntimeExecutiveGuidancePathContract(entry)),
    ),
    deliveryPolicy: createDirectorRuntimeExecutiveGuidanceDeliveryPolicy(
      input.deliveryPolicy,
    ),
  });
}

export function createDirectorRuntimeExecutiveGuidanceContractIssue(
  input: DirectorRuntimeExecutiveGuidanceContractIssue,
): DirectorRuntimeExecutiveGuidanceContractIssue {
  if (input.path !== undefined) {
    return Object.freeze({
      code: input.code,
      message: input.message,
      path: input.path,
    });
  }
  return Object.freeze({
    code: input.code,
    message: input.message,
  });
}

export function createDirectorRuntimeExecutiveGuidanceContractResult<T>(
  input: DirectorRuntimeExecutiveGuidanceContractResult<T>,
): DirectorRuntimeExecutiveGuidanceContractResult<T> {
  return Object.freeze({
    status: input.status,
    value: input.value,
    issues: Object.freeze(
      input.issues.map((entry) =>
        createDirectorRuntimeExecutiveGuidanceContractIssue(entry)),
    ),
  });
}

// ─── Structural guards (shape only — not deep semantic validation) ──────────

export function isDirectorRuntimeExecutiveGuidanceConstraints(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceConstraints {
  if (!isPlainObject(value)) return false;
  if (
    value.preserveCurrentFocus !== undefined &&
    typeof value.preserveCurrentFocus !== "boolean"
  ) {
    return false;
  }
  if (
    value.preserveExecutiveContext !== undefined &&
    typeof value.preserveExecutiveContext !== "boolean"
  ) {
    return false;
  }
  if (
    value.allowInterruption !== undefined &&
    typeof value.allowInterruption !== "boolean"
  ) {
    return false;
  }
  if (
    value.allowComparison !== undefined &&
    typeof value.allowComparison !== "boolean"
  ) {
    return false;
  }
  if (
    value.allowPathExplanation !== undefined &&
    typeof value.allowPathExplanation !== "boolean"
  ) {
    return false;
  }
  if (
    value.maximumGuidanceItems !== undefined &&
    (typeof value.maximumGuidanceItems !== "number" ||
      !Number.isFinite(value.maximumGuidanceItems))
  ) {
    return false;
  }
  return true;
}

export function isDirectorRuntimeExecutiveGuidanceContextReference(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceContextReference {
  if (!isPlainObject(value)) return false;
  return (
    isDirectorRuntimeExecutiveGuidanceContextKind(value.contextKind) &&
    isNonEmptyString(value.contextId)
  );
}

export function isDirectorRuntimeExecutiveGuidanceProvenance(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceProvenance {
  if (!isPlainObject(value)) return false;
  if (!Array.isArray(value.sourceReferences)) return false;
  if (!Array.isArray(value.derivedFromGuidanceIds)) return false;
  if (!value.sourceReferences.every(isGuidanceSource)) return false;
  if (!value.derivedFromGuidanceIds.every((id) => typeof id === "string")) {
    return false;
  }
  return value.rationale === undefined || typeof value.rationale === "string";
}

export function isDirectorRuntimeExecutiveGuidanceRequest(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceRequest {
  if (!isPlainObject(value)) return false;
  if (!isNonEmptyString(value.requestId)) return false;
  if (!Array.isArray(value.subjects)) return false;
  if (!Array.isArray(value.attentionReferences)) return false;
  if (!isDirectorRuntimeExecutiveGuidanceConstraints(value.constraints)) {
    return false;
  }
  if (!value.subjects.every(isGuidanceTarget)) return false;
  if (!value.attentionReferences.every(isGuidanceSource)) return false;
  if (
    value.intent !== undefined &&
    !isDirectorRuntimeExecutiveGuidanceIntent(value.intent)
  ) {
    return false;
  }
  if (
    value.context !== undefined &&
    !isDirectorRuntimeExecutiveGuidanceContextReference(value.context)
  ) {
    return false;
  }
  return true;
}

export function isDirectorRuntimeExecutiveGuidanceCandidate(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceCandidate {
  if (!isPlainObject(value)) return false;
  return (
    isNonEmptyString(value.candidateId) &&
    isGuidanceItem(value.guidance) &&
    isDirectorRuntimeExecutiveGuidanceEligibility(value.eligibility) &&
    isDirectorRuntimeExecutiveGuidanceProvenance(value.provenance) &&
    isDirectorRuntimeExecutiveGuidanceConstraints(value.constraints)
  );
}

export function isDirectorRuntimeExecutiveGuidanceContractRelationship(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceContractRelationship {
  if (!isPlainObject(value)) return false;
  return (
    isNonEmptyString(value.relationshipId) &&
    isDirectorRuntimeExecutiveGuidanceRelationshipKind(value.relationshipKind) &&
    isGuidanceTarget(value.sourceTarget) &&
    isGuidanceTarget(value.targetTarget) &&
    (value.rationale === undefined || typeof value.rationale === "string")
  );
}

export function isDirectorRuntimeExecutiveGuidancePathContract(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidancePathContract {
  if (!isPlainObject(value)) return false;
  if (!isNonEmptyString(value.pathId)) return false;
  if (!Array.isArray(value.targets)) return false;
  if (!value.targets.every(isGuidanceTarget)) return false;
  if (!isDirectorRuntimeExecutiveGuidanceProvenance(value.provenance)) {
    return false;
  }
  if (value.meaning !== undefined && typeof value.meaning !== "string") {
    return false;
  }
  if (
    value.relationshipIds !== undefined &&
    (!Array.isArray(value.relationshipIds) ||
      !value.relationshipIds.every((id) => typeof id === "string"))
  ) {
    return false;
  }
  return true;
}

export function isDirectorRuntimeExecutiveGuidanceDeliveryPolicy(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceDeliveryPolicy {
  if (!isPlainObject(value)) return false;
  return (
    isDirectorRuntimeExecutiveGuidanceInterruption(value.interruption) &&
    isDirectorRuntimeExecutiveGuidancePersistence(value.persistence) &&
    typeof value.preserveFocus === "boolean" &&
    typeof value.preserveContext === "boolean"
  );
}

export function isDirectorRuntimeExecutiveGuidanceEnvelope(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceEnvelope {
  if (!isPlainObject(value)) return false;
  return (
    isNonEmptyString(value.envelopeId) &&
    isDirectorRuntimeExecutiveGuidanceRequest(value.request) &&
    Array.isArray(value.candidates) &&
    value.candidates.every(isDirectorRuntimeExecutiveGuidanceCandidate) &&
    Array.isArray(value.relationships) &&
    value.relationships.every(
      isDirectorRuntimeExecutiveGuidanceContractRelationship,
    ) &&
    Array.isArray(value.paths) &&
    value.paths.every(isDirectorRuntimeExecutiveGuidancePathContract) &&
    isDirectorRuntimeExecutiveGuidanceDeliveryPolicy(value.deliveryPolicy)
  );
}

export function isDirectorRuntimeExecutiveGuidanceContractIssue(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceContractIssue {
  if (!isPlainObject(value)) return false;
  return (
    typeof value.code === "string" &&
    typeof value.message === "string" &&
    (value.path === undefined || typeof value.path === "string")
  );
}

export function isDirectorRuntimeExecutiveGuidanceContractResult(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceContractResult<unknown> {
  if (!isPlainObject(value)) return false;
  return (
    isDirectorRuntimeExecutiveGuidanceContractStatus(value.status) &&
    Array.isArray(value.issues) &&
    value.issues.every(isDirectorRuntimeExecutiveGuidanceContractIssue) &&
    ("value" in value)
  );
}

// ─── Invariants ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_INVARIANTS =
  Object.freeze([
    Object.freeze({
      id: "foundation-not-contracts",
      statement:
        "Foundation defines what guidance is; contracts define how it enters, moves, and exits",
    }),
    Object.freeze({
      id: "candidate-not-resolution",
      statement: "candidates are not selected, primary, or resolved guidance",
    }),
    Object.freeze({
      id: "preserve-caller-candidate-order",
      statement: "contracts preserve caller-provided candidate ordering without ranking",
    }),
    Object.freeze({
      id: "no-attention-recalculation",
      statement: "contracts do not score, rank, or recalculate DRI-6 attention",
    }),
    Object.freeze({
      id: "no-guidance-resolution",
      statement: "contracts do not decide primary/secondary/suppressed guidance",
    }),
    Object.freeze({
      id: "eligibility-not-visibility",
      statement: "eligibility is semantic and does not imply UI visibility",
    }),
    Object.freeze({
      id: "interruption-not-presentation",
      statement: "interruption is semantic and does not prescribe visual interruption",
    }),
    Object.freeze({
      id: "persistence-without-timers",
      statement: "persistence is contract metadata without clocks or schedulers",
    }),
    Object.freeze({
      id: "provenance-traceability",
      statement: "candidates retain explainable source and derivation references",
    }),
    Object.freeze({
      id: "guidance-not-rendering",
      statement: "contracts contain no renderer-specific fields",
    }),
    Object.freeze({
      id: "guidance-not-advisor",
      statement: "contracts are independent of Advisor/LLM conversation",
    }),
    Object.freeze({
      id: "guidance-not-action",
      statement: "contracts do not encode action execution",
    }),
    Object.freeze({
      id: "sole-upstream-dri-7-1",
      statement: "DRI-7:2 depends only on DRI-7:1 Foundation",
    }),
  ] as const);

export type DirectorRuntimeExecutiveGuidanceContractInvariant =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_INVARIANTS)[number];

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeExecutiveGuidanceContractsConstructorNames =
  Object.freeze([
    "createDirectorRuntimeExecutiveGuidanceConstraints",
    "createDirectorRuntimeExecutiveGuidanceContextReference",
    "createDirectorRuntimeExecutiveGuidanceProvenance",
    "createDirectorRuntimeExecutiveGuidanceRequest",
    "createDirectorRuntimeExecutiveGuidanceCandidate",
    "createDirectorRuntimeExecutiveGuidanceContractRelationship",
    "createDirectorRuntimeExecutiveGuidancePathContract",
    "createDirectorRuntimeExecutiveGuidanceDeliveryPolicy",
    "createDirectorRuntimeExecutiveGuidanceEnvelope",
    "createDirectorRuntimeExecutiveGuidanceContractIssue",
    "createDirectorRuntimeExecutiveGuidanceContractResult",
  ] as const);

export const directorRuntimeExecutiveGuidanceContractsGuardNames =
  Object.freeze([
    "isDirectorRuntimeExecutiveGuidanceEligibility",
    "isDirectorRuntimeExecutiveGuidanceInterruption",
    "isDirectorRuntimeExecutiveGuidancePersistence",
    "isDirectorRuntimeExecutiveGuidanceContextKind",
    "isDirectorRuntimeExecutiveGuidanceRelationshipKind",
    "isDirectorRuntimeExecutiveGuidanceContractStatus",
    "isDirectorRuntimeExecutiveGuidanceConstraints",
    "isDirectorRuntimeExecutiveGuidanceContextReference",
    "isDirectorRuntimeExecutiveGuidanceProvenance",
    "isDirectorRuntimeExecutiveGuidanceRequest",
    "isDirectorRuntimeExecutiveGuidanceCandidate",
    "isDirectorRuntimeExecutiveGuidanceContractRelationship",
    "isDirectorRuntimeExecutiveGuidancePathContract",
    "isDirectorRuntimeExecutiveGuidanceDeliveryPolicy",
    "isDirectorRuntimeExecutiveGuidanceEnvelope",
    "isDirectorRuntimeExecutiveGuidanceContractIssue",
    "isDirectorRuntimeExecutiveGuidanceContractResult",
  ] as const);

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "DirectorRuntimeExecutiveGuidanceEligibility",
    "DirectorRuntimeExecutiveGuidanceInterruption",
    "DirectorRuntimeExecutiveGuidancePersistence",
    "DirectorRuntimeExecutiveGuidanceContextKind",
    "DirectorRuntimeExecutiveGuidanceRelationshipKind",
    "DirectorRuntimeExecutiveGuidanceContractStatus",
    "DirectorRuntimeExecutiveGuidanceContractCategory",
    "DirectorRuntimeExecutiveGuidanceContractIssueCode",
    "DirectorRuntimeExecutiveGuidanceContextReference",
    "DirectorRuntimeExecutiveGuidanceConstraints",
    "DirectorRuntimeExecutiveGuidanceRequest",
    "DirectorRuntimeExecutiveGuidanceProvenance",
    "DirectorRuntimeExecutiveGuidanceCandidate",
    "DirectorRuntimeExecutiveGuidanceContractRelationship",
    "DirectorRuntimeExecutiveGuidancePathContract",
    "DirectorRuntimeExecutiveGuidanceDeliveryPolicy",
    "DirectorRuntimeExecutiveGuidanceEnvelope",
    "DirectorRuntimeExecutiveGuidanceContractIssue",
    "DirectorRuntimeExecutiveGuidanceContractResult",
    "DirectorRuntimeExecutiveGuidanceContractInvariant",
    "DirectorRuntimeExecutiveGuidanceContractsVerification",
  ] as const);

export const directorRuntimeExecutiveGuidanceContractsApiNames = Object.freeze([
  ...directorRuntimeExecutiveGuidanceContractsConstructorNames,
  ...directorRuntimeExecutiveGuidanceContractsGuardNames,
  "verifyDirectorRuntimeExecutiveGuidanceContracts",
] as const);

export const directorRuntimeExecutiveGuidanceContractsRegistry = Object.freeze({
  identity: directorRuntimeExecutiveGuidanceContractsIdentity,
  version: directorRuntimeExecutiveGuidanceContractsVersion,
  namespace: directorRuntimeExecutiveGuidanceContractsNamespace,
  dependency: directorRuntimeExecutiveGuidanceContractsUpstream,
  principle: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_PRINCIPLE,
  boundary: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_BOUNDARY,
  eligibilityValues: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ELIGIBILITY_VALUES,
  eligibilityCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ELIGIBILITY_VALUES.length,
  interruptionValues: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTERRUPTION_VALUES,
  interruptionCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTERRUPTION_VALUES.length,
  persistenceValues: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PERSISTENCE_VALUES,
  persistenceCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PERSISTENCE_VALUES.length,
  contextKinds: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTEXT_KINDS,
  contextKindCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTEXT_KINDS.length,
  relationshipKinds: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RELATIONSHIP_KINDS,
  relationshipKindCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RELATIONSHIP_KINDS.length,
  contractStatuses: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_STATUSES,
  contractStatusCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_STATUSES.length,
  contractCategories: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_CATEGORIES,
  contractCategoryCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_CATEGORIES.length,
  issueCodes: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_ISSUE_CODES,
  issueCodeCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_ISSUE_CODES.length,
  emptyConstraints: DIRECTOR_RUNTIME_EMPTY_EXECUTIVE_GUIDANCE_CONSTRAINTS,
  emptyProvenance: DIRECTOR_RUNTIME_EMPTY_EXECUTIVE_GUIDANCE_PROVENANCE,
  invariants: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_INVARIANTS,
  invariantCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_INVARIANTS.length,
  publicTypes: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_PUBLIC_TYPE_NAMES,
  publicTypeCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_PUBLIC_TYPE_NAMES.length,
  constructors: directorRuntimeExecutiveGuidanceContractsConstructorNames,
  constructorCount:
    directorRuntimeExecutiveGuidanceContractsConstructorNames.length,
  guards: directorRuntimeExecutiveGuidanceContractsGuardNames,
  guardCount: directorRuntimeExecutiveGuidanceContractsGuardNames.length,
  publicApis: directorRuntimeExecutiveGuidanceContractsApiNames,
  publicApiCount: directorRuntimeExecutiveGuidanceContractsApiNames.length,
  vocabularySectionCount: 7 as const,
  vocabularyValueCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ELIGIBILITY_VALUES.length +
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTERRUPTION_VALUES.length +
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PERSISTENCE_VALUES.length +
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTEXT_KINDS.length +
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RELATIONSHIP_KINDS.length +
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_STATUSES.length +
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_CATEGORIES.length,
});

export const directorRuntimeExecutiveGuidanceContracts = Object.freeze({
  phase: "DRI-7:2" as const,
  name: "DirectorRuntimeExecutiveGuidanceContracts" as const,
  identity: directorRuntimeExecutiveGuidanceContractsIdentity,
  namespace: directorRuntimeExecutiveGuidanceContractsNamespace,
  version: directorRuntimeExecutiveGuidanceContractsVersion,
  layer: "Director Runtime Integration" as const,
  domain: "ExecutiveGuidanceAttentionDelivery" as const,
  role: "Contracts" as const,
  stage: "Contracts" as const,
  status: "ContractsReady" as const,
  upstreamDependency: directorRuntimeExecutiveGuidanceContractsUpstream,
  deterministic: true as const,
  contracts: true as const,
  rendererIndependent: true as const,
  advisorIndependent: true as const,
  actionIndependent: true as const,
  philosophy: "contracts-not-resolution" as const,
  principle: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_PRINCIPLE,
  boundary: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_BOUNDARY,
  eligibilityValues: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ELIGIBILITY_VALUES,
  interruptionValues: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTERRUPTION_VALUES,
  persistenceValues: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PERSISTENCE_VALUES,
  contextKinds: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTEXT_KINDS,
  relationshipKinds: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RELATIONSHIP_KINDS,
  contractStatuses: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_STATUSES,
  contractCategories: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_CATEGORIES,
  invariants: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_INVARIANTS,
  publicApiSurface: directorRuntimeExecutiveGuidanceContractsApiNames,
  publicTypes: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_PUBLIC_TYPE_NAMES,
  registry: directorRuntimeExecutiveGuidanceContractsRegistry,
  foundationBoundary: "DRI-7:1-foundation-only" as const,
  architecturalStatus:
    "Contracts Complete · Deterministic · Immutable · Traceable · Renderer-Independent · ReadyForResolution" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeExecutiveGuidanceContractsVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeExecutiveGuidanceContractsIdentity;
  readonly version: typeof directorRuntimeExecutiveGuidanceContractsVersion;
  readonly namespace: typeof directorRuntimeExecutiveGuidanceContractsNamespace;
  readonly dependency: typeof directorRuntimeExecutiveGuidanceContractsUpstream;
  readonly eligibilityCount: number;
  readonly interruptionCount: number;
  readonly persistenceCount: number;
  readonly contextKindCount: number;
  readonly relationshipKindCount: number;
  readonly contractStatusCount: number;
  readonly contractCategoryCount: number;
  readonly vocabularySectionCount: number;
  readonly vocabularyValueCount: number;
  readonly publicTypeCount: number;
  readonly constructorCount: number;
  readonly guardCount: number;
  readonly invariantCount: number;
  readonly frozen: boolean;
  readonly preservesCandidateOrder: boolean;
  readonly foundationCompatible: boolean;
  readonly rendererIndependent: boolean;
  readonly advisorIndependent: boolean;
  readonly actionIndependent: boolean;
  readonly noRanking: boolean;
  readonly noAttentionRecalculation: boolean;
}

function exactOrder<T extends string>(
  actual: readonly T[],
  expected: readonly T[],
): boolean {
  return (
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

export function verifyDirectorRuntimeExecutiveGuidanceContracts():
  DirectorRuntimeExecutiveGuidanceContractsVerification {
  const contracts = directorRuntimeExecutiveGuidanceContracts;
  const registry = directorRuntimeExecutiveGuidanceContractsRegistry;

  const identityOk =
    contracts.identity ===
      "DRI-7:2/DirectorRuntimeExecutiveGuidanceContracts" &&
    contracts.version === "7.2.0" &&
    contracts.namespace === "nexora.dri.executive-guidance.contracts" &&
    contracts.layer === "Director Runtime Integration" &&
    contracts.domain === "ExecutiveGuidanceAttentionDelivery" &&
    contracts.role === "Contracts" &&
    contracts.status === "ContractsReady" &&
    contracts.upstreamDependency ===
      "DRI-7:1/DirectorRuntimeExecutiveGuidanceFoundation" &&
    contracts.upstreamDependency ===
      directorRuntimeExecutiveGuidanceFoundationIdentity &&
    registry.dependency === contracts.upstreamDependency &&
    contracts.foundationBoundary === "DRI-7:1-foundation-only";

  const vocabularyOk =
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ELIGIBILITY_VALUES, [
      "eligible",
      "suppressed",
      "deferred",
      "ineligible",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTERRUPTION_VALUES, [
      "non-interruptive",
      "contextual",
      "interruptive",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PERSISTENCE_VALUES, [
      "transient",
      "context-bound",
      "focus-bound",
      "persistent",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTEXT_KINDS, [
      "goal",
      "object",
      "problem",
      "scenario",
      "decision",
      "execution",
      "workspace",
      "lens",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RELATIONSHIP_KINDS, [
      "supports",
      "explains",
      "causes",
      "depends-on",
      "conflicts-with",
      "compares-with",
      "impacts",
      "derived-from",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_STATUSES, [
      "accepted",
      "rejected",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_CATEGORIES, [
      "request",
      "candidate",
      "constraints",
      "context-reference",
      "provenance",
      "relationship",
      "path",
      "delivery-policy",
      "envelope",
      "result",
      "issue",
    ]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ELIGIBILITY_VALUES]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTERRUPTION_VALUES]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PERSISTENCE_VALUES]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTEXT_KINDS]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RELATIONSHIP_KINDS]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_STATUSES]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_CATEGORIES]);

  const registryIntegrityOk =
    registry.eligibilityCount ===
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ELIGIBILITY_VALUES.length &&
    registry.interruptionCount ===
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTERRUPTION_VALUES.length &&
    registry.persistenceCount ===
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PERSISTENCE_VALUES.length &&
    registry.contextKindCount ===
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTEXT_KINDS.length &&
    registry.relationshipKindCount ===
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RELATIONSHIP_KINDS.length &&
    registry.contractStatusCount ===
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_STATUSES.length &&
    registry.contractCategoryCount ===
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_CATEGORIES.length &&
    registry.vocabularySectionCount === 7 &&
    registry.vocabularyValueCount ===
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ELIGIBILITY_VALUES.length +
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTERRUPTION_VALUES.length +
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PERSISTENCE_VALUES.length +
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTEXT_KINDS.length +
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RELATIONSHIP_KINDS.length +
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_STATUSES.length +
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_CATEGORIES.length &&
    registry.constructorCount ===
      directorRuntimeExecutiveGuidanceContractsConstructorNames.length &&
    registry.guardCount ===
      directorRuntimeExecutiveGuidanceContractsGuardNames.length &&
    registry.publicTypeCount ===
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_PUBLIC_TYPE_NAMES.length;

  const foundationCompatible =
    contracts.upstreamDependency ===
      "DRI-7:1/DirectorRuntimeExecutiveGuidanceFoundation" &&
    contracts.boundary.foundationAuthority === "DRI-7:1" &&
    contracts.boundary.consumesFoundationOnly === true;

  const preservesCandidateOrder =
    contracts.boundary.preservesCallerCandidateOrder === true;

  const noRanking =
    contracts.boundary.doesNotRankCandidates === true &&
    contracts.boundary.doesNotResolveGuidance === true &&
    contracts.boundary.doesNotComposeGuidance === true;

  const noAttentionRecalculation =
    contracts.boundary.doesNotRecalculateAttention === true &&
    contracts.boundary.attentionAuthority === "DRI-6";

  const immutabilityOk =
    Object.isFrozen(contracts) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(directorRuntimeExecutiveGuidanceContractsCanonicalIdentity) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ELIGIBILITY_VALUES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTERRUPTION_VALUES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PERSISTENCE_VALUES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTEXT_KINDS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RELATIONSHIP_KINDS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_STATUSES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_CATEGORIES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_BOUNDARY) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_INVARIANTS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EMPTY_EXECUTIVE_GUIDANCE_CONSTRAINTS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EMPTY_EXECUTIVE_GUIDANCE_PROVENANCE);

  const ok =
    identityOk &&
    vocabularyOk &&
    registryIntegrityOk &&
    foundationCompatible &&
    preservesCandidateOrder &&
    noRanking &&
    noAttentionRecalculation &&
    immutabilityOk &&
    contracts.rendererIndependent === true &&
    contracts.advisorIndependent === true &&
    contracts.actionIndependent === true &&
    contracts.principle === DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_PRINCIPLE;

  return Object.freeze({
    ok,
    identity: directorRuntimeExecutiveGuidanceContractsIdentity,
    version: directorRuntimeExecutiveGuidanceContractsVersion,
    namespace: directorRuntimeExecutiveGuidanceContractsNamespace,
    dependency: directorRuntimeExecutiveGuidanceContractsUpstream,
    eligibilityCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ELIGIBILITY_VALUES.length,
    interruptionCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTERRUPTION_VALUES.length,
    persistenceCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PERSISTENCE_VALUES.length,
    contextKindCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTEXT_KINDS.length,
    relationshipKindCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RELATIONSHIP_KINDS.length,
    contractStatusCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_STATUSES.length,
    contractCategoryCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_CATEGORIES.length,
    vocabularySectionCount: 7,
    vocabularyValueCount: registry.vocabularyValueCount,
    publicTypeCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_PUBLIC_TYPE_NAMES.length,
    constructorCount:
      directorRuntimeExecutiveGuidanceContractsConstructorNames.length,
    guardCount: directorRuntimeExecutiveGuidanceContractsGuardNames.length,
    invariantCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_CONTRACT_INVARIANTS.length,
    frozen: immutabilityOk,
    preservesCandidateOrder,
    foundationCompatible,
    rendererIndependent: contracts.rendererIndependent,
    advisorIndependent: contracts.advisorIndependent,
    actionIndependent: contracts.actionIndependent,
    noRanking,
    noAttentionRecalculation,
  });
}
