/**
 * STAGE-PROD:2 — Executive Change Intelligence / What Changed?
 *
 * Compares a trusted previous executive snapshot with current executive
 * reality. Detects meaningful executive meaning transitions — not telemetry
 * noise. Presents through Executive Queue as a productivity collection.
 *
 * Builds on STAGE-PROD:0 / STAGE-PROD:1. Does not reopen camera, topology,
 * Data Reality engines, NBA, Decision Brief, or AI explanations.
 *
 * Change Records are presentation metadata — never semantic Stage Objects.
 *
 * Persistence: session/runtime-only baseline store. UI wording must remain
 * truthful ("Recent Changes") — not "Since Last Visit" across browser sessions.
 */

import { NEXORA_EXECUTIVE_STATE_SEVERITY } from "../data-reality/executiveStateResolution.ts";
import {
  EXECUTIVE_QUEUE_ZERO_COUNT_POLICY,
  EXECUTIVE_STAGE_COLLECTION_BUDGET,
  rankExecutiveCollectionMembers,
} from "./executiveStageQueueFoundation.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStageChangeIntelligenceIdentity =
  "STAGE-PROD:2/ExecutiveStageChangeIntelligence" as const;

export const executiveStageChangeIntelligenceVersion = "1.0.0" as const;

export const executiveStageChangeIntelligenceNamespace =
  "nexora.spatial-presentation.executive-stage-change-intelligence" as const;

export const executiveStageChangeIntelligencePhase =
  "ExecutiveChangeIntelligenceWhatChanged" as const;

export const executiveStageChangeIntelligenceArchitecturalRole =
  "PresentationOnlyExecutiveChangeComparisonAuthority" as const;

export type ExecutiveStageChangeIntelligenceIdentity = {
  readonly id: typeof executiveStageChangeIntelligenceIdentity;
  readonly version: typeof executiveStageChangeIntelligenceVersion;
  readonly namespace: typeof executiveStageChangeIntelligenceNamespace;
  readonly phase: typeof executiveStageChangeIntelligencePhase;
  readonly architecturalRole: typeof executiveStageChangeIntelligenceArchitecturalRole;
};

const IDENTITY: ExecutiveStageChangeIntelligenceIdentity = Object.freeze({
  id: executiveStageChangeIntelligenceIdentity,
  version: executiveStageChangeIntelligenceVersion,
  namespace: executiveStageChangeIntelligenceNamespace,
  phase: executiveStageChangeIntelligencePhase,
  architecturalRole: executiveStageChangeIntelligenceArchitecturalRole,
});

export function getExecutiveStageChangeIntelligenceIdentity(): ExecutiveStageChangeIntelligenceIdentity {
  return IDENTITY;
}

export const EXECUTIVE_STAGE_CHANGE_INTELLIGENCE_BOUNDARY = Object.freeze({
  architecturalRole: executiveStageChangeIntelligenceArchitecturalRole,
  changeRecordsAreSemanticObjects: false as const,
  inventsCausality: false as const,
  inventsRecommendations: false as const,
  implementsNextBestAction: false as const,
  implementsAiExplanations: false as const,
  replacesDataReality: false as const,
  replacesKpiEngine: false as const,
  movesCamera: false as const,
  changesSemanticZ: false as const,
  autoSelectsChangedObject: false as const,
  /** Session store only — not cross-browser-visit persistence. */
  persistenceLevel: "session" as const,
  presentationOnly: true as const,
});

/** Truthful Queue label for session-only baseline. */
export const EXECUTIVE_CHANGE_QUEUE_LABEL = "Recent Changes" as const;

export const EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY =
  "changes-since-visit" as const;

export type ExecutiveChangeProductivityCategory =
  typeof EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY;

// ─── Snapshot contracts ─────────────────────────────────────────────────────

export type ExecutiveChangeMetricState = {
  readonly metricId: string;
  readonly band?: string | null;
  readonly executiveState?: string | null;
  /** Raw value optional — noise suppressed when band/state unchanged. */
  readonly value?: number | null;
  readonly available?: boolean;
};

export type ExecutiveChangeObjectSnapshot = {
  readonly objectId: string;
  readonly objectKind: string;
  readonly label?: string;
  readonly executiveState?: string | null;
  readonly attentionState?: string | null;
  readonly lifecycleState?: string | null;
  readonly decisionStatus?: string | null;
  readonly executionStatus?: string | null;
  readonly unresolved?: boolean | null;
  readonly recommended?: boolean | null;
  readonly metricState?: readonly ExecutiveChangeMetricState[];
  readonly archived?: boolean;
  readonly eligible?: boolean;
};

export type ExecutiveChangeSnapshot = {
  readonly snapshotId: string;
  readonly scopeKey: string;
  readonly capturedAt: string;
  readonly objects: readonly ExecutiveChangeObjectSnapshot[];
};

