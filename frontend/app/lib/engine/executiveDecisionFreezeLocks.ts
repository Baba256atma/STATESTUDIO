import type {
  ExecutiveDecisionFreezeDependencyLock,
  ExecutiveDecisionFreezeExtensionLock,
  ExecutiveDecisionFreezeOwnershipLock,
} from "./executiveDecisionFreezeTypes.ts";

const ownership = (
  id: string,
  subject: string,
  owned: boolean,
) => Object.freeze({
  id,
  subject,
  ownership: owned ? "Owned" : "NotOwned",
  lockStatus: "Locked",
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveDecisionFreezeOwnershipLock);

const dependency = (
  id: string,
  classification: ExecutiveDecisionFreezeDependencyLock["classification"],
  target: string,
) => Object.freeze({
  id,
  classification,
  target,
  lockStatus: "Locked",
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveDecisionFreezeDependencyLock);

const extension = (
  id: string,
  name: string,
  description: string,
) => Object.freeze({
  id,
  name,
  description,
  additiveOnly: true,
  noExistingIdentifierReplacement: true,
  noOwnershipChange: true,
  noDependencyBoundaryViolation: true,
  noPublicContractBreakage: true,
  requiresRevalidation: true,
  requiresRecertification: true,
  requiresNewVersion: true,
  requiresFuturePhaseOwnership: true,
  lockStatus: "Controlled",
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveDecisionFreezeExtensionLock);

/**
 * Ownership locks for ENG-7 freeze.
 */
export const ExecutiveDecisionOwnershipLocks = Object.freeze({
  owned: Object.freeze([
    ownership("eng-7-own-architecture", "executive decision architecture", true),
    ownership("eng-7-own-registries", "decision registries", true),
    ownership("eng-7-own-models", "decision models", true),
    ownership("eng-7-own-validation", "decision validation metadata", true),
    ownership("eng-7-own-manifest", "decision manifest metadata", true),
    ownership("eng-7-own-platform", "decision platform metadata", true),
    ownership("eng-7-own-certification", "decision certification metadata", true),
    ownership("eng-7-own-freeze", "decision freeze metadata", true),
    ownership("eng-7-own-publication", "decision publication contracts", true),
    ownership("eng-7-own-recommendation-package", "recommendation-package contracts", true),
    ownership("eng-7-own-trace", "decision trace contracts", true),
  ] as const),
  notOwned: Object.freeze([
    ownership("eng-7-not-request", "request interpretation", false),
    ownership("eng-7-not-intent", "intent resolution", false),
    ownership("eng-7-not-context", "context assembly", false),
    ownership("eng-7-not-planning", "planning", false),
    ownership("eng-7-not-reasoning", "reasoning", false),
    ownership("eng-7-not-orchestration", "orchestration", false),
    ownership("eng-7-not-execution", "execution", false),
    ownership("eng-7-not-advisor", "Advisor communication", false),
    ownership("eng-7-not-director", "Director behavior", false),
    ownership("eng-7-not-scene", "Scene rendering", false),
    ownership("eng-7-not-eve", "EVE rendering", false),
    ownership("eng-7-not-persistence", "persistence", false),
    ownership("eng-7-not-database", "database access", false),
    ownership("eng-7-not-bus", "business-domain intelligence", false),
    ownership("eng-7-not-ops", "operational execution", false),
  ] as const),
  lockStatus: "Locked",
  metadataOnly: true,
  immutable: true,
} as const);

/**
 * Dependency locks for ENG-7 freeze.
 */
export const ExecutiveDecisionDependencyLocks = Object.freeze({
  incoming: Object.freeze([
    dependency("eng-7-dep-in-eng-1", "Incoming", "ENG-1"),
    dependency("eng-7-dep-in-eng-2", "Incoming", "ENG-2"),
    dependency("eng-7-dep-in-eng-3", "Incoming", "ENG-3"),
    dependency("eng-7-dep-in-eng-4", "Incoming", "ENG-4"),
    dependency("eng-7-dep-in-eng-5", "Incoming", "ENG-5"),
    dependency("eng-7-dep-in-eng-6", "Incoming", "ENG-6"),
  ] as const),
  outgoing: Object.freeze([
    dependency("eng-7-dep-out-eng-8", "Outgoing", "ENG-8"),
    dependency("eng-7-dep-out-advisor", "Outgoing", "Advisor"),
  ] as const),
  prohibited: Object.freeze([
    dependency("eng-7-dep-block-bus", "Prohibited", "BUS internals"),
    dependency("eng-7-dep-block-ops", "Prohibited", "OPS internals"),
    dependency("eng-7-dep-block-ui", "Prohibited", "UI internals"),
    dependency("eng-7-dep-block-director", "Prohibited", "Director runtime"),
    dependency("eng-7-dep-block-scene", "Prohibited", "Scene runtime"),
    dependency("eng-7-dep-block-eve", "Prohibited", "EVE runtime"),
    dependency("eng-7-dep-block-dkl", "Prohibited", "DKL internals"),
    dependency("eng-7-dep-block-persistence", "Prohibited", "persistence services"),
    dependency("eng-7-dep-block-database", "Prohibited", "database clients"),
    dependency("eng-7-dep-block-network", "Prohibited", "network services"),
    dependency("eng-7-dep-block-events", "Prohibited", "event systems"),
    dependency("eng-7-dep-block-schedulers", "Prohibited", "runtime schedulers"),
    dependency("eng-7-dep-block-workers", "Prohibited", "execution workers"),
  ] as const),
  lockStatus: "Locked",
  metadataOnly: true,
  immutable: true,
} as const);

/**
 * Controlled extension locks. No runtime extension framework is implemented.
 */
export const ExecutiveDecisionExtensionLocks = Object.freeze([
  extension(
    "eng-7-ext-domain",
    "Additive decision domain registration",
    "Permits additive decision domain metadata under a new versioned successor phase.",
  ),
  extension(
    "eng-7-ext-type",
    "Additive decision type registration",
    "Permits additive decision type metadata without replacing existing identifiers.",
  ),
  extension(
    "eng-7-ext-output",
    "Additive decision output metadata",
    "Permits additive decision output descriptors without contract breakage.",
  ),
  extension(
    "eng-7-ext-model-descriptor",
    "Additive model descriptor metadata",
    "Permits additive model descriptor metadata with revalidation and recertification.",
  ),
  extension(
    "eng-7-ext-compatibility",
    "Additive compatibility declaration",
    "Permits additive compatibility declarations that preserve frozen contracts.",
  ),
  extension(
    "eng-7-ext-consumer",
    "Additive public consumer declaration",
    "Permits additive public consumer declarations without dependency-boundary violation.",
  ),
] as const);
