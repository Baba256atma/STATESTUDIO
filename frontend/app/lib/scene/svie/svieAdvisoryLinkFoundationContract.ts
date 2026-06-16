/**
 * SVIE:3:1 — Advisory visual link foundation contract.
 *
 * Read-only bridge between Advisory findings and SVIE scene object references.
 * No visualization, pulse, topology, routing, or lifecycle writes.
 */

export const SVIE_ADVISORY_LINK_FOUNDATION_TAG = "[SVIE:3:1_ADVISORY_LINK_FOUNDATION]" as const;

export const SVIE_ADVISORY_LINK_FOUNDATION_VERSION = "3.1.0" as const;

export const SVIE_ADVISORY_LINK_RUNTIME_LOG = "[SVIE][AdvisoryLink]" as const;

/** Spec alias: AdvisoryVisualLink */
export type SvieAdvisoryVisualLink = Readonly<{
  recommendationId: string;
  objectIds: readonly string[];
  confidence: number;
  impact: number;
}>;

export type SvieAdvisoryFindingInput = Readonly<{
  recommendationId: string;
  title?: string | null;
  objectIds?: readonly string[] | null;
  relatedObjectIds?: readonly string[] | null;
  targetObjectIds?: readonly string[] | null;
  linkedObjectIds?: readonly string[] | null;
  linkedLabels?: readonly string[] | null;
  confidence?: number | string | null;
  impact?: number | string | null;
}>;

export type SvieAdvisoryLinkSnapshot = Readonly<{
  links: readonly SvieAdvisoryVisualLink[];
  linkByRecommendationId: Readonly<Record<string, SvieAdvisoryVisualLink>>;
  generatedAt: number;
  signature: string;
}>;

export type SvieAdvisoryLinkBuildInput = Readonly<{
  findings?: readonly SvieAdvisoryFindingInput[];
  sceneJson?: unknown;
}>;

export const DEFAULT_SVIE_ADVISORY_LINK_SNAPSHOT: SvieAdvisoryLinkSnapshot = Object.freeze({
  links: Object.freeze([]),
  linkByRecommendationId: Object.freeze({}),
  generatedAt: 0,
  signature: "svie:advisory-link:empty",
});
