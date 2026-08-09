/**
 * REX-4:2 — Runtime Executive Insight Experience Contracts.
 *
 * Formal immutable contract layer over REX-4:1 foundation semantics.
 * Converts vocabulary into consumer-safe structural contracts and
 * deterministic structural validation.
 *
 * Canonical flow:
 *   REX-4:1 Foundation → REX-4:2 Contracts → later REX-4 runtime behavior
 *
 * REX-4:1 answers: What is an Executive Insight?
 * REX-4:2 answers: What constitutes a structurally valid Executive Insight contract?
 *
 * Contracts only. No insight resolution, inference, ranking, prioritization,
 * attention/presentation resolution, orchestration, AI, rendering, persistence,
 * automation, or external integration.
 */

import {
  RUNTIME_EXECUTIVE_INSIGHT_ATTENTION_STATES,
  RUNTIME_EXECUTIVE_INSIGHT_CATEGORIES,
  RUNTIME_EXECUTIVE_INSIGHT_DIRECTIONS,
  RUNTIME_EXECUTIVE_INSIGHT_EVIDENCE_KINDS,
  RUNTIME_EXECUTIVE_INSIGHT_FRESHNESS_VALUES,
  RUNTIME_EXECUTIVE_INSIGHT_IMPORTANCE_VALUES,
  RUNTIME_EXECUTIVE_INSIGHT_LIFECYCLE_STATUSES,
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATE_SEMANTICS,
  RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_DIRECTIONS,
  RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_KINDS,
  RUNTIME_EXECUTIVE_INSIGHT_SCOPES,
  RUNTIME_EXECUTIVE_INSIGHT_SEVERITIES,
  RUNTIME_EXECUTIVE_INSIGHT_SIGNAL_KINDS,
  RUNTIME_EXECUTIVE_INSIGHT_SOURCE_KINDS,
  RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KINDS,
  RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KIND_SEMANTICS,
  isRuntimeExecutiveInsightAttentionState,
  isRuntimeExecutiveInsightCategory,
  isRuntimeExecutiveInsightConfidence,
  isRuntimeExecutiveInsightDirection,
  isRuntimeExecutiveInsightEvidenceKind,
  isRuntimeExecutiveInsightFreshness,
  isRuntimeExecutiveInsightImportance,
  isRuntimeExecutiveInsightLifecycleStatus,
  isRuntimeExecutiveInsightPresentationState,
  isRuntimeExecutiveInsightRelationshipDirection,
  isRuntimeExecutiveInsightRelationshipKind,
  isRuntimeExecutiveInsightScope,
  isRuntimeExecutiveInsightSeverity,
  isRuntimeExecutiveInsightSignalKind,
  isRuntimeExecutiveInsightSourceKind,
  isRuntimeExecutiveInsightSubjectKind,
  runtimeExecutiveInsightExperienceFoundationIdentity,
  runtimeExecutiveInsightExperienceFoundationSupportedImportPath,
  runtimeExecutiveInsightExperienceFoundationVersion,
  verifyRuntimeExecutiveInsightExperienceFoundation,
  type RuntimeExecutiveInsightAttentionState,
  type RuntimeExecutiveInsightCategory,
  type RuntimeExecutiveInsightConfidence,
  type RuntimeExecutiveInsightDirection,
  type RuntimeExecutiveInsightEvidenceKind,
  type RuntimeExecutiveInsightFreshness,
  type RuntimeExecutiveInsightImportance,
  type RuntimeExecutiveInsightLifecycleStatus,
  type RuntimeExecutiveInsightPresentationState,
  type RuntimeExecutiveInsightRelationshipDirection,
  type RuntimeExecutiveInsightRelationshipKind,
  type RuntimeExecutiveInsightScope,
  type RuntimeExecutiveInsightSeverity,
  type RuntimeExecutiveInsightSignalKind,
  type RuntimeExecutiveInsightSourceKind,
  type RuntimeExecutiveInsightSubjectKind,
} from "@/app/lib/rex/runtimeExecutiveInsightExperienceFoundation";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveInsightExperienceContractsIdentity =
  "REX-4:2/RuntimeExecutiveInsightExperienceContracts" as const;

export const runtimeExecutiveInsightExperienceContractsVersion =
  "4.2.0" as const;

export const runtimeExecutiveInsightExperienceContractsNamespace =
  "nexora.rex.insight-experience.contracts" as const;

export const runtimeExecutiveInsightExperienceContractsLayer =
  "REX" as const;

export const runtimeExecutiveInsightExperienceContractsCapability =
  "RuntimeExecutiveInsightExperience" as const;

export const runtimeExecutiveInsightExperienceContractsPhase =
  "Contracts" as const;

export const runtimeExecutiveInsightExperienceContractsStatus =
  "ContractsReady" as const;

export const runtimeExecutiveInsightExperienceContractsArchitecturalRole =
  "RuntimeExecutiveInsightExperienceContractsBoundary" as const;

export const runtimeExecutiveInsightExperienceContractsDependencyIdentity =
  runtimeExecutiveInsightExperienceFoundationIdentity;

export const runtimeExecutiveInsightExperienceContractsDependencyPath =
  runtimeExecutiveInsightExperienceFoundationSupportedImportPath;

export const runtimeExecutiveInsightExperienceContractsSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveInsightExperienceContracts" as const;

export const runtimeExecutiveInsightExperienceContractsStability =
  "ContractsReady" as const;

export const runtimeExecutiveInsightExperienceContractsDeterministic =
  true as const;

export const runtimeExecutiveInsightExperienceContractsSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveInsightExperienceContractsMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveInsightExperienceContractsCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveInsightExperienceContractsIdentity,
    version: runtimeExecutiveInsightExperienceContractsVersion,
    namespace: runtimeExecutiveInsightExperienceContractsNamespace,
    layer: runtimeExecutiveInsightExperienceContractsLayer,
    capability: runtimeExecutiveInsightExperienceContractsCapability,
    phase: runtimeExecutiveInsightExperienceContractsPhase,
    status: runtimeExecutiveInsightExperienceContractsStatus,
    architecturalRole:
      runtimeExecutiveInsightExperienceContractsArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveInsightExperienceContractsDependencyIdentity,
    dependencyPath:
      runtimeExecutiveInsightExperienceContractsDependencyPath,
    supportedImportPath:
      runtimeExecutiveInsightExperienceContractsSupportedImportPath,
    upstreamVersion: runtimeExecutiveInsightExperienceFoundationVersion,
    stabilityStatus: runtimeExecutiveInsightExperienceContractsStability,
    deterministicStatus:
      runtimeExecutiveInsightExperienceContractsDeterministic,
    sideEffectPolicy:
      runtimeExecutiveInsightExperienceContractsSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveInsightExperienceContractsMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACTS_PRINCIPLE =
  "Contracts define what constitutes a structurally valid Executive Insight representation. They do not decide whether an insight should exist, how important it is, or how it should be presented." as const;

export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACTS_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-Executive-Experience" as const,
  contractsAuthority: "REX-4:2" as const,
  architecturalRole:
    "RuntimeExecutiveInsightExperienceContractsBoundary" as const,
  soleImmediateDependency:
    "REX-4:1/RuntimeExecutiveInsightExperienceFoundation" as const,
  consumesFoundationOnly: true as const,
  importsRex4LaterDirectly: false as const,
  importsRex3Directly: false as const,
  importsRex2Directly: false as const,
  importsRex1Directly: false as const,
  importsExDriDirectly: false as const,
  importsDriDirectly: false as const,
  importsNolDirectly: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  aiProviderIndependent: true as const,
  introducesInference: false as const,
  introducesResolution: false as const,
  introducesRanking: false as const,
  introducesPrioritization: false as const,
  introducesAttentionResolution: false as const,
  introducesPresentationResolution: false as const,
  introducesOrchestration: false as const,
  introducesLlmGeneration: false as const,
  introducesRendering: false as const,
  introducesPersistence: false as const,
  introducesExternalIntegration: false as const,
  calculatesKpi: false as const,
  calculatesKoi: false as const,
  introducesKor: false as const,
});

// ─── Inherited foundation vocabularies (exact references — not forked) ──────

export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_CATEGORIES =
  RUNTIME_EXECUTIVE_INSIGHT_CATEGORIES;
export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SUBJECT_KINDS =
  RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KINDS;
export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_EVIDENCE_KINDS =
  RUNTIME_EXECUTIVE_INSIGHT_EVIDENCE_KINDS;
export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SIGNAL_KINDS =
  RUNTIME_EXECUTIVE_INSIGHT_SIGNAL_KINDS;
export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_DIRECTIONS =
  RUNTIME_EXECUTIVE_INSIGHT_DIRECTIONS;
export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SEVERITIES =
  RUNTIME_EXECUTIVE_INSIGHT_SEVERITIES;
export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_IMPORTANCE_VALUES =
  RUNTIME_EXECUTIVE_INSIGHT_IMPORTANCE_VALUES;
export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_FRESHNESS_VALUES =
  RUNTIME_EXECUTIVE_INSIGHT_FRESHNESS_VALUES;
export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SCOPES =
  RUNTIME_EXECUTIVE_INSIGHT_SCOPES;
export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SOURCE_KINDS =
  RUNTIME_EXECUTIVE_INSIGHT_SOURCE_KINDS;
export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_RELATIONSHIP_KINDS =
  RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_KINDS;
export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_RELATIONSHIP_DIRECTIONS =
  RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_DIRECTIONS;
export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_ATTENTION_STATES =
  RUNTIME_EXECUTIVE_INSIGHT_ATTENTION_STATES;
export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_PRESENTATION_STATES =
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES;
export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_PRESENTATION_STATE_SEMANTICS =
  RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATE_SEMANTICS;
