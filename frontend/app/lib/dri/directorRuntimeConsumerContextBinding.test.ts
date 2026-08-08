import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_CONSUMER_CONTEXT_AVAILABILITY_STATES as availabilityStates,
  DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_GUARANTEES as guarantees,
  DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_REGISTRY_SECTIONS as registrySections,
  DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_STATUSES as bindingStatuses,
  DIRECTOR_RUNTIME_CONSUMER_CONTEXT_CAPABILITIES as contextCapabilities,
  DIRECTOR_RUNTIME_CONSUMER_CONTEXT_DIAGNOSTIC_KINDS as diagnosticKinds,
  DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PRECEDENCE as precedence,
  DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PROVENANCE_FIELDS as provenanceFields,
  DIRECTOR_RUNTIME_CONSUMER_CONTEXT_SCOPES as scopes,
  DIRECTOR_RUNTIME_CONSUMER_SUBJECT_KINDS as subjectKinds,
  bindDirectorRuntimeConsumerContext,
  directorRuntimeConsumerContextBinding as binding,
  directorRuntimeConsumerContextBindingApiNames as apiNames,
  directorRuntimeConsumerContextBindingCanonicalIdentity as canonicalIdentity,
  directorRuntimeConsumerContextBindingRegistry as registry,
  getDirectorRuntimeConsumerContextBindingIdentity,
  isDirectorRuntimeConsumerSubjectKind,
  listDirectorRuntimeConsumerContextAvailabilityStates,
  listDirectorRuntimeConsumerContextScopes,
  listDirectorRuntimeConsumerSubjectKinds,
  resolveDirectorRuntimeConsumerContext,
  validateDirectorRuntimeConsumerContext,
  verifyDirectorRuntimeConsumerContextBinding,
} from "./directorRuntimeConsumerContextBinding.ts";

import { verifyDirectorRuntimeConsumerIntegrationFoundation } from
  "@/app/lib/dri/directorRuntimeConsumerIntegrationFoundation";
import { verifyDirectorRuntimeExecutiveGuidancePublicIndex } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidancePublicIndex";

const source = readFileSync(
  new URL("./directorRuntimeConsumerContextBinding.ts", import.meta.url),
  "utf8",
);

const consumer = {
  consumerId: "executive.main",
  consumerFamily: "executive-experience" as const,
};

test("1. exact DRI-8:2 identity", () => {
  assert.equal(
    binding.identity,
    "DRI-8:2/DirectorRuntimeConsumerContextBinding",
  );
  assert.equal(canonicalIdentity.identity, binding.identity);
  assert.equal(binding.phase, "DRI-8:2");
  assert.equal(binding.layer, "DirectorRuntimeConsumerIntegration");
  assert.equal(binding.role, "ConsumerContextBinding");
  assert.deepEqual(
    getDirectorRuntimeConsumerContextBindingIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version 8.2.0", () => {
  assert.equal(binding.version, "8.2.0");
  assert.equal(canonicalIdentity.version, "8.2.0");
  assert.equal(registry.version, "8.2.0");
});

test("3. exact namespace", () => {
  assert.equal(
    binding.namespace,
    "nexora.dri.consumer-integration.context-binding",
  );
  assert.equal(canonicalIdentity.namespace, binding.namespace);
});

test("4. DRI-8:1 is sole immediate dependency", () => {
  assert.equal(
    binding.upstreamDependency,
    "DRI-8:1/DirectorRuntimeConsumerIntegrationFoundation",
  );
  assert.equal(registry.dependency, binding.upstreamDependency);
  assert.equal(binding.foundationBoundary, "DRI-8:1-foundation-only");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/dri/directorRuntimeConsumerIntegrationFoundation",
  ]);
  assert.doesNotMatch(
    source,
    /directorRuntimeExecutiveGuidance|directorRuntimeAttentionFocus|directorRuntimeAdaptivePresentation|directorRuntimeSceneOrchestration/,
  );
});

test("5. context scopes are canonical and unique", () => {
  assert.deepEqual([...scopes], ["global", "workspace", "surface", "subject"]);
  assert.equal(new Set(scopes).size, scopes.length);
  assert.deepEqual([...listDirectorRuntimeConsumerContextScopes()], [...scopes]);
  assert.equal(Object.isFrozen(scopes), true);
});

