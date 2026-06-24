"use client";

import React, { useEffect } from "react";

import { devDiagnosticLog } from "../../../lib/runtime/diagnosticSwitch.ts";
import { dashboardVisualTypography } from "../../../lib/dashboard/dashboardVisualTheme.ts";
import { nx } from "../../ui/nexoraTheme.ts";
import {
  objectPanelMetricCardStyle,
  objectPanelSectionLabel,
  objectPanelSectionStyle,
} from "./objectPanelExecutiveStyles.ts";
import {
  NEXORA_OBJECT_INTELLIGENCE_PANEL_LOG_PREFIX,
  WORKSPACE_OBJECT_INTELLIGENCE_PANEL_TAGS,
  resolveWorkspaceObjectIntelligencePanelState,
} from "./workspaceObjectIntelligencePanelRuntime.ts";
import { KpiSummarySection } from "./KpiSummarySection.tsx";
import { OkrSummarySection } from "./OkrSummarySection.tsx";
import { RiskSummarySection } from "./RiskSummarySection.tsx";
import { NEXORA_KPI_PANEL_LOG_PREFIX } from "./kpiSummaryRuntime.ts";
import { NEXORA_OKR_PANEL_LOG_PREFIX } from "./okrSummaryRuntime.ts";
import { NEXORA_RISK_PANEL_LOG_PREFIX } from "./riskSummaryRuntime.ts";

export {
  NEXORA_OBJECT_INTELLIGENCE_PANEL_LOG_PREFIX,
  WORKSPACE_OBJECT_INTELLIGENCE_PANEL_TAGS,
};

export type WorkspaceObjectIntelligencePanelProps = Readonly<{
  workspaceId?: string | null;
  objectId?: string | null;
  objectName?: string | null;
  objectType?: string | null;
}>;

function ScoreCard(props: {
  label: string;
  score: string;
  level: string;
  available: boolean;
}): React.ReactElement {
  return (
    <div style={objectPanelMetricCardStyle}>
      <div style={{ ...dashboardVisualTypography.microLabel, color: nx.lowMuted, fontSize: 9 }}>
        {props.label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 850, lineHeight: 1, color: props.available ? nx.text : nx.muted }}>
        {props.score}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: props.available ? nx.textSoft : nx.lowMuted }}>
        {props.level}
      </div>
    </div>
  );
}

export function WorkspaceObjectIntelligencePanel(
  props: WorkspaceObjectIntelligencePanelProps
): React.ReactElement {
  const state = resolveWorkspaceObjectIntelligencePanelState(props);

  useEffect(() => {
    if (!state.workspaceId || !state.objectId) return;
    devDiagnosticLog("objectIntelligencePanel", NEXORA_OBJECT_INTELLIGENCE_PANEL_LOG_PREFIX, {
      workspaceId: state.workspaceId,
      objectId: state.objectId,
      impactLoaded: state.impact.available,
      dependencyLoaded: state.dependency.available,
      confidenceLoaded: state.confidence.available,
      tags: WORKSPACE_OBJECT_INTELLIGENCE_PANEL_TAGS,
      phase: "DS-3:5",
    });
    if (state.kpiSummary.visible) {
      devDiagnosticLog("kpiPanel", NEXORA_KPI_PANEL_LOG_PREFIX, {
        objectId: state.objectId,
        bindingCount: state.kpiSummary.bindingCount,
        healthProfileCount: state.kpiSummary.healthProfileCount,
        tags: WORKSPACE_OBJECT_INTELLIGENCE_PANEL_TAGS,
        phase: "DS-4:5",
      });
    }
    if (state.okrSummary.visible) {
      devDiagnosticLog("okrPanel", NEXORA_OKR_PANEL_LOG_PREFIX, {
        objectId: state.objectId,
        objectiveCount: state.okrSummary.objectiveCount,
        healthProfileCount: state.okrSummary.healthProfileCount,
        tags: WORKSPACE_OBJECT_INTELLIGENCE_PANEL_TAGS,
        phase: "DS-5:5",
      });
    }
    if (state.riskSummary.visible) {
      devDiagnosticLog("riskPanel", NEXORA_RISK_PANEL_LOG_PREFIX, {
        objectId: state.objectId,
        riskCount: state.riskSummary.bindingCount,
        severityProfileCount: state.riskSummary.severityProfileCount,
        tags: WORKSPACE_OBJECT_INTELLIGENCE_PANEL_TAGS,
        phase: "DS-6:5",
      });
    }
  }, [state]);

  return (
    <section data-nx="workspace-object-intelligence-panel" style={{ ...objectPanelSectionStyle, padding: 12 }}>
      <div style={objectPanelSectionLabel}>Object Intelligence</div>
      <div style={{ display: "grid", gap: 4, marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: nx.text, lineHeight: 1.25 }}>
          {state.objectName || "Selected Object"}
        </div>
        <div style={{ fontSize: 11, color: nx.muted, lineHeight: 1.25 }}>{state.objectType || "Object"}</div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 8,
        }}
      >
        <ScoreCard
          label="Impact"
          score={state.impact.score}
          level={state.impact.level}
          available={state.impact.available}
        />
        <ScoreCard
          label="Dependency"
          score={state.dependency.score}
          level={state.dependency.level}
          available={state.dependency.available}
        />
        <ScoreCard
          label="Confidence"
          score={state.confidence.score}
          level={state.confidence.level}
          available={state.confidence.available}
        />
      </div>

      <div style={{ marginTop: 12, borderTop: `1px solid ${nx.borderSoft}`, paddingTop: 10 }}>
        <div style={objectPanelSectionLabel}>Why?</div>
        {state.reasons.length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: 16, display: "grid", gap: 6, color: nx.textSoft, fontSize: 11, lineHeight: 1.4 }}>
            {state.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        ) : (
          <div style={{ color: nx.muted, fontSize: 11, lineHeight: 1.45 }}>
            {state.hasAnyIntelligence
              ? "Object intelligence is partially available."
              : "Object intelligence not available."}
          </div>
        )}
      </div>

      <KpiSummarySection summary={state.kpiSummary} />
      <OkrSummarySection summary={state.okrSummary} />
      <RiskSummarySection summary={state.riskSummary} />
    </section>
  );
}

export default WorkspaceObjectIntelligencePanel;
