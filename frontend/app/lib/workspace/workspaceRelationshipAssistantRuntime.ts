import type { RouterResult } from "../decision/decisionRouter.ts";
import type { WorkspaceDiscoveredRelationship } from "./workspaceRelationshipDiscoveryContract.ts";

function normalizeInput(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

function explanationAction(): RouterResult["actions"] {
  return [{ type: "WORKSPACE_RELATIONSHIP_EXPLAIN", target: "workspace" }];
}

function relationshipTypeLabel(type: WorkspaceDiscoveredRelationship["relationshipType"]): string {
  switch (type) {
    case "depends_on":
      return "depends on";
    case "feeds":
      return "feeds";
    case "constrains":
      return "constrains";
    case "supports":
      return "supports";
    case "influences":
    default:
      return "influences";
  }
}

function formatRelationshipExplanation(relationship: WorkspaceDiscoveredRelationship): string {
  return `${relationship.sourceObjectName} ${relationshipTypeLabel(relationship.relationshipType)} ${relationship.targetObjectName} because ${relationship.reason}`;
}

function isRelationshipQuestion(text: string): boolean {
  return (
    text.includes("why are these objects connected") ||
    text.includes("why are these connected") ||
    text.includes("why are the objects connected") ||
    text.includes("explain the relationships") ||
    text.includes("explain these relationships") ||
    text.includes("how are these objects connected") ||
    text.includes("why is") && text.includes("connected")
  );
}

export function resolveWorkspaceRelationshipQuestion(
  input: string,
  relationships: readonly WorkspaceDiscoveredRelationship[]
): RouterResult | null {
  const text = normalizeInput(input);
  if (!text || relationships.length === 0) return null;

  if (isRelationshipQuestion(text)) {
    const lines = relationships.slice(0, 6).map(formatRelationshipExplanation);
    const remainder = relationships.length > lines.length ? `\n…and ${relationships.length - lines.length} more.` : "";
    return {
      assistantReply: `This workspace has ${relationships.length} discovered relationship${relationships.length === 1 ? "" : "s"}:\n${lines.join("\n")}${remainder}`,
      actions: explanationAction(),
    };
  }

  const matched = relationships.find((relationship) => {
    const source = relationship.sourceObjectName.toLowerCase();
    const target = relationship.targetObjectName.toLowerCase();
    return text.includes(source) && text.includes(target);
  });

  if (matched && (text.includes("why") || text.includes("explain") || text.includes("connected"))) {
    return {
      assistantReply: formatRelationshipExplanation(matched),
      actions: explanationAction(),
    };
  }

  if (text.includes("how many relationships") || text.includes("relationship count")) {
    return {
      assistantReply: `This workspace currently has ${relationships.length} discovered relationships between approved objects.`,
      actions: explanationAction(),
    };
  }

  return null;
}

export function buildWorkspaceRelationshipAssistantSummary(
  objectCount: number,
  relationships: readonly WorkspaceDiscoveredRelationship[]
): string {
  if (relationships.length === 0) {
    return objectCount > 0
      ? `Objects: ${objectCount}. Relationships: 0.`
      : "No approved workspace objects yet.";
  }
  const preview = relationships
    .slice(0, 2)
    .map((relationship) => `${relationship.sourceObjectName} → ${relationship.targetObjectName}`)
    .join("; ");
  return `Objects: ${objectCount}. Relationships: ${relationships.length}. ${preview}.`;
}
