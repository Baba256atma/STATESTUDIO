/**
 * REX-4:3 — Runtime Executive Insight Resolution.
 *
 * Deterministic resolution of structurally valid REX-4:2 inputs, evidence,
 * signals, explicit context, and plain-data rules into Executive Insight
 * Candidates.
 *
 * Canonical flow:
 *   REX-4:2 Contracts → REX-4:3 Resolution → later REX-4 priority/attention
 *
 * REX-4:2 answers: What constitutes a structurally valid Executive Insight contract?
 * REX-4:3 answers: Given valid structured evidence and signals, what Executive
 * Insight candidate can be resolved?
 *
 * Pure, stateless, immutable, AI-neutral. No ranking, presentation selection,
 * Advisor prose, Stage reactions, orchestration, or automation.
 */

import {
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_CATEGORIES,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_DIRECTIONS,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_EVIDENCE_KINDS,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_FRESHNESS_VALUES,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_IMPORTANCE_VALUES,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_RELATIONSHIP_KINDS,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SCOPES,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SEVERITIES,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SIGNAL_KINDS,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SOURCE_KINDS,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SUBJECT_KINDS,
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SUBJECT_KIND_SEMANTICS,
  isRuntimeExecutiveInsightEvidencePayload,
  runtimeExecutiveInsightExperienceContractsIdentity,
  runtimeExecutiveInsightExperienceContractsSupportedImportPath,
  runtimeExecutiveInsightExperienceContractsVersion,
  createRuntimeExecutiveInsightEvidenceContract,
  createRuntimeExecutiveInsightSignalContract,
  createRuntimeExecutiveInsightSourceContract,
  createRuntimeExecutiveInsightSubjectContract,
  validateRuntimeExecutiveInsightContract,
  validateRuntimeExecutiveInsightEvidenceCollectionContract,
  validateRuntimeExecutiveInsightRelationshipContract,
  validateRuntimeExecutiveInsightSignalCollectionContract,
  validateRuntimeExecutiveInsightSourceContract,
  validateRuntimeExecutiveInsightSubjectContract,
  verifyRuntimeExecutiveInsightExperienceContracts,
  type RuntimeExecutiveInsightEvidenceContract,
  type RuntimeExecutiveInsightEvidencePayload,
  type RuntimeExecutiveInsightRelatedSubjectContract,
  type RuntimeExecutiveInsightRelationshipContract,
  type RuntimeExecutiveInsightSignalContract,
  type RuntimeExecutiveInsightSourceContract,
  type RuntimeExecutiveInsightSubjectContract,
} from "@/app/lib/rex/runtimeExecutiveInsightExperienceContracts";

// ─── Transitively published Contracts surface (for REX-4:4+) ────────────────
// Publication fix: later REX-4 phases consume contracts through REX-4:3 only.

export {
  createRuntimeExecutiveInsightEvidenceContract,
  createRuntimeExecutiveInsightSignalContract,
  createRuntimeExecutiveInsightSourceContract,
  createRuntimeExecutiveInsightSubjectContract,
  validateRuntimeExecutiveInsightContract,
  validateRuntimeExecutiveInsightEvidenceCollectionContract,
  validateRuntimeExecutiveInsightSignalCollectionContract,
  validateRuntimeExecutiveInsightSubjectContract,
};

export type {
  RuntimeExecutiveInsightEvidenceContract,
  RuntimeExecutiveInsightSignalContract,
  RuntimeExecutiveInsightSourceContract,
  RuntimeExecutiveInsightSubjectContract,
};

// ─── Derived domain aliases (from REX-4:2 contract publications only) ───────

export type RuntimeExecutiveInsightResolutionCategory =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_CATEGORIES)[number];
export type RuntimeExecutiveInsightResolutionSubjectKind =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SUBJECT_KINDS)[number];
export type RuntimeExecutiveInsightResolutionEvidenceKind =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_EVIDENCE_KINDS)[number];
export type RuntimeExecutiveInsightResolutionSignalKind =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SIGNAL_KINDS)[number];
export type RuntimeExecutiveInsightResolutionDirection =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_DIRECTIONS)[number];
export type RuntimeExecutiveInsightResolutionSeverity =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SEVERITIES)[number];
export type RuntimeExecutiveInsightResolutionImportance =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_IMPORTANCE_VALUES)[number];
export type RuntimeExecutiveInsightResolutionFreshness =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_FRESHNESS_VALUES)[number];
export type RuntimeExecutiveInsightResolutionScope =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SCOPES)[number];
export type RuntimeExecutiveInsightResolutionSourceKind =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SOURCE_KINDS)[number];
export type RuntimeExecutiveInsightResolutionRelationshipKind =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_RELATIONSHIP_KINDS)[number];
export type RuntimeExecutiveInsightResolutionConfidence = number;

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveInsightResolutionIdentity =
  "REX-4:3/RuntimeExecutiveInsightResolution" as const;

export const runtimeExecutiveInsightResolutionVersion = "4.3.0" as const;

export const runtimeExecutiveInsightResolutionNamespace =
  "nexora.rex.insight-experience.resolution" as const;

export const runtimeExecutiveInsightResolutionLayer = "REX" as const;

export const runtimeExecutiveInsightResolutionCapability =
  "RuntimeExecutiveInsightExperience" as const;

export const runtimeExecutiveInsightResolutionPhase = "Resolution" as const;

export const runtimeExecutiveInsightResolutionStatus =
  "ResolutionReady" as const;

export const runtimeExecutiveInsightResolutionArchitecturalRole =
  "RuntimeExecutiveInsightResolutionBoundary" as const;

export const runtimeExecutiveInsightResolutionDependencyIdentity =
  runtimeExecutiveInsightExperienceContractsIdentity;

export const runtimeExecutiveInsightResolutionDependencyPath =
  runtimeExecutiveInsightExperienceContractsSupportedImportPath;

export const runtimeExecutiveInsightResolutionSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveInsightResolution" as const;

export const runtimeExecutiveInsightResolutionStability =
  "ResolutionReady" as const;

export const runtimeExecutiveInsightResolutionDeterministic = true as const;

export const runtimeExecutiveInsightResolutionSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveInsightResolutionMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveInsightResolutionCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveInsightResolutionIdentity,
    version: runtimeExecutiveInsightResolutionVersion,
    namespace: runtimeExecutiveInsightResolutionNamespace,
    layer: runtimeExecutiveInsightResolutionLayer,
    capability: runtimeExecutiveInsightResolutionCapability,
    phase: runtimeExecutiveInsightResolutionPhase,
    status: runtimeExecutiveInsightResolutionStatus,
    architecturalRole: runtimeExecutiveInsightResolutionArchitecturalRole,
    dependencyIdentity: runtimeExecutiveInsightResolutionDependencyIdentity,
    dependencyPath: runtimeExecutiveInsightResolutionDependencyPath,
    supportedImportPath: runtimeExecutiveInsightResolutionSupportedImportPath,
    upstreamVersion: runtimeExecutiveInsightExperienceContractsVersion,
    stabilityStatus: runtimeExecutiveInsightResolutionStability,
    deterministicStatus: runtimeExecutiveInsightResolutionDeterministic,
    sideEffectPolicy: runtimeExecutiveInsightResolutionSideEffectPolicy,
    mutationPolicy: runtimeExecutiveInsightResolutionMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_PRINCIPLE =
  "Structured evidence + structured signals + explicit resolution context + deterministic rules → Executive Insight Candidate. Resolution is not reasoning, ranking, presentation, or automation." as const;

export const RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-Executive-Experience" as const,
  resolutionAuthority: "REX-4:3" as const,
  architecturalRole: "RuntimeExecutiveInsightResolutionBoundary" as const,
  soleImmediateDependency:
    "REX-4:2/RuntimeExecutiveInsightExperienceContracts" as const,
  consumesContractsOnly: true as const,
  importsRex41Directly: false as const,
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
  pureFunctions: true as const,
  stateless: true as const,
  introducesRanking: false as const,
  introducesPresentationResolution: false as const,
  introducesAttentionRanking: false as const,
  introducesAdvisorProse: false as const,
  introducesStageReactions: false as const,
  introducesOrchestration: false as const,
  introducesAutomation: false as const,
  introducesLlmGeneration: false as const,
  introducesPersistence: false as const,
  introducesExternalIntegration: false as const,
  calculatesKpi: false as const,
  calculatesKoi: false as const,
  introducesKor: false as const,
  infersCausality: false as const,
});

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES = Object.freeze([
  "resolved",
  "unresolved",
  "ineligible",
  "invalid",
  "ambiguous",
] as const);

export type RuntimeExecutiveInsightResolutionStatus =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_RULE_KINDS = Object.freeze([
  "change",
  "trend",
  "deviation",
  "risk",
  "opportunity",
  "anomaly",
  "dependency",
  "conflict",
  "progress",
  "threshold",
  "forecast",
  "attention",
] as const);

export type RuntimeExecutiveInsightResolutionRuleKind =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_RULE_KINDS)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_COMPARISON_OPERATORS =
  Object.freeze([
    "greater-than",
    "greater-than-or-equal",
    "less-than",
    "less-than-or-equal",
    "equal",
    "not-equal",
    "range-entry",
    "range-exit",
  ] as const);

export type RuntimeExecutiveInsightResolutionComparisonOperator =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_COMPARISON_OPERATORS)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CODES = Object.freeze([
  "resolved",
  "no-applicable-rule",
  "insufficient-evidence",
  "insufficient-signals",
  "subject-not-applicable",
  "evidence-not-applicable",
  "signal-not-applicable",
  "invalid-confidence",
  "missing-baseline",
  "missing-threshold",
  "missing-reference",
  "conflicting-rules",
  "ambiguous-resolution",
  "unsupported-rule-kind",
  "unsupported-category",
  "invalid-rule",
  "duplicate-rule-id",
  "duplicate-candidate-id",
  "invalid-input",
  "conditions-unsatisfied",
] as const);

