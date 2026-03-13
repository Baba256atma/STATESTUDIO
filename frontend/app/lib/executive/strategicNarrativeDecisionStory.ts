export type NexoraNarrativeSectionType =
  | "situation"
  | "signal"
  | "pressure"
  | "fragility"
  | "impact"
  | "future"
  | "recommendation"
  | "decision";

export type NexoraNarrativeTone =
  | "executive"
  | "strategic"
  | "analytical"
  | "operational"
  | "neutral";

export type NexoraDecisionStoryStyle =
  | "situation_pressure_action"
  | "risk_future_decision"
  | "signal_consequence_response"
  | "executive_brief"
  | "custom";

export interface NexoraNarrativeSection {
  id: string;
  type: NexoraNarrativeSectionType;
  label: string;
  content: string;
  priority?: number;
  tags?: string[];
}

export interface NexoraDecisionStory {
  id: string;
  title: string;
  tone: NexoraNarrativeTone;
  style: NexoraDecisionStoryStyle;
  sections: NexoraNarrativeSection[];
  summary?: string;
  notes?: string[];
}

export interface NexoraStrategicNarrativeInput {
  domainId?: string | null;
  mode?: string | null;
  runtimeModel?: any;
  scenarioOutcome?: any;
  comparisonResult?: any;
  executiveBrief?: any;
  explorationResult?: any;
  titleHint?: string;
  tags?: string[];
}

type NormalizedExecutiveInsight = {
  id: string;
  label: string;
  type: string;
  severity?: string;
  description?: string;
  relatedObjectIds: string[];
  relatedKpiIds: string[];
  relatedLoopIds: string[];
  notes: string[];
};

type NormalizedExecutiveRecommendation = {
  id: string;
  label: string;
  description?: string;
  type: string;
  priority?: string;
  targetObjectIds: string[];
  targetKpiIds: string[];
  notes: string[];
};

type NormalizedExecutiveBrief = {
  summary: string;
  topInsights: NormalizedExecutiveInsight[];
  recommendations: NormalizedExecutiveRecommendation[];
  systemRiskLevel?: string | null;
  notes: string[];
};

type NormalizedScenarioOutcome = {
  scenarioId?: string | null;
  label: string;
  overallRisk?: string | null;
  summary: string;
  objectImpacts: Array<Record<string, any>>;
  kpiImpacts: Array<Record<string, any>>;
  notes: string[];
};

type NormalizedComparisonResult = {
  comparisonMode?: string | null;
  leftScenarioId?: string | null;
  rightScenarioId?: string | null;
  higherRiskSide?: "left" | "right" | "equal" | null;
  summary: string;
  objectDifferences: Array<Record<string, any>>;
  kpiDifferences: Array<Record<string, any>>;
  notes: string[];
};

type NormalizedExplorationResult = {
  goal?: string | null;
  summary: string;
  rankedScenarios: Array<{
    scenarioId: string;
    label: string;
    overallScore: number;
    whyGenerated: string;
    mostAffectedObjectId?: string | null;
    mostAffectedKpiId?: string | null;
    comparisonSummary?: string;
  }>;
  outputs?: {
    decisionStory?: {
      futureStatement?: string;
      decisionFocus?: string;
    };
  };
};

function normalizeText(value: string): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function uniq(values: string[]): string[] {
  return Array.from(
    new Set(values.map((value) => normalizeText(String(value ?? ""))).filter(Boolean))
  );
}

function safeNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizeMode(mode?: string | null): string {
  return normalizeText(String(mode ?? "")).toLowerCase();
}

