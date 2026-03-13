export type NexoraExecutiveSeverity =
  | "low"
  | "moderate"
  | "high"
  | "critical";

export type NexoraExecutiveInsightType =
  | "risk_driver"
  | "system_instability"
  | "loop_amplification"
  | "kpi_degradation"
  | "system_pressure"
  | "strategic_opportunity"
  | "stabilization_signal";

export interface NexoraExecutiveInsight {
  id: string;
  label: string;
  type: NexoraExecutiveInsightType;
  severity?: NexoraExecutiveSeverity;
  relatedObjectIds?: string[];
  relatedKpiIds?: string[];
  relatedLoopIds?: string[];
  description?: string;
  notes?: string[];
}

export type NexoraExecutiveRecommendationType =
  | "risk_mitigation"
  | "system_stabilization"
  | "capacity_adjustment"
  | "strategic_reallocation"
  | "monitoring_priority"
  | "scenario_test";

export interface NexoraExecutiveRecommendation {
  id: string;
  label: string;
  type: NexoraExecutiveRecommendationType;
  priority?: "low" | "medium" | "high";
  confidence?: number;
  targetObjectIds?: string[];
  targetKpiIds?: string[];
  description?: string;
  notes?: string[];
}

export interface NexoraExecutiveBrief {
  summary: string;
  topInsights: NexoraExecutiveInsight[];
  recommendations: NexoraExecutiveRecommendation[];
  systemRiskLevel?: NexoraExecutiveSeverity;
  notes?: string[];
}

function safeNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function clamp01(value: number): number {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean)));
}

function severityFromMagnitude(value: number): NexoraExecutiveSeverity {
  const magnitude = Math.abs(value);
  if (magnitude >= 0.75) return "critical";
  if (magnitude >= 0.5) return "high";
  if (magnitude >= 0.25) return "moderate";
  return "low";
}

function severityRank(value?: NexoraExecutiveSeverity): number {
  switch (value) {
    case "critical":
      return 4;
    case "high":
      return 3;
    case "moderate":
      return 2;
    case "low":
      return 1;
    default:
      return 0;
  }
}

function priorityFromSeverity(severity?: NexoraExecutiveSeverity): "low" | "medium" | "high" {
  switch (severity) {
    case "critical":
    case "high":
      return "high";
    case "moderate":
      return "medium";
    default:
      return "low";
  }
}

function compareInsights(a: NexoraExecutiveInsight, b: NexoraExecutiveInsight): number {
  const severityDelta = severityRank(b.severity) - severityRank(a.severity);
  if (severityDelta !== 0) return severityDelta;
  return a.id.localeCompare(b.id);
}

function compareRecommendations(a: NexoraExecutiveRecommendation, b: NexoraExecutiveRecommendation): number {
  const priorityRank = (value?: "low" | "medium" | "high"): number => {
    switch (value) {
      case "high":
        return 3;
      case "medium":
        return 2;
      case "low":
        return 1;
      default:
        return 0;
    }
  };
  const delta = priorityRank(b.priority) - priorityRank(a.priority);
  if (delta !== 0) return delta;
  return a.id.localeCompare(b.id);
}

function normalizeObjectImpacts(objectImpacts: any[]): Array<Record<string, any>> {
  return (Array.isArray(objectImpacts) ? objectImpacts : []).map((impact) => ({
    objectId: String(impact?.objectId ?? "").trim(),
    beforeRisk: safeNumber(impact?.beforeRisk, 0),
    afterRisk: safeNumber(impact?.afterRisk, 0),
    beforeActivity: safeNumber(impact?.beforeActivity, 0),
    afterActivity: safeNumber(impact?.afterActivity, 0),
    beforeStability: safeNumber(impact?.beforeStability, 0),
    afterStability: safeNumber(impact?.afterStability, 0),
    notes: Array.isArray(impact?.notes) ? uniq(impact.notes.map((value: unknown) => String(value))) : [],
  }));
}

function normalizeKpiImpacts(kpiImpacts: any[]): Array<Record<string, any>> {
  return (Array.isArray(kpiImpacts) ? kpiImpacts : []).map((impact) => ({
    id: String(impact?.id ?? "").trim(),
    label: String(impact?.label ?? impact?.id ?? "").trim(),
    before: safeNumber(impact?.before, 0),
    after: safeNumber(impact?.after, 0),
    delta: safeNumber(impact?.delta, safeNumber(impact?.after, 0) - safeNumber(impact?.before, 0)),
    trend: impact?.trend ?? "stable",
    notes: Array.isArray(impact?.notes) ? uniq(impact.notes.map((value: unknown) => String(value))) : [],
  }));
}

