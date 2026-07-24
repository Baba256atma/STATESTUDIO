/**
 * NEX-1:1 — Product Vision & Strategy Foundation Types.
 *
 * Readonly vocabularies for product-reference metadata only.
 */

export type ProductFoundationStatus = "Foundation";
export type ProductFoundationReadiness = "ReadyForRegistry";
export type ProductFoundationStability = "Immutable";

export type ProductContractKey =
  | "Vision"
  | "Mission"
  | "Strategy"
  | "Goal"
  | "User"
  | "Value"
  | "Boundary"
  | "Lifecycle"
  | "Principle"
  | "Scope";

export interface ProductReferenceEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly immutable: true;
  readonly metadataOnly: true;
}

export interface ProductFoundationContract extends ProductReferenceEntry {
  readonly contractKey: ProductContractKey;
  readonly requiredFields: readonly string[];
  readonly runtimeBehavior: "None";
}

export interface ProductValidationDeclaration extends ProductReferenceEntry {
  readonly requirement: string;
  readonly declarativeOnly: true;
  readonly executesValidation: false;
}

export interface ProductFoundationIdentityDescriptor {
  readonly id: "NEX-1:1/ProductVisionStrategyFoundation";
  readonly name: "Nexora Product Vision & Strategy Foundation";
  readonly namespace: "nexora.nex.product-vision-strategy.foundation";
  readonly version: "1.0.0";
  readonly layer: "NEX";
  readonly phase: "NEX-1:1";
  readonly status: ProductFoundationStatus;
  readonly description: string;
  readonly owner: "Nexora Product";
  readonly stability: ProductFoundationStability;
  readonly readiness: ProductFoundationReadiness;
  readonly metadataOnly: true;
  readonly immutable: true;
}
