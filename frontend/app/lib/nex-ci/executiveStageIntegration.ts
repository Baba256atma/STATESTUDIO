/**
 * NEX-CI:3 — Executive Stage Integration.
 *
 * Connects the Executive Stage to canonical NEX-CI runtime state so the Stage
 * becomes a deterministic, runtime-driven executive scene.
 *
 * Canonical flow:
 *   REX → NEX-CI:1 → NEX-CI:2 → NEX-CI:3 → future Stage renderer/adapter
 *
 * Separates:
 *   Runtime Meaning (upstream)
 *   Stage Scene Model (this phase)
 *   Rendering (future adapter — Three.js / R3F)
 *
 * Sole immediate NEX-CI dependency: NEX-CI:2 Cockpit Shell Runtime Binding.
 * Framework-independent pure TypeScript — no React, Three.js, camera mutation,
 * Workspace Dial, or NEX-CI:4 responsibilities.
 */

import {
  cockpitShellRuntimeBindingIdentity,
  isExecutiveCockpitIntegrationStatus,
  isExecutiveCockpitPresentationState,
  isExecutiveCockpitSubjectKind,
  resolveCockpitSurfaceRuntimeContext,
  type CockpitShellRuntimeSnapshot,
  type ExecutiveCockpitIntegrationStatus,
  type ExecutiveCockpitPresentationState,
  type ExecutiveCockpitSubjectKind,
  type ExecutiveCockpitSubjectReference,
  verifyCockpitShellRuntimeBinding,
} from "@/app/lib/nex-ci/cockpitShellRuntimeBinding";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStageIntegrationIdentity =
  "NEX-CI:3/ExecutiveStageIntegration" as const;

export const executiveStageIntegrationVersion = "1.3.0" as const;

export const executiveStageIntegrationNamespace =
  "nexora.executive.cockpit.integration.stage" as const;

export const executiveStageIntegrationLayer = "NEX-CI" as const;

export const executiveStageIntegrationPhase =
  "ExecutiveStageIntegration" as const;

export const executiveStageIntegrationStage =
  "ExecutiveStageIntegration" as const;

export const executiveStageIntegrationArchitecturalRole =
  "ExecutiveStageIntegration" as const;

export const executiveStageIntegrationDependencyIdentity =
  cockpitShellRuntimeBindingIdentity;

export const executiveStageIntegrationDependencyPath =
  "@/app/lib/nex-ci/cockpitShellRuntimeBinding" as const;

export const executiveStageIntegrationStability =
  "ExecutiveStageIntegrationReady" as const;

export const executiveStageIntegrationDeterministic = true as const;

export const executiveStageIntegrationSideEffectPolicy =
  "side-effect-free" as const;

export const executiveStageIntegrationMutationPolicy = "immutable" as const;

export const executiveStageIntegrationCanonicalIdentity = Object.freeze({
  identity: executiveStageIntegrationIdentity,
  version: executiveStageIntegrationVersion,
  namespace: executiveStageIntegrationNamespace,
  layer: executiveStageIntegrationLayer,
  phase: executiveStageIntegrationPhase,
  stage: executiveStageIntegrationStage,
  architecturalRole: executiveStageIntegrationArchitecturalRole,
  dependencyIdentity: executiveStageIntegrationDependencyIdentity,
  dependencyPath: executiveStageIntegrationDependencyPath,
  stabilityStatus: executiveStageIntegrationStability,
  deterministicStatus: executiveStageIntegrationDeterministic,
  sideEffectPolicy: executiveStageIntegrationSideEffectPolicy,
  mutationPolicy: executiveStageIntegrationMutationPolicy,
});

export const EXECUTIVE_STAGE_INTEGRATION_PRINCIPLE =
  "CockpitShellRuntimeSnapshot → ExecutiveStageIntegration → ExecutiveStageSceneSnapshot → future renderer. Runtime determines meaning; Stage integration determines renderer-neutral scene instructions; the renderer determines pixels." as const;

export const EXECUTIVE_STAGE_INTEGRATION_BOUNDARY = Object.freeze({
  nexCiAuthority: "Executive-Cockpit-Integration" as const,
  stageAuthority: "Executive-Stage-Scene-Model" as const,
  rendererAuthority: "Stage-Renderer-Adapter" as const,
  boundaryAuthority: "NEX-CI:3" as const,
  architecturalRole: "ExecutiveStageIntegration" as const,
  soleImmediateDependency: "NEX-CI:2/CockpitShellRuntimeBinding" as const,
  consumesNexCi2Only: true as const,
  bypassesIntoNexCi1: false as const,
  bypassesIntoRex: false as const,
  bypassesIntoExDri: false as const,
  bypassesIntoDri: false as const,
  bypassesIntoNol: false as const,
  ownsRuntimeMeaning: false as const,
  ownsRendering: false as const,
  ownsCameraMutation: false as const,
  ownsObjectAnimation: false as const,
  ownsWorkspaceSwitching: false as const,
  ownsSceneColorSwitching: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  introducesReact: false as const,
  introducesThreeJs: false as const,
  introducesReactThreeFiber: false as const,
  implementsNexCi4: false as const,
});

// ─── Subject roles / visibility / emphasis ──────────────────────────────────

export const EXECUTIVE_STAGE_SUBJECT_ROLES = Object.freeze([
  "primary",
  "related",
  "context",
  "supporting",
] as const);

export type ExecutiveStageSubjectRole =
  (typeof EXECUTIVE_STAGE_SUBJECT_ROLES)[number];

export const EXECUTIVE_STAGE_VISIBILITY_STATES = Object.freeze([
  "visible",
  "dimmed",
  "hidden",
] as const);

export type ExecutiveStageVisibility =
  (typeof EXECUTIVE_STAGE_VISIBILITY_STATES)[number];

export const EXECUTIVE_STAGE_EMPHASIS_STATES = Object.freeze([
  "normal",
  "selected",
  "focused",
  "attention",
  "deemphasized",
] as const);

export type ExecutiveStageEmphasis =
  (typeof EXECUTIVE_STAGE_EMPHASIS_STATES)[number];

// ─── Relationships ──────────────────────────────────────────────────────────

export const EXECUTIVE_STAGE_RELATIONSHIP_KINDS = Object.freeze([
  "related",
  "contains",
  "depends-on",
  "informs",
  "supports",
  "context",
] as const);

export type ExecutiveStageRelationshipKind =
  (typeof EXECUTIVE_STAGE_RELATIONSHIP_KINDS)[number];

export const EXECUTIVE_STAGE_RELATIONSHIP_EMPHASIS_STATES = Object.freeze([
  "normal",
  "primary",
  "attention",
  "deemphasized",
] as const);

export type ExecutiveStageRelationshipEmphasis =
  (typeof EXECUTIVE_STAGE_RELATIONSHIP_EMPHASIS_STATES)[number];

export interface ExecutiveStageRelationshipInput {
  readonly id: string;
  readonly sourceSubjectId: string;
  readonly targetSubjectId: string;
  readonly kind: ExecutiveStageRelationshipKind;
}

export interface ExecutiveStageRelationship {
  readonly id: string;
  readonly sourceSubjectId: string;
  readonly targetSubjectId: string;
  readonly kind: ExecutiveStageRelationshipKind;
  readonly emphasis: ExecutiveStageRelationshipEmphasis;
  readonly visible: boolean;
}

// ─── Attention (Stage semantic directives — not a competing engine) ─────────

/**
 * Stage attention levels translate opaque runtime attention subject ids
 * into renderer-neutral directives. NEX-CI:3 does not calculate attention.
 */
