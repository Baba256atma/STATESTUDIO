/**
 * SP:4.1B — Executive Focus Scene Disclosure.
 *
 * Presentation-selection layer that controls WHAT is allowed to appear on the
 * Stage before Topology determines WHERE those visible items are positioned.
 *
 * Dependency direction (required):
 *   Available Stage Subjects + Focus + Presentation Depth + Relationships
 *     → Executive Focus Scene Disclosure Resolver
 *       → Visible / Collapsed / Background / Hidden subjects
 *         → SP:4.1 Topology (disclosed set only)
 *           → Three.js presentation
 *
 * Disclosure = WHAT. Topology = WHERE. Never invents business truth.
 */

import { resolveExecutiveFocusRelatedObjectIds } from "./executiveFocusChoreography.ts";
import {
  EXECUTIVE_LIGHTING_EMPHASIS_PROFILES,
  resolveExecutiveLightingEmphasis,
} from "./executiveLightingHierarchy.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveFocusSceneDisclosureIdentity =
  "SP:4.1B/ExecutiveFocusSceneDisclosure" as const;

export const executiveFocusSceneDisclosureVersion = "4.1.1" as const;

export const executiveFocusSceneDisclosureNamespace =
  "nexora.spatial-presentation.executive-focus-scene-disclosure" as const;

export const executiveFocusSceneDisclosurePhase =
  "ExecutiveFocusSceneDisclosure" as const;

export const executiveFocusSceneDisclosureArchitecturalRole =
  "PresentationOnlyExecutiveFocusSceneDisclosure" as const;

export const executiveFocusSceneDisclosureReadiness =
  "AwaitingHumanVisualSignOff" as const;

export type ExecutiveFocusSceneDisclosureIdentity = {
  readonly id: typeof executiveFocusSceneDisclosureIdentity;
  readonly version: typeof executiveFocusSceneDisclosureVersion;
  readonly namespace: typeof executiveFocusSceneDisclosureNamespace;
  readonly phase: typeof executiveFocusSceneDisclosurePhase;
  readonly architecturalRole: typeof executiveFocusSceneDisclosureArchitecturalRole;
};

const DISCLOSURE_IDENTITY: ExecutiveFocusSceneDisclosureIdentity = Object.freeze({
  id: executiveFocusSceneDisclosureIdentity,
  version: executiveFocusSceneDisclosureVersion,
  namespace: executiveFocusSceneDisclosureNamespace,
  phase: executiveFocusSceneDisclosurePhase,
  architecturalRole: executiveFocusSceneDisclosureArchitecturalRole,
});

export function getExecutiveFocusSceneDisclosureIdentity(): ExecutiveFocusSceneDisclosureIdentity {
  return DISCLOSURE_IDENTITY;
}

export const EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BOUNDARY = Object.freeze({
  architecturalRole: executiveFocusSceneDisclosureArchitecturalRole,
  ownsBusinessTruth: false as const,
  ownsDataReality: false as const,
  ownsAdvisorState: false as const,
  ownsCanonicalRelationships: false as const,
  inventsRelationships: false as const,
  deletesCanonicalRelationships: false as const,
  ownsFocusSemantics: false as const,
  ownsAttentionTruth: false as const,
  replacesTopologyAuthority: false as const,
  solvesVisibilityViaZDepth: false as const,
  activatesHybridTopology: false as const,
  introducesDisclosureAnimation: false as const,
  presentationOnly: true as const,
});

// ─── Contracts ──────────────────────────────────────────────────────────────

export type ExecutiveFocusPresentationDepth =
  | "minimum"
  | "report"
  | "operation";

export type ExecutiveFocusSubjectFamily =
  | "business-object"
  | "executive-work"
  | "collapsed-thread";

export type ExecutiveFocusDisclosureState =
  | "visible-primary"
  | "visible-related"
  | "collapsed-thread"
  | "background-discoverable"
  | "hidden";

export type ExecutiveWorkKind =
  | "problem"
  | "scenario"
  | "decision"
  | "execution";

