/**
 * APP-4:2 — Executive Memory serialization contracts.
 * JSON export/import validation only — no file system or database.
 */
import { EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION, EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION, } from "./executiveMemoryRecordConstants.ts";
import { validateExecutiveMemoryRecordBackwardCompatibility, validateExecutiveMemoryRecordShape, } from "./executiveMemoryRecordValidation.ts";
export function serializeExecutiveMemoryRecord(record) {
    const json = JSON.stringify(record);
    return Object.freeze({
        json,
        byteLength: json.length,
        schemaVersion: record.schemaVersion,
        contractVersion: record.contractVersion,
        readOnly: true,
    });
}
export function validateExecutiveMemoryRecordJson(json) {
    let parsed;
    try {
        parsed = JSON.parse(json);
    }
    catch {
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
            readOnly: true,
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
            readOnly: true,
        });
    }
    const candidate = parsed;
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
        readOnly: true,
    });
}
export function deserializeExecutiveMemoryRecord(json) {
    return validateExecutiveMemoryRecordJson(json);
}
export function isExecutiveMemoryRecordSchemaCompatible(payload) {
    const schemaVersion = payload.schemaVersion;
    const contractVersion = payload.contractVersion;
    return ((schemaVersion === EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION || typeof schemaVersion === "string") &&
        (contractVersion === EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION || typeof contractVersion === "string"));
}
export const ExecutiveMemorySchemas = Object.freeze({
    serializeExecutiveMemoryRecord,
    validateExecutiveMemoryRecordJson,
    deserializeExecutiveMemoryRecord,
    isExecutiveMemoryRecordSchemaCompatible,
    schemaVersion: EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION,
    contractVersion: EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION,
});
