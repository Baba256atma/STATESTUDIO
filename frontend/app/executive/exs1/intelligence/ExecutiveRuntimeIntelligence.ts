/**
 * Phase B — Orchestrate Runtime Intelligence (deterministic, rule-based).
 */

import type { ExecutiveMetadataCatalog } from "../metadata/ExecutiveMetadataRegistry";
import type { ExecutiveRuntimeEvent } from "../runtime/ExecutiveRuntimeEvents";
import type { ExecutiveRuntimeState } from "../runtime/ExecutiveRuntimeStore";
import {
  detectExecutiveChange,
  shouldProcessEvent,
} from "./ExecutiveChangeDetector";
import { analyzeExecutiveContext } from "./ExecutiveContextAnalyzer";
import { analyzeExecutiveRelationships } from "./ExecutiveRelationshipAnalyzer";
import { prioritizeExecutiveSignals } from "./ExecutivePriorityEngine";
import { buildExecutiveRecommendationContext } from "./ExecutiveRecommendationContext";
import { createExecutiveSignal } from "./ExecutiveSignalEngine";
import type {
  ExecutiveRecommendationContext,
  ExecutiveSignal,
  IntelligenceFilter,
  IntelligenceJournalEntry,
} from "./ExecutiveSignalTypes";

export function processRuntimeEventForIntelligence(input: {
  readonly event: ExecutiveRuntimeEvent;
  readonly previous: ExecutiveRuntimeState | null;
  readonly current: ExecutiveRuntimeState;
  readonly catalog: ExecutiveMetadataCatalog;
  readonly existing: readonly ExecutiveSignal[];
}): {
  readonly signals: ExecutiveSignal[];
  readonly created: ExecutiveSignal | null;
  readonly journal: IntelligenceJournalEntry | null;
} {
  if (!shouldProcessEvent(input.event.type)) {
    return { signals: [...input.existing], created: null, journal: null };
  }

  const change = detectExecutiveChange(
    input.event,
    input.previous,
    input.current,
  );
  const context = analyzeExecutiveContext(input.current, input.catalog);
  const relationships = analyzeExecutiveRelationships(
    change,
    input.current,
    input.catalog,
  );
  const created = createExecutiveSignal({ change, context, relationships });

  // One signal identity → at most one Journal pack. Skip re-insertion.
  if (input.existing.some((s) => s.signalId === created.signalId)) {
    return { signals: [...input.existing], created: null, journal: null };
  }

  const deduped = input.existing.filter(
    (s) =>
      !(
        s.sourceEvent === created.sourceEvent &&
        s.summary === created.summary &&
        s.lifecycle === "New"
      ),
  );

  const signals = prioritizeExecutiveSignals(
    [created, ...deduped].slice(0, 48),
    input.current.mode.activeMode,
  );

  const journal: IntelligenceJournalEntry = {
    id: `journal-intel:${created.signalId}`,
    signalId: created.signalId,
    summary: `[Intelligence] ${created.type} · ${created.summary}`,
    reason: created.sourceSummary,
    objects: created.relatedObjectIds.join(", ") || "—",
    context: `${created.relatedPackTitle} · ${created.relatedTimeline}`,
    recommendation: created.suggestedAction,
    createdDate: new Date(created.timestamp).toISOString().slice(0, 10),
  };

  return { signals, created, journal };
}

/** Safety boundary — one Journal entry identity per id. */
export function dedupeJournalEntries<T extends { id: string }>(
  entries: readonly T[],
): T[] {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.id)) return false;
    seen.add(entry.id);
    return true;
  });
}

export function filterExecutiveSignals(
  signals: readonly ExecutiveSignal[],
  filter: IntelligenceFilter,
): ExecutiveSignal[] {
  switch (filter) {
    case "Warnings":
      return signals.filter(
        (s) => s.type === "Warning" || s.severity === "High",
      );
    case "Critical":
      return signals.filter(
        (s) => s.type === "Critical" || s.severity === "Critical",
      );
    case "Decision Required":
      return signals.filter((s) => s.type === "Decision Required");
    case "Resolved":
      return signals.filter(
        (s) => s.lifecycle === "Resolved" || s.lifecycle === "Archived",
      );
    case "My Attention":
      return signals.filter(
        (s) =>
          s.unread &&
          s.lifecycle !== "Resolved" &&
          s.lifecycle !== "Archived",
      );
    default:
      return [...signals];
  }
}

export function searchExecutiveSignals(
  signals: readonly ExecutiveSignal[],
  query: string,
): ExecutiveSignal[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...signals];
  return signals.filter(
    (s) =>
      s.summary.toLowerCase().includes(q) ||
      s.relatedPackTitle.toLowerCase().includes(q) ||
      s.domainNames.some((d) => d.toLowerCase().includes(q)) ||
      s.relatedObjectIds.some((id) => id.toLowerCase().includes(q)) ||
      s.type.toLowerCase().includes(q),
  );
}

export function recommendationFromSignals(
  signals: readonly ExecutiveSignal[],
  state: ExecutiveRuntimeState,
  catalog: ExecutiveMetadataCatalog,
): ExecutiveRecommendationContext {
  const active =
    prioritizeExecutiveSignals(signals, state.mode.activeMode).find(
      (s) =>
        s.unread &&
        s.lifecycle !== "Resolved" &&
        s.lifecycle !== "Archived",
    ) ?? null;
  return buildExecutiveRecommendationContext(active, state, catalog);
}
