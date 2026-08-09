/**
 * NEX-CI:5 — Advisor & Insight Integration.
 *
 * Connects Advisor and Insight surfaces to current executive runtime/cockpit
 * context so they become context-aware, deterministic consumers of workspace,
 * subject, Stage, attention, presentation, and transition state.
 *
 * Canonical flow:
 *   Cockpit Runtime Context
 *   → Stage Context
 *   → Workspace Context
 *   → Advisor/Insight Integration
 *   → Advisor Context Snapshot
 *   → Insight Context Snapshot
 *
 * Advisor and Insight remain distinct surfaces and contracts.
 * This phase prepares context only — no AI, network, or content generation.
 *
 * Sole immediate NEX-CI dependency: NEX-CI:4 Workspace Dial Experience Switching.
 */

import {
  workspaceDialExperienceSwitchingIdentity,
  verifyWorkspaceDialExperienceSwitching,
  type ExecutiveCockpitIntegrationStatus,
  type ExecutiveCockpitPresentationState,
  type ExecutiveCockpitSubjectReference,
  type ExecutiveStageAttentionDirective,
  type ExecutiveStageRelationship,
  type ExecutiveStageSubject,
  type ExecutiveWorkspaceExperienceSnapshot,
  type ExecutiveWorkspaceReference,
  type ExecutiveWorkspaceTransitionStatus,
} from "@/app/lib/nex-ci/workspaceDialExperienceSwitching";

// ─── Identity ───────────────────────────────────────────────────────────────

export const advisorInsightIntegrationIdentity =
  "NEX-CI:5/AdvisorInsightIntegration" as const;

export const advisorInsightIntegrationVersion = "1.5.0" as const;

export const advisorInsightIntegrationNamespace =
  "nexora.executive.cockpit.integration.advisor-insight" as const;

export const advisorInsightIntegrationLayer = "NEX-CI" as const;

export const advisorInsightIntegrationPhase =
  "AdvisorInsightIntegration" as const;

export const advisorInsightIntegrationStage =
  "AdvisorInsightIntegration" as const;

export const advisorInsightIntegrationArchitecturalRole =
  "AdvisorInsightIntegration" as const;

export const advisorInsightIntegrationDependencyIdentity =
  workspaceDialExperienceSwitchingIdentity;

export const advisorInsightIntegrationDependencyPath =
  "@/app/lib/nex-ci/workspaceDialExperienceSwitching" as const;

export const advisorInsightIntegrationStability =
  "AdvisorInsightIntegrationReady" as const;

export const advisorInsightIntegrationDeterministic = true as const;

export const advisorInsightIntegrationSideEffectPolicy =
  "side-effect-free" as const;

export const advisorInsightIntegrationMutationPolicy = "immutable" as const;

/**
 * Workspace transition awareness policy:
 * Advisor may enter transition mode while a target workspace is in flight.
 * Insight retains committed-workspace analytical context until completion
 * (target workspace is never treated as committed).
 */
export const EXECUTIVE_ADVISOR_INSIGHT_TRANSITION_AWARENESS_POLICY =
  "advisor-transition-aware·insight-committed-workspace-only" as const;

/**
 * Context subject priority:
 * focused → selected → Stage primary → related
 */
export const EXECUTIVE_CONTEXT_SUBJECT_PRIORITY =
  "focused → selected → primary → related" as const;

export const advisorInsightIntegrationCanonicalIdentity = Object.freeze({
  identity: advisorInsightIntegrationIdentity,
  version: advisorInsightIntegrationVersion,
  namespace: advisorInsightIntegrationNamespace,
  layer: advisorInsightIntegrationLayer,
  phase: advisorInsightIntegrationPhase,
  stage: advisorInsightIntegrationStage,
  architecturalRole: advisorInsightIntegrationArchitecturalRole,
  dependencyIdentity: advisorInsightIntegrationDependencyIdentity,
  dependencyPath: advisorInsightIntegrationDependencyPath,
  stabilityStatus: advisorInsightIntegrationStability,
  deterministicStatus: advisorInsightIntegrationDeterministic,
  sideEffectPolicy: advisorInsightIntegrationSideEffectPolicy,
  mutationPolicy: advisorInsightIntegrationMutationPolicy,
});

export const ADVISOR_INSIGHT_INTEGRATION_PRINCIPLE =
  "Cockpit/Stage/Workspace context → Advisor & Insight context snapshots. Advisor supports guidance; Insight supports observation. Neither owns runtime meaning, AI execution, or Cockpit orchestration." as const;

export const ADVISOR_INSIGHT_INTEGRATION_BOUNDARY = Object.freeze({
  nexCiAuthority: "Executive-Cockpit-Integration" as const,
  advisorAuthority: "Executive-Advisor-Supporting-Surface" as const,
  insightAuthority: "Executive-Insight-Supporting-Surface" as const,
  boundaryAuthority: "NEX-CI:5" as const,
  architecturalRole: "AdvisorInsightIntegration" as const,
  soleImmediateDependency:
    "NEX-CI:4/WorkspaceDialExperienceSwitching" as const,
  consumesNexCi4Only: true as const,
  bypassesIntoNexCi3: false as const,
  bypassesIntoNexCi2: false as const,
  bypassesIntoNexCi1: false as const,
  bypassesIntoRex: false as const,
  bypassesIntoExDri: false as const,
  bypassesIntoDri: false as const,
  bypassesIntoNol: false as const,
  advisorInsightRemainDistinct: true as const,
  ownsAiExecution: false as const,
  ownsContentGeneration: false as const,
  ownsNetworkAccess: false as const,
  ownsCockpitOrchestration: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  intelligenceProviderIndependent: true as const,
  introducesReact: false as const,
  introducesThreeJs: false as const,
  introducesReactThreeFiber: false as const,
  introducesAiSdk: false as const,
  implementsNexCi6: false as const,
  transitionAwarenessPolicy:
    EXECUTIVE_ADVISOR_INSIGHT_TRANSITION_AWARENESS_POLICY,
  contextSubjectPriority: EXECUTIVE_CONTEXT_SUBJECT_PRIORITY,
});

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const EXECUTIVE_ADVISOR_CONTEXT_MODES = Object.freeze([
  "general",
  "workspace",
  "subject",
  "transition",
  "attention",
] as const);

export type ExecutiveAdvisorContextMode =
  (typeof EXECUTIVE_ADVISOR_CONTEXT_MODES)[number];

export const EXECUTIVE_INSIGHT_CONTEXT_MODES = Object.freeze([
  "general",
  "subject",
  "relationship",
  "attention",
  "workspace",
] as const);

export type ExecutiveInsightContextMode =
  (typeof EXECUTIVE_INSIGHT_CONTEXT_MODES)[number];

export const EXECUTIVE_ADVISOR_READINESS_STATES = Object.freeze([
  "ready",
  "limited",
  "unavailable",
] as const);

export type ExecutiveAdvisorReadiness =
  (typeof EXECUTIVE_ADVISOR_READINESS_STATES)[number];

export const EXECUTIVE_INSIGHT_READINESS_STATES = Object.freeze([
  "ready",
  "limited",
  "unavailable",
] as const);

export type ExecutiveInsightReadiness =
  (typeof EXECUTIVE_INSIGHT_READINESS_STATES)[number];

