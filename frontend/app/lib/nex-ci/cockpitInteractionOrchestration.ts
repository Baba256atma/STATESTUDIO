/**
 * NEX-CI:6 — Cockpit Interaction Orchestration.
 *
 * Coordinates executive interactions across Cockpit surfaces via canonical
 * intents, validation, resolution, reaction planning, and coordinated snapshots.
 *
 * Canonical flow:
 *   Surface Interaction
 *   → Cockpit Intent
 *   → Intent Validation
 *   → Intent Resolution
 *   → Reaction Planning
 *   → Surface Propagation
 *   → Coordinated Cockpit Snapshot
 *
 * Surfaces never directly mutate each other. NEX-CI:6 returns deterministic
 * semantic results only — no AI, network, UI, or renderer side effects.
 *
 * Sole immediate NEX-CI dependency: NEX-CI:5 Advisor & Insight Integration.
 * Does not implement NEX-CI:7 Timeline / Explorer / Live Lens detail.
 */

import {
  advisorInsightIntegrationIdentity,
  createExecutiveAdvisorGuidanceIntent,
  createExecutiveCockpitIntegrationSnapshot,
  createExecutiveInsightRequestIntent,
  createExecutiveStageInteractionIntent,
  createExecutiveWorkspaceReference,
  createExecutiveWorkspaceSelectionIntent,
  EXECUTIVE_COCKPIT_SURFACES,
  isExecutiveCockpitPresentationState,
  isExecutiveCockpitSurface,
  resolveCockpitShellRuntimeBinding,
  resolveExecutiveAdvisorInsightIntegration,
  resolveExecutiveStageScene,
  resolveExecutiveWorkspaceExperience,
  resolveExecutiveWorkspaceSelection,
  verifyAdvisorInsightIntegration,
  type ExecutiveAdvisorGuidanceIntent,
  type ExecutiveAdvisorInsightIntegrationSnapshot,
  type ExecutiveCockpitIntegrationStatus,
  type ExecutiveCockpitPresentationState,
  type ExecutiveCockpitSubjectKind,
  type ExecutiveCockpitSubjectReference,
  type ExecutiveCockpitSurface,
  type ExecutiveInsightRequestIntent,
  type ExecutiveStageInteractionIntent,
  type ExecutiveStageSceneOptions,
  type ExecutiveWorkspaceReference,
  type ExecutiveWorkspaceSelectionIntent,
} from "@/app/lib/nex-ci/advisorInsightIntegration";

// ─── Identity ───────────────────────────────────────────────────────────────

export const cockpitInteractionOrchestrationIdentity =
  "NEX-CI:6/CockpitInteractionOrchestration" as const;

export const cockpitInteractionOrchestrationVersion = "1.6.0" as const;

export const cockpitInteractionOrchestrationNamespace =
  "nexora.executive.cockpit.integration.interaction-orchestration" as const;

export const cockpitInteractionOrchestrationLayer = "NEX-CI" as const;

export const cockpitInteractionOrchestrationPhase =
  "CockpitInteractionOrchestration" as const;

export const cockpitInteractionOrchestrationStage =
  "CockpitInteractionOrchestration" as const;

export const cockpitInteractionOrchestrationArchitecturalRole =
  "CockpitInteractionOrchestration" as const;

export const cockpitInteractionOrchestrationDependencyIdentity =
  advisorInsightIntegrationIdentity;

export const cockpitInteractionOrchestrationDependencyPath =
  "@/app/lib/nex-ci/advisorInsightIntegration" as const;

export const cockpitInteractionOrchestrationStability =
  "CockpitInteractionOrchestrationReady" as const;

export const cockpitInteractionOrchestrationDeterministic = true as const;

export const cockpitInteractionOrchestrationSideEffectPolicy =
  "side-effect-free" as const;

export const cockpitInteractionOrchestrationMutationPolicy =
  "immutable" as const;

/**
 * Canonical reaction order:
 * global/context → Stage → Advisor → Insight → Timeline → Explorer →
 * Live Lens → Context Bar → Navigation → Status → surface lifecycle
 */
export const EXECUTIVE_COCKPIT_REACTION_ORDER_POLICY =
  "global/context → stage → advisor → insight → timeline → explorer → live-lens → context-bar → navigation → status → surface-lifecycle" as const;

export const EXECUTIVE_COCKPIT_ORCHESTRATION_PRINCIPLE =
  "Surface → Interaction Intent → NEX-CI:6 Orchestrator → Coordinated Reactions → updated canonical snapshot → surfaces consume updated state. No surface directly mutates another." as const;

export const cockpitInteractionOrchestrationCanonicalIdentity = Object.freeze({
  identity: cockpitInteractionOrchestrationIdentity,
  version: cockpitInteractionOrchestrationVersion,
  namespace: cockpitInteractionOrchestrationNamespace,
  layer: cockpitInteractionOrchestrationLayer,
  phase: cockpitInteractionOrchestrationPhase,
  stage: cockpitInteractionOrchestrationStage,
  architecturalRole: cockpitInteractionOrchestrationArchitecturalRole,
  dependencyIdentity: cockpitInteractionOrchestrationDependencyIdentity,
  dependencyPath: cockpitInteractionOrchestrationDependencyPath,
  stabilityStatus: cockpitInteractionOrchestrationStability,
  deterministicStatus: cockpitInteractionOrchestrationDeterministic,
  sideEffectPolicy: cockpitInteractionOrchestrationSideEffectPolicy,
  mutationPolicy: cockpitInteractionOrchestrationMutationPolicy,
});

export const COCKPIT_INTERACTION_ORCHESTRATION_BOUNDARY = Object.freeze({
  nexCiAuthority: "Executive-Cockpit-Integration" as const,
  orchestrationAuthority: "Executive-Cockpit-Interaction-Orchestration" as const,
  boundaryAuthority: "NEX-CI:6" as const,
  architecturalRole: "CockpitInteractionOrchestration" as const,
  soleImmediateDependency: "NEX-CI:5/AdvisorInsightIntegration" as const,
  consumesNexCi5Only: true as const,
  bypassesIntoNexCi4: false as const,
  bypassesIntoNexCi3: false as const,
  bypassesIntoNexCi2: false as const,
  bypassesIntoNexCi1: false as const,
  bypassesIntoRex: false as const,
  bypassesIntoExDri: false as const,
  bypassesIntoDri: false as const,
  bypassesIntoNol: false as const,
  surfacesNeverDirectlyMutateEachOther: true as const,
  ownsAiExecution: false as const,
  ownsContentGeneration: false as const,
  ownsNetworkAccess: false as const,
  ownsPersistence: false as const,
  ownsTimelineDetail: false as const,
  ownsExplorerDetail: false as const,
  ownsLiveLensDetail: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  intelligenceProviderIndependent: true as const,
  introducesReact: false as const,
  introducesThreeJs: false as const,
  introducesReactThreeFiber: false as const,
  introducesAiSdk: false as const,
  implementsNexCi7: false as const,
  reactionOrderPolicy: EXECUTIVE_COCKPIT_REACTION_ORDER_POLICY,
});

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const EXECUTIVE_COCKPIT_INTERACTION_SOURCES = Object.freeze([
  "stage",
  "advisor",
  "insight",
  "timeline",
  "explorer",
  "live-lens",
  "workspace-dial",
  "context-bar",
  "navigation",
  "status",
] as const);

export type ExecutiveCockpitInteractionSource =
  (typeof EXECUTIVE_COCKPIT_INTERACTION_SOURCES)[number];

export const EXECUTIVE_COCKPIT_INTERACTION_KINDS = Object.freeze([
  "select",
  "focus",
  "clear-selection",
  "clear-focus",
  "open",
  "close",
  "dismiss",
  "activate",
  "deactivate",
  "navigate",
  "change-workspace",
  "change-presentation",
  "request-guidance",
  "request-insight",
  "context-open",
] as const);

export type ExecutiveCockpitInteractionKind =
  (typeof EXECUTIVE_COCKPIT_INTERACTION_KINDS)[number];

export const EXECUTIVE_COCKPIT_INTERACTION_RESOLUTION_STATUSES = Object.freeze([
  "accepted",
  "rejected",
  "ignored",
  "deferred",
] as const);

export type ExecutiveCockpitInteractionResolutionStatus =
  (typeof EXECUTIVE_COCKPIT_INTERACTION_RESOLUTION_STATUSES)[number];

export const EXECUTIVE_COCKPIT_INTERACTION_RESOLUTION_REASONS = Object.freeze([
  "accepted",
  "invalid-source",
  "invalid-kind",
  "missing-subject",
  "missing-workspace",
  "unsupported-by-source",
  "unsupported-by-target",
  "surface-unavailable",
  "already-active",
  "transition-in-progress",
  "no-op",
  "incompatible-context",
] as const);

export type ExecutiveCockpitInteractionResolutionReason =
  (typeof EXECUTIVE_COCKPIT_INTERACTION_RESOLUTION_REASONS)[number];

export const EXECUTIVE_COCKPIT_INTERACTION_PRIORITIES = Object.freeze([
  "critical",
  "high",
  "normal",
  "low",
] as const);

export type ExecutiveCockpitInteractionPriority =
  (typeof EXECUTIVE_COCKPIT_INTERACTION_PRIORITIES)[number];

export const EXECUTIVE_COCKPIT_REACTION_KINDS = Object.freeze([
  "update-selection",
  "update-focus",
  "update-workspace",
  "update-presentation",
  "update-attention",
  "update-stage",
  "update-advisor",
  "update-insight",
  "update-timeline",
  "update-explorer",
  "update-live-lens",
  "update-context-bar",
  "update-navigation",
  "update-status",
  "activate-surface",
  "deactivate-surface",
  "open-surface",
  "close-surface",
  "restore-cockpit",
] as const);

