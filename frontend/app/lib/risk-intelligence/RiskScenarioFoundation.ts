import { buildExecutiveRiskSummary } from "./ExecutiveRiskSummary.ts";
import {
  EMPTY_RISK_SCENARIO_FOUNDATION_REGISTRY,
  RISK_SCENARIO_FOUNDATION_DIAGNOSTICS,
  RISK_SCENARIO_FOUNDATION_VERSION,
  type RiskAlternativePath,
  type RiskScenarioFoundationBuildInput,
  type RiskScenarioFoundationProfile,
  type RiskScenarioFoundationRegistry,
  type RiskScenarioInput,
  type RiskWhatIfEvaluationSlot,
} from "./riskScenarioFoundationContract.ts";
import type { ExecutiveRiskSummary } from "./executiveRiskSummaryContract.ts";
import type { RiskPropagationChain, RiskPropagationNodeKind } from "./riskPropagationProfileContract.ts";

let latestRiskScenarioFoundationRegistry: RiskScenarioFoundationRegistry =
  EMPTY_RISK_SCENARIO_FOUNDATION_REGISTRY;

function parseTopRiskEntry(summary: string): { nodeKind: RiskPropagationNodeKind; nodeId: string } | null {
  if (summary.startsWith("object ")) {
    const nodeId = summary.slice("object ".length).split(":")[0]?.trim();
    return nodeId ? { nodeKind: "object", nodeId } : null;
  }
  if (summary.startsWith("relationship ")) {
    const nodeId = summary.slice("relationship ".length).split(":")[0]?.trim();
    return nodeId ? { nodeKind: "relationship", nodeId } : null;
  }
  if (summary.startsWith("kpi ")) {
    const nodeId = summary.slice("kpi ".length).split(":")[0]?.trim();
    return nodeId ? { nodeKind: "kpi", nodeId } : null;
  }
  return null;
}

function defaultScenarioInputs(summary: ExecutiveRiskSummary): readonly RiskScenarioInput[] {
  const scenarios: RiskScenarioInput[] = [
    Object.freeze({
      scenarioId: "baseline",
      label: "Baseline Risk Posture",
      description: "Current executive risk baseline without what-if adjustments.",
      assumptions: Object.freeze({ mode: "baseline" }),
    }),
  ];

  summary.topRisks.slice(0, 3).forEach((entry, index) => {
    const parsed = parseTopRiskEntry(entry);
    scenarios.push(
      Object.freeze({
        scenarioId: `what-if-risk-${index + 1}`,
        label: `What-if: ${entry}`,
        description: "What-if risk evaluation slot prepared from a top executive risk signal.",
        assumptions: Object.freeze({ mode: "what_if", source: entry }),
        focusNodeIds: parsed ? Object.freeze([parsed.nodeId]) : Object.freeze([]),
      })
    );
  });

  summary.propagation.riskChains.slice(0, 2).forEach((chain, index) => {
    scenarios.push(
      Object.freeze({
        scenarioId: `alternative-path-${index + 1}`,
        label: `Alternative Path: ${chain.sourceId} -> ${chain.targetId}`,
        description: "Alternative risk path prepared from propagation chain analysis.",
        assumptions: Object.freeze({
          mode: "alternative_path",
          chainId: chain.chainId,
          baselinePropagationScore: chain.propagationScore,
        }),
        focusChainIds: Object.freeze([chain.chainId]),
        focusNodeIds: Object.freeze([chain.sourceId, chain.targetId]),
      })
    );
  });

  return Object.freeze(scenarios);
}

function resolveFocusNodeIds(
  scenario: RiskScenarioInput,
  summary: ExecutiveRiskSummary
): readonly string[] {
  if (scenario.focusNodeIds && scenario.focusNodeIds.length > 0) {
    return scenario.focusNodeIds;
  }
  if (scenario.scenarioId === "baseline") {
    return Object.freeze(summary.profiles.slice(0, 5).map((profile) => profile.nodeId));
  }
  return Object.freeze([]);
}

function resolveFocusChainIds(scenario: RiskScenarioInput): readonly string[] {
  if (scenario.focusChainIds && scenario.focusChainIds.length > 0) {
    return scenario.focusChainIds;
  }
  if (scenario.assumptions.mode === "alternative_path" && typeof scenario.assumptions.chainId === "string") {
    return Object.freeze([scenario.assumptions.chainId]);
  }
  return Object.freeze([]);
}

