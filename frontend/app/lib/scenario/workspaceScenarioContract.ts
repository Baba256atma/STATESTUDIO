/**
 * DS-7:1 — Workspace scenario intelligence foundation.
 * DS-7:1.5 — Scenario architecture reservation (placeholder owners only).
 * DS-7:1.6 — Scenario metrics reservation for Index Intelligence integration.
 * DS-7:4.5 — Scenario timeline reservation (lifecycle history owner only).
 * Foundation only — scenario definitions, registry, and persistence.
 *
 * Future ownership chain (reserved — no runtime behavior in DS-7:1.5+):
 *
 *   Scenario Foundation (DS-7:1)
 *     ↓
 *   Scenario Authoring — assumptions, overrides (DS-7:2)
 *     ↓
 *   Scenario Insight (DS-7:2)
 *     ↓
 *   Scenario Simulation (DS-7:3)
 *     ↓
 *   Scenario Comparison (DS-7:4)
 *     ↓
 *   Scenario Metrics — Index Intelligence integration point (IDX-1+)
 *     ↓
 *   Scenario Timeline — lifecycle history (Future Timeline Engine)
 *     ↓
 *   Timeline UI → Dashboard → Assistant (consumers)
 *     ↓
 *   Scenario Intelligence — notes (Future)
 *
 * Architecture rule: Scenario owns the container only. Scenario MUST NEVER calculate
 * executive indexes. Index Intelligence (IDX-1+) attaches to the reserved Metrics slot.
 * Scenario Timeline stores lifecycle events only — never KPI, risk, or index calculations.
 * No future module should modify Scenario metadata directly.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";

export const WORKSPACE_SCENARIO_VERSION = "DS-7:1" as const;

export const WORKSPACE_SCENARIO_TAGS = Object.freeze([
  "[DS71_SCENARIO_FOUNDATION]",
  "[SCENARIO_INTELLIGENCE_FOUNDATION]",
  "[SCENARIO_STORAGE_READY]",
  "[SCENARIO_CRUD_READY]",
  "[DS72_READY]",
  "[DS_7_1_COMPLETE]",
] as const);

export const NEXORA_SCENARIO_FOUNDATION_LOG_PREFIX = "[NexoraScenarioFoundation]" as const;

export const WORKSPACE_SCENARIO_SOURCE = "ds-7:1-foundation" as const;

export const WORKSPACE_SCENARIO_STORAGE_KEY = "nexora.workspaceScenarios.v1" as const;

export type WorkspaceScenarioStatus = "draft" | "active" | "archived";

export type WorkspaceScenarioType =
  | "baseline"
  | "optimistic"
  | "realistic"
  | "pessimistic"
  | "custom";

export type WorkspaceScenario = Readonly<{
  contractVersion: typeof WORKSPACE_SCENARIO_VERSION;
  scenarioId: string;
  workspaceId: WorkspaceId;
  name: string;
  description: string;
  status: WorkspaceScenarioStatus;
  scenarioType: WorkspaceScenarioType;
  createdAt: string;
  updatedAt: string;
  source: typeof WORKSPACE_SCENARIO_SOURCE;
}>;

export type WorkspaceScenarioMap = Readonly<Record<string, WorkspaceScenario>>;

export type WorkspaceScenarioStore = Readonly<Record<WorkspaceId, WorkspaceScenarioMap>>;

export type CreateWorkspaceScenarioInput = Readonly<{
  workspaceId: WorkspaceId;
  name: string;
  description?: string;
  status?: WorkspaceScenarioStatus;
  scenarioType?: WorkspaceScenarioType;
}>;

export type UpdateWorkspaceScenarioInput = Readonly<{
  workspaceId: WorkspaceId;
  scenarioId: string;
  name?: string;
  description?: string;
  status?: WorkspaceScenarioStatus;
  scenarioType?: WorkspaceScenarioType;
}>;

export type WorkspaceScenarioMutationResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  scenario: WorkspaceScenario | null;
  reason: string;
  message: string;
}>;

export type DeleteWorkspaceScenarioResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  scenarioId: string | null;
  deleted: boolean;
  reason: string;
  message: string;
}>;

export const WORKSPACE_SCENARIO_ARCHITECTURE_RESERVATION_VERSION = "DS-7:1.5" as const;

export const WORKSPACE_SCENARIO_ARCHITECTURE_RESERVATION_TAGS = Object.freeze([
  "[DS715_SCENARIO_ARCHITECTURE_RESERVED]",
  "[SCENARIO_OWNER_MODEL_READY]",
  "[FUTURE_PHASES_RESERVED]",
  "[NO_RUNTIME_BEHAVIOR]",
  "[DS72_READY]",
  "[DS_7_1_5_COMPLETE]",
] as const);

export type WorkspaceScenarioReservedPlaceholder = Readonly<{
  reserved: true;
  ownerPhase: string;
  description: string;
}>;

export type WorkspaceScenarioAssumptions = WorkspaceScenarioReservedPlaceholder;
export type WorkspaceScenarioOverrides = WorkspaceScenarioReservedPlaceholder;
export type WorkspaceScenarioSimulation = WorkspaceScenarioReservedPlaceholder;
export type WorkspaceScenarioComparison = WorkspaceScenarioReservedPlaceholder;
export type WorkspaceScenarioMetrics = WorkspaceScenarioReservedPlaceholder;
export type WorkspaceScenarioTimeline = WorkspaceScenarioReservedPlaceholder;
export type WorkspaceScenarioNotes = WorkspaceScenarioReservedPlaceholder;

export const WORKSPACE_SCENARIO_METRICS_RESERVATION_VERSION = "DS-7:1.6" as const;

export const WORKSPACE_SCENARIO_METRICS_RESERVATION_TAGS = Object.freeze([
  "[DS716_SCENARIO_METRICS_RESERVED]",
  "[SCENARIO_METRICS_OWNER_READY]",
  "[IDX1_INTEGRATION_RESERVED]",
  "[NO_RUNTIME_BEHAVIOR]",
  "[POST_MVP_INDEX_READY]",
  "[DS_7_1_6_COMPLETE]",
] as const);

/**
 * Documentation only — future Executive Index Intelligence outputs that may attach
 * to the reserved Scenario Metrics slot. Not implemented in DS-7:1.6.
 */
