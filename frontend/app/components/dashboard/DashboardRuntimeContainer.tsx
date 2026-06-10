"use client";

import React, { useEffect, useRef } from "react";
import type { DashboardContext } from "../../lib/ui/mainRightPanelContract.ts";
import {
  CANONICAL_DASHBOARD_RENDER_PATH,
  CANONICAL_DASHBOARD_RUNTIME_OWNER,
} from "../../lib/dashboard/dashboardRuntimeContract.ts";
import { initializeDashboardSurfaceRegistry } from "../../lib/dashboard/dashboardSurfaceRegistry.ts";
import {
  reportDashboardRuntime,
  reportDashboardSurfaceResolved,
} from "../../lib/dashboard/dashboardRuntimeLogging.ts";
import type { NormalizedDashboardContext } from "../../lib/dashboard/dashboardContextTypes.ts";
import { DashboardAccordionSystem } from "./accordion/DashboardAccordionSystem.tsx";
import { buildAccordionContextSignature } from "../../lib/dashboard/dashboardAccordionPersistence.ts";
import { initializeExecutiveSummaryRuntime } from "../../lib/dashboard/executiveSummary/executiveSummaryRuntime.ts";
import { initializeOperationalIntelligenceRuntime } from "../../lib/dashboard/operationalIntelligence/operationalIntelligenceRuntime.ts";
import { initializeRiskIntelligenceRuntime } from "../../lib/dashboard/riskIntelligence/riskIntelligenceRuntime.ts";
import { initializeTimelineIntelligenceRuntime } from "../../lib/dashboard/timelineIntelligence/timelineIntelligenceRuntime.ts";
import { initializeScenarioIntelligenceRuntime } from "../../lib/dashboard/scenarioIntelligence/scenarioIntelligenceRuntime.ts";
import { initializeWarRoomIntelligenceRuntime } from "../../lib/dashboard/warRoomIntelligence/warRoomIntelligenceRuntime.ts";
import { initializeExecutiveAdvisoryRuntime } from "../../lib/dashboard/executiveAdvisory/executiveAdvisoryRuntime.ts";
import { initializeDecisionGuidanceRuntime } from "../../lib/dashboard/decisionGuidance/decisionGuidanceRuntime.ts";
import { initializeGovernanceIntelligenceRuntime } from "../../lib/dashboard/governanceIntelligence/governanceIntelligenceRuntime.ts";
import { initializeStrategicAlignmentRuntime } from "../../lib/dashboard/strategicAlignment/strategicAlignmentRuntime.ts";
import { initializePolicyConstraintIntelligenceRuntime } from "../../lib/dashboard/policyConstraintIntelligence/policyConstraintIntelligenceRuntime.ts";
import { initializeStakeholderIntelligenceRuntime } from "../../lib/dashboard/stakeholderIntelligence/stakeholderIntelligenceRuntime.ts";
import { initializeConsensusIntelligenceRuntime } from "../../lib/dashboard/consensusIntelligence/consensusIntelligenceRuntime.ts";
import { initializeInstitutionalAlignmentRuntime } from "../../lib/dashboard/institutionalAlignment/institutionalAlignmentRuntime.ts";
import { initializeAdvisoryWarRoomIntegrationRuntime } from "../../lib/dashboard/advisoryWarRoomIntegration/advisoryWarRoomIntegrationRuntime.ts";
import { initializeAdvisoryAggregationRuntime } from "../../lib/dashboard/executiveAdvisory/aggregation/advisoryAggregationRuntime.ts";
import { initializeAdvisoryConfidenceRuntime } from "../../lib/dashboard/executiveAdvisory/confidence/advisoryConfidenceRuntime.ts";
import { initializeAdvisoryExplainabilityRuntime } from "../../lib/dashboard/executiveAdvisory/explainability/advisoryExplainabilityRuntime.ts";
import { resolveDefaultDashboardLandingSurface } from "../../lib/dashboard/dashboardSurfaceRegistry.ts";

