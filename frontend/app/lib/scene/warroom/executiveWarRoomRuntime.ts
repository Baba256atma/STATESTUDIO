/**
 * E2:97 — Executive War Room runtime: situation awareness, alerts, recommendations, KPIs.
 */

import type { TimelineEvent } from "../executiveTimelineHudTypes";
import type { TypeCAlert } from "../../typec/typeCAlerts";
import {
  logE297AlertRaised,
  logE297ContextChanged,
  logE297RecommendationGenerated,
  logE297SimulationStarted,
  logE297WarRoomInitialized,
} from "./executiveWarRoomDiagnostics.ts";
import type {
  BuildExecutiveWarRoomInput,
  ExecutiveWarRoomAlertCategory,
  ExecutiveWarRoomAlertRecord,
  ExecutiveWarRoomAlertSeverity,
  ExecutiveWarRoomCommandAction,
  ExecutiveWarRoomCopilotContext,
  ExecutiveWarRoomDecisionRecord,
  ExecutiveWarRoomEventKind,
  ExecutiveWarRoomEventRecord,
  ExecutiveWarRoomFocusMode,
  ExecutiveWarRoomHotspot,
  ExecutiveWarRoomHudModel,
  ExecutiveWarRoomKpiLayer,
  ExecutiveWarRoomMissionState,
  ExecutiveWarRoomOperationalContext,
  ExecutiveWarRoomRecommendationRecord,
  ExecutiveWarRoomSimulationRecord,
  ExecutiveWarRoomSituationBrief,
  ExecutiveWarRoomState,
  ExecutiveWarRoomStatusLevel,
  ExecutiveWarRoomStrategicSummary,
} from "./executiveWarRoomTypes";

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, Number(value.toFixed(3))));
}

function alertSeverity(level: TypeCAlert["level"]): ExecutiveWarRoomAlertSeverity {
  if (level === "critical") return "critical";
  if (level === "warning") return "high";
  return "medium";
}

function timelineSeverity(event: TimelineEvent): ExecutiveWarRoomAlertSeverity {
  const severity = String(event.severity ?? "watch").toLowerCase();
  if (severity === "critical") return "critical";
  if (severity === "warning") return "high";
  if (severity === "watch") return "medium";
  return "low";
}

function inferEventKind(event: TimelineEvent): ExecutiveWarRoomEventKind {
  const marker = String(event.markerType ?? "").toLowerCase();
  if (marker.includes("decision")) return "decision";
  if (marker.includes("risk")) return "risk";
  if (marker.includes("opportunity") || marker.includes("growth")) return "opportunity";
  if (marker.includes("milestone")) return "milestone";
  return "incident";
}

function resolveAutoFocusMode(input: BuildExecutiveWarRoomInput): ExecutiveWarRoomFocusMode {
  if (input.scenarioUniverse?.comparisonActive || input.scenarioComparison?.rows.length) return "scenario";
  if (input.executionState?.status === "running" || input.executionState?.status === "paused") {
    if (input.executionState.riskLevel === "high") return "recovery";
    return "operations";
  }
  const criticalAlerts = (input.alerts ?? []).filter((alert) => alert.level === "critical" && !alert.acknowledged);
  if (criticalAlerts.length > 0 || input.activeSimulation?.riskLevel === "high") return "risk";
  if ((input.timelineEvents ?? []).some((event) => inferEventKind(event) === "opportunity")) return "growth";
  if (input.decisionRecommendation?.recommendedScenarioId) return "strategic";
  return "operations";
}

function resolveStatusLevel(input: {
  alerts: readonly ExecutiveWarRoomAlertRecord[];
  executionRisk: "low" | "medium" | "high" | null;
  simulationRisk: "low" | "medium" | "high" | null;
}): ExecutiveWarRoomStatusLevel {
  const unackedCritical = input.alerts.filter(
    (alert) => alert.severity === "critical" && !alert.acknowledged
  ).length;
  if (unackedCritical > 0 || input.executionRisk === "high") return "critical";
  const elevated =
    input.alerts.filter((alert) => alert.severity === "high" && !alert.acknowledged).length > 0 ||
    input.simulationRisk === "high" ||
    input.executionRisk === "medium";
  if (elevated) return "elevated";
  const warning =
    input.alerts.length > 0 ||
    input.simulationRisk === "medium" ||
    input.executionRisk === "low";
  if (warning) return "warning";
  return "stable";
}

