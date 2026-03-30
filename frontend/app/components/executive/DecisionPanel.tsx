"use client";

import React from "react";
import { cardStyle, nx, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";

type ExecutiveAction = {
  title: string;
  effect: string;
  targets?: string | null;
};

type DecisionPanelProps = {
  actions: ExecutiveAction[];
  onOpenWarRoom?: (() => void) | null;
  titleLabel?: string;
  emptyText?: string;
  warRoomLabel?: string;
};

export function DecisionPanel(props: DecisionPanelProps) {
  return (
    <div style={{ ...cardStyle, gap: 14, padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
        <div style={sectionTitleStyle}>{props.titleLabel ?? "Recommended Actions"}</div>
        {props.onOpenWarRoom ? (
          <button
            type="button"
            onClick={props.onOpenWarRoom}
            style={{
              height: 30,
              padding: "0 10px",
              borderRadius: 10,
              border: "1px solid rgba(96,165,250,0.28)",
              background: "rgba(59,130,246,0.16)",
              color: "#dbeafe",
              fontSize: 11,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {props.warRoomLabel ?? "Open War Room"}
          </button>
        ) : null}
      </div>

      {props.actions.length ? (
        props.actions.slice(0, 3).map((action, index) => (
          <div
            key={`${action.title}-${index}`}
            style={{
              ...softCardStyle,
              gap: 8,
              padding: 12,
              border: index === 0 ? "1px solid rgba(96,165,250,0.26)" : "1px solid rgba(148,163,184,0.16)",
              background: index === 0 ? "linear-gradient(180deg, rgba(15,23,42,0.82), rgba(2,6,23,0.5))" : softCardStyle.background,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
              <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 800 }}>{action.title}</div>
              <div style={{ color: "#93c5fd", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                {index === 0 ? "Priority" : "Next Move"}
              </div>
            </div>
            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{action.effect}</div>
            {action.targets ? <div style={{ color: "#93c5fd", fontSize: 11 }}>{action.targets}</div> : null}
          </div>
        ))
      ) : (
        <div style={{ ...softCardStyle, color: nx.lowMuted, fontSize: 12, padding: 12 }}>
          {props.emptyText ?? "Run a scenario or ask what action reduces current pressure to generate the next executive move."}
        </div>
      )}
    </div>
  );
}
