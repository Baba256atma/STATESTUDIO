import type { DirectorRegistryEntry } from "./directorRegistryTypes.ts";

const entry = <Id extends string, Category extends string>(
  id: Id,
  name: string,
  description: string,
  category: Category,
  deterministicOrder: number,
): DirectorRegistryEntry<Id, Category> => Object.freeze({
  id,
  name,
  description,
  category,
  version: "1.0.0",
  namespace: `nexora.director.registry.${category.toLowerCase()}`,
  stability: "Stable",
  deterministicOrder,
});

const registry = <const Names extends readonly string[]>(
  category: string,
  names: Names,
) => Object.freeze(names.map((name, index) => entry(
  `DIRECTOR-1:2/${category}/${name}`,
  name,
  `Canonical Director ${category} classification for ${name}.`,
  category,
  index + 1,
)));

export const DirectorSceneTypeRegistry = registry("SceneType", [
  "ExecutiveOverview", "ExecutiveDashboard", "OrganizationScene",
  "ProcessScene", "WorkflowScene", "RiskScene", "StrategyScene",
  "SimulationScene", "TimelineScene", "ComparisonScene", "DecisionScene",
  "CustomScene",
] as const);

export const DirectorSceneObjectTypeRegistry = registry("SceneObjectType", [
  "BusinessObject", "KPI", "Chart", "Timeline", "Risk", "Opportunity",
  "Actor", "Department", "Team", "Facility", "Process", "Annotation",
] as const);

export const DirectorSceneLayerTypeRegistry = registry("SceneLayerType", [
  "Background", "Context", "Data", "BusinessObjects", "Indicators",
  "Relationships", "Timeline", "Overlay", "Focus", "Annotation",
] as const);

export const DirectorSceneMarkerTypeRegistry = registry("SceneMarkerType", [
  "Warning", "Alert", "Recommendation", "Decision", "Opportunity", "Risk",
  "Success", "Failure", "Milestone", "Information",
] as const);

export const DirectorSceneRegistry = Object.freeze({
  sceneTypes: DirectorSceneTypeRegistry,
  sceneObjectTypes: DirectorSceneObjectTypeRegistry,
  sceneLayerTypes: DirectorSceneLayerTypeRegistry,
  sceneMarkerTypes: DirectorSceneMarkerTypeRegistry,
  metadataOnly: true,
  immutable: true,
} as const);

