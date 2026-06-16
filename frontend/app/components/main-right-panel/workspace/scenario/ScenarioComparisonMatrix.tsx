"use client";

import React from "react";

import type { ScenarioComparisonSurface } from "../../../../lib/ui/mrpWorkspace/scenario/scenarioComparisonContract.ts";
import {
  scenarioCardDetailStyle,
  scenarioComparisonMatrixCellStyle,
  scenarioComparisonMatrixHeaderCellStyle,
  scenarioComparisonMatrixShellStyle,
  scenarioComparisonMatrixTableStyle,
  scenarioSectionLabelStyle,
  scenarioVisualSpacing,
} from "../../../../lib/ui/mrpWorkspace/scenario/scenarioVisualContract.ts";

export type ScenarioComparisonMatrixProps = Readonly<{
  comparison: ScenarioComparisonSurface;
  phase: "loading" | "ready" | "empty";
}>;

export function ScenarioComparisonMatrix(
  props: ScenarioComparisonMatrixProps
): React.ReactElement {
  const loading = props.phase === "loading";
  const { matrix } = props.comparison;

  return (
    <section
      data-nx="scenario-comparison-matrix"
      data-scenario-dashboard-context={props.comparison.dashboardContext}
      aria-label="Scenario comparison matrix"
      style={scenarioComparisonMatrixShellStyle()}
    >
      <div style={scenarioSectionLabelStyle()}>Scenario Comparison Matrix</div>
      {loading || matrix.columns.length === 0 ? (
        <p style={scenarioCardDetailStyle()}>
          {loading
            ? "Loading comparison matrix…"
            : "Generate executive scenarios to compare alternative futures."}
        </p>
      ) : (
        <table style={scenarioComparisonMatrixTableStyle()}>
          <thead>
            <tr>
              <th style={scenarioComparisonMatrixHeaderCellStyle()}>Section</th>
              {matrix.columns.map((column) => (
                <th
                  key={column.id}
                  style={scenarioComparisonMatrixHeaderCellStyle()}
                  data-scenario-comparison-column={column.id}
                >
                  <div>{column.label}</div>
                  <div style={{ opacity: 0.72, fontWeight: 400 }}>{column.title}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.rows.map((row) => (
              <tr key={row.id} data-scenario-comparison-row={row.id}>
                <th
                  style={{
                    ...scenarioComparisonMatrixHeaderCellStyle(),
                    fontWeight: 500,
                  }}
                >
                  {row.label}
                </th>
                {matrix.columns.map((column) => (
                  <td
                    key={`${row.id}:${column.id}`}
                    style={scenarioComparisonMatrixCellStyle()}
                    data-scenario-comparison-cell={`${row.id}:${column.id}`}
                  >
                    {row.cells[column.id]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && matrix.columns.length > 0 ? (
        <p style={{ ...scenarioCardDetailStyle(), marginTop: scenarioVisualSpacing.fieldGap }}>
          Read-only comparison for Scenario A, B, and C — no decision execution.
        </p>
      ) : null}
    </section>
  );
}

export default ScenarioComparisonMatrix;
