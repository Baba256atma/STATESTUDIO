"use client";

import React from "react";

import { nx, softCardStyle } from "../ui/nexoraTheme";
import { TimelineNode, type DecisionTimelineStage } from "./TimelineNode";
import { TimelineTransition, type DecisionTimelineTransitionData } from "./TimelineTransition";

type DecisionTimelineProps = {
  stages: DecisionTimelineStage[];
  transitions: DecisionTimelineTransitionData[];
  activeStageId?: string | null;
  onSelectStage?: ((stage: DecisionTimelineStage) => void) | null;
  emptyText?: string;
};

export function DecisionTimeline(props: DecisionTimelineProps) {
  if (!props.stages.length) {
    return (
      <div style={{ ...softCardStyle, padding: 12, gap: 6 }}>
        <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Decision Timeline
        </div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
          {props.emptyText ?? "No timeline available. Run a simulation to see how the system evolves."}
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 10, border: "1px solid rgba(96,165,250,0.16)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Decision Timeline
        </div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
          Before, after, and alternative path snapshots to show how this decision changes the system over time.
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr)",
          gap: 8,
          alignItems: "stretch",
        }}
      >
        {props.stages.map((stage, index) => (
          <React.Fragment key={stage.id}>
            <TimelineNode
              stage={stage}
              active={props.activeStageId === stage.id}
              onSelect={props.onSelectStage ?? null}
            />
            {index < props.transitions.length ? (
              <TimelineTransition transition={props.transitions[index]} />
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
