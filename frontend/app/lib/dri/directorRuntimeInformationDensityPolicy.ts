/**
 * DRI-5:5 — Director Runtime Information Density Policy.
 *
 * Deterministic semantic policy for information density only:
 * minimal | standard | expanded.
 *
 * No content selection, KPI/KOI calculation, layout, orchestration, or rendering.
 */

import {
  DIRECTOR_RUNTIME_ATTENTION_LEVELS,
  DIRECTOR_RUNTIME_ATTENTION_REASONS,
  DIRECTOR_RUNTIME_ATTENTION_SIGNALS,
  DIRECTOR_RUNTIME_EMPHASIS_LEVELS,
  DIRECTOR_RUNTIME_INFORMATION_DENSITIES,
  DIRECTOR_RUNTIME_INTERACTION_EXPOSURES,
  DIRECTOR_RUNTIME_PRESENTATION_INTENT_SOURCES,
  DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_REASONS,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_SIGNALS,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_STATES,
  DIRECTOR_RUNTIME_PRESENTATION_STATES,
  DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES,
  areDirectorRuntimePresentationIntentsEqual,
  compareDirectorRuntimeAttentionLevels,
  compareDirectorRuntimeEmphasisLevels,
  compareDirectorRuntimePresentationIntents,
  compareDirectorRuntimePresentationStates,
  createDirectorRuntimePresentationIntent,
  createDirectorRuntimePresentationIntentCollection,
  createDirectorRuntimePresentationIntentSnapshot,
  deriveDirectorRuntimePresentationIntentId,
  describeDirectorRuntimePresentationStateTransition,
  directorRuntimeAttentionEmphasisPolicyIdentity,
  findDirectorRuntimePresentationIntentById,
  findDirectorRuntimePresentationIntentsBySubjectId,
  getDirectorRuntimeAttentionRank,
  getDirectorRuntimeEmphasisRank,
  getDirectorRuntimePresentationStateRank,
  isDirectorRuntimeAttentionAtLeast,
  isDirectorRuntimeAttentionLevel,
  isDirectorRuntimeEmphasisLevel,
  isDirectorRuntimeInformationDensity,
  isDirectorRuntimeInteractionExposure,
  isDirectorRuntimePresentationIntent,
  isDirectorRuntimePresentationIntentSource,
  isDirectorRuntimePresentationPriority,
  isDirectorRuntimePresentationState,
  isDirectorRuntimePresentationStateAtLeast,
  isDirectorRuntimePresentationVisibility,
  resolveDirectorRuntimeAttention,
  resolveDirectorRuntimeAttentionEmphasisPolicies,
  resolveDirectorRuntimeAttentionEmphasisPolicy,
  resolveDirectorRuntimeEmphasis,
  resolveDirectorRuntimePresentationState,
  resolveDirectorRuntimePresentationStates,
  validateDirectorRuntimeAttentionPolicyInput,
  validateDirectorRuntimePresentationIntent,
  validateDirectorRuntimePresentationStateResolutionInput,
  type DirectorRuntimeAttentionEmphasisPolicyResult,
  type DirectorRuntimeInformationDensity,
  type DirectorRuntimePresentationSubject,
} from "@/app/lib/dri/directorRuntimeAttentionEmphasisPolicy";

