/**
 * NEX-1:1 — Nexora Product Vision & Strategy Foundation.
 *
 * Product-reference metadata only. No technical or executable behavior.
 */

import { ProductVisionStrategyFoundationContracts } from "./productVisionStrategyFoundationContracts.ts";
import {
  ProductVisionStrategyFoundationIdentity,
  ProductVisionStrategyFoundationReadiness,
} from "./productVisionStrategyFoundationIdentity.ts";
import { ProductVisionStrategyFoundationLifecycle } from "./productVisionStrategyFoundationLifecycle.ts";
import {
  ProductBoundaries,
  ProductFoundationValidationMetadata,
  ProductGoals,
  ProductMission,
  ProductPrinciples,
  ProductScope,
  ProductValues,
  ProductVision,
  StrategicObjectives,
  StrategicThemes,
  SuccessMetrics,
  TargetUsers,
} from "./productVisionStrategyFoundationMetadata.ts";

export const ProductVisionStrategyFoundation = Object.freeze({
  identity: ProductVisionStrategyFoundationIdentity,
  vision: ProductVision,
  mission: ProductMission,
  principles: ProductPrinciples,
  targetUsers: TargetUsers,
  goals: ProductGoals,
  strategicObjectives: StrategicObjectives,
  scope: ProductScope,
  boundaries: ProductBoundaries,
  values: ProductValues,
  lifecycle: ProductVisionStrategyFoundationLifecycle,
  successMetrics: SuccessMetrics,
  strategicThemes: StrategicThemes,
  contracts: ProductVisionStrategyFoundationContracts,
  validationMetadata: ProductFoundationValidationMetadata,
  status: "Foundation",
  readiness: ProductVisionStrategyFoundationReadiness,
  nextPhase: "NEX-1:2 — Vision & Product Strategy Registry",
  metadataOnly: true,
  immutable: true,
  runtimeBehavior: false,
  executableLogic: false,
  ui: false,
  rendering: false,
  networking: false,
  database: false,
  persistence: false,
  api: false,
  artificialIntelligenceImplementation: false,
  orchestration: false,
  integrations: false,
  sdk: false,
} as const);