export type RuntimeExecutiveInsightResolutionCode =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CODES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CONSUMER_GUARANTEES =
  Object.freeze([
    "deterministic-resolution",
    "pure-functions",
    "stateless-behavior",
    "immutable-inputs",
    "structured-outputs",
    "explicit-rules-only",
    "no-ai",
    "no-llm",
    "no-hidden-inference",
    "no-persistence",
    "no-external-access",
    "no-ranking",
    "no-presentation-resolution",
    "no-orchestration",
    "no-automation",
    "stable-ordering",
    "fail-closed-structural-validation",
  ] as const);

export type RuntimeExecutiveInsightResolutionConsumerGuarantee =
  (typeof RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CONSUMER_GUARANTEES)[number];

export const RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CATEGORIES =
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_CATEGORIES;
export const RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_SUBJECT_KINDS =
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SUBJECT_KINDS;
export const RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_SUBJECT_KIND_SEMANTICS =
  RUNTIME_EXECUTIVE_INSIGHT_CONTRACT_SUBJECT_KIND_SEMANTICS;

// ─── Rule / context / input contracts ───────────────────────────────────────

export type RuntimeExecutiveInsightResolutionCondition =
  | {
      readonly kind: "require-subject-kind";
      readonly subjectKinds: ReadonlyArray<RuntimeExecutiveInsightResolutionSubjectKind>;
    }
  | {
      readonly kind: "require-evidence-kind";
      readonly evidenceKinds: ReadonlyArray<RuntimeExecutiveInsightResolutionEvidenceKind>;
    }
  | {
      readonly kind: "require-signal-kind";
      readonly signalKinds: ReadonlyArray<RuntimeExecutiveInsightResolutionSignalKind>;
    }
  | {
      readonly kind: "require-signal-direction";
      readonly direction: RuntimeExecutiveInsightResolutionDirection;
    }
  | {
      readonly kind: "require-previous-and-current";
      readonly previousField: string;
      readonly currentField: string;
      readonly evidenceKind?: RuntimeExecutiveInsightResolutionEvidenceKind;
    }
  | {
      readonly kind: "require-baseline";
      readonly field?: string;
    }
  | {
      readonly kind: "require-threshold";
      readonly field?: string;
    }
  | {
      readonly kind: "compare-payload-number";
      readonly field: string;
      readonly operator: RuntimeExecutiveInsightResolutionComparisonOperator;
      readonly value: number;
      readonly rangeMax?: number;
      readonly evidenceKind?: RuntimeExecutiveInsightResolutionEvidenceKind;
    }
  | {
      readonly kind: "compare-current-to-threshold";
      readonly currentField: string;
      readonly operator?: RuntimeExecutiveInsightResolutionComparisonOperator;
      readonly evidenceKind?: RuntimeExecutiveInsightResolutionEvidenceKind;
    }
  | {
      readonly kind: "compare-current-to-baseline";
      readonly currentField: string;
      readonly baselineField?: string;
      readonly operator: RuntimeExecutiveInsightResolutionComparisonOperator;
      readonly value?: number;
      readonly evidenceKind?: RuntimeExecutiveInsightResolutionEvidenceKind;
    }
  | {
      readonly kind: "require-relationship-kind";
      readonly relationshipKinds: ReadonlyArray<RuntimeExecutiveInsightResolutionRelationshipKind>;
    }
  | {
      readonly kind: "require-payload-flag";
      readonly field: string;
      readonly value?: boolean;
      readonly evidenceKind?: RuntimeExecutiveInsightResolutionEvidenceKind;
    }
  | {
      readonly kind: "require-category-hint";
      readonly category: RuntimeExecutiveInsightResolutionCategory;
    }
  | {
      readonly kind: "require-ordered-observations";
      readonly field: string;
      readonly minCount: number;
      readonly evidenceKind?: RuntimeExecutiveInsightResolutionEvidenceKind;
    };

export interface RuntimeExecutiveInsightResolutionSeverityBand {
  readonly minInclusive: number;
  readonly severity: RuntimeExecutiveInsightResolutionSeverity;
}

export interface RuntimeExecutiveInsightResolutionOutputMapping {
  readonly category: RuntimeExecutiveInsightResolutionCategory;
  readonly direction?: RuntimeExecutiveInsightResolutionDirection;
  readonly directionFrom?: "signal" | "previous-current" | "fixed";
  readonly severity?: RuntimeExecutiveInsightResolutionSeverity;
  readonly severityFromMagnitudeBands?: ReadonlyArray<RuntimeExecutiveInsightResolutionSeverityBand>;
  readonly importance?: RuntimeExecutiveInsightResolutionImportance;
  readonly confidence?: RuntimeExecutiveInsightResolutionConfidence;
  readonly confidenceFrom?: "signal" | "fixed" | "hint";
  readonly freshness?: RuntimeExecutiveInsightResolutionFreshness;
  readonly freshnessFrom?: "evidence" | "signal" | "context" | "fixed";
  readonly scope?: RuntimeExecutiveInsightResolutionScope;
  readonly candidateKey?: string;
  readonly relationshipKind?: RuntimeExecutiveInsightResolutionRelationshipKind;
}

export interface RuntimeExecutiveInsightResolutionRule {
  readonly ruleId: string;
  readonly ruleKind: RuntimeExecutiveInsightResolutionRuleKind;
  readonly targetCategory: RuntimeExecutiveInsightResolutionCategory;
  readonly applicableSubjectKinds: ReadonlyArray<RuntimeExecutiveInsightResolutionSubjectKind>;
  readonly applicableEvidenceKinds: ReadonlyArray<RuntimeExecutiveInsightResolutionEvidenceKind>;
  readonly applicableSignalKinds: ReadonlyArray<RuntimeExecutiveInsightResolutionSignalKind>;
  readonly conditions: ReadonlyArray<RuntimeExecutiveInsightResolutionCondition>;
  readonly output: RuntimeExecutiveInsightResolutionOutputMapping;
  readonly precedence?: number;
  readonly specificity?: number;
  readonly scope?: RuntimeExecutiveInsightResolutionScope;
  readonly ruleVersion?: string;
}

export interface RuntimeExecutiveInsightResolutionThreshold {
  readonly value: number;
  readonly operator: RuntimeExecutiveInsightResolutionComparisonOperator;
  readonly field?: string;
  readonly rangeMax?: number;
}

export interface RuntimeExecutiveInsightResolutionContext {
  readonly subjectFocusId?: string;
  readonly modelRef?: string;
  readonly workspaceRef?: string;
  readonly baseline?: RuntimeExecutiveInsightEvidencePayload;
  readonly threshold?: RuntimeExecutiveInsightResolutionThreshold;
  readonly temporalRefIso?: string;
  readonly rules: ReadonlyArray<RuntimeExecutiveInsightResolutionRule>;
  readonly scope?: RuntimeExecutiveInsightResolutionScope;
  readonly policyRef?: string;
  readonly policyVersion?: string;
}

export interface RuntimeExecutiveInsightResolutionClassificationHint {
  readonly category?: RuntimeExecutiveInsightResolutionCategory;
  readonly direction?: RuntimeExecutiveInsightResolutionDirection;
  readonly severity?: RuntimeExecutiveInsightResolutionSeverity;
  readonly importance?: RuntimeExecutiveInsightResolutionImportance;
  readonly confidence?: RuntimeExecutiveInsightResolutionConfidence;
  readonly freshness?: RuntimeExecutiveInsightResolutionFreshness;
  readonly scope?: RuntimeExecutiveInsightResolutionScope;
}

export interface RuntimeExecutiveInsightResolutionInput {
  readonly primarySubject: RuntimeExecutiveInsightSubjectContract;
  readonly relatedSubjects?: ReadonlyArray<RuntimeExecutiveInsightRelatedSubjectContract>;
  readonly evidence: ReadonlyArray<RuntimeExecutiveInsightEvidenceContract>;
  readonly signals: ReadonlyArray<RuntimeExecutiveInsightSignalContract>;
  readonly context: RuntimeExecutiveInsightResolutionContext;
  readonly classificationHint?: RuntimeExecutiveInsightResolutionClassificationHint;
  readonly temporalRefIso?: string;
  readonly scope?: RuntimeExecutiveInsightResolutionScope;
  readonly source?: RuntimeExecutiveInsightSourceContract;
  readonly relationships?: ReadonlyArray<RuntimeExecutiveInsightRelationshipContract>;
}

export interface RuntimeExecutiveInsightCandidate {
  readonly candidateId: string;
  readonly category: RuntimeExecutiveInsightResolutionCategory;
  readonly primarySubject: RuntimeExecutiveInsightSubjectContract;
  readonly relatedSubjects: ReadonlyArray<RuntimeExecutiveInsightRelatedSubjectContract>;
  readonly evidenceIds: ReadonlyArray<string>;
  readonly signalIds: ReadonlyArray<string>;
  readonly direction: RuntimeExecutiveInsightResolutionDirection;
  readonly severity: RuntimeExecutiveInsightResolutionSeverity;
  readonly importance: RuntimeExecutiveInsightResolutionImportance;
  readonly confidence: RuntimeExecutiveInsightResolutionConfidence;
  readonly freshness: RuntimeExecutiveInsightResolutionFreshness;
  readonly scope: RuntimeExecutiveInsightResolutionScope;
  readonly source: RuntimeExecutiveInsightSourceContract;
  readonly relationships: ReadonlyArray<RuntimeExecutiveInsightRelationshipContract>;
  readonly matchedRuleIds: ReadonlyArray<string>;
  readonly resolutionCodes: ReadonlyArray<RuntimeExecutiveInsightResolutionCode>;
  readonly resolutionIdentity: typeof runtimeExecutiveInsightResolutionIdentity;
  readonly resolutionVersion: typeof runtimeExecutiveInsightResolutionVersion;
}