export {
  DIRECTOR_RUNTIME_ATTENTION_LEVELS,
  DIRECTOR_RUNTIME_ATTENTION_REASONS,
  DIRECTOR_RUNTIME_ATTENTION_SIGNALS,
  DIRECTOR_RUNTIME_EMPHASIS_LEVELS,
  DIRECTOR_RUNTIME_INFORMATION_DENSITIES,
  DIRECTOR_RUNTIME_INTERACTION_EXPOSURES,
  DIRECTOR_RUNTIME_PRESENTATION_INTENT_SOURCES,
  DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_REASONS,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_SIGNALS,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_STATES,
  DIRECTOR_RUNTIME_PRESENTATION_STATES,
  DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES,
  areDirectorRuntimePresentationIntentsEqual,
  compareDirectorRuntimeAttentionLevels,
  compareDirectorRuntimeEmphasisLevels,
  compareDirectorRuntimePresentationIntents,
  compareDirectorRuntimePresentationStates,
  createDirectorRuntimePresentationIntent,
  createDirectorRuntimePresentationIntentCollection,
  createDirectorRuntimePresentationIntentSnapshot,
  deriveDirectorRuntimePresentationIntentId,
  describeDirectorRuntimePresentationStateTransition,
  findDirectorRuntimePresentationIntentById,
  findDirectorRuntimePresentationIntentsBySubjectId,
  getDirectorRuntimeAttentionRank,
  getDirectorRuntimeEmphasisRank,
  getDirectorRuntimePresentationStateRank,
  isDirectorRuntimeAttentionAtLeast,
  isDirectorRuntimeAttentionLevel,
  isDirectorRuntimeEmphasisLevel,
  isDirectorRuntimeInformationDensity,
  isDirectorRuntimeInteractionExposure,
  isDirectorRuntimePresentationIntent,
  isDirectorRuntimePresentationIntentSource,
  isDirectorRuntimePresentationPriority,
  isDirectorRuntimePresentationState,
  isDirectorRuntimePresentationStateAtLeast,
  isDirectorRuntimePresentationVisibility,
  resolveDirectorRuntimeAttention,
  resolveDirectorRuntimeAttentionEmphasisPolicies,
  resolveDirectorRuntimeAttentionEmphasisPolicy,
  resolveDirectorRuntimeEmphasis,
  resolveDirectorRuntimePresentationState,
  resolveDirectorRuntimePresentationStates,
  validateDirectorRuntimeAttentionPolicyInput,
  validateDirectorRuntimePresentationIntent,
  validateDirectorRuntimePresentationStateResolutionInput,
};

export type {
  DirectorRuntimeAttentionEmphasisPolicyResult,
  DirectorRuntimeAttentionLevel,
  DirectorRuntimeEmphasisLevel,
  DirectorRuntimeInformationDensity,
  DirectorRuntimeInteractionExposure,
  DirectorRuntimePresentationIntent,
  DirectorRuntimePresentationIntentContextReference,
  DirectorRuntimePresentationIntentReason,
  DirectorRuntimePresentationIntentSource,
  DirectorRuntimePresentationPriority,
  DirectorRuntimePresentationState,
  DirectorRuntimePresentationStateResolution,
  DirectorRuntimePresentationSubject,
  DirectorRuntimePresentationVisibility,
} from "@/app/lib/dri/directorRuntimeAttentionEmphasisPolicy";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeInformationDensityPolicyIdentity =
  "DRI-5:5/DirectorRuntimeInformationDensityPolicy" as const;
export const directorRuntimeInformationDensityPolicyVersion = "5.5.0" as const;
export const directorRuntimeInformationDensityPolicyNamespace =
  "nexora.dri.adaptive-presentation.information-density-policy" as const;
export const directorRuntimeInformationDensityPolicyUpstream =
  directorRuntimeAttentionEmphasisPolicyIdentity;

export const directorRuntimeInformationDensityPolicyCanonicalIdentity = Object.freeze({
  identity: directorRuntimeInformationDensityPolicyIdentity,
  version: directorRuntimeInformationDensityPolicyVersion,
  namespace: directorRuntimeInformationDensityPolicyNamespace,
  upstream: directorRuntimeInformationDensityPolicyUpstream,
});

// ─── Density signals ────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_INFORMATION_DENSITY_SIGNALS = Object.freeze([
  "baseline",
  "inspection",
  "analysis",
  "decision-context",
  "operation-context",
  "explicit-director",
] as const);
export type DirectorRuntimeInformationDensitySignal =
  (typeof DIRECTOR_RUNTIME_INFORMATION_DENSITY_SIGNALS)[number];

// ─── Density reason codes ───────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_INFORMATION_DENSITY_REASONS = Object.freeze([
  "operation-context",
  "decision-context",
  "analysis",
  "inspection",
  "explicit-director",
  "baseline",
] as const);
export type DirectorRuntimeInformationDensityReason =
  (typeof DIRECTOR_RUNTIME_INFORMATION_DENSITY_REASONS)[number];

// ─── Precedence ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_INFORMATION_DENSITY_PRECEDENCE = Object.freeze([
  "operation-context",
  "decision-context",
  "analysis",
  "inspection",
  "explicit-director",
  "baseline",
] as const);

// ─── Density rank ───────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_INFORMATION_DENSITY_RANK = Object.freeze({
  minimal: 0,
  standard: 1,
  expanded: 2,
} as const satisfies Record<DirectorRuntimeInformationDensity, number>);

