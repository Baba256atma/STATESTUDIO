import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_ADVISOR_BINDING_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_ADVISOR_BINDING_CAPABILITIES as capabilities,
  RUNTIME_EXECUTIVE_ADVISOR_BINDING_PRECEDENCE_RULES as precedenceRules,
  RUNTIME_EXECUTIVE_ADVISOR_BINDING_PUBLIC_TYPE_NAMES as publicTypeNames,
  RUNTIME_EXECUTIVE_ADVISOR_BINDING_REGISTRY_SECTIONS as registrySections,
  RUNTIME_EXECUTIVE_ADVISOR_BINDING_SOURCE_KINDS as bindingSources,
  RUNTIME_EXECUTIVE_ADVISOR_BINDING_STATES as bindingStates,
  bindRuntimeExecutiveAdvisorContext,
  collectRuntimeExecutiveAdvisorSubjectCandidates,
  createRuntimeExecutiveAdvisorBindingEvidence,
  createRuntimeExecutiveAdvisorBindingSnapshot,
  getRuntimeExecutiveAdvisorBindingPrecedence,
  getRuntimeExecutiveAdvisorContextSubjectBindingIdentity,
  isRuntimeExecutiveAdvisorContextBound,
  isRuntimeExecutiveAdvisorSubjectBound,
  normalizeRuntimeExecutiveAdvisorBindingInput,
  resolveRuntimeExecutiveAdvisorStageRelationship,
  resolveRuntimeExecutiveAdvisorSubject,
  runtimeExecutiveAdvisorContextSubjectBinding as binding,
  runtimeExecutiveAdvisorContextSubjectBindingApiNames as apiNames,
  runtimeExecutiveAdvisorContextSubjectBindingCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveAdvisorContextSubjectBindingRegistry as registry,
  validateRuntimeExecutiveAdvisorBindingEvidence,
  validateRuntimeExecutiveAdvisorBindingResult,
  verifyRuntimeExecutiveAdvisorContextSubjectBinding,
} from "./runtimeExecutiveAdvisorContextSubjectBinding.ts";

import {
  createRuntimeExecutiveAdvisorActionAffordance,
  createRuntimeExecutiveAdvisorContext,
  createRuntimeExecutiveAdvisorSubject,
  runtimeExecutiveAdvisorExperienceFoundationIdentity,
  runtimeExecutiveAdvisorExperienceFoundationSupportedImportPath,
  verifyRuntimeExecutiveAdvisorExperienceFoundation,
} from "@/app/lib/rex/runtimeExecutiveAdvisorExperienceFoundation";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveAdvisorContextSubjectBinding.ts",
    import.meta.url,
  ),
  "utf8",
);

function subject(
  id: string,
  label: string,
  kind: "nexora-object" | "workspace" | "kpi" = "nexora-object",
) {
  return createRuntimeExecutiveAdvisorSubject({ id, kind, label });
}

const factory = () => subject("object.factory", "Factory");
const delivery = () => subject("object.delivery", "Delivery");
const supplier = () => subject("object.supplier", "Supplier");
const customer = () => subject("object.customer", "Customer");
const workspace = () => subject("workspace.supply-chain", "Supply Chain", "workspace");

test("1. exact REX-3:2 identity / version / namespace / layer / domain / phase", () => {
  assert.equal(
    binding.identity,
    "REX-3:2/RuntimeExecutiveAdvisorContextSubjectBinding",
  );
  assert.equal(binding.version, "3.2.0");
  assert.equal(
    binding.namespace,
    "nexora.rex.advisor-experience.context-subject-binding",
  );
  assert.equal(binding.layer, "RuntimeExecutiveExperience");
  assert.equal(binding.domain, "ExecutiveAdvisor");
  assert.equal(binding.phase, "ContextSubjectBinding");
  assert.equal(binding.status, "BindingReady");
  assert.deepEqual(
    getRuntimeExecutiveAdvisorContextSubjectBindingIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-3:1 foundation", () => {
  assert.equal(
    binding.upstreamDependency,
    "REX-3:1/RuntimeExecutiveAdvisorExperienceFoundation",
  );
  assert.equal(
    binding.upstreamDependency,
    runtimeExecutiveAdvisorExperienceFoundationIdentity,
  );
  assert.equal(
    binding.dependencyPath,
    runtimeExecutiveAdvisorExperienceFoundationSupportedImportPath,
  );
  assert.equal(
    binding.dependencyPath,
    "@/app/lib/rex/runtimeExecutiveAdvisorExperienceFoundation",
  );
  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveAdvisorExperienceFoundation",
  ]);
});

