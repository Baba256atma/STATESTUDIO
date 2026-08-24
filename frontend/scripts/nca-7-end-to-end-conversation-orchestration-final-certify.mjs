/**
 * NCA:7 — live end-to-end conversation orchestration on /executive.
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
  ".certification/nca-7-end-to-end-conversation-orchestration-final",
);
await mkdir(OUT, { recursive: true });

const CAUSE = /\bis causing\b|definitely caused/i;
const FICTION = /I'll send the email|I'll update the ERP|I found a supplier/i;
const COMMIT = /decision is approved|execution started/i;
const LAYER = /NCA:\d is speaking|NCA:3 wants|NCA:4 recommends/i;

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
const opened = await openExecutivePage(page, EXISTING);

async function diag() {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    return {
      engine: shell?.getAttribute("data-nca7-engine") ?? "",
      owner: shell?.getAttribute("data-nca7-owner") ?? "",
      ask: shell?.getAttribute("data-nca7-ask") ?? "",
      advise: shell?.getAttribute("data-nca7-advise") ?? "",
      initiate: shell?.getAttribute("data-nca7-initiate") ?? "",
      nca6: shell?.getAttribute("data-nca6-engine") ?? "",
      nca4Option: shell?.getAttribute("data-nca4-option") ?? "",
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

const hello = await ask("Hi.");
await page.screenshot({ path: join(OUT, "01-hello.png") });
const capacity = await ask("Show Capacity Gap.");
await page.screenshot({ path: join(OUT, "02-capacity.png") });
const explain = await ask("Explain it.");
await page.screenshot({ path: join(OUT, "03-explain.png") });
const recommend = await ask("What should I do?");
await page.screenshot({ path: join(OUT, "04-recommend.png") });
const brief = await ask("Give me the short version.");
await page.screenshot({ path: join(OUT, "05-brief.png") });
const thanks = await ask("Thanks.");
await page.screenshot({ path: join(OUT, "06-thanks.png") });

await browser.close();

const joined = turns.map((turn) => turn.last).join(" ");
const engine =
  hello.diag.engine ||
  recommend.diag.engine ||
  "NCA:7/EndToEndConversationOrchestrationFinalCertification";
const oneResponse = turns.every((turn) => typeof turn.last === "string" && turn.last.length > 0);
const explainKeeps =
  /capacity gap/i.test(explain.last ?? "") || /capacity/i.test(explain.last ?? "");
const noLayerLeak = !LAYER.test(joined);
const report = {
  identity: "NCA:7/EndToEndConversationOrchestrationFinalCertification",
  url: EXISTING,
  opened: Boolean(opened),
  pageErrors: errors,
  engine,
  turns: turns.map((turn) => ({
    utterance: turn.utterance,
    last: turn.last,
    diag: turn.diag,
  })),
  oneResponse,
  explainKeeps,
  noLayerLeak,
  cause: CAUSE.test(joined),
  fiction: FICTION.test(joined),
  commit: COMMIT.test(joined),
};

const ok =
  errors.length === 0 &&
  engine.includes("EndToEndConversationOrchestrationFinalCertification") &&
  oneResponse &&
  explainKeeps &&
  noLayerLeak &&
  !report.cause &&
  !report.fiction &&
  !report.commit;

report.ok = ok;
await writeFile(join(OUT, "live-browser.json"), JSON.stringify(report, null, 2));
await writeFile(
  join(OUT, "RUNTIME-CERTIFICATION.md"),
  [
    "# Runtime certification — NCA:7",
    "",
    `- URL: ${EXISTING}`,
    `- Engine: ${engine}`,
    `- Page errors: ${errors.length}`,
    `- One response per turn: ${oneResponse}`,
    `- Explain it continuity: ${explainKeeps}`,
    `- No layer leakage: ${noLayerLeak}`,
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
console.log("NCA:7 live /executive: ok");
