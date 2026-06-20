import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import { getActiveWorkspace } from "./workspaceRegistryStore.ts";
import type { WorkspaceDomainId, WorkspaceDomainSelection } from "./workspaceDomainContract.ts";
import type { WorkspaceSituationContext } from "./workspaceSituationContract.ts";
import type { WorkspaceGoal } from "./workspaceGoalContract.ts";

export const WORKSPACE_DRAFT_MODEL_CONTRACT_VERSION = "NW-B:5" as const;

export type WorkspaceDraftGenerationSource = "RuleBased" | "AIGenerated" | "Hybrid" | "DataEnhanced";
export type WorkspaceDraftModelStatus = "draft" | "approved";
export type WorkspaceDraftObjectSource = "SystemGenerated" | "UserModified";

export type WorkspaceDraftObject = {
  objectId: string;
  objectName: string;
  objectType: string;
  suggestionReason: string;
  confidence: number;
  source: WorkspaceDraftObjectSource;
};

export type WorkspaceDraftModel = {
  contractVersion: typeof WORKSPACE_DRAFT_MODEL_CONTRACT_VERSION;
  workspaceId: WorkspaceId;
  domainId: WorkspaceDomainId;
  situationId: string;
  goalIds: readonly string[];
  generatedAt: string;
  updatedAt: string;
  draftVersion: number;
  objects: readonly WorkspaceDraftObject[];
  generationSource: WorkspaceDraftGenerationSource;
  status: WorkspaceDraftModelStatus;
  approvedAt?: string | null;
  metadata?: Record<string, unknown>;
};

type DraftObjectTemplate = Omit<WorkspaceDraftObject, "objectId" | "source"> & {
  source?: WorkspaceDraftObjectSource;
};
type WorkspaceDraftModelListener = () => void;

const STORAGE_KEY = "nexora.workspaceDraftModels.v1";
const workspaceDraftModelListeners = new Set<WorkspaceDraftModelListener>();
let workspaceDraftModels: Record<WorkspaceId, WorkspaceDraftModel> = {};
let draftModelStoreHydrated = false;
let workspaceDraftModelVersion = 0;

const FALLBACK_OBJECT_TEMPLATES: readonly DraftObjectTemplate[] = Object.freeze([
  Object.freeze({
    objectName: "System Drivers",
    objectType: "driver",
    suggestionReason: "Suggested as a general container for the forces shaping this workspace.",
    confidence: 0.72,
    source: "SystemGenerated",
  }),
  Object.freeze({
    objectName: "Constraints",
    objectType: "constraint",
    suggestionReason: "Frequently useful when clarifying what limits the current system.",
    confidence: 0.7,
    source: "SystemGenerated",
  }),
  Object.freeze({
    objectName: "Outcomes",
    objectType: "outcome",
    suggestionReason: "Suggested to connect the draft model to the goals selected by the user.",
    confidence: 0.74,
    source: "SystemGenerated",
  }),
]);

