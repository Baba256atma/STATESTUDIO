/**
 * NEA-2:4 — Channel Connectors Validation Types.
 *
 * Readonly contracts for declarative Channel Connector validation architecture.
 * Metadata-only. No validation engine.
 *
 * Ownership: owned exclusively by NEA-2:4.
 */

/** Validation status for NEA-2:4. */
export type ChannelConnectorValidationStatus = "Validation";

/** Immediate downstream readiness — Manifest only. */
export type ChannelConnectorValidationReadiness = "ReadyForManifest";

/** Validation category identifiers. */
export type ChannelConnectorValidationCategoryId =
  | "Identity"
  | "Definition"
  | "Family"
  | "Type"
  | "Protocol"
  | "Direction"
  | "Capability"
  | "Authentication"
  | "Health"
  | "Status"
  | "Event"
  | "Payload"
  | "Policy"
  | "Endpoint"
  | "Session"
  | "Metadata"
  | "Configuration"
  | "Diagnostics"
  | "Result"
  | "Summary"
  | "CrossModel"
  | "PlatformIntegrity";

/** Target model kinds aligned to NEA-2:3 domain models. */
export type ChannelConnectorValidationTarget =
  | "ConnectorIdentity"
  | "ConnectorDefinition"
  | "ConnectorFamily"
  | "ConnectorType"
  | "ConnectorProtocol"
  | "ConnectorDirection"
  | "ConnectorCapability"
  | "ConnectorAuthentication"
  | "ConnectorHealth"
  | "ConnectorStatus"
  | "ConnectorEvent"
  | "ConnectorPayload"
  | "ConnectorPolicy"
  | "ConnectorEndpoint"
  | "ConnectorSession"
  | "ConnectorMetadata"
  | "ConnectorConfiguration"
  | "ConnectorDiagnostics"
  | "ConnectorResult"
  | "ConnectorSummary"
  | "CrossModel"
  | "Platform";

/** Declarative severity levels — no runtime enforcement. */
export type ChannelConnectorValidationSeverity =
  | "Error"
  | "Warning"
  | "Info";

/** Declarative validation rule. */
export interface ChannelConnectorValidationRule {
  readonly ruleId: string;
  readonly ruleName: string;
  readonly categoryId: ChannelConnectorValidationCategoryId;
  readonly targetModelKind: ChannelConnectorValidationTarget;
  readonly description: string;
  readonly severity: ChannelConnectorValidationSeverity;
  readonly modelReference: string;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Validation category descriptor. */
export interface ChannelConnectorValidationCategory {
  readonly categoryId: ChannelConnectorValidationCategoryId;
  readonly categoryName: string;
  readonly description: string;
  readonly targetModelKind: ChannelConnectorValidationTarget;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Validation relationship between categories. */
export interface ChannelConnectorValidationRelationship {
  readonly relationshipId: string;
  readonly relationshipName: string;
  readonly sourceCategoryId: ChannelConnectorValidationCategoryId;
  readonly targetCategoryId: ChannelConnectorValidationCategoryId;
  readonly description: string;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Declarative validation policy. */
export interface ChannelConnectorValidationPolicy {
  readonly policyId: string;
  readonly policyName: string;
  readonly statement: string;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical validation identity. */
export interface ChannelConnectorValidationIdentity {
  readonly validationId: string;
  readonly validationName: string;
  readonly validationVersion: string;
  readonly validationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-2:4";
  readonly stage: "Validation";
  readonly sourcePhase: "NEA-2:4";
  readonly owner: string;
  readonly status: ChannelConnectorValidationStatus;
  readonly readiness: ChannelConnectorValidationReadiness;
  readonly modelId: string;
  readonly modelVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic validation summary. */
export interface ChannelConnectorValidationSummary {
  readonly validationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-2:4";
  readonly status: ChannelConnectorValidationStatus;
  readonly readiness: ChannelConnectorValidationReadiness;
  readonly modelId: string;
  readonly categoryCount: number;
  readonly ruleCount: number;
  readonly relationshipCount: number;
  readonly policyCount: number;
  readonly ownershipCount: number;
  readonly nonOwnershipCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly publicExportCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
