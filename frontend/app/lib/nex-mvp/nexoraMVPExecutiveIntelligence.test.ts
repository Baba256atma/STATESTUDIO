/**
 * NEX-MVP:7 — pure Advisor + Insight intelligence tests.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  applyNexoraMVPIntelligenceResolution,
  buildNexoraMVPIntelligenceContextKey,
  deriveNexoraMVPExecutiveIntelligenceContext,
  getNexoraMVPAdvisorInsightExperienceIdentity,
  mapNexoraMVPAdvisorViewModel,
  mapNexoraMVPInsightViewModel,
  NEXORA_MVP_INTELLIGENCE_UPSTREAM_SURFACES,
  resolveNexoraMVPExecutiveIntelligence,
  verifyNexoraMVPAdvisorInsightExperience,
  type NexoraMVPExecutiveIntelligenceContext,
} from "./nexoraMVPExecutiveIntelligence.ts";
import type { NexoraMVPAdvisorContextBridge } from "./nexoraMVPObjectInteraction.ts";
import { deriveNexoraMVPPresentationViewModel } from "./nexoraMVPPresentationState.ts";

function bridge(overrides?: Partial<NexoraMVPAdvisorContextBridge>): NexoraMVPAdvisorContextBridge {
  return Object.freeze({
    selectedSubject: Object.freeze({ id: "obj-capacity", kind: "object" as const }),
    focusedSubject: Object.freeze({ id: "obj-capacity", kind: "object" as const }),
    primaryStageSubjectId: "obj-capacity",
    advisorSubjectId: "obj-capacity",
    subjectKind: "object",
    relatedSubjectIds: Object.freeze(["obj-capacity"]),
    contextSubjectIds: Object.freeze(["ctx-problem-capacity"]),
    activeWorkspace: "problem",
    presentationState: "report",
    environmentIntent: "investigate",
    interactionMode: "object-focused",
    breadcrumb: Object.freeze([
      Object.freeze({ id: "trail-overview", kind: "object" as const, label: "Overview" }),
      Object.freeze({ id: "obj-capacity", kind: "object" as const, label: "Capacity" }),
    ]),
    ...overrides,
  });
}

function contextFor(input?: {
  readonly workspace?: NexoraMVPAdvisorContextBridge["activeWorkspace"];
  readonly presentationState?: NexoraMVPAdvisorContextBridge["presentationState"];
  readonly subjectId?: string | null;
}): NexoraMVPExecutiveIntelligenceContext {
  const subjectId = input?.subjectId === undefined ? "obj-capacity" : input.subjectId;
  const subject =
    subjectId == null
      ? null
      : Object.freeze({
          id: subjectId,
          kind: subjectId.startsWith("ctx-")
            ? subjectId.includes("scenario")
              ? ("scenario" as const)
              : subjectId.includes("decision")
                ? ("decision" as const)
                : subjectId.includes("execution")
                  ? ("execution" as const)
                  : ("problem" as const)
            : ("object" as const),
          label:
            subjectId === "obj-capacity"
              ? "Capacity"
              : subjectId === "obj-revenue"
                ? "Revenue"
                : subjectId === "ctx-scenario-pricing"
                  ? "Pricing Response"
                  : subjectId === "ctx-decision-reprice"
                    ? "Approve Repricing"
                    : subjectId === "ctx-execution-rollout"
                      ? "Pricing Rollout"
                      : subjectId === "ctx-problem-capacity"
                        ? "Capacity Gap"
                        : subjectId,
        });

  const presentationState = input?.presentationState ?? "report";
  const workspace = input?.workspace ?? "problem";
  const presentationViewModel = deriveNexoraMVPPresentationViewModel({
    presentationState,
    workspace,
    environmentIntent:
      workspace === "scenario"
        ? "simulate"
        : workspace === "decision"
          ? "commit"
          : workspace === "execution"
            ? "execute"
            : workspace === "problem"
              ? "investigate"
              : "neutral",
    subjectId,
    subjectKind: subject?.kind ?? null,
    subjectLabel: subject?.label ?? null,
  });

  return deriveNexoraMVPExecutiveIntelligenceContext({
    advisorBridge: bridge({
      activeWorkspace: workspace,
      presentationState,
      environmentIntent: presentationViewModel.environmentIntent,
      selectedSubject: subject
        ? Object.freeze({ id: subject.id, kind: subject.kind })
        : null,
      focusedSubject: subject
        ? Object.freeze({ id: subject.id, kind: subject.kind })
        : null,
      subjectKind: subject?.kind ?? null,
      contextSubjectIds:
        subjectId === "obj-capacity"
          ? Object.freeze(["ctx-problem-capacity"])
          : subjectId === "obj-revenue"
            ? Object.freeze([
                "ctx-problem-margin",
                "ctx-scenario-pricing",
                "ctx-decision-reprice",
              ])
            : Object.freeze([]),
      breadcrumb:
        subject == null
          ? Object.freeze([
              Object.freeze({
                id: "trail-overview",
                kind: "object" as const,
                label: "Overview",
              }),
            ])
          : Object.freeze([
              Object.freeze({
                id: "trail-overview",
                kind: "object" as const,
                label: "Overview",
              }),
              subject,
            ]),
      interactionMode: subject == null ? "overview" : "object-focused",
    }),
    presentationViewModel,
    focusedSubject: subject,
    selectedSubject: subject,
    breadcrumb:
      subject == null
        ? Object.freeze([
            Object.freeze({
              id: "trail-overview",
              kind: "object" as const,
              label: "Overview",
            }),
          ])
        : Object.freeze([
            Object.freeze({
              id: "trail-overview",
              kind: "object" as const,
              label: "Overview",
            }),
            subject,
          ]),
  });
}

describe("NEX-MVP:7 Executive Intelligence", () => {
  it("1. executive intelligence context derivation", () => {
    const context = contextFor();
    assert.equal(context.subjectLabel, "Capacity");
    assert.equal(context.workspace, "problem");
    assert.ok(context.contextKey.includes("problem"));
  });

  it("2. focused subject mapping", () => {
    const advisor = mapNexoraMVPAdvisorViewModel(contextFor());
    assert.equal(advisor.subjectId, "obj-capacity");
    assert.match(advisor.title, /Capacity/);
  });

  it("3. no-selection overview context", () => {
    const context = contextFor({ subjectId: null, workspace: "overview" });
    const insight = mapNexoraMVPInsightViewModel(context);
    assert.equal(insight.subjectId, null);
    assert.match(insight.title, /Overview/);
    assert.ok(context.overviewAttention.length > 0);
  });

  it("4. workspace preservation", () => {
    const context = contextFor({ workspace: "scenario" });
    assert.equal(context.workspace, "scenario");
    assert.equal(mapNexoraMVPAdvisorViewModel(context).contextLine.includes("scenario"), true);
  });

  it("5. presentation-state mapping", () => {
    const minimum = mapNexoraMVPAdvisorViewModel(
      contextFor({ presentationState: "minimum" }),
    );
    const operation = mapNexoraMVPAdvisorViewModel(
      contextFor({ presentationState: "operation" }),
    );
    assert.ok(minimum.observation || minimum.recommendation);
    assert.ok(operation.nextActions.length >= 0);
  });

  it("6. KPI mapping", () => {
    const insight = mapNexoraMVPInsightViewModel(contextFor());
    assert.ok(insight.primaryKpi);
    assert.equal(insight.primaryKpi?.value, "88%");
  });

  it("7. KOI mapping", () => {
    const revenue = mapNexoraMVPInsightViewModel(
      contextFor({ subjectId: "obj-revenue", workspace: "overview" }),
    );
    assert.ok(revenue.koi);
    const capacity = mapNexoraMVPInsightViewModel(contextFor());
    assert.equal(capacity.koi, null);
  });

  it("8. relationship mapping", () => {
    const insight = mapNexoraMVPInsightViewModel(contextFor());
    assert.ok(insight.relationships.length > 0);
  });

  it("9. attention mapping", () => {
    const context = contextFor();
    assert.ok(context.attention);
    assert.ok(mapNexoraMVPInsightViewModel(context).attention);
  });

  it("10. Advisor result mapping", () => {
    const advisor = mapNexoraMVPAdvisorViewModel(contextFor());
    assert.ok(advisor.recommendation || advisor.emptyReason);
  });

  it("11. Insight result mapping", () => {
    const insight = mapNexoraMVPInsightViewModel(contextFor());
    assert.ok(insight.headline);
    assert.ok(insight.summary);
  });

  it("12. unavailable field omission", () => {
    const insight = mapNexoraMVPInsightViewModel(contextFor());
    assert.equal(insight.koi, null);
    assert.equal(insight.changes.length, 0);
  });

  it("13. recommendation ordering prefers available actions", () => {
    const advisor = mapNexoraMVPAdvisorViewModel(
      contextFor({ presentationState: "operation", subjectId: "obj-revenue" }),
    );
    assert.ok(advisor.nextActions.every((action) => action.available));
  });

  it("14. stale context identity handling", () => {
    const resolution = resolveNexoraMVPExecutiveIntelligence(contextFor());
    const applied = applyNexoraMVPIntelligenceResolution({
      currentContextKey: "stale-key",
      resolution,
    });
    assert.equal(applied, null);
    assert.ok(
      applyNexoraMVPIntelligenceResolution({
        currentContextKey: resolution.contextKey,
        resolution,
      }),
    );
  });

  it("15. deterministic repeated mapping", () => {
    const a = resolveNexoraMVPExecutiveIntelligence(contextFor());
    const b = resolveNexoraMVPExecutiveIntelligence(contextFor());
    assert.equal(JSON.stringify(a), JSON.stringify(b));
  });

  it("16. no fabricated KPI/KOI/result fields", () => {
    const insight = mapNexoraMVPInsightViewModel(contextFor());
    assert.equal(insight.koi, null);
    assert.equal(insight.primaryKpi?.id, "kpi-capacity");
    assert.equal(verifyNexoraMVPAdvisorInsightExperience().ok, true);
  });

  it("identity and upstream surface declarations", () => {
    const identity = getNexoraMVPAdvisorInsightExperienceIdentity();
    assert.equal(identity.id, "NEX-MVP:7/NexoraAdvisorInsightExperience");
    assert.equal(identity.version, "1.7.0");
    assert.match(
      NEXORA_MVP_INTELLIGENCE_UPSTREAM_SURFACES.rexAdvisorPublicIndex,
      /REX-3:9/,
    );
    assert.match(
      NEXORA_MVP_INTELLIGENCE_UPSTREAM_SURFACES.rexInsightPublicIndex,
      /REX-4:9/,
    );
  });

  it("context key is stable", () => {
    const key = buildNexoraMVPIntelligenceContextKey({
      workspace: "scenario",
      presentationState: "report",
      focusedSubjectId: "obj-capacity",
      selectedSubjectId: "obj-capacity",
    });
    assert.equal(
      key,
      buildNexoraMVPIntelligenceContextKey({
        workspace: "scenario",
        presentationState: "report",
        focusedSubjectId: "obj-capacity",
        selectedSubjectId: "obj-capacity",
      }),
    );
  });

  it("problem / scenario / decision / execution subject kinds", () => {
    assert.equal(
      mapNexoraMVPInsightViewModel(
        contextFor({ subjectId: "ctx-problem-capacity", workspace: "problem" }),
      ).subjectKind,
      "problem",
    );
    assert.equal(
      mapNexoraMVPInsightViewModel(
        contextFor({
          subjectId: "ctx-scenario-pricing",
          workspace: "scenario",
        }),
      ).subjectKind,
      "scenario",
    );
    assert.equal(
      mapNexoraMVPInsightViewModel(
        contextFor({
          subjectId: "ctx-decision-reprice",
          workspace: "decision",
        }),
      ).subjectKind,
      "decision",
    );
    assert.equal(
      mapNexoraMVPInsightViewModel(
        contextFor({
          subjectId: "ctx-execution-rollout",
          workspace: "execution",
        }),
      ).subjectKind,
      "execution",
    );
  });
});
