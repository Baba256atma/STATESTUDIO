import type { TimelineStage, TimelineTrend } from "./timelineIntelligenceTypes.ts";

function normalizeFocus(value: unknown): string {
  const text = String(value ?? "").trim().replace(/\s+/g, " ");
  return text.length ? text : "the current operating model";
}

export function labelForTimelineStage(stage: TimelineStage): string {
  switch (stage) {
    case "early_signal":
      return "Early Signal";
    case "emerging_pressure":
      return "Emerging Pressure";
    case "active_risk":
      return "Active Risk";
    case "stabilization":
      return "Stabilization";
    case "monitoring":
      return "Monitoring";
  }
}

export function buildTimelineTitle(params: {
  trend: TimelineTrend;
  focus?: string;
}): string {
  const focus = normalizeFocus(params.focus);
  switch (params.trend) {
    case "critical":
      return `Critical momentum around ${focus}`;
    case "degrading":
      return `${focus} is degrading`;
    case "volatile":
      return `${focus} remains volatile`;
    case "improving":
      return `${focus} is stabilizing`;
    case "stable":
      return `${focus} is stable`;
  }
}

export function buildTimelineSummary(params: {
  trend: TimelineTrend;
  focus?: string;
}): string {
  const focus = normalizeFocus(params.focus);
  switch (params.trend) {
    case "critical":
      return `Dependency pressure around ${focus} requires immediate executive attention.`;
    case "degrading":
      return `Operational exposure is expanding around ${focus}.`;
    case "volatile":
      return `System stability remains volatile around ${focus}.`;
    case "improving":
      return `Pressure around ${focus} appears to be stabilizing.`;
    case "stable":
      return `Current movement around ${focus} is stable and suitable for monitoring.`;
  }
}

export function buildExecutiveImpact(params: {
  trend: TimelineTrend;
  focus?: string;
}): string {
  const focus = normalizeFocus(params.focus);
  switch (params.trend) {
    case "critical":
      return `Timing matters now: unresolved pressure around ${focus} may constrain executive options.`;
    case "degrading":
      return `Escalation momentum may reduce flexibility if ${focus} is not addressed soon.`;
    case "volatile":
      return `${focus} should be reviewed before committing to irreversible moves.`;
    case "improving":
      return `Stabilization around ${focus} may support a controlled next move.`;
    case "stable":
      return `No immediate escalation is visible around ${focus}.`;
  }
}

export function buildRecommendedTimelineAttention(params: {
  trend: TimelineTrend;
  focus?: string;
}): string {
  const focus = normalizeFocus(params.focus);
  switch (params.trend) {
    case "critical":
      return `Act on ${focus} immediately.`;
    case "degrading":
      return `Review ${focus} before the next operational stage.`;
    case "volatile":
      return `Keep ${focus} in urgent review until movement settles.`;
    case "improving":
      return `Maintain stabilization checks around ${focus}.`;
    case "stable":
      return `Keep ${focus} in monitoring mode.`;
  }
}
