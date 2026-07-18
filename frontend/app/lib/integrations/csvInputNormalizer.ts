/**
 * INT-1:2 — CSV Input Normalizer.
 *
 * Converts accepted INT-1:1 / parser inputs into a uniform text representation
 * with resolved encoding metadata. Never opens files or paths. Never mutates
 * the request. Synchronous and deterministic.
 *
 * Ownership: owned exclusively by INT-1:2.
 */

import {
  buildParserDiagnostic,
  PARSER_DIAGNOSTIC_CODES,
} from "./csvParserDiagnostics.ts";
import {
  CsvParserLimitValues,
  type CsvParserInput,
  type EncodingHint,
  type NormalizedCsvInput,
  type ParserDiagnostic,
} from "./csvParserTypes.ts";

const UTF8_BOM = "\uFEFF";
const UTF16LE_BOM = Object.freeze([0xff, 0xfe] as const);
const UTF16BE_BOM = Object.freeze([0xfe, 0xff] as const);

const decodeUtf16 = (bytes: Uint8Array, littleEndian: boolean): string => {
  const start = bytes.length >= 2 ? 2 : 0;
  const usable = bytes.length - ((bytes.length - start) % 2);
  let result = "";
  for (let i = start; i + 1 < usable; i += 2) {
    const code = littleEndian ? bytes[i]! | (bytes[i + 1]! << 8) : (bytes[i]! << 8) | bytes[i + 1]!;
    result += String.fromCharCode(code);
  }
  return result;
};

const stripUtf8Bom = (text: string): { readonly text: string; readonly hadBom: boolean } => {
  if (text.startsWith(UTF8_BOM)) {
    return { text: text.slice(1), hadBom: true };
  }
  return { text, hadBom: false };
};

const resolveBytes = (
  bytes: Uint8Array,
  declared: EncodingHint,
  diagnostics: ParserDiagnostic[],
): { readonly text: string; readonly encoding: EncodingHint } | null => {
  const hasUtf16Le =
    bytes.length >= 2 && bytes[0] === UTF16LE_BOM[0] && bytes[1] === UTF16LE_BOM[1];
  const hasUtf16Be =
    bytes.length >= 2 && bytes[0] === UTF16BE_BOM[0] && bytes[1] === UTF16BE_BOM[1];

  if (declared === "UTF-16LE" || hasUtf16Le) {
    return { text: decodeUtf16(bytes, true), encoding: "UTF-16LE" };
  }
  if (declared === "UTF-16BE" || hasUtf16Be) {
    return { text: decodeUtf16(bytes, false), encoding: "UTF-16BE" };
  }

  // Interpret as UTF-8 / UTF-8-BOM via TextDecoder when available; otherwise
  // map bytes as Latin-1 code units for deterministic MVP behavior.
  let decoded = "";
  if (typeof TextDecoder !== "undefined") {
    try {
      decoded = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    } catch {
      diagnostics.push(
        buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.UNSUPPORTED_ENCODING, {
          field: "content",
          message: "Binary content could not be decoded as UTF-8.",
        }),
      );
      return null;
    }
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      decoded += String.fromCharCode(bytes[i]!);
    }
  }

  const stripped = stripUtf8Bom(decoded);
  if (declared === "UTF-8-BOM" || stripped.hadBom) {
    return { text: stripped.text, encoding: "UTF-8-BOM" };
  }
  if (declared === "Unknown") {
    diagnostics.push(buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.ENCODING_UNKNOWN));
  }
  return { text: stripped.text, encoding: "UTF-8" };
};

const resolveText = (
  content: string,
  declared: EncodingHint,
  diagnostics: ParserDiagnostic[],
): { readonly text: string; readonly encoding: EncodingHint } | null => {
  if (declared === "UTF-16LE" || declared === "UTF-16BE") {
    diagnostics.push(
      buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.UNSUPPORTED_ENCODING, {
        field: "encodingHint",
        message: "UTF-16 encodings require byte input; string input is unsupported for UTF-16.",
      }),
    );
    return null;
  }
  const stripped = stripUtf8Bom(content);
  if (declared === "UTF-8-BOM" || stripped.hadBom) {
    return { text: stripped.text, encoding: "UTF-8-BOM" };
  }
  if (declared === "Unknown") {
    diagnostics.push(buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.ENCODING_UNKNOWN));
  }
  return { text: stripped.text, encoding: "UTF-8" };
};

/**
 * Normalize a parser input into uniform text + encoding metadata.
 * Manual tables are passed through without CSV text decoding.
 */
export function normalizeCsvParserInput(input: CsvParserInput): NormalizedCsvInput {
  const diagnostics: ParserDiagnostic[] = [];

  if (input.mode === "ManualTable") {
    return Object.freeze({
      sourceMode: "ManualTable",
      sourceName: input.name,
      text: "",
      encoding: "UTF-8",
      delimiterHint: "Comma",
      isManualTable: true,
      manualColumns: Object.freeze([...input.columns]),
      manualRows: Object.freeze(input.rows.map((row) => Object.freeze([...row]))),
      diagnostics: Object.freeze(diagnostics),
    });
  }

  if (input.mode === "CsvText") {
    const resolved = resolveText(input.content, input.encodingHint, diagnostics);
    if (resolved === null) {
      return Object.freeze({
        sourceMode: "CsvText",
        sourceName: input.name,
        text: "",
        encoding: "Unknown",
        delimiterHint: "Auto",
        isManualTable: false,
        manualColumns: null,
        manualRows: null,
        diagnostics: Object.freeze(diagnostics),
      });
    }
    if (resolved.text.length > CsvParserLimitValues.maximumInputCharacterCount) {
      diagnostics.push(buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.INPUT_LIMIT_EXCEEDED));
    }
    if (resolved.text.length === 0) {
      diagnostics.push(buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.EMPTY_INPUT));
    }
    return Object.freeze({
      sourceMode: "CsvText",
      sourceName: input.name,
      text: resolved.text,
      encoding: resolved.encoding,
      delimiterHint: "Auto",
      isManualTable: false,
      manualColumns: null,
      manualRows: null,
      diagnostics: Object.freeze(diagnostics),
    });
  }

  // CsvFileContent
  const declared = input.declaredEncoding;
  const resolved =
    typeof input.content === "string"
      ? resolveText(input.content, declared, diagnostics)
      : resolveBytes(input.content, declared, diagnostics);

  if (resolved === null) {
    return Object.freeze({
      sourceMode: "CsvFileContent",
      sourceName: input.fileName,
      text: "",
      encoding: "Unknown",
      delimiterHint: input.delimiterHint,
      isManualTable: false,
      manualColumns: null,
      manualRows: null,
      diagnostics: Object.freeze(diagnostics),
    });
  }
  if (resolved.text.length > CsvParserLimitValues.maximumInputCharacterCount) {
    diagnostics.push(buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.INPUT_LIMIT_EXCEEDED));
  }
  if (resolved.text.length === 0) {
    diagnostics.push(buildParserDiagnostic(PARSER_DIAGNOSTIC_CODES.EMPTY_INPUT));
  }
  return Object.freeze({
    sourceMode: "CsvFileContent",
    sourceName: input.fileName,
    text: resolved.text,
    encoding: resolved.encoding,
    delimiterHint: input.delimiterHint,
    isManualTable: false,
    manualColumns: null,
    manualRows: null,
    diagnostics: Object.freeze(diagnostics),
  });
}
