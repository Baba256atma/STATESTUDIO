/**
 * NCA:5 — live proactive executive advisor / conversational initiative on /executive.
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
  ".certification/nca-5-proactive-executive-advisor-conversational-initiative",
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
      engine: shell?.getAttribute("data-nca5-engine") ?? "",
      initiate: shell?.getAttribute("data-nca5-initiate") ?? "",
      behavior: shell?.getAttribute("data-nca5-behavior") ?? "",
      priority: shell?.getAttribute("data-nca5-priority") ?? "",
      interrupt: shell?.getAttribute("data-nca5-interrupt") ?? "",
      subject: shell?.getAttribute("data-nca5-subject") ?? "",
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

const seen = await ask("Delivery is 93, below the 96 target.");
await page.screenshot({ path: join(OUT, "01-known.png") });
const material = await ask("Delivery dropped from 93 to 89.");
await page.screenshot({ path: join(OUT, "02-material.png") });
const silent = await ask("Delivery moved from 89.1 to 89.0.");
await page.screenshot({ path: join(OUT, "03-silent.png") });
await ask("What should I do?");
const revised = await ask(
  "We just signed an 18-month customer contract that keeps this demand level.",
);
await page.screenshot({ path: join(OUT, "04-revision.png") });
const protectedTurn = await ask("Confirm the decision. Inventory moved from 40 to 41.");
await page.screenshot({ path: join(OUT, "05-protect.png") });

await browser.close();

const joined = turns.map((turn) => turn.last).join(" ");
const materialChange =
  /before we continue|one change is important|moved from 93 to 89|\b89\b/i.test(
    material.last ?? "",
  ) || material.diag.initiate === "true";
const notRepeat = !/Delivery is 93[\s\S]*Delivery is 93/.test(`${seen.last}${material.last}`);
const silence =
  silent.diag.initiate === "false" ||
  silent.diag.behavior === "SILENT" ||
  !/Before we continue/i.test(silent.last ?? "");
const recommendationChange = /revise|now recommend|permanent/i.test(revised.last ?? "");
const noInterrupt =
  protectedTurn.diag.interrupt !== "true" &&
  !/Before we continue, Inventory/i.test(protectedTurn.last ?? "");

const report = {
  identity: "NCA:5/ProactiveExecutiveAdvisorConversationalInitiativeIntelligence",
  url: EXISTING,
  opened: Boolean(opened),
  pageErrors: errors,
  engine: material.diag.engine || seen.diag.engine,
  turns: turns.map((turn) => ({
    utterance: turn.utterance,
    last: turn.last,
    diag: turn.diag,
  })),
  materialChange,
  notRepeat,
  silence,
  recommendationChange,
  noInterrupt,
  cause: CAUSE.test(joined),
  fiction: FICTION.test(joined),
  commit: COMMIT.test(joined),
};

const ok =
  errors.length === 0 &&
  report.engine.includes("ProactiveExecutiveAdvisorConversationalInitiativeIntelligence") &&
  materialChange &&
  silence &&
  recommendationChange &&
  noInterrupt &&
  !report.cause &&
  !report.fiction &&
  !report.commit;

report.ok = ok;
await writeFile(join(OUT, "live-browser.json"), JSON.stringify(report, null, 2));
await writeFile(
  join(OUT, "RUNTIME-CERTIFICATION.md"),
  [
    "# Runtime certification — NCA:5",
    "",
    `- URL: ${EXISTING}`,
    `- Engine: ${report.engine}`,
    `- Page errors: ${errors.length}`,
    `- Material change surfaced: ${materialChange}`,
    `- Silence on minor movement: ${silence}`,
    `- Recommendation revision surfaced: ${recommendationChange}`,
    `- Decision confirmation not hijacked: ${noInterrupt}`,
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
console.log("NCA:5 live /executive: ok");
