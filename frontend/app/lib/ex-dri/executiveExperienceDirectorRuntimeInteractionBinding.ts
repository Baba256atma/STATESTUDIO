/**
 * EX-DRI-4 — Executive Experience ↔ Director Runtime Interaction Binding.
 *
 * Pure interaction-binding layer that converts semantic Executive Experience
 * interactions into canonical EX → DRI runtime request contracts.
 *
 * Answers:
 *   Given an executive interaction and the current semantic Executive
 *   Experience context, what exact DRI request should be produced?
 *
 * EX says: "Manager selected Factory."
 * EX-DRI-4 says: "Here is the canonical runtime request."
 * DRI decides: "What should happen because Factory was selected?"
 *
 * No runtime execution, UI mutation, or intent/focus/attention resolution.
 */

import {
  EXECUTIVE_CONTEXT_BINDING_ATTENTION_LEVELS,
  EXECUTIVE_CONTEXT_BINDING_FOCUS_ROLES,
  EXECUTIVE_CONTEXT_BINDING_INTERACTION_KINDS,
  EXECUTIVE_CONTEXT_BINDING_PRESENTATION_STATES,
  EXECUTIVE_CONTEXT_BINDING_SURFACES,
  bindExecutiveExperienceCompositeState,
  bindExecutiveExperienceStateToDirectorRuntimeContext,
  createExecutiveDirectorRuntimeCorrelation,
  createExecutiveDirectorRuntimeContextContract,
  createExecutiveDirectorRuntimeInteractionContract,
  createExecutiveDirectorRuntimeRequest,
  createExecutiveDirectorRuntimeResponse,
  createExecutiveDirectorRuntimeSubjectContract,
  createExecutiveRuntimeDirectionContract,
  executiveExperienceDirectorRuntimeContextStateBindingIdentity,
  isExecutiveAttentionDirectionContract,
  isExecutiveCoordinationDirectionContract,
  isExecutiveDirectorRuntimeContextContract,
  isExecutiveDirectorRuntimeCorrelation,
  isExecutiveDirectorRuntimeRequestContract,
  isExecutiveDirectorRuntimeResponseContract,
  isExecutiveDirectorRuntimeSubjectContract,
  isExecutiveExperienceCompositeStateSnapshot,
  isExecutiveFocusDirectionContract,
  isExecutiveGuidanceDirectionContract,
  isExecutivePresentationDirectionContract,
  isExecutiveRuntimeDirectionContract,
  isExecutiveSceneDirectionContract,
  normalizeExecutiveExperienceCompositeState,
  type ExecutiveAttentionDirectionContract,
  type ExecutiveAttentionDirectionLevel,
  type ExecutiveCoordinationDirectionContract,
  type ExecutiveDirectorRuntimeContextContract,
  type ExecutiveDirectorRuntimeCorrelation,
  type ExecutiveDirectorRuntimeInteractionContract,
  type ExecutiveDirectorRuntimeRequestContract,
  type ExecutiveDirectorRuntimeResponseContract,
  type ExecutiveDirectorRuntimeResponseStatus,
  type ExecutiveDirectorRuntimeSubjectContract,
  type ExecutiveExperienceCompositeStateSnapshot,
  type ExecutiveExperienceContextBindingResult,
  type ExecutiveExperienceSurface,
  type ExecutiveFocusDirectionContract,
  type ExecutiveFocusDirectionRole,
  type ExecutiveGuidanceDirectionContract,
  type ExecutiveInteractionKind,
  type ExecutivePresentationDirectionContract,
  type ExecutivePresentationState,
  type ExecutiveRuntimeDirectionContract,
  type ExecutiveSceneDirectionContract,
} from "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeContextStateBinding";

/**
 * Additive re-export surface for EX-DRI-5 Scene & Presentation Binding.
 * Preserves EX-DRI-4 as the sole immediate dependency boundary.
 */
export type {
  ExecutiveAttentionDirectionContract,
  ExecutiveAttentionDirectionLevel,
  ExecutiveCoordinationDirectionContract,
  ExecutiveDirectorRuntimeContextContract,
  ExecutiveDirectorRuntimeCorrelation,
  ExecutiveDirectorRuntimeInteractionContract,
  ExecutiveDirectorRuntimeRequestContract,
  ExecutiveDirectorRuntimeResponseContract,
  ExecutiveDirectorRuntimeResponseStatus,
  ExecutiveDirectorRuntimeSubjectContract,
  ExecutiveExperienceCompositeStateSnapshot,
  ExecutiveExperienceContextBindingResult,
  ExecutiveFocusDirectionContract,
  ExecutiveFocusDirectionRole,
  ExecutiveGuidanceDirectionContract,
  ExecutivePresentationDirectionContract,
  ExecutivePresentationState,
  ExecutiveRuntimeDirectionContract,
  ExecutiveSceneDirectionContract,
};

