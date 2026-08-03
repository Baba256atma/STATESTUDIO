/**
 * EXS-1 — Nova Manufacturing mock fixture.
 */

import type {
  Exs1Connection,
  Exs1Context,
  Exs1NavId,
  Exs1Object,
  Exs1Pack,
  Exs1WorkspaceId,
} from "../exs1Types";

export const EXS1_CONTEXT: Exs1Context = Object.freeze({
  company: "Nova Manufacturing",
  model: "Supply Chain",
  pack: "Production Delay",
  workspace: "Problem",
  lens: "week",
  dataStatus: "Live Mock",
});

export const EXS1_NAV_ITEMS: readonly Exs1NavId[] = Object.freeze([
  "Home",
  "Model",
  "Objects",
  "Data",
  "Journal",
  "Search",
  "Settings",
]);

/** @deprecated EXS-1.5 — use Executive Mode (shell EXECUTIVE_MODES). */
export const EXS1_WORKSPACES: readonly Exs1WorkspaceId[] = Object.freeze([
  "Goal",
  "Problem",
  "Analysis",
  "Scenario",
  "Decision",
  "Execution",
  "Monitoring",
  "War Room",
]);

export const EXS1_OBJECTS: readonly Exs1Object[] = Object.freeze([
  {
    id: "supplier",
    label: "Supplier",
    kind: "source",
    symbol: "◇",
    x: 14,
    y: 28,
    relatedPackId: "production-delay",
    summary:
      "Primary component supplier feeding Factory line A. Lead time variance is rising.",
    guidance:
      "Inspect inbound reliability before expanding production commitments.",
  },
  {
    id: "factory",
    label: "Factory",
    kind: "operation",
    symbol: "⬡",
    x: 36,
    y: 42,
    relatedPackId: "production-delay",
    summary:
      "Assembly capacity is constrained by delayed inbound parts and WIP backlog.",
    guidance: "Focus on bottleneck stations linked to the Production Delay pack.",
  },
  {
    id: "inventory",
    label: "Inventory",
    kind: "asset",
    symbol: "▣",
    x: 58,
    y: 28,
    relatedPackId: "production-delay",
    summary:
      "Finished-goods buffer is thinning. Cover days are below the executive threshold.",
    guidance:
      "This object is the clearest signal of Production Delay risk this week.",
  },
  {
    id: "customer",
    label: "Customer",
    kind: "market",
    symbol: "◎",
    x: 78,
    y: 42,
    relatedPackId: "production-delay",
    summary:
      "Key accounts expect on-time delivery. Service risk is increasing.",
    guidance: "Track promised ship dates against current Inventory cover.",
  },
  {
    id: "revenue",
    label: "Revenue",
    kind: "outcome",
    symbol: "◈",
    x: 66,
    y: 68,
    relatedPackId: "production-delay",
    summary:
      "Delayed fulfillment threatens near-term revenue recognition on committed orders.",
    guidance: "Protect margin by prioritizing high-value delayed shipments.",
  },
  {
    id: "decision",
    label: "Decision",
    kind: "action",
    symbol: "✦",
    x: 34,
    y: 68,
    relatedPackId: "production-delay",
    summary:
      "Executive decision point: expedite supply, reallocate capacity, or renegotiate commitments.",
    guidance: "Select the Production Delay pack to frame the decision path.",
  },
]);

export const EXS1_CONNECTIONS: readonly Exs1Connection[] = Object.freeze([
  { from: "supplier", to: "factory" },
  { from: "factory", to: "inventory" },
  { from: "inventory", to: "customer" },
  { from: "customer", to: "revenue" },
  { from: "factory", to: "decision" },
  { from: "inventory", to: "decision" },
  { from: "decision", to: "revenue" },
]);

export const EXS1_PACKS: readonly Exs1Pack[] = Object.freeze([
  {
    id: "production-delay",
    title: "Production Delay",
    workspace: "Problem",
    risk: "warning",
    timelineLens: "week",
    story:
      "Production Delay captures a rising lead-time shock from Supplier into Factory, thinning Inventory cover and exposing Customer commitments this week.",
    guidance:
      "Stay in Problem workspace. Inspect Inventory, then decide whether to expedite or resequence.",
    relatedObjectIds: [
      "supplier",
      "factory",
      "inventory",
      "customer",
      "revenue",
      "decision",
    ],
  },
]);

export const EXS1_WELCOME = Object.freeze({
  title: "Welcome, Executive",
  body: "You are in Nova Manufacturing · Supply Chain. Workspace is Problem. One pack is active: Production Delay.",
  guidance:
    "Click an object on the Stage to see how Nexora reacts — Advisor, Pack, and Timeline will respond together.",
});
