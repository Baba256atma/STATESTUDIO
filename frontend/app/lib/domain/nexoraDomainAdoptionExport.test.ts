/**
 * B.43 — Domain adoption export bundle + handoff text.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  buildDomainAdoptionExportBundle,
  formatDomainAdoptionReviewForHandoff,
  serializeDomainAdoptionExportBundle,
  type NexoraDomainAdoptionExportBundle,
} from "./nexoraDomainAdoptionExport.ts";
import type { NexoraDomainAdoptionReview } from "./nexoraDomainAdoptionReview.ts";

test("export bundle contains reviews array", () => {
  const b = buildDomainAdoptionExportBundle();
  assert.ok(Array.isArray(b.reviews));
  assert.ok(typeof b.exportedAt === "number" && Number.isFinite(b.exportedAt));
  assert.ok(b.reviews.length >= 1);
});

test("serialization is deterministic for same logical bundle", () => {
  const reviews: NexoraDomainAdoptionReview[] = [
    {
      domainId: "zeta",
      status: "healthy",
      summary: "Z",
      issues: [],
      recommendations: ["No immediate action"],
    },
    {
      domainId: "alpha",
      status: "underused",
      summary: "A",
      issues: ["Low usage"],
      recommendations: ["Increase domain visibility"],
    },
  ];
  const a: NexoraDomainAdoptionExportBundle = { exportedAt: 42, reviews };
  const b: NexoraDomainAdoptionExportBundle = { exportedAt: 42, reviews: [...reviews].reverse() };
  assert.equal(serializeDomainAdoptionExportBundle(a), serializeDomainAdoptionExportBundle(b));
});

test("handoff formatter includes status, issue, and next line", () => {
  const reviews: NexoraDomainAdoptionReview[] = [
    {
      domainId: "retail",
      status: "underused",
      summary: "x",
      issues: ["Low usage"],
      recommendations: ["Increase domain visibility"],
    },
  ];
  const text = formatDomainAdoptionReviewForHandoff(reviews);
  assert.ok(text.includes("Domain Review Summary"));
  assert.ok(text.includes("- retail — underused"));
  assert.ok(text.includes("issue: Low usage"));
  assert.ok(text.includes("next: Increase domain visibility"));
});

test("empty reviews handled safely", () => {
  const text = formatDomainAdoptionReviewForHandoff([]);
  assert.ok(text.includes("no domains reviewed"));
  const json = serializeDomainAdoptionExportBundle({ exportedAt: 1, reviews: [] });
  const parsed = JSON.parse(json) as NexoraDomainAdoptionExportBundle;
  assert.deepEqual(parsed.reviews, []);
});

test("handoff output order stable by domainId", () => {
  const reviews: NexoraDomainAdoptionReview[] = [
    { domainId: "m", status: "healthy", summary: "", issues: [], recommendations: ["No immediate action"] },
    { domainId: "a", status: "healthy", summary: "", issues: [], recommendations: ["No immediate action"] },
    { domainId: "z", status: "healthy", summary: "", issues: [], recommendations: ["No immediate action"] },
  ];
  const text = formatDomainAdoptionReviewForHandoff(reviews);
  const aPos = text.indexOf("- a —");
  const mPos = text.indexOf("- m —");
  const zPos = text.indexOf("- z —");
  assert.ok(aPos >= 0 && mPos >= 0 && zPos >= 0);
  assert.ok(aPos < mPos && mPos < zPos);
});
