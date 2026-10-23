import { describe, it, expect } from "vitest";
import { defaults, selectDirection, buildPlan } from "./plan";
describe("category transitions", () => {
  it("clears only category-specific answers when choosing another area", () => {
    const old = {
      ...defaults,
      direction: "system" as const,
      goal: 3,
      barrier: 2,
      target: "Мой проект",
      owner: "Анна",
      cue: "После встречи",
      minutes: 10,
    };
    const next = selectDirection(old, "nutrition");
    expect(next).toEqual({
      ...old,
      direction: "nutrition",
      goal: 0,
      barrier: 0,
      target: "",
      owner: "",
      cue: "",
    });
    expect(buildPlan(next, "ru").title).not.toBe("Мой проект");
    expect(old.target).toBe("Мой проект");
  });
  it("retains the existing answers when revisiting the same category", () => {
    const input = { ...defaults, goal: 2, target: "Моя цель" };
    expect(selectDirection(input, "body")).toBe(input);
  });
});
