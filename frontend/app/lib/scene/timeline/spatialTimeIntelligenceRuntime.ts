/**
 * E2:94 — Spatial time intelligence runtime: timeline events → scene anchors + selection.
 */

import type { TimelineEvent, TimelineEventStatus } from "../executiveTimelineHudTypes";
import { resolveTimelinePriority } from "../../timeline/timelinePriorityRuntime";
import {
  logE294RiskTimeline,
  logE294TimelineEventAnchored,
  logE294TimelineFocus,
} from "./spatialTimeIntelligenceDiagnostics";
import type {
  BuildSpatialTimeIntelligenceInput,
  SpatialTimelineActiveSummary,
  SpatialTimelineEventAnchor,
  SpatialTimeIntelligenceState,
  TimelineEventSeverity,
  TimelineEventSpatialStatus,
  TimelineSpatialAnchorKind,
  TimelineSpatialInteractionState,
  TimelineSpatialMarkerType,
  TimelineSpatialObjectSelection,
} from "./spatialTimeIntelligenceTypes";

const DEFAULT_INTERACTION: TimelineSpatialInteractionState = {
  selectedEventId: null,
  hoveredEventId: null,
  focusModeEventId: null,
  scenarioStepIndex: null,
};

function normalizeId(value: unknown): string | null {
  const next = String(value ?? "").trim();
  return next.length > 0 ? next : null;
}

function uniqueIds(values: readonly (string | null | undefined)[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const id = normalizeId(value);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    result.push(id);
  }
  return result;
}

export function resolveTimelineEventMarkerType(event: TimelineEvent): TimelineSpatialMarkerType {
  const explicit = event.markerType;
  if (explicit) return explicit;
  const title = event.title.toLowerCase();
  if (title.includes("risk") || title.includes("delay") || title.includes("fragility")) return "risk";
  if (title.includes("scenario") || title.includes("simulated") || title.includes("what-if")) return "scenario";
  if (title.includes("decision") || title.includes("approved") || title.includes("accepted")) return "decision";
  if (title.includes("recovery") || title.includes("stabiliz")) return "recovery";
  return "operational";
}

export function resolveTimelineEventSeverity(event: TimelineEvent): TimelineEventSeverity {
  if (event.severity) return event.severity;
  const priority = resolveTimelinePriority(event);
  if (priority === "CRITICAL") return "critical";
  if (priority === "IMPORTANT") return "warning";
  if (priority === "BACKGROUND") return "info";
  const title = event.title.toLowerCase();
  if (title.includes("risk") || title.includes("delay")) return "warning";
  return "watch";
}

export function resolveTimelineSpatialStatus(event: TimelineEvent): TimelineEventSpatialStatus {
  if (event.spatialStatus) return event.spatialStatus;
  if (event.status === "active") return "active";
  if (event.status === "pending") return "planned";
  const title = event.title.toLowerCase();
  if (title.includes("simulated") || title.includes("scenario")) return "simulated";
  if (event.status === "completed") return "completed";
  return "planned";
}

function readObjectLabel(object: { id: string; label?: string | null }): string {
  return String(object.label ?? object.id).trim().toLowerCase();
}

function inferObjectIdsFromEvent(
  event: TimelineEvent,
  sceneObjects: BuildSpatialTimeIntelligenceInput["sceneObjects"]
): string[] {
  const explicit = uniqueIds([
    ...(event.relatedObjectIds ?? []),
    event.spatialAnchor?.objectId,
    ...(event.spatialAnchor?.objectIds ?? []),
  ]);
  if (explicit.length > 0) return explicit.filter((id) => sceneObjects.some((obj) => obj.id === id));

  const title = event.title.toLowerCase();
  const keywordMatches: string[] = [];
  for (const object of sceneObjects) {
    const label = readObjectLabel(object);
    const id = object.id.toLowerCase();
    if (title.includes("supplier") && (label.includes("supplier") || id.includes("supplier"))) {
      keywordMatches.push(object.id);
      continue;
    }
    if (title.includes("inventory") && (label.includes("inventory") || id.includes("inventory"))) {
      keywordMatches.push(object.id);
      continue;
    }
    if (title.includes("delivery") && (label.includes("delivery") || id.includes("delivery"))) {
      keywordMatches.push(object.id);
      continue;
    }
    if (title.includes("customer") && (label.includes("customer") || id.includes("customer"))) {
      keywordMatches.push(object.id);
      continue;
    }
    if (title.includes("risk") && (label.includes("risk") || id.includes("risk"))) {
      keywordMatches.push(object.id);
    }
  }
  return uniqueIds(keywordMatches);
}