function normalizeRuntimeModel(runtimeModel?: any): any {
  return {
    objects: Array.isArray(runtimeModel?.objects) ? runtimeModel.objects : [],
    relations: Array.isArray(runtimeModel?.relations) ? runtimeModel.relations : [],
    loops: Array.isArray(runtimeModel?.loops) ? runtimeModel.loops : [],
    kpis: Array.isArray(runtimeModel?.kpis) ? runtimeModel.kpis : [],
  };
}

export function detectKpiDegradationInsights(
  kpiImpacts: any[]
): NexoraExecutiveInsight[] {
  return normalizeKpiImpacts(kpiImpacts)
    .filter((impact) => impact.delta < 0)
    .sort((a, b) => a.delta - b.delta || a.id.localeCompare(b.id))
    .map((impact) => ({
      id: `kpi_degradation_${impact.id}`,
      label: `${impact.label} degradation`,
      type: "kpi_degradation",
      severity: severityFromMagnitude(Math.abs(impact.delta)),
      relatedKpiIds: [impact.id],
      description: `${impact.label} weakened by ${Math.abs(impact.delta).toFixed(2)} during the analyzed outcome.`,
      notes: impact.notes,
    }));
}

export function detectRiskDriverInsights(
  objectImpacts: any[]
): NexoraExecutiveInsight[] {
  return normalizeObjectImpacts(objectImpacts)
    .map((impact) => ({
      ...impact,
      riskIncrease: Number((impact.afterRisk - impact.beforeRisk).toFixed(4)),
    }))
    .filter((impact) => impact.riskIncrease > 0)
    .sort((a, b) => b.riskIncrease - a.riskIncrease || a.objectId.localeCompare(b.objectId))
    .slice(0, 5)
    .map((impact) => ({
      id: `risk_driver_${impact.objectId}`,
      label: `${impact.objectId} risk driver`,
      type: "risk_driver",
      severity: severityFromMagnitude(impact.riskIncrease),
      relatedObjectIds: [impact.objectId],
      description: `${impact.objectId} recorded the strongest risk increase in the scenario outcome.`,
      notes: impact.notes,
    }));
}

export function detectLoopAmplificationInsights(
  runtimeModel: any
): NexoraExecutiveInsight[] {
  const normalizedRuntime = normalizeRuntimeModel(runtimeModel);
  return normalizedRuntime.loops
    .map((loop: any) => ({
      id: String(loop?.id ?? "").trim(),
      label: String(loop?.label ?? loop?.id ?? "").trim(),
      loopType: String(loop?.loopType ?? "").trim(),
      intensity: safeNumber(loop?.intensity, 0),
    }))
    .filter((loop: any) => loop.id && loop.intensity >= 0.65 && (loop.loopType === "reinforcing" || loop.loopType === "pressure" || loop.loopType === "risk_cascade"))
    .sort((a: any, b: any) => b.intensity - a.intensity || a.id.localeCompare(b.id))
    .map((loop: any) => ({
      id: `loop_amplification_${loop.id}`,
      label: `${loop.label || loop.id} amplification`,
      type: "loop_amplification",
      severity: severityFromMagnitude(loop.intensity),
      relatedLoopIds: [loop.id],
      description: `${loop.label || loop.id} is amplifying pressure across the runtime model.`,
      notes: [`Loop type: ${loop.loopType || "unknown"}.`],
    }));
}

export function detectSystemInstabilityInsights(
  objectImpacts: any[]
): NexoraExecutiveInsight[] {
  const impacts = normalizeObjectImpacts(objectImpacts);
  const unstableObjects = impacts.filter(
    (impact) =>
      impact.afterRisk >= 0.5 ||
      impact.afterStability <= 0.45 ||
      impact.afterStability < impact.beforeStability
  );

  if (unstableObjects.length < 2) return [];

  const severity = unstableObjects.length >= 5 ? "critical" : unstableObjects.length >= 3 ? "high" : "moderate";
  return [
    {
      id: "system_instability_cluster",
      label: "System instability cluster",
      type: "system_instability",
      severity,
      relatedObjectIds: unstableObjects.map((impact) => impact.objectId),
      description: `${unstableObjects.length} objects show material instability or elevated risk.`,
      notes: ["Instability is no longer isolated to a single object."],
    },
  ];
}