export const EXECUTIVE_STAGE_ATTENTION_LEVELS = Object.freeze([
  "primary",
  "secondary",
  "context",
  "background",
] as const);

export type ExecutiveStageAttentionLevel =
  (typeof EXECUTIVE_STAGE_ATTENTION_LEVELS)[number];

export const EXECUTIVE_STAGE_ATTENTION_REASONS = Object.freeze([
  "focus",
  "selection",
  "runtime-attention",
  "relationship",
] as const);

export type ExecutiveStageAttentionReason =
  (typeof EXECUTIVE_STAGE_ATTENTION_REASONS)[number];

export interface ExecutiveStageAttentionDirective {
  readonly subjectId: string;
  readonly level: ExecutiveStageAttentionLevel;
  readonly reason?: ExecutiveStageAttentionReason;
}

// ─── Reactions / placement / camera / interactions ──────────────────────────

export const EXECUTIVE_STAGE_REACTION_KINDS = Object.freeze([
  "focus-subject",
  "select-subject",
  "reveal-related",
  "hide-unrelated",
  "dim-unrelated",
  "emphasize-relationship",
  "change-presentation",
  "clear-focus",
  "restore-scene",
] as const);

export type ExecutiveStageReactionKind =
  (typeof EXECUTIVE_STAGE_REACTION_KINDS)[number];

export interface ExecutiveStageReaction {
  readonly kind: ExecutiveStageReactionKind;
  readonly subjectId?: string;
  readonly relationshipId?: string;
  readonly presentationState?: ExecutiveCockpitPresentationState;
  readonly priority: number;
}

export const EXECUTIVE_STAGE_PLACEMENT_INTENTS = Object.freeze([
  "center",
  "around-primary",
  "context",
  "background",
] as const);

export type ExecutiveStagePlacementIntent =
  (typeof EXECUTIVE_STAGE_PLACEMENT_INTENTS)[number];

export interface ExecutiveStagePlacementDirective {
  readonly subjectId: string;
  readonly intent: ExecutiveStagePlacementIntent;
  readonly order: number;
}

export interface ExecutiveStageFocusDirective {
  readonly subjectId: string;
  readonly placementIntent: "center";
}

export const EXECUTIVE_STAGE_CAMERA_INTENTS = Object.freeze([
  "overview",
  "focus-primary",
  "restore",
] as const);

export type ExecutiveStageCameraIntent =
  (typeof EXECUTIVE_STAGE_CAMERA_INTENTS)[number];

export const EXECUTIVE_STAGE_INTERACTION_KINDS = Object.freeze([
  "select",
  "focus",
  "clear-selection",
  "clear-focus",
  "open",
  "dismiss",
  "context-open",
] as const);

export type ExecutiveStageInteractionKind =
  (typeof EXECUTIVE_STAGE_INTERACTION_KINDS)[number];

export interface ExecutiveStageInteractionIntent {
  readonly kind: ExecutiveStageInteractionKind;
  readonly subjectId?: string;
  readonly source: "stage";
}

// ─── Stage subject / scene snapshot ─────────────────────────────────────────

export interface ExecutiveStageSubject {
  readonly id: string;
  readonly kind: ExecutiveCockpitSubjectKind;
  readonly role: ExecutiveStageSubjectRole;
  readonly selected: boolean;
  readonly focused: boolean;
  readonly visibility: ExecutiveStageVisibility;
  readonly emphasis: ExecutiveStageEmphasis;
  readonly presentationState: ExecutiveCockpitPresentationState;
}

export interface ExecutiveStageSceneSnapshot {
  readonly stageSurface: "stage";
  readonly workspace?: string;
  readonly primarySubject?: ExecutiveStageSubject;
  readonly subjects: readonly ExecutiveStageSubject[];
  readonly relationships: readonly ExecutiveStageRelationship[];
  readonly attention: readonly ExecutiveStageAttentionDirective[];
  readonly placements: readonly ExecutiveStagePlacementDirective[];
  readonly focusDirective?: ExecutiveStageFocusDirective;
  readonly cameraIntent: ExecutiveStageCameraIntent;
  readonly reactions: readonly ExecutiveStageReaction[];
  readonly status: ExecutiveCockpitIntegrationStatus;
  readonly compositionPolicy: ExecutiveStageCompositionPolicy;
  readonly integrationIdentity: typeof executiveStageIntegrationIdentity;
  readonly integrationVersion: typeof executiveStageIntegrationVersion;
}

export const EXECUTIVE_STAGE_COMPOSITION_POLICIES = Object.freeze([
  "overview",
  "selection-without-focus",
  "focus-centered",
  "restored",
] as const);

export type ExecutiveStageCompositionPolicy =
  (typeof EXECUTIVE_STAGE_COMPOSITION_POLICIES)[number];

/**
 * Optional relationship-driven expansion inputs.
 * Relationships are never fabricated — only supplied inputs are used.
 */
export interface ExecutiveStageSceneOptions {
  readonly relatedSubjects?: readonly ExecutiveCockpitSubjectReference[];
  readonly relationships?: readonly ExecutiveStageRelationshipInput[];
  readonly previousScene?: ExecutiveStageSceneSnapshot;
  /** Semantic readability hint for future renderers — not a hard maximum. */
  readonly densityHint?: "sparse" | "standard" | "dense";
}

// ─── Guarantees / forbidden ─────────────────────────────────────────────────

export const EXECUTIVE_STAGE_INTEGRATION_GUARANTEES = Object.freeze([
  Object.freeze({
    id: "nex-ci-2-sole-immediate-dependency",
    order: 1,
    statement: "NEX-CI:3 has NEX-CI:2 as sole immediate NEX-CI dependency.",
  }),
  Object.freeze({
    id: "stage-remains-primary-visual-surface",
    order: 2,
    statement: "Stage remains the primary visual Cockpit surface.",
  }),
  Object.freeze({
    id: "at-most-one-primary-subject",
    order: 3,
    statement: "At most one Stage subject is primary.",
  }),
  Object.freeze({
    id: "focus-selection-remain-distinct",
    order: 4,
    statement: "Focus and selection remain distinct.",
  }),
  Object.freeze({
    id: "focused-subject-primary-emphasis",
    order: 5,
    statement: "Focused subject receives primary semantic emphasis.",
  }),
  Object.freeze({
    id: "related-subjects-reference-valid",
    order: 6,
    statement: "Related subjects reference valid subjects.",
  }),
  Object.freeze({
    id: "relationships-reference-valid-subjects",
    order: 7,
    statement: "Relationships reference valid source/target subjects.",
  }),
  Object.freeze({
    id: "placements-reference-valid-subjects",
    order: 8,
    statement: "Placement directives reference valid subjects.",
  }),
  Object.freeze({
    id: "attention-reference-valid-subjects",
    order: 9,
    statement: "Attention directives reference valid subjects.",
  }),
  Object.freeze({
    id: "reaction-kinds-canonical",
    order: 10,
    statement: "Reaction kinds are canonical.",
  }),
  Object.freeze({
    id: "presentation-reuses-upstream",
    order: 11,
    statement: "Presentation state reuses canonical upstream model.",
  }),
  Object.freeze({
    id: "no-competing-presentation-system",
    order: 12,
    statement: "No competing Minimum/Report/Operation system is created.",
  }),
  Object.freeze({
    id: "scene-output-deterministic",
    order: 13,
    statement: "Scene output is deterministic.",
  }),
  Object.freeze({
    id: "input-snapshots-not-mutated",
    order: 14,
    statement: "Input snapshots are not mutated.",
  }),
  Object.freeze({
    id: "no-threejs-in-core-contracts",
    order: 15,
    statement: "No Three.js objects exist in core contracts.",
  }),
  Object.freeze({
    id: "no-react-elements-in-core-contracts",
    order: 16,
    statement: "No React elements exist in core contracts.",
  }),
  Object.freeze({
    id: "no-renderer-side-effects",
    order: 17,
    statement: "No renderer side effects occur.",
  }),
  Object.freeze({
    id: "no-camera-mutation",
    order: 18,
    statement: "No camera mutation occurs.",
  }),
  Object.freeze({
    id: "no-global-runtime-mutation",
    order: 19,
    statement: "No global runtime mutation occurs.",
  }),
  Object.freeze({
    id: "no-workspace-switching",
    order: 20,
    statement: "No workspace switching is implemented.",
  }),
  Object.freeze({
    id: "no-scene-color-switching",
    order: 21,
    statement: "No scene color switching is implemented.",
  }),
] as const);

