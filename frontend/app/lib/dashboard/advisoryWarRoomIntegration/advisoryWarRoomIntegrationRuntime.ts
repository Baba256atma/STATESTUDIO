/**
 * Phase 5:6 — Advisory–War Room Integration Runtime (single integration owner).
 */

import type {
  AdvisoryWarRoomIntegrationBundle,
  AdvisoryWarRoomIntegrationInput,
} from "./advisoryWarRoomIntegrationContract.ts";
import {
  ADVISORY_WAR_ROOM_INTEGRATION_VERSION,
  CANONICAL_ADVISORY_WAR_ROOM_INTEGRATION_OWNER,
} from "./advisoryWarRoomIntegrationContract.ts";
import { buildAdvisoryWarRoomIntegrationBundle } from "./advisoryWarRoomIntegrationPropagation.ts";
import {
  reportAdvisoryTransformation,
  reportAdvisoryWarRoomIntegration,
  reportConfidencePropagation,
  reportExplainabilityPropagation,
  reportGuidanceDelivery,
  reportTradeoffPropagation,
  reportWarRoomIntake,
} from "./advisoryWarRoomIntegrationLogging.ts";
import { runAdvisoryWarRoomIntegrationProtection } from "./advisoryWarRoomIntegrationProtection.ts";

let lastSignature: string | null = null;
let lastBundle: AdvisoryWarRoomIntegrationBundle | null = null;

function buildSignature(input: AdvisoryWarRoomIntegrationInput): string {
  return JSON.stringify({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    objectId: input.selectedObjectId ?? null,
    timelineActive: input.timelineActive ?? false,
  });
}

export function resolveAdvisoryWarRoomIntegration(
  input: AdvisoryWarRoomIntegrationInput
): AdvisoryWarRoomIntegrationBundle {
  const signature = buildSignature(input);
  if (lastSignature === signature && lastBundle) return lastBundle;

  const bundle = buildAdvisoryWarRoomIntegrationBundle(input);

  lastSignature = signature;
  lastBundle = bundle;

  reportWarRoomIntake(bundle.intake);
  reportAdvisoryTransformation(bundle.transformation);
  reportConfidencePropagation(bundle.confidencePropagation);
  reportExplainabilityPropagation(bundle.explainabilityPropagation);
  reportTradeoffPropagation(bundle.tradeoffPropagation);
  reportGuidanceDelivery(bundle.guidanceDelivery);
  reportAdvisoryWarRoomIntegration(bundle);

  return bundle;
}

/** Approved feed for Executive Summary. */
export function getAdvisoryWarRoomIntegrationForExecutiveSummary(
  input: AdvisoryWarRoomIntegrationInput
): AdvisoryWarRoomIntegrationBundle {
  return resolveAdvisoryWarRoomIntegration(input);
}

/** Approved feed for War Room intelligence surface. */
export function getAdvisoryWarRoomIntegrationForWarRoom(
  input: AdvisoryWarRoomIntegrationInput
): AdvisoryWarRoomIntegrationBundle {
  return resolveAdvisoryWarRoomIntegration(input);
}

/** Approved feed for Decision Guidance surface. */
export function getAdvisoryWarRoomIntegrationForDecisionGuidance(
  input: AdvisoryWarRoomIntegrationInput
): AdvisoryWarRoomIntegrationBundle {
  return resolveAdvisoryWarRoomIntegration(input);
}

export function initializeAdvisoryWarRoomIntegrationRuntime(
  input: AdvisoryWarRoomIntegrationInput
): AdvisoryWarRoomIntegrationBundle {
  runAdvisoryWarRoomIntegrationProtection();
  if (process.env.NODE_ENV !== "production") {
    globalThis.console?.info?.("[Nexora][AdvisoryWarRoomIntegration]", {
      phase: "runtime_init",
      owner: CANONICAL_ADVISORY_WAR_ROOM_INTEGRATION_OWNER,
      version: ADVISORY_WAR_ROOM_INTEGRATION_VERSION,
      dashboardContext: input.dashboardContext,
    });
  }
  return resolveAdvisoryWarRoomIntegration(input);
}

export function resetAdvisoryWarRoomIntegrationRuntimeForTests(): void {
  lastSignature = null;
  lastBundle = null;
}