function buildAlerts(input: BuildExecutiveWarRoomInput): ExecutiveWarRoomAlertRecord[] {
  const alerts: ExecutiveWarRoomAlertRecord[] = (input.alerts ?? []).map((alert) => ({
    id: alert.id,
    category: alert.level === "critical" ? ("risk" as const) : ("operations" as const),
    severity: alertSeverity(alert.level),
    title: alert.level === "critical" ? "Critical Alert" : "Operational Alert",
    message: alert.message,
    relatedObjectIds: alert.relatedObjectIds,
    acknowledged: alert.acknowledged,
  }));

  if (input.activeSimulation?.riskLevel === "high") {
    alerts.push({
      id: `warroom_simulation_risk_${input.activeSimulation.scenarioId}`,
      category: "scenario",
      severity: "high",
      title: "Scenario Risk Elevated",
      message: input.activeSimulation.summary,
      relatedObjectIds: input.activeSimulation.affectedObjectIds,
      acknowledged: false,
    });
  }

  if (input.executionState?.riskLevel === "high") {
    alerts.push({
      id: `warroom_execution_risk_${input.executionState.scenarioId}`,
      category: "governance",
      severity: "critical",
      title: "Execution Risk Critical",
      message: "Active execution is operating under high systemic risk.",
      relatedObjectIds: [],
      acknowledged: false,
    });
  }

  return alerts.sort(
    (left, right) =>
      severityWeight(right.severity) - severityWeight(left.severity) || left.id.localeCompare(right.id)
  );
}

function severityWeight(severity: ExecutiveWarRoomAlertSeverity): number {
  if (severity === "critical") return 4;
  if (severity === "high") return 3;
  if (severity === "medium") return 2;
  return 1;
}

function buildEvents(input: BuildExecutiveWarRoomInput, alerts: readonly ExecutiveWarRoomAlertRecord[]): ExecutiveWarRoomEventRecord[] {
  const timelineEvents = (input.timelineEvents ?? []).map((event) => ({
    id: event.id,
    kind: inferEventKind(event),
    title: event.title,
    summary: event.summary ?? event.narrativeSummary ?? event.title,
    severity: timelineSeverity(event),
    priorityScore: clamp01(
      (severityWeight(timelineSeverity(event)) / 4) * 0.55 +
        (event.status === "active" ? 0.35 : 0.15) +
        (input.selectedTimelineEventId === event.id ? 0.1 : 0)
    ),
    relatedObjectIds: event.relatedObjectIds ?? [],
    escalated: timelineSeverity(event) === "critical" || timelineSeverity(event) === "high",
    timestampLabel: event.timestamp ?? event.timestampIso ?? null,
  }));

  const alertEvents = alerts.slice(0, 4).map((alert) => ({
    id: `event_${alert.id}`,
    kind: alert.category === "scenario" ? ("risk" as ExecutiveWarRoomEventKind) : ("incident" as ExecutiveWarRoomEventKind),
    title: alert.title,
    summary: alert.message,
    severity: alert.severity,
    priorityScore: clamp01(severityWeight(alert.severity) / 4),
    relatedObjectIds: alert.relatedObjectIds,
    escalated: alert.severity === "critical" || alert.severity === "high",
    timestampLabel: null,
  }));

  return [...timelineEvents, ...alertEvents]
    .sort((left, right) => right.priorityScore - left.priorityScore)
    .slice(0, 12);
}