export type DirectorRuntimeInformationDensityRank =
  (typeof DIRECTOR_RUNTIME_INFORMATION_DENSITY_RANK)[DirectorRuntimeInformationDensity];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeInformationDensityPolicyInput {
  readonly subject: DirectorRuntimePresentationSubject;
  readonly attentionPolicy: DirectorRuntimeAttentionEmphasisPolicyResult;
  readonly signal: DirectorRuntimeInformationDensitySignal;
  readonly requestedDensity?: DirectorRuntimeInformationDensity;
  readonly inspectionRequired: boolean;
  readonly analysisRequired: boolean;
  readonly decisionContextRequired: boolean;
  readonly operationContextRequired: boolean;
  readonly reasonCode?: string;
}

export interface DirectorRuntimeInformationDensityResolution {
  readonly density: DirectorRuntimeInformationDensity;
  readonly resolvedBy: DirectorRuntimeInformationDensitySignal;
  readonly reasonCode: DirectorRuntimeInformationDensityReason;
  readonly subject: DirectorRuntimePresentationSubject;
  readonly inputReasonCode?: string;
}

export interface DirectorRuntimeInformationDensityTransition {
  readonly from: DirectorRuntimeInformationDensity;
  readonly to: DirectorRuntimeInformationDensity;
  readonly changed: boolean;
}

// ─── Validation ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_INFORMATION_DENSITY_POLICY_VALIDATION_ISSUE_CODES =
  Object.freeze([
    "missing-subject",
    "invalid-subject-id",
    "invalid-subject-kind",
    "invalid-subject-namespace",
    "invalid-attention-policy",
    "invalid-density-signal",
    "invalid-requested-density",
    "invalid-inspection-required",
    "invalid-analysis-required",
    "invalid-decision-context-required",
    "invalid-operation-context-required",
    "invalid-reason-code",
  ] as const);
export type DirectorRuntimeInformationDensityPolicyValidationIssueCode =
  (typeof DIRECTOR_RUNTIME_INFORMATION_DENSITY_POLICY_VALIDATION_ISSUE_CODES)[number];

export interface DirectorRuntimeInformationDensityPolicyValidationIssue {
  readonly code: DirectorRuntimeInformationDensityPolicyValidationIssueCode;
  readonly path: string;
  readonly message: string;
}

export interface DirectorRuntimeInformationDensityPolicyValidationResult {
  readonly valid: boolean;
  readonly issues: readonly DirectorRuntimeInformationDensityPolicyValidationIssue[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export function isDirectorRuntimeInformationDensitySignal(
  value: unknown,
): value is DirectorRuntimeInformationDensitySignal {
  return (DIRECTOR_RUNTIME_INFORMATION_DENSITY_SIGNALS as readonly unknown[])
    .includes(value);
}

export function isDirectorRuntimeInformationDensityReason(
  value: unknown,
): value is DirectorRuntimeInformationDensityReason {
  return (DIRECTOR_RUNTIME_INFORMATION_DENSITY_REASONS as readonly unknown[])
    .includes(value);
}

function issue(
  code: DirectorRuntimeInformationDensityPolicyValidationIssueCode,
  path: string,
  message: string,
): DirectorRuntimeInformationDensityPolicyValidationIssue {
  return Object.freeze({ code, path, message });
}

function freezeSubject(
  subject: DirectorRuntimePresentationSubject,
): DirectorRuntimePresentationSubject {
  return Object.freeze({ ...subject });
}

function freezeValidationResult(
  issues: readonly DirectorRuntimeInformationDensityPolicyValidationIssue[],
): DirectorRuntimeInformationDensityPolicyValidationResult {
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze([...issues]),
  });
}

