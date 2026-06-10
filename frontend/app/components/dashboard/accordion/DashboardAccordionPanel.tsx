"use client";

import React from "react";
import type { DashboardAccordionPanelContract } from "../../../lib/dashboard/dashboardAccordionPanelContract.ts";
import { DashboardSurfaceVisualPanel } from "../visual/DashboardSurfaceVisualPanel.tsx";
import { DashboardAccordionHeaderSignals } from "../visual/DashboardAccordionHeaderSignals.tsx";
import { OperationalIntelligenceSurface } from "../surfaces/OperationalIntelligenceSurface.tsx";
import { RiskIntelligenceSurface } from "../surfaces/RiskIntelligenceSurface.tsx";
import { TimelineIntelligenceSurface } from "../surfaces/TimelineIntelligenceSurface.tsx";
import { ScenarioIntelligenceSurface } from "../surfaces/ScenarioIntelligenceSurface.tsx";
import { WarRoomIntelligenceSurface } from "../surfaces/WarRoomIntelligenceSurface.tsx";
import { ExecutiveAdvisorySurface } from "../surfaces/ExecutiveAdvisorySurface.tsx";
import { DecisionGuidanceSurface } from "../surfaces/DecisionGuidanceSurface.tsx";
import { GovernanceIntelligenceSurface } from "../surfaces/GovernanceIntelligenceSurface.tsx";
import { StrategicAlignmentSurface } from "../surfaces/StrategicAlignmentSurface.tsx";
import { PolicyConstraintIntelligenceSurface } from "../surfaces/PolicyConstraintIntelligenceSurface.tsx";
import { StakeholderIntelligenceSurface } from "../surfaces/StakeholderIntelligenceSurface.tsx";
import { ConsensusIntelligenceSurface } from "../surfaces/ConsensusIntelligenceSurface.tsx";
import { InstitutionalAlignmentSurface } from "../surfaces/InstitutionalAlignmentSurface.tsx";
import type { DashboardContext } from "../../../lib/ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../../../lib/dashboard/dashboardContextTypes.ts";

export type DashboardAccordionPanelProps = {
  panel: DashboardAccordionPanelContract;
  executiveSummaryContent?: React.ReactNode;
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  objectsInScene?: number;
  timelineActive?: boolean;
  onToggle: (panelId: string) => void;
};