test("3. no direct REX-2 / REX-1 / EX-DRI / DRI / NOL imports", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveStage/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeEnabledExecutiveExperience/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol)(?:\/[^"']*)?["']/,
  );
  assert.equal(boundary.consumesFoundationOnly, true);
  assert.equal(boundary.importsRex2Directly, false);
  assert.equal(boundary.importsRex1Directly, false);
  assert.equal(boundary.importsExDriDirectly, false);
  assert.equal(boundary.importsDriDirectly, false);
  assert.equal(boundary.importsNolDirectly, false);
});

test("4. binding source kinds / states / precedence order", () => {
  assert.deepEqual([...bindingSources], [
    "explicit-manager-intent",
    "stage-selection",
    "stage-focus",
    "interaction",
    "attention",
    "scene",
    "presentation",
    "runtime-context",
    "related-subject",
  ]);
  assert.deepEqual([...bindingStates], [
    "unbound",
    "context-bound",
    "subject-bound",
    "fully-bound",
  ]);
  assert.deepEqual(
    precedenceRules.map((rule) => rule.sourceKind),
    [...bindingSources],
  );
  assert.ok(
    getRuntimeExecutiveAdvisorBindingPrecedence("explicit-manager-intent") >
      getRuntimeExecutiveAdvisorBindingPrecedence("stage-selection"),
  );
  assert.ok(
    getRuntimeExecutiveAdvisorBindingPrecedence("stage-selection") >
      getRuntimeExecutiveAdvisorBindingPrecedence("stage-focus"),
  );
  assert.ok(
    getRuntimeExecutiveAdvisorBindingPrecedence("stage-focus") >
      getRuntimeExecutiveAdvisorBindingPrecedence("interaction"),
  );
  assert.ok(
    getRuntimeExecutiveAdvisorBindingPrecedence("attention", "critical") >
      getRuntimeExecutiveAdvisorBindingPrecedence("scene"),
  );
  assert.ok(
    getRuntimeExecutiveAdvisorBindingPrecedence("scene") >
      getRuntimeExecutiveAdvisorBindingPrecedence("attention", "ambient"),
  );
  assert.equal(registry.bindingSourceCount, bindingSources.length);
  assert.equal(registry.bindingStateCount, bindingStates.length);
  assert.equal(registry.precedenceRuleCount, precedenceRules.length);
});

test("5. evidence / candidate construction and duplicate coalescing", () => {
  const evidence = [
    createRuntimeExecutiveAdvisorBindingEvidence({
      sourceKind: "stage-selection",
      subject: factory(),
      sourceId: "factory-01",
    }),
    createRuntimeExecutiveAdvisorBindingEvidence({
      sourceKind: "stage-focus",
      subject: factory(),
    }),
    createRuntimeExecutiveAdvisorBindingEvidence({
      sourceKind: "attention",
      subject: factory(),
      attention: "elevated",
    }),
  ];
  const candidates = collectRuntimeExecutiveAdvisorSubjectCandidates(evidence);
  assert.equal(candidates.length, 1);
  assert.equal(candidates[0]!.subject.id, "object.factory");
  assert.equal(candidates[0]!.sourceKind, "stage-selection");
  assert.equal(candidates[0]!.evidence.length, 3);
  assert.equal(Object.isFrozen(candidates[0]), true);
  assert.equal(Object.isFrozen(candidates[0]!.evidence), true);
});