export type ExecutiveFocusSceneSubjectInput = {
  readonly subjectId: string;
  readonly label?: string;
  readonly family: ExecutiveFocusSubjectFamily;
  readonly workKind?: ExecutiveWorkKind;
  readonly attention?: string;
  readonly status?: string;
  /** Business object this executive-work subject is linked to (1-hop). */
  readonly linkedBusinessObjectIds?: readonly string[];
};

export type ExecutiveFocusSceneRelationshipInput = {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
};

export type ExecutiveFocusSceneDisclosureEntry = {
  readonly subjectId: string;
  readonly family: ExecutiveFocusSubjectFamily;
  readonly state: ExecutiveFocusDisclosureState;
  readonly rank: number;
  readonly interactive: boolean;
  readonly labelVisible: boolean;
  readonly participatesInTopology: boolean;
  readonly workKind?: ExecutiveWorkKind;
  /** Underlying executive-work IDs when this entry is a collapsed thread. */
  readonly collapsedMemberIds?: readonly string[];
  readonly collapsedMemberCount?: number;
};

export type ResolveExecutiveFocusSceneDisclosureInput = {
  readonly subjects: readonly ExecutiveFocusSceneSubjectInput[];
  readonly relationships: readonly ExecutiveFocusSceneRelationshipInput[];
  readonly focusedSubjectId?: string | null;
  readonly focusedSubjectFamily?: ExecutiveFocusSubjectFamily | null;
  readonly presentationDepth: ExecutiveFocusPresentationDepth;
  /** Explicit expansion of collapsed thread (selection / depth / workspace). */
  readonly expandExecutiveThread?: boolean;
};

export type ExecutiveFocusSceneDisclosureResult = {
  readonly identity: typeof executiveFocusSceneDisclosureIdentity;
  readonly version: typeof executiveFocusSceneDisclosureVersion;
  readonly presentationDepth: ExecutiveFocusPresentationDepth;
  readonly focusedSubjectId: string | null;
  readonly entries: readonly ExecutiveFocusSceneDisclosureEntry[];
  readonly byId: ReadonlyMap<string, ExecutiveFocusSceneDisclosureEntry>;
  readonly visibleSubjectIds: readonly string[];
  readonly topologySubjectIds: readonly string[];
  readonly hiddenSubjectIds: readonly string[];
  readonly collapsedThreadSubjectId: string | null;
  readonly visibleBudgetUsed: number;
  readonly visibleBudgetMax: number;
  readonly canonicalRelationshipIds: readonly string[];
};

export const EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BUDGET = Object.freeze({
  minimum: Object.freeze({
    primaryBusiness: 1,
    relatedBusiness: 4,
    collapsedThread: 1,
    criticalBackground: 1,
    expandedExecutiveWork: 0,
    maxVisibleSubjects: 6,
  }),
  report: Object.freeze({
    primaryBusiness: 1,
    relatedBusiness: 4,
    collapsedThread: 1,
    criticalBackground: 1,
    expandedExecutiveWork: 2,
    maxVisibleSubjects: 9,
  }),
  operation: Object.freeze({
    primaryBusiness: 1,
    relatedBusiness: 4,
    // STAGE-THREAD:1-FIX — retain collapsed gateway until explicit expand.
    collapsedThread: 1,
    criticalBackground: 2,
    expandedExecutiveWork: 4,
    maxVisibleSubjects: 12,
  }),
});

export const EXECUTIVE_FOCUS_SCENE_DISCLOSURE_COMPLEXITY = Object.freeze({
  usesGraphSimulation: false as const,
  perFrameRecalculation: false as const,
  maximumRelationshipHops: 1 as const,
  maximumLayoutPasses: 1 as const,
});

export const EXECUTIVE_WORK_KIND_ORDER = Object.freeze([
  "problem",
  "scenario",
  "decision",
  "execution",
] as const satisfies readonly ExecutiveWorkKind[]);

// ─── Helpers ────────────────────────────────────────────────────────────────

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function normalizeAttention(attention: string | undefined): string {
  return (attention ?? "normal").toLowerCase();
}

function isCriticalAttention(attention: string | undefined): boolean {
  return normalizeAttention(attention) === "critical";
}

