"use client";

import React, { useEffect, useMemo } from "react";
import type { DashboardContext } from "../../../lib/ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../../../lib/dashboard/dashboardContextTypes.ts";
import { useDashboardAccordionRuntime } from "../../../lib/dashboard/useDashboardAccordionRuntime.ts";
import { reportDashboardAccordion } from "../../../lib/dashboard/dashboardAccordionLogging.ts";
import { CANONICAL_DASHBOARD_ACCORDION_OWNER } from "../../../lib/dashboard/dashboardAccordionPanelContract.ts";
import { measureDashboardOperation } from "../../../lib/dashboard/dashboardPerformanceMetrics.ts";
import { recordDashboardRenderStorm } from "../../../lib/dashboard/dashboardPerformanceRegression.ts";
import { DashboardAccordionPanel } from "./DashboardAccordionPanel.tsx";

export type DashboardAccordionSystemProps = {
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  executiveSummaryContent: React.ReactNode;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  objectsInScene?: number;
  timelineActive?: boolean;
};

function DashboardAccordionSystemInner(props: DashboardAccordionSystemProps): React.ReactElement {
  const {
    dashboardContext,
    normalizedContext,
    executiveSummaryContent,
    selectedObjectId,
    selectedObjectLabel,
    objectsInScene,
    timelineActive,
  } = props;
  const accordion = useDashboardAccordionRuntime({
    dashboardContext,
    normalizedContext,
  });

  const renderSignature = useMemo(
    () =>
      `${accordion.contextSignature}:${accordion.expandedPanelIds.join(",")}:${accordion.panels.length}`,
    [accordion.contextSignature, accordion.expandedPanelIds, accordion.panels.length]
  );

  useEffect(() => {
    reportDashboardAccordion({
      phase: "system_mount",
      owner: CANONICAL_DASHBOARD_ACCORDION_OWNER,
      contextSignature: accordion.contextSignature,
      panelCount: accordion.panels.length,
      expandedPanelIds: accordion.expandedPanelIds,
    });
    measureDashboardOperation(
      "accordionRender",
      () => accordion.panels.length,
      { phase: "accordion_system_mount", contextSignature: accordion.contextSignature }
    );
    recordDashboardRenderStorm(renderSignature);
  }, [accordion.contextSignature, accordion.expandedPanelIds, accordion.panels.length, renderSignature]);

  const panelIds = useMemo(() => accordion.panels.map((panel) => panel.panelId), [accordion.panels]);

  return (
    <div
      data-nx="dashboard-accordion-system"
      data-context={dashboardContext}
      data-context-signature={accordion.contextSignature}
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        flex: 1,
        overflow: "auto",
      }}
    >
      <div
        data-nx="dashboard-accordion-toolbar"
        style={{
          display: "flex",
          gap: 8,
          padding: "8px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          fontSize: 11,
          opacity: 0.8,
        }}
      >
        <button type="button" onClick={() => accordion.expandMultiple(panelIds)}>
          Expand all
        </button>
        <button type="button" onClick={accordion.collapseAll}>
          Collapse all
        </button>
        <span style={{ marginLeft: "auto" }}>
          {accordion.expandedPanelIds.length} / {accordion.panels.length} open
        </span>
      </div>

      {accordion.panels.map((panel) => (
        <DashboardAccordionPanel
          key={panel.panelId}
          panel={panel}
          dashboardContext={dashboardContext}
          normalizedContext={normalizedContext}
          selectedObjectId={selectedObjectId}
          selectedObjectLabel={selectedObjectLabel}
          objectsInScene={objectsInScene}
          timelineActive={timelineActive}
          executiveSummaryContent={
            panel.bodySlot === "executive_delegate" && panel.expansionState === "expanded"
              ? executiveSummaryContent
              : undefined
          }
          onToggle={accordion.togglePanel}
        />
      ))}
    </div>
  );
}

export const DashboardAccordionSystem = React.memo(DashboardAccordionSystemInner);

export default DashboardAccordionSystem;
