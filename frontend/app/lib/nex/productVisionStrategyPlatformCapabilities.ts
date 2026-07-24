/**
 * NEX-1:6 — Immutable descriptive Platform capabilities.
 *
 * No capability executes or implements product behavior.
 */

export const ProductVisionStrategyPlatformCapabilities = Object.freeze([
  Object.freeze({ id: "NEX-1:6/Capability/VisionPublication", name: "Product Vision Publication", description: "Represents canonical product vision metadata on the Platform surface.", category: "Publication", executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:6/Capability/MissionPublication", name: "Product Mission Publication", description: "Represents canonical product mission metadata on the Platform surface.", category: "Publication", executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:6/Capability/GoalPublication", name: "Product Goal Publication", description: "Represents canonical product goal metadata on the Platform surface.", category: "Publication", executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:6/Capability/ObjectivePublication", name: "Strategic Objective Publication", description: "Represents strategic objective metadata on the Platform surface.", category: "Publication", executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:6/Capability/ScopePublication", name: "Product Scope Publication", description: "Represents product scope metadata on the Platform surface.", category: "Publication", executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:6/Capability/BoundaryPublication", name: "Product Boundary Publication", description: "Represents product boundary metadata on the Platform surface.", category: "Publication", executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:6/Capability/LifecyclePublication", name: "Product Lifecycle Publication", description: "Represents product lifecycle metadata on the Platform surface.", category: "Publication", executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:6/Capability/StrategyPublication", name: "Product Strategy Publication", description: "Represents the composed product strategy metadata package.", category: "Publication", executable: false, metadataOnly: true, immutable: true }),
] as const);
