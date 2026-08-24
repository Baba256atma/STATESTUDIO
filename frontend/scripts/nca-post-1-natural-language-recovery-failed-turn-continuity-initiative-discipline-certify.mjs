/**
 * NCA-POST:1 — optional live executive-chat proof.
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
  ".certification/nca-post-1-natural-language-recovery-failed-turn-continuity-initiative-discipline",
);
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
const opened = await openExecutivePage(page, EXISTING);
const turns = [];
async function ask(utterance) {
  const turn = await askExecutiveChat(page, utterance);
  turns.push({ utterance, last: turn.last });
  return turn.last ?? "";
}

const path = [
  await ask("show Delivery"),
  await ask("explain it"),
  await ask("what if deilvery be too late"),
  await ask("why?"),
  await ask("show the Delivery"),
  await ask("what if delivery be too late?"),
];
const technical = await ask("What is NCA:5?");
await browser.close();

const leak = /journey process blocker|canonical relationship|goal linkage|\bruntime\b|\bresolver\b|NCA:|MO:|EI:|\bWATCH\b/i;
const ordinaryLeak = path.some((text) => leak.test(text));
const recovered = /delivery/i.test(path[2] ?? "");
const report = {
  identity: "NCA-POST:1/NaturalLanguageRecoveryFailedTurnContinuityInitiativeDiscipline",
  url: EXISTING,
  opened: Boolean(opened),
  pageErrors: errors,
  turns,
  recovered,
  ordinaryLeak,
  technicalPermitted: /NCA:5|initiative|architecture/i.test(technical),
  ok:
    errors.length === 0 &&
    recovered &&
    !ordinaryLeak &&
    /NCA:5|initiative|architecture/i.test(technical),
};
await writeFile(join(OUT, "live-browser.json"), JSON.stringify(report, null, 2));
if (!report.ok) {
  console.error(report);
  process.exit(1);
}
console.log("NCA-POST:1 live ok");