const OBJECT_TEMPLATES_BY_DOMAIN: Readonly<Record<WorkspaceDomainId, readonly DraftObjectTemplate[]>> = Object.freeze({
  manufacturing: Object.freeze([
    Object.freeze({ objectName: "Suppliers", objectType: "external_party", suggestionReason: "Frequently associated with supplier delays and throughput constraints.", confidence: 0.86 }),
    Object.freeze({ objectName: "Inventory", objectType: "resource", suggestionReason: "Suggested because inventory shortages are commonly linked to supplier delays and throughput problems.", confidence: 0.84 }),
    Object.freeze({ objectName: "Production", objectType: "process", suggestionReason: "Core manufacturing flow for understanding throughput and operating constraints.", confidence: 0.83 }),
    Object.freeze({ objectName: "Orders", objectType: "demand", suggestionReason: "Connects production capacity to customer demand and fulfillment pressure.", confidence: 0.78 }),
    Object.freeze({ objectName: "Customers", objectType: "stakeholder", suggestionReason: "Represents the downstream impact of delays, shortages, and service commitments.", confidence: 0.75 }),
    Object.freeze({ objectName: "Quality", objectType: "performance", suggestionReason: "Useful when throughput or supplier issues may create rework, defects, or service risk.", confidence: 0.76 }),
    Object.freeze({ objectName: "Logistics", objectType: "process", suggestionReason: "Often affects supplier timing, inventory movement, and order fulfillment.", confidence: 0.77 }),
  ]),
  finance: Object.freeze([
    Object.freeze({ objectName: "Revenue", objectType: "financial_stream", suggestionReason: "Core input for understanding cash pressure and growth changes.", confidence: 0.84 }),
    Object.freeze({ objectName: "Expenses", objectType: "financial_stream", suggestionReason: "Suggested because cost pressure and expense reduction are common finance goals.", confidence: 0.84 }),
    Object.freeze({ objectName: "Cash Flow", objectType: "financial_metric", suggestionReason: "Central object for analyzing cash flow pressure.", confidence: 0.88 }),
    Object.freeze({ objectName: "Forecast", objectType: "planning_model", suggestionReason: "Supports future-oriented analysis of revenue, expenses, and cash position.", confidence: 0.8 }),
    Object.freeze({ objectName: "Investments", objectType: "asset", suggestionReason: "Represents committed capital and future financial optionality.", confidence: 0.72 }),
    Object.freeze({ objectName: "Accounts Payable", objectType: "liability", suggestionReason: "Frequently affects cash timing and supplier payment pressure.", confidence: 0.78 }),
    Object.freeze({ objectName: "Accounts Receivable", objectType: "asset", suggestionReason: "Frequently affects cash collection timing and working capital.", confidence: 0.78 }),
  ]),
  project_management: Object.freeze([
    Object.freeze({ objectName: "Tasks", objectType: "work_item", suggestionReason: "Core unit for understanding schedule delay and delivery work.", confidence: 0.84 }),
    Object.freeze({ objectName: "Milestones", objectType: "schedule_marker", suggestionReason: "Suggested because milestone movement is central to delivery timing.", confidence: 0.86 }),
    Object.freeze({ objectName: "Resources", objectType: "resource", suggestionReason: "Resource contention often drives delays and delivery risk.", confidence: 0.82 }),
    Object.freeze({ objectName: "Stakeholders", objectType: "stakeholder", suggestionReason: "Useful for understanding decision alignment and delivery expectations.", confidence: 0.76 }),
    Object.freeze({ objectName: "Risks", objectType: "risk_register", suggestionReason: "Represents project uncertainty without generating risk intelligence yet.", confidence: 0.8 }),
    Object.freeze({ objectName: "Budget", objectType: "financial_constraint", suggestionReason: "Common constraint for scope, resources, and delivery tradeoffs.", confidence: 0.74 }),
    Object.freeze({ objectName: "Schedule", objectType: "timeline", suggestionReason: "Central to understanding delays and delivery commitments.", confidence: 0.87 }),
  ]),
  supply_chain: Object.freeze([
    Object.freeze({ objectName: "Suppliers", objectType: "external_party", suggestionReason: "Supplier reliability commonly drives supply chain performance.", confidence: 0.85 }),
    Object.freeze({ objectName: "Inventory", objectType: "resource", suggestionReason: "Useful for modeling availability, buffers, shortages, and replenishment.", confidence: 0.84 }),
    Object.freeze({ objectName: "Orders", objectType: "demand", suggestionReason: "Connects demand signals to fulfillment pressure.", confidence: 0.78 }),
    Object.freeze({ objectName: "Logistics", objectType: "process", suggestionReason: "Often determines timing, cost, and delivery reliability.", confidence: 0.82 }),
    Object.freeze({ objectName: "Lead Times", objectType: "performance", suggestionReason: "Common metric-like object for understanding supply delay.", confidence: 0.8 }),
  ]),
  operations: Object.freeze([
    Object.freeze({ objectName: "Workflows", objectType: "process", suggestionReason: "Core operating structure for understanding bottlenecks and efficiency.", confidence: 0.84 }),
    Object.freeze({ objectName: "Capacity", objectType: "resource", suggestionReason: "Capacity pressure often explains service level and backlog changes.", confidence: 0.82 }),
    Object.freeze({ objectName: "Backlog", objectType: "queue", suggestionReason: "Useful when execution pressure or service delays are present.", confidence: 0.78 }),
    Object.freeze({ objectName: "Service Levels", objectType: "performance", suggestionReason: "Connects operational work to expected outcomes.", confidence: 0.8 }),
    Object.freeze({ objectName: "Incidents", objectType: "event", suggestionReason: "Common operating object for disruption and response analysis.", confidence: 0.73 }),
  ]),
  sales: Object.freeze([
    Object.freeze({ objectName: "Pipeline", objectType: "funnel", suggestionReason: "Central to understanding sales motion and forecast confidence.", confidence: 0.86 }),
    Object.freeze({ objectName: "Accounts", objectType: "customer_group", suggestionReason: "Useful for account risk, conversion, and revenue visibility.", confidence: 0.8 }),
    Object.freeze({ objectName: "Opportunities", objectType: "sales_object", suggestionReason: "Represents deal movement and conversion pressure.", confidence: 0.82 }),
    Object.freeze({ objectName: "Revenue", objectType: "financial_stream", suggestionReason: "Connects sales activity to business outcomes.", confidence: 0.78 }),
    Object.freeze({ objectName: "Forecast", objectType: "planning_model", suggestionReason: "Supports understanding expected revenue outcomes.", confidence: 0.77 }),
  ]),
  human_resources: Object.freeze([
    Object.freeze({ objectName: "Teams", objectType: "organization", suggestionReason: "Core HR structure for understanding capacity and retention.", confidence: 0.82 }),
    Object.freeze({ objectName: "Roles", objectType: "position", suggestionReason: "Useful for mapping hiring gaps and workforce needs.", confidence: 0.78 }),
    Object.freeze({ objectName: "Hiring Pipeline", objectType: "pipeline", suggestionReason: "Suggested when hiring delay or capacity pressure may be present.", confidence: 0.77 }),
    Object.freeze({ objectName: "Skills", objectType: "capability", suggestionReason: "Common driver of team capability and delivery constraints.", confidence: 0.78 }),
    Object.freeze({ objectName: "Retention", objectType: "workforce_outcome", suggestionReason: "Useful when workforce stability or employee risk matters.", confidence: 0.76 }),
  ]),
  technology: Object.freeze([
    Object.freeze({ objectName: "Platforms", objectType: "system", suggestionReason: "Core technology object for reliability, ownership, and delivery.", confidence: 0.82 }),
    Object.freeze({ objectName: "Services", objectType: "system_component", suggestionReason: "Useful for understanding operational boundaries and dependencies.", confidence: 0.8 }),
    Object.freeze({ objectName: "Incidents", objectType: "event", suggestionReason: "Common object for reliability and operational pressure.", confidence: 0.78 }),
    Object.freeze({ objectName: "Roadmap", objectType: "planning_model", suggestionReason: "Connects technology choices to delivery priorities.", confidence: 0.76 }),
    Object.freeze({ objectName: "Technical Debt", objectType: "constraint", suggestionReason: "Often explains reduced delivery velocity and rising technical risk.", confidence: 0.78 }),
  ]),
  custom: FALLBACK_OBJECT_TEMPLATES,
});