export const EXECUTIVE_CONTEXT_SUBJECT_ROLES = Object.freeze([
  "focused",
  "selected",
  "primary",
  "related",
] as const);

export type ExecutiveContextSubjectRole =
  (typeof EXECUTIVE_CONTEXT_SUBJECT_ROLES)[number];

export interface ExecutiveContextSubject {
  readonly subject: ExecutiveCockpitSubjectReference;
  readonly role: ExecutiveContextSubjectRole;
}

export const EXECUTIVE_ADVISOR_INTEGRATION_REACTION_KINDS = Object.freeze([
  "context-updated",
  "workspace-changed",
  "subject-selected",
  "subject-focused",
  "attention-changed",
  "presentation-changed",
  "transition-started",
  "transition-completed",
] as const);

export type ExecutiveAdvisorIntegrationReactionKind =
  (typeof EXECUTIVE_ADVISOR_INTEGRATION_REACTION_KINDS)[number];

export const EXECUTIVE_INSIGHT_INTEGRATION_REACTION_KINDS = Object.freeze([
  "context-updated",
  "workspace-changed",
  "subject-selected",
  "subject-focused",
  "relationship-changed",
  "attention-changed",
  "presentation-changed",
] as const);

export type ExecutiveInsightIntegrationReactionKind =
  (typeof EXECUTIVE_INSIGHT_INTEGRATION_REACTION_KINDS)[number];

export interface ExecutiveAdvisorIntegrationReaction {
  readonly kind: ExecutiveAdvisorIntegrationReactionKind;
  readonly subjectId?: string;
  readonly priority: number;
}

export interface ExecutiveInsightIntegrationReaction {
  readonly kind: ExecutiveInsightIntegrationReactionKind;
  readonly subjectId?: string;
  readonly priority: number;
}

export interface ExecutiveAdvisorAttentionContext {
  readonly directives: readonly ExecutiveStageAttentionDirective[];
  readonly primaryAttentionSubjectId?: string;
}

export interface ExecutiveInsightAttentionContext {
  readonly directives: readonly ExecutiveStageAttentionDirective[];
  readonly primaryAttentionSubjectId?: string;
}

export interface ExecutiveAdvisorContext {
  readonly workspace?: ExecutiveWorkspaceReference;
  readonly targetWorkspace?: ExecutiveWorkspaceReference;
  readonly selectedSubject?: ExecutiveCockpitSubjectReference;
  readonly focusedSubject?: ExecutiveCockpitSubjectReference;
  readonly primaryStageSubject?: ExecutiveStageSubject;
  readonly presentationState?: ExecutiveCockpitPresentationState;
  readonly attention: readonly ExecutiveStageAttentionDirective[];
  readonly relationships: readonly ExecutiveStageRelationship[];
  readonly transitionStatus?: ExecutiveWorkspaceTransitionStatus;
  readonly status: ExecutiveCockpitIntegrationStatus;
}

export interface ExecutiveInsightContext {
  readonly workspace?: ExecutiveWorkspaceReference;
  readonly selectedSubject?: ExecutiveCockpitSubjectReference;
  readonly focusedSubject?: ExecutiveCockpitSubjectReference;
  readonly primaryStageSubject?: ExecutiveStageSubject;
  readonly presentationState?: ExecutiveCockpitPresentationState;
  readonly attention: readonly ExecutiveStageAttentionDirective[];
  readonly relationships: readonly ExecutiveStageRelationship[];
  readonly status: ExecutiveCockpitIntegrationStatus;
}

export interface ExecutiveAdvisorContextSnapshot {
  readonly context: ExecutiveAdvisorContext;
  readonly mode: ExecutiveAdvisorContextMode;
  readonly readiness: ExecutiveAdvisorReadiness;
  readonly subjects: readonly ExecutiveContextSubject[];
  readonly attentionContext: ExecutiveAdvisorAttentionContext;
}

export interface ExecutiveInsightContextSnapshot {
  readonly context: ExecutiveInsightContext;
  readonly mode: ExecutiveInsightContextMode;
  readonly readiness: ExecutiveInsightReadiness;
  readonly subjects: readonly ExecutiveContextSubject[];
  readonly attentionContext: ExecutiveInsightAttentionContext;
}

export interface ExecutiveAdvisorInsightIntegrationSnapshot {
  readonly experience: ExecutiveWorkspaceExperienceSnapshot;
  readonly advisor: ExecutiveAdvisorContextSnapshot;
  readonly insight: ExecutiveInsightContextSnapshot;
  readonly integrationIdentity: typeof advisorInsightIntegrationIdentity;
  readonly integrationVersion: typeof advisorInsightIntegrationVersion;
}

export interface ExecutiveAdvisorGuidanceIntent {
  readonly source: "advisor";
  readonly contextMode: ExecutiveAdvisorContextMode;
  readonly subjectId?: string;
}

export interface ExecutiveInsightRequestIntent {
  readonly source: "insight";
  readonly contextMode: ExecutiveInsightContextMode;
  readonly subjectId?: string;
}

export interface ExecutiveAdvisorInsightTransitionResult {
  readonly advisorReactions: readonly ExecutiveAdvisorIntegrationReaction[];
  readonly insightReactions: readonly ExecutiveInsightIntegrationReaction[];
}

// ─── Guarantees / forbidden ─────────────────────────────────────────────────

export const ADVISOR_INSIGHT_INTEGRATION_GUARANTEES = Object.freeze([
  Object.freeze({
    id: "nex-ci-4-sole-immediate-dependency",
    order: 1,
    statement: "NEX-CI:5 immediately depends on NEX-CI:4 only.",
  }),
  Object.freeze({
    id: "advisor-insight-remain-separate-surfaces",
    order: 2,
    statement: "Advisor and Insight remain separate surfaces.",
  }),
  Object.freeze({
    id: "advisor-insight-contexts-remain-separate",
    order: 3,
    statement: "Advisor context and Insight context remain separate contracts.",
  }),
  Object.freeze({
    id: "focus-selection-remain-distinct",
    order: 4,
    statement: "Focus and selection remain distinct.",
  }),
  Object.freeze({
    id: "workspace-current-target-preserved",
    order: 5,
    statement: "Workspace current/target distinction is preserved.",
  }),
  Object.freeze({
    id: "target-not-treated-as-committed",
    order: 6,
    statement: "Target workspace is not treated as committed.",
  }),
  Object.freeze({
    id: "context-subject-ordering-deterministic",
    order: 7,
    statement: "Context subject ordering is deterministic.",
  }),
  Object.freeze({
    id: "context-subjects-deduplicated",
    order: 8,
    statement: "Context subjects are deduplicated.",
  }),
  Object.freeze({
    id: "no-fabricated-subjects",
    order: 9,
    statement: "No fabricated subjects are created.",
  }),
  Object.freeze({
    id: "no-fabricated-relationships",
    order: 10,
    statement: "No fabricated relationships are created.",
  }),
  Object.freeze({
    id: "attention-reuses-upstream",
    order: 11,
    statement: "Attention reuses upstream semantics.",
  }),
  Object.freeze({
    id: "presentation-reuses-canonical",
    order: 12,
    statement: "Presentation state reuses canonical Minimum/Report/Operation.",
  }),
  Object.freeze({
    id: "advisor-readiness-deterministic",
    order: 13,
    statement: "Advisor readiness resolves deterministically.",
  }),
  Object.freeze({
    id: "insight-readiness-deterministic",
    order: 14,
    statement: "Insight readiness resolves deterministically.",
  }),
  Object.freeze({
    id: "advisor-mode-deterministic",
    order: 15,
    statement: "Advisor mode resolves deterministically.",
  }),
  Object.freeze({
    id: "insight-mode-deterministic",
    order: 16,
    statement: "Insight mode resolves deterministically.",
  }),
  Object.freeze({
    id: "advisor-reaction-ordering-deterministic",
    order: 17,
    statement: "Advisor reaction ordering is deterministic.",
  }),
  Object.freeze({
    id: "insight-reaction-ordering-deterministic",
    order: 18,
    statement: "Insight reaction ordering is deterministic.",
  }),
  Object.freeze({
    id: "inputs-not-mutated",
    order: 19,
    statement: "Input snapshots are not mutated.",
  }),
  Object.freeze({
    id: "no-react-dependency",
    order: 20,
    statement: "No React dependency exists.",
  }),
  Object.freeze({
    id: "no-threejs-dependency",
    order: 21,
    statement: "No Three.js dependency exists.",
  }),
  Object.freeze({
    id: "no-ai-sdk-dependency",
    order: 22,
    statement: "No AI SDK dependency exists.",
  }),
  Object.freeze({
    id: "no-network-calls",
    order: 23,
    statement: "No network calls occur.",
  }),
  Object.freeze({
    id: "no-content-generation",
    order: 24,
    statement: "No content generation occurs.",
  }),
  Object.freeze({
    id: "no-cockpit-global-mutation",
    order: 25,
    statement: "No Cockpit global mutation occurs.",
  }),
  Object.freeze({
    id: "no-nex-ci-6-orchestration",
    order: 26,
    statement: "No NEX-CI:6 orchestration behavior is implemented.",
  }),
] as const);

