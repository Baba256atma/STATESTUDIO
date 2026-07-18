/**
 * INT-1:2 — CSV Record Parser.
 *
 * Controlled RFC-4180-inspired state-machine parser supporting quoted fields,
 * escaped quotes, newlines inside quotes, CRLF/LF, empty cells, and blank
 * records. Never uses naive split(","). Parsing is bounded by CsvParserLimitValues.
 *
 * Ownership: owned exclusively by INT-1:2.
 */

import {
  buildParserDiagnostic,
  PARSER_DIAGNOSTIC_CODES,
} from "./csvParserDiagnostics.ts";
import {
  CsvParserLimitValues,
  type ParsedRecord,
  type ParserDiagnostic,
  type RecordParseResult,
} from "./csvParserTypes.ts";

type ParserState = "FieldStart" | "Unquoted" | "Quoted" | "QuoteSeen";

/**
 * Parse delimiter-separated records from text using a state machine.
 * Stops safely when a blocking limit is reached.
 */
export function parseCsvRecords(
  text: string,
  delimiter: string,
): RecordParseResult {
  const diagnostics: ParserDiagnostic[] = [];
  const records: ParsedRecord[] = [];
  const limits = CsvParserLimitValues;

  if (text.length > limits.maximumInputCharacterCount) {
    diagnostics.push(buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.INPUT_LIMIT_EXCEEDED));
    return Object.freeze({
      records: Object.freeze([]),
      truncated: false,
      diagnostics: Object.freeze(diagnostics),
      blocked: true,
    });
  }

  let state: ParserState = "FieldStart";
  let field = "";
  let fields: string[] = [];
  let recordStart = 0;
  let i = 0;
  let truncated = false;
  let blocked = false;
  let unclosedQuote = false;

  const emitRecord = (endIndex: number): boolean => {
    // Preserve trailing empty field if the record ended on a delimiter.
    const recordDiagnostics: ParserDiagnostic[] = [];
    const recordLength = endIndex - recordStart;
    if (recordLength > limits.maximumRecordCharacterCount) {
      diagnostics.push(
        buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.RECORD_LIMIT_EXCEEDED, {
          rowIndex: records.length,
        }),
      );
      blocked = true;
      return false;
    }
    for (let f = 0; f < fields.length; f += 1) {
      if (fields[f]!.length > limits.maximumFieldCharacterCount) {
        diagnostics.push(
          buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.FIELD_LIMIT_EXCEEDED, {
            rowIndex: records.length,
            columnIndex: f,
          }),
        );
        blocked = true;
        return false;
      }
    }
    if (fields.length > limits.maximumParsedColumns) {
      diagnostics.push(
        buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.COLUMN_LIMIT_EXCEEDED, {
          rowIndex: records.length,
        }),
      );
      blocked = true;
      return false;
    }
    if (unclosedQuote) {
      recordDiagnostics.push(
        buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.UNCLOSED_QUOTED_FIELD, {
          rowIndex: records.length,
        }),
      );
    }
    records.push(
      Object.freeze({
        fields: Object.freeze([...fields]),
        recordIndex: records.length,
        unclosedQuote,
        diagnostics: Object.freeze(recordDiagnostics),
      }),
    );
    if (records.length >= limits.maximumParsedRows) {
      diagnostics.push(buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.ROW_LIMIT_EXCEEDED));
      truncated = true;
      return false;
    }
    return true;
  };

  const flushField = (): void => {
    fields.push(field);
    field = "";
  };

  const startRecord = (at: number): void => {
    fields = [];
    field = "";
    state = "FieldStart";
    recordStart = at;
    unclosedQuote = false;
  };

  while (i < text.length) {
    const ch = text[i]!;
    const next = i + 1 < text.length ? text[i + 1]! : "";

    if (state === "FieldStart") {
      if (ch === '"') {
        state = "Quoted";
        i += 1;
        continue;
      }
      if (ch === delimiter) {
        flushField();
        i += 1;
        continue;
      }
      if (ch === "\r" || ch === "\n") {
        flushField();
        if (!emitRecord(i)) {
          break;
        }
        if (ch === "\r" && next === "\n") {
          i += 2;
        } else {
          i += 1;
        }
        startRecord(i);
        continue;
      }
      state = "Unquoted";
      field += ch;
      i += 1;
      continue;
    }

    if (state === "Unquoted") {
      if (ch === delimiter) {
        flushField();
        state = "FieldStart";
        i += 1;
        continue;
      }
      if (ch === "\r" || ch === "\n") {
        flushField();
        if (!emitRecord(i)) {
          break;
        }
        if (ch === "\r" && next === "\n") {
          i += 2;
        } else {
          i += 1;
        }
        startRecord(i);
        continue;
      }
      field += ch;
      i += 1;
      continue;
    }

    if (state === "Quoted") {
      if (ch === '"') {
        state = "QuoteSeen";
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
      continue;
    }

    // QuoteSeen — either escaped quote or end of quoted field.
    if (ch === '"') {
      field += '"';
      state = "Quoted";
      i += 1;
      continue;
    }
    if (ch === delimiter) {
      flushField();
      state = "FieldStart";
      i += 1;
      continue;
    }
    if (ch === "\r" || ch === "\n") {
      flushField();
      if (!emitRecord(i)) {
        break;
      }
      if (ch === "\r" && next === "\n") {
        i += 2;
      } else {
        i += 1;
      }
      startRecord(i);
      continue;
    }
    // Soft recovery: treat unexpected characters after a closing quote as unquoted content.
    field += ch;
    state = "Unquoted";
    i += 1;
  }

  if (!blocked && !truncated) {
    if (state === "Quoted") {
      unclosedQuote = true;
    }
    const hasPendingContent =
      fields.length > 0 ||
      field.length > 0 ||
      state === "Quoted" ||
      state === "QuoteSeen" ||
      state === "Unquoted";
    if (hasPendingContent) {
      flushField();
      emitRecord(text.length);
    }
  }

  // Cap diagnostics growth at the parser diagnostic limit.
  const capped =
    diagnostics.length > limits.maximumDiagnosticCount
      ? diagnostics.slice(0, limits.maximumDiagnosticCount)
      : diagnostics;

  return Object.freeze({
    records: Object.freeze(records),
    truncated,
    diagnostics: Object.freeze(capped),
    blocked,
  });
}
