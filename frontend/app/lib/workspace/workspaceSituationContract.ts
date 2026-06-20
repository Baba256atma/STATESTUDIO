import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import { getActiveWorkspace } from "./workspaceRegistryStore.ts";
import type { WorkspaceDomainId } from "./workspaceDomainContract.ts";

export const WORKSPACE_SITUATION_CONTRACT_VERSION = "NW-B:3" as const;

export type WorkspaceSituationTemplate = {
  templateId: string;
  label: string;
  exampleText: string;
};

export type WorkspaceSituationContext = {
  contractVersion: typeof WORKSPACE_SITUATION_CONTRACT_VERSION;
  workspaceId: WorkspaceId;
  domainId: WorkspaceDomainId;
  situationText: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
};

type WorkspaceSituationListener = () => void;

const STORAGE_KEY = "nexora.workspaceSituationContexts.v1";
const workspaceSituationListeners = new Set<WorkspaceSituationListener>();
let workspaceSituations: Record<WorkspaceId, WorkspaceSituationContext> = {};
let situationStoreHydrated = false;
let workspaceSituationVersion = 0;

const FALLBACK_TEMPLATES: readonly WorkspaceSituationTemplate[] = Object.freeze([
  Object.freeze({
    templateId: "capacity_pressure",
    label: "Capacity Pressure",
    exampleText: "Capacity is becoming constrained, priorities are competing, and execution tradeoffs are getting harder to manage.",
  }),
  Object.freeze({
    templateId: "performance_decline",
    label: "Performance Decline",
    exampleText: "Performance is slipping, coordination is harder, and the current system no longer feels predictable.",
  }),
  Object.freeze({
    templateId: "operating_uncertainty",
    label: "Operating Uncertainty",
    exampleText: "Conditions are changing quickly, signals are mixed, and leaders need a clearer model of what is happening.",
  }),
]);

export const NEXORA_SITUATION_TEMPLATES_BY_DOMAIN: Readonly<
  Record<WorkspaceDomainId, readonly WorkspaceSituationTemplate[]>