export type AdvisorInsightIntegrationGuarantee =
  (typeof ADVISOR_INSIGHT_INTEGRATION_GUARANTEES)[number];

export const ADVISOR_INSIGHT_INTEGRATION_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "React components",
    "React hooks",
    "Three.js",
    "React Three Fiber",
    "OpenAI SDK",
    "Anthropic SDK",
    "Gemini SDK",
    "LLM clients",
    "prompt runners",
    "agent frameworks",
    "network requests",
    "streaming responses",
    "chat history",
    "message persistence",
    "Advisor content generation",
    "Insight content generation",
    "Stage rendering",
    "Dial rendering",
    "Timeline replay",
    "Explorer workflows",
    "Live Lens behavior",
    "Cockpit interaction orchestration",
    "NEX-CI:6 Cockpit Interaction Orchestration",
  ] as const);

// ─── Guards / getters ───────────────────────────────────────────────────────

export function isExecutiveAdvisorContextMode(
  value: unknown,
): value is ExecutiveAdvisorContextMode {
  return (EXECUTIVE_ADVISOR_CONTEXT_MODES as readonly unknown[]).includes(
    value,
  );
}

export function isExecutiveInsightContextMode(
  value: unknown,
): value is ExecutiveInsightContextMode {
  return (EXECUTIVE_INSIGHT_CONTEXT_MODES as readonly unknown[]).includes(
    value,
  );
}

export function isExecutiveAdvisorReadiness(
  value: unknown,
): value is ExecutiveAdvisorReadiness {
  return (EXECUTIVE_ADVISOR_READINESS_STATES as readonly unknown[]).includes(
    value,
  );
}

export function isExecutiveInsightReadiness(
  value: unknown,
): value is ExecutiveInsightReadiness {
  return (EXECUTIVE_INSIGHT_READINESS_STATES as readonly unknown[]).includes(
    value,
  );
}

export function isExecutiveContextSubjectRole(
  value: unknown,
): value is ExecutiveContextSubjectRole {
  return (EXECUTIVE_CONTEXT_SUBJECT_ROLES as readonly unknown[]).includes(
    value,
  );
}

export function isExecutiveAdvisorIntegrationReactionKind(
  value: unknown,
): value is ExecutiveAdvisorIntegrationReactionKind {
  return (
    EXECUTIVE_ADVISOR_INTEGRATION_REACTION_KINDS as readonly unknown[]
  ).includes(value);
}

export function isExecutiveInsightIntegrationReactionKind(
  value: unknown,
): value is ExecutiveInsightIntegrationReactionKind {
  return (
    EXECUTIVE_INSIGHT_INTEGRATION_REACTION_KINDS as readonly unknown[]
  ).includes(value);
}

export function getAdvisorInsightIntegrationIdentity():
  typeof advisorInsightIntegrationCanonicalIdentity {
  return advisorInsightIntegrationCanonicalIdentity;
}

export function getExecutiveAdvisorContextModes(): ReadonlyArray<
  ExecutiveAdvisorContextMode
> {
  return EXECUTIVE_ADVISOR_CONTEXT_MODES;
}

export function getExecutiveInsightContextModes(): ReadonlyArray<
  ExecutiveInsightContextMode
> {
  return EXECUTIVE_INSIGHT_CONTEXT_MODES;
}

export function getExecutiveAdvisorReadinessStates(): ReadonlyArray<
  ExecutiveAdvisorReadiness
> {
  return EXECUTIVE_ADVISOR_READINESS_STATES;
}

export function getExecutiveInsightReadinessStates(): ReadonlyArray<
  ExecutiveInsightReadiness
> {
  return EXECUTIVE_INSIGHT_READINESS_STATES;
}

export function getExecutiveContextSubjectRoles(): ReadonlyArray<
  ExecutiveContextSubjectRole
> {
  return EXECUTIVE_CONTEXT_SUBJECT_ROLES;
}

export function getExecutiveAdvisorIntegrationReactionKinds(): ReadonlyArray<
  ExecutiveAdvisorIntegrationReactionKind
> {
  return EXECUTIVE_ADVISOR_INTEGRATION_REACTION_KINDS;
}

export function getExecutiveInsightIntegrationReactionKinds(): ReadonlyArray<
  ExecutiveInsightIntegrationReactionKind
> {
  return EXECUTIVE_INSIGHT_INTEGRATION_REACTION_KINDS;
}

// ─── Projection helpers ─────────────────────────────────────────────────────

function freezeSubject(
  subject: ExecutiveCockpitSubjectReference,
): ExecutiveCockpitSubjectReference {
  return Object.freeze({
    id: subject.id,
    kind: subject.kind,
  });
}

function stageSubjectToReference(
  subject: ExecutiveStageSubject,
): ExecutiveCockpitSubjectReference {
  return freezeSubject({ id: subject.id, kind: subject.kind });
}

const ROLE_PRECEDENCE: Record<ExecutiveContextSubjectRole, number> = {
  focused: 0,
  selected: 1,
  primary: 2,
  related: 3,
};

function compareContextSubjects(
  a: ExecutiveContextSubject,
  b: ExecutiveContextSubject,
): number {
  const roleDiff = ROLE_PRECEDENCE[a.role] - ROLE_PRECEDENCE[b.role];
  if (roleDiff !== 0) {
    return roleDiff;
  }
  return a.subject.id < b.subject.id
    ? -1
    : a.subject.id > b.subject.id
      ? 1
      : 0;
}