export type ExecutiveStageIntegrationGuarantee =
  (typeof EXECUTIVE_STAGE_INTEGRATION_GUARANTEES)[number];

export const EXECUTIVE_STAGE_INTEGRATION_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "React components",
    "React hooks",
    "Three.js Mesh",
    "Three.js Object3D",
    "Three.js Vector3",
    "React Three Fiber Canvas",
    "camera.position mutation",
    "camera.lookAt",
    "useThree",
    "useFrame",
    "physical object animation",
    "spring animation",
    "shaders",
    "materials",
    "Workspace Dial",
    "workspace switching",
    "scene color switching",
    "Advisor intelligence",
    "Insight generation",
    "Timeline replay",
    "Explorer UI",
    "Live Lens UI",
    "global interaction orchestration",
    "NEX-CI:4 Workspace Dial & Experience Switching",
  ] as const);

// ─── Guards / getters ───────────────────────────────────────────────────────

export function isExecutiveStageSubjectRole(
  value: unknown,
): value is ExecutiveStageSubjectRole {
  return (EXECUTIVE_STAGE_SUBJECT_ROLES as readonly unknown[]).includes(value);
}

export function isExecutiveStageVisibility(
  value: unknown,
): value is ExecutiveStageVisibility {
  return (
    EXECUTIVE_STAGE_VISIBILITY_STATES as readonly unknown[]
  ).includes(value);
}

export function isExecutiveStageEmphasis(
  value: unknown,
): value is ExecutiveStageEmphasis {
  return (
    EXECUTIVE_STAGE_EMPHASIS_STATES as readonly unknown[]
  ).includes(value);
}

export function isExecutiveStageRelationshipKind(
  value: unknown,
): value is ExecutiveStageRelationshipKind {
  return (
    EXECUTIVE_STAGE_RELATIONSHIP_KINDS as readonly unknown[]
  ).includes(value);
}

export function isExecutiveStageReactionKind(
  value: unknown,
): value is ExecutiveStageReactionKind {
  return (
    EXECUTIVE_STAGE_REACTION_KINDS as readonly unknown[]
  ).includes(value);
}

export function isExecutiveStagePlacementIntent(
  value: unknown,
): value is ExecutiveStagePlacementIntent {
  return (
    EXECUTIVE_STAGE_PLACEMENT_INTENTS as readonly unknown[]
  ).includes(value);
}

export function isExecutiveStageInteractionKind(
  value: unknown,
): value is ExecutiveStageInteractionKind {
  return (
    EXECUTIVE_STAGE_INTERACTION_KINDS as readonly unknown[]
  ).includes(value);
}

export function isExecutiveStageCameraIntent(
  value: unknown,
): value is ExecutiveStageCameraIntent {
  return (EXECUTIVE_STAGE_CAMERA_INTENTS as readonly unknown[]).includes(value);
}

export function getExecutiveStageIntegrationIdentity():
  typeof executiveStageIntegrationCanonicalIdentity {
  return executiveStageIntegrationCanonicalIdentity;
}

export function getExecutiveStageSubjectRoles(): ReadonlyArray<
  ExecutiveStageSubjectRole
> {
  return EXECUTIVE_STAGE_SUBJECT_ROLES;
}

export function getExecutiveStageVisibilityStates(): ReadonlyArray<
  ExecutiveStageVisibility
> {
  return EXECUTIVE_STAGE_VISIBILITY_STATES;
}

export function getExecutiveStageEmphasisStates(): ReadonlyArray<
  ExecutiveStageEmphasis
> {
  return EXECUTIVE_STAGE_EMPHASIS_STATES;
}

export function getExecutiveStageReactionKinds(): ReadonlyArray<
  ExecutiveStageReactionKind
> {
  return EXECUTIVE_STAGE_REACTION_KINDS;
}

export function getExecutiveStagePlacementIntents(): ReadonlyArray<
  ExecutiveStagePlacementIntent
> {
  return EXECUTIVE_STAGE_PLACEMENT_INTENTS;
}

export function getExecutiveStageInteractionKinds(): ReadonlyArray<
  ExecutiveStageInteractionKind
> {
  return EXECUTIVE_STAGE_INTERACTION_KINDS;
}

export function getExecutiveStageRelationshipKinds(): ReadonlyArray<
  ExecutiveStageRelationshipKind
> {
  return EXECUTIVE_STAGE_RELATIONSHIP_KINDS;
}

export function getExecutiveStageCameraIntents(): ReadonlyArray<
  ExecutiveStageCameraIntent
> {
  return EXECUTIVE_STAGE_CAMERA_INTENTS;
}

// ─── Resolution helpers ─────────────────────────────────────────────────────

function requireOpaqueId(value: string, field: string): void {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError(`${field} must be a non-empty opaque identifier`);
  }
}

function freezeSubjectRef(
  subject: ExecutiveCockpitSubjectReference,
): ExecutiveCockpitSubjectReference {
  requireOpaqueId(subject.id, "subject.id");
  if (!isExecutiveCockpitSubjectKind(subject.kind)) {
    throw new TypeError("subject.kind must be a known cockpit subject kind");
  }
  return Object.freeze({ id: subject.id, kind: subject.kind });
}

function compareById(a: { readonly id: string }, b: { readonly id: string }): number {
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

function uniqueById<T extends { readonly id: string }>(
  items: readonly T[],
): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      result.push(item);
    }
  }
  return result;
}

/**
 * Primary-subject resolution precedence:
 * focused subject → selected subject → none
 * Never invents a subject when runtime context contains none.
 */
export function resolveExecutiveStagePrimarySubject(
  cockpitSnapshot: CockpitShellRuntimeSnapshot,
): ExecutiveCockpitSubjectReference | undefined {
  const binding = cockpitSnapshot.binding;
  if (binding.focusedSubject !== undefined) {
    return freezeSubjectRef(binding.focusedSubject);
  }
  if (binding.selectedSubject !== undefined) {
    return freezeSubjectRef(binding.selectedSubject);
  }
  return undefined;
}

