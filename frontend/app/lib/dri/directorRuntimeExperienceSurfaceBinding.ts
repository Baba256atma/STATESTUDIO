/**
 * DRI-8:3 — Director Runtime Experience Surface Binding.
 *
 * Maps a validated Director Runtime Consumer Context onto approved semantic
 * Executive Experience surfaces. Answers WHERE context belongs — never HOW
 * it is rendered, projected as presentation state, or orchestrated.
 *
 * Principle: DRI-8:2 knows the context. DRI-8:3 knows which surface receives
 * which part of that context.
 */

import {
  directorRuntimeConsumerContextBindingIdentity,
  directorRuntimeConsumerContextBindingRegistry,
  validateDirectorRuntimeConsumerContext,
  type DirectorRuntimeConsumerAttentionContext,
  type DirectorRuntimeConsumerContext,
  type DirectorRuntimeConsumerContextField,
  type DirectorRuntimeConsumerContextMode,
  type DirectorRuntimeConsumerContextScope,
  type DirectorRuntimeConsumerGuidanceContext,
  type DirectorRuntimeConsumerPackReference,
  type DirectorRuntimeConsumerSubject,
  type DirectorRuntimeConsumerTemporalContext,
} from "@/app/lib/dri/directorRuntimeConsumerContextBinding";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeExperienceSurfaceBindingIdentity =
  "DRI-8:3/DirectorRuntimeExperienceSurfaceBinding" as const;
export const directorRuntimeExperienceSurfaceBindingVersion = "8.3.0" as const;
export const directorRuntimeExperienceSurfaceBindingNamespace =
  "nexora.dri.consumer-integration.experience-surface-binding" as const;
export const directorRuntimeExperienceSurfaceBindingUpstream =
  directorRuntimeConsumerContextBindingIdentity;

export const directorRuntimeExperienceSurfaceBindingCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeExperienceSurfaceBindingIdentity,
    version: directorRuntimeExperienceSurfaceBindingVersion,
    namespace: directorRuntimeExperienceSurfaceBindingNamespace,
    upstream: directorRuntimeExperienceSurfaceBindingUpstream,
  });

// ─── Surfaces (canonical order from DRI-8:2 public registry) ────────────────

/** Canonical experience surfaces — same identity/order as upstream DRI-8 chain. */
export const DIRECTOR_RUNTIME_EXPERIENCE_SURFACES =
  directorRuntimeConsumerContextBindingRegistry.experienceSurfaces;

export type DirectorRuntimeExperienceSurface =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_SURFACES)[number];

export function isDirectorRuntimeExperienceSurface(
  value: unknown,
): value is DirectorRuntimeExperienceSurface {
  return (DIRECTOR_RUNTIME_EXPERIENCE_SURFACES as readonly unknown[]).includes(
    value,
  );
}

// ─── Binding status / activation / availability ─────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_STATUSES =
  Object.freeze([
    "bound",
    "partially-bound",
    "inactive",
    "unavailable",
    "invalid",
  ] as const);
export type DirectorRuntimeExperienceSurfaceBindingStatus =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_STATUSES)[number];

export const DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_ACTIVATION_STATES =
  Object.freeze(["active", "inactive"] as const);
export type DirectorRuntimeExperienceSurfaceActivation =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_ACTIVATION_STATES)[number];

export const DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_AVAILABILITY_STATES =
  Object.freeze(["available", "partial", "unavailable"] as const);
export type DirectorRuntimeExperienceSurfaceAvailability =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_AVAILABILITY_STATES)[number];

// ─── Surface binding capabilities ───────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_CAPABILITIES =
  Object.freeze([
    "context",
    "scene",
    "presentation",
    "attention",
    "interaction",
    "guidance",
    "state",
    "focus",
    "selection",
    "relationships",
    "temporal",
    "pack",
    "subject",
    "availability",
  ] as const);
export type DirectorRuntimeExperienceSurfaceBindingCapability =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_CAPABILITIES)[number];

export type DirectorRuntimeExperienceSurfaceCapabilityMatrix = Readonly<{
  readonly [K in DirectorRuntimeExperienceSurface]: ReadonlyArray<
    DirectorRuntimeExperienceSurfaceBindingCapability
  >;
}>;

/** Immutable capability matrix — semantic eligibility only. */
export const DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITY_MATRIX =
  Object.freeze({
    stage: Object.freeze([
      "context",
      "scene",
      "presentation",
      "attention",
      "interaction",
    ] as const),
    advisor: Object.freeze([
      "context",
      "guidance",
      "attention",
      "interaction",
    ] as const),
    insight: Object.freeze([
      "context",
      "state",
      "attention",
      "guidance",
    ] as const),
    "live-lens": Object.freeze([
      "context",
      "scene",
      "focus",
      "selection",
      "relationships",
    ] as const),
    timeline: Object.freeze([
      "context",
      "temporal",
      "pack",
    ] as const),
    explorer: Object.freeze([
      "context",
      "subject",
      "relationships",
      "availability",
    ] as const),
  }) satisfies DirectorRuntimeExperienceSurfaceCapabilityMatrix;