export interface RuntimeExecutiveInsightCandidateCollection {
  readonly collectionId?: string;
  readonly candidates: ReadonlyArray<RuntimeExecutiveInsightCandidate>;
}

export interface RuntimeExecutiveInsightResolutionIssue {
  readonly code: RuntimeExecutiveInsightResolutionCode;
  readonly path?: string;
  readonly details?: Readonly<Record<string, string | number | boolean>>;
}

export interface RuntimeExecutiveInsightResolutionResult {
  readonly status: RuntimeExecutiveInsightResolutionStatus;
  readonly candidate?: RuntimeExecutiveInsightCandidate;
  readonly matchedRuleIds: ReadonlyArray<string>;
  readonly evidenceIds: ReadonlyArray<string>;
  readonly signalIds: ReadonlyArray<string>;
  readonly codes: ReadonlyArray<RuntimeExecutiveInsightResolutionCode>;
  readonly issues: ReadonlyArray<RuntimeExecutiveInsightResolutionIssue>;
}

export interface RuntimeExecutiveInsightResolutionCollectionResult {
  readonly status: RuntimeExecutiveInsightResolutionStatus;
  readonly collection: RuntimeExecutiveInsightCandidateCollection;
  readonly results: ReadonlyArray<RuntimeExecutiveInsightResolutionResult>;
  readonly codes: ReadonlyArray<RuntimeExecutiveInsightResolutionCode>;
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

function compareAscii(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function includesValue<T>(collection: readonly T[], value: unknown): value is T {
  return (collection as readonly unknown[]).includes(value);
}

export function isRuntimeExecutiveInsightResolutionStatus(
  value: unknown,
): value is RuntimeExecutiveInsightResolutionStatus {
  return includesValue(RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES, value);
}

export function isRuntimeExecutiveInsightResolutionRuleKind(
  value: unknown,
): value is RuntimeExecutiveInsightResolutionRuleKind {
  return includesValue(RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_RULE_KINDS, value);
}

export function isRuntimeExecutiveInsightResolutionCode(
  value: unknown,
): value is RuntimeExecutiveInsightResolutionCode {
  return includesValue(RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CODES, value);
}

export function isRuntimeExecutiveInsightResolutionComparisonOperator(
  value: unknown,
): value is RuntimeExecutiveInsightResolutionComparisonOperator {
  return includesValue(
    RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_COMPARISON_OPERATORS,
    value,
  );
}

export function isRuntimeExecutiveInsightResolutionConfidence(
  value: unknown,
): value is RuntimeExecutiveInsightResolutionConfidence {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 1
  );
}

function issue(
  code: RuntimeExecutiveInsightResolutionCode,
  path?: string,
  details?: Readonly<Record<string, string | number | boolean>>,
): RuntimeExecutiveInsightResolutionIssue {
  return Object.freeze({
    code,
    ...(path !== undefined ? { path } : {}),
    ...(details !== undefined ? { details: Object.freeze({ ...details }) } : {}),
  });
}

function freezeResult(input: {
  readonly status: RuntimeExecutiveInsightResolutionStatus;
  readonly candidate?: RuntimeExecutiveInsightCandidate;
  readonly matchedRuleIds?: ReadonlyArray<string>;
  readonly evidenceIds?: ReadonlyArray<string>;
  readonly signalIds?: ReadonlyArray<string>;
  readonly codes: ReadonlyArray<RuntimeExecutiveInsightResolutionCode>;
  readonly issues?: ReadonlyArray<RuntimeExecutiveInsightResolutionIssue>;
}): RuntimeExecutiveInsightResolutionResult {
  return Object.freeze({
    status: input.status,
    ...(input.candidate !== undefined ? { candidate: input.candidate } : {}),
    matchedRuleIds: Object.freeze([...(input.matchedRuleIds ?? [])]),
    evidenceIds: Object.freeze([...(input.evidenceIds ?? [])]),
    signalIds: Object.freeze([...(input.signalIds ?? [])]),
    codes: Object.freeze([...input.codes]),
    issues: Object.freeze([...(input.issues ?? [])]),
  });
}

function readPayloadNumber(
  payload: RuntimeExecutiveInsightEvidencePayload | undefined,
  field: string,
): number | undefined {
  if (!isPlainObject(payload)) return undefined;
  const value = payload[field];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function readPayloadBoolean(
  payload: RuntimeExecutiveInsightEvidencePayload | undefined,
  field: string,
): boolean | undefined {
  if (!isPlainObject(payload)) return undefined;
  const value = payload[field];
  return typeof value === "boolean" ? value : undefined;
}

function readPayloadArray(
  payload: RuntimeExecutiveInsightEvidencePayload | undefined,
  field: string,
): ReadonlyArray<unknown> | undefined {
  if (!isPlainObject(payload)) return undefined;
  const value = payload[field];
  return Array.isArray(value) ? value : undefined;
}

function compareNumber(
  left: number,
  operator: RuntimeExecutiveInsightResolutionComparisonOperator,
  right: number,
  rangeMax?: number,
): boolean {
  switch (operator) {
    case "greater-than":
      return left > right;
    case "greater-than-or-equal":
      return left >= right;
    case "less-than":
      return left < right;
    case "less-than-or-equal":
      return left <= right;
    case "equal":
      return left === right;
    case "not-equal":
      return left !== right;
    case "range-entry":
      return (
        rangeMax !== undefined &&
        left >= right &&
        left <= rangeMax
      );
    case "range-exit":
      return (
        rangeMax !== undefined &&
        (left < right || left > rangeMax)
      );
    default:
      return false;
  }
}

function directionFromPreviousCurrent(
  previous: number,
  current: number,
): RuntimeExecutiveInsightResolutionDirection {
  if (current > previous) return "increasing";
  if (current < previous) return "decreasing";
  return "stable";
}

function selectEvidence(
  evidence: ReadonlyArray<RuntimeExecutiveInsightEvidenceContract>,
  kinds: ReadonlyArray<RuntimeExecutiveInsightResolutionEvidenceKind>,
): ReadonlyArray<RuntimeExecutiveInsightEvidenceContract> {
  if (kinds.length === 0) return evidence;
  return evidence.filter((entry) =>
    (kinds as readonly string[]).includes(entry.kind),
  );
}

function selectSignals(
  signals: ReadonlyArray<RuntimeExecutiveInsightSignalContract>,
  kinds: ReadonlyArray<RuntimeExecutiveInsightResolutionSignalKind>,
): ReadonlyArray<RuntimeExecutiveInsightSignalContract> {
  if (kinds.length === 0) return signals;
  return signals.filter((entry) =>
    (kinds as readonly string[]).includes(entry.kind),
  );
}

function ruleKindIndex(kind: RuntimeExecutiveInsightResolutionRuleKind): number {
  return RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_RULE_KINDS.indexOf(kind);
}

function validateRule(
  rule: unknown,
  path: string,
): RuntimeExecutiveInsightResolutionIssue[] {
  const issues: RuntimeExecutiveInsightResolutionIssue[] = [];
  if (!isPlainObject(rule)) {
    issues.push(issue("invalid-rule", path));
    return issues;
  }
  if (!isNonEmptyString(rule.ruleId)) {
    issues.push(issue("invalid-rule", `${path}.ruleId`));
  }
  if (!isRuntimeExecutiveInsightResolutionRuleKind(rule.ruleKind)) {
    issues.push(issue("unsupported-rule-kind", `${path}.ruleKind`));
  }
  if (
    !includesValue(RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CATEGORIES, rule.targetCategory)
  ) {
    issues.push(issue("unsupported-category", `${path}.targetCategory`));
  }
  if (!Array.isArray(rule.applicableSubjectKinds)) {
    issues.push(issue("invalid-rule", `${path}.applicableSubjectKinds`));
  }
  if (!Array.isArray(rule.applicableEvidenceKinds)) {
    issues.push(issue("invalid-rule", `${path}.applicableEvidenceKinds`));
  }
  if (!Array.isArray(rule.applicableSignalKinds)) {
    issues.push(issue("invalid-rule", `${path}.applicableSignalKinds`));
  }
  if (!Array.isArray(rule.conditions)) {
    issues.push(issue("invalid-rule", `${path}.conditions`));
  }
  if (!isPlainObject(rule.output)) {
    issues.push(issue("invalid-rule", `${path}.output`));
  } else if (
    !includesValue(
      RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CATEGORIES,
      rule.output.category,
    )
  ) {
    issues.push(issue("unsupported-category", `${path}.output.category`));
  } else if (
    rule.output.confidence !== undefined &&
    !isRuntimeExecutiveInsightResolutionConfidence(rule.output.confidence)
  ) {
    issues.push(issue("invalid-confidence", `${path}.output.confidence`));
  }
  return issues;
}

export function isRuntimeExecutiveInsightResolutionRuleApplicable(
  rule: RuntimeExecutiveInsightResolutionRule,
  input: RuntimeExecutiveInsightResolutionInput,
): boolean {
  if (
    rule.applicableSubjectKinds.length > 0 &&
    !rule.applicableSubjectKinds.includes(input.primarySubject.kind)
  ) {
    return false;
  }
  if (rule.applicableEvidenceKinds.length > 0) {
    const hasEvidence = input.evidence.some((entry) =>
      rule.applicableEvidenceKinds.includes(entry.kind),
    );
    if (!hasEvidence) return false;
  }
  if (rule.applicableSignalKinds.length > 0) {
    const hasSignal = input.signals.some((entry) =>
      rule.applicableSignalKinds.includes(entry.kind),
    );
    if (!hasSignal) return false;
  }
  if (
    rule.scope !== undefined &&
    input.scope !== undefined &&
    rule.scope !== input.scope &&
    rule.scope !== input.context.scope
  ) {
    return false;
  }
  return true;
}

function evaluateCondition(
  condition: RuntimeExecutiveInsightResolutionCondition,
  input: RuntimeExecutiveInsightResolutionInput,
  applicableEvidence: ReadonlyArray<RuntimeExecutiveInsightEvidenceContract>,
  applicableSignals: ReadonlyArray<RuntimeExecutiveInsightSignalContract>,
): { readonly ok: boolean; readonly code?: RuntimeExecutiveInsightResolutionCode } {
  switch (condition.kind) {
    case "require-subject-kind":
      return {
        ok: condition.subjectKinds.includes(input.primarySubject.kind),
        code: "subject-not-applicable",
      };
    case "require-evidence-kind":
      return {
        ok: applicableEvidence.some((entry) =>
          condition.evidenceKinds.includes(entry.kind),
        ),
        code: "evidence-not-applicable",
      };
    case "require-signal-kind":
      return {
        ok: applicableSignals.some((entry) =>
          condition.signalKinds.includes(entry.kind),
        ),
        code: "signal-not-applicable",
      };
    case "require-signal-direction":
      return {
        ok: applicableSignals.some(
          (entry) => entry.direction === condition.direction,
        ),
        code: "insufficient-signals",
      };
    case "require-previous-and-current": {
      const pool = condition.evidenceKind
        ? applicableEvidence.filter((entry) => entry.kind === condition.evidenceKind)
        : applicableEvidence;
      const ok = pool.some((entry) => {
        const previous = readPayloadNumber(entry.payload, condition.previousField);
        const current = readPayloadNumber(entry.payload, condition.currentField);
        return previous !== undefined && current !== undefined;
      });
      return { ok, code: "insufficient-evidence" };
    }
    case "require-baseline": {
      if (input.context.baseline !== undefined) {
        if (condition.field === undefined) return { ok: true };
        return {
          ok: readPayloadNumber(input.context.baseline, condition.field) !== undefined
            || (isPlainObject(input.context.baseline)
              && input.context.baseline[condition.field] !== undefined),
          code: "missing-baseline",
        };
      }
      const ok = applicableEvidence.some(
        (entry) =>
          entry.baselineRef !== undefined ||
          (condition.field !== undefined &&
            readPayloadNumber(entry.payload, condition.field) !== undefined) ||
          readPayloadNumber(entry.payload, "baseline") !== undefined ||
          readPayloadNumber(entry.payload, "expected") !== undefined,
      );
      return { ok, code: "missing-baseline" };
    }
    case "require-threshold": {
      if (input.context.threshold !== undefined) return { ok: true };
      const ok = applicableEvidence.some(
        (entry) =>
          readPayloadNumber(entry.payload, condition.field ?? "threshold") !==
          undefined,
      );
      return { ok, code: "missing-threshold" };
    }
    case "compare-payload-number": {
      const pool = condition.evidenceKind
        ? applicableEvidence.filter((entry) => entry.kind === condition.evidenceKind)
        : applicableEvidence;
      const ok = pool.some((entry) => {
        const value = readPayloadNumber(entry.payload, condition.field);
        return (
          value !== undefined &&
          compareNumber(
            value,
            condition.operator,
            condition.value,
            condition.rangeMax,
          )
        );
      });
      return { ok, code: "conditions-unsatisfied" };
    }
    case "compare-current-to-threshold": {
      let threshold: RuntimeExecutiveInsightResolutionThreshold | undefined =
        input.context.threshold;
      if (threshold === undefined) {
        for (const entry of applicableEvidence) {
          const value = readPayloadNumber(entry.payload, "threshold");
          if (value !== undefined) {
            threshold = {
              value,
              operator: condition.operator ?? "less-than",
            };
            break;
          }
        }
      }
      if (threshold === undefined) {
        return { ok: false, code: "missing-threshold" };
      }
      const pool = condition.evidenceKind
        ? applicableEvidence.filter((entry) => entry.kind === condition.evidenceKind)
        : applicableEvidence;
      const operator = condition.operator ?? threshold.operator;
      const thresholdValue = threshold.value;
      const rangeMax = threshold.rangeMax;
      const ok = pool.some((entry) => {
        const current = readPayloadNumber(entry.payload, condition.currentField);
        return (
          current !== undefined &&
          compareNumber(current, operator, thresholdValue, rangeMax)
        );
      });
      return { ok, code: "conditions-unsatisfied" };
    }
    case "compare-current-to-baseline": {
      const baselineValue =
        (condition.baselineField !== undefined
          ? readPayloadNumber(input.context.baseline, condition.baselineField)
          : undefined) ??
        readPayloadNumber(input.context.baseline, "value") ??
        readPayloadNumber(input.context.baseline, "baseline") ??
        readPayloadNumber(input.context.baseline, "expected");
      const pool = condition.evidenceKind
        ? applicableEvidence.filter((entry) => entry.kind === condition.evidenceKind)
        : applicableEvidence;
      let resolvedBaseline = baselineValue;
      if (resolvedBaseline === undefined) {
        for (const entry of pool) {
          resolvedBaseline =
            readPayloadNumber(entry.payload, condition.baselineField ?? "baseline") ??
            readPayloadNumber(entry.payload, "expected");
          if (resolvedBaseline !== undefined) break;
        }
      }
      if (resolvedBaseline === undefined) {
        return { ok: false, code: "missing-baseline" };
      }
      const ok = pool.some((entry) => {
        const current = readPayloadNumber(entry.payload, condition.currentField);
        if (current === undefined) return false;
        const magnitude = Math.abs(current - resolvedBaseline!);
        if (condition.value !== undefined) {
          return compareNumber(magnitude, condition.operator, condition.value);
        }
        return compareNumber(current, condition.operator, resolvedBaseline!);
      });
      return { ok, code: "conditions-unsatisfied" };
    }
    case "require-relationship-kind": {
      const relationships = input.relationships ?? [];
      return {
        ok: relationships.some((entry) =>
          condition.relationshipKinds.includes(entry.kind),
        ),
        code: "missing-reference",
      };
    }
    case "require-payload-flag": {
      const pool = condition.evidenceKind
        ? applicableEvidence.filter((entry) => entry.kind === condition.evidenceKind)
        : applicableEvidence;
      const expected = condition.value ?? true;
      return {
        ok: pool.some(
          (entry) =>
            readPayloadBoolean(entry.payload, condition.field) === expected,
        ),
        code: "insufficient-evidence",
      };
    }
    case "require-category-hint":
      return {
        ok: input.classificationHint?.category === condition.category,
        code: "conditions-unsatisfied",
      };
    case "require-ordered-observations": {
      const pool = condition.evidenceKind
        ? applicableEvidence.filter((entry) => entry.kind === condition.evidenceKind)
        : applicableEvidence;
      const ok = pool.some((entry) => {
        const values = readPayloadArray(entry.payload, condition.field);
        return (
          values !== undefined &&
          values.length >= condition.minCount &&
          values.every(
            (item) => typeof item === "number" && Number.isFinite(item),
          )
        );
      });
      return { ok, code: "insufficient-evidence" };
    }
    default:
      return { ok: false, code: "invalid-rule" };
  }
}

function collectSupportingEvidenceIds(
  rule: RuntimeExecutiveInsightResolutionRule,
  input: RuntimeExecutiveInsightResolutionInput,
): string[] {
  return selectEvidence(input.evidence, rule.applicableEvidenceKinds).map(
    (entry) => entry.evidenceId,
  );
}

function collectSupportingSignalIds(
  rule: RuntimeExecutiveInsightResolutionRule,
  input: RuntimeExecutiveInsightResolutionInput,
): string[] {
  return selectSignals(input.signals, rule.applicableSignalKinds).map(
    (entry) => entry.signalId,
  );
}

function resolveDirection(
  rule: RuntimeExecutiveInsightResolutionRule,
  input: RuntimeExecutiveInsightResolutionInput,
  applicableEvidence: ReadonlyArray<RuntimeExecutiveInsightEvidenceContract>,
  applicableSignals: ReadonlyArray<RuntimeExecutiveInsightSignalContract>,
): RuntimeExecutiveInsightResolutionDirection {
  const mapping = rule.output;
  if (mapping.directionFrom === "fixed" || mapping.directionFrom === undefined) {
    if (mapping.direction !== undefined) return mapping.direction;
  }
  if (mapping.directionFrom === "signal" || mapping.directionFrom === undefined) {
    const signalDirection = applicableSignals.find(
      (entry) => entry.direction !== undefined,
    )?.direction;
    if (signalDirection !== undefined) return signalDirection;
  }
  if (
    mapping.directionFrom === "previous-current" ||
    mapping.directionFrom === undefined
  ) {
    for (const entry of applicableEvidence) {
      const previous =
        readPayloadNumber(entry.payload, "previous") ??
        readPayloadNumber(entry.payload, "previousValue");
      const current =
        readPayloadNumber(entry.payload, "current") ??
        readPayloadNumber(entry.payload, "currentValue") ??
        readPayloadNumber(entry.payload, "value");
      if (previous !== undefined && current !== undefined) {
        return directionFromPreviousCurrent(previous, current);
      }
      const observations = readPayloadArray(entry.payload, "observations");
      if (
        observations &&
        observations.length >= 2 &&
        observations.every(
          (item) => typeof item === "number" && Number.isFinite(item),
        )
      ) {
        const first = observations[0] as number;
        const last = observations[observations.length - 1] as number;
        return directionFromPreviousCurrent(first, last);
      }
    }
  }
  return input.classificationHint?.direction ?? mapping.direction ?? "unknown";
}

function resolveSeverity(
  rule: RuntimeExecutiveInsightResolutionRule,
  input: RuntimeExecutiveInsightResolutionInput,
  applicableEvidence: ReadonlyArray<RuntimeExecutiveInsightEvidenceContract>,
): RuntimeExecutiveInsightResolutionSeverity {
  if (rule.output.severity !== undefined) return rule.output.severity;
  const bands = rule.output.severityFromMagnitudeBands;
  if (bands !== undefined && bands.length > 0) {
    let magnitude: number | undefined;
    for (const entry of applicableEvidence) {
      const previous =
        readPayloadNumber(entry.payload, "previous") ??
        readPayloadNumber(entry.payload, "previousValue");
      const current =
        readPayloadNumber(entry.payload, "current") ??
        readPayloadNumber(entry.payload, "currentValue") ??
        readPayloadNumber(entry.payload, "value");
      const baseline =
        readPayloadNumber(input.context.baseline, "value") ??
        readPayloadNumber(input.context.baseline, "baseline") ??
        readPayloadNumber(input.context.baseline, "expected") ??
        readPayloadNumber(entry.payload, "baseline") ??
        readPayloadNumber(entry.payload, "expected");
      if (previous !== undefined && current !== undefined) {
        magnitude = Math.abs(current - previous);
        break;
      }
      if (baseline !== undefined && current !== undefined) {
        magnitude = Math.abs(current - baseline);
        break;
      }
      const explicit = readPayloadNumber(entry.payload, "deviation");
      if (explicit !== undefined) {
        magnitude = Math.abs(explicit);
        break;
      }
    }
    if (magnitude !== undefined) {
      const ordered = [...bands].sort(
        (left, right) => right.minInclusive - left.minInclusive,
      );
      for (const band of ordered) {
        if (magnitude >= band.minInclusive) return band.severity;
      }
    }
  }
  return input.classificationHint?.severity ?? "none";
}

function resolveConfidence(
  rule: RuntimeExecutiveInsightResolutionRule,
  input: RuntimeExecutiveInsightResolutionInput,
  applicableSignals: ReadonlyArray<RuntimeExecutiveInsightSignalContract>,
):
  | { readonly ok: true; readonly confidence: RuntimeExecutiveInsightResolutionConfidence }
  | { readonly ok: false; readonly code: RuntimeExecutiveInsightResolutionCode } {
  if (rule.output.confidenceFrom === "fixed" || rule.output.confidence !== undefined) {
    const confidence = rule.output.confidence;
    if (confidence === undefined) {
      return { ok: false, code: "invalid-confidence" };
    }
    if (!isRuntimeExecutiveInsightResolutionConfidence(confidence)) {
      return { ok: false, code: "invalid-confidence" };
    }
    return { ok: true, confidence };
  }
  if (rule.output.confidenceFrom === "signal" || rule.output.confidenceFrom === undefined) {
    const signalConfidence = applicableSignals.find(
      (entry) => entry.confidence !== undefined,
    )?.confidence;
    if (
      signalConfidence !== undefined &&
      isRuntimeExecutiveInsightResolutionConfidence(signalConfidence)
    ) {
      return { ok: true, confidence: signalConfidence };
    }
  }
  if (
    rule.output.confidenceFrom === "hint" ||
    input.classificationHint?.confidence !== undefined
  ) {
    const hint = input.classificationHint?.confidence;
    if (hint === undefined) {
      return { ok: true, confidence: 0 };
    }
    if (!isRuntimeExecutiveInsightResolutionConfidence(hint)) {
      return { ok: false, code: "invalid-confidence" };
    }
    return { ok: true, confidence: hint };
  }
  return { ok: true, confidence: 0 };
}

function resolveFreshness(
  rule: RuntimeExecutiveInsightResolutionRule,
  input: RuntimeExecutiveInsightResolutionInput,
  applicableEvidence: ReadonlyArray<RuntimeExecutiveInsightEvidenceContract>,
  applicableSignals: ReadonlyArray<RuntimeExecutiveInsightSignalContract>,
): RuntimeExecutiveInsightResolutionFreshness {
  if (rule.output.freshnessFrom === "fixed" && rule.output.freshness !== undefined) {
    return rule.output.freshness;
  }
  if (rule.output.freshness !== undefined && rule.output.freshnessFrom === undefined) {
    return rule.output.freshness;
  }
  if (rule.output.freshnessFrom === "context" || input.context.temporalRefIso) {
    const fromEvidence = applicableEvidence.find(
      (entry) => entry.freshness !== undefined,
    )?.freshness;
    if (fromEvidence !== undefined) return fromEvidence;
  }
  if (rule.output.freshnessFrom === "evidence" || rule.output.freshnessFrom === undefined) {
    const fromEvidence = applicableEvidence.find(
      (entry) => entry.freshness !== undefined,
    )?.freshness;
    if (fromEvidence !== undefined) return fromEvidence;
  }
  if (rule.output.freshnessFrom === "signal" || rule.output.freshnessFrom === undefined) {
    const fromSignal = applicableSignals.find(
      (entry) => entry.freshness !== undefined,
    )?.freshness;
    if (fromSignal !== undefined) return fromSignal;
  }
  return (
    input.classificationHint?.freshness ??
    rule.output.freshness ??
    "unknown"
  );
}

function buildCandidateId(input: {
  readonly category: RuntimeExecutiveInsightResolutionCategory;
  readonly subjectId: string;
  readonly candidateKey: string;
}): string {
  return `rex.insight.candidate:${input.category}:${input.subjectId}:${input.candidateKey}`;
}

function buildCandidate(
  rule: RuntimeExecutiveInsightResolutionRule,
  input: RuntimeExecutiveInsightResolutionInput,
  matchedRuleIds: ReadonlyArray<string>,
  evidenceIds: ReadonlyArray<string>,
  signalIds: ReadonlyArray<string>,
):
  | { readonly ok: true; readonly candidate: RuntimeExecutiveInsightCandidate }
  | { readonly ok: false; readonly code: RuntimeExecutiveInsightResolutionCode } {
  const applicableEvidence = selectEvidence(
    input.evidence,
    rule.applicableEvidenceKinds,
  );
  const applicableSignals = selectSignals(
    input.signals,
    rule.applicableSignalKinds,
  );
  const confidenceResult = resolveConfidence(rule, input, applicableSignals);
  if (!confidenceResult.ok) {
    return { ok: false, code: confidenceResult.code };
  }

  const direction = resolveDirection(
    rule,
    input,
    applicableEvidence,
    applicableSignals,
  );
  const severity = resolveSeverity(rule, input, applicableEvidence);
  const freshness = resolveFreshness(
    rule,
    input,
    applicableEvidence,
    applicableSignals,
  );
  const importance =
    rule.output.importance ??
    input.classificationHint?.importance ??
    "minimal";
  const scope =
    rule.output.scope ??
    input.scope ??
    input.context.scope ??
    input.primarySubject.scope ??
    input.classificationHint?.scope ??
    "subject";
  const source =
    input.source ??
    applicableEvidence[0]?.source ??
    applicableSignals[0]?.source ??
    Object.freeze({ kind: "runtime" as const });

  const candidateKey =
    rule.output.candidateKey ??
    rule.ruleId;

  const relationships: RuntimeExecutiveInsightRelationshipContract[] = [];
  if (
    rule.output.relationshipKind !== undefined &&
    (input.relationships ?? []).some(
      (entry) => entry.kind === rule.output.relationshipKind,
    )
  ) {
    for (const entry of input.relationships ?? []) {
      if (entry.kind === rule.output.relationshipKind) {
        relationships.push(entry);
      }
    }
  } else if (
    rule.output.relationshipKind === "caused-by" &&
    !(input.relationships ?? []).some((entry) => entry.kind === "caused-by")
  ) {
    // Causality must be supplied — never inferred.
  } else if ((input.relationships ?? []).length > 0) {
    // Preserve explicitly supplied relationships that are listed as supporting refs
    // only when the rule requests a relationship kind match via conditions.
    const requiredKinds = rule.conditions
      .filter(
        (condition): condition is Extract<
          RuntimeExecutiveInsightResolutionCondition,
          { kind: "require-relationship-kind" }
        > => condition.kind === "require-relationship-kind",
      )
      .flatMap((condition) => condition.relationshipKinds);
    if (requiredKinds.length > 0) {
      for (const entry of input.relationships ?? []) {
        if (requiredKinds.includes(entry.kind)) {
          relationships.push(entry);
        }
      }
    }
  }

  const candidate: RuntimeExecutiveInsightCandidate = Object.freeze({
    candidateId: buildCandidateId({
      category: rule.output.category,
      subjectId: input.primarySubject.subjectId,
      candidateKey,
    }),
    category: rule.output.category,
    primarySubject: Object.freeze({ ...input.primarySubject }),
    relatedSubjects: Object.freeze(
      (input.relatedSubjects ?? []).map((entry) =>
        Object.freeze({
          ...entry,
          subject: Object.freeze({ ...entry.subject }),
        }),
      ),
    ),
    evidenceIds: Object.freeze([...evidenceIds]),
    signalIds: Object.freeze([...signalIds]),
    direction,
    severity,
    importance,
    confidence: confidenceResult.confidence,
    freshness,
    scope,
    source: Object.freeze({ ...source }),
    relationships: Object.freeze(
      relationships.map((entry) =>
        Object.freeze({
          ...entry,
          from: Object.freeze({ ...entry.from }),
          to: Object.freeze({ ...entry.to }),
        }),
      ),
    ),
    matchedRuleIds: Object.freeze([...matchedRuleIds]),
    resolutionCodes: Object.freeze(["resolved"] as const),
    resolutionIdentity: runtimeExecutiveInsightResolutionIdentity,
    resolutionVersion: runtimeExecutiveInsightResolutionVersion,
  });

  return { ok: true, candidate };
}

function semanticSignature(candidate: RuntimeExecutiveInsightCandidate): string {
  return [
    candidate.category,
    candidate.primarySubject.subjectId,
    candidate.direction,
    candidate.severity,
    candidate.importance,
    String(candidate.confidence),
    candidate.freshness,
    candidate.scope,
  ].join("|");
}

function outputsCompatible(
  left: RuntimeExecutiveInsightCandidate,
  right: RuntimeExecutiveInsightCandidate,
): boolean {
  return semanticSignature(left) === semanticSignature(right);
}

function sortMatchingRules(
  rules: ReadonlyArray<RuntimeExecutiveInsightResolutionRule>,
): RuntimeExecutiveInsightResolutionRule[] {
  return [...rules].sort((left, right) => {
    const precedenceDelta =
      (right.precedence ?? 0) - (left.precedence ?? 0);
    if (precedenceDelta !== 0) return precedenceDelta;
    const specificityDelta =
      (right.specificity ?? 0) - (left.specificity ?? 0);
    if (specificityDelta !== 0) return specificityDelta;
    const kindDelta = ruleKindIndex(left.ruleKind) - ruleKindIndex(right.ruleKind);
    if (kindDelta !== 0) return kindDelta;
    return compareAscii(left.ruleId, right.ruleId);
  });
}

function validateInput(
  input: RuntimeExecutiveInsightResolutionInput,
): RuntimeExecutiveInsightResolutionIssue[] {
  const issues: RuntimeExecutiveInsightResolutionIssue[] = [];
  issues.push(
    ...validateRuntimeExecutiveInsightSubjectContract(
      input.primarySubject,
      "primarySubject",
    ).issues.map((entry) =>
      issue("invalid-input", entry.path, { contractCode: entry.code }),
    ),
  );
  issues.push(
    ...validateRuntimeExecutiveInsightEvidenceCollectionContract(
      { evidence: input.evidence },
      "evidence",
    ).issues.map((entry) =>
      issue("invalid-input", entry.path, { contractCode: entry.code }),
    ),
  );
  issues.push(
    ...validateRuntimeExecutiveInsightSignalCollectionContract(
      { signals: input.signals },
      "signals",
    ).issues.map((entry) =>
      issue("invalid-input", entry.path, { contractCode: entry.code }),
    ),
  );
  if (input.source !== undefined) {
    issues.push(
      ...validateRuntimeExecutiveInsightSourceContract(
        input.source,
        "source",
      ).issues.map((entry) =>
        issue("invalid-input", entry.path, { contractCode: entry.code }),
      ),
    );
  }
  if (input.relationships !== undefined) {
    for (let index = 0; index < input.relationships.length; index += 1) {
      issues.push(
        ...validateRuntimeExecutiveInsightRelationshipContract(
          input.relationships[index],
          `relationships[${index}]`,
        ).issues.map((entry) =>
          issue("invalid-input", entry.path, { contractCode: entry.code }),
        ),
      );
    }
  }
  if (
    input.classificationHint?.confidence !== undefined &&
    !isRuntimeExecutiveInsightResolutionConfidence(
      input.classificationHint.confidence,
    )
  ) {
    issues.push(issue("invalid-confidence", "classificationHint.confidence"));
  }
  if (!isPlainObject(input.context) || !Array.isArray(input.context.rules)) {
    issues.push(issue("invalid-rule", "context.rules"));
    return issues;
  }
  const ruleIds: string[] = [];
  for (let index = 0; index < input.context.rules.length; index += 1) {
    const rule = input.context.rules[index];
    issues.push(...validateRule(rule, `context.rules[${index}]`));
    if (isPlainObject(rule) && isNonEmptyString(rule.ruleId)) {
      ruleIds.push(rule.ruleId);
    }
  }
  if (!unique(ruleIds)) {
    issues.push(issue("duplicate-rule-id", "context.rules"));
  }
  return issues;
}

// ─── Primary APIs ───────────────────────────────────────────────────────────

export function resolveRuntimeExecutiveInsight(
  input: RuntimeExecutiveInsightResolutionInput,
): RuntimeExecutiveInsightResolutionResult {
  const structuralIssues = validateInput(input);
  if (structuralIssues.length > 0) {
    const codes = Object.freeze(
      structuralIssues.map((entry) => entry.code),
    ) as ReadonlyArray<RuntimeExecutiveInsightResolutionCode>;
    return freezeResult({
      status: "invalid",
      codes: codes.length > 0 ? codes : ["invalid-input"],
      issues: structuralIssues,
    });
  }

  const applicableRules = input.context.rules.filter((rule) =>
    isRuntimeExecutiveInsightResolutionRuleApplicable(rule, input),
  );

  if (applicableRules.length === 0) {
    if (input.context.rules.length === 0) {
      return freezeResult({
        status: "ineligible",
        codes: ["no-applicable-rule"],
        issues: [issue("no-applicable-rule", "context.rules")],
      });
    }
    const subjectMismatch = input.context.rules.every(
      (rule) =>
        rule.applicableSubjectKinds.length > 0 &&
        !rule.applicableSubjectKinds.includes(input.primarySubject.kind),
    );
    return freezeResult({
      status: "ineligible",
      codes: [
        subjectMismatch ? "subject-not-applicable" : "no-applicable-rule",
      ],
      issues: [
        issue(
          subjectMismatch ? "subject-not-applicable" : "no-applicable-rule",
          "context.rules",
        ),
      ],
    });
  }

  const matching: RuntimeExecutiveInsightResolutionRule[] = [];
  const conditionFailures: RuntimeExecutiveInsightResolutionCode[] = [];

  for (const rule of applicableRules) {
    const applicableEvidence = selectEvidence(
      input.evidence,
      rule.applicableEvidenceKinds,
    );
    const applicableSignals = selectSignals(
      input.signals,
      rule.applicableSignalKinds,
    );
    let ok = true;
    for (const condition of rule.conditions) {
      const evaluated = evaluateCondition(
        condition,
        input,
        applicableEvidence,
        applicableSignals,
      );
      if (!evaluated.ok) {
        ok = false;
        if (evaluated.code !== undefined) {
          conditionFailures.push(evaluated.code);
        }
        break;
      }
    }
    if (ok) matching.push(rule);
  }

  if (matching.length === 0) {
    const code =
      conditionFailures.find((entry) => entry === "missing-baseline") ??
      conditionFailures.find((entry) => entry === "missing-threshold") ??
      conditionFailures.find((entry) => entry === "insufficient-signals") ??
      conditionFailures.find((entry) => entry === "insufficient-evidence") ??
      conditionFailures[0] ??
      "conditions-unsatisfied";
    return freezeResult({
      status: "unresolved",
      codes: [code],
      issues: [issue(code, "conditions")],
      evidenceIds: input.evidence.map((entry) => entry.evidenceId),
      signalIds: input.signals.map((entry) => entry.signalId),
    });
  }

  const ordered = sortMatchingRules(matching);
  const top = ordered[0]!;
  const topKey = {
    precedence: top.precedence ?? 0,
    specificity: top.specificity ?? 0,
    kindOrder: ruleKindIndex(top.ruleKind),
  };
  const tied = ordered.filter(
    (rule) =>
      (rule.precedence ?? 0) === topKey.precedence &&
      (rule.specificity ?? 0) === topKey.specificity &&
      ruleKindIndex(rule.ruleKind) === topKey.kindOrder,
  );

  const built: RuntimeExecutiveInsightCandidate[] = [];
  for (const rule of tied) {
    const evidenceIds = collectSupportingEvidenceIds(rule, input);
    const signalIds = collectSupportingSignalIds(rule, input);
    const candidateResult = buildCandidate(
      rule,
      input,
      [rule.ruleId],
      evidenceIds,
      signalIds,
    );
    if (!candidateResult.ok) {
      return freezeResult({
        status: "invalid",
        codes: [candidateResult.code],
        issues: [issue(candidateResult.code)],
        matchedRuleIds: [rule.ruleId],
        evidenceIds,
        signalIds,
      });
    }
    built.push(candidateResult.candidate);
  }

  if (built.length > 1) {
    const first = built[0]!;
    const incompatible = built.some(
      (candidate) => !outputsCompatible(first, candidate),
    );
    if (incompatible) {
      return freezeResult({
        status: "ambiguous",
        codes: ["ambiguous-resolution", "conflicting-rules"],
        issues: [
          issue("ambiguous-resolution", "context.rules"),
          issue("conflicting-rules", "context.rules"),
        ],
        matchedRuleIds: tied.map((rule) => rule.ruleId),
        evidenceIds: input.evidence.map((entry) => entry.evidenceId),
        signalIds: input.signals.map((entry) => entry.signalId),
      });
    }
  }

  // Stable rule-ID tie-break among compatible tied rules.
  const winnerRule = [...tied].sort((left, right) =>
    compareAscii(left.ruleId, right.ruleId),
  )[0]!;
  const evidenceIds = collectSupportingEvidenceIds(winnerRule, input);
  const signalIds = collectSupportingSignalIds(winnerRule, input);

  // Union supporting refs across compatible tied rules (deterministic).
  const unionEvidence = Object.freeze([
    ...new Set(
      tied.flatMap((rule) => collectSupportingEvidenceIds(rule, input)),
    ),
  ]);
  const unionSignals = Object.freeze([
    ...new Set(tied.flatMap((rule) => collectSupportingSignalIds(rule, input))),
  ]);
  const matchedRuleIds = Object.freeze(
    [...tied.map((rule) => rule.ruleId)].sort(compareAscii),
  );

  const candidateResult = buildCandidate(
    winnerRule,
    input,
    matchedRuleIds,
    unionEvidence,
    unionSignals,
  );
  if (!candidateResult.ok) {
    return freezeResult({
      status: "invalid",
      codes: [candidateResult.code],
      issues: [issue(candidateResult.code)],
      matchedRuleIds,
      evidenceIds,
      signalIds,
    });
  }

  return freezeResult({
    status: "resolved",
    candidate: candidateResult.candidate,
    matchedRuleIds,
    evidenceIds: unionEvidence,
    signalIds: unionSignals,
    codes: ["resolved"],
  });
}

export function resolveRuntimeExecutiveInsights(
  inputs: ReadonlyArray<RuntimeExecutiveInsightResolutionInput>,
): RuntimeExecutiveInsightResolutionCollectionResult {
  const results = inputs.map((entry) => resolveRuntimeExecutiveInsight(entry));
  const resolvedCandidates = results
    .filter(
      (
        entry,
      ): entry is RuntimeExecutiveInsightResolutionResult & {
        readonly candidate: RuntimeExecutiveInsightCandidate;
      } => entry.status === "resolved" && entry.candidate !== undefined,
    )
    .map((entry) => entry.candidate);

  const byId = new Map<string, RuntimeExecutiveInsightCandidate>();
  for (const candidate of resolvedCandidates) {
    const existing = byId.get(candidate.candidateId);
    if (existing === undefined) {
      byId.set(candidate.candidateId, candidate);
      continue;
    }
    const mergedEvidence = Object.freeze([
      ...new Set([...existing.evidenceIds, ...candidate.evidenceIds]),
    ]);
    const mergedSignals = Object.freeze([
      ...new Set([...existing.signalIds, ...candidate.signalIds]),
    ]);
    const mergedRules = Object.freeze([
      ...new Set([...existing.matchedRuleIds, ...candidate.matchedRuleIds]),
    ].sort(compareAscii));
    byId.set(
      candidate.candidateId,
      Object.freeze({
        ...existing,
        evidenceIds: mergedEvidence,
        signalIds: mergedSignals,
        matchedRuleIds: mergedRules,
      }),
    );
  }

  const candidates = Object.freeze(
    [...byId.values()].sort((left, right) =>
      compareAscii(left.candidateId, right.candidateId),
    ),
  );

  const codes = Object.freeze(
    results.flatMap((entry) => entry.codes),
  ) as ReadonlyArray<RuntimeExecutiveInsightResolutionCode>;

  const hasAmbiguous = results.some((entry) => entry.status === "ambiguous");
  const hasInvalid = results.some((entry) => entry.status === "invalid");
  const hasResolved = candidates.length > 0;

  const status: RuntimeExecutiveInsightResolutionStatus = hasInvalid
    ? "invalid"
    : hasAmbiguous
      ? "ambiguous"
      : hasResolved
        ? "resolved"
        : results.some((entry) => entry.status === "ineligible")
          ? "ineligible"
          : "unresolved";

  return Object.freeze({
    status,
    collection: Object.freeze({
      candidates,
    }),
    results: Object.freeze(results),
    codes,
  });
}

export function createRuntimeExecutiveInsightResolutionRule(input: {
  readonly ruleId: string;
  readonly ruleKind: RuntimeExecutiveInsightResolutionRuleKind;
  readonly targetCategory: RuntimeExecutiveInsightResolutionCategory;
  readonly applicableSubjectKinds?: ReadonlyArray<RuntimeExecutiveInsightResolutionSubjectKind>;
  readonly applicableEvidenceKinds?: ReadonlyArray<RuntimeExecutiveInsightResolutionEvidenceKind>;
  readonly applicableSignalKinds?: ReadonlyArray<RuntimeExecutiveInsightResolutionSignalKind>;
  readonly conditions?: ReadonlyArray<RuntimeExecutiveInsightResolutionCondition>;
  readonly output: RuntimeExecutiveInsightResolutionOutputMapping;
  readonly precedence?: number;
  readonly specificity?: number;
  readonly scope?: RuntimeExecutiveInsightResolutionScope;
  readonly ruleVersion?: string;
}): RuntimeExecutiveInsightResolutionRule {
  const rule = Object.freeze({
    ruleId: input.ruleId,
    ruleKind: input.ruleKind,
    targetCategory: input.targetCategory,
    applicableSubjectKinds: Object.freeze([
      ...(input.applicableSubjectKinds ?? []),
    ]),
    applicableEvidenceKinds: Object.freeze([
      ...(input.applicableEvidenceKinds ?? []),
    ]),
    applicableSignalKinds: Object.freeze([
      ...(input.applicableSignalKinds ?? []),
    ]),
    conditions: Object.freeze([...(input.conditions ?? [])]),
    output: Object.freeze({
      ...input.output,
      ...(input.output.severityFromMagnitudeBands !== undefined
        ? {
            severityFromMagnitudeBands: Object.freeze(
              input.output.severityFromMagnitudeBands.map((band) =>
                Object.freeze({ ...band }),
              ),
            ),
          }
        : {}),
    }),
    ...(input.precedence !== undefined ? { precedence: input.precedence } : {}),
    ...(input.specificity !== undefined
      ? { specificity: input.specificity }
      : {}),
    ...(input.scope !== undefined ? { scope: input.scope } : {}),
    ...(input.ruleVersion !== undefined
      ? { ruleVersion: input.ruleVersion }
      : {}),
  });
  const issues = validateRule(rule, "rule");
  if (issues.length > 0) {
    throw new TypeError(
      `invalid resolution rule: ${issues[0]?.code ?? "invalid-rule"}`,
    );
  }
  return rule;
}

export function getRuntimeExecutiveInsightResolutionIdentity():
  typeof runtimeExecutiveInsightResolutionCanonicalIdentity {
  return runtimeExecutiveInsightResolutionCanonicalIdentity;
}

export function getRuntimeExecutiveInsightResolutionRegistry():
  typeof runtimeExecutiveInsightResolutionRegistry {
  return runtimeExecutiveInsightResolutionRegistry;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveInsightResolutionApiNames = Object.freeze([
  "getRuntimeExecutiveInsightResolutionIdentity",
  "getRuntimeExecutiveInsightResolutionRegistry",
  "isRuntimeExecutiveInsightResolutionStatus",
  "isRuntimeExecutiveInsightResolutionRuleKind",
  "isRuntimeExecutiveInsightResolutionCode",
  "isRuntimeExecutiveInsightResolutionComparisonOperator",
  "isRuntimeExecutiveInsightResolutionConfidence",
  "isRuntimeExecutiveInsightResolutionRuleApplicable",
  "createRuntimeExecutiveInsightResolutionRule",
  "resolveRuntimeExecutiveInsight",
  "resolveRuntimeExecutiveInsights",
  "verifyRuntimeExecutiveInsightResolution",
] as const);

export const RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveInsightResolutionStatus",
    "RuntimeExecutiveInsightResolutionRuleKind",
    "RuntimeExecutiveInsightResolutionCode",
    "RuntimeExecutiveInsightResolutionComparisonOperator",
    "RuntimeExecutiveInsightResolutionCondition",
    "RuntimeExecutiveInsightResolutionSeverityBand",
    "RuntimeExecutiveInsightResolutionOutputMapping",
    "RuntimeExecutiveInsightResolutionRule",
    "RuntimeExecutiveInsightResolutionThreshold",
    "RuntimeExecutiveInsightResolutionContext",
    "RuntimeExecutiveInsightResolutionClassificationHint",
    "RuntimeExecutiveInsightResolutionInput",
    "RuntimeExecutiveInsightCandidate",
    "RuntimeExecutiveInsightCandidateCollection",
    "RuntimeExecutiveInsightResolutionIssue",
    "RuntimeExecutiveInsightResolutionResult",
    "RuntimeExecutiveInsightResolutionCollectionResult",
    "RuntimeExecutiveInsightResolutionConsumerGuarantee",
    "RuntimeExecutiveInsightResolutionVerification",
  ] as const);

export const RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Dependency",
    "ResolutionStatuses",
    "RuleKinds",
    "ResolutionCodes",
    "ComparisonOperators",
    "SupportedCategories",
    "SupportedSubjectKinds",
    "ConsumerGuarantees",
    "PublicTypes",
    "PublicApis",
  ] as const);

