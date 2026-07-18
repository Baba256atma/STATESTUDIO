/**
 * DKL-5:3 — Shared model descriptor helpers.
 *
 * Internal helpers for canonical model construction. Not a public export.
 * Ownership: owned exclusively by DKL-5:3.
 */

import type {
  CanonicalModelDescriptor,
  KnowledgeValidationModelKind,
  ModelFieldDescriptor,
  ModelLifecycleState,
  ModelStatus,
} from "./knowledgeValidationModelTypes.ts";

export const OWNER = "DKL-5 Knowledge Validation Model";
export const PHASE = "DKL-5:3" as const;
export const NS = "nexora.dkl.knowledge-validation.model";

export const LIFECYCLE_STATES: readonly ModelLifecycleState[] = Object.freeze([
  "Defined",
  "Draft",
  "Bound",
  "Structured",
  "Ready",
  "Stable",
  "Deprecated",
  "Superseded",
]);

export const MODEL_STATUSES: readonly ModelStatus[] = Object.freeze([
  "Declared",
  "Complete",
  "Incomplete",
  "Blocked",
  "Retired",
]);

export const field = (
  fieldName: string,
  fieldKind: string,
  description: string,
): ModelFieldDescriptor =>
  Object.freeze({
    fieldName,
    fieldKind,
    required: true as const,
    readonly: true as const,
    executableBehaviorImplied: false as const,
    description,
  });

export const model = (
  modelKind: KnowledgeValidationModelKind,
  modelName: string,
  description: string,
  registryCategoryReferences: readonly string[],
  fields: readonly ModelFieldDescriptor[],
): CanonicalModelDescriptor =>
  Object.freeze({
    modelId: `DKL-5:3/${modelKind}`,
    modelKind,
    modelName,
    namespace: `${NS}.${modelKind.toLowerCase()}`,
    description,
    owner: OWNER,
    sourcePhase: PHASE,
    registryCategoryReferences: Object.freeze([...registryCategoryReferences]),
    fields: Object.freeze([...fields]),
    fieldCount: fields.length,
    lifecycleStates: LIFECYCLE_STATES,
    statuses: MODEL_STATUSES,
    metadataOnly: true as const,
    runtimeInstanceForbidden: true as const,
    factoryForbidden: true as const,
    executionForbidden: true as const,
    scoreCalculationForbidden: true as const,
    trustCalculationForbidden: true as const,
    immutable: true as const,
  });
