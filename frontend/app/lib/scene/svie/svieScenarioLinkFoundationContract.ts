/**
 * SVIE:4:1 — Scenario visual link foundation contract.
 *
 * Read-only bridge between Scenario Engine, Simulation Engine, and SVIE runtime.
 * No visualization, topology, routing, or lifecycle writes in this phase.
 */

export const SVIE_SCENARIO_LINK_FOUNDATION_TAG = "[SVIE:4:1_SCENARIO_LINK_FOUNDATION]" as const;

export const SVIE_SCENARIO_LINK_FOUNDATION_VERSION = "4.1.0" as const;

export const SVIE_SCENARIO_LINK_RUNTIME_LOG = "[SVIE][ScenarioLink]" as const;

export type SvieScenarioPredictedChangeMetric = "risk" | "activity" | "stability";

/** Spec alias: ScenarioVisualLink predicted change entry */
export type SvieScenarioPredictedChange = Readonly<{
  objectId: string;
  metric: SvieScenarioPredictedChangeMetric;
  before?: number;
  after?: number;
  delta?: number;
}>;

/** Spec alias: ScenarioVisualLink */
export type SvieScenarioVisualLink = Readonly<{
  scenarioId: string;
  objectIds: readonly string[];
  predictedChanges: readonly SvieScenarioPredictedChange[];
  confidence: number;
}>;

export type SvieScenarioVisualContext = Readonly<{
  scenarioId: string;
  label?: string;
  link: SvieScenarioVisualLink;
  simulationSource?: string;
}>;

export type SvieScenarioObjectImpactInput = Readonly<{
  objectId: string;
  beforeRisk?: number | null;
  afterRisk?: number | null;
  beforeActivity?: number | null;
  afterActivity?: number | null;
  beforeStability?: number | null;
  afterStability?: number | null;
}>;

export type SvieScenarioInput = Readonly<{
  scenarioId: string;
  label?: string | null;
  objectIds?: readonly string[] | null;
  affectedObjectIds?: readonly string[] | null;
  relatedObjectIds?: readonly string[] | null;
  linkedObjectIds?: readonly string[] | null;
  linkedLabels?: readonly string[] | null;
  predictedChanges?: readonly SvieScenarioPredictedChange[] | null;
  objectImpacts?: readonly SvieScenarioObjectImpactInput[] | null;
  confidence?: number | string | null;
  simulationSource?: string | null;
}>;

export type SvieScenarioLinkSnapshot = Readonly<{
  links: readonly SvieScenarioVisualLink[];
  linkByScenarioId: Readonly<Record<string, SvieScenarioVisualLink>>;
  contexts: readonly SvieScenarioVisualContext[];
  contextByScenarioId: Readonly<Record<string, SvieScenarioVisualContext>>;
  generatedAt: number;
  signature: string;
}>;

export type SvieScenarioLinkBuildInput = Readonly<{
  scenarios?: readonly SvieScenarioInput[];
  sceneJson?: unknown;
}>;

export const DEFAULT_SVIE_SCENARIO_LINK_SNAPSHOT: SvieScenarioLinkSnapshot = Object.freeze({
  links: Object.freeze([]),
  linkByScenarioId: Object.freeze({}),
  contexts: Object.freeze([]),
  contextByScenarioId: Object.freeze({}),
  generatedAt: 0,
  signature: "svie:scenario-link:empty",
});