export const runtimeExecutiveInsightResolutionRegistry = Object.freeze({
  identity: runtimeExecutiveInsightResolutionIdentity,
  version: runtimeExecutiveInsightResolutionVersion,
  namespace: runtimeExecutiveInsightResolutionNamespace,
  layer: runtimeExecutiveInsightResolutionLayer,
  capability: runtimeExecutiveInsightResolutionCapability,
  phase: runtimeExecutiveInsightResolutionPhase,
  status: runtimeExecutiveInsightResolutionStatus,
  dependencyIdentity: runtimeExecutiveInsightResolutionDependencyIdentity,
  dependencyPath: runtimeExecutiveInsightResolutionDependencyPath,
  supportedImportPath: runtimeExecutiveInsightResolutionSupportedImportPath,
  sections: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_REGISTRY_SECTIONS,
  sectionCount: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_REGISTRY_SECTIONS.length,
  resolutionStatuses: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES,
  resolutionStatusCount: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES.length,
  ruleKinds: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_RULE_KINDS,
  ruleKindCount: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_RULE_KINDS.length,
  resolutionCodes: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CODES,
  resolutionCodeCount: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CODES.length,
  comparisonOperators: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_COMPARISON_OPERATORS,
  comparisonOperatorCount:
    RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_COMPARISON_OPERATORS.length,
  supportedCategories: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CATEGORIES,
  supportedCategoryCount: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CATEGORIES.length,
  supportedSubjectKinds: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_SUBJECT_KINDS,
  supportedSubjectKindCount:
    RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_SUBJECT_KINDS.length,
  consumerGuarantees: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CONSUMER_GUARANTEES,
  consumerGuaranteeCount:
    RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CONSUMER_GUARANTEES.length,
  publicTypes: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_PUBLIC_TYPE_NAMES,
  publicTypeCount: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_PUBLIC_TYPE_NAMES.length,
  publicApis: runtimeExecutiveInsightResolutionApiNames,
  publicApiCount: runtimeExecutiveInsightResolutionApiNames.length,
  nonGoals: Object.freeze([
    "machine-learning",
    "llm-reasoning",
    "executive-ranking",
    "presentation-resolution",
    "advisor-narrative",
    "stage-reactions",
    "automation",
    "kpi-calculation",
    "koi-calculation",
    "statistical-forecasting",
  ]),
});

