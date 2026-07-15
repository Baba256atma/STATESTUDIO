const capability = (id: string, name: string, description: string) => Object.freeze({
  id,
  name,
  description,
  status: "Defined",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const);

export const ExecutivePlanningCapabilityRegistry = Object.freeze([
  capability(
    "eng-5-capability-plan-builder",
    "Plan Builder",
    "Architectural capability describing construction of execution-plan metadata without building runtime plans.",
  ),
  capability(
    "eng-5-capability-step-builder",
    "Step Builder",
    "Architectural capability describing construction of plan-step metadata without executing steps.",
  ),
  capability(
    "eng-5-capability-dependency-builder",
    "Dependency Builder",
    "Architectural capability describing construction of dependency metadata without resolving runtime graphs.",
  ),
  capability(
    "eng-5-capability-graph-builder",
    "Graph Builder",
    "Architectural capability describing construction of execution-graph metadata without graph algorithms.",
  ),
  capability(
    "eng-5-capability-parallel-planner",
    "Parallel Planner",
    "Architectural capability describing parallel planning metadata without concurrent scheduling runtime.",
  ),
  capability(
    "eng-5-capability-priority-planner",
    "Priority Planner",
    "Architectural capability describing priority planning metadata without runtime prioritization.",
  ),
  capability(
    "eng-5-capability-retry-planner",
    "Retry Planner",
    "Architectural capability describing retry planning metadata without performing retry execution.",
  ),
  capability(
    "eng-5-capability-metadata-builder",
    "Metadata Builder",
    "Architectural capability describing publication of planning metadata envelopes without runtime state.",
  ),
  capability(
    "eng-5-capability-public-api-publisher",
    "Public API Publisher",
    "Architectural capability describing public planning API publication readiness without release logistics.",
  ),
] as const);
