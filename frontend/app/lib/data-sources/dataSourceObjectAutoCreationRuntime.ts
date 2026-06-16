import type { DataSourceRegistryEntry } from "./dataSourceRegistryContract.ts";
import { listDataSources } from "./dataSourceRegistryRuntime.ts";
import type { DataSourceMappedObjectType } from "./dataSourceObjectMappingContract.ts";
import { mapSourceToObjectType } from "./dataSourceObjectMappingRuntime.ts";
import { generateTopology } from "../scene/topology/topologyEngine.ts";
import type { TopologyNode } from "../scene/topology/topologyTypes.ts";
import {
  type DataSourceCreatedObject,
  type DataSourceDiscoveredRecord,
  type DataSourceDiscoveryResult,
  type DataSourceObjectCandidate,
  type DataSourceObjectCreationResult,
  type DataSourceObjectPipelineResult,
  type DataSourceObjectRelationship,
  type DataSourceTopologyAssignment,
} from "./dataSourceObjectAutoCreationContract.ts";

const RELATIONSHIP_CHAIN: readonly DataSourceMappedObjectType[] = Object.freeze([
  "supplier",
  "inventory",
  "production",
  "revenue",
]);

let createdObjects: DataSourceCreatedObject[] = [];
const createdFingerprints = new Set<string>();

function nowIso(): string {
  return new Date().toISOString();
}