function normalizeExecutiveBrief(brief?: any): NormalizedExecutiveBrief {
  return {
    summary: normalizeText(brief?.summary ?? ""),
    topInsights: (Array.isArray(brief?.topInsights) ? brief.topInsights : []).map((insight: any) => ({
      id: normalizeText(insight?.id ?? ""),
      label: normalizeText(insight?.label ?? ""),
      type: normalizeText(insight?.type ?? ""),
      ...(insight?.severity ? { severity: normalizeText(insight.severity) } : {}),
      ...(normalizeText(insight?.description ?? "")
        ? { description: normalizeText(insight.description) }
        : {}),
      relatedObjectIds: Array.isArray(insight?.relatedObjectIds)
        ? uniq(insight.relatedObjectIds.map((value: unknown) => String(value)))
        : [],
      relatedKpiIds: Array.isArray(insight?.relatedKpiIds)
        ? uniq(insight.relatedKpiIds.map((value: unknown) => String(value)))
        : [],
      relatedLoopIds: Array.isArray(insight?.relatedLoopIds)
        ? uniq(insight.relatedLoopIds.map((value: unknown) => String(value)))
        : [],
      notes: Array.isArray(insight?.notes)
        ? uniq(insight.notes.map((value: unknown) => String(value)))
        : [],
    })),
    recommendations: (Array.isArray(brief?.recommendations) ? brief.recommendations : []).map(
      (recommendation: any) => ({
        id: normalizeText(recommendation?.id ?? ""),
        label: normalizeText(recommendation?.label ?? ""),
        ...(normalizeText(recommendation?.description ?? "")
          ? { description: normalizeText(recommendation.description) }
          : {}),
        type: normalizeText(recommendation?.type ?? ""),
        ...(recommendation?.priority
          ? { priority: normalizeText(recommendation.priority) }
          : {}),
        targetObjectIds: Array.isArray(recommendation?.targetObjectIds)
          ? uniq(recommendation.targetObjectIds.map((value: unknown) => String(value)))
          : [],
        targetKpiIds: Array.isArray(recommendation?.targetKpiIds)
          ? uniq(recommendation.targetKpiIds.map((value: unknown) => String(value)))
          : [],
        notes: Array.isArray(recommendation?.notes)
          ? uniq(recommendation.notes.map((value: unknown) => String(value)))
          : [],
      })
    ),
    ...(brief?.systemRiskLevel
      ? { systemRiskLevel: normalizeText(String(brief.systemRiskLevel)) }
      : {}),
    notes: Array.isArray(brief?.notes)
      ? uniq(brief.notes.map((value: unknown) => String(value)))
      : [],
  };
}

function normalizeScenarioOutcome(outcome?: any): NormalizedScenarioOutcome {
  return {
    ...(outcome?.scenarioId !== undefined
      ? {
          scenarioId:
            outcome?.scenarioId === null ? null : normalizeText(String(outcome.scenarioId)),
        }
      : {}),
    label: normalizeText(outcome?.label ?? outcome?.scenarioId ?? ""),
    ...(outcome?.overallRisk
      ? { overallRisk: normalizeText(String(outcome.overallRisk)) }
      : {}),
    summary: normalizeText(outcome?.summary ?? ""),
    objectImpacts: Array.isArray(outcome?.objectImpacts)
      ? outcome.objectImpacts.map((impact: any) => ({
          objectId: normalizeText(impact?.objectId ?? ""),
          beforeRisk: safeNumber(impact?.beforeRisk, 0),
          afterRisk: safeNumber(impact?.afterRisk, 0),
          beforeActivity: safeNumber(impact?.beforeActivity, 0),
          afterActivity: safeNumber(impact?.afterActivity, 0),
          beforeStability: safeNumber(impact?.beforeStability, 0),
          afterStability: safeNumber(impact?.afterStability, 0),
          notes: Array.isArray(impact?.notes)
            ? uniq(impact.notes.map((value: unknown) => String(value)))
            : [],
        }))
      : [],
    kpiImpacts: Array.isArray(outcome?.kpiImpacts)
      ? outcome.kpiImpacts.map((impact: any) => ({
          id: normalizeText(impact?.id ?? ""),
          label: normalizeText(impact?.label ?? impact?.id ?? ""),
          before: safeNumber(impact?.before, 0),
          after: safeNumber(impact?.after, 0),
          delta: safeNumber(
            impact?.delta,
            safeNumber(impact?.after, 0) - safeNumber(impact?.before, 0)
          ),
          trend: normalizeText(impact?.trend ?? "stable"),
          notes: Array.isArray(impact?.notes)
            ? uniq(impact.notes.map((value: unknown) => String(value)))
            : [],
        }))
      : [],
    notes: Array.isArray(outcome?.notes)
      ? uniq(outcome.notes.map((value: unknown) => String(value)))
      : [],
  };
}

