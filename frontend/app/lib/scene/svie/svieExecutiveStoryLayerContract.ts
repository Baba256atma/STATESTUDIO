/**
 * SVIE:3:5 — Executive story layer contract.
 *
 * Visual executive narratives from advisory cause chains and recommendations.
 * Material-only overlays — no text labels, animation overload, or topology changes.
 */

export const SVIE_EXECUTIVE_STORY_LAYER_TAG = "[SVIE:3:5_EXECUTIVE_STORY_LAYER]" as const;

export const SVIE_EXECUTIVE_STORY_LAYER_VERSION = "3.5.0" as const;

export const SVIE_EXECUTIVE_STORY_COMPUTED_LOG = "[SVIE][ExecutiveStory]" as const;

export type SvieExecutiveStoryNodeRole = "start" | "cause" | "impact" | "recommendation";

export type SvieExecutiveStoryNode = Readonly<{
  objectId: string;
  label: string;
  role: SvieExecutiveStoryNodeRole;
  storyIndex: number;
}>;

export type SvieExecutiveStoryConnection = Readonly<{
  fromObjectId: string;
  toObjectId: string;
  storyIndex: number;
}>;

export type SvieExecutiveStory = Readonly<{
  recommendationId: string;
  title?: string;
  nodes: readonly SvieExecutiveStoryNode[];
  connections: readonly SvieExecutiveStoryConnection[];
}>;

export type SvieExecutiveStoryNodeVisualStyle = Readonly<{
  objectId: string;
  recommendationId: string;
  role: SvieExecutiveStoryNodeRole;
  storyIndex: number;
  glowColor: string;
  glowOpacity: number;
  glowIntensity: number;
  ringScale: number;
  pulseSpeed: number;
}>;

export type SvieExecutiveStoryConnectionVisualStyle = Readonly<{
  id: string;
  fromObjectId: string;
  toObjectId: string;
  highlightColor: string;
  highlightOpacity: number;
  lineWidth: number;
}>;

export type SvieExecutiveStoryScene = Readonly<{
  recommendationId: string;
  nodeVisualByObjectId: Readonly<Record<string, SvieExecutiveStoryNodeVisualStyle>>;
  connectionVisuals: readonly SvieExecutiveStoryConnectionVisualStyle[];
}>;

export type SvieExecutiveStoryLayerSnapshot = Readonly<{
  stories: readonly SvieExecutiveStory[];
  storyScenes: readonly SvieExecutiveStoryScene[];
  nodeVisualByObjectId: Readonly<Record<string, SvieExecutiveStoryNodeVisualStyle>>;
  connectionVisuals: readonly SvieExecutiveStoryConnectionVisualStyle[];
  generatedAt: number;
  signature: string;
}>;

export type SvieExecutiveStoryLayerBuildInput = Readonly<{
  findings?: readonly import("./svieAdvisoryLinkFoundationContract.ts").SvieAdvisoryFindingInput[];
  sceneJson?: unknown;
}>;

export const SVIE_EXECUTIVE_STORY_PALETTE = Object.freeze({
  start: "#94a3b8",
  cause: "#38bdf8",
  impact: "#fb7185",
  recommendation: "#f59e0b",
  connection: "#64748b",
});

export const SVIE_EXECUTIVE_STORY_ROLE_VISUAL = Object.freeze({
  start: Object.freeze({ glowOpacity: 0.1, glowIntensity: 0.14, ringScale: 1.34, pulseSpeed: 0.8 }),
  cause: Object.freeze({ glowOpacity: 0.14, glowIntensity: 0.2, ringScale: 1.42, pulseSpeed: 1.2 }),
  impact: Object.freeze({ glowOpacity: 0.18, glowIntensity: 0.26, ringScale: 1.5, pulseSpeed: 1.4 }),
  recommendation: Object.freeze({ glowOpacity: 0.24, glowIntensity: 0.34, ringScale: 1.56, pulseSpeed: 1.6 }),
});

export const SVIE_EXECUTIVE_STORY_ROLE_RANK = Object.freeze({
  recommendation: 4,
  impact: 3,
  cause: 2,
  start: 1,
});

export const DEFAULT_SVIE_EXECUTIVE_STORY_LAYER_SNAPSHOT: SvieExecutiveStoryLayerSnapshot = Object.freeze({
  stories: Object.freeze([]),
  storyScenes: Object.freeze([]),
  nodeVisualByObjectId: Object.freeze({}),
  connectionVisuals: Object.freeze([]),
  generatedAt: 0,
  signature: "svie:executive-story:empty",
});
