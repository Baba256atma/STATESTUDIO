import assert from "node:assert/strict";
import test from "node:test";
import {
  isDiagnosticEnabled,
  resetDiagnosticSwitchForTests,
} from "../runtime/diagnosticSwitch.ts";
import { NXA_CONVERSATION_DIAGNOSTIC_SCOPE } from "./nxaConversationPathTrace.ts";
import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { createEmptyManagerObjectSession } from "../manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { firstPathDivergence, projectConversationPathTrace } from "./nxaConversationPathTrace.ts";

test.beforeEach(() => resetDiagnosticSwitchForTests());
test.afterEach(() => resetDiagnosticSwitchForTests());

test("conversation path scope is quiet until explicitly enabled", () => {
  assert.equal(isDiagnosticEnabled(NXA_CONVERSATION_DIAGNOSTIC_SCOPE), false);
});

test("path projection reads existing Stage and DIR results without a second store", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const result = executeNexoraConversationalExperience({
    utterance: "show problems",
    runtimeState: createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    catalog,
    executiveSubjects: projectManagerObjectConversationalSubjects(catalog),
    previousManagerObjectSession: createEmptyManagerObjectSession(),
    messageIdSeed: "nxa6-prep-trace",
  });
  const logs: unknown[] = [];
  const original = globalThis.console.debug;
  globalThis.console.debug = ((...args: unknown[]) => {
    logs.push(args);
  }) as typeof console.debug;
  const path = projectConversationPathTrace({ utterance: "show problems", result });
  globalThis.console.debug = original;
  assert.equal(logs.length, 0);
  assert.equal(path.stageMode, "collection");
  assert.equal(path.activeCollection, "problem");
  assert.ok(path.collectionMemberIds.includes("ctx-problem-capacity"));
  assert.equal(path.dirInstruction, "SHOW_COLLECTION");
  assert.equal(path.readWrite, "write");
  const divergence = firstPathDivergence(path, { stageMode: "focus" });
  assert.equal(divergence?.field, "stageMode");
});
