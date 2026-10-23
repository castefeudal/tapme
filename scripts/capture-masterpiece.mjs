import { chromium } from "@playwright/test";
import sharp from "sharp";
const browser = await chromium.launch();
async function save(page, name, locator) {
  await page.evaluate(() => document.fonts.ready);
  const image = await (locator || page).screenshot();
  await sharp(image)
    .webp({ quality: 86 })
    .toFile("public/media/" + name + ".webp");
}
try {
  const made = await browser.newPage({
    viewport: { width: 430, height: 900 },
    reducedMotion: "reduce",
  });
  await made.goto("https://castefeudal.github.io/markovmade/#calculators", {
    waitUntil: "networkidle",
  });
  await made.locator("#mm-lab-tab-nutrition").click();
  await made.locator("#lab-nutri-sex").selectOption({ label: "Мужчина" });
  for (const [id, value] of [
    ["age", "29"],
    ["height", "188"],
    ["weight", "100"],
  ])
    await made.locator("#lab-nutri-" + id).fill(value);
  await made.locator("#lab-nutri-sex").scrollIntoViewIfNeeded();
  await save(made, "made-input");
  await made
    .getByRole("button", { name: "Рассчитать КБЖУ", exact: true })
    .click();
  await made
    .getByText("Рабочий старт", { exact: true })
    .evaluate((el) => el.scrollIntoView({ block: "start" }));
  await made.evaluate(() => scrollBy(0, -95));
  await save(made, "made-result");
  const gym = await browser.newPage({
    viewport: { width: 430, height: 900 },
    reducedMotion: "reduce",
  });
  await gym.keyboard.press("Escape");
  await gym.goto("https://castefeudal.github.io/markovgym/#library", {
    waitUntil: "networkidle",
  });
  await gym
    .getByRole("button", { name: "Открыть технику", exact: true })
    .first()
    .click();
  await gym
    .getByText("Профиль движения", { exact: true })
    .evaluate((el) => el.scrollIntoView({ block: "start" }));
  await save(gym, "gym-technique");
  await gym
    .getByRole("button", { name: "Добавить в тренировку", exact: true })
    .last()
    .click();
  await gym.keyboard.press("Escape");
  await gym.goto("https://castefeudal.github.io/markovgym/#workout", {
    waitUntil: "networkidle",
  });
  await gym
    .getByText("Добавлено в тренировку", { exact: true })
    .waitFor({ state: "hidden", timeout: 10000 });
  await save(gym, "gym-workout");
  const pm = await browser.newPage({
    viewport: { width: 430, height: 900 },
    reducedMotion: "reduce",
  });
  await pm.goto("https://castefeudal.github.io/pmwork/ru/", {
    waitUntil: "networkidle",
  });
  for (const [label, name] of [
    ["Работа", "pm-work"],
    ["Решения", "pm-decisions"],
  ]) {
    await pm.getByRole("button", { name: label, exact: true }).click();
    await pm.locator("#product-preview").scrollIntoViewIfNeeded();
    await save(pm, name);
  }
} finally {
  await browser.close();
}