export function detectStrategicOpportunityInsights(
  kpiImpacts: any[]
): NexoraExecutiveInsight[] {
  return normalizeKpiImpacts(kpiImpacts)
    .filter((impact) => impact.delta > 0.08)
    .sort((a, b) => b.delta - a.delta || a.id.localeCompare(b.id))
    .map((impact) => ({
      id: `strategic_opportunity_${impact.id}`,
      label: `${impact.label} opportunity`,
      type: "strategic_opportunity",
      severity: severityFromMagnitude(impact.delta),
      relatedKpiIds: [impact.id],
      description: `${impact.label} improved materially and may support a strategic advantage.`,
      notes: impact.notes,
    }));
}

export function detectExplorationInsights(
  explorationResult?: any
): NexoraExecutiveInsight[] {
  const rankedScenarios = Array.isArray(explorationResult?.rankedScenarios)
    ? explorationResult.rankedScenarios
    : [];

  return rankedScenarios.slice(0, 2).map((scenario: any) => {
    const goal = String(explorationResult?.goal ?? "general");
    const type: NexoraExecutiveInsightType =
      goal === "find_opportunity" || goal === "find_stability"
        ? "stabilization_signal"
        : "system_pressure";
    return {
      id: `exploration_${String(scenario?.scenarioId ?? "scenario")}`,
      label: `${String(scenario?.label ?? "Scenario")} exploration signal`,
      type,
      severity: severityFromMagnitude(safeNumber(scenario?.overallScore, 0)),
      relatedObjectIds: scenario?.mostAffectedObjectId ? [String(scenario.mostAffectedObjectId)] : [],
      relatedKpiIds: scenario?.mostAffectedKpiId ? [String(scenario.mostAffectedKpiId)] : [],
      description:
        typeof scenario?.whyGenerated === "string" && scenario.whyGenerated.trim()
          ? scenario.whyGenerated.trim()
          : `Autonomous exploration ranked ${String(scenario?.label ?? "this scenario")} as a leading path.`,
      notes: Array.isArray(scenario?.notes) ? scenario.notes.map((value: unknown) => String(value)) : [],
    };
  });
}

export function detectFragilityScannerInsights(
  fragilityScan?: any
): NexoraExecutiveInsight[] {
  const topFindings = Array.isArray(fragilityScan?.findings) ? fragilityScan.findings.slice(0, 3) : [];
  return topFindings.map((finding: any) => ({
    id: `fragility_scan_${String(finding?.id ?? "finding")}`,
    label: `${String(finding?.label ?? "Fragility finding")}`,
    type:
      String(finding?.type ?? "") === "structural_imbalance"
        ? "system_instability"
        : String(finding?.type ?? "") === "loop_fragility"
          ? "loop_amplification"
          : "system_pressure",
    severity: severityFromMagnitude(safeNumber(finding?.score, 0)),
    relatedObjectIds: Array.isArray(finding?.objectIds) ? finding.objectIds.map((value: unknown) => String(value)) : [],
    relatedKpiIds: Array.isArray(finding?.kpiIds) ? finding.kpiIds.map((value: unknown) => String(value)) : [],
    relatedLoopIds: Array.isArray(finding?.loopIds) ? finding.loopIds.map((value: unknown) => String(value)) : [],
    description:
      typeof finding?.why === "string" && finding.why.trim()
        ? finding.why.trim()
        : "Platform fragility scanner detected a structural weakness in the runtime model.",
    notes: Array.isArray(finding?.notes) ? finding.notes.map((value: unknown) => String(value)) : [],
  }));
}

export function buildRiskMitigationRecommendations(
  insights: NexoraExecutiveInsight[]
): NexoraExecutiveRecommendation[] {
  return insights
    .filter((insight) => insight.type === "risk_driver")
    .map((insight) => ({
      id: `rec_mitigate_${insight.id}`,
      label: `Mitigate ${insight.label}`,
      type: "risk_mitigation",
      priority: priorityFromSeverity(insight.severity),
      confidence: clamp01(0.65 + severityRank(insight.severity) * 0.08),
      targetObjectIds: insight.relatedObjectIds ?? [],
      description: `Reduce exposure around ${insight.relatedObjectIds?.join(", ") || "the primary risk driver"} before pressure spreads further.`,
      notes: insight.notes,
    }));
}