export const WORKSPACE_SCENARIO_METRICS_FUTURE_INDEXES = Object.freeze([
  "Scenario Risk Score",
  "Scenario Feasibility",
  "Expected ROI",
  "Cost Pressure Index",
  "Opportunity Score",
  "Execution Readiness",
  "Strategic Alignment",
  "Resource Constraint Score",
  "Time Sensitivity",
  "Decision Confidence",
  "Anomaly Score",
  "Future Executive Indexes",
] as const);

export const WORKSPACE_SCENARIO_TIMELINE_RESERVATION_VERSION = "DS-7:4.5" as const;

export const WORKSPACE_SCENARIO_TIMELINE_RESERVATION_TAGS = Object.freeze([
  "[DS745_SCENARIO_TIMELINE_RESERVED]",
  "[SCENARIO_TIMELINE_OWNER_READY]",
  "[SCENARIO_LIFECYCLE_RESERVED]",
  "[NO_RUNTIME_BEHAVIOR]",
  "[DS75_READY]",
  "[DS_7_4_5_COMPLETE]",
] as const);

/**
 * Documentation only — future Scenario Timeline lifecycle events.
 * Not implemented in DS-7:4.5. Timeline UI will consume these later.
 *
 * Scenario Timeline is a chronological history of Scenario evolution.
 * It is NOT an audit log, simulation engine, comparison engine, or workspace timeline.
 */
export const WORKSPACE_SCENARIO_TIMELINE_FUTURE_EVENTS = Object.freeze([
  "Scenario Created",
  "Scenario Renamed",
  "Assumption Added",
  "Assumption Updated",
  "Override Changed",
  "Insight Generated",
  "Simulation Executed",
  "Comparison Generated",
  "Decision Recorded",
  "Scenario Archived",
  "Future Events",
] as const);

export type WorkspaceScenarioReservedOwnerKey =
  | "assumptions"
  | "overrides"
  | "simulation"
  | "comparison"
  | "metrics"
  | "timeline"
  | "notes";

export type WorkspaceScenarioReservedOwner = Readonly<{
  ownerPhase: string;
  description: string;
}>;

export const WORKSPACE_SCENARIO_RESERVED_OWNERS: Readonly<
  Record<WorkspaceScenarioReservedOwnerKey, WorkspaceScenarioReservedOwner>
