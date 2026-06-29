/**
 * APP-2:8 — Executive Scenario Summary Builder.
 * Template-based executive narrative from ExecutiveScenarioSnapshot only.
 */

import type { ExecutiveScenarioSnapshot } from "./executiveScenarioSnapshot.ts";
import {
  createExecutiveScenarioSummary,
  createExecutiveScenarioSummaryEvidence,
  type ExecutiveScenarioSummary,
  type ExecutiveScenarioSummaryEvidence,
  type ExecutiveScenarioSummaryStatus,
} from "./executiveScenarioSummaryResult.ts";
import {
  createExecutiveScenarioSummaryDiagnostic,
  type ExecutiveScenarioSummaryDiagnostic,
} from "./executiveScenarioSummaryDiagnostics.ts";

function evidenceId(prefix: string, index: number): string {
  return `${prefix}-evidence-${index}`;
}

function capitalize(value: string): string {
  if (value.length === 0) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildHeadline(snapshot: ExecutiveScenarioSnapshot): string {
  const state = snapshot.state?.currentState ?? "unknown";
  const priority = snapshot.priority.priorityLevel;
  const conflictCount = snapshot.conflictGraph.conflictNodes.length;
  const opportunityCount = snapshot.opportunityGraph.opportunityNodes.length;
  return `Scenario ${snapshot.scenarioId}: ${capitalize(state)} health, ${priority} priority, ${conflictCount} conflicts, ${opportunityCount} opportunities.`;
}

function buildSituationBrief(snapshot: ExecutiveScenarioSnapshot): string {
  const lifecycle = snapshot.state?.lifecycle ?? snapshot.context.identity?.status ?? "unknown";
  const operational = snapshot.state?.operationalState ?? "unknown";
  const deps = snapshot.dependencyGraph.dependencyNodes.length;
  const critical = snapshot.dependencyGraph.criticalDependencies.length;
  return `Executive situation for workspace ${snapshot.workspaceId}. Lifecycle stage is ${lifecycle} with ${operational} operational posture. ${deps} dependencies tracked, ${critical} critical.`;
}

function buildStateSummary(snapshot: ExecutiveScenarioSnapshot): string {
  const state = snapshot.state;
  if (state === null) {
    return "Scenario state is unavailable.";
  }
  return `Health state is ${state.currentState}. Operational state is ${state.operationalState}. Confidence ${Math.round(state.confidence * 100)}%, completeness ${Math.round(state.completeness * 100)}%.`;
}

function buildPrioritySummary(snapshot: ExecutiveScenarioSnapshot): string {
  const priority = snapshot.priority;
  const factors = priority.priorityFactors.length;
  return `Executive priority level is ${priority.priorityLevel}. ${factors} contributing factors identified with ${priority.supportingEvidence.length} evidence records.`;
}

function buildDependencySummary(snapshot: ExecutiveScenarioSnapshot): string {
  const graph = snapshot.dependencyGraph;
  return `${graph.dependencyNodes.length} dependency nodes, ${graph.criticalDependencies.length} critical, ${graph.incomingDependencies.length} incoming, ${graph.outgoingDependencies.length} outgoing.`;
}

function buildConflictSummary(snapshot: ExecutiveScenarioSnapshot): string {
  const graph = snapshot.conflictGraph;
  return `${graph.conflictNodes.length} conflicts detected. ${graph.criticalConflicts.length} critical, ${graph.blockedConflicts.length} blocked, ${graph.resolvedConflicts.length} resolved.`;
}

function buildOpportunitySummary(snapshot: ExecutiveScenarioSnapshot): string {
  const graph = snapshot.opportunityGraph;
  return `${graph.opportunityNodes.length} opportunities identified. ${graph.strategicOpportunities.length} strategic, ${graph.quickWinOpportunities.length} quick-win, ${graph.highValueOpportunities.length} high-value, ${graph.blockedOpportunities.length} blocked.`;
}

function buildRiskSummary(snapshot: ExecutiveScenarioSnapshot): string {
  const risks = snapshot.context.risks;
  const conflictRisks = snapshot.conflictGraph.conflictNodes.filter(
    (node) => node.category === "risk"
  ).length;
  if (risks.length === 0) {
    return `No direct risk references. ${conflictRisks} risk-related conflicts in conflict graph.`;
  }
  const labels = risks.map((risk) => risk.label).join(", ");
  return `${risks.length} risk reference(s): ${labels}. ${conflictRisks} risk-related conflicts detected.`;
}

function buildKpiSummary(snapshot: ExecutiveScenarioSnapshot): string {
  const kpis = snapshot.context.kpis;
  if (kpis.length === 0) {
    return "No KPI references attached to scenario context.";
  }
  const labels = kpis.map((kpi) => kpi.label).join(", ");
  return `${kpis.length} KPI reference(s): ${labels}.`;
}

function buildTimelineSummary(snapshot: ExecutiveScenarioSnapshot): string {
  const timeline = snapshot.context.timelineReference;
  const executiveTime = snapshot.context.executiveTimeReference;
  const parts: string[] = [];
  if (timeline !== null) {
    parts.push(`Timeline ${timeline.timelineId} anchored at ${timeline.anchorTimestamp}`);
  }
  if (executiveTime !== null) {
    parts.push(`Executive time context ${executiveTime.contextKey} at ${executiveTime.timestamp}`);
  }
  if (parts.length === 0) {
    return "No timeline or executive time references available.";
  }
  return parts.join(". ") + ".";
}

function buildHighlights(snapshot: ExecutiveScenarioSnapshot): readonly string[] {
  const highlights: string[] = [];
  if (snapshot.state?.currentState === "healthy") {
    highlights.push("Scenario health is healthy.");
  }
  if (snapshot.opportunityGraph.quickWinOpportunities.length > 0) {
    highlights.push(
      `${snapshot.opportunityGraph.quickWinOpportunities.length} quick-win opportunities available.`
    );
  }
  if (snapshot.opportunityGraph.strategicOpportunities.length > 0) {
    highlights.push(
      `${snapshot.opportunityGraph.strategicOpportunities.length} strategic opportunities identified.`
    );
  }
  if (snapshot.conflictGraph.resolvedConflicts.length > 0) {
    highlights.push(
      `${snapshot.conflictGraph.resolvedConflicts.length} conflicts already resolved.`
    );
  }
  return Object.freeze(highlights);
}

function buildConcerns(snapshot: ExecutiveScenarioSnapshot): readonly string[] {
  const concerns: string[] = [];
  const state = snapshot.state?.currentState;
  if (state === "critical" || state === "blocked" || state === "warning") {
    concerns.push(`Scenario health requires attention: ${state}.`);
  }
  if (snapshot.conflictGraph.criticalConflicts.length > 0) {
    concerns.push(
      `${snapshot.conflictGraph.criticalConflicts.length} critical conflicts require monitoring.`
    );
  }
  if (snapshot.conflictGraph.blockedConflicts.length > 0) {
    concerns.push(`${snapshot.conflictGraph.blockedConflicts.length} blocked conflicts present.`);
  }
  if (snapshot.opportunityGraph.blockedOpportunities.length > 0) {
    concerns.push(
      `${snapshot.opportunityGraph.blockedOpportunities.length} opportunities are blocked by conflicts.`
    );
  }
  return Object.freeze(concerns);
}

function buildStrengths(snapshot: ExecutiveScenarioSnapshot): readonly string[] {
  const strengths: string[] = [];
  if (snapshot.dependencyGraph.criticalDependencies.length > 0) {
    strengths.push(
      `${snapshot.dependencyGraph.criticalDependencies.length} critical dependencies mapped and visible.`
    );
  }
  if (snapshot.opportunityGraph.highValueOpportunities.length > 0) {
    strengths.push(
      `${snapshot.opportunityGraph.highValueOpportunities.length} high-value opportunities catalogued.`
    );
  }
  if (snapshot.context.kpis.length > 0) {
    strengths.push(`${snapshot.context.kpis.length} KPI references linked for measurement.`);
  }
  if (snapshot.priority.priorityLevel === "high" || snapshot.priority.priorityLevel === "critical") {
    strengths.push(`Executive priority elevated to ${snapshot.priority.priorityLevel}.`);
  }
  return Object.freeze(strengths);
}

function buildWeaknesses(snapshot: ExecutiveScenarioSnapshot): readonly string[] {
  const weaknesses: string[] = [];
  if (snapshot.state?.completeness !== undefined && snapshot.state.completeness < 0.75) {
    weaknesses.push(
      `Scenario completeness at ${Math.round(snapshot.state.completeness * 100)}%.`
    );
  }
  if (snapshot.dependencyGraph.isolatedDependencies.length > 0) {
    weaknesses.push(
      `${snapshot.dependencyGraph.isolatedDependencies.length} isolated dependencies detected.`
    );
  }
  if (snapshot.context.risks.length > 0) {
    weaknesses.push(`${snapshot.context.risks.length} risk reference(s) attached.`);
  }
  if (snapshot.diagnostics.length > 0) {
    weaknesses.push(`${snapshot.diagnostics.length} snapshot aggregation diagnostic(s) recorded.`);
  }
  return Object.freeze(weaknesses);
}

function collectEvidence(snapshot: ExecutiveScenarioSnapshot): readonly ExecutiveScenarioSummaryEvidence[] {
  const evidence: ExecutiveScenarioSummaryEvidence[] = [];
  let index = 0;

  if (snapshot.state !== null) {
    evidence.push(
      createExecutiveScenarioSummaryEvidence({
        evidenceId: evidenceId("state", index++),
        section: "stateSummary",
        source: "state",
        sourceRef: snapshot.state.scenarioId,
        summary: buildStateSummary(snapshot),
      })
    );
  }

  evidence.push(
    createExecutiveScenarioSummaryEvidence({
      evidenceId: evidenceId("priority", index++),
      section: "prioritySummary",
      source: "priority",
      sourceRef: snapshot.priority.scenarioId,
      summary: buildPrioritySummary(snapshot),
    })
  );

  evidence.push(
    createExecutiveScenarioSummaryEvidence({
      evidenceId: evidenceId("dependency", index++),
      section: "dependencySummary",
      source: "dependency_graph",
      sourceRef: snapshot.dependencyGraph.scenarioId,
      summary: buildDependencySummary(snapshot),
    })
  );

  evidence.push(
    createExecutiveScenarioSummaryEvidence({
      evidenceId: evidenceId("conflict", index++),
      section: "conflictSummary",
      source: "conflict_graph",
      sourceRef: snapshot.conflictGraph.scenarioId,
      summary: buildConflictSummary(snapshot),
    })
  );

  evidence.push(
    createExecutiveScenarioSummaryEvidence({
      evidenceId: evidenceId("opportunity", index++),
      section: "opportunitySummary",
      source: "opportunity_graph",
      sourceRef: snapshot.opportunityGraph.scenarioId,
      summary: buildOpportunitySummary(snapshot),
    })
  );

  for (const kpi of snapshot.context.kpis) {
    evidence.push(
      createExecutiveScenarioSummaryEvidence({
        evidenceId: evidenceId("kpi", index++),
        section: "kpiSummary",
        source: "kpi",
        sourceRef: kpi.kpiId,
        summary: `KPI reference: ${kpi.label}.`,
      })
    );
  }

  for (const risk of snapshot.context.risks) {
    evidence.push(
      createExecutiveScenarioSummaryEvidence({
        evidenceId: evidenceId("risk", index++),
        section: "riskSummary",
        source: "risk",
        sourceRef: risk.riskId,
        summary: `Risk reference: ${risk.label}.`,
      })
    );
  }

  if (snapshot.context.timelineReference !== null) {
    evidence.push(
      createExecutiveScenarioSummaryEvidence({
        evidenceId: evidenceId("timeline", index++),
        section: "timelineSummary",
        source: "timeline",
        sourceRef: snapshot.context.timelineReference.timelineId,
        summary: buildTimelineSummary(snapshot),
      })
    );
  }

  if (snapshot.context.executiveTimeReference !== null) {
    evidence.push(
      createExecutiveScenarioSummaryEvidence({
        evidenceId: evidenceId("executive-time", index++),
        section: "timelineSummary",
        source: "executive_time",
        sourceRef: snapshot.context.executiveTimeReference.contextKey,
        summary: `Executive time at ${snapshot.context.executiveTimeReference.timestamp}.`,
      })
    );
  }

  return Object.freeze(evidence);
}

function resolveSummaryStatus(
  snapshot: ExecutiveScenarioSnapshot,
  diagnostics: readonly ExecutiveScenarioSummaryDiagnostic[]
): ExecutiveScenarioSummaryStatus {
  if (diagnostics.some((entry) => entry.severity === "error")) {
    return "incomplete";
  }
  if (snapshot.diagnostics.length > 0 || diagnostics.some((entry) => entry.severity === "warning")) {
    return "partial";
  }
  return "complete";
}

function validateSnapshotForSummary(
  snapshot: ExecutiveScenarioSnapshot,
  generatedAt: string,
  workspaceId?: string
): readonly ExecutiveScenarioSummaryDiagnostic[] {
  const diagnostics: ExecutiveScenarioSummaryDiagnostic[] = [];

  if (!snapshot.readOnly) {
    diagnostics.push(
      createExecutiveScenarioSummaryDiagnostic(
        "missing_snapshot",
        "ExecutiveScenarioSnapshot must be read-only.",
        generatedAt
      )
    );
  }
  if (snapshot.context === null || snapshot.context.identity === null) {
    diagnostics.push(
      createExecutiveScenarioSummaryDiagnostic(
        "missing_context",
        "Snapshot context is missing.",
        generatedAt
      )
    );
  }
  if (snapshot.state === null) {
    diagnostics.push(
      createExecutiveScenarioSummaryDiagnostic(
        "missing_state",
        "Snapshot state is missing.",
        generatedAt
      )
    );
  }
  if (snapshot.priority.priorityLevel === "none") {
    diagnostics.push(
      createExecutiveScenarioSummaryDiagnostic(
        "missing_priority",
        "Snapshot priority is unset.",
        generatedAt
      )
    );
  }
  if (snapshot.dependencyGraph.dependencyNodes.length === 0) {
    diagnostics.push(
      createExecutiveScenarioSummaryDiagnostic(
        "missing_dependency_graph",
        "Snapshot dependency graph is empty.",
        generatedAt
      )
    );
  }
  if (snapshot.conflictGraph.conflictNodes.length === 0) {
    diagnostics.push(
      createExecutiveScenarioSummaryDiagnostic(
        "missing_conflict_graph",
        "Snapshot conflict graph is empty.",
        generatedAt
      )
    );
  }
  if (snapshot.opportunityGraph.opportunityNodes.length === 0) {
    diagnostics.push(
      createExecutiveScenarioSummaryDiagnostic(
        "missing_opportunity_graph",
        "Snapshot opportunity graph is empty.",
        generatedAt
      )
    );
  }
  if (workspaceId !== undefined && snapshot.workspaceId !== workspaceId.trim()) {
    diagnostics.push(
      createExecutiveScenarioSummaryDiagnostic(
        "invalid_summary",
        "Workspace isolation violation.",
        generatedAt,
        Object.freeze({ workspaceId })
      )
    );
  }

  return Object.freeze(diagnostics);
}

export function buildExecutiveScenarioSummary(
  snapshot: ExecutiveScenarioSnapshot,
  options: Readonly<{ generatedAt: string; workspaceId?: string }>
): ExecutiveScenarioSummary {
  const validationDiagnostics = validateSnapshotForSummary(
    snapshot,
    options.generatedAt,
    options.workspaceId
  );

  const hasBlockingError = validationDiagnostics.some((entry) => entry.severity === "error");

  if (hasBlockingError) {
    return createExecutiveScenarioSummary({
      scenarioId: snapshot.scenarioId,
      workspaceId: snapshot.workspaceId,
      summaryStatus: "incomplete",
      executiveHeadline: "Executive summary unavailable.",
      situationBrief: "Certified snapshot inputs are incomplete.",
      stateSummary: "",
      prioritySummary: "",
      dependencySummary: "",
      conflictSummary: "",
      opportunitySummary: "",
      riskSummary: "",
      kpiSummary: "",
      timelineSummary: "",
      executiveHighlights: Object.freeze([]),
      executiveConcerns: Object.freeze([]),
      executiveStrengths: Object.freeze([]),
      executiveWeaknesses: Object.freeze([]),
      supportingEvidence: Object.freeze([]),
      diagnostics: validationDiagnostics,
      generatedAt: options.generatedAt,
    });
  }

  const supportingEvidence = collectEvidence(snapshot);
  const diagnostics = [...validationDiagnostics];

  if (supportingEvidence.length === 0) {
    diagnostics.push(
      createExecutiveScenarioSummaryDiagnostic(
        "missing_evidence",
        "No supporting evidence generated from snapshot.",
        options.generatedAt
      )
    );
  }

  const summaryStatus = resolveSummaryStatus(snapshot, Object.freeze(diagnostics));

  if (summaryStatus === "partial") {
    diagnostics.push(
      createExecutiveScenarioSummaryDiagnostic(
        "incomplete_summary",
        "Summary built with partial snapshot data.",
        options.generatedAt
      )
    );
  }

  return createExecutiveScenarioSummary({
    scenarioId: snapshot.scenarioId,
    workspaceId: snapshot.workspaceId,
    summaryStatus,
    executiveHeadline: buildHeadline(snapshot),
    situationBrief: buildSituationBrief(snapshot),
    stateSummary: buildStateSummary(snapshot),
    prioritySummary: buildPrioritySummary(snapshot),
    dependencySummary: buildDependencySummary(snapshot),
    conflictSummary: buildConflictSummary(snapshot),
    opportunitySummary: buildOpportunitySummary(snapshot),
    riskSummary: buildRiskSummary(snapshot),
    kpiSummary: buildKpiSummary(snapshot),
    timelineSummary: buildTimelineSummary(snapshot),
    executiveHighlights: buildHighlights(snapshot),
    executiveConcerns: buildConcerns(snapshot),
    executiveStrengths: buildStrengths(snapshot),
    executiveWeaknesses: buildWeaknesses(snapshot),
    supportingEvidence,
    diagnostics: Object.freeze(diagnostics),
    generatedAt: options.generatedAt,
  });
}
