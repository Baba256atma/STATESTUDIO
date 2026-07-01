import type { ExecutiveExplanation, ExecutiveReasoningChain, ExecutiveReasoningSession } from "./executiveReasoningTypes.ts";

export function buildExecutiveReasoningExplanation(
  session: ExecutiveReasoningSession,
  chain: ExecutiveReasoningChain
): ExecutiveExplanation {
  const nonRootNodes = chain.nodes.filter((node) => node.parentId !== null);
  const why = Object.freeze([`Why: ${session.input.situation}`]);
  const because = Object.freeze(
    nonRootNodes.map((node) => `Because: ${node.step} is supported by ${node.evidenceReference}.`)
  );
  const therefore = Object.freeze(
    nonRootNodes.length === 0
      ? ["Therefore: the reasoning remains at context normalization."]
      : [`Therefore: ${nonRootNodes.length} reasoning steps are transparent and traceable.`]
  );

  return Object.freeze({
    explanationId: `explanation:${session.sessionId}`,
    why,
    because,
    therefore,
    narrative: [...why, ...because, ...therefore].join(" "),
  });
}
