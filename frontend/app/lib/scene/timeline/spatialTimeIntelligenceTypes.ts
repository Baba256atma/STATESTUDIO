/**
 * E2:94 — Spatial time intelligence contracts for timeline-to-scene anchoring.
 */

import type { TimelineEvent, TimelineEventStatus } from "../executiveTimelineHudTypes";

export type TimelineEventSeverity = "info" | "watch" | "warning" | "critical";

export type TimelineEventSpatialStatus = "planned" | "active" | "completed" | "blocked" | "simulated";

export type TimelineSpatialAnchorKind = "object" | "cluster" | "global" | "relationship" | "scenario";

export type TimelineSpatialMarkerType =
  | "decision"
  | "risk"
  | "scenario"
  | "operational"
  | "recovery";

export type SpatialTimelineEventAnchor = {
  eventId: string;
  title: string;
  kind: TimelineSpatialAnchorKind;
  markerType: TimelineSpatialMarkerType;
  objectId?: string | null;
  objectIds?: readonly string[];
  clusterId?: string | null;
  scenarioId?: string | null;
  relationshipId?: string | null;
  riskId?: string | null;
  decisionId?: string | null;
  tick?: number | null;
  snapshotId?: string | null;
  position?: [number, number, number] | null;
  severity: TimelineEventSeverity;
  spatialStatus: TimelineEventSpatialStatus;
  narrativeSummary?: string;
  timestampIso?: string;
  timestamp?: string;
  eventStatus: TimelineEventStatus;
};

export type SpatialTimelineActiveSummary = {
  eventId: string;
  title: string;
  timestampLabel: string;
  affectedObjectLabel: string | null;
  severity: TimelineEventSeverity;
  summary: string;
  markerType: TimelineSpatialMarkerType;
};

export type SpatialTimeIntelligenceState = {
  signature: string;
  anchors: SpatialTimelineEventAnchor[];
  selectedEventId: string | null;
  hoveredEventId: string | null;
  activeEventId: string | null;
  focusModeEventId: string | null;
  scenarioStepIndex: number | null;
  activeSummary: SpatialTimelineActiveSummary | null;
  visibleAnchorIds: readonly string[];
};

export type TimelineSpatialInteractionState = {
  selectedEventId: string | null;
  hoveredEventId: string | null;
  focusModeEventId: string | null;
  scenarioStepIndex: number | null;
};

export type BuildSpatialTimeIntelligenceInput = {
  events: readonly TimelineEvent[];
  sceneObjects: readonly { id: string; label?: string | null; position?: unknown }[];
  clusterIdsByObjectId?: Readonly<Record<string, string>>;
  interaction?: TimelineSpatialInteractionState;
  viewMode?: "2D" | "3D" | string | null;
};

export type TimelineSpatialObjectSelection = {
  highlighted_objects?: string[];
  risk_sources?: string[];
  risk_targets?: string[];
  dim_unrelated_objects?: boolean;
};
