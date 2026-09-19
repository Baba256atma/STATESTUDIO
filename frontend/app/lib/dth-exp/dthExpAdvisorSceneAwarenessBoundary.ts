/**
 * NPA-T DTH-EXP:7A — Theatre enriches Advisor context. Existing conversation owns referents.
 */

import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { ECA_WORKING_CONTEXT_IDENTITY } from "@/app/lib/nexora-conversation/ecaWorkingConversationContext.ts";
import { conversationalExperienceIdentity } from "@/app/lib/conversational-control/conversationalExperience.ts";

export const DTH_EXP_ADVISOR_SCENE_AWARENESS_BOUNDARY = Object.freeze({
  identity: "NPA-T DTH-EXP:7A/AdvisorSceneAwarenessBoundary" as const,
  engine: "DTH-EXP:7A/SceneAwarenessSnapshot",
  advisor: conversationalExperienceIdentity,
  eca: ECA_WORKING_CONTEXT_IDENTITY,
  referent: "CC:5 / ECA / NCA / MO existing referent authority",
  director: nexoraSemanticPresentationDirectorIdentity,
  stage: "NEX-MVP:3 / NEX-MVP:4",
  evidence: "CC:8",
  vai: "VAI:1–8",
  decision: "CC:10",
  execution: "CC:11",
  outcomeLearning: "CORE-OUT / DTH:11–12",
  parallelAdvisor: false as const,
  parallelReferentResolver: false as const,
  parallelConversationStore: false as const,
  parallelNlu: false as const,
  visualFocusIsIdentityAuthority: false as const,
  labelIsIdentityAuthority: false as const,
  positionIsIdentityAuthority: false as const,
  sizeIsIdentityAuthority: false as const,
  animationCreatesSelection: false as const,
  evidenceProminenceCreatesSubject: false as const,
  requestsSceneChange: false as const,
  startsDthExp7B: false as const,
  liveStageWiring: false as const,
  writesDecision: false as const,
  writesExecution: false as const,
  writesOutcome: false as const,
  assignsVaiRoles: false as const,
  upgradesCausality: false as const,
});

export function verifyDthExpAdvisorSceneAwarenessBoundary(): { readonly ok: true } {
  if (DTH_EXP_ADVISOR_SCENE_AWARENESS_BOUNDARY.parallelAdvisor) {
    throw new Error("DTH-EXP:7A must not create a second Advisor");
  }
  if (DTH_EXP_ADVISOR_SCENE_AWARENESS_BOUNDARY.parallelReferentResolver) {
    throw new Error("DTH-EXP:7A must not create a second referent resolver");
  }
  if (DTH_EXP_ADVISOR_SCENE_AWARENESS_BOUNDARY.requestsSceneChange) {
    throw new Error("DTH-EXP:7A must not request scene changes");
  }
  if (DTH_EXP_ADVISOR_SCENE_AWARENESS_BOUNDARY.startsDthExp7B) {
    throw new Error("DTH-EXP:7A must not start DTH-EXP:7B");
  }
  return Object.freeze({ ok: true as const });
}