function normalizeComparisonResult(result?: any): NormalizedComparisonResult {
  return {
    ...(result?.comparisonMode
      ? { comparisonMode: normalizeText(String(result.comparisonMode)) }
      : {}),
    ...(result?.leftScenarioId !== undefined
      ? {
          leftScenarioId:
            result.leftScenarioId === null
              ? null
              : normalizeText(String(result.leftScenarioId)),
        }
      : {}),
    ...(result?.rightScenarioId !== undefined
      ? {
          rightScenarioId:
            result.rightScenarioId === null
              ? null
              : normalizeText(String(result.rightScenarioId)),
        }
      : {}),
    ...(result?.higherRiskSide
      ? { higherRiskSide: result.higherRiskSide as "left" | "right" | "equal" }
      : {}),
    summary: normalizeText(result?.summary ?? ""),
    objectDifferences: Array.isArray(result?.objectDifferences)
      ? result.objectDifferences.map((difference: any) => ({
          objectId: normalizeText(difference?.objectId ?? ""),
          riskDelta: safeNumber(difference?.riskDelta, 0),
          activityDelta: safeNumber(difference?.activityDelta, 0),
          stabilityDelta: safeNumber(difference?.stabilityDelta, 0),
          notes: Array.isArray(difference?.notes)
            ? uniq(difference.notes.map((value: unknown) => String(value)))
            : [],
        }))
      : [],
    kpiDifferences: Array.isArray(result?.kpiDifferences)
      ? result.kpiDifferences.map((difference: any) => ({
          id: normalizeText(difference?.id ?? ""),
          label: normalizeText(difference?.label ?? difference?.id ?? ""),
          delta: safeNumber(difference?.delta, 0),
          trend: normalizeText(difference?.trend ?? "stable"),
          notes: Array.isArray(difference?.notes)
            ? uniq(difference.notes.map((value: unknown) => String(value)))
            : [],
        }))
      : [],
    notes: Array.isArray(result?.notes)
      ? uniq(result.notes.map((value: unknown) => String(value)))
      : [],
  };
}

function normalizeExplorationResult(explorationResult?: any): NormalizedExplorationResult {
  return {
    ...(explorationResult?.goal ? { goal: normalizeText(String(explorationResult.goal)) } : {}),
    summary: normalizeText(explorationResult?.summary ?? ""),
    rankedScenarios: Array.isArray(explorationResult?.rankedScenarios)
      ? explorationResult.rankedScenarios.map((scenario: any) => ({
          scenarioId: normalizeText(scenario?.scenarioId ?? ""),
          label: normalizeText(scenario?.label ?? scenario?.scenarioId ?? ""),
          overallScore: safeNumber(scenario?.overallScore, 0),
          whyGenerated: normalizeText(scenario?.whyGenerated ?? ""),
          ...(scenario?.mostAffectedObjectId
            ? { mostAffectedObjectId: normalizeText(String(scenario.mostAffectedObjectId)) }
            : {}),
          ...(scenario?.mostAffectedKpiId
            ? { mostAffectedKpiId: normalizeText(String(scenario.mostAffectedKpiId)) }
            : {}),
          ...(scenario?.comparisonSummary
            ? { comparisonSummary: normalizeText(String(scenario.comparisonSummary)) }
            : {}),
        }))
      : [],
    outputs:
      explorationResult?.outputs && typeof explorationResult.outputs === "object"
        ? {
            decisionStory:
              explorationResult.outputs.decisionStory &&
              typeof explorationResult.outputs.decisionStory === "object"
                ? {
                    futureStatement: normalizeText(explorationResult.outputs.decisionStory.futureStatement ?? ""),
                    decisionFocus: normalizeText(explorationResult.outputs.decisionStory.decisionFocus ?? ""),
                  }
                : undefined,
          }
        : undefined,
  };
}

