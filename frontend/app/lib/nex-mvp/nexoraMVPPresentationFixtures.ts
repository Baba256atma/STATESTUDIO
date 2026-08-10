/**
 * NEX-MVP:6 — Presentation fixtures for subject depth (KPI / KOI / actions).
 *
 * Replaceable Stage-development data. Not a KPI/KOI/action engine.
 * Sparse: omit fields when unavailable rather than inventing values.
 */

export type NexoraMVPPresentationKpiFixture = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly target?: string;
  readonly delta?: string;
  readonly trend?: "up" | "down" | "flat";
  readonly status?: "stable" | "watch" | "risk";
};

export type NexoraMVPPresentationKoiFixture = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
};

export type NexoraMVPPresentationActionFixture = {
  readonly id: string;
  readonly label: string;
  readonly kind:
    | "select-subject"
    | "open-panel"
    | "acknowledge"
    | "review";
  readonly available: boolean;
  readonly disabledReason?: string;
  readonly targetSubjectId?: string;
  readonly panelKind?: "decision" | "scenario" | "object" | "data";
};

export type NexoraMVPSubjectPresentationFixture = {
  readonly subjectId: string;
  readonly subjectKind: "object" | "problem" | "scenario" | "decision" | "execution";
  readonly essentialStatus: string;
  readonly primaryKpi?: NexoraMVPPresentationKpiFixture;
  readonly secondaryKpis?: readonly NexoraMVPPresentationKpiFixture[];
  readonly koi?: NexoraMVPPresentationKoiFixture;
  readonly summary?: string;
  readonly relationships: readonly {
    readonly id: string;
    readonly label: string;
    readonly relation: string;
  }[];
  readonly actions: readonly NexoraMVPPresentationActionFixture[];
  readonly supportsReport: boolean;
  readonly supportsOperation: boolean;
};

