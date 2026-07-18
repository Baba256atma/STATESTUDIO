/**
 * DKL-5:2 — Knowledge Validation Conflict and Ambiguity Registries.
 *
 * Metadata-only conflict and ambiguity type registrations.
 * No resolution behavior.
 *
 * Ownership: owned exclusively by DKL-5:2.
 */

import type { KnowledgeValidationRegistryEntry } from "./knowledgeValidationRegistryTypes.ts";

const OWNER = "DKL-5 Knowledge Validation Registry";
const PHASE = "DKL-5:2";

const entry = (
  kind: "ConflictType" | "AmbiguityType",
  order: number,
  name: string,
  description: string,
): KnowledgeValidationRegistryEntry =>
  Object.freeze({
    id: `kv-reg-${kind === "ConflictType" ? "conflict" : "ambiguity"}-${name.toLowerCase()}`,
    name,
    namespace: `nexora.dkl.knowledge-validation.registry.${kind === "ConflictType" ? "conflict" : "ambiguity"}.${name.toLowerCase()}`,
    description,
    category: kind,
    owner: OWNER,
    sourcePhase: PHASE,
    lifecycleStatus: "Registered" as const,
    stabilityStatus: "Stable" as const,
    compatibilityStatus: "Compatible" as const,
    extensionStatus: "AdditiveAllowed" as const,
    publicVisibility: "Public" as const,
    deterministicOrder: order,
    tags: Object.freeze([
      kind === "ConflictType" ? "conflict" : "ambiguity",
      "metadata-only",
      "no-resolution",
    ]),
  });

/** Canonical immutable conflict type registry. */
export const KnowledgeValidationConflictTypeRegistry: readonly KnowledgeValidationRegistryEntry[] =
  Object.freeze([
    entry("ConflictType", 1, "IdentityConflict", "Conflicting identity declarations."),
    entry("ConflictType", 2, "ValueConflict", "Conflicting declared values within scope."),
    entry("ConflictType", 3, "RelationshipConflict", "Conflicting relationship declarations."),
    entry("ConflictType", 4, "ClassificationConflict", "Conflicting classification declarations."),
    entry("ConflictType", 5, "OwnershipConflict", "Conflicting ownership declarations."),
    entry("ConflictType", 6, "ProvenanceConflict", "Conflicting provenance declarations."),
    entry("ConflictType", 7, "TemporalConflict", "Conflicting temporal/freshness declarations."),
    entry("ConflictType", 8, "SourceConflict", "Conflicting source evidence declarations."),
    entry("ConflictType", 9, "ConsumerPolicyConflict", "Conflicting consumer-policy declarations."),
  ]);

/** Canonical immutable ambiguity type registry. */
export const KnowledgeValidationAmbiguityTypeRegistry: readonly KnowledgeValidationRegistryEntry[] =
  Object.freeze([
    entry("AmbiguityType", 1, "IdentityAmbiguity", "Ambiguous identity interpretation."),
    entry("AmbiguityType", 2, "SemanticAmbiguity", "Ambiguous semantic meaning."),
    entry("AmbiguityType", 3, "RelationshipAmbiguity", "Ambiguous relationship interpretation."),
    entry("AmbiguityType", 4, "ClassificationAmbiguity", "Ambiguous classification."),
    entry("AmbiguityType", 5, "ScopeAmbiguity", "Ambiguous validation or consumer scope."),
    entry("AmbiguityType", 6, "TemporalAmbiguity", "Ambiguous temporal interpretation."),
    entry("AmbiguityType", 7, "OwnershipAmbiguity", "Ambiguous ownership interpretation."),
    entry("AmbiguityType", 8, "ReferenceAmbiguity", "Ambiguous reference interpretation."),
  ]);