export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_LIFECYCLE_STATUSES =
  RUNTIME_EXECUTIVE_INSIGHT_LIFECYCLE_STATUSES;
export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SUBJECT_KIND_SEMANTICS =
  RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KIND_SEMANTICS;

/**
 * Related-subject relationship roles — structural only, no inferred meaning.
 */
export const RUNTIME_EXECUTIVE_INSIGHT_RELATED_SUBJECT_ROLES = Object.freeze([
  "related",
  "supporting",
  "dependent",
  "contextual",
  "impacted",
] as const);

export type RuntimeExecutiveInsightRelatedSubjectRole =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_RELATED_SUBJECT_ROLES)[number];

// ─── Contract families ──────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_FAMILIES = Object.freeze([
  "InsightIdentity",
  "InsightSubject",
  "RelatedSubject",
  "Evidence",
  "EvidenceCollection",
  "Signal",
  "SignalCollection",
  "Classification",
  "Severity",
  "Importance",
  "Confidence",
  "Freshness",
  "Scope",
  "Source",
  "Relationship",
  "Attention",
  "Lifecycle",
  "PresentationCompatibility",
  "ExecutiveInsight",
  "InsightCollection",
] as const);

export type RuntimeExecutiveInsightContractFamily =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_FAMILIES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_CONSUMER_GUARANTEES =
  Object.freeze([
    "plain-data-contracts",
    "deterministic-validation",
    "immutable-inputs",
    "no-ai-inference",
    "no-ranking",
    "no-presentation-resolution",
    "no-side-effects",
    "no-persistence",
    "no-external-access",
    "stable-domain-values",
    "stable-validation-code-ordering",
  ] as const);

export type RuntimeExecutiveInsightContractConsumerGuarantee =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_CONSUMER_GUARANTEES)[number];

// ─── Validation codes / areas ───────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_VALIDATION_CODES =
  Object.freeze([
    "missing-insight-id",
    "unknown-insight-category",
    "unknown-subject-kind",
    "missing-subject-id",
    "duplicate-evidence-id",
    "unknown-evidence-kind",
    "duplicate-signal-id",
    "unknown-signal-kind",
    "invalid-confidence",
    "unknown-direction",
    "unknown-severity",
    "unknown-importance",
    "unknown-freshness",
    "unknown-scope",
    "unknown-source-kind",
    "unknown-relationship-kind",
    "invalid-relationship-reference",
    "unknown-attention-state",
    "unknown-presentation-state",
    "duplicate-insight-id",
    "missing-evidence-id",
    "missing-signal-id",
    "missing-relationship-id",
    "unknown-relationship-direction",
    "unknown-lifecycle-status",
    "invalid-evidence-reference",
    "invalid-subject-reference",
    "invalid-payload",
    "unknown-related-subject-role",
    "category-mismatch",
    "invalid-related-subject-order",
  ] as const);

export type RuntimeExecutiveInsightContractValidationCode =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_VALIDATION_CODES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_VALIDATION_AREAS =
  Object.freeze([
    "identity",
    "subject",
    "related-subject",
    "evidence",
    "signal",
    "classification",
    "severity",
    "importance",
    "confidence",
    "freshness",
    "scope",
    "source",
    "relationship",
    "attention",
    "lifecycle",
    "presentation",
    "collection",
    "payload",
  ] as const);

export type RuntimeExecutiveInsightContractValidationArea =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_VALIDATION_AREAS)[number];

// ─── Payload boundary ───────────────────────────────────────────────────────

/**
 * Serializable plain-data evidence payload.
 * No functions, class instances, Date, Map, Set, Promise, DOM, React, or handles.
 */
export type RuntimeExecutiveInsightEvidencePayload =
  | string
  | number
  | boolean
  | null
  | ReadonlyArray<RuntimeExecutiveInsightEvidencePayload>
  | {
      readonly [key: string]: RuntimeExecutiveInsightEvidencePayload;
    };

// ─── Contract structures ────────────────────────────────────────────────────

export interface RuntimeExecutiveInsightIdentityContract {
  readonly insightId: string;
  readonly category: RuntimeExecutiveInsightCategory;
  readonly schemaVersion?: string;
  readonly originRef?: string;
  readonly supersedesInsightId?: string;
  readonly supersededByInsightId?: string;
}

export interface RuntimeExecutiveInsightSubjectContract {
  readonly subjectId: string;
  readonly kind: RuntimeExecutiveInsightSubjectKind;
  readonly parentId?: string;
  readonly referenceId?: string;
  readonly scope?: RuntimeExecutiveInsightScope;
  readonly label?: string;
}

export interface RuntimeExecutiveInsightRelatedSubjectContract {
  readonly subject: RuntimeExecutiveInsightSubjectContract;
  readonly role: RuntimeExecutiveInsightRelatedSubjectRole;
  readonly order: number;
  readonly relevanceCode?: string;
}

export interface RuntimeExecutiveInsightSourceContract {
  readonly kind: RuntimeExecutiveInsightSourceKind;
  readonly sourceId?: string;
  readonly systemName?: string;
  readonly reference?: string;
  readonly externalReference?: string;
  readonly packRef?: string;
  readonly modelRef?: string;
  readonly runtimeRef?: string;
}

export interface RuntimeExecutiveInsightSeverityContract {
  readonly severity: RuntimeExecutiveInsightSeverity;
  readonly sourceRef?: string;
  readonly rationaleCode?: string;
}

export interface RuntimeExecutiveInsightImportanceContract {
  readonly importance: RuntimeExecutiveInsightImportance;
  readonly sourceRef?: string;
  readonly rationaleCode?: string;
}

export interface RuntimeExecutiveInsightConfidenceContract {
  readonly confidence: RuntimeExecutiveInsightConfidence;
  readonly sourceRef?: string;
  readonly evidenceId?: string;
  readonly methodRef?: string;
}

export interface RuntimeExecutiveInsightFreshnessContract {
  readonly freshness: RuntimeExecutiveInsightFreshness;
  readonly observedAtIso?: string;
  readonly effectiveAtIso?: string;
  readonly validFromIso?: string;
  readonly validToIso?: string;
}

export interface RuntimeExecutiveInsightScopeContract {
  readonly scope: RuntimeExecutiveInsightScope;
  readonly scopeRef?: string;
}

export interface RuntimeExecutiveInsightEvidenceContract {
  readonly evidenceId: string;
  readonly kind: RuntimeExecutiveInsightEvidenceKind;
  readonly source: RuntimeExecutiveInsightSourceContract;
  readonly subjectId?: string;
  readonly payload?: RuntimeExecutiveInsightEvidencePayload;
  readonly unit?: string;
  readonly baselineRef?: string;
  readonly observedAtIso?: string;
  readonly freshness?: RuntimeExecutiveInsightFreshness;
  readonly reference?: string;
}

export interface RuntimeExecutiveInsightSignalContract {
  readonly signalId: string;
  readonly kind: RuntimeExecutiveInsightSignalKind;
  readonly subjectId: string;
  readonly source: RuntimeExecutiveInsightSourceContract;
  readonly evidenceIds?: ReadonlyArray<string>;
  readonly direction?: RuntimeExecutiveInsightDirection;
  readonly confidence?: RuntimeExecutiveInsightConfidence;
  readonly freshness?: RuntimeExecutiveInsightFreshness;
  readonly observedAtIso?: string;
  readonly sequence?: number;
}

export interface RuntimeExecutiveInsightClassificationContract {
  readonly category: RuntimeExecutiveInsightCategory;
  readonly direction: RuntimeExecutiveInsightDirection;
  readonly severity: RuntimeExecutiveInsightSeverity;
  readonly importance: RuntimeExecutiveInsightImportance;
  readonly confidence: RuntimeExecutiveInsightConfidence;
  readonly freshness: RuntimeExecutiveInsightFreshness;
  readonly scope: RuntimeExecutiveInsightScope;
}

export interface RuntimeExecutiveInsightRelationshipEndpointContract {
  readonly endpointKind: "insight" | "subject";
  readonly endpointId: string;
}

export interface RuntimeExecutiveInsightRelationshipContract {
  readonly relationshipId: string;
  readonly kind: RuntimeExecutiveInsightRelationshipKind;
  readonly direction: RuntimeExecutiveInsightRelationshipDirection;
  readonly from: RuntimeExecutiveInsightRelationshipEndpointContract;
  readonly to: RuntimeExecutiveInsightRelationshipEndpointContract;
  readonly order?: number;
  readonly evidenceIds?: ReadonlyArray<string>;
}

export interface RuntimeExecutiveInsightAttentionContract {
  readonly attentionState: RuntimeExecutiveInsightAttentionState;
  readonly sourceRef?: string;
  readonly reasonCode?: string;
}

export interface RuntimeExecutiveInsightLifecycleContract {
  readonly status: RuntimeExecutiveInsightLifecycleStatus;
  readonly supersedesInsightId?: string;
  readonly supersededByInsightId?: string;
}

export interface RuntimeExecutiveInsightPresentationCompatibilityContract {
  readonly presentationState: RuntimeExecutiveInsightPresentationState;
  readonly structurallyEligible: boolean;
}

export interface RuntimeExecutiveInsightEvidenceCollectionContract {
  readonly collectionId?: string;
  readonly evidence: ReadonlyArray<RuntimeExecutiveInsightEvidenceContract>;
}

export interface RuntimeExecutiveInsightSignalCollectionContract {
  readonly collectionId?: string;
  readonly signals: ReadonlyArray<RuntimeExecutiveInsightSignalContract>;
}

