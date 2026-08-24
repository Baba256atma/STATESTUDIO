/**
 * NEX-MVP-FINAL:6.4 — live trusted executive communication on /executive.
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
const OUT = join(
  process.cwd(),
  ".certification/nex-mvp-final-6-4-trusted-executive-communication",
);
await mkdir(OUT, { recursive: true });
const LEAK =
  /CORE-INT|CC:9|EI:4|\bMO:|FINAL:6\.4|\bobj-|\bctx-|canonical meaning|namespace|resolver/i;
const FILLER = /Absolutely!|Great question!|As an AI|Happy to help!/i;
const OVERCLAIM = /\bis causing\b|definitely the cause/i;

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
const opened = await openExecutivePage(page, BASE);

const turns = [];
async function ask(utterance) {
  const turn = await askExecutiveChat(page, utterance);
  const communication = await page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    return {
      engine: shell?.getAttribute("data-nex-mvp-final64-engine") ?? "",
      depth: shell?.getAttribute("data-communication-depth") ?? "",
      challenge: shell?.getAttribute("data-communication-challenge") ?? "",
      recommendation: shell?.getAttribute("data-communication-recommendation") ?? "",
      uncertainty: shell?.getAttribute("data-communication-uncertainty") ?? "",
      causal: shell?.getAttribute("data-communication-causal-validated") ?? "",
      decision: shell?.getAttribute("data-communication-decision-wording") ?? "",
      execution: shell?.getAttribute("data-communication-execution-wording") ?? "",
    };
  });
  turns.push({ utterance, ...turn, communication });
  return { ...turn, communication };
}

const show = await ask("Show Delivery.");
await page.screenshot({ path: join(OUT, "01-show-delivery.png") });
const why = await ask("Why is it below target?");
await page.screenshot({ path: join(OUT, "02-why.png") });
const sure = await ask("Are you sure Capacity is the cause?");
await page.screenshot({ path: join(OUT, "03-are-you-sure.png") });
const evidence = await ask("What evidence do we actually have?");
const act = await ask("So should we act now?");
const recommend = await ask("What would you recommend?");
const whyRec = await ask("Why?");
const approveIt = await ask("I think we should just approve it.");
const challenge = await ask("Are you challenging me?");
await page.screenshot({ path: join(OUT, "04-challenge.png") });
const compare = await ask("Fine. Compare the options.");
const safer = await ask("Which one is safer?");
const howSure = await ask("How sure are you?");
const lets = await ask("Let's do that.");
const approve = await ask("Approve.");
const confirm = await ask("Confirm.");
const next = await ask("What happens next?");
const start = await ask("Start.");
const confirmStart = await ask("Confirm.");
const observed = await ask("Delivery is now 94%.");
const worked = await ask("So it worked?");
await page.screenshot({ path: join(OUT, "05-outcome.png") });
const learned = await ask("What did we learn?");

await browser.close();

const joined = turns.map((turn) => turn.last).join(" ");
const report = {
  phase: "NEX-MVP-FINAL:6.4",
  identity: "NEX-MVP-FINAL:6.4/TrustedExecutiveCommunication",
  http: opened.http,
  identityRuntime: opened.identity,
  existingUrl: BASE,
  turns,
  engine: show.communication.engine,
  whyDidNotOverclaim: !/\bis causing\b/i.test(why.last),
  sureMixed: /sure|hypothesis|confirm|not yet/i.test(sure.last),
  approveDidNotDecide: !/we decided|decision is approved/i.test(approveIt.last),
  workedDidNotAttribute: !/the intervention worked/i.test(worked.last),
  leaks: LEAK.test(joined),
  filler: FILLER.test(joined),
  overclaim: OVERCLAIM.test(joined),
  errors,
};

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

const passed =
  report.http === 200 &&
  opened.identity.reference === "NEX-MVP-FINAL:3/natural-reference-v1" &&
  report.engine === "NEX-MVP-FINAL:6.4/TrustedExecutiveCommunication" &&
  report.whyDidNotOverclaim &&
  report.sureMixed &&
  report.approveDidNotDecide &&
  report.workedDidNotAttribute &&
  report.leaks === false &&
  report.filler === false &&
  report.errors.length === 0;

process.exit(passed ? 0 : 1);
