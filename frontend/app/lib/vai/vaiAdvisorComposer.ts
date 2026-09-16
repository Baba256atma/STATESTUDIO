/**
 * NPA-T VAI:4 — deterministic Advisor composition over VAI:1 → VAI:2 → VAI:3.
 * Does not invent analysis, recommendations, or causal upgrades.
 */

import type { VaiContextualRole } from "./vaiContract.ts";
import type { VaiObjectVariableRoleItem } from "./vaiObjectRoleContract.ts";
import { vaiAdvisorAnalysisIdentity } from "./vaiAdvisorIdentity.ts";
import {
  VAI_ADVISOR_BOUNDARY,
  type VaiAdvisorBundle,
  type VaiAdvisorFocalObject,
  type VaiAdvisorIntent,
  type VaiAdvisorSession,
} from "./vaiAdvisorContract.ts";
import { detectVaiAdvisorIntent } from "./vaiAdvisorIntent.ts";

export type VaiAdvisorComposition = {
  readonly identity: typeof vaiAdvisorAnalysisIdentity;
  readonly apply: boolean;
  readonly intent: VaiAdvisorIntent;
  readonly response: string | null;
  readonly focalObjectId: string | null;
  readonly analysisContextId: string | null;
  readonly consideredVariableIds: readonly string[];
  readonly investigationSuggestion: string | null;
  readonly clarification: boolean;
  readonly npsPathCreated: false;
  readonly recommendationIssued: false;
  readonly scenarioCreated: false;
  readonly decisionCreated: false;
  readonly executionStarted: false;
  readonly stageMutated: false;
  readonly causalUpgrade: false;
  readonly nextSession: VaiAdvisorSession | null;
  readonly compositionBasis: readonly string[];
  readonly roleSummaries: readonly string[];
  readonly relationshipStatus: string | null;
  readonly causalStatus: string | null;
  readonly unresolvedConfounders: readonly string[];
  readonly uncertainty: readonly string[];
};

const LEAK = /\b(?:VAI:[1-4]|CC:8|CORE-INT:3|causal resolver|semantic authority|causalAssertion|role registry)\b/i;

export function composeVaiAdvisorAnalysis(input: {
  readonly utterance: string;
  readonly bundle: VaiAdvisorBundle | null;
  readonly previousSession?: VaiAdvisorSession | null;
  readonly focalOverride?: VaiAdvisorFocalObject | null;
}): VaiAdvisorComposition {
  const intent = detectVaiAdvisorIntent(input.utterance);
  if (intent === "NONE" || !input.bundle) {
    return empty(intent, false);
  }
  const focal = input.focalOverride ?? input.bundle.focalObject;
  if (!focal.id.trim() || !focal.label.trim()) {
    return clarify(intent, "Which Object should this analysis use?");
  }
  const roles = input.bundle.roleResult.items.filter((item) => item.relevant);
  const relationship = input.bundle.relationship;
  const previous = input.previousSession;
  const text = composeText(intent, focal, roles, relationship, previous, input.bundle);
  const last = lastFocus(intent, roles, previous);
  const suggestion = intent === "INVESTIGATE" || intent === "VARIABLES_MATTER"
    ? investigationOf(roles, relationship)
    : null;
  const response = finalize(text, suggestion, intent);
  if (LEAK.test(response)) {
    throw new Error("VAI:4 manager-facing text leaked architecture terminology");
  }
  return Object.freeze({
    identity: vaiAdvisorAnalysisIdentity,
    apply: true,
    intent,
    response,
    focalObjectId: focal.id,
    analysisContextId: input.bundle.analysisContextId,
    consideredVariableIds: Object.freeze(roles.map((item) => item.variableId)),
    investigationSuggestion: suggestion,
    clarification: false,
    npsPathCreated: false,
    recommendationIssued: false,
    scenarioCreated: false,
    decisionCreated: false,
    executionStarted: false,
    stageMutated: false,
    causalUpgrade: false,
    nextSession: Object.freeze({
      analysisContextId: input.bundle.analysisContextId,
      focalObjectId: focal.id,
      focalObjectLabel: focal.label,
      lastVariableId: last.variableId,
      lastRole: last.role,
    }),
    compositionBasis: Object.freeze([
      "VAI:1 variables",
      "VAI:2 roles",
      relationship ? "VAI:3 evidence" : "no VAI:3 relationship",
      `intent:${intent}`,
      `focal:${focal.id}`,
    ]),
    roleSummaries: Object.freeze(roles.map((item) => `${item.displayName}:${item.primaryRole ?? "none"}:${item.roleStatus}`)),
    relationshipStatus: relationship?.relationshipStatus ?? null,
    causalStatus: relationship?.causalStatus ?? null,
    unresolvedConfounders: Object.freeze(relationship?.unresolvedConfounders ?? []),
    uncertainty: Object.freeze([
      ...roles.filter((item) => item.roleStatus === "AMBIGUOUS" || item.displayName === "CAP_AV").map((item) => item.displayName),
      ...(relationship?.unresolvedConfounders ?? []),
      ...(relationship?.conflictingEvidence ? ["conflicting-evidence"] : []),
    ]),
  });
}