test("6. subject kinds are canonical and unique", () => {
  assert.deepEqual([...subjectKinds], [
    "goal",
    "object",
    "pack",
    "problem",
    "scenario",
    "decision",
    "execution",
  ]);
  assert.equal(new Set(subjectKinds).size, subjectKinds.length);
  assert.deepEqual([...listDirectorRuntimeConsumerSubjectKinds()], [
    ...subjectKinds,
  ]);
  for (const kind of subjectKinds) {
    assert.equal(isDirectorRuntimeConsumerSubjectKind(kind), true);
  }
  assert.equal(isDirectorRuntimeConsumerSubjectKind("camera"), false);
});

test("7. selection and focus remain distinct", () => {
  const result = bindDirectorRuntimeConsumerContext({
    bindingId: "bind.select-focus",
    consumer,
    scope: "workspace",
    selectedSubject: { kind: "object", id: "factory" },
    focusedSubject: { kind: "object", id: "kpi-production" },
  });
  assert.equal(result.status, "partially-bound");
  assert.ok(result.context);
  assert.equal(result.context.selectedSubject.presence, "known");
  assert.equal(result.context.focusedSubject.presence, "known");
  if (
    result.context.selectedSubject.presence === "known" &&
    result.context.focusedSubject.presence === "known"
  ) {
    assert.equal(result.context.selectedSubject.value.id, "factory");
    assert.equal(result.context.focusedSubject.value.id, "kpi-production");
    assert.notEqual(
      result.context.selectedSubject.value.id,
      result.context.focusedSubject.value.id,
    );
  }
});

test("8. active subject remains distinct from selection/focus", () => {
  const result = bindDirectorRuntimeConsumerContext({
    bindingId: "bind.active-distinct",
    consumer,
    scope: "subject",
    mode: "analysis",
    activeSubject: { kind: "object", id: "factory" },
    selectedSubject: { kind: "object", id: "factory" },
    focusedSubject: { kind: "object", id: "kpi-production" },
  });
  assert.ok(result.context);
  assert.equal(result.context.activeSubject.presence, "known");
  assert.equal(result.context.selectedSubject.presence, "known");
  assert.equal(result.context.focusedSubject.presence, "known");
  if (
    result.context.activeSubject.presence === "known" &&
    result.context.focusedSubject.presence === "known"
  ) {
    assert.equal(result.context.activeSubject.value.id, "factory");
    assert.equal(result.context.focusedSubject.value.id, "kpi-production");
  }
});

test("9. goal context can be represented", () => {
  const result = bindDirectorRuntimeConsumerContext({
    bindingId: "bind.goal",
    consumer,
    scope: "workspace",
    mode: "goal",
    activeGoal: {
      kind: "goal",
      id: "increase-production-capacity",
      label: "Increase Production Capacity",
    },
  });
  assert.ok(result.context);
  assert.equal(result.context.activeGoal.presence, "known");
  if (result.context.activeGoal.presence === "known") {
    assert.equal(result.context.activeGoal.value.kind, "goal");
    assert.equal(
      result.context.activeGoal.value.id,
      "increase-production-capacity",
    );
  }
});

test("10. object context can be represented", () => {
  const result = bindDirectorRuntimeConsumerContext({
    bindingId: "bind.object",
    consumer,
    scope: "subject",
    activeObject: { kind: "object", id: "factory", label: "Factory" },
  });
  assert.ok(result.context);
  assert.equal(result.context.activeObject.presence, "known");
  if (result.context.activeObject.presence === "known") {
    assert.equal(result.context.activeObject.value.id, "factory");
  }
});

test("11. pack context can be represented", () => {
  const result = bindDirectorRuntimeConsumerContext({
    bindingId: "bind.pack",
    consumer,
    scope: "workspace",
    activePack: {
      packId: "pack.capacity-constraint",
      packCategory: "problem",
      label: "Capacity Constraint",
    },
  });
  assert.ok(result.context);
  assert.equal(result.context.activePack.presence, "known");
  if (result.context.activePack.presence === "known") {
    assert.equal(result.context.activePack.value.packCategory, "problem");
    assert.equal(
      result.context.activePack.value.packId,
      "pack.capacity-constraint",
    );
  }
});

