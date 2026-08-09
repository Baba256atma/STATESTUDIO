/**
 * REX-3:4 — Runtime Executive Advisor Guidance & Executive Actions.
 *
 * Converts a grounded REX-3:3 structured response into deterministic Executive
 * Guidance and declarative Executive Action Options.
 *
 * Canonical flow:
 *   REX-3:3 Response Model
 *     → Guidance Resolution
 *     → Executive Action Option Resolution
 *     → Guidance + Action Package
 *     → Ready for Stage Coordination (REX-3:5)
 *
 * Guidance ≠ command. Action Option ≠ execution.
 * No LLM, UI, Stage mutation, or runtime execution.
 */

import {
  isRuntimeExecutiveAdvisorConfidence,
  isRuntimeExecutiveAdvisorSubjectKind,
  isRuntimeExecutiveAdvisorUrgency,
  runtimeExecutiveAdvisorResponseModelIdentity,
  runtimeExecutiveAdvisorResponseModelSupportedImportPath,
  runtimeExecutiveAdvisorResponseModelVersion,
  validateRuntimeExecutiveAdvisorResponse,
  verifyRuntimeExecutiveAdvisorResponseModel,
  type RuntimeExecutiveAdvisorConfidence,
  type RuntimeExecutiveAdvisorImplication,
  type RuntimeExecutiveAdvisorNextStepKind,
  type RuntimeExecutiveAdvisorObservation,
  type RuntimeExecutiveAdvisorProvenance,
  type RuntimeExecutiveAdvisorResponse,
  type RuntimeExecutiveAdvisorResponseRelationship,
  type RuntimeExecutiveAdvisorResponseRelationshipKind,
  type RuntimeExecutiveAdvisorSignal,
  type RuntimeExecutiveAdvisorSubjectKind,
  type RuntimeExecutiveAdvisorUrgency,
} from "@/app/lib/rex/runtimeExecutiveAdvisorResponseModel";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveAdvisorGuidanceActionsIdentity =
  "REX-3:4/RuntimeExecutiveAdvisorGuidanceActions" as const;

export const runtimeExecutiveAdvisorGuidanceActionsVersion = "3.4.0" as const;

export const runtimeExecutiveAdvisorGuidanceActionsNamespace =
  "nexora.rex.advisor-experience.guidance-actions" as const;

export const runtimeExecutiveAdvisorGuidanceActionsLayer =
  "RuntimeExecutiveExperience" as const;

export const runtimeExecutiveAdvisorGuidanceActionsDomain =
  "ExecutiveAdvisor" as const;

export const runtimeExecutiveAdvisorGuidanceActionsPhase =
  "GuidanceActions" as const;

export const runtimeExecutiveAdvisorGuidanceActionsArchitecturalRole =
  "RuntimeExecutiveAdvisorGuidanceActionsBoundary" as const;

export const runtimeExecutiveAdvisorGuidanceActionsDependencyIdentity =
  runtimeExecutiveAdvisorResponseModelIdentity;

export const runtimeExecutiveAdvisorGuidanceActionsDependencyPath =
  runtimeExecutiveAdvisorResponseModelSupportedImportPath;

export const runtimeExecutiveAdvisorGuidanceActionsSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveAdvisorGuidanceActions" as const;

export const runtimeExecutiveAdvisorGuidanceActionsStability =
  "GuidanceReady" as const;

export const runtimeExecutiveAdvisorGuidanceActionsDeterministic =
  true as const;

export const runtimeExecutiveAdvisorGuidanceActionsSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveAdvisorGuidanceActionsMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveAdvisorGuidanceActionsCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveAdvisorGuidanceActionsIdentity,
    version: runtimeExecutiveAdvisorGuidanceActionsVersion,
    namespace: runtimeExecutiveAdvisorGuidanceActionsNamespace,
    layer: runtimeExecutiveAdvisorGuidanceActionsLayer,
    domain: runtimeExecutiveAdvisorGuidanceActionsDomain,
    phase: runtimeExecutiveAdvisorGuidanceActionsPhase,
    architecturalRole:
      runtimeExecutiveAdvisorGuidanceActionsArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveAdvisorGuidanceActionsDependencyIdentity,
    dependencyPath: runtimeExecutiveAdvisorGuidanceActionsDependencyPath,
    supportedImportPath:
      runtimeExecutiveAdvisorGuidanceActionsSupportedImportPath,
    upstreamVersion: runtimeExecutiveAdvisorResponseModelVersion,
    stabilityStatus: runtimeExecutiveAdvisorGuidanceActionsStability,
    deterministicStatus:
      runtimeExecutiveAdvisorGuidanceActionsDeterministic,
    sideEffectPolicy:
      runtimeExecutiveAdvisorGuidanceActionsSideEffectPolicy,
    mutationPolicy: runtimeExecutiveAdvisorGuidanceActionsMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_PRINCIPLE =
  "Response → Guidance → Action Options → Later Coordination. Guidance is advisory; action options are declarative; neither executes." as const;

export const RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-Executive-Experience" as const,
  guidanceAuthority: "REX-3:4" as const,
  architecturalRole:
    "RuntimeExecutiveAdvisorGuidanceActionsBoundary" as const,
  soleImmediateDependency:
    "REX-3:3/RuntimeExecutiveAdvisorResponseModel" as const,
  consumesResponseModelOnly: true as const,
  importsRex32Directly: false as const,
  importsRex31Directly: false as const,
  importsRex2Directly: false as const,
  importsRex1Directly: false as const,
  importsExDriDirectly: false as const,
  importsDriDirectly: false as const,
  importsNolDirectly: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  aiProviderIndependent: true as const,
  executesActions: false as const,
  mutatesStageState: false as const,
  coordinatesStage: false as const,
  generatesProse: false as const,
  inventsRecommendations: false as const,
});

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_STATES = Object.freeze([
  "none",
  "available",
  "recommended",
  "urgent",
] as const);

export type RuntimeExecutiveAdvisorGuidanceState =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_STATES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_KINDS = Object.freeze([
  "observe",
  "inspect",
  "explain",
  "investigate",
  "compare",
  "trace",
  "monitor",
  "review",
  "prepare-scenario",
  "prepare-decision",
  "prepare-action",
] as const);

export type RuntimeExecutiveAdvisorGuidanceKind =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_KINDS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_PRIORITIES = Object.freeze([
  "low",
  "normal",
  "high",
  "critical",
] as const);

export type RuntimeExecutiveAdvisorGuidancePriority =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_PRIORITIES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_EXECUTIVE_ACTION_KINDS = Object.freeze([
  "inspect-subject",
  "focus-subject",
  "explain-subject",
  "compare-subjects",
  "trace-relationship",
  "show-related",
  "open-scenario",
  "open-decision",
  "open-execution",
  "review-decision",
  "review-execution",
  "dismiss-guidance",
] as const);

export type RuntimeExecutiveAdvisorExecutiveActionKind =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_EXECUTIVE_ACTION_KINDS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_EXECUTIVE_ACTION_STATES = Object.freeze([
  "available",
  "disabled",
  "requires-confirmation",
  "blocked",
] as const);

export type RuntimeExecutiveAdvisorExecutiveActionState =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_EXECUTIVE_ACTION_STATES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_ACTION_AUTHORITIES = Object.freeze([
  "advisor-only",
  "manager-confirmation",
  "runtime-coordination",
] as const);

export type RuntimeExecutiveAdvisorActionAuthority =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_ACTION_AUTHORITIES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_ACTION_SAFETIES = Object.freeze([
  "informational",
  "navigational",
  "workflow",
  "controlled",
] as const);

export type RuntimeExecutiveAdvisorActionSafety =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_ACTION_SAFETIES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_ACTION_PRECONDITION_KINDS = Object.freeze([
  "subject-present",
  "target-present",
  "relationship-present",
  "comparison-subjects-present",
  "decision-present",
  "execution-present",
  "manager-confirmation-required",
  "runtime-coordination-required",
] as const);

export type RuntimeExecutiveAdvisorActionPreconditionKind =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_ACTION_PRECONDITION_KINDS)[number];

/**
 * Canonical guidance → action mapping. Explicit and testable.
 */
export const RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_TO_ACTION_MAPPINGS =
  Object.freeze([
    Object.freeze({
      guidanceKind: "inspect" as const,
      actionKinds: Object.freeze(["inspect-subject"] as const),
    }),
    Object.freeze({
      guidanceKind: "explain" as const,
      actionKinds: Object.freeze(["explain-subject"] as const),
    }),
    Object.freeze({
      guidanceKind: "investigate" as const,
      actionKinds: Object.freeze([
        "inspect-subject",
        "trace-relationship",
        "focus-subject",
      ] as const),
    }),
    Object.freeze({
      guidanceKind: "compare" as const,
      actionKinds: Object.freeze(["compare-subjects"] as const),
    }),
    Object.freeze({
      guidanceKind: "trace" as const,
      actionKinds: Object.freeze(["trace-relationship"] as const),
    }),
    Object.freeze({
      guidanceKind: "monitor" as const,
      actionKinds: Object.freeze(["inspect-subject", "show-related"] as const),
    }),
    Object.freeze({
      guidanceKind: "review" as const,
      actionKinds: Object.freeze([
        "review-decision",
        "review-execution",
      ] as const),
    }),
    Object.freeze({
      guidanceKind: "prepare-scenario" as const,
      actionKinds: Object.freeze(["open-scenario"] as const),
    }),
    Object.freeze({
      guidanceKind: "prepare-decision" as const,
      actionKinds: Object.freeze([
        "open-decision",
        "review-decision",
      ] as const),
    }),
    Object.freeze({
      guidanceKind: "prepare-action" as const,
      actionKinds: Object.freeze([
        "open-execution",
        "review-execution",
      ] as const),
    }),
    Object.freeze({
      guidanceKind: "observe" as const,
      actionKinds: Object.freeze(["inspect-subject", "dismiss-guidance"] as const),
    }),
  ]);

