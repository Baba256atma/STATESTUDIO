/**
 * DKL-5:3 — Evidence model descriptors.
 *
 * Ownership: owned exclusively by DKL-5:3.
 */

import { KnowledgeValidationRegistry } from "./knowledgeValidationRegistry.ts";
import { field, model } from "./knowledgeValidationModelHelpers.ts";
import type { CanonicalModelDescriptor } from "./knowledgeValidationModelTypes.ts";

const evidenceTypeIds = Object.freeze(
  KnowledgeValidationRegistry.collections.evidenceTypes.map((e) => e.id),
);

const EVIDENCE_COMMON = Object.freeze([
  field("evidenceId", "string", "Stable declared evidence identifier."),
  field("type", "registryReference", "Registered evidence type."),
  field("sourceReference", "string", "Source artifact reference — not payload copy."),
  field("targetReference", "string", "Target subject reference."),
  field("ruleReference", "string", "Related rule reference."),
  field("criterionReference", "string", "Related criterion reference."),
  field("dimension", "registryReference", "Registered validation dimension."),
  field("description", "string", "Readonly evidence description."),
  field("observedDeclaration", "string", "Observed declaration metadata."),
  field("expectedDeclaration", "string", "Expected declaration metadata."),
  field("provenance", "ValidationProvenance", "Provenance contract reference."),
  field("ownership", "string", "Owning architectural owner."),
  field("status", "ModelStatus", "Declared status."),
  field("compatibility", "string", "Compatibility metadata."),
  field("publicVisibility", "string", "Public or internal visibility."),
]);

export const ValidationEvidenceModel: CanonicalModelDescriptor = model(
  "ValidationEvidence",
  "Validation Evidence Model",
  "Immutable structural evidence contract. Uses references — does not copy large source payloads.",
  Object.freeze(["evidenceTypes", "validationDimensions"]),
  EVIDENCE_COMMON,
);

export const EvidenceReferenceModel: CanonicalModelDescriptor = model(
  "EvidenceReference",
  "Evidence Reference Model",
  "Lightweight reference to evidence without embedding payloads.",
  Object.freeze(["evidenceTypes"]),
  Object.freeze([
    field("referenceId", "string", "Stable evidence reference identifier."),
    field("evidenceId", "string", "Referenced evidence identifier."),
    field("evidenceType", "registryReference", "Registered evidence type."),
    field("relationKind", "string", "Supports, Contradicts, Missing, or Provenance."),
    field("targetReference", "string", "Target subject reference."),
    field("ownership", "string", "Owning architectural owner."),
    field("status", "ModelStatus", "Declared status."),
    field("compatibility", "string", "Compatibility metadata."),
  ]),
);

/** Declared evidence subtype catalog (structural kinds only). */
export const EvidenceSubtypeCatalog = Object.freeze({
  catalogId: "DKL-5:3/EvidenceSubtypeCatalog",
  subtypes: Object.freeze([
    "SupportingEvidence",
    "ContradictingEvidence",
    "MissingEvidence",
    "ReferencedEvidence",
    "ProvenanceEvidence",
    "IdentityEvidence",
    "StructuralEvidence",
    "RelationshipEvidence",
    "ClassificationEvidence",
    "OwnershipEvidence",
    "CompatibilityEvidence",
    "FreshnessEvidence",
    "ConsumerReadinessEvidence",
  ] as const),
  registeredEvidenceTypeIds: evidenceTypeIds,
  subtypeCount: 13,
  payloadCopyForbidden: true,
  metadataOnly: true,
  immutable: true,
});