test("6. Example A — Stage selection binds Advisor subject", () => {
  const result = bindRuntimeExecutiveAdvisorContext({
    evidence: [
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "stage-selection",
        subject: factory(),
        sourceId: "factory-01",
      }),
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "scene",
        subject: supplier(),
      }),
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "related-subject",
        subject: delivery(),
      }),
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "related-subject",
        subject: customer(),
      }),
    ],
  });

  assert.equal(result.activeSubject?.id, "object.factory");
  assert.equal(result.context.stageRelationship, "selected-subject");
  assert.equal(result.context.engagement, "guiding");
  assert.ok(
    result.state === "subject-bound" || result.state === "fully-bound",
  );
  assert.equal(result.isContextual, true);
  assert.equal(result.isGuidanceReady, true);
  assert.equal(isRuntimeExecutiveAdvisorSubjectBound(result), true);
  assert.doesNotMatch(JSON.stringify(result), /capacity is causing/i);
});

test("7. Example B — attention does not override selection", () => {
  const result = bindRuntimeExecutiveAdvisorContext({
    evidence: [
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "stage-selection",
        subject: factory(),
      }),
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "attention",
        subject: delivery(),
        attention: "critical",
      }),
    ],
  });

  assert.equal(result.activeSubject?.id, "object.factory");
  assert.ok(
    result.contextualSubjects.some((entry) => entry.id === "object.delivery"),
  );
  assert.equal(result.context.stageRelationship, "selected-subject");
  assert.equal(result.state, "fully-bound");
  assert.equal(result.context.attention, "critical");
});

test("8. Example C — explicit manager intent precedence", () => {
  const result = bindRuntimeExecutiveAdvisorContext({
    evidence: [
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "stage-selection",
        subject: factory(),
      }),
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "explicit-manager-intent",
        subject: delivery(),
        sourceId: "intent.delivery",
      }),
    ],
  });

  assert.equal(result.activeSubject?.id, "object.delivery");
  assert.ok(
    result.contextualSubjects.some((entry) => entry.id === "object.factory"),
  );
  assert.equal(result.candidates[0]!.sourceKind, "explicit-manager-intent");
  assert.equal(result.context.stageRelationship, "related-subject");
  assert.ok(
    result.context.provenance.some(
      (entry) => entry.kind === "explicit-manager-intent",
    ),
  );
});

test("9. Example D — focus without selection", () => {
  const result = bindRuntimeExecutiveAdvisorContext({
    evidence: [
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "stage-focus",
        subject: customer(),
      }),
    ],
  });

  assert.equal(result.activeSubject?.id, "object.customer");
  assert.equal(result.context.stageRelationship, "focused-subject");
  assert.equal(result.context.engagement, "engaged");
  assert.equal(result.state, "subject-bound");
});

test("10. Example E — context-only runtime/workspace binding", () => {
  const result = bindRuntimeExecutiveAdvisorContext({
    evidence: [
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "runtime-context",
        subject: workspace(),
      }),
    ],
  });

  assert.equal(result.activeSubject?.id, "workspace.supply-chain");
  assert.equal(result.state, "context-bound");
  assert.equal(result.context.engagement, "aware");
  assert.equal(result.isContextual, true);
  assert.equal(result.isGuidanceReady, false);
  assert.equal(isRuntimeExecutiveAdvisorContextBound(result), true);
  assert.equal(isRuntimeExecutiveAdvisorSubjectBound(result), false);
});

test("11. Example F — empty binding", () => {
  const result = bindRuntimeExecutiveAdvisorContext({ evidence: [] });
  assert.equal(result.state, "unbound");
  assert.equal(result.activeSubject, null);
  assert.deepEqual(result.contextualSubjects, []);
  assert.equal(result.context.engagement, "idle");
  assert.equal(result.isContextual, false);
  assert.equal(result.isGuidanceReady, false);
});

