/**
 * NCA-POST:2 — optional live executive-chat proof.
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
  ".certification/nca-post-2-manager-assertions-pending-question-precedence-collection-query",
);
await mkdir(OUT, { recursive: true });

const report = {
  identity: "NCA-POST:2/ManagerAssertionsPendingQuestionPrecedenceCollectionQueryIntelligence",
  url: EXISTING,
  opened: false,
  pageErrors: [],
  turns: [],
  greetingSilent: false,
  noNavigationOnObservation: false,
  noAllProblemsLookup: false,
  tautologyAbsent: false,
  ok: false,
};

try {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  page.on("pageerror", (error) => errors.push(String(error)));
  const opened = await openExecutivePage(page, EXISTING);
  report.opened = Boolean(opened);
  async function ask(utterance) {
    const turn = await askExecutiveChat(page, utterance);
    report.turns.push({ utterance, last: turn.last, focused: turn.focused });
    return turn.last ?? "";
  }
  const hi = await ask("hi");
  const yes = await ask("yes");
  const observation = await ask("delivery is ok");
  const explain = await ask("explain it");
  const problems = await ask("show me all problems");
  await browser.close();
  report.pageErrors = errors;
  report.greetingSilent = !/Would you like to review/i.test(hi);
  report.noNavigationOnObservation = !/Focused on Delivery/i.test(observation);
  report.noAllProblemsLookup = !/All Problems/i.test(problems);
  report.tautologyAbsent = !/needs attention because it is worth monitoring/i.test(
    `${hi} ${yes} ${observation} ${explain} ${problems}`,
  );
  report.ok =
    errors.length === 0 &&
    report.opened &&
    report.greetingSilent &&
    report.noNavigationOnObservation &&
    report.noAllProblemsLookup &&
    report.tautologyAbsent;
} catch (error) {
  report.ok = false;
  report.pageErrors.push(String(error));
}

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(report, null, 2));
if (!report.ok) {
  console.error(report);
  process.exit(1);
}
console.log("NCA-POST:2 live ok");
