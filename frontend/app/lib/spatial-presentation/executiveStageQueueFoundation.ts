/**
 * STAGE-PROD:1 — Executive Queue Foundation & Collection Disclosure.
 *
 * Queue Summary → Collection Disclosure → Real Object Selection → CENTER (0,0)
 *
 * Builds on STAGE-PROD:0. Does not reopen camera, topology engine, Watch
 * architecture, Data Reality, NBA, or Change Intelligence.
 *
 * Queue entries are presentation controls — never semantic Objects.
 */

import {
  EXECUTIVE_STAGE_PRODUCTIVITY_REGIONS,
  resolveExecutiveStageDisclosure,
  type ExecutiveQueueCategory,
  type ExecutiveQueueEntry,
  type ExecutiveStageDisclosureResult,
  type ExecutiveStagePresentationMode,
  type ExecutiveStageProductivitySubjectInput,
} from "./executiveStageProductivityContract.ts";
export type {
  ExecutiveQueueCategory,
  ExecutiveQueueEntry,
  ExecutiveStagePresentationMode,
};
import type { ExecutiveFocusSceneRelationshipInput } from "./executiveFocusSceneDisclosure.ts";
import {
  EXECUTIVE_STAGE_2D_DEPTH,
  normalizeExecutiveStage2DPosition,
} from "./executiveStage2DFixedCamera.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStageQueueFoundationIdentity =
  "STAGE-PROD:1/ExecutiveStageQueueFoundation" as const;

export const executiveStageQueueFoundationVersion = "1.0.0" as const;

export const executiveStageQueueFoundationNamespace =
  "nexora.spatial-presentation.executive-stage-queue-foundation" as const;

export const executiveStageQueueFoundationPhase =
  "ExecutiveQueueFoundationAndCollectionDisclosure" as const;

export const executiveStageQueueFoundationArchitecturalRole =
  "PresentationOnlyExecutiveQueueAndCollectionAuthority" as const;

export type ExecutiveStageQueueFoundationIdentity = {
  readonly id: typeof executiveStageQueueFoundationIdentity;
  readonly version: typeof executiveStageQueueFoundationVersion;
  readonly namespace: typeof executiveStageQueueFoundationNamespace;
  readonly phase: typeof executiveStageQueueFoundationPhase;
  readonly architecturalRole: typeof executiveStageQueueFoundationArchitecturalRole;
};

const IDENTITY: ExecutiveStageQueueFoundationIdentity = Object.freeze({
  id: executiveStageQueueFoundationIdentity,
  version: executiveStageQueueFoundationVersion,
  namespace: executiveStageQueueFoundationNamespace,
  phase: executiveStageQueueFoundationPhase,
  architecturalRole: executiveStageQueueFoundationArchitecturalRole,
});

export function getExecutiveStageQueueFoundationIdentity(): ExecutiveStageQueueFoundationIdentity {
  return IDENTITY;
}

export const EXECUTIVE_STAGE_QUEUE_FOUNDATION_BOUNDARY = Object.freeze({
  architecturalRole: executiveStageQueueFoundationArchitecturalRole,
  queueEntriesAreSemanticObjects: false as const,
  inventsRelationships: false as const,
  implementsNextBestAction: false as const,
  implementsChangeIntelligence: false as const,
  implementsQueueSearch: false as const,
  implementsQueuePagination: false as const,
  movesCamera: false as const,
  changesSemanticZ: false as const,
  autoSelectsCollectionMember: false as const,
  presentationOnly: true as const,
});

// ─── Contracts ──────────────────────────────────────────────────────────────

export type ExecutiveStageCollectionContext = {
  /** object-kind = Problems/… ; productivity = Recent Changes */
  readonly collectionKind?: "object-kind" | "productivity";
  readonly category: ExecutiveQueueCategory | "changes-since-visit";
  readonly objectIds: readonly string[];
  /** STAGE-PROD:2 — restrained change annotations keyed by objectId */
  readonly changeAnnotations?: Readonly<
    Record<
      string,
      Readonly<{
        readonly changeKind: string;
        readonly annotation: string;
        readonly reason: string;
        readonly importance: number;
      }>
    >
  >;
};

