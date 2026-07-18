/**
 * DKL-9:3 — Data Knowledge Suite Model Types.
 *
 * Readonly contracts for Suite composition model kinds and relationships.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by DKL-9:3.
 */

export type DataKnowledgeSuiteModelStatus = "ModelDefined";

export type DataKnowledgeSuiteModelReadiness = "ReadyForValidation";

export type DataKnowledgeSuiteModelKind =
  | "Suite"
  | "Capability"
  | "CapabilityReference"
  | "CapabilityDependency"
  | "CapabilityOrdering"
  | "CapabilityVersion"
  | "CapabilityStatus"
  | "CapabilityReadiness"
  | "PublicPlatformReference"
  | "PublicApiRegistryReference"
  | "IntegrationContractReference"
  | "OwnershipReference"
  | "BoundaryReference"
  | "SuiteRelease"
  | "SuiteSnapshot"
  | "SuiteResult";

export type DataKnowledgeSuiteRelationshipKind =
  | "ContainsCapability"
  | "DependsOnCapability"
  | "ReferencesPlatform"
  | "ReferencesApiRegistry"
  | "UsesContract"
  | "UsesIntegrationContract"
  | "UsesBoundary"
  | "UsesOwnership"
  | "SupersedesRelease"
  | "ProducesSnapshot";

export interface DataKnowledgeSuiteModelKindDescriptor {
  readonly modelKindId: string;
  readonly modelKind: DataKnowledgeSuiteModelKind;
  readonly description: string;
  readonly fields: readonly string[];
  readonly sourcePhase: "DKL-9:3";
  readonly registryAligned: true;
  readonly runtimeBehavior: "None";
  readonly reconstructsUpstreamModels: false;
  readonly duplicatesUpstreamModels: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

export interface DataKnowledgeSuiteRelationshipKindDescriptor {
  readonly relationshipKindId: string;
  readonly relationshipKind: DataKnowledgeSuiteRelationshipKind;
  readonly description: string;
  readonly direction: "Directed";
  readonly runtimeBehavior: "None";
  readonly traversableAtRuntime: false;
  readonly deterministicOrder: number;
}

export interface DataKnowledgeSuiteModelInstanceBase {
  readonly modelId: string;
  readonly modelKind: DataKnowledgeSuiteModelKind;
  readonly name: string;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeBehavior: "None";
  readonly reconstructsUpstream: false;
}

export interface DataKnowledgeSuiteGuarantee {
  readonly guaranteeId: string;
  readonly statement: string;
  readonly status: "Guaranteed";
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

export interface DataKnowledgeSuiteModelSummary {
  readonly modelId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly status: DataKnowledgeSuiteModelStatus;
  readonly readiness: DataKnowledgeSuiteModelReadiness;
  readonly registryId: string;
  readonly modelKindCount: number;
  readonly relationshipKindCount: number;
  readonly suiteModelCount: number;
  readonly capabilityModelCount: number;
  readonly referenceModelCount: number;
  readonly dependencyModelCount: number;
  readonly releaseModelCount: number;
  readonly publicApiInventoryTotal: number;
  readonly registryTotalEntryCount: number;
  readonly totalModelInstanceCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
