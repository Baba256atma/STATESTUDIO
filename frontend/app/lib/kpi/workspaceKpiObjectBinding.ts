/**
 * DS-4:4 — Workspace KPI object binding.
 * Binding only — links KPIs to workspace objects with traceability.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import { getObjectIntelligenceProfiles } from "../workspace/workspaceObjectIntelligenceContract.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import { getWorkspaceKpi, getWorkspaceKpis } from "./workspaceKpiContract.ts";

export const WORKSPACE_KPI_OBJECT_BINDING_VERSION = "DS-4:4" as const;

export const WORKSPACE_KPI_OBJECT_BINDING_TAGS = Object.freeze([
  "[DS44_KPI_OBJECT_BINDING]",
  "[KPI_OBJECT_BINDINGS_READY]",
  "[KPI_TO_OBJECT_TRACEABILITY]",
  "[KPI_BINDING_PERSISTED]",
  "[DS45_READY]",
  "[DS_4_4_COMPLETE]",
] as const);

export const NEXORA_KPI_OBJECT_BINDING_LOG_PREFIX = "[NexoraKpiObjectBinding]" as const;

export const WORKSPACE_KPI_OBJECT_BINDING_SOURCE = "ds-4:4-kpi-object-binding" as const;

export const WORKSPACE_KPI_OBJECT_BINDING_STORAGE_KEY =
  "nexora.workspaceKpiObjectBindings.v1" as const;

export type WorkspaceKpiBindingStrength = "weak" | "medium" | "strong" | "critical";

export type WorkspaceKpiObjectBinding = Readonly<{
  contractVersion: typeof WORKSPACE_KPI_OBJECT_BINDING_VERSION;
  workspaceId: WorkspaceId;
  bindingId: string;
  kpiId: string;
  objectId: string;
  bindingStrength: WorkspaceKpiBindingStrength;
  bindingConfidence: number;
  bindingReason: string;
  createdAt: string;
  updatedAt: string;
  source: typeof WORKSPACE_KPI_OBJECT_BINDING_SOURCE;
}>;

export type WorkspaceKpiObjectBindingMap = Readonly<Record<string, WorkspaceKpiObjectBinding>>;

export type WorkspaceKpiObjectBindingStore = Readonly<
  Record<WorkspaceId, WorkspaceKpiObjectBindingMap>
>;

export type BindKpiToObjectResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  binding: WorkspaceKpiObjectBinding | null;
  created: boolean;
  reason: string;
  message: string;
}>;

export type UnbindKpiFromObjectResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  bindingId: string | null;
  deleted: boolean;
  reason: string;
  message: string;
}>;

export type SuggestKpiObjectBindingsResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  bindings: readonly WorkspaceKpiObjectBinding[];
  createdCount: number;
  duplicateCount: number;
  skippedCount: number;
  reason: string;
  message: string;
}>;

export type KpiObjectBindingMatch = Readonly<{
  objectId: string;
  objectName: string;
  objectType: string;
  bindingConfidence: number;
  bindingStrength: WorkspaceKpiBindingStrength;
  bindingReason: string;
  matchKind: "exact" | "strong_keyword" | "related_domain" | "weak_fallback" | "none";
}>;

const STORAGE_KEY = WORKSPACE_KPI_OBJECT_BINDING_STORAGE_KEY;

const KEYWORD_RULES = Object.freeze([
  Object.freeze({ kpiKeywords: ["forecast"], objectKeywords: ["forecast"], domain: "forecast" }),
  Object.freeze({
    kpiKeywords: ["revenue"],
    objectKeywords: ["sales", "revenue", "finance"],
    domain: "revenue",
  }),
  Object.freeze({
    kpiKeywords: ["inventory"],
    objectKeywords: ["inventory", "warehouse"],
    domain: "inventory",
  }),
  Object.freeze({ kpiKeywords: ["customer"], objectKeywords: ["customer"], domain: "customer" }),
  Object.freeze({
    kpiKeywords: ["delivery"],
    objectKeywords: ["delivery", "logistics", "operations"],
    domain: "delivery",
  }),
] as const);

let workspaceKpiObjectBindingStore: WorkspaceKpiObjectBindingStore = {};
let workspaceKpiObjectBindingHydrated = false;
let workspaceKpiObjectBindingVersion = 0;

type WorkspaceKpiObjectBindingListener = () => void;

const workspaceKpiObjectBindingListeners = new Set<WorkspaceKpiObjectBindingListener>();

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

function freezeBinding(binding: WorkspaceKpiObjectBinding): WorkspaceKpiObjectBinding {
  return Object.freeze({ ...binding });
}

function readStorage(): WorkspaceKpiObjectBindingStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceKpiObjectBindingStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceKpiObjectBindingStore));
  } catch {
    // KPI object bindings remain available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceKpiObjectBindingStore(): void {
  if (workspaceKpiObjectBindingHydrated) return;
  workspaceKpiObjectBindingHydrated = true;
  workspaceKpiObjectBindingStore = readStorage();
}

function notifyWorkspaceKpiObjectBindingListeners(): void {
  workspaceKpiObjectBindingVersion += 1;
  workspaceKpiObjectBindingListeners.forEach((listener) => listener());
}

function commitWorkspaceKpiObjectBindingChange(): void {
  writeStorage();
  notifyWorkspaceKpiObjectBindingListeners();
}

function emitKpiObjectBindingDiagnostic(input: {
  binding: WorkspaceKpiObjectBinding;
  action: "created" | "duplicate" | "deleted" | "suggested";
}): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("kpiObjectBinding", NEXORA_KPI_OBJECT_BINDING_LOG_PREFIX, {
    workspaceId: input.binding.workspaceId,
    bindingId: input.binding.bindingId,
    kpiId: input.binding.kpiId,
    objectId: input.binding.objectId,
    bindingStrength: input.binding.bindingStrength,
    bindingConfidence: input.binding.bindingConfidence,
    action: input.action,
    tags: WORKSPACE_KPI_OBJECT_BINDING_TAGS,
    phase: "DS-4:4",
  });
}

export function deriveBindingStrengthFromConfidence(
  confidence: number
): WorkspaceKpiBindingStrength {
  if (confidence >= 0.95) return "critical";
  if (confidence >= 0.8) return "strong";
  if (confidence >= 0.65) return "medium";
  return "weak";
}

function bindingIdFor(input: {
  workspaceId: WorkspaceId;
  kpiId: string;
  objectId: string;
}): string {
  return [
    "wkpi_bind",
    slugify(input.workspaceId),
    slugify(input.kpiId),
    slugify(input.objectId),
  ].join("_");
}

function objectHaystack(objectName: string, objectType: string): string {
  return `${objectName} ${objectType}`.toLowerCase();
}

function containsKeyword(haystack: string, keyword: string): boolean {
  return haystack.includes(keyword.toLowerCase());
}

function exactNameMatch(kpiName: string, objectName: string): boolean {
  const normalizedKpi = normalizeText(kpiName);
  const normalizedObject = normalizeText(objectName);
  if (!normalizedKpi || !normalizedObject) return false;
  return normalizedKpi === normalizedObject;
}

export function resolveKpiObjectBindingMatch(input: {
  kpiName: string;
  objectName: string;
  objectType: string;
}): KpiObjectBindingMatch {
  const kpiHaystack = normalizeText(input.kpiName);
  const objectText = objectHaystack(input.objectName, input.objectType);

  if (exactNameMatch(input.kpiName, input.objectName)) {
    return Object.freeze({
      objectId: "",
      objectName: input.objectName,
      objectType: input.objectType,
      bindingConfidence: 0.95,
      bindingStrength: deriveBindingStrengthFromConfidence(0.95),
      bindingReason: `${input.kpiName} exactly matches ${input.objectName}.`,
      matchKind: "exact",
    });
  }

  for (const rule of KEYWORD_RULES) {
    const kpiMatchesRule = rule.kpiKeywords.some((keyword) => containsKeyword(kpiHaystack, keyword));
    if (!kpiMatchesRule) continue;

    const strongObjectMatch = rule.objectKeywords.some((keyword) =>
      containsKeyword(objectText, keyword)
    );
    if (strongObjectMatch && rule.kpiKeywords.some((keyword) => containsKeyword(objectText, keyword))) {
      return Object.freeze({
        objectId: "",
        objectName: input.objectName,
        objectType: input.objectType,
        bindingConfidence: 0.8,
        bindingStrength: deriveBindingStrengthFromConfidence(0.8),
        bindingReason: `${input.kpiName} strongly matches ${input.objectName} via ${rule.domain} keywords.`,
        matchKind: "strong_keyword",
      });
    }

    if (strongObjectMatch) {
      return Object.freeze({
        objectId: "",
        objectName: input.objectName,
        objectType: input.objectType,
        bindingConfidence: 0.65,
        bindingStrength: deriveBindingStrengthFromConfidence(0.65),
        bindingReason: `${input.kpiName} relates to ${input.objectName} through ${rule.domain} domain keywords.`,
        matchKind: "related_domain",
      });
    }
  }

  const weakKeyword = KEYWORD_RULES.flatMap((rule) => rule.objectKeywords).find((keyword) =>
    containsKeyword(objectText, keyword)
  );
  if (weakKeyword) {
    return Object.freeze({
      objectId: "",
      objectName: input.objectName,
      objectType: input.objectType,
      bindingConfidence: 0.4,
      bindingStrength: deriveBindingStrengthFromConfidence(0.4),
      bindingReason: `${input.kpiName} has a weak keyword overlap with ${input.objectName}.`,
      matchKind: "weak_fallback",
    });
  }

  return Object.freeze({
    objectId: "",
    objectName: input.objectName,
    objectType: input.objectType,
    bindingConfidence: 0,
    bindingStrength: "weak",
    bindingReason: "No KPI object binding match found.",
    matchKind: "none",
  });
}

export function suggestKpiObjectBindingMatches(input: {
  kpiName: string;
  objects: readonly {
    objectId: string;
    objectName: string;
    objectType: string;
  }[];
}): KpiObjectBindingMatch | null {
  let best: (KpiObjectBindingMatch & { objectId: string }) | null = null;
  for (const object of input.objects) {
    const match = resolveKpiObjectBindingMatch({
      kpiName: input.kpiName,
      objectName: object.objectName,
      objectType: object.objectType,
    });
    if (match.matchKind === "none" || match.bindingConfidence < 0.4) continue;
    const candidate = Object.freeze({
      ...match,
      objectId: object.objectId,
    });
    if (!best || candidate.bindingConfidence > best.bindingConfidence) {
      best = candidate;
    }
  }
  return best;
}

function findExistingBinding(input: {
  workspaceId: WorkspaceId;
  kpiId: string;
  objectId: string;
}): WorkspaceKpiObjectBinding | null {
  const bindings = workspaceKpiObjectBindingStore[input.workspaceId] ?? {};
  const match =
    Object.values(bindings).find(
      (binding) => binding.kpiId === input.kpiId && binding.objectId === input.objectId
    ) ?? null;
  return match ? freezeBinding(match) : null;
}

function buildBinding(input: {
  workspaceId: WorkspaceId;
  kpiId: string;
  objectId: string;
  bindingStrength: WorkspaceKpiBindingStrength;
  bindingConfidence: number;
  bindingReason: string;
  createdAt?: string;
}): WorkspaceKpiObjectBinding {
  const timestamp = input.createdAt ?? nowIso();
  return freezeBinding(
    Object.freeze({
      contractVersion: WORKSPACE_KPI_OBJECT_BINDING_VERSION,
      workspaceId: input.workspaceId,
      bindingId: bindingIdFor({
        workspaceId: input.workspaceId,
        kpiId: input.kpiId,
        objectId: input.objectId,
      }),
      kpiId: input.kpiId,
      objectId: input.objectId,
      bindingStrength: input.bindingStrength,
      bindingConfidence: input.bindingConfidence,
      bindingReason: input.bindingReason,
      createdAt: timestamp,
      updatedAt: timestamp,
      source: WORKSPACE_KPI_OBJECT_BINDING_SOURCE,
    })
  );
}

function persistBinding(binding: WorkspaceKpiObjectBinding): WorkspaceKpiObjectBinding {
  const existingMap = workspaceKpiObjectBindingStore[binding.workspaceId] ?? {};
  workspaceKpiObjectBindingStore = Object.freeze({
    ...workspaceKpiObjectBindingStore,
    [binding.workspaceId]: Object.freeze({
      ...existingMap,
      [binding.bindingId]: binding,
    }),
  });
  commitWorkspaceKpiObjectBindingChange();
  return binding;
}

export function bindKpiToObject(
  workspaceId: WorkspaceId,
  kpiId: string,
  objectId: string
): BindKpiToObjectResult {
  hydrateWorkspaceKpiObjectBindingStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedKpiId = kpiId.trim();
  const trimmedObjectId = objectId.trim();

  if (!trimmedWorkspaceId || !trimmedKpiId || !trimmedObjectId) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId || null,
      binding: null,
      created: false,
      reason: "missing_identifier",
      message: "Provide workspace, KPI, and object identifiers before binding.",
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
    kpiId: trimmedKpiId,
    objectId: trimmedObjectId,
  });
  if (existing) {
    emitKpiObjectBindingDiagnostic({ binding: existing, action: "duplicate" });
    return Object.freeze({
      success: true,
      workspaceId: trimmedWorkspaceId,
      binding: existing,
      created: false,
      reason: "duplicate",
      message: "Existing KPI object binding returned.",
    });
  }

  const binding = buildBinding({
    workspaceId: trimmedWorkspaceId,
    kpiId: trimmedKpiId,
    objectId: trimmedObjectId,
    bindingStrength: "critical",
    bindingConfidence: 1,
    bindingReason: `Manually bound ${kpi.name} to object ${trimmedObjectId}.`,
  });
  persistBinding(binding);
  emitKpiObjectBindingDiagnostic({ binding, action: "created" });

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    binding,
    created: true,
    reason: "created",
    message: `KPI "${kpi.name}" bound to object ${trimmedObjectId}.`,
  });
}

export function unbindKpiFromObject(
  workspaceId: WorkspaceId,
  bindingId: string
): UnbindKpiFromObjectResult {
  hydrateWorkspaceKpiObjectBindingStore();
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

  const existingMap = workspaceKpiObjectBindingStore[trimmedWorkspaceId];
  const existing = existingMap?.[trimmedBindingId] ?? null;
  if (!existing) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      bindingId: trimmedBindingId,
      deleted: false,
      reason: "binding_not_found",
      message: "KPI object binding not found for deletion.",
    });
  }

  const nextEntries = Object.entries(existingMap ?? {}).filter(([id]) => id !== trimmedBindingId);
  const nextStore = { ...workspaceKpiObjectBindingStore };
  if (nextEntries.length === 0) {
    delete nextStore[trimmedWorkspaceId];
  } else {
    nextStore[trimmedWorkspaceId] = Object.freeze(Object.fromEntries(nextEntries));
  }
  workspaceKpiObjectBindingStore = Object.freeze(nextStore);
  commitWorkspaceKpiObjectBindingChange();
  emitKpiObjectBindingDiagnostic({ binding: existing, action: "deleted" });

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    bindingId: trimmedBindingId,
    deleted: true,
    reason: "deleted",
    message: "KPI object binding removed.",
  });
}

export function getKpiObjectBindings(
  workspaceId: WorkspaceId
): readonly WorkspaceKpiObjectBinding[] {
  hydrateWorkspaceKpiObjectBindingStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(workspaceKpiObjectBindingStore[trimmedWorkspaceId] ?? {}).map(freezeBinding)
  );
}

export function getKpiObjectBindingsForKpi(
  workspaceId: WorkspaceId,
  kpiId: string
): readonly WorkspaceKpiObjectBinding[] {
  const trimmedKpiId = kpiId.trim();
  return Object.freeze(
    getKpiObjectBindings(workspaceId).filter((binding) => binding.kpiId === trimmedKpiId)
  );
}

export function getKpiObjectBindingsForObject(
  workspaceId: WorkspaceId,
  objectId: string
): readonly WorkspaceKpiObjectBinding[] {
  const trimmedObjectId = objectId.trim();
  return Object.freeze(
    getKpiObjectBindings(workspaceId).filter((binding) => binding.objectId === trimmedObjectId)
  );
}

export function suggestKpiObjectBindings(
  workspaceId: WorkspaceId
): SuggestKpiObjectBindingsResult {
  hydrateWorkspaceKpiObjectBindingStore();
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
      message: "Provide a workspace before suggesting KPI object bindings.",
    });
  }

  const kpis = getWorkspaceKpis(trimmedWorkspaceId);
  const objects = getObjectIntelligenceProfiles(trimmedWorkspaceId).map((profile) =>
    Object.freeze({
      objectId: profile.objectId,
      objectName: profile.objectName,
      objectType: profile.objectType,
    })
  );

  if (kpis.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      bindings: Object.freeze([]),
      createdCount: 0,
      duplicateCount: 0,
      skippedCount: 0,
      reason: "no_kpis",
      message: "Create workspace KPIs before suggesting object bindings.",
    });
  }

  if (objects.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      bindings: Object.freeze([]),
      createdCount: 0,
      duplicateCount: 0,
      skippedCount: kpis.length,
      reason: "no_objects",
      message: "Build object intelligence profiles before suggesting KPI object bindings.",
    });
  }

  const bindings: WorkspaceKpiObjectBinding[] = [];
  let createdCount = 0;
  let duplicateCount = 0;
  let skippedCount = 0;

  for (const kpi of kpis) {
    const match = suggestKpiObjectBindingMatches({
      kpiName: kpi.name,
      objects,
    });
    if (!match) {
      skippedCount += 1;
      continue;
    }

    const existing = findExistingBinding({
      workspaceId: trimmedWorkspaceId,
      kpiId: kpi.kpiId,
      objectId: match.objectId,
    });
    if (existing) {
      bindings.push(existing);
      duplicateCount += 1;
      emitKpiObjectBindingDiagnostic({ binding: existing, action: "duplicate" });
      continue;
    }

    const binding = buildBinding({
      workspaceId: trimmedWorkspaceId,
      kpiId: kpi.kpiId,
      objectId: match.objectId,
      bindingStrength: match.bindingStrength,
      bindingConfidence: match.bindingConfidence,
      bindingReason: match.bindingReason,
    });
    persistBinding(binding);
    bindings.push(binding);
    createdCount += 1;
    emitKpiObjectBindingDiagnostic({ binding, action: "suggested" });
  }

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    bindings: Object.freeze(bindings.map(freezeBinding)),
    createdCount,
    duplicateCount,
    skippedCount,
    reason: "suggested",
    message: `${createdCount} KPI object binding${createdCount === 1 ? "" : "s"} suggested.`,
  });
}

export function subscribeWorkspaceKpiObjectBindingRegistry(
  listener: WorkspaceKpiObjectBindingListener
): () => void {
  hydrateWorkspaceKpiObjectBindingStore();
  workspaceKpiObjectBindingListeners.add(listener);
  return () => workspaceKpiObjectBindingListeners.delete(listener);
}

export function getWorkspaceKpiObjectBindingRegistryVersion(): number {
  hydrateWorkspaceKpiObjectBindingStore();
  return workspaceKpiObjectBindingVersion;
}

export function resetWorkspaceKpiObjectBindingStoreForTests(): void {
  workspaceKpiObjectBindingStore = {};
  workspaceKpiObjectBindingHydrated = false;
  workspaceKpiObjectBindingVersion = 0;
  workspaceKpiObjectBindingListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}

export function resetWorkspaceKpiObjectBindingMemoryForTests(): void {
  workspaceKpiObjectBindingStore = {};
  workspaceKpiObjectBindingHydrated = false;
  workspaceKpiObjectBindingVersion = 0;
}
