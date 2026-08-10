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

// ─── Identity ───────────────────────────────────────────────────────────────

export const nexoraMVPObjectInteractionIdentity =
  "NEX-MVP:4/NexoraObjectInteraction" as const;

export const nexoraMVPObjectInteractionVersion = "1.4.0" as const;

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
  readonly trail: readonly NexoraMVPInteractionSubject[];
  readonly workspace: NexoraMVPWorkspaceKind;
  readonly presentationState: NexoraMVPPresentationState;
  readonly environmentIntent: NexoraMVPSceneEnvironmentIntent;
};

export type NexoraMVPContextNodePresentation = {
  readonly id: string;
  readonly label: string;
  readonly kind: NexoraMVPInteractionSubjectKind;
  readonly role: "focused" | "context" | "source-anchor";
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
};

export type NexoraMVPStageInteractionPresentation = {
  readonly mode: NexoraMVPInteractionMode;
  readonly scene: NexoraMVPStageScenePresentation;
  readonly contextNodes: readonly NexoraMVPContextNodePresentation[];
  readonly contextConnections: readonly NexoraMVPStageConnectionPresentation[];
  readonly breadcrumb: readonly NexoraMVPInteractionSubject[];
  readonly canStepBack: boolean;
  readonly focusedSubjectId: string | null;
  readonly selectedSubjectId: string | null;
  readonly emphasizedObjectIds: readonly string[];
  readonly subordinateObjectIds: readonly string[];
  readonly emphasizedRelationshipIds: readonly string[];
};