function emitDraftModelDiagnostic(message: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("draftModelGeneration", `[DraftModelGeneration] ${message}`, payload);
}

function notifyWorkspaceDraftModelListeners(): void {
  workspaceDraftModelVersion += 1;
  workspaceDraftModelListeners.forEach((listener) => listener());
}

function readStorage(): Record<WorkspaceId, WorkspaceDraftModel> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, WorkspaceDraftModel>;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceDraftModels));
  } catch {
    // Draft model remains available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceDraftModelStore(): void {
  if (draftModelStoreHydrated) return;
  draftModelStoreHydrated = true;
  workspaceDraftModels = readStorage();
}

function resolveWorkspaceId(workspaceId?: WorkspaceId | null): WorkspaceId | null {
  const explicit = workspaceId?.trim();
  if (explicit) return explicit;
  return getActiveWorkspace()?.workspaceId ?? null;
}

function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug || "draft_object";
}

function buildSituationId(situation: WorkspaceSituationContext | null): string {
  if (!situation) return "situation_unset";
  return `situation_${slugify(situation.workspaceId)}_${slugify(situation.updatedAt)}`;
}

function templateToObject(template: DraftObjectTemplate, index: number): WorkspaceDraftObject {
  return Object.freeze({
    objectId: `draft_${slugify(template.objectName)}_${index + 1}`,
    objectName: template.objectName,
    objectType: template.objectType,
    suggestionReason: template.suggestionReason,
    confidence: template.confidence,
    source: template.source ?? "SystemGenerated",
  });
}

