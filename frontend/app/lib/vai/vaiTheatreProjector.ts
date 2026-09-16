/**
 * NPA-T VAI:5 — project Variable Symbols from a legitimate VAI bundle.
 * Empty when no VAI projection is supplied. Does not invent analysis.
 */

import type { VaiAdvisorBundle } from "./vaiAdvisorContract.ts";
import type { VaiContextualRole } from "./vaiContract.ts";
import type { VaiObjectVariableRoleItem } from "./vaiObjectRoleContract.ts";
import type { VaiAnalyticalRelationship } from "./vaiCausalContract.ts";
import { vaiTheatreSymbolLanguageIdentity } from "./vaiTheatreIdentity.ts";
import {
  VAI_THEATRE_BOUNDARY,
  VAI_THEATRE_ROLE_GRAMMAR,
  VAI_THEATRE_SYMBOL_ID_PREFIX,
  VAI_THEATRE_VISIBLE_LIMIT,
  type VaiTheatreConnectorType,
  type VaiTheatreFocalObjectVisual,
  type VaiVariableSymbol,
} from "./vaiTheatreContract.ts";

export type VaiTheatreProjection = {
  readonly identity: typeof vaiTheatreSymbolLanguageIdentity;
  readonly apply: boolean;
  readonly focalObject: VaiTheatreFocalObjectVisual | null;
  readonly symbols: readonly VaiVariableSymbol[];
  readonly visibleSymbolIds: readonly string[];
  readonly collapsedSymbolIds: readonly string[];
  readonly invented: false;
  readonly stageMutated: false;
  readonly objectsCreated: false;
  readonly startsVai6: false;
};

const LEAK = /\b(?:VAI:[1-6]|CC:\d|CORE-INT:3|causalAssertion|role resolver|semantic authority|DTH:\d|DIR:1)\b/i;

export function projectVaiTheatreSymbols(input: {
  readonly bundle: VaiAdvisorBundle | null;
  readonly requestedVariableIds?: readonly string[];
  readonly inspectedSymbolId?: string | null;
}): VaiTheatreProjection {
  if (!input.bundle) {
    return emptyProjection();
  }
  const focal = input.bundle.focalObject;
  const relationship = input.bundle.relationship;
  const requested = new Set(input.requestedVariableIds ?? []);
  const relevant = input.bundle.roleResult.items.filter((item) => item.relevant && item.relevanceStatus === "TRUSTED");
  const ranked = [...relevant].sort((left, right) => rank(left, requested, relationship) - rank(right, requested, relationship));
  const symbols = ranked.map((item, index) =>
    toSymbol({
      item,
      bundle: input.bundle!,
      relationship,
      visible: index < VAI_THEATRE_VISIBLE_LIMIT,
      inspected: input.inspectedSymbolId === symbolIdOf(input.bundle!.analysisContextId, item.variableId),
    }),
  );
  for (const symbol of symbols) {
    assertNoLeak(symbol.displayLabel);
    assertNoLeak(symbol.microLabel);
    assertNoLeak(symbol.accessibilityLabel);
  }
  return Object.freeze({
    identity: vaiTheatreSymbolLanguageIdentity,
    apply: true,
    focalObject: Object.freeze({
      objectId: focal.id,
      label: focal.label,
      visualFamily: "EXECUTIVE_OBJECT",
      scaleToken: "size-dominant",
      dimensionalTreatment: "established-object",
    }),
    symbols: Object.freeze(symbols),
    visibleSymbolIds: Object.freeze(symbols.filter((item) => item.visibility === "visible").map((item) => item.symbolId)),
    collapsedSymbolIds: Object.freeze(symbols.filter((item) => item.visibility === "collapsed").map((item) => item.symbolId)),
    invented: false,
    stageMutated: false,
    objectsCreated: false,
    startsVai6: false,
  });
}

export function verifyVaiTheatreSymbolLanguage(): { readonly ok: true } {
  if (VAI_THEATRE_BOUNDARY.secondStage) throw new Error("VAI:5 must not create a second Stage");
  if (VAI_THEATRE_BOUNDARY.startsVai6) throw new Error("VAI:5 must not start VAI:6");
  if (VAI_THEATRE_BOUNDARY.independentlyPromotesCausality) throw new Error("VAI:5 must not promote causality");
  const geometries = new Set(Object.values(VAI_THEATRE_ROLE_GRAMMAR).map((item) => item.geometryToken));
  const icons = new Set(Object.values(VAI_THEATRE_ROLE_GRAMMAR).map((item) => item.iconToken));
  if (geometries.size !== 6 || icons.size !== 6) throw new Error("VAI:5 roles must be distinguishable without color alone");
  return Object.freeze({ ok: true as const });
}

