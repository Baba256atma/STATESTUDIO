import {
  DEFAULT_DOMAIN_SCENARIO_KPI_MAPPINGS,
  getDomainScenarioKpiMapping,
  interpretScenarioAndKpiForDomain,
  type NexoraDomainScenarioKpiInterpretation,
} from "../domain/domainScenarioKpiMapping";
import {
  assembleDomainProject,
  type NexoraDomainProjectAssemblyResult,
  type NexoraDomainProjectObject,
  type NexoraDomainProjectRelation,
  type NexoraDomainProjectLoop,
} from "../domain/domainProjectAssembly";
import {
  buildBaselineKpiStateMap,
  buildBaselineLoopStateMap,
  buildBaselineObjectStateMap,
  buildBaselineRelationStateMap,
  DEFAULT_SIMULATION_SCENARIOS,
  runDomainScenarioSimulation,
  type NexoraScenarioDefinition,
  type NexoraScenarioOutcome,
} from "../simulation/domainSimulationScenarioEngine";
import {
  compareBaselineToScenario,
} from "../simulation/outcomeComparisonReplay";
import {
  runAutonomousScenarioExploration,
  type NexoraAutonomousExplorationResult,
  type NexoraExplorationGoal,
} from "../simulation/autonomousScenarioExploration";
import {
  runSystemFragilityScanner,
  type NexoraSystemFragilityScannerResult,
} from "../scanner/systemFragilityScannerEngine";
import {
  generateExecutiveBrief,
} from "../executive/executiveInsightRecommendation";
import {
  buildStrategicDecisionStory,
  flattenDecisionStoryToBlocks,
  type NexoraDecisionStory,
} from "../executive/strategicNarrativeDecisionStory";
import {
  integrateDomainProjectIntoRuntime,
  type NexoraDomainRuntimeIntegrationResult,
} from "../runtime/domainRuntimeIntegration";

export type NexoraProductMode =
  | "business"
  | "finance"
  | "strategy"
  | "devops"
  | "scanner"
  | "general";

export interface NexoraUserPromptInput {
  prompt: string;
  domainId?: string | null;
  projectId?: string | null;
  mode?: NexoraProductMode | null;
}

export interface NexoraProductFlowResult {
  interpretation?: any;
  runtimeModel?: any;
  simulationOutcome?: any;
  comparisonResult?: any;
  fragilityScan?: NexoraSystemFragilityScannerResult;
  explorationResult?: NexoraAutonomousExplorationResult;
  executiveBrief?: any;
  decisionStory?: any;
  notes?: string[];
}

function normalizeText(value: string): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeMode(mode?: NexoraProductMode | null): NexoraProductMode {
  const normalized = normalizeText(String(mode ?? "")).toLowerCase();
  switch (normalized) {
    case "business":
    case "finance":
    case "strategy":
    case "devops":
    case "scanner":
      return normalized;
    default:
      return "general";
  }
}

function uniq(values: string[]): string[] {
  return Array.from(
    new Set(values.map((value) => normalizeText(String(value ?? ""))).filter(Boolean))
  );
}

