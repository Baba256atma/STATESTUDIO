import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import { getActiveWorkspace } from "./workspaceRegistryStore.ts";
import type { WorkspaceDomainId } from "./workspaceDomainContract.ts";

export const WORKSPACE_GOAL_CONTRACT_VERSION = "NW-B:4" as const;

export type WorkspaceGoalSource = "Suggested" | "Custom";
export type WorkspaceGoalType = "outcome" | "decision" | "risk" | "performance" | "custom";

export type WorkspaceGoalSuggestion = {
  goalId: string;
  goalName: string;
  goalType: WorkspaceGoalType;
};

export type WorkspaceGoal = {
  contractVersion: typeof WORKSPACE_GOAL_CONTRACT_VERSION;
  workspaceId: WorkspaceId;
  goalId: string;
  goalName: string;
  goalType: WorkspaceGoalType;
  selectedAt: string;
  source: WorkspaceGoalSource;
  metadata?: Record<string, unknown>;
};

type WorkspaceGoalListener = () => void;

const STORAGE_KEY = "nexora.workspaceGoals.v1";
const workspaceGoalListeners = new Set<WorkspaceGoalListener>();
let workspaceGoals: Record<WorkspaceId, readonly WorkspaceGoal[]> = {};
let goalStoreHydrated = false;
let workspaceGoalVersion = 0;

const FALLBACK_GOAL_SUGGESTIONS: readonly WorkspaceGoalSuggestion[] = Object.freeze([
  Object.freeze({ goalId: "improve_clarity", goalName: "Improve Decision Clarity", goalType: "decision" }),
  Object.freeze({ goalId: "reduce_risk", goalName: "Reduce Risk", goalType: "risk" }),
  Object.freeze({ goalId: "improve_performance", goalName: "Improve Performance", goalType: "performance" }),
  Object.freeze({ goalId: "compare_options", goalName: "Compare Options", goalType: "decision" }),
]);

