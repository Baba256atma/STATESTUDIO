export type ExecutiveReasoningFreezeOwner = "ENG-6";
export type ExecutiveReasoningFreezeVersion = "1.0.0";
export type ExecutiveReasoningFreezePhase = "ENG-6:8";
export type ExecutiveReasoningFreezeNamespace =
  "nexora.engine.executive.reasoning.freeze";

export type ExecutiveReasoningFreezeStatus = "FROZEN" | "PENDING";
export type ExecutiveReasoningFreezeCertificationStatus = "CERTIFIED";
export type ExecutiveReasoningFreezeReleaseStatus = "FROZEN";
export type ExecutiveReasoningFreezeReadiness = "ReadyForPublicIndex" | "Blocked";
export type ExecutiveReasoningPublicApiStability = "Stable" | "Frozen" | "StableAndFrozen";

export type ExecutiveReasoningCompatibilityKind =
  | "Backward"
  | "Forward"
  | "Namespace"
  | "Platform"
  | "Model"
  | "Registry"
  | "Certification"
  | "PublicApi";

export type ExecutiveReasoningCompatibilityLevel =
  | "Compatible"
  | "Stable"
  | "ForwardCompatible"
  | "FrozenCompatible";
