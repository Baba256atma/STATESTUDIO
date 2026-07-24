/**
 * WS-1:1 — Explicit prohibited implementation boundaries.
 */

import type { WorkspaceBoundaryDefinition } from "./workspaceFoundationTypes.ts";

export const WorkspaceFoundationBoundaries = Object.freeze([
  Object.freeze({ id: "WS-1:1/Boundary/01", prohibitedConcern: "UI", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/02", prohibitedConcern: "React", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/03", prohibitedConcern: "Rendering", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/04", prohibitedConcern: "Animation", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/05", prohibitedConcern: "Graphics", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/06", prohibitedConcern: "Business Logic", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/07", prohibitedConcern: "Decision Logic", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/08", prohibitedConcern: "Reasoning", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/09", prohibitedConcern: "Planning", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/10", prohibitedConcern: "Simulation", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/11", prohibitedConcern: "Persistence", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/12", prohibitedConcern: "Networking", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/13", prohibitedConcern: "Authentication", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/14", prohibitedConcern: "Authorization", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/15", prohibitedConcern: "Scheduling", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/16", prohibitedConcern: "Execution", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/17", prohibitedConcern: "Runtime", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/18", prohibitedConcern: "State Engine", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/19", prohibitedConcern: "AI Inference", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/20", prohibitedConcern: "Scenario Engine", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/21", prohibitedConcern: "Workflow Execution", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/22", prohibitedConcern: "Orchestration", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/23", prohibitedConcern: "Director Behavior", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/24", prohibitedConcern: "Engine Behavior", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/25", prohibitedConcern: "EVE Behavior", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/26", prohibitedConcern: "Assistant Behavior", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/27", prohibitedConcern: "DKL Behavior", implemented: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "WS-1:1/Boundary/28", prohibitedConcern: "Integration Runtime Behavior", implemented: false, metadataOnly: true, immutable: true }),
] as const satisfies readonly WorkspaceBoundaryDefinition[]);
