/**
 * INT-1:1 — CSV & Manual Input Contracts.
 *
 * The immutable, declarative catalog of INT-1 integration contracts: the three
 * input modes, encoding and delimiter hint vocabularies, provisional preview
 * primitive types, the ordered lifecycle states, and the diagnostic category and
 * severity vocabularies. This module is metadata-only — it declares the shapes
 * the future Pipeline Page and parser (INT-1:2) will consume.
 *
 * Ownership: owned exclusively by INT-1.
 * Dependency rules: depends only on INT-1 foundation types and lifecycle.
 */

import { CsvManualInputLifecycle } from "./csvManualInputLifecycle.ts";
import type {
  CsvManualInputMode,
  DelimiterHint,
  EncodingHint,
  ProvisionalPrimitiveType,
} from "./csvManualInputFoundationTypes.ts";

const INPUT_MODES: readonly CsvManualInputMode[] = Object.freeze([
  "CsvFile",
  "CsvText",
  "ManualTable",
]);

const ENCODING_HINTS: readonly EncodingHint[] = Object.freeze([
  "UTF-8",
  "UTF-8-BOM",
  "UTF-16LE",
  "UTF-16BE",
  "Unknown",
]);

const DELIMITER_HINTS: readonly DelimiterHint[] = Object.freeze([
  "Comma",
  "Semicolon",
  "Tab",
  "Pipe",
  "Auto",
]);

const PROVISIONAL_PRIMITIVE_TYPES: readonly ProvisionalPrimitiveType[] = Object.freeze([
  "String",
  "Integer",
  "Decimal",
  "Boolean",
  "Date",
  "DateTime",
  "Unknown",
]);

interface InputModeContract {
  readonly mode: CsvManualInputMode;
  readonly description: string;
  readonly requiredFields: readonly string[];
}

const INPUT_MODE_CONTRACTS: readonly InputModeContract[] = Object.freeze([
  Object.freeze({
    mode: "CsvFile",
    description: "Metadata for a user-selected CSV file. The file is not read in this phase.",
    requiredFields: Object.freeze(["fileName", "fileSizeBytes", "mimeType", "lastModified", "encodingHint"]),
  }),
  Object.freeze({
    mode: "CsvText",
    description: "CSV content pasted into Nexora. Complete parsing is deferred to INT-1:2.",
    requiredFields: Object.freeze(["name", "content", "encodingHint"]),
  }),
  Object.freeze({
    mode: "ManualTable",
    description: "A small, manually supplied table with explicit dimension limits.",
    requiredFields: Object.freeze(["name", "columns", "rows"]),
  }),
]);

const isRecognizedMode = (mode: string): mode is CsvManualInputMode =>
  (INPUT_MODES as readonly string[]).includes(mode);

/** The immutable INT-1 integration contract catalog. */
export const CsvManualInputContracts = Object.freeze({
  inputModes: INPUT_MODES,
  inputModeContracts: INPUT_MODE_CONTRACTS,
  encodingHints: ENCODING_HINTS,
  delimiterHints: DELIMITER_HINTS,
  provisionalPrimitiveTypes: PROVISIONAL_PRIMITIVE_TYPES,
  lifecycleStates: CsvManualInputLifecycle.states,
  isRecognizedMode,
});
