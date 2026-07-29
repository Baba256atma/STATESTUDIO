/**
 * EX-1:5 — Executive Stage Manifest Dependencies.
 *
 * Exactly four upstream Stage phase dependencies.
 * No downstream dependencies are permitted.
 *
 * Ownership: owned exclusively by EX-1:5.
 */

/** Upstream dependency declaration. */
export interface ExecutiveStageManifestDependency {
  readonly dependencyId: string;
  readonly phaseId: "EX-1:1" | "EX-1:2" | "EX-1:3" | "EX-1:4";
  readonly phaseName: string;
  readonly canonicalId: string;
  readonly order: number;
  readonly required: true;
  readonly downstream: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const dependency = (
  phaseId: ExecutiveStageManifestDependency["phaseId"],
  phaseName: string,
  canonicalId: string,
  order: number,
): ExecutiveStageManifestDependency =>
  Object.freeze({
    dependencyId: `EX-1:5/Dependency/${phaseId}`,
    phaseId,
    phaseName,
    canonicalId,
    order,
    required: true as const,
    downstream: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly four upstream dependencies.
 * EX-1:1 Foundation → EX-1:2 Registry → EX-1:3 Model → EX-1:4 Validation
 */
export const ExecutiveStageManifestDependencies = Object.freeze([
  dependency(
    "EX-1:1",
    "Executive Stage Foundation",
    "EX-1:1/ExecutiveStageFoundation",
    1,
  ),
  dependency(
    "EX-1:2",
    "Executive Stage Registry",
    "EX-1:2/ExecutiveStageRegistry",
    2,
  ),
  dependency(
    "EX-1:3",
    "Executive Stage Model",
    "EX-1:3/ExecutiveStageModel",
    3,
  ),
  dependency(
    "EX-1:4",
    "Executive Stage Validation",
    "EX-1:4/ExecutiveStageValidation",
    4,
  ),
] as const);

/** Dependency catalogue metadata. */
export const ExecutiveStageManifestDependencyCatalog = Object.freeze({
  catalogId: "EX-1:5/DependencyCatalog",
  dependencies: ExecutiveStageManifestDependencies,
  upstreamCount: ExecutiveStageManifestDependencies.length,
  downstreamCount: 0 as const,
  downstreamDependenciesPermitted: false as const,
  completeUpstreamCoverage: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
