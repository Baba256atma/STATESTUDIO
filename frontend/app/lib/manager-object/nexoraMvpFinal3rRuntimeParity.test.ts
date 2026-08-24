/**
 * NEX-MVP-FINAL:3R — runtime identity and natural-reference closure.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import { expandControlledManagerLanguageKeys } from "../conversational-control/conversationalIntentNormalization.ts";
import {
  NEXORA_FINAL3_NATURAL_REFERENCE_IDENTITY,
  buildNexoraConversationalSubjectMatchIndex,
  findCanonicalSubjectMatchesForHint,
  freezeConversationalSubjectRecord,
} from "../conversational-control/conversationalSubjectRegistry.ts";
import { NEXORA_FINAL3_EXECUTIVE_EXPLAIN_IDENTITY } from "./managerObjectExplainEngine.ts";

const here = dirname(fileURLToPath(import.meta.url));
const repoFrontend = join(here, "../../..");

describe("NEX-MVP-FINAL:3R runtime parity invariants", () => {
  it("exposes FINAL:3 runtime identities for browser proof", () => {
    assert.equal(
      NEXORA_FINAL3_NATURAL_REFERENCE_IDENTITY,
      "NEX-MVP-FINAL:3/natural-reference-v1",
    );
    assert.equal(
      NEXORA_FINAL3_EXECUTIVE_EXPLAIN_IDENTITY,
      "NEX-MVP-FINAL:3/executive-explain-v1",
    );
    const shell = readFileSync(
      join(repoFrontend, "app/executive/nex-mvp/NexoraExecutiveShell.tsx"),
      "utf8",
    );
    assert.match(shell, /executeNexoraConversationalExperience/);
    assert.match(shell, /data-nexora-conversation-authority/);
    assert.match(shell, /data-nexora-final3-reference/);
    assert.match(shell, /data-nexora-final3-explain/);
    assert.match(shell, /NEXORA_FINAL3_NATURAL_REFERENCE_IDENTITY/);
    assert.match(shell, /NEXORA_FINAL3_EXECUTIVE_EXPLAIN_IDENTITY/);
  });

  it("er→ery is general and does not hard-code Delivery", () => {
    assert.deepEqual(expandControlledManagerLanguageKeys("deliver"), ["delivery"]);
    assert.deepEqual(expandControlledManagerLanguageKeys("recover"), ["recovery"]);
    assert.deepEqual(expandControlledManagerLanguageKeys("risk"), []);
    const index = buildNexoraConversationalSubjectMatchIndex([
      freezeConversationalSubjectRecord({
        subjectId: "obj-delivery",
        subjectKind: "object",
        canonicalName: "Delivery",
        aliases: Object.freeze(["Delivery"]),
        businessKey: "obj-delivery",
      }),
    ]);
    assert.equal(
      findCanonicalSubjectMatchesForHint("deliver object", index)[0]?.subjectId,
      "obj-delivery",
    );
    const morphSource = readFileSync(
      join(here, "../conversational-control/conversationalIntentNormalization.ts"),
      "utf8",
    );
    assert.doesNotMatch(morphSource, /obj-delivery/);
    assert.doesNotMatch(morphSource, /if \(key === ["']deliver["']\)/);
  });

  it("browser cert harness cannot pass on couldn't-find Risk Object", () => {
    const final3 = readFileSync(
      join(repoFrontend, "scripts/nex-mvp-final3-natural-reference-explain-certify.mjs"),
      "utf8",
    );
    const final3r = readFileSync(
      join(repoFrontend, "scripts/nex-mvp-final3r-runtime-parity-certify.mjs"),
      "utf8",
    );
    const harness = readFileSync(
      join(repoFrontend, "scripts/nex-mvp-final3-executive-chat-harness.mjs"),
      "utf8",
    );
    assert.match(harness, /entrance=1/);
    assert.match(harness, /reset=1/);
    assert.match(harness, /data-nexora-final3-reference/);
    assert.match(harness, /assertCanonicalFocus/);
    assert.doesNotMatch(
      harness,
      /focused === "obj-risk" \|\| \/Focused on Risk\|Risk\/i/,
    );
    assert.match(final3, /openExecutiveChat/);
    assert.match(final3r, /show me deliver object/);
    assert.match(final3r, /show me delivery object/);
  });
});
