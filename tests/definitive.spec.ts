import { test, expect } from "@playwright/test";
test("product captures scroll by keyboard and return to the top on a new frame", async ({
  page,
}) => {
  await page.goto("./");
  const figure = page.locator(".product-scenes").first();
  const frame = figure.locator(".capture-viewport");
  await frame.scrollIntoViewIfNeeded();
  await frame.focus();
  await frame.press("ArrowDown");
  await expect
    .poll(() => frame.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(0);
  await figure.locator(".capture-controls button").nth(1).click();
  await expect(
    figure.locator(".capture-controls button").nth(1),
  ).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => frame.evaluate((el) => el.scrollTop)).toBe(0);
});
test("three chapters follow person, work and useful action", async ({
  page,
}) => {
  await page.goto("./");
  await expect(page.locator("main")).toBeVisible();
  const order = await page.evaluate(() =>
    [...document.querySelector("main")!.children].map((el) => el.id),
  );
  expect(order).toEqual(["person", "proof", "work", "next", "together"]);
  await expect(page.locator(".product-steps li")).toHaveCount(9);
});
test("a basic plan takes two choices, survives reload and can be refined", async ({
  page,
}, info) => {
  await page.goto("./");
  await page.locator("#next").scrollIntoViewIfNeeded();
  await page.locator(".answer-list>button").nth(1).click();
  await page.locator(".answer-list>button").nth(2).click();
  await page.getByRole("button", { name: "Сохранить базовый план" }).click();
  await expect(page.locator(".basic-plan-note")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const card = document
          .querySelector(".action-document")!
          .getBoundingClientRect();
        const header = document
          .querySelector(".site-header")!
          .getBoundingClientRect();
        return card.top >= header.bottom && card.top < innerHeight / 2;
      }),
    )
    .toBe(true);
  if (info.project.name === "chromium") {
    const style = await page.addStyleTag({
      content: ".site-header{position:static}",
    });
    await page
      .locator(".action-document")
      .screenshot({ path: "docs/evidence/quick-action-card.png" });
    await style.evaluate((el) => el.remove());
  }
  await expect(page.locator(".action-document")).toContainText(
    "Препятствие пока не выбрано",
  );
  const file = page.waitForEvent("download");
  await page.getByRole("button", { name: "В календарь .ics" }).click();
  expect((await file).suggestedFilename()).toBe("markov-next-move.ics");
  await page.reload();
  await page.locator("#next").scrollIntoViewIfNeeded();
  await expect(page.locator(".basic-plan-note")).toBeVisible();
  await page.getByRole("button", { name: "Изменить ответы" }).click();
  await expect(
    page.getByRole("heading", { name: "Что мешает больше всего?" }),
  ).toBeInViewport({ ratio: 1 });
  await page.locator(".answer-list>button").nth(1).click();
  await page.getByRole("button", { name: "Собрать мой план" }).click();
  await expect(page.locator(".basic-plan-note")).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate(
        () => JSON.parse(localStorage.getItem("pm-next-v2")!).input.quick,
      ),
    )
    .toBe(false);
});
