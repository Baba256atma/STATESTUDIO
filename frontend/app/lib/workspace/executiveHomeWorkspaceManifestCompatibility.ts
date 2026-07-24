/** WS-2:5 — Compatibility and controlled extension declarations. */
import { ExecutiveHomeWorkspaceValidation } from "./executiveHomeWorkspaceValidation.ts";
const compatibilityNames = Object.freeze(["Workspace Layer", "Executive Home UI",
  "Executive Home Runtime", "Goal Workspace", "Problem Workspace", "Decision Workspace",
  "Scenario Workspace", "Strategy Workspace", "Risk Workspace", "Knowledge Workspace",
  "Organization Workspace", "Dashboard Workspace", "Assistant", "Director", "EVE",
  "Engine", "DKL", "NEA"] as const);
const extensionNames = Object.freeze(["Executive Cards", "Dashboard References", "Quick Actions",
  "Workspace Launch Entries", "Favorite Workspace References", "Notification References",
  "Recommendation References", "Context References", "Configuration Extensions",
  "Permission References"] as const);
export const ExecutiveHomeWorkspaceManifestCompatibility = Object.freeze(
  compatibilityNames.map((name, index) => Object.freeze({
    id: `WS-2:5/Compatibility/${String(index + 1).padStart(2, "0")}`, name,
    description: `Declares architecture-only compatibility with ${name}.`,
    source: ExecutiveHomeWorkspaceValidation, status: "Compatible",
    metadataOnly: true, immutable: true,
  })),
);
export const ExecutiveHomeWorkspaceManifestExtensions = Object.freeze(
  extensionNames.map((name, index) => Object.freeze({
    id: `WS-2:5/Extension/${String(index + 1).padStart(2, "0")}`, name,
    description: `${name} extensions must preserve identity and validation compliance.`,
    source: ExecutiveHomeWorkspaceValidation, status: "Controlled",
    metadataOnly: true, immutable: true,
  })),
);

