import type {
  ExecutiveOrchestrationCapability,
} from "./executiveOrchestrationFoundationTypes.ts";

const capability = (
  id: ExecutiveOrchestrationCapability["id"],
  name: string,
  description: string,
) => Object.freeze({
  id,
  name,
  description,
  status: "Defined",
  owner: "ENG-8",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  implementsCapability: false,
} as const satisfies ExecutiveOrchestrationCapability);

/**
 * Immutable orchestration capability registry for ENG-8:1.
 */
export const ExecutiveOrchestrationCapabilityContract = Object.freeze({
  id: "ENG-8:1-capability-contract",
  name: "Executive Orchestration Capability Contract",
  description:
    "Publishes immutable orchestration capability declarations without implementing orchestration behavior.",
  capabilities: Object.freeze([
    capability(
      "sequential-orchestration",
      "Sequential orchestration",
      "Declares sequential orchestration capability without executing sequential workflows.",
    ),
    capability(
      "parallel-orchestration",
      "Parallel orchestration",
      "Declares parallel orchestration capability without executing parallel workflows.",
    ),
    capability(
      "dependency-resolution",
      "Dependency resolution",
      "Declares dependency-resolution capability without resolving runtime dependencies.",
    ),
    capability(
      "result-aggregation",
      "Result aggregation",
      "Declares result-aggregation capability without aggregating runtime results.",
    ),
    capability(
      "failure-propagation",
      "Failure propagation",
      "Declares failure-propagation capability without propagating runtime failures.",
    ),
    capability(
      "completion-synchronization",
      "Completion synchronization",
      "Declares completion-synchronization capability without synchronizing runtime completion.",
    ),
    capability(
      "advisor-routing",
      "Advisor routing",
      "Declares Advisor-routing capability without routing Advisor runtime messages.",
    ),
    capability(
      "pipeline-coordination",
      "Pipeline coordination",
      "Declares pipeline-coordination capability without coordinating runtime pipelines.",
    ),
  ] as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const);
