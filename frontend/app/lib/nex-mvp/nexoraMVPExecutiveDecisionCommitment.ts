/**
 * CC:10R / CC:10R.1 MVP bridge — Decision Runtime adapter helpers.
 */

import {
  createNexoraCanonicalDecisionRuntime,
  type NexoraCanonicalDecisionRuntime,
} from "@/app/lib/conversational-control/executiveDecisionRuntimeAdapter.ts";
import { bootstrapCanonicalDecisionsFromFlowFixtures } from "@/app/lib/conversational-control/executiveDecisionStatusProjection.ts";
import {
  getExecutiveDecisionRuntimeConvergenceIdentity,
} from "@/app/lib/conversational-control/executiveDecisionRuntimeConvergence.ts";
import { createInitialNexoraMVPFlowDecisionRecords } from "@/app/lib/nex-mvp/nexoraMVPExecutiveFlowFixtures.ts";

export function createNexoraMVPExecutiveDecisionRuntime(): NexoraCanonicalDecisionRuntime {
  return createNexoraCanonicalDecisionRuntime({
    authorityId: "nexora.mvp.executive-decision-runtime",
  });
}

/**
 * Seeded from flowDomain Decision fixtures — same bootstrap as Executive Shell.
 * Fixture definitions are read-only; Runtime is product authority after seed.
 */
export function createNexoraMVPFlowSeededDecisionRuntime(): NexoraCanonicalDecisionRuntime {
  return createNexoraCanonicalDecisionRuntime({
    authorityId: "nexora.mvp.flow-seeded-decision-runtime",
    initialDecisions: bootstrapCanonicalDecisionsFromFlowFixtures(
      createInitialNexoraMVPFlowDecisionRecords(),
    ),
  });
}

export function getNexoraMVPExecutiveDecisionRuntimeConvergenceIdentity() {
  return getExecutiveDecisionRuntimeConvergenceIdentity();
}
