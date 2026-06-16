/**
 * SVIE:3:2 — Cause chain visualization contract.
 *
 * Visual causal chains from advisory links. Material highlights only —
 * no object movement, camera movement, or topology changes.
 */

export const SVIE_CAUSE_CHAIN_VISUALIZATION_TAG = "[SVIE:3:2_CAUSE_CHAIN_VISUALIZATION]" as const;

export const SVIE_CAUSE_CHAIN_VISUALIZATION_VERSION = "3.2.0" as const;

export const SVIE_CAUSE_CHAIN_COMPUTED_LOG = "[SVIE][CauseChain]" as const;

export type SvieCauseChainStep = Readonly<{
  stepIndex: number;
  objectId: string;
  label: string;
}>;

export type SvieCauseChainConnection = Readonly<{
  stepIndex: number;
  fromObjectId: string;
  toObjectId: string;
}>;

export type SvieCauseChain = Readonly<{
  recommendationId: string;
  steps: readonly SvieCauseChainStep[];
  connections: readonly SvieCauseChainConnection[];
}>;

export type SvieCauseChainNodeVisualStyle = Readonly<{
  objectId: string;
  stepIndex: number;
  stepCount: number;
  label: string;
  showNodeHighlight: boolean;
  glowColor: string;
  glowOpacity: number;
  glowIntensity: number;
  sequentialGlowPhase: number;
}>;

export type SvieCauseChainConnectionVisualStyle = Readonly<{
  id: string;
  fromObjectId: string;
  toObjectId: string;
  stepIndex: number;
  highlightColor: string;
  highlightOpacity: number;
  lineWidth: number;
  sequentialGlowPhase: number;
}>;

export type SvieVisualCauseChain = Readonly<{
  recommendationId: string;
  nodeVisualByObjectId: Readonly<Record<string, SvieCauseChainNodeVisualStyle>>;
  connectionVisuals: readonly SvieCauseChainConnectionVisualStyle[];
}>;

export type SvieCauseChainVisualizationSnapshot = Readonly<{
  chains: readonly SvieCauseChain[];
  visualChains: readonly SvieVisualCauseChain[];
  nodeVisualByObjectId: Readonly<Record<string, SvieCauseChainNodeVisualStyle>>;
  connectionVisuals: readonly SvieCauseChainConnectionVisualStyle[];
  generatedAt: number;
  signature: string;
}>;

export type SvieCauseChainVisualizationBuildInput = Readonly<{
  findings?: readonly import("./svieAdvisoryLinkFoundationContract.ts").SvieAdvisoryFindingInput[];
  sceneJson?: unknown;
}>;

export const SVIE_CAUSE_CHAIN_PALETTE = Object.freeze({
  nodeGlow: "#60a5fa",
  nodeEmissive: "#93c5fd",
  connection: "#38bdf8",
  connectionEmissive: "#7dd3fc",
});

export const DEFAULT_SVIE_CAUSE_CHAIN_VISUALIZATION_SNAPSHOT: SvieCauseChainVisualizationSnapshot =
  Object.freeze({
    chains: Object.freeze([]),
    visualChains: Object.freeze([]),
    nodeVisualByObjectId: Object.freeze({}),
    connectionVisuals: Object.freeze([]),
    generatedAt: 0,
    signature: "svie:cause-chain:empty",
  });
