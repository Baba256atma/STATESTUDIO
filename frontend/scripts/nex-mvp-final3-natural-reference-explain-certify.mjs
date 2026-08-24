/**
 * NEX-MVP-FINAL:3 — live natural reference on real /executive Chat.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import {
  DATABASE_STYLE,
  FINAL3_REFERENCE,
  askExecutiveChat,
  assertCanonicalFocus,
  openExecutiveChat,
} from "./nex-mvp-final3-executive-chat-harness.mjs";

const OUT = join(process.cwd(), ".certification/nex-mvp-final-3-natural-reference-explain");
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
const opened = await openExecutiveChat(page);
const showRiskObject = await askExecutiveChat(page, "show me risk object");
assertCanonicalFocus(showRiskObject, "obj-risk", "show me risk object");
await page.screenshot({ path: join(OUT, "01-show-risk-object.png") });
const explainIt = await askExecutiveChat(page, "explain it");
await page.screenshot({ path: join(OUT, "02-explain-it.png") });
await browser.close();

const report = {
  phase: "NEX-MVP-FINAL:3",
  http: opened.http,
  identity: opened.identity,
  showRiskObject,
  explainIt,
  riskResolved: showRiskObject.focused === "obj-risk",
  riskNotLiteralObject: !/couldn.t find/i.test(showRiskObject.last),
  explainExecutive: /Risk/i.test(explainIt.last) && !DATABASE_STYLE.test(explainIt.last),
  errors,
};

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
process.exit(
  report.http === 200 &&
    report.riskResolved &&
    report.riskNotLiteralObject &&
    report.explainExecutive &&
    opened.identity.reference === FINAL3_REFERENCE &&
    report.errors.length === 0
    ? 0
    : 1,
);