export const NEXORA_GOAL_SUGGESTIONS_BY_DOMAIN: Readonly<Record<WorkspaceDomainId, readonly WorkspaceGoalSuggestion[]>> =
  Object.freeze({
    manufacturing: Object.freeze([
      Object.freeze({ goalId: "reduce_cost", goalName: "Reduce Cost", goalType: "outcome" }),
      Object.freeze({ goalId: "improve_throughput", goalName: "Improve Throughput", goalType: "performance" }),
      Object.freeze({ goalId: "reduce_downtime", goalName: "Reduce Downtime", goalType: "performance" }),
      Object.freeze({ goalId: "improve_quality", goalName: "Improve Quality", goalType: "performance" }),
      Object.freeze({ goalId: "reduce_inventory_risk", goalName: "Reduce Inventory Risk", goalType: "risk" }),
      Object.freeze({ goalId: "improve_supplier_performance", goalName: "Improve Supplier Performance", goalType: "performance" }),
    ]),
    finance: Object.freeze([
      Object.freeze({ goalId: "improve_cash_flow", goalName: "Improve Cash Flow", goalType: "outcome" }),
      Object.freeze({ goalId: "reduce_expenses", goalName: "Reduce Expenses", goalType: "outcome" }),
      Object.freeze({ goalId: "increase_profitability", goalName: "Increase Profitability", goalType: "outcome" }),
      Object.freeze({ goalId: "improve_forecast_accuracy", goalName: "Improve Forecast Accuracy", goalType: "performance" }),
      Object.freeze({ goalId: "reduce_financial_risk", goalName: "Reduce Financial Risk", goalType: "risk" }),
    ]),
    project_management: Object.freeze([
      Object.freeze({ goalId: "deliver_on_time", goalName: "Deliver On Time", goalType: "outcome" }),
      Object.freeze({ goalId: "reduce_project_risk", goalName: "Reduce Project Risk", goalType: "risk" }),
      Object.freeze({ goalId: "improve_resource_utilization", goalName: "Improve Resource Utilization", goalType: "performance" }),
      Object.freeze({ goalId: "control_scope_growth", goalName: "Control Scope Growth", goalType: "risk" }),
      Object.freeze({ goalId: "improve_stakeholder_alignment", goalName: "Improve Stakeholder Alignment", goalType: "decision" }),
    ]),
    supply_chain: Object.freeze([
      Object.freeze({ goalId: "improve_supplier_reliability", goalName: "Improve Supplier Reliability", goalType: "performance" }),
      Object.freeze({ goalId: "reduce_lead_time", goalName: "Reduce Lead Time", goalType: "outcome" }),
      Object.freeze({ goalId: "reduce_supply_risk", goalName: "Reduce Supply Risk", goalType: "risk" }),
      Object.freeze({ goalId: "improve_fulfillment", goalName: "Improve Fulfillment", goalType: "performance" }),
      Object.freeze({ goalId: "optimize_inventory", goalName: "Optimize Inventory", goalType: "outcome" }),
    ]),
    operations: Object.freeze([
      Object.freeze({ goalId: "improve_efficiency", goalName: "Improve Efficiency", goalType: "performance" }),
      Object.freeze({ goalId: "reduce_bottlenecks", goalName: "Reduce Bottlenecks", goalType: "outcome" }),
      Object.freeze({ goalId: "improve_service_levels", goalName: "Improve Service Levels", goalType: "performance" }),
      Object.freeze({ goalId: "reduce_operational_risk", goalName: "Reduce Operational Risk", goalType: "risk" }),
    ]),
    sales: Object.freeze([
      Object.freeze({ goalId: "increase_conversion", goalName: "Increase Conversion", goalType: "outcome" }),
      Object.freeze({ goalId: "improve_forecast_confidence", goalName: "Improve Forecast Confidence", goalType: "performance" }),
      Object.freeze({ goalId: "reduce_account_risk", goalName: "Reduce Account Risk", goalType: "risk" }),
      Object.freeze({ goalId: "grow_pipeline", goalName: "Grow Pipeline", goalType: "outcome" }),
    ]),
    human_resources: Object.freeze([
      Object.freeze({ goalId: "improve_retention", goalName: "Improve Retention", goalType: "outcome" }),
      Object.freeze({ goalId: "reduce_hiring_delay", goalName: "Reduce Hiring Delay", goalType: "performance" }),
      Object.freeze({ goalId: "improve_capacity_planning", goalName: "Improve Capacity Planning", goalType: "decision" }),
      Object.freeze({ goalId: "close_skills_gap", goalName: "Close Skills Gap", goalType: "outcome" }),
    ]),
    technology: Object.freeze([
      Object.freeze({ goalId: "improve_reliability", goalName: "Improve Reliability", goalType: "performance" }),
      Object.freeze({ goalId: "increase_delivery_velocity", goalName: "Increase Delivery Velocity", goalType: "performance" }),
      Object.freeze({ goalId: "reduce_technical_risk", goalName: "Reduce Technical Risk", goalType: "risk" }),
      Object.freeze({ goalId: "prioritize_roadmap", goalName: "Prioritize Roadmap", goalType: "decision" }),
    ]),
    custom: FALLBACK_GOAL_SUGGESTIONS,
  });

export function getGoalSuggestionsForDomain(domainId?: WorkspaceDomainId | null): readonly WorkspaceGoalSuggestion[] {
  if (!domainId) return FALLBACK_GOAL_SUGGESTIONS;
  return NEXORA_GOAL_SUGGESTIONS_BY_DOMAIN[domainId] ?? FALLBACK_GOAL_SUGGESTIONS;
}

function emitGoalDiagnostic(message: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("goalDiscovery", `[GoalDiscovery] ${message}`, payload);
}

function notifyWorkspaceGoalListeners(): void {
  workspaceGoalVersion += 1;
  workspaceGoalListeners.forEach((listener) => listener());
}

function readStorage(): Record<WorkspaceId, readonly WorkspaceGoal[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, WorkspaceGoal[]>;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceGoals));
  } catch {
    // Goals remain available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceGoalStore(): void {
  if (goalStoreHydrated) return;
  goalStoreHydrated = true;
  workspaceGoals = readStorage();
}