function resolveAnchorKind(input: {
  event: TimelineEvent;
  objectIds: string[];
  clusterIdsByObjectId?: Readonly<Record<string, string>>;
}): { kind: TimelineSpatialAnchorKind; clusterId: string | null; objectId: string | null } {
  if (input.event.spatialAnchor?.kind === "global") {
    return { kind: "global", clusterId: null, objectId: null };
  }
  if (input.event.spatialAnchor?.kind === "cluster" && input.event.spatialAnchor.clusterId) {
    return {
      kind: "cluster",
      clusterId: input.event.spatialAnchor.clusterId,
      objectId: input.objectIds[0] ?? null,
    };
  }
  if (input.objectIds.length === 1) {
    return { kind: "object", clusterId: null, objectId: input.objectIds[0] ?? null };
  }
  if (input.objectIds.length > 1) {
    const clusterId =
      input.event.spatialAnchor?.clusterId ??
      input.clusterIdsByObjectId?.[input.objectIds[0] ?? ""] ??
      `cluster:${input.objectIds.slice(0, 3).join("+")}`;
    return { kind: "cluster", clusterId, objectId: input.objectIds[0] ?? null };
  }
  if (input.event.scenarioId || input.event.spatialAnchor?.scenarioId) {
    return { kind: "scenario", clusterId: null, objectId: null };
  }
  return { kind: "global", clusterId: null, objectId: null };
}

function readObjectPosition(object: { position?: unknown }): [number, number, number] | null {
  const position = object.position;
  if (Array.isArray(position) && position.length >= 3) {
    const x = Number(position[0]);
    const y = Number(position[1]);
    const z = Number(position[2]);
    if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)) return [x, y, z];
  }
  if (position && typeof position === "object" && "x" in position && "y" in position && "z" in position) {
    const record = position as { x?: unknown; y?: unknown; z?: unknown };
    const x = Number(record.x);
    const y = Number(record.y);
    const z = Number(record.z);
    if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)) return [x, y, z];
  }
  return null;
}

export function resolveSpatialTimelineAnchor(
  event: TimelineEvent,
  input: Pick<BuildSpatialTimeIntelligenceInput, "sceneObjects" | "clusterIdsByObjectId">
): SpatialTimelineEventAnchor {
  const objectIds = inferObjectIdsFromEvent(event, input.sceneObjects);
  const anchorMeta = resolveAnchorKind({ event, objectIds, clusterIdsByObjectId: input.clusterIdsByObjectId });
  const primaryObject = anchorMeta.objectId
    ? input.sceneObjects.find((object) => object.id === anchorMeta.objectId) ?? null
    : null;
  const position = primaryObject ? readObjectPosition(primaryObject) : null;
  const markerType = resolveTimelineEventMarkerType(event);
  const severity = resolveTimelineEventSeverity(event);
  const spatialStatus = resolveTimelineSpatialStatus(event);

  return {
    eventId: event.id,
    title: event.title,
    kind: anchorMeta.kind,
    markerType,
    objectId: anchorMeta.objectId,
    objectIds,
    clusterId: anchorMeta.clusterId,
    scenarioId: event.scenarioId ?? event.spatialAnchor?.scenarioId ?? null,
    relationshipId: event.relationshipId ?? event.spatialAnchor?.relationshipId ?? null,
    riskId: event.riskId ?? null,
    decisionId: event.decisionId ?? event.id,
    tick: event.tick ?? null,
    snapshotId: event.snapshotId ?? null,
    position,
    severity,
    spatialStatus,
    narrativeSummary: event.narrativeSummary ?? event.summary ?? event.title,
    timestampIso: event.timestampIso,
    timestamp: event.timestamp,
    eventStatus: event.status,
  };
}