export {
  EXECUTIVE_CONTEXT_BINDING_ATTENTION_LEVELS as EXECUTIVE_INTERACTION_BINDING_ATTENTION_LEVELS,
  EXECUTIVE_CONTEXT_BINDING_FOCUS_ROLES as EXECUTIVE_INTERACTION_BINDING_FOCUS_ROLES,
  EXECUTIVE_CONTEXT_BINDING_PRESENTATION_STATES as EXECUTIVE_INTERACTION_BINDING_PRESENTATION_STATES,
  bindExecutiveExperienceCompositeState,
  bindExecutiveExperienceStateToDirectorRuntimeContext,
  createExecutiveDirectorRuntimeCorrelation,
  createExecutiveDirectorRuntimeContextContract,
  createExecutiveDirectorRuntimeRequest,
  createExecutiveDirectorRuntimeResponse,
  createExecutiveDirectorRuntimeSubjectContract,
  createExecutiveRuntimeDirectionContract,
  isExecutiveAttentionDirectionContract,
  isExecutiveCoordinationDirectionContract,
  isExecutiveDirectorRuntimeContextContract,
  isExecutiveDirectorRuntimeCorrelation,
  isExecutiveDirectorRuntimeRequestContract,
  isExecutiveDirectorRuntimeResponseContract,
  isExecutiveDirectorRuntimeSubjectContract,
  isExecutiveExperienceCompositeStateSnapshot,
  isExecutiveFocusDirectionContract,
  isExecutiveGuidanceDirectionContract,
  isExecutivePresentationDirectionContract,
  isExecutiveRuntimeDirectionContract,
  isExecutiveSceneDirectionContract,
  normalizeExecutiveExperienceCompositeState,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveExperienceDirectorRuntimeInteractionBindingIdentity =
  "EX-DRI-4/ExecutiveExperienceDirectorRuntimeInteractionBinding" as const;

export const executiveExperienceDirectorRuntimeInteractionBindingVersion =
  "1.4.0" as const;

export const executiveExperienceDirectorRuntimeInteractionBindingNamespace =
  "nexora.ex.dri.integration.interaction-binding" as const;

export const executiveExperienceDirectorRuntimeInteractionBindingRole =
  "ExecutiveExperienceDirectorRuntimeInteractionBinding" as const;

export const executiveExperienceDirectorRuntimeInteractionBindingDependencyIdentity =
  executiveExperienceDirectorRuntimeContextStateBindingIdentity;

export const executiveExperienceDirectorRuntimeInteractionBindingDependencyPath =
  "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeContextStateBinding" as const;

export const executiveExperienceDirectorRuntimeInteractionBindingDirection =
  "ex-interaction-to-dri-request" as const;

export const executiveExperienceDirectorRuntimeInteractionBindingDeterministic =
  true as const;

export const executiveExperienceDirectorRuntimeInteractionBindingStateless =
  true as const;

export const executiveExperienceDirectorRuntimeInteractionBindingMutationPolicy =
  "immutable" as const;

export const executiveExperienceDirectorRuntimeInteractionBindingSideEffectPolicy =
  "side-effect-free" as const;

export const executiveExperienceDirectorRuntimeInteractionBindingCanonicalIdentity =
  Object.freeze({
    identity:
      executiveExperienceDirectorRuntimeInteractionBindingIdentity,
    version:
      executiveExperienceDirectorRuntimeInteractionBindingVersion,
    namespace:
      executiveExperienceDirectorRuntimeInteractionBindingNamespace,
    role: executiveExperienceDirectorRuntimeInteractionBindingRole,
    dependencyIdentity:
      executiveExperienceDirectorRuntimeInteractionBindingDependencyIdentity,
    bindingDirection:
      executiveExperienceDirectorRuntimeInteractionBindingDirection,
    deterministicStatus:
      executiveExperienceDirectorRuntimeInteractionBindingDeterministic,
    statelessStatus:
      executiveExperienceDirectorRuntimeInteractionBindingStateless,
    mutationPolicy:
      executiveExperienceDirectorRuntimeInteractionBindingMutationPolicy,
    sideEffectPolicy:
      executiveExperienceDirectorRuntimeInteractionBindingSideEffectPolicy,
  });

export const EXECUTIVE_INTERACTION_BINDING_PRINCIPLE =
  "EX reports what the executive did. EX-DRI converts the interaction into runtime-safe semantic input. DRI decides what the interaction means." as const;

// ─── Vocabulary (authoritative via EX-DRI-3 → EX-DRI-2) ─────────────────────

export const EXECUTIVE_INTERACTION_BINDING_KINDS =
  EXECUTIVE_CONTEXT_BINDING_INTERACTION_KINDS;

export type { ExecutiveInteractionKind };

export const EXECUTIVE_INTERACTION_BINDING_SURFACES =
  EXECUTIVE_CONTEXT_BINDING_SURFACES;

export type { ExecutiveExperienceSurface };

export const EXECUTIVE_INTERACTION_BINDING_STATUSES = Object.freeze([
  "bound",
  "rejected",
  "noop",
] as const);

export type ExecutiveInteractionBindingStatus =
  (typeof EXECUTIVE_INTERACTION_BINDING_STATUSES)[number];

export const EXECUTIVE_INTERACTION_BINDING_ISSUE_CODES = Object.freeze([
  "INVALID_INTERACTION",
  "INVALID_INTERACTION_ID",
  "INVALID_INTERACTION_KIND",
  "INVALID_SURFACE",
  "INVALID_SUBJECT",
  "SUBJECT_REQUIRED",
  "CONTEXT_REQUIRED",
  "CONTEXT_SURFACE_MISMATCH",
  "INVALID_CORRELATION",
  "DUPLICATE_INTERACTION_ID",
  "UNSUPPORTED_INTERACTION",
] as const);

export type ExecutiveInteractionBindingIssueCode =
  (typeof EXECUTIVE_INTERACTION_BINDING_ISSUE_CODES)[number];

/** Request kind used for successful interaction-bearing binds. */
export const EXECUTIVE_INTERACTION_BINDING_REQUEST_KIND =
  "context-interaction" as const;

export const EXECUTIVE_INTERACTION_BINDING_REQUEST_DIRECTION =
  "ex-to-dri" as const;

// ─── Source / input / result contracts ──────────────────────────────────────

/**
 * Where the semantic interaction originated.
 * No DOM, React component, coordinates, or raycast objects.
 */
export interface ExecutiveInteractionSource {
  readonly surface: ExecutiveExperienceSurface;
}

/**
 * Canonical semantic interaction input for EX-DRI-4.
 * Facts only — receives already-bound EX-DRI-3 context.
 */
export interface ExecutiveInteractionBindingInput {
  readonly interactionId: string;
  readonly kind: ExecutiveInteractionKind;
  readonly surface: ExecutiveExperienceSurface;
  readonly subject?: ExecutiveDirectorRuntimeSubjectContract;
  readonly context: ExecutiveDirectorRuntimeContextContract;
  readonly correlation: ExecutiveDirectorRuntimeCorrelation;
}

export interface ExecutiveInteractionBindingIssue {
  readonly code: ExecutiveInteractionBindingIssueCode;
  readonly path?: string;
  readonly message: string;
}

export interface ExecutiveInteractionBindingResult {
  readonly status: ExecutiveInteractionBindingStatus;
  readonly request?: ExecutiveDirectorRuntimeRequestContract;
  readonly issues: ReadonlyArray<ExecutiveInteractionBindingIssue>;
}

export interface ExecutiveInteractionBatchBindingResult {
  readonly results: ReadonlyArray<ExecutiveInteractionBindingResult>;
  readonly boundCount: number;
  readonly rejectedCount: number;
  readonly noopCount: number;
}

/**
 * Structural policy only — no runtime behavior encoding.
 */
export interface ExecutiveInteractionPolicy {
  readonly kind: ExecutiveInteractionKind;
  readonly requiresSubject: boolean;
  readonly requiresContext: boolean;
  readonly runtimeEligible: boolean;
  readonly eligibleSurfaces: ReadonlyArray<ExecutiveExperienceSurface>;
}

// ─── Policies ───────────────────────────────────────────────────────────────

const ALL_SURFACES = EXECUTIVE_INTERACTION_BINDING_SURFACES;

/**
 * Minimal permissive surface eligibility: all canonical kinds are structurally
 * legal on all six Executive Experience surfaces. Narrower product constraints
 * belong in later platform policy, not silent binding rejection here.
 */
function policy(
  kind: ExecutiveInteractionKind,
  requiresSubject: boolean,
  runtimeEligible = true,
): ExecutiveInteractionPolicy {
  return Object.freeze({
    kind,
    requiresSubject,
    requiresContext: true,
    runtimeEligible,
    eligibleSurfaces: ALL_SURFACES,
  });
}

export const EXECUTIVE_INTERACTION_POLICIES = Object.freeze([
  policy("select", true),
  policy("focus", true),
  policy("activate", true),
  policy("open", false),
  policy("close", false),
  policy("expand", true),
  policy("collapse", true),
  policy("dismiss", false),
  policy("hover", true),
  policy("navigate", false),
  policy("inspect", true),
] as const);

export type ExecutiveInteractionPolicyEntry =
  (typeof EXECUTIVE_INTERACTION_POLICIES)[number];

const POLICY_BY_KIND: ReadonlyMap<
  ExecutiveInteractionKind,
  ExecutiveInteractionPolicy
> = new Map(EXECUTIVE_INTERACTION_POLICIES.map((entry) => [entry.kind, entry]));

export function getExecutiveInteractionPolicy(
  kind: ExecutiveInteractionKind,
): ExecutiveInteractionPolicy | undefined {
  return POLICY_BY_KIND.get(kind);
}

// ─── Guarantees ─────────────────────────────────────────────────────────────

export const EXECUTIVE_INTERACTION_BINDING_GUARANTEES = Object.freeze([
  Object.freeze({
    id: "only-semantic-interactions-cross",
    order: 1,
    statement: "only semantic interactions cross EX → DRI",
  }),
  Object.freeze({
    id: "dom-events-never-cross",
    order: 2,
    statement: "DOM events never cross the boundary",
  }),
  Object.freeze({
    id: "react-events-never-cross",
    order: 3,
    statement: "React event objects never cross the boundary",
  }),
  Object.freeze({
    id: "threejs-events-never-cross",
    order: 4,
    statement: "Three.js event objects never cross the boundary",
  }),
  Object.freeze({
    id: "interaction-ids-caller-supplied",
    order: 5,
    statement: "interaction IDs are caller-supplied",
  }),
  Object.freeze({
    id: "correlation-ids-caller-supplied",
    order: 6,
    statement: "correlation IDs are caller-supplied",
  }),
  Object.freeze({
    id: "binding-deterministic",
    order: 7,
    statement: "binding is deterministic",
  }),
  Object.freeze({
    id: "binding-stateless",
    order: 8,
    statement: "binding is stateless",
  }),
  Object.freeze({
    id: "inputs-never-mutated",
    order: 9,
    statement: "inputs are never mutated",
  }),
  Object.freeze({
    id: "interaction-kind-canonical",
    order: 10,
    statement: "interaction kind remains canonical",
  }),
  Object.freeze({
    id: "surface-canonical",
    order: 11,
    statement: "surface remains canonical",
  }),
  Object.freeze({
    id: "subjects-lightweight-references",
    order: 12,
    statement: "subjects remain lightweight references",
  }),
  Object.freeze({
    id: "context-originates-from-ex-dri-3",
    order: 13,
    statement: "context originates from EX-DRI-3",
  }),
  Object.freeze({
    id: "selection-is-not-focus-resolution",
    order: 14,
    statement: "selection is not focus resolution",
  }),
  Object.freeze({
    id: "no-intent-resolution",
    order: 15,
    statement: "interaction binding performs no intent resolution",
  }),
  Object.freeze({
    id: "no-attention-resolution",
    order: 16,
    statement: "interaction binding performs no attention resolution",
  }),
  Object.freeze({
    id: "no-presentation-resolution",
    order: 17,
    statement: "interaction binding performs no presentation resolution",
  }),
  Object.freeze({
    id: "no-scene-resolution",
    order: 18,
    statement: "interaction binding performs no scene resolution",
  }),
  Object.freeze({
    id: "no-runtime-prioritization",
    order: 19,
    statement: "runtime prioritization is not performed",
  }),
  Object.freeze({
    id: "no-ui-effects",
    order: 20,
    statement: "UI effects are not performed",
  }),
  Object.freeze({
    id: "request-direction-ex-to-dri",
    order: 21,
    statement: "request direction remains ex-to-dri",
  }),
  Object.freeze({
    id: "no-runtime-engine-in-ex-dri-4",
    order: 22,
    statement: "EX-DRI-4 contains no runtime engine",
  }),
] as const);

export type ExecutiveInteractionBindingGuarantee =
  (typeof EXECUTIVE_INTERACTION_BINDING_GUARANTEES)[number];

export const EXECUTIVE_INTERACTION_BINDING_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "runtime engine execution",
    "intent resolution",
    "focus resolution",
    "attention resolution",
    "scene resolution",
    "presentation resolution",
    "guidance generation",
    "EX state mutation",
    "UI rendering",
    "React event handling",
    "Three.js mutation",
    "KPI computation",
    "KOI computation",
    "async orchestration",
    "ID generation",
  ] as const);