test("12. temporal context is input-derived only", () => {
  assert.doesNotMatch(source, /\bDate\.now\s*\(|new\s+Date\s*\(|Math\.random\s*\(/);
  const result = bindDirectorRuntimeConsumerContext({
    bindingId: "bind.temporal",
    consumer,
    scope: "workspace",
    temporal: {
      temporalKind: "historical",
      timelinePosition: "t-42",
      periodLens: "quarter",
    },
  });
  assert.ok(result.context);
  assert.equal(result.context.temporal.presence, "known");
  if (result.context.temporal.presence === "known") {
    assert.equal(result.context.temporal.value.temporalKind, "historical");
    assert.equal(result.context.temporal.value.timelinePosition, "t-42");
  }
});

test("13. attention context is preserved without recalculation", () => {
  const result = bindDirectorRuntimeConsumerContext({
    bindingId: "bind.attention",
    consumer,
    scope: "workspace",
    attention: {
      attentionTarget: { kind: "problem", id: "production-bottleneck" },
      attentionPriority: "primary",
      attentionReason: "Production Bottleneck",
    },
  });
  assert.ok(result.context);
  assert.equal(result.context.attention.presence, "known");
  if (result.context.attention.presence === "known") {
    assert.equal(
      result.context.attention.value.attentionPriority,
      "primary",
    );
    assert.equal(
      result.context.attention.value.attentionReason,
      "Production Bottleneck",
    );
    assert.equal(
      result.context.attention.value.attentionTarget?.id,
      "production-bottleneck",
    );
  }
  assert.doesNotMatch(source, /\brecalculate|scoreAttention|rankAttention\b/i);
});

test("14. guidance context is preserved without regeneration", () => {
  const result = bindDirectorRuntimeConsumerContext({
    bindingId: "bind.guidance",
    consumer,
    scope: "workspace",
    guidance: {
      guidanceSubject: { kind: "object", id: "factory" },
      guidanceIntent: "inspect",
      guidanceReason: "Inspect Capacity Constraint",
    },
  });
  assert.ok(result.context);
  assert.equal(result.context.guidance.presence, "known");
  if (result.context.guidance.presence === "known") {
    assert.equal(result.context.guidance.value.guidanceIntent, "inspect");
    assert.equal(
      result.context.guidance.value.guidanceReason,
      "Inspect Capacity Constraint",
    );
  }
  assert.doesNotMatch(source, /\b(?:openai|anthropic|llm|generateGuidance)\b/i);
});

test("15. availability states work correctly", () => {
  assert.deepEqual([...availabilityStates], [
    "available",
    "partial",
    "unavailable",
  ]);
  assert.deepEqual(
    [...listDirectorRuntimeConsumerContextAvailabilityStates()],
    [...availabilityStates],
  );
  const unavailable = bindDirectorRuntimeConsumerContext({
    bindingId: "bind.unavailable",
    consumer,
    scope: "global",
  });
  assert.equal(unavailable.context?.availability, "unavailable");

  const partial = bindDirectorRuntimeConsumerContext({
    bindingId: "bind.partial-avail",
    consumer,
    scope: "workspace",
    activeObject: { kind: "object", id: "factory" },
  });
  assert.equal(partial.context?.availability, "partial");

  const available = bindDirectorRuntimeConsumerContext({
    bindingId: "bind.available",
    consumer,
    scope: "workspace",
    mode: "goal",
    activeGoal: { kind: "goal", id: "g1" },
    activeObject: { kind: "object", id: "factory" },
    selectedSubject: { kind: "object", id: "factory" },
  });
  assert.equal(available.context?.availability, "available");
});

test("16. fully valid context produces bound", () => {
  const result = bindDirectorRuntimeConsumerContext({
    bindingId: "bind.full",
    consumer,
    scope: "workspace",
    mode: "war-room",
    activeSubject: { kind: "object", id: "factory" },
    selectedSubject: { kind: "object", id: "factory" },
    focusedSubject: { kind: "object", id: "kpi-production" },
    activeGoal: {
      kind: "goal",
      id: "increase-production-capacity",
    },
    activeObject: { kind: "object", id: "factory" },
    attention: {
      attentionTarget: { kind: "problem", id: "bottleneck" },
      attentionPriority: "primary",
    },
    guidance: {
      guidanceIntent: "inspect",
      guidanceReason: "Inspect Capacity Constraint",
    },
  });
  assert.equal(result.status, "bound");
  assert.ok(result.context);
  assert.equal(result.context.availability, "available");
});

test("17. incomplete valid context can produce partially-bound", () => {
  const result = bindDirectorRuntimeConsumerContext({
    bindingId: "bind.partial",
    consumer,
    scope: "workspace",
    activeObject: { kind: "object", id: "factory" },
  });
  assert.equal(result.status, "partially-bound");
  assert.ok(result.context);
  assert.equal(result.context.activeObject.presence, "known");
  assert.equal(result.context.activeGoal.presence, "absent");
});

test("18. missing usable context can produce unbound", () => {
  const result = bindDirectorRuntimeConsumerContext({
    bindingId: "bind.empty",
    consumer,
    scope: "global",
  });
  assert.equal(result.status, "unbound");
  assert.ok(result.context);
  assert.equal(result.context.availability, "unavailable");
  assert.ok(
    result.diagnostics.some((entry) => entry.kind === "missing-context"),
  );
});

test("19. structurally invalid input produces invalid", () => {
  const badConsumer = bindDirectorRuntimeConsumerContext({
    bindingId: "bind.bad-consumer",
    consumer: {
      consumerId: "",
      consumerFamily: "executive-experience",
    },
    scope: "workspace",
    activeObject: { kind: "object", id: "factory" },
  });
  assert.equal(badConsumer.status, "invalid");
  assert.equal(badConsumer.context, null);

  const badKind = bindDirectorRuntimeConsumerContext({
    bindingId: "bind.bad-kind",
    consumer,
    scope: "workspace",
    activeGoal: { kind: "object", id: "not-a-goal" },
  });
  assert.equal(badKind.status, "invalid");
  assert.ok(
    badKind.diagnostics.some((entry) => entry.kind === "kind-mismatch"),
  );

  const badScope = bindDirectorRuntimeConsumerContext({
    bindingId: "bind.bad-scope",
    consumer,
    scope: "dashboard" as never,
  });
  assert.equal(badScope.status, "invalid");
});

test("20. diagnostics are deterministic", () => {
  const input = {
    bindingId: "bind.diag",
    consumer,
    scope: "workspace" as const,
    activeGoal: { kind: "object" as const, id: "x" },
  };
  const first = bindDirectorRuntimeConsumerContext(input);
  const second = bindDirectorRuntimeConsumerContext(input);
  assert.deepEqual(first.diagnostics, second.diagnostics);
  assert.equal(Object.isFrozen(first.diagnostics), true);
  assert.equal(new Set(diagnosticKinds).size, diagnosticKinds.length);
});

test("21. provenance is deterministic", () => {
  const result = bindDirectorRuntimeConsumerContext({
    bindingId: "bind.prov",
    consumer,
    scope: "workspace",
    activeObject: { kind: "object", id: "factory" },
    provenance: {
      sourceIdentity: "upstream.source",
      sourceNamespace: "nexora.test",
      sourceVersion: "1.0.0",
    },
  });
  assert.deepEqual(result.provenance, {
    sourceIdentity: "upstream.source",
    sourceNamespace: "nexora.test",
    sourceVersion: "1.0.0",
    bindingIdentity: "bind.prov",
  });
  assert.deepEqual([...provenanceFields], [
    "sourceIdentity",
    "sourceNamespace",
    "sourceVersion",
    "bindingIdentity",
  ]);
  assert.doesNotMatch(source, /\bcrypto\.randomUUID|sessionStorage|machineId\b/);
});

test("22. input is not mutated", () => {
  const mutableSubject = { kind: "object" as const, id: "factory" };
  const input = {
    bindingId: "bind.immutable-input",
    consumer: { ...consumer },
    scope: "workspace" as const,
    activeObject: mutableSubject,
    selectedSubject: mutableSubject,
  };
  const snap = JSON.stringify(input);
  bindDirectorRuntimeConsumerContext(input);
  assert.equal(JSON.stringify(input), snap);
  mutableSubject.id = "mutated-after";
  assert.equal(input.activeObject.id, "mutated-after");
});

test("23. output is immutable", () => {
  const result = bindDirectorRuntimeConsumerContext({
    bindingId: "bind.immutable-output",
    consumer,
    scope: "workspace",
    activeObject: { kind: "object", id: "factory" },
    attention: {
      attentionTarget: { kind: "problem", id: "p1" },
      attentionPriority: "primary",
    },
  });
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.diagnostics), true);
  assert.equal(Object.isFrozen(result.provenance), true);
  assert.ok(result.context);
  assert.equal(Object.isFrozen(result.context), true);
  assert.throws(() => {
    (result as { status?: string }).status = "invalid";
  });
  assert.throws(() => {
    (result.context as { availability?: string }).availability = "unavailable";
  });
});

test("24. no synthetic business context is generated", () => {
  const result = bindDirectorRuntimeConsumerContext({
    bindingId: "bind.no-synth",
    consumer,
    scope: "workspace",
    activeObject: { kind: "object", id: "factory" },
  });
  assert.ok(result.context);
  assert.equal(result.context.activeGoal.presence, "absent");
  assert.equal(result.context.activePack.presence, "absent");
  assert.equal(result.context.attention.presence, "absent");
  assert.equal(result.context.guidance.presence, "absent");
  assert.equal(result.context.focusedSubject.presence, "absent");
  assert.doesNotMatch(
    JSON.stringify(result.context),
    /Production Efficiency|invented|synthetic/i,
  );
});

test("25. context precedence is deterministic", () => {
  assert.deepEqual([...precedence], [
    "subject",
    "surface",
    "workspace",
    "global",
  ]);
  const resolved = resolveDirectorRuntimeConsumerContext({
    bindingId: "bind.precedence",
    consumer,
    scope: "subject",
    globalContext: {
      activeObject: { kind: "object", id: "global-factory" },
      mode: "monitoring",
    },
    workspaceContext: {
      activeObject: { kind: "object", id: "workspace-factory" },
      mode: "analysis",
    },
    subjectContext: {
      activeObject: { kind: "object", id: "subject-factory" },
    },
  });
  assert.ok(resolved.context);
  assert.equal(resolved.context.activeObject.presence, "known");
  if (resolved.context.activeObject.presence === "known") {
    assert.equal(resolved.context.activeObject.value.id, "subject-factory");
  }
  assert.equal(resolved.context.mode.presence, "known");
  if (resolved.context.mode.presence === "known") {
    assert.equal(resolved.context.mode.value, "analysis");
  }
  assert.equal(resolved.context.effectivePrecedence, "subject");

  const explicitWins = bindDirectorRuntimeConsumerContext({
    bindingId: "bind.explicit-wins",
    consumer,
    scope: "workspace",
    activeObject: { kind: "object", id: "explicit-factory" },
    subjectContext: {
      activeObject: { kind: "object", id: "subject-factory" },
    },
  });
  assert.ok(explicitWins.context);
  if (explicitWins.context.activeObject.presence === "known") {
    assert.equal(
      explicitWins.context.activeObject.value.id,
      "explicit-factory",
    );
  }
});

test("26. registry counts are derived", () => {
  assert.equal(registry.scopeCount, scopes.length);
  assert.equal(registry.subjectKindCount, subjectKinds.length);
  assert.equal(registry.availabilityStateCount, availabilityStates.length);
  assert.equal(registry.bindingStatusCount, bindingStatuses.length);
  assert.equal(registry.contextCapabilityCount, contextCapabilities.length);
  assert.equal(registry.diagnosticKindCount, diagnosticKinds.length);
  assert.equal(registry.provenanceFieldCount, provenanceFields.length);
  assert.equal(registry.precedenceRuleCount, precedence.length);
  assert.equal(registry.guaranteeCount, guarantees.length);
  assert.equal(registry.registrySectionCount, registrySections.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.deepEqual([...registrySections], [
    "identity",
    "dependency",
    "scopes",
    "subject-kinds",
    "availability-states",
    "binding-statuses",
    "context-capabilities",
    "precedence",
    "diagnostics",
    "provenance",
    "guarantees",
  ]);
});

test("27. verification passes", () => {
  const first = verifyDirectorRuntimeConsumerContextBinding();
  const second = verifyDirectorRuntimeConsumerContextBinding();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(first.scopeCount, 4);
  assert.equal(first.subjectKindCount, 7);
  assert.equal(first.availabilityStateCount, 3);
  assert.equal(first.bindingStatusCount, 4);
  assert.equal(first.contextCapabilityCount, 14);
  assert.equal(first.guaranteeCount, 9);
  assert.equal(first.registrySectionCount, 11);
  assert.equal(first.dri81BoundaryIntact, true);
  assert.equal(first.frameworkIndependent, true);
  assert.equal(
    binding.architecturalStatus,
    "Context Binding Complete · Deterministic · Immutable · Framework-Independent · ReadyForExperienceSurfaceBinding",
  );
});

test("28. no React dependency", () => {
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next)["']/i);
  assert.doesNotMatch(source, /\b(?:React|ReactDOM|JSX|useState|useEffect|createContext)\b/);
});

test("29. no Three.js dependency", () => {
  assert.doesNotMatch(source, /from\s+["'](?:three|@react-three(?:\/[^"']*)?)["']/i);
  assert.doesNotMatch(source, /\b(?:THREE|WebGL|Object3D|Mesh|Material|Vector3)\b/);
});

test("30. no DOM/browser dependency", () => {
  assert.doesNotMatch(
    source,
    /\b(?:MouseEvent|PointerEvent|KeyboardEvent|HTMLElement|addEventListener|onClick)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:window|document|localStorage|sessionStorage|fetch|XMLHttpRequest|navigator)\b/,
  );
});

test("31. no Executive component dependency", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/(?:components|executive|screens)(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:ExecutiveStage|AnimatableObject|AdvisorPanel|InsightPanel|LiveLens)\b/,
  );
});

