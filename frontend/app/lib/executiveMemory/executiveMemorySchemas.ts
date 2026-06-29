/**
 * APP-4:2 — Executive Memory serialization contracts.
 * JSON export/import validation only — no file system or database.
 */

import {
  EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION,
} from "./executiveMemoryRecordConstants.ts";
import type { ExecutiveMemoryRecord } from "./executiveMemoryRecord.ts";
import {
  validateExecutiveMemoryRecordBackwardCompatibility,
  validateExecutiveMemoryRecordShape,
} from "./executiveMemoryRecordValidation.ts";
import type { ExecutiveMemoryValidationResult } from "./executiveMemoryTypes.ts";

export type ExecutiveMemorySerializationResult = Readonly<{
  json: string;
  byteLength: number;
  schemaVersion: string;
  contractVersion: string;
  readOnly: true;
}>;

export type ExecutiveMemoryDeserializationResult = Readonly<{
  valid: boolean;
  record: ExecutiveMemoryRecord | null;
  validation: ExecutiveMemoryValidationResult;
  compatibility: ExecutiveMemoryValidationResult;
  parsed: boolean;
  readOnly: true;
}>;

export function serializeExecutiveMemoryRecord(record: ExecutiveMemoryRecord): ExecutiveMemorySerializationResult {
  const json = JSON.stringify(record);
  return Object.freeze({
    json,
    byteLength: json.length,
    schemaVersion: record.schemaVersion,
    contractVersion: record.contractVersion,
    readOnly: true as const,
  });
}

export function validateExecutiveMemoryRecordJson(json: string): ExecutiveMemoryDeserializationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return Object.freeze({
      valid: false,
      record: null,
      validation: Object.freeze({
        valid: false,
        issues: Object.freeze([
          Object.freeze({ code: "invalid_json", message: "JSON payload is malformed." }),
        ]),
      }),
      compatibility: Object.freeze({ valid: false, issues: Object.freeze([]) }),
      parsed: false,
      readOnly: true as const,
    });
  }

  if (typeof parsed !== "object" || parsed === null) {
    return Object.freeze({
      valid: false,
      record: null,
      validation: Object.freeze({
        valid: false,
        issues: Object.freeze([
          Object.freeze({ code: "invalid_root", message: "JSON root must be an object." }),
        ]),
      }),
      compatibility: Object.freeze({ valid: false, issues: Object.freeze([]) }),
      parsed: true,
      readOnly: true as const,
    });
  }

  const candidate = parsed as ExecutiveMemoryRecord;
  const validation = validateExecutiveMemoryRecordShape(candidate);
  const compatibility = validation.valid
    ? validateExecutiveMemoryRecordBackwardCompatibility(candidate)
    : Object.freeze({ valid: false, issues: Object.freeze([]) });

  return Object.freeze({
    valid: validation.valid && compatibility.valid,
    record: validation.valid ? candidate : null,
    validation,
    compatibility,
    parsed: true,
    readOnly: true as const,
  });
}

export function deserializeExecutiveMemoryRecord(json: string): ExecutiveMemoryDeserializationResult {
  return validateExecutiveMemoryRecordJson(json);
}

export function isExecutiveMemoryRecordSchemaCompatible(payload: Readonly<Record<string, unknown>>): boolean {
  const schemaVersion = payload.schemaVersion;
  const contractVersion = payload.contractVersion;
  return (
    (schemaVersion === EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION || typeof schemaVersion === "string") &&
    (contractVersion === EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION || typeof contractVersion === "string")
  );
}

export const ExecutiveMemorySchemas = Object.freeze({
  serializeExecutiveMemoryRecord,
  validateExecutiveMemoryRecordJson,
  deserializeExecutiveMemoryRecord,
  isExecutiveMemoryRecordSchemaCompatible,
  schemaVersion: EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION,
  contractVersion: EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION,
});
