/** WS-5:2 — Canonical Registry identity and record shape. */
import { ScenarioWorkspaceFoundation } from "./scenarioWorkspaceFoundation.ts";

export interface ScenarioWorkspaceRegistryRecord<TSource = unknown> {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly registryCategory: string;
  readonly source: TSource;
  readonly sourcePhase: "WS-5:1";
  readonly version: "1.0.0";
  readonly stability: "Stable";
  readonly ownership: "Scenario Workspace";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const ScenarioWorkspaceIdentityRegistry = Object.freeze({
  id: "WS-5:2/ScenarioWorkspaceRegistry",
  key: "scenario-workspace-registry",
  name: "Scenario Workspace Registry",
  workspace: ScenarioWorkspaceFoundation.identity.workspace,
  canonicalIdentifier: ScenarioWorkspaceFoundation.identity.id,
  namespace: "nexora.workspace.scenario.registry",
  version: "1.0.0",
  status: "Registry",
  readiness: "ReadyForModel",
  ownership: "Scenario Workspace",
  sourcePhase: "WS-5:1",
  source: ScenarioWorkspaceFoundation.identity,
  stability: "Stable",
  metadataOnly: true,
  immutable: true,
} as const);