function buildSection(
  id: string,
  type: NexoraNarrativeSectionType,
  label: string,
  content?: string,
  priority = 100,
  tags?: string[]
): NexoraNarrativeSection | null {
  const normalizedContent = normalizeText(content ?? "");
  if (!normalizedContent) return null;
  return {
    id,
    type,
    label,
    content: normalizedContent,
    priority,
    tags: Array.isArray(tags) ? uniq(tags) : [],
  };
}

function getPrimaryInsight(input: NexoraStrategicNarrativeInput): NormalizedExecutiveInsight | null {
  const brief = normalizeExecutiveBrief(input.executiveBrief);
  return brief.topInsights[0] ?? null;
}

function getPrimaryRecommendation(
  input: NexoraStrategicNarrativeInput
): NormalizedExecutiveRecommendation | null {
  const brief = normalizeExecutiveBrief(input.executiveBrief);
  return brief.recommendations[0] ?? null;
}

function getTopRiskImpact(input: NexoraStrategicNarrativeInput): Record<string, any> | null {
  const outcome = normalizeScenarioOutcome(input.scenarioOutcome);
  return [...outcome.objectImpacts]
    .sort(
      (a, b) =>
        (b.afterRisk - b.beforeRisk) - (a.afterRisk - a.beforeRisk) ||
        a.objectId.localeCompare(b.objectId)
    )[0] ?? null;
}

function getTopKpiImpact(input: NexoraStrategicNarrativeInput): Record<string, any> | null {
  const outcome = normalizeScenarioOutcome(input.scenarioOutcome);
  return [...outcome.kpiImpacts]
    .sort(
      (a, b) =>
        Math.abs(b.delta) - Math.abs(a.delta) || a.label.localeCompare(b.label)
    )[0] ?? null;
}

function getTopComparisonObject(input: NexoraStrategicNarrativeInput): Record<string, any> | null {
  const comparison = normalizeComparisonResult(input.comparisonResult);
  return [...comparison.objectDifferences]
    .sort(
      (a, b) =>
        Math.abs(b.riskDelta) - Math.abs(a.riskDelta) ||
        a.objectId.localeCompare(b.objectId)
    )[0] ?? null;
}

export function resolveNarrativeTone(args: {
  mode?: string | null;
  domainId?: string | null;
}): NexoraNarrativeTone {
  switch (normalizeMode(args.mode)) {
    case "executive":
      return "executive";
    case "manager":
      return "strategic";
    case "analyst":
      return "analytical";
    case "scanner":
      return "operational";
    default:
      return "strategic";
  }
}

export function resolveDecisionStoryStyle(args: {
  mode?: string | null;
  comparisonResult?: any;
  executiveBrief?: any;
}): NexoraDecisionStoryStyle {
  if (args.comparisonResult) return "risk_future_decision";
  if (normalizeMode(args.mode) === "executive") return "executive_brief";
  if (normalizeMode(args.mode) === "scanner") return "signal_consequence_response";
  return "situation_pressure_action";
}

export function buildSituationSection(
  input: NexoraStrategicNarrativeInput
): NexoraNarrativeSection | null {
  const outcome = normalizeScenarioOutcome(input.scenarioOutcome);
  const brief = normalizeExecutiveBrief(input.executiveBrief);
  const domainText = normalizeText(String(input.domainId ?? "system")) || "system";

  const content =
    outcome.summary ||
    brief.summary ||
    (outcome.label
      ? `${outcome.label} is shaping the current ${domainText} situation.`
      : `The ${domainText} system is under active review for decision pressure and resilience.`);

  return buildSection(
    "situation",
    "situation",
    "Situation",
    content,
    10,
    [domainText, "situation"]
  );
}

