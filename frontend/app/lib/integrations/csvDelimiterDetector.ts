/**
 * INT-1:2 — CSV Delimiter Detector.
 *
 * Deterministic delimiter resolution for Comma, Semicolon, Tab, Pipe, and Auto.
 * Auto inspects only a bounded initial sample, counts candidates outside quoted
 * fields, prefers the most stable column count, and uses a fixed tie-break order.
 * No statistical or AI inference.
 *
 * Ownership: owned exclusively by INT-1:2.
 */

import {
  buildParserDiagnostic,
  PARSER_DIAGNOSTIC_CODES,
} from "./csvParserDiagnostics.ts";
import type {
  DelimiterCandidate,
  DelimiterDetectionResult,
  DelimiterHint,
  ParserDiagnostic,
} from "./csvParserTypes.ts";

const SAMPLE_CHARACTER_LIMIT = 8_192;
const SAMPLE_RECORD_LIMIT = 20;

/** Canonical delimiter candidates in deterministic tie-break order. */
export const CsvDelimiterCandidates: readonly DelimiterCandidate[] = Object.freeze([
  Object.freeze({ name: "Comma", character: "," }),
  Object.freeze({ name: "Semicolon", character: ";" }),
  Object.freeze({ name: "Tab", character: "\t" }),
  Object.freeze({ name: "Pipe", character: "|" }),
]);

const characterFor = (hint: DelimiterHint): string => {
  switch (hint) {
    case "Comma":
      return ",";
    case "Semicolon":
      return ";";
    case "Tab":
      return "\t";
    case "Pipe":
      return "|";
    case "Auto":
      return ",";
  }
};

/** Split sample text into logical records respecting quotes (bounded). */
const sampleRecords = (text: string): readonly string[] => {
  const sample = text.slice(0, SAMPLE_CHARACTER_LIMIT);
  const records: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < sample.length; i += 1) {
    const ch = sample[i]!;
    if (ch === '"') {
      if (inQuotes && sample[i + 1] === '"') {
        current += '""';
        i += 1;
      } else {
        inQuotes = !inQuotes;
        current += ch;
      }
      continue;
    }
    if (!inQuotes && (ch === "\n" || ch === "\r")) {
      if (ch === "\r" && sample[i + 1] === "\n") {
        i += 1;
      }
      if (current.trim().length > 0) {
        records.push(current);
        if (records.length >= SAMPLE_RECORD_LIMIT) {
          break;
        }
      }
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim().length > 0 && records.length < SAMPLE_RECORD_LIMIT) {
    records.push(current);
  }
  return records;
};

const countFieldsOutsideQuotes = (record: string, delimiter: string): number => {
  let count = 1;
  let inQuotes = false;
  for (let i = 0; i < record.length; i += 1) {
    const ch = record[i]!;
    if (ch === '"') {
      if (inQuotes && record[i + 1] === '"') {
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (!inQuotes && ch === delimiter) {
      count += 1;
    }
  }
  return count;
};

const scoreCandidate = (
  records: readonly string[],
  character: string,
): { readonly score: number; readonly columnCount: number } => {
  if (records.length === 0) {
    return { score: 0, columnCount: 0 };
  }
  const widths = records.map((record) => countFieldsOutsideQuotes(record, character));
  const first = widths[0]!;
  if (first <= 1) {
    // A single-column "match" is weak evidence for this delimiter.
    return { score: first === 1 ? 0.1 : 0, columnCount: first };
  }
  let consistent = 0;
  for (const width of widths) {
    if (width === first) {
      consistent += 1;
    }
  }
  const consistency = consistent / widths.length;
  const richness = Math.min(first, 32) / 32;
  return { score: consistency * 0.75 + richness * 0.25, columnCount: first };
};

/**
 * Resolve a delimiter from an explicit hint or Auto detection over a bounded sample.
 */
export function detectCsvDelimiter(
  text: string,
  hint: DelimiterHint = "Auto",
): DelimiterDetectionResult {
  const diagnostics: ParserDiagnostic[] = [];

  if (hint !== "Auto") {
    return Object.freeze({
      delimiter: hint,
      character: characterFor(hint),
      confidence: "High" as const,
      diagnostics: Object.freeze(diagnostics),
    });
  }

  const records = sampleRecords(text);
  if (records.length === 0) {
    diagnostics.push(buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.DELIMITER_NOT_DETECTED));
    return Object.freeze({
      delimiter: "Comma",
      character: ",",
      confidence: "None",
      diagnostics: Object.freeze(diagnostics),
    });
  }

  let best = CsvDelimiterCandidates[0]!;
  let bestScore = -1;
  let bestColumns = 0;
  for (const candidate of CsvDelimiterCandidates) {
    const { score, columnCount } = scoreCandidate(records, candidate.character);
    if (score > bestScore) {
      best = candidate;
      bestScore = score;
      bestColumns = columnCount;
    }
  }

  let confidence: DelimiterDetectionResult["confidence"];
  if (bestScore >= 0.9 && bestColumns > 1) {
    confidence = "High";
  } else if (bestScore >= 0.6 && bestColumns > 1) {
    confidence = "Medium";
  } else if (bestColumns > 1) {
    confidence = "Low";
    diagnostics.push(buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.DELIMITER_NOT_DETECTED));
  } else {
    confidence = "None";
    diagnostics.push(buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.DELIMITER_NOT_DETECTED));
  }

  return Object.freeze({
    delimiter: best.name,
    character: best.character,
    confidence,
    diagnostics: Object.freeze(diagnostics),
  });
}
