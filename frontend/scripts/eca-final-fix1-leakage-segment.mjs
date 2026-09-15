/**
 * ECA:FINAL-FIX1 — Journey A recommendation leakage segment only.
 * Does not rerun full integrated certification.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import {
  EXECUTIVE_EXISTING_URL,
  askExecutiveChat,
  openExecutivePage,
} from "./nex-mvp-final3-executive-chat-harness.mjs";

const base = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const url = `${base}?reset=1`;
const out = join(process.cwd(), "artifacts/eca/ECA-FINAL");
const LEAK = /\b(?:UNSPECIFIED|undefined|null)\b/i;

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
await mkdir(out, { recursive: true });
await page.goto("about:blank");
await openExecutivePage(page, url);

await askExecutiveChat(page, "What's our current situation?");
await askExecutiveChat(page, "Explain Capacity Gap.");
await askExecutiveChat(page, "Compare Demand Surge and Pricing Response.");
const recommend = await askExecutiveChat(page, "What do you recommend?");
const reply = recommend.last ?? "";
const leakMatch = reply.match(LEAK)?.[0] ?? null;
const pass =
  errors.length === 0 &&
  leakMatch == null &&
  /recommend|advice|Decision|prefer|option|investigat/i.test(reply);

const evidence = {
  identity: "NPA-T ECA:FINAL-FIX1/JourneyA-recommendation-leakage-segment",
  url,
  pageErrors: errors.length,
  utterance: "What do you recommend?",
  reply,
  leakMatch,
  pass,
};

await writeFile(join(out, "fix1-journey-a-leakage.json"), `${JSON.stringify(evidence, null, 2)}\n`);
await browser.close();
console.log(JSON.stringify({ passed: pass, leakMatch, pageErrors: errors.length }, null, 2));
if (!pass) process.exit(1);