function isValidAttentionPolicyResult(
  value: unknown,
): value is DirectorRuntimeAttentionEmphasisPolicyResult {
  if (!isPlainObject(value)) return false;
  if (!isPlainObject(value.attention) || !isPlainObject(value.emphasis)) return false;

  const { attention, emphasis } = value;
  if (!(DIRECTOR_RUNTIME_ATTENTION_LEVELS as readonly unknown[]).includes(attention.attention)) {
    return false;
  }
  if (!(DIRECTOR_RUNTIME_ATTENTION_SIGNALS as readonly unknown[]).includes(attention.resolvedBy)) {
    return false;
  }
  if (!(DIRECTOR_RUNTIME_ATTENTION_REASONS as readonly unknown[]).includes(attention.reasonCode)) {
    return false;
  }
  if (!isPlainObject(attention.subject)) return false;
  if (!isNonEmptyString(attention.subject.subjectId)) return false;
  if (!isNonEmptyString(attention.subject.subjectKind)) return false;
  if (
    attention.subject.namespace !== undefined &&
    !isNonEmptyString(attention.subject.namespace)
  ) {
    return false;
  }
  if (
    attention.inputReasonCode !== undefined &&
    !isNonEmptyString(attention.inputReasonCode)
  ) {
    return false;
  }

  if (!(DIRECTOR_RUNTIME_EMPHASIS_LEVELS as readonly unknown[]).includes(emphasis.emphasis)) {
    return false;
  }
  if (!(DIRECTOR_RUNTIME_ATTENTION_LEVELS as readonly unknown[]).includes(emphasis.attention)) {
    return false;
  }
  if (emphasis.reasonCode !== "attention-emphasis-mapping") return false;
  return true;
}

function collectInputIssues(
  value: unknown,
  path = "input",
): DirectorRuntimeInformationDensityPolicyValidationIssue[] {
  if (!isPlainObject(value)) {
    return [issue("missing-subject", path, "density policy input must be a plain object")];
  }

  const issues: DirectorRuntimeInformationDensityPolicyValidationIssue[] = [];

  if (!isPlainObject(value.subject)) {
    issues.push(issue("missing-subject", `${path}.subject`, "subject must be a plain object"));
  } else {
    if (!isNonEmptyString(value.subject.subjectId)) {
      issues.push(issue(
        "invalid-subject-id",
        `${path}.subject.subjectId`,
        "subjectId must be a non-empty string",
      ));
    }
    if (!isNonEmptyString(value.subject.subjectKind)) {
      issues.push(issue(
        "invalid-subject-kind",
        `${path}.subject.subjectKind`,
        "subjectKind must be a non-empty string",
      ));
    }
    if (
      value.subject.namespace !== undefined &&
      !isNonEmptyString(value.subject.namespace)
    ) {
      issues.push(issue(
        "invalid-subject-namespace",
        `${path}.subject.namespace`,
        "namespace must be a non-empty string when provided",
      ));
    }
  }

  if (!isValidAttentionPolicyResult(value.attentionPolicy)) {
    issues.push(issue(
      "invalid-attention-policy",
      `${path}.attentionPolicy`,
      "attentionPolicy must be a structurally valid attention/emphasis policy result",
    ));
  }

  if (!isDirectorRuntimeInformationDensitySignal(value.signal)) {
    issues.push(issue(
      "invalid-density-signal",
      `${path}.signal`,
      "signal must be a canonical information density signal",
    ));
  }

  if (
    value.requestedDensity !== undefined &&
    !isDirectorRuntimeInformationDensity(value.requestedDensity)
  ) {
    issues.push(issue(
      "invalid-requested-density",
      `${path}.requestedDensity`,
      "requestedDensity must be a canonical information density when provided",
    ));
  }

  if (typeof value.inspectionRequired !== "boolean") {
    issues.push(issue(
      "invalid-inspection-required",
      `${path}.inspectionRequired`,
      "inspectionRequired must be a boolean",
    ));
  }

  if (typeof value.analysisRequired !== "boolean") {
    issues.push(issue(
      "invalid-analysis-required",
      `${path}.analysisRequired`,
      "analysisRequired must be a boolean",
    ));
  }

  if (typeof value.decisionContextRequired !== "boolean") {
    issues.push(issue(
      "invalid-decision-context-required",
      `${path}.decisionContextRequired`,
      "decisionContextRequired must be a boolean",
    ));
  }

  if (typeof value.operationContextRequired !== "boolean") {
    issues.push(issue(
      "invalid-operation-context-required",
      `${path}.operationContextRequired`,
      "operationContextRequired must be a boolean",
    ));
  }

  if (value.reasonCode !== undefined && !isNonEmptyString(value.reasonCode)) {
    issues.push(issue(
      "invalid-reason-code",
      `${path}.reasonCode`,
      "reasonCode must be a non-empty string when provided",
    ));
  }

  return issues;
}

