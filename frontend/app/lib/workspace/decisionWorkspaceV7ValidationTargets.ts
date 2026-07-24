/** WS-7:4 — Source-linked architectural validation targets. */
import { DecisionWorkspaceV7Foundation } from "./decisionWorkspaceV7Foundation.ts";
import { DecisionWorkspaceV7Model } from "./decisionWorkspaceV7Model.ts";
import { DecisionWorkspaceV7Registry } from "./decisionWorkspaceV7Registry.ts";

const definitions = Object.freeze([
  ["Decision Workspace Foundation", DecisionWorkspaceV7Foundation],
  ["Decision Workspace Registry", DecisionWorkspaceV7Registry],
  ["Decision Workspace Model", DecisionWorkspaceV7Model],
  ["Foundation Contracts", DecisionWorkspaceV7Foundation.contracts],
  ["Foundation Capabilities", DecisionWorkspaceV7Foundation.capabilities],
  ["Foundation Responsibilities", DecisionWorkspaceV7Foundation.responsibilities],
  ["Registry Taxonomy", DecisionWorkspaceV7Registry.taxonomy],
  ["Registry Constraints", DecisionWorkspaceV7Registry.constraints],
  ["Registry Impact Domains", DecisionWorkspaceV7Registry.impacts],
  ["Registry Lifecycle", DecisionWorkspaceV7Registry.lifecycle],
  ["Domain Models", DecisionWorkspaceV7Model.domainModels],
  ["Relationship Models", DecisionWorkspaceV7Model.relationships],
  ["Composition Models", DecisionWorkspaceV7Model.compositions],
  ["Executive Representation", DecisionWorkspaceV7Model.representation],
  ["Dependency Declarations", DecisionWorkspaceV7Model.upstreamDependencies],
  ["Workspace Boundaries", DecisionWorkspaceV7Registry.boundaries],
] as const);

export const DecisionWorkspaceV7ValidationTargets = Object.freeze(
  definitions.map(([name, source], index) =>
    Object.freeze({
      id: `WS-7:4/Target/${String(index + 1).padStart(2, "0")}`,
      name,
      description:
        `References ${name} as an architectural validation target.`,
      source,
      order: index + 1,
      businessDecisionValidation: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
