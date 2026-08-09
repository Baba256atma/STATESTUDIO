/**
 * NEX-CI:4 — Workspace Dial & Experience Switching.
 *
 * Establishes canonical semantic integration for Workspace Dial selection,
 * workspace transition planning, experience switching, scene-theme intent,
 * and cockpit-wide workspace propagation.
 *
 * Canonical flow:
 *   Executive manipulates Workspace Dial
 *   → Workspace intent
 *   → Workspace resolution
 *   → Experience transition plan
 *   → Cockpit runtime propagation
 *   → Stage experience transition
 *   → new active workspace
 *
 * Sole immediate NEX-CI dependency: NEX-CI:3 Executive Stage Integration.
 * Framework-independent pure TypeScript — no React, Three.js, R3F, dial
 * geometry, physical colors, Advisor/Insight content, or NEX-CI:5 behavior.
 */

import {
  EXECUTIVE_COCKPIT_SURFACES,
  doesCockpitSurfaceReceivePropagation,
  executiveStageIntegrationIdentity,
  isExecutiveStageCameraIntent,
  resolveExecutiveStageScene,
  verifyExecutiveStageIntegration,
  type CockpitShellRuntimeSnapshot,
  type ExecutiveCockpitSubjectKind,
  type ExecutiveCockpitSubjectReference,
  type ExecutiveCockpitSurface,
  type ExecutiveStageCameraIntent,
  type ExecutiveStageSceneOptions,
  type ExecutiveStageSceneSnapshot,
} from "@/app/lib/nex-ci/executiveStageIntegration";

// ─── Identity ───────────────────────────────────────────────────────────────

export const workspaceDialExperienceSwitchingIdentity =
  "NEX-CI:4/WorkspaceDialExperienceSwitching" as const;

export const workspaceDialExperienceSwitchingVersion = "1.4.0" as const;

export const workspaceDialExperienceSwitchingNamespace =
  "nexora.executive.cockpit.integration.workspace-dial" as const;

export const workspaceDialExperienceSwitchingLayer = "NEX-CI" as const;

export const workspaceDialExperienceSwitchingPhase =
  "WorkspaceDialExperienceSwitching" as const;

export const workspaceDialExperienceSwitchingStage =
  "WorkspaceDialExperienceSwitching" as const;

export const workspaceDialExperienceSwitchingArchitecturalRole =
  "WorkspaceDialExperienceSwitching" as const;

export const workspaceDialExperienceSwitchingDependencyIdentity =
  executiveStageIntegrationIdentity;

export const workspaceDialExperienceSwitchingDependencyPath =
  "@/app/lib/nex-ci/executiveStageIntegration" as const;

export const workspaceDialExperienceSwitchingStability =
  "WorkspaceDialExperienceSwitchingReady" as const;

export const workspaceDialExperienceSwitchingDeterministic = true as const;

export const workspaceDialExperienceSwitchingSideEffectPolicy =
  "side-effect-free" as const;

export const workspaceDialExperienceSwitchingMutationPolicy =
  "immutable" as const;

export const workspaceDialExperienceSwitchingCanonicalIdentity = Object.freeze({
  identity: workspaceDialExperienceSwitchingIdentity,
  version: workspaceDialExperienceSwitchingVersion,
  namespace: workspaceDialExperienceSwitchingNamespace,
  layer: workspaceDialExperienceSwitchingLayer,
  phase: workspaceDialExperienceSwitchingPhase,
  stage: workspaceDialExperienceSwitchingStage,
  architecturalRole: workspaceDialExperienceSwitchingArchitecturalRole,
  dependencyIdentity: workspaceDialExperienceSwitchingDependencyIdentity,
  dependencyPath: workspaceDialExperienceSwitchingDependencyPath,
  stabilityStatus: workspaceDialExperienceSwitchingStability,
  deterministicStatus: workspaceDialExperienceSwitchingDeterministic,
  sideEffectPolicy: workspaceDialExperienceSwitchingSideEffectPolicy,
  mutationPolicy: workspaceDialExperienceSwitchingMutationPolicy,
});

export const WORKSPACE_DIAL_EXPERIENCE_SWITCHING_PRINCIPLE =
  "Dial intent → semantic resolution → integration/runtime coordination → new canonical snapshot. Workspace identity remains separate from physical color and dial geometry." as const;

/**
 * Rapid-input policy while a transition is active:
 * reject new selection until the in-flight transition completes or is cancelled.
 */
export const EXECUTIVE_WORKSPACE_RAPID_INPUT_POLICY =
  "reject-until-transition-completes" as const;

export const WORKSPACE_DIAL_EXPERIENCE_SWITCHING_BOUNDARY = Object.freeze({
  nexCiAuthority: "Executive-Cockpit-Integration" as const,
  dialAuthority: "Workspace-Dial-Control-Surface" as const,
  rendererAuthority: "Workspace-Dial-Stage-Renderer-Adapter" as const,
  boundaryAuthority: "NEX-CI:4" as const,
  architecturalRole: "WorkspaceDialExperienceSwitching" as const,
  soleImmediateDependency: "NEX-CI:3/ExecutiveStageIntegration" as const,
  consumesNexCi3Only: true as const,
  bypassesIntoNexCi2: false as const,
  bypassesIntoNexCi1: false as const,
  bypassesIntoRex: false as const,
  bypassesIntoExDri: false as const,
  bypassesIntoDri: false as const,
  bypassesIntoNol: false as const,
  ownsRendering: false as const,
  ownsDialGeometry: false as const,
  ownsDialRotation: false as const,
  ownsSceneColorValues: false as const,
  ownsStageAnimation: false as const,
  ownsAdvisorContent: false as const,
  ownsInsightContent: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  introducesReact: false as const,
  introducesThreeJs: false as const,
  introducesReactThreeFiber: false as const,
  implementsNexCi5: false as const,
  rapidInputPolicy: EXECUTIVE_WORKSPACE_RAPID_INPUT_POLICY,
});

// ─── Workspace vocabulary (aligned with REX workspace kinds; NEX-CI contract) ─

/**
 * Canonical executive workspace kinds.
 * Aligned with REX Runtime Executive Workspace kinds:
 * overview · problem · scenario · decision · execution
 * Defined locally to preserve the NEX-CI:3 immediate-dependency chain.
 */
export const EXECUTIVE_WORKSPACE_KINDS = Object.freeze([
  "overview",
  "problem",
  "scenario",
  "decision",
  "execution",
] as const);

export type ExecutiveWorkspaceKind =
  (typeof EXECUTIVE_WORKSPACE_KINDS)[number];

export const EXECUTIVE_WORKSPACE_KIND_LABELS = Object.freeze({
  overview: "Overview",
  problem: "Problem",
  scenario: "Scenario",
  decision: "Decision",
  execution: "Execution",
} as const satisfies Record<ExecutiveWorkspaceKind, string>);

export interface ExecutiveWorkspaceReference {
  readonly id: string;
  readonly kind: ExecutiveWorkspaceKind;
  readonly label?: string;
}

export function createExecutiveWorkspaceReference(
  kind: ExecutiveWorkspaceKind,
  label?: string,
): ExecutiveWorkspaceReference {
  if (!isExecutiveWorkspaceKind(kind)) {
    throw new TypeError("kind must be a known executive workspace kind");
  }
  return Object.freeze({
    id: `workspace.${kind}`,
    kind,
    label: label ?? EXECUTIVE_WORKSPACE_KIND_LABELS[kind],
  });
}

export const EXECUTIVE_WORKSPACE_REGISTRY = Object.freeze(
  EXECUTIVE_WORKSPACE_KINDS.map((kind, order) =>
    Object.freeze({
      workspace: createExecutiveWorkspaceReference(kind),
      order,
    }),
  ),
);

// ─── Dial / transition vocabularies ─────────────────────────────────────────

export const EXECUTIVE_WORKSPACE_DIAL_STATUSES = Object.freeze([
  "idle",
  "ready",
  "selecting",
  "transitioning",
  "active",
  "unavailable",
] as const);

export type ExecutiveWorkspaceDialStatus =
  (typeof EXECUTIVE_WORKSPACE_DIAL_STATUSES)[number];

export interface ExecutiveWorkspaceDialOption {
  readonly workspace: ExecutiveWorkspaceReference;
  readonly enabled: boolean;
  readonly available: boolean;
  readonly order: number;
}

