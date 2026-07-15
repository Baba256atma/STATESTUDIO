const contract = (id: string, name: string, description: string) => Object.freeze({
  id,
  name,
  description,
  status: "Defined",
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutivePlanningContracts = Object.freeze([
  contract(
    "eng-5-contract-plan-generation",
    "Plan Generation",
    "Architectural contract describing generation of execution-plan metadata without performing execution.",
  ),
  contract(
    "eng-5-contract-execution-planning",
    "Execution Planning",
    "Architectural contract describing planning of execution structure while execution remains owned by OPS.",
  ),
  contract(
    "eng-5-contract-step-ordering",
    "Step Ordering",
    "Architectural contract describing ordered step metadata for planned execution sequences.",
  ),
  contract(
    "eng-5-contract-dependency-resolution",
    "Dependency Resolution",
    "Architectural contract describing dependency metadata relationships without resolving runtime dependencies.",
  ),
  contract(
    "eng-5-contract-parallel-planning",
    "Parallel Planning",
    "Architectural contract describing parallelizable plan-branch metadata without concurrent runtime scheduling.",
  ),
  contract(
    "eng-5-contract-priority-planning",
    "Priority Planning",
    "Architectural contract describing planning priority vocabulary without runtime prioritization engines.",
  ),
  contract(
    "eng-5-contract-retry-planning",
    "Retry Planning",
    "Architectural contract describing retry-plan metadata without performing retries or failure recovery.",
  ),
  contract(
    "eng-5-contract-planning-metadata",
    "Planning Metadata",
    "Architectural contract describing the canonical metadata envelope owned by Executive Planning.",
  ),
  contract(
    "eng-5-contract-public-planning-surface",
    "Public Planning Surface",
    "Architectural contract describing the approved public API surface for Executive Planning.",
  ),
  contract(
    "eng-5-contract-planning-compatibility",
    "Planning Compatibility",
    "Architectural contract describing compatibility boundaries with ENG-1 through ENG-4 and OPS execution ownership.",
  ),
] as const);