export type ExecutiveCockpitReactionKind =
  (typeof EXECUTIVE_COCKPIT_REACTION_KINDS)[number];

export interface ExecutiveCockpitInteractionIntent {
  readonly id?: string;
  readonly source: ExecutiveCockpitInteractionSource;
  readonly kind: ExecutiveCockpitInteractionKind;
  readonly subjectId?: string;
  readonly workspaceId?: string;
  readonly targetSurface?: ExecutiveCockpitSurface;
  readonly presentationState?: ExecutiveCockpitPresentationState;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface ExecutiveCockpitInteractionResolution {
  readonly status: ExecutiveCockpitInteractionResolutionStatus;
  readonly reason: ExecutiveCockpitInteractionResolutionReason;
  readonly intent: ExecutiveCockpitInteractionIntent;
  readonly priority: ExecutiveCockpitInteractionPriority;
}

export interface ExecutiveCockpitReaction {
  readonly kind: ExecutiveCockpitReactionKind;
  readonly targetSurface?: ExecutiveCockpitSurface;
  readonly subjectId?: string;
  readonly workspaceId?: string;
  readonly priority: ExecutiveCockpitInteractionPriority;
}

export interface ExecutiveCockpitOrchestrationSnapshot {
  readonly advisorInsight: ExecutiveAdvisorInsightIntegrationSnapshot;
  readonly activeSurface: ExecutiveCockpitSurface;
  readonly selectedSubject?: ExecutiveCockpitSubjectReference;
  readonly focusedSubject?: ExecutiveCockpitSubjectReference;
  readonly currentWorkspace?: ExecutiveWorkspaceReference;
  readonly targetWorkspace?: ExecutiveWorkspaceReference;
  readonly presentationState?: ExecutiveCockpitPresentationState;
  readonly reactions: readonly ExecutiveCockpitReaction[];
  readonly status: ExecutiveCockpitIntegrationStatus;
  readonly orchestrationIdentity: typeof cockpitInteractionOrchestrationIdentity;
  readonly orchestrationVersion: typeof cockpitInteractionOrchestrationVersion;
}

export interface ExecutiveCockpitInteractionResult {
  readonly resolution: ExecutiveCockpitInteractionResolution;
  readonly reactions: readonly ExecutiveCockpitReaction[];
  readonly snapshot: ExecutiveCockpitOrchestrationSnapshot;
}

export interface ExecutiveCockpitInteractionRecord {
  readonly source: ExecutiveCockpitInteractionSource;
  readonly kind: ExecutiveCockpitInteractionKind;
  readonly status: ExecutiveCockpitInteractionResolutionStatus;
  readonly reason: ExecutiveCockpitInteractionResolutionReason;
}

/**
 * Source × InteractionKind support matrix.
 * Not every source supports every kind.
 */
export const EXECUTIVE_COCKPIT_SOURCE_CAPABILITY_MATRIX = Object.freeze({
  stage: Object.freeze([
    "select",
    "focus",
    "clear-selection",
    "clear-focus",
    "open",
    "context-open",
  ] as const),
  "workspace-dial": Object.freeze([
    "change-workspace",
    "activate",
  ] as const),
  advisor: Object.freeze([
    "request-guidance",
    "open",
    "close",
    "dismiss",
  ] as const),
  insight: Object.freeze([
    "request-insight",
    "open",
    "close",
    "dismiss",
  ] as const),
  timeline: Object.freeze([
    "select",
    "focus",
    "open",
    "close",
    "activate",
    "deactivate",
    "navigate",
  ] as const),
  explorer: Object.freeze([
    "select",
    "focus",
    "open",
    "close",
    "activate",
    "deactivate",
    "navigate",
  ] as const),
  "live-lens": Object.freeze([
    "select",
    "focus",
    "open",
    "close",
    "activate",
    "deactivate",
    "navigate",
  ] as const),
  "context-bar": Object.freeze([
    "open",
    "close",
    "dismiss",
    "context-open",
    "change-presentation",
  ] as const),
  navigation: Object.freeze([
    "navigate",
    "activate",
    "deactivate",
    "open",
    "close",
    "change-presentation",
  ] as const),
  status: Object.freeze([
    "activate",
    "deactivate",
    "open",
    "close",
  ] as const),
} as const);

export type ExecutiveCockpitSourceCapabilityMatrix =
  typeof EXECUTIVE_COCKPIT_SOURCE_CAPABILITY_MATRIX;

const REACTION_KIND_ORDER: Readonly<
  Record<ExecutiveCockpitReactionKind, number>
> = Object.freeze({
  "update-selection": 0,
  "update-focus": 1,
  "update-workspace": 2,
  "update-presentation": 3,
  "update-attention": 4,
  "restore-cockpit": 5,
  "update-stage": 6,
  "update-advisor": 7,
  "update-insight": 8,
  "update-timeline": 9,
  "update-explorer": 10,
  "update-live-lens": 11,
  "update-context-bar": 12,
  "update-navigation": 13,
  "update-status": 14,
  "activate-surface": 15,
  "deactivate-surface": 16,
  "open-surface": 17,
  "close-surface": 18,
});

const PRIORITY_RANK: Readonly<
  Record<ExecutiveCockpitInteractionPriority, number>
> = Object.freeze({
  critical: 0,
  high: 1,
  normal: 2,
  low: 3,
});

const KINDS_REQUIRING_SUBJECT = Object.freeze([
  "select",
  "focus",
  "context-open",
] as const);

const KINDS_REQUIRING_WORKSPACE = Object.freeze([
  "change-workspace",
] as const);

const KINDS_REQUIRING_PRESENTATION = Object.freeze([
  "change-presentation",
] as const);

const KINDS_REQUIRING_TARGET_SURFACE = Object.freeze([
  "open",
  "close",
  "activate",
  "deactivate",
  "dismiss",
  "navigate",
] as const);

// ─── Guarantees ─────────────────────────────────────────────────────────────

export const COCKPIT_INTERACTION_ORCHESTRATION_GUARANTEES = Object.freeze([
  Object.freeze({
    id: "nex-ci-5-sole-immediate-dependency",
    order: 1,
    statement: "NEX-CI:6 immediately depends on NEX-CI:5 only.",
  }),
  Object.freeze({
    id: "surfaces-never-directly-mutate-each-other",
    order: 2,
    statement: "Surfaces never directly mutate each other.",
  }),
  Object.freeze({
    id: "canonical-interaction-source",
    order: 3,
    statement: "Every interaction has a canonical source.",
  }),
  Object.freeze({
    id: "canonical-interaction-kind",
    order: 4,
    statement: "Every interaction has a canonical kind.",
  }),
  Object.freeze({
    id: "source-capabilities-enforced",
    order: 5,
    statement: "Source capabilities are enforced.",
  }),
  Object.freeze({
    id: "target-capabilities-enforced",
    order: 6,
    statement: "Target capabilities are enforced.",
  }),
  Object.freeze({
    id: "focus-selection-remain-distinct",
    order: 7,
    statement: "Selection and focus remain distinct.",
  }),
  Object.freeze({
    id: "workspace-current-target-distinct",
    order: 8,
    statement: "Current and target workspace remain distinct.",
  }),
  Object.freeze({
    id: "workspace-transition-reuses-nex-ci-4",
    order: 9,
    statement: "Workspace transition behavior reuses NEX-CI:4 policy.",
  }),
  Object.freeze({
    id: "presentation-reuses-canonical",
    order: 10,
    statement: "Presentation reuses canonical Minimum/Report/Operation.",
  }),
  Object.freeze({
    id: "advisor-insight-remain-independent",
    order: 11,
    statement: "Advisor/Insight remain independent.",
  }),
  Object.freeze({
    id: "no-timeline-detail",
    order: 12,
    statement: "Timeline detailed behavior is not implemented.",
  }),
  Object.freeze({
    id: "no-explorer-detail",
    order: 13,
    statement: "Explorer detailed behavior is not implemented.",
  }),
  Object.freeze({
    id: "no-live-lens-detail",
    order: 14,
    statement: "Live Lens detailed behavior is not implemented.",
  }),
  Object.freeze({
    id: "reactions-deterministic",
    order: 15,
    statement: "Reactions are deterministic.",
  }),
  Object.freeze({
    id: "reaction-ordering-deterministic",
    order: 16,
    statement: "Reaction ordering is deterministic.",
  }),
  Object.freeze({
    id: "duplicate-reactions-removed",
    order: 17,
    statement: "Duplicate reactions are deterministically removed.",
  }),
  Object.freeze({
    id: "noop-no-unnecessary-mutations",
    order: 18,
    statement: "No-op interactions create no unnecessary mutations.",
  }),
  Object.freeze({
    id: "unavailable-surfaces-enforced",
    order: 19,
    statement: "Unavailable surfaces cannot receive unsupported actions.",
  }),
  Object.freeze({
    id: "inputs-not-mutated",
    order: 20,
    statement: "Inputs are not mutated.",
  }),
  Object.freeze({
    id: "no-react-dependency",
    order: 21,
    statement: "No React dependency exists.",
  }),
  Object.freeze({
    id: "no-threejs-dependency",
    order: 22,
    statement: "No Three.js dependency exists.",
  }),
  Object.freeze({
    id: "no-ai-sdk-dependency",
    order: 23,
    statement: "No AI SDK dependency exists.",
  }),
  Object.freeze({
    id: "no-network-side-effects",
    order: 24,
    statement: "No network side effects occur.",
  }),
  Object.freeze({
    id: "no-persistence",
    order: 25,
    statement: "No persistence occurs.",
  }),
  Object.freeze({
    id: "no-nex-ci-7-behavior",
    order: 26,
    statement: "No NEX-CI:7 behavior is implemented.",
  }),
]);

export type CockpitInteractionOrchestrationGuarantee =
  (typeof COCKPIT_INTERACTION_ORCHESTRATION_GUARANTEES)[number];

export const COCKPIT_INTERACTION_ORCHESTRATION_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "Timeline replay / journal packs / date navigation",
    "Explorer drawer / object-data-journal workflows",
    "Live Lens Goal → Object → Pack navigation",
    "React UI event wiring",
    "Three.js physical scene movement",
    "Workspace Dial geometry",
    "Animation execution",
    "AI guidance / insight generation",
    "OpenAI / Anthropic / Gemini SDK usage",
    "External messaging / Gate / Jira",
    "Persistence / notifications",
    "New REX runtime behavior",
  ] as const);