function buildRecommendations(input: BuildExecutiveWarRoomInput): ExecutiveWarRoomRecommendationRecord[] {
  const recommendations: ExecutiveWarRoomRecommendationRecord[] = [];

  if (input.decisionRecommendation?.recommendedScenarioId) {
    recommendations.push({
      id: `decision_${input.decisionRecommendation.recommendedScenarioId}`,
      title: "Strategic Scenario Recommendation",
      reasoning: input.decisionRecommendation.reasoning,
      impactScore: clamp01(input.decisionRecommendation.confidence + 0.1),
      confidence: clamp01(input.decisionRecommendation.confidence),
      urgency: 0.72,
      rank: 1,
      status: "pending",
      relatedScenarioId: input.decisionRecommendation.recommendedScenarioId,
    });
  }

  const universeRecommendation = input.scenarioUniverse?.recommendation;
  if (universeRecommendation) {
    recommendations.push({
      id: `universe_${universeRecommendation.recommendedScenarioId}`,
      title: universeRecommendation.recommendedTitle,
      reasoning: universeRecommendation.reasoning,
      impactScore: clamp01(universeRecommendation.confidence + 0.08),
      confidence: clamp01(universeRecommendation.confidence),
      urgency: 0.66,
      rank: recommendations.length + 1,
      status: "pending",
      relatedScenarioId: universeRecommendation.recommendedScenarioId,
    });
  }

  recommendations.sort(
    (left, right) =>
      right.impactScore * 0.45 + right.urgency * 0.35 + right.confidence * 0.2 -
      (left.impactScore * 0.45 + left.urgency * 0.35 + left.confidence * 0.2)
  );

  return recommendations.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}

function buildDecisions(
  input: BuildExecutiveWarRoomInput,
  recommendations: readonly ExecutiveWarRoomRecommendationRecord[]
): ExecutiveWarRoomDecisionRecord[] {
  const decisions: ExecutiveWarRoomDecisionRecord[] = recommendations.slice(0, 3).map((entry) => ({
    id: `queue_${entry.id}`,
    title: entry.title,
    summary: entry.reasoning,
    priorityScore: clamp01(entry.impactScore * 0.5 + entry.urgency * 0.3 + entry.confidence * 0.2),
    impactSummary: input.decisionRecommendation?.tradeoff ?? input.scenarioUniverse?.comparisonSummary ?? "Review downstream impact before committing.",
    relatedObjectIds: input.activeSimulation?.affectedObjectIds ?? [],
    relatedScenarioId: entry.relatedScenarioId,
  }));

  if (input.executionState && (input.executionState.status === "running" || input.executionState.status === "paused")) {
    decisions.unshift({
      id: `execution_${input.executionState.scenarioId}`,
      title: "Active Execution Decision",
      summary: `Execution is ${input.executionState.status} under ${input.executionState.riskLevel} risk.`,
      priorityScore: input.executionState.riskLevel === "high" ? 0.92 : 0.74,
      impactSummary: input.executionState.monitoredSignals.slice(0, 2).join(" · ") || "Monitor live signals.",
      relatedObjectIds: [],
      relatedScenarioId: input.executionState.scenarioId,
    });
  }

  return decisions.sort((left, right) => right.priorityScore - left.priorityScore);
}

function mapPlaybackStatus(status: BuildExecutiveWarRoomInput["playbackStatus"]): ExecutiveWarRoomSimulationRecord["status"] {
  if (status === "playing") return "running";
  if (status === "paused") return "paused";
  if (status === "completed") return "completed";
  return "idle";
}

function buildSimulations(input: BuildExecutiveWarRoomInput): ExecutiveWarRoomSimulationRecord[] {
  const simulations: ExecutiveWarRoomSimulationRecord[] = [];
  if (input.activeSimulation) {
    simulations.push({
      id: input.activeSimulation.scenarioId,
      title: input.activeScenarioTitle ?? input.activeSimulation.scenarioId,
      status: mapPlaybackStatus(input.playbackStatus),
      riskLevel: input.activeSimulation.riskLevel,
      affectedObjectCount: input.activeSimulation.affectedObjectIds.length,
      progressPercent: input.playbackProgressPercent ?? null,
    });
  }

  input.scenarioUniverse?.layers
    .filter((layer) => layer.metadata.role === "alternative")
    .forEach((layer) => {
      if (simulations.some((entry) => entry.id === layer.metadata.id)) return;
      simulations.push({
        id: layer.metadata.id,
        title: layer.metadata.title,
        status: layer.metadata.id === input.scenarioUniverse?.activeScenarioId ? mapPlaybackStatus(input.playbackStatus) : "idle",
        riskLevel: layer.metadata.riskLevel,
        affectedObjectCount: layer.simulation?.affectedObjectIds.length ?? 0,
        progressPercent: null,
      });
    });

  return simulations;
}