export interface ExecutiveWorkspaceDialState {
  readonly currentWorkspace?: ExecutiveWorkspaceReference;
  readonly targetWorkspace?: ExecutiveWorkspaceReference;
  readonly selectedOptionId?: string;
  readonly status: ExecutiveWorkspaceDialStatus;
  readonly options: readonly ExecutiveWorkspaceDialOption[];
}

export const EXECUTIVE_WORKSPACE_TRANSITION_STATUSES = Object.freeze([
  "planned",
  "starting",
  "transitioning",
  "completed",
  "cancelled",
  "rejected",
] as const);

export type ExecutiveWorkspaceTransitionStatus =
  (typeof EXECUTIVE_WORKSPACE_TRANSITION_STATUSES)[number];

export const EXECUTIVE_WORKSPACE_SELECTION_REASONS = Object.freeze([
  "accepted",
  "already-active",
  "unknown-workspace",
  "disabled",
  "unavailable",
  "transition-in-progress",
] as const);

export type ExecutiveWorkspaceSelectionReason =
  (typeof EXECUTIVE_WORKSPACE_SELECTION_REASONS)[number];

export interface ExecutiveWorkspaceSelectionIntent {
  readonly source: "workspace-dial";
  readonly workspaceId: string;
  readonly kind: "select-workspace";
}

export const EXECUTIVE_WORKSPACE_DIAL_NAVIGATION_KINDS = Object.freeze([
  "previous",
  "next",
  "select",
] as const);

export type ExecutiveWorkspaceDialNavigationKind =
  (typeof EXECUTIVE_WORKSPACE_DIAL_NAVIGATION_KINDS)[number];

export interface ExecutiveWorkspaceDialNavigationIntent {
  readonly source: "workspace-dial";
  readonly kind: ExecutiveWorkspaceDialNavigationKind;
  readonly workspaceId?: string;
}

export interface ExecutiveWorkspaceSelectionResult {
  readonly accepted: boolean;
  readonly reason: ExecutiveWorkspaceSelectionReason;
  readonly targetWorkspace?: ExecutiveWorkspaceReference;
}

export const EXECUTIVE_WORKSPACE_EXPERIENCE_EMPHASIS_STATES = Object.freeze([
  "balanced",
  "analytical",
  "decisive",
  "operational",
  "exploratory",
] as const);

export type ExecutiveWorkspaceExperienceEmphasis =
  (typeof EXECUTIVE_WORKSPACE_EXPERIENCE_EMPHASIS_STATES)[number];

export const EXECUTIVE_WORKSPACE_EXPERIENCE_DENSITIES = Object.freeze([
  "sparse",
  "standard",
  "dense",
] as const);

export type ExecutiveWorkspaceExperienceDensity =
  (typeof EXECUTIVE_WORKSPACE_EXPERIENCE_DENSITIES)[number];

export interface ExecutiveWorkspaceExperienceIntent {
  readonly workspace: ExecutiveWorkspaceReference;
  readonly emphasis: ExecutiveWorkspaceExperienceEmphasis;
  readonly density?: ExecutiveWorkspaceExperienceDensity;
}

/**
 * Semantic scene-theme intent — identifier only.
 * Never carries hex/RGB/gradient/shader/material values.
 */
export interface ExecutiveWorkspaceSceneThemeIntent {
  readonly workspaceId: string;
  readonly themeKey: ExecutiveWorkspaceKind;
}

export const EXECUTIVE_WORKSPACE_COMPOSITION_INTENTS = Object.freeze([
  "preserve",
  "recompose",
  "restore-overview",
  "focus-context",
  "clear-context",
] as const);

export type ExecutiveWorkspaceCompositionIntent =
  (typeof EXECUTIVE_WORKSPACE_COMPOSITION_INTENTS)[number];

export interface ExecutiveWorkspaceStageIntent {
  readonly workspace: ExecutiveWorkspaceReference;
  readonly sceneTheme?: ExecutiveWorkspaceSceneThemeIntent;
  readonly compositionIntent: ExecutiveWorkspaceCompositionIntent;
  readonly cameraIntent?: ExecutiveStageCameraIntent;
  readonly focusPolicy: ExecutiveWorkspaceFocusPolicy;
  readonly selectionPolicy: ExecutiveWorkspaceSelectionPolicy;
  readonly preservePresentationState: true;
}

export interface ExecutiveWorkspaceTransition {
  readonly from?: ExecutiveWorkspaceReference;
  readonly to: ExecutiveWorkspaceReference;
  readonly status: ExecutiveWorkspaceTransitionStatus;
  readonly experienceIntent: ExecutiveWorkspaceExperienceIntent;
  readonly stageIntent: ExecutiveWorkspaceStageIntent;
  readonly propagatingSurfaces: readonly ExecutiveCockpitSurface[];
}

export const EXECUTIVE_WORKSPACE_FOCUS_POLICIES = Object.freeze([
  "preserve-if-compatible",
  "clear",
  "restore-overview",
] as const);

export type ExecutiveWorkspaceFocusPolicy =
  (typeof EXECUTIVE_WORKSPACE_FOCUS_POLICIES)[number];

export const EXECUTIVE_WORKSPACE_SELECTION_POLICIES = Object.freeze([
  "preserve-if-compatible",
  "clear",
] as const);

export type ExecutiveWorkspaceSelectionPolicy =
  (typeof EXECUTIVE_WORKSPACE_SELECTION_POLICIES)[number];

export const EXECUTIVE_WORKSPACE_REACTION_KINDS = Object.freeze([
  "workspace-selection-accepted",
  "workspace-selection-rejected",
  "workspace-transition-start",
  "workspace-context-update",
  "stage-recompose",
  "scene-theme-change",
  "workspace-transition-complete",
  "workspace-transition-cancel",
] as const);

export type ExecutiveWorkspaceReactionKind =
  (typeof EXECUTIVE_WORKSPACE_REACTION_KINDS)[number];

export interface ExecutiveWorkspaceReaction {
  readonly kind: ExecutiveWorkspaceReactionKind;
  readonly workspaceId?: string;
  readonly priority: number;
}

export interface ExecutiveWorkspaceSurfacePropagation {
  readonly surface: ExecutiveCockpitSurface;
  readonly receivesWorkspace: boolean;
  readonly workspaceId?: string;
}

export interface ExecutiveWorkspaceExperienceSnapshot {
  readonly cockpit: CockpitShellRuntimeSnapshot;
  readonly stage: ExecutiveStageSceneSnapshot;
  readonly dial: ExecutiveWorkspaceDialState;
  readonly currentWorkspace?: ExecutiveWorkspaceReference;
  readonly targetWorkspace?: ExecutiveWorkspaceReference;
  readonly transition?: ExecutiveWorkspaceTransition;
  readonly reactions: readonly ExecutiveWorkspaceReaction[];
  readonly surfacePropagation: readonly ExecutiveWorkspaceSurfacePropagation[];
  readonly integrationIdentity: typeof workspaceDialExperienceSwitchingIdentity;
  readonly integrationVersion: typeof workspaceDialExperienceSwitchingVersion;
}

export interface ExecutiveWorkspaceExperienceInput {
  readonly cockpit: CockpitShellRuntimeSnapshot;
  readonly stage?: ExecutiveStageSceneSnapshot;
  readonly stageOptions?: ExecutiveStageSceneOptions;
  readonly currentWorkspace?: ExecutiveWorkspaceReference;
  readonly optionAvailability?: Readonly<
    Partial<Record<ExecutiveWorkspaceKind, { enabled?: boolean; available?: boolean }>>
  >;
  readonly intent?:
    | ExecutiveWorkspaceSelectionIntent
    | ExecutiveWorkspaceDialNavigationIntent;
  readonly transition?: ExecutiveWorkspaceTransition;
  readonly action?: "resolve" | "complete" | "cancel";
}

// ─── Guarantees / forbidden ─────────────────────────────────────────────────