export function validateDirectorRuntimeInformationDensityPolicyInput(
  value: unknown,
): DirectorRuntimeInformationDensityPolicyValidationResult {
  return freezeValidationResult(collectInputIssues(value));
}

// ─── Rank / comparison helpers ──────────────────────────────────────────────

export function getDirectorRuntimeInformationDensityRank(
  density: DirectorRuntimeInformationDensity,
): DirectorRuntimeInformationDensityRank {
  if (!isDirectorRuntimeInformationDensity(density)) {
    throw new TypeError("density must be a canonical information density");
  }
  return DIRECTOR_RUNTIME_INFORMATION_DENSITY_RANK[density];
}

export function compareDirectorRuntimeInformationDensities(
  left: DirectorRuntimeInformationDensity,
  right: DirectorRuntimeInformationDensity,
): number {
  return getDirectorRuntimeInformationDensityRank(left) -
    getDirectorRuntimeInformationDensityRank(right);
}

export function isDirectorRuntimeInformationDensityAtLeast(
  density: DirectorRuntimeInformationDensity,
  minimum: DirectorRuntimeInformationDensity,
): boolean {
  return compareDirectorRuntimeInformationDensities(density, minimum) >= 0;
}

function maxDensity(
  left: DirectorRuntimeInformationDensity,
  right: DirectorRuntimeInformationDensity,
): DirectorRuntimeInformationDensity {
  return compareDirectorRuntimeInformationDensities(left, right) >= 0 ? left : right;
}

export function describeDirectorRuntimeInformationDensityTransition(
  from: DirectorRuntimeInformationDensity,
  to: DirectorRuntimeInformationDensity,
): DirectorRuntimeInformationDensityTransition {
  if (!isDirectorRuntimeInformationDensity(from) || !isDirectorRuntimeInformationDensity(to)) {
    throw new TypeError("from and to must be canonical information densities");
  }
  return Object.freeze({
    from,
    to,
    changed: from !== to,
  });
}

// ─── Resolution ─────────────────────────────────────────────────────────────

/**
 * Canonical precedence:
 * operation-context > decision-context > analysis > inspection >
 * explicit-director > baseline
 *
 * Attention/emphasis/state do not determine density.
 * Stronger floors cannot be downgraded by weaker requested density.
 */
export function resolveDirectorRuntimeInformationDensity(
  input: DirectorRuntimeInformationDensityPolicyInput,
): DirectorRuntimeInformationDensityResolution {
  const validation = validateDirectorRuntimeInformationDensityPolicyInput(input);
  if (!validation.valid) {
    const first = validation.issues[0]!;
    throw new TypeError(`${first.code}: ${first.message}`);
  }

  const subject = freezeSubject(input.subject);
  const inputReasonCode = input.reasonCode;

  let floor: DirectorRuntimeInformationDensity = "minimal";
  let floorBy: DirectorRuntimeInformationDensitySignal = "baseline";
  let floorReason: DirectorRuntimeInformationDensityReason = "baseline";

  if (input.operationContextRequired) {
    floor = "expanded";
    floorBy = "operation-context";
    floorReason = "operation-context";
  } else if (input.decisionContextRequired) {
    floor = "expanded";
    floorBy = "decision-context";
    floorReason = "decision-context";
  } else if (input.analysisRequired) {
    floor = "expanded";
    floorBy = "analysis";
    floorReason = "analysis";
  } else if (input.inspectionRequired) {
    floor = "standard";
    floorBy = "inspection";
    floorReason = "inspection";
  } else {
    floor = "minimal";
    floorBy = "baseline";
    floorReason = "baseline";
  }

  let density: DirectorRuntimeInformationDensity = floor;
  let resolvedBy: DirectorRuntimeInformationDensitySignal = floorBy;
  let reasonCode: DirectorRuntimeInformationDensityReason = floorReason;

  if (input.requestedDensity !== undefined) {
    const combined = maxDensity(floor, input.requestedDensity);
    density = combined;
    if (
      combined === input.requestedDensity &&
      compareDirectorRuntimeInformationDensities(input.requestedDensity, floor) > 0
    ) {
      resolvedBy = "explicit-director";
      reasonCode = "explicit-director";
    }
  }

  return Object.freeze({
    density,
    resolvedBy,
    reasonCode,
    subject,
    ...(inputReasonCode === undefined ? {} : { inputReasonCode }),
  });
}

