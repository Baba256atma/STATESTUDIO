/**
 * APP-4:2 — Executive Memory record validation.
 * Contract shape validation only — no storage or retrieval.
 */
import { isExecutiveMemoryCategory, isReservedExecutiveMemoryId, isReservedExecutiveMemoryProviderId } from "./executiveMemoryValidation.ts";
import { isExecutiveMemoryConfidenceLevel } from "./executiveMemoryConfidence.ts";
import { EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION, EXECUTIVE_MEMORY_RECORD_LIMITS, EXECUTIVE_MEMORY_RECORD_MANDATORY_FIELDS, EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION, EXECUTIVE_MEMORY_REFERENCE_TYPE_KEYS, } from "./executiveMemoryRecordConstants.ts";
function issue(code, message, field) {
    return Object.freeze({ code, message, field });
}
function result(issues) {
    return Object.freeze({
        valid: issues.length === 0,
        issues: Object.freeze(issues),
    });
}
function isIsoTimestamp(value) {
    return Number.isFinite(Date.parse(value));
}
export function hasDuplicateReferenceIds(references) {
    const ids = references.map((entry) => entry.referenceId);
    return new Set(ids).size !== ids.length;
}
export function isExecutiveMemoryReferenceType(value) {
    return EXECUTIVE_MEMORY_REFERENCE_TYPE_KEYS.includes(value);
}
export function validateExecutiveMemoryMetadataContract(metadata) {
    const issues = [];
    if (isReservedExecutiveMemoryId(metadata.memoryId)) {
        issues.push(issue("memory_id_reserved", "Memory id is reserved.", "memoryId"));
    }
    if (!isExecutiveMemoryCategory(metadata.category)) {
        issues.push(issue("invalid_category", "Metadata category is invalid.", "category"));
    }
    if (metadata.tags.length > EXECUTIVE_MEMORY_RECORD_LIMITS.maxTags) {
        issues.push(issue("too_many_tags", "Tag count exceeds maximum.", "tags"));
    }
    if (metadata.references.length > EXECUTIVE_MEMORY_RECORD_LIMITS.maxReferences) {
        issues.push(issue("too_many_references", "Reference count exceeds maximum.", "references"));
    }
    if (hasDuplicateReferenceIds(metadata.references)) {
        issues.push(issue("duplicate_references", "Duplicate reference ids detected.", "references"));
    }
    for (const reference of metadata.references) {
        if (!isExecutiveMemoryReferenceType(reference.referenceType)) {
            issues.push(issue("invalid_reference_type", `Invalid reference type: ${reference.referenceType}.`, "references"));
        }
    }
    return result(issues);
}
export function validateExecutiveMemoryRecordShape(record) {
    const issues = [];
    for (const field of EXECUTIVE_MEMORY_RECORD_MANDATORY_FIELDS) {
        if (!(field in record)) {
            issues.push(issue("field_missing", `Missing required field: ${field}.`, field));
        }
    }
    if (record.id !== record.metadata.memoryId) {
        issues.push(issue("id_mismatch", "Record id must match metadata memory id.", "id"));
    }
    if (record.workspaceId !== record.metadata.workspaceId) {
        issues.push(issue("workspace_mismatch", "Workspace id must match metadata workspace id.", "workspaceId"));
    }
    if (record.category !== record.metadata.category) {
        issues.push(issue("category_mismatch", "Record category must match metadata category.", "category"));
    }
    if (isReservedExecutiveMemoryId(record.id)) {
        issues.push(issue("memory_id_reserved", "Record id is reserved.", "id"));
    }
    if (isReservedExecutiveMemoryProviderId(record.providerId)) {
        issues.push(issue("provider_id_reserved", "Provider id is reserved.", "providerId"));
    }
    if (!isExecutiveMemoryCategory(record.category)) {
        issues.push(issue("invalid_category", "Record category is invalid.", "category"));
    }
    if (!isIsoTimestamp(record.createdAt) || !isIsoTimestamp(record.updatedAt)) {
        issues.push(issue("invalid_timestamp", "Created or updated timestamp is invalid.", "createdAt"));
    }
    if (record.header.title.length > EXECUTIVE_MEMORY_RECORD_LIMITS.maxTitleLength) {
        issues.push(issue("title_too_long", "Header title exceeds maximum length.", "header.title"));
    }
    if (record.body.narrative.length > EXECUTIVE_MEMORY_RECORD_LIMITS.maxSummaryLength) {
        issues.push(issue("narrative_too_long", "Body narrative exceeds maximum length.", "body.narrative"));
    }
    if (record.references.length > EXECUTIVE_MEMORY_RECORD_LIMITS.maxReferences) {
        issues.push(issue("too_many_references", "Reference count exceeds maximum.", "references"));
    }
    if (hasDuplicateReferenceIds(record.references)) {
        issues.push(issue("duplicate_references", "Duplicate reference ids detected.", "references"));
    }
    if (record.evidence.length > EXECUTIVE_MEMORY_RECORD_LIMITS.maxEvidenceItems) {
        issues.push(issue("too_many_evidence", "Evidence count exceeds maximum.", "evidence"));
    }
    if (record.confidence) {
        if (record.confidence.score !== null &&
            (record.confidence.score < EXECUTIVE_MEMORY_RECORD_LIMITS.minConfidenceScore ||
                record.confidence.score > EXECUTIVE_MEMORY_RECORD_LIMITS.maxConfidenceScore)) {
            issues.push(issue("invalid_confidence_score", "Confidence score must be between 0 and 1.", "confidence.score"));
        }
        if (!isExecutiveMemoryConfidenceLevel(record.confidence.level)) {
            issues.push(issue("invalid_confidence_level", "Confidence level is invalid.", "confidence.level"));
        }
    }
    if (record.schemaVersion !== EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION &&
        typeof record.schemaVersion !== "string") {
        issues.push(issue("invalid_schema_version", "Schema version is invalid.", "schemaVersion"));
    }
    if (record.contractVersion !== EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION &&
        typeof record.contractVersion !== "string") {
        issues.push(issue("invalid_contract_version", "Contract version is invalid.", "contractVersion"));
    }
    issues.push(...validateExecutiveMemoryMetadataContract(record.metadata).issues);
    return result(issues);
}
export function validateExecutiveMemoryRecordBackwardCompatibility(record) {
    const issues = [];
    if (record.version.compatibility.backwardCompatible !== true) {
        issues.push(issue("backward_incompatible", "Record version compatibility flag must remain backward compatible."));
    }
    if (record.version.compatibility.app41Compatible !== true) {
        issues.push(issue("app41_incompatible", "Record must remain APP-4:1 compatible."));
    }
    return result(issues);
}
