export type ExecutiveRequestIntentValidationId = `eng-2-validation-${string}`;
export type ExecutiveRequestIntentValidationCategory = "Foundation" | "Registry" | "Model" | "Ownership" | "Dependency" | "Namespace" | "Immutability" | "Public API";
export type ExecutiveRequestIntentValidationSeverity = "Critical" | "High" | "Medium" | "Low" | "Informational";
export type ExecutiveRequestIntentValidationStatus = "Defined" | "Satisfied" | "NotSatisfied" | "NotApplicable";

export interface ExecutiveRequestIntentValidationTarget {
  readonly phase: "ENG-2:1" | "ENG-2:2" | "ENG-2:3" | "ENG-2:4";
  readonly publicSurface: string;
  readonly artifact: string;
}

export interface ExecutiveRequestIntentValidationEvidence {
  readonly evidenceType: "PublicMetadata" | "OwnershipDeclaration" | "ArchitecturalContract";
  readonly reference: string;
  readonly publicArtifact: object | null;
}

export interface ExecutiveRequestIntentValidationResult {
  readonly status: ExecutiveRequestIntentValidationStatus;
  readonly description: string;
  readonly metadataOnly: true;
}

export interface ExecutiveRequestIntentValidationRule {
  readonly id: ExecutiveRequestIntentValidationId;
  readonly name: string;
  readonly category: ExecutiveRequestIntentValidationCategory;
  readonly severity: ExecutiveRequestIntentValidationSeverity;
  readonly description: string;
  readonly target: ExecutiveRequestIntentValidationTarget;
  readonly evidence: ExecutiveRequestIntentValidationEvidence;
  readonly result: ExecutiveRequestIntentValidationResult;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveRequestIntentValidationGroup {
  readonly id: ExecutiveRequestIntentValidationId;
  readonly name: string;
  readonly ownerPhase: "ENG-2:4";
  readonly targetPhase: "ENG-2:1" | "ENG-2:2" | "ENG-2:3" | "ENG-2:4";
  readonly namespace: "nexora.engine.executive.request-intent.validation";
  readonly rules: readonly ExecutiveRequestIntentValidationRule[];
  readonly status: "Defined";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveRequestIntentValidationSummary {
  readonly groupCount: 5;
  readonly ruleCount: number;
  readonly satisfiedRuleCount: number;
  readonly status: "Defined";
  readonly namespace: "nexora.engine.executive.request-intent.validation";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveRequestIntentValidationManifest {
  readonly id: "ENG-2:4";
  readonly name: "Executive Request & Intent Validation Manifest";
  readonly description: string;
  readonly version: "1.0.0";
  readonly phase: "ENG-2:4";
  readonly namespace: "nexora.engine.executive.request-intent.validation";
  readonly layer: "ExecutiveEngine";
  readonly validationGroups: readonly ExecutiveRequestIntentValidationGroup[];
  readonly validationRuleInventory: readonly ExecutiveRequestIntentValidationRule[];
  readonly dependencyReferences: readonly Readonly<{ phase: "ENG-2:1" | "ENG-2:2" | "ENG-2:3"; publicSurface: string; artifact: object }>[];
  readonly ownershipReferences: readonly string[];
  readonly publicApiReferences: readonly string[];
  readonly architecturalSummary: ExecutiveRequestIntentValidationSummary;
  readonly totalGroupCount: 5;
  readonly totalRuleCount: number;
  readonly validationStatus: "Defined";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
