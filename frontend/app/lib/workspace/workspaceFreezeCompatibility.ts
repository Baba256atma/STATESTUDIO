/** WS-1:8 — Frozen compatibility declarations. */
import { WorkspaceCertification } from "./workspaceCertification.ts";
const names = Object.freeze(["Executive Home Workspace", "Goal Workspace", "Problem Workspace",
  "Decision Workspace", "Scenario Workspace", "Strategy Workspace", "Risk Workspace",
  "Organization Workspace", "Knowledge Workspace", "Dashboard Workspace", "Custom Workspace",
  "Workspace UI", "Workspace Runtime", "Assistant", "Director", "EVE", "Engine", "DKL", "NEA",
  "Integration Runtime"] as const);
export const WorkspaceFreezeCompatibility = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-1:8/Compatibility/${String(index + 1).padStart(2, "0")}`, name,
  source: WorkspaceCertification, state: "Frozen", metadataOnly: true, immutable: true,
})));

