export type GraphVisualizationValidationCategory =
  | "IdentityValidation" | "RegistryReferenceValidation" | "OwnershipValidation"
  | "LifecycleValidation" | "CapabilityValidation" | "BoundaryValidation"
  | "StructuralCompositionValidation" | "RelationshipValidation"
  | "GraphStructureValidation" | "NodeValidation" | "EdgeValidation"
  | "PresentationValidation" | "CompatibilityValidation" | "InventoryValidation"
  | "PublicSurfaceValidation" | "CanonicalInventoryRuleValidation";

export type GraphVisualizationValidationSeverity =
  | "Info" | "Notice" | "Warning" | "Error" | "Critical" | "Fatal";
export type GraphVisualizationValidationOutcome =
  | "Passed" | "PassedWithNotes" | "Warning" | "Failed" | "Blocked" | "NotApplicable";

export interface GraphVisualizationValidationRule {
  readonly id: `EVE-3:4/Rule/${string}`;
  readonly name: string;
  readonly description: string;
  readonly category: GraphVisualizationValidationCategory;
  readonly severity: GraphVisualizationValidationSeverity;
  readonly expectedOutcome: "Passed";
  readonly modelReference: "EVE-3:3/GraphVisualizationModel";
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface GraphVisualizationValidationGate {
  readonly id: `EVE-3:4/Gate/${string}`;
  readonly name: string;
  readonly outcome: "Passed";
  readonly status: "Declared";
  readonly modelReference: "EVE-3:3/GraphVisualizationModel";
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface GraphVisualizationValidationDiagnostic {
  readonly id: `EVE-3:4/Diagnostic/${string}`;
  readonly name: string;
  readonly severity: GraphVisualizationValidationSeverity;
  readonly outcome: GraphVisualizationValidationOutcome;
  readonly modelReference: "EVE-3:3/GraphVisualizationModel";
  readonly runtimeReporting: false;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}