function buildWhatIfEvaluations(
  scenario: RiskScenarioInput,
  summary: ExecutiveRiskSummary
): readonly RiskWhatIfEvaluationSlot[] {
  const focusNodeIds = new Set(resolveFocusNodeIds(scenario, summary));
  const evaluations: RiskWhatIfEvaluationSlot[] = [];

  for (const profile of summary.profiles) {
    if (focusNodeIds.size > 0 && !focusNodeIds.has(profile.nodeId)) continue;
    evaluations.push(
      Object.freeze({
        scenarioId: scenario.scenarioId,
        nodeId: profile.nodeId,
        nodeKind: profile.nodeKind,
        label: profile.label,
        baselineRiskScore: profile.riskScore,
        projectedRiskScore: null,
        evaluationReady: true,
      })
    );
  }

  if (evaluations.length === 0 && scenario.scenarioId === "baseline") {
    return Object.freeze([]);
  }

  return Object.freeze(evaluations);
}

function buildAlternativePaths(
  scenario: RiskScenarioInput,
  chains: readonly RiskPropagationChain[]
): readonly RiskAlternativePath[] {
  const focusChainIds = new Set(resolveFocusChainIds(scenario));
  const selected =
    focusChainIds.size > 0
      ? chains.filter((chain) => focusChainIds.has(chain.chainId))
      : scenario.assumptions.mode === "alternative_path"
        ? chains
        : [];

  return Object.freeze(
    selected.map(
      (chain): RiskAlternativePath =>
        Object.freeze({
          pathId: `${scenario.scenarioId}:${chain.chainId}`,
          scenarioId: scenario.scenarioId,
          chainId: chain.chainId,
          sourceId: chain.sourceId,
          targetId: chain.targetId,
          sourceKind: chain.sourceKind,
          targetKind: chain.targetKind,
          baselinePropagationScore: chain.propagationScore,
          alternativePropagationScore: null,
          pathReady: true,
          steps: chain.steps,
        })
    )
  );
}

function buildScenarioProfile(
  scenario: RiskScenarioInput,
  allScenarioInputs: readonly RiskScenarioInput[],
  summary: ExecutiveRiskSummary
): RiskScenarioFoundationProfile {
  return Object.freeze({
    scenarioId: scenario.scenarioId,
    label: scenario.label,
    description:
      scenario.description ??
      `Scenario-ready risk foundation for ${scenario.label}.`,
    assumptions: Object.freeze({ ...scenario.assumptions }),
    whatIfEvaluations: buildWhatIfEvaluations(scenario, summary),
    alternativePaths: buildAlternativePaths(scenario, summary.propagation.riskChains),
    scenarioInputs: allScenarioInputs,
    foundationOnly: true,
    simulationActive: false,
  });
}

export function buildRiskScenarioFoundationRegistry(
  input: RiskScenarioFoundationBuildInput = {}
): RiskScenarioFoundationRegistry {
  const baselineExecutiveSummary =
    input.executiveSummary ??
    buildExecutiveRiskSummary({
      sceneJson: input.sceneJson,
      objects: input.objects,
      relationships: input.relationships,
      kpis: input.kpis,
      sceneObjects: input.sceneObjects,
      dataSourceObjects: input.dataSourceObjects,
      dataSourceKpis: input.dataSourceKpis,
      historicalSnapshots: input.historicalSnapshots,
    });

  const hasRiskSignals =
    baselineExecutiveSummary.objectRiskCount +
      baselineExecutiveSummary.relationshipRiskCount +
      baselineExecutiveSummary.kpiRiskCount >
      0 || baselineExecutiveSummary.propagation.chainCount > 0;

  const scenarioInputs =
    input.scenarioInputs ??
    (hasRiskSignals ? defaultScenarioInputs(baselineExecutiveSummary) : Object.freeze([]));

  const scenarios = Object.freeze(
    scenarioInputs.map((scenario) =>
      buildScenarioProfile(scenario, scenarioInputs, baselineExecutiveSummary)
    )
  );
  const scenarioById = Object.freeze(
    scenarios.reduce<Record<string, RiskScenarioFoundationProfile>>((registry, scenario) => {
      registry[scenario.scenarioId] = scenario;
      return registry;
    }, {})
  );

  latestRiskScenarioFoundationRegistry = Object.freeze({
    version: RISK_SCENARIO_FOUNDATION_VERSION,
    scenarios,
    scenarioById,
    scenarioCount: scenarios.length,
    baselineExecutiveSummary,
    foundationOnly: true,
    simulationActive: false,
    readOnly: true,
    sceneMutation: false,
    mrpMutation: false,
    diagnostics: RISK_SCENARIO_FOUNDATION_DIAGNOSTICS,
  });

  return latestRiskScenarioFoundationRegistry;
}

export function getRiskScenarioFoundationRegistry(): RiskScenarioFoundationRegistry {
  return latestRiskScenarioFoundationRegistry;
}

export function resetRiskScenarioFoundationForTests(): void {
  latestRiskScenarioFoundationRegistry = EMPTY_RISK_SCENARIO_FOUNDATION_REGISTRY;
}

export const RiskScenarioFoundation = Object.freeze({
  buildRiskScenarioFoundationRegistry,
  getRiskScenarioFoundationRegistry,
});
