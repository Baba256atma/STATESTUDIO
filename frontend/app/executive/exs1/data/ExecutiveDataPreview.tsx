"use client";

import { MOCK_PREVIEW } from "./ExecutiveDataConfig";
import { cockpit } from "../shell/executiveCockpitTheme";

export function ExecutiveDataPreview() {
  return (
    <div
      data-testid="executive-data-preview"
      style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}
    >
      <p style={{ margin: 0, fontSize: "0.72rem", color: cockpit.muted }}>
        Columns · {MOCK_PREVIEW.columns.join(" · ")}
      </p>
      <p style={{ margin: 0, fontSize: "0.72rem", color: cockpit.textSoft }}>
        Detected Fields · {MOCK_PREVIEW.detectedFields.join(", ")}
      </p>
      <p style={{ margin: 0, fontSize: "0.72rem", color: cockpit.accent }}>
        Estimated Records · {MOCK_PREVIEW.estimatedRecords}
      </p>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.68rem",
          color: cockpit.textSoft,
        }}
      >
        <thead>
          <tr>
            {MOCK_PREVIEW.columns.slice(0, 4).map((col) => (
              <th
                key={col}
                style={{
                  textAlign: "left",
                  padding: "0.3rem",
                  borderBottom: `1px solid ${cockpit.border}`,
                  color: cockpit.lowMuted,
                  fontWeight: 500,
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MOCK_PREVIEW.sampleRows.map((row, idx) => (
            <tr key={idx}>
              {row.slice(0, 4).map((cell, i) => (
                <td
                  key={`${idx}-${i}`}
                  style={{
                    padding: "0.3rem",
                    borderBottom: `1px solid ${cockpit.border}`,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