export function applyVaiAdvisorToPresentedResponse(input: {
  readonly source: string;
  readonly utterance: string;
  readonly bundle: VaiAdvisorBundle | null;
  readonly previousSession?: VaiAdvisorSession | null;
  readonly focalOverride?: VaiAdvisorFocalObject | null;
  readonly locked?: boolean;
}): { readonly source: string; readonly composition: VaiAdvisorComposition } {
  const composition = composeVaiAdvisorAnalysis({
    utterance: input.utterance,
    bundle: input.bundle,
    previousSession: input.previousSession,
    focalOverride: input.focalOverride,
  });
  if (input.locked || !composition.apply || !composition.response) {
    return { source: input.source, composition };
  }
  return { source: composition.response, composition };
}

export function verifyVaiAdvisorAnalysis(): { readonly ok: true } {
  if (VAI_ADVISOR_BOUNDARY.secondAdvisor) throw new Error("VAI:4 must not create a second Advisor");
  if (VAI_ADVISOR_BOUNDARY.independentlyPromotesCausality) throw new Error("VAI:4 must not independently promote causality");
  if (VAI_ADVISOR_BOUNDARY.startsVai5) throw new Error("VAI:4 must not start VAI:5");
  return Object.freeze({ ok: true as const });
}

function composeText(
  intent: VaiAdvisorIntent,
  focal: VaiAdvisorFocalObject,
  roles: readonly VaiObjectVariableRoleItem[],
  relationship: VaiAdvisorBundle["relationship"],
  previous: VaiAdvisorSession | null | undefined,
  bundle: VaiAdvisorBundle,
): string {
  void bundle.staleObjectLabel;
  if (intent === "LEVER") return leverText(roles);
  if (intent === "OUTCOME") return outcomeText(roles);
  if (intent === "PATH") return namedRoleText(roles, "PATH_OF_EFFECT", "may be part of the pathway worth investigating");
  if (intent === "MODERATOR") return namedRoleText(roles, "MODERATOR", "may change how other factors relate to the result. That moderation effect is not proven");
  if (intent === "CONTROL") return namedRoleText(roles, "CONTROL", "is something we may want to hold stable during comparison");
  if (intent === "CONFOUNDER") return confounderText(roles, relationship);
  if (intent === "CAUSAL" || intent === "FOLLOWUP_CAUSE") return causalText(relationship);
  if (intent === "WHY_ROLE") return whyRoleText(roles, previous);
  if (intent === "WHY_NOT_CAUSE") return whyNotCauseText(relationship);
  if (intent === "EVIDENCE" || intent === "FOLLOWUP_EVIDENCE") return evidenceText(relationship, previous, roles);
  if (intent === "FOLLOWUP_LEVER") return followupLeverText(roles, previous);
  if (intent === "INVESTIGATE") return `For ${focal.label}, the next useful step is analytical investigation, not a Decision or Execution.`;
  return mattersText(focal, roles, relationship);
}

