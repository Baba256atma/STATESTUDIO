/**
 * NPA-T VAI:2 — read-only Object → Variable relevance and contextual role resolution.
 */

import type { VaiVariable } from "./vaiContract.ts";
import { VAI_CONTEXTUAL_ROLES, type VaiContextualRole } from "./vaiContract.ts";
import { vaiObjectRoleResolutionIdentity } from "./vaiObjectRoleIdentity.ts";
import {
  VAI_OBJECT_ROLE_BOUNDARY,
  type VaiObjectRoleAnalysisContext,
  type VaiObjectVariableRoleItem,
  type VaiRelevanceLink,
  type VaiRelevanceStatus,
  type VaiResolvedRoleCandidate,
  type VaiRoleEvidence,
  type VaiRoleStatus,
} from "./vaiObjectRoleContract.ts";

export type VaiObjectRoleResolveInput = {
  readonly context: VaiObjectRoleAnalysisContext;
  readonly variables: readonly VaiVariable[];
  readonly relevanceLinks?: readonly VaiRelevanceLink[];
  readonly roleEvidence?: readonly VaiRoleEvidence[];
};

export type VaiObjectRoleResolveResult = {
  readonly identity: typeof vaiObjectRoleResolutionIdentity;
  readonly analysisContextId: string;
  readonly focalObjectId: string;
  readonly purpose: VaiObjectRoleAnalysisContext["purpose"];
  readonly items: readonly VaiObjectVariableRoleItem[];
  readonly causalAssertion: false;
  readonly canonicalMutation: false;
  readonly objectsCreated: false;
};

export function resolveVaiObjectVariableRoles(input: VaiObjectRoleResolveInput): VaiObjectRoleResolveResult {
  if (!input.context.analysisContextId.trim()) throw new Error("VAI:2 analysisContextId is required");
  if (!input.context.focalObjectId.trim()) throw new Error("VAI:2 focalObjectId is required");
  const byId = new Map(input.variables.map((variable) => [variable.variableId, variable]));
  const items = Object.freeze(
    input.context.availableVariableIds.map((variableId) =>
      resolveItem(variableId, byId.get(variableId) ?? null, input),
    ),
  );
  return Object.freeze({
    identity: vaiObjectRoleResolutionIdentity,
    analysisContextId: input.context.analysisContextId,
    focalObjectId: input.context.focalObjectId,
    purpose: input.context.purpose,
    items,
    causalAssertion: false,
    canonicalMutation: false,
    objectsCreated: false,
  });
}

function resolveItem(
  variableId: string,
  variable: VaiVariable | null,
  input: VaiObjectRoleResolveInput,
): VaiObjectVariableRoleItem {
  const displayName = variable?.displayName ?? variableId;
  const semanticBlocksRole = semanticsBlockBusinessRole(variable);
  const relevance = resolveRelevance(variableId, variable, input);
  const attached = relevance.status === "TRUSTED";
  const candidates = attached && !semanticBlocksRole
    ? collectRoleCandidates(variableId, input)
    : Object.freeze([]);
  const conflict = hasRoleConflict(candidates);
  const uniqueSupported = uniqueDeterminateRole(candidates);
  const roleStatus = roleStatusFor(attached, semanticBlocksRole, candidates, conflict, uniqueSupported);
  const primaryRole = roleStatus === "CONFIRMED" || roleStatus === "SUPPORTED" || roleStatus === "CANDIDATE"
    ? uniqueSupported
    : null;
  const reasonCodes = Object.freeze([
    relevance.reasonCode,
    semanticBlocksRole ? "SEMANTIC_UNRESOLVED" : null,
    conflict ? "ROLE_CONFLICT" : null,
    roleStatus === "UNKNOWN" ? "ROLE_UNKNOWN" : null,
    roleStatus === "AMBIGUOUS" ? "ROLE_CANDIDATES_AMBIGUOUS" : null,
    "OBJECT_TYPE_NOT_DETERMINATIVE",
    "CAUSAL_ASSERTION_FALSE",
  ].filter((code): code is string => Boolean(code)));

  return Object.freeze({
    identity: vaiObjectRoleResolutionIdentity,
    analysisContextId: input.context.analysisContextId,
    purpose: input.context.purpose,
    focalObjectId: input.context.focalObjectId,
    focalObjectFamily: input.context.focalObjectFamily,
    variableId,
    displayName,
    relevant: attached,
    relevanceStatus: relevance.status,
    relevanceReasonCode: relevance.reasonCode,
    roleStatus,
    primaryRole,
    candidateRoles: candidates,
    conflict,
    confidence: conflict ? "LOW" : uniqueSupported ? (candidates.find((item) => item.role === uniqueSupported)?.confidence ?? "UNKNOWN") : attached ? "UNKNOWN" : "UNKNOWN",
    provenance: Object.freeze([
      ...candidates.map((item) => `${item.basis}::${item.sourceRef}`),
      ...relevance.provenance,
    ]),
    reasonCodes,
    causalAssertion: false,
    objectTypeDeterminedRole: false,
  });
}

function semanticsBlockBusinessRole(variable: VaiVariable | null): boolean {
  if (!variable) return false;
  return variable.semanticStatus === "AMBIGUOUS" || variable.semanticStatus === "UNKNOWN";
}