function normalizeLabel(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeFingerprint(sourceId: string, label: string, objectType: DataSourceMappedObjectType): string {
  return `${sourceId}:${objectType}:${label.trim().toLowerCase()}`;
}

function findSource(sourceId: string): DataSourceRegistryEntry | null {
  return listDataSources().find((source) => source.sourceId === sourceId) ?? null;
}

export function resetDataSourceObjectAutoCreationForTests(): void {
  createdObjects = [];
  createdFingerprints.clear();
}

export function listDataSourceCreatedObjects(): readonly DataSourceCreatedObject[] {
  return Object.freeze(createdObjects.map((object) => Object.freeze({ ...object })));
}

export function discoverSourceRecords(
  source: DataSourceRegistryEntry,
  explicitRecords?: readonly Readonly<{ label: unknown }>[]
): DataSourceDiscoveryResult {
  const mapping = mapSourceToObjectType(source);
  const rows =
    explicitRecords ??
    Array.from({ length: Math.max(0, source.recordCount) }, (_, index) =>
      Object.freeze({
        label: `${mapping.objectTypeLabel} ${index + 1}`,
      })
    );

  const records = Object.freeze(
    rows.map((row, index): DataSourceDiscoveredRecord => {
      const label = normalizeLabel(row.label) || `${mapping.objectTypeLabel} ${index + 1}`;
      return Object.freeze({
        recordId: `record:${source.sourceId}:${index + 1}`,
        sourceId: source.sourceId,
        label,
        objectType: mapping.objectType,
        rowIndex: index,
      });
    })
  );

  return Object.freeze({
    source,
    records,
    recordCount: records.length,
  });
}

export function generateObjectCandidates(
  discovery: DataSourceDiscoveryResult
): readonly DataSourceObjectCandidate[] {
  const mapping = mapSourceToObjectType(discovery.source);
  return Object.freeze(
    discovery.records.map((record): DataSourceObjectCandidate => {
      const fingerprint = normalizeFingerprint(record.sourceId, record.label, record.objectType);
      return Object.freeze({
        candidateId: `candidate:${record.recordId}`,
        sourceId: record.sourceId,
        recordId: record.recordId,
        label: record.label,
        objectType: record.objectType,
        objectTypeLabel: mapping.objectTypeLabel,
        fingerprint,
      });
    })
  );
}

export function isDuplicateObjectCandidate(candidate: DataSourceObjectCandidate): boolean {
  return createdFingerprints.has(candidate.fingerprint);
}

export function createObjectsFromCandidates(
  candidates: readonly DataSourceObjectCandidate[]
): DataSourceObjectCreationResult {
  const timestamp = nowIso();
  const created: DataSourceCreatedObject[] = [];
  let skippedDuplicates = 0;

  for (const candidate of candidates) {
    if (createdFingerprints.has(candidate.fingerprint)) {
      skippedDuplicates += 1;
      continue;
    }
    const objectId = `ds-object:${candidate.sourceId}:${candidate.recordId}`;
    const next = Object.freeze({
      objectId,
      sourceId: candidate.sourceId,
      candidateId: candidate.candidateId,
      label: candidate.label,
      objectType: candidate.objectType,
      createdAt: timestamp,
    });
    createdFingerprints.add(candidate.fingerprint);
    created.push(next);
  }

  createdObjects = [...createdObjects, ...created];
  return Object.freeze({
    success: true,
    created: Object.freeze(created),
    skippedDuplicates,
    reason: created.length > 0 ? "objects_created" : skippedDuplicates > 0 ? "duplicates_skipped" : "no_candidates",
  });
}

export function detectSourceRelationships(
  objects: readonly DataSourceCreatedObject[]
): readonly DataSourceObjectRelationship[] {
  const byType = new Map<DataSourceMappedObjectType, DataSourceCreatedObject>();
  for (const object of objects) {
    if (!byType.has(object.objectType)) {
      byType.set(object.objectType, object);
    }
  }

  const relationships: DataSourceObjectRelationship[] = [];
  for (let index = 0; index < RELATIONSHIP_CHAIN.length - 1; index += 1) {
    const fromType = RELATIONSHIP_CHAIN[index];
    const toType = RELATIONSHIP_CHAIN[index + 1];
    const from = byType.get(fromType);
    const to = byType.get(toType);
    if (!from || !to) continue;
    relationships.push(
      Object.freeze({
        relationshipId: `rel:${from.objectId}:${to.objectId}`,
        sourceObjectId: from.objectId,
        targetObjectId: to.objectId,
        relationshipType: "feeds",
        confidence: "high",
      })
    );
  }

  if (relationships.length === 0 && objects.length > 1) {
    for (let index = 0; index < objects.length - 1; index += 1) {
      const from = objects[index];
      const to = objects[index + 1];
      if (!from || !to) continue;
      relationships.push(
        Object.freeze({
          relationshipId: `rel:${from.objectId}:${to.objectId}`,
          sourceObjectId: from.objectId,
          targetObjectId: to.objectId,
          relationshipType: "depends_on",
          confidence: "medium",
        })
      );
    }
  }

  return Object.freeze(relationships);
}

export function assignObjectTopology(
  objects: readonly DataSourceCreatedObject[]
): readonly DataSourceTopologyAssignment[] {
  if (objects.length === 0) return Object.freeze([]);

  const nodes: TopologyNode[] = objects.map((object) => ({
    id: object.objectId,
    name: object.label,
  }));
  const layout = generateTopology("flow", nodes);

  return Object.freeze(
    layout.nodes.map((node, index): DataSourceTopologyAssignment => {
      const position = node.position
        ? ([node.position.x, node.position.y, node.position.z] as const)
        : ([index * 2.4, 0, 0] as const);
      return Object.freeze({
        topology: String(layout.topology),
        objectId: node.id,
        position,
      });
    })
  );
}

export function runDataSourceObjectAutoCreation(input: {
  sourceId: string;
  explicitRecords?: readonly Readonly<{ label: unknown }>[];
}): DataSourceObjectPipelineResult | null {
  const source = findSource(input.sourceId);
  if (!source) return null;

  const discovery = discoverSourceRecords(source, input.explicitRecords);
  const candidates = generateObjectCandidates(discovery);
  const creation = createObjectsFromCandidates(candidates);
  const allObjects = listDataSourceCreatedObjects().filter((object) => object.sourceId === source.sourceId);
  const relationships = detectSourceRelationships(allObjects);
  const topology = assignObjectTopology(allObjects);

  return Object.freeze({
    discovery,
    candidates,
    creation,
    relationships,
    topology,
    sceneMutation: false,
    usesLegacyRouter: false,
  });
}
