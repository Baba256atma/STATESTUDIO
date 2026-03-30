"use client";

import React from "react";

import { EmptyStateCard } from "../ui/panelStates";
import { nx, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import type { ExecutiveOSController } from "../../lib/executive/executiveOSTypes";

type ExecutiveReviewPanelProps = {
  controller: ExecutiveOSController;
};

export function ExecutiveReviewPanel({ controller }: ExecutiveReviewPanelProps) {
  const history = controller.state.recentHistory;
  const learning = controller.state.learningSummary;

  if (!history.length && !learning) {
    return <EmptyStateCard text="Review and learning will appear after Nexora has recent scenarios, outcomes, or repeated patterns to revisit." />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={sectionTitleStyle}>Review & Learning</div>
      {learning ? (
        <div style={{ ...softCardStyle, padding: 10, gap: 6 }}>
          <div style={{ color: nx.text, fontSize: 13, fontWeight: 700 }}>{learning.headline}</div>
          <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{learning.summary}</div>
          {learning.top_signal ? <div style={{ color: nx.lowMuted, fontSize: 11 }}>{learning.top_signal}</div> : null}
        </div>
      ) : null}
      {history.map((item) => (
        <button
          key={item.item_id}
          type="button"
          onClick={() => controller.reviewRecord(item.linked_record_id)}
          style={{ ...softCardStyle, width: "100%", textAlign: "left", padding: 10, gap: 6, cursor: "pointer" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div style={{ color: nx.text, fontSize: 13, fontWeight: 700 }}>{item.title}</div>
            <div style={{ color: nx.lowMuted, fontSize: 11, fontWeight: 700 }}>{item.type.toUpperCase()}</div>
          </div>
            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{item.summary}</div>
        </button>
      ))}
    </div>
  );
}
