/**
 * APP-2:3 — Scenario Context Builder.
 * Pure deterministic context assembly — no side effects or mutation.
 */

import type {
  ScenarioDecisionJournalReference,
  ScenarioExecutiveTimeReference,
  ScenarioIdentity,
  ScenarioKpiReference,
  ScenarioMetadataRecord,
  ScenarioObjectReference,
  ScenarioRelationshipReference,
  ScenarioRiskReference,
  ScenarioTimelineReference,
  ScenarioWorkspaceReference,
} from "./scenarioIntelligenceTypes.ts";
import type { ScenarioStateResult } from "./scenarioStateResult.ts";
import {
  createScenarioContextDiagnostic,
  mapContractDiagnosticToContextDiagnostic,
  type ScenarioContextDiagnostic,
} from "./scenarioContextDiagnostics.ts";
import type {
  ScenarioCompareReference,
  ScenarioContext,
  ScenarioContextBuildInput,
  ScenarioContextReferencesInput,
  ScenarioDataSourceReference,
  ScenarioSimulationReference,
} from "./scenarioContextResult.ts";
import { createScenarioContext } from "./scenarioContextResult.ts";

export type ScenarioContextBuildSnapshot = Readonly<{
  identity: ScenarioIdentity | null;
  workspace: ScenarioWorkspaceReference | null;
  state: ScenarioStateResult | null;
  executiveTimeReference: ScenarioExecutiveTimeReference | null;
  timelineReference: ScenarioTimelineReference | null;
  objects: readonly ScenarioObjectReference[];
  relationships: readonly ScenarioRelationshipReference[];
  kpis: readonly ScenarioKpiReference[];
  risks: readonly ScenarioRiskReference[];
  decisionReferences: readonly ScenarioDecisionJournalReference[];
  simulationReferences: readonly ScenarioSimulationReference[];
  compareReferences: readonly ScenarioCompareReference[];
  dataSources: readonly ScenarioDataSourceReference[];
  metadata: ScenarioMetadataRecord | null;
  diagnostics: readonly ScenarioContextDiagnostic[];
}>;

function freezeRefs<T>(values: readonly T[] | undefined): readonly T[] {
  return Object.freeze([...(values ?? [])]);
}

function resolveReferences(input: ScenarioContextBuildInput): ScenarioContextReferencesInput {
  const refs = input.references ?? Object.freeze({});
  const identity = input.identity;
  return Object.freeze({
    executiveTime: refs.executiveTime ?? identity?.executiveTimeReference ?? null,
    timeline: refs.timeline ?? identity?.timelineReference ?? null,
    workspace:
      refs.workspace ??
      (input.workspaceId.trim()
        ? Object.freeze({ workspaceId: input.workspaceId.trim(), readOnly: true as const })
        : null),
    objects: refs.objects,
    relationships: refs.relationships,
    kpis: refs.kpis,
    risks: refs.risks,
    decisionReferences: refs.decisionReferences,
    simulationReferences: refs.simulationReferences,
    compareReferences: refs.compareReferences,
    dataSources: refs.dataSources,
  });
}

function isValidExecutiveTimeReference(
  reference: ScenarioExecutiveTimeReference | null
): reference is ScenarioExecutiveTimeReference {
  return (
    reference !== null &&
    reference.readOnly === true &&
    reference.contextKey.trim().length > 0 &&
    reference.timestamp.trim().length > 0
  );
}

function isValidTimelineReference(
  reference: ScenarioTimelineReference | null
): reference is ScenarioTimelineReference {
  return (
    reference !== null &&
    reference.readOnly === true &&
    reference.timelineId.trim().length > 0 &&
    reference.anchorTimestamp.trim().length > 0
  );
}

function isValidWorkspaceReference(
  reference: ScenarioWorkspaceReference | null,
  workspaceId: string
): reference is ScenarioWorkspaceReference {
  return reference !== null && reference.readOnly === true && reference.workspaceId === workspaceId;
}