// ─── Type guards / getters ──────────────────────────────────────────────────

export function isExecutiveCockpitInteractionSource(
  value: unknown,
): value is ExecutiveCockpitInteractionSource {
  return (
    typeof value === "string" &&
    (EXECUTIVE_COCKPIT_INTERACTION_SOURCES as readonly string[]).includes(value)
  );
}

export function isExecutiveCockpitInteractionKind(
  value: unknown,
): value is ExecutiveCockpitInteractionKind {
  return (
    typeof value === "string" &&
    (EXECUTIVE_COCKPIT_INTERACTION_KINDS as readonly string[]).includes(value)
  );
}

export function isExecutiveCockpitInteractionResolutionStatus(
  value: unknown,
): value is ExecutiveCockpitInteractionResolutionStatus {
  return (
    typeof value === "string" &&
    (
      EXECUTIVE_COCKPIT_INTERACTION_RESOLUTION_STATUSES as readonly string[]
    ).includes(value)
  );
}

export function isExecutiveCockpitInteractionResolutionReason(
  value: unknown,
): value is ExecutiveCockpitInteractionResolutionReason {
  return (
    typeof value === "string" &&
    (
      EXECUTIVE_COCKPIT_INTERACTION_RESOLUTION_REASONS as readonly string[]
    ).includes(value)
  );
}

export function isExecutiveCockpitInteractionPriority(
  value: unknown,
): value is ExecutiveCockpitInteractionPriority {
  return (
    typeof value === "string" &&
    (EXECUTIVE_COCKPIT_INTERACTION_PRIORITIES as readonly string[]).includes(
      value,
    )
  );
}

export function isExecutiveCockpitReactionKind(
  value: unknown,
): value is ExecutiveCockpitReactionKind {
  return (
    typeof value === "string" &&
    (EXECUTIVE_COCKPIT_REACTION_KINDS as readonly string[]).includes(value)
  );
}

export function getCockpitInteractionOrchestrationIdentity():
  typeof cockpitInteractionOrchestrationCanonicalIdentity {
  return cockpitInteractionOrchestrationCanonicalIdentity;
}

export function getExecutiveCockpitInteractionSources(): ReadonlyArray<
  ExecutiveCockpitInteractionSource
> {
  return EXECUTIVE_COCKPIT_INTERACTION_SOURCES;
}

export function getExecutiveCockpitInteractionKinds(): ReadonlyArray<
  ExecutiveCockpitInteractionKind
> {
  return EXECUTIVE_COCKPIT_INTERACTION_KINDS;
}

export function getExecutiveCockpitInteractionResolutionStatuses(): ReadonlyArray<
  ExecutiveCockpitInteractionResolutionStatus
> {
  return EXECUTIVE_COCKPIT_INTERACTION_RESOLUTION_STATUSES;
}

export function getExecutiveCockpitInteractionResolutionReasons(): ReadonlyArray<
  ExecutiveCockpitInteractionResolutionReason
> {
  return EXECUTIVE_COCKPIT_INTERACTION_RESOLUTION_REASONS;
}

export function getExecutiveCockpitInteractionPriorities(): ReadonlyArray<
  ExecutiveCockpitInteractionPriority
> {
  return EXECUTIVE_COCKPIT_INTERACTION_PRIORITIES;
}

export function getExecutiveCockpitReactionKinds(): ReadonlyArray<
  ExecutiveCockpitReactionKind
> {
  return EXECUTIVE_COCKPIT_REACTION_KINDS;
}

export function getExecutiveCockpitSourceCapabilityMatrix():
  ExecutiveCockpitSourceCapabilityMatrix {
  return EXECUTIVE_COCKPIT_SOURCE_CAPABILITY_MATRIX;
}

export function isSourceCapableOfInteraction(
  source: ExecutiveCockpitInteractionSource,
  kind: ExecutiveCockpitInteractionKind,
): boolean {
  if (!isExecutiveCockpitInteractionSource(source)) {
    return false;
  }
  if (!isExecutiveCockpitInteractionKind(kind)) {
    return false;
  }
  const supported = EXECUTIVE_COCKPIT_SOURCE_CAPABILITY_MATRIX[source];
  return (supported as readonly string[]).includes(kind);
}

// ─── Intent creation / normalization ────────────────────────────────────────

export function createExecutiveCockpitInteractionIntent(input: {
  readonly source: ExecutiveCockpitInteractionSource;
  readonly kind: ExecutiveCockpitInteractionKind;
  readonly id?: string;
  readonly subjectId?: string;
  readonly workspaceId?: string;
  readonly targetSurface?: ExecutiveCockpitSurface;
  readonly presentationState?: ExecutiveCockpitPresentationState;
  readonly metadata?: Readonly<Record<string, unknown>>;
}): ExecutiveCockpitInteractionIntent {
  if (!isExecutiveCockpitInteractionSource(input.source)) {
    throw new TypeError("source must be a known cockpit interaction source");
  }
  if (!isExecutiveCockpitInteractionKind(input.kind)) {
    throw new TypeError("kind must be a known cockpit interaction kind");
  }
  if (input.id !== undefined && input.id.length === 0) {
    throw new TypeError("id must be non-empty when provided");
  }
  if (input.subjectId !== undefined && input.subjectId.length === 0) {
    throw new TypeError("subjectId must be non-empty when provided");
  }
  if (input.workspaceId !== undefined && input.workspaceId.length === 0) {
    throw new TypeError("workspaceId must be non-empty when provided");
  }
  if (
    input.targetSurface !== undefined &&
    !isExecutiveCockpitSurface(input.targetSurface)
  ) {
    throw new TypeError("targetSurface must be a known cockpit surface");
  }
  if (
    input.presentationState !== undefined &&
    !isExecutiveCockpitPresentationState(input.presentationState)
  ) {
    throw new TypeError("presentationState must be a canonical presentation state");
  }

  return Object.freeze({
    source: input.source,
    kind: input.kind,
    ...(input.id !== undefined ? { id: input.id } : {}),
    ...(input.subjectId !== undefined ? { subjectId: input.subjectId } : {}),
    ...(input.workspaceId !== undefined
      ? { workspaceId: input.workspaceId }
      : {}),
    ...(input.targetSurface !== undefined
      ? { targetSurface: input.targetSurface }
      : {}),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
    ...(input.metadata !== undefined
      ? { metadata: Object.freeze({ ...input.metadata }) }
      : {}),
  });
}

export function normalizeExecutiveStageInteractionIntent(
  intent: ExecutiveStageInteractionIntent,
): ExecutiveCockpitInteractionIntent {
  const kind = intent.kind as ExecutiveCockpitInteractionKind;
  return createExecutiveCockpitInteractionIntent({
    source: "stage",
    kind,
    ...(intent.subjectId !== undefined ? { subjectId: intent.subjectId } : {}),
    ...(kind === "open" || kind === "context-open"
      ? { targetSurface: "stage" as const }
      : {}),
  });
}

export function normalizeExecutiveWorkspaceSelectionIntent(
  intent: ExecutiveWorkspaceSelectionIntent,
): ExecutiveCockpitInteractionIntent {
  return createExecutiveCockpitInteractionIntent({
    source: "workspace-dial",
    kind: "change-workspace",
    workspaceId: intent.workspaceId,
    targetSurface: "workspace-dial",
  });
}

export function normalizeExecutiveAdvisorGuidanceIntent(
  intent: ExecutiveAdvisorGuidanceIntent,
): ExecutiveCockpitInteractionIntent {
  return createExecutiveCockpitInteractionIntent({
    source: "advisor",
    kind: "request-guidance",
    targetSurface: "advisor",
    ...(intent.subjectId !== undefined ? { subjectId: intent.subjectId } : {}),
    metadata: Object.freeze({ contextMode: intent.contextMode }),
  });
}

export function normalizeExecutiveInsightRequestIntent(
  intent: ExecutiveInsightRequestIntent,
): ExecutiveCockpitInteractionIntent {
  return createExecutiveCockpitInteractionIntent({
    source: "insight",
    kind: "request-insight",
    targetSurface: "insight",
    ...(intent.subjectId !== undefined ? { subjectId: intent.subjectId } : {}),
    metadata: Object.freeze({ contextMode: intent.contextMode }),
  });
}

export type ExecutiveCockpitNormalizableIntent =
  | ExecutiveCockpitInteractionIntent
  | ExecutiveStageInteractionIntent
  | ExecutiveWorkspaceSelectionIntent
  | ExecutiveAdvisorGuidanceIntent
  | ExecutiveInsightRequestIntent;

