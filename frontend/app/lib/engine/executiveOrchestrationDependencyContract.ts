import type {
  ExecutiveOrchestrationDependencyRules,
} from "./executiveOrchestrationFoundationTypes.ts";

/**
 * Immutable dependency contract for ENG-8:1.
 */
export const ExecutiveOrchestrationDependencyContract = Object.freeze({
  id: "ENG-8:1-dependency-contract",
  name: "Executive Orchestration Dependency Contract",
  description:
    "Declares allowed and forbidden orchestration foundation dependencies as metadata only.",
  rules: Object.freeze({
    allowed: Object.freeze([
      "ENG-1",
      "ENG-2",
      "ENG-3",
      "ENG-4",
      "ENG-5",
      "ENG-6",
      "ENG-7",
      "BUS Public APIs",
      "OPS Public APIs",
      "Advisor Public APIs",
    ] as const),
    forbidden: Object.freeze([
      "CORE",
      "Database",
      "Storage",
      "API",
      "UI",
      "React",
      "Next.js",
      "HTTP",
      "Queue",
      "Scheduler",
      "Runtime execution",
    ] as const),
    direction: "ForwardOnly",
    publicApiOnly: true,
    metadataOnly: true,
    immutable: true,
    runtimeFree: true,
  } as const satisfies ExecutiveOrchestrationDependencyRules),
  ownership: Object.freeze({
    owner: "ENG-8",
    neverOwns: Object.freeze([
      "CORE internals",
      "database access",
      "storage services",
      "HTTP clients",
      "queue systems",
      "schedulers",
      "runtime executors",
      "UI frameworks",
    ] as const),
  } as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const);