export function buildSignalSection(
  input: NexoraStrategicNarrativeInput
): NexoraNarrativeSection | null {
  const primaryInsight = getPrimaryInsight(input);
  const comparison = normalizeComparisonResult(input.comparisonResult);
  const outcome = normalizeScenarioOutcome(input.scenarioOutcome);
  const exploration = normalizeExplorationResult(input.explorationResult);
  const topScenario = exploration.rankedScenarios[0];

  const content =
    primaryInsight?.description ||
    topScenario?.whyGenerated ||
    (primaryInsight?.label
      ? `${primaryInsight.label} is the clearest signal in the current system state.`
      : comparison.summary ||
        (outcome.overallRisk
          ? `The leading signal is rising risk, now assessed as ${outcome.overallRisk}.`
          : ""));

  return buildSection(
    "signal",
    "signal",
    "Signal",
    content,
    20,
    ["signal"]
  );
}

export function buildPressureSection(
  input: NexoraStrategicNarrativeInput
): NexoraNarrativeSection | null {
  const outcome = normalizeScenarioOutcome(input.scenarioOutcome);
  const brief = normalizeExecutiveBrief(input.executiveBrief);
  const topKpi = getTopKpiImpact(input);
  const primaryInsight = getPrimaryInsight(input);

  const content =
    outcome.overallRisk
      ? `Pressure is accumulating across the system, with overall risk now ${outcome.overallRisk}.`
      : brief.systemRiskLevel
        ? `Pressure remains elevated, with system risk assessed as ${brief.systemRiskLevel}.`
        : topKpi && topKpi.delta < 0
          ? `${topKpi.label} is deteriorating, indicating rising operational and strategic pressure.`
          : primaryInsight?.type === "system_pressure"
            ? primaryInsight.description || `${primaryInsight.label} is adding pressure to the system.`
            : "";

  return buildSection(
    "pressure",
    "pressure",
    "Pressure",
    content,
    30,
    ["pressure"]
  );
}

export function buildFragilitySection(
  input: NexoraStrategicNarrativeInput
): NexoraNarrativeSection | null {
  const primaryInsight = normalizeExecutiveBrief(input.executiveBrief).topInsights.find(
    (insight) =>
      insight.type === "risk_driver" ||
      insight.type === "system_instability" ||
      insight.type === "loop_amplification"
  );
  const topRiskImpact = getTopRiskImpact(input);
  const topComparisonObject = getTopComparisonObject(input);

  const content =
    primaryInsight?.description ||
    (topRiskImpact?.objectId
      ? `${topRiskImpact.objectId} is the most exposed point in the current system path.`
      : topComparisonObject?.objectId
        ? `${topComparisonObject.objectId} shows the clearest fragility gap across compared futures.`
        : "");

  return buildSection(
    "fragility",
    "fragility",
    "Fragility",
    content,
    40,
    ["fragility"]
  );
}

export function buildImpactSection(
  input: NexoraStrategicNarrativeInput
): NexoraNarrativeSection | null {
  const brief = normalizeExecutiveBrief(input.executiveBrief);
  const outcome = normalizeScenarioOutcome(input.scenarioOutcome);
  const topKpi = getTopKpiImpact(input);

  const content =
    topKpi && topKpi.delta < 0
      ? `${topKpi.label} is absorbing the clearest downstream impact, moving ${topKpi.trend || "down"} by ${Math.abs(
          topKpi.delta
        ).toFixed(2)}.`
      : brief.summary ||
        (outcome.label
          ? `${outcome.label} is beginning to affect performance, continuity, and decision flexibility.`
          : "");

  return buildSection(
    "impact",
    "impact",
    "Impact",
    content,
    50,
    ["impact"]
  );
}

