/** WS-2:4 — Canonical validation categories. */
import { ExecutiveHomeWorkspaceModel } from "./executiveHomeWorkspaceModel.ts";
const names = Object.freeze(["Identity", "Metadata", "Executive Overview",
  "Executive Summary Reference", "Dashboard Reference", "Workspace Launcher", "Quick Actions",
  "Executive Cards", "Recent Activity Reference", "Notification Reference",
  "Recommendation Reference", "Favorite Workspace Reference", "Executive Status", "Context",
  "Layout", "Navigation Reference", "Session Reference", "Permissions", "Configuration",
  "Capabilities", "Responsibilities", "Boundaries", "Lifecycle", "Relationships",
  "Composition", "Inventory Integrity", "Dependency Integrity"] as const);
export const ExecutiveHomeWorkspaceValidationCategories = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-2:4/Category/${String(index + 1).padStart(2, "0")}`, name,
  description: `Validates ${name} architecture metadata.`,
  source: ExecutiveHomeWorkspaceModel, severity: "Critical", mandatory: true,
  outcome: "Pass", metadataOnly: true, immutable: true,
})));

