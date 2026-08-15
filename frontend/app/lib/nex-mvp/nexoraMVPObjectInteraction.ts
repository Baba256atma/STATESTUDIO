/**
 * NEX-MVP:4 — Nexora Object Interaction coordinator.
 *
 * Thin, pure interaction mapping for executive object exploration.
 * Does not invent runtime engines — maps UI intent to application/Stage
 * presentation while preserving workspace, presentation, and environment.
 */

import type {
  NexoraMVPPresentationState,
  NexoraMVPSceneEnvironmentIntent,
  NexoraMVPSubjectKind,
  NexoraMVPSubjectReference,
  NexoraMVPWorkspaceKind,
} from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation";
import {
  resolveNexoraMVPStageScenePresentation,
  type NexoraMVPStageConnectionPresentation,
  type NexoraMVPStageObjectPresentation,
  type NexoraMVPStageScenePresentation,
} from "@/app/lib/nex-mvp/nexora3DExecutiveStage";
import type {
  NexoraMVPStageObjectFixture,
  NexoraMVPStageRelationshipFixture,
} from "@/app/lib/nex-mvp/nexoraMVPStageFixtures";
import {
  NEXORA_MVP_CONTEXT_LINK_FIXTURES,
  NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
  type NexoraMVPContextLinkFixture,
  type NexoraMVPContextSubjectFixture,
  type NexoraMVPContextSubjectKind,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteractionFixtures";
import {
  NEXORA_MVP_STAGE_OBJECT_FIXTURES,
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
} from "@/app/lib/nex-mvp/nexoraMVPStageFixtures";
import {
  resolveExecutiveFocusSceneDisclosure,
  type ExecutiveFocusSceneDisclosureResult,
} from "@/app/lib/spatial-presentation/executiveFocusSceneDisclosure";
import {
  resolveExecutiveStageDisclosure,
  resolvePrimaryStageSubjectId,
} from "@/app/lib/spatial-presentation/executiveStageProductivityContract";
import {
  EXECUTIVE_QUEUE_CATEGORY_LABELS,
  decodeExecutiveQueueCollectionTrailId,
  encodeExecutiveQueueCollectionTrailId,
  isExecutiveQueueCollectionTrailId,
  resolveExecutiveCollectionDisclosure,
  resolveExecutiveCollectionHeader,
  resolveExecutiveCollectionLayout,
  resolveExecutiveQueueEntries,
  resolveExecutiveQueueEntryForCategory,
  type ExecutiveQueueCategory,
  type ExecutiveStageCollectionContext,
} from "@/app/lib/spatial-presentation/executiveStageQueueFoundation";
import {
  EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY,
  EXECUTIVE_CHANGE_QUEUE_LABEL,
  beginExecutiveChangeInspection,
  buildExecutiveChangeScopeKey,
  buildExecutiveChangeSnapshot,
  clearExecutiveChangeInspection,
  ensureExecutiveChangeBaseline,
  getActiveExecutiveChangeInspection,
  getAcknowledgedExecutiveChangeBaseline,
  rankExecutiveChangeCollectionMembers,
  resolveExecutiveChangeCollectionHeader,
  resolveExecutiveChangeQueueEntry,
  resolveExecutiveMeaningfulChanges,
  type ExecutiveChangeComparisonResult,
  type ExecutiveChangeObjectSnapshot,
  type ExecutiveChangeSnapshot,
  acknowledgeExecutiveChanges,
} from "@/app/lib/spatial-presentation/executiveStageChangeIntelligence";
import {
  executeExecutiveNextBestAction,
  resolveExecutiveNextBestActions,
  type ExecutiveNextBestAction,
  type ExecutiveNextBestActionExecutionIntent,
  type ExecutiveNextBestActionResult,
  type ExecutiveNbaSubjectInput,
} from "@/app/lib/spatial-presentation/executiveStageNextBestAction";
import {
  resolveExecutiveDecisionBrief,
  type ExecutiveBriefSubjectInput,
  type ExecutiveDecisionBriefResult,
} from "@/app/lib/spatial-presentation/executiveStageDecisionBrief";
import {
  appendExecutiveDecisionOutcomeEvaluation,
  buildExecutiveDecisionMemoryScopeKey,
  recordExecutiveDecisionMemory,
  resolveExecutiveDecisionMemoryView,
  type ExecutiveActualOutcome,
  type ExecutiveDecisionMemoryView,
  type ExecutiveExpectedOutcome,
  type ExecutiveDecisionExecutionLink,
} from "@/app/lib/spatial-presentation/executiveStageDecisionMemory";
import {
  formatExecutiveThreadGatewayLabel,
  formatExecutiveThreadSubjectLabel,
  isExecutiveThreadWorkKind,
  resolveExecutiveThreadExpansionState,
  resolveExecutiveThreadGatewayPosition,
  resolveExecutiveThreadProjectableSubjects,
  resolveExecutiveThreadSectorPosition,
} from "@/app/lib/spatial-presentation/executiveThreadExpansion";
import {
  canStepBackExecutiveStage2DNavigationTrail,
  canStepForwardExecutiveStage2DNavigationTrail,
  jumpExecutiveStage2DNavigationTrail,
  stepBackExecutiveStage2DNavigationTrail,
  stepForwardExecutiveStage2DNavigationTrail,
} from "@/app/lib/spatial-presentation/executiveStage2DNavigationTrail";
import {
  createEmptyExecutiveStage2DScopedNavigationTrail,
  ensureExecutiveStage2DScopedNavigationTrail,
  pushExecutiveStage2DScopedNavigationEntry,
  resetExecutiveStage2DScopedNavigationTrail,
  resolveExecutiveStage2DBreadcrumbLabels,
  resolveExecutiveStage2DNavigationBreadcrumbWindow,
  sanitizeExecutiveStage2DScopedNavigationTrail,
  transitionExecutiveStage2DNavigationScope,
  type ExecutiveStage2DNavigationScopeStatus,
  type ExecutiveStage2DScopedNavigationTrail,
} from "@/app/lib/spatial-presentation/executiveStage2DNavigationContext";
import {
  resolveExecutiveFocusVisualGrammar,
} from "@/app/lib/spatial-presentation/executiveFocusVisualGrammar";
import {
  buildExecutivePreparationScopeKey,
  decodeExecutivePreparationTrailId,
  encodeExecutivePreparationTrailId,
  isExecutivePreparationTrailId,
  resolveExecutiveDailyPreparation,
  resolveExecutiveMeetingPreparation,
  resolveExecutivePreparationLayout,
  type ExecutivePreparationContext,
  type ExecutivePreparationMode,
  type ExecutivePreparationSubject,
  type ExecutivePreparationSubjectInput,
  type ExecutivePreparationSummary,
} from "@/app/lib/spatial-presentation/executiveStagePreparation";

// ─── Identity ───────────────────────────────────────────────────────────────

export const nexoraMVPObjectInteractionIdentity =
  "NEX-MVP:4/NexoraObjectInteraction" as const;

export const nexoraMVPObjectInteractionVersion = "2.0.0" as const;

export const nexoraMVPObjectInteractionNamespace =
  "nexora.mvp.object-interaction" as const;

export const nexoraMVPObjectInteractionPhase = "ObjectInteraction" as const;

export const nexoraMVPObjectInteractionArchitecturalRole =
  "MVPExecutiveObjectInteractionCoordinator" as const;

export const nexoraMVPObjectInteractionReadiness =
  "ReadyForWorkspaceDialAndSceneState" as const;

export const nexoraMVPObjectInteractionUpstreamStageIdentity =
  "NEX-MVP:3/Nexora3DExecutiveStage" as const;

export type NexoraMVPObjectInteractionIdentity = {
  readonly id: typeof nexoraMVPObjectInteractionIdentity;
  readonly version: typeof nexoraMVPObjectInteractionVersion;
  readonly namespace: typeof nexoraMVPObjectInteractionNamespace;
  readonly phase: typeof nexoraMVPObjectInteractionPhase;
  readonly architecturalRole: typeof nexoraMVPObjectInteractionArchitecturalRole;
};

const IDENTITY: NexoraMVPObjectInteractionIdentity = Object.freeze({
  id: nexoraMVPObjectInteractionIdentity,
  version: nexoraMVPObjectInteractionVersion,
  namespace: nexoraMVPObjectInteractionNamespace,
  phase: nexoraMVPObjectInteractionPhase,
  architecturalRole: nexoraMVPObjectInteractionArchitecturalRole,
});

export function getNexoraMVPObjectInteractionIdentity(): NexoraMVPObjectInteractionIdentity {
  return IDENTITY;
}

export const NEXORA_MVP_OBJECT_INTERACTION_BOUNDARY = Object.freeze({
  architecturalRole: nexoraMVPObjectInteractionArchitecturalRole,
  immediateStageDependency: nexoraMVPObjectInteractionUpstreamStageIdentity,
  ownsRuntimeSemantics: false as const,
  inventsDomainLogicInMeshes: false as const,
  duplicatesFocusResolver: false as const,
  duplicatesRelationshipEngine: false as const,
  relationshipDepth: 1 as const,
  maxContextSubjects: 8 as const,
});

// ─── Interaction vocabulary ─────────────────────────────────────────────────

export const NEXORA_MVP_INTERACTION_MODES = Object.freeze([
  "overview",
  "object-selected",
  "object-focused",
  "context-focused",
  "returning-to-overview",
] as const);

export type NexoraMVPInteractionMode =
  (typeof NEXORA_MVP_INTERACTION_MODES)[number];

export type NexoraMVPInteractionSubjectKind =
  | "object"
  | NexoraMVPContextSubjectKind;

export type NexoraMVPInteractionSubject = {
  readonly id: string;
  readonly kind: NexoraMVPInteractionSubjectKind;
  readonly label: string;
  /** STAGE-2D:5 absolute object-trail index when present on breadcrumb entries. */
  readonly navigationTrailIndex?: number;
  /** STAGE-2D:6 — full accessible name when display label is truncated. */
  readonly navigationLabelFull?: string;
  readonly navigationLabelMode?: "full" | "compact" | "truncated";
};

export type NexoraMVPObjectInteractionCatalog = {
  readonly objects: readonly NexoraMVPStageObjectFixture[];
  readonly relationships: readonly NexoraMVPStageRelationshipFixture[];
  readonly contextSubjects: readonly NexoraMVPContextSubjectFixture[];
  readonly contextLinks: readonly NexoraMVPContextLinkFixture[];
};

export type NexoraMVPObjectInteractionState = {
  readonly mode: NexoraMVPInteractionMode;
  readonly selectedSubject: NexoraMVPInteractionSubject | null;
  readonly focusedSubject: NexoraMVPInteractionSubject | null;
  /**
   * Presentation breadcrumb subjects (may include context). Synced from
   * STAGE-2D:5 object navigation trail for business-object focus.
   */
  readonly trail: readonly NexoraMVPInteractionSubject[];
  /**
   * STAGE-2D:5/6 — Stage object navigation history (not relationship truth).
   * Scoped to active workspace/model. Overview = empty trail.
   */
  readonly stage2dNavigationTrail: ExecutiveStage2DScopedNavigationTrail;
  /** STAGE-2D:6 — last scope transition status for observability. */
  readonly stage2dNavigationScopeStatus?: ExecutiveStage2DNavigationScopeStatus;
  readonly workspace: NexoraMVPWorkspaceKind;
  readonly presentationState: NexoraMVPPresentationState;
  readonly environmentIntent: NexoraMVPSceneEnvironmentIntent;
  /**
   * SP:4.1B — explicit Executive Thread expansion (collapsed-thread selection).
   * Presentation-only; does not invent executive-work subjects.
   */
  readonly expandExecutiveThread?: boolean;
  /**
   * STAGE-PROD:1 — active Queue collection context (presentation only).
   * Never a semantic Object. Null outside collection mode.
   */
  readonly collectionContext?: ExecutiveStageCollectionContext | null;
  /**
   * STAGE-PROD:6 — active Daily / Meeting Preparation context (presentation only).
   * Mutually exclusive with collectionContext. Never a semantic Object.
   */
  readonly preparationContext?: ExecutivePreparationContext | null;
};

/** Presentation-only collapsed Executive Thread subject id. */
export function collapsedExecutiveThreadSubjectId(
  focusedBusinessObjectId: string,
): string {
  return `thread-${focusedBusinessObjectId}`;
}

export function isCollapsedExecutiveThreadSubjectId(subjectId: string): boolean {
  return subjectId.startsWith("thread-");
}

export type NexoraMVPContextNodePresentation = {
  readonly id: string;
  readonly label: string;
  readonly kind: NexoraMVPInteractionSubjectKind | "executive-thread";
  readonly role: "focused" | "context" | "source-anchor" | "collapsed-thread";
  readonly targetPosition: readonly [number, number, number];
  readonly scale: number;
  readonly opacity: number;
  readonly selected: boolean;
  readonly focused: boolean;
  readonly attention: NexoraMVPContextSubjectFixture["attention"];
  readonly status: NexoraMVPContextSubjectFixture["status"];
  readonly relation?: string;
  /** Canonical subject id for selection (may differ from render id for anchors). */
  readonly subjectId: string;
  readonly disclosureState?:
    | "visible-primary"
    | "visible-related"
    | "collapsed-thread"
    | "background-discoverable"
    | "hidden";
  readonly interactive?: boolean;
  readonly labelVisible?: boolean;
  readonly collapsedMemberIds?: readonly string[];
  /** STAGE-THREAD:1-FIX — discoverable gateway vs quiet collapse control. */
  readonly gatewayMode?: "discoverable-collapsed" | "quiet-collapse";
  readonly gatewayCount?: number;
  /** SP:4.2 presentation-plane fields (optional during migration). */
  readonly compositionMode?: "spatial-3d" | "executive-2_5d";
  readonly presentationPosition?: Readonly<{ readonly x: number; readonly y: number }>;
  readonly depthRole?:
    | "focus"
    | "foreground"
    | "standard"
    | "background"
    | "thread";
  readonly presentationRegion?:
    | "business-network"
    | "executive-thread"
    | "background-context";
  readonly presentationComposition?: Readonly<{
    readonly objectId: string;
    readonly presentationPosition: Readonly<{ readonly x: number; readonly y: number }>;
    readonly layoutRole: string;
    readonly visibility: string;
    readonly prominence: string;
    readonly depthRole: string;
    readonly region: string;
    readonly territory: Readonly<{
      readonly objectId: string;
      readonly center: Readonly<{ readonly x: number; readonly y: number }>;
      readonly width: number;
      readonly height: number;
      readonly padding: number;
      readonly region: string;
      readonly depthRole: string;
    }>;
    readonly footprint: Readonly<{ readonly width: number; readonly height: number }>;
    readonly compositionScale: number;
  }>;
};

export type NexoraMVPStageInteractionPresentation = {
  readonly mode: NexoraMVPInteractionMode;
  readonly scene: NexoraMVPStageScenePresentation;
  readonly contextNodes: readonly NexoraMVPContextNodePresentation[];
  readonly contextConnections: readonly NexoraMVPStageConnectionPresentation[];
  readonly breadcrumb: readonly NexoraMVPInteractionSubject[];
  readonly canStepBack: boolean;
  readonly canStepForward?: boolean;
  readonly stage2dNavigationTrail?: ExecutiveStage2DScopedNavigationTrail;
  readonly stage2dNavigationScopeStatus?: ExecutiveStage2DNavigationScopeStatus;
  readonly breadcrumbHasOverflow?: boolean;
  readonly breadcrumbHasOverflowBefore?: boolean;
  readonly breadcrumbHasOverflowAfter?: boolean;
  readonly breadcrumbVisibleStartIndex?: number;
  readonly breadcrumbOverflowBefore?: number;
  readonly breadcrumbOverflowAfter?: number;
  readonly focusedSubjectId: string | null;
  readonly selectedSubjectId: string | null;
  readonly emphasizedObjectIds: readonly string[];
  readonly subordinateObjectIds: readonly string[];
  readonly emphasizedRelationshipIds: readonly string[];
  /** STAGE-THREAD:1 — gateway expansion (presentation only). */
  readonly threadExpansion?: {
    readonly expanded: boolean;
    readonly anchorObjectId: string | null;
    readonly threadId: string | null;
    readonly selectedSubjectId: string | null;
    readonly subjects: readonly {
      readonly id: string;
      readonly label: string;
      readonly kind: string;
    }[];
  };
  /** STAGE-PROD:1/6 — Queue + collection + preparation presentation. */
  readonly presentationMode?:
    | "overview"
    | "object-focus"
    | "collection"
    | "preparation";
  readonly collectionContext?: ExecutiveStageCollectionContext | null;
  /** STAGE-PROD:6 — live-recomputed preparation context (presentation only). */
  readonly preparationContext?: ExecutivePreparationContext | null;
  readonly collectionHeader?: {
    readonly label: string;
    readonly category: ExecutiveQueueCategory | "changes-since-visit";
    readonly totalCount: number;
    readonly visibleCount: number;
    readonly overflowLabel: string | null;
    readonly isSemanticObject: false;
  } | null;
  readonly queueEntries?: readonly {
    readonly category: ExecutiveQueueCategory | "changes-since-visit";
    readonly count: number;
    readonly objectIds: readonly string[];
    readonly isSemanticObject: false;
    readonly isActive: boolean;
    readonly collectionKind?: "object-kind" | "productivity";
    readonly label?: string;
  }[];
  /** STAGE-PROD:2 — change intelligence observability passthrough. */
  readonly changeComparison?: ExecutiveChangeComparisonResult | null;
  /** STAGE-PROD:3 — Next Best Action (object-focus only). */
  readonly nextBestAction?: ExecutiveNextBestActionResult | null;
  /** STAGE-PROD:4 — Decision Brief (object-focus, decision-pressure only). */
  readonly decisionBrief?: ExecutiveDecisionBriefResult | null;
  /** STAGE-PROD:5 — Decision Memory view (Decision focus only). */
  readonly decisionMemory?: ExecutiveDecisionMemoryView | null;
};

export type NexoraMVPAdvisorContextBridge = {
  readonly selectedSubject: NexoraMVPSubjectReference | null;
  readonly focusedSubject: NexoraMVPSubjectReference | null;
  /** STAGE-PROD:0 — Stage primary subject ≡ Advisor primary subject. */
  readonly primaryStageSubjectId: string | null;
  readonly advisorSubjectId: string | null;
  readonly subjectKind: NexoraMVPInteractionSubjectKind | null;
  readonly relatedSubjectIds: readonly string[];
  readonly contextSubjectIds: readonly string[];
  readonly activeWorkspace: NexoraMVPWorkspaceKind;
  readonly presentationState: NexoraMVPPresentationState;
  readonly environmentIntent: NexoraMVPSceneEnvironmentIntent;
  readonly interactionMode: NexoraMVPInteractionMode;
  readonly breadcrumb: readonly NexoraMVPInteractionSubject[];
  /** STAGE-PROD:1/6 — collection/preparation are presentation context, not subjects. */
  readonly presentationMode?:
    | "overview"
    | "object-focus"
    | "collection"
    | "preparation";
  readonly advisorPresentationContext?: string | null;
  readonly collectionCategory?:
    | ExecutiveQueueCategory
    | "changes-since-visit"
    | null;
  readonly collectionObjectCount?: number;
  readonly changeCountsByKind?: Readonly<Record<string, number>> | null;
  /** STAGE-PROD:6 */
  readonly preparationMode?: ExecutivePreparationMode | null;
  readonly preparationSubjectLabel?: string | null;
  readonly preparationSummary?: ExecutivePreparationSummary | null;
  readonly preparationContext?: ExecutivePreparationContext | null;
  /** STAGE-PROD:3 */
  readonly nbaSubjectId?: string | null;
  readonly nextBestAction?: ExecutiveNextBestActionResult | null;
  /** STAGE-PROD:4 */
  readonly briefSubjectId?: string | null;
  readonly decisionBrief?: ExecutiveDecisionBriefResult | null;
  /** STAGE-PROD:5 */
  readonly decisionMemorySubjectId?: string | null;
  readonly decisionMemory?: ExecutiveDecisionMemoryView | null;
};

export type NexoraMVPTimelineContextBridge = {
  readonly currentSubjectId: string | null;
  readonly currentSubjectKind: NexoraMVPInteractionSubjectKind | null;
  readonly activeWorkspace: NexoraMVPWorkspaceKind;
  readonly interactionMode: NexoraMVPInteractionMode;
};

const KIND_ORDER: readonly NexoraMVPContextSubjectKind[] = [
  "problem",
  "scenario",
  "decision",
  "execution",
];

const KIND_BASE_ANGLE: Record<NexoraMVPContextSubjectKind, number> = {
  problem: -2.35,
  scenario: -0.85,
  decision: 0.75,
  execution: 2.25,
};

export function getDefaultNexoraMVPObjectInteractionCatalog(): NexoraMVPObjectInteractionCatalog {
  return Object.freeze({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES as readonly NexoraMVPStageObjectFixture[],
    relationships:
      NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES as readonly NexoraMVPStageRelationshipFixture[],
    contextSubjects:
      NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES as readonly NexoraMVPContextSubjectFixture[],
    contextLinks:
      NEXORA_MVP_CONTEXT_LINK_FIXTURES as readonly NexoraMVPContextLinkFixture[],
  });
}

export function createInitialNexoraMVPObjectInteractionState(input: {
  readonly workspace: NexoraMVPWorkspaceKind;
  readonly presentationState: NexoraMVPPresentationState;
  readonly environmentIntent: NexoraMVPSceneEnvironmentIntent;
}): NexoraMVPObjectInteractionState {
  return Object.freeze({
    mode: "overview",
    selectedSubject: null,
    focusedSubject: null,
    trail: Object.freeze([]),
    stage2dNavigationTrail: createEmptyExecutiveStage2DScopedNavigationTrail({
      workspace: input.workspace,
    }),
    stage2dNavigationScopeStatus: "stable",
    workspace: input.workspace,
    presentationState: input.presentationState,
    environmentIntent: input.environmentIntent,
    expandExecutiveThread: false,
    collectionContext: null,
    preparationContext: null,
  });
}

export function resolveNexoraMVPInteractionSubject(
  subjectId: string,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): NexoraMVPInteractionSubject | null {
  const object = catalog.objects.find((entry) => entry.id === subjectId);
  if (object) {
    return Object.freeze({
      id: object.id,
      kind: "object",
      label: object.label,
    });
  }
  const context = catalog.contextSubjects.find(
    (entry) => entry.id === subjectId,
  );
  if (context) {
    return Object.freeze({
      id: context.id,
      kind: context.kind,
      label: context.label,
    });
  }
  return null;
}

function toAppSubject(
  subject: NexoraMVPInteractionSubject | null,
): NexoraMVPSubjectReference | null {
  if (subject == null) return null;
  const kind = subject.kind as NexoraMVPSubjectKind;
  return Object.freeze({ id: subject.id, kind });
}

function appendTrail(
  trail: readonly NexoraMVPInteractionSubject[],
  subject: NexoraMVPInteractionSubject,
): readonly NexoraMVPInteractionSubject[] {
  const withoutDuplicate = trail.filter((entry) => entry.id !== subject.id);
  return Object.freeze([...withoutDuplicate, subject]);
}

function isValidStageObjectId(
  objectId: string,
  catalog: NexoraMVPObjectInteractionCatalog,
): boolean {
  if (isExecutiveQueueCollectionTrailId(objectId)) {
    return decodeExecutiveQueueCollectionTrailId(objectId) != null;
  }
  if (isExecutivePreparationTrailId(objectId)) {
    return decodeExecutivePreparationTrailId(objectId) != null;
  }
  return (
    catalog.objects.some((entry) => entry.id === objectId) ||
    catalog.contextSubjects.some((entry) => entry.id === objectId)
  );
}

function resolveStage2DTrailSubjects(
  objectIds: readonly string[],
  catalog: NexoraMVPObjectInteractionCatalog,
): readonly NexoraMVPInteractionSubject[] {
  return Object.freeze(
    objectIds
      .map((objectId) => {
        const collectionCategory =
          decodeExecutiveQueueCollectionTrailId(objectId);
        if (collectionCategory != null) {
          return Object.freeze({
            id: objectId,
            kind: "object" as const,
            label: EXECUTIVE_QUEUE_CATEGORY_LABELS[collectionCategory],
          });
        }
        const preparation = decodeExecutivePreparationTrailId(objectId);
        if (preparation != null) {
          return Object.freeze({
            id: objectId,
            kind: "object" as const,
            label:
              preparation.mode === "daily"
                ? "Daily Preparation"
                : preparation.subject?.label?.trim() || "Meeting",
          });
        }
        return resolveNexoraMVPInteractionSubject(objectId, catalog);
      })
      .filter((entry): entry is NexoraMVPInteractionSubject => entry != null),
  );
}

function sanitizeStage2DNavigationTrail(
  trail: ExecutiveStage2DScopedNavigationTrail | null | undefined,
  catalog: NexoraMVPObjectInteractionCatalog,
  workspace: NexoraMVPWorkspaceKind,
): ExecutiveStage2DScopedNavigationTrail {
  const scoped = ensureExecutiveStage2DScopedNavigationTrail(trail, {
    workspace,
  });
  return sanitizeExecutiveStage2DScopedNavigationTrail(scoped, (objectId) =>
    isValidStageObjectId(objectId, catalog),
  );
}

/**
 * STAGE-PROD:2 — build comparison snapshot from current catalog truth.
 */
export function buildNexoraMVPExecutiveChangeSnapshot(
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
  input?: {
    readonly workspace?: NexoraMVPWorkspaceKind;
    readonly modelId?: string | null;
    readonly capturedAt?: string;
  },
): ExecutiveChangeSnapshot {
  const scopeKey = buildExecutiveChangeScopeKey({
    workspace: input?.workspace ?? "company",
    modelId: input?.modelId,
  });
  const objects: ExecutiveChangeObjectSnapshot[] = [
    ...catalog.objects.map((object) =>
      Object.freeze({
        objectId: object.id,
        objectKind: object.kind,
        label: object.label,
        executiveState:
          object.attention === "critical"
            ? "critical"
            : object.attention === "important" || object.attention === "elevated"
              ? "attention"
              : "normal",
        attentionState: object.attention,
        lifecycleState: object.status,
        unresolved: object.status === "risk",
        recommended: object.attention === "critical",
        eligible: true,
      }),
    ),
    ...catalog.contextSubjects.map((subject) =>
      Object.freeze({
        objectId: subject.id,
        objectKind: subject.kind,
        label: subject.label,
        executiveState:
          subject.attention === "critical"
            ? "critical"
            : subject.attention === "important" ||
                subject.attention === "elevated"
              ? "attention"
              : "normal",
        attentionState: subject.attention,
        lifecycleState: subject.status,
        decisionStatus:
          subject.kind === "decision" ? subject.status : null,
        executionStatus:
          subject.kind === "execution" ? subject.status : null,
        unresolved: subject.status === "risk",
        recommended: subject.attention === "critical",
        eligible: true,
      }),
    ),
  ];
  return buildExecutiveChangeSnapshot({
    scopeKey,
    capturedAt: input?.capturedAt,
    objects,
  });
}

function resolveChangeCollectionContext(
  catalog: NexoraMVPObjectInteractionCatalog,
  workspace: NexoraMVPWorkspaceKind,
): ExecutiveStageCollectionContext {
  const current = buildNexoraMVPExecutiveChangeSnapshot(catalog, {
    workspace,
  });
  const active = getActiveExecutiveChangeInspection();
  const comparison =
    active != null && active.scopeKey === current.scopeKey
      ? active.comparison
      : beginExecutiveChangeInspection({ currentSnapshot: current });
  const ranked = rankExecutiveChangeCollectionMembers({
    changes: comparison.changes,
  });
  const annotations: Record<
    string,
    {
      readonly changeKind: string;
      readonly annotation: string;
      readonly reason: string;
      readonly importance: number;
    }
  > = {};
  for (const change of comparison.changes) {
    annotations[change.objectId] = Object.freeze({
      changeKind: change.changeKind,
      annotation: change.annotation,
      reason: change.reason,
      importance: change.importance,
    });
  }
  return Object.freeze({
    collectionKind: "productivity" as const,
    category: EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY,
    objectIds: comparison.changedObjectIds,
    changeAnnotations: Object.freeze(annotations),
  });
}

function resolveDefaultChangeComparisonForPreparation(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog,
): ExecutiveChangeComparisonResult | null {
  const changeSnapshot = buildNexoraMVPExecutiveChangeSnapshot(catalog, {
    workspace: state.workspace,
  });
  let acknowledged = getAcknowledgedExecutiveChangeBaseline(
    changeSnapshot.scopeKey,
  );
  if (acknowledged == null) {
    ensureExecutiveChangeBaseline({ currentSnapshot: changeSnapshot });
    acknowledged = getAcknowledgedExecutiveChangeBaseline(
      changeSnapshot.scopeKey,
    );
  }
  return resolveExecutiveMeaningfulChanges({
    previousSnapshot: acknowledged,
    currentSnapshot: changeSnapshot,
  });
}

/** STAGE-PROD:6 — catalog → preparation subject inputs. */
export function buildNexoraMVPPreparationSubjects(
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): readonly ExecutivePreparationSubjectInput[] {
  return Object.freeze([
    ...catalog.objects.map((object) =>
      Object.freeze({
        subjectId: object.id,
        objectKind: object.kind,
        label: object.label,
        attention: object.attention,
        status: object.status,
        executiveState:
          object.attention === "critical"
            ? "critical"
            : object.attention === "important" || object.attention === "elevated"
              ? "attention"
              : "normal",
        family: "business-object",
        unresolved: object.status === "risk",
      }),
    ),
    ...catalog.contextSubjects.map((subject) =>
      Object.freeze({
        subjectId: subject.id,
        objectKind: subject.kind,
        label: subject.label,
        attention: subject.attention,
        status: subject.status,
        executiveState:
          subject.attention === "critical"
            ? "critical"
            : subject.attention === "important" ||
                subject.attention === "elevated"
              ? "attention"
              : "normal",
        family: "executive-work",
        unresolved: subject.status === "risk" || subject.status === "watch",
      }),
    ),
  ]);
}

function preparationLinkInputs(
  catalog: NexoraMVPObjectInteractionCatalog,
) {
  return catalog.contextLinks.map((link) =>
    Object.freeze({
      objectId: link.objectId,
      contextId: link.contextId,
      relation: link.relation,
    }),
  );
}

function preparationRelationshipInputs(
  catalog: NexoraMVPObjectInteractionCatalog,
) {
  return catalog.relationships.map((relationship) =>
    Object.freeze({
      id: relationship.id,
      sourceId: relationship.sourceId,
      targetId: relationship.targetId,
    }),
  );
}

/** STAGE-PROD:6 — resolve Daily Preparation from current interaction truth. */
export function resolveNexoraMVPDailyPreparation(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
  changeComparison?: ExecutiveChangeComparisonResult | null,
) {
  return resolveExecutiveDailyPreparation({
    scopeKey: buildExecutivePreparationScopeKey({
      workspace: state.workspace,
    }),
    subjects: buildNexoraMVPPreparationSubjects(catalog),
    links: preparationLinkInputs(catalog),
    relationships: preparationRelationshipInputs(catalog),
    changeComparison:
      changeComparison ??
      resolveDefaultChangeComparisonForPreparation(state, catalog),
  });
}

/** STAGE-PROD:6 — resolve Meeting Preparation from current interaction truth. */
export function resolveNexoraMVPMeetingPreparation(
  state: NexoraMVPObjectInteractionState,
  subject: ExecutivePreparationSubject,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
  changeComparison?: ExecutiveChangeComparisonResult | null,
) {
  return resolveExecutiveMeetingPreparation({
    scopeKey: buildExecutivePreparationScopeKey({
      workspace: state.workspace,
    }),
    subject,
    subjects: buildNexoraMVPPreparationSubjects(catalog),
    links: preparationLinkInputs(catalog),
    relationships: preparationRelationshipInputs(catalog),
    changeComparison:
      changeComparison ??
      resolveDefaultChangeComparisonForPreparation(state, catalog),
  });
}

function liveRecomputePreparationContext(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog,
  changeComparison?: ExecutiveChangeComparisonResult | null,
): ExecutivePreparationContext | null {
  if (state.preparationContext == null) return null;
  if (state.preparationContext.mode === "daily") {
    return resolveNexoraMVPDailyPreparation(state, catalog, changeComparison)
      .context;
  }
  const subject =
    state.preparationContext.subject ??
    Object.freeze({
      kind: "topic" as const,
      label: "Meeting",
    });
  return resolveNexoraMVPMeetingPreparation(
    state,
    subject,
    catalog,
    changeComparison,
  ).context;
}

/**
 * STAGE-PROD:6 — enter Daily Preparation (no auto-focus).
 * Clears collection; mutually exclusive presentation context.
 */
export function beginNexoraMVPDailyPreparation(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): NexoraMVPObjectInteractionState {
  const result = resolveNexoraMVPDailyPreparation(state, catalog);
  const preparationId = encodeExecutivePreparationTrailId("daily");
  let trail = sanitizeStage2DNavigationTrail(
    state.stage2dNavigationTrail,
    catalog,
    state.workspace,
  );
  trail = pushExecutiveStage2DScopedNavigationEntry(trail, preparationId);
  return Object.freeze({
    ...state,
    mode: "object-focused" as const,
    selectedSubject: null,
    focusedSubject: null,
    trail: resolveStage2DTrailSubjects(trail.objectIds, catalog),
    stage2dNavigationTrail: trail,
    stage2dNavigationScopeStatus: "stable",
    expandExecutiveThread: false,
    collectionContext: null,
    preparationContext: result.context,
  });
}

/**
 * STAGE-PROD:6 — enter Meeting Preparation (no auto-focus).
 */
export function beginNexoraMVPMeetingPreparation(
  state: NexoraMVPObjectInteractionState,
  subject: ExecutivePreparationSubject,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): NexoraMVPObjectInteractionState {
  const result = resolveNexoraMVPMeetingPreparation(state, subject, catalog);
  const preparationId = encodeExecutivePreparationTrailId("meeting", subject);
  let trail = sanitizeStage2DNavigationTrail(
    state.stage2dNavigationTrail,
    catalog,
    state.workspace,
  );
  trail = pushExecutiveStage2DScopedNavigationEntry(trail, preparationId);
  return Object.freeze({
    ...state,
    mode: "object-focused" as const,
    selectedSubject: null,
    focusedSubject: null,
    trail: resolveStage2DTrailSubjects(trail.objectIds, catalog),
    stage2dNavigationTrail: trail,
    stage2dNavigationScopeStatus: "stable",
    expandExecutiveThread: false,
    collectionContext: null,
    preparationContext: result.context,
  });
}

/**
 * STAGE-PROD:6 — exit preparation via trail step-back (like close collection).
 */
export function exitNexoraMVPPreparation(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): NexoraMVPObjectInteractionState {
  if (state.preparationContext == null) return state;
  const sanitized = sanitizeStage2DNavigationTrail(
    state.stage2dNavigationTrail,
    catalog,
    state.workspace,
  );
  const stepped = stepBackExecutiveStage2DNavigationTrail(sanitized);
  const nextTrail = retainScopedTrail(sanitized, stepped);
  return applyExecutiveStage2DNavigationTrailFocus(state, nextTrail, catalog);
}

/**
 * Apply a STAGE-2D:5/6 trail as the current object focus, collection, or
 * preparation without pushing. Recomputes presentation from live catalog truth.
 */
export function applyExecutiveStage2DNavigationTrailFocus(
  state: NexoraMVPObjectInteractionState,
  trail: ExecutiveStage2DScopedNavigationTrail,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): NexoraMVPObjectInteractionState {
  const sanitized = sanitizeStage2DNavigationTrail(
    trail,
    catalog,
    state.workspace,
  );
  if (sanitized.activeObjectId == null) {
    return resetNexoraMVPObjectInteractionOverview(state);
  }

  const preparationDecoded = decodeExecutivePreparationTrailId(
    sanitized.activeObjectId,
  );
  if (preparationDecoded != null) {
    const result =
      preparationDecoded.mode === "daily"
        ? resolveNexoraMVPDailyPreparation(state, catalog)
        : resolveNexoraMVPMeetingPreparation(
            state,
            preparationDecoded.subject ??
              Object.freeze({
                kind: "topic" as const,
                label: "Meeting",
              }),
            catalog,
          );
    return Object.freeze({
      ...state,
      mode: "object-focused" as const,
      selectedSubject: null,
      focusedSubject: null,
      trail: resolveStage2DTrailSubjects(sanitized.objectIds, catalog),
      stage2dNavigationTrail: sanitized,
      expandExecutiveThread: false,
      collectionContext: null,
      preparationContext: result.context,
    });
  }

  const collectionCategory = decodeExecutiveQueueCollectionTrailId(
    sanitized.activeObjectId,
  );
  if (collectionCategory != null) {
    if (collectionCategory === EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY) {
      return Object.freeze({
        ...state,
        mode: "object-focused" as const,
        selectedSubject: null,
        focusedSubject: null,
        trail: resolveStage2DTrailSubjects(sanitized.objectIds, catalog),
        stage2dNavigationTrail: sanitized,
        expandExecutiveThread: false,
        collectionContext: resolveChangeCollectionContext(
          catalog,
          state.workspace,
        ),
        preparationContext: null,
      });
    }
    const entry = resolveExecutiveQueueEntryForCategory({
      subjects: catalog.contextSubjects.map((subject) =>
        Object.freeze({
          subjectId: subject.id,
          workKind: subject.kind,
          objectKind: subject.kind,
          attention: subject.attention,
          status: subject.status,
        }),
      ),
      category: collectionCategory,
    });
    return Object.freeze({
      ...state,
      mode: "object-focused" as const,
      selectedSubject: null,
      focusedSubject: null,
      trail: resolveStage2DTrailSubjects(sanitized.objectIds, catalog),
      stage2dNavigationTrail: sanitized,
      expandExecutiveThread: false,
      collectionContext: Object.freeze({
        collectionKind: "object-kind" as const,
        category: collectionCategory,
        objectIds: entry.objectIds,
      }),
      preparationContext: null,
    });
  }

  const subject = resolveNexoraMVPInteractionSubject(
    sanitized.activeObjectId,
    catalog,
  );
  if (subject == null) {
    return resetNexoraMVPObjectInteractionOverview(state);
  }
  return Object.freeze({
    ...state,
    mode:
      subject.kind === "object"
        ? ("object-focused" as const)
        : ("context-focused" as const),
    selectedSubject: subject,
    focusedSubject: subject,
    trail: resolveStage2DTrailSubjects(sanitized.objectIds, catalog),
    stage2dNavigationTrail: sanitized,
    expandExecutiveThread: subject.kind !== "object",
    collectionContext: null,
    preparationContext: null,
  });
}

/**
 * STAGE-PROD:1 — open or toggle a Queue category collection.
 * Queue click writes presentation context, not semantic focus.
 */
export function openNexoraMVPExecutiveQueueCollection(
  state: NexoraMVPObjectInteractionState,
  category: ExecutiveQueueCategory,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): NexoraMVPObjectInteractionState {
  const entry = resolveExecutiveQueueEntryForCategory({
    subjects: catalog.contextSubjects.map((subject) =>
      Object.freeze({
        subjectId: subject.id,
        workKind: subject.kind,
        objectKind: subject.kind,
        attention: subject.attention,
        status: subject.status,
      }),
    ),
    category,
  });
  if (entry.count === 0) {
    return state;
  }

  // Active-row second click → toggle close / restore prior semantic context.
  if (
    state.collectionContext != null &&
    state.collectionContext.category === category
  ) {
    return closeNexoraMVPExecutiveQueueCollection(state, catalog);
  }

  const collectionId = encodeExecutiveQueueCollectionTrailId(category);
  let trail = sanitizeStage2DNavigationTrail(
    state.stage2dNavigationTrail,
    catalog,
    state.workspace,
  );
  trail = pushExecutiveStage2DScopedNavigationEntry(trail, collectionId);

  return Object.freeze({
    ...state,
    mode: "object-focused" as const,
    selectedSubject: null,
    focusedSubject: null,
    trail: resolveStage2DTrailSubjects(trail.objectIds, catalog),
    stage2dNavigationTrail: trail,
    stage2dNavigationScopeStatus: "stable",
    expandExecutiveThread: false,
    collectionContext: Object.freeze({
      collectionKind: "object-kind" as const,
      category,
      objectIds: entry.objectIds,
    }),
    preparationContext: null,
  });
}

/**
 * STAGE-PROD:2 — open Recent Changes productivity collection.
 * Does not advance the acknowledged baseline (inspection stability).
 */
export function openNexoraMVPExecutiveChangeCollection(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): NexoraMVPObjectInteractionState {
  const current = buildNexoraMVPExecutiveChangeSnapshot(catalog, {
    workspace: state.workspace,
  });
  // Ensure first-visit baseline exists without flooding NEW.
  ensureExecutiveChangeBaseline({ currentSnapshot: current });
  const comparison = beginExecutiveChangeInspection({
    currentSnapshot: current,
  });
  if (
    comparison.baselineStatus !== "available" ||
    comparison.changedObjectIds.length === 0
  ) {
    return state;
  }

  if (
    state.collectionContext?.category === EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY
  ) {
    return closeNexoraMVPExecutiveQueueCollection(state, catalog);
  }

  const collectionId = encodeExecutiveQueueCollectionTrailId(
    EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY,
  );
  let trail = sanitizeStage2DNavigationTrail(
    state.stage2dNavigationTrail,
    catalog,
    state.workspace,
  );
  trail = pushExecutiveStage2DScopedNavigationEntry(trail, collectionId);

  return Object.freeze({
    ...state,
    mode: "object-focused" as const,
    selectedSubject: null,
    focusedSubject: null,
    trail: resolveStage2DTrailSubjects(trail.objectIds, catalog),
    stage2dNavigationTrail: trail,
    stage2dNavigationScopeStatus: "stable",
    expandExecutiveThread: false,
    collectionContext: resolveChangeCollectionContext(catalog, state.workspace),
    preparationContext: null,
  });
}

/**
 * STAGE-PROD:2 — explicit acknowledgement boundary.
 */
export function acknowledgeNexoraMVPExecutiveChanges(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): NexoraMVPObjectInteractionState {
  const current = buildNexoraMVPExecutiveChangeSnapshot(catalog, {
    workspace: state.workspace,
  });
  acknowledgeExecutiveChanges({ currentSnapshot: current });
  clearExecutiveChangeInspection();
  if (
    state.collectionContext?.category === EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY
  ) {
    return resetNexoraMVPObjectInteractionOverview(state);
  }
  return state;
}

/**
 * Close collection and restore prior semantic trail entry, or Overview.
 */
export function closeNexoraMVPExecutiveQueueCollection(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): NexoraMVPObjectInteractionState {
  if (state.collectionContext == null) return state;
  const sanitized = sanitizeStage2DNavigationTrail(
    state.stage2dNavigationTrail,
    catalog,
    state.workspace,
  );
  const stepped = stepBackExecutiveStage2DNavigationTrail(sanitized);
  const nextTrail = retainScopedTrail(sanitized, stepped);
  return applyExecutiveStage2DNavigationTrailFocus(state, nextTrail, catalog);
}

function contextSubjectsForObject(
  objectId: string,
  catalog: NexoraMVPObjectInteractionCatalog,
): readonly {
  readonly subject: NexoraMVPContextSubjectFixture;
  readonly relation: string;
}[] {
  const links = catalog.contextLinks.filter(
    (link) => link.objectId === objectId,
  );
  const resolved = links
    .map((link) => {
      const subject = catalog.contextSubjects.find(
        (entry) => entry.id === link.contextId,
      );
      if (!subject) return null;
      return Object.freeze({ subject, relation: link.relation });
    })
    .filter(
      (
        entry,
      ): entry is {
        readonly subject: NexoraMVPContextSubjectFixture;
        readonly relation: string;
      } => entry != null,
    );

  const sorted = [...resolved].sort((a, b) => {
    const kindDelta =
      KIND_ORDER.indexOf(a.subject.kind) - KIND_ORDER.indexOf(b.subject.kind);
    if (kindDelta !== 0) return kindDelta;
    return a.subject.id.localeCompare(b.subject.id);
  });

  return Object.freeze(
    sorted.slice(0, NEXORA_MVP_OBJECT_INTERACTION_BOUNDARY.maxContextSubjects),
  );
}

function objectsForContext(
  contextId: string,
  catalog: NexoraMVPObjectInteractionCatalog,
): readonly string[] {
  return Object.freeze(
    catalog.contextLinks
      .filter((link) => link.contextId === contextId)
      .map((link) => link.objectId)
      .filter((objectId, index, all) => all.indexOf(objectId) === index)
      .sort(),
  );
}

function contextLayoutPosition(
  kind: NexoraMVPContextSubjectKind,
  indexInKind: number,
  kindCount: number,
): readonly [number, number, number] {
  const base = KIND_BASE_ANGLE[kind];
  const spread = (indexInKind - (kindCount - 1) / 2) * 0.42;
  const angle = base + spread;
  const radius = 2.6;
  // STAGE-2D:2 — context nodes occupy the XY Stage plane.
  return [
    Math.cos(angle) * radius,
    Math.sin(angle) * radius,
    0,
  ] as const;
}

function stableObjectAnchor(
  objectId: string,
  index: number,
  total: number,
): readonly [number, number, number] {
  let hash = 0;
  for (let i = 0; i < objectId.length; i += 1) {
    hash = (hash * 31 + objectId.charCodeAt(i)) >>> 0;
  }
  const angle =
    ((hash % 360) / 360) * Math.PI * 2 +
    (index / Math.max(1, total)) * 0.35;
  const radius = 2.2;
  // STAGE-2D:2 — object anchors stay on the XY plane.
  return [Math.cos(angle) * radius, Math.sin(angle) * radius, 0] as const;
}

/**
 * Select a validated subject. Invalid IDs are ignored (state unchanged).
 * Preserves workspace, presentation state, and environment intent.
 *
 * STAGE-2D:5 — business-object selection updates the navigation trail
 * (interaction history). Context selection does not invent Stage object
 * trail edges; Advisor mentions do not update trail unless they select.
 */
export function selectNexoraMVPInteractionSubject(
  state: NexoraMVPObjectInteractionState,
  subjectId: string | null,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): NexoraMVPObjectInteractionState {
  if (subjectId == null) {
    return resetNexoraMVPObjectInteractionOverview(state);
  }

  // Collapsed Executive Thread — expand/collapse gateway; never become the focus.
  if (isCollapsedExecutiveThreadSubjectId(subjectId)) {
    const focusedBusinessObjectId = subjectId.slice("thread-".length);
    const focusedObject =
      resolveNexoraMVPInteractionSubject(focusedBusinessObjectId, catalog) ??
      (state.focusedSubject?.kind === "object" ? state.focusedSubject : null);
    if (focusedObject == null || focusedObject.kind !== "object") {
      return state;
    }
    const scopedTrail = ensureExecutiveStage2DScopedNavigationTrail(
      state.stage2dNavigationTrail,
      { workspace: state.workspace },
    );
    const trail =
      scopedTrail.activeObjectId === focusedObject.id
        ? scopedTrail
        : pushExecutiveStage2DScopedNavigationEntry(
            scopedTrail,
            focusedObject.id,
          );
    // STAGE-THREAD:1 — gateway click toggles expansion; never centers Thread.
    const alreadyExpanded =
      state.expandExecutiveThread === true &&
      state.focusedSubject?.id === focusedObject.id;
    return Object.freeze({
      ...state,
      mode: "object-focused",
      selectedSubject: focusedObject,
      focusedSubject: focusedObject,
      trail: resolveStage2DTrailSubjects(trail.objectIds, catalog),
      stage2dNavigationTrail: trail,
      expandExecutiveThread: !alreadyExpanded,
      collectionContext: null,
      preparationContext: null,
    });
  }

  const subject = resolveNexoraMVPInteractionSubject(subjectId, catalog);
  if (subject == null) {
    return state;
  }

  // STAGE-PROD:6 — preparation member click → semantic focus; close preparation.
  if (state.preparationContext != null) {
    const isMember = state.preparationContext.includedObjectIds.includes(
      subject.id,
    );
    if (isMember) {
      const nextTrail = pushExecutiveStage2DScopedNavigationEntry(
        sanitizeStage2DNavigationTrail(
          state.stage2dNavigationTrail,
          catalog,
          state.workspace,
        ),
        subject.id,
      );
      return Object.freeze({
        ...state,
        mode:
          subject.kind === "object"
            ? ("object-focused" as const)
            : ("context-focused" as const),
        selectedSubject: subject,
        focusedSubject: subject,
        trail: resolveStage2DTrailSubjects(nextTrail.objectIds, catalog),
        stage2dNavigationTrail: nextTrail,
        stage2dNavigationScopeStatus: "stable",
        expandExecutiveThread: false,
        collectionContext: null,
        preparationContext: null,
      });
    }
  }

  // STAGE-PROD:1 — collection member click → semantic focus + CENTER; close collection.
  if (state.collectionContext != null) {
    const isMember = state.collectionContext.objectIds.includes(subject.id);
    if (isMember) {
      const nextTrail = pushExecutiveStage2DScopedNavigationEntry(
        sanitizeStage2DNavigationTrail(
          state.stage2dNavigationTrail,
          catalog,
          state.workspace,
        ),
        subject.id,
      );
      return Object.freeze({
        ...state,
        mode:
          subject.kind === "object"
            ? ("object-focused" as const)
            : ("context-focused" as const),
        selectedSubject: subject,
        focusedSubject: subject,
        trail: resolveStage2DTrailSubjects(nextTrail.objectIds, catalog),
        stage2dNavigationTrail: nextTrail,
        stage2dNavigationScopeStatus: "stable",
        expandExecutiveThread: false,
        collectionContext: null,
        preparationContext: null,
      });
    }
  }

  if (subject.kind === "object") {
    const nextTrail = pushExecutiveStage2DScopedNavigationEntry(
      sanitizeStage2DNavigationTrail(
        state.stage2dNavigationTrail,
        catalog,
        state.workspace,
      ),
      subject.id,
    );
    return Object.freeze({
      ...state,
      mode: "object-focused",
      selectedSubject: subject,
      focusedSubject: subject,
      trail: resolveStage2DTrailSubjects(nextTrail.objectIds, catalog),
      stage2dNavigationTrail: nextTrail,
      stage2dNavigationScopeStatus: "stable",
      // STAGE-THREAD:1 — switching Business Object closes prior Thread.
      expandExecutiveThread: false,
      collectionContext: null,
      preparationContext: null,
    });
  }

  // STAGE-THREAD:1 — projected decision-subject click keeps business anchor.
  const linkedObjects = objectsForContext(subject.id, catalog);
  const businessAnchor =
    state.focusedSubject?.kind === "object"
      ? state.focusedSubject
      : linkedObjects[0] != null
        ? resolveNexoraMVPInteractionSubject(linkedObjects[0], catalog)
        : null;

  if (
    state.expandExecutiveThread === true &&
    businessAnchor != null &&
    businessAnchor.kind === "object"
  ) {
    const trailBase =
      state.trail.length > 0
        ? state.trail
        : Object.freeze([businessAnchor]);
    return Object.freeze({
      ...state,
      mode: "object-focused",
      selectedSubject: subject,
      focusedSubject: businessAnchor,
      trail: appendTrail(trailBase, subject),
      stage2dNavigationTrail: state.stage2dNavigationTrail,
      expandExecutiveThread: true,
      collectionContext: null,
      preparationContext: null,
    });
  }

  // STAGE-PROD:3 — focusing executive-work as primary (NBA inspect / direct)
  // pushes Stage-2D trail so Back/Forward recompute NBA from semantic context.
  // Thread-companion clicks are handled above (expandExecutiveThread + anchor).
  const nextTrail = pushExecutiveStage2DScopedNavigationEntry(
    sanitizeStage2DNavigationTrail(
      state.stage2dNavigationTrail,
      catalog,
      state.workspace,
    ),
    subject.id,
  );
  return Object.freeze({
    ...state,
    mode: "context-focused" as const,
    selectedSubject: subject,
    focusedSubject: subject,
    trail: resolveStage2DTrailSubjects(nextTrail.objectIds, catalog),
    stage2dNavigationTrail: nextTrail,
    stage2dNavigationScopeStatus: "stable",
    expandExecutiveThread: false,
    collectionContext: null,
    preparationContext: null,
  });
}

/** Step back one level: context → object → prior trail object → overview. */
export function stepBackNexoraMVPObjectInteraction(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): NexoraMVPObjectInteractionState {
  if (state.mode === "overview") {
    return resetNexoraMVPObjectInteractionOverview(state);
  }

  const sanitized = sanitizeStage2DNavigationTrail(
    state.stage2dNavigationTrail,
    catalog,
    state.workspace,
  );

  // Context focus keeps Stage-2D object tip — Back restores that object first
  // when the tip is a different business object (not the focused work subject).
  if (
    state.mode === "context-focused" &&
    state.focusedSubject != null &&
    state.focusedSubject.kind !== "object" &&
    !isExecutiveQueueCollectionTrailId(state.focusedSubject.id)
  ) {
    if (
      sanitized.activeObjectId != null &&
      sanitized.activeObjectId !== state.focusedSubject.id &&
      !isExecutiveQueueCollectionTrailId(sanitized.activeObjectId)
    ) {
      return applyExecutiveStage2DNavigationTrailFocus(
        state,
        sanitized,
        catalog,
      );
    }
    // If Stage-2D tip is the focused work subject (collection→member), fall through
    // to trail step-back so Collection / Overview restore correctly.
    if (
      sanitized.activeObjectId == null ||
      isExecutiveQueueCollectionTrailId(sanitized.activeObjectId)
    ) {
      const previous = [...state.trail]
        .reverse()
        .find(
          (entry) =>
            entry.kind === "object" &&
            !isExecutiveQueueCollectionTrailId(entry.id) &&
            entry.id !== state.focusedSubject?.id,
        );
      if (previous) {
        let trail = sanitized;
        if (trail.activeObjectId !== previous.id) {
          const existingIndex = trail.objectIds.lastIndexOf(previous.id);
          if (existingIndex >= 0) {
            trail = retainScopedTrail(
              trail,
              jumpExecutiveStage2DNavigationTrail(trail, existingIndex),
            );
          } else {
            trail = pushExecutiveStage2DScopedNavigationEntry(
              trail,
              previous.id,
            );
          }
        }
        return applyExecutiveStage2DNavigationTrailFocus(state, trail, catalog);
      }
      if (!canStepBackExecutiveStage2DNavigationTrail(sanitized)) {
        return resetNexoraMVPObjectInteractionOverview(state);
      }
    }
  }

  // STAGE-PROD:1 — collection / object trail authority is Stage-2D scoped trail.
  if (canStepBackExecutiveStage2DNavigationTrail(sanitized)) {
    // Back from first trail entry → Overview while retaining Forward tip.
    if (sanitized.currentIndex === 0 && sanitized.objectIds.length > 0) {
      return Object.freeze({
        ...state,
        mode: "overview" as const,
        selectedSubject: null,
        focusedSubject: null,
        trail: Object.freeze([]),
        stage2dNavigationTrail: Object.freeze({
          ...sanitized,
          activeObjectId: null,
          currentIndex: -1,
        }),
        stage2dNavigationScopeStatus: "stable",
        expandExecutiveThread: false,
        collectionContext: null,
        preparationContext: null,
      });
    }
    const stepped = stepBackExecutiveStage2DNavigationTrail(sanitized);
    const nextTrail = retainScopedTrail(sanitized, stepped);
    return applyExecutiveStage2DNavigationTrailFocus(state, nextTrail, catalog);
  }

  return resetNexoraMVPObjectInteractionOverview(state);
}

function retainScopedTrail(
  previous: ExecutiveStage2DScopedNavigationTrail,
  next: {
    readonly objectIds: readonly string[];
    readonly activeObjectId: string | null;
    readonly currentIndex: number;
  },
): ExecutiveStage2DScopedNavigationTrail {
  return Object.freeze({
    objectIds: next.objectIds,
    activeObjectId: next.activeObjectId,
    currentIndex: next.currentIndex,
    scope: previous.scope,
    scopeKey: previous.scopeKey,
  });
}

/** Optional Forward — restores truncated-forward tip when index allows. */
export function stepForwardNexoraMVPObjectInteraction(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): NexoraMVPObjectInteractionState {
  const sanitized = sanitizeStage2DNavigationTrail(
    state.stage2dNavigationTrail,
    catalog,
    state.workspace,
  );
  // STAGE-PROD:1 — Forward from Overview with retained tip restores first entry.
  if (
    sanitized.currentIndex < 0 &&
    sanitized.objectIds.length > 0
  ) {
    return applyExecutiveStage2DNavigationTrailFocus(
      state,
      retainScopedTrail(
        sanitized,
        jumpExecutiveStage2DNavigationTrail(sanitized, 0),
      ),
      catalog,
    );
  }
  if (state.mode === "overview") {
    return state;
  }
  const stepped = stepForwardExecutiveStage2DNavigationTrail(sanitized);
  if (stepped.currentIndex === sanitized.currentIndex) {
    return state;
  }
  return applyExecutiveStage2DNavigationTrailFocus(
    state,
    retainScopedTrail(sanitized, stepped),
    catalog,
  );
}

/**
 * Jump to a STAGE-2D:5/6 trail index (breadcrumb click).
 * Recomputes current neighborhood from live truth — no cached layout.
 */
export function jumpNexoraMVPObjectInteractionNavigationTrail(
  state: NexoraMVPObjectInteractionState,
  index: number,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): NexoraMVPObjectInteractionState {
  if (index < 0) {
    return resetNexoraMVPObjectInteractionOverview(state);
  }
  const sanitized = sanitizeStage2DNavigationTrail(
    state.stage2dNavigationTrail,
    catalog,
    state.workspace,
  );
  const jumped = jumpExecutiveStage2DNavigationTrail(sanitized, index);
  return applyExecutiveStage2DNavigationTrailFocus(
    state,
    retainScopedTrail(sanitized, jumped),
    catalog,
  );
}

/**
 * Overview reset: clears focus/selection/trail; preserves workspace,
 * presentation state, and environment intent.
 * STAGE-2D:5/6 — Overview is a reset boundary; navigation trail clears in-scope.
 */
export function resetNexoraMVPObjectInteractionOverview(
  state: NexoraMVPObjectInteractionState,
): NexoraMVPObjectInteractionState {
  const scoped = ensureExecutiveStage2DScopedNavigationTrail(
    state.stage2dNavigationTrail,
    { workspace: state.workspace },
  );
  return Object.freeze({
    ...state,
    mode: "overview",
    selectedSubject: null,
    focusedSubject: null,
    trail: Object.freeze([]),
    stage2dNavigationTrail: resetExecutiveStage2DScopedNavigationTrail(scoped),
    stage2dNavigationScopeStatus: "reset",
    expandExecutiveThread: false,
    collectionContext: null,
    preparationContext: null,
  });
}

/**
 * Sync shell workspace / presentation / environment into interaction state.
 * STAGE-2D:6 — same scope preserves trail; workspace/model change isolates via
 * `transitionExecutiveStage2DNavigationScope` (no multi-workspace history store).
 * Presentation-state / Data Reality refreshes do not reset the trail.
 */
export function syncNexoraMVPObjectInteractionShellContext(
  state: NexoraMVPObjectInteractionState,
  input: {
    readonly workspace: NexoraMVPWorkspaceKind;
    readonly presentationState: NexoraMVPPresentationState;
    readonly environmentIntent: NexoraMVPSceneEnvironmentIntent;
    readonly modelId?: string;
    readonly catalog?: NexoraMVPObjectInteractionCatalog;
  },
): NexoraMVPObjectInteractionState {
  const catalog =
    input.catalog ?? getDefaultNexoraMVPObjectInteractionCatalog();
  const previousTrail = ensureExecutiveStage2DScopedNavigationTrail(
    state.stage2dNavigationTrail,
    { workspace: state.workspace, modelId: input.modelId },
  );
  const focusCandidate =
    state.focusedSubject?.kind === "object"
      ? state.focusedSubject.id
      : state.selectedSubject?.kind === "object"
        ? state.selectedSubject.id
        : null;

  const transitioned = transitionExecutiveStage2DNavigationScope({
    previousTrail,
    nextWorkspace: input.workspace,
    nextModelId: input.modelId,
    currentFocusObjectId: focusCandidate,
    isValidInScope: (objectId) => isValidStageObjectId(objectId, catalog),
  });

  if (transitioned.scopeStatus === "stable") {
    return Object.freeze({
      ...state,
      workspace: input.workspace,
      presentationState: input.presentationState,
      environmentIntent: input.environmentIntent,
      stage2dNavigationTrail: transitioned.trail,
      stage2dNavigationScopeStatus: "stable",
    });
  }

  if (transitioned.scopeStatus === "sanitized") {
    if (transitioned.focusObjectId == null) {
      return Object.freeze({
        ...state,
        workspace: input.workspace,
        presentationState: input.presentationState,
        environmentIntent: input.environmentIntent,
        mode: "overview",
        selectedSubject: null,
        focusedSubject: null,
        trail: Object.freeze([]),
        stage2dNavigationTrail: transitioned.trail,
        stage2dNavigationScopeStatus: "sanitized",
        expandExecutiveThread: false,
      });
    }
    const subject = resolveNexoraMVPInteractionSubject(
      transitioned.focusObjectId,
      catalog,
    );
    return Object.freeze({
      ...state,
      workspace: input.workspace,
      presentationState: input.presentationState,
      environmentIntent: input.environmentIntent,
      mode: subject ? "object-focused" : "overview",
      selectedSubject: subject,
      focusedSubject: subject,
      trail: subject
        ? resolveStage2DTrailSubjects(transitioned.trail.objectIds, catalog)
        : Object.freeze([]),
      stage2dNavigationTrail: transitioned.trail,
      stage2dNavigationScopeStatus: "sanitized",
      expandExecutiveThread: false,
    });
  }

  // changed | reset — no old Forward branch / history leakage
  if (transitioned.focusObjectId == null) {
    return Object.freeze({
      ...state,
      workspace: input.workspace,
      presentationState: input.presentationState,
      environmentIntent: input.environmentIntent,
      mode: "overview",
      selectedSubject: null,
      focusedSubject: null,
      trail: Object.freeze([]),
      stage2dNavigationTrail: transitioned.trail,
      stage2dNavigationScopeStatus: transitioned.scopeStatus,
      expandExecutiveThread: false,
    });
  }

  const subject = resolveNexoraMVPInteractionSubject(
    transitioned.focusObjectId,
    catalog,
  );
  if (subject == null || subject.kind !== "object") {
    return Object.freeze({
      ...state,
      workspace: input.workspace,
      presentationState: input.presentationState,
      environmentIntent: input.environmentIntent,
      mode: "overview",
      selectedSubject: null,
      focusedSubject: null,
      trail: Object.freeze([]),
      stage2dNavigationTrail: createEmptyExecutiveStage2DScopedNavigationTrail({
        workspace: input.workspace,
        modelId: input.modelId,
      }),
      stage2dNavigationScopeStatus: "reset",
      expandExecutiveThread: false,
    });
  }

  return Object.freeze({
    ...state,
    workspace: input.workspace,
    presentationState: input.presentationState,
    environmentIntent: input.environmentIntent,
    mode: "object-focused",
    selectedSubject: subject,
    focusedSubject: subject,
    trail: resolveStage2DTrailSubjects(transitioned.trail.objectIds, catalog),
    stage2dNavigationTrail: transitioned.trail,
    stage2dNavigationScopeStatus: transitioned.scopeStatus,
    expandExecutiveThread: false,
  });
}

export function mapNexoraMVPInteractionStateToApplicationSubjects(
  state: NexoraMVPObjectInteractionState,
): {
  readonly selectedSubject: NexoraMVPSubjectReference | null;
  readonly focusedSubject: NexoraMVPSubjectReference | null;
} {
  return Object.freeze({
    selectedSubject: toAppSubject(state.selectedSubject),
    focusedSubject: toAppSubject(state.focusedSubject),
  });
}

function resolveInteractionDisclosure(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog,
): ExecutiveFocusSceneDisclosureResult {
  const focusedId = state.focusedSubject?.id ?? null;
  const focusedFamily =
    state.focusedSubject == null
      ? null
      : state.focusedSubject.kind === "object"
        ? ("business-object" as const)
        : ("executive-work" as const);

  const subjects = [
    ...catalog.objects.map((object) =>
      Object.freeze({
        subjectId: object.id,
        label: object.label,
        family: "business-object" as const,
        attention: object.attention,
        status: object.status,
      }),
    ),
    ...catalog.contextSubjects.map((subject) =>
      Object.freeze({
        subjectId: subject.id,
        label: subject.label,
        family: "executive-work" as const,
        workKind: subject.kind,
        attention: subject.attention,
        status: subject.status,
        linkedBusinessObjectIds: Object.freeze(
          catalog.contextLinks
            .filter((link) => link.contextId === subject.id)
            .map((link) => link.objectId),
        ),
      }),
    ),
  ];

  return resolveExecutiveFocusSceneDisclosure({
    subjects,
    relationships: catalog.relationships.map((relationship) =>
      Object.freeze({
        id: relationship.id,
        sourceId: relationship.sourceId,
        targetId: relationship.targetId,
      }),
    ),
    focusedSubjectId: focusedId,
    focusedSubjectFamily: focusedFamily,
    presentationDepth: state.presentationState,
    expandExecutiveThread:
      state.expandExecutiveThread === true ||
      state.mode === "context-focused",
  });
}

function buildContextNodes(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog,
  disclosure: ExecutiveFocusSceneDisclosureResult,
): readonly NexoraMVPContextNodePresentation[] {
  if (state.mode === "overview" || state.focusedSubject == null) {
    return Object.freeze([]);
  }

  const nodes: NexoraMVPContextNodePresentation[] = [];

  if (disclosure.collapsedThreadSubjectId != null) {
    const thread = disclosure.byId.get(disclosure.collapsedThreadSubjectId);
    if (thread != null && thread.state === "collapsed-thread") {
      const count = thread.collapsedMemberCount ?? 0;
      const gatewayPosition = resolveExecutiveThreadGatewayPosition({
        mode: "discoverable-collapsed",
      });
      nodes.push(
        Object.freeze({
          id: thread.subjectId,
          label: formatExecutiveThreadGatewayLabel(count),
          kind: "executive-thread",
          role: "collapsed-thread",
          // STAGE-THREAD:1-FIX — deterministic NE-preferred gateway sector.
          targetPosition: [
            gatewayPosition.x,
            gatewayPosition.y,
            0,
          ] as const,
          scale: 1,
          opacity: 0.98,
          selected: false,
          focused: false,
          attention: "elevated",
          status: "watch",
          relation: "collapsed-executive-thread",
          subjectId: thread.subjectId,
          disclosureState: "collapsed-thread",
          interactive: true,
          labelVisible: true,
          collapsedMemberIds: thread.collapsedMemberIds,
          gatewayMode: "discoverable-collapsed",
          gatewayCount: count,
        }),
      );
    }
  } else if (
    state.expandExecutiveThread === true &&
    state.focusedSubject?.kind === "object"
  ) {
    // STAGE-THREAD:1-FIX — quiet collapse control (discoverable gateway hidden).
    const projectable = resolveExecutiveThreadProjectableSubjects({
      anchorObjectId: state.focusedSubject.id,
      contextSubjects: catalog.contextSubjects,
      contextLinks: catalog.contextLinks,
    });
    if (projectable.length > 0) {
      const collapsePosition = resolveExecutiveThreadGatewayPosition({
        mode: "quiet-collapse",
      });
      nodes.push(
        Object.freeze({
          id: collapsedExecutiveThreadSubjectId(state.focusedSubject.id),
          label: "Collapse Thread",
          kind: "executive-thread",
          role: "collapsed-thread",
          targetPosition: [
            collapsePosition.x,
            collapsePosition.y,
            0,
          ] as const,
          scale: 0.85,
          opacity: 0.62,
          selected: false,
          focused: false,
          attention: "normal" as const,
          status: "stable" as const,
          relation: "collapsed-executive-thread",
          subjectId: collapsedExecutiveThreadSubjectId(state.focusedSubject.id),
          disclosureState: "collapsed-thread",
          interactive: true,
          labelVisible: true,
          collapsedMemberIds: Object.freeze(projectable.map((s) => s.id)),
          gatewayMode: "quiet-collapse",
          gatewayCount: projectable.length,
        }),
      );
    }
  }

  for (const entry of disclosure.entries) {
    if (entry.family !== "executive-work") continue;
    if (
      entry.state !== "visible-primary" &&
      entry.state !== "visible-related"
    ) {
      continue;
    }
    // STAGE-THREAD:1 — expanded executive-work projects as Stage objects
    // (not flat context rings). Skip context-node body for these.
    if (state.expandExecutiveThread === true) {
      continue;
    }
    const subject = catalog.contextSubjects.find(
      (candidate) => candidate.id === entry.subjectId,
    );
    if (subject == null) continue;
    const kindIndex = KIND_ORDER.indexOf(subject.kind);
    nodes.push(
      Object.freeze({
        id: subject.id,
        label: subject.label,
        kind: subject.kind,
        role: entry.state === "visible-primary" ? "focused" : "context",
        targetPosition: contextLayoutPosition(
          subject.kind,
          Math.max(0, kindIndex),
          KIND_ORDER.length,
        ),
        scale: entry.state === "visible-primary" ? 1.05 : 0.78,
        opacity: entry.state === "visible-primary" ? 1 : 0.92,
        selected: state.selectedSubject?.id === subject.id,
        focused: entry.state === "visible-primary",
        attention: subject.attention,
        status: subject.status,
        relation: "executive-work",
        subjectId: subject.id,
        disclosureState: entry.state,
        interactive: entry.interactive,
        labelVisible: entry.labelVisible,
      }),
    );
  }

  // Context-focused source anchor remains a Stage context companion.
  if (state.mode === "context-focused" && state.focusedSubject) {
    const sourceObject =
      state.trail.find((entry) => entry.kind === "object") ??
      (() => {
        const ids = objectsForContext(state.focusedSubject!.id, catalog);
        return ids[0]
          ? resolveNexoraMVPInteractionSubject(ids[0], catalog)
          : null;
      })();
    if (sourceObject) {
      nodes.push(
        Object.freeze({
          id: `anchor-${sourceObject.id}`,
          label: sourceObject.label,
          kind: "object",
          role: "source-anchor",
          targetPosition: stableObjectAnchor(sourceObject.id, 0, 1),
          scale: 0.7,
          opacity: 0.85,
          selected: false,
          focused: false,
          attention: "elevated",
          status: "stable",
          relation: "from-object",
          subjectId: sourceObject.id,
          disclosureState: "visible-related",
          interactive: true,
          labelVisible: true,
        }),
      );
    }
  }

  return Object.freeze(nodes);
}

function buildContextConnections(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog,
  contextNodes: readonly NexoraMVPContextNodePresentation[],
  disclosure: ExecutiveFocusSceneDisclosureResult,
): readonly NexoraMVPStageConnectionPresentation[] {
  if (state.focusedSubject == null) return Object.freeze([]);
  const visibleIds = new Set(contextNodes.map((node) => node.id));

  if (state.focusedSubject.kind === "object") {
    const connections: NexoraMVPStageConnectionPresentation[] = [];
    const collapsed = contextNodes.find(
      (node) => node.role === "collapsed-thread",
    );
    if (collapsed != null) {
      connections.push(
        Object.freeze({
          id: `thread-link-${state.focusedSubject.id}`,
          sourceId: state.focusedSubject.id,
          targetId: collapsed.id,
          emphasized: true,
          opacity: 0.55,
          visualRole: "context",
          impliesCausality: false,
        }),
      );
    }

    for (const link of catalog.contextLinks) {
      if (link.objectId !== state.focusedSubject.id) continue;
      if (!visibleIds.has(link.contextId)) continue;
      const entry = disclosure.byId.get(link.contextId);
      if (entry == null || entry.state === "hidden") continue;
      connections.push(
        Object.freeze({
          id: link.id,
          sourceId: link.objectId,
          targetId: link.contextId,
          emphasized: true,
          opacity: 0.62,
          visualRole: "context",
          impliesCausality: false,
        }),
      );
    }
    return Object.freeze(connections);
  }

  const sourceObject = state.trail.find((entry) => entry.kind === "object");
  if (!sourceObject) return Object.freeze([]);
  if (!visibleIds.has(state.focusedSubject.id)) return Object.freeze([]);

  return Object.freeze([
    Object.freeze({
      id: `ctx-link-${sourceObject.id}-${state.focusedSubject.id}`,
      sourceId: sourceObject.id,
      targetId: state.focusedSubject.id,
      emphasized: true,
      opacity: 0.7,
      visualRole: "context" as const,
      impliesCausality: false as const,
    }),
  ]);
}

/**
 * Derive Stage interaction presentation from interaction state.
 * Uses NEX-MVP:3 scene mapping for objects; adds context nodes.
 */
export function deriveNexoraMVPStageInteractionPresentation(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): NexoraMVPStageInteractionPresentation {
  const collectionActive = state.collectionContext != null;
  const preparationActive = state.preparationContext != null;
  const presentationContextActive = collectionActive || preparationActive;
  const focusedWorkSubject =
    !presentationContextActive &&
    state.focusedSubject != null &&
    state.focusedSubject.kind !== "object"
      ? state.focusedSubject
      : null;

  const focusedObjectId =
    presentationContextActive
      ? null
      : state.focusedSubject?.kind === "object"
        ? state.focusedSubject.id
        : focusedWorkSubject != null
          ? null
          : state.trail.find((entry) => entry.kind === "object")?.id ?? null;

  const selectedObjectId =
    presentationContextActive
      ? null
      : state.selectedSubject?.kind === "object"
        ? state.selectedSubject.id
        : focusedObjectId;

  const scene = resolveNexoraMVPStageScenePresentation({
    objects: catalog.objects,
    relationships: catalog.relationships,
    selectedObjectId:
      state.mode === "context-focused" && focusedWorkSubject == null
        ? focusedObjectId
        : selectedObjectId,
    focusedObjectId:
      state.mode === "overview" || presentationContextActive
        ? null
        : focusedObjectId,
    presentationState: state.presentationState,
    environmentIntent: state.environmentIntent,
  });

  // When context-focused, subordinate all objects except source + linked.
  let objects: readonly NexoraMVPStageObjectPresentation[] = scene.objects;
  let collectionHeader: NexoraMVPStageInteractionPresentation["collectionHeader"] =
    null;
  let livePreparationContext: ExecutivePreparationContext | null =
    state.preparationContext ?? null;
  let presentationMode:
    | "overview"
    | "object-focus"
    | "collection"
    | "preparation" =
    state.mode === "overview" ? "overview" : "object-focus";
  const queueEntries = [
    ...resolveExecutiveQueueEntries({
      subjects: catalog.contextSubjects.map((subject) =>
        Object.freeze({
          subjectId: subject.id,
          workKind: subject.kind,
          objectKind: subject.kind,
          attention: subject.attention,
          status: subject.status,
        }),
      ),
    }).map((entry) =>
      Object.freeze({
        category: entry.category,
        count: entry.count,
        objectIds: entry.objectIds,
        isSemanticObject: false as const,
        isActive:
          state.collectionContext?.category === entry.category,
        collectionKind: "object-kind" as const,
        label: EXECUTIVE_QUEUE_CATEGORY_LABELS[entry.category],
      }),
    ),
  ] as Array<{
    readonly category: ExecutiveQueueCategory | "changes-since-visit";
    readonly count: number;
    readonly objectIds: readonly string[];
    readonly isSemanticObject: false;
    readonly isActive: boolean;
    readonly collectionKind?: "object-kind" | "productivity";
    readonly label?: string;
  }>;

  // STAGE-PROD:2 — append Recent Changes productivity entry when meaningful.
  const changeSnapshot = buildNexoraMVPExecutiveChangeSnapshot(catalog, {
    workspace: state.workspace,
  });
  let acknowledged = getAcknowledgedExecutiveChangeBaseline(
    changeSnapshot.scopeKey,
  );
  if (acknowledged == null) {
    // First visit: establish baseline without flooding NEW; presentation stays stable.
    ensureExecutiveChangeBaseline({ currentSnapshot: changeSnapshot });
    acknowledged = getAcknowledgedExecutiveChangeBaseline(
      changeSnapshot.scopeKey,
    );
  }
  const changeComparison =
    state.collectionContext?.category === EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY
      ? getActiveExecutiveChangeInspection()?.comparison ??
        beginExecutiveChangeInspection({ currentSnapshot: changeSnapshot })
      : resolveExecutiveMeaningfulChanges({
          previousSnapshot: acknowledged,
          currentSnapshot: changeSnapshot,
        });
  const changeQueueEntry = resolveExecutiveChangeQueueEntry(changeComparison);
  if (changeQueueEntry != null) {
    queueEntries.push(
      Object.freeze({
        category: changeQueueEntry.category,
        count: changeQueueEntry.count,
        objectIds: changeQueueEntry.objectIds,
        isSemanticObject: false as const,
        isActive:
          state.collectionContext?.category ===
          EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY,
        collectionKind: "productivity" as const,
        label: EXECUTIVE_CHANGE_QUEUE_LABEL,
      }),
    );
  }

  // STAGE-PROD:6 — Preparation View: members in usable field; no semantic center.
  if (state.preparationContext != null) {
    presentationMode = "preparation";
    livePreparationContext = liveRecomputePreparationContext(
      state,
      catalog,
      changeComparison,
    );
    const includedIds = livePreparationContext?.includedObjectIds ?? [];
    const watchIds = livePreparationContext?.watchObjectIds ?? [];
    const layout = resolveExecutivePreparationLayout({
      objectIds: includedIds,
    });
    collectionHeader = null;

    const preparationIdSet = new Set(includedIds);
    const watchIdSet = new Set(watchIds);
    const reasonById = new Map(
      (livePreparationContext?.summary.priorityItems ?? []).map((item) => [
        item.objectId,
        item.reason,
      ]),
    );

    const projectedPreparation: NexoraMVPStageObjectPresentation[] =
      includedIds.map((objectId) => {
        const subject = catalog.contextSubjects.find((s) => s.id === objectId);
        const business = catalog.objects.find((o) => o.id === objectId);
        const label = subject?.label ?? business?.label ?? objectId;
        const kind = subject?.kind ?? business?.kind ?? "object";
        const attention =
          subject?.attention ?? business?.attention ?? "normal";
        const status = subject?.status ?? business?.status ?? "stable";
        const pos = layout.positions[objectId] ?? {
          x: 0.55,
          y: 0.35,
          z: 0 as const,
        };
        return Object.freeze({
          id: objectId,
          label,
          kind,
          role: "related" as const,
          overviewPosition: Object.freeze([pos.x, pos.y, 0] as const),
          targetPosition: Object.freeze([pos.x, pos.y, 0] as const),
          scale: 0.88,
          opacity: 0.96,
          emissiveIntensity: 0.12,
          labelProminence: "full" as const,
          selected: false,
          focused: false,
          attention: attention as NexoraMVPStageObjectPresentation["attention"],
          status,
          disclosureState: "visible-related" as const,
          interactive: true,
          labelVisible: true,
          visualGrammarRole: "related" as const,
          spatialRole: "collection" as const,
          labelPrimaryLine: label,
          labelSecondaryLine: reasonById.get(objectId) ?? null,
        });
      });

    objects = Object.freeze([
      ...scene.objects.map((object) => {
        if (preparationIdSet.has(object.id)) {
          const pos = layout.positions[object.id]!;
          return Object.freeze({
            ...object,
            role: "related" as const,
            targetPosition: Object.freeze([pos.x, pos.y, 0] as const),
            overviewPosition: Object.freeze([pos.x, pos.y, 0] as const),
            opacity: 0.96,
            scale: Math.max(object.scale, 0.88),
            labelProminence: "full" as const,
            disclosureState: "visible-related" as const,
            focused: false,
            selected: false,
            spatialRole: "collection" as const,
            labelPrimaryLine: object.label,
            labelSecondaryLine:
              reasonById.get(object.id) ?? object.labelSecondaryLine ?? null,
          });
        }
        if (watchIdSet.has(object.id)) {
          return Object.freeze({
            ...object,
            role: "unrelated" as const,
            opacity: Math.min(object.opacity, 0.45),
            labelProminence: "minimal" as const,
            disclosureState: "background-discoverable" as const,
            focused: false,
            selected: false,
            spatialRole: "watch" as const,
          });
        }
        return Object.freeze({
          ...object,
          role: "unrelated" as const,
          opacity: 0,
          scale: object.scale * 0.72,
          labelProminence: "minimal" as const,
          disclosureState: "hidden" as const,
          focused: false,
          selected: false,
          spatialRole: "hidden" as const,
        });
      }),
      ...projectedPreparation.filter(
        (entry) => !scene.objects.some((object) => object.id === entry.id),
      ),
    ]);
  } else if (state.collectionContext != null) {
    presentationMode = "collection";
    const isChangeCollection =
      state.collectionContext.category ===
      EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY;
    const collectionObjectIds = isChangeCollection
      ? rankExecutiveChangeCollectionMembers({
          changes: changeComparison.changes,
        }).visibleIds
      : state.collectionContext.objectIds;
    const collectionDisclosure = resolveExecutiveCollectionDisclosure({
      subjects: [
        ...catalog.objects.map((object) =>
          Object.freeze({
            subjectId: object.id,
            label: object.label,
            objectKind: object.kind,
            family: "business-object" as const,
            attention: object.attention,
            status: object.status,
          }),
        ),
        ...catalog.contextSubjects.map((subject) =>
          Object.freeze({
            subjectId: subject.id,
            label: subject.label,
            objectKind: subject.kind,
            workKind: subject.kind,
            family: "executive-work" as const,
            attention: subject.attention,
            status: subject.status,
          }),
        ),
      ],
      collection: Object.freeze({
        ...state.collectionContext,
        objectIds: collectionObjectIds,
      }),
      presentationDepth: state.presentationState,
    });
    const layout = resolveExecutiveCollectionLayout({
      objectIds: collectionDisclosure.collectionVisibleObjectIds,
    });
    collectionHeader = isChangeCollection
      ? resolveExecutiveChangeCollectionHeader({
          totalCount: changeComparison.changedObjectIds.length,
          visibleCount: collectionDisclosure.collectionVisibleObjectIds.length,
        })
      : resolveExecutiveCollectionHeader({
          category: state.collectionContext.category as ExecutiveQueueCategory,
          totalCount: collectionDisclosure.collectionTotalCount,
          visibleCount: collectionDisclosure.collectionVisibleObjectIds.length,
        });

    const collectionIdSet = new Set(
      collectionDisclosure.collectionVisibleObjectIds,
    );
    const watchIdSet = new Set(collectionDisclosure.watchObjectIds);
    const annotations = state.collectionContext.changeAnnotations ?? {};

    const projectedCollection: NexoraMVPStageObjectPresentation[] =
      collectionDisclosure.collectionVisibleObjectIds
        .map((objectId) => {
          const subject = catalog.contextSubjects.find((s) => s.id === objectId);
          const business = catalog.objects.find((o) => o.id === objectId);
          const label = subject?.label ?? business?.label ?? objectId;
          const kind = subject?.kind ?? business?.kind ?? "object";
          const attention =
            subject?.attention ?? business?.attention ?? "normal";
          const status = subject?.status ?? business?.status ?? "stable";
          const pos = layout.positions[objectId] ?? {
            x: 0.55,
            y: 0.35,
            z: 0 as const,
          };
          const annotation = annotations[objectId]?.annotation;
          return Object.freeze({
            id: objectId,
            label,
            kind,
            role: "related" as const,
            overviewPosition: Object.freeze([pos.x, pos.y, 0] as const),
            targetPosition: Object.freeze([pos.x, pos.y, 0] as const),
            scale: 0.88,
            opacity: 0.96,
            emissiveIntensity: 0.12,
            labelProminence: "full" as const,
            selected: false,
            focused: false,
            attention: attention as NexoraMVPStageObjectPresentation["attention"],
            status,
            disclosureState: "visible-related" as const,
            interactive: true,
            labelVisible: true,
            visualGrammarRole: "related" as const,
            spatialRole: "collection" as const,
            labelPrimaryLine: label,
            labelSecondaryLine: annotation ?? null,
          });
        });

    objects = Object.freeze([
      ...scene.objects.map((object) => {
        if (collectionIdSet.has(object.id)) {
          const pos = layout.positions[object.id]!;
          const annotation = annotations[object.id]?.annotation;
          return Object.freeze({
            ...object,
            role: "related" as const,
            targetPosition: Object.freeze([pos.x, pos.y, 0] as const),
            overviewPosition: Object.freeze([pos.x, pos.y, 0] as const),
            opacity: 0.96,
            scale: Math.max(object.scale, 0.88),
            labelProminence: "full" as const,
            disclosureState: "visible-related" as const,
            focused: false,
            selected: false,
            spatialRole: "collection" as const,
            labelPrimaryLine: object.label,
            labelSecondaryLine: annotation ?? object.labelSecondaryLine ?? null,
          });
        }
        if (watchIdSet.has(object.id)) {
          return Object.freeze({
            ...object,
            role: "unrelated" as const,
            opacity: Math.min(object.opacity, 0.45),
            labelProminence: "minimal" as const,
            disclosureState: "background-discoverable" as const,
            focused: false,
            selected: false,
            spatialRole: "watch" as const,
          });
        }
        return Object.freeze({
          ...object,
          role: "unrelated" as const,
          opacity: 0,
          scale: object.scale * 0.72,
          labelProminence: "minimal" as const,
          disclosureState: "hidden" as const,
          focused: false,
          selected: false,
          spatialRole: "hidden" as const,
        });
      }),
      ...projectedCollection.filter(
        (entry) => !scene.objects.some((object) => object.id === entry.id),
      ),
    ]);
  } else if (state.mode === "context-focused" && state.focusedSubject) {
    const linked = new Set(objectsForContext(state.focusedSubject.id, catalog));
    const sourceId = focusedObjectId;
    objects = Object.freeze(
      scene.objects.map((object) => {
        const isSource = object.id === sourceId;
        const isLinked = linked.has(object.id);
        if (isSource) {
          return Object.freeze({
            ...object,
            role: "related" as const,
            targetPosition: stableObjectAnchor(object.id, 0, 1),
            scale: Math.max(object.scale, 1.05),
            opacity: 0.95,
            labelProminence: "full" as const,
            focused: false,
            selected: false,
          });
        }
        if (isLinked) {
          return Object.freeze({
            ...object,
            role: "related" as const,
            opacity: 0.88,
            labelProminence: "reduced" as const,
          });
        }
        return Object.freeze({
          ...object,
          role: "unrelated" as const,
          opacity: 0.22,
          scale: object.scale * 0.85,
          labelProminence: "minimal" as const,
          emissiveIntensity: 0.02,
        });
      }),
    );
  }

  // STAGE-PROD:1 — collection member (executive-work) becomes CENTER (0,0).
  if (focusedWorkSubject != null) {
    const linked = new Set(objectsForContext(focusedWorkSubject.id, catalog));
    const centerObject: NexoraMVPStageObjectPresentation = Object.freeze({
      id: focusedWorkSubject.id,
      label: focusedWorkSubject.label,
      kind: focusedWorkSubject.kind,
      role: "focused" as const,
      overviewPosition: Object.freeze([0, 0, 0] as const),
      targetPosition: Object.freeze([0, 0, 0] as const),
      scale: 1.08,
      opacity: 1,
      emissiveIntensity: 0.42,
      labelProminence: "full" as const,
      selected: state.selectedSubject?.id === focusedWorkSubject.id,
      focused: true,
      attention: (catalog.contextSubjects.find(
        (s) => s.id === focusedWorkSubject.id,
      )?.attention ?? "important") as NexoraMVPStageObjectPresentation["attention"],
      status:
        catalog.contextSubjects.find((s) => s.id === focusedWorkSubject.id)
          ?.status ?? "watch",
      disclosureState: "visible-primary" as const,
      interactive: true,
      labelVisible: true,
      visualGrammarRole: "primary" as const,
      spatialRole: "center" as const,
    });
    objects = Object.freeze([
      ...objects.map((object) => {
        if (linked.has(object.id)) {
          return Object.freeze({
            ...object,
            role: "related" as const,
            opacity: Math.max(object.opacity, 0.88),
            labelProminence: "reduced" as const,
            disclosureState: "visible-related" as const,
            spatialRole: "related" as const,
            focused: false,
          });
        }
        return Object.freeze({
          ...object,
          role: "unrelated" as const,
          opacity: Math.min(object.opacity, 0.28),
          labelProminence: "minimal" as const,
          disclosureState:
            object.disclosureState === "background-discoverable"
              ? object.disclosureState
              : ("hidden" as const),
          spatialRole:
            object.spatialRole === "watch" ? ("watch" as const) : ("hidden" as const),
          focused: false,
          selected: false,
        });
      }),
      centerObject,
    ]);
  }

  const disclosure = resolveInteractionDisclosure(state, catalog);
  const rawContextNodes = presentationContextActive
    ? Object.freeze([] as NexoraMVPContextNodePresentation[])
    : focusedWorkSubject != null
      ? Object.freeze([] as NexoraMVPContextNodePresentation[])
      : buildContextNodes(state, catalog, disclosure);

  // STAGE-THREAD:1 — project canonical executive-work as real Stage objects.
  const threadAnchorId =
    presentationContextActive || focusedWorkSubject != null
      ? null
      : state.focusedSubject?.kind === "object"
        ? state.focusedSubject.id
        : focusedObjectId;
  const threadExpanded =
    !presentationContextActive &&
    state.expandExecutiveThread === true &&
    threadAnchorId != null;
  const projectedThreadSubjects =
    threadExpanded && threadAnchorId != null
      ? resolveExecutiveThreadProjectableSubjects({
          anchorObjectId: threadAnchorId,
          contextSubjects: catalog.contextSubjects,
          contextLinks: catalog.contextLinks,
        }).filter((subject) => {
          const entry = disclosure.byId.get(subject.id);
          return (
            entry != null &&
            (entry.state === "visible-primary" ||
              entry.state === "visible-related")
          );
        })
      : Object.freeze([]);

  const projectedThreadObjects: NexoraMVPStageObjectPresentation[] =
    projectedThreadSubjects.map((subject) => {
      const sector = resolveExecutiveThreadSectorPosition(subject.kind);
      const selected = state.selectedSubject?.id === subject.id;
      const labels = formatExecutiveThreadSubjectLabel({
        label: subject.label,
        kind: subject.kind,
        presentationLevel: state.presentationState,
      });
      return Object.freeze({
        id: subject.id,
        label: subject.label,
        kind: subject.kind,
        role: selected ? ("related" as const) : ("related" as const),
        overviewPosition: Object.freeze([sector.x, sector.y, 0] as const),
        targetPosition: Object.freeze([sector.x, sector.y, 0] as const),
        scale: selected ? 0.92 : 0.84,
        opacity: selected ? 0.98 : 0.9,
        emissiveIntensity: selected ? 0.18 : 0.1,
        labelProminence: "full" as const,
        selected,
        focused: false,
        attention: subject.attention as NexoraMVPStageObjectPresentation["attention"],
        status: subject.status,
        disclosureState: "visible-related" as const,
        interactive: true,
        labelVisible: true,
        labelPrimaryLine: labels.primaryLine,
        labelSecondaryLine: labels.secondaryLine,
        presentationRegion: "executive-thread" as const,
        visualGrammarRole: "executive-thread" as const,
      });
    });

  if (projectedThreadObjects.length > 0) {
    const projectedIds = new Set(projectedThreadObjects.map((o) => o.id));
    objects = Object.freeze([
      ...objects
        .filter((object) => !projectedIds.has(object.id))
        .map((object) => {
          // Soften business peers while Thread is expanded (anchor stays dominant).
          if (object.id === threadAnchorId) return object;
          if (object.role === "focused") return object;
          return Object.freeze({
            ...object,
            opacity: Math.min(object.opacity, 0.62),
            scale: object.scale * 0.92,
            labelProminence:
              object.labelProminence === "full"
                ? ("reduced" as const)
                : object.labelProminence,
          });
        }),
      ...projectedThreadObjects,
    ]);
  }

  // SP:4.1C — Business Network + Executive Thread share separation grammar.
  const grammarSubjects = [
    ...objects
      .filter((object) => object.disclosureState !== "hidden")
      .map((object) =>
        Object.freeze({
          subjectId: object.id,
          label: object.label,
          family: isExecutiveThreadWorkKind(object.kind)
            ? ("executive-work" as const)
            : ("business-object" as const),
          objectKind: object.kind,
          workKind: isExecutiveThreadWorkKind(object.kind)
            ? object.kind
            : undefined,
          disclosureState: object.disclosureState,
          roleHint: object.role,
          attention: object.attention,
          status: object.status,
          position: object.targetPosition,
          scale: object.scale,
        }),
      ),
    ...rawContextNodes.map((node) =>
      Object.freeze({
        subjectId: node.id,
        label: node.label,
        family:
          node.role === "collapsed-thread"
            ? ("collapsed-thread" as const)
            : node.kind === "object"
              ? ("business-object" as const)
              : ("executive-work" as const),
        objectKind:
          node.kind === "executive-thread"
            ? "insight"
            : node.kind === "object"
              ? "object"
              : node.kind,
        workKind:
          node.kind === "problem" ||
          node.kind === "scenario" ||
          node.kind === "decision" ||
          node.kind === "execution"
            ? node.kind
            : node.kind === "executive-thread"
              ? ("executive-thread" as const)
              : undefined,
        disclosureState: node.disclosureState,
        roleHint: node.role,
        attention: node.attention,
        status: node.status,
        position: node.targetPosition,
        scale: node.scale,
      }),
    ),
  ];

  const grammar = resolveExecutiveFocusVisualGrammar({
    mode:
      state.mode === "overview" || presentationContextActive
        ? "overview"
        : "focus",
    presentationDepth: state.presentationState,
    focusedSubjectId:
      focusedWorkSubject?.id ??
      (state.focusedSubject?.kind === "object"
        ? state.focusedSubject.id
        : state.trail.find((entry) => entry.kind === "object")?.id ??
          state.focusedSubject?.id ??
          null),
    cameraPosition: Object.freeze({
      x: scene.camera.position[0],
      y: scene.camera.position[1],
      z: scene.camera.position[2],
    }),
    cameraTarget: Object.freeze({
      x: scene.camera.target[0],
      y: scene.camera.target[1],
      z: scene.camera.target[2],
    }),
    cameraFov: scene.camera.fov,
    subjects: grammarSubjects,
  });

  // Collection/preparation layout owns XY — do not let focus grammar overwrite.
  if (!presentationContextActive) {
    objects = Object.freeze(
      objects.map((object) => {
        const entry = grammar.byId.get(object.id);
        if (entry == null || object.disclosureState === "hidden") return object;
        if (focusedWorkSubject != null && object.id === focusedWorkSubject.id) {
          return Object.freeze({
            ...object,
            targetPosition: Object.freeze([0, 0, 0] as const),
            scale: Math.max(object.scale, entry.scale),
            labelProminence: "full" as const,
            visualGrammarRole: "primary" as const,
            labelPrimaryLine: entry.label.primaryLine,
            labelSecondaryLine: entry.label.secondaryLine,
          });
        }
        const threadLabels = isExecutiveThreadWorkKind(object.kind)
          ? formatExecutiveThreadSubjectLabel({
              label: object.label,
              kind: object.kind,
              presentationLevel: state.presentationState,
            })
          : null;
        return Object.freeze({
          ...object,
          targetPosition: entry.targetPosition,
          scale: entry.scale,
          labelProminence: entry.label.prominence,
          visualGrammarRole: entry.visualRole,
          labelPrimaryLine: threadLabels?.primaryLine ?? entry.label.primaryLine,
          labelSecondaryLine:
            threadLabels?.secondaryLine ?? entry.label.secondaryLine,
          labelAnchorBoost: entry.labelAnchorBoost,
        });
      }),
    );
  }

  const contextNodes = Object.freeze(
    rawContextNodes.map((node) => {
      const entry = grammar.byId.get(node.id);
      if (entry == null) return node;
      // Avoid "PROBLEM · PROBLEM · …" double-kind merge.
      const label =
        node.role === "collapsed-thread"
          ? node.label
          : entry.label.secondaryLine != null &&
              !entry.label.primaryLine
                .toLowerCase()
                .includes((entry.label.secondaryLine ?? "").toLowerCase())
            ? `${entry.label.primaryLine} · ${entry.label.secondaryLine}`
            : entry.label.primaryLine;
      return Object.freeze({
        ...node,
        targetPosition: entry.targetPosition,
        scale: entry.scale,
        label,
      });
    }),
  );

  const contextConnections = presentationContextActive
    ? Object.freeze([] as NexoraMVPStageConnectionPresentation[])
    : buildContextConnections(
        state,
        catalog,
        contextNodes,
        disclosure,
      );

  // STAGE-THREAD:1 — canonical object↔context links as Stage connections.
  const projectedIds = new Set(projectedThreadObjects.map((o) => o.id));
  const threadConnections: NexoraMVPStageConnectionPresentation[] = [];
  if (!presentationContextActive && threadExpanded && threadAnchorId != null) {
    for (const link of catalog.contextLinks) {
      if (link.objectId !== threadAnchorId) continue;
      if (!projectedIds.has(link.contextId)) continue;
      threadConnections.push(
        Object.freeze({
          id: link.id,
          sourceId: link.objectId,
          targetId: link.contextId,
          emphasized: true,
          opacity: 0.7,
          visualRole: "context" as const,
          relation: link.relation,
          impliesCausality: false as const,
        }),
      );
    }
  }

  const emphasizedObjectIds = Object.freeze(
    objects
      .filter((entry) => entry.role === "focused" || entry.role === "related")
      .map((entry) => entry.id),
  );
  const subordinateObjectIds = Object.freeze(
    objects
      .filter((entry) => entry.role === "unrelated")
      .map((entry) => entry.id),
  );
  const mergedConnections = Object.freeze(
    presentationContextActive
      ? []
      : [...scene.connections, ...threadConnections],
  );
  const emphasizedRelationshipIds = Object.freeze(
    mergedConnections
      .filter((entry) => entry.emphasized)
      .map((entry) => entry.id),
  );

  const businessFocusedId =
    state.focusedSubject?.kind === "object"
      ? state.focusedSubject.id
      : scene.focusedObjectId;

  const adjustedScene: NexoraMVPStageScenePresentation = Object.freeze({
    ...scene,
    mode:
      state.mode === "overview" || presentationContextActive
        ? "overview"
        : "focus",
    objects,
    connections: mergedConnections,
    focusedObjectId:
      state.mode === "overview" || presentationContextActive
        ? null
        : focusedWorkSubject?.id ?? businessFocusedId,
    selectedObjectId:
      presentationContextActive
        ? null
        : state.selectedSubject?.kind === "object"
          ? state.selectedSubject.id
          : focusedWorkSubject?.id ??
            // Keep business selection pointer for Stage when a thread subject is selected.
            businessFocusedId,
  });

  const threadExpansion = resolveExecutiveThreadExpansionState({
    expandExecutiveThread: state.expandExecutiveThread,
    anchorObjectId: businessFocusedId,
    selectedSubjectId: state.selectedSubject?.id ?? null,
  });
  const breadcrumbRoot: NexoraMVPInteractionSubject = Object.freeze({
    id: "trail-overview",
    kind: "object",
    label: "Overview",
  });

  const navigationTrail = sanitizeStage2DNavigationTrail(
    state.stage2dNavigationTrail,
    catalog,
    state.workspace,
  );
  const visibleTrail = resolveExecutiveStage2DNavigationBreadcrumbWindow(
    navigationTrail,
  );
  const labelsById: Record<string, string> = {};
  for (const subject of resolveStage2DTrailSubjects(
    navigationTrail.objectIds,
    catalog,
  )) {
    labelsById[subject.id] = subject.label;
  }
  for (const subject of state.trail) {
    if (labelsById[subject.id] == null) labelsById[subject.id] = subject.label;
  }
  const labelResolutions = resolveExecutiveStage2DBreadcrumbLabels({
    trail: navigationTrail,
    window: visibleTrail,
    labelsById,
  });
  const visibleBreadcrumbSubjects = labelResolutions.map((entry) =>
    Object.freeze({
      id: entry.objectId,
      kind: "object" as const,
      label: entry.displayLabel,
      navigationTrailIndex: entry.trailIndex,
      navigationLabelFull: entry.fullLabel,
      navigationLabelMode: entry.mode,
    }),
  );

  // Context-focused: retain context entry at tip for orientation.
  // STAGE-THREAD:1 — do not append Thread gateway or decision subjects to
  // business-object Stage-2D navigation breadcrumb.
  const breadcrumbTail =
    state.mode === "context-focused" &&
    state.focusedSubject != null &&
    state.focusedSubject.kind !== "object"
      ? Object.freeze([
          ...visibleBreadcrumbSubjects,
          state.focusedSubject,
        ])
      : visibleBreadcrumbSubjects.length > 0
        ? visibleBreadcrumbSubjects
        : state.trail.filter((entry) => entry.kind === "object");

  const nextBestAction = resolveNexoraMVPNextBestActions(
    state,
    catalog,
    changeComparison,
  );
  const decisionBrief = resolveNexoraMVPDecisionBrief(
    state,
    catalog,
    changeComparison,
    nextBestAction,
  );
  const decisionMemory = resolveNexoraMVPDecisionMemoryView(state, catalog);

  return Object.freeze({
    mode: state.mode,
    scene: adjustedScene,
    contextNodes,
    contextConnections,
    breadcrumb: Object.freeze([breadcrumbRoot, ...breadcrumbTail]),
    canStepBack:
      state.mode === "context-focused" ||
      canStepBackExecutiveStage2DNavigationTrail(navigationTrail),
    canStepForward:
      (navigationTrail.currentIndex < 0 &&
        navigationTrail.objectIds.length > 0) ||
      canStepForwardExecutiveStage2DNavigationTrail(navigationTrail),
    stage2dNavigationTrail: navigationTrail,
    stage2dNavigationScopeStatus: state.stage2dNavigationScopeStatus ?? "stable",
    breadcrumbHasOverflow:
      visibleTrail.hasOverflowBefore || visibleTrail.hasOverflowAfter,
    breadcrumbHasOverflowBefore: visibleTrail.hasOverflowBefore,
    breadcrumbHasOverflowAfter: visibleTrail.hasOverflowAfter,
    breadcrumbVisibleStartIndex: visibleTrail.visibleStartIndex,
    breadcrumbOverflowBefore: visibleTrail.overflowBefore,
    breadcrumbOverflowAfter: visibleTrail.overflowAfter,
    focusedSubjectId: state.focusedSubject?.id ?? null,
    selectedSubjectId: state.selectedSubject?.id ?? null,
    emphasizedObjectIds,
    subordinateObjectIds,
    emphasizedRelationshipIds,
    threadExpansion: Object.freeze({
      expanded: threadExpansion.expanded,
      anchorObjectId: threadExpansion.anchorObjectId,
      threadId: threadExpansion.threadId,
      selectedSubjectId: threadExpansion.selectedSubjectId,
      subjects: projectedThreadSubjects.map((subject) =>
        Object.freeze({
          id: subject.id,
          label: subject.label,
          kind: subject.kind,
        }),
      ),
    }),
    presentationMode,
    collectionContext: state.collectionContext ?? null,
    preparationContext: livePreparationContext,
    collectionHeader,
    queueEntries: Object.freeze(queueEntries),
    changeComparison,
    nextBestAction,
    decisionBrief,
    decisionMemory,
  });
}

export function buildNexoraMVPAdvisorContextBridge(
  state: NexoraMVPObjectInteractionState,
  presentation: NexoraMVPStageInteractionPresentation,
): NexoraMVPAdvisorContextBridge {
  const subjects = mapNexoraMVPInteractionStateToApplicationSubjects(state);
  const projectedIds = new Set(
    (presentation.threadExpansion?.subjects ?? []).map((s) => s.id),
  );
  const primary = resolveNexoraMVPPrimaryStageSubject(state);
  const collection = state.collectionContext ?? null;
  const preparation =
    presentation.preparationContext ?? state.preparationContext ?? null;
  const advisorPresentationContext =
    preparation != null
      ? preparation.mode === "daily"
        ? "Daily Preparation"
        : `${preparation.subject?.label?.trim() || "Meeting"} · Prepared Context`
      : collection != null
        ? collection.category === EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY
          ? `${EXECUTIVE_CHANGE_QUEUE_LABEL} · ${collection.objectIds.length} meaningful changes`
          : `${EXECUTIVE_QUEUE_CATEGORY_LABELS[collection.category]} Collection · ${collection.objectIds.length} objects`
        : null;
  return Object.freeze({
    selectedSubject: subjects.selectedSubject,
    focusedSubject: subjects.focusedSubject,
    primaryStageSubjectId: primary.primaryStageSubjectId,
    advisorSubjectId: primary.advisorSubjectId,
    // STAGE-THREAD:1 — business kind when Thread is expanded; selected may be work.
    subjectKind:
      collection != null || preparation != null
        ? null
        : state.focusedSubject?.kind === "object"
          ? "object"
          : (state.focusedSubject?.kind ?? null),
    relatedSubjectIds: presentation.emphasizedObjectIds,
    contextSubjectIds: Object.freeze([
      ...presentation.contextNodes
        .filter(
          (node) =>
            node.role === "context" ||
            node.role === "focused" ||
            node.role === "collapsed-thread",
        )
        .map((node) => node.id),
      ...projectedIds,
    ]),
    activeWorkspace: state.workspace,
    presentationState: state.presentationState,
    environmentIntent: state.environmentIntent,
    interactionMode: state.mode,
    breadcrumb: presentation.breadcrumb,
    presentationMode: primary.presentationMode,
    advisorPresentationContext,
    collectionCategory: collection?.category ?? null,
    collectionObjectCount: collection?.objectIds.length ?? 0,
    changeCountsByKind:
      collection?.category === EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY
        ? (presentation.changeComparison?.countsByKind ?? null)
        : null,
    preparationMode: preparation?.mode ?? null,
    preparationSubjectLabel: preparation?.subject?.label ?? null,
    preparationSummary: preparation?.summary ?? null,
    preparationContext: preparation,
    nbaSubjectId: primary.primaryStageSubjectId,
    nextBestAction: presentation.nextBestAction ?? null,
    briefSubjectId: primary.primaryStageSubjectId,
    decisionBrief: presentation.decisionBrief ?? null,
    decisionMemorySubjectId:
      presentation.decisionMemory?.available === true
        ? primary.primaryStageSubjectId
        : null,
    decisionMemory: presentation.decisionMemory ?? null,
  });
}

/**
 * STAGE-PROD:3 — resolve NBA for current interaction (object-focus only).
 */
function toProductivityPresentationMode(
  mode:
    | "overview"
    | "object-focus"
    | "collection"
    | "preparation",
): "overview" | "object-focus" | "collection" {
  if (mode === "object-focus") return "object-focus";
  if (mode === "collection") return "collection";
  return "overview";
}

export function resolveNexoraMVPNextBestActions(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
  changeComparison?: ExecutiveChangeComparisonResult | null,
): ExecutiveNextBestActionResult {
  const primary = resolveNexoraMVPPrimaryStageSubject(state);
  const subjects: ExecutiveNbaSubjectInput[] = [
    ...catalog.objects.map((object) =>
      Object.freeze({
        subjectId: object.id,
        objectKind: object.kind,
        label: object.label,
        attention: object.attention,
        status: object.status,
        executiveState:
          object.attention === "critical"
            ? "critical"
            : object.attention === "important" || object.attention === "elevated"
              ? "attention"
              : "normal",
        unresolved: object.status === "risk",
        family: "business-object" as const,
      }),
    ),
    ...catalog.contextSubjects.map((subject) =>
      Object.freeze({
        subjectId: subject.id,
        objectKind: subject.kind,
        label: subject.label,
        attention: subject.attention,
        status: subject.status,
        executiveState:
          subject.attention === "critical"
            ? "critical"
            : subject.attention === "important" ||
                subject.attention === "elevated"
              ? "attention"
              : "normal",
        unresolved: subject.status === "risk",
        family: "executive-work" as const,
      }),
    ),
  ];
  return resolveExecutiveNextBestActions({
    presentationMode: toProductivityPresentationMode(primary.presentationMode),
    primaryStageSubjectId: primary.primaryStageSubjectId,
    subjects,
    links: catalog.contextLinks.map((link) =>
      Object.freeze({
        objectId: link.objectId,
        contextId: link.contextId,
        relation: link.relation,
      }),
    ),
    changeComparison: changeComparison ?? null,
  });
}

/**
 * STAGE-PROD:4 — resolve Decision Brief for current interaction.
 * Reuses the authoritative PROD:3 NBA result for recommendation.
 */
export function resolveNexoraMVPDecisionBrief(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
  changeComparison?: ExecutiveChangeComparisonResult | null,
  nextBestAction?: ExecutiveNextBestActionResult | null,
): ExecutiveDecisionBriefResult {
  const primary = resolveNexoraMVPPrimaryStageSubject(state);
  const subjects: ExecutiveBriefSubjectInput[] = [
    ...catalog.objects.map((object) =>
      Object.freeze({
        subjectId: object.id,
        objectKind: object.kind,
        label: object.label,
        attention: object.attention,
        status: object.status,
        executiveState:
          object.attention === "critical"
            ? "critical"
            : object.attention === "important" || object.attention === "elevated"
              ? "attention"
              : "normal",
        unresolved: object.status === "risk" || object.status === "unresolved",
        family: "business-object" as const,
      }),
    ),
    ...catalog.contextSubjects.map((subject) =>
      Object.freeze({
        subjectId: subject.id,
        objectKind: subject.kind,
        label: subject.label,
        attention: subject.attention,
        status: subject.status,
        executiveState:
          subject.attention === "critical"
            ? "critical"
            : subject.attention === "important" ||
                subject.attention === "elevated"
              ? "attention"
              : "normal",
        unresolved: subject.status === "risk" || subject.status === "watch",
        family: "executive-work" as const,
      }),
    ),
  ];
  const nba =
    nextBestAction ??
    resolveNexoraMVPNextBestActions(state, catalog, changeComparison);
  return resolveExecutiveDecisionBrief({
    presentationMode: toProductivityPresentationMode(primary.presentationMode),
    primaryStageSubjectId: primary.primaryStageSubjectId,
    subjects,
    links: catalog.contextLinks.map((link) =>
      Object.freeze({
        objectId: link.objectId,
        contextId: link.contextId,
        relation: link.relation,
        linkId: link.id,
      }),
    ),
    relationships: catalog.relationships.map((relationship) =>
      Object.freeze({
        id: relationship.id,
        sourceId: relationship.sourceId,
        targetId: relationship.targetId,
      }),
    ),
    changeComparison: changeComparison ?? null,
    nextBestAction: nba,
  });
}

/**
 * STAGE-PROD:5 — resolve Decision Memory view for Decision focus.
 */
export function resolveNexoraMVPDecisionMemoryView(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): ExecutiveDecisionMemoryView {
  const primary = resolveNexoraMVPPrimaryStageSubject(state);
  const focused = state.focusedSubject;
  const scopeKey = buildExecutiveDecisionMemoryScopeKey({
    workspace: state.workspace,
  });
  return resolveExecutiveDecisionMemoryView({
    presentationMode: toProductivityPresentationMode(primary.presentationMode),
    primaryStageSubjectId: primary.primaryStageSubjectId,
    primarySubjectKind:
      focused?.kind === "object" ? "object" : (focused?.kind ?? null),
    scopeKey,
    subjects: [
      ...catalog.objects.map((object) =>
        Object.freeze({
          subjectId: object.id,
          objectKind: object.kind,
          label: object.label,
          attention: object.attention,
          status: object.status,
          family: "business-object" as const,
        }),
      ),
      ...catalog.contextSubjects.map((subject) =>
        Object.freeze({
          subjectId: subject.id,
          objectKind: subject.kind,
          label: subject.label,
          attention: subject.attention,
          status: subject.status,
          family: "executive-work" as const,
        }),
      ),
    ],
  });
}

/**
 * STAGE-PROD:5 — capture Decision Memory at finalization boundary.
 */
export function recordNexoraMVPDecisionMemory(
  state: NexoraMVPObjectInteractionState,
  input: {
    readonly decisionObjectId: string;
    readonly decisionStatus: string;
    readonly decisionVersion?: string;
    readonly selectedOptionId?: string | null;
    readonly explicitRationale?: {
      readonly text: string;
      readonly reasonCodes?: readonly string[];
    } | null;
    readonly decisionRecordReason?: string | null;
    readonly expectedOutcomes?: readonly ExecutiveExpectedOutcome[];
    readonly executionLinks?: readonly ExecutiveDecisionExecutionLink[];
    readonly recordedAt?: string;
  },
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): ReturnType<typeof recordExecutiveDecisionMemory> {
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  return recordExecutiveDecisionMemory({
    decisionObjectId: input.decisionObjectId,
    decisionStatus: input.decisionStatus,
    decisionVersion: input.decisionVersion,
    recordedAt: input.recordedAt,
    scopeKey: buildExecutiveDecisionMemoryScopeKey({
      workspace: state.workspace,
    }),
    subjects: [
      ...catalog.objects.map((object) =>
        Object.freeze({
          subjectId: object.id,
          objectKind: object.kind,
          label: object.label,
          attention: object.attention,
          status: object.status,
          family: "business-object" as const,
        }),
      ),
      ...catalog.contextSubjects.map((subject) =>
        Object.freeze({
          subjectId: subject.id,
          objectKind: subject.kind,
          label: subject.label,
          attention: subject.attention,
          status: subject.status,
          family: "executive-work" as const,
        }),
      ),
    ],
    links: catalog.contextLinks,
    selectedOptionId: input.selectedOptionId,
    explicitRationale: input.explicitRationale,
    decisionRecordReason: input.decisionRecordReason,
    expectedOutcomes: input.expectedOutcomes,
    executionLinks: input.executionLinks,
    decisionBrief: presentation.decisionBrief,
    nextBestAction: presentation.nextBestAction,
    changeComparison: presentation.changeComparison,
  });
}

/**
 * STAGE-PROD:5 — append outcome evaluation for an existing memory.
 */
export function evaluateNexoraMVPDecisionMemoryOutcome(input: {
  readonly memoryId: string;
  readonly actualOutcomes: readonly ExecutiveActualOutcome[];
  readonly evaluationBoundaryReached?: boolean;
  readonly evaluatedAt?: string;
}): ReturnType<typeof appendExecutiveDecisionOutcomeEvaluation> {
  return appendExecutiveDecisionOutcomeEvaluation(input);
}

/**
 * STAGE-PROD:3 — execute NBA via existing navigation/collection/ack intents.
 */
export function executeNexoraMVPNextBestAction(
  action: ExecutiveNextBestAction,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): ExecutiveNextBestActionExecutionIntent {
  const subjects: ExecutiveNbaSubjectInput[] = [
    ...catalog.objects.map((object) =>
      Object.freeze({
        subjectId: object.id,
        objectKind: object.kind,
        label: object.label,
        attention: object.attention,
        status: object.status,
        family: "business-object" as const,
      }),
    ),
    ...catalog.contextSubjects.map((subject) =>
      Object.freeze({
        subjectId: subject.id,
        objectKind: subject.kind,
        label: subject.label,
        attention: subject.attention,
        status: subject.status,
        family: "executive-work" as const,
      }),
    ),
  ];
  return executeExecutiveNextBestAction({ action, subjects });
}

/**
 * STAGE-PROD:0 — authoritative primary Stage subject for Stage + Advisor.
 * Reuses focusedSubject ?? selectedSubject (strongest existing equivalent).
 */
export function resolveNexoraMVPPrimaryStageSubject(
  state: NexoraMVPObjectInteractionState,
): Readonly<{
  readonly primaryStageSubjectId: string | null;
  readonly advisorSubjectId: string | null;
  readonly presentationMode:
    | "overview"
    | "object-focus"
    | "collection"
    | "preparation";
}> {
  if (state.preparationContext != null) {
    return Object.freeze({
      primaryStageSubjectId: null,
      advisorSubjectId: null,
      presentationMode: "preparation" as const,
    });
  }
  if (state.collectionContext != null) {
    return Object.freeze({
      primaryStageSubjectId: null,
      advisorSubjectId: null,
      presentationMode: "collection" as const,
    });
  }
  const presentationMode =
    state.mode === "overview"
      ? ("overview" as const)
      : ("object-focus" as const);
  const resolved = resolvePrimaryStageSubjectId({
    clickedObjectId:
      state.selectedSubject?.id != null &&
      state.focusedSubject?.id != null &&
      state.selectedSubject.id === state.focusedSubject.id
        ? state.selectedSubject.id
        : null,
    selectedObjectId: state.selectedSubject?.id ?? null,
    focusedObjectId: state.focusedSubject?.id ?? null,
    presentationMode,
  });
  return Object.freeze({
    primaryStageSubjectId: resolved.primaryStageSubjectId,
    advisorSubjectId: resolved.advisorSubjectId,
    presentationMode: resolved.presentationMode,
  });
}

/** STAGE-PROD:0/1 — Queue summary (collection controls; outside topology). */
export function resolveNexoraMVPExecutiveQueueSummary(
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
) {
  return resolveExecutiveQueueEntries({
    subjects: catalog.contextSubjects.map((subject) =>
      Object.freeze({
        subjectId: subject.id,
        label: subject.label,
        objectKind: subject.kind,
        workKind: subject.kind,
        family: "executive-work" as const,
        attention: subject.attention,
        status: subject.status,
      }),
    ),
  });
}

/** STAGE-PROD:0/1 productivity disclosure for the current interaction state. */
export function resolveNexoraMVPExecutiveStageDisclosure(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
) {
  const primary = resolveNexoraMVPPrimaryStageSubject(state);
  const collection = state.collectionContext ?? null;
  if (collection != null) {
    return resolveExecutiveCollectionDisclosure({
      subjects: [
        ...catalog.objects.map((object) =>
          Object.freeze({
            subjectId: object.id,
            label: object.label,
            objectKind: object.kind,
            family: "business-object" as const,
            attention: object.attention,
            status: object.status,
          }),
        ),
        ...catalog.contextSubjects.map((subject) =>
          Object.freeze({
            subjectId: subject.id,
            label: subject.label,
            objectKind: subject.kind,
            workKind: subject.kind,
            family: "executive-work" as const,
            attention: subject.attention,
            status: subject.status,
            linkedBusinessObjectIds: Object.freeze(
              catalog.contextLinks
                .filter((link) => link.contextId === subject.id)
                .map((link) => link.objectId),
            ),
          }),
        ),
      ],
      relationships: catalog.relationships.map((relationship) =>
        Object.freeze({
          id: relationship.id,
          sourceId: relationship.sourceId,
          targetId: relationship.targetId,
        }),
      ),
      collection,
      presentationDepth: state.presentationState,
    });
  }
  return resolveExecutiveStageDisclosure({
    subjects: [
      ...catalog.objects.map((object) =>
        Object.freeze({
          subjectId: object.id,
          label: object.label,
          objectKind: object.kind,
          family: "business-object" as const,
          attention: object.attention,
          status: object.status,
        }),
      ),
      ...catalog.contextSubjects.map((subject) =>
        Object.freeze({
          subjectId: subject.id,
          label: subject.label,
          objectKind: subject.kind,
          workKind: subject.kind,
          family: "executive-work" as const,
          attention: subject.attention,
          status: subject.status,
          linkedBusinessObjectIds: Object.freeze(
            catalog.contextLinks
              .filter((link) => link.contextId === subject.id)
              .map((link) => link.objectId),
          ),
        }),
      ),
    ],
    relationships: catalog.relationships.map((relationship) =>
      Object.freeze({
        id: relationship.id,
        sourceId: relationship.sourceId,
        targetId: relationship.targetId,
      }),
    ),
    presentationMode: primary.presentationMode,
    presentationDepth: state.presentationState,
    primaryStageSubjectId: primary.primaryStageSubjectId,
    expandExecutiveThread:
      state.expandExecutiveThread === true ||
      state.mode === "context-focused",
  });
}

export function buildNexoraMVPTimelineContextBridge(
  state: NexoraMVPObjectInteractionState,
): NexoraMVPTimelineContextBridge {
  return Object.freeze({
    currentSubjectId: state.focusedSubject?.id ?? null,
    currentSubjectKind: state.focusedSubject?.kind ?? null,
    activeWorkspace: state.workspace,
    interactionMode: state.mode,
  });
}

export function verifyNexoraMVPObjectInteraction(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly determinismValid: boolean;
}> {
  const identity = getNexoraMVPObjectInteractionIdentity();
  const identityValid =
    identity.id === "NEX-MVP:4/NexoraObjectInteraction" &&
    identity.version === "2.0.0" &&
    identity.namespace === "nexora.mvp.object-interaction" &&
    identity.architecturalRole === "MVPExecutiveObjectInteractionCoordinator";

  const boundaryValid =
    NEXORA_MVP_OBJECT_INTERACTION_BOUNDARY.ownsRuntimeSemantics === false &&
    NEXORA_MVP_OBJECT_INTERACTION_BOUNDARY.duplicatesFocusResolver === false &&
    NEXORA_MVP_OBJECT_INTERACTION_BOUNDARY.duplicatesRelationshipEngine ===
      false &&
    NEXORA_MVP_OBJECT_INTERACTION_BOUNDARY.relationshipDepth === 1;

  const initial = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const a = selectNexoraMVPInteractionSubject(initial, "obj-revenue");
  const b = selectNexoraMVPInteractionSubject(initial, "obj-revenue");
  const pa = deriveNexoraMVPStageInteractionPresentation(a);
  const pb = deriveNexoraMVPStageInteractionPresentation(b);
  const determinismValid = JSON.stringify(pa) === JSON.stringify(pb);

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    determinismValid;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    determinismValid,
  });
}