export function resolveSpatialTimelineAnchors(
  input: Pick<BuildSpatialTimeIntelligenceInput, "events" | "sceneObjects" | "clusterIdsByObjectId">
): SpatialTimelineEventAnchor[] {
  const anchors = input.events.map((event) => resolveSpatialTimelineAnchor(event, input));
  const signature = anchors
    .map((anchor) => `${anchor.eventId}:${anchor.kind}:${anchor.objectId ?? "none"}:${anchor.clusterId ?? "none"}`)
    .join("|");
  logE294TimelineEventAnchored(signature, {
    anchorCount: anchors.length,
    objectAnchors: anchors.filter((anchor) => anchor.kind === "object").length,
    clusterAnchors: anchors.filter((anchor) => anchor.kind === "cluster").length,
    globalAnchors: anchors.filter((anchor) => anchor.kind === "global").length,
  });
  return anchors;
}

export function buildSpatialTimeIntelligenceSignature(input: {
  events: readonly TimelineEvent[];
  interaction: TimelineSpatialInteractionState;
  viewMode?: string | null;
}): string {
  return [
    input.events.map((event) => `${event.id}:${event.status}:${(event.relatedObjectIds ?? []).join("+")}`).join(";"),
    input.interaction.selectedEventId ?? "",
    input.interaction.hoveredEventId ?? "",
    input.interaction.focusModeEventId ?? "",
    input.interaction.scenarioStepIndex ?? "",
    input.viewMode ?? "",
  ].join("::");
}

function resolveActiveEventId(
  events: readonly TimelineEvent[],
  interaction: TimelineSpatialInteractionState
): string | null {
  if (interaction.selectedEventId) return interaction.selectedEventId;
  if (interaction.scenarioStepIndex != null && events[interaction.scenarioStepIndex]) {
    return events[interaction.scenarioStepIndex]?.id ?? null;
  }
  return events.find((event) => event.status === "active")?.id ?? events[0]?.id ?? null;
}

export function buildTimelineActiveEventSummary(input: {
  anchor: SpatialTimelineEventAnchor | null;
  sceneObjects: BuildSpatialTimeIntelligenceInput["sceneObjects"];
}): SpatialTimelineActiveSummary | null {
  if (!input.anchor) return null;
  const objectLabel =
    input.anchor.objectId != null
      ? input.sceneObjects.find((object) => object.id === input.anchor?.objectId)?.label ??
        input.anchor.objectId
      : input.anchor.kind === "cluster"
        ? `Cluster ${input.anchor.clusterId ?? "group"}`
        : input.anchor.kind === "global"
          ? "System-wide"
          : null;
  return {
    eventId: input.anchor.eventId,
    title: input.anchor.title,
    timestampLabel: input.anchor.timestamp ?? input.anchor.timestampIso ?? "Recent",
    affectedObjectLabel: objectLabel ? String(objectLabel) : null,
    severity: input.anchor.severity,
    summary: input.anchor.narrativeSummary ?? input.anchor.title,
    markerType: input.anchor.markerType,
  };
}

