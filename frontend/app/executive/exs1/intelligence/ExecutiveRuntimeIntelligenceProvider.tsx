"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useExecutiveMetadata } from "../metadata";
import {
  useExecutiveRuntimeState,
  useExecutiveRuntimeStoreApi,
} from "../runtime";
import type { ExecutiveRuntimeState } from "../runtime/ExecutiveRuntimeStore";
import {
  dedupeJournalEntries,
  filterExecutiveSignals,
  processRuntimeEventForIntelligence,
  recommendationFromSignals,
  searchExecutiveSignals,
} from "./ExecutiveRuntimeIntelligence";
import { prioritizeExecutiveSignals } from "./ExecutivePriorityEngine";
import { publishIntelligenceInspectorSnapshot } from "./intelligenceInspectorBridge";
import type {
  ExecutiveRecommendationContext,
  ExecutiveSignal,
  ExecutiveSignalLifecycle,
  IntelligenceFilter,
  IntelligenceJournalEntry,
  IntelligenceSection,
} from "./ExecutiveSignalTypes";

export type ExecutiveRuntimeIntelligenceContextValue = {
  readonly signals: readonly ExecutiveSignal[];
  readonly visibleSignals: readonly ExecutiveSignal[];
  readonly selectedSignalId: string | null;
  readonly selectedSignal: ExecutiveSignal | null;
  readonly filter: IntelligenceFilter;
  readonly setFilter: (filter: IntelligenceFilter) => void;
  readonly query: string;
  readonly setQuery: (query: string) => void;
  readonly section: IntelligenceSection;
  readonly setSection: (section: IntelligenceSection) => void;
  readonly recommendation: ExecutiveRecommendationContext;
  readonly journalEntries: readonly IntelligenceJournalEntry[];
  readonly attentionObjectIds: readonly string[];
  readonly setSelectedSignalId: (id: string | null) => void;
  readonly setLifecycle: (
    signalId: string,
    lifecycle: ExecutiveSignalLifecycle,
  ) => void;
  readonly acknowledge: (signalId: string) => void;
  readonly resolve: (signalId: string) => void;
  readonly archive: (signalId: string) => void;
};

export const ExecutiveRuntimeIntelligenceContext =
  createContext<ExecutiveRuntimeIntelligenceContextValue | null>(null);

type Props = {
  readonly children: ReactNode;
};

/**
 * Runtime Intelligence Provider — listens to Runtime events, never mutates Runtime Store.
 */
export function ExecutiveRuntimeIntelligenceProvider({ children }: Props) {
  const store = useExecutiveRuntimeStoreApi();
  const runtimeState = useExecutiveRuntimeState((s) => s);
  const { catalog } = useExecutiveMetadata();

  const [signals, setSignals] = useState<ExecutiveSignal[]>([]);
  const [journalEntries, setJournalEntries] = useState<
    IntelligenceJournalEntry[]
  >([]);
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
  const [filter, setFilter] = useState<IntelligenceFilter>("All");
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<IntelligenceSection>("Signals");

  const previousRef = useRef<ExecutiveRuntimeState | null>(null);
  const lastEventIdRef = useRef<string | null>(null);

  useEffect(() => {
    const latest = runtimeState.events.at(-1) ?? null;
    if (!latest || latest.id === lastEventIdRef.current) {
      previousRef.current = runtimeState;
      return;
    }
    lastEventIdRef.current = latest.id;
    const previous = previousRef.current;
    previousRef.current = runtimeState;
    setSignals((existing) => {
      const result = processRuntimeEventForIntelligence({
        event: latest,
        previous,
        current: runtimeState,
        catalog,
        existing,
      });
      if (result.created) {
        if (result.journal) {
          const journal = result.journal;
          setJournalEntries((prev) => {
            if (prev.some((entry) => entry.id === journal.id)) {
              return prev;
            }
            return dedupeJournalEntries([journal, ...prev]).slice(0, 24);
          });
        }
        if (result.created.unread) {
          setSelectedSignalId(result.created.signalId);
        }
        return result.signals;
      }
      return existing;
    });
  }, [runtimeState, catalog]);

  const visibleSignals = useMemo(() => {
    const filtered = filterExecutiveSignals(signals, filter);
    return searchExecutiveSignals(
      prioritizeExecutiveSignals(filtered, runtimeState.mode.activeMode),
      query,
    );
  }, [signals, filter, query, runtimeState.mode.activeMode]);

  const selectedSignal =
    signals.find((s) => s.signalId === selectedSignalId) ??
    visibleSignals[0] ??
    null;

  const recommendation = useMemo(
    () => recommendationFromSignals(signals, runtimeState, catalog),
    [signals, runtimeState, catalog],
  );

  const attentionObjectIds = useMemo(() => {
    const active = signals.filter(
      (s) =>
        s.unread &&
        s.lifecycle !== "Resolved" &&
        s.lifecycle !== "Archived",
    );
    return Array.from(
      new Set(active.flatMap((s) => s.relatedObjectIds)),
    ).slice(0, 6);
  }, [signals]);

  useEffect(() => {
    publishIntelligenceInspectorSnapshot({
      recentCount: signals.length,
      queueCount: signals.filter(
        (s) => s.lifecycle === "New" || s.lifecycle === "Acknowledged",
      ).length,
      topSignal: selectedSignal?.summary ?? null,
      priority: selectedSignal?.severity ?? "Low",
      recommendationType: recommendation.type,
      workspace: runtimeState.mode.activeMode,
      packTitle: recommendation.packTitle,
    });
  }, [
    signals,
    selectedSignal,
    recommendation,
    runtimeState.mode.activeMode,
  ]);

  const setLifecycle = useCallback(
    (signalId: string, lifecycle: ExecutiveSignalLifecycle) => {
      setSignals((prev) =>
        prioritizeExecutiveSignals(
          prev.map((s) =>
            s.signalId === signalId
              ? {
                  ...s,
                  lifecycle,
                  unread:
                    lifecycle === "Resolved" || lifecycle === "Archived"
                      ? false
                      : s.unread,
                }
              : s,
          ),
          store.getState().mode.activeMode,
        ),
      );
    },
    [store],
  );

  const acknowledge = useCallback(
    (signalId: string) => {
      setSignals((prev) =>
        prev.map((s) =>
          s.signalId === signalId
            ? { ...s, lifecycle: "Acknowledged", unread: false }
            : s,
        ),
      );
    },
    [],
  );

  const resolve = useCallback((signalId: string) => {
    setLifecycle(signalId, "Resolved");
  }, [setLifecycle]);

  const archive = useCallback((signalId: string) => {
    setLifecycle(signalId, "Archived");
  }, [setLifecycle]);

  const value = useMemo(
    () => ({
      signals,
      visibleSignals,
      selectedSignalId: selectedSignal?.signalId ?? null,
      selectedSignal,
      filter,
      setFilter,
      query,
      setQuery,
      section,
      setSection,
      recommendation,
      journalEntries,
      attentionObjectIds,
      setSelectedSignalId,
      setLifecycle,
      acknowledge,
      resolve,
      archive,
    }),
    [
      signals,
      visibleSignals,
      selectedSignal,
      filter,
      query,
      section,
      recommendation,
      journalEntries,
      attentionObjectIds,
      setLifecycle,
      acknowledge,
      resolve,
      archive,
    ],
  );

  return (
    <ExecutiveRuntimeIntelligenceContext.Provider value={value}>
      {children}
    </ExecutiveRuntimeIntelligenceContext.Provider>
  );
}
