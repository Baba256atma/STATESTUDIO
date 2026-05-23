import type { CatalogObjectDefinition } from "../objectCatalog/objectCatalogTypes";
import type { SceneJson, Vector3Tuple } from "../sceneTypes";

export type ScenePlacementRequest = {
  currentScene: unknown;
  definition: CatalogObjectDefinition;
  label?: string;
};

export type ScenePlacementResult = {
  success: boolean;
  nextScene?: SceneJson;
  createdObjectId?: string;
  position?: Vector3Tuple;
  warnings?: string[];
};

export type CreatedCatalogObjectMetadata = {
  id: string;
  label: string;
  category: string;
  createdAt: string;
  source: "catalog";
};

export type PlacementValidationResult = {
  valid: boolean;
  reason?: string;
  position: Vector3Tuple;
};
