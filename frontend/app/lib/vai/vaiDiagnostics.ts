/**
 * NPA-T VAI:1 — developer diagnostics only.
 * Not a manager-facing Advisor/Stage/Theatre surface.
 */

import type { VaiVariable } from "./vaiContract.ts";
import type { VaiResolveResult as ResolverResult } from "./vaiResolver.ts";

export type VaiVariableDiagnostic = {
  readonly variableId: string;
  readonly name: string;
  readonly contextualRole: string;
  readonly source: string;
  readonly provenance: string;
  readonly semanticStatus: string;
  readonly confidence: string;
  readonly value: string;
  readonly unit: string;
  readonly direction: string;
  readonly relatedObjectIds: readonly string[];
  readonly analysisContext: string;
  readonly causalAssertion: false;
  readonly isExecutiveObject: false;
};

export function formatVaiVariableDiagnostic(variable: VaiVariable): VaiVariableDiagnostic {
  return Object.freeze({
    variableId: variable.variableId,
    name: variable.displayName,
    contextualRole: variable.role,
    source: variable.provenance.sourceKind,
    provenance: `${variable.provenance.authority}::${variable.provenance.sourceRef}`,
    semanticStatus: variable.semanticStatus,
    confidence: variable.confidence,
    value: variable.value.kind === "KNOWN" ? String(variable.value.value) : "UNKNOWN",
    unit: variable.unit.kind === "KNOWN" ? variable.unit.value : "UNKNOWN",
    direction: variable.direction,
    relatedObjectIds: variable.relatedObjectIds,
    analysisContext: variable.analysisContextId,
    causalAssertion: false,
    isExecutiveObject: false,
  });
}

export function formatVaiResolveDiagnostics(result: ResolverResult): readonly VaiVariableDiagnostic[] {
  return Object.freeze(result.variables.map(formatVaiVariableDiagnostic));
}

export function vaiDiagnosticsAreManagerFacing(): false {
  return false;
}