export type NexoraMVPAdvisorContextBridge = {
  readonly selectedSubject: NexoraMVPSubjectReference | null;
  readonly focusedSubject: NexoraMVPSubjectReference | null;
  readonly subjectKind: NexoraMVPInteractionSubjectKind | null;
  readonly relatedSubjectIds: readonly string[];
  readonly contextSubjectIds: readonly string[];
  readonly activeWorkspace: NexoraMVPWorkspaceKind;
  readonly presentationState: NexoraMVPPresentationState;
  readonly environmentIntent: NexoraMVPSceneEnvironmentIntent;
  readonly interactionMode: NexoraMVPInteractionMode;
  readonly breadcrumb: readonly NexoraMVPInteractionSubject[];
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
    workspace: input.workspace,
    presentationState: input.presentationState,
    environmentIntent: input.environmentIntent,
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
  return [
    Math.cos(angle) * radius,
    0.42,
    Math.sin(angle) * radius,
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
  return [Math.cos(angle) * radius, 0.15, Math.sin(angle) * radius] as const;
}

/**
 * Select a validated subject. Invalid IDs are ignored (state unchanged).
 * Preserves workspace, presentation state, and environment intent.
 */
export function selectNexoraMVPInteractionSubject(
  state: NexoraMVPObjectInteractionState,
  subjectId: string | null,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): NexoraMVPObjectInteractionState {
  if (subjectId == null) {
    return resetNexoraMVPObjectInteractionOverview(state);
  }

  const subject = resolveNexoraMVPInteractionSubject(subjectId, catalog);
  if (subject == null) {
    return state;
  }

  if (subject.kind === "object") {
    return Object.freeze({
      ...state,
      mode: "object-focused",
      selectedSubject: subject,
      focusedSubject: subject,
      trail: Object.freeze([subject]),
    });
  }

  const linkedObjects = objectsForContext(subject.id, catalog);
  const sourceObjectId =
    state.focusedSubject?.kind === "object"
      ? state.focusedSubject.id
      : linkedObjects[0];
  const source =
    sourceObjectId == null
      ? null
      : resolveNexoraMVPInteractionSubject(sourceObjectId, catalog);

  const trailBase =
    source != null
      ? appendTrail(
          state.trail.length > 0 ? state.trail : Object.freeze([source]),
          source,
        )
      : state.trail;

  return Object.freeze({
    ...state,
    mode: "context-focused",
    selectedSubject: subject,
    focusedSubject: subject,
    trail: appendTrail(trailBase, subject),
  });
}

/** Step back one level: context → object → overview. */
export function stepBackNexoraMVPObjectInteraction(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): NexoraMVPObjectInteractionState {
  if (state.mode === "overview" || state.trail.length === 0) {
    return resetNexoraMVPObjectInteractionOverview(state);
  }

  if (state.mode === "context-focused") {
    const previous = [...state.trail]
      .reverse()
      .find((entry) => entry.kind === "object");
    if (previous) {
      return selectNexoraMVPInteractionSubject(state, previous.id, catalog);
    }
    return resetNexoraMVPObjectInteractionOverview(state);
  }

  return resetNexoraMVPObjectInteractionOverview(state);
}

/**
 * Overview reset: clears focus/selection/trail; preserves workspace,
 * presentation state, and environment intent.
 */
export function resetNexoraMVPObjectInteractionOverview(
  state: NexoraMVPObjectInteractionState,
): NexoraMVPObjectInteractionState {
  return Object.freeze({
    ...state,
    mode: "overview",
    selectedSubject: null,
    focusedSubject: null,
    trail: Object.freeze([]),
  });
}

/**
 * Sync shell workspace / presentation / environment into interaction state
 * without clearing selection or focus.
 */
export function syncNexoraMVPObjectInteractionShellContext(
  state: NexoraMVPObjectInteractionState,
  input: {
    readonly workspace: NexoraMVPWorkspaceKind;
    readonly presentationState: NexoraMVPPresentationState;
    readonly environmentIntent: NexoraMVPSceneEnvironmentIntent;
  },
): NexoraMVPObjectInteractionState {
  return Object.freeze({
    ...state,
    workspace: input.workspace,
    presentationState: input.presentationState,
    environmentIntent: input.environmentIntent,
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

function buildContextNodes(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog,
): readonly NexoraMVPContextNodePresentation[] {
  if (state.mode === "overview" || state.focusedSubject == null) {
    return Object.freeze([]);
  }

  if (state.focusedSubject.kind === "object") {
    const linked = contextSubjectsForObject(state.focusedSubject.id, catalog);
    const byKind = new Map<NexoraMVPContextSubjectKind, typeof linked>();
    for (const kind of KIND_ORDER) {
      byKind.set(
        kind,
        Object.freeze(linked.filter((entry) => entry.subject.kind === kind)),
      );
    }

    const nodes: NexoraMVPContextNodePresentation[] = [];
    for (const kind of KIND_ORDER) {
      const group = byKind.get(kind) ?? [];
      group.forEach((entry, index) => {
        nodes.push(
          Object.freeze({
            id: entry.subject.id,
            label: entry.subject.label,
            kind: entry.subject.kind,
            role: "context",
            targetPosition: contextLayoutPosition(kind, index, group.length),
            scale: 0.78,
            opacity: 0.95,
            selected: state.selectedSubject?.id === entry.subject.id,
            focused: false,
            attention: entry.subject.attention,
            status: entry.subject.status,
            relation: entry.relation,
            subjectId: entry.subject.id,
          }),
        );
      });
    }
    return Object.freeze(nodes);
  }

  // Context-focused: focused context at center; source object as source-anchor.
  const focusedContext = catalog.contextSubjects.find(
    (entry) => entry.id === state.focusedSubject?.id,
  );
  if (!focusedContext) return Object.freeze([]);

  const nodes: NexoraMVPContextNodePresentation[] = [
    Object.freeze({
      id: focusedContext.id,
      label: focusedContext.label,
      kind: focusedContext.kind,
      role: "focused",
      targetPosition: [0, 0.35, 0] as const,
      scale: 1.05,
      opacity: 1,
      selected: true,
      focused: true,
      attention: focusedContext.attention,
      status: focusedContext.status,
      subjectId: focusedContext.id,
    }),
  ];

  const sourceObject =
    state.trail.find((entry) => entry.kind === "object") ??
    (() => {
      const ids = objectsForContext(focusedContext.id, catalog);
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
      }),
    );
  }

  // Sibling context of same source object (limited).
  if (sourceObject) {
    const siblings = contextSubjectsForObject(sourceObject.id, catalog).filter(
      (entry) => entry.subject.id !== focusedContext.id,
    );
    siblings.slice(0, 4).forEach((entry, index) => {
      nodes.push(
        Object.freeze({
          id: entry.subject.id,
          label: entry.subject.label,
          kind: entry.subject.kind,
          role: "context",
          targetPosition: contextLayoutPosition(
            entry.subject.kind,
            index,
            Math.min(4, siblings.length),
          ),
          scale: 0.72,
          opacity: 0.75,
          selected: false,
          focused: false,
          attention: entry.subject.attention,
          status: entry.subject.status,
          relation: entry.relation,
          subjectId: entry.subject.id,
        }),
      );
    });
  }

  return Object.freeze(nodes);
}

function buildContextConnections(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog,
  contextNodes: readonly NexoraMVPContextNodePresentation[],
): readonly NexoraMVPStageConnectionPresentation[] {
  if (state.focusedSubject == null) return Object.freeze([]);

  if (state.focusedSubject.kind === "object") {
    return Object.freeze(
      catalog.contextLinks
        .filter((link) => link.objectId === state.focusedSubject?.id)
        .filter((link) =>
          contextNodes.some((node) => node.id === link.contextId),
        )
        .map((link) =>
          Object.freeze({
            id: link.id,
            sourceId: link.objectId,
            targetId: link.contextId,
            emphasized: true,
            opacity: 0.62,
          }),
        ),
    );
  }

  const sourceObject = state.trail.find((entry) => entry.kind === "object");
  if (!sourceObject) return Object.freeze([]);

  return Object.freeze([
    Object.freeze({
      id: `ctx-link-${sourceObject.id}-${state.focusedSubject.id}`,
      sourceId: sourceObject.id,
      targetId: state.focusedSubject.id,
      emphasized: true,
      opacity: 0.7,
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
  const focusedObjectId =
    state.focusedSubject?.kind === "object"
      ? state.focusedSubject.id
      : state.trail.find((entry) => entry.kind === "object")?.id ?? null;

  const selectedObjectId =
    state.selectedSubject?.kind === "object"
      ? state.selectedSubject.id
      : focusedObjectId;

  const scene = resolveNexoraMVPStageScenePresentation({
    objects: catalog.objects,
    relationships: catalog.relationships,
    selectedObjectId:
      state.mode === "context-focused" ? focusedObjectId : selectedObjectId,
    focusedObjectId:
      state.mode === "overview" ? null : focusedObjectId,
    presentationState: state.presentationState,
    environmentIntent: state.environmentIntent,
  });

  // When context-focused, subordinate all objects except source + linked.
  let objects: readonly NexoraMVPStageObjectPresentation[] = scene.objects;
  if (state.mode === "context-focused" && state.focusedSubject) {
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

  const contextNodes = buildContextNodes(state, catalog);
  const contextConnections = buildContextConnections(
    state,
    catalog,
    contextNodes,
  );

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
  const emphasizedRelationshipIds = Object.freeze(
    scene.connections
      .filter((entry) => entry.emphasized)
      .map((entry) => entry.id),
  );

  const adjustedScene: NexoraMVPStageScenePresentation = Object.freeze({
    ...scene,
    mode:
      state.mode === "overview"
        ? "overview"
        : "focus",
    objects,
    focusedObjectId:
      state.focusedSubject?.kind === "object"
        ? state.focusedSubject.id
        : scene.focusedObjectId,
    selectedObjectId:
      state.selectedSubject?.kind === "object"
        ? state.selectedSubject.id
        : scene.selectedObjectId,
  });

  const breadcrumbRoot: NexoraMVPInteractionSubject = Object.freeze({
    id: "trail-overview",
    kind: "object",
    label: "Overview",
  });

  return Object.freeze({
    mode: state.mode,
    scene: adjustedScene,
    contextNodes,
    contextConnections,
    breadcrumb: Object.freeze([breadcrumbRoot, ...state.trail]),
    canStepBack: state.mode !== "overview",
    focusedSubjectId: state.focusedSubject?.id ?? null,
    selectedSubjectId: state.selectedSubject?.id ?? null,
    emphasizedObjectIds,
    subordinateObjectIds,
    emphasizedRelationshipIds,
  });
}

export function buildNexoraMVPAdvisorContextBridge(
  state: NexoraMVPObjectInteractionState,
  presentation: NexoraMVPStageInteractionPresentation,
): NexoraMVPAdvisorContextBridge {
  const subjects = mapNexoraMVPInteractionStateToApplicationSubjects(state);
  return Object.freeze({
    selectedSubject: subjects.selectedSubject,
    focusedSubject: subjects.focusedSubject,
    subjectKind: state.focusedSubject?.kind ?? null,
    relatedSubjectIds: presentation.emphasizedObjectIds,
    contextSubjectIds: Object.freeze(
      presentation.contextNodes
        .filter((node) => node.role === "context" || node.role === "focused")
        .map((node) => node.id),
    ),
    activeWorkspace: state.workspace,
    presentationState: state.presentationState,
    environmentIntent: state.environmentIntent,
    interactionMode: state.mode,
    breadcrumb: presentation.breadcrumb,
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
    identity.version === "1.4.0" &&
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