export const NEXORA_MVP_SUBJECT_PRESENTATION_FIXTURES = Object.freeze([
  Object.freeze({
    subjectId: "obj-revenue",
    subjectKind: "object",
    essentialStatus: "Stable",
    primaryKpi: Object.freeze({
      id: "kpi-revenue",
      label: "Revenue",
      value: "$8.4M",
      target: "$9.1M",
      delta: "-7.7%",
      trend: "up",
      status: "watch",
    }),
    secondaryKpis: Object.freeze([
      Object.freeze({
        id: "kpi-revenue-growth",
        label: "Growth",
        value: "+4.2%",
        trend: "up",
        status: "stable",
      }),
    ]),
    koi: Object.freeze({
      id: "koi-revenue-margin",
      label: "Margin Quality",
      value: "0.72",
    }),
    summary:
      "Revenue is improving but remains below target; capacity and pricing scenarios remain the primary drivers.",
    relationships: Object.freeze([
      Object.freeze({
        id: "rel-rev-capacity",
        label: "Capacity",
        relation: "constrained-by",
      }),
      Object.freeze({
        id: "rel-rev-delivery",
        label: "Delivery",
        relation: "influences",
      }),
    ]),
    actions: Object.freeze([
      Object.freeze({
        id: "act-revenue-scenario",
        label: "Open Scenario",
        kind: "select-subject",
        available: true,
        targetSubjectId: "ctx-scenario-pricing",
      }),
      Object.freeze({
        id: "act-revenue-decision",
        label: "Review Decision",
        kind: "select-subject",
        available: true,
        targetSubjectId: "ctx-decision-reprice",
      }),
      Object.freeze({
        id: "act-revenue-capacity",
        label: "Investigate Capacity",
        kind: "select-subject",
        available: true,
        targetSubjectId: "obj-capacity",
      }),
    ]),
    supportsReport: true,
    supportsOperation: true,
  }),
  Object.freeze({
    subjectId: "obj-capacity",
    subjectKind: "object",
    essentialStatus: "Watch",
    primaryKpi: Object.freeze({
      id: "kpi-capacity",
      label: "Utilization",
      value: "88%",
      target: "80%",
      delta: "+12%",
      trend: "up",
      status: "risk",
    }),
    summary:
      "Capacity is 12% above the intended target band and is currently constraining delivery.",
    relationships: Object.freeze([
      Object.freeze({
        id: "rel-cap-delivery",
        label: "Delivery",
        relation: "blocks",
      }),
      Object.freeze({
        id: "rel-cap-problem",
        label: "Capacity Gap",
        relation: "constrained-by",
      }),
    ]),
    actions: Object.freeze([
      Object.freeze({
        id: "act-capacity-problem",
        label: "Investigate Problem",
        kind: "select-subject",
        available: true,
        targetSubjectId: "ctx-problem-capacity",
      }),
      Object.freeze({
        id: "act-capacity-decision",
        label: "Review Decision",
        kind: "select-subject",
        available: true,
        targetSubjectId: "ctx-decision-capacity",
      }),
      Object.freeze({
        id: "act-capacity-scenario",
        label: "Open Scenario",
        kind: "select-subject",
        available: true,
        targetSubjectId: "ctx-scenario-capacity",
      }),
    ]),
    supportsReport: true,
    supportsOperation: true,
  }),
  Object.freeze({
    subjectId: "obj-delivery",
    subjectKind: "object",
    essentialStatus: "Watch",
    primaryKpi: Object.freeze({
      id: "kpi-delivery",
      label: "On-time",
      value: "91%",
      target: "96%",
      delta: "-5%",
      trend: "down",
      status: "watch",
    }),
    relationships: Object.freeze([
      Object.freeze({
        id: "rel-del-capacity",
        label: "Capacity",
        relation: "depends-on",
      }),
    ]),
    actions: Object.freeze([
      Object.freeze({
        id: "act-delivery-capacity",
        label: "Inspect Capacity",
        kind: "select-subject",
        available: true,
        targetSubjectId: "obj-capacity",
      }),
    ]),
    supportsReport: true,
    supportsOperation: true,
  }),
  Object.freeze({
    subjectId: "obj-inventory",
    subjectKind: "object",
    essentialStatus: "Stable",
    primaryKpi: Object.freeze({
      id: "kpi-inventory",
      label: "Turns",
      value: "6.1",
      status: "stable",
    }),
    relationships: Object.freeze([]),
    actions: Object.freeze([]),
    supportsReport: true,
    supportsOperation: false,
  }),
  Object.freeze({
    subjectId: "ctx-problem-margin",
    subjectKind: "problem",
    essentialStatus: "Risk",
    summary:
      "Margin Pressure is the primary problem affecting Revenue and risk exposure.",
    relationships: Object.freeze([
      Object.freeze({
        id: "rel-margin-revenue",
        label: "Revenue",
        relation: "affects",
      }),
      Object.freeze({
        id: "rel-margin-pricing",
        label: "Pricing Response",
        relation: "explored-by",
      }),
    ]),
    actions: Object.freeze([
      Object.freeze({
        id: "act-margin-pricing",
        label: "Open Pricing Scenario",
        kind: "select-subject",
        available: true,
        targetSubjectId: "ctx-scenario-pricing",
      }),
      Object.freeze({
        id: "act-margin-demand",
        label: "Open Demand Scenario",
        kind: "select-subject",
        available: true,
        targetSubjectId: "ctx-scenario-demand",
      }),
      Object.freeze({
        id: "act-margin-compare",
        label: "Compare Scenarios",
        kind: "open-panel",
        available: true,
        panelKind: "scenario",
      }),
    ]),
    supportsReport: true,
    supportsOperation: true,
  }),
  Object.freeze({
    subjectId: "ctx-scenario-pricing",
    subjectKind: "scenario",
    essentialStatus: "Watch",
    summary:
      "Pricing Response explores margin recovery under constrained capacity.",
    relationships: Object.freeze([
      Object.freeze({
        id: "rel-scn-revenue",
        label: "Revenue",
        relation: "explored-by",
      }),
      Object.freeze({
        id: "rel-scn-decision",
        label: "Approve Repricing",
        relation: "sources",
      }),
    ]),
    actions: Object.freeze([
      Object.freeze({
        id: "act-scenario-compare",
        label: "Compare Scenario",
        kind: "open-panel",
        available: true,
        panelKind: "scenario",
      }),
      Object.freeze({
        id: "act-scenario-decision",
        label: "Review Decision",
        kind: "select-subject",
        available: true,
        targetSubjectId: "ctx-decision-reprice",
      }),
      Object.freeze({
        id: "act-scenario-select",
        label: "Focus Revenue",
        kind: "select-subject",
        available: true,
        targetSubjectId: "obj-revenue",
      }),
    ]),
    supportsReport: true,
    supportsOperation: true,
  }),
  Object.freeze({
    subjectId: "ctx-scenario-demand",
    subjectKind: "scenario",
    essentialStatus: "Stable",
    summary: "Demand Surge explores volume upside with delivery risk.",
    relationships: Object.freeze([
      Object.freeze({
        id: "rel-demand-delivery",
        label: "Delivery",
        relation: "explored-by",
      }),
    ]),
    actions: Object.freeze([
      Object.freeze({
        id: "act-demand-compare",
        label: "Compare Scenario",
        kind: "open-panel",
        available: true,
        panelKind: "scenario",
      }),
      Object.freeze({
        id: "act-demand-pricing",
        label: "Open Pricing Scenario",
        kind: "select-subject",
        available: true,
        targetSubjectId: "ctx-scenario-pricing",
      }),
    ]),
    supportsReport: true,
    supportsOperation: true,
  }),
  Object.freeze({
    subjectId: "ctx-scenario-capacity",
    subjectKind: "scenario",
    essentialStatus: "Watch",
    summary:
      "Capacity Expansion Plan explores relieving the Capacity Gap affecting Delivery.",
    relationships: Object.freeze([
      Object.freeze({
        id: "rel-scn-cap-object",
        label: "Capacity",
        relation: "explored-by",
      }),
      Object.freeze({
        id: "rel-scn-cap-decision",
        label: "Expand Capacity",
        relation: "sources",
      }),
    ]),
    actions: Object.freeze([
      Object.freeze({
        id: "act-cap-scn-compare",
        label: "Compare Scenario",
        kind: "open-panel",
        available: true,
        panelKind: "scenario",
      }),
      Object.freeze({
        id: "act-cap-scn-decision",
        label: "Review Decision",
        kind: "select-subject",
        available: true,
        targetSubjectId: "ctx-decision-capacity",
      }),
    ]),
    supportsReport: true,
    supportsOperation: true,
  }),
  Object.freeze({
    subjectId: "ctx-decision-reprice",
    subjectKind: "decision",
    essentialStatus: "Under Review",
    summary:
      "Approve Repricing depends on Pricing Response scenario outcomes.",
    relationships: Object.freeze([
      Object.freeze({
        id: "rel-dec-revenue",
        label: "Revenue",
        relation: "acts-on",
      }),
      Object.freeze({
        id: "rel-dec-scenario",
        label: "Pricing Response",
        relation: "sources",
      }),
    ]),
    actions: Object.freeze([
      Object.freeze({
        id: "act-decision-review",
        label: "Review Decision",
        kind: "open-panel",
        available: true,
        panelKind: "decision",
      }),
      Object.freeze({
        id: "act-decision-approve",
        label: "Approve",
        kind: "review",
        available: true,
      }),
      Object.freeze({
        id: "act-decision-reject",
        label: "Reject",
        kind: "review",
        available: true,
      }),
      Object.freeze({
        id: "act-decision-execution",
        label: "Open Execution",
        kind: "select-subject",
        available: true,
        targetSubjectId: "ctx-execution-rollout",
      }),
    ]),
    supportsReport: true,
    supportsOperation: true,
  }),
  Object.freeze({
    subjectId: "ctx-decision-capacity",
    subjectKind: "decision",
    essentialStatus: "Under Review",
    summary: "Expand Capacity decision addresses the Capacity Gap.",
    relationships: Object.freeze([
      Object.freeze({
        id: "rel-dec-cap-object",
        label: "Capacity",
        relation: "acts-on",
      }),
    ]),
    actions: Object.freeze([
      Object.freeze({
        id: "act-dec-cap-review",
        label: "Review Decision",
        kind: "open-panel",
        available: true,
        panelKind: "decision",
      }),
      Object.freeze({
        id: "act-dec-cap-approve",
        label: "Approve",
        kind: "review",
        available: true,
      }),
      Object.freeze({
        id: "act-dec-cap-reject",
        label: "Reject",
        kind: "review",
        available: true,
      }),
      Object.freeze({
        id: "act-dec-cap-execution",
        label: "Open Execution",
        kind: "select-subject",
        available: true,
        targetSubjectId: "ctx-execution-capacity",
      }),
    ]),
    supportsReport: true,
    supportsOperation: true,
  }),
  Object.freeze({
    subjectId: "ctx-problem-capacity",
    subjectKind: "problem",
    essentialStatus: "Watch",
    summary: "Capacity Gap is constraining delivery performance.",
    relationships: Object.freeze([
      Object.freeze({
        id: "rel-prob-capacity",
        label: "Capacity",
        relation: "constrained-by",
      }),
      Object.freeze({
        id: "rel-prob-scenario",
        label: "Capacity Expansion Plan",
        relation: "explored-by",
      }),
    ]),
    actions: Object.freeze([
      Object.freeze({
        id: "act-problem-scenario",
        label: "Open Scenario",
        kind: "select-subject",
        available: true,
        targetSubjectId: "ctx-scenario-capacity",
      }),
      Object.freeze({
        id: "act-problem-capacity",
        label: "Open Capacity",
        kind: "select-subject",
        available: true,
        targetSubjectId: "obj-capacity",
      }),
      Object.freeze({
        id: "act-problem-compare",
        label: "Compare Scenarios",
        kind: "open-panel",
        available: true,
        panelKind: "scenario",
      }),
    ]),
    supportsReport: true,
    supportsOperation: true,
  }),
  Object.freeze({
    subjectId: "ctx-execution-rollout",
    subjectKind: "execution",
    essentialStatus: "In Progress",
    primaryKpi: Object.freeze({
      id: "kpi-rollout",
      label: "Progress",
      value: "62%",
      status: "watch",
    }),
    summary: "Pricing Rollout is underway with elevated watch status.",
    relationships: Object.freeze([
      Object.freeze({
        id: "rel-exec-revenue",
        label: "Revenue",
        relation: "implements",
      }),
      Object.freeze({
        id: "rel-exec-decision",
        label: "Approve Repricing",
        relation: "implements",
      }),
    ]),
    actions: Object.freeze([
      Object.freeze({
        id: "act-exec-open",
        label: "Open Execution",
        kind: "open-panel",
        available: true,
        panelKind: "object",
      }),
      Object.freeze({
        id: "act-exec-pause",
        label: "Pause",
        kind: "review",
        available: true,
      }),
      Object.freeze({
        id: "act-exec-resume",
        label: "Resume",
        kind: "review",
        available: false,
        disabledReason: "Resume available only while paused.",
      }),
      Object.freeze({
        id: "act-exec-complete",
        label: "Complete",
        kind: "review",
        available: true,
      }),
    ]),
    supportsReport: true,
    supportsOperation: true,
  }),
  Object.freeze({
    subjectId: "ctx-execution-capacity",
    subjectKind: "execution",
    essentialStatus: "Planned",
    primaryKpi: Object.freeze({
      id: "kpi-cap-exec",
      label: "Progress",
      value: "0%",
      status: "stable",
    }),
    summary: "Capacity Expansion is planned pending Decision approval.",
    relationships: Object.freeze([
      Object.freeze({
        id: "rel-exec-cap-object",
        label: "Capacity",
        relation: "implements",
      }),
    ]),
    actions: Object.freeze([
      Object.freeze({
        id: "act-exec-cap-open",
        label: "Open Execution",
        kind: "open-panel",
        available: true,
        panelKind: "object",
      }),
      Object.freeze({
        id: "act-exec-cap-start-exec",
        label: "Start",
        kind: "review",
        available: false,
        disabledReason: "Start requires an approved Decision.",
      }),
      Object.freeze({
        id: "act-exec-cap-pause",
        label: "Pause",
        kind: "review",
        available: false,
        disabledReason: "Pause available only while in progress.",
      }),
    ]),
    supportsReport: true,
    supportsOperation: true,
  }),
] as const satisfies readonly NexoraMVPSubjectPresentationFixture[]);

export function getNexoraMVPSubjectPresentationFixture(
  subjectId: string | null | undefined,
): NexoraMVPSubjectPresentationFixture | null {
  if (subjectId == null) return null;
  return (
    NEXORA_MVP_SUBJECT_PRESENTATION_FIXTURES.find(
      (entry) => entry.subjectId === subjectId,
    ) ?? null
  );
}