export const RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_CAPABILITIES = Object.freeze([
  "guidance-modeling",
  "guidance-state-resolution",
  "guidance-kind-resolution",
  "guidance-priority-resolution",
  "guidance-rationale-modeling",
  "guidance-targeting",
  "guidance-confidence",
  "guidance-urgency",
  "primary-guidance-resolution",
  "alternative-guidance",
  "executive-action-modeling",
  "action-kind-resolution",
  "action-state-resolution",
  "action-authority-resolution",
  "action-safety-resolution",
  "action-precondition-resolution",
  "guidance-to-action-mapping",
  "action-readiness",
  "guidance-deduplication",
  "action-deduplication",
  "stable-guidance-ordering",
  "guidance-validation",
  "action-validation",
] as const);

export type RuntimeExecutiveAdvisorGuidanceCapability =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_CAPABILITIES)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "GuidanceStates",
    "GuidanceKinds",
    "GuidancePriorities",
    "ActionKinds",
    "ActionStates",
    "ActionAuthorities",
    "ActionSafeties",
    "ActionPreconditions",
    "Mappings",
    "Validation",
    "Capabilities",
  ] as const);

export type RuntimeExecutiveAdvisorGuidanceRegistrySection =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_REGISTRY_SECTIONS)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface RuntimeExecutiveAdvisorGuidanceTarget {
  readonly subjectId: string;
  readonly subjectKind?: RuntimeExecutiveAdvisorSubjectKind;
  readonly relationship?: RuntimeExecutiveAdvisorResponseRelationshipKind;
}

export interface RuntimeExecutiveAdvisorGuidanceRationale {
  readonly sourceObservationIds: ReadonlyArray<string>;
  readonly sourceSignalIds: ReadonlyArray<string>;
  readonly sourceRelationshipIds: ReadonlyArray<string>;
  readonly sourceImplicationIds: ReadonlyArray<string>;
}

export interface RuntimeExecutiveAdvisorGuidance {
  readonly id: string;
  readonly kind: RuntimeExecutiveAdvisorGuidanceKind;
  readonly priority: RuntimeExecutiveAdvisorGuidancePriority;
  readonly target: RuntimeExecutiveAdvisorGuidanceTarget;
  readonly confidence: RuntimeExecutiveAdvisorConfidence;
  readonly urgency: RuntimeExecutiveAdvisorUrgency;
  readonly rationale: RuntimeExecutiveAdvisorGuidanceRationale;
  readonly provenance: ReadonlyArray<RuntimeExecutiveAdvisorProvenance>;
  readonly dismissible: boolean;
}

export interface RuntimeExecutiveAdvisorActionPrecondition {
  readonly kind: RuntimeExecutiveAdvisorActionPreconditionKind;
  readonly satisfied: boolean;
}

export interface RuntimeExecutiveAdvisorExecutiveAction {
  readonly id: string;
  readonly kind: RuntimeExecutiveAdvisorExecutiveActionKind;
  readonly state: RuntimeExecutiveAdvisorExecutiveActionState;
  readonly authority: RuntimeExecutiveAdvisorActionAuthority;
  readonly safety: RuntimeExecutiveAdvisorActionSafety;
  readonly targetSubjectIds: ReadonlyArray<string>;
  readonly preconditions: ReadonlyArray<RuntimeExecutiveAdvisorActionPrecondition>;
  readonly sourceGuidanceIds: ReadonlyArray<string>;
  readonly provenance: ReadonlyArray<RuntimeExecutiveAdvisorProvenance>;
}

export interface RuntimeExecutiveAdvisorGuidancePackage {
  readonly state: RuntimeExecutiveAdvisorGuidanceState;
  readonly primaryGuidance: RuntimeExecutiveAdvisorGuidance | null;
  readonly guidance: ReadonlyArray<RuntimeExecutiveAdvisorGuidance>;
  readonly actions: ReadonlyArray<RuntimeExecutiveAdvisorExecutiveAction>;
  readonly confidence: RuntimeExecutiveAdvisorConfidence;
  readonly urgency: RuntimeExecutiveAdvisorUrgency;
  readonly isActionReady: boolean;
  readonly guidanceIdentity: typeof runtimeExecutiveAdvisorGuidanceActionsIdentity;
  readonly guidanceVersion: typeof runtimeExecutiveAdvisorGuidanceActionsVersion;
  readonly responseIdentity: typeof runtimeExecutiveAdvisorResponseModelIdentity;
  readonly responseVersion: typeof runtimeExecutiveAdvisorResponseModelVersion;
}

export interface RuntimeExecutiveAdvisorGuidanceIssue {
  readonly code: string;
  readonly message: string;
  readonly path?: string;
}

export interface RuntimeExecutiveAdvisorGuidanceValidationResult {
  readonly ok: boolean;
  readonly issues: ReadonlyArray<RuntimeExecutiveAdvisorGuidanceIssue>;
}

export const RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "no-guidance-without-response",
    order: 1,
    statement: "No guidance without a grounded REX-3:3 response.",
  }),
  Object.freeze({
    id: "rationale-provenance-required",
    order: 2,
    statement: "Every guidance item must preserve rationale/provenance.",
  }),
  Object.freeze({
    id: "guidance-strength-bounded",
    order: 3,
    statement: "Guidance strength may not exceed evidence strength.",
  }),
  Object.freeze({
    id: "no-fabricated-recommendation",
    order: 4,
    statement: "No fabricated executive recommendation.",
  }),
  Object.freeze({
    id: "guidance-non-mutating",
    order: 5,
    statement: "No guidance item directly mutates runtime state.",
  }),
  Object.freeze({
    id: "primary-in-collection",
    order: 6,
    statement: "Primary guidance must exist inside the guidance collection.",
  }),
  Object.freeze({
    id: "deterministic-guidance",
    order: 7,
    statement: "Same semantic input → same guidance output.",
  }),
] as const);

export const RUNTIME_EXECUTIVE_ADVISOR_ACTION_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "action-from-guidance",
    order: 1,
    statement: "Every action must originate from valid guidance.",
  }),
  Object.freeze({
    id: "no-action-execution",
    order: 2,
    statement: "No action executes in REX-3:4.",
  }),
  Object.freeze({
    id: "preconditions-for-availability",
    order: 3,
    statement: "Action availability must satisfy required preconditions.",
  }),
  Object.freeze({
    id: "explicit-authority",
    order: 4,
    statement: "Action authority must be explicit.",
  }),
  Object.freeze({
    id: "confirmation-not-bypassed",
    order: 5,
    statement:
      "Workflow-sensitive actions must not silently bypass manager confirmation.",
  }),
  Object.freeze({
    id: "coordination-declarative",
    order: 6,
    statement:
      "Actions requiring runtime coordination must remain declarative.",
  }),
  Object.freeze({
    id: "action-deduplication",
    order: 7,
    statement: "Duplicate semantic actions are coalesced.",
  }),
] as const);

export const RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_FORBIDDEN = Object.freeze([
  "LLM calls",
  "prompt templates",
  "embeddings",
  "generated prose",
  "action execution",
  "Stage mutation",
  "select()",
  "focus()",
  "navigate()",
  "openScenario()",
  "approveDecision()",
  "startExecution()",
  "dispatch()",
  "React components",
  "Stage coordination",
] as const);

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
  code: string,
  message: string,
  path?: string,
): RuntimeExecutiveAdvisorGuidanceIssue {
  return Object.freeze(
    path === undefined ? { code, message } : { code, message, path },
  );
}

function relationshipId(
  relationship: RuntimeExecutiveAdvisorResponseRelationship,
): string {
  return `${relationship.sourceSubjectId}->${relationship.targetSubjectId}:${relationship.kind}`;
}

function mergeIds(
  left: ReadonlyArray<string>,
  right: ReadonlyArray<string>,
): ReadonlyArray<string> {
  const seen = new Set<string>();
  const merged: string[] = [];
  for (const id of [...left, ...right]) {
    if (seen.has(id)) continue;
    seen.add(id);
    merged.push(id);
  }
  return Object.freeze(merged);
}

function urgencyRank(urgency: RuntimeExecutiveAdvisorUrgency): number {
  return (["none", "low", "medium", "high", "immediate"] as const).indexOf(
    urgency,
  );
}

function priorityRank(
  priority: RuntimeExecutiveAdvisorGuidancePriority,
): number {
  return RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_PRIORITIES.indexOf(priority);
}

function maxUrgency(
  values: ReadonlyArray<RuntimeExecutiveAdvisorUrgency>,
): RuntimeExecutiveAdvisorUrgency {
  if (values.length === 0) return "none";
  return values.reduce((best, current) =>
    urgencyRank(current) > urgencyRank(best) ? current : best,
  );
}

function subjectKindFromResponse(
  response: RuntimeExecutiveAdvisorResponse,
  subjectId: string,
): RuntimeExecutiveAdvisorSubjectKind | undefined {
  if (response.subject?.id === subjectId) return response.subject.kind;
  return undefined;
}

