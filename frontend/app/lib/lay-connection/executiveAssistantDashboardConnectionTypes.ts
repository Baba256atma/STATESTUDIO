export type ExecutiveAssistantDashboardCategory =
  | "Executive Summary"
  | "Operational Dashboard"
  | "Risk Dashboard"
  | "KPI Dashboard"
  | "Timeline Dashboard"
  | "Scenario Dashboard"
  | "War Room"
  | "Assistant Conversation"
  | "Assistant Explanation"
  | "Assistant Recommendation"
  | "Shared Executive Context"
  | "Executive Awareness";

export type ExecutiveAssistantDashboardMetadata = Readonly<{
  readonly apiId: string;
  readonly phaseId: "LAY-CONN-9";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
  readonly tags: readonly string[];
}>;

export type ExecutiveAssistantDashboardIdentity = Readonly<{
  readonly connectionId: string;
  readonly name: string;
  readonly category: ExecutiveAssistantDashboardCategory;
  readonly apiType: string;
}>;

export type ExecutiveAssistantDashboardContext = Readonly<{
  readonly contextId: string;
  readonly assistantContextId: string;
  readonly dashboardContextId: string;
  readonly sharedExecutiveContextId: string;
  readonly metadata: ExecutiveAssistantDashboardMetadata;
}>;

export type ExecutiveAssistantDashboardReference = Readonly<{
  readonly referenceId: string;
  readonly referenceType:
    | "dashboard-response"
    | "assistant-response"
    | "explanation"
    | "recommendation"
    | "awareness"
    | "executive-object"
    | "executive-kpi"
    | "executive-risk"
    | "executive-timeline"
    | "executive-scenario";
  readonly sourceId: string;
  readonly metadata: ExecutiveAssistantDashboardMetadata;
}>;

export type ExecutiveAssistantDashboardRequest = Readonly<{
  readonly requestId: string;
  readonly requestType: "dashboard-request" | "assistant-request";
  readonly category: ExecutiveAssistantDashboardCategory;
  readonly apiType: string;
  readonly references: readonly ExecutiveAssistantDashboardReference[];
  readonly metadata: ExecutiveAssistantDashboardMetadata;
}>;

export type ExecutiveAssistantDashboardResponse = Readonly<{
  readonly responseId: string;
  readonly responseReferenceId: string;
  readonly metadata: ExecutiveAssistantDashboardMetadata;
}>;

export type ExecutiveAssistantDashboardProvider = Readonly<{
  readonly providerId: string;
  readonly platformId: string;
  readonly certified: boolean;
  readonly futureCompatible: boolean;
}>;

export type ExecutiveAssistantDashboardConsumer = Readonly<{
  readonly consumerId: string;
  readonly name: string;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveAssistantDashboardDependency = Readonly<{
  readonly dependencyId: string;
  readonly required: boolean;
  readonly mode: "certified" | "future-compatible";
}>;

export type ExecutiveAssistantDashboardCompatibility = Readonly<{
  readonly platformId: string;
  readonly compatible: boolean;
  readonly required: boolean;
  readonly mode: "certified" | "future-compatible";
  readonly notes: readonly string[];
}>;

export type ExecutiveAssistantDashboardPolicy = Readonly<{
  readonly policyId: string;
  readonly assistantRuntimeAllowed: boolean;
  readonly dashboardRuntimeAllowed: boolean;
  readonly messageTransportAllowed: boolean;
  readonly panelNavigationAllowed: boolean;
  readonly coordinationAllowed: boolean;
  readonly stateChangeAllowed: boolean;
  readonly extensionMode: "additive-only";
}>;

export type ExecutiveAssistantDashboardConnectionApi = Readonly<{
  readonly apiId: string;
  readonly name: string;
  readonly identity: ExecutiveAssistantDashboardIdentity;
  readonly context: ExecutiveAssistantDashboardContext;
  readonly requests: readonly ExecutiveAssistantDashboardRequest[];
  readonly responses: readonly ExecutiveAssistantDashboardResponse[];
  readonly references: readonly ExecutiveAssistantDashboardReference[];
  readonly policy: ExecutiveAssistantDashboardPolicy;
  readonly metadata: ExecutiveAssistantDashboardMetadata;
}>;

export type ExecutiveAssistantDashboardRegistry = Readonly<{
  readonly apiId: string;
  readonly providers: readonly ExecutiveAssistantDashboardProvider[];
  readonly consumers: readonly ExecutiveAssistantDashboardConsumer[];
  readonly categories: readonly ExecutiveAssistantDashboardCategory[];
  readonly apiTypes: readonly string[];
  readonly dependencies: readonly ExecutiveAssistantDashboardDependency[];
  readonly compatibilityMatrix: readonly ExecutiveAssistantDashboardCompatibility[];
  readonly versionMetadata: ExecutiveAssistantDashboardMetadata;
  readonly extensionPolicy: ExecutiveAssistantDashboardPolicy;
  readonly publicApis: readonly string[];
}>;

export type ExecutiveAssistantDashboardManifest = Readonly<{
  readonly platformId: string;
  readonly platformVersion: string;
  readonly supportedCategories: readonly ExecutiveAssistantDashboardCategory[];
  readonly supportedApiTypes: readonly string[];
  readonly registeredProviders: readonly ExecutiveAssistantDashboardProvider[];
  readonly registeredConsumers: readonly ExecutiveAssistantDashboardConsumer[];
  readonly dependencies: readonly ExecutiveAssistantDashboardDependency[];
  readonly compatibility: readonly ExecutiveAssistantDashboardCompatibility[];
  readonly extensionPolicy: ExecutiveAssistantDashboardPolicy;
  readonly releaseMetadata: ExecutiveAssistantDashboardMetadata;
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveAssistantDashboardValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveAssistantDashboardCertification = Readonly<{
  readonly status: "PASS" | "FAIL";
  readonly validation: ExecutiveAssistantDashboardValidation;
  readonly certifiedApiId: string;
}>;

export type ExecutiveAssistantDashboardResult<T> = Readonly<{
  readonly ok: boolean;
  readonly value: T;
  readonly validation: ExecutiveAssistantDashboardValidation;
}>;