export function normalizeExecutiveCockpitInteractionIntent(
  intent: ExecutiveCockpitNormalizableIntent,
): ExecutiveCockpitInteractionIntent {
  if (
    "kind" in intent &&
    intent.kind === "select-workspace" &&
    intent.source === "workspace-dial"
  ) {
    return normalizeExecutiveWorkspaceSelectionIntent(
      intent as ExecutiveWorkspaceSelectionIntent,
    );
  }
  if (
    "contextMode" in intent &&
    intent.source === "advisor" &&
    !("kind" in intent)
  ) {
    return normalizeExecutiveAdvisorGuidanceIntent(
      intent as ExecutiveAdvisorGuidanceIntent,
    );
  }
  if (
    "contextMode" in intent &&
    intent.source === "insight" &&
    !("kind" in intent)
  ) {
    return normalizeExecutiveInsightRequestIntent(
      intent as ExecutiveInsightRequestIntent,
    );
  }
  if (
    intent.source === "stage" &&
    "kind" in intent &&
    isExecutiveCockpitInteractionKind(intent.kind) &&
    !(
      "workspaceId" in intent ||
      "targetSurface" in intent ||
      "presentationState" in intent ||
      "metadata" in intent ||
      "id" in intent
    )
  ) {
    // Stage-local intents are a narrow envelope; prefer stage normalizer when
    // the payload matches ExecutiveStageInteractionIntent shape.
    const stageLike = intent as ExecutiveStageInteractionIntent & {
      readonly targetSurface?: unknown;
    };
    if (stageLike.targetSurface === undefined) {
      return normalizeExecutiveStageInteractionIntent(stageLike);
    }
  }
  return createExecutiveCockpitInteractionIntent(
    intent as ExecutiveCockpitInteractionIntent,
  );
}

// ─── Snapshot helpers ───────────────────────────────────────────────────────

function freezeSubject(
  subject: ExecutiveCockpitSubjectReference,
): ExecutiveCockpitSubjectReference {
  return Object.freeze({ id: subject.id, kind: subject.kind });
}

function surfaceState(
  snapshot: ExecutiveCockpitOrchestrationSnapshot | ExecutiveAdvisorInsightIntegrationSnapshot,
  surface: ExecutiveCockpitSurface,
) {
  const experience =
    "advisorInsight" in snapshot
      ? snapshot.advisorInsight.experience
      : snapshot.experience;
  return experience.cockpit.surfaces.find((entry) => entry.surface === surface);
}

function isSurfaceParticipating(
  snapshot: ExecutiveCockpitOrchestrationSnapshot,
  surface: ExecutiveCockpitSurface,
): boolean {
  const state = surfaceState(snapshot, surface);
  return state?.available === true && state.enabled === true;
}

function inWorkspaceTransition(
  snapshot: ExecutiveCockpitOrchestrationSnapshot,
): boolean {
  const status = snapshot.advisorInsight.experience.transition?.status;
  return (
    status === "planned" ||
    status === "starting" ||
    status === "transitioning"
  );
}

function resolveSubjectReference(
  snapshot: ExecutiveCockpitOrchestrationSnapshot,
  subjectId: string,
): ExecutiveCockpitSubjectReference | undefined {
  const experience = snapshot.advisorInsight.experience;
  const fromStage = experience.stage.subjects.find(
    (subject) => subject.id === subjectId,
  );
  if (fromStage !== undefined) {
    return freezeSubject({ id: fromStage.id, kind: fromStage.kind });
  }
  const binding = experience.cockpit.binding;
  if (binding.selectedSubject?.id === subjectId) {
    return freezeSubject(binding.selectedSubject);
  }
  if (binding.focusedSubject?.id === subjectId) {
    return freezeSubject(binding.focusedSubject);
  }
  return undefined;
}

function stageOptionsFromExperience(
  advisorInsight: ExecutiveAdvisorInsightIntegrationSnapshot,
): ExecutiveStageSceneOptions {
  const stage = advisorInsight.experience.stage;
  const relatedSubjects = Object.freeze(
    stage.subjects.map((subject) =>
      freezeSubject({ id: subject.id, kind: subject.kind }),
    ),
  );
  const relationships = Object.freeze(
    stage.relationships.map((relationship) =>
      Object.freeze({
        id: relationship.id,
        sourceSubjectId: relationship.sourceSubjectId,
        targetSubjectId: relationship.targetSubjectId,
        kind: relationship.kind,
      }),
    ),
  );
  return Object.freeze({
    previousScene: stage,
    relatedSubjects,
    relationships,
  });
}

function rebuildAdvisorInsight(
  previous: ExecutiveAdvisorInsightIntegrationSnapshot,
  patch: {
    readonly activeSurface?: ExecutiveCockpitSurface;
    readonly selectedSubject?: ExecutiveCockpitSubjectReference | null;
    readonly focusedSubject?: ExecutiveCockpitSubjectReference | null;
    readonly presentationState?: ExecutiveCockpitPresentationState;
    readonly attentionSubjectId?: string | null;
    readonly workspaceIntent?: ExecutiveWorkspaceSelectionIntent;
    readonly action?: "resolve" | "complete" | "cancel";
  },
): ExecutiveAdvisorInsightIntegrationSnapshot {
  const prev = previous.experience;
  const binding = prev.cockpit.binding;
  const selected =
    patch.selectedSubject === null
      ? undefined
      : (patch.selectedSubject ?? binding.selectedSubject);
  const focused =
    patch.focusedSubject === null
      ? undefined
      : (patch.focusedSubject ?? binding.focusedSubject);
  const presentation =
    patch.presentationState ?? binding.presentationState;
  const activeSurface = patch.activeSurface ?? binding.activeSurface;
  const attention =
    patch.attentionSubjectId === null
      ? undefined
      : (patch.attentionSubjectId ?? binding.attentionSubjectId);
  const activeWorkspace =
    prev.currentWorkspace?.kind ?? binding.activeWorkspace;

  const cockpit = resolveCockpitShellRuntimeBinding(
    createExecutiveCockpitIntegrationSnapshot({
      context: {
        workspaceId: prev.cockpit.integration.context.workspaceId,
        modelId: prev.cockpit.integration.context.modelId,
        activeSurface,
        activeWorkspace,
        selectedSubjectId: selected?.id,
        focusedSubjectId: focused?.id,
        presentationState: presentation,
        attentionSubjectId: attention,
      },
      state: {
        activeSurface,
        activeWorkspace,
        selectedSubject: selected,
        focusedSubject: focused,
        presentationState: presentation,
        attentionSubjectId: attention,
        status: prev.cockpit.integration.state.status,
      },
    }),
  );

  const experience = resolveExecutiveWorkspaceExperience({
    cockpit,
    stageOptions: stageOptionsFromExperience(previous),
    currentWorkspace: prev.currentWorkspace,
    intent: patch.workspaceIntent,
    transition: prev.transition,
    action: patch.action,
  });

  return resolveExecutiveAdvisorInsightIntegration(experience);
}

export function createExecutiveCockpitOrchestrationSnapshot(
  advisorInsight: ExecutiveAdvisorInsightIntegrationSnapshot,
  reactions: readonly ExecutiveCockpitReaction[] = [],
): ExecutiveCockpitOrchestrationSnapshot {
  const binding = advisorInsight.experience.cockpit.binding;
  return Object.freeze({
    advisorInsight,
    activeSurface: binding.activeSurface,
    ...(binding.selectedSubject !== undefined
      ? { selectedSubject: freezeSubject(binding.selectedSubject) }
      : {}),
    ...(binding.focusedSubject !== undefined
      ? { focusedSubject: freezeSubject(binding.focusedSubject) }
      : {}),
    ...(advisorInsight.experience.currentWorkspace !== undefined
      ? { currentWorkspace: advisorInsight.experience.currentWorkspace }
      : {}),
    ...(advisorInsight.experience.targetWorkspace !== undefined
      ? { targetWorkspace: advisorInsight.experience.targetWorkspace }
      : {}),
    ...(binding.presentationState !== undefined
      ? { presentationState: binding.presentationState }
      : {}),
    reactions: Object.freeze([...reactions]),
    status: binding.integrationStatus,
    orchestrationIdentity: cockpitInteractionOrchestrationIdentity,
    orchestrationVersion: cockpitInteractionOrchestrationVersion,
  });
}

export function resolveExecutiveCockpitOrchestrationSnapshot(
  advisorInsight: ExecutiveAdvisorInsightIntegrationSnapshot,
): ExecutiveCockpitOrchestrationSnapshot {
  return createExecutiveCockpitOrchestrationSnapshot(advisorInsight);
}

// ─── Priority / reaction helpers ────────────────────────────────────────────

export function resolveExecutiveCockpitInteractionPriority(
  intent: ExecutiveCockpitInteractionIntent,
): ExecutiveCockpitInteractionPriority {
  switch (intent.kind) {
    case "change-workspace":
      return "critical";
    case "focus":
    case "clear-focus":
    case "change-presentation":
      return "high";
    case "dismiss":
      return "low";
    default:
      return "normal";
  }
}

function reactionKey(reaction: ExecutiveCockpitReaction): string {
  return [
    reaction.kind,
    reaction.targetSurface ?? "",
    reaction.subjectId ?? "",
    reaction.workspaceId ?? "",
    reaction.priority,
  ].join("\u0001");
}

function compareReactions(
  a: ExecutiveCockpitReaction,
  b: ExecutiveCockpitReaction,
): number {
  const orderDiff =
    REACTION_KIND_ORDER[a.kind] - REACTION_KIND_ORDER[b.kind];
  if (orderDiff !== 0) {
    return orderDiff;
  }
  const priorityDiff =
    PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  if (priorityDiff !== 0) {
    return priorityDiff;
  }
  const surfaceA = a.targetSurface ?? "";
  const surfaceB = b.targetSurface ?? "";
  if (surfaceA !== surfaceB) {
    return surfaceA < surfaceB ? -1 : 1;
  }
  const subjectA = a.subjectId ?? "";
  const subjectB = b.subjectId ?? "";
  if (subjectA !== subjectB) {
    return subjectA < subjectB ? -1 : 1;
  }
  const workspaceA = a.workspaceId ?? "";
  const workspaceB = b.workspaceId ?? "";
  if (workspaceA !== workspaceB) {
    return workspaceA < workspaceB ? -1 : 1;
  }
  return 0;
}

