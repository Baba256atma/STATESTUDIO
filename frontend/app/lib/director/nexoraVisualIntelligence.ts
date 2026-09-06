/**
 * DIR:VI — reusable visual intelligence.
 * Resolves a presentation-only view from semantic purpose + authoritative evidence.
 * Does not write evidence, Objects, Decisions, or Data Reality.
 * Does not own NEX-ENT.
 */

export const nexoraVisualIntelligenceIdentity =
  "DIR:VI/NexoraVisualIntelligence" as const;
export const nexoraVisualIntelligenceVersion = "1.0.0" as const;
export const nexoraVisualIntelligenceNamespace =
  "nexora.director.visual-intelligence" as const;

export const NEXORA_VISUAL_PURPOSES = Object.freeze([
  "TREND",
  "COMPARE",
  "NONE",
] as const);

export type NexoraVisualPurpose = (typeof NEXORA_VISUAL_PURPOSES)[number];

export const NEXORA_VISUAL_REPRESENTATIONS = Object.freeze([
  "TREND_LINE",
  "COMPARISON_BARS",
] as const);

export type NexoraVisualRepresentation =
  (typeof NEXORA_VISUAL_REPRESENTATIONS)[number];

export const NEXORA_VISUAL_SEMANTIC_CONFIDENCE = Object.freeze([
  "CONFIRMED",
  "LIKELY",
  "UNKNOWN",
] as const);

export type NexoraVisualSemanticConfidence =
  (typeof NEXORA_VISUAL_SEMANTIC_CONFIDENCE)[number];

export const NEXORA_VISUAL_INTELLIGENCE_BOUNDARY = Object.freeze({
  identity: nexoraVisualIntelligenceIdentity,
  requiresNexEnt: false as const,
  writesEvidence: false as const,
  writesObjects: false as const,
  writesDecision: false as const,
  writesDataReality: false as const,
  equalsBusinessObject: false as const,
  equalsDataObject: false as const,
  equalsFocus: false as const,
  fabricatesValues: false as const,
  fabricatesPeriods: false as const,
  fabricatesUnits: false as const,
  fabricatesScores: false as const,
  claimsCausality: false as const,
  forecasts: false as const,
  advisorOwnsDom: false as const,
});

export type NexoraVisualObservation = {
  readonly periodLabel: string;
  readonly value: number;
};

export type NexoraVisualSeries = {
  readonly id: string;
  readonly fieldLabel: string;
  readonly displayLabel: string;
  readonly confidence: NexoraVisualSemanticConfidence;
  readonly unit: string | null;
  readonly sourceLabel: string;
  readonly example: boolean;
  readonly points: readonly NexoraVisualObservation[];
};

export type NexoraVisualEvidenceBundle = {
  readonly acceptedIntoDataReality: false;
  readonly series: readonly NexoraVisualSeries[];
};

export type NexoraVisualView = {
  readonly viewId: string;
  readonly purpose: Exclude<NexoraVisualPurpose, "NONE">;
  readonly representation: NexoraVisualRepresentation;
  readonly title: string;
  readonly description: string;
  readonly series: readonly NexoraVisualSeries[];
  readonly provenance: {
    readonly sourceLabel: string;
    readonly fieldLabels: readonly string[];
    readonly periodLabel: string;
    readonly example: boolean;
  };
  readonly isBusinessObject: false;
  readonly isDataObject: false;
  readonly isDecision: false;
  readonly mutatesFocus: false;
};

export type NexoraVisualResolution =
  | {
      readonly status: "SUPPORTED";
      readonly view: NexoraVisualView;
      readonly reason: string;
    }
  | {
      readonly status: "INSUFFICIENT_EVIDENCE";
      readonly view: null;
      readonly reason: string;
      readonly offerAvailableTrend: boolean;
    }
  | {
      readonly status: "AMBIGUOUS";
      readonly view: null;
      readonly reason: string;
      readonly clarification: string;
    }
  | {
      readonly status: "NONE";
      readonly view: null;
      readonly reason: string;
    };

export type NexoraVisualViewRuntime = {
  readonly view: NexoraVisualView | null;
};

export function emptyNexoraVisualViewRuntime(): NexoraVisualViewRuntime {
  return Object.freeze({ view: null });
}

export function getNexoraVisualIntelligenceIdentity() {
  return Object.freeze({
    id: nexoraVisualIntelligenceIdentity,
    version: nexoraVisualIntelligenceVersion,
    namespace: nexoraVisualIntelligenceNamespace,
  });
}