function collectDiagnostics(input: ScenarioContextBuildInput, snapshot: ScenarioContextBuildSnapshot): ScenarioContextDiagnostic[] {
  const diagnostics: ScenarioContextDiagnostic[] = [];
  const timestamp = input.generatedAt;

  if (!input.workspaceId.trim()) {
    diagnostics.push(
      createScenarioContextDiagnostic("missing_workspace", "Workspace ID is required.", timestamp)
    );
  }

  if (!input.identity) {
    diagnostics.push(
      createScenarioContextDiagnostic("missing_scenario", "Scenario identity is unavailable.", timestamp, {
        scenarioId: input.scenarioId,
      })
    );
  } else if (input.identity.workspaceId !== input.workspaceId) {
    diagnostics.push(
      createScenarioContextDiagnostic("invalid_context", "Workspace isolation violation.", timestamp, {
        requestedWorkspaceId: input.workspaceId,
        identityWorkspaceId: input.identity.workspaceId,
      })
    );
  }

  if (!input.state) {
    diagnostics.push(
      createScenarioContextDiagnostic("missing_state", "Scenario state is unavailable.", timestamp, {
        scenarioId: input.scenarioId,
      })
    );
  } else {
    for (const entry of input.state.diagnostics) {
      diagnostics.push(mapContractDiagnosticToContextDiagnostic(entry));
    }
    if (input.state.scenarioId !== input.scenarioId || input.state.workspaceId !== input.workspaceId) {
      diagnostics.push(
        createScenarioContextDiagnostic("invalid_context", "Scenario state identity mismatch.", timestamp, {
          stateScenarioId: input.state.scenarioId,
          stateWorkspaceId: input.state.workspaceId,
        })
      );
    }
  }

  if (!isValidWorkspaceReference(snapshot.workspace, input.workspaceId)) {
    diagnostics.push(
      createScenarioContextDiagnostic("missing_workspace", "Workspace reference is unavailable.", timestamp)
    );
  }

  if (!isValidExecutiveTimeReference(snapshot.executiveTimeReference)) {
    diagnostics.push(
      createScenarioContextDiagnostic(
        "missing_executive_time",
        "Executive Time reference is unavailable.",
        timestamp
      )
    );
  }

  if (!isValidTimelineReference(snapshot.timelineReference)) {
    diagnostics.push(
      createScenarioContextDiagnostic("missing_timeline", "Timeline reference is unavailable.", timestamp)
    );
  }

  if (snapshot.objects.length === 0) {
    diagnostics.push(
      createScenarioContextDiagnostic("missing_object", "No related objects in scenario context.", timestamp)
    );
  }

  if (snapshot.relationships.length === 0) {
    diagnostics.push(
      createScenarioContextDiagnostic(
        "missing_relationship",
        "No related relationships in scenario context.",
        timestamp
      )
    );
  }

  if (snapshot.kpis.length === 0) {
    diagnostics.push(
      createScenarioContextDiagnostic("missing_kpi", "No related KPIs in scenario context.", timestamp)
    );
  }

  if (snapshot.risks.length === 0) {
    diagnostics.push(
      createScenarioContextDiagnostic("missing_risk", "No related risks in scenario context.", timestamp)
    );
  }

  if (snapshot.decisionReferences.length === 0) {
    diagnostics.push(
      createScenarioContextDiagnostic(
        "missing_decision_reference",
        "No decision journal references in scenario context.",
        timestamp
      )
    );
  }

  if (snapshot.simulationReferences.length === 0) {
    diagnostics.push(
      createScenarioContextDiagnostic(
        "missing_simulation_reference",
        "No active simulation references in scenario context.",
        timestamp
      )
    );
  }

  if (snapshot.compareReferences.length === 0) {
    diagnostics.push(
      createScenarioContextDiagnostic(
        "missing_compare_reference",
        "No compare references in scenario context.",
        timestamp
      )
    );
  }

  if (snapshot.dataSources.length === 0) {
    diagnostics.push(
      createScenarioContextDiagnostic(
        "missing_data_source",
        "No data source references in scenario context.",
        timestamp
      )
    );
  }

  if (!input.metadata) {
    diagnostics.push(
      createScenarioContextDiagnostic("incomplete_context", "Scenario metadata is unavailable.", timestamp)
    );
  }

  const hasError = diagnostics.some((entry) => entry.severity === "error");
  const hasWarning = diagnostics.some((entry) => entry.severity === "warning");
  if (!hasError && hasWarning) {
    diagnostics.push(
      createScenarioContextDiagnostic(
        "incomplete_context",
        "Scenario context collected with warnings.",
        timestamp
      )
    );
  }

  return diagnostics;
}

export function buildScenarioContextSnapshot(input: ScenarioContextBuildInput): ScenarioContextBuildSnapshot {
  const refs = resolveReferences(input);

  const snapshot: ScenarioContextBuildSnapshot = Object.freeze({
    identity: input.identity,
    workspace: refs.workspace ?? null,
    state: input.state,
    executiveTimeReference: refs.executiveTime ?? null,
    timelineReference: refs.timeline ?? null,
    objects: freezeRefs(refs.objects),
    relationships: freezeRefs(refs.relationships),
    kpis: freezeRefs(refs.kpis),
    risks: freezeRefs(refs.risks),
    decisionReferences: freezeRefs(refs.decisionReferences),
    simulationReferences: freezeRefs(refs.simulationReferences),
    compareReferences: freezeRefs(refs.compareReferences),
    dataSources: freezeRefs(refs.dataSources),
    metadata: input.metadata,
    diagnostics: Object.freeze([]),
  });

  const diagnostics = Object.freeze(collectDiagnostics(input, snapshot));
  return Object.freeze({ ...snapshot, diagnostics });
}

export function buildScenarioContext(input: ScenarioContextBuildInput): ScenarioContext {
  const snapshot = buildScenarioContextSnapshot(input);
  return createScenarioContext({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
    identity: snapshot.identity,
    workspace: snapshot.workspace,
    state: snapshot.state,
    executiveTimeReference: snapshot.executiveTimeReference,
    timelineReference: snapshot.timelineReference,
    objects: snapshot.objects,
    relationships: snapshot.relationships,
    kpis: snapshot.kpis,
    risks: snapshot.risks,
    decisionReferences: snapshot.decisionReferences,
    simulationReferences: snapshot.simulationReferences,
    compareReferences: snapshot.compareReferences,
    dataSources: snapshot.dataSources,
    metadata: snapshot.metadata,
    diagnostics: snapshot.diagnostics,
    generatedAt: input.generatedAt,
  });
}
