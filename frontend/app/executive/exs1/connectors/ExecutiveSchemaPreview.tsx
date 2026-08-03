"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import type {
  ConnectorValidationResult,
  DiscoveredSchema,
  SchemaPreviewStats,
} from "./ExecutiveConnectorContracts";

type Props = {
  readonly schema: DiscoveredSchema | null;
  readonly stats: SchemaPreviewStats | null;
  readonly validation: ConnectorValidationResult | null;
};

/**
 * Schema preview — columns, 10 sample rows, types, statistics.
 */
export function ExecutiveSchemaPreview({ schema, stats, validation }: Props) {
  if (!schema) {
    return (
      <div
        data-testid="executive-schema-preview-empty"
        style={{ color: cockpit.muted, fontSize: "0.74rem" }}
      >
        Connect a CSV source to discover schema.
      </div>
    );
  }

  return (
    <section
      data-testid="executive-schema-preview"
      style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}
    >
      <div>
        <strong style={{ color: cockpit.accent, fontSize: "0.78rem" }}>
          {schema.sourceLabel}
        </strong>
        <p style={{ margin: "0.25rem 0 0", fontSize: "0.7rem", color: cockpit.muted }}>
          {stats?.columnCount ?? schema.columns.length} columns ·{" "}
          {stats?.rowCount ?? schema.rowCount} rows ·{" "}
          {stats?.numericColumns ?? 0} numeric · PK candidates{" "}
          {schema.primaryKeyCandidates.join(", ") || "—"}
        </p>
      </div>

      {validation?.messages.length ? (
        <ul
          data-testid="executive-connector-validation"
          style={{
            margin: 0,
            padding: "0.45rem 0.55rem",
            listStyle: "none",
            borderRadius: cockpit.radius.sm,
            border: `1px solid ${cockpit.border}`,
            background: cockpit.panelSoft,
          }}
        >
          {validation.messages.map((message) => (
            <li
              key={`${message.code}-${message.message}`}
              style={{
                fontSize: "0.68rem",
                color:
                  message.severity === "error"
                    ? "#F97066"
                    : message.severity === "warning"
                      ? "#FDB022"
                      : cockpit.muted,
                marginBottom: "0.2rem",
              }}
            >
              {message.code} · {message.message}
            </li>
          ))}
        </ul>
      ) : null}

      <div style={{ overflowX: "auto" }}>
        <table
          data-testid="executive-schema-sample-table"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.64rem",
            color: cockpit.textSoft,
          }}
        >
          <thead>
            <tr>
              {schema.columns.map((column) => (
                <th
                  key={column.name}
                  style={{
                    textAlign: "left",
                    padding: "0.3rem 0.35rem",
                    borderBottom: `1px solid ${cockpit.border}`,
                    color: cockpit.accent,
                    fontWeight: 550,
                    whiteSpace: "nowrap",
                  }}
                >
                  {column.name}
                  <span style={{ display: "block", color: cockpit.lowMuted }}>
                    {column.type}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schema.sampleRows.slice(0, 10).map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={`cell-${rowIndex}-${cellIndex}`}
                    style={{
                      padding: "0.25rem 0.35rem",
                      borderBottom: `1px solid ${cockpit.border}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cell || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