test("12. selection outranks focus; interaction and scene evidence", () => {
  const selectionFocus = bindRuntimeExecutiveAdvisorContext({
    evidence: [
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "stage-focus",
        subject: delivery(),
      }),
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "stage-selection",
        subject: factory(),
      }),
    ],
  });
  assert.equal(selectionFocus.activeSubject?.id, "object.factory");

  const interaction = bindRuntimeExecutiveAdvisorContext({
    evidence: [
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "interaction",
        subject: factory(),
        guidanceIntent: "inspect",
      }),
    ],
  });
  assert.equal(interaction.activeSubject?.id, "object.factory");
  assert.equal(interaction.context.intent, "inspect");

  const scene = bindRuntimeExecutiveAdvisorContext({
    evidence: [
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "scene",
        subject: supplier(),
      }),
    ],
  });
  assert.equal(scene.state, "context-bound");
  assert.equal(scene.context.engagement, "aware");
});

test("13. related-subject preservation and contextual ordering", () => {
  const result = bindRuntimeExecutiveAdvisorContext({
    evidence: [
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "stage-selection",
        subject: factory(),
      }),
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "related-subject",
        subject: delivery(),
      }),
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "related-subject",
        subject: supplier(),
      }),
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "related-subject",
        subject: subject("kpi.capacity", "Capacity KPI", "kpi"),
      }),
    ],
  });

  assert.equal(result.activeSubject?.id, "object.factory");
  assert.ok(
    !result.contextualSubjects.some((entry) => entry.id === "object.factory"),
  );
  assert.deepEqual(
    result.contextualSubjects.map((entry) => entry.id),
    ["object.delivery", "object.supplier", "kpi.capacity"],
  );
});

test("14. Stage relationship / engagement / intent / presentation / provenance", () => {
  const result = bindRuntimeExecutiveAdvisorContext({
    evidence: [
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "stage-selection",
        subject: factory(),
        presentationState: "report",
        attention: "elevated",
      }),
    ],
    baseContext: createRuntimeExecutiveAdvisorContext({
      intent: "investigate",
      informationDensity: "balanced",
      actionAffordances: [
        createRuntimeExecutiveAdvisorActionAffordance({
          id: "act.inspect",
          kind: "inspect",
          label: "Inspect",
          subjectId: "object.factory",
        }),
      ],
    }),
  });

  assert.equal(
    resolveRuntimeExecutiveAdvisorStageRelationship({
      activeSubject: result.activeSubject,
      evidence: result.evidence,
    }),
    "selected-subject",
  );
  assert.equal(result.context.intent, "investigate");
  assert.equal(result.context.presentationState, "report");
  assert.equal(result.context.attention, "elevated");
  assert.ok(
    result.context.provenance.some(
      (entry) => entry.kind === "stage-selection",
    ),
  );
  assert.equal(result.context.actionAffordances[0]?.enabled, true);

  const unboundAffordances = bindRuntimeExecutiveAdvisorContext({
    evidence: [],
    baseContext: createRuntimeExecutiveAdvisorContext({
      actionAffordances: [
        createRuntimeExecutiveAdvisorActionAffordance({
          id: "act.inspect",
          kind: "inspect",
          label: "Inspect",
          subjectId: "object.factory",
        }),
      ],
    }),
  });
  assert.equal(unboundAffordances.context.actionAffordances[0]?.enabled, false);
});

test("15. deterministic tie-breaking, immutability, snapshot", () => {
  const evidence = Object.freeze([
    Object.freeze({
      sourceKind: "scene" as const,
      subject: Object.freeze(supplier()),
    }),
    Object.freeze({
      sourceKind: "scene" as const,
      subject: Object.freeze(customer()),
    }),
  ]);
  const input = Object.freeze({ evidence });
  const before = JSON.stringify(input);

  const a = bindRuntimeExecutiveAdvisorContext(input);
  const b = bindRuntimeExecutiveAdvisorContext(input);
  assert.equal(JSON.stringify(input), before);
  assert.deepEqual(a, b);
  assert.deepEqual(
    resolveRuntimeExecutiveAdvisorSubject(evidence)?.id,
    a.activeSubject?.id,
  );

  const normalized = normalizeRuntimeExecutiveAdvisorBindingInput(input);
  assert.equal(JSON.stringify(input), before);
  assert.equal(Object.isFrozen(normalized.evidence), true);

  const snapshot = createRuntimeExecutiveAdvisorBindingSnapshot({ binding: a });
  assert.equal(snapshot.advisorSnapshot.isContextual, a.isContextual);
  assert.equal(Object.isFrozen(snapshot), true);
});