export interface RuntimeExecutiveInsightContract {
  readonly identity: RuntimeExecutiveInsightIdentityContract;
  readonly primarySubject: RuntimeExecutiveInsightSubjectContract;
  readonly relatedSubjects?: ReadonlyArray<RuntimeExecutiveInsightRelatedSubjectContract>;
  readonly classification: RuntimeExecutiveInsightClassificationContract;
  readonly evidence: ReadonlyArray<RuntimeExecutiveInsightEvidenceContract>;
  readonly signals: ReadonlyArray<RuntimeExecutiveInsightSignalContract>;
  readonly source: RuntimeExecutiveInsightSourceContract;
  readonly relationships?: ReadonlyArray<RuntimeExecutiveInsightRelationshipContract>;
  readonly attention?: RuntimeExecutiveInsightAttentionContract;
  readonly lifecycle?: RuntimeExecutiveInsightLifecycleContract;
  readonly presentationCompatibility?: RuntimeExecutiveInsightPresentationCompatibilityContract;
}

export interface RuntimeExecutiveInsightCollectionContract {
  readonly collectionId?: string;
  readonly scopeRef?: string;
  readonly insights: ReadonlyArray<RuntimeExecutiveInsightContract>;
}

export interface RuntimeExecutiveInsightContractValidationIssue {
  readonly code: RuntimeExecutiveInsightContractValidationCode;
  readonly area: RuntimeExecutiveInsightContractValidationArea;
  readonly path?: string;
  readonly details?: Readonly<Record<string, string | number | boolean>>;
}