// ─── Predicates ─────────────────────────────────────────────────────────────

export function isRuntimeExecutiveAdvisorGuidanceState(
  value: unknown,
): value is RuntimeExecutiveAdvisorGuidanceState {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_STATES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorGuidanceKind(
  value: unknown,
): value is RuntimeExecutiveAdvisorGuidanceKind {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorGuidancePriority(
  value: unknown,
): value is RuntimeExecutiveAdvisorGuidancePriority {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_PRIORITIES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorExecutiveActionKind(
  value: unknown,
): value is RuntimeExecutiveAdvisorExecutiveActionKind {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_EXECUTIVE_ACTION_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorExecutiveActionState(
  value: unknown,
): value is RuntimeExecutiveAdvisorExecutiveActionState {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_EXECUTIVE_ACTION_STATES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorActionAuthority(
  value: unknown,
): value is RuntimeExecutiveAdvisorActionAuthority {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_ACTION_AUTHORITIES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorActionSafety(
  value: unknown,
): value is RuntimeExecutiveAdvisorActionSafety {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_ACTION_SAFETIES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorActionPreconditionKind(
  value: unknown,
): value is RuntimeExecutiveAdvisorActionPreconditionKind {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_ACTION_PRECONDITION_KINDS as readonly unknown[]
  ).includes(value);
}

// ─── Empty package ──────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ADVISOR_EMPTY_GUIDANCE_PACKAGE: RuntimeExecutiveAdvisorGuidancePackage =
  Object.freeze({
    state: "none",
    primaryGuidance: null,
    guidance: Object.freeze([] as RuntimeExecutiveAdvisorGuidance[]),
    actions: Object.freeze([] as RuntimeExecutiveAdvisorExecutiveAction[]),
    confidence: "unknown",
    urgency: "none",
    isActionReady: false,
    guidanceIdentity: runtimeExecutiveAdvisorGuidanceActionsIdentity,
    guidanceVersion: runtimeExecutiveAdvisorGuidanceActionsVersion,
    responseIdentity: runtimeExecutiveAdvisorResponseModelIdentity,
    responseVersion: runtimeExecutiveAdvisorResponseModelVersion,
  });

// ─── Priority / state / authority / safety ──────────────────────────────────

export function resolveRuntimeExecutiveAdvisorGuidancePriority(input: {
  readonly kind: RuntimeExecutiveAdvisorGuidanceKind;
  readonly response: RuntimeExecutiveAdvisorResponse;
  readonly targetSubjectId: string;
}): RuntimeExecutiveAdvisorGuidancePriority {
  const criticalSignal = input.response.signals.some(
    (signal) =>
      signal.subjectId === input.targetSubjectId &&
      (signal.severity === "critical" || signal.kind === "risk"),
  );
  if (criticalSignal || input.response.urgency === "immediate") {
    return "critical";
  }

  const elevatedSignal = input.response.signals.some(
    (signal) =>
      signal.subjectId === input.targetSubjectId &&
      (signal.severity === "high" || signal.kind === "blocker"),
  );
  if (
    elevatedSignal ||
    input.response.urgency === "high" ||
    input.kind === "investigate"
  ) {
    return "high";
  }

  if (
    input.kind === "compare" ||
    input.kind === "prepare-decision" ||
    input.kind === "prepare-action" ||
    input.kind === "trace"
  ) {
    return "normal";
  }

  if (input.kind === "observe" || input.kind === "monitor") {
    return "low";
  }

  return "normal";
}

export function resolveRuntimeExecutiveAdvisorGuidanceState(input: {
  readonly guidance: ReadonlyArray<RuntimeExecutiveAdvisorGuidance>;
  readonly response: RuntimeExecutiveAdvisorResponse;
}): RuntimeExecutiveAdvisorGuidanceState {
  if (input.guidance.length === 0) return "none";

  if (
    input.guidance.some((entry) => entry.priority === "critical") ||
    input.guidance.some((entry) => entry.urgency === "immediate") ||
    input.response.urgency === "immediate"
  ) {
    return "urgent";
  }

  if (
    input.guidance.some(
      (entry) => entry.priority === "high" || entry.urgency === "high",
    ) ||
    input.response.state === "actionable"
  ) {
    return "recommended";
  }

  return "available";
}

export function resolveRuntimeExecutiveAdvisorActionAuthority(
  kind: RuntimeExecutiveAdvisorExecutiveActionKind,
): RuntimeExecutiveAdvisorActionAuthority {
  switch (kind) {
    case "inspect-subject":
    case "explain-subject":
    case "show-related":
    case "dismiss-guidance":
      return "advisor-only";
    case "open-decision":
    case "open-scenario":
    case "open-execution":
    case "review-decision":
    case "review-execution":
    case "compare-subjects":
      return "manager-confirmation";
    case "focus-subject":
    case "trace-relationship":
      return "runtime-coordination";
    default:
      return "advisor-only";
  }
}

export function resolveRuntimeExecutiveAdvisorActionSafety(
  kind: RuntimeExecutiveAdvisorExecutiveActionKind,
): RuntimeExecutiveAdvisorActionSafety {
  switch (kind) {
    case "inspect-subject":
    case "explain-subject":
    case "show-related":
    case "dismiss-guidance":
      return "informational";
    case "focus-subject":
    case "trace-relationship":
      return "navigational";
    case "compare-subjects":
    case "open-scenario":
    case "open-decision":
    case "open-execution":
    case "review-decision":
    case "review-execution":
      return "workflow";
    default:
      return "controlled";
  }
}

export function evaluateRuntimeExecutiveAdvisorActionPreconditions(input: {
  readonly kind: RuntimeExecutiveAdvisorExecutiveActionKind;
  readonly response: RuntimeExecutiveAdvisorResponse;
  readonly targetSubjectIds: ReadonlyArray<string>;
}): ReadonlyArray<RuntimeExecutiveAdvisorActionPrecondition> {
  const subjectPresent = input.response.subject !== null;
  const targetPresent = input.targetSubjectIds.every((id) => {
    if (input.response.subject?.id === id) return true;
    return (
      input.response.observations.some((entry) => entry.subjectId === id) ||
      input.response.signals.some((entry) => entry.subjectId === id) ||
      input.response.relationships.some(
        (entry) =>
          entry.sourceSubjectId === id || entry.targetSubjectId === id,
      )
    );
  });

  const relationshipPresent = input.response.relationships.length > 0;
  const comparisonSubjectsPresent = (() => {
    const ids = new Set<string>();
    if (input.response.subject) ids.add(input.response.subject.id);
    for (const id of input.targetSubjectIds) ids.add(id);
    for (const relationship of input.response.relationships) {
      ids.add(relationship.sourceSubjectId);
      ids.add(relationship.targetSubjectId);
    }
    return ids.size >= 2;
  })();

  const decisionPresent =
    input.response.subject?.kind === "decision" ||
    input.response.kind === "decision-support";
  const executionPresent =
    input.response.subject?.kind === "execution" ||
    input.response.kind === "execution-support";

  const authority = resolveRuntimeExecutiveAdvisorActionAuthority(input.kind);
  const required: RuntimeExecutiveAdvisorActionPreconditionKind[] = [
    "subject-present",
  ];

  switch (input.kind) {
    case "compare-subjects":
      required.push("comparison-subjects-present", "manager-confirmation-required");
      break;
    case "trace-relationship":
      required.push("relationship-present", "runtime-coordination-required");
      break;
    case "focus-subject":
      required.push("target-present", "runtime-coordination-required");
      break;
    case "open-decision":
    case "review-decision":
      required.push("decision-present", "manager-confirmation-required");
      break;
    case "open-execution":
    case "review-execution":
      required.push("execution-present", "manager-confirmation-required");
      break;
    case "open-scenario":
      required.push("manager-confirmation-required");
      break;
    case "inspect-subject":
    case "explain-subject":
    case "show-related":
      required.push("target-present");
      break;
    default:
      break;
  }

  if (authority === "manager-confirmation") {
    if (!required.includes("manager-confirmation-required")) {
      required.push("manager-confirmation-required");
    }
  }
  if (authority === "runtime-coordination") {
    if (!required.includes("runtime-coordination-required")) {
      required.push("runtime-coordination-required");
    }
  }

  return Object.freeze(
    required.map((kind) => {
      let satisfied = true;
      switch (kind) {
        case "subject-present":
          satisfied = subjectPresent;
          break;
        case "target-present":
          satisfied = targetPresent && input.targetSubjectIds.length > 0;
          break;
        case "relationship-present":
          satisfied = relationshipPresent;
          break;
        case "comparison-subjects-present":
          satisfied = comparisonSubjectsPresent;
          break;
        case "decision-present":
          satisfied = decisionPresent;
          break;
        case "execution-present":
          satisfied = executionPresent;
          break;
        case "manager-confirmation-required":
        case "runtime-coordination-required":
          // Declarative requirement markers — satisfied as declared constraints.
          satisfied = true;
          break;
        default:
          satisfied = false;
      }
      return Object.freeze({ kind, satisfied });
    }),
  );
}

export function resolveRuntimeExecutiveAdvisorActionState(input: {
  readonly kind: RuntimeExecutiveAdvisorExecutiveActionKind;
  readonly preconditions: ReadonlyArray<RuntimeExecutiveAdvisorActionPrecondition>;
  readonly authority: RuntimeExecutiveAdvisorActionAuthority;
}): RuntimeExecutiveAdvisorExecutiveActionState {
  const blocking = input.preconditions.filter(
    (entry) =>
      !entry.satisfied &&
      entry.kind !== "manager-confirmation-required" &&
      entry.kind !== "runtime-coordination-required",
  );

  if (blocking.length > 0) {
    const hardBlocked = blocking.some(
      (entry) =>
        entry.kind === "decision-present" ||
        entry.kind === "execution-present" ||
        entry.kind === "relationship-present" ||
        entry.kind === "comparison-subjects-present",
    );
    return hardBlocked ? "blocked" : "disabled";
  }

  if (
    input.authority === "manager-confirmation" ||
    input.preconditions.some(
      (entry) => entry.kind === "manager-confirmation-required",
    )
  ) {
    return "requires-confirmation";
  }

  return "available";
}

// ─── Guidance derivation ────────────────────────────────────────────────────

function emptyRationale(): RuntimeExecutiveAdvisorGuidanceRationale {
  return Object.freeze({
    sourceObservationIds: Object.freeze([] as string[]),
    sourceSignalIds: Object.freeze([] as string[]),
    sourceRelationshipIds: Object.freeze([] as string[]),
    sourceImplicationIds: Object.freeze([] as string[]),
  });
}

function rationaleFrom(input: {
  readonly observations?: ReadonlyArray<RuntimeExecutiveAdvisorObservation>;
  readonly signals?: ReadonlyArray<RuntimeExecutiveAdvisorSignal>;
  readonly relationships?: ReadonlyArray<RuntimeExecutiveAdvisorResponseRelationship>;
  readonly implications?: ReadonlyArray<RuntimeExecutiveAdvisorImplication>;
  readonly subjectId: string;
}): RuntimeExecutiveAdvisorGuidanceRationale {
  return Object.freeze({
    sourceObservationIds: Object.freeze(
      (input.observations ?? [])
        .filter((entry) => entry.subjectId === input.subjectId)
        .map((entry) => entry.id),
    ),
    sourceSignalIds: Object.freeze(
      (input.signals ?? [])
        .filter((entry) => entry.subjectId === input.subjectId)
        .map((entry) => entry.id),
    ),
    sourceRelationshipIds: Object.freeze(
      (input.relationships ?? [])
        .filter(
          (entry) =>
            entry.sourceSubjectId === input.subjectId ||
            entry.targetSubjectId === input.subjectId,
        )
        .map(relationshipId),
    ),
    sourceImplicationIds: Object.freeze(
      (input.implications ?? [])
        .filter((entry) => entry.subjectId === input.subjectId)
        .map((entry) => entry.id),
    ),
  });
}

function nextStepToGuidanceKind(
  step: RuntimeExecutiveAdvisorNextStepKind,
): RuntimeExecutiveAdvisorGuidanceKind | null {
  switch (step) {
    case "inspect":
      return "inspect";
    case "explain":
      return "explain";
    case "compare":
      return "compare";
    case "trace":
      return "trace";
    case "open-scenario":
      return "prepare-scenario";
    case "review-decision":
      return "prepare-decision";
    case "review-execution":
      return "prepare-action";
    case "none":
    default:
      return null;
  }
}

function implicationToGuidanceKind(
  kind: RuntimeExecutiveAdvisorImplication["kind"],
): RuntimeExecutiveAdvisorGuidanceKind {
  switch (kind) {
    case "investigate":
      return "investigate";
    case "compare":
      return "compare";
    case "monitor":
      return "monitor";
    case "review-decision":
      return "prepare-decision";
    case "prepare-scenario":
      return "prepare-scenario";
    case "consider-action":
      return "prepare-action";
    default:
      return "review";
  }
}

export function deriveRuntimeExecutiveAdvisorGuidance(
  response: RuntimeExecutiveAdvisorResponse,
): ReadonlyArray<RuntimeExecutiveAdvisorGuidance> {
  if (response.state === "empty" || response.subject === null) {
    return Object.freeze([]);
  }

  const byKey = new Map<string, RuntimeExecutiveAdvisorGuidance>();

  const upsert = (candidate: RuntimeExecutiveAdvisorGuidance) => {
    const existing = byKey.get(candidate.id);
    if (!existing) {
      byKey.set(candidate.id, candidate);
      return;
    }
    byKey.set(
      candidate.id,
      Object.freeze({
        ...existing,
        priority:
          priorityRank(candidate.priority) > priorityRank(existing.priority)
            ? candidate.priority
            : existing.priority,
        urgency:
          urgencyRank(candidate.urgency) > urgencyRank(existing.urgency)
            ? candidate.urgency
            : existing.urgency,
        rationale: Object.freeze({
          sourceObservationIds: mergeIds(
            existing.rationale.sourceObservationIds,
            candidate.rationale.sourceObservationIds,
          ),
          sourceSignalIds: mergeIds(
            existing.rationale.sourceSignalIds,
            candidate.rationale.sourceSignalIds,
          ),
          sourceRelationshipIds: mergeIds(
            existing.rationale.sourceRelationshipIds,
            candidate.rationale.sourceRelationshipIds,
          ),
          sourceImplicationIds: mergeIds(
            existing.rationale.sourceImplicationIds,
            candidate.rationale.sourceImplicationIds,
          ),
        }),
        provenance: Object.freeze([
          ...existing.provenance,
          ...candidate.provenance.filter(
            (entry) =>
              !existing.provenance.some(
                (prior) =>
                  prior.kind === entry.kind &&
                  prior.sourceId === entry.sourceId &&
                  prior.reason === entry.reason,
              ),
          ),
        ]),
      }),
    );
  };

  const activeId = response.subject.id;

  // Implications → guidance (stronger evidence)
  for (const implication of response.implications) {
    const kind = implicationToGuidanceKind(implication.kind);
    const priority = resolveRuntimeExecutiveAdvisorGuidancePriority({
      kind,
      response,
      targetSubjectId: implication.subjectId,
    });
    upsert(
      Object.freeze({
        id: `guide.${kind}.${implication.subjectId}`,
        kind,
        priority,
        target: Object.freeze({
          subjectId: implication.subjectId,
          ...(subjectKindFromResponse(response, implication.subjectId)
            ? {
                subjectKind: subjectKindFromResponse(
                  response,
                  implication.subjectId,
                ),
              }
            : {}),
        }),
        confidence: implication.confidence,
        urgency:
          priority === "critical"
            ? response.urgency === "none"
              ? "high"
              : response.urgency
            : response.urgency,
        rationale: rationaleFrom({
          observations: response.observations,
          signals: response.signals,
          relationships: response.relationships,
          implications: [implication],
          subjectId: implication.subjectId,
        }),
        provenance: Object.freeze([...response.provenance]),
        dismissible: true,
      }),
    );
  }

  // Next steps → guidance
  for (const step of response.nextSteps) {
    const kind = nextStepToGuidanceKind(step);
    if (kind === null) continue;
    const priority = resolveRuntimeExecutiveAdvisorGuidancePriority({
      kind,
      response,
      targetSubjectId: activeId,
    });
    upsert(
      Object.freeze({
        id: `guide.${kind}.${activeId}`,
        kind,
        priority,
        target: Object.freeze({
          subjectId: activeId,
          subjectKind: response.subject.kind,
        }),
        confidence: response.confidence,
        urgency: response.urgency,
        rationale: rationaleFrom({
          observations: response.observations,
          signals: response.signals,
          relationships: response.relationships,
          implications: response.implications,
          subjectId: activeId,
        }),
        provenance: Object.freeze([...response.provenance]),
        dismissible: true,
      }),
    );
  }

  // Trace guidance from relationships when investigate/trace is justified
  if (
    response.relationships.length > 0 &&
    (response.implications.some((entry) => entry.kind === "investigate") ||
      response.nextSteps.includes("trace"))
  ) {
    for (const relationship of response.relationships) {
      const targetId =
        relationship.sourceSubjectId === activeId
          ? relationship.targetSubjectId
          : relationship.sourceSubjectId;
      upsert(
        Object.freeze({
          id: `guide.trace.${activeId}.${targetId}`,
          kind: "trace",
          priority: resolveRuntimeExecutiveAdvisorGuidancePriority({
            kind: "trace",
            response,
            targetSubjectId: targetId,
          }),
          target: Object.freeze({
            subjectId: targetId,
            relationship: relationship.kind,
          }),
          confidence: response.confidence,
          urgency: response.urgency,
          rationale: Object.freeze({
            ...emptyRationale(),
            sourceRelationshipIds: Object.freeze([relationshipId(relationship)]),
            sourceImplicationIds: Object.freeze(
              response.implications
                .filter((entry) => entry.kind === "investigate")
                .map((entry) => entry.id),
            ),
          }),
          provenance: Object.freeze([...response.provenance]),
          dismissible: true,
        }),
      );
    }
  }

  // Weak contextual response: at most low-impact inspect
  if (
    byKey.size === 0 &&
    (response.state === "contextual" || response.state === "interpreted")
  ) {
    upsert(
      Object.freeze({
        id: `guide.inspect.${activeId}`,
        kind: "inspect",
        priority: "low",
        target: Object.freeze({
          subjectId: activeId,
          subjectKind: response.subject.kind,
        }),
        confidence:
          response.confidence === "unknown" ? "low" : response.confidence,
        urgency: "none",
        rationale: rationaleFrom({
          observations: response.observations,
          subjectId: activeId,
        }),
        provenance: Object.freeze([...response.provenance]),
        dismissible: true,
      }),
    );
  }

  // Response-kind based prepare guidance when no stronger item exists
  if (
    response.kind === "decision-support" &&
    !byKey.has(`guide.prepare-decision.${activeId}`)
  ) {
    upsert(
      Object.freeze({
        id: `guide.prepare-decision.${activeId}`,
        kind: "prepare-decision",
        priority: "normal",
        target: Object.freeze({
          subjectId: activeId,
          subjectKind: response.subject.kind,
        }),
        confidence: response.confidence,
        urgency: response.urgency,
        rationale: rationaleFrom({
          observations: response.observations,
          subjectId: activeId,
        }),
        provenance: Object.freeze([...response.provenance]),
        dismissible: true,
      }),
    );
  }

  if (
    response.kind === "execution-support" &&
    !byKey.has(`guide.prepare-action.${activeId}`)
  ) {
    upsert(
      Object.freeze({
        id: `guide.prepare-action.${activeId}`,
        kind: "prepare-action",
        priority: "normal",
        target: Object.freeze({
          subjectId: activeId,
          subjectKind: response.subject.kind,
        }),
        confidence: response.confidence,
        urgency: response.urgency,
        rationale: rationaleFrom({
          observations: response.observations,
          signals: response.signals,
          subjectId: activeId,
        }),
        provenance: Object.freeze([...response.provenance]),
        dismissible: true,
      }),
    );
  }

  const guidance = [...byKey.values()];
  guidance.sort((left, right) => {
    const urgencyDelta =
      urgencyRank(right.urgency) - urgencyRank(left.urgency);
    if (urgencyDelta !== 0) return urgencyDelta;
    const priorityDelta =
      priorityRank(right.priority) - priorityRank(left.priority);
    if (priorityDelta !== 0) return priorityDelta;
    const activeDelta =
      (right.target.subjectId === activeId ? 1 : 0) -
      (left.target.subjectId === activeId ? 1 : 0);
    if (activeDelta !== 0) return activeDelta;
    const kindDelta =
      RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_KINDS.indexOf(left.kind) -
      RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_KINDS.indexOf(right.kind);
    if (kindDelta !== 0) return kindDelta;
    return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
  });

  return Object.freeze(guidance);
}

export function resolveRuntimeExecutiveAdvisorPrimaryGuidance(
  guidance: ReadonlyArray<RuntimeExecutiveAdvisorGuidance>,
): RuntimeExecutiveAdvisorGuidance | null {
  return guidance[0] ?? null;
}

// ─── Action derivation ──────────────────────────────────────────────────────

function actionTargetsFor(
  guidance: RuntimeExecutiveAdvisorGuidance,
  response: RuntimeExecutiveAdvisorResponse,
  actionKind: RuntimeExecutiveAdvisorExecutiveActionKind,
): ReadonlyArray<string> {
  if (actionKind === "compare-subjects") {
    const ids = new Set<string>([guidance.target.subjectId]);
    if (response.subject) ids.add(response.subject.id);
    for (const relationship of response.relationships) {
      ids.add(relationship.sourceSubjectId);
      ids.add(relationship.targetSubjectId);
    }
    return Object.freeze([...ids]);
  }

  if (actionKind === "trace-relationship") {
    const ids = new Set<string>([guidance.target.subjectId]);
    if (response.subject) ids.add(response.subject.id);
    return Object.freeze([...ids]);
  }

  if (actionKind === "show-related") {
    const ids = response.relationships.flatMap((entry) => [
      entry.sourceSubjectId,
      entry.targetSubjectId,
    ]);
    return Object.freeze(
      [...new Set([guidance.target.subjectId, ...ids])],
    );
  }

  if (actionKind === "dismiss-guidance") {
    return Object.freeze([guidance.target.subjectId]);
  }

  return Object.freeze([guidance.target.subjectId]);
}

function mappingActionKinds(
  guidanceKind: RuntimeExecutiveAdvisorGuidanceKind,
): ReadonlyArray<RuntimeExecutiveAdvisorExecutiveActionKind> {
  const mapping = RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_TO_ACTION_MAPPINGS.find(
    (entry) => entry.guidanceKind === guidanceKind,
  );
  return mapping?.actionKinds ?? Object.freeze([]);
}

export function deriveRuntimeExecutiveAdvisorExecutiveActions(input: {
  readonly response: RuntimeExecutiveAdvisorResponse;
  readonly guidance: ReadonlyArray<RuntimeExecutiveAdvisorGuidance>;
}): ReadonlyArray<RuntimeExecutiveAdvisorExecutiveAction> {
  const byKey = new Map<string, RuntimeExecutiveAdvisorExecutiveAction>();

  for (const guidance of input.guidance) {
    for (const actionKind of mappingActionKinds(guidance.kind)) {
      // Filter review/open actions by subject kind where applicable.
      if (
        (actionKind === "review-decision" || actionKind === "open-decision") &&
        guidance.target.subjectKind !== undefined &&
        guidance.target.subjectKind !== "decision" &&
        input.response.kind !== "decision-support"
      ) {
        continue;
      }
      if (
        (actionKind === "review-execution" ||
          actionKind === "open-execution") &&
        guidance.target.subjectKind !== undefined &&
        guidance.target.subjectKind !== "execution" &&
        input.response.kind !== "execution-support"
      ) {
        continue;
      }
      if (
        actionKind === "open-scenario" &&
        guidance.target.subjectKind !== undefined &&
        guidance.target.subjectKind !== "scenario" &&
        guidance.kind !== "prepare-scenario"
      ) {
        continue;
      }

      const targetSubjectIds = actionTargetsFor(
        guidance,
        input.response,
        actionKind,
      );
      const authority = resolveRuntimeExecutiveAdvisorActionAuthority(actionKind);
      const safety = resolveRuntimeExecutiveAdvisorActionSafety(actionKind);
      const preconditions = evaluateRuntimeExecutiveAdvisorActionPreconditions({
        kind: actionKind,
        response: input.response,
        targetSubjectIds,
      });
      const state = resolveRuntimeExecutiveAdvisorActionState({
        kind: actionKind,
        preconditions,
        authority,
      });

      const id = `action.${actionKind}.${targetSubjectIds.join("+") || "none"}`;
      const existing = byKey.get(id);
      if (existing) {
        byKey.set(
          id,
          Object.freeze({
            ...existing,
            sourceGuidanceIds: mergeIds(existing.sourceGuidanceIds, [
              guidance.id,
            ]),
            provenance: Object.freeze([
              ...existing.provenance,
              ...guidance.provenance.filter(
                (entry) =>
                  !existing.provenance.some(
                    (prior) =>
                      prior.kind === entry.kind &&
                      prior.sourceId === entry.sourceId,
                  ),
              ),
            ]),
          }),
        );
        continue;
      }

      byKey.set(
        id,
        Object.freeze({
          id,
          kind: actionKind,
          state,
          authority,
          safety,
          targetSubjectIds,
          preconditions,
          sourceGuidanceIds: Object.freeze([guidance.id]),
          provenance: Object.freeze([...guidance.provenance]),
        }),
      );
    }
  }

  // Always offer dismiss when guidance exists.
  if (input.guidance.length > 0) {
    const primary = input.guidance[0]!;
    const dismissId = `action.dismiss-guidance.${primary.target.subjectId}`;
    if (!byKey.has(dismissId)) {
      const authority =
        resolveRuntimeExecutiveAdvisorActionAuthority("dismiss-guidance");
      const safety =
        resolveRuntimeExecutiveAdvisorActionSafety("dismiss-guidance");
      const preconditions = evaluateRuntimeExecutiveAdvisorActionPreconditions({
        kind: "dismiss-guidance",
        response: input.response,
        targetSubjectIds: [primary.target.subjectId],
      });
      byKey.set(
        dismissId,
        Object.freeze({
          id: dismissId,
          kind: "dismiss-guidance",
          state: resolveRuntimeExecutiveAdvisorActionState({
            kind: "dismiss-guidance",
            preconditions,
            authority,
          }),
          authority,
          safety,
          targetSubjectIds: Object.freeze([primary.target.subjectId]),
          preconditions,
          sourceGuidanceIds: Object.freeze(input.guidance.map((entry) => entry.id)),
          provenance: Object.freeze([...primary.provenance]),
        }),
      );
    }
  }

  const primaryId = input.guidance[0]?.id;
  const actions = [...byKey.values()];
  actions.sort((left, right) => {
    const leftPrimary = primaryId
      ? left.sourceGuidanceIds.includes(primaryId)
        ? 1
        : 0
      : 0;
    const rightPrimary = primaryId
      ? right.sourceGuidanceIds.includes(primaryId)
        ? 1
        : 0
      : 0;
    if (rightPrimary !== leftPrimary) return rightPrimary - leftPrimary;

    const authorityDelta =
      RUNTIME_EXECUTIVE_ADVISOR_ACTION_AUTHORITIES.indexOf(left.authority) -
      RUNTIME_EXECUTIVE_ADVISOR_ACTION_AUTHORITIES.indexOf(right.authority);
    if (authorityDelta !== 0) return authorityDelta;

    const safetyDelta =
      RUNTIME_EXECUTIVE_ADVISOR_ACTION_SAFETIES.indexOf(left.safety) -
      RUNTIME_EXECUTIVE_ADVISOR_ACTION_SAFETIES.indexOf(right.safety);
    if (safetyDelta !== 0) return safetyDelta;

    const kindDelta =
      RUNTIME_EXECUTIVE_ADVISOR_EXECUTIVE_ACTION_KINDS.indexOf(left.kind) -
      RUNTIME_EXECUTIVE_ADVISOR_EXECUTIVE_ACTION_KINDS.indexOf(right.kind);
    if (kindDelta !== 0) return kindDelta;
    return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
  });

  return Object.freeze(actions);
}

export function isRuntimeExecutiveAdvisorActionReady(
  packageOrActions:
    | RuntimeExecutiveAdvisorGuidancePackage
    | ReadonlyArray<RuntimeExecutiveAdvisorExecutiveAction>,
): boolean {
  const actions: ReadonlyArray<RuntimeExecutiveAdvisorExecutiveAction> =
    "isActionReady" in packageOrActions
      ? packageOrActions.actions
      : packageOrActions;
  return actions.some(
    (action) =>
      action.state === "available" ||
      action.state === "requires-confirmation",
  );
}

/**
 * Primary REX-3:4 operation: create a guidance + action package from a response.
 */
export function createRuntimeExecutiveAdvisorGuidancePackage(
  response: RuntimeExecutiveAdvisorResponse,
): RuntimeExecutiveAdvisorGuidancePackage {
  const validation = validateRuntimeExecutiveAdvisorResponse(response);
  if (!validation.ok && response.state === "empty") {
    return RUNTIME_EXECUTIVE_ADVISOR_EMPTY_GUIDANCE_PACKAGE;
  }

  if (response.state === "empty" || response.subject === null) {
    return RUNTIME_EXECUTIVE_ADVISOR_EMPTY_GUIDANCE_PACKAGE;
  }

  const guidance = deriveRuntimeExecutiveAdvisorGuidance(response);
  if (guidance.length === 0) {
    return RUNTIME_EXECUTIVE_ADVISOR_EMPTY_GUIDANCE_PACKAGE;
  }

  const primaryGuidance = resolveRuntimeExecutiveAdvisorPrimaryGuidance(guidance);
  const actions = deriveRuntimeExecutiveAdvisorExecutiveActions({
    response,
    guidance,
  });
  const state = resolveRuntimeExecutiveAdvisorGuidanceState({
    guidance,
    response,
  });
  const isActionReady = isRuntimeExecutiveAdvisorActionReady(actions);

  return Object.freeze({
    state,
    primaryGuidance,
    guidance,
    actions,
    confidence: response.confidence,
    urgency: maxUrgency([
      response.urgency,
      ...guidance.map((entry) => entry.urgency),
    ]),
    isActionReady,
    guidanceIdentity: runtimeExecutiveAdvisorGuidanceActionsIdentity,
    guidanceVersion: runtimeExecutiveAdvisorGuidanceActionsVersion,
    responseIdentity: runtimeExecutiveAdvisorResponseModelIdentity,
    responseVersion: runtimeExecutiveAdvisorResponseModelVersion,
  });
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateRuntimeExecutiveAdvisorGuidance(
  value: unknown,
): RuntimeExecutiveAdvisorGuidanceValidationResult {
  const issues: RuntimeExecutiveAdvisorGuidanceIssue[] = [];
  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        issue("invalid-guidance", "guidance must be a plain object"),
      ]),
    });
  }
  if (!isNonEmptyString(value.id)) {
    issues.push(issue("invalid-guidance-id", "id must be non-empty", "id"));
  }
  if (!isRuntimeExecutiveAdvisorGuidanceKind(value.kind)) {
    issues.push(issue("invalid-guidance-kind", "kind invalid", "kind"));
  }
  if (!isRuntimeExecutiveAdvisorGuidancePriority(value.priority)) {
    issues.push(
      issue("invalid-guidance-priority", "priority invalid", "priority"),
    );
  }
  if (!isRuntimeExecutiveAdvisorConfidence(value.confidence)) {
    issues.push(
      issue("invalid-guidance-confidence", "confidence invalid", "confidence"),
    );
  }
  if (!isRuntimeExecutiveAdvisorUrgency(value.urgency)) {
    issues.push(
      issue("invalid-guidance-urgency", "urgency invalid", "urgency"),
    );
  }
  if (!isPlainObject(value.target) || !isNonEmptyString(value.target.subjectId)) {
    issues.push(
      issue("invalid-guidance-target", "target.subjectId required", "target"),
    );
  } else if (
    value.target.subjectKind !== undefined &&
    !isRuntimeExecutiveAdvisorSubjectKind(value.target.subjectKind)
  ) {
    issues.push(
      issue(
        "invalid-guidance-target-kind",
        "target.subjectKind invalid",
        "target.subjectKind",
      ),
    );
  }
  if (!isPlainObject(value.rationale)) {
    issues.push(
      issue("invalid-rationale", "rationale must be an object", "rationale"),
    );
  } else {
    for (const key of [
      "sourceObservationIds",
      "sourceSignalIds",
      "sourceRelationshipIds",
      "sourceImplicationIds",
    ] as const) {
      if (!Array.isArray(value.rationale[key])) {
        issues.push(
          issue(
            "invalid-rationale-refs",
            `${key} must be an array`,
            `rationale.${key}`,
          ),
        );
      }
    }
  }
  if (typeof value.dismissible !== "boolean") {
    issues.push(
      issue(
        "invalid-dismissible",
        "dismissible must be a boolean",
        "dismissible",
      ),
    );
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function validateRuntimeExecutiveAdvisorExecutiveAction(
  value: unknown,
): RuntimeExecutiveAdvisorGuidanceValidationResult {
  const issues: RuntimeExecutiveAdvisorGuidanceIssue[] = [];
  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        issue("invalid-action", "action must be a plain object"),
      ]),
    });
  }
  if (!isNonEmptyString(value.id)) {
    issues.push(issue("invalid-action-id", "id must be non-empty", "id"));
  }
  if (!isRuntimeExecutiveAdvisorExecutiveActionKind(value.kind)) {
    issues.push(issue("invalid-action-kind", "kind invalid", "kind"));
  }
  if (!isRuntimeExecutiveAdvisorExecutiveActionState(value.state)) {
    issues.push(issue("invalid-action-state", "state invalid", "state"));
  }
  if (!isRuntimeExecutiveAdvisorActionAuthority(value.authority)) {
    issues.push(
      issue("invalid-action-authority", "authority invalid", "authority"),
    );
  }
  if (!isRuntimeExecutiveAdvisorActionSafety(value.safety)) {
    issues.push(issue("invalid-action-safety", "safety invalid", "safety"));
  }
  if (!Array.isArray(value.targetSubjectIds)) {
    issues.push(
      issue(
        "invalid-action-targets",
        "targetSubjectIds must be an array",
        "targetSubjectIds",
      ),
    );
  }
  if (!Array.isArray(value.preconditions)) {
    issues.push(
      issue(
        "invalid-preconditions",
        "preconditions must be an array",
        "preconditions",
      ),
    );
  } else {
    value.preconditions.forEach((precondition, index) => {
      if (
        !isPlainObject(precondition) ||
        !isRuntimeExecutiveAdvisorActionPreconditionKind(precondition.kind) ||
        typeof precondition.satisfied !== "boolean"
      ) {
        issues.push(
          issue(
            "invalid-precondition",
            "precondition invalid",
            `preconditions[${index}]`,
          ),
        );
      }
    });
  }
  if (!Array.isArray(value.sourceGuidanceIds)) {
    issues.push(
      issue(
        "invalid-source-guidance",
        "sourceGuidanceIds must be an array",
        "sourceGuidanceIds",
      ),
    );
  } else if (
    value.sourceGuidanceIds.length === 0 &&
    value.kind !== "dismiss-guidance"
  ) {
    issues.push(
      issue(
        "action-without-guidance",
        "action must reference source guidance",
        "sourceGuidanceIds",
      ),
    );
  }

  if (
    value.state === "available" &&
    Array.isArray(value.preconditions) &&
    value.preconditions.some(
      (entry) =>
        isPlainObject(entry) &&
        entry.satisfied === false &&
        entry.kind !== "manager-confirmation-required" &&
        entry.kind !== "runtime-coordination-required",
    )
  ) {
    issues.push(
      issue(
        "invalid-action-availability",
        "available action has unsatisfied preconditions",
        "state",
      ),
    );
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function validateRuntimeExecutiveAdvisorGuidancePackage(
  value: unknown,
): RuntimeExecutiveAdvisorGuidanceValidationResult {
  const issues: RuntimeExecutiveAdvisorGuidanceIssue[] = [];
  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        issue("invalid-package", "package must be a plain object"),
      ]),
    });
  }

  if (!isRuntimeExecutiveAdvisorGuidanceState(value.state)) {
    issues.push(
      issue("invalid-package-state", "state invalid", "state"),
    );
  }
  if (!isRuntimeExecutiveAdvisorConfidence(value.confidence)) {
    issues.push(
      issue("invalid-package-confidence", "confidence invalid", "confidence"),
    );
  }
  if (!isRuntimeExecutiveAdvisorUrgency(value.urgency)) {
    issues.push(
      issue("invalid-package-urgency", "urgency invalid", "urgency"),
    );
  }
  if (typeof value.isActionReady !== "boolean") {
    issues.push(
      issue(
        "invalid-action-ready",
        "isActionReady must be a boolean",
        "isActionReady",
      ),
    );
  }

  if (!Array.isArray(value.guidance)) {
    issues.push(
      issue("invalid-guidance-collection", "guidance must be an array", "guidance"),
    );
  } else {
    const ids: string[] = [];
    value.guidance.forEach((entry, index) => {
      const result = validateRuntimeExecutiveAdvisorGuidance(entry);
      for (const item of result.issues) {
        issues.push(
          issue(
            item.code,
            item.message,
            item.path ? `guidance[${index}].${item.path}` : `guidance[${index}]`,
          ),
        );
      }
      if (isPlainObject(entry) && isNonEmptyString(entry.id)) {
        ids.push(entry.id);
      }
    });
    if (!unique(ids)) {
      issues.push(
        issue("duplicate-guidance", "guidance ids must be unique", "guidance"),
      );
    }

    if (
      value.primaryGuidance !== null &&
      isPlainObject(value.primaryGuidance) &&
      isNonEmptyString(value.primaryGuidance.id) &&
      !ids.includes(value.primaryGuidance.id)
    ) {
      issues.push(
        issue(
          "invalid-primary-guidance",
          "primaryGuidance must exist in guidance collection",
          "primaryGuidance",
        ),
      );
    }
  }

  if (!Array.isArray(value.actions)) {
    issues.push(
      issue("invalid-actions", "actions must be an array", "actions"),
    );
  } else {
    const ids: string[] = [];
    value.actions.forEach((entry, index) => {
      const result = validateRuntimeExecutiveAdvisorExecutiveAction(entry);
      for (const item of result.issues) {
        issues.push(
          issue(
            item.code,
            item.message,
            item.path ? `actions[${index}].${item.path}` : `actions[${index}]`,
          ),
        );
      }
      if (isPlainObject(entry) && isNonEmptyString(entry.id)) {
        ids.push(entry.id);
      }
    });
    if (!unique(ids)) {
      issues.push(
        issue("duplicate-actions", "action ids must be unique", "actions"),
      );
    }

    const expectedReady = value.actions.some(
      (entry) =>
        isPlainObject(entry) &&
        (entry.state === "available" ||
          entry.state === "requires-confirmation"),
    );
    if (
      typeof value.isActionReady === "boolean" &&
      value.isActionReady !== expectedReady
    ) {
      issues.push(
        issue(
          "action-readiness-inconsistency",
          "isActionReady inconsistent with actions",
          "isActionReady",
        ),
      );
    }
  }

  if (value.state === "none") {
    if (
      (Array.isArray(value.guidance) && value.guidance.length > 0) ||
      value.primaryGuidance !== null
    ) {
      issues.push(
        issue(
          "empty-package-inconsistency",
          "none state must not contain guidance",
          "state",
        ),
      );
    }
  }

  if (
    value.guidanceIdentity !==
      runtimeExecutiveAdvisorGuidanceActionsIdentity ||
    value.guidanceVersion !== runtimeExecutiveAdvisorGuidanceActionsVersion
  ) {
    issues.push(
      issue(
        "invalid-package-metadata",
        "guidance identity/version metadata is invalid",
      ),
    );
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function getRuntimeExecutiveAdvisorGuidanceActionsIdentity():
  typeof runtimeExecutiveAdvisorGuidanceActionsCanonicalIdentity {
  return runtimeExecutiveAdvisorGuidanceActionsCanonicalIdentity;
}

/**
 * Additive assembly for downstream consumers (REX-3:5+) that already hold
 * guidance/actions without a REX-3:3 response handle. Does not alter derivation.
 */
export function assembleRuntimeExecutiveAdvisorGuidancePackage(input: {
  readonly state: RuntimeExecutiveAdvisorGuidanceState;
  readonly primaryGuidance: RuntimeExecutiveAdvisorGuidance | null;
  readonly guidance: ReadonlyArray<RuntimeExecutiveAdvisorGuidance>;
  readonly actions: ReadonlyArray<RuntimeExecutiveAdvisorExecutiveAction>;
  readonly confidence: RuntimeExecutiveAdvisorConfidence;
  readonly urgency: RuntimeExecutiveAdvisorUrgency;
}): RuntimeExecutiveAdvisorGuidancePackage {
  const isActionReady = isRuntimeExecutiveAdvisorActionReady(input.actions);
  return Object.freeze({
    state: input.state,
    primaryGuidance: input.primaryGuidance,
    guidance: Object.freeze([...input.guidance]),
    actions: Object.freeze([...input.actions]),
    confidence: input.confidence,
    urgency: input.urgency,
    isActionReady,
    guidanceIdentity: runtimeExecutiveAdvisorGuidanceActionsIdentity,
    guidanceVersion: runtimeExecutiveAdvisorGuidanceActionsVersion,
    responseIdentity: runtimeExecutiveAdvisorResponseModelIdentity,
    responseVersion: runtimeExecutiveAdvisorResponseModelVersion,
  });
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveAdvisorGuidanceActionsApiNames = Object.freeze([
  "deriveRuntimeExecutiveAdvisorGuidance",
  "resolveRuntimeExecutiveAdvisorGuidanceState",
  "resolveRuntimeExecutiveAdvisorGuidancePriority",
  "resolveRuntimeExecutiveAdvisorPrimaryGuidance",
  "deriveRuntimeExecutiveAdvisorExecutiveActions",
  "resolveRuntimeExecutiveAdvisorActionState",
  "resolveRuntimeExecutiveAdvisorActionAuthority",
  "resolveRuntimeExecutiveAdvisorActionSafety",
  "evaluateRuntimeExecutiveAdvisorActionPreconditions",
  "createRuntimeExecutiveAdvisorGuidancePackage",
  "assembleRuntimeExecutiveAdvisorGuidancePackage",
  "isRuntimeExecutiveAdvisorActionReady",
  "validateRuntimeExecutiveAdvisorGuidance",
  "validateRuntimeExecutiveAdvisorExecutiveAction",
  "validateRuntimeExecutiveAdvisorGuidancePackage",
  "verifyRuntimeExecutiveAdvisorGuidanceActions",
  "getRuntimeExecutiveAdvisorGuidanceActionsIdentity",
  "isRuntimeExecutiveAdvisorGuidanceState",
  "isRuntimeExecutiveAdvisorGuidanceKind",
  "isRuntimeExecutiveAdvisorGuidancePriority",
  "isRuntimeExecutiveAdvisorExecutiveActionKind",
  "isRuntimeExecutiveAdvisorExecutiveActionState",
  "isRuntimeExecutiveAdvisorActionAuthority",
  "isRuntimeExecutiveAdvisorActionSafety",
  "isRuntimeExecutiveAdvisorActionPreconditionKind",
] as const);

export const RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveAdvisorGuidanceState",
    "RuntimeExecutiveAdvisorGuidanceKind",
    "RuntimeExecutiveAdvisorGuidancePriority",
    "RuntimeExecutiveAdvisorExecutiveActionKind",
    "RuntimeExecutiveAdvisorExecutiveActionState",
    "RuntimeExecutiveAdvisorActionAuthority",
    "RuntimeExecutiveAdvisorActionSafety",
    "RuntimeExecutiveAdvisorActionPreconditionKind",
    "RuntimeExecutiveAdvisorGuidanceCapability",
    "RuntimeExecutiveAdvisorGuidanceRegistrySection",
    "RuntimeExecutiveAdvisorGuidanceTarget",
    "RuntimeExecutiveAdvisorGuidanceRationale",
    "RuntimeExecutiveAdvisorGuidance",
    "RuntimeExecutiveAdvisorActionPrecondition",
    "RuntimeExecutiveAdvisorExecutiveAction",
    "RuntimeExecutiveAdvisorGuidancePackage",
    "RuntimeExecutiveAdvisorGuidanceIssue",
    "RuntimeExecutiveAdvisorGuidanceValidationResult",
    "RuntimeExecutiveAdvisorGuidanceActionsVerification",
  ] as const);

