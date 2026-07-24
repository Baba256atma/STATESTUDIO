/**
 * WS-1:1 — Declarative Workspace capabilities. No capability executes.
 */

import type { WorkspaceCapabilityDefinition } from "./workspaceFoundationTypes.ts";

export const WorkspaceFoundationCapabilities = Object.freeze([
  Object.freeze({ id: "WS-1:1/Capability/Initialization", name: "Workspace Initialization", description: "Declares readiness for Workspace initialization.", executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Capability/Activation", name: "Workspace Activation", description: "Declares readiness for Workspace activation.", executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Capability/Suspension", name: "Workspace Suspension", description: "Declares readiness for Workspace suspension.", executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Capability/Restoration", name: "Workspace Restoration", description: "Declares readiness for Workspace restoration.", executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Capability/Switching", name: "Workspace Switching", description: "Declares support for Workspace switching metadata.", executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Capability/Composition", name: "Workspace Composition", description: "Declares Workspace composition metadata.", executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Capability/ObjectHosting", name: "Workspace Object Hosting", description: "Declares executive object-hosting responsibility.", executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Capability/TimelineHosting", name: "Workspace Timeline Hosting", description: "Declares timeline-hosting responsibility.", executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Capability/VisualizationHosting", name: "Workspace Visualization Hosting", description: "Declares visual-context hosting without rendering.", executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Capability/InteractionHosting", name: "Workspace Interaction Hosting", description: "Declares executive interaction-surface metadata.", executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Capability/AdvisorIntegration", name: "Workspace Advisor Integration", description: "Declares an advisor reference boundary without AI execution.", executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Capability/PersistenceReference", name: "Workspace Persistence Reference", description: "Declares persistence references without persistence behavior.", executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Capability/PermissionAwareness", name: "Workspace Permission Awareness", description: "Declares permission-awareness metadata.", executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Capability/ContextAwareness", name: "Workspace Context Awareness", description: "Declares context-awareness metadata.", executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Capability/CollaborationReadiness", name: "Workspace Collaboration Readiness", description: "Declares readiness for future collaboration metadata.", executable: false, metadataOnly: true, immutable: true }),
] as const satisfies readonly WorkspaceCapabilityDefinition[]);
