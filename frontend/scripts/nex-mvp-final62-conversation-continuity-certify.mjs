/**
 * NEX-MVP-FINAL:6.2 — live conversation continuity on /executive.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import {
  EXECUTIVE_CERT_URL,
  EXECUTIVE_EXISTING_URL,
  askExecutiveChat,
  openExecutivePage,
} from "./nex-mvp-final3-executive-chat-harness.mjs";

const BASE = process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL;
const RESET =
  process.env.EXECUTIVE_RESET_URL ??
  (BASE.includes("?") ? `${BASE}&reset=1&entrance=1` : `${BASE}?entrance=1&reset=1`);

const OUT = join(
  process.cwd(),
  ".certification/nex-mvp-final-6-2-conversation-context-continuity",
);
await mkdir(OUT, { recursive: true });
const FALLBACK = /not sure how that relates/i;
const LEAK =
  /CORE-INT|CC:9|EI:4|\bMO:|MISSING_|READY_FOR_|\bobj-|\bctx-|canonical intent|resolver|namespace|CONTEXT_ACTIVE_|EXPLICIT_CURRENT_TURN/i;

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
const opened = await openExecutivePage(page, BASE);

const turns = [];
async function ask(utterance) {
  const turn = await askExecutiveChat(page, utterance);
  const continuity = await page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    return {
      engine: shell?.getAttribute("data-nex-mvp-final62-engine") ?? "",
      provenance: shell?.getAttribute("data-continuity-provenance") ?? "",
      move: shell?.getAttribute("data-continuity-move") ?? "",
      subject: shell?.getAttribute("data-continuity-subject") ?? "",
      confidence: shell?.getAttribute("data-continuity-confidence") ?? "",
      active: shell?.getAttribute("data-continuity-active") ?? "",
      investigation: shell?.getAttribute("data-continuity-investigation") ?? "",
      previous: shell?.getAttribute("data-continuity-previous") ?? "",
      nluSubject: shell?.getAttribute("data-nlu-subject") ?? "",
    };
  });
  turns.push({ utterance, ...turn, continuity });
  return { ...turn, continuity };
}

const look = await ask("Can we look at Delivery?");
await page.screenshot({ path: join(OUT, "01-look-delivery.png") });
const goingOn = await ask("What's going on with it?");
const why = await ask("Why?");
const affect = await ask("What does that affect?");
const elseTurn = await ask("Anything else?");
const ignore = await ask("What happens if we leave this alone?");
const could = await ask("What could we do?");
const compare = await ask("Compare the options.");
await page.screenshot({ path: join(OUT, "02-compare-options.png") });
const safer = await ask("Which one looks safer?");
const whyThat = await ask("Why that one?");
const backProblem = await ask("Go back to the problem.");
const evidence = await ask("What evidence do we have?");
const cont = await ask("Continue.");
const showRisk = await ask("Now show Risk.");
const explainRisk = await ask("Explain it.");
await page.screenshot({ path: join(OUT, "03-explain-risk.png") });
const backDelivery = await ask("Back to Delivery.");
const where = await ask("Where were we?");
await page.screenshot({ path: join(OUT, "04-resume.png") });

const resetPage = await browser.newPage({ viewport: { width: 1502, height: 942 } });
const resetOpened = await openExecutivePage(resetPage, RESET);
const afterReset = await askExecutiveChat(resetPage, "Explain it.");
const resetContinuity = await resetPage.evaluate(() => {
  const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
  return {
    subject: shell?.getAttribute("data-continuity-subject") ?? "",
    active: shell?.getAttribute("data-continuity-active") ?? "",
    engine: shell?.getAttribute("data-nex-mvp-final62-engine") ?? "",
  };
});

await browser.close();

const joined = turns.map((turn) => turn.last).join(" ");
const report = {
  phase: "NEX-MVP-FINAL:6.2",
  identity: "NEX-MVP-FINAL:6.2/ConversationContextContinuity",
  http: opened.http,
  identityRuntime: opened.identity,
  existingUrl: BASE,
  resetUrl: RESET,
  resetHttp: resetOpened.http,
  turns,
  focusedDelivery: look.focused === "obj-delivery",
  itResolvedAfterShow:
    goingOn.continuity.subject === "Delivery" ||
    goingOn.focused === "obj-delivery",
  riskAfterSwitch:
    explainRisk.continuity.subject === "Risk" ||
    explainRisk.focused?.includes("risk"),
  noFallback: !FALLBACK.test(joined),
  leaks: LEAK.test(joined),
  engine: look.continuity.engine,
  continueDidNotApprove: !/approved|committed|execution started/i.test(cont.last),
  resetDidNotKeepDelivery:
    resetContinuity.subject !== "Delivery" &&
    resetContinuity.active !== "obj-delivery",
  resetContinuity,
  afterResetLast: afterReset.last,
  errors,
};

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

const passed =
  report.http === 200 &&
  opened.identity.reference === "NEX-MVP-FINAL:3/natural-reference-v1" &&
  report.focusedDelivery &&
  report.itResolvedAfterShow &&
  report.riskAfterSwitch &&
  report.noFallback &&
  report.leaks === false &&
  report.engine === "NEX-MVP-FINAL:6.2/ConversationContextContinuity" &&
  report.resetDidNotKeepDelivery &&
  report.errors.length === 0 &&
  /Delivery/i.test(goingOn.last);

process.exit(passed ? 0 : 1);