function compareAttention(
  a: ExecutiveStageAttentionDirective,
  b: ExecutiveStageAttentionDirective,
): number {
  const levelOrder = {
    primary: 0,
    secondary: 1,
    context: 2,
    background: 3,
  } as const;
  const levelDiff = levelOrder[a.level] - levelOrder[b.level];
  if (levelDiff !== 0) {
    return levelDiff;
  }
  return a.subjectId < b.subjectId
    ? -1
    : a.subjectId > b.subjectId
      ? 1
      : 0;
}

function compareRelationships(
  a: ExecutiveStageRelationship,
  b: ExecutiveStageRelationship,
): number {
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

function isTransitionInFlight(
  experience: ExecutiveWorkspaceExperienceSnapshot,
): boolean {
  const status = experience.transition?.status;
  return (
    status === "planned" ||
    status === "starting" ||
    status === "transitioning"
  );
}

function surfaceState(
  experience: ExecutiveWorkspaceExperienceSnapshot,
  surface: "advisor" | "insight",
) {
  return experience.cockpit.surfaces.find((entry) => entry.surface === surface);
}

function projectAttention(
  experience: ExecutiveWorkspaceExperienceSnapshot,
): ExecutiveAdvisorAttentionContext {
  const directives = Object.freeze(
    [...experience.stage.attention].sort(compareAttention),
  );
  const primary = directives.find((directive) => directive.level === "primary");
  return Object.freeze({
    directives,
    ...(primary !== undefined
      ? { primaryAttentionSubjectId: primary.subjectId }
      : {}),
  });
}

function projectRelationships(
  experience: ExecutiveWorkspaceExperienceSnapshot,
): readonly ExecutiveStageRelationship[] {
  const focusedId = experience.cockpit.binding.focusedSubject?.id;
  const selectedId = experience.cockpit.binding.selectedSubject?.id;
  const primaryId = experience.stage.primarySubject?.id;
  const anchorId = focusedId ?? selectedId ?? primaryId;
  const all = experience.stage.relationships;

  if (anchorId === undefined) {
    return Object.freeze([]);
  }

  return Object.freeze(
    all
      .filter(
        (relationship) =>
          relationship.visible &&
          (relationship.sourceSubjectId === anchorId ||
            relationship.targetSubjectId === anchorId),
      )
      .sort(compareRelationships),
  );
}

export function resolveExecutiveContextSubjects(
  experience: ExecutiveWorkspaceExperienceSnapshot,
): ReadonlyArray<ExecutiveContextSubject> {
  const byId = new Map<string, ExecutiveContextSubject>();

  const assign = (
    subject: ExecutiveCockpitSubjectReference | undefined,
    role: ExecutiveContextSubjectRole,
  ): void => {
    if (subject === undefined) {
      return;
    }
    const existing = byId.get(subject.id);
    if (
      existing === undefined ||
      ROLE_PRECEDENCE[role] < ROLE_PRECEDENCE[existing.role]
    ) {
      byId.set(
        subject.id,
        Object.freeze({
          subject: freezeSubject(subject),
          role,
        }),
      );
    }
  };

  assign(experience.cockpit.binding.focusedSubject, "focused");
  assign(experience.cockpit.binding.selectedSubject, "selected");
  if (experience.stage.primarySubject !== undefined) {
    assign(
      stageSubjectToReference(experience.stage.primarySubject),
      "primary",
    );
  }

  const anchorId =
    experience.cockpit.binding.focusedSubject?.id ??
    experience.cockpit.binding.selectedSubject?.id ??
    experience.stage.primarySubject?.id;

  if (anchorId !== undefined) {
    for (const relationship of experience.stage.relationships) {
      if (!relationship.visible) {
        continue;
      }
      const otherId =
        relationship.sourceSubjectId === anchorId
          ? relationship.targetSubjectId
          : relationship.targetSubjectId === anchorId
            ? relationship.sourceSubjectId
            : undefined;
      if (otherId === undefined || byId.has(otherId)) {
        continue;
      }
      const stageSubject = experience.stage.subjects.find(
        (subject) => subject.id === otherId,
      );
      if (stageSubject !== undefined) {
        assign(stageSubjectToReference(stageSubject), "related");
      }
    }
  }

  return Object.freeze(
    [...byId.values()].sort(compareContextSubjects),
  );
}

export function resolveExecutiveAdvisorContext(
  experience: ExecutiveWorkspaceExperienceSnapshot,
): ExecutiveAdvisorContext {
  const attention = projectAttention(experience).directives;
  const relationships = projectRelationships(experience);
  const transitionInFlight = isTransitionInFlight(experience);

  return Object.freeze({
    attention,
    relationships,
    status: experience.cockpit.binding.integrationStatus,
    ...(experience.currentWorkspace !== undefined
      ? { workspace: experience.currentWorkspace }
      : {}),
    ...(transitionInFlight && experience.targetWorkspace !== undefined
      ? { targetWorkspace: experience.targetWorkspace }
      : {}),
    ...(experience.cockpit.binding.selectedSubject !== undefined
      ? {
          selectedSubject: freezeSubject(
            experience.cockpit.binding.selectedSubject,
          ),
        }
      : {}),
    ...(experience.cockpit.binding.focusedSubject !== undefined
      ? {
          focusedSubject: freezeSubject(
            experience.cockpit.binding.focusedSubject,
          ),
        }
      : {}),
    ...(experience.stage.primarySubject !== undefined
      ? { primaryStageSubject: experience.stage.primarySubject }
      : {}),
    ...(experience.cockpit.binding.presentationState !== undefined
      ? { presentationState: experience.cockpit.binding.presentationState }
      : {}),
    ...(experience.transition !== undefined
      ? { transitionStatus: experience.transition.status }
      : {}),
  });
}

export function resolveExecutiveInsightContext(
  experience: ExecutiveWorkspaceExperienceSnapshot,
): ExecutiveInsightContext {
  const attention = projectAttention(experience).directives;
  const relationships = projectRelationships(experience);

  // Insight never treats target workspace as committed.
  return Object.freeze({
    attention,
    relationships,
    status: experience.cockpit.binding.integrationStatus,
    ...(experience.currentWorkspace !== undefined
      ? { workspace: experience.currentWorkspace }
      : {}),
    ...(experience.cockpit.binding.selectedSubject !== undefined
      ? {
          selectedSubject: freezeSubject(
            experience.cockpit.binding.selectedSubject,
          ),
        }
      : {}),
    ...(experience.cockpit.binding.focusedSubject !== undefined
      ? {
          focusedSubject: freezeSubject(
            experience.cockpit.binding.focusedSubject,
          ),
        }
      : {}),
    ...(experience.stage.primarySubject !== undefined
      ? { primaryStageSubject: experience.stage.primarySubject }
      : {}),
    ...(experience.cockpit.binding.presentationState !== undefined
      ? { presentationState: experience.cockpit.binding.presentationState }
      : {}),
  });
}

export function resolveExecutiveAdvisorContextMode(
  experience: ExecutiveWorkspaceExperienceSnapshot,
  context: ExecutiveAdvisorContext = resolveExecutiveAdvisorContext(experience),
): ExecutiveAdvisorContextMode {
  if (
    context.transitionStatus === "planned" ||
    context.transitionStatus === "starting" ||
    context.transitionStatus === "transitioning"
  ) {
    return "transition";
  }
  if (
    context.focusedSubject !== undefined ||
    context.selectedSubject !== undefined
  ) {
    return "subject";
  }
  if (
    context.attention.some((directive) => directive.level === "primary") ||
    context.attention.length >= 2
  ) {
    return "attention";
  }
  if (context.workspace !== undefined) {
    return "workspace";
  }
  return "general";
}

export function resolveExecutiveInsightContextMode(
  experience: ExecutiveWorkspaceExperienceSnapshot,
  context: ExecutiveInsightContext = resolveExecutiveInsightContext(experience),
): ExecutiveInsightContextMode {
  const hasSubject =
    context.focusedSubject !== undefined ||
    context.selectedSubject !== undefined;
  if (hasSubject && context.relationships.length > 0) {
    return "relationship";
  }
  if (hasSubject) {
    return "subject";
  }
  if (
    context.attention.some((directive) => directive.level === "primary") ||
    context.attention.length >= 2
  ) {
    return "attention";
  }
  if (context.workspace !== undefined) {
    return "workspace";
  }
  return "general";
}

export function resolveExecutiveAdvisorReadiness(
  experience: ExecutiveWorkspaceExperienceSnapshot,
  context: ExecutiveAdvisorContext = resolveExecutiveAdvisorContext(experience),
): ExecutiveAdvisorReadiness {
  const surface = surfaceState(experience, "advisor");
  if (
    experience.cockpit.binding.integrationStatus === "unavailable" ||
    surface?.available === false ||
    surface?.enabled === false
  ) {
    return "unavailable";
  }

  const hasSubject =
    context.focusedSubject !== undefined ||
    context.selectedSubject !== undefined ||
    context.primaryStageSubject !== undefined;
  const hasWorkspace = context.workspace !== undefined;

  if (hasSubject || (hasWorkspace && context.attention.length > 0)) {
    return "ready";
  }
  if (hasWorkspace || context.attention.length > 0) {
    return "limited";
  }
  return "limited";
}

export function resolveExecutiveInsightReadiness(
  experience: ExecutiveWorkspaceExperienceSnapshot,
  context: ExecutiveInsightContext = resolveExecutiveInsightContext(experience),
): ExecutiveInsightReadiness {
  const surface = surfaceState(experience, "insight");
  if (
    experience.cockpit.binding.integrationStatus === "unavailable" ||
    surface?.available === false ||
    surface?.enabled === false
  ) {
    return "unavailable";
  }

  const hasSubject =
    context.focusedSubject !== undefined ||
    context.selectedSubject !== undefined ||
    context.primaryStageSubject !== undefined;
  const hasWorkspace = context.workspace !== undefined;

  if (
    hasSubject ||
    context.relationships.length > 0 ||
    (hasWorkspace && context.attention.length > 0)
  ) {
    return "ready";
  }
  if (hasWorkspace || context.attention.length > 0) {
    return "limited";
  }
  return "limited";
}

function sortReactions<T extends { readonly priority: number; readonly kind: string; readonly subjectId?: string }>(
  reactions: T[],
): readonly T[] {
  return Object.freeze(
    reactions.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      if (a.kind !== b.kind) {
        return a.kind < b.kind ? -1 : 1;
      }
      const aId = a.subjectId ?? "";
      const bId = b.subjectId ?? "";
      return aId < bId ? -1 : aId > bId ? 1 : 0;
    }),
  );
}

