"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import {
  findDueAutomaticMonitoringPolicies,
  getAutomaticMonitoringRuntimeVersion,
  listAutomaticMonitoringPolicies,
  listAutomaticMonitoringRuntimeStates,
  runNexoraMonitoringObservation,
  startNexoraForegroundMonitoringRuntime,
  subscribeAutomaticMonitoringRuntime,
} from "../../../lib/data-reality/automaticMonitoringRuntime.ts";
import {
  getLiveDataConnectionVersion,
  listNexoraLiveConnections,
  listNexoraLiveObservations,
  subscribeLiveDataConnections,
} from "../../../lib/data-reality/liveDataConnectionStore.ts";
import { requestNexoraLiveObservation } from "../../../lib/data-reality/liveDataObservationClient.ts";
import type { NexoraLiveCommittedObservation } from "../../../lib/data-reality/liveDataConnectorFoundation.ts";
import {
  enqueueProactiveAdvisorBrief,
  subscribeProactiveAdvisorDelivery,
} from "../../../lib/data-reality/proactiveAdvisorDelivery.ts";
import {
  acquireDurableMonitoringLease,
  persistDurableMonitoringRuntimeBrowser,
  recoverDurableMonitoringRuntimeBrowser,
  releaseDurableMonitoringLease,
  hydrateDurableMonitoringSnapshot,
} from "../../../lib/data-reality/durableMonitoringRuntime.ts";
import { readBackgroundMonitoringState, syncBackgroundMonitoringSnapshot } from "../../../lib/data-reality/backgroundMonitoringClient.ts";
import { evaluateProactiveMonitoring } from "../../../lib/data-reality/proactiveMonitoringFoundation.ts";
import {
  parseCsvDeterministically,
  prepareCsvRealDataImport,
  suggestCsvColumnMappings,
  type CsvVerticalSliceInput,
} from "../../../lib/data-reality/csvRealDataVerticalSlice.ts";
import type { ExecutiveSourceProjectionInput } from "../../../lib/data-reality/executiveSourceIntelligence.ts";

const CERTIFICATION_HEADER = "Current Revenue,Previous Revenue,Operating Cost,Production Used Capacity,Production Total Capacity,Warehouse Used Capacity,Warehouse Total Capacity,On-Time Deliveries,Total Deliveries,Customer Satisfaction,Maximum Satisfaction Score";

function controlledCertificationObservation(
  workspaceId: string,
  capacityPercent: number,
  sequence: number,
): ExecutiveSourceProjectionInput {
  const csvText = `${CERTIFICATION_HEADER}\n8400000,8080000,6700000,${capacityPercent * 100},10000,7900,8500,910,1000,4.2,5`;
  const importedAt = `2026-08-16T18:${String(sequence).padStart(2, "0")}:00.000Z`;
  const importId = `PM4-HVC-${capacityPercent}-${sequence}`;
  const sourceContextId = `csv:${workspaceId}:pm4-hvc`;
  const input: CsvVerticalSliceInput = Object.freeze({
    workspaceId,
    fileName: `pm4-controlled-${capacityPercent}.csv`,
    fileSize: csvText.length,
    csvText,
    importId,
    importedAt,
    sourceContextId,
  });
  const parsed = parseCsvDeterministically(csvText);
  const prepared = prepareCsvRealDataImport(input, suggestCsvColumnMappings(parsed.columns, importId));
  if (!prepared.ready || !prepared.snapshot || !prepared.handoff || !prepared.dataReality) {
    throw new Error("PM:4 controlled certification observation could not be prepared.");
  }
  return Object.freeze({
    workspaceId,
    sourceContextId,
    sourceLabel: input.fileName,
    committedAt: importedAt,
    recordCount: prepared.snapshot.records.length,
    mappingId: prepared.mapping.mappingId,
    snapshot: prepared.snapshot,
    handoff: prepared.handoff,
    dataReality: prepared.dataReality,
  });
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value as Record<string, unknown>).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

