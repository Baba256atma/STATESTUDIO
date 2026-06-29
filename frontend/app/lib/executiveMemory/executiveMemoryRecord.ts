/**
 * APP-4:2 — Executive Memory canonical record contract.
 */

import type {
  ExecutiveMemoryCategory,
  ExecutiveMemoryId,
  ExecutiveMemoryProviderId,
  ExecutiveMemoryWorkspaceId,
} from "./executiveMemoryTypes.ts";
import type { ExecutiveMemoryAssumption, ExecutiveMemoryConstraint, ExecutiveMemoryEvidence, ExecutiveMemoryLessonLearned, ExecutiveMemoryOutcome } from "./executiveMemoryEvidence.ts";
import type { ExecutiveMemoryConfidence } from "./executiveMemoryConfidence.ts";
import type { ExecutiveMemoryDecision } from "./executiveMemoryDecision.ts";
import type { ExecutiveMemoryGoal } from "./executiveMemoryGoal.ts";
import type {
  ExecutiveMemoryBody,
  ExecutiveMemoryBusinessContext,
  ExecutiveMemoryHeader,
  ExecutiveMemoryMetadata,
  ExecutiveMemoryTag,
  ExecutiveMemoryVersion,
} from "./executiveMemoryMetadata.ts";
import type { ExecutiveMemoryReference, ExecutiveMemoryRelationship } from "./executiveMemoryReference.ts";
import type { ExecutiveMemoryIntent, ExecutiveMemoryScenario } from "./executiveMemoryScenario.ts";
import {
  EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION,
} from "./executiveMemoryRecordConstants.ts";

export type ExecutiveMemoryRecord = Readonly<{
  id: ExecutiveMemoryId;
  providerId: ExecutiveMemoryProviderId;
  workspaceId: ExecutiveMemoryWorkspaceId;
  category: ExecutiveMemoryCategory;
  header: ExecutiveMemoryHeader;
  body: ExecutiveMemoryBody;
  goal: ExecutiveMemoryGoal | null;
  intent: ExecutiveMemoryIntent | null;
  scenario: ExecutiveMemoryScenario | null;
  decision: ExecutiveMemoryDecision | null;
  evidence: readonly ExecutiveMemoryEvidence[];
  confidence: ExecutiveMemoryConfidence | null;
  references: readonly ExecutiveMemoryReference[];
  tags: readonly ExecutiveMemoryTag[];
  businessContext: ExecutiveMemoryBusinessContext | null;
  assumptions: readonly ExecutiveMemoryAssumption[];
  constraints: readonly ExecutiveMemoryConstraint[];
  outcomes: readonly ExecutiveMemoryOutcome[];
  lessonsLearned: readonly ExecutiveMemoryLessonLearned[];
  relationships: readonly ExecutiveMemoryRelationship[];
  createdAt: string;
  updatedAt: string;
  version: ExecutiveMemoryVersion;
  metadata: ExecutiveMemoryMetadata;
  schemaVersion: typeof EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION | string;
  contractVersion: typeof EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION | string;
  readOnly: true;
}>;

export type CreateExecutiveMemoryRecordInput = Readonly<{
  id: ExecutiveMemoryId;
  providerId: ExecutiveMemoryProviderId;
  workspaceId: ExecutiveMemoryWorkspaceId;
  category: ExecutiveMemoryCategory;
  header: ExecutiveMemoryHeader;
  body: ExecutiveMemoryBody;
  goal?: ExecutiveMemoryGoal | null;
  intent?: ExecutiveMemoryIntent | null;
  scenario?: ExecutiveMemoryScenario | null;
  decision?: ExecutiveMemoryDecision | null;
  evidence?: readonly ExecutiveMemoryEvidence[];
  confidence?: ExecutiveMemoryConfidence | null;
  references?: readonly ExecutiveMemoryReference[];
  tags?: readonly ExecutiveMemoryTag[];
  businessContext?: ExecutiveMemoryBusinessContext | null;
  assumptions?: readonly ExecutiveMemoryAssumption[];
  constraints?: readonly ExecutiveMemoryConstraint[];
  outcomes?: readonly ExecutiveMemoryOutcome[];
  lessonsLearned?: readonly ExecutiveMemoryLessonLearned[];
  relationships?: readonly ExecutiveMemoryRelationship[];
  createdAt: string;
  updatedAt: string;
  version: ExecutiveMemoryVersion;
  metadata: ExecutiveMemoryMetadata;
  schemaVersion?: string;
  contractVersion?: string;
}>;

export function createExecutiveMemoryRecord(
  input: CreateExecutiveMemoryRecordInput
): ExecutiveMemoryRecord {
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
    readOnly: true as const,
  });
}
