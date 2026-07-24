/** WS-3:3 — Canonical structural relationships. */
import { GoalWorkspaceRegistry } from "./goalWorkspaceRegistry.ts";
const definitions = Object.freeze([
  ["Workspace", "contains", "Goals"], ["Goal", "owned by", "Owner"],
  ["Goal", "measured by", "KPI"], ["Goal", "references", "Timeline"],
  ["Goal", "supported by", "Assumption"], ["Goal", "limited by", "Constraint"],
  ["Goal", "threatened by", "Risk"], ["Goal", "described by", "Metadata"],
  ["Goal", "participates in", "Lifecycle"], ["Goal", "belongs to", "Context"],
  ["Goal Collection", "contains", "Goal"], ["Workspace", "owns", "Goal Collection"],
] as const);
export const GoalWorkspaceRelationshipModels = Object.freeze(definitions.map(
  ([sourceKind, relation, targetKind], index) => Object.freeze({
    id: `WS-3:3/Relationship/${String(index + 1).padStart(2, "0")}`,
    name: `${sourceKind} ${relation} ${targetKind}`,
    sourceKind, relation, targetKind, source: GoalWorkspaceRegistry,
    executable: false, metadataOnly: true, immutable: true,
  }),
));