export function resolveExecutiveAdvisorIntegrationReactions(
  previous: ExecutiveAdvisorContextSnapshot | undefined,
  next: ExecutiveAdvisorContextSnapshot,
): ReadonlyArray<ExecutiveAdvisorIntegrationReaction> {
  const reactions: ExecutiveAdvisorIntegrationReaction[] = [];
  let priority = 1;

  if (previous === undefined) {
    return Object.freeze([
      Object.freeze({
        kind: "context-updated" as const,
        priority: 1,
      }),
    ]);
  }

  const prev = previous.context;
  const curr = next.context;

  if (prev.workspace?.id !== curr.workspace?.id) {
    reactions.push(
      Object.freeze({
        kind: "workspace-changed" as const,
        priority: priority++,
      }),
    );
  }

  if (prev.selectedSubject?.id !== curr.selectedSubject?.id) {
    reactions.push(
      Object.freeze({
        kind: "subject-selected" as const,
        subjectId: curr.selectedSubject?.id,
        priority: priority++,
      }),
    );
  }

  if (prev.focusedSubject?.id !== curr.focusedSubject?.id) {
    reactions.push(
      Object.freeze({
        kind: "subject-focused" as const,
        subjectId: curr.focusedSubject?.id,
        priority: priority++,
      }),
    );
  }

  const prevAttention = prev.attention.map((d) => d.subjectId).join("|");
  const nextAttention = curr.attention.map((d) => d.subjectId).join("|");
  if (prevAttention !== nextAttention) {
    reactions.push(
      Object.freeze({
        kind: "attention-changed" as const,
        subjectId: next.attentionContext.primaryAttentionSubjectId,
        priority: priority++,
      }),
    );
  }

  if (prev.presentationState !== curr.presentationState) {
    reactions.push(
      Object.freeze({
        kind: "presentation-changed" as const,
        priority: priority++,
      }),
    );
  }

  const prevTransition = prev.transitionStatus;
  const nextTransition = curr.transitionStatus;
  const prevInFlight =
    prevTransition === "planned" ||
    prevTransition === "starting" ||
    prevTransition === "transitioning";
  const nextInFlight =
    nextTransition === "planned" ||
    nextTransition === "starting" ||
    nextTransition === "transitioning";

  if (!prevInFlight && nextInFlight) {
    reactions.push(
      Object.freeze({
        kind: "transition-started" as const,
        priority: priority++,
      }),
    );
  }
  if (prevInFlight && nextTransition === "completed") {
    reactions.push(
      Object.freeze({
        kind: "transition-completed" as const,
        priority: priority++,
      }),
    );
  }

  if (reactions.length > 0) {
    reactions.unshift(
      Object.freeze({
        kind: "context-updated" as const,
        priority: 0,
      }),
    );
  }

  return sortReactions(reactions);
}

export function resolveExecutiveInsightIntegrationReactions(
  previous: ExecutiveInsightContextSnapshot | undefined,
  next: ExecutiveInsightContextSnapshot,
): ReadonlyArray<ExecutiveInsightIntegrationReaction> {
  const reactions: ExecutiveInsightIntegrationReaction[] = [];
  let priority = 1;

  if (previous === undefined) {
    return Object.freeze([
      Object.freeze({
        kind: "context-updated" as const,
        priority: 1,
      }),
    ]);
  }

  const prev = previous.context;
  const curr = next.context;

  if (prev.workspace?.id !== curr.workspace?.id) {
    reactions.push(
      Object.freeze({
        kind: "workspace-changed" as const,
        priority: priority++,
      }),
    );
  }

  if (prev.selectedSubject?.id !== curr.selectedSubject?.id) {
    reactions.push(
      Object.freeze({
        kind: "subject-selected" as const,
        subjectId: curr.selectedSubject?.id,
        priority: priority++,
      }),
    );
  }

  if (prev.focusedSubject?.id !== curr.focusedSubject?.id) {
    reactions.push(
      Object.freeze({
        kind: "subject-focused" as const,
        subjectId: curr.focusedSubject?.id,
        priority: priority++,
      }),
    );
  }

  const prevRels = prev.relationships.map((r) => r.id).join("|");
  const nextRels = curr.relationships.map((r) => r.id).join("|");
  if (prevRels !== nextRels) {
    reactions.push(
      Object.freeze({
        kind: "relationship-changed" as const,
        priority: priority++,
      }),
    );
  }

  const prevAttention = prev.attention.map((d) => d.subjectId).join("|");
  const nextAttention = curr.attention.map((d) => d.subjectId).join("|");
  if (prevAttention !== nextAttention) {
    reactions.push(
      Object.freeze({
        kind: "attention-changed" as const,
        subjectId: next.attentionContext.primaryAttentionSubjectId,
        priority: priority++,
      }),
    );
  }

  if (prev.presentationState !== curr.presentationState) {
    reactions.push(
      Object.freeze({
        kind: "presentation-changed" as const,
        priority: priority++,
      }),
    );
  }

  if (reactions.length > 0) {
    reactions.unshift(
      Object.freeze({
        kind: "context-updated" as const,
        priority: 0,
      }),
    );
  }

  return sortReactions(reactions);
}