export function verifyNexoraVisualIntelligence(): { readonly ok: true } {
  if (getNexoraVisualIntelligenceIdentity().id !== nexoraVisualIntelligenceIdentity) {
    throw new Error("DIR:VI identity mismatch");
  }
  if (NEXORA_VISUAL_INTELLIGENCE_BOUNDARY.requiresNexEnt) {
    throw new Error("DIR:VI must be reusable outside NEX-ENT");
  }
  if (NEXORA_VISUAL_INTELLIGENCE_BOUNDARY.writesEvidence) {
    throw new Error("DIR:VI must not write evidence");
  }
  if (NEXORA_VISUAL_INTELLIGENCE_BOUNDARY.equalsBusinessObject) {
    throw new Error("DIR:VI must not treat a view as a business Object");
  }
  if (NEXORA_VISUAL_INTELLIGENCE_BOUNDARY.fabricatesPeriods) {
    throw new Error("DIR:VI must not fabricate periods");
  }
  return Object.freeze({ ok: true as const });
}

/**
 * Certification/example observations from the ENT:6 production CSV fixture.
 * Two monthly OTD points. Not Data Reality. Not six fabricated months.
 */
export function nexoraExampleOperationsVisualEvidence(): NexoraVisualEvidenceBundle {
  return Object.freeze({
    acceptedIntoDataReality: false as const,
    series: Object.freeze([
      Object.freeze({
        id: "otd",
        fieldLabel: "OTD",
        displayLabel: "OTD (likely on-time delivery)",
        confidence: "LIKELY" as const,
        unit: null,
        sourceLabel: "example operations source",
        example: true,
        points: Object.freeze([
          Object.freeze({ periodLabel: "2026-05", value: 89.8 }),
          Object.freeze({ periodLabel: "2026-06", value: 90.1 }),
        ]),
      }),
      Object.freeze({
        id: "ord-qty",
        fieldLabel: "ORD_QTY",
        displayLabel: "ORD_QTY",
        confidence: "LIKELY" as const,
        unit: null,
        sourceLabel: "example operations source",
        example: true,
        points: Object.freeze([
          Object.freeze({ periodLabel: "2026-05", value: 1310 }),
          Object.freeze({ periodLabel: "2026-06", value: 1370 }),
        ]),
      }),
      Object.freeze({
        id: "value",
        fieldLabel: "value",
        displayLabel: "value",
        confidence: "UNKNOWN" as const,
        unit: null,
        sourceLabel: "example unknown-field source",
        example: true,
        points: Object.freeze([
          Object.freeze({ periodLabel: "2026-08", value: 4 }),
        ]),
      }),
    ]),
  });
}

