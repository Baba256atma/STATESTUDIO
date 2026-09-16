/**
 * NPA-T VAI:4 — developer diagnostics for Advisor Variable analysis.
 */

import type { VaiAdvisorComposition } from "./vaiAdvisorComposer.ts";

export type VaiAdvisorDiagnostic = {
  readonly managerRequest: string;
  readonly resolvedFocalObject: string | null;
  readonly analysisContext: string | null;
  readonly variablesConsidered: readonly string[];
  readonly compositionBasis: readonly string[];
  readonly investigationSuggestion: string | null;
  readonly clarification: boolean;
  readonly safeStatementClass: string | null;
  readonly apply: boolean;
  readonly rolesFromVai2: readonly string[];
  readonly relationshipStatus: string | null;
  readonly causalStatus: string | null;
  readonly confounders: readonly string[];
  readonly uncertainty: readonly string[];
};

export function formatVaiAdvisorDiagnostics(
  utterance: string,
  composition: VaiAdvisorComposition,
  extras?: { readonly safeStatementClass?: string | null },
): VaiAdvisorDiagnostic {
  return Object.freeze({
    managerRequest: utterance,
    resolvedFocalObject: composition.focalObjectId,
    analysisContext: composition.analysisContextId,
    variablesConsidered: composition.consideredVariableIds,
    compositionBasis: composition.compositionBasis,
    investigationSuggestion: composition.investigationSuggestion,
    clarification: composition.clarification,
    safeStatementClass: extras?.safeStatementClass ?? composition.relationshipStatus,
    apply: composition.apply,
    rolesFromVai2: composition.roleSummaries,
    relationshipStatus: composition.relationshipStatus,
    causalStatus: composition.causalStatus,
    confounders: composition.unresolvedConfounders,
    uncertainty: composition.uncertainty,
  });
}
