import { buildExecutiveIntelligenceSnapshot } from "../intelligence/ExecutiveIntelligenceAdapter.ts";
import { buildKpiExplanationRegistry } from "./KpiExplanationEngine.ts";
import { buildObjectExplanationRegistry } from "./ObjectExplanationEngine.ts";
import { buildRelationshipExplanationRegistry } from "./RelationshipExplanationEngine.ts";
import { buildRiskExplanationRegistry } from "./RiskExplanationEngine.ts";
import { buildScenarioExplanationRegistry } from "./ScenarioExplanationEngine.ts";
import {
  ASSISTANT_INTELLIGENCE_ADAPTER_DIAGNOSTICS,
  ASSISTANT_INTELLIGENCE_ADAPTER_VERSION,
  EMPTY_ASSISTANT_INTELLIGENCE_ADAPTER_REGISTRY,
  type AssistantIntelligenceAdapterBuildInput,
  type AssistantIntelligenceAdapterRegistry,
  type AssistantIntelligenceSnapshot,
} from "./assistantIntelligenceAdapterContract.ts";

let latestAssistantIntelligenceAdapterRegistry: AssistantIntelligenceAdapterRegistry =
  EMPTY_ASSISTANT_INTELLIGENCE_ADAPTER_REGISTRY;

function collectBuildInput(input: AssistantIntelligenceAdapterBuildInput) {
  return Object.freeze({
    sceneJson: input.sceneJson,
    objects: input.objects ?? input.sceneObjects,
    relationships: input.relationships,
    kpis: input.kpis,
    risks: input.risks,
    sceneObjects: input.sceneObjects,
    dataSourceObjects: input.dataSourceObjects,
    dataSourceKpis: input.dataSourceKpis,
    historicalSnapshots: input.historicalSnapshots,
    selectedObjectId: input.selectedObjectId,
  });
}

function snapshotHasIntelligence(
  snapshot: ReturnType<typeof buildExecutiveIntelligenceSnapshot>
): boolean {
  return (
    snapshot.objectIntelligence.objectCount > 0 ||
    snapshot.relationshipIntelligence.relationshipCount > 0 ||
    snapshot.kpiIntelligence.kpiCount > 0 ||
    snapshot.riskIntelligence.profiles.length > 0 ||
    snapshot.scenarioIntelligence.scenarioCount > 0
  );
}

function buildExecutiveSummaryText(input: {
  objectExplanationCount: number;
  relationshipExplanationCount: number;
  kpiExplanationCount: number;
  riskExplanationCount: number;
  scenarioExplanationCount: number;
  snapshotSummary: string;
}): string {
  return [
    "Assistant intelligence adapter ready for certified explanation surfaces.",
    `${input.objectExplanationCount} object, ${input.relationshipExplanationCount} relationship, ${input.kpiExplanationCount} KPI, ${input.riskExplanationCount} risk, and ${input.scenarioExplanationCount} scenario explanation(s) available.`,
    input.snapshotSummary,
  ].join(" ");
}

