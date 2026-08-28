/** NXA:4 — live /executive proactive-advisory certification. */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const url = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const out = join(process.cwd(), ".certification/nxa-4-proactive-advisory");
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
await openExecutivePage(page, url);

async function turn(utterance) {
  const result = await askExecutiveChat(page, utterance);
  const diagnostics = await page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    return Object.fromEntries(["disposition", "intensity", "materiality", "evidence", "novelty"].map((key) => [key, shell?.getAttribute(`data-nxa4-${key}`) ?? ""]));
  });
  return { utterance, response: result.last ?? "", focused: result.focused ?? "", diagnostics };
}

const material = await turn("Delivery fell from 91 to 87.");
const noise = await turn("Delivery fell from 87 to 86.9.");
const repeat = await turn("Delivery fell from 87 to 86.9.");
const monitoring = await turn("Will you keep watching this?");
await page.screenshot({ path: join(out, "live-executive.png") });
await browser.close();

const proofs = {
  materialIntervention: ["SPEAK", "ESCALATE"].includes(material.diagnostics.disposition) && /87|Delivery/i.test(material.response),
  noiseSilence: noise.diagnostics.disposition === "SUPPRESS" && noise.diagnostics.materiality === "NOISE",
  repetitionProtection: repeat.diagnostics.disposition === "SUPPRESS",
  noFakeMonitoring: /not continuously monitoring/i.test(monitoring.response) && /new data|observations/i.test(monitoring.response),
  noStageMutation: material.focused === noise.focused && noise.focused === repeat.focused,
  zeroPageErrors: errors.length === 0,
};
const report = { identity: "NXA:4/ExecutiveProactiveAdvisoryInterventionIntelligence", url, errors, turns: [material, noise, repeat, monitoring], proofs, ok: Object.values(proofs).every(Boolean) };
await writeFile(join(out, "runtime-proactive-advisory.json"), JSON.stringify(report, null, 2));
if (!report.ok) { console.error(JSON.stringify(report, null, 2)); process.exit(1); }
console.log("NXA:4 live /executive: ok");
