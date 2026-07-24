/** WS-2:5 — Architectural capability declarations. */
import { ExecutiveHomeWorkspaceValidation } from "./executiveHomeWorkspaceValidation.ts";
const names = Object.freeze(["Executive Overview Hosting", "Executive Summary Reference",
  "Dashboard Reference", "Workspace Launcher", "Quick Action Surface",
  "Executive Card Collection", "Recent Activity Reference", "Notification Reference",
  "Recommendation Reference", "Favorite Workspace Reference", "Executive Status Reference",
  "Context Awareness", "Session Awareness", "Permission Awareness", "Configuration Awareness",
  "Workspace Switching Readiness", "Collaboration Readiness"] as const);
export const ExecutiveHomeWorkspaceManifestCapabilities = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-2:5/Capability/${String(index + 1).padStart(2, "0")}`, name,
  description: `Publishes ${name.toLowerCase()} as an architectural capability.`,
  source: ExecutiveHomeWorkspaceValidation, status: "Satisfied",
  metadataOnly: true, immutable: true,
})));

