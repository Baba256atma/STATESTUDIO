import { chromium } from "playwright";

const URL = process.env.NEXORA_DEBUG_URL ?? "http://localhost:3000/type-c";
const logs = [];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.on("console", (msg) => {
  const text = msg.text();
  if (text.includes("[Nexora]")) {
    logs.push(text);
  }
});

console.log(`Navigating to ${URL} ...`);
await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForSelector('[data-nx="executive-scene-toolbar"]', { timeout: 120000 });
await page.waitForTimeout(2000);

const orientationDismiss = page.locator('button:has-text("Enter workspace")');
if (await orientationDismiss.count()) {
  console.log("Dismissing orientation welcome overlay ...");
  await orientationDismiss.first().click();
  await page.waitForTimeout(1000);
}

console.log("Clicking 3D toolbar button ...");
await page.click('button[aria-label="3D workspace view"]', { force: true });
await page.waitForTimeout(2500);

console.log("\n--- Captured [Nexora] console logs after 3D click ---");
if (logs.length === 0) {
  console.log("(none)");
} else {
  for (const entry of logs) {
    console.log(entry);
  }
}

const stages = {
  toolbarClick: logs.some((l) => l.includes("[Nexora][3DButtonClicked]")),
  viewModeChanged: logs.some((l) => l.includes("[Nexora][ViewModeChanged]")),
  cameraProfileApplied: logs.some((l) =>
    l.includes("[Nexora][CameraProfileApplied]") && !l.includes("skipped")
  ),
  cameraProfileSkipped: logs.some((l) =>
    l.includes("[Nexora][CameraProfileApplied]") && l.includes("skipped")
  ),
};

console.log("\n--- Stage summary ---");
console.log(JSON.stringify(stages, null, 2));

await browser.close();
