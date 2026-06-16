/**
 * SVIE:3:5 — Executive story layer runtime (read-only).
 */

import { syncSvieAdvisoryLinkSnapshot } from "./svieAdvisoryLinkRuntime.ts";
import type { SvieAdvisoryFindingInput } from "./svieAdvisoryLinkFoundationContract.ts";
import {
  buildExecutiveStories,
  buildSvieExecutiveStoryLayerSignature,
} from "./svieExecutiveStoryBuilder.ts";
import {
  DEFAULT_SVIE_EXECUTIVE_STORY_LAYER_SNAPSHOT,
  SVIE_EXECUTIVE_STORY_COMPUTED_LOG,
  SVIE_EXECUTIVE_STORY_LAYER_TAG,
  SVIE_EXECUTIVE_STORY_LAYER_VERSION,
  type SvieExecutiveStoryLayerBuildInput,
  type SvieExecutiveStoryLayerSnapshot,
} from "./svieExecutiveStoryLayerContract.ts";
import {
  mergeExecutiveStoryScenes,
  resolveExecutiveStoryScene,
} from "./svieExecutiveStorySceneResolver.ts";
import {
  guardSvieAdvisoryLinkRouteWrite,
  guardSvieAdvisoryLinkWorkspaceWrite,
  initializeSvieAdvisoryLinkRuntime,
} from "./svieAdvisoryLinkRuntime.ts";
import { readAdvisoryFindingsFromSceneJson } from "./svieCauseChainVisualizationRuntime.ts";

let lastSignature: string | null = null;
let snapshot: SvieExecutiveStoryLayerSnapshot = DEFAULT_SVIE_EXECUTIVE_STORY_LAYER_SNAPSHOT;
const loggedSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logExecutiveStoryOnce(next: SvieExecutiveStoryLayerSnapshot): void {
  if (!isDev()) return;
  if (loggedSignatures.has(next.signature)) return;
  loggedSignatures.add(next.signature);
  globalThis.console?.debug?.(SVIE_EXECUTIVE_STORY_COMPUTED_LOG, {
    tag: SVIE_EXECUTIVE_STORY_LAYER_TAG,
    version: SVIE_EXECUTIVE_STORY_LAYER_VERSION,
    storyCount: next.stories.length,
    connectionCount: next.connectionVisuals.length,
  });
}

export function applyExecutiveStoryVisualization(
  input: SvieExecutiveStoryLayerBuildInput = {}
): SvieExecutiveStoryLayerSnapshot {
  initializeSvieAdvisoryLinkRuntime();
  const findings = input.findings ?? readAdvisoryFindingsFromSceneJson(input.sceneJson);
  const linkSnapshot = syncSvieAdvisoryLinkSnapshot({ findings, sceneJson: input.sceneJson });
  const stories = buildExecutiveStories({
    links: linkSnapshot.links,
    findings,
    sceneJson: input.sceneJson,
  });
  const storyScenes = Object.freeze(stories.map((story) => resolveExecutiveStoryScene(story)));
  const merged = mergeExecutiveStoryScenes(storyScenes);
  const generatedAt = Date.now();
  const signature = buildSvieExecutiveStoryLayerSignature({
    links: linkSnapshot.links,
    findings,
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
  logExecutiveStoryOnce(snapshot);
  return snapshot;
}

export function syncSvieExecutiveStoryLayer(
  input: SvieExecutiveStoryLayerBuildInput = {}
): SvieExecutiveStoryLayerSnapshot {
  initializeSvieAdvisoryLinkRuntime();
  const findings = input.findings ?? readAdvisoryFindingsFromSceneJson(input.sceneJson);
  const linkSnapshot = syncSvieAdvisoryLinkSnapshot({ findings, sceneJson: input.sceneJson });
  const signature = buildSvieExecutiveStoryLayerSignature({
    links: linkSnapshot.links,
    findings,
    sceneJson: input.sceneJson,
  });
  if (signature === lastSignature && snapshot.generatedAt > 0) {
    return snapshot;
  }
  return applyExecutiveStoryVisualization(input);
}

export function getSvieExecutiveStoryLayerSnapshot(): SvieExecutiveStoryLayerSnapshot {
  return snapshot;
}

export function guardSvieExecutiveStoryRouteWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieAdvisoryLinkRouteWrite(attempt);
}

export function guardSvieExecutiveStoryWorkspaceWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieAdvisoryLinkWorkspaceWrite(attempt);
}

export function resetSvieExecutiveStoryLayerRuntimeForTests(): void {
  lastSignature = null;
  snapshot = DEFAULT_SVIE_EXECUTIVE_STORY_LAYER_SNAPSHOT;
  loggedSignatures.clear();
}
