/**
 * NEX-1:3 — Value, Goal, Strategic Objective, and Success Metric Models.
 */

import { ProductVisionStrategyRegistry } from "./productVisionStrategyRegistry.ts";
import type { ProductStrategyDomainModel } from "./productVisionStrategyIdentityModels.ts";

const Registry = ProductVisionStrategyRegistry;

export const ProductValueModel: ProductStrategyDomainModel = Object.freeze({
  identifier: "NEX-1:3/Model/ProductValue", canonicalName: "Product Value Model",
  description: "Structural representation of enduring Nexora product values.", category: "Value",
  version: "1.0.0", status: "Modeled", owner: "Nexora Product",
  tags: Object.freeze(["model", "values"]), relationships: Object.freeze(["NEX-1:3/Relationship/ValuesGuideStrategy"]),
  registryEntries: Registry.registries.values, metadataOnly: true, immutable: true,
});

export const ProductGoalModel: ProductStrategyDomainModel = Object.freeze({
  identifier: "NEX-1:3/Model/ProductGoal", canonicalName: "Product Goal Model",
  description: "Structural representation of product outcomes supporting the vision.", category: "Goal",
  version: "1.0.0", status: "Modeled", owner: "Nexora Product",
  tags: Object.freeze(["model", "goals"]), relationships: Object.freeze(["NEX-1:3/Relationship/GoalsSupportObjectives"]),
  registryEntries: Registry.registries.goals, metadataOnly: true, immutable: true,
});

export const StrategicObjectiveModel: ProductStrategyDomainModel = Object.freeze({
  identifier: "NEX-1:3/Model/StrategicObjective", canonicalName: "Strategic Objective Model",
  description: "Structural representation of long-term strategic product objectives.", category: "StrategicObjective",
  version: "1.0.0", status: "Modeled", owner: "Nexora Product",
  tags: Object.freeze(["model", "objectives"]), relationships: Object.freeze(["NEX-1:3/Relationship/ObjectivesMeasuredByMetrics"]),
  registryEntries: Registry.registries.strategicObjectives, metadataOnly: true, immutable: true,
});

export const SuccessMetricModel: ProductStrategyDomainModel = Object.freeze({
  identifier: "NEX-1:3/Model/SuccessMetric", canonicalName: "Success Metric Model",
  description: "Structural representation of declared product success measures.", category: "SuccessMetric",
  version: "1.0.0", status: "Modeled", owner: "Nexora Product",
  tags: Object.freeze(["model", "metrics"]), relationships: Object.freeze(["NEX-1:3/Relationship/ObjectivesMeasuredByMetrics"]),
  registryEntries: Registry.registries.successMetrics, metadataOnly: true, immutable: true,
});

export const ProductVisionStrategyOutcomeModels = Object.freeze([
  ProductValueModel,
  ProductGoalModel,
  StrategicObjectiveModel,
  SuccessMetricModel,
] as const);