export function resolveNexoraVisualView(input: {
  readonly purpose: NexoraVisualPurpose;
  readonly evidence: NexoraVisualEvidenceBundle | null | undefined;
  readonly subjectId?: string | null;
  readonly requestedMonths?: number | null;
  readonly requestedRepresentation?: NexoraVisualRepresentation | null;
  readonly comparableIds?: readonly string[] | null;
}): NexoraVisualResolution {
  verifyNexoraVisualIntelligence();
  if (input.purpose === "NONE") {
    return Object.freeze({
      status: "NONE",
      view: null,
      reason: "The request is not a visual of evidence.",
    });
  }
  const evidence = input.evidence;
  if (!evidence || evidence.series.length === 0) {
    return Object.freeze({
      status: "INSUFFICIENT_EVIDENCE",
      view: null,
      reason: "I don’t have supported observations to show yet.",
      offerAvailableTrend: false,
    });
  }

  if (input.purpose === "TREND") {
    const series = selectSeries(evidence, input.subjectId);
    if (series.status === "AMBIGUOUS") return series.resolution;
    if (series.selected.confidence === "UNKNOWN") {
      return Object.freeze({
        status: "INSUFFICIENT_EVIDENCE",
        view: null,
        reason: `I can see ${series.selected.fieldLabel}, but I don’t know what it means well enough to present it as a named trend.`,
        offerAvailableTrend: false,
      });
    }
    if (series.selected.points.length < 2) {
      return Object.freeze({
        status: "INSUFFICIENT_EVIDENCE",
        view: null,
        reason: `I only have the current ${series.selected.fieldLabel} value, so I can’t show a trend yet.`,
        offerAvailableTrend: false,
      });
    }
    if (
      input.requestedMonths != null &&
      series.selected.points.length < input.requestedMonths
    ) {
      return Object.freeze({
        status: "INSUFFICIENT_EVIDENCE",
        view: null,
        reason: `I only have ${series.selected.points.length} monthly observations for ${series.selected.fieldLabel}, so I can’t show ${input.requestedMonths} months. I can show the available trend instead.`,
        offerAvailableTrend: true,
      });
    }
    const representation =
      input.requestedRepresentation === "COMPARISON_BARS"
        ? "COMPARISON_BARS"
        : "TREND_LINE";
    return Object.freeze({
      status: "SUPPORTED",
      reason: "ordered-time-points",
      view: makeView({
        purpose: "TREND",
        representation,
        series: [series.selected],
      }),
    });
  }

  const left = evidence.series.find((item) => item.id === (input.comparableIds?.[0] ?? "otd"));
  const rightHint = input.comparableIds?.[1];
  if (!input.comparableIds || input.comparableIds.length < 2) {
    if (left && left.points.length >= 2 && !rightHint) {
      return Object.freeze({
        status: "AMBIGUOUS",
        view: null,
        reason: "unresolved-comparands",
        clarification:
          "Which two supported values do you want to compare — OTD across the two available periods, or something else?",
      });
    }
    return Object.freeze({
      status: "AMBIGUOUS",
      view: null,
      reason: "unresolved-comparands",
      clarification:
        "Which two supported values do you want to compare? I won’t guess.",
    });
  }
  if (input.comparableIds[0] === "otd-periods" || input.comparableIds[1] === "otd-periods") {
    const otd = evidence.series.find((item) => item.id === "otd");
    if (!otd || otd.points.length < 2) {
      return Object.freeze({
        status: "INSUFFICIENT_EVIDENCE",
        view: null,
        reason: "I don’t have two comparable OTD observations.",
        offerAvailableTrend: false,
      });
    }
    if (otd.confidence === "UNKNOWN") {
      return Object.freeze({
        status: "INSUFFICIENT_EVIDENCE",
        view: null,
        reason: "I won’t present an unknown field as a named comparison.",
        offerAvailableTrend: false,
      });
    }
    const periodSeries = otd.points.map((point, index) =>
      Object.freeze({
        ...otd,
        id: `${otd.id}-${point.periodLabel}`,
        displayLabel: `${seriesLabel(otd)} · ${point.periodLabel}`,
        points: Object.freeze([point]),
      }),
    );
    return Object.freeze({
      status: "SUPPORTED",
      reason: "comparable-periods",
      view: makeView({
        purpose: "COMPARE",
        representation: "COMPARISON_BARS",
        series: periodSeries,
      }),
    });
  }
  const right = evidence.series.find((item) => item.id === input.comparableIds?.[1]);
  if (!left || !right) {
    return Object.freeze({
      status: "INSUFFICIENT_EVIDENCE",
      view: null,
      reason: "Those subjects are not comparable under the available evidence.",
      offerAvailableTrend: false,
    });
  }
  if (left.unit !== right.unit) {
    return Object.freeze({
      status: "INSUFFICIENT_EVIDENCE",
      view: null,
      reason:
        "I won’t invent a common unit to compare those fields. They aren’t comparable on the evidence I have.",
      offerAvailableTrend: false,
    });
  }
  return Object.freeze({
    status: "SUPPORTED",
    reason: "comparable-subjects",
    view: makeView({
      purpose: "COMPARE",
      representation: "COMPARISON_BARS",
      series: [left, right],
    }),
  });
}

