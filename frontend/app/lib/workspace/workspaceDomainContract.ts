import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import { getActiveWorkspace } from "./workspaceRegistryStore.ts";

export const WORKSPACE_DOMAIN_CONTRACT_VERSION = "NW-B:2" as const;

export type WorkspaceDomainId =
  | "manufacturing"
  | "finance"
  | "project_management"
  | "supply_chain"
  | "operations"
  | "sales"
  | "human_resources"
  | "technology"
  | "custom";

export type WorkspaceDomainOption = {
  domainId: WorkspaceDomainId;
  domainName: string;
  description: string;
};

export type WorkspaceDomainSelection = {
  contractVersion: typeof WORKSPACE_DOMAIN_CONTRACT_VERSION;
  workspaceId: WorkspaceId;
  domainId: WorkspaceDomainId;
  domainName: string;
  selectedAt: string;
  domainPackId?: string | null;
  industryTemplateId?: string | null;
  metadata?: Record<string, unknown>;
};

type WorkspaceDomainListener = () => void;

const STORAGE_KEY = "nexora.workspaceDomainSelections.v1";
const workspaceDomainListeners = new Set<WorkspaceDomainListener>();
let workspaceDomainSelections: Record<WorkspaceId, WorkspaceDomainSelection> = {};
let domainStoreHydrated = false;
let workspaceDomainVersion = 0;

export const NEXORA_WORKSPACE_DOMAIN_OPTIONS: readonly WorkspaceDomainOption[] = Object.freeze([
  Object.freeze({
    domainId: "manufacturing",
    domainName: "Manufacturing",
    description: "Production systems, inventory, suppliers, throughput, and operations.",
  }),
  Object.freeze({
    domainId: "finance",
    domainName: "Finance",
    description: "Budgets, cash flow, forecasting, investment, and financial performance.",
  }),
  Object.freeze({
    domainId: "project_management",
    domainName: "Project Management",
    description: "Schedules, resources, risks, milestones, and delivery.",
  }),
  Object.freeze({
    domainId: "supply_chain",
    domainName: "Supply Chain",
    description: "Suppliers, logistics, inventory, lead times, and network resilience.",
  }),
  Object.freeze({
    domainId: "operations",
    domainName: "Operations",
    description: "Workflows, capacity, service levels, incidents, and execution.",
  }),
  Object.freeze({
    domainId: "sales",
    domainName: "Sales",
    description: "Pipeline, accounts, revenue motion, conversion, and forecasts.",
  }),
  Object.freeze({
    domainId: "human_resources",
    domainName: "Human Resources",
    description: "Teams, hiring, capacity, retention, skills, and organizational health.",
  }),
  Object.freeze({
    domainId: "technology",
    domainName: "Technology",
    description: "Platforms, systems, roadmaps, reliability, delivery, and architecture.",
  }),
  Object.freeze({
    domainId: "custom",
    domainName: "Custom",
    description: "A system that does not fit one standard Nexora domain.",
  }),
]);

function emitDomainDiagnostic(message: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("domainDiscovery", `[DomainDiscovery] ${message}`, payload);
}

function notifyWorkspaceDomainListeners(): void {
  workspaceDomainVersion += 1;
  workspaceDomainListeners.forEach((listener) => listener());
}

function readStorage(): Record<WorkspaceId, WorkspaceDomainSelection> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, WorkspaceDomainSelection>;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceDomainSelections));
  } catch {
    // Domain selection remains available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceDomainStore(): void {
  if (domainStoreHydrated) return;
  domainStoreHydrated = true;
  workspaceDomainSelections = readStorage();
}

function resolveWorkspaceId(workspaceId?: WorkspaceId | null): WorkspaceId | null {
  const explicit = workspaceId?.trim();
  if (explicit) return explicit;
  return getActiveWorkspace()?.workspaceId ?? null;
}

export function subscribeWorkspaceDomainSelections(listener: WorkspaceDomainListener): () => void {
  hydrateWorkspaceDomainStore();
  workspaceDomainListeners.add(listener);
  return () => workspaceDomainListeners.delete(listener);
}

export function getWorkspaceDomainSnapshot(): Readonly<Record<WorkspaceId, WorkspaceDomainSelection>> {
  hydrateWorkspaceDomainStore();
  return Object.freeze({ ...workspaceDomainSelections });
}

export function getWorkspaceDomainVersionSnapshot(): number {
  hydrateWorkspaceDomainStore();
  return workspaceDomainVersion;
}

export function getWorkspaceDomainSelection(workspaceId?: WorkspaceId | null): WorkspaceDomainSelection | null {
  hydrateWorkspaceDomainStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return null;
  return workspaceDomainSelections[resolvedWorkspaceId] ?? null;
}

export function getWorkspaceDomainOption(domainId: WorkspaceDomainId): WorkspaceDomainOption {
  return (
    NEXORA_WORKSPACE_DOMAIN_OPTIONS.find((option) => option.domainId === domainId) ??
    NEXORA_WORKSPACE_DOMAIN_OPTIONS.find((option) => option.domainId === "custom") ?? {
      domainId: "custom",
      domainName: "Custom",
      description: "A system that does not fit one standard Nexora domain.",
    }
  );
}

export function saveWorkspaceDomainSelection(input: {
  workspaceId: WorkspaceId;
  domainId: WorkspaceDomainId;
  selectedAt?: string;
}): WorkspaceDomainSelection {
  hydrateWorkspaceDomainStore();
  const option = getWorkspaceDomainOption(input.domainId);
  const previous = workspaceDomainSelections[input.workspaceId] ?? null;
  const selection: WorkspaceDomainSelection = Object.freeze({
    contractVersion: WORKSPACE_DOMAIN_CONTRACT_VERSION,
    workspaceId: input.workspaceId,
    domainId: option.domainId,
    domainName: option.domainName,
    selectedAt: input.selectedAt ?? new Date().toISOString(),
    domainPackId: null,
    industryTemplateId: null,
    metadata: Object.freeze({
      phase: "NW-B:2",
      futureReadyFor: ["industry_templates", "domain_packs", "domain_intelligence"],
    }),
  });

  workspaceDomainSelections = {
    ...workspaceDomainSelections,
    [input.workspaceId]: selection,
  };
  writeStorage();
  emitDomainDiagnostic(previous ? "Domain Changed" : "Domain Saved", {
    Workspace: input.workspaceId,
    "Domain Selected": option.domainName,
  });
  notifyWorkspaceDomainListeners();
  return selection;
}

export function resetWorkspaceDomainSelectionsForTests(): void {
  workspaceDomainSelections = {};
  domainStoreHydrated = true;
  workspaceDomainListeners.clear();
}
