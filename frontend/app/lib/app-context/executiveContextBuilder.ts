import { AppDomainPlatformFreeze } from "../app-dom/appDomainPlatformFreezeIndex.ts";
import type {
  ExecutiveConstraintContext,
  ExecutiveContext,
  ExecutiveContextIdentity,
  ExecutiveContextInput,
  ExecutiveContextValidation,
  ExecutiveDomainContext,
  ExecutiveGoalContext,
  ExecutiveIntentContext,
  ExecutiveKpiContext,
  ExecutiveObjectContext,
  ExecutiveRiskContext,
  ExecutiveScenarioContext,
  ExecutiveSimulationContext,
  ExecutiveTimelineContext,
  ExecutiveWorkspaceContext,
} from "./executiveContextTypes.ts";

function validationResult(issues: ExecutiveContextValidation["issues"]): ExecutiveContextValidation {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

function freezeStrings(values: readonly string[] = Object.freeze([])): readonly string[] {
  return Object.freeze([...values]);
}

function appDomainVersion(): string {
  return "APP-DOM-4";
}

function appDomainFreezePasses(): boolean {
  return (
    AppDomainPlatformFreeze.listAppDomainPlatformPhases().some((phase) => phase.phaseId === "APP-DOM-4" && phase.status === "frozen") &&
    AppDomainPlatformFreeze.listAppDomainPlatformPublicApis().length > 0 &&
    AppDomainPlatformFreeze.isAppDomainPlatformCompatibilityMatrixValid()
  );
}

function defaultWorkspace(): ExecutiveWorkspaceContext {
  return Object.freeze({ workspaceId: "workspace.default", workspaceName: "Default Workspace" });
}

function defaultDomain(): ExecutiveDomainContext {
  return Object.freeze({ selectedDomainIds: Object.freeze([]), appDomainPlatformVersion: appDomainVersion() });
}

function defaultObjects(): ExecutiveObjectContext {
  return Object.freeze({ objectIds: Object.freeze([]) });
}

function defaultKpis(): ExecutiveKpiContext {
  return Object.freeze({ kpiIds: Object.freeze([]) });
}

function defaultRisks(): ExecutiveRiskContext {
  return Object.freeze({ riskIds: Object.freeze([]) });
}

function defaultScenario(): ExecutiveScenarioContext {
  return Object.freeze({ scenarioId: "scenario.none", scenarioLabel: "No Scenario Selected" });
}

function defaultTimeline(): ExecutiveTimelineContext {
  return Object.freeze({ timelineId: "timeline.none", periodLabel: "No Timeline Selected" });
}

function defaultSimulation(): ExecutiveSimulationContext {
  return Object.freeze({ simulationId: "simulation.none", simulationLabel: "No Simulation Selected", metadataOnly: true });
}

function defaultIntent(): ExecutiveIntentContext {
  return Object.freeze({ intentId: "intent.none", intentLabel: "No Intent Selected", description: "No executive intent metadata provided." });
}

function defaultGoal(): ExecutiveGoalContext {
  return Object.freeze({ goalId: "goal.none", goalLabel: "No Goal Selected", description: "No executive goal metadata provided." });
}

function defaultConstraints(): ExecutiveConstraintContext {
  return Object.freeze({ constraintIds: Object.freeze([]), notes: Object.freeze([]) });
}

function buildContext(input: ExecutiveContextInput = Object.freeze({})): ExecutiveContext {
  const domainInput = input.domain ?? defaultDomain();
  const context = Object.freeze({
    identity: Object.freeze({
      contextId: input.contextId ?? "executive-context.default",
      contextVersion: "APP-CTX-1" as const,
      appLayerId: "APP" as const,
      builderVersion: "APP-CTX-1" as const,
    }),
    metadata: Object.freeze({
      source: input.source ?? "app-context-builder",
      description: input.description ?? "Immutable executive context metadata container.",
      tags: freezeStrings(input.tags),
      schemaVersion: "APP-CTX-1" as const,
      appDomainPlatformVersion: appDomainVersion(),
    }),
    workspace: Object.freeze(input.workspace ?? defaultWorkspace()),
    domain: Object.freeze({
      selectedDomainIds: freezeStrings(domainInput.selectedDomainIds),
      appDomainPlatformVersion: domainInput.appDomainPlatformVersion || appDomainVersion(),
    }),
    objects: Object.freeze({ objectIds: freezeStrings((input.objects ?? defaultObjects()).objectIds) }),
    kpis: Object.freeze({ kpiIds: freezeStrings((input.kpis ?? defaultKpis()).kpiIds) }),
    risks: Object.freeze({ riskIds: freezeStrings((input.risks ?? defaultRisks()).riskIds) }),
    scenario: Object.freeze(input.scenario ?? defaultScenario()),
    timeline: Object.freeze(input.timeline ?? defaultTimeline()),
    simulation: Object.freeze(input.simulation ?? defaultSimulation()),
    intent: Object.freeze(input.intent ?? defaultIntent()),
    goal: Object.freeze(input.goal ?? defaultGoal()),
    constraints: Object.freeze({
      constraintIds: freezeStrings((input.constraints ?? defaultConstraints()).constraintIds),
      notes: freezeStrings((input.constraints ?? defaultConstraints()).notes),
    }),
    validation: validationResult(Object.freeze([])),
    immutable: true as const,
    metadataOnly: true as const,
  });

  return Object.freeze({ ...context, validation: validateExecutiveContext(context) });
}

export function createExecutiveContext(input: ExecutiveContextInput = Object.freeze({})): ExecutiveContext {
  return buildContext(input);
}

export function updateExecutiveContext(context: ExecutiveContext, updates: ExecutiveContextInput): ExecutiveContext {
  return buildContext({
    contextId: context.identity.contextId,
    source: context.metadata.source,
    description: context.metadata.description,
    tags: context.metadata.tags,
    workspace: context.workspace,
    domain: context.domain,
    objects: context.objects,
    kpis: context.kpis,
    risks: context.risks,
    scenario: context.scenario,
    timeline: context.timeline,
    simulation: context.simulation,
    intent: context.intent,
    goal: context.goal,
    constraints: context.constraints,
    ...updates,
  });
}

export function cloneExecutiveContext(context: ExecutiveContext): ExecutiveContext {
  return updateExecutiveContext(context, {});
}

export function freezeExecutiveContext(context: ExecutiveContext): ExecutiveContext {
  return cloneExecutiveContext(context);
}

export function validateExecutiveContext(context: ExecutiveContext): ExecutiveContextValidation {
  const issues: ExecutiveContextValidation["issues"][number][] = [];
  if (context.identity.contextId.trim().length === 0) {
    issues.push(Object.freeze({ code: "missing_context_id", message: "Executive context id is required." }));
  }
  if (!appDomainFreezePasses()) {
    issues.push(Object.freeze({ code: "app_domain_not_frozen", message: "APP-DOM platform freeze must pass." }));
  }
  if (context.metadata.appDomainPlatformVersion !== appDomainVersion()) {
    issues.push(Object.freeze({ code: "invalid_app_domain_version", message: "Executive context must reference the current APP-DOM platform version." }));
  }
  if (!context.immutable || !context.metadataOnly) {
    issues.push(Object.freeze({ code: "invalid_context_boundary", message: "Executive context must be immutable metadata only." }));
  }
  return validationResult(issues);
}

export function getExecutiveContextIdentity(context: ExecutiveContext): ExecutiveContextIdentity {
  return context.identity;
}

export function isExecutiveContextValid(context: ExecutiveContext): boolean {
  return validateExecutiveContext(context).valid;
}
