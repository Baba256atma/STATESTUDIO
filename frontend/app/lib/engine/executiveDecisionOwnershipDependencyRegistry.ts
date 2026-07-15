import {
  ExecutiveDecisionDependencyMap,
  ExecutiveDecisionOwnershipMap,
} from "./executiveDecisionPublicApi.ts";
import type {
  ExecutiveDecisionDependencyRegistryEntry,
  ExecutiveDecisionOwnershipRegistryEntry,
} from "./executiveDecisionRegistryTypes.ts";

const owns = (key: string, artifact: string, rationale: string) => Object.freeze({
  id: `eng-7-ownership-owns-${key}`,
  classification: "Owns",
  artifact,
  owner: "ENG-7",
  rationale,
  status: "Protected",
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveDecisionOwnershipRegistryEntry);

const doesNotOwn = (key: string, artifact: string, owner: string, rationale: string) => Object.freeze({
  id: `eng-7-ownership-excludes-${key}`,
  classification: "DoesNotOwn",
  artifact,
  owner,
  rationale,
  status: "Protected",
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveDecisionOwnershipRegistryEntry);

const dependency = (
  key: string,
  direction: ExecutiveDecisionDependencyRegistryEntry["direction"],
  target: string,
  relationship: string,
  permission: ExecutiveDecisionDependencyRegistryEntry["permission"],
  rationale: string,
  ownershipBoundary: string,
) => Object.freeze({
  id: `eng-7-registry-dependency-${key}`,
  direction,
  target,
  relationship,
  permission,
  rationale,
  ownershipBoundary,
  status: permission === "Allowed" ? "Allowed" : "Forbidden",
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveDecisionDependencyRegistryEntry);

/**
 * Ownership registry aligned with ENG-7:1 public ownership map.
 */
export const ExecutiveDecisionOwnershipRegistry = Object.freeze([
  owns("decision-domain-metadata", "decision-domain metadata", "ENG-7 owns decision-domain classification metadata."),
  owns("decision-type-metadata", "decision-type metadata", "ENG-7 owns decision-type classification metadata."),
  owns("capability-contracts", "decision capability contracts", "ENG-7 owns decision capability contracts."),
  owns("decision-outputs", "decision outputs", "ENG-7 owns decision output contracts."),
  owns("lifecycle-metadata", "decision lifecycle metadata", "ENG-7 owns decision lifecycle metadata."),
  owns("publication-contracts", "decision publication contracts", "ENG-7 owns decision publication contracts."),
  owns("trace-contracts", "decision trace contracts", "ENG-7 owns decision trace contracts."),
  owns("recommendation-package-contracts", "recommendation-package contracts", "ENG-7 owns recommendation-package contracts."),
  doesNotOwn("request-interpretation", "user request interpretation", "ENG-2", "ENG-2 owns request and intent intake."),
  doesNotOwn("intent-resolution", "intent resolution", "ENG-3", "ENG-3 owns intent resolution."),
  doesNotOwn("context-assembly", "context assembly", "ENG-4", "ENG-4 owns context assembly."),
  doesNotOwn("planning", "planning", "ENG-5", "ENG-5 owns executive planning."),
  doesNotOwn("reasoning", "reasoning", "ENG-6", "ENG-6 owns reasoning outcomes and evidence."),
  doesNotOwn("bus-models", "BUS business models", "BUS", "BUS owns business-domain intelligence."),
  doesNotOwn("ops-models", "OPS execution models", "OPS", "OPS owns execution structures and state."),
  doesNotOwn("orchestration", "orchestration", "ENG-8", "ENG-8 will own orchestration."),
  doesNotOwn("advisor-behavior", "Advisor communication behavior", "Advisor", "Advisor owns human-facing communication."),
  doesNotOwn("scene-rendering", "Scene or EVE rendering", "Director|Scene|EVE", "Director, Scene, and EVE own visual presentation."),
  doesNotOwn("persistence", "persistence", "DKL|Persistence", "DKL and persistence layers own stored data."),
  doesNotOwn("database-access", "database access", "DKL|Persistence", "Database access is outside ENG-7."),
  doesNotOwn("runtime-execution", "runtime execution", "OPS", "Runtime execution remains with OPS."),
] as const);

/**
 * Dependency registry aligned with ENG-7:1 public dependency map.
 */
export const ExecutiveDecisionDependencyRegistry = Object.freeze([
  dependency("in-eng-1", "Incoming", "ENG-1", "PublicIndexConsumption", "Allowed", "Consumes executive engine foundation public index.", "ENG-7 consumes ENG-1 publicly only."),
  dependency("in-eng-2", "Incoming", "ENG-2", "PublicIndexConsumption", "Allowed", "Consumes request and intent public index.", "ENG-7 does not own request intake."),
  dependency("in-eng-3", "Incoming", "ENG-3", "PublicIndexConsumption", "Allowed", "Consumes intent resolution public index.", "ENG-7 does not own intent resolution."),
  dependency("in-eng-4", "Incoming", "ENG-4", "PublicIndexConsumption", "Allowed", "Consumes context assembly public index.", "ENG-7 does not own context assembly."),
  dependency("in-eng-5", "Incoming", "ENG-5", "PublicIndexConsumption", "Allowed", "Consumes planning public index.", "ENG-7 does not own planning."),
  dependency("in-eng-6", "Incoming", "ENG-6", "PublicIndexConsumption", "Allowed", "Consumes reasoning public index.", "ENG-7 consumes validated reasoning outcomes only."),
  dependency("out-eng-8", "Outgoing", "ENG-8", "PublicIndexPublication", "Allowed", "Publishes decision metadata for orchestration consumers.", "ENG-8 owns orchestration."),
  dependency("out-advisor", "Outgoing", "Advisor", "PublicIndexPublication", "Allowed", "Publishes recommendation packages for Advisor communication.", "Advisor owns communication behavior."),
  dependency("forbid-bus", "Forbidden", "BUS internal modules", "InternalImport", "Forbidden", "BUS internals are prohibited.", "BUS owns business intelligence."),
  dependency("forbid-ops", "Forbidden", "OPS internal modules", "InternalImport", "Forbidden", "OPS internals are prohibited.", "OPS owns execution."),
  dependency("forbid-ui", "Forbidden", "UI modules", "InternalImport", "Forbidden", "UI modules are prohibited.", "UI is outside ENG-7."),
  dependency("forbid-scene", "Forbidden", "Scene runtime", "RuntimeImport", "Forbidden", "Scene runtime is prohibited.", "Scene owns rendering."),
  dependency("forbid-eve", "Forbidden", "EVE runtime", "RuntimeImport", "Forbidden", "EVE runtime is prohibited.", "EVE owns presentation behavior."),
  dependency("forbid-db-clients", "Forbidden", "database clients", "PersistenceImport", "Forbidden", "Database clients are prohibited.", "Persistence owns data access."),
  dependency("forbid-persistence", "Forbidden", "persistence services", "PersistenceImport", "Forbidden", "Persistence services are prohibited.", "Persistence owns storage."),
  dependency("forbid-network", "Forbidden", "network services", "RuntimeImport", "Forbidden", "Network services are prohibited.", "Networking is outside ENG-7."),
  dependency("forbid-schedulers", "Forbidden", "runtime schedulers", "RuntimeImport", "Forbidden", "Runtime schedulers are prohibited.", "OPS owns scheduling runtime."),
  dependency("forbid-workers", "Forbidden", "execution workers", "RuntimeImport", "Forbidden", "Execution workers are prohibited.", "OPS owns execution workers."),
] as const);

export const ExecutiveDecisionRegistryBoundaryAlignment = Object.freeze({
  foundationOwnershipOwner: ExecutiveDecisionOwnershipMap.owner,
  foundationAllowedIncoming: ExecutiveDecisionDependencyMap.allowedIncoming,
  foundationAllowedOutgoing: ExecutiveDecisionDependencyMap.allowedOutgoing,
  foundationForbiddenTargets: ExecutiveDecisionDependencyMap.forbiddenTargets,
  metadataOnly: true,
  immutable: true,
} as const);
