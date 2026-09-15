/**
 * MRA:3-FINAL-FIX1-FIX1 live /executive composition fidelity.
 * Requires a production `next start` unless EXECUTIVE_URL is set.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const out = join(process.cwd(), "artifacts/mra/MRA-3-FINAL-FIX1-FIX1");

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
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      moActive: shell?.getAttribute("data-mo1-active-object-id") ?? "none",
      dataRoute: shell?.getAttribute("data-advisor-data-route") ?? "none",
      stageMode: stage?.getAttribute("data-stage-presentation-mode") ?? "none",
    };
  });
}

async function clickTestId(page, id) {
  await page.evaluate((testId) => {
    const node = document.querySelector(`[data-testid="${testId}"]`);
    if (!(node instanceof HTMLElement)) throw new Error(`missing ${testId}`);
    node.click();
  }, id);
}

async function importReadyCsv(page) {
  await page.locator('[data-csv-hydrated="true"]').waitFor({ state: "attached", timeout: 20000 });
  if (!(await page.getByTestId("nexora-rdi2-data-explorer").count())) {
    await clickTestId(page, "nexora-stage-data-control");
  }
  await page.getByTestId("nexora-rdi2-data-explorer").waitFor({ state: "visible", timeout: 15000 });
  await clickTestId(page, "nexora-rdi2-add-data");
  await page.getByTestId("nexora-rdi4-source-choice").waitFor({ state: "visible" });
  await page.locator('[data-testid="nexora-rdi4-source-choice"] button').first().evaluate((node) => node instanceof HTMLElement && node.click());
  const fileInput = page.getByTestId("nexora-csv-file-input");
  await fileInput.waitFor({ state: "attached", timeout: 15000 });
  await fileInput.setInputFiles("test-fixtures/data-ux3/data-ux3-ambiguous.csv");
  try {
    await page.getByTestId("nexora-csv-understanding-summary").waitFor({ state: "visible", timeout: 20000 });
  } catch (error) {
    await page.screenshot({ path: join(out, "csv-import-failure.png"), fullPage: true });
    throw error;
  }
  const validate = page.getByRole("button", { name: "Validate Import" });
  if (await validate.count()) {
    await validate.evaluate((node) => node instanceof HTMLElement && node.click());
  }
  const use = page.getByTestId("nexora-csv-use-this-data");
  if (await use.count()) {
    await use.waitFor({ state: "visible", timeout: 15000 });
    await use.click();
    await page.waitForTimeout(800);
  }
}

function assertMatch(label, text, pattern, anti) {
  if (!pattern.test(text)) {
    throw new Error(`${label}: expected ${pattern} in ${JSON.stringify(text)}`);
  }
  if (anti && anti.test(text)) {
    throw new Error(`${label}: unexpected ${anti} in ${JSON.stringify(text)}`);
  }
}

const started = { child: null, port: null };
try {
  let base = process.env.EXECUTIVE_URL ?? null;
  if (!base) {
    const port = await findFreePort();
    started.port = port;
    const child = spawn("npx", ["next", "start", "-H", "127.0.0.1", "-p", String(port)], {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, PORT: String(port) },
    });
    started.child = child;
    child.stderr.on("data", (chunk) => {
      process.stderr.write(chunk);
    });
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
    const before = await page.evaluate(() => {
      const nodes = [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')];
      return { count: nodes.length, last: nodes.at(-1)?.textContent ?? "" };
    });
    const field = page.locator('[data-testid="nexora-conversational-input-field"]');
    await field.fill(utterance);
    await field.press("Enter");
    await page.waitForFunction((prior) => {
      const nodes = [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')];
      const last = nodes.at(-1)?.textContent ?? "";
      return nodes.length > prior.count || last !== prior.last;
    }, before);
    await page.waitForTimeout(500);
    const chat = await page.evaluate(() => {
      const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
      return {
        focused: shell?.getAttribute("data-focused-subject") ?? "none",
        moActive: shell?.getAttribute("data-mo1-active-object-id") ?? "none",
        last:
          [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')]
            .at(-1)?.textContent ?? "",
      };
    });
    return { managerTurn: utterance, reply: chat.last, ...(await readShell(page)), focusedChat: chat.focused };
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
    await page.waitForTimeout(800);
    await importReadyCsv(page);
  }

  const live = { identity: "NPA-T MRA:3-FINAL-FIX1-FIX1/LiveCompositionFidelity", url, errors, tests: {} };

  if (!process.env.STAGE_ONLY) {

  await reset();
  live.tests.A = [];
  live.tests.A.push(await turn("show me scenarios"));
  live.tests.A.push(await turn("is there any CSV files?"));
  live.tests.A.push(await turn("Capacity Gap"));
  live.tests.A.push(await turn("explain it"));
  assertMatch(
    "Test A",
    live.tests.A.at(-1).reply,
    /Capacity Gap/i,
    /Capacity Expansion Plan explores/i,
  );

  await reset();
  live.tests.B = [];
  live.tests.B.push(await turn("show me scenarios"));
  live.tests.B.push(await turn("is there any CSV files?"));
  live.tests.B.push(await turn("Margin Pressure"));
  live.tests.B.push(await turn("explain it"));
  assertMatch("Test B", live.tests.B.at(-1).reply, /Margin Pressure/i, /Capacity Expansion Plan explores/i);

  await reset();
  live.tests.C = [];
  live.tests.C.push(await turn("is there any CSV files?"));
  live.tests.C.push(await turn("look at Capacity"));
  live.tests.C.push(await turn("explain it"));
  assertMatch("Test C", live.tests.C.at(-1).reply, /Capacity/i, /capacity\.csv is under review/i);

  await openExecutivePage(page, url);
  live.tests.D = [];
  live.tests.D.push(await turn("Capacity Gap"));
  live.tests.D.push(await turn("Demand Surge"));
  live.tests.D.push(await turn("explain it"));
  assertMatch("Test D", live.tests.D.at(-1).reply, /Demand Surge/i, /^Capacity Gap/i);

  await reset();
  live.tests.E = [];
  live.tests.E.push(await turn("show me scenarios"));
  live.tests.E.push(await turn("is there any CSV files?"));
  live.tests.E.push(await turn("explain it"));
  assertMatch("Test E", live.tests.E.at(-1).reply, /csv/i, /Capacity Expansion Plan explores/i);

  await openExecutivePage(page, url);
  live.tests.F = [];
  live.tests.F.push(await turn("Expand Capacity"));
  live.tests.F.push(await turn("Capacity Expansion"));
  live.tests.F.push(await turn("explain it"));
  assertMatch("Test F", live.tests.F.at(-1).reply, /Capacity Expansion/i, null);

  await reset();
  live.tests.G = [];
  live.tests.G.push(await turn("is there any CSV files?"));
  live.tests.G.push(await turn("Capacity Gap"));
  live.tests.G.push(await turn("what can Nexora do?"));
  live.tests.G.push(await turn("explain it"));
  if (!/which|do you mean|what do you mean|clarify|more than one/i.test(live.tests.G.at(-1).reply)) {
    throw new Error(`Test G: expected clarification, got ${JSON.stringify(live.tests.G.at(-1).reply)}`);
  }
  }

  await reset();
  live.tests.stage = [];
  live.tests.stage.push(await turn("show me scenarios"));
  live.tests.stage.push(await turn("is there any CSV files?"));
  live.tests.stage.push(await turn("Capacity Gap"));
  const revenue = page.locator('[data-testid="nexora-stage-object-control-obj-revenue"]');
  if (await revenue.count()) {
    await revenue.evaluate((node) => node instanceof HTMLElement && node.click());
    await page.waitForTimeout(500);
    live.tests.stage.push({ managerTurn: "(click obj-revenue)", reply: null, ...(await readShell(page)) });
  }
  live.tests.stage.push(await turn("look at Capacity Gap"));
  live.tests.stage.push(await turn("explain it"));
  await writeFile(join(out, "live-audit.json"), JSON.stringify(live, null, 2));
  console.log(JSON.stringify(live.tests.stage.map((row) => ({
    turn: row.managerTurn,
    focused: row.focused,
    moActive: row.moActive,
    reply: (row.reply ?? "").slice(0, 180),
  })), null, 2));
  assertMatch(
    "Stage",
    live.tests.stage.at(-1).reply,
    /Capacity Gap/i,
    /Capacity Expansion Plan explores/i,
  );

  await openExecutivePage(page, url);
  live.tests.scenarioExplicit = [];
  live.tests.scenarioExplicit.push(await turn("Demand Surge"));
  live.tests.scenarioExplicit.push(await turn("explain it"));
  assertMatch(
    "Scenario explicit",
    live.tests.scenarioExplicit.at(-1).reply,
    /Demand Surge/i,
    /^Capacity Gap/i,
  );

  live.tests.scenarioSure = [];
  live.tests.scenarioSure.push(await turn("how sure are you?"));
  assertMatch(
    "Scenario how sure",
    live.tests.scenarioSure.at(-1).reply,
    /sure|confidence|projection|scenario|evidence|model/i,
    /Capacity Expansion Plan explores/i,
  );

  await page.screenshot({ path: join(out, "live-proofs.png") });
  await browser.close();
  live.zeroPageErrors = errors.length === 0;
  if (!live.zeroPageErrors) {
    throw new Error(`page errors: ${errors.join(" | ")}`);
  }
  await writeFile(join(out, "live-audit.json"), JSON.stringify(live, null, 2));
  console.log(JSON.stringify({
    identity: live.identity,
    url,
    errorCount: errors.length,
    out: join(out, "live-audit.json"),
  }, null, 2));
} finally {
  if (started.child) started.child.kill("SIGTERM");
}
