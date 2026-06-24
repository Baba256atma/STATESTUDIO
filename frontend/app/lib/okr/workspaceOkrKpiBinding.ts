/**
 * DS-5:4 — Workspace OKR KPI binding.
 * Traceability only — links objectives to KPIs without recalculating progress or health.
 *
 * OWNERSHIP RULE
 * KPIs own operational measurement. OKRs own strategic objectives.
 * DS-5:4 creates traceability only — no KPI/OKR progress or health calculation.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import { getWorkspaceKpi, getWorkspaceKpis } from "../kpi/workspaceKpiContract.ts";
import {
  getWorkspaceObjective,
  getWorkspaceObjectives,
} from "./workspaceOkrContract.ts";

export const WORKSPACE_OKR_KPI_BINDING_VERSION = "DS-5:4" as const;

export const WORKSPACE_OKR_KPI_BINDING_TAGS = Object.freeze([
  "[DS54_OKR_KPI_BINDING]",
  "[OKR_KPI_TRACEABILITY_READY]",
  "[OBJECTIVES_LINKED_TO_KPIS]",
  "[OKR_KPI_BINDINGS_PERSISTED]",
  "[DS55_READY]",
  "[DS_5_4_COMPLETE]",
] as const);

export const NEXORA_OKR_KPI_BINDING_LOG_PREFIX = "[NexoraOkrKpiBinding]" as const;

export const WORKSPACE_OKR_KPI_BINDING_SOURCE = "ds-5:4-okr-kpi-binding" as const;

export const WORKSPACE_OKR_KPI_BINDING_STORAGE_KEY =
  "nexora.workspaceOkrKpiBindings.v1" as const;

export type WorkspaceOkrKpiBindingStrength = "weak" | "medium" | "strong" | "critical";

export type WorkspaceOkrKpiBinding = Readonly<{
  contractVersion: typeof WORKSPACE_OKR_KPI_BINDING_VERSION;
  workspaceId: WorkspaceId;
  bindingId: string;
  objectiveId: string;
  kpiId: string;
  bindingStrength: WorkspaceOkrKpiBindingStrength;
  bindingConfidence: number;
  bindingReason: string;
  createdAt: string;
  updatedAt: string;
  source: typeof WORKSPACE_OKR_KPI_BINDING_SOURCE;
}>;

export type WorkspaceOkrKpiBindingMap = Readonly<Record<string, WorkspaceOkrKpiBinding>>;

export type WorkspaceOkrKpiBindingStore = Readonly<
  Record<WorkspaceId, WorkspaceOkrKpiBindingMap>
>;

export type BindObjectiveToKpiResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  binding: WorkspaceOkrKpiBinding | null;
  created: boolean;
  reason: string;
  message: string;
}>;

export type UnbindObjectiveFromKpiResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  bindingId: string | null;
  deleted: boolean;
  reason: string;
  message: string;
}>;

export type SuggestOkrKpiBindingsResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  bindings: readonly WorkspaceOkrKpiBinding[];
  createdCount: number;
  duplicateCount: number;
  skippedCount: number;
  reason: string;
  message: string;
}>;

export type OkrKpiBindingMatch = Readonly<{
  kpiId: string;
  kpiName: string;
  bindingConfidence: number;
  bindingStrength: WorkspaceOkrKpiBindingStrength;
  bindingReason: string;
  matchKind: "exact" | "strong_keyword" | "related_domain" | "weak_fallback" | "none";
}>;

const STORAGE_KEY = WORKSPACE_OKR_KPI_BINDING_STORAGE_KEY;

const KEYWORD_RULES = Object.freeze([
  Object.freeze({
    objectiveKeywords: ["market"],
    kpiKeywords: ["market", "revenue", "growth", "customer"],
    domain: "market",
  }),
  Object.freeze({
    objectiveKeywords: ["retention"],
    kpiKeywords: ["retention", "customer", "satisfaction"],
    domain: "retention",
  }),
  Object.freeze({
    objectiveKeywords: ["efficiency"],
    kpiKeywords: ["cost", "cycle", "throughput", "efficiency"],
    domain: "efficiency",
  }),
  Object.freeze({
    objectiveKeywords: ["forecast"],
    kpiKeywords: ["forecast", "accuracy", "planning"],
    domain: "forecast",
  }),
] as const);

let workspaceOkrKpiBindingStore: WorkspaceOkrKpiBindingStore = {};
let workspaceOkrKpiBindingHydrated = false;
let workspaceOkrKpiBindingVersion = 0;

type WorkspaceOkrKpiBindingListener = () => void;

const workspaceOkrKpiBindingListeners = new Set<WorkspaceOkrKpiBindingListener>();

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
      .slice(0, 80) || "binding"
  );
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function freezeBinding(binding: WorkspaceOkrKpiBinding): WorkspaceOkrKpiBinding {
  return Object.freeze({ ...binding });
}

function readStorage(): WorkspaceOkrKpiBindingStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceOkrKpiBindingStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceOkrKpiBindingStore));
  } catch {
    // OKR KPI bindings remain available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceOkrKpiBindingStore(): void {
  if (workspaceOkrKpiBindingHydrated) return;
  workspaceOkrKpiBindingHydrated = true;
  workspaceOkrKpiBindingStore = readStorage();
}

function notifyWorkspaceOkrKpiBindingListeners(): void {
  workspaceOkrKpiBindingVersion += 1;
  workspaceOkrKpiBindingListeners.forEach((listener) => listener());
}

function commitWorkspaceOkrKpiBindingChange(): void {
  writeStorage();
  notifyWorkspaceOkrKpiBindingListeners();
}

function emitOkrKpiBindingDiagnostic(input: {
  binding: WorkspaceOkrKpiBinding;
  action: "created" | "duplicate" | "deleted" | "suggested";
}): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("okrKpiBinding", NEXORA_OKR_KPI_BINDING_LOG_PREFIX, {
    workspaceId: input.binding.workspaceId,
    objectiveId: input.binding.objectiveId,
    kpiId: input.binding.kpiId,
    bindingStrength: input.binding.bindingStrength,
    bindingConfidence: input.binding.bindingConfidence,
    action: input.action,
    tags: WORKSPACE_OKR_KPI_BINDING_TAGS,
    phase: "DS-5:4",
  });
}

export function deriveOkrKpiBindingStrengthFromConfidence(
  confidence: number
): WorkspaceOkrKpiBindingStrength {
  if (confidence >= 0.95) return "critical";
  if (confidence >= 0.8) return "strong";
  if (confidence >= 0.65) return "medium";
  return "weak";
}

function bindingIdFor(input: {
  workspaceId: WorkspaceId;
  objectiveId: string;
  kpiId: string;
}): string {
  return [
    "wokr_kpi_bind",
    slugify(input.workspaceId),
    slugify(input.objectiveId),
    slugify(input.kpiId),
  ].join("_");
}

function containsKeyword(haystack: string, keyword: string): boolean {
  return haystack.includes(keyword.toLowerCase());
}

function exactTitleMatch(objectiveTitle: string, kpiName: string): boolean {
  const normalizedObjective = normalizeText(objectiveTitle);
  const normalizedKpi = normalizeText(kpiName);
  if (!normalizedObjective || !normalizedKpi) return false;
  return normalizedObjective === normalizedKpi;
}

export function resolveOkrKpiBindingMatch(input: {
  objectiveTitle: string;
  kpiName: string;
}): OkrKpiBindingMatch {
  const objectiveHaystack = normalizeText(input.objectiveTitle);
  const kpiHaystack = normalizeText(input.kpiName);

  if (exactTitleMatch(input.objectiveTitle, input.kpiName)) {
    return Object.freeze({
      kpiId: "",
      kpiName: input.kpiName,
      bindingConfidence: 0.95,
      bindingStrength: deriveOkrKpiBindingStrengthFromConfidence(0.95),
      bindingReason: `${input.kpiName} exactly matches objective ${input.objectiveTitle}.`,
      matchKind: "exact",
    });
  }

  for (const rule of KEYWORD_RULES) {
    const objectiveMatchesRule = rule.objectiveKeywords.some((keyword) =>
      containsKeyword(objectiveHaystack, keyword)
    );
    if (!objectiveMatchesRule) continue;

    const sharedKeyword = rule.objectiveKeywords.find(
      (keyword) =>
        containsKeyword(objectiveHaystack, keyword) && containsKeyword(kpiHaystack, keyword)
    );
    if (sharedKeyword) {
      return Object.freeze({
        kpiId: "",
        kpiName: input.kpiName,
        bindingConfidence: 0.8,
        bindingStrength: deriveOkrKpiBindingStrengthFromConfidence(0.8),
        bindingReason: `${input.kpiName} strongly matches ${input.objectiveTitle} via ${rule.domain} keywords.`,
        matchKind: "strong_keyword",
      });
    }

    const relatedKpiMatch = rule.kpiKeywords.some((keyword) => containsKeyword(kpiHaystack, keyword));
    if (relatedKpiMatch) {
      return Object.freeze({
        kpiId: "",
        kpiName: input.kpiName,
        bindingConfidence: 0.65,
        bindingStrength: deriveOkrKpiBindingStrengthFromConfidence(0.65),
        bindingReason: `${input.kpiName} relates to ${input.objectiveTitle} through ${rule.domain} domain keywords.`,
        matchKind: "related_domain",
      });
    }
  }

  const weakKeyword = KEYWORD_RULES.flatMap((rule) => rule.kpiKeywords).find((keyword) =>
    containsKeyword(kpiHaystack, keyword)
  );
  if (weakKeyword && KEYWORD_RULES.some((rule) =>
    rule.objectiveKeywords.some((keyword) => containsKeyword(objectiveHaystack, keyword))
  )) {
    return Object.freeze({
      kpiId: "",
      kpiName: input.kpiName,
      bindingConfidence: 0.4,
      bindingStrength: deriveOkrKpiBindingStrengthFromConfidence(0.4),
      bindingReason: `${input.kpiName} has a weak keyword overlap with ${input.objectiveTitle}.`,
      matchKind: "weak_fallback",
    });
  }

  return Object.freeze({
    kpiId: "",
    kpiName: input.kpiName,
    bindingConfidence: 0,
    bindingStrength: "weak",
    bindingReason: "No OKR KPI binding match found.",
    matchKind: "none",
  });
}

export function suggestOkrKpiBindingMatches(input: {
  objectiveTitle: string;
  kpis: readonly { kpiId: string; kpiName: string }[];
}): readonly OkrKpiBindingMatch[] {
  const matches: OkrKpiBindingMatch[] = [];
  for (const kpi of input.kpis) {
    const match = resolveOkrKpiBindingMatch({
      objectiveTitle: input.objectiveTitle,
      kpiName: kpi.kpiName,
    });
    if (match.matchKind === "none" || match.bindingConfidence < 0.4) continue;
    matches.push(
      Object.freeze({
        ...match,
        kpiId: kpi.kpiId,
      })
    );
  }
  return Object.freeze(matches);
}

function findExistingBinding(input: {
  workspaceId: WorkspaceId;
  objectiveId: string;
  kpiId: string;
}): WorkspaceOkrKpiBinding | null {
  const bindings = workspaceOkrKpiBindingStore[input.workspaceId] ?? {};
  const match =
    Object.values(bindings).find(
      (binding) =>
        binding.objectiveId === input.objectiveId && binding.kpiId === input.kpiId
    ) ?? null;
  return match ? freezeBinding(match) : null;
}

function buildBinding(input: {
  workspaceId: WorkspaceId;
  objectiveId: string;
  kpiId: string;
  bindingStrength: WorkspaceOkrKpiBindingStrength;
  bindingConfidence: number;
  bindingReason: string;
  createdAt?: string;
}): WorkspaceOkrKpiBinding {
  const timestamp = input.createdAt ?? nowIso();
  return freezeBinding(
    Object.freeze({
      contractVersion: WORKSPACE_OKR_KPI_BINDING_VERSION,
      workspaceId: input.workspaceId,
      bindingId: bindingIdFor({
        workspaceId: input.workspaceId,
        objectiveId: input.objectiveId,
        kpiId: input.kpiId,
      }),
      objectiveId: input.objectiveId,
      kpiId: input.kpiId,
      bindingStrength: input.bindingStrength,
      bindingConfidence: input.bindingConfidence,
      bindingReason: input.bindingReason,
      createdAt: timestamp,
      updatedAt: timestamp,
      source: WORKSPACE_OKR_KPI_BINDING_SOURCE,
    })
  );
}

function persistBinding(binding: WorkspaceOkrKpiBinding): WorkspaceOkrKpiBinding {
  const existingMap = workspaceOkrKpiBindingStore[binding.workspaceId] ?? {};
  workspaceOkrKpiBindingStore = Object.freeze({
    ...workspaceOkrKpiBindingStore,
    [binding.workspaceId]: Object.freeze({
      ...existingMap,
      [binding.bindingId]: binding,
    }),
  });
  commitWorkspaceOkrKpiBindingChange();
  return binding;
}

export function bindObjectiveToKpi(
  workspaceId: WorkspaceId,
  objectiveId: string,
  kpiId: string
): BindObjectiveToKpiResult {
  hydrateWorkspaceOkrKpiBindingStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedObjectiveId = objectiveId.trim();
  const trimmedKpiId = kpiId.trim();

  if (!trimmedWorkspaceId || !trimmedObjectiveId || !trimmedKpiId) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId || null,
      binding: null,
      created: false,
      reason: "missing_identifier",
      message: "Provide workspace, objective, and KPI identifiers before binding.",
    });
  }

  const objective = getWorkspaceObjective(trimmedWorkspaceId, trimmedObjectiveId);
  if (!objective) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      binding: null,
      created: false,
      reason: "objective_not_found",
      message: "Objective not found for binding.",
    });
  }

  const kpi = getWorkspaceKpi(trimmedWorkspaceId, trimmedKpiId);
  if (!kpi) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      binding: null,
      created: false,
      reason: "kpi_not_found",
      message: "KPI not found for binding.",
    });
  }

  const existing = findExistingBinding({
    workspaceId: trimmedWorkspaceId,
    objectiveId: trimmedObjectiveId,
    kpiId: trimmedKpiId,
  });
  if (existing) {
    emitOkrKpiBindingDiagnostic({ binding: existing, action: "duplicate" });
    return Object.freeze({
      success: true,
      workspaceId: trimmedWorkspaceId,
      binding: existing,
      created: false,
      reason: "duplicate",
      message: "Existing OKR KPI binding returned.",
    });
  }

  const binding = buildBinding({
    workspaceId: trimmedWorkspaceId,
    objectiveId: trimmedObjectiveId,
    kpiId: trimmedKpiId,
    bindingStrength: "critical",
    bindingConfidence: 1,
    bindingReason: `Manually bound objective "${objective.title}" to KPI "${kpi.name}".`,
  });
  persistBinding(binding);
  emitOkrKpiBindingDiagnostic({ binding, action: "created" });

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    binding,
    created: true,
    reason: "created",
    message: `Objective "${objective.title}" bound to KPI "${kpi.name}".`,
  });
}

export function unbindObjectiveFromKpi(
  workspaceId: WorkspaceId,
  bindingId: string
): UnbindObjectiveFromKpiResult {
  hydrateWorkspaceOkrKpiBindingStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedBindingId = bindingId.trim();

  if (!trimmedWorkspaceId || !trimmedBindingId) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId || null,
      bindingId: trimmedBindingId || null,
      deleted: false,
      reason: "missing_identifier",
      message: "Provide workspace and binding identifiers before unbinding.",
    });
  }

  const existingMap = workspaceOkrKpiBindingStore[trimmedWorkspaceId];
  const existing = existingMap?.[trimmedBindingId] ?? null;
  if (!existing) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      bindingId: trimmedBindingId,
      deleted: false,
      reason: "binding_not_found",
      message: "OKR KPI binding not found for deletion.",
    });
  }

  const nextEntries = Object.entries(existingMap ?? {}).filter(([id]) => id !== trimmedBindingId);
  const nextStore = { ...workspaceOkrKpiBindingStore };
  if (nextEntries.length === 0) {
    delete nextStore[trimmedWorkspaceId];
  } else {
    nextStore[trimmedWorkspaceId] = Object.freeze(Object.fromEntries(nextEntries));
  }
  workspaceOkrKpiBindingStore = Object.freeze(nextStore);
  commitWorkspaceOkrKpiBindingChange();
  emitOkrKpiBindingDiagnostic({ binding: existing, action: "deleted" });

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    bindingId: trimmedBindingId,
    deleted: true,
    reason: "deleted",
    message: "OKR KPI binding removed.",
  });
}

export function getOkrKpiBindings(
  workspaceId: WorkspaceId
): readonly WorkspaceOkrKpiBinding[] {
  hydrateWorkspaceOkrKpiBindingStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(workspaceOkrKpiBindingStore[trimmedWorkspaceId] ?? {}).map(freezeBinding)
  );
}

export function getOkrKpiBindingsForObjective(
  workspaceId: WorkspaceId,
  objectiveId: string
): readonly WorkspaceOkrKpiBinding[] {
  const trimmedObjectiveId = objectiveId.trim();
  return Object.freeze(
    getOkrKpiBindings(workspaceId).filter(
      (binding) => binding.objectiveId === trimmedObjectiveId
    )
  );
}

export function getOkrKpiBindingsForKpi(
  workspaceId: WorkspaceId,
  kpiId: string
): readonly WorkspaceOkrKpiBinding[] {
  const trimmedKpiId = kpiId.trim();
  return Object.freeze(
    getOkrKpiBindings(workspaceId).filter((binding) => binding.kpiId === trimmedKpiId)
  );
}

export function suggestOkrKpiBindings(
  workspaceId: WorkspaceId
): SuggestOkrKpiBindingsResult {
  hydrateWorkspaceOkrKpiBindingStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      bindings: Object.freeze([]),
      createdCount: 0,
      duplicateCount: 0,
      skippedCount: 0,
      reason: "missing_workspace",
      message: "Provide a workspace before suggesting OKR KPI bindings.",
    });
  }

  const objectives = getWorkspaceObjectives(trimmedWorkspaceId);
  const kpis = getWorkspaceKpis(trimmedWorkspaceId);

  if (objectives.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      bindings: Object.freeze([]),
      createdCount: 0,
      duplicateCount: 0,
      skippedCount: 0,
      reason: "no_objectives",
      message: "Create workspace objectives before suggesting KPI bindings.",
    });
  }

  if (kpis.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      bindings: Object.freeze([]),
      createdCount: 0,
      duplicateCount: 0,
      skippedCount: objectives.length,
      reason: "no_kpis",
      message: "Create workspace KPIs before suggesting OKR bindings.",
    });
  }

  const kpiSummaries = kpis.map((kpi) =>
    Object.freeze({ kpiId: kpi.kpiId, kpiName: kpi.name })
  );

  const bindings: WorkspaceOkrKpiBinding[] = [];
  let createdCount = 0;
  let duplicateCount = 0;
  let skippedCount = 0;

  for (const objective of objectives) {
    const matches = suggestOkrKpiBindingMatches({
      objectiveTitle: objective.title,
      kpis: kpiSummaries,
    });

    if (matches.length === 0) {
      skippedCount += 1;
      continue;
    }

    for (const match of matches) {
      const existing = findExistingBinding({
        workspaceId: trimmedWorkspaceId,
        objectiveId: objective.objectiveId,
        kpiId: match.kpiId,
      });
      if (existing) {
        bindings.push(existing);
        duplicateCount += 1;
        emitOkrKpiBindingDiagnostic({ binding: existing, action: "duplicate" });
        continue;
      }

      const binding = buildBinding({
        workspaceId: trimmedWorkspaceId,
        objectiveId: objective.objectiveId,
        kpiId: match.kpiId,
        bindingStrength: match.bindingStrength,
        bindingConfidence: match.bindingConfidence,
        bindingReason: match.bindingReason,
      });
      persistBinding(binding);
      bindings.push(binding);
      createdCount += 1;
      emitOkrKpiBindingDiagnostic({ binding, action: "suggested" });
    }
  }

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    bindings: Object.freeze(bindings.map(freezeBinding)),
    createdCount,
    duplicateCount,
    skippedCount,
    reason: "suggested",
    message: `${createdCount} OKR KPI binding${createdCount === 1 ? "" : "s"} suggested.`,
  });
}

export function subscribeWorkspaceOkrKpiBindingRegistry(
  listener: WorkspaceOkrKpiBindingListener
): () => void {
  hydrateWorkspaceOkrKpiBindingStore();
  workspaceOkrKpiBindingListeners.add(listener);
  return () => workspaceOkrKpiBindingListeners.delete(listener);
}

export function getWorkspaceOkrKpiBindingRegistryVersion(): number {
  hydrateWorkspaceOkrKpiBindingStore();
  return workspaceOkrKpiBindingVersion;
}

export function resetWorkspaceOkrKpiBindingStoreForTests(): void {
  workspaceOkrKpiBindingStore = {};
  workspaceOkrKpiBindingHydrated = false;
  workspaceOkrKpiBindingVersion = 0;
  workspaceOkrKpiBindingListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}

export function resetWorkspaceOkrKpiBindingMemoryForTests(): void {
  workspaceOkrKpiBindingStore = {};
  workspaceOkrKpiBindingHydrated = false;
  workspaceOkrKpiBindingVersion = 0;
}
