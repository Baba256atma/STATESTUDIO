/**
 * APP-3:9 — Executive Intent evolution & lineage types.
 * Immutable evolution model — no history mutation or recommendations.
 */

import type {
  ExecutiveIntent,
  ExecutiveIntentWorkspaceId,
  IntentIdentifier,
  IntentVersion as ContractIntentVersion,
} from "./executiveIntentTypes.ts";
import type { IntentEvolutionDiagnostic } from "./executiveIntentEvolutionDiagnostics.ts";

export const EXECUTIVE_INTENT_EVOLUTION_ENGINE_VERSION = "APP-3/9" as const;

export type IntentEvolutionEventKind =
  | "created"
  | "updated"
  | "versioned"
  | "merged"
  | "split"
  | "replaced"
  | "superseded"
  | "archived"
  | "reactivated"
  | "imported"
  | "unknown";

export type IntentLineageRelationshipKind =
  | "parent"
  | "child"
  | "ancestor"
  | "descendant"
  | "sibling"
  | "merged_into"
  | "split_from"
  | "replaced_by"
  | "supersedes"
  | "root"
  | "leaf"
  | "unknown";

export type IntentEvolutionVersion = Readonly<{
  versionId: string;
  intentId: IntentIdentifier;
  semanticVersion: string;
  contractVersion: ContractIntentVersion;
  isActive: boolean;
  capturedAt: string;
  readOnly: true;
}>;

export type IntentRevision = Readonly<{
  revisionId: string;
  intentId: IntentIdentifier;
  fromVersion: string | null;
  toVersion: string;
  eventKind: IntentEvolutionEventKind;
  timestamp: string;
  readOnly: true;
}>;

export type IntentEvolutionEvent = Readonly<{
  eventId: string;
  intentId: IntentIdentifier;
  kind: IntentEvolutionEventKind;
  ruleId: string;
  label: string;
  explanation: string;
  timestamp: string;
  readOnly: true;
}>;

export type IntentAncestor = Readonly<{
  ancestorId: string;
  intentId: IntentIdentifier;
  relationship: IntentLineageRelationshipKind;
  depth: number;
  readOnly: true;
}>;

export type IntentDescendant = Readonly<{
  descendantId: string;
  intentId: IntentIdentifier;
  relationship: IntentLineageRelationshipKind;
  depth: number;
  readOnly: true;
}>;

export type IntentMerge = Readonly<{
  mergeId: string;
  targetIntentId: IntentIdentifier;
  sourceIntentIds: readonly IntentIdentifier[];
  timestamp: string;
  readOnly: true;
}>;

export type IntentSplit = Readonly<{
  splitId: string;
  parentIntentId: IntentIdentifier;
  childIntentIds: readonly IntentIdentifier[];
  timestamp: string;
  readOnly: true;
}>;

export type IntentReplacement = Readonly<{
  replacementId: string;
  replacedIntentId: IntentIdentifier;
  replacementIntentId: IntentIdentifier;
  timestamp: string;
  readOnly: true;
}>;

export type IntentLineageEdge = Readonly<{
  edgeId: string;
  fromIntentId: IntentIdentifier;
  toIntentId: IntentIdentifier;
  relationship: IntentLineageRelationshipKind;
  ruleId: string;
  readOnly: true;
}>;

export type IntentLineage = Readonly<{
  lineageId: string;
  workspaceId: ExecutiveIntentWorkspaceId;
  focusIntentId: IntentIdentifier;
  rootIntentId: IntentIdentifier | null;
  activeIntentId: IntentIdentifier | null;
  edges: readonly IntentLineageEdge[];
  ancestors: readonly IntentAncestor[];
  descendants: readonly IntentDescendant[];
  versions: readonly IntentEvolutionVersion[];
  readOnly: true;
}>;

export type IntentEvolutionTimeline = Readonly<{
  timelineId: string;
  focusIntentId: IntentIdentifier;
  events: readonly IntentEvolutionEvent[];
  revisions: readonly IntentRevision[];
  orderedIntentIds: readonly IntentIdentifier[];
  readOnly: true;
}>;

export type IntentEvolutionFlags = Readonly<{
  hasHistory: boolean;
  hasParent: boolean;
  hasChildren: boolean;
  merged: boolean;
  split: boolean;
  superseded: boolean;
  rootIntent: boolean;
  leafIntent: boolean;
  activeVersion: boolean;
  futureCompatible: true;
  readOnly: true;
  deterministic: true;
}>;

export type IntentEvolutionSummary = Readonly<{
  headline: string;
  focusIntentId: IntentIdentifier;
  rootIntentId: IntentIdentifier | null;
  activeIntentId: IntentIdentifier | null;
  versionCount: number;
  eventCount: number;
  ancestorCount: number;
  descendantCount: number;
  readOnly: true;
}>;

export type IntentEvolutionMetadata = Readonly<{
  evolutionEngineVersion: typeof EXECUTIVE_INTENT_EVOLUTION_ENGINE_VERSION;
  contractVersion: string;
  semanticModelVersion: string | null;
  rulesApplied: readonly string[];
  recordCount: number;
  readOnly: true;
}>;

export type IntentEvolutionResult = Readonly<{
  resultId: string;
  workspaceId: ExecutiveIntentWorkspaceId;
  status: "complete" | "partial" | "broken" | "unknown";
  focusIntentId: IntentIdentifier;
  lineage: IntentLineage;
  timeline: IntentEvolutionTimeline;
  merges: readonly IntentMerge[];
  splits: readonly IntentSplit[];
  replacements: readonly IntentReplacement[];
  flags: IntentEvolutionFlags;
  diagnostics: readonly IntentEvolutionDiagnostic[];
  summary: IntentEvolutionSummary;
  metadata: IntentEvolutionMetadata;
  timestamp: string;
  readOnly: true;
}>;

export type IntentEvolutionRecord = Readonly<{
  intent: ExecutiveIntent;
  semanticModelId: string | null;
  classificationId: string | null;
  dependencyResultId: string | null;
  readOnly: true;
}>;

export type IntentEvolutionBuildRequest = Readonly<{
  workspaceId: ExecutiveIntentWorkspaceId;
  records: readonly IntentEvolutionRecord[];
  focusIntentId: IntentIdentifier;
  timestamp: string;
  readOnly: true;
}>;

export type IntentLineageValidationResult = Readonly<{
  valid: boolean;
  issues: readonly string[];
  readOnly: true;
}>;

/** Reserved for APP-3:10 extension. */
export type IntentEvolutionFutureExtension = Readonly<{
  timelineVisualizationBindings: null;
  recommendationBindings: null;
  memorySyncBindings: null;
}>;

export const EVOLUTION_FUTURE_EXTENSION: IntentEvolutionFutureExtension = Object.freeze({
  timelineVisualizationBindings: null,
  recommendationBindings: null,
  memorySyncBindings: null,
});

export function createIntentEvolutionResult(
  input: Omit<IntentEvolutionResult, "readOnly">
): IntentEvolutionResult {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createIntentEvolutionRecord(
  input: Omit<IntentEvolutionRecord, "readOnly">
): IntentEvolutionRecord {
  return Object.freeze({ ...input, readOnly: true as const });
}