function isElevatedAttention(attention: string | undefined): boolean {
  const value = normalizeAttention(attention);
  return value === "critical" || value === "important" || value === "elevated";
}

function statusRank(status: string | undefined): number {
  switch ((status ?? "stable").toLowerCase()) {
    case "risk":
    case "unresolved":
      return 3;
    case "watch":
      return 2;
    default:
      return 1;
  }
}

function attentionRank(attention: string | undefined): number {
  switch (normalizeAttention(attention)) {
    case "critical":
      return 4;
    case "important":
      return 3;
    case "elevated":
      return 2;
    default:
      return 1;
  }
}

function workKindRank(kind: ExecutiveWorkKind | undefined): number {
  if (kind == null) return 0;
  return EXECUTIVE_WORK_KIND_ORDER.indexOf(kind) + 1;
}

function depthRank(depth: ExecutiveFocusPresentationDepth): number {
  switch (depth) {
    case "minimum":
      return 0;
    case "report":
      return 1;
    case "operation":
      return 2;
  }
}

function collapsedThreadId(focusedBusinessObjectId: string): string {
  return `thread-${focusedBusinessObjectId}`;
}

function buildEntry(
  partial: ExecutiveFocusSceneDisclosureEntry,
): ExecutiveFocusSceneDisclosureEntry {
  return Object.freeze(partial);
}

/**
 * Deterministic related-business ranking for visibility budget.
 * Prefer: direct relationship → critical → elevated → status → stable id.
 */
export function rankExecutiveFocusRelatedBusinessObjects(input: {
  readonly candidateIds: readonly string[];
  readonly subjectsById: ReadonlyMap<string, ExecutiveFocusSceneSubjectInput>;
  /** Prefer IDs already known as canonical direct (1-hop) relationships. */
  readonly directRelationshipIds?: ReadonlySet<string>;
}): readonly string[] {
  const direct = input.directRelationshipIds;
  return Object.freeze(
    [...input.candidateIds].sort((left, right) => {
      if (direct != null) {
        const leftDirect = direct.has(left) ? 1 : 0;
        const rightDirect = direct.has(right) ? 1 : 0;
        if (leftDirect !== rightDirect) return rightDirect - leftDirect;
      }
      const leftSubject = input.subjectsById.get(left);
      const rightSubject = input.subjectsById.get(right);
      const attentionDelta =
        attentionRank(rightSubject?.attention) -
        attentionRank(leftSubject?.attention);
      if (attentionDelta !== 0) return attentionDelta;
      const statusDelta =
        statusRank(rightSubject?.status) - statusRank(leftSubject?.status);
      if (statusDelta !== 0) return statusDelta;
      return compareIds(left, right);
    }),
  );
}

function isActivelyVisible(state: ExecutiveFocusDisclosureState): boolean {
  return (
    state === "visible-primary" ||
    state === "visible-related" ||
    state === "collapsed-thread" ||
    state === "background-discoverable"
  );
}

function participatesInTopology(state: ExecutiveFocusDisclosureState): boolean {
  return (
    state === "visible-primary" ||
    state === "visible-related" ||
    state === "collapsed-thread" ||
    state === "background-discoverable"
  );
}

function interactiveFor(state: ExecutiveFocusDisclosureState): boolean {
  return state !== "hidden";
}

function labelVisibleFor(state: ExecutiveFocusDisclosureState): boolean {
  return (
    state === "visible-primary" ||
    state === "visible-related" ||
    state === "collapsed-thread" ||
    state === "background-discoverable"
  );
}

// ─── Resolver ───────────────────────────────────────────────────────────────

/**
 * Deterministic Scene Disclosure resolver.
 * Same candidates + focus + depth → identical disclosure output.
 */
