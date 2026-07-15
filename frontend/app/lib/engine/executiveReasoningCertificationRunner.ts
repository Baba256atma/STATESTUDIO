import { ExecutiveReasoningCertificationGates } from "./executiveReasoningCertificationRegistry.ts";
import type {
  ExecutiveReasoningCertificationGateStatus,
  ExecutiveReasoningCertificationRunnerResult,
  ExecutiveReasoningCertificationStatus,
} from "./executiveReasoningCertificationTypes.ts";

/**
 * Deterministic metadata-only certification runner.
 * Aggregates declared gate statuses — never executes runtime certification.
 */
export const ExecutiveReasoningCertificationRunner = Object.freeze({
  id: "eng-6-certification-runner",
  name: "Executive Reasoning Certification Runner",
  description:
    "Deterministic metadata aggregator reporting certification status from declared gate statuses only.",
  gates: ExecutiveReasoningCertificationGates,
  run: (): ExecutiveReasoningCertificationRunnerResult => {
    const statuses = ExecutiveReasoningCertificationGates.map(
      ({ status }) => status as ExecutiveReasoningCertificationGateStatus,
    );
    const passCount = statuses.filter((status) => status === "PASS").length;
    const warningCount = statuses.filter((status) => status === "WARNING").length;
    const failCount = statuses.filter((status) => status === "FAIL").length;
    const status: ExecutiveReasoningCertificationStatus =
      failCount > 0
        ? "FAIL"
        : warningCount > 0
          ? "WARNING"
          : passCount === ExecutiveReasoningCertificationGates.length
            ? "CERTIFIED"
            : "PENDING";
    const freezeReadiness = status === "CERTIFIED" ? "ReadyForFreeze" : "Blocked";
    return Object.freeze({
      status,
      passCount,
      warningCount,
      failCount,
      totalGateCount: ExecutiveReasoningCertificationGates.length,
      freezeReadiness,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const);
  },
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);
