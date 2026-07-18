/**
 * INT-1:2 — Syntactic Primitive Type Inference.
 *
 * Infers only String, Integer, Decimal, Boolean, Date, DateTime, or Unknown from
 * bounded non-empty sample values. Deterministic. No semantic interpretation,
 * no AI, no entity recognition. A column named customer_id is still just a
 * syntactic type guess.
 *
 * Ownership: owned exclusively by INT-1:2.
 */

import type { ProvisionalPrimitiveType } from "./csvParserTypes.ts";

const BOOLEAN_TRUE = new Set(["true", "yes", "1"]);
const BOOLEAN_FALSE = new Set(["false", "no", "0"]);

const INTEGER_RE = /^-?\d+$/;
const DECIMAL_RE = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/;
const DATE_RE = /^\d{4}[-/]\d{2}[-/]\d{2}$/;
const DATETIME_RE =
  /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;

const classifyOne = (raw: string): ProvisionalPrimitiveType => {
  const value = raw.trim();
  if (value.length === 0) {
    return "Unknown";
  }

  const lower = value.toLowerCase();
  if (BOOLEAN_TRUE.has(lower) || BOOLEAN_FALSE.has(lower)) {
    // Pure 0/1 alone could be Integer; prefer Integer when the token is numeric-only.
    if (value === "0" || value === "1") {
      return "Integer";
    }
    return "Boolean";
  }

  if (INTEGER_RE.test(value)) {
    return "Integer";
  }

  if (DECIMAL_RE.test(value)) {
    // Conservative thousands-separator handling: require a decimal point or commas.
    const normalized = value.replace(/,/g, "");
    if (INTEGER_RE.test(normalized)) {
      return "Integer";
    }
    if (/^-?\d+\.\d+$/.test(normalized)) {
      return "Decimal";
    }
    return "String";
  }

  if (DATE_RE.test(value) && !value.includes("T") && !value.includes(" ")) {
    return "Date";
  }

  if (DATETIME_RE.test(value) && (value.includes("T") || value.includes(" "))) {
    return "DateTime";
  }

  return "String";
};

const rank = (type: ProvisionalPrimitiveType): number => {
  switch (type) {
    case "Unknown":
      return 0;
    case "Boolean":
      return 1;
    case "Integer":
      return 2;
    case "Decimal":
      return 3;
    case "Date":
      return 4;
    case "DateTime":
      return 5;
    case "String":
      return 6;
  }
};

const merge = (
  current: ProvisionalPrimitiveType,
  next: ProvisionalPrimitiveType,
): ProvisionalPrimitiveType => {
  if (current === "Unknown") {
    return next;
  }
  if (next === "Unknown") {
    return current;
  }
  if (current === next) {
    return current;
  }
  // Integer + Decimal → Decimal
  if (
    (current === "Integer" && next === "Decimal") ||
    (current === "Decimal" && next === "Integer")
  ) {
    return "Decimal";
  }
  // Date + DateTime → DateTime
  if (
    (current === "Date" && next === "DateTime") ||
    (current === "DateTime" && next === "Date")
  ) {
    return "DateTime";
  }
  // Boolean mixed with numeric 0/1 samples treated carefully:
  // if one side is Boolean and the other is Integer, prefer Integer when both
  // are purely numeric-compatible; otherwise String.
  if (
    (current === "Boolean" && (next === "Integer" || next === "Decimal")) ||
    (next === "Boolean" && (current === "Integer" || current === "Decimal"))
  ) {
    return "String";
  }
  // Numeric + arbitrary text → String
  if (rank(current) !== rank(next)) {
    return "String";
  }
  return "String";
};

/**
 * Infer a single syntactic primitive type from bounded sample cell values.
 * Empty values are ignored. All-empty → Unknown.
 */
export function inferCsvPrimitiveType(
  sampleValues: readonly string[],
): ProvisionalPrimitiveType {
  let current: ProvisionalPrimitiveType = "Unknown";
  let sawNonEmpty = false;
  for (const sample of sampleValues) {
    if (sample.trim().length === 0) {
      continue;
    }
    sawNonEmpty = true;
    current = merge(current, classifyOne(sample));
    if (current === "String") {
      return "String";
    }
  }
  return sawNonEmpty ? current : "Unknown";
}

/**
 * True when a cell looks like a spreadsheet formula prefix, excluding valid
 * negative numbers (e.g. -5, -3.25). Leading "+" is treated as formula-risk.
 */
export function isFormulaRiskValue(value: string): boolean {
  if (value.length === 0) {
    return false;
  }
  const first = value[0]!;
  if (first !== "=" && first !== "+" && first !== "-" && first !== "@") {
    return false;
  }
  if (first === "-") {
    if (INTEGER_RE.test(value)) {
      return false;
    }
    const normalized = value.replace(/,/g, "");
    if (/^-\d+\.\d+$/.test(normalized)) {
      return false;
    }
  }
  return true;
}
