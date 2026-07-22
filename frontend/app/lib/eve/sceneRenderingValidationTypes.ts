export type SceneRenderingValidationCategory =
  | "IdentityIntegrity"
  | "RegistryReferenceIntegrity"
  | "ModelCompleteness"
  | "RelationshipIntegrity"
  | "OwnershipConsistency"
  | "BoundaryCompliance"
  | "LifecycleConsistency"
  | "CapabilityConsistency"
  | "ExtensionCompatibility"
  | "InventoryConsistency"
  | "NamespaceIntegrity"
  | "PublicExportConsistency"
  | "DependencyCompliance"
  | "CanonicalInventoryRuleCompliance";

export type SceneRenderingValidationSeverity = "Information" | "Warning" | "Error";
export type SceneRenderingValidationOutcome = "Compliant" | "NonCompliant" | "NotEvaluated";

export interface SceneRenderingValidationRule {
  readonly id: `EVE-2:4/Rule/${string}`;
  readonly name: string;
  readonly description: string;
  readonly category: SceneRenderingValidationCategory;
  readonly severity: SceneRenderingValidationSeverity;
  readonly expectedOutcome: "Compliant";
  readonly modelReference: "EVE-2:3/SceneRenderingModel";
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface SceneRenderingValidationGate {
  readonly id: `EVE-2:4/Gate/${string}`;
  readonly name: string;
  readonly outcome: "Compliant";
  readonly status: "Declared";
  readonly modelReference: "EVE-2:3/SceneRenderingModel";
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface SceneRenderingValidationDiagnostic {
  readonly id: `EVE-2:4/Diagnostic/${string}`;
  readonly name: string;
  readonly severity: SceneRenderingValidationSeverity;
  readonly outcome: SceneRenderingValidationOutcome;
  readonly failureCategory: string;
  readonly recommendationCategory: string;
  readonly runtimeReporting: false;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}
