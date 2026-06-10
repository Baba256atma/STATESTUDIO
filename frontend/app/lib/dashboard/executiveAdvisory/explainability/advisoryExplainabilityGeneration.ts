/**
 * Phase 5:4 — Advisory explainability domain generators.
 */

import type { StandardizedAdvisoryInput } from "../aggregation/advisoryContextContract.ts";
import type {
  AdvisoryExplanationBundle,
  AssumptionEntry,
  AssumptionsUnknownsLayer,
  ConfidenceDriverEntry,
  ConfidenceDriverLayer,
  ConfidenceLimiterEntry,
  ConfidenceLimiterLayer,
  ExplainabilityInputContract,
  GuidanceExplanation,
  ReasoningPathRender,
  ReasoningPathStep,
  SupportingEvidenceEntry,
  SupportingEvidenceLayer,
} from "./advisoryExplainabilityContract.ts";

function toEvidenceEntry(input: StandardizedAdvisoryInput): SupportingEvidenceEntry {
  return Object.freeze({
    source: input.source,
    label: input.label,
    summary: input.explanation,
  });
}

export function generateGuidanceExplanation(input: ExplainabilityInputContract): GuidanceExplanation {
  const { advisoryContext, dashboardContext } = input;
  const top = advisoryContext.topPriority;
  const focusLabel = advisoryContext.warRoom.decisionFocus.label;

  const primaryFactors = Object.freeze([
    top ? `${top.label} (${top.priority} priority)` : "No dominant priority signal",
    `Risk attention: ${advisoryContext.risk.executiveAttention.label}`,
    `Operational health: ${advisoryContext.operational.health.label}`,
  ]);

  const whyThisGuidance =
    dashboardContext === "war_room"
      ? `War room decision context and converged intelligence indicate ${focusLabel} deserves executive review`
      : top
        ? `${top.label} emerged as the leading advisory factor across intelligence surfaces`
        : "Advisory context converged without a single dominant priority — maintain structured review";

  return Object.freeze({
    headline: "Why am I seeing this guidance?",
    executiveSummary: whyThisGuidance,
    primaryFactors,
    whyThisGuidance,
  });
}

export function generateSupportingEvidence(input: ExplainabilityInputContract): SupportingEvidenceLayer {
  const { advisoryContext } = input;
  const { operational, risk, timeline, scenario, warRoom } = advisoryContext;

  const operationalEvidence = Object.freeze([
    toEvidenceEntry(operational.health),
    toEvidenceEntry(operational.pressure),
    toEvidenceEntry(operational.signals),
    toEvidenceEntry(operational.demandImpact),
  ]);

  const riskEvidence = Object.freeze([
    toEvidenceEntry(risk.exposure),
    toEvidenceEntry(risk.momentum),
    toEvidenceEntry(risk.confidence),
    toEvidenceEntry(risk.executiveAttention),
  ]);

  const timelineEvidence = Object.freeze([
    toEvidenceEntry(timeline.momentum),
    toEvidenceEntry(timeline.milestonePressure),
    toEvidenceEntry(timeline.scheduleDrift),
    toEvidenceEntry(timeline.decisionWindows),
  ]);

  const scenarioEvidence = Object.freeze([
    toEvidenceEntry(scenario.expectedImpact),
    toEvidenceEntry(scenario.confidence),
    toEvidenceEntry(scenario.tradeoffs),
    toEvidenceEntry(scenario.investigationPaths),
  ]);

  const warRoomEvidence = Object.freeze([
    toEvidenceEntry(warRoom.situationOverview),
    toEvidenceEntry(warRoom.criticalRisks),
    toEvidenceEntry(warRoom.decisionFocus),
    toEvidenceEntry(warRoom.scenarioComparison),
  ]);

  const total =
    operationalEvidence.length +
    riskEvidence.length +
    timelineEvidence.length +
    scenarioEvidence.length +
    warRoomEvidence.length;

  return Object.freeze({
    operational: operationalEvidence,
    risk: riskEvidence,
    timeline: timelineEvidence,
    scenario: scenarioEvidence,
    warRoom: warRoomEvidence,
    summary: `${total} traceable evidence contributors across five intelligence domains`,
  });
}

export function generateConfidenceDrivers(input: ExplainabilityInputContract): ConfidenceDriverLayer {
  const { confidenceEvaluation } = input;
  const drivers: ConfidenceDriverEntry[] = confidenceEvaluation.explanation.confidenceDrivers.map(
    (label) =>
      Object.freeze({
        label,
        justification: "Supporting evidence strengthens advisory confidence",
      })
  );

  if (confidenceEvaluation.coverage.level === "strong") {
    drivers.push(
      Object.freeze({
        label: confidenceEvaluation.coverage.label,
        justification: confidenceEvaluation.coverage.summary,
      })
    );
  }
  if (confidenceEvaluation.consistency.level === "consistent") {
    drivers.push(
      Object.freeze({
        label: confidenceEvaluation.consistency.label,
        justification: confidenceEvaluation.consistency.summary,
      })
    );
  }
  if (confidenceEvaluation.diversity.level === "multiple_sources") {
    drivers.push(
      Object.freeze({
        label: confidenceEvaluation.diversity.label,
        justification: confidenceEvaluation.diversity.summary,
      })
    );
  }

  return Object.freeze({
    drivers: Object.freeze(drivers),
    summary:
      drivers.length > 0
        ? `${drivers.length} factors increase confidence in this advisory`
        : "Limited confidence boosters identified",
  });
}

