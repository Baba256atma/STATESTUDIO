/**
 * NPA-T VAI:6 — compose a bounded Impact Analysis Scene from resolved VAI:1–5 inputs.
 */

import { composeVaiAdvisorAnalysis } from "./vaiAdvisorComposer.ts";
import type { VaiAdvisorBundle } from "./vaiAdvisorContract.ts";
import { inspectVaiTheatreSymbol } from "./vaiTheatreInspection.ts";
import { projectVaiTheatreSymbols, type VaiTheatreProjection } from "./vaiTheatreProjector.ts";
import type { VaiVariableSymbol } from "./vaiTheatreContract.ts";
import { vaiImpactSceneIdentity } from "./vaiImpactIdentity.ts";
import {
  VAI_IMPACT_BOUNDARY,
  VAI_IMPACT_COMPLEXITY,
  VAI_IMPACT_ROLE_REGIONS,
  VAI_IMPACT_SAFE_ZONES,
  VAI_IMPACT_SCENE_INTENT,
  VAI_IMPACT_THEATRE_INTENT_KIND,
  VAI_IMPACT_VISIBLE_LIMIT,
  type VaiImpactComplexity,
  type VaiImpactConnectorRoute,
  type VaiImpactPlacement,
} from "./vaiImpactContract.ts";
import type { VaiContextualRole } from "./vaiContract.ts";

export type VaiImpactScene = {
  readonly identity: typeof vaiImpactSceneIdentity;
  readonly apply: boolean;
  readonly sceneIntent: typeof VAI_IMPACT_SCENE_INTENT;
  readonly theatreIntentKind: typeof VAI_IMPACT_THEATRE_INTENT_KIND;
  readonly sceneId: string | null;
  readonly analysisContextId: string | null;
  readonly complexity: VaiImpactComplexity;
  readonly focalObjectId: string | null;
  readonly focalObjectLabel: string | null;
  readonly focalDominant: boolean;
  readonly theatreProjection: VaiTheatreProjection | null;
  readonly placements: readonly VaiImpactPlacement[];
  readonly connectors: readonly VaiImpactConnectorRoute[];
  readonly evidenceRefs: readonly string[];
  readonly narrative: string | null;
  readonly hiddenCount: number;
  readonly confounderVisible: boolean;
  readonly interventionPredicted: false;
  readonly outcomeDelta: null;
  readonly scenarioCreated: false;
  readonly causalGraphCreated: false;
  readonly objectsCreated: false;
  readonly stageMutated: false;
  readonly startsVai7: false;
};

const LEAK = /\b(?:VAI:[1-7]|CC:\d|CORE-INT:3|causalAssertion|role resolver|semantic authority|DTH:\d|DIR:1)\b/i;

