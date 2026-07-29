import type { NexoraAutonomousExplorationResult } from "../simulation/autonomousScenarioExploration";
import type {
  NexoraScenarioOutcome,
  NexoraSimulationRuntimeInput,
} from "../simulation/domainSimulationScenarioEngine";
import type { NexoraOutcomeComparisonResult } from "../simulation/outcomeComparisonReplay";
import type { NexoraExecutiveBrief } from "./executiveInsightRecommendation";

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
  runtimeModel?: NexoraSimulationRuntimeInput | unknown;
  scenarioOutcome?: NexoraScenarioOutcome | unknown;
  comparisonResult?: NexoraOutcomeComparisonResult | unknown;
  executiveBrief?: NexoraExecutiveBrief | unknown;
  explorationResult?: NexoraAutonomousExplorationResult | unknown;
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

type NormalizedObjectImpact = {
  objectId: string;
  beforeRisk: number;
  afterRisk: number;
  beforeActivity: number;
  afterActivity: number;
  beforeStability: number;
  afterStability: number;
  notes: string[];
};

type NormalizedKpiImpact = {
  id: string;
  label: string;
  before: number;
  after: number;
  delta: number;
  trend: string;
  notes: string[];
};

type NormalizedObjectDifference = {
  objectId: string;
  riskDelta: number;
  activityDelta: number;
  stabilityDelta: number;
  notes: string[];
};

type NormalizedKpiDifference = {
  id: string;
  label: string;
  delta: number;
  trend: string;
  notes: string[];
};

type NormalizedScenarioOutcome = {
  scenarioId?: string | null;
  label: string;
  overallRisk?: string | null;
  summary: string;
  objectImpacts: NormalizedObjectImpact[];
  kpiImpacts: NormalizedKpiImpact[];
  notes: string[];
};

