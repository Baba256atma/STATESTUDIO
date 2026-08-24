/**
 * NCA:2 — live conversational context / topic / dialogue state on /executive.
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
  ".certification/nca-2-conversational-context-dialogue-state",
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
      engine: shell?.getAttribute("data-nca2-engine") ?? "",
      move: shell?.getAttribute("data-nca2-move") ?? "",
      topic: shell?.getAttribute("data-nca2-topic") ?? "",
      subject: shell?.getAttribute("data-nca2-subject") ?? "",
      pending: shell?.getAttribute("data-nca2-pending") ?? "",
      thread: shell?.getAttribute("data-nca2-thread") ?? "",
      need: shell?.getAttribute("data-nca-need") ?? "",
      nluOp: shell?.getAttribute("data-nlu-operation") ?? "",
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

await ask("Why is delivery below target?");
await page.screenshot({ path: join(OUT, "01-why-delivery.png") });
const yes = await ask("Yes, about 20%.");
await page.screenshot({ path: join(OUT, "02-short-answer.png") });
const inventory = await ask("What about inventory?");
await page.screenshot({ path: join(OUT, "03-topic-shift.png") });
const back = await ask("Go back to capacity.");
await page.screenshot({ path: join(OUT, "04-return.png") });

await browser.close();

const joined = turns.map((turn) => turn.last).join(" ");
const shortAnswered =
  yes.diag.move === "ANSWER_NEXORA" || /20%|demand pressure|capacity/i.test(yes.last ?? "");
const shift =
  /inventory/i.test(inventory.diag.subject) || /inventory/i.test(inventory.last ?? "");
const restored =
  back.diag.move === "RETURN_TO_TOPIC" &&
  /Returning to/i.test(back.last ?? "") &&
  /capacity|delivery/i.test(`${back.diag.subject} ${back.last}`);

const report = {
  identity: "NCA:2/ConversationalContextTopicDialogueStateIntelligence",
  url: EXISTING,
  opened: Boolean(opened),
  pageErrors: errors,
  engine: yes.diag.engine,
  turns: turns.map((turn) => ({
    utterance: turn.utterance,
    last: turn.last,
    diag: turn.diag,
  })),
  shortAnswered,
  shift,
  restored,
  cause: CAUSE.test(joined),
  fiction: FICTION.test(joined),
  commit: COMMIT.test(joined),
};

const ok =
  errors.length === 0 &&
  report.engine.includes("ConversationalContextTopicDialogueStateIntelligence") &&
  shortAnswered &&
  shift &&
  restored &&
  !report.cause &&
  !report.fiction &&
  !report.commit;

report.ok = ok;
await writeFile(join(OUT, "live-browser.json"), JSON.stringify(report, null, 2));
await writeFile(
  join(OUT, "RUNTIME-CERTIFICATION.md"),
  [
    "# Runtime certification — NCA:2",
    "",
    `- URL: ${EXISTING}`,
    `- Engine: ${report.engine}`,
    `- Page errors: ${errors.length}`,
    `- Short answer interpreted: ${shortAnswered}`,
    `- Topic shift: ${shift}`,
    `- Return restores thread: ${restored}`,
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
console.log("NCA:2 live /executive: ok");
