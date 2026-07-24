/** WS-2:2 — Canonical categories preserving Foundation references. */
import { ExecutiveHomeWorkspaceFoundation } from "./executiveHomeWorkspaceFoundation.ts";
import type { ExecutiveHomeCategoryRecord } from "./executiveHomeWorkspaceRegistryTypes.ts";
const names = Object.freeze(["Executive Overview", "Executive Summary", "Dashboard",
  "Workspace Launcher", "Quick Actions", "Recent Activity", "Notifications",
  "Recommendations", "Favorite Workspaces", "Executive Status"] as const);
const purposes = Object.freeze(["Orient the executive", "Reference executive summaries",
  "Reference dashboards", "Reference specialized Workspace launch targets",
  "Declare quick actions", "Reference recent activity", "Reference notifications",
  "Reference recommendations", "Reference favorite Workspaces", "Reference executive status"] as const);
export const ExecutiveHomeWorkspaceCategoryRegistry = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-2:2/Category/${String(index + 1).padStart(2, "0")}`,
  key: `category-${name.toLowerCase().replaceAll(" ", "-")}`, name,
  description: `Registers ${name} as an Executive Home category.`,
  registryCategory: "Category", sourcePhase: "WS-2:1",
  source: ExecutiveHomeWorkspaceFoundation.categories[index],
  category: name, purpose: purposes[index], visibility: "Executive",
  lifecycleAvailability: ExecutiveHomeWorkspaceFoundation.lifecycle,
  version: "1.0.0", stability: "Stable", ownership: "Executive Home Workspace",
  extensionPolicy: "Additive", metadataOnly: true, immutable: true,
})) satisfies readonly ExecutiveHomeCategoryRecord[]);

