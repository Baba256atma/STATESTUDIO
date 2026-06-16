"use client";

import React from "react";

import {
  RISK_TOP_RISKS_COLUMN_LABELS,
  type RiskTopRiskRow,
} from "../../../../lib/ui/mrpWorkspace/risk/riskVisualSurfaceContract.ts";
import {
  riskSectionLabelStyle,
  riskTopRisksCellStyle,
  riskTopRisksEmptyStyle,
  riskTopRisksHeaderCellStyle,
  riskTopRisksHeaderRowStyle,
  riskTopRisksListStyle,
  riskTopRisksRowStyle,
  riskTopRisksSeverityCellStyle,
} from "../../../../lib/ui/mrpWorkspace/risk/riskVisualContract.ts";

export type RiskTopRisksListProps = Readonly<{
  rows: readonly RiskTopRiskRow[];
  emptyMessage: string | null;
  phase: "loading" | "ready" | "empty";
}>;

type ColumnKey = keyof typeof RISK_TOP_RISKS_COLUMN_LABELS;

const COLUMN_KEYS = Object.freeze([
  "risk",
  "severity",
  "impact",
] as const satisfies readonly ColumnKey[]);

export function RiskTopRisksList(props: RiskTopRisksListProps): React.ReactElement {
  const loading = props.phase === "loading";
  const showEmpty = !loading && props.rows.length === 0;

  return (
    <section
      data-nx="risk-top-risks-list"
      data-risk-visual-section="top_risks"
      aria-label="Top risks"
      style={riskTopRisksListStyle()}
    >
      <div style={riskSectionLabelStyle()}>Top Risks</div>

      <div style={riskTopRisksHeaderRowStyle()} aria-hidden="true">
        {COLUMN_KEYS.map((columnKey) => (
          <div key={columnKey} style={riskTopRisksHeaderCellStyle()}>
            {RISK_TOP_RISKS_COLUMN_LABELS[columnKey]}
          </div>
        ))}
      </div>

      {loading ? (
        <p style={riskTopRisksEmptyStyle()}>Loading…</p>
      ) : showEmpty ? (
        <p style={riskTopRisksEmptyStyle()}>{props.emptyMessage ?? "No prioritized risks."}</p>
      ) : (
        props.rows.map((row, index) => (
          <div
            key={`${row.risk}:${row.severity}:${index}`}
            data-risk-top-risk-row={index}
            style={{
              ...riskTopRisksRowStyle(),
              borderBottom:
                index === props.rows.length - 1 ? "none" : riskTopRisksRowStyle().borderBottom,
            }}
          >
            <div style={riskTopRisksCellStyle()}>{row.risk}</div>
            <div style={riskTopRisksSeverityCellStyle(row.severity)}>{row.severity}</div>
            <div style={riskTopRisksCellStyle()}>{row.impact}</div>
          </div>
        ))
      )}
    </section>
  );
}

export default RiskTopRisksList;