// ─── Binding reasons ────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_REASONS =
  Object.freeze([
    "active-subject-relevant",
    "focus-relevant",
    "selection-relevant",
    "guidance-available",
    "temporal-context-available",
    "related-subjects-available",
    "attention-required",
    "pack-context-available",
    "goal-context-available",
    "no-relevant-context",
  ] as const);
export type DirectorRuntimeExperienceSurfaceBindingReason =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_REASONS)[number];

// ─── Diagnostics ────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_DIAGNOSTIC_KINDS =
  Object.freeze([
    "invalid-context",
    "unknown-surface",
    "unsupported-capability",
    "missing-required-context",
    "partial-context",
    "invalid-surface-binding",
  ] as const);
export type DirectorRuntimeExperienceSurfaceBindingDiagnosticKind =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_DIAGNOSTIC_KINDS)[number];

export interface DirectorRuntimeExperienceSurfaceBindingDiagnostic {
  readonly kind: DirectorRuntimeExperienceSurfaceBindingDiagnosticKind;
  readonly path: string;
  readonly message: string;
}

// ─── Guarantees ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_GUARANTEES =
  Object.freeze([
    "semantic-only",
    "framework-independent",
    "surface-scoped",
    "capability-controlled",
    "immutable",
    "deterministic",
    "non-mutating",
    "provenance-preserving",
    "no-rendering",
    "no-business-inference",
    "no-cross-surface-orchestration",
  ] as const);
export type DirectorRuntimeExperienceSurfaceBindingGuarantee =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_GUARANTEES)[number];

// ─── Provenance ─────────────────────────────────────────────────────────────

export interface DirectorRuntimeExperienceSurfaceBindingProvenance {
  readonly sourceContextIdentity: string;
  readonly contextBindingIdentity: string;
  readonly surfaceBindingIdentity: string;
  readonly surfaceIdentifier: DirectorRuntimeExperienceSurface | "aggregate";
}

export const DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_PROVENANCE_FIELDS =
  Object.freeze([
    "sourceContextIdentity",
    "contextBindingIdentity",
    "surfaceBindingIdentity",
    "surfaceIdentifier",
  ] as const);

// ─── Relevant (filtered) context ────────────────────────────────────────────

/**
 * Surface-scoped semantic context slice.
 * Only relevant known upstream fields — never invented domain values.
 */
export interface DirectorRuntimeExperienceSurfaceRelevantContext {
  readonly mode?: DirectorRuntimeConsumerContextMode;
  readonly activeSubject?: DirectorRuntimeConsumerSubject;
  readonly selectedSubject?: DirectorRuntimeConsumerSubject;
  readonly focusedSubject?: DirectorRuntimeConsumerSubject;
  readonly activeGoal?: DirectorRuntimeConsumerSubject;
  readonly activeObject?: DirectorRuntimeConsumerSubject;
  readonly activePack?: DirectorRuntimeConsumerPackReference;
  readonly temporal?: DirectorRuntimeConsumerTemporalContext;
  readonly attention?: DirectorRuntimeConsumerAttentionContext;
  readonly guidance?: DirectorRuntimeConsumerGuidanceContext;
}

export type DirectorRuntimeExperienceSurfaceContextField =
  keyof DirectorRuntimeExperienceSurfaceRelevantContext;

/** Which consumer-context fields each surface may consume. */
export const DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CONTEXT_FIELDS =
  Object.freeze({
    stage: Object.freeze([
      "activeSubject",
      "selectedSubject",
      "focusedSubject",
      "activeObject",
      "attention",
    ] as const),
    advisor: Object.freeze([
      "mode",
      "activeSubject",
      "activeGoal",
      "activeObject",
      "activePack",
      "guidance",
      "attention",
    ] as const),
    insight: Object.freeze([
      "activeSubject",
      "focusedSubject",
      "activeObject",
      "attention",
      "guidance",
    ] as const),
    "live-lens": Object.freeze([
      "activeSubject",
      "selectedSubject",
      "focusedSubject",
      "activeGoal",
      "activeObject",
      "activePack",
    ] as const),
    timeline: Object.freeze([
      "temporal",
      "activePack",
    ] as const),
    explorer: Object.freeze([
      "activeSubject",
      "activeObject",
      "activePack",
      "activeGoal",
    ] as const),
  } as const);

/**
 * A single known field is sufficient for bound status on these surfaces.
 * Explorer requires two known fields for bound (one ⇒ partially-bound).
 */
const SINGLE_FIELD_BOUND_KEYS = Object.freeze({
  stage: Object.freeze(["activeSubject", "attention"] as const),
  advisor: Object.freeze(["guidance", "attention"] as const),
  insight: Object.freeze(["attention", "guidance"] as const),
  "live-lens": Object.freeze(["activeSubject", "activeObject"] as const),
  timeline: Object.freeze(["temporal"] as const),
  explorer: Object.freeze([] as const),
} as const);

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeExperienceSurfaceBinding {
  readonly surface: DirectorRuntimeExperienceSurface;
  readonly status: DirectorRuntimeExperienceSurfaceBindingStatus;
  readonly activation: DirectorRuntimeExperienceSurfaceActivation;
  readonly contextScope: DirectorRuntimeConsumerContextScope;
  readonly activeSubject: DirectorRuntimeConsumerContextField<
    DirectorRuntimeConsumerSubject
  >;
  readonly capabilities: ReadonlyArray<
    DirectorRuntimeExperienceSurfaceBindingCapability
  >;
  readonly relevantContext: DirectorRuntimeExperienceSurfaceRelevantContext;
  readonly bindingReasons: ReadonlyArray<
    DirectorRuntimeExperienceSurfaceBindingReason
  >;
  readonly availability: DirectorRuntimeExperienceSurfaceAvailability;
  readonly provenance: DirectorRuntimeExperienceSurfaceBindingProvenance;
  /** Lightweight shared-subject references — not orchestration. */
  readonly sharedSubjectIds: ReadonlyArray<string>;
}