export type ExecutiveStageNavigationContextKind =
  | "overview"
  | "object-focus"
  | "collection";

/** Trail token for collection contexts — not a semantic Object ID. */
export const EXECUTIVE_QUEUE_COLLECTION_TRAIL_PREFIX =
  "nexora-collection:" as const;

export function encodeExecutiveQueueCollectionTrailId(
  category: ExecutiveQueueCategory | "changes-since-visit",
): string {
  return `${EXECUTIVE_QUEUE_COLLECTION_TRAIL_PREFIX}${category}`;
}

export function isExecutiveQueueCollectionTrailId(id: string): boolean {
  return id.startsWith(EXECUTIVE_QUEUE_COLLECTION_TRAIL_PREFIX);
}

export function decodeExecutiveQueueCollectionTrailId(
  id: string,
): ExecutiveQueueCategory | "changes-since-visit" | null {
  if (!isExecutiveQueueCollectionTrailId(id)) return null;
  const category = id.slice(EXECUTIVE_QUEUE_COLLECTION_TRAIL_PREFIX.length);
  if (
    category === "problem" ||
    category === "risk" ||
    category === "opportunity" ||
    category === "scenario" ||
    category === "decision" ||
    category === "execution" ||
    category === "goal" ||
    category === "changes-since-visit"
  ) {
    return category;
  }
  return null;
}

export const EXECUTIVE_QUEUE_CATEGORY_ORDER = Object.freeze([
  "problem",
  "scenario",
  "decision",
  "execution",
] as const satisfies readonly ExecutiveQueueCategory[]);

export const EXECUTIVE_QUEUE_CATEGORY_LABELS = Object.freeze({
  problem: "Problems",
  risk: "Risks",
  opportunity: "Opportunities",
  scenario: "Scenarios",
  decision: "Decisions",
  execution: "Executions",
  goal: "Goals",
  "changes-since-visit": "Recent Changes",
} as const);

/** Preferred: hide empty rows. */
export const EXECUTIVE_QUEUE_ZERO_COUNT_POLICY = "hide" as const;

/** Readable collection disclosure budget — STAGE-PROD:6V calibrated 8 → 6. */
export const EXECUTIVE_STAGE_COLLECTION_BUDGET = Object.freeze({
  maxVisible: 6,
  minVisible: 1,
});

