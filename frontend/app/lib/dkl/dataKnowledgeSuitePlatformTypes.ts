/**
 * DKL-9:6 — Data Knowledge Suite Platform Types.
 *
 * Readonly contracts for Suite Platform inventory, guarantees, and compatibility.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by DKL-9:6.
 */

export type DataKnowledgeSuitePlatformStatus = "PlatformDefined";

export type DataKnowledgeSuitePlatformReadiness = "ReadyForCertification";

export interface DataKnowledgeSuitePlatformGuarantee {
  readonly guaranteeId: string;
  readonly name: string;
  readonly statement: string;
  readonly status: "Satisfied";
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

export interface DataKnowledgeSuitePlatformCompatibilityDeclaration {
  readonly id: string;
  readonly name: string;
  readonly scope: string;
  readonly compatible: true;
  readonly protected: true;
  readonly sourceReference: string;
  readonly status: "Compatible";
  readonly deterministicOrder: number;
}

export interface DataKnowledgeSuitePlatformDependency {
  readonly dependencyId: string;
  readonly dependencyName: string;
  readonly targetPhase: string;
  readonly module: string;
  readonly required: true;
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

export interface DataKnowledgeSuitePlatformPhaseReference {
  readonly phaseId: string;
  readonly phaseName: string;
  readonly stage: string;
  readonly version: string;
  readonly status: string;
  readonly directPredecessor: string | null;
  readonly directSuccessor: string | null;
  readonly canonicalReferencePath: string;
  readonly architectureRole: string;
  readonly runtimeBehavior: "None";
  readonly completed: boolean;
  readonly deterministicOrder: number;
}

export interface DataKnowledgeSuitePlatformPublicApiDeclaration {
  readonly apiId: string;
  readonly exportName: string;
  readonly description: string;
  readonly runtimeService: false;
  readonly mutableCollection: false;
  readonly deterministicOrder: number;
}

export interface DataKnowledgeSuitePlatformSummary {
  readonly platformId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly status: DataKnowledgeSuitePlatformStatus;
  readonly readiness: DataKnowledgeSuitePlatformReadiness;
  readonly manifestId: string;
  readonly capabilityCount: number;
  readonly publicApiInventoryTotal: number;
  readonly validationRuleCount: number;
  readonly validationGateCount: number;
  readonly guaranteeCount: number;
  readonly compatibilityCount: number;
  readonly manifestTotalEntryCount: number;
  readonly totalEntryCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
