/**
 * NPA-T VAI:6 — developer diagnostics for Impact Scene placement.
 */

import type { VaiImpactScene } from "./vaiImpactComposer.ts";

export type VaiImpactDiagnostic = {
  readonly sceneId: string | null;
  readonly sceneIntent: string;
  readonly analysisContext: string | null;
  readonly focalObject: string | null;
  readonly inputSymbolIds: readonly string[];
  readonly roleRegions: readonly string[];
  readonly placementDecisions: readonly string[];
  readonly connectorRouting: readonly string[];
  readonly evidenceStates: readonly string[];
  readonly causalStates: readonly string[];
  readonly ambiguityHandling: readonly string[];
  readonly confounderVisibility: boolean;
  readonly densityDecision: string;
  readonly safeZoneDecision: string;
  readonly advisorHandoffContext: string;
  readonly sourceProjectionIds: readonly string[];
};

export function formatVaiImpactDiagnostics(scene: VaiImpactScene): VaiImpactDiagnostic {
  return Object.freeze({
    sceneId: scene.sceneId,
    sceneIntent: scene.sceneIntent,
    analysisContext: scene.analysisContextId,
    focalObject: scene.focalObjectId,
    inputSymbolIds: Object.freeze(scene.theatreProjection?.symbols.map((item) => item.symbolId) ?? []),
    roleRegions: Object.freeze(scene.placements.map((item) => `${item.participantId}:${item.regionId}`)),
    placementDecisions: Object.freeze(scene.placements.map((item) => item.placementReason)),
    connectorRouting: Object.freeze(scene.connectors.map((item) => `${item.fromId}->${item.toId}:${item.connectorType}`)),
    evidenceStates: Object.freeze(scene.theatreProjection?.symbols.map((item) => `${item.variableId}:${item.evidencePresentation}`) ?? []),
    causalStates: Object.freeze(scene.theatreProjection?.symbols.map((item) => `${item.variableId}:${item.causalPresentation}`) ?? []),
    ambiguityHandling: Object.freeze(
      scene.placements.filter((item) => item.role === "AMBIGUOUS").map((item) => item.regionId),
    ),
    confounderVisibility: scene.confounderVisible,
    densityDecision: `${scene.hiddenCount} collapsed`,
    safeZoneDecision: "placements clamped inside HUD reserved bands",
    advisorHandoffContext: scene.narrative ?? "none",
    sourceProjectionIds: Object.freeze(["VAI:1", "VAI:2", "VAI:3", "VAI:5", "DIR:1"]),
  });
}