test("32. DRI-8:1 behavior remains unchanged", () => {
  const foundation = verifyDirectorRuntimeConsumerIntegrationFoundation();
  assert.equal(foundation.ok, true);
  assert.equal(
    foundation.identity,
    "DRI-8:1/DirectorRuntimeConsumerIntegrationFoundation",
  );
  assert.equal(foundation.version, "8.1.0");
  assert.doesNotMatch(
    source,
    /verifyDirectorRuntimeConsumerIntegrationFoundation/,
  );
});

test("33. example semantic flow binds without visual decisions", () => {
  const result = bindDirectorRuntimeConsumerContext({
    bindingId: "bind.example-flow",
    consumer,
    scope: "workspace",
    mode: "goal",
    activeGoal: {
      kind: "goal",
      id: "increase-production-capacity",
      label: "Increase Production Capacity",
    },
    activeObject: { kind: "object", id: "factory", label: "Factory" },
    selectedSubject: { kind: "object", id: "factory" },
    focusedSubject: { kind: "object", id: "kpi-production" },
    attention: {
      attentionTarget: { kind: "problem", id: "production-bottleneck" },
      attentionReason: "Production Bottleneck",
    },
    guidance: {
      guidanceReason: "Inspect Capacity Constraint",
      guidanceIntent: "inspect",
    },
  });
  assert.equal(result.status, "bound");
  assert.ok(result.context);
  assert.doesNotMatch(
    JSON.stringify(result.context),
    /(?:glow|color|camera|animation|cssClass|opacity)/i,
  );
  const validation = validateDirectorRuntimeConsumerContext(result.context);
  assert.equal(validation.length, 0);
});

test("34. relevant upstream DRI-7 public index remains healthy", () => {
  const publicIndex = verifyDirectorRuntimeExecutiveGuidancePublicIndex();
  assert.equal(publicIndex.ok, true);
  assert.equal(
    publicIndex.identity,
    "DRI-7:9/DirectorRuntimeExecutiveGuidancePublicIndex",
  );
});
