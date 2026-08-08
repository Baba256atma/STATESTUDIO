/**
 * DRI-8:5 — Director Runtime Consumer Interaction Bridge.
 *
 * Bridges approved semantic consumer interactions into Director Runtime
 * interaction intents. Starts after UI adapters have already translated
 * browser/framework events into semantic interaction input.
 *
 * Principle: Browser/UI event ≠ Consumer semantic interaction ≠ Runtime intent.
 * DRI-8:5 owns only the middle-to-intent translation.
 */

import {
  directorRuntimeExperienceStateProjectionIdentity,
  directorRuntimeExperienceStateProjectionRegistry,
  isDirectorRuntimeExperienceInteractionReadiness,
  isDirectorRuntimeExperienceProjectionStatus,
  type DirectorRuntimeExperienceProjectedSubject,
  type DirectorRuntimeExperienceStateProjection,
  type DirectorRuntimeExperienceStateProjectionResult,
} from "@/app/lib/dri/directorRuntimeExperienceStateProjection";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeConsumerInteractionBridgeIdentity =
  "DRI-8:5/DirectorRuntimeConsumerInteractionBridge" as const;
export const directorRuntimeConsumerInteractionBridgeVersion = "8.5.0" as const;
export const directorRuntimeConsumerInteractionBridgeNamespace =
  "nexora.dri.consumer-integration.interaction-bridge" as const;
export const directorRuntimeConsumerInteractionBridgeUpstream =
  directorRuntimeExperienceStateProjectionIdentity;

export const directorRuntimeConsumerInteractionBridgeCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeConsumerInteractionBridgeIdentity,
    version: directorRuntimeConsumerInteractionBridgeVersion,
    namespace: directorRuntimeConsumerInteractionBridgeNamespace,
    upstream: directorRuntimeConsumerInteractionBridgeUpstream,
  });

// ─── Surfaces (canonical order via DRI-8:4 registry) ────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_SURFACES =
  directorRuntimeExperienceStateProjectionRegistry.surfaces;

export type DirectorRuntimeExperienceSurface =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_SURFACES)[number];

export function isDirectorRuntimeExperienceSurface(
  value: unknown,
): value is DirectorRuntimeExperienceSurface {
  return (DIRECTOR_RUNTIME_EXPERIENCE_SURFACES as readonly unknown[]).includes(
    value,
  );
}

// ─── Interaction kinds (canonical DRI-8:1 vocabulary literals) ──────────────

export const DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS = Object.freeze([
  "select",
  "focus",
  "activate",
  "hover",
  "navigate",
  "inspect",
  "dismiss",
] as const);
export type DirectorRuntimeConsumerInteractionKind =
  (typeof DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS)[number];

// ─── Bridge statuses ────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_STATUSES =
  Object.freeze([
    "bridged",
    "partially-bridged",
    "blocked",
    "unsupported",
    "invalid",
  ] as const);
export type DirectorRuntimeConsumerInteractionBridgeStatus =
  (typeof DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_STATUSES)[number];

// ─── Runtime intent kinds (semantic mapping targets) ────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_RUNTIME_INTENT_KINDS = Object.freeze([
  "selection",
  "focus",
  "activation",
  "lightweight-attention",
  "navigation",
  "inspection",
  "dismissal",
] as const);
export type DirectorRuntimeConsumerRuntimeIntentKind =
  (typeof DIRECTOR_RUNTIME_CONSUMER_RUNTIME_INTENT_KINDS)[number];

// ─── Interaction reasons ────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_INTERACTION_REASONS = Object.freeze([
  "user-selection",
  "user-focus",
  "user-inspection",
  "user-navigation",
  "user-activation",
  "user-dismissal",
  "user-lightweight-attention",
] as const);
export type DirectorRuntimeConsumerInteractionReason =
  (typeof DIRECTOR_RUNTIME_CONSUMER_INTERACTION_REASONS)[number];

// ─── Diagnostics ────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_DIAGNOSTIC_KINDS =
  Object.freeze([
    "invalid-interaction",
    "unsupported-interaction-kind",
    "unsupported-surface-interaction",
    "missing-subject",
    "missing-capability",
    "missing-navigation-target",
    "surface-unavailable",
    "interaction-disabled",
    "interaction-limited",
    "invalid-context-reference",
    "invalid-runtime-intent",
    "invalid-projection",
  ] as const);
export type DirectorRuntimeConsumerInteractionBridgeDiagnosticKind =
  (typeof DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_DIAGNOSTIC_KINDS)[number];

export interface DirectorRuntimeConsumerInteractionBridgeDiagnostic {
  readonly kind: DirectorRuntimeConsumerInteractionBridgeDiagnosticKind;
  readonly path: string;
  readonly message: string;
}

// ─── Guarantees ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_GUARANTEES =
  Object.freeze([
    "semantic-only",
    "framework-independent",
    "surface-aware",
    "interaction-readiness-aware",
    "capability-controlled",
    "immutable",
    "deterministic",
    "non-mutating",
    "identity-preserving",
    "provenance-preserving",
    "no-business-inference",
    "no-runtime-mutation",
    "no-rendering",
    "no-ui-events",
    "no-cross-surface-orchestration",
  ] as const);
export type DirectorRuntimeConsumerInteractionBridgeGuarantee =
  (typeof DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_GUARANTEES)[number];

// ─── Provenance ─────────────────────────────────────────────────────────────

export interface DirectorRuntimeConsumerInteractionBridgeProvenance {
  readonly sourceProjectionIdentity: string;
  readonly experienceStateProjectionIdentity: string;
  readonly interactionBridgeIdentity: string;
  readonly surfaceIdentifier: DirectorRuntimeExperienceSurface | "none";
  readonly interactionKind: DirectorRuntimeConsumerInteractionKind | "none";
}

export const DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_PROVENANCE_FIELDS =
  Object.freeze([
    "sourceProjectionIdentity",
    "experienceStateProjectionIdentity",
    "interactionBridgeIdentity",
    "surfaceIdentifier",
    "interactionKind",
  ] as const);