function toTitleCase(value: string): string {
  return normalizeText(value)
    .split(/[_\s]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function resolveDomainId(args: NexoraUserPromptInput): string | null {
  const explicit = normalizeText(String(args.domainId ?? ""));
  if (explicit) return explicit;
  const mode = normalizeMode(args.mode);
  if (mode === "business" || mode === "finance" || mode === "strategy" || mode === "devops") {
    return mode;
  }
  return null;
}

function resolveExplorationGoal(mode?: NexoraProductMode | null): NexoraExplorationGoal {
  switch (normalizeMode(mode)) {
    case "scanner":
      return "find_fragility";
    case "strategy":
      return "compare_alternatives";
    case "finance":
      return "find_pressure_points";
    case "business":
    case "devops":
      return "general";
    default:
      return "general";
  }
}

function buildFallbackScenario(
  interpretation: NexoraDomainScenarioKpiInterpretation
): NexoraScenarioDefinition {
  const domainId = normalizeText(String(interpretation.domainId ?? "")) || "general";
  const primaryKpi = interpretation.inferredPrimaryKpi;
  const scenarioLabel =
    interpretation.inferredPrimaryScenario?.label ||
    `${toTitleCase(domainId)} Scenario`;

  return {
    id:
      interpretation.inferredPrimaryScenario?.id ||
      `${domainId}_default_scenario`,
    label: scenarioLabel,
    domainId,
    severity: interpretation.inferredPrimaryScenario?.severityHint ?? "moderate",
    tags: uniq([
      ...(interpretation.inferredTags ?? []),
      ...(primaryKpi?.tags ?? []),
      domainId,
    ]),
    metadata: {
      source: "fallback",
    },
    events: [
      {
        id: `${domainId}_system_pressure`,
        label: "System Pressure",
        type: "pressure",
        targetType: "system",
        intensity: 0.6,
        weight: 0.5,
        direction: "increase",
        tags: uniq(["pressure", domainId]),
      },
    ],
  };
}

function cloneScenarioDefinition(input: NexoraScenarioDefinition): NexoraScenarioDefinition {
  return {
    ...input,
    events: Array.isArray(input.events)
      ? input.events.map((event) => ({
          ...event,
          tags: Array.isArray(event.tags) ? [...event.tags] : [],
          metadata:
            event.metadata && typeof event.metadata === "object" && !Array.isArray(event.metadata)
              ? { ...event.metadata }
              : {},
        }))
      : [],
    tags: Array.isArray(input.tags) ? [...input.tags] : [],
    metadata:
      input.metadata && typeof input.metadata === "object" && !Array.isArray(input.metadata)
        ? { ...input.metadata }
        : {},
  };
}

function buildGenericObjectsFromScenario(
  scenario: NexoraScenarioDefinition,
  interpretation: NexoraDomainScenarioKpiInterpretation,
  domainId?: string | null
): NexoraDomainProjectObject[] {
  const mapping = getDomainScenarioKpiMapping(
    DEFAULT_DOMAIN_SCENARIO_KPI_MAPPINGS,
    domainId ?? interpretation.domainId ?? null
  );
  const mappedScenario = (mapping?.scenarios ?? []).find((entry) => entry.id === scenario.id);
  const relatedRoles = uniq([
    ...(Array.isArray(mappedScenario?.relatedObjectRoles) ? mappedScenario!.relatedObjectRoles! : []),
    ...(Array.isArray(mapping?.kpis)
      ? mapping!.kpis
          .filter((kpi) => kpi.id === interpretation.inferredPrimaryKpi?.id)
          .flatMap((kpi) => kpi.relatedObjectRoles ?? [])
      : []),
  ]);

  const fallbackRoles = relatedRoles.length > 0 ? relatedRoles : ["source", "node", "outcome"];
  return fallbackRoles.map((role, index) => ({
    id: `${role}_${index + 1}`,
    label: toTitleCase(role),
    coreRole: role,
    domainId: domainId ?? interpretation.domainId ?? null,
    tags: uniq([role, ...(interpretation.inferredTags ?? [])]),
    sourceType: "product_wiring",
    metadata: {
      source: "scenario_roles",
    },
  }));
}

function buildGenericRelationsFromObjects(
  objects: NexoraDomainProjectObject[],
  domainId?: string | null
): NexoraDomainProjectRelation[] {
  const relations: NexoraDomainProjectRelation[] = [];
  for (let index = 0; index < objects.length - 1; index += 1) {
    relations.push({
      id: `rel_${objects[index].id}_${objects[index + 1].id}`,
      from: objects[index].id,
      to: objects[index + 1].id,
      relationType: "causes",
      domainId: domainId ?? null,
      tags: ["product_wiring", "causal_chain"],
      metadata: {
        source: "product_wiring",
      },
    });
  }
  return relations;
}

function buildGenericLoopsFromObjects(
  objects: NexoraDomainProjectObject[],
  scenario: NexoraScenarioDefinition,
  domainId?: string | null
): NexoraDomainProjectLoop[] {
  if (objects.length < 2) return [];
  return [
    {
      id: `loop_${scenario.id}`,
      label: `${scenario.label} Pressure Loop`,
      loopType: "pressure",
      nodes: objects.map((object) => object.id),
      domainId: domainId ?? null,
      tags: uniq(["pressure", "product_wiring", ...(scenario.tags ?? [])]),
      metadata: {
        source: "product_wiring",
      },
    },
  ];
}

function buildProjectForScenario(args: {
  interpretation: NexoraDomainScenarioKpiInterpretation;
  scenario: NexoraScenarioDefinition;
  domainId?: string | null;
  projectId?: string | null;
}): NexoraDomainProjectAssemblyResult {
  const domainId = args.domainId ?? args.interpretation.domainId ?? null;
  const objects = buildGenericObjectsFromScenario(args.scenario, args.interpretation, domainId);
  const relations = buildGenericRelationsFromObjects(objects, domainId);
  const loops = buildGenericLoopsFromObjects(objects, args.scenario, domainId);

  return assembleDomainProject({
    projectId: normalizeText(String(args.projectId ?? "")) || undefined,
    label: `${args.scenario.label} Project`,
    domainId,
    scenarioKpiMapping: getDomainScenarioKpiMapping(
      DEFAULT_DOMAIN_SCENARIO_KPI_MAPPINGS,
      domainId
    ),
    objects,
    relations,
    loops,
    tags: uniq([
      ...(args.interpretation.inferredTags ?? []),
      ...(args.scenario.tags ?? []),
      "product_wiring",
    ]),
  });
}

function buildBaselineOutcome(runtimeModel: any, scenario?: NexoraScenarioDefinition): NexoraScenarioOutcome {
  return {
    scenarioId: "baseline",
    label: scenario ? `${scenario.label} Baseline` : "Baseline",
    domainId: runtimeModel?.domainId ?? null,
    objectImpacts: [],
    kpiImpacts: [],
    steps: [],
    snapshots: [
      {
        stepIndex: 0,
        objectStates: buildBaselineObjectStateMap(runtimeModel),
        relationStates: buildBaselineRelationStateMap(runtimeModel),
        loopStates: buildBaselineLoopStateMap(runtimeModel),
        kpiStates: buildBaselineKpiStateMap(runtimeModel),
      },
    ],
    overallRisk: "low",
    summary: "Baseline state before scenario activation.",
    notes: ["Baseline snapshot generated by product wiring."],
  };
}

export function runPromptInterpretationStep(
  args: NexoraUserPromptInput
) {
  const domainId = resolveDomainId(args);
  const mapping = getDomainScenarioKpiMapping(
    DEFAULT_DOMAIN_SCENARIO_KPI_MAPPINGS,
    domainId
  );

  return interpretScenarioAndKpiForDomain({
    text: args.prompt,
    mapping,
    domainId,
  });
}

export function detectScenarioFromPrompt(
  interpretation: any
) {
  const normalizedInterpretation =
    interpretation as NexoraDomainScenarioKpiInterpretation;
  const domainId = normalizeText(String(normalizedInterpretation?.domainId ?? ""));
  const registryScenarios = DEFAULT_SIMULATION_SCENARIOS[domainId] ?? [];
  const primaryScenarioId = normalizeText(
    String(normalizedInterpretation?.inferredPrimaryScenario?.id ?? "")
  );

  const matchedScenario = registryScenarios.find(
    (scenario) => normalizeText(scenario.id) === primaryScenarioId
  );

  if (matchedScenario) {
    return cloneScenarioDefinition(matchedScenario);
  }

  if (registryScenarios.length > 0) {
    return cloneScenarioDefinition(registryScenarios[0]);
  }

  return buildFallbackScenario(normalizedInterpretation);
}

export function prepareRuntimeForSimulation(
  args: {
    project?: any;
    domainId?: string | null;
  }
) {
  const project = args.project ?? assembleDomainProject({ domainId: args.domainId ?? null });
  return integrateDomainProjectIntoRuntime({
    project,
    mode: args.domainId ?? null,
  });
}

export function runScenarioSimulationStep(
  args: {
    runtimeModel: any;
    scenario: any;
  }
) {
  return runDomainScenarioSimulation({
    runtimeModel: args.runtimeModel,
    scenario: args.scenario,
  });
}

export function runOutcomeComparisonStep(
  args: {
    baselineOutcome?: any;
    scenarioOutcome?: any;
  }
) {
  if (!args.baselineOutcome || !args.scenarioOutcome) return null;
  return compareBaselineToScenario({
    baselineOutcome: args.baselineOutcome,
    scenarioOutcome: args.scenarioOutcome,
  });
}

export function runExecutiveInsightStep(
  args: {
    runtimeModel?: any;
    scenarioOutcome?: any;
    fragilityScan?: NexoraSystemFragilityScannerResult;
    explorationResult?: NexoraAutonomousExplorationResult;
  }
) {
  return generateExecutiveBrief({
    runtimeModel: args.runtimeModel,
    objectImpacts: args.scenarioOutcome?.objectImpacts ?? [],
    kpiImpacts: args.scenarioOutcome?.kpiImpacts ?? [],
    fragilityScan: args.fragilityScan,
    explorationResult: args.explorationResult,
  });
}

export function runStrategicStoryStep(
  args: {
    runtimeModel?: any;
    scenarioOutcome?: any;
    executiveBrief?: any;
    comparisonResult?: any;
    explorationResult?: NexoraAutonomousExplorationResult;
    mode?: NexoraProductMode;
  }
) {
  return buildStrategicDecisionStory({
    domainId: args.runtimeModel?.domainId ?? null,
    mode: args.mode ?? "general",
    runtimeModel: args.runtimeModel,
    scenarioOutcome: args.scenarioOutcome,
    executiveBrief: args.executiveBrief,
    comparisonResult: args.comparisonResult,
    explorationResult: args.explorationResult,
  });
}

export function runAutonomousExplorationStep(
  args: {
    runtimeModel?: any;
    runtimeContext?: any;
    fragilityScan?: NexoraSystemFragilityScannerResult;
    mode?: NexoraProductMode;
  }
) {
  if (!args.runtimeModel) return null;
  return runAutonomousScenarioExploration({
    runtimeModel: args.runtimeModel,
    runtimeContext: args.runtimeContext,
    fragilityScan: args.fragilityScan,
    domainId: args.runtimeModel?.domainId ?? null,
    goal: resolveExplorationGoal(args.mode),
  });
}

export function runSystemFragilityScanStep(
  args: {
    runtimeModel?: any;
    runtimeContext?: any;
    mode?: NexoraProductMode;
  }
) {
  if (!args.runtimeModel) return null;
  return runSystemFragilityScanner({
    runtimeModel: args.runtimeModel,
    runtimeContext: args.runtimeContext,
    domain: args.runtimeModel?.domainId ?? args.mode ?? null,
  });
}

export function runNexoraProductFlow(
  args: NexoraUserPromptInput
): NexoraProductFlowResult {
  const interpretation = runPromptInterpretationStep(args);
  const scenario = detectScenarioFromPrompt(interpretation);
  const project = buildProjectForScenario({
    interpretation,
    scenario,
    domainId: resolveDomainId(args),
    projectId: args.projectId ?? null,
  });
  const runtimeIntegration = prepareRuntimeForSimulation({
    project,
    domainId: resolveDomainId(args),
  }) as NexoraDomainRuntimeIntegrationResult;
  const baselineOutcome = buildBaselineOutcome(runtimeIntegration.runtimeModel, scenario);
  const simulationOutcome = runScenarioSimulationStep({
    runtimeModel: runtimeIntegration.runtimeModel,
    scenario,
  });
  const comparisonResult = runOutcomeComparisonStep({
    baselineOutcome,
    scenarioOutcome: simulationOutcome,
  });
  const fragilityScan = runSystemFragilityScanStep({
    runtimeModel: runtimeIntegration.runtimeModel,
    runtimeContext: runtimeIntegration.runtimeContext,
    mode: normalizeMode(args.mode) as NexoraProductMode,
  });
  const explorationResult = runAutonomousExplorationStep({
    runtimeModel: runtimeIntegration.runtimeModel,
    runtimeContext: runtimeIntegration.runtimeContext,
    fragilityScan: fragilityScan ?? undefined,
    mode: normalizeMode(args.mode) as NexoraProductMode,
  });
  const executiveBrief = runExecutiveInsightStep({
    runtimeModel: runtimeIntegration.runtimeModel,
    scenarioOutcome: simulationOutcome,
    fragilityScan: fragilityScan ?? undefined,
    explorationResult: explorationResult ?? undefined,
  });
  const decisionStory = runStrategicStoryStep({
    runtimeModel: runtimeIntegration.runtimeModel,
    scenarioOutcome: simulationOutcome,
    executiveBrief,
    comparisonResult,
    explorationResult: explorationResult ?? undefined,
    mode: normalizeMode(args.mode) as NexoraProductMode,
  });

  return {
    interpretation,
    runtimeModel: runtimeIntegration.runtimeModel,
    simulationOutcome,
    comparisonResult,
    fragilityScan: fragilityScan ?? undefined,
    explorationResult: explorationResult ?? undefined,
    executiveBrief,
    decisionStory,
    notes: uniq([
      ...(interpretation?.notes ?? []),
      ...(runtimeIntegration?.notes ?? []),
      ...(simulationOutcome?.notes ?? []),
      ...(comparisonResult?.notes ?? []),
      ...(fragilityScan?.notes ?? []),
      ...(explorationResult?.notes ?? []),
      ...(executiveBrief?.notes ?? []),
      ...(decisionStory?.notes ?? []),
      "Nexora product flow completed.",
    ]),
  };
}

export function buildCockpitOutput(
  flowResult: NexoraProductFlowResult
) {
  return {
    interpretation: flowResult.interpretation ?? null,
    overview: flowResult.executiveBrief?.summary ?? flowResult.simulationOutcome?.summary ?? "",
    riskLevel:
      flowResult.executiveBrief?.systemRiskLevel ??
      flowResult.simulationOutcome?.overallRisk ??
      null,
    recommendations: Array.isArray(flowResult.executiveBrief?.recommendations)
      ? flowResult.executiveBrief.recommendations
      : [],
    fragility: flowResult.fragilityScan ?? null,
    exploration: flowResult.explorationResult?.outputs?.cockpit ?? null,
    narrativeBlocks: flowResult.decisionStory
      ? flattenDecisionStoryToBlocks(flowResult.decisionStory as NexoraDecisionStory)
      : [],
    comparison: flowResult.comparisonResult ?? null,
    notes: flowResult.notes ?? [],
  };
}

export function traceProductFlow(
  flowResult: NexoraProductFlowResult
) {
  const trace: string[] = [];
  if (flowResult.interpretation) {
    trace.push(
      `interpretation:${normalizeText(
        flowResult.interpretation.inferredPrimaryScenario?.id ??
          flowResult.interpretation.rawText ??
          "none"
      )}`
    );
  }
  if (flowResult.runtimeModel) {
    trace.push(
      `runtime:objects=${safeNumber(flowResult.runtimeModel.objects?.length, 0)}`
    );
  }
  if (flowResult.simulationOutcome) {
    trace.push(
      `simulation:${normalizeText(flowResult.simulationOutcome.scenarioId ?? "none")}`
    );
  }
  if (flowResult.comparisonResult) {
    trace.push(
      `comparison:${normalizeText(flowResult.comparisonResult.comparisonMode ?? "none")}`
    );
  }
  if (flowResult.fragilityScan) {
    trace.push(
      `fragility:score=${safeNumber(flowResult.fragilityScan.fragilityScore, 0).toFixed(2)}`
    );
  }
  if (flowResult.explorationResult) {
    trace.push(
      `exploration:ranked=${safeNumber(flowResult.explorationResult.rankedScenarios?.length, 0)}`
    );
  }
  if (flowResult.executiveBrief) {
    trace.push(
      `brief:risk=${normalizeText(flowResult.executiveBrief.systemRiskLevel ?? "none")}`
    );
  }
  if (flowResult.decisionStory) {
    trace.push(
      `story:sections=${safeNumber(flowResult.decisionStory.sections?.length, 0)}`
    );
  }
  return trace;
}

export function runDemoFlow() {
  return runNexoraProductFlow({
    prompt: "supplier delay",
    domainId: "business",
    mode: "business",
    projectId: "nexora_demo_project",
  });
}
