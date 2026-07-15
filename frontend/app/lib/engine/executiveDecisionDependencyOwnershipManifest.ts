import {
  ExecutiveDecisionDependencyMap,
  ExecutiveDecisionOwnershipMap,
} from "./executiveDecisionPublicApi.ts";
import type {
  ExecutiveDecisionManifestDependency,
  ExecutiveDecisionManifestOwnership,
} from "./executiveDecisionManifestTypes.ts";

const dependency = (
  key: string,
  source: string,
  target: string,
  direction: ExecutiveDecisionManifestDependency["direction"],
  permission: ExecutiveDecisionManifestDependency["permission"],
  relationshipType: string,
  architecturalRationale: string,
  publicContractRequired: boolean,
) => Object.freeze({
  id: `eng-7-manifest-dependency-${key}`,
  source,
  target,
  direction,
  permission,
  relationshipType,
  architecturalRationale,
  publicContractRequired,
  runtimeUseProhibited: true,
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveDecisionManifestDependency);

export const ExecutiveDecisionDependencyManifest = Object.freeze([
  dependency("in-eng-1", "ENG-7", "ENG-1", "Incoming", "Allowed", "PublicIndexReference", "Consumes executive engine foundation publicly.", true),
  dependency("in-eng-2", "ENG-7", "ENG-2", "Incoming", "Allowed", "PublicIndexReference", "Consumes request and intent intake publicly.", true),
  dependency("in-eng-3", "ENG-7", "ENG-3", "Incoming", "Allowed", "PublicIndexReference", "Consumes intent resolution publicly.", true),
  dependency("in-eng-4", "ENG-7", "ENG-4", "Incoming", "Allowed", "PublicIndexReference", "Consumes context assembly publicly.", true),
  dependency("in-eng-5", "ENG-7", "ENG-5", "Incoming", "Allowed", "PublicIndexReference", "Consumes planning publicly.", true),
  dependency("in-eng-6", "ENG-7", "ENG-6", "Incoming", "Allowed", "PublicIndexReference", "Consumes validated reasoning outcomes publicly.", true),
  dependency("out-eng-8", "ENG-7", "ENG-8", "Outgoing", "Allowed", "PublicPublication", "Publishes decisions for orchestration consumers.", true),
  dependency("out-advisor", "ENG-7", "Advisor", "Outgoing", "Allowed", "PublicPublication", "Publishes recommendation packages for Advisor consumption.", true),
  dependency("forbid-bus", "ENG-7", "BUS internal modules", "Forbidden", "Forbidden", "InternalImport", "BUS internals are prohibited.", false),
  dependency("forbid-ops", "ENG-7", "OPS internal modules", "Forbidden", "Forbidden", "InternalImport", "OPS internals are prohibited.", false),
  dependency("forbid-ui", "ENG-7", "UI", "Forbidden", "Forbidden", "InternalImport", "UI modules are prohibited.", false),
  dependency("forbid-director", "ENG-7", "Director runtime", "Forbidden", "Forbidden", "RuntimeImport", "Director runtime is prohibited.", false),
  dependency("forbid-scene", "ENG-7", "Scene runtime", "Forbidden", "Forbidden", "RuntimeImport", "Scene runtime is prohibited.", false),
  dependency("forbid-eve", "ENG-7", "EVE runtime", "Forbidden", "Forbidden", "RuntimeImport", "EVE runtime is prohibited.", false),
  dependency("forbid-dkl", "ENG-7", "DKL internals", "Forbidden", "Forbidden", "InternalImport", "DKL internals are prohibited.", false),
  dependency("forbid-persistence", "ENG-7", "persistence services", "Forbidden", "Forbidden", "PersistenceImport", "Persistence services are prohibited.", false),
  dependency("forbid-database", "ENG-7", "database clients", "Forbidden", "Forbidden", "PersistenceImport", "Database clients are prohibited.", false),
  dependency("forbid-network", "ENG-7", "network services", "Forbidden", "Forbidden", "RuntimeImport", "Network services are prohibited.", false),
  dependency("forbid-workers", "ENG-7", "execution workers", "Forbidden", "Forbidden", "RuntimeImport", "Execution workers are prohibited.", false),
  dependency("forbid-schedulers", "ENG-7", "schedulers", "Forbidden", "Forbidden", "RuntimeImport", "Schedulers are prohibited.", false),
  dependency("forbid-events", "ENG-7", "runtime event systems", "Forbidden", "Forbidden", "RuntimeImport", "Runtime event systems are prohibited.", false),
] as const);

export const ExecutiveDecisionOwnershipManifest = Object.freeze({
  owner: "ENG-7",
  owns: Object.freeze([
    "executive decision architecture",
    "decision metadata",
    "decision domains and types",
    "decision model contracts",
    "decision alternative contracts",
    "decision confidence contracts",
    "decision risk contracts",
    "decision trade-off contracts",
    "decision impact contracts",
    "decision trace contracts",
    "recommendation-package contracts",
    "decision publication contracts",
    "ENG-7 architectural validation metadata",
  ] as const),
  neverOwns: Object.freeze([
    "request interpretation",
    "intent resolution",
    "context assembly",
    "executive planning",
    "executive reasoning",
    "orchestration",
    "operational execution",
    "business-domain intelligence",
    "Advisor communication behavior",
    "Director behavior",
    "Scene rendering",
    "EVE rendering",
    "persistence",
    "database access",
    "connected-data interpretation",
  ] as const),
  foundationAlignment: Object.freeze({
    foundationOwner: ExecutiveDecisionOwnershipMap.owner,
    allowedIncoming: ExecutiveDecisionDependencyMap.allowedIncoming,
    allowedOutgoing: ExecutiveDecisionDependencyMap.allowedOutgoing,
  } as const),
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveDecisionManifestOwnership & {
  readonly foundationAlignment: Readonly<{
    foundationOwner: string;
    allowedIncoming: readonly string[];
    allowedOutgoing: readonly string[];
  }>;
});

export const ExecutiveDecisionDependencyOwnershipManifest = Object.freeze({
  id: "eng-7-manifest-dependency-ownership",
  name: "Executive Decision Dependency Ownership Manifest",
  dependencies: ExecutiveDecisionDependencyManifest,
  ownership: ExecutiveDecisionOwnershipManifest,
  incomingCount: ExecutiveDecisionDependencyManifest.filter(({ direction }) => direction === "Incoming").length,
  outgoingCount: ExecutiveDecisionDependencyManifest.filter(({ direction }) => direction === "Outgoing").length,
  forbiddenCount: ExecutiveDecisionDependencyManifest.filter(({ direction }) => direction === "Forbidden").length,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