export interface RuntimeExecutiveInsightContractValidationResult {
  readonly valid: boolean;
  readonly issues: ReadonlyArray<RuntimeExecutiveInsightContractValidationIssue>;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
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

function issue(
  code: RuntimeExecutiveInsightContractValidationCode,
  area: RuntimeExecutiveInsightContractValidationArea,
  path?: string,
  details?: Readonly<Record<string, string | number | boolean>>,
): RuntimeExecutiveInsightContractValidationIssue {
  return Object.freeze({
    code,
    area,
    ...(path !== undefined ? { path } : {}),
    ...(details !== undefined ? { details: Object.freeze({ ...details }) } : {}),
  });
}

function result(
  issues: RuntimeExecutiveInsightContractValidationIssue[],
): RuntimeExecutiveInsightContractValidationResult {
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

function asConfidence(value: number): RuntimeExecutiveInsightConfidence {
  return value as RuntimeExecutiveInsightConfidence;
}

export function isRuntimeExecutiveInsightRelatedSubjectRole(
  value: unknown,
): value is RuntimeExecutiveInsightRelatedSubjectRole {
  return (
    RUNTIME_EXECUTIVE_INSIGHT_RELATED_SUBJECT_ROLES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveInsightContractFamily(
  value: unknown,
): value is RuntimeExecutiveInsightContractFamily {
  return (
    RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_FAMILIES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveInsightContractValidationCode(
  value: unknown,
): value is RuntimeExecutiveInsightContractValidationCode {
  return (
    RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_VALIDATION_CODES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveInsightEvidencePayload(
  value: unknown,
): value is RuntimeExecutiveInsightEvidencePayload {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return true;
  }
  if (typeof value === "number") {
    return Number.isFinite(value);
  }
  if (Array.isArray(value)) {
    return value.every((entry) =>
      isRuntimeExecutiveInsightEvidencePayload(entry),
    );
  }
  if (!isPlainObject(value)) return false;
  if (Object.getPrototypeOf(value) !== Object.prototype) return false;
  return Object.values(value).every((entry) =>
    isRuntimeExecutiveInsightEvidencePayload(entry),
  );
}

// ─── Structural validation ──────────────────────────────────────────────────

export function validateRuntimeExecutiveInsightSourceContract(
  value: unknown,
  path = "source",
): RuntimeExecutiveInsightContractValidationResult {
  const issues: RuntimeExecutiveInsightContractValidationIssue[] = [];
  if (!isPlainObject(value)) {
    issues.push(issue("unknown-source-kind", "source", path));
    return result(issues);
  }
  if (!isRuntimeExecutiveInsightSourceKind(value.kind)) {
    issues.push(issue("unknown-source-kind", "source", `${path}.kind`));
  }
  return result(issues);
}

export function validateRuntimeExecutiveInsightSubjectContract(
  value: unknown,
  path = "subject",
): RuntimeExecutiveInsightContractValidationResult {
  const issues: RuntimeExecutiveInsightContractValidationIssue[] = [];
  if (!isPlainObject(value)) {
    issues.push(issue("missing-subject-id", "subject", path));
    return result(issues);
  }
  if (!isNonEmptyString(value.subjectId)) {
    issues.push(issue("missing-subject-id", "subject", `${path}.subjectId`));
  }
  if (!isRuntimeExecutiveInsightSubjectKind(value.kind)) {
    issues.push(issue("unknown-subject-kind", "subject", `${path}.kind`));
  }
  if (
    value.scope !== undefined &&
    !isRuntimeExecutiveInsightScope(value.scope)
  ) {
    issues.push(issue("unknown-scope", "scope", `${path}.scope`));
  }
  return result(issues);
}

export function validateRuntimeExecutiveInsightRelatedSubjectContract(
  value: unknown,
  path = "relatedSubject",
): RuntimeExecutiveInsightContractValidationResult {
  const issues: RuntimeExecutiveInsightContractValidationIssue[] = [];
  if (!isPlainObject(value)) {
    issues.push(issue("missing-subject-id", "related-subject", path));
    return result(issues);
  }
  issues.push(
    ...validateRuntimeExecutiveInsightSubjectContract(
      value.subject,
      `${path}.subject`,
    ).issues,
  );
  if (!isRuntimeExecutiveInsightRelatedSubjectRole(value.role)) {
    issues.push(
      issue(
        "unknown-related-subject-role",
        "related-subject",
        `${path}.role`,
      ),
    );
  }
  if (
    typeof value.order !== "number" ||
    !Number.isFinite(value.order) ||
    !Number.isInteger(value.order) ||
    value.order < 0
  ) {
    issues.push(
      issue(
        "invalid-related-subject-order",
        "related-subject",
        `${path}.order`,
      ),
    );
  }
  return result(issues);
}

export function validateRuntimeExecutiveInsightEvidenceContract(
  value: unknown,
  path = "evidence",
  knownSubjectIds?: ReadonlySet<string>,
): RuntimeExecutiveInsightContractValidationResult {
  const issues: RuntimeExecutiveInsightContractValidationIssue[] = [];
  if (!isPlainObject(value)) {
    issues.push(issue("missing-evidence-id", "evidence", path));
    return result(issues);
  }
  if (!isNonEmptyString(value.evidenceId)) {
    issues.push(issue("missing-evidence-id", "evidence", `${path}.evidenceId`));
  }
  if (!isRuntimeExecutiveInsightEvidenceKind(value.kind)) {
    issues.push(issue("unknown-evidence-kind", "evidence", `${path}.kind`));
  }
  issues.push(
    ...validateRuntimeExecutiveInsightSourceContract(
      value.source,
      `${path}.source`,
    ).issues,
  );
  if (value.subjectId !== undefined) {
    if (!isNonEmptyString(value.subjectId)) {
      issues.push(
        issue("invalid-subject-reference", "evidence", `${path}.subjectId`),
      );
    } else if (
      knownSubjectIds !== undefined &&
      !knownSubjectIds.has(value.subjectId)
    ) {
      issues.push(
        issue("invalid-subject-reference", "evidence", `${path}.subjectId`, {
          subjectId: value.subjectId,
        }),
      );
    }
  }
  if (
    value.payload !== undefined &&
    !isRuntimeExecutiveInsightEvidencePayload(value.payload)
  ) {
    issues.push(issue("invalid-payload", "payload", `${path}.payload`));
  }
  if (
    value.freshness !== undefined &&
    !isRuntimeExecutiveInsightFreshness(value.freshness)
  ) {
    issues.push(issue("unknown-freshness", "freshness", `${path}.freshness`));
  }
  return result(issues);
}

export function validateRuntimeExecutiveInsightSignalContract(
  value: unknown,
  path = "signal",
  knownEvidenceIds?: ReadonlySet<string>,
  knownSubjectIds?: ReadonlySet<string>,
): RuntimeExecutiveInsightContractValidationResult {
  const issues: RuntimeExecutiveInsightContractValidationIssue[] = [];
  if (!isPlainObject(value)) {
    issues.push(issue("missing-signal-id", "signal", path));
    return result(issues);
  }
  if (!isNonEmptyString(value.signalId)) {
    issues.push(issue("missing-signal-id", "signal", `${path}.signalId`));
  }
  if (!isRuntimeExecutiveInsightSignalKind(value.kind)) {
    issues.push(issue("unknown-signal-kind", "signal", `${path}.kind`));
  }
  if (!isNonEmptyString(value.subjectId)) {
    issues.push(
      issue("missing-subject-id", "signal", `${path}.subjectId`),
    );
  } else if (
    knownSubjectIds !== undefined &&
    !knownSubjectIds.has(value.subjectId)
  ) {
    issues.push(
      issue("invalid-subject-reference", "signal", `${path}.subjectId`, {
        subjectId: value.subjectId,
      }),
    );
  }
  issues.push(
    ...validateRuntimeExecutiveInsightSourceContract(
      value.source,
      `${path}.source`,
    ).issues,
  );
  if (
    value.direction !== undefined &&
    !isRuntimeExecutiveInsightDirection(value.direction)
  ) {
    issues.push(issue("unknown-direction", "signal", `${path}.direction`));
  }
  if (
    value.confidence !== undefined &&
    !isRuntimeExecutiveInsightConfidence(value.confidence)
  ) {
    issues.push(issue("invalid-confidence", "confidence", `${path}.confidence`));
  }
  if (
    value.freshness !== undefined &&
    !isRuntimeExecutiveInsightFreshness(value.freshness)
  ) {
    issues.push(issue("unknown-freshness", "freshness", `${path}.freshness`));
  }
  if (value.evidenceIds !== undefined) {
    if (!Array.isArray(value.evidenceIds)) {
      issues.push(
        issue("invalid-evidence-reference", "signal", `${path}.evidenceIds`),
      );
    } else {
      for (let index = 0; index < value.evidenceIds.length; index += 1) {
        const evidenceId = value.evidenceIds[index];
        if (!isNonEmptyString(evidenceId)) {
          issues.push(
            issue(
              "invalid-evidence-reference",
              "signal",
              `${path}.evidenceIds[${index}]`,
            ),
          );
          continue;
        }
        if (
          knownEvidenceIds !== undefined &&
          !knownEvidenceIds.has(evidenceId)
        ) {
          issues.push(
            issue(
              "invalid-evidence-reference",
              "signal",
              `${path}.evidenceIds[${index}]`,
              { evidenceId },
            ),
          );
        }
      }
      if (
        value.evidenceIds.every(isNonEmptyString) &&
        !unique(value.evidenceIds as string[])
      ) {
        issues.push(
          issue("duplicate-evidence-id", "signal", `${path}.evidenceIds`),
        );
      }
    }
  }
  return result(issues);
}

export function validateRuntimeExecutiveInsightRelationshipContract(
  value: unknown,
  path = "relationship",
  knownInsightIds?: ReadonlySet<string>,
  knownSubjectIds?: ReadonlySet<string>,
  knownEvidenceIds?: ReadonlySet<string>,
): RuntimeExecutiveInsightContractValidationResult {
  const issues: RuntimeExecutiveInsightContractValidationIssue[] = [];
  if (!isPlainObject(value)) {
    issues.push(issue("missing-relationship-id", "relationship", path));
    return result(issues);
  }
  if (!isNonEmptyString(value.relationshipId)) {
    issues.push(
      issue("missing-relationship-id", "relationship", `${path}.relationshipId`),
    );
  }
  if (!isRuntimeExecutiveInsightRelationshipKind(value.kind)) {
    issues.push(
      issue("unknown-relationship-kind", "relationship", `${path}.kind`),
    );
  }
  if (!isRuntimeExecutiveInsightRelationshipDirection(value.direction)) {
    issues.push(
      issue(
        "unknown-relationship-direction",
        "relationship",
        `${path}.direction`,
      ),
    );
  }

  const validateEndpoint = (
    endpoint: unknown,
    endpointPath: string,
  ): void => {
    if (
      !isPlainObject(endpoint) ||
      (endpoint.endpointKind !== "insight" &&
        endpoint.endpointKind !== "subject") ||
      !isNonEmptyString(endpoint.endpointId)
    ) {
      issues.push(
        issue(
          "invalid-relationship-reference",
          "relationship",
          endpointPath,
        ),
      );
      return;
    }
    if (
      endpoint.endpointKind === "insight" &&
      knownInsightIds !== undefined &&
      !knownInsightIds.has(endpoint.endpointId)
    ) {
      issues.push(
        issue(
          "invalid-relationship-reference",
          "relationship",
          endpointPath,
          { endpointId: endpoint.endpointId },
        ),
      );
    }
    if (
      endpoint.endpointKind === "subject" &&
      knownSubjectIds !== undefined &&
      !knownSubjectIds.has(endpoint.endpointId)
    ) {
      issues.push(
        issue(
          "invalid-relationship-reference",
          "relationship",
          endpointPath,
          { endpointId: endpoint.endpointId },
        ),
      );
    }
  };

  validateEndpoint(value.from, `${path}.from`);
  validateEndpoint(value.to, `${path}.to`);

  if (value.evidenceIds !== undefined) {
    if (!Array.isArray(value.evidenceIds)) {
      issues.push(
        issue(
          "invalid-evidence-reference",
          "relationship",
          `${path}.evidenceIds`,
        ),
      );
    } else {
      for (let index = 0; index < value.evidenceIds.length; index += 1) {
        const evidenceId = value.evidenceIds[index];
        if (!isNonEmptyString(evidenceId)) {
          issues.push(
            issue(
              "invalid-evidence-reference",
              "relationship",
              `${path}.evidenceIds[${index}]`,
            ),
          );
        } else if (
          knownEvidenceIds !== undefined &&
          !knownEvidenceIds.has(evidenceId)
        ) {
          issues.push(
            issue(
              "invalid-evidence-reference",
              "relationship",
              `${path}.evidenceIds[${index}]`,
              { evidenceId },
            ),
          );
        }
      }
    }
  }

  return result(issues);
}

export function validateRuntimeExecutiveInsightClassificationContract(
  value: unknown,
  path = "classification",
): RuntimeExecutiveInsightContractValidationResult {
  const issues: RuntimeExecutiveInsightContractValidationIssue[] = [];
  if (!isPlainObject(value)) {
    issues.push(
      issue("unknown-insight-category", "classification", path),
    );
    return result(issues);
  }
  if (!isRuntimeExecutiveInsightCategory(value.category)) {
    issues.push(
      issue("unknown-insight-category", "classification", `${path}.category`),
    );
  }
  if (!isRuntimeExecutiveInsightDirection(value.direction)) {
    issues.push(issue("unknown-direction", "classification", `${path}.direction`));
  }
  if (!isRuntimeExecutiveInsightSeverity(value.severity)) {
    issues.push(issue("unknown-severity", "severity", `${path}.severity`));
  }
  if (!isRuntimeExecutiveInsightImportance(value.importance)) {
    issues.push(
      issue("unknown-importance", "importance", `${path}.importance`),
    );
  }
  if (!isRuntimeExecutiveInsightConfidence(value.confidence)) {
    issues.push(
      issue("invalid-confidence", "confidence", `${path}.confidence`),
    );
  }
  if (!isRuntimeExecutiveInsightFreshness(value.freshness)) {
    issues.push(
      issue("unknown-freshness", "freshness", `${path}.freshness`),
    );
  }
  if (!isRuntimeExecutiveInsightScope(value.scope)) {
    issues.push(issue("unknown-scope", "scope", `${path}.scope`));
  }
  return result(issues);
}

export function validateRuntimeExecutiveInsightEvidenceCollectionContract(
  value: unknown,
  path = "evidenceCollection",
  knownSubjectIds?: ReadonlySet<string>,
): RuntimeExecutiveInsightContractValidationResult {
  const issues: RuntimeExecutiveInsightContractValidationIssue[] = [];
  if (!isPlainObject(value) || !Array.isArray(value.evidence)) {
    issues.push(issue("missing-evidence-id", "collection", path));
    return result(issues);
  }
  const ids: string[] = [];
  for (let index = 0; index < value.evidence.length; index += 1) {
    const entry = value.evidence[index];
    issues.push(
      ...validateRuntimeExecutiveInsightEvidenceContract(
        entry,
        `${path}.evidence[${index}]`,
        knownSubjectIds,
      ).issues,
    );
    if (isPlainObject(entry) && isNonEmptyString(entry.evidenceId)) {
      ids.push(entry.evidenceId);
    }
  }
  if (!unique(ids)) {
    issues.push(issue("duplicate-evidence-id", "collection", `${path}.evidence`));
  }
  return result(issues);
}

export function validateRuntimeExecutiveInsightSignalCollectionContract(
  value: unknown,
  path = "signalCollection",
  knownEvidenceIds?: ReadonlySet<string>,
  knownSubjectIds?: ReadonlySet<string>,
): RuntimeExecutiveInsightContractValidationResult {
  const issues: RuntimeExecutiveInsightContractValidationIssue[] = [];
  if (!isPlainObject(value) || !Array.isArray(value.signals)) {
    issues.push(issue("missing-signal-id", "collection", path));
    return result(issues);
  }
  const ids: string[] = [];
  for (let index = 0; index < value.signals.length; index += 1) {
    const entry = value.signals[index];
    issues.push(
      ...validateRuntimeExecutiveInsightSignalContract(
        entry,
        `${path}.signals[${index}]`,
        knownEvidenceIds,
        knownSubjectIds,
      ).issues,
    );
    if (isPlainObject(entry) && isNonEmptyString(entry.signalId)) {
      ids.push(entry.signalId);
    }
  }
  if (!unique(ids)) {
    issues.push(issue("duplicate-signal-id", "collection", `${path}.signals`));
  }
  return result(issues);
}

export function validateRuntimeExecutiveInsightContract(
  value: unknown,
): RuntimeExecutiveInsightContractValidationResult {
  const issues: RuntimeExecutiveInsightContractValidationIssue[] = [];
  if (!isPlainObject(value)) {
    issues.push(issue("missing-insight-id", "identity", "insight"));
    return result(issues);
  }

  if (!isPlainObject(value.identity)) {
    issues.push(issue("missing-insight-id", "identity", "identity"));
  } else {
    if (!isNonEmptyString(value.identity.insightId)) {
      issues.push(
        issue("missing-insight-id", "identity", "identity.insightId"),
      );
    }
    if (!isRuntimeExecutiveInsightCategory(value.identity.category)) {
      issues.push(
        issue(
          "unknown-insight-category",
          "identity",
          "identity.category",
        ),
      );
    }
  }

  issues.push(
    ...validateRuntimeExecutiveInsightSubjectContract(
      value.primarySubject,
      "primarySubject",
    ).issues,
  );

  const knownSubjectIds = new Set<string>();
  if (
    isPlainObject(value.primarySubject) &&
    isNonEmptyString(value.primarySubject.subjectId)
  ) {
    knownSubjectIds.add(value.primarySubject.subjectId);
  }

  if (value.relatedSubjects !== undefined) {
    if (!Array.isArray(value.relatedSubjects)) {
      issues.push(
        issue("missing-subject-id", "related-subject", "relatedSubjects"),
      );
    } else {
      for (let index = 0; index < value.relatedSubjects.length; index += 1) {
        const related = value.relatedSubjects[index];
        issues.push(
          ...validateRuntimeExecutiveInsightRelatedSubjectContract(
            related,
            `relatedSubjects[${index}]`,
          ).issues,
        );
        if (
          isPlainObject(related) &&
          isPlainObject(related.subject) &&
          isNonEmptyString(related.subject.subjectId)
        ) {
          knownSubjectIds.add(related.subject.subjectId);
        }
      }
    }
  }

  issues.push(
    ...validateRuntimeExecutiveInsightClassificationContract(
      value.classification,
      "classification",
    ).issues,
  );

  if (
    isPlainObject(value.identity) &&
    isPlainObject(value.classification) &&
    isRuntimeExecutiveInsightCategory(value.identity.category) &&
    isRuntimeExecutiveInsightCategory(value.classification.category) &&
    value.identity.category !== value.classification.category
  ) {
    issues.push(
      issue("category-mismatch", "classification", "classification.category", {
        identityCategory: value.identity.category,
        classificationCategory: value.classification.category,
      }),
    );
  }

  issues.push(
    ...validateRuntimeExecutiveInsightSourceContract(value.source, "source")
      .issues,
  );

  const knownEvidenceIds = new Set<string>();
  if (!Array.isArray(value.evidence)) {
    issues.push(issue("missing-evidence-id", "evidence", "evidence"));
  } else {
    const evidenceIds: string[] = [];
    for (let index = 0; index < value.evidence.length; index += 1) {
      const entry = value.evidence[index];
      issues.push(
        ...validateRuntimeExecutiveInsightEvidenceContract(
          entry,
          `evidence[${index}]`,
          knownSubjectIds,
        ).issues,
      );
      if (isPlainObject(entry) && isNonEmptyString(entry.evidenceId)) {
        evidenceIds.push(entry.evidenceId);
        knownEvidenceIds.add(entry.evidenceId);
      }
    }
    if (!unique(evidenceIds)) {
      issues.push(issue("duplicate-evidence-id", "evidence", "evidence"));
    }
  }

  if (!Array.isArray(value.signals)) {
    issues.push(issue("missing-signal-id", "signal", "signals"));
  } else {
    const signalIds: string[] = [];
    for (let index = 0; index < value.signals.length; index += 1) {
      const entry = value.signals[index];
      issues.push(
        ...validateRuntimeExecutiveInsightSignalContract(
          entry,
          `signals[${index}]`,
          knownEvidenceIds,
          knownSubjectIds,
        ).issues,
      );
      if (isPlainObject(entry) && isNonEmptyString(entry.signalId)) {
        signalIds.push(entry.signalId);
      }
    }
    if (!unique(signalIds)) {
      issues.push(issue("duplicate-signal-id", "signal", "signals"));
    }
  }

  const knownInsightIds = new Set<string>();
  if (
    isPlainObject(value.identity) &&
    isNonEmptyString(value.identity.insightId)
  ) {
    knownInsightIds.add(value.identity.insightId);
  }

  if (value.relationships !== undefined) {
    if (!Array.isArray(value.relationships)) {
      issues.push(
        issue(
          "missing-relationship-id",
          "relationship",
          "relationships",
        ),
      );
    } else {
      const relationshipIds: string[] = [];
      for (let index = 0; index < value.relationships.length; index += 1) {
        const entry = value.relationships[index];
        issues.push(
          ...validateRuntimeExecutiveInsightRelationshipContract(
            entry,
            `relationships[${index}]`,
            knownInsightIds,
            knownSubjectIds,
            knownEvidenceIds,
          ).issues,
        );
        if (isPlainObject(entry) && isNonEmptyString(entry.relationshipId)) {
          relationshipIds.push(entry.relationshipId);
        }
      }
      if (!unique(relationshipIds)) {
        issues.push(
          issue(
            "invalid-relationship-reference",
            "relationship",
            "relationships",
          ),
        );
      }
    }
  }

  if (value.attention !== undefined) {
    if (
      !isPlainObject(value.attention) ||
      !isRuntimeExecutiveInsightAttentionState(value.attention.attentionState)
    ) {
      issues.push(
        issue(
          "unknown-attention-state",
          "attention",
          "attention.attentionState",
        ),
      );
    }
  }

  if (value.lifecycle !== undefined) {
    if (
      !isPlainObject(value.lifecycle) ||
      !isRuntimeExecutiveInsightLifecycleStatus(value.lifecycle.status)
    ) {
      issues.push(
        issue("unknown-lifecycle-status", "lifecycle", "lifecycle.status"),
      );
    }
  }

  if (value.presentationCompatibility !== undefined) {
    if (
      !isPlainObject(value.presentationCompatibility) ||
      !isRuntimeExecutiveInsightPresentationState(
        value.presentationCompatibility.presentationState,
      )
    ) {
      issues.push(
        issue(
          "unknown-presentation-state",
          "presentation",
          "presentationCompatibility.presentationState",
        ),
      );
    } else if (
      typeof value.presentationCompatibility.structurallyEligible !== "boolean"
    ) {
      issues.push(
        issue(
          "unknown-presentation-state",
          "presentation",
          "presentationCompatibility.structurallyEligible",
        ),
      );
    }
  }

  return result(issues);
}

export function validateRuntimeExecutiveInsightCollectionContract(
  value: unknown,
): RuntimeExecutiveInsightContractValidationResult {
  const issues: RuntimeExecutiveInsightContractValidationIssue[] = [];
  if (!isPlainObject(value) || !Array.isArray(value.insights)) {
    issues.push(issue("missing-insight-id", "collection", "insights"));
    return result(issues);
  }

  const insightIds: string[] = [];
  for (let index = 0; index < value.insights.length; index += 1) {
    const entry = value.insights[index];
    issues.push(...validateRuntimeExecutiveInsightContract(entry).issues);
    if (
      isPlainObject(entry) &&
      isPlainObject(entry.identity) &&
      isNonEmptyString(entry.identity.insightId)
    ) {
      insightIds.push(entry.identity.insightId);
    }
  }
  if (!unique(insightIds)) {
    issues.push(issue("duplicate-insight-id", "collection", "insights"));
  }
  return result(issues);
}

export function validateRuntimeExecutiveInsightConfidenceContract(
  value: unknown,
  path = "confidence",
): RuntimeExecutiveInsightContractValidationResult {
  const issues: RuntimeExecutiveInsightContractValidationIssue[] = [];
  if (!isPlainObject(value)) {
    issues.push(issue("invalid-confidence", "confidence", path));
    return result(issues);
  }
  if (!isRuntimeExecutiveInsightConfidence(value.confidence)) {
    issues.push(issue("invalid-confidence", "confidence", `${path}.confidence`));
  }
  if (
    value.evidenceId !== undefined &&
    !isNonEmptyString(value.evidenceId)
  ) {
    issues.push(
      issue("invalid-evidence-reference", "confidence", `${path}.evidenceId`),
    );
  }
  return result(issues);
}

// ─── Freeze / create helpers (structural only) ──────────────────────────────

export function createRuntimeExecutiveInsightSubjectContract(input: {
  readonly subjectId: string;
  readonly kind: RuntimeExecutiveInsightSubjectKind;
  readonly parentId?: string;
  readonly referenceId?: string;
  readonly scope?: RuntimeExecutiveInsightScope;
  readonly label?: string;
}): RuntimeExecutiveInsightSubjectContract {
  const validated = validateRuntimeExecutiveInsightSubjectContract(input);
  if (!validated.valid) {
    throw new TypeError(
      `invalid subject contract: ${validated.issues[0]?.code ?? "unknown"}`,
    );
  }
  return Object.freeze({
    subjectId: input.subjectId,
    kind: input.kind,
    ...(input.parentId !== undefined ? { parentId: input.parentId } : {}),
    ...(input.referenceId !== undefined
      ? { referenceId: input.referenceId }
      : {}),
    ...(input.scope !== undefined ? { scope: input.scope } : {}),
    ...(input.label !== undefined ? { label: input.label } : {}),
  });
}

export function createRuntimeExecutiveInsightSourceContract(input: {
  readonly kind: RuntimeExecutiveInsightSourceKind;
  readonly sourceId?: string;
  readonly systemName?: string;
  readonly reference?: string;
  readonly externalReference?: string;
  readonly packRef?: string;
  readonly modelRef?: string;
  readonly runtimeRef?: string;
}): RuntimeExecutiveInsightSourceContract {
  const validated = validateRuntimeExecutiveInsightSourceContract(input);
  if (!validated.valid) {
    throw new TypeError(
      `invalid source contract: ${validated.issues[0]?.code ?? "unknown"}`,
    );
  }
  return Object.freeze({
    kind: input.kind,
    ...(input.sourceId !== undefined ? { sourceId: input.sourceId } : {}),
    ...(input.systemName !== undefined ? { systemName: input.systemName } : {}),
    ...(input.reference !== undefined ? { reference: input.reference } : {}),
    ...(input.externalReference !== undefined
      ? { externalReference: input.externalReference }
      : {}),
    ...(input.packRef !== undefined ? { packRef: input.packRef } : {}),
    ...(input.modelRef !== undefined ? { modelRef: input.modelRef } : {}),
    ...(input.runtimeRef !== undefined ? { runtimeRef: input.runtimeRef } : {}),
  });
}

export function createRuntimeExecutiveInsightEvidenceContract(input: {
  readonly evidenceId: string;
  readonly kind: RuntimeExecutiveInsightEvidenceKind;
  readonly source: RuntimeExecutiveInsightSourceContract;
  readonly subjectId?: string;
  readonly payload?: RuntimeExecutiveInsightEvidencePayload;
  readonly unit?: string;
  readonly baselineRef?: string;
  readonly observedAtIso?: string;
  readonly freshness?: RuntimeExecutiveInsightFreshness;
  readonly reference?: string;
}): RuntimeExecutiveInsightEvidenceContract {
  const validated = validateRuntimeExecutiveInsightEvidenceContract(input);
  if (!validated.valid) {
    throw new TypeError(
      `invalid evidence contract: ${validated.issues[0]?.code ?? "unknown"}`,
    );
  }
  return Object.freeze({
    evidenceId: input.evidenceId,
    kind: input.kind,
    source: Object.freeze({ ...input.source }),
    ...(input.subjectId !== undefined ? { subjectId: input.subjectId } : {}),
    ...(input.payload !== undefined ? { payload: input.payload } : {}),
    ...(input.unit !== undefined ? { unit: input.unit } : {}),
    ...(input.baselineRef !== undefined
      ? { baselineRef: input.baselineRef }
      : {}),
    ...(input.observedAtIso !== undefined
      ? { observedAtIso: input.observedAtIso }
      : {}),
    ...(input.freshness !== undefined ? { freshness: input.freshness } : {}),
    ...(input.reference !== undefined ? { reference: input.reference } : {}),
  });
}

export function createRuntimeExecutiveInsightSignalContract(input: {
  readonly signalId: string;
  readonly kind: RuntimeExecutiveInsightSignalKind;
  readonly subjectId: string;
  readonly source: RuntimeExecutiveInsightSourceContract;
  readonly evidenceIds?: ReadonlyArray<string>;
  readonly direction?: RuntimeExecutiveInsightDirection;
  readonly confidence?: number;
  readonly freshness?: RuntimeExecutiveInsightFreshness;
  readonly observedAtIso?: string;
  readonly sequence?: number;
}): RuntimeExecutiveInsightSignalContract {
  const candidate = {
    ...input,
    ...(input.confidence !== undefined
      ? { confidence: asConfidence(input.confidence) }
      : {}),
  };
  const validated = validateRuntimeExecutiveInsightSignalContract(candidate);
  if (!validated.valid) {
    throw new TypeError(
      `invalid signal contract: ${validated.issues[0]?.code ?? "unknown"}`,
    );
  }
  return Object.freeze({
    signalId: input.signalId,
    kind: input.kind,
    subjectId: input.subjectId,
    source: Object.freeze({ ...input.source }),
    ...(input.evidenceIds !== undefined
      ? { evidenceIds: Object.freeze([...input.evidenceIds]) }
      : {}),
    ...(input.direction !== undefined ? { direction: input.direction } : {}),
    ...(input.confidence !== undefined
      ? { confidence: asConfidence(input.confidence) }
      : {}),
    ...(input.freshness !== undefined ? { freshness: input.freshness } : {}),
    ...(input.observedAtIso !== undefined
      ? { observedAtIso: input.observedAtIso }
      : {}),
    ...(input.sequence !== undefined ? { sequence: input.sequence } : {}),
  });
}

export function createRuntimeExecutiveInsightRelationshipContract(input: {
  readonly relationshipId: string;
  readonly kind: RuntimeExecutiveInsightRelationshipKind;
  readonly direction: RuntimeExecutiveInsightRelationshipDirection;
  readonly from: RuntimeExecutiveInsightRelationshipEndpointContract;
  readonly to: RuntimeExecutiveInsightRelationshipEndpointContract;
  readonly order?: number;
  readonly evidenceIds?: ReadonlyArray<string>;
}): RuntimeExecutiveInsightRelationshipContract {
  const validated = validateRuntimeExecutiveInsightRelationshipContract(input);
  if (!validated.valid) {
    throw new TypeError(
      `invalid relationship contract: ${validated.issues[0]?.code ?? "unknown"}`,
    );
  }
  return Object.freeze({
    relationshipId: input.relationshipId,
    kind: input.kind,
    direction: input.direction,
    from: Object.freeze({ ...input.from }),
    to: Object.freeze({ ...input.to }),
    ...(input.order !== undefined ? { order: input.order } : {}),
    ...(input.evidenceIds !== undefined
      ? { evidenceIds: Object.freeze([...input.evidenceIds]) }
      : {}),
  });
}

export function createRuntimeExecutiveInsightContract(input: {
  readonly identity: RuntimeExecutiveInsightIdentityContract;
  readonly primarySubject: RuntimeExecutiveInsightSubjectContract;
  readonly relatedSubjects?: ReadonlyArray<RuntimeExecutiveInsightRelatedSubjectContract>;
  readonly classification: RuntimeExecutiveInsightClassificationContract;
  readonly evidence?: ReadonlyArray<RuntimeExecutiveInsightEvidenceContract>;
  readonly signals?: ReadonlyArray<RuntimeExecutiveInsightSignalContract>;
  readonly source: RuntimeExecutiveInsightSourceContract;
  readonly relationships?: ReadonlyArray<RuntimeExecutiveInsightRelationshipContract>;
  readonly attention?: RuntimeExecutiveInsightAttentionContract;
  readonly lifecycle?: RuntimeExecutiveInsightLifecycleContract;
  readonly presentationCompatibility?: RuntimeExecutiveInsightPresentationCompatibilityContract;
}): RuntimeExecutiveInsightContract {
  const contract: RuntimeExecutiveInsightContract = Object.freeze({
    identity: Object.freeze({ ...input.identity }),
    primarySubject: Object.freeze({ ...input.primarySubject }),
    ...(input.relatedSubjects !== undefined
      ? {
          relatedSubjects: Object.freeze(
            input.relatedSubjects.map((entry) =>
              Object.freeze({
                ...entry,
                subject: Object.freeze({ ...entry.subject }),
              }),
            ),
          ),
        }
      : {}),
    classification: Object.freeze({
      ...input.classification,
      confidence: asConfidence(input.classification.confidence),
    }),
    evidence: Object.freeze(
      (input.evidence ?? []).map((entry) => Object.freeze({ ...entry })),
    ),
    signals: Object.freeze(
      (input.signals ?? []).map((entry) => Object.freeze({ ...entry })),
    ),
    source: Object.freeze({ ...input.source }),
    ...(input.relationships !== undefined
      ? {
          relationships: Object.freeze(
            input.relationships.map((entry) =>
              Object.freeze({
                ...entry,
                from: Object.freeze({ ...entry.from }),
                to: Object.freeze({ ...entry.to }),
              }),
            ),
          ),
        }
      : {}),
    ...(input.attention !== undefined
      ? { attention: Object.freeze({ ...input.attention }) }
      : {}),
    ...(input.lifecycle !== undefined
      ? { lifecycle: Object.freeze({ ...input.lifecycle }) }
      : {}),
    ...(input.presentationCompatibility !== undefined
      ? {
          presentationCompatibility: Object.freeze({
            ...input.presentationCompatibility,
          }),
        }
      : {}),
  });

  const validated = validateRuntimeExecutiveInsightContract(contract);
  if (!validated.valid) {
    throw new TypeError(
      `invalid insight contract: ${validated.issues[0]?.code ?? "unknown"}`,
    );
  }
  return contract;
}

export function createRuntimeExecutiveInsightCollectionContract(input: {
  readonly collectionId?: string;
  readonly scopeRef?: string;
  readonly insights: ReadonlyArray<RuntimeExecutiveInsightContract>;
}): RuntimeExecutiveInsightCollectionContract {
  const collection = Object.freeze({
    ...(input.collectionId !== undefined
      ? { collectionId: input.collectionId }
      : {}),
    ...(input.scopeRef !== undefined ? { scopeRef: input.scopeRef } : {}),
    insights: Object.freeze([...input.insights]),
  });
  const validated =
    validateRuntimeExecutiveInsightCollectionContract(collection);
  if (!validated.valid) {
    throw new TypeError(
      `invalid insight collection: ${validated.issues[0]?.code ?? "unknown"}`,
    );
  }
  return collection;
}

export function getRuntimeExecutiveInsightExperienceContractsIdentity():
  typeof runtimeExecutiveInsightExperienceContractsCanonicalIdentity {
  return runtimeExecutiveInsightExperienceContractsCanonicalIdentity;
}

export function getRuntimeExecutiveInsightExperienceContractsRegistry():
  typeof runtimeExecutiveInsightExperienceContractsRegistry {
  return runtimeExecutiveInsightExperienceContractsRegistry;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveInsightExperienceContractsApiNames =
  Object.freeze([
    "getRuntimeExecutiveInsightExperienceContractsIdentity",
    "getRuntimeExecutiveInsightExperienceContractsRegistry",
    "isRuntimeExecutiveInsightRelatedSubjectRole",
    "isRuntimeExecutiveInsightContractFamily",
    "isRuntimeExecutiveInsightContractValidationCode",
    "isRuntimeExecutiveInsightEvidencePayload",
    "validateRuntimeExecutiveInsightSourceContract",
    "validateRuntimeExecutiveInsightSubjectContract",
    "validateRuntimeExecutiveInsightRelatedSubjectContract",
    "validateRuntimeExecutiveInsightEvidenceContract",
    "validateRuntimeExecutiveInsightSignalContract",
    "validateRuntimeExecutiveInsightRelationshipContract",
    "validateRuntimeExecutiveInsightClassificationContract",
    "validateRuntimeExecutiveInsightEvidenceCollectionContract",
    "validateRuntimeExecutiveInsightSignalCollectionContract",
    "validateRuntimeExecutiveInsightContract",
    "validateRuntimeExecutiveInsightCollectionContract",
    "validateRuntimeExecutiveInsightConfidenceContract",
    "createRuntimeExecutiveInsightSubjectContract",
    "createRuntimeExecutiveInsightSourceContract",
    "createRuntimeExecutiveInsightEvidenceContract",
    "createRuntimeExecutiveInsightSignalContract",
    "createRuntimeExecutiveInsightRelationshipContract",
    "createRuntimeExecutiveInsightContract",
    "createRuntimeExecutiveInsightCollectionContract",
    "verifyRuntimeExecutiveInsightExperienceContracts",
  ] as const);

export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACTS_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveInsightIdentityContract",
    "RuntimeExecutiveInsightSubjectContract",
    "RuntimeExecutiveInsightRelatedSubjectContract",
    "RuntimeExecutiveInsightSourceContract",
    "RuntimeExecutiveInsightSeverityContract",
    "RuntimeExecutiveInsightImportanceContract",
    "RuntimeExecutiveInsightConfidenceContract",
    "RuntimeExecutiveInsightFreshnessContract",
    "RuntimeExecutiveInsightScopeContract",
    "RuntimeExecutiveInsightEvidenceContract",
    "RuntimeExecutiveInsightSignalContract",
    "RuntimeExecutiveInsightClassificationContract",
    "RuntimeExecutiveInsightRelationshipEndpointContract",
    "RuntimeExecutiveInsightRelationshipContract",
    "RuntimeExecutiveInsightAttentionContract",
    "RuntimeExecutiveInsightLifecycleContract",
    "RuntimeExecutiveInsightPresentationCompatibilityContract",
    "RuntimeExecutiveInsightEvidenceCollectionContract",
    "RuntimeExecutiveInsightSignalCollectionContract",
    "RuntimeExecutiveInsightContract",
    "RuntimeExecutiveInsightCollectionContract",
    "RuntimeExecutiveInsightEvidencePayload",
    "RuntimeExecutiveInsightRelatedSubjectRole",
    "RuntimeExecutiveInsightContractFamily",
    "RuntimeExecutiveInsightContractValidationCode",
    "RuntimeExecutiveInsightContractValidationArea",
    "RuntimeExecutiveInsightContractValidationIssue",
    "RuntimeExecutiveInsightContractValidationResult",
    "RuntimeExecutiveInsightContractConsumerGuarantee",
    "RuntimeExecutiveInsightExperienceContractsVerification",
  ] as const);

export const RUNTIME_EXECUTIVE_INSIGHT_CONTRACTS_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Dependency",
    "ContractFamilies",
    "ValidationCodes",
    "ValidationAreas",
    "InheritedDomains",
    "PresentationStates",
    "LifecycleStatuses",
    "ConsumerGuarantees",
    "PublicTypes",
    "PublicApis",
  ] as const);

export type RuntimeExecutiveInsightContractsRegistrySection =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_CONTRACTS_REGISTRY_SECTIONS)[number];

export const runtimeExecutiveInsightExperienceContractsRegistry =
  Object.freeze({
    identity: runtimeExecutiveInsightExperienceContractsIdentity,
    version: runtimeExecutiveInsightExperienceContractsVersion,
    namespace: runtimeExecutiveInsightExperienceContractsNamespace,
    layer: runtimeExecutiveInsightExperienceContractsLayer,
    capability: runtimeExecutiveInsightExperienceContractsCapability,
    phase: runtimeExecutiveInsightExperienceContractsPhase,
    status: runtimeExecutiveInsightExperienceContractsStatus,
    dependencyIdentity:
      runtimeExecutiveInsightExperienceContractsDependencyIdentity,
    dependencyPath:
      runtimeExecutiveInsightExperienceContractsDependencyPath,
    supportedImportPath:
      runtimeExecutiveInsightExperienceContractsSupportedImportPath,
    sections: RUNTIME_EXECUTIVE_INSIGHT_CONTRACTS_REGISTRY_SECTIONS,
    sectionCount: RUNTIME_EXECUTIVE_INSIGHT_CONTRACTS_REGISTRY_SECTIONS.length,
    contractFamilies: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_FAMILIES,
    contractFamilyCount: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_FAMILIES.length,
    validationCodes: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_VALIDATION_CODES,
    validationCodeCount:
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_VALIDATION_CODES.length,
    validationAreas: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_VALIDATION_AREAS,
    validationAreaCount:
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_VALIDATION_AREAS.length,
    categories: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_CATEGORIES,
    categoryCount: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_CATEGORIES.length,
    subjectKinds: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SUBJECT_KINDS,
    subjectKindCount: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SUBJECT_KINDS.length,
    evidenceKinds: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_EVIDENCE_KINDS,
    evidenceKindCount: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_EVIDENCE_KINDS.length,
    signalKinds: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SIGNAL_KINDS,
    signalKindCount: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SIGNAL_KINDS.length,
    relationshipKinds: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_RELATIONSHIP_KINDS,
    relationshipKindCount:
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_RELATIONSHIP_KINDS.length,
    lifecycleStatuses: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_LIFECYCLE_STATUSES,
    lifecycleStatusCount:
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_LIFECYCLE_STATUSES.length,
    presentationStates: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_PRESENTATION_STATES,
    presentationStateCount:
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_PRESENTATION_STATES.length,
    consumerGuarantees: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_CONSUMER_GUARANTEES,
    consumerGuaranteeCount:
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_CONSUMER_GUARANTEES.length,
    publicTypes: RUNTIME_EXECUTIVE_INSIGHT_CONTRACTS_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACTS_PUBLIC_TYPE_NAMES.length,
    publicApis: runtimeExecutiveInsightExperienceContractsApiNames,
    publicApiCount:
      runtimeExecutiveInsightExperienceContractsApiNames.length,
    validationApiNames: Object.freeze(
      runtimeExecutiveInsightExperienceContractsApiNames.filter((name) =>
        name.startsWith("validate"),
      ),
    ),
    validationApiCount:
      runtimeExecutiveInsightExperienceContractsApiNames.filter((name) =>
        name.startsWith("validate"),
      ).length,
  });

export const runtimeExecutiveInsightExperienceContracts = Object.freeze({
  phase: "Contracts" as const,
  name: "RuntimeExecutiveInsightExperienceContracts" as const,
  identity: runtimeExecutiveInsightExperienceContractsIdentity,
  version: runtimeExecutiveInsightExperienceContractsVersion,
  namespace: runtimeExecutiveInsightExperienceContractsNamespace,
  layer: runtimeExecutiveInsightExperienceContractsLayer,
  capability: runtimeExecutiveInsightExperienceContractsCapability,
  architecturalRole:
    runtimeExecutiveInsightExperienceContractsArchitecturalRole,
  role: "Contracts" as const,
  status: runtimeExecutiveInsightExperienceContractsStatus,
  upstreamDependency:
    runtimeExecutiveInsightExperienceContractsDependencyIdentity,
  dependencyPath:
    runtimeExecutiveInsightExperienceContractsDependencyPath,
  supportedImportPath:
    runtimeExecutiveInsightExperienceContractsSupportedImportPath,
  deterministic: runtimeExecutiveInsightExperienceContractsDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  aiProviderIndependent: true as const,
  browserIndependent: true as const,
  principle: RUNTIME_EXECUTIVE_INSIGHT_CONTRACTS_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_INSIGHT_CONTRACTS_BOUNDARY,
  contractFamilies: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_FAMILIES,
  validationCodes: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_VALIDATION_CODES,
  consumerGuarantees: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_CONSUMER_GUARANTEES,
  categories: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_CATEGORIES,
  subjectKinds: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SUBJECT_KINDS,
  evidenceKinds: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_EVIDENCE_KINDS,
  signalKinds: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SIGNAL_KINDS,
  relationshipKinds: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_RELATIONSHIP_KINDS,
  lifecycleStatuses: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_LIFECYCLE_STATUSES,
  presentationStates: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_PRESENTATION_STATES,
  presentationStateSemantics:
    RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_PRESENTATION_STATE_SEMANTICS,
  publicTypeNames: RUNTIME_EXECUTIVE_INSIGHT_CONTRACTS_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveInsightExperienceContractsApiNames,
  registry: runtimeExecutiveInsightExperienceContractsRegistry,
  foundationBoundary: "REX-4:1-foundation-only" as const,
  architecturalStatus:
    "REX-4:2 Runtime Executive Insight Experience Contracts — ContractsReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveInsightExperienceContractsVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveInsightExperienceContractsIdentity;
  readonly version: typeof runtimeExecutiveInsightExperienceContractsVersion;
  readonly namespace: typeof runtimeExecutiveInsightExperienceContractsNamespace;
  readonly layer: typeof runtimeExecutiveInsightExperienceContractsLayer;
  readonly capability: typeof runtimeExecutiveInsightExperienceContractsCapability;
  readonly phase: typeof runtimeExecutiveInsightExperienceContractsPhase;
  readonly status: typeof runtimeExecutiveInsightExperienceContractsStatus;
  readonly dependencyIdentity: typeof runtimeExecutiveInsightExperienceContractsDependencyIdentity;
  readonly contractFamilyCount: number;
  readonly validationCodeCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly validationApiCount: number;
  readonly categoryCount: number;
  readonly subjectKindCount: number;
  readonly evidenceKindCount: number;
  readonly signalKindCount: number;
  readonly relationshipKindCount: number;
  readonly lifecycleStatusCount: number;
  readonly presentationStateCount: number;
  readonly sectionCount: number;
  readonly frozen: boolean;
  readonly foundationBoundaryIntact: boolean;
  readonly reusesFoundationVocabularies: boolean;
  readonly upstreamFoundationOk: boolean;
  readonly noKor: boolean;
  readonly kpiSupported: boolean;
  readonly koiSupported: boolean;
  readonly confidenceBoundsEnforced: boolean;
}

export function verifyRuntimeExecutiveInsightExperienceContracts():
  RuntimeExecutiveInsightExperienceContractsVerification {
  const contractsModule = runtimeExecutiveInsightExperienceContracts;
  const registry = runtimeExecutiveInsightExperienceContractsRegistry;
  const upstream = verifyRuntimeExecutiveInsightExperienceFoundation();

  const identityOk =
    contractsModule.identity ===
      "REX-4:2/RuntimeExecutiveInsightExperienceContracts" &&
    contractsModule.version === "4.2.0" &&
    contractsModule.namespace ===
      "nexora.rex.insight-experience.contracts" &&
    contractsModule.layer === "REX" &&
    contractsModule.capability === "RuntimeExecutiveInsightExperience" &&
    contractsModule.phase === "Contracts" &&
    contractsModule.status === "ContractsReady" &&
    contractsModule.upstreamDependency ===
      "REX-4:1/RuntimeExecutiveInsightExperienceFoundation" &&
    contractsModule.upstreamDependency ===
      runtimeExecutiveInsightExperienceFoundationIdentity &&
    contractsModule.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveInsightExperienceFoundation" &&
    contractsModule.foundationBoundary === "REX-4:1-foundation-only";

  const reusesFoundationVocabularies =
    RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_CATEGORIES ===
      RUNTIME_EXECUTIVE_INSIGHT_CATEGORIES &&
    RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SUBJECT_KINDS ===
      RUNTIME_EXECUTIVE_INSIGHT_SUBJECT_KINDS &&
    RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_EVIDENCE_KINDS ===
      RUNTIME_EXECUTIVE_INSIGHT_EVIDENCE_KINDS &&
    RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SIGNAL_KINDS ===
      RUNTIME_EXECUTIVE_INSIGHT_SIGNAL_KINDS &&
    RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_RELATIONSHIP_KINDS ===
      RUNTIME_EXECUTIVE_INSIGHT_RELATIONSHIP_KINDS &&
    RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_PRESENTATION_STATES ===
      RUNTIME_EXECUTIVE_INSIGHT_PRESENTATION_STATES &&
    RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_LIFECYCLE_STATUSES ===
      RUNTIME_EXECUTIVE_INSIGHT_LIFECYCLE_STATUSES;

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_FAMILIES], [
      "InsightIdentity",
      "InsightSubject",
      "RelatedSubject",
      "Evidence",
      "EvidenceCollection",
      "Signal",
      "SignalCollection",
      "Classification",
      "Severity",
      "Importance",
      "Confidence",
      "Freshness",
      "Scope",
      "Source",
      "Relationship",
      "Attention",
      "Lifecycle",
      "PresentationCompatibility",
      "ExecutiveInsight",
      "InsightCollection",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_VALIDATION_CODES], [
      "missing-insight-id",
      "unknown-insight-category",
      "unknown-subject-kind",
      "missing-subject-id",
      "duplicate-evidence-id",
      "unknown-evidence-kind",
      "duplicate-signal-id",
      "unknown-signal-kind",
      "invalid-confidence",
      "unknown-direction",
      "unknown-severity",
      "unknown-importance",
      "unknown-freshness",
      "unknown-scope",
      "unknown-source-kind",
      "unknown-relationship-kind",
      "invalid-relationship-reference",
      "unknown-attention-state",
      "unknown-presentation-state",
      "duplicate-insight-id",
      "missing-evidence-id",
      "missing-signal-id",
      "missing-relationship-id",
      "unknown-relationship-direction",
      "unknown-lifecycle-status",
      "invalid-evidence-reference",
      "invalid-subject-reference",
      "invalid-payload",
      "unknown-related-subject-role",
      "category-mismatch",
      "invalid-related-subject-order",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_PRESENTATION_STATES], [
      "minimum",
      "report",
      "operation",
    ]);

  const forbiddenIndexTerm = ["k", "o", "r"].join("") as never;
  const noKor =
    !RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SUBJECT_KINDS.includes(
      forbiddenIndexTerm,
    ) &&
    RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SUBJECT_KIND_SEMANTICS.introducesKor ===
      false &&
    RUNTIME_EXECUTIVE_INSIGHT_CONTRACTS_BOUNDARY.introducesKor === false;

  const kpiSupported =
    RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SUBJECT_KINDS.includes("kpi");
  const koiSupported =
    RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SUBJECT_KINDS.includes("koi");

  const confidenceBoundsEnforced =
    isRuntimeExecutiveInsightConfidence(0) &&
    isRuntimeExecutiveInsightConfidence(1) &&
    !isRuntimeExecutiveInsightConfidence(-0.01) &&
    !isRuntimeExecutiveInsightConfidence(1.01) &&
    validateRuntimeExecutiveInsightConfidenceContract({
      confidence: asConfidence(0),
    }).valid &&
    validateRuntimeExecutiveInsightConfidenceContract({
      confidence: asConfidence(1),
    }).valid &&
    !validateRuntimeExecutiveInsightConfidenceContract({
      confidence: asConfidence(-0.1),
    }).valid &&
    !validateRuntimeExecutiveInsightConfidenceContract({
      confidence: asConfidence(1.1),
    }).valid;

  const registryCountsOk =
    registry.contractFamilyCount ===
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_FAMILIES.length &&
    registry.validationCodeCount ===
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_VALIDATION_CODES.length &&
    registry.categoryCount ===
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_CATEGORIES.length &&
    registry.subjectKindCount ===
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SUBJECT_KINDS.length &&
    registry.evidenceKindCount ===
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_EVIDENCE_KINDS.length &&
    registry.signalKindCount ===
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SIGNAL_KINDS.length &&
    registry.relationshipKindCount ===
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_RELATIONSHIP_KINDS.length &&
    registry.lifecycleStatusCount ===
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_LIFECYCLE_STATUSES.length &&
    registry.presentationStateCount ===
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_PRESENTATION_STATES.length &&
    registry.publicApiCount ===
      runtimeExecutiveInsightExperienceContractsApiNames.length &&
    registry.publicTypeCount ===
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACTS_PUBLIC_TYPE_NAMES.length &&
    registry.sectionCount ===
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACTS_REGISTRY_SECTIONS.length;

  const frozen =
    Object.isFrozen(contractsModule) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(
      runtimeExecutiveInsightExperienceContractsCanonicalIdentity,
    ) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_FAMILIES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_VALIDATION_CODES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_CONSUMER_GUARANTEES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_CONTRACTS_BOUNDARY) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_RELATED_SUBJECT_ROLES);

