"use client";

import { useEffect, useState } from "react";

import {
  consumeDashboardExecutiveContextSummary,
  DASHBOARD_ASSISTANT_CONTEXT_SYNC_EVENT,
  type DashboardExecutiveContextSummary,
} from "./assistantContextSyncContract";

export function useAssistantExecutiveContextSync(): DashboardExecutiveContextSummary | null {
  const [summary, setSummary] = useState<DashboardExecutiveContextSummary | null>(null);

  useEffect(() => {
    const onSync = (event: Event) => {
      const detail = (event as CustomEvent<unknown>).detail;
      const result = consumeDashboardExecutiveContextSummary(detail);
      if (result.accepted && result.summary) {
        setSummary(result.summary);
      }
    };

    window.addEventListener(DASHBOARD_ASSISTANT_CONTEXT_SYNC_EVENT, onSync as EventListener);
    return () =>
      window.removeEventListener(DASHBOARD_ASSISTANT_CONTEXT_SYNC_EVENT, onSync as EventListener);
  }, []);

  return summary;
}

export default useAssistantExecutiveContextSync;
