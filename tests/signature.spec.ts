import { test, expect } from "@playwright/test";
import { defaults } from "../src/lib/plan";
import { viewport } from "./support";
test("mobile scene changes keep portrait and actions separate", async ({
  page,
}) => {
  await page.goto("./");
  for (const width of [320, 390, 768]) {
    await viewport(page, width, 844);
    for (const mode of ["BODY", "MIND", "SYSTEM"]) {
      await page.getByRole("button", { name: mode, exact: true }).click();
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: "instant" }),
      );
      const photo = await page.locator(".cover-portrait").boundingBox();
      const actions = await page.locator(".cover-actions").boundingBox();
      expect(photo).not.toBeNull();
      expect(actions).not.toBeNull();
      if (width < 760) {
        expect(photo!.height).toBeGreaterThanOrEqual(230);
        expect(actions!.y).toBeGreaterThanOrEqual(photo!.y + photo!.height);
        expect(actions!.y + actions!.height).toBeLessThan(844);
      }
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        ),
      ).toBeLessThanOrEqual(1);
    }
  }
});
test("social registry, contact export, QR and screenshot detail", async ({
  page,
}) => {
  await page.goto("./");
  await expect(page.locator(".social-panel.compact a")).toHaveCount(4);
  await expect(page.locator(".social-panel.expanded a")).toHaveCount(4);
  await expect(page.locator(".social-pending")).toHaveCount(0);
  for (const a of await page.locator('a[href^="http"]').all()) {
    const url = new URL((await a.getAttribute("href"))!);
    expect(url.protocol).toBe("https:");
    expect(url.hostname.length).toBeGreaterThan(3);
  }
  for (const a of await page.locator(".social-panel a").all()) {
    expect(await a.getAttribute("href")).toMatch(/^https:\/\//);
    expect(await a.getAttribute("rel")).toContain("noopener");
  }
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Сохранить контакт · vCard" }).click();
  expect((await download).suggestedFilename()).toBe("pavel-markov.vcf");
  await page.getByRole("button", { name: "Показать QR" }).click();
  await expect(page.locator(".contact-qr")).toHaveAttribute(
    "src",
    /^data:image\/png;base64,/,
  );
  await page.getByRole("button", { name: "Скрыть QR", exact: true }).click();
  await expect(page.locator(".contact-qr")).toHaveCount(0);
  const capture = page.locator(".product-capture").first();
  await capture.getByRole("button", { name: "Результат расчёта" }).click();
  await expect(capture.locator("img")).toHaveAttribute("src", /made-result/);
  await page.locator("#next").scrollIntoViewIfNeeded();
  await page.locator(".answer-list>button").first().click();
  await expect(page.locator(".instant-preview")).toContainText("MARKOVGYM");
});
test("contact remains usable with a short mobile visual area", async ({
  page,
}) => {
  await page.goto("./");
  await viewport(page, 390, 844);
  await page
    .getByRole("button", { name: "Связаться с Павлом", exact: true })
    .click();
  await viewport(page, 390, 450);
  const dialog = page.getByRole("dialog");
  const box = await dialog.boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(451);
  await dialog.getByRole("link", { name: "Telegram", exact: true }).focus();
  await expect(
    dialog.getByRole("link", { name: "Telegram", exact: true }),
  ).toBeFocused();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});
test("past saved dates survive reload until explicitly rescheduled", async ({
  page,
}) => {
  await page.addInitScript(
    (input) =>
      localStorage.setItem(
        "pm-next-v2",
        JSON.stringify({ version: 2, input, complete: true }),
      ),
    { ...defaults, start: "2020-01-01" },
  );
  await page.goto("./");
  await page.locator("#next").scrollIntoViewIfNeeded();
  await expect(page.locator(".stale-plan")).toBeVisible();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("pm-next-v2")!).input.start,
    ),
  ).toBe("2020-01-01");
  await page.getByRole("button", { name: "Начать с сегодняшнего дня" }).click();
  await expect(page.locator(".stale-plan")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("pm-next-v2")!).input.start,
    ),
  ).not.toBe("2020-01-01");
});
test("share uses URL copy fallback and user cancellation stays quiet", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      value: undefined,
      configurable: true,
    });
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async (text: string) => {
          (window as unknown as { copied: string }).copied = text;
        },
      },
      configurable: true,
    });
  });
  await page.goto("./");
  await page.getByRole("button", { name: "Поделиться", exact: true }).click();
  expect(
    await page.evaluate(() => (window as unknown as { copied: string }).copied),
  ).toBe("https://castefeudal.github.io/tapme/");
  await page.evaluate(() => {
    Object.defineProperty(navigator, "share", {
      value: async () => {
        throw new DOMException("cancel", "AbortError");
      },
      configurable: true,
    });
    (window as unknown as { copied: string }).copied = "";
  });
  await page.getByRole("button", { name: "Поделиться", exact: true }).click();
  expect(
    await page.evaluate(() => (window as unknown as { copied: string }).copied),
  ).toBe("");
});
