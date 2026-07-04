export type ExecutiveContextIdentity = Readonly<{
  contextId: string;
  contextVersion: "APP-CTX-1";
  appLayerId: "APP";
  builderVersion: "APP-CTX-1";
}>;

export type ExecutiveContextMetadata = Readonly<{
  source: string;
  description: string;
  tags: readonly string[];
  schemaVersion: "APP-CTX-1";
  appDomainPlatformVersion: string;
}>;

export type ExecutiveWorkspaceContext = Readonly<{
  workspaceId: string;
  workspaceName: string;
}>;

export type ExecutiveDomainContext = Readonly<{
  selectedDomainIds: readonly string[];
  appDomainPlatformVersion: string;
}>;

export type ExecutiveObjectContext = Readonly<{
  objectIds: readonly string[];
}>;

export type ExecutiveKpiContext = Readonly<{
  kpiIds: readonly string[];
}>;

export type ExecutiveRiskContext = Readonly<{
  riskIds: readonly string[];
}>;

export type ExecutiveScenarioContext = Readonly<{
  scenarioId: string;
  scenarioLabel: string;
}>;

export type ExecutiveTimelineContext = Readonly<{
  timelineId: string;
  periodLabel: string;
}>;

export type ExecutiveSimulationContext = Readonly<{
  simulationId: string;
  simulationLabel: string;
  metadataOnly: true;
}>;

export type ExecutiveIntentContext = Readonly<{
  intentId: string;
  intentLabel: string;
  description: string;
}>;

export type ExecutiveConstraintContext = Readonly<{
  constraintIds: readonly string[];
  notes: readonly string[];
}>;

export type ExecutiveGoalContext = Readonly<{
  goalId: string;
  goalLabel: string;
  description: string;
}>;

export type ExecutiveContextValidation = Readonly<{
  valid: boolean;
  issues: readonly Readonly<{
    code: string;
    message: string;
  }>[];
}>;

export type ExecutiveContext = Readonly<{
  identity: ExecutiveContextIdentity;
  metadata: ExecutiveContextMetadata;
  workspace: ExecutiveWorkspaceContext;
  domain: ExecutiveDomainContext;
  objects: ExecutiveObjectContext;
  kpis: ExecutiveKpiContext;
  risks: ExecutiveRiskContext;
  scenario: ExecutiveScenarioContext;
  timeline: ExecutiveTimelineContext;
  simulation: ExecutiveSimulationContext;
  intent: ExecutiveIntentContext;
  goal: ExecutiveGoalContext;
  constraints: ExecutiveConstraintContext;
  validation: ExecutiveContextValidation;
  immutable: true;
  metadataOnly: true;
}>;

export type ExecutiveContextInput = Partial<
  Omit<ExecutiveContext, "identity" | "metadata" | "validation" | "immutable" | "metadataOnly">
> &
  Readonly<{
    contextId?: string;
    source?: string;
    description?: string;
    tags?: readonly string[];
  }>;

export type ExecutiveContextManifest = Readonly<{
  contextVersion: "APP-CTX-1";
  builderVersion: "APP-CTX-1";
  consumedAppDomainPlatform: string;
  supportedAppVersion: "APP-CTX-1";
  contextSections: readonly string[];
  fingerprint: string;
  immutable: true;
  deterministic: true;
  metadataOnly: true;
}>;
