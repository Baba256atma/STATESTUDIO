/** WS-8:3 — Canonical descriptive War Room relationships. */
import { WarRoomWorkspaceRegistry } from "./warRoomWorkspaceRegistry.ts";

const definitions = Object.freeze([
  ["Workspace", "declares", "Operational Status"],
  ["Workspace", "contains", "Executive Event"],
  ["Workspace", "contains", "Executive Alert"],
  ["Workspace", "contains", "Executive Incident"],
  ["Workspace", "contains", "Executive Activity"],
  ["Workspace", "declares", "Operational Coordination"],
  ["Workspace", "prepares", "Executive Response"],
  ["Workspace", "declares", "Executive Monitoring"],
  ["Workspace", "declares", "Executive Collaboration"],
  ["Workspace", "prepares", "Value Input"],
  ["Workspace", "prepares", "Timeline Input"],
  ["Workspace", "participates in", "Lifecycle"],
] as const);

export const WarRoomWorkspaceRelationshipModels = Object.freeze(
  definitions.map(
    ([sourceModel, relationshipType, targetModel], index) =>
      Object.freeze({
        id: `WS-8:3/Relationship/${String(index + 1).padStart(2, "0")}`,
        identity:
          `WS-8:3/Relationship/${String(index + 1).padStart(2, "0")}`,
        name: `${sourceModel} ${relationshipType} ${targetModel}`,
        sourceModel,
        targetModel,
        relationshipType,
        relationshipMetadata: Object.freeze({
          descriptiveOnly: true,
          traversal: false,
          graphExecution: false,
        }),
        source: WarRoomWorkspaceRegistry,
        order: index + 1,
        executable: false,
        metadataOnly: true,
        immutable: true,
      }),
  ),
);
