import type { NexoraRelationship } from "./relationshipTypes.ts";
import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceViewMode } from "../workspace/workspaceViewModeTypes.ts";

function isRenderableNexoraRelationship(value: unknown): value is NexoraRelationship {
  if (!value || typeof value !== "object") return false;
  const rel = value as NexoraRelationship;
  return (
    typeof rel.id === "string" &&
    typeof rel.sourceId === "string" &&
    typeof rel.targetId === "string" &&
    typeof rel.type === "string" &&
    (rel.direction === "uni" || rel.direction === "bi") &&
    typeof rel.createdAt === "string"
  );
}

export type ExecutiveRelationshipGraphicsProfile = {
  profile: string;
  lineOpacityMul: number;
  pulseEnabled: boolean;
  directionCue: boolean;
};

export const DEFAULT_EXECUTIVE_RELATIONSHIP_GRAPHICS_PROFILE: ExecutiveRelationshipGraphicsProfile =
  Object.freeze({
    profile: "spatial_network",
    lineOpacityMul: 1,
    pulseEnabled: false,
    directionCue: false,
  });

const emittedDiagnosticKeys = new Set<string>();

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function logRelationshipRendererDiagnostic(
  label: string,
  payload?: Record<string, unknown>
): void {
  if (!isDev()) return;
  const key = `${label}:${JSON.stringify(payload ?? {})}`;
  if (emittedDiagnosticKeys.has(key)) return;
  emittedDiagnosticKeys.add(key);
  devDiagnosticLog("relationshipRenderer", `[RelationshipRenderer] ${label}`, payload);
}

export function resolveSafeExecutiveRelationshipGraphicsProfile(
  viewMode?: WorkspaceViewMode | null
): ExecutiveRelationshipGraphicsProfile {
  if (viewMode === "2D") {
    return Object.freeze({
      profile: "topology_first",
      lineOpacityMul: 1.12,
      pulseEnabled: false,
      directionCue: true,
    });
  }
  if (viewMode === "3D") {
    return Object.freeze({
      profile: "spatial_network",
      lineOpacityMul: 0.96,
      pulseEnabled: true,
      directionCue: true,
    });
  }

  logRelationshipRendererDiagnostic("Graphics Profile Missing", { viewMode: viewMode ?? null });
  return DEFAULT_EXECUTIVE_RELATIONSHIP_GRAPHICS_PROFILE;
}

export type RelationshipRenderValidation = {
  valid: boolean;
  errors: string[];
};

export function validateRelationshipForRender(
  relationship: unknown,
  validObjectIds?: ReadonlySet<string>
): RelationshipRenderValidation {
  if (!isRenderableNexoraRelationship(relationship)) {
    return { valid: false, errors: ["invalid_contract"] };
  }

  const errors: string[] = [];
  const sourceObjectId = String(relationship.sourceId ?? "").trim();
  const targetObjectId = String(relationship.targetId ?? "").trim();
  const relationshipType = String(relationship.type ?? "").trim();

  if (!sourceObjectId) errors.push("missing_source_object_id");
  if (!targetObjectId) errors.push("missing_target_object_id");
  if (!relationshipType) errors.push("missing_relationship_type");
  if (sourceObjectId && targetObjectId && sourceObjectId === targetObjectId) {
    errors.push("self_link");
  }

  const confidenceRaw = relationship.metadata?.confidence;
  if (confidenceRaw !== undefined && (typeof confidenceRaw !== "number" || !Number.isFinite(confidenceRaw))) {
    errors.push("invalid_confidence");
  }

  if (validObjectIds) {
    if (sourceObjectId && !validObjectIds.has(sourceObjectId)) errors.push("unknown_source_object");
    if (targetObjectId && !validObjectIds.has(targetObjectId)) errors.push("unknown_target_object");
  }

  return { valid: errors.length === 0, errors };
}

export function readValidatedSceneRelationshipsForRender(
  sceneJson: unknown,
  objects: readonly { id?: unknown }[]
): NexoraRelationship[] {
  const raw = (() => {
    if (!sceneJson || typeof sceneJson !== "object") return [];
    const scene = (sceneJson as { scene?: { relationships?: unknown } }).scene;
    const relationships = scene?.relationships;
    return Array.isArray(relationships) ? relationships : [];
  })();

  const validObjectIds = new Set(
    objects
      .map((object) => String(object?.id ?? "").trim())
      .filter(Boolean)
  );

  const validated: NexoraRelationship[] = [];
  for (const relationship of raw) {
    const result = validateRelationshipForRender(relationship, validObjectIds);
    if (!result.valid || !isRenderableNexoraRelationship(relationship)) {
      logRelationshipRendererDiagnostic("Invalid Relationship", {
        relationshipId: String((relationship as NexoraRelationship | null)?.id ?? ""),
        errors: result.errors,
      });
      logRelationshipRendererDiagnostic("Relationship Skipped", {
        relationshipId: String((relationship as NexoraRelationship | null)?.id ?? ""),
        reason: result.errors[0] ?? "invalid_contract",
      });
      continue;
    }
    validated.push(relationship);
    logRelationshipRendererDiagnostic("Relationship Loaded", {
      relationshipId: relationship.id,
      sourceObjectId: relationship.sourceId,
      targetObjectId: relationship.targetId,
      relationshipType: relationship.type,
    });
  }

  return validated;
}

export function areRelationshipLinePointsValid(
  points: readonly (readonly [number, number, number])[]
): boolean {
  if (!Array.isArray(points) || points.length < 2) return false;
  return points.every(
    (point) =>
      Array.isArray(point) &&
      point.length >= 3 &&
      Number.isFinite(point[0]) &&
      Number.isFinite(point[1]) &&
      Number.isFinite(point[2])
  );
}

export function logRelationshipPulseDisabled(reason: string, relationshipId?: string): void {
  logRelationshipRendererDiagnostic("Pulse Disabled", {
    relationshipId: relationshipId ?? null,
    reason,
  });
}

export function resetRelationshipRendererRuntimeForTests(): void {
  emittedDiagnosticKeys.clear();
}
