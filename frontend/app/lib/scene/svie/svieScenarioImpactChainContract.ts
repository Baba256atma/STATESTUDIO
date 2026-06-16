/**
 * SVIE:4:4 — Scenario impact chain contract.
 *
 * Future propagation chain visualization from scenario links.
 * Material-only overlays — no object movement, scene mutation, topology mutation, routing, or lifecycle writes.
 */

export const SVIE_SCENARIO_IMPACT_CHAIN_TAG = "[SVIE:4:4_SCENARIO_IMPACT_CHAIN]" as const;

export const SVIE_SCENARIO_IMPACT_CHAIN_VERSION = "4.4.0" as const;

export const SVIE_SCENARIO_IMPACT_CHAIN_COMPUTED_LOG = "[SVIE][ScenarioImpactChain]" as const;

export type SvieScenarioImpactChainStep = Readonly<{
  stepIndex: number;
  objectId: string;
  label: string;
  changeCount: number;
}>;

export type SvieScenarioImpactChainConnection = Readonly<{
  stepIndex: number;
  fromObjectId: string;
  toObjectId: string;
}>;

export type SvieScenarioImpactChain = Readonly<{
  scenarioId: string;
  steps: readonly SvieScenarioImpactChainStep[];
  connections: readonly SvieScenarioImpactChainConnection[];
  confidence: number;
}>;

export type SvieScenarioImpactChainNodeVisualStyle = Readonly<{
  objectId: string;
  scenarioId: string;
  stepIndex: number;
  stepCount: number;
  glowColor: string;
  glowOpacity: number;
  glowIntensity: number;
  radiusMultiplier: number;
  sequentialGlowPhase: number;
}>;

export type SvieScenarioImpactChainConnectionVisualStyle = Readonly<{
  id: string;
  fromObjectId: string;
  toObjectId: string;
  stepIndex: number;
  highlightColor: string;
  highlightOpacity: number;
  lineWidth: number;
  sequentialGlowPhase: number;
}>;

export type SvieVisualScenarioImpactChain = Readonly<{
  scenarioId: string;
  nodeVisualByObjectId: Readonly<Record<string, SvieScenarioImpactChainNodeVisualStyle>>;
  connectionVisuals: readonly SvieScenarioImpactChainConnectionVisualStyle[];
}>;

export type SvieScenarioImpactVisualizationSnapshot = Readonly<{
  chains: readonly SvieScenarioImpactChain[];
  visualChains: readonly SvieVisualScenarioImpactChain[];
  nodeVisualByObjectId: Readonly<Record<string, SvieScenarioImpactChainNodeVisualStyle>>;
  connectionVisuals: readonly SvieScenarioImpactChainConnectionVisualStyle[];
  generatedAt: number;
  signature: string;
}>;

export type SvieScenarioImpactVisualizationBuildInput = Readonly<{
  scenarios?: readonly import("./svieScenarioLinkFoundationContract.ts").SvieScenarioInput[];
  sceneJson?: unknown;
}>;

export const SVIE_SCENARIO_IMPACT_CHAIN_PALETTE = Object.freeze({
  nodeGlow: "#818cf8",
  connection: "#a78bfa",
});

export const DEFAULT_SVIE_SCENARIO_IMPACT_VISUALIZATION_SNAPSHOT: SvieScenarioImpactVisualizationSnapshot =
  Object.freeze({
    chains: Object.freeze([]),
    visualChains: Object.freeze([]),
    nodeVisualByObjectId: Object.freeze({}),
    connectionVisuals: Object.freeze([]),
    generatedAt: 0,
    signature: "svie:scenario-impact-chain:empty",
  });
