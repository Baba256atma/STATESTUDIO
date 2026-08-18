/**
 * STAGE-PROD:0 — Executive Stage Productivity Contract.
 *
 * Single spatial + interaction authority for the Nexora Executive Stage:
 *   CENTER → RELATED → WATCH → EXECUTIVE QUEUE
 *
 * Does not redesign Nexora, rebuild Stage topology, replace True-2D camera,
 * invent business relationships, or implement Queue expansion / NBA / CI.
 *
 * Disclosure = WHAT (this module). Topology = WHERE (STAGE-2D). Queue = control
 * region outside topology. Advisor subject ≡ primary Stage subject.
 */

import {
  resolveExecutiveFocusRelatedObjectIds,
} from "./executiveFocusChoreography.ts";
import {
  resolveExecutiveFocusSceneDisclosure,
  type ExecutiveFocusPresentationDepth,
  type ExecutiveFocusSceneDisclosureResult,
  type ExecutiveFocusSceneRelationshipInput,
  type ExecutiveFocusSceneSubjectInput,
  type ExecutiveWorkKind,
} from "./executiveFocusSceneDisclosure.ts";
import {
  EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS,
} from "./executiveStage2DTopologyRecomposition.ts";
import {
  resolveExecutiveStageFocusPrecedence,
  type ExecutiveStageFocusSource,
} from "./executiveStageFocusPrecedence.ts";
import {
  resolveExecutiveObjectSemanticShapeFamily,
  type ExecutiveObjectSemanticShapeFamily,
} from "./executiveObjectPresenceIdentity.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStageProductivityContractIdentity =
  "STAGE-PROD:0/ExecutiveStageProductivityContract" as const;

export const executiveStageProductivityContractVersion = "0.1.0" as const;

export const executiveStageProductivityContractNamespace =
  "nexora.spatial-presentation.executive-stage-productivity-contract" as const;

export const executiveStageProductivityContractPhase =
  "ExecutiveStageProductivityContract" as const;

export const executiveStageProductivityContractArchitecturalRole =
  "PresentationOnlyExecutiveStageProductivityAuthority" as const;

export type ExecutiveStageProductivityContractIdentity = {
  readonly id: typeof executiveStageProductivityContractIdentity;
  readonly version: typeof executiveStageProductivityContractVersion;
  readonly namespace: typeof executiveStageProductivityContractNamespace;
  readonly phase: typeof executiveStageProductivityContractPhase;
  readonly architecturalRole: typeof executiveStageProductivityContractArchitecturalRole;
};

const IDENTITY: ExecutiveStageProductivityContractIdentity = Object.freeze({
  id: executiveStageProductivityContractIdentity,
  version: executiveStageProductivityContractVersion,
  namespace: executiveStageProductivityContractNamespace,
  phase: executiveStageProductivityContractPhase,
  architecturalRole: executiveStageProductivityContractArchitecturalRole,
});

export function getExecutiveStageProductivityContractIdentity(): ExecutiveStageProductivityContractIdentity {
  return IDENTITY;
}

export const EXECUTIVE_STAGE_PRODUCTIVITY_BOUNDARY = Object.freeze({
  architecturalRole: executiveStageProductivityContractArchitecturalRole,
  ownsBusinessTruth: false as const,
  ownsDataReality: false as const,
  inventsRelationships: false as const,
  implementsQueueExpansion: false as const,
  implementsNextBestAction: false as const,
  implementsChangeIntelligence: false as const,
  replacesTopologyEngine: false as const,
  replacesFixedCamera: false as const,
  movesCamera: false as const,
  changesSemanticZ: false as const,
  conflatesWatchAndQueue: false as const,
  conflatesObjectKindAndSpatialRole: false as const,
  queueEntriesAreSemanticObjects: false as const,
  presentationOnly: true as const,
});

// ─── Core contracts ─────────────────────────────────────────────────────────

/** Presentation context modes — Collection is not a fake semantic Object. */
export type ExecutiveStagePresentationMode =
  | "overview"
  | "object-focus"
  | "collection"
  | "preparation";

/**
 * Primary spatial roles for visible semantic Objects.
 * OBJECT KIND ≠ SPATIAL ROLE (problem may be center | related | watch | collection).
 * STAGE-PROD:1 adds "collection" for collection-browser members (no semantic center).
 */
export type ExecutiveStageSpatialRole =
  | "center"
  | "related"
  | "watch"
  | "collection";

export type ExecutiveStageDisclosureReason =
  | "center-subject"
  | "direct-related"
  | "overview-goal"
  | "overview-executive-context"
  | "watch-attention"
  | "watch-critical"
  | "watch-recommended"
  | "watch-unresolved"
  | "collection-member"
  | "hidden-unrelated"
  | "hidden-watch-overflow"
  | "hidden-density";

export type ExecutiveQueueCategory =
  | "problem"
  | "scenario"
  | "decision"
  | "execution";

/**
 * Queue entries are collection/disclosure controls — never topology subjects,
 * never (0,0) focus Objects, never Data Reality business Objects.
 */
export type ExecutiveQueueEntry = {
  readonly category: ExecutiveQueueCategory;
  readonly count: number;
  readonly objectIds: readonly string[];
  readonly participatesInTopology: false;
  readonly isSemanticObject: false;
  readonly isCollectionControl: true;
};

export type ExecutiveStageInteractionPrecedenceRank =
  | "direct-object-click"
  | "navigation-restore"
  | "automatic-focus"
  | "attention"
  | "fallback";

