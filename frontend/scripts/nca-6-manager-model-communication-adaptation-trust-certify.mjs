/**
 * NCA:6 — live manager-model / communication-adaptation / trust on /executive.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import {
  EXECUTIVE_EXISTING_URL,
  askExecutiveChat,
  openExecutivePage,
} from "./nex-mvp-final3-executive-chat-harness.mjs";

const BASE = process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL;
const EXISTING = BASE.split("?")[0];
const OUT = join(
  process.cwd(),
  ".certification/nca-6-manager-model-communication-adaptation-trust",
);
await mkdir(OUT, { recursive: true });

const CAUSE = /\bis causing\b|definitely caused/i;
const FICTION = /I'll send the email|I'll update the ERP|I found a supplier/i;
const COMMIT = /decision is approved|execution started/i;

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
const opened = await openExecutivePage(page, EXISTING);

async function diag() {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    return {
      engine: shell?.getAttribute("data-nca6-engine") ?? "",
      depth: shell?.getAttribute("data-nca6-depth") ?? "",
      framing: shell?.getAttribute("data-nca6-framing") ?? "",
      structure: shell?.getAttribute("data-nca6-structure") ?? "",
      familiarity: shell?.getAttribute("data-nca6-familiarity") ?? "",
      role: shell?.getAttribute("data-nca6-role") ?? "",
      nca4Option: shell?.getAttribute("data-nca4-option") ?? "",
      nca4Confidence: shell?.getAttribute("data-nca4-confidence") ?? "",
      nca4Advise: shell?.getAttribute("data-nca4-advise") ?? "",
    };
  });
}

const turns = [];
async function ask(utterance) {
  const turn = await askExecutiveChat(page, utterance);
  const snapshot = await diag();
  const row = { utterance, last: turn.last, diag: snapshot };
  turns.push(row);
  return row;
}

const recommend = await ask("What should I do?");
await page.screenshot({ path: join(OUT, "01-recommend.png") });
const brief = await ask("Give me the short version.");
await page.screenshot({ path: join(OUT, "02-brief.png") });
const detailed = await ask("Walk me through the reasoning.");
await page.screenshot({ path: join(OUT, "03-detailed.png") });
const confused = await ask("I don't understand what Capacity Gap means.");
await page.screenshot({ path: join(OUT, "04-confusion.png") });
const technical = await ask("Explain it more technically.");
await page.screenshot({ path: join(OUT, "05-technical.png") });
const disagree = await ask("I disagree. Permanent expansion is better.");
await page.screenshot({ path: join(OUT, "06-disagreement.png") });
const revised = await ask(
  "We just signed an 18-month customer contract that keeps this demand level.",
);
await page.screenshot({ path: join(OUT, "07-revision.png") });

await browser.close();

const option = recommend.diag.nca4Option || "temporary capacity";
const confidence = recommend.diag.nca4Confidence;
const depthChanges =
  brief.diag.depth === "BRIEF" &&
  (detailed.diag.depth === "DETAILED" || detailed.diag.depth === "STANDARD");
const recStable =
  (brief.last ?? "").toLowerCase().includes(option.toLowerCase().slice(0, 12)) &&
  (detailed.last ?? "").toLowerCase().includes(option.toLowerCase().slice(0, 12));
const confidenceStable =
  !confidence ||
  (brief.diag.nca4Confidence === confidence && detailed.diag.nca4Confidence === confidence);
const uncertaintyVisible =
  /uncertain|moderately|not (?:yet )?(?:confirmed|enough evidence)/i.test(
    `${brief.last} ${detailed.last}`,
  );
const confusionSimplified = /capacity you need|needed and available|constraint to investigate/i.test(
  confused.last ?? "",
);
const technicalSameObject = /capacity gap|required and available capacity/i.test(
  technical.last ?? "",
);
const disagreementHeld =
  /temporary capacity|still remains|recommendation still/i.test(disagree.last ?? "") &&
  !/you're wrong/i.test(disagree.last ?? "");
const revisionExplained = /earlier|changes|now|permanent/i.test(revised.last ?? "");
const joined = turns.map((turn) => turn.last).join(" ");

const report = {
  identity: "NCA:6/ManagerModelCommunicationAdaptationTrustIntelligence",
  url: EXISTING,
  opened: Boolean(opened),
  pageErrors: errors,
  engine: brief.diag.engine || recommend.diag.engine,
  turns: turns.map((turn) => ({
    utterance: turn.utterance,
    last: turn.last,
    diag: turn.diag,
  })),
  depthChanges,
  recStable,
  confidenceStable,
  uncertaintyVisible,
  confusionSimplified,
  technicalSameObject,
  disagreementHeld,
  revisionExplained,
  cause: CAUSE.test(joined),
  fiction: FICTION.test(joined),
  commit: COMMIT.test(joined),
};

const ok =
  errors.length === 0 &&
  report.engine.includes("ManagerModelCommunicationAdaptationTrustIntelligence") &&
  depthChanges &&
  recStable &&
  confidenceStable &&
  uncertaintyVisible &&
  confusionSimplified &&
  technicalSameObject &&
  disagreementHeld &&
  revisionExplained &&
  !report.cause &&
  !report.fiction &&
  !report.commit;

report.ok = ok;
await writeFile(join(OUT, "live-browser.json"), JSON.stringify(report, null, 2));
await writeFile(
  join(OUT, "RUNTIME-CERTIFICATION.md"),
  [
    "# Runtime certification — NCA:6",
    "",
    `- URL: ${EXISTING}`,
    `- Engine: ${report.engine}`,
    `- Page errors: ${errors.length}`,
    `- Depth adaptation: ${depthChanges}`,
    `- Recommendation stable across depth: ${recStable}`,
    `- Confidence stable: ${confidenceStable}`,
    `- Uncertainty visible: ${uncertaintyVisible}`,
    `- Confusion simplified: ${confusionSimplified}`,
    `- Technical same object: ${technicalSameObject}`,
    `- Disagreement held: ${disagreementHeld}`,
    `- Revision explained: ${revisionExplained}`,
    `- Unsupported causality: ${report.cause}`,
    `- Product fiction: ${report.fiction}`,
    `- Accidental approval/execution: ${report.commit}`,
    `- Verdict: ${ok ? "PASS" : "FAIL"}`,
    "",
  ].join("\n"),
);

if (!ok) {
  console.error(report);
  process.exit(1);
}
console.log("NCA:6 live /executive: ok");