export const runtimeExecutiveAdvisorGuidanceActionsRegistry = Object.freeze({
  identity: runtimeExecutiveAdvisorGuidanceActionsIdentity,
  version: runtimeExecutiveAdvisorGuidanceActionsVersion,
  namespace: runtimeExecutiveAdvisorGuidanceActionsNamespace,
  layer: runtimeExecutiveAdvisorGuidanceActionsLayer,
  domain: runtimeExecutiveAdvisorGuidanceActionsDomain,
  phase: runtimeExecutiveAdvisorGuidanceActionsPhase,
  dependencyIdentity: runtimeExecutiveAdvisorGuidanceActionsDependencyIdentity,
  dependencyPath: runtimeExecutiveAdvisorGuidanceActionsDependencyPath,
  supportedImportPath:
    runtimeExecutiveAdvisorGuidanceActionsSupportedImportPath,
  sections: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_REGISTRY_SECTIONS,
  sectionCount: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_REGISTRY_SECTIONS.length,
  guidanceStates: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_STATES,
  guidanceStateCount: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_STATES.length,
  guidanceKinds: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_KINDS,
  guidanceKindCount: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_KINDS.length,
  guidancePriorities: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_PRIORITIES,
  guidancePriorityCount: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_PRIORITIES.length,
  actionKinds: RUNTIME_EXECUTIVE_ADVISOR_EXECUTIVE_ACTION_KINDS,
  actionKindCount: RUNTIME_EXECUTIVE_ADVISOR_EXECUTIVE_ACTION_KINDS.length,
  actionStates: RUNTIME_EXECUTIVE_ADVISOR_EXECUTIVE_ACTION_STATES,
  actionStateCount: RUNTIME_EXECUTIVE_ADVISOR_EXECUTIVE_ACTION_STATES.length,
  actionAuthorities: RUNTIME_EXECUTIVE_ADVISOR_ACTION_AUTHORITIES,
  actionAuthorityCount: RUNTIME_EXECUTIVE_ADVISOR_ACTION_AUTHORITIES.length,
  actionSafeties: RUNTIME_EXECUTIVE_ADVISOR_ACTION_SAFETIES,
  actionSafetyCount: RUNTIME_EXECUTIVE_ADVISOR_ACTION_SAFETIES.length,
  actionPreconditions: RUNTIME_EXECUTIVE_ADVISOR_ACTION_PRECONDITION_KINDS,
  actionPreconditionCount:
    RUNTIME_EXECUTIVE_ADVISOR_ACTION_PRECONDITION_KINDS.length,
  mappings: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_TO_ACTION_MAPPINGS,
  mappingCount: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_TO_ACTION_MAPPINGS.length,
  capabilities: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_CAPABILITIES,
  capabilityCount: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_CAPABILITIES.length,
  publicTypes: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_PUBLIC_TYPE_NAMES,
  publicTypeCount: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_PUBLIC_TYPE_NAMES.length,
  publicApis: runtimeExecutiveAdvisorGuidanceActionsApiNames,
  publicApiCount: runtimeExecutiveAdvisorGuidanceActionsApiNames.length,
});