export function buildSystemStabilizationRecommendations(
  insights: NexoraExecutiveInsight[]
): NexoraExecutiveRecommendation[] {
  return insights
    .filter((insight) => insight.type === "system_instability" || insight.type === "loop_amplification")
    .map((insight) => ({
      id: `rec_stabilize_${insight.id}`,
      label: `Stabilize ${insight.label}`,
      type: "system_stabilization",
      priority: priorityFromSeverity(insight.severity),
      confidence: clamp01(0.6 + severityRank(insight.severity) * 0.07),
      targetObjectIds: insight.relatedObjectIds ?? [],
      description: "Reduce active instability and dampen reinforcing system pressure before downstream effects intensify.",
      notes: insight.notes,
    }));
}

export function buildMonitoringPriorityRecommendations(
  insights: NexoraExecutiveInsight[]
): NexoraExecutiveRecommendation[] {
  return insights
    .filter((insight) => insight.severity === "high" || insight.severity === "critical")
    .map((insight) => ({
      id: `rec_monitor_${insight.id}`,
      label: `Monitor ${insight.label}`,
      type: "monitoring_priority",
      priority: "high",
      confidence: 0.72,
      targetObjectIds: insight.relatedObjectIds ?? [],
      targetKpiIds: insight.relatedKpiIds ?? [],
      description: "Increase monitoring priority on the most exposed system points and KPI signals.",
      notes: [`Source insight: ${insight.type}.`],
    }));
}

export function buildScenarioTestRecommendations(
  insights: NexoraExecutiveInsight[]
): NexoraExecutiveRecommendation[] {
  return insights
    .filter((insight) => insight.type === "loop_amplification" || insight.type === "system_pressure" || insight.type === "strategic_opportunity")
    .map((insight) => ({
      id: `rec_test_${insight.id}`,
      label: `Test scenarios around ${insight.label}`,
      type: "scenario_test",
      priority: insight.severity === "critical" ? "high" : "medium",
      confidence: 0.58,
      targetObjectIds: insight.relatedObjectIds ?? [],
      targetKpiIds: insight.relatedKpiIds ?? [],
      description: "Run additional scenario tests to validate how resilient the current system posture remains.",
      notes: [`Triggered by ${insight.type}.`],
    }));
}

export function buildExplorationRecommendations(
  explorationResult?: any
): NexoraExecutiveRecommendation[] {
  const outputs = explorationResult?.outputs?.executive;
  const rankedScenarios = Array.isArray(explorationResult?.rankedScenarios)
    ? explorationResult.rankedScenarios
    : [];

  return rankedScenarios.slice(0, 2).map((scenario: any, index: number) => ({
    id: `rec_exploration_${String(scenario?.scenarioId ?? index)}`,
    label: `Validate ${String(scenario?.label ?? "top scenario")}`,
    type: "scenario_test",
    priority: index === 0 ? "high" : "medium",
    confidence: clamp01(0.62 + safeNumber(scenario?.overallScore, 0) * 0.18),
    targetObjectIds: scenario?.mostAffectedObjectId ? [String(scenario.mostAffectedObjectId)] : [],
    targetKpiIds: scenario?.mostAffectedKpiId ? [String(scenario.mostAffectedKpiId)] : [],
    description:
      Array.isArray(outputs?.recommendations) && outputs.recommendations[index]
        ? String(outputs.recommendations[index])
        : `Run an explicit follow-up scenario around ${String(scenario?.label ?? "the top-ranked path")}.`,
    notes: [`Exploration goal: ${String(explorationResult?.goal ?? "general")}.`],
  }));
}

