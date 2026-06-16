/**
 * SVIE:4:7 — Executive future story layer contract.
 *
 * Visual executive narratives from future simulations.
 * Material-only overlays — no dashboard replacement, topology mutation, or object movement.
 */

export const SVIE_EXECUTIVE_FUTURE_STORY_LAYER_TAG = "[SVIE:4:7_EXECUTIVE_FUTURE_STORY_LAYER]" as const;

export const SVIE_EXECUTIVE_FUTURE_STORY_LAYER_VERSION = "4.7.0" as const;

export const SVIE_EXECUTIVE_FUTURE_STORY_COMPUTED_LOG = "[SVIE][ExecutiveFutureStory]" as const;

export type SvieExecutiveFutureStoryNodeRole =
  | "future_cause"
  | "future_impact"
  | "future_recommendation"
  | "future_outcome";

export type SvieExecutiveFutureStoryNode = Readonly<{
  objectId: string;
  label: string;
  role: SvieExecutiveFutureStoryNodeRole;
  storyIndex: number;
}>;

export type SvieExecutiveFutureStoryConnection = Readonly<{
  fromObjectId: string;
  toObjectId: string;
  storyIndex: number;
}>;

export type SvieExecutiveFutureStory = Readonly<{
  scenarioId: string;
  nodes: readonly SvieExecutiveFutureStoryNode[];
  connections: readonly SvieExecutiveFutureStoryConnection[];
  confidence: number;
}>;

export type SvieExecutiveFutureStoryNodeVisualStyle = Readonly<{
  objectId: string;
  scenarioId: string;
  role: SvieExecutiveFutureStoryNodeRole;
  storyIndex: number;
  glowColor: string;
  glowOpacity: number;
  glowIntensity: number;
  ringScale: number;
  pulseSpeed: number;
}>;

export type SvieExecutiveFutureStoryConnectionVisualStyle = Readonly<{
  id: string;
  fromObjectId: string;
  toObjectId: string;
  highlightColor: string;
  highlightOpacity: number;
  lineWidth: number;
}>;

export type SvieExecutiveFutureStoryScene = Readonly<{
  scenarioId: string;
  nodeVisualByObjectId: Readonly<Record<string, SvieExecutiveFutureStoryNodeVisualStyle>>;
  connectionVisuals: readonly SvieExecutiveFutureStoryConnectionVisualStyle[];
}>;

export type SvieExecutiveFutureStoryLayerSnapshot = Readonly<{
  stories: readonly SvieExecutiveFutureStory[];
  storyScenes: readonly SvieExecutiveFutureStoryScene[];
  nodeVisualByObjectId: Readonly<Record<string, SvieExecutiveFutureStoryNodeVisualStyle>>;
  connectionVisuals: readonly SvieExecutiveFutureStoryConnectionVisualStyle[];
  generatedAt: number;
  signature: string;
}>;

export type SvieExecutiveFutureStoryLayerBuildInput = Readonly<{
  scenarios?: readonly import("./svieScenarioLinkFoundationContract.ts").SvieScenarioInput[];
  sceneJson?: unknown;
}>;

export const SVIE_EXECUTIVE_FUTURE_STORY_PALETTE = Object.freeze({
  future_cause: "#38bdf8",
  future_impact: "#fb7185",
  future_recommendation: "#f59e0b",
  future_outcome: "#a78bfa",
  connection: "#7c3aed",
});

export const SVIE_EXECUTIVE_FUTURE_STORY_ROLE_VISUAL = Object.freeze({
  future_cause: Object.freeze({ glowOpacity: 0.14, glowIntensity: 0.2, ringScale: 1.42, pulseSpeed: 1.1 }),
  future_impact: Object.freeze({ glowOpacity: 0.18, glowIntensity: 0.26, ringScale: 1.5, pulseSpeed: 1.3 }),
  future_recommendation: Object.freeze({ glowOpacity: 0.22, glowIntensity: 0.32, ringScale: 1.56, pulseSpeed: 1.5 }),
  future_outcome: Object.freeze({ glowOpacity: 0.26, glowIntensity: 0.38, ringScale: 1.64, pulseSpeed: 1.7 }),
});

export const SVIE_EXECUTIVE_FUTURE_STORY_ROLE_RANK = Object.freeze({
  future_outcome: 4,
  future_recommendation: 3,
  future_impact: 2,
  future_cause: 1,
});

export const DEFAULT_SVIE_EXECUTIVE_FUTURE_STORY_LAYER_SNAPSHOT: SvieExecutiveFutureStoryLayerSnapshot =
  Object.freeze({
    stories: Object.freeze([]),
    storyScenes: Object.freeze([]),
    nodeVisualByObjectId: Object.freeze({}),
    connectionVisuals: Object.freeze([]),
    generatedAt: 0,
    signature: "svie:executive-future-story:empty",
  });
