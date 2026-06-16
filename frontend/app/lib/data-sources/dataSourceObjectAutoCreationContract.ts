/**
 * DS:2 — Data Source Object Auto Creation contract.
 *
 * Canonical Data → Object pipeline. Does not mutate scene topology directly.
 */

import type { DataSourceRegistryEntry } from "./dataSourceRegistryContract.ts";
import type { DataSourceMappedObjectType } from "./dataSourceObjectMappingContract.ts";

export const DS_2_OBJECT_AUTO_CREATION_TAG = "[DS:2_OBJECT_AUTO_CREATION]" as const;

export const DS2_CERTIFIED_TAG = "[DS2_CERTIFIED]" as const;
export const DATA_OBJECT_PIPELINE_COMPLETE_TAG = "[DATA_OBJECT_PIPELINE_COMPLETE]" as const;

export type DataSourceDiscoveredRecord = Readonly<{
  recordId: string;
  sourceId: string;
  label: string;
  objectType: DataSourceMappedObjectType;
  rowIndex: number;
}>;

export type DataSourceDiscoveryResult = Readonly<{
  source: DataSourceRegistryEntry;
  records: readonly DataSourceDiscoveredRecord[];
  recordCount: number;
}>;

export type DataSourceObjectCandidate = Readonly<{
  candidateId: string;
  sourceId: string;
  recordId: string;
  label: string;
  objectType: DataSourceMappedObjectType;
  objectTypeLabel: string;
  fingerprint: string;
}>;

export type DataSourceCreatedObject = Readonly<{
  objectId: string;
  sourceId: string;
  candidateId: string;
  label: string;
  objectType: DataSourceMappedObjectType;
  createdAt: string;
}>;

export type DataSourceObjectRelationship = Readonly<{
  relationshipId: string;
  sourceObjectId: string;
  targetObjectId: string;
  relationshipType: "feeds" | "depends_on" | "supports";
  confidence: "high" | "medium" | "low";
}>;

export type DataSourceTopologyAssignment = Readonly<{
  topology: string;
  objectId: string;
  position: readonly [number, number, number];
}>;

export type DataSourceObjectCreationResult = Readonly<{
  success: boolean;
  created: readonly DataSourceCreatedObject[];
  skippedDuplicates: number;
  reason: string;
}>;

export type DataSourceObjectPipelineResult = Readonly<{
  discovery: DataSourceDiscoveryResult;
  candidates: readonly DataSourceObjectCandidate[];
  creation: DataSourceObjectCreationResult;
  relationships: readonly DataSourceObjectRelationship[];
  topology: readonly DataSourceTopologyAssignment[];
  sceneMutation: false;
  usesLegacyRouter: false;
}>;
