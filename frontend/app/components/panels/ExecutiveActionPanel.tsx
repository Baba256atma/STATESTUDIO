"use client";

import React, { useEffect, useState } from "react";

import {
  emitObjectPanelActionRequest,
  OBJECT_PANEL_DASHBOARD_ACTIONS,
  objectPanelDashboardActionLabel,
  type ObjectPanelDashboardAction,
} from "../../lib/object-panel/objectPanelActionRouterContract";
import {
  emitExecutiveObjectPanelAction,
  EXECUTIVE_ADVANCED_ACTIONS,
  type ExecutiveActionPanelModel,
} from "../../lib/object-panel/executiveActionPanelContract";
import {
  buildObjectPanelExecutiveViewModel,
  type ObjectPanelExecutiveViewModel,
} from "../../lib/object-panel/objectPanelExecutiveViewModel";
import { traceObjectPanelPhase } from "../../lib/object-panel/objectPanelDiagnostics";
import { dashboardVisualSpacing } from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";
import { objectPanelActionButtonStyle, objectPanelSectionLabel, objectPanelSectionStyle } from "./object-panel/objectPanelExecutiveStyles";
import { ObjectPanelExecutiveHeader } from "./object-panel/ObjectPanelExecutiveHeader";
import { ObjectPanelExecutiveSummary } from "./object-panel/ObjectPanelExecutiveSummary";
import { ObjectPanelInsightsSurface } from "./object-panel/ObjectPanelInsightsSurface";
import { ObjectPanelRelationshipSummary } from "./object-panel/ObjectPanelRelationshipSummary";
import { ObjectPanelSignalsGrid } from "./object-panel/ObjectPanelSignalsGrid";

type Props = {
  model: ExecutiveActionPanelModel;
  focusModeActive?: boolean;
  view?: ObjectPanelExecutiveViewModel | null;
};

const ACTION_ICONS: Readonly<Record<ObjectPanelDashboardAction, string>> = Object.freeze({
  focus: "◎",
  analyze: "⧉",
  compare: "⇄",
  scenario: "◇",
  war_room: "⚑",
});

function ActionsSection(props: {
  model: ExecutiveActionPanelModel;
  focusModeActive: boolean;
}): React.ReactElement {
  useEffect(() => {
    traceObjectPanelPhase("actions");
  }, []);

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const objectId = props.model.objectId.trim();

  return (
    <section data-nx="object-panel-actions" style={{ ...objectPanelSectionStyle, padding: 12 }}>
      <div style={objectPanelSectionLabel}>Object Actions</div>
      <div
        role="group"
        aria-label="Executive object actions"
        style={{
          marginTop: dashboardVisualSpacing.sm,
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 8,
        }}
      >
        {OBJECT_PANEL_DASHBOARD_ACTIONS.map((entry) => {
          const isFocus = entry === "focus";
          const active = isFocus && props.focusModeActive;
          const label = objectPanelDashboardActionLabel(entry);
          return (
            <button
              key={entry}
              type="button"
              aria-pressed={active}
              aria-label={label}
              style={objectPanelActionButtonStyle(isFocus, active)}
              onClick={() =>
                emitObjectPanelActionRequest({
                  action: entry as ObjectPanelDashboardAction,
                  objectId,
                  objectName: props.model.objectName,
                })
              }
            >
              <span aria-hidden>{ACTION_ICONS[entry]}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-expanded={advancedOpen}
        onClick={() => setAdvancedOpen((value) => !value)}
        style={{
          width: "100%",
          marginTop: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          border: "none",
          background: "transparent",
          color: nx.muted,
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <span>Advanced Actions</span>
        <span aria-hidden>{advancedOpen ? "▾" : "▸"}</span>
      </button>
      {advancedOpen ? (
        <div
          style={{
            marginTop: 10,
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 8,
          }}
        >
          {EXECUTIVE_ADVANCED_ACTIONS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              aria-label={entry.label}
              style={objectPanelActionButtonStyle(false)}
              onClick={() => emitExecutiveObjectPanelAction(entry.id, objectId)}
            >
              {entry.label}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function ExecutiveActionPanel({ model, focusModeActive = false, view }: Props): React.ReactElement {
  const executiveView = view ?? buildObjectPanelExecutiveViewModel({ model });

  return (
    <div
      data-nx="executive-action-panel"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
      }}
    >
      <ObjectPanelExecutiveHeader view={executiveView} />
      <ObjectPanelExecutiveSummary view={executiveView} />
      <ObjectPanelSignalsGrid view={executiveView} />
      <ActionsSection model={model} focusModeActive={focusModeActive} />
      <ObjectPanelInsightsSurface view={executiveView} />
      <ObjectPanelRelationshipSummary view={executiveView} />
    </div>
  );
}

export default ExecutiveActionPanel;
