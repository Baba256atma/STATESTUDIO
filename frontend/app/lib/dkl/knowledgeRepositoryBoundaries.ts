/**
 * DKL-6:1 — Knowledge Repository Boundaries.
 *
 * Explicit immutable boundary declarations separating the Knowledge Repository
 * from databases, networks, APIs, filesystems, caches, and external services.
 *
 * Ownership: owned exclusively by DKL-6:1.
 */

/** Canonical immutable boundary declarations. */
export const KnowledgeRepositoryBoundaries = Object.freeze({
  boundariesId: "DKL-6:1/KnowledgeRepositoryBoundaries",
  sourcePhase: "DKL-6:1" as const,
  consumes: Object.freeze(["DKL-5 Public Index"] as const),
  provides: Object.freeze(["Repository Foundation"] as const),
  neverAccesses: Object.freeze([
    "Database",
    "Network",
    "APIs",
    "File System",
    "Cache",
    "External Services",
  ] as const),
  consumesDkl5PublicIndex: true,
  accessesDatabase: false,
  accessesNetwork: false,
  accessesApis: false,
  accessesFileSystem: false,
  accessesCache: false,
  accessesExternalServices: false,
  implementsSql: false,
  implementsGraphDb: false,
  implementsVectorDb: false,
  implementsElasticsearch: false,
  implementsRedis: false,
  implementsCloudStorage: false,
  implementsSearchAlgorithms: false,
  executesQueries: false,
  performsIndexing: false,
  performsCaching: false,
  performsAiOrEmbeddings: false,
  performsSerialization: false,
  performsHttp: false,
  performsIo: false,
  executesEngineReasoning: false,
  createsBusinessObjects: false,
  performsKnowledgeValidation: false,
  rendersUi: false,
  narratesAdvisor: false,
  rendersScene: false,
  architecturalPosition: Object.freeze({
    upstream: Object.freeze([
      "DKL-5 Knowledge Validation (Public Index only)",
      "DKL-4 Knowledge Modeling (via DKL-5)",
      "DKL-3 Data Understanding (via DKL-5)",
    ]),
    platform: "DKL-6 Knowledge Repository",
    downstream: Object.freeze([
      "DKL-6:2 Knowledge Repository Registry",
      "DKL-7 Knowledge Services",
      "Executive Engine (restricted consumer)",
    ]),
  }),
  metadataOnly: true,
  repositoryArchitectureOnly: true,
  persistenceImplementationExcluded: true,
  storageEngineExcluded: true,
  databaseCouplingExcluded: true,
  immutable: true,
  deterministic: true,
});
