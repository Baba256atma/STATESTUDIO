import assert from "node:assert/strict";
import test from "node:test";
import { EXECUTIVE_MEMORY_CONTRACT_VERSION } from "./executiveMemoryConstants.ts";
import { initializeExecutiveMemoryPlatform, resetExecutiveMemoryPlatformForTests } from "./executiveMemoryPlatform.ts";
import { buildExecutiveMemoryRecordExample, createExecutiveMemoryMetadata, createExecutiveMemoryReference, createExecutiveMemoryRecord, } from "./executiveMemoryBuilder.ts";
import { createExecutiveMemoryConfidence } from "./executiveMemoryConfidence.ts";
import { createExecutiveMemoryHeader, createExecutiveMemoryVersion, } from "./executiveMemoryMetadata.ts";
import { EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION, EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION, EXECUTIVE_MEMORY_REFERENCE_TYPE_KEYS, } from "./executiveMemoryRecordConstants.ts";
import { EXECUTIVE_MEMORY_RECORD_IDENTITY, EXECUTIVE_MEMORY_RECORD_SELF_MANIFEST, ExecutiveMemoryRecordContracts, } from "./executiveMemoryRecordContracts.ts";
import { hasDuplicateReferenceIds, isExecutiveMemoryReferenceType, validateExecutiveMemoryMetadataContract, validateExecutiveMemoryRecordBackwardCompatibility, validateExecutiveMemoryRecordShape, } from "./executiveMemoryRecordValidation.ts";
import { deserializeExecutiveMemoryRecord, isExecutiveMemoryRecordSchemaCompatible, serializeExecutiveMemoryRecord, validateExecutiveMemoryRecordJson, } from "./executiveMemorySchemas.ts";
import { resolveExecutiveMemoryExample, validateExecutiveMemoryShape } from "./executiveMemoryContracts.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
const FIXED_TIME = "2026-01-01T00:00:00.000Z";
test.beforeEach(() => {
    resetExecutiveMemoryPlatformForTests();
});
test("exports APP-4:2 record identity and extends APP-4:1 foundation", () => {
    assert.equal(EXECUTIVE_MEMORY_RECORD_IDENTITY.phaseId, "APP-4/2");
    assert.equal(EXECUTIVE_MEMORY_RECORD_IDENTITY.foundationContractVersion, EXECUTIVE_MEMORY_CONTRACT_VERSION);
    assert.equal(EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION, "APP-4/2");
    assert.equal(EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION, "1.0.0");
});
test("creates canonical executive memory record example", () => {
    const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
    assert.equal(record.contractVersion, "APP-4/2");
    assert.equal(record.schemaVersion, "1.0.0");
    assert.equal(record.category, "decision");
    assert.ok(record.decision);
    assert.ok(record.goal);
    assert.ok(record.intent);
    assert.ok(record.scenario);
    assert.equal(record.readOnly, true);
    assert.equal(validateExecutiveMemoryRecordShape(record).valid, true);
});
test("validates record contract immutability", () => {
    const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
    assert.equal(Object.isFrozen(record), true);
    assert.equal(Object.isFrozen(record.header), true);
    assert.equal(Object.isFrozen(record.body), true);
    assert.equal(Object.isFrozen(record.metadata), true);
    assert.equal(Object.isFrozen(record.references), true);
    assert.equal(Object.isFrozen(record.version.compatibility), true);
});
test("createExecutiveMemoryReference initializes valid reference structures", () => {
    const reference = createExecutiveMemoryReference({
        referenceId: "ref-kpi-001",
        referenceType: "kpi",
        targetId: "kpi-revenue-001",
        label: "Revenue KPI",
        module: "strategy-kpi",
        workspaceId: "ws-001",
    });
    assert.equal(reference.readOnly, true);
    assert.equal(isExecutiveMemoryReferenceType(reference.referenceType), true);
});
test("createExecutiveMemoryMetadata initializes valid metadata structures", () => {
    const metadata = createExecutiveMemoryMetadata({
        memoryId: "memory-001",
        workspaceId: "ws-001",
        category: "goal",
        owner: "executive-owner",
        sourceModule: "executive-memory-record",
    });
    assert.equal(validateExecutiveMemoryMetadataContract(metadata).valid, true);
});
test("createExecutiveMemoryRecord builder composes valid records", () => {
    const metadata = createExecutiveMemoryMetadata({
        memoryId: "memory-builder-001",
        workspaceId: "ws-builder-001",
        category: "evidence",
        owner: "executive-owner",
        sourceModule: "executive-memory-record",
    });
    const record = createExecutiveMemoryRecord({
        id: "memory-builder-001",
        providerId: "provider-builder-001",
        workspaceId: "ws-builder-001",
        category: "evidence",
        header: createExecutiveMemoryHeader({
            title: "Evidence record",
            summary: "Captured market evidence.",
            owner: "executive-owner",
            sourceModule: "executive-memory-record",
        }),
        body: { narrative: "Evidence narrative.", keyPoints: Object.freeze([]), readOnly: true },
        metadata,
        version: createExecutiveMemoryVersion({
            versionId: "version-001",
            schemaVersion: EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION,
            contractVersion: EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION,
            semanticVersion: "1.0.0",
            createdAt: FIXED_TIME,
        }),
        createdAt: FIXED_TIME,
        updatedAt: FIXED_TIME,
    });
    assert.equal(validateExecutiveMemoryRecordShape(record).valid, true);
});
test("rejects duplicate reference ids", () => {
    const duplicateReference = createExecutiveMemoryReference({
        referenceId: "ref-dup",
        referenceType: "goal",
        targetId: "goal-001",
        label: "Goal",
        module: null,
        workspaceId: "ws-001",
    });
    assert.equal(hasDuplicateReferenceIds(Object.freeze([duplicateReference, duplicateReference])), true);
    const metadata = createExecutiveMemoryMetadata({
        memoryId: "memory-dup-ref",
        workspaceId: "ws-001",
        category: "goal",
        owner: "owner",
        sourceModule: "test",
        references: Object.freeze([duplicateReference, duplicateReference]),
    });
    assert.equal(validateExecutiveMemoryMetadataContract(metadata).valid, false);
});
test("rejects invalid confidence ranges", () => {
    const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
    const invalid = Object.freeze({
        ...record,
        confidence: createExecutiveMemoryConfidence({
            confidenceId: "bad-confidence",
            score: 1.5,
            level: "high",
            source: "test",
            explanation: "invalid",
            calculationMethod: "test",
        }),
    });
    assert.equal(validateExecutiveMemoryRecordShape(invalid).valid, false);
});
test("rejects reserved memory and provider ids in record validation", () => {
    const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
    const invalid = Object.freeze({
        ...record,
        id: "chat-memory",
        metadata: Object.freeze({ ...record.metadata, memoryId: "chat-memory" }),
    });
    assert.equal(validateExecutiveMemoryRecordShape(invalid).valid, false);
});
test("validates version backward compatibility flags", () => {
    const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
    assert.equal(validateExecutiveMemoryRecordBackwardCompatibility(record).valid, true);
    assert.equal(record.version.compatibility.app41Compatible, true);
});
test("serializes and deserializes executive memory records safely", () => {
    const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
    const serialized = serializeExecutiveMemoryRecord(record);
    assert.ok(serialized.byteLength > 0);
    assert.equal(serialized.schemaVersion, "1.0.0");
    const roundTrip = deserializeExecutiveMemoryRecord(serialized.json);
    assert.equal(roundTrip.valid, true);
    assert.equal(roundTrip.parsed, true);
    assert.equal(roundTrip.record?.id, record.id);
});
test("rejects malformed JSON on import validation", () => {
    const result = validateExecutiveMemoryRecordJson("{ invalid json");
    assert.equal(result.valid, false);
    assert.equal(result.parsed, false);
});
test("validates schema compatibility flags on parsed payload", () => {
    const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
    const payload = JSON.parse(serializeExecutiveMemoryRecord(record).json);
    assert.equal(isExecutiveMemoryRecordSchemaCompatible(payload), true);
});
test("declares reference model categories", () => {
    assert.ok(EXECUTIVE_MEMORY_REFERENCE_TYPE_KEYS.includes("kpi"));
    assert.ok(EXECUTIVE_MEMORY_REFERENCE_TYPE_KEYS.includes("assistant_session"));
    assert.ok(EXECUTIVE_MEMORY_REFERENCE_TYPE_KEYS.includes("timeline"));
    assert.equal(isExecutiveMemoryReferenceType("workspace"), true);
    assert.equal(isExecutiveMemoryReferenceType("chat_memory"), false);
});
test("ExecutiveMemoryRecordContracts exposes builder and schema APIs", () => {
    assert.equal(ExecutiveMemoryRecordContracts.version, "APP-4/2");
    assert.equal(ExecutiveMemoryRecordContracts.schemaVersion, "1.0.0");
});
test("validates APP-4:2 stage manifest and architecture boundaries", () => {
    assert.equal(validateStageManifest(EXECUTIVE_MEMORY_RECORD_SELF_MANIFEST).valid, true);
    assert.equal(evaluateStageFileBoundary({
        filePath: "frontend/app/lib/executiveMemory/executiveMemoryRecord.ts",
        allowedFiles: EXECUTIVE_MEMORY_RECORD_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: EXECUTIVE_MEMORY_RECORD_SELF_MANIFEST.forbiddenPatterns,
    }).allowed, true);
});
test("regression: APP-4:1 foundation contracts remain valid", () => {
    initializeExecutiveMemoryPlatform(FIXED_TIME);
    const foundationExample = resolveExecutiveMemoryExample(FIXED_TIME);
    assert.equal(validateExecutiveMemoryShape(foundationExample).valid, true);
    assert.equal(initializeExecutiveMemoryPlatform(FIXED_TIME).success, true);
});
test("rejects invalid timestamps in record validation", () => {
    const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
    const invalid = Object.freeze({ ...record, createdAt: "not-a-date" });
    assert.equal(validateExecutiveMemoryRecordShape(invalid).valid, false);
});
test("supports enterprise record sections as optional payloads", () => {
    const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
    assert.ok(record.businessContext);
    assert.ok(record.evidence.length > 0);
    assert.equal(Array.isArray(record.assumptions), true);
    assert.equal(Array.isArray(record.lessonsLearned), true);
});