/** Subject-local batch resolution. Preserves input order. No cross-subject coordination. */
export function resolveDirectorRuntimeInformationDensities(
  inputs: readonly DirectorRuntimeInformationDensityPolicyInput[],
): readonly DirectorRuntimeInformationDensityResolution[] {
  return Object.freeze(
    inputs.map((entry) => resolveDirectorRuntimeInformationDensity(entry)),
  );
}

// ─── Invariants ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_INFORMATION_DENSITY_POLICY_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "three-canonical-densities",
    statement: "exactly three canonical densities exist",
  }),
  Object.freeze({
    id: "reuse-foundation-density-vocabulary",
    statement: "DRI-5 Foundation density vocabulary is reused",
  }),
  Object.freeze({
    id: "operation-context-requires-expanded",
    statement: "operation context requires expanded density",
  }),
  Object.freeze({
    id: "decision-context-requires-expanded",
    statement: "decision context requires expanded density",
  }),
  Object.freeze({
    id: "analysis-requires-expanded",
    statement: "analysis requires expanded density",
  }),
  Object.freeze({
    id: "inspection-requires-at-least-standard",
    statement: "inspection requires at least standard density",
  }),
  Object.freeze({
    id: "baseline-is-minimal",
    statement: "baseline density is minimal",
  }),
  Object.freeze({
    id: "explicit-stronger-preserved",
    statement: "explicit stronger density is preserved",
  }),
  Object.freeze({
    id: "weaker-explicit-cannot-downgrade",
    statement: "explicit weaker density cannot downgrade stronger requirement",
  }),
  Object.freeze({
    id: "deterministic",
    statement: "density resolution is deterministic",
  }),
  Object.freeze({
    id: "input-not-mutated",
    statement: "input is not mutated",
  }),
  Object.freeze({
    id: "result-immutable",
    statement: "result is immutable",
  }),
  Object.freeze({
    id: "state-independent",
    statement: "state does not automatically determine density",
  }),
  Object.freeze({
    id: "attention-independent",
    statement: "attention does not automatically determine density",
  }),
  Object.freeze({
    id: "emphasis-independent",
    statement: "emphasis does not automatically determine density",
  }),
  Object.freeze({
    id: "priority-independent",
    statement: "priority does not determine density",
  }),
  Object.freeze({
    id: "visibility-independent",
    statement: "visibility does not determine density",
  }),
  Object.freeze({
    id: "density-does-not-determine-state",
    statement: "density does not determine presentation state",
  }),
  Object.freeze({
    id: "no-kpi-calculation",
    statement: "no KPI calculation occurs",
  }),
  Object.freeze({
    id: "no-koi-calculation",
    statement: "no KOI calculation occurs",
  }),
  Object.freeze({
    id: "no-content-field-selection",
    statement: "no content-field selection occurs",
  }),
  Object.freeze({
    id: "no-object-count-logic",
    statement: "no object-count logic occurs",
  }),
  Object.freeze({
    id: "no-viewport-logic",
    statement: "no viewport logic occurs",
  }),
  Object.freeze({
    id: "no-renderer-behavior",
    statement: "no renderer behavior occurs",
  }),
  Object.freeze({
    id: "no-animation-behavior",
    statement: "no animation behavior occurs",
  }),
  Object.freeze({
    id: "batch-subject-local",
    statement: "batch evaluation is subject-local",
  }),
  Object.freeze({
    id: "side-effect-free",
    statement: "behavior is side-effect free",
  }),
  Object.freeze({
    id: "sole-immediate-dependency",
    statement: "exactly one immediate dependency exists",
  }),
  Object.freeze({
    id: "dependency-is-dri-5-4",
    statement: "sole dependency is DRI-5:4",
  }),
  Object.freeze({
    id: "no-orchestration",
    statement: "DRI-5:6 orchestration is not implemented",
  }),
] as const);

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeInformationDensityPolicyApiNames = Object.freeze([
  "isDirectorRuntimeInformationDensitySignal",
  "isDirectorRuntimeInformationDensityReason",
  "validateDirectorRuntimeInformationDensityPolicyInput",
  "getDirectorRuntimeInformationDensityRank",
  "compareDirectorRuntimeInformationDensities",
  "isDirectorRuntimeInformationDensityAtLeast",
  "describeDirectorRuntimeInformationDensityTransition",
  "resolveDirectorRuntimeInformationDensity",
  "resolveDirectorRuntimeInformationDensities",
  "verifyDirectorRuntimeInformationDensityPolicy",
] as const);

