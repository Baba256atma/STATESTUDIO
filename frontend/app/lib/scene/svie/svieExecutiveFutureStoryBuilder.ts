/**
 * SVIE:4:7 — Build executive future stories from scenario impact chains (read-only).
 */

import type { SvieScenarioInput, SvieScenarioVisualLink } from "./svieScenarioLinkFoundationContract.ts";
import { buildScenarioImpactChain } from "./svieScenarioImpactChainBuilder.ts";
import type {
  SvieExecutiveFutureStory,
  SvieExecutiveFutureStoryConnection,
  SvieExecutiveFutureStoryNode,
  SvieExecutiveFutureStoryNodeRole,
} from "./svieExecutiveFutureStoryLayerContract.ts";

const ROLE_RANK: Record<SvieExecutiveFutureStoryNodeRole, number> = {
  future_outcome: 4,
  future_recommendation: 3,
  future_impact: 2,
  future_cause: 1,
};

function normalizeObjectId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function assignRole(
  rolesByObjectId: Map<string, SvieExecutiveFutureStoryNodeRole>,
  objectId: string,
  role: SvieExecutiveFutureStoryNodeRole
): void {
  const existing = rolesByObjectId.get(objectId);
  if (!existing || ROLE_RANK[role] > ROLE_RANK[existing]) {
    rolesByObjectId.set(objectId, role);
  }
}

export function buildExecutiveFutureStory(input: {
  link: SvieScenarioVisualLink;
  scenario?: SvieScenarioInput | null;
  sceneJson?: unknown;
}): SvieExecutiveFutureStory | null {
  const chain = buildScenarioImpactChain({
    link: input.link,
    scenario: input.scenario ?? null,
    sceneJson: input.sceneJson,
  });
  if (!chain || chain.steps.length === 0) return null;

  const rolesByObjectId = new Map<string, SvieExecutiveFutureStoryNodeRole>();
  const stepObjectIds = chain.steps.map((step) => step.objectId);
  const lastIndex = stepObjectIds.length - 1;

  stepObjectIds.forEach((objectId, index) => {
    if (index === 0) {
      assignRole(rolesByObjectId, objectId, "future_cause");
      return;
    }
    if (index === lastIndex) {
      assignRole(rolesByObjectId, objectId, "future_outcome");
      return;
    }
    if (index === lastIndex - 1) {
      assignRole(rolesByObjectId, objectId, "future_recommendation");
      return;
    }
    assignRole(rolesByObjectId, objectId, "future_impact");
  });

  const nodes: SvieExecutiveFutureStoryNode[] = chain.steps.map((step, storyIndex) =>
    Object.freeze({
      objectId: step.objectId,
      label: step.label,
      role: rolesByObjectId.get(step.objectId) ?? "future_impact",
      storyIndex,
    })
  );

  const connections: SvieExecutiveFutureStoryConnection[] = chain.connections.map((connection) =>
    Object.freeze({
      fromObjectId: connection.fromObjectId,
      toObjectId: connection.toObjectId,
      storyIndex: connection.stepIndex,
    })
  );

  return Object.freeze({
    scenarioId: input.link.scenarioId,
    nodes: Object.freeze(nodes),
    connections: Object.freeze(connections),
    confidence: input.link.confidence,
  });
}

export function buildExecutiveFutureStories(input: {
  links: readonly SvieScenarioVisualLink[];
  scenarios?: readonly SvieScenarioInput[];
  sceneJson?: unknown;
}): readonly SvieExecutiveFutureStory[] {
  const scenarioById = new Map(
    (input.scenarios ?? [])
      .map((scenario) => [normalizeObjectId(scenario.scenarioId), scenario] as const)
      .filter((entry): entry is [string, SvieScenarioInput] => Boolean(entry[0]))
  );

  return Object.freeze(
    input.links
      .map((link) =>
        buildExecutiveFutureStory({
          link,
          scenario: scenarioById.get(link.scenarioId) ?? null,
          sceneJson: input.sceneJson,
        })
      )
      .filter((story): story is SvieExecutiveFutureStory => story !== null)
      .sort((left, right) => left.scenarioId.localeCompare(right.scenarioId))
  );
}

export function buildSvieExecutiveFutureStorySignature(input: {
  links: readonly SvieScenarioVisualLink[];
  scenarios?: readonly SvieScenarioInput[];
  sceneJson?: unknown;
}): string {
  const stories = buildExecutiveFutureStories(input);
  return `svie:executive-future-story:${JSON.stringify(stories)}`;
}
