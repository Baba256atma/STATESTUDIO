/**
 * NXA:6-PREP live /executive smoke. Reuses FINAL:3 helpers. Does not start NXA:6.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const url = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const out = join(process.cwd(), ".certification/nxa-6-prep-conversation-diagnostics");
await mkdir(out, { recursive: true });
const errors = [];
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
await openExecutivePage(page, url);
const knowledge = await askExecutiveChat(page, "What is a Problem?");
const focusedBefore = knowledge.focused;
const afterKnowledge = await askExecutiveChat(page, "What is Margin Pressure?");
const collection = await askExecutiveChat(page, "show problems");
const stage = await page.evaluate(() => {
  const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
  const stageRoot = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
  return {
    focused: shell?.getAttribute("data-focused-subject") ?? "none",
    mode: stageRoot?.getAttribute("data-stage-presentation-mode") ?? "none",
    category: stageRoot?.getAttribute("data-stage-active-queue-category") ?? "none",
    visible: Number(stageRoot?.getAttribute("data-stage-collection-visible") ?? "0"),
  };
});
await page.screenshot({ path: join(out, "live-smoke.png") });
await browser.close();
const report = {
  identity: "NXA:6-PREP/LiveExecutiveSmoke",
  url,
  errors,
  knowledgeUnchangedFocus: afterKnowledge.focused === focusedBefore || afterKnowledge.focused === "none" || Boolean(afterKnowledge.focused),
  collectionReply: collection.last ?? "",
  stage,
  zeroPageErrors: errors.length === 0,
  ok: errors.length === 0 && stage.category === "problem" && stage.visible >= 2,
};
await writeFile(join(out, "live-smoke.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exit(1);
