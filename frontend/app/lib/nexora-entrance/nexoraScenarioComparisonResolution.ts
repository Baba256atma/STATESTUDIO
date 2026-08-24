/**
 * NEX-EXP:6 — comparability, comparison, trade-off, and recommendation projection.
 * Consumes EI:4 helpers. Does not invent scores, estimates, or decisions.
 */

import {
  compareExplainablePriorities,
  createExpectedEffect,
  createPriorityFactor,
  createScenarioTradeoff,
  resolveExplainablePriority,
  scenarioPriorityTradeoffIntelligenceIdentity,
  type ExplainablePriority,
  type PriorityLevel,
} from "@/app/lib/executive-intelligence/scenarioPriorityTradeoffIntelligence.ts";
import { getExecutiveReasoningIdentity } from "@/app/lib/conversational-control/executiveReasoning.ts";
import { getExecutiveScenarioConversationIdentity } from "@/app/lib/conversational-control/executiveScenarioConversation.ts";
import type { ExecutiveScenarioObject } from "./nexoraScenarioDiscoveryTypes.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import type {
  ExecutiveComparisonDimension,
  ExecutiveScenarioComparisonView,
  ExecutiveScenarioRecommendationView,
  ExecutiveScenarioResult,
  ExecutiveScenarioTradeoffView,
  NexoraDecisionExperienceHandoff,
  QualitativeLevel,
  RecommendationStatus,
} from "./nexoraScenarioComparisonTypes.ts";

export function scenarioFingerprint(
  scenarios: readonly ExecutiveScenarioObject[],
): string {
  return scenarios
    .map((scenario) =>
      [
        scenario.id,
        scenario.scenarioStatus,
        scenario.timeHorizon ?? "",
        scenario.assumptions.map((entry) => entry.statement).join(","),
        scenario.unknowns.join(","),
        scenario.evidence.join(","),
        scenario.expectedEffects.join(","),
        scenario.constraints.join(","),
      ].join("|"),
    )
    .join("||");
}