function dedupeAndSortReactions(
  reactions: readonly ExecutiveCockpitReaction[],
): readonly ExecutiveCockpitReaction[] {
  const seen = new Set<string>();
  const unique: ExecutiveCockpitReaction[] = [];
  for (const reaction of reactions) {
    const key = reactionKey(reaction);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(reaction);
  }
  return Object.freeze(unique.sort(compareReactions));
}

function makeReaction(
  kind: ExecutiveCockpitReactionKind,
  priority: ExecutiveCockpitInteractionPriority,
  extras: {
    readonly targetSurface?: ExecutiveCockpitSurface;
    readonly subjectId?: string;
    readonly workspaceId?: string;
  } = {},
): ExecutiveCockpitReaction {
  return Object.freeze({
    kind,
    priority,
    ...(extras.targetSurface !== undefined
      ? { targetSurface: extras.targetSurface }
      : {}),
    ...(extras.subjectId !== undefined ? { subjectId: extras.subjectId } : {}),
    ...(extras.workspaceId !== undefined
      ? { workspaceId: extras.workspaceId }
      : {}),
  });
}

function supportingContextReactions(
  priority: ExecutiveCockpitInteractionPriority,
  subjectId?: string,
  workspaceId?: string,
): ExecutiveCockpitReaction[] {
  return [
    makeReaction("update-timeline", priority, {
      targetSurface: "timeline",
      subjectId,
      workspaceId,
    }),
    makeReaction("update-explorer", priority, {
      targetSurface: "explorer",
      subjectId,
      workspaceId,
    }),
    makeReaction("update-live-lens", priority, {
      targetSurface: "live-lens",
      subjectId,
      workspaceId,
    }),
    makeReaction("update-context-bar", priority, {
      targetSurface: "context-bar",
      subjectId,
      workspaceId,
    }),
    makeReaction("update-status", priority, {
      targetSurface: "status",
      subjectId,
      workspaceId,
    }),
  ];
}

// ─── Validation / resolution ────────────────────────────────────────────────

function resolution(
  status: ExecutiveCockpitInteractionResolutionStatus,
  reason: ExecutiveCockpitInteractionResolutionReason,
  intent: ExecutiveCockpitInteractionIntent,
  priority: ExecutiveCockpitInteractionPriority,
): ExecutiveCockpitInteractionResolution {
  return Object.freeze({ status, reason, intent, priority });
}

export function resolveExecutiveCockpitInteraction(
  snapshot: ExecutiveCockpitOrchestrationSnapshot,
  rawIntent: ExecutiveCockpitNormalizableIntent,
): ExecutiveCockpitInteractionResolution {
  let intent: ExecutiveCockpitInteractionIntent;
  try {
    intent = normalizeExecutiveCockpitInteractionIntent(rawIntent);
  } catch {
    const fallback = Object.freeze({
      source: "stage" as const,
      kind: "select" as const,
    });
    return resolution(
      "rejected",
      "invalid-kind",
      fallback,
      "normal",
    );
  }

  const priority = resolveExecutiveCockpitInteractionPriority(intent);

  if (!isExecutiveCockpitInteractionSource(intent.source)) {
    return resolution("rejected", "invalid-source", intent, priority);
  }
  if (!isExecutiveCockpitInteractionKind(intent.kind)) {
    return resolution("rejected", "invalid-kind", intent, priority);
  }
  if (!isSourceCapableOfInteraction(intent.source, intent.kind)) {
    return resolution("rejected", "unsupported-by-source", intent, priority);
  }

  if (
    (KINDS_REQUIRING_SUBJECT as readonly string[]).includes(intent.kind) &&
    (intent.subjectId === undefined || intent.subjectId.length === 0)
  ) {
    return resolution("rejected", "missing-subject", intent, priority);
  }

  if (
    (KINDS_REQUIRING_WORKSPACE as readonly string[]).includes(intent.kind) &&
    (intent.workspaceId === undefined || intent.workspaceId.length === 0)
  ) {
    return resolution("rejected", "missing-workspace", intent, priority);
  }

  if (
    (KINDS_REQUIRING_PRESENTATION as readonly string[]).includes(intent.kind)
  ) {
    if (
      intent.presentationState === undefined ||
      !isExecutiveCockpitPresentationState(intent.presentationState)
    ) {
      return resolution("rejected", "incompatible-context", intent, priority);
    }
  }

  if (
    intent.targetSurface !== undefined &&
    !isExecutiveCockpitSurface(intent.targetSurface)
  ) {
    return resolution("rejected", "unsupported-by-target", intent, priority);
  }

  if (
    (KINDS_REQUIRING_TARGET_SURFACE as readonly string[]).includes(intent.kind)
  ) {
    const target =
      intent.targetSurface ??
      (intent.source === "navigation" ? undefined : intent.source);
    if (target === undefined || !isExecutiveCockpitSurface(target)) {
      return resolution("rejected", "unsupported-by-target", intent, priority);
    }
    if (!isSurfaceParticipating(snapshot, target)) {
      return resolution("rejected", "surface-unavailable", intent, priority);
    }
  }

  if (intent.kind === "request-guidance") {
    if (!isSurfaceParticipating(snapshot, "advisor")) {
      return resolution("rejected", "surface-unavailable", intent, priority);
    }
    if (snapshot.advisorInsight.advisor.readiness === "unavailable") {
      return resolution("rejected", "surface-unavailable", intent, priority);
    }
  }

  if (intent.kind === "request-insight") {
    if (!isSurfaceParticipating(snapshot, "insight")) {
      return resolution("rejected", "surface-unavailable", intent, priority);
    }
    if (snapshot.advisorInsight.insight.readiness === "unavailable") {
      return resolution("rejected", "surface-unavailable", intent, priority);
    }
  }

  if (
    intent.kind === "change-workspace" &&
    intent.workspaceId !== undefined
  ) {
    const dial = snapshot.advisorInsight.experience.dial;
    const selection = resolveExecutiveWorkspaceSelection(
      dial,
      createExecutiveWorkspaceSelectionIntent(intent.workspaceId),
    );
    if (!selection.accepted) {
      if (selection.reason === "already-active") {
        return resolution("ignored", "no-op", intent, priority);
      }
      if (selection.reason === "transition-in-progress") {
        return resolution(
          "rejected",
          "transition-in-progress",
          intent,
          priority,
        );
      }
      if (
        selection.reason === "unavailable" ||
        selection.reason === "disabled"
      ) {
        return resolution("rejected", "surface-unavailable", intent, priority);
      }
      return resolution("rejected", "incompatible-context", intent, priority);
    }
  }

  if (
    (intent.kind === "focus" || intent.kind === "clear-focus") &&
    inWorkspaceTransition(snapshot)
  ) {
    return resolution("deferred", "transition-in-progress", intent, priority);
  }

  if (intent.kind === "select" && intent.subjectId !== undefined) {
    if (resolveSubjectReference(snapshot, intent.subjectId) === undefined) {
      return resolution("rejected", "incompatible-context", intent, priority);
    }
    if (snapshot.selectedSubject?.id === intent.subjectId) {
      return resolution("ignored", "no-op", intent, priority);
    }
  }

  if (intent.kind === "focus" && intent.subjectId !== undefined) {
    if (resolveSubjectReference(snapshot, intent.subjectId) === undefined) {
      return resolution("rejected", "incompatible-context", intent, priority);
    }
    if (snapshot.focusedSubject?.id === intent.subjectId) {
      return resolution("ignored", "no-op", intent, priority);
    }
  }

  if (
    intent.kind === "clear-selection" &&
    snapshot.selectedSubject === undefined
  ) {
    return resolution("ignored", "no-op", intent, priority);
  }

  if (intent.kind === "clear-focus" && snapshot.focusedSubject === undefined) {
    return resolution("ignored", "no-op", intent, priority);
  }

  if (intent.kind === "change-presentation") {
    if (snapshot.presentationState === intent.presentationState) {
      return resolution("ignored", "no-op", intent, priority);
    }
  }

  if (intent.kind === "activate") {
    const target = intent.targetSurface ?? intent.source;
    if (!isExecutiveCockpitSurface(target)) {
      return resolution("rejected", "unsupported-by-target", intent, priority);
    }
    if (snapshot.activeSurface === target) {
      return resolution("ignored", "already-active", intent, priority);
    }
  }

  if (intent.kind === "deactivate") {
    const target = intent.targetSurface ?? intent.source;
    if (snapshot.activeSurface !== target) {
      return resolution("ignored", "no-op", intent, priority);
    }
  }

  return resolution("accepted", "accepted", intent, priority);
}

// ─── Reaction planning ──────────────────────────────────────────────────────