function mattersText(
  focal: VaiAdvisorFocalObject,
  roles: readonly VaiObjectVariableRoleItem[],
  relationship: VaiAdvisorBundle["relationship"],
): string {
  if (roles.length === 0) {
    return `I do not have confirmed variables for ${focal.label} in this analysis.`;
  }
  const parts = roles.map((item) => describeRole(item));
  const evidence = relationship ? ` ${evidenceClause(relationship)}` : "";
  return `${parts.join(" ")}${evidence}`.trim();
}

function describeRole(item: VaiObjectVariableRoleItem): string {
  if (item.displayName === "CAP_AV" || item.variableId.includes("CAP_AV")) {
    return `CAP_AV exists in the data, but its business meaning is not confirmed, so I cannot safely use it as Available Capacity in this analysis.`;
  }
  if (item.roleStatus === "AMBIGUOUS") {
    const names = item.candidateRoles.map((candidate) => candidate.role);
    if (names.includes("LEVER") && names.includes("MODERATOR")) {
      return `${item.displayName} is relevant, but its analytical role is not yet clear. It could be something management can change, or a condition that changes how other factors affect the outcome.`;
    }
    return `${item.displayName} is relevant, but its analytical role is not yet clear.`;
  }
  if (item.primaryRole === "LEVER") {
    return `${item.displayName} is a potential lever in this analysis.`;
  }
  if (item.primaryRole === "OUTCOME") {
    return `${item.displayName} is the main outcome being observed here.`;
  }
  if (item.primaryRole === "PATH_OF_EFFECT") {
    return `${item.displayName} may be part of the pathway worth investigating.`;
  }
  if (item.primaryRole === "MODERATOR") {
    return `${item.displayName} may change how other factors relate to the result.`;
  }
  if (item.primaryRole === "CONTROL") {
    return `${item.displayName} is something we may want to hold stable during comparison.`;
  }
  if (item.primaryRole === "CONFOUNDER") {
    return `${item.displayName} is still an alternative explanation.`;
  }
  return `${item.displayName} is relevant to this analysis.`;
}

function leverText(roles: readonly VaiObjectVariableRoleItem[]): string {
  const levers = roles.filter((item) => item.primaryRole === "LEVER");
  if (levers.length === 0) return "I do not have a confirmed management lever in this analysis.";
  return `${levers.map((item) => `${item.displayName} is a potential lever in this analysis.`).join(" ")} Treating it as a lever does not prove that changing it solves the problem.`;
}

function outcomeText(roles: readonly VaiObjectVariableRoleItem[]): string {
  const outcomes = roles.filter((item) => item.primaryRole === "OUTCOME");
  if (outcomes.length === 0) return "I do not have a confirmed outcome variable in this analysis. A KPI is not automatically the outcome.";
  return outcomes.map((item) => `${item.displayName} is the main outcome being observed here.`).join(" ");
}

function namedRoleText(roles: readonly VaiObjectVariableRoleItem[], role: VaiContextualRole, clause: string): string {
  const matches = roles.filter((item) => item.primaryRole === role);
  if (matches.length === 0) return `I do not have a confirmed factor in that role for this analysis.`;
  return matches.map((item) => `${item.displayName} ${clause}.`).join(" ");
}

function confounderText(
  roles: readonly VaiObjectVariableRoleItem[],
  relationship: VaiAdvisorBundle["relationship"],
): string {
  const names = relationship?.unresolvedConfounders?.length
    ? relationship.unresolvedConfounders
    : roles.filter((item) => item.primaryRole === "CONFOUNDER").map((item) => item.displayName);
  if (names.length === 0) return "I do not currently have an unresolved alternative explanation for this pattern.";
  return `${names.join(" and ")} ${names.length === 1 ? "is" : "are"} still an alternative explanation, so the current evidence is not enough to claim causality.`;
}