function resolveWorkspaceId(workspaceId?: WorkspaceId | null): WorkspaceId | null {
  const explicit = workspaceId?.trim();
  if (explicit) return explicit;
  return getActiveWorkspace()?.workspaceId ?? null;
}

function slugifyGoalName(goalName: string): string {
  const slug = goalName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug || "custom_goal";
}

function freezeGoal(input: Omit<WorkspaceGoal, "contractVersion" | "metadata">): WorkspaceGoal {
  return Object.freeze({
    ...input,
    contractVersion: WORKSPACE_GOAL_CONTRACT_VERSION,
    metadata: Object.freeze({
      phase: "NW-B:4",
      futureReadyFor: ["model_generation", "kpi_suggestions", "risk_suggestions", "scenario_suggestions", "decision_guidance"],
    }),
  });
}

export function createSuggestedGoal(input: {
  workspaceId: WorkspaceId;
  suggestion: WorkspaceGoalSuggestion;
  selectedAt?: string;
}): WorkspaceGoal {
  return freezeGoal({
    workspaceId: input.workspaceId,
    goalId: input.suggestion.goalId,
    goalName: input.suggestion.goalName,
    goalType: input.suggestion.goalType,
    selectedAt: input.selectedAt ?? new Date().toISOString(),
    source: "Suggested",
  });
}

export function createCustomGoal(input: {
  workspaceId: WorkspaceId;
  goalName: string;
  selectedAt?: string;
}): WorkspaceGoal {
  const cleanedGoalName = input.goalName.trim();
  return freezeGoal({
    workspaceId: input.workspaceId,
    goalId: `custom_${slugifyGoalName(cleanedGoalName)}`,
    goalName: cleanedGoalName,
    goalType: "custom",
    selectedAt: input.selectedAt ?? new Date().toISOString(),
    source: "Custom",
  });
}

export function subscribeWorkspaceGoals(listener: WorkspaceGoalListener): () => void {
  hydrateWorkspaceGoalStore();
  workspaceGoalListeners.add(listener);
  return () => workspaceGoalListeners.delete(listener);
}

export function getWorkspaceGoalVersionSnapshot(): number {
  hydrateWorkspaceGoalStore();
  return workspaceGoalVersion;
}

export function getWorkspaceGoalSnapshot(): Readonly<Record<WorkspaceId, readonly WorkspaceGoal[]>> {
  hydrateWorkspaceGoalStore();
  return Object.freeze({ ...workspaceGoals });
}

export function getWorkspaceGoals(workspaceId?: WorkspaceId | null): readonly WorkspaceGoal[] {
  hydrateWorkspaceGoalStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return [];
  return workspaceGoals[resolvedWorkspaceId] ?? [];
}

export function saveWorkspaceGoals(input: {
  workspaceId: WorkspaceId;
  goals: readonly WorkspaceGoal[];
}): readonly WorkspaceGoal[] {
  hydrateWorkspaceGoalStore();
  const uniqueGoals = new Map<string, WorkspaceGoal>();
  input.goals.forEach((goal) => {
    if (goal.workspaceId !== input.workspaceId) return;
    if (!goal.goalName.trim()) return;
    uniqueGoals.set(goal.goalId, goal);
  });
  const savedGoals = Object.freeze(Array.from(uniqueGoals.values()));
  workspaceGoals = {
    ...workspaceGoals,
    [input.workspaceId]: savedGoals,
  };
  writeStorage();
  emitGoalDiagnostic("Goal Saved", {
    Workspace: input.workspaceId,
    "Goals Selected": savedGoals.length,
  });
  notifyWorkspaceGoalListeners();
  return savedGoals;
}

export function resetWorkspaceGoalsForTests(): void {
  workspaceGoals = {};
  goalStoreHydrated = true;
  workspaceGoalVersion = 0;
  workspaceGoalListeners.clear();
}

