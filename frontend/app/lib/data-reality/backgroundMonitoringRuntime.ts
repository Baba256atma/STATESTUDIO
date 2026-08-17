/** PM:6 — framework-independent background scheduling and execution contracts. */
import type { NexoraMonitoringRunResult } from "./automaticMonitoringRuntime.ts";
import {
  evaluateAutomaticMonitoringEligibility,
  type NexoraAutomaticMonitoringPolicy,
} from "./automaticMonitoringRuntime.ts";
import type { NexoraDurableMonitoringSnapshot } from "./durableMonitoringRuntime.ts";

export const backgroundMonitoringRuntimeIdentity =
  "PM:6/NexoraBackgroundMonitoringRuntimeFoundation" as const;
export const backgroundMonitoringRuntimeVersion = "1.0.0" as const;
export const backgroundMonitoringRuntimeNamespace =
  "nexora.proactive-monitoring.background-runtime" as const;
export const backgroundMonitoringRuntimeModel = "background-server-runner" as const;

export const BACKGROUND_MONITORING_RUNTIME_CLASSIFICATION = Object.freeze({
  classification: "A-long-running-server" as const,
  certifiedModel: backgroundMonitoringRuntimeModel,
  browserIndependent: true as const,
  processIndependent: false as const,
  platformSchedulerPresent: false as const,
  serverlessContinuityCertified: false as const,
});

export const BACKGROUND_MONITORING_AUTHORITY_BOUNDARY = Object.freeze({
  repositoryAuthority: "PM:6/server-monitoring-repository" as const,
  executionAuthority: "single-policy-owner" as const,
  providerObservationAuthority: "RDI:4" as const,
  evaluationAuthority: "PM:1" as const,
  advisorQueueAuthority: "PM:4" as const,
  ownsBusinessTruth: false as const,
  ownsRuntimeActivation: false as const,
  ownsStageFocus: false as const,
  externalNotifications: false as const,
});

export type NexoraBackgroundExecutionEvent = Readonly<{
  eventId: string;
  kind: "invocation" | "lease-acquired" | "policy-due" | "policy-skipped" | "observation-succeeded" | "observation-failed" | "pm-evaluated" | "advisor-queued";
  occurredAt: string;
  workspaceId: string | null;
  policyId: string | null;
  runId: string | null;
  detail: string;
}>;

export type NexoraBackgroundCompletedRun = Readonly<{
  runId: string;
  policyId: string;
  dueAt: string;
  completedAt: string;
  result: NexoraMonitoringRunResult["reason"];
  observationId: string | null;
}>;

export type NexoraBackgroundMonitoringState = Readonly<{
  identity: typeof backgroundMonitoringRuntimeIdentity;
  version: typeof backgroundMonitoringRuntimeVersion;
  namespace: typeof backgroundMonitoringRuntimeNamespace;
  runtimeModel: typeof backgroundMonitoringRuntimeModel;
  revision: number;
  writtenAt: string;
  monitoring: NexoraDurableMonitoringSnapshot;
  completedRuns: readonly NexoraBackgroundCompletedRun[];
  events: readonly NexoraBackgroundExecutionEvent[];
}>;

export type NexoraBackgroundTransactionResult<T> = Readonly<{
  acquired: boolean;
  value: T | null;
  ownerId: string;
}>;

export interface NexoraBackgroundMonitoringRepository {
  read(): Promise<NexoraBackgroundMonitoringState | null>;
  transact<T>(input: Readonly<{
    ownerId: string;
    acquiredAt: string;
    leaseMs: number;
    operation: (state: NexoraBackgroundMonitoringState | null) => Promise<Readonly<{
      state: NexoraBackgroundMonitoringState | null;
      value: T;
    }>>;
  }>): Promise<NexoraBackgroundTransactionResult<T>>;
}

export interface NexoraBackgroundPolicyExecutor {
  execute(input: Readonly<{
    state: NexoraBackgroundMonitoringState;
    policy: NexoraAutomaticMonitoringPolicy;
    runId: string;
    observedAt: string;
  }>): Promise<Readonly<{
    monitoring: NexoraDurableMonitoringSnapshot;
    result: NexoraMonitoringRunResult;
    advisorQueued: boolean;
  }>>;
}

export type NexoraBackgroundInvocationReport = Readonly<{
  invocationId: string;
  acquired: boolean;
  consideredPolicyCount: number;
  executedPolicyCount: number;
  skippedPolicyCount: number;
  successfulObservationCount: number;
  failedObservationCount: number;
  advisorQueuedCount: number;
  boundedAt: number;
}>;