export const EXECUTIVE_STAGE_INTERACTION_PRECEDENCE = Object.freeze([
  "direct-object-click",
  "navigation-restore",
  "automatic-focus",
  "attention",
  "fallback",
] as const satisfies readonly ExecutiveStageInteractionPrecedenceRank[]);

export const EXECUTIVE_STAGE_WATCH_BUDGET = Object.freeze({
  minVisible: 2,
  /** STAGE-PROD:6V — calibrated from 4 → 3 for executive visual clarity. */
  maxVisible: 3,
});

export const EXECUTIVE_STAGE_DENSITY_RESOLUTION_ORDER = Object.freeze([
  "preserve-center",
  "preserve-highest-value-related",
  "preserve-highest-value-watch",
  "preserve-minimum-readable-scale",
  "hide-lower-priority-candidates",
] as const);

export const EXECUTIVE_STAGE_PROGRESSIVE_DISCLOSURE_ORDER = Object.freeze([
  "center",
  "direct-related",
  "watch-worthy",
  "collection-disclosed",
] as const);

/**
 * Semantic reserved fields on the certified Stage plane.
 * Soft field for RELATED; hard exclusion for WATCH + QUEUE territories.
 */
export const EXECUTIVE_STAGE_PRODUCTIVITY_REGIONS = Object.freeze({
  /** Immovable CENTER topology anchor. */
  centerAnchor: Object.freeze({ x: 0, y: 0, topologyZ: 0 as const }),
  /**
   * RELATED field — left / upper-left / upper-center presentation territory.
   * Semantic placement preference for the layout solver (not a push-out zone).
   */
  relatedField: Object.freeze({
    id: "related-field",
    hardness: "soft" as const,
    minX: EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.minX,
    maxX: 0.55,
    minY: -1.2,
    maxY: 2.0,
  }),
  /** WATCH — stable upper-right Stage region (real Nexora Objects). */
  watchTerritory: Object.freeze({
    id: "watch-territory",
    hardness: "soft" as const,
    minX: 1.15,
    maxX: 2.35,
    minY: 0.95,
    maxY: 1.85,
  }),
  /**
   * EXECUTIVE QUEUE — compact right-side launcher (UX:1).
   * Collection controls only; semantic Objects must not enter this chip.
   * Vertical band matches the collapsed Queue control; keep minX so Objects
   * cannot sit under the launcher.
   */
  executiveQueue: Object.freeze({
    id: "executive-queue",
    hardness: "hard" as const,
    minX: 2.85,
    maxX: EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS.maxX,
    minY: -1.2,
    maxY: 0.7,
  }),
});

export type ExecutiveStageAuthorityDisposition =
  | "keep"
  | "route"
  | "demote"
  | "remove";

export type ExecutiveStageAuthorityRow = Readonly<{
  readonly concern: string;
  readonly currentWriters: readonly string[];
  readonly desiredAuthority: string;
  readonly disposition: ExecutiveStageAuthorityDisposition;
}>;

/** Frozen authority audit for STAGE-PROD:0 (audit before delete). */
export const EXECUTIVE_STAGE_PRODUCTIVITY_AUTHORITY_TABLE = Object.freeze([
  Object.freeze({
    concern: "primary-stage-subject",
    currentWriters: Object.freeze([
      "nexoraMVPObjectInteraction.focusedSubject",
      "nexoraMVPObjectInteraction.selectedSubject",
      "nexora3DExecutiveStage.focusedObjectId",
    ]),
    desiredAuthority: "resolvePrimaryStageSubjectId",
    disposition: "route" as const,
  }),
  Object.freeze({
    concern: "interaction-precedence",
    currentWriters: Object.freeze([
      "executiveStageFocusPrecedence",
      "nexoraMVPDataRealityAwareSceneChoreography",
    ]),
    desiredAuthority: "EXECUTIVE_STAGE_INTERACTION_PRECEDENCE",
    disposition: "route" as const,
  }),
  Object.freeze({
    concern: "disclosure-visibility",
    currentWriters: Object.freeze([
      "executiveFocusSceneDisclosure",
      "nexora3DExecutiveStage.resolveNexoraMVPStageScenePresentation",
    ]),
    desiredAuthority: "resolveExecutiveStageDisclosure",
    disposition: "demote" as const,
  }),
  Object.freeze({
    concern: "spatial-role",
    currentWriters: Object.freeze([
      "nexora3DExecutiveStage role mapping",
      "executiveFocusVisualGrammar",
    ]),
    desiredAuthority: "resolveExecutiveStageSpatialRole",
    disposition: "route" as const,
  }),
  Object.freeze({
    concern: "watch-classification",
    currentWriters: Object.freeze([
      "executiveFocusSceneDisclosure.background-discoverable",
      "Data Reality attention overlay",
    ]),
    desiredAuthority: "rankExecutiveWatchCandidates + WATCH spatial role",
    disposition: "route" as const,
  }),
  Object.freeze({
    concern: "executive-queue",
    currentWriters: Object.freeze([
      "executiveThreadExpansion collapsed gateway",
      "(none — queue product not yet implemented)",
    ]),
    desiredAuthority: "resolveExecutiveQueueSummary (outside topology)",
    disposition: "keep" as const,
  }),
  Object.freeze({
    concern: "topology-xy",
    currentWriters: Object.freeze([
      "executiveStage2DTopologyRecomposition",
      "executiveStage2DHardSeparation",
      "executiveStageReservedRegionContainment",
    ]),
    desiredAuthority: "STAGE-2D topology stack (unchanged)",
    disposition: "keep" as const,
  }),
  Object.freeze({
    concern: "topology-z",
    currentWriters: Object.freeze([
      "executiveStage2DTopologyPlane",
      "executiveTrue2DStageAuthority",
    ]),
    desiredAuthority: "topologyZ === 0",
    disposition: "keep" as const,
  }),
  Object.freeze({
    concern: "camera",
    currentWriters: Object.freeze(["executiveStage2DFixedCamera"]),
    desiredAuthority: "STAGE-2D:1 fixed camera → (0,0,0)",
    disposition: "keep" as const,
  }),
  Object.freeze({
    concern: "advisor-context",
    currentWriters: Object.freeze([
      "buildNexoraMVPAdvisorContextBridge",
      "resolveDataRealityAwareAdvisorPrimarySubjectId",
    ]),
    desiredAuthority: "primaryStageSubjectId ≡ advisorSubjectId",
    disposition: "route" as const,
  }),
  Object.freeze({
    concern: "director-presentation",
    currentWriters: Object.freeze(["NOL Object Director plans"]),
    desiredAuthority:
      "Director coordinates mode/transitions; must not invent center/watch/queue",
    disposition: "demote" as const,
  }),
  Object.freeze({
    concern: "navigation-trail",
    currentWriters: Object.freeze([
      "executiveStage2DNavigationTrail",
      "nexoraMVPObjectInteraction",
    ]),
    desiredAuthority: "semantic ID restore → recomputed disclosure",
    disposition: "keep" as const,
  }),
] as const satisfies readonly ExecutiveStageAuthorityRow[]);

