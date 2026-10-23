import { test, expect } from "@playwright/test";
import { defaults } from "../src/lib/plan";
import { routes } from "../src/config/routes";
test("a failed planner module leaves the portfolio and recovery action available", async ({
  page,
}) => {
  await page.route("**/assets/NextMove-*.js", (route) => route.abort());
  await page.goto("./");
  await page.locator("#next").scrollIntoViewIfNeeded();
  await expect(page.getByRole("alert")).toContainText(
    "Планировщик не загрузился",
  );
  await expect(
    page.getByRole("button", { name: "Перезагрузить страницу" }),
  ).toBeVisible();
  await expect(page.locator(".cover h1")).toContainText("ПАВЕЛ");
});
test("goal preview and category changes never retain another category’s personal facts", async ({
  page,
}) => {
  await page.addInitScript(
    (input) =>
      localStorage.setItem(
        "pm-next-v2",
        JSON.stringify({ version: 2, input, complete: true }),
      ),
    {
      ...defaults,
      direction: "system",
      target: "Старый проект",
      owner: "Анна",
      cue: "После встречи",
    },
  );
  await page.goto("./");
  await page.locator("#next").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Изменить ответы" }).click();
  await page.locator(".answer-list>button").nth(1).click();
  await expect(page.locator(".instant-preview")).toContainText(
    routes.nutrition.goals[0].today[0],
  );
  await page.locator(".answer-list>button").nth(2).click();
  await expect(page.locator(".instant-preview")).toContainText(
    routes.nutrition.goals[2].today[0],
  );
  await page.locator(".answer-list>button").first().click();
  await page.getByRole("button", { name: "Собрать мой план" }).click();
  await expect(page.locator(".action-document h3")).toHaveText(
    routes.nutrition.goals[2].name[0],
  );
  const saved = await page.evaluate(
    () => JSON.parse(localStorage.getItem("pm-next-v2")!).input,
  );
  expect(saved.target).toBe("");
  expect(saved.owner).toBe("");
  expect(saved.cue).toBe("");
});
test("two clear audience paths and actual product states", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("link", { name: /Для работы/ })).toHaveAttribute(
    "href",
    "#work-pm",
  );
  await expect(page.getByRole("link", { name: /Для себя/ })).toHaveAttribute(
    "href",
    "#work-made",
  );
  for (const figure of await page.locator(".product-scenes").all()) {
    const first = await figure.locator("img").getAttribute("src");
    await figure.locator(".capture-controls button").nth(1).click();
    expect(await figure.locator("img").getAttribute("src")).not.toBe(first);
    await expect(
      figure.locator(".capture-controls button").nth(1),
    ).toHaveAttribute("aria-pressed", "true");
  }
  await expect(page.locator(".social-pending")).toHaveCount(0);
});