// ─── Subject / navigation / capability references ───────────────────────────

export type DirectorRuntimeConsumerInteractionSubject =
  DirectorRuntimeExperienceProjectedSubject;

export interface DirectorRuntimeConsumerNavigationTarget {
  readonly from?: DirectorRuntimeConsumerInteractionSubject;
  readonly to?: DirectorRuntimeConsumerInteractionSubject;
  readonly scope?: string;
}

export interface DirectorRuntimeConsumerCapabilityReference {
  readonly capabilityId: string;
  readonly label?: string;
}

// ─── Surface interaction capability matrix ──────────────────────────────────

export type DirectorRuntimeSurfaceInteractionCapabilityMatrix = Readonly<{
  readonly [K in DirectorRuntimeExperienceSurface]: ReadonlyArray<
    DirectorRuntimeConsumerInteractionKind
  >;
}>;

export const DIRECTOR_RUNTIME_SURFACE_INTERACTION_CAPABILITY_MATRIX =
  Object.freeze({
    stage: Object.freeze([
      "select",
      "focus",
      "activate",
      "hover",
      "inspect",
    ] as const),
    advisor: Object.freeze([
      "activate",
      "inspect",
      "dismiss",
      "navigate",
    ] as const),
    insight: Object.freeze([
      "select",
      "focus",
      "inspect",
      "navigate",
    ] as const),
    "live-lens": Object.freeze([
      "select",
      "focus",
      "navigate",
      "inspect",
    ] as const),
    timeline: Object.freeze([
      "select",
      "navigate",
      "inspect",
    ] as const),
    explorer: Object.freeze([
      "select",
      "navigate",
      "inspect",
      "activate",
    ] as const),
  }) satisfies DirectorRuntimeSurfaceInteractionCapabilityMatrix;

/**
 * Explicit kinds allowed when projection interactionReadiness = limited.
 * Activate/select/focus/navigate remain blocked under limited readiness.
 */
export const DIRECTOR_RUNTIME_LIMITED_INTERACTION_KINDS = Object.freeze([
  "inspect",
  "hover",
  "dismiss",
] as const);

// ─── Target requirements ────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_INTERACTION_TARGET_REQUIREMENTS = Object.freeze({
  select: Object.freeze({
    subjectRequired: true,
    capabilityRequired: false,
    navigationRequired: false,
  }),
  focus: Object.freeze({
    subjectRequired: true,
    capabilityRequired: false,
    navigationRequired: false,
  }),
  activate: Object.freeze({
    subjectRequired: false,
    capabilityRequired: true,
    navigationRequired: false,
  }),
  hover: Object.freeze({
    subjectRequired: true,
    capabilityRequired: false,
    navigationRequired: false,
  }),
  navigate: Object.freeze({
    subjectRequired: false,
    capabilityRequired: false,
    navigationRequired: true,
  }),
  inspect: Object.freeze({
    subjectRequired: true,
    capabilityRequired: false,
    navigationRequired: false,
  }),
  dismiss: Object.freeze({
    subjectRequired: false,
    capabilityRequired: false,
    navigationRequired: false,
  }),
} as const);

export type DirectorRuntimeInteractionTargetRequirementKind =
  keyof typeof DIRECTOR_RUNTIME_INTERACTION_TARGET_REQUIREMENTS;

// ─── Interaction → Runtime intent mapping ───────────────────────────────────

export const DIRECTOR_RUNTIME_INTERACTION_TO_INTENT_MAPPINGS = Object.freeze([
  Object.freeze({
    interactionKind: "select" as const,
    runtimeIntentKind: "selection" as const,
    reason: "user-selection" as const,
  }),
  Object.freeze({
    interactionKind: "focus" as const,
    runtimeIntentKind: "focus" as const,
    reason: "user-focus" as const,
  }),
  Object.freeze({
    interactionKind: "activate" as const,
    runtimeIntentKind: "activation" as const,
    reason: "user-activation" as const,
  }),
  Object.freeze({
    interactionKind: "hover" as const,
    runtimeIntentKind: "lightweight-attention" as const,
    reason: "user-lightweight-attention" as const,
  }),
  Object.freeze({
    interactionKind: "navigate" as const,
    runtimeIntentKind: "navigation" as const,
    reason: "user-navigation" as const,
  }),
  Object.freeze({
    interactionKind: "inspect" as const,
    runtimeIntentKind: "inspection" as const,
    reason: "user-inspection" as const,
  }),
  Object.freeze({
    interactionKind: "dismiss" as const,
    runtimeIntentKind: "dismissal" as const,
    reason: "user-dismissal" as const,
  }),
] as const);

// ─── Core contracts ─────────────────────────────────────────────────────────

export interface DirectorRuntimeConsumerInteraction {
  readonly interactionId: string;
  readonly kind: DirectorRuntimeConsumerInteractionKind;
  readonly surface: DirectorRuntimeExperienceSurface;
  readonly subject?: DirectorRuntimeConsumerInteractionSubject;
  readonly consumerId?: string;
  readonly scope?: string;
  readonly contextReference?: string;
  readonly capability?: DirectorRuntimeConsumerCapabilityReference;
  readonly navigation?: DirectorRuntimeConsumerNavigationTarget;
  readonly source: "consumer-experience";
  readonly metadata?: Readonly<Record<string, string>>;
}

export interface DirectorRuntimeConsumerInteractionBridgeInput {
  readonly interaction: DirectorRuntimeConsumerInteraction;
  readonly experienceState: DirectorRuntimeExperienceStateProjectionResult;
}

/**
 * Semantic Runtime intent — not a UI command and not Runtime mutation.
 */