export function planExecutiveCockpitReactions(
  snapshot: ExecutiveCockpitOrchestrationSnapshot,
  resolutionResult: ExecutiveCockpitInteractionResolution,
): readonly ExecutiveCockpitReaction[] {
  if (resolutionResult.status !== "accepted") {
    return Object.freeze([]);
  }

  const { intent, priority } = resolutionResult;
  const reactions: ExecutiveCockpitReaction[] = [];
  const subjectId = intent.subjectId;
  const workspaceId = intent.workspaceId;

  switch (intent.kind) {
    case "select": {
      reactions.push(
        makeReaction("update-selection", priority, {
          targetSurface: "stage",
          subjectId,
        }),
        makeReaction("update-stage", priority, {
          targetSurface: "stage",
          subjectId,
        }),
        makeReaction("update-advisor", priority, {
          targetSurface: "advisor",
          subjectId,
        }),
        makeReaction("update-insight", priority, {
          targetSurface: "insight",
          subjectId,
        }),
        ...supportingContextReactions(priority, subjectId),
      );
      break;
    }
    case "focus": {
      reactions.push(
        makeReaction("update-focus", priority, {
          targetSurface: "stage",
          subjectId,
        }),
        makeReaction("update-attention", priority, {
          targetSurface: "stage",
          subjectId,
        }),
        makeReaction("update-stage", priority, {
          targetSurface: "stage",
          subjectId,
        }),
        makeReaction("update-advisor", priority, {
          targetSurface: "advisor",
          subjectId,
        }),
        makeReaction("update-insight", priority, {
          targetSurface: "insight",
          subjectId,
        }),
        ...supportingContextReactions(priority, subjectId),
      );
      break;
    }
    case "clear-selection": {
      reactions.push(
        makeReaction("update-selection", priority, {
          targetSurface: "stage",
        }),
        makeReaction("update-stage", priority, { targetSurface: "stage" }),
        makeReaction("update-advisor", priority, {
          targetSurface: "advisor",
        }),
        makeReaction("update-insight", priority, {
          targetSurface: "insight",
        }),
        ...supportingContextReactions(priority),
      );
      break;
    }
    case "clear-focus": {
      reactions.push(
        makeReaction("update-focus", priority, { targetSurface: "stage" }),
        makeReaction("update-attention", priority, {
          targetSurface: "stage",
        }),
        makeReaction("restore-cockpit", priority),
        makeReaction("update-stage", priority, { targetSurface: "stage" }),
        makeReaction("update-advisor", priority, {
          targetSurface: "advisor",
        }),
        makeReaction("update-insight", priority, {
          targetSurface: "insight",
        }),
        ...supportingContextReactions(priority),
      );
      break;
    }
    case "change-workspace": {
      reactions.push(
        makeReaction("update-workspace", "critical", {
          targetSurface: "workspace-dial",
          workspaceId,
        }),
        makeReaction("update-stage", "critical", {
          targetSurface: "stage",
          workspaceId,
        }),
        makeReaction("update-advisor", "critical", {
          targetSurface: "advisor",
          workspaceId,
        }),
        makeReaction("update-insight", "critical", {
          targetSurface: "insight",
          workspaceId,
        }),
        ...supportingContextReactions("critical", undefined, workspaceId),
        makeReaction("update-navigation", "critical", {
          targetSurface: "navigation",
          workspaceId,
        }),
      );
      break;
    }
    case "change-presentation": {
      reactions.push(...planPresentationReactions(priority));
      break;
    }
    case "request-guidance": {
      reactions.push(
        makeReaction("update-advisor", priority, {
          targetSurface: "advisor",
          subjectId,
        }),
        makeReaction("update-status", priority, {
          targetSurface: "status",
          subjectId,
        }),
      );
      break;
    }
    case "request-insight": {
      reactions.push(
        makeReaction("update-insight", priority, {
          targetSurface: "insight",
          subjectId,
        }),
        makeReaction("update-status", priority, {
          targetSurface: "status",
          subjectId,
        }),
      );
      break;
    }
    case "activate": {
      const target = (intent.targetSurface ?? intent.source) as ExecutiveCockpitSurface;
      reactions.push(
        makeReaction("activate-surface", priority, {
          targetSurface: target,
        }),
        makeReaction("update-navigation", priority, {
          targetSurface: "navigation",
        }),
        makeReaction("update-status", priority, { targetSurface: "status" }),
      );
      break;
    }
    case "deactivate": {
      const target = (intent.targetSurface ?? intent.source) as ExecutiveCockpitSurface;
      reactions.push(
        makeReaction("deactivate-surface", priority, {
          targetSurface: target,
        }),
        makeReaction("activate-surface", priority, {
          targetSurface: "stage",
        }),
        makeReaction("update-status", priority, { targetSurface: "status" }),
      );
      break;
    }
    case "open": {
      const target = (intent.targetSurface ?? intent.source) as ExecutiveCockpitSurface;
      reactions.push(
        makeReaction("open-surface", priority, { targetSurface: target }),
        makeReaction("update-status", priority, { targetSurface: "status" }),
      );
      break;
    }
    case "close": {
      const target = (intent.targetSurface ?? intent.source) as ExecutiveCockpitSurface;
      reactions.push(
        makeReaction("close-surface", priority, { targetSurface: target }),
        makeReaction("update-status", priority, { targetSurface: "status" }),
      );
      break;
    }
    case "dismiss": {
      const target = (intent.targetSurface ?? intent.source) as ExecutiveCockpitSurface;
      reactions.push(
        makeReaction("close-surface", "low", { targetSurface: target }),
        makeReaction("update-status", "low", { targetSurface: "status" }),
      );
      break;
    }
    case "navigate": {
      const target = intent.targetSurface;
      reactions.push(
        makeReaction("update-navigation", priority, {
          targetSurface: "navigation",
          subjectId,
          workspaceId,
        }),
        ...(target !== undefined
          ? [
              makeReaction("activate-surface", priority, {
                targetSurface: target,
              }),
            ]
          : []),
        makeReaction("update-status", priority, { targetSurface: "status" }),
      );
      break;
    }
    case "context-open": {
      reactions.push(
        makeReaction("update-context-bar", priority, {
          targetSurface: "context-bar",
          subjectId,
        }),
        makeReaction("update-status", priority, {
          targetSurface: "status",
          subjectId,
        }),
      );
      break;
    }
    default:
      break;
  }

  void snapshot;
  return dedupeAndSortReactions(reactions);
}

function planPresentationReactions(
  priority: ExecutiveCockpitInteractionPriority,
): ExecutiveCockpitReaction[] {
  return [
    makeReaction("update-presentation", priority),
    makeReaction("update-stage", priority, { targetSurface: "stage" }),
    makeReaction("update-advisor", priority, { targetSurface: "advisor" }),
    makeReaction("update-insight", priority, { targetSurface: "insight" }),
    ...supportingContextReactions(priority),
  ];
}

// ─── Main orchestrator ──────────────────────────────────────────────────────

function applyAcceptedIntent(
  snapshot: ExecutiveCockpitOrchestrationSnapshot,
  intent: ExecutiveCockpitInteractionIntent,
): ExecutiveAdvisorInsightIntegrationSnapshot {
  switch (intent.kind) {
    case "select": {
      const subject = resolveSubjectReference(snapshot, intent.subjectId!);
      return rebuildAdvisorInsight(snapshot.advisorInsight, {
        selectedSubject: subject,
        attentionSubjectId: subject?.id,
      });
    }
    case "focus": {
      const subject = resolveSubjectReference(snapshot, intent.subjectId!);
      return rebuildAdvisorInsight(snapshot.advisorInsight, {
        focusedSubject: subject,
        attentionSubjectId: subject?.id,
      });
    }
    case "clear-selection":
      return rebuildAdvisorInsight(snapshot.advisorInsight, {
        selectedSubject: null,
      });
    case "clear-focus":
      return rebuildAdvisorInsight(snapshot.advisorInsight, {
        focusedSubject: null,
        attentionSubjectId: null,
      });
    case "change-workspace":
      return rebuildAdvisorInsight(snapshot.advisorInsight, {
        workspaceIntent: createExecutiveWorkspaceSelectionIntent(
          intent.workspaceId!,
        ),
      });
    case "change-presentation":
      return rebuildAdvisorInsight(snapshot.advisorInsight, {
        presentationState: intent.presentationState,
      });
    case "activate":
      return rebuildAdvisorInsight(snapshot.advisorInsight, {
        activeSurface: (intent.targetSurface ??
          intent.source) as ExecutiveCockpitSurface,
      });
    case "deactivate":
      return rebuildAdvisorInsight(snapshot.advisorInsight, {
        activeSurface: "stage",
      });
    case "navigate":
      return rebuildAdvisorInsight(snapshot.advisorInsight, {
        activeSurface: intent.targetSurface ?? snapshot.activeSurface,
      });
    case "request-guidance":
    case "request-insight":
    case "open":
    case "close":
    case "dismiss":
    case "context-open":
      return snapshot.advisorInsight;
    default:
      return snapshot.advisorInsight;
  }
}

export function orchestrateExecutiveCockpitInteraction(
  snapshot: ExecutiveCockpitOrchestrationSnapshot,
  rawIntent: ExecutiveCockpitNormalizableIntent,
): ExecutiveCockpitInteractionResult {
  const resolutionResult = resolveExecutiveCockpitInteraction(
    snapshot,
    rawIntent,
  );

  const reactions =
    resolutionResult.status === "accepted"
      ? planExecutiveCockpitReactions(snapshot, resolutionResult)
      : Object.freeze([] as ExecutiveCockpitReaction[]);

  const nextAdvisorInsight =
    resolutionResult.status === "accepted"
      ? applyAcceptedIntent(snapshot, resolutionResult.intent)
      : snapshot.advisorInsight;

  const nextSnapshot = createExecutiveCockpitOrchestrationSnapshot(
    nextAdvisorInsight,
    reactions,
  );

  return Object.freeze({
    resolution: resolutionResult,
    reactions,
    snapshot: nextSnapshot,
  });
}

