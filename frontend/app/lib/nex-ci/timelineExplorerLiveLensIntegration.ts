/**
 * NEX-CI:7 — Timeline, Explorer & Live Lens Integration.
 *
 * Makes Timeline, Explorer, and Live Lens runtime-aware and orchestration-aware
 * contextual navigation surfaces over one canonical executive Cockpit state.
 *
 * Canonical flow:
 *   Cockpit Orchestration Snapshot
 *   → Timeline Context
 *   → Explorer Context
 *   → Live Lens Context
 *
 * Reverse flow:
 *   Timeline / Explorer / Live Lens interaction
 *   → Cockpit Intent
 *   → NEX-CI:6 Orchestrator
 *   → updated Cockpit context
 *   → NEX-CI:7 re-resolves contextual surfaces
 *
 * Sole immediate NEX-CI dependency: NEX-CI:6 Cockpit Interaction Orchestration.
 * No React, Three.js, AI, persistence, or NEX-CI:8 certification behavior.
 */

import {
  advisorInsightIntegrationIdentity,
  advisorInsightIntegrationVersion,
  cockpitInteractionOrchestrationIdentity,
  cockpitInteractionOrchestrationVersion,
  cockpitShellRuntimeBindingIdentity,
  cockpitShellRuntimeBindingVersion,
  createExecutiveCockpitInteractionIntent,
  executiveCockpitIntegrationFoundationIdentity,
  executiveCockpitIntegrationFoundationVersion,
  executiveStageIntegrationIdentity,
  executiveStageIntegrationVersion,
  verifyCockpitInteractionOrchestration,
  workspaceDialExperienceSwitchingIdentity,
  workspaceDialExperienceSwitchingVersion,
  type ExecutiveCockpitIntegrationStatus,
  type ExecutiveCockpitInteractionIntent,
  type ExecutiveCockpitInteractionPriority,
  type ExecutiveCockpitOrchestrationSnapshot,
  type ExecutiveCockpitPresentationState,
  type ExecutiveCockpitSubjectKind,
  type ExecutiveCockpitSubjectReference,
  type ExecutiveCockpitSurface,
  type ExecutiveWorkspaceReference,
} from "@/app/lib/nex-ci/cockpitInteractionOrchestration";

// ─── Identity ───────────────────────────────────────────────────────────────

export const timelineExplorerLiveLensIntegrationIdentity =
  "NEX-CI:7/TimelineExplorerLiveLensIntegration" as const;

export const timelineExplorerLiveLensIntegrationVersion = "1.7.0" as const;

export const timelineExplorerLiveLensIntegrationNamespace =
  "nexora.executive.cockpit.integration.contextual-surfaces" as const;

export const timelineExplorerLiveLensIntegrationLayer = "NEX-CI" as const;

export const timelineExplorerLiveLensIntegrationPhase =
  "TimelineExplorerLiveLensIntegration" as const;

export const timelineExplorerLiveLensIntegrationStage =
  "TimelineExplorerLiveLensIntegration" as const;

export const timelineExplorerLiveLensIntegrationArchitecturalRole =
  "TimelineExplorerLiveLensIntegration" as const;

export const timelineExplorerLiveLensIntegrationDependencyIdentity =
  cockpitInteractionOrchestrationIdentity;

export const timelineExplorerLiveLensIntegrationDependencyPath =
  "@/app/lib/nex-ci/cockpitInteractionOrchestration" as const;

export const timelineExplorerLiveLensIntegrationStability =
  "TimelineExplorerLiveLensIntegrationReady" as const;

export const timelineExplorerLiveLensIntegrationDeterministic = true as const;

export const timelineExplorerLiveLensIntegrationSideEffectPolicy =
  "side-effect-free" as const;

export const timelineExplorerLiveLensIntegrationMutationPolicy =
  "immutable" as const;

/**
 * Workspace / focus compatibility:
 * Timeline scope and Explorer mode usually preserve when still valid.
 * Live Lens layer preserves when compatible; otherwise nearest valid root (goal).
 * Invalid Live Lens centers are cleared — never retained as stale references.
 */
export const EXECUTIVE_CONTEXTUAL_COMPATIBILITY_POLICY =
  "preserve-timeline-scope·preserve-explorer-mode·live-lens-compatible-or-goal-root·clear-invalid-center" as const;

export const EXECUTIVE_CONTEXTUAL_SURFACES_PRINCIPLE =
  "Timeline, Explorer, and Live Lens are contextual views over one Cockpit orchestration state. Interactions normalize to NEX-CI:6 intents; surfaces never directly mutate each other." as const;

export const timelineExplorerLiveLensIntegrationCanonicalIdentity =
  Object.freeze({
    identity: timelineExplorerLiveLensIntegrationIdentity,
    version: timelineExplorerLiveLensIntegrationVersion,
    namespace: timelineExplorerLiveLensIntegrationNamespace,
    layer: timelineExplorerLiveLensIntegrationLayer,
    phase: timelineExplorerLiveLensIntegrationPhase,
    stage: timelineExplorerLiveLensIntegrationStage,
    architecturalRole: timelineExplorerLiveLensIntegrationArchitecturalRole,
    dependencyIdentity: timelineExplorerLiveLensIntegrationDependencyIdentity,
    dependencyPath: timelineExplorerLiveLensIntegrationDependencyPath,
    stabilityStatus: timelineExplorerLiveLensIntegrationStability,
    deterministicStatus: timelineExplorerLiveLensIntegrationDeterministic,
    sideEffectPolicy: timelineExplorerLiveLensIntegrationSideEffectPolicy,
    mutationPolicy: timelineExplorerLiveLensIntegrationMutationPolicy,
  });

export const TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_BOUNDARY = Object.freeze({
  nexCiAuthority: "Executive-Cockpit-Integration" as const,
  contextualAuthority: "Executive-Contextual-Surfaces" as const,
  boundaryAuthority: "NEX-CI:7" as const,
  architecturalRole: "TimelineExplorerLiveLensIntegration" as const,
  soleImmediateDependency:
    "NEX-CI:6/CockpitInteractionOrchestration" as const,
  consumesNexCi6Only: true as const,
  bypassesIntoNexCi5: false as const,
  bypassesIntoNexCi4: false as const,
  bypassesIntoNexCi3: false as const,
  bypassesIntoNexCi2: false as const,
  bypassesIntoNexCi1: false as const,
  bypassesIntoRex: false as const,
  bypassesIntoExDri: false as const,
  bypassesIntoDri: false as const,
  bypassesIntoNol: false as const,
  contextualSurfacesRemainSeparate: true as const,
  surfacesNeverDirectlyMutateEachOther: true as const,
  ownsGlobalSelectionFocus: false as const,
  ownsPersistence: false as const,
  ownsHistoryEngine: false as const,
  ownsReplayAnimation: false as const,
  ownsExplorerIngestion: false as const,
  ownsLiveLensGeometry: false as const,
  ownsAiExecution: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  intelligenceProviderIndependent: true as const,
  introducesReact: false as const,
  introducesThreeJs: false as const,
  introducesReactThreeFiber: false as const,
  introducesAiSdk: false as const,
  implementsNexCi8: false as const,
  compatibilityPolicy: EXECUTIVE_CONTEXTUAL_COMPATIBILITY_POLICY,
});

// ─── Contextual surfaces ────────────────────────────────────────────────────

export const EXECUTIVE_CONTEXTUAL_SURFACES = Object.freeze([
  "timeline",
  "explorer",
  "live-lens",
] as const);

export type ExecutiveContextualSurface =
  (typeof EXECUTIVE_CONTEXTUAL_SURFACES)[number];

export interface ExecutiveContextualSurfaceState {
  readonly surface: ExecutiveContextualSurface;
  readonly active: boolean;
  readonly available: boolean;
  readonly workspace?: ExecutiveWorkspaceReference;
  readonly selectedSubject?: ExecutiveCockpitSubjectReference;
  readonly focusedSubject?: ExecutiveCockpitSubjectReference;
  readonly presentationState?: ExecutiveCockpitPresentationState;
  readonly status: ExecutiveCockpitIntegrationStatus;
}

// ─── Pack references (aligned with cockpit subject / workspace kinds) ───────

export const EXECUTIVE_PACK_KINDS = Object.freeze([
  "problem",
  "scenario",
  "decision",
  "execution",
  "insight",
  "journal",
] as const);

export type ExecutivePackKind = (typeof EXECUTIVE_PACK_KINDS)[number];

export interface ExecutivePackReference {
  readonly id: string;
  readonly kind: ExecutivePackKind;
}

// ─── Timeline ───────────────────────────────────────────────────────────────

export const EXECUTIVE_TIMELINE_SCOPES = Object.freeze([
  "day",
  "week",
  "month",
  "year",
] as const);

export type ExecutiveTimelineScope =
  (typeof EXECUTIVE_TIMELINE_SCOPES)[number];

export const EXECUTIVE_TIMELINE_IMPORTANCE_LEVELS = Object.freeze([
  "low",
  "normal",
  "high",
  "critical",
] as const);

export type ExecutiveTimelineImportance =
  (typeof EXECUTIVE_TIMELINE_IMPORTANCE_LEVELS)[number];

export interface ExecutiveTimelineEntry {
  readonly id: string;
  readonly subject?: ExecutiveCockpitSubjectReference;
  readonly pack?: ExecutivePackReference;
  readonly timestamp?: string;
  readonly importance?: ExecutiveTimelineImportance;
}

export interface ExecutiveTimelineContext {
  readonly workspace?: ExecutiveWorkspaceReference;
  readonly selectedSubject?: ExecutiveCockpitSubjectReference;
  readonly focusedSubject?: ExecutiveCockpitSubjectReference;
  readonly primarySubject?: ExecutiveCockpitSubjectReference;
  readonly presentationState?: ExecutiveCockpitPresentationState;
  readonly scope: ExecutiveTimelineScope;
  readonly entries: readonly ExecutiveTimelineEntry[];
  readonly status: ExecutiveCockpitIntegrationStatus;
}

export const EXECUTIVE_TIMELINE_INTERACTION_KINDS = Object.freeze([
  "select-entry",
  "select-pack",
  "change-scope",
  "replay",
  "seek",
] as const);

export type ExecutiveTimelineInteractionKind =
  (typeof EXECUTIVE_TIMELINE_INTERACTION_KINDS)[number];