> = Object.freeze({
  manufacturing: Object.freeze([
    Object.freeze({
      templateId: "supplier_delay",
      label: "Supplier Delay",
      exampleText: "Supplier delays are increasing, production throughput is declining, and inventory shortages are becoming more frequent.",
    }),
    Object.freeze({
      templateId: "inventory_pressure",
      label: "Inventory Pressure",
      exampleText: "Inventory buffers are shrinking, stockouts are becoming more likely, and replenishment timing is harder to trust.",
    }),
    Object.freeze({
      templateId: "throughput_decline",
      label: "Throughput Decline",
      exampleText: "Production throughput is declining, bottlenecks are shifting, and teams are struggling to keep output stable.",
    }),
    Object.freeze({
      templateId: "quality_problems",
      label: "Quality Problems",
      exampleText: "Quality issues are increasing, rework is consuming capacity, and customer commitments are becoming harder to protect.",
    }),
  ]),
  finance: Object.freeze([
    Object.freeze({
      templateId: "cash_flow_pressure",
      label: "Cash Flow Pressure",
      exampleText: "Cash flow is tightening, operating costs are increasing, and revenue growth has slowed.",
    }),
    Object.freeze({
      templateId: "cost_increase",
      label: "Cost Increase",
      exampleText: "Operating costs are rising faster than expected, margins are narrowing, and budget owners need clearer tradeoffs.",
    }),
    Object.freeze({
      templateId: "revenue_slowdown",
      label: "Revenue Slowdown",
      exampleText: "Revenue growth has slowed, pipeline conversion is uneven, and forecasting confidence is declining.",
    }),
    Object.freeze({
      templateId: "budget_overrun",
      label: "Budget Overrun",
      exampleText: "Budget variance is increasing, spend controls are under pressure, and teams need to understand the drivers.",
    }),
  ]),
  project_management: Object.freeze([
    Object.freeze({
      templateId: "schedule_delay",
      label: "Schedule Delay",
      exampleText: "Milestones are slipping, resource conflicts are increasing, and delivery risk is growing.",
    }),
    Object.freeze({
      templateId: "resource_conflict",
      label: "Resource Conflict",
      exampleText: "Critical resources are split across competing priorities, handoffs are slowing down, and delivery dates are at risk.",
    }),
    Object.freeze({
      templateId: "scope_growth",
      label: "Scope Growth",
      exampleText: "Scope is expanding, requirements are changing, and the team needs a clearer view of delivery impact.",
    }),
    Object.freeze({
      templateId: "delivery_risk",
      label: "Delivery Risk",
      exampleText: "Delivery risk is rising, dependencies are fragile, and leaders need to understand the path to recovery.",
    }),
  ]),
  supply_chain: Object.freeze([
    Object.freeze({
      templateId: "supplier_reliability",
      label: "Supplier Reliability",
      exampleText: "Supplier reliability is declining, lead times are extending, and fulfillment plans are becoming less stable.",
    }),
    Object.freeze({
      templateId: "logistics_delay",
      label: "Logistics Delay",
      exampleText: "Logistics delays are increasing, transportation costs are shifting, and inventory arrivals are harder to predict.",
    }),
    Object.freeze({
      templateId: "network_disruption",
      label: "Network Disruption",
      exampleText: "Network disruptions are creating uneven service levels, delayed replenishment, and pressure on customer commitments.",
    }),
  ]),
  operations: Object.freeze([
    Object.freeze({
      templateId: "service_backlog",
      label: "Service Backlog",
      exampleText: "Backlogs are growing, service levels are slipping, and teams are having trouble prioritizing work.",
    }),
    Object.freeze({
      templateId: "incident_pressure",
      label: "Incident Pressure",
      exampleText: "Incidents are increasing, response capacity is strained, and recurring issues are disrupting execution.",
    }),
    Object.freeze({
      templateId: "workflow_bottleneck",
      label: "Workflow Bottleneck",
      exampleText: "Workflow bottlenecks are slowing execution, queues are building, and accountability is becoming less clear.",
    }),
  ]),
  sales: Object.freeze([
    Object.freeze({
      templateId: "pipeline_stall",
      label: "Pipeline Stall",
      exampleText: "Pipeline movement is slowing, conversion rates are uneven, and forecast confidence is weakening.",
    }),
    Object.freeze({
      templateId: "account_risk",
      label: "Account Risk",
      exampleText: "Key accounts are showing risk signals, renewal confidence is mixed, and revenue coverage needs closer inspection.",
    }),
    Object.freeze({
      templateId: "forecast_gap",
      label: "Forecast Gap",
      exampleText: "The forecast gap is widening, sales activity is inconsistent, and leaders need a clearer view of likely outcomes.",
    }),
  ]),
  human_resources: Object.freeze([
    Object.freeze({
      templateId: "retention_pressure",
      label: "Retention Pressure",
      exampleText: "Retention pressure is increasing, team capacity is uneven, and critical skills are becoming harder to keep.",
    }),
    Object.freeze({
      templateId: "hiring_delay",
      label: "Hiring Delay",
      exampleText: "Hiring timelines are extending, open roles are creating capacity gaps, and delivery teams are absorbing the strain.",
    }),
    Object.freeze({
      templateId: "skills_gap",
      label: "Skills Gap",
      exampleText: "Skills gaps are limiting execution, training priorities are unclear, and teams need a better capability plan.",
    }),
  ]),
  technology: Object.freeze([
    Object.freeze({
      templateId: "platform_reliability",
      label: "Platform Reliability",
      exampleText: "Reliability issues are increasing, incidents are interrupting delivery, and system ownership needs clearer focus.",
    }),
    Object.freeze({
      templateId: "delivery_slowdown",
      label: "Delivery Slowdown",
      exampleText: "Delivery velocity is slowing, dependencies are blocking teams, and roadmap confidence is declining.",
    }),
    Object.freeze({
      templateId: "technical_debt",
      label: "Technical Debt",
      exampleText: "Technical debt is constraining change, operational risk is rising, and teams need to understand what to address first.",
    }),
  ]),
  custom: FALLBACK_TEMPLATES,
});

export function getSituationTemplatesForDomain(domainId?: WorkspaceDomainId | null): readonly WorkspaceSituationTemplate[] {
  if (!domainId) return FALLBACK_TEMPLATES;
  return NEXORA_SITUATION_TEMPLATES_BY_DOMAIN[domainId] ?? FALLBACK_TEMPLATES;
}

