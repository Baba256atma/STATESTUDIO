"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { DecisionSnapshot } from "../lib/decision/decisionTypes";
import { appendSnapshot, clearSnapshots, loadSnapshots } from "../lib/decision/decisionStore";

export function useDecisionMemory(projectId: string) {
  const safeProjectId = projectId || "default";
  const [snapshots, setSnapshots] = useState<DecisionSnapshot[]>([]);

  useEffect(() => {
    setSnapshots(loadSnapshots(safeProjectId));
  }, [safeProjectId]);

  const addSnapshot = useCallback(
    (snapshot: Omit<DecisionSnapshot, "projectId">) => {
      const next = appendSnapshot(safeProjectId, snapshot);
      setSnapshots(next);
    },
    [safeProjectId]
  );

  const clear = useCallback(() => {
    clearSnapshots(safeProjectId);
    setSnapshots([]);
  }, [safeProjectId]);

  const latest = useMemo(
    () => (snapshots.length ? snapshots[snapshots.length - 1] : null),
    [snapshots]
  );

  return { snapshots, latest, addSnapshot, clear };
}