function stableToken(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function event(input: Omit<NexoraBackgroundExecutionEvent, "eventId">): NexoraBackgroundExecutionEvent {
  return Object.freeze({
    ...input,
    eventId: `pm6:event:${stableToken(input.runId ?? "invocation")}:${stableToken(input.kind)}:${stableToken(input.occurredAt)}`,
  });
}

export function createBackgroundMonitoringState(
  monitoring: NexoraDurableMonitoringSnapshot,
  writtenAt: string,
): NexoraBackgroundMonitoringState {
  return Object.freeze({
    identity: backgroundMonitoringRuntimeIdentity,
    version: backgroundMonitoringRuntimeVersion,
    namespace: backgroundMonitoringRuntimeNamespace,
    runtimeModel: backgroundMonitoringRuntimeModel,
    revision: 1,
    writtenAt,
    monitoring,
    completedRuns: Object.freeze([]),
    events: Object.freeze([]),
  });
}

export class NexoraBackgroundMonitoringScheduler {
  constructor(
    private readonly repository: NexoraBackgroundMonitoringRepository,
    private readonly executor: NexoraBackgroundPolicyExecutor,
    private readonly maximumPoliciesPerInvocation = 4,
  ) {}

  async runDuePolicies(now: string, invocationId = `pm6:invocation:${stableToken(now)}`): Promise<NexoraBackgroundInvocationReport> {
    const boundedAt = Math.max(1, Math.min(this.maximumPoliciesPerInvocation, 20));
    const transaction = await this.repository.transact({
      ownerId: invocationId,
      acquiredAt: now,
      leaseMs: 5 * 60_000,
      operation: async (initial) => {
        if (!initial) return { state: null, value: Object.freeze({ considered: 0, executed: 0, skipped: 0, successful: 0, failed: 0, queued: 0 }) };
        let state = initial;
        const connections = new Map(state.monitoring.liveData.connections.map((item) => [item.connectionId, item]));
        const runtimeStates = new Map(state.monitoring.runtimeStates.map((item) => [item.connectionId, item]));
        const policies = state.monitoring.policies
          .filter((policy) => policy.executionOwner === "background")
          .sort((left, right) => left.policyId.localeCompare(right.policyId));
        let executed = 0; let skipped = 0; let successful = 0; let failed = 0; let queued = 0;
        const events: NexoraBackgroundExecutionEvent[] = [
          event({ kind: "invocation", occurredAt: now, workspaceId: null, policyId: null, runId: invocationId, detail: "Background due-policy invocation started." }),
          event({ kind: "lease-acquired", occurredAt: now, workspaceId: null, policyId: null, runId: invocationId, detail: "Repository execution lease acquired." }),
        ];
        for (const policy of policies) {
          if (executed >= boundedAt) break;
          const runtimeState = runtimeStates.get(policy.connectionId) ?? null;
          const eligibility = evaluateAutomaticMonitoringEligibility({ policy, connection: connections.get(policy.connectionId) ?? null, runtimeState: runtimeState ? { ...runtimeState, latestEvaluation: null, activeFlightId: null, runtimeScope: "foreground-session-monitoring" } : null, now, executionOwner: "background" });
          if (!eligibility.eligible) { skipped += 1; events.push(event({ kind: "policy-skipped", occurredAt: now, workspaceId: policy.workspaceId, policyId: policy.policyId, runId: null, detail: eligibility.reason })); continue; }
          const dueAt = eligibility.dueAt ?? policy.nextEligibleAt ?? now;
          const runId = `pm6:run:${stableToken(policy.policyId)}:${stableToken(dueAt)}`;
          if (state.completedRuns.some((run) => run.runId === runId)) { skipped += 1; events.push(event({ kind: "policy-skipped", occurredAt: now, workspaceId: policy.workspaceId, policyId: policy.policyId, runId, detail: "idempotent-replay" })); continue; }
          events.push(event({ kind: "policy-due", occurredAt: now, workspaceId: policy.workspaceId, policyId: policy.policyId, runId, detail: dueAt }));
          const outcome = await this.executor.execute({ state, policy, runId, observedAt: now });
          executed += 1;
          successful += outcome.result.completed ? 1 : 0;
          failed += outcome.result.completed ? 0 : 1;
          queued += outcome.advisorQueued ? 1 : 0;
          events.push(event({ kind: outcome.result.completed ? "observation-succeeded" : "observation-failed", occurredAt: now, workspaceId: policy.workspaceId, policyId: policy.policyId, runId, detail: outcome.result.reason }));
          if (outcome.result.evaluation) events.push(event({ kind: "pm-evaluated", occurredAt: now, workspaceId: policy.workspaceId, policyId: policy.policyId, runId, detail: `${outcome.result.evaluation.meaningfulChangeCount} meaningful change(s).` }));
          if (outcome.advisorQueued) events.push(event({ kind: "advisor-queued", occurredAt: now, workspaceId: policy.workspaceId, policyId: policy.policyId, runId, detail: "PM:4 brief queued." }));
          state = Object.freeze({ ...state, revision: state.revision + 1, writtenAt: now, monitoring: outcome.monitoring, completedRuns: Object.freeze([...state.completedRuns, Object.freeze({ runId, policyId: policy.policyId, dueAt, completedAt: now, result: outcome.result.reason, observationId: outcome.result.observationId })].slice(-200)), events: Object.freeze([...state.events, ...events].slice(-300)) });
          events.length = 0;
        }
        if (events.length) state = Object.freeze({ ...state, revision: state.revision + 1, writtenAt: now, events: Object.freeze([...state.events, ...events].slice(-300)) });
        return { state, value: Object.freeze({ considered: policies.length, executed, skipped, successful, failed, queued }) };
      },
    });
    const value = transaction.value ?? { considered: 0, executed: 0, skipped: 0, successful: 0, failed: 0, queued: 0 };
    return Object.freeze({ invocationId, acquired: transaction.acquired, consideredPolicyCount: value.considered, executedPolicyCount: value.executed, skippedPolicyCount: value.skipped, successfulObservationCount: value.successful, failedObservationCount: value.failed, advisorQueuedCount: value.queued, boundedAt });
  }
}

export type BackgroundMonitoringCertificationGate =
  | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K"
  | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V";

export function certifyBackgroundMonitoringRuntime(evidence: Readonly<Record<BackgroundMonitoringCertificationGate, boolean>>) {
  const gates = Object.freeze((Object.keys(evidence) as BackgroundMonitoringCertificationGate[]).sort().map((gate) => Object.freeze({ gate, passed: evidence[gate] })));
  return Object.freeze({ certified: gates.length === 22 && gates.every((gate) => gate.passed), runtimeModel: backgroundMonitoringRuntimeModel, passedGateCount: gates.filter((gate) => gate.passed).length, failedGateCount: gates.filter((gate) => !gate.passed).length, gates });
}
