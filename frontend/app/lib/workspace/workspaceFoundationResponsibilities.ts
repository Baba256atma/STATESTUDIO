/**
 * WS-1:1 — Immutable Workspace architectural responsibilities.
 */

import type { WorkspaceResponsibilityDefinition } from "./workspaceFoundationTypes.ts";

export const WorkspaceFoundationResponsibilities = Object.freeze([
  Object.freeze({ id: "WS-1:1/Responsibility/Organization", name: "Workspace Organization", description: "Organize executive work around a bounded management objective.", runtimeBehavior: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Responsibility/ExecutiveInteraction", name: "Executive Interaction", description: "Own the conceptual executive interaction surface.", runtimeBehavior: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Responsibility/ObjectHosting", name: "Object Hosting", description: "Own executive object collection references.", runtimeBehavior: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Responsibility/ContextOwnership", name: "Context Ownership", description: "Own bounded Workspace context metadata.", runtimeBehavior: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Responsibility/VisualComposition", name: "Visual Composition Ownership", description: "Own visual composition references without rendering.", runtimeBehavior: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Responsibility/TimelineOwnership", name: "Timeline Ownership", description: "Own Workspace timeline references.", runtimeBehavior: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Responsibility/AdvisorCoordination", name: "Advisor Coordination", description: "Coordinate advisor references without AI behavior.", runtimeBehavior: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Responsibility/SceneCoordination", name: "Scene Coordination", description: "Coordinate scene references without visualization behavior.", runtimeBehavior: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Responsibility/NavigationCoordination", name: "Navigation Coordination", description: "Coordinate navigation references without navigation logic.", runtimeBehavior: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Responsibility/LifecycleCoordination", name: "Lifecycle Coordination", description: "Own declarative Workspace lifecycle metadata.", runtimeBehavior: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Responsibility/ConfigurationOwnership", name: "Configuration Ownership", description: "Own immutable Workspace configuration metadata.", runtimeBehavior: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Responsibility/BoundaryEnforcement", name: "Boundary Enforcement", description: "Declare and preserve Workspace architectural boundaries.", runtimeBehavior: false, metadataOnly: true, immutable: true }),
] as const satisfies readonly WorkspaceResponsibilityDefinition[]);
