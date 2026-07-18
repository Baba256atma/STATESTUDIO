/**
 * DKL-8:8 — Knowledge Governance Freeze Types.
 *
 * Readonly contracts for the immutable Knowledge Governance Freeze.
 * Metadata-only. No runtime behaviour.
 *
 * Ownership: owned exclusively by DKL-8:8.
 */

export type KnowledgeGovernanceFreezeStatus = "Frozen";

export type KnowledgeGovernanceFreezeReadiness = "ReadyForPublicIndex";

export interface KnowledgeGovernanceFreezeComponent {
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

export interface KnowledgeGovernanceFreezeLockDeclaration {
  readonly id: "DKL-8-KNOWLEDGE-GOVERNANCE-LOCKED";
  readonly name: string;
  readonly scope: "DKL-8";
  readonly version: string;
  readonly status: KnowledgeGovernanceFreezeStatus;
  readonly locked: true;
  readonly certificationResult: "Pass";
  readonly protectedComponents: readonly string[];
  readonly protectedPublicSurface: readonly string[];
  readonly protectedInventory: true;
  readonly breakingChangePolicy: "MajorVersionRequired";
  readonly extensionPolicy: "AdditiveOnly";
  readonly readiness: KnowledgeGovernanceFreezeReadiness;
  readonly metadataOnly: true;
  readonly declarativeOnly: true;
}

export interface KnowledgeGovernanceFreezeBaseline {
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

export interface KnowledgeGovernanceFreezeCompatibilityDeclaration {
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

export interface KnowledgeGovernanceFreezeExtensionLock {
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

export interface KnowledgeGovernanceFreezeGuarantee {
  readonly id: string;
  readonly statement: string;
  readonly status: true;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
}

export interface KnowledgeGovernanceFreezePublicApiDeclaration {
  readonly apiId: string;
  readonly exportName: string;
  readonly description: string;
  readonly runtimeService: false;
  readonly mutableCollection: false;
  readonly deterministicOrder: number;
}

export interface KnowledgeGovernanceFreezeInventory {
  readonly inventoryId: string;
  readonly upstreamCertificationInventory: Readonly<Record<string, number | boolean | string>>;
  readonly frozenComponentCount: number;
  readonly baselineCount: number;
  readonly compatibilityCount: number;
  readonly extensionLockCount: number;
  readonly guaranteeCount: number;
  readonly publicApiCount: number;
  readonly totalEntryCount: number;
  readonly countingRule: string;
  readonly sourcedThroughCertification: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgeGovernanceFreezeSummary {
  readonly id: string;
  readonly version: string;
  readonly namespace: string;
  readonly status: KnowledgeGovernanceFreezeStatus;
  readonly freezeLock: "DKL-8-KNOWLEDGE-GOVERNANCE-LOCKED";
  readonly readiness: KnowledgeGovernanceFreezeReadiness;
  readonly upstreamDependency: string;
  readonly certificationOutcome: string;
  readonly frozenComponentCount: number;
  readonly baselineCount: number;
  readonly compatibilityCount: number;
  readonly extensionLockCount: number;
  readonly registryEntryCount: number;
  readonly modelKindCount: number;
  readonly validationRuleCount: number;
  readonly platformTotalEntryCount: number;
  readonly totalEntryCount: number;
  readonly runtimeBehavior: "None";
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
