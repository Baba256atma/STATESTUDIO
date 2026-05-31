/** E2:55 — Canonical executive overlay ownership (one information, one owner). */

import type { SceneOverlayId } from "./sceneOverlayPriority";

export type ExecutiveOverlayOwner =
  | "SCENE_INFO"
  | "OBJECT_INFO"
  | "TIMELINE"
  | "SCENARIO"
  | "DECISION"
  | "AI_ASSISTANT"
  | "TOOLBAR"
  | "TRANSIENT";

export type ExecutiveInformationTopic =
  | "system_health"
  | "system_monitoring"
  | "object_health"
  | "object_metadata"
  | "scenario_evaluation"
  | "decision_recommendation"
  | "timeline_history"
  | "navigation_controls"
  | "pipeline_processing"
  | "orientation_guidance"
  | "empty_state_guidance";

export const EXECUTIVE_OVERLAY_OWNERS: Record<SceneOverlayId, ExecutiveOverlayOwner> = {
  sceneInfoHud: "SCENE_INFO",
  objectInfoHud: "OBJECT_INFO",
  timelineHud: "TIMELINE",
  executiveSceneToolbar: "TOOLBAR",
  executiveStatusHud: "SCENE_INFO",
  executiveOrientationPanel: "TRANSIENT",
  executiveOrientationWelcome: "TRANSIENT",
  pipelineStatusHud: "SCENE_INFO",
  executiveSceneOperationalStrip: "SCENE_INFO",
  quickActionsDock: "AI_ASSISTANT",
  typeCExecutiveSummaryCard: "DECISION",
  scenarioOverlay: "SCENARIO",
  propagationOverlay: "SCENARIO",
  riskFlowOverlay: "SCENARIO",
  dependencyOverlay: "SCENARIO",
  analysisHandoffBanner: "DECISION",
  centerHelperCopy: "TRANSIENT",
  gettingStartedHelper: "TRANSIENT",
  objectInfoEmptyPlaceholder: "OBJECT_INFO",
};

export const EXECUTIVE_TOPIC_OWNERS: Record<ExecutiveInformationTopic, ExecutiveOverlayOwner> = {
  system_health: "SCENE_INFO",
  system_monitoring: "SCENE_INFO",
  object_health: "OBJECT_INFO",
  object_metadata: "OBJECT_INFO",
  scenario_evaluation: "SCENARIO",
  decision_recommendation: "DECISION",
  timeline_history: "TIMELINE",
  navigation_controls: "TOOLBAR",
  pipeline_processing: "SCENE_INFO",
  orientation_guidance: "TRANSIENT",
  empty_state_guidance: "TRANSIENT",
};

export function getExecutiveOverlayOwner(overlayId: SceneOverlayId): ExecutiveOverlayOwner {
  return EXECUTIVE_OVERLAY_OWNERS[overlayId];
}

export function getExecutiveTopicOwner(topic: ExecutiveInformationTopic): ExecutiveOverlayOwner {
  return EXECUTIVE_TOPIC_OWNERS[topic];
}

export function overlayOwnsTopic(overlayId: SceneOverlayId, topic: ExecutiveInformationTopic): boolean {
  return getExecutiveOverlayOwner(overlayId) === getExecutiveTopicOwner(topic);
}
