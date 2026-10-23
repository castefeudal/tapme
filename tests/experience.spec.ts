import { viewport, settle } from "./support";
import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
async function makePlan(page: Page, branch = 0) {
  await page.locator("#next").scrollIntoViewIfNeeded();
  const panel = page.locator(".move-workspace");
  for (let k = 0; k < 3; k++)
    await panel
      .locator(".answer-list>button")
      .nth(k === 0 ? branch : 1)
      .click();
  await panel
    .getByRole("button", { name: /Собрать мой план|Build my plan/ })
    .click();
  return panel;
}
test("signature portrait modes use real photos", async ({ page }) => {
  await page.goto("./");
  const cover = page.locator(".cover");
  for (const [side, file] of [
    ["BODY", "fitness"],
    ["SYSTEM", "portrait-editorial"],
    ["MIND", "hero-portrait"],
  ]) {
    await cover.getByRole("button", { name: side, exact: true }).click();
    await expect(
      cover.getByRole("button", { name: side, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(cover.locator("img")).toHaveAttribute("src", new RegExp(file));
    await expect(cover.getByRole("heading", { level: 1 })).toContainText(
      "ПАВЕЛ",
    );
  }
  await expect(
    cover.getByRole("link", { name: "Составить план на неделю" }),
  ).toHaveAttribute("href", "#next");
});
for (let branch = 0; branch < 4; branch++)
  test(`branch ${branch}: plan, exports, contact and reload`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("./");
    const panel = await makePlan(page, branch);
    await expect(panel.locator(".action-document")).toBeVisible();
    await expect(panel.locator(".session-dates>span")).toHaveCount(3);
    await panel.locator(".capacity-details summary").click();
    await expect(panel.locator(".time-total")).toContainText("1");
    if (branch === 2)
      await expect(panel.locator(".action-brief")).toContainText(
        "Не согласован",
      );
    if (branch === 3) await expect(panel.locator(".cue-line")).toBeVisible();
    const download = page.waitForEvent("download");
    await panel.getByRole("button", { name: "В календарь .ics" }).click();
    expect((await download).suggestedFilename()).toBe("markov-next-move.ics");
    const png = page.waitForEvent("download");
    await panel.getByRole("button", { name: "Сохранить PNG" }).click();
    const image = await png;
    expect(image.suggestedFilename()).toBe("markov-next-move.png");
    expect(await image.failure()).toBe(null);
    await panel.getByRole("button", { name: "Обсудить с Павлом" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("textbox")).toHaveValue(/МОЙ СЛЕДУЮЩИЙ ШАГ/);
    const href = await dialog
      .getByRole("link", { name: "WhatsApp" })
      .getAttribute("href");
    expect(decodeURIComponent(href || "")).toContain(
      "text=Павел, хочу обсудить",
    );
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await page.reload();
    await page.locator("#next").scrollIntoViewIfNeeded();
    await expect(page.locator(".action-document")).toBeVisible();
    await page.getByRole("button", { name: "Switch to English" }).click();
    await page.getByRole("button", { name: "Change theme" }).click();
    await page.reload();
    await page.locator("#next").scrollIntoViewIfNeeded();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.locator(".action-document")).toContainText("START TODAY");
    expect(errors).toEqual([]);
  });
test("actual viewport bounds, targets and bilingual accessibility", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.goto("./");
  await page.evaluate(() => document.fonts.ready);
  for (const lang of ["ru", "en"]) {
    if (lang === "en")
      await page.getByRole("button", { name: "Switch to English" }).click();
    for (const width of [320, 360, 375, 390, 430, 768, 1024, 1440, 1920]) {
      await viewport(page, width, 900);
      const bounds = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
        visual: visualViewport?.width,
      }));
      expect(
        bounds.scroll,
        `${lang} ${width}: ${JSON.stringify(bounds)}`,
      ).toBeLessThanOrEqual(bounds.viewport + 1);
      const composition = await page.evaluate(() => {
        const photo = document
          .querySelector(".cover-portrait")!
          .getBoundingClientRect();
        const links = [...document.querySelectorAll(".cover-actions a")];
        return links.map((el) => {
          const r = el.getBoundingClientRect();
          return {
            text: el.textContent,
            visible:
              r.width > 0 &&
              r.height > 0 &&
              r.left >= -1 &&
              r.right <= document.documentElement.clientWidth + 1,
            overlap:
              Math.max(
                0,
                Math.min(r.right, photo.right) - Math.max(r.left, photo.left),
              ) *
              Math.max(
                0,
                Math.min(r.bottom, photo.bottom) - Math.max(r.top, photo.top),
              ),
          };
        });
      });
      expect(
        composition.every((item) => item.visible && item.overlap < 1),
        `${lang}/${width}: ${JSON.stringify(composition)}`,
      ).toBe(true);
      const issues = await page
        .locator(
          ".answer-list>button,.day-selector button,.side-switch button,.nav-controls button",
        )
        .evaluateAll((els) =>
          els
            .filter((el) => {
              const r = el.getBoundingClientRect();
              return r.height > 0 && r.height < 43;
            })
            .map((el) => el.textContent),
        );
      expect(issues).toEqual([]);
    }
    for (const theme of ["dark", "light"]) {
      if (theme === "light")
        await page
          .getByRole("button", {
            name: lang === "ru" ? "Сменить тему" : "Change theme",
          })
          .click();
      await viewport(page, 390, 844);
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
    }
    if (lang === "ru")
      await page.getByRole("button", { name: "Сменить тему" }).click();
  }
});
test("expanded result and modal keyboard accessibility", async ({ page }) => {
  await page.goto("./");
  await makePlan(page, 2);
  await page.locator(".service-accordion summary").first().click();
  await page.locator(".action-document .ink").focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});
test("mobile menu, missing media, storage and clipboard failure", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw Error("disabled");
      },
    });
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async () => {
          throw Error("denied");
        },
      },
    });
  });
  await page.route("**/media/*", (r) => r.abort());
  await page.goto("./");
  await viewport(page, 320, 800);
  await page.getByRole("button", { name: "Меню", exact: true }).click();
  await page
    .getByRole("navigation", { name: "Главная навигация" })
    .getByRole("link", { name: "Проекты", exact: true })
    .click();
  await expect(
    page.getByRole("navigation", { name: "Главная навигация" }),
  ).not.toBeVisible();
  await expect(page.locator(".cover .media-fallback")).toBeVisible();
  await makePlan(page);
  await page
    .getByRole("button", { name: "Скопировать план", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Не удалось скопировать",
  );
  await page.getByRole("button", { name: "Очистить локальные данные" }).click();
  await expect(page.locator(".answer-list")).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
});
test("old preferences and clearing data", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "pm-route",
      JSON.stringify({ direction: "work", goal: 1, barrier: 1, time: 1 }),
    ),
  );
  await page.goto("./");
  await page.locator("#next").scrollIntoViewIfNeeded();
  await page.locator(".answer-list>button").nth(2).click();
  await expect(page.locator(".question-meta")).toContainText("SYSTEM");
  await page.getByRole("button", { name: "Очистить локальные данные" }).click();
  await expect(page.locator(".answer-list")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("pm-route"))).toBe(
    null,
  );
});