type NormalizedComparisonResult = {
  comparisonMode?: string | null;
  leftScenarioId?: string | null;
  rightScenarioId?: string | null;
  higherRiskSide?: "left" | "right" | "equal" | null;
  summary: string;
  objectDifferences: NormalizedObjectDifference[];
  kpiDifferences: NormalizedKpiDifference[];
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

function readRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function normalizeExecutiveBrief(brief?: unknown): NormalizedExecutiveBrief {
  const entry = readRecord(brief);
  return {
    summary: normalizeText(String(entry.summary ?? "")),
    topInsights: (Array.isArray(entry.topInsights) ? entry.topInsights : []).map((insight) => {
      const insightEntry = readRecord(insight);
      return {
      id: normalizeText(String(insightEntry.id ?? "")),
      label: normalizeText(String(insightEntry.label ?? "")),
      type: normalizeText(String(insightEntry.type ?? "")),
      ...(insightEntry.severity ? { severity: normalizeText(String(insightEntry.severity)) } : {}),
      ...(normalizeText(String(insightEntry.description ?? ""))
        ? { description: normalizeText(String(insightEntry.description)) }
        : {}),
      relatedObjectIds: Array.isArray(insightEntry.relatedObjectIds)
        ? uniq(insightEntry.relatedObjectIds.map((value: unknown) => String(value)))
        : [],
      relatedKpiIds: Array.isArray(insightEntry.relatedKpiIds)
        ? uniq(insightEntry.relatedKpiIds.map((value: unknown) => String(value)))
        : [],
      relatedLoopIds: Array.isArray(insightEntry.relatedLoopIds)
        ? uniq(insightEntry.relatedLoopIds.map((value: unknown) => String(value)))
        : [],
      notes: Array.isArray(insightEntry.notes)
        ? uniq(insightEntry.notes.map((value: unknown) => String(value)))
        : [],
    };
    }),
    recommendations: (Array.isArray(entry.recommendations) ? entry.recommendations : []).map(
      (recommendation) => {
        const recommendationEntry = readRecord(recommendation);
        return {
        id: normalizeText(String(recommendationEntry.id ?? "")),
        label: normalizeText(String(recommendationEntry.label ?? "")),
        ...(normalizeText(String(recommendationEntry.description ?? ""))
          ? { description: normalizeText(String(recommendationEntry.description)) }
          : {}),
        type: normalizeText(String(recommendationEntry.type ?? "")),
        ...(recommendationEntry.priority
          ? { priority: normalizeText(String(recommendationEntry.priority)) }
          : {}),
        targetObjectIds: Array.isArray(recommendationEntry.targetObjectIds)
          ? uniq(recommendationEntry.targetObjectIds.map((value: unknown) => String(value)))
          : [],
        targetKpiIds: Array.isArray(recommendationEntry.targetKpiIds)
          ? uniq(recommendationEntry.targetKpiIds.map((value: unknown) => String(value)))
          : [],
        notes: Array.isArray(recommendationEntry.notes)
          ? uniq(recommendationEntry.notes.map((value: unknown) => String(value)))
          : [],
      };
      }
    ),
    ...(entry.systemRiskLevel
      ? { systemRiskLevel: normalizeText(String(entry.systemRiskLevel)) }
      : {}),
    notes: Array.isArray(entry.notes)
      ? uniq(entry.notes.map((value: unknown) => String(value)))
      : [],
  };
}

function normalizeScenarioOutcome(outcome?: unknown): NormalizedScenarioOutcome {
  const entry = readRecord(outcome);
  return {
    ...(entry.scenarioId !== undefined
      ? {
          scenarioId:
            entry.scenarioId === null ? null : normalizeText(String(entry.scenarioId)),
        }
      : {}),
    label: normalizeText(String(entry.label ?? entry.scenarioId ?? "")),
    ...(entry.overallRisk
      ? { overallRisk: normalizeText(String(entry.overallRisk)) }
      : {}),
    summary: normalizeText(String(entry.summary ?? "")),
    objectImpacts: Array.isArray(entry.objectImpacts)
      ? entry.objectImpacts.map((impact) => {
          const impactEntry = readRecord(impact);
          return {
          objectId: normalizeText(String(impactEntry.objectId ?? "")),
          beforeRisk: safeNumber(impactEntry.beforeRisk, 0),
          afterRisk: safeNumber(impactEntry.afterRisk, 0),
          beforeActivity: safeNumber(impactEntry.beforeActivity, 0),
          afterActivity: safeNumber(impactEntry.afterActivity, 0),
          beforeStability: safeNumber(impactEntry.beforeStability, 0),
          afterStability: safeNumber(impactEntry.afterStability, 0),
          notes: Array.isArray(impactEntry.notes)
            ? uniq(impactEntry.notes.map((value: unknown) => String(value)))
            : [],
        };
        })
      : [],
    kpiImpacts: Array.isArray(entry.kpiImpacts)
      ? entry.kpiImpacts.map((impact) => {
          const impactEntry = readRecord(impact);
          return {
          id: normalizeText(String(impactEntry.id ?? "")),
          label: normalizeText(String(impactEntry.label ?? impactEntry.id ?? "")),
          before: safeNumber(impactEntry.before, 0),
          after: safeNumber(impactEntry.after, 0),
          delta: safeNumber(
            impactEntry.delta,
            safeNumber(impactEntry.after, 0) - safeNumber(impactEntry.before, 0)
          ),
          trend: normalizeText(String(impactEntry.trend ?? "stable")),
          notes: Array.isArray(impactEntry.notes)
            ? uniq(impactEntry.notes.map((value: unknown) => String(value)))
            : [],
        };
        })
      : [],
    notes: Array.isArray(entry.notes)
      ? uniq(entry.notes.map((value: unknown) => String(value)))
      : [],
  };
}

function normalizeComparisonResult(result?: unknown): NormalizedComparisonResult {
  const entry = readRecord(result);
  return {
    ...(entry.comparisonMode
      ? { comparisonMode: normalizeText(String(entry.comparisonMode)) }
      : {}),
    ...(entry.leftScenarioId !== undefined
      ? {
          leftScenarioId:
            entry.leftScenarioId === null
              ? null
              : normalizeText(String(entry.leftScenarioId)),
        }
      : {}),
    ...(entry.rightScenarioId !== undefined
      ? {
          rightScenarioId:
            entry.rightScenarioId === null
              ? null
              : normalizeText(String(entry.rightScenarioId)),
        }
      : {}),
    ...(entry.higherRiskSide
      ? { higherRiskSide: entry.higherRiskSide as "left" | "right" | "equal" }
      : {}),
    summary: normalizeText(String(entry.summary ?? "")),
    objectDifferences: Array.isArray(entry.objectDifferences)
      ? entry.objectDifferences.map((difference) => {
          const differenceEntry = readRecord(difference);
          return {
          objectId: normalizeText(String(differenceEntry.objectId ?? "")),
          riskDelta: safeNumber(differenceEntry.riskDelta, 0),
          activityDelta: safeNumber(differenceEntry.activityDelta, 0),
          stabilityDelta: safeNumber(differenceEntry.stabilityDelta, 0),
          notes: Array.isArray(differenceEntry.notes)
            ? uniq(differenceEntry.notes.map((value: unknown) => String(value)))
            : [],
        };
        })
      : [],
    kpiDifferences: Array.isArray(entry.kpiDifferences)
      ? entry.kpiDifferences.map((difference) => {
          const differenceEntry = readRecord(difference);
          return {
          id: normalizeText(String(differenceEntry.id ?? "")),
          label: normalizeText(String(differenceEntry.label ?? differenceEntry.id ?? "")),
          delta: safeNumber(differenceEntry.delta, 0),
          trend: normalizeText(String(differenceEntry.trend ?? "stable")),
          notes: Array.isArray(differenceEntry.notes)
            ? uniq(differenceEntry.notes.map((value: unknown) => String(value)))
            : [],
        };
        })
      : [],
    notes: Array.isArray(entry.notes)
      ? uniq(entry.notes.map((value: unknown) => String(value)))
      : [],
  };
}

function normalizeExplorationResult(explorationResult?: unknown): NormalizedExplorationResult {
  const entry = readRecord(explorationResult);
  const outputs = readRecord(entry.outputs);
  const decisionStory = readRecord(outputs.decisionStory);
  return {
    ...(entry.goal ? { goal: normalizeText(String(entry.goal)) } : {}),
    summary: normalizeText(String(entry.summary ?? "")),
    rankedScenarios: Array.isArray(entry.rankedScenarios)
      ? entry.rankedScenarios.map((scenario) => {
          const scenarioEntry = readRecord(scenario);
          return {
          scenarioId: normalizeText(String(scenarioEntry.scenarioId ?? "")),
          label: normalizeText(String(scenarioEntry.label ?? scenarioEntry.scenarioId ?? "")),
          overallScore: safeNumber(scenarioEntry.overallScore, 0),
          whyGenerated: normalizeText(String(scenarioEntry.whyGenerated ?? "")),
          ...(scenarioEntry.mostAffectedObjectId
            ? { mostAffectedObjectId: normalizeText(String(scenarioEntry.mostAffectedObjectId)) }
            : {}),
          ...(scenarioEntry.mostAffectedKpiId
            ? { mostAffectedKpiId: normalizeText(String(scenarioEntry.mostAffectedKpiId)) }
            : {}),
          ...(scenarioEntry.comparisonSummary
            ? { comparisonSummary: normalizeText(String(scenarioEntry.comparisonSummary)) }
            : {}),
        };
        })
      : [],
    outputs:
      entry.outputs && typeof entry.outputs === "object"
        ? {
            decisionStory:
              outputs.decisionStory && typeof outputs.decisionStory === "object"
                ? {
                    futureStatement: normalizeText(String(decisionStory.futureStatement ?? "")),
                    decisionFocus: normalizeText(String(decisionStory.decisionFocus ?? "")),
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

function getTopRiskImpact(input: NexoraStrategicNarrativeInput): NormalizedObjectImpact | null {
  const outcome = normalizeScenarioOutcome(input.scenarioOutcome);
  return [...outcome.objectImpacts]
    .sort(
      (a, b) =>
        (b.afterRisk - b.beforeRisk) - (a.afterRisk - a.beforeRisk) ||
        a.objectId.localeCompare(b.objectId)
    )[0] ?? null;
}

function getTopKpiImpact(input: NexoraStrategicNarrativeInput): NormalizedKpiImpact | null {
  const outcome = normalizeScenarioOutcome(input.scenarioOutcome);
  return [...outcome.kpiImpacts]
    .sort(
      (a, b) =>
        Math.abs(b.delta) - Math.abs(a.delta) || a.label.localeCompare(b.label)
    )[0] ?? null;
}

function getTopComparisonObject(input: NexoraStrategicNarrativeInput): NormalizedObjectDifference | null {
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
  comparisonResult?: NexoraOutcomeComparisonResult | unknown;
  executiveBrief?: NexoraExecutiveBrief | unknown;
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
