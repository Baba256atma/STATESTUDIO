import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { adaptRuntimeObject, foundationId, foundationVersion, type NexoraDirectorRuntimeObjectState } from "./nexoraObjectDirectorRendererAdapterFoundation.ts";
import {
  contractsId,
  contractsLock,
  contractsNamespace,
  contractsStatus,
  contractsVersion,
  createRendererAdapterInputContract,
  createRendererAdapterOutputContract,
  createRendererBadgeContract,
  createRendererCollectionContract,
  createRendererLabelContract,
  createRendererSeedColorContract,
  createRendererStateContract,
  createRendererVisibilityContract,
  rendererAdapterCompatibilityContract,
  rendererAdapterContractCount,
  rendererAdapterContractRegistry,
  rendererAdapterGuarantees,
  rendererSeedPaletteKeys,
  validateRendererAdapterGuarantees,
  validateRendererAdapterInputContract,
  validateRendererAdapterOutputContract,
  verifyRendererAdapterContracts,
} from "./nexoraObjectDirectorRendererAdapterContracts.ts";

function freeze<T>(value: T, seen = new Set<object>()): T { if (value === null || typeof value !== "object" || seen.has(value as object)) return value; seen.add(value as object); Object.values(value as Record<string, unknown>).forEach((child) => freeze(child, seen)); return Object.freeze(value); }
function deeplyFrozen(value: unknown, seen = new Set<object>()): boolean { if (value === null || typeof value !== "object" || seen.has(value as object)) return true; if (!Object.isFrozen(value)) return false; seen.add(value as object); return Object.values(value as Record<string, unknown>).every((child) => deeplyFrozen(child, seen)); }
function runtime(id = "one"): NexoraDirectorRuntimeObjectState { return freeze({ runtimeObjectId: `runtime-${id}`, objectId: id, sceneObjectId: `scene-${id}`, sourceCommandIds: [], generation: 1, lifecycle: "Active" as const, visible: true, interactive: true, focused: false, operating: false, attentionLevel: "None" as const, renderingLevel: "Normal" as const, cameraIntent: "None" as const, relationshipMode: "Direct" as const, labelMode: "Full" as const, indicatorMode: "Essential" as const, animationPending: false, lastExecutionState: "Completed" as const, updatedAt: "2035-01-01T00:00:00.000Z" }); }
const source = readFileSync(new URL("./nexoraObjectDirectorRendererAdapterContracts.ts", import.meta.url), "utf8");

