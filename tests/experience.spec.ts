import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("route, calculator, contacts and preferences", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("./");
  const panel = page.locator(".route-panel");
  await panel.getByRole("button", { name: "03 Работа и проекты" }).click();
  await panel
    .getByRole("button", { name: "02 Разобраться с задачами" })
    .click();
  await panel.getByRole("button", { name: "02 Сложно найти время" }).click();
  await panel.getByRole("button", { name: "02 25 минут" }).click();
  await expect(panel.getByRole("link", { name: "PMWORK" })).toHaveAttribute(
    "href",
    "https://castefeudal.github.io/pmwork/",
  );
  await expect(panel).toContainText("Оставь одну задачу в работе.");
  await page.getByRole("button", { name: "Превратить это в план" }).click();
  await expect(page.locator(".generated-plan")).toContainText("8 ч всего");
  await page
    .getByRole("button", { name: "Связаться с Павлом", exact: true })
    .click();
  const modal = page.getByRole("dialog");
  await modal.getByRole("combobox").selectOption("3");
  await expect(modal.getByRole("link", { name: "WhatsApp" })).toHaveAttribute(
    "href",
    /text=.*%/,
  );
  await page.keyboard.press("Escape");
  await expect(modal).not.toBeVisible();
  await page.getByRole("button", { name: "Switch to English" }).click();
  await page.getByRole("button", { name: "Change theme" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Body.");
  expect(errors).toEqual([]);
});
test("responsive widths and language/theme accessibility", async ({ page }) => {
  await page.goto("./");
  await page.evaluate(() => document.fonts.ready);
  for (const width of [320, 360, 375, 390, 430, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= screen.width,
      ),
      `overflow at ${width}`,
    ).toBe(true);
  }
  for (const lang of ["ru", "en"]) {
    if (lang === "en")
      await page.getByRole("button", { name: "Switch to English" }).click();
    for (const width of [320, 360, 375, 390, 430, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= screen.width,
        ),
        `${lang} at ${width}`,
      ).toBe(true);
    }
    for (const theme of ["dark", "light"]) {
      if (theme === "light")
        await page
          .getByRole("button", {
            name: lang === "ru" ? "Сменить тему" : "Change theme",
          })
          .click();
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(axe.violations).toEqual([]);
    }
    if (lang === "ru")
      await page.getByRole("button", { name: "Сменить тему" }).click();
  }
});

test("clipboard failure and unavailable storage remain usable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage disabled");
      },
    });
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async () => {
          throw new Error("Clipboard denied");
        },
      },
    });
  });
  await page.goto("./");
  await page.getByRole("button", { name: "Превратить это в план" }).click();
  await page.getByRole("button", { name: "Скопировать план" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Не удалось скопировать",
  );
  await page
    .getByRole("button", { name: "Связаться с Павлом", exact: true })
    .click();
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
test("mobile menu, no-media fallback and keyboard modal", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.route("**/media/*", (r) => r.abort());
  await page.goto("./");
  await page.getByRole("button", { name: "Меню", exact: true }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Проекты", exact: true })
    .click();
  await expect(page.getByRole("navigation")).not.toBeVisible();
  await page
    .getByRole("button", { name: "Связаться с Павлом", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= screen.width,
    ),
  ).toBe(true);
});
