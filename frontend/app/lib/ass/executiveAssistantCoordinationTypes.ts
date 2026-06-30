/**
 * ASS-8 — Executive Assistant Coordination Manifest domain types.
 */

import type {
  ASS_CERTIFIED_PHASE_KEYS,
  ASS_COORDINATION_REGISTRY_KEYS,
  ASS_COORDINATION_VERSION,
  ASS_PHASE_REFERENCE_KEYS,
} from "./executiveAssistantCoordinationContracts.ts";

export type ExecutiveAssistantCertifiedPhaseKey = (typeof ASS_CERTIFIED_PHASE_KEYS)[number];
export type ExecutiveAssistantPhaseReferenceKey = (typeof ASS_PHASE_REFERENCE_KEYS)[number];
export type ExecutiveAssistantCoordinationRegistryKey = (typeof ASS_COORDINATION_REGISTRY_KEYS)[number];

export type ExecutiveAssistantCoordinationIdentityRecord = Readonly<{
  coordinationId: string;
  coordinationKey: string;
  platformVersion: typeof ASS_COORDINATION_VERSION;
  certifiedPhaseCount: number;
  declarativeOnly: true;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantCertifiedPhaseRecord = Readonly<{
  phaseId: string;
  phaseKey: ExecutiveAssistantCertifiedPhaseKey;
  label: string;
  buildApi: string;
  dependencyKey: ExecutiveAssistantCertifiedPhaseKey | null;
  contractVersion: ExecutiveAssistantCertifiedPhaseKey;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantPhaseReferenceRecord = Readonly<{
  referenceId: string;
  referenceKey: ExecutiveAssistantPhaseReferenceKey;
  phaseKey: ExecutiveAssistantCertifiedPhaseKey;
  manifestId: string;
  platformId: string;
  contractVersion: ExecutiveAssistantCertifiedPhaseKey;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantCompatibilityMatrixEntry = Readonly<{
  compatibilityId: string;
  fromPhaseKey: ExecutiveAssistantCertifiedPhaseKey;
  toPhaseKey: ExecutiveAssistantCertifiedPhaseKey;
  compatible: true;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantPlatformCoordinationManifestRecord = Readonly<{
  manifestId: string;
  platformId: typeof import("./executiveAssistantCoordinationContracts.ts").ASS_COORDINATION_PLATFORM_ID;
  version: typeof ASS_COORDINATION_VERSION;
  title: typeof import("./executiveAssistantCoordinationContracts.ts").ASS_COORDINATION_PLATFORM_NAME;
  certifiedPhaseCount: number;
  compatibilityEntryCount: number;
  validationResult: "valid" | "invalid";
  compatibility: readonly string[];
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveAssistantCoordinationRegistryBundle = Readonly<{
  assistantCoordinationIdentityRegistry: readonly ExecutiveAssistantCoordinationIdentityRecord[];
  coordinationIdentityCount: number;
  certifiedAssPhaseRegistry: readonly ExecutiveAssistantCertifiedPhaseRecord[];
  certifiedPhaseCount: number;
  conversationContractReferenceRegistry: readonly ExecutiveAssistantPhaseReferenceRecord[];
  conversationContractReferenceCount: number;
  stateArchitectureReferenceRegistry: readonly ExecutiveAssistantPhaseReferenceRecord[];
  stateArchitectureReferenceCount: number;
  routingArchitectureReferenceRegistry: readonly ExecutiveAssistantPhaseReferenceRecord[];
  routingArchitectureReferenceCount: number;
  intentContractReferenceRegistry: readonly ExecutiveAssistantPhaseReferenceRecord[];
  intentContractReferenceCount: number;
  responseContractReferenceRegistry: readonly ExecutiveAssistantPhaseReferenceRecord[];
  responseContractReferenceCount: number;
  clarificationContractReferenceRegistry: readonly ExecutiveAssistantPhaseReferenceRecord[];
  clarificationContractReferenceCount: number;
  crossPhaseCompatibilityMatrixRegistry: readonly ExecutiveAssistantCompatibilityMatrixEntry[];
  compatibilityEntryCount: number;
  platformCoordinationManifestRegistry: readonly ExecutiveAssistantPlatformCoordinationManifestRecord[];
  platformCoordinationManifestCount: number;
  readOnly: true;
}>;

export type ExecutiveAssistantCoordinationManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./executiveAssistantCoordinationContracts.ts").ASS_COORDINATION_PLATFORM_ID;
  version: typeof ASS_COORDINATION_VERSION;
  title: typeof import("./executiveAssistantCoordinationContracts.ts").ASS_COORDINATION_PLATFORM_NAME;
  goal: string;
  registryKeys: readonly string[];
  certifiedPhaseCount: number;
  compatibilityEntryCount: number;
  validationResult: "valid" | "invalid";
  compatibility: readonly string[];
  readOnly: true;
}>;

export type ExecutiveAssistantCoordinationValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveAssistantCoordinationValidationReport = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveAssistantCoordinationValidationIssue[];
  readOnly: true;
}>;

export type ExecutiveAssistantCoordinationLayerState = Readonly<{
  contractVersion: typeof ASS_COORDINATION_VERSION;
  clarificationDependency: typeof import("./executiveAssistantCoordinationContracts.ts").ASS_COORDINATION_DEPENDENCY;
  initialized: boolean;
  registry: ExecutiveAssistantCoordinationRegistryBundle;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveAssistantCoordinationBuildResult = Readonly<{
  success: boolean;
  reason: string;
  data: ExecutiveAssistantCoordinationLayerState | null;
  readOnly: true;
}>;
