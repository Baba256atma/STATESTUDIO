/**
 * NCA:3 — live clarification / information-gap / executive question intelligence on /executive.
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
  ".certification/nca-3-clarification-information-gap-executive-question",
);
await mkdir(OUT, { recursive: true });

const CAUSE = /\bis causing\b|definitely caused/i;
const FICTION = /I'll send the email|I'll update the ERP|I found a supplier/i;
const COMMIT = /decision is approved/i;

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
const opened = await openExecutivePage(page, EXISTING);

async function diag() {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    return {
      engine: shell?.getAttribute("data-nca3-engine") ?? "",
      mode: shell?.getAttribute("data-nca3-mode") ?? "",
      ask: shell?.getAttribute("data-nca3-ask") ?? "",
      sufficiency: shell?.getAttribute("data-nca3-sufficiency") ?? "",
      gap: shell?.getAttribute("data-nca3-gap") ?? "",
      pending: shell?.getAttribute("data-nca2-pending") ?? "",
      need: shell?.getAttribute("data-nca-need") ?? "",
    };
  });
}

const turns = [];
async function ask(utterance) {
  const turn = await askExecutiveChat(page, utterance);
  const snapshot = await diag();
  const row = { utterance, last: turn.last, focused: turn.focused, diag: snapshot };
  turns.push(row);
  return row;
}

const delivery = await ask("What does Delivery show?");
await page.screenshot({ path: join(OUT, "01-no-question-delivery.png") });
const capacity = await ask("Should we permanently increase capacity?");
await page.screenshot({ path: join(OUT, "02-ask-persistence.png") });
const seasonal = await ask("No, it's seasonal and should normalize in about three months.");
await page.screenshot({ path: join(OUT, "03-recompute-temporary.png") });

await browser.close();

const joined = turns.map((turn) => turn.last).join(" ");
const noAsk =
  ((delivery.last ?? "").match(/\?/g) ?? []).length === 0 &&
  delivery.diag.ask !== "true";
const askedOne =
  ((capacity.last ?? "").match(/\?/g) ?? []).length === 1 &&
  /continue|demand|months/i.test(capacity.last ?? "");
const recomputed =
  /temporary|harder to justify/i.test(seasonal.last ?? "") &&
  ((seasonal.last ?? "").match(/\?/g) ?? []).length === 0;

const report = {
  identity: "NCA:3/ClarificationInformationGapExecutiveQuestionIntelligence",
  url: EXISTING,
  opened: Boolean(opened),
  pageErrors: errors,
  engine: capacity.diag.engine,
  turns: turns.map((turn) => ({
    utterance: turn.utterance,
    last: turn.last,
    diag: turn.diag,
  })),
  noAsk,
  askedOne,
  recomputed,
  cause: CAUSE.test(joined),
  fiction: FICTION.test(joined),
  commit: COMMIT.test(joined),
};

const ok =
  errors.length === 0 &&
  report.engine.includes("ClarificationInformationGapExecutiveQuestionIntelligence") &&
  noAsk &&
  askedOne &&
  recomputed &&
  !report.cause &&
  !report.fiction &&
  !report.commit;

report.ok = ok;
await writeFile(join(OUT, "live-browser.json"), JSON.stringify(report, null, 2));
await writeFile(
  join(OUT, "RUNTIME-CERTIFICATION.md"),
  [
    "# Runtime certification — NCA:3",
    "",
    `- URL: ${EXISTING}`,
    `- Engine: ${report.engine}`,
    `- Page errors: ${errors.length}`,
    `- Delivery status asks nothing: ${noAsk}`,
    `- Permanent capacity asks one persistence question: ${askedOne}`,
    `- Seasonal answer recomputes without the next questionnaire item: ${recomputed}`,
    `- Unsupported causality: ${report.cause}`,
    `- Product fiction: ${report.fiction}`,
    `- Accidental approval: ${report.commit}`,
    `- Verdict: ${ok ? "PASS" : "FAIL"}`,
    "",
  ].join("\n"),
);

if (!ok) {
  console.error(report);
  process.exit(1);
}
console.log("NCA:3 live /executive: ok");
