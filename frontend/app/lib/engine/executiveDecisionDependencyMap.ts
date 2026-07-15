const dependency = (
  key: string,
  direction: "Incoming" | "Outgoing" | "Forbidden",
  target: string,
  classification: string,
  publicIndex: string,
) => Object.freeze({
  id: `eng-7-dependency-${key}`,
  direction,
  target,
  classification,
  publicIndex,
  consumption: direction === "Forbidden" ? "Prohibited" : "PublicIndexOnly",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

/**
 * Immutable dependency map for ENG-7:1.
 * Metadata only — no resolution or runtime dependency injection.
 */
export const ExecutiveDecisionDependencyMap = Object.freeze({
  id: "eng-7-dependency-map",
  name: "Executive Decision Dependency Map",
  phase: "ENG-7:1",
  owner: "ENG-7",
  incoming: Object.freeze([
    dependency("from-eng-1", "Incoming", "ENG-1", "AllowedIncoming", "executiveEnginePublicIndex.ts"),
    dependency("from-eng-2", "Incoming", "ENG-2", "AllowedIncoming", "executiveRequestIntentPublicIndex.ts"),
    dependency("from-eng-3", "Incoming", "ENG-3", "AllowedIncoming", "executiveIntentResolutionPublicIndex.ts"),
    dependency("from-eng-4", "Incoming", "ENG-4", "AllowedIncoming", "executiveContextAssemblyPublicIndex.ts"),
    dependency("from-eng-5", "Incoming", "ENG-5", "AllowedIncoming", "executivePlanningPublicIndex.ts"),
    dependency("from-eng-6", "Incoming", "ENG-6", "AllowedIncoming", "executiveReasoningPublicIndex.ts"),
  ] as const),
  outgoing: Object.freeze([
    dependency("to-eng-8", "Outgoing", "ENG-8", "AllowedOutgoing", "future executiveOrchestrationPublicIndex.ts"),
    dependency("to-advisor", "Outgoing", "Advisor", "AllowedOutgoing", "future advisor public index"),
  ] as const),
  forbidden: Object.freeze([
    dependency("bus-internals", "Forbidden", "BUS internals", "Forbidden", "n/a"),
    dependency("ops-internals", "Forbidden", "OPS internals", "Forbidden", "n/a"),
    dependency("ui", "Forbidden", "UI", "Forbidden", "n/a"),
    dependency("scene-rendering", "Forbidden", "Scene rendering", "Forbidden", "n/a"),
    dependency("database", "Forbidden", "Database", "Forbidden", "n/a"),
    dependency("runtime-services", "Forbidden", "Runtime services", "Forbidden", "n/a"),
  ] as const),
  allowedIncoming: Object.freeze(["ENG-1", "ENG-2", "ENG-3", "ENG-4", "ENG-5", "ENG-6"] as const),
  allowedOutgoing: Object.freeze(["ENG-8", "Advisor"] as const),
  forbiddenTargets: Object.freeze([
    "BUS internals",
    "OPS internals",
    "UI",
    "Scene rendering",
    "Database",
    "Runtime services",
  ] as const),
  policy: Object.freeze({
    consumption: "PublicIndexOnly",
    reverseDependencies: "Prohibited",
    circularDependencies: "Prohibited",
    runtimeInvocation: "Prohibited",
  } as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);
