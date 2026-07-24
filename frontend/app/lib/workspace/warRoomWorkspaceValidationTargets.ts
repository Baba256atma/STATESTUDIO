/** WS-8:4 — Source-linked architectural Validation targets. */
import { WarRoomWorkspaceFoundation } from "./warRoomWorkspaceFoundation.ts";
import { WarRoomWorkspaceModel } from "./warRoomWorkspaceModel.ts";
import { WarRoomWorkspaceRegistry } from "./warRoomWorkspaceRegistry.ts";

const definitions = Object.freeze([
  ["War Room Foundation", WarRoomWorkspaceFoundation],
  ["War Room Registry", WarRoomWorkspaceRegistry],
  ["War Room Model", WarRoomWorkspaceModel],
  ["Foundation Contracts", WarRoomWorkspaceFoundation.contracts],
  ["Foundation Capabilities", WarRoomWorkspaceFoundation.capabilities],
  ["Foundation Responsibilities", WarRoomWorkspaceFoundation.responsibilities],
  ["Registry Taxonomy", WarRoomWorkspaceRegistry.taxonomy],
  ["Registry Events", WarRoomWorkspaceRegistry.events],
  ["Registry Incidents", WarRoomWorkspaceRegistry.incidents],
  ["Registry Lifecycle", WarRoomWorkspaceRegistry.lifecycle],
  ["Domain Models", WarRoomWorkspaceModel.domainModels],
  ["Relationship Models", WarRoomWorkspaceModel.relationships],
  ["Composition Models", WarRoomWorkspaceModel.compositions],
  ["Executive Representation", WarRoomWorkspaceModel.representation],
  ["Dependency Declarations", WarRoomWorkspaceModel.upstreamDependencies],
  ["Workspace Boundaries", WarRoomWorkspaceRegistry.boundaries],
] as const);

export const WarRoomWorkspaceValidationTargets = Object.freeze(
  definitions.map(([name, source], index) => Object.freeze({
    id: `WS-8:4/Target/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `References ${name} as an architectural target.`,
    source,
    order: index + 1,
    operationalValidation: false,
    metadataOnly: true,
    immutable: true,
  })),
);