function causalText(relationship: VaiAdvisorBundle["relationship"]): string {
  if (!relationship) {
    return "Current evidence is not sufficient to determine whether these variables are related.";
  }
  if (relationship.evidenceSupportedCausal && relationship.causalStatus === "EVIDENCE_SUPPORTED") {
    return relationship.safeStatement;
  }
  if (relationship.relationshipStatus === "MANAGER_ASSERTED_CAUSE" && relationship.managerAssertion) {
    return `You identified ${causeLabel(relationship)} as the cause. Current evidence has not independently confirmed that conclusion.`;
  }
  if (relationship.associationStatus === "CONFLICTING" || relationship.conflictingEvidence) {
    return "The evidence is mixed. One period shows a relationship while another does not. I would not treat this as a proven cause, and I am not proposing an action from that conflict.";
  }
  if (relationship.unresolvedConfounders.length > 0) {
    return `The observations show an association, but ${relationship.unresolvedConfounders.join(" and ")} could also explain the pattern. The current evidence does not establish a cause.`;
  }
  if (relationship.relationshipStatus === "ASSOCIATED" || relationship.associationStatus === "SUPPORTED" || relationship.associationStatus === "STRONG") {
    return "Higher Demand is associated with higher Delay in the available observations. That association is not a confirmed cause.";
  }
  if (relationship.relationshipStatus === "OBSERVED_TOGETHER") {
    return "These were observed together in the same period. That does not establish that one drove the other.";
  }
  return relationship.safeStatement;
}

function whyRoleText(roles: readonly VaiObjectVariableRoleItem[], previous: VaiAdvisorSession | null | undefined): string {
  const staffing = roles.find((item) => item.variableId === previous?.lastVariableId)
    ?? roles.find((item) => /staffing/i.test(item.displayName))
    ?? roles.find((item) => item.primaryRole === "LEVER");
  if (!staffing) return "I do not have a lever classification to explain in this analysis.";
  return `In this analysis, ${staffing.displayName} is treated as a potential lever because it is linked to the current Object as a factor management may be able to change. That classification does not prove that changing it will solve the problem.`;
}

function whyNotCauseText(relationship: VaiAdvisorBundle["relationship"]): string {
  if (!relationship) return "There is not enough evidence to support a causal statement.";
  if (relationship.unresolvedConfounders.length > 0) {
    return `The data shows an association, but unresolved factors such as ${relationship.unresolvedConfounders.join(" and ")} could also explain the pattern. The current evidence does not pass the threshold for a causal statement.`;
  }
  if (relationship.conflictingEvidence) {
    return "The evidence is mixed, so a causal statement would be stronger than the observations allow.";
  }
  return "The current evidence shows association or co-observation, not a confirmed cause.";
}

function evidenceText(
  relationship: VaiAdvisorBundle["relationship"],
  previous: VaiAdvisorSession | null | undefined,
  roles: readonly VaiObjectVariableRoleItem[],
): string {
  void previous;
  void roles;
  if (!relationship || relationship.evidenceRefs.length === 0) {
    return "I do not have sufficient observations to describe the relationship yet.";
  }
  if (relationship.conflictingEvidence) {
    return "The evidence is mixed across the available observations. I would not treat a cause as proven.";
  }
  return evidenceClause(relationship);
}

function followupLeverText(roles: readonly VaiObjectVariableRoleItem[], previous: VaiAdvisorSession | null | undefined): string {
  const item = roles.find((role) => role.variableId === previous?.lastVariableId)
    ?? roles.find((role) => role.primaryRole === "LEVER");
  if (!item) return "I am not currently holding a lever from the previous turn. Which factor do you mean?";
  return `${item.displayName} remains the potential lever in this analysis. Treating it as a lever does not prove that changing it solves the problem.`;
}