export function isDecisionOrCommitmentUtterance(normalized: string): boolean {
  return (
    /^(?:approve|commit|decide on|i(?:'m| am) (?:choosing|selecting)|start|execute|implement|roll out)\b/.test(
      normalized,
    ) ||
    /\bapprove scenario\b/.test(normalized) ||
    /\bstart scenario\b/.test(normalized) ||
    /\bchoose scenario\b/.test(normalized) ||
    /\blet'?s go with\b/.test(normalized) ||
    /\bgo with scenario\b/.test(normalized)
  );
}

export function isPreferenceUtterance(normalized: string): boolean {
  return (
    /\bi prefer\b/.test(normalized) ||
    /\bi(?:'d| would) (?:rather|lean)\b/.test(normalized)
  );
}

export function isComparisonExperienceUtterance(normalized: string): boolean {
  return (
    /compare (?:the |these )?scenarios/.test(normalized) ||
    /^compare them$/.test(normalized) ||
    /how are they different/.test(normalized) ||
    /what do i (?:gain|sacrifice)/.test(normalized) ||
    /what(?:'s| is) the (?:trade-?off|downside)/.test(normalized) ||
    /what are the trade-?offs/.test(normalized) ||
    /which one is (?:faster|cheaper|strongest|better|safer)/.test(normalized) ||
    /which one costs less/.test(normalized) ||
    /which one has more risk/.test(normalized) ||
    /which (?:one|option) (?:is safer|best supports my goal)/.test(normalized) ||
    /show me the safer option/.test(normalized) ||
    /which one fits my goal/.test(normalized) ||
    /what assumptions matter/.test(normalized) ||
    /what don'?t we know/.test(normalized) ||
    /which one do you recommend/.test(normalized) ||
    /what do you recommend/.test(normalized) ||
    /which (?:scenario|path) (?:is strongest|makes the most sense)/.test(
      normalized,
    ) ||
    /what would nexora choose/.test(normalized) ||
    /does this mean you recommend/.test(normalized) ||
    /why not scenario/.test(normalized) ||
    /what would make scenario .+ better/.test(normalized) ||
    /how confident are you/.test(normalized) ||
    /are you choosing this for me/.test(normalized) ||
    /have i decided/.test(normalized) ||
    /why did .+ rank above/.test(normalized) ||
    /what would change the recommendation/.test(normalized) ||
    /which assumption matters most/.test(normalized) ||
    /what are we missing/.test(normalized) ||
    /what if .+ more important/.test(normalized) ||
    isPreferenceUtterance(normalized) ||
    (/^why$/.test(normalized) || /^why\?$/.test(normalized))
  );
}

export function detectManagerPriority(
  normalized: string,
  previous: "SPEED" | "COST" | "UNKNOWN",
): "SPEED" | "COST" | "UNKNOWN" {
  const shift = normalized.match(
    /what if (.+?) (?:becomes?|is|matters) more important than (.+)/,
  );
  if (shift) {
    return classifyPriorityPhrase(shift[1]) === "COST" ? "COST" : "SPEED";
  }
  if (
    /minimizing (?:cost|spend|budget)|cost matters more|speed of recovery/.test(
      normalized,
    )
  ) {
    if (/speed of recovery/.test(normalized) && /minimizing/.test(normalized)) {
      return previous;
    }
    if (/speed of recovery/.test(normalized)) return "SPEED";
    return "COST";
  }
  const classified = classifyPriorityPhrase(normalized);
  return classified === "UNKNOWN" ? previous : classified;
}

function classifyPriorityPhrase(phrase: string): "SPEED" | "COST" | "UNKNOWN" {
  const text = phrase.toLowerCase();
  const cost = /\bcost\b|\bspend|\bbudget|\bcheaper|\bprice|\bcash\b/.test(text);
  const speed = /\bspeed\b|\bfaster|\bquicker|\brecovery|\btime\b/.test(text);
  if (cost && !speed) return "COST";
  if (speed && !cost) return "SPEED";
  return "UNKNOWN";
}

export function namedScenario(
  scenarios: readonly ExecutiveScenarioObject[],
  utterance: string,
): ExecutiveScenarioObject | null {
  const letter = utterance.match(/scenario\s+([a-d])\b/i)?.[1];
  if (letter) {
    return (
      scenarios.find(
        (entry) => entry.letter.toLowerCase() === letter.toLowerCase(),
      ) ?? null
    );
  }
  return (
    scenarios.find((entry) => tokensOverlap(entry.title, utterance)) ?? null
  );
}

function tokensOverlap(left: string, right: string): boolean {
  const stop = new Set(["the", "and", "for", "with", "scenario", "option"]);
  const tokens = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(" ")
      .filter((token) => token.length > 2 && !stop.has(token));
  const a = new Set(tokens(left));
  const b = tokens(right);
  return b.some((token) => a.has(token));
}

function isBaseline(scenario: ExecutiveScenarioObject): boolean {
  return (
    scenario.source === "BASELINE" || /current plan|do nothing/i.test(scenario.title)
  );
}

function isRanked(scenario: ExecutiveScenarioObject): boolean {
  return (
    scenario.scenarioStatus === "POSSIBLE" ||
    scenario.scenarioStatus === "READY_FOR_COMPARISON"
  );
}

function extractNumericEvidence(
  scenario: ExecutiveScenarioObject,
): Readonly<Record<string, string>> {
  const values: Record<string, string> = {};
  for (const item of [...scenario.evidence, ...scenario.expectedEffects]) {
    const money = item.match(/\$[\d,]+(?:\.\d+)?k?/i);
    if (money) values.cost = money[0];
  }
  return Object.freeze(values);
}

function qualitativeFromUnknowns(
  scenario: ExecutiveScenarioObject,
  key: string,
): QualitativeLevel {
  const blob = `${scenario.unknowns.join(" ")} ${scenario.evidence.join(" ")}`.toLowerCase();
  if (blob.includes(key) && scenario.unknowns.some((entry) => entry.toLowerCase().includes(key))) {
    return "UNKNOWN";
  }
  return "UNKNOWN";
}

export function deriveDimensions(
  scenarios: readonly ExecutiveScenarioObject[],
  entrance: NexoraEntranceSession,
): readonly ExecutiveComparisonDimension[] {
  const dimensions: ExecutiveComparisonDimension[] = [];
  if (entrance.goalDiscovery?.context.goalTitle) {
    dimensions.push({
      id: "goal-fit",
      label: "Goal fit",
      source: "active Goal success context",
    });
  }
  if (scenarios.some((entry) => entry.timeHorizon)) {
    dimensions.push({
      id: "time-to-effect",
      label: "Time to effect",
      source: "stated Scenario horizon",
    });
  }
  if (scenarios.some((entry) => extractNumericEvidence(entry).cost)) {
    dimensions.push({
      id: "cost",
      label: "Cost",
      source: "recorded evidence",
    });
  } else if (scenarios.some((entry) => entry.unknowns.some((item) => /cost/.test(item)))) {
    dimensions.push({
      id: "cost",
      label: "Cost",
      source: "unknown until evidenced",
    });
  }
  if (scenarios.some((entry) => entry.constraints.length > 0)) {
    dimensions.push({
      id: "constraint-fit",
      label: "Constraint fit",
      source: "known Constraints",
    });
  }
  if (scenarios.some((entry) => entry.risks.length > 0)) {
    dimensions.push({
      id: "risk",
      label: "Risk",
      source: "Scenario risk signals",
    });
  }
  if (scenarios.some((entry) => entry.opportunities.length > 0)) {
    dimensions.push({
      id: "opportunity",
      label: "Opportunity capture",
      source: "known Opportunities",
    });
  }
  if (scenarios.some((entry) => entry.assumptions.length > 0)) {
    dimensions.push({
      id: "assumptions",
      label: "Assumptions",
      source: "Scenario assumptions",
    });
  }
  dimensions.push({
    id: "uncertainty",
    label: "Uncertainty",
    source: "recorded unknowns",
  });
  if (scenarios.some(isBaseline)) {
    dimensions.push({
      id: "baseline-delta",
      label: "Change versus current plan",
      source: "baseline Scenario",
    });
  }
  return Object.freeze(dimensions);
}

function goalFitLevel(scenario: ExecutiveScenarioObject): QualitativeLevel {
  if (!isRanked(scenario)) return "UNKNOWN";
  if (isBaseline(scenario)) return "LOW";
  if (scenario.expectedEffects.length > 0) return "HIGH";
  return "MEDIUM";
}

function timeLevel(scenario: ExecutiveScenarioObject): QualitativeLevel {
  if (!scenario.timeHorizon) return "UNKNOWN";
  return "FAST";
}

function riskLevel(scenario: ExecutiveScenarioObject): QualitativeLevel {
  if (scenario.risks.length === 0) return "UNKNOWN";
  return "MEDIUM";
}

function uncertaintyLevel(scenario: ExecutiveScenarioObject): QualitativeLevel {
  const fragile = scenario.assumptions.some(
    (entry) => !entry.validated && entry.materiality === "MATERIAL",
  );
  if (scenario.unknowns.length >= 2 || fragile) return "HIGH";
  if (scenario.unknowns.length === 1) return "MEDIUM";
  return "LOW";
}

function costLevel(scenario: ExecutiveScenarioObject): QualitativeLevel {
  if (extractNumericEvidence(scenario).cost) return "UNKNOWN";
  if (isBaseline(scenario)) return "LOW";
  return qualitativeFromUnknowns(scenario, "cost");
}

export function assessComparability(
  scenarios: readonly ExecutiveScenarioObject[],
): { readonly comparable: boolean; readonly reason: string } {
  const ranked = scenarios.filter(isRanked);
  const goalIds = new Set(
    scenarios.map((entry) => entry.goalId).filter((value): value is string => Boolean(value)),
  );
  if (goalIds.size > 1) {
    return {
      comparable: false,
      reason:
        "These Scenarios do not share a known Goal relationship, so Nexora will not manufacture a ranking.",
    };
  }
  if (ranked.length < 2 && !(ranked.length === 1 && ranked.some(isBaseline))) {
    return {
      comparable: ranked.length >= 2,
      reason:
        ranked.length === 0
          ? "No valid comparable Scenario remains."
          : "The set is not yet comparable enough to rank.",
    };
  }
  if (ranked.length < 2) {
    return {
      comparable: false,
      reason: "A valid comparison set needs at least two rankable Scenarios.",
    };
  }
  return { comparable: true, reason: "Scenarios share Goal/issue context and can be compared." };
}

function ei4PriorityFor(
  scenario: ExecutiveScenarioObject,
  managerPriority: "SPEED" | "COST" | "UNKNOWN",
): ExplainablePriority {
  const refs = scenario.assumptions.map((entry) => entry.statement).slice(0, 2);
  const assumptionRefs = refs.length ? refs : ["manager-stated"];
  const preferCost = managerPriority === "COST";
  const intervention = !isBaseline(scenario);
  const factors = [
    createPriorityFactor({
      factorId: `${scenario.id}-impact`,
      dimension: "impact",
      level: preferCost
        ? isBaseline(scenario)
          ? "medium"
          : "low"
        : isBaseline(scenario)
          ? "low"
          : "high",
      effect: "raises",
      reason: isBaseline(scenario)
        ? "Maintaining the current plan leaves the current gap in place."
        : "The path is modeled to change the conditions tied to the active issue.",
      evidenceRefs: [],
      assumptionRefs,
    }),
    createPriorityFactor({
      factorId: `${scenario.id}-strategic`,
      dimension: "strategic-relevance",
      level: preferCost
        ? "low"
        : isBaseline(scenario)
          ? "low"
          : "high",
      effect: "raises",
      reason: isBaseline(scenario)
        ? "Continue-as-is is weakly aligned with closing the Goal gap."
        : "Intervention is aligned with the active Goal direction without replacing MO:4.",
      evidenceRefs: [],
      assumptionRefs,
    }),
  ];
  if (managerPriority === "SPEED" && scenario.timeHorizon) {
    factors.push(
      createPriorityFactor({
        factorId: `${scenario.id}-time`,
        dimension: "time-sensitivity",
        level: "high",
        effect: "raises",
        reason: "A stated time horizon supports a faster path when speed is prioritized.",
        evidenceRefs: [],
        assumptionRefs,
      }),
    );
  }
  if (preferCost && isBaseline(scenario)) {
    factors.push(
      createPriorityFactor({
        factorId: `${scenario.id}-cost`,
        dimension: "constraint-pressure",
        level: "high",
        effect: "raises",
        reason: "The current plan adds no recorded incremental spend.",
        evidenceRefs: [],
        assumptionRefs,
      }),
    );
  }
  if (preferCost && intervention) {
    factors.push(
      createPriorityFactor({
        factorId: `${scenario.id}-spend`,
        dimension: "constraint-pressure",
        level: "high",
        effect: "reduces",
        reason: "Incremental spend is not evidenced as preferable when cost is the stated priority.",
        evidenceRefs: [],
        assumptionRefs,
      }),
    );
  }
  if (!isRanked(scenario)) {
    factors.push(
      createPriorityFactor({
        factorId: `${scenario.id}-constraint`,
        dimension: "constraint-pressure",
        level: "high",
        effect: "reduces",
        reason: "A hard Constraint or invalid status keeps this path from equal ranking.",
        evidenceRefs: [],
        assumptionRefs,
      }),
    );
  }
  return resolveExplainablePriority(factors);
}

function buildTradeoff(
  scenario: ExecutiveScenarioObject,
): ExecutiveScenarioTradeoffView {
  const gainStatement = isBaseline(scenario)
    ? "No added implementation load versus intervening."
    : scenario.expectedEffects[0] ??
      "May change the conditions tied to the active issue.";
  const sacrificeStatement = isBaseline(scenario)
    ? "The current gap is likely to remain."
    : scenario.risks[0] ??
      scenario.unknowns[0] ??
      scenario.assumptions.find((entry) => !entry.validated)?.statement ??
      "An unvalidated assumption remains.";
  const created = createScenarioTradeoff({
    tradeoffId: `${scenario.id}-exchange`,
    dimension: isBaseline(scenario) ? "operational-stability" : "strategic-alignment",
    gain: gainStatement,
    sacrifice: sacrificeStatement,
    evidenceRefs: [],
    assumptionRefs: scenario.assumptions.map((entry) => entry.statement).slice(0, 1).concat(
      scenario.unknowns.slice(0, 1),
    ).filter(Boolean).length
      ? [
          ...scenario.assumptions.map((entry) => entry.statement).slice(0, 1),
          ...scenario.unknowns.slice(0, 1),
        ]
      : ["manager-stated"],
    confidence: "medium",
    timeHorizon: null,
    reversibility: "unknown",
  });
  scenario.expectedEffects.forEach((effect, index) => {
    createExpectedEffect({
      effectId: `${scenario.id}-effect-${index}`,
      kind: "impact",
      statement: effect,
      claimType: "PREDICTION",
      evidenceRefs: [],
      assumptionRefs: ["scenario-expected-effect"],
      confidence: "low",
    });
  });
  return Object.freeze({
    scenarioId: scenario.id,
    gains: created.gain ? [created.gain] : [],
    sacrifices: created.sacrifice ? [created.sacrifice] : [],
    affectedGoals: scenario.goalId ? [scenario.goalId] : [],
    affectedRisks: scenario.risks,
    affectedConstraints: scenario.constraints,
    reversibility: null,
    timeToValue: scenario.timeHorizon,
    uncertainty: uncertaintyLevel(scenario),
    evidence: scenario.evidence,
    epistemicStatus: "PREDICTED",
  });
}

function dominatedIds(
  results: readonly ExecutiveScenarioResult[],
): readonly string[] {
  const ranked = results.filter((entry) => entry.ranked);
  return Object.freeze(
    ranked
      .filter((candidate) => {
        if (candidate.baseline) return false;
        const others = ranked.filter(
          (entry) => entry.scenarioId !== candidate.scenarioId,
        );
        if (!others.length) return false;
        const order: Record<string, number> = {
          HIGH: 3,
          FAST: 3,
          MEDIUM: 2,
          LOW: 1,
          UNKNOWN: 0,
        };
        return others.every((other) => {
          const keys = Object.keys(candidate.levels);
          return keys.every((key) => {
            const otherLevel = order[other.levels[key] ?? "UNKNOWN"] ?? 0;
            const candidateLevel = order[candidate.levels[key] ?? "UNKNOWN"] ?? 0;
            return otherLevel >= candidateLevel;
          }) && others.some((other) =>
            Object.keys(candidate.levels).some((key) => {
              const otherLevel = order[other.levels[key] ?? "UNKNOWN"] ?? 0;
              const candidateLevel = order[candidate.levels[key] ?? "UNKNOWN"] ?? 0;
              return otherLevel > candidateLevel;
            }),
          );
        });
      })
      .map((entry) => entry.scenarioId),
  );
}

export function projectScenarioComparison(input: {
  readonly scenarios: readonly ExecutiveScenarioObject[];
  readonly entrance: NexoraEntranceSession;
  readonly managerPriority: "SPEED" | "COST" | "UNKNOWN";
  readonly goalConflictNoted: boolean;
}): {
  readonly comparison: ExecutiveScenarioComparisonView;
  readonly recommendation: ExecutiveScenarioRecommendationView;
  readonly priorities: Readonly<Record<string, PriorityLevel>>;
} {
  const comparability = assessComparability(input.scenarios);
  const dimensions = deriveDimensions(input.scenarios, input.entrance);
  const scenarioResults: ExecutiveScenarioResult[] = input.scenarios.map((scenario) => {
    const numericValues = extractNumericEvidence(scenario);
    const levels: Record<string, QualitativeLevel> = {
      "goal-fit": goalFitLevel(scenario),
      uncertainty: uncertaintyLevel(scenario),
    };
    if (dimensions.some((entry) => entry.id === "time-to-effect")) {
      levels["time-to-effect"] = timeLevel(scenario);
    }
    if (dimensions.some((entry) => entry.id === "cost")) {
      levels.cost = numericValues.cost ? "UNKNOWN" : costLevel(scenario);
      if (numericValues.cost) levels.cost = "MEDIUM";
    }
    if (dimensions.some((entry) => entry.id === "risk")) {
      levels.risk = riskLevel(scenario);
    }
    if (dimensions.some((entry) => entry.id === "constraint-fit")) {
      levels["constraint-fit"] = scenario.constraints.length ? "MEDIUM" : "UNKNOWN";
    }
    return Object.freeze({
      scenarioId: scenario.id,
      title: scenario.title,
      letter: scenario.letter,
      ranked: isRanked(scenario),
      constrained: scenario.scenarioStatus === "CONSTRAINED",
      dominated: false,
      baseline: isBaseline(scenario),
      levels: Object.freeze(levels),
      numericValues,
    });
  });
  const tradeoffs = input.scenarios.map(buildTradeoff);
  const ranked = input.scenarios.filter(isRanked);
  const priorities: Record<string, PriorityLevel> = {};
  for (const scenario of ranked) {
    priorities[scenario.id] = ei4PriorityFor(scenario, input.managerPriority).level;
  }
  let preferred: string | null = null;
  const ties: string[] = [];
  if (comparability.comparable && ranked.length >= 2) {
    let lead = ranked[0];
    let tiedWithLead = [ranked[0].id];
    for (const other of ranked.slice(1)) {
      const compared = compareExplainablePriorities({
        leftId: lead.id,
        left: ei4PriorityFor(lead, input.managerPriority),
        rightId: other.id,
        right: ei4PriorityFor(other, input.managerPriority),
      });
      if (compared.result === "right") {
        lead = other;
        tiedWithLead = [other.id];
      } else if (compared.result === "tied" || compared.result === "unresolved") {
        tiedWithLead.push(other.id);
      }
    }
    if (tiedWithLead.length === 1) preferred = tiedWithLead[0];
    else ties.push(...tiedWithLead);
  }
  const dominance = dominatedIds(scenarioResults);
  const comparison: ExecutiveScenarioComparisonView = Object.freeze({
    comparisonId: `cmp-${scenarioFingerprint(input.scenarios).slice(0, 24) || "set"}`,
    goalId: input.entrance.goalDiscovery?.object?.id ?? ranked[0]?.goalId ?? null,
    scenarioIds: input.scenarios.map((entry) => entry.id),
    dimensions,
    scenarioResults: Object.freeze(
      scenarioResults.map((entry) =>
        Object.freeze({
          ...entry,
          dominated: dominance.includes(entry.scenarioId),
        }),
      ),
    ),
    tradeoffs: Object.freeze(tradeoffs),
    dominance,
    ties: Object.freeze([...new Set(ties)]),
    unknowns: Object.freeze(
      input.scenarios.flatMap((entry) =>
        entry.unknowns.map((item) => `${entry.letter}: ${item}`),
      ),
    ),
    evidence: Object.freeze(input.scenarios.flatMap((entry) => entry.evidence)),
    provenance: Object.freeze([
      scenarioPriorityTradeoffIntelligenceIdentity,
      getExecutiveScenarioConversationIdentity().id,
      getExecutiveReasoningIdentity().id,
    ]),
    epistemicStatus: comparability.comparable ? "INFERRED" : "UNKNOWN",
    comparisonStatus: comparability.comparable ? "READY" : "NOT_COMPARABLE",
    numericalScore: null,
  });
  const recommendation = projectRecommendation({
    comparison,
    scenarios: input.scenarios,
    preferred,
    ties,
    comparable: comparability.comparable,
    goalConflictNoted: input.goalConflictNoted,
    managerPriority: input.managerPriority,
    entrance: input.entrance,
  });
  return { comparison, recommendation, priorities };
}

function projectRecommendation(input: {
  readonly comparison: ExecutiveScenarioComparisonView;
  readonly scenarios: readonly ExecutiveScenarioObject[];
  readonly preferred: string | null;
  readonly ties: readonly string[];
  readonly comparable: boolean;
  readonly goalConflictNoted: boolean;
  readonly managerPriority: "SPEED" | "COST" | "UNKNOWN";
  readonly entrance: NexoraEntranceSession;
}): ExecutiveScenarioRecommendationView {
  const ranked = input.comparison.scenarioResults.filter((entry) => entry.ranked);
  let recommendationStatus: RecommendationStatus = "UNKNOWN";
  let recommendedScenarioId: string | null = null;
  let confidence: ExecutiveScenarioRecommendationView["confidence"] = "UNKNOWN";
  if (!input.comparable) {
    recommendationStatus = ranked.length === 0 ? "NO_VALID_SCENARIO" : "WITHHELD";
  } else if (ranked.length === 0) {
    recommendationStatus = "NO_VALID_SCENARIO";
  } else if (input.goalConflictNoted && input.managerPriority === "UNKNOWN") {
    recommendationStatus = "CONFLICTING_GOALS";
  } else if (input.ties.length >= 2 && !input.preferred) {
    recommendationStatus = "TIED";
    confidence = "LOW";
  } else if (
    ranked.every((entry) => entry.levels.uncertainty === "HIGH") &&
    !input.preferred
  ) {
    recommendationStatus = "INSUFFICIENT_EVIDENCE";
  } else if (input.preferred) {
    recommendationStatus = "AVAILABLE";
    recommendedScenarioId = input.preferred;
    confidence = ranked.find((entry) => entry.scenarioId === input.preferred)
      ?.levels.uncertainty === "HIGH"
      ? "LOW"
      : "MEDIUM";
  } else {
    recommendationStatus = "WITHHELD";
  }
  const recommended = input.scenarios.find(
    (entry) => entry.id === recommendedScenarioId,
  );
  const alternativeScenarioIds = ranked
    .filter((entry) => entry.scenarioId !== recommendedScenarioId)
    .map((entry) => entry.scenarioId);
  const tradeoff = input.comparison.tradeoffs.find(
    (entry) => entry.scenarioId === recommendedScenarioId,
  );
  const goalTitle =
    input.entrance.goalDiscovery?.context.goalTitle ?? "the active Goal";
  const reasoningSummary = recommended
    ? [
        `It currently fits ${goalTitle} more directly than continuing as-is.`,
        tradeoff?.gains[0] ? `Key benefit: ${tradeoff.gains[0]}` : null,
        tradeoff?.sacrifices[0] ? `Key sacrifice: ${tradeoff.sacrifices[0]}` : null,
        recommended.constraints[0]
          ? `Constraint: ${recommended.constraints[0]}`
          : null,
        recommended.unknowns[0]
          ? `Major uncertainty: ${recommended.unknowns[0]} remains unknown.`
          : null,
        alternativeScenarioIds.length
          ? "Alternatives rank lower on supported Goal fit or remain tied to a weaker continue-as-is path."
          : null,
      ]
        .filter(Boolean)
        .join(" ")
    : recommendationStatus === "TIED"
      ? "The comparable Scenarios are currently too close to distinguish confidently."
      : recommendationStatus === "CONFLICTING_GOALS"
        ? "Nexora cannot recommend confidently until Goal priority is clarified."
        : recommendationStatus === "INSUFFICIENT_EVIDENCE"
          ? "Evidence is not sufficient to rank a responsible recommendation."
          : recommendationStatus === "NO_VALID_SCENARIO"
            ? "No valid Scenario remains to recommend."
            : "Nexora is not recommending a Scenario yet.";
  return Object.freeze({
    recommendationId: `rec-${input.comparison.comparisonId}`,
    recommendedScenarioId,
    alternativeScenarioIds: Object.freeze(alternativeScenarioIds),
    reasoningSummary,
    goalFit: recommended
      ? `${recommended.title} currently shows stronger Goal fit than the continue-as-is path.`
      : "Goal fit is not collapsed into a hidden score.",
    tradeoffs: Object.freeze(
      tradeoff
        ? [...tradeoff.gains, ...tradeoff.sacrifices]
        : input.comparison.tradeoffs.flatMap((entry) => [
            ...entry.gains,
            ...entry.sacrifices,
          ]),
    ),
    risks: Object.freeze(recommended?.risks ?? []),
    constraints: Object.freeze(recommended?.constraints ?? []),
    assumptions: Object.freeze(
      (recommended?.assumptions ?? []).map((entry) => entry.statement),
    ),
    unknowns: Object.freeze(recommended?.unknowns ?? input.comparison.unknowns),
    confidence,
    epistemicStatus: "INFERRED",
    recommendationStatus,
    requiresManagerDecision: true,
    commitsDecision: false,
    startsExecution: false,
    sourceAuthorities: Object.freeze([
      scenarioPriorityTradeoffIntelligenceIdentity,
      getExecutiveReasoningIdentity().id,
      "MO:4/GoalDirection",
    ]),
  });
}

export function toDecisionHandoff(input: {
  readonly entrance: NexoraEntranceSession;
  readonly comparison: ExecutiveScenarioComparisonView | null;
  readonly recommendation: ExecutiveScenarioRecommendationView | null;
}): NexoraDecisionExperienceHandoff {
  return Object.freeze({
    activeGoal: input.entrance.goalDiscovery?.context ?? null,
    realityContext: input.entrance.realityDiscovery?.context ?? null,
    issueContext: input.entrance.issueDiscovery?.handoff ?? null,
    scenarioComparison: input.comparison,
    tradeoffs: input.comparison?.tradeoffs ?? [],
    recommendation: input.recommendation,
    recommendedScenario: input.recommendation?.recommendedScenarioId ?? null,
    alternatives: input.recommendation?.alternativeScenarioIds ?? [],
    decisionQuestion: "Which Scenario should be committed, if any?",
    decisionEvidence: input.comparison?.evidence ?? [],
    unknowns: input.comparison?.unknowns ?? [],
    conversationContext: input.entrance.conversationNotes.slice(-6).join(" | "),
    commitsDecision: false,
  });
}

export function cheaperClaim(
  scenarios: readonly ExecutiveScenarioObject[],
): string {
  const priced = scenarios.filter((entry) => extractNumericEvidence(entry).cost);
  if (priced.length < 2) {
    return "Cost remains unknown where it is not evidenced. Nexora will not rank a Scenario as cheaper from missing numbers.";
  }
  const sorted = [...priced].sort((left, right) =>
    (extractNumericEvidence(left).cost ?? "").localeCompare(
      extractNumericEvidence(right).cost ?? "",
    ),
  );
  return `${sorted[0].title} has the lower recorded cost (${extractNumericEvidence(sorted[0]).cost}).`;
}

export function fasterClaim(
  scenarios: readonly ExecutiveScenarioObject[],
): string {
  const timed = scenarios.filter((entry) => entry.timeHorizon);
  if (!timed.length) {
    return "Time to effect is not evidenced as an exact duration. Nexora will not invent days or weeks.";
  }
  if (timed.length === 1) {
    return `${timed[0].title} has a stated horizon (${timed[0].timeHorizon}); others do not, so they are not ranked as faster.`;
  }
  return `Stated horizons: ${timed.map((entry) => `${entry.letter} ${entry.timeHorizon}`).join("; ")}.`;
}

export function riskClaim(
  scenarios: readonly ExecutiveScenarioObject[],
): string {
  const withRisk = scenarios.filter((entry) => entry.risks.length > 0);
  if (!withRisk.length) {
    return "No Scenario has a classified risk probability. Unknown is not high risk.";
  }
  return withRisk
    .map((entry) => `${entry.letter}: ${entry.risks.join(", ")}`)
    .join(" ");
}

export function compactComparison(comparison: ExecutiveScenarioComparisonView): string {
  return comparison.scenarioResults
    .map((entry) => {
      const tradeoff = comparison.tradeoffs.find(
        (item) => item.scenarioId === entry.scenarioId,
      );
      const plus = (tradeoff?.gains ?? []).map((item) => `+ ${item}`).join(" ");
      const minus = (tradeoff?.sacrifices ?? [])
        .map((item) => `- ${item}`)
        .join(" ");
      const unknown = comparison.unknowns
        .filter((item) => item.startsWith(`${entry.letter}:`))
        .slice(0, 1)
        .map((item) => `? ${item.slice(3)}`)
        .join(" ");
      const status = entry.constrained
        ? " [constrained]"
        : entry.dominated
          ? " [dominated]"
          : "";
      return `Scenario ${entry.letter} — ${entry.title}${status}\n${plus}\n${minus}\n${unknown}`.trim();
    })
    .join("\n");
}
