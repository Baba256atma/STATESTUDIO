export const EXECUTIVE_REASONING_CONTRACT_VERSION = "APP-REASON-1" as const;

export type ExecutiveReasoningInput = Readonly<{
  inputId: string;
  label: string;
  description: string;
  required: boolean;
  contextSection: string;
}>;

export type ExecutiveReasoningOutput = Readonly<{
  outputId: string;
  label: string;
  description: string;
  metadataOnly: true;
}>;

export type ExecutiveReasoningEvidence = Readonly<{
  evidenceId: string;
  label: string;
  description: string;
  required: boolean;
}>;

export type ExecutiveReasoningAssumption = Readonly<{
  assumptionId: string;
  label: string;
  description: string;
  uncertaintyImpact: "low" | "medium" | "high";
}>;

export type ExecutiveReasoningConstraint = Readonly<{
  constraintId: string;
  label: string;
  description: string;
  severity: "info" | "warning" | "blocking";
}>;

export type ExecutiveReasoningConfidence = Readonly<{
  required: boolean;
  evidenceRequired: boolean;
  assumptionRequired: boolean;
  explanation: string;
}>;

export type ExecutiveReasoningTrace = Readonly<{
  required: boolean;
  inputIds: readonly string[];
  outputIds: readonly string[];
  evidenceIds: readonly string[];
  assumptionIds: readonly string[];
  constraintIds: readonly string[];
}>;

export type ExecutiveReasoningMetadata = Readonly<{
  source: string;
  description: string;
  tags: readonly string[];
  contextPlatformVersion: string;
  metadataOnly: true;
}>;

export type ExecutiveReasoningContract = Readonly<{
  contractId: string;
  label: string;
  description: string;
  inputs: readonly ExecutiveReasoningInput[];
  outputs: readonly ExecutiveReasoningOutput[];
  evidence: readonly ExecutiveReasoningEvidence[];
  assumptions: readonly ExecutiveReasoningAssumption[];
  constraints: readonly ExecutiveReasoningConstraint[];
  confidence: ExecutiveReasoningConfidence;
  trace: ExecutiveReasoningTrace;
  metadata: ExecutiveReasoningMetadata;
}>;

export type ExecutiveReasoningPackage = Readonly<{
  packageId: string;
  packageName: string;
  contractVersion: typeof EXECUTIVE_REASONING_CONTRACT_VERSION;
  version: string;
  description: string;
  contracts: readonly ExecutiveReasoningContract[];
  metadata: ExecutiveReasoningMetadata;
}>;

export type RegisteredExecutiveReasoningPackage = Readonly<{
  package: ExecutiveReasoningPackage;
  registrationOrder: number;
}>;

export type ExecutiveReasoningRegistry = Readonly<{
  registryId: "executive-reasoning-registry";
  contractVersion: typeof EXECUTIVE_REASONING_CONTRACT_VERSION;
  frozen: boolean;
  packages: readonly RegisteredExecutiveReasoningPackage[];
  byPackageId: Readonly<Record<string, RegisteredExecutiveReasoningPackage>>;
  byContractId: Readonly<Record<string, RegisteredExecutiveReasoningPackage>>;
}>;

export type ExecutiveReasoningValidation = Readonly<{
  valid: boolean;
  issues: readonly Readonly<{
    code: string;
    message: string;
    field: string;
  }>[];
}>;

export type ExecutiveReasoningRegistryMutationResult = Readonly<{
  success: boolean;
  registry: ExecutiveReasoningRegistry;
  reasoningPackage: RegisteredExecutiveReasoningPackage | null;
  validation: ExecutiveReasoningValidation;
}>;

export type ExecutiveReasoningManifest = Readonly<{
  platformVersion: "APP-REASON-1";
  consumedExecutiveContextPlatform: string;
  packageCount: number;
  contractCount: number;
  supportedContractVersion: typeof EXECUTIVE_REASONING_CONTRACT_VERSION;
  registryFrozen: boolean;
  registryMetadata: Readonly<{
    registryId: string;
    metadataOnly: true;
  }>;
  fingerprint: string;
  immutable: true;
  deterministic: true;
  metadataOnly: true;
}>;