function buildHotspots(input: BuildExecutiveWarRoomInput): ExecutiveWarRoomHotspot[] {
  const hotspots: ExecutiveWarRoomHotspot[] = [];
  const simulation = input.activeSimulation;

  simulation?.affectedObjectIds.forEach((objectId, index) => {
    hotspots.push({
      id: `operational_${objectId}`,
      kind: "operational",
      objectId,
      label: objectId,
      magnitude: index === 0 ? "major" : "moderate",
      score: clamp01(0.55 + index * 0.08),
    });
  });

  simulation?.propagationPaths.forEach((path, index) => {
    hotspots.push({
      id: `risk_${path.from}_${path.to}`,
      kind: "risk",
      objectId: path.to,
      label: `${path.from} → ${path.to}`,
      magnitude: simulation.riskLevel === "high" ? "critical" : simulation.riskLevel === "medium" ? "major" : "moderate",
      score: clamp01(path.intensity ?? 0.6),
    });
  });

  (input.timelineEvents ?? [])
    .filter((event) => inferEventKind(event) === "opportunity")
    .slice(0, 3)
    .forEach((event, index) => {
      const objectId = event.relatedObjectIds?.[0];
      if (!objectId) return;
      hotspots.push({
        id: `opportunity_${event.id}`,
        kind: "opportunity",
        objectId,
        label: event.title,
        magnitude: index === 0 ? "major" : "moderate",
        score: clamp01(0.62 + index * 0.05),
      });
    });

  return hotspots.sort((left, right) => right.score - left.score).slice(0, 8);
}

function buildKpis(input: BuildExecutiveWarRoomInput, alerts: readonly ExecutiveWarRoomAlertRecord[]): ExecutiveWarRoomKpiLayer {
  const twin = input.cognitiveTwin;
  if (twin?.active) {
    return {
      operationalHealth: twin.scores.enterpriseHealthScore,
      riskScore: clamp01(twin.scores.enterprisePulseScore),
      resilienceScore: twin.scores.enterpriseResilienceScore,
      scenarioConfidence: clamp01(
        input.decisionRecommendation?.confidence ??
          twin.futureBranches[0]?.overallScore ??
          input.pipelineConfidence ??
          0.5
      ),
      strategicScore: clamp01(twin.scores.enterpriseReadinessScore * 0.45 + twin.scores.enterpriseStabilityScore * 0.55),
      operationalReadiness: twin.scores.enterpriseReadinessScore,
    };
  }

  const riskPenalty = alerts.filter((alert) => !alert.acknowledged).reduce((sum, alert) => sum + severityWeight(alert.severity) * 0.05, 0);
  const simulationRisk =
    input.activeSimulation?.riskLevel === "high" ? 0.78 : input.activeSimulation?.riskLevel === "medium" ? 0.52 : 0.24;
  const riskScore = clamp01(Math.max(simulationRisk, riskPenalty));
  const scenarioConfidence = clamp01(
    input.decisionRecommendation?.confidence ??
      input.scenarioUniverse?.recommendation?.confidence ??
      input.pipelineConfidence ??
      input.activeSimulation?.riskLevel === "low"
        ? 0.68
        : 0.42
  );
  const operationalHealth = clamp01(1 - riskScore * 0.62);
  const resilienceScore = clamp01(1 - riskScore * 0.55 + scenarioConfidence * 0.15);
  const strategicScore = clamp01(resilienceScore * 0.45 + scenarioConfidence * 0.35 + operationalHealth * 0.2);
  const operationalReadiness = clamp01(
    operationalHealth * 0.5 + scenarioConfidence * 0.25 + (input.executionState?.status === "running" ? 0.15 : 0.05)
  );

  return {
    operationalHealth,
    riskScore,
    resilienceScore,
    scenarioConfidence,
    strategicScore,
    operationalReadiness,
  };
}

