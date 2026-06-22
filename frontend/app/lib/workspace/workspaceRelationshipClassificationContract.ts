/**
 * DS-2:2 — Workspace relationship classification contract.
 * Classification only — no relationship creation, scene mutation, topology mutation, or rendering sync.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import {
  getCandidateRelationships,
  type WorkspaceRelationshipCandidate,
  type WorkspaceRelationshipCandidateDirection,
  type WorkspaceRelationshipCandidateType,
} from "./workspaceRelationshipCandidateContract.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";

export const WORKSPACE_RELATIONSHIP_CLASSIFICATION_VERSION = "DS-2:2" as const;

export const WORKSPACE_RELATIONSHIP_CLASSIFICATION_TAGS = Object.freeze([
  "[DS22_RELATIONSHIP_CLASSIFICATION]",
  "[RELATIONSHIP_CATEGORY_ENGINE]",
  "[RELATIONSHIP_STRENGTH_ENGINE]",
  "[RELATIONSHIP_CLASSIFICATION_PERSISTED]",
  "[DS23_READY]",
  "[DS_2_2_COMPLETE]",
] as const);

export const NEXORA_RELATIONSHIP_CLASSIFICATION_LOG_PREFIX =
  "[NexoraRelationshipClassification]" as const;

export const WORKSPACE_RELATIONSHIP_CLASSIFICATION_SOURCE =
  "ds-2:2-classification" as const;

export type WorkspaceRelationshipCategory =
  | "Business Flow"
  | "Ownership"
  | "Organization"
  | "Dependency"
  | "Financial"
  | "Operational"
  | "Governance"
  | "Unknown";

export type WorkspaceRelationshipStrength = "weak" | "medium" | "strong" | "critical";

export type WorkspaceRelationshipClassification = Readonly<{
  contractVersion: typeof WORKSPACE_RELATIONSHIP_CLASSIFICATION_VERSION;
  candidateRelationshipId: string;
  workspaceId: WorkspaceId;
  relationshipType: WorkspaceRelationshipCandidateType;
  relationshipCategory: WorkspaceRelationshipCategory;
  relationshipStrength: WorkspaceRelationshipStrength;
  direction: WorkspaceRelationshipCandidateDirection;
  confidence: number;
  classificationReason: string;
  classifiedAt: string;
  source: typeof WORKSPACE_RELATIONSHIP_CLASSIFICATION_SOURCE;
}>;

export type WorkspaceRelationshipClassificationMap = Readonly<
  Record<string, WorkspaceRelationshipClassification>
>;

export type WorkspaceRelationshipClassificationStore = Readonly<
  Record<WorkspaceId, WorkspaceRelationshipClassificationMap>
>;

export type ClassifyCandidateRelationshipsResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  classifications: readonly WorkspaceRelationshipClassification[];
  created: boolean;
  reason: string;
  message: string;
}>;

const STORAGE_KEY = "nexora.workspaceRelationshipClassifications.v1";

const ALLOWED_RELATIONSHIP_TYPES: readonly WorkspaceRelationshipCandidateType[] = Object.freeze([
  "owns",
  "contains",
  "belongs_to",
  "supplies",
  "purchases",
  "depends_on",
  "reports_to",
  "assigned_to",
  "managed_by",
  "related_to",
  "unknown",
]);

const CATEGORY_BY_TYPE: Readonly<Record<WorkspaceRelationshipCandidateType, WorkspaceRelationshipCategory>> =
  Object.freeze({
    owns: "Ownership",
    contains: "Ownership",
    belongs_to: "Organization",
    supplies: "Business Flow",
    purchases: "Business Flow",
    depends_on: "Dependency",
    reports_to: "Organization",
    assigned_to: "Organization",
    managed_by: "Governance",
    related_to: "Unknown",
    unknown: "Unknown",
  });

let relationshipClassificationStore: WorkspaceRelationshipClassificationStore = {};
let relationshipClassificationHydrated = false;
let relationshipClassificationVersion = 0;

type RelationshipClassificationListener = () => void;

const relationshipClassificationListeners = new Set<RelationshipClassificationListener>();

function nowIso(): string {
  return new Date().toISOString();
}

function clampConfidence(value: number): number {
  return Math.max(0, Math.min(1, Number(value.toFixed(2))));
}

function normalizeRelationshipType(value: unknown): WorkspaceRelationshipCandidateType {
  return typeof value === "string" &&
    ALLOWED_RELATIONSHIP_TYPES.includes(value as WorkspaceRelationshipCandidateType)
    ? (value as WorkspaceRelationshipCandidateType)
    : "unknown";
}

function classifyStrength(confidence: number): WorkspaceRelationshipStrength {
  if (confidence >= 0.9) return "critical";
  if (confidence >= 0.7) return "strong";
  if (confidence >= 0.4) return "medium";
  return "weak";
}

function buildClassificationReason(input: {
  relationshipType: WorkspaceRelationshipCandidateType;
  category: WorkspaceRelationshipCategory;
  strength: WorkspaceRelationshipStrength;
  confidence: number;
}): string {
  if (input.relationshipType === "unknown" || input.relationshipType === "related_to") {
    return `Candidate type ${input.relationshipType} has no more specific deterministic business category; classified as ${input.category} with ${input.strength} strength at ${input.confidence} confidence.`;
  }
  return `Candidate type ${input.relationshipType} maps deterministically to ${input.category}; confidence ${input.confidence} maps to ${input.strength} strength.`;
}

function freezeClassification(
  classification: WorkspaceRelationshipClassification
): WorkspaceRelationshipClassification {
  return Object.freeze({ ...classification });
}

function readStorage(): WorkspaceRelationshipClassificationStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceRelationshipClassificationStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(relationshipClassificationStore));
  } catch {
    // Classification remains available in-memory if storage is unavailable.
  }
}

function hydrateRelationshipClassificationStore(): void {
  if (relationshipClassificationHydrated) return;
  relationshipClassificationHydrated = true;
  relationshipClassificationStore = readStorage();
}

function notifyRelationshipClassificationListeners(): void {
  relationshipClassificationVersion += 1;
  relationshipClassificationListeners.forEach((listener) => listener());
}

function commitRelationshipClassificationChange(): void {
  writeStorage();
  notifyRelationshipClassificationListeners();
}

function emitRelationshipClassificationDiagnostic(
  classification: WorkspaceRelationshipClassification
): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog(
    "relationshipClassification",
    NEXORA_RELATIONSHIP_CLASSIFICATION_LOG_PREFIX,
    {
      workspaceId: classification.workspaceId,
      candidateRelationshipId: classification.candidateRelationshipId,
      relationshipType: classification.relationshipType,
      category: classification.relationshipCategory,
      strength: classification.relationshipStrength,
      confidence: classification.confidence,
      tags: WORKSPACE_RELATIONSHIP_CLASSIFICATION_TAGS,
      phase: "DS-2:2",
    }
  );
}

function classifyCandidate(
  candidate: WorkspaceRelationshipCandidate,
  classifiedAt: string
): WorkspaceRelationshipClassification {
  const relationshipType = normalizeRelationshipType(candidate.relationshipType);
  const confidence = clampConfidence(candidate.confidence);
  const relationshipCategory = CATEGORY_BY_TYPE[relationshipType] ?? "Unknown";
  const relationshipStrength = classifyStrength(confidence);

  return Object.freeze({
    contractVersion: WORKSPACE_RELATIONSHIP_CLASSIFICATION_VERSION,
    candidateRelationshipId: candidate.candidateRelationshipId,
    workspaceId: candidate.workspaceId,
    relationshipType,
    relationshipCategory,
    relationshipStrength,
    direction: candidate.direction,
    confidence,
    classificationReason: buildClassificationReason({
      relationshipType,
      category: relationshipCategory,
      strength: relationshipStrength,
      confidence,
    }),
    classifiedAt,
    source: WORKSPACE_RELATIONSHIP_CLASSIFICATION_SOURCE,
  });
}

export function classifyCandidateRelationships(
  workspaceId: WorkspaceId
): ClassifyCandidateRelationshipsResult {
  hydrateRelationshipClassificationStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      classifications: Object.freeze([]),
      created: false,
      reason: "missing_workspace",
      message: "Provide a workspace before classifying relationship candidates.",
    });
  }

  const candidates = getCandidateRelationships(trimmedWorkspaceId);
  if (candidates.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      classifications: Object.freeze([]),
      created: false,
      reason: "no_candidates",
      message: "Discover relationship candidates before classifying them.",
    });
  }

  const classifiedAt = nowIso();
  const classifications = candidates.map((candidate) => classifyCandidate(candidate, classifiedAt));
  const nextMap = Object.freeze(
    Object.fromEntries(
      classifications.map((classification) => [
        classification.candidateRelationshipId,
        classification,
      ])
    )
  );

  relationshipClassificationStore = Object.freeze({
    ...relationshipClassificationStore,
    [trimmedWorkspaceId]: nextMap,
  });
  commitRelationshipClassificationChange();
  classifications.forEach(emitRelationshipClassificationDiagnostic);

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    classifications: Object.freeze(classifications.map(freezeClassification)),
    created: true,
    reason: "classified",
    message: `${classifications.length} relationship classification${classifications.length === 1 ? "" : "s"} created.`,
  });
}

export function getRelationshipClassifications(
  workspaceId: WorkspaceId
): readonly WorkspaceRelationshipClassification[] {
  hydrateRelationshipClassificationStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(relationshipClassificationStore[trimmedWorkspaceId] ?? {}).map(
      freezeClassification
    )
  );
}

export function getRelationshipClassification(
  workspaceId: WorkspaceId,
  candidateRelationshipId: string
): WorkspaceRelationshipClassification | null {
  hydrateRelationshipClassificationStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedCandidateRelationshipId = candidateRelationshipId.trim();
  if (!trimmedWorkspaceId || !trimmedCandidateRelationshipId) return null;
  const match =
    relationshipClassificationStore[trimmedWorkspaceId]?.[trimmedCandidateRelationshipId] ??
    null;
  return match ? freezeClassification(match) : null;
}

export function subscribeWorkspaceRelationshipClassificationRegistry(
  listener: RelationshipClassificationListener
): () => void {
  hydrateRelationshipClassificationStore();
  relationshipClassificationListeners.add(listener);
  return () => relationshipClassificationListeners.delete(listener);
}

export function getWorkspaceRelationshipClassificationRegistryVersion(): number {
  hydrateRelationshipClassificationStore();
  return relationshipClassificationVersion;
}

export function resetWorkspaceRelationshipClassificationStoreForTests(): void {
  relationshipClassificationStore = {};
  relationshipClassificationHydrated = false;
  relationshipClassificationVersion = 0;
  relationshipClassificationListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}