export function NexoraAutomaticMonitoringCoordinator({
  workspaceId,
  activeSourceContextId,
  onActiveObservation,
}: Readonly<{
  workspaceId: string;
  activeSourceContextId: string | null;
  onActiveObservation: (observation: NexoraLiveCommittedObservation) => void;
}>) {
  const [certificationResult, setCertificationResult] = useState("Ready");
  const [durableHydrated, setDurableHydrated] = useState(false);
  const runnerOwnerId = useRef(`pm5:foreground-runner:${workspaceId}:${globalThis.crypto?.randomUUID?.() ?? "single-window"}`);
  const certificationEnabled = useSyncExternalStore(
    () => () => undefined,
    () => process.env.NODE_ENV === "development" &&
      new URLSearchParams(globalThis.location.search).get("pm4Certification") === "true",
    () => false,
  );
  const liveVersion = useSyncExternalStore(
    subscribeLiveDataConnections,
    getLiveDataConnectionVersion,
    () => 0,
  );
  const monitoringVersion = useSyncExternalStore(
    subscribeAutomaticMonitoringRuntime,
    getAutomaticMonitoringRuntimeVersion,
    () => 0,
  );

  const runDue = useCallback(async () => {
    if (!durableHydrated) return;
    void liveVersion;
    void monitoringVersion;
    const now = new Date().toISOString();
    const connections = listNexoraLiveConnections(workspaceId);
    const due = findDueAutomaticMonitoringPolicies({
      policies: listAutomaticMonitoringPolicies(workspaceId),
      connections,
      runtimeStates: listAutomaticMonitoringRuntimeStates(workspaceId),
      now,
    });
    if (due.length > 0) {
      // Publish the current policy head before lease arbitration. This closes
      // the small async IndexedDB/localStorage handoff window after enable or
      // recovery without starting an observation itself.
      await persistDurableMonitoringRuntimeBrowser(globalThis.localStorage, now);
    }
    for (const policy of due) {
      const connection = connections.find((entry) => entry.connectionId === policy.connectionId);
      if (!connection) continue;
      const lease = acquireDurableMonitoringLease({
        storage: globalThis.localStorage,
        policyId: policy.policyId,
        ownerId: runnerOwnerId.current,
        acquiredAt: now,
      });
      if (!lease.acquired) continue;
      try {
        const result = await runNexoraMonitoringObservation({
          trigger: "scheduled",
          connection,
          policy,
          observedAt: now,
          observe: async ({ observationId, observedAt }) => {
            const response = await requestNexoraLiveObservation(connection, { observationId, observedAt });
            if (!response.prepared) throw new Error(response.message);
            return deepFreeze(response.prepared);
          },
        });
        if (result.evaluation) {
          enqueueProactiveAdvisorBrief({ monitoring: result.evaluation });
        }
        if (result.completed && activeSourceContextId === `live:${connection.connectionId}`) {
          const history = listNexoraLiveObservations(workspaceId, connection.connectionId);
          const latest = history[history.length - 1];
          if (latest) onActiveObservation(latest);
        }
      } finally {
        releaseDurableMonitoringLease({
          storage: globalThis.localStorage,
          policyId: policy.policyId,
          ownerId: runnerOwnerId.current,
        });
      }
    }
    await persistDurableMonitoringRuntimeBrowser(globalThis.localStorage, new Date().toISOString());
  }, [activeSourceContextId, durableHydrated, liveVersion, monitoringVersion, onActiveObservation, workspaceId]);

  useEffect(() => {
    let active = true;
    const unsubscribers: Array<() => void> = [];
    void (async () => {
      await recoverDurableMonitoringRuntimeBrowser(globalThis.localStorage, new Date().toISOString());
      const serverState = await readBackgroundMonitoringState(workspaceId);
      if (serverState) hydrateDurableMonitoringSnapshot(serverState.monitoring, new Date().toISOString());
      if (!active) return;
      const persist = () => {
        const now = new Date().toISOString();
        void persistDurableMonitoringRuntimeBrowser(globalThis.localStorage, now).then((snapshot) => {
          if (snapshot.policies.some((policy) => policy.executionOwner === "background")) void syncBackgroundMonitoringSnapshot(snapshot, now).catch(() => undefined);
        });
      };
      unsubscribers.push(
        subscribeAutomaticMonitoringRuntime(persist),
        subscribeLiveDataConnections(persist),
        subscribeProactiveAdvisorDelivery(persist),
      );
      await persistDurableMonitoringRuntimeBrowser(globalThis.localStorage, new Date().toISOString());
      if (active) setDurableHydrated(true);
    })();
    return () => {
      active = false;
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [workspaceId]);

  useEffect(() => {
    if (!durableHydrated) return;
    void runDue();
    return startNexoraForegroundMonitoringRuntime(() => void runDue());
  }, [durableHydrated, runDue]);

  if (!certificationEnabled) return null;

  const runControlledCase = (from: number, to: number, label: string) => {
    const monitoring = evaluateProactiveMonitoring(Object.freeze({
      previous: controlledCertificationObservation(workspaceId, from, 1),
      current: controlledCertificationObservation(workspaceId, to, 2),
    }));
    const outcome = enqueueProactiveAdvisorBrief({
      monitoring,
      historicalContext: label === "Escalation" ? Object.freeze([Object.freeze({
        memoryId: "pm4-hvc-capacity-history",
        summary: "A prior capacity response used a temporary second shift and recovered after review.",
        source: "APP:4 controlled certification evidence",
        confidence: 0.82,
        provenance: Object.freeze(["pm4-hvc:prior-capacity-decision"]),
      })]) : undefined,
    });
    setCertificationResult(`${label}: ${outcome.reason}`);
  };

  return (
    <aside
      data-testid="nexora-pm4-certification-controls"
      aria-label="PM:4 controlled certification"
      style={{ position: "fixed", zIndex: 1000, left: "0.75rem", bottom: "2.35rem", display: "flex", gap: "0.35rem", alignItems: "center", padding: "0.45rem", border: "1px solid rgba(125,211,252,0.55)", borderRadius: "0.45rem", background: "rgba(8,20,38,0.96)", color: "#dbeafe", fontSize: "0.62rem" }}
    >
      <span>PM:4 controlled evidence</span>
      <button type="button" onClick={() => runControlledCase(90, 96, "Escalation")}>Trigger escalation</button>
      <button type="button" onClick={() => runControlledCase(96, 70, "Recovery")}>Trigger recovery</button>
      <button type="button" onClick={() => runControlledCase(70, 70.1, "No change")}>Trigger no-change</button>
      <output>{certificationResult}</output>
    </aside>
  );
}

export default NexoraAutomaticMonitoringCoordinator;
