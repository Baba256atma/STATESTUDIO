"use client";

import { createContext, useMemo, type ReactNode } from "react";
import { useRuntimeMonitoring } from "../runtime";
import type {
  ExecutiveHealthState,
  MonitoringAlert,
  MonitoringFilter,
  MonitoringJournalEntry,
  MonitoringKpi,
  MonitoringObjectHealth,
  MonitoringSnapshotRecord,
  MonitoringTimelinePack,
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
 * ExecutiveMonitoringProvider — Runtime-backed monitoring awareness state.
 */
export function ExecutiveMonitoringProvider({ children }: Props) {
  const runtime = useRuntimeMonitoring();
  const value = useMemo(() => runtime, [runtime]);

  return (
    <ExecutiveMonitoringContext.Provider value={value}>
      {children}
    </ExecutiveMonitoringContext.Provider>
  );
}