export interface ExecutiveTimelineInteractionIntent {
  readonly source: "timeline";
  readonly kind: ExecutiveTimelineInteractionKind;
  readonly entryId?: string;
  readonly packId?: string;
  readonly subjectId?: string;
  readonly scope?: ExecutiveTimelineScope;
  readonly timestamp?: string;
}

export interface ExecutiveTimelineState {
  readonly scope?: ExecutiveTimelineScope;
  readonly entries?: readonly ExecutiveTimelineEntry[];
  readonly selectedEntryId?: string;
}

/**
 * Replay is a semantic temporal navigation request boundary only.
 * No animation loops, video rendering, or historical storage.
 */
export const EXECUTIVE_TIMELINE_REPLAY_BOUNDARY =
  "semantic-temporal-navigation-request·no-animation·no-persistence" as const;

// ─── Explorer ───────────────────────────────────────────────────────────────

export const EXECUTIVE_EXPLORER_MODES = Object.freeze([
  "objects",
  "data",
  "journal",
  "packs",
  "related",
] as const);

export type ExecutiveExplorerMode = (typeof EXECUTIVE_EXPLORER_MODES)[number];

export const EXECUTIVE_EXPLORER_ITEM_KINDS = Object.freeze([
  "object",
  "data",
  "journal",
  "pack",
  "related",
] as const);

export type ExecutiveExplorerItemKind =
  (typeof EXECUTIVE_EXPLORER_ITEM_KINDS)[number];

export interface ExecutiveExplorerItem {
  readonly id: string;
  readonly kind: ExecutiveExplorerItemKind;
  readonly subject?: ExecutiveCockpitSubjectReference;
  readonly pack?: ExecutivePackReference;
  readonly relatedToSubjectId?: string;
}

export interface ExecutiveExplorerContext {
  readonly workspace?: ExecutiveWorkspaceReference;
  readonly selectedSubject?: ExecutiveCockpitSubjectReference;
  readonly focusedSubject?: ExecutiveCockpitSubjectReference;
  readonly primarySubject?: ExecutiveCockpitSubjectReference;
  readonly mode: ExecutiveExplorerMode;
  readonly items: readonly ExecutiveExplorerItem[];
  readonly status: ExecutiveCockpitIntegrationStatus;
}

export const EXECUTIVE_EXPLORER_INTERACTION_KINDS = Object.freeze([
  "select-item",
  "focus-item",
  "open-item",
  "change-mode",
  "dismiss",
] as const);

export type ExecutiveExplorerInteractionKind =
  (typeof EXECUTIVE_EXPLORER_INTERACTION_KINDS)[number];

export interface ExecutiveExplorerInteractionIntent {
  readonly source: "explorer";
  readonly kind: ExecutiveExplorerInteractionKind;
  readonly itemId?: string;
  readonly subjectId?: string;
  readonly mode?: ExecutiveExplorerMode;
}

export interface ExecutiveExplorerState {
  readonly mode?: ExecutiveExplorerMode;
  readonly items?: readonly ExecutiveExplorerItem[];
}

// ─── Live Lens ──────────────────────────────────────────────────────────────

export const EXECUTIVE_LIVE_LENS_LAYERS = Object.freeze([
  "goal",
  "object",
  "pack",
] as const);

export type ExecutiveLiveLensLayer =
  (typeof EXECUTIVE_LIVE_LENS_LAYERS)[number];

export const EXECUTIVE_LIVE_LENS_ITEM_ROLES = Object.freeze([
  "center",
  "related",
  "available",
] as const);

export type ExecutiveLiveLensItemRole =
  (typeof EXECUTIVE_LIVE_LENS_ITEM_ROLES)[number];

export interface ExecutiveLiveLensItem {
  readonly id: string;
  readonly subject: ExecutiveCockpitSubjectReference;
  readonly role: ExecutiveLiveLensItemRole;
}

export interface ExecutiveLiveLensContext {
  readonly workspace?: ExecutiveWorkspaceReference;
  readonly layer: ExecutiveLiveLensLayer;
  readonly focusedSubject?: ExecutiveCockpitSubjectReference;
  readonly selectedSubject?: ExecutiveCockpitSubjectReference;
  readonly centerSubject?: ExecutiveCockpitSubjectReference;
  readonly items: readonly ExecutiveLiveLensItem[];
  readonly status: ExecutiveCockpitIntegrationStatus;
}

export const EXECUTIVE_LIVE_LENS_INTERACTION_KINDS = Object.freeze([
  "select-item",
  "focus-item",
  "open-item",
  "change-layer",
  "back",
  "reset",
] as const);

export type ExecutiveLiveLensInteractionKind =
  (typeof EXECUTIVE_LIVE_LENS_INTERACTION_KINDS)[number];

export interface ExecutiveLiveLensInteractionIntent {
  readonly source: "live-lens";
  readonly kind: ExecutiveLiveLensInteractionKind;
  readonly itemId?: string;
  readonly subjectId?: string;
  readonly layer?: ExecutiveLiveLensLayer;
}

export interface ExecutiveLiveLensState {
  readonly layer?: ExecutiveLiveLensLayer;
  readonly explicitCenterId?: string;
}

/**
 * Live Lens layer navigation:
 * open drills goal→object→pack; back reverses pack→object→goal;
 * reset restores goal root without changing workspace.
 */
export const EXECUTIVE_LIVE_LENS_LAYER_NAVIGATION_POLICY =
  "open-drills·back-ascends·reset-to-goal-root·no-browser-history" as const;

/**
 * Live Lens center precedence:
 * focused → selected → Stage primary → explicit center → none
 */
export const EXECUTIVE_LIVE_LENS_CENTER_PRIORITY =
  "focused → selected → primary → explicit → none" as const;

// ─── Reactions / snapshot ───────────────────────────────────────────────────

export const EXECUTIVE_CONTEXTUAL_SURFACE_REACTION_KINDS = Object.freeze([
  "timeline-context-update",
  "timeline-scope-change",
  "timeline-entry-select",
  "explorer-context-update",
  "explorer-mode-change",
  "explorer-item-select",
  "live-lens-context-update",
  "live-lens-layer-change",
  "live-lens-center-change",
] as const);

export type ExecutiveContextualSurfaceReactionKind =
  (typeof EXECUTIVE_CONTEXTUAL_SURFACE_REACTION_KINDS)[number];

export interface ExecutiveContextualSurfaceReaction {
  readonly kind: ExecutiveContextualSurfaceReactionKind;
  readonly surface: ExecutiveContextualSurface;
  readonly subjectId?: string;
  readonly priority: ExecutiveCockpitInteractionPriority;
}

export interface ExecutiveContextualSurfacesSnapshot {
  readonly orchestration: ExecutiveCockpitOrchestrationSnapshot;
  readonly timeline: ExecutiveTimelineContext;
  readonly explorer: ExecutiveExplorerContext;
  readonly liveLens: ExecutiveLiveLensContext;
  readonly reactions: readonly ExecutiveContextualSurfaceReaction[];
  readonly integrationIdentity: typeof timelineExplorerLiveLensIntegrationIdentity;
  readonly integrationVersion: typeof timelineExplorerLiveLensIntegrationVersion;
}

export interface ExecutiveContextualSurfacesIntegrationInput {
  readonly orchestration: ExecutiveCockpitOrchestrationSnapshot;
  readonly timelineState?: ExecutiveTimelineState;
  readonly explorerState?: ExecutiveExplorerState;
  readonly liveLensState?: ExecutiveLiveLensState;
  readonly previous?: ExecutiveContextualSurfacesSnapshot;
}

// ─── Guarantees ─────────────────────────────────────────────────────────────

export const TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_GUARANTEES = Object.freeze([
  Object.freeze({
    id: "nex-ci-6-sole-immediate-dependency",
    order: 1,
    statement: "NEX-CI:7 immediately depends on NEX-CI:6 only.",
  }),
  Object.freeze({
    id: "contextual-surfaces-remain-separate",
    order: 2,
    statement: "Timeline, Explorer, and Live Lens remain separate surfaces.",
  }),
  Object.freeze({
    id: "one-canonical-cockpit-state",
    order: 3,
    statement: "All three consume one canonical Cockpit state.",
  }),
  Object.freeze({
    id: "no-direct-cross-surface-mutation",
    order: 4,
    statement: "No contextual surface directly mutates another.",
  }),
  Object.freeze({
    id: "timeline-no-global-selection-focus",
    order: 5,
    statement: "Timeline does not own global selection/focus.",
  }),
  Object.freeze({
    id: "explorer-no-global-selection-focus",
    order: 6,
    statement: "Explorer does not own global selection/focus.",
  }),
  Object.freeze({
    id: "live-lens-no-global-selection-focus",
    order: 7,
    statement: "Live Lens does not own global selection/focus.",
  }),
  Object.freeze({
    id: "focus-selection-remain-distinct",
    order: 8,
    statement: "Selection and focus remain distinct.",
  }),
  Object.freeze({
    id: "workspace-current-target-preserved",
    order: 9,
    statement: "Workspace current/target distinction is preserved.",
  }),
  Object.freeze({
    id: "presentation-reuses-canonical",
    order: 10,
    statement: "Presentation reuses Minimum/Report/Operation.",
  }),
  Object.freeze({
    id: "timeline-scope-ordering-canonical",
    order: 11,
    statement: "Timeline scope ordering is canonical.",
  }),
  Object.freeze({
    id: "explorer-modes-canonical",
    order: 12,
    statement: "Explorer modes are canonical.",
  }),
  Object.freeze({
    id: "live-lens-layers-canonical",
    order: 13,
    statement: "Live Lens layers are canonical.",
  }),
  Object.freeze({
    id: "at-most-one-live-lens-center",
    order: 14,
    statement: "At most one Live Lens center exists.",
  }),
  Object.freeze({
    id: "no-fabricated-timeline-entries",
    order: 15,
    statement: "No fabricated Timeline entries.",
  }),
  Object.freeze({
    id: "no-fabricated-explorer-items",
    order: 16,
    statement: "No fabricated Explorer items.",
  }),
  Object.freeze({
    id: "no-fabricated-live-lens-relationships",
    order: 17,
    statement: "No fabricated Live Lens relationships.",
  }),
  Object.freeze({
    id: "context-items-deterministically-ordered",
    order: 18,
    statement: "Context items are deterministically ordered.",
  }),
  Object.freeze({
    id: "duplicates-handled-deterministically",
    order: 19,
    statement: "Duplicate items are handled deterministically.",
  }),
  Object.freeze({
    id: "empty-context-valid",
    order: 20,
    statement: "Empty context is valid.",
  }),
  Object.freeze({
    id: "inputs-not-mutated",
    order: 21,
    statement: "Inputs are not mutated.",
  }),
  Object.freeze({
    id: "no-react-dependency",
    order: 22,
    statement: "No React dependency exists.",
  }),
  Object.freeze({
    id: "no-threejs-r3f-dependency",
    order: 23,
    statement: "No Three.js/R3F dependency exists.",
  }),
  Object.freeze({
    id: "no-ai-dependency",
    order: 24,
    statement: "No AI dependency exists.",
  }),
  Object.freeze({
    id: "no-persistence",
    order: 25,
    statement: "No persistence occurs.",
  }),
  Object.freeze({
    id: "no-nex-ci-8-certification",
    order: 26,
    statement: "No NEX-CI:8 certification behavior is implemented.",
  }),
]);