function buildMission(
  autoFocusMode: ExecutiveWarRoomFocusMode,
  focusModeOverride: ExecutiveWarRoomFocusMode | null,
  situation: ExecutiveWarRoomSituationBrief
): ExecutiveWarRoomMissionState {
  const focusMode = focusModeOverride ?? autoFocusMode;
  const labels: Record<ExecutiveWarRoomFocusMode, { label: string; summary: string }> = {
    operations: { label: "Operations Command", summary: "Monitor current operational state and active signals." },
    risk: { label: "Risk Command", summary: "Investigate threats, vulnerabilities, and propagation paths." },
    scenario: { label: "Scenario Command", summary: "Compare futures and evaluate strategic trade-offs." },
    recovery: { label: "Recovery Command", summary: "Coordinate incident response and stabilization actions." },
    growth: { label: "Growth Command", summary: "Surface emerging opportunities and expansion paths." },
    strategic: { label: "Strategic Command", summary: "Align long-term decisions with enterprise posture." },
  };
  const selected = labels[focusMode];
  return {
    focusMode,
    autoFocusMode,
    missionLabel: selected.label,
    missionSummary: situation.summary || selected.summary,
  };
}

function buildSituationBrief(
  input: BuildExecutiveWarRoomInput,
  statusLevel: ExecutiveWarRoomStatusLevel,
  events: readonly ExecutiveWarRoomEventRecord[]
): ExecutiveWarRoomSituationBrief {
  const topEvent = events[0];
  const domain = input.domainLabel?.trim() || "Operational universe";
  const twin = input.cognitiveTwin;
  const advisor = input.executiveAdvisor;
  const headline =
    advisor?.hud.brief.proactiveInsight ??
    twin?.awareness.situation ??
    topEvent?.title ??
    (input.activeSimulation ? `${input.activeScenarioTitle ?? "Scenario"} in focus` : `${domain} under executive watch`);
  const summary =
    advisor?.hud.brief.summary ??
    twin?.copilot.explanation ??
    topEvent?.summary ??
    input.activeSimulation?.summary ??
    input.decisionRecommendation?.reasoning ??
    "Executive war room is monitoring live operational signals.";
  return { headline, summary, statusLevel };
}

function buildStrategicSummary(input: BuildExecutiveWarRoomInput): ExecutiveWarRoomStrategicSummary {
  const recommendation = input.decisionRecommendation;
  const universeRecommendation = input.scenarioUniverse?.recommendation;
  const twin = input.cognitiveTwin;
  return {
    headline:
      twin?.awareness.strategic ??
      recommendation?.nextAction ??
      universeRecommendation?.recommendedTitle ??
      "Maintain operational stability while evaluating alternatives.",
    position:
      twin?.awareness.operational ??
      recommendation?.tradeoff ??
      input.scenarioUniverse?.comparisonSummary ??
      "Strategic position is being assessed from live signals.",
    recommendedAction:
      twin?.copilot.recommendation ??
      recommendation?.nextAction ??
      universeRecommendation?.tradeoffSummary ??
      null,
  };
}

function buildCommands(input: BuildExecutiveWarRoomInput): ExecutiveWarRoomCommandAction[] {
  return [
    {
      id: "analyze_system",
      label: "Analyze System",
      hint: "Analyze current operational posture",
      enabled: true,
    },
    {
      id: "show_risks",
      label: "Show Risks",
      hint: "Focus the scene on active risk hotspots",
      enabled: (input.alerts?.length ?? 0) > 0 || input.activeSimulation?.riskLevel !== "low",
    },
    {
      id: "compare_scenarios",
      label: "Compare Scenarios",
      hint: "Open multi-scenario comparison",
      enabled: Boolean(input.scenarioComparison?.rows.length || input.scenarioUniverse?.comparisonActive),
    },
    {
      id: "run_simulation",
      label: "Run Simulation",
      hint: "Launch or resume scenario simulation",
      enabled: Boolean(input.activeSimulation || input.scenarioComparison?.rows.length),
    },
    {
      id: "explain_situation",
      label: "Explain Situation",
      hint: "Ask the copilot to explain the current situation",
      enabled: true,
    },
    {
      id: "strategic_recommendation",
      label: "Strategic Recommendation",
      hint: "Review the top strategic recommendation",
      enabled: Boolean(input.decisionRecommendation?.recommendedScenarioId || input.scenarioUniverse?.recommendation),
    },
  ];
}

