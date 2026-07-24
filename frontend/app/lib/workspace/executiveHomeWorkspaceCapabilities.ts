/** WS-2:1 — Declared Executive Home capabilities; none execute. */
import type { ExecutiveHomeDeclaration } from "./executiveHomeWorkspaceFoundationTypes.ts";
const names = Object.freeze(["Executive Overview Hosting", "Workspace Launch Coordination",
  "Recent Activity Referencing", "Executive Summary Referencing", "Dashboard Referencing",
  "Quick Action Hosting", "Favorite Workspace Hosting", "Notification Referencing",
  "Recommendation Referencing", "Context Awareness", "Workspace Switching Readiness",
  "Session Awareness", "Permission Awareness", "Configuration Awareness",
  "Collaboration Readiness"] as const);
export const ExecutiveHomeWorkspaceCapabilities = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-2:1/Capability/${String(index + 1).padStart(2, "0")}`, name,
  description: `Declares ${name.toLowerCase()} as architecture metadata.`,
  executable: false, metadataOnly: true, immutable: true,
})) satisfies readonly ExecutiveHomeDeclaration[]);

