/**
 * DKL-9:8 — Data Knowledge Suite Freeze Types.
 *
 * Readonly contracts for the immutable Data Knowledge Suite Freeze.
 * Metadata-only. No runtime behaviour.
 *
 * Ownership: owned exclusively by DKL-9:8.
 */

export type DataKnowledgeSuiteFreezeStatus = "Frozen";

export type DataKnowledgeSuiteFreezeReadiness = "ReadyForPublicIndex";

export type DataKnowledgeSuiteFreezeLockId =
  "DKL-9-DATA-KNOWLEDGE-SUITE-LOCKED";

export interface DataKnowledgeSuiteFreezeComponent {
  readonly id: string;
  readonly name: string;
  readonly phase: string;
  readonly version: string;
  readonly status: string;
  readonly sourceReference: string;
  readonly frozen: true;
  readonly certified: true;
  readonly stability: "Locked";
  readonly compatibility: "Compatible";
  readonly publicSurfaceStatus: "Protected" | "InternalProtected";
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
}

export interface DataKnowledgeSuiteFreezeLockDeclaration {
  readonly id: DataKnowledgeSuiteFreezeLockId;
  readonly name: string;
  readonly scope: "DKL-9";
  readonly version: string;
  readonly status: DataKnowledgeSuiteFreezeStatus;
  readonly locked: true;
  readonly certificationResult: "Pass";
  readonly protectedComponents: readonly string[];
  readonly protectedPublicSurface: readonly string[];
  readonly protectedInventory: true;
  readonly breakingChangePolicy: "MajorVersionRequired";
  readonly extensionPolicy: "AdditiveOnly";
  readonly readiness: DataKnowledgeSuiteFreezeReadiness;
  readonly metadataOnly: true;
  readonly declarativeOnly: true;
}

export interface DataKnowledgeSuiteFreezeBaseline {
  readonly id: string;
  readonly name: string;
  readonly scope: string;
  readonly sourceReference: string;
  readonly expectedState: string;
  readonly frozen: true;
  readonly satisfied: true;
  readonly breakingChangeImpact: "Major";
  readonly status: "Active";
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
}

export interface DataKnowledgeSuiteFreezeCompatibilityDeclaration {
  readonly id: string;
  readonly name: string;
  readonly compatible: true;
  readonly frozen: true;
  readonly protected: true;
  readonly breakingChangePolicy: "MajorVersionRequired";
  readonly sourceReference: string;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
}

export interface DataKnowledgeSuiteFreezeExtensionLock {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly protectedScope: string;
  readonly allowedChange: string;
  readonly prohibitedChange: string;
  readonly breakingChangeRequired: boolean;
  readonly status: "Active";
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
}

export interface DataKnowledgeSuiteFreezeGuarantee {
  readonly id: string;
  readonly name: string;
  readonly statement: string;
  readonly status: "Satisfied";
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
}

export interface DataKnowledgeSuiteFreezePublicApiDeclaration {
  readonly apiId: string;
  readonly exportName: string;
  readonly description: string;
  readonly runtimeService: false;
  readonly mutableCollection: false;
  readonly deterministicOrder: number;
}

export interface DataKnowledgeSuiteFreezeInventory {
  readonly inventoryId: string;
  readonly upstreamCertificationInventory: Readonly<
    Record<string, number | boolean | string>
  >;
  readonly frozenComponentCount: number;
  readonly baselineCount: number;
  readonly compatibilityCount: number;
  readonly extensionLockCount: number;
  readonly guaranteeCount: number;
  readonly publicApiCount: number;
  readonly totalEntryCount: number;
  readonly countingRule: string;
  readonly sourcedThroughCertification: true;
  readonly reconstructed: false;
  readonly hardcoded: false;
  readonly duplicated: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface DataKnowledgeSuiteFreezeSummary {
  readonly id: string;
  readonly version: string;
  readonly namespace: string;
  readonly status: DataKnowledgeSuiteFreezeStatus;
  readonly freezeLock: DataKnowledgeSuiteFreezeLockId;
  readonly readiness: DataKnowledgeSuiteFreezeReadiness;
  readonly upstreamDependency: string;
  readonly certificationOutcome: string;
  readonly frozenComponentCount: number;
  readonly baselineCount: number;
  readonly compatibilityCount: number;
  readonly extensionLockCount: number;
  readonly capabilityCount: number;
  readonly publicApiInventoryTotal: number;
  readonly validationRuleCount: number;
  readonly platformTotalEntryCount: number;
  readonly totalEntryCount: number;
  readonly runtimeBehavior: "None";
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
