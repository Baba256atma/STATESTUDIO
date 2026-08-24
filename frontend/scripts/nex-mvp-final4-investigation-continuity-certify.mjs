/**
 * NEX-MVP-FINAL:4 — live investigation → do-nothing continuity on /executive.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import {
  EXECUTIVE_CERT_URL,
  EXECUTIVE_EXISTING_URL,
  askExecutiveChat,
  assertCanonicalFocus,
  openExecutiveChat,
  openExecutivePage,
} from "./nex-mvp-final3-executive-chat-harness.mjs";

const OUT = join(process.cwd(), ".certification/nex-mvp-final-4-investigation-continuity");
await mkdir(OUT, { recursive: true });
const FALLBACK = /not sure how that relates/i;
const LEAK =
  /scenario intent detected|MISSING_GOAL|READY_FOR_SCENARIO|EI:4|CC:9|\bMO:|Try asking me to explain the situation/i;

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));

const entrancePage = await browser.newPage({ viewport: { width: 1502, height: 942 } });
entrancePage.on("pageerror", (error) => errors.push(String(error)));
const entrance = await openExecutivePage(entrancePage, EXECUTIVE_CERT_URL);
await entrancePage.close();

const opened = await openExecutiveChat(page);
const showRisk = await askExecutiveChat(page, "show risk");
assertCanonicalFocus(showRisk, "obj-risk", "show risk");
const explain = await askExecutiveChat(page, "explain it.");
const why = await askExecutiveChat(page, "why?");
const affect = await askExecutiveChat(page, "What does it affect?");
const ignore = await askExecutiveChat(page, "What happens if we ignore it?");
await page.screenshot({ path: join(OUT, "01-ignore-it.png") });
const options = await askExecutiveChat(page, "What are my options?");
await page.screenshot({ path: join(OUT, "02-options.png") });
const compare = await askExecutiveChat(page, "Compare them.");
const safer = await askExecutiveChat(page, "Which is safer?");
const goal = await askExecutiveChat(page, "Which better supports my goal?");
const recommend = await askExecutiveChat(page, "What do you recommend?");
const decide = await askExecutiveChat(page, "Let's do that.");
await page.screenshot({ path: join(OUT, "03-recommend-decision.png") });
await browser.close();

const report = {
  phase: "NEX-MVP-FINAL:4",
  http: opened.http,
  identity: opened.identity,
  entranceIdentity: entrance.identity,
  existingUrl: EXECUTIVE_EXISTING_URL,
  showRisk,
  explain,
  why,
  affect,
  ignore,
  options,
  compare,
  safer,
  goal,
  recommend,
  decide,
  ignoreKeepsRisk: ignore.focused === "obj-risk",
  noFallback: !FALLBACK.test(ignore.last + options.last + compare.last),
  scenarioNotPrediction: /scenario rather than a prediction/i.test(ignore.last),
  noNumericInvention: !/\b20%\b/.test(ignore.last),
  decisionSafety:
    /confirm|preference|not a Decision|which option/i.test(decide.last) &&
    !/Approved decision/i.test(decide.last),
  leaks: LEAK.test(
    [ignore, options, compare, recommend].map((turn) => turn.last).join(" "),
  ),
  errors,
};

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

const passed =
  report.http === 200 &&
  opened.identity.reference === "NEX-MVP-FINAL:3/natural-reference-v1" &&
  report.ignoreKeepsRisk &&
  report.noFallback &&
  report.scenarioNotPrediction &&
  report.noNumericInvention &&
  report.decisionSafety &&
  report.leaks === false &&
  report.errors.length === 0;

process.exit(passed ? 0 : 1);
