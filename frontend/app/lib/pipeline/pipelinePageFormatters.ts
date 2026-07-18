/**
 * UI-PIPE-1:1 — Pipeline Page Formatters.
 *
 * Pure display formatting helpers for pipeline summaries and cells.
 * Ownership: owned exclusively by UI-PIPE-1.
 */

import type { ParserDiagnostic, ProvisionalPrimitiveType } from "../integrations/csvParserTypes.ts";
import type { PipelineHeaderStatus, PipelinePageStatus } from "./pipelinePageTypes.ts";

export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatPrimitiveType(type: ProvisionalPrimitiveType): string {
  return type;
}

export function formatSampleValues(values: readonly string[], limit = 3): string {
  return values
    .slice(0, limit)
    .map((v) => (v.length === 0 ? "(empty)" : v))
    .join(", ");
}

export function formatEmptyCell(value: string): string {
  return value.length === 0 ? "—" : value;
}

export function formatDiagnosticLocation(diagnostic: ParserDiagnostic): string {
  const parts: string[] = [];
  if (diagnostic.field) {
    parts.push(`field ${diagnostic.field}`);
  }
  if (diagnostic.rowIndex !== null) {
    parts.push(`row ${diagnostic.rowIndex}`);
  }
  if (diagnostic.columnIndex !== null) {
    parts.push(`col ${diagnostic.columnIndex}`);
  }
  return parts.join(" · ");
}

export function toHeaderStatus(status: PipelinePageStatus): PipelineHeaderStatus {
  switch (status) {
    case "Idle":
      return "No Input";
    case "InputReady":
      return "Ready";
    case "Validating":
    case "ReadingFile":
    case "Parsing":
      return "Parsing";
    case "PreviewReady":
      return "Preview Ready";
    case "PreviewWithWarnings":
      return "Warnings";
    case "Failed":
      return "Failed";
  }
}

export function formatInputModeLabel(mode: string): string {
  switch (mode) {
    case "CsvFile":
      return "CSV File";
    case "CsvText":
      return "CSV Text";
    case "ManualTable":
      return "Manual Table";
    default:
      return mode;
  }
}
