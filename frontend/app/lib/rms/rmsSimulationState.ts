/**
 * NPA-T RMS:1 — simulation identity and state.
 *
 * Minimum reusable identity. Not Unified Company / NMI.
 * D7 Reality Simulation Core remains a separate operational-graph substrate.
 */

import type { RmsInteractionMode, RmsSimulationLifecycle } from "./rmsFoundationContract.ts";
import type { RmsActorIdentity } from "./rmsActorContracts.ts";
import type { RmsNexoraKnowledgeView, RmsObservableDataEnvelope } from "./rmsGroundTruth.ts";

export type RmsHostKind = "BUSINESS" | "PROJECT";

export type RmsHostIdentity = {
  readonly hostKind: RmsHostKind;
  readonly hostId: string;
};

export type RmsClock = {
  readonly tick: number;
  readonly simulatedAt: string;
};

export type RmsRunIdentity = {
  readonly simulationId: string;
  readonly simulationType: string;
  readonly sessionId: string;
  readonly runId: string;
};

export type RmsPublicSimulationState = {
  readonly identity: RmsRunIdentity;
  readonly host: RmsHostIdentity;
  readonly clock: RmsClock;
  readonly lifecycle: RmsSimulationLifecycle;
  readonly interactionMode: RmsInteractionMode;
  readonly actors: readonly RmsActorIdentity[];
  readonly observableData: readonly RmsObservableDataEnvelope[];
  readonly nexoraKnowledge: RmsNexoraKnowledgeView;
};

export function createRmsClock(tick = 0, simulatedAt = "2026-09-16T00:00:00.000Z"): RmsClock {
  return Object.freeze({
    tick: tick < 0 ? 0 : tick,
    simulatedAt,
  });
}
