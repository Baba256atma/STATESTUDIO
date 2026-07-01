import type {
  ExecutiveReasoningChain,
  ExecutiveReasoningComponents,
  ExecutiveReasoningNode,
  ExecutiveReasoningSession,
} from "./executiveReasoningTypes.ts";

function node(id: string, parentId: string | null, step: string, evidenceReference: string, explanation: string): ExecutiveReasoningNode {
  return Object.freeze({ id, parentId, step, evidenceReference, explanation });
}

export function buildExecutiveReasoningChain(
  session: ExecutiveReasoningSession,
  components: ExecutiveReasoningComponents
): ExecutiveReasoningChain {
  const nodes: ExecutiveReasoningNode[] = [
    node(
      `node:${session.sessionId}:context`,
      null,
      "Normalize executive reasoning context",
      session.sessionId,
      `The situation is considered as structured context: ${session.input.situation}.`
    ),
  ];
  let parentId = nodes[0].id;

  components.causalLinks.forEach((link) => {
    const id = `node:causal:${link.id}`;
    nodes.push(node(id, parentId, `Trace cause ${link.fromId} to effect ${link.toId}`, link.id, link.evidence));
    parentId = id;
  });

  components.dependencies.forEach((dependency) => {
    const id = `node:dependency:${dependency.id}`;
    nodes.push(
      node(
        id,
        parentId,
        `Trace dependency ${dependency.sourceId} to ${dependency.targetId}`,
        dependency.evidenceReferences.join("|"),
        `Dependency path is ${dependency.path.join(" -> ")}.`
      )
    );
    parentId = id;
  });

  components.constraints.forEach((constraint) => {
    const id = `node:constraint:${constraint.id}`;
    nodes.push(node(id, parentId, `Apply constraint ${constraint.id}`, constraint.id, constraint.consequence));
    parentId = id;
  });

  components.assumptions.forEach((assumption) => {
    const id = `node:assumption:${assumption.id}`;
    nodes.push(node(id, parentId, `Evaluate assumption ${assumption.id}`, assumption.id, assumption.impact));
    parentId = id;
  });

  components.tradeoffs.forEach((tradeoff) => {
    const id = `node:tradeoff:${tradeoff.id}`;
    nodes.push(node(id, parentId, `Expose trade-off ${tradeoff.left} and ${tradeoff.right}`, tradeoff.id, tradeoff.tension));
    parentId = id;
  });

  components.alternatives.forEach((alternative) => {
    const id = `node:alternative:${alternative.id}`;
    nodes.push(node(id, parentId, alternative.pathLabel, alternative.basedOnNodeIds.join("|"), alternative.explanation));
    parentId = id;
  });

  return Object.freeze({
    chainId: `chain:${session.sessionId}`,
    nodes: Object.freeze(nodes),
  });
}
