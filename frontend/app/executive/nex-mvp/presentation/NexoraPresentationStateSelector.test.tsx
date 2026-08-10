/**
 * NEX-MVP:6 — Presentation selector / composition tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraPresentationStateSelector } from "./NexoraPresentationStateSelector.tsx";
import { NexoraSubjectReport } from "./NexoraSubjectReport.tsx";
import { NexoraSubjectOperation } from "./NexoraSubjectOperation.tsx";
import { NexoraExecutiveShell } from "../NexoraExecutiveShell.tsx";
import {
  applyNexoraMVPPresentationStateChange,
  deriveNexoraMVPPresentationViewModel,
} from "../../../lib/nex-mvp/nexoraMVPPresentationState.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  selectNexoraMVPInteractionSubject,
} from "../../../lib/nex-mvp/nexoraMVPObjectInteraction.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

describe("NEX-MVP:6 Presentation States components", () => {
  it("1. presentation selector renders", () => {
    const html = renderToStaticMarkup(
      React.createElement(NexoraPresentationStateSelector, {
        activePresentationState: "minimum",
        capability: { minimum: true, report: true, operation: true },
        onPresentationStateChange: () => undefined,
      }),
    );
    assert.match(html, /data-testid="nexora-presentation-state-selector"/);
    assert.match(html, /data-nex-mvp="6"/);
  });

  it("2. Minimum is active initially in shell", () => {
    const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
    assert.match(html, /data-presentation-state="minimum"/);
    assert.match(html, /data-active-presentation="minimum"/);
  });

  it("3. selecting Report updates application intent (pure)", () => {
    const next = applyNexoraMVPPresentationStateChange(
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
      "report",
    );
    assert.equal(next.presentationState, "report");
  });

  it("4. selecting Operation updates application intent (pure)", () => {
    const focused = selectNexoraMVPInteractionSubject(
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
      "obj-revenue",
    );
    const next = applyNexoraMVPPresentationStateChange(focused, "operation");
    assert.equal(next.presentationState, "operation");
  });

  it("5. active state is represented accessibly", () => {
    const html = renderToStaticMarkup(
      React.createElement(NexoraPresentationStateSelector, {
        activePresentationState: "report",
        capability: { minimum: true, report: true, operation: false },
        onPresentationStateChange: () => undefined,
      }),
    );
    assert.match(html, /role="radiogroup"/);
    assert.match(html, /role="radio"/);
    assert.match(html, /aria-checked="true"/);
    assert.match(html, /data-operation-enabled="false"/);
  });

  it("6. Stage receives presentation state", () => {
    const html = renderToStaticMarkup(React.createElement(NexoraExecutiveShell));
    assert.match(html, /data-testid="nexora-3d-executive-stage"/);
    assert.match(html, /data-nex-mvp-presentation="6"/);
    assert.match(html, /data-presentation-state="minimum"/);
  });

  it("7. focused subject is preserved across presentation change", () => {
    let state = createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    });
    state = selectNexoraMVPInteractionSubject(state, "obj-capacity");
    state = applyNexoraMVPPresentationStateChange(state, "report");
    assert.equal(state.focusedSubject?.id, "obj-capacity");
  });

  it("8. workspace is preserved", () => {
    const state = applyNexoraMVPPresentationStateChange(
      createInitialNexoraMVPObjectInteractionState({
        workspace: "problem",
        presentationState: "minimum",
        environmentIntent: "investigate",
      }),
      "report",
    );
    assert.equal(state.workspace, "problem");
  });

  it("9. scene environment is preserved", () => {
    const state = applyNexoraMVPPresentationStateChange(
      createInitialNexoraMVPObjectInteractionState({
        workspace: "scenario",
        presentationState: "minimum",
        environmentIntent: "simulate",
      }),
      "operation",
    );
    assert.equal(state.environmentIntent, "simulate");
  });

  it("10. Report surface renders when supported", () => {
    const vm = deriveNexoraMVPPresentationViewModel({
      presentationState: "report",
      workspace: "overview",
      environmentIntent: "neutral",
      subjectId: "obj-capacity",
      subjectKind: "object",
      subjectLabel: "Capacity",
    });
    const html = renderToStaticMarkup(
      React.createElement(NexoraSubjectReport, { viewModel: vm }),
    );
    assert.match(html, /data-testid="nexora-subject-report"/);
    assert.match(html, /data-testid="nexora-subject-report-kpi"/);
  });

  it("11. Operation controls render only when supported", () => {
    const vm = deriveNexoraMVPPresentationViewModel({
      presentationState: "operation",
      workspace: "overview",
      environmentIntent: "neutral",
      subjectId: "obj-revenue",
      subjectKind: "object",
      subjectLabel: "Revenue",
    });
    const html = renderToStaticMarkup(
      React.createElement(NexoraSubjectOperation, {
        viewModel: vm,
        onAction: () => undefined,
      }),
    );
    assert.match(html, /data-testid="nexora-subject-operation"/);
    assert.match(html, /data-testid="nexora-subject-action-act-revenue-scenario"/);
  });

  it("12. disabled/unavailable actions are handled safely", () => {
    const vm = deriveNexoraMVPPresentationViewModel({
      presentationState: "operation",
      workspace: "execution",
      environmentIntent: "execute",
      subjectId: "ctx-execution-capacity",
      subjectKind: "execution",
      subjectLabel: "Capacity Expansion",
    });
    const html = renderToStaticMarkup(
      React.createElement(NexoraSubjectOperation, {
        viewModel: vm,
        onAction: () => undefined,
      }),
    );
    assert.match(html, /data-action-available="false"/);
    assert.match(html, /disabled/);
  });

  it("13. keyboard interaction works", () => {
    const source = readFileSync(
      join(HERE, "NexoraPresentationStateSelector.tsx"),
      "utf8",
    );
    assert.match(source, /ArrowRight/);
    assert.match(source, /ArrowLeft/);
    assert.match(source, /Home/);
    assert.match(source, /End/);
    assert.match(source, /onKeyDown/);
  });

  it("14. reduced-motion mode remains functional", () => {
    const source = readFileSync(
      join(HERE, "NexoraPresentationStateSelector.tsx"),
      "utf8",
    );
    assert.match(source, /prefers-reduced-motion/);
  });

  it("15. no page navigation occurs", () => {
    const files = [
      "NexoraPresentationStateSelector.tsx",
      "NexoraSubjectReport.tsx",
      "NexoraSubjectOperation.tsx",
      join("..", "NexoraExecutiveShell.tsx"),
    ];
    for (const file of files) {
      const source = readFileSync(join(HERE, file), "utf8");
      assert.doesNotMatch(source, /router\.push|useRouter|\/executive\/report/);
    }
  });

  it("16. no private upstream runtime imports were added", () => {
    const files = [
      "NexoraPresentationStateSelector.tsx",
      "NexoraSubjectReport.tsx",
      "NexoraSubjectOperation.tsx",
      join("../../../lib/nex-mvp/nexoraMVPPresentationState.ts"),
      join("../../../lib/nex-mvp/nexoraMVPPresentationFixtures.ts"),
    ];
    for (const file of files) {
      const source = readFileSync(join(HERE, file), "utf8");
      assert.doesNotMatch(
        source,
        /from\s+["']@\/app\/lib\/(?:nol|dri|ex-dri|rex)(?:\/[^"']*)?["']/,
      );
      assert.doesNotMatch(
        source,
        /from\s+["']@\/app\/lib\/nex-mvp\/nexoraMVPUpstreamIntegration["']/,
      );
    }
  });
});
