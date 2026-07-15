const prohibition = (id: string, name: string, description: string) => Object.freeze({
  id, name, description, status: "Prohibited", metadataOnly: true, immutable: true,
} as const);

export const ExecutiveContextAssemblyBoundaries = Object.freeze({
  owner: "ENG-4",
  scope: "Executive Context Assembly Foundation",
  enforcement: "Architectural",
  prohibited: Object.freeze([
    prohibition("eng-4-boundary-runtime-execution", "Runtime Execution", "Foundation must not execute runtime behavior of any kind."),
    prohibition("eng-4-boundary-sql-generation", "SQL Generation", "Foundation must not generate or compose SQL."),
    prohibition("eng-4-boundary-database-access", "Database Access", "Foundation must not read from or write to databases."),
    prohibition("eng-4-boundary-api-calls", "API Calls", "Foundation must not perform network or service API calls."),
    prohibition("eng-4-boundary-orchestration", "Orchestration", "Foundation must not orchestrate workflows or platform execution."),
    prohibition("eng-4-boundary-planning", "Planning", "Foundation must not plan actions; planning belongs to ENG-5."),
    prohibition("eng-4-boundary-reasoning", "Reasoning", "Foundation must not perform reasoning or inference."),
    prohibition("eng-4-boundary-recommendations", "Recommendations", "Foundation must not produce recommendations."),
    prohibition("eng-4-boundary-decision-making", "Decision Making", "Foundation must not make or commit decisions."),
    prohibition("eng-4-boundary-caching", "Caching", "Foundation must not cache context or derived state."),
    prohibition("eng-4-boundary-persistence", "Persistence", "Foundation must not persist assembled context."),
    prohibition("eng-4-boundary-mutation", "Mutation", "Foundation exports are immutable; mutation is prohibited."),
    prohibition("eng-4-boundary-visualization", "Visualization", "Foundation must not render or visualize context."),
  ]),
  classification: Object.freeze({
    metadataOnly: true, runtimeFree: true, immutable: true, deterministic: true,
  } as const),
  metadataOnly: true, immutable: true, deterministic: true,
} as const);