export function buildFutureSection(
  input: NexoraStrategicNarrativeInput
): NexoraNarrativeSection | null {
  const comparison = normalizeComparisonResult(input.comparisonResult);
  const outcome = normalizeScenarioOutcome(input.scenarioOutcome);
  const exploration = normalizeExplorationResult(input.explorationResult);

  const content =
    comparison.summary ||
    exploration.outputs?.decisionStory?.futureStatement ||
    exploration.rankedScenarios[0]?.comparisonSummary ||
    (comparison.higherRiskSide === "left"
      ? "The current path carries more future risk than the alternative under comparison."
      : comparison.higherRiskSide === "right"
        ? "The alternative path carries more future risk than the current path."
        : outcome.overallRisk
          ? `If the current pattern continues, the next state is likely to remain ${outcome.overallRisk} risk.`
          : "");

  return buildSection(
    "future",
    "future",
    "Future Outlook",
    content,
    60,
    ["future"]
  );
}

export function buildRecommendationSection(
  input: NexoraStrategicNarrativeInput
): NexoraNarrativeSection | null {
  const primaryRecommendation = getPrimaryRecommendation(input);
  const content =
    primaryRecommendation?.description ||
    primaryRecommendation?.label ||
    "";

  return buildSection(
    "recommendation",
    "recommendation",
    "Recommendation",
    content,
    70,
    ["recommendation"]
  );
}

export function buildDecisionSection(
  input: NexoraStrategicNarrativeInput
): NexoraNarrativeSection | null {
  const comparison = normalizeComparisonResult(input.comparisonResult);
  const brief = normalizeExecutiveBrief(input.executiveBrief);
  const outcome = normalizeScenarioOutcome(input.scenarioOutcome);
  const primaryRecommendation = getPrimaryRecommendation(input);
  const exploration = normalizeExplorationResult(input.explorationResult);

  const content =
    exploration.outputs?.decisionStory?.decisionFocus ||
    (comparison.higherRiskSide && comparison.higherRiskSide !== "equal"
      ? `Leadership should decide whether to accept the ${comparison.higherRiskSide} side risk profile or shift toward the lower-risk alternative.`
      : primaryRecommendation?.label
        ? `Leadership should now decide how quickly to act on ${primaryRecommendation.label}.`
        : brief.systemRiskLevel
          ? `Leadership should align the next decision with a ${brief.systemRiskLevel} risk environment.`
          : outcome.overallRisk
            ? `Leadership should decide how much risk to accept while the system remains ${outcome.overallRisk}.`
            : "");

  return buildSection(
    "decision",
    "decision",
    "Decision Framing",
    content,
    80,
    ["decision"]
  );
}

export function orderNarrativeSections(
  sections: NexoraNarrativeSection[],
  style: NexoraDecisionStoryStyle
): NexoraNarrativeSection[] {
  const orderMap: Record<NexoraDecisionStoryStyle, NexoraNarrativeSectionType[]> = {
    situation_pressure_action: [
      "situation",
      "pressure",
      "fragility",
      "impact",
      "recommendation",
      "decision",
    ],
    risk_future_decision: [
      "situation",
      "fragility",
      "impact",
      "future",
      "recommendation",
      "decision",
    ],
    signal_consequence_response: [
      "signal",
      "pressure",
      "impact",
      "recommendation",
      "decision",
    ],
    executive_brief: [
      "situation",
      "impact",
      "recommendation",
      "decision",
    ],
    custom: [
      "situation",
      "signal",
      "pressure",
      "fragility",
      "impact",
      "future",
      "recommendation",
      "decision",
    ],
  };

  const preferredOrder = orderMap[style] ?? orderMap.custom;

  return [...sections].sort((a, b) => {
    const typeDelta =
      preferredOrder.indexOf(a.type) - preferredOrder.indexOf(b.type);
    if (typeDelta !== 0) return typeDelta;
    const priorityDelta = safeNumber(a.priority, 100) - safeNumber(b.priority, 100);
    if (priorityDelta !== 0) return priorityDelta;
    return a.id.localeCompare(b.id);
  });
}