export const WORKSPACE_DIAL_EXPERIENCE_SWITCHING_GUARANTEES = Object.freeze([
  Object.freeze({
    id: "nex-ci-3-sole-immediate-dependency",
    order: 1,
    statement: "NEX-CI:4 immediately depends on NEX-CI:3 only.",
  }),
  Object.freeze({
    id: "workspace-dial-remains-control-surface",
    order: 2,
    statement: "Workspace Dial remains a control surface.",
  }),
  Object.freeze({
    id: "current-target-distinct-during-transition",
    order: 3,
    statement: "Current and target workspace remain distinct during transition.",
  }),
  Object.freeze({
    id: "only-canonical-available-options-selectable",
    order: 4,
    statement: "Only canonical/available Dial options can be selected.",
  }),
  Object.freeze({
    id: "same-workspace-no-redundant-transition",
    order: 5,
    statement: "Same-workspace selection does not create redundant transition.",
  }),
  Object.freeze({
    id: "unavailable-cannot-become-target",
    order: 6,
    statement: "Unavailable workspace cannot become target.",
  }),
  Object.freeze({
    id: "transition-at-most-one-target",
    order: 7,
    statement: "Transition has at most one target workspace.",
  }),
  Object.freeze({
    id: "completion-commits-planned-target",
    order: 8,
    statement: "Transition completion commits exactly the planned target.",
  }),
  Object.freeze({
    id: "selection-focus-remain-separate",
    order: 9,
    statement: "Selection and focus remain separate.",
  }),
  Object.freeze({
    id: "invalid-focus-not-preserved",
    order: 10,
    statement:
      "Invalid focus is not preserved across incompatible workspace changes.",
  }),
  Object.freeze({
    id: "invalid-selection-not-preserved",
    order: 11,
    statement:
      "Invalid selection is not preserved across incompatible workspace changes.",
  }),
  Object.freeze({
    id: "theme-is-semantic-not-physical-color",
    order: 12,
    statement: "Stage theme is semantic, not physical color data.",
  }),
  Object.freeze({
    id: "composition-intent-has-no-coordinates",
    order: 13,
    statement: "Stage composition intent contains no coordinates.",
  }),
  Object.freeze({
    id: "dial-state-has-no-physical-rotation",
    order: 14,
    statement: "Dial state contains no physical rotation data.",
  }),
  Object.freeze({
    id: "no-react-dependency",
    order: 15,
    statement: "No React dependency exists.",
  }),
  Object.freeze({
    id: "no-threejs-dependency",
    order: 16,
    statement: "No Three.js dependency exists.",
  }),
  Object.freeze({
    id: "no-r3f-dependency",
    order: 17,
    statement: "No R3F dependency exists.",
  }),
  Object.freeze({
    id: "no-renderer-side-effects",
    order: 18,
    statement: "No renderer side effect occurs.",
  }),
  Object.freeze({
    id: "no-global-runtime-mutation",
    order: 19,
    statement: "No global runtime mutation occurs.",
  }),
  Object.freeze({
    id: "resolution-deterministic",
    order: 20,
    statement: "Resolution is deterministic.",
  }),
  Object.freeze({
    id: "inputs-not-mutated",
    order: 21,
    statement: "Inputs are not mutated.",
  }),
  Object.freeze({
    id: "no-advisor-insight-content",
    order: 22,
    statement: "Advisor/Insight content generation is not implemented.",
  }),
  Object.freeze({
    id: "no-timeline-explorer-livelens-behavior",
    order: 23,
    statement: "Timeline/Explorer/Live Lens behavior is not implemented.",
  }),
] as const);

export type WorkspaceDialExperienceSwitchingGuarantee =
  (typeof WORKSPACE_DIAL_EXPERIENCE_SWITCHING_GUARANTEES)[number];

export const WORKSPACE_DIAL_EXPERIENCE_SWITCHING_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "React components",
    "React hooks",
    "Three.js Mesh",
    "Three.js Group",
    "Three.js Color",
    "React Three Fiber Canvas",
    "useThree",
    "useFrame",
    "dial geometry",
    "rotary physics",
    "angle calculations",
    "hex colors",
    "RGB values",
    "scene shaders",
    "physical camera movement",
    "physical Stage object animation",
    "Advisor content generation",
    "Insight generation",
    "Timeline replay",
    "Explorer workflows",
    "Live Lens interaction",
    "NEX-CI:5 Advisor & Insight Integration",
  ] as const);

// ─── Guards / getters ───────────────────────────────────────────────────────

export function isExecutiveWorkspaceKind(
  value: unknown,
): value is ExecutiveWorkspaceKind {
  return (EXECUTIVE_WORKSPACE_KINDS as readonly unknown[]).includes(value);
}

