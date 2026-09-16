/**
 * NPA-T VAI:5 — developer diagnostics for Variable Symbol presentation.
 */

import type { VaiVariableSymbol } from "./vaiTheatreContract.ts";
import type { VaiTheatreProjection } from "./vaiTheatreProjector.ts";

export type VaiTheatreDiagnostic = {
  readonly symbolId: string;
  readonly variableId: string;
  readonly analysisContext: string;
  readonly relatedObject: string;
  readonly role: string | null;
  readonly roleStatus: string;
  readonly semanticStatus: string;
  readonly evidenceStatus: string;
  readonly causalStatus: string;
  readonly visualState: string;
  readonly connectorType: string;
  readonly interactionState: string;
  readonly visibilityDecision: string;
  readonly sourceProjection: string;
  readonly whyShownThisWay: string;
  readonly whyConnectorIsNotCausal: string;
};

export function formatVaiTheatreDiagnostics(projection: VaiTheatreProjection): readonly VaiTheatreDiagnostic[] {
  return Object.freeze(
    projection.symbols.map((symbol) => formatOne(symbol)),
  );
}

function formatOne(symbol: VaiVariableSymbol): VaiTheatreDiagnostic {
  const whyConnectorIsNotCausal =
    symbol.connectorType === "causal-confirmed"
      ? "VAI:3 returned evidence-supported causal status."
      : symbol.connectorType === "manager-view"
        ? "Connector is manager-attributed and is not evidence-supported causality."
        : "Connector is association or hypothesis grammar; it does not imply confirmed causality.";
  return Object.freeze({
    symbolId: symbol.symbolId,
    variableId: symbol.variableId,
    analysisContext: symbol.analysisContextId,
    relatedObject: symbol.relatedObjectId,
    role: symbol.analyticalRole,
    roleStatus: symbol.roleStatus,
    semanticStatus: symbol.semanticStatus,
    evidenceStatus: symbol.evidencePresentation,
    causalStatus: symbol.causalPresentation,
    visualState: `${symbol.geometryToken}/${symbol.iconToken}/${symbol.scaleToken}`,
    connectorType: symbol.connectorType,
    interactionState: symbol.interactionCapability,
    visibilityDecision: symbol.densityReason,
    sourceProjection: symbol.sourceProjection,
    whyShownThisWay: `${symbol.displayLabel} is a Variable Symbol attached from trusted VAI:2 relevance. Role ${symbol.analyticalRole ?? "ambiguous"}; scale ${symbol.scaleToken}.`,
    whyConnectorIsNotCausal,
  });
}
