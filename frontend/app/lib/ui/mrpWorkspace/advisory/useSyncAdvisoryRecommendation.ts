"use client";

import React from "react";

import { syncAdvisoryRecommendation } from "./advisoryRecommendationRuntime.ts";
import { useAdvisoryWorkspaceState } from "./useAdvisoryWorkspaceState.ts";

export function useSyncAdvisoryRecommendation(): void {
  const workspaceState = useAdvisoryWorkspaceState();

  React.useEffect(() => {
    if (workspaceState.phase === "loading") return;
    syncAdvisoryRecommendation();
  }, [
    workspaceState.phase,
    workspaceState.revision,
    workspaceState.workspaceContext.hasSelection,
    workspaceState.workspaceContext.selectedObjectId,
    workspaceState.workspaceContext.recommendationFocus,
    workspaceState.recommendationId,
  ]);
}

export default useSyncAdvisoryRecommendation;