function collectCandidateSubjects(
  cockpitSnapshot: CockpitShellRuntimeSnapshot,
  options: ExecutiveStageSceneOptions,
): ExecutiveCockpitSubjectReference[] {
  const candidates: ExecutiveCockpitSubjectReference[] = [];
  const { binding } = cockpitSnapshot;

  if (binding.focusedSubject !== undefined) {
    candidates.push(freezeSubjectRef(binding.focusedSubject));
  }
  if (binding.selectedSubject !== undefined) {
    candidates.push(freezeSubjectRef(binding.selectedSubject));
  }

  if (options.relatedSubjects !== undefined) {
    for (const subject of options.relatedSubjects) {
      candidates.push(freezeSubjectRef(subject));
    }
  }

  // Attention id alone cannot invent a kind — only attach when already known.
  if (binding.attentionSubjectId !== undefined) {
    const known = candidates.find(
      (subject) => subject.id === binding.attentionSubjectId,
    );
    if (known === undefined && options.relatedSubjects !== undefined) {
      const fromRelated = options.relatedSubjects.find(
        (subject) => subject.id === binding.attentionSubjectId,
      );
      if (fromRelated !== undefined) {
        candidates.push(freezeSubjectRef(fromRelated));
      }
    }
  }

  return uniqueById(candidates).sort(compareById);
}

function relatedSubjectIdsForPrimary(
  primaryId: string | undefined,
  relationships: readonly ExecutiveStageRelationshipInput[],
): ReadonlySet<string> {
  const related = new Set<string>();
  if (primaryId === undefined) {
    return related;
  }
  for (const relationship of relationships) {
    if (relationship.sourceSubjectId === primaryId) {
      related.add(relationship.targetSubjectId);
    } else if (relationship.targetSubjectId === primaryId) {
      related.add(relationship.sourceSubjectId);
    }
  }
  return related;
}

function resolveSubjectRole(
  subjectId: string,
  primaryId: string | undefined,
  relatedIds: ReadonlySet<string>,
  selectedId: string | undefined,
  focusedId: string | undefined,
): ExecutiveStageSubjectRole {
  if (primaryId !== undefined && subjectId === primaryId) {
    return "primary";
  }
  if (relatedIds.has(subjectId)) {
    return "related";
  }
  if (
    selectedId !== undefined &&
    subjectId === selectedId &&
    focusedId === undefined
  ) {
    return "primary";
  }
  if (selectedId !== undefined && subjectId === selectedId) {
    return "supporting";
  }
  return "context";
}

function resolveSubjectVisibility(
  role: ExecutiveStageSubjectRole,
  hasFocus: boolean,
): ExecutiveStageVisibility {
  if (!hasFocus) {
    return "visible";
  }
  if (role === "primary" || role === "related") {
    return "visible";
  }
  if (role === "supporting") {
    return "visible";
  }
  return "dimmed";
}

function resolveSubjectEmphasis(
  subjectId: string,
  focusedId: string | undefined,
  selectedId: string | undefined,
  attentionId: string | undefined,
  role: ExecutiveStageSubjectRole,
  hasFocus: boolean,
): ExecutiveStageEmphasis {
  if (focusedId !== undefined && subjectId === focusedId) {
    return "focused";
  }
  if (attentionId !== undefined && subjectId === attentionId) {
    return "attention";
  }
  if (selectedId !== undefined && subjectId === selectedId) {
    return "selected";
  }
  if (hasFocus && role === "context") {
    return "deemphasized";
  }
  return "normal";
}

function resolveCompositionPolicy(
  focusedId: string | undefined,
  selectedId: string | undefined,
  previousScene: ExecutiveStageSceneSnapshot | undefined,
): ExecutiveStageCompositionPolicy {
  if (focusedId !== undefined) {
    return "focus-centered";
  }
  if (
    previousScene?.compositionPolicy === "focus-centered" &&
    focusedId === undefined
  ) {
    return "restored";
  }
  if (selectedId !== undefined) {
    return "selection-without-focus";
  }
  return "overview";
}

function resolveCameraIntent(
  policy: ExecutiveStageCompositionPolicy,
): ExecutiveStageCameraIntent {
  if (policy === "focus-centered") {
    return "focus-primary";
  }
  if (policy === "restored") {
    return "restore";
  }
  return "overview";
}

function resolvePlacementIntent(
  role: ExecutiveStageSubjectRole,
): ExecutiveStagePlacementIntent {
  if (role === "primary") {
    return "center";
  }
  if (role === "related") {
    return "around-primary";
  }
  if (role === "supporting") {
    return "context";
  }
  return "background";
}

export function resolveExecutiveStageSubjects(
  cockpitSnapshot: CockpitShellRuntimeSnapshot,
  options: ExecutiveStageSceneOptions = {},
): ReadonlyArray<ExecutiveStageSubject> {
  const stageContext = resolveCockpitSurfaceRuntimeContext(
    cockpitSnapshot.integration,
    "stage",
  );
  const presentationState: ExecutiveCockpitPresentationState =
    stageContext.presentationState ??
    cockpitSnapshot.binding.presentationState ??
    "minimum";
  if (!isExecutiveCockpitPresentationState(presentationState)) {
    throw new TypeError("presentationState must be a canonical presentation state");
  }

  const focusedId = cockpitSnapshot.binding.focusedSubject?.id;
  const selectedId = cockpitSnapshot.binding.selectedSubject?.id;
  const attentionId = cockpitSnapshot.binding.attentionSubjectId;
  const primary = resolveExecutiveStagePrimarySubject(cockpitSnapshot);
  const primaryId = primary?.id;
  const hasFocus = focusedId !== undefined;

  const relationshipInputs = validateRelationshipInputs(
    options.relationships ?? [],
  );
  const relatedIds = relatedSubjectIdsForPrimary(primaryId, relationshipInputs);
  const candidates = collectCandidateSubjects(cockpitSnapshot, options);

  // Relationship-driven expansion: include related subjects that were supplied.
  if (primaryId !== undefined && options.relatedSubjects !== undefined) {
    for (const subject of options.relatedSubjects) {
      if (relatedIds.has(subject.id)) {
        candidates.push(freezeSubjectRef(subject));
      }
    }
  }

  const subjects = uniqueById(candidates)
    .sort(compareById)
    .map((candidate) => {
      const role = resolveSubjectRole(
        candidate.id,
        primaryId,
        relatedIds,
        selectedId,
        focusedId,
      );
      return Object.freeze({
        id: candidate.id,
        kind: candidate.kind,
        role,
        selected: selectedId === candidate.id,
        focused: focusedId === candidate.id,
        visibility: resolveSubjectVisibility(role, hasFocus),
        emphasis: resolveSubjectEmphasis(
          candidate.id,
          focusedId,
          selectedId,
          attentionId,
          role,
          hasFocus,
        ),
        presentationState,
      });
    });

  return Object.freeze(subjects);
}

function validateRelationshipInputs(
  inputs: readonly ExecutiveStageRelationshipInput[],
): readonly ExecutiveStageRelationshipInput[] {
  return Object.freeze(
    [...inputs]
      .map((input) => {
        requireOpaqueId(input.id, "relationship.id");
        requireOpaqueId(input.sourceSubjectId, "relationship.sourceSubjectId");
        requireOpaqueId(input.targetSubjectId, "relationship.targetSubjectId");
        if (!isExecutiveStageRelationshipKind(input.kind)) {
          throw new TypeError(
            "relationship.kind must be a known stage relationship kind",
          );
        }
        return Object.freeze({
          id: input.id,
          sourceSubjectId: input.sourceSubjectId,
          targetSubjectId: input.targetSubjectId,
          kind: input.kind,
        });
      })
      .sort(compareById),
  );
}

