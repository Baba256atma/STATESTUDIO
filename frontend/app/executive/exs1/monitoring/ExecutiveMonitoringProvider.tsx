"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  INITIAL_EXECUTIVE_HEALTH,
  INITIAL_MONITORING_ALERTS,
  INITIAL_MONITORING_KPIS,
  INITIAL_MONITORING_SUMMARY,
  INITIAL_OBJECT_HEALTH,
  createMonitoringSnapshot,
  toMonitoringJournalEntry,
  toMonitoringTimelinePack,
  type ExecutiveHealthState,
  type MonitoringAlert,
  type MonitoringFilter,
  type MonitoringJournalEntry,
  type MonitoringKpi,
  type MonitoringObjectHealth,
  type MonitoringSnapshotRecord,
  type MonitoringTimelinePack,
} from "./ExecutiveMonitoringConfig";

export type ExecutiveMonitoringContextValue = {
  readonly executiveHealth: ExecutiveHealthState;
  readonly kpis: readonly MonitoringKpi[];
  readonly alerts: readonly MonitoringAlert[];
  readonly objectHealth: readonly MonitoringObjectHealth[];
  readonly summary: string;
  readonly filter: MonitoringFilter;
  readonly compareOpen: boolean;
  readonly notes: string;
  readonly panelCollapsed: boolean;
  readonly panelWidth: number;
  readonly snapshots: readonly MonitoringSnapshotRecord[];
  readonly journalEntries: readonly MonitoringJournalEntry[];
  readonly monitoringPacks: readonly MonitoringTimelinePack[];
  readonly setFilter: (filter: MonitoringFilter) => void;
  readonly setCompareOpen: (open: boolean) => void;
  readonly setNotes: (notes: string) => void;
  readonly setPanelCollapsed: (collapsed: boolean) => void;
  readonly setPanelWidth: (width: number) => void;
  readonly createSnapshot: () => void;
  readonly refresh: () => void;
};

export const ExecutiveMonitoringContext =
  createContext<ExecutiveMonitoringContextValue | null>(null);

type Props = {
  readonly children: ReactNode;
};

/**
 * ExecutiveMonitoringProvider — pure UI monitoring awareness state.
 * Never touches Runtime, AI, KPI engines, or timeline lens.
 */
export function ExecutiveMonitoringProvider({ children }: Props) {
  const [executiveHealth] = useState<ExecutiveHealthState>(
    INITIAL_EXECUTIVE_HEALTH,
  );
  const [kpis] = useState(() => [...INITIAL_MONITORING_KPIS]);
  const [alerts] = useState(() => [...INITIAL_MONITORING_ALERTS]);
  const [objectHealth] = useState(() => [...INITIAL_OBJECT_HEALTH]);
  const [summary] = useState(INITIAL_MONITORING_SUMMARY);
  const [filter, setFilter] = useState<MonitoringFilter>("All");
  const [compareOpen, setCompareOpen] = useState(false);
  const [notes, setNotes] = useState(
    "Watch Inventory Critical path before declaring Capacity Expansion successful.",
  );
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [panelWidth, setPanelWidth] = useState(320);
  const [snapshots, setSnapshots] = useState<MonitoringSnapshotRecord[]>([]);
  const [journalEntries, setJournalEntries] = useState<
    MonitoringJournalEntry[]
  >([]);
  const [monitoringPacks, setMonitoringPacks] = useState<
    MonitoringTimelinePack[]
  >([]);
  const [refreshTick, setRefreshTick] = useState(0);

  const createSnapshot = useCallback(() => {
    const snapshot = createMonitoringSnapshot({
      executiveHealth,
      summary,
      alertCount: alerts.length,
    });
    const journal = toMonitoringJournalEntry(snapshot);
    const pack = toMonitoringTimelinePack(snapshot);
    setSnapshots((prev) => [...prev, snapshot]);
    setJournalEntries((prev) => [...prev, journal]);
    setMonitoringPacks((prev) => [...prev, pack]);
  }, [executiveHealth, summary, alerts.length]);

  const refresh = useCallback(() => {
    setRefreshTick((n) => n + 1);
  }, []);

  const value = useMemo(
    () => ({
      executiveHealth,
      kpis,
      alerts,
      objectHealth,
      summary,
      filter,
      compareOpen,
      notes,
      panelCollapsed,
      panelWidth,
      snapshots,
      journalEntries,
      monitoringPacks,
      setFilter,
      setCompareOpen,
      setNotes,
      setPanelCollapsed,
      setPanelWidth,
      createSnapshot,
      refresh,
    }),
    [
      executiveHealth,
      kpis,
      alerts,
      objectHealth,
      summary,
      filter,
      compareOpen,
      notes,
      panelCollapsed,
      panelWidth,
      snapshots,
      journalEntries,
      monitoringPacks,
      createSnapshot,
      refresh,
      refreshTick,
    ],
  );

  return (
    <ExecutiveMonitoringContext.Provider value={value}>
      {children}
    </ExecutiveMonitoringContext.Provider>
  );
}