function evidenceClause(relationship: NonNullable<VaiAdvisorBundle["relationship"]>): string {
  if (relationship.evidenceSupportedCausal) return relationship.safeStatement;
  if (relationship.relationshipStatus === "MANAGER_ASSERTED_CAUSE") {
    return "A manager causal statement is on record, and independent evidence has not confirmed it.";
  }
  if (relationship.unresolvedConfounders.length > 0) {
    return `Current evidence does not establish a cause, because ${relationship.unresolvedConfounders[0]} remains an alternative explanation.`;
  }
  if (relationship.relationshipStatus === "ASSOCIATED" || relationship.associationStatus === "STRONG" || relationship.associationStatus === "SUPPORTED") {
    return "Current evidence shows an association, not a confirmed cause.";
  }
  return "Current evidence does not establish a cause.";
}

function investigationOf(
  roles: readonly VaiObjectVariableRoleItem[],
  relationship: VaiAdvisorBundle["relationship"],
): string {
  const cap = roles.find((item) => item.displayName === "CAP_AV");
  if (cap) return "Confirm what CAP_AV represents before using it in this analysis.";
  if (relationship?.unresolvedConfounders[0]) {
    return `Check whether the observed relationship remains after accounting for ${relationship.unresolvedConfounders[0]}.`;
  }
  if (relationship?.conflictingEvidence) {
    return "Compare the conflicting observation periods before treating any factor as a cause.";
  }
  const lever = roles.find((item) => item.primaryRole === "LEVER");
  if (lever) return `Investigate how ${lever.displayName} relates to the observed result, without assuming that changing it solves the problem.`;
  return "Review additional observations for this analysis.";
}

function lastFocus(
  intent: VaiAdvisorIntent,
  roles: readonly VaiObjectVariableRoleItem[],
  previous: VaiAdvisorSession | null | undefined,
): { readonly variableId: string | null; readonly role: string | null } {
  if (intent === "FOLLOWUP_LEVER" || intent === "LEVER" || intent === "WHY_ROLE") {
    const lever = roles.find((item) => item.variableId === previous?.lastVariableId)
      ?? roles.find((item) => item.primaryRole === "LEVER");
    return { variableId: lever?.variableId ?? previous?.lastVariableId ?? null, role: lever?.primaryRole ?? "LEVER" };
  }
  const first = roles.find((item) => item.primaryRole) ?? roles[0];
  return { variableId: first?.variableId ?? previous?.lastVariableId ?? null, role: first?.primaryRole ?? previous?.lastRole ?? null };
}

function causeLabel(relationship: NonNullable<VaiAdvisorBundle["relationship"]>): string {
  return relationship.managerAssertion?.assertedCauseVariableId?.replace(/^vai:/, "").replace(/-/g, " ")
    ?? "the stated factor";
}

function finalize(text: string, suggestion: string | null, intent: VaiAdvisorIntent): string {
  if (intent === "INVESTIGATE" && suggestion) return `${text} ${suggestion}`.trim();
  if (intent === "VARIABLES_MATTER" && suggestion && /CAP_AV|Seasonality|mixed/i.test(suggestion)) {
    return `${text} ${suggestion}`.trim();
  }
  return text.trim();
}

function empty(intent: VaiAdvisorIntent, apply: boolean): VaiAdvisorComposition {
  return Object.freeze({
    identity: vaiAdvisorAnalysisIdentity,
    apply,
    intent,
    response: null,
    focalObjectId: null,
    analysisContextId: null,
    consideredVariableIds: Object.freeze([]),
    investigationSuggestion: null,
    clarification: false,
    npsPathCreated: false,
    recommendationIssued: false,
    scenarioCreated: false,
    decisionCreated: false,
    executionStarted: false,
    stageMutated: false,
    causalUpgrade: false,
    nextSession: null,
    compositionBasis: Object.freeze([]),
    roleSummaries: Object.freeze([]),
    relationshipStatus: null,
    causalStatus: null,
    unresolvedConfounders: Object.freeze([]),
    uncertainty: Object.freeze([]),
  });
}

function clarify(intent: VaiAdvisorIntent, response: string): VaiAdvisorComposition {
  return Object.freeze({
    ...empty(intent, true),
    response,
    clarification: true,
    compositionBasis: Object.freeze(["clarification-required"]),
  });
}
