/**
 * APP-3:9 — Executive Intent evolution rules.
 * Deterministic lineage from explicit contract relationships only.
 */

import type { ExecutiveIntent, IntentIdentifier, IntentRelation } from "./executiveIntentTypes.ts";
import type {
  IntentAncestor,
  IntentDescendant,
  IntentEvolutionEvent,
  IntentEvolutionEventKind,
  IntentEvolutionRecord,
  IntentEvolutionTimeline,
  IntentEvolutionVersion,
  IntentLineage,
  IntentLineageEdge,
  IntentLineageRelationshipKind,
  IntentMerge,
  IntentReplacement,
  IntentRevision,
  IntentSplit,
} from "./executiveIntentEvolutionTypes.ts";

export const EXECUTIVE_INTENT_EVOLUTION_RULES_VERSION = "APP-3/9-RULES-1" as const;

export const EVOLUTION_RULE_IDS = Object.freeze([
  "RULE_RELATION_PARENT",
  "RULE_RELATION_CHILD",
  "RULE_RELATION_SUPERSEDES",
  "RULE_CUSTOM_MERGE",
  "RULE_CUSTOM_SPLIT",
  "RULE_CUSTOM_REPLACEMENT",
  "RULE_REFERENCE_MERGE",
  "RULE_REFERENCE_SPLIT",
  "RULE_LIFECYCLE_CREATED",
  "RULE_LIFECYCLE_UPDATED",
  "RULE_LIFECYCLE_ARCHIVED",
  "RULE_LIFECYCLE_REACTIVATED",
  "RULE_SOURCE_IMPORTED",
  "RULE_VERSION_CHAIN",
  "RULE_UNKNOWN_HISTORY",
  "RULE_BROKEN_LINEAGE",
] as const);

export type EvolutionRuleId = (typeof EVOLUTION_RULE_IDS)[number];

export const EVOLUTION_EVENT_ORDER = Object.freeze([
  "created",
  "imported",
  "updated",
  "versioned",
  "split",
  "merged",
  "replaced",
  "superseded",
  "reactivated",
  "archived",
  "unknown",
] as const satisfies readonly IntentEvolutionEventKind[]);

function deterministicId(prefix: string, payload: string): string {
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
  }
  return `${prefix}-${hash.toString(16).padStart(8, "0")}`;
}

function parseSemanticVersion(value: string): readonly number[] {
  return value.split(".").map((part) => Number.parseInt(part, 10) || 0);
}

