/**
 * NCA:4 — live executive advisory reasoning / recommendation dialogue on /executive.
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
  ".certification/nca-4-executive-advisory-reasoning-recommendation-dialogue",
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
      engine: shell?.getAttribute("data-nca4-engine") ?? "",
      move: shell?.getAttribute("data-nca4-move") ?? "",
      status: shell?.getAttribute("data-nca4-status") ?? "",
      option: shell?.getAttribute("data-nca4-option") ?? "",
      strength: shell?.getAttribute("data-nca4-strength") ?? "",
      confidence: shell?.getAttribute("data-nca4-confidence") ?? "",
      advise: shell?.getAttribute("data-nca4-advise") ?? "",
      nca3Ask: shell?.getAttribute("data-nca3-ask") ?? "",
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
const why = await ask("Why that one?");
await page.screenshot({ path: join(OUT, "02-why.png") });
const downside = await ask("What's the downside?");
const sure = await ask("How sure are you?");
const change = await ask("What would change your recommendation?");
await page.screenshot({ path: join(OUT, "03-sensitivity.png") });

const contract = await ask(
  "We just signed an 18-month customer contract that keeps this demand level.",
);
await page.screenshot({ path: join(OUT, "04-revision.png") });

const disagree = await ask("I disagree. I still want temporary capacity.");
await page.screenshot({ path: join(OUT, "05-disagree.png") });

await browser.close();

const option = recommend.diag.option || "";
const samePosition =
  Boolean(option) &&
  why.diag.option === option &&
  downside.diag.option === option &&
  sure.diag.option === option &&
  change.diag.option === option;
const recommended =
  /recommend|lean toward/i.test(recommend.last ?? "") &&
  /temporary capacity/i.test(recommend.last ?? "");
const explained = /goal|reversib|uncertain/i.test(why.last ?? "");
const tradeoff = /cost|downside/i.test(downside.last ?? "");
const calibrated = /moderate/i.test(sure.last ?? "");
const sensitive = /demand|labor|cheaper/i.test(change.last ?? "");
const revised =
  /changes my recommendation|now recommend/i.test(contract.last ?? "") &&
  /permanent/i.test(contract.last ?? "");
const disagreementKeepsRevision =
  disagree.diag.option === contract.diag.option &&
  /understood|main risk/i.test(disagree.last ?? "");
const openDisagreement = disagreementKeepsRevision;
const joined = turns.map((turn) => turn.last).join(" ");

const report = {
  identity: "NCA:4/ExecutiveAdvisoryReasoningRecommendationDialogueIntelligence",
  url: EXISTING,
  opened: Boolean(opened),
  pageErrors: errors,
  engine: recommend.diag.engine,
  turns: turns.map((turn) => ({
    utterance: turn.utterance,
    last: turn.last,
    diag: turn.diag,
  })),
  recommended,
  samePosition,
  explained,
  tradeoff,
  calibrated,
  sensitive,
  revised,
  openDisagreement,
  cause: CAUSE.test(joined),
  fiction: FICTION.test(joined),
  commit: COMMIT.test(joined),
};

const ok =
  errors.length === 0 &&
  report.engine.includes("ExecutiveAdvisoryReasoningRecommendationDialogueIntelligence") &&
  recommended &&
  samePosition &&
  explained &&
  tradeoff &&
  calibrated &&
  sensitive &&
  revised &&
  openDisagreement &&
  !report.cause &&
  !report.fiction &&
  !report.commit;

report.ok = ok;
await writeFile(join(OUT, "live-browser.json"), JSON.stringify(report, null, 2));
await writeFile(
  join(OUT, "RUNTIME-CERTIFICATION.md"),
  [
    "# Runtime certification — NCA:4",
    "",
    `- URL: ${EXISTING}`,
    `- Engine: ${report.engine}`,
    `- Page errors: ${errors.length}`,
    `- Recommendation emitted: ${recommended}`,
    `- Same advisory position through why/downside/confidence/sensitivity: ${samePosition}`,
    `- Why explained: ${explained}`,
    `- Downside explicit: ${tradeoff}`,
    `- Confidence calibrated: ${calibrated}`,
    `- Sensitivity explicit: ${sensitive}`,
    `- Revision after 18-month contract: ${revised}`,
    `- Disagreement remains open without commitment: ${openDisagreement}`,
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
console.log("NCA:4 live /executive: ok");
