import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type { ExecutiveCapabilityVerification, ExecutivePublicationSummary, MVPCompletionState, PublicationRecommendation, PublishRisk } from "./mvpCompletionTypes.ts";

export function generateExecutivePublicationSummary(input: {
  state: MVPCompletionState;
  recommendation: PublicationRecommendation;
  capabilities: readonly ExecutiveCapabilityVerification[];
  risks: readonly PublishRisk[];
}): ExecutivePublicationSummary {
  const unresolved = input.capabilities.filter((capability) => !capability.ready).map((capability) => capability.missingOrIncomplete ?? capability.capabilityId).slice(0, 5);
  const riskText = input.risks.map((risk) => risk.rationale).slice(0, 5);
  const verifiedStrengths = input.capabilities.filter((capability) => capability.ready).map((capability) => capability.capabilityId).slice(0, 6);
  const isMVPComplete = input.state === "MVP_complete" || input.state === "publish_ready";
  const isPublishReady = input.state === "publish_ready" && input.recommendation === "publish_MVP";
  const shouldHappenNext = isPublishReady
    ? ["Human approval required before MVP publication.", "Prepare controlled publication checklist."]
    : input.recommendation === "controlled_release"
      ? ["Proceed with controlled release review before publication."]
      : ["Resolve remaining completion risks.", "Re-run final MVP completion evaluation."];
  return {
    isMVPComplete,
    isPublishReady,
    unresolved: Object.freeze(unresolved.length ? unresolved : ["No incomplete capability detected."]),
    risks: Object.freeze(riskText.length ? riskText : ["No material publish risk detected."]),
    verifiedStrengths: Object.freeze(verifiedStrengths),
    shouldHappenNext: Object.freeze(shouldHappenNext),
    headline: isPublishReady ? "Nexora is publish-ready pending human approval." : isMVPComplete ? "Nexora is MVP-complete and awaiting publish readiness clearance." : "Nexora requires additional completion work.",
    signature: stableSignature(["d10-publication-summary", input.state, input.recommendation, unresolved, riskText, verifiedStrengths, shouldHappenNext]),
  };
}
