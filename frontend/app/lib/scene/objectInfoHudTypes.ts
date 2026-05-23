/**
 * E2:9 — Object Intelligence HUD contracts.
 */

import type { ExecutiveObjectPanelData } from "../panels/executiveObjectPanelData";
import type { ResolvedObjectDetails } from "./composeResolvedObjectDetails";
import { summarizeObjectRelationships } from "../relationships/relationshipRuntime";
import { getRelationshipTypeDefinition } from "../relationships/relationshipRegistry";
import type { NexoraRelationship } from "../relationships/relationshipTypes";
import type { SceneJson, Vector3Tuple } from "../sceneTypes";
import { vectorToPlacementPosition, type SceneObjectPlacement } from "../modeling/objectPlacementRuntime";
import { readEditableSceneObject, type EditableSceneObject } from "../modeling/objectEditingRuntime";
import { readPropagationPaths, type PropagationPath } from "../propagation/propagationAuthoringRuntime";

export type ObjectInfoHudQuickActionId = "analyze" | "simulate" | "compare" | "focus";

export const OBJECT_INFO_QUICK_ACTIONS: readonly { id: ObjectInfoHudQuickActionId; label: string }[] = [
  { id: "analyze", label: "Analyze" },
  { id: "simulate", label: "Simulate" },
  { id: "compare", label: "Compare" },
  { id: "focus", label: "Focus" },
] as const;

export type ObjectInfoHudModel = {
  selectedObjectId: string | null;
  selectedRelationshipId?: string | null;
  relationshipDetails?: {
    id: string;
    sourceObjectId: string;
    targetObjectId: string;
    relationshipType: string;
    sourceObject: string;
    targetObject: string;
    strength: number;
    description: string;
  } | null;
  selectedPropagationPathId?: string | null;
  propagationDetails?: {
    id: string;
    sourceObject: string;
    targetObject: string;
    propagationType: PropagationPath["propagationType"];
    strength: number;
    delayHours?: number;
    notes?: string;
  } | null;
  objectName?: string | null;
  objectType?: string | null;
  statusLabel?: string | null;
  statusTone?: "stable" | "elevated" | "high" | "critical" | "unknown";
  frsiScore?: number | null;
  riskLevel?: ExecutiveObjectPanelData["riskLevel"];
  healthLabel?: string | null;
  reliabilityLabel?: string | null;
  confidence?: number | null;
  executiveSummary?: string | null;
  signals?: string[];
  incomingRelationships?: string[];
  outgoingRelationships?: string[];
  relationshipCount?: number;
  position?: SceneObjectPlacement["position"] | null;
  editableObject?: EditableSceneObject | null;
};

export type BuildObjectInfoHudModelInput = {
  selectedObjectId: string | null;
  objectDetails?: ResolvedObjectDetails | null;
  executivePanelData?: ExecutiveObjectPanelData | null;
  sceneJson?: unknown;
  selectedRelationshipId?: string | null;
  selectedPropagationPathId?: string | null;
};

