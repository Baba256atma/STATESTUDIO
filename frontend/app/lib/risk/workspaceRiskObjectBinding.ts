/**
 * DS-6:4 — Workspace risk object binding.
 * Traceability only — links detected risks to workspace objects.
 *
 * OWNERSHIP RULE
 * DS-6:2 owns risk detection. DS-6:3 owns risk severity.
 * DS-6:4 creates traceability only — no detection, severity scoring,
 * KPI/OKR health calculation, or object/relationship mutation.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import { getObjectIntelligenceProfiles } from "../workspace/workspaceObjectIntelligenceContract.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  getDetectedWorkspaceRisks,
  type WorkspaceDetectedRisk,
} from "./workspaceRiskDetectionEngine.ts";
import {
  getWorkspaceRiskSeverityProfiles,
  type WorkspaceRiskSeverityProfile,
} from "./workspaceRiskSeverityEngine.ts";

export const WORKSPACE_RISK_OBJECT_BINDING_VERSION = "DS-6:4" as const;

export const WORKSPACE_RISK_OBJECT_BINDING_TAGS = Object.freeze([
  "[DS64_RISK_OBJECT_BINDING]",
  "[RISK_OBJECT_TRACEABILITY_READY]",
  "[RISKS_LINKED_TO_OBJECTS]",
  "[RISK_BINDINGS_PERSISTED]",
  "[DS65_READY]",
  "[DS_6_4_COMPLETE]",
] as const);

export const NEXORA_RISK_OBJECT_BINDING_LOG_PREFIX = "[NexoraRiskObjectBinding]" as const;

export const WORKSPACE_RISK_OBJECT_BINDING_SOURCE = "ds-6:4-risk-object-binding" as const;

export const WORKSPACE_RISK_OBJECT_BINDING_STORAGE_KEY =
  "nexora.workspaceRiskObjectBindings.v1" as const;

export const WORKSPACE_RISK_OBJECT_BINDING_READ_APIS = Object.freeze([
  "getDetectedWorkspaceRisks",
  "getWorkspaceRiskSeverityProfiles",
] as const);

export type WorkspaceRiskBindingStrength = "weak" | "medium" | "strong" | "critical";

export type WorkspaceRiskObjectBinding = Readonly<{
  contractVersion: typeof WORKSPACE_RISK_OBJECT_BINDING_VERSION;
  workspaceId: WorkspaceId;
  bindingId: string;
  riskId: string;
  objectId: string;
  bindingStrength: WorkspaceRiskBindingStrength;
  bindingConfidence: number;
  bindingReason: string;
  createdAt: string;
  updatedAt: string;
  source: typeof WORKSPACE_RISK_OBJECT_BINDING_SOURCE;
}>;

export type WorkspaceRiskObjectBindingMap = Readonly<Record<string, WorkspaceRiskObjectBinding>>;

export type WorkspaceRiskObjectBindingStore = Readonly<
  Record<WorkspaceId, WorkspaceRiskObjectBindingMap>
>;

export type BindRiskToObjectResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  binding: WorkspaceRiskObjectBinding | null;
  created: boolean;
  reason: string;
  message: string;
}>;

export type UnbindRiskFromObjectResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  bindingId: string | null;
  deleted: boolean;
  reason: string;
  message: string;
}>;

export type SuggestRiskObjectBindingsResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  bindings: readonly WorkspaceRiskObjectBinding[];
  createdCount: number;
  duplicateCount: number;
  skippedCount: number;
  reason: string;
  message: string;
}>;

export type RiskObjectBindingMatch = Readonly<{
  objectId: string;
  objectName: string;
  objectType: string;
  bindingConfidence: number;
  bindingStrength: WorkspaceRiskBindingStrength;
  bindingReason: string;
  matchKind: "exact" | "strong_keyword" | "related_domain" | "weak_fallback" | "none";
}>;

const STORAGE_KEY = WORKSPACE_RISK_OBJECT_BINDING_STORAGE_KEY;

const KEYWORD_RULES = Object.freeze([
  Object.freeze({
    riskKeywords: ["forecast"],
    objectKeywords: ["forecast", "planning", "prediction", "analytics"],
    domain: "forecast",
  }),
  Object.freeze({
    riskKeywords: ["warehouse", "inventory", "supply"],
    objectKeywords: ["warehouse", "inventory", "logistics", "operations"],
    domain: "supply_chain",
  }),
  Object.freeze({
    riskKeywords: ["sales", "growth", "market"],
    objectKeywords: ["sales", "marketing", "market", "customer"],
    domain: "growth",
  }),
  Object.freeze({
    riskKeywords: ["technology", "system", "platform"],
    objectKeywords: ["platform", "technology", "application", "system"],
    domain: "technology",
  }),
] as const);

let workspaceRiskObjectBindingStore: WorkspaceRiskObjectBindingStore = {};
let workspaceRiskObjectBindingHydrated = false;
let workspaceRiskObjectBindingVersion = 0;

type WorkspaceRiskObjectBindingListener = () => void;

const workspaceRiskObjectBindingListeners = new Set<WorkspaceRiskObjectBindingListener>();

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

function freezeBinding(binding: WorkspaceRiskObjectBinding): WorkspaceRiskObjectBinding {
  return Object.freeze({ ...binding });
}

function readStorage(): WorkspaceRiskObjectBindingStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceRiskObjectBindingStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceRiskObjectBindingStore));
  } catch {
    // Risk object bindings remain available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceRiskObjectBindingStore(): void {
  if (workspaceRiskObjectBindingHydrated) return;
  workspaceRiskObjectBindingHydrated = true;
  workspaceRiskObjectBindingStore = readStorage();
}

function notifyWorkspaceRiskObjectBindingListeners(): void {
  workspaceRiskObjectBindingVersion += 1;
  workspaceRiskObjectBindingListeners.forEach((listener) => listener());
}

function commitWorkspaceRiskObjectBindingChange(): void {
  writeStorage();
  notifyWorkspaceRiskObjectBindingListeners();
}

function emitRiskObjectBindingDiagnostic(input: {
  binding: WorkspaceRiskObjectBinding;
  action: "created" | "duplicate" | "deleted" | "suggested";
}): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("riskObjectBinding", NEXORA_RISK_OBJECT_BINDING_LOG_PREFIX, {
    workspaceId: input.binding.workspaceId,
    riskId: input.binding.riskId,
    objectId: input.binding.objectId,
    bindingStrength: input.binding.bindingStrength,
    bindingConfidence: input.binding.bindingConfidence,
    action: input.action,
    tags: WORKSPACE_RISK_OBJECT_BINDING_TAGS,
    phase: "DS-6:4",
  });
}

export function deriveBindingStrengthFromConfidence(
  confidence: number
): WorkspaceRiskBindingStrength {
  if (confidence >= 0.95) return "critical";
  if (confidence >= 0.8) return "strong";
  if (confidence >= 0.65) return "medium";
  return "weak";
}

function bindingIdFor(input: {
  workspaceId: WorkspaceId;
  riskId: string;
  objectId: string;
}): string {
  return [
    "wrisk_bind",
    slugify(input.workspaceId),
    slugify(input.riskId),
    slugify(input.objectId),
  ].join("_");
}

function objectHaystack(objectName: string, objectType: string): string {
  return `${objectName} ${objectType}`.toLowerCase();
}

function containsKeyword(haystack: string, keyword: string): boolean {
  return haystack.includes(keyword.toLowerCase());
}

function exactRiskObjectMatch(riskTitle: string, objectName: string): boolean {
  const normalizedRisk = normalizeText(riskTitle);
  const normalizedObject = normalizeText(objectName);
  if (!normalizedRisk || !normalizedObject) return false;
  if (normalizedRisk === normalizedObject) return true;
  return normalizedRisk.includes(normalizedObject);
}

function findDetectedRiskById(
  workspaceId: WorkspaceId,
  riskId: string
): WorkspaceDetectedRisk | null {
  const trimmedRiskId = riskId.trim();
  return (
    getDetectedWorkspaceRisks(workspaceId).find((risk) => risk.riskId === trimmedRiskId) ?? null
  );
}

function severityProfileForRisk(
  workspaceId: WorkspaceId,
  riskId: string
): WorkspaceRiskSeverityProfile | null {
  return (
    getWorkspaceRiskSeverityProfiles(workspaceId).find((profile) => profile.riskId === riskId) ??
    null
  );
}

export function resolveRiskObjectBindingMatch(input: {
  riskTitle: string;
  objectName: string;
  objectType: string;
}): RiskObjectBindingMatch {
  const riskHaystack = normalizeText(input.riskTitle);
  const objectText = objectHaystack(input.objectName, input.objectType);

  if (exactRiskObjectMatch(input.riskTitle, input.objectName)) {
    return Object.freeze({
      objectId: "",
      objectName: input.objectName,
      objectType: input.objectType,
      bindingConfidence: 0.95,
      bindingStrength: deriveBindingStrengthFromConfidence(0.95),
      bindingReason: `${input.riskTitle} exactly matches ${input.objectName}.`,
      matchKind: "exact",
    });
  }

  for (const rule of KEYWORD_RULES) {
    const riskMatchesRule = rule.riskKeywords.some((keyword) =>
      containsKeyword(riskHaystack, keyword)
    );
    if (!riskMatchesRule) continue;

    const strongObjectMatch = rule.objectKeywords.some((keyword) =>
      containsKeyword(objectText, keyword)
    );
    if (
      strongObjectMatch &&
      rule.riskKeywords.some((keyword) => containsKeyword(objectText, keyword))
    ) {
      return Object.freeze({
        objectId: "",
        objectName: input.objectName,
        objectType: input.objectType,
        bindingConfidence: 0.8,
        bindingStrength: deriveBindingStrengthFromConfidence(0.8),
        bindingReason: `${input.riskTitle} strongly matches ${input.objectName} via ${rule.domain} keywords.`,
        matchKind: "strong_keyword",
      });
    }

    if (strongObjectMatch) {
      return Object.freeze({
        objectId: "",
        objectName: input.objectName,
        objectType: input.objectType,
        bindingConfidence: 0.8,
        bindingStrength: deriveBindingStrengthFromConfidence(0.8),
        bindingReason: `${input.riskTitle} strongly matches ${input.objectName} through ${rule.domain} domain keywords.`,
        matchKind: "strong_keyword",
      });
    }
  }

  for (const rule of KEYWORD_RULES) {
    const riskMatchesRule = rule.riskKeywords.some((keyword) =>
      containsKeyword(riskHaystack, keyword)
    );
    if (!riskMatchesRule) continue;

    const relatedObjectMatch = rule.objectKeywords.some((keyword) =>
      containsKeyword(objectText, keyword)
    );
    if (relatedObjectMatch) {
      return Object.freeze({
        objectId: "",
        objectName: input.objectName,
        objectType: input.objectType,
        bindingConfidence: 0.65,
        bindingStrength: deriveBindingStrengthFromConfidence(0.65),
        bindingReason: `${input.riskTitle} relates to ${input.objectName} through ${rule.domain} domain keywords.`,
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
      bindingReason: `${input.riskTitle} has a weak keyword overlap with ${input.objectName}.`,
      matchKind: "weak_fallback",
    });
  }

  return Object.freeze({
    objectId: "",
    objectName: input.objectName,
    objectType: input.objectType,
    bindingConfidence: 0,
    bindingStrength: "weak",
    bindingReason: "No risk object binding match found.",
    matchKind: "none",
  });
}

export function suggestRiskObjectBindingMatches(input: {
  riskTitle: string;
  objects: readonly {
    objectId: string;
    objectName: string;
    objectType: string;
  }[];
}): RiskObjectBindingMatch | null {
  let best: (RiskObjectBindingMatch & { objectId: string }) | null = null;
  for (const object of input.objects) {
    const match = resolveRiskObjectBindingMatch({
      riskTitle: input.riskTitle,
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
  riskId: string;
  objectId: string;
}): WorkspaceRiskObjectBinding | null {
  const bindings = workspaceRiskObjectBindingStore[input.workspaceId] ?? {};
  const match =
    Object.values(bindings).find(
      (binding) => binding.riskId === input.riskId && binding.objectId === input.objectId
    ) ?? null;
  return match ? freezeBinding(match) : null;
}

function buildBinding(input: {
  workspaceId: WorkspaceId;
  riskId: string;
  objectId: string;
  bindingStrength: WorkspaceRiskBindingStrength;
  bindingConfidence: number;
  bindingReason: string;
  createdAt?: string;
}): WorkspaceRiskObjectBinding {
  const timestamp = input.createdAt ?? nowIso();
  return freezeBinding(
    Object.freeze({
      contractVersion: WORKSPACE_RISK_OBJECT_BINDING_VERSION,
      workspaceId: input.workspaceId,
      bindingId: bindingIdFor({
        workspaceId: input.workspaceId,
        riskId: input.riskId,
        objectId: input.objectId,
      }),
      riskId: input.riskId,
      objectId: input.objectId,
      bindingStrength: input.bindingStrength,
      bindingConfidence: input.bindingConfidence,
      bindingReason: input.bindingReason,
      createdAt: timestamp,
      updatedAt: timestamp,
      source: WORKSPACE_RISK_OBJECT_BINDING_SOURCE,
    })
  );
}

function persistBinding(binding: WorkspaceRiskObjectBinding): WorkspaceRiskObjectBinding {
  const existingMap = workspaceRiskObjectBindingStore[binding.workspaceId] ?? {};
  workspaceRiskObjectBindingStore = Object.freeze({
    ...workspaceRiskObjectBindingStore,
    [binding.workspaceId]: Object.freeze({
      ...existingMap,
      [binding.bindingId]: binding,
    }),
  });
  commitWorkspaceRiskObjectBindingChange();
  return binding;
}

export function bindRiskToObject(
  workspaceId: WorkspaceId,
  riskId: string,
  objectId: string
): BindRiskToObjectResult {
  hydrateWorkspaceRiskObjectBindingStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedRiskId = riskId.trim();
  const trimmedObjectId = objectId.trim();

  if (!trimmedWorkspaceId || !trimmedRiskId || !trimmedObjectId) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId || null,
      binding: null,
      created: false,
      reason: "missing_identifier",
      message: "Provide workspace, risk, and object identifiers before binding.",
    });
  }

  const detectedRisk = findDetectedRiskById(trimmedWorkspaceId, trimmedRiskId);
  if (!detectedRisk) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      binding: null,
      created: false,
      reason: "risk_not_found",
      message: "Detected risk not found for binding.",
    });
  }

  const existing = findExistingBinding({
    workspaceId: trimmedWorkspaceId,
    riskId: trimmedRiskId,
    objectId: trimmedObjectId,
  });
  if (existing) {
    emitRiskObjectBindingDiagnostic({ binding: existing, action: "duplicate" });
    return Object.freeze({
      success: true,
      workspaceId: trimmedWorkspaceId,
      binding: existing,
      created: false,
      reason: "duplicate",
      message: "Existing risk object binding returned.",
    });
  }

  const severityProfile = severityProfileForRisk(trimmedWorkspaceId, trimmedRiskId);
  const severityNote = severityProfile
    ? ` Severity profile: ${severityProfile.severityLevel}.`
    : "";

  const binding = buildBinding({
    workspaceId: trimmedWorkspaceId,
    riskId: trimmedRiskId,
    objectId: trimmedObjectId,
    bindingStrength: "critical",
    bindingConfidence: 1,
    bindingReason: `Manually bound ${detectedRisk.title} to object ${trimmedObjectId}.${severityNote}`,
  });
  persistBinding(binding);
  emitRiskObjectBindingDiagnostic({ binding, action: "created" });

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    binding,
    created: true,
    reason: "created",
    message: `Risk "${detectedRisk.title}" bound to object ${trimmedObjectId}.`,
  });
}

export function unbindRiskFromObject(
  workspaceId: WorkspaceId,
  bindingId: string
): UnbindRiskFromObjectResult {
  hydrateWorkspaceRiskObjectBindingStore();
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

  const existingMap = workspaceRiskObjectBindingStore[trimmedWorkspaceId];
  const existing = existingMap?.[trimmedBindingId] ?? null;
  if (!existing) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      bindingId: trimmedBindingId,
      deleted: false,
      reason: "binding_not_found",
      message: "Risk object binding not found for deletion.",
    });
  }

  const nextEntries = Object.entries(existingMap ?? {}).filter(([id]) => id !== trimmedBindingId);
  const nextStore = { ...workspaceRiskObjectBindingStore };
  if (nextEntries.length === 0) {
    delete nextStore[trimmedWorkspaceId];
  } else {
    nextStore[trimmedWorkspaceId] = Object.freeze(Object.fromEntries(nextEntries));
  }
  workspaceRiskObjectBindingStore = Object.freeze(nextStore);
  commitWorkspaceRiskObjectBindingChange();
  emitRiskObjectBindingDiagnostic({ binding: existing, action: "deleted" });

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    bindingId: trimmedBindingId,
    deleted: true,
    reason: "deleted",
    message: "Risk object binding removed.",
  });
}

export function getRiskObjectBindings(
  workspaceId: WorkspaceId
): readonly WorkspaceRiskObjectBinding[] {
  hydrateWorkspaceRiskObjectBindingStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(workspaceRiskObjectBindingStore[trimmedWorkspaceId] ?? {}).map(freezeBinding)
  );
}

export function getRiskObjectBindingsForRisk(
  workspaceId: WorkspaceId,
  riskId: string
): readonly WorkspaceRiskObjectBinding[] {
  const trimmedRiskId = riskId.trim();
  return Object.freeze(
    getRiskObjectBindings(workspaceId).filter((binding) => binding.riskId === trimmedRiskId)
  );
}

export function getRiskObjectBindingsForObject(
  workspaceId: WorkspaceId,
  objectId: string
): readonly WorkspaceRiskObjectBinding[] {
  const trimmedObjectId = objectId.trim();
  return Object.freeze(
    getRiskObjectBindings(workspaceId).filter((binding) => binding.objectId === trimmedObjectId)
  );
}

export function suggestRiskObjectBindings(
  workspaceId: WorkspaceId
): SuggestRiskObjectBindingsResult {
  hydrateWorkspaceRiskObjectBindingStore();
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
      message: "Provide a workspace before suggesting risk object bindings.",
    });
  }

  const detectedRisks = getDetectedWorkspaceRisks(trimmedWorkspaceId);
  const objects = getObjectIntelligenceProfiles(trimmedWorkspaceId).map((profile) =>
    Object.freeze({
      objectId: profile.objectId,
      objectName: profile.objectName,
      objectType: profile.objectType,
    })
  );

  if (detectedRisks.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      bindings: Object.freeze([]),
      createdCount: 0,
      duplicateCount: 0,
      skippedCount: 0,
      reason: "no_detected_risks",
      message: "Detect workspace risks before suggesting object bindings.",
    });
  }

  if (objects.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      bindings: Object.freeze([]),
      createdCount: 0,
      duplicateCount: 0,
      skippedCount: detectedRisks.length,
      reason: "no_objects",
      message: "Build object intelligence profiles before suggesting risk object bindings.",
    });
  }

  const bindings: WorkspaceRiskObjectBinding[] = [];
  let createdCount = 0;
  let duplicateCount = 0;
  let skippedCount = 0;

  for (const detectedRisk of detectedRisks) {
    const match = suggestRiskObjectBindingMatches({
      riskTitle: detectedRisk.title,
      objects,
    });
    if (!match) {
      skippedCount += 1;
      continue;
    }

    const existing = findExistingBinding({
      workspaceId: trimmedWorkspaceId,
      riskId: detectedRisk.riskId,
      objectId: match.objectId,
    });
    if (existing) {
      bindings.push(existing);
      duplicateCount += 1;
      emitRiskObjectBindingDiagnostic({ binding: existing, action: "duplicate" });
      continue;
    }

    const severityProfile = severityProfileForRisk(trimmedWorkspaceId, detectedRisk.riskId);
    const bindingReason = severityProfile
      ? `${match.bindingReason} Severity profile: ${severityProfile.severityLevel}.`
      : match.bindingReason;

    const binding = buildBinding({
      workspaceId: trimmedWorkspaceId,
      riskId: detectedRisk.riskId,
      objectId: match.objectId,
      bindingStrength: match.bindingStrength,
      bindingConfidence: match.bindingConfidence,
      bindingReason,
    });
    persistBinding(binding);
    bindings.push(binding);
    createdCount += 1;
    emitRiskObjectBindingDiagnostic({ binding, action: "suggested" });
  }

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    bindings: Object.freeze(bindings.map(freezeBinding)),
    createdCount,
    duplicateCount,
    skippedCount,
    reason: "suggested",
    message: `${createdCount} risk object binding${createdCount === 1 ? "" : "s"} suggested.`,
  });
}

export function subscribeWorkspaceRiskObjectBindingRegistry(
  listener: WorkspaceRiskObjectBindingListener
): () => void {
  hydrateWorkspaceRiskObjectBindingStore();
  workspaceRiskObjectBindingListeners.add(listener);
  return () => workspaceRiskObjectBindingListeners.delete(listener);
}

export function getWorkspaceRiskObjectBindingRegistryVersion(): number {
  hydrateWorkspaceRiskObjectBindingStore();
  return workspaceRiskObjectBindingVersion;
}

export function resetWorkspaceRiskObjectBindingStoreForTests(): void {
  workspaceRiskObjectBindingStore = {};
  workspaceRiskObjectBindingHydrated = false;
  workspaceRiskObjectBindingVersion = 0;
  workspaceRiskObjectBindingListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}

export function resetWorkspaceRiskObjectBindingMemoryForTests(): void {
  workspaceRiskObjectBindingStore = {};
  workspaceRiskObjectBindingHydrated = false;
  workspaceRiskObjectBindingVersion = 0;
}