export function isExecutiveWorkspaceDialStatus(
  value: unknown,
): value is ExecutiveWorkspaceDialStatus {
  return (
    EXECUTIVE_WORKSPACE_DIAL_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isExecutiveWorkspaceTransitionStatus(
  value: unknown,
): value is ExecutiveWorkspaceTransitionStatus {
  return (
    EXECUTIVE_WORKSPACE_TRANSITION_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isExecutiveWorkspaceSelectionReason(
  value: unknown,
): value is ExecutiveWorkspaceSelectionReason {
  return (
    EXECUTIVE_WORKSPACE_SELECTION_REASONS as readonly unknown[]
  ).includes(value);
}

export function isExecutiveWorkspaceReactionKind(
  value: unknown,
): value is ExecutiveWorkspaceReactionKind {
  return (
    EXECUTIVE_WORKSPACE_REACTION_KINDS as readonly unknown[]
  ).includes(value);
}

export function isExecutiveWorkspaceCompositionIntent(
  value: unknown,
): value is ExecutiveWorkspaceCompositionIntent {
  return (
    EXECUTIVE_WORKSPACE_COMPOSITION_INTENTS as readonly unknown[]
  ).includes(value);
}

export function isExecutiveWorkspaceFocusPolicy(
  value: unknown,
): value is ExecutiveWorkspaceFocusPolicy {
  return (
    EXECUTIVE_WORKSPACE_FOCUS_POLICIES as readonly unknown[]
  ).includes(value);
}

export function isExecutiveWorkspaceSelectionPolicy(
  value: unknown,
): value is ExecutiveWorkspaceSelectionPolicy {
  return (
    EXECUTIVE_WORKSPACE_SELECTION_POLICIES as readonly unknown[]
  ).includes(value);
}

export function getWorkspaceDialExperienceSwitchingIdentity():
  typeof workspaceDialExperienceSwitchingCanonicalIdentity {
  return workspaceDialExperienceSwitchingCanonicalIdentity;
}

export function getExecutiveWorkspaceKinds(): ReadonlyArray<
  ExecutiveWorkspaceKind
> {
  return EXECUTIVE_WORKSPACE_KINDS;
}

export function getExecutiveWorkspaceDialStatuses(): ReadonlyArray<
  ExecutiveWorkspaceDialStatus
> {
  return EXECUTIVE_WORKSPACE_DIAL_STATUSES;
}

export function getExecutiveWorkspaceTransitionStatuses(): ReadonlyArray<
  ExecutiveWorkspaceTransitionStatus
> {
  return EXECUTIVE_WORKSPACE_TRANSITION_STATUSES;
}

export function getExecutiveWorkspaceSelectionReasons(): ReadonlyArray<
  ExecutiveWorkspaceSelectionReason
> {
  return EXECUTIVE_WORKSPACE_SELECTION_REASONS;
}

export function getExecutiveWorkspaceReactionKinds(): ReadonlyArray<
  ExecutiveWorkspaceReactionKind
> {
  return EXECUTIVE_WORKSPACE_REACTION_KINDS;
}

export function getExecutiveWorkspaceCompositionIntents(): ReadonlyArray<
  ExecutiveWorkspaceCompositionIntent
> {
  return EXECUTIVE_WORKSPACE_COMPOSITION_INTENTS;
}

export function getExecutiveWorkspaceFocusPolicies(): ReadonlyArray<
  ExecutiveWorkspaceFocusPolicy
> {
  return EXECUTIVE_WORKSPACE_FOCUS_POLICIES;
}

export function getExecutiveWorkspaceSelectionPolicies(): ReadonlyArray<
  ExecutiveWorkspaceSelectionPolicy
> {
  return EXECUTIVE_WORKSPACE_SELECTION_POLICIES;
}

// ─── Compatibility / theme / emphasis ───────────────────────────────────────

const WORKSPACE_COMPATIBLE_SUBJECT_KINDS = Object.freeze({
  overview: Object.freeze([
    "goal",
    "object",
    "problem",
    "scenario",
    "decision",
    "execution",
    "kpi",
    "koi",
    "pack",
    "insight",
    "guidance",
  ] as const satisfies readonly ExecutiveCockpitSubjectKind[]),
  problem: Object.freeze([
    "problem",
    "object",
    "goal",
    "pack",
    "kpi",
    "koi",
    "insight",
    "guidance",
  ] as const satisfies readonly ExecutiveCockpitSubjectKind[]),
  scenario: Object.freeze([
    "scenario",
    "object",
    "goal",
    "pack",
    "insight",
  ] as const satisfies readonly ExecutiveCockpitSubjectKind[]),
  decision: Object.freeze([
    "decision",
    "object",
    "goal",
    "scenario",
    "pack",
  ] as const satisfies readonly ExecutiveCockpitSubjectKind[]),
  execution: Object.freeze([
    "execution",
    "object",
    "goal",
    "decision",
    "pack",
  ] as const satisfies readonly ExecutiveCockpitSubjectKind[]),
} as const);

const WORKSPACE_EXPERIENCE_EMPHASIS_MAP = Object.freeze({
  overview: "balanced",
  problem: "analytical",
  scenario: "exploratory",
  decision: "decisive",
  execution: "operational",
} as const satisfies Record<
  ExecutiveWorkspaceKind,
  ExecutiveWorkspaceExperienceEmphasis
>);

export function isSubjectCompatibleWithWorkspace(
  subject: ExecutiveCockpitSubjectReference | undefined,
  workspace: ExecutiveWorkspaceReference,
): boolean {
  if (subject === undefined) {
    return true;
  }
  return (
    WORKSPACE_COMPATIBLE_SUBJECT_KINDS[workspace.kind] as readonly string[]
  ).includes(subject.kind);
}

function findWorkspaceById(
  workspaceId: string,
): ExecutiveWorkspaceReference | undefined {
  const entry = EXECUTIVE_WORKSPACE_REGISTRY.find(
    (item) =>
      item.workspace.id === workspaceId || item.workspace.kind === workspaceId,
  );
  return entry?.workspace;
}

function resolveCurrentWorkspaceReference(
  cockpit: CockpitShellRuntimeSnapshot,
  explicit?: ExecutiveWorkspaceReference,
): ExecutiveWorkspaceReference {
  if (explicit !== undefined) {
    if (!isExecutiveWorkspaceKind(explicit.kind)) {
      throw new TypeError("currentWorkspace.kind is invalid");
    }
    return createExecutiveWorkspaceReference(explicit.kind, explicit.label);
  }
  const active = cockpit.binding.activeWorkspace;
  if (active !== undefined) {
    const matched = findWorkspaceById(active);
    if (matched !== undefined) {
      return matched;
    }
  }
  return createExecutiveWorkspaceReference("overview");
}

// ─── Dial options / state ───────────────────────────────────────────────────

export function resolveExecutiveWorkspaceDialOptions(
  optionAvailability?: ExecutiveWorkspaceExperienceInput["optionAvailability"],
): ReadonlyArray<ExecutiveWorkspaceDialOption> {
  return Object.freeze(
    EXECUTIVE_WORKSPACE_REGISTRY.map((entry) => {
      const override = optionAvailability?.[entry.workspace.kind];
      return Object.freeze({
        workspace: entry.workspace,
        enabled: override?.enabled ?? true,
        available: override?.available ?? true,
        order: entry.order,
      });
    }),
  );
}

export function resolveExecutiveWorkspaceDialState(input: {
  readonly currentWorkspace?: ExecutiveWorkspaceReference;
  readonly targetWorkspace?: ExecutiveWorkspaceReference;
  readonly status?: ExecutiveWorkspaceDialStatus;
  readonly optionAvailability?: ExecutiveWorkspaceExperienceInput["optionAvailability"];
  readonly cockpitStatus?: CockpitShellRuntimeSnapshot["binding"]["integrationStatus"];
}): ExecutiveWorkspaceDialState {
  const options = resolveExecutiveWorkspaceDialOptions(input.optionAvailability);
  const cockpitUnavailable = input.cockpitStatus === "unavailable";
  const transitioning =
    input.targetWorkspace !== undefined &&
    input.status !== "idle" &&
    input.status !== "ready" &&
    input.status !== "active";

  let status: ExecutiveWorkspaceDialStatus =
    input.status ??
    (cockpitUnavailable
      ? "unavailable"
      : transitioning
        ? "transitioning"
        : input.currentWorkspace !== undefined
          ? "active"
          : "ready");

  if (cockpitUnavailable) {
    status = "unavailable";
  }

  return Object.freeze({
    status,
    options,
    ...(input.currentWorkspace !== undefined
      ? { currentWorkspace: input.currentWorkspace }
      : {}),
    ...(input.targetWorkspace !== undefined
      ? { targetWorkspace: input.targetWorkspace }
      : {}),
    ...(input.targetWorkspace !== undefined
      ? { selectedOptionId: input.targetWorkspace.id }
      : input.currentWorkspace !== undefined
        ? { selectedOptionId: input.currentWorkspace.id }
        : {}),
  });
}

export function createExecutiveWorkspaceSelectionIntent(
  workspaceId: string,
): ExecutiveWorkspaceSelectionIntent {
  if (typeof workspaceId !== "string" || workspaceId.length === 0) {
    throw new TypeError("workspaceId must be a non-empty opaque identifier");
  }
  return Object.freeze({
    source: "workspace-dial" as const,
    workspaceId,
    kind: "select-workspace" as const,
  });
}

export function createExecutiveWorkspaceDialNavigationIntent(
  kind: ExecutiveWorkspaceDialNavigationKind,
  workspaceId?: string,
): ExecutiveWorkspaceDialNavigationIntent {
  if (
    !(
      EXECUTIVE_WORKSPACE_DIAL_NAVIGATION_KINDS as readonly string[]
    ).includes(kind)
  ) {
    throw new TypeError("kind must be a known dial navigation kind");
  }
  if (kind === "select") {
    if (workspaceId === undefined || workspaceId.length === 0) {
      throw new TypeError("select navigation requires workspaceId");
    }
  }
  return Object.freeze({
    source: "workspace-dial" as const,
    kind,
    ...(workspaceId !== undefined ? { workspaceId } : {}),
  });
}

function selectableOptions(
  options: readonly ExecutiveWorkspaceDialOption[],
): ExecutiveWorkspaceDialOption[] {
  return options.filter((option) => option.enabled && option.available);
}

function resolveNavigationTarget(
  dial: ExecutiveWorkspaceDialState,
  intent: ExecutiveWorkspaceDialNavigationIntent,
): string | undefined {
  if (intent.kind === "select") {
    return intent.workspaceId;
  }
  const selectable = selectableOptions(dial.options).sort(
    (a, b) => a.order - b.order,
  );
  if (selectable.length === 0) {
    return undefined;
  }
  const currentId =
    dial.targetWorkspace?.id ??
    dial.currentWorkspace?.id ??
    selectable[0].workspace.id;
  const index = selectable.findIndex(
    (option) => option.workspace.id === currentId,
  );
  const base = index >= 0 ? index : 0;
  if (intent.kind === "next") {
    return selectable[(base + 1) % selectable.length].workspace.id;
  }
  return selectable[(base - 1 + selectable.length) % selectable.length]
    .workspace.id;
}

// ─── Selection / transition ─────────────────────────────────────────────────

export function resolveExecutiveWorkspaceSelection(
  dialState: ExecutiveWorkspaceDialState,
  intent:
    | ExecutiveWorkspaceSelectionIntent
    | ExecutiveWorkspaceDialNavigationIntent,
): ExecutiveWorkspaceSelectionResult {
  if (
    dialState.status === "transitioning" ||
    dialState.status === "selecting"
  ) {
    return Object.freeze({
      accepted: false,
      reason: "transition-in-progress" as const,
    });
  }
  if (dialState.status === "unavailable") {
    return Object.freeze({
      accepted: false,
      reason: "unavailable" as const,
    });
  }

  const workspaceId =
    intent.kind === "select-workspace"
      ? intent.workspaceId
      : resolveNavigationTarget(dialState, intent);

  if (workspaceId === undefined) {
    return Object.freeze({
      accepted: false,
      reason: "unavailable" as const,
    });
  }

  const option = dialState.options.find(
    (entry) =>
      entry.workspace.id === workspaceId ||
      entry.workspace.kind === workspaceId,
  );

  if (option === undefined) {
    return Object.freeze({
      accepted: false,
      reason: "unknown-workspace" as const,
    });
  }
  if (!option.enabled) {
    return Object.freeze({
      accepted: false,
      reason: "disabled" as const,
    });
  }
  if (!option.available) {
    return Object.freeze({
      accepted: false,
      reason: "unavailable" as const,
    });
  }
  if (
    dialState.currentWorkspace !== undefined &&
    dialState.currentWorkspace.id === option.workspace.id &&
    dialState.targetWorkspace === undefined
  ) {
    return Object.freeze({
      accepted: false,
      reason: "already-active" as const,
      targetWorkspace: option.workspace,
    });
  }

  return Object.freeze({
    accepted: true,
    reason: "accepted" as const,
    targetWorkspace: option.workspace,
  });
}

function resolveFocusPolicy(
  target: ExecutiveWorkspaceReference,
  focused: ExecutiveCockpitSubjectReference | undefined,
): ExecutiveWorkspaceFocusPolicy {
  if (target.kind === "overview") {
    return "restore-overview";
  }
  if (focused === undefined) {
    return "restore-overview";
  }
  if (isSubjectCompatibleWithWorkspace(focused, target)) {
    return "preserve-if-compatible";
  }
  return "clear";
}

function resolveSelectionPolicy(
  target: ExecutiveWorkspaceReference,
  selected: ExecutiveCockpitSubjectReference | undefined,
): ExecutiveWorkspaceSelectionPolicy {
  if (selected === undefined) {
    return "clear";
  }
  if (isSubjectCompatibleWithWorkspace(selected, target)) {
    return "preserve-if-compatible";
  }
  return "clear";
}

function resolveCompositionIntent(
  focusPolicy: ExecutiveWorkspaceFocusPolicy,
  from: ExecutiveWorkspaceReference | undefined,
  to: ExecutiveWorkspaceReference,
): ExecutiveWorkspaceCompositionIntent {
  if (to.kind === "overview" || focusPolicy === "restore-overview") {
    return "restore-overview";
  }
  if (focusPolicy === "clear") {
    return "clear-context";
  }
  if (focusPolicy === "preserve-if-compatible") {
    return from?.id === to.id ? "preserve" : "focus-context";
  }
  return "recompose";
}

function resolveCameraIntent(
  compositionIntent: ExecutiveWorkspaceCompositionIntent,
): ExecutiveStageCameraIntent {
  if (compositionIntent === "restore-overview") {
    return "restore";
  }
  if (
    compositionIntent === "focus-context" ||
    compositionIntent === "clear-context"
  ) {
    return "focus-primary";
  }
  return "overview";
}

function resolvePropagatingSurfaces(): readonly ExecutiveCockpitSurface[] {
  return Object.freeze(
    EXECUTIVE_COCKPIT_SURFACES.filter((surface) =>
      doesCockpitSurfaceReceivePropagation(surface, "workspace"),
    ),
  );
}

export function resolveExecutiveWorkspaceStageIntent(
  current: ExecutiveWorkspaceReference | undefined,
  target: ExecutiveWorkspaceReference,
  cockpit: CockpitShellRuntimeSnapshot,
): ExecutiveWorkspaceStageIntent {
  const focusPolicy = resolveFocusPolicy(
    target,
    cockpit.binding.focusedSubject,
  );
  const selectionPolicy = resolveSelectionPolicy(
    target,
    cockpit.binding.selectedSubject,
  );
  const compositionIntent = resolveCompositionIntent(
    focusPolicy,
    current,
    target,
  );
  const cameraIntent = resolveCameraIntent(compositionIntent);

  return Object.freeze({
    workspace: target,
    sceneTheme: Object.freeze({
      workspaceId: target.id,
      themeKey: target.kind,
    }),
    compositionIntent,
    cameraIntent,
    focusPolicy,
    selectionPolicy,
    preservePresentationState: true as const,
  });
}

export function planExecutiveWorkspaceTransition(
  currentWorkspace: ExecutiveWorkspaceReference | undefined,
  selectionResult: ExecutiveWorkspaceSelectionResult,
  cockpit: CockpitShellRuntimeSnapshot,
): ExecutiveWorkspaceTransition {
  if (
    !selectionResult.accepted ||
    selectionResult.targetWorkspace === undefined
  ) {
    throw new TypeError(
      "planExecutiveWorkspaceTransition requires an accepted selection result",
    );
  }

  const to = selectionResult.targetWorkspace;
  const experienceIntent = Object.freeze({
    workspace: to,
    emphasis: WORKSPACE_EXPERIENCE_EMPHASIS_MAP[to.kind],
    density: "standard" as const,
  });
  const stageIntent = resolveExecutiveWorkspaceStageIntent(
    currentWorkspace,
    to,
    cockpit,
  );

  return Object.freeze({
    ...(currentWorkspace !== undefined ? { from: currentWorkspace } : {}),
    to,
    status: "planned" as const,
    experienceIntent,
    stageIntent,
    propagatingSurfaces: resolvePropagatingSurfaces(),
  });
}

export function startExecutiveWorkspaceTransition(
  transition: ExecutiveWorkspaceTransition,
): ExecutiveWorkspaceTransition {
  if (
    transition.status !== "planned" &&
    transition.status !== "starting"
  ) {
    throw new TypeError(
      "only planned/starting transitions can enter transitioning",
    );
  }
  return Object.freeze({
    ...transition,
    status: "transitioning" as const,
  });
}

export function completeExecutiveWorkspaceTransition(
  transition: ExecutiveWorkspaceTransition,
): ExecutiveWorkspaceTransition {
  if (
    transition.status !== "planned" &&
    transition.status !== "starting" &&
    transition.status !== "transitioning"
  ) {
    throw new TypeError(
      "only active transitions can be completed",
    );
  }
  return Object.freeze({
    ...transition,
    status: "completed" as const,
  });
}

export function cancelExecutiveWorkspaceTransition(
  transition: ExecutiveWorkspaceTransition,
): ExecutiveWorkspaceTransition {
  if (
    transition.status === "completed" ||
    transition.status === "cancelled" ||
    transition.status === "rejected"
  ) {
    throw new TypeError("terminal transitions cannot be cancelled");
  }
  return Object.freeze({
    ...transition,
    status: "cancelled" as const,
  });
}

export function resolveExecutiveWorkspaceReactions(input: {
  readonly selectionResult?: ExecutiveWorkspaceSelectionResult;
  readonly transition?: ExecutiveWorkspaceTransition;
  readonly previousTransition?: ExecutiveWorkspaceTransition;
  readonly action?: ExecutiveWorkspaceExperienceInput["action"];
}): ReadonlyArray<ExecutiveWorkspaceReaction> {
  const reactions: ExecutiveWorkspaceReaction[] = [];
  let priority = 1;

  if (input.selectionResult !== undefined) {
    if (input.selectionResult.accepted) {
      reactions.push(
        Object.freeze({
          kind: "workspace-selection-accepted" as const,
          workspaceId: input.selectionResult.targetWorkspace?.id,
          priority: priority++,
        }),
      );
    } else if (input.selectionResult.reason !== "already-active") {
      reactions.push(
        Object.freeze({
          kind: "workspace-selection-rejected" as const,
          workspaceId: input.selectionResult.targetWorkspace?.id,
          priority: priority++,
        }),
      );
    }
  }

  const transition = input.transition;
  if (transition !== undefined) {
    if (
      transition.status === "planned" ||
      transition.status === "starting" ||
      transition.status === "transitioning"
    ) {
      reactions.push(
        Object.freeze({
          kind: "workspace-transition-start" as const,
          workspaceId: transition.to.id,
          priority: priority++,
        }),
      );
      reactions.push(
        Object.freeze({
          kind: "workspace-context-update" as const,
          workspaceId: transition.to.id,
          priority: priority++,
        }),
      );
      if (
        transition.stageIntent.compositionIntent !== "preserve"
      ) {
        reactions.push(
          Object.freeze({
            kind: "stage-recompose" as const,
            workspaceId: transition.to.id,
            priority: priority++,
          }),
        );
      }
      if (transition.stageIntent.sceneTheme !== undefined) {
        reactions.push(
          Object.freeze({
            kind: "scene-theme-change" as const,
            workspaceId: transition.to.id,
            priority: priority++,
          }),
        );
      }
    }
    if (transition.status === "completed") {
      reactions.push(
        Object.freeze({
          kind: "workspace-transition-complete" as const,
          workspaceId: transition.to.id,
          priority: priority++,
        }),
      );
      reactions.push(
        Object.freeze({
          kind: "workspace-context-update" as const,
          workspaceId: transition.to.id,
          priority: priority++,
        }),
      );
    }
    if (transition.status === "cancelled") {
      reactions.push(
        Object.freeze({
          kind: "workspace-transition-cancel" as const,
          workspaceId: transition.to.id,
          priority: priority++,
        }),
      );
    }
  }

  return Object.freeze(
    reactions.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      if (a.kind !== b.kind) {
        return a.kind < b.kind ? -1 : 1;
      }
      const aId = a.workspaceId ?? "";
      const bId = b.workspaceId ?? "";
      return aId < bId ? -1 : aId > bId ? 1 : 0;
    }),
  );
}

function resolveSurfacePropagation(
  workspace: ExecutiveWorkspaceReference | undefined,
): readonly ExecutiveWorkspaceSurfacePropagation[] {
  return Object.freeze(
    EXECUTIVE_COCKPIT_SURFACES.map((surface) => {
      const receivesWorkspace = doesCockpitSurfaceReceivePropagation(
        surface,
        "workspace",
      );
      return Object.freeze({
        surface,
        receivesWorkspace,
        ...(receivesWorkspace && workspace !== undefined
          ? { workspaceId: workspace.id }
          : {}),
      });
    }),
  );
}

// ─── Main resolver ──────────────────────────────────────────────────────────

export function resolveExecutiveWorkspaceExperience(
  input: ExecutiveWorkspaceExperienceInput,
): ExecutiveWorkspaceExperienceSnapshot {
  const currentWorkspace = resolveCurrentWorkspaceReference(
    input.cockpit,
    input.currentWorkspace,
  );

  let transition = input.transition
    ? Object.freeze({ ...input.transition })
    : undefined;
  let selectionResult: ExecutiveWorkspaceSelectionResult | undefined;

  const baseDial = resolveExecutiveWorkspaceDialState({
    currentWorkspace,
    targetWorkspace: transition?.to,
    status:
      transition !== undefined &&
      (transition.status === "planned" ||
        transition.status === "starting" ||
        transition.status === "transitioning")
        ? "transitioning"
        : undefined,
    optionAvailability: input.optionAvailability,
    cockpitStatus: input.cockpit.binding.integrationStatus,
  });

  if (input.action === "complete") {
    if (transition === undefined) {
      throw new TypeError("complete action requires an in-flight transition");
    }
    transition = completeExecutiveWorkspaceTransition(transition);
  } else if (input.action === "cancel") {
    if (transition === undefined) {
      throw new TypeError("cancel action requires an in-flight transition");
    }
    transition = cancelExecutiveWorkspaceTransition(transition);
  } else if (input.intent !== undefined) {
    selectionResult = resolveExecutiveWorkspaceSelection(baseDial, input.intent);
    if (
      selectionResult.accepted &&
      selectionResult.targetWorkspace !== undefined
    ) {
      const planned = planExecutiveWorkspaceTransition(
        currentWorkspace,
        selectionResult,
        input.cockpit,
      );
      transition = startExecutiveWorkspaceTransition(planned);
    }
  }

  const committedWorkspace =
    transition?.status === "completed"
      ? transition.to
      : currentWorkspace;

  const targetWorkspace =
    transition !== undefined &&
    (transition.status === "planned" ||
      transition.status === "starting" ||
      transition.status === "transitioning")
      ? transition.to
      : undefined;

  const dial = resolveExecutiveWorkspaceDialState({
    currentWorkspace: committedWorkspace,
    targetWorkspace,
    status:
      targetWorkspace !== undefined
        ? "transitioning"
        : input.cockpit.binding.integrationStatus === "unavailable"
          ? "unavailable"
          : "active",
    optionAvailability: input.optionAvailability,
    cockpitStatus: input.cockpit.binding.integrationStatus,
  });

  const stage =
    input.stage ??
    resolveExecutiveStageScene(input.cockpit, input.stageOptions);

  // Validate camera intent reuse when stage intent is present.
  if (
    transition?.stageIntent.cameraIntent !== undefined &&
    !isExecutiveStageCameraIntent(transition.stageIntent.cameraIntent)
  ) {
    throw new TypeError("stageIntent.cameraIntent must be a known camera intent");
  }

  const reactions = resolveExecutiveWorkspaceReactions({
    selectionResult,
    transition,
    action: input.action,
  });

  const activeForPropagation = targetWorkspace ?? committedWorkspace;

  return Object.freeze({
    cockpit: input.cockpit,
    stage,
    dial,
    currentWorkspace: committedWorkspace,
    ...(targetWorkspace !== undefined ? { targetWorkspace } : {}),
    ...(transition !== undefined &&
    transition.status !== "cancelled" &&
    transition.status !== "rejected"
      ? {
          transition:
            transition.status === "completed"
              ? transition
              : transition,
        }
      : transition?.status === "cancelled"
        ? { transition }
        : {}),
    reactions,
    surfacePropagation: resolveSurfacePropagation(activeForPropagation),
    integrationIdentity: workspaceDialExperienceSwitchingIdentity,
    integrationVersion: workspaceDialExperienceSwitchingVersion,
  });
}

// ─── Validation ─────────────────────────────────────────────────────────────

export interface ExecutiveWorkspaceExperienceValidation {
  readonly ok: boolean;
  readonly identity: typeof workspaceDialExperienceSwitchingIdentity;
  readonly version: typeof workspaceDialExperienceSwitchingVersion;
  readonly namespace: typeof workspaceDialExperienceSwitchingNamespace;
  readonly phase: typeof workspaceDialExperienceSwitchingPhase;
  readonly architecturalRole: typeof workspaceDialExperienceSwitchingArchitecturalRole;
  readonly dependencyIdentity: typeof workspaceDialExperienceSwitchingDependencyIdentity;
  readonly workspaceKindCount: number;
  readonly dialStatusCount: number;
  readonly transitionStatusCount: number;
  readonly selectionReasonCount: number;
  readonly reactionKindCount: number;
  readonly compositionIntentCount: number;
  readonly focusPolicyCount: number;
  readonly optionCount: number;
  readonly guaranteeCount: number;
  readonly invariantCount: number;
  readonly stageIntegrationOk: boolean;
  readonly frozen: boolean;
  readonly themeSemanticOnly: boolean;
  readonly frameworkIndependent: boolean;
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

export function validateExecutiveWorkspaceExperience(
  snapshot?: ExecutiveWorkspaceExperienceSnapshot,
): ExecutiveWorkspaceExperienceValidation {
  const stageIntegration = verifyExecutiveStageIntegration();

  const identityOk =
    workspaceDialExperienceSwitchingIdentity ===
      "NEX-CI:4/WorkspaceDialExperienceSwitching" &&
    workspaceDialExperienceSwitchingVersion === "1.4.0" &&
    workspaceDialExperienceSwitchingNamespace ===
      "nexora.executive.cockpit.integration.workspace-dial" &&
    workspaceDialExperienceSwitchingPhase ===
      "WorkspaceDialExperienceSwitching" &&
    workspaceDialExperienceSwitchingArchitecturalRole ===
      "WorkspaceDialExperienceSwitching" &&
    workspaceDialExperienceSwitchingDependencyIdentity ===
      "NEX-CI:3/ExecutiveStageIntegration" &&
    workspaceDialExperienceSwitchingDependencyIdentity ===
      executiveStageIntegrationIdentity &&
    WORKSPACE_DIAL_EXPERIENCE_SWITCHING_BOUNDARY.consumesNexCi3Only === true;

  const vocabularyOk =
    exactOrder(EXECUTIVE_WORKSPACE_KINDS, [
      "overview",
      "problem",
      "scenario",
      "decision",
      "execution",
    ]) &&
    exactOrder(EXECUTIVE_WORKSPACE_DIAL_STATUSES, [
      "idle",
      "ready",
      "selecting",
      "transitioning",
      "active",
      "unavailable",
    ]) &&
    exactOrder(EXECUTIVE_WORKSPACE_TRANSITION_STATUSES, [
      "planned",
      "starting",
      "transitioning",
      "completed",
      "cancelled",
      "rejected",
    ]) &&
    exactOrder(EXECUTIVE_WORKSPACE_SELECTION_REASONS, [
      "accepted",
      "already-active",
      "unknown-workspace",
      "disabled",
      "unavailable",
      "transition-in-progress",
    ]) &&
    exactOrder(EXECUTIVE_WORKSPACE_REACTION_KINDS, [
      "workspace-selection-accepted",
      "workspace-selection-rejected",
      "workspace-transition-start",
      "workspace-context-update",
      "stage-recompose",
      "scene-theme-change",
      "workspace-transition-complete",
      "workspace-transition-cancel",
    ]) &&
    unique([...EXECUTIVE_WORKSPACE_KINDS]) &&
    unique([...EXECUTIVE_WORKSPACE_DIAL_STATUSES]) &&
    unique([...EXECUTIVE_WORKSPACE_TRANSITION_STATUSES]) &&
    unique([...EXECUTIVE_WORKSPACE_SELECTION_REASONS]) &&
    unique([...EXECUTIVE_WORKSPACE_REACTION_KINDS]);

  const options = resolveExecutiveWorkspaceDialOptions();
  const optionsOk =
    options.length === EXECUTIVE_WORKSPACE_KINDS.length &&
    exactOrder(
      options.map((option) => option.workspace.kind),
      [...EXECUTIVE_WORKSPACE_KINDS],
    ) &&
    options.every((option, index) => option.order === index) &&
    unique(options.map((option) => option.workspace.id));

  let snapshotOk = true;
  if (snapshot !== undefined) {
    const transitioning =
      snapshot.transition !== undefined &&
      (snapshot.transition.status === "planned" ||
        snapshot.transition.status === "starting" ||
        snapshot.transition.status === "transitioning");

    snapshotOk =
      Object.isFrozen(snapshot) &&
      Object.isFrozen(snapshot.dial) &&
      Object.isFrozen(snapshot.dial.options) &&
      Object.isFrozen(snapshot.reactions) &&
      Object.isFrozen(snapshot.surfacePropagation) &&
      snapshot.integrationIdentity ===
        workspaceDialExperienceSwitchingIdentity &&
      isExecutiveWorkspaceDialStatus(snapshot.dial.status) &&
      (!transitioning ||
        (snapshot.targetWorkspace !== undefined &&
          snapshot.currentWorkspace !== undefined &&
          snapshot.targetWorkspace.id !== snapshot.currentWorkspace.id) ||
        (snapshot.targetWorkspace !== undefined &&
          snapshot.currentWorkspace === undefined)) &&
      (snapshot.transition === undefined ||
        (isExecutiveWorkspaceTransitionStatus(snapshot.transition.status) &&
          snapshot.transition.stageIntent.sceneTheme !== undefined &&
          typeof snapshot.transition.stageIntent.sceneTheme.themeKey ===
            "string" &&
          !/#(?:[0-9a-fA-F]{3,8})\b/.test(
            snapshot.transition.stageIntent.sceneTheme.themeKey,
          ) &&
          !/\b(?:rgb|hsl)\s*\(/i.test(
            snapshot.transition.stageIntent.sceneTheme.themeKey,
          ))) &&
      snapshot.reactions.every(
        (reaction) =>
          isExecutiveWorkspaceReactionKind(reaction.kind) &&
          Object.isFrozen(reaction),
      ) &&
      !("angle" in snapshot.dial) &&
      !("rotation" in snapshot.dial) &&
      !("degrees" in snapshot.dial);
  }

  const guaranteesOk =
    WORKSPACE_DIAL_EXPERIENCE_SWITCHING_GUARANTEES.length === 23 &&
    exactOrder(
      WORKSPACE_DIAL_EXPERIENCE_SWITCHING_GUARANTEES.map((entry) => entry.id),
      [
        "nex-ci-3-sole-immediate-dependency",
        "workspace-dial-remains-control-surface",
        "current-target-distinct-during-transition",
        "only-canonical-available-options-selectable",
        "same-workspace-no-redundant-transition",
        "unavailable-cannot-become-target",
        "transition-at-most-one-target",
        "completion-commits-planned-target",
        "selection-focus-remain-separate",
        "invalid-focus-not-preserved",
        "invalid-selection-not-preserved",
        "theme-is-semantic-not-physical-color",
        "composition-intent-has-no-coordinates",
        "dial-state-has-no-physical-rotation",
        "no-react-dependency",
        "no-threejs-dependency",
        "no-r3f-dependency",
        "no-renderer-side-effects",
        "no-global-runtime-mutation",
        "resolution-deterministic",
        "inputs-not-mutated",
        "no-advisor-insight-content",
        "no-timeline-explorer-livelens-behavior",
      ],
    );

  const immutabilityOk =
    Object.isFrozen(workspaceDialExperienceSwitchingCanonicalIdentity) &&
    Object.isFrozen(EXECUTIVE_WORKSPACE_KINDS) &&
    Object.isFrozen(EXECUTIVE_WORKSPACE_DIAL_STATUSES) &&
    Object.isFrozen(EXECUTIVE_WORKSPACE_TRANSITION_STATUSES) &&
    Object.isFrozen(EXECUTIVE_WORKSPACE_SELECTION_REASONS) &&
    Object.isFrozen(EXECUTIVE_WORKSPACE_REACTION_KINDS) &&
    Object.isFrozen(EXECUTIVE_WORKSPACE_REGISTRY) &&
    Object.isFrozen(WORKSPACE_DIAL_EXPERIENCE_SWITCHING_GUARANTEES) &&
    Object.isFrozen(WORKSPACE_DIAL_EXPERIENCE_SWITCHING_BOUNDARY) &&
    Object.isFrozen(workspaceDialExperienceSwitching);

  const themeSemanticOnly =
    WORKSPACE_DIAL_EXPERIENCE_SWITCHING_BOUNDARY.ownsSceneColorValues ===
      false &&
    WORKSPACE_DIAL_EXPERIENCE_SWITCHING_BOUNDARY.ownsDialGeometry === false &&
    WORKSPACE_DIAL_EXPERIENCE_SWITCHING_BOUNDARY.ownsDialRotation === false;

  const frameworkIndependent =
    WORKSPACE_DIAL_EXPERIENCE_SWITCHING_BOUNDARY.frameworkIndependent ===
      true &&
    WORKSPACE_DIAL_EXPERIENCE_SWITCHING_BOUNDARY.introducesReact === false &&
    WORKSPACE_DIAL_EXPERIENCE_SWITCHING_BOUNDARY.introducesThreeJs === false &&
    WORKSPACE_DIAL_EXPERIENCE_SWITCHING_BOUNDARY.introducesReactThreeFiber ===
      false &&
    WORKSPACE_DIAL_EXPERIENCE_SWITCHING_BOUNDARY.implementsNexCi5 === false;

  const ok =
    identityOk &&
    vocabularyOk &&
    optionsOk &&
    snapshotOk &&
    guaranteesOk &&
    immutabilityOk &&
    themeSemanticOnly &&
    frameworkIndependent &&
    stageIntegration.ok === true;

  return Object.freeze({
    ok,
    identity: workspaceDialExperienceSwitchingIdentity,
    version: workspaceDialExperienceSwitchingVersion,
    namespace: workspaceDialExperienceSwitchingNamespace,
    phase: workspaceDialExperienceSwitchingPhase,
    architecturalRole: workspaceDialExperienceSwitchingArchitecturalRole,
    dependencyIdentity: workspaceDialExperienceSwitchingDependencyIdentity,
    workspaceKindCount: EXECUTIVE_WORKSPACE_KINDS.length,
    dialStatusCount: EXECUTIVE_WORKSPACE_DIAL_STATUSES.length,
    transitionStatusCount: EXECUTIVE_WORKSPACE_TRANSITION_STATUSES.length,
    selectionReasonCount: EXECUTIVE_WORKSPACE_SELECTION_REASONS.length,
    reactionKindCount: EXECUTIVE_WORKSPACE_REACTION_KINDS.length,
    compositionIntentCount: EXECUTIVE_WORKSPACE_COMPOSITION_INTENTS.length,
    focusPolicyCount: EXECUTIVE_WORKSPACE_FOCUS_POLICIES.length,
    optionCount: options.length,
    guaranteeCount: WORKSPACE_DIAL_EXPERIENCE_SWITCHING_GUARANTEES.length,
    invariantCount: WORKSPACE_DIAL_EXPERIENCE_SWITCHING_GUARANTEES.length,
    stageIntegrationOk: stageIntegration.ok,
    frozen: immutabilityOk,
    themeSemanticOnly,
    frameworkIndependent,
  });
}

export function verifyWorkspaceDialExperienceSwitching():
  ExecutiveWorkspaceExperienceValidation {
  return validateExecutiveWorkspaceExperience();
}

// ─── Public catalogs / module bag ───────────────────────────────────────────

export const workspaceDialExperienceSwitchingApiNames = Object.freeze([
  "getWorkspaceDialExperienceSwitchingIdentity",
  "getExecutiveWorkspaceKinds",
  "isExecutiveWorkspaceKind",
  "getExecutiveWorkspaceDialStatuses",
  "isExecutiveWorkspaceDialStatus",
  "getExecutiveWorkspaceTransitionStatuses",
  "isExecutiveWorkspaceTransitionStatus",
  "getExecutiveWorkspaceSelectionReasons",
  "isExecutiveWorkspaceSelectionReason",
  "getExecutiveWorkspaceReactionKinds",
  "isExecutiveWorkspaceReactionKind",
  "getExecutiveWorkspaceCompositionIntents",
  "isExecutiveWorkspaceCompositionIntent",
  "getExecutiveWorkspaceFocusPolicies",
  "isExecutiveWorkspaceFocusPolicy",
  "getExecutiveWorkspaceSelectionPolicies",
  "isExecutiveWorkspaceSelectionPolicy",
  "createExecutiveWorkspaceReference",
  "createExecutiveWorkspaceSelectionIntent",
  "createExecutiveWorkspaceDialNavigationIntent",
  "resolveExecutiveWorkspaceDialOptions",
  "resolveExecutiveWorkspaceDialState",
  "resolveExecutiveWorkspaceSelection",
  "planExecutiveWorkspaceTransition",
  "startExecutiveWorkspaceTransition",
  "resolveExecutiveWorkspaceStageIntent",
  "resolveExecutiveWorkspaceReactions",
  "completeExecutiveWorkspaceTransition",
  "cancelExecutiveWorkspaceTransition",
  "isSubjectCompatibleWithWorkspace",
  "resolveExecutiveWorkspaceExperience",
  "validateExecutiveWorkspaceExperience",
  "verifyWorkspaceDialExperienceSwitching",
] as const);

export const WORKSPACE_DIAL_EXPERIENCE_SWITCHING_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "ExecutiveWorkspaceKind",
    "ExecutiveWorkspaceReference",
    "ExecutiveWorkspaceDialOption",
    "ExecutiveWorkspaceDialState",
    "ExecutiveWorkspaceDialStatus",
    "ExecutiveWorkspaceSelectionIntent",
    "ExecutiveWorkspaceDialNavigationIntent",
    "ExecutiveWorkspaceSelectionResult",
    "ExecutiveWorkspaceSelectionReason",
    "ExecutiveWorkspaceTransition",
    "ExecutiveWorkspaceTransitionStatus",
    "ExecutiveWorkspaceExperienceIntent",
    "ExecutiveWorkspaceSceneThemeIntent",
    "ExecutiveWorkspaceStageIntent",
    "ExecutiveWorkspaceCompositionIntent",
    "ExecutiveWorkspaceFocusPolicy",
    "ExecutiveWorkspaceSelectionPolicy",
    "ExecutiveWorkspaceReaction",
    "ExecutiveWorkspaceReactionKind",
    "ExecutiveWorkspaceExperienceSnapshot",
    "ExecutiveWorkspaceExperienceInput",
    "ExecutiveWorkspaceExperienceValidation",
  ] as const);

export const workspaceDialExperienceSwitching = Object.freeze({
  phase: "WorkspaceDialExperienceSwitching" as const,
  name: "WorkspaceDialExperienceSwitching" as const,
  identity: workspaceDialExperienceSwitchingIdentity,
  version: workspaceDialExperienceSwitchingVersion,
  namespace: workspaceDialExperienceSwitchingNamespace,
  layer: workspaceDialExperienceSwitchingLayer,
  stage: workspaceDialExperienceSwitchingStage,
  architecturalRole: workspaceDialExperienceSwitchingArchitecturalRole,
  role: "WorkspaceDialExperienceSwitching" as const,
  status: workspaceDialExperienceSwitchingStability,
  upstreamDependency: workspaceDialExperienceSwitchingDependencyIdentity,
  dependencyPath: workspaceDialExperienceSwitchingDependencyPath,
  deterministic: workspaceDialExperienceSwitchingDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  browserIndependent: true as const,
  principle: WORKSPACE_DIAL_EXPERIENCE_SWITCHING_PRINCIPLE,
  boundary: WORKSPACE_DIAL_EXPERIENCE_SWITCHING_BOUNDARY,
  workspaceKinds: EXECUTIVE_WORKSPACE_KINDS,
  dialStatuses: EXECUTIVE_WORKSPACE_DIAL_STATUSES,
  transitionStatuses: EXECUTIVE_WORKSPACE_TRANSITION_STATUSES,
  selectionReasons: EXECUTIVE_WORKSPACE_SELECTION_REASONS,
  reactionKinds: EXECUTIVE_WORKSPACE_REACTION_KINDS,
  compositionIntents: EXECUTIVE_WORKSPACE_COMPOSITION_INTENTS,
  focusPolicies: EXECUTIVE_WORKSPACE_FOCUS_POLICIES,
  selectionPolicies: EXECUTIVE_WORKSPACE_SELECTION_POLICIES,
  rapidInputPolicy: EXECUTIVE_WORKSPACE_RAPID_INPUT_POLICY,
  guarantees: WORKSPACE_DIAL_EXPERIENCE_SWITCHING_GUARANTEES,
  forbiddenResponsibilities:
    WORKSPACE_DIAL_EXPERIENCE_SWITCHING_FORBIDDEN_RESPONSIBILITIES,
  publicApiSurface: workspaceDialExperienceSwitchingApiNames,
  publicTypes: WORKSPACE_DIAL_EXPERIENCE_SWITCHING_PUBLIC_TYPE_NAMES,
  nexCi3Boundary: "NEX-CI:3-executive-stage-integration-only" as const,
  workspaceVocabularySource:
    "Aligned with REX Runtime Executive Workspace kinds (overview/problem/scenario/decision/execution); defined as NEX-CI contract to preserve dependency chain" as const,
  architecturalStatus:
    "Workspace Dial Experience Switching Complete · Deterministic · Immutable · Renderer-Neutral · ReadyForAdvisorInsightIntegration" as const,
});

/**
 * Approved NEX-CI:3 / cockpit consumer surfaces re-exported for immediate
 * downstream NEX-CI phases (e.g. NEX-CI:5) so they can preserve the chain.
 */
export {
  EXECUTIVE_COCKPIT_SURFACES,
  cockpitShellRuntimeBindingIdentity,
  cockpitShellRuntimeBindingVersion,
  createExecutiveCockpitIntegrationSnapshot,
  createExecutiveStageInteractionIntent,
  executiveCockpitIntegrationFoundationIdentity,
  executiveCockpitIntegrationFoundationVersion,
  executiveStageIntegrationIdentity,
  executiveStageIntegrationVersion,
  isExecutiveCockpitPresentationState,
  isExecutiveCockpitSurface,
  resolveCockpitShellRuntimeBinding,
  resolveExecutiveStageScene,
  verifyCockpitShellRuntimeBinding,
  verifyExecutiveCockpitIntegrationFoundation,
  verifyExecutiveStageIntegration,
} from "@/app/lib/nex-ci/executiveStageIntegration";

export type {
  CockpitShellRuntimeSnapshot,
  ExecutiveCockpitIntegrationStatus,
  ExecutiveCockpitPresentationState,
  ExecutiveCockpitSubjectKind,
  ExecutiveCockpitSubjectReference,
  ExecutiveCockpitSurface,
  ExecutiveStageAttentionDirective,
  ExecutiveStageInteractionIntent,
  ExecutiveStageRelationship,
  ExecutiveStageSceneOptions,
  ExecutiveStageSceneSnapshot,
  ExecutiveStageSubject,
} from "@/app/lib/nex-ci/executiveStageIntegration";
