/**
 * Phase C — Structured connector validation (no business calculations).
 */

import type {
  ConnectorValidationMessage,
  ConnectorValidationResult,
  DiscoveredSchema,
} from "./ExecutiveConnectorContracts";

export function validateDiscoveredSchema(
  schema: DiscoveredSchema | null,
  options?: { readonly requireFormat?: "csv" | "any"; readonly rawLabel?: string },
): ConnectorValidationResult {
  const messages: ConnectorValidationMessage[] = [];

  if (!schema || schema.columns.length === 0) {
    messages.push({
      code: "EmptyDataset",
      severity: "error",
      message: "Dataset is empty — no columns discovered.",
    });
    return { ok: false, messages };
  }

  if (schema.rowCount === 0) {
    messages.push({
      code: "EmptyDataset",
      severity: "error",
      message: "Dataset contains headers but no rows.",
    });
  }

  const missing = schema.columns.filter((c) => !c.name.trim());
  if (missing.length > 0) {
    messages.push({
      code: "MissingColumns",
      severity: "error",
      message: "One or more column names are missing.",
    });
  }

  const unknownTypes = schema.columns.filter((c) => c.type === "unknown");
  if (unknownTypes.length > 0) {
    messages.push({
      code: "InvalidTypes",
      severity: "warning",
      message: `${unknownTypes.length} column(s) have undetermined types.`,
    });
  }

  for (const key of schema.primaryKeyCandidates) {
    const index = schema.columns.findIndex((c) => c.name === key);
    if (index < 0) continue;
    const values = schema.sampleRows.map((row) => row[index] ?? "");
    const nonEmpty = values.filter((v) => v.trim());
    if (new Set(nonEmpty).size !== nonEmpty.length) {
      messages.push({
        code: "DuplicateIds",
        severity: "warning",
        message: `Primary key candidate "${key}" has duplicate sample values.`,
      });
    }
  }

  const label = (options?.rawLabel ?? schema.sourceLabel).toLowerCase();
  if (options?.requireFormat === "csv" && !label.includes(".csv") && !label.includes("csv")) {
    messages.push({
      code: "UnsupportedFormat",
      severity: "warning",
      message: "Source label does not look like a CSV file.",
    });
  }

  const ok = !messages.some((m) => m.severity === "error");
  return { ok, messages };
}