function enhanceReasonWithGoals(object: WorkspaceDraftObject, goals: readonly WorkspaceGoal[]): WorkspaceDraftObject {
  if (!goals.length) return object;
  const goalNames = goals.slice(0, 2).map((goal) => goal.goalName).join(" and ");
  return Object.freeze({
    ...object,
    suggestionReason: `${object.suggestionReason} It may help evaluate ${goalNames}.`,
  });
}

export function generateWorkspaceDraftModel(input: {
  workspaceId: WorkspaceId;
  domain: WorkspaceDomainSelection | null;
  situation: WorkspaceSituationContext | null;
  goals: readonly WorkspaceGoal[];
  generatedAt?: string;
}): WorkspaceDraftModel {
  const domainId = input.domain?.domainId ?? input.situation?.domainId ?? "custom";
  const templates = OBJECT_TEMPLATES_BY_DOMAIN[domainId] ?? FALLBACK_OBJECT_TEMPLATES;
  const objects = templates.map((template, index) => enhanceReasonWithGoals(templateToObject(template, index), input.goals));
  const timestamp = input.generatedAt ?? new Date().toISOString();
  const draft: WorkspaceDraftModel = Object.freeze({
    contractVersion: WORKSPACE_DRAFT_MODEL_CONTRACT_VERSION,
    workspaceId: input.workspaceId,
    domainId,
    situationId: buildSituationId(input.situation),
    goalIds: Object.freeze(input.goals.map((goal) => goal.goalId)),
    generatedAt: timestamp,
    updatedAt: timestamp,
    draftVersion: 1,
    objects: Object.freeze(objects),
    generationSource: "RuleBased",
    status: "draft",
    approvedAt: null,
    metadata: Object.freeze({
      phase: "NW-B:5",
      futureReadyFor: ["ai_generated", "hybrid_generation", "data_enhanced_generation", "model_approval"],
    }),
  });
  emitDraftModelDiagnostic("Objects Generated", {
    Workspace: input.workspaceId,
    "Objects Generated": draft.objects.length,
  });
  return draft;
}

export function subscribeWorkspaceDraftModels(listener: WorkspaceDraftModelListener): () => void {
  hydrateWorkspaceDraftModelStore();
  workspaceDraftModelListeners.add(listener);
  return () => workspaceDraftModelListeners.delete(listener);
}

export function getWorkspaceDraftModelVersionSnapshot(): number {
  hydrateWorkspaceDraftModelStore();
  return workspaceDraftModelVersion;
}

export function getWorkspaceDraftModelSnapshot(): Readonly<Record<WorkspaceId, WorkspaceDraftModel>> {
  hydrateWorkspaceDraftModelStore();
  return Object.freeze({ ...workspaceDraftModels });
}

export function getWorkspaceDraftModel(workspaceId?: WorkspaceId | null): WorkspaceDraftModel | null {
  hydrateWorkspaceDraftModelStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return null;
  return workspaceDraftModels[resolvedWorkspaceId] ?? null;
}

export function saveWorkspaceDraftModel(draft: WorkspaceDraftModel): WorkspaceDraftModel {
  hydrateWorkspaceDraftModelStore();
  workspaceDraftModels = {
    ...workspaceDraftModels,
    [draft.workspaceId]: draft,
  };
  writeStorage();
  notifyWorkspaceDraftModelListeners();
  return draft;
}