export function getSituationPlaceholderForDomain(domainId?: WorkspaceDomainId | null): string {
  return (
    getSituationTemplatesForDomain(domainId)[0]?.exampleText ??
    FALLBACK_TEMPLATES[0]?.exampleText ??
    "Describe what is changing, where pressure is increasing, and what leaders need to understand."
  );
}

function emitSituationDiagnostic(message: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("situationDiscovery", `[SituationDiscovery] ${message}`, payload);
}

function notifyWorkspaceSituationListeners(): void {
  workspaceSituationVersion += 1;
  workspaceSituationListeners.forEach((listener) => listener());
}

function readStorage(): Record<WorkspaceId, WorkspaceSituationContext> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, WorkspaceSituationContext>;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceSituations));
  } catch {
    // Situation context remains available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceSituationStore(): void {
  if (situationStoreHydrated) return;
  situationStoreHydrated = true;
  workspaceSituations = readStorage();
}

function resolveWorkspaceId(workspaceId?: WorkspaceId | null): WorkspaceId | null {
  const explicit = workspaceId?.trim();
  if (explicit) return explicit;
  return getActiveWorkspace()?.workspaceId ?? null;
}

export function subscribeWorkspaceSituations(listener: WorkspaceSituationListener): () => void {
  hydrateWorkspaceSituationStore();
  workspaceSituationListeners.add(listener);
  return () => workspaceSituationListeners.delete(listener);
}

export function getWorkspaceSituationVersionSnapshot(): number {
  hydrateWorkspaceSituationStore();
  return workspaceSituationVersion;
}

export function getWorkspaceSituationSnapshot(): Readonly<Record<WorkspaceId, WorkspaceSituationContext>> {
  hydrateWorkspaceSituationStore();
  return Object.freeze({ ...workspaceSituations });
}

export function getWorkspaceSituation(workspaceId?: WorkspaceId | null): WorkspaceSituationContext | null {
  hydrateWorkspaceSituationStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return null;
  return workspaceSituations[resolvedWorkspaceId] ?? null;
}

export function saveWorkspaceSituation(input: {
  workspaceId: WorkspaceId;
  domainId: WorkspaceDomainId;
  situationText: string;
  now?: string;
}): WorkspaceSituationContext {
  hydrateWorkspaceSituationStore();
  const cleanedSituationText = input.situationText.trim();
  const previous = workspaceSituations[input.workspaceId] ?? null;
  const timestamp = input.now ?? new Date().toISOString();
  const situation: WorkspaceSituationContext = Object.freeze({
    contractVersion: WORKSPACE_SITUATION_CONTRACT_VERSION,
    workspaceId: input.workspaceId,
    domainId: input.domainId,
    situationText: cleanedSituationText,
    createdAt: previous?.createdAt ?? timestamp,
    updatedAt: timestamp,
    metadata: Object.freeze({
      phase: "NW-B:3",
      futureReadyFor: ["situation_analysis", "pattern_detection", "risk_extraction", "object_suggestion", "goal_suggestion"],
    }),
  });

  workspaceSituations = {
    ...workspaceSituations,
    [input.workspaceId]: situation,
  };
  writeStorage();
  emitSituationDiagnostic(previous ? "Situation Updated" : "Situation Saved", {
    Workspace: input.workspaceId,
    Domain: input.domainId,
  });
  notifyWorkspaceSituationListeners();
  return situation;
}

export function clearWorkspaceSituation(workspaceId: WorkspaceId): void {
  hydrateWorkspaceSituationStore();
  if (!workspaceSituations[workspaceId]) return;
  const nextSituations = { ...workspaceSituations };
  delete nextSituations[workspaceId];
  workspaceSituations = nextSituations;
  writeStorage();
  emitSituationDiagnostic("Situation Cleared", { Workspace: workspaceId });
  notifyWorkspaceSituationListeners();
}

export function resetWorkspaceSituationsForTests(): void {
  workspaceSituations = {};
  situationStoreHydrated = true;
  workspaceSituationVersion = 0;
  workspaceSituationListeners.clear();
}
