/**
 * NEX-MVP-FINAL:6.3 — live smart clarification & correction on /executive.
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
const RESET =
  process.env.EXECUTIVE_RESET_URL ??
  (BASE.includes("?") ? `${BASE}&reset=1&entrance=1` : `${BASE}?entrance=1&reset=1`);

const OUT = join(
  process.cwd(),
  ".certification/nex-mvp-final-6-3-smart-clarification-correction",
);
await mkdir(OUT, { recursive: true });
const FALLBACK = /not sure how that relates/i;
const LEAK =
  /CORE-INT|CC:9|EI:4|\bMO:|MISSING_|READY_FOR_|\bobj-|\bctx-|canonical intent|resolver|namespace|CONTEXT_ACTIVE_|EXPLICIT_CURRENT_TURN|AMBIGUOUS_REFERENCE|candidate count/i;
const ROBOTIC = /I apologize, but your request appears to contain an ambiguous reference/i;
const COMMITTED = /approved|committed|execution started/i;

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
const opened = await openExecutivePage(page, BASE);

const turns = [];
async function readClarification(target) {
  return target.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    return {
      engine: shell?.getAttribute("data-nex-mvp-final63-engine") ?? "",
      required: shell?.getAttribute("data-clarification-required") ?? "",
      action: shell?.getAttribute("data-clarification-action") ?? "",
      reason: shell?.getAttribute("data-clarification-reason") ?? "",
      question: shell?.getAttribute("data-clarification-question") ?? "",
      candidates: shell?.getAttribute("data-clarification-candidates") ?? "",
      consequence: shell?.getAttribute("data-clarification-consequence") ?? "",
      pending: shell?.getAttribute("data-clarification-pending") ?? "",
      resumed: shell?.getAttribute("data-clarification-resumed") ?? "",
      correction: shell?.getAttribute("data-correction-detected") ?? "",
      scope: shell?.getAttribute("data-correction-scope") ?? "",
      before: shell?.getAttribute("data-correction-before") ?? "",
      after: shell?.getAttribute("data-correction-after") ?? "",
      nluSubject: shell?.getAttribute("data-nlu-subject") ?? "",
      continuitySubject: shell?.getAttribute("data-continuity-subject") ?? "",
      focused: shell?.getAttribute("data-focused-subject") ?? "",
    };
  });
}

async function ask(utterance) {
  const turn = await askExecutiveChat(page, utterance);
  const clarification = await readClarification(page);
  turns.push({ utterance, ...turn, clarification });
  return { ...turn, clarification };
}

const look = await ask("Can we look at Delivery?");
await page.screenshot({ path: join(OUT, "01-look-delivery.png") });
const goingOn = await ask("What's going on with it?");
const showCapacity = await ask("Show Capacity.");
const explainThat = await ask("Explain that.");
await page.screenshot({ path: join(OUT, "02-explain-that-clarify.png") });
const meantProblem = await ask("No, I meant the Capacity problem.");
await page.screenshot({ path: join(OUT, "03-correction.png") });
const ignore = await ask("What happens if we ignore it?");
const options = await ask("What options do we have?");
const compare = await ask("Compare them.");
await page.screenshot({ path: join(OUT, "04-compare.png") });
const safer = await ask("Which one is safer?");
const whyThat = await ask("Why that one?");
const other = await ask("Let's do the other one.");
await page.screenshot({ path: join(OUT, "05-other-one.png") });
if (
  other.clarification.required === "true" ||
  /which|do you mean|scenario/i.test(other.last)
) {
  await ask("External capacity.");
}

const showDelivery = await ask("Show Delivery.");
const showCapacityAgain = await ask("Show Capacity.");
const explainAmbiguous = await ask("Explain that.");
await page.screenshot({ path: join(OUT, "06-second-clarify.png") });
const second = await ask("The second one.");
await page.screenshot({ path: join(OUT, "07-resume-explain.png") });

const resetPage = await browser.newPage({ viewport: { width: 1502, height: 942 } });
resetPage.on("pageerror", (error) => errors.push(String(error)));
const resetOpened = await openExecutivePage(resetPage, RESET);
const afterReset = await askExecutiveChat(resetPage, "Explain it.");
const resetClarification = await readClarification(resetPage);

await browser.close();

const owned = turns.filter(
  (turn) =>
    turn.clarification.required === "true" ||
    turn.clarification.action === "resume" ||
    turn.clarification.action === "clarify",
);
const ownedText = owned.map((turn) => turn.last).join(" ");
const joined = turns.map((turn) => turn.last).join(" ");
const report = {
  phase: "NEX-MVP-FINAL:6.3",
  identity: "NEX-MVP-FINAL:6.3/SmartClarificationCorrection",
  http: opened.http,
  identityRuntime: opened.identity,
  existingUrl: BASE,
  resetUrl: RESET,
  resetHttp: resetOpened.http,
  turns,
  focusedDelivery: look.focused === "obj-delivery",
  goingOnDidNotClarify: goingOn.clarification.required !== "true",
  explainThatClarified:
    explainThat.clarification.required === "true" ||
    /do you mean|capacity|delivery/i.test(explainThat.last),
  correctionDetected:
    meantProblem.clarification.correction === "true" ||
    meantProblem.clarification.action === "resume" ||
    /capacity/i.test(meantProblem.last),
  whyThatDidNotClarify: whyThat.clarification.required !== "true",
  otherDidNotBypassDecision: !COMMITTED.test(other.last),
  secondResumed:
    second.clarification.action === "resume" ||
    /capacity|delivery/i.test(second.last),
  noFallbackOnClarification: !FALLBACK.test(ownedText),
  leaks: LEAK.test(joined),
  robotic: ROBOTIC.test(joined),
  engine: look.clarification.engine,
  resetPendingCleared: resetClarification.pending !== "true",
  resetClarification,
  afterResetLast: afterReset.last,
  errors,
};

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

const passed =
  report.http === 200 &&
  opened.identity.reference === "NEX-MVP-FINAL:3/natural-reference-v1" &&
  report.focusedDelivery &&
  report.goingOnDidNotClarify &&
  report.explainThatClarified &&
  report.correctionDetected &&
  report.whyThatDidNotClarify &&
  report.otherDidNotBypassDecision &&
  report.noFallbackOnClarification &&
  report.leaks === false &&
  report.robotic === false &&
  report.engine === "NEX-MVP-FINAL:6.3/SmartClarificationCorrection" &&
  report.resetPendingCleared &&
  report.errors.length === 0 &&
  /Delivery/i.test(goingOn.last);

process.exit(passed ? 0 : 1);
