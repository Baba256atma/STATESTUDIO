/**
 * B.27 — Pilot runbook / operator readiness (workflow contract + step resolution).
 */

import { getNexoraProductMode } from "../product/nexoraProductMode.ts";

export type NexoraRunbookStep = {
  id: string;
  title: string;
  description: string;
  expectedOutcome?: string;
};

export type NexoraRunbookStepId = "input" | "analysis" | "compare" | "decision" | "learn";

export const NEXORA_OPERATOR_RUNBOOK: NexoraRunbookStep[] = [
  {
    id: "input",
    title: "1. Input situation",
    description: "Describe your situation or add sources (text, web, CSV).",
    expectedOutcome: "System detects signals",
  },
  {
    id: "analysis",
    title: "2. Analyze system",
    description: "Run assessment to see fragility and key drivers.",
    expectedOutcome: "Fragility level + drivers visible",
  },
  {
    id: "compare",
    title: "3. Compare options",
    description: "Review scenario options (conservative / balanced / aggressive).",
    expectedOutcome: "Recommended option identified",
  },
  {
    id: "decision",
    title: "4. Decide action",
    description: "Select a direction based on insight and risk.",
    expectedOutcome: "Decision context formed",
  },
  {
    id: "learn",
    title: "5. Record outcome",
    description: "After execution, record result to improve future decisions.",
    expectedOutcome: "System learns from outcome",
  },
];

export type NexoraRunbookResolveInput = {
  pipelineStatus: "idle" | "processing" | "ready" | "error";
  centerCompareOpen: boolean;
  rightPanelCompareOpen: boolean;
  hasB7Decision: boolean;
  hasRecordedOutcome: boolean;
};

/**
 * Priority: learn → compare → decision → analysis → input (matches pilot test expectations).
 */
export function resolveRunbookStep(state: NexoraRunbookResolveInput): NexoraRunbookStepId {
  if (state.hasRecordedOutcome) return "learn";
  if (state.centerCompareOpen || state.rightPanelCompareOpen) return "compare";
  if (state.hasB7Decision) return "decision";
  if (state.pipelineStatus === "ready") return "analysis";
  return "input";
}

export const NEXORA_RUNBOOK_MICRO_HINTS: Record<NexoraRunbookStepId, string> = {
  input: "Start by describing a situation",
  analysis: "Review what's driving the system",
  compare: "Compare risk vs reward",
  decision: "You can simulate or act",
  learn: "System updated from real result",
};

export type NexoraRunbookSurfaceHints = {
  commandBar: string | null;
  comparePanel: string | null;
  pipelineAfterAnalysis: string | null;
  pipelineAfterDecision: string | null;
  pipelineAfterOutcome: string | null;
};

export function buildRunbookSurfaceHints(stepId: NexoraRunbookStepId): NexoraRunbookSurfaceHints {
  if (getNexoraProductMode() === "pilot") {
    return {
      commandBar: null,
      comparePanel: null,
      pipelineAfterAnalysis: null,
      pipelineAfterDecision: null,
      pipelineAfterOutcome: null,
    };
  }
  return {
    commandBar: stepId === "input" ? NEXORA_RUNBOOK_MICRO_HINTS.input : null,
    comparePanel: stepId === "compare" ? NEXORA_RUNBOOK_MICRO_HINTS.compare : null,
    pipelineAfterAnalysis: stepId === "analysis" ? NEXORA_RUNBOOK_MICRO_HINTS.analysis : null,
    pipelineAfterDecision: stepId === "decision" ? NEXORA_RUNBOOK_MICRO_HINTS.decision : null,
    pipelineAfterOutcome: stepId === "learn" ? NEXORA_RUNBOOK_MICRO_HINTS.learn : null,
  };
}

export function logRunbookStepChangedIfDev(from: string, to: string): void {
  if (process.env.NODE_ENV === "production") return;
  if (getNexoraProductMode() === "pilot") return;
  globalThis.console?.debug?.("[Nexora][B27] runbook_step_changed", { from, to });
}

/** Hide demo CTA when `NEXT_PUBLIC_NEXORA_HIDE_RUNBOOK_DEMO=true`. */
export function shouldShowRunbookDemoButton(): boolean {
  if (getNexoraProductMode() === "pilot") return false;
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_NEXORA_HIDE_RUNBOOK_DEMO === "true") {
    return false;
  }
  return true;
}