export function buildAssistantIntelligenceAdapterRegistry(
  input: AssistantIntelligenceAdapterBuildInput = {}
): AssistantIntelligenceAdapterRegistry {
  const buildInput = collectBuildInput(input);
  const snapshot = input.snapshot ?? buildExecutiveIntelligenceSnapshot(buildInput);

  if (!snapshotHasIntelligence(snapshot)) {
    latestAssistantIntelligenceAdapterRegistry = EMPTY_ASSISTANT_INTELLIGENCE_ADAPTER_REGISTRY;
    return latestAssistantIntelligenceAdapterRegistry;
  }

  const objectExplanations =
    input.objectExplanations ??
    buildObjectExplanationRegistry({
      sceneJson: buildInput.sceneJson,
      sceneObjects: buildInput.objects,
      dataSourceObjects: buildInput.dataSourceObjects,
      selectedObjectId: buildInput.selectedObjectId,
      objectIntelligence: snapshot.objectIntelligence,
    });
  const relationshipExplanations =
    input.relationshipExplanations ??
    buildRelationshipExplanationRegistry({
      sceneJson: buildInput.sceneJson,
      relationships: buildInput.relationships,
      objects: buildInput.objects,
      relationshipIntelligence: snapshot.relationshipIntelligence,
    });
  const kpiExplanations =
    input.kpiExplanations ??
    buildKpiExplanationRegistry({
      sceneJson: buildInput.sceneJson,
      kpis: buildInput.kpis,
      dataSourceKpis: buildInput.dataSourceKpis,
      historicalSnapshots: buildInput.historicalSnapshots,
      kpiIntelligence: snapshot.kpiIntelligence,
    });
  const riskExplanations =
    input.riskExplanations ??
    buildRiskExplanationRegistry({
      sceneJson: buildInput.sceneJson,
      objects: buildInput.objects,
      relationships: buildInput.relationships,
      kpis: buildInput.kpis,
      sceneObjects: buildInput.sceneObjects,
      dataSourceObjects: buildInput.dataSourceObjects,
      dataSourceKpis: buildInput.dataSourceKpis,
      historicalSnapshots: buildInput.historicalSnapshots,
      riskIntelligence: snapshot.riskIntelligence,
    });
  const scenarioExplanations =
    input.scenarioExplanations ??
    buildScenarioExplanationRegistry({
      sceneJson: buildInput.sceneJson,
      objects: buildInput.objects,
      relationships: buildInput.relationships,
      kpis: buildInput.kpis,
      risks: buildInput.risks,
      sceneObjects: buildInput.sceneObjects,
      dataSourceObjects: buildInput.dataSourceObjects,
      dataSourceKpis: buildInput.dataSourceKpis,
      historicalSnapshots: buildInput.historicalSnapshots,
      scenarioIntelligence: snapshot.scenarioIntelligence,
    });

  const explanationCount =
    objectExplanations.explanationCount +
    relationshipExplanations.explanationCount +
    kpiExplanations.explanationCount +
    riskExplanations.explanationCount +
    scenarioExplanations.explanationCount;

  const registry: AssistantIntelligenceSnapshot = Object.freeze({
    version: ASSISTANT_INTELLIGENCE_ADAPTER_VERSION,
    executiveSummary: buildExecutiveSummaryText({
      objectExplanationCount: objectExplanations.explanationCount,
      relationshipExplanationCount: relationshipExplanations.explanationCount,
      kpiExplanationCount: kpiExplanations.explanationCount,
      riskExplanationCount: riskExplanations.explanationCount,
      scenarioExplanationCount: scenarioExplanations.explanationCount,
      snapshotSummary: [
        snapshot.objectIntelligence.executiveSummary,
        snapshot.relationshipIntelligence.executiveSummary,
        snapshot.kpiIntelligence.executiveSummary,
        snapshot.riskIntelligence.executiveSummary,
        snapshot.scenarioIntelligence.executiveSummary,
      ].join(" "),
    }),
    snapshot,
    objectExplanations,
    relationshipExplanations,
    kpiExplanations,
    riskExplanations,
    scenarioExplanations,
    explanationCount,
    readOnly: true as const,
    simulationActive: false as const,
    sceneMutation: false as const,
    objectMutation: false as const,
    mrpMutation: false as const,
    routingMutation: false as const,
    topologyMutation: false as const,
    legacyRouterUsage: false as const,
    diagnostics: ASSISTANT_INTELLIGENCE_ADAPTER_DIAGNOSTICS,
  });

  latestAssistantIntelligenceAdapterRegistry = registry;
  return registry;
}

export function getAssistantIntelligenceAdapterRegistry(): AssistantIntelligenceAdapterRegistry {
  return latestAssistantIntelligenceAdapterRegistry;
}

export function resetAssistantIntelligenceAdapterForTests(): void {
  latestAssistantIntelligenceAdapterRegistry = EMPTY_ASSISTANT_INTELLIGENCE_ADAPTER_REGISTRY;
}

export const AssistantIntelligenceAdapter = Object.freeze({
  buildAssistantIntelligenceAdapterRegistry,
  getAssistantIntelligenceAdapterRegistry,
  resetAssistantIntelligenceAdapterForTests,
});
