/**
 * E2:100 — Executive Intelligence Runtime: unified command center orchestration.
 */

import { readExecutiveSceneObjects } from "../camera/executiveCameraPresetRegistry";
import { readSceneRelationships } from "../../relationships/relationshipRuntime";
import {
  clearExecutiveAdvisor,
  getExecutiveAdvisorState,
  refreshExecutiveAdvisor,
} from "../advisor/executiveAdvisorStore.ts";
import {
  clearExecutiveCognitiveTwin,
  getExecutiveCognitiveTwinState,
  refreshExecutiveCognitiveTwin,
} from "../twin/executiveCognitiveTwinStore.ts";
import {
  clearExecutiveWarRoom,
  getExecutiveWarRoomState,
  refreshExecutiveWarRoom,
} from "../warroom/executiveWarRoomStore.ts";
import { getExecutiveScenarioPlaybackState } from "../scenario/executiveScenarioPlaybackStore.ts";
import {
  logE2100AcceptanceGateFailed,
  logE2100AcceptanceGatePassed,
  logE2100MVPReady,
  logE2100ReadinessStarted,
  logE2100ValidationCompleted,
} from "./executiveIntelligenceDiagnostics.ts";
import { buildExecutiveDemoFlow } from "./executiveIntelligenceDemoFlow.ts";
import { buildExecutiveIntelligenceChecklists } from "./executiveIntelligenceChecklists.ts";
import { summarizeExecutiveRuntimeHealth } from "./executiveIntelligenceHealthMonitor.ts";
import { buildExecutiveRuntimeRegistry } from "./executiveIntelligenceRegistry.ts";
import {
  buildExecutiveIntelligenceScorecard,
  scanExecutiveLoopRisks,
  validateExecutiveIntelligence,
} from "./executiveIntelligenceValidation.ts";
import type {
  BuildExecutiveIntelligenceRefreshInput,
  ExecutiveAcceptanceGate,
  ExecutiveIntelligenceHudModel,
  ExecutiveIntelligenceState,
  ExecutiveValidationResult,
} from "./executiveIntelligenceTypes";

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, Number(value.toFixed(3))));
}

let lastBuiltInputSignature: string | null = null;
let lastBuiltState: ExecutiveIntelligenceState | null = null;

/** Input-only signature — excludes cascade output store signatures to prevent refresh loops. */
export function buildExecutiveIntelligenceInputSignature(input: BuildExecutiveIntelligenceRefreshInput): string {
  const timeline = input.executiveTimelineHud;
  const playback = input.playbackState ?? getExecutiveScenarioPlaybackState();
  const sceneObjectIds = readExecutiveSceneObjects(input.sceneJson)
    .map((raw, index) => {
      const object = raw as { id?: string; name?: string };
      return String(object.id ?? object.name ?? `obj:${index}`).trim();
    })
    .sort();

  return JSON.stringify({
    sceneObjectIds,
    selectedObjectId: input.selectedObjectId ?? null,
    scenarioId: input.activeSimulation?.scenarioId ?? null,
    activeScenarioTitle: input.activeScenarioTitle ?? null,
    relationshipCount: readSceneRelationships(input.sceneJson).length,
    activeScenarioId: input.scenarioUniverse?.activeScenarioId ?? null,
    visibleObjectCount: input.sceneObjectCount ?? sceneObjectIds.length,
    comparisonId: input.scenarioComparison?.id ?? null,
    universeSignature: input.scenarioUniverse?.signature ?? null,
    playbackSignature: playback.signature ?? null,
    playbackStatus: playback.status ?? "idle",
    playbackProgress: playback.propagationView?.completionPercent ?? null,
    decisionScenarioId: input.decisionRecommendation?.recommendedScenarioId ?? null,
    executionStatus: input.executionState?.status ?? null,
    alertSignature:
      (input.alerts ?? []).map((alert) => `${alert.id}:${alert.acknowledged}`).join("|") || "none",
    timelineFocusedEventId: timeline?.focusedEventId ?? null,
    timelineEventCount: timeline?.events.length ?? 0,
    pipelineConfidence: input.pipelineConfidence ?? null,
    pipelineRiskLabel: input.pipelineRiskLabel ?? null,
    domainLabel: input.domainLabel ?? null,
    domainId: input.domainId ?? null,
    cameraPreset: input.cameraPreset ?? "balanced",
  });
}

