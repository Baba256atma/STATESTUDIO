import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_FOUNDATION_INVARIANTS as invariants,
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_LEVELS as attentionLevels,
  DIRECTOR_RUNTIME_ATTENTION_PERSISTENCE_VALUES as persistenceValues,
  DIRECTOR_RUNTIME_ATTENTION_REASON_KINDS as reasonKinds,
  DIRECTOR_RUNTIME_ATTENTION_RELATIONSHIP_KINDS as relationshipKinds,
  DIRECTOR_RUNTIME_ATTENTION_SCOPES as scopes,
  DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCES as signalSources,
  DIRECTOR_RUNTIME_ATTENTION_SUBJECT_KINDS as subjectKinds,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_CONTEXT as emptyContext,
  DIRECTOR_RUNTIME_FOCUS_ROLES as focusRoles,
  createDirectorRuntimeAttentionContext,
  createDirectorRuntimeAttentionRelationship,
  createDirectorRuntimeAttentionSignal,
  createDirectorRuntimeAttentionSubjectReference,
  createDirectorRuntimeFocusState,
  directorRuntimeAttentionFocusFoundation as foundation,
  directorRuntimeAttentionFocusFoundationApiNames as apiNames,
  directorRuntimeAttentionFocusFoundationCanonicalIdentity as canonicalIdentity,
  directorRuntimeAttentionFocusFoundationRegistry as registry,
  validateDirectorRuntimeAttentionContext,
  validateDirectorRuntimeAttentionRelationship,
  validateDirectorRuntimeAttentionSignal,
  validateDirectorRuntimeAttentionSubjectReference,
  validateDirectorRuntimeFocusState,
  verifyDirectorRuntimeAttentionFocusFoundation,
} from "./directorRuntimeAttentionFocusFoundation.ts";

const source = readFileSync(
  new URL("./directorRuntimeAttentionFocusFoundation.ts", import.meta.url),
  "utf8",
);

const validSubject = Object.freeze({
  subjectId: "production-line-1",
  subjectKind: "object" as const,
});

test("1. publishes exact DRI-6:1 identity, version, and namespace", () => {
  assert.deepEqual({
    phase: foundation.phase,
    name: foundation.name,
    identity: foundation.identity,
    namespace: foundation.namespace,
    version: foundation.version,
    layer: foundation.layer,
    domain: foundation.domain,
    role: foundation.role,
    status: foundation.status,
  }, {
    phase: "DRI-6:1",
    name: "DirectorRuntimeAttentionFocusFoundation",
    identity: "DRI-6:1/DirectorRuntimeAttentionFocusFoundation",
    namespace: "nexora.dri.attention-focus.foundation",
    version: "6.1.0",
    layer: "Director Runtime Integration",
    domain: "AttentionFocusOrchestration",
    role: "Foundation",
    status: "FoundationReady",
  });
  assert.deepEqual(canonicalIdentity, {
    identity: "DRI-6:1/DirectorRuntimeAttentionFocusFoundation",
    version: "6.1.0",
    namespace: "nexora.dri.attention-focus.foundation",
    upstream: "DRI-5:9/DirectorRuntimeAdaptivePresentationPublicIndex",
  });
  assert.equal(Object.isFrozen(foundation), true);
  assert.equal(Object.isFrozen(canonicalIdentity), true);
});

