export type ExecutiveIntentId = string;
export type ExecutiveIntentType = "Analysis" | "Recommendation" | "Planning" | "Prediction" | "Simulation" | "Monitoring" | "Explanation" | "Comparison" | "Investigation" | "Optimization" | "Forecast" | "Validation" | "DecisionSupport" | "Reporting" | "GeneralInquiry";
export type ExecutiveRequestDomain = "Strategy" | "Finance" | "Revenue" | "Operations" | "Projects" | "Resources" | "Organization" | "Risk" | "Performance" | "KPI" | "OKR" | "Workflow" | "Scheduling" | "Automation" | "BusinessHealth" | "Reporting" | "General";
export type ExecutiveCapability = "Read" | "Analyze" | "Compare" | "Summarize" | "Explain" | "Predict" | "Recommend" | "Optimize" | "Plan" | "Validate" | "Monitor" | "Simulate" | "Prioritize";
export type ExecutiveOutputExpectation = "Summary" | "ExecutiveReport" | "ActionPlan" | "RecommendationList" | "RiskAssessment" | "ComparisonTable" | "DecisionBrief" | "ForecastReport" | "Explanation" | "Dashboard";
export type ExecutiveResolutionConfidence = "Unspecified" | "Low" | "Medium" | "High";
export type ExecutiveIntentStatus = "Received" | "Normalized" | "Classified" | "Resolved" | "Validated" | "Approved" | "Released";
export type ExecutiveIntentPriority = "Critical" | "High" | "Normal" | "Low";
export type ExecutiveIntentScope = "User" | "Workspace" | "Project" | "Organization" | "Platform";
export type ExecutiveIntentLifecycleStage = ExecutiveIntentStatus;

export interface ExecutiveGoal {
  readonly id: string;
  readonly name: string;
  readonly description: string;
}

export interface ExecutiveObjective {
  readonly id: string;
  readonly goalReference: string;
  readonly description: string;
  readonly metadataOnly: true;
}

export interface ExecutiveIntentClassification {
  readonly intentType: ExecutiveIntentType;
  readonly domain: ExecutiveRequestDomain;
  readonly capabilities: readonly ExecutiveCapability[];
  readonly outputExpectation: ExecutiveOutputExpectation;
  readonly confidence: ExecutiveResolutionConfidence;
}

export interface ExecutiveIntentMetadata {
  readonly version: "1.0.0";
  readonly namespace: "nexora.engine.executive.intent-resolution.foundation";
  readonly owner: "ENG-3";
  readonly priority: ExecutiveIntentPriority;
  readonly scope: ExecutiveIntentScope;
  readonly lifecycleStage: ExecutiveIntentLifecycleStage;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveIntentDefinition {
  readonly id: ExecutiveIntentId;
  readonly name: string;
  readonly description: string;
  readonly classification: ExecutiveIntentClassification;
  readonly metadata: ExecutiveIntentMetadata;
}

export interface ExecutiveIntentRegistryEntry {
  readonly id: `eng-3-${string}`;
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly status: "Approved";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveIntentRegistry {
  readonly intentTypes: readonly ExecutiveIntentRegistryEntry[];
  readonly goals: readonly ExecutiveIntentRegistryEntry[];
  readonly domains: readonly ExecutiveIntentRegistryEntry[];
  readonly capabilities: readonly ExecutiveIntentRegistryEntry[];
  readonly outputExpectations: readonly ExecutiveIntentRegistryEntry[];
  readonly lifecycleStages: readonly ExecutiveIntentRegistryEntry[];
  readonly priorities: readonly ExecutiveIntentRegistryEntry[];
  readonly confidenceLevels: readonly ExecutiveIntentRegistryEntry[];
  readonly statuses: readonly ExecutiveIntentRegistryEntry[];
}

export interface ExecutiveIntentResolutionContract {
  readonly id: `eng-3-contract-${string}`;
  readonly name: string;
  readonly description: string;
  readonly status: "Defined";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveIntentResolutionMetadataDescriptor {
  readonly platformName: "Executive Intent Resolution Platform";
  readonly platformId: "ENG-3:1";
  readonly platformVersion: "1.0.0";
  readonly foundationVersion: "1.0.0";
  readonly architectureVersion: "1.0.0";
  readonly layer: "ExecutiveEngine";
  readonly module: "IntentResolutionFoundation";
  readonly owner: "ENG-3";
  readonly status: "FoundationDefined";
  readonly stability: "Draft";
  readonly certification: "Uncertified";
  readonly visibility: "Public";
  readonly namespace: "nexora.engine.executive.intent-resolution.foundation";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveIntentFoundation {
  readonly contracts: readonly ExecutiveIntentResolutionContract[];
  readonly registry: ExecutiveIntentRegistry;
  readonly metadata: ExecutiveIntentResolutionMetadataDescriptor;
  readonly types: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
