/**
 * Phase C — Schema discovery helpers (connector-only, no semantic mapping).
 */

import type {
  ConnectorColumnType,
  DiscoveredColumn,
  DiscoveredSchema,
  SchemaPreviewStats,
} from "./ExecutiveConnectorContracts";

export function detectColumnType(values: readonly string[]): ConnectorColumnType {
  const nonEmpty = values.filter((v) => v.trim().length > 0);
  if (nonEmpty.length === 0) return "unknown";
  if (nonEmpty.every((v) => /^(true|false|yes|no)$/i.test(v.trim()))) {
    return "boolean";
  }
  if (nonEmpty.every((v) => !Number.isNaN(Number(v.replace(/,/g, ""))))) {
    return "number";
  }
  if (
    nonEmpty.every((v) => !Number.isNaN(Date.parse(v)) && /[-/]/.test(v))
  ) {
    return "date";
  }
  return "string";
}

export function buildDiscoveredSchema(input: {
  readonly headers: readonly string[];
  readonly rows: readonly (readonly string[])[];
  readonly sourceLabel: string;
}): DiscoveredSchema {
  const sampleRows = input.rows.slice(0, 10);
  const columns: DiscoveredColumn[] = input.headers.map((name, index) => {
    const samples = sampleRows.map((row) => row[index] ?? "");
    return {
      name,
      type: detectColumnType(samples),
      nullable: samples.some((v) => v.trim() === ""),
      sampleValues: samples.slice(0, 3),
    };
  });

  const primaryKeyCandidates = columns
    .filter((column) => {
      const values = sampleRows.map(
        (row) => row[input.headers.indexOf(column.name)] ?? "",
      );
      const unique = new Set(values.filter(Boolean));
      return (
        unique.size === values.filter(Boolean).length &&
        /id$/i.test(column.name)
      );
    })
    .map((c) => c.name);

  return {
    columns,
    primaryKeyCandidates,
    rowCount: input.rows.length,
    sampleRows,
    sourceLabel: input.sourceLabel,
  };
}

export function computePreviewStats(schema: DiscoveredSchema): SchemaPreviewStats {
  const nullishSamples = schema.sampleRows.reduce(
    (count, row) => count + row.filter((cell) => cell.trim() === "").length,
    0,
  );
  return {
    columnCount: schema.columns.length,
    rowCount: schema.rowCount,
    nullishSamples,
    numericColumns: schema.columns.filter((c) => c.type === "number").length,
  };
}

/** Minimal CSV parser — quotes supported for reference CSV connector. */
export function parseCsvText(text: string): {
  readonly headers: string[];
  readonly rows: string[][];
} {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  function splitLine(line: string): string[] {
    const cells: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i]!;
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }
      if (ch === "," && !inQuotes) {
        cells.push(current.trim());
        current = "";
        continue;
      }
      current += ch;
    }
    cells.push(current.trim());
    return cells;
  }

  const headers = splitLine(lines[0]!);
  const rows = lines.slice(1).map(splitLine);
  return { headers, rows };
}