test("2. sole immediate dependency is DRI-5 Public Index", () => {
  assert.equal(
    foundation.upstreamDependency,
    "DRI-5:9/DirectorRuntimeAdaptivePresentationPublicIndex",
  );
  assert.equal(registry.dependency, foundation.upstreamDependency);
  assert.equal(foundation.adaptivePresentationBoundary, "DRI-5:9-public-index-only");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(imports, [
    "@/app/lib/dri/directorRuntimeAdaptivePresentationPublicIndex",
  ]);
  assert.doesNotMatch(
    source,
    /directorRuntimeAdaptivePresentation(?:Foundation|Orchestration|Platform|Freeze)["']/,
  );
  assert.doesNotMatch(
    source,
    /directorRuntime(?:Interaction|Scene|StateContext|Integration)/,
  );
});

test("3. exact ordered attention levels", () => {
  assert.deepEqual([...attentionLevels], [
    "primary",
    "secondary",
    "context",
    "background",
    "suppressed",
  ]);
  assert.equal(attentionLevels.length, 5);
  assert.equal(Object.isFrozen(attentionLevels), true);
});

test("4. exact focus roles", () => {
  assert.deepEqual([...focusRoles], [
    "focused",
    "supporting",
    "contextual",
    "peripheral",
    "none",
  ]);
  assert.equal(focusRoles.length, 5);
});

test("5. exact subject kinds", () => {
  assert.deepEqual([...subjectKinds], [
    "goal",
    "object",
    "pack",
    "problem",
    "scenario",
    "decision",
    "execution",
    "kpi",
    "koi",
    "scene",
    "path",
  ]);
  assert.equal(subjectKinds.length, 11);
});

test("6. exact signal sources", () => {
  assert.deepEqual([...signalSources], [
    "user-interaction",
    "runtime-state",
    "goal",
    "kpi",
    "koi",
    "problem",
    "scenario",
    "decision",
    "execution",
    "advisor",
    "system",
  ]);
  assert.equal(signalSources.length, 11);
});

test("7. exact reason kinds", () => {
  assert.deepEqual([...reasonKinds], [
    "explicit-selection",
    "risk",
    "warning",
    "critical-state",
    "dependency",
    "goal-relevance",
    "context-relevance",
    "scenario-relevance",
    "decision-relevance",
    "execution-relevance",
    "advisor-relevance",
    "system-relevance",
  ]);
  assert.equal(reasonKinds.length, 12);
});

test("8. exact scopes", () => {
  assert.deepEqual([...scopes], [
    "subject",
    "local-context",
    "scene",
    "workspace",
    "global",
  ]);
  assert.equal(scopes.length, 5);
});

test("9. exact persistence values", () => {
  assert.deepEqual([...persistenceValues], [
    "transient",
    "session",
    "persistent",
  ]);
  assert.equal(persistenceValues.length, 3);
});

test("10. exact relationship kinds", () => {
  assert.deepEqual([...relationshipKinds], [
    "direct",
    "dependency",
    "upstream",
    "downstream",
    "supporting",
    "contextual",
  ]);
  assert.equal(relationshipKinds.length, 6);
});

test("11. registry uniqueness and separation", () => {
  assert.equal(new Set(attentionLevels).size, attentionLevels.length);
  assert.equal(new Set(focusRoles).size, focusRoles.length);
  assert.equal(new Set(subjectKinds).size, subjectKinds.length);
  assert.equal(new Set(signalSources).size, signalSources.length);
  assert.equal(new Set(reasonKinds).size, reasonKinds.length);
  assert.equal(new Set(scopes).size, scopes.length);
  assert.equal(new Set(persistenceValues).size, persistenceValues.length);
  assert.equal(new Set(relationshipKinds).size, relationshipKinds.length);
  assert.notDeepEqual([...attentionLevels], [...focusRoles]);
  assert.ok(!attentionLevels.includes("focused" as never));
  assert.ok(!focusRoles.includes("primary" as never));
});

test("12. valid subject reference", () => {
  const result = validateDirectorRuntimeAttentionSubjectReference(validSubject);
  assert.equal(result.valid, true);
  assert.deepEqual(result.issues, []);
  const created = createDirectorRuntimeAttentionSubjectReference(validSubject);
  assert.deepEqual(created, validSubject);
  assert.equal(Object.isFrozen(created), true);
});

test("13. invalid empty subject identity", () => {
  const result = validateDirectorRuntimeAttentionSubjectReference({
    subjectId: "   ",
    subjectKind: "object",
  });
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((entry) => entry.code === "missing-subject-id"));
});

test("14. invalid subject kind", () => {
  const result = validateDirectorRuntimeAttentionSubjectReference({
    subjectId: "x",
    subjectKind: "widget",
  });
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((entry) => entry.code === "invalid-subject-kind"));
});

test("15. valid attention signal", () => {
  const signal = {
    signalId: "sig-1",
    subject: validSubject,
    source: "user-interaction" as const,
    reason: "explicit-selection" as const,
    scope: "subject" as const,
    requestedLevel: "primary" as const,
    persistence: "transient" as const,
  };
  const result = validateDirectorRuntimeAttentionSignal(signal);
  assert.equal(result.valid, true);
  const created = createDirectorRuntimeAttentionSignal(signal);
  assert.equal(Object.isFrozen(created), true);
  assert.equal(Object.isFrozen(created.subject), true);
});

test("16. malformed attention signal rejection", () => {
  const result = validateDirectorRuntimeAttentionSignal({
    signalId: "",
    subject: { subjectId: "", subjectKind: "bad" },
    source: "mouse",
    reason: "click",
    scope: "everywhere",
    requestedLevel: "urgent",
    persistence: "forever",
  });
  assert.equal(result.valid, false);
  assert.ok(result.issues.length >= 3);
});

test("17. valid focus state", () => {
  const state = {
    subject: validSubject,
    attentionLevel: "primary" as const,
    focusRole: "focused" as const,
  };
  assert.equal(validateDirectorRuntimeFocusState(state).valid, true);
  const created = createDirectorRuntimeFocusState(state);
  assert.deepEqual(created, state);
  assert.equal(Object.isFrozen(created), true);
});

test("18. invalid focus state rejection", () => {
  const result = validateDirectorRuntimeFocusState({
    subject: validSubject,
    attentionLevel: "critical",
    focusRole: "main",
  });
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((entry) => entry.code === "invalid-attention-level"));
  assert.ok(result.issues.some((entry) => entry.code === "invalid-focus-role"));
});

test("19. valid relationship", () => {
  const relationship = {
    source: validSubject,
    target: { subjectId: "shipping-1", subjectKind: "object" as const },
    kind: "supporting" as const,
  };
  assert.equal(validateDirectorRuntimeAttentionRelationship(relationship).valid, true);
  const created = createDirectorRuntimeAttentionRelationship(relationship);
  assert.equal(Object.isFrozen(created), true);
});