// ─── Internal helpers ───────────────────────────────────────────────────────

type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasOpaqueId(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isExecutiveInteractionKind(
  value: unknown,
): value is ExecutiveInteractionKind {
  return (EXECUTIVE_INTERACTION_BINDING_KINDS as readonly unknown[]).includes(
    value,
  );
}

function isExecutiveExperienceSurface(
  value: unknown,
): value is ExecutiveExperienceSurface {
  return (EXECUTIVE_INTERACTION_BINDING_SURFACES as readonly unknown[]).includes(
    value,
  );
}

function issue(
  code: ExecutiveInteractionBindingIssueCode,
  message: string,
  path?: string,
): ExecutiveInteractionBindingIssue {
  return Object.freeze(
    path !== undefined ? { code, message, path } : { code, message },
  );
}

function rejected(
  issues: ReadonlyArray<ExecutiveInteractionBindingIssue>,
): ExecutiveInteractionBindingResult {
  return Object.freeze({
    status: "rejected" as const,
    issues: Object.freeze([...issues]),
  });
}

function freezeSubject(
  subject: ExecutiveDirectorRuntimeSubjectContract,
): ExecutiveDirectorRuntimeSubjectContract {
  return createExecutiveDirectorRuntimeSubjectContract(subject);
}

function subjectsEqual(
  left: ExecutiveDirectorRuntimeSubjectContract | undefined,
  right: ExecutiveDirectorRuntimeSubjectContract | undefined,
): boolean {
  if (left === undefined && right === undefined) return true;
  if (left === undefined || right === undefined) return false;
  return (
    left.id === right.id &&
    left.kind === right.kind &&
    (left.label ?? undefined) === (right.label ?? undefined)
  );
}

function collectBindingIssues(
  value: unknown,
): ReadonlyArray<ExecutiveInteractionBindingIssue> {
  if (!isPlainObject(value)) {
    return [
      issue("INVALID_INTERACTION", "interaction binding input must be a plain object"),
    ];
  }

  const issues: ExecutiveInteractionBindingIssue[] = [];

  if (!hasOpaqueId(value.interactionId)) {
    issues.push(
      issue(
        "INVALID_INTERACTION_ID",
        "interactionId must be a non-empty opaque identifier",
        "interactionId",
      ),
    );
  }

  if (!isExecutiveInteractionKind(value.kind)) {
    issues.push(
      issue(
        "INVALID_INTERACTION_KIND",
        "kind must be a canonical executive interaction kind",
        "kind",
      ),
    );
  }

  if (!isExecutiveExperienceSurface(value.surface)) {
    issues.push(
      issue(
        "INVALID_SURFACE",
        "surface must be a canonical executive experience surface",
        "surface",
      ),
    );
  }

  if (value.context === undefined) {
    issues.push(
      issue("CONTEXT_REQUIRED", "context is required", "context"),
    );
  } else if (!isExecutiveDirectorRuntimeContextContract(value.context)) {
    issues.push(
      issue(
        "CONTEXT_REQUIRED",
        "context must be a valid ExecutiveDirectorRuntimeContextContract",
        "context",
      ),
    );
  }

  if (!isExecutiveDirectorRuntimeCorrelation(value.correlation)) {
    issues.push(
      issue(
        "INVALID_CORRELATION",
        "correlation must be a valid ExecutiveDirectorRuntimeCorrelation",
        "correlation",
      ),
    );
  }

  if (
    value.subject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(value.subject)
  ) {
    issues.push(
      issue(
        "INVALID_SUBJECT",
        "subject must be a valid lightweight subject contract",
        "subject",
      ),
    );
  }

  if (
    isExecutiveInteractionKind(value.kind) &&
    isExecutiveExperienceSurface(value.surface)
  ) {
    const kindPolicy = POLICY_BY_KIND.get(value.kind);
    if (kindPolicy === undefined) {
      issues.push(
        issue(
          "UNSUPPORTED_INTERACTION",
          "interaction kind has no binding policy",
          "kind",
        ),
      );
    } else {
      if (
        kindPolicy.requiresSubject &&
        value.subject === undefined
      ) {
        issues.push(
          issue(
            "SUBJECT_REQUIRED",
            `interaction kind ${value.kind} requires a subject`,
            "subject",
          ),
        );
      }
      if (
        !kindPolicy.eligibleSurfaces.includes(value.surface)
      ) {
        issues.push(
          issue(
            "UNSUPPORTED_INTERACTION",
            `interaction kind ${value.kind} is not eligible on surface ${value.surface}`,
            "surface",
          ),
        );
      }
    }
  }

  if (
    isExecutiveExperienceSurface(value.surface) &&
    isExecutiveDirectorRuntimeContextContract(value.context) &&
    value.context.surface !== value.surface
  ) {
    issues.push(
      issue(
        "CONTEXT_SURFACE_MISMATCH",
        "interaction.surface must match context.surface",
        "surface",
      ),
    );
  }

  return Object.freeze(issues);
}

// ─── Validators ─────────────────────────────────────────────────────────────

export function isExecutiveInteractionBindingStatus(
  value: unknown,
): value is ExecutiveInteractionBindingStatus {
  return (EXECUTIVE_INTERACTION_BINDING_STATUSES as readonly unknown[]).includes(
    value,
  );
}

export function isExecutiveInteractionBindingIssueCode(
  value: unknown,
): value is ExecutiveInteractionBindingIssueCode {
  return (
    EXECUTIVE_INTERACTION_BINDING_ISSUE_CODES as readonly unknown[]
  ).includes(value);
}

export function isExecutiveInteractionSource(
  value: unknown,
): value is ExecutiveInteractionSource {
  return (
    isPlainObject(value) &&
    isExecutiveExperienceSurface(value.surface) &&
    Object.keys(value).every((key) => key === "surface")
  );
}

export function isExecutiveInteractionBindingInput(
  value: unknown,
): value is ExecutiveInteractionBindingInput {
  return collectBindingIssues(value).length === 0;
}

export function isExecutiveInteractionBindingResult(
  value: unknown,
): value is ExecutiveInteractionBindingResult {
  if (!isPlainObject(value)) return false;
  if (!isExecutiveInteractionBindingStatus(value.status)) return false;
  if (!Array.isArray(value.issues)) return false;
  if (
    !value.issues.every(
      (entry) =>
        isPlainObject(entry) &&
        isExecutiveInteractionBindingIssueCode(entry.code) &&
        typeof entry.message === "string",
    )
  ) {
    return false;
  }
  if (value.status === "bound") {
    return value.request !== undefined;
  }
  return value.request === undefined;
}

export function canBindExecutiveInteraction(value: unknown): boolean {
  return isExecutiveInteractionBindingInput(value);
}

export function areExecutiveInteractionsEqual(
  left: ExecutiveDirectorRuntimeInteractionContract,
  right: ExecutiveDirectorRuntimeInteractionContract,
): boolean {
  return (
    left.interactionId === right.interactionId &&
    left.kind === right.kind &&
    left.surface === right.surface &&
    subjectsEqual(left.subject, right.subject)
  );
}

// ─── Normalization ──────────────────────────────────────────────────────────

export function normalizeExecutiveInteractionBindingInput(
  input: ExecutiveInteractionBindingInput,
): ExecutiveInteractionBindingInput {
  const issues = collectBindingIssues(input);
  if (issues.length > 0) {
    throw new TypeError(
      `invalid ExecutiveInteractionBindingInput: ${issues[0]!.code}`,
    );
  }

  return Object.freeze({
    interactionId: input.interactionId,
    kind: input.kind,
    surface: input.surface,
    ...(input.subject !== undefined
      ? { subject: freezeSubject(input.subject) }
      : {}),
    context: input.context,
    correlation: createExecutiveDirectorRuntimeCorrelation(input.correlation),
  });
}

// ─── Binding ────────────────────────────────────────────────────────────────

/**
 * Converts a semantic executive interaction + EX-DRI-3 context into a
 * canonical EX → DRI request. Never mutates input. Never executes DRI.
 */
export function bindExecutiveInteractionToDirectorRuntimeRequest(
  input: ExecutiveInteractionBindingInput,
): ExecutiveInteractionBindingResult {
  const issues = [...collectBindingIssues(input)];
  if (issues.length > 0) {
    return rejected(issues);
  }

  const kindPolicy = POLICY_BY_KIND.get(input.kind)!;
  if (!kindPolicy.runtimeEligible) {
    return Object.freeze({
      status: "noop" as const,
      issues: Object.freeze([]),
    });
  }

  const interaction = createExecutiveDirectorRuntimeInteractionContract({
    interactionId: input.interactionId,
    kind: input.kind,
    surface: input.surface,
    ...(input.subject !== undefined
      ? { subject: freezeSubject(input.subject) }
      : {}),
  });

  const correlation = createExecutiveDirectorRuntimeCorrelation(
    input.correlation,
  );

  const request = createExecutiveDirectorRuntimeRequest({
    direction: EXECUTIVE_INTERACTION_BINDING_REQUEST_DIRECTION,
    kind: EXECUTIVE_INTERACTION_BINDING_REQUEST_KIND,
    correlation,
    context: input.context,
    interaction,
  });

  return Object.freeze({
    status: "bound" as const,
    request,
    issues: Object.freeze([]),
  });
}

/**
 * Deterministic batch binding. Preserves caller order. No concurrency.
 */
export function bindExecutiveInteractionsToDirectorRuntimeRequests(
  inputs: ReadonlyArray<ExecutiveInteractionBindingInput>,
): ExecutiveInteractionBatchBindingResult {
  if (!Array.isArray(inputs)) {
    throw new TypeError("inputs must be an array");
  }

  const seenIds = new Set<string>();
  const results: ExecutiveInteractionBindingResult[] = [];

  for (const input of inputs) {
    const duplicateIssues: ExecutiveInteractionBindingIssue[] = [];
    if (
      isPlainObject(input) &&
      hasOpaqueId(input.interactionId) &&
      seenIds.has(input.interactionId)
    ) {
      duplicateIssues.push(
        issue(
          "DUPLICATE_INTERACTION_ID",
          "interactionId is duplicated within the batch",
          "interactionId",
        ),
      );
    }
    if (isPlainObject(input) && hasOpaqueId(input.interactionId)) {
      seenIds.add(input.interactionId);
    }

    if (duplicateIssues.length > 0) {
      const structural = collectBindingIssues(input);
      results.push(
        rejected(Object.freeze([...duplicateIssues, ...structural])),
      );
      continue;
    }

    results.push(bindExecutiveInteractionToDirectorRuntimeRequest(input));
  }

  const frozenResults = Object.freeze(results);
  let boundCount = 0;
  let rejectedCount = 0;
  let noopCount = 0;
  for (const result of frozenResults) {
    if (result.status === "bound") boundCount += 1;
    else if (result.status === "rejected") rejectedCount += 1;
    else noopCount += 1;
  }

  return Object.freeze({
    results: frozenResults,
    boundCount,
    rejectedCount,
    noopCount,
  });
}

// ─── Catalogs / registry ────────────────────────────────────────────────────

export const EXECUTIVE_INTERACTION_BINDING_PUBLIC_TYPE_NAMES = Object.freeze([
  "ExecutiveInteractionKind",
  "ExecutiveExperienceSurface",
  "ExecutiveInteractionSource",
  "ExecutiveInteractionBindingInput",
  "ExecutiveInteractionBindingStatus",
  "ExecutiveInteractionBindingIssueCode",
  "ExecutiveInteractionBindingIssue",
  "ExecutiveInteractionBindingResult",
  "ExecutiveInteractionBatchBindingResult",
  "ExecutiveInteractionPolicy",
  "ExecutiveInteractionPolicyEntry",
  "ExecutiveInteractionBindingGuarantee",
  "ExecutiveExperienceDirectorRuntimeInteractionBindingVerification",
] as const);

export const executiveExperienceDirectorRuntimeInteractionBindingValidatorNames =
  Object.freeze([
    "isExecutiveInteractionBindingInput",
    "isExecutiveInteractionBindingResult",
    "isExecutiveInteractionBindingStatus",
    "isExecutiveInteractionBindingIssueCode",
    "isExecutiveInteractionSource",
    "canBindExecutiveInteraction",
    "areExecutiveInteractionsEqual",
  ] as const);

export const executiveExperienceDirectorRuntimeInteractionBindingApiNames =
  Object.freeze([
    "getExecutiveInteractionPolicy",
    "normalizeExecutiveInteractionBindingInput",
    "bindExecutiveInteractionToDirectorRuntimeRequest",
    "bindExecutiveInteractionsToDirectorRuntimeRequests",
    ...executiveExperienceDirectorRuntimeInteractionBindingValidatorNames,
    "getExecutiveExperienceDirectorRuntimeInteractionBindingIdentity",
    "listExecutiveInteractionBindingKinds",
    "listExecutiveInteractionPolicies",
    "verifyExecutiveExperienceDirectorRuntimeInteractionBinding",
  ] as const);

export const EXECUTIVE_INTERACTION_BINDING_REGISTRY_SECTIONS = Object.freeze([
  "Identity",
  "InteractionKinds",
  "InteractionPolicies",
  "Binding",
  "BatchBinding",
  "Validation",
  "IssueCodes",
  "Guarantees",
  "Compatibility",
] as const);

export function listExecutiveInteractionBindingKinds(): ReadonlyArray<
  ExecutiveInteractionKind
> {
  return EXECUTIVE_INTERACTION_BINDING_KINDS;
}

export function listExecutiveInteractionPolicies(): ReadonlyArray<
  ExecutiveInteractionPolicy
> {
  return EXECUTIVE_INTERACTION_POLICIES;
}

export function getExecutiveExperienceDirectorRuntimeInteractionBindingIdentity():
  typeof executiveExperienceDirectorRuntimeInteractionBindingCanonicalIdentity {
  return executiveExperienceDirectorRuntimeInteractionBindingCanonicalIdentity;
}

export const executiveExperienceDirectorRuntimeInteractionBindingRegistry =
  Object.freeze({
    identity:
      executiveExperienceDirectorRuntimeInteractionBindingIdentity,
    version:
      executiveExperienceDirectorRuntimeInteractionBindingVersion,
    namespace:
      executiveExperienceDirectorRuntimeInteractionBindingNamespace,
    role: executiveExperienceDirectorRuntimeInteractionBindingRole,
    dependencyIdentity:
      executiveExperienceDirectorRuntimeInteractionBindingDependencyIdentity,
    dependencyPath:
      executiveExperienceDirectorRuntimeInteractionBindingDependencyPath,
    principle: EXECUTIVE_INTERACTION_BINDING_PRINCIPLE,
    interactionKinds: EXECUTIVE_INTERACTION_BINDING_KINDS,
    interactionKindCount: EXECUTIVE_INTERACTION_BINDING_KINDS.length,
    surfaces: EXECUTIVE_INTERACTION_BINDING_SURFACES,
    surfaceCount: EXECUTIVE_INTERACTION_BINDING_SURFACES.length,
    statuses: EXECUTIVE_INTERACTION_BINDING_STATUSES,
    statusCount: EXECUTIVE_INTERACTION_BINDING_STATUSES.length,
    policies: EXECUTIVE_INTERACTION_POLICIES,
    policyCount: EXECUTIVE_INTERACTION_POLICIES.length,
    issueCodes: EXECUTIVE_INTERACTION_BINDING_ISSUE_CODES,
    issueCodeCount: EXECUTIVE_INTERACTION_BINDING_ISSUE_CODES.length,
    guarantees: EXECUTIVE_INTERACTION_BINDING_GUARANTEES,
    guaranteeCount: EXECUTIVE_INTERACTION_BINDING_GUARANTEES.length,
    requestKind: EXECUTIVE_INTERACTION_BINDING_REQUEST_KIND,
    requestDirection: EXECUTIVE_INTERACTION_BINDING_REQUEST_DIRECTION,
    validators:
      executiveExperienceDirectorRuntimeInteractionBindingValidatorNames,
    validatorCount:
      executiveExperienceDirectorRuntimeInteractionBindingValidatorNames
        .length,
    registrySections: EXECUTIVE_INTERACTION_BINDING_REGISTRY_SECTIONS,
    registrySectionCount:
      EXECUTIVE_INTERACTION_BINDING_REGISTRY_SECTIONS.length,
    publicTypes: EXECUTIVE_INTERACTION_BINDING_PUBLIC_TYPE_NAMES,
    publicTypeCount: EXECUTIVE_INTERACTION_BINDING_PUBLIC_TYPE_NAMES.length,
    publicApis:
      executiveExperienceDirectorRuntimeInteractionBindingApiNames,
    publicApiCount:
      executiveExperienceDirectorRuntimeInteractionBindingApiNames.length,
  });

export const executiveExperienceDirectorRuntimeInteractionBinding =
  Object.freeze({
    phase: "EX-DRI-4" as const,
    name: "ExecutiveExperienceDirectorRuntimeInteractionBinding" as const,
    identity:
      executiveExperienceDirectorRuntimeInteractionBindingIdentity,
    version:
      executiveExperienceDirectorRuntimeInteractionBindingVersion,
    namespace:
      executiveExperienceDirectorRuntimeInteractionBindingNamespace,
    role: executiveExperienceDirectorRuntimeInteractionBindingRole,
    stage: "InteractionBinding" as const,
    status: "InteractionBindingReady" as const,
    upstreamDependency:
      executiveExperienceDirectorRuntimeInteractionBindingDependencyIdentity,
    dependencyPath:
      executiveExperienceDirectorRuntimeInteractionBindingDependencyPath,
    bindingDirection:
      executiveExperienceDirectorRuntimeInteractionBindingDirection,
    deterministic:
      executiveExperienceDirectorRuntimeInteractionBindingDeterministic,
    stateless:
      executiveExperienceDirectorRuntimeInteractionBindingStateless,
    immutable: true as const,
    sideEffectFree: true as const,
    frameworkIndependent: true as const,
    rendererIndependent: true as const,
    browserIndependent: true as const,
    principle: EXECUTIVE_INTERACTION_BINDING_PRINCIPLE,
    interactionKinds: EXECUTIVE_INTERACTION_BINDING_KINDS,
    policies: EXECUTIVE_INTERACTION_POLICIES,
    statuses: EXECUTIVE_INTERACTION_BINDING_STATUSES,
    issueCodes: EXECUTIVE_INTERACTION_BINDING_ISSUE_CODES,
    guarantees: EXECUTIVE_INTERACTION_BINDING_GUARANTEES,
    requestKind: EXECUTIVE_INTERACTION_BINDING_REQUEST_KIND,
    requestDirection: EXECUTIVE_INTERACTION_BINDING_REQUEST_DIRECTION,
    forbiddenResponsibilities:
      EXECUTIVE_INTERACTION_BINDING_FORBIDDEN_RESPONSIBILITIES,
    publicApiSurface:
      executiveExperienceDirectorRuntimeInteractionBindingApiNames,
    publicTypes: EXECUTIVE_INTERACTION_BINDING_PUBLIC_TYPE_NAMES,
    registry:
      executiveExperienceDirectorRuntimeInteractionBindingRegistry,
    contextStateBindingBoundary: "EX-DRI-3-context-state-binding-only" as const,
    architecturalStatus:
      "InteractionBinding Complete · Deterministic · Stateless · Immutable · Framework-Independent · ReadyForExDriScenePresentationBinding" as const,
  });

// ─── Verification ───────────────────────────────────────────────────────────

export interface ExecutiveExperienceDirectorRuntimeInteractionBindingVerification {
  readonly ok: boolean;
  readonly identity: typeof executiveExperienceDirectorRuntimeInteractionBindingIdentity;
  readonly version: typeof executiveExperienceDirectorRuntimeInteractionBindingVersion;
  readonly namespace: typeof executiveExperienceDirectorRuntimeInteractionBindingNamespace;
  readonly role: typeof executiveExperienceDirectorRuntimeInteractionBindingRole;
  readonly dependencyIdentity: typeof executiveExperienceDirectorRuntimeInteractionBindingDependencyIdentity;
  readonly interactionKindCount: number;
  readonly policyCount: number;
  readonly statusCount: number;
  readonly issueCodeCount: number;
  readonly guaranteeCount: number;
  readonly validatorCount: number;
  readonly registrySectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly contextStateBindingBoundaryIntact: boolean;
  readonly frameworkIndependent: boolean;
  readonly requestDirectionValid: boolean;
  readonly subjectRequirementConsistent: boolean;
  readonly surfaceCompatibilityConsistent: boolean;
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

export function verifyExecutiveExperienceDirectorRuntimeInteractionBinding():
  ExecutiveExperienceDirectorRuntimeInteractionBindingVerification {
  const layer = executiveExperienceDirectorRuntimeInteractionBinding;
  const registry = executiveExperienceDirectorRuntimeInteractionBindingRegistry;

  const identityOk =
    layer.identity ===
      "EX-DRI-4/ExecutiveExperienceDirectorRuntimeInteractionBinding" &&
    layer.version === "1.4.0" &&
    layer.namespace === "nexora.ex.dri.integration.interaction-binding" &&
    layer.role ===
      "ExecutiveExperienceDirectorRuntimeInteractionBinding" &&
    layer.status === "InteractionBindingReady" &&
    layer.upstreamDependency ===
      "EX-DRI-3/ExecutiveExperienceDirectorRuntimeContextStateBinding" &&
    layer.upstreamDependency ===
      executiveExperienceDirectorRuntimeContextStateBindingIdentity &&
    registry.dependencyIdentity === layer.upstreamDependency &&
    layer.contextStateBindingBoundary ===
      "EX-DRI-3-context-state-binding-only";

  const dependencyOk =
    layer.dependencyPath ===
      "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeContextStateBinding";

  const kindsOk =
    exactOrder(EXECUTIVE_INTERACTION_BINDING_KINDS, [
      "select",
      "focus",
      "activate",
      "open",
      "close",
      "expand",
      "collapse",
      "dismiss",
      "hover",
      "navigate",
      "inspect",
    ]) &&
    unique([...EXECUTIVE_INTERACTION_BINDING_KINDS]) &&
    EXECUTIVE_INTERACTION_BINDING_KINDS.includes("select") &&
    EXECUTIVE_INTERACTION_BINDING_KINDS.includes("focus") &&
    EXECUTIVE_INTERACTION_BINDING_KINDS.includes("activate") &&
    EXECUTIVE_INTERACTION_BINDING_KINDS.includes("open") &&
    EXECUTIVE_INTERACTION_BINDING_KINDS.includes("close") &&
    EXECUTIVE_INTERACTION_BINDING_KINDS.includes("expand") &&
    EXECUTIVE_INTERACTION_BINDING_KINDS.includes("collapse") &&
    EXECUTIVE_INTERACTION_BINDING_KINDS.includes("dismiss");

  const policyOk =
    EXECUTIVE_INTERACTION_POLICIES.length ===
      EXECUTIVE_INTERACTION_BINDING_KINDS.length &&
    unique(EXECUTIVE_INTERACTION_POLICIES.map((entry) => entry.kind)) &&
    EXECUTIVE_INTERACTION_POLICIES.every(
      (entry) =>
        entry.requiresContext === true &&
        entry.eligibleSurfaces.length ===
          EXECUTIVE_INTERACTION_BINDING_SURFACES.length &&
        EXECUTIVE_INTERACTION_BINDING_KINDS.includes(entry.kind),
    );

  const subjectRequirementConsistent =
    getExecutiveInteractionPolicy("select")?.requiresSubject === true &&
    getExecutiveInteractionPolicy("focus")?.requiresSubject === true &&
    getExecutiveInteractionPolicy("activate")?.requiresSubject === true &&
    getExecutiveInteractionPolicy("expand")?.requiresSubject === true &&
    getExecutiveInteractionPolicy("collapse")?.requiresSubject === true &&
    getExecutiveInteractionPolicy("open")?.requiresSubject === false &&
    getExecutiveInteractionPolicy("close")?.requiresSubject === false &&
    getExecutiveInteractionPolicy("dismiss")?.requiresSubject === false;

  const surfaceCompatibilityConsistent =
    EXECUTIVE_INTERACTION_POLICIES.every((entry) =>
      exactOrder(
        [...entry.eligibleSurfaces],
        [...EXECUTIVE_INTERACTION_BINDING_SURFACES],
      ),
    );

  const statusesOk = exactOrder(EXECUTIVE_INTERACTION_BINDING_STATUSES, [
    "bound",
    "rejected",
    "noop",
  ]);

  const issueCodesOk =
    exactOrder(EXECUTIVE_INTERACTION_BINDING_ISSUE_CODES, [
      "INVALID_INTERACTION",
      "INVALID_INTERACTION_ID",
      "INVALID_INTERACTION_KIND",
      "INVALID_SURFACE",
      "INVALID_SUBJECT",
      "SUBJECT_REQUIRED",
      "CONTEXT_REQUIRED",
      "CONTEXT_SURFACE_MISMATCH",
      "INVALID_CORRELATION",
      "DUPLICATE_INTERACTION_ID",
      "UNSUPPORTED_INTERACTION",
    ]) && unique([...EXECUTIVE_INTERACTION_BINDING_ISSUE_CODES]);

  const guaranteesOk =
    EXECUTIVE_INTERACTION_BINDING_GUARANTEES.length === 22 &&
    unique(
      EXECUTIVE_INTERACTION_BINDING_GUARANTEES.map((entry) => entry.id),
    ) &&
    EXECUTIVE_INTERACTION_BINDING_GUARANTEES.every(
      (entry, index) => entry.order === index + 1,
    );

  const requestDirectionValid =
    layer.requestDirection === "ex-to-dri" &&
    layer.requestKind === "context-interaction";

  const registryIntegrityOk =
    registry.interactionKindCount ===
      EXECUTIVE_INTERACTION_BINDING_KINDS.length &&
    registry.policyCount === EXECUTIVE_INTERACTION_POLICIES.length &&
    registry.statusCount === EXECUTIVE_INTERACTION_BINDING_STATUSES.length &&
    registry.issueCodeCount ===
      EXECUTIVE_INTERACTION_BINDING_ISSUE_CODES.length &&
    registry.guaranteeCount ===
      EXECUTIVE_INTERACTION_BINDING_GUARANTEES.length &&
    registry.validatorCount ===
      executiveExperienceDirectorRuntimeInteractionBindingValidatorNames
        .length &&
    registry.registrySectionCount ===
      EXECUTIVE_INTERACTION_BINDING_REGISTRY_SECTIONS.length &&
    registry.publicTypeCount ===
      EXECUTIVE_INTERACTION_BINDING_PUBLIC_TYPE_NAMES.length &&
    registry.publicApiCount ===
      executiveExperienceDirectorRuntimeInteractionBindingApiNames.length &&
    exactOrder(
      [...EXECUTIVE_INTERACTION_BINDING_REGISTRY_SECTIONS],
      [
        "Identity",
        "InteractionKinds",
        "InteractionPolicies",
        "Binding",
        "BatchBinding",
        "Validation",
        "IssueCodes",
        "Guarantees",
        "Compatibility",
      ],
    );

  const immutabilityOk =
    Object.isFrozen(layer) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(
      executiveExperienceDirectorRuntimeInteractionBindingCanonicalIdentity,
    ) &&
    Object.isFrozen(EXECUTIVE_INTERACTION_BINDING_KINDS) &&
    Object.isFrozen(EXECUTIVE_INTERACTION_BINDING_SURFACES) &&
    Object.isFrozen(EXECUTIVE_INTERACTION_BINDING_STATUSES) &&
    Object.isFrozen(EXECUTIVE_INTERACTION_POLICIES) &&
    Object.isFrozen(EXECUTIVE_INTERACTION_BINDING_ISSUE_CODES) &&
    Object.isFrozen(EXECUTIVE_INTERACTION_BINDING_GUARANTEES) &&
    Object.isFrozen(EXECUTIVE_INTERACTION_BINDING_REGISTRY_SECTIONS) &&
    EXECUTIVE_INTERACTION_POLICIES.every((entry) => Object.isFrozen(entry));

  const contextStateBindingBoundaryIntact =
    layer.upstreamDependency ===
      "EX-DRI-3/ExecutiveExperienceDirectorRuntimeContextStateBinding" &&
    layer.contextStateBindingBoundary ===
      "EX-DRI-3-context-state-binding-only";

  const frameworkIndependent =
    layer.frameworkIndependent === true &&
    layer.rendererIndependent === true &&
    layer.browserIndependent === true &&
    layer.stateless === true;

  const ok =
    identityOk &&
    dependencyOk &&
    kindsOk &&
    policyOk &&
    subjectRequirementConsistent &&
    surfaceCompatibilityConsistent &&
    statusesOk &&
    issueCodesOk &&
    guaranteesOk &&
    requestDirectionValid &&
    registryIntegrityOk &&
    immutabilityOk &&
    contextStateBindingBoundaryIntact &&
    frameworkIndependent &&
    layer.principle === EXECUTIVE_INTERACTION_BINDING_PRINCIPLE;

  return Object.freeze({
    ok,
    identity:
      executiveExperienceDirectorRuntimeInteractionBindingIdentity,
    version:
      executiveExperienceDirectorRuntimeInteractionBindingVersion,
    namespace:
      executiveExperienceDirectorRuntimeInteractionBindingNamespace,
    role: executiveExperienceDirectorRuntimeInteractionBindingRole,
    dependencyIdentity:
      executiveExperienceDirectorRuntimeInteractionBindingDependencyIdentity,
    interactionKindCount: EXECUTIVE_INTERACTION_BINDING_KINDS.length,
    policyCount: EXECUTIVE_INTERACTION_POLICIES.length,
    statusCount: EXECUTIVE_INTERACTION_BINDING_STATUSES.length,
    issueCodeCount: EXECUTIVE_INTERACTION_BINDING_ISSUE_CODES.length,
    guaranteeCount: EXECUTIVE_INTERACTION_BINDING_GUARANTEES.length,
    validatorCount:
      executiveExperienceDirectorRuntimeInteractionBindingValidatorNames
        .length,
    registrySectionCount:
      EXECUTIVE_INTERACTION_BINDING_REGISTRY_SECTIONS.length,
    publicTypeCount: EXECUTIVE_INTERACTION_BINDING_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      executiveExperienceDirectorRuntimeInteractionBindingApiNames.length,
    frozen: immutabilityOk,
    contextStateBindingBoundaryIntact,
    frameworkIndependent,
    requestDirectionValid,
    subjectRequirementConsistent,
    surfaceCompatibilityConsistent,
  });
}