export function generateConfidenceLimiters(input: ExplainabilityInputContract): ConfidenceLimiterLayer {
  const { confidenceEvaluation } = input;
  const limiters: ConfidenceLimiterEntry[] = confidenceEvaluation.explanation.confidenceLimiters.map(
    (label) =>
      Object.freeze({
        label,
        impact: "Reduces confidence in advisory guidance",
      })
  );

  for (const missing of confidenceEvaluation.explanation.missingEvidence) {
    limiters.push(
      Object.freeze({
        label: missing,
        impact: "Missing evidence limits advisory certainty",
      })
    );
  }

  if (confidenceEvaluation.consistency.level === "conflicting") {
    limiters.push(
      Object.freeze({
        label: confidenceEvaluation.consistency.label,
        impact: confidenceEvaluation.consistency.summary,
      })
    );
  }

  return Object.freeze({
    limiters: Object.freeze(limiters),
    summary:
      limiters.length > 0
        ? `${limiters.length} factors reduce confidence — review before acting`
        : "No major confidence limiters detected",
  });
}

function resolveAdvisoryOutcome(dashboardContext: string, topLabel: string | null): string {
  if (dashboardContext === "war_room") return "Advisory Decision Review";
  if (topLabel?.toLowerCase().includes("risk")) return "Advisory Investigate";
  if (topLabel?.toLowerCase().includes("timeline") || topLabel?.toLowerCase().includes("window")) {
    return "Advisory Review Recommended";
  }
  return "Advisory Focus";
}

export function renderReasoningPath(input: ExplainabilityInputContract): ReasoningPathRender {
  const { advisoryContext, dashboardContext } = input;
  const trace = advisoryContext.metadata.reasoningTrace;
  const topInputs = advisoryContext.rankedInputs.slice(0, 3);

  const steps: ReasoningPathStep[] = topInputs.map((entry) =>
    Object.freeze({
      label: entry.label,
      detail: entry.explanation,
    })
  );

  if (steps.length === 0) {
    for (const factor of trace.inputFactors.slice(0, 3)) {
      const [label] = factor.split(":");
      steps.push(
        Object.freeze({
          label: label?.trim() ?? factor,
          detail: factor,
        })
      );
    }
  }

  const outcome = resolveAdvisoryOutcome(
    dashboardContext,
    advisoryContext.topPriority?.label ?? null
  );
  steps.push(Object.freeze({ label: outcome, detail: "Executive advisory focus derived from converged intelligence" }));

  const pathLabel = steps.map((step) => step.label).join(" ↓ ");

  return Object.freeze({
    steps: Object.freeze(steps),
    pathLabel,
    summary: `Reasoning chain: ${pathLabel}`,
  });
}

export function generateAssumptionsAndUnknowns(input: ExplainabilityInputContract): AssumptionsUnknownsLayer {
  const { advisoryContext, confidenceEvaluation, dashboardContext } = input;
  const entries: AssumptionEntry[] = [];

  for (const missing of confidenceEvaluation.explanation.missingEvidence) {
    entries.push(
      Object.freeze({
        kind: "missing_context",
        label: "Missing Evidence",
        detail: missing,
      })
    );
  }

  if (confidenceEvaluation.freshness.level === "stale") {
    entries.push(
      Object.freeze({
        kind: "assumption",
        label: "Assumption Detected",
        detail: "Intelligence freshness assumed adequate — refresh recommended",
      })
    );
  }

  if (confidenceEvaluation.consistency.level === "conflicting") {
    entries.push(
      Object.freeze({
        kind: "unknown",
        label: "Unknown Condition",
        detail: "Competing intelligence signals — executive judgment required",
      })
    );
  }

  const lowConfidenceInputs = advisoryContext.rankedInputs.filter((entry) => entry.confidence === "low");
  for (const entry of lowConfidenceInputs.slice(0, 2)) {
    entries.push(
      Object.freeze({
        kind: "unresolved_dependency",
        label: entry.label,
        detail: `Low confidence input: ${entry.explanation}`,
      })
    );
  }

  if (dashboardContext !== "war_room" && advisoryContext.warRoom.decisionFocus.priority === "critical") {
    entries.push(
      Object.freeze({
        kind: "assumption",
        label: "War Room Context",
        detail: "War room escalation signals present outside active war room context",
      })
    );
  }

  return Object.freeze({
    entries: Object.freeze(entries),
    summary:
      entries.length > 0
        ? `${entries.length} assumptions or unknowns acknowledged`
        : "No critical assumptions or unknowns flagged",
  });
}

export function generateAdvisoryExplanation(input: ExplainabilityInputContract): AdvisoryExplanationBundle {
  const guidance = generateGuidanceExplanation(input);
  const supportingEvidence = generateSupportingEvidence(input);
  const confidenceDrivers = generateConfidenceDrivers(input);
  const confidenceLimiters = generateConfidenceLimiters(input);
  const reasoningPath = renderReasoningPath(input);
  const assumptionsAndUnknowns = generateAssumptionsAndUnknowns(input);

  return Object.freeze({
    guidance,
    supportingEvidence,
    confidenceDrivers,
    confidenceLimiters,
    reasoningPath,
    assumptionsAndUnknowns,
  });
}