export function buildSpatialTimeIntelligenceState(
  input: BuildSpatialTimeIntelligenceInput
): SpatialTimeIntelligenceState {
  const interaction = input.interaction ?? DEFAULT_INTERACTION;
  const anchors = resolveSpatialTimelineAnchors(input);
  const activeEventId = resolveActiveEventId(input.events, interaction);
  const focusEventId = interaction.focusModeEventId ?? interaction.selectedEventId ?? activeEventId;
  const focusAnchor = anchors.find((anchor) => anchor.eventId === focusEventId) ?? null;
  const activeSummary = buildTimelineActiveEventSummary({
    anchor: focusAnchor,
    sceneObjects: input.sceneObjects,
  });
  const visibleAnchorIds = anchors
    .filter((anchor) => anchor.kind !== "global" || anchor.severity === "critical" || anchor.eventStatus === "active")
    .map((anchor) => anchor.eventId);

  return {
    signature: buildSpatialTimeIntelligenceSignature({
      events: input.events,
      interaction,
      viewMode: input.viewMode,
    }),
    anchors,
    selectedEventId: interaction.selectedEventId,
    hoveredEventId: interaction.hoveredEventId,
    activeEventId,
    focusModeEventId: interaction.focusModeEventId,
    scenarioStepIndex: interaction.scenarioStepIndex,
    activeSummary,
    visibleAnchorIds,
  };
}

function findAnchor(
  anchors: readonly SpatialTimelineEventAnchor[],
  eventId: string | null | undefined
): SpatialTimelineEventAnchor | null {
  if (!eventId) return null;
  return anchors.find((anchor) => anchor.eventId === eventId) ?? null;
}

export function resolveTimelineSpatialObjectSelection(input: {
  state: SpatialTimeIntelligenceState;
}): TimelineSpatialObjectSelection | null {
  const targetId =
    input.state.focusModeEventId ??
    input.state.selectedEventId ??
    input.state.hoveredEventId ??
    input.state.activeEventId;
  const anchor = findAnchor(input.state.anchors, targetId);
  if (!anchor) return null;

  const highlighted = uniqueIds([
    ...(anchor.objectIds ?? []),
    anchor.objectId,
  ]);
  if (highlighted.length === 0 && anchor.kind === "global") return null;

  const selection: TimelineSpatialObjectSelection = {
    highlighted_objects: highlighted,
    dim_unrelated_objects:
      Boolean(input.state.focusModeEventId) ||
      Boolean(input.state.selectedEventId) ||
      anchor.severity === "critical" ||
      anchor.severity === "warning",
  };

  if (anchor.markerType === "risk" && highlighted.length >= 1) {
    selection.risk_sources = [highlighted[0]!];
    selection.risk_targets = highlighted.slice(1);
    logE294RiskTimeline(`${anchor.eventId}:${highlighted.join("->")}`, {
      eventId: anchor.eventId,
      sources: selection.risk_sources,
      targets: selection.risk_targets,
    });
  }

  logE294TimelineFocus(`${targetId}:${highlighted.join(",")}`, {
    eventId: anchor.eventId,
    kind: anchor.kind,
    highlighted,
    focusMode: Boolean(input.state.focusModeEventId),
  });

  return selection;
}

export function mergeTimelineSpatialObjectSelection(
  base: TimelineSpatialObjectSelection | null | undefined,
  overlay: TimelineSpatialObjectSelection | null | undefined
): TimelineSpatialObjectSelection | null {
  if (!overlay) return base ?? null;
  if (!base) return overlay;
  return {
    highlighted_objects: uniqueIds([
      ...(base.highlighted_objects ?? []),
      ...(overlay.highlighted_objects ?? []),
    ]),
    risk_sources: uniqueIds([...(base.risk_sources ?? []), ...(overlay.risk_sources ?? [])]),
    risk_targets: uniqueIds([...(base.risk_targets ?? []), ...(overlay.risk_targets ?? [])]),
    dim_unrelated_objects: base.dim_unrelated_objects === true || overlay.dim_unrelated_objects === true,
  };
}

export function resolveTimelineFocusObjectId(state: SpatialTimeIntelligenceState): string | null {
  const anchor = findAnchor(
    state.anchors,
    state.selectedEventId ?? state.activeEventId
  );
  return anchor?.objectId ?? anchor?.objectIds?.[0] ?? null;
}

export function mapTimelineStatusToSpatialStatus(status: TimelineEventStatus): TimelineEventSpatialStatus {
  if (status === "active") return "active";
  if (status === "pending") return "planned";
  return "completed";
}

export function resetSpatialTimeIntelligenceRuntimeForTests(): void {
  // diagnostics use signature guards; no module caches to reset here
}