test("20. invalid relationship rejection", () => {
  const result = validateDirectorRuntimeAttentionRelationship({
    source: { subjectId: "", subjectKind: "object" },
    target: { subjectId: "ok", subjectKind: "nope" },
    kind: "arrow",
  });
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((entry) => entry.code === "missing-subject-id"));
  assert.ok(result.issues.some((entry) => entry.code === "invalid-subject-kind"));
  assert.ok(result.issues.some((entry) => entry.code === "invalid-relationship-kind"));
});

test("21. valid empty attention context", () => {
  assert.equal(validateDirectorRuntimeAttentionContext(emptyContext).valid, true);
  assert.deepEqual(emptyContext, {
    focusStates: [],
    signals: [],
    relationships: [],
  });
  assert.equal(Object.isFrozen(emptyContext), true);
  assert.equal(Object.isFrozen(emptyContext.focusStates), true);
  assert.equal(Object.isFrozen(emptyContext.signals), true);
  assert.equal(Object.isFrozen(emptyContext.relationships), true);
});

test("22. valid populated attention context", () => {
  const context = createDirectorRuntimeAttentionContext({
    focusStates: [{
      subject: validSubject,
      attentionLevel: "primary",
      focusRole: "focused",
    }],
    signals: [{
      signalId: "sig-ctx",
      subject: validSubject,
      source: "kpi",
      reason: "warning",
      scope: "scene",
      requestedLevel: "secondary",
      persistence: "session",
    }],
    relationships: [{
      source: validSubject,
      target: { subjectId: "warehouse-1", subjectKind: "object" },
      kind: "contextual",
    }],
  });
  assert.equal(validateDirectorRuntimeAttentionContext(context).valid, true);
  assert.equal(Object.isFrozen(context), true);
});

test("23. invalid nested context rejection", () => {
  const result = validateDirectorRuntimeAttentionContext({
    focusStates: [{ subject: validSubject, attentionLevel: "primary", focusRole: "bad" }],
    signals: "not-array",
    relationships: [],
  });
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((entry) => entry.code === "invalid-focus-role"));
  assert.ok(result.issues.some((entry) => entry.code === "invalid-context-entry"));
});

test("24. canonical empty context and registry immutability", () => {
  assert.throws(() => {
    (emptyContext as unknown as { focusStates?: unknown[] }).focusStates = [{ x: 1 }];
  });
  assert.throws(() => {
    (attentionLevels as unknown as string[]).push("urgent");
  });
  assert.throws(() => {
    (registry as unknown as { version?: string }).version = "0";
  });
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(invariants), true);
});

test("25. input immutability during validation", () => {
  const mutable = {
    subjectId: "orders",
    subjectKind: "object",
  };
  const snapshot = JSON.stringify(mutable);
  validateDirectorRuntimeAttentionSubjectReference(mutable);
  assert.equal(JSON.stringify(mutable), snapshot);

  const signal = {
    signalId: "sig-mut",
    subject: mutable,
    source: "system",
    reason: "system-relevance",
    scope: "global",
    requestedLevel: "background",
    persistence: "persistent",
  };
  const signalSnap = JSON.stringify(signal);
  validateDirectorRuntimeAttentionSignal(signal);
  assert.equal(JSON.stringify(signal), signalSnap);
});

test("26. absence of presentation fields and priority/score semantics", () => {
  assert.doesNotMatch(
    source,
    /\b(?:color|backgroundColor|opacity|scale|position|camera|zoom|glow|pulse|animation|duration|easing|cssClass|component|renderer|material|geometry)\b\s*[?:]/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:priority|weight|score|rank|confidence|importance)\s*:\s*number\b/,
  );
  assert.doesNotMatch(source, /function\s+(?:find|resolve|shortest)Path\s*\(/);
  assert.doesNotMatch(source, /function\s+(?:propagateAttention|buildAttentionGraph)\s*\(/);
  assert.doesNotMatch(source, /function\s+(?:focus|attention)Transition\s*\(/);
  assert.doesNotMatch(source, /\bDate\.now\(|Math\.random\(|setTimeout\(/);
});

test("27. foundation verification success and determinism", () => {
  const first = verifyDirectorRuntimeAttentionFocusFoundation();
  const second = verifyDirectorRuntimeAttentionFocusFoundation();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.equal(first.attentionLevelCount, 5);
  assert.equal(first.focusRoleCount, 5);
  assert.equal(first.subjectKindCount, 11);
  assert.equal(first.signalSourceCount, 11);
  assert.equal(first.reasonKindCount, 12);
  assert.equal(first.scopeCount, 5);
  assert.equal(first.persistenceCount, 3);
  assert.equal(first.relationshipKindCount, 6);
  assert.equal(first.invariantCount, 13);
  assert.equal(first.frozen, true);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(apiNames.length, registry.publicApiCount);
  assert.equal(registry.publicApiCount, 24);
});
