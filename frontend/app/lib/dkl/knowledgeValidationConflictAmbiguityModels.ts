/**
 * DKL-5:3 — Conflict and Ambiguity model descriptors.
 *
 * Ownership: owned exclusively by DKL-5:3.
 */

import { field, model } from "./knowledgeValidationModelHelpers.ts";
import type { CanonicalModelDescriptor } from "./knowledgeValidationModelTypes.ts";

export const ValidationConflictModel: CanonicalModelDescriptor = model(
  "ValidationConflict",
  "Validation Conflict Model",
  "Knowledge conflict structural contract. resolutionImplemented is always false — no winner selection.",
  Object.freeze(["conflictTypes", "validationSeverities"]),
  Object.freeze([
    field("conflictId", "string", "Stable declared conflict identifier."),
    field("conflictType", "registryReference", "Registered conflict type."),
    field("participants", "string[]", "Participating declaration references."),
    field("targetReferences", "string[]", "Related target references."),
    field("competingDeclarations", "string[]", "Competing declaration metadata."),
    field("evidenceReferences", "string[]", "Evidence reference identifiers."),
    field("scope", "string", "Conflict scope declaration."),
    field("severity", "registryReference", "Registered severity."),
    field("consumerImpact", "string", "Declared consumer impact."),
    field("executiveImpact", "string", "Declared executive impact."),
    field("blockingDeclaration", "boolean", "Declared blocking behavior."),
    field("resolutionStatus", "string", "Declared resolution status — not executed."),
    field("ownership", "string", "Owning architectural owner."),
    field("provenance", "ValidationProvenance", "Provenance contract reference."),
    field("compatibility", "string", "Compatibility metadata."),
    field("resolutionImplemented", "false", "Always false — conflicts are not resolved."),
  ]),
);

export const ValidationAmbiguityModel: CanonicalModelDescriptor = model(
  "ValidationAmbiguity",
  "Validation Ambiguity Model",
  "Knowledge ambiguity structural contract. resolutionImplemented is always false — no candidate selection or user contact.",
  Object.freeze(["ambiguityTypes", "validationSeverities"]),
  Object.freeze([
    field("ambiguityId", "string", "Stable declared ambiguity identifier."),
    field("ambiguityType", "registryReference", "Registered ambiguity type."),
    field("targetReference", "string", "Target subject reference."),
    field("source", "string", "Declared ambiguity source."),
    field("candidateMeanings", "string[]", "Declared candidate meanings — not selected."),
    field("evidenceReferences", "string[]", "Evidence reference identifiers."),
    field("scope", "string", "Ambiguity scope declaration."),
    field("severity", "registryReference", "Registered severity."),
    field("consumerImpact", "string", "Declared consumer impact."),
    field("executiveImpact", "string", "Declared executive impact."),
    field("clarificationRequirement", "string", "Declared clarification requirement."),
    field("blockingDeclaration", "boolean", "Declared blocking behavior."),
    field("ownership", "string", "Owning architectural owner."),
    field("provenance", "ValidationProvenance", "Provenance contract reference."),
    field("status", "ModelStatus", "Declared status."),
    field("resolutionImplemented", "false", "Always false — ambiguities are not resolved."),
  ]),
);
