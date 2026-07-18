/**
 * UI-PIPE-1:1 — Pipeline Page Selectors.
 *
 * Pure selectors for step statuses and run eligibility.
 * Ownership: owned exclusively by UI-PIPE-1.
 */

import {
  PIPELINE_STEPS,
  type PipelinePageState,
  type PipelineStepStatus,
  type PipelineStepView,
} from "./pipelinePageTypes.ts";
import type { PipelineReviewStatus } from "./pipelinePreviewTypes.ts";

/** Whether Run Preview should be enabled for the current state. */
export function canRunPipelinePreview(state: PipelinePageState): boolean {
  return state.canRun && !state.isBusy;
}

/** Derive pipeline flow step statuses from canonical page state. */
export function getPipelineStepStatuses(
  state: PipelinePageState,
  reviewStatus: PipelineReviewStatus = "NotStarted",
): readonly PipelineStepView[] {
  const statusFor = (id: (typeof PIPELINE_STEPS)[number]): PipelineStepStatus => {
    const { status, activeStep } = state;

    if (reviewStatus === "ReadyForUnderstanding") {
      if (id === "Review") {
        return "Complete";
      }
      return "Complete";
    }

    if (reviewStatus === "Blocked" && id === "Review") {
      return "Failed";
    }

    if (status === "Failed") {
      if (id === "Review" || id === activeStep) {
        return "Failed";
      }
      const order = PIPELINE_STEPS.indexOf(id);
      const activeOrder = PIPELINE_STEPS.indexOf(activeStep);
      if (order < activeOrder) {
        return "Complete";
      }
      return "Pending";
    }

    if (status === "PreviewWithWarnings") {
      if (id === "Review") {
        return reviewStatus === "Reviewing" ? "Active" : "Warning";
      }
      return "Complete";
    }

    if (status === "PreviewReady") {
      if (id === "Review") {
        return reviewStatus === "Reviewing" ? "Active" : "Pending";
      }
      return "Complete";
    }

    if (id === activeStep) {
      return "Active";
    }

    const order = PIPELINE_STEPS.indexOf(id);
    const activeOrder = PIPELINE_STEPS.indexOf(activeStep);
    if (order < activeOrder) {
      return "Complete";
    }
    return "Pending";
  };

  return Object.freeze(
    PIPELINE_STEPS.map((id) =>
      Object.freeze({
        id,
        label: id,
        status: statusFor(id),
      }),
    ),
  );
}