export type DashboardRuntimeContainerProps = {
  dashboardContext: DashboardContext;
  normalizedContext?: NormalizedDashboardContext | null;
  source?: string;
  executiveSummaryContent: React.ReactNode;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  objectsInScene?: number;
  timelineActive?: boolean;
};

export function DashboardRuntimeContainer(props: DashboardRuntimeContainerProps): React.ReactElement {
  const {
    dashboardContext,
    normalizedContext = null,
    source = "DashboardRuntimeContainer",
    executiveSummaryContent,
    selectedObjectId = null,
    selectedObjectLabel = null,
    objectsInScene,
    timelineActive = false,
  } = props;
  const contextSignature = buildAccordionContextSignature({
    dashboardContext,
    normalizedContextId: normalizedContext?.id ?? null,
  });
  const lastSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    initializeDashboardSurfaceRegistry();
    initializeExecutiveSummaryRuntime({ dashboardContext, normalizedContext });
    initializeOperationalIntelligenceRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
    initializeRiskIntelligenceRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
    initializeTimelineIntelligenceRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
    initializeScenarioIntelligenceRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
    initializeWarRoomIntelligenceRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
    initializeAdvisoryAggregationRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
    initializeAdvisoryConfidenceRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
    initializeAdvisoryExplainabilityRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
    initializeExecutiveAdvisoryRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
    initializeDecisionGuidanceRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
    initializeGovernanceIntelligenceRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
    initializeStrategicAlignmentRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
    initializePolicyConstraintIntelligenceRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
    initializeStakeholderIntelligenceRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
    initializeConsensusIntelligenceRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
    initializeInstitutionalAlignmentRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
    initializeAdvisoryWarRoomIntegrationRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
    reportDashboardRuntime({
      phase: "lifecycle_mount",
      owner: CANONICAL_DASHBOARD_RUNTIME_OWNER,
      renderPath: CANONICAL_DASHBOARD_RENDER_PATH,
      dashboardContext,
      contextId: normalizedContext?.id ?? null,
      contextSignature,
      presentation: "dashboard_accordion_system",
      defaultLandingSurface: resolveDefaultDashboardLandingSurface(),
      source,
    });
    return () => {
      reportDashboardRuntime({
        phase: "lifecycle_unmount",
        owner: CANONICAL_DASHBOARD_RUNTIME_OWNER,
        dashboardContext,
        contextId: normalizedContext?.id ?? null,
        contextSignature,
        source,
      });
    };
  }, [contextSignature, dashboardContext, normalizedContext?.id, source]);

  useEffect(() => {
    if (lastSignatureRef.current === contextSignature) return;
    lastSignatureRef.current = contextSignature;
    reportDashboardRuntime({
      phase: "accordion_present",
      owner: CANONICAL_DASHBOARD_RUNTIME_OWNER,
      dashboardContext,
      contextId: normalizedContext?.id ?? null,
      category: normalizedContext?.category ?? null,
      contextSignature,
      source,
    });
    reportDashboardSurfaceResolved({
      contextId: normalizedContext?.id ?? null,
      surfaceId: normalizedContext?.surfaceId ?? "executive_summary",
      category: normalizedContext?.category ?? "executive_summary",
      dashboardContext,
      source,
      phase: "accordion_system",
    });
  }, [contextSignature, dashboardContext, normalizedContext?.category, normalizedContext?.id, normalizedContext?.surfaceId, source]);

  return (
    <div
      data-nx="dashboard-runtime-container"
      data-context={dashboardContext}
      data-context-id={normalizedContext?.id ?? undefined}
      data-context-signature={contextSignature}
      style={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1, overflow: "hidden" }}
    >
      <DashboardAccordionSystem
        key={contextSignature}
        dashboardContext={dashboardContext}
        normalizedContext={normalizedContext}
        executiveSummaryContent={executiveSummaryContent}
        selectedObjectId={selectedObjectId}
        selectedObjectLabel={selectedObjectLabel}
        objectsInScene={objectsInScene}
        timelineActive={timelineActive}
      />
    </div>
  );
}

export default DashboardRuntimeContainer;
