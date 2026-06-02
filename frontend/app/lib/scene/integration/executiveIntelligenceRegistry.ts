/**
 * E2:100 — Unified runtime registry (single source of truth for scene cognition modules).
 */

import type { ExecutiveAdvisorState } from "../advisor/executiveAdvisorTypes";
import type { ExecutiveCognitiveTwinState } from "../twin/executiveCognitiveTwinTypes";
import type { ExecutiveWarRoomState } from "../warroom/executiveWarRoomTypes";
import type { ExecutiveScenarioPlaybackState } from "../scenario/executiveScenarioPlaybackTypes";
import type { ExecutiveScenarioUniverseState } from "../scenario/executiveMultiScenarioUniverseTypes";
import type { TypeCScenarioSimulation } from "../../typec/typeCScenarioSimulation";
import type {
  ExecutiveRuntimeModuleEntry,
  ExecutiveRuntimeModuleHealth,
  ExecutiveRuntimeModuleId,
} from "./executiveIntelligenceTypes";

type RegistrySnapshot = {
  sceneObjectCount: number;
  cameraPreset: string | null;
  timelineEventCount: number;
  playback: ExecutiveScenarioPlaybackState | null;
  universe: ExecutiveScenarioUniverseState | null;
  simulation: TypeCScenarioSimulation | null;
  warRoom: ExecutiveWarRoomState | null;
  cognitiveTwin: ExecutiveCognitiveTwinState | null;
  advisor: ExecutiveAdvisorState | null;
};

function moduleHealth(active: boolean, degraded: boolean): ExecutiveRuntimeModuleHealth {
  if (!active) return "idle";
  return degraded ? "degraded" : "active";
}

function entry(
  moduleId: ExecutiveRuntimeModuleId,
  owner: string,
  health: ExecutiveRuntimeModuleHealth,
  signature: string | null,
  dependencies: readonly ExecutiveRuntimeModuleId[]
): ExecutiveRuntimeModuleEntry {
  return { moduleId, owner, health, signature, dependencies };
}

export function buildExecutiveRuntimeRegistry(snapshot: RegistrySnapshot): ExecutiveRuntimeModuleEntry[] {
  const sceneActive = snapshot.sceneObjectCount > 0;
  const cameraActive = sceneActive && Boolean(snapshot.cameraPreset);
  const timelineActive = snapshot.timelineEventCount > 0;
  const playbackActive = snapshot.playback?.status !== "idle";
  const universeActive = Boolean(snapshot.universe?.comparisonActive);
  const simulationActive = Boolean(snapshot.simulation);
  const warRoomActive = Boolean(snapshot.warRoom?.active);
  const twinActive = Boolean(snapshot.cognitiveTwin?.active);
  const advisorActive = Boolean(snapshot.advisor?.active);

  return [
    entry("scene", "ExecutiveSceneRuntime", moduleHealth(sceneActive, snapshot.sceneObjectCount < 3), sceneActive ? `objects:${snapshot.sceneObjectCount}` : null, []),
    entry("camera", "ExecutiveCameraRuntime", moduleHealth(cameraActive, !snapshot.cameraPreset && sceneActive), snapshot.cameraPreset, ["scene"]),
    entry("timeline", "TimelineIntelligenceRuntime", moduleHealth(timelineActive, false), timelineActive ? `events:${snapshot.timelineEventCount}` : null, ["scene"]),
    entry(
      "scenario_playback",
      "ExecutiveScenarioPlaybackRuntime",
      moduleHealth(playbackActive || timelineActive, snapshot.playback?.status === "paused"),
      snapshot.playback?.signature ?? null,
      ["timeline", "simulation"]
    ),
    entry(
      "scenario_universe",
      "ExecutiveMultiScenarioUniverseRuntime",
      moduleHealth(universeActive, false),
      snapshot.universe?.signature ?? null,
      ["simulation"]
    ),
    entry(
      "simulation",
      "TypeCScenarioSimulationRuntime",
      moduleHealth(simulationActive, snapshot.simulation?.riskLevel === "high"),
      snapshot.simulation?.scenarioId ?? null,
      ["scene"]
    ),
    entry(
      "war_room",
      "ExecutiveWarRoomRuntime",
      moduleHealth(warRoomActive, snapshot.warRoom?.statusLevel === "critical"),
      snapshot.warRoom?.signature ?? null,
      ["cognitive_twin", "timeline", "simulation"]
    ),
    entry(
      "cognitive_twin",
      "ExecutiveCognitiveTwinRuntime",
      moduleHealth(twinActive, (snapshot.cognitiveTwin?.scores.enterpriseHealthScore ?? 1) < 0.45),
      snapshot.cognitiveTwin?.signature ?? null,
      ["scene", "simulation", "timeline"]
    ),
    entry(
      "advisor",
      "ExecutiveAdvisorRuntime",
      moduleHealth(advisorActive, (snapshot.advisor?.hud.calibratedConfidence ?? 1) < 0.35),
      snapshot.advisor?.signature ?? null,
      ["cognitive_twin", "war_room"]
    ),
  ];
}
