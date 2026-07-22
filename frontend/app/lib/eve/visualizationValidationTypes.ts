export type VisualizationValidationCategory =
  | "IdentityIntegrity"
  | "RegistryReferenceIntegrity"
  | "ModelCompleteness"
  | "RelationshipConsistency"
  | "OwnershipCorrectness"
  | "LifecycleCompliance"
  | "CapabilityIntegrity"
  | "ExtensionCompatibility"
  | "InventoryConsistency"
  | "NamespaceIntegrity"
  | "PublicExportConsistency"
  | "DependencyCompliance"
  | "ArchitecturalBoundaryEnforcement"
  | "CanonicalInventoryRuleCompliance";

export type VisualizationValidationSeverity = "Information" | "Warning" | "Error";
export type VisualizationValidationResult = "Compliant" | "NonCompliant" | "NotEvaluated";

export interface VisualizationValidationRule {
  readonly id: `EVE-1:4/Rule/${string}`;
  readonly name: string;
  readonly description: string;
  readonly category: VisualizationValidationCategory;
  readonly severity: VisualizationValidationSeverity;
  readonly expectedResult: "Compliant";
  readonly modelReference: string;
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationValidationGate {
  readonly id: `EVE-1:4/Gate/${string}`;
  readonly name: string;
  readonly category: VisualizationValidationCategory;
  readonly result: "Compliant";
  readonly status: "Declared";
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationValidationDiagnostic {
  readonly id: `EVE-1:4/Diagnostic/${string}`;
  readonly name: string;
  readonly severity: VisualizationValidationSeverity;
  readonly resultType: VisualizationValidationResult;
  readonly runtimeDiagnostic: false;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

