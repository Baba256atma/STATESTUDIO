/** WS-3:1 — Canonical Goal Workspace Foundation surface for Registry. */
import { GoalWorkspaceBoundaries } from "./goalWorkspaceBoundaries.ts";
import { GoalWorkspaceCapabilities, GoalWorkspaceResponsibilities } from "./goalWorkspaceCapabilities.ts";
import { GoalWorkspaceContracts } from "./goalWorkspaceContracts.ts";
import { GoalWorkspaceGoalTypes } from "./goalWorkspaceGoalTypes.ts";
import { GoalWorkspaceIdentity } from "./goalWorkspaceIdentity.ts";
import { GoalWorkspaceLifecycle } from "./goalWorkspaceLifecycle.ts";

export const GoalWorkspaceFoundation = Object.freeze({
  identity: GoalWorkspaceIdentity,
  purpose: "Provide the executive context for defining, organizing, monitoring, refining, and governing business goals.",
  executiveQuestions: Object.freeze([
    "What are we trying to achieve?", "Why does this goal exist?",
    "How will success be measured?", "Which business objects are affected?",
    "Which assumptions support the goal?", "Which risks threaten the goal?",
    "Which KPIs evaluate progress?",
  ]),
  contracts: GoalWorkspaceContracts,
  capabilities: GoalWorkspaceCapabilities,
  responsibilities: GoalWorkspaceResponsibilities,
  goalTypes: GoalWorkspaceGoalTypes,
  lifecycle: GoalWorkspaceLifecycle,
  boundaries: GoalWorkspaceBoundaries,
  inventory: Object.freeze({
    contractCount: GoalWorkspaceContracts.length,
    capabilityCount: GoalWorkspaceCapabilities.length,
    responsibilityCount: GoalWorkspaceResponsibilities.length,
    goalTypeCount: GoalWorkspaceGoalTypes.length,
    lifecycleStateCount: GoalWorkspaceLifecycle.length,
    boundaryCount: GoalWorkspaceBoundaries.length,
  }),
  upstreamDependencies: Object.freeze([]),
  publicApiSurface: Object.freeze(["GoalWorkspaceFoundation"]),
  readiness: "ReadyForRegistry",
  nextPhase: "WS-3:2 — Goal Workspace Registry",
  metadataOnly: true, immutable: true, deterministic: true,
  runtime: false, ui: false, storage: false, aiBehavior: false, businessLogic: false,
  goalExecution: false, planning: false, scheduling: false, rendering: false,
} as const);