function buildHud(
  mission: ExecutiveWarRoomMissionState,
  situation: ExecutiveWarRoomSituationBrief,
  strategic: ExecutiveWarRoomStrategicSummary,
  statusLevel: ExecutiveWarRoomStatusLevel,
  commands: readonly ExecutiveWarRoomCommandAction[],
  events: readonly ExecutiveWarRoomEventRecord[],
  kpis: ExecutiveWarRoomKpiLayer,
  bestScenarioTitle: string | null,
  tradeoffSummary: string | null,
  advisorInsight: string | null
): ExecutiveWarRoomHudModel {
  return {
    mission,
    situation,
    strategic,
    statusLevel,
    commands,
    eventFeed: events.slice(0, 5),
    kpis,
    bestScenarioTitle,
    tradeoffSummary,
    advisorInsight,
  };
}

function buildCopilotContext(
  mission: ExecutiveWarRoomMissionState,
  situation: ExecutiveWarRoomSituationBrief,
  strategic: ExecutiveWarRoomStrategicSummary,
  recommendations: readonly ExecutiveWarRoomRecommendationRecord[],
  alerts: readonly ExecutiveWarRoomAlertRecord[],
  decisions: readonly ExecutiveWarRoomDecisionRecord[],
  activeScenarioTitle: string | null
): ExecutiveWarRoomCopilotContext {
  return {
    focusMode: mission.focusMode,
    situationHeadline: situation.headline,
    strategicHeadline: strategic.headline,
    activeScenarioTitle,
    topRecommendation: recommendations[0]?.title ?? null,
    criticalAlertCount: alerts.filter((alert) => alert.severity === "critical" && !alert.acknowledged).length,
    pendingDecisionCount: decisions.length,
  };
}

function buildSignature(input: BuildExecutiveWarRoomInput, focusMode: ExecutiveWarRoomFocusMode): string {
  return [
    input.selectedObjectId ?? "none",
    input.selectedTimelineEventId ?? "none",
    input.activeSimulation?.scenarioId ?? "none",
    input.scenarioUniverse?.signature ?? "none",
    input.playbackStatus ?? "idle",
    input.playbackProgressPercent ?? "none",
    input.scenarioComparison?.id ?? "none",
    input.decisionRecommendation?.recommendedScenarioId ?? "none",
    input.executionState?.status ?? "none",
    (input.alerts ?? []).map((alert) => `${alert.id}:${alert.acknowledged}`).join("|") || "none",
    input.cognitiveTwin?.signature ?? "none",
    input.executiveAdvisor?.signature ?? "none",
    focusMode,
  ].join("::");
}