export function resolveExecutiveStageRelationships(
  cockpitSnapshot: CockpitShellRuntimeSnapshot,
  options: ExecutiveStageSceneOptions = {},
): ReadonlyArray<ExecutiveStageRelationship> {
  const subjects = resolveExecutiveStageSubjects(cockpitSnapshot, options);
  const subjectIds = new Set(subjects.map((subject) => subject.id));
  const primaryId = subjects.find((subject) => subject.role === "primary")?.id;
  const hasFocus = cockpitSnapshot.binding.focusedSubject !== undefined;
  const attentionId = cockpitSnapshot.binding.attentionSubjectId;

  const relationships = validateRelationshipInputs(options.relationships ?? [])
    .filter(
      (input) =>
        subjectIds.has(input.sourceSubjectId) &&
        subjectIds.has(input.targetSubjectId),
    )
    .map((input) => {
      const touchesPrimary =
        primaryId !== undefined &&
        (input.sourceSubjectId === primaryId ||
          input.targetSubjectId === primaryId);
      const touchesAttention =
        attentionId !== undefined &&
        (input.sourceSubjectId === attentionId ||
          input.targetSubjectId === attentionId);

      let emphasis: ExecutiveStageRelationshipEmphasis = "normal";
      if (touchesPrimary && hasFocus) {
        emphasis = "primary";
      } else if (touchesAttention) {
        emphasis = "attention";
      } else if (hasFocus && !touchesPrimary) {
        emphasis = "deemphasized";
      }

      return Object.freeze({
        id: input.id,
        sourceSubjectId: input.sourceSubjectId,
        targetSubjectId: input.targetSubjectId,
        kind: input.kind,
        emphasis,
        visible: !hasFocus || touchesPrimary || touchesAttention,
      });
    })
    .sort(compareById);

  return Object.freeze(relationships);
}

export function resolveExecutiveStageAttention(
  cockpitSnapshot: CockpitShellRuntimeSnapshot,
  options: ExecutiveStageSceneOptions = {},
): ReadonlyArray<ExecutiveStageAttentionDirective> {
  const subjects = resolveExecutiveStageSubjects(cockpitSnapshot, options);
  const subjectIds = new Set(subjects.map((subject) => subject.id));
  const directives: ExecutiveStageAttentionDirective[] = [];

  const focusedId = cockpitSnapshot.binding.focusedSubject?.id;
  const selectedId = cockpitSnapshot.binding.selectedSubject?.id;
  const attentionId = cockpitSnapshot.binding.attentionSubjectId;

  if (focusedId !== undefined && subjectIds.has(focusedId)) {
    directives.push(
      Object.freeze({
        subjectId: focusedId,
        level: "primary" as const,
        reason: "focus" as const,
      }),
    );
  }

  if (
    selectedId !== undefined &&
    subjectIds.has(selectedId) &&
    selectedId !== focusedId
  ) {
    directives.push(
      Object.freeze({
        subjectId: selectedId,
        level: "secondary" as const,
        reason: "selection" as const,
      }),
    );
  }

  if (
    attentionId !== undefined &&
    subjectIds.has(attentionId) &&
    attentionId !== focusedId &&
    attentionId !== selectedId
  ) {
    directives.push(
      Object.freeze({
        subjectId: attentionId,
        level: "context" as const,
        reason: "runtime-attention" as const,
      }),
    );
  }

  for (const subject of subjects) {
    if (subject.role === "related") {
      const already = directives.some(
        (directive) => directive.subjectId === subject.id,
      );
      if (!already) {
        directives.push(
          Object.freeze({
            subjectId: subject.id,
            level: "secondary" as const,
            reason: "relationship" as const,
          }),
        );
      }
    }
  }

  return Object.freeze(
    directives.sort((a, b) => {
      const levelOrder: Record<ExecutiveStageAttentionLevel, number> = {
        primary: 0,
        secondary: 1,
        context: 2,
        background: 3,
      };
      const levelDiff = levelOrder[a.level] - levelOrder[b.level];
      if (levelDiff !== 0) {
        return levelDiff;
      }
      return a.subjectId < b.subjectId
        ? -1
        : a.subjectId > b.subjectId
          ? 1
          : 0;
    }),
  );
}

export function resolveExecutiveStagePlacements(
  cockpitSnapshot: CockpitShellRuntimeSnapshot,
  options: ExecutiveStageSceneOptions = {},
): ReadonlyArray<ExecutiveStagePlacementDirective> {
  const subjects = resolveExecutiveStageSubjects(cockpitSnapshot, options);
  const placements = subjects
    .map((subject, index) =>
      Object.freeze({
        subjectId: subject.id,
        intent: resolvePlacementIntent(subject.role),
        order:
          subject.role === "primary"
            ? 0
            : subject.role === "related"
              ? 1 + index
              : subject.role === "supporting"
                ? 100 + index
                : 200 + index,
      }),
    )
    .sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.subjectId < b.subjectId
        ? -1
        : a.subjectId > b.subjectId
          ? 1
          : 0;
    });

  return Object.freeze(placements);
}

export function resolveExecutiveStageReactions(
  previousSnapshot: ExecutiveStageSceneSnapshot | undefined,
  nextRuntimeSnapshot: ExecutiveStageSceneSnapshot,
): ReadonlyArray<ExecutiveStageReaction> {
  const reactions: ExecutiveStageReaction[] = [];
  let priority = 1;

  const prevPrimaryId = previousSnapshot?.primarySubject?.id;
  const nextPrimaryId = nextRuntimeSnapshot.primarySubject?.id;
  const prevFocused = previousSnapshot?.subjects.find((s) => s.focused)?.id;
  const nextFocused = nextRuntimeSnapshot.subjects.find((s) => s.focused)?.id;
  const prevSelected = previousSnapshot?.subjects.find((s) => s.selected)?.id;
  const nextSelected = nextRuntimeSnapshot.subjects.find((s) => s.selected)?.id;
  const prevPresentation = previousSnapshot?.primarySubject?.presentationState;
  const nextPresentation =
    nextRuntimeSnapshot.primarySubject?.presentationState;

  if (nextFocused !== undefined && nextFocused !== prevFocused) {
    reactions.push(
      Object.freeze({
        kind: "focus-subject" as const,
        subjectId: nextFocused,
        priority: priority++,
      }),
    );
  }

  if (prevFocused !== undefined && nextFocused === undefined) {
    reactions.push(
      Object.freeze({
        kind: "clear-focus" as const,
        subjectId: prevFocused,
        priority: priority++,
      }),
    );
    reactions.push(
      Object.freeze({
        kind: "restore-scene" as const,
        priority: priority++,
      }),
    );
  }

  if (nextSelected !== undefined && nextSelected !== prevSelected) {
    reactions.push(
      Object.freeze({
        kind: "select-subject" as const,
        subjectId: nextSelected,
        priority: priority++,
      }),
    );
  }

  if (
    nextRuntimeSnapshot.compositionPolicy === "focus-centered" &&
    nextRuntimeSnapshot.subjects.some((subject) => subject.role === "related")
  ) {
    const related = nextRuntimeSnapshot.subjects
      .filter((subject) => subject.role === "related")
      .sort(compareById);
    for (const subject of related) {
      const previouslyRelated = previousSnapshot?.subjects.some(
        (entry) => entry.id === subject.id && entry.role === "related",
      );
      if (!previouslyRelated) {
        reactions.push(
          Object.freeze({
            kind: "reveal-related" as const,
            subjectId: subject.id,
            priority: priority++,
          }),
        );
      }
    }
  }

  if (nextRuntimeSnapshot.compositionPolicy === "focus-centered") {
    const dimmed = nextRuntimeSnapshot.subjects.filter(
      (subject) => subject.visibility === "dimmed",
    );
    if (dimmed.length > 0) {
      reactions.push(
        Object.freeze({
          kind: "dim-unrelated" as const,
          priority: priority++,
        }),
      );
    }
    const hidden = nextRuntimeSnapshot.subjects.filter(
      (subject) => subject.visibility === "hidden",
    );
    if (hidden.length > 0) {
      reactions.push(
        Object.freeze({
          kind: "hide-unrelated" as const,
          priority: priority++,
        }),
      );
    }
  }

  for (const relationship of nextRuntimeSnapshot.relationships) {
    if (relationship.emphasis === "primary" && relationship.visible) {
      const previouslyPrimary = previousSnapshot?.relationships.some(
        (entry) =>
          entry.id === relationship.id && entry.emphasis === "primary",
      );
      if (!previouslyPrimary) {
        reactions.push(
          Object.freeze({
            kind: "emphasize-relationship" as const,
            relationshipId: relationship.id,
            priority: priority++,
          }),
        );
      }
    }
  }

  if (
    nextPresentation !== undefined &&
    nextPresentation !== prevPresentation &&
    nextPrimaryId !== undefined
  ) {
    reactions.push(
      Object.freeze({
        kind: "change-presentation" as const,
        subjectId: nextPrimaryId,
        presentationState: nextPresentation,
        priority: priority++,
      }),
    );
  }

  // Stable secondary sort by kind then subject/relationship id.
  return Object.freeze(
    reactions.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      if (a.kind !== b.kind) {
        return a.kind < b.kind ? -1 : 1;
      }
      const aKey = a.subjectId ?? a.relationshipId ?? "";
      const bKey = b.subjectId ?? b.relationshipId ?? "";
      return aKey < bKey ? -1 : aKey > bKey ? 1 : 0;
    }),
  );
}