export function buildFragilityScannerRecommendations(
  fragilityScan?: any
): NexoraExecutiveRecommendation[] {
  const topFindings = Array.isArray(fragilityScan?.findings) ? fragilityScan.findings.slice(0, 2) : [];
  return topFindings.map((finding: any, index: number) => ({
    id: `rec_fragility_scan_${String(finding?.id ?? index)}`,
    label: `Reduce ${String(finding?.label ?? "fragility hotspot")}`,
    type:
      String(finding?.type ?? "") === "bottleneck"
        ? "capacity_adjustment"
        : String(finding?.type ?? "") === "single_point_of_failure"
          ? "risk_mitigation"
          : "system_stabilization",
    priority: safeNumber(finding?.score, 0) >= 0.7 ? "high" : "medium",
    confidence: clamp01(0.6 + safeNumber(finding?.score, 0) * 0.2),
    targetObjectIds: Array.isArray(finding?.objectIds) ? finding.objectIds.map((value: unknown) => String(value)) : [],
    targetKpiIds: Array.isArray(finding?.kpiIds) ? finding.kpiIds.map((value: unknown) => String(value)) : [],
    description:
      typeof finding?.why === "string" && finding.why.trim()
        ? `Address this fragility hotspot: ${finding.why.trim()}`
        : "Address the leading fragility hotspot before downstream pressure spreads.",
    notes: [`Platform fragility score: ${safeNumber(finding?.score, 0).toFixed(2)}.`],
  }));
}

export function inferSystemRiskLevel(
  objectImpacts: any[],
  kpiImpacts: any[]
): NexoraExecutiveSeverity {
  const normalizedObjects = normalizeObjectImpacts(objectImpacts);
  const normalizedKpis = normalizeKpiImpacts(kpiImpacts);

  const maxObjectRisk = normalizedObjects.reduce((acc, impact) => Math.max(acc, impact.afterRisk), 0);
  const maxRiskIncrease = normalizedObjects.reduce((acc, impact) => Math.max(acc, impact.afterRisk - impact.beforeRisk), 0);
  const maxNegativeKpi = Math.abs(
    normalizedKpis.reduce((acc, impact) => Math.min(acc, impact.delta), 0)
  );

  const score = Math.max(maxObjectRisk, maxRiskIncrease * 1.2, maxNegativeKpi * 1.4);
  return severityFromMagnitude(score);
}

export function buildExecutiveSummary(args: {
  insights: NexoraExecutiveInsight[];
  recommendations: NexoraExecutiveRecommendation[];
  riskLevel?: NexoraExecutiveSeverity;
}): string {
  const topInsight = [...args.insights].sort(compareInsights)[0];
  const topRecommendation = [...args.recommendations].sort(compareRecommendations)[0];
  const riskText = args.riskLevel ? `${args.riskLevel} system risk` : "elevated system attention";
  const insightText = topInsight ? topInsight.label : "no dominant insight detected";
  const recommendationText = topRecommendation ? topRecommendation.label : "continue monitoring";
  return `Nexora indicates ${riskText}, driven primarily by ${insightText}; recommended next step: ${recommendationText}.`;
}

export function generateExecutiveInsights(args: {
  runtimeModel?: any;
  objectImpacts?: any[];
  kpiImpacts?: any[];
  fragilityScan?: any;
  explorationResult?: any;
}): NexoraExecutiveInsight[] {
  const runtimeModel = normalizeRuntimeModel(args.runtimeModel);
  const insights = [
    ...detectRiskDriverInsights(args.objectImpacts ?? []),
    ...detectKpiDegradationInsights(args.kpiImpacts ?? []),
    ...detectLoopAmplificationInsights(runtimeModel),
    ...detectSystemInstabilityInsights(args.objectImpacts ?? []),
    ...detectStrategicOpportunityInsights(args.kpiImpacts ?? []),
    ...detectFragilityScannerInsights(args.fragilityScan),
    ...detectExplorationInsights(args.explorationResult),
  ];

  const deduped = insights.reduce<Record<string, NexoraExecutiveInsight>>((acc, insight) => {
    if (!acc[insight.id]) acc[insight.id] = insight;
    return acc;
  }, {});

  return Object.values(deduped).sort(compareInsights);
}

export function generateExecutiveRecommendations(
  insights: NexoraExecutiveInsight[],
  fragilityScan?: any,
  explorationResult?: any
): NexoraExecutiveRecommendation[] {
  const recommendations = [
    ...buildRiskMitigationRecommendations(insights),
    ...buildSystemStabilizationRecommendations(insights),
    ...buildMonitoringPriorityRecommendations(insights),
    ...buildScenarioTestRecommendations(insights),
    ...buildFragilityScannerRecommendations(fragilityScan),
    ...buildExplorationRecommendations(explorationResult),
  ];

  const deduped = recommendations.reduce<Record<string, NexoraExecutiveRecommendation>>((acc, recommendation) => {
    if (!acc[recommendation.id]) acc[recommendation.id] = recommendation;
    return acc;
  }, {});

  return Object.values(deduped).sort(compareRecommendations);
}