test("16. validation and registry", () => {
  const validEvidence = validateRuntimeExecutiveAdvisorBindingEvidence(
    createRuntimeExecutiveAdvisorBindingEvidence({
      sourceKind: "stage-selection",
      subject: factory(),
      sourceId: "factory-01",
    }),
  );
  assert.equal(validEvidence.ok, true);

  const invalidEvidence = validateRuntimeExecutiveAdvisorBindingEvidence({
    sourceKind: "not-a-source",
    subject: { id: "", kind: "nexora-object", label: "Bad" },
  });
  assert.equal(invalidEvidence.ok, false);

  const result = bindRuntimeExecutiveAdvisorContext({
    evidence: [
      createRuntimeExecutiveAdvisorBindingEvidence({
        sourceKind: "stage-selection",
        subject: factory(),
      }),
    ],
  });
  assert.equal(validateRuntimeExecutiveAdvisorBindingResult(result).ok, true);

  assert.deepEqual([...registrySections], [
    "Identity",
    "BindingSources",
    "BindingStates",
    "Precedence",
    "Resolvers",
    "Normalization",
    "Validation",
    "Capabilities",
    "Compatibility",
  ]);
  assert.equal(registry.sectionCount, registrySections.length);
  assert.equal(registry.capabilityCount, capabilities.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(registry.publicTypeCount, publicTypeNames.length);
  assert.ok(capabilities.includes("subject-precedence-resolution"));
  assert.ok(capabilities.includes("deterministic-tie-breaking"));
  assert.equal(capabilities.length, 19);
});

test("17. no Stage mutation / no AI / REX-3:1 compatibility / verification", () => {
  assert.equal(boundary.mutatesStageState, false);
  assert.equal(boundary.executesActions, false);
  assert.equal(boundary.generatesAdvice, false);
  assert.equal(boundary.parsesNaturalLanguage, false);
  assert.equal(boundary.aiProviderIndependent, true);
  assert.doesNotMatch(source, /\bfrom\s+["']react["']/);
  assert.doesNotMatch(source, /\b(?:select|focus|navigate|dispatch)\s*\(/);
  assert.doesNotMatch(source, /Math\.random|Date\.now|crypto\.randomUUID/);
  assert.doesNotMatch(source, /\bopenai\b|\banthropic\b|fetch\s*\(/i);
  assert.ok(binding.forbiddenResponsibilities.includes("Stage mutation"));
  assert.ok(binding.forbiddenResponsibilities.includes("LLM calls"));

  assert.equal(verifyRuntimeExecutiveAdvisorExperienceFoundation().ok, true);

  const verification = verifyRuntimeExecutiveAdvisorContextSubjectBinding();
  assert.equal(verification.ok, true);
  assert.equal(verification.selectionOutranksFocus, true);
  assert.equal(verification.attentionDoesNotOverrideSelection, true);
  assert.equal(verification.foundationOk, true);
  assert.equal(verification.noStageMutation, true);
  assert.equal(verification.noAi, true);
  assert.equal(verification.bindingSourceCount, 9);
  assert.equal(verification.bindingStateCount, 4);
  assert.equal(verification.precedenceRuleCount, 9);
  assert.equal(verification.capabilityCount, 19);
  assert.equal(verification.sectionCount, 9);
  assert.match(
    binding.architecturalStatus,
    /Ready for REX-3:3 Advisor Runtime Response Model/,
  );
});
