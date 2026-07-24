/** WS-7:8 — Exactly eight immutable Certification-reachable baselines. */
import { DecisionWorkspaceV7Certification } from "./decisionWorkspaceV7Certification.ts";

const platform = DecisionWorkspaceV7Certification.platform;
const manifest = platform.manifest;

export const DecisionWorkspaceV7FrozenBaselines = Object.freeze([
  Object.freeze({
    id: "WS-7:8/Baseline/01",
    name: "Foundation Baseline",
    source: manifest.inventory.foundationInventory,
  }),
  Object.freeze({
    id: "WS-7:8/Baseline/02",
    name: "Registry Baseline",
    source: manifest.inventory.registryInventory,
  }),
  Object.freeze({
    id: "WS-7:8/Baseline/03",
    name: "Model Baseline",
    source: manifest.inventory.modelInventory,
  }),
  Object.freeze({
    id: "WS-7:8/Baseline/04",
    name: "Validation Baseline",
    source: manifest.inventory.validationInventory,
  }),
  Object.freeze({
    id: "WS-7:8/Baseline/05",
    name: "Manifest Baseline",
    source: manifest,
  }),
  Object.freeze({
    id: "WS-7:8/Baseline/06",
    name: "Platform Baseline",
    source: platform,
  }),
  Object.freeze({
    id: "WS-7:8/Baseline/07",
    name: "Certification Baseline",
    source: DecisionWorkspaceV7Certification,
  }),
  Object.freeze({
    id: "WS-7:8/Baseline/08",
    name: "Workspace Baseline",
    source: platform.composition.workspaceIdentity,
  }),
] as const);