export function composeVaiImpactScene(input: {
  readonly bundle: VaiAdvisorBundle | null;
  readonly complexity?: VaiImpactComplexity;
  readonly requestedVariableIds?: readonly string[];
  readonly inspectedSymbolId?: string | null;
  readonly theatreWidth?: number;
  readonly theatreHeight?: number;
}): VaiImpactScene {
  const complexity = input.complexity && VAI_IMPACT_COMPLEXITY.includes(input.complexity) ? input.complexity : "STANDARD";
  if (!input.bundle || !input.bundle.focalObject.id.trim()) {
    return emptyScene(complexity);
  }
  const theatre = projectVaiTheatreSymbols({
    bundle: input.bundle,
    requestedVariableIds: input.requestedVariableIds,
    inspectedSymbolId: input.inspectedSymbolId,
  });
  const ordered = prioritize(theatre.symbols);
  const limit = VAI_IMPACT_VISIBLE_LIMIT[complexity];
  const visible = ordered.slice(0, limit);
  const hidden = ordered.slice(limit);
  const focal = placement({
    participantId: input.bundle.focalObject.id,
    kind: "EXECUTIVE_OBJECT",
    region: VAI_IMPACT_ROLE_REGIONS.FOCAL,
    role: "FOCAL",
    scaleToken: "size-dominant",
    slot: 0,
    placementReason: "Focal executive Object is the analytical center.",
    meaningAuthority: "MO:1",
  });
  const counts: Partial<Record<string, number>> = {};
  const symbolPlacements = visible.map((symbol) => {
    const regionKey = regionKeyOf(symbol);
    const slot = counts[regionKey] ?? 0;
    counts[regionKey] = slot + 1;
    const region = VAI_IMPACT_ROLE_REGIONS[regionKey];
    return placement({
      participantId: symbol.symbolId,
      kind: "VARIABLE_SYMBOL",
      region,
      role: symbol.roleAmbiguous ? "AMBIGUOUS" : symbol.analyticalRole ?? "AMBIGUOUS",
      scaleToken: "size-subordinate",
      slot,
      placementReason: `Region ${region.regionId} follows the supplied VAI role, not Director analysis.`,
      meaningAuthority: "VAI:2",
    });
  });
  const placements = Object.freeze([focal, ...symbolPlacements]);
  assertSafe(placements);
  const connectors = Object.freeze(
    visible.map((symbol) =>
      Object.freeze({
        fromId: symbol.symbolId,
        toId: input.bundle!.focalObject.id,
        connectorType: symbol.connectorType,
        waypoints: Object.freeze([
          pointOf(symbolPlacements.find((item) => item.participantId === symbol.symbolId)!),
          pointOf(focal),
        ]),
        meaningUnchanged: true as const,
        geometryUpgradedSemantics: false as const,
      }),
    ),
  );
  const narrative = narrativeOf(input.bundle.focalObject.label, visible, input.bundle.relationship?.causalStatus ?? "unconfirmed");
  if (LEAK.test(narrative)) throw new Error("VAI:6 scene narrative leaked architecture terminology");
  const sceneId = [
    "impact",
    input.bundle.analysisContextId,
    input.bundle.focalObject.id,
    complexity,
    `${input.theatreWidth ?? 1440}x${input.theatreHeight ?? 900}`,
    ordered.map((item) => `${item.variableId}:${item.analyticalRole ?? "amb"}:${item.connectorType}`).join("|"),
  ].join(":");
  return Object.freeze({
    identity: vaiImpactSceneIdentity,
    apply: true,
    sceneIntent: VAI_IMPACT_SCENE_INTENT,
    theatreIntentKind: VAI_IMPACT_THEATRE_INTENT_KIND,
    sceneId,
    analysisContextId: input.bundle.analysisContextId,
    complexity,
    focalObjectId: input.bundle.focalObject.id,
    focalObjectLabel: input.bundle.focalObject.label,
    focalDominant: true,
    theatreProjection: theatre,
    placements,
    connectors,
    evidenceRefs: Object.freeze(input.bundle.relationship?.evidenceRefs ?? []),
    narrative,
    hiddenCount: hidden.length,
    confounderVisible: visible.some((item) => item.analyticalRole === "CONFOUNDER") || hidden.some((item) => item.analyticalRole === "CONFOUNDER"),
    interventionPredicted: false,
    outcomeDelta: null,
    scenarioCreated: false,
    causalGraphCreated: false,
    objectsCreated: false,
    stageMutated: false,
    startsVai7: false,
  });
}

export function explainVaiImpactScene(input: {
  readonly scene: VaiImpactScene;
  readonly bundle: VaiAdvisorBundle | null;
  readonly utterance?: string;
}): ReturnType<typeof composeVaiAdvisorAnalysis> {
  const utterance = input.utterance?.trim() || "Explain this impact map.";
  if (isPredictionUtterance(utterance)) {
    return composeVaiAdvisorAnalysis({
      utterance: "What variables matter here?",
      bundle: input.bundle,
    });
  }
  return composeVaiAdvisorAnalysis({
    utterance: /impact map|what is affecting|variables matter/i.test(utterance) ? "What variables matter here?" : utterance,
    bundle: input.bundle,
  });
}

export function isPredictionUtterance(utterance: string): boolean {
  return /what happens if|increases \d+\s*%|if i (increase|decrease)|outcome delta|effect size/i.test(utterance);
}

export function inspectVaiImpactSymbol(input: {
  readonly scene: VaiImpactScene;
  readonly symbolId: string;
  readonly bundle: VaiAdvisorBundle | null;
}): ReturnType<typeof inspectVaiTheatreSymbol> {
  return inspectVaiTheatreSymbol({
    projection: input.scene.theatreProjection ?? projectVaiTheatreSymbols({ bundle: input.bundle }),
    symbolId: input.symbolId,
    bundle: input.bundle,
  });
}

export function verifyVaiImpactScene(): { readonly ok: true } {
  if (VAI_IMPACT_BOUNDARY.secondDirector) throw new Error("VAI:6 must not create a second Director");
  if (VAI_IMPACT_BOUNDARY.causalGraphAuthority) throw new Error("VAI:6 must not create a causal graph authority");
  if (VAI_IMPACT_BOUNDARY.interventionPrediction) throw new Error("VAI:6 must not predict interventions");
  if (VAI_IMPACT_BOUNDARY.startsVai7) throw new Error("VAI:6 must not start VAI:7");
  return Object.freeze({ ok: true as const });
}

function emptyScene(complexity: VaiImpactComplexity): VaiImpactScene {
  return Object.freeze({
    identity: vaiImpactSceneIdentity,
    apply: false,
    sceneIntent: VAI_IMPACT_SCENE_INTENT,
    theatreIntentKind: VAI_IMPACT_THEATRE_INTENT_KIND,
    sceneId: null,
    analysisContextId: null,
    complexity,
    focalObjectId: null,
    focalObjectLabel: null,
    focalDominant: false,
    theatreProjection: null,
    placements: Object.freeze([]),
    connectors: Object.freeze([]),
    evidenceRefs: Object.freeze([]),
    narrative: null,
    hiddenCount: 0,
    confounderVisible: false,
    interventionPredicted: false,
    outcomeDelta: null,
    scenarioCreated: false,
    causalGraphCreated: false,
    objectsCreated: false,
    stageMutated: false,
    startsVai7: false,
  });
}