describe("NOL-5:2 Director Renderer Adapter Contracts", () => {
  it("1-6. identity constants and Foundation-only dependency are exact", () => { assert.equal(contractsId, "NOL-5:2/NexoraObjectDirectorRendererAdapterContracts"); assert.equal(contractsVersion, "5.2.0"); assert.equal(contractsNamespace, "nexora.nol.renderer.adapter.contracts"); assert.equal(contractsStatus, "Contracts"); assert.equal(contractsLock, "NOL-5-2-DIRECTOR-RENDERER-ADAPTER-CONTRACTS-LOCKED"); const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]); assert.deepEqual(imports, ["./nexoraObjectDirectorRendererAdapterFoundation.ts"]); });
  it("7-10. registry order and dynamic count are exact and public constants are frozen", () => { assert.deepEqual(rendererAdapterContractRegistry, ["Input", "Output", "Collection", "State", "Visibility", "Seed Color", "Badge", "Label", "Guarantees", "Compatibility", "Verification"]); assert.equal(rendererAdapterContractCount, rendererAdapterContractRegistry.length); for (const value of [rendererAdapterContractRegistry, rendererSeedPaletteKeys, rendererAdapterGuarantees, rendererAdapterCompatibilityContract]) assert.equal(deeplyFrozen(value), true); });
  it("11-12. creates valid deeply immutable input and output contracts", () => { const runtimeObject = runtime(), input = createRendererAdapterInputContract(runtimeObject, "runtime-1", { requestedRendererState: "report", preserveRuntimeMetadata: true }), rendererObject = adaptRuntimeObject(runtimeObject), output = createRendererAdapterOutputContract(rendererObject, "runtime-1", true, ["none"]); assert.equal(input.runtimeObject, runtimeObject); assert.equal(input.requestedRendererState, "report"); assert.equal(output.rendererObject, rendererObject); assert.equal(output.adapted, true); assert.equal(output.deeplyFrozen, true); assert.equal(deeplyFrozen(input) && deeplyFrozen(output), true); });
  it("13-14. collection contracts derive counts and verify order preservation", () => { const objects = [adaptRuntimeObject(runtime("one")), adaptRuntimeObject(runtime("two"))], preserved = createRendererCollectionContract(2, objects, ["runtime-one", "runtime-two"]), changed = createRendererCollectionContract(2, objects, ["runtime-two", "runtime-one"]); assert.equal(preserved.sourceCount, 2); assert.equal(preserved.outputCount, 2); assert.equal(preserved.orderPreserved, true); assert.equal(changed.orderPreserved, false); assert.equal(deeplyFrozen(preserved), true); });
  it("15-18. state and visibility contracts identify supported translations and fallbacks", () => { assert.deepEqual(createRendererStateContract("Focused", "report"), { runtimeState: "Focused", rendererState: "report", supported: true, fallbackApplied: false }); assert.deepEqual(createRendererStateContract("Unknown"), { runtimeState: "Unknown", rendererState: "minimum", supported: false, fallbackApplied: true }); assert.deepEqual(createRendererVisibilityContract("Visible", "visible"), { runtimeVisibility: "Visible", rendererVisibility: "visible", supported: true, fallbackApplied: false }); assert.deepEqual(createRendererVisibilityContract("Unknown"), { runtimeVisibility: "Unknown", rendererVisibility: "hidden", supported: false, fallbackApplied: true }); });
  it("19-20. Seed contracts use five keys and reject unsupported palette values", () => { assert.deepEqual(rendererSeedPaletteKeys, ["green", "yellow", "red", "blue", "neutral"]); const green = createRendererSeedColorContract("Healthy"); assert.equal(green.paletteKey, "green"); assert.equal(green.rendererColor.base, "Green"); const neutral = createRendererSeedColorContract("Unknown"); assert.equal(neutral.paletteKey, "neutral"); assert.equal(neutral.fallbackApplied, true); assert.throws(() => createRendererSeedColorContract("Healthy", "purple"), /Unsupported Seed/); });
  it("21-22. badge and label contracts are immutable and deterministic", () => { const badges = createRendererBadgeContract([freeze({ id: "risk", text: "Risk", severity: "warning" as const })]), first = createRendererLabelContract("Caption"), second = createRendererLabelContract("Caption"); assert.equal(badges.badgeCount, 1); assert.equal(deeplyFrozen(badges), true); assert.deepEqual(first, second); assert.equal(first.fallbackApplied, true); });
  it("23-26. validators accept complete contracts and safely reject malformed values", () => { const runtimeObject = runtime(), input = createRendererAdapterInputContract(runtimeObject, "runtime-1"), output = createRendererAdapterOutputContract(adaptRuntimeObject(runtimeObject), "runtime-1"); assert.equal(validateRendererAdapterInputContract(input).valid, true); assert.equal(validateRendererAdapterInputContract(freeze({ sourceRuntimeId: "runtime-1", preserveRuntimeMetadata: true })).valid, false); assert.equal(validateRendererAdapterOutputContract(output).valid, true); assert.equal(validateRendererAdapterOutputContract(freeze({ ...output, adapted: false })).valid, false); assert.equal(validateRendererAdapterGuarantees(rendererAdapterGuarantees).valid, true); assert.equal(validateRendererAdapterGuarantees(freeze({ ...rendererAdapterGuarantees, pure: false })).valid, false); });
  it("27-28. compatibility and canonical verification reports are correct", () => { assert.deepEqual(rendererAdapterCompatibilityContract, { foundationIdentity: foundationId, contractsIdentity: contractsId, compatibleFoundationVersion: foundationVersion, rendererFrameworkAgnostic: true, backwardCompatible: true }); const report = verifyRendererAdapterContracts(); assert.deepEqual(report, { valid: true, identityValid: true, namespaceValid: true, dependencyValid: true, guaranteesValid: true, contractsFrozen: true, violations: [] }); assert.equal(deeplyFrozen(report), true); });
  it("29-31. creators never mutate inputs and repeated results are deeply frozen and equal", () => { const runtimeObject = runtime(), before = JSON.stringify(runtimeObject), rendererObject = adaptRuntimeObject(runtimeObject), badges = [freeze({ id: "info", text: "Info", severity: "info" as const })], first = createRendererAdapterOutputContract(rendererObject, "runtime-1", true, []), second = createRendererAdapterOutputContract(rendererObject, "runtime-1", true, []); createRendererAdapterInputContract(runtimeObject, "runtime-1"); createRendererBadgeContract(badges); assert.equal(JSON.stringify(runtimeObject), before); assert.deepEqual(first, second); assert.equal(deeplyFrozen(first), true); assert.equal(deeplyFrozen(first.warnings), true); });
  it("32. contains no prohibited framework, browser, async, stateful, or direct NOL-4 dependency", () => { assert.doesNotMatch(source, /from\s+["'][^"']*(?:nexoraObjectDirectorRuntimePublicIndex|react|next|three|dom|canvas|svg|renderer-platform|ui)/i); assert.doesNotMatch(source, /\b(?:async|await|Promise|setTimeout|setInterval|fetch|localStorage|sessionStorage|window|document|globalThis|Math\.random|Date\.now)\b|new\s+(?:Mesh|Scene|Camera|Renderer)/); });
});
