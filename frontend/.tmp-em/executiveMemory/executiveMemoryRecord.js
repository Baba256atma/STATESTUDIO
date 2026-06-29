/**
 * APP-4:2 — Executive Memory canonical record contract.
 */
import { EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION, EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION, } from "./executiveMemoryRecordConstants.ts";
export function createExecutiveMemoryRecord(input) {
    return Object.freeze({
        id: input.id,
        providerId: input.providerId,
        workspaceId: input.workspaceId,
        category: input.category,
        header: input.header,
        body: input.body,
        goal: input.goal ?? null,
        intent: input.intent ?? null,
        scenario: input.scenario ?? null,
        decision: input.decision ?? null,
        evidence: Object.freeze([...(input.evidence ?? [])]),
        confidence: input.confidence ?? null,
        references: Object.freeze([...(input.references ?? [])]),
        tags: Object.freeze([...(input.tags ?? [])]),
        businessContext: input.businessContext ?? null,
        assumptions: Object.freeze([...(input.assumptions ?? [])]),
        constraints: Object.freeze([...(input.constraints ?? [])]),
        outcomes: Object.freeze([...(input.outcomes ?? [])]),
        lessonsLearned: Object.freeze([...(input.lessonsLearned ?? [])]),
        relationships: Object.freeze([...(input.relationships ?? [])]),
        createdAt: input.createdAt,
        updatedAt: input.updatedAt,
        version: input.version,
        metadata: input.metadata,
        schemaVersion: input.schemaVersion ?? EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION,
        contractVersion: input.contractVersion ?? EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION,
        readOnly: true,
    });
}