export type TimelineExplorerLiveLensIntegrationGuarantee =
  (typeof TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_GUARANTEES)[number];

export const TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "Full NEX-CI certification / freeze / Public Index",
    "Persistent history engine / database-backed Timeline",
    "Real replay animation / video-like rendering",
    "CSV import / Gate / data ingestion",
    "Explorer file loading / database querying",
    "Three.js Live Lens geometry / R3F animation",
    "AI-generated Timeline summaries / Advisor intelligence",
    "Messaging / Jira / external APIs / notifications",
    "localStorage / IndexedDB / filesystem persistence",
    "New REX runtime behavior",
  ] as const);

const REACTION_ORDER: Readonly<
  Record<ExecutiveContextualSurfaceReactionKind, number>
> = Object.freeze({
  "timeline-context-update": 0,
  "timeline-scope-change": 1,
  "timeline-entry-select": 2,
  "explorer-context-update": 3,
  "explorer-mode-change": 4,
  "explorer-item-select": 5,
  "live-lens-context-update": 6,
  "live-lens-layer-change": 7,
  "live-lens-center-change": 8,
});

const PRIORITY_RANK: Readonly<
  Record<ExecutiveCockpitInteractionPriority, number>
> = Object.freeze({
  critical: 0,
  high: 1,
  normal: 2,
  low: 3,
});

const PACK_SUBJECT_KINDS = Object.freeze([
  "pack",
  "problem",
  "scenario",
  "decision",
  "execution",
  "insight",
] as const);

// ─── Type guards / getters ──────────────────────────────────────────────────

export function isExecutiveContextualSurface(
  value: unknown,
): value is ExecutiveContextualSurface {
  return (
    typeof value === "string" &&
    (EXECUTIVE_CONTEXTUAL_SURFACES as readonly string[]).includes(value)
  );
}

export function isExecutiveTimelineScope(
  value: unknown,
): value is ExecutiveTimelineScope {
  return (
    typeof value === "string" &&
    (EXECUTIVE_TIMELINE_SCOPES as readonly string[]).includes(value)
  );
}

export function isExecutiveTimelineImportance(
  value: unknown,
): value is ExecutiveTimelineImportance {
  return (
    typeof value === "string" &&
    (EXECUTIVE_TIMELINE_IMPORTANCE_LEVELS as readonly string[]).includes(value)
  );
}

export function isExecutivePackKind(value: unknown): value is ExecutivePackKind {
  return (
    typeof value === "string" &&
    (EXECUTIVE_PACK_KINDS as readonly string[]).includes(value)
  );
}

export function isExecutiveExplorerMode(
  value: unknown,
): value is ExecutiveExplorerMode {
  return (
    typeof value === "string" &&
    (EXECUTIVE_EXPLORER_MODES as readonly string[]).includes(value)
  );
}

export function isExecutiveExplorerItemKind(
  value: unknown,
): value is ExecutiveExplorerItemKind {
  return (
    typeof value === "string" &&
    (EXECUTIVE_EXPLORER_ITEM_KINDS as readonly string[]).includes(value)
  );
}

export function isExecutiveLiveLensLayer(
  value: unknown,
): value is ExecutiveLiveLensLayer {
  return (
    typeof value === "string" &&
    (EXECUTIVE_LIVE_LENS_LAYERS as readonly string[]).includes(value)
  );
}

export function isExecutiveLiveLensItemRole(
  value: unknown,
): value is ExecutiveLiveLensItemRole {
  return (
    typeof value === "string" &&
    (EXECUTIVE_LIVE_LENS_ITEM_ROLES as readonly string[]).includes(value)
  );
}

export function isExecutiveContextualSurfaceReactionKind(
  value: unknown,
): value is ExecutiveContextualSurfaceReactionKind {
  return (
    typeof value === "string" &&
    (EXECUTIVE_CONTEXTUAL_SURFACE_REACTION_KINDS as readonly string[]).includes(
      value,
    )
  );
}

export function isExecutiveTimelineInteractionKind(
  value: unknown,
): value is ExecutiveTimelineInteractionKind {
  return (
    typeof value === "string" &&
    (EXECUTIVE_TIMELINE_INTERACTION_KINDS as readonly string[]).includes(value)
  );
}

export function isExecutiveExplorerInteractionKind(
  value: unknown,
): value is ExecutiveExplorerInteractionKind {
  return (
    typeof value === "string" &&
    (EXECUTIVE_EXPLORER_INTERACTION_KINDS as readonly string[]).includes(value)
  );
}

export function isExecutiveLiveLensInteractionKind(
  value: unknown,
): value is ExecutiveLiveLensInteractionKind {
  return (
    typeof value === "string" &&
    (EXECUTIVE_LIVE_LENS_INTERACTION_KINDS as readonly string[]).includes(value)
  );
}

export function getTimelineExplorerLiveLensIntegrationIdentity():
  typeof timelineExplorerLiveLensIntegrationCanonicalIdentity {
  return timelineExplorerLiveLensIntegrationCanonicalIdentity;
}

export function getExecutiveContextualSurfaces(): ReadonlyArray<
  ExecutiveContextualSurface
> {
  return EXECUTIVE_CONTEXTUAL_SURFACES;
}

export function getExecutiveTimelineScopes(): ReadonlyArray<
  ExecutiveTimelineScope
> {
  return EXECUTIVE_TIMELINE_SCOPES;
}

export function getExecutiveExplorerModes(): ReadonlyArray<
  ExecutiveExplorerMode
> {
  return EXECUTIVE_EXPLORER_MODES;
}

export function getExecutiveLiveLensLayers(): ReadonlyArray<
  ExecutiveLiveLensLayer
> {
  return EXECUTIVE_LIVE_LENS_LAYERS;
}

export function getExecutiveContextualSurfaceReactionKinds(): ReadonlyArray<
  ExecutiveContextualSurfaceReactionKind
> {
  return EXECUTIVE_CONTEXTUAL_SURFACE_REACTION_KINDS;
}

export function getExecutivePackKinds(): ReadonlyArray<ExecutivePackKind> {
  return EXECUTIVE_PACK_KINDS;
}

// ─── Shared helpers ─────────────────────────────────────────────────────────

function freezeSubject(
  subject: ExecutiveCockpitSubjectReference,
): ExecutiveCockpitSubjectReference {
  return Object.freeze({ id: subject.id, kind: subject.kind });
}

function freezePack(pack: ExecutivePackReference): ExecutivePackReference {
  return Object.freeze({ id: pack.id, kind: pack.kind });
}

function surfaceRuntime(
  orchestration: ExecutiveCockpitOrchestrationSnapshot,
  surface: ExecutiveCockpitSurface,
) {
  return orchestration.advisorInsight.experience.cockpit.surfaces.find(
    (entry) => entry.surface === surface,
  );
}

function primarySubjectFromOrchestration(
  orchestration: ExecutiveCockpitOrchestrationSnapshot,
): ExecutiveCockpitSubjectReference | undefined {
  const primary =
    orchestration.advisorInsight.experience.stage.primarySubject;
  if (primary === undefined) {
    return undefined;
  }
  return freezeSubject({ id: primary.id, kind: primary.kind });
}

function stageSubjects(
  orchestration: ExecutiveCockpitOrchestrationSnapshot,
): readonly ExecutiveCockpitSubjectReference[] {
  return orchestration.advisorInsight.experience.stage.subjects.map((subject) =>
    freezeSubject({ id: subject.id, kind: subject.kind }),
  );
}

function subjectExistsInStage(
  orchestration: ExecutiveCockpitOrchestrationSnapshot,
  subjectId: string,
): boolean {
  return orchestration.advisorInsight.experience.stage.subjects.some(
    (subject) => subject.id === subjectId,
  );
}

function relatedSubjectIds(
  orchestration: ExecutiveCockpitOrchestrationSnapshot,
  anchorId: string | undefined,
): ReadonlySet<string> {
  const related = new Set<string>();
  if (anchorId === undefined) {
    return related;
  }
  for (const relationship of orchestration.advisorInsight.experience.stage
    .relationships) {
    if (relationship.sourceSubjectId === anchorId) {
      related.add(relationship.targetSubjectId);
    } else if (relationship.targetSubjectId === anchorId) {
      related.add(relationship.sourceSubjectId);
    }
  }
  return related;
}

function attentionImportance(
  orchestration: ExecutiveCockpitOrchestrationSnapshot,
  subjectId: string | undefined,
): ExecutiveTimelineImportance | undefined {
  if (subjectId === undefined) {
    return undefined;
  }
  const directive =
    orchestration.advisorInsight.experience.stage.attention.find(
      (entry) => entry.subjectId === subjectId,
    );
  if (directive === undefined) {
    return undefined;
  }
  if (directive.level === "primary") {
    return "critical";
  }
  if (directive.level === "secondary") {
    return "high";
  }
  return "normal";
}

