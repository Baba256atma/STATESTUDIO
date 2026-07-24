/** WS-3:6 — Controlled future extension declarations. */
import { GoalWorkspaceManifest } from "./goalWorkspaceManifest.ts";
const names = Object.freeze(["Goal Type Extensions", "Goal Metadata Extensions",
  "Capability Extensions", "Contract Extensions", "Model Extensions",
  "Relationship Extensions", "Composition Extensions", "Compatibility Extensions",
  "Public API Extensions", "Future Phase Extensions"] as const);
export const GoalWorkspacePlatformExtensions = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-3:6/Extension/${String(index + 1).padStart(2, "0")}`, name,
  description: `${name} may extend functionality without modifying canonical Platform metadata.`,
  compatibilityImpact: "Additive Only", extensionScope: "Future controlled phase or version",
  source: GoalWorkspaceManifest, state: "Extensible", order: index + 1,
  metadataOnly: true, immutable: true,
})));