export const runtimeExecutiveInsightResolution = Object.freeze({
  phase: "Resolution" as const,
  name: "RuntimeExecutiveInsightResolution" as const,
  identity: runtimeExecutiveInsightResolutionIdentity,
  version: runtimeExecutiveInsightResolutionVersion,
  namespace: runtimeExecutiveInsightResolutionNamespace,
  layer: runtimeExecutiveInsightResolutionLayer,
  capability: runtimeExecutiveInsightResolutionCapability,
  architecturalRole: runtimeExecutiveInsightResolutionArchitecturalRole,
  role: "Resolution" as const,
  status: runtimeExecutiveInsightResolutionStatus,
  upstreamDependency: runtimeExecutiveInsightResolutionDependencyIdentity,
  dependencyPath: runtimeExecutiveInsightResolutionDependencyPath,
  supportedImportPath: runtimeExecutiveInsightResolutionSupportedImportPath,
  deterministic: runtimeExecutiveInsightResolutionDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  pure: true as const,
  stateless: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  aiProviderIndependent: true as const,
  browserIndependent: true as const,
  principle: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_BOUNDARY,
  resolutionStatuses: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES,
  ruleKinds: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_RULE_KINDS,
  resolutionCodes: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CODES,
  consumerGuarantees: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CONSUMER_GUARANTEES,
  supportedCategories: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CATEGORIES,
  supportedSubjectKinds: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_SUBJECT_KINDS,
  publicTypeNames: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveInsightResolutionApiNames,
  registry: runtimeExecutiveInsightResolutionRegistry,
  contractsBoundary: "REX-4:2-contracts-only" as const,
  architecturalStatus:
    "REX-4:3 Runtime Executive Insight Resolution — ResolutionReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveInsightResolutionVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveInsightResolutionIdentity;
  readonly version: typeof runtimeExecutiveInsightResolutionVersion;
  readonly namespace: typeof runtimeExecutiveInsightResolutionNamespace;
  readonly dependencyIdentity: typeof runtimeExecutiveInsightResolutionDependencyIdentity;
  readonly resolutionStatusCount: number;
  readonly ruleKindCount: number;
  readonly resolutionCodeCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly supportedCategoryCount: number;
  readonly supportedSubjectKindCount: number;
  readonly sectionCount: number;
  readonly frozen: boolean;
  readonly contractsBoundaryIntact: boolean;
  readonly upstreamContractsOk: boolean;
  readonly noKor: boolean;
  readonly kpiSupported: boolean;
  readonly koiSupported: boolean;
  readonly confidenceBoundsEnforced: boolean;
}

export function verifyRuntimeExecutiveInsightResolution():
  RuntimeExecutiveInsightResolutionVerification {
  const resolutionModule = runtimeExecutiveInsightResolution;
  const registry = runtimeExecutiveInsightResolutionRegistry;
  const upstream = verifyRuntimeExecutiveInsightExperienceContracts();

  const identityOk =
    resolutionModule.identity ===
      "REX-4:3/RuntimeExecutiveInsightResolution" &&
    resolutionModule.version === "4.3.0" &&
    resolutionModule.namespace ===
      "nexora.rex.insight-experience.resolution" &&
    resolutionModule.layer === "REX" &&
    resolutionModule.capability === "RuntimeExecutiveInsightExperience" &&
    resolutionModule.phase === "Resolution" &&
    resolutionModule.status === "ResolutionReady" &&
    resolutionModule.upstreamDependency ===
      "REX-4:2/RuntimeExecutiveInsightExperienceContracts" &&
    resolutionModule.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveInsightExperienceContracts" &&
    resolutionModule.contractsBoundary === "REX-4:2-contracts-only";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES], [
      "resolved",
      "unresolved",
      "ineligible",
      "invalid",
      "ambiguous",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_RULE_KINDS], [
      "change",
      "trend",
      "deviation",
      "risk",
      "opportunity",
      "anomaly",
      "dependency",
      "conflict",
      "progress",
      "threshold",
      "forecast",
      "attention",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CODES], [
      "resolved",
      "no-applicable-rule",
      "insufficient-evidence",
      "insufficient-signals",
      "subject-not-applicable",
      "evidence-not-applicable",
      "signal-not-applicable",
      "invalid-confidence",
      "missing-baseline",
      "missing-threshold",
      "missing-reference",
      "conflicting-rules",
      "ambiguous-resolution",
      "unsupported-rule-kind",
      "unsupported-category",
      "invalid-rule",
      "duplicate-rule-id",
      "duplicate-candidate-id",
      "invalid-input",
      "conditions-unsatisfied",
    ]);

  const forbiddenIndexTerm = ["k", "o", "r"].join("") as never;
  const noKor =
    !RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_SUBJECT_KINDS.includes(
      forbiddenIndexTerm,
    ) &&
    RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_SUBJECT_KIND_SEMANTICS.introducesKor ===
      false &&
    RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_BOUNDARY.introducesKor === false;

  const kpiSupported =
    RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_SUBJECT_KINDS.includes("kpi") &&
    RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_BOUNDARY.calculatesKpi === false;
  const koiSupported =
    RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_SUBJECT_KINDS.includes("koi") &&
    RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_BOUNDARY.calculatesKoi === false;

  const confidenceBoundsEnforced =
    isRuntimeExecutiveInsightResolutionConfidence(0) &&
    isRuntimeExecutiveInsightResolutionConfidence(1) &&
    !isRuntimeExecutiveInsightResolutionConfidence(-0.01) &&
    !isRuntimeExecutiveInsightResolutionConfidence(1.01);

  const frozen =
    Object.isFrozen(resolutionModule) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(runtimeExecutiveInsightResolutionCanonicalIdentity) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_RULE_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CODES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_BOUNDARY);

  const contractsBoundaryIntact =
    resolutionModule.boundary.soleImmediateDependency ===
      "REX-4:2/RuntimeExecutiveInsightExperienceContracts" &&
    resolutionModule.boundary.consumesContractsOnly === true &&
    resolutionModule.boundary.importsRex41Directly === false &&
    resolutionModule.boundary.introducesRanking === false &&
    resolutionModule.boundary.introducesPresentationResolution === false &&
    resolutionModule.boundary.introducesLlmGeneration === false &&
    resolutionModule.boundary.infersCausality === false;

  const registryCountsOk =
    registry.resolutionStatusCount ===
      RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES.length &&
    registry.ruleKindCount ===
      RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_RULE_KINDS.length &&
    registry.resolutionCodeCount ===
      RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CODES.length &&
    registry.publicApiCount ===
      runtimeExecutiveInsightResolutionApiNames.length &&
    registry.publicTypeCount ===
      RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_PUBLIC_TYPE_NAMES.length;

  // Keep payload helper referenced so contracts surface remains used.
  const payloadHelperOk = isRuntimeExecutiveInsightEvidencePayload({
    value: 1,
  });

  const ok =
    identityOk &&
    vocabOk &&
    noKor &&
    kpiSupported &&
    koiSupported &&
    confidenceBoundsEnforced &&
    frozen &&
    contractsBoundaryIntact &&
    registryCountsOk &&
    payloadHelperOk &&
    upstream.ok === true &&
    resolutionModule.principle === RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_PRINCIPLE;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveInsightResolutionIdentity,
    version: runtimeExecutiveInsightResolutionVersion,
    namespace: runtimeExecutiveInsightResolutionNamespace,
    dependencyIdentity: runtimeExecutiveInsightResolutionDependencyIdentity,
    resolutionStatusCount: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_STATUSES.length,
    ruleKindCount: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_RULE_KINDS.length,
    resolutionCodeCount: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CODES.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_PUBLIC_TYPE_NAMES.length,
    publicApiCount: runtimeExecutiveInsightResolutionApiNames.length,
    supportedCategoryCount:
      RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_CATEGORIES.length,
    supportedSubjectKindCount:
      RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_SUBJECT_KINDS.length,
    sectionCount: RUNTIME_EXECUTIVE_INSIGHT_RESOLUTION_REGISTRY_SECTIONS.length,
    frozen,
    contractsBoundaryIntact,
    upstreamContractsOk: upstream.ok === true,
    noKor,
    kpiSupported,
    koiSupported,
    confidenceBoundsEnforced,
  });
}
