/**
 * SVIE:4:7 — Executive future story layer runtime (read-only).
 */

import {
  buildExecutiveFutureStories,
  buildSvieExecutiveFutureStorySignature,
} from "./svieExecutiveFutureStoryBuilder.ts";
import {
  DEFAULT_SVIE_EXECUTIVE_FUTURE_STORY_LAYER_SNAPSHOT,
  SVIE_EXECUTIVE_FUTURE_STORY_COMPUTED_LOG,
  SVIE_EXECUTIVE_FUTURE_STORY_LAYER_TAG,
  SVIE_EXECUTIVE_FUTURE_STORY_LAYER_VERSION,
  type SvieExecutiveFutureStoryLayerBuildInput,
  type SvieExecutiveFutureStoryLayerSnapshot,
} from "./svieExecutiveFutureStoryLayerContract.ts";
import {
  mergeExecutiveFutureStoryScenes,
  resolveExecutiveFutureStoryScene,
} from "./svieExecutiveFutureStorySceneResolver.ts";
import {
  guardSvieScenarioLinkRouteWrite,
  guardSvieScenarioLinkWorkspaceWrite,
  syncSvieScenarioLinks,
} from "./svieScenarioLinkRuntime.ts";
import { readScenariosFromSceneJson } from "./svieScenarioLinkResolver.ts";

let lastSignature: string | null = null;
let snapshot: SvieExecutiveFutureStoryLayerSnapshot =
  DEFAULT_SVIE_EXECUTIVE_FUTURE_STORY_LAYER_SNAPSHOT;
const loggedSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logExecutiveFutureStoryOnce(next: SvieExecutiveFutureStoryLayerSnapshot): void {
  if (!isDev()) return;
  if (loggedSignatures.has(next.signature)) return;
  loggedSignatures.add(next.signature);
  globalThis.console?.debug?.(SVIE_EXECUTIVE_FUTURE_STORY_COMPUTED_LOG, {
    tag: SVIE_EXECUTIVE_FUTURE_STORY_LAYER_TAG,
    version: SVIE_EXECUTIVE_FUTURE_STORY_LAYER_VERSION,
    storyCount: next.stories.length,
    connectionCount: next.connectionVisuals.length,
  });
}

export function applyExecutiveFutureStoryVisualization(
  input: SvieExecutiveFutureStoryLayerBuildInput = {}
): SvieExecutiveFutureStoryLayerSnapshot {
  const scenarios = input.scenarios ?? readScenariosFromSceneJson(input.sceneJson);
  const linkSnapshot = syncSvieScenarioLinks({ scenarios, sceneJson: input.sceneJson });
  const stories = buildExecutiveFutureStories({
    links: linkSnapshot.links,
    scenarios,
    sceneJson: input.sceneJson,
  });
  const storyScenes = Object.freeze(stories.map((story) => resolveExecutiveFutureStoryScene(story)));
  const merged = mergeExecutiveFutureStoryScenes(storyScenes);
  const generatedAt = Date.now();
  const signature = buildSvieExecutiveFutureStorySignature({
    links: linkSnapshot.links,
    scenarios,
    sceneJson: input.sceneJson,
  });

  snapshot = Object.freeze({
    stories,
    storyScenes,
    nodeVisualByObjectId: merged.nodeVisualByObjectId,
    connectionVisuals: merged.connectionVisuals,
    generatedAt,
    signature,
  });
  lastSignature = signature;
  logExecutiveFutureStoryOnce(snapshot);
  return snapshot;
}

export function syncExecutiveFutureStoryLayer(
  input: SvieExecutiveFutureStoryLayerBuildInput = {}
): SvieExecutiveFutureStoryLayerSnapshot {
  const scenarios = input.scenarios ?? readScenariosFromSceneJson(input.sceneJson);
  const linkSnapshot = syncSvieScenarioLinks({ scenarios, sceneJson: input.sceneJson });
  const signature = buildSvieExecutiveFutureStorySignature({
    links: linkSnapshot.links,
    scenarios,
    sceneJson: input.sceneJson,
  });
  if (signature === lastSignature && snapshot.generatedAt > 0) {
    return snapshot;
  }
  return applyExecutiveFutureStoryVisualization(input);
}

export function getSvieExecutiveFutureStoryLayerSnapshot(): SvieExecutiveFutureStoryLayerSnapshot {
  return snapshot;
}

export function guardSvieExecutiveFutureStoryRouteWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieScenarioLinkRouteWrite(attempt);
}

export function guardSvieExecutiveFutureStoryWorkspaceWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieScenarioLinkWorkspaceWrite(attempt);
}

export function resetSvieExecutiveFutureStoryLayerRuntimeForTests(): void {
  lastSignature = null;
  snapshot = DEFAULT_SVIE_EXECUTIVE_FUTURE_STORY_LAYER_SNAPSHOT;
  loggedSignatures.clear();
}