export interface DirectorRuntimeConsumerInteractionIntent {
  readonly intentId: string;
  readonly kind: DirectorRuntimeConsumerRuntimeIntentKind;
  readonly surface: DirectorRuntimeExperienceSurface;
  readonly subject: DirectorRuntimeConsumerInteractionSubject | null;
  readonly scope?: string;
  readonly reason: DirectorRuntimeConsumerInteractionReason;
  readonly sourceInteraction: string;
  readonly contextReference?: string;
  readonly capability?: DirectorRuntimeConsumerCapabilityReference;
  readonly navigation?: DirectorRuntimeConsumerNavigationTarget;
}

export interface DirectorRuntimeConsumerInteractionBridgeResult {
  readonly status: DirectorRuntimeConsumerInteractionBridgeStatus;
  readonly interaction: DirectorRuntimeConsumerInteraction | null;
  readonly runtimeIntent: DirectorRuntimeConsumerInteractionIntent | null;
  readonly diagnostics: ReadonlyArray<
    DirectorRuntimeConsumerInteractionBridgeDiagnostic
  >;
  readonly provenance: DirectorRuntimeConsumerInteractionBridgeProvenance;
}

// ─── Membership helpers ─────────────────────────────────────────────────────

export function isDirectorRuntimeConsumerInteractionKind(
  value: unknown,
): value is DirectorRuntimeConsumerInteractionKind {
  return (DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS as readonly unknown[])
    .includes(value);
}