export function createExecutiveAdvisorGuidanceIntent(
  contextMode: ExecutiveAdvisorContextMode,
  subjectId?: string,
): ExecutiveAdvisorGuidanceIntent {
  if (!isExecutiveAdvisorContextMode(contextMode)) {
    throw new TypeError("contextMode must be a known advisor context mode");
  }
  if (subjectId !== undefined && subjectId.length === 0) {
    throw new TypeError("subjectId must be non-empty when provided");
  }
  return Object.freeze({
    source: "advisor" as const,
    contextMode,
    ...(subjectId !== undefined ? { subjectId } : {}),
  });
}

export function createExecutiveInsightRequestIntent(
  contextMode: ExecutiveInsightContextMode,
  subjectId?: string,
): ExecutiveInsightRequestIntent {
  if (!isExecutiveInsightContextMode(contextMode)) {
    throw new TypeError("contextMode must be a known insight context mode");
  }
  if (subjectId !== undefined && subjectId.length === 0) {
    throw new TypeError("subjectId must be non-empty when provided");
  }
  return Object.freeze({
    source: "insight" as const,
    contextMode,
    ...(subjectId !== undefined ? { subjectId } : {}),
  });
}

export function resolveExecutiveAdvisorInsightIntegration(
  experience: ExecutiveWorkspaceExperienceSnapshot,
): ExecutiveAdvisorInsightIntegrationSnapshot {
  const subjects = resolveExecutiveContextSubjects(experience);
  const attentionContext = projectAttention(experience);

  const advisorContext = resolveExecutiveAdvisorContext(experience);
  const insightContext = resolveExecutiveInsightContext(experience);

  const advisor = Object.freeze({
    context: advisorContext,
    mode: resolveExecutiveAdvisorContextMode(experience, advisorContext),
    readiness: resolveExecutiveAdvisorReadiness(experience, advisorContext),
    subjects,
    attentionContext,
  });

  const insight = Object.freeze({
    context: insightContext,
    mode: resolveExecutiveInsightContextMode(experience, insightContext),
    readiness: resolveExecutiveInsightReadiness(experience, insightContext),
    subjects,
    attentionContext: Object.freeze({
      directives: attentionContext.directives,
      ...(attentionContext.primaryAttentionSubjectId !== undefined
        ? {
            primaryAttentionSubjectId:
              attentionContext.primaryAttentionSubjectId,
          }
        : {}),
    }),
  });

  return Object.freeze({
    experience,
    advisor,
    insight,
    integrationIdentity: advisorInsightIntegrationIdentity,
    integrationVersion: advisorInsightIntegrationVersion,
  });
}

export function resolveExecutiveAdvisorInsightTransition(
  previous: ExecutiveAdvisorInsightIntegrationSnapshot | undefined,
  next: ExecutiveAdvisorInsightIntegrationSnapshot,
): ExecutiveAdvisorInsightTransitionResult {
  return Object.freeze({
    advisorReactions: resolveExecutiveAdvisorIntegrationReactions(
      previous?.advisor,
      next.advisor,
    ),
    insightReactions: resolveExecutiveInsightIntegrationReactions(
      previous?.insight,
      next.insight,
    ),
  });
}

// ─── Validation ─────────────────────────────────────────────────────────────

