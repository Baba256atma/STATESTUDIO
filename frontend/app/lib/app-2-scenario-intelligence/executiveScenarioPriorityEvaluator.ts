/**
 * APP-2:4 — Executive Scenario Priority Evaluator.
 * Pure deterministic priority assessment from ScenarioContext — no side effects.
 */

import type { ScenarioContext } from "./scenarioContextResult.ts";
import type { ScenarioHealthState, ScenarioStatus } from "./scenarioIntelligenceTypes.ts";
import {
  createExecutiveScenarioPriorityDiagnostic,
  type ExecutiveScenarioPriorityDiagnostic,
} from "./executiveScenarioPriorityDiagnostics.ts";
import type {
  ExecutiveScenarioPriority,
  ExecutiveScenarioPriorityEvaluationInput,
  ExecutiveScenarioPriorityEvidence,
  ExecutiveScenarioPriorityFactor,
  ExecutiveScenarioPriorityLevel,
  ExecutiveScenarioPriorityReasonCode,
} from "./executiveScenarioPriorityResult.ts";
import {
  EXECUTIVE_SCENARIO_PRIORITY_LEVEL_RANK,
  createExecutiveScenarioPriority,
} from "./executiveScenarioPriorityResult.ts";

const STATE_WEIGHT: Readonly<Record<ScenarioHealthState, number>> = Object.freeze({
  unknown: 0,
  healthy: 1,
  attention: 2,
  warning: 3,
  critical: 4,
  blocked: 5,
});

const LIFECYCLE_WEIGHT: Readonly<Record<ScenarioStatus, number>> = Object.freeze({
  created: 0,
  draft: 0,
  analyzing: 1,
  waiting: 3,
  active: 2,
  monitoring: 2,
  completed: 0,
  archived: 0,
});

const CURRENT_TIME_CONTEXT_KEYS = Object.freeze(["now", "today"] as const);

function factor(
  factorId: string,
  dimension: ExecutiveScenarioPriorityFactor["dimension"],
  weight: number,
  label: string
): ExecutiveScenarioPriorityFactor {
  return Object.freeze({ factorId, dimension, weight, label, readOnly: true as const });
}

function evidence(
  evidenceId: string,
  dimension: ExecutiveScenarioPriorityEvidence["dimension"],
  summary: string,
  sourceRef: string | null
): ExecutiveScenarioPriorityEvidence {
  return Object.freeze({ evidenceId, dimension, summary, sourceRef, readOnly: true as const });
}

function resolvePriorityLevel(score: number): ExecutiveScenarioPriorityLevel {
  if (score <= 0) return "none";
  if (score <= 2) return "low";
  if (score <= 5) return "normal";
  if (score <= 8) return "high";
  return "critical";
}

function collectDiagnostics(
  context: ScenarioContext,
  evaluatedAt: string,
  factors: readonly ExecutiveScenarioPriorityFactor[],
  evidenceItems: readonly ExecutiveScenarioPriorityEvidence[]
): ExecutiveScenarioPriorityDiagnostic[] {
  const diagnostics: ExecutiveScenarioPriorityDiagnostic[] = [];

  if (!context.readOnly) {
    diagnostics.push(
      createExecutiveScenarioPriorityDiagnostic(
        "invalid_priority",
        "ScenarioContext is not read-only compliant.",
        evaluatedAt
      )
    );
  }

  if (!context.identity) {
    diagnostics.push(
      createExecutiveScenarioPriorityDiagnostic(
        "missing_context",
        "Scenario identity is unavailable for priority evaluation.",
        evaluatedAt
      )
    );
  }

  if (!context.state) {
    diagnostics.push(
      createExecutiveScenarioPriorityDiagnostic(
        "missing_state",
        "Scenario state is unavailable for priority evaluation.",
        evaluatedAt
      )
    );
  }

  if (!context.executiveTimeReference) {
    diagnostics.push(
      createExecutiveScenarioPriorityDiagnostic(
        "missing_executive_time",
        "Executive Time reference is unavailable.",
        evaluatedAt
      )
    );
  }

  if (!context.timelineReference) {
    diagnostics.push(
      createExecutiveScenarioPriorityDiagnostic(
        "missing_timeline",
        "Timeline reference is unavailable.",
        evaluatedAt
      )
    );
  }

  if (context.kpis.length === 0) {
    diagnostics.push(
      createExecutiveScenarioPriorityDiagnostic(
        "missing_kpi",
        "No KPI references available for priority evidence.",
        evaluatedAt
      )
    );
  }

  if (context.risks.length === 0) {
    diagnostics.push(
      createExecutiveScenarioPriorityDiagnostic(
        "missing_risk",
        "No risk references available for priority evidence.",
        evaluatedAt
      )
    );
  }

  if (factors.length === 0 || evidenceItems.length === 0) {
    diagnostics.push(
      createExecutiveScenarioPriorityDiagnostic(
        "missing_evidence",
        "Priority assessment lacks supporting evidence.",
        evaluatedAt
      )
    );
  }

  const contextErrors = context.diagnostics.filter((entry) => entry.severity === "error");
  if (contextErrors.length > 0) {
    diagnostics.push(
      createExecutiveScenarioPriorityDiagnostic(
        "incomplete_context",
        "ScenarioContext contains error diagnostics.",
        evaluatedAt,
        Object.freeze({ contextErrorCount: contextErrors.length })
      )
    );
  }

  return diagnostics;
}

