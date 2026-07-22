export type DirectorValidationCategoryName =
  | "Identity Validation"
  | "Registry Validation"
  | "Model Validation"
  | "Relationship Validation"
  | "Dependency Validation"
  | "Boundary Validation"
  | "Namespace Validation"
  | "Export Validation"
  | "Lifecycle Validation"
  | "Readiness Validation";

export interface DirectorValidationCategory {
  readonly id: `DIRECTOR-1:4/Category/${string}`;
  readonly name: DirectorValidationCategoryName;
  readonly description: string;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DirectorValidationRule {
  readonly id: `DIRECTOR-1:4/Rule/${string}`;
  readonly name: string;
  readonly description: string;
  readonly category: DirectorValidationCategoryName;
  readonly requirement: "Required" | "Forbidden";
  readonly deterministicOrder: number;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DirectorValidationPolicy {
  readonly id: `DIRECTOR-1:4/Policy/${string}`;
  readonly name: string;
  readonly description: string;
  readonly deterministicOrder: number;
  readonly enforcement: "DescriptiveOnly";
  readonly metadataOnly: true;
  readonly immutable: true;
}

