/**
 * APP-2:3 — Scenario Context Resolver.
 * Read-only input normalization and APP-2:2 state engine integration.
 */

import { resolveScenarioIdentityExample } from "./scenarioIntelligenceContract.ts";
import { createScenarioMetadataRecord } from "./scenarioIntelligenceMetadata.ts";
import type {
  ScenarioIdentity,
  ScenarioIntelligenceScenarioId,
  ScenarioIntelligenceWorkspaceId,
  ScenarioMetadataRecord,
} from "./scenarioIntelligenceTypes.ts";
import { resolveScenarioState } from "./scenarioStateEngine.ts";
import type { ScenarioStateLookup, ScenarioStateResolveRequest } from "./scenarioStateResolver.ts";
import type { ScenarioStateResult } from "./scenarioStateResult.ts";
import { buildScenarioContext } from "./scenarioContextBuilder.ts";
import type {
  ScenarioContext,
  ScenarioContextBuildInput,
  ScenarioContextReferencesInput,
} from "./scenarioContextResult.ts";

export type ScenarioContextResolveRequest = Readonly<{
  scenarioId: ScenarioIntelligenceScenarioId;
  workspaceId: ScenarioIntelligenceWorkspaceId;
  generatedAt: string;
  identity?: ScenarioIdentity | null;
  metadata?: ScenarioMetadataRecord | null;
  state?: ScenarioStateResult | null;
  references?: ScenarioContextReferencesInput | null;
  stateLookup?: ScenarioStateLookup | null;
}>;

export function resolveScenarioContextState(
  request: ScenarioContextResolveRequest
): ScenarioStateResult | null {
  if (request.state !== undefined) {
    return request.state;
  }

  const stateRequest: ScenarioStateResolveRequest = Object.freeze({
    scenarioId: request.scenarioId,
    workspaceId: request.workspaceId,
    evaluatedAt: request.generatedAt,
    identity: request.identity,
    metadata: request.metadata,
    lookup: request.stateLookup ?? null,
  });

  return resolveScenarioState(stateRequest);
}

export function normalizeScenarioContextBuildInput(
  request: ScenarioContextResolveRequest
): ScenarioContextBuildInput {
  const scenarioId = request.scenarioId.trim();
  const workspaceId = request.workspaceId.trim();
  const state = resolveScenarioContextState(request);

  return Object.freeze({
    scenarioId,
    workspaceId,
    generatedAt: request.generatedAt,
    identity: request.identity ?? null,
    metadata: request.metadata ?? null,
    state,
    references: request.references ?? null,
  });
}

export function resolveScenarioContext(request: ScenarioContextResolveRequest): ScenarioContext {
  return buildScenarioContext(normalizeScenarioContextBuildInput(request));
}

export function resolveScenarioContextProbeExample(
  generatedAt: string = new Date(0).toISOString()
): ScenarioContext {
  const identity = resolveScenarioIdentityExample();
  const metadata = createScenarioMetadataRecord();
  const state = resolveScenarioState({
    scenarioId: identity.scenarioId,
    workspaceId: identity.workspaceId,
    evaluatedAt: generatedAt,
    identity,
    metadata,
  });

  return resolveScenarioContext(
    Object.freeze({
      scenarioId: identity.scenarioId,
      workspaceId: identity.workspaceId,
      generatedAt,
      identity,
      metadata,
      state,
      references: Object.freeze({
        workspace: Object.freeze({ workspaceId: identity.workspaceId, readOnly: true as const }),
        executiveTime: identity.executiveTimeReference,
        timeline: identity.timelineReference,
        objects: Object.freeze([
          Object.freeze({ objectId: "obj-001", label: "Primary Object", readOnly: true as const }),
        ]),
        relationships: Object.freeze([
          Object.freeze({
            relationshipId: "rel-001",
            sourceId: "obj-001",
            targetId: "obj-002",
            readOnly: true as const,
          }),
        ]),
        kpis: Object.freeze([
          Object.freeze({ kpiId: "kpi-001", label: "Revenue", readOnly: true as const }),
        ]),
        risks: Object.freeze([
          Object.freeze({ riskId: "risk-001", label: "Supply Risk", readOnly: true as const }),
        ]),
        decisionReferences: Object.freeze([
          Object.freeze({
            journalEntryId: "dj-001",
            decisionId: "dec-001",
            readOnly: true as const,
          }),
        ]),
        simulationReferences: Object.freeze([
          Object.freeze({
            simulationId: "sim-001",
            label: "Baseline Simulation",
            status: "completed",
            readOnly: true as const,
          }),
        ]),
        compareReferences: Object.freeze([
          Object.freeze({
            compareId: "cmp-001",
            baselineScenarioId: identity.scenarioId,
            candidateScenarioId: "scn-candidate-001",
            readOnly: true as const,
          }),
        ]),
        dataSources: Object.freeze([
          Object.freeze({ dataSourceId: "ds-001", label: "ERP Feed", readOnly: true as const }),
        ]),
      }),
    })
  );
}
