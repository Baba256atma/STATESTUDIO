/**
 * APP-4:5 — Executive Intent ↔ Memory linking domain types.
 */

import type { IntentIdentifier } from "../executiveIntent/executiveIntentTypes.ts";
import type { ExecutiveMemoryId, ExecutiveMemoryWorkspaceId } from "./executiveMemoryTypes.ts";
import type {
  EXECUTIVE_INTENT_MEMORY_LINK_RELATIONSHIP_KEYS,
  EXECUTIVE_INTENT_MEMORY_LINK_STATE_KEYS,
  EXECUTIVE_INTENT_MEMORY_LINK_TYPE_KEYS,
} from "./executiveIntentMemoryLinkConstants.ts";

export type ExecutiveIntentMemoryLinkId = string;
export type ExecutiveIntentMemoryLinkType = (typeof EXECUTIVE_INTENT_MEMORY_LINK_TYPE_KEYS)[number];
export type ExecutiveIntentMemoryLinkRelationship =
  (typeof EXECUTIVE_INTENT_MEMORY_LINK_RELATIONSHIP_KEYS)[number];
export type ExecutiveIntentMemoryLinkState = (typeof EXECUTIVE_INTENT_MEMORY_LINK_STATE_KEYS)[number];

export type ExecutiveIntentMemoryLinkMetadata = Readonly<{
  label: string;
  notes: string;
  createdBy: string;
  sourceModule: string;
  customMetadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type ExecutiveIntentMemoryLinkVersion = Readonly<{
  versionId: string;
  semanticVersion: string;
  createdAt: string;
  readOnly: true;
}>;

export type ExecutiveIntentMemoryLink = Readonly<{
  linkId: ExecutiveIntentMemoryLinkId;
  intentId: IntentIdentifier;
  memoryId: ExecutiveMemoryId | null;
  workspaceId: ExecutiveMemoryWorkspaceId;
  relationship: ExecutiveIntentMemoryLinkRelationship;
  linkType: ExecutiveIntentMemoryLinkType;
  goalId: string | null;
  scenarioId: string | null;
  decisionId: string | null;
  evidenceId: string | null;
  referenceId: string | null;
  lifecycle: ExecutiveIntentMemoryLinkState;
  metadata: ExecutiveIntentMemoryLinkMetadata;
  version: ExecutiveIntentMemoryLinkVersion;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  readOnly: true;
}>;

export type CreateExecutiveIntentMemoryLinkInput = Readonly<{
  linkId: ExecutiveIntentMemoryLinkId;
  intentId: IntentIdentifier;
  memoryId?: ExecutiveMemoryId | null;
  workspaceId: ExecutiveMemoryWorkspaceId;
  relationship: ExecutiveIntentMemoryLinkRelationship;
  linkType: ExecutiveIntentMemoryLinkType;
  goalId?: string | null;
  scenarioId?: string | null;
  decisionId?: string | null;
  evidenceId?: string | null;
  referenceId?: string | null;
  metadata: ExecutiveIntentMemoryLinkMetadata;
  version: ExecutiveIntentMemoryLinkVersion;
  createdAt: string;
  updatedAt: string;
}>;

export type UpdateExecutiveIntentMemoryLinkInput = Readonly<{
  linkType?: ExecutiveIntentMemoryLinkType;
  metadata?: Readonly<{
    label?: string;
    notes?: string;
    customMetadata?: Readonly<Record<string, string>>;
  }>;
}>;

export type ExecutiveIntentLinkTargetRegistration = Readonly<{
  intentId: IntentIdentifier;
  workspaceId: ExecutiveMemoryWorkspaceId;
  goalIds?: readonly string[];
  scenarioIds?: readonly string[];
  decisionIds?: readonly string[];
  evidenceIds?: readonly string[];
  referenceIds?: readonly string[];
}>;

export type ExecutiveIntentMemoryLinkError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveIntentMemoryLinkResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: ExecutiveIntentMemoryLinkError | null;
  readOnly: true;
}>;

export type ExecutiveIntentMemoryLinkStatistics = Readonly<{
  totalLinks: number;
  activeLinks: number;
  archivedLinks: number;
  linksByType: Readonly<Record<string, number>>;
  linksByRelationship: Readonly<Record<string, number>>;
  linksByIntent: Readonly<Record<string, number>>;
  linksByWorkspace: Readonly<Record<string, number>>;
  readOnly: true;
}>;

export type ExecutiveIntentMemoryLinkGraphEdge = Readonly<{
  linkId: ExecutiveIntentMemoryLinkId;
  intentId: IntentIdentifier;
  memoryId: ExecutiveMemoryId | null;
  relationship: ExecutiveIntentMemoryLinkRelationship;
  linkType: ExecutiveIntentMemoryLinkType;
  lifecycle: ExecutiveIntentMemoryLinkState;
  readOnly: true;
}>;

export type ExecutiveIntentMemoryLinkGraph = Readonly<{
  intentId: IntentIdentifier | null;
  memoryId: ExecutiveMemoryId | null;
  edges: readonly ExecutiveIntentMemoryLinkGraphEdge[];
  linkedMemoryIds: readonly ExecutiveMemoryId[];
  linkedIntentIds: readonly IntentIdentifier[];
  directRelationshipCount: number;
  readOnly: true;
}>;

export type ExecutiveIntentMemoryLinkQuery = Readonly<{
  intentId?: IntentIdentifier;
  memoryId?: ExecutiveMemoryId;
  workspaceId?: ExecutiveMemoryWorkspaceId;
  goalId?: string;
  scenarioId?: string;
  decisionId?: string;
  linkType?: ExecutiveIntentMemoryLinkType;
  relationship?: ExecutiveIntentMemoryLinkRelationship;
  lifecycle?: ExecutiveIntentMemoryLinkState;
}>;

export type ExecutiveIntentMemoryLinkEngineState = Readonly<{
  engineId: "executive-intent-memory-link-engine";
  contractVersion: string;
  initialized: boolean;
  linkCount: number;
  registeredIntentCount: number;
  timestamp: string;
  readOnly: true;
}>;