function emptyProjection(): VaiTheatreProjection {
  return Object.freeze({
    identity: vaiTheatreSymbolLanguageIdentity,
    apply: false,
    focalObject: null,
    symbols: Object.freeze([]),
    visibleSymbolIds: Object.freeze([]),
    collapsedSymbolIds: Object.freeze([]),
    invented: false,
    stageMutated: false,
    objectsCreated: false,
    startsVai6: false,
  });
}

function rank(
  item: VaiObjectVariableRoleItem,
  requested: ReadonlySet<string>,
  relationship: VaiAnalyticalRelationship | null,
): number {
  if (requested.has(item.variableId)) return 0;
  if (item.roleStatus === "AMBIGUOUS" || item.displayName === "CAP_AV" || item.variableId.includes("CAP_AV")) return 1;
  if (relationship?.conflictingEvidence && item.primaryRole === "LEVER") return 1;
  return 2;
}

function toSymbol(input: {
  readonly item: VaiObjectVariableRoleItem;
  readonly bundle: VaiAdvisorBundle;
  readonly relationship: VaiAnalyticalRelationship | null;
  readonly visible: boolean;
  readonly inspected: boolean;
}): VaiVariableSymbol {
  const item = input.item;
  const variable = input.bundle.variables.find((entry) => entry.variableId === item.variableId) ?? null;
  const candidateRoles = Object.freeze(item.candidateRoles.map((candidate) => candidate.role));
  const roleAmbiguous = item.roleStatus === "AMBIGUOUS";
  const meaningUnresolved = variable?.semanticStatus === "AMBIGUOUS" || variable?.semanticStatus === "UNKNOWN" || item.displayName === "CAP_AV";
  const displayLabel = meaningUnresolved && (item.displayName === "CAP_AV" || item.variableId.includes("CAP_AV"))
    ? "CAP_AV"
    : item.displayName;
  const grammarRole = roleAmbiguous ? null : item.primaryRole;
  const grammar = grammarRole
    ? VAI_THEATRE_ROLE_GRAMMAR[grammarRole]
    : { ...ambiguousGrammar(candidateRoles), meaning: "The analytical role is not yet clear." };
  const connector = connectorOf(input.relationship);
  const mixed = input.relationship?.conflictingEvidence === true;
  const managerAsserted = input.relationship?.relationshipStatus === "MANAGER_ASSERTED_CAUSE";
  const causalPresentation = causalPresentationOf(input.relationship);
  const evidencePresentation = mixed ? "mixed" : evidencePresentationOf(input.relationship);
  const microLabel = roleAmbiguous
    ? ambiguousMicroLabel(candidateRoles)
    : meaningUnresolved
      ? "Meaning unresolved"
      : grammar.microLabel;
  const accessibilityLabel = accessibilityOf({
    displayLabel,
    grammar,
    roleAmbiguous,
    candidateRoles,
    meaningUnresolved,
    mixed,
    managerAsserted,
    causalPresentation,
    connector,
  });
  return Object.freeze({
    visualFamily: "VARIABLE_SYMBOL",
    isExecutiveObject: false,
    isStageObject: false,
    symbolId: symbolIdOf(input.bundle.analysisContextId, item.variableId),
    variableId: item.variableId,
    analysisContextId: input.bundle.analysisContextId,
    displayLabel,
    analyticalRole: grammarRole,
    candidateRoles,
    roleStatus: item.roleStatus,
    semanticStatus: variable?.semanticStatus ?? "NOT_APPLICABLE",
    relatedObjectId: input.bundle.focalObject.id,
    confidence: variable?.confidence ?? "UNKNOWN",
    evidencePresentation,
    causalPresentation,
    connectorType: connector,
    visualEmphasis: input.inspected ? "inspected" : "subordinate",
    geometryToken: grammar.geometryToken,
    iconToken: grammar.iconToken,
    microLabel,
    colorNotSoleSignal: true,
    dimensionalTreatment: "2d-overlay-token",
    scaleToken: "size-subordinate",
    visibility: input.visible ? "visible" : "collapsed",
    presentationState: input.inspected ? "expanded" : "compact",
    interactionCapability: "inspect-only",
    accessibilityLabel,
    roleAmbiguous,
    meaningUnresolved,
    managerAssertionAttributed: managerAsserted,
    densityReason: input.visible ? "within-visible-limit" : "collapsed-for-density",
    sourceProjection: "VAI:1-3",
  });
}

