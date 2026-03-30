"use client";

import React from "react";

import { EmptyStateCard } from "../ui/panelStates";
import { nx, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import type { ExecutiveOSController } from "../../lib/executive/executiveOSTypes";

type ExecutiveQueuePanelProps = {
  controller: ExecutiveOSController;
  resolveObjectLabel?: ((id: string | null | undefined) => string | null) | null;
};

export function ExecutiveQueuePanel({ controller, resolveObjectLabel }: ExecutiveQueuePanelProps) {
  const queue = controller.state.operatingQueue;
  if (!queue.length) {
    return <EmptyStateCard text="Next actions appear once Nexora can route the current issue into investigation, simulation, or review." />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={sectionTitleStyle}>Next Actions</div>
      {queue.map((item) => (
        <div key={item.item_id} style={{ ...softCardStyle, padding: 10, gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div style={{ color: nx.text, fontSize: 13, fontWeight: 700 }}>{item.title}</div>
            <div style={{ color: item.status === "in_progress" ? "#93c5fd" : nx.lowMuted, fontSize: 11, fontWeight: 700 }}>
              {item.status.replace("_", " ").toUpperCase()}
            </div>
          </div>
          <div style={{ color: nx.muted, fontSize: 12 }}>
            {item.item_type === "focus"
              ? "Investigate the pressure point currently shaping the scene."
              : item.item_type === "comparison"
              ? "Resolve the active tradeoff before committing."
              : item.item_type === "strategy"
              ? "Review and route the leading strategic option."
              : item.item_type === "review"
              ? "Review recent history and learning before acting."
              : "Advance the scenario cycle with a deliberate next move."}
          </div>
          {item.linked_object_id ? (
            <div style={{ color: nx.lowMuted, fontSize: 11 }}>
              {resolveObjectLabel?.(item.linked_object_id) ?? "This target is outside the current scene context."}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