// ─── Input / output contracts ───────────────────────────────────────────────

export type ExecutiveStageProductivitySubjectInput = {
  readonly subjectId: string;
  readonly label?: string;
  readonly objectKind?: string;
  readonly family?: ExecutiveFocusSceneSubjectInput["family"];
  readonly workKind?: ExecutiveWorkKind;
  readonly attention?: string;
  readonly status?: string;
  readonly recommended?: boolean;
  readonly linkedBusinessObjectIds?: readonly string[];
};

export type ResolvePrimaryStageSubjectInput = {
  readonly clickedObjectId?: string | null;
  readonly selectedObjectId?: string | null;
  readonly focusedObjectId?: string | null;
  readonly navigationRestoredObjectId?: string | null;
  readonly automaticFocusObjectId?: string | null;
  readonly attentionObjectId?: string | null;
  readonly fallbackObjectId?: string | null;
  readonly presentationMode?: ExecutiveStagePresentationMode;
  /** Canonical Company / Executive / Business Context id when present in model. */
  readonly executiveContextObjectId?: string | null;
};

export type ResolveExecutiveStageDisclosureInput = {
  readonly subjects: readonly ExecutiveStageProductivitySubjectInput[];
  readonly relationships: readonly ExecutiveFocusSceneRelationshipInput[];
  readonly presentationMode: ExecutiveStagePresentationMode;
  readonly presentationDepth?: ExecutiveFocusPresentationDepth;
  readonly primaryStageSubjectId?: string | null;
  readonly executiveContextObjectId?: string | null;
  /** Collection context — presentation only; not a semantic Object. */
  readonly collectionCategory?: ExecutiveQueueCategory | null;
  readonly collectionObjectIds?: readonly string[];
  readonly expandExecutiveThread?: boolean;
  readonly watchBudgetMax?: number;
};

export type ExecutiveStageDisclosureObjectEntry = {
  readonly objectId: string;
  readonly objectKind: string;
  readonly spatialRole: ExecutiveStageSpatialRole | "hidden";
  readonly disclosureReason: ExecutiveStageDisclosureReason;
  readonly participatesInTopology: boolean;
};

export type ExecutiveStageDisclosureResult = {
  readonly identity: typeof executiveStageProductivityContractIdentity;
  readonly version: typeof executiveStageProductivityContractVersion;
  readonly presentationMode: ExecutiveStagePresentationMode;
  readonly primaryStageSubjectId: string | null;
  readonly advisorSubjectId: string | null;
  readonly centerObjectId: string | null;
  readonly relatedObjectIds: readonly string[];
  readonly collectionObjectIds: readonly string[];
  readonly watchObjectIds: readonly string[];
  readonly hiddenObjectIds: readonly string[];
  readonly entries: readonly ExecutiveStageDisclosureObjectEntry[];
  readonly byId: ReadonlyMap<string, ExecutiveStageDisclosureObjectEntry>;
  readonly queue: readonly ExecutiveQueueEntry[];
  readonly queueRegionReserved: true;
  readonly watchRegionReserved: true;
  readonly topologyZContract: 0;
  readonly cameraContract: "fixed-2d-target-origin";
  /** Legacy SP:4.1B payload retained for demoted consumers / thread collapse. */
  readonly legacyFocusDisclosure: ExecutiveFocusSceneDisclosureResult | null;
};