function packKindFromSubjectKind(
  kind: ExecutiveCockpitSubjectKind,
): ExecutivePackKind | undefined {
  if (kind === "pack") {
    return "journal";
  }
  if ((PACK_SUBJECT_KINDS as readonly string[]).includes(kind)) {
    return kind as ExecutivePackKind;
  }
  return undefined;
}

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function compareTimelineEntries(
  a: ExecutiveTimelineEntry,
  b: ExecutiveTimelineEntry,
): number {
  const tsA = a.timestamp ?? "";
  const tsB = b.timestamp ?? "";
  if (tsA !== tsB) {
    return tsA < tsB ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

function compareExplorerItems(
  a: ExecutiveExplorerItem,
  b: ExecutiveExplorerItem,
): number {
  if (a.kind !== b.kind) {
    return a.kind < b.kind ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

function compareLiveLensItems(
  a: ExecutiveLiveLensItem,
  b: ExecutiveLiveLensItem,
): number {
  const roleOrder: Record<ExecutiveLiveLensItemRole, number> = {
    center: 0,
    related: 1,
    available: 2,
  };
  const roleDiff = roleOrder[a.role] - roleOrder[b.role];
  if (roleDiff !== 0) {
    return roleDiff;
  }
  return compareIds(a.id, b.id);
}

function dedupeById<T extends { readonly id: string }>(
  items: readonly T[],
): readonly T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    if (seen.has(item.id)) {
      continue;
    }
    seen.add(item.id);
    result.push(item);
  }
  return Object.freeze(result);
}

export function resolveExecutiveContextualSurfaceState(
  orchestration: ExecutiveCockpitOrchestrationSnapshot,
  surface: ExecutiveContextualSurface,
): ExecutiveContextualSurfaceState {
  if (!isExecutiveContextualSurface(surface)) {
    throw new TypeError("surface must be a known contextual surface");
  }
  const runtime = surfaceRuntime(orchestration, surface);
  return Object.freeze({
    surface,
    active: runtime?.active === true,
    available: runtime?.available === true && runtime.enabled === true,
    ...(orchestration.currentWorkspace !== undefined
      ? { workspace: orchestration.currentWorkspace }
      : {}),
    ...(orchestration.selectedSubject !== undefined
      ? { selectedSubject: freezeSubject(orchestration.selectedSubject) }
      : {}),
    ...(orchestration.focusedSubject !== undefined
      ? { focusedSubject: freezeSubject(orchestration.focusedSubject) }
      : {}),
    ...(orchestration.presentationState !== undefined
      ? { presentationState: orchestration.presentationState }
      : {}),
    status: orchestration.status,
  });
}

// ─── Timeline resolution ────────────────────────────────────────────────────

function filterTimelineEntries(
  orchestration: ExecutiveCockpitOrchestrationSnapshot,
  entries: readonly ExecutiveTimelineEntry[],
): readonly ExecutiveTimelineEntry[] {
  const focusedId = orchestration.focusedSubject?.id;
  const selectedId = orchestration.selectedSubject?.id;
  const primaryId = primarySubjectFromOrchestration(orchestration)?.id;
  const anchorId = focusedId ?? selectedId ?? primaryId;

  const projected = entries
    .filter((entry) => {
      if (entry.subject !== undefined || entry.pack !== undefined) {
        if (anchorId === undefined) {
          return true;
        }
        const subjectId = entry.subject?.id ?? entry.pack?.id;
        if (subjectId === undefined) {
          return true;
        }
        if (
          subjectId === anchorId ||
          relatedSubjectIds(orchestration, anchorId).has(subjectId)
        ) {
          return true;
        }
        // Workspace-associated entries without subject mismatch remain.
        return entry.subject === undefined;
      }
      return true;
    })
    .map((entry) => {
      const importance =
        entry.importance ??
        attentionImportance(
          orchestration,
          entry.subject?.id ?? entry.pack?.id,
        );
      return Object.freeze({
        id: entry.id,
        ...(entry.subject !== undefined
          ? { subject: freezeSubject(entry.subject) }
          : {}),
        ...(entry.pack !== undefined ? { pack: freezePack(entry.pack) } : {}),
        ...(entry.timestamp !== undefined
          ? { timestamp: entry.timestamp }
          : {}),
        ...(importance !== undefined ? { importance } : {}),
      });
    });

  return Object.freeze(
    [...dedupeById(projected)].sort(compareTimelineEntries),
  );
}

export function resolveExecutiveTimelineContext(
  orchestration: ExecutiveCockpitOrchestrationSnapshot,
  timelineState: ExecutiveTimelineState = {},
): ExecutiveTimelineContext {
  const scope = isExecutiveTimelineScope(timelineState.scope)
    ? timelineState.scope
    : "week";
  const runtime = surfaceRuntime(orchestration, "timeline");
  const status =
    runtime?.available === false || runtime?.enabled === false
      ? "unavailable"
      : orchestration.status;
  const primary = primarySubjectFromOrchestration(orchestration);
  const entries = filterTimelineEntries(
    orchestration,
    timelineState.entries ?? [],
  );

  return Object.freeze({
    ...(orchestration.currentWorkspace !== undefined
      ? { workspace: orchestration.currentWorkspace }
      : {}),
    ...(orchestration.selectedSubject !== undefined
      ? { selectedSubject: freezeSubject(orchestration.selectedSubject) }
      : {}),
    ...(orchestration.focusedSubject !== undefined
      ? { focusedSubject: freezeSubject(orchestration.focusedSubject) }
      : {}),
    ...(primary !== undefined ? { primarySubject: primary } : {}),
    ...(orchestration.presentationState !== undefined
      ? { presentationState: orchestration.presentationState }
      : {}),
    scope,
    entries,
    status,
  });
}

/** Alias matching completion API naming. */
export const resolveExecutiveTimelineIntegration =
  resolveExecutiveTimelineContext;

// ─── Explorer resolution ────────────────────────────────────────────────────

function projectExplorerItemsFromStage(
  orchestration: ExecutiveCockpitOrchestrationSnapshot,
  mode: ExecutiveExplorerMode,
): readonly ExecutiveExplorerItem[] {
  const subjects = stageSubjects(orchestration);
  const focusedId = orchestration.focusedSubject?.id;
  const selectedId = orchestration.selectedSubject?.id;
  const anchorId = focusedId ?? selectedId;
  const related = relatedSubjectIds(orchestration, anchorId);
  const items: ExecutiveExplorerItem[] = [];

  for (const subject of subjects) {
    if (mode === "objects" && subject.kind === "object") {
      items.push(
        Object.freeze({
          id: `explorer.object.${subject.id}`,
          kind: "object" as const,
          subject,
        }),
      );
    } else if (mode === "packs") {
      const packKind = packKindFromSubjectKind(subject.kind);
      if (packKind !== undefined) {
        items.push(
          Object.freeze({
            id: `explorer.pack.${subject.id}`,
            kind: "pack" as const,
            subject,
            pack: freezePack({ id: subject.id, kind: packKind }),
          }),
        );
      }
    } else if (mode === "journal" && subject.kind === "pack") {
      items.push(
        Object.freeze({
          id: `explorer.journal.${subject.id}`,
          kind: "journal" as const,
          subject,
          pack: freezePack({ id: subject.id, kind: "journal" }),
        }),
      );
    } else if (mode === "related" && anchorId !== undefined) {
      if (related.has(subject.id) || subject.id === anchorId) {
        items.push(
          Object.freeze({
            id: `explorer.related.${subject.id}`,
            kind: "related" as const,
            subject,
            relatedToSubjectId: anchorId,
          }),
        );
      }
    } else if (mode === "data") {
      // Data resources are never invented — only supplied items apply.
    }
  }

  return Object.freeze(items);
}

function filterExplorerItems(
  orchestration: ExecutiveCockpitOrchestrationSnapshot,
  mode: ExecutiveExplorerMode,
  supplied: readonly ExecutiveExplorerItem[] | undefined,
): readonly ExecutiveExplorerItem[] {
  const source =
    supplied !== undefined && supplied.length > 0
      ? supplied
      : projectExplorerItemsFromStage(orchestration, mode);

  const focusedId = orchestration.focusedSubject?.id;
  const selectedId = orchestration.selectedSubject?.id;
  const anchorId = focusedId ?? selectedId;
  const related = relatedSubjectIds(orchestration, anchorId);

  const projected = source
    .filter((item) => {
      if (!isExecutiveExplorerItemKind(item.kind)) {
        return false;
      }
      if (mode === "related" && anchorId !== undefined) {
        const subjectId = item.subject?.id ?? item.pack?.id;
        return (
          subjectId === undefined ||
          subjectId === anchorId ||
          related.has(subjectId) ||
          item.relatedToSubjectId === anchorId
        );
      }
      if (mode === "objects") {
        return item.kind === "object" || item.subject?.kind === "object";
      }
      if (mode === "packs") {
        return item.kind === "pack" || item.pack !== undefined;
      }
      if (mode === "journal") {
        return item.kind === "journal";
      }
      if (mode === "data") {
        return item.kind === "data";
      }
      return true;
    })
    .map((item) =>
      Object.freeze({
        id: item.id,
        kind: item.kind,
        ...(item.subject !== undefined
          ? { subject: freezeSubject(item.subject) }
          : {}),
        ...(item.pack !== undefined ? { pack: freezePack(item.pack) } : {}),
        ...(item.relatedToSubjectId !== undefined
          ? { relatedToSubjectId: item.relatedToSubjectId }
          : {}),
      }),
    );

  return Object.freeze(
    [...dedupeById(projected)].sort(compareExplorerItems),
  );
}

export function resolveExecutiveExplorerContext(
  orchestration: ExecutiveCockpitOrchestrationSnapshot,
  explorerState: ExecutiveExplorerState = {},
): ExecutiveExplorerContext {
  const mode = isExecutiveExplorerMode(explorerState.mode)
    ? explorerState.mode
    : orchestration.focusedSubject !== undefined ||
        orchestration.selectedSubject !== undefined
      ? "related"
      : "objects";
  const runtime = surfaceRuntime(orchestration, "explorer");
  const status =
    runtime?.available === false || runtime?.enabled === false
      ? "unavailable"
      : orchestration.status;
  const primary = primarySubjectFromOrchestration(orchestration);

  return Object.freeze({
    ...(orchestration.currentWorkspace !== undefined
      ? { workspace: orchestration.currentWorkspace }
      : {}),
    ...(orchestration.selectedSubject !== undefined
      ? { selectedSubject: freezeSubject(orchestration.selectedSubject) }
      : {}),
    ...(orchestration.focusedSubject !== undefined
      ? { focusedSubject: freezeSubject(orchestration.focusedSubject) }
      : {}),
    ...(primary !== undefined ? { primarySubject: primary } : {}),
    mode,
    items: filterExplorerItems(orchestration, mode, explorerState.items),
    status,
  });
}

export const resolveExecutiveExplorerIntegration =
  resolveExecutiveExplorerContext;

// ─── Live Lens resolution ───────────────────────────────────────────────────

function layerForSubjectKind(
  kind: ExecutiveCockpitSubjectKind,
): ExecutiveLiveLensLayer | undefined {
  if (kind === "goal") {
    return "goal";
  }
  if (kind === "object") {
    return "object";
  }
  if ((PACK_SUBJECT_KINDS as readonly string[]).includes(kind)) {
    return "pack";
  }
  return undefined;
}

function subjectsForLayer(
  orchestration: ExecutiveCockpitOrchestrationSnapshot,
  layer: ExecutiveLiveLensLayer,
): readonly ExecutiveCockpitSubjectReference[] {
  return stageSubjects(orchestration).filter((subject) => {
    const subjectLayer = layerForSubjectKind(subject.kind);
    return subjectLayer === layer;
  });
}

export function resolveExecutiveLiveLensCenter(
  orchestration: ExecutiveCockpitOrchestrationSnapshot,
  liveLensState: ExecutiveLiveLensState = {},
): ExecutiveCockpitSubjectReference | undefined {
  const candidates: ExecutiveCockpitSubjectReference[] = [];
  if (orchestration.focusedSubject !== undefined) {
    candidates.push(freezeSubject(orchestration.focusedSubject));
  }
  if (orchestration.selectedSubject !== undefined) {
    candidates.push(freezeSubject(orchestration.selectedSubject));
  }
  const primary = primarySubjectFromOrchestration(orchestration);
  if (primary !== undefined) {
    candidates.push(primary);
  }
  if (
    liveLensState.explicitCenterId !== undefined &&
    liveLensState.explicitCenterId.length > 0
  ) {
    const explicit = stageSubjects(orchestration).find(
      (subject) => subject.id === liveLensState.explicitCenterId,
    );
    if (explicit !== undefined) {
      candidates.push(explicit);
    }
  }

  for (const candidate of candidates) {
    if (subjectExistsInStage(orchestration, candidate.id)) {
      return candidate;
    }
  }
  return undefined;
}

export function resolveExecutiveLiveLensLayer(
  orchestration: ExecutiveCockpitOrchestrationSnapshot,
  liveLensState: ExecutiveLiveLensState = {},
  center: ExecutiveCockpitSubjectReference | undefined = resolveExecutiveLiveLensCenter(
    orchestration,
    liveLensState,
  ),
): ExecutiveLiveLensLayer {
  if (isExecutiveLiveLensLayer(liveLensState.layer)) {
    if (center === undefined) {
      return liveLensState.layer;
    }
    const centerLayer = layerForSubjectKind(center.kind);
    if (centerLayer === undefined || centerLayer === liveLensState.layer) {
      return liveLensState.layer;
    }
    // Preserve explicit layer only when compatible with center kind family
    // or when browsing a parent layer above the center.
    const layerIndex = EXECUTIVE_LIVE_LENS_LAYERS.indexOf(liveLensState.layer);
    const centerIndex = EXECUTIVE_LIVE_LENS_LAYERS.indexOf(centerLayer);
    if (layerIndex <= centerIndex) {
      return liveLensState.layer;
    }
    return centerLayer;
  }

  if (center !== undefined) {
    return layerForSubjectKind(center.kind) ?? "goal";
  }
  return "goal";
}

function projectLiveLensItems(
  orchestration: ExecutiveCockpitOrchestrationSnapshot,
  layer: ExecutiveLiveLensLayer,
  center: ExecutiveCockpitSubjectReference | undefined,
): readonly ExecutiveLiveLensItem[] {
  const layerSubjects = subjectsForLayer(orchestration, layer);
  const related = relatedSubjectIds(orchestration, center?.id);
  const items: ExecutiveLiveLensItem[] = [];

  for (const subject of layerSubjects) {
    let role: ExecutiveLiveLensItemRole = "available";
    if (center !== undefined && subject.id === center.id) {
      role = "center";
    } else if (center !== undefined && related.has(subject.id)) {
      role = "related";
    }
    items.push(
      Object.freeze({
        id: `live-lens.${layer}.${subject.id}`,
        subject,
        role,
      }),
    );
  }

  // Include center even if kind is not in current layer listing when it matches.
  if (
    center !== undefined &&
    layerForSubjectKind(center.kind) === layer &&
    !items.some((item) => item.subject.id === center.id)
  ) {
    items.push(
      Object.freeze({
        id: `live-lens.${layer}.${center.id}`,
        subject: center,
        role: "center" as const,
      }),
    );
  }

  return Object.freeze(
    [...dedupeById(items)].sort(compareLiveLensItems),
  );
}

export function resolveExecutiveLiveLensContext(
  orchestration: ExecutiveCockpitOrchestrationSnapshot,
  liveLensState: ExecutiveLiveLensState = {},
): ExecutiveLiveLensContext {
  const center = resolveExecutiveLiveLensCenter(orchestration, liveLensState);
  const layer = resolveExecutiveLiveLensLayer(
    orchestration,
    liveLensState,
    center,
  );
  const runtime = surfaceRuntime(orchestration, "live-lens");
  const status =
    runtime?.available === false || runtime?.enabled === false
      ? "unavailable"
      : orchestration.status;

  return Object.freeze({
    ...(orchestration.currentWorkspace !== undefined
      ? { workspace: orchestration.currentWorkspace }
      : {}),
    layer,
    ...(orchestration.focusedSubject !== undefined
      ? { focusedSubject: freezeSubject(orchestration.focusedSubject) }
      : {}),
    ...(orchestration.selectedSubject !== undefined
      ? { selectedSubject: freezeSubject(orchestration.selectedSubject) }
      : {}),
    ...(center !== undefined ? { centerSubject: center } : {}),
    items: projectLiveLensItems(orchestration, layer, center),
    status,
  });
}

export const resolveExecutiveLiveLensIntegration =
  resolveExecutiveLiveLensContext;

// ─── Interaction normalization ──────────────────────────────────────────────

export function createExecutiveTimelineInteractionIntent(input: {
  readonly kind: ExecutiveTimelineInteractionKind;
  readonly entryId?: string;
  readonly packId?: string;
  readonly subjectId?: string;
  readonly scope?: ExecutiveTimelineScope;
  readonly timestamp?: string;
}): ExecutiveTimelineInteractionIntent {
  if (!isExecutiveTimelineInteractionKind(input.kind)) {
    throw new TypeError("kind must be a known timeline interaction kind");
  }
  return Object.freeze({
    source: "timeline" as const,
    kind: input.kind,
    ...(input.entryId !== undefined ? { entryId: input.entryId } : {}),
    ...(input.packId !== undefined ? { packId: input.packId } : {}),
    ...(input.subjectId !== undefined ? { subjectId: input.subjectId } : {}),
    ...(input.scope !== undefined ? { scope: input.scope } : {}),
    ...(input.timestamp !== undefined ? { timestamp: input.timestamp } : {}),
  });
}

export function createExecutiveExplorerInteractionIntent(input: {
  readonly kind: ExecutiveExplorerInteractionKind;
  readonly itemId?: string;
  readonly subjectId?: string;
  readonly mode?: ExecutiveExplorerMode;
}): ExecutiveExplorerInteractionIntent {
  if (!isExecutiveExplorerInteractionKind(input.kind)) {
    throw new TypeError("kind must be a known explorer interaction kind");
  }
  return Object.freeze({
    source: "explorer" as const,
    kind: input.kind,
    ...(input.itemId !== undefined ? { itemId: input.itemId } : {}),
    ...(input.subjectId !== undefined ? { subjectId: input.subjectId } : {}),
    ...(input.mode !== undefined ? { mode: input.mode } : {}),
  });
}

export function createExecutiveLiveLensInteractionIntent(input: {
  readonly kind: ExecutiveLiveLensInteractionKind;
  readonly itemId?: string;
  readonly subjectId?: string;
  readonly layer?: ExecutiveLiveLensLayer;
}): ExecutiveLiveLensInteractionIntent {
  if (!isExecutiveLiveLensInteractionKind(input.kind)) {
    throw new TypeError("kind must be a known live-lens interaction kind");
  }
  return Object.freeze({
    source: "live-lens" as const,
    kind: input.kind,
    ...(input.itemId !== undefined ? { itemId: input.itemId } : {}),
    ...(input.subjectId !== undefined ? { subjectId: input.subjectId } : {}),
    ...(input.layer !== undefined ? { layer: input.layer } : {}),
  });
}

export function normalizeExecutiveTimelineInteraction(
  intent: ExecutiveTimelineInteractionIntent,
  timeline?: ExecutiveTimelineContext,
): ExecutiveCockpitInteractionIntent {
  switch (intent.kind) {
    case "select-entry": {
      const entry = timeline?.entries.find(
        (candidate) => candidate.id === intent.entryId,
      );
      const subjectId =
        intent.subjectId ?? entry?.subject?.id ?? entry?.pack?.id;
      if (subjectId !== undefined) {
        return createExecutiveCockpitInteractionIntent({
          source: "timeline",
          kind: "select",
          subjectId,
          targetSurface: "timeline",
          metadata: Object.freeze({
            timelineAction: "select-entry",
            entryId: intent.entryId,
          }),
        });
      }
      return createExecutiveCockpitInteractionIntent({
        source: "timeline",
        kind: "activate",
        targetSurface: "timeline",
        metadata: Object.freeze({
          timelineAction: "select-entry",
          entryId: intent.entryId,
        }),
      });
    }
    case "select-pack": {
      const subjectId = intent.subjectId ?? intent.packId;
      return createExecutiveCockpitInteractionIntent({
        source: "timeline",
        kind: subjectId !== undefined ? "select" : "open",
        ...(subjectId !== undefined ? { subjectId } : {}),
        targetSurface: "timeline",
        metadata: Object.freeze({
          timelineAction: "select-pack",
          packId: intent.packId,
        }),
      });
    }
    case "change-scope":
      return createExecutiveCockpitInteractionIntent({
        source: "timeline",
        kind: "activate",
        targetSurface: "timeline",
        metadata: Object.freeze({
          timelineAction: "change-scope",
          scope: intent.scope,
        }),
      });
    case "replay":
      return createExecutiveCockpitInteractionIntent({
        source: "timeline",
        kind: "navigate",
        targetSurface: "timeline",
        ...(intent.subjectId !== undefined
          ? { subjectId: intent.subjectId }
          : {}),
        metadata: Object.freeze({
          timelineAction: "replay",
          replayBoundary: EXECUTIVE_TIMELINE_REPLAY_BOUNDARY,
          timestamp: intent.timestamp,
        }),
      });
    case "seek":
      return createExecutiveCockpitInteractionIntent({
        source: "timeline",
        kind: "navigate",
        targetSurface: "timeline",
        metadata: Object.freeze({
          timelineAction: "seek",
          timestamp: intent.timestamp,
        }),
      });
    default:
      return createExecutiveCockpitInteractionIntent({
        source: "timeline",
        kind: "activate",
        targetSurface: "timeline",
      });
  }
}

export function normalizeExecutiveExplorerInteraction(
  intent: ExecutiveExplorerInteractionIntent,
  explorer?: ExecutiveExplorerContext,
): ExecutiveCockpitInteractionIntent {
  const item = explorer?.items.find(
    (candidate) => candidate.id === intent.itemId,
  );
  const subjectId = intent.subjectId ?? item?.subject?.id ?? item?.pack?.id;

  switch (intent.kind) {
    case "select-item":
      return createExecutiveCockpitInteractionIntent({
        source: "explorer",
        kind: "select",
        ...(subjectId !== undefined ? { subjectId } : {}),
        targetSurface: "explorer",
        metadata: Object.freeze({
          explorerAction: "select-item",
          itemId: intent.itemId,
        }),
      });
    case "focus-item":
      return createExecutiveCockpitInteractionIntent({
        source: "explorer",
        kind: "focus",
        ...(subjectId !== undefined ? { subjectId } : {}),
        targetSurface: "explorer",
        metadata: Object.freeze({
          explorerAction: "focus-item",
          itemId: intent.itemId,
        }),
      });
    case "open-item":
      return createExecutiveCockpitInteractionIntent({
        source: "explorer",
        kind: "open",
        ...(subjectId !== undefined ? { subjectId } : {}),
        targetSurface: "explorer",
        metadata: Object.freeze({
          explorerAction: "open-item",
          itemId: intent.itemId,
        }),
      });
    case "change-mode":
      return createExecutiveCockpitInteractionIntent({
        source: "explorer",
        kind: "activate",
        targetSurface: "explorer",
        metadata: Object.freeze({
          explorerAction: "change-mode",
          mode: intent.mode,
        }),
      });
    case "dismiss":
      return createExecutiveCockpitInteractionIntent({
        source: "explorer",
        kind: "dismiss",
        targetSurface: "explorer",
      });
    default:
      return createExecutiveCockpitInteractionIntent({
        source: "explorer",
        kind: "activate",
        targetSurface: "explorer",
      });
  }
}

export function normalizeExecutiveLiveLensInteraction(
  intent: ExecutiveLiveLensInteractionIntent,
  liveLens?: ExecutiveLiveLensContext,
): ExecutiveCockpitInteractionIntent {
  const item = liveLens?.items.find(
    (candidate) =>
      candidate.id === intent.itemId ||
      candidate.subject.id === intent.subjectId,
  );
  const subjectId = intent.subjectId ?? item?.subject.id;

  switch (intent.kind) {
    case "select-item":
      return createExecutiveCockpitInteractionIntent({
        source: "live-lens",
        kind: "select",
        ...(subjectId !== undefined ? { subjectId } : {}),
        targetSurface: "live-lens",
        metadata: Object.freeze({
          liveLensAction: "select-item",
          itemId: intent.itemId,
        }),
      });
    case "focus-item":
      return createExecutiveCockpitInteractionIntent({
        source: "live-lens",
        kind: "focus",
        ...(subjectId !== undefined ? { subjectId } : {}),
        targetSurface: "live-lens",
        metadata: Object.freeze({
          liveLensAction: "focus-item",
          itemId: intent.itemId,
        }),
      });
    case "open-item":
      return createExecutiveCockpitInteractionIntent({
        source: "live-lens",
        kind: "open",
        ...(subjectId !== undefined ? { subjectId } : {}),
        targetSurface: "live-lens",
        metadata: Object.freeze({
          liveLensAction: "open-item",
          itemId: intent.itemId,
          layer: liveLens?.layer,
        }),
      });
    case "change-layer":
      return createExecutiveCockpitInteractionIntent({
        source: "live-lens",
        kind: "activate",
        targetSurface: "live-lens",
        metadata: Object.freeze({
          liveLensAction: "change-layer",
          layer: intent.layer,
        }),
      });
    case "back":
      return createExecutiveCockpitInteractionIntent({
        source: "live-lens",
        kind: "activate",
        targetSurface: "live-lens",
        metadata: Object.freeze({
          liveLensAction: "back",
          fromLayer: liveLens?.layer,
        }),
      });
    case "reset":
      return createExecutiveCockpitInteractionIntent({
        source: "live-lens",
        kind: "activate",
        targetSurface: "live-lens",
        metadata: Object.freeze({
          liveLensAction: "reset",
        }),
      });
    default:
      return createExecutiveCockpitInteractionIntent({
        source: "live-lens",
        kind: "activate",
        targetSurface: "live-lens",
      });
  }
}

/** Resolve local Live Lens layer after back/reset/open without mutating Cockpit. */
export function resolveExecutiveLiveLensLayerNavigation(
  current: ExecutiveLiveLensLayer,
  action: "back" | "reset" | "open",
): ExecutiveLiveLensLayer {
  if (action === "reset") {
    return "goal";
  }
  if (action === "back") {
    if (current === "pack") {
      return "object";
    }
    if (current === "object") {
      return "goal";
    }
    return "goal";
  }
  // open drills down
  if (current === "goal") {
    return "object";
  }
  if (current === "object") {
    return "pack";
  }
  return "pack";
}

// ─── Reactions ──────────────────────────────────────────────────────────────

function makeReaction(
  kind: ExecutiveContextualSurfaceReactionKind,
  surface: ExecutiveContextualSurface,
  priority: ExecutiveCockpitInteractionPriority,
  subjectId?: string,
): ExecutiveContextualSurfaceReaction {
  return Object.freeze({
    kind,
    surface,
    priority,
    ...(subjectId !== undefined ? { subjectId } : {}),
  });
}

function compareReactions(
  a: ExecutiveContextualSurfaceReaction,
  b: ExecutiveContextualSurfaceReaction,
): number {
  const orderDiff = REACTION_ORDER[a.kind] - REACTION_ORDER[b.kind];
  if (orderDiff !== 0) {
    return orderDiff;
  }
  const priorityDiff =
    PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  if (priorityDiff !== 0) {
    return priorityDiff;
  }
  if (a.surface !== b.surface) {
    return a.surface < b.surface ? -1 : 1;
  }
  return compareIds(a.subjectId ?? "", b.subjectId ?? "");
}

export function resolveExecutiveContextualSurfaceReactions(
  previous: ExecutiveContextualSurfacesSnapshot | undefined,
  next: {
    readonly timeline: ExecutiveTimelineContext;
    readonly explorer: ExecutiveExplorerContext;
    readonly liveLens: ExecutiveLiveLensContext;
  },
): readonly ExecutiveContextualSurfaceReaction[] {
  const reactions: ExecutiveContextualSurfaceReaction[] = [];

  if (previous === undefined) {
    return Object.freeze(
      [
        makeReaction("timeline-context-update", "timeline", "normal"),
        makeReaction("explorer-context-update", "explorer", "normal"),
        makeReaction("live-lens-context-update", "live-lens", "normal"),
      ].sort(compareReactions),
    );
  }

  const prevTimeline = previous.timeline;
  const prevExplorer = previous.explorer;
  const prevLiveLens = previous.liveLens;

  if (
    (prevTimeline.workspace?.id ?? "") !== (next.timeline.workspace?.id ?? "") ||
    (prevTimeline.focusedSubject?.id ?? "") !==
      (next.timeline.focusedSubject?.id ?? "") ||
    (prevTimeline.selectedSubject?.id ?? "") !==
      (next.timeline.selectedSubject?.id ?? "") ||
    prevTimeline.entries.length !== next.timeline.entries.length
  ) {
    reactions.push(
      makeReaction(
        "timeline-context-update",
        "timeline",
        "normal",
        next.timeline.focusedSubject?.id ?? next.timeline.selectedSubject?.id,
      ),
    );
  }
  if (prevTimeline.scope !== next.timeline.scope) {
    reactions.push(
      makeReaction("timeline-scope-change", "timeline", "normal"),
    );
  }

  if (
    (prevExplorer.workspace?.id ?? "") !== (next.explorer.workspace?.id ?? "") ||
    (prevExplorer.focusedSubject?.id ?? "") !==
      (next.explorer.focusedSubject?.id ?? "") ||
    (prevExplorer.selectedSubject?.id ?? "") !==
      (next.explorer.selectedSubject?.id ?? "") ||
    prevExplorer.items.length !== next.explorer.items.length
  ) {
    reactions.push(
      makeReaction(
        "explorer-context-update",
        "explorer",
        "normal",
        next.explorer.focusedSubject?.id ?? next.explorer.selectedSubject?.id,
      ),
    );
  }
  if (prevExplorer.mode !== next.explorer.mode) {
    reactions.push(
      makeReaction("explorer-mode-change", "explorer", "normal"),
    );
  }

  if (
    (prevLiveLens.workspace?.id ?? "") !== (next.liveLens.workspace?.id ?? "") ||
    (prevLiveLens.focusedSubject?.id ?? "") !==
      (next.liveLens.focusedSubject?.id ?? "") ||
    (prevLiveLens.selectedSubject?.id ?? "") !==
      (next.liveLens.selectedSubject?.id ?? "") ||
    prevLiveLens.items.length !== next.liveLens.items.length
  ) {
    reactions.push(
      makeReaction(
        "live-lens-context-update",
        "live-lens",
        "high",
        next.liveLens.centerSubject?.id,
      ),
    );
  }
  if (prevLiveLens.layer !== next.liveLens.layer) {
    reactions.push(
      makeReaction("live-lens-layer-change", "live-lens", "high"),
    );
  }
  if (
    (prevLiveLens.centerSubject?.id ?? "") !==
    (next.liveLens.centerSubject?.id ?? "")
  ) {
    reactions.push(
      makeReaction(
        "live-lens-center-change",
        "live-lens",
        "high",
        next.liveLens.centerSubject?.id,
      ),
    );
  }

  return Object.freeze(reactions.sort(compareReactions));
}

// ─── Main resolver ──────────────────────────────────────────────────────────

export function resolveExecutiveContextualSurfacesIntegration(
  input: ExecutiveContextualSurfacesIntegrationInput,
): ExecutiveContextualSurfacesSnapshot {
  const { orchestration } = input;

  const timelineState: ExecutiveTimelineState = {
    scope: isExecutiveTimelineScope(input.timelineState?.scope)
      ? input.timelineState?.scope
      : input.previous?.timeline.scope,
    entries: input.timelineState?.entries,
    selectedEntryId: input.timelineState?.selectedEntryId,
  };

  const explorerState: ExecutiveExplorerState = {
    mode: isExecutiveExplorerMode(input.explorerState?.mode)
      ? input.explorerState?.mode
      : input.previous?.explorer.mode,
    items: input.explorerState?.items,
  };

  let liveLensState: ExecutiveLiveLensState = {
    layer: isExecutiveLiveLensLayer(input.liveLensState?.layer)
      ? input.liveLensState?.layer
      : input.previous?.liveLens.layer,
    explicitCenterId: input.liveLensState?.explicitCenterId,
  };

  // Workspace compatibility: clear invalid previous center.
  const previousCenter = input.previous?.liveLens.centerSubject;
  if (
    previousCenter !== undefined &&
    !subjectExistsInStage(orchestration, previousCenter.id) &&
    input.liveLensState?.explicitCenterId === undefined
  ) {
    liveLensState = Object.freeze({
      layer: "goal",
      explicitCenterId: undefined,
    });
  }

  const timeline = resolveExecutiveTimelineContext(
    orchestration,
    timelineState,
  );
  const explorer = resolveExecutiveExplorerContext(
    orchestration,
    explorerState,
  );
  const liveLens = resolveExecutiveLiveLensContext(
    orchestration,
    liveLensState,
  );

  const reactions = resolveExecutiveContextualSurfaceReactions(input.previous, {
    timeline,
    explorer,
    liveLens,
  });

  return Object.freeze({
    orchestration,
    timeline,
    explorer,
    liveLens,
    reactions,
    integrationIdentity: timelineExplorerLiveLensIntegrationIdentity,
    integrationVersion: timelineExplorerLiveLensIntegrationVersion,
  });
}

// ─── Validation ─────────────────────────────────────────────────────────────

export interface ExecutiveContextualSurfacesIntegrationValidation {
  readonly ok: boolean;
  readonly identity: typeof timelineExplorerLiveLensIntegrationIdentity;
  readonly version: typeof timelineExplorerLiveLensIntegrationVersion;
  readonly namespace: typeof timelineExplorerLiveLensIntegrationNamespace;
  readonly phase: typeof timelineExplorerLiveLensIntegrationPhase;
  readonly architecturalRole: typeof timelineExplorerLiveLensIntegrationArchitecturalRole;
  readonly dependencyIdentity: typeof timelineExplorerLiveLensIntegrationDependencyIdentity;
  readonly contextualSurfaceCount: number;
  readonly timelineScopeCount: number;
  readonly explorerModeCount: number;
  readonly liveLensLayerCount: number;
  readonly reactionKindCount: number;
  readonly guaranteeCount: number;
  readonly invariantCount: number;
  readonly orchestrationOk: boolean;
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

export function validateExecutiveContextualSurfacesIntegration(
  snapshot?: ExecutiveContextualSurfacesSnapshot,
): ExecutiveContextualSurfacesIntegrationValidation {
  const orchestration = verifyCockpitInteractionOrchestration();

  const identityOk =
    timelineExplorerLiveLensIntegrationIdentity ===
      "NEX-CI:7/TimelineExplorerLiveLensIntegration" &&
    timelineExplorerLiveLensIntegrationVersion === "1.7.0" &&
    timelineExplorerLiveLensIntegrationNamespace ===
      "nexora.executive.cockpit.integration.contextual-surfaces" &&
    timelineExplorerLiveLensIntegrationPhase ===
      "TimelineExplorerLiveLensIntegration" &&
    timelineExplorerLiveLensIntegrationArchitecturalRole ===
      "TimelineExplorerLiveLensIntegration" &&
    timelineExplorerLiveLensIntegrationDependencyIdentity ===
      "NEX-CI:6/CockpitInteractionOrchestration" &&
    timelineExplorerLiveLensIntegrationDependencyIdentity ===
      cockpitInteractionOrchestrationIdentity &&
    TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_BOUNDARY.consumesNexCi6Only ===
      true &&
    TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_BOUNDARY.implementsNexCi8 ===
      false;

  const vocabularyOk =
    exactOrder(EXECUTIVE_CONTEXTUAL_SURFACES, [
      "timeline",
      "explorer",
      "live-lens",
    ]) &&
    exactOrder(EXECUTIVE_TIMELINE_SCOPES, ["day", "week", "month", "year"]) &&
    exactOrder(EXECUTIVE_EXPLORER_MODES, [
      "objects",
      "data",
      "journal",
      "packs",
      "related",
    ]) &&
    exactOrder(EXECUTIVE_LIVE_LENS_LAYERS, ["goal", "object", "pack"]) &&
    unique([...EXECUTIVE_CONTEXTUAL_SURFACE_REACTION_KINDS]) &&
    unique([...EXECUTIVE_PACK_KINDS]);

  let snapshotOk = true;
  if (snapshot !== undefined) {
    const centerCount = snapshot.liveLens.items.filter(
      (item) => item.role === "center",
    ).length;
    snapshotOk =
      Object.isFrozen(snapshot) &&
      Object.isFrozen(snapshot.timeline) &&
      Object.isFrozen(snapshot.explorer) &&
      Object.isFrozen(snapshot.liveLens) &&
      Object.isFrozen(snapshot.reactions) &&
      isExecutiveTimelineScope(snapshot.timeline.scope) &&
      isExecutiveExplorerMode(snapshot.explorer.mode) &&
      isExecutiveLiveLensLayer(snapshot.liveLens.layer) &&
      centerCount <= 1 &&
      (snapshot.liveLens.centerSubject === undefined ||
        snapshot.liveLens.items.filter((item) => item.role === "center")
          .length <= 1) &&
      unique(snapshot.timeline.entries.map((entry) => entry.id)) &&
      unique(snapshot.explorer.items.map((item) => item.id)) &&
      unique(snapshot.liveLens.items.map((item) => item.id)) &&
      snapshot.integrationIdentity ===
        timelineExplorerLiveLensIntegrationIdentity &&
      // current/target distinction preserved on orchestration
      (snapshot.orchestration.targetWorkspace === undefined ||
        snapshot.orchestration.currentWorkspace === undefined ||
        snapshot.orchestration.targetWorkspace.id !==
          snapshot.orchestration.currentWorkspace.id ||
        snapshot.orchestration.advisorInsight.experience.transition?.status ===
          "completed");
  }

  const guaranteesOk =
    TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_GUARANTEES.length === 26 &&
    exactOrder(
      TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_GUARANTEES.map(
        (entry) => entry.id,
      ),
      [
        "nex-ci-6-sole-immediate-dependency",
        "contextual-surfaces-remain-separate",
        "one-canonical-cockpit-state",
        "no-direct-cross-surface-mutation",
        "timeline-no-global-selection-focus",
        "explorer-no-global-selection-focus",
        "live-lens-no-global-selection-focus",
        "focus-selection-remain-distinct",
        "workspace-current-target-preserved",
        "presentation-reuses-canonical",
        "timeline-scope-ordering-canonical",
        "explorer-modes-canonical",
        "live-lens-layers-canonical",
        "at-most-one-live-lens-center",
        "no-fabricated-timeline-entries",
        "no-fabricated-explorer-items",
        "no-fabricated-live-lens-relationships",
        "context-items-deterministically-ordered",
        "duplicates-handled-deterministically",
        "empty-context-valid",
        "inputs-not-mutated",
        "no-react-dependency",
        "no-threejs-r3f-dependency",
        "no-ai-dependency",
        "no-persistence",
        "no-nex-ci-8-certification",
      ],
    );

  const immutabilityOk =
    Object.isFrozen(timelineExplorerLiveLensIntegrationCanonicalIdentity) &&
    Object.isFrozen(EXECUTIVE_CONTEXTUAL_SURFACES) &&
    Object.isFrozen(EXECUTIVE_TIMELINE_SCOPES) &&
    Object.isFrozen(EXECUTIVE_EXPLORER_MODES) &&
    Object.isFrozen(EXECUTIVE_LIVE_LENS_LAYERS) &&
    Object.isFrozen(EXECUTIVE_CONTEXTUAL_SURFACE_REACTION_KINDS) &&
    Object.isFrozen(TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_GUARANTEES) &&
    Object.isFrozen(TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_BOUNDARY) &&
    Object.isFrozen(timelineExplorerLiveLensIntegration);

  const frameworkIndependent =
    TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_BOUNDARY.frameworkIndependent ===
      true &&
    TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_BOUNDARY.introducesReact ===
      false &&
    TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_BOUNDARY.introducesThreeJs ===
      false &&
    TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_BOUNDARY
      .introducesReactThreeFiber === false &&
    TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_BOUNDARY.implementsNexCi8 === false;

  const intelligenceIndependent =
    TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_BOUNDARY
      .intelligenceProviderIndependent === true &&
    TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_BOUNDARY.ownsAiExecution ===
      false &&
    TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_BOUNDARY.introducesAiSdk === false;

  const ok =
    identityOk &&
    vocabularyOk &&
    snapshotOk &&
    guaranteesOk &&
    immutabilityOk &&
    frameworkIndependent &&
    intelligenceIndependent &&
    orchestration.ok === true;

  return Object.freeze({
    ok,
    identity: timelineExplorerLiveLensIntegrationIdentity,
    version: timelineExplorerLiveLensIntegrationVersion,
    namespace: timelineExplorerLiveLensIntegrationNamespace,
    phase: timelineExplorerLiveLensIntegrationPhase,
    architecturalRole: timelineExplorerLiveLensIntegrationArchitecturalRole,
    dependencyIdentity: timelineExplorerLiveLensIntegrationDependencyIdentity,
    contextualSurfaceCount: EXECUTIVE_CONTEXTUAL_SURFACES.length,
    timelineScopeCount: EXECUTIVE_TIMELINE_SCOPES.length,
    explorerModeCount: EXECUTIVE_EXPLORER_MODES.length,
    liveLensLayerCount: EXECUTIVE_LIVE_LENS_LAYERS.length,
    reactionKindCount: EXECUTIVE_CONTEXTUAL_SURFACE_REACTION_KINDS.length,
    guaranteeCount: TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_GUARANTEES.length,
    invariantCount: TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_GUARANTEES.length,
    orchestrationOk: orchestration.ok,
    frozen: immutabilityOk,
    frameworkIndependent,
    intelligenceIndependent,
  });
}

export function verifyTimelineExplorerLiveLensIntegration():
  ExecutiveContextualSurfacesIntegrationValidation {
  return validateExecutiveContextualSurfacesIntegration();
}

// ─── Public catalogs / module bag ───────────────────────────────────────────

export const timelineExplorerLiveLensIntegrationApiNames = Object.freeze([
  "getTimelineExplorerLiveLensIntegrationIdentity",
  "getExecutiveContextualSurfaces",
  "isExecutiveContextualSurface",
  "getExecutiveTimelineScopes",
  "isExecutiveTimelineScope",
  "getExecutiveExplorerModes",
  "isExecutiveExplorerMode",
  "getExecutiveLiveLensLayers",
  "isExecutiveLiveLensLayer",
  "getExecutiveContextualSurfaceReactionKinds",
  "isExecutiveContextualSurfaceReactionKind",
  "getExecutivePackKinds",
  "isExecutivePackKind",
  "resolveExecutiveContextualSurfaceState",
  "resolveExecutiveTimelineContext",
  "resolveExecutiveTimelineIntegration",
  "resolveExecutiveExplorerContext",
  "resolveExecutiveExplorerIntegration",
  "resolveExecutiveLiveLensContext",
  "resolveExecutiveLiveLensIntegration",
  "resolveExecutiveLiveLensCenter",
  "resolveExecutiveLiveLensLayer",
  "resolveExecutiveLiveLensLayerNavigation",
  "createExecutiveTimelineInteractionIntent",
  "createExecutiveExplorerInteractionIntent",
  "createExecutiveLiveLensInteractionIntent",
  "normalizeExecutiveTimelineInteraction",
  "normalizeExecutiveExplorerInteraction",
  "normalizeExecutiveLiveLensInteraction",
  "resolveExecutiveContextualSurfaceReactions",
  "resolveExecutiveContextualSurfacesIntegration",
  "validateExecutiveContextualSurfacesIntegration",
  "verifyTimelineExplorerLiveLensIntegration",
] as const);

export const TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "ExecutiveContextualSurface",
    "ExecutiveContextualSurfaceState",
    "ExecutivePackKind",
    "ExecutivePackReference",
    "ExecutiveTimelineScope",
    "ExecutiveTimelineImportance",
    "ExecutiveTimelineEntry",
    "ExecutiveTimelineContext",
    "ExecutiveTimelineInteractionKind",
    "ExecutiveTimelineInteractionIntent",
    "ExecutiveTimelineState",
    "ExecutiveExplorerMode",
    "ExecutiveExplorerItemKind",
    "ExecutiveExplorerItem",
    "ExecutiveExplorerContext",
    "ExecutiveExplorerInteractionKind",
    "ExecutiveExplorerInteractionIntent",
    "ExecutiveExplorerState",
    "ExecutiveLiveLensLayer",
    "ExecutiveLiveLensItemRole",
    "ExecutiveLiveLensItem",
    "ExecutiveLiveLensContext",
    "ExecutiveLiveLensInteractionKind",
    "ExecutiveLiveLensInteractionIntent",
    "ExecutiveLiveLensState",
    "ExecutiveContextualSurfaceReactionKind",
    "ExecutiveContextualSurfaceReaction",
    "ExecutiveContextualSurfacesSnapshot",
    "ExecutiveContextualSurfacesIntegrationInput",
    "ExecutiveContextualSurfacesIntegrationValidation",
  ] as const);

export const timelineExplorerLiveLensIntegration = Object.freeze({
  phase: "TimelineExplorerLiveLensIntegration" as const,
  name: "TimelineExplorerLiveLensIntegration" as const,
  identity: timelineExplorerLiveLensIntegrationIdentity,
  version: timelineExplorerLiveLensIntegrationVersion,
  namespace: timelineExplorerLiveLensIntegrationNamespace,
  layer: timelineExplorerLiveLensIntegrationLayer,
  stage: timelineExplorerLiveLensIntegrationStage,
  architecturalRole: timelineExplorerLiveLensIntegrationArchitecturalRole,
  role: "TimelineExplorerLiveLensIntegration" as const,
  status: timelineExplorerLiveLensIntegrationStability,
  upstreamDependency: timelineExplorerLiveLensIntegrationDependencyIdentity,
  dependencyPath: timelineExplorerLiveLensIntegrationDependencyPath,
  deterministic: timelineExplorerLiveLensIntegrationDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  intelligenceProviderIndependent: true as const,
  browserIndependent: true as const,
  principle: EXECUTIVE_CONTEXTUAL_SURFACES_PRINCIPLE,
  boundary: TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_BOUNDARY,
  contextualSurfaces: EXECUTIVE_CONTEXTUAL_SURFACES,
  timelineScopes: EXECUTIVE_TIMELINE_SCOPES,
  explorerModes: EXECUTIVE_EXPLORER_MODES,
  liveLensLayers: EXECUTIVE_LIVE_LENS_LAYERS,
  packKinds: EXECUTIVE_PACK_KINDS,
  reactionKinds: EXECUTIVE_CONTEXTUAL_SURFACE_REACTION_KINDS,
  timelineReplayBoundary: EXECUTIVE_TIMELINE_REPLAY_BOUNDARY,
  liveLensCenterPriority: EXECUTIVE_LIVE_LENS_CENTER_PRIORITY,
  liveLensLayerNavigationPolicy: EXECUTIVE_LIVE_LENS_LAYER_NAVIGATION_POLICY,
  compatibilityPolicy: EXECUTIVE_CONTEXTUAL_COMPATIBILITY_POLICY,
  guarantees: TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_GUARANTEES,
  forbiddenResponsibilities:
    TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_FORBIDDEN_RESPONSIBILITIES,
  publicApiSurface: timelineExplorerLiveLensIntegrationApiNames,
  publicTypes: TIMELINE_EXPLORER_LIVE_LENS_INTEGRATION_PUBLIC_TYPE_NAMES,
  nexCi6Boundary: "NEX-CI:6-cockpit-interaction-orchestration-only" as const,
  architecturalStatus:
    "Timeline / Explorer / Live Lens Integration Complete · Deterministic · Immutable · Contextual · ReadyForExecutiveCockpitCertification" as const,
});

/**
 * Approved NEX-CI:6 / chain consumer surfaces re-exported for NEX-CI:8
 * certification/freeze so NEX-CI:8 can preserve the sole-dependency chain.
 */
export {
  EXECUTIVE_COCKPIT_SURFACES,
  advisorInsightIntegrationIdentity,
  advisorInsightIntegrationVersion,
  cockpitInteractionOrchestrationIdentity,
  cockpitInteractionOrchestrationVersion,
  cockpitShellRuntimeBindingIdentity,
  cockpitShellRuntimeBindingVersion,
  createExecutiveCockpitIntegrationSnapshot,
  createExecutiveCockpitInteractionIntent,
  createExecutiveCockpitOrchestrationSnapshot,
  createExecutiveStageInteractionIntent,
  createExecutiveWorkspaceReference,
  createExecutiveWorkspaceSelectionIntent,
  executiveCockpitIntegrationFoundationIdentity,
  executiveCockpitIntegrationFoundationVersion,
  executiveStageIntegrationIdentity,
  executiveStageIntegrationVersion,
  isExecutiveCockpitPresentationState,
  isExecutiveCockpitSurface,
  orchestrateExecutiveCockpitInteraction,
  resolveCockpitShellRuntimeBinding,
  resolveExecutiveAdvisorInsightIntegration,
  resolveExecutiveStageScene,
  resolveExecutiveWorkspaceExperience,
  verifyAdvisorInsightIntegration,
  verifyCockpitInteractionOrchestration,
  verifyCockpitShellRuntimeBinding,
  verifyExecutiveCockpitIntegrationFoundation,
  verifyExecutiveStageIntegration,
  verifyWorkspaceDialExperienceSwitching,
  workspaceDialExperienceSwitchingIdentity,
  workspaceDialExperienceSwitchingVersion,
} from "@/app/lib/nex-ci/cockpitInteractionOrchestration";

export type {
  ExecutiveCockpitInteractionIntent,
  ExecutiveCockpitOrchestrationSnapshot,
  ExecutiveCockpitPresentationState,
  ExecutiveCockpitSubjectReference,
  ExecutiveCockpitSurface,
  ExecutiveWorkspaceReference,
} from "@/app/lib/nex-ci/cockpitInteractionOrchestration";

/** Canonical NEX-CI:1–7 identity chain for certification consumers. */
export const NEX_CI_INTEGRATION_IDENTITY_CHAIN = Object.freeze([
  Object.freeze({
    order: 1 as const,
    identity: executiveCockpitIntegrationFoundationIdentity,
    version: executiveCockpitIntegrationFoundationVersion,
    dependencyIdentity:
      "REX-1:9/RuntimeEnabledExecutiveExperiencePublicIndex" as const,
  }),
  Object.freeze({
    order: 2 as const,
    identity: cockpitShellRuntimeBindingIdentity,
    version: cockpitShellRuntimeBindingVersion,
    dependencyIdentity: executiveCockpitIntegrationFoundationIdentity,
  }),
  Object.freeze({
    order: 3 as const,
    identity: executiveStageIntegrationIdentity,
    version: executiveStageIntegrationVersion,
    dependencyIdentity: cockpitShellRuntimeBindingIdentity,
  }),
  Object.freeze({
    order: 4 as const,
    identity: workspaceDialExperienceSwitchingIdentity,
    version: workspaceDialExperienceSwitchingVersion,
    dependencyIdentity: executiveStageIntegrationIdentity,
  }),
  Object.freeze({
    order: 5 as const,
    identity: advisorInsightIntegrationIdentity,
    version: advisorInsightIntegrationVersion,
    dependencyIdentity: workspaceDialExperienceSwitchingIdentity,
  }),
  Object.freeze({
    order: 6 as const,
    identity: cockpitInteractionOrchestrationIdentity,
    version: cockpitInteractionOrchestrationVersion,
    dependencyIdentity: advisorInsightIntegrationIdentity,
  }),
  Object.freeze({
    order: 7 as const,
    identity: timelineExplorerLiveLensIntegrationIdentity,
    version: timelineExplorerLiveLensIntegrationVersion,
    dependencyIdentity: cockpitInteractionOrchestrationIdentity,
  }),
]);