export function isDirectorRuntimeConsumerInteractionBridgeStatus(
  value: unknown,
): value is DirectorRuntimeConsumerInteractionBridgeStatus {
  return (
    DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeConsumerRuntimeIntentKind(
  value: unknown,
): value is DirectorRuntimeConsumerRuntimeIntentKind {
  return (
    DIRECTOR_RUNTIME_CONSUMER_RUNTIME_INTENT_KINDS as readonly unknown[]
  ).includes(value);
}

// ─── Public list / identity APIs ────────────────────────────────────────────

export function getDirectorRuntimeConsumerInteractionBridgeIdentity():
  typeof directorRuntimeConsumerInteractionBridgeCanonicalIdentity {
  return directorRuntimeConsumerInteractionBridgeCanonicalIdentity;
}

export function listDirectorRuntimeConsumerInteractionKinds():
  ReadonlyArray<DirectorRuntimeConsumerInteractionKind> {
  return DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS;
}

export function listDirectorRuntimeConsumerInteractionBridgeStatuses():
  ReadonlyArray<DirectorRuntimeConsumerInteractionBridgeStatus> {
  return DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_STATUSES;
}

export function getDirectorRuntimeSurfaceInteractionCapabilities(
  surface: DirectorRuntimeExperienceSurface,
): ReadonlyArray<DirectorRuntimeConsumerInteractionKind> {
  if (!isDirectorRuntimeExperienceSurface(surface)) {
    throw new TypeError("surface must be a known experience surface");
  }
  return DIRECTOR_RUNTIME_SURFACE_INTERACTION_CAPABILITY_MATRIX[surface];
}

export function isDirectorRuntimeConsumerInteractionSupported(
  surface: DirectorRuntimeExperienceSurface,
  interactionKind: DirectorRuntimeConsumerInteractionKind,
): boolean {
  if (!isDirectorRuntimeExperienceSurface(surface)) return false;
  if (!isDirectorRuntimeConsumerInteractionKind(interactionKind)) return false;
  return (
    DIRECTOR_RUNTIME_SURFACE_INTERACTION_CAPABILITY_MATRIX[surface] as readonly string[]
  ).includes(interactionKind);
}

// ─── Internal helpers ───────────────────────────────────────────────────────

function diagnostic(
  kind: DirectorRuntimeConsumerInteractionBridgeDiagnosticKind,
  path: string,
  message: string,
): DirectorRuntimeConsumerInteractionBridgeDiagnostic {
  return Object.freeze({ kind, path, message });
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
  subject: DirectorRuntimeConsumerInteractionSubject,
): DirectorRuntimeConsumerInteractionSubject {
  if (subject.label !== undefined) {
    return Object.freeze({
      kind: subject.kind,
      id: subject.id,
      label: subject.label,
    });
  }
  return Object.freeze({ kind: subject.kind, id: subject.id });
}

function freezeCapability(
  capability: DirectorRuntimeConsumerCapabilityReference,
): DirectorRuntimeConsumerCapabilityReference {
  if (capability.label !== undefined) {
    return Object.freeze({
      capabilityId: capability.capabilityId,
      label: capability.label,
    });
  }
  return Object.freeze({ capabilityId: capability.capabilityId });
}

function freezeNavigation(
  navigation: DirectorRuntimeConsumerNavigationTarget,
): DirectorRuntimeConsumerNavigationTarget {
  const result: {
    -readonly [K in keyof DirectorRuntimeConsumerNavigationTarget]?:
      DirectorRuntimeConsumerNavigationTarget[K];
  } = {};
  if (navigation.from !== undefined) {
    result.from = freezeSubject(navigation.from);
  }
  if (navigation.to !== undefined) {
    result.to = freezeSubject(navigation.to);
  }
  if (navigation.scope !== undefined) {
    result.scope = navigation.scope;
  }
  return Object.freeze({ ...result });
}

function freezeInteraction(
  interaction: DirectorRuntimeConsumerInteraction,
): DirectorRuntimeConsumerInteraction {
  const frozen: DirectorRuntimeConsumerInteraction = {
    interactionId: interaction.interactionId,
    kind: interaction.kind,
    surface: interaction.surface,
    source: "consumer-experience",
  };
  const withSubject =
    interaction.subject !== undefined
      ? { ...frozen, subject: freezeSubject(interaction.subject) }
      : frozen;
  const withConsumer =
    interaction.consumerId !== undefined
      ? { ...withSubject, consumerId: interaction.consumerId }
      : withSubject;
  const withScope =
    interaction.scope !== undefined
      ? { ...withConsumer, scope: interaction.scope }
      : withConsumer;
  const withContext =
    interaction.contextReference !== undefined
      ? { ...withScope, contextReference: interaction.contextReference }
      : withScope;
  const withCapability =
    interaction.capability !== undefined
      ? {
        ...withContext,
        capability: freezeCapability(interaction.capability),
      }
      : withContext;
  const withNavigation =
    interaction.navigation !== undefined
      ? {
        ...withCapability,
        navigation: freezeNavigation(interaction.navigation),
      }
      : withCapability;
  if (interaction.metadata !== undefined) {
    return Object.freeze({
      ...withNavigation,
      metadata: Object.freeze({ ...interaction.metadata }),
    });
  }
  return Object.freeze(withNavigation);
}

function mappingFor(
  kind: DirectorRuntimeConsumerInteractionKind,
): (typeof DIRECTOR_RUNTIME_INTERACTION_TO_INTENT_MAPPINGS)[number] {
  const mapping = DIRECTOR_RUNTIME_INTERACTION_TO_INTENT_MAPPINGS.find(
    (entry) => entry.interactionKind === kind,
  );
  if (mapping === undefined) {
    throw new TypeError(`missing intent mapping for ${kind}`);
  }
  return mapping;
}

function buildProvenance(
  interaction: DirectorRuntimeConsumerInteraction | null,
  projection: DirectorRuntimeExperienceStateProjection | null,
): DirectorRuntimeConsumerInteractionBridgeProvenance {
  return Object.freeze({
    sourceProjectionIdentity:
      projection?.provenance.sourceBindingIdentity ?? "none",
    experienceStateProjectionIdentity:
      directorRuntimeExperienceStateProjectionIdentity,
    interactionBridgeIdentity: directorRuntimeConsumerInteractionBridgeIdentity,
    surfaceIdentifier: interaction?.surface ?? "none",
    interactionKind: interaction?.kind ?? "none",
  });
}

function emptyResult(
  status: DirectorRuntimeConsumerInteractionBridgeStatus,
  diagnostics: ReadonlyArray<
    DirectorRuntimeConsumerInteractionBridgeDiagnostic
  >,
  interaction: DirectorRuntimeConsumerInteraction | null,
  projection: DirectorRuntimeExperienceStateProjection | null,
): DirectorRuntimeConsumerInteractionBridgeResult {
  return Object.freeze({
    status,
    interaction: interaction === null ? null : freezeInteraction(interaction),
    runtimeIntent: null,
    diagnostics: Object.freeze([...diagnostics]),
    provenance: buildProvenance(interaction, projection),
  });
}

function validateSubject(
  value: unknown,
  path: string,
  diagnostics: DirectorRuntimeConsumerInteractionBridgeDiagnostic[],
): DirectorRuntimeConsumerInteractionSubject | null {
  if (!isPlainObject(value)) {
    diagnostics.push(
      diagnostic(
        "invalid-interaction",
        path,
        "subject must be a plain object with kind and id",
      ),
    );
    return null;
  }
  if (!isNonEmptyString(value.kind) || !isNonEmptyString(value.id)) {
    diagnostics.push(
      diagnostic(
        "missing-subject",
        path,
        "subject requires non-empty kind and id",
      ),
    );
    return null;
  }
  const subject: DirectorRuntimeConsumerInteractionSubject = {
    kind: value.kind as DirectorRuntimeConsumerInteractionSubject["kind"],
    id: value.id,
  };
  if (value.label !== undefined) {
    if (typeof value.label !== "string") {
      diagnostics.push(
        diagnostic(
          "invalid-interaction",
          `${path}.label`,
          "subject label must be a string when provided",
        ),
      );
      return null;
    }
    return freezeSubject({ ...subject, label: value.label });
  }
  return freezeSubject(subject);
}

function findProjection(
  experienceState: DirectorRuntimeExperienceStateProjectionResult,
  surface: DirectorRuntimeExperienceSurface,
): DirectorRuntimeExperienceStateProjection | undefined {
  return experienceState.projections.find((entry) => entry.surface === surface);
}

function isStructurallyValidExperienceState(
  value: unknown,
): value is DirectorRuntimeExperienceStateProjectionResult {
  if (!isPlainObject(value)) return false;
  if (!Array.isArray(value.projections)) return false;
  if (!isDirectorRuntimeExperienceProjectionStatus(value.status)) return false;
  return true;
}

function navigationIsValid(
  navigation: DirectorRuntimeConsumerNavigationTarget | undefined,
): boolean {
  if (navigation === undefined) return false;
  return (
    navigation.to !== undefined ||
    navigation.from !== undefined ||
    isNonEmptyString(navigation.scope)
  );
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateDirectorRuntimeConsumerInteraction(
  interaction: DirectorRuntimeConsumerInteraction,
): ReadonlyArray<DirectorRuntimeConsumerInteractionBridgeDiagnostic> {
  const diagnostics: DirectorRuntimeConsumerInteractionBridgeDiagnostic[] = [];

  if (!isNonEmptyString(interaction.interactionId)) {
    diagnostics.push(
      diagnostic(
        "invalid-interaction",
        "interactionId",
        "interactionId must be a non-empty string",
      ),
    );
  }
  if (!isDirectorRuntimeConsumerInteractionKind(interaction.kind)) {
    diagnostics.push(
      diagnostic(
        "unsupported-interaction-kind",
        "kind",
        "interaction kind is not canonical",
      ),
    );
  }
  if (!isDirectorRuntimeExperienceSurface(interaction.surface)) {
    diagnostics.push(
      diagnostic(
        "invalid-interaction",
        "surface",
        "surface is not a known experience surface",
      ),
    );
  }
  if (interaction.source !== "consumer-experience") {
    diagnostics.push(
      diagnostic(
        "invalid-interaction",
        "source",
        "source must be consumer-experience",
      ),
    );
  }
  if (
    interaction.contextReference !== undefined &&
    !isNonEmptyString(interaction.contextReference)
  ) {
    diagnostics.push(
      diagnostic(
        "invalid-context-reference",
        "contextReference",
        "contextReference must be a non-empty string when provided",
      ),
    );
  }

  if (isDirectorRuntimeConsumerInteractionKind(interaction.kind)) {
    const requirements =
      DIRECTOR_RUNTIME_INTERACTION_TARGET_REQUIREMENTS[interaction.kind];
    if (requirements.subjectRequired && interaction.subject === undefined) {
      diagnostics.push(
        diagnostic(
          "missing-subject",
          "subject",
          `${interaction.kind} requires a subject`,
        ),
      );
    }
    if (
      requirements.capabilityRequired &&
      (interaction.capability === undefined ||
        !isNonEmptyString(interaction.capability.capabilityId))
    ) {
      diagnostics.push(
        diagnostic(
          "missing-capability",
          "capability",
          "activate requires a capability reference",
        ),
      );
    }
    if (
      requirements.navigationRequired &&
      !navigationIsValid(interaction.navigation)
    ) {
      diagnostics.push(
        diagnostic(
          "missing-navigation-target",
          "navigation",
          "navigate requires a semantic navigation target or scope",
        ),
      );
    }
  }

  if (interaction.subject !== undefined) {
    validateSubject(interaction.subject, "subject", diagnostics);
  }

  return Object.freeze([...diagnostics]);
}

// ─── Intent resolution / bridging ───────────────────────────────────────────

function buildRuntimeIntent(
  interaction: DirectorRuntimeConsumerInteraction,
): DirectorRuntimeConsumerInteractionIntent {
  const mapping = mappingFor(interaction.kind);
  const intent: DirectorRuntimeConsumerInteractionIntent = {
    intentId: `${interaction.interactionId}:${mapping.runtimeIntentKind}`,
    kind: mapping.runtimeIntentKind,
    surface: interaction.surface,
    subject:
      interaction.subject !== undefined
        ? freezeSubject(interaction.subject)
        : null,
    reason: mapping.reason,
    sourceInteraction: interaction.interactionId,
  };
  const withScope =
    interaction.scope !== undefined
      ? { ...intent, scope: interaction.scope }
      : intent;
  const withContext =
    interaction.contextReference !== undefined
      ? { ...withScope, contextReference: interaction.contextReference }
      : withScope;
  const withCapability =
    interaction.capability !== undefined
      ? {
        ...withContext,
        capability: freezeCapability(interaction.capability),
      }
      : withContext;
  if (interaction.navigation !== undefined) {
    return Object.freeze({
      ...withCapability,
      navigation: freezeNavigation(interaction.navigation),
    });
  }
  return Object.freeze(withCapability);
}

/**
 * Resolve the Runtime intent for a validated, allowed interaction.
 * Uses the same mapping registry as the bridge function.
 */
export function resolveDirectorRuntimeConsumerInteractionIntent(
  interaction: DirectorRuntimeConsumerInteraction,
): DirectorRuntimeConsumerInteractionIntent | null {
  const diagnostics = validateDirectorRuntimeConsumerInteraction(interaction);
  const blocking = diagnostics.some((entry) =>
    entry.kind === "invalid-interaction" ||
    entry.kind === "unsupported-interaction-kind" ||
    entry.kind === "missing-subject" ||
    entry.kind === "missing-capability" ||
    entry.kind === "missing-navigation-target");
  if (blocking) return null;
  if (!isDirectorRuntimeConsumerInteractionSupported(
    interaction.surface,
    interaction.kind,
  )) {
    return null;
  }
  return buildRuntimeIntent(interaction);
}

export function bridgeDirectorRuntimeConsumerInteraction(
  input: DirectorRuntimeConsumerInteractionBridgeInput,
): DirectorRuntimeConsumerInteractionBridgeResult {
  const diagnostics: DirectorRuntimeConsumerInteractionBridgeDiagnostic[] = [];

  if (!isPlainObject(input) || !isPlainObject(input.interaction)) {
    return emptyResult(
      "invalid",
      [
        diagnostic(
          "invalid-interaction",
          "interaction",
          "bridge input requires a semantic interaction object",
        ),
      ],
      null,
      null,
    );
  }

  if (!isStructurallyValidExperienceState(input.experienceState)) {
    return emptyResult(
      "invalid",
      [
        diagnostic(
          "invalid-projection",
          "experienceState",
          "experience state projection result is structurally invalid",
        ),
      ],
      null,
      null,
    );
  }

  if (input.experienceState.status === "invalid") {
    return emptyResult(
      "invalid",
      [
        diagnostic(
          "invalid-projection",
          "experienceState.status",
          "experience state projection is invalid",
        ),
      ],
      isPlainObject(input.interaction)
        ? (input.interaction as DirectorRuntimeConsumerInteraction)
        : null,
      null,
    );
  }

  const interactionValidation = validateDirectorRuntimeConsumerInteraction(
    input.interaction,
  );
  for (const entry of interactionValidation) {
    diagnostics.push(entry);
  }

  const structuralInvalid = diagnostics.some((entry) =>
    entry.kind === "invalid-interaction" ||
    entry.kind === "unsupported-interaction-kind" ||
    entry.kind === "invalid-context-reference");

  if (structuralInvalid) {
    return emptyResult(
      "invalid",
      diagnostics,
      input.interaction,
      null,
    );
  }

  const interaction = freezeInteraction(input.interaction);
  const projection = findProjection(
    input.experienceState,
    interaction.surface,
  );

  if (projection === undefined) {
    diagnostics.push(
      diagnostic(
        "invalid-projection",
        `experienceState.projections.${interaction.surface}`,
        "no projection found for target surface",
      ),
    );
    return emptyResult("invalid", diagnostics, interaction, null);
  }

  if (projection.status === "invalid") {
    diagnostics.push(
      diagnostic(
        "invalid-projection",
        `${interaction.surface}.status`,
        "target surface projection is invalid",
      ),
    );
    return emptyResult("invalid", diagnostics, interaction, projection);
  }

  if (projection.status === "unavailable") {
    diagnostics.push(
      diagnostic(
        "surface-unavailable",
        `${interaction.surface}.status`,
        "target surface projection is unavailable",
      ),
    );
    return emptyResult("blocked", diagnostics, interaction, projection);
  }

  if (projection.status === "inactive") {
    diagnostics.push(
      diagnostic(
        "surface-unavailable",
        `${interaction.surface}.status`,
        "target surface projection is inactive",
      ),
    );
    return emptyResult("blocked", diagnostics, interaction, projection);
  }

  if (
    !isDirectorRuntimeExperienceInteractionReadiness(
      projection.interactionReadiness,
    )
  ) {
    diagnostics.push(
      diagnostic(
        "invalid-projection",
        `${interaction.surface}.interactionReadiness`,
        "interaction readiness is not canonical",
      ),
    );
    return emptyResult("invalid", diagnostics, interaction, projection);
  }

  if (projection.interactionReadiness === "disabled") {
    diagnostics.push(
      diagnostic(
        "interaction-disabled",
        `${interaction.surface}.interactionReadiness`,
        "interaction readiness is disabled",
      ),
    );
    return emptyResult("blocked", diagnostics, interaction, projection);
  }

  if (
    projection.interactionReadiness === "limited" &&
    !(DIRECTOR_RUNTIME_LIMITED_INTERACTION_KINDS as readonly string[]).includes(
      interaction.kind,
    )
  ) {
    diagnostics.push(
      diagnostic(
        "interaction-limited",
        `${interaction.surface}.interactionReadiness`,
        `${interaction.kind} is not permitted under limited readiness`,
      ),
    );
    return emptyResult("blocked", diagnostics, interaction, projection);
  }

  if (
    !isDirectorRuntimeConsumerInteractionSupported(
      interaction.surface,
      interaction.kind,
    )
  ) {
    diagnostics.push(
      diagnostic(
        "unsupported-surface-interaction",
        `${interaction.surface}.${interaction.kind}`,
        "surface does not support this interaction kind",
      ),
    );
    return emptyResult("unsupported", diagnostics, interaction, projection);
  }

  const requirementFailures = diagnostics.some((entry) =>
    entry.kind === "missing-subject" ||
    entry.kind === "missing-capability" ||
    entry.kind === "missing-navigation-target");
  if (requirementFailures) {
    return emptyResult("invalid", diagnostics, interaction, projection);
  }

  const runtimeIntent = buildRuntimeIntent(interaction);
  if (!isDirectorRuntimeConsumerRuntimeIntentKind(runtimeIntent.kind)) {
    diagnostics.push(
      diagnostic(
        "invalid-runtime-intent",
        "runtimeIntent.kind",
        "mapped runtime intent kind is invalid",
      ),
    );
    return emptyResult("invalid", diagnostics, interaction, projection);
  }

  const status: DirectorRuntimeConsumerInteractionBridgeStatus =
    projection.status === "partially-projected"
      ? "partially-bridged"
      : "bridged";

  return Object.freeze({
    status,
    interaction,
    runtimeIntent,
    diagnostics: Object.freeze([...diagnostics]),
    provenance: buildProvenance(interaction, projection),
  });
}

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeConsumerInteractionBridgeApiNames = Object.freeze([
  "getDirectorRuntimeConsumerInteractionBridgeIdentity",
  "listDirectorRuntimeConsumerInteractionKinds",
  "listDirectorRuntimeConsumerInteractionBridgeStatuses",
  "getDirectorRuntimeSurfaceInteractionCapabilities",
  "isDirectorRuntimeConsumerInteractionSupported",
  "isDirectorRuntimeConsumerInteractionKind",
  "isDirectorRuntimeConsumerInteractionBridgeStatus",
  "isDirectorRuntimeExperienceSurface",
  "bridgeDirectorRuntimeConsumerInteraction",
  "resolveDirectorRuntimeConsumerInteractionIntent",
  "validateDirectorRuntimeConsumerInteraction",
  "verifyDirectorRuntimeConsumerInteractionBridge",
] as const);

export const DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_REGISTRY_SECTIONS =
  Object.freeze([
    "identity",
    "dependency",
    "interaction-kinds",
    "bridge-statuses",
    "surface-interaction-capabilities",
    "target-requirements",
    "interaction-to-intent-mappings",
    "interaction-reasons",
    "diagnostics",
    "provenance",
    "guarantees",
  ] as const);

function countSurfaceInteractionCapabilities(): number {
  return DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.reduce(
    (total, surface) =>
      total +
      DIRECTOR_RUNTIME_SURFACE_INTERACTION_CAPABILITY_MATRIX[surface].length,
    0,
  );
}

export const directorRuntimeConsumerInteractionBridgeRegistry = Object.freeze({
  identity: directorRuntimeConsumerInteractionBridgeIdentity,
  version: directorRuntimeConsumerInteractionBridgeVersion,
  namespace: directorRuntimeConsumerInteractionBridgeNamespace,
  dependency: directorRuntimeConsumerInteractionBridgeUpstream,
  interactionKinds: DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS,
  interactionKindCount: DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS.length,
  bridgeStatuses: DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_STATUSES,
  bridgeStatusCount:
    DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_STATUSES.length,
  runtimeIntentKinds: DIRECTOR_RUNTIME_CONSUMER_RUNTIME_INTENT_KINDS,
  runtimeIntentKindCount:
    DIRECTOR_RUNTIME_CONSUMER_RUNTIME_INTENT_KINDS.length,
  surfaceInteractionCapabilities:
    DIRECTOR_RUNTIME_SURFACE_INTERACTION_CAPABILITY_MATRIX,
  surfaceInteractionCapabilityCount: countSurfaceInteractionCapabilities(),
  targetRequirements: DIRECTOR_RUNTIME_INTERACTION_TARGET_REQUIREMENTS,
  targetRequirementCount: Object.keys(
    DIRECTOR_RUNTIME_INTERACTION_TARGET_REQUIREMENTS,
  ).length,
  interactionToIntentMappings: DIRECTOR_RUNTIME_INTERACTION_TO_INTENT_MAPPINGS,
  interactionToIntentMappingCount:
    DIRECTOR_RUNTIME_INTERACTION_TO_INTENT_MAPPINGS.length,
  interactionReasons: DIRECTOR_RUNTIME_CONSUMER_INTERACTION_REASONS,
  interactionReasonCount: DIRECTOR_RUNTIME_CONSUMER_INTERACTION_REASONS.length,
  limitedInteractionKinds: DIRECTOR_RUNTIME_LIMITED_INTERACTION_KINDS,
  limitedInteractionKindCount: DIRECTOR_RUNTIME_LIMITED_INTERACTION_KINDS.length,
  diagnosticKinds: DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_DIAGNOSTIC_KINDS,
  diagnosticKindCount:
    DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_DIAGNOSTIC_KINDS.length,
  provenanceFields:
    DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_PROVENANCE_FIELDS,
  provenanceFieldCount:
    DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_PROVENANCE_FIELDS.length,
  guarantees: DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_GUARANTEES,
  guaranteeCount: DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_GUARANTEES.length,
  registrySections:
    DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_REGISTRY_SECTIONS,
  registrySectionCount:
    DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_REGISTRY_SECTIONS.length,
  publicApis: directorRuntimeConsumerInteractionBridgeApiNames,
  publicApiCount: directorRuntimeConsumerInteractionBridgeApiNames.length,
  surfaces: DIRECTOR_RUNTIME_EXPERIENCE_SURFACES,
  surfaceCount: DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.length,
});

export const directorRuntimeConsumerInteractionBridge = Object.freeze({
  phase: "DRI-8:5" as const,
  name: "DirectorRuntimeConsumerInteractionBridge" as const,
  identity: directorRuntimeConsumerInteractionBridgeIdentity,
  namespace: directorRuntimeConsumerInteractionBridgeNamespace,
  version: directorRuntimeConsumerInteractionBridgeVersion,
  layer: "DirectorRuntimeConsumerIntegration" as const,
  role: "ConsumerInteractionBridge" as const,
  stage: "ConsumerInteractionBridge" as const,
  status: "ConsumerInteractionBridgeReady" as const,
  upstreamDependency: directorRuntimeConsumerInteractionBridgeUpstream,
  deterministic: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  mutatesRuntimeState: false as const,
  philosophy:
    "semantic-consumer-interaction-to-runtime-intent-not-ui-events" as const,
  interactionKinds: DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS,
  bridgeStatuses: DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_STATUSES,
  surfaceInteractionCapabilities:
    DIRECTOR_RUNTIME_SURFACE_INTERACTION_CAPABILITY_MATRIX,
  interactionToIntentMappings: DIRECTOR_RUNTIME_INTERACTION_TO_INTENT_MAPPINGS,
  interactionReasons: DIRECTOR_RUNTIME_CONSUMER_INTERACTION_REASONS,
  diagnosticKinds: DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_DIAGNOSTIC_KINDS,
  guarantees: DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_GUARANTEES,
  publicApiSurface: directorRuntimeConsumerInteractionBridgeApiNames,
  registry: directorRuntimeConsumerInteractionBridgeRegistry,
  experienceProjectionBoundary: "DRI-8:4-experience-state-projection-only" as const,
  architecturalStatus:
    "Consumer Interaction Bridge Complete · Deterministic · Immutable · Framework-Independent · ReadyForExperienceCoordination" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeConsumerInteractionBridgeVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeConsumerInteractionBridgeIdentity;
  readonly version: typeof directorRuntimeConsumerInteractionBridgeVersion;
  readonly namespace: typeof directorRuntimeConsumerInteractionBridgeNamespace;
  readonly dependency: typeof directorRuntimeConsumerInteractionBridgeUpstream;
  readonly interactionKindCount: number;
  readonly bridgeStatusCount: number;
  readonly surfaceInteractionCapabilityCount: number;
  readonly targetRequirementCount: number;
  readonly interactionToIntentMappingCount: number;
  readonly interactionReasonCount: number;
  readonly diagnosticKindCount: number;
  readonly guaranteeCount: number;
  readonly registrySectionCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly dri84BoundaryIntact: boolean;
  readonly frameworkIndependent: boolean;
  readonly mutatesRuntimeState: boolean;
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
  const kindSet = new Set<string>(DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS);
  for (const surface of DIRECTOR_RUNTIME_EXPERIENCE_SURFACES) {
    const kinds = DIRECTOR_RUNTIME_SURFACE_INTERACTION_CAPABILITY_MATRIX[surface];
    if (!Object.isFrozen(kinds)) return false;
    if (!unique(kinds as readonly string[])) return false;
    for (const kind of kinds) {
      if (!kindSet.has(kind)) return false;
    }
  }
  return (
    exactOrder(
      DIRECTOR_RUNTIME_SURFACE_INTERACTION_CAPABILITY_MATRIX.stage,
      ["select", "focus", "activate", "hover", "inspect"],
    ) &&
    exactOrder(
      DIRECTOR_RUNTIME_SURFACE_INTERACTION_CAPABILITY_MATRIX.advisor,
      ["activate", "inspect", "dismiss", "navigate"],
    ) &&
    exactOrder(
      DIRECTOR_RUNTIME_SURFACE_INTERACTION_CAPABILITY_MATRIX.insight,
      ["select", "focus", "inspect", "navigate"],
    ) &&
    exactOrder(
      DIRECTOR_RUNTIME_SURFACE_INTERACTION_CAPABILITY_MATRIX["live-lens"],
      ["select", "focus", "navigate", "inspect"],
    ) &&
    exactOrder(
      DIRECTOR_RUNTIME_SURFACE_INTERACTION_CAPABILITY_MATRIX.timeline,
      ["select", "navigate", "inspect"],
    ) &&
    exactOrder(
      DIRECTOR_RUNTIME_SURFACE_INTERACTION_CAPABILITY_MATRIX.explorer,
      ["select", "navigate", "inspect", "activate"],
    )
  );
}

export function verifyDirectorRuntimeConsumerInteractionBridge():
  DirectorRuntimeConsumerInteractionBridgeVerification {
  const bridge = directorRuntimeConsumerInteractionBridge;
  const registry = directorRuntimeConsumerInteractionBridgeRegistry;

  const identityOk =
    bridge.identity === "DRI-8:5/DirectorRuntimeConsumerInteractionBridge" &&
    bridge.version === "8.5.0" &&
    bridge.namespace ===
      "nexora.dri.consumer-integration.interaction-bridge" &&
    bridge.layer === "DirectorRuntimeConsumerIntegration" &&
    bridge.role === "ConsumerInteractionBridge" &&
    bridge.upstreamDependency ===
      "DRI-8:4/DirectorRuntimeExperienceStateProjection" &&
    bridge.upstreamDependency ===
      directorRuntimeExperienceStateProjectionIdentity &&
    registry.dependency === bridge.upstreamDependency &&
    bridge.experienceProjectionBoundary ===
      "DRI-8:4-experience-state-projection-only" &&
    bridge.mutatesRuntimeState === false;

  const vocabularyOk =
    exactOrder(DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS, [
      "select",
      "focus",
      "activate",
      "hover",
      "navigate",
      "inspect",
      "dismiss",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_STATUSES, [
      "bridged",
      "partially-bridged",
      "blocked",
      "unsupported",
      "invalid",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_CONSUMER_RUNTIME_INTENT_KINDS, [
      "selection",
      "focus",
      "activation",
      "lightweight-attention",
      "navigation",
      "inspection",
      "dismissal",
    ]) &&
    DIRECTOR_RUNTIME_INTERACTION_TO_INTENT_MAPPINGS.length ===
      DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS.length &&
    unique([...DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS]) &&
    unique([...DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_STATUSES]) &&
    unique([...DIRECTOR_RUNTIME_CONSUMER_INTERACTION_REASONS]) &&
    unique([
      ...DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_DIAGNOSTIC_KINDS,
    ]) &&
    unique([...DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_GUARANTEES]);

  const matrixOk = capabilityMatrixValid();

  const registryOk =
    registry.interactionKindCount ===
      DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS.length &&
    registry.bridgeStatusCount ===
      DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_STATUSES.length &&
    registry.surfaceInteractionCapabilityCount ===
      countSurfaceInteractionCapabilities() &&
    registry.targetRequirementCount ===
      Object.keys(DIRECTOR_RUNTIME_INTERACTION_TARGET_REQUIREMENTS).length &&
    registry.interactionToIntentMappingCount ===
      DIRECTOR_RUNTIME_INTERACTION_TO_INTENT_MAPPINGS.length &&
    registry.interactionReasonCount ===
      DIRECTOR_RUNTIME_CONSUMER_INTERACTION_REASONS.length &&
    registry.diagnosticKindCount ===
      DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_DIAGNOSTIC_KINDS.length &&
    registry.guaranteeCount ===
      DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_GUARANTEES.length &&
    registry.registrySectionCount ===
      DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_REGISTRY_SECTIONS.length &&
    registry.publicApiCount ===
      directorRuntimeConsumerInteractionBridgeApiNames.length;

  const frozen =
    Object.isFrozen(bridge) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(directorRuntimeConsumerInteractionBridgeCanonicalIdentity) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_STATUSES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_SURFACE_INTERACTION_CAPABILITY_MATRIX) &&
    Object.isFrozen(DIRECTOR_RUNTIME_INTERACTION_TARGET_REQUIREMENTS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_INTERACTION_TO_INTENT_MAPPINGS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_INTERACTION_REASONS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_DIAGNOSTIC_KINDS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_GUARANTEES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_LIMITED_INTERACTION_KINDS);

  const dri84BoundaryIntact =
    bridge.upstreamDependency ===
      "DRI-8:4/DirectorRuntimeExperienceStateProjection" &&
    bridge.experienceProjectionBoundary ===
      "DRI-8:4-experience-state-projection-only";

  const frameworkIndependent =
    bridge.frameworkIndependent === true &&
    bridge.rendererIndependent === true;

  const ok =
    identityOk &&
    vocabularyOk &&
    matrixOk &&
    registryOk &&
    frozen &&
    dri84BoundaryIntact &&
    frameworkIndependent &&
    bridge.mutatesRuntimeState === false;

  return Object.freeze({
    ok,
    identity: directorRuntimeConsumerInteractionBridgeIdentity,
    version: directorRuntimeConsumerInteractionBridgeVersion,
    namespace: directorRuntimeConsumerInteractionBridgeNamespace,
    dependency: directorRuntimeConsumerInteractionBridgeUpstream,
    interactionKindCount: DIRECTOR_RUNTIME_CONSUMER_INTERACTION_KINDS.length,
    bridgeStatusCount:
      DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_STATUSES.length,
    surfaceInteractionCapabilityCount: countSurfaceInteractionCapabilities(),
    targetRequirementCount: Object.keys(
      DIRECTOR_RUNTIME_INTERACTION_TARGET_REQUIREMENTS,
    ).length,
    interactionToIntentMappingCount:
      DIRECTOR_RUNTIME_INTERACTION_TO_INTENT_MAPPINGS.length,
    interactionReasonCount: DIRECTOR_RUNTIME_CONSUMER_INTERACTION_REASONS.length,
    diagnosticKindCount:
      DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_DIAGNOSTIC_KINDS.length,
    guaranteeCount: DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_GUARANTEES.length,
    registrySectionCount:
      DIRECTOR_RUNTIME_CONSUMER_INTERACTION_BRIDGE_REGISTRY_SECTIONS.length,
    publicApiCount: directorRuntimeConsumerInteractionBridgeApiNames.length,
    frozen,
    dri84BoundaryIntact,
    frameworkIndependent,
    mutatesRuntimeState: false,
    capabilityMatrixValid: matrixOk,
  });
}