export const directorRuntimeInformationDensityPolicyRegistry = Object.freeze({
  identity: directorRuntimeInformationDensityPolicyIdentity,
  version: directorRuntimeInformationDensityPolicyVersion,
  namespace: directorRuntimeInformationDensityPolicyNamespace,
  dependency: directorRuntimeInformationDensityPolicyUpstream,
  informationDensities: DIRECTOR_RUNTIME_INFORMATION_DENSITIES,
  densityCount: DIRECTOR_RUNTIME_INFORMATION_DENSITIES.length,
  densitySignals: DIRECTOR_RUNTIME_INFORMATION_DENSITY_SIGNALS,
  densitySignalCount: DIRECTOR_RUNTIME_INFORMATION_DENSITY_SIGNALS.length,
  densityReasons: DIRECTOR_RUNTIME_INFORMATION_DENSITY_REASONS,
  densityReasonCount: DIRECTOR_RUNTIME_INFORMATION_DENSITY_REASONS.length,
  densityRank: DIRECTOR_RUNTIME_INFORMATION_DENSITY_RANK,
  precedence: DIRECTOR_RUNTIME_INFORMATION_DENSITY_PRECEDENCE,
  precedenceRuleCount: DIRECTOR_RUNTIME_INFORMATION_DENSITY_PRECEDENCE.length,
  defaultDensity: "minimal" as const,
  inspectionFloor: "standard" as const,
  analysisFloor: "expanded" as const,
  decisionContextFloor: "expanded" as const,
  operationContextFloor: "expanded" as const,
  invariants: DIRECTOR_RUNTIME_INFORMATION_DENSITY_POLICY_INVARIANTS,
  invariantCount: DIRECTOR_RUNTIME_INFORMATION_DENSITY_POLICY_INVARIANTS.length,
  publicApis: directorRuntimeInformationDensityPolicyApiNames,
  publicApiCount: directorRuntimeInformationDensityPolicyApiNames.length,
});

