/**
 * NEX-2:4 — Sixteen immutable validation groups.
 */

import { ProductRoadmapModel } from "./productRoadmapModel.ts";

export const ProductRoadmapValidationGroups = Object.freeze([
  Object.freeze({ id: "NEX-2:4/Group/Identity", name: "Identity", domainCoverage: Object.freeze(["RoadmapVision", "RoadmapMission"]), modelReference: ProductRoadmapModel.identity.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Group/Structure", name: "Structure", domainCoverage: Object.freeze(["RoadmapPrinciple", "ProductEvolution"]), modelReference: ProductRoadmapModel.inventory.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Group/Relationships", name: "Relationships", domainCoverage: Object.freeze(["StrategicInitiative", "ProductMilestone"]), modelReference: ProductRoadmapModel.identity.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Group/Dependencies", name: "Dependencies", domainCoverage: Object.freeze(["ProductEvolution"]), modelReference: ProductRoadmapModel.dependency.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Group/Metadata", name: "Metadata", domainCoverage: Object.freeze(["RoadmapHorizon"]), modelReference: ProductRoadmapModel.identity.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Group/Compatibility", name: "Compatibility", domainCoverage: Object.freeze(["ProductEvolution"]), modelReference: ProductRoadmapModel.identity.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Group/Readiness", name: "Readiness", domainCoverage: Object.freeze(["RoadmapGovernance"]), modelReference: ProductRoadmapModel.identity.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Group/Inventory", name: "Inventory", domainCoverage: Object.freeze(["ProductTheme", "ProductPriority"]), modelReference: ProductRoadmapModel.inventory.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Group/Publication", name: "Publication", domainCoverage: Object.freeze(["ProductOutcome"]), modelReference: ProductRoadmapModel.identity.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Group/Governance", name: "Governance", domainCoverage: Object.freeze(["RoadmapGovernance"]), modelReference: ProductRoadmapModel.models[15].identifier, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Group/Lifecycle", name: "Lifecycle", domainCoverage: Object.freeze(["RoadmapLifecycle"]), modelReference: ProductRoadmapModel.models[14].identifier, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Group/Roadmap", name: "Roadmap", domainCoverage: Object.freeze(["RoadmapVision", "RoadmapMission", "RoadmapPrinciple"]), modelReference: ProductRoadmapModel.models[0].identifier, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Group/Release", name: "Release", domainCoverage: Object.freeze(["ReleaseStrategy", "ProductMilestone"]), modelReference: ProductRoadmapModel.models[5].identifier, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Group/Planning", name: "Planning", domainCoverage: Object.freeze(["RoadmapHorizon", "PlanningAssumption", "PlanningConstraint"]), modelReference: ProductRoadmapModel.models[4].identifier, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Group/Strategy", name: "Strategy", domainCoverage: Object.freeze(["StrategicInitiative", "ProductTheme", "ProductPriority", "ProductOutcome", "SuccessCriteria"]), modelReference: ProductRoadmapModel.models[7].identifier, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Group/ApiRegistry", name: "API Registry", domainCoverage: Object.freeze(["PublicApiRegistry"]), modelReference: ProductRoadmapModel.identity.id, metadataOnly: true, immutable: true }),
] as const);