> = Object.freeze({
  assumptions: Object.freeze({
    ownerPhase: "DS-7:2",
    description: "Scenario assumptions and future-state inputs owned by Scenario Authoring.",
  }),
  overrides: Object.freeze({
    ownerPhase: "DS-7:2",
    description: "Scenario overrides and parameter adjustments owned by Scenario Authoring.",
  }),
  simulation: Object.freeze({
    ownerPhase: "DS-7:3",
    description: "Scenario simulation results owned by Scenario Simulation.",
  }),
  comparison: Object.freeze({
    ownerPhase: "DS-7:4",
    description: "Scenario comparison results owned by Scenario Comparison.",
  }),
  metrics: Object.freeze({
    ownerPhase: "IDX-1",
    description:
      "Scenario Metrics integration point reserved for Index Intelligence. Scenario never computes executive indexes.",
  }),
  timeline: Object.freeze({
    ownerPhase: "Future",
    description:
      "Scenario Timeline lifecycle history reserved for Future Timeline Engine. Stores scenario evolution events only.",
  }),
  notes: Object.freeze({
    ownerPhase: "Future",
    description: "Scenario notes and intelligence annotations reserved for a future phase.",
  }),
});

export const WORKSPACE_SCENARIO_RESERVED_PLACEHOLDERS: Readonly<
  Record<WorkspaceScenarioReservedOwnerKey, WorkspaceScenarioReservedPlaceholder>
> = Object.freeze({
  assumptions: Object.freeze({
    reserved: true,
    ownerPhase: WORKSPACE_SCENARIO_RESERVED_OWNERS.assumptions.ownerPhase,
    description: WORKSPACE_SCENARIO_RESERVED_OWNERS.assumptions.description,
  }),
  overrides: Object.freeze({
    reserved: true,
    ownerPhase: WORKSPACE_SCENARIO_RESERVED_OWNERS.overrides.ownerPhase,
    description: WORKSPACE_SCENARIO_RESERVED_OWNERS.overrides.description,
  }),
  simulation: Object.freeze({
    reserved: true,
    ownerPhase: WORKSPACE_SCENARIO_RESERVED_OWNERS.simulation.ownerPhase,
    description: WORKSPACE_SCENARIO_RESERVED_OWNERS.simulation.description,
  }),
  comparison: Object.freeze({
    reserved: true,
    ownerPhase: WORKSPACE_SCENARIO_RESERVED_OWNERS.comparison.ownerPhase,
    description: WORKSPACE_SCENARIO_RESERVED_OWNERS.comparison.description,
  }),
  metrics: Object.freeze({
    reserved: true,
    ownerPhase: WORKSPACE_SCENARIO_RESERVED_OWNERS.metrics.ownerPhase,
    description: WORKSPACE_SCENARIO_RESERVED_OWNERS.metrics.description,
  }),
  timeline: Object.freeze({
    reserved: true,
    ownerPhase: WORKSPACE_SCENARIO_RESERVED_OWNERS.timeline.ownerPhase,
    description: WORKSPACE_SCENARIO_RESERVED_OWNERS.timeline.description,
  }),
  notes: Object.freeze({
    reserved: true,
    ownerPhase: WORKSPACE_SCENARIO_RESERVED_OWNERS.notes.ownerPhase,
    description: WORKSPACE_SCENARIO_RESERVED_OWNERS.notes.description,
  }),
});

/** DS-7:1 metadata slot — persisted today via {@link WorkspaceScenario}. */
export type WorkspaceScenarioMetadata = WorkspaceScenario;

/**
 * Reserved scenario architecture tree — documents future child owners only.
 * Not persisted and not wired to runtime in DS-7:1.5 / DS-7:1.6.
 */
export type WorkspaceScenarioArchitectureTree = Readonly<{
  metadata: WorkspaceScenarioMetadata;
  assumptions: WorkspaceScenarioAssumptions;
  overrides: WorkspaceScenarioOverrides;
  simulation: WorkspaceScenarioSimulation;
  comparison: WorkspaceScenarioComparison;
  metrics: WorkspaceScenarioMetrics;
  timeline: WorkspaceScenarioTimeline;
  notes: WorkspaceScenarioNotes;
}>;

const STORAGE_KEY = WORKSPACE_SCENARIO_STORAGE_KEY;

const SCENARIO_STATUSES = new Set<WorkspaceScenarioStatus>(["draft", "active", "archived"]);

const SCENARIO_TYPES = new Set<WorkspaceScenarioType>([
  "baseline",
  "optimistic",
  "realistic",
  "pessimistic",
  "custom",
]);

let workspaceScenarioStore: WorkspaceScenarioStore = {};
let workspaceScenarioHydrated = false;
let workspaceScenarioVersion = 0;

type WorkspaceScenarioListener = () => void;

const workspaceScenarioListeners = new Set<WorkspaceScenarioListener>();

function nowIso(): string {
  return new Date().toISOString();
}

function slugify(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 80) || "scenario"
  );
}

function freezeScenario(scenario: WorkspaceScenario): WorkspaceScenario {
  return Object.freeze({ ...scenario });
}

