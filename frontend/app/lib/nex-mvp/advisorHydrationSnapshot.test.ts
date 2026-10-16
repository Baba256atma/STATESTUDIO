/**
 * HOSTED-MVP:2-FIX1 — Advisor fixture ranking uses the shell hydration snapshot.
 *
 * This does not replace a browser hydration check. It locks the projection
 * that made SSR and the first client render disagree.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import type { NexoraProfessionalAdvisorNarrative } from "./nexoraMVPProfessionalAdvisorPresentation.ts";
import { projectNexoraLiveExecutivePriorityIntelligence } from "./nexoraLiveEpistemicProjection.ts";

const overview = Object.freeze({
  isOverview: true,
  currentSubjectId: null,
  currentSubjectKind: null,
  attentionSubjectId: "obj-risk",
}) as NexoraProfessionalAdvisorNarrative;

test("fixture priority follows the explicit hydration snapshot", () => {
  const blocked = projectNexoraLiveExecutivePriorityIntelligence({
    narrative: overview,
    presentationMode: "overview",
    productFixturesPermitted: false,
  });
  const permitted = projectNexoraLiveExecutivePriorityIntelligence({
    narrative: overview,
    presentationMode: "overview",
    productFixturesPermitted: true,
  });
  assert.equal(blocked.topPriority, null);
  assert.ok(permitted.topPriority);
  assert.equal(permitted.topPriority.subjectId.length > 0, true);
});

test("advisor region passes the shell fixture snapshot into experience composition", () => {
  const source = readFileSync(
    new URL("../../executive/nex-mvp/NexoraAdvisorInsightRegion.tsx", import.meta.url),
    "utf8",
  );
  assert.match(source, /productFixturesPermitted,/);
  assert.doesNotMatch(source, /suppressHydrationWarning/);
});