  const foundationBoundaryIntact =
    contractsModule.boundary.soleImmediateDependency ===
      "REX-4:1/RuntimeExecutiveInsightExperienceFoundation" &&
    contractsModule.boundary.consumesFoundationOnly === true &&
    contractsModule.boundary.importsRex4LaterDirectly === false &&
    contractsModule.boundary.importsRex3Directly === false &&
    contractsModule.boundary.importsRex2Directly === false &&
    contractsModule.boundary.importsRex1Directly === false &&
    contractsModule.boundary.introducesInference === false &&
    contractsModule.boundary.introducesRanking === false &&
    contractsModule.boundary.introducesPresentationResolution === false &&
    contractsModule.boundary.introducesLlmGeneration === false &&
    contractsModule.boundary.introducesKor === false;

  const ok =
    identityOk &&
    vocabOk &&
    reusesFoundationVocabularies &&
    noKor &&
    kpiSupported &&
    koiSupported &&
    confidenceBoundsEnforced &&
    registryCountsOk &&
    frozen &&
    foundationBoundaryIntact &&
    upstream.ok === true &&
    contractsModule.principle === RUNTIME_EXECUTIVE_INSIGHT_CONTRACTS_PRINCIPLE;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveInsightExperienceContractsIdentity,
    version: runtimeExecutiveInsightExperienceContractsVersion,
    namespace: runtimeExecutiveInsightExperienceContractsNamespace,
    layer: runtimeExecutiveInsightExperienceContractsLayer,
    capability: runtimeExecutiveInsightExperienceContractsCapability,
    phase: runtimeExecutiveInsightExperienceContractsPhase,
    status: runtimeExecutiveInsightExperienceContractsStatus,
    dependencyIdentity:
      runtimeExecutiveInsightExperienceContractsDependencyIdentity,
    contractFamilyCount: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_FAMILIES.length,
    validationCodeCount:
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_VALIDATION_CODES.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACTS_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      runtimeExecutiveInsightExperienceContractsApiNames.length,
    validationApiCount: registry.validationApiCount,
    categoryCount: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_CATEGORIES.length,
    subjectKindCount: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SUBJECT_KINDS.length,
    evidenceKindCount: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_EVIDENCE_KINDS.length,
    signalKindCount: RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SIGNAL_KINDS.length,
    relationshipKindCount:
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_RELATIONSHIP_KINDS.length,
    lifecycleStatusCount:
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_LIFECYCLE_STATUSES.length,
    presentationStateCount:
      RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_PRESENTATION_STATES.length,
    sectionCount: RUNTIME_EXECUTIVE_INSIGHT_CONTRACTS_REGISTRY_SECTIONS.length,
    frozen,
    foundationBoundaryIntact,
    reusesFoundationVocabularies,
    upstreamFoundationOk: upstream.ok === true,
    noKor,
    kpiSupported,
    koiSupported,
    confidenceBoundsEnforced,
  });
}
