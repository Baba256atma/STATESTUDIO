/** WS-5:3 — Canonical Scenario Workspace Model identity. */
import { ScenarioWorkspaceFoundation } from "./scenarioWorkspaceFoundation.ts";
import { ScenarioWorkspaceRegistry } from "./scenarioWorkspaceRegistry.ts";

export interface ScenarioWorkspaceModelDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly source: unknown;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const ScenarioWorkspaceIdentityModel = Object.freeze({
  id: "WS-5:3/ScenarioWorkspaceModel",
  name: "Scenario Workspace Model",
  namespace: "nexora.workspace.scenario.model",
  layer: "Workspace Layer (WS)",
  phase: "WS-5:3",
  version: "1.0.0",
  status: "Model",
  readiness: "ReadyForValidation",
  foundationIdentity: ScenarioWorkspaceFoundation.identity,
  registryIdentity: ScenarioWorkspaceRegistry.identity,
  metadataOnly: true,
  immutable: true,
} as const);
