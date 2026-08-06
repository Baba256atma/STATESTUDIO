import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  adaptRuntimeCollection,
  adaptRuntimeObject,
  foundationId,
  foundationLock,
  foundationNamespace,
  foundationStatus,
  foundationVersion,
  freezeRendererObject,
  resolveRendererBadges,
  resolveRendererColor,
  resolveRendererLabel,
  resolveRendererState,
  resolveRendererVisibility,
  verifyRendererAdapter,
  type RendererObject,
} from "./nexoraObjectDirectorRendererAdapterFoundation.ts";
import type { NexoraDirectorRuntimeObjectState } from "../nexoraObjectDirectorRuntimePublicIndex.ts";

function freeze<T>(value: T, seen = new Set<object>()): T { if (value === null || typeof value !== "object" || seen.has(value as object)) return value; seen.add(value as object); Object.values(value as Record<string, unknown>).forEach((child) => freeze(child, seen)); return Object.freeze(value); }
function deeplyFrozen(value: unknown, seen = new Set<object>()): boolean { if (value === null || typeof value !== "object" || seen.has(value as object)) return true; if (!Object.isFrozen(value)) return false; seen.add(value as object); return Object.values(value as Record<string, unknown>).every((child) => deeplyFrozen(child, seen)); }
function runtime(overrides: Partial<NexoraDirectorRuntimeObjectState> = {}): NexoraDirectorRuntimeObjectState { return freeze({ runtimeObjectId: "runtime-object-1", objectId: "object-1", sceneObjectId: "scene-object-1", sourceCommandIds: ["command-1"], generation: 1, lifecycle: "Active" as const, visible: true, interactive: true, focused: false, operating: false, attentionLevel: "None" as const, renderingLevel: "Normal" as const, cameraIntent: "None" as const, relationshipMode: "Direct" as const, labelMode: "Full" as const, indicatorMode: "Essential" as const, animationPending: false, lastExecutionState: "Completed" as const, updatedAt: "2035-01-01T00:00:00.000Z", ...overrides }); }
const source = readFileSync(new URL("./nexoraObjectDirectorRendererAdapterFoundation.ts", import.meta.url), "utf8");

describe("NOL-5:1 Director Renderer Adapter Foundation", () => {
  it("exposes exact identity, namespace, version, status, and immutable lock", () => { assert.equal(foundationId, "NOL-5:1/NexoraObjectDirectorRendererAdapterFoundation"); assert.equal(foundationNamespace, "nexora.nol.renderer.adapter.foundation"); assert.equal(foundationVersion, "1.0.0"); assert.equal(foundationStatus, "Foundation"); assert.equal(deeplyFrozen(foundationLock), true); });
  it("imports only the NOL-4 Public Index and no rendering framework", () => { const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]); assert.deepEqual(imports, ["../nexoraObjectDirectorRuntimePublicIndex.ts"]); assert.doesNotMatch(source, /from\s+["'][^"']*(?:react|next|three|canvas|svg|dom|webgl|webgpu|renderer-platform|ui)/i); });
  it("adapts runtime objects purely, deterministically, and without mutation", () => { const input = runtime(), before = JSON.stringify(input), hints = freeze({ caption: "Executive Object", type: "Report", position: freeze({ x: 1, y: 2, z: 3 }), metadata: freeze({ lane: "primary" }) }); const first = adaptRuntimeObject(input, hints), second = adaptRuntimeObject(input, hints); assert.deepEqual(first, second); assert.equal(JSON.stringify(input), before); assert.equal(first.id, input.runtimeObjectId); assert.equal(first.caption, "Executive Object"); assert.deepEqual(first.position, { x: 1, y: 2, z: 3 }); assert.equal(first.metadata.lane, "primary"); assert.equal(deeplyFrozen(first), true); });
  it("adapts collections in original order with immutable output", () => { const inputs = [runtime({ runtimeObjectId: "one", objectId: "one" }), runtime({ runtimeObjectId: "two", objectId: "two" })], output = adaptRuntimeCollection(inputs); assert.deepEqual(output.map((object) => object.id), ["one", "two"]); assert.equal(deeplyFrozen(output), true); });
  it("maps minimum, report, and operation states deterministically", () => { assert.equal(resolveRendererState(runtime()), "minimum"); assert.equal(resolveRendererState(runtime({ focused: true })), "report"); assert.equal(resolveRendererState(runtime({ operating: true, renderingLevel: "Operation" })), "operation"); });
  it("uses only the Seed Green, Yellow, Red, Blue, White, and Black palette", () => { assert.equal(resolveRendererColor("Healthy").base, "Green"); assert.equal(resolveRendererColor("Warning").base, "Yellow"); assert.equal(resolveRendererColor("Failed").base, "Red"); assert.equal(resolveRendererColor("Running").base, "Blue"); assert.equal(resolveRendererColor("Unknown").base, "White"); assert.equal(resolveRendererColor("Removed").base, "Black"); const palette = new Set(["Green", "Yellow", "Red", "Blue", "White", "Black"]); for (const status of ["Healthy", "Warning", "Failed", "Running", "Unknown", "Removed"]) for (const color of Object.values(resolveRendererColor(status))) assert.equal(palette.has(color), true); });
  it("maps visible, hidden, and collapsed states", () => { assert.equal(resolveRendererVisibility(runtime()), "visible"); assert.equal(resolveRendererVisibility(runtime({ visible: false })), "hidden"); assert.equal(resolveRendererVisibility(runtime({ lifecycle: "Removed" })), "collapsed"); });
  it("creates ordered immutable badges from runtime evidence", () => { const badges = resolveRendererBadges(runtime({ lifecycle: "Failed", attentionLevel: "Critical", operating: true, focused: true, animationPending: true, lastExecutionState: "Failed" })); assert.deepEqual(badges.map((badge) => badge.id), ["runtime-failed", "runtime-critical", "runtime-operation", "runtime-focused", "runtime-animation"]); assert.equal(deeplyFrozen(badges), true); });
  it("creates full, short, and hidden renderer labels", () => { assert.equal(resolveRendererLabel(runtime(), "Object Caption"), "Object Caption"); assert.equal(resolveRendererLabel(runtime({ labelMode: "Hidden" }), "Object Caption"), ""); assert.equal(resolveRendererLabel(runtime({ labelMode: "Short" }), "A very long renderer object caption"), "A very long renderer ..."); });
  it("deep-freezes renderer objects and verifies valid output", () => { const mutable = { ...adaptRuntimeObject(runtime()), metadata: { changed: false } } as RendererObject, frozen = freezeRendererObject(mutable), report = verifyRendererAdapter(frozen); assert.equal(deeplyFrozen(frozen), true); assert.deepEqual(report, { valid: true, objectCount: 1, immutable: true, rendererIndependent: true, errors: [], foundationId }); assert.equal(deeplyFrozen(report), true); });
  it("verification rejects mutable or renderer-specific output", () => { const output = adaptRuntimeObject(runtime()), mutable = { ...output, badges: [...output.badges] }; assert.equal(verifyRendererAdapter(mutable).valid, false); class Mesh {} const unsafe = freeze({ ...output, metadata: freeze({ resource: new Mesh() }) }); assert.equal(verifyRendererAdapter(unsafe).valid, false); });
  it("contains no async, global state, singleton, or rendering behavior", () => { assert.doesNotMatch(source, /\basync\b|\bawait\b|\b(?:window|document|globalThis)\b|new\s+(?:Mesh|Scene|Camera|Renderer)|requestAnimationFrame|\.render\s*\(/); });
});
