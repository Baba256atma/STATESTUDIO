"use client";

import { useEffect, useRef, useState } from "react";

import {
  buildContextSummarySignature,
  consumeDashboardExecutiveContextSummary,
  DASHBOARD_ASSISTANT_CONTEXT_SYNC_EVENT,
  type DashboardExecutiveContextSummary,
} from "./assistantContextSyncContract";

export function useAssistantExecutiveContextSync(): DashboardExecutiveContextSummary | null {
  const [summary, setSummary] = useState<DashboardExecutiveContextSummary | null>(null);
  const lastSummarySignatureRef = useRef<string | null>(null);

  useEffect(() => {
    const onSync = (event: Event) => {
      const detail = (event as CustomEvent<unknown>).detail;
      const result = consumeDashboardExecutiveContextSummary(detail);
      if (result.accepted && result.summary) {
        const signature = buildContextSummarySignature(result.summary);
        if (lastSummarySignatureRef.current === signature) {
          if (process.env.NODE_ENV !== "production") {
            globalThis.console?.debug?.("[AssistantContextSync][ConsumerSkipped]", {
              reason: "same_context_signature",
              signature,
            });
          }
          return;
        }
        lastSummarySignatureRef.current = signature;
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
