"use client";

import React from "react";

import type {
  WarRoomActionItem,
  WarRoomActionPlanSurface,
} from "../../../../lib/ui/mrpWorkspace/warRoom/warRoomActionPlanContract.ts";
import {
  warRoomActionPlanItemRowStyle,
  warRoomActionPlanMetaLabelStyle,
  warRoomActionPlanMetaValueStyle,
  warRoomActionPlanPanelShellStyle,
  warRoomActionPlanSectionShellStyle,
  warRoomCardDetailStyle,
  warRoomSectionLabelStyle,
  warRoomVisualColors,
  warRoomVisualSpacing,
} from "../../../../lib/ui/mrpWorkspace/warRoom/warRoomVisualContract.ts";

export type ActionPlanItemRowProps = Readonly<{
  item: WarRoomActionItem;
}>;

function resolvePriorityAccent(priority: WarRoomActionItem["priority"]): string {
  if (priority === "critical") return warRoomVisualColors.critical;
  if (priority === "high") return warRoomVisualColors.warning;
  if (priority === "medium") return warRoomVisualColors.accent;
  return warRoomVisualColors.textSoft;
}

export function ActionPlanItemRow(props: ActionPlanItemRowProps): React.ReactElement {
  const { item } = props;

  return (
    <article
      data-nx="war-room-action-item"
      data-war-room-action-section={item.sectionId}
      data-war-room-action-status={item.status}
      style={warRoomActionPlanItemRowStyle(item.status)}
    >
      <div style={{ minWidth: 0 }}>
        <div style={warRoomActionPlanMetaLabelStyle()}>Title</div>
        <div style={warRoomActionPlanMetaValueStyle()}>{item.title}</div>
      </div>
      <div>
        <div style={warRoomActionPlanMetaLabelStyle()}>Owner</div>
        <div style={warRoomActionPlanMetaValueStyle()}>{item.owner}</div>
      </div>
      <div>
        <div style={warRoomActionPlanMetaLabelStyle()}>Priority</div>
        <div style={warRoomActionPlanMetaValueStyle(resolvePriorityAccent(item.priority))}>
          {item.priority}
        </div>
      </div>
      <div>
        <div style={warRoomActionPlanMetaLabelStyle()}>Status</div>
        <div style={warRoomActionPlanMetaValueStyle()}>{item.status}</div>
      </div>
    </article>
  );
}

export type ActionPlanPanelProps = Readonly<{
  actionPlan: WarRoomActionPlanSurface;
  phase: "loading" | "ready" | "empty";
}>;

export function ActionPlanPanel(props: ActionPlanPanelProps): React.ReactElement {
  const loading = props.phase === "loading";
  const totalItems = props.actionPlan.sections.reduce(
    (count, section) => count + section.items.length,
    0
  );

  return (
    <section
      data-nx="war-room-action-plan-panel"
      data-war-room-dashboard-context={props.actionPlan.dashboardContext}
      data-war-room-action-plan="true"
      aria-label="War Room action plan"
      style={warRoomActionPlanPanelShellStyle()}
    >
      <div style={warRoomSectionLabelStyle()}>Action Plan Panel</div>
      <p style={warRoomCardDetailStyle()}>{props.actionPlan.purpose}</p>

      {loading ? (
        <p style={warRoomCardDetailStyle()}>Loading action plan…</p>
      ) : totalItems === 0 ? (
        <p style={warRoomCardDetailStyle()}>
          Accept a strategy or scenario handoff to populate Immediate, Near-Term, and Long-Term
          actions.
        </p>
      ) : (
        props.actionPlan.sections.map((section) => (
          <div
            key={section.id}
            data-war-room-action-plan-section={section.id}
            style={warRoomActionPlanSectionShellStyle()}
          >
            <div style={warRoomSectionLabelStyle()}>{section.label}</div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: warRoomVisualSpacing.rowGap,
              }}
            >
              {section.items.map((item) => (
                <ActionPlanItemRow key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  );
}

export default ActionPlanPanel;