function readStorage(): WorkspaceScenarioStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceScenarioStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceScenarioStore));
  } catch {
    // Scenario records remain available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceScenarioStore(): void {
  if (workspaceScenarioHydrated) return;
  workspaceScenarioHydrated = true;
  workspaceScenarioStore = readStorage();
}

function notifyWorkspaceScenarioListeners(): void {
  workspaceScenarioVersion += 1;
  workspaceScenarioListeners.forEach((listener) => listener());
}

function commitWorkspaceScenarioChange(): void {
  writeStorage();
  notifyWorkspaceScenarioListeners();
}

function emitScenarioDiagnostic(
  scenario: WorkspaceScenario,
  action: "created" | "updated" | "deleted"
): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("scenarioFoundation", NEXORA_SCENARIO_FOUNDATION_LOG_PREFIX, {
    workspaceId: scenario.workspaceId,
    scenarioId: scenario.scenarioId,
    action,
    tags: WORKSPACE_SCENARIO_TAGS,
    phase: "DS-7:1",
  });
}

function buildScenarioId(workspaceId: WorkspaceId, name: string, createdAt: string): string {
  return ["wscenario", slugify(workspaceId), slugify(name), slugify(createdAt)].join("_");
}

function buildWorkspaceScenario(input: {
  workspaceId: WorkspaceId;
  name: string;
  description: string;
  status: WorkspaceScenarioStatus;
  scenarioType: WorkspaceScenarioType;
  createdAt: string;
  updatedAt: string;
  scenarioId?: string;
}): WorkspaceScenario {
  return freezeScenario(
    Object.freeze({
      contractVersion: WORKSPACE_SCENARIO_VERSION,
      scenarioId: input.scenarioId ?? buildScenarioId(input.workspaceId, input.name, input.createdAt),
      workspaceId: input.workspaceId,
      name: input.name,
      description: input.description,
      status: input.status,
      scenarioType: input.scenarioType,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
      source: WORKSPACE_SCENARIO_SOURCE,
    })
  );
}

function validateScenarioInput(input: {
  name?: string;
  status?: WorkspaceScenarioStatus;
  scenarioType?: WorkspaceScenarioType;
}): string | null {
  if (input.name !== undefined && !input.name.trim()) return "missing_name";
  if (input.status !== undefined && !SCENARIO_STATUSES.has(input.status)) return "invalid_status";
  if (input.scenarioType !== undefined && !SCENARIO_TYPES.has(input.scenarioType)) {
    return "invalid_scenario_type";
  }
  return null;
}

export function createWorkspaceScenario(
  input: CreateWorkspaceScenarioInput
): WorkspaceScenarioMutationResult {
  hydrateWorkspaceScenarioStore();
  const trimmedWorkspaceId = input.workspaceId.trim();
  const validationError = validateScenarioInput({
    name: input.name,
    status: input.status,
    scenarioType: input.scenarioType,
  });
  if (!trimmedWorkspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      scenario: null,
      reason: "missing_workspace",
      message: "Provide a workspace before creating a scenario.",
    });
  }
  if (validationError) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      scenario: null,
      reason: validationError,
      message: "Scenario input is invalid.",
    });
  }

  const timestamp = nowIso();
  const scenario = buildWorkspaceScenario({
    workspaceId: trimmedWorkspaceId,
    name: input.name.trim(),
    description: input.description?.trim() ?? "",
    status: input.status ?? "draft",
    scenarioType: input.scenarioType ?? "custom",
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const existingMap = workspaceScenarioStore[trimmedWorkspaceId] ?? {};
  workspaceScenarioStore = Object.freeze({
    ...workspaceScenarioStore,
    [trimmedWorkspaceId]: Object.freeze({
      ...existingMap,
      [scenario.scenarioId]: scenario,
    }),
  });
  commitWorkspaceScenarioChange();
  emitScenarioDiagnostic(scenario, "created");

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    scenario,
    reason: "created",
    message: `Scenario "${scenario.name}" created.`,
  });
}