export function compareSemanticVersions(left: string, right: string): number {
  const leftParts = parseSemanticVersion(left);
  const rightParts = parseSemanticVersion(right);
  const length = Math.max(leftParts.length, rightParts.length);
  for (let index = 0; index < length; index += 1) {
    const diff = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

function intentById(
  records: readonly IntentEvolutionRecord[]
): Readonly<Map<IntentIdentifier, ExecutiveIntent>> {
  return new Map(records.map((record) => [record.intent.intentId, record.intent]));
}

function createEdge(input: Readonly<{
  fromIntentId: IntentIdentifier;
  toIntentId: IntentIdentifier;
  relationship: IntentLineageRelationshipKind;
  ruleId: EvolutionRuleId;
}>): IntentLineageEdge {
  return Object.freeze({
    edgeId: deterministicId("lineage-edge", `${input.fromIntentId}:${input.toIntentId}:${input.relationship}`),
    fromIntentId: input.fromIntentId,
    toIntentId: input.toIntentId,
    relationship: input.relationship,
    ruleId: input.ruleId,
    readOnly: true as const,
  });
}

function createEvent(input: Readonly<{
  intentId: IntentIdentifier;
  kind: IntentEvolutionEventKind;
  ruleId: EvolutionRuleId;
  label: string;
  explanation: string;
  timestamp: string;
}>): IntentEvolutionEvent {
  return Object.freeze({
    eventId: deterministicId("evolution-event", `${input.intentId}:${input.kind}:${input.timestamp}`),
    intentId: input.intentId,
    kind: input.kind,
    ruleId: input.ruleId,
    label: input.label,
    explanation: input.explanation,
    timestamp: input.timestamp,
    readOnly: true as const,
  });
}

export function extractExplicitLineageEdges(
  records: readonly IntentEvolutionRecord[]
): readonly IntentLineageEdge[] {
  const edges: IntentLineageEdge[] = [];
  const knownIds = new Set(records.map((record) => record.intent.intentId));

  for (const record of records) {
    const intent = record.intent;

    for (const relation of intent.relations) {
      edges.push(...edgesFromRelation(intent.intentId, relation, knownIds));
    }

    for (const reference of intent.metadata.references) {
      if (reference.referenceType === "merge_source" && reference.targetId) {
        edges.push(
          createEdge({
            fromIntentId: reference.targetId,
            toIntentId: intent.intentId,
            relationship: "merged_into",
            ruleId: "RULE_REFERENCE_MERGE",
          })
        );
      }
      if (reference.referenceType === "split_from" && reference.targetId) {
        edges.push(
          createEdge({
            fromIntentId: reference.targetId,
            toIntentId: intent.intentId,
            relationship: "split_from",
            ruleId: "RULE_REFERENCE_SPLIT",
          })
        );
      }
    }

    const mergedFrom = intent.metadata.customMetadata["lineage.mergedFrom"];
    if (mergedFrom) {
      for (const sourceId of mergedFrom.split(",").map((entry) => entry.trim()).filter(Boolean)) {
        edges.push(
          createEdge({
            fromIntentId: sourceId,
            toIntentId: intent.intentId,
            relationship: "merged_into",
            ruleId: "RULE_CUSTOM_MERGE",
          })
        );
        if (!knownIds.has(sourceId)) {
          edges.push(
            createEdge({
              fromIntentId: sourceId,
              toIntentId: intent.intentId,
              relationship: "unknown",
              ruleId: "RULE_BROKEN_LINEAGE",
            })
          );
        }
      }
    }

    const splitFrom = intent.metadata.customMetadata["lineage.splitFrom"];
    if (splitFrom) {
      edges.push(
        createEdge({
          fromIntentId: splitFrom,
          toIntentId: intent.intentId,
          relationship: "split_from",
          ruleId: "RULE_CUSTOM_SPLIT",
        })
      );
      if (!knownIds.has(splitFrom)) {
        edges.push(
          createEdge({
            fromIntentId: splitFrom,
            toIntentId: intent.intentId,
            relationship: "unknown",
            ruleId: "RULE_BROKEN_LINEAGE",
          })
        );
      }
    }

    const replacedIntentId = intent.metadata.customMetadata["lineage.replacedIntentId"];
    if (replacedIntentId) {
      edges.push(
        createEdge({
          fromIntentId: replacedIntentId,
          toIntentId: intent.intentId,
          relationship: "replaced_by",
          ruleId: "RULE_CUSTOM_REPLACEMENT",
        })
      );
      if (!knownIds.has(replacedIntentId)) {
        edges.push(
          createEdge({
            fromIntentId: replacedIntentId,
            toIntentId: intent.intentId,
            relationship: "unknown",
            ruleId: "RULE_BROKEN_LINEAGE",
          })
        );
      }
    }
  }

  return Object.freeze(sortEdges(deduplicateEdges(edges)));
}

function edgesFromRelation(
  ownerIntentId: IntentIdentifier,
  relation: IntentRelation,
  knownIds: ReadonlySet<IntentIdentifier>
): IntentLineageEdge[] {
  const edges: IntentLineageEdge[] = [];
  const addBroken = (fromId: IntentIdentifier, toId: IntentIdentifier) => {
    if (!knownIds.has(fromId) || !knownIds.has(toId)) {
      edges.push(
        createEdge({
          fromIntentId: fromId,
          toIntentId: toId,
          relationship: "unknown",
          ruleId: "RULE_BROKEN_LINEAGE",
        })
      );
    }
  };

  switch (relation.relationType) {
    case "parent":
      edges.push(
        createEdge({
          fromIntentId: relation.sourceIntentId,
          toIntentId: relation.targetIntentId,
          relationship: "parent",
          ruleId: "RULE_RELATION_PARENT",
        })
      );
      addBroken(relation.sourceIntentId, relation.targetIntentId);
      break;
    case "child":
      edges.push(
        createEdge({
          fromIntentId: relation.targetIntentId,
          toIntentId: relation.sourceIntentId,
          relationship: "parent",
          ruleId: "RULE_RELATION_CHILD",
        })
      );
      addBroken(relation.targetIntentId, relation.sourceIntentId);
      break;
    case "supersedes":
      edges.push(
        createEdge({
          fromIntentId: relation.targetIntentId,
          toIntentId: relation.sourceIntentId,
          relationship: "supersedes",
          ruleId: "RULE_RELATION_SUPERSEDES",
        })
      );
      addBroken(relation.targetIntentId, relation.sourceIntentId);
      break;
    default:
      break;
  }

  return edges;
}

export function deduplicateEdges(edges: readonly IntentLineageEdge[]): readonly IntentLineageEdge[] {
  const seen = new Set<string>();
  const unique: IntentLineageEdge[] = [];
  for (const edge of edges) {
    const key = `${edge.fromIntentId}:${edge.toIntentId}:${edge.relationship}:${edge.ruleId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(edge);
  }
  return unique;
}

export function sortEdges(edges: readonly IntentLineageEdge[]): readonly IntentLineageEdge[] {
  return Object.freeze(
    [...edges].sort((left, right) => left.edgeId.localeCompare(right.edgeId))
  );
}

export function resolveIntentVersions(
  records: readonly IntentEvolutionRecord[],
  activeIntentId: IntentIdentifier | null
): readonly IntentEvolutionVersion[] {
  return Object.freeze(
    [...records]
      .map((record) =>
        Object.freeze({
          versionId: record.intent.metadata.version.versionId,
          intentId: record.intent.intentId,
          semanticVersion: record.intent.metadata.version.semanticVersion,
          contractVersion: record.intent.metadata.version,
          isActive: record.intent.intentId === activeIntentId,
          capturedAt: record.intent.metadata.updatedAt,
          readOnly: true as const,
        })
      )
      .sort((left, right) => compareSemanticVersions(left.semanticVersion, right.semanticVersion))
  );
}

export function resolveActiveIntentId(
  records: readonly IntentEvolutionRecord[],
  lineageIntentIds: readonly IntentIdentifier[]
): IntentIdentifier | null {
  const candidates = records
    .filter((record) => lineageIntentIds.includes(record.intent.intentId))
    .filter((record) => record.intent.metadata.status === "active")
    .sort((left, right) => {
      const versionDiff = compareSemanticVersions(
        right.intent.metadata.version.semanticVersion,
        left.intent.metadata.version.semanticVersion
      );
      if (versionDiff !== 0) return versionDiff;
      return right.intent.metadata.updatedAt.localeCompare(left.intent.metadata.updatedAt);
    });
  return candidates[0]?.intent.intentId ?? null;
}

export function resolveRootIntentId(
  focusIntentId: IntentIdentifier,
  edges: readonly IntentLineageEdge[],
  records: readonly IntentEvolutionRecord[]
): IntentIdentifier | null {
  const parentMap = new Map<IntentIdentifier, IntentIdentifier[]>();
  for (const edge of edges) {
    if (
      edge.relationship === "parent" ||
      edge.relationship === "supersedes" ||
      edge.relationship === "split_from" ||
      edge.relationship === "merged_into" ||
      edge.relationship === "replaced_by"
    ) {
      const parents = parentMap.get(edge.toIntentId) ?? [];
      parents.push(edge.fromIntentId);
      parentMap.set(edge.toIntentId, parents);
    }
  }

  let current: IntentIdentifier | null = focusIntentId;
  const visited = new Set<IntentIdentifier>();
  while (current && parentMap.has(current)) {
    if (visited.has(current)) return null;
    visited.add(current);
    const parents = parentMap.get(current)!;
    current = parents.sort()[0] ?? null;
  }

  if (current) return current;

  const explicitRoot = records.find(
    (record) => record.intent.metadata.customMetadata["lineage.rootIntentId"]
  )?.intent.metadata.customMetadata["lineage.rootIntentId"];
  return explicitRoot ?? focusIntentId;
}

export function resolveAncestors(
  focusIntentId: IntentIdentifier,
  edges: readonly IntentLineageEdge[]
): readonly IntentAncestor[] {
  const ancestors: IntentAncestor[] = [];
  const queue: Array<{ intentId: IntentIdentifier; depth: number }> = [{ intentId: focusIntentId, depth: 0 }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const edge of edges) {
      if (edge.toIntentId !== current.intentId) continue;
      if (
        edge.relationship !== "parent" &&
        edge.relationship !== "supersedes" &&
        edge.relationship !== "split_from" &&
        edge.relationship !== "merged_into" &&
        edge.relationship !== "replaced_by"
      ) {
        continue;
      }
      const key = `${edge.fromIntentId}:${current.depth + 1}`;
      if (visited.has(key)) continue;
      visited.add(key);
      ancestors.push(
        Object.freeze({
          ancestorId: deterministicId("ancestor", key),
          intentId: edge.fromIntentId,
          relationship: mapToAncestorRelationship(edge.relationship),
          depth: current.depth + 1,
          readOnly: true as const,
        })
      );
      queue.push({ intentId: edge.fromIntentId, depth: current.depth + 1 });
    }
  }

  return Object.freeze(
    ancestors.sort((left, right) => left.depth - right.depth || left.intentId.localeCompare(right.intentId))
  );
}

export function resolveDescendants(
  focusIntentId: IntentIdentifier,
  edges: readonly IntentLineageEdge[]
): readonly IntentDescendant[] {
  const descendants: IntentDescendant[] = [];
  const queue: Array<{ intentId: IntentIdentifier; depth: number }> = [{ intentId: focusIntentId, depth: 0 }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const edge of edges) {
      if (edge.fromIntentId !== current.intentId) continue;
      if (
        edge.relationship !== "parent" &&
        edge.relationship !== "supersedes" &&
        edge.relationship !== "split_from" &&
        edge.relationship !== "merged_into" &&
        edge.relationship !== "replaced_by"
      ) {
        continue;
      }
      const key = `${edge.toIntentId}:${current.depth + 1}`;
      if (visited.has(key)) continue;
      visited.add(key);
      descendants.push(
        Object.freeze({
          descendantId: deterministicId("descendant", key),
          intentId: edge.toIntentId,
          relationship: mapToDescendantRelationship(edge.relationship),
          depth: current.depth + 1,
          readOnly: true as const,
        })
      );
      queue.push({ intentId: edge.toIntentId, depth: current.depth + 1 });
    }
  }

  return Object.freeze(
    descendants.sort((left, right) => left.depth - right.depth || left.intentId.localeCompare(right.intentId))
  );
}

function mapToAncestorRelationship(
  relationship: IntentLineageRelationshipKind
): IntentLineageRelationshipKind {
  if (relationship === "supersedes") return "ancestor";
  if (relationship === "merged_into") return "ancestor";
  if (relationship === "split_from") return "parent";
  if (relationship === "replaced_by") return "ancestor";
  return "ancestor";
}

function mapToDescendantRelationship(
  relationship: IntentLineageRelationshipKind
): IntentLineageRelationshipKind {
  if (relationship === "supersedes") return "descendant";
  if (relationship === "merged_into") return "descendant";
  if (relationship === "split_from") return "child";
  if (relationship === "replaced_by") return "descendant";
  return "descendant";
}

export function resolveMergeHistory(
  records: readonly IntentEvolutionRecord[]
): readonly IntentMerge[] {
  const merges: IntentMerge[] = [];
  for (const record of records) {
    const sources = [
      ...record.intent.metadata.references
        .filter((reference) => reference.referenceType === "merge_source")
        .map((reference) => reference.targetId),
      ...(record.intent.metadata.customMetadata["lineage.mergedFrom"]?.split(",").map((entry) => entry.trim()) ??
        []),
    ].filter(Boolean);
    if (sources.length === 0) continue;
    merges.push(
      Object.freeze({
        mergeId: deterministicId("merge", record.intent.intentId),
        targetIntentId: record.intent.intentId,
        sourceIntentIds: Object.freeze([...new Set(sources)].sort()),
        timestamp: record.intent.metadata.updatedAt,
        readOnly: true as const,
      })
    );
  }
  return Object.freeze(merges.sort((left, right) => left.mergeId.localeCompare(right.mergeId)));
}

export function resolveSplitHistory(
  records: readonly IntentEvolutionRecord[]
): readonly IntentSplit[] {
  const splitMap = new Map<IntentIdentifier, Set<IntentIdentifier>>();
  for (const record of records) {
    const parentId =
      record.intent.metadata.customMetadata["lineage.splitFrom"] ??
      record.intent.metadata.references.find((reference) => reference.referenceType === "split_from")
        ?.targetId;
    if (!parentId) continue;
    const children = splitMap.get(parentId) ?? new Set();
    children.add(record.intent.intentId);
    splitMap.set(parentId, children);
  }

  return Object.freeze(
    [...splitMap.entries()]
      .map(([parentIntentId, childIntentIds]) =>
        Object.freeze({
          splitId: deterministicId("split", parentIntentId),
          parentIntentId,
          childIntentIds: Object.freeze([...childIntentIds].sort()),
          timestamp:
            records.find((record) => record.intent.intentId === parentIntentId)?.intent.metadata.updatedAt ??
            "",
          readOnly: true as const,
        })
      )
      .sort((left, right) => left.splitId.localeCompare(right.splitId))
  );
}

export function resolveReplacementHistory(
  records: readonly IntentEvolutionRecord[],
  edges: readonly IntentLineageEdge[]
): readonly IntentReplacement[] {
  const replacements: IntentReplacement[] = [];
  for (const edge of edges) {
    if (edge.relationship !== "supersedes" && edge.relationship !== "replaced_by") continue;
    replacements.push(
      Object.freeze({
        replacementId: deterministicId("replacement", `${edge.fromIntentId}:${edge.toIntentId}`),
        replacedIntentId: edge.fromIntentId,
        replacementIntentId: edge.toIntentId,
        timestamp:
          records.find((record) => record.intent.intentId === edge.toIntentId)?.intent.metadata.updatedAt ??
          "",
        readOnly: true as const,
      })
    );
  }
  return Object.freeze(
    replacements.sort((left, right) => left.replacementId.localeCompare(right.replacementId))
  );
}

export function buildEvolutionEvents(
  records: readonly IntentEvolutionRecord[],
  edges: readonly IntentLineageEdge[],
  focusIntentId: IntentIdentifier,
  timestamp: string
): readonly IntentEvolutionEvent[] {
  const events: IntentEvolutionEvent[] = [];
  const intentMap = intentById(records);

  for (const record of records) {
    const intent = record.intent;
    const meta = intent.metadata;

    if (meta.lifecycle === "created") {
      events.push(
        createEvent({
          intentId: intent.intentId,
          kind: "created",
          ruleId: "RULE_LIFECYCLE_CREATED",
          label: "Intent created",
          explanation: "Lifecycle stage indicates intent creation.",
          timestamp: meta.createdAt,
        })
      );
    }

    if (meta.source === "imported") {
      events.push(
        createEvent({
          intentId: intent.intentId,
          kind: "imported",
          ruleId: "RULE_SOURCE_IMPORTED",
          label: "Intent imported",
          explanation: "Intent source is imported.",
          timestamp: meta.createdAt,
        })
      );
    }

    if (meta.lifecycle === "updated" || meta.updatedAt !== meta.createdAt) {
      events.push(
        createEvent({
          intentId: intent.intentId,
          kind: "updated",
          ruleId: "RULE_LIFECYCLE_UPDATED",
          label: "Intent updated",
          explanation: "Intent metadata updated.",
          timestamp: meta.updatedAt,
        })
      );
    }

    if (meta.status === "archived" || meta.lifecycle === "archived") {
      events.push(
        createEvent({
          intentId: intent.intentId,
          kind: "archived",
          ruleId: "RULE_LIFECYCLE_ARCHIVED",
          label: "Intent archived",
          explanation: "Intent archived in lifecycle.",
          timestamp: meta.updatedAt,
        })
      );
    }

    if (meta.status === "active" && meta.lifecycle === "activated" && meta.updatedAt !== meta.createdAt) {
      events.push(
        createEvent({
          intentId: intent.intentId,
          kind: "reactivated",
          ruleId: "RULE_LIFECYCLE_REACTIVATED",
          label: "Intent reactivated",
          explanation: "Intent returned to active lifecycle.",
          timestamp: meta.updatedAt,
        })
      );
    }
  }

  for (const edge of edges) {
    if (edge.toIntentId !== focusIntentId && edge.fromIntentId !== focusIntentId) continue;
    if (edge.relationship === "supersedes" || edge.relationship === "replaced_by") {
      events.push(
        createEvent({
          intentId: edge.toIntentId,
          kind: "replaced",
          ruleId: edge.ruleId,
          label: "Intent replaced",
          explanation: `Intent ${edge.toIntentId} replaces ${edge.fromIntentId}.`,
          timestamp:
            intentMap.get(edge.toIntentId)?.metadata.updatedAt ?? timestamp,
        })
      );
      events.push(
        createEvent({
          intentId: edge.fromIntentId,
          kind: "superseded",
          ruleId: edge.ruleId,
          label: "Intent superseded",
          explanation: `Intent ${edge.fromIntentId} superseded by ${edge.toIntentId}.`,
          timestamp:
            intentMap.get(edge.fromIntentId)?.metadata.updatedAt ?? timestamp,
        })
      );
    }
    if (edge.relationship === "merged_into") {
      events.push(
        createEvent({
          intentId: edge.toIntentId,
          kind: "merged",
          ruleId: edge.ruleId,
          label: "Intent merged",
          explanation: `Intent ${edge.fromIntentId} merged into ${edge.toIntentId}.`,
          timestamp: intentMap.get(edge.toIntentId)?.metadata.updatedAt ?? timestamp,
        })
      );
    }
    if (edge.relationship === "split_from") {
      events.push(
        createEvent({
          intentId: edge.toIntentId,
          kind: "split",
          ruleId: edge.ruleId,
          label: "Intent split",
          explanation: `Intent ${edge.toIntentId} split from ${edge.fromIntentId}.`,
          timestamp: intentMap.get(edge.toIntentId)?.metadata.updatedAt ?? timestamp,
        })
      );
    }
  }

  const versions = resolveIntentVersions(records, null);
  const focusVersions = versions.filter((version) => {
    const ancestors = resolveAncestors(focusIntentId, edges);
    const ids = new Set([focusIntentId, ...ancestors.map((entry) => entry.intentId)]);
    return ids.has(version.intentId);
  });
  if (focusVersions.length > 1) {
    events.push(
      createEvent({
        intentId: focusIntentId,
        kind: "versioned",
        ruleId: "RULE_VERSION_CHAIN",
        label: "Version chain detected",
        explanation: `${focusVersions.length} explicit versions in lineage.`,
        timestamp,
      })
    );
  }

  if (events.length === 0) {
    events.push(
      createEvent({
        intentId: focusIntentId,
        kind: "unknown",
        ruleId: "RULE_UNKNOWN_HISTORY",
        label: "Unknown evolution history",
        explanation: "No explicit evolution events detected.",
        timestamp,
      })
    );
  }

  return sortEvents(deduplicateEvents(events));
}

export function deduplicateEvents(events: readonly IntentEvolutionEvent[]): readonly IntentEvolutionEvent[] {
  const seen = new Set<string>();
  const unique: IntentEvolutionEvent[] = [];
  for (const event of events) {
    const key = `${event.intentId}:${event.kind}:${event.ruleId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(event);
  }
  return unique;
}

export function sortEvents(events: readonly IntentEvolutionEvent[]): readonly IntentEvolutionEvent[] {
  return Object.freeze(
    [...events].sort((left, right) => {
      const timeDiff = left.timestamp.localeCompare(right.timestamp);
      if (timeDiff !== 0) return timeDiff;
      const kindDiff =
        EVOLUTION_EVENT_ORDER.indexOf(left.kind) - EVOLUTION_EVENT_ORDER.indexOf(right.kind);
      if (kindDiff !== 0) return kindDiff;
      return left.eventId.localeCompare(right.eventId);
    })
  );
}

export function buildEvolutionRevisions(
  events: readonly IntentEvolutionEvent[],
  records: readonly IntentEvolutionRecord[]
): readonly IntentRevision[] {
  const versionByIntent = new Map(
    records.map((record) => [record.intent.intentId, record.intent.metadata.version.semanticVersion])
  );
  return Object.freeze(
    events
      .filter((event) => ["versioned", "replaced", "updated", "created"].includes(event.kind))
      .map((event) =>
        Object.freeze({
          revisionId: deterministicId("revision", event.eventId),
          intentId: event.intentId,
          fromVersion: null,
          toVersion: versionByIntent.get(event.intentId) ?? "unknown",
          eventKind: event.kind,
          timestamp: event.timestamp,
          readOnly: true as const,
        })
      )
      .sort((left, right) => left.timestamp.localeCompare(right.timestamp))
  );
}

export function buildLineageGraph(
  request: Readonly<{
    workspaceId: string;
    focusIntentId: IntentIdentifier;
    records: readonly IntentEvolutionRecord[];
    edges: readonly IntentLineageEdge[];
  }>
): IntentLineage {
  const lineageIntentIds = collectLineageIntentIds(request.focusIntentId, request.edges);
  const rootIntentId = resolveRootIntentId(request.focusIntentId, request.edges, request.records);
  const activeIntentId = resolveActiveIntentId(request.records, lineageIntentIds);
  const ancestors = resolveAncestors(request.focusIntentId, request.edges);
  const descendants = resolveDescendants(request.focusIntentId, request.edges);
  const versions = resolveIntentVersions(request.records, activeIntentId);

  return Object.freeze({
    lineageId: deterministicId("lineage", `${request.workspaceId}:${request.focusIntentId}`),
    workspaceId: request.workspaceId,
    focusIntentId: request.focusIntentId,
    rootIntentId,
    activeIntentId,
    edges: request.edges,
    ancestors,
    descendants,
    versions,
    readOnly: true as const,
  });
}

function collectLineageIntentIds(
  focusIntentId: IntentIdentifier,
  edges: readonly IntentLineageEdge[]
): IntentIdentifier[] {
  const ids = new Set<IntentIdentifier>([focusIntentId]);
  for (const edge of edges) {
    ids.add(edge.fromIntentId);
    ids.add(edge.toIntentId);
  }
  return [...ids].sort();
}

export function buildEvolutionTimelineFromParts(input: Readonly<{
  focusIntentId: IntentIdentifier;
  events: readonly IntentEvolutionEvent[];
  revisions: readonly IntentRevision[];
}>): IntentEvolutionTimeline {
  const orderedIntentIds = Object.freeze(
    [...new Set(input.events.map((event) => event.intentId))].sort()
  );
  return Object.freeze({
    timelineId: deterministicId("timeline", input.focusIntentId),
    focusIntentId: input.focusIntentId,
    events: input.events,
    revisions: input.revisions,
    orderedIntentIds,
    readOnly: true as const,
  });
}

export function collectEvolutionRulesApplied(
  edges: readonly IntentLineageEdge[],
  events: readonly IntentEvolutionEvent[]
): readonly string[] {
  return Object.freeze(
    [...new Set([...edges.map((edge) => edge.ruleId), ...events.map((event) => event.ruleId)])].sort()
  );
}

export function hasMultipleParents(
  focusIntentId: IntentIdentifier,
  edges: readonly IntentLineageEdge[]
): boolean {
  const parents = edges.filter(
    (edge) =>
      edge.toIntentId === focusIntentId &&
      (edge.relationship === "parent" || edge.relationship === "split_from")
  );
  const uniqueParents = new Set(parents.map((edge) => edge.fromIntentId));
  return uniqueParents.size > 1;
}

export function hasBrokenLineage(edges: readonly IntentLineageEdge[]): boolean {
  return edges.some((edge) => edge.ruleId === "RULE_BROKEN_LINEAGE" || edge.relationship === "unknown");
}

export function resolveIntentVersionForRecord(
  record: IntentEvolutionRecord,
  isActive: boolean
): IntentEvolutionVersion {
  return Object.freeze({
    versionId: record.intent.metadata.version.versionId,
    intentId: record.intent.intentId,
    semanticVersion: record.intent.metadata.version.semanticVersion,
    contractVersion: record.intent.metadata.version,
    isActive,
    capturedAt: record.intent.metadata.updatedAt,
    readOnly: true as const,
  });
}

export function resolveSiblingIntentIds(
  focusIntentId: IntentIdentifier,
  edges: readonly IntentLineageEdge[]
): readonly IntentIdentifier[] {
  const parents = edges
    .filter((edge) => edge.toIntentId === focusIntentId && edge.relationship === "parent")
    .map((edge) => edge.fromIntentId);
  const siblings = new Set<IntentIdentifier>();
  for (const parentId of parents) {
    for (const edge of edges) {
      if (edge.fromIntentId === parentId && edge.relationship === "parent" && edge.toIntentId !== focusIntentId) {
        siblings.add(edge.toIntentId);
      }
    }
  }
  return Object.freeze([...siblings].sort());
}
