/**
 * Legacy schema registry facade — delegates to DS-1:1 workspace data source schema modules.
 */

import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import {
  DATA_SOURCE_SCHEMA_TAGS,
  dataSourceSchemaProfileIsComplete,
  type DataSourceSchemaMutationResult,
  type DataSourceSchemaProfile,
} from "./dataSourceSchemaContract.ts";
import {
  classifyAndSaveWorkspaceColumnsFromSchema,
  removeWorkspaceColumnClassificationProfile,
} from "./columnClassificationEngine.ts";
import {
  discoverAndSaveCandidateObjectsFromClassification,
  removeWorkspaceCandidateObjectsForDataSource,
} from "./candidateObjectDiscoveryEngine.ts";
import { removeWorkspaceObjectApprovalRecordsForDataSource } from "./objectApprovalPanelRuntime.ts";
import { removePipelineWorkspaceObjectsForDataSource } from "./objectCreationPipeline.ts";
import { discoverWorkspaceCsvSchema } from "./workspaceDataSourceSchemaDiscovery.ts";
import {
  fromLegacyDataSourceSchemaProfile,
  toLegacyDataSourceSchemaProfile,
} from "./workspaceDataSourceSchemaLegacyBridge.ts";
import {
  discoverAndSaveWorkspaceDataSourceSchema,
  getDataSourceSchema,
  discoverDataSourceSchema,
  getWorkspaceDataSourceSchemaRegistryUpdatedAt,
  getWorkspaceDataSourceSchemaRegistryVersion,
  removeWorkspaceDataSourceSchemaProfile,
  resolveWorkspaceDataSourceSchema,
  resolveWorkspaceDataSourceSchemas,
  resetWorkspaceDataSourceSchemaRegistryForTests,
  saveWorkspaceDataSourceSchemaProfile,
  subscribeWorkspaceDataSourceSchemaRegistry,
} from "./workspaceDataSourceSchemaResolver.ts";

export { DATA_SOURCE_SCHEMA_TAGS };

type WorkspaceSchemaListener = () => void;

export function discoverCsvDataSourceSchema(input: {
  workspaceId: WorkspaceId;
  dataSourceId: string;
  fileName: string;
  csvText: string;
  discoveredAt?: string;
}): DataSourceSchemaProfile {
  return toLegacyDataSourceSchemaProfile(discoverWorkspaceCsvSchema(input));
}

export function subscribeWorkspaceSchemaRegistry(listener: WorkspaceSchemaListener): () => void {
  return subscribeWorkspaceDataSourceSchemaRegistry(listener);
}

export function getWorkspaceSchemaRegistryVersion(): number {
  return getWorkspaceDataSourceSchemaRegistryVersion();
}

export function getWorkspaceSchemaRegistryUpdatedAt(): string | null {
  return getWorkspaceDataSourceSchemaRegistryUpdatedAt();
}

export function listWorkspaceDataSourceSchemas(
  workspaceId?: WorkspaceId | null
): readonly DataSourceSchemaProfile[] {
  return resolveWorkspaceDataSourceSchemas(workspaceId).map(toLegacyDataSourceSchemaProfile);
}

export function getWorkspaceDataSourceSchema(
  workspaceId: WorkspaceId,
  dataSourceId: string
): DataSourceSchemaProfile | null {
  const schema = resolveWorkspaceDataSourceSchema(workspaceId, dataSourceId);
  return schema ? toLegacyDataSourceSchemaProfile(schema) : null;
}

export function saveWorkspaceDataSourceSchema(
  schema: DataSourceSchemaProfile,
  options?: { enableDownstreamIntelligence?: boolean }
): DataSourceSchemaMutationResult {
  const normalized = fromLegacyDataSourceSchemaProfile(schema);
  if (!normalized) {
    return Object.freeze({
      success: false,
      schema: null,
      reason: "invalid_schema_profile",
      created: false,
    });
  }

  const result = saveWorkspaceDataSourceSchemaProfile(normalized);
  if (!result.success || !result.schema) {
    return Object.freeze({
      success: false,
      schema: null,
      reason: result.reason,
      created: false,
    });
  }

  const legacySchema = toLegacyDataSourceSchemaProfile(result.schema);
  if (options?.enableDownstreamIntelligence) {
    const classificationResult = classifyAndSaveWorkspaceColumnsFromSchema(
      legacySchema,
      legacySchema.updatedAt
    );
    if (classificationResult.success && classificationResult.profile) {
      discoverAndSaveCandidateObjectsFromClassification(classificationResult.profile);
    }
  }

  return Object.freeze({
    success: true,
    schema: legacySchema,
    reason: result.reason,
    created: result.created,
  });
}

export function discoverAndSaveWorkspaceCsvSchema(input: {
  workspaceId: WorkspaceId;
  dataSourceId: string;
  fileName: string;
  csvText: string;
  discoveredAt?: string;
  enableDownstreamIntelligence?: boolean;
}): DataSourceSchemaMutationResult {
  const result = discoverAndSaveWorkspaceDataSourceSchema(input);
  if (!result.success || !result.schema) {
    return Object.freeze({
      success: false,
      schema: null,
      reason: result.reason,
      created: false,
    });
  }

  const legacySchema = toLegacyDataSourceSchemaProfile(result.schema);
  if (input.enableDownstreamIntelligence) {
    const classificationResult = classifyAndSaveWorkspaceColumnsFromSchema(
      legacySchema,
      legacySchema.updatedAt
    );
    if (classificationResult.success && classificationResult.profile) {
      discoverAndSaveCandidateObjectsFromClassification(classificationResult.profile);
    }
  }

  return Object.freeze({
    success: true,
    schema: legacySchema,
    reason: result.reason,
    created: result.created,
  });
}

export function removeWorkspaceDataSourceSchema(
  workspaceId: WorkspaceId,
  dataSourceId: string
): DataSourceSchemaMutationResult {
  const result = removeWorkspaceDataSourceSchemaProfile(workspaceId, dataSourceId);
  if (!result.success || !result.schema) {
    return Object.freeze({
      success: false,
      schema: null,
      reason: result.reason,
      created: false,
    });
  }

  removeWorkspaceColumnClassificationProfile(workspaceId, dataSourceId);
  removeWorkspaceCandidateObjectsForDataSource(workspaceId, dataSourceId);
  removeWorkspaceObjectApprovalRecordsForDataSource(workspaceId, dataSourceId);
  removePipelineWorkspaceObjectsForDataSource(workspaceId, dataSourceId);

  return Object.freeze({
    success: true,
    schema: toLegacyDataSourceSchemaProfile(result.schema),
    reason: result.reason,
    created: false,
  });
}

export function resetWorkspaceSchemaRegistryForTests(): void {
  resetWorkspaceDataSourceSchemaRegistryForTests();
}

export { dataSourceSchemaProfileIsComplete };

export {
  discoverDataSourceSchema,
  getDataSourceSchema,
};
