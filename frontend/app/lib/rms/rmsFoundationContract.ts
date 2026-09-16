/**
 * NPA-T RMS:1 — reusable simulation environment contract.
 *
 * Pipeline: Simulation World → Operator Agent → Observable Data → Nexora ↔ Manager Agent.
 * Observer watches the chain and is not an authority inside it.
 */

import { rmsFoundationIdentity } from "./rmsIdentity.ts";

export const RMS_INTERACTION_MODES = Object.freeze([
  "WATCH",
  "TAKE_CONTROL",
  "EXPERIMENT",
] as const);

export type RmsInteractionMode = (typeof RMS_INTERACTION_MODES)[number];

export const RMS_FLOW_STAGES = Object.freeze([
  "SIMULATION_WORLD",
  "OPERATOR_AGENT",
  "OBSERVABLE_DATA",
  "NEXORA",
  "MANAGER_AGENT",
] as const);

export type RmsFlowStage = (typeof RMS_FLOW_STAGES)[number];

export const RMS_SIMULATION_LIFECYCLE = Object.freeze([
  "idle",
  "prepared",
  "running",
  "paused",
  "completed",
] as const);

export type RmsSimulationLifecycle = (typeof RMS_SIMULATION_LIFECYCLE)[number];

export const RMS_DEFERRED_CAPABILITIES = Object.freeze([
  "VAI",
  "UNIFIED_COMPANY",
  "NMI",
  "ERP_CRM_SIMULATION",
  "CSV_GENERATION",
  "INDUSTRY_SPECIFIC_MODELS",
  "PROBLEM_INJECTION",
  "AUTONOMOUS_MANAGER_DECISION_LOOP",
  "TAKE_CONTROL_UI",
  "SIMULATION_SCORING",
  "LONG_SESSION_CERTIFICATION",
  "RMS_2",
] as const);

export type RmsDeferredCapability = (typeof RMS_DEFERRED_CAPABILITIES)[number];

export const RMS_FOUNDATION_CONTRACT = Object.freeze({
  identity: rmsFoundationIdentity,
  reusableHostModels: true as const,
  unifiedCompanyModel: false as const,
  privilegedSimulationNexora: false as const,
  observerIsAuthority: false as const,
  realityEqualsData: false as const,
  dataEqualsNexoraKnowledge: false as const,
  interactionModesReserved: RMS_INTERACTION_MODES,
  flow: RMS_FLOW_STAGES,
  deferred: RMS_DEFERRED_CAPABILITIES,
  defaultInteractionMode: "WATCH" as const,
});

export type RmsFoundationContract = typeof RMS_FOUNDATION_CONTRACT;