export function composeNexoraVisualAdvisorCopy(
  resolution: NexoraVisualResolution,
  kind:
    | "PRESENT"
    | "EXPLAIN"
    | "WHY"
    | "PROVENANCE"
    | "CAUSE"
    | "DECISION"
    | "DISMISS" = "PRESENT",
): string {
  if (kind === "DISMISS") {
    return "I’ve put the view away. The source and evidence are unchanged.";
  }
  if (resolution.status === "AMBIGUOUS") return resolution.clarification;
  if (resolution.status === "INSUFFICIENT_EVIDENCE") return resolution.reason;
  if (resolution.status === "NONE") return resolution.reason;
  const view = resolution.view;
  const series = view.series[0];
  if (kind === "WHY") {
    if (view.purpose === "TREND") {
      return `Because you asked how ${series.fieldLabel} changed over time, and the source has ordered observations across those periods.`;
    }
    return "Because you asked to compare supported values, and those observations share a comparable measure.";
  }
  if (kind === "PROVENANCE") {
    const example = view.provenance.example ? " This is example data, not your accepted business library." : "";
    return `This view uses ${view.provenance.fieldLabels.join(" and ")} from the ${view.provenance.sourceLabel} across ${view.provenance.periodLabel}.${example} Nexora did not calculate new business values for the chart.`;
  }
  if (kind === "CAUSE") {
    return "No. It shows the pattern. We would need stronger evidence before treating anything as the cause.";
  }
  if (kind === "DECISION") {
    return "No. This view does not choose a Scenario or commit a Decision. You remain the one who decides.";
  }
  if (kind === "EXPLAIN") {
    if (view.purpose === "TREND" && series.points.length >= 2) {
      const first = series.points[0];
      const last = series.points[series.points.length - 1];
      const direction = last.value > first.value ? "higher" : last.value < first.value ? "lower" : "unchanged";
      return `This shows how ${seriesLabel(series)} changed across the ${series.points.length} available periods, from ${first.value} to ${last.value}. The later period is ${direction}. This tells us what changed, not what caused it.`;
    }
    return `This view compares the supported ${view.provenance.fieldLabels.join(" and ")} values. It does not pick a winner.`;
  }
  if (view.purpose === "TREND") {
    return `I’ll show the available ${series.fieldLabel} trend so you can see how it changed. You didn’t need to choose a chart.`;
  }
  return "I’ll compare the two supported observations. This does not pick a winner.";
}

export function applyNexoraVisualViewRuntime(input: {
  readonly previous?: NexoraVisualViewRuntime | null;
  readonly request?: NexoraVisualView | null;
  readonly dismiss?: boolean;
}): NexoraVisualViewRuntime {
  if (input.dismiss === true) return emptyNexoraVisualViewRuntime();
  if (input.request !== undefined) {
    return Object.freeze({ view: input.request });
  }
  return input.previous ?? emptyNexoraVisualViewRuntime();
}

function selectSeries(
  evidence: NexoraVisualEvidenceBundle,
  subjectId: string | null | undefined,
):
  | { readonly status: "OK"; readonly selected: NexoraVisualSeries }
  | { readonly status: "AMBIGUOUS"; readonly resolution: NexoraVisualResolution } {
  if (subjectId) {
    const named = evidence.series.find((item) => item.id === subjectId);
    if (named) return { status: "OK", selected: named };
    if (subjectId === "delivery") {
      const otd = evidence.series.find((item) => item.id === "otd");
      if (otd) return { status: "OK", selected: otd };
    }
  }
  const trendable = evidence.series.filter(
    (item) => item.points.length >= 2 && item.confidence !== "UNKNOWN",
  );
  if (trendable.length === 1) return { status: "OK", selected: trendable[0] };
  if (trendable.length > 1) {
    return {
      status: "AMBIGUOUS",
      resolution: Object.freeze({
        status: "AMBIGUOUS",
        view: null,
        reason: "unresolved-subject",
        clarification:
          "Which trend do you want to see — OTD or ORD_QTY?",
      }),
    };
  }
  const first = evidence.series[0];
  return { status: "OK", selected: first };
}

function seriesLabel(series: NexoraVisualSeries): string {
  return series.confidence === "CONFIRMED" ? series.displayLabel : series.displayLabel;
}

function makeView(input: {
  readonly purpose: Exclude<NexoraVisualPurpose, "NONE">;
  readonly representation: NexoraVisualRepresentation;
  readonly series: readonly NexoraVisualSeries[];
}): NexoraVisualView {
  const first = input.series[0];
  const periods = unique(
    input.series.flatMap((item) => item.points.map((point) => point.periodLabel)),
  );
  return Object.freeze({
    viewId: `${input.purpose.toLowerCase()}-${first.id}-${periods.join("-")}`,
    purpose: input.purpose,
    representation: input.representation,
    title:
      input.purpose === "TREND"
        ? `${first.displayLabel} over time`
        : `Comparison of ${input.series.map((item) => item.fieldLabel).join(" and ")}`,
    description:
      input.purpose === "TREND"
        ? `Observed ${first.fieldLabel} across ${periods.join(" and ")}.`
        : `Supported comparison of ${input.series.map((item) => item.fieldLabel).join(" and ")}.`,
    series: Object.freeze([...input.series]),
    provenance: Object.freeze({
      sourceLabel: first.sourceLabel,
      fieldLabels: Object.freeze(input.series.map((item) => item.fieldLabel)),
      periodLabel: periods.join(" and "),
      example: first.example,
    }),
    isBusinessObject: false as const,
    isDataObject: false as const,
    isDecision: false as const,
    mutatesFocus: false as const,
  });
}

function unique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)]);
}