/** @deprecated alias — use buildExecutiveIntelligenceInputSignature */
export function buildExecutiveIntelligenceRefreshSignature(input: BuildExecutiveIntelligenceRefreshInput): string {
  return buildExecutiveIntelligenceInputSignature(input);
}

export function isExecutiveIntelligenceSceneReady(input: BuildExecutiveIntelligenceRefreshInput): boolean {
  const sceneObjectIds = readExecutiveSceneObjects(input.sceneJson)
    .map((raw, index) => {
      const object = raw as { id?: string; name?: string };
      return String(object.id ?? object.name ?? `obj:${index}`).trim();
    })
    .filter(Boolean);
  const visibleObjectCount = input.sceneObjectCount ?? sceneObjectIds.length;
  return sceneObjectIds.length > 0 || visibleObjectCount > 0;
}

export function resetExecutiveIntelligenceRuntimeCacheForTests(): void {
  lastBuiltInputSignature = null;
  lastBuiltState = null;
}

function buildSceneContext(sceneJson: unknown) {
  const sceneObjects = readExecutiveSceneObjects(sceneJson);
  const sceneObjectIds = sceneObjects.map((raw, index) => {
    const object = raw as { id?: string; name?: string };
    return String(object.id ?? object.name ?? `obj:${index}`).trim();
  });
  const sceneObjectMeta = sceneObjects.map((raw, index) => {
    const object = raw as {
      id?: string;
      name?: string;
      label?: string;
      tags?: string[];
      role?: string;
    };
    const id = String(object.id ?? object.name ?? `obj:${index}`).trim();
    return {
      id,
      label: String(object.label ?? object.name ?? id),
      tags: Array.isArray(object.tags) ? object.tags.map(String) : [],
      role: object.role,
    };
  });
  const relationships = readSceneRelationships(sceneJson).map((relationship) => ({
    id: relationship.id,
    sourceId: relationship.sourceId,
    targetId: relationship.targetId,
    type: relationship.type,
  }));
  return { sceneObjectIds, sceneObjectMeta, relationships };
}

