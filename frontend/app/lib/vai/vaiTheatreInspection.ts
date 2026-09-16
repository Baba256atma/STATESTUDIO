/**
 * NPA-T VAI:5 — read-only Variable Symbol inspection and VAI:4 Advisor handoff.
 */

import { composeVaiAdvisorAnalysis } from "./vaiAdvisorComposer.ts";
import type { VaiAdvisorBundle, VaiAdvisorSession } from "./vaiAdvisorContract.ts";
import type { VaiTheatreProjection } from "./vaiTheatreProjector.ts";
import type { VaiVariableSymbol } from "./vaiTheatreContract.ts";

export type VaiTheatreInspection = {
  readonly symbol: VaiVariableSymbol | null;
  readonly presentationState: "expanded" | "none";
  readonly advisorUtterance: string | null;
  readonly advisorHandoffApplies: boolean;
  readonly advisorResponse: string | null;
  readonly secondAdvisorState: false;
  readonly writes: {
    readonly variables: false;
    readonly roles: false;
    readonly evidence: false;
    readonly dataReality: false;
    readonly objects: false;
    readonly scenario: false;
    readonly decision: false;
    readonly execution: false;
    readonly stage: false;
  };
};

export function inspectVaiTheatreSymbol(input: {
  readonly projection: VaiTheatreProjection;
  readonly symbolId: string;
  readonly bundle: VaiAdvisorBundle | null;
}): VaiTheatreInspection {
  const symbol = input.projection.symbols.find((item) => item.symbolId === input.symbolId) ?? null;
  if (!symbol) {
    return Object.freeze({
      symbol: null,
      presentationState: "none",
      advisorUtterance: null,
      advisorHandoffApplies: false,
      advisorResponse: null,
      secondAdvisorState: false,
      writes: writes(),
    });
  }
  const session: VaiAdvisorSession = {
    analysisContextId: symbol.analysisContextId,
    focalObjectId: symbol.relatedObjectId,
    focalObjectLabel: input.bundle?.focalObject.label ?? "",
    lastVariableId: symbol.variableId,
    lastRole: symbol.analyticalRole,
  };
  const advisorUtterance = utteranceFor(symbol);
  const composition = input.bundle
    ? composeVaiAdvisorAnalysis({
        utterance: advisorUtterance,
        bundle: input.bundle,
        previousSession: session,
      })
    : null;
  return Object.freeze({
    symbol: Object.freeze({ ...symbol, presentationState: "expanded", visualEmphasis: "inspected" }),
    presentationState: "expanded",
    advisorUtterance,
    advisorHandoffApplies: Boolean(composition?.apply),
    advisorResponse: composition?.response ?? null,
    secondAdvisorState: false,
    writes: writes(),
  });
}

function utteranceFor(symbol: VaiVariableSymbol): string {
  if (symbol.roleAmbiguous) return "What variables matter here?";
  if (symbol.analyticalRole === "LEVER") return "Tell me more about the lever.";
  if (symbol.analyticalRole === "OUTCOME") return "What outcome are we watching?";
  if (symbol.analyticalRole === "CONFOUNDER") return "What could explain this relationship?";
  if (symbol.analyticalRole === "PATH_OF_EFFECT") return "What is the effect path?";
  return "What evidence do we have for it?";
}

function writes() {
  return Object.freeze({
    variables: false as const,
    roles: false as const,
    evidence: false as const,
    dataReality: false as const,
    objects: false as const,
    scenario: false as const,
    decision: false as const,
    execution: false as const,
    stage: false as const,
  });
}
