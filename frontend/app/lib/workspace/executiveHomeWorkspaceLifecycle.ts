/** WS-2:1 — Declarative lifecycle, categories, and canonical terminology. */
export const ExecutiveHomeWorkspaceLifecycle = Object.freeze([
  "Declared", "Registered", "Configured", "Initialized", "Active",
  "Suspended", "Restored", "Archived", "Retired",
] as const);

export const ExecutiveHomeWorkspaceCategories = Object.freeze([
  "Overview", "Summary", "Dashboard", "Quick Actions", "Recent Activity",
  "Notifications", "Recommendations", "Workspace Launcher", "Favorites", "Executive Status",
] as const);

export const ExecutiveHomeWorkspaceTerminology = Object.freeze([
  "Executive Home Workspace", "Executive Summary", "Executive Dashboard", "Executive Card",
  "Quick Action", "Workspace Launcher", "Recent Activity", "Executive Recommendation",
  "Executive Notification", "Favorite Workspace", "Executive Context", "Executive Session",
  "Executive Layout", "Executive Configuration", "Executive Boundary",
  "Executive Capability", "Executive Responsibility",
] as const);