export function resolveExecutiveCockpitSnapshotReactions(
  previous: ExecutiveCockpitOrchestrationSnapshot | undefined,
  next: ExecutiveCockpitOrchestrationSnapshot,
): readonly ExecutiveCockpitReaction[] {
  if (previous === undefined) {
    return Object.freeze([
      makeReaction("restore-cockpit", "normal"),
      makeReaction("update-status", "normal", { targetSurface: "status" }),
    ]);
  }

  const reactions: ExecutiveCockpitReaction[] = [];
  if (
    (previous.selectedSubject?.id ?? "") !==
    (next.selectedSubject?.id ?? "")
  ) {
    reactions.push(
      makeReaction("update-selection", "normal", {
        targetSurface: "stage",
        subjectId: next.selectedSubject?.id,
      }),
    );
  }
  if (
    (previous.focusedSubject?.id ?? "") !== (next.focusedSubject?.id ?? "")
  ) {
    reactions.push(
      makeReaction("update-focus", "high", {
        targetSurface: "stage",
        subjectId: next.focusedSubject?.id,
      }),
    );
  }
  if (
    (previous.currentWorkspace?.id ?? "") !==
      (next.currentWorkspace?.id ?? "") ||
    (previous.targetWorkspace?.id ?? "") !== (next.targetWorkspace?.id ?? "")
  ) {
    reactions.push(
      makeReaction("update-workspace", "critical", {
        targetSurface: "workspace-dial",
        workspaceId: next.targetWorkspace?.id ?? next.currentWorkspace?.id,
      }),
    );
  }
  if (previous.presentationState !== next.presentationState) {
    reactions.push(makeReaction("update-presentation", "high"));
  }
  if (previous.activeSurface !== next.activeSurface) {
    reactions.push(
      makeReaction("activate-surface", "normal", {
        targetSurface: next.activeSurface,
      }),
    );
  }
  if (previous.status !== next.status) {
    reactions.push(
      makeReaction("update-status", "normal", { targetSurface: "status" }),
    );
  }

  if (reactions.length > 0) {
    reactions.push(
      makeReaction("update-stage", "normal", { targetSurface: "stage" }),
      makeReaction("update-advisor", "normal", { targetSurface: "advisor" }),
      makeReaction("update-insight", "normal", { targetSurface: "insight" }),
    );
  }

  return dedupeAndSortReactions(reactions);
}

export function createExecutiveCockpitInteractionRecord(
  result: ExecutiveCockpitInteractionResult,
): ExecutiveCockpitInteractionRecord {
  return Object.freeze({
    source: result.resolution.intent.source,
    kind: result.resolution.intent.kind,
    status: result.resolution.status,
    reason: result.resolution.reason,
  });
}

// ─── Validation ─────────────────────────────────────────────────────────────

export interface ExecutiveCockpitInteractionOrchestrationValidation {
  readonly ok: boolean;
  readonly identity: typeof cockpitInteractionOrchestrationIdentity;
  readonly version: typeof cockpitInteractionOrchestrationVersion;
  readonly namespace: typeof cockpitInteractionOrchestrationNamespace;
  readonly phase: typeof cockpitInteractionOrchestrationPhase;
  readonly architecturalRole: typeof cockpitInteractionOrchestrationArchitecturalRole;
  readonly dependencyIdentity: typeof cockpitInteractionOrchestrationDependencyIdentity;
  readonly sourceCount: number;
  readonly kindCount: number;
  readonly resolutionStatusCount: number;
  readonly resolutionReasonCount: number;
  readonly priorityCount: number;
  readonly reactionKindCount: number;
  readonly guaranteeCount: number;
  readonly invariantCount: number;
  readonly advisorInsightOk: boolean;
  readonly matrixComplete: boolean;
  readonly frozen: boolean;
  readonly frameworkIndependent: boolean;
  readonly intelligenceIndependent: boolean;
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

export function validateExecutiveCockpitInteractionOrchestration(
  snapshot?: ExecutiveCockpitOrchestrationSnapshot,
): ExecutiveCockpitInteractionOrchestrationValidation {
  const advisorInsight = verifyAdvisorInsightIntegration();

  const identityOk =
    cockpitInteractionOrchestrationIdentity ===
      "NEX-CI:6/CockpitInteractionOrchestration" &&
    cockpitInteractionOrchestrationVersion === "1.6.0" &&
    cockpitInteractionOrchestrationNamespace ===
      "nexora.executive.cockpit.integration.interaction-orchestration" &&
    cockpitInteractionOrchestrationPhase ===
      "CockpitInteractionOrchestration" &&
    cockpitInteractionOrchestrationArchitecturalRole ===
      "CockpitInteractionOrchestration" &&
    cockpitInteractionOrchestrationDependencyIdentity ===
      "NEX-CI:5/AdvisorInsightIntegration" &&
    cockpitInteractionOrchestrationDependencyIdentity ===
      advisorInsightIntegrationIdentity &&
    COCKPIT_INTERACTION_ORCHESTRATION_BOUNDARY.consumesNexCi5Only === true &&
    COCKPIT_INTERACTION_ORCHESTRATION_BOUNDARY.implementsNexCi7 === false;

  const vocabularyOk =
    exactOrder(EXECUTIVE_COCKPIT_INTERACTION_SOURCES, [
      ...EXECUTIVE_COCKPIT_SURFACES,
    ]) &&
    unique([...EXECUTIVE_COCKPIT_INTERACTION_SOURCES]) &&
    unique([...EXECUTIVE_COCKPIT_INTERACTION_KINDS]) &&
    unique([...EXECUTIVE_COCKPIT_INTERACTION_RESOLUTION_STATUSES]) &&
    unique([...EXECUTIVE_COCKPIT_INTERACTION_RESOLUTION_REASONS]) &&
    unique([...EXECUTIVE_COCKPIT_INTERACTION_PRIORITIES]) &&
    unique([...EXECUTIVE_COCKPIT_REACTION_KINDS]);

  const matrixComplete = EXECUTIVE_COCKPIT_INTERACTION_SOURCES.every(
    (source) => {
      const kinds = EXECUTIVE_COCKPIT_SOURCE_CAPABILITY_MATRIX[source];
      return (
        Array.isArray(kinds) &&
        kinds.length > 0 &&
        unique([...kinds]) &&
        kinds.every((kind) => isExecutiveCockpitInteractionKind(kind))
      );
    },
  );

  let snapshotOk = true;
  if (snapshot !== undefined) {
    snapshotOk =
      Object.isFrozen(snapshot) &&
      Object.isFrozen(snapshot.reactions) &&
      isExecutiveCockpitSurface(snapshot.activeSurface) &&
      snapshot.orchestrationIdentity ===
        cockpitInteractionOrchestrationIdentity &&
      snapshot.reactions.every(
        (reaction) =>
          isExecutiveCockpitReactionKind(reaction.kind) &&
          isExecutiveCockpitInteractionPriority(reaction.priority) &&
          Object.isFrozen(reaction),
      ) &&
      (!("targetWorkspace" in snapshot.advisorInsight.insight.context));
  }

  const guaranteesOk =
    COCKPIT_INTERACTION_ORCHESTRATION_GUARANTEES.length === 26 &&
    exactOrder(
      COCKPIT_INTERACTION_ORCHESTRATION_GUARANTEES.map((entry) => entry.id),
      [
        "nex-ci-5-sole-immediate-dependency",
        "surfaces-never-directly-mutate-each-other",
        "canonical-interaction-source",
        "canonical-interaction-kind",
        "source-capabilities-enforced",
        "target-capabilities-enforced",
        "focus-selection-remain-distinct",
        "workspace-current-target-distinct",
        "workspace-transition-reuses-nex-ci-4",
        "presentation-reuses-canonical",
        "advisor-insight-remain-independent",
        "no-timeline-detail",
        "no-explorer-detail",
        "no-live-lens-detail",
        "reactions-deterministic",
        "reaction-ordering-deterministic",
        "duplicate-reactions-removed",
        "noop-no-unnecessary-mutations",
        "unavailable-surfaces-enforced",
        "inputs-not-mutated",
        "no-react-dependency",
        "no-threejs-dependency",
        "no-ai-sdk-dependency",
        "no-network-side-effects",
        "no-persistence",
        "no-nex-ci-7-behavior",
      ],
    );

  const immutabilityOk =
    Object.isFrozen(cockpitInteractionOrchestrationCanonicalIdentity) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_INTERACTION_SOURCES) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_INTERACTION_KINDS) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_INTERACTION_RESOLUTION_STATUSES) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_INTERACTION_RESOLUTION_REASONS) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_INTERACTION_PRIORITIES) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_REACTION_KINDS) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_SOURCE_CAPABILITY_MATRIX) &&
    Object.isFrozen(COCKPIT_INTERACTION_ORCHESTRATION_GUARANTEES) &&
    Object.isFrozen(COCKPIT_INTERACTION_ORCHESTRATION_BOUNDARY) &&
    Object.isFrozen(cockpitInteractionOrchestration);

  const frameworkIndependent =
    COCKPIT_INTERACTION_ORCHESTRATION_BOUNDARY.frameworkIndependent === true &&
    COCKPIT_INTERACTION_ORCHESTRATION_BOUNDARY.introducesReact === false &&
    COCKPIT_INTERACTION_ORCHESTRATION_BOUNDARY.introducesThreeJs === false &&
    COCKPIT_INTERACTION_ORCHESTRATION_BOUNDARY.introducesReactThreeFiber ===
      false &&
    COCKPIT_INTERACTION_ORCHESTRATION_BOUNDARY.implementsNexCi7 === false;

  const intelligenceIndependent =
    COCKPIT_INTERACTION_ORCHESTRATION_BOUNDARY
      .intelligenceProviderIndependent === true &&
    COCKPIT_INTERACTION_ORCHESTRATION_BOUNDARY.ownsAiExecution === false &&
    COCKPIT_INTERACTION_ORCHESTRATION_BOUNDARY.ownsContentGeneration ===
      false &&
    COCKPIT_INTERACTION_ORCHESTRATION_BOUNDARY.ownsNetworkAccess === false &&
    COCKPIT_INTERACTION_ORCHESTRATION_BOUNDARY.introducesAiSdk === false;

  const ok =
    identityOk &&
    vocabularyOk &&
    matrixComplete &&
    snapshotOk &&
    guaranteesOk &&
    immutabilityOk &&
    frameworkIndependent &&
    intelligenceIndependent &&
    advisorInsight.ok === true;

  return Object.freeze({
    ok,
    identity: cockpitInteractionOrchestrationIdentity,
    version: cockpitInteractionOrchestrationVersion,
    namespace: cockpitInteractionOrchestrationNamespace,
    phase: cockpitInteractionOrchestrationPhase,
    architecturalRole: cockpitInteractionOrchestrationArchitecturalRole,
    dependencyIdentity: cockpitInteractionOrchestrationDependencyIdentity,
    sourceCount: EXECUTIVE_COCKPIT_INTERACTION_SOURCES.length,
    kindCount: EXECUTIVE_COCKPIT_INTERACTION_KINDS.length,
    resolutionStatusCount:
      EXECUTIVE_COCKPIT_INTERACTION_RESOLUTION_STATUSES.length,
    resolutionReasonCount:
      EXECUTIVE_COCKPIT_INTERACTION_RESOLUTION_REASONS.length,
    priorityCount: EXECUTIVE_COCKPIT_INTERACTION_PRIORITIES.length,
    reactionKindCount: EXECUTIVE_COCKPIT_REACTION_KINDS.length,
    guaranteeCount: COCKPIT_INTERACTION_ORCHESTRATION_GUARANTEES.length,
    invariantCount: COCKPIT_INTERACTION_ORCHESTRATION_GUARANTEES.length,
    advisorInsightOk: advisorInsight.ok,
    matrixComplete,
    frozen: immutabilityOk,
    frameworkIndependent,
    intelligenceIndependent,
  });
}