export function resolveExecutiveStageScene(
  cockpitSnapshot: CockpitShellRuntimeSnapshot,
  options: ExecutiveStageSceneOptions = {},
): ExecutiveStageSceneSnapshot {
  const stageContext = resolveCockpitSurfaceRuntimeContext(
    cockpitSnapshot.integration,
    "stage",
  );
  if (stageContext.surface !== "stage") {
    throw new TypeError("Stage surface context is required");
  }

  const subjects = resolveExecutiveStageSubjects(cockpitSnapshot, options);
  const primarySubject = subjects.find((subject) => subject.role === "primary");
  const primaryCount = subjects.filter(
    (subject) => subject.role === "primary",
  ).length;
  if (primaryCount > 1) {
    throw new TypeError("at most one Stage subject may be primary");
  }

  const relationships = resolveExecutiveStageRelationships(
    cockpitSnapshot,
    options,
  );
  const attention = resolveExecutiveStageAttention(cockpitSnapshot, options);
  const placements = resolveExecutiveStagePlacements(cockpitSnapshot, options);

  const focusedId = cockpitSnapshot.binding.focusedSubject?.id;
  const selectedId = cockpitSnapshot.binding.selectedSubject?.id;
  const compositionPolicy = resolveCompositionPolicy(
    focusedId,
    selectedId,
    options.previousScene,
  );
  const cameraIntent = resolveCameraIntent(compositionPolicy);

  const focusDirective =
    focusedId !== undefined
      ? Object.freeze({
          subjectId: focusedId,
          placementIntent: "center" as const,
        })
      : undefined;

  const draftScene: ExecutiveStageSceneSnapshot = Object.freeze({
    stageSurface: "stage" as const,
    subjects,
    relationships,
    attention,
    placements,
    cameraIntent,
    reactions: Object.freeze([] as ExecutiveStageReaction[]),
    status: cockpitSnapshot.binding.integrationStatus,
    compositionPolicy,
    integrationIdentity: executiveStageIntegrationIdentity,
    integrationVersion: executiveStageIntegrationVersion,
    ...(cockpitSnapshot.binding.activeWorkspace !== undefined
      ? { workspace: cockpitSnapshot.binding.activeWorkspace }
      : stageContext.activeWorkspace !== undefined
        ? { workspace: stageContext.activeWorkspace }
        : {}),
    ...(primarySubject !== undefined ? { primarySubject } : {}),
    ...(focusDirective !== undefined ? { focusDirective } : {}),
  });

  const reactions = resolveExecutiveStageReactions(
    options.previousScene,
    draftScene,
  );

  return Object.freeze({
    ...draftScene,
    reactions,
  });
}

export function createExecutiveStageInteractionIntent(
  kind: ExecutiveStageInteractionKind,
  subjectId?: string,
): ExecutiveStageInteractionIntent {
  if (!isExecutiveStageInteractionKind(kind)) {
    throw new TypeError(
      "kind must be a known executive stage interaction kind",
    );
  }
  if (
    (kind === "select" ||
      kind === "focus" ||
      kind === "open" ||
      kind === "context-open") &&
    (subjectId === undefined || subjectId.length === 0)
  ) {
    throw new TypeError(`${kind} intent requires a non-empty subjectId`);
  }
  if (subjectId !== undefined) {
    requireOpaqueId(subjectId, "subjectId");
  }

  return Object.freeze({
    kind,
    source: "stage" as const,
    ...(subjectId !== undefined ? { subjectId } : {}),
  });
}

// ─── Validation ─────────────────────────────────────────────────────────────