export type ExecutiveQueueEligibleSubjectInput = {
  readonly subjectId: string;
  readonly objectKind?: string;
  readonly workKind?: ExecutiveQueueCategory | string;
  readonly family?: string;
  readonly attention?: string;
  readonly status?: string;
  readonly recommended?: boolean;
  readonly lifecycle?: string;
  readonly archived?: boolean;
  readonly locked?: boolean;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function normalizeToken(value: string | undefined): string {
  return (value ?? "").toLowerCase().trim();
}

function resolveQueueCategory(
  subject: ExecutiveQueueEligibleSubjectInput,
): ExecutiveQueueCategory | null {
  const kind = normalizeToken(subject.workKind ?? subject.objectKind);
  if (
    kind === "problem" ||
    kind === "risk" ||
    kind === "opportunity" ||
    kind === "scenario" ||
    kind === "decision" ||
    kind === "execution" ||
    kind === "goal"
  ) {
    return kind;
  }
  return null;
}

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const rounded = Math.round(value * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

// ─── Eligibility & aggregation ──────────────────────────────────────────────

/**
 * Pure eligibility for executive workload Queue membership.
 *
 * Excludes clearly inactive archived/locked historical entities when
 * lifecycle fields are present. Does not invent lifecycle rules.
 */
export function isExecutiveQueueEligibleObject(
  subject: ExecutiveQueueEligibleSubjectInput,
): boolean {
  if (resolveQueueCategory(subject) == null) return false;
  if (subject.archived === true) return false;
  if (subject.locked === true) return false;
  const lifecycle = normalizeToken(subject.lifecycle ?? subject.status);
  if (
    lifecycle === "archived" ||
    lifecycle === "locked" ||
    lifecycle === "historical" ||
    lifecycle === "retired" ||
    lifecycle === "obsolete"
  ) {
    return false;
  }
  return true;
}

/**
 * Authoritative Queue aggregation from the semantic catalog.
 * Counts are eligible Object counts — never hard-coded UI values.
 */
export function resolveExecutiveQueueEntries(input: {
  readonly subjects: readonly ExecutiveQueueEligibleSubjectInput[];
  readonly zeroCountPolicy?: "hide" | "disable";
}): readonly ExecutiveQueueEntry[] {
  const buckets: Record<ExecutiveQueueCategory, string[]> = {
    problem: [],
    risk: [],
    opportunity: [],
    scenario: [],
    decision: [],
    execution: [],
    goal: [],
  };

  for (const subject of input.subjects) {
    if (!isExecutiveQueueEligibleObject(subject)) continue;
    const category = resolveQueueCategory(subject);
    if (category == null) continue;
    buckets[category].push(subject.subjectId);
  }

  const policy = input.zeroCountPolicy ?? EXECUTIVE_QUEUE_ZERO_COUNT_POLICY;
  const entries: ExecutiveQueueEntry[] = [];

  for (const category of EXECUTIVE_QUEUE_CATEGORY_ORDER) {
    const objectIds = Object.freeze([...buckets[category]].sort(compareIds));
    if (policy === "hide" && objectIds.length === 0) continue;
    entries.push(
      Object.freeze({
        category,
        count: objectIds.length,
        objectIds,
        participatesInTopology: false as const,
        isSemanticObject: false as const,
        isCollectionControl: true as const,
      }),
    );
  }

  return Object.freeze(entries);
}

export function resolveExecutiveQueueEntryForCategory(input: {
  readonly subjects: readonly ExecutiveQueueEligibleSubjectInput[];
  readonly category: ExecutiveQueueCategory;
}): ExecutiveQueueEntry {
  const all = resolveExecutiveQueueEntries({
    subjects: input.subjects,
    zeroCountPolicy: "disable",
  });
  const found = all.find((entry) => entry.category === input.category);
  if (found != null) return found;
  return Object.freeze({
    category: input.category,
    count: 0,
    objectIds: Object.freeze([] as string[]),
    participatesInTopology: false as const,
    isSemanticObject: false as const,
    isCollectionControl: true as const,
  });
}

// ─── Collection ranking & disclosure ────────────────────────────────────────

function collectionRank(subject: ExecutiveQueueEligibleSubjectInput): number {
  const attention = normalizeToken(subject.attention);
  const status = normalizeToken(subject.status);
  let score = 0;
  if (attention === "critical") score += 500;
  else if (attention === "important") score += 300;
  else if (attention === "elevated") score += 200;
  if (subject.recommended === true) score += 350;
  if (status === "unresolved" || status === "risk") score += 280;
  else if (status === "watch") score += 160;
  else if (status === "active") score += 120;
  return score;
}

/**
 * Deterministic collection ranking for density budgets.
 * Full Queue count remains the eligible size; this selects the visible subset.
 */
export function rankExecutiveCollectionMembers(input: {
  readonly subjects: readonly ExecutiveQueueEligibleSubjectInput[];
  readonly objectIds: readonly string[];
  readonly maxVisible?: number;
  readonly priorityOrderedIds?: readonly string[] | null;
}): Readonly<{
  readonly visibleIds: readonly string[];
  readonly hiddenIds: readonly string[];
  readonly rankedIds: readonly string[];
  readonly totalCount: number;
}> {
  const byId = new Map(
    input.subjects.map((subject) => [subject.subjectId, subject]),
  );
  const priorityOrder = input.priorityOrderedIds ?? [];
  const ranked = [...input.objectIds]
    .filter((id) => byId.has(id))
    .sort((left, right) => {
      if (priorityOrder.length > 0) {
        const leftRank = priorityOrder.indexOf(left);
        const rightRank = priorityOrder.indexOf(right);
        if (leftRank !== -1 || rightRank !== -1) {
          if (leftRank === -1) return 1;
          if (rightRank === -1) return -1;
          return leftRank - rightRank;
        }
      }
      const leftSubject = byId.get(left)!;
      const rightSubject = byId.get(right)!;
      const delta = collectionRank(rightSubject) - collectionRank(leftSubject);
      if (delta !== 0) return delta;
      return compareIds(left, right);
    });
  const max = Math.max(
    EXECUTIVE_STAGE_COLLECTION_BUDGET.minVisible,
    Math.min(
      input.maxVisible ?? EXECUTIVE_STAGE_COLLECTION_BUDGET.maxVisible,
      EXECUTIVE_STAGE_COLLECTION_BUDGET.maxVisible,
    ),
  );
  return Object.freeze({
    rankedIds: Object.freeze(ranked),
    visibleIds: Object.freeze(ranked.slice(0, max)),
    hiddenIds: Object.freeze(ranked.slice(max)),
    totalCount: ranked.length,
  });
}

/**
 * Collection disclosure: members + Watch + Queue (no semantic center).
 * Collection membership wins over Watch for the same Object (no duplicates).
 */
export function resolveExecutiveCollectionDisclosure(input: {
  readonly subjects: readonly ExecutiveStageProductivitySubjectInput[];
  readonly relationships?: readonly ExecutiveFocusSceneRelationshipInput[];
  readonly collection: ExecutiveStageCollectionContext;
  readonly presentationDepth?: "minimum" | "report" | "operation";
  readonly watchBudgetMax?: number;
  readonly collectionBudgetMax?: number;
  readonly priorityOrderedIds?: readonly string[] | null;
}): ExecutiveStageDisclosureResult & {
  readonly collectionVisibleObjectIds: readonly string[];
  readonly collectionHiddenObjectIds: readonly string[];
  readonly collectionTotalCount: number;
  readonly activeQueueCategory: ExecutiveQueueCategory | "changes-since-visit";
} {
  const ranked = rankExecutiveCollectionMembers({
    subjects: input.subjects,
    objectIds: input.collection.objectIds,
    maxVisible: input.collectionBudgetMax,
    priorityOrderedIds: input.priorityOrderedIds,
  });

  const disclosure = resolveExecutiveStageDisclosure({
    subjects: input.subjects,
    relationships: input.relationships ?? [],
    presentationMode: "collection",
    presentationDepth: input.presentationDepth,
    collectionCategory: input.collection.category,
    collectionObjectIds: ranked.visibleIds,
    watchBudgetMax: input.watchBudgetMax,
  });

  return Object.freeze({
    ...disclosure,
    collectionVisibleObjectIds: disclosure.collectionObjectIds,
    collectionHiddenObjectIds: ranked.hiddenIds,
    collectionTotalCount: ranked.totalCount,
    activeQueueCategory: input.collection.category,
  });
}

// ─── Collection layout (no semantic center) ─────────────────────────────────

export type ExecutiveCollectionLayoutPosition = Readonly<{
  readonly x: number;
  readonly y: number;
  readonly z: 0;
}>;

/**
 * Compact executive arrangement in the main usable field.
 * No member receives (0,0) center authority before click.
 */
export function resolveExecutiveCollectionLayout(input: {
  readonly objectIds: readonly string[];
}): Readonly<{
  readonly positions: Readonly<
    Record<string, ExecutiveCollectionLayoutPosition>
  >;
  readonly layoutKind: "collection-grid";
}> {
  const ids = [...input.objectIds].sort(compareIds);
  const count = ids.length;
  const queue = EXECUTIVE_STAGE_PRODUCTIVITY_REGIONS.executiveQueue;
  const usableMaxX = Math.min(2.35, queue.minX - 0.35);
  const usableMinX = -2.4;
  const usableMinY = -1.05;
  const usableMaxY = 1.55;

  const columns = count <= 1 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4;
  const rows = Math.max(1, Math.ceil(count / columns));
  const width = usableMaxX - usableMinX;
  const height = usableMaxY - usableMinY;
  const cellW = width / columns;
  const cellH = height / rows;

  const positions: Record<string, ExecutiveCollectionLayoutPosition> = {};
  ids.forEach((objectId, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const x = stabilize(usableMinX + cellW * (col + 0.5));
    // Prefer upper-weighted rows for executive scan (header above).
    const y = stabilize(usableMaxY - cellH * (row + 0.55));
    positions[objectId] = Object.freeze({
      x,
      y,
      z: EXECUTIVE_STAGE_2D_DEPTH,
    }) as ExecutiveCollectionLayoutPosition;
  });

  // Ensure no position is exactly (0,0) — collection has no semantic center.
  for (const objectId of ids) {
    const pos = positions[objectId]!;
    if (Math.abs(pos.x) < 1e-4 && Math.abs(pos.y) < 1e-4) {
      positions[objectId] = Object.freeze({
        x: stabilize(0.55),
        y: stabilize(0.35),
        z: 0 as const,
      });
    }
    // Keep out of Queue hard region.
    if (pos.x >= queue.minX) {
      positions[objectId] = Object.freeze({
        ...pos,
        x: stabilize(queue.minX - 0.45),
      });
    }
  }

  return Object.freeze({
    positions: Object.freeze(positions),
    layoutKind: "collection-grid" as const,
  });
}

export function resolveExecutiveCollectionHeader(input: {
  readonly category: ExecutiveQueueCategory | "changes-since-visit";
  readonly totalCount: number;
  readonly visibleCount: number;
  readonly labelOverride?: string;
}): Readonly<{
  readonly label: string;
  readonly category: ExecutiveQueueCategory | "changes-since-visit";
  readonly totalCount: number;
  readonly visibleCount: number;
  readonly overflowCount: number;
  readonly overflowLabel: string | null;
  readonly isSemanticObject: false;
}> {
  const overflow = Math.max(0, input.totalCount - input.visibleCount);
  const baseLabel =
    input.labelOverride ??
    EXECUTIVE_QUEUE_CATEGORY_LABELS[input.category] ??
    String(input.category);
  return Object.freeze({
    label: `${baseLabel} · ${input.totalCount}`,
    category: input.category,
    totalCount: input.totalCount,
    visibleCount: input.visibleCount,
    overflowCount: overflow,
    overflowLabel: overflow > 0 ? `+${overflow}` : null,
    isSemanticObject: false as const,
  });
}

export function buildExecutiveQueueFoundationObservability(input: {
  readonly presentationMode: ExecutiveStagePresentationMode;
  readonly queue: readonly ExecutiveQueueEntry[];
  readonly collection?: ExecutiveStageCollectionContext | null;
  readonly collectionVisibleObjectIds?: readonly string[];
  readonly collectionHiddenObjectIds?: readonly string[];
  readonly collectionTotalCount?: number;
  readonly advisorPresentationContext?: string | null;
}): Readonly<{
  readonly contract: typeof executiveStageQueueFoundationIdentity;
  readonly stagePresentationMode: ExecutiveStagePresentationMode;
  readonly activeQueueCategory: ExecutiveQueueCategory | "changes-since-visit" | null;
  readonly collectionObjectIds: readonly string[];
  readonly collectionVisibleObjectIds: readonly string[];
  readonly collectionHiddenObjectIds: readonly string[];
  readonly collectionTotalCount: number;
  readonly queue: Readonly<Record<ExecutiveQueueCategory, number>>;
  readonly advisorPresentationContext: string | null;
  readonly navigationContextKind: ExecutiveStageNavigationContextKind;
}> {
  const queueCounts = Object.freeze({
    problem: input.queue.find((e) => e.category === "problem")?.count ?? 0,
    risk: input.queue.find((e) => e.category === "risk")?.count ?? 0,
    opportunity: input.queue.find((e) => e.category === "opportunity")?.count ?? 0,
    scenario: input.queue.find((e) => e.category === "scenario")?.count ?? 0,
    decision: input.queue.find((e) => e.category === "decision")?.count ?? 0,
    execution: input.queue.find((e) => e.category === "execution")?.count ?? 0,
    goal: input.queue.find((e) => e.category === "goal")?.count ?? 0,
  });
  return Object.freeze({
    contract: executiveStageQueueFoundationIdentity,
    stagePresentationMode: input.presentationMode,
    activeQueueCategory: input.collection?.category ?? null,
    collectionObjectIds: Object.freeze([...(input.collection?.objectIds ?? [])]),
    collectionVisibleObjectIds: Object.freeze([
      ...(input.collectionVisibleObjectIds ?? []),
    ]),
    collectionHiddenObjectIds: Object.freeze([
      ...(input.collectionHiddenObjectIds ?? []),
    ]),
    collectionTotalCount: input.collectionTotalCount ?? 0,
    queue: queueCounts,
    advisorPresentationContext: input.advisorPresentationContext ?? null,
    navigationContextKind:
      input.presentationMode === "collection"
        ? ("collection" as const)
        : input.presentationMode === "overview"
          ? ("overview" as const)
          : ("object-focus" as const),
  });
}

export function verifyExecutiveStageQueueFoundation(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly queueNonSemantic: boolean;
  readonly zeroCountPolicyValid: boolean;
}> {
  const identity = getExecutiveStageQueueFoundationIdentity();
  const identityValid =
    identity.id === executiveStageQueueFoundationIdentity &&
    identity.version === executiveStageQueueFoundationVersion;

  const boundaryValid =
    EXECUTIVE_STAGE_QUEUE_FOUNDATION_BOUNDARY.queueEntriesAreSemanticObjects ===
      false &&
    EXECUTIVE_STAGE_QUEUE_FOUNDATION_BOUNDARY.autoSelectsCollectionMember ===
      false &&
    EXECUTIVE_STAGE_QUEUE_FOUNDATION_BOUNDARY.movesCamera === false;

  const queue = resolveExecutiveQueueEntries({
    subjects: [
      Object.freeze({
        subjectId: "ctx-problem-a",
        workKind: "problem",
      }),
      Object.freeze({
        subjectId: "ctx-archived",
        workKind: "problem",
        archived: true,
      }),
      Object.freeze({
        subjectId: "obj-capacity",
        objectKind: "object",
      }),
    ],
  });
  const problems = queue.find((entry) => entry.category === "problem");
  const queueNonSemantic =
    problems?.isSemanticObject === false &&
    problems?.count === 1 &&
    !queue.some((entry) => entry.objectIds.includes("obj-capacity"));

  const zeroCountPolicyValid = EXECUTIVE_QUEUE_ZERO_COUNT_POLICY === "hide";

  const ok =
    options?.forceFailure === true
      ? false
      : identityValid &&
        boundaryValid &&
        queueNonSemantic &&
        zeroCountPolicyValid;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    queueNonSemantic,
    zeroCountPolicyValid,
  });
}

/** Re-export normalize for layout consumers. */
export function normalizeCollectionLayoutPosition(input: {
  readonly x: number;
  readonly y: number;
}): ExecutiveCollectionLayoutPosition {
  return normalizeExecutiveStage2DPosition({
    x: input.x,
    y: input.y,
    z: 0,
  }) as ExecutiveCollectionLayoutPosition;
}