export function verifyCockpitInteractionOrchestration():
  ExecutiveCockpitInteractionOrchestrationValidation {
  return validateExecutiveCockpitInteractionOrchestration();
}

// ─── Public catalogs / module bag ───────────────────────────────────────────

export const cockpitInteractionOrchestrationApiNames = Object.freeze([
  "getCockpitInteractionOrchestrationIdentity",
  "getExecutiveCockpitInteractionSources",
  "isExecutiveCockpitInteractionSource",
  "getExecutiveCockpitInteractionKinds",
  "isExecutiveCockpitInteractionKind",
  "getExecutiveCockpitInteractionResolutionStatuses",
  "isExecutiveCockpitInteractionResolutionStatus",
  "getExecutiveCockpitInteractionResolutionReasons",
  "isExecutiveCockpitInteractionResolutionReason",
  "getExecutiveCockpitInteractionPriorities",
  "isExecutiveCockpitInteractionPriority",
  "getExecutiveCockpitReactionKinds",
  "isExecutiveCockpitReactionKind",
  "getExecutiveCockpitSourceCapabilityMatrix",
  "isSourceCapableOfInteraction",
  "createExecutiveCockpitInteractionIntent",
  "normalizeExecutiveCockpitInteractionIntent",
  "normalizeExecutiveStageInteractionIntent",
  "normalizeExecutiveWorkspaceSelectionIntent",
  "normalizeExecutiveAdvisorGuidanceIntent",
  "normalizeExecutiveInsightRequestIntent",
  "resolveExecutiveCockpitInteractionPriority",
  "resolveExecutiveCockpitInteraction",
  "planExecutiveCockpitReactions",
  "createExecutiveCockpitOrchestrationSnapshot",
  "resolveExecutiveCockpitOrchestrationSnapshot",
  "orchestrateExecutiveCockpitInteraction",
  "resolveExecutiveCockpitSnapshotReactions",
  "createExecutiveCockpitInteractionRecord",
  "validateExecutiveCockpitInteractionOrchestration",
  "verifyCockpitInteractionOrchestration",
] as const);

export const COCKPIT_INTERACTION_ORCHESTRATION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "ExecutiveCockpitInteractionSource",
    "ExecutiveCockpitInteractionKind",
    "ExecutiveCockpitInteractionIntent",
    "ExecutiveCockpitInteractionResolutionStatus",
    "ExecutiveCockpitInteractionResolutionReason",
    "ExecutiveCockpitInteractionResolution",
    "ExecutiveCockpitInteractionPriority",
    "ExecutiveCockpitReactionKind",
    "ExecutiveCockpitReaction",
    "ExecutiveCockpitOrchestrationSnapshot",
    "ExecutiveCockpitInteractionResult",
    "ExecutiveCockpitInteractionRecord",
    "ExecutiveCockpitSourceCapabilityMatrix",
    "ExecutiveCockpitNormalizableIntent",
    "ExecutiveCockpitInteractionOrchestrationValidation",
  ] as const);

export const cockpitInteractionOrchestration = Object.freeze({
  phase: "CockpitInteractionOrchestration" as const,
  name: "CockpitInteractionOrchestration" as const,
  identity: cockpitInteractionOrchestrationIdentity,
  version: cockpitInteractionOrchestrationVersion,
  namespace: cockpitInteractionOrchestrationNamespace,
  layer: cockpitInteractionOrchestrationLayer,
  stage: cockpitInteractionOrchestrationStage,
  architecturalRole: cockpitInteractionOrchestrationArchitecturalRole,
  role: "CockpitInteractionOrchestration" as const,
  status: cockpitInteractionOrchestrationStability,
  upstreamDependency: cockpitInteractionOrchestrationDependencyIdentity,
  dependencyPath: cockpitInteractionOrchestrationDependencyPath,
  deterministic: cockpitInteractionOrchestrationDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  intelligenceProviderIndependent: true as const,
  browserIndependent: true as const,
  principle: EXECUTIVE_COCKPIT_ORCHESTRATION_PRINCIPLE,
  boundary: COCKPIT_INTERACTION_ORCHESTRATION_BOUNDARY,
  interactionSources: EXECUTIVE_COCKPIT_INTERACTION_SOURCES,
  interactionKinds: EXECUTIVE_COCKPIT_INTERACTION_KINDS,
  resolutionStatuses: EXECUTIVE_COCKPIT_INTERACTION_RESOLUTION_STATUSES,
  resolutionReasons: EXECUTIVE_COCKPIT_INTERACTION_RESOLUTION_REASONS,
  priorities: EXECUTIVE_COCKPIT_INTERACTION_PRIORITIES,
  reactionKinds: EXECUTIVE_COCKPIT_REACTION_KINDS,
  sourceCapabilityMatrix: EXECUTIVE_COCKPIT_SOURCE_CAPABILITY_MATRIX,
  reactionOrderPolicy: EXECUTIVE_COCKPIT_REACTION_ORDER_POLICY,
  guarantees: COCKPIT_INTERACTION_ORCHESTRATION_GUARANTEES,
  forbiddenResponsibilities:
    COCKPIT_INTERACTION_ORCHESTRATION_FORBIDDEN_RESPONSIBILITIES,
  publicApiSurface: cockpitInteractionOrchestrationApiNames,
  publicTypes: COCKPIT_INTERACTION_ORCHESTRATION_PUBLIC_TYPE_NAMES,
  nexCi5Boundary: "NEX-CI:5-advisor-insight-integration-only" as const,
  timelineBoundary: "context-propagation-only·no-replay" as const,
  explorerBoundary: "context-propagation-only·no-workflows" as const,
  liveLensBoundary: "context-propagation-only·no-goal-object-pack" as const,
  architecturalStatus:
    "Cockpit Interaction Orchestration Complete · Deterministic · Immutable · Surface-Indirect · ReadyForTimelineExplorerLiveLensIntegration" as const,
});

/**
 * Approved NEX-CI:5 / cockpit consumer surfaces re-exported for immediate
 * downstream NEX-CI phases (e.g. NEX-CI:7) so they can preserve the chain.
 */
export {
  EXECUTIVE_COCKPIT_SURFACES,
  advisorInsightIntegrationIdentity,
  advisorInsightIntegrationVersion,
  cockpitShellRuntimeBindingIdentity,
  cockpitShellRuntimeBindingVersion,
  createExecutiveAdvisorGuidanceIntent,
  createExecutiveCockpitIntegrationSnapshot,
  createExecutiveInsightRequestIntent,
  createExecutiveStageInteractionIntent,
  createExecutiveWorkspaceReference,
  createExecutiveWorkspaceSelectionIntent,
  executiveCockpitIntegrationFoundationIdentity,
  executiveCockpitIntegrationFoundationVersion,
  executiveStageIntegrationIdentity,
  executiveStageIntegrationVersion,
  isExecutiveCockpitPresentationState,
  isExecutiveCockpitSurface,
  resolveCockpitShellRuntimeBinding,
  resolveExecutiveAdvisorInsightIntegration,
  resolveExecutiveStageScene,
  resolveExecutiveWorkspaceExperience,
  verifyAdvisorInsightIntegration,
  verifyCockpitShellRuntimeBinding,
  verifyExecutiveCockpitIntegrationFoundation,
  verifyExecutiveStageIntegration,
  verifyWorkspaceDialExperienceSwitching,
  workspaceDialExperienceSwitchingIdentity,
  workspaceDialExperienceSwitchingVersion,
} from "@/app/lib/nex-ci/advisorInsightIntegration";

export type {
  ExecutiveAdvisorInsightIntegrationSnapshot,
  ExecutiveCockpitIntegrationStatus,
  ExecutiveCockpitPresentationState,
  ExecutiveCockpitSubjectKind,
  ExecutiveCockpitSubjectReference,
  ExecutiveCockpitSurface,
  ExecutiveWorkspaceReference,
} from "@/app/lib/nex-ci/advisorInsightIntegration";
