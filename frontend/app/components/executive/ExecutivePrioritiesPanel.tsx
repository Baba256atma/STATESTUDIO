"use client";

import React from "react";

import { EmptyStateCard } from "../ui/panelStates";
import { nx, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import type { ExecutiveOSController } from "../../lib/executive/executiveOSTypes";

type ExecutivePrioritiesPanelProps = {
  controller: ExecutiveOSController;
  resolveObjectLabel?: ((id: string | null | undefined) => string | null) | null;
};

export function ExecutivePrioritiesPanel({ controller, resolveObjectLabel }: ExecutivePrioritiesPanelProps) {
  const priorities = controller.state.priorities;
  if (!priorities.length) {
    return <EmptyStateCard text="Priority ranking appears when Nexora can clearly separate what matters now from what can wait." />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={sectionTitleStyle}>Decision Priorities</div>
      {priorities.map((priority, index) => (
        <button
          key={priority.priority_id}
          type="button"
          onClick={() => controller.activatePriority(priority)}
          style={{ ...softCardStyle, width: "100%", textAlign: "left", padding: 10, gap: 6, cursor: "pointer" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div style={{ color: nx.text, fontSize: 13, fontWeight: 700 }}>
              {index + 1}. {priority.title}
            </div>
            <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700 }}>{priority.source.toUpperCase()}</div>
          </div>
          <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{priority.summary}</div>
          {priority.target_object_id ? (
            <div style={{ color: nx.lowMuted, fontSize: 11 }}>
              {resolveObjectLabel?.(priority.target_object_id) ?? "This target is outside the current scene context."}
            </div>
          ) : null}
          <div style={{ display: "flex", gap: 12, color: nx.lowMuted, fontSize: 11 }}>
            <span>Urgency {priority.urgency.toFixed(2)}</span>
            <span>Confidence {priority.confidence.toFixed(2)}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
