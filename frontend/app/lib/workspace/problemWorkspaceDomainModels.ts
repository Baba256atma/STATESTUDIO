/** WS-6:3 — Canonical Problem Workspace domain models. */
import type { ProblemWorkspaceModelDescriptor } from "./problemWorkspaceIdentityModel.ts";
import { ProblemWorkspaceRegistry } from "./problemWorkspaceRegistry.ts";

const names = Object.freeze([
  "ProblemWorkspaceModel",
  "BusinessProblemModel",
  "ProblemIdentityModel",
  "ProblemDefinitionModel",
  "ProblemContextModel",
  "ProblemEvidenceModel",
  "ProblemConstraintModel",
  "ProblemAssumptionModel",
  "ProblemHypothesisModel",
  "ProblemImpactModel",
  "ProblemClassificationModel",
  "ProblemBoundaryModel",
  "ProblemLifecycleModel",
  "ProblemReadinessModel",
  "ExecutiveProblemRepresentationModel",
] as const);

export const ProblemWorkspaceDomainModels = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-6:3/DomainModel/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Defines the structural ${name} metadata.`,
    source: ProblemWorkspaceRegistry,
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly ProblemWorkspaceModelDescriptor[],
);
