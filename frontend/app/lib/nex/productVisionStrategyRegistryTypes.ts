/**
 * NEX-1:2 — Vision & Product Strategy Registry Types.
 *
 * Readonly product-reference vocabularies. Metadata only.
 */

export type ProductRegistryStatus = "Registry";
export type ProductRegistryReadiness = "ReadyForModel";
export type ProductRegistryEntryStatus = "Registered";

export type ProductRegistryCategory =
  | "Vision"
  | "Mission"
  | "Principle"
  | "Value"
  | "Goal"
  | "StrategicObjective"
  | "Scope"
  | "Boundary"
  | "TargetUser"
  | "Stakeholder"
  | "SuccessMetric"
  | "Lifecycle"
  | "StrategicTheme"
  | "ProductCapability"
  | "ProductConstraint"
  | "ProductAssumption";

export interface ProductRegistryEntry {
  readonly identifier: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: ProductRegistryCategory;
  readonly status: ProductRegistryEntryStatus;
  readonly owner: "Nexora Product";
  readonly tags: readonly string[];
  readonly version: "1.0.0";
  readonly sourceIdentifier: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ProductRegistryRelationship {
  readonly identifier: string;
  readonly sourceIdentifier: string;
  readonly relationship: "supports" | "drives" | "measuredBy" | "governs";
  readonly targetIdentifier: string;
  readonly description: string;
  readonly status: "Declared";
  readonly version: "1.0.0";
  readonly runtimeRelationship: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ProductRegistryValidationDeclaration {
  readonly identifier: string;
  readonly canonicalName: string;
  readonly requirement: string;
  readonly status: "Declared";
  readonly version: "1.0.0";
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
