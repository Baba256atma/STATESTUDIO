/** WS-6:4 — Source-linked architectural validation targets. */
import { ProblemWorkspaceFoundation } from "./problemWorkspaceFoundation.ts";
import { ProblemWorkspaceModel } from "./problemWorkspaceModel.ts";
import { ProblemWorkspaceRegistry } from "./problemWorkspaceRegistry.ts";

const definitions = Object.freeze([
  ["Problem Workspace Foundation", ProblemWorkspaceFoundation],
  ["Problem Workspace Registry", ProblemWorkspaceRegistry],
  ["Problem Workspace Model", ProblemWorkspaceModel],
  ["Foundation Contracts", ProblemWorkspaceFoundation.contracts],
  ["Foundation Capabilities", ProblemWorkspaceFoundation.capabilities],
  ["Foundation Responsibilities", ProblemWorkspaceFoundation.responsibilities],
  ["Registry Taxonomy", ProblemWorkspaceRegistry.taxonomy],
  ["Registry Evidence Vocabulary", ProblemWorkspaceRegistry.evidence],
  ["Registry Analysis Domains", ProblemWorkspaceRegistry.analysisDomains],
  ["Registry Lifecycle", ProblemWorkspaceRegistry.lifecycle],
  ["Domain Models", ProblemWorkspaceModel.domainModels],
  ["Relationship Models", ProblemWorkspaceModel.relationships],
  ["Composition Models", ProblemWorkspaceModel.compositions],
  ["Executive Representation", ProblemWorkspaceModel.representation],
  ["Dependency Declarations", ProblemWorkspaceModel.upstreamDependencies],
  ["Workspace Boundaries", ProblemWorkspaceRegistry.boundaries],
] as const);

export const ProblemWorkspaceValidationTargets = Object.freeze(
  definitions.map(([name, source], index) => Object.freeze({
    id: `WS-6:4/Target/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `References ${name} as an architectural validation target.`,
    source,
    order: index + 1,
    businessDataValidation: false,
    metadataOnly: true,
    immutable: true,
  })),
);