export function refreshExecutiveIntelligenceCascade(input: BuildExecutiveIntelligenceRefreshInput): void {
  const { sceneObjectIds, sceneObjectMeta, relationships } = buildSceneContext(input.sceneJson);
  const playbackState = input.playbackState ?? getExecutiveScenarioPlaybackState();
  const timelineEvents = input.executiveTimelineHud?.events ?? [];

  if (!sceneObjectIds.length) {
    clearExecutiveCognitiveTwin();
  } else {
    refreshExecutiveCognitiveTwin({
      sceneObjectIds,
      sceneObjectMeta,
      relationships,
      selectedObjectId: input.selectedObjectId ?? null,
      domainLabel: input.domainLabel ?? null,
      domainId: input.domainId ?? null,
      activeSimulation: input.activeSimulation ?? null,
      scenarioComparison: input.scenarioComparison ?? null,
      scenarioUniverse: input.scenarioUniverse ?? null,
      timelineEvents,
      alerts: input.alerts ?? [],
      executionState: input.executionState ?? null,
      decisionRecommendation: input.decisionRecommendation ?? null,
      memoryState: input.memoryState ?? null,
      pipelineConfidence: input.pipelineConfidence ?? null,
      pipelineRiskLabel: input.pipelineRiskLabel ?? null,
      warRoomSignature: getExecutiveWarRoomState()?.signature ?? null,
    });
  }

  if (!input.executiveTimelineHud && !input.activeSimulation && !input.scenarioComparison && !sceneObjectIds.length) {
    clearExecutiveWarRoom();
    clearExecutiveAdvisor();
    return;
  }

  const sharedWarRoomInput = {
    selectedObjectId: input.selectedObjectId ?? null,
    selectedTimelineEventId: input.executiveTimelineHud?.focusedEventId ?? null,
    activeSimulation: input.activeSimulation ?? null,
    activeScenarioTitle: input.activeScenarioTitle ?? null,
    scenarioComparison: input.scenarioComparison ?? null,
    scenarioUniverse: input.scenarioUniverse ?? null,
    playbackStatus: playbackState.status,
    playbackProgressPercent: playbackState.propagationView?.completionPercent ?? null,
    timelineEvents,
    alerts: input.alerts ?? [],
    decisionRecommendation: input.decisionRecommendation ?? null,
    executionState: input.executionState ?? null,
    domainLabel: input.domainLabel ?? null,
    pipelineConfidence: input.pipelineConfidence ?? null,
    pipelineRiskLabel: input.pipelineRiskLabel ?? null,
    cognitiveTwin: getExecutiveCognitiveTwinState(),
  };

  refreshExecutiveWarRoom(sharedWarRoomInput);
  refreshExecutiveAdvisor({
    cognitiveTwin: getExecutiveCognitiveTwinState(),
    warRoom: getExecutiveWarRoomState(),
    activeSimulation: input.activeSimulation ?? null,
    activeScenarioTitle: input.activeScenarioTitle ?? null,
    scenarioComparison: input.scenarioComparison ?? null,
    scenarioUniverse: input.scenarioUniverse ?? null,
    timelineEvents,
    alerts: input.alerts ?? [],
    executionState: input.executionState ?? null,
    decisionRecommendation: input.decisionRecommendation ?? null,
    memoryState: input.memoryState ?? null,
    selectedObjectId: input.selectedObjectId ?? null,
    domainLabel: input.domainLabel ?? null,
    pipelineConfidence: input.pipelineConfidence ?? null,
  });
  refreshExecutiveWarRoom({
    ...sharedWarRoomInput,
    cognitiveTwin: getExecutiveCognitiveTwinState(),
    executiveAdvisor: getExecutiveAdvisorState(),
  });
}

function buildAcceptanceGates(
  validations: readonly ExecutiveValidationResult[],
  loopScan: ReturnType<typeof scanExecutiveLoopRisks>,
  healthFailedCount: number
): ExecutiveAcceptanceGate[] {
  const criticalFailures = validations.filter((entry) => entry.critical && !entry.passed);
  const mvpBlockers = criticalFailures.map((entry) => entry.summary);
  const runtimeBlockers: string[] = [];
  if (loopScan.reactLoopRisk) runtimeBlockers.push("React loop risk detected.");
  if (loopScan.idleLoopRisk) runtimeBlockers.push("Idle loop risk detected.");
  if (!loopScan.heartbeatAuditClean) runtimeBlockers.push("Heartbeat audit failed.");
  if (healthFailedCount > 0) runtimeBlockers.push("Failed runtime modules detected.");

  const executiveBlockers: string[] = [];
  if (!validations.find((entry) => entry.validationId === "first_impression_flow")?.passed) {
    executiveBlockers.push("First impression flow incomplete.");
  }
  if (!validations.find((entry) => entry.validationId === "executive_orientation")?.passed) {
    executiveBlockers.push("Executive orientation incomplete.");
  }

  return [
    { gateId: "mvp", passed: mvpBlockers.length === 0, blockers: mvpBlockers },
    { gateId: "runtime", passed: runtimeBlockers.length === 0, blockers: runtimeBlockers },
    { gateId: "executive", passed: executiveBlockers.length === 0, blockers: executiveBlockers },
  ];
}