function ambiguousGrammar(roles: readonly VaiContextualRole[]): { geometryToken: string; iconToken: string; microLabel: string } {
  return {
    geometryToken: "geometry-split",
    iconToken: "icon-uncertain",
    microLabel: ambiguousMicroLabel(roles),
  };
}

function ambiguousMicroLabel(roles: readonly VaiContextualRole[]): string {
  const names = roles.map((role) => VAI_THEATRE_ROLE_GRAMMAR[role].microLabel.split(" ")[0] ?? role);
  if (roles.includes("LEVER") && roles.includes("MODERATOR")) return "Lever / Moderator ?";
  return `${names.join(" / ")} ?`;
}

function connectorOf(relationship: VaiAnalyticalRelationship | null): VaiTheatreConnectorType {
  if (!relationship) return "none";
  if (relationship.evidenceSupportedCausal && relationship.relationshipStatus === "EVIDENCE_SUPPORTED_CAUSAL" && relationship.causalStatus === "EVIDENCE_SUPPORTED") {
    return "causal-confirmed";
  }
  if (relationship.relationshipStatus === "MANAGER_ASSERTED_CAUSE") return "manager-view";
  if (relationship.relationshipStatus === "CAUSAL_HYPOTHESIS") return "hypothesis";
  if (relationship.relationshipStatus === "DIRECTIONALLY_ASSOCIATED") return "association-directional";
  if (relationship.relationshipStatus === "ASSOCIATED" || relationship.relationshipStatus === "OBSERVED_TOGETHER") {
    return "association-neutral";
  }
  return "none";
}

function causalPresentationOf(relationship: VaiAnalyticalRelationship | null): VaiVariableSymbol["causalPresentation"] {
  if (!relationship) return "none";
  if (relationship.evidenceSupportedCausal && relationship.relationshipStatus === "EVIDENCE_SUPPORTED_CAUSAL") return "confirmed";
  if (relationship.relationshipStatus === "MANAGER_ASSERTED_CAUSE") return "manager-view";
  if (relationship.relationshipStatus === "CAUSAL_HYPOTHESIS") return "hypothesis";
  return "unconfirmed";
}

function evidencePresentationOf(relationship: VaiAnalyticalRelationship | null): VaiVariableSymbol["evidencePresentation"] {
  if (!relationship || relationship.relationshipStatus === "INSUFFICIENT") return "insufficient";
  if (relationship.conflictingEvidence) return "mixed";
  if (relationship.associationStatus === "SUPPORTED" || relationship.associationStatus === "STRONG") return "supported";
  return "none";
}

function accessibilityOf(input: {
  readonly displayLabel: string;
  readonly grammar: { readonly meaning: string; readonly microLabel: string };
  readonly roleAmbiguous: boolean;
  readonly candidateRoles: readonly VaiContextualRole[];
  readonly meaningUnresolved: boolean;
  readonly mixed: boolean;
  readonly managerAsserted: boolean;
  readonly causalPresentation: VaiVariableSymbol["causalPresentation"];
  readonly connector: VaiTheatreConnectorType;
}): string {
  const roleText = input.roleAmbiguous
    ? "Analytical role is not yet clear."
    : input.grammar.meaning;
  const meaningText = input.meaningUnresolved ? "Business meaning is not confirmed." : "";
  const evidenceText = input.mixed
    ? "Evidence is mixed."
    : input.causalPresentation === "confirmed"
      ? "The current evidence supports a causal reading."
      : input.managerAsserted
        ? "This causal view is attributed to the manager and is not independently confirmed."
        : input.connector === "association-neutral"
          ? "Shown as an association, not a confirmed cause."
          : "Evidence relationship is not confirmed as causal.";
  return `${input.displayLabel}. ${roleText} ${meaningText} ${evidenceText}`.replace(/\s+/g, " ").trim();
}

export function symbolIdOf(analysisContextId: string, variableId: string): string {
  return `${VAI_THEATRE_SYMBOL_ID_PREFIX}${analysisContextId}:${variableId}`;
}

function assertNoLeak(text: string): void {
  if (LEAK.test(text)) {
    throw new Error("VAI:5 manager-facing Theatre text leaked architecture terminology");
  }
}