function clipLines(text: string | null | undefined, maxLen: number): string | null {
  const normalized = String(text ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return null;
  return normalized.length > maxLen ? `${normalized.slice(0, maxLen - 1).trimEnd()}…` : normalized;
}

function statusFromRisk(riskLevel: ExecutiveObjectPanelData["riskLevel"] | undefined): {
  label: string;
  tone: ObjectInfoHudModel["statusTone"];
} {
  switch (riskLevel) {
    case "critical":
      return { label: "Critical Risk", tone: "critical" };
    case "high":
      return { label: "High Risk", tone: "high" };
    case "medium":
      return { label: "Elevated", tone: "elevated" };
    case "low":
      return { label: "Stable", tone: "stable" };
    default:
      return { label: "Monitoring", tone: "unknown" };
  }
}

function healthFromRisk(riskLevel: ExecutiveObjectPanelData["riskLevel"] | undefined): string {
  switch (riskLevel) {
    case "critical":
    case "high":
      return "Strained";
    case "medium":
      return "Watch";
    case "low":
      return "Healthy";
    default:
      return "Unknown";
  }
}

function reliabilityFromConfidence(confidence: number | null | undefined): string {
  if (typeof confidence !== "number" || !Number.isFinite(confidence)) return "Pending";
  if (confidence >= 0.75) return "Strong";
  if (confidence >= 0.5) return "Moderate";
  return "Limited";
}

function collectSignals(
  details: ResolvedObjectDetails | null | undefined,
  executivePanelData: ExecutiveObjectPanelData | null | undefined
): string[] {
  const out: string[] = [];
  const push = (value: string | null | undefined) => {
    const next = String(value ?? "").trim();
    if (!next) return;
    if (out.some((entry) => entry.toLowerCase() === next.toLowerCase())) return;
    out.push(next);
  };

  push(details?.scanner_reason);
  if (Array.isArray(details?.tags)) {
    details.tags.slice(0, 3).forEach((tag) => push(tag));
  }
  if (Array.isArray(details?.relatedSignals)) {
    details.relatedSignals.slice(0, 3).forEach((signal) => push(signal));
  }
  if (executivePanelData?.riskLevel === "high" || executivePanelData?.riskLevel === "critical") {
    push("Resource pressure");
  }
  if (typeof details?.emphasis === "number" && details.emphasis >= 0.7) {
    push("Demand spike");
  }
  return out.slice(0, 4);
}

function resolveSelectedObjectPosition(sceneJson: unknown, selectedObjectId: string): SceneObjectPlacement["position"] | null {
  const objects = Array.isArray((sceneJson as SceneJson | null)?.scene?.objects)
    ? ((sceneJson as SceneJson).scene.objects as Array<{ id?: string; position?: Vector3Tuple; pos?: Vector3Tuple }>)
    : [];
  const object = objects.find((item) => String(item.id ?? "").trim() === selectedObjectId);
  if (!object) return null;
  return vectorToPlacementPosition(object.position ?? object.pos ?? [0, 0, 0]);
}

function buildRelationshipDetails(sceneJson: unknown, relationshipId: string | null | undefined): ObjectInfoHudModel["relationshipDetails"] {
  const id = relationshipId?.trim() || "";
  if (!id) return null;
  const scene = sceneJson as SceneJson | null;
  const relationships = Array.isArray(scene?.scene?.relationships)
    ? (scene?.scene?.relationships as NexoraRelationship[])
    : [];
  const relationship = relationships.find((item) => item.id === id);
  if (!relationship) return null;
  const labels = new Map<string, string>();
  (Array.isArray(scene?.scene?.objects) ? scene!.scene.objects : []).forEach((object) => {
    const objectId = String(object.id ?? "").trim();
    if (!objectId) return;
    labels.set(objectId, String(object.label ?? object.name ?? object.id ?? objectId));
  });
  const typeDef = getRelationshipTypeDefinition(relationship.type);
  return {
    id: relationship.id,
    sourceObjectId: relationship.sourceId,
    targetObjectId: relationship.targetId,
    relationshipType: typeDef?.label ?? relationship.type,
    sourceObject: labels.get(relationship.sourceId) ?? relationship.sourceId,
    targetObject: labels.get(relationship.targetId) ?? relationship.targetId,
    strength:
      typeof relationship.metadata?.strength === "number"
        ? Math.max(0, Math.min(1, relationship.metadata.strength))
        : 0.5,
    description:
      typeof relationship.metadata?.description === "string"
        ? relationship.metadata.description
        : typeDef?.description ?? "Executive system connection.",
  };
}

function buildObjectLabelMap(sceneJson: unknown): Map<string, string> {
  const scene = sceneJson as SceneJson | null;
  const labels = new Map<string, string>();
  (Array.isArray(scene?.scene?.objects) ? scene!.scene.objects : []).forEach((object) => {
    const objectId = String(object.id ?? "").trim();
    if (!objectId) return;
    labels.set(objectId, String(object.label ?? object.name ?? object.id ?? objectId));
  });
  return labels;
}

function buildPropagationDetails(sceneJson: unknown, pathId: string | null | undefined): ObjectInfoHudModel["propagationDetails"] {
  const id = pathId?.trim() || "";
  if (!id) return null;
  const path = readPropagationPaths(sceneJson).find((item) => item.id === id);
  if (!path) return null;
  const labels = buildObjectLabelMap(sceneJson);
  return {
    id: path.id,
    sourceObject: labels.get(path.sourceObjectId) ?? path.sourceObjectId,
    targetObject: labels.get(path.targetObjectId) ?? path.targetObjectId,
    propagationType: path.propagationType,
    strength: path.strength,
    delayHours: path.delayHours,
    notes: path.notes,
  };
}

export function buildObjectInfoHudModel(input: BuildObjectInfoHudModelInput): ObjectInfoHudModel {
  const selectedObjectId = input.selectedObjectId?.trim() || null;
  const relationshipDetails = buildRelationshipDetails(input.sceneJson, input.selectedRelationshipId);
  const propagationDetails = buildPropagationDetails(input.sceneJson, input.selectedPropagationPathId);
  if (!selectedObjectId) {
    return {
      selectedObjectId: null,
      selectedRelationshipId: relationshipDetails?.id ?? null,
      relationshipDetails,
      selectedPropagationPathId: propagationDetails?.id ?? null,
      propagationDetails,
      signals: [],
    };
  }

  const details = input.objectDetails ?? null;
  const executivePanelData = input.executivePanelData ?? null;
  const status = statusFromRisk(executivePanelData?.riskLevel);
  const confidence =
    typeof executivePanelData?.confidence === "number" && Number.isFinite(executivePanelData.confidence)
      ? executivePanelData.confidence
      : null;
  const frsiScore =
    typeof details?.emphasis === "number" && Number.isFinite(details.emphasis)
      ? Math.max(0, Math.min(1, details.emphasis))
      : confidence;

  const summary =
    clipLines(executivePanelData?.insight, 220) ??
    clipLines(details?.currentStatusSummary, 220) ??
    clipLines(details?.summary, 220) ??
    clipLines(details?.one_liner, 220);

  const relationshipSummary = summarizeObjectRelationships(input.sceneJson, selectedObjectId);
  const position = resolveSelectedObjectPosition(input.sceneJson, selectedObjectId);
  const editableObject = readEditableSceneObject(input.sceneJson, selectedObjectId);

  return {
    selectedObjectId,
    selectedRelationshipId: relationshipDetails?.id ?? null,
    relationshipDetails,
    selectedPropagationPathId: propagationDetails?.id ?? null,
    propagationDetails,
    objectName: editableObject?.name ?? details?.label ?? executivePanelData?.objectName ?? selectedObjectId,
    objectType: editableObject?.category ?? details?.type ?? details?.currentRole ?? "Object",
    statusLabel: status.label,
    statusTone: status.tone,
    frsiScore,
    riskLevel: executivePanelData?.riskLevel ?? "unknown",
    healthLabel: healthFromRisk(executivePanelData?.riskLevel),
    reliabilityLabel: reliabilityFromConfidence(confidence),
    confidence,
    executiveSummary: summary,
    signals: collectSignals(details, executivePanelData),
    incomingRelationships: relationshipSummary.incoming,
    outgoingRelationships: relationshipSummary.outgoing,
    relationshipCount: relationshipSummary.count,
    position,
    editableObject,
  };
}