function buildHud(
  scorecard: ExecutiveIntelligenceState["scorecard"],
  acceptanceGates: readonly ExecutiveAcceptanceGate[],
  health: ReturnType<typeof summarizeExecutiveRuntimeHealth>,
  validations: readonly ExecutiveValidationResult[],
  demoFlow: ExecutiveIntelligenceState["demoFlow"],
  mvpReady: boolean,
  warRoom: ReturnType<typeof getExecutiveWarRoomState>,
  advisor: ReturnType<typeof getExecutiveAdvisorState>,
  timelineEventTitle: string | null
): ExecutiveIntelligenceHudModel {
  const topGap = validations.find((entry) => !entry.passed)?.summary ?? null;
  const acceptancePassed = acceptanceGates.every((gate) => gate.passed);

  return {
    headline: mvpReady
      ? "Nexora Type-C MVP is ready for executive demonstrations."
      : "Executive Cognitive Command Center integration in progress.",
    firstImpressionSummary:
      advisor?.hud.brief.proactiveInsight ??
      warRoom?.hud.advisorInsight ??
      warRoom?.strategic.headline ??
      demoFlow.walkthroughSteps[0]?.narrative ??
      "Orient to the living scene, twin pulse, and timeline within 30 seconds.",
    orientationSummary: [
      warRoom?.alerts[0]?.title ? `Risk: ${warRoom.alerts[0].title}` : null,
      demoFlow.scenarioTitle ? `Scenario: ${demoFlow.scenarioTitle}` : null,
      advisor?.hud.topRecommendation?.title ? `Recommendation: ${advisor.hud.topRecommendation.title}` : null,
      timelineEventTitle ? `Timeline: ${timelineEventTitle}` : null,
    ]
      .filter(Boolean)
      .join(" · "),
    readinessScore: clamp01(scorecard.executiveReadinessScore),
    acceptancePassed,
    mvpReady,
    activeModules: health.activeCount,
    degradedModules: health.degradedCount,
    failedModules: health.failedCount,
    topValidationGap: topGap,
    demoStepTitle: demoFlow.walkthroughSteps[0]?.title ?? null,
  };
}

