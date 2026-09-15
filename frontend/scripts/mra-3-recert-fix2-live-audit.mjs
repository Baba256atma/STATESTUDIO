/**
 * MRA:3-RECERT-FIX2 live /executive targeted investigation fidelity.
 * Requires a production `next start` unless EXECUTIVE_URL is set.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const out = join(process.cwd(), "artifacts/mra/MRA-3-RECERT-FIX2");
const LEAK =
  /\b(?:NCA(?::|-)|NXA(?::|-)|ECA(?::|-)|CC:\d|DTH|POST:\d|DATA-ADV|canonicalWriter|INSUFFICIENT_REALITY|deictic|referent)\b/i;
const STEAL =
  /^(?:Nexora)?(?:Margin Pressure needs urgent|Prioritize Margin Pressure)/i;

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close((error) => (error ? reject(error) : resolve(port)));
    });
  });
}

async function waitForHttp(url, attempts = 80) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url, { redirect: "manual" });
      if (response.status > 0) return;
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function readShell(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      moActive: shell?.getAttribute("data-mo1-active-object-id") ?? "none",
      nluOperation: shell?.getAttribute("data-nlu-operation") ?? "",
      continuitySubject: shell?.getAttribute("data-continuity-subject") ?? "",
      continuityActive: shell?.getAttribute("data-continuity-active") ?? "",
      continuityInvestigation: shell?.getAttribute("data-continuity-investigation") ?? "",
      explanationSummary: shell?.getAttribute("data-mo2-summary") ?? "",
      experienceLane: shell?.getAttribute("data-mo-int1-lane") ?? "",
      attentionPrimary: shell?.getAttribute("data-mo6-primary") ?? "",
      communicationRecommendation:
        shell?.getAttribute("data-communication-recommendation") ?? "",
    };
  });
}

function check(id, actual, expected, anti) {
  const text = actual ?? "";
  const pass = expected.test(text) && (!anti || !anti.test(text));
  return { id, pass, expected: String(expected), anti: anti ? String(anti) : null, actual: text.slice(0, 360) };
}

const started = { child: null };
try {
  let base = process.env.EXECUTIVE_URL ?? null;
  if (!base) {
    const port = await findFreePort();
    const child = spawn("npx", ["next", "start", "-H", "127.0.0.1", "-p", String(port)], {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, PORT: String(port) },
    });
    started.child = child;
    child.stderr.on("data", (chunk) => process.stderr.write(chunk));
    base = `http://127.0.0.1:${port}/executive`;
    await waitForHttp(base);
  } else {
    base = base.split("?")[0];
  }
  const url = `${base}?reset=1`;
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  await mkdir(out, { recursive: true });

  async function turn(utterance) {
    const chat = await askExecutiveChat(page, utterance);
    return { managerTurn: utterance, reply: chat.last, leak: LEAK.test(chat.last ?? ""), ...(await readShell(page)) };
  }

  async function reset() {
    await openExecutivePage(page, url);
    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        const req = indexedDB.deleteDatabase("nexora-csv-real-data");
        req.onsuccess = () => resolve(null);
        req.onerror = () => reject(req.error);
        req.onblocked = () => resolve(null);
      });
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector('[data-testid="nexora-conversational-input-field"]');
    await page.waitForTimeout(600);
  }

  const live = { identity: "NPA-T MRA:3-RECERT-FIX2/LiveInvestigationFidelity", url, errors, checks: [], journeys: {} };

  await reset();
  live.journeys.A = [];
  live.journeys.A.push(await turn("Demand Surge"));
  live.journeys.A.push(await turn("investigate it"));
  live.checks.push(check("A-investigate-it", live.journeys.A.at(-1).reply, /Demand Surge/i, STEAL));

  await reset();
  live.journeys.B = [];
  live.journeys.B.push(await turn("Demand Surge"));
  live.journeys.B.push(await turn("look deeper into it"));
  live.checks.push(check("B-look-deeper", live.journeys.B.at(-1).reply, /Demand Surge/i, STEAL));

  await reset();
  live.journeys.C = [];
  live.journeys.C.push(await turn("Demand Surge"));
  live.journeys.C.push(await turn("what else do we know about it?"));
  live.checks.push(check("C-what-else", live.journeys.C.at(-1).reply, /Demand Surge/i, STEAL));

  await reset();
  live.journeys.DEF = [];
  live.journeys.DEF.push(await turn("Demand Surge"));
  live.journeys.DEF.push(await turn("tell me more about it"));
  live.checks.push(check("D-tell-me-more", live.journeys.DEF.at(-1).reply, /Demand Surge/i, STEAL));
  live.journeys.DEF.push(await turn("how sure are you?"));
  live.checks.push(check("E-how-sure", live.journeys.DEF.at(-1).reply, /Demand Surge/i, STEAL));
  live.journeys.DEF.push(await turn("what impact could it have?"));
  live.checks.push(check("F-impact", live.journeys.DEF.at(-1).reply, /Demand Surge/i, STEAL));

  await reset();
  live.journeys.G = [];
  live.journeys.G.push(await turn("What should I investigate?"));
  live.checks.push(check(
    "G-selection-attention",
    live.journeys.G.at(-1).reply,
    /Margin Pressure|Capacity Gap|investigate|attention|look at first|Neither clearly dominates|Which item|enough evidence/i,
    null,
  ));

  await reset();
  live.journeys.H = [];
  live.journeys.H.push(await turn("Demand Surge"));
  live.journeys.H.push(await turn("Investigate Margin Pressure"));
  live.checks.push(check("H-explicit-margin", live.journeys.H.at(-1).reply, /Margin Pressure/i, null));

  await reset();
  live.journeys.historical = [];
  live.journeys.historical.push(await turn("Demand Surge"));
  live.journeys.historical.push(await turn("explain it"));
  live.journeys.historical.push(await turn("tell me more about it"));
  live.journeys.historical.push(await turn("investigate it"));
  live.checks.push(check("hist-investigate-after-explain", live.journeys.historical.at(-1).reply, /Demand Surge/i, STEAL));

  live.leakCount = Object.values(live.journeys).flat().filter((row) => row?.leak).length;
  live.pageErrors = errors.length;
  live.passed = live.checks.every((item) => item.pass) && errors.length === 0 && live.leakCount === 0;
  await page.screenshot({ path: join(out, "live-proofs.png"), fullPage: true });
  await writeFile(join(out, "live-audit.json"), JSON.stringify(live, null, 2));
  await browser.close();
  if (started.child) started.child.kill("SIGTERM");
  console.log(JSON.stringify({
    passed: live.passed,
    pageErrors: errors.length,
    leakCount: live.leakCount,
    checks: live.checks.map((item) => ({ id: item.id, pass: item.pass })),
  }, null, 2));
  if (!live.passed) process.exit(1);
} catch (error) {
  if (started.child) started.child.kill("SIGTERM");
  throw error;
}
