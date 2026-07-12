export type ExecutiveRequestId = string;
export type ExecutiveIntentId = string;

export type ExecutiveRequestCategory =
  | "Analysis"
  | "Planning"
  | "Monitoring"
  | "DecisionSupport"
  | "Reporting"
  | "Navigation"
  | "Explanation"
  | "Recommendation"
  | "Simulation"
  | "Investigation";

export type ExecutiveRequestPriority = "Low" | "Normal" | "High" | "Critical";
export type ExecutiveRequestStatus = "Registered" | "Classified" | "Deferred" | "Archived";
export type ExecutiveRequestScope = "Personal" | "Team" | "Organization" | "Platform";
export type ExecutiveRequestSource = "User" | "Advisor" | "Platform" | "System";

export interface ExecutiveRequestClassification {
  readonly category: ExecutiveRequestCategory;
  readonly priority: ExecutiveRequestPriority;
  readonly scope: ExecutiveRequestScope;
  readonly status: ExecutiveRequestStatus;
  readonly source: ExecutiveRequestSource;
  readonly metadataOnly: true;
}

export interface ExecutiveRequestMetadata {
  readonly requestId: ExecutiveRequestId;
  readonly intentId: ExecutiveIntentId;
  readonly contextReference: string | null;
  readonly classification: ExecutiveRequestClassification;
  readonly namespace: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveRequestIntentContractDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly responsibility: "Request" | "Intent" | "Classification" | "Priority" | "Scope" | "Context" | "Metadata";
  readonly status: "Defined";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveRequestIntentRegistryEntry {
  readonly id: string;
  readonly category: ExecutiveRequestCategory;
  readonly name: string;
  readonly description: string;
  readonly status: "Approved";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveRequestIntentMetadataDescriptor {
  readonly moduleId: "ENG-2:1";
  readonly version: "1.0.0";
  readonly phase: "Executive Request & Intent Foundation";
  readonly layer: "ExecutiveEngine";
  readonly namespace: "nexora.engine.executive.request-intent.foundation";
  readonly description: string;
  readonly stability: "Foundation";
  readonly releaseStatus: "Draft";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveRequestFoundation {
  readonly contracts: readonly ExecutiveRequestIntentContractDescriptor[];
  readonly registry: readonly ExecutiveRequestIntentRegistryEntry[];
  readonly metadata: ExecutiveRequestIntentMetadataDescriptor;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
