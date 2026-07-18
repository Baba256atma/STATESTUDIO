/**
 * DKL-9:5 — Data Knowledge Suite Manifest Types.
 *
 * Readonly contracts for Suite Manifest inventory, guarantees, and readiness.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by DKL-9:5.
 */

export type DataKnowledgeSuiteManifestStatus = "ManifestDefined";

export type DataKnowledgeSuiteManifestReadiness = "ReadyForPlatform";

export interface DataKnowledgeSuiteManifestGuarantee {
  readonly guaranteeId: string;
  readonly name: string;
  readonly statement: string;
  readonly status: "Satisfied";
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

export interface DataKnowledgeSuiteManifestPublicApiDeclaration {
  readonly apiId: string;
  readonly exportName: string;
  readonly description: string;
  readonly runtimeService: false;
  readonly mutableCollection: false;
  readonly deterministicOrder: number;
}

export interface DataKnowledgeSuiteManifestSummary {
  readonly manifestId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly status: DataKnowledgeSuiteManifestStatus;
  readonly readiness: DataKnowledgeSuiteManifestReadiness;
  readonly validationId: string;
  readonly capabilityCount: number;
  readonly publicApiInventoryTotal: number;
  readonly validationRuleCount: number;
  readonly validationGateCount: number;
  readonly guaranteeCount: number;
  readonly totalEntryCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