export type ExecutiveStageProductivityObservability = {
  readonly presentationMode: ExecutiveStagePresentationMode;
  readonly primaryStageSubjectId: string | null;
  readonly advisorSubjectId: string | null;
  readonly centerObjectId: string | null;
  readonly relatedObjectIds: readonly string[];
  readonly watchObjectIds: readonly string[];
  readonly hiddenObjectIds: readonly string[];
  readonly queueRegionReserved: true;
  readonly watchRegionReserved: true;
  readonly cameraContract: "fixed-2d-target-origin";
  readonly topologyZContract: 0;
  readonly contract: typeof executiveStageProductivityContractIdentity;
  readonly objects: readonly {
    readonly objectId: string;
    readonly objectKind: string;
    readonly spatialRole: ExecutiveStageSpatialRole | "hidden";
    readonly finalX?: number;
    readonly finalY?: number;
    readonly topologyZ: 0;
    readonly disclosureReason: ExecutiveStageDisclosureReason;
  }[];
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function normalizeToken(value: string | undefined): string {
  return (value ?? "").toLowerCase().trim();
}

function resolveObjectKind(
  subject: ExecutiveStageProductivitySubjectInput,
): string {
  if (subject.workKind != null) return subject.workKind;
  if (subject.objectKind != null && subject.objectKind.length > 0) {
    return subject.objectKind;
  }
  if (subject.family === "executive-work") return "problem";
  if (subject.family === "collapsed-thread") return "context";
  return "object";
}

function isGoalKind(kind: string): boolean {
  return normalizeToken(kind).includes("goal");
}

function isExecutiveContextKind(kind: string): boolean {
  const value = normalizeToken(kind);
  return (
    value === "company" ||
    value === "executive" ||
    value === "executive-context" ||
    value === "business-context" ||
    value === "enterprise" ||
    value === "pack"
  );
}

function isWatchEligible(subject: ExecutiveStageProductivitySubjectInput): boolean {
  const attention = normalizeToken(subject.attention);
  const status = normalizeToken(subject.status);
  if (subject.recommended === true) return true;
  if (
    attention === "critical" ||
    attention === "important" ||
    attention === "elevated"
  ) {
    return true;
  }
  if (
    status === "risk" ||
    status === "unresolved" ||
    status === "watch"
  ) {
    return true;
  }
  return false;
}

function watchRank(subject: ExecutiveStageProductivitySubjectInput): number {
  const attention = normalizeToken(subject.attention);
  const status = normalizeToken(subject.status);
  let score = 0;
  if (attention === "critical") score += 400;
  else if (attention === "important") score += 300;
  else if (attention === "elevated") score += 200;
  if (subject.recommended === true) score += 350;
  if (status === "unresolved") score += 280;
  else if (status === "risk") score += 240;
  else if (status === "watch") score += 160;
  return score;
}

function toFocusSubject(
  subject: ExecutiveStageProductivitySubjectInput,
): ExecutiveFocusSceneSubjectInput {
  const family =
    subject.family ??
    (subject.workKind != null ? "executive-work" : "business-object");
  return Object.freeze({
    subjectId: subject.subjectId,
    label: subject.label,
    family,
    workKind: subject.workKind,
    attention: subject.attention,
    status: subject.status,
    linkedBusinessObjectIds: subject.linkedBusinessObjectIds,
  });
}

function mapLegacyStateToSpatialRole(
  state: string,
): ExecutiveStageSpatialRole | "hidden" {
  if (state === "visible-primary") return "center";
  if (state === "visible-related" || state === "collapsed-thread") {
    return "related";
  }
  if (state === "background-discoverable") return "watch";
  return "hidden";
}

// ─── Resolvers ──────────────────────────────────────────────────────────────

/**
 * Single authoritative Stage subject id for Stage + Advisor.
 * Reuses strongest existing equivalent: focused ?? selected (click wins).
 */
export function resolvePrimaryStageSubjectId(
  input: ResolvePrimaryStageSubjectInput,
): Readonly<{
  readonly primaryStageSubjectId: string | null;
  readonly advisorSubjectId: string | null;
  readonly precedenceRank: ExecutiveStageInteractionPrecedenceRank;
  readonly focusSource: ExecutiveStageFocusSource;
  readonly presentationMode: ExecutiveStagePresentationMode;
}> {
  const mode = input.presentationMode ?? "overview";

  if (mode === "overview") {
    const contextId =
      input.executiveContextObjectId != null &&
      input.executiveContextObjectId.length > 0
        ? input.executiveContextObjectId
        : null;
    return Object.freeze({
      primaryStageSubjectId: contextId,
      advisorSubjectId: contextId,
      precedenceRank: "fallback" as const,
      focusSource: "fallback" as const,
      presentationMode: "overview" as const,
    });
  }

  if (mode === "collection") {
    return Object.freeze({
      primaryStageSubjectId: null,
      advisorSubjectId: null,
      precedenceRank: "fallback" as const,
      focusSource: "fallback" as const,
      presentationMode: "collection" as const,
    });
  }

  if (mode === "preparation") {
    return Object.freeze({
      primaryStageSubjectId: null,
      advisorSubjectId: null,
      precedenceRank: "fallback" as const,
      focusSource: "fallback" as const,
      presentationMode: "preparation" as const,
    });
  }

  const clicked =
    input.clickedObjectId != null && input.clickedObjectId.length > 0
      ? input.clickedObjectId
      : null;
  const selected =
    input.selectedObjectId != null && input.selectedObjectId.length > 0
      ? input.selectedObjectId
      : null;
  const focused =
    input.focusedObjectId != null && input.focusedObjectId.length > 0
      ? input.focusedObjectId
      : null;
  const navigation =
    input.navigationRestoredObjectId != null &&
    input.navigationRestoredObjectId.length > 0
      ? input.navigationRestoredObjectId
      : null;

  if (clicked != null) {
    return Object.freeze({
      primaryStageSubjectId: clicked,
      advisorSubjectId: clicked,
      precedenceRank: "direct-object-click" as const,
      focusSource: "user-selection" as const,
      presentationMode: "object-focus" as const,
    });
  }
  if (selected != null && focused != null && selected === focused) {
    return Object.freeze({
      primaryStageSubjectId: selected,
      advisorSubjectId: selected,
      precedenceRank: "direct-object-click" as const,
      focusSource: "user-selection" as const,
      presentationMode: "object-focus" as const,
    });
  }
  if (navigation != null) {
    return Object.freeze({
      primaryStageSubjectId: navigation,
      advisorSubjectId: navigation,
      precedenceRank: "navigation-restore" as const,
      focusSource: "user-selection" as const,
      presentationMode: "object-focus" as const,
    });
  }

  const precedence = resolveExecutiveStageFocusPrecedence({
    explicitFocusedObjectId: focused ?? selected,
    automaticAttentionObjectId:
      input.automaticFocusObjectId ?? input.attentionObjectId,
    fallbackObjectId: input.fallbackObjectId,
  });

  const rank: ExecutiveStageInteractionPrecedenceRank =
    precedence.focusSource === "user-selection"
      ? "direct-object-click"
      : precedence.focusSource === "automatic-attention"
        ? "attention"
        : "fallback";

  return Object.freeze({
    primaryStageSubjectId: precedence.focusedObjectId,
    advisorSubjectId: precedence.focusedObjectId,
    precedenceRank: rank,
    focusSource: precedence.focusSource,
    presentationMode: "object-focus" as const,
  });
}

/**
 * Lightweight executive question contract for later Advisor / NBA phases.
 */
export function resolveExecutiveQuestionForObject(input: {
  readonly objectKind?: string | null;
  readonly workKind?: ExecutiveWorkKind | null;
  readonly shapeFamily?: ExecutiveObjectSemanticShapeFamily | null;
}): Readonly<{
  readonly question: string;
  readonly objectKind: string;
  readonly shapeFamily: ExecutiveObjectSemanticShapeFamily | null;
}> {
  const kind = normalizeToken(input.workKind ?? input.objectKind ?? "object");
  const shape =
    input.shapeFamily ??
    resolveExecutiveObjectSemanticShapeFamily(input.objectKind ?? kind);

  let question = "What is happening here?";
  switch (shape) {
    case "goal":
      question = "Are we achieving it?";
      break;
    case "problem":
      question = "What is causing it / what needs resolution?";
      break;
    case "risk":
      question = "What could happen?";
      break;
    case "scenario":
      question = "What happens if we choose this?";
      break;
    case "decision":
      question = "What should we choose?";
      break;
    case "execution":
      question = "Is the decision being delivered?";
      break;
    case "business-object":
      question = "What is happening here?";
      break;
    default:
      question = "What is happening here?";
      break;
  }

  return Object.freeze({
    question,
    objectKind: kind.length > 0 ? kind : "object",
    shapeFamily: shape,
  });
}

export function resolveExecutiveQueueSummary(input: {
  readonly subjects: readonly ExecutiveStageProductivitySubjectInput[];
}): readonly ExecutiveQueueEntry[] {
  const buckets: Record<ExecutiveQueueCategory, string[]> = {
    problem: [],
    scenario: [],
    decision: [],
    execution: [],
  };

  for (const subject of input.subjects) {
    const kind = resolveObjectKind(subject);
    if (
      kind === "problem" ||
      kind === "scenario" ||
      kind === "decision" ||
      kind === "execution"
    ) {
      buckets[kind].push(subject.subjectId);
    }
  }

  const categories = Object.freeze([
    "problem",
    "scenario",
    "decision",
    "execution",
  ] as const satisfies readonly ExecutiveQueueCategory[]);

  return Object.freeze(
    categories.map((category) => {
      const objectIds = Object.freeze(
        [...buckets[category]].sort(compareIds),
      );
      return Object.freeze({
        category,
        count: objectIds.length,
        objectIds,
        participatesInTopology: false as const,
        isSemanticObject: false as const,
        isCollectionControl: true as const,
      });
    }),
  );
}

/**
 * Deterministic Watch ranking. Hidden overflow remains model-present.
 */
export function rankExecutiveWatchCandidates(input: {
  readonly candidates: readonly ExecutiveStageProductivitySubjectInput[];
  readonly excludeIds?: ReadonlySet<string>;
  readonly maxVisible?: number;
}): Readonly<{
  readonly visibleIds: readonly string[];
  readonly overflowIds: readonly string[];
  readonly rankedIds: readonly string[];
}> {
  const exclude = input.excludeIds ?? new Set<string>();
  const max = Math.max(
    1,
    Math.min(
      input.maxVisible ?? EXECUTIVE_STAGE_WATCH_BUDGET.maxVisible,
      EXECUTIVE_STAGE_WATCH_BUDGET.maxVisible,
    ),
  );

  const eligible = input.candidates
    .filter(
      (subject) =>
        !exclude.has(subject.subjectId) && isWatchEligible(subject),
    )
    .sort((left, right) => {
      const rankDelta = watchRank(right) - watchRank(left);
      if (rankDelta !== 0) return rankDelta;
      return compareIds(left.subjectId, right.subjectId);
    });

  const rankedIds = Object.freeze(eligible.map((s) => s.subjectId));
  const visibleIds = Object.freeze(rankedIds.slice(0, max));
  const overflowIds = Object.freeze(rankedIds.slice(max));
  return Object.freeze({ visibleIds, overflowIds, rankedIds });
}

export function resolveExecutiveStageSpatialRole(input: {
  readonly objectId: string;
  readonly centerObjectId?: string | null;
  readonly relatedObjectIds?: readonly string[];
  readonly collectionObjectIds?: readonly string[];
  readonly watchObjectIds?: readonly string[];
}): ExecutiveStageSpatialRole | "hidden" {
  if (
    input.centerObjectId != null &&
    input.objectId === input.centerObjectId
  ) {
    return "center";
  }
  if (input.collectionObjectIds?.includes(input.objectId)) return "collection";
  if (input.relatedObjectIds?.includes(input.objectId)) return "related";
  if (input.watchObjectIds?.includes(input.objectId)) return "watch";
  return "hidden";
}

function buildEntry(
  partial: ExecutiveStageDisclosureObjectEntry,
): ExecutiveStageDisclosureObjectEntry {
  return Object.freeze(partial);
}

/**
 * Single deterministic disclosure decision point for STAGE-PROD:0.
 * Routes / demotes SP:4.1B for focus related resolution; owns Overview /
 * Watch / Collection classification and Queue separation.
 */
export function resolveExecutiveStageDisclosure(
  input: ResolveExecutiveStageDisclosureInput,
): ExecutiveStageDisclosureResult {
  const depth = input.presentationDepth ?? "minimum";
  const subjectsById = new Map(
    input.subjects.map((subject) => [subject.subjectId, subject]),
  );
  const queue = resolveExecutiveQueueSummary({ subjects: input.subjects });
  const watchBudget =
    input.watchBudgetMax ?? EXECUTIVE_STAGE_WATCH_BUDGET.maxVisible;

  const entries = new Map<string, ExecutiveStageDisclosureObjectEntry>();
  let primaryStageSubjectId: string | null = null;
  let legacy: ExecutiveFocusSceneDisclosureResult | null = null;

  const mark = (
    objectId: string,
    spatialRole: ExecutiveStageSpatialRole | "hidden",
    disclosureReason: ExecutiveStageDisclosureReason,
  ) => {
    const subject = subjectsById.get(objectId);
    const objectKind = subject != null ? resolveObjectKind(subject) : "object";
    entries.set(
      objectId,
      buildEntry({
        objectId,
        objectKind,
        spatialRole,
        disclosureReason,
        participatesInTopology: spatialRole !== "hidden",
      }),
    );
  };

  if (input.presentationMode === "collection") {
    primaryStageSubjectId = null;
    const collectionIds = new Set(input.collectionObjectIds ?? []);
    for (const subject of input.subjects) {
      if (collectionIds.has(subject.subjectId)) {
        mark(subject.subjectId, "collection", "collection-member");
      } else if (isWatchEligible(subject)) {
        // Watch remains available beside collection context.
        // Rank applied below — collection membership wins duplicates.
      } else {
        mark(subject.subjectId, "hidden", "hidden-unrelated");
      }
    }
    const watch = rankExecutiveWatchCandidates({
      candidates: input.subjects,
      excludeIds: collectionIds,
      maxVisible: watchBudget,
    });
    for (const id of watch.visibleIds) {
      if (!entries.has(id) || entries.get(id)?.spatialRole === "hidden") {
        const subject = subjectsById.get(id);
        const reason: ExecutiveStageDisclosureReason =
          subject?.recommended === true
            ? "watch-recommended"
            : normalizeToken(subject?.attention) === "critical"
              ? "watch-critical"
              : normalizeToken(subject?.status) === "unresolved"
                ? "watch-unresolved"
                : "watch-attention";
        mark(id, "watch", reason);
      }
    }
    for (const id of watch.overflowIds) {
      if (!entries.has(id)) mark(id, "hidden", "hidden-watch-overflow");
    }
    for (const subject of input.subjects) {
      if (!entries.has(subject.subjectId)) {
        mark(subject.subjectId, "hidden", "hidden-unrelated");
      }
    }
  } else if (input.presentationMode === "preparation") {
    // STAGE-PROD:6 — preparation members reuse collection spatial role; no center.
    primaryStageSubjectId = null;
    const preparationIds = new Set(input.collectionObjectIds ?? []);
    for (const subject of input.subjects) {
      if (preparationIds.has(subject.subjectId)) {
        mark(subject.subjectId, "collection", "collection-member");
      }
    }
    const watch = rankExecutiveWatchCandidates({
      candidates: input.subjects,
      excludeIds: preparationIds,
      maxVisible: watchBudget,
    });
    for (const id of watch.visibleIds) {
      if (!entries.has(id) || entries.get(id)?.spatialRole === "hidden") {
        const subject = subjectsById.get(id);
        const reason: ExecutiveStageDisclosureReason =
          subject?.recommended === true
            ? "watch-recommended"
            : normalizeToken(subject?.attention) === "critical"
              ? "watch-critical"
              : normalizeToken(subject?.status) === "unresolved"
                ? "watch-unresolved"
                : "watch-attention";
        mark(id, "watch", reason);
      }
    }
    for (const id of watch.overflowIds) {
      if (!entries.has(id)) mark(id, "hidden", "hidden-watch-overflow");
    }
    for (const subject of input.subjects) {
      if (!entries.has(subject.subjectId)) {
        mark(subject.subjectId, "hidden", "hidden-unrelated");
      }
    }
  } else if (input.presentationMode === "overview") {
    const contextId =
      input.executiveContextObjectId != null &&
      subjectsById.has(input.executiveContextObjectId)
        ? input.executiveContextObjectId
        : ([...subjectsById.values()].find((subject) =>
            isExecutiveContextKind(resolveObjectKind(subject)),
          )?.subjectId ?? null);

    primaryStageSubjectId = contextId;
    if (contextId != null) {
      mark(contextId, "center", "overview-executive-context");
    }

    const goalIds = [...subjectsById.values()]
      .filter((subject) => isGoalKind(resolveObjectKind(subject)))
      .map((subject) => subject.subjectId)
      .sort(compareIds);

    for (const goalId of goalIds) {
      if (goalId === contextId) continue;
      mark(goalId, "related", "overview-goal");
    }

    const exclude = new Set<string>([
      ...(contextId != null ? [contextId] : []),
      ...goalIds,
    ]);
    const watch = rankExecutiveWatchCandidates({
      candidates: input.subjects.filter(
        (subject) =>
          subject.family !== "executive-work" &&
          subject.workKind == null,
      ),
      excludeIds: exclude,
      maxVisible: watchBudget,
    });
    for (const id of watch.visibleIds) {
      const subject = subjectsById.get(id);
      const reason: ExecutiveStageDisclosureReason =
        subject?.recommended === true
          ? "watch-recommended"
          : normalizeToken(subject?.attention) === "critical"
            ? "watch-critical"
            : normalizeToken(subject?.status) === "unresolved"
              ? "watch-unresolved"
              : "watch-attention";
      mark(id, "watch", reason);
    }
    for (const id of watch.overflowIds) {
      mark(id, "hidden", "hidden-watch-overflow");
    }
    for (const subject of input.subjects) {
      if (!entries.has(subject.subjectId)) {
        // Executive-work stays in Queue summary — not Stage topology in overview.
        mark(subject.subjectId, "hidden", "hidden-unrelated");
      }
    }
  } else {
    // object-focus
    const subjectId =
      input.primaryStageSubjectId != null &&
      subjectsById.has(input.primaryStageSubjectId)
        ? input.primaryStageSubjectId
        : null;
    primaryStageSubjectId = subjectId;

    const focusSubjects = input.subjects.map(toFocusSubject);
    const focusedFamily =
      subjectId == null
        ? null
        : (subjectsById.get(subjectId)?.family ??
          (subjectsById.get(subjectId)?.workKind != null
            ? "executive-work"
            : "business-object"));

    legacy = resolveExecutiveFocusSceneDisclosure({
      subjects: focusSubjects,
      relationships: input.relationships,
      focusedSubjectId: subjectId,
      focusedSubjectFamily: focusedFamily,
      presentationDepth: depth,
      expandExecutiveThread: input.expandExecutiveThread,
    });

    const relatedFromCanonical =
      subjectId == null
        ? Object.freeze([] as string[])
        : resolveExecutiveFocusRelatedObjectIds({
            focusedObjectId: subjectId,
            connections: input.relationships,
          });

    const relatedSet = new Set<string>();
    if (subjectId != null) {
      mark(subjectId, "center", "center-subject");
    }

    for (const entry of legacy.entries) {
      if (entry.subjectId === subjectId) continue;
      if (
        entry.state === "visible-related" ||
        entry.state === "collapsed-thread"
      ) {
        relatedSet.add(entry.subjectId);
        mark(entry.subjectId, "related", "direct-related");
      }
    }

    // Prefer canonical 1-hop business relationships for RELATED field.
    for (const relatedId of relatedFromCanonical) {
      if (relatedId === subjectId) continue;
      if (!subjectsById.has(relatedId)) continue;
      if (entries.get(relatedId)?.spatialRole === "center") continue;
      relatedSet.add(relatedId);
      mark(relatedId, "related", "direct-related");
    }

    const exclude = new Set<string>([
      ...(subjectId != null ? [subjectId] : []),
      ...relatedSet,
    ]);
    const watch = rankExecutiveWatchCandidates({
      candidates: input.subjects.filter((subject) => {
        // Watch is awareness of Objects outside the direct reasoning path.
        if (subject.workKind != null) return false;
        if (subject.family === "executive-work") return false;
        return true;
      }),
      excludeIds: exclude,
      maxVisible: watchBudget,
    });

    for (const id of watch.visibleIds) {
      const subject = subjectsById.get(id);
      const reason: ExecutiveStageDisclosureReason =
        subject?.recommended === true
          ? "watch-recommended"
          : normalizeToken(subject?.attention) === "critical"
            ? "watch-critical"
            : normalizeToken(subject?.status) === "unresolved"
              ? "watch-unresolved"
              : "watch-attention";
      mark(id, "watch", reason);
    }
    for (const id of watch.overflowIds) {
      mark(id, "hidden", "hidden-watch-overflow");
    }

    for (const subject of input.subjects) {
      if (!entries.has(subject.subjectId)) {
        const legacyState = legacy.byId.get(subject.subjectId)?.state;
        if (legacyState === "background-discoverable") {
          // Already handled via watch ranking when eligible; else hide.
          mark(subject.subjectId, "hidden", "hidden-density");
        } else {
          mark(subject.subjectId, "hidden", "hidden-unrelated");
        }
      }
    }
  }

  const relatedObjectIds = Object.freeze(
    [...entries.values()]
      .filter((entry) => entry.spatialRole === "related")
      .map((entry) => entry.objectId)
      .sort(compareIds),
  );
  const collectionObjectIds = Object.freeze(
    [...entries.values()]
      .filter((entry) => entry.spatialRole === "collection")
      .map((entry) => entry.objectId)
      .sort(compareIds),
  );
  const watchObjectIds = Object.freeze(
    [...entries.values()]
      .filter((entry) => entry.spatialRole === "watch")
      .map((entry) => entry.objectId)
      .sort(compareIds),
  );
  const hiddenObjectIds = Object.freeze(
    [...entries.values()]
      .filter((entry) => entry.spatialRole === "hidden")
      .map((entry) => entry.objectId)
      .sort(compareIds),
  );
  const centerObjectId =
    [...entries.values()].find((entry) => entry.spatialRole === "center")
      ?.objectId ?? null;

  return Object.freeze({
    identity: executiveStageProductivityContractIdentity,
    version: executiveStageProductivityContractVersion,
    presentationMode: input.presentationMode,
    primaryStageSubjectId,
    advisorSubjectId: primaryStageSubjectId,
    centerObjectId,
    relatedObjectIds,
    collectionObjectIds,
    watchObjectIds,
    hiddenObjectIds,
    entries: Object.freeze([...entries.values()]),
    byId: entries,
    queue,
    queueRegionReserved: true as const,
    watchRegionReserved: true as const,
    topologyZContract: 0 as const,
    cameraContract: "fixed-2d-target-origin" as const,
    legacyFocusDisclosure: legacy,
  });
}

export function mapExecutiveFocusDisclosureToSpatialRole(
  state: string,
): ExecutiveStageSpatialRole | "hidden" {
  return mapLegacyStateToSpatialRole(state);
}

export function isExecutiveQueueEntrySemanticObject(
  entry: ExecutiveQueueEntry,
): false {
  return entry.isSemanticObject;
}

export function buildExecutiveStageProductivityObservability(
  disclosure: ExecutiveStageDisclosureResult,
  positions?: Readonly<
    Record<string, { readonly x: number; readonly y: number }>
  >,
): ExecutiveStageProductivityObservability {
  return Object.freeze({
    presentationMode: disclosure.presentationMode,
    primaryStageSubjectId: disclosure.primaryStageSubjectId,
    advisorSubjectId: disclosure.advisorSubjectId,
    centerObjectId: disclosure.centerObjectId,
    relatedObjectIds: disclosure.relatedObjectIds,
    watchObjectIds: disclosure.watchObjectIds,
    hiddenObjectIds: disclosure.hiddenObjectIds,
    queueRegionReserved: true as const,
    watchRegionReserved: true as const,
    cameraContract: "fixed-2d-target-origin" as const,
    topologyZContract: 0 as const,
    contract: executiveStageProductivityContractIdentity,
    objects: Object.freeze(
      disclosure.entries.map((entry) => {
        const pos = positions?.[entry.objectId];
        return Object.freeze({
          objectId: entry.objectId,
          objectKind: entry.objectKind,
          spatialRole: entry.spatialRole,
          ...(pos != null ? { finalX: pos.x, finalY: pos.y } : {}),
          topologyZ: 0 as const,
          disclosureReason: entry.disclosureReason,
        });
      }),
    ),
  });
}

export function verifyExecutiveStageProductivityContract(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly watchQueueSeparated: boolean;
  readonly kindRoleSeparated: boolean;
  readonly precedenceValid: boolean;
}> {
  const identity = getExecutiveStageProductivityContractIdentity();
  const identityValid =
    identity.id === executiveStageProductivityContractIdentity &&
    identity.version === executiveStageProductivityContractVersion &&
    identity.namespace === executiveStageProductivityContractNamespace;

  const boundaryValid =
    EXECUTIVE_STAGE_PRODUCTIVITY_BOUNDARY.queueEntriesAreSemanticObjects ===
      false &&
    EXECUTIVE_STAGE_PRODUCTIVITY_BOUNDARY.conflatesWatchAndQueue === false &&
    EXECUTIVE_STAGE_PRODUCTIVITY_BOUNDARY.movesCamera === false &&
    EXECUTIVE_STAGE_PRODUCTIVITY_BOUNDARY.changesSemanticZ === false;

  const queue = resolveExecutiveQueueSummary({
    subjects: [
      Object.freeze({
        subjectId: "ctx-problem-a",
        workKind: "problem" as const,
        family: "executive-work" as const,
      }),
      Object.freeze({
        subjectId: "obj-capacity",
        objectKind: "object",
        attention: "important",
      }),
    ],
  });
  const watchQueueSeparated =
    queue.every((entry) => entry.isSemanticObject === false) &&
    queue.find((entry) => entry.category === "problem")?.count === 1 &&
    !queue.some((entry) => entry.objectIds.includes("obj-capacity"));

  const kindRoleSeparated =
    resolveExecutiveStageSpatialRole({
      objectId: "ctx-problem-a",
      centerObjectId: "ctx-problem-a",
    }) === "center";

  const precedenceValid =
    EXECUTIVE_STAGE_INTERACTION_PRECEDENCE[0] === "direct-object-click" &&
    EXECUTIVE_STAGE_INTERACTION_PRECEDENCE[1] === "navigation-restore";

  const ok =
    options?.forceFailure === true
      ? false
      : identityValid &&
        boundaryValid &&
        watchQueueSeparated &&
        kindRoleSeparated &&
        precedenceValid;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    watchQueueSeparated,
    kindRoleSeparated,
    precedenceValid,
  });
}
