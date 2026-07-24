/** WS-3:6 — Immutable compatibility declarations. */
import { GoalWorkspaceManifest } from "./goalWorkspaceManifest.ts";
const names = Object.freeze(["Workspace Layer Architecture", "Foundation", "Registry", "Model",
  "Validation", "Manifest", "Canonical Namespace", "Public API Conventions",
  "TypeScript Strict Mode", "ESLint Compliance", "Freeze Architecture Requirements",
  "Public Index Requirements"] as const);
export const GoalWorkspacePlatformCompatibility = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-3:6/Compatibility/${String(index + 1).padStart(2, "0")}`, name,
  description: `Declares compatibility with ${name}.`, source: GoalWorkspaceManifest,
  state: "Compatible", order: index + 1, metadataOnly: true, immutable: true,
})));