export interface DirectorRuntimeExperienceSurfaceBindingInput {
  readonly context: DirectorRuntimeConsumerContext;
}

export interface DirectorRuntimeExperienceSurfaceBindingResult {
  readonly bindings: ReadonlyArray<DirectorRuntimeExperienceSurfaceBinding>;
  readonly status: DirectorRuntimeExperienceSurfaceBindingStatus;
  readonly activeSurfaces: ReadonlyArray<DirectorRuntimeExperienceSurface>;
  readonly inactiveSurfaces: ReadonlyArray<DirectorRuntimeExperienceSurface>;
  readonly diagnostics: ReadonlyArray<
    DirectorRuntimeExperienceSurfaceBindingDiagnostic
  >;
  readonly provenance: DirectorRuntimeExperienceSurfaceBindingProvenance;
}

// ─── Membership helpers ─────────────────────────────────────────────────────

export function isDirectorRuntimeExperienceSurfaceBindingStatus(
  value: unknown,
): value is DirectorRuntimeExperienceSurfaceBindingStatus {
  return (
    DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExperienceSurfaceBindingCapability(
  value: unknown,
): value is DirectorRuntimeExperienceSurfaceBindingCapability {
  return (
    DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_CAPABILITIES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExperienceSurfaceBindingReason(
  value: unknown,
): value is DirectorRuntimeExperienceSurfaceBindingReason {
  return (
    DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_REASONS as readonly unknown[]
  ).includes(value);
}

// ─── Public list / identity APIs ────────────────────────────────────────────

export function getDirectorRuntimeExperienceSurfaceBindingIdentity():
  typeof directorRuntimeExperienceSurfaceBindingCanonicalIdentity {
  return directorRuntimeExperienceSurfaceBindingCanonicalIdentity;
}

export function listDirectorRuntimeExperienceSurfaces():
  ReadonlyArray<DirectorRuntimeExperienceSurface> {
  return DIRECTOR_RUNTIME_EXPERIENCE_SURFACES;
}

export function listDirectorRuntimeExperienceSurfaceBindingStatuses():
  ReadonlyArray<DirectorRuntimeExperienceSurfaceBindingStatus> {
  return DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_STATUSES;
}

export function getDirectorRuntimeExperienceSurfaceCapabilities(
  surface: DirectorRuntimeExperienceSurface,
): ReadonlyArray<DirectorRuntimeExperienceSurfaceBindingCapability> {
  if (!isDirectorRuntimeExperienceSurface(surface)) {
    throw new TypeError("surface must be a known experience surface");
  }
  return DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITY_MATRIX[surface];
}

// ─── Internal helpers ───────────────────────────────────────────────────────

function diagnostic(
  kind: DirectorRuntimeExperienceSurfaceBindingDiagnosticKind,
  path: string,
  message: string,
): DirectorRuntimeExperienceSurfaceBindingDiagnostic {
  return Object.freeze({ kind, path, message });
}

function isKnownField<T>(
  field: DirectorRuntimeConsumerContextField<T>,
): field is Readonly<{ readonly presence: "known"; readonly value: T }> {
  return field.presence === "known";
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function freezeSubject(
  subject: DirectorRuntimeConsumerSubject,
): DirectorRuntimeConsumerSubject {
  if (subject.label !== undefined) {
    return Object.freeze({
      kind: subject.kind,
      id: subject.id,
      label: subject.label,
    });
  }
  return Object.freeze({ kind: subject.kind, id: subject.id });
}

function cloneKnownValue<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    return Object.freeze([...value]) as T;
  }
  return Object.freeze({ ...(value as Record<string, unknown>) }) as T;
}

function contextHasUsableFields(context: DirectorRuntimeConsumerContext): boolean {
  return (
    isKnownField(context.mode) ||
    isKnownField(context.activeSubject) ||
    isKnownField(context.selectedSubject) ||
    isKnownField(context.focusedSubject) ||
    isKnownField(context.activeGoal) ||
    isKnownField(context.activeObject) ||
    isKnownField(context.activePack) ||
    isKnownField(context.temporal) ||
    isKnownField(context.attention) ||
    isKnownField(context.guidance)
  );
}

function isStructurallyValidContext(
  value: unknown,
): value is DirectorRuntimeConsumerContext {
  if (!isPlainObject(value)) return false;
  if (!isNonEmptyString(value.contextId)) return false;
  if (!isPlainObject(value.consumer)) return false;
  if (!isNonEmptyString(value.consumer.consumerId)) return false;
  if (!isNonEmptyString(value.scope)) return false;
  if (!isPlainObject(value.provenance)) return false;
  if (!isNonEmptyString(value.provenance.sourceIdentity)) return false;
  if (!isNonEmptyString(value.provenance.bindingIdentity)) return false;
  return true;
}

function filterRelevantContext(
  context: DirectorRuntimeConsumerContext,
  surface: DirectorRuntimeExperienceSurface,
): {
  readonly relevantContext: DirectorRuntimeExperienceSurfaceRelevantContext;
  readonly knownKeys: ReadonlyArray<DirectorRuntimeExperienceSurfaceContextField>;
} {
  const allowed = DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CONTEXT_FIELDS[surface];
  const slice: {
    -readonly [K in DirectorRuntimeExperienceSurfaceContextField]?:
      DirectorRuntimeExperienceSurfaceRelevantContext[K];
  } = {};
  const knownKeys: DirectorRuntimeExperienceSurfaceContextField[] = [];

  for (const key of allowed) {
    const field = context[key] as DirectorRuntimeConsumerContextField<unknown>;
    if (isKnownField(field)) {
      slice[key] = cloneKnownValue(field.value) as never;
      knownKeys.push(key);
    }
  }

  return {
    relevantContext: Object.freeze({ ...slice }),
    knownKeys: Object.freeze([...knownKeys]),
  };
}

function deriveBindingReasons(
  knownKeys: ReadonlyArray<DirectorRuntimeExperienceSurfaceContextField>,
): ReadonlyArray<DirectorRuntimeExperienceSurfaceBindingReason> {
  if (knownKeys.length === 0) {
    return Object.freeze(["no-relevant-context"] as const);
  }
  const reasons: DirectorRuntimeExperienceSurfaceBindingReason[] = [];
  if (knownKeys.includes("activeSubject") || knownKeys.includes("activeObject")) {
    reasons.push("active-subject-relevant");
  }
  if (knownKeys.includes("focusedSubject")) {
    reasons.push("focus-relevant");
  }
  if (knownKeys.includes("selectedSubject")) {
    reasons.push("selection-relevant");
  }
  if (knownKeys.includes("guidance")) {
    reasons.push("guidance-available");
  }
  if (knownKeys.includes("temporal")) {
    reasons.push("temporal-context-available");
  }
  if (knownKeys.includes("activePack") || knownKeys.includes("activeGoal")) {
    if (knownKeys.includes("activePack")) reasons.push("pack-context-available");
    if (knownKeys.includes("activeGoal")) reasons.push("goal-context-available");
  }
  if (
    knownKeys.includes("activeGoal") ||
    knownKeys.includes("activeObject") ||
    knownKeys.includes("activePack")
  ) {
    if (
      [knownKeys.includes("activeGoal"), knownKeys.includes("activeObject"), knownKeys.includes("activePack")]
        .filter(Boolean).length >= 2
    ) {
      reasons.push("related-subjects-available");
    }
  }
  if (knownKeys.includes("attention")) {
    reasons.push("attention-required");
  }
  return Object.freeze([...new Set(reasons)]);
}

function deriveSurfaceStatus(
  surface: DirectorRuntimeExperienceSurface,
  knownKeys: ReadonlyArray<DirectorRuntimeExperienceSurfaceContextField>,
  context: DirectorRuntimeConsumerContext,
): {
  readonly status: DirectorRuntimeExperienceSurfaceBindingStatus;
  readonly activation: DirectorRuntimeExperienceSurfaceActivation;
  readonly availability: DirectorRuntimeExperienceSurfaceAvailability;
} {
  const knownCount = knownKeys.length;
  if (knownCount === 0) {
    if (context.availability === "unavailable" || !contextHasUsableFields(context)) {
      return {
        status: "unavailable",
        activation: "inactive",
        availability: "unavailable",
      };
    }
    return {
      status: "inactive",
      activation: "inactive",
      availability: "unavailable",
    };
  }

  const singleKeys = SINGLE_FIELD_BOUND_KEYS[surface] as readonly string[];
  const hasSingleSufficient = knownKeys.some((key) =>
    singleKeys.includes(key));
  const bound = knownCount >= 2 || (knownCount >= 1 && hasSingleSufficient);

  if (bound) {
    return {
      status: "bound",
      activation: "active",
      availability: knownCount >= 2 ? "available" : "partial",
    };
  }

  return {
    status: "partially-bound",
    activation: "active",
    availability: "partial",
  };
}

function collectSharedSubjectIds(
  relevant: DirectorRuntimeExperienceSurfaceRelevantContext,
): ReadonlyArray<string> {
  const ids: string[] = [];
  for (const key of [
    "activeSubject",
    "selectedSubject",
    "focusedSubject",
    "activeGoal",
    "activeObject",
  ] as const) {
    const subject = relevant[key];
    if (subject !== undefined && isNonEmptyString(subject.id)) {
      ids.push(subject.id);
    }
  }
  if (
    relevant.activePack !== undefined &&
    isNonEmptyString(relevant.activePack.packId)
  ) {
    ids.push(relevant.activePack.packId);
  }
  return Object.freeze([...new Set(ids)]);
}

function buildSurfaceProvenance(
  context: DirectorRuntimeConsumerContext,
  surface: DirectorRuntimeExperienceSurface | "aggregate",
): DirectorRuntimeExperienceSurfaceBindingProvenance {
  return Object.freeze({
    sourceContextIdentity: context.contextId,
    contextBindingIdentity: context.provenance.bindingIdentity,
    surfaceBindingIdentity: directorRuntimeExperienceSurfaceBindingIdentity,
    surfaceIdentifier: surface,
  });
}

function bindSingleSurface(
  context: DirectorRuntimeConsumerContext,
  surface: DirectorRuntimeExperienceSurface,
): DirectorRuntimeExperienceSurfaceBinding {
  const { relevantContext, knownKeys } = filterRelevantContext(context, surface);
  const { status, activation, availability } = deriveSurfaceStatus(
    surface,
    knownKeys,
    context,
  );
  const bindingReasons = deriveBindingReasons(knownKeys);
  const activeSubject = isKnownField(context.activeSubject)
    ? Object.freeze({
      presence: "known" as const,
      value: freezeSubject(context.activeSubject.value),
    })
    : Object.freeze({ presence: "absent" as const });

  return Object.freeze({
    surface,
    status,
    activation,
    contextScope: context.scope,
    activeSubject,
    capabilities: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITY_MATRIX[surface],
    relevantContext,
    bindingReasons,
    availability,
    provenance: buildSurfaceProvenance(context, surface),
    sharedSubjectIds: collectSharedSubjectIds(relevantContext),
  });
}

function aggregateResultStatus(
  bindings: ReadonlyArray<DirectorRuntimeExperienceSurfaceBinding>,
  contextInvalid: boolean,
): DirectorRuntimeExperienceSurfaceBindingStatus {
  if (contextInvalid) return "invalid";
  if (bindings.some((entry) => entry.status === "bound")) return "bound";
  if (bindings.some((entry) => entry.status === "partially-bound")) {
    return "partially-bound";
  }
  if (bindings.every((entry) => entry.status === "unavailable")) {
    return "unavailable";
  }
  return "inactive";
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateDirectorRuntimeExperienceSurfaceBinding(
  binding: DirectorRuntimeExperienceSurfaceBinding,
): ReadonlyArray<DirectorRuntimeExperienceSurfaceBindingDiagnostic> {
  const diagnostics: DirectorRuntimeExperienceSurfaceBindingDiagnostic[] = [];

  if (!isDirectorRuntimeExperienceSurface(binding.surface)) {
    diagnostics.push(
      diagnostic(
        "unknown-surface",
        "surface",
        "surface is not a known experience surface",
      ),
    );
  }
  if (!isDirectorRuntimeExperienceSurfaceBindingStatus(binding.status)) {
    diagnostics.push(
      diagnostic(
        "invalid-surface-binding",
        "status",
        "status is not a known surface binding status",
      ),
    );
  }
  for (const capability of binding.capabilities) {
    if (!isDirectorRuntimeExperienceSurfaceBindingCapability(capability)) {
      diagnostics.push(
        diagnostic(
          "unsupported-capability",
          "capabilities",
          `unsupported capability: ${String(capability)}`,
        ),
      );
    }
  }
  const expected =
    DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITY_MATRIX[binding.surface];
  if (
    expected &&
    (binding.capabilities.length !== expected.length ||
      binding.capabilities.some((capability, index) =>
        capability !== expected[index]))
  ) {
    diagnostics.push(
      diagnostic(
        "unsupported-capability",
        "capabilities",
        "capabilities must match the canonical surface capability matrix",
      ),
    );
  }
  if (
    binding.status === "partially-bound" &&
    Object.keys(binding.relevantContext).length === 0
  ) {
    diagnostics.push(
      diagnostic(
        "partial-context",
        "relevantContext",
        "partially-bound surface has empty relevant context",
      ),
    );
  }
  if (
    (binding.status === "bound" || binding.status === "partially-bound") &&
    Object.keys(binding.relevantContext).length === 0
  ) {
    diagnostics.push(
      diagnostic(
        "missing-required-context",
        "relevantContext",
        "active surface binding requires relevant context",
      ),
    );
  }

  return Object.freeze([...diagnostics]);
}

// ─── Binding APIs ───────────────────────────────────────────────────────────

export function bindDirectorRuntimeExperienceSurfaces(
  context: DirectorRuntimeConsumerContext,
): DirectorRuntimeExperienceSurfaceBindingResult {
  const diagnostics: DirectorRuntimeExperienceSurfaceBindingDiagnostic[] = [];

  if (!isStructurallyValidContext(context)) {
    const provenance = Object.freeze({
      sourceContextIdentity: "invalid",
      contextBindingIdentity:
        directorRuntimeConsumerContextBindingIdentity,
      surfaceBindingIdentity: directorRuntimeExperienceSurfaceBindingIdentity,
      surfaceIdentifier: "aggregate" as const,
    });
    diagnostics.push(
      diagnostic(
        "invalid-context",
        "context",
        "consumer context is structurally invalid",
      ),
    );
    return Object.freeze({
      bindings: Object.freeze([]),
      status: "invalid" as const,
      activeSurfaces: Object.freeze([]),
      inactiveSurfaces: Object.freeze([
        ...DIRECTOR_RUNTIME_EXPERIENCE_SURFACES,
      ]),
      diagnostics: Object.freeze([...diagnostics]),
      provenance,
    });
  }

  const contextDiagnostics = validateDirectorRuntimeConsumerContext(context);
  const blocking = contextDiagnostics.some((entry) =>
    entry.kind === "invalid-consumer" ||
    entry.kind === "unsupported-scope" ||
    entry.kind === "kind-mismatch" ||
    entry.kind === "invalid-subject-reference");

  if (blocking) {
    diagnostics.push(
      diagnostic(
        "invalid-context",
        "context",
        "consumer context failed upstream validation",
      ),
    );
    for (const entry of contextDiagnostics) {
      diagnostics.push(
        diagnostic(
          "invalid-context",
          entry.path,
          entry.message,
        ),
      );
    }
    return Object.freeze({
      bindings: Object.freeze([]),
      status: "invalid" as const,
      activeSurfaces: Object.freeze([]),
      inactiveSurfaces: Object.freeze([
        ...DIRECTOR_RUNTIME_EXPERIENCE_SURFACES,
      ]),
      diagnostics: Object.freeze([...diagnostics]),
      provenance: buildSurfaceProvenance(context, "aggregate"),
    });
  }

  const bindings = Object.freeze(
    DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.map((surface) =>
      bindSingleSurface(context, surface)),
  );

  for (const binding of bindings) {
    const bindingDiagnostics = validateDirectorRuntimeExperienceSurfaceBinding(
      binding,
    );
    for (const entry of bindingDiagnostics) {
      diagnostics.push(entry);
    }
    if (
      binding.status === "partially-bound" &&
      !diagnostics.some((entry) =>
        entry.kind === "partial-context" &&
        entry.path === `${binding.surface}.relevantContext`)
    ) {
      diagnostics.push(
        diagnostic(
          "partial-context",
          `${binding.surface}.relevantContext`,
          `${binding.surface} is partially bound`,
        ),
      );
    }
  }

  const activeSurfaces = Object.freeze(
    bindings
      .filter((entry) => entry.activation === "active")
      .map((entry) => entry.surface),
  );
  const inactiveSurfaces = Object.freeze(
    bindings
      .filter((entry) => entry.activation === "inactive")
      .map((entry) => entry.surface),
  );

  return Object.freeze({
    bindings,
    status: aggregateResultStatus(bindings, false),
    activeSurfaces,
    inactiveSurfaces,
    diagnostics: Object.freeze([...diagnostics]),
    provenance: buildSurfaceProvenance(context, "aggregate"),
  });
}

/**
 * Resolve one surface. Same semantic result as the matching entry from
 * bindDirectorRuntimeExperienceSurfaces(context).
 */
export function resolveDirectorRuntimeExperienceSurfaceBinding(
  context: DirectorRuntimeConsumerContext,
  surface: DirectorRuntimeExperienceSurface,
): DirectorRuntimeExperienceSurfaceBinding | null {
  if (!isDirectorRuntimeExperienceSurface(surface)) {
    return null;
  }
  const result = bindDirectorRuntimeExperienceSurfaces(context);
  if (result.status === "invalid") return null;
  return result.bindings.find((entry) => entry.surface === surface) ?? null;
}

export function bindDirectorRuntimeExperienceSurfacesFromInput(
  input: DirectorRuntimeExperienceSurfaceBindingInput,
): DirectorRuntimeExperienceSurfaceBindingResult {
  return bindDirectorRuntimeExperienceSurfaces(input.context);
}

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeExperienceSurfaceBindingApiNames = Object.freeze([
  "getDirectorRuntimeExperienceSurfaceBindingIdentity",
  "listDirectorRuntimeExperienceSurfaces",
  "listDirectorRuntimeExperienceSurfaceBindingStatuses",
  "getDirectorRuntimeExperienceSurfaceCapabilities",
  "isDirectorRuntimeExperienceSurface",
  "isDirectorRuntimeExperienceSurfaceBindingStatus",
  "isDirectorRuntimeExperienceSurfaceBindingCapability",
  "isDirectorRuntimeExperienceSurfaceBindingReason",
  "bindDirectorRuntimeExperienceSurfaces",
  "bindDirectorRuntimeExperienceSurfacesFromInput",
  "resolveDirectorRuntimeExperienceSurfaceBinding",
  "validateDirectorRuntimeExperienceSurfaceBinding",
  "verifyDirectorRuntimeExperienceSurfaceBinding",
] as const);

export const DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_REGISTRY_SECTIONS =
  Object.freeze([
    "identity",
    "dependency",
    "surfaces",
    "binding-statuses",
    "availability-states",
    "surface-capabilities",
    "binding-reasons",
    "diagnostics",
    "provenance",
    "guarantees",
  ] as const);

function countMatrixCapabilities(): number {
  return DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.reduce(
    (total, surface) =>
      total +
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITY_MATRIX[surface].length,
    0,
  );
}

export const directorRuntimeExperienceSurfaceBindingRegistry = Object.freeze({
  identity: directorRuntimeExperienceSurfaceBindingIdentity,
  version: directorRuntimeExperienceSurfaceBindingVersion,
  namespace: directorRuntimeExperienceSurfaceBindingNamespace,
  dependency: directorRuntimeExperienceSurfaceBindingUpstream,
  surfaces: DIRECTOR_RUNTIME_EXPERIENCE_SURFACES,
  surfaceCount: DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.length,
  bindingStatuses: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_STATUSES,
  bindingStatusCount:
    DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_STATUSES.length,
  availabilityStates: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_AVAILABILITY_STATES,
  availabilityStateCount:
    DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_AVAILABILITY_STATES.length,
  activationStates: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_ACTIVATION_STATES,
  activationStateCount:
    DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_ACTIVATION_STATES.length,
  surfaceCapabilities: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_CAPABILITIES,
  surfaceCapabilityKindCount:
    DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_CAPABILITIES.length,
  capabilityMatrix: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITY_MATRIX,
  capabilityMatrixEntryCount: countMatrixCapabilities(),
  bindingReasons: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_REASONS,
  bindingReasonCount: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_REASONS.length,
  diagnosticKinds: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_DIAGNOSTIC_KINDS,
  diagnosticKindCount:
    DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_DIAGNOSTIC_KINDS.length,
  provenanceFields:
    DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_PROVENANCE_FIELDS,
  provenanceFieldCount:
    DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_PROVENANCE_FIELDS.length,
  guarantees: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_GUARANTEES,
  guaranteeCount: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_GUARANTEES.length,
  registrySections:
    DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_REGISTRY_SECTIONS,
  registrySectionCount:
    DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_REGISTRY_SECTIONS.length,
  publicApis: directorRuntimeExperienceSurfaceBindingApiNames,
  publicApiCount: directorRuntimeExperienceSurfaceBindingApiNames.length,
  contextFieldMatrix: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CONTEXT_FIELDS,
});

export const directorRuntimeExperienceSurfaceBinding = Object.freeze({
  phase: "DRI-8:3" as const,
  name: "DirectorRuntimeExperienceSurfaceBinding" as const,
  identity: directorRuntimeExperienceSurfaceBindingIdentity,
  namespace: directorRuntimeExperienceSurfaceBindingNamespace,
  version: directorRuntimeExperienceSurfaceBindingVersion,
  layer: "DirectorRuntimeConsumerIntegration" as const,
  role: "ExperienceSurfaceBinding" as const,
  stage: "ExperienceSurfaceBinding" as const,
  status: "ExperienceSurfaceBindingReady" as const,
  upstreamDependency: directorRuntimeExperienceSurfaceBindingUpstream,
  deterministic: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  philosophy: "where-context-belongs-not-how-it-renders" as const,
  surfaces: DIRECTOR_RUNTIME_EXPERIENCE_SURFACES,
  bindingStatuses: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_STATUSES,
  availabilityStates: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_AVAILABILITY_STATES,
  capabilityMatrix: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITY_MATRIX,
  bindingReasons: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_REASONS,
  diagnosticKinds: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_DIAGNOSTIC_KINDS,
  guarantees: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_GUARANTEES,
  publicApiSurface: directorRuntimeExperienceSurfaceBindingApiNames,
  registry: directorRuntimeExperienceSurfaceBindingRegistry,
  contextBindingBoundary: "DRI-8:2-context-binding-only" as const,
  architecturalStatus:
    "Experience Surface Binding Complete · Deterministic · Immutable · Framework-Independent · ReadyForExperienceStateProjection" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeExperienceSurfaceBindingVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeExperienceSurfaceBindingIdentity;
  readonly version: typeof directorRuntimeExperienceSurfaceBindingVersion;
  readonly namespace: typeof directorRuntimeExperienceSurfaceBindingNamespace;
  readonly dependency: typeof directorRuntimeExperienceSurfaceBindingUpstream;
  readonly surfaceCount: number;
  readonly bindingStatusCount: number;
  readonly availabilityStateCount: number;
  readonly surfaceCapabilityKindCount: number;
  readonly capabilityMatrixEntryCount: number;
  readonly bindingReasonCount: number;
  readonly diagnosticKindCount: number;
  readonly provenanceFieldCount: number;
  readonly guaranteeCount: number;
  readonly registrySectionCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly dri82BoundaryIntact: boolean;
  readonly frameworkIndependent: boolean;
  readonly capabilityMatrixValid: boolean;
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

function capabilityMatrixValid(): boolean {
  const capabilitySet = new Set<string>(
    DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_CAPABILITIES,
  );
  for (const surface of DIRECTOR_RUNTIME_EXPERIENCE_SURFACES) {
    const capabilities =
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITY_MATRIX[surface];
    if (!Object.isFrozen(capabilities)) return false;
    if (!unique(capabilities as readonly string[])) return false;
    for (const capability of capabilities) {
      if (!capabilitySet.has(capability)) return false;
    }
  }
  return (
    exactOrder(
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITY_MATRIX.stage,
      ["context", "scene", "presentation", "attention", "interaction"],
    ) &&
    exactOrder(
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITY_MATRIX.advisor,
      ["context", "guidance", "attention", "interaction"],
    ) &&
    exactOrder(
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITY_MATRIX.insight,
      ["context", "state", "attention", "guidance"],
    ) &&
    exactOrder(
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITY_MATRIX["live-lens"],
      ["context", "scene", "focus", "selection", "relationships"],
    ) &&
    exactOrder(
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITY_MATRIX.timeline,
      ["context", "temporal", "pack"],
    ) &&
    exactOrder(
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITY_MATRIX.explorer,
      ["context", "subject", "relationships", "availability"],
    )
  );
}

export function verifyDirectorRuntimeExperienceSurfaceBinding():
  DirectorRuntimeExperienceSurfaceBindingVerification {
  const binding = directorRuntimeExperienceSurfaceBinding;
  const registry = directorRuntimeExperienceSurfaceBindingRegistry;

  const identityOk =
    binding.identity === "DRI-8:3/DirectorRuntimeExperienceSurfaceBinding" &&
    binding.version === "8.3.0" &&
    binding.namespace ===
      "nexora.dri.consumer-integration.experience-surface-binding" &&
    binding.layer === "DirectorRuntimeConsumerIntegration" &&
    binding.role === "ExperienceSurfaceBinding" &&
    binding.upstreamDependency ===
      "DRI-8:2/DirectorRuntimeConsumerContextBinding" &&
    binding.upstreamDependency ===
      directorRuntimeConsumerContextBindingIdentity &&
    registry.dependency === binding.upstreamDependency &&
    binding.contextBindingBoundary === "DRI-8:2-context-binding-only";

  const surfacesOk =
    exactOrder(DIRECTOR_RUNTIME_EXPERIENCE_SURFACES, [
      "stage",
      "advisor",
      "insight",
      "live-lens",
      "timeline",
      "explorer",
    ]) &&
    DIRECTOR_RUNTIME_EXPERIENCE_SURFACES ===
      directorRuntimeConsumerContextBindingRegistry.experienceSurfaces &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_SURFACES]);

  const vocabularyOk =
    exactOrder(DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_STATUSES, [
      "bound",
      "partially-bound",
      "inactive",
      "unavailable",
      "invalid",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_AVAILABILITY_STATES, [
      "available",
      "partial",
      "unavailable",
    ]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_STATUSES]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_AVAILABILITY_STATES]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_CAPABILITIES]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_REASONS]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_DIAGNOSTIC_KINDS]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_GUARANTEES]);

  const matrixOk = capabilityMatrixValid();

  const registryOk =
    registry.surfaceCount === DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.length &&
    registry.bindingStatusCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_STATUSES.length &&
    registry.availabilityStateCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_AVAILABILITY_STATES.length &&
    registry.surfaceCapabilityKindCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_CAPABILITIES.length &&
    registry.capabilityMatrixEntryCount === countMatrixCapabilities() &&
    registry.bindingReasonCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_REASONS.length &&
    registry.diagnosticKindCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_DIAGNOSTIC_KINDS.length &&
    registry.provenanceFieldCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_PROVENANCE_FIELDS.length &&
    registry.guaranteeCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_GUARANTEES.length &&
    registry.registrySectionCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_REGISTRY_SECTIONS.length &&
    registry.publicApiCount ===
      directorRuntimeExperienceSurfaceBindingApiNames.length;

  const frozen =
    Object.isFrozen(binding) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(directorRuntimeExperienceSurfaceBindingCanonicalIdentity) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_SURFACES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_STATUSES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_AVAILABILITY_STATES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_CAPABILITIES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CAPABILITY_MATRIX) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_REASONS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_DIAGNOSTIC_KINDS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_GUARANTEES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_CONTEXT_FIELDS);

  const dri82BoundaryIntact =
    binding.upstreamDependency ===
      "DRI-8:2/DirectorRuntimeConsumerContextBinding" &&
    binding.contextBindingBoundary === "DRI-8:2-context-binding-only";

  const frameworkIndependent =
    binding.frameworkIndependent === true &&
    binding.rendererIndependent === true;

  const ok =
    identityOk &&
    surfacesOk &&
    vocabularyOk &&
    matrixOk &&
    registryOk &&
    frozen &&
    dri82BoundaryIntact &&
    frameworkIndependent;

  return Object.freeze({
    ok,
    identity: directorRuntimeExperienceSurfaceBindingIdentity,
    version: directorRuntimeExperienceSurfaceBindingVersion,
    namespace: directorRuntimeExperienceSurfaceBindingNamespace,
    dependency: directorRuntimeExperienceSurfaceBindingUpstream,
    surfaceCount: DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.length,
    bindingStatusCount:
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_STATUSES.length,
    availabilityStateCount:
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_AVAILABILITY_STATES.length,
    surfaceCapabilityKindCount:
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_CAPABILITIES.length,
    capabilityMatrixEntryCount: countMatrixCapabilities(),
    bindingReasonCount:
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_REASONS.length,
    diagnosticKindCount:
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_DIAGNOSTIC_KINDS.length,
    provenanceFieldCount:
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_PROVENANCE_FIELDS.length,
    guaranteeCount: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_GUARANTEES.length,
    registrySectionCount:
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_BINDING_REGISTRY_SECTIONS.length,
    publicApiCount: directorRuntimeExperienceSurfaceBindingApiNames.length,
    frozen,
    dri82BoundaryIntact,
    frameworkIndependent,
    capabilityMatrixValid: matrixOk,
  });
}