export function resolveExecutiveFocusSceneDisclosure(
  input: ResolveExecutiveFocusSceneDisclosureInput,
): ExecutiveFocusSceneDisclosureResult {
  const depth = input.presentationDepth;
  const budget = EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BUDGET[depth];
  const subjectsById = new Map(
    input.subjects.map((subject) => [subject.subjectId, subject]),
  );
  const focusedSubjectId =
    input.focusedSubjectId != null &&
    subjectsById.has(input.focusedSubjectId)
      ? input.focusedSubjectId
      : null;
  const focusedFamily =
    focusedSubjectId == null
      ? null
      : (input.focusedSubjectFamily ??
        subjectsById.get(focusedSubjectId)?.family ??
        null);

  const businessObjects = input.subjects.filter(
    (subject) => subject.family === "business-object",
  );
  const executiveWork = input.subjects.filter(
    (subject) => subject.family === "executive-work",
  );

  const entries = new Map<string, ExecutiveFocusSceneDisclosureEntry>();
  let collapsedThreadSubjectId: string | null = null;

  const mark = (
    subjectId: string,
    family: ExecutiveFocusSubjectFamily,
    state: ExecutiveFocusDisclosureState,
    rank: number,
    extras?: Partial<ExecutiveFocusSceneDisclosureEntry>,
  ) => {
    entries.set(
      subjectId,
      buildEntry({
        subjectId,
        family,
        state,
        rank,
        interactive: interactiveFor(state),
        labelVisible: labelVisibleFor(state),
        participatesInTopology: participatesInTopology(state),
        ...extras,
      }),
    );
  };

  // Overview — full business landscape; no automatic executive-thread expansion.
  if (focusedSubjectId == null || focusedFamily == null) {
    for (const subject of businessObjects) {
      mark(subject.subjectId, "business-object", "visible-related", 10);
    }
    for (const subject of executiveWork) {
      mark(subject.subjectId, "executive-work", "hidden", 900, {
        workKind: subject.workKind,
      });
    }
  } else if (focusedFamily === "business-object") {
    const relatedIds = resolveExecutiveFocusRelatedObjectIds({
      focusedObjectId: focusedSubjectId,
      connections: input.relationships,
    }).filter((objectId) => subjectsById.get(objectId)?.family === "business-object");

    const rankedRelated = rankExecutiveFocusRelatedBusinessObjects({
      candidateIds: relatedIds,
      subjectsById,
      directRelationshipIds: new Set(relatedIds),
    });
    const visibleRelated = rankedRelated.slice(0, budget.relatedBusiness);
    const visibleRelatedSet = new Set(visibleRelated);

    mark(focusedSubjectId, "business-object", "visible-primary", 0);

    visibleRelated.forEach((objectId, index) => {
      mark(objectId, "business-object", "visible-related", 10 + index);
    });

    // Critical competing attention outside related set — discoverable, not full prominence.
    const criticalCandidates = businessObjects
      .filter(
        (subject) =>
          subject.subjectId !== focusedSubjectId &&
          !visibleRelatedSet.has(subject.subjectId) &&
          isCriticalAttention(subject.attention),
      )
      .map((subject) => subject.subjectId)
      .sort(compareIds)
      .slice(0, budget.criticalBackground);

    criticalCandidates.forEach((objectId, index) => {
      mark(
        objectId,
        "business-object",
        "background-discoverable",
        100 + index,
      );
    });
    const criticalSet = new Set(criticalCandidates);

    for (const subject of businessObjects) {
      if (entries.has(subject.subjectId)) continue;
      mark(subject.subjectId, "business-object", "hidden", 800);
    }

    const linkedWork = executiveWork
      .filter((subject) =>
        (subject.linkedBusinessObjectIds ?? []).includes(focusedSubjectId),
      )
      .sort((left, right) => {
        const kindDelta =
          workKindRank(left.workKind) - workKindRank(right.workKind);
        if (kindDelta !== 0) return kindDelta;
        return compareIds(left.subjectId, right.subjectId);
      });

    // STAGE-THREAD:1-FIX — keep Executive Thread collapsed (gateway visible)
    // at Minimum / Report / Operation until explicit expand.
    const keepCollapsed =
      linkedWork.length > 0 &&
      input.expandExecutiveThread !== true &&
      budget.collapsedThread > 0;

    if (linkedWork.length === 0) {
      // no thread
    } else if (keepCollapsed) {
      const memberIds = Object.freeze(
        linkedWork.map((subject) => subject.subjectId),
      );
      collapsedThreadSubjectId = collapsedThreadId(focusedSubjectId);
      mark(
        collapsedThreadSubjectId,
        "collapsed-thread",
        "collapsed-thread",
        50,
        {
          collapsedMemberIds: memberIds,
          collapsedMemberCount: memberIds.length,
        },
      );
      for (const subject of linkedWork) {
        mark(subject.subjectId, "executive-work", "hidden", 850, {
          workKind: subject.workKind,
        });
      }
    } else {
      // Expanded executive thread — STAGE-THREAD:1: explicit expand shows full
      // canonical set at every presentation depth (density changes labels only).
      const allowedKinds = new Set<ExecutiveWorkKind>();
      if (input.expandExecutiveThread === true) {
        for (const kind of EXECUTIVE_WORK_KIND_ORDER) {
          allowedKinds.add(kind);
        }
      } else if (depth === "report") {
        allowedKinds.add("problem");
        allowedKinds.add("scenario");
      } else if (depth === "operation") {
        for (const kind of EXECUTIVE_WORK_KIND_ORDER) {
          allowedKinds.add(kind);
        }
      }

      const expansionBudget =
        input.expandExecutiveThread === true
          ? EXECUTIVE_WORK_KIND_ORDER.length
          : budget.expandedExecutiveWork;

      let expanded = 0;
      for (const subject of linkedWork) {
        const kind = subject.workKind;
        if (
          kind != null &&
          allowedKinds.has(kind) &&
          expanded < expansionBudget
        ) {
          mark(subject.subjectId, "executive-work", "visible-related", 60 + expanded, {
            workKind: kind,
          });
          expanded += 1;
        } else {
          mark(subject.subjectId, "executive-work", "hidden", 860, {
            workKind: kind,
          });
        }
      }
    }

    // Hide executive-work not linked to focus.
    for (const subject of executiveWork) {
      if (entries.has(subject.subjectId)) continue;
      mark(subject.subjectId, "executive-work", "hidden", 870, {
        workKind: subject.workKind,
      });
    }

    void criticalSet;
  } else {
    // Focused executive-work subject — show relevant thread portion + linked business context.
    mark(focusedSubjectId, "executive-work", "visible-primary", 0, {
      workKind: subjectsById.get(focusedSubjectId)?.workKind,
    });

    const focusedWork = subjectsById.get(focusedSubjectId);
    const linkedBusiness = Object.freeze(
      [...(focusedWork?.linkedBusinessObjectIds ?? [])]
        .filter((objectId) => subjectsById.get(objectId)?.family === "business-object")
        .sort(compareIds)
        .slice(0, Math.max(1, budget.relatedBusiness)),
    );
    linkedBusiness.forEach((objectId, index) => {
      mark(
        objectId,
        "business-object",
        index === 0 ? "visible-related" : "visible-related",
        10 + index,
      );
    });
    const linkedBusinessSet = new Set(linkedBusiness);

    for (const subject of businessObjects) {
      if (entries.has(subject.subjectId)) continue;
      if (
        isCriticalAttention(subject.attention) &&
        !linkedBusinessSet.has(subject.subjectId)
      ) {
        // Keep critical discoverable but do not repopulate the scene.
        const existingCritical = [...entries.values()].filter(
          (entry) => entry.state === "background-discoverable",
        ).length;
        if (existingCritical < budget.criticalBackground) {
          mark(
            subject.subjectId,
            "business-object",
            "background-discoverable",
            120,
          );
          continue;
        }
      }
      mark(subject.subjectId, "business-object", "hidden", 800);
    }

    const threadPeers = executiveWork
      .filter((subject) => {
        if (subject.subjectId === focusedSubjectId) return false;
        const shared = (subject.linkedBusinessObjectIds ?? []).some((objectId) =>
          linkedBusinessSet.has(objectId),
        );
        return shared;
      })
      .sort((left, right) => {
        const kindDelta =
          workKindRank(left.workKind) - workKindRank(right.workKind);
        if (kindDelta !== 0) return kindDelta;
        return compareIds(left.subjectId, right.subjectId);
      });

    const focusedKind = focusedWork?.workKind;
    const focusedKindIndex =
      focusedKind == null ? -1 : EXECUTIVE_WORK_KIND_ORDER.indexOf(focusedKind);

    let expanded = 0;
    for (const subject of threadPeers) {
      const kindIndex =
        subject.workKind == null
          ? -1
          : EXECUTIVE_WORK_KIND_ORDER.indexOf(subject.workKind);
      const adjacent =
        focusedKindIndex >= 0 &&
        kindIndex >= 0 &&
        Math.abs(kindIndex - focusedKindIndex) <= 1;
      const allow =
        depth === "operation"
          ? true
          : depth === "report"
            ? adjacent || subject.workKind === "problem"
            : false;
      if (allow && expanded < budget.expandedExecutiveWork) {
        mark(subject.subjectId, "executive-work", "visible-related", 70 + expanded, {
          workKind: subject.workKind,
        });
        expanded += 1;
      } else {
        mark(subject.subjectId, "executive-work", "hidden", 880, {
          workKind: subject.workKind,
        });
      }
    }

    for (const subject of executiveWork) {
      if (entries.has(subject.subjectId)) continue;
      mark(subject.subjectId, "executive-work", "hidden", 890, {
        workKind: subject.workKind,
      });
    }
  }

  const orderedEntries = Object.freeze(
    [...entries.values()].sort((left, right) => {
      if (left.rank !== right.rank) return left.rank - right.rank;
      return compareIds(left.subjectId, right.subjectId);
    }),
  );

  const visibleSubjectIds = Object.freeze(
    orderedEntries
      .filter((entry) => isActivelyVisible(entry.state))
      .map((entry) => entry.subjectId),
  );
  const topologySubjectIds = Object.freeze(
    orderedEntries
      .filter((entry) => entry.participatesInTopology)
      .map((entry) => entry.subjectId),
  );
  const hiddenSubjectIds = Object.freeze(
    orderedEntries
      .filter((entry) => entry.state === "hidden")
      .map((entry) => entry.subjectId),
  );

  return Object.freeze({
    identity: executiveFocusSceneDisclosureIdentity,
    version: executiveFocusSceneDisclosureVersion,
    presentationDepth: depth,
    focusedSubjectId,
    entries: orderedEntries,
    byId: entries,
    visibleSubjectIds,
    topologySubjectIds,
    hiddenSubjectIds,
    collapsedThreadSubjectId,
    visibleBudgetUsed: visibleSubjectIds.length,
    visibleBudgetMax: budget.maxVisibleSubjects,
    canonicalRelationshipIds: Object.freeze(
      input.relationships.map((relationship) => relationship.id),
    ),
  });
}