export function evaluateExecutiveScenarioPriority(
  context: ScenarioContext,
  input: ExecutiveScenarioPriorityEvaluationInput
): ExecutiveScenarioPriority {
  const evaluatedAt = input.evaluatedAt;
  const factors: ExecutiveScenarioPriorityFactor[] = [];
  const evidenceItems: ExecutiveScenarioPriorityEvidence[] = [];
  const reasonCodes: ExecutiveScenarioPriorityReasonCode[] = [];
  let score = 0;

  if (context.state) {
    const stateWeight = STATE_WEIGHT[context.state.currentState];
    if (stateWeight > 0) {
      score += stateWeight;
      factors.push(
        factor("state", "state", stateWeight, `Scenario state is ${context.state.currentState}.`)
      );
      evidenceItems.push(
        evidence(
          "state-evidence",
          "state",
          `Current health state ${context.state.currentState} with lifecycle ${context.state.lifecycle}.`,
          context.state.scenarioId
        )
      );
      reasonCodes.push("state_contribution");
    }

    const lifecycleWeight = LIFECYCLE_WEIGHT[context.state.lifecycle];
    if (lifecycleWeight > 0) {
      score += lifecycleWeight;
      factors.push(
        factor(
          "lifecycle",
          "lifecycle",
          lifecycleWeight,
          `Lifecycle stage is ${context.state.lifecycle}.`
        )
      );
      evidenceItems.push(
        evidence(
          "lifecycle-evidence",
          "lifecycle",
          `Operational state ${context.state.operationalState}.`,
          context.state.scenarioId
        )
      );
      reasonCodes.push("lifecycle_contribution");
    }
  }

  if (context.executiveTimeReference) {
    const isCurrent = (CURRENT_TIME_CONTEXT_KEYS as readonly string[]).includes(
      context.executiveTimeReference.contextKey
    );
    const timeWeight = isCurrent ? 2 : 1;
    score += timeWeight;
    factors.push(
      factor(
        "executive-time",
        "executive_time",
        timeWeight,
        `Executive Time context ${context.executiveTimeReference.contextKey}.`
      )
    );
    evidenceItems.push(
      evidence(
        "executive-time-evidence",
        "executive_time",
        `Executive Time anchor at ${context.executiveTimeReference.timestamp}.`,
        context.executiveTimeReference.contextKey
      )
    );
    reasonCodes.push("executive_time_contribution");
  }

  if (context.timelineReference) {
    score += 1;
    factors.push(factor("timeline", "timeline", 1, "Timeline anchor is present."));
    evidenceItems.push(
      evidence(
        "timeline-evidence",
        "timeline",
        `Timeline ${context.timelineReference.timelineId} anchored at ${context.timelineReference.anchorTimestamp}.`,
        context.timelineReference.timelineId
      )
    );
    reasonCodes.push("timeline_contribution");
  }

  if (context.workspace) {
    score += 1;
    factors.push(factor("workspace", "workspace", 1, "Workspace context is present."));
    evidenceItems.push(
      evidence(
        "workspace-evidence",
        "workspace",
        `Workspace ${context.workspace.workspaceId} is isolated.`,
        context.workspace.workspaceId
      )
    );
    reasonCodes.push("workspace_contribution");
  }

  if (context.risks.length > 0) {
    const riskWeight = Math.min(context.risks.length, 2);
    score += riskWeight;
    factors.push(
      factor("risks", "risk", riskWeight, `${context.risks.length} risk reference(s) present.`)
    );
    evidenceItems.push(
      evidence(
        "risk-evidence",
        "risk",
        `Risk references include ${context.risks.map((entry) => entry.riskId).join(", ")}.`,
        context.risks[0]?.riskId ?? null
      )
    );
    reasonCodes.push("risk_contribution");
  }

  if (context.kpis.length > 0) {
    const kpiWeight = Math.min(context.kpis.length, 2);
    score += kpiWeight;
    factors.push(
      factor("kpis", "kpi", kpiWeight, `${context.kpis.length} KPI reference(s) present.`)
    );
    evidenceItems.push(
      evidence(
        "kpi-evidence",
        "kpi",
        `KPI references include ${context.kpis.map((entry) => entry.kpiId).join(", ")}.`,
        context.kpis[0]?.kpiId ?? null
      )
    );
    reasonCodes.push("kpi_contribution");
  }

  if (context.relationships.length > 0) {
    score += 1;
    factors.push(
      factor(
        "relationships",
        "relationship",
        1,
        `${context.relationships.length} relationship reference(s) present.`
      )
    );
    evidenceItems.push(
      evidence(
        "relationship-evidence",
        "relationship",
        `Relationship graph includes ${context.relationships.length} edge(s).`,
        context.relationships[0]?.relationshipId ?? null
      )
    );
    reasonCodes.push("relationship_contribution");
  }

  if (context.decisionReferences.length > 0) {
    score += 1;
    factors.push(
      factor(
        "decisions",
        "decision",
        1,
        `${context.decisionReferences.length} decision journal reference(s) present.`
      )
    );
    evidenceItems.push(
      evidence(
        "decision-evidence",
        "decision",
        "Decision journal references contribute executive accountability context.",
        context.decisionReferences[0]?.journalEntryId ?? null
      )
    );
    reasonCodes.push("decision_contribution");
  }

  const activeSimulations = context.simulationReferences.filter((entry) =>
    ["active", "running", "in_progress"].includes(entry.status.toLowerCase())
  );
  if (activeSimulations.length > 0) {
    score += 1;
    factors.push(
      factor(
        "simulations",
        "simulation",
        1,
        `${activeSimulations.length} active simulation reference(s) present.`
      )
    );
    evidenceItems.push(
      evidence(
        "simulation-evidence",
        "simulation",
        `Active simulations: ${activeSimulations.map((entry) => entry.simulationId).join(", ")}.`,
        activeSimulations[0]?.simulationId ?? null
      )
    );
    reasonCodes.push("simulation_contribution");
  }

  const diagnostics = collectDiagnostics(
    context,
    evaluatedAt,
    Object.freeze(factors),
    Object.freeze(evidenceItems)
  );

  let priorityLevel = resolvePriorityLevel(score);

  if (diagnostics.some((entry) => entry.code === "missing_context" || entry.code === "missing_state")) {
    priorityLevel = "none";
    reasonCodes.push("invalid_priority");
  } else if (diagnostics.some((entry) => entry.code === "incomplete_context")) {
    priorityLevel = "low";
    reasonCodes.push("incomplete_context");
  }

  if (context.state?.isArchived && priorityLevel !== "none") {
    priorityLevel = "low";
  }

  if (context.state?.currentState === "blocked" && EXECUTIVE_SCENARIO_PRIORITY_LEVEL_RANK[priorityLevel] < 3) {
    priorityLevel = "high";
    if (!reasonCodes.includes("state_contribution")) reasonCodes.push("state_contribution");
  }

  if (context.state?.currentState === "critical" && EXECUTIVE_SCENARIO_PRIORITY_LEVEL_RANK[priorityLevel] < 4) {
    priorityLevel = "critical";
    if (!reasonCodes.includes("state_contribution")) reasonCodes.push("state_contribution");
  }

  return createExecutiveScenarioPriority({
    scenarioId: context.scenarioId,
    workspaceId: context.workspaceId,
    priorityLevel,
    priorityReasonCodes: Object.freeze([...new Set(reasonCodes)]),
    priorityFactors: Object.freeze(factors),
    supportingEvidence: Object.freeze(evidenceItems),
    diagnostics: Object.freeze(diagnostics),
    generatedAt: evaluatedAt,
  });
}
