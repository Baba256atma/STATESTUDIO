"use client";

import React from "react";
import { nx, softCardStyle } from "../ui/nexoraTheme";
import type { PipelineStepView } from "../../lib/pipeline/pipelinePageTypes";

export interface PipelineFlowProps {
  readonly steps: readonly PipelineStepView[];
}

const statusColor = (status: PipelineStepView["status"]): string => {
  switch (status) {
    case "Active":
      return nx.accent;
    case "Complete":
      return nx.success;
    case "Warning":
      return nx.warning;
    case "Failed":
      return nx.risk;
    default:
      return nx.muted;
  }
};

export function PipelineFlow({ steps }: PipelineFlowProps) {
  return (
    <nav aria-label="Pipeline progress" style={{ ...softCardStyle, padding: "12px 16px" }}>
      <ol
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          listStyle: "none",
          margin: 0,
          padding: 0,
          alignItems: "center",
        }}
      >
        {steps.map((step, index) => (
          <li key={step.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              aria-current={step.status === "Active" ? "step" : undefined}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 10px",
                borderRadius: 6,
                border: `1px solid ${statusColor(step.status)}`,
                color: nx.textStrong,
                background: nx.bgControl,
                fontSize: 13,
                fontWeight: step.status === "Active" ? 600 : 500,
              }}
            >
              <span aria-hidden="true" style={{ color: statusColor(step.status) }}>
                ●
              </span>
              <span>{step.label}</span>
              <span style={{ color: nx.muted, fontSize: 11 }}>({step.status})</span>
            </span>
            {index < steps.length - 1 ? (
              <span aria-hidden="true" style={{ color: nx.muted }}>
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
