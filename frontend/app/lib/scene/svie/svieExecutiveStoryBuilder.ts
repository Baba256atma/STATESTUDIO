/**
 * SVIE:3:5 — Build executive stories from cause chains and recommendations (read-only).
 */

import type { SvieAdvisoryFindingInput, SvieAdvisoryVisualLink } from "./svieAdvisoryLinkFoundationContract.ts";
import { deriveCauseChain } from "./svieCauseChainDerivation.ts";
import { deriveRecommendationHierarchy } from "./svieRecommendationHierarchyDerivation.ts";
import type {
  SvieExecutiveStory,
  SvieExecutiveStoryConnection,
  SvieExecutiveStoryNode,
  SvieExecutiveStoryNodeRole,
} from "./svieExecutiveStoryLayerContract.ts";

const ROLE_RANK: Record<SvieExecutiveStoryNodeRole, number> = {
  recommendation: 4,
  impact: 3,
  cause: 2,
  start: 1,
};

function normalizeObjectId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function assignRole(
  rolesByObjectId: Map<string, SvieExecutiveStoryNodeRole>,
  objectId: string,
  role: SvieExecutiveStoryNodeRole
): void {
  const existing = rolesByObjectId.get(objectId);
  if (!existing || ROLE_RANK[role] > ROLE_RANK[existing]) {
    rolesByObjectId.set(objectId, role);
  }
}

export function buildExecutiveStory(input: {
  link: SvieAdvisoryVisualLink;
  finding?: SvieAdvisoryFindingInput | null;
  sceneJson?: unknown;
}): SvieExecutiveStory | null {
  const causeChain = deriveCauseChain({
    link: input.link,
    finding: input.finding ?? null,
    sceneJson: input.sceneJson,
  });
  if (!causeChain || causeChain.steps.length === 0) return null;

  const recommendation = deriveRecommendationHierarchy({
    link: input.link,
    finding: input.finding ?? null,
    sceneJson: input.sceneJson,
  });

  const rolesByObjectId = new Map<string, SvieExecutiveStoryNodeRole>();
  const stepObjectIds = causeChain.steps.map((step) => step.objectId);

  assignRole(rolesByObjectId, stepObjectIds[0]!, "start");

  const recommendationObjectId =
    recommendation?.rankedObjects.find((entry) => entry.tier === 1)?.objectId ?? null;
  if (recommendationObjectId) {
    assignRole(rolesByObjectId, recommendationObjectId, "recommendation");
  }

  const impactCandidates = stepObjectIds.slice(Math.max(1, stepObjectIds.length - 2));
  for (const objectId of impactCandidates) {
    if (objectId === stepObjectIds[0]) continue;
    assignRole(rolesByObjectId, objectId, "impact");
  }

  for (const step of causeChain.steps) {
    if (!rolesByObjectId.has(step.objectId)) {
      assignRole(rolesByObjectId, step.objectId, "cause");
    }
  }

  const nodes: SvieExecutiveStoryNode[] = causeChain.steps.map((step, storyIndex) =>
    Object.freeze({
      objectId: step.objectId,
      label: step.label,
      role: rolesByObjectId.get(step.objectId) ?? "cause",
      storyIndex,
    })
  );

  const connections: SvieExecutiveStoryConnection[] = causeChain.connections.map((connection) =>
    Object.freeze({
      fromObjectId: connection.fromObjectId,
      toObjectId: connection.toObjectId,
      storyIndex: connection.stepIndex,
    })
  );

  return Object.freeze({
    recommendationId: input.link.recommendationId,
    title: normalizeObjectId(input.finding?.title) ?? undefined,
    nodes: Object.freeze(nodes),
    connections: Object.freeze(connections),
  });
}

export function buildExecutiveStories(input: {
  links: readonly SvieAdvisoryVisualLink[];
  findings?: readonly SvieAdvisoryFindingInput[];
  sceneJson?: unknown;
}): readonly SvieExecutiveStory[] {
  const findingById = new Map(
    (input.findings ?? [])
      .map((finding) => [normalizeObjectId(finding.recommendationId), finding] as const)
      .filter((entry): entry is [string, SvieAdvisoryFindingInput] => Boolean(entry[0]))
  );

  return Object.freeze(
    input.links
      .map((link) =>
        buildExecutiveStory({
          link,
          finding: findingById.get(link.recommendationId) ?? null,
          sceneJson: input.sceneJson,
        })
      )
      .filter((story): story is SvieExecutiveStory => story !== null)
      .sort((left, right) => left.recommendationId.localeCompare(right.recommendationId))
  );
}

export function buildSvieExecutiveStoryLayerSignature(input: {
  links: readonly SvieAdvisoryVisualLink[];
  findings?: readonly SvieAdvisoryFindingInput[];
  sceneJson?: unknown;
}): string {
  const stories = buildExecutiveStories(input);
  return `svie:executive-story:${JSON.stringify(stories)}`;
}
