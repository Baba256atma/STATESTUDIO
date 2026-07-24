/** WS-1:6 — Manifest-backed compatibility surface. */
import { WorkspaceManifest } from "./workspaceManifest.ts";
const names = Object.freeze(["Workspace UI Consumers", "Workspace Runtime Consumers",
  "Executive Home Workspace", "Goal Workspace", "Problem Workspace", "Decision Workspace",
  "Scenario Workspace", "Strategy Workspace", "Risk Workspace", "Organization Workspace",
  "Knowledge Workspace", "Dashboard Workspace", "Custom Workspace Implementations",
  "Assistant Integration", "Director Integration", "EVE Integration", "Engine Integration",
  "DKL Integration", "NEA Integration"] as const);
export const WorkspacePlatformCompatibility = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-1:6/Compatibility/${String(index + 1).padStart(2, "0")}`, name,
  description: `Declares architecture-only compatibility for ${name}.`,
  source: WorkspaceManifest, metadataOnly: true, immutable: true,
})));

