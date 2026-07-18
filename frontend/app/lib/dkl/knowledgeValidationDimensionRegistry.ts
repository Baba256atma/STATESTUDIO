/**
 * DKL-5:2 — Knowledge Validation Dimension Registry.
 *
 * Stable architectural categories for DKL-5:1 validation dimensions.
 * No validation logic in entries.
 *
 * Ownership: owned exclusively by DKL-5:2.
 */

import { KnowledgeValidationFoundation } from "./knowledgeValidationFoundation.ts";
import type { ValidationDimensionRegistryEntry } from "./knowledgeValidationRegistryTypes.ts";

const OWNER = "DKL-5 Knowledge Validation Registry";
const PHASE = "DKL-5:2";
const NS = "nexora.dkl.knowledge-validation.registry.dimension";
const ALL_TARGETS = KnowledgeValidationFoundation.contracts.targetCategories;

const META: Record<
  string,
  {
    meaning: string;
    scope: string;
    evidence: string;
    blocking: boolean;
    executive: string;
  }
> = {
  Identity: {
    meaning: "Whether identity is present, unique, and usable by declaration.",
    scope: "Identity-bearing targets",
    evidence: "IdentityEvidence, Supporting, Missing",
    blocking: true,
    executive: "High — identity failures undermine trust.",
  },
  Completeness: {
    meaning: "Whether required structural elements are present.",
    scope: "All eligible targets",
    evidence: "StructuralEvidence, Missing",
    blocking: false,
    executive: "Medium — incompleteness constrains conclusions.",
  },
  Consistency: {
    meaning: "Whether declared structure is free of contradictions.",
    scope: "All eligible targets",
    evidence: "Supporting, Contradicting",
    blocking: true,
    executive: "High — inconsistency weakens decisions.",
  },
  Integrity: {
    meaning: "Whether structural integrity is declared sound.",
    scope: "All eligible targets",
    evidence: "StructuralEvidence, Provenance",
    blocking: true,
    executive: "High",
  },
  ReferentialIntegrity: {
    meaning: "Whether references resolve within declared contracts.",
    scope: "Reference, Relationship, Composition",
    evidence: "RelationshipEvidence, Missing, Referenced",
    blocking: true,
    executive: "High",
  },
  StructuralValidity: {
    meaning: "Whether structure conforms to approved contracts.",
    scope: "All eligible targets",
    evidence: "StructuralEvidence",
    blocking: true,
    executive: "High",
  },
  SemanticAlignment: {
    meaning: "Whether semantic classification aligns with declared meaning.",
    scope: "SemanticStructure, Classification-bearing targets",
    evidence: "ClassificationEvidence",
    blocking: false,
    executive: "Medium",
  },
  Provenance: {
    meaning: "Whether provenance is declared and usable.",
    scope: "Provenance, Snapshot, KnowledgeObject",
    evidence: "Provenance, FreshnessEvidence",
    blocking: false,
    executive: "High for executive trust.",
  },
  Traceability: {
    meaning: "Whether evidence and lineage can be followed.",
    scope: "All eligible targets",
    evidence: "Referenced, Provenance",
    blocking: false,
    executive: "High",
  },
  Ownership: {
    meaning: "Whether ownership is declared and non-conflicting.",
    scope: "Boundary, KnowledgeObject, BusinessObject",
    evidence: "OwnershipEvidence",
    blocking: false,
    executive: "Medium",
  },
  Compatibility: {
    meaning: "Whether compatibility declarations remain valid.",
    scope: "Version, Boundary, Summary",
    evidence: "CompatibilityEvidence",
    blocking: false,
    executive: "Medium",
  },
  Classification: {
    meaning: "Whether classification is supported and unambiguous.",
    scope: "Entity, BusinessObject, SemanticStructure",
    evidence: "ClassificationEvidence",
    blocking: false,
    executive: "Medium",
  },
  RelationshipValidity: {
    meaning: "Whether relationships conform to approved contracts.",
    scope: "Relationship, RelationshipSet",
    evidence: "RelationshipEvidence",
    blocking: true,
    executive: "High",
  },
  HierarchyValidity: {
    meaning: "Whether hierarchy structure is valid by declaration.",
    scope: "Hierarchy",
    evidence: "StructuralEvidence, RelationshipEvidence",
    blocking: false,
    executive: "Medium",
  },
  CompositionValidity: {
    meaning: "Whether composition structure is valid by declaration.",
    scope: "Composition, ObjectSet",
    evidence: "StructuralEvidence",
    blocking: false,
    executive: "Medium",
  },
  Ambiguity: {
    meaning: "Whether material ambiguity is declared.",
    scope: "All eligible targets",
    evidence: "Supporting, Contradicting, Missing",
    blocking: false,
    executive: "High when meaning is affected.",
  },
  Conflict: {
    meaning: "Whether declared conflicts exist within scope.",
    scope: "All eligible targets",
    evidence: "Contradicting, SourceConflict evidence",
    blocking: true,
    executive: "High",
  },
  FreshnessDeclaration: {
    meaning: "Whether freshness is declared current or potentially stale.",
    scope: "Snapshot, Provenance, Summary",
    evidence: "FreshnessEvidence",
    blocking: false,
    executive: "Medium",
  },
  ConsumerReadiness: {
    meaning: "Whether knowledge is declared ready for approved consumers.",
    scope: "Summary, KnowledgeModel, KnowledgeObject",
    evidence: "ConsumerReadinessEvidence",
    blocking: true,
    executive: "Critical for release.",
  },
  ExecutiveUsability: {
    meaning: "Whether knowledge is suitable for executive use within limits.",
    scope: "Summary, KnowledgeModel, BusinessObject",
    evidence: "Supporting, Provenance, ConsumerReadinessEvidence",
    blocking: false,
    executive: "Critical",
  },
};

/** Canonical immutable validation dimension registry. */
export const KnowledgeValidationDimensionRegistry: readonly ValidationDimensionRegistryEntry[] =
  Object.freeze(
    KnowledgeValidationFoundation.contracts.dimensions.map((name, index) => {
      const meta = META[name]!;
      return Object.freeze({
        id: `kv-reg-dimension-${name.toLowerCase()}`,
        name,
        namespace: `${NS}.${name.toLowerCase()}`,
        description: meta.meaning,
        category: "ValidationDimension" as const,
        owner: OWNER,
        sourcePhase: PHASE,
        lifecycleStatus: "Registered" as const,
        stabilityStatus: "Stable" as const,
        compatibilityStatus: "Compatible" as const,
        extensionStatus: "AdditiveAllowed" as const,
        publicVisibility: "Public" as const,
        deterministicOrder: index + 1,
        tags: Object.freeze(["validation-dimension", "metadata-only"]),
        meaning: meta.meaning,
        scope: meta.scope,
        applicableTargetTypes: Object.freeze([...ALL_TARGETS]),
        evidenceExpectations: meta.evidence,
        blockingPotential: meta.blocking,
        executiveRelevance: meta.executive,
        validationLogicIncluded: false as const,
      });
    }),
  );