export const runtimeExecutiveAdvisorGuidanceActions = Object.freeze({
  phase: "GuidanceActions" as const,
  name: "RuntimeExecutiveAdvisorGuidanceActions" as const,
  identity: runtimeExecutiveAdvisorGuidanceActionsIdentity,
  version: runtimeExecutiveAdvisorGuidanceActionsVersion,
  namespace: runtimeExecutiveAdvisorGuidanceActionsNamespace,
  layer: runtimeExecutiveAdvisorGuidanceActionsLayer,
  domain: runtimeExecutiveAdvisorGuidanceActionsDomain,
  architecturalRole:
    runtimeExecutiveAdvisorGuidanceActionsArchitecturalRole,
  role: "GuidanceActions" as const,
  status: runtimeExecutiveAdvisorGuidanceActionsStability,
  upstreamDependency:
    runtimeExecutiveAdvisorGuidanceActionsDependencyIdentity,
  dependencyPath: runtimeExecutiveAdvisorGuidanceActionsDependencyPath,
  supportedImportPath:
    runtimeExecutiveAdvisorGuidanceActionsSupportedImportPath,
  deterministic: runtimeExecutiveAdvisorGuidanceActionsDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  aiProviderIndependent: true as const,
  browserIndependent: true as const,
  principle: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_BOUNDARY,
  guidanceStates: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_STATES,
  guidanceKinds: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_KINDS,
  guidancePriorities: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_PRIORITIES,
  actionKinds: RUNTIME_EXECUTIVE_ADVISOR_EXECUTIVE_ACTION_KINDS,
  actionStates: RUNTIME_EXECUTIVE_ADVISOR_EXECUTIVE_ACTION_STATES,
  actionAuthorities: RUNTIME_EXECUTIVE_ADVISOR_ACTION_AUTHORITIES,
  actionSafeties: RUNTIME_EXECUTIVE_ADVISOR_ACTION_SAFETIES,
  actionPreconditions: RUNTIME_EXECUTIVE_ADVISOR_ACTION_PRECONDITION_KINDS,
  mappings: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_TO_ACTION_MAPPINGS,
  capabilities: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_CAPABILITIES,
  emptyPackage: RUNTIME_EXECUTIVE_ADVISOR_EMPTY_GUIDANCE_PACKAGE,
  guidanceInvariants: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_INVARIANTS,
  actionInvariants: RUNTIME_EXECUTIVE_ADVISOR_ACTION_INVARIANTS,
  forbiddenResponsibilities: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_FORBIDDEN,
  publicTypeNames: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveAdvisorGuidanceActionsApiNames,
  registry: runtimeExecutiveAdvisorGuidanceActionsRegistry,
  responseBoundary: "REX-3:3-response-model-only" as const,
  architecturalStatus:
    "REX-3:4 Guidance & Executive Actions Complete — Ready for REX-3:5 Advisor Stage Coordination" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveAdvisorGuidanceActionsVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveAdvisorGuidanceActionsIdentity;
  readonly version: typeof runtimeExecutiveAdvisorGuidanceActionsVersion;
  readonly namespace: typeof runtimeExecutiveAdvisorGuidanceActionsNamespace;
  readonly dependencyIdentity: typeof runtimeExecutiveAdvisorGuidanceActionsDependencyIdentity;
  readonly guidanceStateCount: number;
  readonly guidanceKindCount: number;
  readonly guidancePriorityCount: number;
  readonly actionKindCount: number;
  readonly actionStateCount: number;
  readonly actionAuthorityCount: number;
  readonly actionSafetyCount: number;
  readonly actionPreconditionCount: number;
  readonly mappingCount: number;
  readonly capabilityCount: number;
  readonly sectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly responseBoundaryIntact: boolean;
  readonly noAutoExecution: boolean;
  readonly noStageMutation: boolean;
  readonly responseOk: boolean;
  readonly noAi: boolean;
}

export function verifyRuntimeExecutiveAdvisorGuidanceActions():
  RuntimeExecutiveAdvisorGuidanceActionsVerification {
  const module = runtimeExecutiveAdvisorGuidanceActions;
  const registry = runtimeExecutiveAdvisorGuidanceActionsRegistry;
  const responseOk = verifyRuntimeExecutiveAdvisorResponseModel();

  const identityOk =
    module.identity === "REX-3:4/RuntimeExecutiveAdvisorGuidanceActions" &&
    module.version === "3.4.0" &&
    module.namespace ===
      "nexora.rex.advisor-experience.guidance-actions" &&
    module.upstreamDependency ===
      "REX-3:3/RuntimeExecutiveAdvisorResponseModel" &&
    module.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveAdvisorResponseModel" &&
    module.responseBoundary === "REX-3:3-response-model-only";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_STATES], [
      "none",
      "available",
      "recommended",
      "urgent",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_KINDS], [
      "observe",
      "inspect",
      "explain",
      "investigate",
      "compare",
      "trace",
      "monitor",
      "review",
      "prepare-scenario",
      "prepare-decision",
      "prepare-action",
    ]) &&
    exactOrder(
      [...RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_REGISTRY_SECTIONS],
      [
        "Identity",
        "GuidanceStates",
        "GuidanceKinds",
        "GuidancePriorities",
        "ActionKinds",
        "ActionStates",
        "ActionAuthorities",
        "ActionSafeties",
        "ActionPreconditions",
        "Mappings",
        "Validation",
        "Capabilities",
      ],
    ) &&
    RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_TO_ACTION_MAPPINGS.length >= 10;

  const empty = RUNTIME_EXECUTIVE_ADVISOR_EMPTY_GUIDANCE_PACKAGE;
  const emptyOk =
    empty.state === "none" &&
    empty.primaryGuidance === null &&
    empty.guidance.length === 0 &&
    empty.actions.length === 0 &&
    empty.isActionReady === false;

  const frozen =
    Object.isFrozen(module) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_EMPTY_GUIDANCE_PACKAGE) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_TO_ACTION_MAPPINGS);

  const responseBoundaryIntact =
    module.boundary.soleImmediateDependency ===
      "REX-3:3/RuntimeExecutiveAdvisorResponseModel" &&
    module.boundary.consumesResponseModelOnly === true &&
    module.boundary.importsRex32Directly === false &&
    module.boundary.importsRex31Directly === false &&
    module.boundary.executesActions === false &&
    module.boundary.mutatesStageState === false &&
    module.boundary.coordinatesStage === false;

  const ok =
    identityOk &&
    vocabOk &&
    emptyOk &&
    frozen &&
    responseBoundaryIntact &&
    responseOk.ok === true &&
    module.boundary.aiProviderIndependent === true &&
    module.boundary.generatesProse === false;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveAdvisorGuidanceActionsIdentity,
    version: runtimeExecutiveAdvisorGuidanceActionsVersion,
    namespace: runtimeExecutiveAdvisorGuidanceActionsNamespace,
    dependencyIdentity:
      runtimeExecutiveAdvisorGuidanceActionsDependencyIdentity,
    guidanceStateCount: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_STATES.length,
    guidanceKindCount: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_KINDS.length,
    guidancePriorityCount: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_PRIORITIES.length,
    actionKindCount: RUNTIME_EXECUTIVE_ADVISOR_EXECUTIVE_ACTION_KINDS.length,
    actionStateCount: RUNTIME_EXECUTIVE_ADVISOR_EXECUTIVE_ACTION_STATES.length,
    actionAuthorityCount: RUNTIME_EXECUTIVE_ADVISOR_ACTION_AUTHORITIES.length,
    actionSafetyCount: RUNTIME_EXECUTIVE_ADVISOR_ACTION_SAFETIES.length,
    actionPreconditionCount:
      RUNTIME_EXECUTIVE_ADVISOR_ACTION_PRECONDITION_KINDS.length,
    mappingCount: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_TO_ACTION_MAPPINGS.length,
    capabilityCount: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_CAPABILITIES.length,
    sectionCount: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_REGISTRY_SECTIONS.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_PUBLIC_TYPE_NAMES.length,
    publicApiCount: runtimeExecutiveAdvisorGuidanceActionsApiNames.length,
    frozen,
    responseBoundaryIntact,
    noAutoExecution: module.boundary.executesActions === false,
    noStageMutation: module.boundary.mutatesStageState === false,
    responseOk: responseOk.ok === true,
    noAi: module.boundary.generatesProse === false,
  });
}
