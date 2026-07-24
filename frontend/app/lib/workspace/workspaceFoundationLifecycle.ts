/**
 * WS-1:1 — Declarative Workspace lifecycle and category vocabularies.
 */

import type { WorkspaceCategory, WorkspaceLifecycleState } from "./workspaceFoundationTypes.ts";

export const WorkspaceFoundationLifecycle = Object.freeze([
  "Declared",
  "Registered",
  "Configured",
  "Initialized",
  "Active",
  "Suspended",
  "Restored",
  "Archived",
  "Retired",
] as const satisfies readonly WorkspaceLifecycleState[]);

export const WorkspaceFoundationCategories = Object.freeze([
  "Executive Home",
  "Goal",
  "Problem",
  "Decision",
  "Scenario",
  "Strategy",
  "Risk",
  "Organization",
  "Knowledge",
  "Dashboard",
  "Custom",
] as const satisfies readonly WorkspaceCategory[]);