export function buildDecisionStoryTitle(
  input: NexoraStrategicNarrativeInput
): string {
  const titleHint = normalizeText(input.titleHint ?? "");
  if (titleHint) return titleHint;

  const outcome = normalizeScenarioOutcome(input.scenarioOutcome);
  if (outcome.label) {
    return `${outcome.label} Decision Story`;
  }

  const domainId = normalizeText(String(input.domainId ?? ""));
  if (domainId) {
    return `${domainId.charAt(0).toUpperCase()}${domainId.slice(1)} Strategic Narrative`;
  }

  return "Strategic Decision Story";
}

export function buildDecisionStorySummary(
  story: NexoraDecisionStory
): string {
  const topSections = story.sections.slice(0, 3);
  const fragments = topSections.map((section) => section.content).filter(Boolean);
  if (fragments.length === 0) {
    return `${story.title} provides a concise strategic narrative for the current system state.`;
  }
  return fragments.join(" ");
}

export function buildStrategicDecisionStory(
  input: NexoraStrategicNarrativeInput
): NexoraDecisionStory {
  const tone = resolveNarrativeTone({
    mode: input.mode,
    domainId: input.domainId,
  });
  const style = resolveDecisionStoryStyle({
    mode: input.mode,
    comparisonResult: input.comparisonResult,
    executiveBrief: input.executiveBrief,
  });

  const candidateSections = [
    buildSituationSection(input),
    buildSignalSection(input),
    buildPressureSection(input),
    buildFragilitySection(input),
    buildImpactSection(input),
    buildFutureSection(input),
    buildRecommendationSection(input),
    buildDecisionSection(input),
  ].filter((section): section is NexoraNarrativeSection => section !== null);

  const sections = orderNarrativeSections(candidateSections, style);
  const title = buildDecisionStoryTitle(input);
  const story: NexoraDecisionStory = {
    id: normalizeText(title).toLowerCase().replace(/[^a-z0-9]+/g, "_") || "strategic_decision_story",
    title,
    tone,
    style,
    sections,
    notes: uniq([
      ...(Array.isArray(input.tags) ? input.tags.map((value) => String(value)) : []),
      ...(input.domainId ? [String(input.domainId)] : []),
      ...(input.mode ? [String(input.mode)] : []),
    ]),
  };

  story.summary = buildDecisionStorySummary(story);
  return story;
}

export function flattenDecisionStoryToText(
  story: NexoraDecisionStory
): string {
  const lines: string[] = [story.title];
  if (story.summary) lines.push(story.summary);
  for (const section of story.sections) {
    lines.push(`${section.label}: ${section.content}`);
  }
  return lines.filter(Boolean).join("\n");
}

export function flattenDecisionStoryToBlocks(
  story: NexoraDecisionStory
): Array<{ id: string; label: string; content: string }> {
  return story.sections.map((section) => ({
    id: section.id,
    label: section.label,
    content: section.content,
  }));
}

const BUSINESS_EXAMPLE_STORY = buildStrategicDecisionStory({
  domainId: "business",
  mode: "manager",
  scenarioOutcome: {
    scenarioId: "supplier_delay",
    label: "Supplier Delay",
    overallRisk: "high",
    summary: "Supplier delay is now stressing the operating system and downstream commitments.",
    objectImpacts: [
      {
        objectId: "supplier",
        beforeRisk: 0.2,
        afterRisk: 0.78,
        beforeStability: 0.82,
        afterStability: 0.42,
      },
    ],
    kpiImpacts: [
      {
        id: "delivery_reliability",
        label: "Delivery Reliability",
        delta: -0.28,
        trend: "down",
      },
    ],
  },
  executiveBrief: {
    summary: "Delivery reliability is weakening as upstream stress spreads into the operating flow.",
    systemRiskLevel: "high",
    topInsights: [
      {
        id: "risk_driver_supplier",
        label: "Supplier risk driver",
        type: "risk_driver",
        description: "Supplier capacity is now the clearest fragility point in the business system.",
      },
    ],
    recommendations: [
      {
        id: "mitigate_supplier",
        label: "Protect backup supply capacity",
        description: "Stabilize the upstream dependency before inventory and customer commitments degrade further.",
      },
    ],
  },
});