function updateDraftModel(workspaceId: WorkspaceId, updater: (draft: WorkspaceDraftModel) => WorkspaceDraftModel): WorkspaceDraftModel | null {
  const draft = getWorkspaceDraftModel(workspaceId);
  if (!draft) return null;
  const updated = updater(draft);
  return saveWorkspaceDraftModel(updated);
}

export function removeDraftObject(workspaceId: WorkspaceId, objectId: string): WorkspaceDraftModel | null {
  return updateDraftModel(workspaceId, (draft) => {
    if (draft.status === "approved") return draft;
    const nextDraft = Object.freeze({
      ...draft,
      objects: Object.freeze(draft.objects.filter((object) => object.objectId !== objectId)),
      updatedAt: new Date().toISOString(),
      draftVersion: draft.draftVersion + 1,
    });
    emitDraftModelDiagnostic("Object Removed", { Workspace: workspaceId, objectId });
    return nextDraft;
  });
}

export function renameDraftObject(workspaceId: WorkspaceId, objectId: string, objectName: string): WorkspaceDraftModel | null {
  const cleanedName = objectName.trim();
  if (!cleanedName) return getWorkspaceDraftModel(workspaceId);
  return updateDraftModel(workspaceId, (draft) => {
    if (draft.status === "approved") return draft;
    const nextDraft = Object.freeze({
      ...draft,
      objects: Object.freeze(
        draft.objects.map((object) =>
          object.objectId === objectId
            ? Object.freeze({ ...object, objectName: cleanedName, source: "UserModified" as const })
            : object
        )
      ),
      updatedAt: new Date().toISOString(),
      draftVersion: draft.draftVersion + 1,
    });
    emitDraftModelDiagnostic("Object Renamed", { Workspace: workspaceId, objectId, objectName: cleanedName });
    return nextDraft;
  });
}

export function addDraftObject(workspaceId: WorkspaceId, objectName: string): WorkspaceDraftModel | null {
  const cleanedName = objectName.trim();
  if (!cleanedName) return getWorkspaceDraftModel(workspaceId);
  return updateDraftModel(workspaceId, (draft) => {
    if (draft.status === "approved") return draft;
    const baseId = `draft_${slugify(cleanedName)}`;
    const existingIds = new Set(draft.objects.map((object) => object.objectId));
    let objectId = baseId;
    let index = 1;
    while (existingIds.has(objectId)) {
      index += 1;
      objectId = `${baseId}_${index}`;
    }
    const nextObject: WorkspaceDraftObject = Object.freeze({
      objectId,
      objectName: cleanedName,
      objectType: "custom",
      suggestionReason: "Added by the user during draft model review.",
      confidence: 1,
      source: "UserModified",
    });
    const nextDraft = Object.freeze({
      ...draft,
      objects: Object.freeze([...draft.objects, nextObject]),
      updatedAt: new Date().toISOString(),
      draftVersion: draft.draftVersion + 1,
    });
    emitDraftModelDiagnostic("Object Added", { Workspace: workspaceId, objectId, objectName: cleanedName });
    return nextDraft;
  });
}

export function approveWorkspaceDraftModel(workspaceId: WorkspaceId): WorkspaceDraftModel | null {
  return updateDraftModel(workspaceId, (draft) => {
    const timestamp = new Date().toISOString();
    const nextDraft = Object.freeze({
      ...draft,
      status: "approved" as const,
      approvedAt: timestamp,
      updatedAt: timestamp,
      draftVersion: draft.draftVersion + 1,
    });
    emitDraftModelDiagnostic("Draft Approved", {
      Workspace: workspaceId,
      "Objects Generated": draft.objects.length,
    });
    return nextDraft;
  });
}

export function resetWorkspaceDraftModelsForTests(): void {
  workspaceDraftModels = {};
  draftModelStoreHydrated = true;
  workspaceDraftModelVersion = 0;
  workspaceDraftModelListeners.clear();
}
