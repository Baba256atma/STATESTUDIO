/**
 * NCA:1 — live Manager Conversation Architecture on /executive.
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
  ".certification/nca-1-manager-conversation-architecture",
);
await mkdir(OUT, { recursive: true });

const LEAK =
  /CORE-INT|CC:9|EI:4|\bMO:|FINAL:6\.|READY_FOR_|canonical intent|namespace|resolver|JOURNEY BLOCKER|GOAL RELEVANCE/i;
const WATCH = /\bis Watch\b/;
const CAUSE = /\bis causing\b|definitely caused/i;
const FICTION = /I'll send the email|I'll update the ERP|I found a supplier/i;

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
const opened = await openExecutivePage(page, EXISTING);

async function diag() {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    return {
      engine: shell?.getAttribute("data-nca1-engine") ?? "",
      need: shell?.getAttribute("data-nca-need") ?? "",
      behavior: shell?.getAttribute("data-nca-behavior") ?? "",
      sufficient: shell?.getAttribute("data-nca-sufficient") ?? "",
      capability: shell?.getAttribute("data-nca-capability") ?? "",
      nluOp: shell?.getAttribute("data-nlu-operation") ?? "",
      nluSubject: shell?.getAttribute("data-nlu-subject") ?? "",
      continuity: shell?.getAttribute("data-continuity-subject") ?? "",
      focused: shell?.getAttribute("data-nexora-focused-subject") ?? "",
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

await ask("Hi.");
const knowledge = await ask("What Capacity Gap?");
await page.screenshot({ path: join(OUT, "01-what-capacity-gap.png") });
const follow = await ask("Explain it.");
await page.screenshot({ path: join(OUT, "02-explain-it.png") });

const navPage = await browser.newPage({ viewport: { width: 1502, height: 942 } });
navPage.on("pageerror", (error) => errors.push(String(error)));
await openExecutivePage(navPage, EXISTING);
const show = await askExecutiveChat(navPage, "Show Delivery.");
const showDiag = await navPage.evaluate(() => {
  const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
  return {
    need: shell?.getAttribute("data-nca-need") ?? "",
    behavior: shell?.getAttribute("data-nca-behavior") ?? "",
    nluOp: shell?.getAttribute("data-nlu-operation") ?? "",
  };
});
await navPage.screenshot({ path: join(OUT, "03-show-delivery.png") });
const why = await askExecutiveChat(navPage, "Why?");
await navPage.close();

const teach = await ask("How do I use Nexora?");
const thanks = await ask("Thanks.");
const askCap = await ask("Should we increase capacity?");
await page.screenshot({ path: join(OUT, "04-ask-capacity.png") });

await browser.close();

const joined = turns.map((turn) => turn.last).join(" ");
const knowledgeIsKnowledge =
  knowledge.diag.need === "UNDERSTAND" &&
  knowledge.diag.nluOp === "EXPLAIN" &&
  /Capacity Gap/i.test(knowledge.diag.nluSubject) &&
  knowledge.diag.behavior !== "NAVIGATE" &&
  !/^Focused on /i.test(knowledge.last ?? "");
const followKeepsCapacity =
  /Capacity Gap/i.test(follow.diag.continuity || follow.diag.nluSubject) &&
  /Capacity Gap/i.test(follow.last ?? "");
const showIsNavigate =
  showDiag.need === "LOCATE" &&
  (showDiag.behavior === "NAVIGATE" || showDiag.nluOp === "FOCUS");
const oneQuestion = (askCap.last.match(/\?/g) ?? []).length === 1;

const report = {
  identity: "NCA:1/ManagerConversationArchitectureAdvisorBehaviorFoundation",
  url: EXISTING,
  opened: Boolean(opened),
  pageErrors: errors,
  engine: knowledge.diag.engine,
  turns: turns.map((turn) => ({
    utterance: turn.utterance,
    last: turn.last,
    diag: turn.diag,
  })),
  knowledge,
  follow,
  show: { last: show.last, diag: showDiag },
  why: why.last,
  teach: teach.last,
  thanks: thanks.last,
  askCap: askCap.last,
  knowledgeIsKnowledge,
  followKeepsCapacity,
  showIsNavigate,
  oneQuestion,
  leak: LEAK.test(joined) || WATCH.test(joined),
  cause: CAUSE.test(joined) || CAUSE.test(why.last ?? ""),
  fiction: FICTION.test(joined),
};

const ok =
  errors.length === 0 &&
  report.engine.includes("ManagerConversationArchitectureAdvisorBehaviorFoundation") &&
  knowledgeIsKnowledge &&
  followKeepsCapacity &&
  showIsNavigate &&
  oneQuestion &&
  /welcome/i.test(thanks.last ?? "") &&
  /goal|outcome|naturally/i.test(teach.last ?? "") &&
  !report.leak &&
  !report.cause &&
  !report.fiction;

report.ok = ok;
await writeFile(join(OUT, "live-browser.json"), JSON.stringify(report, null, 2));
await writeFile(
  join(OUT, "RUNTIME-CERTIFICATION.md"),
  [
    "# Runtime certification — NCA:1",
    "",
    `- URL: ${EXISTING}`,
    `- Engine: ${report.engine}`,
    `- Page errors: ${errors.length}`,
    `- What Capacity Gap? is knowledge: ${knowledgeIsKnowledge}`,
    `- Explain it keeps Capacity Gap: ${followKeepsCapacity}`,
    `- Show Delivery navigates: ${showIsNavigate}`,
    `- One high-value question: ${oneQuestion}`,
    `- Architecture leak: ${report.leak}`,
    `- Unsupported causality: ${report.cause}`,
    `- Product fiction: ${report.fiction}`,
    `- Verdict: ${ok ? "PASS" : "FAIL"}`,
    "",
  ].join("\n"),
);

if (!ok) {
  console.error(report);
  process.exit(1);
}
console.log("NCA:1 live /executive: ok");