export function buildExecutiveWarRoomState(
  input: BuildExecutiveWarRoomInput,
  focusModeOverride: ExecutiveWarRoomFocusMode | null = null
): ExecutiveWarRoomState {
  const autoFocusMode = resolveAutoFocusMode(input);
  const focusMode = focusModeOverride ?? autoFocusMode;
  const alerts = buildAlerts(input);
  const events = buildEvents(input, alerts);
  const recommendations = buildRecommendations(input);
  const decisions = buildDecisions(input, recommendations);
  const simulations = buildSimulations(input);
  const hotspots = buildHotspots(input);
  const kpis = buildKpis(input, alerts);
  const statusLevel = resolveStatusLevel({
    alerts,
    executionRisk: input.executionState?.riskLevel ?? null,
    simulationRisk: input.activeSimulation?.riskLevel ?? null,
  });
  const situation = buildSituationBrief(input, statusLevel, events);
  const strategic = buildStrategicSummary(input);
  const mission = buildMission(autoFocusMode, focusModeOverride, situation);
  const commands = buildCommands(input);
  const bestScenarioTitle =
    input.scenarioUniverse?.recommendation?.recommendedTitle ??
    input.scenarioComparison?.rows.find((row) => row.scenarioId === input.scenarioComparison?.bestOptionId)?.title ??
    null;
  const tradeoffSummary =
    input.decisionRecommendation?.tradeoff ?? input.scenarioUniverse?.recommendation?.tradeoffSummary ?? null;
  const signature = buildSignature(input, focusMode);
  const activeScenarioTitle = input.activeScenarioTitle ?? input.activeSimulation?.scenarioId ?? null;

  const state: ExecutiveWarRoomState = {
    signature,
    active: true,
    context: {
      selectedObjectId: input.selectedObjectId ?? null,
      selectedClusterId: input.selectedClusterId ?? null,
      selectedScenarioId: input.activeSimulation?.scenarioId ?? input.scenarioUniverse?.activeScenarioId ?? null,
      selectedRiskId: alerts[0]?.id ?? null,
      selectedTimelineEventId: input.selectedTimelineEventId ?? null,
    },
    mission,
    situation,
    strategic,
    statusLevel,
    events,
    alerts,
    recommendations,
    decisions,
    simulations,
    hotspots,
    kpis,
    hud: buildHud(
      mission,
      situation,
      strategic,
      statusLevel,
      commands,
      events,
      kpis,
      bestScenarioTitle,
      tradeoffSummary,
      input.executiveAdvisor?.hud.brief.proactiveInsight ?? null
    ),
    copilot: buildCopilotContext(mission, situation, strategic, recommendations, alerts, decisions, activeScenarioTitle),
    bestScenarioId:
      input.decisionRecommendation?.recommendedScenarioId ??
      input.scenarioUniverse?.recommendation?.recommendedScenarioId ??
      null,
    bestScenarioTitle,
    tradeoffSummary,
  };

  logE297WarRoomInitialized(signature, {
    focusMode: state.mission.focusMode,
    statusLevel: state.statusLevel,
    alertCount: state.alerts.length,
    recommendationCount: state.recommendations.length,
  });
  logE297ContextChanged(signature, {
    selectedObjectId: state.context.selectedObjectId,
    selectedScenarioId: state.context.selectedScenarioId,
    eventCount: state.events.length,
  });
  if (state.alerts.length > 0) {
    logE297AlertRaised(`${signature}:alerts`, {
      count: state.alerts.length,
      critical: state.alerts.filter((alert) => alert.severity === "critical").length,
    });
  }
  if (state.recommendations.length > 0) {
    logE297RecommendationGenerated(`${signature}:recs`, {
      topRecommendation: state.recommendations[0]?.title ?? null,
      rankCount: state.recommendations.length,
    });
  }
  if (state.simulations.some((simulation) => simulation.status === "running")) {
    logE297SimulationStarted(`${signature}:sim`, {
      simulationIds: state.simulations.filter((simulation) => simulation.status === "running").map((simulation) => simulation.id),
    });
  }

  return state;
}

export function resolveExecutiveWarRoomCopilotPrompt(state: ExecutiveWarRoomState | null): string | null {
  if (!state?.active) return null;
  return [
    `War Room focus: ${state.copilot.focusMode}.`,
    `Situation: ${state.copilot.situationHeadline}.`,
    `Strategic posture: ${state.copilot.strategicHeadline}.`,
    state.copilot.activeScenarioTitle ? `Active scenario: ${state.copilot.activeScenarioTitle}.` : null,
    state.copilot.topRecommendation ? `Top recommendation: ${state.copilot.topRecommendation}.` : null,
    state.copilot.criticalAlertCount > 0
      ? `${state.copilot.criticalAlertCount} critical alert(s) require attention.`
      : null,
  ]
    .filter(Boolean)
    .join(" ");
}

export function resolveWarRoomIncidentFocusObjectId(state: ExecutiveWarRoomState | null): string | null {
  if (!state) return null;
  const criticalHotspot = state.hotspots.find((hotspot) => hotspot.kind === "risk" && hotspot.magnitude === "critical");
  if (criticalHotspot) return criticalHotspot.objectId;
  const alert = state.alerts.find((entry) => entry.severity === "critical" || entry.severity === "high");
  if (alert?.relatedObjectIds[0]) return alert.relatedObjectIds[0];
  return state.hotspots[0]?.objectId ?? null;
}