function resolveRelevance(
  variableId: string,
  variable: VaiVariable | null,
  input: VaiObjectRoleResolveInput,
): { readonly status: VaiRelevanceStatus; readonly reasonCode: string; readonly provenance: readonly string[] } {
  const focal = input.context.focalObjectId;
  const objectRef = variable?.relatedObjectIds.includes(focal) === true;
  const trustedLinks = (input.relevanceLinks ?? []).filter(
    (link) => link.variableId === variableId && link.objectId === focal && link.trusted && link.basis !== "NAME_SIMILARITY",
  );
  const nameOnly = (input.relevanceLinks ?? []).some(
    (link) => link.variableId === variableId && link.objectId === focal && link.basis === "NAME_SIMILARITY",
  );
  if (objectRef || trustedLinks.length > 0) {
    const provenance = objectRef
      ? Object.freeze([`OBJECT_REFERENCE::${focal}`])
      : Object.freeze(trustedLinks.map((link) => `${link.basis}::${link.sourceRef}`));
    return { status: "TRUSTED", reasonCode: objectRef ? "TRUSTED_OBJECT_REFERENCE" : `TRUSTED_${trustedLinks[0]!.basis}`, provenance };
  }
  if (nameOnly) {
    return {
      status: "UNRESOLVED_CANDIDATE",
      reasonCode: "NAME_SIMILARITY_UNRESOLVED",
      provenance: Object.freeze(["NAME_SIMILARITY"]),
    };
  }
  return { status: "REJECTED", reasonCode: "NO_TRUSTED_RELEVANCE", provenance: Object.freeze([]) };
}

function collectRoleCandidates(variableId: string, input: VaiObjectRoleResolveInput): readonly VaiResolvedRoleCandidate[] {
  const fromManager = (input.context.managerConfirmedConstraints ?? [])
    .filter((item) => item.variableId === variableId)
    .map((item) => freezeCandidate({
      role: item.role,
      status: "CONFIRMED",
      confidence: "HIGH",
      basis: "manager-confirmed analysis constraint",
      sourceRef: item.sourceRef,
      reasonCode: "ROLE_MANAGER_CONFIRMED",
    }));
  const fromEvidence = (input.roleEvidence ?? [])
    .filter((item) => item.variableId === variableId)
    .map((item) => freezeCandidate({
      role: item.role,
      status: item.status,
      confidence: item.confidence ?? (item.status === "SUPPORTED" ? "MEDIUM" : "LOW"),
      basis: item.basis,
      sourceRef: item.sourceRef,
      reasonCode: item.status === "SUPPORTED" ? "ROLE_SUPPORTED" : item.status === "CONFIRMED" ? "ROLE_MANAGER_CONFIRMED" : "ROLE_CANDIDATE",
    }));
  return Object.freeze(dedupeCandidates([...fromManager, ...fromEvidence]));
}

function freezeCandidate(candidate: VaiResolvedRoleCandidate): VaiResolvedRoleCandidate {
  return Object.freeze({ ...candidate });
}

function dedupeCandidates(candidates: readonly VaiResolvedRoleCandidate[]): readonly VaiResolvedRoleCandidate[] {
  const rank: Record<VaiResolvedRoleCandidate["status"], number> = { CONFIRMED: 3, SUPPORTED: 2, CANDIDATE: 1 };
  const best = new Map<VaiContextualRole, VaiResolvedRoleCandidate>();
  for (const candidate of candidates) {
    if (!VAI_CONTEXTUAL_ROLES.includes(candidate.role)) continue;
    const current = best.get(candidate.role);
    if (!current || rank[candidate.status] > rank[current.status]) best.set(candidate.role, candidate);
  }
  return Object.freeze([...best.values()]);
}

function hasRoleConflict(candidates: readonly VaiResolvedRoleCandidate[]): boolean {
  const strong = candidates.filter((item) => item.status === "CONFIRMED" || item.status === "SUPPORTED");
  const roles = new Set(strong.map((item) => item.role));
  return roles.size > 1;
}

function uniqueDeterminateRole(candidates: readonly VaiResolvedRoleCandidate[]): VaiContextualRole | null {
  if (hasRoleConflict(candidates)) return null;
  const confirmed = candidates.filter((item) => item.status === "CONFIRMED");
  if (confirmed.length === 1) return confirmed[0]!.role;
  const supported = candidates.filter((item) => item.status === "SUPPORTED");
  const otherCandidates = candidates.filter((item) => item.status === "CANDIDATE" && item.role !== supported[0]?.role);
  if (confirmed.length === 0 && supported.length === 1 && otherCandidates.length === 0) {
    return supported[0]!.role;
  }
  if (candidates.length === 1) return candidates[0]!.role;
  return null;
}

function roleStatusFor(
  attached: boolean,
  semanticBlocked: boolean,
  candidates: readonly VaiResolvedRoleCandidate[],
  conflict: boolean,
  unique: VaiContextualRole | null,
): VaiRoleStatus {
  if (!attached || semanticBlocked) return "UNKNOWN";
  if (conflict) return "CONFLICTING";
  if (unique) {
    const match = candidates.find((item) => item.role === unique);
    return match?.status ?? "UNKNOWN";
  }
  if (candidates.length > 1) return "AMBIGUOUS";
  if (candidates.length === 0) return "UNKNOWN";
  return "AMBIGUOUS";
}

export function verifyVaiObjectRoleResolution(): { readonly ok: true } {
  if (VAI_OBJECT_ROLE_BOUNDARY.infersCausality) throw new Error("VAI:2 must not infer causality");
  if (VAI_OBJECT_ROLE_BOUNDARY.objectTypeDeterminesRole) throw new Error("VAI:2 must not let Object type determine role");
  if (VAI_OBJECT_ROLE_BOUNDARY.parallelCausalGraph) throw new Error("VAI:2 must not create a causal graph");
  if (VAI_OBJECT_ROLE_BOUNDARY.startsVai3) throw new Error("VAI:2 must not start VAI:3");
  return Object.freeze({ ok: true as const });
}
