import { getRelationshipTypeDefinition } from "./relationshipRegistry";
import type {
  NexoraRelationship,
  RelationshipCreateRequest,
  RelationshipValidationResult,
} from "./relationshipTypes";

function normalizeId(value: unknown): string {
  return String(value ?? "").trim();
}

export function relationshipSignature(
  sourceId: string,
  targetId: string,
  type: NexoraRelationship["type"],
  direction: NexoraRelationship["direction"]
): string {
  const a = normalizeId(sourceId);
  const b = normalizeId(targetId);
  if (direction === "bi") {
    const sorted = [a, b].sort();
    return `${type}:bi:${sorted[0]}:${sorted[1]}`;
  }
  return `${type}:uni:${a}:${b}`;
}

export function validateRelationshipCreateRequest(
  request: RelationshipCreateRequest,
  existing: NexoraRelationship[],
  validObjectIds: Set<string>
): RelationshipValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const sourceId = normalizeId(request.sourceId);
  const targetId = normalizeId(request.targetId);
  const type = request.type;
  const direction = request.direction ?? getRelationshipTypeDefinition(type)?.defaultDirection ?? "uni";

  if (!sourceId) errors.push("missing_source");
  if (!targetId) errors.push("missing_target");
  if (!getRelationshipTypeDefinition(type)) errors.push("invalid_type");

  if (sourceId && targetId && sourceId === targetId) {
    errors.push("self_link");
  }

  if (sourceId && !validObjectIds.has(sourceId)) errors.push("invalid_source_object");
  if (targetId && !validObjectIds.has(targetId)) errors.push("invalid_target_object");

  if (sourceId && targetId && errors.length === 0) {
    const signature = relationshipSignature(sourceId, targetId, type, direction);
    const duplicate = existing.some(
      (rel) => relationshipSignature(rel.sourceId, rel.targetId, rel.type, rel.direction) === signature
    );
    if (duplicate) errors.push("duplicate_link");

    const reverseDuplicate =
      direction === "uni" &&
      existing.some(
        (rel) =>
          rel.type === type &&
          rel.direction === "uni" &&
          rel.sourceId === targetId &&
          rel.targetId === sourceId
      );
    if (reverseDuplicate) warnings.push("reverse_link_exists");
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function isNexoraRelationship(value: unknown): value is NexoraRelationship {
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