export interface ExecutiveStageSceneValidation {
  readonly ok: boolean;
  readonly identity: typeof executiveStageIntegrationIdentity;
  readonly version: typeof executiveStageIntegrationVersion;
  readonly namespace: typeof executiveStageIntegrationNamespace;
  readonly phase: typeof executiveStageIntegrationPhase;
  readonly architecturalRole: typeof executiveStageIntegrationArchitecturalRole;
  readonly dependencyIdentity: typeof executiveStageIntegrationDependencyIdentity;
  readonly subjectRoleCount: number;
  readonly visibilityCount: number;
  readonly emphasisCount: number;
  readonly reactionKindCount: number;
  readonly placementIntentCount: number;
  readonly interactionKindCount: number;
  readonly guaranteeCount: number;
  readonly invariantCount: number;
  readonly shellBindingOk: boolean;
  readonly frozen: boolean;
  readonly primaryUnique: boolean;
  readonly presentationCompatible: boolean;
  readonly rendererNeutral: boolean;
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

export function validateExecutiveStageScene(
  scene?: ExecutiveStageSceneSnapshot,
): ExecutiveStageSceneValidation {
  const shellBinding = verifyCockpitShellRuntimeBinding();

  const identityOk =
    executiveStageIntegrationIdentity ===
      "NEX-CI:3/ExecutiveStageIntegration" &&
    executiveStageIntegrationVersion === "1.3.0" &&
    executiveStageIntegrationNamespace ===
      "nexora.executive.cockpit.integration.stage" &&
    executiveStageIntegrationPhase === "ExecutiveStageIntegration" &&
    executiveStageIntegrationArchitecturalRole ===
      "ExecutiveStageIntegration" &&
    executiveStageIntegrationDependencyIdentity ===
      "NEX-CI:2/CockpitShellRuntimeBinding" &&
    executiveStageIntegrationDependencyIdentity ===
      cockpitShellRuntimeBindingIdentity &&
    EXECUTIVE_STAGE_INTEGRATION_BOUNDARY.soleImmediateDependency ===
      "NEX-CI:2/CockpitShellRuntimeBinding" &&
    EXECUTIVE_STAGE_INTEGRATION_BOUNDARY.consumesNexCi2Only === true;

  const vocabularyOk =
    exactOrder(EXECUTIVE_STAGE_SUBJECT_ROLES, [
      "primary",
      "related",
      "context",
      "supporting",
    ]) &&
    exactOrder(EXECUTIVE_STAGE_VISIBILITY_STATES, [
      "visible",
      "dimmed",
      "hidden",
    ]) &&
    exactOrder(EXECUTIVE_STAGE_EMPHASIS_STATES, [
      "normal",
      "selected",
      "focused",
      "attention",
      "deemphasized",
    ]) &&
    exactOrder(EXECUTIVE_STAGE_REACTION_KINDS, [
      "focus-subject",
      "select-subject",
      "reveal-related",
      "hide-unrelated",
      "dim-unrelated",
      "emphasize-relationship",
      "change-presentation",
      "clear-focus",
      "restore-scene",
    ]) &&
    exactOrder(EXECUTIVE_STAGE_PLACEMENT_INTENTS, [
      "center",
      "around-primary",
      "context",
      "background",
    ]) &&
    exactOrder(EXECUTIVE_STAGE_INTERACTION_KINDS, [
      "select",
      "focus",
      "clear-selection",
      "clear-focus",
      "open",
      "dismiss",
      "context-open",
    ]) &&
    unique([...EXECUTIVE_STAGE_SUBJECT_ROLES]) &&
    unique([...EXECUTIVE_STAGE_VISIBILITY_STATES]) &&
    unique([...EXECUTIVE_STAGE_EMPHASIS_STATES]) &&
    unique([...EXECUTIVE_STAGE_REACTION_KINDS]) &&
    unique([...EXECUTIVE_STAGE_PLACEMENT_INTENTS]) &&
    unique([...EXECUTIVE_STAGE_INTERACTION_KINDS]);

  let sceneOk = true;
  let primaryUnique = true;
  if (scene !== undefined) {
    const subjectIds = scene.subjects.map((subject) => subject.id);
    primaryUnique =
      scene.subjects.filter((subject) => subject.role === "primary").length <=
      1;
    const focused = scene.subjects.filter((subject) => subject.focused);
    const primary = scene.subjects.find((subject) => subject.role === "primary");

    sceneOk =
      scene.stageSurface === "stage" &&
      Object.isFrozen(scene) &&
      Object.isFrozen(scene.subjects) &&
      Object.isFrozen(scene.relationships) &&
      Object.isFrozen(scene.attention) &&
      Object.isFrozen(scene.placements) &&
      Object.isFrozen(scene.reactions) &&
      unique(subjectIds) &&
      primaryUnique &&
      isExecutiveCockpitIntegrationStatus(scene.status) &&
      isExecutiveStageCameraIntent(scene.cameraIntent) &&
      scene.subjects.every(
        (subject) =>
          isExecutiveCockpitSubjectKind(subject.kind) &&
          isExecutiveStageSubjectRole(subject.role) &&
          isExecutiveStageVisibility(subject.visibility) &&
          isExecutiveStageEmphasis(subject.emphasis) &&
          isExecutiveCockpitPresentationState(subject.presentationState) &&
          Object.isFrozen(subject),
      ) &&
      scene.relationships.every(
        (relationship) =>
          subjectIds.includes(relationship.sourceSubjectId) &&
          subjectIds.includes(relationship.targetSubjectId) &&
          isExecutiveStageRelationshipKind(relationship.kind) &&
          Object.isFrozen(relationship),
      ) &&
      scene.placements.every(
        (placement) =>
          subjectIds.includes(placement.subjectId) &&
          isExecutiveStagePlacementIntent(placement.intent) &&
          Object.isFrozen(placement),
      ) &&
      scene.attention.every(
        (directive) =>
          subjectIds.includes(directive.subjectId) && Object.isFrozen(directive),
      ) &&
      scene.reactions.every(
        (reaction) =>
          isExecutiveStageReactionKind(reaction.kind) &&
          Object.isFrozen(reaction),
      ) &&
      (focused.length === 0 ||
        (focused.length === 1 &&
          primary !== undefined &&
          primary.id === focused[0].id &&
          primary.emphasis === "focused")) &&
      (scene.focusDirective === undefined ||
        (scene.focusDirective.placementIntent === "center" &&
          subjectIds.includes(scene.focusDirective.subjectId)));
  }

  const guaranteesOk =
    EXECUTIVE_STAGE_INTEGRATION_GUARANTEES.length === 21 &&
    exactOrder(
      EXECUTIVE_STAGE_INTEGRATION_GUARANTEES.map((entry) => entry.id),
      [
        "nex-ci-2-sole-immediate-dependency",
        "stage-remains-primary-visual-surface",
        "at-most-one-primary-subject",
        "focus-selection-remain-distinct",
        "focused-subject-primary-emphasis",
        "related-subjects-reference-valid",
        "relationships-reference-valid-subjects",
        "placements-reference-valid-subjects",
        "attention-reference-valid-subjects",
        "reaction-kinds-canonical",
        "presentation-reuses-upstream",
        "no-competing-presentation-system",
        "scene-output-deterministic",
        "input-snapshots-not-mutated",
        "no-threejs-in-core-contracts",
        "no-react-elements-in-core-contracts",
        "no-renderer-side-effects",
        "no-camera-mutation",
        "no-global-runtime-mutation",
        "no-workspace-switching",
        "no-scene-color-switching",
      ],
    );

  const immutabilityOk =
    Object.isFrozen(executiveStageIntegrationCanonicalIdentity) &&
    Object.isFrozen(EXECUTIVE_STAGE_SUBJECT_ROLES) &&
    Object.isFrozen(EXECUTIVE_STAGE_VISIBILITY_STATES) &&
    Object.isFrozen(EXECUTIVE_STAGE_EMPHASIS_STATES) &&
    Object.isFrozen(EXECUTIVE_STAGE_REACTION_KINDS) &&
    Object.isFrozen(EXECUTIVE_STAGE_PLACEMENT_INTENTS) &&
    Object.isFrozen(EXECUTIVE_STAGE_INTERACTION_KINDS) &&
    Object.isFrozen(EXECUTIVE_STAGE_INTEGRATION_GUARANTEES) &&
    Object.isFrozen(EXECUTIVE_STAGE_INTEGRATION_BOUNDARY) &&
    Object.isFrozen(executiveStageIntegration);

  const presentationCompatible =
    EXECUTIVE_STAGE_INTEGRATION_BOUNDARY.ownsRuntimeMeaning === false;

  const rendererNeutral =
    EXECUTIVE_STAGE_INTEGRATION_BOUNDARY.ownsRendering === false &&
    EXECUTIVE_STAGE_INTEGRATION_BOUNDARY.ownsCameraMutation === false &&
    EXECUTIVE_STAGE_INTEGRATION_BOUNDARY.introducesThreeJs === false &&
    EXECUTIVE_STAGE_INTEGRATION_BOUNDARY.introducesReactThreeFiber === false &&
    EXECUTIVE_STAGE_INTEGRATION_BOUNDARY.introducesReact === false;

  const frameworkIndependent =
    EXECUTIVE_STAGE_INTEGRATION_BOUNDARY.frameworkIndependent === true &&
    EXECUTIVE_STAGE_INTEGRATION_BOUNDARY.implementsNexCi4 === false &&
    EXECUTIVE_STAGE_INTEGRATION_BOUNDARY.ownsWorkspaceSwitching === false &&
    EXECUTIVE_STAGE_INTEGRATION_BOUNDARY.ownsSceneColorSwitching === false;

  const ok =
    identityOk &&
    vocabularyOk &&
    sceneOk &&
    primaryUnique &&
    guaranteesOk &&
    immutabilityOk &&
    presentationCompatible &&
    rendererNeutral &&
    frameworkIndependent &&
    shellBinding.ok === true;

  return Object.freeze({
    ok,
    identity: executiveStageIntegrationIdentity,
    version: executiveStageIntegrationVersion,
    namespace: executiveStageIntegrationNamespace,
    phase: executiveStageIntegrationPhase,
    architecturalRole: executiveStageIntegrationArchitecturalRole,
    dependencyIdentity: executiveStageIntegrationDependencyIdentity,
    subjectRoleCount: EXECUTIVE_STAGE_SUBJECT_ROLES.length,
    visibilityCount: EXECUTIVE_STAGE_VISIBILITY_STATES.length,
    emphasisCount: EXECUTIVE_STAGE_EMPHASIS_STATES.length,
    reactionKindCount: EXECUTIVE_STAGE_REACTION_KINDS.length,
    placementIntentCount: EXECUTIVE_STAGE_PLACEMENT_INTENTS.length,
    interactionKindCount: EXECUTIVE_STAGE_INTERACTION_KINDS.length,
    guaranteeCount: EXECUTIVE_STAGE_INTEGRATION_GUARANTEES.length,
    invariantCount: EXECUTIVE_STAGE_INTEGRATION_GUARANTEES.length,
    shellBindingOk: shellBinding.ok,
    frozen: immutabilityOk,
    primaryUnique,
    presentationCompatible,
    rendererNeutral,
    frameworkIndependent,
  });
}

export function verifyExecutiveStageIntegration():
  ExecutiveStageSceneValidation {
  return validateExecutiveStageScene();
}

// ─── Public catalogs / module bag ───────────────────────────────────────────

export const executiveStageIntegrationApiNames = Object.freeze([
  "getExecutiveStageIntegrationIdentity",
  "getExecutiveStageSubjectRoles",
  "isExecutiveStageSubjectRole",
  "getExecutiveStageVisibilityStates",
  "isExecutiveStageVisibility",
  "getExecutiveStageEmphasisStates",
  "isExecutiveStageEmphasis",
  "getExecutiveStageReactionKinds",
  "isExecutiveStageReactionKind",
  "getExecutiveStagePlacementIntents",
  "isExecutiveStagePlacementIntent",
  "getExecutiveStageInteractionKinds",
  "isExecutiveStageInteractionKind",
  "getExecutiveStageRelationshipKinds",
  "isExecutiveStageRelationshipKind",
  "getExecutiveStageCameraIntents",
  "isExecutiveStageCameraIntent",
  "resolveExecutiveStagePrimarySubject",
  "resolveExecutiveStageSubjects",
  "resolveExecutiveStageRelationships",
  "resolveExecutiveStageAttention",
  "resolveExecutiveStagePlacements",
  "resolveExecutiveStageReactions",
  "resolveExecutiveStageScene",
  "createExecutiveStageInteractionIntent",
  "validateExecutiveStageScene",
  "verifyExecutiveStageIntegration",
] as const);

export const EXECUTIVE_STAGE_INTEGRATION_PUBLIC_TYPE_NAMES = Object.freeze([
  "ExecutiveStageSubjectRole",
  "ExecutiveStageVisibility",
  "ExecutiveStageEmphasis",
  "ExecutiveStageSubject",
  "ExecutiveStageRelationshipKind",
  "ExecutiveStageRelationship",
  "ExecutiveStageAttentionDirective",
  "ExecutiveStageReactionKind",
  "ExecutiveStageReaction",
  "ExecutiveStagePlacementIntent",
  "ExecutiveStagePlacementDirective",
  "ExecutiveStageFocusDirective",
  "ExecutiveStageCameraIntent",
  "ExecutiveStageInteractionKind",
  "ExecutiveStageInteractionIntent",
  "ExecutiveStageCompositionPolicy",
  "ExecutiveStageSceneSnapshot",
  "ExecutiveStageSceneOptions",
  "ExecutiveStageSceneValidation",
] as const);

export const executiveStageIntegration = Object.freeze({
  phase: "ExecutiveStageIntegration" as const,
  name: "ExecutiveStageIntegration" as const,
  identity: executiveStageIntegrationIdentity,
  version: executiveStageIntegrationVersion,
  namespace: executiveStageIntegrationNamespace,
  layer: executiveStageIntegrationLayer,
  stage: executiveStageIntegrationStage,
  architecturalRole: executiveStageIntegrationArchitecturalRole,
  role: "ExecutiveStageIntegration" as const,
  status: executiveStageIntegrationStability,
  upstreamDependency: executiveStageIntegrationDependencyIdentity,
  dependencyPath: executiveStageIntegrationDependencyPath,
  deterministic: executiveStageIntegrationDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  browserIndependent: true as const,
  principle: EXECUTIVE_STAGE_INTEGRATION_PRINCIPLE,
  boundary: EXECUTIVE_STAGE_INTEGRATION_BOUNDARY,
  subjectRoles: EXECUTIVE_STAGE_SUBJECT_ROLES,
  visibilityStates: EXECUTIVE_STAGE_VISIBILITY_STATES,
  emphasisStates: EXECUTIVE_STAGE_EMPHASIS_STATES,
  reactionKinds: EXECUTIVE_STAGE_REACTION_KINDS,
  placementIntents: EXECUTIVE_STAGE_PLACEMENT_INTENTS,
  interactionKinds: EXECUTIVE_STAGE_INTERACTION_KINDS,
  relationshipKinds: EXECUTIVE_STAGE_RELATIONSHIP_KINDS,
  cameraIntents: EXECUTIVE_STAGE_CAMERA_INTENTS,
  guarantees: EXECUTIVE_STAGE_INTEGRATION_GUARANTEES,
  forbiddenResponsibilities:
    EXECUTIVE_STAGE_INTEGRATION_FORBIDDEN_RESPONSIBILITIES,
  publicApiSurface: executiveStageIntegrationApiNames,
  publicTypes: EXECUTIVE_STAGE_INTEGRATION_PUBLIC_TYPE_NAMES,
  nexCi2Boundary: "NEX-CI:2-shell-runtime-binding-only" as const,
  architecturalStatus:
    "Executive Stage Integration Complete · Deterministic · Immutable · Renderer-Neutral · ReadyForWorkspaceDialCoordination" as const,
});

/**
 * Approved NEX-CI:2 consumer surfaces re-exported for immediate downstream
 * NEX-CI phases (e.g. NEX-CI:4) so they can preserve the dependency chain.
 */
export {
  EXECUTIVE_COCKPIT_SURFACES,
  cockpitShellRuntimeBindingIdentity,
  cockpitShellRuntimeBindingVersion,
  createExecutiveCockpitIntegrationSnapshot,
  doesCockpitSurfaceReceivePropagation,
  executiveCockpitIntegrationFoundationIdentity,
  executiveCockpitIntegrationFoundationVersion,
  getCockpitSurfacePropagationKinds,
  isExecutiveCockpitPresentationState,
  isExecutiveCockpitSurface,
  resolveCockpitShellRuntimeBinding,
  resolveCockpitSurfaceRuntimeContext,
  verifyCockpitShellRuntimeBinding,
  verifyExecutiveCockpitIntegrationFoundation,
} from "@/app/lib/nex-ci/cockpitShellRuntimeBinding";

export type {
  CockpitShellRuntimeSnapshot,
  CockpitSurfaceRuntimeContext,
  ExecutiveCockpitIntegrationStatus,
  ExecutiveCockpitPresentationState,
  ExecutiveCockpitSubjectKind,
  ExecutiveCockpitSubjectReference,
  ExecutiveCockpitSurface,
} from "@/app/lib/nex-ci/cockpitShellRuntimeBinding";