function prioritize(symbols: readonly VaiVariableSymbol[]): VaiVariableSymbol[] {
  const important = symbols.filter((item) => item.analyticalRole === "CONFOUNDER" || item.roleAmbiguous || item.evidencePresentation === "mixed");
  const rest = symbols.filter((item) => !important.includes(item));
  return [...important, ...rest];
}

function regionKeyOf(symbol: VaiVariableSymbol): keyof typeof VAI_IMPACT_ROLE_REGIONS {
  if (symbol.roleAmbiguous) return "AMBIGUOUS";
  if (symbol.analyticalRole && symbol.analyticalRole in VAI_IMPACT_ROLE_REGIONS) {
    return symbol.analyticalRole;
  }
  return "AMBIGUOUS";
}

function placement(input: {
  readonly participantId: string;
  readonly kind: VaiImpactPlacement["kind"];
  readonly region: { readonly regionId: string; readonly x: number; readonly y: number };
  readonly role: VaiImpactPlacement["role"];
  readonly scaleToken: VaiImpactPlacement["scaleToken"];
  readonly slot: number;
  readonly placementReason: string;
  readonly meaningAuthority: VaiImpactPlacement["meaningAuthority"];
}): VaiImpactPlacement {
  const y = clamp(input.region.y + input.slot * 0.05, VAI_IMPACT_SAFE_ZONES.top.reservedUntil + 0.02, VAI_IMPACT_SAFE_ZONES.bottom.reservedFrom - 0.02);
  const x = clamp(input.region.x, VAI_IMPACT_SAFE_ZONES.left.reservedUntil + 0.02, VAI_IMPACT_SAFE_ZONES.right.reservedFrom - 0.02);
  return Object.freeze({
    participantId: input.participantId,
    kind: input.kind,
    regionId: input.region.regionId,
    x,
    y,
    scaleToken: input.scaleToken,
    role: input.role,
    placementReason: input.placementReason,
    meaningAuthority: input.meaningAuthority,
  });
}

function assertSafe(placements: readonly VaiImpactPlacement[]): void {
  for (const item of placements) {
    if (item.x < VAI_IMPACT_SAFE_ZONES.left.reservedUntil) throw new Error("Impact Scene collided with left HUD zone");
    if (item.x > VAI_IMPACT_SAFE_ZONES.right.reservedFrom) throw new Error("Impact Scene collided with right HUD zone");
    if (item.y < VAI_IMPACT_SAFE_ZONES.top.reservedUntil) throw new Error("Impact Scene collided with top HUD zone");
    if (item.y > VAI_IMPACT_SAFE_ZONES.bottom.reservedFrom) throw new Error("Impact Scene collided with bottom HUD zone");
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function pointOf(item: VaiImpactPlacement): { readonly x: number; readonly y: number } {
  return Object.freeze({ x: item.x, y: item.y });
}

function narrativeOf(
  focal: string,
  symbols: readonly VaiVariableSymbol[],
  causalStatus: string,
): string {
  const named = (role: VaiContextualRole) =>
    symbols.filter((item) => item.analyticalRole === role).map((item) => item.displayLabel);
  const levers = named("LEVER");
  const paths = named("PATH_OF_EFFECT");
  const outcomes = named("OUTCOME");
  const confounders = named("CONFOUNDER");
  const ambiguous = symbols.filter((item) => item.roleAmbiguous).map((item) => item.displayLabel);
  const parts = [`${focal} is the focus.`];
  if (levers.length) parts.push(`${levers.join(" and ")} ${levers.length === 1 ? "is" : "are"} a potential lever.`);
  if (paths.length) parts.push(`${paths.join(" and ")} ${paths.length === 1 ? "is" : "are"} a possible pathway.`);
  if (outcomes.length) parts.push(`${outcomes.join(" and ")} ${outcomes.length === 1 ? "is" : "are"} the observed outcome.`);
  if (confounders.length) parts.push(`${confounders.join(" and ")} ${confounders.length === 1 ? "remains" : "remain"} an alternative explanation.`);
  if (ambiguous.length) parts.push(`${ambiguous.join(" and ")} ${ambiguous.length === 1 ? "has" : "have"} an unresolved analytical role.`);
  parts.push(
    causalStatus === "EVIDENCE_SUPPORTED"
      ? "Current evidence supports a causal reading."
      : "Current evidence does not confirm a cause.",
  );
  parts.push("This scene does not calculate what happens if a lever changes.");
  return parts.join(" ");
}