export function updateWorkspaceScenario(
  input: UpdateWorkspaceScenarioInput
): WorkspaceScenarioMutationResult {
  hydrateWorkspaceScenarioStore();
  const trimmedWorkspaceId = input.workspaceId.trim();
  const trimmedScenarioId = input.scenarioId.trim();
  if (!trimmedWorkspaceId || !trimmedScenarioId) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId || null,
      scenario: null,
      reason: "missing_identifier",
      message: "Provide workspace and scenario identifiers before updating.",
    });
  }

  const existing = workspaceScenarioStore[trimmedWorkspaceId]?.[trimmedScenarioId] ?? null;
  if (!existing) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      scenario: null,
      reason: "scenario_not_found",
      message: "Scenario not found for update.",
    });
  }

  const validationError = validateScenarioInput({
    name: input.name,
    status: input.status,
    scenarioType: input.scenarioType,
  });
  if (validationError) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      scenario: null,
      reason: validationError,
      message: "Scenario update input is invalid.",
    });
  }

  const updatedAt = nowIso();
  const scenario = freezeScenario(
    Object.freeze({
      ...buildWorkspaceScenario({
        workspaceId: trimmedWorkspaceId,
        name: input.name?.trim() ?? existing.name,
        description: input.description?.trim() ?? existing.description,
        status: input.status ?? existing.status,
        scenarioType: input.scenarioType ?? existing.scenarioType,
        createdAt: existing.createdAt,
        updatedAt,
        scenarioId: existing.scenarioId,
      }),
    })
  );

  workspaceScenarioStore = Object.freeze({
    ...workspaceScenarioStore,
    [trimmedWorkspaceId]: Object.freeze({
      ...(workspaceScenarioStore[trimmedWorkspaceId] ?? {}),
      [existing.scenarioId]: scenario,
    }),
  });
  commitWorkspaceScenarioChange();
  emitScenarioDiagnostic(scenario, "updated");

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    scenario,
    reason: "updated",
    message: `Scenario "${scenario.name}" updated.`,
  });
}

export function deleteWorkspaceScenario(
  workspaceId: WorkspaceId,
  scenarioId: string
): DeleteWorkspaceScenarioResult {
  hydrateWorkspaceScenarioStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedScenarioId = scenarioId.trim();
  if (!trimmedWorkspaceId || !trimmedScenarioId) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId || null,
      scenarioId: trimmedScenarioId || null,
      deleted: false,
      reason: "missing_identifier",
      message: "Provide workspace and scenario identifiers before deleting.",
    });
  }

  const existingMap = workspaceScenarioStore[trimmedWorkspaceId];
  const existing = existingMap?.[trimmedScenarioId] ?? null;
  if (!existing) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      scenarioId: trimmedScenarioId,
      deleted: false,
      reason: "scenario_not_found",
      message: "Scenario not found for deletion.",
    });
  }

  const nextEntries = Object.entries(existingMap ?? {}).filter(([id]) => id !== trimmedScenarioId);
  const nextStore = { ...workspaceScenarioStore };
  if (nextEntries.length === 0) {
    delete nextStore[trimmedWorkspaceId];
  } else {
    nextStore[trimmedWorkspaceId] = Object.freeze(Object.fromEntries(nextEntries));
  }
  workspaceScenarioStore = Object.freeze(nextStore);
  commitWorkspaceScenarioChange();
  emitScenarioDiagnostic(existing, "deleted");

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    scenarioId: trimmedScenarioId,
    deleted: true,
    reason: "deleted",
    message: `Scenario "${existing.name}" deleted.`,
  });
}

export function getWorkspaceScenarios(workspaceId: WorkspaceId): readonly WorkspaceScenario[] {
  hydrateWorkspaceScenarioStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(workspaceScenarioStore[trimmedWorkspaceId] ?? {}).map(freezeScenario)
  );
}

export function getWorkspaceScenario(
  workspaceId: WorkspaceId,
  scenarioId: string
): WorkspaceScenario | null {
  hydrateWorkspaceScenarioStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedScenarioId = scenarioId.trim();
  if (!trimmedWorkspaceId || !trimmedScenarioId) return null;
  const match = workspaceScenarioStore[trimmedWorkspaceId]?.[trimmedScenarioId] ?? null;
  return match ? freezeScenario(match) : null;
}

export function subscribeWorkspaceScenarioRegistry(listener: WorkspaceScenarioListener): () => void {
  hydrateWorkspaceScenarioStore();
  workspaceScenarioListeners.add(listener);
  return () => workspaceScenarioListeners.delete(listener);
}

export function getWorkspaceScenarioRegistryVersion(): number {
  hydrateWorkspaceScenarioStore();
  return workspaceScenarioVersion;
}

export function resetWorkspaceScenarioStoreForTests(): void {
  workspaceScenarioStore = {};
  workspaceScenarioHydrated = false;
  workspaceScenarioVersion = 0;
  workspaceScenarioListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}

export function resetWorkspaceScenarioMemoryForTests(): void {
  workspaceScenarioStore = {};
  workspaceScenarioHydrated = false;
  workspaceScenarioVersion = 0;
}
