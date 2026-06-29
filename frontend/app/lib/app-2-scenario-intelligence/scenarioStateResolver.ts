/**
 * APP-2:2 — Scenario State Resolver.
 * Read-only input normalization and workspace-scoped resolution.
 */

import { resolveScenarioIdentityExample } from "./scenarioIntelligenceContract.ts";
import { createScenarioMetadataRecord } from "./scenarioIntelligenceMetadata.ts";
import type {
  ScenarioIdentity,
  ScenarioIntelligenceScenarioId,
  ScenarioIntelligenceWorkspaceId,
  ScenarioMetadataRecord,
} from "./scenarioIntelligenceTypes.ts";
import type { ScenarioStateEvaluationInput } from "./scenarioStateResult.ts";

export type ScenarioStateLookup = Readonly<{
  resolveIdentity: (input: {
    scenarioId: ScenarioIntelligenceScenarioId;
    workspaceId: ScenarioIntelligenceWorkspaceId;
  }) => ScenarioIdentity | null;
  resolveMetadata: (input: {
    scenarioId: ScenarioIntelligenceScenarioId;
    workspaceId: ScenarioIntelligenceWorkspaceId;
  }) => ScenarioMetadataRecord | null;
}>;

export type ScenarioStateResolveRequest = Readonly<{
  scenarioId: ScenarioIntelligenceScenarioId;
  workspaceId: ScenarioIntelligenceWorkspaceId;
  evaluatedAt: string;
  identity?: ScenarioIdentity | null;
  metadata?: ScenarioMetadataRecord | null;
  lookup?: ScenarioStateLookup | null;
}>;

const EMPTY_LOOKUP: ScenarioStateLookup = Object.freeze({
  resolveIdentity: () => null,
  resolveMetadata: () => null,
});

export function normalizeScenarioStateResolveRequest(
  request: ScenarioStateResolveRequest
): ScenarioStateEvaluationInput {
  const scenarioId = request.scenarioId.trim();
  const workspaceId = request.workspaceId.trim();
  const lookup = request.lookup ?? EMPTY_LOOKUP;

  const identity =
    request.identity !== undefined
      ? request.identity
      : lookup.resolveIdentity({ scenarioId, workspaceId });

  const metadata =
    request.metadata !== undefined
      ? request.metadata
      : lookup.resolveMetadata({ scenarioId, workspaceId });

  return Object.freeze({
    scenarioId,
    workspaceId,
    evaluatedAt: request.evaluatedAt,
    identity,
    metadata,
  });
}

export function resolveScenarioStateEvaluationInput(
  request: ScenarioStateResolveRequest
): ScenarioStateEvaluationInput {
  return normalizeScenarioStateResolveRequest(request);
}

export function createScenarioStateLookupFromRecords(
  records: readonly Readonly<{
    identity: ScenarioIdentity;
    metadata: ScenarioMetadataRecord;
  }>[]
): ScenarioStateLookup {
  const identityByKey = new Map<string, ScenarioIdentity>();
  const metadataByKey = new Map<string, ScenarioMetadataRecord>();

  for (const record of records) {
    const key = `${record.identity.workspaceId}::${record.identity.scenarioId}`;
    identityByKey.set(key, record.identity);
    metadataByKey.set(key, record.metadata);
  }

  return Object.freeze({
    resolveIdentity: ({ scenarioId, workspaceId }) =>
      identityByKey.get(`${workspaceId}::${scenarioId}`) ?? null,
    resolveMetadata: ({ scenarioId, workspaceId }) =>
      metadataByKey.get(`${workspaceId}::${scenarioId}`) ?? null,
  });
}

export function resolveScenarioStateProbeExample(
  evaluatedAt: string = new Date(0).toISOString()
): ScenarioStateEvaluationInput {
  const identity = resolveScenarioIdentityExample();
  return Object.freeze({
    scenarioId: identity.scenarioId,
    workspaceId: identity.workspaceId,
    evaluatedAt,
    identity,
    metadata: createScenarioMetadataRecord(),
  });
}