function DashboardAccordionPanelInner(props: DashboardAccordionPanelProps): React.ReactElement {
  const {
    panel,
    executiveSummaryContent,
    dashboardContext,
    normalizedContext,
    selectedObjectId,
    selectedObjectLabel,
    objectsInScene,
    timelineActive,
    onToggle,
  } = props;
  const isExpanded = panel.expansionState === "expanded";

  return (
    <section
      data-nx="dashboard-accordion-panel"
      data-panel-id={panel.panelId}
      data-panel-type={panel.panelType}
      data-expanded={isExpanded ? "1" : "0"}
      style={{
        display: "flex",
        flexDirection: "column",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        minHeight: 0,
      }}
    >
      <button
        type="button"
        data-nx="dashboard-accordion-header"
        onClick={() => onToggle(panel.panelId)}
        aria-expanded={isExpanded}
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: 12,
          alignItems: "center",
          width: "100%",
          padding: "12px 14px",
          background: "rgba(255,255,255,0.03)",
          border: "none",
          color: "inherit",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <div
          data-nx="accordion-icon-area"
          aria-hidden
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {panel.header.iconKey.slice(0, 3)}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--nx-text-primary, #fff)" }}>
              {panel.header.title}
            </span>
            <span
              data-nx="accordion-status-area"
              style={{
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                opacity: 0.75,
                padding: "2px 6px",
                borderRadius: 4,
                background: "rgba(255,255,255,0.06)",
              }}
            >
              {panel.header.status}
            </span>
          </div>
          <div data-nx="accordion-summary-area" style={{ fontSize: 12, opacity: 0.72, lineHeight: 1.4 }}>
            {panel.header.summary}
          </div>
          <DashboardAccordionHeaderSignals signals={panel.visualBundle.headerSignals} />
          <div data-nx="accordion-indicator-area" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {panel.header.indicators.map((indicator) => (
              <span
                key={`${panel.panelId}:${indicator}`}
                style={{
                  fontSize: 10,
                  opacity: 0.6,
                  padding: "1px 5px",
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                {indicator}
              </span>
            ))}
          </div>
        </div>

        <span style={{ fontSize: 12, opacity: 0.65 }}>{isExpanded ? "−" : "+"}</span>
      </button>

      {isExpanded ? (
        <div
          data-nx="dashboard-accordion-body"
          data-nx-future-chart-slot="reserved"
          style={{
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {panel.bodySlot === "executive_delegate" && executiveSummaryContent ? (
            executiveSummaryContent
          ) : panel.bodySlot === "operational_intelligence" ? (
            <OperationalIntelligenceSurface
              dashboardContext={dashboardContext}
              normalizedContext={normalizedContext}
              selectedObjectId={selectedObjectId}
              selectedObjectLabel={selectedObjectLabel}
              objectsInScene={objectsInScene}
              timelineActive={timelineActive}
            />
          ) : panel.bodySlot === "risk_intelligence" ? (
            <RiskIntelligenceSurface
              dashboardContext={dashboardContext}
              normalizedContext={normalizedContext}
              selectedObjectId={selectedObjectId}
              selectedObjectLabel={selectedObjectLabel}
              objectsInScene={objectsInScene}
              timelineActive={timelineActive}
            />
          ) : panel.bodySlot === "timeline_intelligence" ? (
            <TimelineIntelligenceSurface
              dashboardContext={dashboardContext}
              normalizedContext={normalizedContext}
              selectedObjectId={selectedObjectId}
              selectedObjectLabel={selectedObjectLabel}
              objectsInScene={objectsInScene}
              timelineActive={timelineActive}
            />
          ) : panel.bodySlot === "scenario_intelligence" ? (
            <ScenarioIntelligenceSurface
              dashboardContext={dashboardContext}
              normalizedContext={normalizedContext}
              selectedObjectId={selectedObjectId}
              selectedObjectLabel={selectedObjectLabel}
              objectsInScene={objectsInScene}
              timelineActive={timelineActive}
            />
          ) : panel.bodySlot === "war_room_intelligence" ? (
            <WarRoomIntelligenceSurface
              dashboardContext={dashboardContext}
              normalizedContext={normalizedContext}
              selectedObjectId={selectedObjectId}
              selectedObjectLabel={selectedObjectLabel}
              objectsInScene={objectsInScene}
              timelineActive={timelineActive}
            />
          ) : panel.bodySlot === "executive_advisory" ? (
            <ExecutiveAdvisorySurface
              dashboardContext={dashboardContext}
              normalizedContext={normalizedContext}
              selectedObjectId={selectedObjectId}
              selectedObjectLabel={selectedObjectLabel}
              objectsInScene={objectsInScene}
              timelineActive={timelineActive}
            />
          ) : panel.bodySlot === "decision_guidance" ? (
            <DecisionGuidanceSurface
              dashboardContext={dashboardContext}
              normalizedContext={normalizedContext}
              selectedObjectId={selectedObjectId}
              selectedObjectLabel={selectedObjectLabel}
              objectsInScene={objectsInScene}
              timelineActive={timelineActive}
            />
          ) : panel.bodySlot === "governance_intelligence" ? (
            <GovernanceIntelligenceSurface
              dashboardContext={dashboardContext}
              normalizedContext={normalizedContext}
              selectedObjectId={selectedObjectId}
              selectedObjectLabel={selectedObjectLabel}
              objectsInScene={objectsInScene}
              timelineActive={timelineActive}
            />
          ) : panel.bodySlot === "strategic_alignment_intelligence" ? (
            <StrategicAlignmentSurface
              dashboardContext={dashboardContext}
              normalizedContext={normalizedContext}
              selectedObjectId={selectedObjectId}
              selectedObjectLabel={selectedObjectLabel}
              objectsInScene={objectsInScene}
              timelineActive={timelineActive}
            />
          ) : panel.bodySlot === "policy_constraint_intelligence" ? (
            <PolicyConstraintIntelligenceSurface
              dashboardContext={dashboardContext}
              normalizedContext={normalizedContext}
              selectedObjectId={selectedObjectId}
              selectedObjectLabel={selectedObjectLabel}
              objectsInScene={objectsInScene}
              timelineActive={timelineActive}
            />
          ) : panel.bodySlot === "stakeholder_intelligence" ? (
            <StakeholderIntelligenceSurface
              dashboardContext={dashboardContext}
              normalizedContext={normalizedContext}
              selectedObjectId={selectedObjectId}
              selectedObjectLabel={selectedObjectLabel}
              objectsInScene={objectsInScene}
              timelineActive={timelineActive}
            />
          ) : panel.bodySlot === "consensus_intelligence" ? (
            <ConsensusIntelligenceSurface
              dashboardContext={dashboardContext}
              normalizedContext={normalizedContext}
              selectedObjectId={selectedObjectId}
              selectedObjectLabel={selectedObjectLabel}
              objectsInScene={objectsInScene}
              timelineActive={timelineActive}
            />
          ) : panel.bodySlot === "institutional_alignment" ? (
            <InstitutionalAlignmentSurface
              dashboardContext={dashboardContext}
              normalizedContext={normalizedContext}
              selectedObjectId={selectedObjectId}
              selectedObjectLabel={selectedObjectLabel}
              objectsInScene={objectsInScene}
              timelineActive={timelineActive}
            />
          ) : (
            <DashboardSurfaceVisualPanel bundle={panel.visualBundle} />
          )}
        </div>
      ) : null}
    </section>
  );
}

function panelPropsAreEqual(
  previous: DashboardAccordionPanelProps,
  next: DashboardAccordionPanelProps
): boolean {
  return (
    previous.panel.panelId === next.panel.panelId &&
    previous.panel.expansionState === next.panel.expansionState &&
    previous.panel.priority === next.panel.priority &&
    previous.onToggle === next.onToggle &&
    (previous.panel.expansionState === "collapsed" || previous.executiveSummaryContent === next.executiveSummaryContent)
  );
}

export const DashboardAccordionPanel = React.memo(DashboardAccordionPanelInner, panelPropsAreEqual);

export default DashboardAccordionPanel;
