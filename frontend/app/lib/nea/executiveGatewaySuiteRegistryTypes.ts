/**
 * NEA-8:2 — Executive Gateway Suite Registry Types.
 *
 * Readonly contracts and closed vocabularies for the Executive Gateway Suite Registry.
 * Metadata-only. No runtime gateway, orchestration, or AI.
 *
 * Ownership: owned exclusively by NEA-8:2.
 */

/** Registry status for NEA-8:2. */
export type ExecutiveGatewaySuiteRegistryStatus = "Registry";

/** Immediate downstream readiness — Model only. */
export type ExecutiveGatewaySuiteRegistryReadiness = "ReadyForModel";

/** Immutable suite status vocabulary identifiers. */
export type ExecutiveGatewaySuiteStatusId =
  | "Registered"
  | "Certified"
  | "Frozen"
  | "Released"
  | "Deprecated";

/** Minimal Public Index status surface accessed through Foundation references. */
export interface SuitePublicIndexStatusSurface {
  readonly publicIndex: {
    readonly releaseStatus: string;
    readonly certificationStatus: string;
    readonly freezeStatus: string;
    readonly consumerReadiness: string;
  };
}

/** Base registry entry shape. */
export interface ExecutiveGatewaySuiteRegistryEntry {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly sourcePhase: "NEA-8:1" | "NEA-8:2";
  readonly foundationReference: string | null;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/**
 * Suite component registration — Public Index reference preserved through Foundation.
 */
export interface ExecutiveGatewaySuiteComponentRegistration {
  readonly registrationId: string;
  readonly componentId: string;
  readonly componentName: string;
  readonly stageId: string;
  readonly publicIndexId: string;
  readonly publicIndexVersion: string;
  readonly publicIndexName: string;
  readonly publicIndexNamespace: string;
  readonly publicIndexModule: string;
  readonly publicApiCount: number;
  readonly publicPlatform: unknown;
  readonly ownership: "Referenced";
  readonly registrationStatus: "Registered";
  readonly reconstructsUpstream: false;
  readonly duplicatesArchitecture: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/**
 * Suite component identity — statuses derived from upstream Public Index via Foundation.
 */
export interface ExecutiveGatewaySuiteComponentIdentity {
  readonly identityId: string;
  readonly componentId: string;
  readonly componentName: string;
  readonly namespace: string;
  readonly version: string;
  readonly releaseStatus: string;
  readonly certificationStatus: string;
  readonly freezeStatus: string;
  readonly consumerReadiness: string;
  readonly publicIndexId: string;
  readonly foundationReference: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/**
 * Declarative suite component dependency — no runtime resolution.
 */
export interface ExecutiveGatewaySuiteDependencyDeclaration {
  readonly dependencyId: string;
  readonly componentId: string;
  readonly componentName: string;
  readonly dependsOnComponentId: string | null;
  readonly dependsOnComponentName: string | null;
  readonly dependencyMode: "DeclarativeOnly";
  readonly resolvesRuntime: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical registry identity. */
export interface ExecutiveGatewaySuiteRegistryIdentity {
  readonly registryId: string;
  readonly registryName: string;
  readonly registryVersion: string;
  readonly registryNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-8:2";
  readonly stage: "Registry";
  readonly sourcePhase: "NEA-8:2";
  readonly owner: string;
  readonly status: ExecutiveGatewaySuiteRegistryStatus;
  readonly readiness: ExecutiveGatewaySuiteRegistryReadiness;
  readonly foundationId: string;
  readonly foundationVersion: string;
  readonly suiteName: "Executive Gateway Suite";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic registry summary. */
export interface ExecutiveGatewaySuiteRegistrySummary {
  readonly registryId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-8:2";
  readonly status: ExecutiveGatewaySuiteRegistryStatus;
  readonly readiness: ExecutiveGatewaySuiteRegistryReadiness;
  readonly foundationId: string;
  readonly suiteName: "Executive Gateway Suite";
  readonly componentCount: number;
  readonly componentIdentityCount: number;
  readonly dependencyCount: number;
  readonly statusCount: number;
  readonly capabilityCount: number;
  readonly contractCount: number;
  readonly lifecycleEntryCount: number;
  readonly registryPolicyCount: number;
  readonly publicApiInventoryTotal: number;
  readonly totalRegistryEntryCount: number;
  readonly publicExportCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