export interface ExecutiveAdvisorInsightIntegrationValidation {
  readonly ok: boolean;
  readonly identity: typeof advisorInsightIntegrationIdentity;
  readonly version: typeof advisorInsightIntegrationVersion;
  readonly namespace: typeof advisorInsightIntegrationNamespace;
  readonly phase: typeof advisorInsightIntegrationPhase;
  readonly architecturalRole: typeof advisorInsightIntegrationArchitecturalRole;
  readonly dependencyIdentity: typeof advisorInsightIntegrationDependencyIdentity;
  readonly advisorModeCount: number;
  readonly insightModeCount: number;
  readonly advisorReadinessCount: number;
  readonly insightReadinessCount: number;
  readonly subjectRoleCount: number;
  readonly advisorReactionKindCount: number;
  readonly insightReactionKindCount: number;
  readonly guaranteeCount: number;
  readonly invariantCount: number;
  readonly workspaceDialOk: boolean;
  readonly frozen: boolean;
  readonly advisorInsightDistinct: boolean;
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

export function validateExecutiveAdvisorInsightIntegration(
  snapshot?: ExecutiveAdvisorInsightIntegrationSnapshot,
): ExecutiveAdvisorInsightIntegrationValidation {
  const workspaceDial = verifyWorkspaceDialExperienceSwitching();

  const identityOk =
    advisorInsightIntegrationIdentity ===
      "NEX-CI:5/AdvisorInsightIntegration" &&
    advisorInsightIntegrationVersion === "1.5.0" &&
    advisorInsightIntegrationNamespace ===
      "nexora.executive.cockpit.integration.advisor-insight" &&
    advisorInsightIntegrationPhase === "AdvisorInsightIntegration" &&
    advisorInsightIntegrationArchitecturalRole ===
      "AdvisorInsightIntegration" &&
    advisorInsightIntegrationDependencyIdentity ===
      "NEX-CI:4/WorkspaceDialExperienceSwitching" &&
    advisorInsightIntegrationDependencyIdentity ===
      workspaceDialExperienceSwitchingIdentity &&
    ADVISOR_INSIGHT_INTEGRATION_BOUNDARY.consumesNexCi4Only === true &&
    ADVISOR_INSIGHT_INTEGRATION_BOUNDARY.advisorInsightRemainDistinct === true;

  const vocabularyOk =
    exactOrder(EXECUTIVE_ADVISOR_CONTEXT_MODES, [
      "general",
      "workspace",
      "subject",
      "transition",
      "attention",
    ]) &&
    exactOrder(EXECUTIVE_INSIGHT_CONTEXT_MODES, [
      "general",
      "subject",
      "relationship",
      "attention",
      "workspace",
    ]) &&
    exactOrder(EXECUTIVE_ADVISOR_READINESS_STATES, [
      "ready",
      "limited",
      "unavailable",
    ]) &&
    exactOrder(EXECUTIVE_INSIGHT_READINESS_STATES, [
      "ready",
      "limited",
      "unavailable",
    ]) &&
    exactOrder(EXECUTIVE_CONTEXT_SUBJECT_ROLES, [
      "focused",
      "selected",
      "primary",
      "related",
    ]) &&
    unique([...EXECUTIVE_ADVISOR_CONTEXT_MODES]) &&
    unique([...EXECUTIVE_INSIGHT_CONTEXT_MODES]) &&
    unique([...EXECUTIVE_ADVISOR_INTEGRATION_REACTION_KINDS]) &&
    unique([...EXECUTIVE_INSIGHT_INTEGRATION_REACTION_KINDS]);

  let snapshotOk = true;
  let advisorInsightDistinct = true;
  if (snapshot !== undefined) {
    const subjectIds = snapshot.advisor.subjects.map(
      (entry) => entry.subject.id,
    );
    advisorInsightDistinct =
      snapshot.advisor !== snapshot.insight &&
      snapshot.advisor.context !== snapshot.insight.context &&
      !("targetWorkspace" in snapshot.insight.context) &&
      !("transitionStatus" in snapshot.insight.context);

    snapshotOk =
      Object.isFrozen(snapshot) &&
      Object.isFrozen(snapshot.advisor) &&
      Object.isFrozen(snapshot.insight) &&
      Object.isFrozen(snapshot.advisor.context) &&
      Object.isFrozen(snapshot.insight.context) &&
      Object.isFrozen(snapshot.advisor.subjects) &&
      Object.isFrozen(snapshot.insight.subjects) &&
      unique(subjectIds) &&
      isExecutiveAdvisorContextMode(snapshot.advisor.mode) &&
      isExecutiveInsightContextMode(snapshot.insight.mode) &&
      isExecutiveAdvisorReadiness(snapshot.advisor.readiness) &&
      isExecutiveInsightReadiness(snapshot.insight.readiness) &&
      snapshot.advisor.subjects.every(
        (entry) =>
          isExecutiveContextSubjectRole(entry.role) && Object.isFrozen(entry),
      ) &&
      (snapshot.advisor.context.targetWorkspace === undefined ||
        snapshot.advisor.context.workspace === undefined ||
        snapshot.advisor.context.targetWorkspace.id !==
          snapshot.advisor.context.workspace.id ||
        snapshot.advisor.context.transitionStatus === "completed") &&
      snapshot.integrationIdentity === advisorInsightIntegrationIdentity;
  }

  const guaranteesOk =
    ADVISOR_INSIGHT_INTEGRATION_GUARANTEES.length === 26 &&
    exactOrder(
      ADVISOR_INSIGHT_INTEGRATION_GUARANTEES.map((entry) => entry.id),
      [
        "nex-ci-4-sole-immediate-dependency",
        "advisor-insight-remain-separate-surfaces",
        "advisor-insight-contexts-remain-separate",
        "focus-selection-remain-distinct",
        "workspace-current-target-preserved",
        "target-not-treated-as-committed",
        "context-subject-ordering-deterministic",
        "context-subjects-deduplicated",
        "no-fabricated-subjects",
        "no-fabricated-relationships",
        "attention-reuses-upstream",
        "presentation-reuses-canonical",
        "advisor-readiness-deterministic",
        "insight-readiness-deterministic",
        "advisor-mode-deterministic",
        "insight-mode-deterministic",
        "advisor-reaction-ordering-deterministic",
        "insight-reaction-ordering-deterministic",
        "inputs-not-mutated",
        "no-react-dependency",
        "no-threejs-dependency",
        "no-ai-sdk-dependency",
        "no-network-calls",
        "no-content-generation",
        "no-cockpit-global-mutation",
        "no-nex-ci-6-orchestration",
      ],
    );

  const immutabilityOk =
    Object.isFrozen(advisorInsightIntegrationCanonicalIdentity) &&
    Object.isFrozen(EXECUTIVE_ADVISOR_CONTEXT_MODES) &&
    Object.isFrozen(EXECUTIVE_INSIGHT_CONTEXT_MODES) &&
    Object.isFrozen(EXECUTIVE_ADVISOR_READINESS_STATES) &&
    Object.isFrozen(EXECUTIVE_INSIGHT_READINESS_STATES) &&
    Object.isFrozen(EXECUTIVE_CONTEXT_SUBJECT_ROLES) &&
    Object.isFrozen(EXECUTIVE_ADVISOR_INTEGRATION_REACTION_KINDS) &&
    Object.isFrozen(EXECUTIVE_INSIGHT_INTEGRATION_REACTION_KINDS) &&
    Object.isFrozen(ADVISOR_INSIGHT_INTEGRATION_GUARANTEES) &&
    Object.isFrozen(ADVISOR_INSIGHT_INTEGRATION_BOUNDARY) &&
    Object.isFrozen(advisorInsightIntegration);

  const frameworkIndependent =
    ADVISOR_INSIGHT_INTEGRATION_BOUNDARY.frameworkIndependent === true &&
    ADVISOR_INSIGHT_INTEGRATION_BOUNDARY.introducesReact === false &&
    ADVISOR_INSIGHT_INTEGRATION_BOUNDARY.introducesThreeJs === false &&
    ADVISOR_INSIGHT_INTEGRATION_BOUNDARY.introducesReactThreeFiber === false &&
    ADVISOR_INSIGHT_INTEGRATION_BOUNDARY.implementsNexCi6 === false;

  const intelligenceIndependent =
    ADVISOR_INSIGHT_INTEGRATION_BOUNDARY.intelligenceProviderIndependent ===
      true &&
    ADVISOR_INSIGHT_INTEGRATION_BOUNDARY.ownsAiExecution === false &&
    ADVISOR_INSIGHT_INTEGRATION_BOUNDARY.ownsContentGeneration === false &&
    ADVISOR_INSIGHT_INTEGRATION_BOUNDARY.ownsNetworkAccess === false &&
    ADVISOR_INSIGHT_INTEGRATION_BOUNDARY.introducesAiSdk === false;

  const ok =
    identityOk &&
    vocabularyOk &&
    snapshotOk &&
    advisorInsightDistinct &&
    guaranteesOk &&
    immutabilityOk &&
    frameworkIndependent &&
    intelligenceIndependent &&
    workspaceDial.ok === true;

  return Object.freeze({
    ok,
    identity: advisorInsightIntegrationIdentity,
    version: advisorInsightIntegrationVersion,
    namespace: advisorInsightIntegrationNamespace,
    phase: advisorInsightIntegrationPhase,
    architecturalRole: advisorInsightIntegrationArchitecturalRole,
    dependencyIdentity: advisorInsightIntegrationDependencyIdentity,
    advisorModeCount: EXECUTIVE_ADVISOR_CONTEXT_MODES.length,
    insightModeCount: EXECUTIVE_INSIGHT_CONTEXT_MODES.length,
    advisorReadinessCount: EXECUTIVE_ADVISOR_READINESS_STATES.length,
    insightReadinessCount: EXECUTIVE_INSIGHT_READINESS_STATES.length,
    subjectRoleCount: EXECUTIVE_CONTEXT_SUBJECT_ROLES.length,
    advisorReactionKindCount:
      EXECUTIVE_ADVISOR_INTEGRATION_REACTION_KINDS.length,
    insightReactionKindCount:
      EXECUTIVE_INSIGHT_INTEGRATION_REACTION_KINDS.length,
    guaranteeCount: ADVISOR_INSIGHT_INTEGRATION_GUARANTEES.length,
    invariantCount: ADVISOR_INSIGHT_INTEGRATION_GUARANTEES.length,
    workspaceDialOk: workspaceDial.ok,
    frozen: immutabilityOk,
    advisorInsightDistinct,
    frameworkIndependent,
    intelligenceIndependent,
  });
}

export function verifyAdvisorInsightIntegration():
  ExecutiveAdvisorInsightIntegrationValidation {
  return validateExecutiveAdvisorInsightIntegration();
}

// ─── Public catalogs / module bag ───────────────────────────────────────────

export const advisorInsightIntegrationApiNames = Object.freeze([
  "getAdvisorInsightIntegrationIdentity",
  "getExecutiveAdvisorContextModes",
  "isExecutiveAdvisorContextMode",
  "getExecutiveInsightContextModes",
  "isExecutiveInsightContextMode",
  "getExecutiveAdvisorReadinessStates",
  "isExecutiveAdvisorReadiness",
  "getExecutiveInsightReadinessStates",
  "isExecutiveInsightReadiness",
  "getExecutiveContextSubjectRoles",
  "isExecutiveContextSubjectRole",
  "resolveExecutiveContextSubjects",
  "resolveExecutiveAdvisorContext",
  "resolveExecutiveAdvisorContextMode",
  "resolveExecutiveAdvisorReadiness",
  "resolveExecutiveInsightContext",
  "resolveExecutiveInsightContextMode",
  "resolveExecutiveInsightReadiness",
  "getExecutiveAdvisorIntegrationReactionKinds",
  "isExecutiveAdvisorIntegrationReactionKind",
  "getExecutiveInsightIntegrationReactionKinds",
  "isExecutiveInsightIntegrationReactionKind",
  "resolveExecutiveAdvisorIntegrationReactions",
  "resolveExecutiveInsightIntegrationReactions",
  "createExecutiveAdvisorGuidanceIntent",
  "createExecutiveInsightRequestIntent",
  "resolveExecutiveAdvisorInsightIntegration",
  "resolveExecutiveAdvisorInsightTransition",
  "validateExecutiveAdvisorInsightIntegration",
  "verifyAdvisorInsightIntegration",
] as const);

export const ADVISOR_INSIGHT_INTEGRATION_PUBLIC_TYPE_NAMES = Object.freeze([
  "ExecutiveAdvisorContextMode",
  "ExecutiveInsightContextMode",
  "ExecutiveAdvisorReadiness",
  "ExecutiveInsightReadiness",
  "ExecutiveContextSubjectRole",
  "ExecutiveContextSubject",
  "ExecutiveAdvisorContext",
  "ExecutiveInsightContext",
  "ExecutiveAdvisorContextSnapshot",
  "ExecutiveInsightContextSnapshot",
  "ExecutiveAdvisorInsightIntegrationSnapshot",
  "ExecutiveAdvisorIntegrationReactionKind",
  "ExecutiveInsightIntegrationReactionKind",
  "ExecutiveAdvisorIntegrationReaction",
  "ExecutiveInsightIntegrationReaction",
  "ExecutiveAdvisorGuidanceIntent",
  "ExecutiveInsightRequestIntent",
  "ExecutiveAdvisorAttentionContext",
  "ExecutiveInsightAttentionContext",
  "ExecutiveAdvisorInsightTransitionResult",
  "ExecutiveAdvisorInsightIntegrationValidation",
] as const);

export const advisorInsightIntegration = Object.freeze({
  phase: "AdvisorInsightIntegration" as const,
  name: "AdvisorInsightIntegration" as const,
  identity: advisorInsightIntegrationIdentity,
  version: advisorInsightIntegrationVersion,
  namespace: advisorInsightIntegrationNamespace,
  layer: advisorInsightIntegrationLayer,
  stage: advisorInsightIntegrationStage,
  architecturalRole: advisorInsightIntegrationArchitecturalRole,
  role: "AdvisorInsightIntegration" as const,
  status: advisorInsightIntegrationStability,
  upstreamDependency: advisorInsightIntegrationDependencyIdentity,
  dependencyPath: advisorInsightIntegrationDependencyPath,
  deterministic: advisorInsightIntegrationDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  intelligenceProviderIndependent: true as const,
  browserIndependent: true as const,
  principle: ADVISOR_INSIGHT_INTEGRATION_PRINCIPLE,
  boundary: ADVISOR_INSIGHT_INTEGRATION_BOUNDARY,
  advisorContextModes: EXECUTIVE_ADVISOR_CONTEXT_MODES,
  insightContextModes: EXECUTIVE_INSIGHT_CONTEXT_MODES,
  advisorReadinessStates: EXECUTIVE_ADVISOR_READINESS_STATES,
  insightReadinessStates: EXECUTIVE_INSIGHT_READINESS_STATES,
  contextSubjectRoles: EXECUTIVE_CONTEXT_SUBJECT_ROLES,
  advisorReactionKinds: EXECUTIVE_ADVISOR_INTEGRATION_REACTION_KINDS,
  insightReactionKinds: EXECUTIVE_INSIGHT_INTEGRATION_REACTION_KINDS,
  guarantees: ADVISOR_INSIGHT_INTEGRATION_GUARANTEES,
  forbiddenResponsibilities:
    ADVISOR_INSIGHT_INTEGRATION_FORBIDDEN_RESPONSIBILITIES,
  publicApiSurface: advisorInsightIntegrationApiNames,
  publicTypes: ADVISOR_INSIGHT_INTEGRATION_PUBLIC_TYPE_NAMES,
  nexCi4Boundary: "NEX-CI:4-workspace-dial-experience-switching-only" as const,
  advisorRole:
    "Contextual supporting surface for recommendation, guidance, next action, explanation, decision support" as const,
  insightRole:
    "Contextual supporting/analytical surface for observation, pattern, anomaly, implication, risk/opportunity signal" as const,
  architecturalStatus:
    "Advisor & Insight Integration Complete · Deterministic · Immutable · Intelligence-Provider-Independent · ReadyForCockpitInteractionOrchestration" as const,
});

/**
 * Approved NEX-CI:4 / cockpit consumer surfaces re-exported for immediate
 * downstream NEX-CI phases (e.g. NEX-CI:6) so they can preserve the chain.
 */
export {
  EXECUTIVE_COCKPIT_SURFACES,
  cockpitShellRuntimeBindingIdentity,
  cockpitShellRuntimeBindingVersion,
  createExecutiveCockpitIntegrationSnapshot,
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
  resolveExecutiveStageScene,
  resolveExecutiveWorkspaceExperience,
  resolveExecutiveWorkspaceSelection,
  verifyCockpitShellRuntimeBinding,
  verifyExecutiveCockpitIntegrationFoundation,
  verifyExecutiveStageIntegration,
  verifyWorkspaceDialExperienceSwitching,
  workspaceDialExperienceSwitchingIdentity,
  workspaceDialExperienceSwitchingVersion,
} from "@/app/lib/nex-ci/workspaceDialExperienceSwitching";

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
  ExecutiveWorkspaceExperienceSnapshot,
  ExecutiveWorkspaceReference,
  ExecutiveWorkspaceSelectionIntent,
  ExecutiveWorkspaceTransitionStatus,
} from "@/app/lib/nex-ci/workspaceDialExperienceSwitching";
