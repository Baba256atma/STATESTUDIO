/**
 * RTC-1:5 — Executive Context Manifest Dependencies.
 *
 * Exactly four upstream Runtime phase dependencies.
 * No downstream dependencies are permitted.
 *
 * Ownership: owned exclusively by RTC-1:5.
 */

/** Upstream dependency declaration. */
export interface ExecutiveContextManifestDependency {
  readonly dependencyId: string;
  readonly phaseId: "RTC-1:1" | "RTC-1:2" | "RTC-1:3" | "RTC-1:4";
  readonly phaseName: string;
  readonly canonicalId: string;
  readonly order: number;
  readonly required: true;
  readonly downstream: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const dependency = (
  phaseId: ExecutiveContextManifestDependency["phaseId"],
  phaseName: string,
  canonicalId: string,
  order: number,
): ExecutiveContextManifestDependency =>
  Object.freeze({
    dependencyId: `RTC-1:5/Dependency/${phaseId}`,
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
 * RTC-1:1 Foundation → RTC-1:2 Registry → RTC-1:3 Model → RTC-1:4 Validation
 */
export const ExecutiveContextManifestDependencies = Object.freeze([
  dependency(
    "RTC-1:1",
    "Executive Context Runtime Foundation",
    "RTC-1:1/ExecutiveContextRuntimeFoundation",
    1,
  ),
  dependency(
    "RTC-1:2",
    "Executive Context Runtime Registry",
    "RTC-1:2/ExecutiveContextRuntimeRegistry",
    2,
  ),
  dependency(
    "RTC-1:3",
    "Executive Context Runtime Model",
    "RTC-1:3/ExecutiveContextRuntimeModel",
    3,
  ),
  dependency(
    "RTC-1:4",
    "Executive Context Runtime Validation",
    "RTC-1:4/ExecutiveContextRuntimeValidation",
    4,
  ),
] as const);

/** Dependency catalogue metadata. */
export const ExecutiveContextManifestDependencyCatalog = Object.freeze({
  catalogId: "RTC-1:5/DependencyCatalog",
  dependencies: ExecutiveContextManifestDependencies,
  upstreamCount: ExecutiveContextManifestDependencies.length,
  downstreamCount: 0 as const,
  downstreamDependenciesPermitted: false as const,
  completeUpstreamCoverage: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
