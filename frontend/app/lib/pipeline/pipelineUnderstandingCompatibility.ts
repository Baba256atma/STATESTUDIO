/**
 * UI-PIPE-1:3 — Compatibility Declarations.
 *
 * Exactly 8 immutable compatibility declarations for the Pipeline → DKL-3
 * contract. FutureCompatible does not mean DKL-3 is operational.
 *
 * Ownership: owned exclusively by UI-PIPE-1:3.
 */

import type { CompatibilityDeclaration } from "./pipelineUnderstandingContractTypes.ts";

const decl = (
  compatibilityId: string,
  name: string,
  status: CompatibilityDeclaration["status"],
  description: string,
): CompatibilityDeclaration =>
  Object.freeze({ compatibilityId, name, status, description });

/** Exactly 8 immutable compatibility declarations. */
export const PipelineUnderstandingCompatibility: readonly CompatibilityDeclaration[] =
  Object.freeze([
    decl("INT12PreviewCompatible", "INT-1:2 Preview Compatible", "Compatible", "Accepts immutable INT-1:2 parser preview datasets."),
    decl("UIPIPE12HandoffCompatible", "UI-PIPE-1:2 Handoff Compatible", "Compatible", "Accepts confirmed PipelineUnderstandingHandoff objects."),
    decl("DKL2RegistryReferencesCompatible", "DKL-2 Registry References Compatible", "Compatible", "Resolves source/connector/content ids through the DKL-2 Public Index."),
    decl("DKL3FutureIntakeCompatible", "DKL-3 Future Intake Compatible", "FutureCompatible", "Package shape is intended for future DKL-3 intake; DKL-3 is not executed here."),
    decl("AdditiveOptionalEvidenceCompatible", "Additive Optional Evidence Compatible", "Compatible", "Future additive optional evidence fields may be introduced without renaming existing sections."),
    decl("SemanticFieldsForbidden", "Semantic Fields Forbidden", "Forbidden", "Semantic business meaning fields are forbidden in this contract."),
    decl("PersistenceFieldsForbidden", "Persistence Fields Forbidden", "Forbidden", "Permanent storage identifiers and persistence claims are forbidden."),
    decl("CrossTenantIdentityForbidden", "Cross-Tenant Identity Forbidden", "Forbidden", "Cross-tenant or mismatched isolation identity is forbidden."),
  ]);