/**
 * Connection may render only when both endpoints are non-hidden.
 */
export function isExecutiveFocusConnectionDisclosed(input: {
  readonly sourceId: string;
  readonly targetId: string;
  readonly disclosure: ExecutiveFocusSceneDisclosureResult;
}): boolean {
  const source = input.disclosure.byId.get(input.sourceId);
  const target = input.disclosure.byId.get(input.targetId);
  if (source == null || target == null) return false;
  return source.state !== "hidden" && target.state !== "hidden";
}

export function compareExecutiveFocusPresentationDepth(
  left: ExecutiveFocusPresentationDepth,
  right: ExecutiveFocusPresentationDepth,
): number {
  return depthRank(left) - depthRank(right);
}

export function verifyExecutiveFocusSceneDisclosure(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly deterministic: boolean;
  readonly minimumBudgetValid: boolean;
  readonly minimumThreadCollapsed: boolean;
  readonly lightingUnaffected: boolean;
}> {
  const identity = getExecutiveFocusSceneDisclosureIdentity();
  const identityValid =
    identity.id === "SP:4.1B/ExecutiveFocusSceneDisclosure" &&
    identity.version === "4.1.1" &&
    identity.namespace ===
      "nexora.spatial-presentation.executive-focus-scene-disclosure" &&
    identity.architecturalRole ===
      "PresentationOnlyExecutiveFocusSceneDisclosure";

  const boundaryValid =
    EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BOUNDARY.presentationOnly === true &&
    EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BOUNDARY.ownsDataReality === false &&
    EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BOUNDARY.inventsRelationships === false &&
    EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BOUNDARY.replacesTopologyAuthority ===
      false;

  const subjects = Object.freeze([
    Object.freeze({
      subjectId: "obj-capacity",
      family: "business-object" as const,
      attention: "important",
      status: "watch",
    }),
    Object.freeze({
      subjectId: "obj-inventory",
      family: "business-object" as const,
      attention: "normal",
      status: "stable",
    }),
    Object.freeze({
      subjectId: "obj-delivery",
      family: "business-object" as const,
      attention: "important",
      status: "watch",
    }),
    Object.freeze({
      subjectId: "obj-demand",
      family: "business-object" as const,
      attention: "elevated",
      status: "watch",
    }),
    Object.freeze({
      subjectId: "obj-risk",
      family: "business-object" as const,
      attention: "critical",
      status: "risk",
    }),
    Object.freeze({
      subjectId: "obj-budget",
      family: "business-object" as const,
      attention: "normal",
      status: "stable",
    }),
    Object.freeze({
      subjectId: "ctx-problem",
      family: "executive-work" as const,
      workKind: "problem" as const,
      linkedBusinessObjectIds: Object.freeze(["obj-capacity"]),
    }),
    Object.freeze({
      subjectId: "ctx-scenario",
      family: "executive-work" as const,
      workKind: "scenario" as const,
      linkedBusinessObjectIds: Object.freeze(["obj-capacity"]),
    }),
    Object.freeze({
      subjectId: "ctx-decision",
      family: "executive-work" as const,
      workKind: "decision" as const,
      linkedBusinessObjectIds: Object.freeze(["obj-capacity"]),
    }),
    Object.freeze({
      subjectId: "ctx-execution",
      family: "executive-work" as const,
      workKind: "execution" as const,
      linkedBusinessObjectIds: Object.freeze(["obj-capacity"]),
    }),
  ]);
  const relationships = Object.freeze([
    Object.freeze({
      id: "r1",
      sourceId: "obj-inventory",
      targetId: "obj-capacity",
    }),
    Object.freeze({
      id: "r2",
      sourceId: "obj-capacity",
      targetId: "obj-delivery",
    }),
    Object.freeze({
      id: "r3",
      sourceId: "obj-demand",
      targetId: "obj-capacity",
    }),
    Object.freeze({
      id: "r4",
      sourceId: "obj-risk",
      targetId: "obj-delivery",
    }),
  ]);

  const a = resolveExecutiveFocusSceneDisclosure({
    subjects,
    relationships,
    focusedSubjectId: "obj-capacity",
    focusedSubjectFamily: "business-object",
    presentationDepth: "minimum",
  });
  const b = resolveExecutiveFocusSceneDisclosure({
    subjects,
    relationships,
    focusedSubjectId: "obj-capacity",
    focusedSubjectFamily: "business-object",
    presentationDepth: "minimum",
  });
  const deterministic =
    JSON.stringify(a.entries) === JSON.stringify(b.entries);

  const minimumBudgetValid =
    a.visibleBudgetUsed <= a.visibleBudgetMax &&
    a.entries.filter((entry) => entry.state === "visible-related" && entry.family === "business-object")
      .length <= EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BUDGET.minimum.relatedBusiness;

  const expandedWork = a.entries.filter(
    (entry) =>
      entry.family === "executive-work" &&
      (entry.state === "visible-primary" || entry.state === "visible-related"),
  );
  const minimumThreadCollapsed =
    a.collapsedThreadSubjectId != null &&
    expandedWork.length === 0 &&
    a.byId.get("ctx-problem")?.state === "hidden";

  const lighting = resolveExecutiveLightingEmphasis({
    objectId: "obj-capacity",
    focused: true,
  });
  const lightingUnaffected =
    lighting.level === "primary" &&
    lighting.strength ===
      EXECUTIVE_LIGHTING_EMPHASIS_PROFILES.primary.strength;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    deterministic &&
    minimumBudgetValid &&
    minimumThreadCollapsed &&
    lightingUnaffected;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    deterministic,
    minimumBudgetValid,
    minimumThreadCollapsed,
    lightingUnaffected,
  });
}
