import { expect, test } from "vitest";
import {
  defaults,
  buildPlan,
  validInput,
  planText,
  selectDirection,
} from "./plan";
test("basic plans label unselected constraints in the document and copied export", () => {
  const input = { ...defaults, quick: true };
  const plan = buildPlan(input, "ru");
  expect(plan.obstacle).toContain("Препятствие пока не выбрано");
  expect(plan.why).toContain("не уточнено");
  expect(planText(plan, input, "ru")).toContain("МОЙ БАЗОВЫЙ ПЛАН");
  expect(buildPlan(input, "en").why).toContain(
    "no constraint has been selected",
  );
});
test("quick mode is a compatible optional field and resets across categories", () => {
  expect(validInput(defaults)).toBe(true);
  expect(validInput({ ...defaults, quick: true })).toBe(true);
  expect(validInput({ ...defaults, quick: "yes" })).toBe(false);
  expect(selectDirection({ ...defaults, quick: true }, "system").quick).toBe(
    false,
  );
});