const FINANCE_EXAMPLE_STORY = buildStrategicDecisionStory({
  domainId: "finance",
  mode: "executive",
  scenarioOutcome: {
    scenarioId: "liquidity_stress",
    label: "Liquidity Stress",
    overallRisk: "critical",
    summary: "Liquidity stress is tightening the system and reducing near-term resilience.",
    objectImpacts: [
      {
        objectId: "liquidity",
        beforeRisk: 0.3,
        afterRisk: 0.88,
      },
    ],
    kpiImpacts: [
      {
        id: "liquidity_health",
        label: "Liquidity Health",
        delta: -0.41,
        trend: "down",
      },
    ],
  },
  executiveBrief: {
    summary: "Liquidity health is degrading fast enough to constrain strategic flexibility.",
    systemRiskLevel: "critical",
    topInsights: [
      {
        id: "risk_driver_liquidity",
        label: "Liquidity risk driver",
        type: "risk_driver",
        description: "Liquidity is no longer a local issue; it is shaping the entire system posture.",
      },
    ],
    recommendations: [
      {
        id: "protect_liquidity",
        label: "Protect liquidity immediately",
        description: "Preserve funding flexibility and reduce short-term exposure concentration.",
      },
    ],
  },
});

const DEVOPS_EXAMPLE_STORY = buildStrategicDecisionStory({
  domainId: "devops",
  mode: "analyst",
  scenarioOutcome: {
    scenarioId: "database_latency",
    label: "Database Latency",
    overallRisk: "high",
    summary: "Database latency is creating broader service pressure across the runtime path.",
    objectImpacts: [
      {
        objectId: "database",
        beforeRisk: 0.22,
        afterRisk: 0.71,
        beforeStability: 0.76,
        afterStability: 0.44,
      },
    ],
    kpiImpacts: [
      {
        id: "service_uptime",
        label: "Service Uptime",
        delta: -0.24,
        trend: "down",
      },
    ],
  },
  executiveBrief: {
    summary: "Service continuity is weakening because the database dependency is under sustained pressure.",
    systemRiskLevel: "high",
    topInsights: [
      {
        id: "system_instability_cluster",
        label: "System instability cluster",
        type: "system_instability",
        description: "The database issue is no longer isolated; connected services are becoming unstable.",
      },
    ],
    recommendations: [
      {
        id: "contain_dependency",
        label: "Contain the unstable dependency",
        description: "Reduce dependency stress and activate fallback capacity before service quality degrades further.",
      },
    ],
  },
});

const STRATEGY_EXAMPLE_STORY = buildStrategicDecisionStory({
  domainId: "strategy",
  mode: "manager",
  comparisonResult: {
    comparisonMode: "scenario_vs_scenario",
    higherRiskSide: "left",
    summary: "The current path carries more strategic risk than the alternative response path.",
    objectDifferences: [
      {
        objectId: "market_share",
        riskDelta: 0.22,
      },
    ],
    kpiDifferences: [
      {
        id: "strategic_position",
        label: "Strategic Position",
        delta: -0.18,
        trend: "down",
      },
    ],
  },
  executiveBrief: {
    summary: "Competitive pressure is weakening position faster than the current response is absorbing it.",
    systemRiskLevel: "high",
    topInsights: [
      {
        id: "loop_amplification_market",
        label: "Competitive response amplification",
        type: "loop_amplification",
        description: "Competitive pressure is reinforcing itself through market perception and pricing pressure.",
      },
    ],
    recommendations: [
      {
        id: "shift_response_path",
        label: "Shift to the lower-risk response path",
        description: "Reduce pricing pressure while protecting the most important strategic commitments.",
      },
    ],
  },
});

export const EXAMPLE_STRATEGIC_DECISION_STORIES: Record<string, NexoraDecisionStory> = {
  business: BUSINESS_EXAMPLE_STORY,
  finance: FINANCE_EXAMPLE_STORY,
  devops: DEVOPS_EXAMPLE_STORY,
  strategy: STRATEGY_EXAMPLE_STORY,
};