export const directorRuntimeInformationDensityPolicy = Object.freeze({
  phase: "DRI-5:5" as const,
  name: "DirectorRuntimeInformationDensityPolicy" as const,
  identity: directorRuntimeInformationDensityPolicyIdentity,
  namespace: directorRuntimeInformationDensityPolicyNamespace,
  version: directorRuntimeInformationDensityPolicyVersion,
  layer: "DirectorRuntimeAdaptivePresentation" as const,
  stage: "InformationDensityPolicy" as const,
  status: "InformationDensityPolicyReady" as const,
  upstreamDependency: directorRuntimeInformationDensityPolicyUpstream,
  deterministic: true as const,
  immutable: true as const,
  rendererIndependent: true as const,
  semantic: true as const,
  philosophy: "density-meaning-not-layout" as const,
  informationDensities: DIRECTOR_RUNTIME_INFORMATION_DENSITIES,
  densitySignals: DIRECTOR_RUNTIME_INFORMATION_DENSITY_SIGNALS,
  densityReasons: DIRECTOR_RUNTIME_INFORMATION_DENSITY_REASONS,
  precedence: DIRECTOR_RUNTIME_INFORMATION_DENSITY_PRECEDENCE,
  densityRank: DIRECTOR_RUNTIME_INFORMATION_DENSITY_RANK,
  invariants: DIRECTOR_RUNTIME_INFORMATION_DENSITY_POLICY_INVARIANTS,
  publicApiSurface: directorRuntimeInformationDensityPolicyApiNames,
  registry: directorRuntimeInformationDensityPolicyRegistry,
  attentionPolicyBoundary: "DRI-5:4-attention-emphasis-policy-only" as const,
  architecturalStatus:
    "Established · Deterministic · Immutable · Semantic · RendererIndependent · ReadyForAdaptivePresentationOrchestration" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeInformationDensityPolicyVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeInformationDensityPolicyIdentity;
  readonly version: typeof directorRuntimeInformationDensityPolicyVersion;
  readonly namespace: typeof directorRuntimeInformationDensityPolicyNamespace;
  readonly dependency: typeof directorRuntimeInformationDensityPolicyUpstream;
  readonly densityCount: number;
  readonly densitySignalCount: number;
  readonly densityReasonCount: number;
  readonly precedenceRuleCount: number;
  readonly invariantCount: number;
  readonly frozen: boolean;
}

function exactOrder<T extends string>(
  actual: readonly T[],
  expected: readonly T[],
): boolean {
  return actual.length === expected.length &&
    actual.every((value, index) => value === expected[index]);
}

export function verifyDirectorRuntimeInformationDensityPolicy():
  DirectorRuntimeInformationDensityPolicyVerification {
  const layer = directorRuntimeInformationDensityPolicy;
  const registry = directorRuntimeInformationDensityPolicyRegistry;

  const ok =
    layer.identity === "DRI-5:5/DirectorRuntimeInformationDensityPolicy" &&
    layer.version === "5.5.0" &&
    layer.namespace ===
      "nexora.dri.adaptive-presentation.information-density-policy" &&
    layer.upstreamDependency ===
      "DRI-5:4/DirectorRuntimeAttentionEmphasisPolicy" &&
    layer.upstreamDependency ===
      directorRuntimeAttentionEmphasisPolicyIdentity &&
    registry.dependency === layer.upstreamDependency &&
    exactOrder(
      DIRECTOR_RUNTIME_INFORMATION_DENSITIES,
      ["minimal", "standard", "expanded"],
    ) &&
    exactOrder(
      DIRECTOR_RUNTIME_INFORMATION_DENSITY_SIGNALS,
      [
        "baseline",
        "inspection",
        "analysis",
        "decision-context",
        "operation-context",
        "explicit-director",
      ],
    ) &&
    exactOrder(
      DIRECTOR_RUNTIME_INFORMATION_DENSITY_REASONS,
      [
        "operation-context",
        "decision-context",
        "analysis",
        "inspection",
        "explicit-director",
        "baseline",
      ],
    ) &&
    exactOrder(
      DIRECTOR_RUNTIME_INFORMATION_DENSITY_PRECEDENCE,
      [
        "operation-context",
        "decision-context",
        "analysis",
        "inspection",
        "explicit-director",
        "baseline",
      ],
    ) &&
    DIRECTOR_RUNTIME_INFORMATION_DENSITY_RANK.minimal === 0 &&
    DIRECTOR_RUNTIME_INFORMATION_DENSITY_RANK.standard === 1 &&
    DIRECTOR_RUNTIME_INFORMATION_DENSITY_RANK.expanded === 2 &&
    registry.densityCount === 3 &&
    registry.densitySignalCount === 6 &&
    registry.densityReasonCount === 6 &&
    registry.precedenceRuleCount === 6 &&
    registry.invariantCount === 30 &&
    registry.defaultDensity === "minimal" &&
    Object.isFrozen(layer) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(DIRECTOR_RUNTIME_INFORMATION_DENSITIES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_INFORMATION_DENSITY_SIGNALS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_INFORMATION_DENSITY_REASONS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_INFORMATION_DENSITY_PRECEDENCE) &&
    Object.isFrozen(DIRECTOR_RUNTIME_INFORMATION_DENSITY_RANK) &&
    Object.isFrozen(DIRECTOR_RUNTIME_INFORMATION_DENSITY_POLICY_INVARIANTS);

  return Object.freeze({
    ok,
    identity: directorRuntimeInformationDensityPolicyIdentity,
    version: directorRuntimeInformationDensityPolicyVersion,
    namespace: directorRuntimeInformationDensityPolicyNamespace,
    dependency: directorRuntimeInformationDensityPolicyUpstream,
    densityCount: DIRECTOR_RUNTIME_INFORMATION_DENSITIES.length,
    densitySignalCount: DIRECTOR_RUNTIME_INFORMATION_DENSITY_SIGNALS.length,
    densityReasonCount: DIRECTOR_RUNTIME_INFORMATION_DENSITY_REASONS.length,
    precedenceRuleCount: DIRECTOR_RUNTIME_INFORMATION_DENSITY_PRECEDENCE.length,
    invariantCount: DIRECTOR_RUNTIME_INFORMATION_DENSITY_POLICY_INVARIANTS.length,
    frozen: Object.isFrozen(layer) && Object.isFrozen(registry),
  });
}