export function buildExecutiveIntelligenceState(
  input: BuildExecutiveIntelligenceRefreshInput
): ExecutiveIntelligenceState {
  const sceneReady = isExecutiveIntelligenceSceneReady(input);
  const inputSignature = buildExecutiveIntelligenceInputSignature(input);
  if (lastBuiltInputSignature === inputSignature && lastBuiltState) {
    return lastBuiltState;
  }
  if (!sceneReady) {
    return lastBuiltState ?? {
      signature: inputSignature,
      active: false,
      registry: [],
      validations: [],
      scorecard: {
        executiveReadinessScore: 0,
        productMaturityScore: 0,
        demoReadinessScore: 0,
        productionCandidateScore: 0,
      },
      acceptanceGates: [],
      checklists: [],
      demoFlow: { scenarioTitle: "Awaiting hydration", walkthroughSteps: [], strategicStory: [] },
      loopScan: scanExecutiveLoopRisks(),
      hud: {
        headline: "Awaiting scene hydration.",
        firstImpressionSummary: "Executive intelligence activates after scene objects are available.",
        orientationSummary: "",
        readinessScore: 0,
        acceptancePassed: false,
        mvpReady: false,
        activeModules: 0,
        degradedModules: 0,
        failedModules: 0,
        topValidationGap: null,
        demoStepTitle: null,
      },
      mvpReady: false,
    };
  }

  const sceneObjectCount = input.sceneObjectCount ?? readExecutiveSceneObjects(input.sceneJson).length;
  const warRoom = getExecutiveWarRoomState();
  const cognitiveTwin = getExecutiveCognitiveTwinState();
  const advisor = getExecutiveAdvisorState();
  const playback = input.playbackState ?? getExecutiveScenarioPlaybackState();
  const universe = input.scenarioUniverse ?? null;

  const registry = buildExecutiveRuntimeRegistry({
    sceneObjectCount,
    cameraPreset: input.cameraPreset ?? "balanced",
    timelineEventCount: input.executiveTimelineHud?.events.length ?? 0,
    playback,
    universe,
    simulation: input.activeSimulation ?? null,
    warRoom,
    cognitiveTwin,
    advisor,
  });
  const health = summarizeExecutiveRuntimeHealth(registry);
  const loopScan = scanExecutiveLoopRisks();
  const validations = validateExecutiveIntelligence({
    input: { ...input, sceneObjectCount },
    warRoom,
    cognitiveTwin,
    advisor,
    playback,
    universe,
    health,
  });
  const scorecard = buildExecutiveIntelligenceScorecard(validations, health);
  const acceptanceGates = buildAcceptanceGates(validations, loopScan, health.failedCount);
  const mvpReady = acceptanceGates.every((gate) => gate.passed) && scorecard.productionCandidateScore >= 0.72;
  const demoFlow = buildExecutiveDemoFlow({
    domainLabel: input.domainLabel,
    activeSimulation: input.activeSimulation ?? null,
    activeScenarioTitle: input.activeScenarioTitle ?? null,
    warRoom,
    advisor,
  });
  const checklists = buildExecutiveIntelligenceChecklists({
    validations,
    acceptanceGates,
    scorecard,
    mvpReady,
  });
  const signature = inputSignature;
  const active = Boolean(warRoom?.active || cognitiveTwin?.active || advisor?.active || sceneObjectCount > 0);

  logE2100ReadinessStarted(inputSignature, {
    sceneObjectCount,
    activeModules: health.activeCount,
  });
  logE2100ValidationCompleted(inputSignature, {
    passed: validations.filter((entry) => entry.passed).length,
    total: validations.length,
    productionCandidateScore: scorecard.productionCandidateScore,
  });
  if (mvpReady) {
    logE2100AcceptanceGatePassed(inputSignature, { gates: acceptanceGates.map((gate) => gate.gateId) });
    logE2100MVPReady(inputSignature, scorecard);
  } else if (sceneReady) {
    const blockers = acceptanceGates.flatMap((gate) => gate.blockers);
    if (blockers.length) {
      logE2100AcceptanceGateFailed(blockers, {
        inputSignature,
        blockers: blockers.slice(0, 4),
      }, {
        sceneReady: true,
        inputSignature,
      });
    }
  }

  const nextState: ExecutiveIntelligenceState = {
    signature,
    active,
    registry,
    validations,
    scorecard,
    acceptanceGates,
    checklists,
    demoFlow,
    loopScan,
    hud: buildHud(
      scorecard,
      acceptanceGates,
      health,
      validations,
      demoFlow,
      mvpReady,
      warRoom,
      advisor,
      input.executiveTimelineHud?.events[0]?.title ?? null
    ),
    mvpReady,
  };

  lastBuiltInputSignature = inputSignature;
  lastBuiltState = nextState;
  return nextState;
}

export function clearExecutiveIntelligenceCascade(): void {
  lastBuiltInputSignature = null;
  lastBuiltState = null;
  clearExecutiveCognitiveTwin();
  clearExecutiveWarRoom();
  clearExecutiveAdvisor();
}

export function resolveExecutiveIntelligenceCopilotPrompt(state: ExecutiveIntelligenceState | null): string | null {
  if (!state?.active) return null;
  return [
    state.hud.firstImpressionSummary,
    state.hud.orientationSummary,
    state.demoFlow.strategicStory.map((phase) => `${phase.phase}: ${phase.headline}`).join(" · "),
    state.mvpReady ? "MVP readiness gate passed." : state.hud.topValidationGap,
  ]
    .filter(Boolean)
    .join(" ");
}
