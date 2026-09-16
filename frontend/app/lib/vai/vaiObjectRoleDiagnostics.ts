/**
 * NPA-T VAI:2 — developer diagnostics for Object–Variable role resolution.
 */

import type { VaiObjectRoleResolveResult } from "./vaiObjectRoleResolver.ts";

export type VaiObjectRoleDiagnostic = {
  readonly focalObject: string;
  readonly analysisPurpose: string;
  readonly variableId: string;
  readonly considered: true;
  readonly relevance: string;
  readonly relevant: boolean;
  readonly resolvedRole: string | null;
  readonly candidateRoles: readonly string[];
  readonly roleStatus: string;
  readonly confidence: string;
  readonly provenance: readonly string[];
  readonly ambiguity: boolean;
  readonly conflict: boolean;
  readonly reasonCodes: readonly string[];
  readonly causalAssertion: false;
};

export function formatVaiObjectRoleDiagnostics(result: VaiObjectRoleResolveResult): readonly VaiObjectRoleDiagnostic[] {
  return Object.freeze(result.items.map((item) => Object.freeze({
    focalObject: item.focalObjectId,
    analysisPurpose: item.purpose,
    variableId: item.variableId,
    considered: true as const,
    relevance: item.relevanceStatus,
    relevant: item.relevant,
    resolvedRole: item.primaryRole,
    candidateRoles: Object.freeze(item.candidateRoles.map((candidate) => candidate.role)),
    roleStatus: item.roleStatus,
    confidence: item.confidence,
    provenance: item.provenance,
    ambiguity: item.roleStatus === "AMBIGUOUS",
    conflict: item.conflict,
    reasonCodes: item.reasonCodes,
    causalAssertion: false as const,
  })));
}
