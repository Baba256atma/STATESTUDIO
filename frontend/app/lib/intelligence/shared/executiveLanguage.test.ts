import assert from "node:assert/strict";
import test from "node:test";
import {
  avoidFalseCertainty,
  cleanExecutiveText,
  conciseExecutiveSentence,
  stableExecutiveHeadline,
} from "./executiveLanguage.ts";

test("shared executive language utilities keep wording calm and stable", () => {
  assert.equal(cleanExecutiveText("  Risk   high!!! "), "Risk high.");
  assert.equal(conciseExecutiveSentence("First sentence. Second sentence.", "Fallback"), "First sentence.");
  assert.equal(stableExecutiveHeadline({ preferred: "Operational pressure is elevated.", fallback: "Fallback" }), "Operational pressure is elevated");
  assert.match(avoidFalseCertainty("This will definitely improve and is guaranteed."), /expected|supported/);
});