export type ExecutiveChangeKind =
  | "new"
  | "resolved"
  | "improved"
  | "deteriorated"
  | "state-changed"
  | "decision-changed"
  | "execution-changed";

export type ExecutiveChangeRecord = {
  readonly objectId: string;
  readonly objectKind: string;
  readonly changeKind: ExecutiveChangeKind;
  readonly previousValue?: string | number | boolean | null;
  readonly currentValue?: string | number | boolean | null;
  readonly importance: number;
  readonly reason: string;
  readonly annotation: string;
  readonly supportingReasons: readonly string[];
  readonly isSemanticObject: false;
};

export type ExecutiveChangeBaselineStatus =
  | "available"
  | "baseline-established"
  | "scope-mismatch";

export type ExecutiveChangeComparisonResult = {
  readonly baselineStatus: ExecutiveChangeBaselineStatus;
  readonly changes: readonly ExecutiveChangeRecord[];
  readonly changedObjectIds: readonly string[];
  readonly previousSnapshotId: string | null;
  readonly currentSnapshotId: string;
  readonly scopeKey: string;
  readonly countsByKind: Readonly<Record<ExecutiveChangeKind, number>>;
};

export type ExecutiveChangeQueueEntry = {
  readonly collectionKind: "productivity";
  readonly category: ExecutiveChangeProductivityCategory;
  readonly label: typeof EXECUTIVE_CHANGE_QUEUE_LABEL;
  readonly count: number;
  readonly objectIds: readonly string[];
  readonly isSemanticObject: false;
  readonly isCollectionControl: true;
  readonly participatesInTopology: false;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function normalizeToken(value: string | null | undefined): string {
  return (value ?? "").toLowerCase().trim();
}

function freezeCounts(
  records: readonly ExecutiveChangeRecord[],
): Readonly<Record<ExecutiveChangeKind, number>> {
  const counts: Record<ExecutiveChangeKind, number> = {
    new: 0,
    resolved: 0,
    improved: 0,
    deteriorated: 0,
    "state-changed": 0,
    "decision-changed": 0,
    "execution-changed": 0,
  };
  for (const record of records) {
    counts[record.changeKind] += 1;
  }
  return Object.freeze(counts);
}

let snapshotSeq = 0;

function hashComparisonSurface(
  objects: readonly ExecutiveChangeObjectSnapshot[],
): string {
  const payload = objects
    .map((entry) =>
      [
        entry.objectId,
        entry.objectKind,
        entry.executiveState ?? "",
        entry.attentionState ?? "",
        entry.lifecycleState ?? "",
        entry.decisionStatus ?? "",
        entry.executionStatus ?? "",
        entry.unresolved === true ? "1" : entry.unresolved === false ? "0" : "",
        entry.recommended === true ? "1" : "",
        (entry.metricState ?? [])
          .map(
            (metric) =>
              `${metric.metricId}:${metric.band ?? ""}:${metric.executiveState ?? ""}:${metric.available === false ? "0" : "1"}`,
          )
          .join(","),
      ].join("|"),
    )
    .join(";");
  let hash = 0;
  for (let i = 0; i < payload.length; i += 1) {
    hash = (hash * 31 + payload.charCodeAt(i)) >>> 0;
  }
  return hash.toString(16);
}

export function buildExecutiveChangeScopeKey(input: {
  readonly workspace: string;
  readonly modelId?: string | null;
}): string {
  return `${input.workspace}::${input.modelId ?? "default"}`;
}

/**
 * Build a lightweight comparison snapshot from current executive truth.
 * Does not serialize full runtime — comparison surface only.
 * Snapshot IDs are deterministic for identical comparison surfaces.
 */
export function buildExecutiveChangeSnapshot(input: {
  readonly scopeKey: string;
  readonly capturedAt?: string;
  readonly objects: readonly ExecutiveChangeObjectSnapshot[];
  readonly snapshotId?: string;
}): ExecutiveChangeSnapshot {
  snapshotSeq += 1;
  const objects = Object.freeze(
    [...input.objects]
      .filter((entry) => entry.eligible !== false && entry.archived !== true)
      .sort((a, b) => compareIds(a.objectId, b.objectId))
      .map((entry) => Object.freeze({ ...entry })),
  );
  const surfaceHash = hashComparisonSurface(objects);
  return Object.freeze({
    snapshotId:
      input.snapshotId ??
      `exec-change-snap:${input.scopeKey}:${surfaceHash}`,
    scopeKey: input.scopeKey,
    capturedAt: input.capturedAt ?? new Date(0).toISOString(),
    objects,
  });
}

// ─── Severity / direction (reuse canonical ranks) ───────────────────────────

const ATTENTION_RANK: Readonly<Record<string, number>> = Object.freeze({
  critical: 4,
  important: 3,
  elevated: 2,
  normal: 1,
});

function executiveStateRank(state: string | null | undefined): number | null {
  const token = normalizeToken(state);
  if (token === "critical") return NEXORA_EXECUTIVE_STATE_SEVERITY.critical;
  if (token === "attention" || token === "watch") {
    return NEXORA_EXECUTIVE_STATE_SEVERITY.attention;
  }
  if (token === "normal" || token === "stable") {
    return NEXORA_EXECUTIVE_STATE_SEVERITY.normal;
  }
  return null;
}

function attentionRank(state: string | null | undefined): number {
  return ATTENTION_RANK[normalizeToken(state)] ?? 0;
}

function isResolvedStatus(value: string | null | undefined): boolean {
  const token = normalizeToken(value);
  return (
    token === "resolved" ||
    token === "closed" ||
    token === "completed" ||
    token === "done"
  );
}

function isUnresolvedFlag(
  object: ExecutiveChangeObjectSnapshot,
): boolean {
  if (object.unresolved === true) return true;
  if (object.unresolved === false) return false;
  const lifecycle = normalizeToken(object.lifecycleState);
  const status = normalizeToken(
    object.decisionStatus ?? object.executionStatus ?? lifecycle,
  );
  return (
    status === "unresolved" ||
    status === "risk" ||
    status === "blocked" ||
    status === "delayed"
  );
}

function annotationFor(
  kind: ExecutiveChangeKind,
  previous: string | null | undefined,
  current: string | null | undefined,
): string {
  switch (kind) {
    case "new":
      return "New";
    case "resolved":
      return "Resolved";
    case "improved":
      return "Improved";
    case "deteriorated":
      return previous && current
        ? `${formatLabel(previous)} → ${formatLabel(current)}`
        : "Deteriorated";
    case "decision-changed":
      return previous && current
        ? `${formatLabel(previous)} → ${formatLabel(current)}`
        : "Decision changed";
    case "execution-changed":
      return previous && current
        ? `${formatLabel(previous)} → ${formatLabel(current)}`
        : "Execution changed";
    case "state-changed":
    default:
      return previous && current
        ? `${formatLabel(previous)} → ${formatLabel(current)}`
        : "State changed";
  }
}

function formatLabel(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function deterioratedAnnotation(
  previous: string | null | undefined,
  current: string | null | undefined,
): string {
  const curr = normalizeToken(current);
  if (curr === "critical") return "Became Critical";
  if (curr === "attention" || curr === "watch") return "Deteriorated";
  return annotationFor("deteriorated", previous, current);
}

// ─── Primary change selection ───────────────────────────────────────────────

const PRIMARY_KIND_PRIORITY: Readonly<Record<ExecutiveChangeKind, number>> =
  Object.freeze({
    deteriorated: 700,
    "decision-changed": 600,
    "execution-changed": 550,
    new: 500,
    resolved: 400,
    improved: 300,
    "state-changed": 200,
  });

function pickPrimary(
  candidates: readonly ExecutiveChangeRecord[],
): ExecutiveChangeRecord {
  const sorted = [...candidates].sort((left, right) => {
    const kindDelta =
      PRIMARY_KIND_PRIORITY[right.changeKind] -
      PRIMARY_KIND_PRIORITY[left.changeKind];
    if (kindDelta !== 0) return kindDelta;
    if (right.importance !== left.importance) {
      return right.importance - left.importance;
    }
    return compareIds(left.reason, right.reason);
  });
  const primary = sorted[0]!;
  const supporting = sorted.slice(1).map((entry) => entry.reason);
  return Object.freeze({
    ...primary,
    supportingReasons: Object.freeze([
      ...primary.supportingReasons,
      ...supporting,
    ]),
  });
}

// ─── Per-object comparison ──────────────────────────────────────────────────

function compareObjectPair(
  previous: ExecutiveChangeObjectSnapshot | null,
  current: ExecutiveChangeObjectSnapshot | null,
): ExecutiveChangeRecord[] {
  const records: ExecutiveChangeRecord[] = [];

  if (previous == null && current != null) {
    records.push(
      Object.freeze({
        objectId: current.objectId,
        objectKind: current.objectKind,
        changeKind: "new" as const,
        previousValue: null,
        currentValue: current.executiveState ?? current.attentionState ?? true,
        importance: 500 + attentionRank(current.attentionState) * 40,
        reason: "Object newly present in executive scope",
        annotation: "New",
        supportingReasons: Object.freeze([] as string[]),
        isSemanticObject: false as const,
      }),
    );
    return records;
  }

  if (previous != null && current == null) {
    // Disappearance alone is NOT resolution — omit unless canonical resolved.
    return records;
  }

  if (previous == null || current == null) return records;

  // Resolution (canonical unresolved → resolved)
  const wasUnresolved = isUnresolvedFlag(previous);
  const nowResolved =
    current.unresolved === false ||
    isResolvedStatus(current.lifecycleState) ||
    isResolvedStatus(current.decisionStatus) ||
    isResolvedStatus(current.executionStatus);
  if (wasUnresolved && nowResolved) {
    records.push(
      Object.freeze({
        objectId: current.objectId,
        objectKind: current.objectKind,
        changeKind: "resolved" as const,
        previousValue: previous.lifecycleState ?? previous.unresolved ?? "unresolved",
        currentValue: current.lifecycleState ?? "resolved",
        importance: 420,
        reason: "Unresolved state became resolved",
        annotation: "Resolved",
        supportingReasons: Object.freeze([] as string[]),
        isSemanticObject: false as const,
      }),
    );
  }

  // Executive state direction
  const prevExec = normalizeToken(previous.executiveState);
  const currExec = normalizeToken(current.executiveState);
  if (prevExec.length > 0 && currExec.length > 0 && prevExec !== currExec) {
    const prevRank = executiveStateRank(prevExec);
    const currRank = executiveStateRank(currExec);
    if (prevRank != null && currRank != null && currRank > prevRank) {
      records.push(
        Object.freeze({
          objectId: current.objectId,
          objectKind: current.objectKind,
          changeKind: "deteriorated" as const,
          previousValue: previous.executiveState,
          currentValue: current.executiveState,
          importance: 700 + currRank * 50,
          reason: `Executive state ${prevExec} → ${currExec}`,
          annotation: deterioratedAnnotation(
            previous.executiveState,
            current.executiveState,
          ),
          supportingReasons: Object.freeze([] as string[]),
          isSemanticObject: false as const,
        }),
      );
    } else if (prevRank != null && currRank != null && currRank < prevRank) {
      records.push(
        Object.freeze({
          objectId: current.objectId,
          objectKind: current.objectKind,
          changeKind: "improved" as const,
          previousValue: previous.executiveState,
          currentValue: current.executiveState,
          importance: 320 + (4 - currRank) * 20,
          reason: `Executive state ${prevExec} → ${currExec}`,
          annotation: "Improved",
          supportingReasons: Object.freeze([] as string[]),
          isSemanticObject: false as const,
        }),
      );
    } else if (prevRank == null || currRank == null) {
      records.push(
        Object.freeze({
          objectId: current.objectId,
          objectKind: current.objectKind,
          changeKind: "state-changed" as const,
          previousValue: previous.executiveState,
          currentValue: current.executiveState,
          importance: 250,
          reason: `Executive state ${prevExec} → ${currExec}`,
          annotation: annotationFor(
            "state-changed",
            previous.executiveState ?? undefined,
            current.executiveState ?? undefined,
          ),
          supportingReasons: Object.freeze([] as string[]),
          isSemanticObject: false as const,
        }),
      );
    }
  }

  // Attention material change (with directional severity when ranks known)
  const prevAtt = normalizeToken(previous.attentionState);
  const currAtt = normalizeToken(current.attentionState);
  if (prevAtt.length > 0 && currAtt.length > 0 && prevAtt !== currAtt) {
    const prevR = attentionRank(prevAtt);
    const currR = attentionRank(currAtt);
    if (currR > prevR) {
      records.push(
        Object.freeze({
          objectId: current.objectId,
          objectKind: current.objectKind,
          changeKind: "deteriorated" as const,
          previousValue: previous.attentionState,
          currentValue: current.attentionState,
          importance: 650 + currR * 30,
          reason: `Attention ${prevAtt} → ${currAtt}`,
          annotation: deterioratedAnnotation(
            previous.attentionState,
            current.attentionState,
          ),
          supportingReasons: Object.freeze([] as string[]),
          isSemanticObject: false as const,
        }),
      );
    } else if (currR < prevR && currR > 0) {
      records.push(
        Object.freeze({
          objectId: current.objectId,
          objectKind: current.objectKind,
          changeKind: "improved" as const,
          previousValue: previous.attentionState,
          currentValue: current.attentionState,
          importance: 300 + (5 - currR) * 15,
          reason: `Attention ${prevAtt} → ${currAtt}`,
          annotation: "Improved",
          supportingReasons: Object.freeze([] as string[]),
          isSemanticObject: false as const,
        }),
      );
    } else if (prevR === 0 || currR === 0) {
      records.push(
        Object.freeze({
          objectId: current.objectId,
          objectKind: current.objectKind,
          changeKind: "state-changed" as const,
          previousValue: previous.attentionState,
          currentValue: current.attentionState,
          importance: 220,
          reason: `Attention ${prevAtt} → ${currAtt}`,
          annotation: annotationFor(
            "state-changed",
            previous.attentionState ?? undefined,
            current.attentionState ?? undefined,
          ),
          supportingReasons: Object.freeze([] as string[]),
          isSemanticObject: false as const,
        }),
      );
    }
  }

  // Decision status
  const prevDec = normalizeToken(previous.decisionStatus);
  const currDec = normalizeToken(current.decisionStatus);
  if (
    (prevDec.length > 0 || currDec.length > 0) &&
    prevDec !== currDec &&
    (normalizeToken(current.objectKind) === "decision" ||
      prevDec.length > 0 ||
      currDec.length > 0)
  ) {
    if (prevDec.length > 0 && currDec.length > 0) {
      records.push(
        Object.freeze({
          objectId: current.objectId,
          objectKind: current.objectKind,
          changeKind: "decision-changed" as const,
          previousValue: previous.decisionStatus,
          currentValue: current.decisionStatus,
          importance: 580,
          reason: `Decision status ${prevDec} → ${currDec}`,
          annotation: annotationFor(
            "decision-changed",
            previous.decisionStatus ?? undefined,
            current.decisionStatus ?? undefined,
          ),
          supportingReasons: Object.freeze([] as string[]),
          isSemanticObject: false as const,
        }),
      );
    }
  }

  // Execution status
  const prevExecStatus = normalizeToken(previous.executionStatus);
  const currExecStatus = normalizeToken(current.executionStatus);
  if (
    prevExecStatus.length > 0 &&
    currExecStatus.length > 0 &&
    prevExecStatus !== currExecStatus
  ) {
    const blockedLike =
      currExecStatus === "delayed" ||
      currExecStatus === "blocked" ||
      currExecStatus === "at-risk";
    records.push(
      Object.freeze({
        objectId: current.objectId,
        objectKind: current.objectKind,
        changeKind: "execution-changed" as const,
        previousValue: previous.executionStatus,
        currentValue: current.executionStatus,
        importance: blockedLike ? 620 : 540,
        reason: `Execution status ${prevExecStatus} → ${currExecStatus}`,
        annotation:
          currExecStatus === "delayed"
            ? "Delayed"
            : currExecStatus === "blocked"
              ? "Blocked"
              : annotationFor(
                  "execution-changed",
                  previous.executionStatus ?? undefined,
                  current.executionStatus ?? undefined,
                ),
        supportingReasons: Object.freeze([] as string[]),
        isSemanticObject: false as const,
      }),
    );
  }

  // Metric band / executive-state transitions only (noise suppression)
  const prevMetrics = new Map(
    (previous.metricState ?? []).map((metric) => [metric.metricId, metric]),
  );
  for (const metric of current.metricState ?? []) {
    const prior = prevMetrics.get(metric.metricId);
    if (prior == null) continue;
    const prevBand = normalizeToken(prior.band);
    const currBand = normalizeToken(metric.band);
    const prevMetricState = normalizeToken(prior.executiveState);
    const currMetricState = normalizeToken(metric.executiveState);

    // Missing data alone ≠ deterioration
    if (prior.available === true && metric.available === false) {
      continue;
    }

    if (
      prevBand.length > 0 &&
      currBand.length > 0 &&
      prevBand !== currBand
    ) {
      const prevR = executiveStateRank(prevMetricState || prevBand);
      const currR = executiveStateRank(currMetricState || currBand);
      if (prevR != null && currR != null && currR > prevR) {
        records.push(
          Object.freeze({
            objectId: current.objectId,
            objectKind: current.objectKind,
            changeKind: "deteriorated" as const,
            previousValue: prior.band,
            currentValue: metric.band,
            importance: 640,
            reason: `Metric band ${prevBand} → ${currBand}`,
            annotation: "Deteriorated",
            supportingReasons: Object.freeze([] as string[]),
            isSemanticObject: false as const,
          }),
        );
      } else if (prevR != null && currR != null && currR < prevR) {
        records.push(
          Object.freeze({
            objectId: current.objectId,
            objectKind: current.objectKind,
            changeKind: "improved" as const,
            previousValue: prior.band,
            currentValue: metric.band,
            importance: 310,
            reason: `Metric band ${prevBand} → ${currBand}`,
            annotation: "Improved",
            supportingReasons: Object.freeze([] as string[]),
            isSemanticObject: false as const,
          }),
        );
      } else {
        records.push(
          Object.freeze({
            objectId: current.objectId,
            objectKind: current.objectKind,
            changeKind: "state-changed" as const,
            previousValue: prior.band,
            currentValue: metric.band,
            importance: 240,
            reason: `Metric band ${prevBand} → ${currBand}`,
            annotation: annotationFor(
              "state-changed",
              prior.band ?? undefined,
              metric.band ?? undefined,
            ),
            supportingReasons: Object.freeze([] as string[]),
            isSemanticObject: false as const,
          }),
        );
      }
    }
    // Same band + same state + tiny value drift → no record (noise suppression)
  }

  // Lifecycle state-changed when not already covered
  const prevLife = normalizeToken(previous.lifecycleState);
  const currLife = normalizeToken(current.lifecycleState);
  if (
    prevLife.length > 0 &&
    currLife.length > 0 &&
    prevLife !== currLife &&
    !isResolvedStatus(currLife) &&
    records.length === 0
  ) {
    records.push(
      Object.freeze({
        objectId: current.objectId,
        objectKind: current.objectKind,
        changeKind: "state-changed" as const,
        previousValue: previous.lifecycleState,
        currentValue: current.lifecycleState,
        importance: 230,
        reason: `Lifecycle ${prevLife} → ${currLife}`,
        annotation: annotationFor(
          "state-changed",
          previous.lifecycleState ?? undefined,
          current.lifecycleState ?? undefined,
        ),
        supportingReasons: Object.freeze([] as string[]),
        isSemanticObject: false as const,
      }),
    );
  }

  return records;
}

/**
 * Pure authoritative meaningful-change comparison.
 * No UI, Stage positions, or Advisor prose.
 */
export function resolveExecutiveMeaningfulChanges(input: {
  readonly previousSnapshot: ExecutiveChangeSnapshot | null;
  readonly currentSnapshot: ExecutiveChangeSnapshot;
}): ExecutiveChangeComparisonResult {
  const current = input.currentSnapshot;

  if (input.previousSnapshot == null) {
    return Object.freeze({
      baselineStatus: "baseline-established" as const,
      changes: Object.freeze([] as ExecutiveChangeRecord[]),
      changedObjectIds: Object.freeze([] as string[]),
      previousSnapshotId: null,
      currentSnapshotId: current.snapshotId,
      scopeKey: current.scopeKey,
      countsByKind: freezeCounts([]),
    });
  }

  const previous = input.previousSnapshot;
  if (previous.scopeKey !== current.scopeKey) {
    return Object.freeze({
      baselineStatus: "scope-mismatch" as const,
      changes: Object.freeze([] as ExecutiveChangeRecord[]),
      changedObjectIds: Object.freeze([] as string[]),
      previousSnapshotId: previous.snapshotId,
      currentSnapshotId: current.snapshotId,
      scopeKey: current.scopeKey,
      countsByKind: freezeCounts([]),
    });
  }

  const previousById = new Map(
    previous.objects.map((entry) => [entry.objectId, entry]),
  );
  const currentById = new Map(
    current.objects.map((entry) => [entry.objectId, entry]),
  );
  const allIds = [
    ...new Set([...previousById.keys(), ...currentById.keys()]),
  ].sort(compareIds);

  const consolidated: ExecutiveChangeRecord[] = [];
  for (const objectId of allIds) {
    const candidates = compareObjectPair(
      previousById.get(objectId) ?? null,
      currentById.get(objectId) ?? null,
    );
    if (candidates.length === 0) continue;
    consolidated.push(pickPrimary(candidates));
  }

  const ranked = [...consolidated].sort((left, right) => {
    if (right.importance !== left.importance) {
      return right.importance - left.importance;
    }
    const kindDelta =
      PRIMARY_KIND_PRIORITY[right.changeKind] -
      PRIMARY_KIND_PRIORITY[left.changeKind];
    if (kindDelta !== 0) return kindDelta;
    return compareIds(left.objectId, right.objectId);
  });

  return Object.freeze({
    baselineStatus: "available" as const,
    changes: Object.freeze(ranked),
    changedObjectIds: Object.freeze(ranked.map((entry) => entry.objectId)),
    previousSnapshotId: previous.snapshotId,
    currentSnapshotId: current.snapshotId,
    scopeKey: current.scopeKey,
    countsByKind: freezeCounts(ranked),
  });
}

/** Queue productivity entry — unique changed semantic Objects. */
export function resolveExecutiveChangeQueueEntry(
  comparison: ExecutiveChangeComparisonResult,
): ExecutiveChangeQueueEntry | null {
  if (comparison.baselineStatus !== "available") return null;
  if (
    EXECUTIVE_QUEUE_ZERO_COUNT_POLICY === "hide" &&
    comparison.changedObjectIds.length === 0
  ) {
    return null;
  }
  return Object.freeze({
    collectionKind: "productivity" as const,
    category: EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY,
    label: EXECUTIVE_CHANGE_QUEUE_LABEL,
    count: comparison.changedObjectIds.length,
    objectIds: comparison.changedObjectIds,
    isSemanticObject: false as const,
    isCollectionControl: true as const,
    participatesInTopology: false as const,
  });
}

export function rankExecutiveChangeCollectionMembers(input: {
  readonly changes: readonly ExecutiveChangeRecord[];
  readonly maxVisible?: number;
}): Readonly<{
  readonly visibleIds: readonly string[];
  readonly hiddenIds: readonly string[];
  readonly totalCount: number;
  readonly visibleChanges: readonly ExecutiveChangeRecord[];
}> {
  const byId = new Map(input.changes.map((change) => [change.objectId, change]));
  const ranked = rankExecutiveCollectionMembers({
    subjects: input.changes.map((change) =>
      Object.freeze({
        subjectId: change.objectId,
        objectKind: change.objectKind,
        attention:
          change.changeKind === "deteriorated"
            ? "critical"
            : change.importance >= 580
              ? "important"
              : "elevated",
        status:
          change.changeKind === "resolved"
            ? "stable"
            : change.changeKind === "deteriorated"
              ? "risk"
              : "watch",
        recommended: change.changeKind === "decision-changed",
      }),
    ),
    objectIds: input.changes.map((change) => change.objectId),
    maxVisible: input.maxVisible ?? EXECUTIVE_STAGE_COLLECTION_BUDGET.maxVisible,
  });

  // Preserve change-importance order within the budget window.
  const importanceOrdered = [...input.changes]
    .sort((left, right) => {
      if (right.importance !== left.importance) {
        return right.importance - left.importance;
      }
      return compareIds(left.objectId, right.objectId);
    })
    .map((change) => change.objectId);
  const max =
    input.maxVisible ?? EXECUTIVE_STAGE_COLLECTION_BUDGET.maxVisible;
  const visibleIds = Object.freeze(importanceOrdered.slice(0, max));
  const hiddenIds = Object.freeze(importanceOrdered.slice(max));
  return Object.freeze({
    visibleIds,
    hiddenIds,
    totalCount: importanceOrdered.length,
    visibleChanges: Object.freeze(
      visibleIds
        .map((id) => byId.get(id))
        .filter((entry): entry is ExecutiveChangeRecord => entry != null),
    ),
  });
}

export function resolveExecutiveChangeCollectionHeader(input: {
  readonly totalCount: number;
  readonly visibleCount: number;
}): Readonly<{
  readonly label: string;
  readonly category: ExecutiveChangeProductivityCategory;
  readonly totalCount: number;
  readonly visibleCount: number;
  readonly overflowCount: number;
  readonly overflowLabel: string | null;
  readonly isSemanticObject: false;
}> {
  const overflow = Math.max(0, input.totalCount - input.visibleCount);
  return Object.freeze({
    label: `${EXECUTIVE_CHANGE_QUEUE_LABEL} · ${input.totalCount}`,
    category: EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY,
    totalCount: input.totalCount,
    visibleCount: input.visibleCount,
    overflowCount: overflow,
    overflowLabel: overflow > 0 ? `+${overflow}` : null,
    isSemanticObject: false as const,
  });
}

// ─── Session baseline store (immutable during inspection) ───────────────────

export type ExecutiveChangeBaselineStore = {
  readonly acknowledgedByScope: Readonly<
    Record<string, ExecutiveChangeSnapshot>
  >;
  /** Frozen comparison baseline for an open inspection session. */
  readonly activeInspection: Readonly<{
    readonly scopeKey: string;
    readonly previousSnapshot: ExecutiveChangeSnapshot;
    readonly comparison: ExecutiveChangeComparisonResult;
  }> | null;
};

function emptyStore(): ExecutiveChangeBaselineStore {
  return Object.freeze({
    acknowledgedByScope: Object.freeze({}),
    activeInspection: null,
  });
}

let sessionStore: ExecutiveChangeBaselineStore = emptyStore();

export function resetExecutiveChangeBaselineStoreForTests(): void {
  sessionStore = emptyStore();
  snapshotSeq = 0;
}

export function getExecutiveChangeBaselineStore(): ExecutiveChangeBaselineStore {
  return sessionStore;
}

export function getAcknowledgedExecutiveChangeBaseline(
  scopeKey: string,
): ExecutiveChangeSnapshot | null {
  return sessionStore.acknowledgedByScope[scopeKey] ?? null;
}

/**
 * First visit / no baseline: establish baseline, report zero changes.
 * Does not invent NEW for all existing objects.
 */
export function ensureExecutiveChangeBaseline(input: {
  readonly currentSnapshot: ExecutiveChangeSnapshot;
}): ExecutiveChangeComparisonResult {
  const existing = getAcknowledgedExecutiveChangeBaseline(
    input.currentSnapshot.scopeKey,
  );
  if (existing != null) {
    return resolveExecutiveMeaningfulChanges({
      previousSnapshot: existing,
      currentSnapshot: input.currentSnapshot,
    });
  }
  sessionStore = Object.freeze({
    ...sessionStore,
    acknowledgedByScope: Object.freeze({
      ...sessionStore.acknowledgedByScope,
      [input.currentSnapshot.scopeKey]: input.currentSnapshot,
    }),
  });
  return resolveExecutiveMeaningfulChanges({
    previousSnapshot: null,
    currentSnapshot: input.currentSnapshot,
  });
}

/**
 * Open / refresh Change Collection against an immutable inspection baseline.
 * Does NOT advance the acknowledged baseline.
 */
export function beginExecutiveChangeInspection(input: {
  readonly currentSnapshot: ExecutiveChangeSnapshot;
}): ExecutiveChangeComparisonResult {
  const previous = getAcknowledgedExecutiveChangeBaseline(
    input.currentSnapshot.scopeKey,
  );
  const comparison = resolveExecutiveMeaningfulChanges({
    previousSnapshot: previous,
    currentSnapshot: input.currentSnapshot,
  });
  if (comparison.baselineStatus === "available" && previous != null) {
    sessionStore = Object.freeze({
      ...sessionStore,
      activeInspection: Object.freeze({
        scopeKey: input.currentSnapshot.scopeKey,
        previousSnapshot: previous,
        comparison,
      }),
    });
  }
  return comparison;
}

export function getActiveExecutiveChangeInspection(): ExecutiveChangeBaselineStore["activeInspection"] {
  return sessionStore.activeInspection;
}

export function clearExecutiveChangeInspection(): void {
  if (sessionStore.activeInspection == null) return;
  sessionStore = Object.freeze({
    ...sessionStore,
    activeInspection: null,
  });
}

/**
 * Explicit acknowledgement boundary — current snapshot becomes next baseline.
 * Opening Queue / Collection alone must not call this.
 */
export function acknowledgeExecutiveChanges(input: {
  readonly currentSnapshot: ExecutiveChangeSnapshot;
}): Readonly<{
  readonly ok: true;
  readonly baselineAcknowledged: true;
  readonly snapshotId: string;
  readonly scopeKey: string;
}> {
  sessionStore = Object.freeze({
    acknowledgedByScope: Object.freeze({
      ...sessionStore.acknowledgedByScope,
      [input.currentSnapshot.scopeKey]: input.currentSnapshot,
    }),
    activeInspection: null,
  });
  return Object.freeze({
    ok: true as const,
    baselineAcknowledged: true as const,
    snapshotId: input.currentSnapshot.snapshotId,
    scopeKey: input.currentSnapshot.scopeKey,
  });
}

export function buildExecutiveChangeIntelligenceObservability(input: {
  readonly comparison: ExecutiveChangeComparisonResult | null;
  readonly activeCollection: boolean;
  readonly visibleIds?: readonly string[];
  readonly hiddenIds?: readonly string[];
  readonly baselineAcknowledged?: boolean;
}): Readonly<Record<string, string | number | boolean | null>> {
  const comparison = input.comparison;
  const counts = comparison?.countsByKind;
  return Object.freeze({
    contract: executiveStageChangeIntelligenceIdentity,
    changeBaselineStatus: comparison?.baselineStatus ?? "baseline-established",
    changeBaselineSnapshotId: comparison?.previousSnapshotId ?? null,
    changeCurrentSnapshotId: comparison?.currentSnapshotId ?? null,
    changeScopeKey: comparison?.scopeKey ?? null,
    meaningfulChangeCount: comparison?.changedObjectIds.length ?? 0,
    changedObjectIds: (comparison?.changedObjectIds ?? []).join("|") || "none",
    "change.new.count": counts?.new ?? 0,
    "change.resolved.count": counts?.resolved ?? 0,
    "change.improved.count": counts?.improved ?? 0,
    "change.deteriorated.count": counts?.deteriorated ?? 0,
    "change.stateChanged.count": counts?.["state-changed"] ?? 0,
    "change.decisionChanged.count": counts?.["decision-changed"] ?? 0,
    "change.executionChanged.count": counts?.["execution-changed"] ?? 0,
    activeChangeCollection: input.activeCollection,
    changeCollectionVisibleIds: (input.visibleIds ?? []).join("|") || "none",
    changeCollectionHiddenIds: (input.hiddenIds ?? []).join("|") || "none",
    changeCollectionTotalCount: comparison?.changedObjectIds.length ?? 0,
    changeBaselineAcknowledged: input.baselineAcknowledged === true,
    persistenceLevel: EXECUTIVE_STAGE_CHANGE_INTELLIGENCE_BOUNDARY.persistenceLevel,
    queueLabel: EXECUTIVE_CHANGE_QUEUE_LABEL,
  });
}

export function verifyExecutiveStageChangeIntelligence(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly nonSemanticValid: boolean;
  readonly persistenceHonest: boolean;
}> {
  const identity = getExecutiveStageChangeIntelligenceIdentity();
  const identityValid =
    identity.id === executiveStageChangeIntelligenceIdentity &&
    identity.version === executiveStageChangeIntelligenceVersion;
  const boundaryValid =
    EXECUTIVE_STAGE_CHANGE_INTELLIGENCE_BOUNDARY.changeRecordsAreSemanticObjects ===
      false &&
    EXECUTIVE_STAGE_CHANGE_INTELLIGENCE_BOUNDARY.autoSelectsChangedObject ===
      false &&
    EXECUTIVE_STAGE_CHANGE_INTELLIGENCE_BOUNDARY.movesCamera === false;
  const nonSemanticValid =
    EXECUTIVE_STAGE_CHANGE_INTELLIGENCE_BOUNDARY.inventsCausality === false;
  const persistenceHonest =
    EXECUTIVE_STAGE_CHANGE_INTELLIGENCE_BOUNDARY.persistenceLevel === "session";
  return Object.freeze({
    ok:
      options?.forceFailure === true
        ? false
        : identityValid &&
          boundaryValid &&
          nonSemanticValid &&
          persistenceHonest,
    identityValid,
    boundaryValid,
    nonSemanticValid,
    persistenceHonest,
  });
}
