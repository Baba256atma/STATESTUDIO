/**
 * APP-4:2 — Executive Memory record contracts.
 * Canonical APP-4:2 contract surface — extends APP-4:1 foundation.
 */
import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import { EXECUTIVE_MEMORY_CONTRACT_VERSION as EXECUTIVE_MEMORY_FOUNDATION_VERSION } from "./executiveMemoryConstants.ts";
import { EXECUTIVE_MEMORY_RECORD_ARCHITECTURE_VERSION, EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION, EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION, EXECUTIVE_MEMORY_RECORD_TAGS, } from "./executiveMemoryRecordConstants.ts";
export { createExecutiveMemoryRecord, } from "./executiveMemoryRecord.ts";
export { createExecutiveMemoryReference, createExecutiveMemoryObjectReference, createExecutiveMemoryTimelineReference, createExecutiveMemoryRelationship, } from "./executiveMemoryReference.ts";
export { createExecutiveMemoryMetadata, createExecutiveMemoryHeader, createExecutiveMemoryBody, createExecutiveMemoryBusinessContext, createExecutiveMemoryTag, createExecutiveMemoryVersion, } from "./executiveMemoryMetadata.ts";
export { createExecutiveMemoryConfidence, isExecutiveMemoryConfidenceLevel, } from "./executiveMemoryConfidence.ts";
export { createExecutiveMemoryGoal, } from "./executiveMemoryGoal.ts";
export { createExecutiveMemoryDecision, } from "./executiveMemoryDecision.ts";
export { createExecutiveMemoryScenario, createExecutiveMemoryIntent, } from "./executiveMemoryScenario.ts";
export { createExecutiveMemoryEvidence, createExecutiveMemoryOutcome, createExecutiveMemoryLessonLearned, createExecutiveMemoryAssumption, createExecutiveMemoryConstraint, } from "./executiveMemoryEvidence.ts";
export { ExecutiveMemoryRecordBuilder, buildExecutiveMemoryRecordExample, } from "./executiveMemoryBuilder.ts";
export { validateExecutiveMemoryRecordShape, validateExecutiveMemoryMetadataContract, validateExecutiveMemoryRecordBackwardCompatibility, hasDuplicateReferenceIds, isExecutiveMemoryReferenceType, } from "./executiveMemoryRecordValidation.ts";
export { ExecutiveMemorySchemas, serializeExecutiveMemoryRecord, validateExecutiveMemoryRecordJson, deserializeExecutiveMemoryRecord, isExecutiveMemoryRecordSchemaCompatible, } from "./executiveMemorySchemas.ts";
export const EXECUTIVE_MEMORY_RECORD_IDENTITY = Object.freeze({
    appId: "APP-4",
    phaseId: "APP-4/2",
    title: "Executive Memory Record Contracts",
    recordContractVersion: EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION,
    foundationContractVersion: EXECUTIVE_MEMORY_FOUNDATION_VERSION,
    schemaVersion: EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION,
    architectureVersion: EXECUTIVE_MEMORY_RECORD_ARCHITECTURE_VERSION,
});
export const EXECUTIVE_MEMORY_RECORD_SELF_MANIFEST = Object.freeze({
    stageId: "APP-4/2",
    title: "Executive Memory Contract & Types",
    goal: "Canonical APP-4:2 executive memory record contracts — types, builders, validation, and serialization only.",
    lifecycle: "build",
    allowedFiles: Object.freeze([
        "frontend/app/lib/executiveMemory/executiveMemoryRecordConstants.ts",
        "frontend/app/lib/executiveMemory/executiveMemoryReference.ts",
        "frontend/app/lib/executiveMemory/executiveMemoryConfidence.ts",
        "frontend/app/lib/executiveMemory/executiveMemoryGoal.ts",
        "frontend/app/lib/executiveMemory/executiveMemoryDecision.ts",
        "frontend/app/lib/executiveMemory/executiveMemoryScenario.ts",
        "frontend/app/lib/executiveMemory/executiveMemoryEvidence.ts",
        "frontend/app/lib/executiveMemory/executiveMemoryMetadata.ts",
        "frontend/app/lib/executiveMemory/executiveMemoryRecord.ts",
        "frontend/app/lib/executiveMemory/executiveMemoryBuilder.ts",
        "frontend/app/lib/executiveMemory/executiveMemoryRecordValidation.ts",
        "frontend/app/lib/executiveMemory/executiveMemorySchemas.ts",
        "frontend/app/lib/executiveMemory/executiveMemoryRecordContracts.ts",
        "frontend/app/lib/executiveMemory/executiveMemoryRecordContracts.test.ts",
        "docs/app-4-2-executive-memory-contracts-report.md",
    ]),
    forbiddenPatterns: Object.freeze([
        ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
        "executiveIntent/",
        "executive-time/",
        "dashboard/",
        "assistant/",
        "components/",
        ".tsx",
        "MemoryStorage",
        "MemoryRetrieval",
        "MemoryRanking",
    ]),
    prerequisites: Object.freeze(["APP-4/1", "APP-1", "APP-2", "APP-3"]),
    runtimePath: "library-only",
    tags: EXECUTIVE_MEMORY_RECORD_TAGS,
});
export const ExecutiveMemoryRecordContracts = Object.freeze({
    identity: EXECUTIVE_MEMORY_RECORD_IDENTITY,
    manifest: EXECUTIVE_MEMORY_RECORD_SELF_MANIFEST,
    version: EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION,
    schemaVersion: EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION,
    tags: EXECUTIVE_MEMORY_RECORD_TAGS,
});
