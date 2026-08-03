/**
 * Phase E — Beta readiness checklist for platform surfaces.
 */

export type ReadinessItemId =
  | "Cockpit"
  | "Runtime"
  | "Advisor"
  | "Metadata"
  | "Intelligence"
  | "Connectors"
  | "Simulation"
  | "Timeline"
  | "Journal"
  | "Explorer"
  | "Director"
  | "Floating Panels";

export type ReadinessItem = {
  readonly id: ReadinessItemId;
  readonly requirement: string;
  readonly operational: boolean;
  readonly notes: string;
};

export const BETA_READINESS_CHECKLIST: readonly ReadinessItem[] = Object.freeze([
  {
    id: "Cockpit",
    requirement: "Shell loads Context, Nav, Stage, Advisor, Timeline, Status",
    operational: true,
    notes: "EXS-7 Beta shell stable",
  },
  {
    id: "Runtime",
    requirement: "Single store owns Mode, Pack, Timeline, Selection, events",
    operational: true,
    notes: "No duplicated local ownership for core state",
  },
  {
    id: "Advisor",
    requirement: "Explains / recommends / proposes; never executes without approval",
    operational: true,
    notes: "Approvals go through Runtime actions only",
  },
  {
    id: "Metadata",
    requirement: "Every Runtime Object has Metadata meaning",
    operational: true,
    notes: "Knowledge explorer + field resolution",
  },
  {
    id: "Intelligence",
    requirement: "Signals include context, metadata, priority, recommendation",
    operational: true,
    notes: "Runtime Intelligence Provider",
  },
  {
    id: "Connectors",
    requirement: "Unified lifecycle; CSV reference end-to-end",
    operational: true,
    notes: "Other connectors remain shells",
  },
  {
    id: "Simulation",
    requirement: "Future State isolated; Decision Candidate starts Draft",
    operational: true,
    notes: "Emits SimulationCompleted only",
  },
  {
    id: "Timeline",
    requirement: "Lens/Pack selection without Simulation side-effects",
    operational: true,
    notes: "Simulation creates Journal packs only",
  },
  {
    id: "Journal",
    requirement: "Connector, Simulation, Decision, Execution, Monitoring packs",
    operational: true,
    notes: "Empty state provides executive guidance",
  },
  {
    id: "Explorer",
    requirement: "Data, Knowledge, Intelligence, Simulations, Settings operable",
    operational: true,
    notes: "Settings hosts Beta controls",
  },
  {
    id: "Director",
    requirement: "Stage shows current model; overlays do not replace Runtime",
    operational: true,
    notes: "Simulation/Data overlays are siblings",
  },
  {
    id: "Floating Panels",
    requirement: "Wizards open/close without trapping focus",
    operational: true,
    notes: "Publish / Decision / Execution panels",
  },
]);

export function readinessSummary(
  items: readonly ReadinessItem[] = BETA_READINESS_CHECKLIST,
): { readonly total: number; readonly ready: number; readonly betaReady: boolean } {
  const ready = items.filter((i) => i.operational).length;
  return {
    total: items.length,
    ready,
    betaReady: ready === items.length,
  };
}