export function generateExecutiveBrief(args: {
  runtimeModel?: any;
  objectImpacts?: any[];
  kpiImpacts?: any[];
  fragilityScan?: any;
  explorationResult?: any;
}): NexoraExecutiveBrief {
  const insights = generateExecutiveInsights(args);
  const recommendations = generateExecutiveRecommendations(insights, args.fragilityScan, args.explorationResult);
  const systemRiskLevel = inferSystemRiskLevel(args.objectImpacts ?? [], args.kpiImpacts ?? []);
  const summary = buildExecutiveSummary({
    insights,
    recommendations,
    riskLevel: systemRiskLevel,
  });

  return {
    summary,
    topInsights: insights.slice(0, 5),
    recommendations: recommendations.slice(0, 5),
    systemRiskLevel,
    notes: ["Executive brief generated from runtime and impact signals."],
  };
}

const BUSINESS_EXAMPLE_BRIEF = generateExecutiveBrief({
  runtimeModel: {
    loops: [{ id: "l1", label: "Supplier Pressure", loopType: "pressure", intensity: 0.76 }],
  },
  objectImpacts: [
    {
      objectId: "supplier",
      beforeRisk: 0.2,
      afterRisk: 0.75,
      beforeActivity: 0.5,
      afterActivity: 0.3,
      beforeStability: 0.8,
      afterStability: 0.4,
    },
  ],
  kpiImpacts: [
    {
      id: "delivery_reliability",
      label: "Delivery Reliability",
      before: 0.72,
      after: 0.42,
      delta: -0.3,
    },
  ],
});

const FINANCE_EXAMPLE_BRIEF = generateExecutiveBrief({
  runtimeModel: {
    loops: [{ id: "l1", label: "Liquidity Cascade", loopType: "reinforcing", intensity: 0.82 }],
  },
  objectImpacts: [
    {
      objectId: "liquidity",
      beforeRisk: 0.3,
      afterRisk: 0.88,
      beforeActivity: 0.5,
      afterActivity: 0.35,
      beforeStability: 0.72,
      afterStability: 0.28,
    },
  ],
  kpiImpacts: [
    {
      id: "liquidity_health",
      label: "Liquidity Health",
      before: 0.66,
      after: 0.24,
      delta: -0.42,
    },
  ],
});

const DEVOPS_EXAMPLE_BRIEF = generateExecutiveBrief({
  runtimeModel: {
    loops: [{ id: "l1", label: "Latency Pressure", loopType: "pressure", intensity: 0.71 }],
  },
  objectImpacts: [
    {
      objectId: "database",
      beforeRisk: 0.25,
      afterRisk: 0.7,
      beforeActivity: 0.55,
      afterActivity: 0.42,
      beforeStability: 0.74,
      afterStability: 0.41,
    },
  ],
  kpiImpacts: [
    {
      id: "service_uptime",
      label: "Service Uptime",
      before: 0.81,
      after: 0.56,
      delta: -0.25,
    },
  ],
});

const STRATEGY_EXAMPLE_BRIEF = generateExecutiveBrief({
  runtimeModel: {
    loops: [{ id: "l1", label: "Competitive Response", loopType: "reinforcing", intensity: 0.68 }],
  },
  objectImpacts: [
    {
      objectId: "market_share",
      beforeRisk: 0.22,
      afterRisk: 0.64,
      beforeActivity: 0.5,
      afterActivity: 0.41,
      beforeStability: 0.76,
      afterStability: 0.46,
    },
  ],
  kpiImpacts: [
    {
      id: "strategic_position",
      label: "Strategic Position",
      before: 0.69,
      after: 0.47,
      delta: -0.22,
    },
  ],
});

export const EXAMPLE_EXECUTIVE_BRIEFS: Record<string, NexoraExecutiveBrief> = {
  business: BUSINESS_EXAMPLE_BRIEF,
  finance: FINANCE_EXAMPLE_BRIEF,
  devops: DEVOPS_EXAMPLE_BRIEF,
  strategy: STRATEGY_EXAMPLE_BRIEF,
};
