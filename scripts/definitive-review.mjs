import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
const root = process.env.REVIEW_URL || "http://127.0.0.1:4174/tapme/";
const browser = await chromium.launch();
await mkdir("docs/evidence", { recursive: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const directions = {
    "A-cinematic":
      ".cover-scene{grid-template-columns:.65fr 1.35fr}.cover h1{font-size:100px}.cover-portrait{min-height:760px}",
    "B-architectural": "",
    "C-interactive":
      ".cover-scene{grid-template-rows:auto auto auto auto auto auto}.cover h1{grid-column:1/-1;grid-row:1;display:flex;justify-content:space-between;font-size:130px;border:0;padding:0}.cover-portrait{grid-column:2;grid-row:2/6;min-height:580px}.cover-note{grid-row:2}.cover-actions{grid-row:3}.cover-socials{grid-row:4}.audience-paths{grid-row:6}",
  };
  for (const [name, css] of Object.entries(directions)) {
    await page.goto(root);
    await page.locator(".cover").waitFor();
    await page.evaluate(() => document.fonts.ready);
    if (css) await page.addStyleTag({ content: css });
    await page.screenshot({ path: `docs/evidence/direction-${name}.png` });
  }
  for (const [name, family, size] of [
    ["Oswald", "Markov Display", "144px"],
    ["Manrope", "Manrope", "100px"],
    ["Noto", "Signature Serif", "100px"],
  ]) {
    await page.goto(root);
    await page.locator(".cover").waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({
      content: `.cover h1{font-family:"${family}";font-size:${size}}`,
    });
    await page.screenshot({ path: `docs/evidence/type-${name}.png` });
  }
  for (const [prefix, names] of [
    ["direction", ["A-cinematic", "B-architectural", "C-interactive"]],
    ["type", ["Oswald", "Manrope", "Noto"]],
  ]) {
    const tiles = [];
    for (let i = 0; i < names.length; i++)
      tiles.push({
        input: await sharp(`docs/evidence/${prefix}-${names[i]}.png`)
          .resize(600)
          .toBuffer(),
        left: i * 600,
        top: 0,
      });
    await sharp({
      create: { width: 1800, height: 417, channels: 3, background: "#101315" },
    })
      .composite(tiles)
      .png()
      .toFile(`docs/evidence/definitive-${prefix}-comparison.png`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(root);
  await page.locator("#next").scrollIntoViewIfNeeded();
  for (let k = 0; k < 2; k++)
    await page.locator(".answer-list>button").first().click();
  await page.getByRole("button", { name: "Сохранить базовый план" }).click();
  const exported = page.waitForEvent("download");
  await page.getByRole("button", { name: "Сохранить PNG" }).click();
  await (await exported).saveAs("docs/evidence/definitive-plan-export.png");
  console.log(
    "Captured three composition studies, three type studies and a real exported PNG.",
  );
} finally {
  await browser.close();
}
