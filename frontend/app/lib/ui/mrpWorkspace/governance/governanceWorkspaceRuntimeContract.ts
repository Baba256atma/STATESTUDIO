/**
 * MRP:5B:1 — Governance workspace runtime contract.
 *
 * Runtime owns mount hydration, view assembly, and boundary traces only.
 * No scene writes. No object mutation.
 */

import type { GovernanceWorkspaceView } from "./governanceWorkspaceContract.ts";

export const GOVERNANCE_RUNTIME_CONTRACT_VERSION = "5B.1.0";

export const GOVERNANCE_RUNTIME_CONTRACT_TAG = "[MRP_5B1_FOUNDATION]" as const;

export type GovernanceWorkspaceRuntimePhase = GovernanceWorkspaceView["phase"];

export type GovernanceWorkspaceRuntimeSnapshot = Readonly<{
  mountKey: string | null;
  phase: GovernanceWorkspaceRuntimePhase;
  revision: number;
  hydratedAt: number | null;
}>;

export type GovernanceWorkspaceRuntimeContract = Readonly<{
  version: typeof GOVERNANCE_RUNTIME_CONTRACT_VERSION;
  tag: typeof GOVERNANCE_RUNTIME_CONTRACT_TAG;
  owner: "governanceWorkspaceRuntime";
  hydrateOnMount: (mountKey: string) => GovernanceWorkspaceRuntimeSnapshot;
  buildView: (input?: { mountKey?: string | null }) => GovernanceWorkspaceView;
  traceFoundationOnce: (mountKey?: string | null) => void;
  resetForTests: () => void;
}>;
